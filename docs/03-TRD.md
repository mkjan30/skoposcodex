# Technical Requirements Document (TRD)

**Project:** Skopos Codex · v0.1 · 2026-10-21

---

## 1. Reference stack (observed on rankesprit.com)

Next.js App Router (RSC streaming), Tailwind CSS, shadcn/ui tokens (HSL CSS variables), lucide-react icons, `next/font` with **Inter** (body) and **Exo** (display). Dynamic OG image route (`/opengraph-image`). No visible backend for forms.

We keep the same frontend stack so the replica is faithful, and add a small backend.

## 2. Stack

| Layer           | Choice                                                                              | Why                                                                  |
| --------------- | ----------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| Framework       | **Next.js 15** (App Router, TypeScript, React 19)                                   | Matches reference; SSG + server actions                              |
| Styling         | **Tailwind CSS v4** + **shadcn/ui**                                                 | Matches reference tokens/components                                  |
| Icons           | `lucide-react`                                                                      | Matches reference                                                    |
| Motion          | CSS transitions + `IntersectionObserver` (`useInViewOnce`)                          | No animation library: keeps shared JS small; respects reduced motion |
| Forms           | Native forms + React 19 `useActionState` + `zod` (server)                           | Works without JS; one schema on the server; no form library needed   |
| Database        | **Supabase Postgres**                                                               | Managed Postgres + auth + storage in one                             |
| File storage    | Supabase Storage (private bucket, signed upload/download URLs)                      | Direct-from-browser uploads                                          |
| Auth (admin)    | Supabase Auth magic link + allow-list                                               | No passwords to manage                                               |
| Email           | **Resend** REST API via `fetch` + plain HTML/text templates                         | Transactional email; no SDK for a few emails                         |
| Spam            | Cloudflare Turnstile + honeypot + rate limit (Postgres `hit_rate_limit()` function) |                                                                      |
| Analytics       | Vercel Analytics + GA4 (consent-gated)                                              |                                                                      |
| Hosting         | **Vercel** (prod from `main`, previews per PR)                                      | Native Next.js                                                       |
| Repo            | GitHub `mkjan30/skoposcodex`                                                        |                                                                      |
| CI              | GitHub Actions: lint, typecheck, test, build                                        |                                                                      |
| Testing         | Vitest (units), Playwright (e2e, a11y via axe)                                      |                                                                      |
| Package manager | pnpm                                                                                |                                                                      |

## 3. Architecture

```
Browser
  │  static HTML (SSG) for marketing pages
  │  server actions for forms
  ▼
Vercel (Next.js)
  ├─ app/(marketing)/*      → SSG, revalidate on deploy
  ├─ app/onboard            → client wizard
  ├─ app/admin/*            → dynamic, auth-gated (middleware)
  ├─ server actions         → zod validate → Supabase (service role) → Resend
  └─ app/opengraph-image    → dynamic OG
        │
        ├──► Supabase Postgres (leads, onboarding_submissions, files, notes)
        ├──► Supabase Storage  bucket: onboarding-files (private)
        └──► Resend (admin notify, client receipt)
```

## 4. Project structure

```
src/
  app/
    (marketing)/
      page.tsx                    # home
      services/[slug]/page.tsx    # generateStaticParams from content/services
      process/page.tsx
      why-us/page.tsx
      contact/page.tsx
      privacy/page.tsx
      terms/page.tsx
      layout.tsx                  # header + footer
    (marketing)/onboard/page.tsx   # inside marketing group so it gets header/footer
    admin/
      layout.tsx  page.tsx  leads/[id]/page.tsx  onboarding/[id]/page.tsx
    api/upload-url/route.ts       # issues signed upload URLs
    actions/contact.ts
    actions/onboarding.ts
    sitemap.ts  robots.ts  opengraph-image.tsx  not-found.tsx
  components/
    ui/                           # shadcn primitives
    sections/                     # Hero, ServicesGrid, Ticker, Counters, FAQ, CTA...
    onboarding/                   # Wizard, StepIndicator, fields, FileDrop
  content/
    site.ts                       # brand, nav, footer, contact info
    services/*.ts                 # one typed object per service
    process.ts  why-us.ts  home.ts
  lib/
    schemas/contact.ts            # zod (+ contact.test.ts)
    schemas/onboarding.ts         # zod, discriminated by service
    supabase/server.ts            # service-role client (server-only)
    security.ts                   # client IP, IP hashing, rate limit, Turnstile verify
    email.ts  emails/*.ts         # Resend sender + templates
supabase/
  migrations/*.sql
```

All marketing copy lives in `src/content/*` so pages are pure layout and copy changes don't touch components.

## 5. Rendering & data

| Route              | Rendering                                                     |
| ------------------ | ------------------------------------------------------------- |
| Marketing pages    | Static (SSG)                                                  |
| `/services/[slug]` | `generateStaticParams` from content files; unknown slug → 404 |
| `/onboard`         | Static shell + client component                               |
| `/admin/*`         | Dynamic, `noindex`, middleware-protected                      |

## 6. Forms — server contract

### Contact (`actions/contact.ts`)

1. Honeypot filled → return fake success, save nothing.
2. Verify Turnstile token.
3. `contactSchema.safeParse` (trim, control chars, max lengths, email format, enum service) — before the rate limit, so invalid input costs no DB write.
4. Rate-limit by salted IP hash (5/hour) via `hit_rate_limit()`.
5. Insert into `leads` (with `source_page`, `utm_*` from it, `user_agent`).
6. Send admin + visitor emails (failures logged, not fatal).
7. Return `ContactState`: `success` with first name, or `error` with `fieldErrors` / `message`, the submitted `values` and an `attempt` counter (keys the fields so they remount with the user's input after React's post-action form reset).

### Upload URL (`api/upload-url`)

- Input: `submissionId` (uuid), `slot`, `filename`, `size`, `mime`.
- Validate mime allow-list and size ≤ 25 MB; path = `onboarding/{submissionId}/{slot}/{uuid}-{safeName}`.
- Return `createSignedUploadUrl` token. Rate-limited.

### Onboarding (`actions/onboarding.ts`)

1. Turnstile + rate limit.
2. `onboardingSchema.parse` — discriminated union on `service`.
3. Upsert `onboarding_submissions` by client `submissionId` (idempotent).
4. Insert `onboarding_files` rows for uploaded paths (verify each object exists and is under the submission prefix).
5. Notify admin + receipt to client.

## 7. Security

- Service-role key only on the server; anon key never writes.
- RLS enabled on all tables: no public access; admin reads via `is_admin()` policy (allow-listed emails table).
- Storage bucket private; downloads via 10-min signed URLs from admin pages only.
- CSP headers (self + Turnstile + analytics), `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`.
- No credentials collected in forms (see PRD FR-20).
- IPs stored only as salted SHA-256 hash.
- Retention: leads 24 months, onboarding files deleted 90 days after `status = archived`.

## 8. Environment variables

| Name                             | Scope             |
| -------------------------------- | ----------------- |
| `NEXT_PUBLIC_SITE_URL`           | public            |
| `NEXT_PUBLIC_SUPABASE_URL`       | public            |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY`  | public            |
| `SUPABASE_SERVICE_ROLE_KEY`      | server            |
| `RESEND_API_KEY`                 | server            |
| `EMAIL_FROM`, `EMAIL_ADMIN_TO`   | server            |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | public            |
| `TURNSTILE_SECRET_KEY`           | server            |
| `IP_HASH_SALT`                   | server            |
| `NEXT_PUBLIC_GA_ID`              | public            |
| `NEXT_PUBLIC_BOOKING_URL`        | public (optional) |

Committed as `.env.example`; real values in Vercel + local `.env.local` (git-ignored).

## 9. Performance budget

- JS on marketing pages ≤ 120 KB gz; wizard chunk lazy-loaded on `/onboard` only.
- Fonts self-hosted via `next/font`, `display: swap`, subset latin.
- Images via `next/image`, AVIF/WebP, explicit sizes.
- No layout shift from counters (fixed-width tabular numerals).

## 10. SEO

- `generateMetadata` per page; canonical URLs; OG image per page.
- JSON-LD: `Organization` (layout), `Service` (service pages), `FAQPage` (pages with FAQ), `BreadcrumbList`.
- `sitemap.ts` from content; `robots.ts` disallows `/admin`, `/onboard`.

## 11. Quality gates (CI)

`pnpm lint` · `pnpm typecheck` · `pnpm test` (Vitest: zod schemas, rate limiter) · `pnpm build` · Playwright smoke on preview: every route 200, contact happy path, wizard happy path, axe no serious violations.

## 12. Git workflow

- `main` = production. Feature branches `feat/*`, PR → preview deploy → merge.
- Conventional commits. Docs live in `/docs` and are updated in the same PR as the change they describe.

# Implementation Plan

**Project:** Skopos Codex · v0.1 · 2026-10-21
**Repo:** https://github.com/mkjan30/skoposcodex · **Local:** `~/Desktop/º/Claude Projects/Skopos Codex`

---

## 0. Inputs needed before Phase 2

| Item                                                                                    | Owner | Status |
| --------------------------------------------------------------------------------------- | ----- | ------ |
| Final brand name, logo (SVG), favicon                                                   | You   | ☑      |
| Confirm the "few changes" list (PRD §7)                                                 | You   | ☐      |
| Real contact email, phone, location, social URLs                                        | You   | ☐      |
| Real stats, testimonials, case study (or approval to ship placeholders as clearly fake) | You   | ☐      |
| Domain + DNS access                                                                     | You   | ☐      |
| Accounts: Vercel, Supabase, Resend, Cloudflare (Turnstile)                              | You   | ☐      |

## Phase 1 — Foundation (day 1–2)

- [x] `pnpm create next-app` (TS, App Router, Tailwind, ESLint, `src/`)
- [x] shadcn/ui init; add Button, Accordion, Input, Textarea, Select, Dialog, Sheet, Progress, Toast, Table, Badge
- [x] `next/font`: Inter + Exo; design tokens in `globals.css` (Design Brief §2–4)
- [x] `src/content/site.ts` (brand, nav, footer, contact)
- [x] Header (desktop dropdown + mobile sheet), Footer, marketing layout
- [x] `.env.example`, `.gitignore`, Prettier, GitHub Actions CI (lint, typecheck, build)
- [x] Connect repo to Vercel → project `skoposcodex`, auto-deploys from `main`; live at https://skoposcodex.com (www → bare domain, 301)

**Done when:** empty pages render with header/footer on a Vercel preview; CI green.

## Phase 2 — Shared sections (day 3–4)

- [x] Section primitives: `SectionHeader` (eyebrow/H2/sub), `CtaBand`, `FaqAccordion`, `StatCounter` (SSR value + count-up), `StepCard`, `ServiceCard`, `Ticker`, `ComparisonTable`, `TestimonialCard`, `DashboardCard`
- [x] Reveal-on-scroll wrapper with reduced-motion support
- [x] Dev-only catalogue at `/dev/sections` (404 in production)
- [x] Vitest set up (`pnpm test`, runs in CI)

**Done when:** each section renders in isolation with sample content.

## Phase 3 — Marketing pages (day 5–8)

- [x] Home (`content/home.ts`)
- [x] Service template `services/[slug]` + 5 content files (rewritten copy, single timeline source)
- [x] Process
- [x] Why Us
- [x] Privacy, Terms, 404
- [x] Metadata, OG image, JSON-LD, `sitemap.ts`, `robots.ts`

Measured on a local production build (Lighthouse 12, simulated mobile, 2026-10-21): Performance 94–96, Accessibility 100, Best Practices 100, SEO 100 on Home, Local SEO, Process, Why Us and Privacy. CLS 0. LCP 2.8–3.1 s; the PRD target is < 2.0 s, which is a Phase 7 item.

**Done when:** all marketing routes match the reference structure on desktop + mobile; no `#` links; Lighthouse ≥ 90 on preview.

## Phase 4 — Backend + Contact (day 9–10)

- [x] Migrations `0001_init`, `0002_storage` (Backend Schema §3–6) — validated against PGlite (constraints, citext, rate limiter, `is_admin()`, bucket)
- [x] `lib/supabase/server.ts`, rate limiter, Turnstile verify, IP hashing (`lib/security.ts`)
- [x] `contactSchema` (zod) + tests; server action + tests (honeypot, spam check, rate limit, field errors, email failure, DB failure)
- [x] Contact page + server action; `?service=` preselect
- [x] Resend: admin notification + visitor confirmation templates
- [x] Accounts connected on Vercel (Production): Supabase (integration), Resend (domain verified, sends as info@skoposcodex.com), Turnstile (real keys), IP_HASH_SALT
- [x] Migrations `0001`, `0002` run in Supabase (2026-10-22); public read/insert on `leads` confirmed blocked
- [x] `0003_lock_rate_limit_fn.sql` run; anon call to `hit_rate_limit()` now returns 401 permission denied
- [x] Live test lead (2026-10-22): success screen, row in `leads`, lead email delivered to Gmail via info@skoposcodex.com
- [ ] Visitor confirmation email not yet checked (test used a made-up address) — confirm with a real address or in Resend → Emails

Tested locally without Supabase: field errors, focus management, input kept after errors (including the service select), Turnstile token refresh between attempts, generic error when the database is unreachable.

**Done when:** a real submission lands in `leads`, both emails arrive, spam/rate-limit paths tested.

## Phase 5 — Onboarding wizard (day 11–15)

- [x] Field catalogue (`src/content/onboarding/`) drives UI, client validation and server validation from one config (`src/lib/onboarding/schema.ts`) + tests
- [x] Wizard shell: step indicator (completed steps clickable), progress, Back/Continue (sticky on mobile), per-step validation, focus moves to first error / step heading
- [x] Field renderers: text, email, tel, url, textarea, select, radio pills, checkbox pills (with max)
- [x] localStorage autosave + "continue where I left off"; switching service confirms and clears service-specific answers/files
- [x] `api/upload-url` (signed upload URLs, allow-list, 25 MB, rate-limited) + FileDrop with progress, retry, type/size/count checks
- [x] Review step with Edit links; idempotent submit (client UUID, insert-ignore); thank-you screen; admin + client emails
- [x] Access-grant instructions in step 5 (invite info@skoposcodex.com — never passwords)
- [ ] ⏳ Live test from a real browser: upload a file and submit (Turnstile blocks automated browsers; uploads need production Supabase)

Verified locally (no Supabase): validation and error focus on every step, review/edit/jump-back, resume after reload, service-switch dialog, upload type/size checks and graceful upload/submit failures. `/onboard` ships ~116 kB route JS (zod + catalogue); acceptable for a noindex page reached by link.

**Done when:** each of the 5 service paths can be completed end-to-end on mobile and desktop, files land in the private bucket, row + files appear in DB.

## Phase 6 — Admin (day 16–17)

- [ ] Magic-link login, middleware guard, `admins` allow-list
- [ ] Leads table (status, search, filter, CSV export) + detail with notes
- [ ] Onboarding table + detail (answers by step, signed file downloads, status)

**Done when:** a non-admin email is refused; admin can move a lead through statuses and download files.

## Phase 7 — QA & launch (day 18–20)

- [ ] Playwright: route smoke, contact, wizard (×5 services), admin auth
- [ ] axe a11y pass; keyboard-only run of wizard
- [ ] Cross-browser (Chrome, Safari iOS, Firefox, Edge)
- [ ] Analytics + consent banner; conversion events (App Flow §5)
- [ ] Content proofread; replace every `TODO(launch)` placeholder (`grep -rn "TODO(launch)" src`): stats, case studies, testimonials, home dashboard figures, retention figure; legal review of Privacy/Terms
- [ ] Bring LCP under 2.0 s (font loading / hero render path)
- [x] Domain + SSL on Vercel: skoposcodex.com primary, www → bare 301
- [ ] Resend domain verification (SPF/DKIM)
- [ ] Submit sitemap to Google Search Console

**Done when:** PRD §9 success criteria all pass on production.

## Post-launch backlog

- Blog / case studies via MDX
- Client reporting portal
- Booking integration inside the success state (Cal.com embed)
- A/B tests on hero copy and CTA labels

## Timeline summary

| Phase               | Days | Cumulative |
| ------------------- | ---- | ---------- |
| 1 Foundation        | 2    | 2          |
| 2 Sections          | 2    | 4          |
| 3 Pages             | 4    | 8          |
| 4 Backend + Contact | 2    | 10         |
| 5 Onboarding        | 5    | 15         |
| 6 Admin             | 2    | 17         |
| 7 QA & Launch       | 3    | 20         |

≈ 4 working weeks for one developer with Claude Code.

## Working agreement

- Local folder and GitHub stay in sync: every unit of work is committed and pushed to `mkjan30/skoposcodex`.
- Feature work on branches, merged to `main` via PR (preview deploy per PR).
- Docs in `/docs` are updated in the same commit as the change they describe.

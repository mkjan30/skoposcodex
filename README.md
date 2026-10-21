# Skopos Codex

Marketing agency website modelled on [rankesprit.com](https://rankesprit.com), with the changes listed in the PRD.

## Docs

1. [Product Requirements (PRD)](docs/01-PRD.md)
2. [App Flow](docs/02-App-Flow.md)
3. [Technical Requirements (TRD)](docs/03-TRD.md)
4. [UI/UX Design Brief](docs/04-UI-UX-Design-Brief.md)
5. [Backend Schema](docs/05-Backend-Schema.md)
6. [Implementation Plan](docs/06-Implementation-Plan.md)

## Stack

Next.js 15 · TypeScript · Tailwind + shadcn/ui · Supabase · Resend · Vercel

## Setup

```bash
pnpm install
cp .env.example .env.local   # then fill in the values below
pnpm dev
```

Accounts the contact form needs (Phase 4):

1. **Supabase** — create a project, then run `supabase/migrations/0001_init.sql` and `0002_storage.sql` in the SQL editor (in order). Copy the project URL, anon key and service-role key into `.env.local`. Add staff emails to the `admins` table.
2. **Resend** — verify your sending domain, create an API key, set `EMAIL_FROM` (e.g. `Skopos Codex <hello@yourdomain>`) and `EMAIL_ADMIN_TO` (where new leads go).
3. **Cloudflare Turnstile** — create a widget for your domain and use its site/secret keys. Locally you can use Cloudflare's test keys (see `.env.example`).
4. `IP_HASH_SALT` — any long random string (`openssl rand -hex 32`).

Set the same variables in Vercel → Project → Settings → Environment Variables.

## Deploy

- Vercel project **`skoposcodex`** (team "Maksud's projects") is connected to this GitHub repo: every push to `main` deploys to production; other branches get preview URLs.
- Live: **https://skoposcodex.com** (primary). `www.skoposcodex.com` 301-redirects to it (path and query kept); `http` → `https`.
- DNS is on Cloudflare (registrar: WordPress.com): `@` A → `216.198.79.1`, `64.29.17.1`; `www` CNAME → `05d61b087a62c4e4.vercel-dns-017.com`. Vercel recommends these as **DNS only** (grey cloud).
- Vercel env: `NEXT_PUBLIC_SITE_URL=https://skoposcodex.com` (canonical URLs, sitemap, OG images) and `ENABLE_EXPERIMENTAL_COREPACK=1` (builds use the pnpm version in `package.json`).

## Checks

```bash
pnpm lint && pnpm typecheck && pnpm format:check && pnpm test && pnpm build
```

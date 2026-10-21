# Implementation Plan

**Project:** Skopos Codex · v0.1 · 2026-10-21
**Repo:** https://github.com/mkjan30/skoposcodex · **Local:** `~/Desktop/º/Claude Projects/Skopos Codex`

---

## 0. Inputs needed before Phase 2

| Item                                                                                    | Owner | Status |
| --------------------------------------------------------------------------------------- | ----- | ------ |
| Final brand name, logo (SVG), favicon                                                   | You   | ☐      |
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
- [ ] ⏳ Connect repo to Vercel (needs your Vercel account) → preview deploys

**Done when:** empty pages render with header/footer on a Vercel preview; CI green.

## Phase 2 — Shared sections (day 3–4)

- [ ] Section primitives: `SectionHeader` (eyebrow/H2/sub), `CtaBand`, `FaqAccordion`, `StatCounter` (SSR value + count-up), `StepCard`, `ServiceCard`, `Ticker`, `ComparisonTable`, `TestimonialCard`, `DashboardCard`
- [ ] Reveal-on-scroll wrapper with reduced-motion support

**Done when:** each section renders in isolation with sample content.

## Phase 3 — Marketing pages (day 5–8)

- [ ] Home (`content/home.ts`)
- [ ] Service template `services/[slug]` + 5 content files (rewritten copy, single timeline source)
- [ ] Process
- [ ] Why Us
- [ ] Privacy, Terms, 404
- [ ] Metadata, OG image, JSON-LD, `sitemap.ts`, `robots.ts`

**Done when:** all marketing routes match the reference structure on desktop + mobile; no `#` links; Lighthouse ≥ 90 on preview.

## Phase 4 — Backend + Contact (day 9–10)

- [ ] Supabase project; migrations `0001_init`, `0002_storage` (Backend Schema §3–6)
- [ ] `lib/supabase/server.ts`, rate limiter, Turnstile verify
- [ ] `contactSchema` (zod) + tests
- [ ] Contact page + server action; `?service=` preselect
- [ ] Resend: admin notification + visitor confirmation templates

**Done when:** a real submission lands in `leads`, both emails arrive, spam/rate-limit paths tested.

## Phase 5 — Onboarding wizard (day 11–15)

- [ ] `onboardingSchema` — shared steps + discriminated union for 5 services + tests
- [ ] Wizard shell: step indicator, progress, Back/Continue, per-step validation, focus management
- [ ] Field renderers driven by a per-service field config (labels, types, options, required)
- [ ] localStorage autosave/resume; service-change confirm dialog
- [ ] `api/upload-url` + FileDrop with progress/retry
- [ ] Review step with Edit links; idempotent submit action; thank-you screen
- [ ] Access-grant instructions in step 5 (no credentials)

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
- [ ] Content proofread; replace/confirm placeholder stats & testimonials
- [ ] Domain + SSL on Vercel; Resend domain verification (SPF/DKIM)
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

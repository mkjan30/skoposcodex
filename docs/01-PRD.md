# Product Requirements Document (PRD)

**Project:** Skopos Codex — marketing agency website
**Reference:** https://rankesprit.com (Rank Esprit LLC)
**Version:** 0.1 (draft) · 2026-10-21

---

## 1. Summary

Build a marketing website for a digital growth agency that replicates the structure, content model and conversion paths of rankesprit.com, with the changes listed in §7. The site sells five services (Local SEO, PPC, Branding, Website Design, Funnel Building) to local and growth-stage businesses. Every page drives the visitor to one of two conversions: **book a free strategy call** (`/contact`) or **complete client onboarding** (`/onboard`).

## 2. Goals

| # | Goal | Measure |
|---|------|---------|
| G1 | Generate qualified leads | Contact form submissions / month |
| G2 | Onboard signed clients without email back-and-forth | Completed onboarding wizards; % of required data captured |
| G3 | Establish premium, data-led credibility | Time on page, scroll depth, bounce rate |
| G4 | Rank for agency + service keywords | Lighthouse SEO ≥ 95, indexed pages, CWV "good" |

## 3. Non-goals (v1)

- Client portal / reporting dashboard (login area)
- Blog / CMS-authored content
- Payments or proposals
- Multi-language

## 4. Users

| Persona | Need | Primary path |
|---------|------|--------------|
| **Local business owner** (HVAC, dental, legal, home services) | More calls and map-pack visibility; wants proof and no lock-in | Home → Service page → Contact |
| **Marketing director** | Transparent reporting, senior team | Home → Why Us → Process → Contact |
| **Newly signed client** | Hand over business info, access and assets once | Direct link → Onboard (6 steps) |
| **Agency staff (admin)** | Receive, review and act on leads and onboarding packets | Email notification → Admin view |

## 5. Scope — pages

| Route | Purpose |
|-------|---------|
| `/` | Home: hero, growth dashboard mock, value statements, services, industries ticker, process teaser, why-us, results counters, closing CTA |
| `/services/local-seo` | Service page (shared template) |
| `/services/ppc` | Service page |
| `/services/branding` | Service page |
| `/services/website-design` | Service page |
| `/services/funnel-building` | Service page |
| `/process` | 5-step method (Analyze, Strategize, Build, Optimize, Scale) with deliverables + timelines, FAQ |
| `/why-us` | Differentiators, comparison table, results, testimonials, what-you-get, CTA |
| `/contact` | Lead form, contact info, what-to-expect, FAQ |
| `/onboard` | 6-step client onboarding wizard |
| `/privacy`, `/terms` | Legal pages (missing on reference — see §7) |
| `/admin` | Protected list/detail of leads and onboarding submissions (new) |
| `404` | Branded not-found page |

## 6. Functional requirements

### 6.1 Global
- **FR-1** Sticky header: logo, Services (dropdown of 5), Process, Why Us, Onboard, "Get in touch" button. Mobile: slide-in menu.
- **FR-2** Footer: blurb, social links, Services column, Company column, "Ready to scale your business?" CTA, legal links, © year.
- **FR-3** All primary CTAs route to `/contact`; "Explore services" anchors to `#services`.
- **FR-4** Per-page SEO metadata, Open Graph image, JSON-LD (`Organization`, `ProfessionalService`, `Service`, `FAQPage`), `sitemap.xml`, `robots.txt`.

### 6.2 Home
- **FR-5** Hero with headline, subcopy, two CTAs, badge linking to `/process`.
- **FR-6** "Growth overview" dashboard card: 4 KPIs + keyword ranking rows with rank deltas.
- **FR-7** Services grid (5 cards → service pages).
- **FR-8** Infinite-scroll industries ticker (7 industries), paused for `prefers-reduced-motion`.
- **FR-9** Animated stat counters that count up on scroll into view and **render final values without JS** (reference bug: shows 0%).

### 6.3 Service page template
Eyebrow, H1, sub, 2 CTAs → 3 outcome cards → 6 deliverables + timeline → 5-step framework → 3 stats + case-study card → 6 FAQs (accordion) → closing CTA with 3 trust points → cross-sell of the other 4 services. Content lives in one typed data file per service.

### 6.4 Contact
- **FR-10** Fields: Full Name\*, Email\*, Phone, Company, Service\* (Local SEO, PPC, Website Design, Funnel Building, Branding, Not sure yet), Message\*.
- **FR-11** Client + server validation; inline errors; success state replaces form.
- **FR-12** Spam protection (honeypot + Cloudflare Turnstile) and rate limit (5/hour/IP).
- **FR-13** On submit: store lead, email admin, send confirmation email to visitor.
- **FR-14** Optional "Pick a time now" scheduling link shown on success (new).

### 6.5 Onboarding wizard
- **FR-15** Six steps: 1 Service → 2 Business → 3 Goals → 4 Details → 5 Documents → 6 Review. Progress bar with % complete.
- **FR-16** Step 1 selects the primary service; steps 4 and 5 show **service-specific** questions and upload slots (full catalogue in `05-Backend-Schema.md`).
- **FR-17** Draft auto-saved to `localStorage` so a refresh does not lose work; resumable.
- **FR-18** File uploads (logos, brand guides, screenshots, reports): ≤ 25 MB/file, ≤ 10 files, types pdf/png/jpg/svg/ai/zip/docx. Uploaded directly to private storage via signed URL.
- **FR-19** Review step shows all answers with "Edit" per section; Submit stores the submission, notifies admin, emails the client a receipt.
- **FR-20** Sensitive credentials (CMS/CRM/ad-account logins) are **not** collected as plain text — the form asks the client to grant access/invite our email instead (change from reference).

### 6.6 Admin (new)
- **FR-21** Single-role login (email magic link, allow-listed staff emails).
- **FR-22** Tables of leads and onboarding submissions with status (new / contacted / qualified / won / lost), search, filter by service, CSV export.
- **FR-23** Submission detail with answers grouped by step and signed download links for files.

## 7. Changes vs. the reference site

| Area | Reference | Ours |
|------|-----------|------|
| Brand | Rank Esprit | **Skopos Codex** branding, copy and contact details (placeholder until confirmed) |
| Stat counters | Render "0%" | SSR final values; animate only as enhancement |
| Legal | Privacy / Terms link to `#` | Real `/privacy` and `/terms` pages |
| Socials | Unlabeled `#` icons | Real URLs + `aria-label`s, or hidden until available |
| Consistency | Local SEO timeline says 4–6 and 3–6 months | Single source of truth per service |
| Case study | "Read Full Case Study" with no target | Link to a real case study or remove |
| Onboarding | Asks for logins in plain fields | Access-grant instructions instead of passwords |
| Back office | None visible | `/admin` for leads + onboarding |
| Scheduling | Strategist emails back | Optional booking link after submit |
| Contact info | 555 placeholder phone | Real phone/email |

> **Open question:** confirm the final list of changes, brand name, logo, colours and contact details. Everything above is the default plan until you say otherwise.

## 8. Non-functional requirements

- **Performance:** LCP < 2.0 s, INP < 200 ms, CLS < 0.05 on 4G mobile; Lighthouse ≥ 90 all categories.
- **Accessibility:** WCAG 2.2 AA — keyboard navigable wizard, visible focus, labelled fields, error announcements, 4.5:1 contrast, reduced-motion support.
- **Security/privacy:** HTTPS, server-side validation, private file bucket, no secrets client-side, GDPR/CCPA-style privacy policy, data deletion on request.
- **Responsiveness:** 360 px → 1920 px.
- **Browser support:** last 2 versions of Chrome, Safari, Firefox, Edge; iOS Safari 16+.

## 9. Success criteria for launch

1. All 13 routes live, responsive, Lighthouse ≥ 90.
2. Contact and onboarding submissions persist, email admin, and appear in `/admin`.
3. No broken links or `#` placeholders.
4. Analytics + conversion events firing (`lead_submitted`, `onboarding_step_completed`, `onboarding_submitted`).

## 10. Risks

| Risk | Mitigation |
|------|------------|
| Copying reference copy verbatim (copyright/SEO duplicate content) | Rewrite all copy for Skopos Codex; keep structure only |
| Onboarding is long (10–15 min) → abandonment | Autosave, progress bar, only service-relevant questions |
| Large uploads fail on mobile | Direct-to-storage signed uploads with retry |
| Fake testimonials/stats | Use real data or clearly mark as placeholders before launch |

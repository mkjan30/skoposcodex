# UI/UX Design Brief

**Project:** Skopos Codex · v0.1 · 2026-10-21

---

## 1. Direction

Premium, data-led, confident. Dark navy canvas, cyan → blue accent from the logo, big display headlines, dashboard-style proof elements. Reads like a growth-ops tool, not a brochure. Replicates the rankesprit.com look and feel, re-branded.

**Tone of voice:** direct, outcome-focused, short sentences. "We don't guess." Avoid jargon walls and hype adjectives.

## 2. Colour tokens (from the Skopos Codex logo)

The palette was switched from the reference site's orange to the logo's cyan → blue on 2026-10-21. Tokens live in `src/app/globals.css`.

| Token (CSS var)        | Hex                     | Use                                                  |
| ---------------------- | ----------------------- | ---------------------------------------------------- |
| `--background`         | `#050816`               | Page background                                      |
| `--card`               | `#0B1627`               | Cards, header, dashboard panels (logo backdrop navy) |
| `--muted` / `--accent` | `#13233A`               | Subtle fills, hover backgrounds                      |
| `--brand`              | `#19E3FF`               | Primary buttons, eyebrows, icons, links, focus ring  |
| `--brand-strong`       | `#2B8CFF`               | Gradient end for buttons and highlighted words       |
| `--brand-soft`         | `#5EB8FF`               | Taglines, secondary highlights                       |
| `--brand-glow`         | `#7AF0FF`               | Glows, chart highlights                              |
| logo deep blue         | `#0A6CFF`               | Logo mark only (see contrast note)                   |
| `--foreground`         | `#FAFAFA`               | Headings and body on dark                            |
| `--muted-foreground`   | `#9FB3C8`               | Secondary text (logo's dim blue-grey)                |
| `--border`             | `#9FB3C8` @ 14% on dark | Card borders                                         |

Gradient: `linear-gradient(90deg, #19E3FF, #2B8CFF)` for primary buttons and highlighted words in H1s.

Contrast checks (WCAG): `#19E3FF` on `#050816` 12.8:1 ✅; `#2B8CFF` vs `#050816` 6.0:1 ✅; `#9FB3C8` on `#050816` ✅. The logo's `#0A6CFF` is only 4.4:1 against dark text, so it is not used behind text — buttons end on `#2B8CFF` instead. Never put white text on `#19E3FF` (fails); buttons use `#050816` text.

## 3. Typography

| Role            | Font                | Size (desktop / mobile)           | Weight             |
| --------------- | ------------------- | --------------------------------- | ------------------ |
| Display / H1    | **Exo**             | 64–72 / 40 px, tight leading 1.05 | 700                |
| H2              | Exo                 | 44 / 32 px                        | 700                |
| H3              | Exo                 | 24 / 20 px                        | 600                |
| Eyebrow         | Inter               | 13 px, uppercase, 0.12em tracking | 600, accent colour |
| Body            | **Inter**           | 18 / 16 px, leading 1.6           | 400                |
| Small / meta    | Inter               | 14 px                             | 500                |
| Numbers (stats) | Exo, `tabular-nums` | 48–56 px                          | 700                |

## 4. Layout & spacing

- Container max 1200 px, 24 px gutters (16 px mobile).
- 8-pt spacing scale; section padding 120 px desktop / 72 px mobile.
- Grid: 12 columns desktop, 4 mobile.
- Radius: 8 px controls, 16 px cards, 24 px feature panels, full for pills.
- Elevation through borders + subtle inner glow, not heavy drop shadows.

## 5. Components

| Component              | Spec                                                                                                                                      |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| **Header**             | Transparent over hero → `--surface`/80 % + blur on scroll; 72 px tall; Services dropdown panel with icon + 1-line description per service |
| **Button / primary**   | Cyan → blue gradient, dark text, 48 px tall, arrow icon slides 4 px on hover                                                              |
| **Button / secondary** | Transparent, 1 px white/20 border, white text                                                                                             |
| **Badge / pill**       | Small rounded pill with sparkle icon, links to `/process`                                                                                 |
| **Dashboard card**     | Surface panel: 4 KPI tiles (value, label, ▲ delta in green), keyword table (keyword, rank, ±change), faux sparkline                       |
| **Service card**       | Icon in cyan-tinted square, title, 2-line copy, "Learn more →"                                                                            |
| **Industries ticker**  | Infinite horizontal marquee, pause on hover, static wrap for reduced motion                                                               |
| **Step card**          | Large outlined number (01–05), title, tagline, deliverables list with check icons, timeline chip                                          |
| **Stat counter**       | Big number + label; SSR final value; count-up 1.2 s when 40 % in view                                                                     |
| **Comparison table**   | Two columns: "Typical agency" (✕, muted) vs "Skopos Codex" (✓, accent), 6 rows; stacks on mobile                                          |
| **Testimonial card**   | Quote, name, role, company, 5-star row                                                                                                    |
| **FAQ accordion**      | shadcn Accordion, one open at a time, + / – icon                                                                                          |
| **CTA band**           | Full-width gradient-bordered panel, H2, sub, 2 buttons, trust ticks                                                                       |
| **Footer**             | 4 columns → stacked on mobile                                                                                                             |
| **Form field**         | 48 px inputs, label above, required `*`, helper text, error text in `#F87171` with icon, focus ring 2 px accent                           |
| **Wizard**             | Step indicator (6 numbered dots + labels; labels hidden < 640 px), progress bar, sticky bottom Back / Continue bar on mobile              |
| **Selectable card**    | Used for service choice / multi-choice: border highlight + check when selected; keyboard = radio/checkbox semantics                       |
| **File drop**          | Dashed zone, click or drag, per-file progress, remove, retry                                                                              |

## 6. Motion

- Section reveal: fade + 16 px rise, 400 ms, stagger 60 ms, once.
- Hover: 150 ms ease-out.
- Ticker: 40 s loop.
- Everything disabled or reduced under `prefers-reduced-motion`.

## 7. Imagery & iconography

- lucide icons, 1.5 px stroke, accent colour inside tinted squares.
- No stock photography of people at laptops. Proof comes from UI mockups (dashboards, rank tables, map pins).
- Abstract background: subtle radial cyan/blue glow top-right of hero, faint grid pattern.
- OG image: dark background, logo, page title in Exo, cyan → blue underline.

## 8. Responsive behaviour

| Breakpoint | Changes                                                                                             |
| ---------- | --------------------------------------------------------------------------------------------------- |
| < 640 px   | Single column, hamburger menu, dashboard card simplified to 2 KPIs + 2 keywords, step labels hidden |
| 640–1023   | 2-column grids, services 2-up                                                                       |
| ≥ 1024     | Full layout, services 3 + 2, hero split (copy left, dashboard right)                                |

## 9. Accessibility checklist

- Semantic landmarks; one H1 per page; logical heading order.
- All interactive elements reachable by keyboard; visible focus.
- Wizard: `aria-current="step"`; errors linked with `aria-describedby`; focus to first error; live region announces step changes.
- Icons decorative unless they're the only label (then `aria-label`).
- Hit targets ≥ 44 px.
- Ticker duplicated content `aria-hidden`.

## 10. Deliverables from design

1. Token file (`globals.css` CSS variables) — can be built straight from §2–4.
2. Logo — **received** (`docs/brand/skopos-codex-logo-animated.html`); static copy at `public/brand/skopos-codex-logo.svg`, favicon at `src/app/icon.svg`. Brand mark colours: `#19E3FF` → `#0A6CFF` on `#0B1627`, wordmark in Montserrat 800/300.
3. Page compositions for Home, Service, Process, Why Us, Contact, Onboard, Admin (desktop + mobile) — optional; we can build directly from this brief and iterate in the browser.

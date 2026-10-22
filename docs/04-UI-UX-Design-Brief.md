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
| **Industries marquee** | Two rows of pill chips, opposite directions, pause on hover, roll-on-hover labels; static wrap for reduced motion                         |
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

## 6. Motion (modelled on rankesprit.com, in our palette)

Section structure and animation follow the reference home page; only the colours differ (cyan → blue instead of orange → purple). All keyframes live under `prefers-reduced-motion: no-preference` in `globals.css`; reduced motion and no-JS always get the final state.

| Pattern                     | Where                   | Spec                                                                                                                                                                                                                                   |
| --------------------------- | ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Preloader                   | First visit per session | Logo in ring, 0→100 % counter + progress line (1.1 s), fade out. Hidden for reduced motion, repeat visits (inline script sets `no-preloader`) and after 2.5 s without JS. Page-load entrances wait (`html.preloading`) until it lifts. |
| Page-load entrances         | Header, every page hero | `en-wipe` (clip-path line wipe, .95 s), `en-lift` / `en-lift-line` (rise 9 px, .6–.8 s), `en-settle`; easing `cubic-bezier(.16,1,.3,1)` / `(.25,.8,.35,1)`; staggered with `animation-delay` (.12 s → 1.08 s).                         |
| Scroll reveal               | Section headers, cards  | `Reveal`: rise 30 px + fade, 700 ms, line easing, stagger 80 ms, once.                                                                                                                                                                 |
| Hero glow                   | All heroes, CTA         | `.hero-glow`: two radial glows (deep blue + cyan) breathing 7 s / 9 s.                                                                                                                                                                 |
| Dot field                   | Home hero               | React Bits `DotField` (`src/components/home/dot-field.jsx`, WebGL2) over the glow: cyan `#19e3ff` → blue `#2b8cff` dot grid that bulges and glows around the cursor; click-through, pauses off-screen, static with reduced motion.     |
| Glass pill                  | Hero highlight          | Frosted, −3° tilt, cyan glow shadow.                                                                                                                                                                                                   |
| Inner-page hero             | All non-home pages      | `PageHero` (`src/components/sections/page-hero.tsx`): the home hero's glow, pill badge, `en-*` stagger and glass-pill highlight, centered; sections below use home spacing (`py-24 md:py-36`) and `Reveal` on every block.             |
| Pinned scene — engine       | Home, after hero        | 320 vh, sticky: ring grows, logo tile scales/turns, triangle swings in, dash trail runs into the tile, three phrases take turns. Driven by one CSS var `--p` (scroll progress) via `calc()`.                                           |
| Pinned scene — no guesswork | Home, light section     | 240 vh on `#F6F5FB`: lead brightens, "No guesswork." un-blurs (14 px → 0) and scales .88 → 1, tail fades in. Big line uses logo deep blue `#0A6CFF` → `#2B8CFF` for contrast on light.                                                 |
| Cursor glow cards           | Service cards           | `.react-card`: 1 px border + wash following the cursor (`--mx/--my`), lift 2 px on hover.                                                                                                                                              |
| Marquee + roll chips        | Industries              | Two rows, opposite directions, 40 s loop, pause on hover; chip label rolls up to a cyan copy.                                                                                                                                          |
| Timeline                    | Home process            | Sticky intro left; step icons fill with the brand gradient and connector lines grow as each step scrolls into view.                                                                                                                    |
| Buttons                     | Everywhere              | Hover lift −2 px + scale 1.02 + glow, 250 ms.                                                                                                                                                                                          |
| Counters                    | Results                 | Server-rendered final value, count-up on view.                                                                                                                                                                                         |

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

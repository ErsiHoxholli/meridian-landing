# Meridian — Landing Page Design Spec

**Date:** 2026-04-17
**Status:** Approved, pending implementation plan
**Scope:** Single landing page. No dashboard, no auth, no backend. Mocked "live data" in hero.

---

## 1. Product Positioning

**Meridian** is a placeholder product name (to be swapped later) for a "unified finance OS" — one account that unifies treasury, brokerage, and crypto in a single ledger. The landing page speaks to two audiences simultaneously:

- **Businesses / startups** — CFOs and operators managing company treasury across fiat + securities + crypto
- **Prosumer / HNW individuals** — power users managing personal wealth across the same asset classes

Tagline: *"One account for every kind of money."*

### Aesthetic Direction: Editorial Fintech

Most fintech landing pages default to an all-sans stack (Inter, IBM Plex). Meridian uses a distinctive three-family stack — editorial serif display + modern sans UI + mono for numerics — to read as Stripe/Ramp/Mercury confidence without looking identical. The serif headline is the distinguishing typographic move; a single italic word per hero carries the editorial character.

---

## 2. Information Architecture

Page sections, in order:

1. **Nav** — wordmark · `Product / Pricing / Security / Docs` · `Sign In` + `Get Early Access`. Sticky, backdrop-blur on scroll.
2. **Hero** — headline, subhead, dual CTA, live preview card (see §4).
3. **Logo strip** — 6 neutral grayscale placeholder SVGs ("Trusted by").
4. **Dual-thread value section** — split "For businesses" / "For individuals" — two columns, each a tight 3-item value list + miniature screenshot.
5. **Capability grid** — 3×2 tiles: Treasury, Trading, Crypto, Cards, Wires, API. Icon + title + 1-line description + "Learn more →".
6. **How it works** — 3 horizontal steps: Connect → Consolidate → Control.
7. **Security strip** — SOC 2 / FDIC partner / SEC-registered / custody badges. Thin band, no chrome.
8. **Metrics band** — "$4.2B settled · 47 countries · 99.99% uptime" (mocked, mono, tabular figures).
9. **Testimonial** — single large editorial quote, Fraunces italic, attribution below (name + role + company, text only; no avatar to keep the section minimal and avoid raster image weight).
10. **Pricing teaser** — 3 tiers (Free / Pro / Business) with placeholder price points and bullet lists; the tiers are structural stubs, not business-approved pricing. Each card ends with "See full pricing →" linking to `#` until a pricing page exists.
11. **FAQ** — 6 accordion items.
12. **Final CTA** — Fraunces headline, email capture, "Request access".
13. **Footer** — 4 columns (Product / Company / Resources / Legal), wordmark, compliance disclaimers, locale switcher, theme toggle.

### YAGNI Exclusions

- No blog index, no careers, no changelog, no integrations detail page — all linked as stubs.
- Single page; deep links resolve to sections via anchors.

---

## 3. Design Tokens

### 3.1 Colors

Defined in `app/globals.css` via Tailwind v4 `@theme` block. Semantic tokens only — never raw hex in components.

**Light (default):**

```
--bg:           #FAFAF7   /* ivory */
--bg-elevated:  #FFFFFF
--fg:           #0A0A0A   /* ink */
--fg-muted:     #5B5B58
--fg-subtle:    #8A8A85
--border:       #E7E5E0   /* hairline */
--border-strong:#D6D3CC
--accent:       #00D16C   /* electric green, non-text only */
--accent-text:  #0B8A4A   /* AAA on ivory for text uses */
--success:      #10B981
--warning:      #F59E0B
--danger:       #EF4444
--ring:         #0A0A0A
```

**Dark:**

```
--bg:           #0B0E13
--bg-elevated:  #11151C
--fg:           #FAFAF7
--fg-muted:     #A8A8A3
--fg-subtle:    #6E6E69
--border:       #1F2228
--border-strong:#2C3038
--accent:       #00D16C
--accent-text:  #3AE88A
--ring:         #FAFAF7
```

### 3.2 Typography

Delivered via `next/font/google` — self-hosted, auto-subset to Latin, preloaded with `font-display: swap`, `adjustFontFallback: true`.

| Role | Font | Weights | Subset | Uses |
|------|------|---------|--------|------|
| Display | Fraunces (variable, opsz) | 400, 700 | Latin + italic slice for hero + testimonial | Hero headline, section headlines, testimonial |
| UI | Inter (variable) | 400, 500, 600 | Latin | Body, nav, buttons, labels |
| Data | JetBrains Mono | 400, 500 | Latin (digits + basic) | Numbers, tickers, tabular cells |

**Type scale:**

- Hero H1: `Fraunces 700`, `clamp(2.75rem, 6vw, 5.5rem)`, `leading-[0.95]`, `tracking-tight`, `text-wrap: balance`
- Section H2: `Fraunces 700`, `clamp(2rem, 3.5vw, 3rem)`
- Body: `Inter 400`, `1rem / 1.65`
- Numerics: `JetBrains Mono 500`, `font-variant-numeric: tabular-nums`

Italic Fraunces is reserved for the testimonial and exactly one accent word in the hero headline.

**Preload discipline:** Fraunces + Inter preloaded (above the fold). JetBrains Mono NOT preloaded — first use is in the preview card's numeric areas; Inter fallback renders fine until the mono swaps in.

### 3.3 Spacing, Radius, Shadow, Motion

- **Spacing:** Tailwind default (4/8/12/16/24/32/48/64/96/128 px) — 8pt rhythm.
- **Radius:** `--r-sm: 6px`, `--r: 10px`, `--r-lg: 14px`. Cards use `--r`. No `rounded-2xl` blobs.
- **Shadow (light):** `--shadow-1: 0 1px 2px rgb(0 0 0 / 0.04)`, `--shadow-2: 0 6px 24px rgb(0 0 0 / 0.06)`.
- **Shadow (dark):** replace drop shadows with a 1px inner-border glow (hairline in `--border-strong`). No bottom shadows.
- **Motion:** `--ease: cubic-bezier(0.2, 0.8, 0.2, 1)`. Durations: `150ms` (micro), `220ms` (state), `400ms` (entrance). All wrapped in `@media (prefers-reduced-motion: reduce)` override.

---

## 4. Hero Composition

Two-column layout on desktop (12-col grid: copy spans 5, preview spans 7). Stacked on mobile. Max content width `max-w-[1280px]`, padding `px-6 md:px-10`.

### 4.1 Left column — Copy

- **Eyebrow:** `Inter 500 · uppercase · tracking-[0.14em] · text-xs · text-fg-muted` → `"Unified Finance OS"`
- **Headline (Fraunces 700, clamp 2.75→5.5rem, balance, leading-[0.95]):**
  > One account for *every* kind of money.

  `every` is set in Fraunces italic and colored `--accent-text`.
- **Subhead (Inter 400, `text-lg md:text-xl`, `text-fg-muted`, `max-w-[46ch]`):**
  *"Treasury, brokerage, and crypto in a single ledger. Built for founders, operators, and anyone whose money doesn't fit in one box."*
- **CTAs:**
  - Primary — `Get Early Access` (ink fill, ivory text, hover elevates via shadow-2)
  - Secondary — `See live demo` (text button with right-arrow icon, hover underline)
  - Both ≥ 44 px tall
- **Trust microcopy** below CTAs: `Inter 400 · text-sm · text-fg-subtle` → "SOC 2 Type II · FDIC partner banks · 0% custody risk"

### 4.2 Right column — Live preview card ("Meridian Console")

A single `<figure>` card rendering a stylized, truncated mini-dashboard. One card — not multiple floating panels — to keep the LCP element predictable.

- **Surface:** `bg-elevated`, `border-border`, `rounded-[14px]`, `shadow-2`, min-h `420px`, aspect-ratio `4/3`.
- **Header strip (48px):** mono account name `meridian.al / treasury`, pulsing green status dot, last-updated timestamp via `Intl.DateTimeFormat`.
- **Hero metric (top third):** label `Total Balance` (eyebrow style), value `$2,481,690.42` (JetBrains Mono 500, `text-5xl`, tabular-nums), delta `+$12,410.08 (0.50%) today` with an up-triangle SVG. Semantic color AND icon together — never color alone.
- **Sparkline:** 240×60 hand-rolled SVG line chart. Animates in via `pathLength` dasharray reveal over 800ms. Gentle breathing update every 4 s — adds one data point and shifts the line left. No chart library; ~40 lines of SVG, <10 KB component weight.
- **Asset row (3 tiles, mono amounts):** `USD 412,009.00` / `AAPL 38.412` / `BTC 0.28481`. Each has a 40×16 micro-sparkline + colored delta. Every ~6 s one randomly pulses (opacity fade, 180 ms).
- **Footer strip:** mono `Synced · 0.2s ago` + Meridian wordmark right-aligned.

### 4.3 Motion and live behavior

- Hero number tickers digit-by-digit (60 ms/digit) using `requestAnimationFrame`; state writes wrapped in `startTransition`.
- All live tickers are **mocked** from a single `useMeridianFeed()` hook backed by a `mulberry32` seeded PRNG + a single `setInterval`. No network calls. Deterministic in tests.
- Feed pauses when `document.visibilityState === 'hidden'`.
- Feed is disabled entirely when `prefers-reduced-motion: reduce` — sparkline renders static final frame.

### 4.4 Accessibility (hero-specific)

- Preview card has `role="figure"` + `aria-label="Live demo of the Meridian dashboard showing example account balances and activity. Values are simulated."`
- Throttled `<div aria-live="polite" class="sr-only">` mirrors major metric changes (max 1 announcement per 10 s). Disabled under reduced-motion.
- Decorative SVG icons `aria-hidden="true"`; delta directions expressed as text ("up 0.50%") in the SR mirror, not just visual triangles.

### 4.5 Hero performance budget

- **LCP element = the H1 text**, not the preview card.
- Preview card JS ≤ 8 KB gz total.
- No chart library in the hero bundle.

---

## 5. Component Inventory and File Layout

### 5.1 Project layout

```
meridian-landing/
├─ app/
│  ├─ layout.tsx              # fonts, theme provider, <meta>, skip link
│  ├─ page.tsx                # composes sections
│  ├─ globals.css             # @theme tokens, resets
│  ├─ opengraph-image.tsx     # OG image (served at build)
│  ├─ robots.ts
│  └─ sitemap.ts
├─ components/
│  ├─ nav.tsx
│  ├─ hero/
│  │  ├─ hero.tsx
│  │  ├─ preview-card.tsx     # the live mock dashboard
│  │  ├─ sparkline.tsx        # hand-rolled SVG
│  │  ├─ ticker-number.tsx    # digit-roll component
│  │  └─ use-meridian-feed.ts # seeded PRNG mock feed
│  ├─ dual-thread.tsx
│  ├─ capability-grid.tsx
│  ├─ how-it-works.tsx
│  ├─ security-strip.tsx
│  ├─ metrics-band.tsx
│  ├─ testimonial.tsx
│  ├─ pricing-teaser.tsx
│  ├─ faq.tsx                 # shadcn Accordion
│  ├─ final-cta.tsx
│  ├─ footer.tsx
│  ├─ theme-toggle.tsx
│  └─ ui/                     # shadcn primitives
├─ lib/
│  ├─ format.ts               # Intl.NumberFormat / DateTimeFormat wrappers
│  ├─ prng.ts                 # mulberry32 seeded PRNG
│  └─ cn.ts                   # clsx + tailwind-merge
├─ public/
│  └─ logos/                  # 6 placeholder SVG logos, neutral
└─ docs/
   └─ superpowers/specs/…
```

### 5.2 shadcn primitives used

Only what we actually render:

- `Button` — 3 variants: `primary` (ink fill), `secondary` (ghost with border), `ghost` (text-only with underline on hover)
- `Input` — final CTA + waitlist only
- `Accordion` — FAQ
- `DropdownMenu` — locale switcher in footer

### 5.3 Dependencies explicitly excluded

- No chart library (Recharts / Chart.js / visx / uPlot)
- No motion library (framer-motion)
- No analytics client at launch — `<Analytics />` slot stubbed
- No i18n library — use `Intl.*` directly; locale switcher cosmetic until translations exist
- No form library — uncontrolled `<form action>` posting to a stubbed server action

### 5.4 Component rules

1. Server component by default. `"use client"` permitted only on: `ThemeToggle`, `PreviewCard`, `Accordion`, `DropdownMenu`, `Nav` (scroll state).
2. Every numeric value rendered through `lib/format.ts` (never hardcoded `$`).
3. Every `<img>` / `Image` has explicit `width` and `height`.
4. Every icon from `lucide-react` — one icon family only — with `aria-hidden="true"` unless standalone-meaningful.
5. All `<Link>` / `<button>` have `focus-visible:ring-2 ring-ring ring-offset-2 ring-offset-bg`.
6. `min-w-0` on every flex child that holds text.
7. No `transition: all` anywhere — enforced via lint.

---

## 6. Performance Budget and Delivery

### 6.1 Hard budgets (CI-enforced)

| Metric | Budget | Measurement |
|--------|--------|-------------|
| First-Load JS (route `/`) | ≤ 95 KB gz | Next.js build output |
| Total CSS | ≤ 20 KB gz | Build output |
| Fonts (critical, preloaded) | ≤ 55 KB gz total | Network panel |
| LCP (mobile 4G, Moto G Power) | ≤ 1.8 s | Lighthouse CI |
| CLS | ≤ 0.02 | Lighthouse CI |
| INP | ≤ 150 ms | Lighthouse CI |
| Lighthouse Performance | ≥ 95 | Lighthouse CI |
| Lighthouse Accessibility | 100 | Lighthouse CI |

### 6.2 Font strategy

- `next/font/google` for all three families. Auto-subset to Latin, self-hosted.
- Fraunces: weights 400 and 700 only (variable axis slice). Italic subset only for the hero italic word and the testimonial.
- Inter: weights 400, 500, 600 (variable).
- JetBrains Mono: weights 400, 500 — **not preloaded** (below-fold first use).
- `adjustFontFallback: true` to suppress swap-time layout shift.

### 6.3 Bundle discipline

- `lucide-react` imported per-icon (tree-shakes correctly) — no barrel re-exports.
- shadcn primitives added one at a time via CLI, not as a package.
- No chart library, no motion library.
- `next-themes` (~2 KB) is the only non-essential client dep.

### 6.4 Rendering strategy

- Page is static: `export const dynamic = 'force-static'`. Rendered at build, served from CDN edge.
- Client components (islands) are limited to: `Nav`, `PreviewCard`, `ThemeToggle`, `Accordion`, `FinalCTA`.
- Below-fold sections wrapped in `style={{ contentVisibility: 'auto', containIntrinsicSize: '800px 1000px' }}`.
- `<link rel="preconnect">` to future analytics origin — slot stubbed, not included at launch.
- Images via `next/image` with explicit `width`/`height`, `loading="lazy"` on all image tags. No above-the-fold raster images (the hero's right column is the SVG preview card, not a bitmap) so no `priority` flag needed.

### 6.5 Runtime discipline in `PreviewCard`

- Single `useMeridianFeed()` hook owns the `setInterval`. Subscribers read via `useSyncExternalStore` so only slices that changed re-render.
- Ticker state updates wrapped in `startTransition`.
- Feed paused when `document.visibilityState === 'hidden'`.
- Feed disabled under `prefers-reduced-motion: reduce`.

### 6.6 CI gates

- Lighthouse CI runs on every PR, posts score diff as a comment, blocks merge on any budget breach.
- `size-limit` guards per-route JS budget.
- ESLint: `eslint-plugin-jsx-a11y` for icon-button a11y; custom rules for `no-transition-all` and `no-raw-hex-in-jsx`.

---

## 7. Accessibility Commitments

### 7.1 Contrast (measured)

- Body `#0A0A0A` on `#FAFAF7` → 18.9:1 — AAA
- Muted `#5B5B58` on `#FAFAF7` → 6.4:1 — AA+
- Subtle `#8A8A85` on `#FAFAF7` → 3.1:1 — decorative/metadata only (timestamps), never primary content
- Electric accent `#00D16C` on `#FAFAF7` → 1.8:1 — **never for text**; fills, dots, chart strokes only
- Text accent `#0B8A4A` on `#FAFAF7` → 4.9:1 — AA (used for italic hero word)
- Dark mode re-verified per token; non-text UI borders ≥ 3:1 against surface

### 7.2 Keyboard

- Visible skip-link ("Skip to content") as first focusable element
- `:focus-visible` rings on every interactive element; never `outline: none` without replacement
- Tab order follows visual order; accordion, dropdown, and theme toggle operable via arrow keys per WAI-ARIA patterns (shadcn defaults)

### 7.3 Screen readers

- Single `<h1>` per page (hero); section headings sequential `<h2>` → `<h3>`
- Preview card: `role="figure"` + descriptive `aria-label` clarifying values are simulated
- Throttled `aria-live="polite"` region mirrors major metric changes (max 1/10 s, disabled under reduced-motion)
- Form errors via `role="alert"` + focus moved to first invalid field
- Icon-only buttons have `aria-label`; decorative icons `aria-hidden="true"`
- Brand names and ticker symbols wrapped in `translate="no"`

### 7.4 Motion

- Global `@media (prefers-reduced-motion: reduce)` disables: sparkline draw-in, ticker digit roll, pulse, scroll-triggered entrances, hover translates
- Retained under reduced-motion: color/opacity state changes (non-motion feedback)
- No parallax anywhere

### 7.5 Forms (waitlist + final CTA)

- `<label>` linked via `htmlFor`
- `type="email"` + `autocomplete="email"` + `inputmode="email"` + `spellCheck={false}`
- Inline error next to field; submit disabled only during the request, not while invalid
- Spinner with `aria-busy`; success announced via `role="status"`

### 7.6 i18n readiness

- Numbers via `Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })` wrapper in `lib/format.ts`
- Dates via `Intl.DateTimeFormat`
- Locale switcher in footer is cosmetic for launch but wired to a `Locale` context for mechanical future expansion
- `<html lang="en">` set correctly

### 7.7 Responsive and input

- Designed mobile-first at 375 px. Tested at 375 / 768 / 1024 / 1440.
- Touch targets ≥ 44×44 px on all mobile viewports
- `viewport` meta default (zoom not disabled)
- `touch-action: manipulation` on buttons (kills iOS 300 ms delay)
- No horizontal scroll at any viewport

### 7.8 Verification before merge

- axe-core via Lighthouse CI — accessibility score must = 100
- Manual keyboard pass: tab from top to bottom of page, every interactive element reachable with visible focus
- VoiceOver smoke test on Safari mobile for hero, primary CTA, and FAQ
- Reduced-motion toggled on → confirm zero motion

---

## 8. Stack Summary

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript, strict mode
- **Styling:** Tailwind v4 with `@theme` tokens
- **Components:** shadcn/ui (only Button, Input, Accordion, DropdownMenu)
- **Fonts:** `next/font/google` (Fraunces, Inter, JetBrains Mono)
- **Icons:** `lucide-react` (per-icon imports)
- **Theme:** `next-themes` (light / dark / system)
- **Charts:** none — hand-rolled SVG sparkline
- **Motion:** CSS transitions + one rAF loop for the digit roll
- **CI:** Lighthouse CI, `size-limit`, ESLint, Playwright for keyboard pass smoke test
- **Hosting:** Vercel assumed (static output works anywhere)

---

## 9. Out of Scope (explicit)

- Dashboard routes (`/dashboard`, `/accounts`, etc.)
- Authentication, sign-up flow, email verification
- Server-side persistence for the waitlist (server action is stubbed)
- Real-time data feed (mocked via seeded PRNG)
- Analytics integration (slot stubbed)
- Internationalization content (locale switcher cosmetic)
- Blog, careers, changelog, integrations detail pages

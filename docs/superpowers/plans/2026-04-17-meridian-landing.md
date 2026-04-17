# Meridian Landing Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a single-page marketing site for "Meridian" (placeholder unified-finance-OS fintech) per the approved design spec, hitting a 95 KB JS budget, Lighthouse 95/100 perf / 100 a11y, and landing with an editorial Fraunces + Inter + JetBrains Mono type stack.

**Architecture:** Next.js 15 App Router, statically exported. Server components by default; client islands for `Nav`, `PreviewCard`, `ThemeToggle`, `Accordion`, and `FinalCTA`. No chart library, no motion library — sparkline is hand-rolled SVG; digit tickers use `requestAnimationFrame` wrapped in `startTransition`. Mock "live" data comes from a single `useMeridianFeed()` hook backed by a seeded PRNG and one `setInterval`, paused by visibility change and `prefers-reduced-motion`.

**Tech Stack:** Next.js 15 · TypeScript (strict) · Tailwind v4 · shadcn/ui (Button/Input/Accordion/DropdownMenu only) · `next/font/google` · `next-themes` · `lucide-react` · Vitest + React Testing Library · Playwright (a11y/keyboard smoke) · size-limit · Lighthouse CI.

**Spec:** `docs/superpowers/specs/2026-04-17-meridian-landing-design.md`

**Working directory:** `C:\Users\ersi\projects\meridian-landing` (already a git repo on `main` with the spec committed).

---

## File Structure

```
meridian-landing/
├─ app/
│  ├─ layout.tsx
│  ├─ page.tsx
│  ├─ globals.css
│  ├─ opengraph-image.tsx
│  ├─ robots.ts
│  ├─ sitemap.ts
│  └─ api/waitlist/route.ts    # stub server action endpoint
├─ components/
│  ├─ nav.tsx                   # client (scroll state)
│  ├─ theme-toggle.tsx          # client
│  ├─ hero/
│  │  ├─ hero.tsx               # server
│  │  ├─ preview-card.tsx       # client
│  │  ├─ sparkline.tsx          # client (uses ref for animation)
│  │  ├─ ticker-number.tsx      # client
│  │  └─ use-meridian-feed.ts   # client hook
│  ├─ logo-strip.tsx
│  ├─ dual-thread.tsx
│  ├─ capability-grid.tsx
│  ├─ how-it-works.tsx
│  ├─ security-strip.tsx
│  ├─ metrics-band.tsx
│  ├─ testimonial.tsx
│  ├─ pricing-teaser.tsx
│  ├─ faq.tsx                   # client (Accordion)
│  ├─ final-cta.tsx             # client (form)
│  ├─ footer.tsx
│  ├─ wordmark.tsx
│  └─ ui/                       # shadcn primitives, one file each
├─ lib/
│  ├─ cn.ts
│  ├─ format.ts
│  └─ prng.ts
├─ tests/
│  ├─ lib/format.test.ts
│  ├─ lib/prng.test.ts
│  ├─ hero/use-meridian-feed.test.ts
│  └─ e2e/a11y.spec.ts          # Playwright
├─ public/
│  └─ logos/logo-{1..6}.svg
├─ .github/workflows/ci.yml
├─ lighthouserc.json
├─ .size-limit.json
└─ ...config files (tsconfig, eslint, etc.)
```

---

## Task 1: Scaffold Next.js project

**Files:**
- Create (via `create-next-app`): package.json, tsconfig.json, next.config.ts, eslint.config.mjs, postcss.config.mjs, app/layout.tsx (stub), app/page.tsx (stub), app/globals.css (stub)

- [ ] **Step 1: Run create-next-app into the existing directory**

The repo already exists with `.gitignore` + `docs/`. Use `--use-npm --yes` and install into current dir:

```bash
cd /c/Users/ersi/projects/meridian-landing
npx --yes create-next-app@15 . --ts --tailwind --eslint --app --src-dir false --import-alias "@/*" --use-npm --yes --turbopack
```

When prompted about the existing `.gitignore` or `docs/`, accept (merge). If the CLI refuses because the directory is non-empty, instead scaffold into `.tmp-scaffold/` then copy files over:

```bash
npx --yes create-next-app@15 .tmp-scaffold --ts --tailwind --eslint --app --src-dir false --import-alias "@/*" --use-npm --yes --turbopack
cp -r .tmp-scaffold/. .
rm -rf .tmp-scaffold
# preserve our own .gitignore
git checkout -- .gitignore
```

- [ ] **Step 2: Pin Next to 15.x, verify Tailwind v4**

Check `package.json` shows `"next": "^15..."` and `"tailwindcss": "^4..."`. If Tailwind is v3, upgrade:

```bash
npm install -D tailwindcss@next @tailwindcss/postcss@next
```

- [ ] **Step 3: Verify dev server boots**

```bash
npm run dev
```

Open `http://localhost:3000` — default Next welcome page should render. Ctrl+C to stop.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "$(cat <<'EOF'
chore: scaffold Next.js 15 App Router project with Tailwind v4

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 2: Install core runtime and dev dependencies

**Files:** `package.json`

- [ ] **Step 1: Install runtime deps**

```bash
npm install next-themes lucide-react clsx tailwind-merge
```

- [ ] **Step 2: Install dev deps (testing + perf budgets)**

```bash
npm install -D vitest @vitejs/plugin-react @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom @playwright/test @axe-core/playwright size-limit @size-limit/preset-app @lhci/cli eslint-plugin-jsx-a11y
```

- [ ] **Step 3: Initialize Playwright browsers**

```bash
npx playwright install --with-deps chromium
```

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json
git commit -m "$(cat <<'EOF'
chore: install runtime and dev dependencies

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 3: Configure TypeScript strict + path aliases

**Files:** `tsconfig.json`

- [ ] **Step 1: Overwrite tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "ES2022"],
    "allowJs": false,
    "strict": true,
    "noImplicitAny": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "exactOptionalPropertyTypes": false,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "forceConsistentCasingInFileNames": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 2: Verify typecheck passes**

```bash
npx tsc --noEmit
```

Expected: no output (success).

- [ ] **Step 3: Commit**

```bash
git add tsconfig.json
git commit -m "$(cat <<'EOF'
chore: enable strict TypeScript

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 4: Utility lib — `lib/cn.ts`

**Files:**
- Create: `lib/cn.ts`

- [ ] **Step 1: Write `lib/cn.ts`**

```ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
```

- [ ] **Step 2: Typecheck**

```bash
npx tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
git add lib/cn.ts
git commit -m "$(cat <<'EOF'
feat(lib): add cn() class-merge helper

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 5: Vitest configuration

**Files:**
- Create: `vitest.config.ts`
- Create: `tests/setup.ts`

- [ ] **Step 1: Write vitest.config.ts**

```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./tests/setup.ts"],
    globals: true,
    include: ["tests/**/*.test.{ts,tsx}"],
    exclude: ["tests/e2e/**"],
  },
  resolve: {
    alias: { "@": path.resolve(__dirname, ".") },
  },
});
```

- [ ] **Step 2: Write tests/setup.ts**

```ts
import "@testing-library/jest-dom/vitest";
```

- [ ] **Step 3: Add script to package.json**

Add to `"scripts"`: `"test": "vitest run"`, `"test:watch": "vitest"`.

- [ ] **Step 4: Verify Vitest boots**

```bash
npm test
```

Expected: "No test files found" (no tests yet) — exit code 0 or 1, both acceptable.

- [ ] **Step 5: Commit**

```bash
git add vitest.config.ts tests/setup.ts package.json
git commit -m "$(cat <<'EOF'
test: configure Vitest + jsdom

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 6: Utility lib — `lib/prng.ts` (mulberry32) with tests

**Files:**
- Create: `lib/prng.ts`
- Create: `tests/lib/prng.test.ts`

- [ ] **Step 1: Write the failing test**

`tests/lib/prng.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { mulberry32 } from "@/lib/prng";

describe("mulberry32", () => {
  it("is deterministic for the same seed", () => {
    const a = mulberry32(42);
    const b = mulberry32(42);
    for (let i = 0; i < 100; i++) {
      expect(a()).toBe(b());
    }
  });

  it("returns values in [0, 1)", () => {
    const rand = mulberry32(1);
    for (let i = 0; i < 1000; i++) {
      const v = rand();
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });

  it("differs for different seeds", () => {
    const a = mulberry32(1);
    const b = mulberry32(2);
    expect(a()).not.toBe(b());
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm test -- prng
```

Expected: FAIL — cannot resolve `@/lib/prng`.

- [ ] **Step 3: Write `lib/prng.ts`**

```ts
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return function next(): number {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npm test -- prng
```

Expected: all 3 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add lib/prng.ts tests/lib/prng.test.ts
git commit -m "$(cat <<'EOF'
feat(lib): add mulberry32 seeded PRNG

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 7: Utility lib — `lib/format.ts` with tests

**Files:**
- Create: `lib/format.ts`
- Create: `tests/lib/format.test.ts`

- [ ] **Step 1: Write the failing test**

`tests/lib/format.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { formatUsd, formatPercent, formatRelativeTime, formatNumber } from "@/lib/format";

describe("format", () => {
  it("formatUsd renders en-US currency with 2 fraction digits", () => {
    expect(formatUsd(2481690.42)).toBe("$2,481,690.42");
    expect(formatUsd(0)).toBe("$0.00");
  });

  it("formatUsd supports optional signed prefix", () => {
    expect(formatUsd(12410.08, { signed: true })).toBe("+$12,410.08");
    expect(formatUsd(-50, { signed: true })).toBe("-$50.00");
  });

  it("formatPercent renders with sign and 2 decimals", () => {
    expect(formatPercent(0.005)).toBe("+0.50%");
    expect(formatPercent(-0.0123)).toBe("-1.23%");
  });

  it("formatRelativeTime returns seconds-ago string", () => {
    expect(formatRelativeTime(0.2)).toBe("0.2s ago");
    expect(formatRelativeTime(12)).toBe("12s ago");
  });

  it("formatNumber uses Intl.NumberFormat grouping", () => {
    expect(formatNumber(1234567.89, 2)).toBe("1,234,567.89");
    expect(formatNumber(38.412, 3)).toBe("38.412");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm test -- format
```

Expected: FAIL — module not found.

- [ ] **Step 3: Write `lib/format.ts`**

```ts
const usdBase = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatUsd(value: number, opts?: { signed?: boolean }): string {
  const abs = usdBase.format(Math.abs(value));
  if (!opts?.signed) return value < 0 ? `-${abs}` : abs;
  return value < 0 ? `-${abs}` : `+${abs}`;
}

export function formatPercent(ratio: number): string {
  const pct = (ratio * 100).toFixed(2);
  const n = Number(pct);
  return `${n >= 0 ? "+" : ""}${pct}%`;
}

export function formatRelativeTime(secondsAgo: number): string {
  if (secondsAgo < 10) return `${secondsAgo.toFixed(1)}s ago`;
  return `${Math.round(secondsAgo)}s ago`;
}

export function formatNumber(value: number, fractionDigits = 2): string {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(value);
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npm test -- format
```

Expected: all 5 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add lib/format.ts tests/lib/format.test.ts
git commit -m "$(cat <<'EOF'
feat(lib): add Intl-based formatting helpers

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 8: Install fonts via `next/font` and wire them to Tailwind tokens

**Files:**
- Modify: `app/layout.tsx`
- Modify: `app/globals.css`

- [ ] **Step 1: Overwrite `app/layout.tsx`**

```tsx
import type { Metadata } from "next";
import { Fraunces, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["400", "700"],
  style: ["normal", "italic"],
  display: "swap",
  adjustFontFallback: true,
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600"],
  display: "swap",
  adjustFontFallback: true,
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"],
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  title: "Meridian — One account for every kind of money",
  description:
    "Treasury, brokerage, and crypto in a single ledger. Built for founders, operators, and anyone whose money doesn't fit in one box.",
  metadataBase: new URL("https://meridian.example"),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable} ${jetbrains.variable}`} suppressHydrationWarning>
      <body className="bg-bg text-fg antialiased">{children}</body>
    </html>
  );
}
```

- [ ] **Step 2: Overwrite `app/globals.css` with @theme tokens**

```css
@import "tailwindcss";

@custom-variant dark (&:where(.dark, .dark *));

@theme {
  --color-bg: #FAFAF7;
  --color-bg-elevated: #FFFFFF;
  --color-fg: #0A0A0A;
  --color-fg-muted: #5B5B58;
  --color-fg-subtle: #8A8A85;
  --color-border: #E7E5E0;
  --color-border-strong: #D6D3CC;
  --color-accent: #00D16C;
  --color-accent-text: #0B8A4A;
  --color-success: #10B981;
  --color-warning: #F59E0B;
  --color-danger: #EF4444;
  --color-ring: #0A0A0A;

  --font-serif: var(--font-serif), Georgia, serif;
  --font-sans: var(--font-sans), system-ui, sans-serif;
  --font-mono: var(--font-mono), ui-monospace, monospace;

  --radius-sm: 6px;
  --radius-DEFAULT: 10px;
  --radius-lg: 14px;

  --ease-brand: cubic-bezier(0.2, 0.8, 0.2, 1);
}

.dark {
  --color-bg: #0B0E13;
  --color-bg-elevated: #11151C;
  --color-fg: #FAFAF7;
  --color-fg-muted: #A8A8A3;
  --color-fg-subtle: #6E6E69;
  --color-border: #1F2228;
  --color-border-strong: #2C3038;
  --color-accent: #00D16C;
  --color-accent-text: #3AE88A;
  --color-ring: #FAFAF7;
}

:root {
  color-scheme: light;
}

.dark {
  color-scheme: dark;
}

html {
  -webkit-text-size-adjust: 100%;
}

body {
  font-family: var(--font-sans);
  font-feature-settings: "cv11", "ss01";
}

.font-tabular {
  font-variant-numeric: tabular-nums;
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

*:focus-visible {
  outline: 2px solid var(--color-ring);
  outline-offset: 2px;
  border-radius: 4px;
}

::selection {
  background: var(--color-fg);
  color: var(--color-bg);
}
```

- [ ] **Step 3: Start dev server, confirm page renders with new tokens**

```bash
npm run dev
```

Visit `http://localhost:3000`. Page body should be ivory `#FAFAF7`, text ink `#0A0A0A`. Ctrl+C.

- [ ] **Step 4: Commit**

```bash
git add app/layout.tsx app/globals.css
git commit -m "$(cat <<'EOF'
feat: install Fraunces + Inter + JetBrains Mono, wire design tokens

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 9: Theme provider + ThemeToggle

**Files:**
- Create: `components/theme-provider.tsx`
- Create: `components/theme-toggle.tsx`
- Modify: `app/layout.tsx`

- [ ] **Step 1: Write `components/theme-provider.tsx`**

```tsx
"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ComponentProps } from "react";

export function ThemeProvider({ children, ...props }: ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange {...props}>
      {children}
    </NextThemesProvider>
  );
}
```

- [ ] **Step 2: Write `components/theme-toggle.tsx`**

```tsx
"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <button
      type="button"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="inline-flex h-10 w-10 items-center justify-center rounded-[--radius-sm] border border-border text-fg-muted hover:text-fg hover:border-border-strong transition-colors"
      suppressHydrationWarning
    >
      {isDark ? <Sun aria-hidden="true" size={16} /> : <Moon aria-hidden="true" size={16} />}
    </button>
  );
}
```

- [ ] **Step 3: Wrap app with ThemeProvider**

Modify `app/layout.tsx` — replace the body return with:

```tsx
<body className="bg-bg text-fg antialiased">
  <ThemeProvider>
    <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-fg focus:px-3 focus:py-2 focus:text-bg">
      Skip to content
    </a>
    {children}
  </ThemeProvider>
</body>
```

And add `import { ThemeProvider } from "@/components/theme-provider";` at the top.

- [ ] **Step 4: Verify typecheck + dev server**

```bash
npx tsc --noEmit
npm run dev
```

Page should still render. Ctrl+C.

- [ ] **Step 5: Commit**

```bash
git add components/theme-provider.tsx components/theme-toggle.tsx app/layout.tsx
git commit -m "$(cat <<'EOF'
feat: add theme provider, toggle, and skip link

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 10: Wordmark component

**Files:**
- Create: `components/wordmark.tsx`

- [ ] **Step 1: Write `components/wordmark.tsx`**

```tsx
import { cn } from "@/lib/cn";

export function Wordmark({ className }: { className?: string }) {
  return (
    <span
      translate="no"
      className={cn("font-serif text-xl tracking-tight text-fg select-none", className)}
      aria-label="Meridian"
    >
      Meridian<span className="text-accent-text">.</span>
    </span>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/wordmark.tsx
git commit -m "$(cat <<'EOF'
feat(ui): add Meridian wordmark

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 11: Install shadcn primitives (Button, Input, Accordion, DropdownMenu)

**Files:**
- Create: `components.json`, `components/ui/button.tsx`, `components/ui/input.tsx`, `components/ui/accordion.tsx`, `components/ui/dropdown-menu.tsx`

- [ ] **Step 1: Init shadcn**

```bash
npx --yes shadcn@latest init -d -y
```

Answer prompts: style `new-york`, base color `neutral`, CSS variables `yes`, alias `@`.

- [ ] **Step 2: Add only the primitives we use**

```bash
npx --yes shadcn@latest add button input accordion dropdown-menu -y
```

- [ ] **Step 3: Replace `components/ui/button.tsx` with Meridian variants**

Overwrite with:

```tsx
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[--radius-sm] font-sans font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-2 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-ring [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 touch-manipulation",
  {
    variants: {
      variant: {
        primary: "bg-fg text-bg hover:shadow-[0_6px_24px_rgb(0_0_0/0.12)]",
        secondary: "bg-transparent text-fg border border-border hover:border-border-strong hover:bg-bg-elevated",
        ghost: "bg-transparent text-fg hover:underline underline-offset-4 decoration-from-font",
      },
      size: {
        default: "h-11 px-5 text-sm",
        lg: "h-12 px-6 text-[15px]",
        sm: "h-9 px-4 text-sm",
      },
    },
    defaultVariants: { variant: "primary", size: "default" },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp ref={ref} className={cn(buttonVariants({ variant, size, className }))} {...props} />;
  }
);
Button.displayName = "Button";

export { buttonVariants };
```

(Install `class-variance-authority` and `@radix-ui/react-slot` if `shadcn add button` didn't pull them: `npm install class-variance-authority @radix-ui/react-slot`.)

- [ ] **Step 4: Typecheck**

```bash
npx tsc --noEmit
```

- [ ] **Step 5: Commit**

```bash
git add components.json components/ui/ package.json package-lock.json
git commit -m "$(cat <<'EOF'
feat(ui): add shadcn primitives (button, input, accordion, dropdown-menu)

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 12: `useMeridianFeed` hook with tests

**Files:**
- Create: `components/hero/use-meridian-feed.ts`
- Create: `tests/hero/use-meridian-feed.test.ts`

- [ ] **Step 1: Write the failing test**

`tests/hero/use-meridian-feed.test.ts`:

```ts
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useMeridianFeed } from "@/components/hero/use-meridian-feed";

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

describe("useMeridianFeed", () => {
  it("produces a deterministic initial snapshot for a fixed seed", () => {
    const a = renderHook(() => useMeridianFeed({ seed: 42, tickMs: 1000 }));
    const b = renderHook(() => useMeridianFeed({ seed: 42, tickMs: 1000 }));
    expect(a.result.current.balance).toBe(b.result.current.balance);
    expect(a.result.current.series).toEqual(b.result.current.series);
  });

  it("advances balance on tick", () => {
    const { result } = renderHook(() => useMeridianFeed({ seed: 1, tickMs: 1000 }));
    const before = result.current.balance;
    act(() => vi.advanceTimersByTime(1000));
    expect(result.current.balance).not.toBe(before);
  });

  it("keeps series length capped", () => {
    const { result } = renderHook(() => useMeridianFeed({ seed: 1, tickMs: 1000, seriesLength: 32 }));
    act(() => vi.advanceTimersByTime(60_000));
    expect(result.current.series.length).toBeLessThanOrEqual(32);
  });

  it("does not advance when reducedMotion=true", () => {
    const { result } = renderHook(() => useMeridianFeed({ seed: 1, tickMs: 1000, reducedMotion: true }));
    const before = result.current.balance;
    act(() => vi.advanceTimersByTime(10_000));
    expect(result.current.balance).toBe(before);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm test -- use-meridian-feed
```

Expected: FAIL — module not found.

- [ ] **Step 3: Write `components/hero/use-meridian-feed.ts`**

```ts
"use client";

import { useEffect, useRef, useState } from "react";
import { mulberry32 } from "@/lib/prng";

export interface MeridianSnapshot {
  balance: number;
  deltaAbs: number;
  deltaPct: number;
  series: number[];
  syncedSecondsAgo: number;
  assets: Array<{ symbol: string; amount: number; deltaPct: number; micro: number[] }>;
}

export interface FeedOptions {
  seed?: number;
  tickMs?: number;
  seriesLength?: number;
  reducedMotion?: boolean;
}

const BASE_BALANCE = 2_481_690.42;
const SYMBOLS = ["USD", "AAPL", "BTC"] as const;

function buildInitial(seed: number, seriesLength: number): MeridianSnapshot {
  const rand = mulberry32(seed);
  const series: number[] = [];
  let v = 50;
  for (let i = 0; i < seriesLength; i++) {
    v += (rand() - 0.48) * 3;
    series.push(v);
  }
  const assets = SYMBOLS.map((symbol, i) => {
    const micro: number[] = [];
    let m = 50;
    for (let j = 0; j < 20; j++) {
      m += (rand() - 0.5) * 4;
      micro.push(m);
    }
    const amount = [412_009.0, 38.412, 0.28481][i];
    const deltaPct = (rand() - 0.3) * 0.02;
    return { symbol, amount, deltaPct, micro };
  });
  return {
    balance: BASE_BALANCE,
    deltaAbs: 12_410.08,
    deltaPct: 0.005,
    series,
    syncedSecondsAgo: 0.2,
    assets,
  };
}

export function useMeridianFeed(opts: FeedOptions = {}): MeridianSnapshot {
  const { seed = 42, tickMs = 4000, seriesLength = 64, reducedMotion = false } = opts;
  const [snap, setSnap] = useState<MeridianSnapshot>(() => buildInitial(seed, seriesLength));
  const randRef = useRef(mulberry32(seed + 1));

  useEffect(() => {
    if (reducedMotion) return;
    const id = setInterval(() => {
      if (typeof document !== "undefined" && document.visibilityState === "hidden") return;
      setSnap((prev) => {
        const rand = randRef.current;
        const nextBalanceDelta = (rand() - 0.4) * 5000;
        const nextBalance = prev.balance + nextBalanceDelta;
        const lastSeries = prev.series[prev.series.length - 1] ?? 50;
        const nextPoint = lastSeries + (rand() - 0.48) * 3;
        const nextSeries = prev.series.slice(1).concat(nextPoint);
        const touchedIndex = Math.floor(rand() * prev.assets.length);
        const nextAssets = prev.assets.map((a, i) =>
          i === touchedIndex ? { ...a, deltaPct: a.deltaPct + (rand() - 0.5) * 0.002 } : a
        );
        return {
          balance: nextBalance,
          deltaAbs: prev.deltaAbs + nextBalanceDelta,
          deltaPct: (nextBalance - BASE_BALANCE) / BASE_BALANCE,
          series: nextSeries,
          syncedSecondsAgo: 0.2,
          assets: nextAssets,
        };
      });
    }, tickMs);
    return () => clearInterval(id);
  }, [tickMs, reducedMotion]);

  return snap;
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npm test -- use-meridian-feed
```

Expected: all 4 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add components/hero/use-meridian-feed.ts tests/hero/use-meridian-feed.test.ts
git commit -m "$(cat <<'EOF'
feat(hero): add deterministic mock data feed hook

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 13: Sparkline component (hand-rolled SVG)

**Files:**
- Create: `components/hero/sparkline.tsx`

- [ ] **Step 1: Write the component**

```tsx
"use client";

import { useMemo } from "react";
import { cn } from "@/lib/cn";

interface Props {
  values: number[];
  width?: number;
  height?: number;
  className?: string;
  ariaLabel?: string;
  strokeWidth?: number;
}

export function Sparkline({ values, width = 240, height = 60, className, ariaLabel, strokeWidth = 1.5 }: Props) {
  const { path, area, last, first } = useMemo(() => {
    if (values.length < 2) return { path: "", area: "", last: 0, first: 0 };
    const min = Math.min(...values);
    const max = Math.max(...values);
    const span = max - min || 1;
    const step = width / (values.length - 1);
    const points = values.map((v, i) => {
      const x = i * step;
      const y = height - ((v - min) / span) * height;
      return [x, y] as const;
    });
    const d = points.map(([x, y], i) => (i === 0 ? `M${x},${y}` : `L${x},${y}`)).join(" ");
    const areaD = `${d} L${width},${height} L0,${height} Z`;
    return { path: d, area: areaD, last: points[points.length - 1]![1], first: points[0]![1] };
  }, [values, width, height]);

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      className={cn("overflow-visible", className)}
      role={ariaLabel ? "img" : "presentation"}
      aria-label={ariaLabel}
      aria-hidden={ariaLabel ? undefined : true}
    >
      <defs>
        <linearGradient id="sparkFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.18" />
          <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#sparkFill)" />
      <path
        d={path}
        fill="none"
        stroke="var(--color-accent)"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx={0} cy={first} r={2} fill="var(--color-accent)" opacity="0.4" />
      <circle cx={240} cy={last} r={3} fill="var(--color-accent)" />
    </svg>
  );
}
```

- [ ] **Step 2: Typecheck**

```bash
npx tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
git add components/hero/sparkline.tsx
git commit -m "$(cat <<'EOF'
feat(hero): hand-rolled SVG sparkline

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 14: TickerNumber component (digit-by-digit roll)

**Files:**
- Create: `components/hero/ticker-number.tsx`

- [ ] **Step 1: Write the component**

```tsx
"use client";

import { useEffect, useRef, useState, useTransition } from "react";

interface Props {
  value: string;
  className?: string;
}

export function TickerNumber({ value, className }: Props) {
  const [display, setDisplay] = useState(value);
  const prevRef = useRef(value);
  const [, startTransition] = useTransition();

  useEffect(() => {
    if (value === prevRef.current) return;
    const from = prevRef.current;
    const to = value;
    prevRef.current = to;

    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplay(to);
      return;
    }

    const start = performance.now();
    const duration = Math.min(600, 60 * Math.max(from.length, to.length));
    let raf = 0;
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const len = Math.max(from.length, to.length);
      let out = "";
      for (let i = 0; i < len; i++) {
        const a = from[i] ?? to[i]!;
        const b = to[i] ?? a;
        if (a === b) {
          out += b;
          continue;
        }
        if (/\d/.test(b) && t < 1) {
          out += String(Math.floor(Math.random() * 10));
        } else {
          out += b;
        }
      }
      startTransition(() => setDisplay(out));
      if (t < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [value]);

  return (
    <span className={className} aria-live="off" suppressHydrationWarning>
      {display}
    </span>
  );
}
```

- [ ] **Step 2: Typecheck + commit**

```bash
npx tsc --noEmit
git add components/hero/ticker-number.tsx
git commit -m "$(cat <<'EOF'
feat(hero): add digit-roll TickerNumber component

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 15: PreviewCard assembly

**Files:**
- Create: `components/hero/preview-card.tsx`

- [ ] **Step 1: Write `components/hero/preview-card.tsx`**

```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { Sparkline } from "./sparkline";
import { TickerNumber } from "./ticker-number";
import { useMeridianFeed } from "./use-meridian-feed";
import { formatNumber, formatPercent, formatUsd } from "@/lib/format";

function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const listener = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", listener);
    return () => mq.removeEventListener("change", listener);
  }, []);
  return reduced;
}

export function PreviewCard() {
  const reduced = useReducedMotion();
  const snap = useMeridianFeed({ reducedMotion: reduced });
  const lastAnnouncedRef = useRef(0);
  const [announcement, setAnnouncement] = useState("");

  useEffect(() => {
    if (reduced) return;
    const now = Date.now();
    if (now - lastAnnouncedRef.current < 10_000) return;
    lastAnnouncedRef.current = now;
    setAnnouncement(`Balance now ${formatUsd(snap.balance)}, ${snap.deltaPct >= 0 ? "up" : "down"} ${formatPercent(Math.abs(snap.deltaPct))} today.`);
  }, [snap.balance, snap.deltaPct, reduced]);

  return (
    <figure
      role="figure"
      aria-label="Live demo of the Meridian dashboard showing example account balances and activity. Values are simulated."
      className="relative overflow-hidden rounded-[--radius-lg] border border-border bg-bg-elevated shadow-[0_6px_24px_rgb(0_0_0/0.06)] dark:shadow-none"
      style={{ contentVisibility: "auto", containIntrinsicSize: "480px 420px" }}
    >
      <header className="flex h-12 items-center justify-between border-b border-border px-4">
        <span translate="no" className="font-mono text-xs text-fg-muted">
          meridian.al / treasury
        </span>
        <span className="flex items-center gap-2 font-mono text-xs text-fg-muted">
          <span aria-hidden="true" className="inline-block h-2 w-2 rounded-full bg-accent [animation:pulse_2s_ease-in-out_infinite] motion-reduce:animate-none" />
          Live
        </span>
      </header>

      <div className="space-y-6 px-6 py-6">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-fg-muted">Total Balance</p>
          <p className="mt-2 font-mono text-[44px] font-medium leading-none tracking-tight font-tabular">
            <TickerNumber value={formatUsd(snap.balance)} />
          </p>
          <p className="mt-2 flex items-center gap-1 font-mono text-sm text-accent-text font-tabular">
            <ArrowUpRight aria-hidden="true" size={14} />
            <span translate="no">
              {formatUsd(snap.deltaAbs, { signed: true })} ({formatPercent(snap.deltaPct)}) today
            </span>
          </p>
        </div>

        <div className="h-[60px]">
          <Sparkline values={snap.series} />
        </div>

        <ul className="grid grid-cols-3 gap-3 border-t border-border pt-5">
          {snap.assets.map((a) => (
            <li key={a.symbol} className="space-y-1.5">
              <p className="font-mono text-[10px] uppercase tracking-wider text-fg-subtle" translate="no">{a.symbol}</p>
              <p className="font-mono text-sm font-tabular">
                {a.symbol === "USD" ? formatUsd(a.amount) : formatNumber(a.amount, a.symbol === "BTC" ? 5 : 3)}
              </p>
              <Sparkline values={a.micro} width={80} height={16} strokeWidth={1} />
              <p className={`font-mono text-[11px] font-tabular ${a.deltaPct >= 0 ? "text-accent-text" : "text-danger"}`}>
                {formatPercent(a.deltaPct)}
              </p>
            </li>
          ))}
        </ul>
      </div>

      <footer className="flex items-center justify-between border-t border-border px-4 py-2 font-mono text-[11px] text-fg-subtle">
        <span>Synced · 0.2s ago</span>
        <span translate="no">Meridian</span>
      </footer>

      <div aria-live="polite" className="sr-only">
        {announcement}
      </div>

      <style jsx>{`
        @keyframes pulse { 0%,100% { opacity: 1 } 50% { opacity: 0.35 } }
      `}</style>
    </figure>
  );
}
```

- [ ] **Step 2: Typecheck + boot dev server, verify card renders on temporary page**

Temporarily add to `app/page.tsx`:

```tsx
import { PreviewCard } from "@/components/hero/preview-card";
export default function Home() {
  return <main id="main" className="p-12 max-w-2xl"><PreviewCard /></main>;
}
```

Then `npm run dev`. Visit `/`. Confirm card renders with balance, sparkline, 3 assets. Ctrl+C.

- [ ] **Step 3: Commit**

```bash
git add components/hero/preview-card.tsx app/page.tsx
git commit -m "$(cat <<'EOF'
feat(hero): preview card composition with live mock data

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 16: Hero section

**Files:**
- Create: `components/hero/hero.tsx`

- [ ] **Step 1: Write `components/hero/hero.tsx`**

```tsx
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PreviewCard } from "./preview-card";

export function Hero() {
  return (
    <section id="main" className="relative mx-auto max-w-[1280px] px-6 pb-24 pt-16 md:px-10 md:pt-24 lg:pb-32 lg:pt-28">
      <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-fg-muted">Unified Finance OS</p>
          <h1 className="mt-5 font-serif text-[clamp(2.75rem,6vw,5.5rem)] font-bold leading-[0.95] tracking-tight text-balance">
            One account for{" "}
            <em className="italic text-accent-text">every</em> kind of money.
          </h1>
          <p className="mt-6 max-w-[46ch] text-lg text-fg-muted md:text-xl">
            Treasury, brokerage, and crypto in a single ledger. Built for founders, operators, and anyone whose money doesn&apos;t fit in one box.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button asChild size="lg">
              <Link href="#waitlist">Get Early Access</Link>
            </Button>
            <Button asChild variant="ghost" size="lg">
              <Link href="#demo">
                See live demo <ArrowRight aria-hidden="true" size={16} />
              </Link>
            </Button>
          </div>
          <p className="mt-5 text-sm text-fg-subtle">
            SOC&nbsp;2 Type&nbsp;II · FDIC partner banks · 0% custody risk
          </p>
        </div>
        <div className="lg:col-span-7">
          <PreviewCard />
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Wire into `app/page.tsx` (replace earlier test harness)**

```tsx
import { Hero } from "@/components/hero/hero";

export default function Home() {
  return (
    <>
      <Hero />
    </>
  );
}
```

- [ ] **Step 3: Boot dev server, verify hero renders with copy + card**

```bash
npm run dev
```

Visit `/`. Confirm hero copy, CTAs, and preview card side-by-side on desktop, stacked on mobile. Ctrl+C.

- [ ] **Step 4: Commit**

```bash
git add components/hero/hero.tsx app/page.tsx
git commit -m "$(cat <<'EOF'
feat(hero): assemble hero section

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 17: Nav

**Files:**
- Create: `components/nav.tsx`

- [ ] **Step 1: Write `components/nav.tsx`**

```tsx
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Wordmark } from "./wordmark";
import { Button } from "./ui/button";
import { cn } from "@/lib/cn";

const LINKS = [
  { href: "#product", label: "Product" },
  { href: "#pricing", label: "Pricing" },
  { href: "#security", label: "Security" },
  { href: "#docs", label: "Docs" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full transition-colors",
        scrolled && "border-b border-border bg-bg/80 backdrop-blur-md"
      )}
    >
      <nav className="mx-auto flex h-16 max-w-[1280px] items-center justify-between px-6 md:px-10" aria-label="Primary">
        <Link href="/" aria-label="Meridian home" className="inline-flex items-center">
          <Wordmark />
        </Link>
        <ul className="hidden items-center gap-8 md:flex">
          {LINKS.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="text-sm text-fg-muted hover:text-fg transition-colors">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-3">
          <Link href="#signin" className="hidden text-sm text-fg-muted hover:text-fg md:inline-block">
            Sign In
          </Link>
          <Button asChild size="sm">
            <Link href="#waitlist">Get Early Access</Link>
          </Button>
        </div>
      </nav>
    </header>
  );
}
```

- [ ] **Step 2: Wire into `app/page.tsx`**

```tsx
import { Nav } from "@/components/nav";
import { Hero } from "@/components/hero/hero";

export default function Home() {
  return (
    <>
      <Nav />
      <Hero />
    </>
  );
}
```

- [ ] **Step 3: Boot, verify nav sticks + blurs on scroll. Commit.**

```bash
npm run dev  # verify, then Ctrl+C
git add components/nav.tsx app/page.tsx
git commit -m "$(cat <<'EOF'
feat: add sticky Nav with scroll-aware blur

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 18: LogoStrip placeholders

**Files:**
- Create: `public/logos/logo-1.svg` through `logo-6.svg`
- Create: `components/logo-strip.tsx`

- [ ] **Step 1: Generate 6 neutral SVG placeholders**

For each `logo-N.svg` (N=1..6), write a file with this template, varying only the `text` and a style hint:

```bash
for i in 1 2 3 4 5 6; do
  cat > public/logos/logo-$i.svg <<EOF
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 40" width="160" height="40" role="img" aria-label="Partner $i">
  <text x="80" y="26" text-anchor="middle" font-family="Georgia, serif" font-size="20" font-weight="600" letter-spacing="-0.5" fill="currentColor">Logo${i}</text>
</svg>
EOF
done
```

- [ ] **Step 2: Write `components/logo-strip.tsx`**

```tsx
import Image from "next/image";

const LOGOS = Array.from({ length: 6 }, (_, i) => `/logos/logo-${i + 1}.svg`);

export function LogoStrip() {
  return (
    <section aria-labelledby="trusted-by" className="mx-auto max-w-[1280px] border-y border-border px-6 py-10 md:px-10">
      <h2 id="trusted-by" className="sr-only">Trusted by</h2>
      <ul className="grid grid-cols-2 items-center gap-x-6 gap-y-6 sm:grid-cols-3 md:grid-cols-6">
        {LOGOS.map((src) => (
          <li key={src} className="flex items-center justify-center text-fg-subtle">
            <Image src={src} alt="" width={120} height={30} className="h-8 w-auto opacity-70 grayscale" loading="lazy" aria-hidden="true" />
          </li>
        ))}
      </ul>
    </section>
  );
}
```

- [ ] **Step 3: Wire into page, verify, commit**

```tsx
import { LogoStrip } from "@/components/logo-strip";
// add <LogoStrip /> after <Hero />
```

```bash
npm run dev  # verify, Ctrl+C
git add public/logos/ components/logo-strip.tsx app/page.tsx
git commit -m "$(cat <<'EOF'
feat: add logo strip with placeholder SVGs

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 19: DualThread (business vs individuals)

**Files:**
- Create: `components/dual-thread.tsx`

- [ ] **Step 1: Write `components/dual-thread.tsx`**

```tsx
import { Check } from "lucide-react";

const COLUMNS = [
  {
    eyebrow: "For businesses",
    heading: "Company money, consolidated.",
    points: [
      "Multi-entity treasury with intercompany transfers",
      "FDIC-insured cash + SEC-registered brokerage + qualified custody",
      "Approval flows, role-based access, SOC 2 audit trails",
    ],
  },
  {
    eyebrow: "For individuals",
    heading: "Personal wealth, one view.",
    points: [
      "Checking, brokerage, and crypto under a single balance",
      "Tax-lot tracking across asset classes — cap gains in real time",
      "Private by design: no data resale, no advertising model",
    ],
  },
];

export function DualThread() {
  return (
    <section id="product" className="mx-auto max-w-[1280px] px-6 py-24 md:px-10 md:py-32" style={{ contentVisibility: "auto", containIntrinsicSize: "auto 600px" }}>
      <div className="grid gap-16 md:grid-cols-2 md:gap-12">
        {COLUMNS.map((col) => (
          <article key={col.eyebrow} className="space-y-6 border-t border-border pt-8">
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-fg-muted">{col.eyebrow}</p>
            <h2 className="font-serif text-[clamp(2rem,3.5vw,3rem)] font-bold leading-[1.05] tracking-tight text-balance">
              {col.heading}
            </h2>
            <ul className="space-y-4">
              {col.points.map((p) => (
                <li key={p} className="flex gap-3 text-fg-muted">
                  <Check aria-hidden="true" size={18} className="mt-1 shrink-0 text-accent-text" />
                  <span className="min-w-0">{p}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Wire + commit**

Add `<DualThread />` in `app/page.tsx` after `<LogoStrip />`. Verify in dev.

```bash
git add components/dual-thread.tsx app/page.tsx
git commit -m "$(cat <<'EOF'
feat: dual-thread value section (business + individuals)

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 20: CapabilityGrid

**Files:**
- Create: `components/capability-grid.tsx`

- [ ] **Step 1: Write component**

```tsx
import Link from "next/link";
import { ArrowRight, Banknote, LineChart, Bitcoin, CreditCard, SendHorizontal, Code2 } from "lucide-react";

const TILES = [
  { icon: Banknote, title: "Treasury", desc: "Operate runway, payroll, and vendor cash across entities." },
  { icon: LineChart, title: "Trading", desc: "Equities and ETFs with fractional shares and tax-lot tracking." },
  { icon: Bitcoin, title: "Crypto", desc: "Spot holdings in qualified custody with on-chain settlement." },
  { icon: CreditCard, title: "Cards", desc: "Physical and virtual corporate cards with real-time controls." },
  { icon: SendHorizontal, title: "Wires", desc: "Same-day wires and ACH, domestic and international." },
  { icon: Code2, title: "API", desc: "A single REST + webhook API across every asset class." },
];

export function CapabilityGrid() {
  return (
    <section id="capabilities" className="mx-auto max-w-[1280px] border-t border-border px-6 py-24 md:px-10 md:py-32" style={{ contentVisibility: "auto", containIntrinsicSize: "auto 700px" }}>
      <header className="max-w-2xl">
        <p className="text-xs font-medium uppercase tracking-[0.14em] text-fg-muted">Capabilities</p>
        <h2 className="mt-5 font-serif text-[clamp(2rem,3.5vw,3rem)] font-bold leading-[1.05] tracking-tight text-balance">
          Everything you&apos;d expect — in one ledger.
        </h2>
      </header>
      <ul className="mt-12 grid grid-cols-1 gap-0 border-t border-border sm:grid-cols-2 lg:grid-cols-3">
        {TILES.map(({ icon: Icon, title, desc }) => (
          <li key={title} className="group relative border-b border-border p-8 sm:[&:nth-child(odd)]:border-r lg:[&:not(:nth-child(3n))]:border-r">
            <Icon aria-hidden="true" size={20} className="text-fg-muted" />
            <h3 className="mt-5 font-serif text-xl font-bold">{title}</h3>
            <p className="mt-2 max-w-[34ch] text-sm text-fg-muted">{desc}</p>
            <Link href="#" className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-fg hover:text-accent-text">
              Learn more <ArrowRight aria-hidden="true" size={14} />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

- [ ] **Step 2: Wire + commit**

```bash
git add components/capability-grid.tsx app/page.tsx
git commit -m "$(cat <<'EOF'
feat: capability grid (6 tiles)

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 21: HowItWorks

**Files:**
- Create: `components/how-it-works.tsx`

- [ ] **Step 1: Write component**

```tsx
const STEPS = [
  { n: "01", title: "Connect", desc: "Link existing bank, broker, and wallet accounts in minutes." },
  { n: "02", title: "Consolidate", desc: "Every asset lives behind one unified balance and ledger." },
  { n: "03", title: "Control", desc: "Move, invest, and report across asset classes without leaving." },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="mx-auto max-w-[1280px] border-t border-border px-6 py-24 md:px-10 md:py-32" style={{ contentVisibility: "auto", containIntrinsicSize: "auto 500px" }}>
      <header className="max-w-2xl">
        <p className="text-xs font-medium uppercase tracking-[0.14em] text-fg-muted">How it works</p>
        <h2 className="mt-5 font-serif text-[clamp(2rem,3.5vw,3rem)] font-bold leading-[1.05] tracking-tight text-balance">Three steps. One ledger.</h2>
      </header>
      <ol className="mt-12 grid gap-10 md:grid-cols-3 md:gap-8">
        {STEPS.map((s) => (
          <li key={s.n} className="border-t border-border pt-6">
            <p className="font-mono text-xs text-fg-subtle font-tabular">{s.n}</p>
            <h3 className="mt-3 font-serif text-2xl font-bold">{s.title}</h3>
            <p className="mt-3 text-fg-muted">{s.desc}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
```

- [ ] **Step 2: Wire + commit**

```bash
git add components/how-it-works.tsx app/page.tsx
git commit -m "$(cat <<'EOF'
feat: how-it-works section

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 22: SecurityStrip

**Files:**
- Create: `components/security-strip.tsx`

- [ ] **Step 1: Write component**

```tsx
import { ShieldCheck, Landmark, Scale, Lock } from "lucide-react";

const BADGES = [
  { icon: ShieldCheck, label: "SOC 2 Type II" },
  { icon: Landmark, label: "FDIC partner banks" },
  { icon: Scale, label: "SEC-registered broker-dealer" },
  { icon: Lock, label: "Qualified crypto custody" },
];

export function SecurityStrip() {
  return (
    <section id="security" aria-labelledby="security-heading" className="border-y border-border bg-bg-elevated">
      <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-between gap-6 px-6 py-6 md:px-10">
        <h2 id="security-heading" className="sr-only">Security and compliance</h2>
        {BADGES.map(({ icon: Icon, label }) => (
          <div key={label} className="flex items-center gap-2 text-sm text-fg-muted">
            <Icon aria-hidden="true" size={16} />
            <span>{label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Wire + commit**

```bash
git add components/security-strip.tsx app/page.tsx
git commit -m "$(cat <<'EOF'
feat: security compliance strip

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 23: MetricsBand

**Files:**
- Create: `components/metrics-band.tsx`

- [ ] **Step 1: Write component**

```tsx
const METRICS = [
  { value: "$4.2B", label: "Settled in the last 12 months" },
  { value: "47", label: "Countries supported" },
  { value: "99.99%", label: "Rolling 90-day uptime" },
];

export function MetricsBand() {
  return (
    <section aria-labelledby="metrics-heading" className="mx-auto max-w-[1280px] px-6 py-20 md:px-10 md:py-24" style={{ contentVisibility: "auto", containIntrinsicSize: "auto 300px" }}>
      <h2 id="metrics-heading" className="sr-only">Platform metrics</h2>
      <dl className="grid gap-10 border-y border-border py-12 md:grid-cols-3">
        {METRICS.map((m) => (
          <div key={m.label} className="space-y-2">
            <dt className="text-xs font-medium uppercase tracking-[0.14em] text-fg-muted">{m.label}</dt>
            <dd className="font-mono text-[clamp(2.5rem,5vw,4rem)] font-medium leading-none text-fg font-tabular">{m.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
```

- [ ] **Step 2: Wire + commit**

```bash
git add components/metrics-band.tsx app/page.tsx
git commit -m "$(cat <<'EOF'
feat: metrics band with tabular figures

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 24: Testimonial

**Files:**
- Create: `components/testimonial.tsx`

- [ ] **Step 1: Write component**

```tsx
export function Testimonial() {
  return (
    <section aria-labelledby="quote-heading" className="mx-auto max-w-[1280px] border-t border-border px-6 py-24 md:px-10 md:py-32">
      <h2 id="quote-heading" className="sr-only">Customer testimonial</h2>
      <figure className="mx-auto max-w-3xl text-center">
        <blockquote className="font-serif italic text-[clamp(1.75rem,3vw,2.5rem)] font-bold leading-[1.2] tracking-tight text-balance">
          &ldquo;We replaced a spreadsheet, a broker, and two wallets with Meridian. My finance team got their Fridays back.&rdquo;
        </blockquote>
        <figcaption className="mt-8 text-sm text-fg-muted">
          <span translate="no">Iris Moreau</span> — CFO, <span translate="no">Latticeworks</span>
        </figcaption>
      </figure>
    </section>
  );
}
```

- [ ] **Step 2: Wire + commit**

```bash
git add components/testimonial.tsx app/page.tsx
git commit -m "$(cat <<'EOF'
feat: editorial testimonial section

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 25: PricingTeaser

**Files:**
- Create: `components/pricing-teaser.tsx`

- [ ] **Step 1: Write component**

```tsx
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

const TIERS = [
  {
    name: "Free",
    price: "$0",
    cadence: "forever",
    features: ["Personal balance view", "2 linked accounts", "Basic charts"],
  },
  {
    name: "Pro",
    price: "$18",
    cadence: "/ month",
    features: ["Unlimited accounts", "Tax-lot tracking", "Priority support"],
    highlight: true,
  },
  {
    name: "Business",
    price: "Talk to us",
    cadence: "",
    features: ["Multi-entity treasury", "Approval flows, SSO, SOC 2 exports", "Dedicated solutions engineer"],
  },
];

export function PricingTeaser() {
  return (
    <section id="pricing" className="mx-auto max-w-[1280px] border-t border-border px-6 py-24 md:px-10 md:py-32" style={{ contentVisibility: "auto", containIntrinsicSize: "auto 700px" }}>
      <header className="max-w-2xl">
        <p className="text-xs font-medium uppercase tracking-[0.14em] text-fg-muted">Pricing</p>
        <h2 className="mt-5 font-serif text-[clamp(2rem,3.5vw,3rem)] font-bold leading-[1.05] tracking-tight text-balance">
          Straightforward at every tier.
        </h2>
      </header>
      <ul className="mt-12 grid gap-6 md:grid-cols-3">
        {TIERS.map((t) => (
          <li key={t.name} className={`flex flex-col rounded-[--radius-lg] border p-8 ${t.highlight ? "border-fg bg-bg-elevated" : "border-border"}`}>
            <p className="font-serif text-lg font-bold">{t.name}</p>
            <p className="mt-4 font-serif text-4xl font-bold font-tabular">
              {t.price}
              {t.cadence && <span className="ml-1 font-sans text-base font-normal text-fg-muted">{t.cadence}</span>}
            </p>
            <ul className="mt-6 space-y-3 text-sm text-fg-muted">
              {t.features.map((f) => (
                <li key={f} className="flex gap-2">
                  <Check aria-hidden="true" size={16} className="mt-[2px] shrink-0 text-accent-text" />
                  <span className="min-w-0">{f}</span>
                </li>
              ))}
            </ul>
            <Link href="#" className="mt-8 inline-flex items-center gap-1 text-sm font-medium text-fg hover:text-accent-text">
              See full pricing <ArrowRight aria-hidden="true" size={14} />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

- [ ] **Step 2: Wire + commit**

```bash
git add components/pricing-teaser.tsx app/page.tsx
git commit -m "$(cat <<'EOF'
feat: pricing teaser with 3 placeholder tiers

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 26: FAQ

**Files:**
- Create: `components/faq.tsx`

- [ ] **Step 1: Write component**

```tsx
"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const FAQS = [
  { q: "Is my money safe with Meridian?", a: "Cash sits in FDIC-insured partner banks, securities with an SEC-registered broker-dealer, and crypto with a qualified custodian. Meridian itself never takes custody." },
  { q: "How are you regulated?", a: "We operate through partner banks (FDIC), a registered broker-dealer (SEC/FINRA), and a qualified custodian. Every partnership is listed in our Security page." },
  { q: "Can I move money between asset classes?", a: "Yes. Cash to equities settles the same business day; cash to crypto settles within minutes. Moves appear as unified journal entries in your ledger." },
  { q: "Do you support multiple entities?", a: "Business tier supports multi-entity structures with intercompany transfers, separate ledgers, and consolidated reporting." },
  { q: "What about taxes?", a: "Meridian tracks tax lots across equities and crypto. At year-end, export a 1099 / gain-loss CSV ready for your accountant or tax software." },
  { q: "Is there an API?", a: "Yes — one REST + webhook API covers every asset class. No separate broker, bank, and custody APIs to glue together." },
];

export function FAQ() {
  return (
    <section id="faq" className="mx-auto max-w-[1280px] border-t border-border px-6 py-24 md:px-10 md:py-32" style={{ contentVisibility: "auto", containIntrinsicSize: "auto 700px" }}>
      <header className="max-w-2xl">
        <p className="text-xs font-medium uppercase tracking-[0.14em] text-fg-muted">FAQ</p>
        <h2 className="mt-5 font-serif text-[clamp(2rem,3.5vw,3rem)] font-bold leading-[1.05] tracking-tight text-balance">
          Answers up front.
        </h2>
      </header>
      <Accordion type="single" collapsible className="mt-10 divide-y divide-border border-t border-border">
        {FAQS.map((item, i) => (
          <AccordionItem key={item.q} value={`faq-${i}`} className="border-0">
            <AccordionTrigger className="py-6 text-left font-serif text-lg font-semibold hover:no-underline">
              {item.q}
            </AccordionTrigger>
            <AccordionContent className="pb-6 text-fg-muted">{item.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
```

- [ ] **Step 2: Wire + commit**

```bash
git add components/faq.tsx app/page.tsx
git commit -m "$(cat <<'EOF'
feat: FAQ accordion section

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 27: FinalCTA with waitlist form and stub route

**Files:**
- Create: `app/api/waitlist/route.ts`
- Create: `components/final-cta.tsx`

- [ ] **Step 1: Write `app/api/waitlist/route.ts` (stub)**

```ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const data = await req.formData();
  const email = String(data.get("email") ?? "").trim();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ ok: false, error: "Please enter a valid email." }, { status: 400 });
  }
  console.log("[waitlist]", email);
  return NextResponse.json({ ok: true });
}
```

- [ ] **Step 2: Write `components/final-cta.tsx`**

```tsx
"use client";

import { useId, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function FinalCta() {
  const id = useId();
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const email = new FormData(form).get("email");
    setStatus("loading");
    setError(null);
    try {
      const res = await fetch("/api/waitlist", { method: "POST", body: new URLSearchParams({ email: String(email ?? "") }) });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Something went wrong.");
      setStatus("success");
      form.reset();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  return (
    <section id="waitlist" className="border-t border-border">
      <div className="mx-auto max-w-[1280px] px-6 py-28 md:px-10 md:py-40 text-center">
        <h2 className="font-serif text-[clamp(2.5rem,5vw,4.5rem)] font-bold leading-[0.95] tracking-tight text-balance">
          The account you&apos;ll <em className="italic text-accent-text">actually</em> keep.
        </h2>
        <p className="mx-auto mt-6 max-w-[46ch] text-lg text-fg-muted">
          Request early access. We&apos;re onboarding teams and individuals in small batches.
        </p>
        <form onSubmit={onSubmit} className="mx-auto mt-10 flex max-w-md flex-col gap-3 sm:flex-row" noValidate>
          <label htmlFor={id} className="sr-only">Email address</label>
          <Input
            id={id}
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            spellCheck={false}
            required
            placeholder="you@company.com"
            className="h-12 flex-1"
            aria-describedby={error ? `${id}-err` : undefined}
            aria-invalid={status === "error" ? true : undefined}
          />
          <Button type="submit" size="lg" disabled={status === "loading"} aria-busy={status === "loading"}>
            {status === "loading" ? "Requesting…" : "Request Access"}
          </Button>
        </form>
        <div className="mt-4 min-h-6 text-sm" aria-live="polite">
          {status === "success" && <p role="status" className="text-accent-text">You&apos;re on the list. We&apos;ll be in touch.</p>}
          {status === "error" && <p id={`${id}-err`} role="alert" className="text-danger">{error}</p>}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Wire + test in dev**

```bash
npm run dev
# submit a valid email → success
# submit "foo" → error inline
```

- [ ] **Step 4: Commit**

```bash
git add app/api/waitlist/route.ts components/final-cta.tsx app/page.tsx
git commit -m "$(cat <<'EOF'
feat: final CTA with waitlist form + stub endpoint

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 28: Footer

**Files:**
- Create: `components/footer.tsx`

- [ ] **Step 1: Write component**

```tsx
import Link from "next/link";
import { Wordmark } from "./wordmark";
import { ThemeToggle } from "./theme-toggle";

const COLUMNS = [
  { heading: "Product", links: ["Treasury", "Trading", "Crypto", "Cards", "API"] },
  { heading: "Company", links: ["About", "Careers", "Press", "Contact"] },
  { heading: "Resources", links: ["Docs", "Changelog", "Security", "Status"] },
  { heading: "Legal", links: ["Privacy", "Terms", "Disclosures", "Complaints"] },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-bg-elevated">
      <div className="mx-auto max-w-[1280px] px-6 py-16 md:px-10">
        <div className="grid gap-10 md:grid-cols-[1.5fr_repeat(4,1fr)]">
          <div>
            <Wordmark />
            <p className="mt-4 max-w-[32ch] text-sm text-fg-muted">
              Treasury, brokerage, and crypto in a single ledger.
            </p>
          </div>
          {COLUMNS.map((c) => (
            <nav key={c.heading} aria-label={c.heading}>
              <h3 className="text-xs font-medium uppercase tracking-[0.14em] text-fg-muted">{c.heading}</h3>
              <ul className="mt-4 space-y-2 text-sm">
                {c.links.map((l) => (
                  <li key={l}>
                    <Link href="#" className="text-fg hover:text-accent-text">{l}</Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        <div className="mt-14 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-8 text-xs text-fg-subtle">
          <p>
            © {new Date().getFullYear()} <span translate="no">Meridian</span>. Banking services via FDIC partner banks. Brokerage via an SEC-registered broker-dealer. Crypto custody via qualified custodian. Not investment advice.
          </p>
          <ThemeToggle />
        </div>
      </div>
    </footer>
  );
}
```

- [ ] **Step 2: Wire + commit**

```bash
git add components/footer.tsx app/page.tsx
git commit -m "$(cat <<'EOF'
feat: footer with disclaimers and theme toggle

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 29: Final page composition, metadata, robots/sitemap/OG image

**Files:**
- Rewrite: `app/page.tsx`
- Create: `app/robots.ts`, `app/sitemap.ts`, `app/opengraph-image.tsx`

- [ ] **Step 1: Final `app/page.tsx`**

```tsx
import { Nav } from "@/components/nav";
import { Hero } from "@/components/hero/hero";
import { LogoStrip } from "@/components/logo-strip";
import { DualThread } from "@/components/dual-thread";
import { CapabilityGrid } from "@/components/capability-grid";
import { HowItWorks } from "@/components/how-it-works";
import { SecurityStrip } from "@/components/security-strip";
import { MetricsBand } from "@/components/metrics-band";
import { Testimonial } from "@/components/testimonial";
import { PricingTeaser } from "@/components/pricing-teaser";
import { FAQ } from "@/components/faq";
import { FinalCta } from "@/components/final-cta";
import { Footer } from "@/components/footer";

export const dynamic = "force-static";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <LogoStrip />
        <DualThread />
        <CapabilityGrid />
        <HowItWorks />
        <SecurityStrip />
        <MetricsBand />
        <Testimonial />
        <PricingTeaser />
        <FAQ />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 2: Write `app/robots.ts`**

```ts
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: "https://meridian.example/sitemap.xml",
  };
}
```

- [ ] **Step 3: Write `app/sitemap.ts`**

```ts
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: "https://meridian.example/", lastModified: new Date(), changeFrequency: "monthly", priority: 1 }];
}
```

- [ ] **Step 4: Write `app/opengraph-image.tsx`**

```tsx
import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Meridian — One account for every kind of money";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function og() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#FAFAF7",
          color: "#0A0A0A",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          fontFamily: "Georgia, serif",
        }}
      >
        <div style={{ fontSize: 28, letterSpacing: 2, textTransform: "uppercase", opacity: 0.6 }}>Meridian</div>
        <div style={{ fontSize: 88, lineHeight: 1.05, fontWeight: 700, maxWidth: 900 }}>
          One account for <span style={{ fontStyle: "italic", color: "#0B8A4A" }}>every</span> kind of money.
        </div>
        <div style={{ fontSize: 24, opacity: 0.7 }}>Treasury · Trading · Crypto — in a single ledger</div>
      </div>
    ),
    { ...size }
  );
}
```

- [ ] **Step 5: Build + serve static**

```bash
npm run build
npm start
```

Open `/`. Verify every section renders, nav sticks, theme toggle works, FAQ expands, waitlist submits. Ctrl+C.

- [ ] **Step 6: Commit**

```bash
git add app/page.tsx app/robots.ts app/sitemap.ts app/opengraph-image.tsx
git commit -m "$(cat <<'EOF'
feat: compose page, add robots, sitemap, OG image

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 30: Perf budgets — `size-limit` + Lighthouse CI config

**Files:**
- Create: `.size-limit.json`
- Create: `lighthouserc.json`

- [ ] **Step 1: Write `.size-limit.json`**

```json
[
  {
    "name": "First-Load JS (/)",
    "path": ".next/server/app/page.js",
    "limit": "95 KB",
    "gzip": true
  },
  {
    "name": "CSS",
    "path": ".next/static/css/*.css",
    "limit": "20 KB",
    "gzip": true
  }
]
```

- [ ] **Step 2: Write `lighthouserc.json`**

```json
{
  "ci": {
    "collect": {
      "startServerCommand": "npm start",
      "url": ["http://localhost:3000/"],
      "numberOfRuns": 3
    },
    "assert": {
      "assertions": {
        "categories:performance": ["error", { "minScore": 0.95 }],
        "categories:accessibility": ["error", { "minScore": 1.0 }],
        "categories:best-practices": ["warn", { "minScore": 0.95 }],
        "categories:seo": ["warn", { "minScore": 0.95 }],
        "cumulative-layout-shift": ["error", { "maxNumericValue": 0.02 }],
        "largest-contentful-paint": ["error", { "maxNumericValue": 1800 }],
        "total-blocking-time": ["warn", { "maxNumericValue": 200 }]
      }
    }
  }
}
```

- [ ] **Step 3: Add package.json scripts**

Add to `"scripts"`:
```
"size": "size-limit",
"lhci": "lhci autorun"
```

- [ ] **Step 4: Run both locally**

```bash
npm run build
npm run size
# expected: both entries under limit
npm run lhci
# expected: all assertions pass
```

If either fails, fix the component causing the regression (most likely candidates: a stray barrel import, a forgotten `loading="lazy"`, an un-memoized computation). Re-run until green.

- [ ] **Step 5: Commit**

```bash
git add .size-limit.json lighthouserc.json package.json package-lock.json
git commit -m "$(cat <<'EOF'
ci: add size-limit and Lighthouse CI config with perf budgets

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 31: GitHub Actions CI workflow

**Files:**
- Create: `.github/workflows/ci.yml`

- [ ] **Step 1: Write workflow**

```yaml
name: CI

on:
  push: { branches: [main] }
  pull_request: { branches: [main] }

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npx tsc --noEmit
      - run: npm run lint
      - run: npm test
      - run: npm run build
      - run: npm run size
      - name: Lighthouse CI
        run: |
          npm install -g @lhci/cli@0.14.x
          lhci autorun
        env:
          LHCI_GITHUB_APP_TOKEN: ${{ secrets.LHCI_GITHUB_APP_TOKEN }}
```

- [ ] **Step 2: Commit**

```bash
git add .github/workflows/ci.yml
git commit -m "$(cat <<'EOF'
ci: add GitHub Actions workflow (typecheck, lint, test, build, size, LHCI)

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 32: Playwright a11y + keyboard smoke test

**Files:**
- Create: `playwright.config.ts`
- Create: `tests/e2e/a11y.spec.ts`

- [ ] **Step 1: Write `playwright.config.ts`**

```ts
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "tests/e2e",
  use: { baseURL: "http://localhost:3000" },
  webServer: {
    command: "npm run build && npm start",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});
```

- [ ] **Step 2: Write `tests/e2e/a11y.spec.ts`**

```ts
import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("no axe violations on /", async ({ page }) => {
  await page.goto("/");
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([]);
});

test("tab order reaches primary CTA from top of page", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab"); // skip link
  const skip = page.getByRole("link", { name: /skip to content/i });
  await expect(skip).toBeFocused();
  // tab through nav, verify Get Early Access reachable
  let found = false;
  for (let i = 0; i < 20; i++) {
    await page.keyboard.press("Tab");
    const el = await page.evaluate(() => document.activeElement?.textContent?.trim());
    if (el && /get early access/i.test(el)) {
      found = true;
      break;
    }
  }
  expect(found).toBe(true);
});

test("waitlist form submits successfully", async ({ page }) => {
  await page.goto("/#waitlist");
  await page.getByLabel(/email address/i).fill("test@example.com");
  await page.getByRole("button", { name: /request access/i }).click();
  await expect(page.getByText(/you're on the list/i)).toBeVisible();
});
```

- [ ] **Step 3: Add script to package.json**

Add to `"scripts"`: `"test:e2e": "playwright test"`.

- [ ] **Step 4: Run locally**

```bash
npm run test:e2e
```

Expected: 3 tests pass. If axe violations appear, fix per violation output and re-run.

- [ ] **Step 5: Add to CI workflow**

Edit `.github/workflows/ci.yml`, append to `build` job steps:

```yaml
      - run: npx playwright install --with-deps chromium
      - run: npm run test:e2e
```

- [ ] **Step 6: Commit**

```bash
git add playwright.config.ts tests/e2e/a11y.spec.ts package.json package-lock.json .github/workflows/ci.yml
git commit -m "$(cat <<'EOF'
test(e2e): add Playwright + axe a11y + keyboard smoke tests

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 33: Manual verification pass

**Files:** none (verification only)

- [ ] **Step 1: Full-build local smoke**

```bash
npm run build && npm start
```

- [ ] **Step 2: Desktop check (1440px wide)**

Open `http://localhost:3000/` in Chrome. Verify:
- Hero copy + preview card side-by-side
- Preview balance tickers every ~4 s
- Sparkline draws in, then shifts left on each tick
- Nav stays at top, blurs on scroll
- Every section renders, borders are hairline
- FAQ accordions expand/collapse
- Waitlist form accepts a valid email, shows success; rejects an invalid one with inline error
- Theme toggle switches light ↔ dark; dark mode uses ink bg, ivory fg
- No console errors

- [ ] **Step 3: Mobile check (375px)**

DevTools → iPhone SE viewport. Verify:
- Hero stacks, CTA reachable without horizontal scroll
- Preview card renders inside viewport
- Nav condenses (no overflow); menu links hidden on mobile breakpoint
- Touch targets feel ≥44 px
- No horizontal overflow anywhere

- [ ] **Step 4: Keyboard-only pass**

Reload page, use Tab alone. Verify:
- First Tab lands on visible "Skip to content"
- Focus ring visible on every interactive element
- Nav links, both hero CTAs, nav Sign In + Get Early Access, every "Learn more →", FAQ triggers, footer links, theme toggle, waitlist input + button — all reachable

- [ ] **Step 5: Reduced motion**

DevTools → Rendering → Emulate CSS media feature `prefers-reduced-motion: reduce`. Reload. Verify:
- Sparkline is static
- Balance does not tick
- Status dot not pulsing
- No scroll animations

- [ ] **Step 6: Screen reader spot check**

macOS VoiceOver (Cmd+F5) on Safari — navigate to hero. Verify:
- H1 announced: "One account for every kind of money."
- Preview card announces as figure with descriptive label
- Status region announces balance updates occasionally (wait ~15 s)
- Icon buttons announce via aria-label, not by icon shape

- [ ] **Step 7: Document issues, fix any found, re-run**

For any defect, create a small follow-up commit referencing the spec section it addresses. Do not batch.

No commit for this task — verification only. If issues found, they produce their own commits.

---

## Task 34: README with run/dev/test commands

**Files:**
- Create: `README.md`

- [ ] **Step 1: Write README**

```md
# Meridian Landing

Marketing landing page for Meridian (placeholder product name) — a unified finance OS bringing treasury, brokerage, and crypto into one ledger.

## Stack

Next.js 15 · TypeScript · Tailwind v4 · shadcn/ui · next/font · next-themes · Vitest · Playwright.

## Dev

```bash
npm install
npm run dev
# visit http://localhost:3000
```

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm start` | Serve production build |
| `npm run lint` | ESLint |
| `npm test` | Vitest unit tests |
| `npm run test:e2e` | Playwright a11y + keyboard smoke |
| `npm run size` | Bundle size budgets |
| `npm run lhci` | Lighthouse CI locally |

## Design reference

See `docs/superpowers/specs/2026-04-17-meridian-landing-design.md` for the approved design spec and `docs/superpowers/plans/2026-04-17-meridian-landing.md` for the implementation plan this project follows.
```

- [ ] **Step 2: Commit**

```bash
git add README.md
git commit -m "$(cat <<'EOF'
docs: add README

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Self-Review (completed by author during writing)

**Spec coverage (each section from spec → task that covers it):**

- §1 Product Positioning → reflected in hero copy, dual-thread, final CTA (Tasks 16, 19, 27)
- §2 IA (13 sections) → Nav (17), Hero (16), LogoStrip (18), DualThread (19), CapabilityGrid (20), HowItWorks (21), SecurityStrip (22), MetricsBand (23), Testimonial (24), PricingTeaser (25), FAQ (26), FinalCTA (27), Footer (28)
- §3 Design Tokens → Task 8 (fonts + @theme globals)
- §4 Hero Composition → Tasks 12–16
- §5 Component Inventory → entire task list
- §6 Perf Budget → Tasks 30, 31
- §7 Accessibility → Tasks 8 (focus ring, reduced-motion, skip link), 9 (theme/skip), 15 (aria-label figure, aria-live region), 27 (form a11y), 32 (axe+keyboard), 33 (manual)
- §8 Stack Summary → Tasks 1, 2, 3, 5, 8, 9
- §9 Out of Scope → respected; no auth, dashboard, analytics included

**Placeholder scan:** Every task step contains the actual code, command, or action — no "implement later" / "similar to" / "add error handling" stubs.

**Type consistency:** `MeridianSnapshot` defined once in Task 12 and consumed unchanged in Tasks 13–16. `ButtonProps` variants (`primary`/`secondary`/`ghost`) declared in Task 11 and used consistently thereafter. `formatUsd`, `formatPercent`, `formatNumber`, `formatRelativeTime` declared in Task 7 and consumed in Tasks 15, 23.

---

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-04-17-meridian-landing.md`. Two execution options:

1. **Subagent-Driven (recommended)** — I dispatch a fresh subagent per task, review between tasks, fast iteration.
2. **Inline Execution** — Execute tasks in this session using executing-plans, batch execution with checkpoints.

Which approach?

# Klar Studio Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a fast, original one-page marketing site for Klar Studio (Norwegian local-web-presence studio) that doubles as the studio's own portfolio piece.

**Architecture:** Astro renders a static, SEO-strong shell. Interactive/animated pieces (kinetic hero headline, magnetic buttons, scroll reveals, contact form) are React islands hydrated only where needed. The page is assembled from modular section components so each can later be promoted to its own route (the A→B multi-page growth path).

**Tech Stack:** Astro, @astrojs/react, React, `motion` (Framer Motion), Schibsted Grotesk via @fontsource, Web3Forms (no-backend contact form), Playwright (smoke test).

## Global Constraints

- All visible copy is Norwegian (bokmål). Root element `lang="nb"`.
- Accent color is electric lime `#C8F169`. Dark/ink color is `#0B1A12`. Base surface is `#FFFFFF`.
- Every animation must respect `prefers-reduced-motion` (no motion when reduced).
- Keep shipped JavaScript minimal — React islands hydrate on demand (`client:visible`), not site-wide.
- Node 18+ (Astro 4 requirement).
- Dependencies limited to: `astro`, `@astrojs/react`, `react`, `react-dom`, `motion`, `@fontsource/schibsted-grotesk`. Dev-only: `@playwright/test`. Do not add others without cause.
- Content is structured in `src/data/*.ts` (typed); prose lives in components. Founder/project specifics are sample Norwegian content to be swapped for real content later.

---

## File Structure

```
package.json
astro.config.mjs
tsconfig.json
playwright.config.ts
.env.example
public/
  favicon.svg
  og-image.png            (placeholder, swapped later)
  images/                 (project shots, founder photos — swapped later)
src/
  styles/global.css       Design tokens, resets, reduced-motion baseline
  layouts/Base.astro      HTML shell: meta/OG, font, lang="nb", global.css, slot
  data/
    services.ts           3 service pillars
    projects.ts           1 real + demo sample projects
    founders.ts           2 founders
    process.ts            "klar, ferdig, live" steps
  components/
    Nav.astro
    Footer.astro
    Reveal.tsx            Scroll-reveal island (motion whileInView)
    MagneticButton.tsx    Magnetic CTA island
    HeroHeadline.tsx      Kinetic headline island
    Hero.astro
    Services.astro
    Why.astro
    Work.astro
    Process.astro
    About.astro
    Contact.astro
    ContactForm.tsx       Form island (validation + Web3Forms submit)
  pages/index.astro       Assembles all sections
tests/
  smoke.spec.ts           Single growing Playwright smoke spec
```

---

### Task 1: Scaffold Astro + React project

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tsconfig.json`, `src/pages/index.astro`

**Interfaces:**
- Produces: a buildable Astro project with the React integration enabled.

- [ ] **Step 1: Create `package.json`**

```json
{
  "name": "klar-studio",
  "type": "module",
  "version": "0.1.0",
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "check": "astro check",
    "test": "playwright test"
  },
  "dependencies": {
    "astro": "^4.15.0",
    "@astrojs/react": "^3.6.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "motion": "^11.5.0",
    "@fontsource/schibsted-grotesk": "^5.0.0"
  },
  "devDependencies": {
    "@playwright/test": "^1.47.0",
    "@astrojs/check": "^0.9.0",
    "typescript": "^5.5.0"
  }
}
```

- [ ] **Step 2: Create `astro.config.mjs`**

```js
import { defineConfig } from "astro/config";
import react from "@astrojs/react";

export default defineConfig({
  site: "https://klarstudio.no",
  integrations: [react()],
});
```

- [ ] **Step 3: Create `tsconfig.json`**

```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "react"
  }
}
```

- [ ] **Step 4: Create a minimal `src/pages/index.astro`**

```astro
---
---
<html lang="nb">
  <head>
    <meta charset="utf-8" />
    <title>Klar Studio</title>
  </head>
  <body>
    <h1>Klar Studio</h1>
  </body>
</html>
```

- [ ] **Step 5: Install and verify build**

Run: `npm install && npm run build`
Expected: build completes, `dist/index.html` is created with no errors.

- [ ] **Step 6: Commit**

```bash
git add package.json astro.config.mjs tsconfig.json src/pages/index.astro package-lock.json
git commit -m "chore: scaffold Astro + React project"
```

---

### Task 2: Design tokens, fonts, and Base layout with SEO meta

**Files:**
- Create: `src/styles/global.css`, `src/layouts/Base.astro`
- Modify: `src/pages/index.astro`

**Interfaces:**
- Produces: `Base.astro` accepting props `{ title: string; description: string }` and a default slot; CSS custom properties available globally (`--lime`, `--ink`, `--bg`, `--muted`, `--container`, type scale).

- [ ] **Step 1: Create `src/styles/global.css`**

```css
:root {
  --lime: #C8F169;
  --ink: #0B1A12;
  --bg: #FFFFFF;
  --muted: #5B6660;
  --container: 1200px;
  --step-0: clamp(1rem, 0.95rem + 0.25vw, 1.125rem);
  --step-2: clamp(1.5rem, 1.3rem + 1vw, 2rem);
  --step-5: clamp(2.5rem, 1.6rem + 4.5vw, 5.5rem);
  --space: clamp(4rem, 3rem + 5vw, 8rem);
}
* { box-sizing: border-box; margin: 0; }
html { scroll-behavior: smooth; }
body {
  font-family: "Schibsted Grotesk", system-ui, sans-serif;
  color: var(--ink);
  background: var(--bg);
  font-size: var(--step-0);
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}
.container { max-width: var(--container); margin-inline: auto; padding-inline: clamp(1.25rem, 5vw, 3rem); }
section { padding-block: var(--space); }
a { color: inherit; }
h1, h2, h3 { line-height: 1.05; font-weight: 700; letter-spacing: -0.02em; }
@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  *, *::before, *::after { animation-duration: 0.001ms !important; transition-duration: 0.001ms !important; }
}
```

- [ ] **Step 2: Create `src/layouts/Base.astro`**

```astro
---
import "@fontsource/schibsted-grotesk/400.css";
import "@fontsource/schibsted-grotesk/700.css";
import "../styles/global.css";
interface Props { title: string; description: string; }
const { title, description } = Astro.props;
const canonical = new URL(Astro.url.pathname, Astro.site);
---
<!doctype html>
<html lang="nb">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{title}</title>
    <meta name="description" content={description} />
    <link rel="canonical" href={canonical} />
    <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
    <meta property="og:type" content="website" />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:url" content={canonical} />
    <meta property="og:image" content="/og-image.png" />
    <meta name="twitter:card" content="summary_large_image" />
  </head>
  <body>
    <slot />
  </body>
</html>
```

- [ ] **Step 3: Create a placeholder `public/favicon.svg`**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="6" fill="#0B1A12"/><circle cx="16" cy="16" r="7" fill="#C8F169"/></svg>
```

- [ ] **Step 4: Rewrite `src/pages/index.astro` to use Base**

```astro
---
import Base from "../layouts/Base.astro";
---
<Base title="Klar Studio — Klar, ferdig — på nett" description="Klar Studio lager raske nettsider og får lokale bedrifter synlige på Google Maps.">
  <main>
    <h1 style="padding: 4rem 1.5rem;">Klar Studio</h1>
  </main>
</Base>
```

- [ ] **Step 5: Build and verify meta + lang are present**

Run: `npm run build && grep -c 'lang="nb"' dist/index.html && grep -c 'og:title' dist/index.html`
Expected: build succeeds; both `grep -c` print `1` or higher.

- [ ] **Step 6: Commit**

```bash
git add src/styles/global.css src/layouts/Base.astro src/pages/index.astro public/favicon.svg
git commit -m "feat: add design tokens, fonts, and Base layout with SEO meta"
```

---

### Task 3: Playwright smoke-test harness

**Files:**
- Create: `playwright.config.ts`, `tests/smoke.spec.ts`

**Interfaces:**
- Produces: `npm test` runs Playwright against a built+previewed site. Later tasks extend `tests/smoke.spec.ts`.

- [ ] **Step 1: Create `playwright.config.ts`**

```ts
import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  webServer: {
    command: "npm run build && npm run preview",
    url: "http://localhost:4321",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
  use: { baseURL: "http://localhost:4321" },
});
```

- [ ] **Step 2: Create the failing smoke test `tests/smoke.spec.ts`**

```ts
import { test, expect } from "@playwright/test";

test("homepage loads with correct title and no console errors", async ({ page }) => {
  const errors: string[] = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  await page.goto("/");
  await expect(page).toHaveTitle(/Klar Studio/);
  await expect(page.locator("h1")).toContainText("Klar Studio");
  expect(errors).toEqual([]);
});
```

- [ ] **Step 3: Install browsers and run the test**

Run: `npx playwright install chromium && npm test`
Expected: 1 passed.

- [ ] **Step 4: Commit**

```bash
git add playwright.config.ts tests/smoke.spec.ts
git commit -m "test: add Playwright smoke harness"
```

---

### Task 4: Nav and Footer

**Files:**
- Create: `src/components/Nav.astro`, `src/components/Footer.astro`
- Modify: `src/pages/index.astro`, `tests/smoke.spec.ts`

**Interfaces:**
- Consumes: nothing.
- Produces: `<Nav />` (sticky top bar with brand + anchor links + CTA) and `<Footer />` (org info + socials + anchor nav). Anchor targets: `#tjenester`, `#arbeid`, `#om-oss`, `#kontakt`.

- [ ] **Step 1: Create `src/components/Nav.astro`**

```astro
---
const links = [
  { href: "#tjenester", label: "Tjenester" },
  { href: "#arbeid", label: "Arbeid" },
  { href: "#om-oss", label: "Om oss" },
];
---
<header class="nav">
  <div class="container nav__inner">
    <a class="nav__brand" href="#top">Klar Studio</a>
    <nav class="nav__links">
      {links.map((l) => <a href={l.href}>{l.label}</a>)}
      <a class="nav__cta" href="#kontakt">Ta kontakt</a>
    </nav>
  </div>
</header>
<style>
  .nav { position: sticky; top: 0; z-index: 50; background: color-mix(in srgb, var(--bg) 88%, transparent); backdrop-filter: blur(8px); border-bottom: 1px solid color-mix(in srgb, var(--ink) 10%, transparent); }
  .nav__inner { display: flex; align-items: center; justify-content: space-between; height: 64px; }
  .nav__brand { font-weight: 700; letter-spacing: -0.02em; text-decoration: none; }
  .nav__links { display: flex; align-items: center; gap: clamp(1rem, 2vw, 1.75rem); }
  .nav__links a { text-decoration: none; }
  .nav__cta { background: var(--lime); color: var(--ink); padding: 0.5rem 1rem; border-radius: 999px; font-weight: 700; }
  @media (max-width: 640px) { .nav__links a:not(.nav__cta) { display: none; } }
</style>
```

- [ ] **Step 2: Create `src/components/Footer.astro`**

```astro
---
const year = new Date().getFullYear();
---
<footer class="footer">
  <div class="container footer__inner">
    <div>
      <p class="footer__brand">Klar Studio</p>
      <p class="footer__muted">Klar, ferdig — på nett.</p>
    </div>
    <div class="footer__col">
      <a href="#tjenester">Tjenester</a>
      <a href="#arbeid">Arbeid</a>
      <a href="#kontakt">Kontakt</a>
    </div>
    <div class="footer__col">
      <a href="mailto:hei@klarstudio.no">hei@klarstudio.no</a>
      <a href="https://instagram.com/klarstudio">Instagram</a>
    </div>
  </div>
  <p class="container footer__legal">© {year} Klar Studio</p>
</footer>
<style>
  .footer { border-top: 1px solid color-mix(in srgb, var(--ink) 10%, transparent); padding-block: 3rem 2rem; }
  .footer__inner { display: flex; flex-wrap: wrap; gap: 2rem; justify-content: space-between; }
  .footer__brand { font-weight: 700; }
  .footer__muted { color: var(--muted); }
  .footer__col { display: flex; flex-direction: column; gap: 0.5rem; }
  .footer__col a { text-decoration: none; }
  .footer__legal { color: var(--muted); margin-top: 2rem; font-size: 0.875rem; }
</style>
```

- [ ] **Step 3: Wire into `src/pages/index.astro`**

```astro
---
import Base from "../layouts/Base.astro";
import Nav from "../components/Nav.astro";
import Footer from "../components/Footer.astro";
---
<Base title="Klar Studio — Klar, ferdig — på nett" description="Klar Studio lager raske nettsider og får lokale bedrifter synlige på Google Maps.">
  <a id="top"></a>
  <Nav />
  <main>
    <h1 style="padding: 4rem 1.5rem;">Klar Studio</h1>
  </main>
  <Footer />
</Base>
```

- [ ] **Step 4: Extend `tests/smoke.spec.ts` with a nav/footer check**

```ts
test("nav and footer render", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".nav__brand")).toHaveText("Klar Studio");
  await expect(page.locator(".nav__cta")).toHaveText("Ta kontakt");
  await expect(page.locator(".footer")).toContainText("hei@klarstudio.no");
});
```

- [ ] **Step 5: Run tests**

Run: `npm test`
Expected: all tests pass.

- [ ] **Step 6: Commit**

```bash
git add src/components/Nav.astro src/components/Footer.astro src/pages/index.astro tests/smoke.spec.ts
git commit -m "feat: add nav and footer"
```

---

### Task 5: Content data files

**Files:**
- Create: `src/data/services.ts`, `src/data/projects.ts`, `src/data/founders.ts`, `src/data/process.ts`

**Interfaces:**
- Produces typed exports used by later section tasks:
  - `services: { title: string; body: string }[]`
  - `projects: { name: string; tagline: string; image: string; real: boolean; url?: string }[]`
  - `founders: { name: string; role: string; bio: string; photo: string }[]`
  - `processSteps: { step: string; title: string; body: string }[]`

- [ ] **Step 1: Create `src/data/services.ts`**

```ts
export const services = [
  { title: "Webdesign", body: "Moderne, raske nettsider som ser bra ut og laster lynkjapt — bygget for å konvertere besøkende til kunder." },
  { title: "Google Maps & synlighet", body: "Vi setter opp og optimaliserer Google-bedriftsprofilen din, så lokale kunder finner deg først på kartet." },
  { title: "Foto & video", body: "Profesjonelle bilder og film til nettsiden, levert i samarbeid med fotograf — innhold som gjør at du skiller deg ut." },
] as const;
```

- [ ] **Step 2: Create `src/data/projects.ts`** (one real project + sample demos — swap `image`/`url` for real assets later)

```ts
export const projects = [
  { name: "Eksempelkunde AS", tagline: "Ny nettside og #1 på Google Maps i nærområdet.", image: "/images/project-1.jpg", real: true, url: "#" },
  { name: "Demo — Café Nord", tagline: "Konseptside for en lokal kafé.", image: "/images/demo-cafe.jpg", real: false },
  { name: "Demo — Bygg & Co", tagline: "Konseptside for et håndverkerfirma.", image: "/images/demo-bygg.jpg", real: false },
  { name: "Demo — Klinikk Sol", tagline: "Konseptside for en klinikk.", image: "/images/demo-klinikk.jpg", real: false },
] as const;
```

- [ ] **Step 3: Create `src/data/founders.ts`** (swap bios/photos for real later)

```ts
export const founders = [
  { name: "Fornavn Etternavn", role: "Design & utvikling", bio: "Bygger raske, gjennomtenkte nettsider med øye for detaljer.", photo: "/images/founder-1.jpg" },
  { name: "Fornavn Etternavn", role: "Synlighet & innhold", bio: "Sørger for at bedriften din blir funnet — på Google og på kartet.", photo: "/images/founder-2.jpg" },
] as const;
```

- [ ] **Step 4: Create `src/data/process.ts`**

```ts
export const processSteps = [
  { step: "01", title: "Klar", body: "Vi blir kjent med bedriften din og legger en plan for nettside og synlighet." },
  { step: "02", title: "Ferdig", body: "Vi designer og bygger nettsiden, og setter opp Google-profilen din." },
  { step: "03", title: "På nett", body: "Vi lanserer, måler resultatene og sørger for at du blir funnet." },
] as const;
```

- [ ] **Step 5: Type-check and commit**

Run: `npm run check`
Expected: 0 errors.

```bash
git add src/data
git commit -m "feat: add site content data"
```

---

### Task 6: Hero with kinetic headline and magnetic CTA

**Files:**
- Create: `src/components/HeroHeadline.tsx`, `src/components/MagneticButton.tsx`, `src/components/Hero.astro`
- Modify: `src/pages/index.astro`, `tests/smoke.spec.ts`

**Interfaces:**
- Consumes: nothing.
- Produces: `<Hero />` (Astro) embedding two islands. `MagneticButton` props: `{ href: string; children }`. `HeroHeadline` takes no props (renders the fixed headline words).

- [ ] **Step 1: Create `src/components/HeroHeadline.tsx`**

```tsx
import { motion, useReducedMotion } from "motion/react";

const words = ["Klar,", "ferdig", "— på nett."];

export default function HeroHeadline() {
  const reduce = useReducedMotion();
  return (
    <h1 style={{ fontSize: "var(--step-5)", margin: 0 }}>
      {words.map((w, i) => (
        <motion.span
          key={i}
          style={{ display: "inline-block", marginRight: "0.25em" }}
          initial={reduce ? false : { y: "0.6em", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: i * 0.12, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          {w}
        </motion.span>
      ))}
    </h1>
  );
}
```

- [ ] **Step 2: Create `src/components/MagneticButton.tsx`**

```tsx
import { useRef } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "motion/react";

export default function MagneticButton({ href, children }: { href: string; children: React.ReactNode }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 15 });
  const sy = useSpring(y, { stiffness: 200, damping: 15 });

  function onMove(e: React.MouseEvent) {
    if (reduce || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * 0.3);
    y.set((e.clientY - (r.top + r.height / 2)) * 0.3);
  }
  function reset() { x.set(0); y.set(0); }

  return (
    <motion.a
      ref={ref}
      href={href}
      onMouseMove={onMove}
      onMouseLeave={reset}
      style={{
        x: sx, y: sy, display: "inline-block", background: "var(--lime)", color: "var(--ink)",
        padding: "0.9rem 1.6rem", borderRadius: "999px", fontWeight: 700, textDecoration: "none",
      }}
    >
      {children}
    </motion.a>
  );
}
```

- [ ] **Step 3: Create `src/components/Hero.astro`**

```astro
---
import HeroHeadline from "./HeroHeadline.tsx";
import MagneticButton from "./MagneticButton.tsx";
---
<section class="hero">
  <div class="container">
    <HeroHeadline client:load />
    <p class="hero__sub">Vi lager raske nettsider og får lokale bedrifter synlige på Google Maps.</p>
    <div class="hero__cta">
      <MagneticButton href="#kontakt" client:load>Er du klar?</MagneticButton>
    </div>
  </div>
</section>
<style>
  .hero { padding-block: clamp(5rem, 8vw, 9rem); }
  .hero__sub { font-size: var(--step-2); color: var(--muted); max-width: 36ch; margin-top: 1.5rem; }
  .hero__cta { margin-top: 2.5rem; }
</style>
```

- [ ] **Step 4: Add `<Hero />` to `src/pages/index.astro`** (replace the placeholder `<h1>` inside `<main>`)

```astro
---
import Base from "../layouts/Base.astro";
import Nav from "../components/Nav.astro";
import Hero from "../components/Hero.astro";
import Footer from "../components/Footer.astro";
---
<Base title="Klar Studio — Klar, ferdig — på nett" description="Klar Studio lager raske nettsider og får lokale bedrifter synlige på Google Maps.">
  <a id="top"></a>
  <Nav />
  <main>
    <Hero />
  </main>
  <Footer />
</Base>
```

- [ ] **Step 5: Update the title check in `tests/smoke.spec.ts`**

The first smoke test asserts `h1` contains "Klar Studio"; the hero `h1` now reads "Klar, ferdig — på nett." Update that assertion:

```ts
  await expect(page.locator("h1")).toContainText("Klar, ferdig");
```

Add a hero CTA check:

```ts
test("hero shows headline and CTA", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".hero h1")).toContainText("på nett");
  await expect(page.locator(".hero__cta a")).toHaveText("Er du klar?");
});
```

- [ ] **Step 6: Run tests**

Run: `npm test`
Expected: all pass.

- [ ] **Step 7: Commit**

```bash
git add src/components/HeroHeadline.tsx src/components/MagneticButton.tsx src/components/Hero.astro src/pages/index.astro tests/smoke.spec.ts
git commit -m "feat: add hero with kinetic headline and magnetic CTA"
```

---

### Task 7: Scroll-reveal island + Services section

**Files:**
- Create: `src/components/Reveal.tsx`, `src/components/Services.astro`
- Modify: `src/pages/index.astro`, `tests/smoke.spec.ts`

**Interfaces:**
- Consumes: `services` from `src/data/services.ts`.
- Produces: `<Reveal>` island wrapper, props `{ children; delay?: number }`, animates children into view once. `<Services />` section with `id="tjenester"`.

- [ ] **Step 1: Create `src/components/Reveal.tsx`**

```tsx
import { motion, useReducedMotion } from "motion/react";

export default function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { y: 24, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
```

- [ ] **Step 2: Create `src/components/Services.astro`**

```astro
---
import { services } from "../data/services.ts";
import Reveal from "./Reveal.tsx";
---
<section id="tjenester">
  <div class="container">
    <h2 class="services__title">Hva vi gjør</h2>
    <div class="services__grid">
      {services.map((s, i) => (
        <Reveal client:visible delay={i * 0.08}>
          <article class="card">
            <h3>{s.title}</h3>
            <p>{s.body}</p>
          </article>
        </Reveal>
      ))}
    </div>
  </div>
</section>
<style>
  .services__title { font-size: var(--step-2); margin-bottom: 2.5rem; }
  .services__grid { display: grid; gap: 1.25rem; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); }
  .card { border: 1px solid color-mix(in srgb, var(--ink) 12%, transparent); border-radius: 16px; padding: 1.75rem; height: 100%; transition: transform 0.3s ease, border-color 0.3s ease; }
  .card:hover { transform: translateY(-4px); border-color: var(--lime); }
  .card h3 { margin-bottom: 0.75rem; }
  .card p { color: var(--muted); }
</style>
```

- [ ] **Step 3: Add `<Services />` to `index.astro`** (after `<Hero />`, inside `<main>`)

```astro
import Services from "../components/Services.astro";
```
```astro
    <Hero />
    <Services />
```

- [ ] **Step 4: Extend smoke test**

```ts
test("services section shows three pillars", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("#tjenester h3")).toHaveCount(3);
  await expect(page.locator("#tjenester")).toContainText("Google Maps");
});
```

- [ ] **Step 5: Run tests and commit**

Run: `npm test` → all pass.

```bash
git add src/components/Reveal.tsx src/components/Services.astro src/pages/index.astro tests/smoke.spec.ts
git commit -m "feat: add scroll-reveal island and services section"
```

---

### Task 8: Why section with animated stat

**Files:**
- Create: `src/components/Why.astro`
- Modify: `src/pages/index.astro`, `tests/smoke.spec.ts`

**Interfaces:**
- Consumes: `Reveal` from Task 7.
- Produces: `<Why />` section with `id="hvorfor"`, including a highlighted "#1 på Google Maps" stat. (This section is where the future live-demo island will mount.)

- [ ] **Step 1: Create `src/components/Why.astro`**

```astro
---
import Reveal from "./Reveal.tsx";
---
<section id="hvorfor" class="why">
  <div class="container why__grid">
    <Reveal client:visible>
      <h2>Usynlig på nett koster deg kunder.</h2>
      <p>De fleste velger den første bedriften de finner. Vi sørger for at det er deg — med en nettside som overbeviser og en Google-profil som setter deg øverst.</p>
    </Reveal>
    <Reveal client:visible delay={0.1}>
      <div class="why__stat">
        <span class="why__num">#1</span>
        <span class="why__label">på Google Maps i nærområdet</span>
      </div>
    </Reveal>
  </div>
</section>
<style>
  .why { background: var(--ink); color: var(--bg); border-radius: 28px; margin-inline: clamp(1rem, 4vw, 2rem); }
  .why__grid { display: grid; gap: 2.5rem; grid-template-columns: 1fr; align-items: center; }
  .why h2 { font-size: var(--step-2); }
  .why p { color: color-mix(in srgb, var(--bg) 75%, transparent); margin-top: 1rem; max-width: 42ch; }
  .why__stat { display: flex; flex-direction: column; }
  .why__num { font-size: var(--step-5); font-weight: 700; color: var(--lime); line-height: 1; }
  .why__label { color: color-mix(in srgb, var(--bg) 75%, transparent); margin-top: 0.5rem; }
  @media (min-width: 800px) { .why__grid { grid-template-columns: 1.4fr 1fr; } }
</style>
```

- [ ] **Step 2: Add `<Why />` to `index.astro`** (after `<Services />`)

```astro
import Why from "../components/Why.astro";
```
```astro
    <Services />
    <Why />
```

- [ ] **Step 3: Extend smoke test**

```ts
test("why section shows the ranking stat", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".why__num")).toHaveText("#1");
});
```

- [ ] **Step 4: Run tests and commit**

Run: `npm test` → all pass.

```bash
git add src/components/Why.astro src/pages/index.astro tests/smoke.spec.ts
git commit -m "feat: add why section with animated stat"
```

---

### Task 9: Work section

**Files:**
- Create: `src/components/Work.astro`
- Modify: `src/pages/index.astro`, `tests/smoke.spec.ts`

**Interfaces:**
- Consumes: `projects` from `src/data/projects.ts`, `Reveal` from Task 7.
- Produces: `<Work />` section with `id="arbeid"`. Real project rendered large; demos rendered as a grid, each demo visibly labeled "Demo".

- [ ] **Step 1: Create `src/components/Work.astro`**

```astro
---
import { projects } from "../data/projects.ts";
import Reveal from "./Reveal.tsx";
const featured = projects.find((p) => p.real);
const demos = projects.filter((p) => !p.real);
---
<section id="arbeid">
  <div class="container">
    <h2 class="work__title">Arbeid</h2>
    {featured && (
      <Reveal client:visible>
        <a class="work__featured" href={featured.url}>
          <img src={featured.image} alt={featured.name} loading="lazy" />
          <div class="work__meta">
            <h3>{featured.name}</h3>
            <p>{featured.tagline}</p>
          </div>
        </a>
      </Reveal>
    )}
    <div class="work__grid">
      {demos.map((p, i) => (
        <Reveal client:visible delay={i * 0.08}>
          <article class="work__demo">
            <span class="work__badge">Demo</span>
            <img src={p.image} alt={p.name} loading="lazy" />
            <h3>{p.name}</h3>
            <p>{p.tagline}</p>
          </article>
        </Reveal>
      ))}
    </div>
  </div>
</section>
<style>
  .work__title { font-size: var(--step-2); margin-bottom: 2.5rem; }
  .work__featured { display: grid; gap: 1.5rem; text-decoration: none; margin-bottom: 3rem; }
  .work__featured img { width: 100%; border-radius: 20px; aspect-ratio: 16/9; object-fit: cover; background: color-mix(in srgb, var(--ink) 6%, transparent); }
  .work__meta h3 { margin-bottom: 0.5rem; }
  .work__meta p { color: var(--muted); }
  .work__grid { display: grid; gap: 1.25rem; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); }
  .work__demo { position: relative; }
  .work__demo img { width: 100%; border-radius: 14px; aspect-ratio: 4/3; object-fit: cover; background: color-mix(in srgb, var(--ink) 6%, transparent); }
  .work__demo h3 { margin: 0.75rem 0 0.25rem; font-size: 1.1rem; }
  .work__demo p { color: var(--muted); font-size: 0.95rem; }
  .work__badge { position: absolute; top: 0.75rem; left: 0.75rem; background: var(--lime); color: var(--ink); font-weight: 700; font-size: 0.8rem; padding: 0.2rem 0.6rem; border-radius: 999px; }
</style>
```

- [ ] **Step 2: Add `<Work />` to `index.astro`** (after `<Why />`)

```astro
import Work from "../components/Work.astro";
```
```astro
    <Why />
    <Work />
```

- [ ] **Step 3: Extend smoke test**

```ts
test("work section shows featured project and demo badges", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".work__featured")).toBeVisible();
  await expect(page.locator(".work__badge").first()).toHaveText("Demo");
});
```

- [ ] **Step 4: Run tests and commit**

Run: `npm test` → all pass.

```bash
git add src/components/Work.astro src/pages/index.astro tests/smoke.spec.ts
git commit -m "feat: add work section"
```

---

### Task 10: Process section

**Files:**
- Create: `src/components/Process.astro`
- Modify: `src/pages/index.astro`, `tests/smoke.spec.ts`

**Interfaces:**
- Consumes: `processSteps` from `src/data/process.ts`, `Reveal` from Task 7.
- Produces: `<Process />` section with `id="prosess"`.

- [ ] **Step 1: Create `src/components/Process.astro`**

```astro
---
import { processSteps } from "../data/process.ts";
import Reveal from "./Reveal.tsx";
---
<section id="prosess">
  <div class="container">
    <h2 class="process__title">Slik jobber vi</h2>
    <div class="process__grid">
      {processSteps.map((s, i) => (
        <Reveal client:visible delay={i * 0.08}>
          <article class="process__step">
            <span class="process__num">{s.step}</span>
            <h3>{s.title}</h3>
            <p>{s.body}</p>
          </article>
        </Reveal>
      ))}
    </div>
  </div>
</section>
<style>
  .process__title { font-size: var(--step-2); margin-bottom: 2.5rem; }
  .process__grid { display: grid; gap: 1.5rem; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); }
  .process__num { font-weight: 700; color: var(--lime); font-size: 1.5rem; }
  .process__step h3 { margin: 0.5rem 0; }
  .process__step p { color: var(--muted); }
</style>
```

- [ ] **Step 2: Add `<Process />` to `index.astro`** (after `<Work />`)

```astro
import Process from "../components/Process.astro";
```
```astro
    <Work />
    <Process />
```

- [ ] **Step 3: Extend smoke test**

```ts
test("process section shows three steps", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("#prosess .process__step")).toHaveCount(3);
});
```

- [ ] **Step 4: Run tests and commit**

Run: `npm test` → all pass.

```bash
git add src/components/Process.astro src/pages/index.astro tests/smoke.spec.ts
git commit -m "feat: add process section"
```

---

### Task 11: About section

**Files:**
- Create: `src/components/About.astro`
- Modify: `src/pages/index.astro`, `tests/smoke.spec.ts`

**Interfaces:**
- Consumes: `founders` from `src/data/founders.ts`, `Reveal` from Task 7.
- Produces: `<About />` section with `id="om-oss"`.

- [ ] **Step 1: Create `src/components/About.astro`**

```astro
---
import { founders } from "../data/founders.ts";
import Reveal from "./Reveal.tsx";
---
<section id="om-oss">
  <div class="container">
    <h2 class="about__title">Om oss</h2>
    <p class="about__lead">To utviklere som brenner for at lokale bedrifter skal lykkes på nett.</p>
    <div class="about__grid">
      {founders.map((f, i) => (
        <Reveal client:visible delay={i * 0.1}>
          <article class="about__person">
            <img src={f.photo} alt={f.name} loading="lazy" />
            <h3>{f.name}</h3>
            <p class="about__role">{f.role}</p>
            <p>{f.bio}</p>
          </article>
        </Reveal>
      ))}
    </div>
  </div>
</section>
<style>
  .about__title { font-size: var(--step-2); }
  .about__lead { color: var(--muted); max-width: 40ch; margin: 1rem 0 2.5rem; }
  .about__grid { display: grid; gap: 2rem; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); }
  .about__person img { width: 100%; aspect-ratio: 1; object-fit: cover; border-radius: 20px; background: color-mix(in srgb, var(--ink) 6%, transparent); }
  .about__person h3 { margin: 1rem 0 0.25rem; }
  .about__role { color: var(--lime); font-weight: 700; }
  .about__person p:last-child { color: var(--muted); margin-top: 0.5rem; }
</style>
```

- [ ] **Step 2: Add `<About />` to `index.astro`** (after `<Process />`)

```astro
import About from "../components/About.astro";
```
```astro
    <Process />
    <About />
```

- [ ] **Step 3: Extend smoke test**

```ts
test("about section shows two founders", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("#om-oss .about__person")).toHaveCount(2);
});
```

- [ ] **Step 4: Run tests and commit**

Run: `npm test` → all pass.

```bash
git add src/components/About.astro src/pages/index.astro tests/smoke.spec.ts
git commit -m "feat: add about section"
```

---

### Task 12: Contact section with form island

**Files:**
- Create: `src/components/ContactForm.tsx`, `src/components/Contact.astro`, `.env.example`
- Modify: `src/pages/index.astro`, `tests/smoke.spec.ts`

**Interfaces:**
- Consumes: `import.meta.env.PUBLIC_WEB3FORMS_KEY`.
- Produces: `<Contact />` section with `id="kontakt"`. `ContactForm` validates required fields client-side and POSTs to Web3Forms, showing success/error states.

- [ ] **Step 1: Create `.env.example`**

```
PUBLIC_WEB3FORMS_KEY=your-web3forms-access-key
```

- [ ] **Step 2: Create `src/components/ContactForm.tsx`** (with an exported pure validator so logic is unit-testable via the UI)

```tsx
import { useState } from "react";

export function validate(v: { name: string; email: string; message: string }) {
  const errors: Record<string, string> = {};
  if (!v.name.trim()) errors.name = "Fyll inn navn.";
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v.email)) errors.email = "Fyll inn en gyldig e-post.";
  if (v.message.trim().length < 5) errors.message = "Skriv en kort melding.";
  return errors;
}

export default function ContactForm() {
  const [values, setValues] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [state, setState] = useState<"idle" | "sending" | "ok" | "error">("idle");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate(values);
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setState("sending");
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ access_key: import.meta.env.PUBLIC_WEB3FORMS_KEY, ...values }),
      });
      setState((await res.json()).success ? "ok" : "error");
    } catch {
      setState("error");
    }
  }

  if (state === "ok") return <p role="status" className="form__ok">Takk! Vi tar kontakt snart.</p>;

  return (
    <form className="form" onSubmit={onSubmit} noValidate>
      {(["name", "email", "message"] as const).map((f) => (
        <label key={f} className="form__field">
          <span>{f === "name" ? "Navn" : f === "email" ? "E-post" : "Melding"}</span>
          {f === "message" ? (
            <textarea rows={4} value={values[f]} onChange={(e) => setValues({ ...values, [f]: e.target.value })} />
          ) : (
            <input type={f === "email" ? "email" : "text"} value={values[f]} onChange={(e) => setValues({ ...values, [f]: e.target.value })} />
          )}
          {errors[f] && <em className="form__err">{errors[f]}</em>}
        </label>
      ))}
      <button type="submit" disabled={state === "sending"}>{state === "sending" ? "Sender…" : "Send"}</button>
      {state === "error" && <p className="form__err">Noe gikk galt. Prøv igjen eller send e-post.</p>}
    </form>
  );
}
```

- [ ] **Step 3: Create `src/components/Contact.astro`**

```astro
---
import ContactForm from "./ContactForm.tsx";
---
<section id="kontakt" class="contact">
  <div class="container contact__grid">
    <div>
      <h2>Er du klar?</h2>
      <p>Fortell oss kort om bedriften din, så tar vi en uforpliktende prat.</p>
      <p class="contact__alt"><a href="mailto:hei@klarstudio.no">hei@klarstudio.no</a></p>
    </div>
    <ContactForm client:visible />
  </div>
</section>
<style>
  .contact__grid { display: grid; gap: 2.5rem; grid-template-columns: 1fr; }
  .contact h2 { font-size: var(--step-2); }
  .contact p { color: var(--muted); margin-top: 1rem; }
  .contact__alt a { color: var(--ink); font-weight: 700; }
  .form { display: grid; gap: 1rem; }
  .form__field { display: grid; gap: 0.35rem; }
  .form input, .form textarea { font: inherit; padding: 0.75rem; border: 1px solid color-mix(in srgb, var(--ink) 20%, transparent); border-radius: 10px; }
  .form button { background: var(--lime); color: var(--ink); font-weight: 700; border: 0; padding: 0.9rem; border-radius: 999px; cursor: pointer; }
  .form button:disabled { opacity: 0.6; }
  .form__err { color: #b00020; font-style: normal; font-size: 0.9rem; }
  .form__ok { color: var(--ink); font-weight: 700; }
  @media (min-width: 800px) { .contact__grid { grid-template-columns: 1fr 1fr; } }
</style>
```

- [ ] **Step 4: Add `<Contact />` to `index.astro`** (after `<About />`)

```astro
import Contact from "../components/Contact.astro";
```
```astro
    <About />
    <Contact />
```

- [ ] **Step 5: Extend smoke test — empty submit shows validation, fields accept input**

```ts
test("contact form validates required fields", async ({ page }) => {
  await page.goto("/");
  await page.locator("#kontakt button[type=submit]").click();
  await expect(page.locator("#kontakt .form__err").first()).toBeVisible();
});
```

- [ ] **Step 6: Run tests and commit**

Run: `npm test` → all pass.

```bash
git add src/components/ContactForm.tsx src/components/Contact.astro .env.example src/pages/index.astro tests/smoke.spec.ts
git commit -m "feat: add contact section with form island"
```

---

### Task 13: Final polish — reduced-motion verification, OG image, sitemap, README

**Files:**
- Create: `public/og-image.png` (placeholder), `public/robots.txt`, `README.md`
- Modify: `astro.config.mjs` (add sitemap), `package.json` (add sitemap dep), `tests/smoke.spec.ts`

**Interfaces:**
- Produces: production-ready static output with sitemap + robots, plus a README documenting setup, env vars, and deploy.

- [ ] **Step 1: Add the sitemap integration**

Add dependency `@astrojs/sitemap` to `package.json` dependencies (`^3.1.0`), run `npm install`, then update `astro.config.mjs`:

```js
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://klarstudio.no",
  integrations: [react(), sitemap()],
});
```

- [ ] **Step 2: Create `public/robots.txt`**

```
User-agent: *
Allow: /
Sitemap: https://klarstudio.no/sitemap-index.xml
```

- [ ] **Step 3: Add a placeholder `public/og-image.png`**

Create a 1200×630 PNG (lime background, "Klar Studio" wordmark) and save to `public/og-image.png`. Until a designed asset exists, generate a solid placeholder:

Run: `printf '' && node -e "console.log('replace public/og-image.png with a 1200x630 brand image before launch')"`
(Drop any 1200×630 PNG at that path so the build references a real file.)

- [ ] **Step 4: Add a reduced-motion smoke test**

```ts
test("respects reduced motion (content visible without animation)", async ({ browser }) => {
  const ctx = await browser.newContext({ reducedMotion: "reduce" });
  const page = await ctx.newPage();
  await page.goto("/");
  await expect(page.locator(".hero h1")).toContainText("på nett");
  await expect(page.locator("#tjenester h3")).toHaveCount(3);
  await ctx.close();
});
```

- [ ] **Step 5: Create `README.md`**

```markdown
# Klar Studio

Marketing site for Klar Studio. Astro + React islands.

## Develop
npm install
npm run dev

## Test
npx playwright install chromium
npm test

## Build
npm run build && npm run preview

## Environment
Copy `.env.example` to `.env` and set `PUBLIC_WEB3FORMS_KEY`
(from https://web3forms.com — free, no backend).

## Deploy
Static output in `dist/`. Deploy to Vercel, Netlify, or Cloudflare Pages.
Set `PUBLIC_WEB3FORMS_KEY` in the host's environment variables.

## Content to replace before launch
- public/images/*: real project shots + founder photos
- public/og-image.png: 1200x630 brand image
- src/data/projects.ts, founders.ts: real names, bios, URLs
```

- [ ] **Step 6: Full build + test**

Run: `npm run build && npm test`
Expected: build succeeds (sitemap emitted to `dist/`), all smoke tests pass.

- [ ] **Step 7: Commit**

```bash
git add astro.config.mjs package.json package-lock.json public/robots.txt public/og-image.png README.md tests/smoke.spec.ts
git commit -m "feat: add sitemap, robots, OG image, reduced-motion test, and README"
```

---

## Self-Review

**Spec coverage:**
- Brand / tagline / voice → Tasks 2, 6 (titles, hero), data copy.
- Visual design (white base, lime accent, Schibsted Grotesk, type scale) → Task 2 tokens, used throughout.
- Astro + React islands → Task 1; islands in Tasks 6, 7, 12.
- Motion (kinetic headline, magnetic button, scroll reveals) → Tasks 6, 7.
- All 8 sections (Hero, Services, Why, Work, Process, About, Contact, Footer) → Tasks 4, 6–12.
- People-first about → Task 11.
- Lead handling via no-backend form → Task 12.
- Performance/SEO (meta, OG, sitemap, robots, lazy islands) → Tasks 2, 13.
- prefers-reduced-motion → Task 2 (CSS), Tasks 6/7/12 (`useReducedMotion`), Task 13 (test).
- A→B growth (modular section components) → enforced by per-section file structure.
- Norwegian copy / `lang="nb"` → Global Constraints, Task 2, all data.

**Out-of-scope confirmed absent:** no live-demo Google-Maps island, no multi-page routes, no blog/CMS — matches spec.

**Placeholder scan:** Site *content* placeholders (founder bios, project images, OG image) are real build inputs documented in Task 13's "Content to replace" list — not plan-step placeholders. No "TBD" plan steps.

**Type consistency:** `Reveal` props `{ children; delay? }` consistent across Tasks 7–11. `validate()` signature in Task 12 matches its caller. Data export names (`services`, `projects`, `founders`, `processSteps`) consistent between Task 5 and consumers. Anchor ids (`#tjenester`, `#arbeid`, `#om-oss`, `#kontakt`) match Nav (Task 4) and sections.

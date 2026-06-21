# Klar Studio — Website Design Spec

**Date:** 2026-06-22
**Status:** Approved (design), pending implementation plan
**Domain:** klarstudio.no

## Overview

A marketing website for **Klar Studio**, a two-person Norwegian studio specializing in
local web presence: web design, Google Maps / Google Business Profile visibility, and
photo/video content (sourced from a photographer, primarily to feed the sites they build).

The site has two jobs at once:

1. **Convert local business owners** — a café, plumber, or shop owner must instantly
   understand what Klar Studio does and how to make contact. Clear and credible.
2. **Be the studio's own portfolio piece** — two developers selling web design can't ship
   a generic brochure. The site itself must demonstrate skill and feel original.

The guiding principle that reconciles these: **kinetic, not cluttered.** Energy lives in
bold typography, one vivid accent color, and smooth motion — on top of a clean, spacious,
trustworthy layout.

## Audience & positioning

- **Audience:** local Norwegian small/medium businesses that want to look good online and
  get found (especially on Google Maps).
- **Positioning:** focused specialists in *local web presence*, not a full-service agency.
- **Primary conversion goal:** get the visitor to make contact (form / email / phone).

## Brand

- **Name:** Klar Studio
- **Tagline:** "Klar, ferdig — på nett." Alt hook: "Er du klar?"
- **Voice:** Norwegian (bokmål), energetic, confident, plain-spoken, no jargon.
- **Meaning:** "Klar" = ready / clear. The brand promise is making online presence clear
  and getting clients ready to be found.

## Visual design

Synthesized from references the founders liked (theorell.no, b-egg.farm, ellipsus.com,
mode.com, rblln.fr) — all clean, spacious, editorial, energy-through-accent-color.

- **Base:** white, generous whitespace, editorial spacing.
- **Accent:** electric lime `#C8F169` (per mode.com), paired with a near-black / deep
  forest dark for text and structural elements. White is the dominant surface; lime is
  used sparingly for emphasis, CTAs, and highlights.
- **Typography:** large bold modern sans-serif display headlines; lighter-weight sans body.
  Hierarchy by size and weight, no serif/sans mixing. (Exact typeface TBD during build —
  candidates: a strong geometric/grotesk sans.)
- **People-first:** the two founders featured with real photos.
- **Motion:** smooth scroll-driven reveals, magnetic buttons, a kinetic hero headline,
  smooth section transitions. Refined, not flashy. **No** countdown/launch gimmick.

## Technical architecture

- **Stack:** Astro + React islands.
  - Astro renders a fast, static, SEO-strong shell (near-zero JS by default).
  - Interactive/animated components are React islands, hydrated only where needed.
- **Animation:** Motion (Framer Motion) for component animation; GSAP / ScrollTrigger for
  scroll-driven moments. WebGL/R3F reserved for the later "live demo" (see Future).
- **Componentization for growth:** the page is assembled from modular **section
  components**. Each section is built so it can later be "promoted" into its own route with
  no rewrite — this is the A→B path (see A→B Growth Plan).
- **Hosting:** static host (Vercel / Netlify / Cloudflare Pages — free tier). Final choice
  TBD during build.

## Site structure — v1 one-pager

A single scrolling page, anchored sections, in this order:

1. **Hero** — kinetic oversized headline ("Klar, ferdig — på nett"), short subline, primary
   CTA ("Ta kontakt" / "Book en prat"). The signature energy beat. Smooth entrance motion.
2. **Hva vi gjør (Services)** — three pillars as hover-reactive cards:
   - **Webdesign** — modern, fast websites.
   - **Google Maps & synlighet** — Google Business Profile / local visibility.
   - **Foto/video** — content for the site, via a photographer.
3. **Hvorfor (Why it matters)** — the "get found locally" pitch: invisible online → #1.
   Includes a small animated stat / pin-drop moment. *(This is where the future live-demo
   component slots in.)*
4. **Arbeid (Work)** — the one real finished project featured prominently, backed by 2–3
   demo/sample sites clearly labeled as examples.
5. **Prosess (Process)** — a tight 3–4 step "klar, ferdig, live" flow.
6. **Om oss (About)** — the two founders: photos, short personal bios. Trust + faces.
7. **Kontakt (Contact)** — contact form plus visible email and phone (optional "book a
   call" link).
8. **Footer** — navigation (becomes the multi-page nav in B), org info, social links.

## Signature "skill flex" components

- Kinetic hero headline
- Magnetic buttons
- Scroll-driven section reveals
- Hover-reactive service cards
- Smooth section transitions

These are the React islands. They must degrade gracefully (content readable without JS)
and respect `prefers-reduced-motion`.

## Lead handling

- **Contact form** via a no-backend service (Web3Forms or Formspree — free, emails the
  founders directly). No server to run for v1.
- Visible **email and phone** as fallback.
- Form: name, email, message (and optionally business name / what they need).

## Performance & SEO

This is part of the sales pitch — the studio sells visibility, so its own site must be fast
and rank well.

- Static + semantic HTML, meta + OpenGraph tags, sensible heading structure.
- Fast LCP; heavy React islands lazy-loaded / hydrated on demand.
- Target a strong Lighthouse score ("look how fast our own site is").
- `prefers-reduced-motion` honored for all motion.

## A→B growth plan

The founders' stated goal is a full multi-page site (B). v1 ships as a one-pager (A) but is
architected to grow into B without a rewrite:

- Each v1 section is a self-contained component.
- To go multi-page, "promote" sections to routes in Astro's `pages/`:
  `/tjenester`, `/portefolje`, `/om-oss`, `/kontakt` — reusing the same components.
- Navigation swaps from anchor-scroll links to route links.
- Shared header/footer already components, so no duplication.

## Scope

**In scope (v1):**

- The one-page site described above.
- Contact form via no-backend service.
- Performance/SEO baseline.

**Out of scope (future):**

- The interactive "live demo" Google-Maps component (Direction C) in the *Hvorfor* section.
- Multi-page split (B).
- Blog / CMS.
- Additional case studies beyond the v1 set.

## Open items (resolve during build)

- Final typeface selection.
- Exact dark/forest shade paired with the lime.
- Which contact-form service (Web3Forms vs Formspree).
- Hosting provider choice.
- Content gathering: details/screenshots of the one real project; which 2–3 demos to build;
  founder photos and bios; Norwegian copy for every section.
- `.no` registration pending the studio's org number.

## Assumptions

- Site language is Norwegian (bokmål).
- Contact is form + email/phone; no booking system in v1.
- Domain klarstudio.no will be registered once the org number is sorted.

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

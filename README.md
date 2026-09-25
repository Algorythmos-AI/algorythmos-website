# Algorythmos — company website

Source for [algorythmos.com](https://algorythmos.com): the bilingual (EN/FR) website of
Algorythmos Pty Ltd, an AI consultancy delivering agentic automation, document
intelligence, SQL dashboards and MLOps for SMEs in Australia and France.

## Stack

| Layer | Technology |
|---|---|
| Framework | Astro 7, static output |
| Styling | Tailwind CSS 3 + semantic CSS custom properties (light/dark) |
| Islands | React 18 (charts only) |
| i18n | Build-time dictionaries in `src/i18n/ui/*.json` via `useTranslations()` |
| SEO | Centralised head (`src/components/seo/SEO.astro`), JSON-LD (`src/seo/schema.ts`), sitemap, RSS, OG cards |
| Contact API | Vercel serverless function (`api/contact.js`, Nodemailer over SMTP) |
| Testing | Vitest (unit), Playwright (e2e), custom SEO / i18n / link validators |
| Hosting | Vercel |

Node 22 (`.nvmrc`).

## Quick start

```bash
npm install
npm run dev        # http://localhost:4321
```

## Quality gate (mirrors CI — run before every commit)

```bash
npm run check && npm run i18n:check && npm run health:check && npm run build \
  && npm run seo:check && npm run link:check && npm run keys:check \
  && npm test && npm run test:e2e
```

| Script | What it checks |
|---|---|
| `check` | Astro / TypeScript diagnostics |
| `i18n:check` | EN ↔ FR key parity, untranslated strings, hard-coded copy |
| `health:check` | CTAs, accessibility attributes, oversized images |
| `seo:check` | Canonicals, hreflang, OG, JSON-LD, sitemap, robots, RSS on the built site |
| `link:check` | Every internal link in `dist/` resolves |
| `keys:check` | No unresolved translation keys leak into HTML |
| `test` / `test:e2e` | Unit and browser tests |

## Locales and URLs

| Locale | Path |
|---|---|
| Australia (en-AU) | `/au-en/...` |
| France (fr-FR) | `/fr-fr/...` |

`algorythmos.com.au` and `algorythmos.fr` redirect to the matching locale on the
canonical domain, and legacy unprefixed URLs (`/about`, `/blog/...`) 308 to `/au-en`.
Locale paths and the canonical domain are frozen; changing them breaks canonicals,
hreflang and the sitemap.

## Project structure

```
src/
├── pages/             # Routes: [locale]/ for /au-en and /fr-fr, plus 404 and feed/robots/llms endpoints
├── layouts/           # BaseLayout: head, theme, consent, transitions
├── components/        # Astro components (layout, sections, ui, pages, seo)
├── data/              # Typed content: services, case studies, blog, business facts
├── i18n/              # useTranslations + dictionaries (en.global, en.au, fr.fr)
├── seo/               # schema.ts, OG page map, snapshot tests
└── styles/            # tokens.css, themes.css, global.css, console.css
api/                   # Vercel serverless functions
scripts/               # Validators and build tooling
e2e/                   # Playwright specs
legacy/                # Archived pre-Astro SPA — frozen, do not modify
```

## Contributing

Read [`docs/CONTRIBUTING.md`](docs/CONTRIBUTING.md) first. In short: every user-facing
string goes through `t()` with keys added to both EN and FR dictionaries; style only
with the semantic tokens; extend structured data, never replace it; never modify
`legacy/`. Supporting guides live in [`.algorythmos/`](.algorythmos/) and
[`docs/`](docs/).

## Licence

Proprietary — see [`LICENSE`](LICENSE). © Algorythmos Pty Ltd.

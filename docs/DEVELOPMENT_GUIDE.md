# Development guide — Algorythmos website (Astro 7)

Canonical contributor rules live in [`CONTRIBUTING.md`](CONTRIBUTING.md). This guide is
the practical companion: where things are, how to add content, and what the gates check.

## Stack

| Layer | Technology |
|---|---|
| Framework | Astro 7, static output (`astro build` → `dist/`) |
| Styling | Tailwind CSS 3 over semantic CSS custom properties (`src/styles/tokens.css`, `themes.css`) |
| Islands | React 18, only `src/components/islands/Chart.tsx` (`client:visible`) |
| i18n | Build-time dictionaries: `src/i18n/ui/en.global.json`, `en.au.json` (AU overrides), `fr.fr.json` |
| SEO | `src/components/seo/SEO.astro` (head), `src/seo/schema.ts` (JSON-LD), `src/seo/ogPages.ts` (OG cards) |
| Contact | `api/contact.js` — Vercel serverless function, Nodemailer over SMTP |
| Hosting | Vercel (`vercel.json`: redirects, security and cache headers) |

`npm run dev` serves on http://localhost:4321. Node version: see `.nvmrc`.

## Locales and URLs

| Locale | Prefix | Built | Indexed |
|---|---|---|---|
| `au-en` | `/au-en` | Yes | Yes (`x-default`) |
| `fr-fr` | `/fr-fr` | Yes | Yes |
| `en` (dictionary only) | none | No pages — legacy root URLs 308 to `/au-en` (`vercel.json`) | No |

`src/pages/[locale]/*.astro` generate the two trees from the page components in
`src/components/pages/`. Only the 404 page and the non-page routes (`rss.xml`, `llms.txt`,
`robots.txt`, `og/`) live at the root. `localizePath('en', …)` deliberately resolves to
`/au-en` so nothing can link into the retired tree. `algorythmos.com.au` and
`algorythmos.fr` redirect to the matching locale.

## Adding content

**A translation key.** Add it to `en.global.json` and `fr.fr.json` in the same change
(and `en.au.json` only for an AU-specific override). Render it with
`const t = useTranslations(locale)` → `t('key')`. Attribute copy (`aria-label`, `title`,
`placeholder`, `alt`) must also go through `t()`; `npm run i18n:check` fails otherwise.

**A blog post.** Add the entry to `src/data/blog.ts` (slug, index, dates, body blocks),
the `blog.posts.<index>.*` card keys and `blogDetail.posts.<slug>.*` body keys in both
dictionaries, and links in `src/data/related.ts`. RSS, sitemap `lastmod` and OG cards
follow automatically.

**A case study.** Add `{ slug, i18nIndex, date }` to `src/data/caseStudies.ts`, the
`caseStudies.items.<i>.*` card keys and the `caseStudyDetail.studies.<slug>.*` detail keys
(`title, meta, industry, region, focus, challenge, solution, approach.0-3, results.0-4,
stats.0-2.{value,label}, cta, keywords`; optional `badge`, `note`, `sources.N.{label,url}`,
`faqs.N.{question,answer}` — the FAQ renders visibly and as FAQPage schema),
charts in `src/data/caseStudyCharts.ts`, links in `related.ts`, the slug in
`e2e/french-locale.spec.ts`, and a claims section in `COPY_CLAIMS_SIGNOFF.md`.

**A service.** `src/data/services.ts` plus the `service<Name>.*` namespace in both
dictionaries and an entry in `src/seo/ogPages.ts` `SERVICE_NS`.

**Company facts.** Only in `src/data/business.ts`; schema, contact page, footer and
`llms.txt` derive from it. Never retype the address, ABN or emails elsewhere.

## Design rules

- Colour, spacing and type come from the semantic tokens; no hex literals in components
  (the always-dark product consoles use their own `console.css` variables).
- Every interactive element keeps a visible focus ring (`focus-visible:ring-*`).
- Motion must respect both `prefers-reduced-motion` and the on-page toggle: scripts call
  `motionOff()` from `src/lib/motion.ts`; CSS keys off `html[data-motion='off']`.
- Below-the-fold sections may use `data-reveal`; content inside the first viewport is
  shown synchronously.

## Quality gate (mirrors CI)

```bash
npm run lint && npm run check && npm run i18n:check && npm run health:check \
  && npm run build && npm run seo:check && npm run link:check && npm run keys:check \
  && npm run perf && npm test -- --run && npx playwright test \
  && node scripts/lh-check.mjs --strict
```

| Command | Enforces |
|---|---|
| `i18n:check` | EN/FR key parity; no identical untranslated strings; no hard-coded copy or attribute copy; title ≤ 60 and description 70–160 chars |
| `health:check` | Required CTAs, alt/aria attributes, image weight |
| `seo:check` | One title/description/canonical per page; root pages canonicalise to `/au-en`; 3 hreflang incl. `x-default`; OG/Twitter tags; NAP consistency with `business.ts`; sitemap URLs self-canonical; RSS validity |
| `link:check` | Every internal link resolves in `dist/` |
| `keys:check` | No raw translation keys leaked into HTML |
| `perf` | Bundle report; warns above 200 kB per chunk |
| Playwright | Chromium + WebKit: consoles, FR locale, SEO/marketing flows, axe accessibility |
| `lh-check --strict` | Mobile Lighthouse: LCP < 2.5 s, CLS < 0.1, TBT < 300 ms |

## Scheduled checks

`.github/workflows/external-links.yml` probes every external link in the built site weekly
and fails on 404/410, so cited sources that move are noticed. Dependabot runs weekly for npm
and monthly for Actions; majors for React, Tailwind, vitest, ESLint and TypeScript are
ignored until migrated deliberately. Master has a ruleset: the CI check must pass for
pull-request merges, force-pushes are blocked, and the repository admin can bypass.

## Deployment

Pushes to `master` deploy to production on Vercel. Preview deployments are `noindex`.
IndexNow is pinged after a successful production deployment. Search Console sitemap:
`https://algorythmos.com/sitemap-index.xml`.

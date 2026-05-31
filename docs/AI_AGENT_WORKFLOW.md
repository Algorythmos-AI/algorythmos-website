# AI Agent Workflow — Algorythmos (Astro 6)

> **Canonical workflow for every AI agent and human contributor.**
> This document supersedes the prior Vite + React SPA rules. The project has
> migrated to **Astro 6**; the old SPA is archived under `legacy/` and must not
> be touched. Read this file before changing anything.

---

## 1. Stack overview

- **Astro 6**, static-first (`astro build` → `dist/`). The site is real, static
  HTML — there is no client-side router for content pages.
- **Dual-theme design tokens.** Light + dark are driven entirely by CSS custom
  properties in `src/styles/tokens.css` (theme-agnostic) and
  `src/styles/themes.css` (per-theme semantic values). Never hardcode colors.
- **Build-time i18n via `useTranslations`.** The pure, framework-agnostic core
  lives in `src/i18n/index.ts`. In `.astro` frontmatter you call
  `const t = useTranslations(locale)` and emit `t('some.key')` — this resolves
  at build time and ships **zero** client JS for copy.
- **Islands only where interactive.** Default to static `.astro`. Add a React
  island (`client:*`) **only** for genuinely interactive UI, and pass it the
  already-resolved strings (via `pickMessages`) — never the whole dictionary or
  the `t` function.
- **SEO via `SEO.astro` + `schema.ts`.** All head metadata (title, description,
  canonical, hreflang, OpenGraph, Twitter, JSON-LD) is centralized in
  `src/components/seo/SEO.astro` (with `JsonLd.astro`) and the structured-data
  graph in `src/seo/schema.ts`. Do not hand-write `<meta>`/`<link rel>` tags in
  pages — feed `SEO.astro` instead.

### Locales

| Locale  | URL prefix | hreflang  | Dictionary                     |
| ------- | ---------- | --------- | ------------------------------ |
| `en`    | _(none)_   | `en` + `x-default` | `src/i18n/ui/en.global.json` |
| `au-en` | `/au-en`   | `en-AU`   | `src/i18n/ui/en.au.json` (merged over global) |
| `fr-fr` | `/fr-fr`   | `fr-FR`   | `src/i18n/ui/fr.fr.json` (merged over global) |

`au-en` and `fr-fr` inherit `en.global.json` as a fallback (`{...enGlobal, ...override}`).

---

## 2. The EN/FR rule (non-negotiable)

1. **Every user-facing string goes through `t()`** (`useTranslations`). No
   literal sentences in `.astro` markup or in island JSX.
2. **Keys live in `src/i18n/ui/*.json`.** Add the key to `en.global.json`
   (English/global source of truth) **and** provide the French value in
   `fr.fr.json`. Region-specific English overrides go in `en.au.json`.
3. **Never hardcode** English or French copy anywhere in `src/`.
4. **Run `npm run i18n:check`** before every commit. It enforces EN↔FR key
   parity (no missing keys in either direction) and flags likely-untranslated
   identical values. Missing keys fail the check.

`health:check` additionally scans `.astro`/`.tsx` for hardcoded CTA strings
(EN + FR) and literal sentences in markup — hardcoded CTAs hard-fail.

---

## 3. The design-token rule

- Style **only** with the semantic design tokens. Use variables such as
  `--bg`, `--surface-*`, `--text`, `--text-muted`, `--text-subtle`, `--border`,
  `--border-strong`, `--brand`, `--brand-strong`, `--accent`, `--ring`, and the
  motion/radius/spacing scales from `src/styles/tokens.css`.
- **Never** introduce raw hex/rgb colors, ad-hoc pixel shadows, or one-off
  values in components. If a token is missing, add it to the token layer
  (`tokens.css` / `themes.css`) — do not inline it.
- Both themes must remain correct: anything you add must read from the token
  layer so light and dark stay in sync automatically.

---

## 4. Pre-commit command block

Run this full gate locally before committing. It mirrors CI exactly:

```bash
npm run check && npm run i18n:check && npm run health:check && npm run build && npm run seo:check && npm run link:check
```

- `npm run check` — `astro check` (type-check, hard gate).
- `npm run i18n:check` — EN/FR parity (hard gate).
- `npm run health:check` — hardcoded strings / alt text / image weight.
- `npm run build` — `astro build` → `dist/`.
- `npm run seo:check` — validates the built `dist/` HTML (titles, canonical,
  hreflang, OG/Twitter, JSON-LD, robots/sitemap/llms).
- `npm run link:check` — crawls `dist/` and verifies every internal link
  resolves to a built file.

`npm test` (vitest) and `npm run perf` (bundle report, advisory) round out the
optional local checks.

---

## 5. SEO rules

- **One canonical domain: `https://algorythmos.com`.** Every canonical, OG URL,
  sitemap entry, and schema URL is the bare `.com` — no `www.`, no `.ai`, no
  `.fr`, no protocol-relative URLs.
- **Locale URLs:** the default (`en`) lives at the root; `au-en` lives under
  `/au-en`; `fr-fr` lives under `/fr-fr`. Canonicals carry the correct
  per-locale prefix.
- **hreflang via `SEO.astro`.** Every page emits exactly **4** alternates —
  `en`, `en-AU`, `fr-FR`, and `x-default` (→ the `en` root). Don't add or remove
  alternates by hand.
- **OpenGraph / Twitter:** `og:title`, `og:description`, `og:url`, `og:image`
  (`https://algorythmos.com/Algorythmos.png`), plus `twitter:card` are always
  present. The OG image is the fixed brand asset.
- **Structured data:** keep the single identity graph in `src/seo/schema.ts`
  (Organization + WebSite, all `@id`/`url` on `.com`). Each page ships at least
  one `application/ld+json` block that JSON-parses. Preserve existing schemas —
  extend, don't replace.
- **Static SEO files** are emitted to `dist/`: `robots.txt` (references the
  sitemap), `sitemap-index.xml` (via `@astrojs/sitemap`), and `llms.txt`.
  Sitemaps are no longer generated by a custom script.

---

## 6. Hard "do not" list

- Do **not** edit anything under `legacy/` (archived Vite SPA).
- Do **not** hardcode EN/FR copy — use `t()` and the `src/i18n/ui/*.json` dicts.
- Do **not** hand-write head metadata; route it through `SEO.astro`.
- Do **not** change the canonical domain or the locale URL patterns.
- Do **not** delete translation keys or governance files.
- Do **not** skip the pre-commit command block.

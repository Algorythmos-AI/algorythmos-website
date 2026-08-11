# src/CLAUDE.md — rules for the Astro website source

Scope: everything under `src/`. The root [`/CLAUDE.md`](../CLAUDE.md) is the macro
index; this file is the working detail for site code. The canonical long-form rules
remain [`/docs/AI_AGENT_WORKFLOW.md`](../docs/AI_AGENT_WORKFLOW.md) and
[`/.algorythmos/`](../.algorythmos/) — read them before a substantial change.

**Warning before you trust the older docs:** `README.md`, `docs/DEVELOPMENT_GUIDE.md`,
`docs/SEO_GOVERNANCE.md`, `docs/AUDIT_HISTORY.md` and `.algorythmos/CODE_STYLE_GUIDE.md`
still describe the pre-migration Vite + React SPA. They reference `src/App.jsx`,
`src/app/i18n/`, `src/data/services.js` and `useI18n()` — none of which exist. Where
they disagree with this file or `AI_AGENT_WORKFLOW.md`, they are wrong.

---

## The stack, as it actually is

Astro 6, static output, TypeScript, Tailwind 3 + CSS custom properties. React 18 is
present but only for islands. `astro dev` serves on **4321**, not 5173.

## Layout

| Path | What lives there |
|---|---|
| `pages/` | Routes. Root files are AU-English; `pages/[locale]/` generates `/au-en` and `/fr-fr`. |
| `components/seo/` | `SEO.astro` (all head metadata), `JsonLd.astro`. |
| `seo/` | `schema.ts` (structured data), `ogPages.ts`, schema tests + snapshots. |
| `i18n/` | `index.ts` exports `useTranslations(locale)`; strings in `i18n/ui/*.json`. |
| `styles/` | `tokens.css`, `themes.css`, `global.css`, `console.css`. |
| `data/` | Typed content sources — services, blog, case studies, `business.ts`. |
| `components/`, `layouts/`, `lib/`, `assets/` | Components, page shells, helpers, local media. |

## Non-negotiables

1. **EN/FR parity.** Every user-facing string goes through `t()` from
   `useTranslations(locale)`. Keys live in `src/i18n/ui/en.global.json` and
   `fr.fr.json` — both must gain the key in the same change. `en.au.json` holds
   AU-only overrides. `npm run i18n:check` must report 0 missing in each direction.
2. **Tokens only.** Colour, spacing and typography come from the semantic tokens in
   `styles/tokens.css` / `themes.css`. No hex literals, no arbitrary Tailwind values
   for themed properties.
3. **Head metadata is centralised.** Title, description, canonical, hreflang, OG —
   all through `components/seo/SEO.astro`. Never emit a `<title>` or `<meta name="description">`
   from a page or component.
4. **Extend schema, never replace.** Structured data changes go in `seo/schema.ts`.
   Snapshot tests in `seo/__snapshots__/` will catch a replacement; update them
   deliberately, not reflexively.
5. **URLs are frozen.** Canonical domain `https://algorythmos.com`; locale paths
   `/au-en` and `/fr-fr`. Changing either breaks canonicals, hreflang and the sitemap.
6. **`legacy/` is archived.** Never modify it. Never import from it.

## Company facts

`data/business.ts` is the single source for anything about the entity, and it carries
a standing instruction not to invent identifiers. Two live constraints:

- `legalName` currently reads `'Algorythmos'`. The registered legal name is
  **ALGORYTHMOS PTY LTD.** — if you touch this field, use the registered form and
  keep it consistent with the root CLAUDE.md table.
- **No new French corporate or legal claims.** No SIRET, no French registration
  number, no French registered street address. `business.ts` already publishes an
  "Algorythmos France" presence and `.fr` profiles; do not extend that surface until
  the entity question is resolved.
- The Sydney premises are a virtual office. The site is modelled as a **service-area
  business** — city-level areas, no street address in schema, contact pages or
  `llms.txt`. Keep it that way.

## Before you commit

```bash
npm run check && npm run i18n:check && npm run health:check && npm run build && npm run seo:check && npm run link:check
```

This mirrors CI. `check` and `build` must be clean. `seo:check` and `link:check` must
exit 0. `i18n:check` and `health:check` currently emit advisory warnings (untranslated
candidates, oversized images) — do not *add* to those counts.

---

*Companion to the root CLAUDE.md. If this file and `/docs/AI_AGENT_WORKFLOW.md` ever
disagree, the workflow doc wins and this file needs fixing.*

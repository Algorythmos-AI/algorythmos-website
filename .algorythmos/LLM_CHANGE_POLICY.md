# LLM Change Policy

> 🟢 **MIGRATED TO ASTRO 6.** This project is now an Astro 6 static site (the old
> Vite + React SPA is archived under `legacy/` and must not be touched). The
> prior Vite/JSX-specific prohibitions are **superseded** by the canonical
> workflow in **[/docs/AI_AGENT_WORKFLOW.md](../docs/AI_AGENT_WORKFLOW.md)**.
> The intent below is unchanged: **EN/FR parity, pre-commit checks, and schema
> discipline.** Read the workflow doc first.

## What AI Agents MUST Do
- Read **/docs/AI_AGENT_WORKFLOW.md** first
- Run `npm run i18n:check` before commit (EN↔FR key parity)
- Add EN + FR for all new strings (keys in `src/i18n/ui/*.json`)
- Use `t()` / `useTranslations` for all user-facing text
- Preserve existing SEO schemas (`src/seo/schema.ts`) — extend, don't replace
- Style only with semantic design tokens (`src/styles/tokens.css` / `themes.css`)
- Route all head metadata through `src/components/seo/SEO.astro`

## What AI Agents MUST NOT Do
- Touch `legacy/` (the archived Vite SPA)
- Remove governance files
- Hardcode English/French
- Change the canonical domain (`https://algorythmos.com`) or locale URL patterns
  (`/au-en`, `/fr-fr`)
- Delete translation keys
- Skip validation commands

## Required Commands Before Commit
```bash
npm run check && npm run i18n:check && npm run health:check && npm run build && npm run seo:check && npm run link:check
```

> Legacy note: the old block (`i18n:check`, `health:check`, `lint`, `build`) is
> replaced by the gate above, which adds `astro check`, dist-based `seo:check`,
> and `link:check`.

## Full rules: /docs/AI_AGENT_WORKFLOW.md

# Engineering governance — read before changing anything

This project is an Astro 7 static site. The old Vite + React SPA is archived under
`legacy/` and must not be modified. The canonical rules are in
`/docs/CONTRIBUTING.md`; the files in this folder are supporting guides.

Before modifying anything:
- Read `/docs/CONTRIBUTING.md`.
- Never touch `legacy/`.
- Keep EN + FR parity — every user-facing string via `t()`; keys in `src/i18n/ui/*.json`.
- Use only semantic design tokens (`src/styles/tokens.css` / `themes.css`).
- Keep all head metadata in `src/components/seo/SEO.astro` and schema in `src/seo/schema.ts`.

Run the full pre-commit gate (mirrors CI):

    npm run check && npm run i18n:check && npm run health:check && npm run build && npm run seo:check && npm run link:check

(At minimum, always run `npm run i18n:check`.)

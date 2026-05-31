🚨 IMPORTANT — AI AGENTS MUST READ

🟢 MIGRATED TO ASTRO 6.
This project is now an Astro 6 static site. The old Vite + React SPA is archived
under legacy/ and MUST NOT be modified. Any prior Vite/JSX-specific prohibitions
are superseded by /docs/AI_AGENT_WORKFLOW.md — but the intent is preserved:
EN/FR parity, pre-commit checks, and schema discipline.

All development rules are defined in /docs/AI_AGENT_WORKFLOW.md.

Before modifying anything:
- Read the workflow document (/docs/AI_AGENT_WORKFLOW.md).
- Never touch legacy/.
- Ensure EN+FR parity — every user-facing string via t(); keys in src/i18n/ui/*.json.
- Use only semantic design tokens (src/styles/tokens.css / themes.css).
- Keep all head metadata in src/components/seo/SEO.astro and schema in src/seo/schema.ts.

Run the full pre-commit gate (mirrors CI):

  npm run check && npm run i18n:check && npm run health:check && npm run build && npm run seo:check && npm run link:check

(At minimum, always run: npm run i18n:check)

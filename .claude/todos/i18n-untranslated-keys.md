# TODO — resolve untranslated i18n keys

**Source:** PR #5 audit (`.claude/audits/PR-5-2026-04-21.md`)

## Problem

The `validate` job (i18n validation) is red on CI. The site's i18n system falls back from FR to EN silently, so missing French translations do not break rendering — they just ship English to French-speaking users. Needs a proper pass.

## Plan

1. Run `npm run i18n:check` locally and capture the list of missing keys.
2. Group by page so the PR can be split if the diff gets too large:
   - home + navigation
   - services (7 pages)
   - careers
   - case studies + blog
   - legal (privacy / terms)
   - contact + pricing + about
3. Translate each group in `src/app/i18n/fr.fr.json` (and `en.global.json` if any EN keys are also missing).
4. Keep `npm run i18n:check` green.

## Acceptance

- `npm run i18n:check` exits 0.
- Visiting `/fr-fr/<page>` for every page shows French copy end-to-end, no English fallback.

Delete this file in the PR that closes the issue.

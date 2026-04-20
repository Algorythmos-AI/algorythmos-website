# TODO — restore MLOps pipeline E2E selector

**Source:** PR #5 audit (`.claude/audits/PR-5-2026-04-21.md`)

## Problem

Six E2E tests fail on `/services/mlops-cicd` across chromium, firefox, and webkit:

- `e2e/mlops-pause.spec.ts` expects `[data-pipeline="mlops"]` to be visible.
- `e2e/acronym-expansions.spec.ts` also anchors on the MLOps pipeline.

The selector does not render in the current page (`document.querySelector('[data-pipeline="mlops"]')` returns `null` during a fresh navigation at 1440px).

## Hypotheses

1. The `data-pipeline="mlops"` attribute was dropped from the pipeline component during the PR #5 icon/emoji cleanup — check `src/pages/services/services/MlopsCicdPage.jsx` and whichever component owns the pipeline visualisation.
2. The pipeline now lazy-mounts behind an intersection observer and the test needs a scroll step before `expect(locator).toBeVisible()`.

## Acceptance

- `npm run test:e2e` passes across chromium/firefox/webkit for `e2e/mlops-pause.spec.ts` and `e2e/acronym-expansions.spec.ts`.
- Either the data attribute is restored, or the specs are updated with the required interaction.

Delete this file in the PR that closes the issue.

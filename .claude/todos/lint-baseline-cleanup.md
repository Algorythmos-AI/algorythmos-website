# TODO — clean up the 5 baseline lint errors

**Source:** PR #5 audit (`.claude/audits/PR-5-2026-04-21.md`)

## Problem

`npm run lint` reports 5 errors on master. `continue-on-error` was removed from the ESLint job in a prior hardening push, so CI is red until these are fixed.

| File | Error |
|---|---|
| `src/components/ui/blog/BlogChart.jsx:72` | `'index' is defined but never used` |
| `src/pages/insights/ClinicalEvidenceContent.jsx:1` | `'useRef' is defined but never used` |
| `src/pages/insights/HealthcareBurdenContent.jsx:223` | `'gpImpactData' is assigned a value but never used` |
| `src/pages/insights/PulseContent.jsx:18` | `'useI18n' is defined but never used` |
| `src/pages/insights/layouts/StandardLayout.jsx:4` | `'t' is defined but never used` (function arg) |

All five are trivial: remove the unused import, destructure, or argument. Do not stub them with `// eslint-disable-next-line` — the fix is to delete the dead code.

## Acceptance

- `npm run lint` exits 0.
- Warnings may remain (not in scope for this PR).

Delete this file in the PR that closes the issue.

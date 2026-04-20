# TODO — address `npm audit` vulnerabilities

**Source:** PR #5 audit (`.claude/audits/PR-5-2026-04-21.md`)

## Problem

`npm audit` reports 12 vulnerabilities (4 moderate, 7 high, 1 critical) in platform dependencies. CI's "🛡️ Security Audit" job fails on this.

Current offenders:

- `react-router` / `react-router-dom` (5 advisories — CSRF, XSS, open-redirect, SSR XSS, XSS via untrusted paths).
- `vite` (path traversal, dev-server WebSocket arbitrary read).
- `rollup` (path-traversal).
- `yaml` (stack overflow).
- `picomatch` (ReDoS).

## Plan

1. Run `npm audit fix` on a clean checkout.
2. For anything left behind, evaluate whether a major-version bump is safe (react-router 7.x → latest 7.x patch should be painless; vite 6 → 7 is a bigger move).
3. If a transitive dep can't be updated via our tree, use `overrides` in `package.json`.
4. Re-run `npm test`, `npm run test:e2e`, `npm run build` before pushing.

## Acceptance

- `npm audit --audit-level=high` exits 0.
- All existing test + E2E suites still pass.
- No hard-pins introduced via `overrides` without a comment explaining why.

Delete this file in the PR that closes the issue.

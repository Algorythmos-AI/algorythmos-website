# Full-Site Audit

Run this against any open PR after significant UI changes. Requires the Playwright MCP:

```
claude mcp add playwright npx '@playwright/mcp@latest'
```

---

You have access to: bash, file editing, the Playwright MCP (browser control), and git/gh CLI.

Run the following audit end-to-end. Do not stop for permission between phases unless something is destructive or ambiguous. Report progress as you go.

═══════════════════════════════════════════════════════════════
PHASE 1 — Boot the local dev server
═══════════════════════════════════════════════════════════════

1. Check if anything is already running on port 5173 (or whatever Vite uses). If so, kill it.
2. Start the dev server in the background: nohup npm run dev > /tmp/dev-server.log 2>&1 &
3. Poll http://localhost:5173 every 1s for up to 30s until it returns 200. If it never does, tail /tmp/dev-server.log and stop.
4. Confirm the server is up before proceeding.

═══════════════════════════════════════════════════════════════
PHASE 2 — Local visual + functional audit (Playwright MCP)
═══════════════════════════════════════════════════════════════

For BASE_URL = http://localhost:5173, walk every URL below. At each one:
  - Take a screenshot at 1440px width AND 390px width (mobile)
  - Capture browser console errors and warnings
  - Capture any 4xx/5xx network responses
  - Verify zero raw i18n keys are visible on the page
  - Verify zero stray emojis in UI chrome — blog/case-study content emojis are fine

URLs to walk:
  /
  /services (and every sub-service page)
  /pricing
  /about
  /blog (and one or two post URLs)
  /case-studies (and one case study)
  /contact
  /careers
  /au-en/careers  (Australian locale)
  /fr-fr/careers  (French locale)
  /nonexistent-route (confirm 404 page renders)

For /careers specifically, additionally:
  - Click every button and link, confirm the destination URL or mailto target
  - Verify the "Join talent network" CTA opens mailto:careers@algorythmos.com with the right subject
  - Verify all four value cards render with Lucide icons
  - Verify all eight benefits render
  - Verify all three locations render
  - Verify EEO statement is present

For homepage service cards, additionally:
  - Confirm all six cards show Lucide icons
  - Confirm no emoji glyphs anywhere in card titles or bodies

═══════════════════════════════════════════════════════════════
PHASE 3 — Diagnose and fix
═══════════════════════════════════════════════════════════════

Categorise every finding from Phase 2 into:
  A. BLOCKER — actual breakage
  B. POLISH — visual issue worth fixing now
  C. NOTE — pre-existing or out-of-scope

Fix every A. Fix every B that takes under 10 minutes. List C in the final report.

After fixes, re-run Phase 2 only on the URLs you touched.

═══════════════════════════════════════════════════════════════
PHASE 4 — Local quality gates
═══════════════════════════════════════════════════════════════

Run, in order:
  npm run lint
  npm test
  npm run build

If lint shows MORE errors than the pre-existing ones, fix the new ones.
If tests fail, fix them.
If build fails, fix it.

═══════════════════════════════════════════════════════════════
PHASE 5 — Push and trigger Vercel preview
═══════════════════════════════════════════════════════════════

1. git status — show what changed.
2. git commit with a clear conventional-commits message.
3. git push
4. Wait ~30 seconds, then fetch the latest Vercel preview URL from the PR comments.
5. Poll the preview URL until it returns 200 (Vercel cold builds can take 2-3 minutes).

═══════════════════════════════════════════════════════════════
PHASE 6 — Re-run audit against the Vercel preview
═══════════════════════════════════════════════════════════════

Repeat Phase 2 with BASE_URL set to the Vercel preview URL.

Vercel Deployment Protection is enabled on this project, so anonymous
GET returns 401. Bypass it with the automation secret:

  export SECRET="$VERCEL_AUTOMATION_BYPASS_SECRET"   # repo secret
  FIRST_URL="$PREVIEW_URL/?x-vercel-protection-bypass=$SECRET&x-vercel-set-bypass-cookie=true"

Navigate Playwright to FIRST_URL once — the response sets a
_vercel_jwt cookie that covers the rest of the session, so
subsequent navigations use the plain URL (no query-string tax).

  The set-bypass-cookie=true part matters. Without it you would
  have to append the bypass query string (or send the
  x-vercel-protection-bypass header) on every single navigation,
  which Playwright will not do automatically for in-page clicks.

If the secret is not available, stop and ask — do not proceed with
a partial audit.

If anything new appears, loop back to Phase 3.

═══════════════════════════════════════════════════════════════
PHASE 7 — Final report
═══════════════════════════════════════════════════════════════

Produce a markdown report at /tmp/audit-report.md containing:
  - Summary: PASS / PASS WITH FIXES / FAIL
  - What was broken and what you fixed (link to commits)
  - Local screenshots vs preview screenshots for /careers and /
  - Pre-existing issues found but NOT fixed (out of scope)
  - Recommendations for follow-up PRs
  - Final verdict: safe to merge? Yes/No with reasoning.

Also kill the local dev server: pkill -f "vite"

═══════════════════════════════════════════════════════════════
GUARDRAILS
═══════════════════════════════════════════════════════════════

- Do NOT merge the PR. That's the human's call.
- Do NOT touch .env, security config, CI workflows, or anything outside this branch's scope.
- Do NOT silence or delete failing tests to make them pass.
- If you hit ambiguity, pause and ask.
- If the Playwright MCP is not available, stop immediately and report.

import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright config — Astro 6 static build.
 *
 * Targets the Astro preview server on :4321 (built output), not the old Vite
 * dev server. The webServer builds then previews so e2e runs against real HTML.
 *
 * NOTE: the existing e2e specs were written for the OLD Vite/React SPA:
 *  - e2e/mlops-pause.spec.ts is ignored — it exercises a component that no
 *    longer exists in the Astro app (pre-existing red, tracked for rework).
 *  - e2e/acronym-expansions.spec.ts may also need rework against the new
 *    markup; it is kept (not deleted) and left runnable.
 */
export default defineConfig({
  testDir: './e2e',
  // The mlops-pause spec targets a removed SPA component — skip until reworked.
  testIgnore: ['e2e/mlops-pause.spec.ts'],
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  // `open: 'never'` — the report server otherwise blocks headless/CI runs.
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: 'http://localhost:4321',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'npm run build && npm run preview',
    url: 'http://localhost:4321',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});

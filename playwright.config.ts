import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright config — Astro 6 static build.
 *
 * The webServer builds then previews the real HTML on a dedicated port (4331)
 * so a stray `astro dev` on the default 4321 can never be picked up by
 * `reuseExistingServer` and silently tested instead of this site.
 */
const PORT = 4331;
export const E2E_ORIGIN = `http://localhost:${PORT}`;
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  // `open: 'never'` — the report server otherwise blocks headless/CI runs.
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: E2E_ORIGIN,
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      /* The worst historical mobile bug was iOS-only, so WebKit runs the console + FR specs too. */
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
      testMatch: /(console|french-locale|a11y)\.spec\.ts/,
    },
  ],
  webServer: {
    /* CI has already run `npm run build`; locally we build first so the preview is fresh. */
    command: process.env.CI ? 'npx astro preview --port 4331' : 'npm run build && npx astro preview --port 4331',
    url: E2E_ORIGIN,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});

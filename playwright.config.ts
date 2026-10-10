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
/* Specs that hold a live 3D scene open. Headless browsers render WebGL in software:
   compiling a scene's shaders blocks its page for seconds and pegs every core, so
   two such pages at once starve each other past any sensible timeout. Each engine
   therefore runs them in a project of its own, one test at a time, and the three
   projects are chained so only one engine is rendering a scene at any moment.
   (To run one engine's scene specs alone: `--project=firefox-scenes --no-deps`.) */
const SCENE_SPECS = /(scene3d|scene3d-soak|csp)\.spec\.ts/;

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
      testIgnore: SCENE_SPECS,
    },
    {
      name: 'chromium-scenes',
      use: { ...devices['Desktop Chrome'] },
      testMatch: SCENE_SPECS,
      workers: 1,
    },
    {
      /* The worst historical mobile bug was iOS-only, so WebKit runs the console + FR specs too,
         and the motion and navigation-state contracts. */
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
      testMatch: /(console|french-locale|a11y|responsive-header|overlays|motion|navigation-state)\.spec\.ts/,
    },
    {
      name: 'webkit-scenes',
      use: { ...devices['Desktop Safari'] },
      testMatch: /(scene3d|csp)\.spec\.ts/,
      workers: 1,
      dependencies: ['chromium-scenes'],
    },
    {
      /* A third engine for what differs most between browsers: WebGL, and the page
         state the client router has to restore. */
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
      testMatch: /(motion|navigation-state)\.spec\.ts/,
    },
    {
      name: 'firefox-scenes',
      use: { ...devices['Desktop Firefox'] },
      testMatch: /(scene3d|csp)\.spec\.ts/,
      workers: 1,
      dependencies: ['webkit-scenes'],
    },
    /* Real phone viewports, touch and pixel density. The desktop projects never saw the
       see-through menu or cookie banner, so overlays and a11y also run on a phone of each engine. */
    {
      name: 'mobile-chromium',
      use: { ...devices['Pixel 7'] },
      testMatch: /(overlays|a11y)\.spec\.ts/,
    },
    {
      name: 'mobile-webkit',
      use: { ...devices['iPhone 15'] },
      testMatch: /(overlays|a11y)\.spec\.ts/,
    },
  ],
  webServer: {
    /* CI has already run `npm run build`; locally we build first so the preview is fresh.
       `--ignore-lock`: Astro 7's preview keeps a lock file and refuses to start (exits 0)
       when a stale one exists, which Playwright reports as "exited early". */
    command: process.env.CI
      ? 'npx astro preview --port 4331 --ignore-lock'
      : 'npm run build && npx astro preview --port 4331 --ignore-lock',
    /* Readiness probe hits a real page: `/` is a 404 now that only the locale trees are built. */
    url: `${E2E_ORIGIN}/au-en`,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});

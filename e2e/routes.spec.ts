/**
 * Every route — e2e sweep.
 *
 * Loads each page in the sitemap (both locales) with motion on and checks the
 * things no single-page spec can: that no route throws or logs an error, and
 * that wherever a 3D scene is mounted it settles — on the live scene or on its
 * still — and is never left `loading`.
 *
 * One long test rather than a hundred short ones: the pages share a browser
 * context, which is also how a visitor moves through the site.
 */
import { test, expect } from '@playwright/test';
import { MOUNT } from './helpers/scene3d';

test('no route throws, logs an error, or leaves a scene loading', async ({ page, baseURL }) => {
  test.setTimeout(10 * 60_000);

  const xml = await (await page.request.get('/sitemap-0.xml')).text();
  const routes = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
  expect(routes.length, 'the sitemap lists the site').toBeGreaterThan(90);
  expect(routes.some((r) => r.startsWith('/au-en'))).toBe(true);
  expect(routes.some((r) => r.startsWith('/fr-fr'))).toBe(true);

  const problems: string[] = [];
  let current = '';
  page.on('pageerror', (e) => problems.push(`${current} — pageerror: ${e}`));
  page.on('console', (msg) => {
    if (msg.type() === 'error') problems.push(`${current} — console: ${msg.text()}`);
  });
  page.on('requestfailed', (req) => {
    const url = req.url();
    // Same-origin assets only: a blocked third-party beacon is not this site failing.
    if (url.startsWith(baseURL!)) problems.push(`${current} — request failed: ${url}`);
  });

  let withScene = 0;
  for (const route of routes) {
    current = route;
    const response = await page.goto(route, { waitUntil: 'load' });
    if (!response || response.status() !== 200) {
      problems.push(`${route} — HTTP ${response?.status()}`);
      continue;
    }
    const mount = page.locator(MOUNT).first();
    if ((await mount.count()) === 0) continue;
    withScene++;
    // The loader acts at idle after load; give it room, then it must have settled.
    const settled = await expect
      .poll(async () => mount.getAttribute('data-scene-state'), { timeout: 30_000, intervals: [250, 500, 1000] })
      .toMatch(/^(static|live)$/)
      .then(() => true)
      .catch(() => false);
    if (!settled) problems.push(`${route} — scene stuck at "${await mount.getAttribute('data-scene-state')}"`);
    else if (!(await mount.getAttribute('data-scene-plan'))) problems.push(`${route} — scene mount was never initialised`);
  }

  expect(withScene, 'every page but the legal and support ones mounts a scene').toBeGreaterThanOrEqual(80);
  expect(problems).toEqual([]);
});

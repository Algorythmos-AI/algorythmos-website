/**
 * `?scene-debug` readout — e2e.
 *
 * The readout is how a phone with no developer tools says why its scene is a
 * still. It must name the real reason, cost a normal visit nothing, and never
 * be able to break the page. Runs on desktop and on the phone projects.
 */
import { test, expect, type Page } from '@playwright/test';
import { MOUNT, noWebgl, watchErrors } from './helpers/scene3d';

const HOME = '/au-en';
const DEBUG_CHUNK = /\/_astro\/debug\.[\w-]+\.js/;
const readout = (page: Page) => page.locator('[data-scene-debug]');
const mount = (page: Page) => page.locator(MOUNT).first();

function watchDebugChunk(page: Page): string[] {
  const hits: string[] = [];
  page.on('request', (req) => {
    if (DEBUG_CHUNK.test(req.url())) hits.push(req.url());
  });
  return hits;
}

test('a normal visit never fetches the readout', async ({ page }) => {
  const hits = watchDebugChunk(page);
  await page.goto(HOME);
  await expect(mount(page)).toHaveAttribute('data-scene-plan', /.+/);
  await page.waitForTimeout(1500);
  expect(hits).toEqual([]);
  await expect(readout(page)).toHaveCount(0);
});

test('with the flag, it prints the plan the page is actually on', async ({ page }) => {
  const errors = watchErrors(page);
  const hits = watchDebugChunk(page);
  await noWebgl(page); // the same answer on every machine, whatever GPU it has
  await page.goto(`${HOME}?scene-debug`);
  await expect(readout(page)).toBeVisible();
  expect(hits.length, 'the readout is a chunk of its own').toBeGreaterThan(0);

  const plan = await mount(page).getAttribute('data-scene-plan');
  await expect(readout(page)).toContainText(`plan    ${plan}`);
  await expect(readout(page)).toContainText('webgl2  no  strict no');
  await expect(readout(page)).toContainText(/orb {5}(live|static)/);
  await expect(readout(page)).toContainText('motion  os-reduce no  paused no  gave-up no');
  await expect(readout(page)).toHaveAttribute('aria-hidden', 'true');
  expect(errors).toEqual([]);
});

test('no WebGL2 is named as the failure once the scene has tried to start', async ({ page }) => {
  await noWebgl(page);
  await page.goto(`${HOME}?scene-debug`);
  await expect(mount(page)).toHaveAttribute('data-scene-plan', /.+/);
  /* Phones wait for a touch before they try (until that changes, one is given here). */
  if ((await mount(page).getAttribute('data-scene-plan'))?.startsWith('interaction')) {
    await expect(mount(page)).toHaveAttribute('data-scene-step', 'armed');
    await page.locator('h1').first().tap();
  }
  await expect(mount(page)).toHaveAttribute('data-scene-fail', 'no-webgl', { timeout: 15_000 });
  await expect(mount(page)).toHaveAttribute('data-scene-state', 'static');
  await expect(readout(page)).toContainText('fail    no-webgl');
});

test.describe('reduced motion', () => {
  test.use({ reducedMotion: 'reduce' });
  test('is reported as the OS setting, not as a stored pause', async ({ page }) => {
    await page.goto(`${HOME}?scene-debug`);
    await expect(readout(page)).toContainText('plan    never:low:motion-off');
    await expect(readout(page)).toContainText('motion  os-reduce yes  paused no');
    await expect(readout(page)).toContainText('orb     static (motion-off)');
  });
});

test('a stored pause is reported as such', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('motion', 'off'));
  await page.goto(`${HOME}?scene-debug`);
  await expect(readout(page)).toContainText('plan    never:low:motion-off');
  await expect(readout(page)).toContainText('motion  os-reduce no  paused yes');
});

test('it stays up across a client-side navigation', async ({ page }) => {
  await noWebgl(page);
  await page.goto(`${HOME}?scene-debug`);
  await expect(readout(page)).toBeVisible();
  await page.evaluate(() => {
    const link = document.querySelector<HTMLAnchorElement>('footer a[href$="/services"]');
    if (!link) throw new Error('no services link in the footer');
    link.click();
  });
  await page.waitForURL(/\/services$/);
  await expect(readout(page)).toBeVisible();
  await expect(readout(page)).toContainText(/plan {4}\S+|scene {3}none on this page/);
});

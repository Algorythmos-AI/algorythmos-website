/**
 * Live 3D scenes — e2e.
 *
 * The rule under test: the page never depends on a scene. Whoever cannot, or
 * should not, get live 3D keeps the still and never downloads the engine; and
 * every way a running scene can fail lands back on the still with the page intact.
 *
 * CI renders WebGL in software, which the site itself refuses (a still looks
 * better than a slideshow), so tests that need a live scene opt in with
 * forceScene(). See e2e/helpers/scene3d.ts. Runs on every desktop engine; the
 * slower endurance and race cases are in scene3d-soak.spec.ts (Chromium).
 */
import { test, expect, type Page } from '@playwright/test';
import { ENGINE_CHUNK, MOUNT, STAGE, forceScene, hasWebgl2, noWebgl, stats, watchEngine, watchErrors } from './helpers/scene3d';

const HOME = '/au-en';
/* A software-rendered scene takes seconds to start and pegs every core while it
   runs. Give it room, and never run two of these pages at once. */
const LIVE_TIMEOUT = 90_000;
test.describe.configure({ mode: 'default', timeout: 180_000 });

const mount = (page: Page) => page.locator(MOUNT).first();
const orb = (page: Page) => page.locator('[data-neural-orb]');
const goLive = async (page: Page, path = HOME) => {
  await page.goto(path);
  await expect(mount(page)).toHaveAttribute('data-scene-state', 'live', { timeout: LIVE_TIMEOUT });
};

test.describe('who gets the still, and never downloads the engine', () => {
  test('reduced motion', async ({ page }) => {
    const engine = watchEngine(page);
    await forceScene(page);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(HOME);
    await page.waitForTimeout(2500);
    await expect(mount(page)).toHaveAttribute('data-scene-state', 'static');
    await expect(mount(page)).toHaveAttribute('data-scene-plan', 'never:low:motion-off');
    await expect(page.locator(STAGE)).toHaveCount(0);
    expect(engine).toEqual([]);
  });

  test('motion paused on an earlier visit', async ({ page }) => {
    const engine = watchEngine(page);
    await forceScene(page);
    await page.addInitScript(() => localStorage.setItem('motion', 'off'));
    await page.goto(HOME);
    await page.waitForTimeout(2500);
    await expect(mount(page)).toHaveAttribute('data-scene-plan', 'never:low:motion-off');
    expect(engine).toEqual([]);
  });

  test('more contrast requested', async ({ page }) => {
    const engine = watchEngine(page);
    await forceScene(page);
    await page.emulateMedia({ contrast: 'more' });
    await page.goto(HOME);
    await page.waitForTimeout(2500);
    await expect(mount(page)).toHaveAttribute('data-scene-plan', 'never:low:more-contrast');
    expect(engine).toEqual([]);
  });

  test('no usable WebGL2: probed before anything is fetched, and the orb keeps the stage', async ({ page }) => {
    const engine = watchEngine(page);
    const errors = watchErrors(page);
    await noWebgl(page);
    await page.goto(HOME);
    await page.waitForTimeout(3500);
    await expect(mount(page)).toHaveAttribute('data-scene-state', 'static');
    await expect(mount(page)).toHaveAttribute('data-scene-plan', /^idle:/);
    await expect(page.locator(STAGE)).toHaveCount(0);
    expect(engine).toEqual([]);
    expect(errors).toEqual([]);
  });

  test('software rendering: refused before anything is fetched', async ({ page, browserName }) => {
    test.skip(browserName !== 'chromium', 'headless Chromium is the engine that reliably renders in software here');
    const engine = watchEngine(page);
    await page.goto(HOME);
    const software = await page.evaluate(() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      const info = gl?.getExtension('WEBGL_debug_renderer_info');
      return /swiftshader|llvmpipe/i.test(String(info ? gl!.getParameter(info.UNMASKED_RENDERER_WEBGL) : ''));
    });
    test.skip(!software, 'this machine gave headless Chromium a real GPU');
    await page.waitForTimeout(6000);
    await expect(mount(page)).toHaveAttribute('data-scene-state', 'static');
    await expect(page.locator(STAGE)).toHaveCount(0);
    expect(engine).toEqual([]);
  });

  test('JavaScript disabled: the hero is complete and shows the still image', async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 1280, height: 720 } });
    const page = await context.newPage();
    await page.goto(HOME);
    await expect(page.locator('main h1')).toBeVisible();
    // Without scripts the 2D orb's canvas is blank; the captured still stands in for it.
    const still = mount(page).locator('img.scene3d-still');
    await expect(still).toBeVisible();
    const box = await still.boundingBox();
    expect(box!.width).toBeGreaterThan(200);
    expect(Math.abs(box!.width - box!.height)).toBeLessThan(2);
    const response = await page.request.get(new URL((await still.getAttribute('src'))!, page.url()).href);
    expect(response.ok()).toBe(true);
    expect(response.headers()['content-type']).toContain('image/avif');
    await context.close();
  });
});

test.describe('the still on an inner page', () => {
  const POSTER = 'canvas.scene3d-poster';

  test('is painted for a visitor who keeps it, in the theme in force, and repainted on a theme switch', async ({ page }) => {
    const engine = watchEngine(page);
    await page.emulateMedia({ reducedMotion: 'reduce', colorScheme: 'dark' });
    await page.goto('/au-en/services');
    const poster = page.locator(POSTER);
    await expect(poster).toHaveAttribute('data-painted', 'dark', { timeout: 15_000 });
    // Something was really drawn: the canvas is not blank.
    const inked = await poster.evaluate((c: HTMLCanvasElement) => {
      const data = c.getContext('2d')!.getImageData(0, 0, c.width, c.height).data;
      let n = 0;
      for (let i = 3; i < data.length; i += 4) if (data[i] > 24) n++;
      return n / (data.length / 4);
    });
    expect(inked, 'share of the canvas with something on it').toBeGreaterThan(0.01);
    await page.locator('#theme-toggle').click();
    await expect(poster).toHaveAttribute('data-painted', 'light', { timeout: 10_000 });
    expect(engine, 'a still never costs the engine').toEqual([]);
  });

  test('is not fetched by a desktop that is about to get the live scene', async ({ page }) => {
    test.skip(!(await hasWebgl2(page)), 'this browser build cannot create a WebGL2 context, even in software');
    const stills: string[] = [];
    page.on('request', (r) => {
      if (/\/_astro\/[^/]+\.avif/.test(r.url())) stills.push(r.url());
    });
    await forceScene(page);
    await goLive(page, '/au-en/services');
    expect(stills).toEqual([]);
  });

  test('is what a no-JavaScript visitor sees', async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 1280, height: 720 } });
    const page = await context.newPage();
    await page.goto('/au-en/pricing');
    await expect(page.locator('main h1')).toBeVisible();
    await expect(page.locator('img.scene3d-still')).toBeVisible();
    await context.close();
  });

  test('never moves the page: the hero is the same height with and without it', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/au-en/about');
    const height = () => page.locator('main section').first().evaluate((el) => el.getBoundingClientRect().height);
    const before = await height();
    await expect(page.locator(POSTER)).toHaveAttribute('data-painted', /dark|light/, { timeout: 15_000 });
    expect(await height()).toBe(before);
  });
});

test.describe('phones and tablets wait for a first touch', () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true });

  test('nothing is fetched before a touch; the scene starts after one', async ({ page, browserName }) => {
    test.skip(browserName === 'firefox', 'Playwright cannot emulate touch input in Firefox');
    const engine = watchEngine(page);
    await forceScene(page);
    await page.goto(HOME);
    await page.waitForTimeout(3000);
    await expect(mount(page)).toHaveAttribute('data-scene-plan', 'interaction:low:touch-device');
    await expect(mount(page)).toHaveAttribute('data-scene-state', 'static');
    expect(engine, 'no engine request before the first touch').toEqual([]);

    test.skip(!(await hasWebgl2(page)), 'this browser build cannot create a WebGL2 context, even in software');
    await page.touchscreen.tap(195, 420);
    await expect(mount(page)).toHaveAttribute('data-scene-state', 'live', { timeout: LIVE_TIMEOUT });
    expect(engine.length).toBeGreaterThan(0);
  });

});

for (const width of [320, 390]) {
  test.describe(`at ${width}px`, () => {
    test.use({ viewport: { width, height: 800 } });

    test('the mount stays inside the viewport', async ({ page }) => {
      await page.goto(HOME);
      const box = await mount(page).evaluate((el) => {
        const r = el.getBoundingClientRect();
        return { left: r.left, right: r.right, vw: document.documentElement.clientWidth };
      });
      expect(box.left).toBeGreaterThanOrEqual(0);
      expect(box.right).toBeLessThanOrEqual(box.vw);
    });
  });
}

test.describe('a live scene', () => {
  test.beforeEach(async ({ page }) => {
    test.skip(!(await hasWebgl2(page)), 'this browser build cannot create a WebGL2 context, even in software');
  });

  for (const path of [HOME, '/fr-fr']) {
    test(`${path}: goes live with no errors`, async ({ page }) => {
      const errors = watchErrors(page);
      await forceScene(page);
      await goLive(page, path);
      await expect(page.locator(STAGE)).toHaveCount(1);
      const before = (await stats(page))!.frames;
      await page.waitForTimeout(1000);
      expect((await stats(page))!.frames).toBeGreaterThan(before);
      expect(errors).toEqual([]);
    });
  }

  test('takes the stage from the 2D orb, on one canvas, with no errors', async ({ page }) => {
    const errors = watchErrors(page);
    await forceScene(page);
    await goLive(page);
    await expect(page.locator(STAGE)).toHaveCount(1);
    await expect(mount(page).locator(STAGE)).toHaveCount(1);
    await expect(orb(page)).toHaveAttribute('data-orb-state', 'static');
    await expect(mount(page)).toHaveAttribute('aria-hidden', 'true');
    expect(await mount(page).locator('a, button, input, [tabindex]').count()).toBe(0);
    const before = (await stats(page))!.frames;
    await page.waitForTimeout(1200);
    expect((await stats(page))!.frames, 'the loop is drawing').toBeGreaterThan(before);
    expect(errors).toEqual([]);
  });

  test('is frozen at once by the pause button, and stays frozen', async ({ page }) => {
    await forceScene(page);
    await goLive(page);
    await page.locator('[data-motion-toggle]:visible').first().click();
    await expect(mount(page)).toHaveAttribute('data-scene-state', 'paused');
    await page.waitForTimeout(300);
    const frozen = (await stats(page))!.frames;
    // Leaving and re-entering the viewport must not restart it.
    await page.mouse.wheel(0, 2400);
    await page.waitForTimeout(400);
    await page.mouse.wheel(0, -2400);
    await page.waitForTimeout(900);
    expect((await stats(page))!.frames).toBe(frozen);
    await expect(orb(page)).toHaveAttribute('data-orb-state', 'static');
  });

  test('keeps running through a theme switch', async ({ page }) => {
    const errors = watchErrors(page);
    await forceScene(page);
    await goLive(page);
    const html = page.locator('html');
    const from = await html.getAttribute('data-theme');
    await page.locator('#theme-toggle').click();
    await expect(html).toHaveAttribute('data-theme', from === 'light' ? 'dark' : 'light');
    await page.waitForTimeout(600);
    await expect(mount(page)).toHaveAttribute('data-scene-state', 'live');
    const before = (await stats(page))!.frames;
    await page.waitForTimeout(800);
    expect((await stats(page))!.frames).toBeGreaterThan(before);
    expect(errors).toEqual([]);
  });

  test('stops drawing in a hidden tab and resumes when shown', async ({ page }) => {
    await forceScene(page);
    await goLive(page);
    const setHidden = (hidden: boolean) =>
      page.evaluate((h) => {
        Object.defineProperty(document, 'hidden', { configurable: true, get: () => h });
        document.dispatchEvent(new Event('visibilitychange'));
      }, hidden);
    await setHidden(true);
    await page.waitForTimeout(200);
    const parked = (await stats(page))!.frames;
    await page.waitForTimeout(700);
    expect((await stats(page))!.frames).toBe(parked);
    await setHidden(false);
    await page.waitForTimeout(700);
    expect((await stats(page))!.frames).toBeGreaterThan(parked);
  });

  test('survives a resize', async ({ page }) => {
    const errors = watchErrors(page);
    await forceScene(page);
    await goLive(page);
    const measure = () =>
      page.locator(STAGE).evaluate((c: HTMLCanvasElement) => {
        const r = c.getBoundingClientRect();
        return { buffer: c.width, css: r.width, square: Math.abs(r.width - r.height) < 2 && c.width === c.height };
      });
    const before = await measure();
    await page.setViewportSize({ width: 1024, height: 700 });
    await expect.poll(async () => (await measure()).css).not.toBe(before.css);
    // The drawing buffer follows the box (debounced), at the same pixel ratio as before.
    await expect.poll(async () => { const m = await measure(); return Math.abs(m.buffer / m.css - before.buffer / before.css); }).toBeLessThan(0.02);
    const after = await measure();
    expect(after.square).toBe(true);
    expect(after.buffer).not.toBe(before.buffer);
    await expect(mount(page)).toHaveAttribute('data-scene-state', 'live');
    expect(errors).toEqual([]);
  });
});

test.describe('failures land on the still', () => {
  test.beforeEach(async ({ page }) => {
    test.skip(!(await hasWebgl2(page)), 'this browser build cannot create a WebGL2 context, even in software');
  });

  test('the engine chunk does not arrive', async ({ page }) => {
    await forceScene(page);
    await page.route(ENGINE_CHUNK, (route) => route.abort());
    const warnings: string[] = [];
    page.on('console', (m) => {
      if (m.type() === 'warning' && m.text().includes('[scene3d]')) warnings.push(m.text());
    });
    const pageErrors: string[] = [];
    page.on('pageerror', (e) => pageErrors.push(String(e)));
    await page.goto(HOME);
    // The refusal is immediate, so `loading` is too brief to observe: wait for the one warning.
    await expect.poll(() => warnings.length, { timeout: 15_000 }).toBe(1);
    await expect(mount(page)).toHaveAttribute('data-scene-state', 'static');
    await expect(page.locator(STAGE)).toHaveCount(0);
    await expect(orb(page)).toHaveAttribute('data-orb-state', 'live');
    await page.waitForTimeout(1500);
    expect(warnings, 'no retry loop').toHaveLength(1);
    expect(pageErrors, 'a failed download is handled, not thrown').toEqual([]);
  });

  test('the GPU context is lost: the orb takes the stage back', async ({ page }) => {
    const pageErrors: string[] = [];
    page.on('pageerror', (e) => pageErrors.push(String(e)));
    await forceScene(page);
    await goLive(page);
    await page.locator(STAGE).evaluate((c: HTMLCanvasElement) => {
      c.getContext('webgl2')?.getExtension('WEBGL_lose_context')?.loseContext();
    });
    await expect(mount(page)).toHaveAttribute('data-scene-state', 'static', { timeout: 5000 });
    await expect(page.locator(STAGE)).toHaveCount(0);
    await expect(orb(page)).toHaveAttribute('data-orb-state', 'live', { timeout: 5000 });
    expect(pageErrors).toEqual([]);
  });
});

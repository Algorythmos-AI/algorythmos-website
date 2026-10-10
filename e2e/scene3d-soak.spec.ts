/**
 * Live 3D scenes — endurance and timing races (Chromium only: each case holds a
 * software-rendered scene open for a long time). The everyday contract is in
 * scene3d.spec.ts.
 */
import { test, expect, type Page } from '@playwright/test';
import { ENGINE_CHUNK, HOME_SCENE_CHUNK, MOUNT, STAGE, forceScene, stats, watchErrors } from './helpers/scene3d';

const HOME = '/au-en';
const LIVE_TIMEOUT = 90_000;
test.describe.configure({ mode: 'default', timeout: 240_000 });

const mount = (page: Page) => page.locator(MOUNT).first();

/**
 * Leave, through the client router, for a page that carries no scene (the legal
 * pages never do). Since every other page has one, this is the only kind of page
 * where "no canvas" means the engine stayed out, rather than not having arrived yet.
 */
async function leaveForScenelessPage(page: Page) {
  await page.locator('footer a[href$="/privacy"]').first().click();
  await page.waitForURL(/\/privacy$/);
  await expect(page.locator(MOUNT)).toHaveCount(0);
}
const goLive = async (page: Page, path = HOME) => {
  await page.goto(path);
  await expect(mount(page)).toHaveAttribute('data-scene-state', 'live', { timeout: LIVE_TIMEOUT });
};

/* A page that mounts each scene (and each variant that changes the picture), per locale. */
const SCENE_PAGES: [scene: string, path: string][] = [
  ['neural-core', ''],
  ['constellation', '/services'],
  ['constellation', '/services/llmops'],
  ['scan', '/services/document-intelligence'],
  ['globe', '/about'],
  ['globe', '/contact'],
  ['ledger', '/pricing'],
  ['ledger', '/case-studies/financial-compliance'],
  ['pages', '/pdf-algo-pro'],
];

test.describe('every scene runs live', () => {
  for (const locale of ['/au-en', '/fr-fr']) {
    for (const [scene, path] of SCENE_PAGES) {
      test(`${scene} on ${locale}${path}`, async ({ page }) => {
        const errors = watchErrors(page);
        await forceScene(page);
        await goLive(page, locale + path);
        await expect(mount(page)).toHaveAttribute('data-scene', scene);
        await expect(page.locator(STAGE)).toHaveCount(1);
        const before = (await stats(page))!.frames;
        await page.waitForTimeout(1500);
        expect((await stats(page))!.frames, 'the loop is drawing').toBeGreaterThan(before);
        // Scenes with a looping story (scan, pages, ledger) must survive a full cycle's worth of time.
        await page.waitForTimeout(2500);
        await expect(mount(page)).toHaveAttribute('data-scene-state', 'live');
        expect(errors).toEqual([]);
      });
    }
  }

  test('lost-satellite on the 404 page', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(String(e)));
    await forceScene(page);
    await page.goto('/au-en/this-page-does-not-exist');
    await expect(mount(page)).toHaveAttribute('data-scene', 'lost-satellite');
    await expect(mount(page)).toHaveAttribute('data-scene-state', 'live', { timeout: LIVE_TIMEOUT });
    expect(errors).toEqual([]);
  });

  test('moving between pages with different scenes swaps the scene on the one canvas', async ({ page }) => {
    const errors = watchErrors(page);
    await forceScene(page);
    await goLive(page, '/au-en/services');
    await page.getByRole('link', { name: 'Pricing', exact: false }).first().click();
    await page.waitForURL(/\/pricing$/);
    await expect(mount(page)).toHaveAttribute('data-scene', 'ledger');
    await expect(mount(page)).toHaveAttribute('data-scene-state', 'live', { timeout: LIVE_TIMEOUT });
    await page.getByRole('link', { name: 'About', exact: false }).first().click();
    await page.waitForURL(/\/about$/);
    await expect(mount(page)).toHaveAttribute('data-scene', 'globe');
    await expect(mount(page)).toHaveAttribute('data-scene-state', 'live', { timeout: LIVE_TIMEOUT });
    await expect(page.locator(STAGE)).toHaveCount(1);
    expect(errors).toEqual([]);
  });
});

test.describe('endurance', () => {
  test('holds steady over a long run', async ({ page }) => {
    test.slow();
    const errors = watchErrors(page);
    await forceScene(page);
    await goLive(page);
    const start = (await stats(page))!;
    await page.waitForTimeout(30_000);
    const end = (await stats(page))!;
    await expect(mount(page)).toHaveAttribute('data-scene-state', 'live');
    expect(end.frames).toBeGreaterThan(start.frames);
    expect({ g: end.geometries, t: end.textures, p: end.programs }).toEqual({
      g: start.geometries,
      t: start.textures,
      p: start.programs,
    });
    expect(errors).toEqual([]);
  });

  test.describe('on a high-density screen', () => {
    // 1.5× gives the governor two steps to take (1.5 → 1.13 → 1) at about half the
    // software-rendering cost of 2×.
    test.use({ deviceScaleFactor: 1.5 });

    test('the governor sheds pixels step by step before it gives up', async ({ page }) => {
      const errors = watchErrors(page);
      await forceScene(page, 'governed');
      await page.addInitScript(() => {
        const raf = window.requestAnimationFrame.bind(window);
        window.requestAnimationFrame = (cb) => raf((t) => setTimeout(() => cb(t + 70), 70) as unknown as void);
        const seen = ((window as unknown as { __buffers: number[] }).__buffers = [] as number[]);
        setInterval(() => {
          const c = document.querySelector<HTMLCanvasElement>('canvas.scene3d-stage');
          if (c && seen[seen.length - 1] !== c.width) seen.push(c.width);
        }, 100);
      });
      await page.goto(HOME);
      await expect(mount(page)).toHaveAttribute('data-scene-state', 'live', { timeout: LIVE_TIMEOUT });
      await expect(mount(page)).toHaveAttribute('data-scene-state', 'static', { timeout: 150_000 });
      const buffers = await page.evaluate(() => (window as unknown as { __buffers: number[] }).__buffers);
      // 1.5 → 1.13 → 1, then the still: the drawing buffer only ever got smaller.
      expect(buffers.length).toBeGreaterThanOrEqual(3);
      expect([...buffers].sort((a, b) => b - a)).toEqual(buffers);
      expect(errors).toEqual([]);
    });
  });

  test('the GPU cannot keep up: the governor hands back to the still and remembers', async ({ page }) => {
    test.slow();
    await forceScene(page, 'governed');
    // Every frame arrives 70 ms late: under the 25 fps floor on any machine.
    await page.addInitScript(() => {
      const raf = window.requestAnimationFrame.bind(window);
      window.requestAnimationFrame = (cb) => raf((t) => setTimeout(() => cb(t + 70), 70) as unknown as void);
    });
    await page.goto(HOME);
    await expect(mount(page)).toHaveAttribute('data-scene-state', 'live', { timeout: LIVE_TIMEOUT });
    await expect(mount(page)).toHaveAttribute('data-scene-state', 'static', { timeout: 90_000 });
    await expect(page.locator(STAGE)).toHaveCount(0);
    expect(await page.evaluate(() => sessionStorage.getItem('scene3d-gave-up'))).toBe('1');
    // The rest of the visit does not try again.
    await page.reload();
    await expect(mount(page)).toHaveAttribute('data-scene-plan', 'never:low:gave-up');
  });
});

test.describe('timing races', () => {
  /** Hold the engine chunk back so a test can act while the scene is still loading. */
  const slowEngine = (page: Page, ms: number) =>
    page.route(ENGINE_CHUNK, async (route) => {
      await new Promise((r) => setTimeout(r, ms));
      await route.continue();
    });

  test('pause pressed while the engine is downloading: the scene never starts', async ({ page }) => {
    await forceScene(page);
    await slowEngine(page, 2500);
    await page.goto(HOME);
    await expect(mount(page)).toHaveAttribute('data-scene-state', 'loading', { timeout: 10_000 });
    await page.locator('[data-motion-toggle]:visible').first().click();
    await page.waitForTimeout(5000);
    await expect(mount(page)).toHaveAttribute('data-scene-state', 'static');
    await expect(page.locator(STAGE)).toHaveCount(0);
  });

  test('navigating away mid-download: the late engine does not attach to the next page', async ({ page }) => {
    const errors = watchErrors(page);
    await forceScene(page);
    await slowEngine(page, 2500);
    await page.goto(HOME);
    await expect(mount(page)).toHaveAttribute('data-scene-state', 'loading', { timeout: 10_000 });
    await leaveForScenelessPage(page);
    await page.waitForTimeout(4500);
    await expect(page.locator(STAGE)).toHaveCount(0);
    // …and the engine it left behind still serves the next page that wants it.
    await page.goBack();
    await page.waitForURL(/\/au-en$/);
    await expect(mount(page)).toHaveAttribute('data-scene-state', 'live', { timeout: LIVE_TIMEOUT });
    await expect(page.locator(STAGE)).toHaveCount(1);
    expect(errors).toEqual([]);
  });

  test('ten navigations: one canvas, and nothing accumulates on the GPU', async ({ page }) => {
    test.slow();
    const errors = watchErrors(page);
    await forceScene(page);
    await goLive(page);
    const first = (await stats(page))!;
    for (let i = 0; i < 5; i++) {
      await leaveForScenelessPage(page);
      await expect(page.locator(STAGE)).toHaveCount(0);
      expect((await stats(page))!.geometries, 'the scene was freed on leaving').toBe(0);
      await page.goBack();
      await page.waitForURL(/\/au-en$/);
      await expect(mount(page)).toHaveAttribute('data-scene-state', 'live', { timeout: LIVE_TIMEOUT });
      await expect(page.locator(STAGE)).toHaveCount(1);
    }
    const last = (await stats(page))!;
    expect({ g: last.geometries, t: last.textures, p: last.programs }).toEqual({
      g: first.geometries,
      t: first.textures,
      p: first.programs,
    });
    expect(errors).toEqual([]);
  });

  /** Resolve once the engine chunk has fully arrived (the scene's own chunk is still held back). */
  const engineArrived = (page: Page) => page.waitForResponse((r) => ENGINE_CHUNK.test(r.url()) && r.ok()).then((r) => r.finished());
  const slowScene = (page: Page, ms: number) =>
    page.route(HOME_SCENE_CHUNK, async (route) => {
      await new Promise((r) => setTimeout(r, ms));
      await route.continue();
    });

  test('pause pressed while the scene is being built: it never takes the stage', async ({ page }) => {
    const errors = watchErrors(page);
    await forceScene(page);
    await slowScene(page, 3000);
    const arrived = engineArrived(page);
    await page.goto(HOME);
    await arrived;
    await expect(mount(page)).toHaveAttribute('data-scene-state', 'loading');
    await page.locator('[data-motion-toggle]:visible').first().click();
    await page.waitForTimeout(6000);
    await expect(mount(page)).toHaveAttribute('data-scene-state', 'static');
    await expect(page.locator(STAGE)).toHaveCount(0);
    await expect(page.locator('[data-neural-orb]')).toHaveAttribute('data-orb-state', 'static');
    expect(errors).toEqual([]);
  });

  test('navigating away while the scene is being built: nothing attaches, nothing leaks', async ({ page }) => {
    const errors = watchErrors(page);
    await forceScene(page);
    await slowScene(page, 3000);
    const arrived = engineArrived(page);
    await page.goto(HOME);
    await arrived;
    await expect(mount(page)).toHaveAttribute('data-scene-state', 'loading');
    await leaveForScenelessPage(page);
    await page.waitForTimeout(5000);
    await expect(page.locator(STAGE)).toHaveCount(0);
    expect((await stats(page))!.geometries, 'the abandoned scene was freed').toBe(0);
    await page.goBack();
    await page.waitForURL(/\/au-en$/);
    await expect(mount(page)).toHaveAttribute('data-scene-state', 'live', { timeout: LIVE_TIMEOUT });
    await expect(page.locator(STAGE)).toHaveCount(1);
    expect(errors).toEqual([]);
  });

  test('the GPU context is lost while the canvas is parked between pages: the next page starts clean', async ({ page }) => {
    const pageErrors: string[] = [];
    page.on('pageerror', (e) => {
      if (!/Transition was skipped/.test(String(e))) pageErrors.push(String(e));
    });
    await forceScene(page);
    await goLive(page);
    await page.evaluate(() => {
      (window as unknown as { __parked: Element | null }).__parked = document.querySelector('canvas.scene3d-stage');
    });
    await leaveForScenelessPage(page);
    await expect(page.locator(STAGE)).toHaveCount(0);
    // No scene is on stage to notice this.
    await page.evaluate(() => {
      const canvas = (window as unknown as { __parked: HTMLCanvasElement }).__parked;
      canvas.getContext('webgl2')?.getExtension('WEBGL_lose_context')?.loseContext();
    });
    await page.waitForTimeout(500);
    await page.goBack();
    await page.waitForURL(/\/au-en$/);
    await expect(mount(page)).toHaveAttribute('data-scene-state', 'live', { timeout: LIVE_TIMEOUT });
    const fresh = await page.evaluate(
      () => document.querySelector('canvas.scene3d-stage') !== (window as unknown as { __parked: Element }).__parked,
    );
    expect(fresh, 'a new canvas and context, not the dead one').toBe(true);
    // Going back restores the scroll position at the footer link, where the loop rightly rests.
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    const before = (await stats(page))!.frames;
    await expect.poll(async () => (await stats(page))!.frames, { timeout: 10_000 }).toBeGreaterThan(before);
    expect(pageErrors).toEqual([]);
  });
});

/**
 * Live 3D scenes on phones and tablets — e2e, on real device profiles (touch,
 * pixel density, mobile user agent): iPhone, Pixel and iPad.
 *
 * The rules under test (docs/SCENES.md):
 * - a phone or tablet gets its scene with no touch, and the homepage orb moves
 *   from the start;
 * - every way the start can fail ends on a moving 2D orb (home) or the painted
 *   still (everywhere else) — never a frozen half-state, never stuck on `loading`;
 * - every recovery is tried once.
 *
 * As in scene3d.spec.ts, CI renders WebGL in software, which the site refuses,
 * so tests that need a live scene opt in with forceScene().
 */
import { test, expect, type Page } from '@playwright/test';
import { ENGINE_CHUNK, HOME_SCENE_CHUNK, MOUNT, STAGE, forceScene, hasWebgl2, noWebgl, orbFrames, stats, watchEngine, watchErrors } from './helpers/scene3d';

const HOME = '/au-en';
const SERVICE = '/au-en/services/agentic-automation';
const LIVE_TIMEOUT = 90_000;
test.describe.configure({ mode: 'default', timeout: 180_000 });

const mount = (page: Page) => page.locator(MOUNT).first();
const orb = (page: Page) => page.locator('[data-neural-orb]');
/** The loop only draws while the mount is on screen; on a phone the hero scene starts below the fold. */
const bringIntoView = (page: Page) => mount(page).evaluate((el) => el.scrollIntoView({ block: 'center' }));
const goLive = async (page: Page, path = HOME) => {
  await page.goto(path);
  await expect(mount(page)).toHaveAttribute('data-scene-state', 'live', { timeout: LIVE_TIMEOUT });
  await bringIntoView(page);
};
const sceneAdvances = async (page: Page) => {
  const before = (await stats(page))!.frames;
  await page.waitForTimeout(1200);
  expect((await stats(page))!.frames, 'the scene is drawing').toBeGreaterThan(before);
};
const orbAdvances = async (page: Page) => {
  await bringIntoView(page);
  await expect(orb(page)).toHaveAttribute('data-orb-state', 'live', { timeout: 8000 });
  const before = await orbFrames(page);
  await page.waitForTimeout(1200);
  expect(await orbFrames(page), 'the 2D orb is drawing').toBeGreaterThan(before);
};
const stubConnection = (page: Page, connection: { effectiveType?: string; saveData?: boolean }) =>
  page.addInitScript((c) => {
    Object.defineProperty(navigator, 'connection', { configurable: true, get: () => c });
  }, connection);

test.describe('with no touch at all', () => {
  test.beforeEach(async ({ page }) => {
    test.skip(!(await hasWebgl2(page)), 'this browser build cannot create a WebGL2 context, even in software');
  });

  test('home: the scene goes live at the phone tier and keeps drawing', async ({ page }) => {
    const errors = watchErrors(page);
    await forceScene(page);
    await page.goto(HOME);
    await expect(mount(page)).toHaveAttribute('data-scene-plan', 'idle:low:touch-device');
    await expect(mount(page)).toHaveAttribute('data-scene-state', 'live', { timeout: LIVE_TIMEOUT });
    await expect(mount(page)).toHaveAttribute('data-scene-step', 'live');
    await bringIntoView(page);
    await sceneAdvances(page);
    // One thing draws at a time: the orb has handed over.
    await expect(orb(page)).toHaveAttribute('data-orb-state', 'static');
    const orbBefore = await orbFrames(page);
    await page.waitForTimeout(600);
    expect(await orbFrames(page)).toBe(orbBefore);
    expect(errors).toEqual([]);
  });

  test('a service page: the still is painted first, then the scene takes over', async ({ page }) => {
    const errors = watchErrors(page);
    await forceScene(page);
    await page.goto(SERVICE);
    await expect(mount(page)).toHaveAttribute('data-scene-plan', 'idle:low:touch-device');
    await expect(mount(page)).toHaveAttribute('data-scene-state', 'live', { timeout: LIVE_TIMEOUT });
    await bringIntoView(page);
    await sceneAdvances(page);
    expect(errors).toEqual([]);
  });

  test('pausing freezes it; scrolling away and back does not restart it', async ({ page }) => {
    await forceScene(page);
    await goLive(page);
    await page.evaluate(() => {
      document.documentElement.dataset.motion = 'off';
    });
    await expect(mount(page)).toHaveAttribute('data-scene-state', 'paused');
    await page.waitForTimeout(300);
    const frozen = (await stats(page))!.frames;
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(400);
    await bringIntoView(page);
    await page.waitForTimeout(900);
    expect((await stats(page))!.frames).toBe(frozen);
  });

  test('a hidden tab parks it; showing the tab resumes it', async ({ page }) => {
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
    await page.waitForTimeout(900);
    expect((await stats(page))!.frames).toBeGreaterThan(parked);
  });

  test('turning the device keeps it live', async ({ page }) => {
    const errors = watchErrors(page);
    await forceScene(page);
    await goLive(page);
    const { width, height } = page.viewportSize()!;
    await page.setViewportSize({ width: height, height: width });
    await page.waitForTimeout(600);
    await bringIntoView(page);
    await expect(mount(page)).toHaveAttribute('data-scene-state', 'live');
    await sceneAdvances(page);
    await page.setViewportSize({ width, height });
    await page.waitForTimeout(600);
    await bringIntoView(page);
    await expect(mount(page)).toHaveAttribute('data-scene-state', 'live');
    await sceneAdvances(page);
    expect(errors).toEqual([]);
  });
});

test.describe('who waits, and who keeps the still', () => {
  test('a connection known to be slow: nothing is fetched until a touch; the orb moves meanwhile', async ({ page }) => {
    const engine = watchEngine(page);
    await stubConnection(page, { effectiveType: '3g', saveData: false });
    await forceScene(page);
    await page.goto(HOME);
    await expect(mount(page)).toHaveAttribute('data-scene-plan', 'interaction:low:slow-connection');
    await orbAdvances(page);
    await page.waitForTimeout(2500);
    expect(engine, 'no engine request before the first touch').toEqual([]);
    await expect(mount(page)).toHaveAttribute('data-scene-state', 'static');

    test.skip(!(await hasWebgl2(page)), 'this browser build cannot create a WebGL2 context, even in software');
    await page.locator('h1').first().tap();
    await expect(mount(page)).toHaveAttribute('data-scene-state', 'live', { timeout: LIVE_TIMEOUT });
    expect(engine.length).toBeGreaterThan(0);
  });

  test('Save-Data: no engine, and the orb is one still frame', async ({ page }) => {
    const engine = watchEngine(page);
    await stubConnection(page, { effectiveType: '4g', saveData: true });
    await forceScene(page);
    await page.goto(HOME);
    await expect(mount(page)).toHaveAttribute('data-scene-plan', 'never:low:save-data');
    await expect(orb(page)).toHaveAttribute('data-orb-static', 'save-data', { timeout: 8000 });
    await expect(orb(page)).toHaveAttribute('data-orb-formed', '1');
    await page.waitForTimeout(2500);
    expect(engine).toEqual([]);
    expect(await orbFrames(page)).toBe(0);
  });

  test.describe('reduced motion', () => {
    test.use({ reducedMotion: 'reduce' });
    test('no engine, no loop', async ({ page }) => {
      const engine = watchEngine(page);
      await forceScene(page);
      await page.goto(HOME);
      await expect(mount(page)).toHaveAttribute('data-scene-plan', 'never:low:motion-off');
      await expect(orb(page)).toHaveAttribute('data-orb-static', 'motion-off', { timeout: 8000 });
      await page.waitForTimeout(2500);
      expect(engine).toEqual([]);
      expect(await orbFrames(page)).toBe(0);
    });
  });
});

test.describe('every failure ends on something finished', () => {
  test('no WebGL2: the orb keeps moving and three is never requested', async ({ page }) => {
    const engine = watchEngine(page);
    const errors = watchErrors(page);
    await noWebgl(page);
    await page.goto(HOME);
    await expect(mount(page)).toHaveAttribute('data-scene-fail', 'no-webgl', { timeout: 15_000 });
    await expect(mount(page)).toHaveAttribute('data-scene-state', 'static');
    await orbAdvances(page);
    expect(engine).toEqual([]);
    expect(errors).toEqual([]);
  });

  test('no WebGL2 on a service page: the still is painted', async ({ page }) => {
    await noWebgl(page);
    await page.goto(SERVICE);
    await expect(mount(page).locator('canvas.scene3d-poster')).toHaveAttribute('data-painted', /dark|light/, { timeout: 15_000 });
    await expect(mount(page)).toHaveAttribute('data-scene-state', 'static');
  });

  test('a device too slow for the 2D orb gets its still frame', async ({ page }) => {
    await noWebgl(page);
    // Eight frames a second, as a struggling phone would manage.
    await page.addInitScript(() => {
      window.requestAnimationFrame = (cb) => window.setTimeout(() => cb(performance.now()), 125);
      window.cancelAnimationFrame = (id) => window.clearTimeout(id);
    });
    await page.goto(HOME);
    await bringIntoView(page);
    await expect(orb(page)).toHaveAttribute('data-orb-static', 'slow', { timeout: 15_000 });
    await expect(orb(page)).toHaveAttribute('data-orb-state', 'static');
    await expect(orb(page)).toHaveAttribute('data-orb-formed', '1');
    const frozen = await orbFrames(page);
    await page.waitForTimeout(1000);
    expect(await orbFrames(page), 'and it stays stopped').toBe(frozen);
  });

  test.describe('with a GPU', () => {
    test.beforeEach(async ({ page }) => {
      test.skip(!(await hasWebgl2(page)), 'this browser build cannot create a WebGL2 context, even in software');
    });

    test('the engine chunk is dropped at first: it is tried again, and the scene arrives', async ({ page, browserName }) => {
      test.skip(
        browserName === 'webkit',
        'WebKit remembers a failed module for the life of the document, so a second import cannot succeed there; it ends on the still (next test)',
      );
      /* Refuse every request for the first second after the first one: only a second
         try, made later, can succeed. (The bundler may ask more than once per try.) */
      let first = 0;
      let refused = 0;
      await page.route(ENGINE_CHUNK, (route) => {
        first ||= Date.now();
        if (Date.now() - first < 1000) {
          refused++;
          return route.abort();
        }
        return route.continue();
      });
      const warnings: string[] = [];
      page.on('console', (m) => {
        if (m.type() === 'warning' && m.text().includes('[scene3d]')) warnings.push(m.text());
      });
      await forceScene(page);
      await page.goto(HOME);
      await expect(mount(page)).toHaveAttribute('data-scene-state', 'live', { timeout: LIVE_TIMEOUT });
      expect(refused).toBeGreaterThan(0);
      expect(warnings).toEqual([]);
      await bringIntoView(page);
      await sceneAdvances(page);
    });

    test('the engine chunk never arrives: one warning, no retry loop, a moving orb', async ({ page }) => {
      let requests = 0;
      await page.route(ENGINE_CHUNK, (route) => {
        requests++;
        return route.abort();
      });
      const warnings: string[] = [];
      page.on('console', (m) => {
        if (m.type() === 'warning' && m.text().includes('[scene3d]')) warnings.push(m.text());
      });
      const pageErrors: string[] = [];
      page.on('pageerror', (e) => pageErrors.push(String(e)));
      await forceScene(page);
      await page.goto(HOME);
      await expect(mount(page)).toHaveAttribute('data-scene-fail', 'engine-load', { timeout: 20_000 });
      await expect(mount(page)).toHaveAttribute('data-scene-state', 'static');
      const asked = requests;
      await orbAdvances(page);
      await page.waitForTimeout(5000);
      expect(requests, 'nothing more is requested once it has given up').toBe(asked);
      expect(warnings).toHaveLength(1);
      expect(pageErrors).toEqual([]);
    });

    test('a start that hangs is abandoned at the time limit, not left on "loading"', async ({ page }) => {
      const pageErrors: string[] = [];
      page.on('pageerror', (e) => pageErrors.push(String(e)));
      await forceScene(page);
      await page.addInitScript(() => {
        (window as unknown as { __scene3dStartLimit: number }).__scene3dStartLimit = 4000;
      });
      // The scene's own chunk never answers: show() waits on it for ever.
      await page.route(HOME_SCENE_CHUNK, () => new Promise<void>(() => {}));
      await page.goto(HOME);
      await expect(mount(page)).toHaveAttribute('data-scene-fail', 'timeout', { timeout: 30_000 });
      await expect(mount(page)).toHaveAttribute('data-scene-state', 'static');
      await expect(page.locator(STAGE)).toHaveCount(0);
      await orbAdvances(page);
      expect(pageErrors).toEqual([]);
    });

    test('a lost context: the orb moves, the scene comes back once, a second loss ends it', async ({ page }) => {
      const pageErrors: string[] = [];
      page.on('pageerror', (e) => pageErrors.push(String(e)));
      const lose = () =>
        page.locator(STAGE).evaluate((c: HTMLCanvasElement) => {
          c.getContext('webgl2')?.getExtension('WEBGL_lose_context')?.loseContext();
        });
      await forceScene(page);
      await goLive(page);
      await lose();
      await expect(mount(page)).toHaveAttribute('data-scene-state', 'static', { timeout: 5000 });
      await expect(orb(page)).toHaveAttribute('data-orb-state', 'live', { timeout: 5000 });
      await expect(mount(page)).toHaveAttribute('data-scene-state', 'live', { timeout: LIVE_TIMEOUT });
      await sceneAdvances(page);

      await lose();
      await expect(mount(page)).toHaveAttribute('data-scene-state', 'static', { timeout: 5000 });
      await expect(mount(page)).toHaveAttribute('data-scene-fail', 'context-lost');
      await page.waitForTimeout(6000);
      await expect(mount(page), 'no third attempt').toHaveAttribute('data-scene-state', 'static');
      await orbAdvances(page);
      expect(pageErrors).toEqual([]);
    });

    test('a context lost in a hidden tab is retried when the tab is shown, not before', async ({ page }) => {
      const setHidden = (hidden: boolean) =>
        page.evaluate((h) => {
          Object.defineProperty(document, 'hidden', { configurable: true, get: () => h });
          document.dispatchEvent(new Event('visibilitychange'));
        }, hidden);
      await forceScene(page);
      await goLive(page);
      await setHidden(true);
      await page.locator(STAGE).evaluate((c: HTMLCanvasElement) => {
        c.getContext('webgl2')?.getExtension('WEBGL_lose_context')?.loseContext();
      });
      await expect(mount(page)).toHaveAttribute('data-scene-state', 'static', { timeout: 5000 });
      await page.waitForTimeout(5000);
      await expect(mount(page), 'nothing is rebuilt while nobody is looking').toHaveAttribute('data-scene-state', 'static');
      await setHidden(false);
      await expect(mount(page)).toHaveAttribute('data-scene-state', 'live', { timeout: LIVE_TIMEOUT });
    });
  });
});

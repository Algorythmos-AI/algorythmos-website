/**
 * Motion on phones and tablets — e2e, on real device profiles.
 *
 * Every animation here used to be checked on desktop only, and the homepage
 * sphere sat frozen on every iPhone without a test noticing. Each test proves
 * that something actually advances — frames drawn, a step reached, a position
 * changed — not merely that an element exists.
 *
 * WebGL is switched off throughout so the answers do not depend on the machine's
 * GPU; the live 3D scene on these profiles is scene3d-mobile.spec.ts.
 */
import { test, expect, type Page } from '@playwright/test';
import { noWebgl, orbFrames, watchErrors } from './helpers/scene3d';

const HOME = '/au-en';
const center = (page: Page, selector: string) =>
  page
    .locator(selector)
    .first()
    .evaluate((el) => el.scrollIntoView({ block: 'center', behavior: 'instant' }));

test.beforeEach(async ({ page }) => {
  await noWebgl(page);
});

test('the homepage sphere draws from the start, with no touch', async ({ page }) => {
  const errors = watchErrors(page);
  await page.goto(HOME);
  await center(page, '[data-neural-orb]');
  const orb = page.locator('[data-neural-orb]');
  await expect(orb).toHaveAttribute('data-orb-state', 'live', { timeout: 8000 });
  await expect(orb).not.toHaveAttribute('data-orb-static', /.+/);
  /* Any advance will do: a CI runner drawing in software manages a handful of frames
     a second, and how fast is the device's business, not this test's. */
  const before = await orbFrames(page);
  await expect.poll(() => orbFrames(page), { timeout: 5000 }).toBeGreaterThan(before);
  await expect(orb).toHaveAttribute('data-orb-formed', '1', { timeout: 6000 });
  expect(errors).toEqual([]);
});

test('the sphere stops off screen and in a hidden tab, and comes back', async ({ page }) => {
  await page.goto(HOME);
  await center(page, '[data-neural-orb]');
  const orb = page.locator('[data-neural-orb]');
  await expect(orb).toHaveAttribute('data-orb-state', 'live', { timeout: 8000 });

  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await expect(orb).toHaveAttribute('data-orb-state', 'static');
  const parked = await orbFrames(page);
  await page.waitForTimeout(600);
  expect(await orbFrames(page)).toBe(parked);

  await center(page, '[data-neural-orb]');
  await expect(orb).toHaveAttribute('data-orb-state', 'live');
  await expect.poll(() => orbFrames(page)).toBeGreaterThan(parked);

  const setHidden = (hidden: boolean) =>
    page.evaluate((h) => {
      Object.defineProperty(document, 'hidden', { configurable: true, get: () => h });
      document.dispatchEvent(new Event('visibilitychange'));
    }, hidden);
  await setHidden(true);
  await expect(orb).toHaveAttribute('data-orb-state', 'static');
  await setHidden(false);
  await expect(orb).toHaveAttribute('data-orb-state', 'live');
});

test('the pause button is reachable and stops the sphere at once', async ({ page }) => {
  await page.goto(HOME);
  await center(page, '[data-neural-orb]');
  const orb = page.locator('[data-neural-orb]');
  await expect(orb).toHaveAttribute('data-orb-state', 'live', { timeout: 8000 });
  await page.evaluate(() => window.scrollTo(0, 0));

  const toggle = page.locator('[data-motion-toggle]:visible').first();
  if (!(await toggle.count())) await page.locator('[data-mobile-menu] > summary').tap(); // phones keep it in the menu
  await toggle.tap();
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'off');
  await expect(orb).toHaveAttribute('data-orb-state', 'static');
  const frozen = await orbFrames(page);
  await center(page, '[data-neural-orb]');
  await page.waitForTimeout(800);
  expect(await orbFrames(page)).toBe(frozen);
});

test('the hero console plays its story', async ({ page }) => {
  test.slow();
  await page.goto(HOME);
  const hero = page.locator('[data-console="hero-console"]');
  await hero.evaluate((el) => el.scrollIntoView({ block: 'center', behavior: 'instant' }));
  await expect(hero).toHaveClass(/hc-live/, { timeout: 8000 });
  await expect(hero.locator('[data-run="contract"] [data-slot="sub"]')).toHaveText('4/5 steps · approved', { timeout: 15_000 });
  await expect(hero.locator('[data-hc-stepper]')).toHaveClass(/hc-step-4/);
});

test('the technology belt is moving', async ({ page }) => {
  await page.goto(HOME);
  const belt = page.locator('.tech-belt');
  /* Sections above it take their real height as they are first rendered
     (content-visibility), which moves the belt: centre it until it stays put. */
  await expect(async () => {
    await center(page, '.tech-belt');
    await page.waitForTimeout(250);
    await expect(belt).toBeInViewport({ ratio: 1 });
  }).toPass({ timeout: 10_000 });
  const track = page.locator('.tech-track').first();
  await expect.poll(() => track.evaluate((el) => getComputedStyle(el).animationName)).not.toBe('none');
  expect(await track.evaluate((el) => getComputedStyle(el).animationPlayState)).toBe('running');
  const x = () => track.evaluate((el) => el.getBoundingClientRect().x);
  const before = await x();
  await page.waitForTimeout(700);
  await expect(belt).toBeInViewport({ ratio: 1 });
  expect(await x(), 'the belt has travelled').toBeLessThan(before - 5);
});

test('scroll reveals: content below the fold arrives as it is reached', async ({ page }) => {
  await page.goto('/au-en/services');
  await page.waitForTimeout(600);
  const last = page.locator('main [data-reveal]').last();
  const waiting = () => page.locator('main [data-reveal]:not(.is-visible)').count();
  expect(await waiting(), 'nothing waits for a scroll that may never come').toBe(0);

  await expect(async () => {
    await page.evaluate(() => window.scrollBy(0, 160));
    await expect.poll(waiting, { timeout: 1500 }).toBeGreaterThan(0);
  }).toPass({ timeout: 10_000 });

  await last.evaluate((el) => el.scrollIntoView({ block: 'center', behavior: 'instant' }));
  await expect(last).toHaveClass(/is-visible/, { timeout: 5000 });
  await expect.poll(() => last.evaluate((el) => getComputedStyle(el).opacity), { timeout: 3000 }).toBe('1');
});

test('case-study figures count up to exactly what is written', async ({ page }) => {
  const STUDY = '/au-en/case-studies/financial-compliance';
  /* On a tall tablet the figures are in view at load and start counting at once, so
     "what is written" is read from the HTML as served, and the counting is recorded
     from the first script on. */
  const html = await (await page.request.get(STUDY)).text();
  const written = [...html.matchAll(/<[^>]*\bdata-countup\b[^>]*>([^<]*)</g)].map((m) => m[1].trim());
  expect(written.length).toBeGreaterThan(0);
  await page.addInitScript(() => {
    const state = { changes: 0 };
    (window as unknown as { __countups: typeof state }).__countups = state;
    new MutationObserver((records) => {
      for (const r of records) {
        const el = r.target instanceof Element ? r.target : r.target.parentElement;
        if (el?.closest('[data-countup]')) state.changes++;
      }
    }).observe(document, { subtree: true, childList: true, characterData: true });
  });
  await page.goto(STUDY);
  const figures = page.locator('[data-countup]');
  await figures.first().evaluate((el) => el.scrollIntoView({ block: 'center', behavior: 'instant' }));
  await expect
    .poll(() => page.evaluate(() => (window as unknown as { __countups: { changes: number } }).__countups.changes), { timeout: 6000 })
    .toBeGreaterThan(5);
  await expect.poll(async () => (await figures.allTextContents()).map((t) => t.trim()), { timeout: 8000 }).toEqual(written);
  await page.waitForTimeout(500);
  expect((await figures.allTextContents()).map((t) => t.trim())).toEqual(written);
});

test('a step-through explainer starts and advances', async ({ page }) => {
  await page.goto('/au-en/case-studies/ai-robotics-space-bitcoin-convergence');
  const first = page.locator('figure.ex').first();
  await expect(first).not.toHaveAttribute('data-ex-run', '');
  await first.evaluate((el) => el.scrollIntoView({ block: 'center', behavior: 'instant' }));
  await expect(first).toHaveAttribute('data-ex-run', '', { timeout: 8000 });
  await expect.poll(() => first.getAttribute('data-ex-step'), { timeout: 10_000 }).toBe('2');
});

test.describe('touch does not get stuck', () => {
  test('tapping the technology belt does not leave it paused', async ({ page }) => {
    await page.goto(HOME);
    const belt = page.locator('.tech-belt');
    await expect(async () => {
      await center(page, '.tech-belt');
      await page.waitForTimeout(250);
      await expect(belt).toBeInViewport({ ratio: 1 });
    }).toPass({ timeout: 10_000 });
    const track = page.locator('.tech-track').first();
    await expect.poll(() => track.evaluate((el) => getComputedStyle(el).animationName)).not.toBe('none');
    await belt.tap();
    await page.waitForTimeout(300);
    expect(await track.evaluate((el) => getComputedStyle(el).animationPlayState)).toBe('running');
    const x = () => track.evaluate((el) => el.getBoundingClientRect().x);
    const before = await x();
    await page.waitForTimeout(700);
    expect(await x(), 'still travelling after the tap').toBeLessThan(before - 5);
  });

  test('the belt loops by exactly one track, with no jump', async ({ page }) => {
    await page.goto(HOME);
    const end = await page.locator('.tech-track').first().evaluate((el) => {
      const frames = (el.getAnimations()[0]?.effect as KeyframeEffect | undefined)?.getKeyframes() ?? [];
      return String(frames.at(-1)?.transform ?? '');
    });
    expect(end.replace(/\s/g, '')).toMatch(/^translate(X)?\(-100%\)$/);
  });

  test('a tapped card does not keep its hover ring', async ({ page }) => {
    await page.goto(HOME);
    const card = page.locator('.ring-gradient').first();
    await card.evaluate((el) => el.scrollIntoView({ block: 'center', behavior: 'instant' }));
    const ring = () => card.evaluate((el) => getComputedStyle(el, '::before').opacity);
    expect(await ring()).toBe('0');
    await card.dispatchEvent('pointerdown');
    await card.hover({ force: true }).catch(() => {}); // what a tap leaves behind on a touch screen
    await page.waitForTimeout(400);
    expect(await ring(), 'no hover style where nothing can hover').toBe('0');
  });
});

test('the announcement bar finishes collapsing before it is removed', async ({ page }) => {
  await page.goto(HOME);
  const bar = page.locator('#announce');
  test.skip(!(await bar.count()) || !(await bar.isVisible()), 'no announcement is showing');
  /* Time from the tap to `hidden`: the collapse takes 350 ms, and the bar used to
     vanish on the first transition to end (the button's colour, or its own opacity). */
  await page.evaluate(() => {
    const el = document.getElementById('announce')!;
    const state = { tapped: 0, hiddenAfter: -1 };
    (window as unknown as { __announce: typeof state }).__announce = state;
    document.getElementById('announce-dismiss')!.addEventListener('click', () => (state.tapped = performance.now()), { capture: true });
    new MutationObserver(() => {
      if (el.hidden && state.hiddenAfter < 0) state.hiddenAfter = performance.now() - state.tapped;
    }).observe(el, { attributes: true, attributeFilter: ['hidden'] });
  });
  await page.locator('#announce-dismiss').tap();
  await expect(bar).toBeHidden({ timeout: 3000 });
  const after = await page.evaluate(() => (window as unknown as { __announce: { hiddenAfter: number } }).__announce.hiddenAfter);
  expect(after, 'not cut short').toBeGreaterThanOrEqual(300);
  expect(after).toBeLessThan(1500);
});

test('the hero scroll cue is centred', async ({ page }) => {
  await page.goto(HOME);
  const cue = page.locator('.hero-viewport svg.animate-bounce, svg.animate-bounce').first();
  await expect.poll(async () => {
    const box = await cue.boundingBox();
    return box ? Math.abs(box.x + box.width / 2 - page.viewportSize()!.width / 2) : 999;
  }).toBeLessThan(2);
});

test.describe('a short, wide screen (a phone on its side)', () => {
  test('an explainer taller than the screen still starts', async ({ page }) => {
    await page.setViewportSize({ width: 740, height: 360 });
    await page.goto('/au-en/case-studies/ai-robotics-space-bitcoin-convergence');
    const first = page.locator('figure.ex').first();
    await first.evaluate((el) => el.scrollIntoView({ block: 'start', behavior: 'instant' }));
    await expect(first).toHaveAttribute('data-ex-run', '', { timeout: 8000 });
  });
});

/**
 * Scroll reveals, the card spotlight, count-ups and the reading-progress bar — e2e.
 */
import { test, expect, type Page } from '@playwright/test';

const below = (page: Page) => page.locator('main [data-reveal]').last(); // far down the page
const opacity = (page: Page) => below(page).evaluate((el) => getComputedStyle(el).opacity);
const waiting = (page: Page) => page.locator('main [data-reveal]:not(.is-visible)').count();
/** Scroll a little, as a visitor would, until the reveals are armed. A busy WebKit can swallow one synthetic wheel. */
async function startScrolling(page: Page, by = 120) {
  await expect(async () => {
    await page.mouse.wheel(0, by);
    await expect.poll(() => waiting(page), { timeout: 1500 }).toBeGreaterThan(0);
  }).toPass({ timeout: 10_000 });
}

test.describe('scroll reveals', () => {
  test('a renderer that never scrolls finds the whole page visible', async ({ page }) => {
    await page.goto('/au-en/services');
    await page.waitForTimeout(600);
    const hidden = await page.locator('main [data-reveal]:not(.is-visible)').count();
    expect(hidden, 'nothing is left waiting for a scroll that will never come').toBe(0);
    expect(await opacity(page)).toBe('1');
  });

  test('a visitor who scrolls gets the reveal: out-of-sight content is re-armed, then shown as it arrives', async ({ page }) => {
    await page.goto('/au-en/services');
    await page.waitForTimeout(600);
    await expect(below(page)).toHaveClass(/is-visible/);

    await startScrolling(page); // the first sign of scrolling
    await expect(below(page)).not.toHaveClass(/is-visible/);
    await expect.poll(() => opacity(page), { message: 'hidden again, out of sight' }).toBe('0');

    await below(page).scrollIntoViewIfNeeded();
    await expect(below(page)).toHaveClass(/is-visible/, { timeout: 5000 });
    await expect.poll(() => opacity(page), { timeout: 3000 }).toBe('1');
  });

  test('what is already on screen when scrolling starts is not hidden under the visitor', async ({ page }) => {
    await page.goto('/au-en/services');
    await page.waitForTimeout(600);
    await startScrolling(page, 60);
    const hiddenOnScreen = await page.evaluate(
      () =>
        [...document.querySelectorAll('main [data-reveal]:not(.is-visible)')].filter((el) => {
          const r = el.getBoundingClientRect();
          return r.top < innerHeight && r.bottom > 0;
        }).length,
    );
    expect(hiddenOnScreen).toBe(0);
  });

  test('a shortcut key is not scrolling, and a printed page has everything on it', async ({ page }) => {
    const hidden = () => page.locator('main [data-reveal]:not(.is-visible)').count();
    await page.goto('/au-en/services');
    await page.waitForTimeout(600);
    await page.keyboard.press('Meta');
    await page.keyboard.press('Control');
    await page.waitForTimeout(200);
    expect(await hidden(), 'a modifier key alone hides nothing').toBe(0);

    await startScrolling(page);
    await page.emulateMedia({ media: 'print' });
    await expect.poll(() => opacity(page), { message: 'still waiting on screen, but printed' }).toBe('1');
  });

  test('arriving from a scrolled page does not hide the new one', async ({ page }) => {
    await page.goto('/au-en');
    await page.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' }));
    await page.locator('footer a[href$="/services"]').first().click();
    await page.waitForURL(/\/services$/);
    await page.waitForTimeout(800);
    expect(await page.locator('main [data-reveal]:not(.is-visible)').count()).toBe(0);
  });

  test('reduced motion: nothing is ever hidden', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/au-en/services');
    await page.mouse.wheel(0, 120);
    await page.waitForTimeout(300);
    expect(await opacity(page)).toBe('1');
  });

  test('reveals keep working after a client-side navigation', async ({ page }) => {
    await page.goto('/au-en');
    await page.getByRole('link', { name: 'Services', exact: false }).first().click();
    await page.waitForURL(/\/services$/);
    await page.waitForTimeout(600);
    await startScrolling(page);
    await expect(below(page)).not.toHaveClass(/is-visible/);
    await below(page).scrollIntoViewIfNeeded();
    await expect(below(page)).toHaveClass(/is-visible/, { timeout: 5000 });
  });
});

test.describe('card spotlight', () => {
  test('follows the cursor across a card, above its background and below its text', async ({ page }) => {
    await page.goto('/au-en/services');
    const card = page.locator('main a.ring-gradient').first();
    await card.scrollIntoViewIfNeeded();
    const box = (await card.boundingBox())!;
    await page.mouse.move(box.x + 40, box.y + 30);
    await expect.poll(() => card.evaluate((el: HTMLElement) => el.style.getPropertyValue('--mx'))).toMatch(/^\d+(\.\d+)?px$/);
    const first = await card.evaluate((el: HTMLElement) => el.style.getPropertyValue('--mx'));
    await page.mouse.move(box.x + box.width - 40, box.y + 30);
    await expect.poll(() => card.evaluate((el: HTMLElement) => el.style.getPropertyValue('--mx'))).not.toBe(first);
    const pseudo = await card.evaluate((el) => {
      const cs = getComputedStyle(el, '::after');
      return { z: cs.zIndex, events: cs.pointerEvents, isolation: getComputedStyle(el).isolation };
    });
    expect(pseudo).toEqual({ z: '-1', events: 'none', isolation: 'isolate' });
  });
});

test.describe('count-up on case-study figures', () => {
  const STUDY = '/au-en/case-studies/financial-compliance';
  const figures = (page: Page) => page.locator('[data-countup]');

  test('counts up to exactly what the page says, and non-figures are left alone', async ({ page }) => {
    await page.goto(STUDY);
    const written = await figures(page).allTextContents();
    expect(written.length).toBeGreaterThan(0);
    await figures(page).first().evaluate((el) => el.scrollIntoView({ block: 'center', behavior: 'instant' }));
    // The counting starts: at least one figure is, for a moment, not what was written…
    await expect
      .poll(async () => JSON.stringify(await figures(page).allTextContents()) !== JSON.stringify(written), { timeout: 4000 })
      .toBe(true);
    // …and when it is done, every value is exactly as written, and stays so.
    await expect.poll(() => figures(page).allTextContents(), { timeout: 6000 }).toEqual(written);
    await page.waitForTimeout(500);
    expect(await figures(page).allTextContents()).toEqual(written);
  });

  test('reduced motion: the figures never move', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(STUDY);
    const written = await figures(page).allTextContents();
    await figures(page).first().evaluate((el) => el.scrollIntoView({ block: 'center', behavior: 'instant' }));
    for (let i = 0; i < 6; i++) {
      expect(await figures(page).allTextContents()).toEqual(written);
      await page.waitForTimeout(120);
    }
  });
});

test.describe('reading progress', () => {
  const POST = '/au-en/blog/mlops-production';
  const bar = (page: Page) => page.locator('.reading-progress');
  const scale = (page: Page) => bar(page).evaluate((el) => new DOMMatrixReadOnly(getComputedStyle(el).transform).a);

  test('fills as a long page is read', async ({ page, browserName }) => {
    test.skip(browserName !== 'chromium', 'scroll-driven animations: asserted where they are supported');
    await page.goto(POST);
    // Its box is zero wide at the top of the page (scaleX 0), so ask the style, not the layout.
    expect(await bar(page).evaluate((el) => getComputedStyle(el).display)).toBe('block');
    expect(await scale(page)).toBeLessThan(0.05);
    await page.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight / 2, behavior: 'instant' }));
    await expect.poll(() => scale(page)).toBeGreaterThan(0.3);
    await page.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' }));
    await expect.poll(() => scale(page)).toBeGreaterThan(0.95);
  });

  test('is absent when motion is paused or reduced — the kill switch cannot stop a scroll-linked animation', async ({ page }) => {
    const display = () => bar(page).evaluate((el) => getComputedStyle(el).display);
    await page.goto(POST);
    await page.locator('[data-motion-toggle]:visible').first().click();
    await expect(page.locator('html')).toHaveAttribute('data-motion', 'off');
    expect(await display(), 'paused').toBe('none');
    await page.evaluate(() => localStorage.removeItem('motion'));
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.reload();
    expect(await display(), 'reduced motion').toBe('none');
  });
});

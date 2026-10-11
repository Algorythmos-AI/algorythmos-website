/**
 * The long-form evidence report (AI, robotics, space and Bitcoin) — e2e.
 *
 * Pins the parts the shorter studies do not have: the contents list, the five
 * step-through explainers and their three states (static, stepping, paused),
 * the claims table, the FAQ schema and the layout at phone width.
 */
import { test, expect, type Page } from '@playwright/test';

const SLUG = 'ai-robotics-space-bitcoin-convergence';
const LOCALES = ['au-en', 'fr-fr'] as const;
const url = (locale: string) => `/${locale}/case-studies/${SLUG}`;

const figures = (page: Page) => page.locator('figure.ex');
/** Opacity of every stepped part of the first diagram that belongs to the finished picture. */
const finalOpacities = (page: Page) =>
  figures(page)
    .first()
    .locator('.ex-art [data-at]:not([data-until])')
    .evaluateAll((els) => els.map((el) => getComputedStyle(el).opacity));

for (const locale of LOCALES) {
  test.describe(`${locale}`, () => {
    test('renders every long-form block with no script errors', async ({ page }) => {
      const errors: string[] = [];
      page.on('pageerror', (e) => errors.push(e.message));
      page.on('console', (m) => {
        if (m.type() === 'error') errors.push(m.text());
      });
      await page.goto(url(locale));
      await expect(figures(page)).toHaveCount(5);
      for (const id of ['pillar-1', 'pillar-2', 'pillar-3', 'pillar-4', 'orchestration', 'claims', 'faq', 'sources']) {
        await expect(page.locator(`#${id}`), id).toHaveCount(1);
        await expect(page.locator(`nav a[href="#${id}"]`), `contents link to ${id}`).toHaveCount(1);
      }
      await expect(page.locator('#claims tbody tr')).toHaveCount(15);
      await expect(page.locator('#sources ol > li')).toHaveCount(33);
      for (const f of await figures(page).all()) await expect(f.locator('ol > li')).toHaveCount(6);
      expect(errors, errors.join('\n')).toEqual([]);
    });

    test('FAQ schema carries all eight questions and the article is in the page language', async ({ page }) => {
      await page.goto(url(locale));
      const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();
      const nodes = blocks.flatMap((b) => {
        const parsed = JSON.parse(b);
        return Array.isArray(parsed) ? parsed : (parsed['@graph'] ?? [parsed]);
      });
      const faq = nodes.find((n) => n['@type'] === 'FAQPage');
      expect(faq?.mainEntity).toHaveLength(8);
      const article = nodes.find((n) => n['@type'] === 'Article');
      expect(article?.inLanguage).toBe(locale === 'fr-fr' ? 'fr' : 'en');
    });

    test('with reduced motion the explainers stand as finished diagrams', async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.goto(url(locale));
      await figures(page).first().scrollIntoViewIfNeeded();
      await page.waitForTimeout(1200);
      for (const f of await figures(page).all()) await expect(f).not.toHaveAttribute('data-ex-run', '');
      expect(new Set(await finalOpacities(page))).toEqual(new Set(['1']));
      await expect(figures(page).first().locator('[data-ex-replay]')).toBeHidden();
      // Parts that only exist mid-run are not in the static picture.
      const midRun = await figures(page).first().locator('.ex-art [data-until]').evaluateAll((els) => els.map((el) => getComputedStyle(el).display));
      expect(new Set(midRun)).toEqual(new Set(['none']));
    });
  });
}

test.describe('explainer stepping', () => {
  test('starts when scrolled into view, advances, and replays from the first step', async ({ page }) => {
    await page.goto(url('au-en'));
    const first = figures(page).first();
    await expect(first).not.toHaveAttribute('data-ex-run', '');
    await first.scrollIntoViewIfNeeded();
    await expect(first).toHaveAttribute('data-ex-run', '');
    await expect.poll(() => first.getAttribute('data-ex-step'), { timeout: 8000 }).toBe('2');
    // Exactly one step of the list is current.
    await expect(first.locator('ol > li.is-now')).toHaveCount(1);
    await first.locator('[data-ex-replay]').click();
    await expect(first).toHaveAttribute('data-ex-step', '0');
  });

  test('explainers further down the page are not running until they are reached', async ({ page }) => {
    await page.goto(url('au-en'));
    await figures(page).first().scrollIntoViewIfNeeded();
    await expect(figures(page).first()).toHaveAttribute('data-ex-run', '');
    await expect(figures(page).last()).not.toHaveAttribute('data-ex-run', '');
  });

  test('the header pause button returns a running explainer to its finished diagram', async ({ page }) => {
    await page.goto(url('au-en'));
    const first = figures(page).first();
    await first.scrollIntoViewIfNeeded();
    await expect(first).toHaveAttribute('data-ex-run', '');
    await page.locator('[data-motion-toggle]:visible').first().click();
    await expect(page.locator('html')).toHaveAttribute('data-motion', 'off');
    await expect(first).not.toHaveAttribute('data-ex-run', '');
    await expect(first.locator('.is-on, .is-now')).toHaveCount(0);
    // Polled: the pause rule leaves a 0.01ms transition, which settles on the next frame.
    await expect.poll(async () => [...new Set(await finalOpacities(page))]).toEqual(['1']);
    // And it stays there: nothing re-arms the loop while motion is off.
    await page.waitForTimeout(2500);
    await expect(first).not.toHaveAttribute('data-ex-run', '');
    expect([...new Set(await finalOpacities(page))]).toEqual(['1']);
  });

  test('loops back to the first step after the last, without drifting', async ({ page }) => {
    test.slow();
    await page.goto(url('au-en'));
    const first = figures(page).first();
    await first.scrollIntoViewIfNeeded();
    await expect.poll(() => first.getAttribute('data-ex-step'), { timeout: 20000 }).toBe('5');
    await expect(first.locator('.ex-art [data-at]:not([data-until]):not(.is-on)')).toHaveCount(0);
    await expect.poll(() => first.getAttribute('data-ex-step'), { timeout: 10000 }).toBe('0');
  });
});

test.describe('phone width', () => {
  test.use({ viewport: { width: 375, height: 812 } });
  for (const locale of LOCALES) {
    test(`no horizontal scroll and diagrams fit (${locale})`, async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.goto(url(locale));
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(overflow).toBeLessThanOrEqual(0);
      const widths = await page.locator('.ex-art').evaluateAll((els) => els.map((el) => el.getBoundingClientRect().width));
      for (const w of widths) {
        expect(w).toBeGreaterThan(200);
        expect(w).toBeLessThanOrEqual(375);
      }
    });
  }
});

test('the announcement bar and the index card both lead to the report', async ({ page }) => {
  await page.goto('/au-en/case-studies');
  await expect(page.locator(`a[href$="/case-studies/${SLUG}"]`).first()).toBeVisible();
  const cards = page.locator(`main a[href="/au-en/case-studies/${SLUG}"]`);
  expect(await cards.count()).toBeGreaterThan(0);
});

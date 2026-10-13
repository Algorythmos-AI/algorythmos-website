/**
 * The signals evidence report (sound, fibre, satellites, orbital compute) — e2e.
 *
 * Pins the long-form blocks and their counts, the six step-through explainers
 * in their three states (static, stepping, paused), the FAQ schema, that every
 * in-text citation resolves to a listed source, and the layout at phone width.
 */
import { test, expect, type Page } from '@playwright/test';

const SLUG = 'signals-fibre-satellites-orbital-compute';
const LOCALES = ['au-en', 'fr-fr'] as const;
const url = (locale: string) => `/${locale}/case-studies/${SLUG}`;
const SOURCES = 17;

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
      await expect(figures(page)).toHaveCount(6);
      for (const f of await figures(page).all()) await expect(f.locator('ol > li')).toHaveCount(6);
      for (const id of ['pillar-1', 'pillar-2', 'pillar-3', 'pillar-4', 'pillar-5', 'orchestration', 'claims', 'faq', 'sources']) {
        await expect(page.locator(`#${id}`), id).toHaveCount(1);
        await expect(page.locator(`nav a[href="#${id}"]`), `contents link to ${id}`).toHaveCount(1);
      }
      await expect(page.locator('#claims tbody tr')).toHaveCount(15);
      await expect(page.locator('#sources ol > li')).toHaveCount(SOURCES);
      await expect(page.locator('#orchestration ol > li:not(.ex-step)'), 'route steps, not the explainer’s own list').toHaveCount(6);
      await expect(page.locator('[role="note"]')).toHaveCount(1);
      expect(errors, errors.join('\n')).toEqual([]);
    });

    test('every citation in the text points at a listed source, and every source link is https', async ({ page }) => {
      await page.goto(url(locale));
      const text = await page.locator('main').innerText();
      const cited = [...text.matchAll(/\[(\d+(?:\s*,\s*\d+)*)\]/g)].flatMap((m) => m[1].split(',').map((n) => Number(n.trim())));
      expect(cited.length).toBeGreaterThan(30);
      expect(Math.min(...cited)).toBeGreaterThanOrEqual(1);
      expect(Math.max(...cited)).toBeLessThanOrEqual(SOURCES);
      expect(new Set(cited).size, 'every source is cited').toBe(SOURCES);
      const hrefs = await page.locator('#sources ol > li a').evaluateAll((as) => as.map((a) => a.getAttribute('href') ?? ''));
      expect(hrefs).toHaveLength(SOURCES);
      for (const h of hrefs) expect(h).toMatch(/^https:\/\//);
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
    await expect(first.locator('ol > li.is-now')).toHaveCount(1);
    await first.locator('[data-ex-replay]').click();
    await expect(first).toHaveAttribute('data-ex-step', '0');
  });

  test('every diagram reaches its last step with the whole picture drawn', async ({ page }) => {
    test.slow();
    await page.goto(url('au-en'));
    for (const f of await figures(page).all()) {
      await f.scrollIntoViewIfNeeded();
      await expect.poll(() => f.getAttribute('data-ex-step'), { timeout: 20000 }).toBe('5');
      await expect(f.locator('.ex-art [data-at]:not([data-until]):not(.is-on)')).toHaveCount(0);
    }
  });

  test('the header pause button returns a running explainer to its finished diagram', async ({ page }) => {
    await page.goto(url('au-en'));
    const first = figures(page).first();
    await first.scrollIntoViewIfNeeded();
    await expect(first).toHaveAttribute('data-ex-run', '');
    await page.locator('[data-motion-toggle]:visible').first().click();
    await expect(page.locator('html')).toHaveAttribute('data-motion', 'off');
    await expect(first).not.toHaveAttribute('data-ex-run', '');
    await expect.poll(async () => [...new Set(await finalOpacities(page))]).toEqual(['1']);
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
      expect(widths).toHaveLength(6);
      for (const w of widths) {
        expect(w).toBeGreaterThan(200);
        expect(w).toBeLessThanOrEqual(375);
      }
    });
  }
});

test('the index lists the report', async ({ page }) => {
  await page.goto('/au-en/case-studies');
  await expect(page.locator(`main a[href="/au-en/case-studies/${SLUG}"]`).first()).toBeVisible();
});

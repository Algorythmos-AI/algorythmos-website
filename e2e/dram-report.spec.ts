/**
 * The 4F² DRAM evidence report — e2e.
 *
 * Pins the long-form blocks and their counts, the FAQ schema, that every in-text
 * citation resolves to a listed source, that no market commentary has crept into
 * the copy, and the layout at phone width.
 */
import { test, expect } from '@playwright/test';

const SLUG = 'dram-4f2-cell-architecture';
const LOCALES = ['au-en', 'fr-fr'] as const;
const url = (locale: string) => `/${locale}/case-studies/${SLUG}`;
const SOURCES = 39;
const PILLARS = 8;
/** The report is engineering only (docs/COPY_CLAIMS_SIGNOFF.md §3j). */
const OFF_TOPIC = /share price|stock market|sell-off|investor|valuation|\bASP\b|sanction|tariff|export control|cours de bourse|investisseur|valorisation/i;

for (const locale of LOCALES) {
  test.describe(`${locale}`, () => {
    test('renders every long-form block with no script errors', async ({ page }) => {
      const errors: string[] = [];
      page.on('pageerror', (e) => errors.push(e.message));
      page.on('console', (m) => {
        if (m.type() === 'error') errors.push(m.text());
      });
      await page.goto(url(locale));
      const ids = [...Array.from({ length: PILLARS }, (_, i) => `pillar-${i + 1}`), 'orchestration', 'claims', 'faq', 'sources'];
      for (const id of ids) {
        await expect(page.locator(`#${id}`), id).toHaveCount(1);
        await expect(page.locator(`nav a[href="#${id}"]`), `contents link to ${id}`).toHaveCount(1);
      }
      await expect(page.locator('#claims tbody tr')).toHaveCount(12);
      await expect(page.locator('#sources ol > li')).toHaveCount(SOURCES);
      await expect(page.locator('#orchestration ol > li:not(.ex-step)'), 'ladder steps, not the explainer’s own list').toHaveCount(6);
      await expect(page.locator('[role="note"]')).toHaveCount(1);
      expect(errors, errors.join('\n')).toEqual([]);
    });

    test('every citation in the text points at a listed source, and every source link is https', async ({ page }) => {
      await page.goto(url(locale));
      const text = await page.locator('main').innerText();
      const cited = [...text.matchAll(/\[(\d+(?:\s*,\s*\d+)*)\]/g)].flatMap((m) => m[1].split(',').map((n) => Number(n.trim())));
      expect(cited.length).toBeGreaterThan(60);
      expect(Math.min(...cited)).toBeGreaterThanOrEqual(1);
      expect(Math.max(...cited)).toBeLessThanOrEqual(SOURCES);
      expect(new Set(cited).size, 'every source is cited').toBe(SOURCES);
      const hrefs = await page.locator('#sources ol > li a').evaluateAll((as) => as.map((a) => a.getAttribute('href') ?? ''));
      expect(hrefs).toHaveLength(SOURCES);
      for (const h of hrefs) expect(h).toMatch(/^https:\/\//);
    });

    test('the copy stays on engineering', async ({ page }) => {
      await page.goto(url(locale));
      const text = await page.locator('main').innerText();
      expect(text.match(OFF_TOPIC)?.[0] ?? '').toBe('');
    });

    test('FAQ schema carries all seven questions and the article is in the page language', async ({ page }) => {
      await page.goto(url(locale));
      const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();
      const nodes = blocks.flatMap((b) => {
        const parsed = JSON.parse(b);
        return Array.isArray(parsed) ? parsed : (parsed['@graph'] ?? [parsed]);
      });
      const faq = nodes.find((n) => n['@type'] === 'FAQPage');
      expect(faq?.mainEntity).toHaveLength(7);
      const article = nodes.find((n) => n['@type'] === 'Article');
      expect(article?.inLanguage).toBe(locale === 'fr-fr' ? 'fr' : 'en');
    });
  });
}

test.describe('phone width', () => {
  test.use({ viewport: { width: 375, height: 812 } });
  for (const locale of LOCALES) {
    test(`no horizontal scroll (${locale})`, async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.goto(url(locale));
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(overflow).toBeLessThanOrEqual(0);
    });
  }
});

test('the index lists the report first', async ({ page }) => {
  await page.goto('/au-en/case-studies');
  const first = page.locator('main a[href^="/au-en/case-studies/"]').first();
  await expect(first).toHaveAttribute('href', `/au-en/case-studies/${SLUG}`);
});

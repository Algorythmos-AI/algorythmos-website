/**
 * The AI in Mining industry report, co-written with MBSC Australia — e2e.
 *
 * Pins the co-author byline and schema, the disclosure note, the long-form
 * blocks, the two explainers, the claims table, citations, that no outcome
 * figure or market talk has crept into the copy, the announcement bar, and the
 * layout at phone width (docs/COPY_CLAIMS_SIGNOFF.md §3k).
 */
import { test, expect, type Page } from '@playwright/test';

const SLUG = 'ai-in-mining-mbsc';
const LOCALES = ['au-en', 'fr-fr'] as const;
const url = (locale: string) => `/${locale}/case-studies/${SLUG}`;
const SOURCES = 5;
const PILLARS = 6;
const CLAIMS = 5;
/** An industry report claims no measured outcome and no market view. */
const OFF_LIMITS = /\d+(?:[.,]\d+)?\s?%|\bproven\b|prouvée?s?\b|share price|investor|investisseur|cours de bourse/i;

const jsonLd = async (page: Page) => {
  const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();
  return blocks.flatMap((b) => {
    const parsed = JSON.parse(b);
    return Array.isArray(parsed) ? parsed : (parsed['@graph'] ?? [parsed]);
  });
};

for (const locale of LOCALES) {
  test.describe(locale, () => {
    test('renders every block, with the co-author byline and disclosure, and no script errors', async ({ page }) => {
      const errors: string[] = [];
      page.on('pageerror', (e) => errors.push(e.message));
      page.on('console', (m) => {
        if (m.type() === 'error') errors.push(m.text());
      });
      const res = await page.goto(url(locale));
      expect(res?.status()).toBe(200);
      await expect(page.locator('h1')).toHaveCount(1);

      const byline = page.locator('[data-byline] a');
      await expect(byline).toHaveCount(1);
      await expect(byline).toHaveText('MBSC Australia');
      await expect(byline).toHaveAttribute('href', /^https:\/\/www\.mbscaustralia\.com\.au\//);
      await expect(byline).toHaveAttribute('rel', /noopener/);

      await expect(page.locator('[role="note"]')).toHaveCount(1);
      const ids = [...Array.from({ length: PILLARS }, (_, i) => `pillar-${i + 1}`), 'orchestration', 'claims', 'faq', 'sources'];
      for (const id of ids) await expect(page.locator(`#${id}`), id).toHaveCount(1);

      await expect(page.locator('figure.ex')).toHaveCount(2);
      await expect(page.locator('#pillar-2 figure.ex ol > li')).toHaveCount(5);
      await expect(page.locator('#orchestration figure.ex ol > li')).toHaveCount(4);
      for (const f of await page.locator('figure.ex').all()) await expect(f.locator('h3')).not.toBeEmpty();

      await expect(page.locator('#claims tbody tr')).toHaveCount(CLAIMS);
      await expect(page.locator('#claims [data-verdict]')).toHaveCount(CLAIMS);
      await expect(page.locator('#sources ol > li')).toHaveCount(SOURCES);
      expect(errors, errors.join('\n')).toEqual([]);
    });

    test('Article schema names both authors; FAQ schema is present', async ({ page }) => {
      await page.goto(url(locale));
      const nodes = await jsonLd(page);
      const article = nodes.find((n) => n['@type'] === 'Article');
      expect(Array.isArray(article?.author)).toBe(true);
      expect(article.author).toHaveLength(2);
      expect(article.author[1]).toMatchObject({ '@type': 'Organization', name: 'MBSC Australia', url: 'https://www.mbscaustralia.com.au/' });
      expect(article.inLanguage).toBe(locale === 'fr-fr' ? 'fr' : 'en');
      expect(nodes.find((n) => n['@type'] === 'FAQPage')?.mainEntity).toHaveLength(4);
    });

    test('every citation resolves to a listed https source', async ({ page }) => {
      await page.goto(url(locale));
      const text = await page.locator('main').innerText();
      const cited = [...text.matchAll(/\[(\d+(?:\s*,\s*\d+)*)\]/g)].flatMap((m) => m[1].split(',').map((n) => Number(n.trim())));
      expect(new Set(cited).size, 'every source is cited').toBe(SOURCES);
      expect(Math.max(...cited)).toBeLessThanOrEqual(SOURCES);
      for (const h of await page.locator('#sources ol > li a').evaluateAll((as) => as.map((a) => a.getAttribute('href') ?? ''))) {
        expect(h).toMatch(/^https:\/\//);
      }
    });

    test('the copy claims no outcome figures and no market view', async ({ page }) => {
      await page.goto(url(locale));
      const text = await page.locator('main').innerText();
      expect(text.match(OFF_LIMITS)?.[0] ?? '').toBe('');
    });

    test('no horizontal scroll at phone width', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 812 });
      await page.goto(url(locale));
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(overflow).toBeLessThanOrEqual(0);
    });

    test('the announcement bar promotes the report and stays dismissed', async ({ page }) => {
      await page.goto(`/${locale}/services`);
      const bar = page.locator(`a[href$="/case-studies/${SLUG}"]`).first();
      await expect(bar).toBeVisible();
      await page.locator('#announce-dismiss').click();
      await page.reload();
      await expect(page.locator(`a[href$="/case-studies/${SLUG}"]`).first()).toBeHidden();
    });
  });
}

test('the index lists the report first', async ({ page }) => {
  await page.goto('/au-en/case-studies');
  const first = page.locator('main a[href^="/au-en/case-studies/"]').first();
  await expect(first).toHaveAttribute('href', `/au-en/case-studies/${SLUG}`);
});

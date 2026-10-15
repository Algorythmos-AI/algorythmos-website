/**
 * The 4F² DRAM evidence report — e2e.
 *
 * Pins the long-form blocks and their counts, the nine step-through explainers in
 * their three states (static, stepping, paused), the density calculator with and
 * without script, the verdict chips, the FAQ schema, that every in-text citation
 * resolves to a listed source, that no market commentary has crept into the copy,
 * and the layout at phone width.
 */
import { test, expect, type Page } from '@playwright/test';

const SLUG = 'dram-4f2-cell-architecture';
const LOCALES = ['au-en', 'fr-fr'] as const;
const url = (locale: string) => `/${locale}/case-studies/${SLUG}`;
const SOURCES = 39;
const PILLARS = 8;
const FIGURES = 9;

const figures = (page: Page) => page.locator('figure.ex');
/** Opacity of every stepped part of the first diagram that belongs to the finished picture. */
const finalOpacities = (page: Page) =>
  figures(page)
    .first()
    .locator('.ex-art [data-at]:not([data-until])')
    .evaluateAll((els) => els.map((el) => getComputedStyle(el).opacity));
const calculator = (page: Page) => page.locator('[data-density-calculator]');
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
      await expect(figures(page)).toHaveCount(FIGURES);
      for (const f of await figures(page).all()) await expect(f.locator('ol > li')).toHaveCount(6);
      await expect(page.locator('#claims tbody tr')).toHaveCount(12);
      await expect(page.locator('#claims [data-verdict]'), 'every verdict carries its evidence colour').toHaveCount(12);
      await expect(page.locator('#pillar-3 [data-density-calculator]')).toHaveCount(1);
      await expect(page.locator('main [data-scene="memory-array"]')).toHaveCount(1);
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

test.describe('density calculator', () => {
  test('opens on the figures the report quotes, and follows the slider by mouse and keyboard', async ({ page }) => {
    await page.goto(url('au-en'));
    const calc = calculator(page);
    await calc.scrollIntoViewIfNeeded();
    await expect(calc.locator('[data-density-share]')).toHaveText('60%');
    await expect(calc.locator('[data-density-area]')).toHaveText('80.0%');
    await expect(calc.locator('[data-density-gain]')).toHaveText('+25.0%');
    /* The island hydrates when it scrolls into view; Astro drops the `ssr` attribute once it has. */
    await expect(page.locator('astro-island', { has: calc })).not.toHaveAttribute('ssr', '');
    const slider = calc.getByRole('slider');
    await slider.fill('80');
    await expect(calc.locator('[data-density-area]')).toHaveText('73.3%');
    await expect(calc.locator('[data-density-gain]')).toHaveText('+36.4%');
    await slider.focus();
    await page.keyboard.press('ArrowLeft');
    await expect(calc.locator('[data-density-share]')).toHaveText('75%');
    await page.keyboard.press('Home');
    await expect(calc.locator('[data-density-share]')).toHaveText('30%');
    await expect(calc.locator('[data-density-area]')).toHaveText('90.0%');
  });

  test('the French page formats its numbers the French way', async ({ page }) => {
    await page.goto(url('fr-fr'));
    const area = (await calculator(page).locator('[data-density-area]').innerText()).replace(/\s/g, ' ');
    expect(area).toBe('80,0 %');
  });

  test.describe('with scripting off', () => {
    test.use({ javaScriptEnabled: false });
    test('the figure and its numbers are already in the page', async ({ page }) => {
      await page.goto(url('au-en'));
      const calc = calculator(page);
      await expect(calc).toHaveCount(1);
      await expect(calc.locator('[data-density-area]')).toHaveText('80.0%');
      await expect(calc.locator('[data-density-gain]')).toHaveText('+25.0%');
      await expect(figures(page)).toHaveCount(FIGURES);
    });
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
      expect(widths).toHaveLength(FIGURES);
      for (const w of widths) {
        expect(w).toBeGreaterThan(200);
        expect(w).toBeLessThanOrEqual(375);
      }
      const calc = await calculator(page).boundingBox();
      expect(calc!.width).toBeLessThanOrEqual(375);
    });
  }
});

test('the index lists the report first among the research reports', async ({ page }) => {
  await page.goto('/au-en/case-studies');
  const first = page.locator('section#research a[href^="/au-en/case-studies/"]').first();
  await expect(first).toHaveAttribute('href', `/au-en/case-studies/${SLUG}`);
});

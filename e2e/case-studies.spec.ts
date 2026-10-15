/**
 * Case-study index — e2e. The listing is grouped into the three categories, every
 * study appears exactly once under its own category, the hub and spotlight point
 * at real studies, the find-a-study filter works (and is absent without JS), and
 * the page never scrolls sideways on a phone.
 */
import { test, expect } from '@playwright/test';
import { caseStudies, groupedCaseStudies, latestCaseStudy } from '../src/data/caseStudies';

for (const prefix of ['/au-en', '/fr-fr'] as const) {
  test(`${prefix}/case-studies is grouped by category`, async ({ page }) => {
    await page.goto(`${prefix}/case-studies`);
    await expect(page.locator('h1')).toHaveCount(1);
    const groups = groupedCaseStudies();
    await expect(page.locator('[data-cs-section]')).toHaveCount(groups.length);
    for (const g of groups) {
      const section = page.locator(`section#${g.category}`);
      await expect(section.locator('h2')).toHaveCount(1);
      await expect(page.locator(`[data-cs-nav] a[href="#${g.category}"]`)).toHaveCount(1);
      for (const c of g.items) await expect(section.locator(`a[href="${prefix}/case-studies/${c.slug}"]`)).toHaveCount(1);
    }
    for (const c of caseStudies) await expect(page.locator(`[data-cs-section] a[href="${prefix}/case-studies/${c.slug}"]`)).toHaveCount(1);
  });

  test(`${prefix}/case-studies category bar jumps to its section`, async ({ page }) => {
    await page.goto(`${prefix}/case-studies`);
    await page.locator('[data-cs-nav] a[href="#research"]').click();
    await expect(page).toHaveURL(/#research$/);
    await expect(page.locator('section#research h2')).toBeInViewport();
    await expect(page.locator('[data-cs-nav] a[href="#research"]')).toHaveAttribute('aria-current', 'true');
  });

  test(`${prefix}/case-studies deep link lands on its section`, async ({ page }) => {
    await page.goto(`${prefix}/case-studies#industry`);
    await expect(page.locator('section#industry h2')).toBeInViewport();
  });

  test(`${prefix}/case-studies has no horizontal overflow on a phone`, async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(`${prefix}/case-studies`);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(0);
  });
}

test('a detail page shows its category in the breadcrumb', async ({ page }) => {
  await page.goto('/au-en/case-studies/clinical-document-ai');
  await expect(page.locator('nav[aria-label] a[href$="/case-studies#client"]')).toHaveCount(1);
});

const groups = groupedCaseStudies();
const byCategory = new Map(caseStudies.map((c) => [c.slug, c.category]));
const latest = latestCaseStudy()!;

for (const prefix of ['/au-en', '/fr-fr'] as const) {
  test.describe(`${prefix}/case-studies hub`, () => {
    test('has one card per category, linking only to its own studies', async ({ page }) => {
      await page.goto(`${prefix}/case-studies`);
      await expect(page.locator('[data-cs-hub-card]')).toHaveCount(groups.length);
      for (const g of groups) {
        const card = page.locator(`[data-cs-hub-card="${g.category}"]`);
        await expect(card.locator('h3')).toHaveCount(1);
        await expect(card.locator(`a[href="#${g.category}"]`)).toHaveCount(1);
        await expect(card.locator(`a[href="#${g.category}"]`)).toContainText(`(${g.items.length})`);
        const hrefs = await card.locator(`a[href^="${prefix}/case-studies/"]`).evaluateAll((as) => as.map((a) => a.getAttribute('href')!));
        expect(hrefs.length).toBe(Math.min(4, g.items.length));
        for (const h of hrefs) expect(byCategory.get(h.split('/').pop()!), h).toBe(g.category);
      }
    });

    test('spotlights the newest study', async ({ page }) => {
      await page.goto(`${prefix}/case-studies`);
      await expect(page.locator('[data-cs-spotlight]')).toHaveAttribute('href', `${prefix}/case-studies/${latest.slug}`);
    });

    test('lines the hub art up across cards on desktop', async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto(`${prefix}/case-studies`);
      const tops = await page.locator('.cs-hub-art').evaluateAll((els) => els.map((e) => Math.round(e.getBoundingClientRect().top)));
      expect(new Set(tops).size, String(tops)).toBe(1);
    });
  });

  test.describe(`${prefix}/case-studies filter`, () => {
    test('search narrows the list, updates counts and the URL, and clears', async ({ page }) => {
      await page.goto(`${prefix}/case-studies`);
      const q = page.locator('[data-cs-q]');
      await expect(q).toBeVisible();
      const term = prefix === '/fr-fr' ? 'supervision' : 'monitoring';
      await q.fill(term);
      await expect(page).toHaveURL(new RegExp(`[?&]q=${term}`));
      const visible = page.locator('[data-cs-card]:not([hidden])');
      await expect.poll(() => visible.count()).toBeLessThan(caseStudies.length);
      const n = await visible.count();
      expect(n).toBeGreaterThan(0);
      await expect(page.locator('[data-cs-status]')).toContainText(String(n));
      let sum = 0;
      for (const g of groups) sum += Number(await page.locator(`[data-cs-pill-count="${g.category}"]`).textContent());
      expect(sum).toBe(n);
      await q.press('Escape');
      await expect(visible).toHaveCount(caseStudies.length);
      await expect(page).not.toHaveURL(/[?&]q=/);
    });

    test('a sector chip filters, survives a reload, and an unknown sector is ignored', async ({ page }) => {
      await page.goto(`${prefix}/case-studies`);
      await page.locator('[data-cs-sector="healthcare"]').click();
      await expect(page.locator('[data-cs-sector="healthcare"]')).toHaveAttribute('aria-pressed', 'true');
      const expected = caseStudies.filter((c) => c.sector === 'healthcare').length;
      await expect(page.locator('[data-cs-card]:not([hidden])')).toHaveCount(expected);
      await page.reload();
      await expect(page.locator('[data-cs-card]:not([hidden])')).toHaveCount(expected);
      await page.goto(`${prefix}/case-studies?sector=nope`);
      await expect(page.locator('[data-cs-card]:not([hidden])')).toHaveCount(caseStudies.length);
    });

    test('no match shows the empty state, and Clear filters restores everything', async ({ page }) => {
      await page.goto(`${prefix}/case-studies?q=zzzz-no-such-study`);
      await expect(page.locator('[data-cs-none]')).toBeVisible();
      await expect(page.locator('[data-cs-card]:not([hidden])')).toHaveCount(0);
      await page.locator('[data-cs-none] [data-cs-clear]').click();
      await expect(page.locator('[data-cs-card]:not([hidden])')).toHaveCount(caseStudies.length);
      await expect(page.locator('[data-cs-none]')).toBeHidden();
    });
  });
}

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false });
  test('the filter is absent and every study is listed', async ({ page }) => {
    await page.goto('/au-en/case-studies?q=monitoring');
    await expect(page.locator('[data-cs-finder]')).toBeHidden();
    await expect(page.locator('[data-cs-card]:visible')).toHaveCount(caseStudies.length);
  });
});

test('hub, finder and cards fit a 375px phone', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/fr-fr/case-studies');
  const tooWide = await page.evaluate(() =>
    [...document.querySelectorAll<HTMLElement>('[data-cs-hub-card], [data-cs-finder], [data-cs-card], [data-cs-spotlight]')]
      .filter((e) => e.getBoundingClientRect().right > window.innerWidth + 1)
      .map((e) => e.dataset.slug ?? e.dataset.csHubCard ?? e.tagName),
  );
  expect(tooWide).toEqual([]);
});

test('a study page links to more studies in its own category', async ({ page }) => {
  await page.goto('/au-en/case-studies/clinical-document-ai');
  const items = page.locator('[data-cs-more-item]');
  await expect(items).toHaveCount(3);
  for (const slug of await items.evaluateAll((as) => as.map((a) => (a as HTMLElement).dataset.csMoreItem!)))
    expect(byCategory.get(slug), slug).toBe('client');
  await expect(page.locator('[data-cs-more] a[href="/au-en/case-studies#client"]')).toHaveCount(1);
});

test('research cards read "Read the report"', async ({ page }) => {
  await page.goto('/au-en/case-studies');
  await expect(page.locator('section#research [data-cs-card]').first()).toContainText('Read the report');
  await expect(page.locator('section#client [data-cs-card]').first()).toContainText('Read the case study');
});

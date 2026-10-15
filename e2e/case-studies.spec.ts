/**
 * Case-study index — e2e. The listing is grouped into the three categories, every
 * study appears exactly once under its own category, the category bar links to
 * the sections, and the page never scrolls sideways on a phone.
 */
import { test, expect } from '@playwright/test';
import { caseStudies, groupedCaseStudies } from '../src/data/caseStudies';

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
    for (const c of caseStudies) await expect(page.locator(`main a[href="${prefix}/case-studies/${c.slug}"]`)).toHaveCount(1);
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

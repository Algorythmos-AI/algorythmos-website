/**
 * Service pages — e2e. Every service page (from the registry) carries the full
 * anatomy in both locales, never makes partner/certification claims, and FR
 * cards never break words mid-line.
 */
import { test, expect } from '@playwright/test';
import { services } from '../src/data/services';

const CLAIMS = /certified (partner|expert)|official partner|partenaires? (certifiés?|officiels?)/i;

for (const prefix of ['/au-en', '/fr-fr'] as const) {
  for (const svc of services) {
    test(`${prefix}/services/${svc.slug} has the full page anatomy`, async ({ page }) => {
      await page.goto(`${prefix}/services/${svc.slug}`);
      await expect(page.locator('h1')).toHaveCount(1);
      await expect(page.locator(`[data-console="svc-${svc.slug}"]`)).toHaveCount(1);
      expect(await page.locator('[data-steps] ol > li').count()).toBeGreaterThanOrEqual(4);
      await expect(page.locator('[data-stack-grid]')).toHaveCount(1);
      expect(await page.locator('main details').count()).toBeGreaterThanOrEqual(5);
      await expect(page.locator('[data-proof]')).toHaveCount(svc.proof ? 1 : 0);
      if (svc.proof) await expect(page.locator(`[data-proof] a[href="${prefix}/case-studies/${svc.proof}"]`)).toHaveCount(1);
      const text = await page.locator('main').evaluate((m) => {
        const clone = m.cloneNode(true) as HTMLElement;
        clone.querySelectorAll('[data-console]').forEach((c) => c.remove());
        return clone.innerText;
      });
      expect(text).not.toMatch(CLAIMS);
    });
  }
}

// body { overflow-x: clip } hides overflow from document scrollWidth, so check
// each card text element's own box at phone widths.
test.describe('FR cards fit narrow phones without mid-word breaks overflowing', () => {
  for (const width of [320, 360]) {
    for (const path of ['/fr-fr/services', '/fr-fr']) {
      test(`${path} at ${width}px`, async ({ page }) => {
        await page.setViewportSize({ width, height: 800 });
        await page.goto(path);
        const overflowing = await page.evaluate(() =>
          [...document.querySelectorAll('main a.ring-gradient :is(h2, h3, p)')]
            .filter((el) => el.scrollWidth > el.clientWidth + 1)
            .map((el) => el.textContent?.trim().slice(0, 60)),
        );
        expect(overflowing).toEqual([]);
      });
    }
  }
});

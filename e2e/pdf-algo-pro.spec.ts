/**
 * PDF Algo Pro product pages — e2e.
 *
 * The App Store record and shipped builds of the app link to these URLs, so the
 * paths are pinned here: a rename must fail this spec, not break a link inside
 * an app that is already on people's phones. Both legal documents must show a
 * version and an effective date, name the company that publishes the app in
 * both languages, and the support page must offer a real way to write to us.
 */
import { test, expect } from '@playwright/test';
import { BUSINESS, FR_PUBLISHER } from '../src/data/business';
import { PDF_ALGO_PRO } from '../src/data/products';

const PATHS = ['/pdf-algo-pro', '/pdf-algo-pro/privacy', '/pdf-algo-pro/terms', '/pdf-algo-pro/support'];
const LOCALES = [
  { prefix: '/au-en', lang: 'en-AU' },
  { prefix: '/fr-fr', lang: 'fr-FR' },
];

test('the product paths are the ones the app and the App Store record link to', () => {
  expect(Object.values(PDF_ALGO_PRO.paths)).toEqual(PATHS);
});

for (const { prefix, lang } of LOCALES) {
  for (const path of PATHS) {
    test(`${prefix}${path} renders with one h1, a canonical and its hreflang pair`, async ({ page }) => {
      const res = await page.goto(prefix + path);
      expect(res?.status()).toBe(200);
      await expect(page.locator('html')).toHaveAttribute('lang', lang);
      await expect(page.locator('h1')).toHaveCount(1);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://algorythmos.com${prefix}${path}`);
      await expect(page.locator('link[rel="alternate"][hreflang="fr-FR"]')).toHaveAttribute('href', `https://algorythmos.com/fr-fr${path}`);
      await expect(page.locator('link[rel="alternate"][hreflang="en-AU"]')).toHaveAttribute('href', `https://algorythmos.com/au-en${path}`);
      // No mobile overflow.
      await page.setViewportSize({ width: 375, height: 812 });
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(overflow).toBeLessThanOrEqual(0);
    });
  }

  for (const doc of ['privacy', 'terms'] as const) {
    test(`${prefix} ${doc} shows its version and date and names the publisher of the app`, async ({ page }) => {
      await page.goto(prefix + PDF_ALGO_PRO.paths[doc]);
      const spec = PDF_ALGO_PRO[doc];
      const main = page.locator('main');
      await expect(page.locator(`[data-legal-version="${spec.versions[0].version}"] time`)).toHaveAttribute('datetime', spec.versions[0].date);
      // The Australian company publishes the app in every language: unlike the
      // site's own French legal pages, these never name the French business.
      for (const v of ['Algorythmos Pty Ltd', BUSINESS.abn, PDF_ALGO_PRO.supportEmail, 'Elizabeth Street']) await expect(main).toContainText(v);
      await expect(main).not.toContainText(FR_PUBLISHER.siren);
      // Every section is reachable from the contents list, and no key leaked.
      for (const id of spec.sections) {
        await expect(page.locator(`nav a[href="#${id}"]`)).toHaveCount(1);
        await expect(page.locator(`h2#${id}`)).toHaveCount(1);
      }
      await expect(main).not.toContainText('pdfAlgoPro.');
      await expect(main).not.toContainText(/\{[a-zA-Z]+\}/);
    });
  }

  test(`${prefix} support offers a working email link`, async ({ page }) => {
    await page.goto(prefix + PDF_ALGO_PRO.paths.support);
    const mail = page.locator('a[data-support-email]');
    await expect(mail).toHaveText(PDF_ALGO_PRO.supportEmail);
    expect(await mail.getAttribute('href')).toMatch(new RegExp(`^mailto:${PDF_ALGO_PRO.supportEmail}\\?subject=`));
    await expect(page.locator('main')).not.toContainText(/\{[a-zA-Z]+\}/);
    const faq = JSON.parse(
      (await page.locator('script[type="application/ld+json"]').allTextContents()).find((s) => s.includes('FAQPage')) ?? '{}',
    );
    expect(faq.mainEntity).toHaveLength(PDF_ALGO_PRO.faqs.length);
  });

  test(`${prefix} product page links to privacy, terms and support, and the footer links to it`, async ({ page }) => {
    await page.goto(prefix + PDF_ALGO_PRO.paths.product);
    const main = page.locator('main');
    for (const p of ['privacy', 'terms', 'support'] as const) {
      await expect(main.locator(`a[href="${prefix}${PDF_ALGO_PRO.paths[p]}"]`).first()).toBeVisible();
    }
    const icon = main.locator('img[src*="pdf-algo-pro/icon"]');
    await expect.poll(() => icon.evaluate((el) => (el as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
    // Checked from the locale home: on the product page itself the footer's locale switcher links here too.
    await page.goto(prefix);
    await expect(page.locator(`footer a[href="${prefix}${PDF_ALGO_PRO.paths.product}"]`)).toHaveCount(1);
  });
}

test('until the app is on the App Store, the page shows no store link and no price', async ({ page }) => {
  test.skip(PDF_ALGO_PRO.storeStatus === 'live', 'the app is live');
  await page.goto('/au-en/pdf-algo-pro');
  await expect(page.locator('[data-store-status="testflight"]')).toBeVisible();
  await expect(page.locator('a[href*="apps.apple.com"]')).toHaveCount(0);
  const jsonLd = (await page.locator('script[type="application/ld+json"]').allTextContents()).join('\n');
  expect(jsonLd).toContain('SoftwareApplication');
  expect(jsonLd).not.toContain('"offers"');
  expect(jsonLd).not.toContain('aggregateRating');
});

test('legal documents read in full with JavaScript off', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  for (const doc of ['privacy', 'terms'] as const) {
    await page.goto('/au-en' + PDF_ALGO_PRO.paths[doc]);
    for (const id of PDF_ALGO_PRO[doc].sections) await expect(page.locator(`h2#${id}`)).toBeVisible();
  }
  await context.close();
});

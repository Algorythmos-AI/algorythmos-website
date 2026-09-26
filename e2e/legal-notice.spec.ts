/**
 * Legal notice (LCEN art. 6) — e2e.
 *
 * Both publishers, the publication director and the host must render in both
 * locales, straight from src/data/business.ts, and every page's footer must link
 * to the notice. The French privacy policy and terms name the French publisher
 * (and French law); the Australian ones name the company. The French publisher's
 * phone must never reach the schema, which describes ALGORYTHMOS PTY LTD., not
 * the French sole-trader business.
 */
import { test, expect } from '@playwright/test';
import { BUSINESS, FR_PUBLISHER, HOST, PUBLICATION_DIRECTOR } from '../src/data/business';

const LOCALES = [
  { prefix: '/au-en', lang: 'en-AU', h1: 'Legal Notice' },
  { prefix: '/fr-fr', lang: 'fr-FR', h1: 'Mentions légales' },
];

for (const { prefix, lang, h1 } of LOCALES) {
  test(`${prefix}/legal-notice names both publishers, the director and the host`, async ({ page }) => {
    await page.goto(`${prefix}/legal-notice`);
    await expect(page.locator('html')).toHaveAttribute('lang', lang);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(h1);

    const au = page.locator('#publisher-au').locator('xpath=..');
    for (const v of [BUSINESS.legalName, BUSINESS.acn, BUSINESS.abn, 'Level 1, 457–459 Elizabeth Street']) {
      await expect(au).toContainText(v);
    }

    const fr = page.locator('#publisher-fr').locator('xpath=..');
    for (const v of [FR_PUBLISHER.holder, FR_PUBLISHER.siren, FR_PUBLISHER.address, FR_PUBLISHER.phone, FR_PUBLISHER.email]) {
      await expect(fr).toContainText(v);
    }
    // The "EI" marker French law requires beside a sole trader's name (EN and FR wording differ).
    await expect(fr).toContainText(/\bEI\b/);
    await expect(fr.locator(`a[href="tel:${FR_PUBLISHER.phone.replace(/\s+/g, '')}"]`)).toHaveCount(1);
    await expect(fr).toContainText('293 B');

    const main = page.locator('main');
    await expect(main).toContainText(PUBLICATION_DIRECTOR);
    await expect(main).toContainText(HOST.name);
    await expect(main).toContainText(HOST.address);
    await expect(main).toContainText(prefix === '/fr-fr' ? 'États-Unis' : 'United States');
  });

  test(`${prefix} footer links to the legal notice`, async ({ page }) => {
    await page.goto(prefix);
    await expect(page.locator(`footer a[href="${prefix}/legal-notice"]`)).toHaveCount(1);
  });
}

test('the French publisher phone stays out of the structured data', async ({ page }) => {
  await page.goto('/fr-fr/legal-notice');
  const jsonLd = (await page.locator('script[type="application/ld+json"]').allTextContents()).join('\n');
  expect(jsonLd).not.toContain(FR_PUBLISHER.phone.replace(/\s+/g, ''));
  expect(jsonLd).not.toContain(FR_PUBLISHER.phone);
});

test('the French privacy policy and terms name the French publisher and French law', async ({ page }) => {
  for (const path of ['/fr-fr/privacy', '/fr-fr/terms']) {
    await page.goto(path);
    const main = page.locator('main');
    for (const v of [FR_PUBLISHER.holder, FR_PUBLISHER.siren, FR_PUBLISHER.email]) await expect(main, path).toContainText(v);
    for (const gone of ['Pty Ltd', 'ABN', BUSINESS.email, 'Nouvelle-Galles', 'Australian Consumer Law', 'Office of the Australian']) {
      await expect(main, `${path} still mentions ${gone}`).not.toContainText(gone);
    }
  }
  await expect(page.locator('main')).toContainText('droit français');
});

test('the Australian privacy policy and terms still name the company', async ({ page }) => {
  for (const path of ['/au-en/privacy', '/au-en/terms']) {
    await page.goto(path);
    const main = page.locator('main');
    for (const v of ['Algorythmos Pty Ltd', BUSINESS.abn, BUSINESS.email]) await expect(main, path).toContainText(v);
    await expect(main, path).not.toContainText(FR_PUBLISHER.siren);
  }
  await expect(page.locator('main')).toContainText('New South Wales');
});

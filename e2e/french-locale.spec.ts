/**
 * French locale integrity — e2e.
 *
 * Regression guard for English copy leaking onto /fr-fr pages (service cards,
 * consent banner, footer, homepage sections, case studies). Asserts:
 *  - <html lang="fr-FR"> on every FR route
 *  - known English sentinel strings are absent from the rendered FR page
 *  - expected French sentinel strings are present
 *  - the Service JSON-LD on FR service pages carries a French name
 *  - the {year} interpolation in the footer actually resolved
 */
import { test, expect } from '@playwright/test';

const SERVICE_SLUGS = ['agentic-automation', 'document-intelligence', 'sql-dashboards', 'mlops-cicd', 'ai-websites'];
const CASE_STUDY_SLUGS = [
  'port-botany-ai-ml',
  'admin-burden-evidence',
  'healthcare-burden',
  'financial-compliance',
  'manufacturing-docs',
  'healthcare-mlops',
  'retail-sql',
];

const FR_ROUTES = [
  '/fr-fr',
  '/fr-fr/services',
  ...SERVICE_SLUGS.map((s) => `/fr-fr/services/${s}`),
  '/fr-fr/case-studies',
  ...CASE_STUDY_SLUGS.map((s) => `/fr-fr/case-studies/${s}`),
  '/fr-fr/pricing',
  '/fr-fr/blog',
  '/fr-fr/blog/port-botany-document-flows',
  '/fr-fr/about',
  '/fr-fr/contact',
];

/** English copy that used to leak onto FR pages — must never reappear. */
const ENGLISH_SENTINELS = [
  'Autonomous workflows that act',
  'All rights reserved',
  'Why teams choose',
  'Read article',
  'Frequently asked questions',
  'Structured data from messy documents',
  'Metrics your team can trust',
  "What's included",
  'Learn more',
  'We use privacy-friendly, cookieless analytics',
  'The Citable Case for Healthcare',
  'Healthcare Digital Disconnect',
  'Ready to put AI to work',
];

test.describe('FR pages render fully in French', () => {
  for (const route of FR_ROUTES) {
    test(`${route} has lang=fr-FR and no English sentinels`, async ({ page }) => {
      await page.goto(route);
      await expect(page.locator('html')).toHaveAttribute('lang', 'fr-FR');
      const body = await page.locator('body').innerText();
      for (const sentinel of ENGLISH_SENTINELS) {
        expect(body, `English sentinel "${sentinel}" found on ${route}`).not.toContain(sentinel);
      }
    });
  }

  test('/fr-fr/services cards are French', async ({ page }) => {
    await page.goto('/fr-fr/services');
    const body = await page.locator('body').innerText();
    expect(body).toContain('Automatisation Agentique');
    expect(body).toContain('Intelligence Documentaire');
    expect(body).toContain('En savoir plus');
  });

  test('/fr-fr service detail body is French', async ({ page }) => {
    await page.goto('/fr-fr/services/agentic-automation');
    const body = await page.locator('body').innerText();
    expect(body).toContain('Ce qui est inclus');
    expect(body).toContain('Points de validation humaine');
    await expect(page.locator('h1')).toContainText('Automatisation Agentique');
  });

  test('consent banner is French on /fr-fr', async ({ page }) => {
    await page.goto('/fr-fr');
    const consent = page.locator('#consent');
    await expect(consent).toContainText('Nous utilisons des mesures');
    await expect(consent.locator('#consent-decline')).toContainText('Refuser');
    await expect(consent.locator('#consent-accept')).toContainText('Accepter');
  });

  test('footer copyright interpolates the year in French', async ({ page }) => {
    await page.goto('/fr-fr');
    const footer = page.locator('footer');
    await expect(footer).toContainText('Tous droits réservés');
    await expect(footer).toContainText(String(new Date().getFullYear()));
    await expect(footer).not.toContainText('{year}');
  });

  test('translated evidence case study renders French title and body', async ({ page }) => {
    await page.goto('/fr-fr/case-studies/healthcare-burden');
    await expect(page.locator('h1')).toContainText('Déconnexion Numérique');
    const body = await page.locator('body').innerText();
    expect(body).toContain('Défi');
  });

  test('Service JSON-LD is French on FR service pages', async ({ page }) => {
    await page.goto('/fr-fr/services/agentic-automation');
    const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();
    const service = blocks.map((b) => JSON.parse(b)).find((b) => b['@type'] === 'Service');
    expect(service, 'Service JSON-LD block missing').toBeTruthy();
    expect(service.name).toBe('Automatisation Agentique');
    expect(service.description).toContain('Nous concevons');
  });
});

test.describe('EN pages unaffected', () => {
  test('/services still renders the English catalogue', async ({ page }) => {
    await page.goto('/au-en/services');
    const body = await page.locator('body').innerText();
    expect(body).toContain('Agentic Automation');
    expect(body).toContain('Autonomous workflows that act — safely.');
    expect(body).toContain('Learn more');
  });

  test('/ footer + consent are English', async ({ page }) => {
    await page.goto('/au-en');
    await expect(page.locator('footer')).toContainText('All rights reserved');
    await expect(page.locator('#consent')).toContainText('Decline');
  });
});

/**
 * Living product consoles — e2e.
 * Covers: localized render (EN + FR), reduced-motion static baseline,
 * motion-mode story progression, view-transition re-init, and a service
 * console spot-check.
 */
import { test, expect } from '@playwright/test';

const HERO = '[data-console="hero-console"]';

test.describe('hero console', () => {
  test('renders with a localized label and SSR values (EN)', async ({ page }) => {
    await page.goto('/');
    const console_ = page.locator(HERO);
    await console_.scrollIntoViewIfNeeded();
    await expect(console_).toHaveAttribute('aria-label', /Algorythmos AI console/);
    await expect(console_.locator('[data-hc-count]').first()).toHaveText('1,284');
    // inert: nothing focusable inside the screen
    expect(await console_.locator('.hc-screen button, .hc-screen a, .hc-screen [tabindex]').count()).toBe(0);
  });

  test('is fully French on /fr-fr (incl. Intl number formatting)', async ({ page }) => {
    await page.goto('/fr-fr');
    const console_ = page.locator(HERO);
    await console_.scrollIntoViewIfNeeded();
    await expect(console_.locator('.hc-title')).toHaveText("Exécutions d'agents");
    await expect(console_.locator('[data-hc-count]').first()).toHaveText(/^1[\s  ]284$/);
  });

  test('reduced motion → static SSR baseline, no mutations', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    const console_ = page.locator(HERO);
    await console_.scrollIntoViewIfNeeded();
    await page.waitForTimeout(3000);
    await expect(console_.locator('[data-run="contract"] [data-slot="sub"]')).toHaveText('3/5 steps · awaiting approval');
    await expect(console_).not.toHaveClass(/hc-live/);
  });

  test('motion mode → the scripted story advances', async ({ page }) => {
    test.slow();
    await page.goto('/');
    const console_ = page.locator(HERO);
    await console_.scrollIntoViewIfNeeded();
    await expect(console_).toHaveClass(/hc-live/, { timeout: 8000 });
    // t=8s approve beat: contract row updates + stepper advances (loose window, anti-flake)
    await expect(console_.locator('[data-run="contract"] [data-slot="sub"]')).toHaveText('4/5 steps · approved', { timeout: 15000 });
    await expect(console_.locator('[data-hc-stepper]')).toHaveClass(/hc-step-4/);
  });

  test('re-initializes cleanly after client-side navigation', async ({ page }) => {
    await page.goto('/');
    await page.locator(HERO).scrollIntoViewIfNeeded();
    await expect(page.locator(HERO)).toHaveClass(/hc-live/, { timeout: 8000 });
    // navigate away and back through the client router
    await page.getByRole('link', { name: 'Pricing', exact: false }).first().click();
    await page.waitForURL(/pricing/);
    await page.goBack();
    const console_ = page.locator(HERO);
    await console_.scrollIntoViewIfNeeded();
    await expect(console_).toHaveAttribute('data-hc-init', '1', { timeout: 8000 });
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(String(e)));
    await page.waitForTimeout(1500);
    expect(errors).toEqual([]);
  });
});

test.describe('service consoles', () => {
  test('agentic console renders and goes live', async ({ page }) => {
    await page.goto('/services/agentic-automation');
    const console_ = page.locator('[data-console="svc-agentic-automation"]');
    await console_.scrollIntoViewIfNeeded();
    await expect(console_).toHaveClass(/hc-live/, { timeout: 8000 });
    await expect(console_.locator('.ac-title')).toContainText('Contract review');
  });

  test('all five service consoles render their fallback-safe markup', async ({ page }) => {
    for (const slug of ['agentic-automation', 'document-intelligence', 'sql-dashboards', 'mlops-cicd', 'ai-websites']) {
      await page.goto(`/services/${slug}`);
      await expect(page.locator(`[data-console="svc-${slug}"]`)).toHaveCount(1);
    }
  });
});

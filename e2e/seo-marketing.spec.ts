/**
 * E2E coverage for the SEO/marketing hardening: locale routing, consent-gated
 * analytics, contact-form attribution, press page, and landing-page trust UI.
 * Runs against the built output via `astro preview` (see playwright.config).
 */
import { test, expect } from '@playwright/test';

test.describe('locale routing & region banner', () => {
  test('footer local links round-trip to landing pages', async ({ page }) => {
    await page.goto('/au-en');
    await page.locator('footer a[href="/au-en/ai-consultancy-sydney"]').click();
    await expect(page).toHaveURL(/\/au-en\/ai-consultancy-sydney$/);
    await expect(page.locator('h1')).toContainText('AI Consultancy in Sydney');

    await page.goto('/au-en');
    await page.locator('footer a[href="/fr-fr/conseil-en-ia-paris"]').click();
    await expect(page).toHaveURL(/\/fr-fr\/conseil-en-ia-paris$/);
    await expect(page.locator('h1')).toContainText('Conseil en IA à Paris');
  });

  test('FR pages render in French with fr lang attribute', async ({ page }) => {
    await page.goto('/fr-fr/services');
    await expect(page.locator('html')).toHaveAttribute('lang', 'fr-FR');
    await expect(page).toHaveTitle(/Conseil en IA/);
  });

  test('returning-visitor swap fires only on the locale homes with a locale cookie', async ({ page, context }) => {
    await context.addCookies([{ name: 'locale', value: 'fr-fr', url: 'http://localhost:4331' }]);
    await page.goto('/au-en');
    await expect(page).toHaveURL(/\/fr-fr\/?$/);
    // Deeper pages must NOT redirect.
    await page.goto('/au-en/about');
    await expect(page).toHaveURL(/\/au-en\/about$/);
  });
});

test.describe('consent & attribution', () => {
  test('analytics does not load without consent; loads after accept', async ({ page }) => {
    await page.goto('/au-en');
    expect(await page.evaluate(() => (window as never as Record<string, unknown>)['__algAnalytics'])).toBeFalsy();
    await page.locator('#consent-accept').click();
    await expect
      .poll(async () => page.evaluate(() => (window as never as Record<string, unknown>)['__algAnalytics']))
      .toBeTruthy();
    const cookies = await page.context().cookies();
    expect(cookies.find((c) => c.name === 'consent')?.value).toBe('granted');
  });

  test('first-touch UTM params are captured session-scoped and sent with the enquiry', async ({ page }) => {
    await page.goto('/?utm_source=e2e&utm_campaign=harness');
    expect(await page.evaluate(() => sessionStorage.getItem('alg-utm'))).toContain('utm_source=e2e');

    // First-touch: a later navigation must not overwrite it.
    await page.goto('/au-en/contact?utm_source=other');
    expect(await page.evaluate(() => sessionStorage.getItem('alg-utm'))).toContain('utm_source=e2e');

    // Stub the API and confirm the payload carries locale + utm.
    let payload: Record<string, string | number> | undefined;
    await page.route('**/api/contact', async (route) => {
      payload = route.request().postDataJSON();
      await route.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' });
    });
    await page.fill('#cf-name', 'E2E Harness');
    await page.fill('#cf-email', 'e2e@example.com');
    await page.fill('#cf-message', 'This is an automated end-to-end test message.');
    await page.click('#cf-submit');
    await expect(page.locator('#cf-success')).toBeVisible();
    expect(payload?.utm).toContain('utm_source=e2e');
    expect(payload?.locale).toBe('en-AU');
    // Fill time is sent as a clock-free duration, never a wall-clock timestamp.
    expect(typeof payload?.elapsedMs).toBe('number');
    expect(Number(payload?.elapsedMs)).toBeGreaterThan(0);
    expect(payload).not.toHaveProperty('ts');
    expect(payload?.leave_blank).toBe('');
  });
});

test.describe('trust & PR surfaces', () => {
  test('press page renders in both locales with media contact', async ({ page }) => {
    for (const [path, heading] of [
      ['/au-en/press', 'Press kit'],
      ['/fr-fr/press', 'Kit presse'],
    ] as const) {
      await page.goto(path);
      await expect(page.locator('h1')).toContainText(heading);
      await expect(page.locator('a[href^="mailto:"]').first()).toBeVisible();
    }
  });

  test('landing pages show compliance badges and stat-rich content', async ({ page }) => {
    await page.goto('/au-en/ai-consultancy-sydney');
    await expect(page.getByText('Australian Privacy Principles').first()).toBeVisible();
    await page.goto('/fr-fr/conseil-en-ia-paris');
    await expect(page.getByText('EU AI Act').first()).toBeVisible();
  });

  test('case study shows headline stat band (EN + FR)', async ({ page }) => {
    await page.goto('/au-en/case-studies/healthcare-mlops');
    await expect(page.getByText('Faster deployments through automated CI/CD', { exact: true })).toBeVisible();
    await page.goto('/fr-fr/case-studies/healthcare-mlops');
    await expect(page.getByText('Déploiements plus rapides grâce au CI/CD automatisé', { exact: true })).toBeVisible();
  });
});

test.describe('photography', () => {
  const photoPages = [
    { path: '/au-en', base: 'team-collaboration' },
    { path: '/au-en/about', base: 'team-sunlit' },
    { path: '/au-en/careers', base: 'modern-office' },
    { path: '/au-en/ai-consultancy-sydney', base: 'sydney-scene' },
    { path: '/fr-fr/conseil-en-ia-paris', base: 'paris-scene' },
  ];

  for (const { path, base } of photoPages) {
    test(`photo on ${path} decodes with alt text and no layout overflow`, async ({ page }) => {
      await page.goto(path);
      const img = page.locator(`img[src*="${base}"]`);
      await img.scrollIntoViewIfNeeded();
      await expect(img).toBeVisible();
      // Image must actually decode (not a broken src) and carry a real alt.
      await expect.poll(() => img.evaluate((el) => (el as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
      expect((await img.getAttribute('alt'))?.length).toBeGreaterThan(10);
      expect(await img.getAttribute('srcset')).toContain('1600w');

      // Mobile: no horizontal overflow introduced by the photo layout.
      await page.setViewportSize({ width: 375, height: 812 });
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(overflow).toBeLessThanOrEqual(0);
    });
  }
});

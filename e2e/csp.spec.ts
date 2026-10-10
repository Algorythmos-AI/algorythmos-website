/**
 * Content-Security-Policy — e2e.
 *
 * The policy is set by Vercel (vercel.json), which neither `astro preview` nor any
 * other gate applies, so a script that needs something it forbids would only fail
 * in production. This serves the built pages with that exact policy and fails on
 * any violation — including while a 3D scene is being fetched, compiled and drawn.
 */
import { test, expect, type Page } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { MOUNT, forceScene, hasWebgl2 } from './helpers/scene3d';

interface HeaderRule {
  headers: { key: string; value: string }[];
}
const vercel = JSON.parse(readFileSync(join(process.cwd(), 'vercel.json'), 'utf8')) as { headers: HeaderRule[] };
const declared = vercel.headers.flatMap((rule) => rule.headers).find((h) => h.key.toLowerCase() === 'content-security-policy');
/* `upgrade-insecure-requests` would rewrite this http://localhost origin to https and
   break every asset; it restricts nothing, so it is the one directive left out here. */
const CSP = (declared?.value ?? '')
  .split(';')
  .map((d) => d.trim())
  .filter((d) => d && d !== 'upgrade-insecure-requests')
  .join('; ');

async function underCsp(page: Page): Promise<() => Promise<string[]>> {
  await page.route('**/*', async (route) => {
    if (route.request().resourceType() !== 'document') return route.continue();
    const response = await route.fetch();
    await route.fulfill({ response, headers: { ...response.headers(), 'content-security-policy': CSP } });
  });
  await page.addInitScript(() => {
    const w = window as unknown as { __csp: string[] };
    w.__csp = [];
    document.addEventListener('securitypolicyviolation', (e) => {
      w.__csp.push(`${e.violatedDirective} blocked ${e.blockedURI || 'inline'}`);
    });
  });
  return () => page.evaluate(() => (window as unknown as { __csp: string[] }).__csp);
}

test('vercel.json declares a policy that still forbids eval, WASM and blob scripts', () => {
  expect(CSP).toContain("script-src 'self'");
  expect(CSP).not.toContain("'unsafe-eval'");
  expect(CSP).not.toContain('wasm-unsafe-eval');
  expect(CSP).not.toMatch(/script-src[^;]*blob:/);
});

for (const path of ['/au-en', '/fr-fr/services/agentic-automation', '/au-en/blog/mlops-production']) {
  test(`${path} loads without a policy violation`, async ({ page }) => {
    const violations = await underCsp(page);
    await page.goto(path);
    await page.mouse.wheel(0, 3000);
    await page.waitForTimeout(2500);
    expect(await violations()).toEqual([]);
  });
}

test('client-side navigation stays inside the policy', async ({ page }) => {
  const violations = await underCsp(page);
  await page.goto('/au-en/pricing');
  await page.getByRole('link', { name: 'Services', exact: false }).first().click();
  await page.waitForURL(/\/services$/);
  await page.goBack();
  await page.waitForURL(/\/pricing$/);
  await page.locator('header a[href="/au-en"]').first().click();
  await page.waitForURL(/\/au-en$/);
  await page.waitForTimeout(1500);
  expect(await violations()).toEqual([]);
});

test('a 3D scene loads, compiles and runs inside the policy', async ({ page }) => {
  test.setTimeout(120_000);
  test.skip(!(await hasWebgl2(page)), 'this browser build cannot create a WebGL2 context, even in software');
  const violations = await underCsp(page);
  await forceScene(page);
  await page.goto('/au-en');
  await expect(page.locator(MOUNT).first()).toHaveAttribute('data-scene-state', 'live', { timeout: 60_000 });
  await page.waitForTimeout(1500);
  expect(await violations()).toEqual([]);
});

/**
 * Motion contract — e2e.
 * The pause toggle must reach every animation: the ones already running when it
 * is pressed (hero orb, particle field) and the ones built afterwards (charts).
 */
import { test, expect } from '@playwright/test';

test.describe('pause toggle', () => {
  test('stops the hero orb and the particle field at once, and they stay stopped', async ({ page }) => {
    await page.goto('/au-en');
    const orb = page.locator('[data-neural-orb]');
    const field = page.locator('[data-neural-field]');
    await expect(orb).toHaveAttribute('data-orb-state', 'live', { timeout: 8000 });
    await expect(field).toHaveAttribute('data-field-state', 'live', { timeout: 8000 });

    await page.locator('[data-motion-toggle]:visible').first().click();
    await expect(page.locator('html')).toHaveAttribute('data-motion', 'off');
    await expect(orb).toHaveAttribute('data-orb-state', 'static');
    await expect(field).toHaveAttribute('data-field-state', 'static');

    // Leaving and re-entering the viewport used to restart the loops.
    await page.mouse.wheel(0, 2400);
    await page.waitForTimeout(400);
    await page.mouse.wheel(0, -2400);
    await page.waitForTimeout(800);
    await expect(orb).toHaveAttribute('data-orb-state', 'static');
    await expect(field).toHaveAttribute('data-field-state', 'static');
  });

  test('is honoured by charts, not only the OS setting', async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('motion', 'off'));
    await page.goto('/au-en/blog/mlops-production');
    const chart = page.locator('main figure[role="img"]').first();
    await chart.scrollIntoViewIfNeeded();
    await expect(chart).toHaveAttribute('data-chart-motion', 'off', { timeout: 8000 });
  });

  test('leaves charts animated while motion is on', async ({ page }) => {
    await page.goto('/au-en/blog/mlops-production');
    const chart = page.locator('main figure[role="img"]').first();
    await chart.scrollIntoViewIfNeeded();
    await expect(chart).toHaveAttribute('data-chart-motion', 'on', { timeout: 8000 });
  });
});

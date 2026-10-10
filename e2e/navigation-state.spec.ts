/**
 * Page state across client-side navigation — e2e.
 * The client router replaces every attribute on <html> with the incoming
 * document's, so anything a script put there (theme, reveal marker, pause) has
 * to be restored on each swap. These pin that it is.
 */
import { test, expect, type Page } from '@playwright/test';

/** Navigate through the client router and prove the document was swapped, not reloaded. */
async function clientNavigate(page: Page, linkName: string, url: RegExp) {
  await page.evaluate(() => {
    (window as unknown as { __sameDocument?: boolean }).__sameDocument = true;
  });
  await page.getByRole('link', { name: linkName, exact: false }).first().click();
  await page.waitForURL(url);
  const same = await page.evaluate(() => (window as unknown as { __sameDocument?: boolean }).__sameDocument === true);
  expect(same, 'navigation went through the client router').toBe(true);
}

test.describe('in-site navigation keeps page state', () => {
  test.describe('light-mode visitor who never used the theme toggle', () => {
    test.use({ colorScheme: 'light' });

    test('stays on the light theme after navigating', async ({ page }) => {
      await page.goto('/au-en');
      const html = page.locator('html');
      await expect(html).toHaveAttribute('data-theme', 'light');
      expect(await page.evaluate(() => localStorage.getItem('theme'))).toBeNull();

      await clientNavigate(page, 'Pricing', /\/pricing$/);
      await expect(html).toHaveAttribute('data-theme', 'light');
      // The token the whole palette hangs off must be the light one, not the dark default.
      const bg = await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--bg').trim());
      expect(bg).toBe('250 250 249');
    });
  });

  test('scroll reveals keep working after navigating', async ({ page }) => {
    await page.goto('/au-en');
    await expect(page.locator('html')).toHaveClass(/(^|\s)js(\s|$)/);

    await clientNavigate(page, 'Pricing', /\/pricing$/);
    // Without the marker the reveal styles never apply and nothing animates in.
    await expect(page.locator('html')).toHaveClass(/(^|\s)js(\s|$)/);
    await expect(page.locator('main [data-reveal]').first()).toHaveClass(/is-visible/);
  });

  test('a pause survives navigation', async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('motion', 'off'));
    await page.goto('/au-en');
    await expect(page.locator('html')).toHaveAttribute('data-motion', 'off');
    await clientNavigate(page, 'Pricing', /\/pricing$/);
    await expect(page.locator('html')).toHaveAttribute('data-motion', 'off');
  });
});

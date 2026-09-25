/**
 * Automated accessibility gate (axe-core) on the key templates in both locales
 * and both colour schemes. Fails on serious/critical violations.
 *
 * Motion is switched off (the site's own "pause motion" preference + the OS
 * reduced-motion query) so scroll-reveal opacity never blends foreground and
 * background colours mid-transition — that produced false 1.0:1 contrast
 * results, not real defects.
 */
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const PAGES = [
  '/au-en',
  '/au-en/services/document-intelligence',
  '/au-en/case-studies/port-botany-ai-ml',
  '/au-en/contact',
  '/au-en/pricing',
  '/fr-fr',
  '/fr-fr/services/document-intelligence',
  '/fr-fr/contact',
];
const SCHEMES = ['light', 'dark'] as const;

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    try {
      localStorage.setItem('motion', 'off');
    } catch {}
  });
});

for (const scheme of SCHEMES) {
  for (const path of PAGES) {
    test(`no serious or critical axe violations on ${path} (${scheme})`, async ({ page }) => {
      await page.emulateMedia({ colorScheme: scheme, reducedMotion: 'reduce' });
      await page.addInitScript((s) => {
        try {
          localStorage.setItem('theme', s);
        } catch {}
      }, scheme);
      await page.goto(path);
      // Dismiss the consent strip so it does not overlap the content under test.
      await page.locator('#consent-decline').click({ timeout: 5000 }).catch(() => {});
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
        // Product-mockup consoles are aria-hidden role=img by design.
        .exclude('[data-console]')
        .analyze();
      const serious = results.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
      const summary = serious
        .map((v) => `${v.id} (${v.impact}): ${v.help}\n` + v.nodes.slice(0, 5).map((n) => `    ${n.target.join(' ')} — ${n.failureSummary?.split('\n')[1] ?? ''}`).join('\n'))
        .join('\n');
      expect(serious.length, summary).toBe(0);
    });
  }
}

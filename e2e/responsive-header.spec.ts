/**
 * The header must fit on one row at every width, in both locales.
 *
 * Regressions this guards against (seen live on 26 Sep 2026):
 *   - EN "Case Studies" wrapping to two lines at 820 and 1024px;
 *   - FR hyphenating the logo ("Algo-rythmos") and nav ("SER-VICES") at 1024px;
 *   - the right-hand cluster being clipped off-screen. `body { overflow-x: clip }`
 *     hides that from scrollWidth, so every control's box is checked directly.
 *
 * Runs on desktop Chromium and WebKit, resizing the viewport per case.
 */
import { test, expect } from '@playwright/test';

const WIDTHS = [320, 360, 375, 768, 820, 1024, 1120, 1280, 1440];
/** Must match `screens.nav` in tailwind.config.js — the desktop nav shows from here. */
const NAV_BREAKPOINT = 1120;
const LOCALES = [
  { path: '/au-en', label: 'EN' },
  { path: '/fr-fr', label: 'FR' },
];

test.beforeEach(async ({ page, context }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.addInitScript(() => {
    try {
      localStorage.setItem('motion', 'off');
    } catch {}
  });
  // Keep the consent strip out of the way; it has its own spec.
  await context.addCookies([{ name: 'consent', value: 'denied', url: 'http://localhost:4331' }]);
});

for (const { path, label } of LOCALES) {
  for (const width of WIDTHS) {
    test(`${label} header fits on one row at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(path);
      await page.evaluate(() => document.fonts.ready);

      const m = await page.evaluate(() => {
        const header = document.querySelector('[data-header]') as HTMLElement;
        const vw = document.documentElement.clientWidth;
        const shown = (el: Element) => {
          const r = el.getBoundingClientRect();
          return r.width > 0 && r.height > 0 && getComputedStyle(el).visibility !== 'hidden';
        };
        const controls = Array.from(header.querySelectorAll('a, button, summary')).filter(
          (el) => shown(el) && !el.closest('.menu-panel'),
        );
        const clipped = controls
          .filter((el) => {
            const r = el.getBoundingClientRect();
            return r.right > vw + 0.5 || r.left < -0.5;
          })
          .map((el) => (el.getAttribute('aria-label') || el.textContent || el.tagName).trim().slice(0, 40));
        const navLinks = Array.from(header.querySelectorAll('[data-magic-nav] a')).filter(shown);
        const tallLinks = navLinks
          .filter((a) => a.getBoundingClientRect().height > 40)
          .map((a) => (a.textContent || '').trim());
        const logo = header.querySelector('a[class*="group/logo"]') as HTMLElement;
        const hamburger = header.querySelector('[data-mobile-menu] summary') as HTMLElement;
        const compactLocales = Array.from(header.querySelectorAll('[data-locale]')).filter(
          (el) => shown(el) && !el.closest('.menu-panel'),
        );
        return {
          headerHeight: header.getBoundingClientRect().height,
          clipped,
          visibleNavLinks: navLinks.length,
          tallLinks,
          logoHeight: logo.getBoundingClientRect().height,
          hamburgerShown: shown(hamburger),
          compactLocales: compactLocales.length,
        };
      });

      expect(m.headerHeight, 'header height').toBeLessThanOrEqual(72);
      expect(m.clipped, 'controls outside the viewport').toEqual([]);
      expect(m.tallLinks, 'nav links wrapped onto two lines').toEqual([]);
      expect(m.logoHeight, 'logo on one line').toBeLessThanOrEqual(40);

      if (width >= NAV_BREAKPOINT) {
        expect(m.visibleNavLinks, 'desktop nav visible').toBe(5);
        expect(m.hamburgerShown, 'hamburger hidden on desktop').toBe(false);
        expect(m.compactLocales, 'locale switcher in the header').toBeGreaterThanOrEqual(2);
      } else {
        expect(m.visibleNavLinks, 'desktop nav hidden').toBe(0);
        expect(m.hamburgerShown, 'hamburger shown').toBe(true);
        // The locale switcher must still be reachable: it lives in the menu here.
        await page.locator('[data-mobile-menu] summary').click();
        const menuLocales = page.locator('.menu-panel [data-locale]');
        await expect(menuLocales).toHaveCount(2);
        await expect(menuLocales.first()).toBeVisible();
        await expect(menuLocales.last()).toBeInViewport();
      }
    });
  }
}

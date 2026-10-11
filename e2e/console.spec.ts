/**
 * Living product consoles — e2e.
 * Covers: localized render (EN + FR), reduced-motion static baseline,
 * motion-mode story progression, view-transition re-init, and a service
 * console spot-check.
 */
import { test, expect } from '@playwright/test';
import { serviceSlugs as SERVICE_SLUGS } from '../src/data/services';

const HERO = '[data-console="hero-console"]';

// Regression guard for the iOS-Safari clip bug: at phone width the console must
// scale/reflow to fit, never render at its 1280/1120 canvas width, and no page
// must scroll horizontally.
test.describe('mobile (phone viewport)', () => {
  test.use({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true });

  test('hero console fits the phone (no clip) and does not cause horizontal scroll', async ({ page }) => {
    await page.goto('/au-en');
    const console_ = page.locator(HERO);
    await console_.evaluate((el) => el.scrollIntoView({ block: 'center' }));
    await page.waitForTimeout(600);
    const r = await page.evaluate(() => {
      const root = document.querySelector('[data-console="hero-console"]')!;
      const screen = root.querySelector('.hc-screen')!;
      return {
        screenW: Math.round(screen.getBoundingClientRect().width),
        innerW: window.innerWidth,
        docScrollW: document.documentElement.scrollWidth,
      };
    });
    expect(r.screenW).toBeLessThanOrEqual(r.innerW + 1); // NOT 1280 → not clipped
    expect(r.docScrollW).toBeLessThanOrEqual(r.innerW + 1); // no horizontal scroll
  });

  test('no page scrolls horizontally', async ({ page }) => {
    for (const path of ['/au-en', '/fr-fr', ...SERVICE_SLUGS.map((s) => `/au-en/services/${s}`)]) {
      await page.goto(path);
      await page.waitForTimeout(300);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(overflow, `horizontal overflow on ${path}`).toBeLessThanOrEqual(1);
    }
  });

  test('"Four disciplines" shows all four tabs within the viewport', async ({ page }) => {
    await page.goto('/au-en');
    await page.locator('[data-blueprint]').scrollIntoViewIfNeeded();
    const within = await page.evaluate(() => {
      const tabs = [...document.querySelectorAll('[role="tab"][data-bp-tab]')];
      return { count: tabs.length, allWithin: tabs.every((t) => t.getBoundingClientRect().right <= window.innerWidth + 1) };
    });
    expect(within.count).toBe(4);
    expect(within.allWithin).toBe(true);
  });

  test('service consoles fit the phone', async ({ page }) => {
    for (const slug of SERVICE_SLUGS) {
      await page.goto(`/au-en/services/${slug}`);
      const console_ = page.locator(`[data-console="svc-${slug}"]`);
      await console_.evaluate((el) => el.scrollIntoView({ block: 'center' }));
      await page.waitForTimeout(300);
      const w = await console_.locator('.hc-screen').evaluate((el) => Math.round(el.getBoundingClientRect().width));
      expect(w, slug).toBeLessThanOrEqual(page.viewportSize()!.width + 1);
    }
  });
});

test.describe('hero console', () => {
  test('renders with a localized label and SSR values (EN)', async ({ page }) => {
    await page.goto('/au-en');
    const console_ = page.locator(HERO);
    await console_.evaluate((el) => el.scrollIntoView({ block: 'center' }));
    await expect(console_).toHaveAttribute('aria-label', /Algorythmos AI console/);
    await expect(console_.locator('[data-hc-count]').first()).toHaveText('1,284');
    // inert: nothing focusable inside the screen
    expect(await console_.locator('.hc-screen button, .hc-screen a, .hc-screen [tabindex]').count()).toBe(0);
  });

  test('is fully French on /fr-fr (incl. Intl number formatting)', async ({ page }) => {
    await page.goto('/fr-fr');
    const console_ = page.locator(HERO);
    await console_.evaluate((el) => el.scrollIntoView({ block: 'center' }));
    await expect(console_.locator('.hc-title')).toHaveText("Exécutions d'agents");
    await expect(console_.locator('[data-hc-count]').first()).toHaveText(/^1[\s  ]284$/);
  });

  test('reduced motion → static SSR baseline, no mutations', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/au-en');
    const console_ = page.locator(HERO);
    await console_.evaluate((el) => el.scrollIntoView({ block: 'center' }));
    await page.waitForTimeout(3000);
    await expect(console_.locator('[data-run="contract"] [data-slot="sub"]')).toHaveText('3/5 steps · awaiting approval');
    await expect(console_).not.toHaveClass(/hc-live/);
  });

  test('motion mode → the scripted story advances', async ({ page }) => {
    test.slow();
    await page.goto('/au-en');
    const console_ = page.locator(HERO);
    await console_.evaluate((el) => el.scrollIntoView({ block: 'center' }));
    await expect(console_).toHaveClass(/hc-live/, { timeout: 8000 });
    // t=8s approve beat: contract row updates + stepper advances (loose window, anti-flake)
    await expect(console_.locator('[data-run="contract"] [data-slot="sub"]')).toHaveText('4/5 steps · approved', { timeout: 15000 });
    await expect(console_.locator('[data-hc-stepper]')).toHaveClass(/hc-step-4/);
  });

  test('pausing motion mid-session freezes a running console', async ({ page }) => {
    test.slow();
    await page.goto('/au-en');
    const console_ = page.locator(HERO);
    await console_.evaluate((el) => el.scrollIntoView({ block: 'center' }));
    await expect(console_).toHaveClass(/hc-live/, { timeout: 8000 });
    await page.locator('[data-motion-toggle]:visible').first().click();
    await expect(page.locator('html')).toHaveAttribute('data-motion', 'off');
    // The story's approve beat fires at t≈8s; with motion paused it must never land.
    await page.waitForTimeout(12000);
    await expect(console_.locator('[data-run="contract"] [data-slot="sub"]')).toHaveText('3/5 steps · awaiting approval');
  });

  test('re-initializes cleanly after client-side navigation', async ({ page }) => {
    await page.goto('/au-en');
    await page.locator(HERO).scrollIntoViewIfNeeded();
    await expect(page.locator(HERO)).toHaveClass(/hc-live/, { timeout: 8000 });
    // navigate away and back through the client router
    await page.getByRole('link', { name: 'Pricing', exact: false }).first().click();
    await page.waitForURL(/pricing/);
    await page.goBack();
    const console_ = page.locator(HERO);
    await console_.evaluate((el) => el.scrollIntoView({ block: 'center' }));
    await expect(console_).toHaveAttribute('data-hc-init', '1', { timeout: 8000 });
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(String(e)));
    await page.waitForTimeout(1500);
    expect(errors).toEqual([]);
  });
});

test.describe('service consoles', () => {
  test('agentic console renders and goes live', async ({ page }) => {
    await page.goto('/au-en/services/agentic-automation');
    const console_ = page.locator('[data-console="svc-agentic-automation"]');
    await console_.evaluate((el) => el.scrollIntoView({ block: 'center' }));
    await expect(console_).toHaveClass(/hc-live/, { timeout: 8000 });
    await expect(console_.locator('.ac-title')).toContainText('Contract review');
  });

  test('every service console renders its fallback-safe markup', async ({ page }) => {
    for (const slug of SERVICE_SLUGS) {
      await page.goto(`/au-en/services/${slug}`);
      await expect(page.locator(`[data-console="svc-${slug}"]`)).toHaveCount(1);
    }
  });
});

// The shared window bar (real logo + wordmark) and the operator overlay
// (pointer + notification) added to every console.
test.describe('console brand and operator overlay', () => {
  const ALL = [
    { path: '/au-en', name: 'hero-console' },
    ...SERVICE_SLUGS.map((slug) => ({ path: `/au-en/services/${slug}`, name: `svc-${slug}` })),
  ];

  test('every console shows the real Algorythmos mark and wordmark', async ({ page }) => {
    test.slow();
    for (const { path, name } of ALL) {
      await page.goto(path);
      const console_ = page.locator(`[data-console="${name}"]`);
      await console_.evaluate((el) => el.scrollIntoView({ block: 'center' }));
      // the hero carries a second, phone-only mark in its window bar — assert the shown one
      const logo = console_.locator('.hc-logo:visible').first();
      await expect(logo, `${name}: logo visible`).toBeVisible();
      // decoded, not a broken image
      await expect
        .poll(() => logo.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0), { timeout: 8000 })
        .toBe(true);
      await expect(console_.locator('.hc-wordmark:visible').first()).toHaveText('Algorythmos');
    }
  });

  test('the pointer lands on the control it presses and a notification confirms it', async ({ page }) => {
    test.slow();
    await page.goto('/au-en/services/agentic-automation');
    const console_ = page.locator('[data-console="svc-agentic-automation"]');
    await console_.evaluate((el) => el.scrollIntoView({ block: 'center' }));
    const cursor = console_.locator('[data-hc-cursor]');
    await expect(cursor).toHaveClass(/hc-on/, { timeout: 15000 });
    await page.waitForTimeout(1500); // glide transition (1.1s) settles
    // The arrow's tip is the cursor box's top-left corner: it must sit inside the
    // button. This is the check that the canvas maths holds under each engine's zoom.
    const tip = await cursor.boundingBox();
    const btn = await console_.locator('[data-slot="approve"]').boundingBox();
    expect(tip && btn).toBeTruthy();
    expect(tip!.x).toBeGreaterThanOrEqual(btn!.x);
    expect(tip!.x).toBeLessThanOrEqual(btn!.x + btn!.width);
    expect(tip!.y).toBeGreaterThanOrEqual(btn!.y);
    expect(tip!.y).toBeLessThanOrEqual(btn!.y + btn!.height);

    const toast = console_.locator('[data-hc-toast]');
    await expect(toast).toHaveClass(/hc-on/, { timeout: 15000 });
    await expect(toast.locator('[data-hc-toast-title]')).toHaveText('Human approval');
    await expect(toast.locator('[data-hc-toast-body]')).toHaveText('approved by reviewer');
    // readable: light text on the dark toast, not the page's ink colour
    const color = await toast.locator('[data-hc-toast-title]').evaluate((el) => getComputedStyle(el).color);
    expect(color).toBe('rgb(243, 243, 248)');
  });

  test('reduced motion → no pointer and no notification, ever', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/au-en/services/agentic-automation');
    const console_ = page.locator('[data-console="svc-agentic-automation"]');
    await console_.evaluate((el) => el.scrollIntoView({ block: 'center' }));
    await page.waitForTimeout(9000); // past the pointer (4.6s) and approve (7s) beats
    await expect(console_.locator('[data-hc-cursor]')).not.toHaveClass(/hc-on/);
    await expect(console_.locator('[data-hc-toast]')).not.toHaveClass(/hc-on/);
    await expect(console_.locator('[data-hc-cursor]')).toHaveCSS('opacity', '0');
    await expect(console_.locator('[data-hc-toast]')).toHaveCSS('opacity', '0');
  });

  test('pausing motion removes a pointer that is already on screen', async ({ page }) => {
    test.slow();
    await page.goto('/au-en/services/agentic-automation');
    const console_ = page.locator('[data-console="svc-agentic-automation"]');
    await console_.evaluate((el) => el.scrollIntoView({ block: 'center' }));
    await expect(console_.locator('[data-hc-cursor]')).toHaveClass(/hc-on/, { timeout: 15000 });
    await page.locator('[data-motion-toggle]:visible').first().click();
    await expect(page.locator('html')).toHaveAttribute('data-motion', 'off');
    await expect(console_.locator('.hc-overlay')).toBeHidden();
  });

  test('phones get no pointer or floating notification', async ({ browser }) => {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
    const page = await ctx.newPage();
    await page.goto('/au-en');
    await expect(page.locator(`${HERO} .hc-overlay`)).toBeHidden();
    // the sidebar (and its brand) is gone on phones — the window bar carries the mark
    await expect(page.locator(`${HERO} .hc-chrome .hc-logo`)).toBeVisible();
    await ctx.close();
  });
});

// Without JS the scaled canvas must get out of the way so each console's
// <noscript> SVG fills its frame. toBeVisible() ignores overflow clipping, so
// assert geometry: the fallback sits inside the viewport box.
test.describe('consoles without JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  for (const [path, name] of [
    ['/au-en', 'hero-console'],
    ['/au-en/services/mlops-cicd', 'svc-mlops-cicd'],
  ] as const) {
    test(`${path} shows the static fallback inside the console frame`, async ({ page }) => {
      await page.goto(path);
      const viewport = page.locator(`[data-console="${name}"]`);
      await expect(viewport.locator('.hc-screen')).toHaveCSS('display', 'none');
      const img = viewport.locator('img.hc-fallback');
      await expect(img).toHaveCount(1);
      const [v, i] = await Promise.all([viewport.boundingBox(), img.boundingBox()]);
      expect(v && i).toBeTruthy();
      expect(i!.y).toBeGreaterThanOrEqual(v!.y - 1);
      expect(i!.y + i!.height).toBeLessThanOrEqual(v!.y + v!.height + 1);
      expect(i!.height).toBeGreaterThan(100);
    });
  }
});

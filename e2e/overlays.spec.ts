/**
 * Overlays (mobile menu, consent strip, region banner) must be fully opaque and
 * must never hide the content a visitor is working with.
 *
 * Seen live on 26 Sep 2026 at 375px: the open menu computed rgba(8,8,12,0.95)
 * plus a nested backdrop blur, and the hero H1 was plainly readable through it.
 * The consent strip (5% white "glass") covered the contact form. So opacity is
 * asserted as exactly 1 — 0.95 is the broken state — and a pixel check proves
 * nothing shows through, whatever the computed style says.
 *
 * Runs on all four projects; desktop projects are resized to a 375px phone.
 */
import { test, expect, type Page, type BrowserContext } from '@playwright/test';
import sharp from 'sharp';

const ORIGIN = 'http://localhost:4331';
const LOCALES = [
  { path: '/au-en', label: 'EN' },
  { path: '/fr-fr', label: 'FR' },
];

function alphaOf(color: string): number {
  const m = color.match(/rgba?\(([^)]+)\)/);
  if (!m) return Number.NaN;
  const parts = m[1].split(/[\s,/]+/).filter(Boolean);
  return parts.length === 4 ? Number.parseFloat(parts[3]) : 1;
}

async function asPhone(page: Page) {
  const vp = page.viewportSize();
  if (!vp || vp.width > 500) await page.setViewportSize({ width: 375, height: 812 });
}

async function calm(page: Page) {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.addInitScript(() => {
    try {
      localStorage.setItem('motion', 'off');
    } catch {}
  });
}

async function denyConsent(context: BrowserContext) {
  await context.addCookies([{ name: 'consent', value: 'denied', url: ORIGIN }]);
}

async function openMenu(page: Page) {
  await page.locator('[data-mobile-menu] summary').click();
  await expect(page.locator('.menu-panel')).toBeVisible();
}

for (const { path, label } of LOCALES) {
  test.describe(`${label} mobile menu`, () => {
    test.beforeEach(async ({ page, context }) => {
      await calm(page);
      await denyConsent(context);
      await asPhone(page);
    });

    test('panel is opaque and neither it nor any ancestor has a backdrop filter', async ({ page }) => {
      await page.goto(path);
      await openMenu(page);
      const style = await page.locator('.menu-panel').evaluate((el) => {
        const filterOf = (node: Element) => {
          const cs = getComputedStyle(node) as CSSStyleDeclaration & { webkitBackdropFilter?: string };
          const f = cs.backdropFilter || cs.webkitBackdropFilter || 'none';
          return f === 'none' ? null : f;
        };
        // An ancestor's backdrop-filter is the real culprit: GPU-composited Chromium then
        // paints the overflowing panel see-through, which headless screenshots don't show.
        const filtered: string[] = [];
        for (let n: Element | null = el; n; n = n.parentElement) {
          const f = filterOf(n);
          if (f) filtered.push(`${n.tagName.toLowerCase()}.${String(n.className).split(' ')[0]} (${f})`);
        }
        return { bg: getComputedStyle(el).backgroundColor, filtered };
      });
      expect(alphaOf(style.bg), `menu background ${style.bg}`).toBe(1);
      expect(style.filtered, 'backdrop-filter on the panel or an ancestor').toEqual([]);
    });

    test('the page behind the open menu is fully covered', async ({ page }) => {
      await page.goto(path);
      await openMenu(page);
      const hit = await page.evaluate(() => {
        const panel = document.querySelector('.menu-panel') as HTMLElement;
        const h1 = document.querySelector('main h1') as HTMLElement;
        const p = panel.getBoundingClientRect();
        const h = h1.getBoundingClientRect();
        // A point inside both the panel and the H1 when they overlap, else the panel's centre.
        const left = Math.max(p.left, h.left);
        const right = Math.min(p.right, h.right);
        const top = Math.max(p.top, h.top);
        const bottom = Math.min(p.bottom, h.bottom);
        const overlap = right > left && bottom > top;
        const x = overlap ? (left + right) / 2 : (p.left + p.right) / 2;
        const y = overlap ? (top + bottom) / 2 : (p.top + p.bottom) / 2;
        const top1 = document.elementFromPoint(x, y);
        return { insidePanel: !!top1?.closest('.menu-panel') };
      });
      expect(hit.insidePanel, 'topmost element over the H1 belongs to the menu').toBe(true);
    });

    test('no pixel of the page shows through the menu', async ({ page }) => {
      await page.goto(path);
      // A magenta sheet under the header (z 1 < --z-nav 300): any translucency in the
      // panel turns its pixels pink.
      await page.evaluate(() => {
        const sheet = document.createElement('div');
        sheet.setAttribute('data-test-sheet', '');
        sheet.style.cssText = 'position:fixed;inset:0;z-index:1;background:rgb(255,0,255);pointer-events:none';
        document.body.appendChild(sheet);
      });
      await openMenu(page);
      const { clip, bg } = await page.evaluate(() => {
        const r = (document.querySelector('.menu-panel') as HTMLElement).getBoundingClientRect();
        const channels = getComputedStyle(document.documentElement)
          .getPropertyValue('--bg')
          .trim()
          .split(/\s+/)
          .map(Number);
        // The panel's top padding strip: plain background, no text, clear of the header border.
        return { clip: { x: r.left + 4, y: r.top + 4, width: r.width - 8, height: 8 }, bg: channels };
      });
      const png = await page.screenshot({ clip, animations: 'disabled' });
      const { data, info } = await sharp(png).removeAlpha().raw().toBuffer({ resolveWithObject: true });
      let worst = 0;
      for (let i = 0; i < info.width * info.height * 3; i += 3) {
        worst = Math.max(worst, Math.abs(data[i] - bg[0]), Math.abs(data[i + 1] - bg[1]), Math.abs(data[i + 2] - bg[2]));
      }
      expect(worst, `max channel distance from --bg ${bg.join(' ')}`).toBeLessThanOrEqual(2);
    });
  });

  test.describe(`${label} consent strip`, () => {
    test.beforeEach(async ({ page }) => {
      await calm(page);
      await asPhone(page);
    });

    test('is opaque and reserves its own height', async ({ page }) => {
      await page.goto(path);
      const consent = page.locator('#consent');
      await expect(consent).toBeVisible();
      const bg = await consent.evaluate((el) => getComputedStyle(el).backgroundColor);
      expect(alphaOf(bg), `consent background ${bg}`).toBe(1);
      // Polled: with motion reduced, the site's kill switch gives every property a
      // 0.01ms transition, so a computed style read in the same frame is stale.
      await expect
        .poll(() =>
          consent.evaluate((el) =>
            Math.abs(Number.parseFloat(getComputedStyle(document.body).paddingBottom) - el.getBoundingClientRect().height),
          ),
        { message: 'body padding matches the strip' })
        .toBeLessThanOrEqual(1);
    });

    test('never covers a focused form control', async ({ page }) => {
      await page.goto(`${path}/contact`);
      await expect(page.locator('#consent')).toBeVisible();
      const submit = page.locator('#cf-submit');
      await submit.focus();
      const covered = await submit.evaluate((el) => {
        const r = el.getBoundingClientRect();
        const topEl = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
        return !(topEl && (topEl === el || el.contains(topEl)));
      });
      expect(covered, 'submit button hidden behind the consent strip').toBe(false);
    });

    test('decline and accept both dismiss it and release the reserved space', async ({ page, context }) => {
      for (const choice of ['decline', 'accept'] as const) {
        await context.clearCookies();
        await page.goto(path);
        await page.locator(`#consent-${choice}`).click();
        await expect(page.locator('#consent')).toBeHidden();
        await expect
          .poll(() => page.evaluate(() => Number.parseFloat(getComputedStyle(document.body).paddingBottom)), {
            message: 'reserved space released',
          })
          .toBe(0);
        const cookies = await context.cookies();
        expect(cookies.find((c) => c.name === 'consent')?.value).toBe(choice === 'accept' ? 'granted' : 'denied');
      }
    });
  });
}

test.describe('region banner', () => {
  // A French-language browser on the Australian site is offered the French site.
  test.use({ locale: 'fr-FR' });

  test.beforeEach(async ({ page }) => {
    await calm(page);
    await asPhone(page);
  });

  test('is opaque and sits above the consent strip', async ({ page }) => {
    await page.goto('/au-en');
    const banner = page.locator('#region-banner');
    await expect(banner).toBeVisible();
    await expect(page.locator('#consent')).toBeVisible();
    const m = await page.evaluate(() => {
      const b = document.getElementById('region-banner') as HTMLElement;
      const c = document.getElementById('consent') as HTMLElement;
      return {
        bg: getComputedStyle(b).backgroundColor,
        bannerBottom: b.getBoundingClientRect().bottom,
        consentTop: c.getBoundingClientRect().top,
      };
    });
    expect(alphaOf(m.bg), `region banner background ${m.bg}`).toBe(1);
    expect(m.bannerBottom, 'banner clears the consent strip').toBeLessThanOrEqual(m.consentTop);
  });
});

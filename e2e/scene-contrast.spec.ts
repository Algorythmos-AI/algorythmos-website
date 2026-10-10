/**
 * Hero copy and its scene — measured contrast.
 *
 * axe cannot judge text over a picture (it reports "incomplete", which is not a
 * failure), so this measures it: for each hero, in both themes, on a phone, a
 * tablet and a desktop, it paints the still, hides the glyphs, screenshots what
 * is behind each line of copy and compares the text colour with the pixels
 * there. WCAG AA: 4.5:1 for body text, 3:1 for large.
 *
 * The first version of the hero put the scene behind the copy on small screens
 * and this test failed it (2.85:1 at worst), which is why the scene now has a
 * band of its own there. Below `lg` the test also asserts exactly that: no line
 * of copy overlaps the scene.
 *
 * It runs with reduced motion, so what is measured is the still — the same
 * picture the live scene draws, at the same strength.
 */
import { test, expect, type Page } from '@playwright/test';
import sharp from 'sharp';

const PAGES = [
  ['/au-en/about', 'globe'],
  ['/au-en/services', 'constellation'],
  ['/au-en/services/agentic-automation', 'agent-swarm'],
  ['/au-en/services/document-intelligence', 'robot-sorter'],
  ['/au-en/services/llmops', 'llm-lattice'],
  ['/au-en/services/mlops-cicd', 'model-pipeline'],
  ['/au-en/services/ai-platform-engineering', 'platform-station'],
  ['/au-en/services/model-monitoring', 'monitor-radar'],
  ['/au-en/services/data-feature-management', 'feature-vault'],
  ['/au-en/services/sql-dashboards', 'dash-terrain'],
  ['/au-en/services/ai-websites', 'holo-site'],
  ['/au-en/case-studies/port-botany-ai-ml', 'port-yard'],
  ['/au-en/case-studies/manufacturing-docs', 'scan'],
  ['/au-en/pricing', 'ledger'],
  ['/fr-fr/pricing', 'ledger (EUR)'],
  ['/au-en/case-studies/financial-compliance', 'ledger (audit)'],
  ['/au-en/pdf-algo-pro', 'pages'],
  ['/404', 'lost-satellite (behind centred copy on desktop)'],
] as const;
const VIEWPORTS = [
  { name: 'phone', width: 390, height: 844 },
  { name: 'tablet', width: 820, height: 1100 },
  { name: 'desktop', width: 1440, height: 900 },
] as const;

/** Relative luminance of an sRGB colour (WCAG 2.x). */
function luminance(r: number, g: number, b: number): number {
  const lin = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}
const ratio = (a: number, b: number) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);

/** Worst contrast between `color` and the pixels of a screenshot, ignoring the most extreme 0.5%. */
async function worstContrast(png: Buffer, color: [number, number, number]): Promise<number> {
  const { data, info } = await sharp(png).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const text = luminance(...color);
  const ratios: number[] = [];
  for (let i = 0; i < info.width * info.height * 3; i += 3) ratios.push(ratio(text, luminance(data[i], data[i + 1], data[i + 2])));
  ratios.sort((x, y) => x - y);
  return ratios[Math.floor(ratios.length * 0.005)];
}

async function measure(page: Page) {
  /* The copy of the hero that owns the scene: its h1 and every paragraph beside it. */
  const lines = await page.evaluate(() => {
    const hero = document.querySelector('[data-scene]')!.closest('section')!;
    const scene = document.querySelector('[data-scene]')!.getBoundingClientRect();
    /* Any CSS colour → sRGB bytes, by letting a canvas resolve it (computed colours come
       back as rgb(), rgba() or color(srgb …) depending on how they were written). */
    const probe = document.createElement('canvas').getContext('2d', { willReadFrequently: true })!;
    const bytes = (css: string) => {
      probe.clearRect(0, 0, 1, 1);
      probe.fillStyle = css;
      probe.fillRect(0, 0, 1, 1);
      return [...probe.getImageData(0, 0, 1, 1).data].slice(0, 3);
    };
    const out: { rect: { x: number; y: number; width: number; height: number }; color: number[]; large: boolean; tag: string; overScene: boolean }[] = [];
    hero.querySelectorAll<HTMLElement>('h1, p').forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.width < 4 || r.height < 4 || el.closest('[hidden]')) return;
      const cs = getComputedStyle(el);
      /* Gradient-filled display text (the 404 numeral) has a transparent colour and
         paints with a background clip; there is no single text colour to compare. */
      if (/,\s*0\)$|\/\s*0\)$|^transparent$/.test(cs.color)) return;
      const px = parseFloat(cs.fontSize);
      const bold = Number(cs.fontWeight) >= 700;
      out.push({
        /* Document coordinates: the screenshot is taken of the full page, so a line
           below the fold is still measured, and fixed overlays do not cover it. */
        rect: { x: Math.max(0, r.left) + scrollX, y: r.top + scrollY, width: Math.min(r.width, innerWidth - r.left), height: r.height },
        color: bytes(cs.color),
        large: px >= 24 || (bold && px >= 18.66),
        tag: `${el.tagName.toLowerCase()} "${(el.textContent ?? '').trim().slice(0, 28)}"`,
        overScene: r.left < scene.right && r.right > scene.left && r.top < scene.bottom && r.bottom > scene.top,
      });
    });
    /* Hide the glyphs, keep the layout: what is left is exactly what the text sits on.
       The consent strip and region banner are fixed overlays, not part of the hero. */
    const style = document.createElement('style');
    style.textContent =
      'section :is(h1, p, a, span) { color: transparent !important; -webkit-text-fill-color: transparent !important; }' +
      '#consent, .region-banner { display: none !important; }';
    document.head.appendChild(style);
    return out;
  });
  const results: { tag: string; got: number; need: number; overScene: boolean }[] = [];
  for (const line of lines) {
    const png = await page.screenshot({ clip: line.rect, fullPage: true, animations: 'disabled' });
    results.push({
      tag: line.tag,
      got: await worstContrast(png, line.color as [number, number, number]),
      need: line.large ? 3 : 4.5,
      overScene: line.overScene,
    });
  }
  return results;
}

for (const viewport of VIEWPORTS) {
  for (const theme of ['dark', 'light'] as const) {
    test.describe(`${viewport.name}, ${theme} theme`, () => {
      test.use({ viewport: { width: viewport.width, height: viewport.height }, colorScheme: theme, reducedMotion: 'reduce' });

      for (const [path, scene] of PAGES) {
        test(`${scene}: hero copy keeps AA contrast over the scene`, async ({ page }) => {
          await page.goto(path);
          // The still is painted at idle after load; wait for it, or there is nothing behind the text to measure.
          await expect(page.locator('canvas.scene3d-poster[data-painted]')).toHaveCount(1, { timeout: 15_000 });
          await page.waitForTimeout(450); // its fade-in
          const results = await measure(page);
          expect(results.length).toBeGreaterThan(0);
          for (const r of results) {
            expect(r.got, `${r.tag}: ${r.got.toFixed(2)}:1, needs ${r.need}:1`).toBeGreaterThanOrEqual(r.need);
          }
          if (viewport.width < 1024) {
            expect(results.filter((r) => r.overScene).map((r) => r.tag), 'no copy over the scene below lg').toEqual([]);
          }
        });
      }
    });
  }
}

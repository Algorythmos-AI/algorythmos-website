/**
 * Guards for the brand kit. They read the committed files, so they fail if an export is
 * missing, the wrong size, or edited by hand in a way that breaks the logo's rules.
 */
import { describe, expect, it } from 'vitest';
import sharp from 'sharp';
import { existsSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { PALETTE } from './build-brand.mjs';

const ROOT = resolve(import.meta.dirname, '../..');
const manifest = JSON.parse(readFileSync(join(ROOT, 'brand/source/manifest.json'), 'utf8'));
const at = (p) => join(ROOT, p);

const luminance = (hex) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const contrast = (a, b) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

describe('brand kit', () => {
  it('lists a complete set of exports', () => {
    expect(manifest.length).toBeGreaterThan(100);
    for (const lockup of ['mark', 'horizontal', 'stacked', 'wordmark']) {
      expect(manifest.some((f) => f.path === `brand/logo/${lockup}/algorythmos-${lockup}-indigo.svg`)).toBe(true);
    }
  });

  it('has every file in the manifest, at the declared pixel size', async () => {
    for (const f of manifest) {
      expect(existsSync(at(f.path)), f.path).toBe(true);
      if (f.kind === 'png' || f.kind === 'webp') {
        const meta = await sharp(at(f.path)).metadata();
        expect([meta.width, meta.height], f.path).toEqual([f.width, f.height]);
      }
    }
  });

  it('uses lowercase ASCII file names without spaces', () => {
    for (const f of manifest.filter((x) => x.path.startsWith('brand/'))) expect(f.path).toMatch(/^[a-z0-9/._-]+$/);
  });

  it('keeps SVGs pure vector and inside the palette', () => {
    const allowed = new Set(Object.values(PALETTE).map((c) => c.toLowerCase()));
    for (const f of [{ path: 'brand/source/master.svg' }, ...manifest.filter((x) => x.kind === 'svg')]) {
      const svg = readFileSync(at(f.path), 'utf8');
      expect(svg, f.path).not.toMatch(/<image\b|<text\b|<script\b/);
      for (const [hex] of svg.matchAll(/#[0-9a-fA-F]{6}\b/g)) expect(allowed.has(hex.toLowerCase()), `${f.path}: ${hex}`).toBe(true);
    }
  });

  it('ships a real multi-size favicon.ico', () => {
    const ico = readFileSync(at('public/favicon.ico'));
    expect(ico.readUInt16LE(2)).toBe(1); // type: icon
    expect(ico.readUInt16LE(4)).toBe(3); // 16, 32, 48
    expect([0, 1, 2].map((i) => ico.readUInt8(6 + 16 * i))).toEqual([16, 32, 48]);
  });

  it('has a 1200×630 share image, as the page metadata declares', async () => {
    const meta = await sharp(at('public/Algorythmos.png')).metadata();
    expect([meta.width, meta.height]).toEqual([1200, 630]);
  });

  it('keeps the dot separate from the stem and the counter open at 32 px', async () => {
    // Render the small-size cut on white and walk down the column through the dot's centre:
    // ink (dot) → paper (gap) → ink (stem). Then check the counter is still paper.
    const master = readFileSync(at('brand/source/master.svg'), 'utf8');
    const small = master.match(/id="mark-small-body"[^>]*\bd="([^"]+)"/)[1];
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2180 2580" width="27" height="32"><path fill="#000" fill-rule="evenodd" d="${small}"/><circle cx="1845" cy="315" r="315" fill="#000"/></svg>`;
    const { data, info } = await sharp(Buffer.from(svg)).flatten({ background: '#fff' }).greyscale().raw().toBuffer({ resolveWithObject: true });
    const px = (x, y) => data[y * info.width + x];
    const col = Math.round((1845 / 2180) * info.width - 0.5);
    const column = Array.from({ length: info.height }, (_, y) => px(col, y));
    const firstInk = column.findIndex((v) => v < 100);
    const gap = column.findIndex((v, y) => y > firstInk && v > 150);
    const stem = column.findIndex((v, y) => y > gap && v < 100);
    expect(firstInk, 'dot').toBeGreaterThanOrEqual(0);
    expect(gap, 'gap under the dot').toBeGreaterThan(firstInk);
    expect(stem, 'stem under the gap').toBeGreaterThan(gap);
    expect(px(Math.round((1115 / 2180) * info.width), Math.round((1597 / 2580) * info.height)), 'counter').toBeGreaterThan(150);
  });

  it('meets 3:1 contrast for every sanctioned logo/background pair', () => {
    const pairs = [
      [PALETTE.indigo, PALETTE.paper],
      [PALETTE.paper, PALETTE.indigo],
      [PALETTE.paper, PALETTE.violet],
      [PALETTE.paper, PALETTE.ink],
      [PALETTE.black, PALETTE.paper],
    ];
    for (const [fg, bg] of pairs) expect(contrast(fg, bg), `${fg} on ${bg}`).toBeGreaterThanOrEqual(3);
  });
});

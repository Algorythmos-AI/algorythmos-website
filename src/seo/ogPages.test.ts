/**
 * Cards that point at an image file: the file has to exist, be the size the
 * <head> declares, and a finished card has to cover every locale of its page.
 */
import { describe, it, expect } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { ogPages } from './ogPages';
import { PREFIXED_LOCALES } from '@/i18n';

const abs = (p: string) => fileURLToPath(new URL(`../../${p.replace(/^\.\//, '')}`, import.meta.url));
/** Width and height from a PNG's IHDR chunk. */
const size = (file: string) => {
  const b = readFileSync(file);
  return [b.readUInt32BE(16), b.readUInt32BE(20)];
};
const withImage = Object.entries(ogPages).filter(([, p]) => p.art || p.card);

describe('Open Graph cards that use an image', () => {
  it('there is at least one of each kind', () => {
    expect(withImage.some(([, p]) => p.art)).toBe(true);
    expect(withImage.some(([, p]) => p.card)).toBe(true);
  });

  it.each(withImage)('%s points at a 1200×630 PNG', (_key, page) => {
    const file = abs((page.card ?? page.art) as string);
    expect(existsSync(file), file).toBe(true);
    expect(size(file)).toEqual([1200, 630]);
  });

  it('a finished card exists for every locale of its page, each with its own file', () => {
    const finished = Object.keys(ogPages).filter((k) => ogPages[k].card);
    const pages = new Set(finished.map((k) => k.replace(/^[^/]+\//, '')));
    for (const page of pages) {
      const files = PREFIXED_LOCALES.map((loc) => ogPages[`${loc}/${page}`]?.card);
      expect(files.every(Boolean), page).toBe(true);
      expect(new Set(files).size, `${page}: one file per locale`).toBe(PREFIXED_LOCALES.length);
    }
  });
});

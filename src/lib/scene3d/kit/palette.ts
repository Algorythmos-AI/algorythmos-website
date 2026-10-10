import { Color, SRGBColorSpace } from 'three';
import { readToken, type RGB } from '@/lib/tokens';
import type { Palette } from '../types';

/* Fallbacks are the dark theme's values, used only if a token fails to parse. */
const BRAND: RGB = { r: 167, g: 139, b: 250 };
const ACCENT: RGB = { r: 34, g: 211, b: 238 };
const BG: RGB = { r: 8, g: 8, b: 12 };
const TEXT: RGB = { r: 244, g: 244, b: 247 };

/** Read the live theme off the CSS tokens (themes.css). */
export function readPalette(): Palette {
  return {
    brand: readToken('--brand', BRAND),
    accent: readToken('--accent', ACCENT),
    bg: readToken('--bg', BG),
    text: readToken('--text', TEXT),
    light: document.documentElement.getAttribute('data-theme') === 'light',
  };
}

/** A theme token (sRGB 0–255) as a three Color in the renderer's working space. */
export function toColor(c: RGB, target = new Color()): Color {
  return target.setRGB(c.r / 255, c.g / 255, c.b / 255, SRGBColorSpace);
}

/** Blend two tokens, t = 0 → a, 1 → b. */
export function mixColor(a: RGB, b: RGB, t: number, target = new Color()): Color {
  return target.setRGB(
    (a.r + (b.r - a.r) * t) / 255,
    (a.g + (b.g - a.g) * t) / 255,
    (a.b + (b.b - a.b) * t) / 255,
    SRGBColorSpace,
  );
}

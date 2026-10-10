import { Color } from 'three';
import type { Palette } from '../types';
import { mixColor } from './palette';
import { createSoftPoints, setColorAt, type SoftPoints } from './points';

/**
 * A field of motes behind a scene — stars, dust, whatever the scene calls it.
 * Scattered once from the seeded generator, coloured across the two brand hues.
 */
export interface Motes extends SoftPoints {
  /** Recolour for a theme; `dark` and `light` are the opacities to use. */
  setTheme(palette: Palette, dark?: number, light?: number): void;
}

export interface MoteBox {
  /** Half-extents of the box the motes fill. */
  x: number;
  y: number;
  /** Depth range, both behind the subject (negative z). */
  near: number;
  far: number;
}

export function createMotes(count: number, rng: () => number, box: MoteBox = { x: 4, y: 2.8, near: -0.6, far: -4.5 }, size = 0.055): Motes {
  const points = createSoftPoints(count, size, 0.75);
  const mix = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    points.position.setXYZ(i, (rng() * 2 - 1) * box.x, (rng() * 2 - 1) * box.y, box.near + rng() * (box.far - box.near));
    points.scale.setX(i, 0.3 + Math.pow(rng(), 3) * 1.5);
    mix[i] = rng();
  }
  points.position.needsUpdate = true;
  points.scale.needsUpdate = true;
  const tmp = new Color();
  return Object.assign(points, {
    setTheme(palette: Palette, dark = 0.75, light = 0.35) {
      for (let i = 0; i < count; i++) setColorAt(points.color, i, mixColor(palette.brand, palette.accent, mix[i], tmp));
      points.color.needsUpdate = true;
      points.setLight(palette.light, palette.light ? light : dark);
    },
  });
}

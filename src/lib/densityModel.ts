/**
 * The idealised whole-die model from the DRAM evidence report.
 *
 * A share `p` of a die is cell array. Moving the array from 6F² to 4F² shrinks
 * that part to two thirds and, in this model, leaves everything else as it was.
 * It is arithmetic on a simplification, not a measurement of any product.
 */

/** Area of a 4F² cell relative to a 6F² cell. */
export const CELL_RATIO = 4 / 6;

const clamp01 = (x: number) => (Number.isFinite(x) ? Math.min(1, Math.max(0, x)) : 0);

/** New die area as a fraction of the old, for an array share `p` (0…1). */
export function dieAreaRatio(p: number): number {
  const share = clamp01(p);
  return share * CELL_RATIO + (1 - share);
}

/** Extra bits a die of the original size would hold, as a fraction (0.25 = 25% more). */
export function bitGain(p: number): number {
  return 1 / dieAreaRatio(p) - 1;
}

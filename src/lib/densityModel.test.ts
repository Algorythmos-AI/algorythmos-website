import { describe, expect, it } from 'vitest';
import { bitGain, CELL_RATIO, dieAreaRatio } from './densityModel';

describe('whole-die density model', () => {
  it('a 4F² cell is two thirds of a 6F² cell', () => {
    expect(CELL_RATIO).toBeCloseTo(2 / 3, 10);
  });

  it('a die with no array does not change, and a die that is all array shrinks by a third', () => {
    expect(dieAreaRatio(0)).toBe(1);
    expect(bitGain(0)).toBe(0);
    expect(dieAreaRatio(1)).toBeCloseTo(2 / 3, 10);
    expect(bitGain(1)).toBeCloseTo(0.5, 10);
  });

  it('matches the figures quoted in the report and its chart', () => {
    expect(dieAreaRatio(0.6)).toBeCloseTo(0.8, 10);
    expect(bitGain(0.6)).toBeCloseTo(0.25, 10);
    const chart = [0.4, 0.5, 0.6, 0.7, 0.8].map((p) => Math.round(dieAreaRatio(p) * 1000) / 10);
    expect(chart).toEqual([86.7, 83.3, 80, 76.7, 73.3]);
  });

  it('the gain never exceeds the 50% of the array alone', () => {
    for (let p = 0; p <= 1.0001; p += 0.05) {
      expect(bitGain(p)).toBeGreaterThanOrEqual(0);
      expect(bitGain(p)).toBeLessThanOrEqual(0.5 + 1e-9);
    }
  });

  it('treats values outside 0…1 and non-numbers as the nearest valid share', () => {
    expect(dieAreaRatio(-1)).toBe(1);
    expect(dieAreaRatio(7)).toBeCloseTo(2 / 3, 10);
    expect(dieAreaRatio(Number.NaN)).toBe(1);
  });
});

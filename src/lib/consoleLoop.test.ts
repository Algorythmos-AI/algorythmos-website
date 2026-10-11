import { describe, expect, it } from 'vitest';
import { canvasPoint, consoleMayAdvance, easeOutQuart, formatValue, scaleFor } from './consoleLoop';

describe('scaleFor', () => {
  it('returns the fit ratio', () => {
    expect(scaleFor(1114, 1280)).toBeCloseTo(0.8703, 3);
    expect(scaleFor(640, 1280)).toBe(0.5);
    expect(scaleFor(1280, 1280)).toBe(1);
  });
  it('is safe on zero/negative/NaN inputs (never divides by 0 → 1)', () => {
    expect(scaleFor(0, 1280)).toBe(1);
    expect(scaleFor(390, 0)).toBe(1);
    expect(scaleFor(NaN, 1280)).toBe(1);
  });
});

describe('easeOutQuart', () => {
  it('is bounded and monotonic on [0,1]', () => {
    expect(easeOutQuart(0)).toBe(0);
    expect(easeOutQuart(1)).toBe(1);
    let prev = 0;
    for (let p = 0; p <= 1.0001; p += 0.05) {
      const v = easeOutQuart(Math.min(p, 1));
      expect(v).toBeGreaterThanOrEqual(prev);
      prev = v;
    }
  });

  it('front-loads motion (ease-out)', () => {
    expect(easeOutQuart(0.5)).toBeGreaterThan(0.9); // 1 - 0.5^4 = 0.9375
  });
});

describe('formatValue', () => {
  it('formats integers with locale grouping', () => {
    expect(formatValue(1284, 'int', 'en')).toBe('1,284');
    // fr grouping uses a (narrow) no-break space — assert digits + separator class
    expect(formatValue(1284, 'int', 'fr-FR')).toMatch(/^1[  ]284$/);
  });

  it('formats one-decimal percentages', () => {
    expect(formatValue(99.2, 'pct1', 'en')).toBe('99.2%');
    expect(formatValue(99.2, 'pct1', 'fr-FR')).toMatch(/^99,2[  ]%$/);
  });

  it('formats seconds with locale decimal + fr spacing', () => {
    expect(formatValue(1.8, 'sec1', 'en')).toBe('1.8s');
    expect(formatValue(1.8, 'sec1', 'fr-FR')).toBe('1,8 s'); // narrow no-break space before the unit
  });

  it('rounds int values mid-animation', () => {
    expect(formatValue(1283.6, 'int', 'en')).toBe('1,284');
  });

  it('falls back gracefully on an invalid locale tag', () => {
    expect(() => formatValue(5, 'int', '!!bad!!')).not.toThrow();
  });
});

describe('consoleMayAdvance', () => {
  it('advances only on screen, in a visible tab, with motion allowed', () => {
    expect(consoleMayAdvance(true, false, false)).toBe(true);
    expect(consoleMayAdvance(false, false, false)).toBe(false);
    expect(consoleMayAdvance(true, true, false)).toBe(false);
  });
  it('stops as soon as motion is turned off mid-session', () => {
    expect(consoleMayAdvance(true, false, true)).toBe(false);
  });
});

describe('canvasPoint', () => {
  const target = { left: 300, top: 200, width: 100, height: 40 };

  it('maps a target centre to canvas px at scale 1', () => {
    expect(canvasPoint(target, { left: 100, top: 50, width: 1280 }, 1280)).toEqual({ x: 250, y: 170 });
  });

  it('undoes the scale when the screen is rendered smaller than the canvas', () => {
    // screen drawn at half size: every client px is two canvas px
    const pt = canvasPoint({ left: 150, top: 100, width: 50, height: 20 }, { left: 50, top: 25, width: 640 }, 1280);
    expect(pt).toEqual({ x: 250, y: 170 });
  });

  it('gives the same answer when the engine reports unscaled rects', () => {
    // some engines report rects inside a zoomed box in the box's own px (ratio 1)
    expect(canvasPoint(target, { left: 100, top: 50, width: 1280 }, 1280)).toEqual(
      canvasPoint({ left: 150, top: 100, width: 50, height: 20 }, { left: 50, top: 25, width: 640 }, 1280),
    );
  });

  it('honours an anchor other than the centre', () => {
    expect(canvasPoint(target, { left: 100, top: 50, width: 1280 }, 1280, { x: 0, y: 1 })).toEqual({ x: 200, y: 190 });
  });

  it('returns null instead of NaN/Infinity when nothing is measurable', () => {
    expect(canvasPoint(target, { left: 0, top: 0, width: 0 }, 1280)).toBeNull();
    expect(canvasPoint(target, { left: 0, top: 0, width: 1280 }, 0)).toBeNull();
    expect(canvasPoint({ ...target, left: NaN }, { left: 0, top: 0, width: 1280 }, 1280)).toBeNull();
  });
});

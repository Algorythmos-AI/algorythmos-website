import { describe, it, expect } from 'vitest';
import { nextStep, dwell, partState, readStep, armExplainers, STEP_MS, HOLD_MS } from './explainerLoop';

describe('explainerLoop', () => {
  it('walks the steps in order and wraps after the last', () => {
    const seen: number[] = [];
    let s = 0;
    for (let i = 0; i < 7; i++) {
      seen.push(s);
      s = nextStep(s, 6);
    }
    expect(seen).toEqual([0, 1, 2, 3, 4, 5, 0]);
  });

  it('restarts from the first step on bad input instead of running off the end', () => {
    expect(nextStep(99, 6)).toBe(0);
    expect(nextStep(-1, 6)).toBe(0);
    expect(nextStep(1.5, 6)).toBe(0);
    expect(nextStep(Number.NaN, 6)).toBe(0);
    expect(nextStep(2, 0)).toBe(0);
  });

  it('holds the finished picture longer than a step', () => {
    expect(dwell(0, 6)).toBe(STEP_MS);
    expect(dwell(5, 6)).toBe(HOLD_MS);
    expect(HOLD_MS).toBeGreaterThan(STEP_MS);
  });

  it('a part is on from its step onwards, and "now" only on that step', () => {
    expect(partState(0, 2)).toEqual({ on: false, now: false });
    expect(partState(2, 2)).toEqual({ on: true, now: true });
    expect(partState(5, 2)).toEqual({ on: true, now: false });
  });

  it('a part with an end step leaves on that step', () => {
    expect(partState(2, 2, 4)).toEqual({ on: true, now: true });
    expect(partState(3, 2, 4)).toEqual({ on: true, now: false });
    expect(partState(4, 2, 4)).toEqual({ on: false, now: false });
  });

  it('frames are stateless: the same step always gives the same picture', () => {
    const parts = [
      { at: 0, until: 2 },
      { at: 1, until: undefined },
      { at: 3, until: 5 },
      { at: 5, until: undefined },
    ];
    const frame = (step: number) => parts.map((p) => partState(step, p.at, p.until).on);
    const first = Array.from({ length: 6 }, (_, s) => frame(s));
    // Many loops later, nothing has accumulated.
    let s = 0;
    for (let i = 0; i < 6 * 500; i++) s = nextStep(s, 6);
    expect(s).toBe(0);
    expect(Array.from({ length: 6 }, (_, k) => frame(k))).toEqual(first);
    // The last step shows exactly the parts that never leave: the static picture.
    expect(frame(5)).toEqual(parts.map((p) => p.until === undefined));
  });

  it('ignores step attributes that are not whole numbers', () => {
    expect(readStep('3')).toBe(3);
    expect(readStep('0')).toBe(0);
    expect(readStep(undefined)).toBeUndefined();
    expect(readStep('')).toBeUndefined();
    expect(readStep('-1')).toBeUndefined();
    expect(readStep('1.5')).toBeUndefined();
    expect(readStep('abc')).toBeUndefined();
  });

  it('arming a page with no explainers does nothing', () => {
    const root = { querySelectorAll: () => [] } as unknown as ParentNode;
    expect(() => armExplainers(root)).not.toThrow();
  });
});

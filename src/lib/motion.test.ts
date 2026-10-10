import { describe, it, expect } from 'vitest';
import { motionOff, motionTransition, onMotionChange } from './motion';

describe('motion', () => {
  it('reports motion off where there is no window (SSR never animates)', () => {
    expect(motionOff()).toBe(true);
  });

  it('subscribing without a window is a no-op that still returns an unsubscribe', () => {
    const off = onMotionChange(() => {
      throw new Error('must not fire during SSR');
    });
    expect(() => off()).not.toThrow();
  });

  it('only reports a transition when the answer actually changed', () => {
    expect(motionTransition(false, true)).toBe(true); // pause pressed
    expect(motionTransition(true, false)).toBe(false); // resumed
    // A view-transition swap strips and restores data-motion; once settled the
    // answer is unchanged, so nothing may fire.
    expect(motionTransition(true, true)).toBeNull();
    expect(motionTransition(false, false)).toBeNull();
  });
});

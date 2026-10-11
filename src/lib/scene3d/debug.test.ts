import { describe as suite, expect, it } from 'vitest';
import { describe, rate, type Snapshot } from './debug';

const base: Snapshot = {
  plan: 'interaction:low:touch-device',
  state: 'static',
  step: 'armed',
  sceneFps: null,
  orbState: 'static',
  orbStatic: 'touch-only',
  orbFps: null,
  webgl2: true,
  webgl2Strict: true,
  renderer: 'Apple GPU',
  osReducedMotion: false,
  storedPause: false,
  moreContrast: false,
  forcedColors: false,
  saveData: undefined,
  connection: undefined,
  deviceMemory: undefined,
  coarsePointer: true,
  hover: false,
  width: 393,
  height: 659,
  pixelRatio: 3,
  hidden: false,
  gaveUp: false,
  marks: {},
  userAgent: 'Mozilla/5.0 (iPhone) CriOS/141',
};
const text = (over: Partial<Snapshot> = {}) => describe({ ...base, ...over }).join('\n');

suite('scene-debug readout', () => {
  it('an untouched iPhone: waiting for a touch, orb held static, nothing drawing', () => {
    const out = text();
    expect(out).toContain('plan    interaction:low:touch-device');
    expect(out).toContain('state   static  step armed  not drawing');
    expect(out).toContain('orb     static (touch-only)  not drawing');
    expect(out).toContain('webgl2  yes  strict yes  Apple GPU');
    expect(out).not.toContain('fail');
  });

  it('a live scene reports its frame rate', () => {
    expect(text({ state: 'live', step: 'live', sceneFps: 58 })).toContain('state   live  step live  58 fps');
  });

  it('names the failure and carries the error text', () => {
    expect(text({ fail: 'error', error: 'Error: a shader failed to compile or link' })).toContain(
      'fail    error (Error: a shader failed to compile or link)',
    );
    expect(text({ fail: 'slow' })).toContain('fail    slow');
  });

  it('tells a stored pause from the OS setting', () => {
    expect(text({ osReducedMotion: true })).toContain('motion  os-reduce yes  paused no  gave-up no');
    expect(text({ storedPause: true, gaveUp: true })).toContain('motion  os-reduce no  paused yes  gave-up yes');
  });

  it('shows a context the caveat check refused', () => {
    expect(text({ webgl2Strict: false })).toContain('webgl2  yes  strict no');
    expect(text({ webgl2: false, webgl2Strict: false, renderer: '' })).toContain('webgl2  no  strict no  renderer hidden');
  });

  it('prints unknowns as "?" where the browser hides them, and values where it does not', () => {
    expect(text()).toContain('net     save-data ?  type ?  memory ?');
    expect(text({ saveData: true, connection: '3g', deviceMemory: 4 })).toContain('net     save-data yes  type 3g  memory 4');
  });

  it('lists the loader marks in order, and omits the line when there are none', () => {
    expect(text()).not.toContain('marks');
    expect(text({ marks: { engine: 420, module: 455, compiled: 910 } })).toContain('marks   engine 420  module 455  compiled 910');
  });

  it('a page without a scene or an orb says so', () => {
    const out = text({ plan: undefined, orbState: undefined });
    expect(out).toContain('scene   none on this page');
    expect(out).not.toContain('orb ');
  });

  it('ends with the user agent', () => {
    expect(describe(base).at(-1)).toBe(base.userAgent);
  });
});

suite('rate', () => {
  it('frames per second between two readings', () => {
    expect(rate(100, 160, 1000)).toBe(60);
    expect(rate(100, 115, 500)).toBe(30);
  });
  it('null when nothing was drawn, or there is nothing to compare', () => {
    expect(rate(100, 100, 1000)).toBeNull();
    expect(rate(null, 50, 1000)).toBeNull();
    expect(rate(50, null, 1000)).toBeNull();
    expect(rate(10, 20, 0)).toBeNull();
  });
});

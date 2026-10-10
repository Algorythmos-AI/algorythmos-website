import { describe, it, expect } from 'vitest';
import {
  govern,
  isSoftwareRenderer,
  newSampler,
  pickPlan,
  sampleFrame,
  GOVERNOR_STALL_STRIKES,
  GOVERNOR_WARMUP_MS,
  GOVERNOR_WINDOW_MS,
  MIN_PIXEL_RATIO,
  SLOW_FRAME_MS,
  type Device,
  type GovernorVerdict,
} from './tier';

const desktop: Device = {
  enabled: true,
  motionOff: false,
  saveData: false,
  moreContrast: false,
  forcedColors: false,
  deviceMemory: 8,
  width: 1440,
  coarsePointer: false,
  hover: true,
  gaveUp: false,
};
const plan = (over: Partial<Device>) => pickPlan({ ...desktop, ...over });

describe('pickPlan — who never downloads the engine', () => {
  it.each([
    ['the site-wide switch is off', { enabled: false }, 'disabled'],
    ['motion is off (OS setting or pause toggle)', { motionOff: true }, 'motion-off'],
    ['the visitor asked to save data', { saveData: true }, 'save-data'],
    ['the visitor asked for more contrast', { moreContrast: true }, 'more-contrast'],
    ['Windows high-contrast mode is on', { forcedColors: true }, 'forced-colors'],
    ['the device reports 4 GB or less', { deviceMemory: 4 }, 'low-memory'],
    ['the device reports 2 GB', { deviceMemory: 2 }, 'low-memory'],
    ['this session already gave up on the GPU', { gaveUp: true }, 'gave-up'],
  ] as const)('%s', (_label, over, reason) => {
    expect(plan(over)).toEqual({ tier: 'low', trigger: 'never', reason });
  });

  it('lets the opt-outs win over an otherwise capable phone', () => {
    expect(plan({ width: 390, coarsePointer: true, hover: false, motionOff: true }).trigger).toBe('never');
    expect(plan({ width: 390, coarsePointer: true, hover: false, saveData: true }).trigger).toBe('never');
  });
});

describe('pickPlan — phones and tablets wait for a first touch', () => {
  it('an iPhone (no deviceMemory, touch only)', () => {
    expect(plan({ deviceMemory: undefined, width: 393, coarsePointer: true, hover: false })).toEqual({
      tier: 'low',
      trigger: 'interaction',
      reason: 'touch-device',
    });
  });

  it('an Android phone with plenty of memory', () => {
    expect(plan({ deviceMemory: 8, width: 412, coarsePointer: true, hover: false }).trigger).toBe('interaction');
  });

  it('an iPad in landscape: wide, but nothing to hover with', () => {
    expect(plan({ deviceMemory: undefined, width: 1180, coarsePointer: true, hover: false }).trigger).toBe('interaction');
  });

  it('a narrow viewport whatever the pointer says — the path Lighthouse mobile takes', () => {
    expect(plan({ width: 412, coarsePointer: false, hover: true }).trigger).toBe('interaction');
    expect(plan({ width: 767 }).trigger).toBe('interaction');
  });
});

describe('pickPlan — desktops load at idle', () => {
  it('a machine reporting 8 GB or more gets the top tier', () => {
    expect(plan({})).toEqual({ tier: 'high', trigger: 'idle', reason: 'desktop' });
    expect(plan({ width: 768 }).trigger).toBe('idle');
  });

  it('Safari and Firefox hide deviceMemory, so they get the middle tier', () => {
    expect(plan({ deviceMemory: undefined })).toEqual({ tier: 'medium', trigger: 'idle', reason: 'desktop' });
  });

  it('a touchscreen laptop still counts as desktop because it can hover', () => {
    expect(plan({ coarsePointer: true, hover: true }).trigger).toBe('idle');
  });
});

describe('isSoftwareRenderer — CPU rasterisers keep the still', () => {
  it.each([
    'ANGLE (Google, Vulkan 1.3.0 (SwiftShader Device (LLVM 10.0.0) (0x0000C0DE)), SwiftShader driver)',
    'llvmpipe (LLVM 15.0.7, 256 bits)',
    'llvmpipe, or similar',
    'Mesa/X.org softpipe',
    'Google SwiftShader',
    'Microsoft Basic Render Driver',
    'Software Rasterizer',
  ])('%s', (renderer) => {
    expect(isSoftwareRenderer(renderer)).toBe(true);
  });

  it.each([
    'ANGLE (Apple, ANGLE Metal Renderer: Apple M4, Unspecified Version)',
    'Apple GPU',
    'Apple M1, or similar',
    'ANGLE (NVIDIA, NVIDIA GeForce RTX 3060 Direct3D11 vs_5_0 ps_5_0, D3D11)',
    'ANGLE (Intel, Intel(R) UHD Graphics 620 Direct3D11 vs_5_0 ps_5_0, D3D11)',
    'Mali-G78',
    'Adreno (TM) 740',
  ])('a real GPU: %s', (renderer) => {
    expect(isSoftwareRenderer(renderer)).toBe(false);
  });

  it('gives a browser that hides the string the benefit of the doubt (the governor still watches it)', () => {
    expect(isSoftwareRenderer(null)).toBe(false);
    expect(isSoftwareRenderer(undefined)).toBe(false);
    expect(isSoftwareRenderer('')).toBe(false);
  });
});

describe('govern — the frame-rate governor', () => {
  it('leaves a scene that keeps up alone', () => {
    expect(govern(16.7, 2)).toEqual({ action: 'keep' });
    expect(govern(SLOW_FRAME_MS, 2)).toEqual({ action: 'keep' });
  });

  it('renders fewer pixels before it gives up', () => {
    expect(govern(55, 2)).toEqual({ action: 'lower', pixelRatio: 1.5 });
    expect(govern(55, 1.5)).toEqual({ action: 'lower', pixelRatio: 1.13 });
    expect(govern(55, 1.13)).toEqual({ action: 'lower', pixelRatio: MIN_PIXEL_RATIO });
  });

  it('falls back to the still once there are no pixels left to shed', () => {
    expect(govern(55, MIN_PIXEL_RATIO)).toEqual({ action: 'give-up' });
  });

  it('never acts on a broken sample', () => {
    expect(govern(Number.NaN, 2)).toEqual({ action: 'keep' });
  });
});

describe('sampleFrame — judging a running scene', () => {
  /** Run frames `frameMs` apart for `durationMs`; return every verdict that was not "keep". */
  const run = (frameMs: number, durationMs: number, pixelRatio: number, sampler = newSampler(0)) => {
    const verdicts: GovernorVerdict[] = [];
    for (let now = frameMs; now <= durationMs; now += frameMs) {
      const v = sampleFrame(sampler, now, frameMs, pixelRatio);
      if (v.action !== 'keep') verdicts.push(v);
    }
    return verdicts;
  };

  it('never judges during warm-up', () => {
    expect(run(100, GOVERNOR_WARMUP_MS, 2)).toEqual([]);
  });

  it('leaves 60 fps alone, window after window', () => {
    expect(run(16.7, 20_000, 2)).toEqual([]);
  });

  it('sheds pixels within a few seconds at 10 fps', () => {
    const verdicts = run(100, GOVERNOR_WARMUP_MS + GOVERNOR_WINDOW_MS + 200, 2);
    expect(verdicts).toEqual([{ action: 'lower', pixelRatio: 1.5 }]);
  });

  it('gives up at the pixel floor', () => {
    expect(run(100, GOVERNOR_WARMUP_MS + GOVERNOR_WINDOW_MS + 200, MIN_PIXEL_RATIO)).toEqual([{ action: 'give-up' }]);
  });

  it('forgives one long gap: the laptop slept, the GPU is fine', () => {
    const sampler = newSampler(0);
    run(16.7, 2000, 1, sampler);
    expect(sampleFrame(sampler, 9000, 7000, 1)).toEqual({ action: 'keep' });
    // …and the gap does not poison the next window.
    const verdicts: GovernorVerdict[] = [];
    for (let now = 9016.7; now < 16_000; now += 16.7) {
      const v = sampleFrame(sampler, now, 16.7, 1);
      if (v.action !== 'keep') verdicts.push(v);
    }
    expect(verdicts).toEqual([]);
  });

  it('judges a renderer so slow that no frame ever lands in a window', () => {
    // 1.5 s per frame: every frame is a "stall". Without the strike rule this scene would run forever.
    const sampler = newSampler(0);
    const verdicts: GovernorVerdict[] = [];
    for (let i = 1; i <= GOVERNOR_STALL_STRIKES; i++) verdicts.push(sampleFrame(sampler, i * 1500, 1500, 1));
    expect(verdicts.slice(0, -1).every((v) => v.action === 'keep')).toBe(true);
    expect(verdicts.at(-1)).toEqual({ action: 'give-up' });
  });

  it('walks a 2× screen down to the floor and then stops', () => {
    const sampler = newSampler(0);
    const seen: GovernorVerdict[] = [];
    let ratio = 2;
    for (let now = 100; now <= 30_000 && seen.at(-1)?.action !== 'give-up'; now += 100) {
      const v = sampleFrame(sampler, now, 100, ratio);
      if (v.action === 'keep') continue;
      seen.push(v);
      if (v.action === 'lower') ratio = v.pixelRatio;
    }
    expect(seen).toEqual([
      { action: 'lower', pixelRatio: 1.5 },
      { action: 'lower', pixelRatio: 1.13 },
      { action: 'lower', pixelRatio: 1 },
      { action: 'give-up' },
    ]);
  });
});

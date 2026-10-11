import { describe, it, expect } from 'vitest';
import {
  govern,
  newSampler,
  sampleFrame,
  GOVERNOR_STALL_STRIKES,
  GOVERNOR_WARMUP_MS,
  GOVERNOR_WINDOW_MS,
  MIN_PIXEL_RATIO,
  SLOW_FRAME_MS,
  TIER_PATIENCE,
  type GovernorVerdict,
} from './governor';
import { isSlowConnection, isSoftwareRenderer, pickPlan, type Device } from './tier';

const desktop: Device = {
  enabled: true,
  motionOff: false,
  saveData: false,
  slowConnection: false,
  touchAutostart: true,
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
    ['the device reports 2 GB', { deviceMemory: 2 }, 'low-memory'],
    ['the device reports 1 GB', { deviceMemory: 1 }, 'low-memory'],
    ['this session already gave up on the GPU', { gaveUp: true }, 'gave-up'],
  ] as const)('%s', (_label, over, reason) => {
    expect(plan(over)).toEqual({ tier: 'low', trigger: 'never', reason });
  });

  it('lets the opt-outs win over an otherwise capable phone', () => {
    expect(plan({ width: 390, coarsePointer: true, hover: false, motionOff: true }).trigger).toBe('never');
    expect(plan({ width: 390, coarsePointer: true, hover: false, saveData: true }).trigger).toBe('never');
  });
});

describe('pickPlan — phones and tablets start by themselves, at the phone tier', () => {
  const iphone = { deviceMemory: undefined, width: 393, coarsePointer: true, hover: false } as const;
  const android = { deviceMemory: 8, width: 412, coarsePointer: true, hover: false } as const;

  it('an iPhone (no deviceMemory, touch only)', () => {
    expect(plan(iphone)).toEqual({ tier: 'low', trigger: 'idle', reason: 'touch-device' });
  });

  it('an Android phone with plenty of memory', () => {
    expect(plan(android)).toEqual({ tier: 'low', trigger: 'idle', reason: 'touch-device' });
  });

  it('an Android phone reporting the 4 GB minimum: the scene, under the governor', () => {
    expect(plan({ ...android, deviceMemory: 4 })).toEqual({ tier: 'low', trigger: 'idle', reason: 'touch-device' });
  });

  it('an iPad in landscape: wide, but nothing to hover with', () => {
    expect(plan({ deviceMemory: undefined, width: 1180, coarsePointer: true, hover: false })).toEqual({
      tier: 'low',
      trigger: 'idle',
      reason: 'touch-device',
    });
  });

  it('a narrow viewport whatever the pointer says', () => {
    expect(plan({ width: 412, coarsePointer: false, hover: true })).toEqual({ tier: 'low', trigger: 'idle', reason: 'touch-device' });
    expect(plan({ width: 767 }).tier).toBe('low');
  });

  it('a connection known to be slow waits for a first touch before fetching anything', () => {
    expect(plan({ ...android, slowConnection: true })).toEqual({ tier: 'low', trigger: 'interaction', reason: 'slow-connection' });
    expect(plan({ ...iphone, slowConnection: true }).trigger).toBe('interaction');
  });

  it('a slow connection does not hold a desktop back', () => {
    expect(plan({ slowConnection: true }).trigger).toBe('idle');
  });

  it('with the switch off, every phone and tablet waits for a first touch again', () => {
    expect(plan({ ...iphone, touchAutostart: false })).toEqual({ tier: 'low', trigger: 'interaction', reason: 'touch-device' });
    expect(plan({ ...android, touchAutostart: false }).trigger).toBe('interaction');
    expect(plan({ width: 1180, coarsePointer: true, hover: false, touchAutostart: false }).trigger).toBe('interaction');
  });

  it('the switch does not touch desktops', () => {
    expect(plan({ touchAutostart: false })).toEqual({ tier: 'high', trigger: 'idle', reason: 'desktop' });
  });
});

describe('isSlowConnection', () => {
  it.each(['slow-2g', '2g', '3g'])('%s is slow', (type) => expect(isSlowConnection(type)).toBe(true));
  it.each(['4g', '5g', '', undefined])('%s is not', (type) => expect(isSlowConnection(type)).toBe(false));
});

describe('pickPlan — desktops load at idle', () => {
  it('a machine reporting 8 GB or more gets the top tier', () => {
    expect(plan({})).toEqual({ tier: 'high', trigger: 'idle', reason: 'desktop' });
    expect(plan({ width: 768 }).trigger).toBe('idle');
  });

  it('a machine reporting the 4 GB minimum gets the phone tier', () => {
    expect(plan({ deviceMemory: 4 })).toEqual({ tier: 'low', trigger: 'idle', reason: 'desktop' });
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

  describe('patience — the phone tier needs two bad windows in a row', () => {
    /** Feed frames with the given gaps (ms), repeating the list until `durationMs`; return the non-"keep" verdicts. */
    const feed = (gaps: (now: number) => number, durationMs: number, patience: number, sampler = newSampler(0)) => {
      const verdicts: GovernorVerdict[] = [];
      let now = 0;
      while (now < durationMs) {
        const gap = gaps(now);
        now += gap;
        const v = sampleFrame(sampler, now, gap, MIN_PIXEL_RATIO, patience);
        if (v.action !== 'keep') verdicts.push(v);
      }
      return verdicts;
    };
    const LOW = TIER_PATIENCE.low;

    it('only the phone tier is given a second window', () => {
      expect(TIER_PATIENCE).toEqual({ high: 1, medium: 1, low: 2 });
    });

    it('a phone capped at 30 fps (Low Power Mode) keeps its scene for as long as it likes', () => {
      expect(feed(() => 33.4, 120_000, LOW)).toEqual([]);
      expect(feed(() => 33.4, 120_000, 1), 'and so would any other tier').toEqual([]);
    });

    it('one window of dropped frames at 30 fps is forgiven on the phone tier, and fatal without patience', () => {
      // A burst of 120 ms hitches between 1 s and 3 s (the first judged window), then steady 30 fps.
      const hitchy = (now: number) => (now > 1000 && now < 3000 ? 120 : 33.4);
      expect(feed(hitchy, 30_000, LOW)).toEqual([]);
      expect(feed(hitchy, 30_000, 1)).toEqual([{ action: 'give-up' }]);
    });

    it('a phone that stays slow is still given up on — one window later, and once', () => {
      const sampler = newSampler(0);
      const verdicts = feed(() => 55, GOVERNOR_WARMUP_MS + GOVERNOR_WINDOW_MS * 2 + 200, LOW, sampler);
      expect(verdicts).toEqual([{ action: 'give-up' }]);
      expect(feed(() => 55, GOVERNOR_WARMUP_MS + GOVERNOR_WINDOW_MS + 200, LOW), 'not after the first window').toEqual([]);
    });

    it('a good window in between wipes the slate', () => {
      // Bad, good, bad, good… never two in a row.
      const alternating = (now: number) => (Math.floor((now - GOVERNOR_WARMUP_MS) / GOVERNOR_WINDOW_MS) % 2 === 0 ? 55 : 20);
      expect(feed(alternating, 40_000, LOW)).toEqual([]);
    });

    it('a renderer that cannot draw a frame in a second gets a second run of stalls, no more', () => {
      const sampler = newSampler(0);
      const verdicts: GovernorVerdict[] = [];
      for (let i = 1; i <= GOVERNOR_STALL_STRIKES * 2; i++) verdicts.push(sampleFrame(sampler, i * 1500, 1500, MIN_PIXEL_RATIO, LOW));
      expect(verdicts.slice(0, -1).every((v) => v.action === 'keep')).toBe(true);
      expect(verdicts.at(-1)).toEqual({ action: 'give-up' });
    });

    it('shedding pixels is not held back by patience', () => {
      const sampler = newSampler(0);
      const verdicts: GovernorVerdict[] = [];
      for (let now = 55; now <= GOVERNOR_WARMUP_MS + GOVERNOR_WINDOW_MS + 200; now += 55) {
        const v = sampleFrame(sampler, now, 55, 1.5, LOW);
        if (v.action !== 'keep') verdicts.push(v);
      }
      expect(verdicts).toEqual([{ action: 'lower', pixelRatio: 1.13 }]);
    });
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

/**
 * Who gets live 3D, at what quality, and when the engine may be fetched.
 *
 * Pure: it is handed the facts and returns the decision, so the whole table is
 * unit-tested (tier.test.ts). Reading the device and probing WebGL happen in
 * bootstrap.ts.
 */

/** Rendering budget. `low` is the phone tier: fewer particles, lower pixel ratio. */
export type Tier = 'high' | 'medium' | 'low';

/**
 * When the engine may be requested.
 * - `idle`        once the page has loaded and the mount is on screen
 * - `interaction` only after the visitor's first touch or key press
 * - `never`       the still image is the whole experience
 */
export type Trigger = 'idle' | 'interaction' | 'never';

export interface Device {
  /** SCENE3D_ENABLED — the site-wide switch in src/data/scenes.ts. */
  enabled: boolean;
  /** OS reduced-motion or the on-page pause toggle. */
  motionOff: boolean;
  /** `navigator.connection.saveData`. */
  saveData: boolean;
  /** `prefers-contrast: more` — decoration behind text is exactly what this asks to lose. */
  moreContrast: boolean;
  /** `forced-colors: active` (Windows high contrast) — the mount is not displayed at all. */
  forcedColors: boolean;
  /** `navigator.deviceMemory` in GB; undefined where the browser hides it (Safari, Firefox). */
  deviceMemory: number | undefined;
  /** Viewport width in CSS pixels. */
  width: number;
  /** Primary pointer is coarse (a finger). */
  coarsePointer: boolean;
  /** A hover-capable pointer is present (a mouse or trackpad). */
  hover: boolean;
  /** This session already found the GPU too slow, or lost its context twice. */
  gaveUp: boolean;
}

export interface Plan {
  tier: Tier;
  trigger: Trigger;
  /** Why — surfaced as `data-scene-plan` for debugging and asserted in tests. */
  reason: string;
}

const still = (reason: string): Plan => ({ tier: 'low', trigger: 'never', reason });

export function pickPlan(d: Device): Plan {
  if (!d.enabled) return still('disabled');
  if (d.motionOff) return still('motion-off');
  if (d.saveData) return still('save-data');
  if (d.moreContrast) return still('more-contrast');
  if (d.forcedColors) return still('forced-colors');
  if (d.gaveUp) return still('gave-up');
  if (d.deviceMemory !== undefined && d.deviceMemory <= 4) return still('low-memory');

  /* Phones and tablets: a narrow viewport, or touch with nothing to hover with.
     Width is checked first so a desktop browser squeezed to phone width (and
     Lighthouse's mobile emulation, which sends no input) takes this path too.
     The engine waits for a first touch and for the page to finish loading, so it
     can never cost the initial load. */
  if (d.width < 768 || (d.coarsePointer && !d.hover)) {
    return { tier: 'low', trigger: 'interaction', reason: 'touch-device' };
  }

  /* Desktop class. Browsers that hide deviceMemory get the middle tier. */
  if (d.deviceMemory !== undefined && d.deviceMemory >= 8) {
    return { tier: 'high', trigger: 'idle', reason: 'desktop' };
  }
  return { tier: 'medium', trigger: 'idle', reason: 'desktop' };
}

/**
 * Is this GL renderer string a CPU rasteriser? Browsers fall back to one when the
 * GPU is blocklisted, in VMs and over remote desktop, and `failIfMajorPerformanceCaveat`
 * no longer reliably says so (Chromium's SwiftShader passes it). A still looks
 * better than a slideshow, so these never get the engine.
 */
export function isSoftwareRenderer(renderer: string | null | undefined): boolean {
  return /swiftshader|llvmpipe|softpipe|swrast|software|basic render|microsoft basic/i.test(renderer ?? '');
}

/** Pixel-ratio ceiling per tier; the frame-rate governor steps down from here. */
export const TIER_PIXEL_RATIO: Record<Tier, number> = { high: 2, medium: 1.5, low: 1.5 };

/**
 * Frame-rate governor, as a pure reducer. Feed it the average frame time of a
 * sampling window; it answers whether to carry on, render fewer pixels, or give
 * up and show the still.
 */
export const SLOW_FRAME_MS = 40; // under 25 fps
export const MIN_PIXEL_RATIO = 1;
/** Sampling: skip the first moments after (re)starting, then judge on a window of wall-clock
 *  time rather than a frame count — a GPU managing 3 fps must not get 30 seconds of grace. */
export const GOVERNOR_WARMUP_MS = 600;
export const GOVERNOR_WINDOW_MS = 2400;
export const GOVERNOR_MIN_FRAMES = 4;
/** A single gap this long is a suspension (sleep, a debugger, a long task), not a frame time. */
export const GOVERNOR_STALL_MS = 1000;

export type GovernorVerdict = { action: 'keep' } | { action: 'lower'; pixelRatio: number } | { action: 'give-up' };

export function govern(avgFrameMs: number, pixelRatio: number): GovernorVerdict {
  if (!(avgFrameMs > SLOW_FRAME_MS)) return { action: 'keep' };
  if (pixelRatio > MIN_PIXEL_RATIO) {
    return { action: 'lower', pixelRatio: Math.max(MIN_PIXEL_RATIO, Math.round(pixelRatio * 0.75 * 100) / 100) };
  }
  return { action: 'give-up' };
}

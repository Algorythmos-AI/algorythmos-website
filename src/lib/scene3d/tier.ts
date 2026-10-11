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
 * - `interaction` only after the visitor's first touch or key press (a phone on a
 *                 slow connection, or every phone when SCENE3D_TOUCH_AUTOSTART is off)
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
  /** `navigator.connection.effectiveType` is 3g or worse. False where the browser does not say (Safari, Firefox). */
  slowConnection: boolean;
  /** SCENE3D_TOUCH_AUTOSTART — phones and tablets start without waiting for a touch. */
  touchAutostart: boolean;
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

/** Below this much reported memory a device keeps the still. */
export const MIN_DEVICE_MEMORY_GB = 4;
/** `effectiveType` values that mean "do not fetch half a megabyte unasked". */
export function isSlowConnection(effectiveType: string | undefined): boolean {
  return effectiveType === 'slow-2g' || effectiveType === '2g' || effectiveType === '3g';
}

const still = (reason: string): Plan => ({ tier: 'low', trigger: 'never', reason });

export function pickPlan(d: Device): Plan {
  if (!d.enabled) return still('disabled');
  if (d.motionOff) return still('motion-off');
  if (d.saveData) return still('save-data');
  if (d.moreContrast) return still('more-contrast');
  if (d.forcedColors) return still('forced-colors');
  if (d.gaveUp) return still('gave-up');
  /* Under 4 GB the still is the kinder answer. A device reporting 4 GB (most mid-range
     phones) gets the `low` tier below, with the frame-rate governor watching it. */
  if (d.deviceMemory !== undefined && d.deviceMemory < MIN_DEVICE_MEMORY_GB) return still('low-memory');

  /* Phones and tablets: a narrow viewport, or touch with nothing to hover with.
     Width is checked first so a desktop browser squeezed to phone width takes this
     path too. They start as a desktop does — after the page has loaded, never as
     part of it — at the phone tier. On a connection known to be slow, or with the
     switch off, the engine waits for a first touch instead. */
  if (d.width < 768 || (d.coarsePointer && !d.hover)) {
    if (!d.touchAutostart) return { tier: 'low', trigger: 'interaction', reason: 'touch-device' };
    if (d.slowConnection) return { tier: 'low', trigger: 'interaction', reason: 'slow-connection' };
    return { tier: 'low', trigger: 'idle', reason: 'touch-device' };
  }

  /* Desktop class. Browsers that hide deviceMemory get the middle tier; a machine
     reporting the 4 GB minimum gets the phone tier. */
  if (d.deviceMemory !== undefined && d.deviceMemory <= MIN_DEVICE_MEMORY_GB) {
    return { tier: 'low', trigger: 'idle', reason: 'desktop' };
  }
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

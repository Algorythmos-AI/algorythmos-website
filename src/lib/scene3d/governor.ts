/**
 * The frame-rate governor: how many pixels a running scene may draw, and when to
 * give up and show the still.
 *
 * Pure, and unit-tested with the decision table (tier.test.ts). Only the engine
 * imports it, so it is fetched with the engine and not as part of any page's
 * first load — tier.ts, which every page with a scene loads, stays small.
 */
import type { Tier } from './tier';

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
/** One gap this long is a suspension (sleep, a debugger, a long task elsewhere), not a frame time… */
export const GOVERNOR_STALL_MS = 1000;
/** …but this many in a row is a GPU that cannot draw a frame in a second. */
export const GOVERNOR_STALL_STRIKES = 3;
/**
 * How many verdicts of "give up" in a row it takes to give up, per tier. A phone
 * capped at 30 fps (Low Power Mode) sits 7 ms from the line: one window with a few
 * dropped frames in it must not cost the visitor the scene for the whole session.
 * A good window in between wipes the slate.
 */
export const TIER_PATIENCE: Record<Tier, number> = { high: 1, medium: 1, low: 2 };

export type GovernorVerdict = { action: 'keep' } | { action: 'lower'; pixelRatio: number } | { action: 'give-up' };

export function govern(avgFrameMs: number, pixelRatio: number): GovernorVerdict {
  if (!(avgFrameMs > SLOW_FRAME_MS)) return { action: 'keep' };
  if (pixelRatio > MIN_PIXEL_RATIO) {
    return { action: 'lower', pixelRatio: Math.max(MIN_PIXEL_RATIO, Math.round(pixelRatio * 0.75 * 100) / 100) };
  }
  return { action: 'give-up' };
}

/** Sampling state between frames. Create with `newSampler(now)` whenever the loop (re)starts. */
export interface GovernorSampler {
  /** Frames before this time are warm-up and are not counted. */
  windowStart: number;
  frames: number;
  /** Consecutive frames that each took longer than GOVERNOR_STALL_MS. */
  stalls: number;
  /** Consecutive "give up" verdicts so far, counted against `patience`. */
  strikes: number;
}

export function newSampler(now: number): GovernorSampler {
  return { windowStart: now + GOVERNOR_WARMUP_MS, frames: 0, stalls: 0, strikes: 0 };
}

/**
 * Feed one frame to the governor: `now` is the frame's timestamp, `elapsed` the
 * time since the previous frame. Mutates `sampler`; returns what to do.
 *
 * A single long gap restarts the sample (the laptop slept, the tab was busy
 * elsewhere). A run of them is the opposite case — a renderer so slow that no
 * frame ever lands inside a window — and is judged on the gap itself.
 *
 * `patience` (TIER_PATIENCE) is how many "give up" verdicts in a row it takes
 * before one is returned; the ones before it are reported as "keep".
 */
export function sampleFrame(sampler: GovernorSampler, now: number, elapsed: number, pixelRatio: number, patience = 1): GovernorVerdict {
  const restart = (from: number) => {
    sampler.windowStart = from;
    sampler.frames = 0;
  };
  const judge = (avgFrameMs: number): GovernorVerdict => {
    const verdict = govern(avgFrameMs, pixelRatio);
    if (verdict.action !== 'give-up') {
      if (verdict.action === 'keep') sampler.strikes = 0;
      return verdict;
    }
    sampler.strikes++;
    if (sampler.strikes < patience) return { action: 'keep' };
    sampler.strikes = 0;
    return verdict;
  };
  if (elapsed > GOVERNOR_STALL_MS) {
    sampler.stalls++;
    restart(now + GOVERNOR_WARMUP_MS);
    if (sampler.stalls < GOVERNOR_STALL_STRIKES) return { action: 'keep' };
    sampler.stalls = 0;
    return judge(elapsed);
  }
  sampler.stalls = 0;
  if (now < sampler.windowStart) return { action: 'keep' };
  sampler.frames++;
  const span = now - sampler.windowStart;
  if (span < GOVERNOR_WINDOW_MS || sampler.frames < GOVERNOR_MIN_FRAMES) return { action: 'keep' };
  const verdict = judge(span / sampler.frames);
  /* After shedding pixels the resize itself costs a frame or two: warm up again. */
  restart(verdict.action === 'lower' ? now + GOVERNOR_WARMUP_MS : now);
  return verdict;
}

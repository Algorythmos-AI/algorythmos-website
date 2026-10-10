import type { Page } from '@playwright/test';

export const MOUNT = '[data-scene]';
export const STAGE = 'canvas.scene3d-stage';
/** The lazily loaded three.js chunk, as built (astro.config.mjs names it). */
export const ENGINE_CHUNK = /\/_astro\/scene3d-engine\./;
/** The home scene's own chunk, fetched by the engine once it is up. */
export const HOME_SCENE_CHUNK = /\/_astro\/neural-core\./;

/**
 * Let a scene start on the software renderer CI and headless browsers use. A real
 * visitor on software rendering keeps the still; this is test-only. `governed`
 * leaves the frame-rate governor on.
 */
export async function forceScene(page: Page, mode: true | 'governed' = true): Promise<void> {
  await page.addInitScript((m) => {
    (window as unknown as { __scene3dForce?: unknown }).__scene3dForce = m;
  }, mode);
}

/** A browser with no usable WebGL2 — deterministic, whatever GPU the machine has. */
export async function noWebgl(page: Page): Promise<void> {
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (this: HTMLCanvasElement, type: string, ...rest: unknown[]) {
      if (type === 'webgl2' || type === 'webgl' || type === 'experimental-webgl') return null;
      return (original as (...a: unknown[]) => unknown).call(this, type, ...rest);
    } as typeof HTMLCanvasElement.prototype.getContext;
  });
}

/**
 * Can this browser build create a WebGL2 context at all? Headless Firefox and
 * WebKit on a GPU-less runner sometimes cannot; tests that need a live scene
 * skip there, visibly, rather than fail on the machine instead of the code.
 */
export async function hasWebgl2(page: Page): Promise<boolean> {
  if (page.url() === 'about:blank') await page.goto('/au-en/legal-notice');
  return page.evaluate(() => !!document.createElement('canvas').getContext('webgl2'));
}

/** Record every request for the engine chunk. */
export function watchEngine(page: Page): string[] {
  const hits: string[] = [];
  page.on('request', (req) => {
    if (ENGINE_CHUNK.test(req.url())) hits.push(req.url());
  });
  return hits;
}

/**
 * Collect uncaught errors and console errors for a page.
 *
 * One rejection is not ours and not a fault: when a navigation interrupts the
 * previous page's cross-fade, the browser rejects that ViewTransition's promises
 * with "Transition was skipped", which the client router leaves unhandled.
 */
export function watchErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on('pageerror', (e) => {
    if (/Transition was skipped/.test(String(e))) return;
    errors.push(`pageerror: ${e}`);
  });
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(`console: ${msg.text()}`);
  });
  return errors;
}

export interface Stats {
  geometries: number;
  textures: number;
  programs: number;
  frames: number;
}
export function stats(page: Page): Promise<Stats | null> {
  return page.evaluate(() => (window as unknown as { __scene3dStats: () => Promise<Stats | null> }).__scene3dStats());
}

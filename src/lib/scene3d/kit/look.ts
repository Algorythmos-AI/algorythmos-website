import { NeutralToneMapping, SRGBColorSpace, type WebGLRenderer } from 'three';

/**
 * Everything renderer-wide that decides how a scene looks. It lives in the kit —
 * not the engine — because the kit is what a still's fingerprint is taken from:
 * change the lens or the tone curve and every still must be captured again;
 * change the engine's plumbing and none need be.
 */

/** Vertical field of view, in degrees, of every scene's camera. */
export const FOV = 37;

export function applyLook(renderer: WebGLRenderer): void {
  renderer.setClearColor(0x000000, 0); // transparent: the page shows through
  renderer.outputColorSpace = SRGBColorSpace;
  /* Neutral keeps the brand hues where the tokens put them; filmic curves shift them. */
  renderer.toneMapping = NeutralToneMapping;
}

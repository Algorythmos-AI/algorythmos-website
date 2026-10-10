import type { PerspectiveCamera } from 'three';
import type { SceneInput, Viewport } from '../types';
import { FOV } from './look';

/**
 * Pull the camera back until a subject `halfExtent` world units tall and wide
 * fits the mount, whatever its shape. Inner-page mounts are wider than tall on
 * desktop and taller than wide behind the text on a phone.
 */
export function frameSubject(camera: PerspectiveCamera, view: Viewport, halfExtent: number, margin = 1.08): void {
  const fit = (halfExtent * margin) / Math.tan((FOV * Math.PI) / 360);
  camera.position.z = fit / Math.min(1, view.aspect);
  camera.updateProjectionMatrix();
}

/** Smoothstep on a clamped 0…1 value. */
export function smooth(x: number): number {
  const t = Math.min(1, Math.max(0, x));
  return t * t * (3 - 2 * t);
}

/** How far the scene has scrolled away, eased; 0 at rest. */
export const exit = (input: SceneInput): number => smooth(input.scroll);

/**
 * 3D scene catalogue — which scene a page shows.
 *
 * Scenes are decorative: no words, no claims, `aria-hidden`. The engine, the
 * loading rules and the fallbacks live in src/lib/scene3d; authoring guide in
 * docs/SCENES.md. This file is imported by first-load code, so it must never
 * import three or anything under src/lib/scene3d/scenes.
 */

/**
 * Site-wide switch. `false` renders every mount as its still image and no page
 * ever requests the 3D engine — a one-line rollback that needs no revert.
 */
export const SCENE3D_ENABLED = true;

export const SCENE_IDS = ['neural-core'] as const;
export type SceneId = (typeof SCENE_IDS)[number];

export interface SceneRef {
  id: SceneId;
  /** Scene-specific variation: a camera, a state, a highlighted element. */
  variant?: string;
}

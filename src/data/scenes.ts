/**
 * 3D scene catalogue — which scene a page shows.
 *
 * Scenes are decorative: no words, no claims, `aria-hidden`. The engine, the
 * loading rules and the fallbacks live in src/lib/scene3d; authoring guide in
 * docs/SCENES.md. This file is imported by first-load code, so it must never
 * import three or anything under src/lib/scene3d/scenes.
 * Which page shows which scene is decided at build time in sceneMap.ts, which
 * is kept out of this file so the related-content map never ships to a browser.
 */

/**
 * Site-wide switch. `false` renders every mount as its still image and no page
 * ever requests the 3D engine — a one-line rollback that needs no revert.
 */
export const SCENE3D_ENABLED = true;

export const SCENE_IDS = [
  'neural-core',
  'constellation',
  'globe',
  'ledger',
  'pages',
  'scan',
  'lost-satellite',
  // One per service (stage 3):
  'agent-swarm',
  'llm-lattice',
  'monitor-radar',
  'feature-vault',
  'dash-terrain',
  'robot-sorter',
  'model-pipeline',
  'platform-station',
  'holo-site',
  'port-yard',
] as const;
export type SceneId = (typeof SCENE_IDS)[number];

export interface SceneRef {
  id: SceneId;
  /** Scene-specific variation: a camera, a state, a highlighted element. */
  variant?: string;
}

/**
 * Variants that have a still of their own, because the variant changes what the
 * picture says (a currency, a different subject). Every other variant only turns
 * the scene or highlights part of it, and shares the scene's base still.
 */
export const STILL_VARIANTS: Partial<Record<SceneId, readonly string[]>> = {
  ledger: ['aud', 'eur', 'audit'],
  globe: ['sydney', 'paris'],
};

/** File stem of the still for a scene reference (`ledger@eur`, `constellation`). */
export function stillKey(ref: SceneRef): string {
  return ref.variant && STILL_VARIANTS[ref.id]?.includes(ref.variant) ? `${ref.id}@${ref.variant}` : ref.id;
}

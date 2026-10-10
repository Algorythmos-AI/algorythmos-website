/**
 * Scene registry. Each entry is its own lazy chunk, fetched only after the engine
 * is up. Adding a scene: add its id to SCENE_IDS in src/data/scenes.ts, then a
 * line here — `satisfies` fails the build if the two drift.
 */
import type { SceneId } from '@/data/scenes';
import type { SceneModule } from './types';

export const scenes = {
  'neural-core': () => import('./scenes/neural-core'),
} satisfies Record<SceneId, () => Promise<SceneModule>>;

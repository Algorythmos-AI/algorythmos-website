/**
 * Scene registry. Each entry is its own lazy chunk, fetched only after the engine
 * is up. Adding a scene: add its id to SCENE_IDS in src/data/scenes.ts, then a
 * line here — `satisfies` fails the build if the two drift.
 */
import type { SceneId } from '@/data/scenes';
import type { SceneModule } from './types';

export const scenes = {
  'neural-core': () => import('./scenes/neural-core'),
  'constellation': () => import('./scenes/constellation'),
  'globe': () => import('./scenes/globe'),
  'ledger': () => import('./scenes/ledger'),
  'pages': () => import('./scenes/pages'),
  'scan': () => import('./scenes/scan'),
  'lost-satellite': () => import('./scenes/lost-satellite'),
  'agent-swarm': () => import('./scenes/agent-swarm'),
  'llm-lattice': () => import('./scenes/llm-lattice'),
  'monitor-radar': () => import('./scenes/monitor-radar'),
  'feature-vault': () => import('./scenes/feature-vault'),
  'dash-terrain': () => import('./scenes/dash-terrain'),
  'robot-sorter': () => import('./scenes/robot-sorter'),
  'model-pipeline': () => import('./scenes/model-pipeline'),
  'platform-station': () => import('./scenes/platform-station'),
  'holo-site': () => import('./scenes/holo-site'),
  'port-yard': () => import('./scenes/port-yard'),
} satisfies Record<SceneId, () => Promise<SceneModule>>;

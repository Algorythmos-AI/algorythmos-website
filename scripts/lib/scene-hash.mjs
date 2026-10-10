// scripts/lib/scene-hash.mjs
// Fingerprint of everything that decides what a scene looks like: its own source,
// the shared kit (materials, lighting, lens and tone curve — kit/look.ts) and the
// theme tokens it is coloured from. The engine's plumbing is deliberately left out. Written into src/assets/scenes/manifest.json when stills
// are captured, and recomputed by src/data/scenes.test.ts — so editing a scene
// without re-capturing its still fails the unit tests.

import { createHash } from 'crypto';
import fs from 'fs';
import path from 'path';

export function sceneHash(root, id) {
  const lib = path.join(root, 'src', 'lib', 'scene3d');
  const kit = path.join(lib, 'kit');
  const files = [
    path.join(lib, 'scenes', `${id}.ts`),
    ...fs.readdirSync(kit).filter((f) => f.endsWith('.ts')).sort().map((f) => path.join(kit, f)),
    path.join(root, 'src', 'styles', 'themes.css'),
  ];
  const hash = createHash('sha256');
  for (const file of files) {
    hash.update(path.relative(root, file));
    hash.update(fs.readFileSync(file));
  }
  return hash.digest('hex').slice(0, 16);
}

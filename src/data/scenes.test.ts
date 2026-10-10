import { describe, it, expect } from 'vitest';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { sceneHash } from '../../scripts/lib/scene-hash.mjs';
import { blog } from './blog';
import { caseStudies } from './caseStudies';
import { sceneFor } from './sceneMap';
import { SCENE_IDS, stillKey } from './scenes';
import { serviceSlugs } from './services';

const ROOT = fileURLToPath(new URL('../..', import.meta.url));
const LIB = join(ROOT, 'src', 'lib', 'scene3d');
const STILLS = join(ROOT, 'src', 'assets', 'scenes');
const read = (...parts: string[]) => readFileSync(join(ROOT, ...parts), 'utf-8');

/* A still is a fallback picture, not the main event: keep it cheap to download. */
const STILL_CAP_KB = { 960: 150, 480: 60 } as const;

describe('scene catalogue', () => {
  it('has no scene file that the catalogue does not list', () => {
    const files = readdirSync(join(LIB, 'scenes')).filter((f) => f.endsWith('.ts')).map((f) => f.replace(/\.ts$/, ''));
    expect(files.sort()).toEqual([...SCENE_IDS].sort());
  });

  describe.each(SCENE_IDS)('%s', (id) => {
    it('has a scene module with the engine contract', () => {
      const file = join(LIB, 'scenes', `${id}.ts`);
      expect(existsSync(file), file).toBe(true);
      const source = readFileSync(file, 'utf-8');
      expect(source).toMatch(/export const stillAt = /);
      expect(source).toMatch(/export function create\(ctx: SceneContext\): SceneInstance/);
      expect(source, 'frees what it puts on the GPU').toContain('disposeTree(');
    });

    it('is registered as its own lazy chunk', () => {
      expect(read('src', 'lib', 'scene3d', 'registry.ts')).toContain(`'${id}': () => import('./scenes/${id}')`);
    });

    it('has stills captured from its current source', () => {
      const manifest = JSON.parse(read('src', 'assets', 'scenes', 'manifest.json')) as Record<string, string>;
      expect(
        manifest[id],
        `the scene or the kit changed since its still was captured — run "npm run build && npm run scenes:posters ${id}"`,
      ).toBe(sceneHash(ROOT, id));
    });
  });

  /* Every still a page can ask for: the home scene, plus whatever the page map resolves to. */
  const refs = [
    { id: 'neural-core' as const },
    ...(['services', 'case-studies', 'blog', 'about', 'contact', 'careers', 'press', 'product', 'not-found'] as const).map((p) => sceneFor(p)),
    sceneFor('pricing', undefined, 'au-en'),
    sceneFor('pricing', undefined, 'fr-fr'),
    sceneFor('local', 'sydney'),
    sceneFor('local', 'paris'),
    ...serviceSlugs.map((s) => sceneFor('service', s)),
    ...caseStudies.map((c) => sceneFor('case-study', c.slug)),
    ...blog.map((p) => sceneFor('post', p.slug)),
  ];
  const keys = [...new Set(refs.map(stillKey))].sort();

  it.each(keys)('still %s exists in both themes, under the size cap', (key) => {
    for (const theme of ['dark', 'light']) {
      for (const width of [960, 480] as const) {
        const file = join(STILLS, `${key}-${theme}-${width}.avif`);
        expect(existsSync(file), `${file} — run "npm run build && npm run scenes:posters"`).toBe(true);
        expect(statSync(file).size / 1024, file).toBeLessThan(STILL_CAP_KB[width]);
      }
    }
  });

  it('has no still that no page asks for', () => {
    const files = readdirSync(STILLS).filter((f) => f.endsWith('.avif'));
    const orphans = files.filter((f) => !keys.includes(f.replace(/-(dark|light)-(480|960)\.avif$/, '')));
    expect(orphans).toEqual([]);
  });
});

describe('first-load code never reaches three', () => {
  /* The bundle gate proves this on the built output; this catches it at the keyboard.
     These modules are on every page that has a scene (or on every page, full stop). */
  const FIRST_LOAD = [
    ['src', 'lib', 'scene3d', 'bootstrap.ts'],
    ['src', 'lib', 'scene3d', 'tier.ts'],
    ['src', 'data', 'scenes.ts'],
    ['src', 'components', 'ui', 'Scene3D.astro'],
    ['src', 'lib', 'motion.ts'],
    ['src', 'lib', 'idle.ts'],
    ['src', 'lib', 'tokens.ts'],
  ];
  it.each(FIRST_LOAD)('%s/%s/%s%s', (...parts) => {
    const source = read(...parts.filter(Boolean));
    const valueImports = [
      ...source.matchAll(/^import\s+(?!type\b)[^;]*?\bfrom\s+['"]([^'"]+)['"]/gms), // import … from '…'
      ...source.matchAll(/^import\s+['"]([^'"]+)['"]/gm), // import '…'
    ].map((m) => m[1]);
    for (const spec of valueImports) {
      expect(spec, `${parts.join('/')} imports ${spec}`).not.toMatch(/^three($|\/)|\/(engine|registry)$|\/(kit|scenes)\//);
    }
  });

  it('reaches the engine only through a dynamic import', () => {
    expect(read('src', 'lib', 'scene3d', 'bootstrap.ts')).toContain("import('./engine')");
  });
});

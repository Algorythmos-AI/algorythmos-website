// scripts/lib/perf-gate.mjs
// The measuring and judging half of `npm run perf`, kept free of printing so the
// rules can be unit-tested against fixture builds (src/lib/perfGate.test.ts).
//
// Rules, all of them build-failing:
//   1. No client chunk in dist/_astro may exceed SIZE_LIMIT_KB …
//   2. … except the lazily loaded 3D engine, which has its own cap and must be
//      exactly one file when present.
//   3. No page may reach that engine through its HTML or its static-import chain.
//      It is only ever fetched by a dynamic import, after the page has loaded.
//   4. The home page's first-load JS — every chunk its HTML names plus everything
//      those import statically — stays under HOME_FIRST_LOAD_LIMIT_KB.

import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

export const SIZE_LIMIT_KB = 200;
export const WARNING_LIMIT_KB = 100;
/** The one chunk allowed past SIZE_LIMIT_KB. Named by the codeSplitting group in astro.config.mjs. */
export const ENGINE_CHUNK_RE = /^scene3d-engine\.[\w-]+\.js$/;
/* three.js measures ~537 kB with today's scenes and ~563 kB with everything the
   planned ones import (the renderer alone is ~510 kB — it does not tree-shake).
   Approved cap: the larger figure + 10%. */
export const ENGINE_LIMIT_KB = 620;
export const HOME_PAGES = ['au-en/index.html', 'fr-fr/index.html'];
export const HOME_FIRST_LOAD_LIMIT_KB = 46;

const HTML_CHUNK_RE = /\/_astro\/([^"'()\s<>]+\.js)/g;
/* `import x from "./a.js"`, `import "./a.js"` and `export … from "./a.js"`, as the
   minifier writes them. A dynamic `import("./a.js")` has a `(` before the quote
   and so never matches — which is the whole point of rule 3. */
const STATIC_IMPORT_RE = /(?:import|export)\s*(?:[^'"`()]*?\bfrom\s*)?["'`](?:\.\.?\/|\/_astro\/)([^"'`]+\.js)["'`]/g;

function gzipSize(buf) {
  try {
    return zlib.gzipSync(buf).length;
  } catch {
    return 0;
  }
}

function statAsset(dir, name) {
  const buf = fs.readFileSync(path.join(dir, name));
  return { name, size: buf.length, sizeKb: buf.length / 1024, gzip: gzipSize(buf) };
}

/** Sibling chunks a chunk imports statically (file names within dist/_astro, which is flat). */
export function staticImports(code) {
  const out = new Set();
  for (const m of code.matchAll(STATIC_IMPORT_RE)) out.add(m[1].split('/').pop());
  return [...out];
}

/** /_astro/*.js chunks an HTML document names (script src, modulepreload, inline imports). */
export function htmlChunks(html) {
  const out = new Set();
  for (const m of html.matchAll(HTML_CHUNK_RE)) out.add(m[1]);
  return [...out];
}

/** Everything a page downloads before it can run: its named chunks plus their static imports, transitively. */
export function pageClosure(astroDir, html) {
  const seen = new Set();
  const queue = htmlChunks(html);
  while (queue.length) {
    const name = queue.pop();
    if (seen.has(name)) continue;
    const file = path.join(astroDir, name);
    if (!fs.existsSync(file)) continue;
    seen.add(name);
    queue.push(...staticImports(fs.readFileSync(file, 'utf-8')));
  }
  return [...seen];
}

function htmlFiles(dir, base = dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== '_astro') htmlFiles(full, base, out);
    } else if (entry.name.endsWith('.html')) {
      out.push(path.relative(base, full));
    }
  }
  return out;
}

/**
 * Measure a build and apply the rules.
 * @param {string} distDir
 * @returns {{ built: boolean, jsFiles: any[], cssFiles: any[], engine: any[],
 *   home: { page: string, chunks: any[], size: number, gzip: number }[], failures: string[] }}
 */
export function analyze(distDir, limits = {}) {
  const sizeLimit = limits.sizeLimitKb ?? SIZE_LIMIT_KB;
  const engineLimit = limits.engineLimitKb ?? ENGINE_LIMIT_KB;
  const homeLimit = limits.homeFirstLoadLimitKb ?? HOME_FIRST_LOAD_LIMIT_KB;
  const astroDir = path.join(distDir, '_astro');
  const result = { built: false, jsFiles: [], cssFiles: [], engine: [], home: [], failures: [] };

  if (!fs.existsSync(astroDir)) {
    result.failures.push('No dist/_astro folder: run "npm run build" first.');
    return result;
  }
  result.built = true;

  const entries = fs.readdirSync(astroDir);
  const bySize = (a, b) => b.size - a.size;
  result.jsFiles = entries.filter((f) => f.endsWith('.js')).map((f) => statAsset(astroDir, f)).sort(bySize);
  result.cssFiles = entries.filter((f) => f.endsWith('.css')).map((f) => statAsset(astroDir, f)).sort(bySize);
  result.engine = result.jsFiles.filter((f) => ENGINE_CHUNK_RE.test(f.name));
  const kb = (n) => `${n.toFixed(2)} kB`;

  // Rules 1 + 2 — chunk size.
  for (const f of result.jsFiles) {
    const isEngine = ENGINE_CHUNK_RE.test(f.name);
    const limit = isEngine ? engineLimit : sizeLimit;
    if (f.sizeKb > limit) {
      result.failures.push(`${f.name} is ${kb(f.sizeKb)}, over the ${limit} kB ${isEngine ? '3D engine' : 'chunk'} limit.`);
    }
  }
  if (result.engine.length > 1) {
    result.failures.push(
      `${result.engine.length} 3D engine chunks emitted (${result.engine.map((f) => f.name).join(', ')}); expected exactly one.`,
    );
  }

  // Rule 3 — the engine is never part of a page's first load.
  const engineNames = new Set(result.engine.map((f) => f.name));
  const closures = new Map();
  let scenePages = 0;
  for (const rel of htmlFiles(distDir)) {
    const html = fs.readFileSync(path.join(distDir, rel), 'utf-8');
    const closure = pageClosure(astroDir, html);
    closures.set(rel.split(path.sep).join('/'), closure);
    if (/\sdata-scene=/.test(html)) scenePages++;
    if (html.includes('scene3d-engine.')) {
      result.failures.push(`${rel} names the 3D engine in its HTML; it must only be fetched by a dynamic import.`);
    } else if (closure.some((name) => engineNames.has(name))) {
      result.failures.push(`${rel} reaches the 3D engine through a static import; it must only be fetched by a dynamic import.`);
    }
  }

  /* Pages mount scenes but no chunk carries the engine's name: the codeSplitting
     group in astro.config.mjs has stopped applying, three has landed somewhere
     unnamed, and rule 3 would be guarding nothing. */
  if (scenePages > 0 && result.engine.length === 0) {
    result.failures.push(
      `${scenePages} page(s) mount a 3D scene but no scene3d-engine chunk was emitted; the engine cannot be told apart from first-load code.`,
    );
  }

  // Rule 4 — home first-load ceiling.
  for (const page of HOME_PAGES) {
    const closure = closures.get(page);
    if (!closure) {
      result.failures.push(`${page} is missing from the build, so its first-load JS cannot be measured.`);
      continue;
    }
    const chunks = closure.map((name) => result.jsFiles.find((f) => f.name === name)).filter(Boolean).sort(bySize);
    const size = chunks.reduce((s, f) => s + f.size, 0);
    const gzip = chunks.reduce((s, f) => s + f.gzip, 0);
    result.home.push({ page, chunks, size, gzip });
    if (size / 1024 > homeLimit) {
      result.failures.push(`${page} first-load JS is ${kb(size / 1024)}, over the ${homeLimit} kB ceiling.`);
    }
  }

  return result;
}

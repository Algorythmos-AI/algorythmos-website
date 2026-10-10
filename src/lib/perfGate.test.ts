/**
 * The bundle gate guards the build, so it gets its own proof that it fails when
 * it should. Each case writes a miniature dist/ and runs the real rules over it.
 */
import { afterEach, describe, expect, it } from 'vitest';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { analyze, htmlChunks, staticImports } from '../../scripts/lib/perf-gate.mjs';

const dirs: string[] = [];
afterEach(() => {
  for (const d of dirs.splice(0)) rmSync(d, { recursive: true, force: true });
});

/** Write a fake build: page path → HTML, chunk name → source (or a byte count of padding). */
function build(pages: Record<string, string>, chunks: Record<string, string | number>): string {
  const dist = mkdtempSync(join(tmpdir(), 'perf-gate-'));
  dirs.push(dist);
  mkdirSync(join(dist, '_astro'), { recursive: true });
  for (const [name, body] of Object.entries(chunks)) {
    writeFileSync(join(dist, '_astro', name), typeof body === 'number' ? 'x'.repeat(body) : body);
  }
  for (const [rel, html] of Object.entries(pages)) {
    mkdirSync(join(dist, rel, '..'), { recursive: true });
    writeFileSync(join(dist, rel), html);
  }
  return dist;
}
const script = (name: string) => `<script type="module" src="/_astro/${name}"></script>`;
const LIMITS = { sizeLimitKb: 200, engineLimitKb: 620, homeFirstLoadLimitKb: 46 };
const ENGINE = 'scene3d-engine.Ab3_x-9Z.js';
const KB = 1024;
/** Both home pages, shipping no JS — what every fixture needs for the home ceiling rule to pass. */
const HOMES = { 'au-en/index.html': '', 'fr-fr/index.html': '' };

describe('static import detection', () => {
  it('follows static imports and re-exports as the minifier writes them', () => {
    const code = 'import{a as b}from"./motion.B1.js";import"./side.C2.js";export{c}from"./re.D3.js";';
    expect(staticImports(code).sort()).toEqual(['motion.B1.js', 're.D3.js', 'side.C2.js']);
  });

  it('follows parent-relative and root-relative specifiers too', () => {
    const code = 'import{a}from"../_astro/up.A.js";import b from"/_astro/root.B.js";import*as c from"./star.C.js";';
    expect(staticImports(code).sort()).toEqual(['root.B.js', 'star.C.js', 'up.A.js']);
  });

  it('never treats a dynamic import as a static one', () => {
    expect(staticImports('const e=()=>import("./scene3d-engine.Ab3.js");')).toEqual([]);
    expect(staticImports('await import(`./scene3d-engine.Ab3.js`)')).toEqual([]);
  });

  it('collects every chunk an HTML document names', () => {
    const html = `${script('page.A.js')}<link rel="modulepreload" href="/_astro/pre.B.js">`;
    expect(htmlChunks(html).sort()).toEqual(['page.A.js', 'pre.B.js']);
  });
});

describe('perf gate', () => {
  it('passes a build whose engine is only reached by a dynamic import', () => {
    const dist = build(
      { 'au-en/index.html': script('boot.A.js'), 'fr-fr/index.html': script('boot.A.js') },
      { 'boot.A.js': `import{m}from"./motion.B.js";const load=()=>import("./${ENGINE}");`, 'motion.B.js': 2 * KB, [ENGINE]: 560 * KB },
    );
    const report = analyze(dist, LIMITS);
    expect(report.failures).toEqual([]);
    expect(report.engine.map((f) => f.name)).toEqual([ENGINE]);
    expect(report.home.map((h) => h.chunks.map((c) => c.name).sort())).toEqual([
      ['boot.A.js', 'motion.B.js'],
      ['boot.A.js', 'motion.B.js'],
    ]);
  });

  it('fails when there is no build to measure', () => {
    const dist = mkdtempSync(join(tmpdir(), 'perf-gate-'));
    dirs.push(dist);
    const report = analyze(dist, LIMITS);
    expect(report.built).toBe(false);
    expect(report.failures).toHaveLength(1);
  });

  it('fails an ordinary chunk over 200 kB', () => {
    const dist = build({ ...HOMES, 'au-en/about.html': '' }, { 'Chart.A.js': 201 * KB });
    expect(analyze(dist, LIMITS).failures).toEqual([expect.stringContaining('Chart.A.js')]);
  });

  it('holds the engine to its own cap, not the general one', () => {
    const ok = build({ ...HOMES, 'au-en/about.html': '' }, { [ENGINE]: 619 * KB });
    expect(analyze(ok, LIMITS).failures).toEqual([]);
    const over = build({ ...HOMES, 'au-en/about.html': '' }, { [ENGINE]: 621 * KB });
    expect(analyze(over, LIMITS).failures).toEqual([expect.stringContaining('3D engine limit')]);
  });

  it('fails when more than one engine chunk is emitted', () => {
    const dist = build({ ...HOMES, 'au-en/about.html': '' }, { [ENGINE]: KB, 'scene3d-engine.Zz9.js': KB });
    expect(analyze(dist, LIMITS).failures).toEqual([expect.stringContaining('expected exactly one')]);
  });

  it('fails when a page names the engine in its HTML', () => {
    const dist = build({ ...HOMES, 'au-en/services.html': `<link rel="modulepreload" href="/_astro/${ENGINE}">` }, { [ENGINE]: KB });
    expect(analyze(dist, LIMITS).failures).toEqual([expect.stringContaining('names the 3D engine in its HTML')]);
  });

  it('fails when a page reaches the engine through a chain of static imports', () => {
    const dist = build(
      { ...HOMES, 'au-en/services.html': script('page.A.js') },
      { 'page.A.js': 'import"./boot.B.js";', 'boot.B.js': `import{R}from"./${ENGINE}";`, [ENGINE]: KB },
    );
    expect(analyze(dist, LIMITS).failures).toEqual([expect.stringContaining('static import')]);
  });

  it('fails when pages mount scenes but no chunk carries the engine name', () => {
    // The codeSplitting group stopped applying: three is somewhere unnamed, rule 3 guards nothing.
    const dist = build(
      { 'au-en/index.html': '<div data-scene="neural-core"></div>' + script('boot.A.js'), 'fr-fr/index.html': script('boot.A.js') },
      { 'boot.A.js': 'const load=()=>import("./engine.B.js");', 'engine.B.js': 150 * KB },
    );
    expect(analyze(dist, LIMITS).failures).toEqual([expect.stringContaining('no scene3d-engine chunk was emitted')]);
  });

  it('fails when a home page is missing, rather than skipping its ceiling', () => {
    const dist = build({ 'au-en/index.html': script('small.C.js') }, { 'small.C.js': KB });
    expect(analyze(dist, LIMITS).failures).toEqual([expect.stringContaining('fr-fr/index.html is missing')]);
  });

  it('fails when home first-load JS passes its ceiling, counting statically imported chunks', () => {
    const dist = build(
      { 'au-en/index.html': script('page.A.js'), 'fr-fr/index.html': script('small.C.js') },
      { 'page.A.js': 'import"./heavy.B.js";' + 'x'.repeat(20 * KB), 'heavy.B.js': 30 * KB, 'small.C.js': KB },
    );
    expect(analyze(dist, LIMITS).failures).toEqual([expect.stringContaining('au-en/index.html first-load JS')]);
  });
});

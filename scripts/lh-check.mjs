/**
 * Mobile Lighthouse performance budget — advisory.
 *
 * Builds are assumed present (run `npm run build` first). Boots `astro preview`,
 * audits a few representative URLs on mobile emulation, and reports LCP / CLS /
 * TBT against the Core Web Vitals budget. Exits 0 regardless (advisory) unless
 * invoked with `--strict`, which fails the process when any budget is breached.
 *
 * Usage: npm run lh   (add -- --strict to enforce)
 */
import { spawn } from 'node:child_process';
import { setTimeout as sleep } from 'node:timers/promises';

const PORT = 4399;
const STRICT = process.argv.includes('--strict');
const BUDGET = { lcp: 2500, cls: 0.1, tbt: 300 }; // ms / unitless / ms
const URLS = [
  { label: 'home (au-en)', path: '/au-en' },
  { label: 'service (fr-fr)', path: '/fr-fr/services/agentic-automation' },
  { label: 'case study (au-en)', path: '/au-en/case-studies/port-botany-ai-ml' },
];

const preview = spawn('npx', ['astro', 'preview', '--port', String(PORT)], { stdio: 'ignore' });
const base = `http://localhost:${PORT}`;

async function waitForServer(timeoutMs = 20000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const r = await fetch(`${base}/`);
      if (r.ok) return;
    } catch {
      /* not up yet */
    }
    await sleep(400);
  }
  throw new Error('preview server did not start');
}

async function runLighthouse(url) {
  return new Promise((resolve) => {
    const args = [
      'lighthouse', url,
      '--only-categories=performance',
      '--form-factor=mobile', '--screenEmulation.mobile',
      '--chrome-flags=--headless=new --no-sandbox',
      '--quiet', '--output=json', '--output-path=stdout',
    ];
    const proc = spawn('npx', args, { stdio: ['ignore', 'pipe', 'ignore'] });
    let out = '';
    proc.stdout.on('data', (d) => (out += d));
    proc.on('close', () => {
      try {
        const r = JSON.parse(out);
        const a = r.audits;
        resolve({
          score: Math.round(r.categories.performance.score * 100),
          lcp: a['largest-contentful-paint'].numericValue,
          cls: a['cumulative-layout-shift'].numericValue,
          tbt: a['total-blocking-time'].numericValue,
        });
      } catch {
        resolve(null);
      }
    });
  });
}

let breaches = 0;
try {
  await waitForServer();
  console.log(`\n  Lighthouse mobile budget — LCP<${BUDGET.lcp}ms · CLS<${BUDGET.cls} · TBT<${BUDGET.tbt}ms\n`);
  for (const { label, path } of URLS) {
    const m = await runLighthouse(`${base}${path}`);
    if (!m) {
      console.log(`  ⚠️  ${label}: Lighthouse run failed (skipped)`);
      continue;
    }
    const flags = [];
    if (m.lcp > BUDGET.lcp) flags.push('LCP');
    if (m.cls > BUDGET.cls) flags.push('CLS');
    if (m.tbt > BUDGET.tbt) flags.push('TBT');
    breaches += flags.length;
    const mark = flags.length ? '❌' : '✅';
    console.log(
      `  ${mark} ${label.padEnd(22)} perf ${m.score}  LCP ${Math.round(m.lcp)}ms  CLS ${m.cls.toFixed(3)}  TBT ${Math.round(m.tbt)}ms` +
        (flags.length ? `  → over budget: ${flags.join(', ')}` : ''),
    );
  }
} catch (e) {
  console.error(`  Lighthouse check error: ${e.message}`);
} finally {
  preview.kill();
}

if (breaches > 0 && STRICT) {
  console.error(`\n  ${breaches} budget breach(es) — failing (strict mode).\n`);
  process.exit(1);
}
console.log(`\n  ${breaches === 0 ? 'All URLs within budget.' : `${breaches} breach(es) — advisory only.`}\n`);
process.exit(0);

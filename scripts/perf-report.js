#!/usr/bin/env node
// scripts/perf-report.js
// Bundle performance analysis for the Astro 6 build.
//
// Analyses the emitted client assets in dist/_astro/*.{js,css}:
//   - total + per-file sizes (raw + gzip)
//   - flags any single JS chunk > 200 kB (warning)
//   - reports the JS actually referenced by dist/au-en/index.html as the
//     "home first-load" cost
//
// Astro is islands-first, so most pages ship little/zero JS. This is advisory:
// it prints warnings and uses an informational exit code but is wired into CI
// as non-fatal (it does NOT fail the build).
//
// Run: npm run perf   (after `npm run build`)

import fs from 'fs';
import path from 'path';
import zlib from 'zlib';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT = path.join(__dirname, '..');
const DIST_DIR = path.join(ROOT, 'dist');
const ASTRO_DIR = path.join(DIST_DIR, '_astro');
const HOME_HTML = path.join(DIST_DIR, 'au-en', 'index.html');

const SIZE_LIMIT_KB = 200; // single-chunk warning threshold
const WARNING_LIMIT_KB = 100; // "getting big" advisory threshold

const colors = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

function formatSize(bytes) {
  const kb = bytes / 1024;
  if (kb >= 1024) return `${(kb / 1024).toFixed(2)} MB`;
  return `${kb.toFixed(2)} kB`;
}

function gzipSize(buf) {
  try {
    return zlib.gzipSync(buf).length;
  } catch {
    return 0;
  }
}

function statAsset(dir, name) {
  const full = path.join(dir, name);
  const buf = fs.readFileSync(full);
  return {
    name,
    size: buf.length,
    sizeKb: buf.length / 1024,
    gzip: gzipSize(buf),
  };
}

/** Collect the /_astro/*.js chunks referenced by the home page (HOME_HTML, dist/au-en/index.html). */
function homeReferencedJs() {
  if (!fs.existsSync(HOME_HTML)) return [];
  const html = fs.readFileSync(HOME_HTML, 'utf-8');
  const refs = new Set();
  const re = /\/_astro\/([^"'()\s]+\.js)/g;
  let m;
  while ((m = re.exec(html)) !== null) refs.add(m[1]);
  return [...refs];
}

function analyzeBundle() {
  console.log('\n' + colors.cyan + colors.bold);
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║                                                            ║');
  console.log('║      📦 ALGORYTHMOS BUNDLE PERFORMANCE REPORT 📦          ║');
  console.log('║      (Astro static build — dist/_astro)                    ║');
  console.log('║                                                            ║');
  console.log('╚════════════════════════════════════════════════════════════╝');
  console.log(colors.reset);

  if (!fs.existsSync(ASTRO_DIR)) {
    console.log(
      colors.yellow +
        '⚠️  No dist/_astro folder found. Run "npm run build" first. ' +
        '(Nothing to analyze — treating as zero client JS.)' +
        colors.reset
    );
    // Advisory script: do not hard-fail when there is simply nothing to measure.
    return 0;
  }

  const entries = fs.readdirSync(ASTRO_DIR);
  const jsFiles = entries
    .filter((f) => f.endsWith('.js'))
    .map((f) => statAsset(ASTRO_DIR, f))
    .sort((a, b) => b.size - a.size);
  const cssFiles = entries
    .filter((f) => f.endsWith('.css'))
    .map((f) => statAsset(ASTRO_DIR, f))
    .sort((a, b) => b.size - a.size);

  const totalJs = jsFiles.reduce((s, f) => s + f.size, 0);
  const totalJsGzip = jsFiles.reduce((s, f) => s + f.gzip, 0);
  const totalCss = cssFiles.reduce((s, f) => s + f.size, 0);
  const totalCssGzip = cssFiles.reduce((s, f) => s + f.gzip, 0);

  // ---- Summary ----
  console.log(colors.bold + '\n📊 BUNDLE SUMMARY' + colors.reset);
  console.log('─'.repeat(60));
  console.log(
    `${colors.bold}Total JavaScript:${colors.reset} ${formatSize(totalJs)}  ` +
      `(${colors.cyan}${formatSize(totalJsGzip)} gzip${colors.reset}, ${jsFiles.length} files)`
  );
  console.log(
    `${colors.bold}Total CSS:       ${colors.reset} ${formatSize(totalCss)}  ` +
      `(${colors.cyan}${formatSize(totalCssGzip)} gzip${colors.reset}, ${cssFiles.length} files)`
  );

  // ---- Home first-load ----
  const homeJs = homeReferencedJs();
  const homeChunks = homeJs
    .map((name) => jsFiles.find((f) => f.name === name))
    .filter(Boolean);
  const homeRaw = homeChunks.reduce((s, f) => s + f.size, 0);
  const homeGzip = homeChunks.reduce((s, f) => s + f.gzip, 0);

  console.log(colors.bold + '\n🏠 HOME FIRST-LOAD (referenced by dist/au-en/index.html)' + colors.reset);
  console.log('─'.repeat(60));
  if (homeChunks.length === 0) {
    console.log(`${colors.green}✅ Home ships 0 JS chunks from /_astro (pure static / islands idle)${colors.reset}`);
  } else {
    const homeColor =
      homeRaw / 1024 > SIZE_LIMIT_KB
        ? colors.red
        : homeRaw / 1024 > WARNING_LIMIT_KB
          ? colors.yellow
          : colors.green;
    console.log(
      `${colors.bold}Home JS:${colors.reset} ${homeColor}${formatSize(homeRaw)}${colors.reset} ` +
        `(${colors.cyan}${formatSize(homeGzip)} gzip${colors.reset}, ${homeChunks.length} chunk(s))`
    );
    homeChunks
      .sort((a, b) => b.size - a.size)
      .forEach((f) => {
        console.log(
          `  ${formatSize(f.size).padStart(10)}  ${colors.cyan}${formatSize(f.gzip).padStart(9)} gz${colors.reset}  ${f.name}`
        );
      });
  }

  // ---- Largest JS chunks ----
  console.log(colors.bold + '\n📦 LARGEST JS CHUNKS' + colors.reset);
  console.log('─'.repeat(60));
  if (jsFiles.length === 0) {
    console.log(`${colors.green}✅ No client JS emitted${colors.reset}`);
  } else {
    jsFiles.slice(0, 10).forEach((f) => {
      const sizeColor =
        f.sizeKb > SIZE_LIMIT_KB ? colors.red : f.sizeKb > WARNING_LIMIT_KB ? colors.yellow : colors.reset;
      console.log(
        `  ${sizeColor}${formatSize(f.size).padStart(10)}${colors.reset}  ` +
          `${colors.cyan}${formatSize(f.gzip).padStart(9)} gz${colors.reset}  ${f.name}`
      );
    });
    if (jsFiles.length > 10) console.log(`  ... and ${jsFiles.length - 10} more`);
  }

  // ---- CSS ----
  if (cssFiles.length > 0) {
    console.log(colors.bold + '\n🎨 CSS FILES' + colors.reset);
    console.log('─'.repeat(60));
    cssFiles.slice(0, 10).forEach((f) => {
      console.log(
        `  ${formatSize(f.size).padStart(10)}  ${colors.cyan}${formatSize(f.gzip).padStart(9)} gz${colors.reset}  ${f.name}`
      );
    });
    if (cssFiles.length > 10) console.log(`  ... and ${cssFiles.length - 10} more`);
  }

  // ---- Warnings ----
  const oversized = jsFiles.filter((f) => f.sizeKb > SIZE_LIMIT_KB);
  console.log(colors.bold + '\n⚠️  WARNINGS' + colors.reset);
  console.log('─'.repeat(60));
  if (oversized.length > 0) {
    oversized.forEach((f) => {
      console.log(
        `${colors.yellow}⚠  ${f.name} is ${formatSize(f.size)} (> ${SIZE_LIMIT_KB} kB)${colors.reset}`
      );
    });
  } else {
    console.log(`${colors.green}✅ No JS chunk exceeds ${SIZE_LIMIT_KB} kB${colors.reset}`);
  }

  // ---- Final status (advisory only) ----
  console.log(colors.bold + '\n📋 FINAL STATUS' + colors.reset);
  console.log('─'.repeat(60));
  if (oversized.length === 0) {
    console.log(colors.green + colors.bold + '✅ PERFORMANCE CHECK PASSED' + colors.reset);
  } else {
    console.log(
      colors.yellow + colors.bold + '⚠️  PERFORMANCE NEEDS ATTENTION (advisory — not blocking)' + colors.reset
    );
  }
  console.log('\n');

  // Advisory exit code: non-zero signals "look at this" but CI runs it
  // non-fatally so it never blocks the build.
  return oversized.length > 0 ? 1 : 0;
}

const exitCode = analyzeBundle();
process.exit(exitCode);

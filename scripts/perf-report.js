#!/usr/bin/env node
// scripts/perf-report.js
// Bundle weight gate for the Astro build. CI runs this as a required step
// (`npm run perf`), so a non-zero exit fails the build.
//
// Prints the emitted client assets in dist/_astro/*.{js,css} (raw + gzip) and the
// home page's first-load JS, then applies the rules in scripts/lib/perf-gate.mjs:
//   - no chunk over 200 kB, except the lazily loaded 3D engine (own cap, one file)
//   - no page reaches that engine through its HTML or its static imports
//   - home first-load JS stays under its ceiling
//
// Run: npm run perf   (after `npm run build`)

import path from 'path';
import { fileURLToPath } from 'url';
import {
  analyze,
  ENGINE_CHUNK_RE,
  ENGINE_LIMIT_KB,
  HOME_FIRST_LOAD_LIMIT_KB,
  SIZE_LIMIT_KB,
  WARNING_LIMIT_KB,
} from './lib/perf-gate.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT = path.join(__dirname, '..');
const DIST_DIR = path.join(ROOT, 'dist');

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

function analyzeBundle() {
  console.log('\n' + colors.cyan + colors.bold);
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║                                                            ║');
  console.log('║      📦 ALGORYTHMOS BUNDLE PERFORMANCE REPORT 📦          ║');
  console.log('║      (Astro static build — dist/_astro)                    ║');
  console.log('║                                                            ║');
  console.log('╚════════════════════════════════════════════════════════════╝');
  console.log(colors.reset);

  const report = analyze(DIST_DIR);
  if (!report.built) {
    console.log(colors.red + '❌ ' + report.failures[0] + colors.reset + '\n');
    return 1;
  }
  const { jsFiles, cssFiles } = report;
  const limitFor = (f) => (ENGINE_CHUNK_RE.test(f.name) ? ENGINE_LIMIT_KB : SIZE_LIMIT_KB);

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
  console.log(colors.bold + '\n🏠 HOME FIRST-LOAD (HTML chunks + their static imports)' + colors.reset);
  console.log('─'.repeat(60));
  for (const home of report.home) {
    const homeColor = home.size / 1024 > HOME_FIRST_LOAD_LIMIT_KB ? colors.red : colors.green;
    console.log(
      `${colors.bold}${home.page}:${colors.reset} ${homeColor}${formatSize(home.size)}${colors.reset} ` +
        `(${colors.cyan}${formatSize(home.gzip)} gzip${colors.reset}, ${home.chunks.length} chunk(s), ` +
        `ceiling ${HOME_FIRST_LOAD_LIMIT_KB} kB)`
    );
    home.chunks.forEach((f) => {
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
        f.sizeKb > limitFor(f) ? colors.red : f.sizeKb > WARNING_LIMIT_KB ? colors.yellow : colors.reset;
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

  // ---- Gate ----
  console.log(colors.bold + '\n🚦 GATE' + colors.reset);
  console.log('─'.repeat(60));
  if (report.failures.length > 0) {
    report.failures.forEach((msg) => console.log(`${colors.red}✖  ${msg}${colors.reset}`));
  } else {
    console.log(`${colors.green}✅ No chunk over ${SIZE_LIMIT_KB} kB (3D engine: ${ENGINE_LIMIT_KB} kB)${colors.reset}`);
    console.log(`${colors.green}✅ No page loads the 3D engine up front${colors.reset}`);
    console.log(`${colors.green}✅ Home first-load JS under ${HOME_FIRST_LOAD_LIMIT_KB} kB${colors.reset}`);
  }

  console.log(colors.bold + '\n📋 FINAL STATUS' + colors.reset);
  console.log('─'.repeat(60));
  if (report.failures.length === 0) {
    console.log(colors.green + colors.bold + '✅ PERFORMANCE CHECK PASSED' + colors.reset);
  } else {
    console.log(colors.red + colors.bold + '❌ PERFORMANCE CHECK FAILED' + colors.reset);
  }
  console.log('\n');

  return report.failures.length > 0 ? 1 : 0;
}

const exitCode = analyzeBundle();
process.exit(exitCode);

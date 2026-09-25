#!/usr/bin/env node
/**
 * Internal Link Checker (Astro 6 — static dist/)
 *
 * Crawls every dist/**\/*.html, collects internal links (href="/..."), and
 * asserts each one resolves to something that was actually built:
 *   - a literal file            dist/<path>            (e.g. /favicon.ico, /_astro/x.css)
 *   - a flat HTML page          dist/<path>.html
 *   - a directory-index page    dist/<path>/index.html
 *
 * Query strings (?x=y) and hash fragments (#section) are stripped before
 * resolution. External links (http(s)://, //, mailto:, tel:, etc.) are skipped.
 *
 * Exits 1 and lists every broken link if any are found.
 *
 * Run: npm run link:check   (after `npm run build`)
 */

import { readdirSync, statSync, readFileSync, existsSync } from 'fs';
import { join, dirname, extname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const ROOT = join(__dirname, '..');
const DIST = join(ROOT, 'dist');

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m',
};

/** Recursively collect all *.html files under a directory. */
function collectHtml(dir) {
  let out = [];
  let items;
  try {
    items = readdirSync(dir);
  } catch {
    return out;
  }
  for (const item of items) {
    const full = join(dir, item);
    let stat;
    try {
      stat = statSync(full);
    } catch {
      continue;
    }
    if (stat.isDirectory()) {
      out = out.concat(collectHtml(full));
    } else if (stat.isFile() && extname(item) === '.html') {
      out.push(full);
    }
  }
  return out;
}

/** Pull internal href targets from one HTML file. */
function extractInternalLinks(html) {
  const links = new Set();
  const re = /\bhref=["']([^"']+)["']/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    let href = m[1].trim();
    // Skip external / non-path schemes and protocol-relative URLs.
    // Only validate site-absolute internal links ("/..."). One positive test instead of a
    // scheme deny-list: every scheme (http:, mailto:, javascript:, data:, …), fragment and
    // relative href fails startsWith('/'), and "//host" is protocol-relative, i.e. external.
    if (!href.startsWith('/') || href.startsWith('//')) continue;

    // Strip query + hash.
    href = href.split('#')[0].split('?')[0];
    if (href === '') continue;
    links.add(href);
  }
  return links;
}

/** Resolve an internal "/path" link to a built artifact on disk. */
function resolves(linkPath) {
  // Normalise: drop trailing slash (except root).
  let p = linkPath;
  if (p.length > 1 && p.endsWith('/')) p = p.slice(0, -1);

  // Root → dist/index.html
  if (p === '/' || p === '') {
    return existsSync(join(DIST, 'index.html'));
  }

  const rel = p.replace(/^\/+/, ''); // strip leading slash
  const base = join(DIST, rel);

  // 1) literal file (assets: favicon.ico, /_astro/x.css, images, etc.)
  if (existsSync(base) && statSync(base).isFile()) return true;
  // 2) flat HTML page: dist/<path>.html
  if (existsSync(`${base}.html`)) return true;
  // 3) directory-index page: dist/<path>/index.html
  if (existsSync(join(base, 'index.html'))) return true;

  return false;
}

function main() {
  console.log(`\n${colors.cyan}${colors.bold}🔗 Internal Link Check (dist/)${colors.reset}`);
  console.log('─'.repeat(60));

  if (!existsSync(DIST)) {
    console.log(`${colors.red}❌ No dist/ directory found. Run \`npm run build\` first.${colors.reset}`);
    process.exit(1);
  }

  const htmlFiles = collectHtml(DIST);
  if (htmlFiles.length === 0) {
    console.log(`${colors.red}❌ No HTML files found in dist/.${colors.reset}`);
    process.exit(1);
  }

  // Map of broken link -> set of source pages that reference it.
  const broken = new Map();
  let totalLinks = 0;
  const checkedTargets = new Set();

  for (const file of htmlFiles) {
    const html = readFileSync(file, 'utf-8');
    const links = extractInternalLinks(html);
    const source = file.replace(DIST + '/', '');
    for (const link of links) {
      totalLinks++;
      checkedTargets.add(link);
      if (!resolves(link)) {
        if (!broken.has(link)) broken.set(link, new Set());
        broken.get(link).add(source);
      }
    }
  }

  console.log(
    `Scanned ${colors.bold}${htmlFiles.length}${colors.reset} HTML files, ` +
      `${colors.bold}${totalLinks}${colors.reset} internal links ` +
      `(${checkedTargets.size} unique targets).`
  );

  if (broken.size === 0) {
    console.log(`${colors.green}✅ All internal links resolve to built files.${colors.reset}\n`);
    process.exit(0);
  }

  console.log(`\n${colors.red}❌ ${broken.size} broken internal link(s):${colors.reset}\n`);
  for (const [link, sources] of broken) {
    console.log(`  ${colors.red}${link}${colors.reset}`);
    [...sources].slice(0, 5).forEach((s) => console.log(`      ← ${s}`));
    if (sources.size > 5) console.log(`      ← ... and ${sources.size - 5} more page(s)`);
  }
  console.log('');
  process.exit(1);
}

main();

/**
 * Guard: fail if any unresolved i18n key leaked into rendered HTML.
 * (t() returns the key string on a miss, so a typo'd/absent key renders as
 *  literal "namespace.some.key" text. Hyphen-aware — slugs contain hyphens.)
 * Run after `astro build`.
 */
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const DIST = 'dist';
const NS = [
  'caseStudyDetail', 'caseStudies', 'blogDetail', 'blog', 'about', 'pricing',
  'contactPage', 'contact', 'careers', 'privacy', 'terms', 'services',
  'hero', 'nav', 'footer', 'region', 'notFoundPage', 'seo',
  'home', 'industries', 'regionAu', 'regionFr', 'visuals',
];
const RE = new RegExp(`>\\s*(?:${NS.join('|')})\\.[a-zA-Z0-9._-]+\\s*<`, 'g');

if (!existsSync(DIST)) {
  console.error('❌ dist/ not found — run `npm run build` first.');
  process.exit(1);
}

const hits = [];
function walk(dir) {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) walk(p);
    else if (f.endsWith('.html')) {
      const m = readFileSync(p, 'utf8').match(RE);
      if (m) hits.push({ file: p, keys: [...new Set(m.map((s) => s.slice(1, -1).trim()))] });
    }
  }
}
walk(DIST);

if (hits.length) {
  console.error('\x1b[31m❌ Unresolved i18n keys leaked into rendered HTML:\x1b[0m');
  for (const h of hits.slice(0, 25)) console.error(`  ${h.file}\n    ${h.keys.slice(0, 6).join(', ')}`);
  console.error(`\n${hits.length} page(s) affected. Fix the missing keys or content source.`);
  process.exit(1);
}
console.log('\x1b[32m✅ No unresolved i18n keys in dist/.\x1b[0m');

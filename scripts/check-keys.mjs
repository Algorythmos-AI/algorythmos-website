/**
 * Guard: fail if any unresolved i18n key leaked into rendered HTML.
 * (t() returns the key string on a miss, so a typo'd/absent key renders as
 *  literal "namespace.some.key" text. Hyphen-aware — slugs contain hyphens.)
 *
 * The namespaces come from the dictionaries themselves, so a new or rarely used
 * namespace (ui, console, press, …) is always covered. Both text nodes and the
 * copy-bearing attributes (alt, aria-label, title, placeholder, content) are
 * scanned — a leaked key in an attribute is just as visible to a screen reader.
 * Run after `astro build`.
 */
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const DIST = 'dist';
const DICTS = ['src/i18n/ui/en.global.json', 'src/i18n/ui/fr.fr.json', 'src/i18n/ui/en.au.json'];

const NS = [
  ...new Set(DICTS.flatMap((p) => Object.keys(JSON.parse(readFileSync(p, 'utf8'))).map((k) => k.split('.')[0]))),
].sort((a, b) => b.length - a.length); // longest first, so "blogDetail" wins over "blog"
const KEY = `(?:${NS.join('|')})\\.[a-zA-Z0-9._-]+`;
const TEXT_RE = new RegExp(`>\\s*(${KEY})\\s*<`, 'g');
const ATTR_RE = new RegExp(`\\s(?:alt|aria-label|title|placeholder|content)="\\s*(${KEY})\\s*"`, 'g');

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
      const html = readFileSync(p, 'utf8');
      const keys = new Set([...html.matchAll(TEXT_RE), ...html.matchAll(ATTR_RE)].map((m) => m[1]));
      if (keys.size) hits.push({ file: p, keys: [...keys] });
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
console.log(`\x1b[32m✅ No unresolved i18n keys in dist/ (${NS.length} namespaces, text and attributes).\x1b[0m`);

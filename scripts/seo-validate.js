#!/usr/bin/env node

/**
 * SEO Validation Script for Algorythmos (Astro 6 — static output)
 * ===============================================================
 * The site is now a static Astro build, so this validates the REAL HTML in
 * dist/ (run `npm run build` first). For each representative page it asserts:
 *   - exactly one <title>
 *   - a <meta name="description">
 *   - exactly one <link rel="canonical"> on https://algorythmos.com with the
 *     correct per-locale prefix
 *   - 4 hreflang alternates, including x-default
 *   - og:title / og:description / og:url / og:image
 *     (og:image = brand card /Algorythmos.png, or a per-page /og/*.png)
 *   - twitter:card
 *   - at least one application/ld+json block that JSON-parses
 *
 * It also asserts dist/robots.txt (referencing the sitemap), dist/sitemap-index.xml,
 * and dist/llms.txt exist.
 *
 * Color output. Exits 1 on any failure.
 *
 * Run: npm run seo:check   (after `npm run build`)
 */

import { readFileSync, existsSync, readdirSync, statSync } from 'fs';
import { join, dirname, relative, sep } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const ROOT = join(__dirname, '..');
const DIST = join(ROOT, 'dist');

const EXPECTED_DOMAIN = 'https://algorythmos.com';
const EXPECTED_OG_IMAGE = 'https://algorythmos.com/Algorythmos.png';

// ANSI colors
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m',
};

const log = {
  success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  warn: (msg) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`),
  info: (msg) => console.log(`${colors.blue}ℹ️  ${msg}${colors.reset}`),
  section: (msg) =>
    console.log(`\n${colors.cyan}${'='.repeat(60)}\n${msg}\n${'='.repeat(60)}${colors.reset}`),
};

let errors = 0;
let warnings = 0;

// ---------------------------------------------------------------------------
// Pages to validate. `path` is the canonical URL path (post-prefix); `file` is
// the built HTML on disk. One blog slug is included as the dynamic-route smoke.
// ---------------------------------------------------------------------------
const PAGES = [
  { label: 'Home (EN)', file: 'index.html', canonicalPath: '/' },
  { label: 'AU (au-en)', file: join('au-en', 'index.html'), canonicalPath: '/au-en' },
  { label: 'FR (fr-fr)', file: join('fr-fr', 'index.html'), canonicalPath: '/fr-fr' },
  {
    label: 'Service: mlops-cicd',
    file: join('services', 'mlops-cicd', 'index.html'),
    canonicalPath: '/services/mlops-cicd',
  },
  {
    label: 'Blog post: agentic-ai',
    file: join('blog', 'agentic-ai', 'index.html'),
    canonicalPath: '/blog/agentic-ai',
  },
];

// ---------------------------------------------------------------------------
// Extraction helpers
// ---------------------------------------------------------------------------
function extractAll(regex, html) {
  const out = [];
  let m;
  while ((m = regex.exec(html)) !== null) out.push(m);
  return out;
}

function extractMetaContent(html, name, attribute = 'name') {
  // Tolerant of attribute order: find the tag first, then pull `content`.
  const tagRe = new RegExp(`<meta\\b[^>]*\\b${attribute}=["']${escapeRe(name)}["'][^>]*>`, 'gi');
  return extractAll(tagRe, html)
    .map((m) => {
      const c = m[0].match(/\bcontent=["']([^"']*)["']/i);
      return c ? c[1] : null;
    })
    .filter((v) => v !== null);
}

function escapeRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function extractTitles(html) {
  return extractAll(/<title[^>]*>([\s\S]*?)<\/title>/gi, html).map((m) => m[1].trim());
}

function extractCanonicals(html) {
  // canonical link, attribute-order tolerant
  return extractAll(/<link\b[^>]*rel=["']canonical["'][^>]*>/gi, html)
    .map((m) => {
      const h = m[0].match(/\bhref=["']([^"']*)["']/i);
      return h ? h[1] : null;
    })
    .filter(Boolean);
}

function extractHreflangs(html) {
  return extractAll(/<link\b[^>]*rel=["']alternate["'][^>]*>/gi, html)
    .map((m) => {
      const hl = m[0].match(/\bhreflang=["']([^"']*)["']/i);
      return hl ? hl[1] : null;
    })
    .filter(Boolean);
}

function extractJsonLd(html) {
  const blocks = extractAll(
    /<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi,
    html
  );
  return blocks.map((m) => m[1].trim());
}

// ---------------------------------------------------------------------------
// Per-page validation
// ---------------------------------------------------------------------------
function validatePage(page) {
  log.section(`📄 ${page.label}  (${page.file})`);

  const abs = join(DIST, page.file);
  if (!existsSync(abs)) {
    log.error(`Built file missing: dist/${page.file} — did you run \`npm run build\`?`);
    errors++;
    return;
  }
  const html = readFileSync(abs, 'utf-8');

  // 1. exactly one <title>
  const titles = extractTitles(html);
  if (titles.length === 1 && titles[0].length > 0) {
    log.success(`Exactly one <title>: "${titles[0].slice(0, 70)}"`);
  } else if (titles.length === 0) {
    log.error('No <title> found');
    errors++;
  } else {
    log.error(`Expected exactly one <title>, found ${titles.length}`);
    errors++;
  }

  // 2. meta description present
  const descs = extractMetaContent(html, 'description');
  if (descs.length >= 1 && descs[0].length > 0) {
    log.success(`<meta name="description"> present (${descs[0].length} chars)`);
    if (descs.length > 1) {
      log.error(`Multiple description tags found (${descs.length})`);
      errors++;
    }
  } else {
    log.error('Missing <meta name="description">');
    errors++;
  }

  // 3. exactly one canonical, correct domain + per-locale prefix
  const canonicals = extractCanonicals(html);
  if (canonicals.length !== 1) {
    log.error(`Expected exactly one <link rel="canonical">, found ${canonicals.length}`);
    errors++;
  } else {
    const canonical = canonicals[0];
    const expected = `${EXPECTED_DOMAIN}${page.canonicalPath}`;
    const expectedAlt = expected.endsWith('/') ? expected.slice(0, -1) : `${expected}/`;
    if (!canonical.startsWith(EXPECTED_DOMAIN)) {
      log.error(`Canonical not on ${EXPECTED_DOMAIN}: ${canonical}`);
      errors++;
    } else if (canonical === expected || canonical === expectedAlt) {
      log.success(`Canonical: ${canonical}`);
    } else {
      log.error(`Canonical prefix mismatch — expected "${expected}", got "${canonical}"`);
      errors++;
    }
  }

  // 4. 4 hreflang alternates incl. x-default
  const hreflangs = extractHreflangs(html);
  const hasXDefault = hreflangs.includes('x-default');
  if (hreflangs.length === 4 && hasXDefault) {
    log.success(`4 hreflang alternates incl. x-default: [${hreflangs.join(', ')}]`);
  } else {
    log.error(
      `Expected 4 hreflang alternates incl. x-default, got ${hreflangs.length}: [${hreflangs.join(', ')}]`
    );
    errors++;
  }

  // 5. OpenGraph tags
  const ogChecks = ['og:title', 'og:description', 'og:url', 'og:image'];
  for (const tag of ogChecks) {
    const vals = extractMetaContent(html, tag, 'property');
    if (vals.length === 0) {
      log.error(`Missing ${tag}`);
      errors++;
      continue;
    }
    const content = vals[0];
    if (tag === 'og:url' && !content.startsWith(EXPECTED_DOMAIN)) {
      log.error(`${tag} not on ${EXPECTED_DOMAIN}: ${content}`);
      errors++;
    } else if (
      tag === 'og:image' &&
      content !== EXPECTED_OG_IMAGE &&
      !(content.startsWith(`${EXPECTED_DOMAIN}/og/`) && content.endsWith('.png'))
    ) {
      // Brand pages use the static card; content pages use per-page /og/*.png cards.
      log.error(`${tag} must be the brand card or a per-page /og/*.png, got "${content}"`);
      errors++;
    } else {
      log.success(`${tag}: ${content.slice(0, 70)}${content.length > 70 ? '…' : ''}`);
    }
  }

  // 6. twitter:card
  const twCard = extractMetaContent(html, 'twitter:card');
  if (twCard.length >= 1) {
    log.success(`twitter:card: ${twCard[0]}`);
  } else {
    log.error('Missing twitter:card');
    errors++;
  }

  // 7. at least one ld+json that parses
  const ldBlocks = extractJsonLd(html);
  if (ldBlocks.length === 0) {
    log.error('No application/ld+json block found');
    errors++;
  } else {
    let parsedOk = 0;
    for (const block of ldBlocks) {
      try {
        JSON.parse(block);
        parsedOk++;
      } catch (err) {
        log.error(`Invalid JSON-LD: ${err.message}`);
        errors++;
      }
    }
    if (parsedOk > 0) {
      log.success(`${parsedOk}/${ldBlocks.length} JSON-LD block(s) parse cleanly`);
    }
  }

  // 8. every content <img> has alt; decorative allowed iff alt="" AND aria-hidden="true"
  const imgs = html.match(/<img\b[^>]*>/gi) || [];
  let badImg = 0;
  let contentImg = 0;
  for (const tag of imgs) {
    const altM = tag.match(/\balt\s*=\s*"([^"]*)"/i);
    const hidden = /\baria-hidden\s*=\s*"true"/i.test(tag);
    if (!altM) {
      log.error(`<img> missing alt: ${tag.slice(0, 90)}`);
      errors++;
      badImg++;
    } else if (altM[1].trim() === '' && !hidden) {
      log.error(`<img> empty alt without aria-hidden: ${tag.slice(0, 90)}`);
      errors++;
      badImg++;
    } else if (altM[1].trim() !== '') {
      contentImg++;
    }
  }
  if (imgs.length > 0 && badImg === 0) {
    log.success(`${imgs.length} <img> OK (${contentImg} descriptive, ${imgs.length - contentImg} decorative)`);
  }
}

// ---------------------------------------------------------------------------
// Structured-data / NAP consistency — regional pages must carry a connected
// graph: exactly one Organization node, a ProfessionalService whose email
// matches the single source of truth (src/data/business.ts), city-level
// areaServed, and a parentOrganization link back to #organization.
// ---------------------------------------------------------------------------
function businessEmail() {
  const src = readFileSync(join(ROOT, 'src', 'data', 'business.ts'), 'utf-8');
  const m = src.match(/^\s*email:\s*'([^']+)'/m);
  return m ? m[1] : null;
}

/** Ordered profile URLs from the `profiles: [...]` block in business.ts. */
function businessProfiles() {
  const src = readFileSync(join(ROOT, 'src', 'data', 'business.ts'), 'utf-8');
  const block = src.match(/profiles:\s*\[([\s\S]*?)\]/);
  if (!block) return [];
  return [...block[1].matchAll(/url:\s*'([^']+)'/g)].map((m) => m[1]);
}

function collectLdNodes(html) {
  const nodes = [];
  for (const block of extractJsonLd(html)) {
    try {
      const parsed = JSON.parse(block);
      const list = parsed['@graph'] ?? [parsed];
      for (const n of Array.isArray(list) ? list : [list]) nodes.push(n);
    } catch {
      /* reported by the per-page validator */
    }
  }
  return nodes;
}

function validateStructuredData() {
  log.section('🏢 Structured data / NAP consistency');
  const email = businessEmail();
  if (!email) {
    log.error('Could not read canonical email from src/data/business.ts');
    errors++;
    return;
  }

  // AU publishes the registered office (locality = suburb + street); FR stays city-level.
  const REGIONAL = [
    { file: join('au-en', 'index.html'), city: 'Surry Hills', street: true },
    { file: join('fr-fr', 'index.html'), city: 'Paris', street: false },
    { file: join('au-en', 'ai-consultancy-sydney', 'index.html'), city: 'Surry Hills', street: true },
    { file: join('fr-fr', 'conseil-en-ia-paris', 'index.html'), city: 'Paris', street: false },
  ];

  for (const { file, city, street } of REGIONAL) {
    const abs = join(DIST, file);
    if (!existsSync(abs)) {
      log.error(`Missing regional page: dist/${file}`);
      errors++;
      continue;
    }
    const nodes = collectLdNodes(readFileSync(abs, 'utf-8'));
    const orgs = nodes.filter((n) => n['@type'] === 'Organization');
    const services = nodes.filter((n) => n['@type'] === 'ProfessionalService');
    let ok = true;

    if (orgs.length !== 1) {
      log.error(`dist/${file}: expected exactly one Organization node, found ${orgs.length}`);
      errors++;
      ok = false;
    } else if (orgs[0].email !== email) {
      log.error(`dist/${file}: Organization email "${orgs[0].email}" ≠ business.ts "${email}"`);
      errors++;
      ok = false;
    }

    if (services.length !== 1) {
      log.error(`dist/${file}: expected exactly one ProfessionalService node, found ${services.length}`);
      errors++;
      ok = false;
    } else {
      const svc = services[0];
      if (svc.email !== email) {
        log.error(`dist/${file}: ProfessionalService email "${svc.email}" ≠ business.ts "${email}"`);
        errors++;
        ok = false;
      }
      if (svc.address?.addressLocality !== city) {
        log.error(`dist/${file}: ProfessionalService addressLocality "${svc.address?.addressLocality}" ≠ "${city}"`);
        errors++;
        ok = false;
      }
      if (street && !(svc.address?.streetAddress && svc.address?.postalCode)) {
        log.error(`dist/${file}: ProfessionalService must publish streetAddress + postalCode for ${city}`);
        errors++;
        ok = false;
      }
      if (!street && svc.address?.streetAddress) {
        log.error(`dist/${file}: ProfessionalService for ${city} must stay city-level (no streetAddress)`);
        errors++;
        ok = false;
      }
      if (!svc.parentOrganization?.['@id']?.includes('#organization')) {
        log.error(`dist/${file}: ProfessionalService not linked to #organization`);
        errors++;
        ok = false;
      }
    }
    if (ok) log.success(`dist/${file}: Organization + ProfessionalService (${city}) consistent with business.ts`);
  }
}

// ---------------------------------------------------------------------------
// Full-site sweep — every built HTML page gets the core invariants:
//   - exactly one non-empty <title> / meta description / canonical on the domain
//   - unique title + canonical across the whole site (duplicate = locale merge bug)
//   - og:image points at a file that actually exists in dist/
//   - og:locale matches the URL locale prefix
//   - hreflang: exactly 4 incl. x-default and self, OR none (standalone pages)
//   - every sitemap URL is its own canonical (no canonicalized-away URLs listed)
// ---------------------------------------------------------------------------
const OG_LOCALE_BY_PREFIX = { 'au-en': 'en_AU', 'fr-fr': 'fr_FR' };

function* walkHtml(dir) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) yield* walkHtml(p);
    else if (entry.endsWith('.html')) yield p;
  }
}

function validateAllPages() {
  log.section('🌐 Full-site sweep (every built page)');

  const seenTitles = new Map();
  const seenCanonicals = new Map();
  const canonicalByPage = new Map(); // url path -> canonical
  let pageCount = 0;
  let sweepErrors = errors;

  for (const abs of walkHtml(DIST)) {
    const rel = relative(DIST, abs).split(sep).join('/');
    if (rel === '404.html') continue; // error page: not indexable content
    pageCount++;
    const html = readFileSync(abs, 'utf-8');
    const where = `dist/${rel}`;

    // title / description
    const titles = extractTitles(html);
    if (titles.length !== 1 || !titles[0]) {
      log.error(`${where}: expected exactly one non-empty <title>, found ${titles.length}`);
      errors++;
    } else {
      // Uniqueness is scoped per locale tree: hreflang alternates legitimately
      // share a title across en/au-en (same language). Two pages in the SAME
      // locale with one title = a real duplicate-content bug.
      const localeKey = OG_LOCALE_BY_PREFIX[rel.split('/')[0]] ?? 'en';
      const titleKey = `${localeKey}::${titles[0]}`;
      const prev = seenTitles.get(titleKey);
      if (prev) {
        log.error(`${where}: duplicate <title> also used by ${prev}: "${titles[0].slice(0, 60)}"`);
        errors++;
      }
      seenTitles.set(titleKey, where);
    }
    const descs = extractMetaContent(html, 'description');
    if (descs.length !== 1 || !descs[0]) {
      log.error(`${where}: expected exactly one non-empty meta description, found ${descs.length}`);
      errors++;
    }

    // canonical
    const canonicals = extractCanonicals(html);
    if (canonicals.length !== 1 || !canonicals[0].startsWith(EXPECTED_DOMAIN)) {
      log.error(`${where}: expected one canonical on ${EXPECTED_DOMAIN}, got [${canonicals.join(', ')}]`);
      errors++;
    } else {
      const canonical = canonicals[0];
      const prev = seenCanonicals.get(canonical);
      if (prev) {
        log.error(`${where}: duplicate canonical also used by ${prev}: ${canonical}`);
        errors++;
      }
      seenCanonicals.set(canonical, where);
      const urlPath = '/' + rel.replace(/index\.html$/, '').replace(/\.html$/, '').replace(/\/$/, '');
      canonicalByPage.set(urlPath === '/' ? '/' : urlPath.replace(/\/$/, ''), canonical);
    }

    // og:image must resolve to a real file in dist
    const ogImages = extractMetaContent(html, 'og:image', 'property');
    if (ogImages.length >= 1 && ogImages[0].startsWith(EXPECTED_DOMAIN)) {
      const imgRel = decodeURIComponent(ogImages[0].slice(EXPECTED_DOMAIN.length));
      if (!existsSync(join(DIST, imgRel))) {
        log.error(`${where}: og:image file missing in dist: ${imgRel}`);
        errors++;
      }
    }

    // og:locale must match the URL locale prefix
    const prefix = rel.split('/')[0];
    const expectedOgLocale = OG_LOCALE_BY_PREFIX[prefix];
    const ogLocales = extractMetaContent(html, 'og:locale', 'property');
    if (expectedOgLocale && ogLocales[0] !== expectedOgLocale) {
      log.error(`${where}: og:locale "${ogLocales[0]}" ≠ expected "${expectedOgLocale}"`);
      errors++;
    }

    // every <img> declares intrinsic dimensions (CLS guard)
    for (const tag of html.match(/<img\b[^>]*>/gi) || []) {
      if (!/\bwidth\s*=/.test(tag) || !/\bheight\s*=/.test(tag)) {
        log.error(`${where}: <img> missing width/height (CLS): ${tag.slice(0, 90)}`);
        errors++;
      }
    }

    // hreflang: 4 incl x-default + self, or none (standalone single-locale pages)
    const hreflangs = extractHreflangs(html);
    if (hreflangs.length > 0) {
      if (hreflangs.length !== 4 || !hreflangs.includes('x-default')) {
        log.error(`${where}: hreflang set must be 4 incl. x-default or empty, got [${hreflangs.join(', ')}]`);
        errors++;
      } else if (expectedOgLocale) {
        const selfHreflang = expectedOgLocale.replace('_', '-');
        if (!hreflangs.includes(selfHreflang)) {
          log.error(`${where}: hreflang set missing self (${selfHreflang}): [${hreflangs.join(', ')}]`);
          errors++;
        }
      }
    }
  }

  // sitemap URLs must be self-canonical pages
  let sitemapUrls = 0;
  for (const entry of readdirSync(DIST)) {
    if (!/^sitemap.*\.xml$/.test(entry) || entry === 'sitemap-index.xml') continue;
    const xml = readFileSync(join(DIST, entry), 'utf-8');
    for (const m of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) {
      const url = m[1];
      if (!url.startsWith(EXPECTED_DOMAIN)) continue;
      sitemapUrls++;
      const urlPath = url.slice(EXPECTED_DOMAIN.length).replace(/\/$/, '') || '/';
      const canonical = canonicalByPage.get(urlPath);
      if (!canonical) {
        log.error(`sitemap ${entry}: URL has no built page: ${url}`);
        errors++;
      } else if (canonical.replace(/\/$/, '') !== url.replace(/\/$/, '')) {
        log.error(`sitemap ${entry}: URL ${url} canonicalizes elsewhere (${canonical})`);
        errors++;
      }
    }
  }

  if (errors === sweepErrors) {
    log.success(`${pageCount} pages swept, ${sitemapUrls} sitemap URLs verified self-canonical — all invariants hold`);
  } else {
    log.error(`Full-site sweep found ${errors - sweepErrors} issue(s) across ${pageCount} pages`);
  }
}

// ---------------------------------------------------------------------------
// Static-file assertions
// ---------------------------------------------------------------------------
function validateStaticFiles() {
  log.section('📦 Static SEO files');

  // robots.txt exists and references the sitemap
  const robotsPath = join(DIST, 'robots.txt');
  if (!existsSync(robotsPath)) {
    log.error('dist/robots.txt is missing');
    errors++;
  } else {
    const robots = readFileSync(robotsPath, 'utf-8');
    log.success('dist/robots.txt exists');
    if (/Sitemap:\s*\S+/i.test(robots)) {
      log.success('robots.txt references a Sitemap');
    } else {
      log.error('robots.txt has no Sitemap directive');
      errors++;
    }
  }

  // sitemap-index.xml exists
  if (existsSync(join(DIST, 'sitemap-index.xml'))) {
    log.success('dist/sitemap-index.xml exists');
  } else {
    log.error('dist/sitemap-index.xml is missing');
    errors++;
  }

  // llms.txt exists
  if (existsSync(join(DIST, 'llms.txt'))) {
    log.success('dist/llms.txt exists');
  } else {
    log.error('dist/llms.txt is missing');
    errors++;
  }
}

// ---------------------------------------------------------------------------
// SEO feature guardrails — regression tests for the hardening work:
//   - FAQPage on every service page (5 × 3 locales) + both local landings
//   - Organization sameAs === business.ts profiles, each surfaced as a footer href
//   - per-locale RSS feeds exist, well-formed, ≥1 item
//   - every /blog/<slug> sitemap URL carries a parseable <lastmod>
// ---------------------------------------------------------------------------
function validateSeoFeatures() {
  log.section('🧩 SEO feature guardrails');
  const before = errors;

  // 1. FAQPage coverage
  const SERVICE_SLUGS = ['agentic-automation', 'document-intelligence', 'sql-dashboards', 'mlops-cicd', 'ai-websites'];
  const PREFIXES = ['', 'au-en', 'fr-fr'];
  const faqPages = [];
  for (const slug of SERVICE_SLUGS) {
    for (const pre of PREFIXES) faqPages.push(join(...[pre, 'services', slug, 'index.html'].filter(Boolean)));
  }
  faqPages.push(join('au-en', 'ai-consultancy-sydney', 'index.html'));
  faqPages.push(join('fr-fr', 'conseil-en-ia-paris', 'index.html'));

  let faqOk = 0;
  for (const rel of faqPages) {
    const abs = join(DIST, rel);
    if (!existsSync(abs)) {
      log.error(`FAQPage check: missing page dist/${rel}`);
      errors++;
      continue;
    }
    const faq = collectLdNodes(readFileSync(abs, 'utf-8')).find((n) => n['@type'] === 'FAQPage');
    if (!faq || !Array.isArray(faq.mainEntity) || faq.mainEntity.length === 0) {
      log.error(`dist/${rel}: expected a FAQPage node with ≥1 question`);
      errors++;
    } else {
      faqOk++;
    }
  }
  if (faqOk === faqPages.length) log.success(`FAQPage present on all ${faqOk} service + landing pages`);

  // 2. sameAs ⇄ business.ts profiles, and footer reciprocity
  const profiles = businessProfiles();
  const homeAbs = join(DIST, 'index.html');
  if (profiles.length && existsSync(homeAbs)) {
    const homeHtml = readFileSync(homeAbs, 'utf-8');
    const org = collectLdNodes(homeHtml).find((n) => n['@type'] === 'Organization');
    const sameAs = Array.isArray(org?.sameAs) ? org.sameAs : [];
    const missingInSchema = profiles.filter((u) => !sameAs.includes(u));
    const extraInSchema = sameAs.filter((u) => !profiles.includes(u));
    if (missingInSchema.length || extraInSchema.length) {
      log.error(`Organization sameAs ≠ business.ts profiles (missing: ${missingInSchema.join(', ') || 'none'}; extra: ${extraInSchema.join(', ') || 'none'})`);
      errors++;
    } else {
      log.success(`Organization sameAs mirrors all ${profiles.length} business.ts profiles`);
    }
    const notLinked = profiles.filter((u) => !homeHtml.includes(`href="${u}"`));
    if (notLinked.length) {
      log.error(`Profiles in sameAs but not linked in the footer: ${notLinked.join(', ')}`);
      errors++;
    } else {
      log.success('Every profile is reciprocally linked in the footer');
    }
  } else {
    log.error('Could not read profiles from business.ts or dist/index.html');
    errors++;
  }

  // 3. RSS feeds
  const feeds = ['rss.xml', join('fr-fr', 'rss.xml')];
  for (const rel of feeds) {
    const abs = join(DIST, rel);
    if (!existsSync(abs)) {
      log.error(`Missing RSS feed: dist/${rel}`);
      errors++;
      continue;
    }
    const xml = readFileSync(abs, 'utf-8');
    const open = (xml.match(/<item>/g) || []).length;
    const close = (xml.match(/<\/item>/g) || []).length;
    if (!xml.includes('<rss') || open === 0 || open !== close) {
      log.error(`dist/${rel}: malformed RSS (has <rss>: ${xml.includes('<rss')}, <item> open/close: ${open}/${close})`);
      errors++;
    } else {
      log.success(`dist/${rel}: valid RSS with ${open} item(s)`);
    }
  }

  // 4. Blog sitemap URLs carry a parseable lastmod
  let blogUrls = 0;
  let blogMissingLastmod = 0;
  for (const entry of readdirSync(DIST)) {
    if (!/^sitemap.*\.xml$/.test(entry) || entry === 'sitemap-index.xml') continue;
    const xml = readFileSync(join(DIST, entry), 'utf-8');
    for (const block of xml.matchAll(/<url>([\s\S]*?)<\/url>/g)) {
      const body = block[1];
      if (!/<loc>[^<]*\/blog\/[a-z0-9-]+<\/loc>/.test(body)) continue;
      blogUrls++;
      const lm = body.match(/<lastmod>([^<]+)<\/lastmod>/);
      if (!lm || Number.isNaN(Date.parse(lm[1]))) blogMissingLastmod++;
    }
  }
  if (blogUrls === 0) {
    log.error('No /blog/<slug> URLs found in the sitemap');
    errors++;
  } else if (blogMissingLastmod > 0) {
    log.error(`${blogMissingLastmod}/${blogUrls} blog sitemap URLs lack a parseable <lastmod>`);
    errors++;
  } else {
    log.success(`All ${blogUrls} blog sitemap URLs carry a valid <lastmod>`);
  }

  if (errors === before) log.success('All SEO feature guardrails hold');
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
function main() {
  console.log(`
${colors.cyan}╔════════════════════════════════════════════════════════════╗
║                                                            ║
║      🎯 ALGORYTHMOS SEO VALIDATION (dist/) 🎯              ║
║                                                            ║
║      Validates the built static HTML output                ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝${colors.reset}
  `);

  if (!existsSync(DIST)) {
    log.error('No dist/ directory found. Run `npm run build` first.');
    process.exit(1);
  }

  for (const page of PAGES) validatePage(page);
  validateAllPages();
  validateStructuredData();
  validateStaticFiles();
  validateSeoFeatures();

  log.section('📊 VALIDATION SUMMARY');
  console.log(`
  Total Errors:   ${colors.red}${errors}${colors.reset}
  Total Warnings: ${colors.yellow}${warnings}${colors.reset}
  `);

  if (errors === 0) {
    log.success('🎉 ALL SEO CHECKS PASSED on dist/.');
    process.exit(0);
  }
  log.error(`❌ FAILED with ${errors} error(s).`);
  process.exit(1);
}

main();

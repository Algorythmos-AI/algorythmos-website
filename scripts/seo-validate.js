#!/usr/bin/env node

/**
 * SEO Validation Script for Algorythmos
 * =====================================
 * Enterprise-grade validation for:
 * - Canonical URLs
 * - OpenGraph metadata
 * - Twitter cards
 * - JSON-LD structured data
 * - Brand consistency
 * - Domain correctness
 */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { getSeoConfig } from './regionSeoConfig.js';

// ANSI colors for terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

const log = {
  success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  warn: (msg) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`),
  info: (msg) => console.log(`${colors.blue}ℹ️  ${msg}${colors.reset}`),
  section: (msg) => console.log(`\n${colors.cyan}${'='.repeat(60)}\n${msg}\n${'='.repeat(60)}${colors.reset}`),
};

// ----------------- Region-aware configuration -----------------

const ACTIVE_SEO = getSeoConfig();

const EXPECTED_DOMAIN = ACTIVE_SEO.expectedDomain;
const EXPECTED_TITLE = 'Algorythmos™ — AI Consultancy for SMEs | AI That Deliver';
const EXPECTED_OG_IMAGE = ACTIVE_SEO.expectedOgImage;

// sitemap file under /public
const SITEMAP_FILE = ACTIVE_SEO.sitemapFile;

// Brand keywords remain global
const BRAND_KEYWORDS = [
  'algorythmos',
  'algorythmos ai',
  'algorythmos france',
  'algorythmos consulting',
];

let errors = 0;
let warnings = 0;

// Helper functions
function readFile(path) {
  try {
    return readFileSync(path, 'utf-8');
  } catch (err) {
    log.error(`Failed to read ${path}: ${err.message}`);
    errors++;
    return null;
  }
}

function extractMetaTags(html, name, attribute = 'name') {
  // Match meta tags with flexible whitespace and attribute order
  const pattern = `<meta[^>]*${attribute}=["']${name}["'][^>]*>`;
  const regex = new RegExp(pattern, 'gi');
  const matches = [];
  let match;

  while ((match = regex.exec(html)) !== null) {
    const tag = match[0];
    // Extract content attribute
    const contentMatch = tag.match(/content=["']([^"']*)["']/i);
    if (contentMatch) {
      matches.push({ name, content: contentMatch[1] });
    }
  }

  return matches;
}

function extractCanonical(html) {
  const match = html.match(/<link\s+rel="canonical"\s+href="([^"]*)"/i);
  return match ? match[1] : null;
}

function extractStructuredData(html) {
  const regex = /<script\s+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi;
  const matches = [];
  let match;
  while ((match = regex.exec(html)) !== null) {
    try {
      matches.push(JSON.parse(match[1].trim()));
    } catch (err) {
      log.error(`Invalid JSON-LD: ${err.message}`);
      errors++;
    }
  }
  return matches;
}

function checkDuplicates(items, label) {
  if (items.length > 1) {
    log.error(`Multiple ${label} found (expected 1, found ${items.length})`);
    items.forEach((item, i) => console.log(`  ${i + 1}. ${item.name || item}: ${item.content || ''}`));
    errors++;
    return false;
  } else if (items.length === 0) {
    log.error(`No ${label} found`);
    errors++;
    return false;
  }
  return true;
}

function validateDomain(url, context) {
  if (!url) {
    log.error(`${context}: URL is missing`);
    errors++;
    return false;
  }

  // Check for wrong domains
  const wrongDomains = ['algorythmos.ai', 'algorithmos', 'http://algorythmos.fr'];
  for (const wrong of wrongDomains) {
    if (url.includes(wrong)) {
      log.error(`${context}: Wrong domain detected - "${wrong}"`);
      errors++;
      return false;
    }
  }

  // Check for correct domain
  if (!url.startsWith(EXPECTED_DOMAIN)) {
    log.error(`${context}: Expected "${EXPECTED_DOMAIN}" but got "${url}"`);
    errors++;
    return false;
  }

  return true;
}

// ============================================================================
// VALIDATION FUNCTIONS
// ============================================================================

function validateHomepage() {
  log.section('📄 Validating Homepage (index.html)');

  // Check source index.html (not dist) since Helmet injects metadata at runtime
  const html = readFile('index.html');
  if (!html) return;

  // 1. Check canonical URL
  log.info('Checking canonical URL...');
  const canonical = extractCanonical(html);
  if (canonical) {
    if (canonical === EXPECTED_DOMAIN) {
      log.success(`Canonical URL: ${canonical}`);
    } else {
      validateDomain(canonical, 'Canonical URL');
    }
  } else {
    log.error('No canonical URL found');
    errors++;
  }

  // 2. Check page title
  log.info('Checking page title...');
  const titleMatch = html.match(/<title>([^<]*)<\/title>/i);
  if (titleMatch) {
    const title = titleMatch[1];
    if (title === EXPECTED_TITLE) {
      log.success(`Title: ${title}`);
    } else {
      log.warn(`Title differs from expected:\n  Expected: ${EXPECTED_TITLE}\n  Got: ${title}`);
      warnings++;
    }
  } else {
    log.error('No title tag found');
    errors++;
  }

  // 3. Check meta description
  log.info('Checking meta description...');
  const descriptions = extractMetaTags(html, 'description');
  if (checkDuplicates(descriptions, 'description tag')) {
    if (descriptions[0].content.length >= 50) {
      log.success(`Description: ${descriptions[0].content.substring(0, 100)}...`);
    } else {
      log.warn('Description is too short (< 50 chars)');
      warnings++;
    }
  }

  // 4. Check brand keywords
  log.info('Checking brand-protective keywords...');
  const keywordsMatch = html.match(/<meta\s+name="keywords"\s+content="([^"]*)"/i);
  if (keywordsMatch) {
    const keywords = keywordsMatch[1].toLowerCase();
    let foundCount = 0;
    for (const kw of BRAND_KEYWORDS) {
      if (keywords.includes(kw)) {
        foundCount++;
      }
    }
    if (foundCount === BRAND_KEYWORDS.length) {
      log.success(`All ${BRAND_KEYWORDS.length} brand keywords present`);
    } else {
      log.warn(`Only ${foundCount}/${BRAND_KEYWORDS.length} brand keywords found`);
      warnings++;
    }
  } else {
    log.warn('No keywords meta tag found');
    warnings++;
  }
}

function validateOpenGraph() {
  log.section('📱 Validating OpenGraph Metadata');

  const html = readFile('index.html');
  if (!html) return;

  const requiredOgTags = [
    'og:type',
    'og:title',
    'og:description',
    'og:url',
    'og:image',
    'og:site_name',
    'og:locale',
  ];

  for (const tag of requiredOgTags) {
    const matches = extractMetaTags(html, tag, 'property');
    if (matches.length === 1) {
      const content = matches[0].content;
      log.success(`${tag}: ${content.substring(0, 80)}${content.length > 80 ? '...' : ''}`);

      // Validate specific tags
      if (tag === 'og:url') {
        validateDomain(content, `OpenGraph ${tag}`);
      }
      if (tag === 'og:image') {
        if (content !== EXPECTED_OG_IMAGE) {
          log.error(`Expected OG image "${EXPECTED_OG_IMAGE}" but got "${content}"`);
          errors++;
        }
      }
    } else if (matches.length === 0) {
      log.error(`Missing required OG tag: ${tag}`);
      errors++;
    } else {
      log.error(`Duplicate OG tag found: ${tag} (${matches.length} instances)`);
      errors++;
    }
  }
}

function validateTwitterCards() {
  log.section('🐦 Validating Twitter Card Metadata');

  const html = readFile('index.html');
  if (!html) return;

  const requiredTwitterTags = [
    'twitter:card',
    'twitter:title',
    'twitter:description',
    'twitter:image',
  ];

  for (const tag of requiredTwitterTags) {
    const matches = extractMetaTags(html, tag);
    if (matches.length === 1) {
      const content = matches[0].content;
      log.success(`${tag}: ${content.substring(0, 80)}${content.length > 80 ? '...' : ''}`);

      if (tag === 'twitter:image') {
        if (content !== EXPECTED_OG_IMAGE) {
          log.error(`Expected Twitter image "${EXPECTED_OG_IMAGE}" but got "${content}"`);
          errors++;
        }
      }
    } else if (matches.length === 0) {
      log.error(`Missing required Twitter tag: ${tag}`);
      errors++;
    } else {
      log.error(`Duplicate Twitter tag found: ${tag} (${matches.length} instances)`);
      errors++;
    }
  }
}

function validateStructuredData() {
  log.section('🔗 Validating JSON-LD Structured Data');

  const html = readFile('index.html');
  if (!html) return;

  const jsonLdData = extractStructuredData(html);

  if (jsonLdData.length === 0) {
    log.error('No JSON-LD structured data found');
    errors++;
    return;
  }

  log.success(`Found ${jsonLdData.length} JSON-LD block(s)`);

  // Validate Organization schema
  const orgSchema = jsonLdData.find(d => d['@type'] === 'Organization' || d['@type'] === 'Corporation');
  if (orgSchema) {
    log.success('Organization schema found');

    const requiredFields = ['name', 'url', 'logo', 'description'];
    for (const field of requiredFields) {
      if (orgSchema[field]) {
        log.success(`  ${field}: ${orgSchema[field]}`);
      } else {
        log.error(`  Missing required field: ${field}`);
        errors++;
      }
    }

    // Check URL domain
    // Organization schema usually points to the global corporate entity (.com)
    if (orgSchema.url) {
      if (orgSchema.url === 'https://algorythmos.com') {
        log.success(`  Organization schema URL: ${orgSchema.url} (Correctly Global)`);
      } else {
        log.error(`Organization schema URL: Expected "https://algorythmos.com" but got "${orgSchema.url}"`);
        errors++;
      }
    }

    // Check social media links
    if (orgSchema.sameAs && Array.isArray(orgSchema.sameAs) && orgSchema.sameAs.length > 0) {
      log.success(`  Social media links: ${orgSchema.sameAs.length}`);
    } else {
      log.warn('  No social media links (sameAs) found');
      warnings++;
    }
  } else {
    log.warn('No Organization schema found in JSON-LD');
    warnings++;
  }
}

function validateStaticAssets() {
  log.section('📦 Validating Static Assets');

  const assets = [
    { path: 'public/robots.txt', name: 'robots.txt' },
    { path: join('public', SITEMAP_FILE), name: `Sitemap (${SITEMAP_FILE})` },
    { path: 'public/Algorythmos.png', name: 'Algorythmos.png (OG image)' },
  ];

  for (const asset of assets) {
    if (existsSync(asset.path)) {
      log.success(`${asset.name} exists`);
    } else {
      log.error(`${asset.name} is missing at ${asset.path}`);
      errors++;
    }
  }
}

function validateSitemap() {
  log.section('🗺️ Validating Sitemap Content');

  const content = readFile(join('public', SITEMAP_FILE));
  if (!content) return;

  const urlMatches = content.match(/<loc>([^<]+)<\/loc>/g);
  if (urlMatches) {
    log.success(`Found ${urlMatches.length} URLs in ${SITEMAP_FILE}`);

    let invalidUrls = 0;
    for (const match of urlMatches) {
      const url = match.replace(/<\/?loc>/g, '');
      if (!url.startsWith(EXPECTED_DOMAIN)) {
        log.error(`Invalid URL in ${SITEMAP_FILE}: ${url} (Expected ${EXPECTED_DOMAIN})`);
        invalidUrls++;
        errors++;
      }
    }

    if (invalidUrls === 0) {
      log.success(`${SITEMAP_FILE} URLs are valid`);
    }
  } else {
    log.error(`No URLs found in ${SITEMAP_FILE}`);
    errors++;
  }
}

// ============================================================================
// MAIN EXECUTION
// ============================================================================

function main() {
  console.log(`
${colors.cyan}╔════════════════════════════════════════════════════════════╗
║                                                            ║
║      🎯 ALGORYTHMOS SEO VALIDATION PIPELINE 🎯             ║
║                                                            ║
║      Enterprise-Grade Quality Check                        ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝${colors.reset}
  `);

  // Run all validations
  validateStaticAssets();
  validateSitemap();
  validateHomepage();
  validateOpenGraph();
  validateTwitterCards();
  validateStructuredData();

  // Final summary
  log.section('📊 VALIDATION SUMMARY');

  console.log(`
  Total Errors:   ${colors.red}${errors}${colors.reset}
  Total Warnings: ${colors.yellow}${warnings}${colors.reset}
  `);

  if (errors === 0 && warnings === 0) {
    log.success('🎉 ALL CHECKS PASSED! SEO is perfect.');
    process.exit(0);
  } else if (errors === 0) {
    log.warn(`⚠️  PASSED with ${warnings} warning(s). Consider addressing them.`);
    process.exit(0);
  } else {
    log.error(`❌ FAILED with ${errors} error(s) and ${warnings} warning(s).`);
    process.exit(1);
  }
}

// Run the validation
main();

#!/usr/bin/env node
/**
 * i18n Consistency Check Script
 *
 * Tier 1 — dictionary parity (FATAL):
 *   - Keys in EN but missing in FR, and vice versa
 *   - AU override keys with no matching global key
 *
 * Tier 2 — untranslated values (FATAL, allowlisted):
 *   - EN/FR values that are byte-identical are treated as untranslated unless
 *     listed in scripts/i18n-allowlist.json → "identicalOk" (brand names,
 *     metrics, dates, technical terms that are legitimately the same in French).
 *
 * Tier 3 — hardcoded copy in source (FATAL, allowlisted):
 *   - Bare text nodes in .astro templates (3+ words) — every user-facing string
 *     must go through t(). Product-mockup chrome (consoles) and other
 *     intentional strings live in the allowlist → "sourceOk".
 *   - String literals in copy-free data modules (services, case studies,
 *     charts) — these carry structure + i18n key references only.
 *
 * Tier 4 — SEO length lint on meta titles/descriptions (warning only).
 *
 * Run: npm run i18n:check
 */

import { readFileSync, readdirSync, statSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join, relative } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = join(__dirname, '..');

// Paths to i18n files (Astro 6: dictionaries live under src/i18n/ui/)
const EN_PATH = join(ROOT, 'src/i18n/ui/en.global.json');
const FR_PATH = join(ROOT, 'src/i18n/ui/fr.fr.json');
const AU_PATH = join(ROOT, 'src/i18n/ui/en.au.json');
const ALLOWLIST_PATH = join(ROOT, 'scripts/i18n-allowlist.json');

// SEO length guidance (warning tier — surfaced but non-fatal).
// Scoped to real <title>/<meta name=description> keys; article headlines and
// chart titles also end in ".title" but are not SEO titles.
const TITLE_MAX = 60;
const DESC_MIN = 70;
const DESC_MAX = 160;
const TITLE_KEY = /(^|\.)(meta\.title|metaTitle)$/;
const DESC_KEY = /(^|\.)(meta\.description|metaDescription)$/;

// Keys to ignore when checking for identical values (structurally non-copy)
const IGNORE_IDENTICAL = [

    /\.value$/,  // Metric values like "<1s", "99.9%"
    /\.icon$/,
    /url/i,
    /email/i,
];

/** Data modules that must stay copy-free (structure + i18n key refs only). */
const COPY_FREE_DATA = [
    'src/data/services.ts',
    'src/data/caseStudies.ts',
    'src/data/blogCharts.ts',
    'src/data/caseStudyCharts.ts',
];

/** Directories whose .astro templates are scanned for bare text nodes. */
const ASTRO_DIRS = ['src/components', 'src/pages', 'src/layouts'];

/**
 * Flatten a nested object to dot notation keys
 */
function flattenObject(obj, prefix = '') {
    const result = {};

    for (const [key, value] of Object.entries(obj)) {
        const newKey = prefix ? `${prefix}.${key}` : key;

        if (value && typeof value === 'object' && !Array.isArray(value)) {
            Object.assign(result, flattenObject(value, newKey));
        } else {
            result[newKey] = value;
        }
    }

    return result;
}

function shouldIgnoreIdentical(key) {
    return IGNORE_IDENTICAL.some(pattern => {
        if (typeof pattern === 'string') {
            return key === pattern || key.includes(pattern);
        }
        return pattern.test(key);
    });
}

// ─────────────────────────────────────────────────────────────────────────────
// Source scan helpers
// ─────────────────────────────────────────────────────────────────────────────

function* walk(dir) {
    for (const entry of readdirSync(dir)) {
        const full = join(dir, entry);
        const st = statSync(full);
        if (st.isDirectory()) yield* walk(full);
        else yield full;
    }
}

/** Count "copy-like" words: purely alphabetic (incl. accents), 2+ chars. */
function copyWordCount(text) {
    const words = text.match(/[A-Za-zÀ-ÿ'’]{2,}/g) ?? [];
    return words.length;
}

/**
 * Extract bare text nodes from an .astro template (the part after frontmatter).
 * Skips: <script>/<style> blocks, HTML comments, tags (incl. attributes), and
 * {expressions} (brace-balanced, string-aware).
 */
function astroTextNodes(source) {
    let tpl = source;
    if (tpl.startsWith('---')) {
        const end = tpl.indexOf('\n---', 3);
        if (end !== -1) tpl = tpl.slice(end + 4);
    }
    tpl = tpl
        .replace(/<script[\s\S]*?<\/script>/gi, '')
        .replace(/<style[\s\S]*?<\/style>/gi, '')
        .replace(/<!--[\s\S]*?-->/g, '');

    const nodes = [];
    let cur = '';
    let inTag = false;
    let exprDepth = 0;
    let quote = null;
    const push = () => {
        const text = cur.replace(/&[a-z#0-9]+;/gi, ' ').trim();
        if (text) nodes.push(text);
        cur = '';
    };
    for (let i = 0; i < tpl.length; i++) {
        const ch = tpl[i];
        if (exprDepth > 0) {
            if (quote) {
                if (ch === quote && tpl[i - 1] !== '\\') quote = null;
            } else if (ch === '"' || ch === "'" || ch === '`') quote = ch;
            else if (ch === '{') exprDepth++;
            else if (ch === '}') exprDepth--;
            continue;
        }
        if (inTag) {
            if (quote) {
                if (ch === quote) quote = null;
            } else if (ch === '"' || ch === "'") quote = ch;
            else if (ch === '>') inTag = false;
            continue;
        }
        if (ch === '<') { push(); inTag = true; continue; }
        if (ch === '{') { push(); exprDepth = 1; continue; }
        cur += ch;
    }
    push();
    return nodes;
}

/**
 * Literal (non-expression) values of human-facing attributes in an .astro
 * template. These leak into the FR build silently because they are not text
 * nodes — every one must go through t().
 */
const COPY_ATTRS = ['aria-label', 'title', 'placeholder', 'alt', 'aria-description'];
function astroAttrLiterals(source) {
    let tpl = source;
    if (tpl.startsWith('---')) {
        const end = tpl.indexOf('\n---', 3);
        if (end !== -1) tpl = tpl.slice(end + 4);
    }
    tpl = tpl.replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<style[\s\S]*?<\/style>/gi, '').replace(/<!--[\s\S]*?-->/g, '');
    const out = [];
    const re = new RegExp(`\\s(${COPY_ATTRS.join('|')})=("([^"]*)"|'([^']*)')`, 'g');
    for (const m of tpl.matchAll(re)) {
        const val = (m[3] ?? m[4] ?? '').trim();
        if (val && copyWordCount(val) >= 2) out.push(`${m[1]}="${val}"`);
    }
    return out;
}

/**
 * Extract string literals from TS/frontmatter source. String-aware enough for
 * this codebase; skips comments, import specifiers, and non-copy shapes
 * (paths, dot-keys, SVG path data, CSS-ish values).
 */
function copyLiterals(source) {
    const noComments = source
        .replace(/\/\*[\s\S]*?\*\//g, '')
        .replace(/(^|[^:])\/\/.*$/gm, '$1');
    const literals = [...noComments.matchAll(/'((?:[^'\\]|\\.)*)'|"((?:[^"\\]|\\.)*)"|`((?:[^`\\]|\\.)*)`/g)]
        .map((m) => m[1] ?? m[2] ?? m[3]);
    return literals.filter((s) => {
        if (copyWordCount(s) < 3) return false;
        if (/^[.@/]|:\/\//.test(s)) return false;                 // paths / URLs
        if (!s.includes(' ')) return false;                        // dot-keys, identifiers
        if (/^[mM]\d/.test(s) || /^M\s?\d/.test(s)) return false;  // SVG path data
        if (/--[a-z-]+:/.test(s)) return false;                    // inline CSS custom props
        return true;
    });
}

/** Scan .astro templates + copy-free data modules for hardcoded copy. */
function scanSource(allowlist) {
    const findings = [];
    const sourceOk = allowlist.sourceOk ?? {};
    const allowed = (file, text) =>
        (sourceOk[file] ?? []).some((frag) => text.includes(frag));

    for (const dir of ASTRO_DIRS) {
        for (const file of walk(join(ROOT, dir))) {
            if (!file.endsWith('.astro')) continue;
            const rel = relative(ROOT, file);
            const src = readFileSync(file, 'utf-8');
            for (const node of astroTextNodes(src)) {
                if (copyWordCount(node) >= 3 && !allowed(rel, node)) {
                    findings.push({ file: rel, kind: 'text-node', text: node });
                }
            }
            for (const attr of astroAttrLiterals(src)) {
                if (!allowed(rel, attr)) findings.push({ file: rel, kind: 'attribute', text: attr });
            }
        }
    }
    for (const relPath of COPY_FREE_DATA) {
        const src = readFileSync(join(ROOT, relPath), 'utf-8');
        for (const lit of copyLiterals(src)) {
            if (!allowed(relPath, lit)) {
                findings.push({ file: relPath, kind: 'data-literal', text: lit });
            }
        }
    }
    return findings;
}

/**
 * Main check function
 */
function runCheck() {
    console.log('\n🔍 i18n Consistency Check\n');
    console.log('═'.repeat(50));

    // Load files
    let enData, frData, auData, allowlist;
    try {
        enData = JSON.parse(readFileSync(EN_PATH, 'utf-8'));
        frData = JSON.parse(readFileSync(FR_PATH, 'utf-8'));
        auData = JSON.parse(readFileSync(AU_PATH, 'utf-8'));
        allowlist = JSON.parse(readFileSync(ALLOWLIST_PATH, 'utf-8'));
    } catch (error) {
        console.error('❌ Error loading i18n files:', error.message);
        process.exit(1);
    }
    const identicalOk = new Set(allowlist.identicalOk ?? []);

    // Flatten both objects
    const enFlat = flattenObject(enData);
    const frFlat = flattenObject(frData);

    const enKeys = new Set(Object.keys(enFlat));
    const frKeys = new Set(Object.keys(frFlat));

    // Find missing keys
    const missingInFr = [...enKeys].filter(k => !frKeys.has(k));
    const missingInEn = [...frKeys].filter(k => !enKeys.has(k));

    // AU overrides must all shadow an existing global key (no orphans — an orphan
    // usually means a typo'd override that silently never renders)
    const auFlat = flattenObject(auData);
    const orphanAuKeys = Object.keys(auFlat).filter(k => !enKeys.has(k));

    // Stale allowlist entries (key no longer exists or is no longer identical)
    const staleAllowlist = [...identicalOk].filter(k => {
        if (!enKeys.has(k) || !frKeys.has(k)) return true;
        return String(enFlat[k]).trim() !== String(frFlat[k]).trim();
    });

    // SEO length lint on meta title/description keys (warning tier)
    const lengthWarnings = [];
    for (const [label, flat] of [['EN', enFlat], ['FR', frFlat], ['AU', auFlat]]) {
        for (const [key, raw] of Object.entries(flat)) {
            if (typeof raw !== 'string') continue;
            const val = raw.trim();
            if (TITLE_KEY.test(key) && val.length > TITLE_MAX) {
                lengthWarnings.push(`[${label}] ${key} — title ${val.length} chars (max ${TITLE_MAX})`);
            } else if (DESC_KEY.test(key) && (val.length < DESC_MIN || val.length > DESC_MAX)) {
                lengthWarnings.push(`[${label}] ${key} — description ${val.length} chars (want ${DESC_MIN}–${DESC_MAX})`);
            }
        }
    }

    // Identical values (untranslated unless allowlisted) — FATAL
    const identical = [];
    for (const key of enKeys) {
        if (frKeys.has(key) && !shouldIgnoreIdentical(key) && !identicalOk.has(key)) {
            const enVal = String(enFlat[key]).trim();
            const frVal = String(frFlat[key]).trim();

            // If they're identical and longer than 10 chars (to avoid false positives on short strings)
            if (enVal === frVal && enVal.length > 10) {
                identical.push(key);
            }
        }
    }

    // Hardcoded copy in source — FATAL
    const sourceFindings = scanSource(allowlist);

    // Report results
    let hasIssues = false;

    // Missing in FR
    if (missingInFr.length > 0) {
        hasIssues = true;
        console.log(`\n❌ Missing in FR (${missingInFr.length}):\n`);
        missingInFr.slice(0, 20).forEach(k => console.log(`   - ${k}`));
        if (missingInFr.length > 20) {
            console.log(`   ... and ${missingInFr.length - 20} more`);
        }
    }

    // Missing in EN
    if (missingInEn.length > 0) {
        hasIssues = true;
        console.log(`\n❌ Missing in EN (${missingInEn.length}):\n`);
        missingInEn.slice(0, 20).forEach(k => console.log(`   - ${k}`));
        if (missingInEn.length > 20) {
            console.log(`   ... and ${missingInEn.length - 20} more`);
        }
    }

    // Orphan AU overrides (fatal)
    if (orphanAuKeys.length > 0) {
        hasIssues = true;
        console.log(`\n❌ AU override keys with no matching global key (${orphanAuKeys.length}):\n`);
        orphanAuKeys.slice(0, 20).forEach(k => console.log(`   - ${k}`));
        if (orphanAuKeys.length > 20) {
            console.log(`   ... and ${orphanAuKeys.length - 20} more`);
        }
    }

    // Untranslated (identical EN/FR, not allowlisted) — fatal
    if (identical.length > 0) {
        hasIssues = true;
        console.log(`\n❌ Untranslated (identical EN/FR, not allowlisted) (${identical.length}):\n`);
        identical.slice(0, 15).forEach(k => {
            const val = String(enFlat[k]).substring(0, 50);
            console.log(`   - ${k}`);
            console.log(`     "${val}${val.length >= 50 ? '...' : ''}"`);
        });
        if (identical.length > 15) {
            console.log(`   ... and ${identical.length - 15} more`);
        }
        console.log('   → translate the FR value, or add the key to scripts/i18n-allowlist.json "identicalOk" if legitimately identical.');
    }

    // Hardcoded copy in components/data — fatal
    if (sourceFindings.length > 0) {
        hasIssues = true;
        console.log(`\n❌ Hardcoded copy in source (${sourceFindings.length}) — route through t():\n`);
        sourceFindings.slice(0, 20).forEach(f => {
            console.log(`   - [${f.kind}] ${f.file}`);
            console.log(`     "${f.text.substring(0, 80)}${f.text.length > 80 ? '...' : ''}"`);
        });
        if (sourceFindings.length > 20) {
            console.log(`   ... and ${sourceFindings.length - 20} more`);
        }
        console.log('   → move the string into src/i18n/ui/*.json (EN + FR), or add it to scripts/i18n-allowlist.json "sourceOk" if intentional (e.g. product-mockup chrome).');
    }

    // Stale allowlist entries (warning — keep the allowlist honest)
    if (staleAllowlist.length > 0) {
        console.log(`\n⚠️  Stale "identicalOk" allowlist entries (${staleAllowlist.length}) — safe to remove:\n`);
        staleAllowlist.slice(0, 10).forEach(k => console.log(`   - ${k}`));
    }

    // SEO length warnings (non-fatal)
    if (lengthWarnings.length > 0) {
        console.log(`\n⚠️  SEO length warnings (${lengthWarnings.length}):\n`);
        lengthWarnings.slice(0, 20).forEach(w => console.log(`   - ${w}`));
        if (lengthWarnings.length > 20) {
            console.log(`   ... and ${lengthWarnings.length - 20} more`);
        }
    }

    // Summary
    console.log('\n' + '═'.repeat(50));
    console.log('\n📊 Summary:\n');
    console.log(`   EN keys: ${enKeys.size}`);
    console.log(`   FR keys: ${frKeys.size}`);
    console.log(`   AU override keys: ${Object.keys(auFlat).length} (orphans: ${orphanAuKeys.length})`);
    console.log(`   Missing in FR: ${missingInFr.length}`);
    console.log(`   Missing in EN: ${missingInEn.length}`);
    console.log(`   Untranslated (fatal): ${identical.length} (allowlisted identical: ${identicalOk.size})`);
    console.log(`   Hardcoded copy in source (fatal): ${sourceFindings.length}`);
    console.log(`   SEO length warnings: ${lengthWarnings.length}`);

    if (!hasIssues) {
        console.log('\n✅ All translations are in sync!\n');
        process.exit(0);
    } else {
        console.log('\n❌ Issues found. Please fix the items above.\n');
        process.exit(1);
    }
}

runCheck();

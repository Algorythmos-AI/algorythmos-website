#!/usr/bin/env node
/**
 * i18n Consistency Check Script
 * 
 * Compares EN and FR translation files to detect:
 * - Keys in EN but missing in FR
 * - Keys in FR but missing in EN
 * - Keys that are identical (potentially untranslated)
 * 
 * Run: npm run i18n:check
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Paths to i18n files (Astro 6: dictionaries live under src/i18n/ui/)
const EN_PATH = join(__dirname, '../src/i18n/ui/en.global.json');
const FR_PATH = join(__dirname, '../src/i18n/ui/fr.fr.json');
const AU_PATH = join(__dirname, '../src/i18n/ui/en.au.json');

// SEO length guidance (warning tier — surfaced but non-fatal)
const TITLE_MAX = 60;
const DESC_MIN = 70;
const DESC_MAX = 160;
const TITLE_KEY = /(^|\.)((meta\.)?title|metaTitle)$/;
const DESC_KEY = /(^|\.)((meta\.)?description|metaDescription)$/;

// Keys to ignore when checking for identical values (these are intentionally the same)
const IGNORE_IDENTICAL = [
    '_AI_AGENT_NOTE',
    /\.value$/,  // Metric values like "<1s", "99.9%"
    /\.icon$/,
    /url/i,
    /email/i,
];

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

/**
 * Check if a key should be ignored for identical check
 */
function shouldIgnoreIdentical(key) {
    return IGNORE_IDENTICAL.some(pattern => {
        if (typeof pattern === 'string') {
            return key === pattern || key.includes(pattern);
        }
        return pattern.test(key);
    });
}

/**
 * Main check function
 */
function runCheck() {
    console.log('\n🔍 i18n Consistency Check\n');
    console.log('═'.repeat(50));

    // Load files
    let enData, frData, auData;
    try {
        enData = JSON.parse(readFileSync(EN_PATH, 'utf-8'));
        frData = JSON.parse(readFileSync(FR_PATH, 'utf-8'));
        auData = JSON.parse(readFileSync(AU_PATH, 'utf-8'));
    } catch (error) {
        console.error('❌ Error loading i18n files:', error.message);
        process.exit(1);
    }

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

    // SEO length lint on title/description-ish keys (warning tier)
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

    // Find identical values (potential untranslated)
    const identical = [];
    for (const key of enKeys) {
        if (frKeys.has(key) && !shouldIgnoreIdentical(key)) {
            const enVal = String(enFlat[key]).trim();
            const frVal = String(frFlat[key]).trim();

            // If they're identical and longer than 10 chars (to avoid false positives on short strings)
            if (enVal === frVal && enVal.length > 10) {
                identical.push(key);
            }
        }
    }

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

    // SEO length warnings (non-fatal)
    if (lengthWarnings.length > 0) {
        console.log(`\n⚠️  SEO length warnings (${lengthWarnings.length}):\n`);
        lengthWarnings.slice(0, 20).forEach(w => console.log(`   - ${w}`));
        if (lengthWarnings.length > 20) {
            console.log(`   ... and ${lengthWarnings.length - 20} more`);
        }
    }

    // Potentially untranslated
    if (identical.length > 0) {
        console.log(`\n⚠️  Potentially untranslated (identical EN/FR) (${identical.length}):\n`);
        identical.slice(0, 15).forEach(k => {
            const val = String(enFlat[k]).substring(0, 50);
            console.log(`   - ${k}`);
            console.log(`     "${val}${val.length >= 50 ? '...' : ''}"`);
        });
        if (identical.length > 15) {
            console.log(`   ... and ${identical.length - 15} more`);
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
    console.log(`   SEO length warnings: ${lengthWarnings.length}`);
    console.log(`   Potentially untranslated: ${identical.length}`);

    if (!hasIssues && identical.length === 0) {
        console.log('\n✅ All translations are in sync!\n');
        process.exit(0);
    } else if (!hasIssues && identical.length > 0) {
        console.log('\n⚠️  Check potentially untranslated items above.\n');
        process.exit(0);
    } else {
        console.log('\n❌ Issues found. Please fix missing translations.\n');
        process.exit(1);
    }
}

runCheck();

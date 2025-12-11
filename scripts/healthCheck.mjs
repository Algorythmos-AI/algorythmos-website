#!/usr/bin/env node
/**
 * Health Check Script
 * 
 * Scans the codebase for common issues:
 * - Missing alt text on images
 * - Missing aria-labels on interactive elements
 * - Hardcoded English strings
 * - Oversized images (>500KB)
 * 
 * Run: npm run health:check
 */

import { readdirSync, statSync, readFileSync } from 'fs';
import { join, extname } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const SRC_DIR = join(__dirname, '../src');
const PUBLIC_DIR = join(__dirname, '../public');

// Patterns to detect hardcoded English
const HARDCODED_PATTERNS = [
    />\s*Book a (Discovery )?Call\s*</gi,
    />\s*Learn More\s*</gi,
    />\s*Contact Us\s*</gi,
    />\s*Get Started\s*</gi,
    />\s*View Pricing\s*</gi,
];

// Results
const issues = {
    missingAlt: [],
    missingAriaLabel: [],
    hardcodedEnglish: [],
    oversizedImages: [],
};

/**
 * Recursively get all files
 */
function getFiles(dir, extensions) {
    let files = [];
    try {
        const items = readdirSync(dir);
        for (const item of items) {
            const fullPath = join(dir, item);
            try {
                const stat = statSync(fullPath);
                if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
                    files = files.concat(getFiles(fullPath, extensions));
                } else if (stat.isFile() && extensions.includes(extname(item))) {
                    files.push(fullPath);
                }
            } catch (e) { /* skip */ }
        }
    } catch (e) { /* skip */ }
    return files;
}

/**
 * Check JSX files for issues
 */
function checkJsxFiles() {
    const jsxFiles = getFiles(SRC_DIR, ['.jsx', '.tsx', '.js']);

    for (const file of jsxFiles) {
        const content = readFileSync(file, 'utf-8');
        const lines = content.split('\n');

        lines.forEach((line, i) => {
            // Check for <img without alt
            if (/<img[^>]*>/i.test(line) && !line.includes('alt=')) {
                issues.missingAlt.push({ file, line: i + 1 });
            }

            // Check for buttons/links without aria-label (if icon-only)
            if (/<(button|a)\s[^>]*>/i.test(line) &&
                !line.includes('aria-label') &&
                line.includes('className') &&
                (line.includes('Icon') || line.includes('icon'))) {
                issues.missingAriaLabel.push({ file, line: i + 1 });
            }

            // Check for hardcoded English
            for (const pattern of HARDCODED_PATTERNS) {
                if (pattern.test(line) && !line.includes('t(') && !line.includes('t("')) {
                    issues.hardcodedEnglish.push({ file, line: i + 1, match: line.trim().substring(0, 60) });
                    break;
                }
            }
        });
    }
}

/**
 * Check for oversized images
 */
function checkImages() {
    const imageExts = ['.png', '.jpg', '.jpeg', '.gif', '.webp'];
    const dirs = [PUBLIC_DIR, join(SRC_DIR, 'assets')];

    for (const dir of dirs) {
        try {
            const images = getFiles(dir, imageExts);
            for (const img of images) {
                const stat = statSync(img);
                if (stat.size > 500 * 1024) { // > 500KB
                    issues.oversizedImages.push({
                        file: img,
                        size: `${(stat.size / 1024).toFixed(0)}KB`
                    });
                }
            }
        } catch (e) { /* skip */ }
    }
}

/**
 * Print report
 */
function printReport() {
    console.log('\n🏥 Health Check Report\n');
    console.log('═'.repeat(50));

    let hasIssues = false;

    if (issues.missingAlt.length > 0) {
        hasIssues = true;
        console.log(`\n⚠️  Missing alt text (${issues.missingAlt.length}):\n`);
        issues.missingAlt.slice(0, 10).forEach(({ file, line }) => {
            console.log(`   ${file.replace(SRC_DIR, 'src')}:${line}`);
        });
        if (issues.missingAlt.length > 10) console.log(`   ... and ${issues.missingAlt.length - 10} more`);
    }

    if (issues.missingAriaLabel.length > 0) {
        hasIssues = true;
        console.log(`\n⚠️  Missing aria-labels (${issues.missingAriaLabel.length}):\n`);
        issues.missingAriaLabel.slice(0, 10).forEach(({ file, line }) => {
            console.log(`   ${file.replace(SRC_DIR, 'src')}:${line}`);
        });
        if (issues.missingAriaLabel.length > 10) console.log(`   ... and ${issues.missingAriaLabel.length - 10} more`);
    }

    if (issues.hardcodedEnglish.length > 0) {
        hasIssues = true;
        console.log(`\n❌ Hardcoded English detected (${issues.hardcodedEnglish.length}):\n`);
        issues.hardcodedEnglish.slice(0, 10).forEach(({ file, line, match }) => {
            console.log(`   ${file.replace(SRC_DIR, 'src')}:${line}`);
            console.log(`     "${match}..."`);
        });
        if (issues.hardcodedEnglish.length > 10) console.log(`   ... and ${issues.hardcodedEnglish.length - 10} more`);
    }

    if (issues.oversizedImages.length > 0) {
        console.log(`\n⚠️  Oversized images >500KB (${issues.oversizedImages.length}):\n`);
        issues.oversizedImages.forEach(({ file, size }) => {
            console.log(`   ${size} - ${file.split('/').slice(-2).join('/')}`);
        });
    }

    console.log('\n' + '═'.repeat(50));
    console.log('\n📊 Summary:\n');
    console.log(`   Missing alt text: ${issues.missingAlt.length}`);
    console.log(`   Missing aria-labels: ${issues.missingAriaLabel.length}`);
    console.log(`   Hardcoded English: ${issues.hardcodedEnglish.length}`);
    console.log(`   Oversized images: ${issues.oversizedImages.length}`);

    if (!hasIssues && issues.oversizedImages.length === 0) {
        console.log('\n✅ Health check passed!\n');
        process.exit(0);
    } else if (issues.hardcodedEnglish.length > 0) {
        console.log('\n❌ Hardcoded English detected. Fix before committing.\n');
        process.exit(1);
    } else {
        console.log('\n⚠️  Some issues found. Review above.\n');
        process.exit(0);
    }
}

// Run
checkJsxFiles();
checkImages();
printReport();

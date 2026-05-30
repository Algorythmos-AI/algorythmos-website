#!/usr/bin/env node
/**
 * Health Check Script (Astro 6)
 *
 * Scans the new Astro source tree (src/**, including .astro components/pages)
 * for common quality issues:
 *  - Hardcoded user-facing EN/FR strings in markup (should come from t() /
 *    useTranslations, never literal sentences baked into .astro/.tsx)
 *  - Missing alt text on <img>
 *  - Missing aria-labels on icon-only interactive elements
 *  - Oversized images (>500KB) in public/ and src/assets
 *
 * Explicitly excludes legacy/ (archived Vite SPA), dist/ (build output) and
 * node_modules/.
 *
 * Run: npm run health:check
 */

import { readdirSync, statSync, readFileSync } from 'fs';
import { join, extname, relative } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const ROOT = join(__dirname, '..');
const SRC_DIR = join(ROOT, 'src');
const PUBLIC_DIR = join(ROOT, 'public');

// Directory names that are never scanned, wherever they appear.
const EXCLUDED_DIRS = new Set(['legacy', 'dist', 'node_modules', '.git', '.astro']);

// Source extensions to scan for markup issues (Astro islands are .tsx/.jsx).
const CODE_EXTS = ['.astro', '.tsx', '.jsx', '.ts', '.js'];

// Patterns to detect hardcoded user-facing CTA/button strings (EN + FR).
// In .astro / .tsx these should always be rendered via t() / useTranslations.
const HARDCODED_PATTERNS = [
    // English CTAs
    />\s*Book a (Discovery )?Call\s*</gi,
    />\s*Learn More\s*</gi,
    />\s*Contact Us\s*</gi,
    />\s*Get Started\s*</gi,
    />\s*View Pricing\s*</gi,
    // French CTAs
    />\s*Réservez un Appel\s*</gi,
    />\s*En savoir plus\s*</gi,
    />\s*Nous contacter\s*</gi,
    />\s*Commencer\s*</gi,
];

// A literal "sentence" baked into markup: text node of >= 25 chars containing a
// space and at least one lowercase word, sitting between tags. Flags prose that
// should have come from t(). Tokens that are obviously dynamic ({expr}, t(...))
// are skipped by the caller.
const SENTENCE_IN_MARKUP = />\s*([A-Za-zÀ-ÿ][^<>{}]{24,})\s*</g;

// Results
const issues = {
    missingAlt: [],
    missingAriaLabel: [],
    hardcodedEnglish: [],
    literalSentences: [],
    oversizedImages: [],
};

/** Recursively collect files with the given extensions, honouring EXCLUDED_DIRS. */
function getFiles(dir, extensions) {
    let files = [];
    let items;
    try {
        items = readdirSync(dir);
    } catch {
        return files;
    }
    for (const item of items) {
        const fullPath = join(dir, item);
        let stat;
        try {
            stat = statSync(fullPath);
        } catch {
            continue;
        }
        if (stat.isDirectory()) {
            if (EXCLUDED_DIRS.has(item) || item.startsWith('.')) continue;
            files = files.concat(getFiles(fullPath, extensions));
        } else if (stat.isFile() && extensions.includes(extname(item))) {
            files.push(fullPath);
        }
    }
    return files;
}

const rel = (file) => relative(ROOT, file);

/** True if a line is clearly producing its text dynamically (t(), interpolation, etc.). */
function isLocalizedLine(line) {
    return (
        line.includes('t(') ||
        line.includes('{t(') ||
        line.includes('useTranslations') ||
        line.includes('{') // any JSX/Astro expression on the line
    );
}

/** Scan Astro + island source files for markup-level issues. */
function checkSourceFiles() {
    const codeFiles = getFiles(SRC_DIR, CODE_EXTS);

    for (const file of codeFiles) {
        const content = readFileSync(file, 'utf-8');
        const lines = content.split('\n');

        lines.forEach((line, i) => {
            // <img> without alt
            if (/<img[^>]*>/i.test(line) && !/\balt\s*=/.test(line)) {
                issues.missingAlt.push({ file, line: i + 1 });
            }

            // Icon-only button/anchor without aria-label
            if (
                /<(button|a)\s[^>]*>/i.test(line) &&
                !line.includes('aria-label') &&
                (line.includes('class=') || line.includes('className=')) &&
                (line.includes('Icon') || line.includes('icon'))
            ) {
                issues.missingAriaLabel.push({ file, line: i + 1 });
            }

            // Hardcoded CTA strings (known phrases)
            for (const pattern of HARDCODED_PATTERNS) {
                pattern.lastIndex = 0;
                if (pattern.test(line) && !isLocalizedLine(line)) {
                    issues.hardcodedEnglish.push({
                        file,
                        line: i + 1,
                        match: line.trim().substring(0, 60),
                    });
                    break;
                }
            }

            // Literal sentences in markup (only flag when the line is NOT producing
            // text via t()/interpolation — those are the genuinely hardcoded ones).
            if (!isLocalizedLine(line)) {
                SENTENCE_IN_MARKUP.lastIndex = 0;
                let m;
                while ((m = SENTENCE_IN_MARKUP.exec(line)) !== null) {
                    const text = m[1].trim();
                    // must contain a space (a real phrase) and a lowercase letter
                    if (/\s/.test(text) && /[a-zà-ÿ]/.test(text)) {
                        issues.literalSentences.push({
                            file,
                            line: i + 1,
                            match: text.substring(0, 60),
                        });
                        break;
                    }
                }
            }
        });
    }
}

/** Flag oversized raster images in public/ and src/assets. */
function checkImages() {
    const imageExts = ['.png', '.jpg', '.jpeg', '.gif', '.webp'];
    const dirs = [PUBLIC_DIR, join(SRC_DIR, 'assets')];

    for (const dir of dirs) {
        const images = getFiles(dir, imageExts);
        for (const img of images) {
            let stat;
            try {
                stat = statSync(img);
            } catch {
                continue;
            }
            if (stat.size > 500 * 1024) {
                issues.oversizedImages.push({
                    file: img,
                    size: `${(stat.size / 1024).toFixed(0)}KB`,
                });
            }
        }
    }
}

/** Print the report and exit with the appropriate code. */
function printReport() {
    console.log('\n🏥 Health Check Report (Astro)\n');
    console.log('═'.repeat(50));

    let hasIssues = false;

    if (issues.missingAlt.length > 0) {
        hasIssues = true;
        console.log(`\n⚠️  Missing alt text (${issues.missingAlt.length}):\n`);
        issues.missingAlt.slice(0, 10).forEach(({ file, line }) => {
            console.log(`   ${rel(file)}:${line}`);
        });
        if (issues.missingAlt.length > 10) console.log(`   ... and ${issues.missingAlt.length - 10} more`);
    }

    if (issues.missingAriaLabel.length > 0) {
        hasIssues = true;
        console.log(`\n⚠️  Missing aria-labels (${issues.missingAriaLabel.length}):\n`);
        issues.missingAriaLabel.slice(0, 10).forEach(({ file, line }) => {
            console.log(`   ${rel(file)}:${line}`);
        });
        if (issues.missingAriaLabel.length > 10) console.log(`   ... and ${issues.missingAriaLabel.length - 10} more`);
    }

    if (issues.hardcodedEnglish.length > 0) {
        hasIssues = true;
        console.log(`\n❌ Hardcoded EN/FR CTA strings (${issues.hardcodedEnglish.length}):\n`);
        issues.hardcodedEnglish.slice(0, 10).forEach(({ file, line, match }) => {
            console.log(`   ${rel(file)}:${line}`);
            console.log(`     "${match}..."`);
        });
        if (issues.hardcodedEnglish.length > 10) console.log(`   ... and ${issues.hardcodedEnglish.length - 10} more`);
    }

    if (issues.literalSentences.length > 0) {
        console.log(`\n⚠️  Possible literal sentences in markup (${issues.literalSentences.length}):\n`);
        console.log('   (user-facing text should come from t() / useTranslations)\n');
        issues.literalSentences.slice(0, 10).forEach(({ file, line, match }) => {
            console.log(`   ${rel(file)}:${line}`);
            console.log(`     "${match}..."`);
        });
        if (issues.literalSentences.length > 10) console.log(`   ... and ${issues.literalSentences.length - 10} more`);
    }

    if (issues.oversizedImages.length > 0) {
        console.log(`\n⚠️  Oversized images >500KB (${issues.oversizedImages.length}):\n`);
        issues.oversizedImages.forEach(({ file, size }) => {
            console.log(`   ${size} - ${rel(file)}`);
        });
    }

    console.log('\n' + '═'.repeat(50));
    console.log('\n📊 Summary:\n');
    console.log(`   Missing alt text: ${issues.missingAlt.length}`);
    console.log(`   Missing aria-labels: ${issues.missingAriaLabel.length}`);
    console.log(`   Hardcoded EN/FR CTAs: ${issues.hardcodedEnglish.length}`);
    console.log(`   Literal sentences (review): ${issues.literalSentences.length}`);
    console.log(`   Oversized images: ${issues.oversizedImages.length}`);

    // Hard gate ONLY on confirmed hardcoded CTA strings. Alt-text and literal
    // sentences are warnings to review (literal-sentence detection is heuristic).
    if (issues.hardcodedEnglish.length > 0) {
        console.log('\n❌ Hardcoded EN/FR detected. Move it into src/i18n/ui/*.json and use t(). \n');
        process.exit(1);
    }

    if (hasIssues || issues.oversizedImages.length > 0 || issues.literalSentences.length > 0) {
        console.log('\n⚠️  Some issues found. Review above.\n');
        process.exit(0);
    }

    console.log('\n✅ Health check passed!\n');
    process.exit(0);
}

// Run
checkSourceFiles();
checkImages();
printReport();

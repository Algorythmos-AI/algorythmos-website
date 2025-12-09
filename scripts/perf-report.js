#!/usr/bin/env node
// scripts/perf-report.js
// Bundle performance analysis for CI/CD and local development

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DIST_DIR = path.join(__dirname, '..', 'dist', 'assets');
const SIZE_LIMIT_KB = 200;
const WARNING_LIMIT_KB = 100;

// ANSI colors for terminal output
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
  if (kb >= 1024) {
    return `${(kb / 1024).toFixed(2)} MB`;
  }
  return `${kb.toFixed(2)} kB`;
}

function getChunkCategory(filename) {
  if (filename.includes('react-vendor')) return 'Core (React)';
  if (filename.includes('framer')) return 'Animation';
  if (filename.includes('recharts')) return 'Charts';
  if (filename.includes('embla')) return 'Carousel';
  if (filename.includes('index-') && filename.endsWith('.js')) return 'App Shell';
  if (filename.includes('Page')) return 'Page';
  if (filename.includes('Grid') || filename.includes('Carousel') || filename.includes('Showcase')) return 'Component';
  if (filename.endsWith('.css')) return 'Styles';
  return 'Other';
}

function analyzeBundle() {
  console.log('\n' + colors.cyan + colors.bold);
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║                                                            ║');
  console.log('║      📦 ALGORYTHMOS BUNDLE PERFORMANCE REPORT 📦          ║');
  console.log('║                                                            ║');
  console.log('╚════════════════════════════════════════════════════════════╝');
  console.log(colors.reset);

  if (!fs.existsSync(DIST_DIR)) {
    console.log(colors.red + '❌ No dist/assets folder found. Run "npm run build" first.' + colors.reset);
    process.exit(1);
  }

  const files = fs.readdirSync(DIST_DIR);
  const jsFiles = files.filter(f => f.endsWith('.js')).map(f => {
    const stats = fs.statSync(path.join(DIST_DIR, f));
    return {
      name: f,
      size: stats.size,
      sizeKb: stats.size / 1024,
      category: getChunkCategory(f),
    };
  }).sort((a, b) => b.size - a.size);

  const cssFiles = files.filter(f => f.endsWith('.css')).map(f => {
    const stats = fs.statSync(path.join(DIST_DIR, f));
    return { name: f, size: stats.size, sizeKb: stats.size / 1024 };
  });

  // Calculate totals
  const totalJs = jsFiles.reduce((sum, f) => sum + f.size, 0);
  const totalCss = cssFiles.reduce((sum, f) => sum + f.size, 0);

  // Find the main app shell chunk
  const appShell = jsFiles.find(f => f.category === 'App Shell');
  const reactVendor = jsFiles.find(f => f.category === 'Core (React)');

  // Initial load = App Shell + React Vendor (what loads on first visit)
  const initialLoadSize = (appShell?.size || 0) + (reactVendor?.size || 0);
  const initialLoadKb = initialLoadSize / 1024;

  console.log(colors.bold + '\n📊 BUNDLE SUMMARY' + colors.reset);
  console.log('─'.repeat(60));
  
  const initialColor = initialLoadKb > SIZE_LIMIT_KB ? colors.red : 
                       initialLoadKb > WARNING_LIMIT_KB ? colors.yellow : colors.green;
  
  console.log(`${colors.bold}Initial Load (critical):${colors.reset} ${initialColor}${formatSize(initialLoadSize)}${colors.reset}`);
  console.log(`${colors.bold}Total JavaScript:${colors.reset}        ${formatSize(totalJs)}`);
  console.log(`${colors.bold}Total CSS:${colors.reset}               ${formatSize(totalCss)}`);

  // Group by category
  const byCategory = {};
  jsFiles.forEach(f => {
    if (!byCategory[f.category]) {
      byCategory[f.category] = { files: [], total: 0 };
    }
    byCategory[f.category].files.push(f);
    byCategory[f.category].total += f.size;
  });

  console.log(colors.bold + '\n📦 CHUNKS BY CATEGORY' + colors.reset);
  console.log('─'.repeat(60));

  Object.entries(byCategory)
    .sort((a, b) => b[1].total - a[1].total)
    .forEach(([category, data]) => {
      const categoryColor = data.total / 1024 > SIZE_LIMIT_KB ? colors.yellow : colors.reset;
      console.log(`\n${colors.bold}${category}${colors.reset} (${categoryColor}${formatSize(data.total)}${colors.reset})`);
      data.files.slice(0, 5).forEach(f => {
        const sizeColor = f.sizeKb > SIZE_LIMIT_KB ? colors.red :
                         f.sizeKb > WARNING_LIMIT_KB ? colors.yellow : colors.reset;
        const shortName = f.name.replace(/-[\w]{8}\.js$/, '.js');
        console.log(`  ${sizeColor}${formatSize(f.size).padStart(10)}${colors.reset}  ${shortName}`);
      });
      if (data.files.length > 5) {
        console.log(`  ... and ${data.files.length - 5} more`);
      }
    });

  // Warnings
  const oversizedChunks = jsFiles.filter(f => f.sizeKb > SIZE_LIMIT_KB);
  
  console.log(colors.bold + '\n⚠️  WARNINGS' + colors.reset);
  console.log('─'.repeat(60));

  if (oversizedChunks.length > 0) {
    oversizedChunks.forEach(f => {
      console.log(`${colors.yellow}⚠  ${f.name} is ${formatSize(f.size)} (>${SIZE_LIMIT_KB} kB limit)${colors.reset}`);
    });
  } else {
    console.log(`${colors.green}✅ No chunks exceed ${SIZE_LIMIT_KB} kB${colors.reset}`);
  }

  if (initialLoadKb > 180) {
    console.log(`${colors.red}❌ Initial load ${formatSize(initialLoadSize)} exceeds 180 kB target${colors.reset}`);
  } else {
    console.log(`${colors.green}✅ Initial load ${formatSize(initialLoadSize)} is under 180 kB target${colors.reset}`);
  }

  // Final status
  console.log(colors.bold + '\n📋 FINAL STATUS' + colors.reset);
  console.log('─'.repeat(60));
  
  const passed = initialLoadKb <= 180 && oversizedChunks.length <= 1;
  
  if (passed) {
    console.log(colors.green + colors.bold + '✅ PERFORMANCE CHECK PASSED' + colors.reset);
  } else {
    console.log(colors.yellow + colors.bold + '⚠️  PERFORMANCE NEEDS IMPROVEMENT' + colors.reset);
  }

  console.log('\n');
  
  return passed ? 0 : 1;
}

// Run analysis
const exitCode = analyzeBundle();
process.exit(exitCode);

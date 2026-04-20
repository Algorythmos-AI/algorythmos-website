import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const inputDir = './public/assets/lottie/scroll';
const outputDir = './public/assets/lottie/scroll/webp';

// Create output directory
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

// Get all PNG files
const pngFiles = fs.readdirSync(inputDir).filter(f => f.endsWith('.png'));

console.log(`Converting ${pngFiles.length} PNG files to WebP...`);

let totalPngSize = 0;
let totalWebpSize = 0;

for (const file of pngFiles) {
    const inputPath = path.join(inputDir, file);
    const outputPath = path.join(outputDir, file.replace('.png', '.webp'));

    const pngStats = fs.statSync(inputPath);
    totalPngSize += pngStats.size;

    await sharp(inputPath)
        .webp({ quality: 85, lossless: false })
        .toFile(outputPath);

    const webpStats = fs.statSync(outputPath);
    totalWebpSize += webpStats.size;

    console.log(`✓ ${file} → ${file.replace('.png', '.webp')}`);
}

console.log(`\n=== Conversion Complete ===`);
console.log(`PNG Total:  ${(totalPngSize / 1024 / 1024).toFixed(2)} MB`);
console.log(`WebP Total: ${(totalWebpSize / 1024 / 1024).toFixed(2)} MB`);
console.log(`Savings:    ${((1 - totalWebpSize / totalPngSize) * 100).toFixed(1)}%`);

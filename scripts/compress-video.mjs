import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const VIDEO_DIR = path.join(__dirname, '../src/assets/microanimations');
const MAX_SIZE_MB = 2;

// Vercel-optimized FFmpeg flags
// -c:v libvpx-vp9: Good balance for WebM
// -crf 30: Variable bitrate (higher = more compression)
// -b:v 0: Allow CRF to control bitrate
// -an: Remove audio (micro-animations are silent)
const WEBM_FLAGS = '-c:v libvpx-vp9 -crf 35 -b:v 0 -an -deadstroke 1 -cpu-used 2';
const MP4_FLAGS = '-c:v libx264 -crf 28 -preset slow -an -movflags +faststart';

console.log('🎬 Starting Video Compression Pipeline...');

if (!fs.existsSync(VIDEO_DIR)) {
    console.log(`❌ Directory not found: ${VIDEO_DIR}`);
    console.log('Skipping compression.');
    process.exit(0);
}

const files = fs.readdirSync(VIDEO_DIR);
const videoFiles = files.filter(f => f.endsWith('.webm') || f.endsWith('.mp4'));

if (videoFiles.length === 0) {
    console.log('ℹ️ No video files found to compress.');
    process.exit(0);
}

const compressFile = (file) => {
    const inputPath = path.join(VIDEO_DIR, file);
    const ext = path.extname(file);
    const basename = path.basename(file, ext);
    const tempOutput = path.join(VIDEO_DIR, `temp_${file}`);

    // Calculate size
    const stats = fs.statSync(inputPath);
    const sizeMB = stats.size / (1024 * 1024);

    if (sizeMB < MAX_SIZE_MB) {
        console.log(`✅ ${file} is already optimized (${sizeMB.toFixed(2)} MB)`);
        // Optional: Still generate MP4 fallback if missing
        return;
    }

    console.log(`🔄 Compressing ${file} (${sizeMB.toFixed(2)} MB)...`);

    const flags = ext === '.webm' ? WEBM_FLAGS : MP4_FLAGS;
    const cmd = `ffmpeg -y -i "${inputPath}" ${flags} "${tempOutput}"`;

    exec(cmd, (error, stdout, stderr) => {
        if (error) {
            console.error(`❌ Error compressing ${file}:`, error);
            return;
        }

        // Replace original with compressed
        fs.renameSync(tempOutput, inputPath);

        const newStats = fs.statSync(inputPath);
        const newSizeMB = newStats.size / (1024 * 1024);
        const reduction = ((sizeMB - newSizeMB) / sizeMB * 100).toFixed(1);

        console.log(`✨ Compressed ${file}: ${newSizeMB.toFixed(2)} MB (-${reduction}%)`);
    });
};

videoFiles.forEach(compressFile);

#!/usr/bin/env node
/**
 * Photography pipeline — turns source JPEGs into verified responsive WebP sets.
 *
 * For each source in SRC_DIR it emits <name>-{800,1200,1600}.webp into
 * public/assets/photos/, then VERIFIES each output by decoding it:
 *   - real pixel width matches the requested variant width
 *   - file weight ≤ 500KB (the healthCheck.mjs raster cap)
 * Any violation exits 1 so a bad asset cannot ship silently.
 *
 * Usage: node scripts/prepare-photos.mjs [src-dir]
 * (src-dir defaults to ./photo-sources; sources are NOT committed)
 */
import { readdirSync, existsSync, mkdirSync, statSync } from 'fs';
import { join, dirname, basename, extname } from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SRC_DIR = process.argv[2] ?? join(__dirname, '..', 'photo-sources');
const OUT_DIR = join(__dirname, '..', 'public', 'assets', 'photos');
const WIDTHS = [800, 1200, 1600];
const MAX_BYTES = 500 * 1024;
/** 3:2 crop keeps every slot's aspect consistent (CLS + design uniformity). */
const ASPECT = 3 / 2;

if (!existsSync(SRC_DIR)) {
  console.error(`✗ Source dir not found: ${SRC_DIR}`);
  process.exit(1);
}
mkdirSync(OUT_DIR, { recursive: true });

const sources = readdirSync(SRC_DIR).filter((f) => /\.(jpe?g|png)$/i.test(f));
if (sources.length === 0) {
  console.error(`✗ No JPEG/PNG sources in ${SRC_DIR}`);
  process.exit(1);
}

let failures = 0;
for (const src of sources) {
  const name = basename(src, extname(src));
  for (const width of WIDTHS) {
    const height = Math.round(width / ASPECT);
    const out = join(OUT_DIR, `${name}-${width}.webp`);
    await sharp(join(SRC_DIR, src))
      .rotate() // honour EXIF orientation, then strip metadata (default)
      .resize(width, height, { fit: 'cover', position: 'attention' })
      .webp({ quality: 80 })
      .toFile(out);

    // Verify by decoding the written file — never trust the encode blindly.
    const meta = await sharp(out).metadata();
    const bytes = statSync(out).size;
    const ok = meta.width === width && meta.height === height && bytes <= MAX_BYTES;
    console.log(`${ok ? '✓' : '✗'} ${basename(out)} — ${meta.width}×${meta.height}, ${(bytes / 1024).toFixed(0)}KB`);
    if (!ok) failures++;
  }
}

if (failures > 0) {
  console.error(`\n✗ ${failures} variant(s) failed verification.`);
  process.exit(1);
}
console.log(`\n✓ ${sources.length} photos × ${WIDTHS.length} variants verified in public/assets/photos/`);

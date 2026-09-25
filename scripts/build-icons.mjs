#!/usr/bin/env node
/**
 * One-off generator for the site icons (run by hand when the mark changes;
 * outputs are committed). Uses sharp, already a devDependency.
 *
 *   node scripts/build-icons.mjs
 *
 * - public/favicon.ico: a real ICO (16, 32, 48 px PNG entries) of the mark on a
 *   transparent background. The previous file was a 500×500 PNG renamed .ico,
 *   and the wordmark was unreadable at tab size.
 * - public/maskable-192.png / maskable-512.png: the mark at ~55% of the canvas
 *   on the brand's light background, inside the 40% safe-zone radius that
 *   Android masks to a circle or squircle. The existing favicon-*.png stay as
 *   "any" icons.
 */
import sharp from 'sharp';
import { writeFileSync } from 'node:fs';

const MARK = 'public/logo-mark.png';
const LIGHT_BG = { r: 246, g: 245, b: 245, alpha: 1 }; // #f6f5f5, the favicon background

/** The mark centred on a square canvas, scaled to `fraction` of the canvas height. */
async function markOnSquare(size, fraction, background) {
  const h = Math.round(size * fraction);
  const mark = await sharp(MARK).resize({ height: h, fit: 'inside' }).png().toBuffer();
  return sharp({ create: { width: size, height: size, channels: 4, background } })
    .composite([{ input: mark, gravity: 'center' }])
    .png()
    .toBuffer();
}

/** Minimal ICO container with PNG payloads (supported by every current browser). */
function ico(images) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(images.length, 4);
  let offset = 6 + 16 * images.length;
  const entries = images.map(({ size, data }) => {
    const e = Buffer.alloc(16);
    e.writeUInt8(size >= 256 ? 0 : size, 0); // width
    e.writeUInt8(size >= 256 ? 0 : size, 1); // height
    e.writeUInt8(0, 2); // palette colours
    e.writeUInt8(0, 3); // reserved
    e.writeUInt16LE(1, 4); // colour planes
    e.writeUInt16LE(32, 6); // bits per pixel
    e.writeUInt32LE(data.length, 8);
    e.writeUInt32LE(offset, 12);
    offset += data.length;
    return e;
  });
  return Buffer.concat([header, ...entries, ...images.map((i) => i.data)]);
}

const transparent = { r: 0, g: 0, b: 0, alpha: 0 };
const icoImages = [];
for (const size of [16, 32, 48]) {
  icoImages.push({ size, data: await markOnSquare(size, 0.9, transparent) });
}
writeFileSync('public/favicon.ico', ico(icoImages));

for (const size of [192, 512]) {
  writeFileSync(`public/maskable-${size}.png`, await markOnSquare(size, 0.55, LIGHT_BG));
}
console.log('Wrote public/favicon.ico (16/32/48) and public/maskable-{192,512}.png');

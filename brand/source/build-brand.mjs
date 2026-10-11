#!/usr/bin/env node
/**
 * Builds every logo export from brand/source/master.svg.
 *
 *   npm run brand:build            regenerate brand/ (and print/ PDFs)
 *   npm run brand:build -- --site  also regenerate the site's logo assets in public/
 *   npm run brand:check            rebuild to a temp dir and compare with what is committed
 *
 * Safety: everything is rendered and verified in a temporary directory first. Only when every
 * file passes its checks are the outputs copied into place, so a failed run changes nothing.
 * Uses sharp (rasters) and Playwright's Chromium (vector PDFs); both are devDependencies.
 */
import sharp from 'sharp';
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const MASTER = join(ROOT, 'brand/source/master.svg');
const args = new Set(process.argv.slice(2));
const CHECK = args.has('--check');
const WRITE_SITE = args.has('--site');
const NO_PDF = args.has('--no-pdf') || CHECK;

export const PALETTE = {
  indigo: '#3715E0',
  violet: '#6D00FF',
  dotStart: '#4315E4',
  dotEnd: '#6D1DF5',
  ink: '#08080C',
  paper: '#FFFFFF',
  black: '#000000',
};

class BrandError extends Error {}
const fail = (msg) => {
  throw new BrandError(msg);
};

// ── master ──────────────────────────────────────────────────────────────────
function readMaster() {
  if (!existsSync(MASTER)) fail(`master not found: ${MASTER}`);
  const src = readFileSync(MASTER, 'utf8');
  if (/<image\b|<text\b|<script\b|href=["']http/i.test(src)) fail('master.svg must contain only vector shapes (no image, text, script or external reference)');
  const allowed = new Set(Object.values(PALETTE).map((c) => c.toLowerCase()));
  for (const [hex] of src.matchAll(/#[0-9a-fA-F]{6}\b/g)) {
    if (!allowed.has(hex.toLowerCase())) fail(`master.svg uses a colour outside the palette: ${hex}`);
  }
  const el = (id) => src.match(new RegExp(`<(?:path|circle)\\b[^>]*\\bid="${id}"[^>]*>`))?.[0] ?? fail(`master.svg is missing #${id}`);
  const attr = (tag, name) => tag.match(new RegExp(`\\b${name}="([^"]*)"`))?.[1] ?? fail(`master.svg: ${name} missing on ${tag.slice(0, 40)}…`);
  const dot = el('mark-dot');
  const word = el('wordmark');
  return {
    body: attr(el('mark-body'), 'd'),
    smallBody: attr(el('mark-small-body'), 'd'),
    dot: { cx: +attr(dot, 'cx'), cy: +attr(dot, 'cy'), r: +attr(dot, 'r') },
    word: {
      d: attr(word, 'd'),
      left: +attr(word, 'data-left'),
      width: +attr(word, 'data-width'),
      top: +attr(word, 'data-top'),
      bottom: +attr(word, 'data-bottom'),
      xHeight: +attr(word, 'data-xheight'),
    },
  };
}

// ── geometry (mark units: 10 per pixel of the original 218 × 258 artwork) ────
const MARK = { w: 2180, h: 2580, baseline: 2522.5, bowlH: 1970 };
const n = (v) => +v.toFixed(2);
const GRAD = (id, a, b) => `<linearGradient id="${id}" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient>`;

/** Colourways: body / dot / wordmark fills. `color` is the primary (gradient dot). */
const WAYS = {
  color: { body: PALETTE.indigo, dot: 'url(#dot)', word: PALETTE.indigo, defs: GRAD('dot', PALETTE.dotStart, PALETTE.dotEnd) },
  indigo: { body: PALETTE.indigo, dot: PALETTE.indigo, word: PALETTE.indigo, defs: '' },
  white: { body: PALETTE.paper, dot: PALETTE.paper, word: PALETTE.paper, defs: '' },
  black: { body: PALETTE.black, dot: PALETTE.black, word: PALETTE.black, defs: '' },
};

function markG(m, way, { small = false } = {}) {
  return `<path fill="${way.body}" fill-rule="evenodd" d="${small ? m.smallBody : m.body}"/><circle cx="${m.dot.cx}" cy="${m.dot.cy}" r="${m.dot.r}" fill="${way.dot}"/>`;
}
function wordG(m, way, x, baseline, scale) {
  return `<path fill="${way.word}" transform="translate(${n(x - m.word.left * scale)} ${n(baseline)}) scale(${n(scale)})" d="${m.word.d}"/>`;
}

/** Each lockup returns { w, h, inner } in its own coordinate space, tightly cropped. */
const LOCKUPS = {
  mark: (m, way, opt) => ({ w: MARK.w, h: MARK.h, inner: markG(m, way, opt) }),
  wordmark: (m, way) => {
    const s = 1;
    return { w: m.word.width, h: m.word.bottom - m.word.top, inner: wordG(m, way, 0, -m.word.top, s) };
  },
  horizontal: (m, way) => {
    const s = (MARK.bowlH * 0.44) / m.word.xHeight; // wordmark x-height = 44% of the bowl height
    const gap = 400;
    return {
      w: MARK.w + gap + m.word.width * s,
      h: Math.max(MARK.h, MARK.baseline + m.word.bottom * s),
      inner: markG(m, way) + wordG(m, way, MARK.w + gap, MARK.baseline, s),
    };
  },
  stacked: (m, way) => {
    const w = MARK.w * 1.75; // wordmark width = 1.75 × mark width
    const s = w / m.word.width;
    const baseline = MARK.h + 2048 * s;
    return {
      w,
      h: baseline + m.word.bottom * s,
      inner: `<g transform="translate(${n((w - MARK.w) / 2)} 0)">${markG(m, way)}</g>` + wordG(m, way, 0, baseline, s),
    };
  },
};

const svgDoc = (vbW, vbH, inner, { defs = '', width, height, title = 'Algorythmos' } = {}) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${n(vbW)} ${n(vbH)}"${width ? ` width="${width}" height="${height}"` : ''}><title>${title}</title>${defs ? `<defs>${defs}</defs>` : ''}${inner}</svg>\n`;

function lockupSvg(m, name, wayName, size, opt) {
  const way = WAYS[wayName];
  const l = LOCKUPS[name](m, way, opt);
  return { ...l, svg: svgDoc(l.w, l.h, l.inner, { defs: way.defs, ...size }) };
}

/** A lockup placed on a filled canvas. `fit` = fraction of canvas (by the limiting side). */
function canvasSvg(m, { W, H, bg, lockup, way, fit, align = 'center', radius = 0, small = false }) {
  const wy = WAYS[way];
  const l = LOCKUPS[lockup](m, wy, { small });
  const k = Math.min((W * fit) / l.w, (H * fit) / l.h);
  const pad = Math.min(W, H) * 0.07;
  const x = align === 'corner' ? pad : (W - l.w * k) / 2;
  const y = align === 'corner' ? H - pad - l.h * k : (H - l.h * k) / 2;
  const fill = bg === 'gradient' ? 'url(#bg)' : bg;
  const rect = bg === 'none' ? '' : `<rect width="${W}" height="${H}"${radius ? ` rx="${n(radius)}"` : ''} fill="${fill}"/>`;
  const defs = (bg === 'gradient' ? GRAD('bg', PALETTE.indigo, PALETTE.violet) : '') + wy.defs;
  return svgDoc(W, H, `${rect}<g transform="translate(${n(x)} ${n(y)}) scale(${k.toFixed(5)})">${l.inner}</g>`, { defs, width: W, height: H });
}

// ── output plan ─────────────────────────────────────────────────────────────
function plan(m) {
  /** @type {{path:string, kind:'svg'|'png'|'webp'|'ico'|'pdf', width?:number, height?:number, svg?:string, sizes?:number[], make?:Function}[]} */
  const out = [];
  const png = (path, svg, width, height) => out.push({ path, kind: 'png', svg, width, height });

  const sizes = { mark: ['h', [512, 1024, 2048, 4096]], horizontal: ['w', [800, 1600, 3200]], stacked: ['w', [512, 1024, 2048]], wordmark: ['w', [800, 1600, 3200]] };
  for (const [name, [axis, list]] of Object.entries(sizes)) {
    for (const way of Object.keys(WAYS)) {
      if (name === 'wordmark' && way === 'color') continue; // identical to indigo
      const base = `brand/logo/${name}/algorythmos-${name}-${way}`;
      const vec = lockupSvg(m, name, way);
      out.push({ path: `${base}.svg`, kind: 'svg', svg: vec.svg });
      for (const px of list) {
        const width = axis === 'w' ? px : Math.round((px * vec.w) / vec.h);
        const height = axis === 'h' ? px : Math.round((px * vec.h) / vec.w);
        png(`${base}-${px}.png`, lockupSvg(m, name, way, { width, height }).svg, width, height);
      }
      if (way === 'indigo' || way === 'black') out.push({ path: `brand/print/algorythmos-${name}-${way}.pdf`, kind: 'pdf', svg: vec.svg, vb: [vec.w, vec.h] });
    }
  }

  // App icon: white mark on the brand gradient, full bleed (platforms apply their own corner mask).
  for (const s of [1024, 512, 192, 180]) png(`brand/icon/algorythmos-icon-${s}.png`, canvasSvg(m, { W: s, H: s, bg: 'gradient', lockup: 'mark', way: 'white', fit: 0.58 }), s, s);
  for (const s of [512, 192]) png(`brand/icon/algorythmos-maskable-${s}.png`, canvasSvg(m, { W: s, H: s, bg: 'gradient', lockup: 'mark', way: 'white', fit: 0.46 }), s, s);
  const fav = (s) => canvasSvg(m, { W: s, H: s, bg: 'gradient', lockup: 'mark', way: 'white', fit: 0.72, radius: s * 0.22, small: s <= 32 });
  for (const s of [16, 32, 48]) png(`brand/icon/algorythmos-favicon-${s}.png`, fav(s), s, s);
  out.push({ path: 'brand/icon/favicon.ico', kind: 'ico', sizes: [16, 32, 48], make: fav });

  // Social and advertising canvases.
  const canvas = (path, W, H, o) => png(path, canvasSvg(m, { W, H, ...o }), W, H);
  canvas('brand/social/algorythmos-avatar-1080.png', 1080, 1080, { bg: 'gradient', lockup: 'mark', way: 'white', fit: 0.5 });
  canvas('brand/social/algorythmos-avatar-light-1080.png', 1080, 1080, { bg: PALETTE.paper, lockup: 'mark', way: 'color', fit: 0.5 });
  canvas('brand/social/algorythmos-linkedin-company-1128x191.png', 1128, 191, { bg: 'gradient', lockup: 'horizontal', way: 'white', fit: 0.5 });
  canvas('brand/social/algorythmos-linkedin-profile-1584x396.png', 1584, 396, { bg: 'gradient', lockup: 'horizontal', way: 'white', fit: 0.45 });
  canvas('brand/social/algorythmos-x-header-1500x500.png', 1500, 500, { bg: 'gradient', lockup: 'horizontal', way: 'white', fit: 0.42 });
  canvas('brand/social/algorythmos-youtube-2560x1440.png', 2560, 1440, { bg: 'gradient', lockup: 'horizontal', way: 'white', fit: 0.36 });
  canvas('brand/social/algorythmos-share-1200x630.png', 1200, 630, { bg: 'gradient', lockup: 'horizontal', way: 'white', fit: 0.62 });
  for (const [name, W, H] of [['square-1080', 1080, 1080], ['story-1080x1920', 1080, 1920], ['landscape-1200x628', 1200, 628], ['wide-1920x1080', 1920, 1080]]) {
    canvas(`brand/ads/algorythmos-ad-${name}-gradient.png`, W, H, { bg: 'gradient', lockup: 'horizontal', way: 'white', fit: 0.3, align: 'corner' });
    canvas(`brand/ads/algorythmos-ad-${name}-dark.png`, W, H, { bg: PALETTE.ink, lockup: 'horizontal', way: 'white', fit: 0.3, align: 'corner' });
    canvas(`brand/ads/algorythmos-ad-${name}-light.png`, W, H, { bg: PALETTE.paper, lockup: 'horizontal', way: 'color', fit: 0.3, align: 'corner' });
  }

  out.push(...sitePlan(m).map((it) => ({ ...it, site: true })));
  return out;
}

/**
 * The site's own logo files in public/. Filenames are fixed: the site, the SEO validator and
 * external caches (search engines, link previews, BIMI) all refer to them by these names.
 */
function sitePlan(m) {
  const P = PALETTE;
  const icon = (s, fit) => canvasSvg(m, { W: s, H: s, bg: 'gradient', lockup: 'mark', way: 'white', fit });
  const fav = (s) => canvasSvg(m, { W: s, H: s, bg: 'gradient', lockup: 'mark', way: 'white', fit: 0.72, radius: s * 0.22, small: s <= 32 });
  const markAt = (h) => lockupSvg(m, 'mark', 'color', { width: Math.round((h * MARK.w) / MARK.h), height: h });
  // BIMI requires SVG Tiny PS: square, solid background, no scripts or external references.
  const k = 0.62 * (512 / MARK.h);
  const bimi =
    `<?xml version="1.0" encoding="UTF-8"?><svg xmlns="http://www.w3.org/2000/svg" version="1.2" baseProfile="tiny-ps" viewBox="0 0 512 512"><title>Algorythmos</title><desc>Algorythmos brand logo</desc>` +
    `<rect width="512" height="512" fill="${P.paper}"/><defs>${WAYS.color.defs}</defs>` +
    `<g transform="translate(${n((512 - MARK.w * k) / 2)} ${n((512 - MARK.h * k) / 2)}) scale(${k.toFixed(5)})">${markG(m, WAYS.color)}</g></svg>\n`;
  return [
    { path: 'public/logo-mark.png', kind: 'png', svg: markAt(1024).svg, width: Math.round((1024 * MARK.w) / MARK.h), height: 1024 },
    { path: 'public/logo-mark.webp', kind: 'webp', svg: markAt(128).svg, width: Math.round((128 * MARK.w) / MARK.h), height: 128 },
    { path: 'public/favicon.ico', kind: 'ico', sizes: [16, 32, 48], make: fav },
    { path: 'public/favicon-192.png', kind: 'png', svg: fav(192), width: 192, height: 192 },
    { path: 'public/favicon-512.png', kind: 'png', svg: fav(512), width: 512, height: 512 },
    { path: 'public/apple-touch-icon.png', kind: 'png', svg: icon(180, 0.58), width: 180, height: 180 },
    { path: 'public/maskable-192.png', kind: 'png', svg: icon(192, 0.46), width: 192, height: 192 },
    { path: 'public/maskable-512.png', kind: 'png', svg: icon(512, 0.46), width: 512, height: 512 },
    { path: 'public/Algorythmos.png', kind: 'png', svg: canvasSvg(m, { W: 1200, H: 630, bg: 'gradient', lockup: 'horizontal', way: 'white', fit: 0.62 }), width: 1200, height: 630 },
    { path: 'public/bimi/algorythmos.svg', kind: 'svg', svg: bimi },
  ];
}

// ── rendering ───────────────────────────────────────────────────────────────
const renderPng = (svg) => sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toBuffer();

/** Minimal ICO container with PNG payloads (supported by every current browser). */
function ico(images) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(images.length, 4);
  let offset = 6 + 16 * images.length;
  const entries = images.map(({ size, data }) => {
    const e = Buffer.alloc(16);
    e.writeUInt8(size >= 256 ? 0 : size, 0);
    e.writeUInt8(size >= 256 ? 0 : size, 1);
    e.writeUInt16LE(1, 4);
    e.writeUInt16LE(32, 6);
    e.writeUInt32LE(data.length, 8);
    e.writeUInt32LE(offset, 12);
    offset += data.length;
    return e;
  });
  return Buffer.concat([header, ...entries, ...images.map((i) => i.data)]);
}

async function renderAll(items, dir) {
  let browser;
  for (const it of items) {
    const file = join(dir, it.path);
    mkdirSync(dirname(file), { recursive: true });
    if (it.kind === 'svg') writeFileSync(file, it.svg);
    else if (it.kind === 'png') writeFileSync(file, await renderPng(it.svg));
    else if (it.kind === 'webp') writeFileSync(file, await sharp(Buffer.from(it.svg)).webp({ quality: 92, alphaQuality: 100 }).toBuffer());
    else if (it.kind === 'ico') {
      const images = [];
      for (const size of it.sizes) images.push({ size, data: await renderPng(it.make(size)) });
      writeFileSync(file, ico(images));
    } else if (it.kind === 'pdf') {
      if (NO_PDF) continue;
      const { chromium } = await import('@playwright/test');
      browser ??= await chromium.launch();
      const page = await browser.newPage();
      const [w, h] = it.vb;
      const pw = 720; // 10 in wide page; vector, so the size is nominal
      const ph = Math.ceil((pw * h) / w);
      await page.setContent(`<html><body style="margin:0">${it.svg.replace('<svg ', `<svg style="display:block;width:${pw}px;height:${ph}px" `)}</body></html>`);
      writeFileSync(file, await page.pdf({ width: `${pw}px`, height: `${ph}px`, printBackground: true, pageRanges: '1' }));
      await page.close();
    }
  }
  await browser?.close();
}

async function verify(items, dir) {
  const problems = [];
  for (const it of items) {
    const file = join(dir, it.path);
    if (it.kind === 'pdf' && NO_PDF) continue;
    if (!existsSync(file)) {
      problems.push(`missing: ${it.path}`);
      continue;
    }
    if (it.kind === 'png' || it.kind === 'webp') {
      const meta = await sharp(file).metadata();
      if (meta.width !== it.width || meta.height !== it.height) problems.push(`${it.path}: ${meta.width}×${meta.height}, expected ${it.width}×${it.height}`);
      const { channels } = await sharp(file).stats();
      if (channels.every((c) => c.max === c.min)) problems.push(`${it.path}: image is blank`);
    } else if (it.kind === 'svg') {
      const s = readFileSync(file, 'utf8');
      if (/<image\b|<text\b/.test(s)) problems.push(`${it.path}: contains raster or live text`);
    } else if (it.kind === 'ico') {
      const b = readFileSync(file);
      if (b.readUInt16LE(2) !== 1 || b.readUInt16LE(4) !== it.sizes.length) problems.push(`${it.path}: bad ICO header`);
    } else if (it.kind === 'pdf') {
      if (readFileSync(file).subarray(0, 5).toString() !== '%PDF-') problems.push(`${it.path}: not a PDF`);
    }
  }
  return problems;
}

/** Mean absolute difference per channel between two images of the same size (0–255). */
async function pixelDiff(a, b) {
  const [ra, rb] = await Promise.all([a, b].map((f) => sharp(f).ensureAlpha().raw().toBuffer({ resolveWithObject: true })));
  if (ra.info.width !== rb.info.width || ra.info.height !== rb.info.height) return Infinity;
  let sum = 0;
  for (let i = 0; i < ra.data.length; i++) sum += Math.abs(ra.data[i] - rb.data[i]);
  return sum / ra.data.length;
}

async function check(items, dir) {
  const problems = [];
  for (const it of items) {
    if (it.kind === 'pdf') {
      if (!existsSync(join(ROOT, it.path))) problems.push(`missing: ${it.path}`);
      continue;
    }
    const committed = join(ROOT, it.path);
    const fresh = join(dir, it.path);
    if (!existsSync(committed)) problems.push(`missing: ${it.path} (run npm run brand:build)`);
    else if (it.kind === 'svg') {
      if (readFileSync(committed, 'utf8') !== readFileSync(fresh, 'utf8')) problems.push(`out of date: ${it.path}`);
    } else if (it.kind === 'png' || it.kind === 'webp') {
      // Tolerance, not byte equality: rasterisers differ slightly between macOS and Linux.
      const d = await pixelDiff(committed, fresh);
      if (d > 1.5) problems.push(`out of date: ${it.path} (mean pixel difference ${d === Infinity ? 'size mismatch' : d.toFixed(2)})`);
    }
  }
  return problems;
}

// ── main ────────────────────────────────────────────────────────────────────
async function main() {
  const master = readMaster();
  const items = plan(master);
  const tmp = mkdtempSync(join(tmpdir(), 'algorythmos-brand-'));
  try {
    await renderAll(items, tmp);
    const problems = await verify(items, tmp);
    if (problems.length) fail(`build verification failed:\n  ${problems.join('\n  ')}`);

    if (CHECK) {
      const stale = await check(items, tmp);
      if (stale.length) fail(`brand assets do not match master.svg:\n  ${stale.join('\n  ')}`);
      console.log(`brand:check ok — ${items.length} files match brand/source/master.svg`);
      return;
    }

    // Everything verified: replace generated folders, then copy.
    for (const d of ['logo', 'icon', 'social', 'ads', ...(NO_PDF ? [] : ['print'])]) rmSync(join(ROOT, 'brand', d), { recursive: true, force: true });
    for (const it of items) {
      if ((it.kind === 'pdf' && NO_PDF) || (it.site && !WRITE_SITE)) continue;
      mkdirSync(dirname(join(ROOT, it.path)), { recursive: true });
      cpSync(join(tmp, it.path), join(ROOT, it.path));
    }
    const manifest = items.map(({ path, kind, width, height, sizes }) => ({ path, kind, ...(width ? { width, height } : {}), ...(sizes ? { sizes } : {}) }));
    writeFileSync(join(ROOT, 'brand/source/manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
    console.log(`brand:build ok — ${items.length} files verified${WRITE_SITE ? ', brand/ and public/ updated' : ', brand/ updated (public/ untouched; pass --site to update the website assets)'}`);
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((err) => {
    console.error(err instanceof BrandError ? `brand: ${err.message}` : err);
    process.exit(1);
  });
}

#!/usr/bin/env node
/**
 * Renders the artwork band used behind selected Open Graph cards
 * (src/pages/og/[...route].ts, `art` in src/seo/ogPages.ts).
 *
 * The output is a transparent 1200×630 PNG: the card's own gradient, border and
 * text stay as they are; this adds the logo and a picture along the bottom.
 * It contains no text, so it needs no fonts and serves every locale.
 * One PNG per card in CARDS. They are committed; run `node scripts/build-og-art.mjs`
 * only to change one, and check that the others come out byte-identical.
 */
import sharp from 'sharp';
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const W = 1200;
const H = 630;
/** Brand colours, as in the card route (violet) and the site accent (cyan). */
const VIOLET = '#8b5cf6';
const CYAN = '#22d3ee';
const INK = '#f4f4f8';

/** The horizontal colour logo, inlined as a nested <svg> so it scales as vector. */
const logoSrc = readFileSync(resolve(ROOT, 'brand/logo/horizontal/algorythmos-horizontal-white.svg'), 'utf-8');
const logoInner = logoSrc.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '').replace(/<title>[\s\S]*?<\/title>/, '');
const LOGO_H = 46;
const LOGO_W = (LOGO_H * 12274.34) / 2867.96;

/** Four nodes along the bottom of every card, left to right. */
const Y = 524;
const R = 46;
const XS = [690, 830, 970, 1110];
const stroke = `fill="none" stroke="${INK}" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"`;

/** AI, robotics, space, Bitcoin. */
const quadCore = [
  // AI: a hub with six linked nodes.
  (x) => {
    const pts = Array.from({ length: 6 }, (_, i) => {
      const a = (Math.PI / 3) * i - Math.PI / 2;
      return [x + Math.cos(a) * 24, Y + Math.sin(a) * 24];
    });
    return (
      pts.map(([px, py]) => `<path ${stroke} d="M${x} ${Y}L${px.toFixed(1)} ${py.toFixed(1)}"/>`).join('') +
      pts.map(([px, py]) => `<circle cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" r="4.5" fill="${INK}"/>`).join('') +
      `<circle cx="${x}" cy="${Y}" r="8" fill="${CYAN}"/>`
    );
  },
  // Robotics: a two-joint arm with a gripper.
  (x) =>
    `<path ${stroke} d="M${x - 24} ${Y + 24}H${x - 2}"/>` +
    `<path ${stroke} d="M${x - 13} ${Y + 24}V${Y + 6}L${x + 4} ${Y - 16}L${x + 20} ${Y - 4}"/>` +
    `<path ${stroke} d="M${x + 14} ${Y + 6}L${x + 20} ${Y - 4}L${x + 28} ${Y + 2}"/>` +
    `<circle cx="${x - 13}" cy="${Y + 6}" r="4.5" fill="${CYAN}"/>` +
    `<circle cx="${x + 4}" cy="${Y - 16}" r="4.5" fill="${INK}"/>`,
  // Space: a planet, its orbit and a satellite.
  (x) =>
    `<circle cx="${x}" cy="${Y}" r="11" ${stroke}/>` +
    `<ellipse cx="${x}" cy="${Y}" rx="29" ry="12" transform="rotate(-24 ${x} ${Y})" ${stroke}/>` +
    `<circle cx="${x + 25}" cy="${Y - 13}" r="5" fill="${CYAN}"/>`,
  // Bitcoin: three chained blocks.
  (x) =>
    [-22, 0, 22].map((dx, i) => `<rect x="${x + dx - 8}" y="${Y - 8}" width="16" height="16" rx="3.5" ${i === 2 ? `fill="${CYAN}" stroke="${CYAN}" stroke-width="3.2"` : stroke}/>`).join('') +
    `<path ${stroke} d="M${x - 14} ${Y}H${x - 8}M${x + 8} ${Y}H${x + 14}"/>`,
];

/** Sound, fibre, satellite link, compute. */
const signals = [
  // Sound: a source and three pressure fronts.
  (x) =>
    `<circle cx="${x - 20}" cy="${Y}" r="6" fill="${CYAN}"/>` +
    [0, 12, 24].map((d) => `<path ${stroke} d="M${x - 8 + d} ${Y - 6 - d / 2}q${8 + d / 3} ${6 + d / 2} 0 ${12 + d}"/>`).join(''),
  // Fibre: a strand of glass carrying three pulses.
  (x) =>
    `<path ${stroke} d="M${x - 28} ${Y + 14}C${x - 8} ${Y + 14} ${x + 8} ${Y - 14} ${x + 28} ${Y - 14}"/>` +
    [
      [-16, 12],
      [0, 0],
      [16, -12],
    ]
      .map(([dx, dy], i) => `<circle cx="${x + dx}" cy="${Y + dy}" r="4.5" fill="${i === 1 ? CYAN : INK}"/>`)
      .join(''),
  // Satellite link: two satellites over a horizon, joined by a beam.
  (x) =>
    `<path ${stroke} d="M${x - 28} ${Y + 22}Q${x} ${Y + 6} ${x + 28} ${Y + 22}"/>` +
    `<rect x="${x - 26}" y="${Y - 20}" width="14" height="10" rx="2.5" ${stroke}/>` +
    `<rect x="${x + 12}" y="${Y - 20}" width="14" height="10" rx="2.5" ${stroke}/>` +
    `<path d="M${x - 12} ${Y - 15}H${x + 12}" stroke="${CYAN}" stroke-width="3.2" stroke-linecap="round"/>`,
  // Compute: a chip with pins and a lit core.
  (x) =>
    `<rect x="${x - 15}" y="${Y - 15}" width="30" height="30" rx="5" ${stroke}/>` +
    [-8, 0, 8].map((d) => `<path ${stroke} d="M${x + d} ${Y - 15}V${Y - 24}M${x + d} ${Y + 15}V${Y + 24}M${x - 15} ${Y + d}H${x - 24}M${x + 15} ${Y + d}H${x + 24}"/>`).join('') +
    `<rect x="${x - 6}" y="${Y - 6}" width="12" height="12" rx="2.5" fill="${CYAN}"/>`,
];

/** Output name → its four icons. */
const CARDS = { 'quad-core': quadCore, signals };

const render = (icons) => `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <radialGradient id="glow" cx="50%" cy="50%" r="50%">
      <stop offset="0" stop-color="${VIOLET}" stop-opacity="0.38"/>
      <stop offset="1" stop-color="${VIOLET}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="rule" gradientUnits="userSpaceOnUse" x1="${XS[0]}" y1="0" x2="${XS[3]}" y2="0">
      <stop offset="0" stop-color="${VIOLET}" stop-opacity="0.9"/>
      <stop offset="1" stop-color="${CYAN}" stop-opacity="0.9"/>
    </linearGradient>
  </defs>

  <ellipse cx="900" cy="${Y}" rx="420" ry="170" fill="url(#glow)"/>
  <path d="M88 432H${W - 72}" stroke="${INK}" stroke-opacity="0.14" stroke-width="2"/>

  <svg x="88" y="${Y - LOGO_H / 2}" width="${LOGO_W.toFixed(1)}" height="${LOGO_H}" viewBox="0 0 12274.34 2867.96">${logoInner}</svg>

  <path d="M${XS[0]} ${Y}H${XS[3]}" stroke="url(#rule)" stroke-width="4" stroke-dasharray="1 11" stroke-linecap="round"/>
  ${XS.map(
    (x, i) =>
      `<circle cx="${x}" cy="${Y}" r="${R}" fill="#12101f"/>` +
      `<circle cx="${x}" cy="${Y}" r="${R}" fill="${VIOLET}" fill-opacity="0.16" stroke="${i === 0 ? CYAN : VIOLET}" stroke-width="2.5"/>` +
      icons[i](x),
  ).join('\n  ')}
</svg>`;

for (const [name, icons] of Object.entries(CARDS)) {
  const out = resolve(ROOT, `src/assets/og/art-${name}.png`);
  writeFileSync(out, await sharp(Buffer.from(render(icons))).png({ compressionLevel: 9 }).toBuffer());
  console.log('wrote', out);
}

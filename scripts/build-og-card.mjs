#!/usr/bin/env node
/**
 * Renders a full Open Graph card: headline, figures and picture in one image,
 * for pages whose card should say more than a title (`card` in src/seo/ogPages.ts).
 *
 * Text is drawn with the two Inter files the card route already ships
 * (src/assets/og/font-*.ttf), through a throwaway fontconfig file, so the output
 * does not depend on which fonts the machine has installed. Only weights 400
 * and 600 exist there; nothing here asks for another.
 *
 * The PNGs are committed. Run only to change one:
 *   node scripts/build-og-card.mjs                 → src/assets/og/card-<name>-<locale>.png (1200×630)
 *   node scripts/build-og-card.mjs --social <dir>  → also 1600×900 (16:9) copies for X and Medium
 */
import { mkdtempSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const fc = mkdtempSync(join(tmpdir(), "og-card-"));
writeFileSync(
  join(fc, "fonts.conf"),
  `<?xml version="1.0"?><fontconfig><dir>${resolve(ROOT, "src/assets/og")}</dir><cachedir>${fc}</cachedir></fontconfig>`,
);
process.env.FONTCONFIG_FILE = join(fc, "fonts.conf");
const { default: sharp } = await import("sharp");

const socialAt = process.argv.indexOf("--social");
const socialDir = socialAt > -1 ? resolve(process.argv[socialAt + 1]) : null;

/** Copy for the signals report card. Every figure is sourced in the report itself. */
const COPY = {
  en: {
    eyebrow: "EVIDENCE REPORT  ·  15 CLAIMS  ·  17 SOURCES",
    h: ["Will satellites", "replace fibre?"],
    sub: [
      "We checked the claims against primary sources:",
      "what is deployed, and what is still a prototype.",
    ],
    stats: [
      [">99%", "of international data", "still crosses by cable"],
      ["200 Gbps", "per Starlink laser link", "(company figure)"],
      ["1", "prototype AI satellite", "in orbit so far"],
    ],
    a: "Sydney",
    b: "California",
    cable: "submarine cable",
    laser: "laser links",
    node: "compute",
  },
  fr: {
    eyebrow: "RAPPORT DE SYNTHÈSE  ·  15 AFFIRMATIONS  ·  17 SOURCES",
    h: ["Les satellites vont-ils", "remplacer la fibre ?"],
    sub: [
      "Nous avons confronté les affirmations aux sources :",
      "ce qui est déployé, et ce qui reste un prototype.",
    ],
    stats: [
      [">99 %", "des flux internationaux", "passent encore par câble"],
      ["200 Gbit/s", "par liaison laser Starlink", "(chiffre de l’entreprise)"],
      ["1", "satellite d’IA prototype", "en orbite à ce jour"],
    ],
    a: "Sydney",
    b: "Californie",
    cable: "câble sous-marin",
    laser: "liaisons laser",
    node: "calcul",
  },
};

const W = 1200;
const VIOLET = "#8b5cf6";
const CYAN = "#22d3ee";
const INK = "#f4f4f8";
const MUTED = "#a9a9c4";
const F = 'font-family="Inter"';
const esc = (s) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const logoSrc = readFileSync(
  resolve(ROOT, "brand/logo/horizontal/algorythmos-horizontal-white.svg"),
  "utf-8",
);
const logoInner = logoSrc
  .replace(/^[\s\S]*?<svg[^>]*>/, "")
  .replace(/<\/svg>\s*$/, "")
  .replace(/<title>[\s\S]*?<\/title>/, "");
const LOGO_H = 40;
const LOGO_W = (LOGO_H * 12274.34) / 2867.96;

// Earth, orbit and the points on them.
const C = { x: 925, y: 590 };
const RE = 300;
const RO = 384;
const at = (r, deg) => ({
  x: C.x + r * Math.cos((deg * Math.PI) / 180),
  y: C.y + r * Math.sin((deg * Math.PI) / 180),
});
const arc = (r, a0, a1) => {
  const p = at(r, a0);
  const q = at(r, a1);
  return `M${p.x.toFixed(1)} ${p.y.toFixed(1)}A${r} ${r} 0 0 1 ${q.x.toFixed(1)} ${q.y.toFixed(1)}`;
};
const sats = [-126, -103, -77, -54].map((d) => at(RO, d));
const syd = at(RE, -121);
const cal = at(RE, -59);
const sat = (p, hot) =>
  `<g transform="translate(${p.x.toFixed(1)} ${p.y.toFixed(1)})">` +
  `<rect x="-34" y="-6" width="20" height="12" rx="2" fill="${VIOLET}" fill-opacity="0.55"/>` +
  `<rect x="14" y="-6" width="20" height="12" rx="2" fill="${VIOLET}" fill-opacity="0.55"/>` +
  `<rect x="-13" y="-13" width="26" height="26" rx="6" fill="#16132a" stroke="${hot ? CYAN : VIOLET}" stroke-width="2.5"/>` +
  (hot
    ? `<rect x="-5" y="-5" width="10" height="10" rx="2" fill="${CYAN}"/>`
    : `<circle r="3.5" fill="${INK}"/>`) +
  `</g>`;
const link = (a, b) =>
  `<path d="M${(a.x + 16).toFixed(1)} ${a.y.toFixed(1)}L${(b.x - 16).toFixed(1)} ${b.y.toFixed(1)}" stroke="url(#beam)" stroke-width="3" stroke-linecap="round"/>`;
const terminal = (p) =>
  `<rect x="${(p.x - 9).toFixed(1)}" y="${(p.y - 12).toFixed(1)}" width="18" height="12" rx="3" fill="${INK}"/>`;

/** One card as SVG. `H` is 630 for the site card, 675 for the 16:9 social copy. */
const render = (lang, H = 630, scale = 1) => {
  const T = COPY[lang];
  const stat = ([n, l1, l2], i) => {
    const x = 72 + i * 186;
    return (
      `<rect x="${x}" y="368" width="174" height="118" rx="14" fill="#ffffff" fill-opacity="0.045" stroke="#ffffff" stroke-opacity="0.12"/>` +
      `<text x="${x + 16}" y="418" ${F} font-size="${n.length > 6 ? 31 : 38}" font-weight="600" fill="${i === 0 ? CYAN : INK}">${esc(n)}</text>` +
      `<text x="${x + 16}" y="446" ${F} font-size="${lang === "fr" ? 12.5 : 13.5}" font-weight="400" fill="${MUTED}">${esc(l1)}</text>` +
      `<text x="${x + 16}" y="465" ${F} font-size="${lang === "fr" ? 12.5 : 13.5}" font-weight="400" fill="${MUTED}">${esc(l2)}</text>`
    );
  };

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${Math.round(W * scale)}" height="${Math.round(H * scale)}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#0a0913"/><stop offset="1" stop-color="#151029"/>
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="50%" r="50%">
      <stop offset="0" stop-color="${VIOLET}" stop-opacity="0.42"/><stop offset="1" stop-color="${VIOLET}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="earth" cx="50%" cy="0%" r="100%">
      <stop offset="0" stop-color="#2a2356"/><stop offset="0.55" stop-color="#141030"/><stop offset="1" stop-color="#0b0a18"/>
    </radialGradient>
    <linearGradient id="beam" gradientUnits="userSpaceOnUse" x1="${sats[0].x}" y1="0" x2="${sats[3].x}" y2="0">
      <stop offset="0" stop-color="${VIOLET}"/><stop offset="1" stop-color="${CYAN}"/>
    </linearGradient>
    <pattern id="dots" width="28" height="28" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.1" fill="#ffffff" fill-opacity="0.07"/></pattern>
    <clipPath id="frame"><rect y="${-(H - 630) / 2}" width="${W}" height="${H}"/></clipPath>
  </defs>

  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect width="${W}" height="${H}" fill="url(#dots)"/>
  <g transform="translate(0 ${(H - 630) / 2})">
  <g clip-path="url(#frame)">
    <ellipse cx="${C.x}" cy="300" rx="430" ry="330" fill="url(#glow)"/>

    <!-- orbit and the laser mesh -->
    <path d="${arc(RO, -150, -30)}" fill="none" stroke="#ffffff" stroke-opacity="0.16" stroke-width="1.5" stroke-dasharray="3 9"/>
    ${link(sats[0], sats[1])}${link(sats[1], sats[2])}${link(sats[2], sats[3])}
    <path d="M${syd.x.toFixed(1)} ${(syd.y - 12).toFixed(1)}L${sats[0].x.toFixed(1)} ${(sats[0].y + 16).toFixed(1)}" stroke="${VIOLET}" stroke-width="2.5" stroke-dasharray="2 8" stroke-linecap="round"/>
    <path d="M${cal.x.toFixed(1)} ${(cal.y - 12).toFixed(1)}L${sats[3].x.toFixed(1)} ${(sats[3].y + 16).toFixed(1)}" stroke="${CYAN}" stroke-width="2.5" stroke-dasharray="2 8" stroke-linecap="round"/>
    ${sat(sats[0])}${sat(sats[1])}${sat(sats[2], true)}${sat(sats[3])}
    <text x="${((sats[1].x + sats[2].x) / 2).toFixed(1)}" y="${(sats[1].y - 30).toFixed(1)}" text-anchor="middle" ${F} font-size="15" font-weight="600" fill="${MUTED}" letter-spacing="1.5">${esc(T.laser.toUpperCase())}</text>
    <text x="${sats[2].x.toFixed(1)}" y="${(sats[2].y + 38).toFixed(1)}" text-anchor="middle" ${F} font-size="13" font-weight="600" fill="${CYAN}" letter-spacing="1.2">${esc(T.node.toUpperCase())}</text>

    <!-- Earth, with the cable that does the real work -->
    <circle cx="${C.x}" cy="${C.y}" r="${RE}" fill="url(#earth)" stroke="${VIOLET}" stroke-opacity="0.55" stroke-width="2"/>
    <path d="${arc(RE - 34, -121, -59)}" fill="none" stroke="${CYAN}" stroke-width="5" stroke-linecap="round"/>
    <path d="${arc(RE - 34, -121, -59)}" fill="none" stroke="#ffffff" stroke-width="5" stroke-linecap="round" stroke-dasharray="1 30" stroke-opacity="0.9"/>
    <path d="M${syd.x.toFixed(1)} ${syd.y.toFixed(1)}L${at(RE - 34, -121).x.toFixed(1)} ${at(RE - 34, -121).y.toFixed(1)}M${cal.x.toFixed(1)} ${cal.y.toFixed(1)}L${at(RE - 34, -59).x.toFixed(1)} ${at(RE - 34, -59).y.toFixed(1)}" stroke="${CYAN}" stroke-width="5" stroke-linecap="round"/>
    ${terminal(syd)}${terminal(cal)}
    <text x="${C.x}" y="${C.y - RE + 78}" text-anchor="middle" ${F} font-size="15" font-weight="600" fill="${CYAN}" letter-spacing="1.5">${esc(T.cable.toUpperCase())}</text>
    <text x="${(syd.x - 16).toFixed(1)}" y="${(syd.y + 2).toFixed(1)}" text-anchor="end" ${F} font-size="16" font-weight="600" fill="${INK}">${esc(T.a)}</text>
    <text x="${(cal.x + 16).toFixed(1)}" y="${(cal.y + 2).toFixed(1)}" text-anchor="start" ${F} font-size="16" font-weight="600" fill="${INK}">${esc(T.b)}</text>
  </g>

  </g>
  <rect width="12" height="${H}" fill="${VIOLET}"/>
  <g transform="translate(0 ${(H - 630) / 2})">

  <text x="72" y="96" ${F} font-size="17" font-weight="600" fill="${CYAN}" letter-spacing="2.6">${esc(T.eyebrow)}</text>
  <text x="70" y="178" ${F} font-size="${lang === "fr" ? 54 : 66}" font-weight="600" fill="${INK}" letter-spacing="-1.5">${esc(T.h[0])}</text>
  <text x="70" y="${lang === "fr" ? 242 : 252}" ${F} font-size="${lang === "fr" ? 54 : 66}" font-weight="600" fill="${INK}" letter-spacing="-1.5">${esc(T.h[1])}</text>
  <text x="72" y="304" ${F} font-size="21" font-weight="400" fill="${MUTED}">${esc(T.sub[0])}</text>
  <text x="72" y="334" ${F} font-size="21" font-weight="400" fill="${MUTED}">${esc(T.sub[1])}</text>

  ${T.stats.map(stat).join("\n  ")}

  <svg x="72" y="${548 - LOGO_H / 2}" width="${LOGO_W.toFixed(1)}" height="${LOGO_H}" viewBox="0 0 12274.34 2867.96">${logoInner}</svg>
  <text x="${72 + LOGO_W + 24}" y="555" ${F} font-size="18" font-weight="400" fill="${MUTED}">algorythmos.com</text>
  </g>
</svg>`;
};

for (const lang of Object.keys(COPY)) {
  const out = resolve(ROOT, `src/assets/og/card-signals-${lang}.png`);
  writeFileSync(
    out,
    await sharp(Buffer.from(render(lang)))
      .png({ compressionLevel: 9 })
      .toBuffer(),
  );
  console.log("wrote", out);
  if (socialDir) {
    mkdirSync(socialDir, { recursive: true });
    const wide = resolve(socialDir, `signals-card-${lang}-1600x900.png`);
    writeFileSync(
      wide,
      await sharp(Buffer.from(render(lang, 675, 1600 / 1200)))
        .png({ compressionLevel: 9 })
        .toBuffer(),
    );
    console.log("wrote", wide);
  }
}

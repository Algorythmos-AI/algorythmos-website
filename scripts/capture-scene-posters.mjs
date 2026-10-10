#!/usr/bin/env node
// scripts/capture-scene-posters.mjs
// Render each 3D scene's still image — the picture shown wherever the live scene
// is not (no JavaScript today; reduced motion, paused and low-power visitors on
// the inner pages).
//
// For every scene × theme it opens the page that hosts the scene in still mode
// (one frame at the scene's `stillAt`, no loop), screenshots just the canvas on a
// transparent background, and writes AVIF variants to src/assets/scenes/. It then
// records each scene's source fingerprint in manifest.json; the unit tests fail
// if a scene changes without its still being re-captured.
//
// Run: npm run build && npm run scenes:posters

/* global window, document -- the callbacks passed to page.evaluate / addInitScript run in the browser */

import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { setTimeout as sleep } from 'node:timers/promises';
import { fileURLToPath } from 'node:url';
import { chromium } from '@playwright/test';
import sharp from 'sharp';
import { sceneHash } from './lib/scene-hash.mjs';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = path.join(ROOT, 'src', 'assets', 'scenes');
const PORT = 4398;
const BASE = `http://localhost:${PORT}`;
/* A still is a fallback, shown at most ~600 CSS px wide: 960 covers desktop, 480 phones.
   AVIF because these images are fine lines and motes on transparency, which WebP
   needs roughly a third more bytes for. */
const WIDTHS = [960, 480];
const THEMES = ['dark', 'light'];

/* Still key (`id` or `id@variant`, see stillKey in src/data/scenes.ts) → a page that
   mounts that scene and variant. The still is captured from the real mount, so it
   has the real proportions. */
const HOSTS = {
  'neural-core': '/au-en',
  constellation: '/au-en/services',
  globe: '/au-en/about',
  'globe@sydney': '/au-en/ai-consultancy-sydney',
  'globe@paris': '/fr-fr/conseil-en-ia-paris',
  'ledger@aud': '/au-en/pricing',
  'ledger@eur': '/fr-fr/pricing',
  'ledger@audit': '/au-en/case-studies/financial-compliance',
  pages: '/au-en/pdf-algo-pro',
  scan: '/au-en/services/document-intelligence',
  'lost-satellite': '/404',
};
const sceneOf = (key) => key.split('@')[0];

/* `npm run scenes:posters globe ledger` re-captures every still of those scenes. */
const only = process.argv.slice(2);
const keys = Object.keys(HOSTS).filter((key) => only.length === 0 || only.includes(sceneOf(key)) || only.includes(key));

async function waitForServer(timeoutMs = 20000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const r = await fetch(`${BASE}/au-en`);
      if (r.ok) return;
    } catch {
      /* not up yet */
    }
    await sleep(400);
  }
  throw new Error('preview server did not start (run "npm run build" first)');
}

async function capture(browser, key, theme) {
  const id = sceneOf(key);
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    deviceScaleFactor: 2,
    colorScheme: theme,
  });
  const page = await context.newPage();
  await page.addInitScript((t) => {
    window.__scene3dForce = true;
    window.__scene3dStill = true;
    try {
      localStorage.setItem('theme', t);
    } catch {
      /* storage unavailable */
    }
  }, theme);
  await page.goto(BASE + HOSTS[key], { waitUntil: 'load' });
  const mount = page.locator(`[data-scene="${id}"]`).first();
  await mount.waitFor({ state: 'attached', timeout: 10000 });
  await page.waitForFunction(
    (sceneId) => document.querySelector(`[data-scene="${sceneId}"]`)?.dataset.sceneState === 'live',
    id,
    { timeout: 60000 },
  );
  /* Leave only the canvas painted, over nothing. */
  const clip = await page.evaluate(() => {
    const canvas = document.querySelector('canvas.scene3d-stage');
    document.documentElement.style.background = 'transparent';
    document.body.style.background = 'transparent';
    document.body.style.visibility = 'hidden';
    canvas.style.visibility = 'visible';
    canvas.style.transition = 'none';
    canvas.style.opacity = '1';
    /* The hero dims and masks the scene's wrapper on small screens and behind copy;
       the still is the scene itself, at full strength. */
    for (let el = canvas.parentElement; el && el !== document.body; el = el.parentElement) {
      el.style.opacity = '1';
      el.style.maskImage = 'none';
      el.style.webkitMaskImage = 'none';
    }
    canvas.scrollIntoView({ block: 'center', behavior: 'instant' }); // the site scrolls smoothly by default
    const r = canvas.getBoundingClientRect();
    return { x: r.left, y: r.top, width: r.width, height: r.height };
  });
  await page.waitForTimeout(150);
  const png = await page.screenshot({ clip, omitBackground: true, animations: 'disabled' });
  await context.close();

  const written = [];
  for (const width of WIDTHS) {
    const file = path.join(OUT_DIR, `${key}-${theme}-${width}.avif`);
    await sharp(png).resize({ width }).avif({ quality: 45, effort: 6 }).toFile(file);
    written.push(`${path.basename(file)} ${(fs.statSync(file).size / 1024).toFixed(1)} kB`);
  }
  return written;
}

const preview = spawn('npx', ['astro', 'preview', '--port', String(PORT), '--ignore-lock'], { stdio: 'ignore' });
let exitCode = 0;
try {
  await waitForServer();
  fs.mkdirSync(OUT_DIR, { recursive: true });
  /* A real GPU where there is one (identical output, far quicker); software otherwise. */
  const args = process.platform === 'darwin' ? ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'] : [];
  const browser = await chromium.launch({ args });
  const manifestFile = path.join(OUT_DIR, 'manifest.json');
  const manifest = fs.existsSync(manifestFile) ? JSON.parse(fs.readFileSync(manifestFile, 'utf-8')) : {};
  for (const key of keys) {
    for (const theme of THEMES) {
      for (const line of await capture(browser, key, theme)) console.log(`  ${line}`);
    }
    manifest[sceneOf(key)] = sceneHash(ROOT, sceneOf(key));
  }
  await browser.close();
  const sorted = Object.fromEntries(Object.entries(manifest).sort(([a], [b]) => a.localeCompare(b)));
  fs.writeFileSync(manifestFile, JSON.stringify(sorted, null, 2) + '\n');
  console.log(`Captured ${keys.length} still(s) × ${THEMES.length} themes → ${path.relative(ROOT, OUT_DIR)}`);
} catch (error) {
  console.error(error);
  exitCode = 1;
} finally {
  preview.kill();
}
process.exit(exitCode);

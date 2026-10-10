/**
 * holo-site — AI-powered websites.
 *
 * A page assembling itself in mid-air: the frame first, then a headline, a
 * button, three cards — each block dropping into place under a pane of scan
 * lines — while two earlier drafts hang behind it. Then it clears and builds
 * the next one.
 */
import {
  AdditiveBlending,
  AmbientLight,
  BoxGeometry,
  BufferAttribute,
  BufferGeometry,
  CanvasTexture,
  Color,
  DirectionalLight,
  EdgesGeometry,
  Group,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  MeshStandardMaterial,
  NormalBlending,
  PlaneGeometry,
  SRGBColorSpace,
} from 'three';
import type { RGB } from '@/lib/tokens';
import { disposeTree } from '../kit/dispose';
import { exit, frameSubject, smooth } from '../kit/frame';
import { createHologram } from '../kit/hologram';
import { createMotes } from '../kit/motes';
import { mixColor, toColor } from '../kit/palette';
import { createSoftPoints, setColorAt } from '../kit/points';
import type { Tier } from '../tier';
import type { Palette, SceneContext, SceneInput, SceneInstance, Viewport } from '../types';

export const stillAt = 5.6;

const W = 320;
const H = 200;
const PANEL_W = 2.6;
const PANEL_H = (PANEL_W * H) / W;
const STEPS = 7; // frame, nav, headline, sub, button, cards, footer
const CYCLE = 9;
const MOTES: Record<Tier, number> = { high: 280, medium: 190, low: 110 };

const css = (c: RGB, a = 1) => `rgba(${c.r},${c.g},${c.b},${a})`;
const blend = (a: RGB, b: RGB, t: number): RGB => ({
  r: Math.round(a.r + (b.r - a.r) * t),
  g: Math.round(a.g + (b.g - a.g) * t),
  b: Math.round(a.b + (b.b - a.b) * t),
});

/** A wireframe web page, built up to `step` blocks. Bars and boxes only: no words. */
function drawPage(canvas: HTMLCanvasElement, palette: Palette, step: number, variant: number): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const { bg, text, brand, accent, light } = palette;
  const surface = blend(bg, text, light ? 0.1 : 0.09);
  const ink = blend(surface, text, light ? 0.62 : 0.5);
  ctx.fillStyle = css(surface);
  ctx.fillRect(0, 0, W, H);
  const bar = (x: number, y: number, w: number, h: number, colour: string) => {
    ctx.fillStyle = colour;
    ctx.fillRect(x, y, w, h);
  };
  if (step >= 1) {
    bar(0, 0, W, 16, css(blend(surface, text, 0.12)));
    for (let i = 0; i < 3; i++) bar(8 + i * 9, 6, 5, 5, css(ink, 0.6));
    bar(W - 96, 6, 22, 4, css(ink, 0.6));
    bar(W - 66, 6, 22, 4, css(ink, 0.6));
    bar(W - 34, 4, 26, 8, css(brand));
  }
  if (step >= 2) {
    bar(22, 34, variant === 1 ? 150 : 176, 13, css(text, 0.92));
    bar(22, 52, variant === 2 ? 132 : 110, 13, css(brand));
  }
  if (step >= 3) {
    bar(22, 76, 200, 5, css(ink, 0.7));
    bar(22, 86, 164, 5, css(ink, 0.7));
  }
  if (step >= 4) {
    bar(22, 102, 62, 16, css(brand));
    ctx.strokeStyle = css(ink, 0.7);
    ctx.lineWidth = 1;
    ctx.strokeRect(92.5, 102.5, 58, 15);
  }
  if (step >= 5) {
    for (let i = 0; i < 3; i++) {
      const x = 22 + i * 94;
      bar(x, 134, 84, 44, css(blend(surface, text, 0.1)));
      bar(x + 8, 142, 14, 14, css(i === variant ? accent : brand, 0.9));
      bar(x + 8, 162, 56, 4, css(ink, 0.7));
      bar(x + 8, 170, 40, 4, css(ink, 0.5));
    }
  }
  if (step >= 6) bar(0, H - 8, W, 8, css(blend(surface, text, 0.12)));
}

export function create(ctx: SceneContext): SceneInstance {
  const { scene, camera, rng } = ctx;
  let palette = ctx.palette;

  camera.position.set(0, 0, 9);
  camera.lookAt(0, 0, 0);
  const root = new Group();
  scene.add(root);
  const key = new DirectionalLight(0xffffff, 1.8);
  key.position.set(-3, 4, 6);
  const fill = new AmbientLight(0xffffff, 0.5);
  root.add(key, fill);

  const frameMat = new LineBasicMaterial({ transparent: true, depthWrite: false });
  const makePanel = (variant: number) => {
    const canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = H;
    const texture = new CanvasTexture(canvas);
    texture.colorSpace = SRGBColorSpace;
    texture.anisotropy = 4;
    const material = new MeshStandardMaterial({ map: texture, roughness: 0.55, metalness: 0.05, transparent: true });
    const geo = new BoxGeometry(PANEL_W, PANEL_H, 0.02);
    const edge = new MeshStandardMaterial({ roughness: 0.6, metalness: 0.2, transparent: true });
    const mesh = new Mesh(geo, [edge, edge, edge, edge, material, edge]);
    const outline = new LineSegments(new EdgesGeometry(geo), frameMat);
    const group = new Group();
    group.add(mesh, outline);
    root.add(group);
    return { group, canvas, texture, material, edge, variant, drawn: -1 };
  };
  const front = makePanel(0);
  const drafts = [makePanel(1), makePanel(2)];
  drafts[0].group.position.set(-0.85, 0.5, -1.1);
  drafts[0].group.rotation.set(0, 0.32, 0.03);
  drafts[0].group.scale.setScalar(0.72);
  drafts[1].group.position.set(1.05, -0.45, -1.7);
  drafts[1].group.rotation.set(0, -0.28, -0.03);
  drafts[1].group.scale.setScalar(0.66);

  /* The pane that sweeps the page as each block lands, and a cursor that visits it. */
  const pane = createHologram(60);
  const paneMesh = new Mesh(new PlaneGeometry(PANEL_W * 1.06, 0.34), pane.material);
  front.group.add(paneMesh);
  const cursor = createSoftPoints(1, 0.2, 1);
  front.group.add(cursor.points);

  /* Guide lines from the corners of the front page back to the drafts it came from. */
  const guidePos = new BufferAttribute(new Float32Array(2 * 6), 3);
  const guideGeo = new BufferGeometry();
  guideGeo.setAttribute('position', guidePos);
  const guideMat = new LineBasicMaterial({ transparent: true, depthWrite: false });
  const guides = new LineSegments(guideGeo, guideMat);
  guides.frustumCulled = false;
  root.add(guides);

  const motes = createMotes(MOTES[ctx.tier], rng);
  root.add(motes.points);

  /* Where the pane rests after each step: top of the page down to the footer. */
  const STEP_Y = [0.5, 0.42, 0.24, 0.1, -0.05, -0.28, -0.46].map((f) => f * PANEL_H);
  const tmp = new Color();

  const applyTheme = () => {
    const { brand, accent, bg, text, light } = palette;
    mixColor(brand, accent, 0.5, frameMat.color);
    frameMat.blending = light ? NormalBlending : AdditiveBlending;
    frameMat.opacity = light ? 0.7 : 0.55;
    frameMat.needsUpdate = true;
    for (const p of [front, ...drafts]) {
      mixColor(bg, text, light ? 0.22 : 0.16, p.edge.color);
      p.drawn = -1; // repaint in the new colours
    }
    toColor(accent, pane.color);
    pane.setLight(light);
    setColorAt(cursor.color, 0, toColor(accent, tmp));
    cursor.color.needsUpdate = true;
    cursor.setLight(light, 1);
    mixColor(brand, accent, 0.5, guideMat.color);
    guideMat.blending = light ? NormalBlending : AdditiveBlending;
    guideMat.opacity = light ? 0.4 : 0.3;
    guideMat.needsUpdate = true;
    motes.setTheme(palette);
    /* The pages are pale surfaces: on the light theme, strong light bleaches them out. */
    key.intensity = light ? 1.0 : 1.8;
    fill.intensity = light ? 0.35 : 0.5;
    scene.environmentIntensity = light ? 0.4 : 0.7;
  };
  applyTheme();

  const repaint = (p: ReturnType<typeof makePanel>, step: number) => {
    if (p.drawn === step) return;
    drawPage(p.canvas, palette, step, p.variant);
    p.texture.needsUpdate = true;
    p.drawn = step;
  };

  return {
    update(_dt: number, time: number, input: SceneInput) {
      const u = exit(input);
      const light = palette.light;
      root.rotation.set(0.06 + input.pointerY * 0.08, -0.3 + 0.07 * Math.sin(time * 0.3) + input.pointerX * 0.16, 0);
      root.position.set(-0.1, Math.sin(time * 0.5) * 0.04 - u * 0.5, 0);
      front.group.rotation.set(-0.05, 0.14, 0);

      const phase = (time % CYCLE) / CYCLE;
      /* Build over the first 70%, hold, then clear for the next page. */
      const built = Math.min(STEPS - 1, Math.floor((phase / 0.7) * STEPS));
      const within = Math.min(1, ((phase / 0.7) * STEPS) % 1);
      const clearing = smooth((phase - 0.9) / 0.1);
      repaint(front, phase < 0.7 ? built : STEPS - 1);
      for (const d of drafts) repaint(d, STEPS - 1);
      front.material.opacity = 1 - clearing;
      front.edge.opacity = 1 - clearing;
      for (const d of drafts) {
        d.material.opacity = light ? 0.75 : 0.55;
        d.edge.opacity = d.material.opacity;
      }

      const building = phase < 0.7;
      const from = STEP_Y[Math.max(0, built - 1)];
      const to = STEP_Y[built];
      paneMesh.position.set(0, building ? from + (to - from) * smooth(within) : STEP_Y[STEPS - 1], 0.04);
      pane.set(time * 1.5, (building ? 1 : 1 - smooth((phase - 0.7) / 0.06)) * (light ? 0.95 : 1));

      /* The cursor crosses to the button once the page is built, and rests on it. */
      const press = smooth((phase - 0.72) / 0.1);
      cursor.position.setXYZ(0, PANEL_W * (0.3 - 0.62 * press), PANEL_H * (-0.3 + 0.24 * press), 0.05);
      cursor.position.needsUpdate = true;
      cursor.scale.setX(0, (phase > 0.7 ? 1 : 0) * (1 - clearing) * (0.8 + 0.3 * Math.sin(time * 6)));
      cursor.scale.needsUpdate = true;

      drafts.forEach((d, i) => {
        const sx = i === 0 ? -1 : 1;
        guidePos.setXYZ(i * 2, sx * PANEL_W * 0.5, PANEL_H * 0.5 * -sx, 0);
        guidePos.setXYZ(i * 2 + 1, d.group.position.x + sx * PANEL_W * 0.36 * 0.7, d.group.position.y, d.group.position.z);
      });
      guidePos.needsUpdate = true;
    },
    setTheme(next: Palette) {
      palette = next;
      applyTheme();
    },
    resize(view: Viewport) {
      frameSubject(camera, view, 2.0);
      cursor.setPointScale(view.pointScale);
      motes.setPointScale(view.pointScale);
    },
    dispose() {
      scene.remove(root);
      disposeTree(root);
    },
  };
}

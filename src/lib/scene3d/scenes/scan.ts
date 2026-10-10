/**
 * scan — documents, read.
 *
 * A form floats in space. A holographic pane sweeps down it; as it passes, each
 * field is bracketed, lifted off the page as a chip and filed into a column
 * beside it: paper becoming structured data. The overlay is the kind a headset
 * would draw over a real page.
 */
import {
  AdditiveBlending,
  AmbientLight,
  BoxGeometry,
  BufferAttribute,
  BufferGeometry,
  Color,
  DirectionalLight,
  Group,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  MeshPhysicalMaterial,
  NormalBlending,
  PlaneGeometry,
  Vector3,
} from 'three';
import { disposeTree } from '../kit/dispose';
import { exit, frameSubject, smooth } from '../kit/frame';
import { createHologram } from '../kit/hologram';
import { mixColor, toColor } from '../kit/palette';
import { createSoftPoints, setColorAt } from '../kit/points';
import { createSheet } from '../kit/sheet';
import type { Tier } from '../tier';
import type { Palette, SceneContext, SceneInput, SceneInstance, Viewport } from '../types';

export const stillAt = 6.2;

const CYCLE = 9; // seconds per scan
const SHEET_H = 3.0;
const MOTES: Record<Tier, number> = { high: 320, medium: 220, low: 130 };

/** Fields on the form, as fractions of the sheet (kit/sheet.ts `form` layout): centre y, height. */
const FIELDS = [0.725, 0.603, 0.482, 0.36, 0.238].map((y) => ({ y: (y - 0.5) * SHEET_H, h: 0.19 }));

export function create(ctx: SceneContext): SceneInstance {
  const { scene, camera, rng } = ctx;
  const moteCount = MOTES[ctx.tier];
  let palette = ctx.palette;

  camera.position.set(0, 0, 9);
  camera.lookAt(0, 0, 0);

  const root = new Group();
  scene.add(root);
  const key = new DirectionalLight(0xffffff, 2.2);
  key.position.set(-3, 4, 6);
  const fill = new AmbientLight(0xffffff, 0.45);
  root.add(key, fill);

  /* ── The page, and two more behind it waiting their turn ── */
  const stack = new Group();
  const sheets = [0, 1, 2].map((i) => {
    const sheet = createSheet(palette, rng, i === 0 ? 'form' : i === 1 ? 'table' : 'text', SHEET_H);
    sheet.mesh.position.set(i * 0.1, i * -0.07, -0.02 - i * 0.16);
    sheet.mesh.rotation.z = i * -0.035;
    stack.add(sheet.mesh);
    return sheet;
  });
  const W = sheets[0].width;
  stack.position.x = -0.85;
  root.add(stack);

  /* ── The scanning pane ── */
  const pane = createHologram(46);
  const paneMesh = new Mesh(new PlaneGeometry(W * 1.16, 0.5), pane.material);
  stack.add(paneMesh);

  /* ── Corner brackets round each field, lit as the pane reaches it ── */
  const bracketMats = FIELDS.map(() => new LineBasicMaterial({ transparent: true, depthWrite: false }));
  FIELDS.forEach((f, i) => {
    const hw = W * 0.42;
    const hh = f.h / 2;
    const c = 0.09; // corner length
    const v: number[] = [];
    for (const [sx, sy] of [
      [-1, -1],
      [1, -1],
      [1, 1],
      [-1, 1],
    ]) {
      v.push(sx * hw, sy * hh, 0, sx * (hw - c), sy * hh, 0, sx * hw, sy * hh, 0, sx * hw, sy * (hh - c * 0.6), 0);
    }
    const geo = new BufferGeometry();
    geo.setAttribute('position', new BufferAttribute(new Float32Array(v), 3));
    const lines = new LineSegments(geo, bracketMats[i]);
    lines.position.set(0, f.y, 0.02);
    stack.add(lines);
  });

  /* ── The chips: one per field, lifted off the page into a column ── */
  const chipMat = new MeshPhysicalMaterial({ metalness: 0.3, roughness: 0.2, transparent: true, clearcoat: 1 });
  const barMat = new MeshPhysicalMaterial({ metalness: 0.4, roughness: 0.3 });
  const chipGeo = new BoxGeometry(1.05, 0.2, 0.03);
  const barGeo = new BoxGeometry(1, 0.05, 0.012);
  const chips = FIELDS.map((f, i) => {
    const chip = new Group();
    chip.add(new Mesh(chipGeo, chipMat));
    const bar = new Mesh(barGeo, barMat);
    bar.scale.x = 0.34 + rng() * 0.5;
    bar.position.set(-0.5 * (1 - bar.scale.x) * 0.9, 0, 0.02);
    chip.add(bar);
    root.add(chip);
    return { chip, from: new Vector3(stack.position.x, f.y, 0.06), to: new Vector3(1.55, 0.72 - i * 0.36, 0.25) };
  });

  /* ── A guide line from page to column, and motes in the air ── */
  const guideMat = new LineBasicMaterial({ transparent: true, depthWrite: false });
  const guidePos = new BufferAttribute(new Float32Array(FIELDS.length * 6), 3);
  const guideGeo = new BufferGeometry();
  guideGeo.setAttribute('position', guidePos);
  const guides = new LineSegments(guideGeo, guideMat);
  guides.frustumCulled = false;
  root.add(guides);

  const motes = createSoftPoints(moteCount, 0.05, 0.7);
  const moteMix = new Float32Array(moteCount);
  for (let i = 0; i < moteCount; i++) {
    motes.position.setXYZ(i, (rng() * 2 - 1) * 3.8, (rng() * 2 - 1) * 2.6, -0.5 - rng() * 3.5);
    motes.scale.setX(i, 0.3 + Math.pow(rng(), 3) * 1.4);
    moteMix[i] = rng();
  }
  motes.position.needsUpdate = true;
  motes.scale.needsUpdate = true;
  root.add(motes.points);

  const tmp = new Color();
  const applyTheme = () => {
    const { brand, accent, bg, light } = palette;
    const blending = light ? NormalBlending : AdditiveBlending;
    for (const s of sheets) s.setTheme(palette);
    toColor(accent, pane.color);
    pane.setLight(light);
    for (const m of bracketMats) {
      toColor(accent, m.color);
      m.blending = blending;
      m.needsUpdate = true;
    }
    mixColor(bg, brand, light ? 0.16 : 0.34, chipMat.color);
    toColor(accent, barMat.color);
    toColor(accent, barMat.emissive);
    barMat.emissiveIntensity = light ? 0.15 : 0.6;
    mixColor(brand, accent, 0.5, guideMat.color);
    guideMat.blending = blending;
    guideMat.needsUpdate = true;
    for (let i = 0; i < moteCount; i++) setColorAt(motes.color, i, mixColor(brand, accent, moteMix[i], tmp));
    motes.color.needsUpdate = true;
    motes.setLight(light, light ? 0.35 : 0.7);
    /* Paper is nearly white already: on the light theme, strong light bleaches it into the page. */
    key.intensity = light ? 0.9 : 2.2;
    fill.intensity = light ? 0.3 : 0.45;
    scene.environmentIntensity = light ? 0.35 : 0.8;
  };
  applyTheme();

  const top = SHEET_H / 2;
  const at = new Vector3();

  return {
    update(_dt: number, time: number, input: SceneInput) {
      const u = exit(input);
      const light = palette.light;
      const phase = (time % CYCLE) / CYCLE; // 0…1 through one scan
      const sweep = smooth(Math.min(1, phase / 0.62)); // the pane travels the page in the first part
      const paneY = top - sweep * SHEET_H;

      root.rotation.set(0.1 + input.pointerY * 0.08, -0.32 + input.pointerX * 0.16 + 0.05 * Math.sin(time * 0.4), 0);
      root.position.y = Math.sin(time * 0.5) * 0.05 - u * 0.5;
      stack.rotation.set(-0.12, 0.2, 0.03);

      paneMesh.position.set(0, paneY, 0.09);
      /* Visible while it travels, gone while the chips settle and the page resets. */
      const paneOn = smooth(Math.min(1, phase / 0.04)) * (1 - smooth((phase - 0.6) / 0.08));
      pane.set(time, paneOn * (light ? 0.95 : 1) * (1 - 0.5 * u));

      const reset = 1 - smooth((phase - 0.9) / 0.1); // everything fades out before the loop restarts
      for (let i = 0; i < FIELDS.length; i++) {
        const f = FIELDS[i];
        const reached = smooth((f.y + f.h - paneY) / 0.25); // 0 until the pane has passed this field
        const lift = smooth((phase - (0.1 + ((top - f.y) / SHEET_H) * 0.62)) / 0.16) * reached;
        bracketMats[i].opacity = reached * (1 - 0.65 * lift) * reset * (light ? 1 : 0.9);
        const c = chips[i];
        at.lerpVectors(c.from, c.to, lift);
        at.z += Math.sin(lift * Math.PI) * 0.5; // arc out towards the viewer on the way over
        c.chip.position.copy(at);
        c.chip.scale.setScalar(Math.max(0.0001, (0.25 + 0.75 * lift) * reached * reset));
        c.chip.rotation.y = (1 - lift) * 0.2 - 0.25;
        guidePos.setXYZ(i * 2, c.from.x + W * 0.42, f.y, 0.06);
        guidePos.setXYZ(i * 2 + 1, at.x - 0.52, at.y, at.z);
      }
      guidePos.needsUpdate = true;
      chipMat.opacity = light ? 0.9 : 0.78;
      guideMat.opacity = (light ? 0.5 : 0.4) * reset * (1 - 0.6 * u);
    },
    setTheme(next: Palette) {
      palette = next;
      applyTheme();
    },
    resize(view: Viewport) {
      frameSubject(camera, view, 2.45);
      motes.setPointScale(view.pointScale);
    },
    dispose() {
      scene.remove(root);
      disposeTree(root);
    },
  };
}

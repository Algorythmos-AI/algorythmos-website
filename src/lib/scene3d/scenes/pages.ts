/**
 * pages — PDF Algo Pro.
 *
 * A small stack of pages doing the four things the app does, in turn and on a
 * loop: a scan line passes down the front page, a passage lights up as the answer
 * to a question, a signature is drawn at the foot, and two pages change places.
 *
 * That page's rule is to show only what the shipped app does (the App Store
 * record links to it), so there is no headset overlay here and nothing the app
 * cannot do.
 */
import {
  AdditiveBlending,
  AmbientLight,
  CatmullRomCurve3,
  Color,
  DirectionalLight,
  Group,
  Mesh,
  MeshBasicMaterial,
  NormalBlending,
  PlaneGeometry,
  TubeGeometry,
  Vector3,
} from 'three';
import { disposeTree } from '../kit/dispose';
import { exit, frameSubject, smooth } from '../kit/frame';
import { createHologram } from '../kit/hologram';
import { mixColor, toColor } from '../kit/palette';
import { createSoftPoints, setColorAt } from '../kit/points';
import { createSheet, type SheetLayout } from '../kit/sheet';
import type { Tier } from '../tier';
import type { Palette, SceneContext, SceneInput, SceneInstance, Viewport } from '../types';

export const stillAt = 9.2;

const CYCLE = 16; // seconds for all four acts
const SHEET_H = 2.7;
const MOTES: Record<Tier, number> = { high: 260, medium: 180, low: 110 };
const LAYOUTS: SheetLayout[] = ['text', 'table', 'form', 'text'];

/** Where each page rests in the fan: x, y, z, and its lean. */
const SLOTS = [
  { x: -0.34, y: 0.04, z: 0.3, rz: 0.03 },
  { x: 0.02, y: -0.02, z: 0.1, rz: -0.02 },
  { x: 0.38, y: 0.03, z: -0.1, rz: 0.045 },
  { x: 0.74, y: -0.03, z: -0.3, rz: -0.035 },
];

/** 0 before `from`, 1 after `to`, eased between (all in cycle fractions). */
const act = (phase: number, from: number, to: number) => smooth((phase - from) / (to - from));

export function create(ctx: SceneContext): SceneInstance {
  const { scene, camera, rng } = ctx;
  const moteCount = MOTES[ctx.tier];
  let palette = ctx.palette;

  camera.position.set(0, 0, 9);
  camera.lookAt(0, 0, 0);

  const root = new Group();
  scene.add(root);
  const key = new DirectionalLight(0xffffff, 2.3);
  key.position.set(-3, 4, 6);
  const fill = new AmbientLight(0xffffff, 0.45);
  root.add(key, fill);

  const fan = new Group();
  fan.position.x = -0.2;
  root.add(fan);
  const sheets = LAYOUTS.map((layout) => {
    const sheet = createSheet(palette, rng, layout, SHEET_H);
    fan.add(sheet.mesh);
    return sheet;
  });
  const front = sheets[0];
  const W = front.width;

  /* Scan: a pane of scan lines travelling down the front page. */
  const pane = createHologram(40);
  const paneMesh = new Mesh(new PlaneGeometry(W * 1.08, 0.42), pane.material);
  front.mesh.add(paneMesh);

  /* Answers: one passage of the text, highlighted. */
  const markMat = new MeshBasicMaterial({ transparent: true, depthWrite: false });
  const mark = new Mesh(new PlaneGeometry(W * 0.8, 0.2), markMat);
  mark.position.set(0, SHEET_H * 0.09, 0.012);
  front.mesh.add(mark);

  /* Sign: a signature, drawn left to right at the foot of the page. */
  const pts = [
    [-0.36, 0.0],
    [-0.26, 0.11],
    [-0.2, -0.05],
    [-0.12, 0.1],
    [-0.06, -0.03],
    [0.02, 0.06],
    [0.08, -0.02],
    [0.16, 0.04],
    [0.24, 0.0],
    [0.36, 0.03],
  ].map(([x, y]) => new Vector3(x * W * 0.9, y * 0.9, 0));
  const inkMat = new MeshBasicMaterial();
  const signature = new Mesh(new TubeGeometry(new CatmullRomCurve3(pts), 96, 0.011, 6), inkMat);
  signature.position.set(W * 0.12, -SHEET_H * 0.36, 0.016);
  front.mesh.add(signature);
  const inkTotal = signature.geometry.index?.count ?? 0;

  const motes = createSoftPoints(moteCount, 0.05, 0.7);
  const moteMix = new Float32Array(moteCount);
  for (let i = 0; i < moteCount; i++) {
    motes.position.setXYZ(i, (rng() * 2 - 1) * 3.6, (rng() * 2 - 1) * 2.5, -0.6 - rng() * 3.4);
    motes.scale.setX(i, 0.3 + Math.pow(rng(), 3) * 1.4);
    moteMix[i] = rng();
  }
  motes.position.needsUpdate = true;
  motes.scale.needsUpdate = true;
  root.add(motes.points);

  const tmp = new Color();
  const applyTheme = () => {
    const { brand, accent, light } = palette;
    for (const s of sheets) s.setTheme(palette);
    toColor(accent, pane.color);
    pane.setLight(light);
    toColor(accent, markMat.color);
    markMat.blending = light ? NormalBlending : AdditiveBlending;
    markMat.needsUpdate = true;
    toColor(brand, inkMat.color);
    for (let i = 0; i < moteCount; i++) setColorAt(motes.color, i, mixColor(brand, accent, moteMix[i], tmp));
    motes.color.needsUpdate = true;
    motes.setLight(light, light ? 0.35 : 0.7);
    /* Paper is nearly white already: on the light theme, strong light bleaches it into the page. */
    key.intensity = light ? 0.9 : 2.3;
    fill.intensity = light ? 0.3 : 0.45;
    scene.environmentIntensity = light ? 0.35 : 0.8;
  };
  applyTheme();

  return {
    update(_dt: number, time: number, input: SceneInput) {
      const u = exit(input);
      const light = palette.light;
      const phase = (time % CYCLE) / CYCLE;

      root.rotation.set(0.08 + input.pointerY * 0.08, -0.3 + input.pointerX * 0.16 + 0.05 * Math.sin(time * 0.35), 0);
      root.position.y = Math.sin(time * 0.45) * 0.05 - u * 0.5;

      /* Organise (0.74 → 0.96): the two middle pages change places, one passing over the other. */
      const swap = act(phase, 0.74, 0.86) - act(phase, 0.9, 0.98); // out and back, so the loop closes
      sheets.forEach((sheet, i) => {
        const slot = SLOTS[i];
        let x = slot.x;
        let z = slot.z;
        let y = slot.y;
        if (i === 1 || i === 2) {
          const other = SLOTS[i === 1 ? 2 : 1];
          x += (other.x - slot.x) * swap;
          z += (other.z - slot.z) * swap;
          y += Math.sin(swap * Math.PI) * (i === 1 ? 0.5 : -0.25); // one lifts over, the other dips under
        }
        sheet.mesh.position.set(x, y, z);
        sheet.mesh.rotation.set(-0.06, 0.16, slot.rz);
      });

      /* Scan (0 → 0.22). */
      const scan = act(phase, 0.02, 0.22);
      paneMesh.position.set(0, SHEET_H / 2 - scan * SHEET_H, 0.05);
      pane.set(time, act(phase, 0, 0.03) * (1 - act(phase, 0.2, 0.25)) * (light ? 0.95 : 1));

      /* Answers (0.26 → 0.46): the passage lights, holds, and fades. */
      const answer = act(phase, 0.26, 0.31) * (1 - act(phase, 0.42, 0.48));
      markMat.opacity = answer * (light ? 0.3 : 0.34) * (0.85 + 0.15 * Math.sin(time * 5));
      mark.scale.x = 0.02 + 0.98 * act(phase, 0.26, 0.33);
      mark.position.x = -W * 0.4 * (1 - mark.scale.x);

      /* Sign (0.5 → 0.68), then the ink stays until the loop turns over. */
      const drawn = act(phase, 0.5, 0.68) * (1 - act(phase, 0.96, 1));
      signature.geometry.setDrawRange(0, Math.floor((inkTotal * drawn) / 3) * 3);
    },
    setTheme(next: Palette) {
      palette = next;
      applyTheme();
    },
    resize(view: Viewport) {
      frameSubject(camera, view, 2.2);
      motes.setPointScale(view.pointScale);
    },
    dispose() {
      scene.remove(root);
      disposeTree(root);
    },
  };
}

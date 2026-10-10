/**
 * ledger — value, counted and checked.
 *
 * Pricing (`aud`, `eur`): currency tokens run down three lanes, pass a validation
 * gate and settle into three stacks of rising height, one per pricing tier. The
 * token carries the page's own currency.
 *
 * Compliance (`audit`): records take the place of tokens. They pass the same gate
 * one at a time, are sealed, and pile into a single log inside a vault frame.
 *
 * It is drawn as money and paperwork on purpose. Nothing here is a blockchain or
 * a cryptocurrency, and nothing should be made to look like one.
 */
import {
  AdditiveBlending,
  AmbientLight,
  BoxGeometry,
  BufferAttribute,
  BufferGeometry,
  CanvasTexture,
  Color,
  CylinderGeometry,
  DirectionalLight,
  EdgesGeometry,
  Group,
  InstancedMesh,
  LineBasicMaterial,
  LineSegments,
  Matrix4,
  Mesh,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  NormalBlending,
  PlaneGeometry,
  Quaternion,
  SRGBColorSpace,
  Vector3,
} from 'three';
import type { RGB } from '@/lib/tokens';
import { disposeTree } from '../kit/dispose';
import { exit, frameSubject, smooth } from '../kit/frame';
import { createHologram } from '../kit/hologram';
import { mixColor, toColor } from '../kit/palette';
import { createSoftPoints, setColorAt } from '../kit/points';
import type { Tier } from '../tier';
import type { Palette, SceneContext, SceneInput, SceneInstance, Viewport } from '../types';

export const stillAt = 6;

const START_X = -2.9;
const GATE_X = -0.55;
const STACK_X = 1.55;
const COIN_R = 0.19;
const COIN_H = 0.04;

const BUDGET: Record<Tier, { perLane: number; motes: number }> = {
  high: { perLane: 6, motes: 260 },
  medium: { perLane: 5, motes: 180 },
  low: { perLane: 4, motes: 110 },
};

const rgba = (c: RGB, a = 1) => `rgba(${c.r},${c.g},${c.b},${a})`;

/** The face of a token: a rim and the currency sign. A symbol, not a word. */
function drawCoinFace(canvas: HTMLCanvasElement, palette: Palette, sign: string): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const s = canvas.width;
  const { brand, accent, bg, text, light } = palette;
  const metal = light ? brand : accent;
  ctx.fillStyle = rgba(metal);
  ctx.fillRect(0, 0, s, s);
  ctx.strokeStyle = rgba(light ? bg : text, 0.55);
  ctx.lineWidth = s * 0.035;
  ctx.beginPath();
  ctx.arc(s / 2, s / 2, s * 0.4, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = rgba(light ? bg : bg, 0.92);
  ctx.font = `800 ${Math.round(s * (sign.length > 1 ? 0.36 : 0.5))}px system-ui, -apple-system, 'Segoe UI', sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(sign, s / 2, s * 0.53);
}

export function create(ctx: SceneContext): SceneInstance {
  const { scene, camera, rng } = ctx;
  const budget = BUDGET[ctx.tier];
  const audit = ctx.variant === 'audit';
  const sign = ctx.variant === 'eur' ? '€' : 'A$';
  let palette = ctx.palette;

  camera.position.set(0, 0, 9);
  camera.lookAt(0, 0, 0);

  const root = new Group();
  scene.add(root);
  const key = new DirectionalLight(0xffffff, 2.3);
  key.position.set(-2, 5, 4);
  const fill = new AmbientLight(0xffffff, 0.4);
  root.add(key, fill);

  /* Lanes: three for the pricing tiers, one for the audit log. */
  const lanes = audit ? [0] : [-0.82, 0, 0.82];
  const stackHeights = audit ? [15] : [4, 7, 11];

  /* ── The thing that travels: a token or a record ── */
  const coinFace = document.createElement('canvas');
  coinFace.width = coinFace.height = 128;
  const faceTex = new CanvasTexture(coinFace);
  faceTex.colorSpace = SRGBColorSpace;
  const edgeMat = new MeshStandardMaterial({ metalness: 1, roughness: 0.26 });
  const faceMat = new MeshStandardMaterial({ metalness: 0.75, roughness: 0.34, map: audit ? null : faceTex });
  const itemGeo = audit ? new BoxGeometry(0.46, 0.022, 0.6) : new CylinderGeometry(COIN_R, COIN_R, COIN_H, 44);
  /* Cylinder groups are side, top, bottom; a box has six. The face goes on top. */
  const itemMats = audit ? [edgeMat, edgeMat, faceMat, edgeMat, edgeMat, edgeMat] : [edgeMat, faceMat, edgeMat];
  const itemH = audit ? 0.03 : COIN_H + 0.004;

  const moving = new InstancedMesh(itemGeo, itemMats, lanes.length * budget.perLane);
  const stackTotal = stackHeights.reduce((a, b) => a + b, 0);
  const stacked = new InstancedMesh(itemGeo, itemMats, stackTotal);
  moving.frustumCulled = stacked.frustumCulled = false;
  root.add(moving, stacked);

  /* ── Plinths under the stacks: glass blocks of rising height ── */
  const plinthMat = new MeshPhysicalMaterial({ metalness: 0.2, roughness: 0.12, transparent: true, opacity: 0.5, clearcoat: 1 });
  const plinthTops = lanes.map((z, i) => {
    const h = audit ? 0.12 : 0.16 + i * 0.26;
    const plinth = new Mesh(new BoxGeometry(audit ? 0.72 : 0.58, h, audit ? 0.86 : 0.58), plinthMat);
    plinth.position.set(STACK_X, -0.6 + h / 2, z);
    root.add(plinth);
    return -0.6 + h;
  });

  const m4 = new Matrix4();
  const q = new Quaternion();
  const one = new Vector3(1, 1, 1);
  const pos = new Vector3();
  const axisX = new Vector3(1, 0, 0);
  const axisY = new Vector3(0, 1, 0);
  let n = 0;
  lanes.forEach((z, lane) => {
    for (let k = 0; k < stackHeights[lane]; k++) {
      /* A hand-stacked pile: each piece a hair off-centre and turned a little. */
      q.setFromAxisAngle(axisY, (rng() - 0.5) * (audit ? 0.12 : 6));
      pos.set(STACK_X + (rng() - 0.5) * 0.02, plinthTops[lane] + itemH * (k + 0.5), z + (rng() - 0.5) * 0.02);
      m4.compose(pos, q, one);
      stacked.setMatrixAt(n++, m4);
    }
  });
  stacked.instanceMatrix.needsUpdate = true;

  /* ── The gate: a frame across every lane with a scanning pane inside it ── */
  const span = audit ? 1.0 : 2.5;
  const frameMat = new MeshStandardMaterial({ metalness: 1, roughness: 0.24 });
  const gate = new Group();
  const post = new BoxGeometry(0.05, 1.05, 0.05);
  for (const z of [-span / 2, span / 2]) {
    const p = new Mesh(post, frameMat);
    p.position.set(0, -0.075, z);
    gate.add(p);
  }
  const lintel = new Mesh(new BoxGeometry(0.05, 0.05, span + 0.05), frameMat);
  lintel.position.y = 0.45;
  gate.add(lintel);
  const pane = createHologram(70);
  const paneMesh = new Mesh(new PlaneGeometry(span, 0.98), pane.material);
  paneMesh.rotation.y = Math.PI / 2;
  paneMesh.position.y = -0.06;
  gate.add(paneMesh);
  gate.position.x = GATE_X;
  root.add(gate);

  /* ── Rails the lanes run on, and the vault frame around the audit log ── */
  const rail: number[] = [];
  for (const z of lanes) for (const dz of [-0.26, 0.26]) rail.push(START_X, -0.6, z + dz, STACK_X - 0.4, -0.6, z + dz);
  const railGeo = new BufferGeometry();
  railGeo.setAttribute('position', new BufferAttribute(new Float32Array(rail), 3));
  const lineMat = new LineBasicMaterial({ transparent: true, depthWrite: false });
  root.add(new LineSegments(railGeo, lineMat));
  if (audit) {
    const top = plinthTops[0] + itemH * stackHeights[0];
    const vault = new LineSegments(new EdgesGeometry(new BoxGeometry(0.9, top + 0.6 + 0.16, 1.04)), lineMat);
    vault.position.set(STACK_X, (top - 0.6) / 2 + 0.02, 0);
    root.add(vault);
  }

  /* ── A flash where each piece clears the gate, and motes in the air ── */
  const flashes = createSoftPoints(lanes.length, 0.5, 1);
  lanes.forEach((z, i) => flashes.position.setXYZ(i, GATE_X, -0.5, z));
  flashes.position.needsUpdate = true;
  root.add(flashes.points);
  const motes = createSoftPoints(budget.motes, 0.05, 0.7);
  const moteMix = new Float32Array(budget.motes);
  for (let i = 0; i < budget.motes; i++) {
    motes.position.setXYZ(i, (rng() * 2 - 1) * 3.6, -0.6 + rng() * 2.6, (rng() * 2 - 1) * 2.4 - 0.6);
    motes.scale.setX(i, 0.3 + Math.pow(rng(), 3) * 1.4);
    moteMix[i] = rng();
  }
  motes.position.needsUpdate = true;
  motes.scale.needsUpdate = true;
  root.add(motes.points);

  /* ── Theme ── */
  const tmp = new Color();
  const applyTheme = () => {
    const { brand, accent, bg, text, light } = palette;
    const blending = light ? NormalBlending : AdditiveBlending;
    if (audit) {
      /* Records: paper-coloured slabs with a sealed edge. */
      mixColor(bg, text, light ? 0.05 : 0.2, faceMat.color);
      faceMat.metalness = 0.1;
      faceMat.roughness = 0.6;
      mixColor(brand, accent, 0.4, edgeMat.color);
    } else {
      drawCoinFace(coinFace, palette, sign);
      faceTex.needsUpdate = true;
      faceMat.color.setRGB(1, 1, 1);
      toColor(light ? brand : accent, edgeMat.color);
    }
    toColor(brand, edgeMat.emissive);
    edgeMat.emissiveIntensity = light ? 0.06 : 0.2;
    mixColor(bg, brand, light ? 0.18 : 0.3, plinthMat.color);
    mixColor(brand, accent, 0.3, frameMat.color);
    toColor(brand, frameMat.emissive);
    frameMat.emissiveIntensity = light ? 0.08 : 0.3;
    toColor(accent, pane.color);
    pane.setLight(light);
    mixColor(brand, accent, 0.4, lineMat.color);
    lineMat.blending = blending;
    lineMat.opacity = light ? 0.45 : 0.35;
    lineMat.needsUpdate = true;
    lanes.forEach((_, i) => setColorAt(flashes.color, i, toColor(accent, tmp)));
    flashes.color.needsUpdate = true;
    flashes.setLight(light, light ? 0.8 : 1);
    for (let i = 0; i < budget.motes; i++) setColorAt(motes.color, i, mixColor(brand, accent, moteMix[i], tmp));
    motes.color.needsUpdate = true;
    motes.setLight(light, light ? 0.35 : 0.7);
    key.intensity = light ? (audit ? 1.0 : 2.7) : 2.3;
    fill.intensity = light && audit ? 0.3 : 0.4;
    scene.environmentIntensity = light ? (audit ? 0.4 : 1.2) : 0.9;
  };
  applyTheme();

  const roll = new Quaternion();
  const tip = new Quaternion();
  const scale = new Vector3();

  return {
    update(_dt: number, time: number, input: SceneInput) {
      const u = exit(input);
      root.rotation.set(0.6 + input.pointerY * 0.08, -0.46 + input.pointerX * 0.14 + 0.04 * Math.sin(time * 0.3), 0);
      root.position.set(audit ? 0.25 : 0.5, 0.2 - u * 0.5, 0);

      pane.set(time, (palette.light ? 0.9 : 1) * (1 - 0.5 * u));

      /* Each piece runs the lane, lifts over the last stretch and drops onto its stack. */
      let i = 0;
      lanes.forEach((z, lane) => {
        const top = plinthTops[lane] + itemH * stackHeights[lane];
        let nearest = 1;
        for (let k = 0; k < budget.perLane; k++) {
          const t = (time * (audit ? 0.07 : 0.085) + k / budget.perLane + lane * 0.19) % 1;
          const run = smooth(Math.min(1, t / 0.78));
          const hop = smooth(Math.max(0, (t - 0.78) / 0.22));
          const x = START_X + (STACK_X - START_X) * (0.82 * run + 0.18 * hop);
          /* Tokens roll in on edge, like a wheel, and lie down as they are stacked;
             records slide in flat. `upright` is 1 on edge, 0 lying down. */
          const upright = audit ? 0 : 1 - hop;
          const rest = itemH / 2 + upright * (COIN_R - itemH / 2);
          const y = -0.6 + rest + hop * (top + 0.6 + 0.04) + Math.sin(hop * Math.PI) * 0.35;
          pos.set(x, y, z);
          tip.setFromAxisAngle(axisX, upright * (Math.PI / 2));
          roll.setFromAxisAngle(axisY, audit ? 0 : (x - START_X) / COIN_R);
          q.copy(tip).multiply(roll);
          const fade = Math.min(1, t / 0.06) * (1 - smooth(Math.max(0, (t - 0.94) / 0.06)));
          m4.compose(pos, q, scale.setScalar(fade));
          moving.setMatrixAt(i++, m4);
          nearest = Math.min(nearest, Math.abs(x - GATE_X));
        }
        flashes.scale.setX(lane, Math.max(0, 1 - nearest / 0.22) * 1.6);
      });
      moving.instanceMatrix.needsUpdate = true;
      flashes.scale.needsUpdate = true;
    },
    setTheme(next: Palette) {
      palette = next;
      applyTheme();
    },
    resize(view: Viewport) {
      frameSubject(camera, view, audit ? 2.5 : 2.1);
      flashes.setPointScale(view.pointScale);
      motes.setPointScale(view.pointScale);
    },
    dispose() {
      scene.remove(root);
      disposeTree(root);
      faceTex.dispose();
    },
  };
}

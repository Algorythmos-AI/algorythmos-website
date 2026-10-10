/**
 * monitor-radar — model monitoring and observability.
 *
 * A mission-control scope, tilted on its side: range rings, a sweep that turns
 * once every few seconds, and the models under watch as blips. Most are steady.
 * A few are drifting — the sweep lights them harder and a ring spreads from each.
 * Above the scope a metric trace runs between two guard rails.
 */
import {
  AdditiveBlending,
  AmbientLight,
  BufferAttribute,
  BufferGeometry,
  CircleGeometry,
  Color,
  DirectionalLight,
  DoubleSide,
  Group,
  Line,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  NormalBlending,
  RingGeometry,
} from 'three';
import { disposeTree } from '../kit/dispose';
import { exit, frameSubject } from '../kit/frame';
import { createHologram } from '../kit/hologram';
import { createMotes } from '../kit/motes';
import { mixColor, toColor } from '../kit/palette';
import { createSoftPoints, setColorAt } from '../kit/points';
import type { Tier } from '../tier';
import type { Palette, SceneContext, SceneInput, SceneInstance, Viewport } from '../types';

export const stillAt = 3.4;

const R = 1.9;
const SWEEP = 0.9; // rad/s
const BUDGET: Record<Tier, { blips: number; motes: number; trace: number }> = {
  high: { blips: 26, motes: 280, trace: 96 },
  medium: { blips: 20, motes: 190, trace: 72 },
  low: { blips: 14, motes: 110, trace: 56 },
};
const DRIFTING = 3;

export function create(ctx: SceneContext): SceneInstance {
  const { scene, camera, rng } = ctx;
  const budget = BUDGET[ctx.tier];
  let palette = ctx.palette;

  camera.position.set(0, 0, 9);
  camera.lookAt(0, 0, 0);
  const root = new Group();
  scene.add(root);
  const key = new DirectionalLight(0xffffff, 1.6);
  key.position.set(-2, 5, 4);
  const fill = new AmbientLight(0xffffff, 0.4);
  root.add(key, fill);

  const scope = new Group(); // the disc lies in XZ
  scope.position.y = -0.55;
  root.add(scope);

  /* The glass of the scope. */
  const glassMat = new MeshPhysicalMaterial({ metalness: 0.3, roughness: 0.25, transparent: true, opacity: 0.5, clearcoat: 1, side: DoubleSide });
  const glass = new Mesh(new CircleGeometry(R * 1.04, 96), glassMat);
  glass.rotation.x = -Math.PI / 2;
  glass.position.y = -0.01;
  scope.add(glass);

  /* Range rings and bearing spokes. */
  const ringMat = new MeshBasicMaterial({ transparent: true, depthWrite: false, side: DoubleSide });
  for (const f of [0.25, 0.5, 0.75, 1]) {
    const ring = new Mesh(new RingGeometry(R * f - 0.006, R * f + 0.006, 128), ringMat);
    ring.rotation.x = -Math.PI / 2;
    scope.add(ring);
  }
  const spokes: number[] = [];
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    spokes.push(Math.cos(a) * R * 0.08, 0, Math.sin(a) * R * 0.08, Math.cos(a) * R, 0, Math.sin(a) * R);
  }
  const spokeGeo = new BufferGeometry();
  spokeGeo.setAttribute('position', new BufferAttribute(new Float32Array(spokes), 3));
  const spokeMat = new LineBasicMaterial({ transparent: true, depthWrite: false });
  scope.add(new LineSegments(spokeGeo, spokeMat));

  /* The sweep: a wedge of scan lines trailing the beam. */
  const sweep = createHologram(30);
  const wedge = new Mesh(new CircleGeometry(R, 48, 0, Math.PI / 3.2), sweep.material);
  wedge.rotation.x = -Math.PI / 2;
  const sweepArm = new Group();
  sweepArm.position.y = 0.012;
  sweepArm.add(wedge);
  scope.add(sweepArm);

  /* The models under watch. The first few are the ones drifting. */
  const blips = createSoftPoints(budget.blips, 0.2, 1);
  blips.points.position.y = 0.03;
  scope.add(blips.points);
  const bearing = new Float32Array(budget.blips);
  const range = new Float32Array(budget.blips);
  for (let i = 0; i < budget.blips; i++) {
    bearing[i] = rng() * Math.PI * 2;
    range[i] = R * (0.18 + 0.78 * Math.sqrt(rng()));
    blips.position.setXYZ(i, Math.cos(bearing[i]) * range[i], 0, -Math.sin(bearing[i]) * range[i]);
  }
  blips.position.needsUpdate = true;
  const alertMat = new MeshBasicMaterial({ transparent: true, depthWrite: false, side: DoubleSide });
  const alerts = Array.from({ length: DRIFTING }, (_, i) => {
    const ring = new Mesh(new RingGeometry(0.09, 0.1, 40), alertMat.clone());
    ring.rotation.x = -Math.PI / 2;
    ring.position.set(Math.cos(bearing[i]) * range[i], 0.02, -Math.sin(bearing[i]) * range[i]);
    scope.add(ring);
    return ring;
  });

  /* The metric trace above the scope, between its guard rails. */
  const traceGroup = new Group();
  traceGroup.position.set(0, 1.05, -0.2);
  root.add(traceGroup);
  const tracePos = new BufferAttribute(new Float32Array(budget.trace * 3), 3);
  const traceGeo = new BufferGeometry();
  traceGeo.setAttribute('position', tracePos);
  const traceMat = new LineBasicMaterial({ transparent: true, depthWrite: false });
  const trace = new Line(traceGeo, traceMat);
  trace.frustumCulled = false;
  const rails = new BufferGeometry();
  rails.setAttribute('position', new BufferAttribute(new Float32Array([-1.7, 0.34, 0, 1.7, 0.34, 0, -1.7, -0.34, 0, 1.7, -0.34, 0]), 3));
  const railMat = new LineBasicMaterial({ transparent: true, depthWrite: false });
  traceGroup.add(trace, new LineSegments(rails, railMat));
  const head = createSoftPoints(1, 0.22, 1);
  traceGroup.add(head.points);

  const motes = createMotes(budget.motes, rng);
  root.add(motes.points);

  const tmp = new Color();
  const steady = new Color();
  const drifting = new Color();
  const applyTheme = () => {
    const { brand, accent, bg, light } = palette;
    const blending = light ? NormalBlending : AdditiveBlending;
    mixColor(bg, brand, light ? 0.12 : 0.2, glassMat.color);
    mixColor(brand, accent, 0.45, ringMat.color);
    ringMat.blending = blending;
    ringMat.opacity = light ? 0.55 : 0.45;
    ringMat.needsUpdate = true;
    toColor(brand, spokeMat.color);
    spokeMat.blending = blending;
    spokeMat.opacity = light ? 0.3 : 0.22;
    spokeMat.needsUpdate = true;
    toColor(accent, sweep.color);
    sweep.setLight(light);
    toColor(brand, steady);
    toColor(accent, drifting);
    for (const a of alerts) {
      toColor(accent, a.material.color);
      a.material.blending = blending;
      a.material.needsUpdate = true;
    }
    toColor(accent, traceMat.color);
    traceMat.blending = blending;
    traceMat.opacity = light ? 0.95 : 0.9;
    traceMat.needsUpdate = true;
    toColor(brand, railMat.color);
    railMat.blending = blending;
    railMat.opacity = light ? 0.45 : 0.35;
    railMat.needsUpdate = true;
    setColorAt(head.color, 0, toColor(accent, tmp));
    head.color.needsUpdate = true;
    head.setLight(light, 1);
    blips.setLight(light, light ? 0.95 : 1);
    motes.setTheme(palette);
    key.intensity = light ? 2 : 1.6;
    scene.environmentIntensity = light ? 1 : 0.6;
  };
  applyTheme();

  const TWO_PI = Math.PI * 2;

  return {
    update(_dt: number, time: number, input: SceneInput) {
      const u = exit(input);
      const light = palette.light;
      root.rotation.set(0.62 + input.pointerY * 0.08, -0.25 + 0.06 * Math.sin(time * 0.3) + input.pointerX * 0.15, 0);
      root.position.y = 0.05 - u * 0.5;

      const beam = (time * SWEEP) % TWO_PI;
      sweepArm.rotation.y = beam - Math.PI / 3.2; // the wedge trails the beam by its own width
      sweep.set(time, (light ? 0.9 : 1) * (1 - 0.5 * u));

      /* A blip is brightest as the beam passes and fades until it comes round again. */
      for (let i = 0; i < budget.blips; i++) {
        const since = (beam - bearing[i] + TWO_PI * 2) % TWO_PI; // radians since the beam passed
        const glow = Math.pow(1 - since / TWO_PI, 3);
        const drift = i < DRIFTING;
        blips.scale.setX(i, (drift ? 0.9 : 0.45) + glow * (drift ? 1.3 : 0.7));
        setColorAt(blips.color, i, tmp.copy(drift ? drifting : steady).multiplyScalar(light ? 1 : 0.55 + 0.45 * glow));
        if (drift) {
          const ring = alerts[i];
          const p = Math.min(1, since / 2.4); // the ring spreads for a while after each pass
          ring.scale.setScalar(1 + p * 4.5);
          ring.material.opacity = (1 - p) * (light ? 0.9 : 0.8);
        }
      }
      blips.scale.needsUpdate = true;
      blips.color.needsUpdate = true;

      /* The trace: a metric wandering inside its rails, drawn up to a moving head. */
      const n = budget.trace;
      const shown = Math.floor(((time * 0.16) % 1) * n);
      for (let i = 0; i < n; i++) {
        const k = Math.min(i, shown);
        const x = -1.7 + (3.4 * k) / (n - 1);
        const y = 0.2 * Math.sin(k * 0.21 + 1.3) + 0.09 * Math.sin(k * 0.67) + 0.05 * Math.sin(k * 1.9 + time * 0.2);
        tracePos.setXYZ(i, x, y, 0);
        if (i === shown) head.position.setXYZ(0, x, y, 0);
      }
      tracePos.needsUpdate = true;
      head.position.needsUpdate = true;
    },
    setTheme(next: Palette) {
      palette = next;
      applyTheme();
    },
    resize(view: Viewport) {
      frameSubject(camera, view, 2.25);
      for (const s of [blips, head, motes]) s.setPointScale(view.pointScale);
    },
    dispose() {
      scene.remove(root);
      disposeTree(root);
    },
  };
}

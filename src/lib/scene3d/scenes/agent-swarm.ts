/**
 * agent-swarm — agentic automation.
 *
 * Four systems stand at the corners (the CRM, the ERP, the mailbox, the
 * warehouse — unlabelled). Small autonomous units ferry tasks between them,
 * each along its own arc over an orchestrator ring at the centre; a system
 * pulses when a unit arrives. No unit acts alone: every route passes the ring.
 */
import {
  AdditiveBlending,
  AmbientLight,
  BoxGeometry,
  Color,
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
  OctahedronGeometry,
  Quaternion,
  TorusGeometry,
  Vector3,
} from 'three';
import { disposeTree } from '../kit/dispose';
import { exit, frameSubject, smooth } from '../kit/frame';
import { createMotes } from '../kit/motes';
import { mixColor, toColor } from '../kit/palette';
import { createSoftPoints, setColorAt } from '../kit/points';
import type { Tier } from '../tier';
import type { Palette, SceneContext, SceneInput, SceneInstance, Viewport } from '../types';

export const stillAt = 5.5;

const BUDGET: Record<Tier, { agents: number; trail: number; motes: number }> = {
  high: { agents: 16, trail: 12, motes: 300 },
  medium: { agents: 12, trail: 10, motes: 200 },
  low: { agents: 9, trail: 8, motes: 120 },
};
const PILLARS: [x: number, z: number, h: number][] = [
  [-1.75, -1.05, 1.5],
  [1.75, -1.05, 1.15],
  [-1.75, 1.05, 1.0],
  [1.75, 1.05, 1.7],
];
const FLOOR = -0.9;

export function create(ctx: SceneContext): SceneInstance {
  const { scene, camera, rng } = ctx;
  const budget = BUDGET[ctx.tier];
  let palette = ctx.palette;

  camera.position.set(0, 0, 9);
  camera.lookAt(0, 0, 0);
  const root = new Group();
  scene.add(root);
  const key = new DirectionalLight(0xffffff, 2);
  key.position.set(-3, 5, 4);
  const fill = new AmbientLight(0xffffff, 0.35);
  root.add(key, fill);

  /* ── The four systems: glass towers with lit edges ── */
  const towerMat = new MeshPhysicalMaterial({ metalness: 0.25, roughness: 0.12, transparent: true, opacity: 0.55, clearcoat: 1 });
  const edgeMat = new LineBasicMaterial({ transparent: true, depthWrite: false });
  const tops = PILLARS.map(([x, z, h]) => {
    const geo = new BoxGeometry(0.62, h, 0.62);
    const tower = new Mesh(geo, towerMat);
    tower.position.set(x, FLOOR + h / 2, z);
    const edges = new LineSegments(new EdgesGeometry(geo), edgeMat);
    edges.position.copy(tower.position);
    root.add(tower, edges);
    return new Vector3(x, FLOOR + h + 0.12, z);
  });
  const pulses = createSoftPoints(PILLARS.length, 0.9, 1);
  tops.forEach((t, i) => pulses.position.setXYZ(i, t.x, t.y, t.z));
  pulses.position.needsUpdate = true;
  root.add(pulses.points);
  const pulse = new Float32Array(PILLARS.length);

  /* ── The orchestrator: a ring every route passes over ── */
  const ringMat = new MeshStandardMaterial({ metalness: 1, roughness: 0.25 });
  const ring = new Mesh(new TorusGeometry(0.62, 0.022, 10, 96), ringMat);
  ring.rotation.x = Math.PI / 2;
  ring.position.y = FLOOR + 0.9;
  const inner = new Mesh(new TorusGeometry(0.4, 0.008, 8, 72), ringMat);
  inner.position.copy(ring.position);
  root.add(ring, inner);
  const hub = new Vector3(0, FLOOR + 1.75, 0);

  /* ── The units, each on a route from one system to another ── */
  const agentMat = new MeshPhysicalMaterial({ metalness: 1, roughness: 0.14, flatShading: true });
  const agents = new InstancedMesh(new OctahedronGeometry(0.075, 0), agentMat, budget.agents);
  agents.frustumCulled = false;
  root.add(agents);
  const trail = createSoftPoints(budget.agents * budget.trail, 0.13, 1);
  root.add(trail.points);
  const routes = Array.from({ length: budget.agents }, (_, i) => {
    const from = i % PILLARS.length;
    let to = Math.floor(rng() * PILLARS.length);
    if (to === from) to = (to + 1) % PILLARS.length;
    return { from, to, phase: rng(), speed: 0.16 + rng() * 0.1, sway: (rng() - 0.5) * 0.5 };
  });

  const motes = createMotes(budget.motes, rng);
  root.add(motes.points);

  const tmp = new Color();
  const applyTheme = () => {
    const { brand, accent, bg, light } = palette;
    mixColor(bg, brand, light ? 0.2 : 0.34, towerMat.color);
    mixColor(brand, accent, 0.5, edgeMat.color);
    edgeMat.blending = light ? NormalBlending : AdditiveBlending;
    edgeMat.opacity = light ? 0.7 : 0.6;
    edgeMat.needsUpdate = true;
    mixColor(brand, accent, 0.3, ringMat.color);
    toColor(brand, ringMat.emissive);
    ringMat.emissiveIntensity = light ? 0.12 : 0.5;
    mixColor(brand, accent, 0.7, agentMat.color);
    toColor(accent, agentMat.emissive);
    agentMat.emissiveIntensity = light ? 0.4 : 0.35;
    for (let i = 0; i < PILLARS.length; i++) setColorAt(pulses.color, i, toColor(accent, tmp));
    pulses.color.needsUpdate = true;
    pulses.setLight(light, light ? 0.7 : 0.9);
    for (let i = 0; i < budget.agents * budget.trail; i++) setColorAt(trail.color, i, toColor(accent, tmp));
    trail.color.needsUpdate = true;
    trail.setLight(light, light ? 0.7 : 0.9);
    motes.setTheme(palette);
    key.intensity = light ? 2.4 : 2;
    scene.environmentIntensity = light ? 1.15 : 0.85;
  };
  applyTheme();

  const m4 = new Matrix4();
  const q = new Quaternion();
  const spinAxis = new Vector3(0.3, 1, 0.2).normalize();
  const one = new Vector3(1, 1, 1);
  const p = new Vector3();
  /** A point t along a route: out of one system, over the hub, into the next. */
  const along = (route: (typeof routes)[number], t: number, out: Vector3) => {
    const a = tops[route.from];
    const b = tops[route.to];
    const u = 1 - t;
    out.set(
      u * u * a.x + 2 * u * t * (hub.x + route.sway) + t * t * b.x,
      u * u * a.y + 2 * u * t * hub.y + t * t * b.y,
      u * u * a.z + 2 * u * t * (hub.z + route.sway) + t * t * b.z,
    );
    return out;
  };

  return {
    update(_dt: number, time: number, input: SceneInput) {
      const u = exit(input);
      root.rotation.set(0.42 + input.pointerY * 0.08, -0.5 + time * 0.045 + input.pointerX * 0.15, 0);
      root.position.y = 0.1 - u * 0.5;
      ring.rotation.z = time * 0.5;
      inner.rotation.set(time * 0.7, time * 0.4, 0);

      pulse.fill(0);
      for (let i = 0; i < routes.length; i++) {
        const route = routes[i];
        const raw = (time * route.speed + route.phase) % 1;
        /* A system pulses when a unit arrives: it swells over a fifth of a second and
           fades over the next. A function of time alone, so the still is a real frame. */
        const since = raw / route.speed;
        pulse[route.to] = Math.max(pulse[route.to], smooth(since / 0.2) * Math.max(0, 1 - since * 1.2));
        along(route, raw, p);
        q.setFromAxisAngle(spinAxis, time * 2 + i);
        m4.compose(p, q, one);
        agents.setMatrixAt(i, m4);
        for (let k = 0; k < budget.trail; k++) {
          const back = Math.max(0, raw - (k + 1) * 0.022);
          along(route, back, p);
          const n = i * budget.trail + k;
          trail.position.setXYZ(n, p.x, p.y, p.z);
          trail.scale.setX(n, raw < 0.05 ? 0 : Math.pow(1 - k / budget.trail, 1.4));
        }
      }
      agents.instanceMatrix.needsUpdate = true;
      trail.position.needsUpdate = true;
      trail.scale.needsUpdate = true;
      for (let i = 0; i < PILLARS.length; i++) pulses.scale.setX(i, 0.25 + pulse[i] * 1.2);
      pulses.scale.needsUpdate = true;
    },
    setTheme(next: Palette) {
      palette = next;
      applyTheme();
    },
    resize(view: Viewport) {
      frameSubject(camera, view, 2.65);
      for (const s of [pulses, trail, motes]) s.setPointScale(view.pointScale);
    },
    dispose() {
      scene.remove(root);
      disposeTree(root);
    },
  };
}

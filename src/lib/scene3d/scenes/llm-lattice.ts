/**
 * llm-lattice — generative AI and LLMOps.
 *
 * Tokens stream in from the left, pass through the layers of a model — sheets of
 * nodes whose connections light as a token crosses them — and reach a guardrail
 * gate on the right. Most pass. Some are turned back, and fall away.
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
  InstancedMesh,
  LineBasicMaterial,
  LineSegments,
  Matrix4,
  Mesh,
  MeshStandardMaterial,
  NormalBlending,
  PlaneGeometry,
  Quaternion,
  SphereGeometry,
  TorusGeometry,
  Vector3,
} from 'three';
import { disposeTree } from '../kit/dispose';
import { exit, frameSubject, smooth } from '../kit/frame';
import { createHologram } from '../kit/hologram';
import { createMotes } from '../kit/motes';
import { mixColor, toColor } from '../kit/palette';
import type { Tier } from '../tier';
import type { Palette, SceneContext, SceneInput, SceneInstance, Viewport } from '../types';

export const stillAt = 4.6;

const LAYERS = [-1.15, -0.4, 0.35, 1.1]; // x of each layer
const GATE_X = 1.95;
const BUDGET: Record<Tier, { side: number; tokens: number; motes: number }> = {
  high: { side: 5, tokens: 26, motes: 280 },
  medium: { side: 4, tokens: 20, motes: 190 },
  low: { side: 4, tokens: 14, motes: 110 },
};

export function create(ctx: SceneContext): SceneInstance {
  const { scene, camera, rng } = ctx;
  const budget = BUDGET[ctx.tier];
  const per = budget.side * budget.side;
  let palette = ctx.palette;

  camera.position.set(0, 0, 9);
  camera.lookAt(0, 0, 0);
  const root = new Group();
  scene.add(root);
  const key = new DirectionalLight(0xffffff, 1.9);
  key.position.set(-3, 4, 5);
  const fill = new AmbientLight(0xffffff, 0.4);
  root.add(key, fill);

  /* ── Layers: a square sheet of nodes each ── */
  const nodeAt = (layer: number, i: number, out = new Vector3()) => {
    const row = Math.floor(i / budget.side);
    const col = i % budget.side;
    const span = 1.5;
    return out.set(LAYERS[layer], (row / (budget.side - 1) - 0.5) * span, (col / (budget.side - 1) - 0.5) * span);
  };
  const nodeMat = new MeshStandardMaterial({ metalness: 0.9, roughness: 0.22 });
  const nodes = new InstancedMesh(new SphereGeometry(0.045, 12, 10), nodeMat, LAYERS.length * per);
  const m4 = new Matrix4();
  const q = new Quaternion();
  const pos = new Vector3();
  const scl = new Vector3(1, 1, 1);
  for (let l = 0; l < LAYERS.length; l++) {
    for (let i = 0; i < per; i++) {
      m4.compose(nodeAt(l, i, pos), q, scl);
      nodes.setMatrixAt(l * per + i, m4);
    }
  }
  nodes.instanceMatrix.needsUpdate = true;
  root.add(nodes);

  /* ── Connections between neighbouring layers: a sparse, fixed wiring ── */
  const links: [number, number][] = [];
  for (let l = 0; l < LAYERS.length - 1; l++) {
    for (let i = 0; i < per; i++) {
      for (let k = 0; k < 2; k++) links.push([l * per + i, (l + 1) * per + Math.floor(rng() * per)]);
    }
  }
  const linkPos = new Float32Array(links.length * 6);
  const a = new Vector3();
  const b = new Vector3();
  links.forEach(([from, to], n) => {
    nodeAt(Math.floor(from / per), from % per, a);
    nodeAt(Math.floor(to / per), to % per, b);
    linkPos.set([a.x, a.y, a.z, b.x, b.y, b.z], n * 6);
  });
  const linkCol = new BufferAttribute(new Float32Array(links.length * 6), 3);
  const linkGeo = new BufferGeometry();
  linkGeo.setAttribute('position', new BufferAttribute(linkPos, 3));
  linkGeo.setAttribute('color', linkCol);
  const linkMat = new LineBasicMaterial({ vertexColors: true, transparent: true, depthWrite: false });
  root.add(new LineSegments(linkGeo, linkMat));
  const heat = new Float32Array(links.length); // how recently a token crossed each link

  /* ── The guardrail gate ── */
  const gateMat = new MeshStandardMaterial({ metalness: 1, roughness: 0.24 });
  const gate = new Mesh(new TorusGeometry(0.72, 0.03, 10, 96), gateMat);
  gate.rotation.y = Math.PI / 2;
  gate.position.x = GATE_X;
  const pane = createHologram(40);
  const paneMesh = new Mesh(new PlaneGeometry(1.3, 1.3), pane.material);
  paneMesh.rotation.y = Math.PI / 2;
  paneMesh.position.x = GATE_X;
  root.add(gate, paneMesh);

  /* ── Tokens: each takes one node per layer, then meets the gate ── */
  const tokenMat = new MeshStandardMaterial({ metalness: 0.6, roughness: 0.3 });
  const tokens = new InstancedMesh(new BoxGeometry(0.085, 0.085, 0.085), tokenMat, budget.tokens);
  tokens.setColorAt(0, new Color()); // instance colours exist before the first compile
  tokens.frustumCulled = false;
  root.add(tokens);
  const paths = Array.from({ length: budget.tokens }, (_, i) => ({
    phase: rng(),
    speed: 0.1 + rng() * 0.05,
    stops: LAYERS.map(() => Math.floor(rng() * per)),
    entry: new Vector3(-2.6, (rng() - 0.5) * 1.4, (rng() - 0.5) * 1.4),
    blocked: i % 5 === 2, // one in five is turned back at the gate
  }));

  const motes = createMotes(budget.motes, rng);
  root.add(motes.points);

  const cold = new Color();
  const hot = new Color();
  const pass = new Color();
  const stop = new Color();
  const tmp = new Color();
  const applyTheme = () => {
    const { brand, accent, bg, text, light } = palette;
    mixColor(brand, bg, light ? 0.55 : 0.6, cold);
    toColor(accent, hot);
    toColor(accent, pass);
    mixColor(text, bg, 0.55, stop); // a turned-back token loses its colour
    mixColor(brand, accent, 0.25, nodeMat.color);
    toColor(brand, nodeMat.emissive);
    nodeMat.emissiveIntensity = light ? 0.1 : 0.45;
    linkMat.blending = light ? NormalBlending : AdditiveBlending;
    linkMat.opacity = light ? 0.75 : 0.7;
    linkMat.needsUpdate = true;
    mixColor(brand, accent, 0.3, gateMat.color);
    toColor(brand, gateMat.emissive);
    gateMat.emissiveIntensity = light ? 0.1 : 0.4;
    toColor(accent, pane.color);
    pane.setLight(light);
    toColor(accent, tokenMat.emissive);
    tokenMat.emissiveIntensity = light ? 0.25 : 0.5;
    motes.setTheme(palette);
    key.intensity = light ? 2.3 : 1.9;
    scene.environmentIntensity = light ? 1.1 : 0.8;
  };
  applyTheme();

  const spin = new Vector3(1, 1, 0).normalize();
  const from = new Vector3();
  const to = new Vector3();

  return {
    update(_dt: number, time: number, input: SceneInput) {
      const u = exit(input);
      root.rotation.set(0.2 + input.pointerY * 0.08, -0.55 + 0.07 * Math.sin(time * 0.28) + input.pointerX * 0.15, 0);
      root.position.set(-0.15, -u * 0.5, 0);
      gate.rotation.x = time * 0.4;
      pane.set(time, (palette.light ? 0.85 : 0.9) * (1 - 0.5 * u));

      heat.fill(0);

      /* A token's journey: entry → layer 0 → … → last layer → gate → out (or down). */
      const legs = LAYERS.length + 2;
      for (let i = 0; i < paths.length; i++) {
        const path = paths[i];
        const t = ((time * path.speed + path.phase) % 1) * legs;
        const leg = Math.min(legs - 1, Math.floor(t));
        const f = smooth(t - leg);
        const stopAt = (l: number, out: Vector3) => nodeAt(l, path.stops[l], out);
        if (leg === 0) from.copy(path.entry), stopAt(0, to);
        else if (leg <= LAYERS.length - 1) {
          stopAt(leg - 1, from), stopAt(leg, to);
          /* Light the wiring between these two layers that starts at this token's node. */
          const first = (leg - 1) * per * 2 + path.stops[leg - 1] * 2;
          heat[first] = heat[first + 1] = 1;
        } else if (leg === LAYERS.length) stopAt(LAYERS.length - 1, from), to.set(GATE_X, 0, 0);
        else {
          from.set(GATE_X, 0, 0);
          if (path.blocked) to.set(GATE_X - 0.5, -1.6, 0.3);
          else to.set(GATE_X + 1.1, 0, 0);
        }
        /* The wiring it has just left cools over most of a second. A function of time
           alone, so the still is a frame a visitor sees. */
        if (leg >= 2 && leg <= LAYERS.length) {
          const left = (leg - 2) * per * 2 + path.stops[leg - 2] * 2;
          const cooling = Math.max(0, 1 - ((t - leg) / (path.speed * legs)) * 1.4);
          heat[left] = heat[left + 1] = Math.max(heat[left], cooling);
        }
        pos.lerpVectors(from, to, f);
        const out = leg === legs - 1;
        const size = (leg === 0 ? f : 1) * (out ? 1 - f : 1);
        q.setFromAxisAngle(spin, time * 1.5 + i);
        m4.compose(pos, q, scl.setScalar(Math.max(0.0001, size)));
        tokens.setMatrixAt(i, m4);
        tokens.setColorAt(i, out && path.blocked ? stop : pass);
      }
      scl.set(1, 1, 1);
      tokens.instanceMatrix.needsUpdate = true;
      if (tokens.instanceColor) tokens.instanceColor.needsUpdate = true;

      for (let n = 0; n < links.length; n++) {
        tmp.copy(cold).lerp(hot, heat[n]);
        linkCol.setXYZ(n * 2, tmp.r, tmp.g, tmp.b);
        linkCol.setXYZ(n * 2 + 1, tmp.r, tmp.g, tmp.b);
      }
      linkCol.needsUpdate = true;
    },
    setTheme(next: Palette) {
      palette = next;
      applyTheme();
    },
    resize(view: Viewport) {
      frameSubject(camera, view, 2.3);
      motes.setPointScale(view.pointScale);
    },
    dispose() {
      scene.remove(root);
      disposeTree(root);
    },
  };
}

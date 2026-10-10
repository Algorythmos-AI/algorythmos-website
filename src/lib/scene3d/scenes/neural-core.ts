/**
 * neural-core — the home hero.
 *
 * The 3D successor to the 2D NeuralOrb it cross-fades in over, so it keeps that
 * orb's proportions and tilt: a geodesic lattice of chrome beads and light
 * threads, signal pulses hopping node to node, a faceted reflective core behind a
 * breathing energy shell, and three orbital rings carrying "agent" units with
 * comet trails. As the hero scrolls away the lattice unravels downward into
 * streams, toward the console below it.
 *
 * Everything is procedural: no model files, no textures to download.
 */
import {
  AdditiveBlending,
  AmbientLight,
  BackSide,
  BufferAttribute,
  BufferGeometry,
  Color,
  DirectionalLight,
  EdgesGeometry,
  Group,
  IcosahedronGeometry,
  InstancedMesh,
  LineBasicMaterial,
  LineSegments,
  Matrix4,
  Mesh,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  NormalBlending,
  OctahedronGeometry,
  PointLight,
  Quaternion,
  ShaderMaterial,
  SphereGeometry,
  TorusGeometry,
  Vector3,
} from 'three';
import { disposeTree } from '../kit/dispose';
import { mixColor, toColor } from '../kit/palette';
import { createSoftPoints, setColorAt, type SoftPoints } from '../kit/points';
import type { Tier } from '../tier';
import type { Palette, SceneContext, SceneInput, SceneInstance, Viewport } from '../types';

export const stillAt = 6.4;

/* Matches NeuralOrb: its unit sphere is drawn at 0.36 of the square with a 3.2-unit
   camera, i.e. a silhouette 0.379 of the square wide. The mount is 1.28× that
   square, so at 8 units and a 37° lens a 1.55 shell lands on the same pixels. */
const CAMERA_Z = 8;
const SHELL_R = 1.55;
const TILT = -0.35;
const YAW_SPEED = 0.15;

const BUDGET: Record<Tier, { detail: number; signals: number; dust: number; agents: number; trail: number }> = {
  high: { detail: 3, signals: 22, dust: 900, agents: 3, trail: 16 },
  medium: { detail: 3, signals: 16, dust: 600, agents: 2, trail: 14 },
  low: { detail: 2, signals: 10, dust: 320, agents: 2, trail: 10 },
};

const RINGS = [
  { radius: 1.92, tiltX: 1.19, tiltZ: 0.18, speed: -0.34 },
  { radius: 2.2, tiltX: 0.52, tiltZ: -0.74, speed: 0.26 },
  { radius: 2.48, tiltX: -0.86, tiltZ: 0.46, speed: -0.19 },
];

const CORE_VERT = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vView;
  varying vec3 vPos;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vNormal = normalize(normalMatrix * normal);
    vView = normalize(-mv.xyz);
    vPos = position;
    gl_Position = projectionMatrix * mv;
  }
`;
/* Fresnel rim with slow bands of the two brand hues drifting across it. `uInk`
   swaps additive light (dark theme) for a translucent tint (light theme). */
const CORE_FRAG = /* glsl */ `
  uniform vec3 uA;
  uniform vec3 uB;
  uniform float uTime;
  uniform float uOpacity;
  uniform float uInk;
  varying vec3 vNormal;
  varying vec3 vView;
  varying vec3 vPos;
  void main() {
    float rim = pow(1.0 - abs(dot(normalize(vNormal), normalize(vView))), 2.4);
    float band = 0.5 + 0.5 * sin(vPos.y * 5.0 + uTime * 0.9 + sin(vPos.x * 3.5 + uTime * 0.6) * 1.6);
    vec3 col = mix(uA, uB, band);
    float glow = mix(0.10 + 1.15 * rim, 0.04 + 0.85 * rim, uInk);
    gl_FragColor = vec4(col * mix(1.0 + rim, 1.0, uInk), glow * uOpacity);
    #include <colorspace_fragment>
  }
`;

interface SignalState {
  from: number;
  to: number;
  t: number;
  speed: number;
}

export function create(ctx: SceneContext): SceneInstance {
  const { scene, camera, rng } = ctx;
  const budget = BUDGET[ctx.tier];
  let palette = ctx.palette;

  camera.position.set(0, 0, CAMERA_Z);
  camera.lookAt(0, 0, 0);

  const root = new Group();
  scene.add(root);
  const spin = new Group(); // lattice + core share the yaw
  root.add(spin);

  /* ── Lights: the environment map does the reflections (its strength is
     scene.environmentIntensity, set per theme below); these add direction.
     White is neutral, not a brand colour — the one literal a scene may carry. ── */
  const key = new DirectionalLight(0xffffff, 1.5);
  key.position.set(3, 4, 5);
  const fill = new AmbientLight(0xffffff, 0.3);
  const heart = new PointLight(0xffffff, 9, 9, 1.6);
  root.add(key, fill, heart);

  /* ── Lattice: unique vertices + edges of a geodesic sphere ── */
  const ico = new IcosahedronGeometry(SHELL_R, budget.detail);
  const edgeGeo = new EdgesGeometry(ico, 1);
  ico.dispose();
  const src = edgeGeo.getAttribute('position');
  const lookup = new Map<string, number>();
  const base: Vector3[] = [];
  const edges: [number, number][] = [];
  const indexOf = (i: number): number => {
    const x = src.getX(i);
    const y = src.getY(i);
    const z = src.getZ(i);
    const k = `${Math.round(x * 500)},${Math.round(y * 500)},${Math.round(z * 500)}`;
    let n = lookup.get(k);
    if (n === undefined) {
      n = base.length;
      base.push(new Vector3(x, y, z));
      lookup.set(k, n);
    }
    return n;
  };
  for (let i = 0; i < src.count; i += 2) edges.push([indexOf(i), indexOf(i + 1)]);
  edgeGeo.dispose();

  const nodeCount = base.length;
  const neighbours: number[][] = Array.from({ length: nodeCount }, () => []);
  for (const [a, b] of edges) {
    neighbours[a].push(b);
    neighbours[b].push(a);
  }
  /* Per-node scatter used by the scroll unravel: how eagerly it leaves, how far it falls. */
  const eager = new Float32Array(nodeCount);
  const fall = new Float32Array(nodeCount);
  for (let i = 0; i < nodeCount; i++) {
    eager[i] = rng();
    fall[i] = rng();
  }
  const live: Vector3[] = base.map((v) => v.clone()); // current (unravelled) positions
  const flare = new Float32Array(nodeCount);

  const linePos = new BufferAttribute(new Float32Array(edges.length * 6), 3);
  const lineCol = new BufferAttribute(new Float32Array(edges.length * 6), 3);
  const lineGeo = new BufferGeometry();
  lineGeo.setAttribute('position', linePos);
  lineGeo.setAttribute('color', lineCol);
  const lineMat = new LineBasicMaterial({ vertexColors: true, transparent: true, depthWrite: false });
  const lines = new LineSegments(lineGeo, lineMat);
  lines.frustumCulled = false;
  spin.add(lines);

  const nodeMat = new MeshStandardMaterial({ metalness: 0.9, roughness: 0.2 });
  const nodes = new InstancedMesh(new SphereGeometry(0.03, 12, 10), nodeMat, nodeCount);
  nodes.frustumCulled = false;
  spin.add(nodes);
  /* A soft halo behind every bead: the lattice glows without a bloom pass. */
  const nodeGlow = createSoftPoints(nodeCount, 0.2, 0.5);
  spin.add(nodeGlow.points);

  /* ── Signals: pulses travelling the lattice ── */
  const signals: SignalState[] = [];
  const pickEdge = (s: SignalState, from: number) => {
    const options = neighbours[from];
    s.from = from;
    s.to = options[Math.floor(rng() * options.length)];
    s.t = 0;
    s.speed = 1.6 + rng() * 1.4;
  };
  for (let i = 0; i < budget.signals; i++) {
    const s: SignalState = { from: 0, to: 0, t: 0, speed: 1 };
    pickEdge(s, Math.floor(rng() * nodeCount));
    s.t = rng();
    signals.push(s);
  }
  const signalPoints = createSoftPoints(budget.signals, 0.2, 1);
  spin.add(signalPoints.points);

  /* ── Core: a faceted reflective gem inside a breathing energy shell ── */
  const gemMat = new MeshPhysicalMaterial({ metalness: 1, roughness: 0.08, flatShading: true });
  const gem = new Mesh(new IcosahedronGeometry(0.47, 1), gemMat);
  spin.add(gem);

  const energyMat = new ShaderMaterial({
    vertexShader: CORE_VERT,
    fragmentShader: CORE_FRAG,
    uniforms: {
      uA: { value: new Color() },
      uB: { value: new Color() },
      uTime: { value: 0 },
      uOpacity: { value: 1 },
      uInk: { value: 0 },
    },
    transparent: true,
    depthWrite: false,
  });
  const energy = new Mesh(new SphereGeometry(0.82, 48, 32), energyMat);
  const aura = new Mesh(new SphereGeometry(1.12, 40, 28), energyMat.clone());
  aura.material.side = BackSide;
  root.add(energy, aura);

  /* ── Orbital rings with agent units and comet trails ── */
  const ringGeo = RINGS.map((r) => new TorusGeometry(r.radius, 0.0075, 6, 160));
  const ringMat = new MeshStandardMaterial({ metalness: 1, roughness: 0.28 });
  const agentGeo = new OctahedronGeometry(0.085, 0);
  const agentMat = new MeshPhysicalMaterial({ metalness: 1, roughness: 0.14, flatShading: true });
  const orbits = RINGS.map((ring, r) => {
    const group = new Group();
    group.rotation.set(ring.tiltX, 0, ring.tiltZ);
    const hoop = new Mesh(ringGeo[r], ringMat);
    hoop.rotation.x = Math.PI / 2; // torus lies in XY; orbits run in XZ
    group.add(hoop);
    const agents = Array.from({ length: budget.agents }, (_, i) => {
      const mesh = new Mesh(agentGeo, agentMat);
      group.add(mesh);
      return { mesh, phase: (i / budget.agents) * Math.PI * 2 + r * 1.3 };
    });
    const trail = createSoftPoints(budget.agents * budget.trail, 0.26, 1);
    group.add(trail.points);
    root.add(group);
    return { ring, group, agents, trail };
  });

  /* ── Dust: a deep shell of motes that gives the scene its depth ── */
  const dust = createSoftPoints(budget.dust, 0.075, 0.75);
  const dustGroup = new Group();
  dustGroup.add(dust.points);
  root.add(dustGroup);
  const dustMix = new Float32Array(budget.dust);
  for (let i = 0; i < budget.dust; i++) {
    const u = rng() * 2 - 1;
    const phi = rng() * Math.PI * 2;
    const radius = 2.0 + Math.pow(rng(), 0.7) * 1.9;
    const flat = Math.sqrt(1 - u * u);
    dust.position.setXYZ(i, Math.cos(phi) * flat * radius, u * radius * 0.82, Math.sin(phi) * flat * radius);
    dust.scale.setX(i, 0.35 + Math.pow(rng(), 3) * 1.4);
    dustMix[i] = rng();
  }
  dust.position.needsUpdate = true;
  dust.scale.needsUpdate = true;

  const softPoints: SoftPoints[] = [signalPoints, nodeGlow, dust, ...orbits.map((o) => o.trail)];

  /* ── Theme ── */
  const tmp = new Color();
  const applyTheme = () => {
    const { brand, accent, light } = palette;
    const blending = light ? NormalBlending : AdditiveBlending;

    for (let e = 0; e < edges.length; e++) {
      for (let end = 0; end < 2; end++) {
        const y = base[edges[e][end]].y / SHELL_R;
        setColorAt(lineCol, e * 2 + end, mixColor(brand, accent, (y + 1) / 2, tmp));
      }
    }
    lineCol.needsUpdate = true;
    lineMat.blending = blending;
    lineMat.needsUpdate = true;

    for (let i = 0; i < nodeCount; i++) {
      nodes.setColorAt(i, mixColor(brand, accent, (base[i].y / SHELL_R + 1) / 2, tmp));
    }
    if (nodes.instanceColor) nodes.instanceColor.needsUpdate = true;
    toColor(brand, nodeMat.emissive);
    nodeMat.emissiveIntensity = light ? 0.12 : 0.55;
    for (let i = 0; i < nodeCount; i++) {
      setColorAt(nodeGlow.color, i, mixColor(brand, accent, (base[i].y / SHELL_R + 1) / 2, tmp));
    }
    nodeGlow.color.needsUpdate = true;
    nodeGlow.setLight(light, light ? 0.16 : 0.5);

    for (let i = 0; i < budget.signals; i++) setColorAt(signalPoints.color, i, toColor(accent, tmp));
    signalPoints.color.needsUpdate = true;
    signalPoints.setLight(light, light ? 0.85 : 1);

    mixColor(brand, accent, 0.15, gemMat.color);
    toColor(brand, gemMat.emissive);
    gemMat.emissiveIntensity = light ? 0.04 : 0.1;

    for (const mat of [energyMat, aura.material]) {
      toColor(brand, mat.uniforms.uA.value);
      toColor(accent, mat.uniforms.uB.value);
      mat.uniforms.uInk.value = light ? 1 : 0;
      mat.blending = blending;
      mat.needsUpdate = true;
    }

    mixColor(brand, accent, 0.35, ringMat.color);
    mixColor(brand, accent, 0.35, ringMat.emissive);
    ringMat.emissiveIntensity = light ? 0.1 : 0.5;
    mixColor(brand, accent, 0.7, agentMat.color);
    toColor(accent, agentMat.emissive);
    agentMat.emissiveIntensity = light ? 0.45 : 0.35;

    for (const o of orbits) {
      for (let i = 0; i < budget.agents * budget.trail; i++) setColorAt(o.trail.color, i, toColor(accent, tmp));
      o.trail.color.needsUpdate = true;
      o.trail.setLight(light, light ? 0.75 : 1);
    }
    for (let i = 0; i < budget.dust; i++) setColorAt(dust.color, i, mixColor(brand, accent, dustMix[i], tmp));
    dust.color.needsUpdate = true;
    dust.setLight(light, light ? 0.42 : 0.75);

    toColor(brand, heart.color);
    heart.intensity = light ? 3 : 9;
    key.intensity = light ? 2.2 : 1.5;
    scene.environmentIntensity = light ? 1.15 : 0.85;
  };
  applyTheme();

  /* ── Frame ── */
  const m4 = new Matrix4();
  const q = new Quaternion();
  const scl = new Vector3();
  const smooth = (x: number) => x * x * (3 - 2 * x);

  const update = (dt: number, time: number, input: SceneInput) => {
    const u = smooth(Math.min(1, Math.max(0, input.scroll)));
    const light = palette.light;

    root.rotation.x = TILT + 0.06 * Math.sin(time / 1.43) + input.pointerY * 0.12;
    root.rotation.y = input.pointerX * 0.14;
    root.position.y = -u * 0.45;
    spin.rotation.y = 0.6 + time * YAW_SPEED;

    /* Lattice, unravelling with scroll: every node drifts out along its own radius and sinks. */
    for (let i = 0; i < nodeCount; i++) {
      const b = base[i];
      const out = 1 + u * (0.22 + 0.95 * eager[i]);
      live[i].set(b.x * out, b.y * out - u * u * (0.5 + 1.7 * fall[i]), b.z * out);
      if (flare[i] > 0) flare[i] = Math.max(0, flare[i] - dt * 3.2);
      const size = (1 + flare[i] * 1.5) * (1 - 0.55 * u);
      m4.compose(live[i], q, scl.setScalar(size));
      nodes.setMatrixAt(i, m4);
      nodeGlow.position.setXYZ(i, live[i].x, live[i].y, live[i].z);
      nodeGlow.scale.setX(i, (1 + flare[i] * 2.2) * (1 - 0.6 * u));
    }
    nodes.instanceMatrix.needsUpdate = true;
    nodeGlow.position.needsUpdate = true;
    nodeGlow.scale.needsUpdate = true;
    for (let e = 0; e < edges.length; e++) {
      const a = live[edges[e][0]];
      const b = live[edges[e][1]];
      linePos.setXYZ(e * 2, a.x, a.y, a.z);
      linePos.setXYZ(e * 2 + 1, b.x, b.y, b.z);
    }
    linePos.needsUpdate = true;
    lineMat.opacity = (light ? 0.5 : 0.34) * (1 - 0.8 * u);

    /* Signals hop node to node; arriving lights the node up. */
    for (let i = 0; i < signals.length; i++) {
      const s = signals[i];
      s.t += s.speed * dt;
      if (s.t >= 1) {
        flare[s.to] = 1;
        pickEdge(s, s.to);
      }
      const a = live[s.from];
      const b = live[s.to];
      signalPoints.position.setXYZ(i, a.x + (b.x - a.x) * s.t, a.y + (b.y - a.y) * s.t, a.z + (b.z - a.z) * s.t);
      signalPoints.scale.setX(i, 0.7 + 0.6 * Math.sin(s.t * Math.PI));
    }
    signalPoints.position.needsUpdate = true;
    signalPoints.scale.needsUpdate = true;

    /* Core: the gem tumbles, the energy shell breathes. */
    gem.rotation.set(time * 0.31, time * 0.47, 0);
    const breathe = 1 + 0.035 * Math.sin(time * 1.3);
    energy.scale.setScalar(breathe);
    aura.scale.setScalar(1 + 0.05 * Math.sin(time * 0.9 + 1));
    energyMat.uniforms.uTime.value = time;
    energyMat.uniforms.uOpacity.value = (light ? 0.75 : 0.85) * (1 - 0.6 * u);
    aura.material.uniforms.uTime.value = time * 0.7;
    aura.material.uniforms.uOpacity.value = (light ? 0.3 : 0.38) * (1 - 0.7 * u);

    /* Rings open up as the lattice unravels; agents ride them with fading trails. */
    for (const o of orbits) {
      o.group.scale.setScalar(1 + 0.3 * u);
      const step = 0.045 * Math.sign(o.ring.speed);
      for (let a = 0; a < o.agents.length; a++) {
        const agent = o.agents[a];
        const angle = agent.phase + time * o.ring.speed;
        agent.mesh.position.set(Math.cos(angle) * o.ring.radius, 0, Math.sin(angle) * o.ring.radius);
        agent.mesh.rotation.set(time * 1.1 + a, time * 0.8, 0);
        for (let k = 0; k < budget.trail; k++) {
          const back = angle - step * (k + 1);
          const n = a * budget.trail + k;
          o.trail.position.setXYZ(n, Math.cos(back) * o.ring.radius, 0, Math.sin(back) * o.ring.radius);
          o.trail.scale.setX(n, k === 0 ? 1.7 : Math.pow(1 - k / budget.trail, 1.3));
        }
      }
      o.trail.position.needsUpdate = true;
      o.trail.scale.needsUpdate = true;
    }

    dustGroup.rotation.y = time * 0.022;
    dustGroup.position.y = -u * 0.9;
  };

  return {
    update,
    setTheme(next: Palette) {
      palette = next;
      applyTheme();
    },
    resize(view: Viewport) {
      /* A mount narrower than it is tall would crop the rings: pull the camera back. */
      camera.position.z = CAMERA_Z / Math.min(1, view.aspect);
      for (const p of softPoints) p.setPointScale(view.pointScale);
    },
    dispose() {
      scene.remove(root);
      disposeTree(root);
    },
  };
}

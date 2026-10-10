/**
 * constellation — the nine services as one system.
 *
 * A reflective core with nine satellites around it on three orbits, one orbit per
 * service family (AI applications, MLOps and platforms, data), three services
 * each. A beam ties every satellite to the core and packets travel along it.
 *
 * On the services index nothing is singled out. On a service page the variant is
 * that service's slug: its satellite is larger, wears a marker ring, and its beam
 * is the bright one.
 */
import {
  AdditiveBlending,
  AmbientLight,
  BackSide,
  BufferAttribute,
  BufferGeometry,
  Color,
  DirectionalLight,
  Group,
  IcosahedronGeometry,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  NormalBlending,
  PointLight,
  SphereGeometry,
  TorusGeometry,
  Vector3,
} from 'three';
import { disposeTree } from '../kit/dispose';
import { exit, frameSubject } from '../kit/frame';
import { createFresnel } from '../kit/fresnel';
import { createOrbit } from '../kit/orbit';
import { mixColor, toColor } from '../kit/palette';
import { createSoftPoints, setColorAt, type SoftPoints } from '../kit/points';
import { createSatelliteKit } from '../kit/satellite';
import type { Tier } from '../tier';
import type { Palette, SceneContext, SceneInput, SceneInstance, Viewport } from '../types';

export const stillAt = 7.5;

/**
 * Service slugs in the order of src/data/services.ts, three per family. Kept here
 * rather than imported so the scene chunk does not carry the services data;
 * src/data/sceneMap.test.ts fails if the two drift.
 */
export const SERVICE_ORDER = [
  'agentic-automation',
  'document-intelligence',
  'llmops',
  'mlops-cicd',
  'ai-platform-engineering',
  'model-monitoring',
  'data-feature-management',
  'sql-dashboards',
  'ai-websites',
] as const;

const ORBITS = [
  { radius: 1.3, tiltX: 0.32, tiltZ: 0.1, speed: 0.26 },
  { radius: 1.75, tiltX: -0.5, tiltZ: -0.3, speed: -0.19 },
  { radius: 2.2, tiltX: 0.78, tiltZ: 0.42, speed: 0.14 },
];

const BUDGET: Record<Tier, { stars: number; trail: number; packets: number }> = {
  high: { stars: 520, trail: 16, packets: 3 },
  medium: { stars: 360, trail: 14, packets: 2 },
  low: { stars: 200, trail: 10, packets: 2 },
};

export function create(ctx: SceneContext): SceneInstance {
  const { scene, camera, rng } = ctx;
  const budget = BUDGET[ctx.tier];
  const focus = SERVICE_ORDER.indexOf(ctx.variant as (typeof SERVICE_ORDER)[number]); // -1: no service singled out
  let palette = ctx.palette;

  camera.position.set(0, 0, 9);
  camera.lookAt(0, 0, 0);

  const root = new Group();
  scene.add(root);

  const key = new DirectionalLight(0xffffff, 1.8);
  key.position.set(3, 4, 5);
  const fill = new AmbientLight(0xffffff, 0.3);
  const heart = new PointLight(0xffffff, 8, 9, 1.6);
  root.add(key, fill, heart);

  /* ── Core ── */
  const gemMat = new MeshPhysicalMaterial({ metalness: 1, roughness: 0.08, flatShading: true });
  const gem = new Mesh(new IcosahedronGeometry(0.4, 1), gemMat);
  const shell = createFresnel({ power: 2.4, bands: 5 });
  const aura = createFresnel({ power: 2.2, bands: 4, side: BackSide });
  const shellMesh = new Mesh(new SphereGeometry(0.66, 48, 32), shell.material);
  const auraMesh = new Mesh(new SphereGeometry(0.92, 40, 28), aura.material);
  root.add(gem, shellMesh, auraMesh);

  /* ── Three orbits, three satellites each ── */
  const kit = createSatelliteKit();
  const focusBus = new MeshStandardMaterial({ metalness: 1, roughness: 0.18 });
  const focusWing = new MeshStandardMaterial({ metalness: 0.9, roughness: 0.25 });
  const hoopMat = new MeshStandardMaterial({ metalness: 1, roughness: 0.3 });
  const markerMat = new MeshBasicMaterial({ transparent: true, depthWrite: false });
  const marker = new Mesh(new TorusGeometry(0.16, 0.005, 6, 64), markerMat);
  const satellites: Group[] = [];
  const orbits = ORBITS.map((spec, family) => {
    const bodies = [0, 1, 2].map((n) => {
      const index = family * 3 + n;
      const isFocus = index === focus;
      const sat = kit.make(isFocus ? 2.5 : 1.55);
      if (isFocus) {
        /* The service this page is about: its own brighter materials, and a marker ring. */
        sat.traverse((o) => {
          const mesh = o as Mesh;
          if (mesh.isMesh) mesh.material = mesh.material === kit.wing ? focusWing : focusBus;
        });
        sat.add(marker);
      }
      satellites.push(sat);
      return sat;
    });
    const orbit = createOrbit(spec, bodies, budget.trail, 0.2, family * 1.7);
    const hoop = new Mesh(new TorusGeometry(spec.radius, 0.005, 6, 180), hoopMat);
    hoop.rotation.x = Math.PI / 2;
    orbit.group.add(hoop);
    root.add(orbit.group);
    return orbit;
  });

  /* ── Beams core → satellite, and the packets on them ── */
  const beamPos = new BufferAttribute(new Float32Array(9 * 6), 3);
  const beamCol = new BufferAttribute(new Float32Array(9 * 6), 3);
  const beamGeo = new BufferGeometry();
  beamGeo.setAttribute('position', beamPos);
  beamGeo.setAttribute('color', beamCol);
  const beamMat = new LineBasicMaterial({ vertexColors: true, transparent: true, depthWrite: false });
  const beams = new LineSegments(beamGeo, beamMat);
  beams.frustumCulled = false;
  root.add(beams);
  const packets = createSoftPoints(9 * budget.packets, 0.15, 1);
  root.add(packets.points);

  /* ── Far stars ── */
  const stars = createSoftPoints(budget.stars, 0.06, 0.8);
  const starMix = new Float32Array(budget.stars);
  for (let i = 0; i < budget.stars; i++) {
    const u = rng() * 2 - 1;
    const phi = rng() * Math.PI * 2;
    const radius = 3 + rng() * 2.6;
    const flat = Math.sqrt(1 - u * u);
    stars.position.setXYZ(i, Math.cos(phi) * flat * radius, u * radius * 0.8, Math.sin(phi) * flat * radius - 1.2);
    stars.scale.setX(i, 0.3 + Math.pow(rng(), 3) * 1.5);
    starMix[i] = rng();
  }
  stars.position.needsUpdate = true;
  stars.scale.needsUpdate = true;
  root.add(stars.points);

  const softPoints: SoftPoints[] = [packets, stars, ...orbits.map((o) => o.trail)];

  /* ── Theme ── */
  const tmp = new Color();
  const dim = new Color();
  const applyTheme = () => {
    const { brand, accent, bg, light } = palette;
    const blending = light ? NormalBlending : AdditiveBlending;

    mixColor(brand, accent, 0.15, gemMat.color);
    toColor(brand, gemMat.emissive);
    gemMat.emissiveIntensity = light ? 0.04 : 0.1;
    for (const f of [shell, aura]) {
      toColor(brand, f.a);
      toColor(accent, f.b);
      f.setLight(light);
    }

    /* With a service in focus, the other eight step back. */
    const others = focus >= 0 ? (light ? 0.55 : 0.5) : 0;
    mixColor(brand, accent, 0.3, tmp);
    mixColor(brand, bg, others, kit.bus.color);
    toColor(brand, kit.bus.emissive);
    kit.bus.emissiveIntensity = light ? 0.08 : focus >= 0 ? 0.12 : 0.3;
    mixColor(accent, bg, others, kit.wing.color);
    toColor(accent, kit.wing.emissive);
    kit.wing.emissiveIntensity = light ? 0.18 : focus >= 0 ? 0.15 : 0.45;
    focusBus.color.copy(tmp);
    toColor(brand, focusBus.emissive);
    focusBus.emissiveIntensity = light ? 0.2 : 0.55;
    toColor(accent, focusWing.color);
    toColor(accent, focusWing.emissive);
    focusWing.emissiveIntensity = light ? 0.4 : 0.8;
    toColor(accent, markerMat.color);
    markerMat.blending = blending;
    markerMat.needsUpdate = true;

    mixColor(brand, accent, 0.35, hoopMat.color);
    mixColor(brand, accent, 0.35, hoopMat.emissive);
    hoopMat.emissiveIntensity = light ? 0.1 : 0.4;

    mixColor(brand, bg, light ? 0.35 : 0.45, dim);
    for (let i = 0; i < 9; i++) {
      const bright = focus < 0 || i === focus;
      setColorAt(beamCol, i * 2, bright ? toColor(brand, tmp) : dim);
      setColorAt(beamCol, i * 2 + 1, bright ? toColor(accent, tmp) : dim);
      for (let k = 0; k < budget.packets; k++) setColorAt(packets.color, i * budget.packets + k, toColor(accent, tmp));
    }
    beamCol.needsUpdate = true;
    beamMat.blending = blending;
    beamMat.needsUpdate = true;
    packets.color.needsUpdate = true;
    packets.setLight(light, light ? 0.9 : 1);

    orbits.forEach((o) => {
      for (let i = 0; i < 3 * budget.trail; i++) setColorAt(o.trail.color, i, toColor(accent, tmp));
      o.trail.color.needsUpdate = true;
      o.trail.setLight(light, light ? 0.65 : 0.85);
    });
    for (let i = 0; i < budget.stars; i++) setColorAt(stars.color, i, mixColor(brand, accent, starMix[i], tmp));
    stars.color.needsUpdate = true;
    stars.setLight(light, light ? 0.4 : 0.8);

    toColor(brand, heart.color);
    heart.intensity = light ? 3 : 8;
    key.intensity = light ? 2.4 : 1.8;
    scene.environmentIntensity = light ? 1.15 : 0.85;
  };
  applyTheme();

  const world = new Vector3();

  return {
    update(_dt: number, time: number, input: SceneInput) {
      const u = exit(input);
      const light = palette.light;

      root.rotation.x = -0.3 + 0.05 * Math.sin(time / 1.6) + input.pointerY * 0.12;
      root.rotation.y = time * 0.05 + input.pointerX * 0.16;
      root.position.y = -u * 0.45;
      root.updateMatrixWorld();

      gem.rotation.set(time * 0.31, time * 0.47, 0);
      shellMesh.scale.setScalar(1 + 0.035 * Math.sin(time * 1.3));
      auraMesh.scale.setScalar(1 + 0.05 * Math.sin(time * 0.9 + 1));
      shell.set(time, (light ? 0.75 : 0.85) * (1 - 0.6 * u));
      aura.set(time * 0.7, (light ? 0.3 : 0.36) * (1 - 0.7 * u));

      for (const o of orbits) {
        o.update(time);
        o.group.scale.setScalar(1 + 0.25 * u);
      }
      marker.rotation.set(Math.PI / 2 + 0.4 * Math.sin(time * 0.8), time * 0.9, 0);
      markerMat.opacity = (light ? 0.9 : 0.8) * (0.7 + 0.3 * Math.sin(time * 2.2));

      /* Beams and packets follow the satellites; positions are read back in root space. */
      for (let i = 0; i < 9; i++) {
        const sat = satellites[i];
        sat.rotation.set(time * 0.25 + i, -orbits[Math.floor(i / 3)].angleOf(i % 3, time), 0);
        sat.updateWorldMatrix(true, false);
        root.worldToLocal(sat.getWorldPosition(world));
        beamPos.setXYZ(i * 2, 0, 0, 0);
        beamPos.setXYZ(i * 2 + 1, world.x, world.y, world.z);
        for (let k = 0; k < budget.packets; k++) {
          const t = (time * (0.22 + (i % 3) * 0.04) + k / budget.packets + i * 0.13) % 1;
          const n = i * budget.packets + k;
          packets.position.setXYZ(n, world.x * t, world.y * t, world.z * t);
          packets.scale.setX(n, (focus < 0 || i === focus ? 1 : 0.45) * (0.4 + Math.sin(t * Math.PI) * 0.8));
        }
      }
      beamPos.needsUpdate = true;
      packets.position.needsUpdate = true;
      packets.scale.needsUpdate = true;
      beamMat.opacity = (light ? 0.5 : 0.36) * (1 - 0.7 * u);
    },
    setTheme(next: Palette) {
      palette = next;
      applyTheme();
    },
    resize(view: Viewport) {
      frameSubject(camera, view, 2.35);
      for (const p of softPoints) p.setPointScale(view.pointScale);
    },
    dispose() {
      scene.remove(root);
      disposeTree(root);
    },
  };
}

/**
 * globe — where Algorythmos works.
 *
 * A dark glass planet with its continents picked out in points of light, beacons
 * on Sydney and Paris, two arcs of data between them, and relay satellites in
 * orbit. The variant decides which side of the planet faces the page: `sydney`
 * and `paris` hold on their city, every other page gets a slow full rotation
 * from its own starting longitude.
 *
 * Only the two cities Algorythmos actually works from are marked. Nothing on the
 * globe is labelled.
 */
import {
  AdditiveBlending,
  AmbientLight,
  BackSide,
  BufferAttribute,
  BufferGeometry,
  CatmullRomCurve3,
  Color,
  CylinderGeometry,
  DirectionalLight,
  DoubleSide,
  Group,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  NormalBlending,
  RingGeometry,
  SphereGeometry,
  TubeGeometry,
  Vector3,
} from 'three';
import { disposeTree } from '../kit/dispose';
import { exit, frameSubject } from '../kit/frame';
import { createFresnel } from '../kit/fresnel';
import { isLand } from '../kit/land';
import { createOrbit } from '../kit/orbit';
import { mixColor, toColor } from '../kit/palette';
import { createSoftPoints, setColorAt, type SoftPoints } from '../kit/points';
import { createSatelliteKit } from '../kit/satellite';
import type { Tier } from '../tier';
import type { Palette, SceneContext, SceneInput, SceneInstance, Viewport } from '../types';

export const stillAt = 9;

const R = 1.6;
const DEG = Math.PI / 180;
const CITIES: [lat: number, lon: number][] = [
  [-33.87, 151.21], // Sydney
  [48.86, 2.35], // Paris
];

const BUDGET: Record<Tier, { dots: number; stars: number; packets: number; trail: number }> = {
  high: { dots: 5600, stars: 520, packets: 7, trail: 16 },
  medium: { dots: 4000, stars: 360, packets: 6, trail: 14 },
  low: { dots: 2400, stars: 200, packets: 4, trail: 10 },
};

/** Which side of the planet a page starts on, and whether it stays there. */
const VIEWS: Record<string, { lon: number; lat: number; hold: boolean }> = {
  sydney: { lon: 138, lat: -24, hold: true },
  paris: { lon: 6, lat: 42, hold: true },
  about: { lon: 78, lat: 12, hold: false },
  contact: { lon: 104, lat: 4, hold: false },
  careers: { lon: 40, lat: 20, hold: false },
  press: { lon: 60, lat: 16, hold: false },
  studies: { lon: 122, lat: -8, hold: false },
  blog: { lon: 18, lat: 28, hold: false },
};
const DEFAULT_VIEW = VIEWS.about;

const ORBITS = [
  { radius: 1.86, tiltX: 0.42, tiltZ: 0.2, speed: 0.3 },
  { radius: 2.02, tiltX: -0.7, tiltZ: -0.38, speed: -0.22 },
  { radius: 2.18, tiltX: 1.05, tiltZ: 0.52, speed: 0.17 },
];

/** Geographic position on a sphere of radius r (three's usual globe mapping). */
function place(lat: number, lon: number, r: number, out = new Vector3()): Vector3 {
  const phi = (90 - lat) * DEG;
  const theta = (lon + 180) * DEG;
  return out.set(-r * Math.sin(phi) * Math.cos(theta), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(theta));
}

export function create(ctx: SceneContext): SceneInstance {
  const { scene, camera, rng } = ctx;
  const budget = BUDGET[ctx.tier];
  const view = VIEWS[ctx.variant ?? ''] ?? DEFAULT_VIEW;
  let palette = ctx.palette;

  camera.position.set(0, 0, 9);
  camera.lookAt(0, 0, 0);

  const root = new Group();
  scene.add(root);
  const planet = new Group(); // everything fixed to the surface turns together
  root.add(planet);

  const key = new DirectionalLight(0xffffff, 2.2);
  key.position.set(-3, 3.5, 5);
  const fill = new AmbientLight(0xffffff, 0.35);
  root.add(key, fill);

  /* ── The body: a glassy ball that hides the far side and catches the light ── */
  const bodyMat = new MeshPhysicalMaterial({ metalness: 0.35, roughness: 0.62, clearcoat: 0.35, clearcoatRoughness: 0.5 });
  planet.add(new Mesh(new SphereGeometry(R * 0.985, 72, 48), bodyMat));

  /* ── Graticule: faint lines of latitude and longitude ── */
  const grat: number[] = [];
  const a = new Vector3();
  const b = new Vector3();
  const seg = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    place(lat1, lon1, R * 1.002, a);
    place(lat2, lon2, R * 1.002, b);
    grat.push(a.x, a.y, a.z, b.x, b.y, b.z);
  };
  for (let lat = -60; lat <= 60; lat += 30) for (let lon = -180; lon < 180; lon += 6) seg(lat, lon, lat, lon + 6);
  for (let lon = -180; lon < 180; lon += 30) for (let lat = -84; lat < 84; lat += 6) seg(lat, lon, lat + 6, lon);
  const gratGeo = new BufferGeometry();
  gratGeo.setAttribute('position', new BufferAttribute(new Float32Array(grat), 3));
  const gratMat = new LineBasicMaterial({ transparent: true, depthWrite: false });
  planet.add(new LineSegments(gratGeo, gratMat));

  /* ── Continents: evenly spread points, kept where the mask says land ── */
  const landPts: Vector3[] = [];
  const GOLDEN = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < budget.dots; i++) {
    const y = 1 - (2 * (i + 0.5)) / budget.dots;
    const lat = Math.asin(y) / DEG;
    const lon = (((i * GOLDEN) / DEG) % 360) - 180;
    if (isLand(lat, lon)) landPts.push(place(lat, lon, R * 1.006));
  }
  const land = createSoftPoints(landPts.length, 0.058, 1);
  landPts.forEach((p, i) => {
    land.position.setXYZ(i, p.x, p.y, p.z);
    land.scale.setX(i, 0.75 + rng() * 0.6);
  });
  land.position.needsUpdate = true;
  land.scale.needsUpdate = true;
  land.points.frustumCulled = true;
  planet.add(land.points);

  /* ── Atmosphere ── */
  const air = createFresnel({ power: 3.2, bands: 0 });
  const halo = createFresnel({ power: 2.2, bands: 0, side: BackSide });
  planet.add(new Mesh(new SphereGeometry(R * 1.03, 64, 40), air.material));
  root.add(new Mesh(new SphereGeometry(R * 1.2, 48, 32), halo.material));

  /* ── Beacons on the two cities ── */
  const beaconMat = new MeshBasicMaterial();
  const ringMats: MeshBasicMaterial[] = [];
  const spikeMat = new MeshBasicMaterial({ transparent: true, depthWrite: false });
  const up = new Vector3(0, 1, 0);
  const beacons = CITIES.map(([lat, lon]) => {
    const anchor = new Group();
    place(lat, lon, R * 1.008, anchor.position);
    anchor.quaternion.setFromUnitVectors(up, anchor.position.clone().normalize()); // local +Y points out of the planet
    anchor.add(new Mesh(new SphereGeometry(0.03, 16, 12), beaconMat));
    const spike = new Mesh(new CylinderGeometry(0.004, 0.012, 0.42, 8, 1, true), spikeMat);
    spike.position.y = 0.21;
    anchor.add(spike);
    const rings = [0, 1].map((n) => {
      const mat = new MeshBasicMaterial({ transparent: true, depthWrite: false, side: DoubleSide });
      ringMats.push(mat);
      const ring = new Mesh(new RingGeometry(0.05, 0.058, 48), mat);
      ring.rotation.x = -Math.PI / 2; // lie flat on the surface
      anchor.add(ring);
      return { ring, mat, offset: n * 0.5 };
    });
    planet.add(anchor);
    return { rings };
  });

  /* ── Two arcs of data between the cities, with packets travelling both ways ── */
  const from = place(CITIES[0][0], CITIES[0][1], 1).normalize();
  const to = place(CITIES[1][0], CITIES[1][1], 1).normalize();
  const omega = Math.acos(Math.min(1, Math.max(-1, from.dot(to))));
  const arcMat = new MeshBasicMaterial({ transparent: true, depthWrite: false });
  const arcs = [0.42, 0.24].map((lift, n) => {
    /* Bow the second arc sideways a little so the two do not overlap from every angle. */
    const side = new Vector3().crossVectors(from, to).normalize().multiplyScalar(n === 0 ? 0 : 0.16);
    const pts: Vector3[] = [];
    for (let i = 0; i <= 48; i++) {
      const t = i / 48;
      const s1 = Math.sin((1 - t) * omega) / Math.sin(omega);
      const s2 = Math.sin(t * omega) / Math.sin(omega);
      const bulge = Math.sin(Math.PI * t);
      pts.push(
        new Vector3()
          .copy(from)
          .multiplyScalar(s1)
          .addScaledVector(to, s2)
          .addScaledVector(side, bulge)
          .normalize()
          .multiplyScalar(R * (1.01 + lift * bulge)),
      );
    }
    const curve = new CatmullRomCurve3(pts);
    planet.add(new Mesh(new TubeGeometry(curve, 120, 0.0055, 6), arcMat));
    return { curve, direction: n === 0 ? 1 : -1 };
  });
  const packets = createSoftPoints(arcs.length * budget.packets, 0.16, 1);
  planet.add(packets.points);
  const pt = new Vector3();

  /* ── Relay satellites on three inclined orbits ── */
  const satellites = createSatelliteKit();
  const { bus: busMat, wing: wingMat } = satellites;
  const orbits = ORBITS.map((spec, n) => {
    const sat = satellites.make(1.5);
    const orbit = createOrbit(spec, [sat], budget.trail, 0.2, n * 2.1);
    root.add(orbit.group);
    return { orbit, sat };
  });

  /* ── Far stars ── */
  const stars = createSoftPoints(budget.stars, 0.06, 0.8);
  const starMix = new Float32Array(budget.stars);
  for (let i = 0; i < budget.stars; i++) {
    const u = rng() * 2 - 1;
    const phi = rng() * Math.PI * 2;
    const radius = 2.9 + rng() * 2.6;
    const flat = Math.sqrt(1 - u * u);
    stars.position.setXYZ(i, Math.cos(phi) * flat * radius, u * radius * 0.8, Math.sin(phi) * flat * radius - 1.2);
    stars.scale.setX(i, 0.3 + Math.pow(rng(), 3) * 1.5);
    starMix[i] = rng();
  }
  stars.position.needsUpdate = true;
  stars.scale.needsUpdate = true;
  root.add(stars.points);

  const softPoints: SoftPoints[] = [land, packets, stars, ...orbits.map((o) => o.orbit.trail)];

  /* ── Theme ── */
  const tmp = new Color();
  const applyTheme = () => {
    const { brand, accent, bg, light } = palette;
    const blending = light ? NormalBlending : AdditiveBlending;

    mixColor(bg, brand, light ? 0.1 : 0.12, bodyMat.color);
    toColor(brand, gratMat.color);
    gratMat.opacity = light ? 0.16 : 0.13;
    gratMat.blending = blending;
    gratMat.needsUpdate = true;

    landPts.forEach((p, i) => setColorAt(land.color, i, mixColor(brand, accent, (p.y / R + 1) / 2, tmp)));
    land.color.needsUpdate = true;
    land.setLight(light, light ? 0.95 : 1);

    for (const f of [air, halo]) {
      toColor(brand, f.a);
      toColor(accent, f.b);
      f.setLight(light);
    }

    toColor(accent, beaconMat.color);
    for (const m of ringMats) {
      toColor(accent, m.color);
      m.blending = blending;
      m.needsUpdate = true;
    }
    toColor(accent, spikeMat.color);
    spikeMat.blending = blending;
    spikeMat.opacity = light ? 0.7 : 0.85;
    spikeMat.needsUpdate = true;

    mixColor(brand, accent, 0.6, arcMat.color);
    arcMat.blending = blending;
    arcMat.opacity = light ? 0.75 : 0.6;
    arcMat.needsUpdate = true;
    for (let i = 0; i < arcs.length * budget.packets; i++) setColorAt(packets.color, i, toColor(accent, tmp));
    packets.color.needsUpdate = true;
    packets.setLight(light, light ? 0.9 : 1);

    mixColor(brand, accent, 0.25, busMat.color);
    toColor(brand, busMat.emissive);
    busMat.emissiveIntensity = light ? 0.1 : 0.3;
    toColor(accent, wingMat.color);
    toColor(accent, wingMat.emissive);
    wingMat.emissiveIntensity = light ? 0.2 : 0.45;
    for (const o of orbits) {
      for (let i = 0; i < budget.trail; i++) setColorAt(o.orbit.trail.color, i, toColor(accent, tmp));
      o.orbit.trail.color.needsUpdate = true;
      o.orbit.trail.setLight(light, light ? 0.7 : 0.9);
    }
    for (let i = 0; i < budget.stars; i++) setColorAt(stars.color, i, mixColor(brand, accent, starMix[i], tmp));
    stars.color.needsUpdate = true;
    stars.setLight(light, light ? 0.4 : 0.8);

    key.intensity = light ? 2.2 : 1.4;
    scene.environmentIntensity = light ? 0.9 : 0.35;
  };
  applyTheme();

  const baseYaw = -Math.PI / 2 - view.lon * DEG;

  return {
    update(_dt: number, time: number, input: SceneInput) {
      const u = exit(input);
      const light = palette.light;

      root.rotation.x = view.lat * DEG * 0.75 + input.pointerY * 0.1;
      root.rotation.z = 0.06 * Math.sin(time * 0.21);
      root.position.y = -u * 0.5;
      root.scale.setScalar(1 - 0.08 * u);
      /* Hold on a city with a slow sway, or carry on round the world. */
      planet.rotation.y = baseYaw + (view.hold ? 0.38 * Math.sin(time * 0.13) : time * 0.055) + input.pointerX * 0.16;

      air.set(time, (light ? 0.5 : 0.7) * (1 - 0.5 * u));
      halo.set(time, (light ? 0.16 : 0.22) * (1 - 0.6 * u));

      for (const beacon of beacons) {
        for (const r of beacon.rings) {
          const phase = (time * 0.42 + r.offset) % 1;
          r.ring.scale.setScalar(1 + phase * 3.4);
          r.mat.opacity = (1 - phase) * (light ? 0.9 : 0.8);
        }
      }

      for (let n = 0; n < arcs.length; n++) {
        const arc = arcs[n];
        for (let i = 0; i < budget.packets; i++) {
          const raw = (time * 0.09 + i / budget.packets) % 1;
          const t = arc.direction > 0 ? raw : 1 - raw;
          arc.curve.getPoint(t, pt);
          const idx = n * budget.packets + i;
          packets.position.setXYZ(idx, pt.x, pt.y, pt.z);
          packets.scale.setX(idx, 0.5 + Math.sin(raw * Math.PI) * 0.7);
        }
      }
      packets.position.needsUpdate = true;
      packets.scale.needsUpdate = true;

      for (const o of orbits) {
        o.orbit.update(time);
        /* Keep the solar wings across the direction of travel, and turn them slowly. */
        o.sat.rotation.set(time * 0.25, -o.orbit.angleOf(0, time), 0);
        o.orbit.group.scale.setScalar(1 + 0.15 * u);
      }
    },
    setTheme(next: Palette) {
      palette = next;
      applyTheme();
    },
    resize(v: Viewport) {
      frameSubject(camera, v, 2.3);
      for (const p of softPoints) p.setPointScale(v.pointScale);
    },
    dispose() {
      scene.remove(root);
      disposeTree(root);
    },
  };
}

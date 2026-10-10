/**
 * platform-station — AI platform engineering.
 *
 * A platform other teams build on, drawn as an orbital station: a hub, a ring,
 * solar wings — and four modules that arrive along their own axes, dock, stay a
 * while and depart, one after another. A light flashes at each docking.
 */
import {
  AmbientLight,
  BoxGeometry,
  Color,
  CylinderGeometry,
  DirectionalLight,
  Group,
  Mesh,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
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

export const stillAt = 6.5;

const RING_R = 1.2;
const DOCK = RING_R + 0.36; // a docked module's centre, from the hub
const CYCLE = 16; // seconds for a module to arrive, stay and leave
const MOTES: Record<Tier, number> = { high: 520, medium: 360, low: 200 };
const AXES = [new Vector3(1, 0, 0), new Vector3(0, 0, 1), new Vector3(-1, 0, 0), new Vector3(0, 0, -1)];

export function create(ctx: SceneContext): SceneInstance {
  const { scene, camera, rng } = ctx;
  let palette = ctx.palette;

  camera.position.set(0, 0, 9);
  camera.lookAt(0, 0, 0);
  const root = new Group();
  scene.add(root);
  const key = new DirectionalLight(0xffffff, 2.6);
  key.position.set(-4, 3, 5);
  const fill = new AmbientLight(0xffffff, 0.3);
  root.add(key, fill);

  const station = new Group();
  root.add(station);

  const hullMat = new MeshPhysicalMaterial({ metalness: 1, roughness: 0.2, clearcoat: 0.6 });
  const trimMat = new MeshStandardMaterial({ metalness: 1, roughness: 0.3 });
  const wingMat = new MeshStandardMaterial({ metalness: 0.9, roughness: 0.3 });

  /* Hub, ring and the four spokes that end in docking ports. */
  station.add(new Mesh(new CylinderGeometry(0.3, 0.3, 1.15, 28), hullMat));
  for (const y of [-0.62, 0.62]) {
    const cap = new Mesh(new CylinderGeometry(0.18, 0.3, 0.14, 28), trimMat);
    cap.position.y = y;
    cap.rotation.x = y < 0 ? Math.PI : 0;
    station.add(cap);
  }
  const ring = new Mesh(new TorusGeometry(RING_R, 0.07, 14, 120), hullMat);
  ring.rotation.x = Math.PI / 2;
  station.add(ring);
  const spokeGeo = new CylinderGeometry(0.035, 0.035, RING_R - 0.3, 10);
  AXES.forEach((axis) => {
    const spoke = new Mesh(spokeGeo, trimMat);
    spoke.position.copy(axis).multiplyScalar((RING_R + 0.3) / 2);
    spoke.rotation.z = Math.PI / 2;
    spoke.rotation.y = Math.atan2(-axis.z, axis.x);
    station.add(spoke);
  });
  /* Solar wings above and below the hub. */
  for (const y of [-1.05, 1.05]) {
    const wing = new Mesh(new BoxGeometry(1.5, 0.012, 0.42), wingMat);
    wing.position.y = y;
    station.add(wing);
    const mast = new Mesh(new CylinderGeometry(0.02, 0.02, 0.36, 8), trimMat);
    mast.position.y = y - Math.sign(y) * 0.2;
    station.add(mast);
  }

  /* The modules: a pressurised can with a collar at the docking end. */
  const moduleMat = new MeshPhysicalMaterial({ metalness: 0.9, roughness: 0.22, clearcoat: 0.5 });
  const canGeo = new CylinderGeometry(0.17, 0.17, 0.55, 22);
  const collarGeo = new CylinderGeometry(0.11, 0.17, 0.1, 22);
  const modules = AXES.map((axis, i) => {
    const mod = new Group();
    mod.add(new Mesh(canGeo, moduleMat));
    const collar = new Mesh(collarGeo, trimMat);
    collar.position.y = -0.32;
    mod.add(collar);
    /* Lie along the docking axis, collar towards the station. */
    mod.quaternion.setFromUnitVectors(new Vector3(0, 1, 0), axis);
    station.add(mod);
    return { mod, axis, offset: i / AXES.length };
  });
  const flashes = createSoftPoints(AXES.length, 0.7, 1);
  AXES.forEach((axis, i) => flashes.position.setXYZ(i, axis.x * (RING_R + 0.08), 0, axis.z * (RING_R + 0.08)));
  flashes.position.needsUpdate = true;
  station.add(flashes.points);

  const stars = createMotes(MOTES[ctx.tier], rng, { x: 5.5, y: 3.6, near: -1, far: -5.5 }, 0.065);
  root.add(stars.points);

  const tmp = new Color();
  const applyTheme = () => {
    const { brand, accent, bg, light } = palette;
    mixColor(bg, brand, light ? 0.25 : 0.5, hullMat.color);
    mixColor(brand, accent, 0.3, trimMat.color);
    toColor(brand, trimMat.emissive);
    trimMat.emissiveIntensity = light ? 0.08 : 0.3;
    toColor(accent, wingMat.color);
    toColor(accent, wingMat.emissive);
    wingMat.emissiveIntensity = light ? 0.15 : 0.4;
    mixColor(brand, accent, 0.55, moduleMat.color);
    toColor(accent, moduleMat.emissive);
    moduleMat.emissiveIntensity = light ? 0.08 : 0.18;
    for (let i = 0; i < AXES.length; i++) setColorAt(flashes.color, i, toColor(accent, tmp));
    flashes.color.needsUpdate = true;
    flashes.setLight(light, light ? 0.8 : 1);
    stars.setTheme(palette, 0.85, 0.35);
    key.intensity = light ? 2.8 : 2.6;
    scene.environmentIntensity = light ? 1.2 : 0.9;
  };
  applyTheme();

  return {
    update(_dt: number, time: number, input: SceneInput) {
      const u = exit(input);
      root.rotation.set(0.5 + input.pointerY * 0.08, input.pointerX * 0.15, 0.12);
      root.position.y = -u * 0.5;
      station.rotation.y = time * 0.08;

      for (let i = 0; i < modules.length; i++) {
        const m = modules[i];
        const phase = (time / CYCLE + m.offset) % 1;
        /* 0–0.25 approach, 0.25–0.7 docked, 0.7–1 depart. `away` is 0 when docked. */
        const away = 1 - smooth(phase / 0.25) + smooth((phase - 0.7) / 0.3);
        m.mod.position.copy(m.axis).multiplyScalar(DOCK + away * 2.6);
        m.mod.scale.setScalar(Math.max(0.0001, 1 - away * 0.25));
        /* The docking light: brightest at the moment of contact, gone a second later. */
        const since = phase - 0.25;
        flashes.scale.setX(i, since >= 0 && since < 0.08 ? 1.6 * (1 - since / 0.08) : 0);
      }
      flashes.scale.needsUpdate = true;
      stars.points.rotation.y = time * 0.006;
    },
    setTheme(next: Palette) {
      palette = next;
      applyTheme();
    },
    resize(view: Viewport) {
      frameSubject(camera, view, 2.45);
      flashes.setPointScale(view.pointScale);
      stars.setPointScale(view.pointScale);
    },
    dispose() {
      scene.remove(root);
      disposeTree(root);
    },
  };
}

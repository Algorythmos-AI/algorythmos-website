/**
 * robot-sorter — document intelligence.
 *
 * A six-axis arm works a desk of paper: it lifts a page from the inbox, holds it
 * under a scanning pane while it is read, and files it on one of two piles
 * according to what it turned out to be. Then it goes back for the next.
 */
import {
  AmbientLight,
  BoxGeometry,
  Color,
  CylinderGeometry,
  DirectionalLight,
  Group,
  InstancedMesh,
  Matrix4,
  Mesh,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  PlaneGeometry,
  Quaternion,
  SphereGeometry,
  Vector3,
} from 'three';
import { disposeTree } from '../kit/dispose';
import { exit, frameSubject, smooth } from '../kit/frame';
import { createHologram } from '../kit/hologram';
import { createMotes } from '../kit/motes';
import { mixColor, toColor } from '../kit/palette';
import { createSheet } from '../kit/sheet';
import type { Tier } from '../tier';
import type { Palette, SceneContext, SceneInput, SceneInstance, Viewport } from '../types';

export const stillAt = 3.1;

const DESK = -0.9;
const L1 = 0.82; // upper arm
const L2 = 0.76; // forearm
const SHOULDER = new Vector3(0, DESK + 0.42, -0.3);
const DROP = 0.15; // the page hangs this far below the wrist the arm is steered by
const CYCLE = 7; // seconds per page
const MOTES: Record<Tier, number> = { high: 260, medium: 180, low: 110 };

/* Where the gripper goes, as (x, y, z) above the desk. */
const INBOX = new Vector3(-1.15, DESK + 0.16, 0.3);
const SCAN = new Vector3(0, DESK + 0.5, 0.95);
const PILES = [new Vector3(1.05, DESK + 0.13, 0), new Vector3(1.15, DESK + 0.13, 0.62)];
const REST = new Vector3(0, DESK + 1.2, 0.5);

export function create(ctx: SceneContext): SceneInstance {
  const { scene, camera, rng } = ctx;
  let palette = ctx.palette;

  camera.position.set(0, 0, 9);
  camera.lookAt(0, 0, 0);
  const root = new Group();
  scene.add(root);
  const key = new DirectionalLight(0xffffff, 2.2);
  key.position.set(-3, 5, 4);
  const fill = new AmbientLight(0xffffff, 0.45);
  root.add(key, fill);

  const shellMat = new MeshPhysicalMaterial({ metalness: 0.9, roughness: 0.22, clearcoat: 0.6 });
  const jointMat = new MeshStandardMaterial({ metalness: 1, roughness: 0.2 });
  const deskMat = new MeshPhysicalMaterial({ metalness: 0.3, roughness: 0.3, transparent: true, opacity: 0.45, clearcoat: 1 });
  const paperMat = new MeshStandardMaterial({ roughness: 0.65, metalness: 0.05 });

  const desk = new Mesh(new BoxGeometry(3.5, 0.05, 2.2), deskMat);
  desk.position.set(0, DESK - 0.03, 0.4);
  root.add(desk);

  /* ── The arm: turret (yaw) → shoulder → upper arm → elbow → forearm → wrist → gripper ── */
  const base = new Mesh(new CylinderGeometry(0.3, 0.34, 0.16, 28), shellMat);
  base.position.set(SHOULDER.x, DESK + 0.08, SHOULDER.z);
  root.add(base);
  const turret = new Group();
  turret.position.set(SHOULDER.x, DESK + 0.16, SHOULDER.z);
  root.add(turret);
  turret.add(new Mesh(new CylinderGeometry(0.2, 0.24, 0.26, 24), shellMat));
  const shoulder = new Group();
  shoulder.position.y = SHOULDER.y - (DESK + 0.16);
  turret.add(shoulder);
  const joint = new SphereGeometry(0.15, 20, 14);
  shoulder.add(new Mesh(joint, jointMat));
  const upper = new Mesh(new BoxGeometry(0.19, L1, 0.19), shellMat);
  upper.position.y = L1 / 2;
  shoulder.add(upper);
  const elbow = new Group();
  elbow.position.y = L1;
  shoulder.add(elbow);
  elbow.add(new Mesh(joint, jointMat));
  const fore = new Mesh(new BoxGeometry(0.14, L2, 0.14), shellMat);
  fore.position.y = L2 / 2;
  elbow.add(fore);
  const wrist = new Group();
  wrist.position.y = L2;
  elbow.add(wrist);
  wrist.add(new Mesh(new SphereGeometry(0.085, 16, 12), jointMat));
  const grip = new Mesh(new CylinderGeometry(0.1, 0.06, 0.08, 16), jointMat);
  grip.position.y = -0.07;
  wrist.add(grip);
  /* Two fingers, either side of the page's top edge. */
  const fingerGeo = new BoxGeometry(0.03, 0.09, 0.16);
  for (const side of [-1, 1]) {
    const finger = new Mesh(fingerGeo, shellMat);
    finger.position.set(side * 0.085, -0.13, 0);
    wrist.add(finger);
  }

  /* The page in its grip. */
  const page = createSheet(palette, rng, 'form', 0.62);
  page.mesh.rotation.x = -Math.PI / 2; // face up
  page.mesh.position.y = -0.12;
  wrist.add(page.mesh);

  /* ── Paper on the desk: an inbox that never empties, two piles that grow ── */
  const leafGeo = new BoxGeometry(page.width, 0.012, 0.62);
  const leaves = new InstancedMesh(leafGeo, paperMat, 10 + 8 + 8);
  leaves.frustumCulled = false;
  root.add(leaves);
  const lay = new Matrix4();
  const up = new Vector3(0, 1, 0);
  const at = new Vector3();
  const one = new Vector3(1, 1, 1);
  const tilt = Array.from({ length: 26 }, () => (rng() - 0.5) * 0.3);

  /* ── The scanning pane the page is held under ── */
  const pane = createHologram(34);
  const paneMesh = new Mesh(new PlaneGeometry(0.8, 0.66), pane.material);
  paneMesh.rotation.x = -Math.PI / 2;
  root.add(paneMesh);

  const motes = createMotes(MOTES[ctx.tier], rng);
  root.add(motes.points);

  const applyTheme = () => {
    const { brand, accent, bg, text, light } = palette;
    mixColor(bg, brand, light ? 0.3 : 0.55, shellMat.color);
    toColor(accent, jointMat.color);
    toColor(accent, jointMat.emissive);
    jointMat.emissiveIntensity = light ? 0.25 : 0.5;
    mixColor(bg, brand, light ? 0.14 : 0.22, deskMat.color);
    mixColor(bg, text, light ? 0.2 : 0.3, paperMat.color);
    page.setTheme(palette);
    toColor(accent, pane.color);
    pane.setLight(light);
    motes.setTheme(palette);
    /* Paper is nearly white: on the light theme strong light bleaches it into the page. */
    key.intensity = light ? 1.3 : 2.2;
    fill.intensity = light ? 0.35 : 0.45;
    scene.environmentIntensity = light ? 0.6 : 0.9;
  };
  applyTheme();

  const target = new Vector3();
  const reach = new Vector3();
  const mix = (a: Vector3, b: Vector3, t: number, lift: number) => {
    target.lerpVectors(a, b, smooth(t));
    target.y += Math.sin(Math.min(1, Math.max(0, t)) * Math.PI) * lift; // arc over the desk between stops
  };
  const flip = new Quaternion();
  /** Lay `count` of a pile's `size` leaves; the rest are parked out of sight. */
  const stack = (centre: Vector3, size: number, count: number, first: number) => {
    for (let k = 0; k < size; k++) {
      if (k < count) {
        at.set(centre.x, DESK + 0.006 + k * 0.013, centre.z);
        flip.setFromAxisAngle(up, tilt[first + k]);
        lay.compose(at, flip, one);
      } else {
        lay.makeTranslation(0, -50, 0);
      }
      leaves.setMatrixAt(first + k, lay);
    }
  };

  return {
    update(_dt: number, time: number, input: SceneInput) {
      const u = exit(input);
      root.rotation.set(0.4 + input.pointerY * 0.08, -0.38 + 0.05 * Math.sin(time * 0.3) + input.pointerX * 0.15, 0);
      root.position.y = 0.3 - u * 0.5;

      const turn = Math.floor(time / CYCLE);
      const phase = (time % CYCLE) / CYCLE;
      const pile = PILES[turn % 2];

      /* One page: reach → lift to the pane → hold while it is read → file → return. */
      let holding = true;
      if (phase < 0.12) mix(REST, INBOX, phase / 0.12, 0), (holding = false);
      else if (phase < 0.34) mix(INBOX, SCAN, (phase - 0.12) / 0.22, 0.55);
      else if (phase < 0.56) target.copy(SCAN);
      else if (phase < 0.78) mix(SCAN, pile, (phase - 0.56) / 0.22, 0.6);
      else mix(pile, REST, (phase - 0.78) / 0.22, 0), (holding = false);
      page.mesh.visible = holding;

      /* Two-link reach in the plane the turret turns to face. The arm is steered by
         its wrist, which rides above the page it carries. */
      reach.copy(target).sub(SHOULDER);
      reach.y += DROP;
      const yaw = Math.atan2(reach.x, reach.z);
      const flat = Math.hypot(reach.x, reach.z);
      const dist = Math.min(L1 + L2 - 0.01, Math.max(0.3, Math.hypot(flat, reach.y)));
      const elbowIn = Math.acos(Math.min(1, Math.max(-1, (L1 * L1 + L2 * L2 - dist * dist) / (2 * L1 * L2))));
      const lift = Math.atan2(reach.y, flat) + Math.acos(Math.min(1, Math.max(-1, (L1 * L1 + dist * dist - L2 * L2) / (2 * L1 * dist))));
      turret.rotation.y = yaw;
      shoulder.rotation.x = Math.PI / 2 - lift; // 0 points the upper arm straight up
      elbow.rotation.x = Math.PI - elbowIn;
      /* The wrist undoes both, so the gripper always points at the desk. */
      wrist.rotation.x = -(shoulder.rotation.x + elbow.rotation.x);

      /* The pane hovers over the scan spot and only lights while a page is under it. */
      paneMesh.position.set(SCAN.x, SCAN.y + 0.03, SCAN.z);
      pane.set(time * 2, smooth((phase - 0.3) / 0.05) * (1 - smooth((phase - 0.56) / 0.05)) * (palette.light ? 0.95 : 1));

      /* Inbox: ten leaves, always. Each pile gains a leaf when the arm files there, up
         to eight, then starts over. */
      const filed = phase >= 0.78 ? turn + 1 : turn;
      stack(INBOX, 10, 10, 0);
      stack(PILES[0], 8, 1 + (Math.ceil(filed / 2) % 8), 10);
      stack(PILES[1], 8, 1 + (Math.floor(filed / 2) % 8), 18);
      leaves.instanceMatrix.needsUpdate = true;
    },
    setTheme(next: Palette) {
      palette = next;
      applyTheme();
    },
    resize(view: Viewport) {
      frameSubject(camera, view, 1.72);
      motes.setPointScale(view.pointScale);
    },
    dispose() {
      scene.remove(root);
      disposeTree(root);
    },
  };
}

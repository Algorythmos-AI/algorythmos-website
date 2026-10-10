/**
 * port-yard — ports and logistics.
 *
 * A container yard under an automated stacking crane: the gantry runs along the
 * stacks, its trolley crosses them, the spreader comes down, lifts a box and
 * sets it on a waiting carrier, which drives it away as the next one pulls in.
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
  Quaternion,
  Vector3,
} from 'three';
import { disposeTree } from '../kit/dispose';
import { exit, frameSubject, smooth } from '../kit/frame';
import { createMotes } from '../kit/motes';
import { mixColor, toColor } from '../kit/palette';
import type { Tier } from '../tier';
import type { Palette, SceneContext, SceneInput, SceneInstance, Viewport } from '../types';

export const stillAt = 4.4;

/* A box: 0.6 long (x), 0.24 high, 0.24 wide (z). The yard: bays along x, rows along z, tiers up. */
const BX = 0.6;
const BY = 0.24;
const BZ = 0.24;
const BAYS = 4;
const ROWS = 4;
const GROUND = -0.85;
const LANE_Z = 1.35; // where carriers wait, in front of the stacks
const CYCLE = 9;
const MOTES: Record<Tier, number> = { high: 240, medium: 170, low: 100 };

export function create(ctx: SceneContext): SceneInstance {
  const { scene, camera, rng } = ctx;
  let palette = ctx.palette;

  camera.position.set(0, 0, 9);
  camera.lookAt(0, 0, 0);
  const root = new Group();
  scene.add(root);
  const key = new DirectionalLight(0xffffff, 2.3);
  key.position.set(-3, 5, 4);
  const fill = new AmbientLight(0xffffff, 0.4);
  root.add(key, fill);

  const slot = (bay: number, row: number, tier: number, out = new Vector3()) =>
    out.set((bay - (BAYS - 1) / 2) * (BX + 0.08), GROUND + BY / 2 + tier * (BY + 0.012), (row - (ROWS - 1) / 2) * (BZ + 0.06) - 0.35);

  /* ── The stacks: each cell one to four high ── */
  const heights: number[] = [];
  let total = 0;
  for (let i = 0; i < BAYS * ROWS; i++) {
    const h = 1 + Math.floor(rng() * 3.6);
    heights.push(h);
    total += h;
  }
  const boxMat = new MeshStandardMaterial({ metalness: 0.5, roughness: 0.42 });
  const boxGeo = new BoxGeometry(BX, BY, BZ);
  const boxes = new InstancedMesh(boxGeo, boxMat, total);
  const m4 = new Matrix4();
  const q = new Quaternion();
  const one = new Vector3(1, 1, 1);
  const pos = new Vector3();
  const tint: number[] = []; // which of three liveries each box wears
  let n = 0;
  for (let bay = 0; bay < BAYS; bay++) {
    for (let row = 0; row < ROWS; row++) {
      for (let tier = 0; tier < heights[bay * ROWS + row]; tier++) {
        m4.compose(slot(bay, row, tier, pos), q, one);
        boxes.setMatrixAt(n++, m4);
        tint.push(Math.floor(rng() * 3));
      }
    }
  }
  boxes.instanceMatrix.needsUpdate = true;
  root.add(boxes);

  /* The box being moved: off the top of one stack and onto a carrier. */
  const liftMat = new MeshStandardMaterial({ metalness: 0.5, roughness: 0.4 });
  const cargo = new Mesh(boxGeo, liftMat);
  root.add(cargo);
  const pickBay = 1;
  const pickRow = ROWS - 1;
  const pick = slot(pickBay, pickRow, heights[pickBay * ROWS + pickRow], new Vector3());
  const drop = new Vector3(pick.x, GROUND + 0.1 + BY / 2, LANE_Z);

  /* ── The crane: two legs and a beam over the stacks and the lane, a trolley, a spreader ── */
  const steelMat = new MeshStandardMaterial({ metalness: 1, roughness: 0.28 });
  const crane = new Group();
  const TOP = GROUND + 1.75;
  const SPAN_NEAR = LANE_Z + 0.3;
  const SPAN_FAR = -1.25;
  for (const z of [SPAN_NEAR, SPAN_FAR]) {
    for (const x of [-0.42, 0.42]) {
      const leg = new Mesh(new BoxGeometry(0.06, 1.75, 0.06), steelMat);
      leg.position.set(x, GROUND + 0.875, z);
      crane.add(leg);
    }
    const foot = new Mesh(new BoxGeometry(0.98, 0.07, 0.1), steelMat);
    foot.position.set(0, GROUND + 0.035, z);
    crane.add(foot);
  }
  for (const x of [-0.42, 0.42]) {
    const beam = new Mesh(new BoxGeometry(0.07, 0.09, SPAN_NEAR - SPAN_FAR + 0.1), steelMat);
    beam.position.set(x, TOP, (SPAN_NEAR + SPAN_FAR) / 2);
    crane.add(beam);
  }
  const trolley = new Mesh(new BoxGeometry(0.9, 0.08, 0.26), steelMat);
  crane.add(trolley);
  const spreaderMat = new MeshStandardMaterial({ metalness: 1, roughness: 0.2 });
  const spreader = new Mesh(new BoxGeometry(BX + 0.04, 0.035, BZ + 0.04), spreaderMat);
  crane.add(spreader);
  const cablePos = new BufferAttribute(new Float32Array(4 * 6), 3);
  const cableGeo = new BufferGeometry();
  cableGeo.setAttribute('position', cablePos);
  const cableMat = new LineBasicMaterial({ transparent: true, depthWrite: false });
  const cables = new LineSegments(cableGeo, cableMat);
  cables.frustumCulled = false;
  crane.add(cables);
  root.add(crane);

  /* ── Carriers on the lane: a flat bed on a low chassis ── */
  const carrierMat = new MeshStandardMaterial({ metalness: 0.9, roughness: 0.3 });
  const makeCarrier = () => {
    const c = new Group();
    const bed = new Mesh(new BoxGeometry(BX + 0.16, 0.05, BZ + 0.1), carrierMat);
    bed.position.y = 0.075;
    const chassis = new Mesh(new BoxGeometry(BX, 0.05, BZ - 0.02), steelMat);
    chassis.position.y = 0.03;
    c.add(bed, chassis);
    root.add(c);
    return c;
  };
  const carrier = makeCarrier();
  const next = makeCarrier();

  /* Lane markings. */
  const laneGeo = new BufferGeometry();
  laneGeo.setAttribute(
    'position',
    new BufferAttribute(new Float32Array([-3, GROUND, LANE_Z - 0.24, 3, GROUND, LANE_Z - 0.24, -3, GROUND, LANE_Z + 0.24, 3, GROUND, LANE_Z + 0.24]), 3),
  );
  const laneMat = new LineBasicMaterial({ transparent: true, depthWrite: false });
  root.add(new LineSegments(laneGeo, laneMat));

  const motes = createMotes(MOTES[ctx.tier], rng);
  root.add(motes.points);

  const liveries = [new Color(), new Color(), new Color()];
  const applyTheme = () => {
    const { brand, accent, bg, text, light } = palette;
    mixColor(brand, bg, light ? 0.15 : 0.3, liveries[0]);
    mixColor(accent, bg, light ? 0.2 : 0.35, liveries[1]);
    mixColor(bg, text, light ? 0.3 : 0.28, liveries[2]);
    for (let i = 0; i < total; i++) boxes.setColorAt(i, liveries[tint[i]]);
    if (boxes.instanceColor) boxes.instanceColor.needsUpdate = true;
    toColor(accent, liftMat.color);
    toColor(accent, liftMat.emissive);
    liftMat.emissiveIntensity = light ? 0.15 : 0.35;
    mixColor(brand, accent, 0.25, steelMat.color);
    toColor(brand, steelMat.emissive);
    steelMat.emissiveIntensity = light ? 0.06 : 0.25;
    toColor(accent, spreaderMat.color);
    toColor(accent, spreaderMat.emissive);
    spreaderMat.emissiveIntensity = light ? 0.3 : 0.6;
    mixColor(bg, brand, light ? 0.35 : 0.5, carrierMat.color);
    for (const m of [cableMat, laneMat]) {
      mixColor(brand, accent, 0.5, m.color);
      m.blending = light ? NormalBlending : AdditiveBlending;
      m.needsUpdate = true;
    }
    cableMat.opacity = light ? 0.8 : 0.7;
    laneMat.opacity = light ? 0.45 : 0.35;
    motes.setTheme(palette);
    key.intensity = light ? 2.4 : 2.3;
    scene.environmentIntensity = light ? 1.1 : 0.85;
  };
  applyTheme();

  const hook = new Vector3();
  /** Where the loaded carrier is: waiting under the crane, then driving off. */
  const carrierX = (p: number) => pick.x + smooth((p - 0.66) / 0.3) * 3.4;

  return {
    update(_dt: number, time: number, input: SceneInput) {
      const u = exit(input);
      root.rotation.set(0.48 + input.pointerY * 0.08, -0.62 + 0.06 * Math.sin(time * 0.25) + input.pointerX * 0.15, 0);
      root.position.set(0, 0.2 - u * 0.5, 0);

      const phase = (time % CYCLE) / CYCLE;
      /* The move, in order: lower onto the box · lift · cross to the lane · lower onto the
         carrier · release and rise · cross back. `over` is the trolley (0 stack, 1 lane),
         `down` how far the spreader is lowered, `carried` whether the box is on it. */
      const lowerPick = smooth(phase / 0.12) - smooth((phase - 0.14) / 0.12);
      const over = smooth((phase - 0.26) / 0.2) - smooth((phase - 0.8) / 0.18);
      const lowerDrop = smooth((phase - 0.46) / 0.12) - smooth((phase - 0.62) / 0.12);
      const carried = phase > 0.12 && phase < 0.6;

      crane.position.x = pick.x;
      const tz = pick.z + (drop.z - pick.z) * over;
      const high = TOP - 0.2;
      const pickY = pick.y + BY / 2 + 0.02;
      const dropY = drop.y + BY / 2 + 0.02;
      const y = high - lowerPick * (high - pickY) - lowerDrop * (high - dropY);
      trolley.position.set(0, TOP - 0.02, tz);
      spreader.position.set(0, y, tz);
      hook.set(pick.x, y, tz);
      let c = 0;
      for (const sx of [-BX / 2, BX / 2]) {
        for (const sz of [-BZ / 2, BZ / 2]) {
          cablePos.setXYZ(c++, sx, TOP - 0.06, tz + sz);
          cablePos.setXYZ(c++, sx, y + 0.02, tz + sz);
        }
      }
      cablePos.needsUpdate = true;

      /* The box: on its stack, then under the spreader, then on the carrier. */
      if (phase < 0.12) cargo.position.copy(pick);
      else if (carried) cargo.position.set(hook.x, hook.y - BY / 2 - 0.02, hook.z);
      else cargo.position.set(carrierX(phase), drop.y, drop.z);
      cargo.visible = phase < 0.97;

      /* One carrier waits, takes the box and leaves; the next pulls in behind it. */
      carrier.position.set(carrierX(phase), GROUND, LANE_Z);
      next.position.set(pick.x - 3.4 + smooth((phase - 0.66) / 0.34) * 3.4, GROUND, LANE_Z);
      next.visible = phase > 0.66;
    },
    setTheme(next_: Palette) {
      palette = next_;
      applyTheme();
    },
    resize(view: Viewport) {
      frameSubject(camera, view, 2.45);
      motes.setPointScale(view.pointScale);
    },
    dispose() {
      scene.remove(root);
      disposeTree(root);
    },
  };
}

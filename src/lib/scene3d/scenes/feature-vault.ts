/**
 * feature-vault — data and feature management.
 *
 * A store of features: a block of small glass cells inside a frame. Lineage runs
 * through it — a chain of cells lights in order, one feeding the next — and now
 * and then a cell slides out of the block, is read, and slides home.
 */
import {
  AdditiveBlending,
  AmbientLight,
  BoxGeometry,
  BufferAttribute,
  BufferGeometry,
  Color,
  DirectionalLight,
  EdgesGeometry,
  Group,
  InstancedMesh,
  Line,
  LineBasicMaterial,
  LineSegments,
  Matrix4,
  MeshPhysicalMaterial,
  NormalBlending,
  Quaternion,
  Vector3,
} from 'three';
import { disposeTree } from '../kit/dispose';
import { exit, frameSubject, smooth } from '../kit/frame';
import { createMotes } from '../kit/motes';
import { mixColor, toColor } from '../kit/palette';
import { createSoftPoints, setColorAt } from '../kit/points';
import type { Tier } from '../tier';
import type { Palette, SceneContext, SceneInput, SceneInstance, Viewport } from '../types';

export const stillAt = 5;

const SIDE: Record<Tier, number> = { high: 5, medium: 4, low: 4 };
const MOTES: Record<Tier, number> = { high: 280, medium: 190, low: 110 };
const STEP = 0.46;
const CHAIN = 7; // cells in the lineage on show
const CYCLE = 7; // seconds per lineage

export function create(ctx: SceneContext): SceneInstance {
  const { scene, camera, rng } = ctx;
  const side = SIDE[ctx.tier];
  const count = side * side * side;
  let palette = ctx.palette;

  camera.position.set(0, 0, 9);
  camera.lookAt(0, 0, 0);
  const root = new Group();
  scene.add(root);
  const key = new DirectionalLight(0xffffff, 2.2);
  key.position.set(-3, 5, 4);
  const fill = new AmbientLight(0xffffff, 0.4);
  root.add(key, fill);

  const block = new Group();
  root.add(block);
  const half = ((side - 1) * STEP) / 2;
  const home = (i: number, out = new Vector3()) =>
    out.set((i % side) * STEP - half, (Math.floor(i / side) % side) * STEP - half, Math.floor(i / (side * side)) * STEP - half);

  const cellMat = new MeshPhysicalMaterial({ metalness: 0.35, roughness: 0.14, transparent: true, opacity: 0.62, clearcoat: 1 });
  const cells = new InstancedMesh(new BoxGeometry(STEP * 0.6, STEP * 0.6, STEP * 0.6), cellMat, count);
  cells.frustumCulled = false;
  block.add(cells);

  const frameMat = new LineBasicMaterial({ transparent: true, depthWrite: false });
  const outer = side * STEP + 0.18;
  block.add(new LineSegments(new EdgesGeometry(new BoxGeometry(outer, outer, outer)), frameMat));

  /* Three lineages, each a walk through neighbouring cells; one plays at a time. */
  const walk = () => {
    const chain = [Math.floor(rng() * count)];
    while (chain.length < CHAIN) {
      const here = chain[chain.length - 1];
      const x = here % side;
      const y = Math.floor(here / side) % side;
      const z = Math.floor(here / (side * side));
      const steps = [
        [1, 0, 0],
        [-1, 0, 0],
        [0, 1, 0],
        [0, -1, 0],
        [0, 0, 1],
        [0, 0, -1],
      ]
        .map(([dx, dy, dz]) => [x + dx, y + dy, z + dz])
        .filter(([nx, ny, nz]) => nx >= 0 && ny >= 0 && nz >= 0 && nx < side && ny < side && nz < side)
        .map(([nx, ny, nz]) => nx + ny * side + nz * side * side)
        .filter((n) => !chain.includes(n));
      if (!steps.length) break;
      chain.push(steps[Math.floor(rng() * steps.length)]);
    }
    return chain;
  };
  const lineages = [walk(), walk(), walk()];
  const pathPos = new BufferAttribute(new Float32Array(CHAIN * 3), 3);
  const pathGeo = new BufferGeometry();
  pathGeo.setAttribute('position', pathPos);
  const pathMat = new LineBasicMaterial({ transparent: true, depthWrite: false });
  const path = new Line(pathGeo, pathMat);
  path.frustumCulled = false;
  block.add(path);
  const sparks = createSoftPoints(CHAIN, 0.3, 1);
  block.add(sparks.points);

  /* The cell being read: it slides out along +x and back. */
  const reads = [Math.floor(rng() * count), Math.floor(rng() * count), Math.floor(rng() * count)].map(
    (i) => i - (i % side) + (side - 1), // a cell on the +x face
  );

  const motes = createMotes(MOTES[ctx.tier], rng);
  root.add(motes.points);

  const idle = new Color();
  const lit = new Color();
  const tmp = new Color();
  const applyTheme = () => {
    const { brand, accent, bg, light } = palette;
    mixColor(bg, brand, light ? 0.22 : 0.42, idle);
    toColor(accent, lit);
    toColor(brand, cellMat.emissive);
    cellMat.emissiveIntensity = light ? 0.04 : 0.16;
    mixColor(brand, accent, 0.4, frameMat.color);
    frameMat.blending = light ? NormalBlending : AdditiveBlending;
    frameMat.opacity = light ? 0.55 : 0.45;
    frameMat.needsUpdate = true;
    toColor(accent, pathMat.color);
    pathMat.blending = light ? NormalBlending : AdditiveBlending;
    pathMat.needsUpdate = true;
    for (let i = 0; i < CHAIN; i++) setColorAt(sparks.color, i, toColor(accent, tmp));
    sparks.color.needsUpdate = true;
    sparks.setLight(light, light ? 0.8 : 1);
    motes.setTheme(palette);
    key.intensity = light ? 2.5 : 2.2;
    scene.environmentIntensity = light ? 1.2 : 0.9;
  };
  applyTheme();

  const m4 = new Matrix4();
  const q = new Quaternion();
  const pos = new Vector3();
  const one = new Vector3(1, 1, 1);
  const glow = new Float32Array(count);

  return {
    update(_dt: number, time: number, input: SceneInput) {
      const u = exit(input);
      root.rotation.set(0.42 + input.pointerY * 0.08, 0.62 + time * 0.07 + input.pointerX * 0.15, 0);
      root.position.y = -u * 0.5;

      const turn = Math.floor(time / CYCLE);
      const phase = (time % CYCLE) / CYCLE;
      const chain = lineages[turn % lineages.length];
      const reading = reads[turn % reads.length];
      glow.fill(0);

      /* The lineage lights cell by cell over the first 60% of the cycle, holds, then fades. */
      const fade = 1 - smooth((phase - 0.82) / 0.18);
      for (let k = 0; k < CHAIN; k++) {
        const cell = chain[Math.min(k, chain.length - 1)];
        const on = smooth((phase * CHAIN) / 0.6 - k) * fade;
        glow[cell] = Math.max(glow[cell], on);
        home(cell, pos);
        pathPos.setXYZ(k, pos.x, pos.y, pos.z);
        sparks.position.setXYZ(k, pos.x, pos.y, pos.z);
        sparks.scale.setX(k, on * (0.7 + 0.3 * Math.sin(time * 4 + k)));
      }
      pathPos.needsUpdate = true;
      sparks.position.needsUpdate = true;
      sparks.scale.needsUpdate = true;
      pathGeo.setDrawRange(0, Math.max(0, Math.min(CHAIN, Math.ceil((phase * CHAIN) / 0.6))));
      pathMat.opacity = (palette.light ? 0.9 : 0.85) * fade;

      /* The read: out between 0.2 and 0.45 of the cycle, home by 0.7. */
      const out = smooth((phase - 0.2) / 0.25) - smooth((phase - 0.5) / 0.2);
      glow[reading] = Math.max(glow[reading], out);

      for (let i = 0; i < count; i++) {
        home(i, pos);
        if (i === reading) pos.x += out * STEP * 1.6;
        m4.compose(pos, q, one);
        cells.setMatrixAt(i, m4);
        cells.setColorAt(i, tmp.copy(idle).lerp(lit, glow[i]));
      }
      cells.instanceMatrix.needsUpdate = true;
      if (cells.instanceColor) cells.instanceColor.needsUpdate = true;
    },
    setTheme(next: Palette) {
      palette = next;
      applyTheme();
    },
    resize(view: Viewport) {
      frameSubject(camera, view, 2.05);
      sparks.setPointScale(view.pointScale);
      motes.setPointScale(view.pointScale);
    },
    dispose() {
      scene.remove(root);
      disposeTree(root);
    },
  };
}

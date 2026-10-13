/**
 * memory-array — the DRAM evidence report.
 *
 * A field of memory cells seen from above and to one side: each a thin upright
 * transistor with its capacitor standing on top, wordlines running one way and
 * bitlines the other. A wordline sweeps across the rows, lighting each row as it
 * opens it, and one bitline picks out the cell being read.
 */
import {
  AdditiveBlending,
  AmbientLight,
  BoxGeometry,
  BufferAttribute,
  BufferGeometry,
  Color,
  CylinderGeometry,
  DirectionalLight,
  Group,
  InstancedMesh,
  LineBasicMaterial,
  LineSegments,
  Matrix4,
  MeshStandardMaterial,
  NormalBlending,
  Quaternion,
  Vector3,
} from 'three';
import { disposeTree } from '../kit/dispose';
import { exit, frameSubject } from '../kit/frame';
import { createMotes } from '../kit/motes';
import { mixColor, toColor } from '../kit/palette';
import { createSoftPoints, setColorAt } from '../kit/points';
import type { Tier } from '../tier';
import type { Palette, SceneContext, SceneInput, SceneInstance, Viewport } from '../types';

export const stillAt = 3.4;

const GRID: Record<Tier, { cols: number; rows: number; motes: number }> = {
  high: { cols: 12, rows: 8, motes: 240 },
  medium: { cols: 10, rows: 7, motes: 170 },
  low: { cols: 8, rows: 6, motes: 100 },
};
const STEP = 0.34;
const FLOOR = -0.8;
/** The transistor pillar, and the capacitor that stands on it. */
const PILLAR = 0.42;
const CAP = 0.72;
/** Rows opened per second: slow enough that nothing flashes. */
const SWEEP = 1.1;

/** One line segment between two points, as its own object so it can be moved. */
function segment(ax: number, ay: number, az: number, bx: number, by: number, bz: number, material: LineBasicMaterial): LineSegments {
  const geo = new BufferGeometry();
  geo.setAttribute('position', new BufferAttribute(new Float32Array([ax, ay, az, bx, by, bz]), 3));
  const line = new LineSegments(geo, material);
  line.frustumCulled = false;
  return line;
}

export function create(ctx: SceneContext): SceneInstance {
  const { scene, camera, rng } = ctx;
  const { cols, rows, motes: moteCount } = GRID[ctx.tier];
  let palette = ctx.palette;

  camera.position.set(0, 0, 9);
  camera.lookAt(0, 0, 0);
  const root = new Group();
  scene.add(root);
  const key = new DirectionalLight(0xffffff, 2.2);
  key.position.set(-3, 5, 3);
  const fill = new AmbientLight(0xffffff, 0.4);
  root.add(key, fill);

  const count = cols * rows;
  const pillarMat = new MeshStandardMaterial({ metalness: 0.6, roughness: 0.35 });
  const pillars = new InstancedMesh(new BoxGeometry(0.09, PILLAR, 0.09), pillarMat, count);
  const capMat = new MeshStandardMaterial({ metalness: 0.7, roughness: 0.25 });
  const caps = new InstancedMesh(new CylinderGeometry(0.105, 0.105, CAP, 14), capMat, count);
  for (const mesh of [pillars, caps]) {
    mesh.setColorAt(0, new Color()); // instance colours exist before the first compile
    mesh.frustumCulled = false;
    root.add(mesh);
  }
  const x0 = (-(cols - 1) * STEP) / 2;
  const z0 = (-(rows - 1) * STEP) / 2;
  /* Which cells hold a 1: a charged capacitor is drawn brighter. */
  const charged = new Uint8Array(count);
  for (let i = 0; i < count; i++) charged[i] = rng() > 0.45 ? 1 : 0;
  /* The column read on each pass of the sweep. */
  const picks: number[] = [];
  for (let i = 0; i < 16; i++) picks.push(Math.floor(rng() * cols));

  /* Wordlines at the height of the transistors, bitlines along the floor. */
  const hx = ((cols - 1) * STEP) / 2 + 0.3;
  const hz = ((rows - 1) * STEP) / 2 + 0.3;
  const wordY = FLOOR + PILLAR / 2;
  const lines: number[] = [];
  for (let r = 0; r < rows; r++) lines.push(-hx, wordY, z0 + r * STEP, hx, wordY, z0 + r * STEP);
  for (let c = 0; c < cols; c++) lines.push(x0 + c * STEP, FLOOR, -hz, x0 + c * STEP, FLOOR, hz);
  const gridGeo = new BufferGeometry();
  gridGeo.setAttribute('position', new BufferAttribute(new Float32Array(lines), 3));
  const gridMat = new LineBasicMaterial({ transparent: true, depthWrite: false });
  root.add(new LineSegments(gridGeo, gridMat));

  /* The wordline that is open, and the bitline being sensed. */
  const wordMat = new LineBasicMaterial({ transparent: true, depthWrite: false });
  const word = segment(-hx, wordY, 0, hx, wordY, 0, wordMat);
  const bitMat = new LineBasicMaterial({ transparent: true, depthWrite: false });
  const bit = segment(0, FLOOR, -hz, 0, FLOOR, hz, bitMat);
  root.add(word, bit);
  /* The cell where they cross. */
  const marker = createSoftPoints(1, 0.34, 1);
  root.add(marker.points);

  const motes = createMotes(moteCount, rng);
  root.add(motes.points);

  const tmp = new Color();
  const idle = new Color();
  const full = new Color();
  const open = new Color();
  const applyTheme = () => {
    const { brand, accent, light } = palette;
    mixColor(brand, palette.bg, light ? 0.55 : 0.5, idle);
    toColor(brand, full);
    toColor(accent, open);
    toColor(brand, capMat.emissive);
    capMat.emissiveIntensity = light ? 0.08 : 0.3;
    toColor(brand, pillarMat.emissive);
    pillarMat.emissiveIntensity = light ? 0.05 : 0.18;
    mixColor(brand, accent, 0.35, gridMat.color);
    gridMat.blending = light ? NormalBlending : AdditiveBlending;
    gridMat.opacity = light ? 0.35 : 0.28;
    gridMat.needsUpdate = true;
    for (const mat of [wordMat, bitMat]) {
      toColor(accent, mat.color);
      mat.blending = light ? NormalBlending : AdditiveBlending;
      mat.needsUpdate = true;
    }
    setColorAt(marker.color, 0, toColor(accent, tmp));
    marker.color.needsUpdate = true;
    marker.setLight(light, light ? 0.9 : 1);
    motes.setTheme(palette);
    key.intensity = light ? 2.5 : 2.2;
    scene.environmentIntensity = light ? 1.1 : 0.8;
  };
  applyTheme();

  const m4 = new Matrix4();
  const q = new Quaternion();
  const pos = new Vector3();
  const scl = new Vector3();

  return {
    update(_dt: number, time: number, input: SceneInput) {
      const u = exit(input);
      root.rotation.set(0.58 + input.pointerY * 0.08, -0.62 + 0.08 * Math.sin(time * 0.25) + input.pointerX * 0.15, 0);
      root.position.y = 0.15 - u * 0.5;

      /* The open wordline travels row to row; each pass reads one column. */
      const travel = time * SWEEP;
      const rowPos = travel % rows;
      const pass = Math.floor(travel / rows);
      const col = picks[pass % picks.length] % cols;
      /* The bitline comes up and dies away within a pass, so the column never jumps while lit. */
      const sense = Math.sin(Math.PI * (rowPos / rows));
      /* The open wordline fades out before it wraps back to the first row. */
      const edge = Math.min(1, Math.max(0, Math.min(rowPos + 0.5, rows - 0.5 - rowPos) * 2));

      for (let r = 0; r < rows; r++) {
        const glow = Math.max(0, 1 - Math.abs(rowPos - r));
        for (let c = 0; c < cols; c++) {
          const i = r * cols + c;
          const reading = c === col ? glow * sense : 0;
          pos.set(x0 + c * STEP, FLOOR + PILLAR / 2, z0 + r * STEP);
          m4.compose(pos, q, scl.set(1, 1, 1));
          pillars.setMatrixAt(i, m4);
          pillars.setColorAt(i, tmp.copy(idle).lerp(open, glow * 0.9));

          const lift = 1 + 0.14 * reading;
          pos.y = FLOOR + PILLAR + (CAP * lift) / 2;
          m4.compose(pos, q, scl.set(1, lift, 1));
          caps.setMatrixAt(i, m4);
          tmp.copy(charged[i] ? full : idle).lerp(open, Math.max(glow * 0.35, reading));
          caps.setColorAt(i, tmp);
        }
      }
      for (const mesh of [pillars, caps]) {
        mesh.instanceMatrix.needsUpdate = true;
        if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
      }

      word.position.z = z0 + rowPos * STEP;
      wordMat.opacity = (palette.light ? 0.95 : 0.9) * edge;
      bit.position.x = x0 + col * STEP;
      bitMat.opacity = (palette.light ? 0.95 : 0.9) * sense;
      marker.position.setXYZ(0, x0 + col * STEP, FLOOR + PILLAR + CAP + 0.16, z0 + rowPos * STEP);
      marker.position.needsUpdate = true;
      marker.points.visible = sense * edge > 0.05;
    },
    setTheme(next: Palette) {
      palette = next;
      applyTheme();
    },
    resize(view: Viewport) {
      frameSubject(camera, view, 2.75);
      marker.setPointScale(view.pointScale);
      motes.setPointScale(view.pointScale);
    },
    dispose() {
      scene.remove(root);
      disposeTree(root);
    },
  };
}

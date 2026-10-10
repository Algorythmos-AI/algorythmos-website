/**
 * dash-terrain — SQL dashboards.
 *
 * A field of bars standing on a grid, their heights rolling like a query result
 * being refreshed; one row is picked out as the series in focus, and a trend
 * line rides above the field. Charts, given depth.
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
  Line,
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

export const stillAt = 4;

const GRID: Record<Tier, { cols: number; rows: number; motes: number }> = {
  high: { cols: 14, rows: 8, motes: 260 },
  medium: { cols: 12, rows: 7, motes: 180 },
  low: { cols: 10, rows: 6, motes: 110 },
};
const STEP = 0.3;
const FLOOR = -0.85;

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

  const barMat = new MeshStandardMaterial({ metalness: 0.7, roughness: 0.28 });
  const bars = new InstancedMesh(new BoxGeometry(STEP * 0.62, 1, STEP * 0.62), barMat, cols * rows);
  bars.frustumCulled = false;
  root.add(bars);
  const x0 = (-(cols - 1) * STEP) / 2;
  const z0 = (-(rows - 1) * STEP) / 2;
  const bias = new Float32Array(cols * rows);
  for (let i = 0; i < bias.length; i++) bias[i] = rng();
  const focusRow = Math.floor(rows / 2);

  /* The grid the bars stand on. */
  const lines: number[] = [];
  const hx = (cols * STEP) / 2 + 0.2;
  const hz = (rows * STEP) / 2 + 0.2;
  for (let c = 0; c <= cols; c += 2) lines.push(x0 - STEP / 2 + c * STEP, FLOOR, -hz, x0 - STEP / 2 + c * STEP, FLOOR, hz);
  for (let r = 0; r <= rows; r += 2) lines.push(-hx, FLOOR, z0 - STEP / 2 + r * STEP, hx, FLOOR, z0 - STEP / 2 + r * STEP);
  const gridGeo = new BufferGeometry();
  gridGeo.setAttribute('position', new BufferAttribute(new Float32Array(lines), 3));
  const gridMat = new LineBasicMaterial({ transparent: true, depthWrite: false });
  root.add(new LineSegments(gridGeo, gridMat));

  /* The trend line over the focus row, with a marker on each point. */
  const trendPos = new BufferAttribute(new Float32Array(cols * 3), 3);
  const trendGeo = new BufferGeometry();
  trendGeo.setAttribute('position', trendPos);
  const trendMat = new LineBasicMaterial({ transparent: true, depthWrite: false });
  const trend = new Line(trendGeo, trendMat);
  trend.frustumCulled = false;
  root.add(trend);
  const markers = createSoftPoints(cols, 0.16, 1);
  root.add(markers.points);

  const motes = createMotes(moteCount, rng);
  root.add(motes.points);

  const tmp = new Color();
  const low = new Color();
  const high = new Color();
  const applyTheme = () => {
    const { brand, accent, light } = palette;
    toColor(brand, low);
    toColor(accent, high);
    toColor(brand, barMat.emissive);
    barMat.emissiveIntensity = light ? 0.08 : 0.28;
    mixColor(brand, accent, 0.4, gridMat.color);
    gridMat.blending = light ? NormalBlending : AdditiveBlending;
    gridMat.opacity = light ? 0.4 : 0.3;
    gridMat.needsUpdate = true;
    toColor(accent, trendMat.color);
    trendMat.blending = light ? NormalBlending : AdditiveBlending;
    trendMat.opacity = light ? 0.95 : 0.9;
    trendMat.needsUpdate = true;
    for (let i = 0; i < cols; i++) setColorAt(markers.color, i, toColor(accent, tmp));
    markers.color.needsUpdate = true;
    markers.setLight(light, light ? 0.9 : 1);
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
      root.rotation.set(0.5 + input.pointerY * 0.08, -0.6 + 0.08 * Math.sin(time * 0.25) + input.pointerX * 0.15, 0);
      root.position.y = 0.2 - u * 0.5;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const i = r * cols + c;
          /* Two crossing waves plus each bar's own offset: a result set being refreshed. */
          const wave = 0.5 + 0.5 * Math.sin(c * 0.55 + time * 0.9 + r * 0.35) * Math.cos(r * 0.6 - time * 0.5);
          const h = 0.12 + (0.25 + 0.75 * bias[i]) * (0.35 + 0.95 * wave) * (r === focusRow ? 1.25 : 1);
          pos.set(x0 + c * STEP, FLOOR + h / 2, z0 + r * STEP);
          m4.compose(pos, q, scl.set(1, h, 1));
          bars.setMatrixAt(i, m4);
          tmp.copy(low).lerp(high, Math.min(1, h / 1.5));
          if (r !== focusRow) tmp.multiplyScalar(palette.light ? 1 : 0.7);
          bars.setColorAt(i, tmp);
          if (r === focusRow) {
            trendPos.setXYZ(c, pos.x, FLOOR + h + 0.28, pos.z);
            markers.position.setXYZ(c, pos.x, FLOOR + h + 0.28, pos.z);
          }
        }
      }
      bars.instanceMatrix.needsUpdate = true;
      if (bars.instanceColor) bars.instanceColor.needsUpdate = true;
      trendPos.needsUpdate = true;
      markers.position.needsUpdate = true;
    },
    setTheme(next: Palette) {
      palette = next;
      applyTheme();
    },
    resize(view: Viewport) {
      frameSubject(camera, view, 2.35);
      markers.setPointScale(view.pointScale);
      motes.setPointScale(view.pointScale);
    },
    dispose() {
      scene.remove(root);
      disposeTree(root);
    },
  };
}

/**
 * lost-satellite — the 404 page.
 *
 * One satellite adrift where there should be something else: tumbling slowly,
 * off the broken arc of the orbit it used to keep, sweeping a search beam across
 * an empty field of stars.
 */
import {
  AdditiveBlending,
  AmbientLight,
  Color,
  ConeGeometry,
  DirectionalLight,
  DoubleSide,
  Group,
  Mesh,
  MeshBasicMaterial,
  NormalBlending,
  TorusGeometry,
} from 'three';
import { disposeTree } from '../kit/dispose';
import { exit, frameSubject } from '../kit/frame';
import { createHologram } from '../kit/hologram';
import { mixColor, toColor } from '../kit/palette';
import { createSoftPoints, setColorAt } from '../kit/points';
import { createSatelliteKit } from '../kit/satellite';
import type { Tier } from '../tier';
import type { Palette, SceneContext, SceneInput, SceneInstance, Viewport } from '../types';

export const stillAt = 5;

const STARS: Record<Tier, number> = { high: 700, medium: 480, low: 260 };

export function create(ctx: SceneContext): SceneInstance {
  const { scene, camera, rng } = ctx;
  const starCount = STARS[ctx.tier];
  let palette = ctx.palette;

  camera.position.set(0, 0, 9);
  camera.lookAt(0, 0, 0);

  const root = new Group();
  scene.add(root);
  const key = new DirectionalLight(0xffffff, 2.4);
  key.position.set(-4, 3, 5);
  const fill = new AmbientLight(0xffffff, 0.28);
  root.add(key, fill);

  /* The satellite, large enough to read its bus, wings and dish. */
  const kit = createSatelliteKit();
  const drift = new Group();
  const sat = kit.make(3.4);
  drift.add(sat);
  root.add(drift);

  /* Its search beam: a long cone of scan lines from the dish. */
  const beam = createHologram(60);
  const cone = new Mesh(new ConeGeometry(0.5, 2.6, 40, 1, true), beam.material);
  cone.geometry.translate(0, -1.3, 0); // apex at the origin, opening away from it
  const sweep = new Group();
  sweep.position.y = 0.18;
  sweep.add(cone);
  drift.add(sweep);

  /* What is left of the orbit it lost: two arcs that no longer meet. */
  const arcMat = new MeshBasicMaterial({ transparent: true, depthWrite: false, side: DoubleSide });
  const arcs = new Group();
  for (const [start, length] of [
    [0.5, 1.5],
    [3.3, 2.1],
  ]) {
    const arc = new Mesh(new TorusGeometry(2.3, 0.006, 6, 96, length), arcMat);
    arc.rotation.z = start;
    arcs.add(arc);
  }
  arcs.rotation.set(1.15, 0.2, 0);
  arcs.scale.setScalar(0.62);
  root.add(arcs);

  /* How far to the side the satellite sits: as far as the mount is wide (set on resize). */
  let side = 2.4;
  let lift = 1.05;

  const stars = createSoftPoints(starCount, 0.07, 0.85);
  const starMix = new Float32Array(starCount);
  for (let i = 0; i < starCount; i++) {
    stars.position.setXYZ(i, (rng() * 2 - 1) * 5.5, (rng() * 2 - 1) * 3.6, -1 - rng() * 4.5);
    stars.scale.setX(i, 0.3 + Math.pow(rng(), 3) * 1.6);
    starMix[i] = rng();
  }
  stars.position.needsUpdate = true;
  stars.scale.needsUpdate = true;
  root.add(stars.points);

  const tmp = new Color();
  const applyTheme = () => {
    const { brand, accent, light } = palette;
    const blending = light ? NormalBlending : AdditiveBlending;
    mixColor(brand, accent, 0.25, kit.bus.color);
    toColor(brand, kit.bus.emissive);
    kit.bus.emissiveIntensity = light ? 0.08 : 0.22;
    toColor(accent, kit.wing.color);
    toColor(accent, kit.wing.emissive);
    kit.wing.emissiveIntensity = light ? 0.2 : 0.4;
    toColor(accent, beam.color);
    beam.setLight(light);
    mixColor(brand, accent, 0.4, arcMat.color);
    arcMat.blending = blending;
    arcMat.opacity = light ? 0.55 : 0.45;
    arcMat.needsUpdate = true;
    for (let i = 0; i < starCount; i++) setColorAt(stars.color, i, mixColor(brand, accent, starMix[i], tmp));
    stars.color.needsUpdate = true;
    stars.setLight(light, light ? 0.3 : 0.85);
    key.intensity = light ? 2.8 : 2.4;
    scene.environmentIntensity = light ? 1.2 : 0.8;
  };
  applyTheme();

  return {
    update(_dt: number, time: number, input: SceneInput) {
      const u = exit(input);
      root.rotation.set(input.pointerY * 0.1, input.pointerX * 0.14, 0);
      /* Adrift, up and to one side of the page's centred copy: a slow figure of eight,
         and a tumble on two axes at different rates. */
      drift.position.set(side + Math.sin(time * 0.17) * 0.45, lift + Math.sin(time * 0.34) * 0.22 - u * 0.5, 0);
      sat.rotation.set(0.5 + time * 0.11, time * 0.19, 0.3 + Math.sin(time * 0.13) * 0.4);
      sweep.rotation.set(0.9 + Math.sin(time * 0.5) * 0.7, time * 0.19, Math.cos(time * 0.37) * 0.6);
      beam.set(time, (palette.light ? 0.6 : 0.55) * (0.6 + 0.4 * Math.sin(time * 1.7)) * (1 - 0.6 * u));
      arcs.rotation.z = time * 0.03;
      stars.points.position.x = Math.sin(time * 0.05) * 0.2;
    },
    setTheme(next: Palette) {
      palette = next;
      applyTheme();
    },
    resize(view: Viewport) {
      frameSubject(camera, view, 2.6);
      side = Math.min(4.2, Math.max(1.2, 2.6 * view.aspect - 1.5));
      /* The orbit it lost stays round the satellite, clear of the page's centred copy
         on a wide hero; on a narrow one (the band under the copy) there is no copy to clear. */
      if (view.aspect < 1.6) side = 0;
      lift = view.aspect < 1.6 ? 0.1 : 1.05;
      arcs.position.set(side, view.aspect < 1.6 ? 0.1 : 1.0, -0.4);
      stars.setPointScale(view.pointScale);
    },
    dispose() {
      scene.remove(root);
      disposeTree(root);
    },
  };
}

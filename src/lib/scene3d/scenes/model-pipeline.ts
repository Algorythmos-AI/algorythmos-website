/**
 * model-pipeline — MLOps and model deployment.
 *
 * A line with three stations: build, test, release. Model artefacts ride a belt,
 * stop under each gantry while its head comes down to work on them, and leave a
 * little more finished each time; the last lifts off the line into production.
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
  LineBasicMaterial,
  LineSegments,
  Mesh,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  NormalBlending,
  TorusGeometry,
} from 'three';
import { disposeTree } from '../kit/dispose';
import { exit, frameSubject, smooth } from '../kit/frame';
import { createMotes } from '../kit/motes';
import { mixColor, toColor } from '../kit/palette';
import { createSoftPoints, setColorAt } from '../kit/points';
import type { Tier } from '../tier';
import type { Palette, SceneContext, SceneInput, SceneInstance, Viewport } from '../types';

export const stillAt = 5.2;

const STATIONS = [-1.3, 0, 1.3]; // x of each gantry
const BELT_Y = -0.62;
const START = -2.8;
const END = 2.2;
const CYCLE = 12; // seconds for one artefact to cross the line
const ARTEFACTS = 4;
const MOTES: Record<Tier, number> = { high: 280, medium: 190, low: 110 };

export function create(ctx: SceneContext): SceneInstance {
  const { scene, camera, rng } = ctx;
  let palette = ctx.palette;

  camera.position.set(0, 0, 9);
  camera.lookAt(0, 0, 0);
  const root = new Group();
  scene.add(root);
  const key = new DirectionalLight(0xffffff, 2.2);
  key.position.set(-3, 5, 4);
  const fill = new AmbientLight(0xffffff, 0.4);
  root.add(key, fill);

  const steelMat = new MeshStandardMaterial({ metalness: 1, roughness: 0.26 });
  const beltMat = new MeshPhysicalMaterial({ metalness: 0.4, roughness: 0.35, clearcoat: 0.6 });
  const headMat = new MeshStandardMaterial({ metalness: 1, roughness: 0.2 });

  /* The belt, and tick marks that travel along it. */
  const belt = new Mesh(new BoxGeometry(END - START + 0.6, 0.06, 0.72), beltMat);
  belt.position.set((START + END) / 2, BELT_Y - 0.03, 0);
  root.add(belt);
  const TICKS = 22;
  const tickPos = new BufferAttribute(new Float32Array(TICKS * 6), 3);
  const tickGeo = new BufferGeometry();
  tickGeo.setAttribute('position', tickPos);
  const tickMat = new LineBasicMaterial({ transparent: true, depthWrite: false });
  const ticks = new LineSegments(tickGeo, tickMat);
  ticks.frustumCulled = false;
  root.add(ticks);

  /* Three gantries: two posts, a beam, and a head on a rod. */
  const postGeo = new BoxGeometry(0.06, 1.25, 0.06);
  const beamGeo = new BoxGeometry(0.08, 0.08, 1.1);
  const rodGeo = new CylinderGeometry(0.02, 0.02, 0.5, 8);
  const headGeo = new CylinderGeometry(0.16, 0.1, 0.12, 20);
  const haloGeo = new TorusGeometry(0.2, 0.012, 8, 48);
  const heads = STATIONS.map((x) => {
    for (const z of [-0.5, 0.5]) {
      const post = new Mesh(postGeo, steelMat);
      post.position.set(x, BELT_Y + 0.6, z);
      root.add(post);
    }
    const beam = new Mesh(beamGeo, steelMat);
    beam.position.set(x, BELT_Y + 1.24, 0);
    root.add(beam);
    const head = new Group();
    const rod = new Mesh(rodGeo, steelMat);
    rod.position.y = 0.3;
    const tool = new Mesh(headGeo, headMat);
    const halo = new Mesh(haloGeo, headMat);
    halo.rotation.x = Math.PI / 2;
    halo.position.y = -0.08;
    head.add(rod, tool, halo);
    head.position.x = x;
    root.add(head);
    return head;
  });
  const sparks = createSoftPoints(STATIONS.length, 0.5, 1);
  STATIONS.forEach((x, i) => sparks.position.setXYZ(i, x, BELT_Y + 0.3, 0));
  sparks.position.needsUpdate = true;
  root.add(sparks.points);

  /* The artefacts: a six-sided body that gains a band at each station. */
  const bodyGeo = new CylinderGeometry(0.2, 0.2, 0.16, 6);
  const bandGeo = new TorusGeometry(0.215, 0.014, 8, 6);
  const artefacts = Array.from({ length: ARTEFACTS }, (_, i) => {
    const body = new MeshPhysicalMaterial({ metalness: 0.9, roughness: 0.2, flatShading: true });
    const group = new Group();
    group.add(new Mesh(bodyGeo, body));
    const bands = STATIONS.map((_, k) => {
      const band = new Mesh(bandGeo, headMat);
      band.rotation.x = Math.PI / 2;
      band.position.y = -0.05 + k * 0.05;
      group.add(band);
      return band;
    });
    root.add(group);
    return { group, body, bands, offset: i / ARTEFACTS };
  });

  const motes = createMotes(MOTES[ctx.tier], rng);
  root.add(motes.points);

  const raw = new Color();
  const done = new Color();
  const tmp = new Color();
  const applyTheme = () => {
    const { brand, accent, bg, light } = palette;
    mixColor(brand, accent, 0.25, steelMat.color);
    toColor(brand, steelMat.emissive);
    steelMat.emissiveIntensity = light ? 0.06 : 0.22;
    mixColor(bg, brand, light ? 0.18 : 0.28, beltMat.color);
    toColor(accent, headMat.color);
    toColor(accent, headMat.emissive);
    headMat.emissiveIntensity = light ? 0.3 : 0.6;
    mixColor(brand, bg, light ? 0.35 : 0.4, raw);
    mixColor(brand, accent, 0.75, done);
    mixColor(brand, accent, 0.5, tickMat.color);
    tickMat.blending = light ? NormalBlending : AdditiveBlending;
    tickMat.opacity = light ? 0.5 : 0.4;
    tickMat.needsUpdate = true;
    for (let i = 0; i < STATIONS.length; i++) setColorAt(sparks.color, i, toColor(accent, tmp));
    sparks.color.needsUpdate = true;
    sparks.setLight(light, light ? 0.8 : 1);
    motes.setTheme(palette);
    key.intensity = light ? 2.5 : 2.2;
    scene.environmentIntensity = light ? 1.2 : 0.9;
  };
  applyTheme();

  /* A crossing is cut into legs: travel, then dwell under a station, three times,
     then travel off and lift. `travelled` is how far along the line, 0…1. */
  const LEGS = STATIONS.length * 2 + 1;
  const stops = [START, ...STATIONS, END];
  const work = new Float32Array(STATIONS.length); // how hard each station is working, 0…1

  return {
    update(_dt: number, time: number, input: SceneInput) {
      const u = exit(input);
      root.rotation.set(0.45 + input.pointerY * 0.08, -0.5 + 0.06 * Math.sin(time * 0.3) + input.pointerX * 0.15, 0);
      root.position.set(0.2, 0.15 - u * 0.5, 0);

      work.fill(0);
      for (const a of artefacts) {
        const t = ((time / CYCLE + a.offset) % 1) * LEGS;
        const leg = Math.min(LEGS - 1, Math.floor(t));
        const f = t - leg;
        const station = Math.floor(leg / 2); // which stretch of belt this leg belongs to
        const dwelling = leg % 2 === 1;
        const x = dwelling ? stops[station + 1] : stops[station] + (stops[station + 1] - stops[station]) * smooth(f);
        const leaving = leg === LEGS - 1;
        a.group.position.set(x, BELT_Y + 0.08 + (leaving ? smooth(f) * 1.1 : 0), 0);
        a.group.rotation.y = leaving ? f * 2.5 : 0;
        a.group.scale.setScalar(Math.max(0.0001, (leg === 0 ? smooth(f * 3) : 1) * (leaving ? 1 - smooth((f - 0.6) / 0.4) : 1)));
        if (dwelling) work[station] = Math.sin(f * Math.PI);
        /* Stations passed so far, counting the one in progress by how far through it is. */
        const finished = Math.min(STATIONS.length, station + (dwelling ? f : 0));
        a.bands.forEach((band, k) => band.scale.setScalar(Math.max(0.0001, smooth(finished - k))));
        a.body.color.copy(raw).lerp(done, finished / STATIONS.length);
      }
      heads.forEach((head, i) => {
        head.position.y = BELT_Y + 0.95 - work[i] * 0.55;
        head.rotation.y = time + work[i] * 2;
        sparks.scale.setX(i, work[i] * (0.8 + 0.4 * Math.sin(time * 12 + i))); // under two pulses a second
      });
      sparks.scale.needsUpdate = true;

      const span = END - START + 0.6;
      for (let i = 0; i < TICKS; i++) {
        const x = START - 0.3 + ((i / TICKS + time * 0.04) % 1) * span;
        tickPos.setXYZ(i * 2, x, BELT_Y + 0.004, -0.34);
        tickPos.setXYZ(i * 2 + 1, x, BELT_Y + 0.004, 0.34);
      }
      tickPos.needsUpdate = true;
    },
    setTheme(next: Palette) {
      palette = next;
      applyTheme();
    },
    resize(view: Viewport) {
      frameSubject(camera, view, 2.55);
      sparks.setPointScale(view.pointScale);
      motes.setPointScale(view.pointScale);
    },
    dispose() {
      scene.remove(root);
      disposeTree(root);
    },
  };
}

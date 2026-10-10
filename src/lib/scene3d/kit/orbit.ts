import { Group, type Object3D } from 'three';
import { createSoftPoints, type SoftPoints } from './points';

/**
 * A tilted circular orbit carrying bodies with comet trails — the agents of the
 * neural core, the relay satellites of the globe, the services of the
 * constellation. Bodies travel in the group's XZ plane.
 */
export interface OrbitSpec {
  radius: number;
  tiltX: number;
  tiltZ: number;
  /** Radians per second; the sign is the direction. */
  speed: number;
}

export interface Orbit {
  group: Group;
  spec: OrbitSpec;
  trail: SoftPoints;
  /** Place the bodies for `time` and lay their trails behind them. */
  update(time: number): void;
  /** Angle of body `i` at `time`. */
  angleOf(i: number, time: number): number;
}

export function createOrbit(spec: OrbitSpec, bodies: Object3D[], trailLength: number, trailSize: number, phase = 0): Orbit {
  const group = new Group();
  group.rotation.set(spec.tiltX, 0, spec.tiltZ);
  for (const body of bodies) group.add(body);
  const trail = createSoftPoints(Math.max(1, bodies.length * trailLength), trailSize, 1);
  group.add(trail.points);
  const step = 0.045 * Math.sign(spec.speed || 1);
  const angleOf = (i: number, time: number) => phase + (i / bodies.length) * Math.PI * 2 + time * spec.speed;
  return {
    group,
    spec,
    trail,
    angleOf,
    update(time) {
      for (let i = 0; i < bodies.length; i++) {
        const angle = angleOf(i, time);
        bodies[i].position.set(Math.cos(angle) * spec.radius, 0, Math.sin(angle) * spec.radius);
        for (let k = 0; k < trailLength; k++) {
          const back = angle - step * (k + 1);
          const n = i * trailLength + k;
          trail.position.setXYZ(n, Math.cos(back) * spec.radius, 0, Math.sin(back) * spec.radius);
          trail.scale.setX(n, k === 0 ? 1.7 : Math.pow(1 - k / trailLength, 1.3));
        }
      }
      trail.position.needsUpdate = true;
      trail.scale.needsUpdate = true;
    },
  };
}

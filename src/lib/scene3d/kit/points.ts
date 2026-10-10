import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Color,
  NormalBlending,
  Points,
  ShaderMaterial,
} from 'three';

/**
 * Soft round points with perspective size and a per-point colour and scale —
 * the glow sprites of the scenes (dust, signals, trails). One draw call each.
 *
 * Dark theme: additive, so overlapping points bloom. Light theme: additive
 * light is invisible on a pale page, so the same points are drawn as ink.
 */
const VERT = /* glsl */ `
  attribute float aScale;
  attribute vec3 aColor;
  uniform float uSize;
  uniform float uScale;
  varying vec3 vColor;
  varying float vFade;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * aScale * uScale / max(-mv.z, 0.001);
    vColor = aColor;
    vFade = 1.0 - smoothstep(5.0, 14.0, -mv.z);
  }
`;
const FRAG = /* glsl */ `
  uniform float uOpacity;
  uniform float uCore;
  uniform float uHalo;
  varying vec3 vColor;
  varying float vFade;
  void main() {
    float d = length(gl_PointCoord - 0.5) * 2.0;
    if (d > 1.0) discard;
    float halo = pow(1.0 - d, 2.2);
    float core = smoothstep(uCore, 0.0, d);
    gl_FragColor = vec4(vColor * (0.55 + 0.9 * core), (halo * uHalo + core * 0.6) * uOpacity * vFade);
    #include <colorspace_fragment>
  }
`;

export interface SoftPoints {
  points: Points<BufferGeometry, ShaderMaterial>;
  position: BufferAttribute;
  color: BufferAttribute;
  scale: BufferAttribute;
  /** Switch between glow (dark theme) and ink (light theme). */
  setLight(light: boolean, opacity: number): void;
  /** Viewport.pointScale — keeps `size` meaning world units at any canvas size. */
  setPointScale(scale: number): void;
}

/** `size` is the point's diameter in world units. */
export function createSoftPoints(count: number, size: number, opacity: number): SoftPoints {
  const geometry = new BufferGeometry();
  const position = new BufferAttribute(new Float32Array(count * 3), 3);
  const color = new BufferAttribute(new Float32Array(count * 3), 3);
  const scale = new BufferAttribute(new Float32Array(count).fill(1), 1);
  geometry.setAttribute('position', position);
  geometry.setAttribute('aColor', color);
  geometry.setAttribute('aScale', scale);
  const material = new ShaderMaterial({
    vertexShader: VERT,
    fragmentShader: FRAG,
    uniforms: {
      uSize: { value: size },
      uScale: { value: 1 },
      uOpacity: { value: opacity },
      uCore: { value: 0.35 },
      uHalo: { value: 1 },
    },
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
  });
  const points = new Points(geometry, material);
  points.frustumCulled = false; // positions are rewritten every frame; the bounding sphere would go stale
  return {
    points,
    position,
    color,
    scale,
    setLight(light, value) {
      material.blending = light ? NormalBlending : AdditiveBlending;
      material.uniforms.uOpacity.value = value;
      /* A halo adds light on a dark page; as ink on a pale one it only smudges. */
      material.uniforms.uHalo.value = light ? 0.3 : 1;
      material.needsUpdate = true;
    },
    setPointScale(value) {
      material.uniforms.uScale.value = value;
    },
  };
}

/** Write a Color into a colour attribute at index i. */
export function setColorAt(attr: BufferAttribute, i: number, c: Color): void {
  attr.setXYZ(i, c.r, c.g, c.b);
}

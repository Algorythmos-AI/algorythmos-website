import { AdditiveBlending, Color, DoubleSide, NormalBlending, ShaderMaterial } from 'three';

/**
 * A holographic pane: fine horizontal scan lines, a soft edge, and one brighter
 * band travelling across it. For scan planes and AR-style overlays. Give it to
 * a PlaneGeometry; `uv.y` runs along the direction of travel.
 */
const VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
const FRAG = /* glsl */ `
  uniform vec3 uColor;
  uniform float uTime;
  uniform float uOpacity;
  uniform float uLines;
  varying vec2 vUv;
  void main() {
    float lines = 0.55 + 0.45 * sin(vUv.y * uLines + uTime * 3.0);
    float edge = smoothstep(0.0, 0.08, vUv.x) * smoothstep(1.0, 0.92, vUv.x) * smoothstep(0.0, 0.1, vUv.y) * smoothstep(1.0, 0.9, vUv.y);
    float band = smoothstep(0.12, 0.0, abs(fract(vUv.y - uTime * 0.25) - 0.5));
    gl_FragColor = vec4(uColor * (0.7 + 0.6 * band), (0.16 * lines + 0.3 * band) * edge * uOpacity);
    #include <colorspace_fragment>
  }
`;

export interface Hologram {
  material: ShaderMaterial;
  color: Color;
  set(time: number, opacity: number): void;
  setLight(light: boolean): void;
}

export function createHologram(lines = 90): Hologram {
  const color = new Color();
  const material = new ShaderMaterial({
    vertexShader: VERT,
    fragmentShader: FRAG,
    uniforms: { uColor: { value: color }, uTime: { value: 0 }, uOpacity: { value: 1 }, uLines: { value: lines } },
    transparent: true,
    depthWrite: false,
    side: DoubleSide,
    blending: AdditiveBlending,
  });
  return {
    material,
    color,
    set(time, opacity) {
      material.uniforms.uTime.value = time;
      material.uniforms.uOpacity.value = opacity;
    },
    setLight(light) {
      material.blending = light ? NormalBlending : AdditiveBlending;
      material.needsUpdate = true;
    },
  };
}

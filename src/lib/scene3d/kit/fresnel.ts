import { AdditiveBlending, Color, NormalBlending, ShaderMaterial, type Side, FrontSide } from 'three';

/**
 * A rim-lit shell: bright where the surface turns away from the camera, with slow
 * bands of two hues drifting across it. Used for energy shells, atmospheres and
 * force fields. `setLight` swaps additive glow (dark theme) for a translucent
 * tint (light theme), where added light would be invisible.
 */
const VERT = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vView;
  varying vec3 vPos;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vNormal = normalize(normalMatrix * normal);
    vView = normalize(-mv.xyz);
    vPos = position;
    gl_Position = projectionMatrix * mv;
  }
`;
const FRAG = /* glsl */ `
  uniform vec3 uA;
  uniform vec3 uB;
  uniform float uTime;
  uniform float uOpacity;
  uniform float uInk;
  uniform float uPower;
  uniform float uBands;
  varying vec3 vNormal;
  varying vec3 vView;
  varying vec3 vPos;
  void main() {
    float rim = pow(1.0 - abs(dot(normalize(vNormal), normalize(vView))), uPower);
    float band = 0.5 + 0.5 * sin(vPos.y * uBands + uTime * 0.9 + sin(vPos.x * uBands * 0.7 + uTime * 0.6) * 1.6);
    vec3 col = mix(uA, uB, band);
    float glow = mix(0.10 + 1.15 * rim, 0.04 + 0.85 * rim, uInk);
    gl_FragColor = vec4(col * mix(1.0 + rim, 1.0, uInk), glow * uOpacity);
    #include <colorspace_fragment>
  }
`;

export interface FresnelOptions {
  /** Rim falloff: higher hugs the silhouette more tightly. */
  power?: number;
  /** Band frequency across the shell; 0 for a plain two-tone rim. */
  bands?: number;
  side?: Side;
}

export interface Fresnel {
  material: ShaderMaterial;
  /** Colours in the renderer's working space (kit/palette toColor). */
  a: Color;
  b: Color;
  set(time: number, opacity: number): void;
  setLight(light: boolean): void;
}

export function createFresnel({ power = 2.4, bands = 5, side = FrontSide }: FresnelOptions = {}): Fresnel {
  const a = new Color();
  const b = new Color();
  const material = new ShaderMaterial({
    vertexShader: VERT,
    fragmentShader: FRAG,
    uniforms: {
      uA: { value: a },
      uB: { value: b },
      uTime: { value: 0 },
      uOpacity: { value: 1 },
      uInk: { value: 0 },
      uPower: { value: power },
      uBands: { value: bands },
    },
    transparent: true,
    depthWrite: false,
    side,
    blending: AdditiveBlending,
  });
  return {
    material,
    a,
    b,
    set(time, opacity) {
      material.uniforms.uTime.value = time;
      material.uniforms.uOpacity.value = opacity;
    },
    setLight(light) {
      material.uniforms.uInk.value = light ? 1 : 0;
      material.blending = light ? NormalBlending : AdditiveBlending;
      material.needsUpdate = true;
    },
  };
}

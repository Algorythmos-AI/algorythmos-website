/**
 * Contract between the engine and a scene. Types only — importing this file
 * never pulls three into a chunk.
 */
import type { PerspectiveCamera, Scene, Texture, WebGLRenderer } from 'three';
import type { RGB } from '@/lib/tokens';
import type { Tier } from './tier';

/** The live theme, read off the CSS tokens. Scenes never hard-code a colour. */
export interface Palette {
  brand: RGB;
  accent: RGB;
  bg: RGB;
  text: RGB;
  /** Light theme: additive glow is invisible on a pale page, so scenes switch to solid inks. */
  light: boolean;
}

/** Per-frame input, already eased by the engine. */
export interface SceneInput {
  /** Pointer offset from the viewport centre, -1…1. Zero on touch devices. */
  pointerX: number;
  pointerY: number;
  /** 0 with the mount at rest, 1 once it has scrolled out of the top of the viewport. */
  scroll: number;
}

/** The drawing surface, passed on every resize. */
export interface Viewport {
  /** width / height */
  aspect: number;
  /** Drawing-buffer pixels per world unit at distance 1 — multiplies point-sprite sizes. */
  pointScale: number;
}

export interface SceneContext {
  renderer: WebGLRenderer;
  scene: Scene;
  camera: PerspectiveCamera;
  tier: Tier;
  palette: Palette;
  variant: string | undefined;
  /** Image-based lighting shared by every scene (procedural — no HDRI files). */
  environment: Texture;
  /** Seeded, so a scene lays itself out identically on every visit and in its still. */
  rng: () => number;
}

export interface SceneInstance {
  /** Advance to `time` seconds (dt since the last call). Must be deterministic in `time` for stills. */
  update(dt: number, time: number, input: SceneInput): void;
  /** The theme toggled. */
  setTheme(palette: Palette): void;
  /** The mount changed size or the pixel ratio stepped down. Called once before the first frame. */
  resize(view: Viewport): void;
  /** Free everything this scene created on the GPU. */
  dispose(): void;
}

export interface SceneModule {
  /** Seconds into the scene at which its still image is captured. */
  stillAt: number;
  create(ctx: SceneContext): SceneInstance;
}

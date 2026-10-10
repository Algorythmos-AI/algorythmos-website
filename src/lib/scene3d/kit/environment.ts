import { PMREMGenerator, type Texture, type WebGLRenderer } from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

/**
 * Image-based lighting for metal and glass, generated in code: a small studio
 * "room" pre-filtered once per renderer. No HDRI download, nothing the CSP
 * would have to allow. Shared by every scene — never dispose it from a scene.
 */
const cache = new WeakMap<WebGLRenderer, Texture>();

export function getEnvironment(renderer: WebGLRenderer): Texture {
  const hit = cache.get(renderer);
  if (hit) return hit;
  const pmrem = new PMREMGenerator(renderer);
  const room = new RoomEnvironment();
  const texture = pmrem.fromScene(room, 0.04).texture;
  texture.userData.shared = true;
  room.dispose();
  pmrem.dispose();
  cache.set(renderer, texture);
  return texture;
}

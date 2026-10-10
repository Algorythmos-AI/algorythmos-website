import type { Material, Object3D, Texture } from 'three';

type Disposable = { dispose(): void };
const isShared = (t: Texture) => t.userData?.shared === true;

function disposeMaterial(material: Material): void {
  for (const value of Object.values(material)) {
    const tex = value as Texture | null;
    if (tex && (tex as { isTexture?: boolean }).isTexture && !isShared(tex)) tex.dispose();
  }
  const uniforms = (material as { uniforms?: Record<string, { value: unknown }> }).uniforms;
  if (uniforms) {
    for (const u of Object.values(uniforms)) {
      const tex = u.value as Texture | null;
      if (tex && (tex as { isTexture?: boolean }).isTexture && !isShared(tex)) tex.dispose();
    }
  }
  material.dispose();
}

/**
 * Free every geometry, material and texture under `root`. Scenes call this from
 * dispose() so nothing accumulates on the GPU across in-site navigation.
 * Textures flagged `userData.shared` (the environment map) are left alone.
 */
export function disposeTree(root: Object3D): void {
  root.traverse((obj) => {
    const mesh = obj as Object3D & { geometry?: Disposable; material?: Material | Material[] };
    mesh.geometry?.dispose();
    if (Array.isArray(mesh.material)) mesh.material.forEach(disposeMaterial);
    else if (mesh.material) disposeMaterial(mesh.material);
    (obj as Object3D & Partial<Disposable>).dispose?.(); // InstancedMesh frees its instance buffers
  });
  root.clear();
}

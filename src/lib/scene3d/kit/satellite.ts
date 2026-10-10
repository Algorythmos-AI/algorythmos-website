import { BoxGeometry, CylinderGeometry, Group, Mesh, MeshStandardMaterial, SphereGeometry } from 'three';

/**
 * A small relay satellite: a bus, two solar wings and a dish. Built from shared
 * geometry so a scene can fly several for a few draw calls. Colour the two
 * materials from the palette in the scene's theme pass.
 */
export interface SatelliteKit {
  bus: MeshStandardMaterial;
  wing: MeshStandardMaterial;
  /** A new satellite; `size` 1 is about 0.3 world units across the wings. */
  make(size?: number): Group;
}

export function createSatelliteKit(): SatelliteKit {
  const bus = new MeshStandardMaterial({ metalness: 1, roughness: 0.22 });
  const wing = new MeshStandardMaterial({ metalness: 0.9, roughness: 0.3 });
  const busGeo = new BoxGeometry(0.075, 0.06, 0.06);
  const wingGeo = new BoxGeometry(0.15, 0.004, 0.055);
  const armGeo = new CylinderGeometry(0.004, 0.004, 0.05, 6);
  const dishGeo = new SphereGeometry(0.03, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2.4);
  return {
    bus,
    wing,
    make(size = 1) {
      const sat = new Group();
      sat.add(new Mesh(busGeo, bus));
      for (const x of [-0.115, 0.115]) {
        const panel = new Mesh(wingGeo, wing);
        panel.position.x = x;
        sat.add(panel);
        const arm = new Mesh(armGeo, bus);
        arm.rotation.z = Math.PI / 2;
        arm.position.x = x * 0.5;
        sat.add(arm);
      }
      const dish = new Mesh(dishGeo, bus);
      dish.position.y = 0.045;
      dish.rotation.x = Math.PI;
      sat.add(dish);
      sat.scale.setScalar(size);
      return sat;
    },
  };
}

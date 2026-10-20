import { useMemo } from "react";
import { DoubleSide, PlaneGeometry } from "three";
import { surface } from "../../shared/lib/textures";
export function TableCloth() {
  const [geometry, material] = useMemo(() => {
    const g = new PlaneGeometry(1.48, 2.27, 36, 52);
    const p = g.attributes.position;
    for (let i = 0; i < p.count; i++) {
      const u = p.getX(i),
        v = p.getY(i);
      const dx = Math.max(0, Math.abs(u) - 0.56),
        dz = Math.max(0, Math.abs(v) - 0.95);
      const drop = Math.sqrt(dx * dx + dz * dz);
      const fold = Math.sin(u * 63 + v * 38) * 0.006 * Math.min(1, drop * 15);
      const x = Math.max(-0.56, Math.min(0.56, u)) + Math.sign(u) * dx * 0.22;
      const z = Math.max(-0.95, Math.min(0.95, v)) + Math.sign(v) * dz * 0.22;
      p.setXYZ(
        i,
        x + fold,
        0.814 - drop * 0.96 + Math.sin(u * 23) * Math.sin(v * 17) * 0.0013,
        z + fold,
      );
    }
    g.computeVertexNormals();
    const material = surface("cloth", "#dedccc").clone();
    material.side = DoubleSide;
    return [g, material];
  }, []);
  return (
    <mesh geometry={geometry} material={material} castShadow receiveShadow />
  );
}

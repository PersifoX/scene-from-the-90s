import { useMemo } from "react";
import {
  CatmullRomCurve3,
  LatheGeometry,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  TubeGeometry,
  Vector2,
  Vector3,
} from "three";
import { Ball, Cylinder } from "../../shared/ui/Geometry";
const bronze = new MeshStandardMaterial({
  color: "#867452",
  metalness: 0.72,
  roughness: 0.36,
});
const glass = new MeshPhysicalMaterial({
  color: "#e2dfd2",
  roughness: 0.47,
  clearcoat: 0.28,
  side: 2,
  emissive: "#ffe9c5",
  emissiveIntensity: 0.7,
});
const tulip = new LatheGeometry(
  [
    [0.028, 0],
    [0.036, 0.025],
    [0.045, 0.07],
    [0.062, 0.13],
    [0.082, 0.185],
    [0.085, 0.2],
    [0.079, 0.202],
    [0.072, 0.182],
    [0.052, 0.13],
    [0.036, 0.065],
    [0.024, 0.02],
  ].map((p) => new Vector2(...(p as [number, number]))),
  24,
);
const p = tulip.attributes.position;
for (let i = 0; i < p.count; i++) {
  const x = p.getX(i),
    y = p.getY(i),
    z = p.getZ(i),
    a = Math.atan2(z, x);
  const flare = Math.max(0, (y - 0.12) / 0.082);
  p.setXYZ(
    i,
    x * (1 + Math.cos(a * 6) * 0.07 * flare),
    y + Math.cos(a * 6) * 0.013 * flare,
    z * (1 + Math.cos(a * 6) * 0.07 * flare),
  );
}
tulip.computeVertexNormals();
function Arm({ angle }: { angle: number }) {
  const geometry = useMemo(
    () =>
      new TubeGeometry(
        new CatmullRomCurve3([
          new Vector3(0, -0.04, 0),
          new Vector3(0.12, -0.045, 0),
          new Vector3(0.19, -0.19, 0),
          new Vector3(0.3, -0.2, 0),
          new Vector3(0.365, -0.1, 0),
          new Vector3(0.35, 0.09, 0),
        ]),
        28,
        0.007,
        7,
        false,
      ),
    [],
  );
  return (
    <group rotation={[0, angle, 0]}>
      <mesh geometry={geometry} material={bronze} castShadow />
      <Cylinder
        position={[0.35, 0.092, 0]}
        radius={0.039}
        height={0.034}
        material={bronze}
      />
      <mesh
        position={[0.35, 0.11, 0]}
        geometry={tulip}
        material={glass}
        castShadow
      />
      <Ball position={[0.35, 0.158, 0]} radius={0.025} color="#fff0cf" />
    </group>
  );
}
export function Chandelier() {
  return (
    <group position={[-0.12, 2.35, 0.05]}>
      <Cylinder
        position={[0, 0.23, 0]}
        radius={0.008}
        height={0.29}
        material={bronze}
      />
      <Cylinder
        position={[0, 0.362, 0]}
        radius={0.068}
        height={0.018}
        material={bronze}
      />
      <Ball position={[0, -0.045, 0]} radius={0.085} color="#8b7d5c" />
      <Cylinder
        position={[0, -0.04, 0]}
        radius={0.108}
        height={0.018}
        material={bronze}
      />
      <Ball position={[0, -0.125, 0]} radius={0.025} color="#8b7d5c" />
      {Array.from({ length: 5 }, (_, i) => (
        <Arm key={i} angle={(i * Math.PI * 2) / 5 + 0.3} />
      ))}
    </group>
  );
}

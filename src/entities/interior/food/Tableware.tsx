import { LatheGeometry, TorusGeometry, Vector2 } from "three";
import { Box, Cylinder } from "../../../shared/ui/Geometry";
import { foodGeometry } from "./FoodGeometry";
import { foodMaterials as m } from "./FoodMaterials";
const glass = new LatheGeometry(
  [
    [0.027, 0],
    [0.033, 0.005],
    [0.037, 0.109],
    [0.034, 0.112],
    [0.031, 0.01],
    [0.027, 0.008],
  ].map((p) => new Vector2(...(p as [number, number]))),
  16,
);
const glassRim = new TorusGeometry(0.0355, 0.0012, 5, 32);
const bottle = new LatheGeometry(
  [
    [0, 0],
    [0.036, 0],
    [0.04, 0.012],
    [0.04, 0.15],
    [0.036, 0.177],
    [0.017, 0.201],
    [0.013, 0.249],
    [0.016, 0.254],
    [0.016, 0.264],
    [0, 0.264],
  ].map((p) => new Vector2(...(p as [number, number]))),
  24,
);
export function TeaGlass() {
  return (
    <group>
      <mesh geometry={glass} material={m.glass} />
      <Cylinder
        position={[0, 0.039, 0]}
        radius={0.031}
        height={0.067}
        material={m.tea}
        segments={24}
      />
      <mesh
        geometry={glassRim}
        position={[0, 0.11, 0]}
        rotation={[Math.PI / 2, 0, 0]}
        material={m.glass}
      />
    </group>
  );
}
export function Cutlery() {
  return (
    <group rotation={[0, 0.04, 0]}>
      <Cylinder
        position={[0, 0.003, 0.032]}
        radius={0.0027}
        height={0.115}
        rotation={[Math.PI / 2, 0, 0]}
        material={m.metal}
        segments={8}
      />
      <mesh
        geometry={foodGeometry.grain}
        position={[0, 0.004, -0.035]}
        scale={[0.011, 0.003, 0.019]}
        material={m.metal}
      />
    </group>
  );
}
export function Lemonade() {
  return (
    <group>
      <mesh geometry={bottle} material={m.bottle} castShadow receiveShadow />
      <Cylinder
        position={[0, 0.267, 0]}
        radius={0.017}
        height={0.008}
        material={m.metal}
        segments={16}
      />
      <Box
        position={[0, 0.097, 0.039]}
        size={[0.045, 0.071, 0.002]}
        color="#cabc8d"
      />
      <Box
        position={[0, 0.099, 0.0405]}
        size={[0.027, 0.004, 0.001]}
        color="#728050"
      />
      <Box
        position={[0, 0.087, 0.0405]}
        size={[0.031, 0.002, 0.001]}
        color="#728050"
      />
    </group>
  );
}

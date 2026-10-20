import { useMemo } from "react";
import {
  LatheGeometry,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  TorusGeometry,
  Vector2,
} from "three";
import { foodGeometry, Scatter, type ScatterPiece } from "./FoodGeometry";
import { foodMaterials, seeded } from "./FoodMaterials";

// A deep serving bowl with a foot, curved inner wall and a rolled porcelain lip.
const bowl = new LatheGeometry(
  [
    [0, 0],
    [0.059, 0],
    [0.066, 0.005],
    [0.067, 0.012],
    [0.079, 0.019],
    [0.101, 0.034],
    [0.122, 0.06],
    [0.137, 0.088],
    [0.148, 0.104],
    [0.149, 0.109],
    [0.146, 0.113],
    [0.14, 0.114],
    [0.137, 0.109],
    [0.13, 0.095],
    [0.12, 0.072],
    [0.102, 0.047],
    [0.079, 0.031],
    [0.05, 0.024],
    [0, 0.024],
  ].map(([r, y]) => new Vector2(r, y)),
  64,
);
const rim = new TorusGeometry(0.145, 0.0014, 6, 64);
const band = new TorusGeometry(0.136, 0.0009, 5, 64);
const fillMaterial = new MeshStandardMaterial({
  color: "#c9c6b4",
  roughness: 0.85,
});
const marmaladeMaterial = new MeshPhysicalMaterial({
  roughness: 0.4,
  clearcoat: 0.45,
  clearcoatRoughness: 0.3,
});
const RADIUS = 0.127;
function riceHeight(x: number, z: number) {
  const radiusSquared = (x * x + z * z) / RADIUS ** 2;
  return (
    0.102 + 0.024 * (1 - radiusSquared) + Math.sin(x * 75 + z * 36) * 0.0012
  );
}
// The solid interior remains below the grain layer and inside the bowl.
const fill = new LatheGeometry(
  [
    [0, 0.029],
    [0.078, 0.035],
    [0.112, 0.072],
    ...Array.from({ length: 17 }, (_, i) => {
      const r = RADIUS * (1 - i / 16);
      return [r, riceHeight(r, 0) - 0.003];
    }),
  ].map(([r, y]) => new Vector2(r, y)),
  64,
);

export function Kutya() {
  const { grains, marmalade, sugar } = useMemo(() => {
    const random = seeded(93);
    const grains: ScatterPiece[] = [];
    const marmalade: ScatterPiece[] = [];
    const sugar: ScatterPiece[] = [];
    const riceColors = ["#e5e1cf", "#efeadd", "#dad6c5", "#e7e4d7"];
    const count = 3200;
    for (let i = 0; i < count; i++) {
      // Even coverage with small irregularities, rather than a sparse dusting.
      const angle = i * 2.3999632297 + (random() - 0.5) * 0.24;
      const radius = Math.sqrt((i + 0.5) / count) * RADIUS;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const size = 0.83 + random() * 0.32;
      grains.push({
        position: [x, riceHeight(x, z) + random() * 0.002, z],
        scale: [0.0018 * size, 0.0014 * size, 0.0047 * size],
        rotation: [
          (random() - 0.5) * 0.5,
          random() * Math.PI * 2,
          (random() - 0.5) * 0.4,
        ],
        color: riceColors[i % riceColors.length],
      });
    }
    const candyColors = ["#bd7036", "#ad5141", "#7b874a", "#c4ac56"];
    for (let i = 0; i < 17; i++) {
      const angle = i * 2.3999632297;
      const radius = Math.sqrt((i + 0.5) / 17) * 0.105;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const height = 0.011 + random() * 0.005;
      const width = 0.012 + random() * 0.006;
      const y = riceHeight(x, z) + height * 0.4;
      marmalade.push({
        position: [x, y, z],
        scale: [width, height, width * (0.8 + random() * 0.4)],
        rotation: [0.08, random() * Math.PI, -0.06],
        color: candyColors[i % candyColors.length],
      });
      for (let j = 0; j < 11; j++) {
        sugar.push({
          position: [
            x + (random() - 0.5) * width * 0.8,
            y + height * 0.52,
            z + (random() - 0.5) * width * 0.72,
          ],
          scale: [0.0007, 0.0006, 0.0007],
          rotation: [random(), random(), random()],
        });
      }
    }
    return { grains, marmalade, sugar };
  }, []);
  return (
    <group>
      <mesh
        geometry={bowl}
        material={foodMaterials.ceramic}
        castShadow
        receiveShadow
      />
      <mesh
        geometry={rim}
        material={foodMaterials.rim}
        position={[0, 0.112, 0]}
        rotation={[Math.PI / 2, 0, 0]}
        receiveShadow
      />
      <mesh
        geometry={band}
        material={foodMaterials.rim}
        position={[0, 0.087, 0]}
        rotation={[Math.PI / 2, 0, 0]}
        receiveShadow
      />
      <mesh geometry={fill} material={fillMaterial} receiveShadow />
      <Scatter
        geometry={foodGeometry.grain}
        material={foodMaterials.rice}
        pieces={grains}
      />
      <Scatter
        geometry={foodGeometry.dice}
        material={marmaladeMaterial}
        pieces={marmalade}
      />
      <Scatter
        geometry={foodGeometry.sugar}
        material={foodMaterials.sugar}
        pieces={sugar}
      />
    </group>
  );
}

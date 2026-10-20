import { Suspense, useMemo } from "react";
import {
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  SphereGeometry,
} from "three";
import { AssetModel } from "../../../shared/ui/AssetModel";
import {
  Dish,
  Herb,
  Scatter,
  foodGeometry,
  type ScatterPiece,
} from "./FoodGeometry";
import { foodMaterials as m, seeded } from "./FoodMaterials";

const appleShape = new SphereGeometry(1, 20, 12);
const bakedPeel = new MeshPhysicalMaterial({
  color: "#bd8c45",
  roughness: 0.48,
  clearcoat: 0.18,
});
const appleStem = new MeshStandardMaterial({
  color: "#685039",
  roughness: 0.85,
});

export function RoastDuck() {
  return (
    <group>
      <Dish scale={[1.48, 1, 1.16]} />
      <group position={[0, 0.004, 0]}>
        <Suspense fallback={null}>
          <AssetModel
            path="/models/roast_duck/model.glb"
            size={[0.24, 0.127, 0.35]}
          />
        </Suspense>
      </group>
      {[-1, 1].map((side) => (
        <group key={side} position={[side * 0.163, 0.043, -0.035]}>
          <mesh
            geometry={appleShape}
            material={bakedPeel}
            scale={[0.034, 0.027, 0.034]}
            castShadow
            receiveShadow
          />
          <mesh position={[0.002, 0.028, 0]} material={appleStem} castShadow>
            <boxGeometry args={[0.0025, 0.012, 0.0025]} />
          </mesh>
        </group>
      ))}
      <Herb position={[-0.16, 0.03, 0.095]} />
      <Herb position={[0.17, 0.03, -0.015]} />
    </group>
  );
}

const pastry = new MeshStandardMaterial({
  map: m.crumb.map,
  bumpMap: m.crumb.bumpMap,
  bumpScale: 0.0007,
  roughness: 0.88,
});
const cream = new MeshStandardMaterial({ color: "#e7d7b3", roughness: 0.72 });
export function NapoleonCake() {
  const pieces = useMemo(() => {
    const random = seeded(1155);
    const pastryLayers: ScatterPiece[] = [],
      creamLayers: ScatterPiece[] = [],
      crumbs: ScatterPiece[] = [];
    const blocks = [
      { x: -0.037, z: -0.008, width: 0.154, depth: 0.188 },
      { x: 0.083, z: -0.05, width: 0.086, depth: 0.104 },
      { x: 0.128, z: 0.084, width: 0.078, depth: 0.078 },
    ];
    for (const block of blocks) {
      for (let layer = 0; layer < 10; layer++) {
        const y = 0.026 + layer * 0.0076;
        const rotation: [number, number, number] = [
          0,
          (random() - 0.5) * 0.018,
          (random() - 0.5) * 0.009,
        ];
        pastryLayers.push({
          position: [block.x + (random() - 0.5) * 0.003, y, block.z],
          scale: [block.width, 0.0045, block.depth],
          rotation,
          color: ["#e6c68c", "#cfab70", "#efd29e"][layer % 3],
        });
        creamLayers.push({
          position: [block.x, y + 0.0037, block.z],
          scale: [block.width * 0.985, 0.0036, block.depth * 0.985],
          rotation,
        });
      }
      for (let i = 0; i < 145; i++) {
        crumbs.push({
          position: [
            block.x + (random() - 0.5) * block.width,
            0.103 + random() * 0.004,
            block.z + (random() - 0.5) * block.depth,
          ],
          scale: [
            0.002 + random() * 0.007,
            0.001 + random() * 0.002,
            0.002 + random() * 0.005,
          ],
          rotation: [random(), random() * 6, random()],
          color: ["#ddbc80", "#b58b50", "#ead4a5", "#c5a36d"][i % 4],
        });
      }
    }
    for (let i = 0; i < 40; i++) {
      const angle = random() * Math.PI * 2,
        radius = 0.125 + random() * 0.035;
      crumbs.push({
        position: [Math.cos(angle) * radius, 0.025, Math.sin(angle) * radius],
        scale: [0.002 + random() * 0.004, 0.001, 0.003],
        rotation: [0, angle, 0],
        color: "#c8a36a",
      });
    }
    return { pastryLayers, creamLayers, crumbs };
  }, []);
  return (
    <group>
      <Dish scale={[1.25, 1, 1.14]} />
      <Scatter
        geometry={foodGeometry.sugar}
        material={pastry}
        pieces={pieces.pastryLayers}
      />
      <Scatter
        geometry={foodGeometry.sugar}
        material={cream}
        pieces={pieces.creamLayers}
      />
      <Scatter
        geometry={foodGeometry.dice}
        material={m.ingredients}
        pieces={pieces.crumbs}
      />
    </group>
  );
}

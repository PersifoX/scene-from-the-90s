import { Suspense, useMemo } from "react";
import { AssetModel } from "../../shared/ui/AssetModel";
import { VintageComputer } from "./VintageComputer";
import { OfficeChair } from "./PhotoFurnitureDetails";
import { Box } from "../../shared/ui/Geometry";
import { surface } from "../../shared/lib/textures";
import { clickable } from "../../shared/lib/interaction";
import type { InteriorActions } from "./WallUnit";
export function ComputerDesk({ inspect, hover }: InteriorActions) {
  const wood = useMemo(() => {
    const material = surface("wood", "#574032").clone();
    material.color.set("#696057");
    return material;
  }, []);
  const drawer = surface("paint", "#bfb39a");
  return (
    <group>
      <OfficeChair />
      <group
        position={[2.2, 0, -1.78]}
        rotation={[0, -Math.PI / 2, 0]}
        {...clickable(() => inspect("computer"), hover, "Компьютерный уголок")}
      >
        <Box
          position={[0, 0.77, 0]}
          size={[1.48, 0.06, 0.66]}
          material={wood}
        />
        <Box
          position={[0.48, 0.77, 0.21]}
          size={[0.52, 0.06, 1.04]}
          material={wood}
        />
        <Box
          position={[-0.65, 0.38, 0]}
          size={[0.05, 0.76, 0.62]}
          material={wood}
        />
        <Box
          position={[0.48, 0.37, 0.18]}
          size={[0.47, 0.74, 0.68]}
          material={wood}
        />
        {[0.105, 0.285, 0.465, 0.645].map((y) => (
          <group key={y}>
            <Box
              position={[0.48, y, 0.535]}
              size={[0.42, 0.165, 0.025]}
              material={drawer}
            />
            <Box
              position={[0.48, y, 0.557]}
              size={[0.14, 0.014, 0.018]}
              color="#aaa28c"
            />
          </group>
        ))}
        {[-0.68, 0.68].map((x) => (
          <Box
            key={x}
            position={[x, 1.52, -0.27]}
            size={[0.045, 1.48, 0.12]}
            material={wood}
          />
        ))}
        {[1.53, 2.21].map((y) => (
          <Box
            key={y}
            position={[0, y, -0.19]}
            size={[1.45, 0.045, 0.39]}
            material={wood}
          />
        ))}
        <Box
          position={[0.24, 1.87, -0.27]}
          size={[0.035, 0.64, 0.17]}
          material={wood}
        />
        <group position={[-0.25, 1.56, -0.16]}>
          <Suspense fallback={null}>
            <AssetModel
              path="/models/book_encyclopedia_set_01/model.gltf"
              size={[0.79, 0.41, 0.24]}
            />
          </Suspense>
        </group>
        <Box
          position={[0.47, 1.73, -0.13]}
          size={[0.31, 0.3, 0.28]}
          color="#cbbaa2"
        />
        <Box
          position={[0.48, 1.91, -0.13]}
          size={[0.33, 0.055, 0.29]}
          color="#b47d68"
        />
        <group
          position={[-0.02, 0.8005, -0.012]}
          rotation={[0, -Math.PI / 2, 0]}
        >
          <Suspense fallback={null}>
            <VintageComputer />
          </Suspense>
        </group>
      </group>
    </group>
  );
}

import { Suspense, type ReactNode } from "react";
import { AssetModel } from "../../shared/ui/AssetModel";
import { Box } from "../../shared/ui/Geometry";
import { CrtScreen } from "./CrtScreen";

export function VintageTelevision({
  on,
  screen,
}: {
  on: boolean;
  screen?: ReactNode;
}) {
  return (
    <group scale={0.48}>
      <Suspense
        fallback={
          <Box position={[0, 0.7, 0]} size={[1.5, 1.4, 0.78]} color="#73776d" />
        }
      >
        <AssetModel
          path="/models/television_02/model.gltf"
          size={[1.5, 1.4, 0.78]}
        />
      </Suspense>
      {on && screen}
      {on && !screen && (
        <CrtScreen on={on} position={[0.01, 0.85, 0.407]} size={[1.16, 0.82]} />
      )}
      {on && (
        <pointLight
          position={[0, 0.85, 0.9]}
          color="#a0cfc2"
          intensity={1.5}
          distance={2.8}
        />
      )}
    </group>
  );
}

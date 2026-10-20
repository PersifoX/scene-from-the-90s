import { Suspense, useEffect, useMemo } from "react";
import { useTexture } from "@react-three/drei";
import {
  CanvasTexture,
  MeshStandardMaterial,
  NearestFilter,
  SRGBColorSpace,
} from "three";
import { Box } from "../../shared/ui/Geometry";
import { surface } from "../../shared/lib/textures";
import { assetUrl } from "../../shared/lib/assetUrl";
import { clickable } from "../../shared/lib/interaction";
import { artworks } from "./model/museum";
import type { InteriorActions } from "./WallUnit";
function Artwork({ file, ratio }: { file: string; ratio: number }) {
  const source = useTexture(assetUrl(`textures/artworks/${file}.jpg`));
  const material = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(384 * ratio);
    canvas.height = 384;
    canvas
      .getContext("2d")!
      .drawImage(
        source.image as HTMLImageElement,
        0,
        0,
        canvas.width,
        canvas.height,
      );
    const map = new CanvasTexture(canvas);
    map.colorSpace = SRGBColorSpace;
    map.minFilter = map.magFilter = NearestFilter;
    map.generateMipmaps = false;
    return new MeshStandardMaterial({ map, roughness: 0.95, color: "#f4ecdc" });
  }, [source, ratio]);
  useEffect(
    () => () => {
      material.map?.dispose();
      material.dispose();
    },
    [material],
  );
  return (
    <mesh position={[0, 0, 0.055]} material={material}>
      <planeGeometry args={[0.43, 0.43 / ratio]} />
    </mesh>
  );
}
export function PortraitGallery({ inspect, hover }: InteriorActions) {
  const wood = surface("wood", "#68422d");
  return (
    <group position={[2.58, 1.96, 0.52]} rotation={[0, -Math.PI / 2, 0]}>
      {artworks.map((artwork, i) => (
        <group
          key={artwork.id}
          position={[(i - 1) * 0.63, 0, 0]}
          {...clickable(() => inspect(artwork.id), hover, artwork.name)}
        >
          <Box
            size={[0.55, 0.43 / artwork.ratio + 0.13, 0.055]}
            material={wood}
          />
          <Box
            position={[0, 0, 0.033]}
            size={[0.51, 0.43 / artwork.ratio + 0.09, 0.018]}
            color="#b8a27e"
          />
          <Box
            position={[0, 0, 0.045]}
            size={[0.45, 0.43 / artwork.ratio + 0.02, 0.014]}
            color="#443628"
          />
          <Suspense fallback={null}>
            <Artwork file={artwork.file} ratio={artwork.ratio} />
          </Suspense>
        </group>
      ))}
    </group>
  );
}

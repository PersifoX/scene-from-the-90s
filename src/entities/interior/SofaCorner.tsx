import { Box, SoftBox } from "../../shared/ui/Geometry";
import { surface } from "../../shared/lib/textures";
import { PortraitGallery } from "./PortraitGallery";
import { clickable } from "../../shared/lib/interaction";
import type { InteriorActions } from "./WallUnit";
export function SofaCorner({ inspect, hover }: InteriorActions) {
  const upholstery = surface("sofa", "#d7d4cb"),
    seat = surface("cloth", "#969184");
  return (
    <group>
      <group
        position={[1.96, 0, 0.95]}
        scale={[0.92, 1, 0.88]}
        {...clickable(() => inspect("sofa"), hover, "Разложенный диван")}
      >
        <SoftBox
          position={[0, 0.25, 0]}
          size={[1.3, 0.3, 2.27]}
          radius={0.055}
          material={upholstery}
        />
        {[-0.33, 0.33].map((x) => (
          <SoftBox
            key={x}
            position={[x, 0.46, 0]}
            size={[0.644, 0.19, 2.22]}
            radius={0.05}
            material={seat}
          />
        ))}
        <SoftBox
          position={[0.61, 0.7, 0]}
          size={[0.22, 0.59, 2.26]}
          radius={0.095}
          material={upholstery}
        />
        {[-0.72, 0, 0.72].map((z) => (
          <SoftBox
            key={z}
            position={[0.494, 0.72, z]}
            size={[0.16, 0.43, 0.7]}
            radius={0.075}
            material={upholstery}
            rotation={[0, 0, -0.08]}
          />
        ))}
        <SoftBox
          position={[0, 0.57, -1.105]}
          size={[1.35, 0.35, 0.16]}
          radius={0.07}
          material={upholstery}
        />
        <SoftBox
          position={[0, 0.38, 1.105]}
          size={[1.35, 0.18, 0.13]}
          radius={0.055}
          material={upholstery}
        />
        {/* The fabric skirt and fine fringe hide the sofa base in the references. */}
        {Array.from({ length: 68 }, (_, i) => (
          <Box
            key={i}
            position={[-0.65, 0.12, -1.1 + i * 0.033]}
            size={[0.007, 0.22 + (i % 3) * 0.007, 0.009]}
            color="#a3977f"
          />
        ))}
        {Array.from({ length: 36 }, (_, i) => (
          <Box
            key={i}
            position={[-0.63 + i * 0.036, 0.12, 1.13]}
            size={[0.008, 0.22 + (i % 3) * 0.007, 0.007]}
            color="#a3977f"
          />
        ))}
      </group>
      <PortraitGallery inspect={inspect} hover={hover} />
    </group>
  );
}

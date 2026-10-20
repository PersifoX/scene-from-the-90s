import { Box } from "../../shared/ui/Geometry";
import { surface } from "../../shared/lib/textures";
import { WinterOutside } from "./WinterOutside";

/** Approximate room proportions in metres. */
export function RoomShell() {
  const wall = surface("wall", "#d1d3bf");
  const white = surface("paint", "#eeeede");
  const trim = surface("wood", "#7b5138");
  return (
    <group scale={[1.23, 1, 0.88]}>
      <Box
        position={[0, 2.79, 0]}
        size={[4.36, 0.14, 6.4]}
        material={surface("paint", "#e4e2d2")}
      />
      <Box
        position={[0, -0.075, 0]}
        size={[4.36, 0.15, 6.4]}
        material={surface("floor", "#c4b28b")}
      />
      {[-2.17, 2.17].map((x) => (
        <Box
          key={x}
          position={[x, 1.36, 0]}
          size={[0.14, 2.72, 6.4]}
          material={wall}
        />
      ))}
      {/* Openings: a broad three-leaf window and the door immediately to its right. */}
      <Box
        position={[0, 2.65, -3.13]}
        size={[4.36, 0.2, 0.14]}
        material={wall}
      />
      <Box
        position={[-1.85, 1.3, -3.13]}
        size={[0.62, 2.6, 0.14]}
        material={wall}
      />
      <Box
        position={[-0.34, 0.39, -3.13]}
        size={[2.42, 0.78, 0.14]}
        material={wall}
      />
      <Box
        position={[1.035, 1.3, -3.13]}
        size={[0.2, 2.6, 0.14]}
        material={wall}
      />
      <Box
        position={[2.01, 1.3, -3.13]}
        size={[0.3, 2.6, 0.14]}
        material={wall}
      />
      <WinterOutside />
      <group position={[-0.34, 1.69, -3.06]}>
        {[-1.2, -0.4, 0.4, 1.2].map((x) => (
          <Box
            key={x}
            position={[x, 0, 0]}
            size={[0.065, 1.83, 0.13]}
            material={white}
          />
        ))}
        <Box
          position={[0, 0.89, 0]}
          size={[2.47, 0.075, 0.13]}
          material={white}
        />
        <Box
          position={[0, -0.88, 0.1]}
          size={[2.54, 0.085, 0.32]}
          material={white}
        />
        <Box
          position={[0, 0.45, 0]}
          size={[2.4, 0.045, 0.13]}
          material={white}
        />
        {[-0.43, 0.37, 1.14].map((x) => (
          <Box
            key={x}
            position={[x, -0.05, 0.09]}
            size={[0.018, 0.12, 0.035]}
            color="#c3c3ae"
          />
        ))}
      </group>
      <group position={[1.49, 1.3, -3.06]}>
        {[-0.37, 0.37].map((x) => (
          <Box
            key={x}
            position={[x, 0, 0]}
            size={[0.065, 2.6, 0.14]}
            material={white}
          />
        ))}
        {[-1.27, 1.27].map((y) => (
          <Box
            key={y}
            position={[0, y, 0]}
            size={[0.79, 0.075, 0.14]}
            material={white}
          />
        ))}
        <Box
          position={[0, -0.83, 0]}
          size={[0.69, 0.84, 0.1]}
          material={white}
        />
        <Box
          position={[0, -0.38, 0]}
          size={[0.72, 0.07, 0.14]}
          material={white}
        />
        <Box
          position={[-0.28, 0.04, 0.1]}
          size={[0.025, 0.14, 0.035]}
          color="#a1a18d"
        />
      </group>
      <Box
        position={[0.2, 0.97, -4.04]}
        size={[4.2, 0.045, 0.045]}
        color="#bac7cb"
      />
      {Array.from({ length: 17 }, (_, i) => (
        <Box
          key={i}
          position={[-1.8 + i * 0.25, 0.49, -4.04]}
          size={[0.018, 0.94, 0.018]}
          color="#b6c1c3"
        />
      ))}
      <Box
        position={[0, -0.045, -3.68]}
        size={[4.3, 0.08, 1.12]}
        color="#ccd3d0"
      />
      {[-2.07, 2.07].map((x) => (
        <Box
          key={x}
          position={[x, 0.065, 0]}
          size={[0.045, 0.13, 6.2]}
          material={trim}
        />
      ))}
      <Box
        position={[0, 0.065, -3.03]}
        size={[4.2, 0.13, 0.04]}
        material={trim}
      />
      <Box
        position={[-0.12, 0.012, 0.53]}
        size={[2.84, 0.022, 4.65]}
        material={surface("rug", "#713f35")}
      />
      <group position={[-0.32, 0.4, -2.95]}>
        {Array.from({ length: 11 }, (_, i) => (
          <Box
            key={i}
            position={[-0.8 + i * 0.16, 0, 0]}
            size={[0.11, 0.57, 0.13]}
            material={white}
          />
        ))}
      </group>
    </group>
  );
}

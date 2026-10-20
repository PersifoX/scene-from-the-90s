import { Box, Cylinder, SoftBox } from "../../shared/ui/Geometry";
import { radioMaterials as m } from "./radioMaterials";

function Knob({
  y,
  radius,
  angle = 0,
}: {
  y: number;
  radius: number;
  angle?: number;
}) {
  return (
    <group position={[0.184, y, 0.108]}>
      <Cylinder
        rotation={[Math.PI / 2, 0, 0]}
        radius={radius + 0.007}
        height={0.012}
        material={m.plastic}
        segments={32}
      />
      <Cylinder
        position={[0, 0, 0.015]}
        rotation={[Math.PI / 2, 0, 0]}
        radius={radius}
        height={0.026}
        material={m.trim}
        segments={32}
      />
      <Cylinder
        position={[0, 0, 0.03]}
        rotation={[Math.PI / 2, 0, 0]}
        radius={radius * 0.78}
        height={0.008}
        material={m.knob}
        segments={32}
      />
      <group position={[0, 0, 0.036]} rotation={[0, 0, angle]}>
        <Box
          position={[0, radius * 0.47, 0]}
          size={[0.003, radius * 0.45, 0.0015]}
          color="#424a3f"
          castShadow={false}
        />
      </group>
      {Array.from({ length: 20 }, (_, i) => {
        const a = (i * Math.PI) / 10;
        return (
          <Box
            key={i}
            position={[
              Math.sin(a) * (radius - 0.001),
              Math.cos(a) * (radius - 0.001),
              0.014,
            ]}
            rotation={[0, 0, -a]}
            size={[0.0014, 0.003, 0.018]}
            color="#7f897b"
            castShadow={false}
          />
        );
      })}
    </group>
  );
}

/** Stylised VEF-202: proportions and controls follow the museum reference. */
export function VintageRadio({ dial, on }: { dial: number; on: boolean }) {
  return (
    <group>
      <SoftBox size={[0.54, 0.36, 0.17]} radius={0.012} material={m.plastic} />
      <SoftBox
        position={[0, 0, 0.086]}
        size={[0.519, 0.343, 0.014]}
        radius={0.008}
        material={m.trim}
      />
      <Box
        position={[0, 0, 0.096]}
        size={[0.493, 0.319, 0.008]}
        material={m.plastic}
      />
      <mesh position={[0, 0, 0.101]} material={m.face}>
        <planeGeometry args={[0.485, 0.313]} />
      </mesh>
      {Array.from({ length: 42 }, (_, i) => (
        <Box
          key={i}
          position={[-0.225 + i * 0.011, -0.071, 0.105]}
          size={[0.0012, 0.144, 0.002]}
          material={m.grille}
          castShadow={false}
        />
      ))}
      <Box
        position={[-0.153 + dial * 0.247, 0.082, 0.108]}
        size={[0.0019, 0.121, 0.002]}
        color="#c47a4e"
        castShadow={false}
      />
      <Knob y={-0.046} radius={0.039} angle={-dial * Math.PI * 1.7} />
      <Knob y={-0.123} radius={0.024} angle={Math.PI * 0.65} />
      <Cylinder
        position={[0.276, 0.066, -0.009]}
        rotation={[0, 0, Math.PI / 2]}
        radius={0.019}
        height={0.018}
        material={m.trim}
        segments={24}
      />
      <Cylinder
        position={[-0.225, 0.036, on ? 0.108 : 0.112]}
        rotation={[Math.PI / 2, 0, 0]}
        radius={0.007}
        height={0.009}
        material={m.trim}
        segments={18}
      />
      {[-0.166, 0.006, 0.166].map((y) => (
        <Box
          key={y}
          position={[0, y, 0.109]}
          size={[0.5, 0.0035, 0.004]}
          material={m.trim}
          castShadow={false}
        />
      ))}
      {[-0.22, 0.22].map((x) => (
        <group key={x}>
          <SoftBox
            position={[x, 0.191, -0.011]}
            size={[0.025, 0.098, 0.023]}
            radius={0.006}
            material={m.plastic}
          />
          <Cylinder
            position={[x, 0.147, 0.006]}
            rotation={[Math.PI / 2, 0, 0]}
            radius={0.009}
            height={0.008}
            material={m.trim}
            segments={18}
          />
          <SoftBox
            position={[x * 0.78, -0.192, 0]}
            size={[0.063, 0.026, 0.107]}
            radius={0.006}
            material={m.plastic}
          />
        </group>
      ))}
      <SoftBox
        position={[0, 0.236, -0.011]}
        size={[0.459, 0.023, 0.026]}
        radius={0.007}
        material={m.plastic}
      />
      <Cylinder
        position={[0.02, 0.183, -0.045]}
        rotation={[0, 0, Math.PI / 2]}
        radius={0.0034}
        height={0.37}
        material={m.trim}
        segments={12}
      />
      {[-0.238, 0.238].flatMap((x) =>
        [-0.147, 0.147].map((y) => (
          <group key={`${x}:${y}`} position={[x, y, 0.106]}>
            <Cylinder
              radius={0.0038}
              height={0.002}
              rotation={[Math.PI / 2, 0, 0]}
              material={m.trim}
              segments={10}
            />
            <Box
              position={[0, 0, 0.0015]}
              size={[0.0048, 0.0008, 0.0005]}
              color="#4d5549"
              castShadow={false}
            />
          </group>
        )),
      )}
    </group>
  );
}

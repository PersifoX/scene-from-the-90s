import { LatheGeometry, MeshStandardMaterial, Vector2 } from "three";
import { Box, Cylinder, SoftBox } from "../../shared/ui/Geometry";
import { surface } from "../../shared/lib/textures";
const bronze = new MeshStandardMaterial({
  color: "#82785c",
  metalness: 0.65,
  roughness: 0.36,
});
const vase = new LatheGeometry(
  [
    [0.07, 0],
    [0.075, 0.018],
    [0.052, 0.042],
    [0.04, 0.08],
    [0.065, 0.14],
    [0.059, 0.19],
    [0.025, 0.24],
    [0.022, 0.27],
  ].map((p) => new Vector2(...(p as [number, number]))),
  20,
);
const lampShade = new LatheGeometry(
  [
    [0.09, 0.23],
    [0.107, 0.22],
    [0.116, 0.16],
    [0.153, 0.05],
    [0.186, 0],
    [0.18, -0.008],
  ].map((p) => new Vector2(...(p as [number, number]))),
  32,
);
const shadePosition = lampShade.attributes.position;
for (let i = 0; i < shadePosition.count; i++) {
  const x = shadePosition.getX(i),
    y = shadePosition.getY(i),
    z = shadePosition.getZ(i),
    a = Math.atan2(z, x),
    f = 1 + Math.cos(a * 6) * 0.035;
  shadePosition.setXYZ(i, x * f, y + Math.cos(a * 6) * 0.007, z * f);
}
lampShade.computeVertexNormals();
export function SideTableLamp() {
  const shade = surface("cloth", "#ded6bd");
  return (
    <group position={[2.14, 0, -0.54]}>
      <Box position={[0, 0.63, 0]} size={[0.67, 0.042, 0.43]} color="#282927" />
      {[-0.28, 0.28].flatMap((x) =>
        [-0.15, 0.15].map((z) => (
          <Cylinder
            key={`${x}:${z}`}
            position={[x, 0.31, z]}
            radius={0.014}
            height={0.62}
            color="#696a61"
          />
        )),
      )}
      <Box position={[0, 0.15, 0]} size={[0.6, 0.025, 0.37]} color="#33352f" />
      <group position={[0.07, 0.654, -0.015]}>
        <mesh geometry={vase} material={bronze} castShadow />
        <Cylinder
          position={[0, 0.29, 0]}
          radius={0.007}
          height={0.11}
          material={bronze}
        />
        <mesh
          geometry={lampShade}
          position={[0, 0.3, 0]}
          material={shade}
          castShadow
        />
        <pointLight
          position={[0, 0.41, 0]}
          intensity={0.55}
          distance={2.7}
          color="#ffe7bf"
        />
      </group>
    </group>
  );
}
export function OfficeChair() {
  const leather = surface("paint", "#343735");
  return (
    <group position={[1.28, 0, -1.77]} rotation={[0, Math.PI / 2, 0]}>
      <Cylinder
        position={[0, 0.25, 0]}
        radius={0.033}
        height={0.35}
        color="#555852"
        segments={16}
      />
      {Array.from({ length: 5 }, (_, i) => (
        <group key={i} rotation={[0, (i * Math.PI * 2) / 5, 0]}>
          <Box
            position={[0.15, 0.095, 0]}
            size={[0.3, 0.035, 0.038]}
            color="#383d38"
            rotation={[0, 0, -0.13]}
          />
          <Cylinder
            position={[0.29, 0.045, 0]}
            radius={0.041}
            height={0.045}
            color="#30332f"
            rotation={[Math.PI / 2, 0, 0]}
          />
        </group>
      ))}
      <SoftBox
        position={[0, 0.47, 0]}
        size={[0.53, 0.13, 0.48]}
        radius={0.055}
        material={leather}
      />
      <SoftBox
        position={[0, 0.86, -0.22]}
        size={[0.51, 0.73, 0.115]}
        radius={0.08}
        material={leather}
        rotation={[-0.08, 0, 0]}
      />
      <SoftBox
        position={[0, 0.86, -0.151]}
        size={[0.42, 0.54, 0.04]}
        radius={0.05}
        material={surface("paint", "#3c403b")}
        rotation={[-0.08, 0, 0]}
      />
      {[-0.3, 0.3].map((x) => (
        <group key={x}>
          <Box
            position={[x, 0.59, -0.07]}
            size={[0.035, 0.25, 0.035]}
            color="#393d37"
          />
          <SoftBox
            position={[x, 0.72, 0.025]}
            size={[0.07, 0.055, 0.4]}
            radius={0.025}
            material={leather}
          />
        </group>
      ))}
    </group>
  );
}

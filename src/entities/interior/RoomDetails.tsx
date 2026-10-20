import { useMemo } from "react";
import { DoubleSide, MeshStandardMaterial, PlaneGeometry } from "three";
import { Box } from "../../shared/ui/Geometry";
import { Chandelier } from "./Chandelier";
import { CeilingTiles } from "./CeilingTiles";
import { SideTableLamp } from "./PhotoFurnitureDetails";
import { surface } from "../../shared/lib/textures";

const sheer = new MeshStandardMaterial({
  color: "#ebf0df",
  transparent: true,
  opacity: 0.24,
  side: DoubleSide,
  depthWrite: false,
  roughness: 1,
});
const seams = new MeshStandardMaterial({
  color: "#d4dec7",
  transparent: true,
  opacity: 0.4,
  side: DoubleSide,
  depthWrite: false,
});

function Curtain({
  x,
  width,
  height = 2.47,
  transparent = false,
}: {
  x: number;
  width: number;
  height?: number;
  transparent?: boolean;
}) {
  const geometry = useMemo(() => {
    const g = new PlaneGeometry(width, height, 40, 20);
    const p = g.attributes.position;
    for (let i = 0; i < p.count; i++) {
      const u = (p.getX(i) + width / 2) / width;
      const v = (p.getY(i) + height / 2) / height;
      p.setZ(i, Math.sin(u * Math.PI * 16) * 0.035 * (1.25 - v * 0.25));
      p.setY(i, p.getY(i) + Math.sin(u * Math.PI * 16) * 0.012 * (1 - v));
    }
    g.computeVertexNormals();
    return g;
  }, [width, height]);
  return (
    <group position={[x, 1.3, -2.86]}>
      <mesh
        geometry={geometry}
        material={transparent ? sheer : surface("cloth", "#a9bba2")}
        castShadow={!transparent}
      />
      {transparent && (
        <Box
          position={[0, -height / 2 + 0.08, 0]}
          size={[width, 0.065, 0.005]}
          material={seams}
          castShadow={false}
        />
      )}
    </group>
  );
}
export function RoomDetails() {
  return (
    <group>
      <Chandelier />
      <CeilingTiles />
      <SideTableLamp />
      <group scale={[1.23, 1, 0.88]}>
        <Box
          position={[0.13, 2.62, -2.82]}
          size={[3.88, 0.025, 0.035]}
          color="#c9cbbb"
        />
        <Curtain x={-1.6} width={0.28} />
        <Curtain x={-0.78} width={1.35} transparent />
        <Curtain x={0.62} width={1.35} transparent />
        <Curtain x={1.66} width={0.61} transparent />
        <Curtain x={1.98} width={0.17} />
        <group position={[2.065, 0.27, 0.25]} rotation={[0, -Math.PI / 2, 0]}>
          <Box size={[0.13, 0.085, 0.025]} color="#e5dfcb" />
          {[-0.027, 0.027].map((x) => (
            <Box
              key={x}
              position={[x, 0, 0.017]}
              size={[0.012, 0.021, 0.008]}
              color="#645f4a"
            />
          ))}
        </group>
        <group position={[-1.42, 0.16, -0.18]}>
          <Box size={[0.014, 0.014, 0.75]} color="#36392d" />
          <Box
            position={[0, 0.27, -0.37]}
            size={[0.014, 0.55, 0.014]}
            color="#36392d"
          />
        </group>
      </group>
    </group>
  );
}

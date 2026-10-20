import { Suspense, useMemo, useRef, type ReactNode } from "react";
import { useFrame } from "@react-three/fiber";
import {
  Group,
  MeshStandardMaterial,
  CatmullRomCurve3,
  TubeGeometry,
  Vector3,
  Shape,
  ExtrudeGeometry,
} from "three";
import { Box, Cylinder, Ball } from "../../shared/ui/Geometry";
import { surface } from "../../shared/lib/textures";
import { clickable } from "../../shared/lib/interaction";
import { AssetModel } from "../../shared/ui/AssetModel";
import { VintageTelevision } from "./VintageTelevision";
import { VintageRadio } from "./VintageRadio";

export type InteriorActions = {
  inspect: (id: string) => void;
  hover: (text: string | null) => void;
};
type Props = InteriorActions & {
  tvOn: boolean;
  screen?: ReactNode;
  radioOn: boolean;
  radioDial: number;
  radioFocused: boolean;
  cassette: boolean;
  toggleTv: () => void;
  toggleRadio: () => void;
  insertCassette: () => void;
};
const glass = new MeshStandardMaterial({
  color: "#b1c2ad",
  transparent: true,
  opacity: 0.17,
  roughness: 0.17,
  depthWrite: false,
});
const brass = "#c6ae70";

function Handle({ x, y }: { x: number; y: number }) {
  return (
    <Cylinder
      position={[x, y, 0.335]}
      rotation={[Math.PI / 2, 0, 0]}
      radius={0.018}
      height={0.025}
      color={brass}
    />
  );
}
function SolidDoor({
  x,
  width,
  y = 1.29,
  height = 2.37,
}: {
  x: number;
  width: number;
  y?: number;
  height?: number;
}) {
  const wood = surface("wood", "#845033");
  return (
    <group>
      <Box
        position={[x, y, 0.291]}
        size={[width - 0.016, height, 0.045]}
        material={wood}
      />
      {[-1, 1].map((side) => (
        <Box
          key={side}
          position={[x + side * (width / 2 - 0.045), y, 0.316]}
          size={[0.006, height - 0.1, 0.004]}
          color={brass}
        />
      ))}
      <Handle x={x + width / 2 - 0.065} y={y - 0.05} />
    </group>
  );
}
const brassMaterial = new MeshStandardMaterial({
  color: brass,
  metalness: 0.5,
  roughness: 0.4,
});
function GlassOrnament({ width, height }: { width: number; height: number }) {
  const paths = useMemo(
    () =>
      [-1, 0, 1].map(
        (side) =>
          new TubeGeometry(
            new CatmullRomCurve3([
              new Vector3(0, -height * 0.44, 0),
              new Vector3(0, -height * 0.02, 0),
              new Vector3(side * width * 0.14, height * 0.22, 0),
              new Vector3(side * width * 0.32, height * 0.44, 0),
            ]),
            14,
            0.0018,
            5,
            false,
          ),
      ),
    [width, height],
  );
  return (
    <group>
      {paths.map((g, i) => (
        <mesh key={i} geometry={g} material={brassMaterial} />
      ))}
    </group>
  );
}
const valanceShape = new Shape();
valanceShape.moveTo(-0.73, 0.16);
valanceShape.lineTo(0.73, 0.16);
valanceShape.lineTo(0.73, -0.04);
valanceShape.bezierCurveTo(0.42, -0.04, 0.32, 0.07, 0, 0.09);
valanceShape.bezierCurveTo(-0.32, 0.07, -0.42, -0.04, -0.73, -0.04);
valanceShape.closePath();
const valance = new ExtrudeGeometry(valanceShape, {
  depth: 0.045,
  bevelEnabled: false,
  curveSegments: 20,
});
function Display({
  x,
  width,
  y,
  height,
  open = false,
}: {
  x: number;
  width: number;
  y: number;
  height: number;
  open?: boolean;
}) {
  const door = useRef<Group>(null);
  useFrame((_, dt) => {
    if (!door.current) return;
    door.current.rotation.y +=
      ((open ? -1.68 : 0) - door.current.rotation.y) * (1 - Math.exp(-6 * dt));
  });
  const wood = surface("wood", "#845033");
  return (
    <group ref={door} position={[x - width / 2, y, 0.294]}>
      <group position={[-x + width / 2, -y, -0.294]}>
        <Box
          position={[x, y, 0.281]}
          size={[width, height, 0.012]}
          material={glass}
          raycast={() => {}}
          castShadow={false}
        />
        {[-1, 1].map((side) => (
          <Box
            key={side}
            position={[x + side * (width / 2 - 0.018), y, 0.294]}
            size={[0.035, height, 0.038]}
            material={wood}
          />
        ))}
        {[-1, 1].map((side) => (
          <Box
            key={side}
            position={[x, y + side * (height / 2 - 0.018), 0.294]}
            size={[width, 0.035, 0.038]}
            material={wood}
          />
        ))}
        <group position={[x, y, 0.31]}>
          <GlassOrnament width={width} height={height} />
        </group>
        <Handle x={x + width / 2 - 0.06} y={y - 0.04} />
      </group>
    </group>
  );
}
export function WallUnit({
  inspect,
  hover,
  tvOn,
  screen,
  radioOn,
  radioDial,
  radioFocused,
  cassette,
  toggleTv,
  toggleRadio,
  insertCassette,
}: Props) {
  const tape = useRef<Group>(null);
  useFrame((_, dt) => {
    if (tape.current)
      tape.current.position.z +=
        ((cassette ? 0.28 : 0.49) - tape.current.position.z) *
        Math.min(dt * 5, 1);
  });
  const wood = surface("wood", "#845033"),
    darkWood = surface("wood", "#513525");
  return (
    <group
      position={[-2.31, 0, -0.45]}
      rotation={[0, Math.PI / 2, 0]}
      scale={[0.88, 1, 1]}
    >
      <Box
        position={[0, 0.1, 0]}
        size={[4.65, 0.14, 0.6]}
        material={darkWood}
      />
      <Box
        position={[0, 1.34, -0.282]}
        size={[4.65, 2.42, 0.035]}
        material={darkWood}
      />
      {[0.17, 2.56].map((y) => (
        <Box
          key={y}
          position={[0, y, 0]}
          size={[4.7, 0.05, 0.64]}
          material={wood}
        />
      ))}
      {[-2.3, -1.18, -0.64, 0.83, 1.49, 2.3].map((x) => (
        <Box
          key={x}
          position={[x, 1.36, 0]}
          size={[0.045, 2.4, 0.62]}
          material={wood}
        />
      ))}
      {/* Tall wardrobe, narrow vitrine, open TV niche, shelves, final wardrobe. */}
      <SolidDoor x={-2.02} width={0.54} />
      <SolidDoor x={-1.47} width={0.54} />
      <SolidDoor x={1.71} width={0.36} />
      <SolidDoor x={2.1} width={0.36} />
      <SolidDoor x={-0.91} width={0.49} y={0.49} height={0.6} />
      <Display x={-0.91} width={0.49} y={1.67} height={1.7} />
      {[0.82, 1.24, 1.72, 2.16].map((y) => (
        <Box
          key={y}
          position={[-0.91, y, 0]}
          size={[0.5, 0.018, 0.52]}
          color="#a8b6a2"
        />
      ))}
      {[1.37, 1.85, 2.28].map((y, i) => (
        <group key={y} position={[-0.91, y, 0.05]}>
          <Cylinder radius={0.12} height={0.04} color="#d0d0b8" />
          <Cylinder
            position={[0, 0.04, 0]}
            radius={0.085}
            height={0.06}
            color={i % 2 ? "#adb7a3" : "#c4c8bd"}
          />
          <Ball position={[0, 0.1, 0]} radius={0.035} color="#d1d5cc" />
        </group>
      ))}
      <Box
        position={[0.1, 0.77, 0]}
        size={[1.45, 0.055, 0.63]}
        material={wood}
      />
      {[-0.4, 0.58].map((x) => (
        <SolidDoor key={x} x={x} width={0.43} y={0.46} height={0.54} />
      ))}
      {[0.27, 0.45, 0.63].map((y) => (
        <group key={y}>
          <Box
            position={[0.09, y, 0.296]}
            size={[0.48, 0.16, 0.05]}
            material={wood}
          />
          <Handle x={0.09} y={y} />
        </group>
      ))}
      <Box
        position={[0.1, 1.79, 0]}
        size={[1.45, 0.055, 0.62]}
        material={wood}
      />
      <SolidDoor x={-0.43} width={0.36} y={2.17} height={0.7} />
      <Display x={0.1} width={0.66} y={2.17} height={0.7} />
      <SolidDoor x={0.63} width={0.36} y={2.17} height={0.7} />
      <mesh
        position={[0.1, 1.69, 0.29]}
        geometry={valance}
        material={wood}
        castShadow
      />
      {[-0.27, 0.12, 0.5].map((x) => (
        <group key={x} position={[x, 1.97, 0.04]}>
          <Cylinder radius={0.085} height={0.25} color="#c4c6b1" />
          <Cylinder
            position={[0, 0.13, 0]}
            radius={0.105}
            height={0.025}
            color="#dedccc"
          />
        </group>
      ))}
      <group
        position={[0.12, 0.91, 0.01]}
        {...clickable(toggleTv, hover, "Телевизор — включить / выключить")}
      >
        <VintageTelevision on={tvOn} screen={screen} />
      </group>
      <group
        position={[0.12, 0.855, 0.12]}
        {...clickable(
          insertCassette,
          hover,
          cassette ? "Кассета — извлечь" : "Вставить кассету",
        )}
      >
        <Box size={[0.86, 0.11, 0.32]} color="#333735" />
        <Box
          position={[-0.06, 0, 0.164]}
          size={[0.45, 0.033, 0.01]}
          color="#111919"
        />
        <Box
          position={[0.33, 0, 0.17]}
          size={[0.04, 0.025, 0.01]}
          color={cassette ? "#90a37b" : "#636b57"}
        />
      </group>
      <group
        ref={tape}
        position={[0.06, 0.855, 0.49]}
        {...clickable(insertCassette, hover, "Видеокассета")}
      >
        <Box size={[0.34, 0.027, 0.18]} color="#1e2220" />
        <Box
          position={[0, 0.015, 0]}
          size={[0.2, 0.004, 0.09]}
          color="#c3b795"
        />
      </group>
      <Display
        x={1.16}
        width={0.61}
        y={1.67}
        height={1.7}
        open={radioFocused}
      />
      <SolidDoor x={1.16} width={0.6} y={0.47} height={0.57} />
      {[0.78, 1.37, 1.95].map((y) => (
        <Box
          key={y}
          position={[1.16, y, 0]}
          size={[0.61, 0.035, 0.6]}
          material={wood}
        />
      ))}
      <group
        position={[1.16, 1.59, 0.05]}
        {...clickable(
          toggleRadio,
          hover,
          "Радиоприёмник — включить / настроить",
        )}
      >
        <VintageRadio dial={radioDial} on={radioOn} />
      </group>
      <group
        position={[1.16, 0.8, 0.02]}
        {...clickable(() => inspect("books"), hover, "Книги на домашней полке")}
      >
        <Suspense fallback={null}>
          <AssetModel
            path="/models/book_encyclopedia_set_01/model.gltf"
            size={[0.54, 0.44, 0.32]}
          />
        </Suspense>
      </group>
    </group>
  );
}

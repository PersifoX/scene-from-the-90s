import type { ThreeElements } from "@react-three/fiber";
import {
  BoxGeometry,
  CylinderGeometry,
  SphereGeometry,
  MeshStandardMaterial,
} from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
const roundedBoxes = new Map<string, RoundedBoxGeometry>();
const cube = new BoxGeometry(1, 1, 1);
const cylinders = new Map<number, CylinderGeometry>();
const sphere = new SphereGeometry(1, 10, 7);
const colors = new Map<string, MeshStandardMaterial>();
export function solid(color: string) {
  let m = colors.get(color);
  if (!m) {
    m = new MeshStandardMaterial({ color, roughness: 0.8, flatShading: true });
    colors.set(color, m);
  }
  return m;
}
type BoxProps = Omit<ThreeElements["mesh"], "scale"> & {
  size?: [number, number, number];
  color?: string;
};
export function Box({
  size = [1, 1, 1],
  color = "#725039",
  material,
  ...props
}: BoxProps) {
  return (
    <mesh
      geometry={cube}
      scale={size}
      material={material ?? solid(color)}
      castShadow
      receiveShadow
      {...props}
    />
  );
}
export function Cylinder({
  radius = 0.1,
  height = 0.1,
  color = "#e1d8be",
  position,
  segments = 12,
  material,
  ...props
}: Omit<ThreeElements["mesh"], "scale"> & {
  radius?: number;
  height?: number;
  color?: string;
  segments?: number;
}) {
  if (!cylinders.has(segments))
    cylinders.set(segments, new CylinderGeometry(1, 1, 1, segments));
  return (
    <mesh
      geometry={cylinders.get(segments)}
      scale={[radius, height, radius]}
      material={material ?? solid(color)}
      position={position}
      castShadow
      receiveShadow
      {...props}
    />
  );
}
export function Ball({
  position,
  radius = 0.1,
  color = "#d49135",
  ...props
}: ThreeElements["mesh"] & { radius?: number; color?: string }) {
  return (
    <mesh
      geometry={sphere}
      scale={radius}
      position={position}
      material={solid(color)}
      castShadow
      {...props}
    />
  );
}

export function SoftBox({
  size = [1, 1, 1],
  radius = 0.04,
  color = "#725039",
  material,
  ...props
}: BoxProps & { radius?: number }) {
  const key = size.join(":") + ":" + radius;
  if (!roundedBoxes.has(key))
    roundedBoxes.set(key, new RoundedBoxGeometry(...size, 2, radius));
  return (
    <mesh
      geometry={roundedBoxes.get(key)}
      material={material ?? solid(color)}
      castShadow
      receiveShadow
      {...props}
    />
  );
}

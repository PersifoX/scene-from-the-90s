import { useLayoutEffect, useRef } from "react";
import {
  BoxGeometry,
  BufferGeometry,
  Color,
  InstancedMesh,
  LatheGeometry,
  Material,
  Object3D,
  SphereGeometry,
  TorusGeometry,
  Vector2,
} from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { foodMaterials as m } from "./FoodMaterials";
export type ScatterPiece = {
  position: [number, number, number];
  scale: [number, number, number];
  rotation: [number, number, number];
  color?: string;
};
export const foodGeometry = {
  grain: new SphereGeometry(1, 8, 5),
  dice: new RoundedBoxGeometry(1, 1, 1, 1, 0.16),
  sugar: new BoxGeometry(1, 1, 1),
};
export function Scatter({
  geometry,
  material,
  pieces,
}: {
  geometry: BufferGeometry;
  material: Material;
  pieces: ScatterPiece[];
}) {
  const ref = useRef<InstancedMesh>(null);
  useLayoutEffect(() => {
    const mesh = ref.current!;
    const dummy = new Object3D();
    pieces.forEach((p, i) => {
      dummy.position.set(...p.position);
      dummy.scale.set(...p.scale);
      dummy.rotation.set(...p.rotation);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
      if (p.color) mesh.setColorAt(i, new Color(p.color));
    });
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    mesh.computeBoundingSphere();
  }, [pieces]);
  return (
    <instancedMesh
      ref={ref}
      args={[geometry, material, pieces.length]}
      castShadow
      receiveShadow
    />
  );
}
const plate = new LatheGeometry(
  [
    [0, 0],
    [0.07, 0],
    [0.105, 0.004],
    [0.145, 0.017],
    [0.158, 0.025],
    [0.156, 0.03],
    [0.14, 0.028],
    [0.105, 0.016],
    [0, 0.014],
  ].map((p) => new Vector2(...(p as [number, number]))),
  48,
);
const bowl = new LatheGeometry(
  [
    [0, 0],
    [0.06, 0],
    [0.105, 0.02],
    [0.15, 0.075],
    [0.166, 0.096],
    [0.164, 0.103],
    [0.155, 0.102],
    [0.14, 0.077],
    [0.1, 0.03],
    [0, 0.021],
  ].map((p) => new Vector2(...(p as [number, number]))),
  48,
);
const plateRing = new TorusGeometry(0.146, 0.0018, 5, 48);
const bowlRing = new TorusGeometry(0.16, 0.002, 5, 48);
export function Dish({
  type = "plate",
  scale = [1, 1, 1],
}: {
  type?: "plate" | "bowl";
  scale?: [number, number, number];
}) {
  return (
    <group scale={scale}>
      <mesh
        geometry={type === "bowl" ? bowl : plate}
        material={m.ceramic}
        castShadow
        receiveShadow
      />
      <mesh
        geometry={type === "bowl" ? bowlRing : plateRing}
        material={m.rim}
        rotation={[Math.PI / 2, 0, 0]}
        position={[0, type === "bowl" ? 0.102 : 0.028, 0]}
      />
    </group>
  );
}
export function Herb({
  position = [0, 0, 0],
}: {
  position?: [number, number, number];
}) {
  return (
    <group position={position}>
      {[0, 1, 2, 3, 4].map((i) => (
        <mesh
          key={i}
          geometry={foodGeometry.grain}
          position={[
            Math.sin(i * 2.4) * 0.014,
            0.002 + i * 0.0005,
            Math.cos(i * 2.4) * 0.014,
          ]}
          scale={[0.013, 0.002, 0.007]}
          rotation={[0, i * 2.4, 0]}
        >
          <meshStandardMaterial color="#4e6c35" roughness={0.7} />
        </mesh>
      ))}
    </group>
  );
}

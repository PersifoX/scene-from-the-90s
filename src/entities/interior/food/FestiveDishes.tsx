import { useMemo } from "react";
import { ExtrudeGeometry, Shape, ShapeGeometry, SphereGeometry } from "three";
import { Cylinder } from "../../../shared/ui/Geometry";
import {
  Dish,
  foodGeometry,
  Herb,
  Scatter,
  type ScatterPiece,
} from "./FoodGeometry";
import { foodMaterials as m, seeded } from "./FoodMaterials";

export function Olivier() {
  const pieces = useMemo(() => {
    const random = seeded(41),
      result: ScatterPiece[] = [];
    const colors = [
      "#c5b995",
      "#738250",
      "#b47e47",
      "#e0d7b4",
      "#b89a8b",
      "#adb078",
    ];
    for (let i = 0; i < 480; i++) {
      const angle = random() * Math.PI * 2,
        r = Math.sqrt(random()) * 0.145;
      const height =
        0.085 + Math.sqrt(1 - (r / 0.15) ** 2) * 0.045 + random() * 0.009;
      const size = 0.009 + random() * 0.008;
      result.push({
        position: [Math.cos(angle) * r, height, Math.sin(angle) * r],
        scale: [size, size * 0.8, size],
        rotation: [random() * 2, random() * 3, random() * 2],
        color: colors[i % colors.length],
      });
    }
    return result;
  }, []);
  return (
    <group>
      <Dish type="bowl" />
      <mesh
        geometry={foodGeometry.grain}
        position={[0, 0.083, 0]}
        scale={[0.147, 0.041, 0.147]}
        material={m.mayonnaise}
      />
      <Scatter
        geometry={foodGeometry.dice}
        material={m.ingredients}
        pieces={pieces}
      />
      <Herb position={[0.025, 0.138, -0.012]} />
    </group>
  );
}
function breadShape() {
  const shape = new Shape();
  shape.moveTo(-0.061, -0.063);
  shape.quadraticCurveTo(-0.067, -0.062, -0.067, -0.052);
  shape.lineTo(-0.066, 0.038);
  shape.bezierCurveTo(-0.078, 0.085, 0.076, 0.085, 0.066, 0.038);
  shape.lineTo(0.067, -0.052);
  shape.quadraticCurveTo(0.067, -0.063, 0.057, -0.063);
  shape.closePath();
  return shape;
}
const breadOutline = breadShape();
const crust = new ExtrudeGeometry(breadOutline, {
  depth: 0.016,
  bevelEnabled: true,
  bevelSegments: 2,
  steps: 1,
  bevelSize: 0.002,
  bevelThickness: 0.002,
  curveSegments: 12,
});
const crumb = new ShapeGeometry(breadOutline, 16);
const uv = crumb.attributes.uv,
  vertices = crumb.attributes.position;
for (let i = 0; i < uv.count; i++)
  uv.setXY(
    i,
    (vertices.getX(i) + 0.08) / 0.16,
    (vertices.getY(i) + 0.07) / 0.16,
  );
function SugarBreadSlice({ index }: { index: number }) {
  const pieces = useMemo(() => {
    const random = seeded(154 + index),
      result: ScatterPiece[] = [];
    for (let i = 0; i < 320; i++) {
      const x = (random() - 0.5) * 0.112,
        z = (random() - 0.5) * 0.108;
      const size = 0.0008 + random() * 0.0011;
      result.push({
        position: [x, 0.0205 + random() * 0.001, z],
        scale: [size, size * 0.65, size],
        rotation: [random(), random(), random()],
      });
    }
    return result;
  }, [index]);
  return (
    <group>
      <mesh
        geometry={crust}
        material={m.crust}
        rotation={[-Math.PI / 2, 0, 0]}
        castShadow
        receiveShadow
      />
      <mesh
        geometry={crumb}
        material={m.crumb}
        scale={[0.91, 0.91, 1]}
        position={[0, 0.019, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      />
      <Scatter
        geometry={foodGeometry.sugar}
        material={m.sugar}
        pieces={pieces}
      />
    </group>
  );
}
export function SugarBread() {
  return (
    <group>
      <Dish scale={[1.3, 1, 0.88]} />
      {[0, 1, 2].map((i) => (
        <group
          key={i}
          position={[-0.076 + i * 0.072, 0.026 + i * 0.006, (i - 1) * 0.024]}
          rotation={[0, -0.28 + i * 0.19, 0]}
        >
          <SugarBreadSlice index={i} />
        </group>
      ))}
    </group>
  );
}
const mandarin = new SphereGeometry(1, 28, 18);
const p = mandarin.attributes.position;
for (let i = 0; i < p.count; i++) {
  const x = p.getX(i),
    y = p.getY(i),
    z = p.getZ(i),
    a = Math.atan2(z, x);
  const r = 1 + Math.cos(a * 10) * 0.012 * (1 - y * y);
  p.setXYZ(i, x * r, y * 0.82, z * r);
}
mandarin.computeVertexNormals();
export function Mandarins() {
  return (
    <group>
      <Dish />
      {Array.from({ length: 6 }, (_, i) => {
        const a = i * 2.4,
          r = i === 5 ? 0 : 0.073;
        return (
          <group
            key={i}
            position={[Math.sin(a) * r, i === 5 ? 0.12 : 0.06, Math.cos(a) * r]}
            rotation={[0.1, i * 1.2, 0.07]}
          >
            <mesh
              geometry={mandarin}
              scale={0.046}
              material={m.peel}
              castShadow
              receiveShadow
            />
            <Cylinder
              position={[0, 0.037, 0]}
              radius={0.006}
              height={0.002}
              color="#677040"
              segments={6}
            />
            <Cylinder
              position={[0, 0.039, 0]}
              radius={0.0018}
              height={0.005}
              color="#58523b"
              segments={6}
            />
          </group>
        );
      })}
      <group position={[-0.08, 0.032, 0.07]} rotation={[0, 0.2, -0.2]}>
        {Array.from({ length: 5 }, (_, i) => (
          <mesh
            key={i}
            geometry={foodGeometry.grain}
            position={[i * 0.012, 0, Math.sin(i) * 0.007]}
            scale={[0.009, 0.012, 0.025]}
            rotation={[0, i * 0.1, 0]}
            material={m.peel}
            castShadow
          />
        ))}
      </group>
    </group>
  );
}

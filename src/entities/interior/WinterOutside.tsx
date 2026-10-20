import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import {
  BufferAttribute,
  CanvasTexture,
  MeshBasicMaterial,
  NearestFilter,
  Points,
  SRGBColorSpace,
} from "three";
import { Box } from "../../shared/ui/Geometry";

// An unlit backdrop keeps the sky visible independently of the indoor lamp.
// The low-resolution dither belongs to the scene's existing pixel texture style.
function createSkyMaterial() {
  const canvas = document.createElement("canvas");
  canvas.width = 32;
  canvas.height = 64;
  const context = canvas.getContext("2d")!;
  for (let y = 0; y < 64; y++) {
    const t = y / 63;
    for (let x = 0; x < 32; x++) {
      const dither = ((x + y) % 2) * 3;
      const r = Math.round(88 + t * 48 + dither);
      const g = Math.round(109 + t * 39 + dither);
      const b = Math.round(134 + t * 23 + dither);
      context.fillStyle = `rgb(${r},${g},${b})`;
      context.fillRect(x, y, 1, 1);
    }
  }
  const map = new CanvasTexture(canvas);
  map.colorSpace = SRGBColorSpace;
  map.minFilter = map.magFilter = NearestFilter;
  map.generateMipmaps = false;
  return new MeshBasicMaterial({ map, toneMapped: false });
}

function Snow() {
  const points = useRef<Points>(null);
  const positions = useMemo(() => {
    const p = new Float32Array(420 * 3);
    for (let i = 0; i < 420; i++) {
      p[i * 3] = (Math.random() - 0.5) * 12;
      p[i * 3 + 1] = Math.random() * 7;
      p[i * 3 + 2] = -3.35 - Math.random() * 2.6;
    }
    return p;
  }, []);
  useFrame((_, dt) => {
    if (!points.current) return;
    const a = points.current.geometry.attributes.position as BufferAttribute;
    for (let i = 0; i < a.count; i++) {
      a.array[i * 3 + 1] -= dt * (0.18 + (i % 5) * 0.035);
      a.array[i * 3] += dt * 0.025;
      if (a.array[i * 3 + 1] < 0) a.array[i * 3 + 1] = 6;
    }
    a.needsUpdate = true;
  });
  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#e7edef"
        size={0.032}
        sizeAttenuation
        transparent
        opacity={0.8}
        depthWrite={false}
        toneMapped={false}
      />
    </points>
  );
}

export function WinterOutside() {
  const sky = useMemo(createSkyMaterial, []);
  return (
    <group>
      <Box
        position={[0, 1.8, -6.5]}
        size={[20, 12, 0.1]}
        material={sky}
        castShadow={false}
        receiveShadow={false}
      />
      <Snow />
    </group>
  );
}

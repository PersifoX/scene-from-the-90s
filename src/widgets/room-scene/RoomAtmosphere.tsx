import { useEffect, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { AdditiveBlending, ShaderMaterial } from "three";

const vertexShader = /* glsl */ `
  uniform float uTime;
  attribute float aPhase;
  varying float vLight;
  void main() {
    vec3 p = position;
    p.x += sin(uTime * 0.12 + aPhase) * 0.07;
    p.y += sin(uTime * 0.19 + aPhase * 2.0) * 0.09;
    p.z += cos(uTime * 0.09 + aPhase) * 0.06;
    vec4 eye = modelViewMatrix * vec4(p, 1.0);
    float windowLight = exp(-abs(p.z + 2.2) * 0.85);
    vLight = windowLight * (0.65 + 0.35 * sin(aPhase + uTime * 0.25));
    gl_PointSize = clamp(5.0 / -eye.z, 1.1, 2.7);
    gl_Position = projectionMatrix * eye;
  }
`;
const fragmentShader = /* glsl */ `
  varying float vLight;
  void main() {
    float radius = length(gl_PointCoord - 0.5);
    float alpha = (1.0 - smoothstep(0.08, 0.48, radius)) * vLight * 0.28;
    gl_FragColor = vec4(0.83, 0.87, 0.78, alpha);
  }
`;

export function RoomAtmosphere({ reducedMotion }: { reducedMotion: boolean }) {
  const { positions, phases, material } = useMemo(() => {
    let seed = 73;
    const random = () => (seed = (seed * 1664525 + 1013904223) >>> 0) / 2 ** 32;
    const positions = new Float32Array(96 * 3);
    const phases = new Float32Array(96);
    for (let i = 0; i < phases.length; i++) {
      positions.set(
        [-1.9 + random() * 3.7, 0.65 + random() * 1.8, -2.5 + random() * 3.5],
        i * 3,
      );
      phases[i] = random() * Math.PI * 2;
    }
    return {
      positions,
      phases,
      material: new ShaderMaterial({
        uniforms: { uTime: { value: 0 } },
        vertexShader,
        fragmentShader,
        transparent: true,
        depthWrite: false,
        blending: AdditiveBlending,
        toneMapped: false,
      }),
    };
  }, []);
  useEffect(() => () => material.dispose(), [material]);
  useFrame((_, dt) => {
    if (!reducedMotion) material.uniforms.uTime.value += dt;
  });
  return (
    <>
      <fog attach="fog" args={["#8d928a", 6, 24]} />
      <points material={material} raycast={() => {}}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-aPhase" args={[phases, 1]} />
        </bufferGeometry>
      </points>
    </>
  );
}

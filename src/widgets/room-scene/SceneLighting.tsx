import { useMemo } from "react";
import { SoftShadows } from "@react-three/drei";
import { Object3D } from "three";
import { RectAreaLightUniformsLib } from "three/addons/lights/RectAreaLightUniformsLib.js";
RectAreaLightUniformsLib.init();

export function SceneLighting({
  enhanced,
  compact,
}: {
  enhanced: boolean;
  compact: boolean;
}) {
  const [ceilingTarget, windowTarget] = useMemo(() => {
    const ceiling = new Object3D(),
      window = new Object3D();
    ceiling.position.set(-0.45, 0.4, 0.28);
    window.position.set(0.2, 0.1, 1.1);
    return [ceiling, window];
  }, []);
  return (
    <>
      <SoftShadows
        size={enhanced ? 18 : 14}
        samples={compact ? 6 : 10}
        focus={0.35}
      />
      <primitive object={ceilingTarget} />
      <primitive object={windowTarget} />
      <ambientLight intensity={enhanced ? 0.14 : 0.52} color="#e9e5d4" />
      <hemisphereLight args={["#dce6ee", "#8c7257", enhanced ? 0.36 : 0.8]} />
      <rectAreaLight
        position={[-0.12, 2.58, 0.05]}
        rotation={[-Math.PI / 2, 0, 0]}
        width={1.8}
        height={1.3}
        intensity={enhanced ? 3 : 1.8}
        color="#fff0d8"
      />
      {/* Below the chandelier's metal bowl, so it cannot block its own key light. */}
      <spotLight
        position={[-0.12, 2.16, 0.05]}
        target={ceilingTarget}
        angle={1.12}
        penumbra={0.85}
        intensity={enhanced ? 8.5 : 6}
        distance={10}
        decay={2}
        color="#ffebcc"
        castShadow
        shadow-mapSize={compact ? [1024, 1024] : [2048, 2048]}
        shadow-camera-near={0.1}
        shadow-camera-far={10}
        shadow-bias={-0.00006}
        shadow-normalBias={0.003}
      />
      <rectAreaLight
        position={[-0.42, 1.72, -2.63]}
        rotation={[0, Math.PI, 0]}
        width={2.8}
        height={1.7}
        intensity={enhanced ? 2.2 : 3.5}
        color="#bfd8f0"
      />
      {enhanced && (
        <spotLight
          position={[-0.85, 2.35, -2.98]}
          target={windowTarget}
          angle={0.68}
          penumbra={0.9}
          intensity={8}
          distance={10}
          decay={2}
          color="#b5cfee"
          castShadow={!compact}
          shadow-mapSize={[1024, 1024]}
          shadow-camera-near={0.1}
          shadow-camera-far={10}
          shadow-bias={-0.00008}
          shadow-normalBias={0.006}
        />
      )}
      <rectAreaLight
        position={[1.83, 1.7, -2.63]}
        rotation={[0, Math.PI, 0]}
        width={0.7}
        height={1.9}
        intensity={enhanced ? 1.2 : 2}
        color="#bfd8f0"
      />
      <rectAreaLight
        position={[0.9, 1.8, 2.8]}
        width={2.6}
        height={1.8}
        intensity={enhanced ? 0.65 : 1.2}
        color="#ece3d2"
      />
    </>
  );
}

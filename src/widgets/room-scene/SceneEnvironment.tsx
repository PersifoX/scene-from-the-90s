import { Environment, Lightformer } from "@react-three/drei";

/** Static room-shaped reflection light: no network HDRI or per-frame cube capture. */
export function SceneEnvironment() {
  return (
    <Environment resolution={128} frames={1} environmentIntensity={0.42}>
      <Lightformer
        form="rect"
        color="#ffedcc"
        intensity={3.2}
        position={[-0.12, 2.65, 0.05]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={[2.2, 1.4, 1]}
      />
      <Lightformer
        form="rect"
        color="#c5def6"
        intensity={2.5}
        position={[-0.42, 1.7, -2.75]}
        scale={[2.8, 1.7, 1]}
      />
      <Lightformer
        form="rect"
        color="#f6e5ce"
        intensity={0.9}
        position={[0.7, 1.5, 3]}
        rotation={[0, Math.PI, 0]}
        scale={[3.5, 2, 1]}
      />
      <Lightformer
        form="circle"
        color="#ffd5a1"
        intensity={2}
        position={[2.15, 1.1, -0.54]}
        rotation={[0, -Math.PI / 2, 0]}
        scale={0.6}
      />
    </Environment>
  );
}

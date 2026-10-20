import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import {
  Bloom,
  DepthOfField,
  EffectComposer,
  N8AO,
  Noise,
  Vignette,
} from "@react-three/postprocessing";
import { BlendFunction, DepthOfFieldEffect } from "postprocessing";
import { Vector3 } from "three";
import { CAMERA_VIEWS, type View } from "../../features/camera-navigation";
import { RoomGrade } from "./RoomGrade";

function FocusPull({ view }: { view: View }) {
  const effect = useRef<DepthOfFieldEffect>(null);
  const focus = useRef(new Vector3(...CAMERA_VIEWS[view].target));
  useFrame(({ camera }, dt) => {
    if (!effect.current) return;
    const [x, y, z] = CAMERA_VIEWS[view].target;
    const blend = 1 - Math.exp(-5 * dt);
    focus.current.x += (x - focus.current.x) * blend;
    focus.current.y += (y - focus.current.y) * blend;
    focus.current.z += (z - focus.current.z) * blend;
    effect.current.cocMaterial.worldFocusDistance = camera.position.distanceTo(
      focus.current,
    );
  });
  return (
    <DepthOfField
      ref={effect}
      worldFocusDistance={1}
      worldFocusRange={0.36}
      bokehScale={1.4}
      resolutionScale={0.5}
    />
  );
}
export function SceneEffects({
  enhanced,
  compact,
  view,
}: {
  enhanced: boolean;
  compact: boolean;
  view: View;
}) {
  const size = useThree((state) => state.size);
  const detail = ![
    "room",
    "left",
    "table",
    "right",
    "desk",
    "picture",
  ].includes(view);
  return (
    <EffectComposer multisampling={0}>
      {enhanced && (
        <N8AO
          aoRadius={detail ? 0.13 : 0.25}
          distanceFalloff={0.7}
          intensity={1.65}
          color="#20180f"
          quality={compact ? "low" : "medium"}
          halfRes={compact || size.width > 1600}
        />
      )}
      {enhanced && detail && !compact && <FocusPull view={view} />}
      <Bloom
        mipmapBlur
        intensity={enhanced ? 0.34 : 0.24}
        luminanceThreshold={1.15}
        luminanceSmoothing={0.45}
      />
      {enhanced && <RoomGrade />}
      <Noise
        premultiply
        blendFunction={BlendFunction.SOFT_LIGHT}
        opacity={enhanced ? 0.07 : 0.14}
      />
      <Vignette offset={0.2} darkness={enhanced ? 0.3 : 0.23} eskil={false} />
    </EffectComposer>
  );
}

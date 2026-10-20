import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useProgress } from "@react-three/drei";
import type { View } from "../../features/camera-navigation";

/** Lights and furniture are fixed; refresh only while assets or props are moving. */
export function ShadowCache({
  view,
  cassette,
  enhanced,
  compact,
}: {
  view: View;
  cassette: boolean;
  enhanced: boolean;
  compact: boolean;
}) {
  const gl = useThree((state) => state.gl);
  const loading = useProgress((state) => state.active);
  const remaining = useRef(2);
  useEffect(() => {
    const autoUpdate = gl.shadowMap.autoUpdate;
    gl.shadowMap.autoUpdate = false;
    return () => {
      gl.shadowMap.autoUpdate = autoUpdate;
    };
  }, [gl]);
  useEffect(() => {
    remaining.current = 2;
    gl.shadowMap.needsUpdate = true;
  }, [gl, view, cassette, enhanced, compact, loading]);
  useFrame((_, dt) => {
    if (loading || remaining.current > 0) gl.shadowMap.needsUpdate = true;
    remaining.current -= dt;
  });
  return null;
}

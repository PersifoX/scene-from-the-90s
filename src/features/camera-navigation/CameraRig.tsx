import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Vector2, Vector3, PerspectiveCamera } from "three";
import { CAMERA_VIEWS, travelProgress } from "./model/navigation.mjs";
export type View = keyof typeof CAMERA_VIEWS;

export function CameraRig({
  view,
  reducedMotion,
  leftPanel = false,
  rightPanel = false,
}: {
  view: View;
  reducedMotion: boolean;
  leftPanel?: boolean;
  rightPanel?: boolean;
}) {
  const { camera, size } = useThree();
  const framing = useRef(new Vector2());
  const target = useRef(new Vector3(...CAMERA_VIEWS.room.target));
  const travel = useRef({
    from: camera.position.clone(),
    to: camera.position.clone(),
    fromTarget: target.current.clone(),
    toTarget: target.current.clone(),
    fromFov: CAMERA_VIEWS.room.fov,
    toFov: CAMERA_VIEWS.room.fov,
    elapsed: 0,
    duration: 0,
    lift: 0,
  });
  useEffect(() => {
    const shot = CAMERA_VIEWS[view];
    const position = new Vector3(...shot.position);
    const aspect = size.width / size.height;
    // A portrait overview must stay inside the open-front room shell.
    // Otherwise the wider vertical lens exposes the outside of the ceiling.
    if (view === "room" && aspect < 0.65) {
      position.set(0.45, 1.52, 2.65);
    }
    const fov = Math.min(
      100,
      (2 *
        Math.atan(
          Math.tan((shot.fov * Math.PI) / 360) * Math.max(1, 1.4 / aspect),
        ) *
        180) /
        Math.PI,
    );
    const distance = camera.position.distanceTo(position);
    travel.current = {
      from: camera.position.clone(),
      to: position,
      fromTarget: target.current.clone(),
      toTarget: new Vector3(...shot.target),
      fromFov: camera instanceof PerspectiveCamera ? camera.fov : fov,
      toFov: fov,
      elapsed: 0,
      duration: reducedMotion ? 0 : Math.min(1.65, 0.8 + distance * 0.1),
      lift: Math.min(0.12, distance * 0.018),
    };
  }, [camera, view, size.width, size.height, reducedMotion]);
  useFrame((_, delta) => {
    const t = travel.current;
    t.elapsed += delta;
    const progress =
      t.duration === 0 ? 1 : travelProgress(t.elapsed, t.duration);
    camera.position.lerpVectors(t.from, t.to, progress);
    camera.position.y += Math.sin(progress * Math.PI) * t.lift;
    target.current.lerpVectors(t.fromTarget, t.toTarget, progress);
    camera.lookAt(target.current);
    if (camera instanceof PerspectiveCamera) {
      const fov =
        t.fromFov +
        (t.toFov - t.fromFov) * progress +
        Math.sin(progress * Math.PI) * 1.8;
      camera.fov = fov;
      // Shift the projection into the space between HUD panels; keep the
      // photographed object frontal instead of turning the camera away from it.
      const wide = size.width > 700;
      const left = leftPanel ? (size.width > 1050 ? 310 : 265) : 0;
      const right = rightPanel ? 340 : 0;
      const x = wide ? (right - left) / 2 : 0;
      const y = !wide && rightPanel ? Math.min(150, size.height * 0.15) : 0;
      const blend = reducedMotion ? 1 : 1 - Math.exp(-delta * 8);
      framing.current.x += (x - framing.current.x) * blend;
      framing.current.y += (y - framing.current.y) * blend;
      camera.setViewOffset(
        size.width,
        size.height,
        framing.current.x,
        framing.current.y,
        size.width,
        size.height,
      );
    }
  });
  return null;
}

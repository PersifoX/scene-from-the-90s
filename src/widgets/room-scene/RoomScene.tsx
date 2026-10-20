import { FilmScreen } from "../../features/archive-media/FilmScreen";
import { Component, type ReactNode, useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { ACESFilmicToneMapping, PCFShadowMap } from "three";
import {
  CameraRig,
  type View,
  CAMERA_VIEWS,
  needsNavigation,
  resolveView,
} from "../../features/camera-navigation";
import {
  RoomShell,
  WallUnit,
  FestiveTable,
  SofaCorner,
  ComputerDesk,
  RoomDetails,
} from "../../entities/interior";
import { SceneLighting } from "./SceneLighting";
import { SceneEffects } from "./SceneEffects";
import { SceneEnvironment } from "./SceneEnvironment";
import { RoomAtmosphere } from "./RoomAtmosphere";
import { ShadowCache } from "./ShadowCache";
type Props = {
  attachVideo: (video: HTMLVideoElement | null) => void;
  togglePlayback: () => void;
  view: View;
  reducedMotion: boolean;
  pixelated: boolean;
  enhanced: boolean;
  tvOn: boolean;
  film: number;
  leftPanel: boolean;
  rightPanel: boolean;
  radioOn: boolean;
  radioDial: number;
  cassette: boolean;
  toggleTv: () => void;
  toggleRadio: () => void;
  insertCassette: () => void;
  inspect: (id: string) => void;
  hover: (text: string | null) => void;
  ready: () => void;
  navigate: (view: View) => void;
};
class SceneBoundary extends Component<
  { children: ReactNode; onFailure: () => void },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onFailure();
  }
  render() {
    return this.state.failed ? (
      <div className="scene-error">
        <h2>Не удалось открыть 3D-комнату</h2>
        <p>
          Для сцены нужен браузер с WebGL. Попробуйте обновить страницу или
          включить аппаратное ускорение.
        </p>
        <button onClick={() => location.reload()}>Повторить</button>
      </div>
    ) : (
      this.props.children
    );
  }
}
function Ready({ callback }: { callback: () => void }) {
  useEffect(callback, [callback]);
  const sample = useRef({ time: 0, frames: 0 });
  useFrame(({ gl }, dt) => {
    if (!import.meta.env.DEV) return;
    sample.current.time += dt;
    sample.current.frames++;
    if (sample.current.time < 2) return;
    gl.domElement.dataset.frameMs = (
      (sample.current.time * 1000) /
      sample.current.frames
    ).toFixed(1);
    gl.domElement.dataset.drawCalls = String(gl.info.render.calls);
    sample.current = { time: 0, frames: 0 };
  });
  return null;
}
export function RoomScene(props: Props) {
  const [compact, setCompact] = useState(
    () => matchMedia("(max-width: 700px), (pointer: coarse)").matches,
  );
  useEffect(() => {
    const media = matchMedia("(max-width: 700px), (pointer: coarse)");
    const change = () => setCompact(media.matches);
    media.addEventListener("change", change);
    return () => media.removeEventListener("change", change);
  }, []);
  const route = (zone: View, action: () => void) => () =>
    needsNavigation(props.view, zone) ? props.navigate(zone) : action();
  const actions = () => ({
    inspect: (id: string) => {
      props.navigate(resolveView(id === "computer" ? "desk" : id) as View);
      props.inspect(id);
    },
    hover: (text: string | null) => props.hover(text),
  });
  const zone = (view: View) => ({
    onClick: (e: import("@react-three/fiber").ThreeEvent<MouseEvent>) => {
      e.stopPropagation();
      props.navigate(view);
    },
  });
  return (
    <SceneBoundary onFailure={props.ready}>
      <Canvas
        className={props.pixelated ? "room-canvas pixelated" : "room-canvas"}
        shadows
        dpr={props.pixelated ? 0.72 : Math.min(window.devicePixelRatio, 1.5)}
        camera={{
          position: CAMERA_VIEWS.room.position as [number, number, number],
          fov: CAMERA_VIEWS.room.fov,
          near: 0.05,
          far: 40,
        }}
        gl={{
          antialias: !props.pixelated,
          alpha: false,
          powerPreference: "high-performance",
        }}
        onCreated={({ gl }) => {
          gl.setClearColor("#211c18");
          gl.toneMapping = ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.1;
          gl.shadowMap.type = PCFShadowMap;
        }}
        fallback={
          <div className="scene-error">Браузер не поддерживает WebGL.</div>
        }
      >
        <Ready callback={props.ready} />
        <ShadowCache
          view={props.view}
          cassette={props.cassette}
          enhanced={props.enhanced}
          compact={compact}
        />
        <CameraRig
          view={props.view}
          reducedMotion={props.reducedMotion}
          leftPanel={props.leftPanel}
          rightPanel={props.rightPanel}
        />
        <SceneLighting enhanced={props.enhanced} compact={compact} />
        {props.enhanced && <SceneEnvironment />}
        {props.enhanced && (
          <RoomAtmosphere reducedMotion={props.reducedMotion} />
        )}
        <RoomShell />
        <RoomDetails />
        <SceneEffects
          enhanced={props.enhanced}
          compact={compact}
          view={props.view}
        />
        <group {...zone("left")}>
          <WallUnit
            {...props}
            {...actions()}
            radioFocused={props.view === "radio" || props.view === "books"}
            screen={
              props.tvOn && props.cassette && props.view === "tv" ? (
                <FilmScreen
                  index={props.film}
                  attachVideo={props.attachVideo}
                  toggle={props.togglePlayback}
                />
              ) : undefined
            }
            toggleTv={route("tv", props.toggleTv)}
            toggleRadio={route("radio", props.toggleRadio)}
            insertCassette={route("tv", props.insertCassette)}
          />
        </group>
        <group {...zone("table")}>
          <FestiveTable {...actions()} />
        </group>
        <group {...zone("right")}>
          <SofaCorner {...actions()} />
        </group>
        <group {...zone("desk")}>
          <ComputerDesk {...actions()} />
        </group>
      </Canvas>
    </SceneBoundary>
  );
}

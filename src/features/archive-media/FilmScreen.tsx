import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { PerspectiveCamera } from "three";
import { films } from "../../entities/interior/model/museum";
import { assetUrl } from "../../shared/lib/assetUrl";

type Props = {
  index: number;
  attachVideo: (video: HTMLVideoElement | null) => void;
  toggle: () => void;
};

/** A local HTML5 video anchored to the CRT's screen in 3D space. */
export function FilmScreen({ index, attachVideo, toggle }: Props) {
  const film = films[index];
  const content = useRef<HTMLDivElement>(null);
  const wrapper = useRef<HTMLElement | null>(null);
  useFrame(({ camera }) => {
    wrapper.current ??=
      content.current?.closest<HTMLElement>(".crt-projection") ?? null;
    if (!wrapper.current || !(camera instanceof PerspectiveCamera)) return;
    // Transformed Drei Html omits the camera's off-axis projection for HUD space.
    const view = camera.view;
    const x = view?.enabled ? -view.offsetX : 0;
    const y = view?.enabled ? -view.offsetY : 0;
    wrapper.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  });
  return (
    <Html
      ref={content}
      wrapperClass="crt-projection"
      transform
      distanceFactor={1}
      position={[0.01, 0.85, 0.42]}
      zIndexRange={[3, 1]}
    >
      <div
        className="crt-film"
        onPointerDown={(event) => event.stopPropagation()}
        onPointerUp={(event) => event.stopPropagation()}
        onClick={(event) => event.stopPropagation()}
      >
        <video
          key={film.id}
          ref={attachVideo}
          src={assetUrl(film.file)}
          playsInline
          preload="auto"
          role="button"
          tabIndex={0}
          aria-label={`Экран телевизора: ${film.title} — пуск / пауза`}
          onClick={(event) => {
            event.stopPropagation();
            toggle();
          }}
          onKeyDown={(event) => {
            if (event.key === " " || event.key === "Enter") {
              event.preventDefault();
              toggle();
            }
          }}
        />
        <div className="crt-scanlines" />
      </div>
    </Html>
  );
}

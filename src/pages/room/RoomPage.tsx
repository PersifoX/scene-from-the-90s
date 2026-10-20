import { useCallback, useEffect, useState } from "react";
import { RoomScene } from "../../widgets/room-scene";
import { assetUrl } from "../../shared/lib/assetUrl";
import {
  CAMERA_VIEWS,
  viewZone,
  viewForKey,
  isNavigationKey,
  type View,
} from "../../features/camera-navigation";
import { ExhibitPanel } from "../../features/exhibit-inspection";
import { ArchiveMediaControls } from "../../features/archive-media/ArchiveMedia";
import { useTelevisionPlayback } from "../../features/archive-media/useTelevisionPlayback";
import { TourControls } from "../../features/guided-tour/TourControls";
import {
  tour,
  artworks,
  radioTracks,
} from "../../entities/interior/model/museum";
export function RoomPage() {
  const [view, setView] = useState<View>("room");
  const [exhibit, setExhibit] = useState<string | null>(null);
  const [hover, setHover] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [pixelated, setPixelated] = useState(true);
  const [enhanced, setEnhanced] = useState(true);
  const [tvOn, setTvOn] = useState(false);
  const [radioOn, setRadioOn] = useState(false);
  const [cassette, setCassette] = useState(false);
  const [film, setFilm] = useState(0);
  const [station, setStation] = useState(0);
  const [tourIndex, setTourIndex] = useState<number | null>(null);
  const playback = useTelevisionPlayback(tvOn && cassette && view === "tv");
  const [reducedMotion, setReducedMotion] = useState(
    () => matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const onReady = useCallback(() => setReady(true), []);
  const navigate = useCallback((next: View) => {
    setView(next);
    setExhibit(null);
    setHover(null);
    document.body.style.cursor = "";
  }, []);
  const explore = useCallback(
    (next: View) => {
      setTourIndex(null);
      navigate(next);
    },
    [navigate],
  );
  const selectStep = useCallback(
    (index: number | null) => {
      setTourIndex(index);
      if (index !== null) {
        navigate(tour[index].view as View);
        setFilm(tour[index].film ?? 0);
      }
    },
    [navigate],
  );
  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (
        e.target instanceof Element &&
        e.target.closest("input,select,textarea,[contenteditable]")
      )
        return;
      if (e.key === "Escape" && exhibit) {
        setExhibit(null);
        return;
      }
      if (tourIndex !== null && ["ArrowLeft", "ArrowRight"].includes(e.key)) {
        e.preventDefault();
        selectStep(
          Math.max(
            0,
            Math.min(
              tour.length - 1,
              tourIndex + (e.key === "ArrowRight" ? 1 : -1),
            ),
          ),
        );
      } else if (isNavigationKey(e.key))
        explore(viewForKey(e.key, view) as View);
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [exhibit, explore, view, tourIndex, selectStep]);
  useEffect(() => {
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    const fn = () => setReducedMotion(media.matches);
    media.addEventListener("change", fn);
    return () => media.removeEventListener("change", fn);
  }, []);
  useEffect(() => {
    if (view !== "tv") setTvOn(false);
    if (view !== "radio") setRadioOn(false);
  }, [view]);
  const toggleTv = () => {
    navigate("tv");
    setTvOn((v) => !v);
    setRadioOn(false);
  };
  const toggleRadio = () => {
    navigate("radio");
    setRadioOn((v) => !v);
    setTvOn(false);
  };
  const insertCassette = () => {
    navigate("tv");
    setCassette((v) => !v);
    setTvOn(!cassette);
    setRadioOn(false);
  };
  return (
    <main className={tourIndex !== null ? "tour-active" : undefined}>
      <RoomScene
        attachVideo={playback.attachVideo}
        togglePlayback={playback.toggle}
        leftPanel={tourIndex !== null}
        rightPanel={Boolean(exhibit) || viewZone(view) === "left"}
        view={view}
        reducedMotion={reducedMotion}
        pixelated={pixelated}
        enhanced={enhanced}
        tvOn={tvOn}
        radioOn={radioOn}
        radioDial={station / (radioTracks.length - 1)}
        film={film}
        cassette={cassette}
        toggleTv={toggleTv}
        toggleRadio={toggleRadio}
        insertCassette={insertCassette}
        inspect={setExhibit}
        hover={setHover}
        ready={onReady}
        navigate={explore}
      />
      <header className="header">
        <div>
          <h1>
            Когда родители
            <br />
            были маленькими
          </h1>
          <p>Домашние истории · 1980–1990-е</p>
        </div>
        <section className="header-actions" aria-label="Режим осмотра">
          <button
            className="tour-toggle"
            onClick={() => selectStep(tourIndex === null ? 0 : null)}
          >
            {tourIndex === null ? "Начать экскурсию →" : "Свободный осмотр"}
          </button>
          <button
            className="texture-toggle"
            aria-pressed={pixelated}
            onClick={() => setPixelated((v) => !v)}
          >
            {pixelated ? "Пиксели: вкл." : "Пиксели: выкл."}
          </button>
          <button
            className="texture-toggle"
            aria-pressed={enhanced}
            onClick={() => setEnhanced((v) => !v)}
          >
            {enhanced ? "Эффекты: вкл." : "Эффекты: выкл."}
          </button>
        </section>
      </header>
      {!ready && (
        <div className="loading" role="status">
          Собираем комнату…
        </div>
      )}
      <div className="view-caption" key={view} aria-live="polite">
        {view === "room"
          ? "Осмотритесь или начните экскурсию."
          : CAMERA_VIEWS[view].label}
      </div>
      {hover && (
        <div className="hover-label" key={hover}>
          {hover}
        </div>
      )}
      {tourIndex !== null && (
        <TourControls
          index={tourIndex}
          select={selectStep}
          details={setExhibit}
        />
      )}
      <ExhibitPanel id={exhibit} onClose={() => setExhibit(null)} />
      {viewZone(view) === "left" && !exhibit && (
        <ArchiveMediaControls
          playback={playback}
          mode={view === "radio" ? "radio" : "tv"}
          tvOn={tvOn}
          radioOn={radioOn}
          cassette={cassette}
          film={film}
          station={station}
          selectFilm={(index) => {
            navigate("tv");
            setFilm(index);
            if (cassette) setTvOn(true);
          }}
          selectStation={setStation}
          insertCassette={insertCassette}
          toggleTv={toggleTv}
          toggleRadio={toggleRadio}
          inspect={setExhibit}
        />
      )}
      {viewZone(view) === "left" && (
        <div className="shot-controls" aria-label="Крупный план">
          <button aria-pressed={view === "tv"} onClick={() => explore("tv")}>
            К телевизору
          </button>
          <button
            aria-pressed={view === "radio"}
            onClick={() => explore("radio")}
          >
            К радио
          </button>
        </div>
      )}
      {viewZone(view) === "right" && (
        <div className="shot-controls">
          <button
            aria-pressed={view === "picture"}
            onClick={() => explore("picture")}
          >
            К картинам
          </button>
          {["picture", "portrait1", "portrait2", "portrait3"].includes(view) &&
            artworks.map((artwork) => (
              <button
                key={artwork.id}
                aria-pressed={view === artwork.id}
                onClick={() => {
                  explore(artwork.id);
                  setExhibit(artwork.id);
                }}
              >
                {artwork.name}
              </button>
            ))}
          <button
            aria-pressed={view === "sofa"}
            onClick={() => {
              explore("sofa");
              setExhibit("sofa");
            }}
          >
            К дивану
          </button>
        </div>
      )}
      {viewZone(view) === "table" && (
        <div className="shot-controls" aria-label="Блюда на столе">
          {(
            [
              ["salad", "Оливье"],
              ["bread", "Хлеб с сахаром"],
              ["duck", "Утка"],
              ["cake", "Наполеон"],
              ["rice", "Кутья"],
              ["mandarins", "Мандарины"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              aria-pressed={view === id}
              onClick={() => {
                explore(id);
                setExhibit(id);
              }}
            >
              {label}
            </button>
          ))}
        </div>
      )}
      <footer>
        <nav aria-label="Перемещение по комнате">
          {(["room", "left", "table", "right", "desk"] as const).map(
            (id, i) => (
              <button
                key={id}
                aria-current={viewZone(view) === id ? "location" : undefined}
                onClick={() => {
                  explore(id);
                  if (id === "desk") setExhibit("computer");
                }}
              >
                <span className="key">{i}</span>
                {
                  {
                    room: "Общий вид",
                    left: "Стенка",
                    table: "Стол",
                    right: "Диван",
                    desk: "Компьютер",
                  }[id]
                }
              </button>
            ),
          )}
        </nav>
        <div className="footer-note">
          <span>
            <a href={assetUrl("SOURCES.html")} target="_blank" rel="noreferrer">
              Источники
            </a>{" "}
            ·{" "}
            <a
              href={assetUrl("SCENARIO.html")}
              target="_blank"
              rel="noreferrer"
            >
              Сценарий показа
            </a>{" "}
            ·{" "}
            <a
              href={assetUrl("ASSET-CREDITS.txt")}
              target="_blank"
              rel="noreferrer"
            >
              Графика
            </a>
          </span>
          <span>
            {tourIndex !== null
              ? "← → — маршрут · Esc — осмотр"
              : "Нажмите на предмет · Esc — назад"}
          </span>
        </div>
      </footer>
    </main>
  );
}

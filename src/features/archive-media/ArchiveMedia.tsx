import { useEffect, useRef, useState } from "react";
import type { TelevisionPlayback } from "./useTelevisionPlayback";
import {
  films,
  radioTracks,
  sources,
} from "../../entities/interior/model/museum";
const clock = (seconds: number) =>
  `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, "0")}`;
function RadioPlayer({ index }: { index: number }) {
  const track = radioTracks[index];
  const ref = useRef<HTMLAudioElement>(null);
  const previewEnd = useRef<number | null>(null);
  const [status, setStatus] = useState("Нажмите пуск, чтобы послушать запись.");
  useEffect(() => {
    const player = ref.current;
    return () => {
      player?.pause();
    };
  }, []);
  function preview() {
    const player = ref.current!;
    player.currentTime = 0;
    previewEnd.current = 30;
    player
      .play()
      .catch(() =>
        setStatus(
          "Запись не запустилась. Откройте страницу архива по ссылке ниже.",
        ),
      );
  }
  return (
    <div className="archive-recording">
      <span className="exhibit-era">Архивная запись · {track.year}</span>
      <h3>{track.title}</h3>
      <p>{track.description}</p>
      <audio
        ref={ref}
        controls
        preload="none"
        aria-label={`${track.station}, ${track.year}`}
        src={track.stream}
        onPlaying={() => setStatus("Звучит подлинная архивная запись.")}
        onPause={() => setStatus("Запись на паузе.")}
        onEnded={() => setStatus("Запись завершена.")}
        onError={() =>
          setStatus(
            "Архив сейчас недоступен. Откройте источник или попробуйте позже.",
          )
        }
        onTimeUpdate={() => {
          const player = ref.current!;
          if (
            previewEnd.current !== null &&
            player.currentTime >= previewEnd.current
          ) {
            player.pause();
            previewEnd.current = null;
          }
        }}
      />
      <button onClick={preview}>Слушать первые 30 секунд</button>
      <span role="status" className="source-note">
        {status}
      </span>
      <a href={sources[track.source].url} target="_blank" rel="noreferrer">
        Запись и описание в архиве ↗
      </a>
    </div>
  );
}
type Props = {
  mode: "tv" | "radio";
  tvOn: boolean;
  radioOn: boolean;
  cassette: boolean;
  film: number;
  station: number;
  selectFilm: (index: number) => void;
  selectStation: (index: number) => void;
  insertCassette: () => void;
  toggleTv: () => void;
  toggleRadio: () => void;
  inspect: (id: string) => void;
  playback: TelevisionPlayback;
};
export function ArchiveMediaControls(props: Props) {
  const film = films[props.film];
  return (
    <aside
      className="media-controls"
      aria-label={props.mode === "tv" ? "Видеотека" : "Радиоархив"}
    >
      <span className="exhibit-era">
        {props.mode === "tv" ? "04 · Домашний экран" : "05 · Радио в доме"}
      </span>
      <h2>{props.mode === "tv" ? "Поставим кассету" : "Поймаем волну"}</h2>
      {props.mode === "tv" ? (
        <>
          <label className="media-select">
            Фильм
            <select
              value={props.film}
              onChange={(e) => props.selectFilm(Number(e.target.value))}
            >
              {films.map((f, i) => (
                <option key={f.id} value={i}>
                  {f.title} · {f.year}
                </option>
              ))}
            </select>
          </label>
          <p>
            {film.director} · фрагмент {film.duration}
            <br />«{film.clip}»
          </p>
          <p>{film.context}</p>
          <div className="media-buttons">
            <button onClick={props.insertCassette}>
              {props.cassette ? "Извлечь кассету" : "Вставить кассету"}
            </button>
            <button aria-pressed={props.tvOn} onClick={props.toggleTv}>
              ТВ {props.tvOn ? "вкл." : "выкл."}
            </button>
          </div>
          {props.playback.active ? (
            <div className="tv-playback" aria-label="Управление фильмом">
              <button
                onClick={props.playback.toggle}
                aria-pressed={props.playback.playing}
              >
                {props.playback.playing ? "Ⅱ Пауза" : "▶ Пуск"}
              </button>
              <label>
                {clock(props.playback.time)} / {clock(props.playback.duration)}
                <input
                  aria-label="Перемотка фильма"
                  type="range"
                  min="0"
                  max={props.playback.duration || 1}
                  step="0.1"
                  value={Math.min(props.playback.time, props.playback.duration)}
                  disabled={!props.playback.duration}
                  onChange={(event) =>
                    props.playback.seek(Number(event.target.value))
                  }
                />
              </label>
              <label>
                Громкость · {Math.round(props.playback.volume * 100)}%
                <input
                  aria-label="Громкость телевизора"
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={props.playback.volume}
                  onChange={(event) =>
                    props.playback.setVolume(Number(event.target.value))
                  }
                />
              </label>
              <p className="source-note" role="status">
                {props.playback.status}
              </p>
            </div>
          ) : (
            <p>Вставьте кассету, чтобы посмотреть настоящий кинофрагмент.</p>
          )}
          <a
            href={`https://rutube.ru/video/${film.id}/`}
            target="_blank"
            rel="noreferrer"
          >
            Фрагмент на канале «Мосфильма» ↗
          </a>
          <p className="source-note">
            Фрагмент загружается с сервера музея и воспроизводится на экране
            телевизора.
          </p>
          <button className="text-button" onClick={() => props.inspect("tv")}>
            О кино как источнике
          </button>
        </>
      ) : (
        <>
          <label className="tuner">
            Архивная шкала · {props.station + 1} / {radioTracks.length}
            <input
              aria-label="Архивная шкала"
              type="range"
              min="0"
              max={radioTracks.length - 1}
              step="1"
              value={props.station}
              onChange={(e) => props.selectStation(Number(e.target.value))}
            />
          </label>
          <div className="station-buttons">
            {radioTracks.map((t, i) => (
              <button
                key={t.id}
                aria-pressed={i === props.station}
                onClick={() => props.selectStation(i)}
              >
                {t.station}
                <small>{t.year}</small>
              </button>
            ))}
          </div>
          <button
            className="radio-power"
            aria-pressed={props.radioOn}
            onClick={props.toggleRadio}
          >
            {props.radioOn ? "Выключить приёмник" : "Включить приёмник"}
          </button>
          {props.radioOn && (
            <RadioPlayer
              key={radioTracks[props.station].id}
              index={props.station}
            />
          )}
          <p className="source-note">
            Шкала выбирает архивы, а не реальные частоты. Каталоги «Старое
            Радио» и «Свидетель»; для воспроизведения нужен интернет.
          </p>
          <button
            className="text-button"
            onClick={() => props.inspect("radio")}
          >
            Радиостанции и переход к 1990-м
          </button>
        </>
      )}
    </aside>
  );
}

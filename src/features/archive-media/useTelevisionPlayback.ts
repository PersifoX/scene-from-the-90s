import { useEffect, useState } from "react";

export function useTelevisionPlayback(active: boolean) {
  const [video, attachVideo] = useState<HTMLVideoElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.65);
  const [status, setStatus] = useState(
    "Вставьте кассету и включите телевизор.",
  );

  useEffect(() => {
    if (!video) return;
    setTime(0);
    setDuration(0);
    setPlaying(false);
    const handlers = {
      loadedmetadata: () => setDuration(video.duration),
      timeupdate: () => setTime(video.currentTime),
      playing: () => {
        setPlaying(true);
        setStatus("Идёт кино. Нажмите на экран, чтобы поставить на паузу.");
      },
      pause: () => {
        setPlaying(false);
        setStatus("Пауза. Нажмите «Пуск» или на экран телевизора.");
      },
      waiting: () => setStatus("Загружаем фрагмент…"),
      ended: () => {
        setPlaying(false);
        setStatus("Фрагмент закончился. Можно запустить его снова.");
      },
      error: () => {
        setPlaying(false);
        setStatus(
          "Не удалось загрузить видео. Обновите страницу и попробуйте снова.",
        );
      },
    };
    for (const [event, handler] of Object.entries(handlers))
      video.addEventListener(event, handler);
    return () => {
      for (const [event, handler] of Object.entries(handlers))
        video.removeEventListener(event, handler);
      video.pause();
      video.removeAttribute("src");
      video.load();
    };
  }, [video]);

  useEffect(() => {
    if (video) video.volume = volume;
  }, [video, volume]);

  useEffect(() => {
    if (!video) return;
    if (!active) {
      video.pause();
      video.currentTime = 0;
      return;
    }
    let cancelled = false;
    video.play().catch((error: DOMException) => {
      if (!cancelled && error.name !== "AbortError")
        setStatus("Нажмите «Пуск», чтобы включить видео со звуком.");
    });
    return () => {
      cancelled = true;
      video.pause();
    };
  }, [video, active]);

  function toggle() {
    if (!video || !active) return;
    if (!video.paused) video.pause();
    else {
      if (video.ended) video.currentTime = 0;
      video
        .play()
        .catch(() =>
          setStatus("Не удалось запустить видео. Попробуйте ещё раз."),
        );
    }
  }

  function seek(value: number) {
    if (video && Number.isFinite(video.duration)) {
      video.currentTime = Math.max(0, Math.min(value, video.duration));
      setTime(video.currentTime);
    }
  }

  return {
    video,
    attachVideo,
    playing,
    time,
    duration,
    volume,
    setVolume,
    status,
    toggle,
    seek,
    active,
  };
}

export type TelevisionPlayback = ReturnType<typeof useTelevisionPlayback>;

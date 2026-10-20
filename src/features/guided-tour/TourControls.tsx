import { tour } from "../../entities/interior/model/museum";
export function TourControls({
  index,
  select,
  details,
}: {
  index: number;
  select: (index: number | null) => void;
  details: (id: string) => void;
}) {
  const step = tour[index];
  return (
    <aside className="tour-controls" aria-label="Экскурсия">
      <span className="exhibit-era">
        {step.hall} · {index + 1} / {tour.length}
      </span>
      <h2>{step.title}</h2>
      <p key={index} aria-live="polite">
        {step.text}
      </p>
      <div
        className="tour-progress"
        role="progressbar"
        aria-label="Маршрут экскурсии"
        aria-valuemin={1}
        aria-valuemax={tour.length}
        aria-valuenow={index + 1}
      >
        <span style={{ width: `${((index + 1) / tour.length) * 100}%` }} />
      </div>
      <div className="tour-buttons">
        <button
          disabled={index === 0}
          onClick={() => select(index - 1)}
          aria-label="Предыдущий экспонат"
        >
          ←
        </button>
        {step.exhibit && (
          <button onClick={() => details(step.exhibit!)}>Подробнее</button>
        )}
        <button
          onClick={() => select(index === tour.length - 1 ? null : index + 1)}
        >
          {index === tour.length - 1 ? "Осмотреться" : "Дальше →"}
        </button>
      </div>
    </aside>
  );
}

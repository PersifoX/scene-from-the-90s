import { exhibits, sources } from "../../entities/interior/model/museum";
export function ExhibitPanel({
  id,
  onClose,
}: {
  id: string | null;
  onClose: () => void;
}) {
  if (!id || !exhibits[id]) return null;
  const exhibit = exhibits[id];
  return (
    <aside key={id} className="exhibit-panel" aria-label={exhibit.title}>
      <button
        className="panel-close"
        onClick={onClose}
        aria-label="Закрыть описание"
      >
        ×
      </button>
      <span className="exhibit-era">{exhibit.era}</span>
      <h2>{exhibit.title}</h2>
      <p>{exhibit.description}</p>
      <p className="muted">{exhibit.detail}</p>
      {exhibit.sources.length ? (
        <details className="exhibit-sources">
          <summary>Источники экспоната</summary>
          {exhibit.sources.map((id) => (
            <a key={id} href={sources[id].url} target="_blank" rel="noreferrer">
              {sources[id].title} ↗
            </a>
          ))}
        </details>
      ) : (
        <span className="source-note">
          {id === "computer"
            ? "Источник: описание обстановки комнаты."
            : "Источник: записанный домашний рецепт."}
        </span>
      )}
    </aside>
  );
}

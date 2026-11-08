import { SOURCES } from "../data/incident";

export function SourceLinks({ ids, label = "Sources" }: { ids: (keyof typeof SOURCES)[]; label?: string }) {
  return (
    <p className="source-links">
      <span className="source-links__label">{label}:</span>{" "}
      {ids.map((id, i) => {
        const s = SOURCES[id];
        return (
          <span key={id}>
            <a href={s.url} target="_blank" rel="noopener noreferrer" title={s.title}>
              {s.publisher}
            </a>
            {i < ids.length - 1 ? ", " : ""}
          </span>
        );
      })}
    </p>
  );
}

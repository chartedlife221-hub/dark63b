import { ROADMAP } from "../data/project";

export function Roadmap() {
  return (
    <section className="section roadmap" id="roadmap" aria-labelledby="roadmap-title">
      <div className="wrap">
        <header className="section__head">
          <p className="section__index">Chapter six</p>
          <h2 className="section__title" id="roadmap-title">
            What comes next
          </h2>
          <p className="section__intro">
            Measured in things delivered, not in price. A phase is marked complete only when there is evidence to link
            to.
          </p>
        </header>

        <ol className="phases">
          {ROADMAP.map((p) => (
            <li className="phase" key={p.name} data-status={p.status}>
              <div className="phase__top">
                <span className="phase__name">{p.name}</span>
                <span className="status-pill" data-state={p.status === "In progress" ? "active" : p.status === "Complete" ? "live" : "pending"}>
                  {p.status}
                </span>
              </div>
              <h3 className="phase__title">{p.title}</h3>
              <ul>
                {p.deliverables.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

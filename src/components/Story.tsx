import { CHAPTERS, LAST_VERIFIED, MEASURES, SOURCES } from "../data/incident";
import { ScaleField } from "./ScaleField";
import { SourceLinks } from "./SourceLinks";

export function Story() {
  return (
    <section className="section story" id="story" aria-labelledby="story-title">
      <div className="wrap">
        <header className="section__head">
          <p className="section__index">Chapter one</p>
          <h2 className="section__title" id="story-title">
            The day crypto went dark
          </h2>
          <p className="section__intro">
            On the evening of October 29, 2026, attackers moved about $6.3 billion out of Binance hot wallets in
            roughly twenty minutes. It is the largest theft of digital assets on record. This is what is known, in
            the order it happened.
          </p>
          <p className="verified">
            Last checked {LAST_VERIFIED}. Investigations are ongoing and reported figures may change.
          </p>
        </header>

        <figure className="scale-field">
          <ScaleField />
          <figcaption className="scale-field__legend">
            <span className="legend-dot legend-dot--ash" aria-hidden="true" /> Each point is about $10 million taken.
            <span className="legend-dot legend-dot--gold" aria-hidden="true" /> Gold points were later frozen or
            intercepted (lower estimate).
          </figcaption>
        </figure>

        <div className="measures">
          {MEASURES.map((m) => (
            <article className="plaque" key={m.name}>
              <p className="plaque__figure">{m.figure}</p>
              <h3 className="plaque__name">{m.name}</h3>
              <p className="plaque__detail">{m.detail}</p>
              <SourceLinks ids={m.sources} />
            </article>
          ))}
        </div>
        <p className="measures__note">
          These are three different measures. Frozen funds are not the same as returned funds, and Binance covered
          users from its own reserves, not from recovered assets. Don't add or subtract them.
        </p>

        <ol className="timeline" aria-label="Timeline of the incident">
          {CHAPTERS.map((c, i) => (
            <li className="chapter" key={c.title} data-reveal>
              <span className="chapter__mark" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="chapter__body">
                <p className="chapter__when">
                  <time dateTime={c.datetime}>{c.when}</time>
                </p>
                <h3 className="chapter__title">{c.title}</h3>
                <p>{c.body}</p>
                <SourceLinks ids={c.sources} />
              </div>
            </li>
          ))}
        </ol>

        <details className="sources">
          <summary>All sources ({Object.keys(SOURCES).length})</summary>
          <ul>
            {Object.values(SOURCES).map((s) => (
              <li key={s.id}>
                <a href={s.url} target="_blank" rel="noopener noreferrer">
                  {s.title}
                </a>{" "}
                <span className="sources__meta">
                  {s.publisher}, {s.date}
                  {s.note ? `. ${s.note}` : ""}
                </span>
              </li>
            ))}
          </ul>
          <p className="sources__note">
            DARK6.3B is not affiliated with Binance. Where a figure differs between sources, this page says so rather
            than choosing one.
          </p>
        </details>
      </div>
    </section>
  );
}

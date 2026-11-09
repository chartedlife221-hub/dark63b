const PILLARS = [
  {
    name: "Remember",
    body: "Keep an accurate record of October 29: what happened, when, and what is still unknown. Sourced, dated, and corrected when the facts change.",
  },
  {
    name: "Educate",
    body: "Turn the method of the attack into lessons anyone can use. This breach started with a job interview and a download, and the same tricks are aimed at ordinary holders every day.",
  },
  {
    name: "Give back",
    body: "Once the community coin launches on pump.fun, direct its creator fees to documented public-benefit causes, and publish every step so anyone can check it.",
  },
];

const LESSONS = [
  {
    title: "Be suspicious of job offers that ask you to run code",
    body: "A take-home test, a repo to clone, a meeting app to install. Run nothing from a stranger on a machine that holds keys or work access.",
  },
  {
    title: "Install tools only from their official source",
    body: "Search ads and look-alike sites are a common way to plant a trojanized installer. Type the address yourself.",
  },
  {
    title: "Keep on an exchange only what you're actively using",
    body: "Hold the rest in self-custody you understand, and keep your recovery phrase offline.",
  },
  {
    title: "Expect recovery scams after every hack",
    body: "No real exchange, investigator or project will ask for your seed phrase or a fee to return funds.",
  },
  {
    title: "Use a hardware security key",
    body: "Protect your exchange and email accounts with a physical key rather than SMS codes.",
  },
];

export function Mission() {
  return (
    <section className="section mission" id="mission" aria-labelledby="mission-title">
      <div className="wrap">
        <header className="section__head section__head--center">
          <p className="section__index">Chapter two</p>
          <h2 className="section__title" id="mission-title">
            From darkness to purpose
          </h2>
        </header>

        <blockquote className="mission__quote" data-depth="0.05">
          <p>Some moments change an industry forever. What we choose to build afterward defines us.</p>
        </blockquote>

        <div className="pillars">
          {PILLARS.map((p) => (
            <article className="pillar" key={p.name} data-reveal>
              <span className="pillar__light" aria-hidden="true" />
              <h3 className="pillar__name">{p.name}</h3>
              <p>{p.body}</p>
            </article>
          ))}
        </div>

        <div className="lessons" id="security">
          <h3 className="lessons__title">What October 29 teaches every holder</h3>
          <ul className="lessons__list">
            {LESSONS.map((l) => (
              <li key={l.title}>
                <strong>{l.title}.</strong> {l.body}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

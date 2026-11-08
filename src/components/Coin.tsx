import { CHANNELS, TOKEN } from "../data/project";

const PENDING = "Not yet announced";

export function Coin() {
  const rows: [string, string | null][] = [
    ["Blockchain network", TOKEN.network],
    ["Official contract", TOKEN.contract],
    ["Total supply", TOKEN.totalSupply],
    ["Creator-fee mechanism", TOKEN.creatorFeeMechanism],
    ["Verified social channels", CHANNELS.length ? CHANNELS.map((c) => c.name).join(", ") : null],
  ];

  return (
    <section className="section coin" id="coin" aria-labelledby="coin-title">
      <div className="wrap coin__grid">
        <header className="section__head">
          <p className="section__index">Chapter three</p>
          <h2 className="section__title" id="coin-title">
            The community coin
          </h2>
          <p className="section__intro">
            DARK6.3B is planned as a community token: a symbol of remembrance and shared participation. It is not an
            investment, and nothing here promises a financial return.
          </p>
        </header>

        <div className="coin__card">
          <div className="coin__status">
            <span className="status-pill" data-state={TOKEN.launched ? "live" : "pending"}>
              {TOKEN.launched ? "Launched" : "Not yet launched"}
            </span>
          </div>
          <dl className="facts">
            {rows.map(([k, v]) => (
              <div className="facts__row" key={k}>
                <dt>{k}</dt>
                <dd data-pending={v ? undefined : true}>{v ?? PENDING}</dd>
              </div>
            ))}
          </dl>
          <p className="coin__warning" role="note">
            Until a contract address appears on this page and in verified channels, any token using the DARK6.3B name
            is not ours. Treat any presale, airdrop or early-access offer as a scam unless it is announced here.
          </p>
        </div>
      </div>
    </section>
  );
}

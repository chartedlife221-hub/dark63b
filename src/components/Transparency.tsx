import { LEDGER } from "../data/project";

const STEPS = [
  { name: "Receive", body: "Creator fees arrive in a single published wallet." },
  { name: "Record", body: "Each inflow is logged with its on-chain transaction." },
  { name: "Review", body: "Beneficiaries are checked against published criteria before any commitment." },
  { name: "Distribute", body: "Funds go out on-chain, one transaction per purpose." },
  { name: "Prove", body: "Receipts, transaction links and the remaining balance are published here." },
];

const OPEN_ITEMS = [
  "How creator fees are accounted for, and who holds the keys",
  "Which expenses are eligible, and which are not",
  "How beneficiaries are selected and verified",
  "Legal requirements in the relevant jurisdictions",
  "The distribution policy, approved before any public commitment",
];

export function Transparency() {
  const cells: [string, string | null][] = [
    ["Creator fees received", LEDGER.feesReceived],
    ["Available for allocation", LEDGER.availableForAllocation],
    ["Distributed", LEDGER.distributed],
    ["Remaining balance", LEDGER.remaining],
  ];

  return (
    <section className="section transparency" id="transparency" aria-labelledby="transparency-title">
      <div className="wrap">
        <header className="section__head">
          <p className="section__index">Chapter four</p>
          <h2 className="section__title" id="transparency-title">
            Turning fees into good
          </h2>
          <p className="section__intro">
            The founder's intention is that creator fees from the community coin fund meaningful public-benefit work.
            Intentions are cheap, so this ledger is built to be checked. It stays empty until real money exists.
          </p>
        </header>

        <div className="ledger">
          <div className="ledger__head">
            <h3>Transparency framework</h3>
            <span className="status-pill" data-state="pending">
              Pre-launch
            </span>
          </div>
          <dl className="ledger__cells">
            {cells.map(([k, v]) => (
              <div className="ledger__cell" key={k}>
                <dt>{k}</dt>
                <dd data-pending={v ? undefined : true}>{v ?? "None yet"}</dd>
              </div>
            ))}
          </dl>
          <div className="ledger__table">
            <h4>Distributions</h4>
            {LEDGER.distributions.length === 0 ? (
              <p className="ledger__empty">
                No distributions yet. Each one will list the beneficiary, purpose, amount, on-chain transaction and
                supporting evidence.
              </p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th scope="col">Date</th>
                    <th scope="col">Beneficiary</th>
                    <th scope="col">Purpose</th>
                    <th scope="col">Amount</th>
                    <th scope="col">Proof</th>
                  </tr>
                </thead>
                <tbody>
                  {LEDGER.distributions.map((d) => (
                    <tr key={d.txUrl}>
                      <td>{d.date}</td>
                      <td>{d.beneficiary}</td>
                      <td>{d.purpose}</td>
                      <td>{d.amount}</td>
                      <td>
                        <a href={d.txUrl} target="_blank" rel="noopener noreferrer">
                          Transaction
                        </a>{" "}
                        ·{" "}
                        <a href={d.evidenceUrl} target="_blank" rel="noopener noreferrer">
                          Evidence
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <div className="process">
          <h3 className="process__title">How every contribution will be handled</h3>
          <ol className="process__steps">
            {STEPS.map((s, i) => (
              <li key={s.name}>
                <span className="process__num" aria-hidden="true">
                  {i + 1}
                </span>
                <strong>{s.name}</strong>
                <p>{s.body}</p>
              </li>
            ))}
          </ol>
        </div>

        <div className="open-items">
          <h3>To be settled before any binding promise</h3>
          <ul>
            {OPEN_ITEMS.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

import { useState } from "react";
import { CHANNELS, TOKEN } from "../data/project";

const PENDING = "Confirmed at launch";

const VERIFY = [
  "Match the full contract address character by character, not just the first and last few.",
  "Open pump.fun only from the link on this page, never from a DM, reply or ad.",
  "No one from DARK6.3B will message you first or ask for your seed phrase.",
];

function ContractPanel({ address }: { address: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked: the address is still selectable */
    }
  };
  return (
    <div className="contract">
      <p className="contract__label">Official contract (Solana)</p>
      <code className="contract__address">{address}</code>
      <div className="contract__actions">
        <button type="button" className="btn btn--gold" onClick={copy}>
          {copied ? "Copied" : "Copy address"}
        </button>
        <a className="btn btn--ghost" href={`https://pump.fun/coin/${address}`} target="_blank" rel="noopener noreferrer">
          View on pump.fun
        </a>
        <a className="btn btn--ghost" href={`https://solscan.io/token/${address}`} target="_blank" rel="noopener noreferrer">
          View on Solscan
        </a>
      </div>
      <p className="sr-only" role="status">
        {copied ? "Contract address copied" : ""}
      </p>
    </div>
  );
}

export function Coin() {
  const rows: [string, string | null][] = [
    ["Launch platform", TOKEN.platform],
    ["Blockchain network", TOKEN.network],
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
            DARK6.3B is planned as a community token on pump.fun: a symbol of remembrance and shared participation. It
            is not an investment, and nothing here promises a financial return.
          </p>
          <div className="verify">
            <h3 className="verify__title">How to spot the real token</h3>
            <ul>
              {VERIFY.map((v) => (
                <li key={v}>{v}</li>
              ))}
            </ul>
          </div>
        </header>

        <div className="coin__card">
          <div className="coin__status">
            <span className="status-pill" data-state={TOKEN.launched ? "live" : "pending"}>
              {TOKEN.launched ? "Launched" : "Not yet launched"}
            </span>
          </div>

          {TOKEN.contract ? (
            <ContractPanel address={TOKEN.contract} />
          ) : (
            <div className="contract contract--empty">
              <p className="contract__label">Official contract</p>
              <p className="contract__pending">Published here at launch</p>
            </div>
          )}

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

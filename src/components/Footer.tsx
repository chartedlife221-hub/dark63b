import { CHANNELS, SITE } from "../data/project";
import { MEDIA } from "../lib/env";

export function Footer() {
  return (
    <footer className="footer" id="trust">
      <div className="wrap">
        <div className="footer__brand">
          <img src={MEDIA.logo640} width={72} height={72} alt="" loading="lazy" />
          <p className="footer__motto">From darkness to purpose</p>
        </div>

        <div className="footer__cols">
          <div>
            <h2>Independent project</h2>
            <p>
              DARK6.3B is an independent community remembrance and public-benefit initiative. It is not affiliated
              with, endorsed by or connected to Binance. It does not represent victims of the October 29 incident and
              cannot recover anyone's assets. "6.3B" refers to the approximate scale of the incident, not to a token
              supply, valuation, fundraising goal or available donations.
            </p>
          </div>
          <div>
            <h2>Security</h2>
            <p>
              We will never ask for your seed phrase, private keys or a payment to recover funds. We do not send
              direct messages first. Check that a link leads to this site before trusting it. Nothing here is
              financial advice.
            </p>
          </div>
          <div>
            <h2>Privacy</h2>
            <p>
              This site uses no cookies, analytics or trackers and collects no personal data. Fonts are loaded from
              Google Fonts, which receives your IP address when you visit.
            </p>
          </div>
          <div>
            <h2>Official channels</h2>
            {CHANNELS.length ? (
              <ul>
                {CHANNELS.map((c) => (
                  <li key={c.url}>
                    <a href={c.url} target="_blank" rel="noopener noreferrer">
                      {c.name}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p>None verified yet. Accounts claiming to be DARK6.3B are not official until they are listed here.</p>
            )}
            <p>
              <a href={SITE.repo} target="_blank" rel="noopener noreferrer">
                Source code on GitHub
              </a>
            </p>
          </div>
        </div>

        <p className="footer__base">
          <span>© 2026 DARK6.3B community project.</span>
          <a href="#story">Sources for the historical record</a>
          <a href="#top">Back to top</a>
        </p>
      </div>
    </footer>
  );
}

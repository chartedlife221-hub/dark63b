/**
 * Historical record for SECTION 02.
 *
 * Every chapter cites at least one source. Figures are reported values and
 * may be revised as investigations continue — update LAST_VERIFIED and the
 * affected entries when that happens. Never add a claim without a source.
 */

export const LAST_VERIFIED = "November 8, 2026";

export interface Source {
  id: string;
  title: string;
  publisher: string;
  date: string;
  url: string;
  note?: string;
}

export const SOURCES: Record<string, Source> = {
  binanceAck: {
    id: "binanceAck",
    title: "Initial acknowledgement of a potential security issue",
    publisher: "Binance (X)",
    date: "Oct 29, 2026",
    url: "https://x.com/binance/status/2115918888429133902",
    note: "Linked from StealthEX's compiled timeline.",
  },
  binancePause: {
    id: "binancePause",
    title: "Deposits and withdrawals paused",
    publisher: "Binance (X)",
    date: "Oct 30, 2026",
    url: "https://x.com/binance/status/2115960292115124558",
    note: "Linked from StealthEX's compiled timeline.",
  },
  binanceUpdate2: {
    id: "binanceUpdate2",
    title: "Recovery Update #2",
    publisher: "Binance (X)",
    date: "Oct 30, 2026",
    url: "https://x.com/binance/status/2116258356109496479",
    note: "Linked from StealthEX's compiled timeline.",
  },
  binanceUpdate3: {
    id: "binanceUpdate3",
    title: "Recovery Update #3",
    publisher: "Binance (X)",
    date: "Oct 31, 2026",
    url: "https://x.com/binance/status/2116538196259684457",
    note: "Linked from StealthEX's compiled timeline.",
  },
  binanceUpdate4: {
    id: "binanceUpdate4",
    title: "Recovery Update #4",
    publisher: "Binance (X)",
    date: "Nov 1, 2026",
    url: "https://x.com/binance/status/2116744986096292263",
    note: "Linked from StealthEX's compiled timeline.",
  },
  binanceFindings: {
    id: "binanceFindings",
    title: "29 October Binance Security Incident: Initial Findings and Response Update",
    publisher: "Binance (X)",
    date: "Nov 2026",
    url: "https://x.com/binance/status/2117626126214504729",
  },
  binanceAnnouncement: {
    id: "binanceAnnouncement",
    title: "Security incident announcement",
    publisher: "Binance Support",
    date: "Oct 2026",
    url: "https://www.binance.com/en/support/announcement/detail/c5a8729a97ac486d963784d96c5642d7",
  },
  fbi: {
    id: "fbi",
    title: "FBI attribution to North Korea (TraderTraitor)",
    publisher: "FBI Cyber Division (X)",
    date: "Oct 31, 2026",
    url: "https://x.com/FBICyberBranch/status/2116660730745299426",
    note: "Linked from StealthEX's compiled timeline.",
  },
  techcrunch: {
    id: "techcrunch",
    title: "Binance pauses withdrawals as hackers suspected of stealing billions in crypto",
    publisher: "TechCrunch",
    date: "Oct 29, 2026",
    url: "https://techcrunch.com/2026/10/29/binance-pauses-withdrawals-as-hackers-suspected-of-stealing-billions-in-crypto/",
  },
  abc: {
    id: "abc",
    title: "Binance estimates security breach impact at $6.3 billion",
    publisher: "ABC13",
    date: "Oct 30–31, 2026",
    url: "https://abc13.com/story/binance-estimates-security-breach-impact-63-billion/19999397/",
  },
  cnbc: {
    id: "cnbc",
    title: "Binance co-CEO Richard Teng says hackers used fake job interviews, AI tool to steal $6.3 billion in crypto",
    publisher: "CNBC",
    date: "Nov 3, 2026",
    url: "https://www.cnbc.com/2026/11/03/binance-co-ceo-teng-says-hackers-used-fake-job-interviews-to-steal-6point3-billion-in-crypto.html",
  },
  stealthex: {
    id: "stealthex",
    title: "Binance Hack: Everything We Know About the $6.3B Theft",
    publisher: "StealthEX",
    date: "Nov 2026",
    url: "https://stealthex.io/blog/binance-hack-everything-we-know-about-the-6-3b-theft/",
  },
  timenews: {
    id: "timenews",
    title: "Binance CFO departs following record $6.3 billion crypto hack",
    publisher: "Time News",
    date: "Nov 2026",
    url: "https://time.news/binance-cfo-departs-following-record-6-3-billion-crypto-hack",
  },
  cryptonews: {
    id: "cryptonews",
    title: "Binance hackers reportedly spent eight weeks inside before $6.3 billion theft",
    publisher: "Cryptonews.net (via Crypto Briefing)",
    date: "Nov 6, 2026",
    url: "https://cryptonews.net/news/security/33714775/",
  },
};

export interface Chapter {
  when: string;
  /** Machine-readable date for <time>. */
  datetime: string;
  title: string;
  body: string;
  sources: (keyof typeof SOURCES)[];
}

export const CHAPTERS: Chapter[] = [
  {
    when: "Weeks before",
    datetime: "2026-09",
    title: "The way in",
    body:
      "According to reporting on Binance's post-mortem, attackers reached wallet engineers through a fake recruitment process and a trojanized developer-tool installer. The breach began with people and laptops, not with broken cryptography.",
    sources: ["cnbc", "timenews"],
  },
  {
    when: "Oct 29 · about 20:05 UTC",
    datetime: "2026-10-29T20:05Z",
    title: "Twenty minutes",
    body:
      "Funds began leaving Binance hot wallets across about ten blockchains. Most of the movement unfolded in roughly twenty minutes. Reports say private keys were not taken; the attackers used internal access to push transactions through.",
    sources: ["stealthex", "cryptonews"],
  },
  {
    when: "Oct 29 · 21:01–22:10 UTC",
    datetime: "2026-10-29T21:01Z",
    title: "The first freezes",
    body:
      "Stablecoin issuers and industry partners, including Tether, Circle, Ripple and World Liberty Financial, froze stolen tokens as they moved.",
    sources: ["stealthex", "techcrunch", "timenews"],
  },
  {
    when: "Oct 29 · 21:24 UTC",
    datetime: "2026-10-29T21:24Z",
    title: "Binance confirms an issue",
    body:
      "Binance said it was aware of a potential security issue, was investigating, and that user funds were safe. It warned users to stay alert for scams.",
    sources: ["binanceAck", "techcrunch"],
  },
  {
    when: "Oct 30 · 00:13 UTC",
    datetime: "2026-10-30T00:13Z",
    title: "Withdrawals stop",
    body:
      "Deposits and withdrawals were paused. Binance estimated the impact at about $6.3 billion. Deposits resumed a few hours later; withdrawals stayed closed.",
    sources: ["binancePause", "stealthex", "abc"],
  },
  {
    when: "Oct 30 – Nov 1",
    datetime: "2026-10-30",
    title: "Covering the loss",
    body:
      "Binance said it set aside more than $6.34 billion from its SAFU fund, insurance fund and treasury, and reported coverage of affected assets rising from 80% to 90% to 95% over three days.",
    sources: ["binanceUpdate2", "binanceUpdate3", "binanceUpdate4", "abc"],
  },
  {
    when: "Oct 31 · 22:36 UTC",
    datetime: "2026-10-31T22:36Z",
    title: "Attribution",
    body:
      "The FBI attributed the attack to North Korean actors it tracks as TraderTraitor, the group it also links to the February 2025 Bybit theft.",
    sources: ["fbi", "abc", "timenews"],
  },
  {
    when: "Nov 1 · 06:00 UTC",
    datetime: "2026-11-01T06:00Z",
    title: "The lights come back on",
    body:
      "Withdrawals resumed in phases, starting with Bitcoin. Some networks had no reopening date at the time of reporting.",
    sources: ["stealthex"],
  },
  {
    when: "Nov 3",
    datetime: "2026-11-03",
    title: "What leadership said",
    body:
      "Co-CEO Richard Teng described the method publicly, put affected assets at about $6.34 billion, and said customers would not bear the losses.",
    sources: ["cnbc", "timenews"],
  },
];

export interface Measure {
  figure: string;
  name: string;
  detail: string;
  sources: (keyof typeof SOURCES)[];
}

/** Three different measures. They must never be added or subtracted. */
export const MEASURES: Measure[] = [
  {
    figure: "≈ $6.34B",
    name: "Affected",
    detail:
      "Binance's figure for affected assets. TRM Labs counted about $6.36B leaving wallets.",
    sources: ["cnbc", "stealthex"],
  },
  {
    figure: "≈ $2.85–3B",
    name: "Frozen or intercepted",
    detail:
      "Held by stablecoin issuers, partners and law enforcement. Estimates differ by source and date.",
    sources: ["timenews", "abc", "stealthex"],
  },
  {
    figure: "95%",
    name: "Covered by Binance",
    detail:
      "Share of affected assets Binance said it had replenished from its own reserves by November 1.",
    sources: ["binanceUpdate4", "stealthex"],
  },
];

/** Used by the scale visual: one point per $10M. */
export const SCALE = {
  affectedPoints: 634,
  frozenLowPoints: 285,
};

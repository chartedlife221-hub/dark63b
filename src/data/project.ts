/**
 * Project configuration. Everything here is shown on the public site.
 *
 * RULE: only fill a field with a value that has been independently verified.
 * Leave `null` until then — the UI renders an honest "not yet" state.
 */

export interface TokenDetails {
  network: string | null;
  contract: string | null;
  totalSupply: string | null;
  launched: boolean;
  creatorFeeMechanism: string | null;
}

export const TOKEN: TokenDetails = {
  network: null,
  contract: null,
  totalSupply: null,
  launched: false,
  creatorFeeMechanism: null,
};

export interface Channel {
  name: string;
  url: string;
}

/** Official community channels. Add only after verifying ownership. */
export const CHANNELS: Channel[] = [];

export interface Distribution {
  date: string;
  beneficiary: string;
  purpose: string;
  amount: string;
  txUrl: string;
  evidenceUrl: string;
}

export interface Ledger {
  feesReceived: string | null;
  availableForAllocation: string | null;
  distributed: string | null;
  remaining: string | null;
  distributions: Distribution[];
}

/** Real figures only. Stays empty until creator fees actually exist. */
export const LEDGER: Ledger = {
  feesReceived: null,
  availableForAllocation: null,
  distributed: null,
  remaining: null,
  distributions: [],
};

export type PhaseStatus = "In progress" | "Not started" | "Complete";

export interface Phase {
  name: string;
  title: string;
  status: PhaseStatus;
  deliverables: string[];
}

export const ROADMAP: Phase[] = [
  {
    name: "Phase 1",
    title: "The Memory",
    status: "In progress",
    deliverables: [
      "Cinematic website and film",
      "Sourced historical record of October 29",
      "Visual identity and story",
    ],
  },
  {
    name: "Phase 2",
    title: "The Community",
    status: "Not started",
    deliverables: [
      "Verified official channels",
      "Security education features",
      "Moderated community wall",
    ],
  },
  {
    name: "Phase 3",
    title: "The Transparency Framework",
    status: "Not started",
    deliverables: [
      "Beneficiary selection criteria",
      "Creator-fee accounting and verification",
      "Public reporting format",
    ],
  },
  {
    name: "Phase 4",
    title: "Giving Back",
    status: "Not started",
    deliverables: [
      "First eligible distributions, once legally and operationally ready",
      "Published on-chain proof and receipts for each",
    ],
  },
];

export const SITE = {
  name: "DARK6.3B",
  url: "https://chartedlife221-hub.github.io/dark63b/",
  repo: "https://github.com/chartedlife221-hub/dark63b",
};

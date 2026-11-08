import { useEffect, useState } from "react";
import { SITE } from "../data/project";
import { MEDIA } from "../lib/env";

const RULES = [
  "Every message is read by a moderator before it appears.",
  "No wallet addresses, links, promotions or personal data.",
  "Messages are about security, transparency and community, not price.",
  "You can ask for your message to be removed at any time.",
];

async function renderCard(): Promise<Blob> {
  const W = 1080;
  const H = 1350;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas unavailable");

  const logo = new Image();
  logo.decoding = "async";
  logo.src = MEDIA.logo1200;
  await logo.decode();
  try {
    await Promise.all([
      document.fonts.load('400 72px "Cormorant Garamond"'),
      document.fonts.load('500 26px "Manrope"'),
    ]);
  } catch {
    /* fall back to system fonts */
  }

  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, W, H);
  const glow = ctx.createRadialGradient(W / 2, 520, 40, W / 2, 520, 620);
  glow.addColorStop(0, "rgba(240,166,64,0.10)");
  glow.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, H);

  const size = 760;
  ctx.drawImage(logo, (W - size) / 2, 110, size, size);

  ctx.textAlign = "center";
  ctx.fillStyle = "#e8dcc4";
  ctx.font = '400 66px "Cormorant Garamond", Georgia, serif';
  ctx.fillText("WHEN THE LIGHTS WENT DARK", W / 2, 990, W - 120);

  ctx.fillStyle = "#c9a15b";
  ctx.font = '500 28px "Manrope", system-ui, sans-serif';
  ctx.fillText("October 29, 2026", W / 2, 1050);

  ctx.strokeStyle = "rgba(201,161,91,0.55)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(W / 2 - 160, 1110);
  ctx.lineTo(W / 2 + 160, 1110);
  ctx.stroke();

  ctx.fillStyle = "#e8dcc4";
  ctx.font = 'italic 400 44px "Cormorant Garamond", Georgia, serif';
  ctx.fillText("From darkness to purpose", W / 2, 1180);

  ctx.fillStyle = "#8f877a";
  ctx.font = '400 22px "Manrope", system-ui, sans-serif';
  ctx.fillText(SITE.url.replace(/^https:\/\//, "").replace(/\/$/, ""), W / 2, 1280);

  return new Promise((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("Export failed"))), "image/png"),
  );
}

export function Wall() {
  const [card, setCard] = useState<{ url: string; blob: Blob } | null>(null);
  const [state, setState] = useState<"idle" | "working" | "error">("idle");
  const [canShare, setCanShare] = useState(false);

  useEffect(() => () => {
    if (card) URL.revokeObjectURL(card.url);
  }, [card]);

  const make = async () => {
    setState("working");
    try {
      const blob = await renderCard();
      const file = new File([blob], "dark63b-story.png", { type: "image/png" });
      setCanShare(typeof navigator.canShare === "function" && navigator.canShare({ files: [file] }));
      setCard({ url: URL.createObjectURL(blob), blob });
      setState("idle");
    } catch {
      setState("error");
    }
  };

  const share = async () => {
    if (!card) return;
    const file = new File([card.blob], "dark63b-story.png", { type: "image/png" });
    try {
      await navigator.share({ files: [file], title: "DARK6.3B", text: "When the lights went dark. October 29, 2026.", url: SITE.url });
    } catch {
      /* user cancelled */
    }
  };

  return (
    <section className="section wall" id="wall" aria-labelledby="wall-title">
      <div className="wrap wall__grid">
        <header className="section__head">
          <p className="section__index">Chapter five</p>
          <h2 className="section__title" id="wall-title">
            The community wall
          </h2>
          <p className="section__intro">
            A quiet place for short messages about what security, transparency and community mean to you. It opens in
            Phase 2, once moderation and privacy handling are in place. Nothing is published before then.
          </p>
          <ul className="wall__rules">
            {RULES.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </header>

        <div className="share">
          <h3 className="share__title">Share the story</h3>
          <p>Make an image card of the DARK6.3B story to post or send. It's created on your device; nothing is uploaded.</p>
          {card ? (
            <div className="share__result">
              <img src={card.url} width={1080} height={1350} alt="Story card: the DARK6.3B emblem with the words When the lights went dark, October 29, 2026, From darkness to purpose." />
              <div className="share__actions">
                <a className="btn btn--gold" href={card.url} download="dark63b-story.png">
                  Download card
                </a>
                {canShare && (
                  <button type="button" className="btn btn--ghost" onClick={share}>
                    Share card
                  </button>
                )}
              </div>
            </div>
          ) : (
            <button type="button" className="btn btn--gold" onClick={make} disabled={state === "working"}>
              {state === "working" ? "Creating card…" : "Create story card"}
            </button>
          )}
          {state === "error" && (
            <p className="form-error" role="alert">
              The card couldn't be created in this browser. Try again, or use a recent version of Chrome, Safari or
              Firefox.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

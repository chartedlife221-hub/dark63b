import { useEffect, useRef, useState } from "react";
import { MEDIA, prefersReducedMotion, saveDataEnabled } from "../lib/env";
import { Particles } from "./Particles";
import { PlayIcon } from "./Icons";

type Mode = "still" | "film";

export function Hero({ onWatch }: { onWatch: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  // Server render and no-JS visitors get the still emblem.
  const [mode, setMode] = useState<Mode>("still");

  useEffect(() => {
    const video = videoRef.current;
    if (!video || prefersReducedMotion() || saveDataEnabled()) return;

    const big = window.innerHeight * Math.min(window.devicePixelRatio || 1, 2) > 1300;
    video.src = big ? MEDIA.heroFilm1080 : MEDIA.heroFilm720;
    setMode("film");

    let settled = false;
    const fallback = window.setTimeout(() => {
      if (!settled) setMode("still");
    }, 6000);
    const onPlaying = () => {
      settled = true;
      window.clearTimeout(fallback);
    };
    const onError = () => {
      window.clearTimeout(fallback);
      setMode("still");
    };
    video.addEventListener("playing", onPlaying);
    video.addEventListener("error", onError);
    video.play().catch(onError);

    return () => {
      window.clearTimeout(fallback);
      video.removeEventListener("playing", onPlaying);
      video.removeEventListener("error", onError);
    };
  }, []);

  return (
    <section className="hero" id="top" aria-labelledby="hero-title" data-mode={mode}>
      <div className="hero__curtain" aria-hidden="true">
        <span className="hero__horizon" />
      </div>

      <div className="hero__stage" data-depth="0.18">
        <div className="hero__frame">
          <img
            className="hero__still"
            src={MEDIA.poster720}
            srcSet={`${MEDIA.poster720} 720w, ${MEDIA.poster} 1080w`}
            sizes="(min-width: 900px) 56vh, 100vw"
            width={1080}
            height={1920}
            alt="The DARK6.3B emblem: a cracked dark moon eclipsing a golden light inside a gold ring, above a mountain horizon."
            fetchPriority="high"
          />
          <video
            ref={videoRef}
            className="hero__film"
            muted
            playsInline
            preload="none"
            disablePictureInPicture
            aria-hidden="true"
            tabIndex={-1}
          />
        </div>
      </div>

      <Particles />

      <div className="hero__copy" data-depth="-0.08">
        <h1 className="hero__name">DARK6.3B</h1>
        <p className="hero__title" id="hero-title">
          When the lights went dark
        </p>
        <p className="hero__date">
          <time dateTime="2026-10-29">October 29, 2026</time>
        </p>
        <p className="hero__lede">A day remembered. A community united. A purpose beyond the darkness.</p>
        <div className="hero__actions">
          <button type="button" className="btn btn--gold" onClick={onWatch}>
            <PlayIcon className="btn__icon" />
            Watch the film
          </button>
          <a className="btn btn--ghost" href="#story">
            Discover the story
          </a>
          <a className="btn btn--ghost" href="#mission">
            Our mission
          </a>
        </div>
      </div>

      <a className="hero__cue" href="#story" aria-label="Scroll to the story">
        <span />
      </a>
    </section>
  );
}

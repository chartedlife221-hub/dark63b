import { useEffect, useRef, useState } from "react";
import { MEDIA, prefersReducedMotion, saveDataEnabled } from "../lib/env";

/**
 * The emblem, glowing faintly behind every chapter after the hero.
 * A 7-second seamless loop (the film's final shot, forward then reversed),
 * played only while the hero is off-screen and the tab is visible.
 * Reduced-motion and data-saver visitors get the still frame instead.
 */
export function AmbientBackdrop() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    const hero = document.querySelector(".hero");
    const video = videoRef.current;
    if (!hero || !video) return;
    const animate = !prefersReducedMotion() && !saveDataEnabled();
    let heroVisible = true;

    const sync = () => {
      const show = !heroVisible;
      setOn(show);
      if (!animate) return;
      if (show && !document.hidden) {
        if (!video.getAttribute("src")) video.src = MEDIA.ambientLoop;
        void video.play().catch(() => undefined);
      } else {
        video.pause();
      }
    };

    const io = new IntersectionObserver(
      ([e]) => {
        heroVisible = e.intersectionRatio > 0.35;
        sync();
      },
      { threshold: [0, 0.35, 1] },
    );
    io.observe(hero);
    document.addEventListener("visibilitychange", sync);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, []);

  return (
    <div className="ambient" data-on={on || undefined} aria-hidden="true">
      <div className="ambient__frame">
        <img className="ambient__still" src={MEDIA.ambientStill} width={540} height={960} alt="" loading="lazy" decoding="async" />
        <video ref={videoRef} className="ambient__film" muted loop playsInline preload="none" disablePictureInPicture tabIndex={-1} />
      </div>
    </div>
  );
}

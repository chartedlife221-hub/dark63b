import { useCallback, useEffect, useRef, useState } from "react";
import { Nav } from "./components/Nav";
import { Hero } from "./components/Hero";
import { Story } from "./components/Story";
import { Mission } from "./components/Mission";
import { Coin } from "./components/Coin";
import { Transparency } from "./components/Transparency";
import { Wall } from "./components/Wall";
import { Roadmap } from "./components/Roadmap";
import { Footer } from "./components/Footer";
import { FilmViewer } from "./components/FilmViewer";
import { AmbientBackdrop } from "./components/AmbientBackdrop";
import { startAmbient, stopAmbient } from "./lib/ambient";
import { prefersReducedMotion } from "./lib/env";

/** Depth parallax, timeline progress and gentle reveals, driven by one scroll loop. */
function useScrollScene() {
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const root = document.documentElement;
    root.classList.add("motion-ok");

    const layers = Array.from(document.querySelectorAll<HTMLElement>("[data-depth]"));
    const timeline = document.querySelector<HTMLElement>(".timeline");
    let raf = 0;

    const update = () => {
      raf = 0;
      const vh = window.innerHeight;
      for (const el of layers) {
        const depth = Number(el.dataset.depth) || 0;
        const host = el.closest("section") ?? el;
        const r = host.getBoundingClientRect();
        if (r.bottom < -200 || r.top > vh + 200) continue;
        const offset = (r.top + r.height / 2 - vh / 2) * -depth;
        el.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`;
      }
      if (timeline) {
        const r = timeline.getBoundingClientRect();
        const p = Math.min(1, Math.max(0, (vh * 0.6 - r.top) / r.height));
        timeline.style.setProperty("--fill", p.toFixed(4));
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -12% 0px" },
    );
    document.querySelectorAll("[data-reveal]").forEach((el) => io.observe(el));

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      io.disconnect();
    };
  }, []);
}

/** Pointer-tracked metallic highlight on gold buttons and plaques (hover devices only). */
function useSheen() {
  useEffect(() => {
    if (!window.matchMedia("(hover: hover)").matches) return;
    const onMove = (e: PointerEvent) => {
      const el = (e.target as HTMLElement).closest<HTMLElement>(".btn, .plaque, .pillar, .phase");
      if (!el) return;
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${(((e.clientX - r.left) / r.width) * 100).toFixed(1)}%`);
      el.style.setProperty("--my", `${(((e.clientY - r.top) / r.height) * 100).toFixed(1)}%`);
    };
    document.addEventListener("pointermove", onMove, { passive: true });
    return () => document.removeEventListener("pointermove", onMove);
  }, []);
}

export function App() {
  const [filmOpen, setFilmOpen] = useState(false);
  const [sound, setSound] = useState(false);
  const resumeSound = useRef(false);

  useScrollScene();
  useSheen();

  const toggleSound = useCallback(() => {
    if (sound) {
      stopAmbient();
      setSound(false);
    } else {
      setSound(startAmbient());
    }
  }, [sound]);

  const openFilm = useCallback(() => {
    resumeSound.current = sound;
    if (sound) {
      stopAmbient();
      setSound(false);
    }
    setFilmOpen(true);
  }, [sound]);

  const closeFilm = useCallback(() => {
    setFilmOpen(false);
    if (resumeSound.current) setSound(startAmbient());
  }, []);

  return (
    <>
      <AmbientBackdrop />
      <Nav sound={sound} onSound={toggleSound} />
      <main>
        <Hero onWatch={openFilm} />
        <Story />
        <Mission />
        <Coin />
        <Transparency />
        <Wall />
        <Roadmap />
      </main>
      <Footer />
      <FilmViewer open={filmOpen} onClose={closeFilm} />
    </>
  );
}

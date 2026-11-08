import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "../lib/env";

/**
 * Fine gold dust drifting through the dark. 2D canvas, ~60 particles,
 * paused when off-screen or the tab is hidden, disabled for reduced motion.
 */
export function Particles() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas || prefersReducedMotion()) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let raf = 0;
    let visible = true;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    type P = { x: number; y: number; z: number; vx: number; vy: number; tw: number };
    let ps: P[] = [];

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round(Math.min(70, Math.max(28, (w * h) / 22000)));
      ps = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        z: Math.random(),
        vx: (Math.random() - 0.5) * 0.08,
        vy: -(0.04 + Math.random() * 0.12),
        tw: Math.random() * Math.PI * 2,
      }));
    };

    const tick = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      for (const p of ps) {
        const depth = 0.35 + p.z * 0.9;
        p.x += p.vx * depth;
        p.y += p.vy * depth;
        if (p.y < -10) {
          p.y = h + 10;
          p.x = Math.random() * w;
        }
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        const flicker = 0.55 + 0.45 * Math.sin(t * 0.0012 + p.tw);
        const r = 0.4 + p.z * 1.3;
        const a = (0.12 + p.z * 0.5) * flicker;
        ctx.beginPath();
        ctx.fillStyle = `rgba(232, 190, 116, ${a.toFixed(3)})`;
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = visible ? requestAnimationFrame(tick) : 0;
    };

    const start = () => {
      if (!raf && visible && !document.hidden) raf = requestAnimationFrame(tick);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };

    resize();
    start();

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) start();
      else stop();
    });
    io.observe(canvas);
    const onVis = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVis);

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return <canvas ref={ref} className="particles" aria-hidden="true" />;
}

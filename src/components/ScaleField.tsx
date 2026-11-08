import { useEffect, useRef } from "react";
import { SCALE } from "../data/incident";
import { prefersReducedMotion } from "../lib/env";

/**
 * 634 points, one per ~$10M affected. When the field enters view every point
 * goes dark; then the share that was frozen or intercepted (lower estimate)
 * relights in gold. Deterministic order so it reads the same on every visit.
 */
export function ScaleField() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const N = SCALE.affectedPoints;
    const LIT = SCALE.frozenLowPoints;

    // Seeded shuffle for stable "random" timing.
    let seed = 6340;
    const rand = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
    const order = Array.from({ length: N }, (_, i) => i);
    for (let i = N - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      [order[i], order[j]] = [order[j], order[i]];
    }
    const outDelay = new Float32Array(N);
    const relit = new Uint8Array(N);
    const inDelay = new Float32Array(N);
    for (let i = 0; i < N; i++) outDelay[i] = rand() * 1400;
    for (let k = 0; k < LIT; k++) relit[order[k]] = 1;
    for (let i = 0; i < N; i++) inDelay[i] = 2000 + rand() * 1800;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    let cols = 0;
    let cell = 0;
    let start = -1;
    let raf = 0;
    const reduce = prefersReducedMotion();

    const layout = () => {
      w = canvas.clientWidth;
      cell = w < 520 ? 12 : 18;
      cols = Math.max(10, Math.floor(w / cell));
      const rows = Math.ceil(N / cols);
      h = rows * cell;
      canvas.style.height = `${h}px`;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const ease = (x: number) => 1 - Math.pow(1 - Math.min(1, Math.max(0, x)), 3);

    const draw = (elapsed: number) => {
      ctx.clearRect(0, 0, w, h);
      const offsetX = (w - cols * cell) / 2 + cell / 2;
      const r = cell * 0.16;
      for (let i = 0; i < N; i++) {
        const x = offsetX + (i % cols) * cell;
        const y = cell / 2 + Math.floor(i / cols) * cell;
        // Phase 1: ember → dark. Phase 2: some return as gold.
        const out = ease((elapsed - outDelay[i]) / 500);
        const back = relit[i] ? ease((elapsed - inDelay[i]) / 900) : 0;
        const before = 1 - out;
        // Colour blend: ember (before), ash (dark), gold (relit)
        const alphaDark = 0.3;
        if (back > 0) {
          ctx.fillStyle = `rgba(222, 176, 98, ${(alphaDark + back * 0.78).toFixed(3)})`;
        } else if (before > 0.01) {
          ctx.fillStyle = `rgba(240, 166, 64, ${(alphaDark + before * 0.7).toFixed(3)})`;
        } else {
          ctx.fillStyle = `rgba(150, 140, 125, ${alphaDark})`;
        }
        ctx.beginPath();
        ctx.arc(x, y, r + (back > 0 ? back * 0.6 : 0), 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const FINAL = 4800;
    const loop = (t: number) => {
      if (start < 0) start = t;
      const el = t - start;
      draw(el);
      raf = el < FINAL ? requestAnimationFrame(loop) : 0;
    };

    layout();
    draw(reduce ? FINAL : 0);

    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && start < 0 && !reduce) {
          raf = requestAnimationFrame(loop);
          io.disconnect();
        }
      },
      { threshold: 0.45 },
    );
    io.observe(canvas);

    const ro = new ResizeObserver(() => {
      layout();
      if (!raf) draw(start < 0 && !reduce ? 0 : FINAL);
    });
    ro.observe(canvas);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={ref}
      className="scale-field__canvas"
      role="img"
      aria-label="634 points, each about 10 million dollars. All go dark; about 285 return in gold, the lower estimate of funds frozen or intercepted."
    />
  );
}

"use client";
import { useEffect, useRef } from "react";

// Hanging bead curtain. Strands sway when you scroll; beads part and shimmer under the cursor.
// Drawn row by row so each row sets its colour once (about 10k beads per frame).
export default function BeadCurtain({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d")!;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const GAP = 9, STEP = 10, R = 150;
    let W = 0, H = 0, dpr = 1, raf = 0, visible = true;
    const mouse = { x: -999, y: -999, tx: -999, ty: -999, power: 0 };
    let sway = 0, lastScroll = window.scrollY;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      W = canvas.clientWidth; H = canvas.clientHeight;
      canvas.width = W * dpr; canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    // blue at the top, orange at the bottom
    const color = (t: number) => {
      const k = Math.pow(t, 1.7);
      return `rgb(${Math.round(lerp(2, 252, k))},${Math.round(lerp(151, 115, k))},${Math.round(lerp(222, 77, k))})`;
    };

    const draw = (time: number) => {
      const t = time / 1000;
      mouse.x = lerp(mouse.x, mouse.tx, 0.18); mouse.y = lerp(mouse.y, mouse.ty, 0.18);
      sway *= 0.965;
      ctx.clearRect(0, 0, W, H);
      const cols = Math.ceil(W / GAP), rows = Math.ceil(H / STEP);
      for (let j = 0; j < rows; j++) {
        const y = j * STEP + 4, ty = y / H;
        ctx.fillStyle = color(ty);
        const hang = Math.pow(ty, 1.3); // the bottom of a strand moves most
        for (let i = 0; i < cols; i++) {
          const x0 = i * GAP + GAP / 2;
          const cx = (x0 - W / 2) / (W * 0.3);
          // light cone: bright beam in the centre, spreading toward the bottom
          const beam = Math.exp(-cx * cx * (1.6 - ty)) * (0.35 + 0.65 * ty) + 0.12 * ty;
          let dx = (Math.sin(t * 1.1 + i * 0.21) * 1.2 + sway * Math.sin(t * 2.2 + i * 0.17)) * hang;
          let a = 0.06 + 0.7 * beam;
          const ddx = x0 - mouse.x, ddy = y - mouse.y, d = Math.hypot(ddx, ddy);
          if (d < R && mouse.power > 0.01) {
            const f = (1 - d / R) ** 2 * mouse.power;
            dx += Math.sign(ddx || 1) * f * 22 * hang + Math.sign(ddx || 1) * f * 6;
            a += f * (0.6 + 0.4 * Math.sin(t * 9 + i + j)); // shimmer
          }
          ctx.globalAlpha = Math.min(1, a * (0.8 + 0.2 * Math.sin(t * 2 + i * 1.7 + j * 0.9)));
          ctx.fillRect(x0 + dx, y, 2, 5);
        }
      }
      ctx.globalAlpha = 1;
      mouse.power = lerp(mouse.power, mouse.tx > -900 ? 1 : 0, 0.08);
      if (!reduce && visible) raf = requestAnimationFrame(draw);
    };

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.tx = e.clientX - r.left; mouse.ty = e.clientY - r.top;
      if (mouse.x < -900) { mouse.x = mouse.tx; mouse.y = mouse.ty; }
    };
    const onLeave = () => { mouse.tx = -999; mouse.ty = -999; };
    const onScroll = () => {
      const v = window.scrollY - lastScroll; lastScroll = window.scrollY;
      sway = Math.max(-14, Math.min(14, sway + v * 0.12));
    };
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible && !reduce) { cancelAnimationFrame(raf); raf = requestAnimationFrame(draw); }
    });

    resize(); draw(0);
    io.observe(canvas);
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove);
    document.addEventListener("pointerleave", onLeave);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf); io.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return <canvas ref={ref} aria-hidden className={`absolute inset-0 h-full w-full ${className}`} />;
}

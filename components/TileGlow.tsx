"use client";
import { useEffect, useRef } from "react";

// Fluted glass tiles over a U-shaped light. Each tile refracts the light with its own offset;
// the hot core follows the cursor, tiles near it shimmer, and scrolling bends the refraction.
const WIDTHS = [5, 3, 6, 4, 5, 3, 4, 6, 3, 5, 4, 3, 5, 4, 6, 3, 4, 5, 3, 6, 4, 5]; // relative widths
const TOTAL = WIDTHS.reduce((a, b) => a + b, 0);
const NOISE = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

export default function TileGlow() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current!;
    const tiles = Array.from(el.querySelectorAll<HTMLDivElement>("[data-tile]"));
    let mx = 0.5, tx = 0.5, my = 0.6, ty = 0.6, scroll = 0, raf = 0, hover = 0, th = 0;
    const centers = (() => { let acc = 0; return WIDTHS.map((w) => { const c = (acc + w / 2) / TOTAL; acc += w; return c; }); })();
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const frame = () => {
      mx += (tx - mx) * 0.08; my += (ty - my) * 0.08; hover += (th - hover) * 0.06;
      el.style.setProperty("--mx", `${mx * 100}%`);
      el.style.setProperty("--my", `${my * 100}%`);
      el.style.setProperty("--w", `${el.clientWidth}px`);
      const t = performance.now() / 1000;
      tiles.forEach((tile, i) => {
        const d = Math.abs(centers[i] - mx);
        const shine = Math.max(0, 1 - d * 5) * hover;
        const off = Math.sin(i * 1.7) * 28 + Math.sin(t * 0.6 + i) * 4 + scroll * Math.sin(i * 0.9) * 0.08;
        tile.style.setProperty("--off", `${off}px`);
        tile.style.setProperty("--shine", `${0.06 + shine * (0.35 + 0.15 * Math.sin(t * 6 + i * 2))}`);
      });
      if (!reduce) raf = requestAnimationFrame(frame);
    };
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      tx = (e.clientX - r.left) / r.width; ty = (e.clientY - r.top) / r.height; th = 1;
    };
    const leave = () => { tx = 0.5; ty = 0.6; th = 0; };
    const onScroll = () => { scroll = window.scrollY; };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    window.addEventListener("scroll", onScroll, { passive: true });
    frame();
    return () => { cancelAnimationFrame(raf); el.removeEventListener("pointermove", move); el.removeEventListener("pointerleave", leave); window.removeEventListener("scroll", onScroll); };
  }, []);

  const glow = `radial-gradient(22% 48% at 10% 58%, rgba(2,151,222,0.95), transparent 72%),
    radial-gradient(22% 48% at 90% 58%, rgba(2,151,222,0.95), transparent 72%),
    radial-gradient(26% 16% at var(--mx) 70%, rgba(255,255,255,0.95), transparent 75%),
    radial-gradient(34% 22% at var(--mx) 74%, rgba(252,115,77,0.85), transparent 75%),
    radial-gradient(70% 30% at 50% 82%, rgba(2,151,222,0.9), transparent 75%),
    radial-gradient(60% 45% at 50% 105%, rgba(2,70,140,0.9), transparent 70%), #02070A`;

  let left = 0;
  return (
    <div ref={root} aria-hidden className="absolute inset-0 overflow-hidden" style={{ ["--mx" as string]: "50%" }}>
      {WIDTHS.map((w, i) => {
        const l = (left / TOTAL) * 100; left += w;
        return (
          <div key={i} data-tile className="absolute inset-y-0" style={{ left: `${l}%`, width: `${(w / TOTAL) * 100 + 0.05}%` }}>
            <div className="absolute inset-0" style={{ background: glow, backgroundSize: "var(--w) 100%", backgroundPosition: `calc(var(--w) * ${(-l / 100).toFixed(4)} + var(--off, 0px)) 0`, filter: "blur(10px) saturate(1.15)" }} />
            <div className="absolute inset-0" style={{ background: "linear-gradient(90deg, rgba(255,255,255,var(--shine)) 0%, transparent 35%, transparent 70%, rgba(0,0,0,0.38) 100%)" }} />
            <div className="absolute inset-y-0 right-0 w-px bg-white/10" />
          </div>
        );
      })}
      <div className="absolute inset-0 opacity-[0.16] mix-blend-overlay" style={{ backgroundImage: NOISE }} />
      <div className="absolute inset-x-0 top-0 h-1/3" style={{ background: "linear-gradient(#02070A, transparent)" }} />
      <div className="absolute inset-x-0 bottom-0 h-24" style={{ background: "linear-gradient(transparent, #02070A)" }} />
    </div>
  );
}

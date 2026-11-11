"use client";
import { useEffect, useRef } from "react";

// Tiled facade with heavy, uneven grain. No glows: each tile is a flat vertical gradient
// with its own tone; grain is three noise layers at different scales, masked unevenly.
// Tiles near the cursor lift a step in tone; scrolling slides the tones like slats.
const TILES = [6, 4, 7, 3, 5, 8, 4, 6, 3, 7, 5, 4, 8, 3, 6, 5, 4, 7];
const TOTAL = TILES.reduce((a, b) => a + b, 0);
const TONES = ["#04121b", "#062338", "#0a3654", "#0297DE", "#0b2c44", "#05182a", "#0d4a73", "#FC734D", "#08273d", "#03101a"];
const noise = (f: number, o: number) =>
  `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='${f}' numOctaves='${o}' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1.4 -0.2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

export function TileGrain() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current!;
    const tiles = Array.from(el.querySelectorAll<HTMLDivElement>("[data-t]"));
    const centers = (() => { let a = 0; return TILES.map((w) => { const c = (a + w / 2) / TOTAL; a += w; return c; }); })();
    let tx = -1, x = -1, raf = 0;
    const tick = () => {
      x += (tx - x) * 0.12;
      const sy = window.scrollY;
      tiles.forEach((t, i) => {
        const lift = tx < 0 ? 0 : Math.max(0, 1 - Math.abs(centers[i] - x) * 7);
        t.style.filter = `brightness(${1 + lift * 0.45})`;
        t.style.backgroundPosition = `0 ${(sy * (0.15 + (i % 4) * 0.08)).toFixed(1)}px`;
      });
      raf = requestAnimationFrame(tick);
    };
    const move = (e: PointerEvent) => { const r = el.getBoundingClientRect(); tx = (e.clientX - r.left) / r.width; if (x < 0) x = tx; };
    const leave = () => { tx = -1; };
    el.addEventListener("pointermove", move); el.addEventListener("pointerleave", leave); tick();
    return () => { cancelAnimationFrame(raf); el.removeEventListener("pointermove", move); el.removeEventListener("pointerleave", leave); };
  }, []);
  let left = 0;
  return (
    <div ref={ref} aria-hidden className="absolute inset-0 overflow-hidden bg-ink">
      {TILES.map((w, i) => {
        const l = (left / TOTAL) * 100; left += w;
        const a = TONES[(i * 3) % TONES.length], b = TONES[(i * 7 + 2) % TONES.length];
        return (
          <div key={i} data-t className="absolute inset-y-0 border-r border-black/50 transition-[filter] duration-300"
            style={{ left: `${l}%`, width: `${(w / TOTAL) * 100 + 0.04}%`, backgroundImage: `linear-gradient(180deg, #02070A 0%, ${a} ${30 + (i % 5) * 9}%, ${b} 82%, #02070A 100%)`, backgroundSize: "100% 140%" }}>
            <div className="absolute inset-0" style={{ background: "linear-gradient(90deg, rgba(255,255,255,0.06), transparent 40%, rgba(0,0,0,0.35))" }} />
          </div>
        );
      })}
      <div className="grain" style={{ backgroundImage: noise(0.9, 3), opacity: 0.45, mixBlendMode: "overlay" }} />
      <div className="grain" style={{ backgroundImage: noise(2.4, 1), opacity: 0.35, mixBlendMode: "soft-light", animationDuration: "1.3s",
        maskImage: `${noise(0.012, 2)}`, WebkitMaskImage: `${noise(0.012, 2)}`, maskSize: "900px", WebkitMaskSize: "900px" }} />
      <div className="absolute inset-x-0 bottom-0 h-40" style={{ background: "linear-gradient(transparent, #02070A)" }} />
    </div>
  );
}

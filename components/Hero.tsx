"use client";
import { useEffect, useRef, useState } from "react";
import type { Market } from "@/components/MarketChart";
import { MODELS } from "@/lib/models";

// Grainy light field: three slow blobs, a cursor light, and crawling film grain.
export function GrainField() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current!;
    let x = 0.5, y = 0.4, tx = 0.5, ty = 0.4, raf = 0;
    const tick = () => { x += (tx - x) * 0.06; y += (ty - y) * 0.06; el.style.setProperty("--cx", `${x * 100}%`); el.style.setProperty("--cy", `${y * 100}%`); raf = requestAnimationFrame(tick); };
    const move = (e: PointerEvent) => { const r = el.getBoundingClientRect(); tx = (e.clientX - r.left) / r.width; ty = (e.clientY - r.top) / r.height; };
    window.addEventListener("pointermove", move); tick();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("pointermove", move); };
  }, []);
  return (
    <div ref={ref} aria-hidden className="absolute inset-0 overflow-hidden" style={{ background: "#02070A" }}>
      <div className="absolute left-[-10%] top-[10%] h-[70%] w-[60%] rounded-full blur-[110px]" style={{ background: "#0297DE", opacity: 0.55, animation: "drift 18s ease-in-out infinite" }} />
      <div className="absolute right-[-10%] top-[30%] h-[70%] w-[55%] rounded-full blur-[120px]" style={{ background: "#FC734D", opacity: 0.45, animation: "drift 22s ease-in-out infinite reverse" }} />
      <div className="absolute bottom-[-30%] left-[25%] h-[60%] w-[50%] rounded-full blur-[120px]" style={{ background: "#0a3d63", opacity: 0.8, animation: "drift 26s ease-in-out infinite" }} />
      <div className="absolute inset-0" style={{ background: "radial-gradient(25% 30% at var(--cx,50%) var(--cy,40%), rgba(255,255,255,0.22), transparent 70%)" }} />
      <div className="grain" />
      <div className="absolute inset-x-0 bottom-0 h-40" style={{ background: "linear-gradient(transparent, #02070A)" }} />
    </div>
  );
}

// Wall Street ticker tape: real model list prices plus live headline moves.
export function Ticker() {
  const [m, setM] = useState<Market | null>(null);
  useEffect(() => { fetch("/api/market").then((r) => r.json()).then(setM).catch(() => {}); }, []);
  const items = [
    ...MODELS.map((x) => ({ k: `${x.maker.split(" ")[0].toUpperCase()} ${x.model.toUpperCase()}`, v: `$${x.price.toLocaleString()}`, d: 0 })),
    ...(m?.headlines ?? []).map((h) => ({ k: h.title.slice(0, 60).toUpperCase(), v: "", d: h.impact })),
  ];
  const row = items.map((it, i) => (
    <span key={i} className="mx-6 inline-flex items-center gap-2 whitespace-nowrap">
      <span className="text-white/80">{it.k}</span>
      {it.v && <span className="text-white">{it.v}</span>}
      {it.d !== 0 && <span className={it.d > 0 ? "text-blue" : "text-orange"}>{it.d > 0 ? "▲" : "▼"} {Math.abs(it.d).toFixed(1)}</span>}
    </span>
  ));
  return (
    <div className="relative overflow-hidden border-y border-white/10 bg-black/40 py-2.5 font-mono text-[11px] backdrop-blur">
      <div className="ticker inline-flex">{row}{row}</div>
    </div>
  );
}

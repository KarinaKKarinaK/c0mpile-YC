"use client";
import { useEffect, useState } from "react";
import type { Kind } from "@/lib/engine";
import type { Scored } from "@/lib/market";

type Series = { kind: Kind; points: { t: number; v: number }[] };
export type Market = { live: boolean; fetchedAt: number | null; series: Series[]; headlines: Scored[]; counted: number };
const COLORS: Record<Kind, string> = { Humanoid: "#E2774F", Quadruped: "#2A7FB8", Arm: "#e9eef2", AMR: "#7fd4ff" };

export function useMarket() {
  const [m, setM] = useState<Market | null>(null);
  useEffect(() => {
    const load = () => fetch("/api/market").then((r) => r.json()).then(setM).catch(() => {});
    load();
    const id = setInterval(load, 60_000); // live: re-poll every minute
    return () => clearInterval(id);
  }, []);
  return m;
}
export const latest = (m: Market | null, k: Kind) => m?.series.find((s) => s.kind === k)?.points.at(-1)?.v ?? 100;

export default function MarketChart({ m, focus }: { m: Market | null; focus: Kind }) {
  const [hover, setHover] = useState<number | null>(null);
  if (!m) return <div className="grid h-56 place-items-center text-[12px] text-white/40">Loading live robotics news...</div>;
  const all = m.series.flatMap((s) => s.points.map((p) => p.v));
  const lo = Math.min(97, ...all), hi = Math.max(103, ...all);
  const W = 600, H = 200, n = m.series[0]?.points.length ?? 1;
  const x = (i: number) => (i / (n - 1)) * W, y = (v: number) => H - ((v - lo) / (hi - lo)) * H;
  const path = (s: Series) => s.points.map((p, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(p.v).toFixed(1)}`).join("");
  const f = m.series.find((s) => s.kind === focus)!;
  const now = f.points.at(-1)!.v, first = f.points[0].v;
  return (
    <div>
      <div className="flex items-end justify-between">
        <div>
          <div className="font-serif text-5xl">{now.toFixed(1)}</div>
          <div className={`text-[11px] ${now >= first ? "text-blue" : "text-orange"}`}>{now >= first ? "+" : ""}{(now - first).toFixed(1)} pts in 14 days &middot; {focus} resale index</div>
        </div>
        <div className="text-right text-[10px] text-white/45">
          <span className={`mr-1 inline-block h-2 w-2 rounded-full ${m.live ? "pulse bg-blue" : "bg-white/30"}`} />
          {m.live ? `Live: ${m.counted} headlines` : "Feed offline"}<br />weights [modelled]
        </div>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="mt-4 h-56 w-full overflow-visible" onMouseLeave={() => setHover(null)}
        onMouseMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); setHover(Math.round(((e.clientX - r.left) / r.width) * (n - 1))); }}>
        <defs><linearGradient id="mf" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor={COLORS[focus]} stopOpacity="0.35" /><stop offset="1" stopColor={COLORS[focus]} stopOpacity="0" /></linearGradient></defs>
        <line x1="0" x2={W} y1={y(100)} y2={y(100)} stroke="rgba(255,255,255,0.12)" strokeDasharray="4 6" />
        {m.series.filter((s) => s.kind !== focus).map((s) => <path key={s.kind} d={path(s)} fill="none" stroke={COLORS[s.kind]} strokeOpacity="0.25" strokeWidth="1.5" />)}
        <path d={`${path(f)}L${W},${H}L0,${H}Z`} fill="url(#mf)" />
        <path d={path(f)} fill="none" stroke={COLORS[focus]} strokeWidth="2.5" />
        <circle cx={x(n - 1)} cy={y(now)} r="5" fill={COLORS[focus]} className="pulse" />
        {hover !== null && f.points[hover] && (
          <g>
            <line x1={x(hover)} x2={x(hover)} y1="0" y2={H} stroke="rgba(255,255,255,0.25)" />
            <text x={Math.min(x(hover) + 6, W - 120)} y="14" fill="#fff" fontSize="12">{new Date(f.points[hover].t).toLocaleDateString(undefined, { month: "short", day: "numeric" })}: {f.points[hover].v.toFixed(1)}</text>
          </g>
        )}
      </svg>
    </div>
  );
}

"use client";
import { useMemo, useState } from "react";
import { bankPayment, monthlyRevenue, offerLoan, type Robot } from "@/lib/engine";
import { MODELS } from "@/lib/models";

// Drippy, uneven, grainy gradient: soft hills displaced by noise, then blurred. Static, no motion.
export function Drip({ id, flip = false, tone = "dark", className = "" }: { id: string; flip?: boolean; tone?: "dark" | "light"; className?: string }) {
  const base = tone === "dark" ? "#02070A" : "#0b1a2a";
  return (
    <svg aria-hidden viewBox="0 0 1440 600" preserveAspectRatio="none" className={`pointer-events-none absolute inset-x-0 w-full ${flip ? "top-0 rotate-180" : "bottom-0"} ${className}`}>
      <defs>
        <filter id={id} x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.006 0.018" numOctaves="3" seed="7" />
          <feDisplacementMap in="SourceGraphic" scale="120" xChannelSelector="R" yChannelSelector="G" />
          <feGaussianBlur stdDeviation="26" />
        </filter>
      </defs>
      <g filter={`url(#${id})`}>
        <path d="M-100,620 L-100,330 C140,250 300,410 520,320 C690,250 760,190 900,270 C1050,350 1180,220 1300,250 C1400,275 1460,240 1540,260 L1540,620 Z" fill="#0297DE" />
        <path d="M-100,620 L-100,430 C200,380 380,470 560,410 C700,360 800,330 930,390 C1080,460 1220,380 1540,420 L1540,620 Z" fill="#FC734D" opacity="0.9" />
        <path d="M-100,620 L-100,500 C260,470 520,540 760,490 C980,450 1200,520 1540,500 L1540,620 Z" fill="#F4F1EC" />
        <path d="M300,330 C420,290 520,360 600,330 C640,315 680,300 720,320 L720,360 C620,380 420,380 300,360 Z" fill={base} opacity="0.85" />
      </g>
    </svg>
  );
}

// Instant value as one sentence: "Finance a [robot] and get $X today. It repays Y% of every job."
export function Estimator() {
  const [i, setI] = useState(7);
  const m = MODELS[i];
  const { loan } = useMemo(() => {
    const rb: Robot = { id: "R-99", name: m.model, kind: m.kind, site: "", ageMonths: 0, listPrice: m.price, domesticPct: m.usPct, ratePerHour: m.rate, hoursPerMonth: 480, uptime: 0.92, health: 0.95, x: 0, z: 0 };
    return { loan: offerLoan(rb), rev: monthlyRevenue(rb) };
  }, [m]);
  return (
    <div className="max-w-3xl text-[clamp(20px,2.3vw,30px)] font-light leading-[1.5]">
      Finance a{" "}
      <span className="relative inline-block">
        <select aria-label="Robot model" value={i} onChange={(e) => setI(+e.target.value)} className="cursor-pointer appearance-none border-b-2 border-orange bg-transparent pr-6 font-bold italic text-white outline-none [field-sizing:content]">
          {MODELS.map((x, k) => <option key={x.model} value={k} className="bg-ink text-base not-italic">{x.maker} {x.model}</option>)}
        </select>
        <span aria-hidden className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-[0.6em] text-orange">&#9662;</span>
      </span>{" "}
      and get <b className="font-bold italic text-orange">${loan.advance.toLocaleString()}</b> today. It repays <b className="font-bold italic">{Math.round(loan.sweepPct * 100)}%</b> of every job, and <b className="font-bold italic">nothing</b> when it&apos;s down.
      <span className="mt-2 block font-mono text-[10px] uppercase tracking-[0.15em] text-white/40">List ${m.price.toLocaleString()} &middot; one flat fee ${loan.fee.toLocaleString()} &middot; bank equivalent ${bankPayment(loan.advance).toLocaleString()}/mo fixed &middot; [modelled]</span>
    </div>
  );
}

// Grainy wave in full brand colours: a blue hill over an orange band, drifting slowly.
export function Wave({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      <svg viewBox="0 0 1440 900" preserveAspectRatio="none" className="absolute -inset-x-[10%] bottom-0 h-full w-[120%]" style={{ animation: "wave 18s ease-in-out infinite" }}>
        <defs><filter id="wv" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="34" /></filter></defs>
        <g filter="url(#wv)">
          <path d="M0,900 L0,640 C220,640 300,430 520,430 C760,430 820,690 1060,690 C1240,690 1330,520 1440,500 L1440,900 Z" fill="#0297DE" />
          <path d="M0,900 L0,790 C260,790 360,640 560,640 C780,640 860,840 1080,840 C1250,840 1340,740 1440,730 L1440,900 Z" fill="#FC734D" />
        </g>
      </svg>
      <div className="grain" style={{ opacity: 0.16, mixBlendMode: "soft-light" }} />
    </div>
  );
}

// Thin dashed construction lines with tiny corner labels.
export function CutLines({ labels }: { labels: [string, string, string, string] }) {
  const L = "pointer-events-none absolute border-white/15";
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 hidden md:block">
      <div className={`${L} inset-y-0 left-[16%] border-l border-dashed`} />
      <div className={`${L} inset-y-0 right-[16%] border-l border-dashed`} />
      <div className={`${L} inset-x-0 top-[28%] border-t border-dashed`} />
      <div className={`${L} inset-x-0 bottom-[26%] border-t border-dashed`} />
      {[["left-[17%] top-[29%]", 0], ["right-[17%] top-[29%] text-right", 1], ["left-[17%] bottom-[22%]", 2], ["right-[17%] bottom-[22%] text-right", 3]].map(([pos, i]) => (
        <span key={i as number} className={`absolute ${pos} whitespace-pre-line font-mono text-[9px] uppercase leading-tight tracking-[0.18em] text-white/45`}>{labels[i as number]}</span>
      ))}
      <svg className="absolute bottom-[23%] left-1/2 -translate-x-1/2 text-white/40" width="26" height="26" viewBox="0 0 26 26"><g stroke="currentColor" strokeWidth="1"><path d="M13 0V26M0 13H26M4 4L22 22M22 4L4 22" /></g></svg>
    </div>
  );
}

// Real photo, film look: soft focus, a motion ghost, heavy grain and a cool tint.
export function FilmPhoto({ src, title, line, credit, page }: { src: string; title: string; line: string; credit: string; page: string }) {
  const img = `${src}?w=900&q=70&auto=format`;
  return (
    <figure className="group relative aspect-[4/5] overflow-hidden bg-ink">
      <div className="absolute inset-0 scale-105 transition-transform duration-700 group-hover:scale-110" style={{ backgroundImage: `url(${img})`, backgroundSize: "cover", backgroundPosition: "center", filter: "blur(1.6px) saturate(0.8) contrast(1.08) brightness(0.85)" }} />
      <div className="absolute inset-0 scale-105 opacity-40 mix-blend-screen" style={{ backgroundImage: `url(${img})`, backgroundSize: "cover", backgroundPosition: "center", filter: "blur(7px)", transform: "translateX(22px)" }} />
      <div className="absolute inset-0 mix-blend-soft-light" style={{ background: "linear-gradient(160deg, rgba(2,151,222,0.55), rgba(252,115,77,0.35))" }} />
      <div className="grain" style={{ opacity: 0.45, mixBlendMode: "overlay" }} />
      <div className="absolute inset-0" style={{ background: "linear-gradient(transparent 45%, rgba(2,7,10,0.85))" }} />
      <figcaption className="absolute inset-x-0 bottom-0 p-6">
        <div className="text-2xl font-light tracking-tight">{title}</div>
        <p className="mt-2 max-w-[260px] text-[13px] leading-snug text-white/75">{line}</p>
        <a href={page} className="mt-3 block font-mono text-[9px] uppercase tracking-[0.15em] text-white/35 hover:text-white">Photo {credit} / Unsplash</a>
      </figcaption>
    </figure>
  );
}

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

// Instant value, styled like a search box: pick a real robot, see the offer.
export function Estimator() {
  const [i, setI] = useState(7);
  const m = MODELS[i];
  const { loan, rev } = useMemo(() => {
    const rb: Robot = { id: "R-99", name: m.model, kind: m.kind, site: "", ageMonths: 0, listPrice: m.price, domesticPct: m.usPct, ratePerHour: m.rate, hoursPerMonth: 480, uptime: 0.92, health: 0.95, x: 0, z: 0 };
    return { loan: offerLoan(rb), rev: monthlyRevenue(rb) };
  }, [m]);
  return (
    <div className="w-full max-w-2xl rounded-2xl bg-white/95 p-4 text-left text-ink shadow-[0_20px_80px_rgba(2,151,222,0.25)] sm:p-5">
      <div className="flex items-center gap-3">
        <span className="text-[12px] text-ink/50">Which robot?</span>
        <select aria-label="Robot model" value={i} onChange={(e) => setI(+e.target.value)} className="min-w-0 flex-1 rounded-lg bg-ink/[0.04] px-3 py-2 text-[14px] font-medium outline-none focus:ring-2 focus:ring-blue">
          {MODELS.map((x, k) => <option key={x.model} value={k}>{x.maker} {x.model}, ${x.price.toLocaleString()}</option>)}
        </select>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-3 border-t border-ink/10 pt-4">
        {[["You get", `$${loan.advance.toLocaleString()}`], ["Repay per job", `${Math.round(loan.sweepPct * 100)}%`], ["Flat fee", `$${loan.fee.toLocaleString()}`]].map(([k, v]) => (
          <div key={k}><div className="text-[11px] text-ink/50">{k}</div><div className="text-2xl font-bold italic tracking-tight sm:text-3xl">{v}</div></div>
        ))}
      </div>
      <p className="mt-3 text-[11px] text-ink/50">Idle week? Pay nothing. A bank wants ${bankPayment(loan.advance).toLocaleString()}/mo either way. Based on ~${Math.round(rev).toLocaleString()}/mo of work [modelled].</p>
    </div>
  );
}

// Grainy wave: one soft hill of blue with an orange underglow, heavy grain, drifting slowly.
export function Wave({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      <svg viewBox="0 0 1440 900" preserveAspectRatio="none" className="absolute -inset-x-[10%] bottom-0 h-full w-[120%]" style={{ animation: "wave 18s ease-in-out infinite" }}>
        <defs><filter id="wv" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="55" /></filter></defs>
        <g filter="url(#wv)">
          <path d="M0,900 L0,640 C220,640 300,420 520,420 C760,420 820,700 1060,700 C1240,700 1330,520 1440,500 L1440,900 Z" fill="#0297DE" />
          <path d="M0,900 L0,760 C260,760 360,600 560,600 C780,600 860,820 1080,820 C1250,820 1340,700 1440,690 L1440,900 Z" fill="#FC734D" opacity="0.9" />
          <path d="M0,900 L0,850 C300,850 500,760 720,780 C960,800 1200,880 1440,860 L1440,900 Z" fill="#dfe9f5" opacity="0.8" />
        </g>
      </svg>
      <div className="grain" style={{ opacity: 0.2 }} />
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

// Real photo, pixelated: the CDN serves a tiny version and the browser scales it up crisp, with a dot screen.
export function PixelPhoto({ src, children, className = "" }: { src: string; children?: React.ReactNode; className?: string }) {
  return (
    <div className={`relative overflow-hidden rounded-3xl ${className}`}>
      <div className="absolute inset-0" style={{ backgroundImage: `url(${src}?w=72&q=70&auto=format)`, backgroundSize: "cover", backgroundPosition: "center", imageRendering: "pixelated" }} />
      <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(circle, transparent 52%, rgba(2,7,10,0.35) 54%)", backgroundSize: "7px 7px" }} />
      <div className="relative flex h-full items-center justify-center p-6">{children}</div>
    </div>
  );
}

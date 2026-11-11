"use client";
import { useEffect, useMemo, useRef, useState } from "react";
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

// Instant value as one sentence, with an in-house dropdown grouped by robot type.
export function Estimator() {
  const [i, setI] = useState(7);
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const off = (e: MouseEvent) => { if (!box.current?.contains(e.target as Node)) setOpen(false); };
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", off); document.addEventListener("keydown", esc);
    return () => { document.removeEventListener("mousedown", off); document.removeEventListener("keydown", esc); };
  }, []);
  const m = MODELS[i];
  const loan = useMemo(() => offerLoan({ id: "R-99", name: m.model, kind: m.kind, site: "", ageMonths: 0, listPrice: m.price, domesticPct: m.usPct, ratePerHour: m.rate, hoursPerMonth: 480, uptime: 0.92, health: 0.95, x: 0, z: 0 } as Robot), [m]);
  const kinds = ["Humanoid", "Quadruped", "Arm", "AMR"] as const;
  return (
    <div className="max-w-3xl text-[clamp(20px,2.3vw,30px)] font-light leading-[1.5]">
      Finance a{" "}
      <span ref={box} className="relative inline-block">
        <button type="button" aria-haspopup="listbox" aria-expanded={open} onClick={() => setOpen((o) => !o)} className="inline-flex items-center gap-2 border-b-2 border-orange font-bold italic text-white outline-none focus-visible:bg-white/10">
          {m.maker.split(" ")[0]} {m.model}<span aria-hidden className={`text-[0.55em] text-orange transition-transform ${open ? "rotate-180" : ""}`}>&#9660;</span>
        </button>
        {open && (
          <span role="listbox" className="absolute left-0 top-full z-40 mt-3 grid w-[min(92vw,560px)] grid-cols-2 gap-x-6 gap-y-4 rounded-xl border border-white/15 bg-[#0b1117]/95 p-5 text-[13px] not-italic shadow-2xl backdrop-blur-xl">
            {kinds.map((k) => (
              <span key={k} className="block">
                <span className="mb-1.5 block font-mono text-[9px] uppercase tracking-[0.2em] text-white/40">{k}</span>
                {MODELS.map((x, k2) => x.kind === k && (
                  <button key={x.model} role="option" aria-selected={k2 === i} onClick={() => { setI(k2); setOpen(false); }}
                    className={`flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left font-normal transition-colors hover:bg-white/10 ${k2 === i ? "text-orange" : "text-white/85"}`}>
                    <span>{x.maker.split(" ")[0]} {x.model}</span><span className="font-mono text-[11px] text-white/45">${(x.price / 1000).toFixed(1)}k</span>
                  </button>
                ))}
              </span>
            ))}
          </span>
        )}
      </span>{" "}
      and get <b className="font-bold italic text-orange">${loan.advance.toLocaleString()}</b> today. It repays <b className="font-bold italic">{Math.round(loan.sweepPct * 100)}%</b> of every job, and <b className="font-bold italic">nothing</b> when it&apos;s down.
      <span className="mt-2 block font-mono text-[10px] uppercase tracking-[0.15em] text-white/40">List ${m.price.toLocaleString()} &middot; one flat fee ${loan.fee.toLocaleString()} &middot; bank equivalent ${bankPayment(loan.advance).toLocaleString()}/mo fixed &middot; [modelled]</span>
    </div>
  );
}

// Grainy, asymmetric light: a lopsided blue mass and an off-centre ember of orange,
// each drifting on its own slow path so the shape keeps changing.
export function Wave({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      <svg viewBox="0 0 1440 900" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
        <defs><filter id="wv" x="-40%" y="-40%" width="180%" height="180%"><feTurbulence type="fractalNoise" baseFrequency="0.004 0.011" numOctaves="2" seed="11" /><feDisplacementMap in="SourceGraphic" scale="140" /><feGaussianBlur stdDeviation="40" /></filter></defs>
        <g filter="url(#wv)">
          <g style={{ animation: "driftA 26s ease-in-out infinite", transformOrigin: "60% 80%" }}>
            <path d="M-80,900 L-80,700 C120,690 260,520 470,560 C640,590 700,380 900,360 C1080,345 1180,520 1300,600 C1380,650 1460,640 1520,620 L1520,900 Z" fill="#2A7FB8" />
          </g>
          <g style={{ animation: "driftB 19s ease-in-out infinite", transformOrigin: "35% 90%" }}>
            <path d="M-80,900 L-80,820 C140,800 230,700 380,720 C520,740 560,820 760,830 C900,836 980,760 1060,790 C1160,830 1300,880 1520,870 L1520,900 Z" fill="#E2774F" />
          </g>
        </g>
      </svg>
      <div className="grain" style={{ opacity: 0.16, mixBlendMode: "soft-light" }} />
    </div>
  );
}


// Real photo: static, black and white, heavy film grain.
export function FilmPhoto({ src, title, line, credit, page }: { src: string; title: string; line: string; credit: string; page: string; i?: number }) {
  return (
    <figure className="relative aspect-[4/5] overflow-hidden bg-ink">
      <div className="absolute inset-0" style={{ backgroundImage: `url(${src}?w=1000&q=75&auto=format)`, backgroundSize: "cover", backgroundPosition: "center", filter: "grayscale(1) contrast(1.15) brightness(0.9)" }} />
      <div className="absolute inset-0" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.3' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")", opacity: 0.55, mixBlendMode: "overlay" }} />
      <div className="absolute inset-0" style={{ background: "linear-gradient(transparent 50%, rgba(2,7,10,0.88))" }} />
      <figcaption className="absolute inset-x-0 bottom-0 p-6">
        <div className="text-2xl font-light tracking-tight">{title}</div>
        <p className="mt-2 max-w-[260px] text-[13px] leading-snug text-white/75">{line}</p>
        <a href={page} className="mt-3 block font-mono text-[9px] uppercase tracking-[0.15em] text-white/35 hover:text-white">Photo {credit} / Unsplash</a>
      </figcaption>
    </figure>
  );
}

// Bring your own data: paste or upload a telemetry CSV (cycles,kwh per hour) and get verified hours and an offer.
export function UploadTry() {
  const [csv, setCsv] = useState("");
  const [res, setRes] = useState<null | { rows: number; verified: number; rejected: number; band: string; model: string; offer: { advance: number; sweepPct: number }; error?: string }>(null);
  const [busy, setBusy] = useState(false);
  const sample = () => {
    let seed = 5; const r = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    const rows = Array.from({ length: 60 }, (_, i) => { const c = i % 11 === 5 ? 4 + r() * 6 : 60 + r() * 140; return `${c.toFixed(0)},${(0.0138 * c + 0.35 + (r() - 0.5) * 0.3).toFixed(3)}`; });
    setCsv("cycles,kwh\n" + rows.join("\n"));
  };
  const run = async () => {
    setBusy(true);
    const d = await fetch("/api/verify", { method: "POST", body: JSON.stringify({ csv, model: "Spot" }) }).then((x) => x.json()).catch(() => ({ error: "Network error" }));
    setRes(d); setBusy(false);
  };
  return (
    <div className="max-w-3xl">
      <div className="flex flex-wrap items-center gap-3 font-mono text-[10px] uppercase tracking-[0.15em]">
        <label className="cursor-pointer rounded-md border border-white/25 px-4 py-2.5 hover:bg-white hover:text-ink">
          Upload CSV<input type="file" accept=".csv,.txt" className="hidden" onChange={async (e) => { const f = e.target.files?.[0]; if (f) setCsv(await f.text()); }} />
        </label>
        <button onClick={sample} className="rounded-md border border-white/25 px-4 py-2.5 hover:bg-white hover:text-ink">Use a sample log</button>
        <button onClick={run} disabled={!csv || busy} className="rounded-md bg-orange px-4 py-2.5 text-ink disabled:opacity-40">{busy ? "Checking..." : "Verify and price"}</button>
        <span className="normal-case tracking-normal text-white/40">one row per hour: cycles,kwh</span>
      </div>
      {csv && <pre className="mt-4 max-h-28 overflow-auto rounded-md border border-dashed border-white/15 p-3 font-mono text-[11px] text-white/50">{csv.slice(0, 600)}</pre>}
      {res && (res.error ? <p className="mt-4 text-[13px] text-orange">{res.error}</p> : (
        <p className="mt-5 text-[clamp(18px,2vw,26px)] font-light leading-snug">
          <b className="font-bold italic">{res.verified}</b> of {res.rows} hours verified, <b className="font-bold italic text-orange">{res.rejected}</b> rejected ({res.band} band). A {res.model} working like this gets <b className="font-bold italic text-orange">${res.offer.advance.toLocaleString()}</b> and repays <b className="font-bold italic">{Math.round(res.offer.sweepPct * 100)}%</b> of each job. [modelled]
        </p>
      ))}
    </div>
  );
}

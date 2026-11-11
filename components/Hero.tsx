"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { bankPayment, monthlyRevenue, offerLoan, type Robot } from "@/lib/engine";
import { MODELS } from "@/lib/models";

// The reference fluted-glass backdrop, recoloured to our blue with an orange core,
// heavy grain on top. It drifts slowly and leans toward the cursor.
export function GlassBackdrop() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current!;
    let x = 0, y = 0, tx = 0, ty = 0, raf = 0;
    const tick = () => {
      x += (tx - x) * 0.05; y += (ty - y) * 0.05;
      el.style.setProperty("--px", `${x * -24}px`); el.style.setProperty("--py", `${y * -14}px`);
      raf = requestAnimationFrame(tick);
    };
    const move = (e: PointerEvent) => { tx = e.clientX / innerWidth - 0.5; ty = e.clientY / innerHeight - 0.5; };
    window.addEventListener("pointermove", move); tick();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("pointermove", move); };
  }, []);
  return (
    <div ref={ref} aria-hidden className="absolute inset-0 overflow-hidden bg-ink">
      <div className="absolute -inset-10" style={{ backgroundImage: "url(/hero.jpg)", backgroundSize: "cover", backgroundPosition: "center 40%", filter: "hue-rotate(-34deg) saturate(1.15) brightness(0.95)", transform: "translate(var(--px,0), var(--py,0))", animation: "breathe 16s ease-in-out infinite" }} />
      <div className="absolute inset-0" style={{ background: "radial-gradient(38% 16% at 50% 66%, #FC734D, transparent 75%)", mixBlendMode: "color", opacity: 0.85 }} />
      <div className="grain" style={{ opacity: 0.32 }} />
      <div className="absolute inset-x-0 bottom-0 h-48" style={{ background: "linear-gradient(transparent, #02070A)" }} />
    </div>
  );
}

// Instant value: pick a real robot, see the offer.
export function Estimator() {
  const [i, setI] = useState(7);
  const m = MODELS[i];
  const { loan, rev } = useMemo(() => {
    const rb: Robot = { id: "R-99", name: m.model, kind: m.kind, site: "", ageMonths: 0, listPrice: m.price, domesticPct: m.usPct, ratePerHour: m.rate, hoursPerMonth: 480, uptime: 0.92, health: 0.95, x: 0, z: 0 };
    return { loan: offerLoan(rb), rev: monthlyRevenue(rb) };
  }, [m]);
  return (
    <div className="mx-auto w-full max-w-2xl rounded-3xl border border-white/15 bg-black/55 p-5 text-left backdrop-blur-xl sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <label className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/60" htmlFor="model">Your robot</label>
        <select id="model" value={i} onChange={(e) => setI(+e.target.value)} className="rounded-full border border-white/20 bg-black/40 px-4 py-2 text-[14px] font-semibold outline-none focus:border-blue">
          {MODELS.map((x, k) => <option key={x.model} value={k}>{x.maker} {x.model} (${x.price.toLocaleString()})</option>)}
        </select>
      </div>
      <div className="mt-5 grid grid-cols-3 gap-3">
        {[["You get", `$${loan.advance.toLocaleString()}`], ["Repay per job", `${Math.round(loan.sweepPct * 100)}%`], ["Flat fee", `$${loan.fee.toLocaleString()}`]].map(([k, v]) => (
          <div key={k}><div className="text-[11px] text-white/55">{k}</div><div className="text-xl font-extrabold tracking-tight sm:text-3xl">{v}</div></div>
        ))}
      </div>
      <p className="mt-4 text-[12px] text-white/55">Robot idle for a week? You pay nothing that week. A bank wants ${bankPayment(loan.advance).toLocaleString()}/mo either way. Estimate at ~${Math.round(rev).toLocaleString()}/mo of work [modelled].</p>
    </div>
  );
}

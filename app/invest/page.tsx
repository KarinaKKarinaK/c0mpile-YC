"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { monthlyRevenue, offerLoan, seedFleet, type Kind, type Robot } from "@/lib/engine";
import { Logo } from "@/components/Ui";

// Back a fleet: the capital side. Lenders list pools of telemetry-priced robot loans; qualified investors fund slices
// and are paid from the same verified-job sweep. Demo only, every figure [modelled].
const KINDS: Kind[] = ["Humanoid", "Quadruped", "Arm", "AMR"];
const usd = (n: number) => (n >= 1e4 ? `$${(n / 1e3).toFixed(1)}k` : `$${Math.round(n).toLocaleString()}`);
type Feed = { id: number; robot: string; kind: Kind; amount: number; paused: boolean };

export default function Invest() {
  const [fleet, setFleet] = useState<Robot[]>(seedFleet());
  const [feed, setFeed] = useState<Feed[]>([]);
  const [paid, setPaid] = useState<Record<Kind, number>>({ Humanoid: 0, Quadruped: 0, Arm: 0, AMR: 0 });
  const [interest, setInterest] = useState<Kind | null>(null);

  // read the desk demo state so a line jam on /desk pauses payouts here too
  useEffect(() => { try { const raw = localStorage.getItem("hebl-v1"); if (raw) setFleet(JSON.parse(raw).fleet); } catch {} }, []);

  const pools = useMemo(() => KINDS.map((k) => {
    const rs = fleet.filter((r) => r.kind === k);
    const loans = rs.map((r) => ({ r, l: offerLoan(r) }));
    const size = loans.reduce((a, x) => a + x.l.advance, 0);
    const fees = loans.reduce((a, x) => a + x.l.fee, 0);
    const months = loans.reduce((a, x) => a + (x.l.advance + x.l.fee) / Math.max(1, monthlyRevenue(x.r) * x.l.sweepPct), 0) / Math.max(1, loans.length);
    const yieldPct = (fees / Math.max(1, size)) * (12 / Math.max(1, months)) * 100; // flat fee spread over expected payoff
    const uptime = rs.reduce((a, r) => a + (r.faulted ? 0 : r.uptime), 0) / Math.max(1, rs.length);
    return { k, rs, size, yieldPct, months, uptime, down: rs.filter((r) => r.faulted).length };
  }), [fleet]);

  // payout feed: every 1.5 s a verified job somewhere in the fleet pays its pool
  useEffect(() => {
    let id = 0;
    const t = setInterval(() => {
      const r = fleet[Math.floor(Math.random() * fleet.length)];
      const l = offerLoan(r);
      const amount = Math.round(r.ratePerHour * (2 + Math.random() * 6) * l.sweepPct * 100) / 100;
      const paused = !!r.faulted;
      setFeed((f) => [{ id: ++id, robot: `${r.maker?.split(" ")[0]} ${r.model}`, kind: r.kind, amount, paused }, ...f].slice(0, 9));
      if (!paused) setPaid((p) => ({ ...p, [r.kind]: p[r.kind] + amount }));
    }, 1500);
    return () => clearInterval(t);
  }, [fleet]);

  return (
    <main className="min-h-screen bg-ink font-light">
      <header className="sticky top-0 z-50 border-b border-dashed border-white/15 bg-ink/80 backdrop-blur-md">
        <nav className="mx-auto flex max-w-7xl items-center justify-between border-x border-dashed border-white/15 px-6 py-4">
          <Link href="/"><Logo /></Link>
          <div className="flex gap-8 font-mono text-[10px] uppercase tracking-[0.2em] text-white/70">
            <Link href="/" className="hover:text-white">Home</Link>
            <Link href="/desk" className="hover:text-white">Operators</Link>
            <span className="text-white">Back a fleet</span>
          </div>
        </nav>
      </header>

      <section className="mx-auto max-w-7xl border-x border-dashed border-white/15 px-6 pb-16 pt-16">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/50">( Back a fleet )</p>
        <h1 className="mt-4 max-w-4xl text-[clamp(36px,5vw,68px)] font-light leading-[1.05] tracking-[-0.02em]">
          Earn from robots <em className="text-orange">that actually work</em>.
        </h1>
        <p className="mt-5 max-w-2xl text-[16px] leading-relaxed text-white/75">Lenders pool Hebl robot loans. Qualified investors fund a slice and are paid from the same share of every verified job. When a robot is down, its payouts pause and you see why, live.</p>
        <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.15em] text-orange/90">Accredited and institutional investors only, via a licensed partner &middot; demo, not an offer &middot; figures [modelled]</p>
      </section>

      <section className="border-y border-dashed border-white/15">
        <div className="mx-auto grid max-w-7xl gap-px border-x border-dashed border-white/15 bg-white/10 md:grid-cols-4">
          {pools.map((p) => (
            <div key={p.k} className="bg-ink p-6">
              <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/50">{p.k} pool &middot; {p.rs.length} robots</div>
              <div className="mt-4 text-5xl font-light tracking-tight">{p.yieldPct.toFixed(1)}%</div>
              <div className="text-[12px] text-white/55">target yield, paid per verified job</div>
              <dl className="mt-5 space-y-1.5 text-[12px]">
                <div className="flex justify-between"><dt className="text-white/50">Pool size</dt><dd>{usd(p.size)}</dd></div>
                <div className="flex justify-between"><dt className="text-white/50">Avg payoff</dt><dd>{p.months.toFixed(0)} months</dd></div>
                <div className="flex justify-between"><dt className="text-white/50">Uptime now</dt><dd className={p.down ? "text-orange" : ""}>{Math.round(p.uptime * 100)}%{p.down ? `, ${p.down} down` : ""}</dd></div>
                <div className="flex justify-between"><dt className="text-white/50">Paid out this session</dt><dd>${paid[p.k].toFixed(2)}</dd></div>
              </dl>
              <button onClick={() => setInterest(p.k)} className={`mt-6 w-full rounded-md border px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.15em] transition ${interest === p.k ? "border-orange bg-orange text-ink" : "border-white/25 hover:bg-white hover:text-ink"}`}>
                {interest === p.k ? "Interest noted (demo)" : "Request allocation"}
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 border-x border-dashed border-white/15 px-6 py-16 md:grid-cols-[1.2fr_1fr]">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/50">( Live payouts )</p>
          <ul className="mt-5 divide-y divide-dashed divide-white/10 font-mono text-[12px]">
            {feed.map((f) => (
              <li key={f.id} className="flex items-center justify-between py-2.5">
                <span><span className={`mr-2 inline-block h-1.5 w-1.5 rounded-full ${f.paused ? "bg-orange" : "bg-blue"}`} />{f.robot} <span className="text-white/35">{f.kind}</span></span>
                <span className={f.paused ? "text-orange" : "text-white"}>{f.paused ? "paused: robot down" : `+$${f.amount.toFixed(2)}`}</span>
              </li>
            ))}
            {!feed.length && <li className="py-2.5 text-white/40">Waiting for the first verified job...</li>}
          </ul>
        </div>
        <div className="text-[14px] leading-relaxed text-white/70">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/50">( How you get paid )</p>
          <ol className="mt-5 space-y-3">
            <li><b className="font-bold text-white">1.</b> A robot finishes a job. Its telemetry must match the hours billed.</li>
            <li><b className="font-bold text-white">2.</b> The client pays through Stripe. A fixed share goes to the loan.</li>
            <li><b className="font-bold text-white">3.</b> That repayment flows to the pool and to you, pro rata.</li>
            <li><b className="font-bold text-white">4.</b> Trigger a line jam on the <Link href="/desk" className="text-orange underline-offset-4 hover:underline">operator desk</Link> and watch that pool pause here.</li>
          </ol>
        </div>
      </section>
    </main>
  );
}

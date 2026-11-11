"use client";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  append, applyPayment, bankPayment, calibrate, canChange, checkJob, COVENANTS, fakeHour, fccCompliant,
  honestHour, licenseClip, MOBILE, monthlyRevenue, offerLoan, rng, robotValue, seedFleet, verifyChain, verifyHour,
  type Covenant, type Event, type Job, type Kind, type Loan, type Robot,
} from "@/lib/engine";
import { Logo } from "@/components/Ui";
import { Accordion, AccordionItem, Alert } from "@/components/kit";
import MarketChart, { latest, useMarket } from "@/components/MarketChart";

const Factory = dynamic(() => import("@/components/Fleet3D"), { ssr: false, loading: () => <div className="grid h-full place-items-center text-[12px] text-white/40">Loading factory</div> });

const OFFERS = [
  { label: "$31/h pallets", text: "Pallet moving for Acme Foods at the Columbus DC, 6 hours tonight, paying $31/h." },
  { label: "$12/h sorting", text: "Quick sort job for Budget Bins, 10 hours at $12/h, cash only." },
  { label: "22 h inspection", text: "Shelf inspection for Northwind Retail, 22 hours straight, $40/h." },
];
const CLIP = "Robot slipped on a wet floor near the loading dock while carrying a tote, recovered after three tries.";
const CLIP_PRICE = [40, 80, 150]; // USD per licence by rarity [target]
const KINDS: Kind[] = ["Humanoid", "Quadruped", "Arm", "AMR"];
const usd = (n: number) => (n >= 1e6 ? `$${(n / 1e6).toFixed(2)}M` : n >= 1e4 ? `$${(n / 1e3).toFixed(1)}k` : `$${Math.round(n).toLocaleString()}`);
const band = calibrate(Array.from({ length: 400 }, ((r) => () => honestHour(r))(rng(3))));
type State = { fleet: Robot[]; loans: Record<string, Loan>; log: Event[]; covs: Covenant[]; sel: string };
const KEY = "fleiss-v1";

export default function Desk() {
  const [s, setS] = useState<State>({ fleet: seedFleet(), loans: {}, log: [], covs: COVENANTS, sel: "R-06" });
  const [ready, setReady] = useState(false);
  const [provider, setProvider] = useState("...");
  const [job, setJob] = useState<null | { job: Job; provider: string; ms: number; check: ReturnType<typeof checkJob> }>(null);
  const [spoof, setSpoof] = useState(true);
  const [busy, setBusy] = useState("");
  const [clipRes, setClipRes] = useState("");
  const [approvals, setApprovals] = useState<string[]>([]);
  const [chain, setChain] = useState("");
  const [toast, setToast] = useState("");
  const [focus, setFocus] = useState<Kind>("Humanoid");
  const market = useMarket();

  const rb = s.fleet.find((r) => r.id === s.sel)!;
  const loan = s.loans[rb.id];
  const offerL = useMemo(() => offerLoan(rb), [rb]);
  const idx = (r: Robot) => latest(market, r.kind) / 100;
  const valueOf = (r: Robot) => robotValue(r) * idx(r);

  const log = async (type: string, data: unknown, next: Partial<State> = {}) => {
    const l = await append(s.log, type, data);
    setS((p) => ({ ...p, ...next, log: l }));
  };
  const flash = (m: string) => { setToast(m); setTimeout(() => setToast(""), 4000); };

  useEffect(() => {
    let st = s;
    try { const raw = localStorage.getItem(KEY); if (raw) st = JSON.parse(raw); } catch {}
    setS(st); setReady(true);
    fetch("/api/agent").then((r) => r.json()).then((d) => setProvider(d.provider)).catch(() => setProvider("offline parser"));
    const id = new URLSearchParams(location.search).get("paid");
    if (!id) return;
    history.replaceState(null, "", "/desk");
    fetch(`/api/checkout?id=${id}`).then((r) => r.json()).then(async (d) => {
      if (!d.paid) return flash("Stripe says this session is not paid. Nothing moved.");
      await settle(st, d.robotId, d.amount, `stripe ${d.id.slice(0, 14)}`);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => { if (ready) try { localStorage.setItem(KEY, JSON.stringify(s)); } catch {} }, [s, ready]);

  async function settle(st: State, robotId: string, amount: number, ref: string) {
    const l = st.loans[robotId];
    const res = l ? applyPayment(l, amount) : { toLender: 0, toOperator: amount, loan: l };
    const nl = await append(st.log, "job.paid", { robotId, amount, toLender: res.toLender, toOperator: res.toOperator, ref });
    setS({ ...st, loans: l ? { ...st.loans, [robotId]: res.loan } : st.loans, log: nl });
    flash(`Paid ${usd(amount)}. ${usd(res.toLender)} to the lender, ${usd(res.toOperator)} to you.`);
  }
  async function readOffer(text: string) {
    setBusy("read"); setJob(null);
    const d = await fetch("/api/agent", { method: "POST", body: JSON.stringify({ mode: "job", text }) }).then((r) => r.json());
    const check = checkJob(d.job, rb, s.covs);
    setJob({ job: d.job, provider: d.provider, ms: d.ms, check });
    await log(check.ok ? "job.accepted" : "job.blocked", { robotId: rb.id, job: d.job, broken: check.broken.map((c) => c.id), readBy: d.provider });
    setBusy("");
  }
  const hours = useMemo(() => {
    if (!job?.check.ok) return null;
    const r = rng(job.job.hours * 7 + rb.x * 13);
    return Array.from({ length: Math.ceil(job.job.hours) }, (_, i) => verifyHour(spoof && i % 3 === 2 ? fakeHour(r) : honestHour(r), band));
  }, [job, spoof, rb.x]);
  const billable = hours ? hours.filter((h) => h.ok).length * (job?.job.payPerHour ?? 0) : 0;
  async function pay() {
    setBusy("pay");
    const d = await fetch("/api/checkout", { method: "POST", body: JSON.stringify({ robotId: rb.id, amount: billable, description: job?.job.task }) }).then((r) => r.json());
    if (d.url) { location.href = d.url; return; }
    await settle(s, rb.id, billable, "simulated payment (no Stripe key)");
    setJob(null); setBusy("");
  }
  async function license() {
    if (!loan) return flash("Fund this robot first.");
    setBusy("clip");
    const d = await fetch("/api/agent", { method: "POST", body: JSON.stringify({ mode: "clip", text: CLIP }) }).then((r) => r.json());
    const price = CLIP_PRICE[d.rarity - 1];
    const res = licenseClip(loan, price);
    setClipRes(`"${d.tag}", rarity ${d.rarity}/3, sold for ${usd(price)}. ${usd(res.operator)} paid down the loan.`);
    await log("data.licensed", { robotId: rb.id, tag: d.tag, rarity: d.rarity, price, toLoan: res.operator }, { loans: { ...s.loans, [rb.id]: res.loan } });
    setBusy("");
  }
  const setFault = (id: string, faulted: boolean) =>
    log(faulted ? "robot.fault" : "robot.serviced", { robotId: id, health: faulted ? 0.55 : 0.92 }, { sel: id, fleet: s.fleet.map((r) => (r.id === id ? { ...r, faulted, health: faulted ? 0.55 : 0.92 } : r)) });

  const fleetValue = s.fleet.reduce((a, r) => a + valueOf(r), 0);
  const fleetRev = s.fleet.reduce((a, r) => a + monthlyRevenue(r), 0);
  const lent = Object.values(s.loans).reduce((a, l) => a + l.balance, 0);
  const running = s.fleet.filter((r) => !r.faulted).length;
  const swept = s.fleet.reduce((a, r) => a + (s.loans[r.id] ? monthlyRevenue(r) * s.loans[r.id].sweepPct : 0), 0);
  const downCost = s.fleet.filter((r) => r.faulted).reduce((a, r) => a + (monthlyRevenue({ ...r, faulted: false }) - monthlyRevenue(r)) / 30, 0);
  const best = [...s.fleet].filter((r) => !s.loans[r.id]).sort((x, y) => offerLoan(y).advance - offerLoan(x).advance)[0];
  const pick = (id: string) => { setS((p) => ({ ...p, sel: id })); setJob(null); document.getElementById("robot")?.scrollIntoView({ behavior: "smooth", block: "start" }); };
  const todo = [
    ...s.fleet.filter((r) => r.faulted).map((r) => ({ k: `f${r.id}`, warn: true, title: `${r.maker} ${r.model} stopped`, sub: `Line jam, costing ${usd((monthlyRevenue({ ...r, faulted: false }) - monthlyRevenue(r)) / 30)} a day`, cta: "Send technician", go: () => setFault(r.id, false) })),
    ...(best ? [{ k: "fund", warn: false, title: `Fund the ${best.model}: get ${usd(offerLoan(best).advance)}`, sub: `Repay ${(offerLoan(best).sweepPct * 100).toFixed(0)}% of its jobs, no interest`, cta: "Review", go: () => pick(best.id) }] : []),
    ...(loan ? [{ k: "jobs", warn: false, title: `3 job offers for the ${rb.model}`, sub: "The AI reads them, your loan rules decide", cta: "Open", go: () => pick(rb.id) }] : []),
  ];
  const step = !loan ? 0 : job ? 1 : 2;
  const paidPct = loan ? 1 - loan.balance / (loan.advance + loan.fee) : 0;
  const fcc = !MOBILE.includes(rb.kind) ? "FCC: out of scope" : fccCompliant(rb) ? "FCC: compliant" : "FCC: new models blocked";

  return (
    <main className="min-h-screen pb-16" style={{ background: "radial-gradient(70% 40% at 50% 0%, rgba(2,151,222,0.16), transparent 70%), #02070A" }}>
      <header className="flex items-center justify-between px-4 py-4 text-[12px] sm:px-6">
        <Link href="/"><Logo /></Link>
        <div className="flex items-center gap-2 text-white/60">
          <span className="hidden sm:inline">AI: {provider}</span>
          <span className="hidden sm:inline">&middot; Stripe test mode &middot;</span>
          <button className="btn btn-ghost" onClick={() => { localStorage.removeItem(KEY); location.reload(); }}>Reset</button>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-4 px-4 pb-4 sm:px-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="card p-5">
          <div className="flex items-baseline justify-between"><h1 className="font-serif text-3xl font-light">Today</h1><span className="font-mono text-[11px] text-white/45">{ready ? new Date().toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" }) : ""}</span></div>
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[["Earned yesterday", usd(fleetRev / 30), ""], ["To lenders", usd(swept / 30), ""], ["Down now", `${s.fleet.length - running}`, s.fleet.length - running ? `-${usd(downCost)}/day` : "all running"], ["Still owed", usd(lent), Object.keys(s.loans).length ? `${Object.keys(s.loans).length} loans` : "no loans yet"]].map(([k, v, sub]) => (
              <div key={k}><div className="font-mono text-[10px] uppercase tracking-wider text-white/45">{k}</div><div className={`font-serif text-4xl font-light ${k === "Down now" && running < s.fleet.length ? "text-orange" : ""}`}>{v}</div><div className="text-[11px] text-white/45">{sub}</div></div>
            ))}
          </div>
        </div>
        <div className="card p-5">
          <div className="font-mono text-[10px] uppercase tracking-wider text-white/45">Needs you ({todo.length})</div>
          <ul className="mt-3 space-y-2">
            {todo.map((t) => (
              <li key={t.k} className="flex items-center justify-between gap-3 rounded-xl bg-white/[0.04] px-3 py-2.5 text-[13px]">
                <span className="min-w-0"><span className={t.warn ? "text-orange" : "text-white/90"}>{t.title}</span><span className="block text-[11px] text-white/45">{t.sub}</span></span>
                <button className={`btn shrink-0 ${t.warn ? "btn-orange" : "btn-ghost"}`} onClick={t.go}>{t.cta}</button>
              </li>
            ))}
            {!todo.length && <li className="text-[13px] text-white/50">Nothing. Your robots are working.</li>}
          </ul>
        </div>
      </section>

      <section className="relative h-[52vh] min-h-[360px] sm:h-[60vh]">
        <Factory fleet={s.fleet} selected={s.sel} onSelect={(id) => { setS((p) => ({ ...p, sel: id })); setJob(null); setClipRes(""); }} />
        <div className="pointer-events-none absolute inset-x-4 top-4 flex items-start justify-between gap-3 sm:inset-x-6">
          <span className="text-[10px] uppercase tracking-wider text-white/40">Live factory [synthetic] &middot; drag to orbit</span>
          <div className="pointer-events-auto">
            {s.fleet.some((r) => r.faulted) ? (
              <Alert tone="warn" className="max-w-xs backdrop-blur">
                <b>Line stopped.</b> {s.fleet.filter((r) => r.faulted).map((r) => `${r.maker} ${r.model}`).join(", ")}. Revenue -60%. Repayment flexes down. Bank bill does not.
                <button className="btn btn-blue mt-2" onClick={() => s.fleet.filter((r) => r.faulted).forEach((r) => setFault(r.id, false))}>Send technician</button>
              </Alert>
            ) : (
              <button className="btn btn-orange" onClick={() => setFault("R-06", true)}>Trigger line jam</button>
            )}
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-0 flex gap-2 overflow-x-auto px-4 pb-3 sm:px-6" style={{ background: "linear-gradient(transparent, rgba(2,7,10,0.9))" }}>
          {s.fleet.map((r) => (
            <button key={r.id} onClick={() => { setS((p) => ({ ...p, sel: r.id })); setJob(null); }}
              className={`glass flex shrink-0 items-center gap-2 rounded-full px-3 py-1.5 text-[11px] transition ${r.id === s.sel ? "border-orange/70 text-white" : "text-white/70 hover:text-white"}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${r.faulted ? "pulse bg-orange" : s.loans[r.id] ? "bg-orange/70" : "bg-blue"}`} />{r.maker?.split(" ")[0]} {r.model}
            </button>
          ))}
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-4 px-4 pt-5 sm:px-6 lg:grid-cols-[1fr_420px]">
        <section className="card min-w-0 p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="kicker">Robot resale index &middot; moves with live news</p>
            <div className="glass flex rounded-full p-1 text-[11px]">
              {KINDS.map((k) => <button key={k} onClick={() => setFocus(k)} className={`rounded-full px-3 py-1 ${focus === k ? "bg-white text-ink" : "text-white/70"}`}>{k}</button>)}
            </div>
          </div>
          <div className="mt-4"><MarketChart m={market} focus={focus} /></div>
          <ul className="mt-4 divide-y divide-white/5 text-[12px]">
            {(market?.headlines ?? []).slice(0, 5).map((h) => (
              <li key={h.link} className="flex items-start gap-3 py-2.5">
                <span className={`mt-0.5 w-12 shrink-0 text-right font-mono ${h.impact > 0 ? "text-blue" : "text-orange"}`}>{h.impact > 0 ? "+" : ""}{h.impact.toFixed(1)}</span>
                <a href={h.link} target="_blank" rel="noreferrer" className="min-w-0 flex-1 hover:text-white" title={h.rule}><span className="text-white/85">{h.title}</span> <span className="text-white/35">{h.source}</span></a>
              </li>
            ))}
          </ul>
        </section>

        <section id="robot" className="card min-w-0 scroll-mt-4 p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="text-[11px] text-white/50">{rb.id} &middot; {rb.maker} &middot; {rb.madeIn}</div>
              <h2 className="font-serif text-4xl">{rb.model} {rb.faulted && <em className="pulse text-orange">stopped</em>}</h2>
              <a href={rb.source} target="_blank" rel="noreferrer" className="text-[10px] text-white/40 hover:underline">List {usd(rb.listPrice)} &middot; {rb.priceNote}</a>
            </div>
            <div className="text-right"><div className="font-serif text-3xl">{usd(valueOf(rb))}</div><div className="text-[10px] text-white/45">value today</div></div>
          </div>
          <div className="mt-3 flex flex-wrap gap-2 text-[10px]">
            <span className="glass rounded-full px-2.5 py-1">{fcc}</span>
            <span className="glass rounded-full px-2.5 py-1">{usd(monthlyRevenue(rb))}/mo verified</span>
            <span className="glass rounded-full px-2.5 py-1">health {rb.health.toFixed(2)}</span>
          </div>

          <ol className="mt-5 grid grid-cols-3 gap-1 text-[10px]">
            {["Fund", "Take a job", "Get paid"].map((t, i) => (
              <li key={t} className={`rounded-full px-2 py-1 text-center ${i <= step ? "bg-orange text-ink" : "bg-white/5 text-white/50"}`}>{i + 1} {t}</li>
            ))}
          </ol>

          {!loan ? (
            <div className="mt-5">
              <div className="grid grid-cols-2 gap-3">
                <div><div className="text-[10px] text-white/50">You get</div><div className="font-serif text-4xl">{usd(offerL.advance)}</div></div>
                <div><div className="text-[10px] text-white/50">You repay</div><div className="font-serif text-4xl">{(offerL.sweepPct * 100).toFixed(0)}%<span className="text-lg"> of each job</span></div></div>
              </div>
              <p className="mt-2 text-[11px] text-white/50">One {usd(offerL.fee)} fee. No interest. A bank wants {usd(bankPayment(offerL.advance))}/mo at 10.55%, working or not.</p>
              <button className="btn btn-orange mt-4 w-full justify-center py-3" onClick={() => log("loan.funded", { ...offerL }, { loans: { ...s.loans, [rb.id]: offerL } })}>Fund this robot</button>
            </div>
          ) : (
            <div className="mt-5">
              <div className="flex justify-between text-[11px]"><span>Owed {usd(loan.balance)}</span><span className="text-white/50">{Math.round(paidPct * 100)}% repaid</span></div>
              <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full bg-gradient-to-r from-blue to-orange transition-all duration-700" style={{ width: `${Math.max(2, paidPct * 100)}%` }} /></div>
              <p className="mt-4 text-[11px] text-white/50">Pick a job. The AI reads it, the loan rules decide.</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {OFFERS.map((o) => <button key={o.label} disabled={busy === "read"} className="btn btn-ghost" onClick={() => readOffer(o.text)}>{o.label}</button>)}
              </div>
              {busy === "read" && <p className="mt-3 text-[11px] text-white/50">Reading offer...</p>}
              {job && !job.check.ok && <Alert tone="warn" className="mt-3">Blocked by {job.check.broken.map((c) => c.text).join(", ")}. The AI cannot override this.</Alert>}
              {job?.check.ok && (
                <div className="mt-3 rounded-xl border border-white/10 p-3 text-[11px]">
                  <div className="flex justify-between"><span>{job.job.client}: {job.job.hours} h at ${job.job.payPerHour}</span><span className="text-white/40">{job.provider}, {job.ms} ms</span></div>
                  <div className="mt-2 flex flex-wrap gap-1">{hours?.map((h, i) => <span key={i} title={h.reason} className={`h-4 w-4 rounded-sm ${h.ok ? "bg-blue" : "bg-orange"}`} />)}</div>
                  <label className="mt-2 flex items-center gap-2 text-white/50"><input type="checkbox" checked={spoof} onChange={(e) => setSpoof(e.target.checked)} /> include faked hours</label>
                  <button className="btn btn-orange mt-3 w-full justify-center py-3" disabled={busy === "pay" || billable === 0} onClick={pay}>Get paid {usd(billable)} with Stripe</button>
                  <p className="mt-1 text-center text-white/40">{hours?.filter((h) => !h.ok).length} faked hours never billed</p>
                </div>
              )}
            </div>
          )}

          <div className="mt-6 border-t border-white/10 pt-2">
            <Accordion>
              <AccordionItem title="Earn twice: sell an edge case">
                <p>{CLIP}</p>
                <button className="btn btn-blue mt-3" disabled={busy === "clip"} onClick={license}>{busy === "clip" ? "Tagging..." : "Tag and sell clip"}</button>
                {clipRes && <p className="mt-2 text-white/80">{clipRes}</p>}
              </AccordionItem>
              <AccordionItem title="Loan rules">
                <ul className="space-y-1">{s.covs.map((c) => <li key={c.id}>{c.id} {c.text}</li>)}</ul>
                <p className="mt-3">Lower C1 to $15/h? Needs lender and operator.</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {["lender", "operator"].map((w) => <button key={w} className={`btn ${approvals.includes(w) ? "btn-blue" : "btn-ghost"}`} onClick={() => setApprovals((a) => (a.includes(w) ? a : [...a, w]))}>{w} approves</button>)}
                  <button className="btn btn-orange" disabled={!canChange(approvals)} onClick={async () => { const pr = { id: "C1", text: "No job below $15 per hour", minRate: 15 }; await log("covenant.changed", { ...pr, approvers: approvals }, { covs: s.covs.map((c) => (c.id === "C1" ? pr : c)) }); setApprovals([]); }}>Apply</button>
                </div>
              </AccordionItem>
              <AccordionItem title={`Audit trail (${s.log.length})`}>
                <div className="flex gap-2">
                  <button className="btn btn-ghost" onClick={async () => { const r = await verifyChain(s.log); setChain(r.ok ? `Intact: ${s.log.length} events.` : `Tampering found at event ${r.at}.`); }}>Verify</button>
                  <button className="btn btn-ghost" disabled={!s.log.length} onClick={() => { setS((p) => ({ ...p, log: p.log.map((e, i) => (i === 0 ? { ...e, data: { edited: true } } : e)) })); setChain("Event 0 edited. Verify it."); }}>Tamper</button>
                </div>
                {chain && <p className={`mt-2 ${chain.startsWith("Intact") ? "text-blue" : "text-orange"}`}>{chain}</p>}
                <ul className="mt-2 max-h-40 space-y-1 overflow-auto font-mono text-[10px]">{[...s.log].reverse().map((e) => <li key={e.i} className="flex justify-between"><span>{e.type}</span><span className="text-white/35">{e.hash.slice(0, 10)}</span></li>)}</ul>
              </AccordionItem>
            </Accordion>
          </div>
        </section>
      </div>

      {toast && <Alert tone="ok" className="fixed bottom-5 left-1/2 z-50 w-[min(92vw,520px)] -translate-x-1/2 backdrop-blur">{toast}</Alert>}
    </main>
  );
}

"use client";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  append, applyPayment, bankPayment, calibrate, canChange, checkJob, COVENANTS, fakeHour, fccCompliant,
  honestHour, licenseClip, MOBILE, monthlyRevenue, offerLoan, rng, robotValue, seedFleet, verifyChain, verifyHour,
  type Covenant, type Event, type Job, type Loan, type Robot,
} from "@/lib/engine";
import { Logo } from "@/components/Ui";
import { Alert, Backdrop } from "@/components/kit";

const Fleet3D = dynamic(() => import("@/components/Fleet3D"), { ssr: false, loading: () => <div className="grid h-full place-items-center text-[12px] text-white/50">Loading fleet</div> });

const OFFERS = [
  "Pallet moving for Acme Foods at the Columbus DC, 6 hours tonight, paying $31/h.",
  "Quick sort job for Budget Bins, 10 hours at $12/h, cash only.",
  "Shelf inspection for Northwind Retail, 22 hours straight, $40/h.",
];
const CLIP = "Robot slipped on a wet floor near the loading dock while carrying a tote, recovered after three tries.";
const CLIP_PRICE = [40, 80, 150]; // USD per licence by rarity [target]
const usd = (n: number) => `$${Math.round(n).toLocaleString()}`;
const short = (h: string) => `${h.slice(0, 6)}...${h.slice(-4)}`;
const band = calibrate(Array.from({ length: 400 }, ((r) => () => honestHour(r))(rng(3))));

type State = { fleet: Robot[]; loans: Record<string, Loan>; log: Event[]; covs: Covenant[]; sel: string };
const KEY = "selfmade-v1";

export default function Desk() {
  const [s, setS] = useState<State>({ fleet: seedFleet(), loans: {}, log: [], covs: COVENANTS, sel: "R-01" });
  const [ready, setReady] = useState(false);
  const [provider, setProvider] = useState("...");
  const [offer, setOffer] = useState(OFFERS[0]);
  const [job, setJob] = useState<null | { job: Job; note: string; provider: string; ms: number; check: ReturnType<typeof checkJob> }>(null);
  const [spoof, setSpoof] = useState(true);
  const [busy, setBusy] = useState("");
  const [clip, setClip] = useState(CLIP);
  const [clipRes, setClipRes] = useState("");
  const [approvals, setApprovals] = useState<string[]>([]);
  const [chain, setChain] = useState("");
  const [toast, setToast] = useState("");
  const [explain, setExplain] = useState(false);

  const rb = s.fleet.find((r) => r.id === s.sel)!;
  const loan = s.loans[rb.id];
  const offerL = useMemo(() => offerLoan(rb), [rb]);

  const log = async (type: string, data: unknown, next: Partial<State> = {}) => {
    const l = await append(s.log, type, data);
    setS((p) => ({ ...p, ...next, log: l }));
  };
  const flash = (m: string) => { setToast(m); setTimeout(() => setToast(""), 3500); };

  // load saved state, then settle a Stripe payment if Checkout just redirected back
  useEffect(() => {
    let st = s;
    try { const raw = localStorage.getItem(KEY); if (raw) st = JSON.parse(raw); } catch {}
    setS(st); setReady(true);
    fetch("/api/agent").then((r) => r.json()).then((d) => setProvider(`${d.provider}${d.model && d.model !== "regex" ? ` / ${d.model}` : ""}`)).catch(() => setProvider("offline parser"));
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
    flash(`${usd(amount)} paid. ${usd(res.toLender)} swept to the lender, ${usd(res.toOperator)} to the operator.`);
  }

  async function readOffer() {
    setBusy("read");
    const d = await fetch("/api/agent", { method: "POST", body: JSON.stringify({ mode: "job", text: offer }) }).then((r) => r.json());
    const check = checkJob(d.job, rb, s.covs);
    setJob({ job: d.job, note: d.note, provider: d.provider, ms: d.ms, check });
    await log(check.ok ? "job.accepted" : "job.blocked", { robotId: rb.id, job: d.job, broken: check.broken.map((c) => c.id), readBy: d.provider });
    setBusy("");
  }

  // Only telemetry-verified hours are billed.
  const hours = useMemo(() => {
    if (!job?.check.ok) return null;
    const r = rng(job.job.hours * 7 + rb.x * 13);
    const hs = Array.from({ length: Math.ceil(job.job.hours) }, (_, i) => (spoof && i % 3 === 2 ? fakeHour(r) : honestHour(r)));
    return hs.map((h) => verifyHour(h, band));
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
    if (!loan) return flash("Fund the robot first so data income can pay the loan.");
    setBusy("clip");
    const d = await fetch("/api/agent", { method: "POST", body: JSON.stringify({ mode: "clip", text: clip }) }).then((r) => r.json());
    const price = CLIP_PRICE[d.rarity - 1];
    const res = licenseClip(loan, price);
    setClipRes(`${d.tag}, rarity ${d.rarity}/3, licensed for ${usd(price)}. Operator share ${usd(res.operator)} applied to the loan. (${d.provider})`);
    await log("data.licensed", { robotId: rb.id, tag: d.tag, rarity: d.rarity, price, toLoan: res.operator }, { loans: { ...s.loans, [rb.id]: res.loan } });
    setBusy("");
  }

  const setRobot = (patch: Partial<Robot>) => s.fleet.map((r) => (r.id === rb.id ? { ...r, ...patch } : r));
  const proposal = { id: "C1", text: "No job below $15 per hour", minRate: 15 };
  const value = robotValue(rb), rev = monthlyRevenue(rb);
  const paidPct = loan ? 1 - loan.balance / (loan.advance + loan.fee) : 0;

  return (
    <main className="min-h-screen" style={{ background: "radial-gradient(60% 40% at 50% 0%, rgba(2,151,222,0.18), transparent 70%), #02070A" }}>
      <header className="flex items-center justify-between border-b border-white/10 px-5 py-4 text-[12px]">
        <Link href="/"><Logo /></Link>
        <div className="hidden gap-2 md:flex">
          <span className="glass rounded-full px-3 py-1.5">Model: {provider}</span>
          <span className="glass rounded-full px-3 py-1.5">Payments: Stripe test mode</span>
          <span className="glass rounded-full px-3 py-1.5 text-orange">Fleet data [synthetic]</span>
        </div>
        <button className="btn btn-ghost" onClick={() => { localStorage.removeItem(KEY); location.reload(); }}>Reset demo</button>
      </header>

      <div className="grid gap-5 p-3 sm:p-5 lg:grid-cols-[1.45fr_1fr]">
        <section className="min-w-0 space-y-5">
          <div className="card relative h-[46vh] overflow-hidden sm:h-[58vh]">
            <div className="absolute left-4 top-4 z-10"><p className="kicker">Fleet, glowing by verified revenue. Click a robot.</p></div>
            <div className="absolute inset-0"><Fleet3D fleet={s.fleet} selected={s.sel} onSelect={(id) => { setS((p) => ({ ...p, sel: id })); setJob(null); setClipRes(""); }} /></div>
          </div>
          <div className="card overflow-x-auto p-4">
            <p className="kicker mb-3">Robot value index [modelled]</p>
            <table className="w-full min-w-[600px] text-left text-[11px] [&_td]:pr-3">
              <thead className="text-white/45"><tr><th className="py-1">Robot</th><th>Kind</th><th>Verified / mo</th><th>Value</th><th>US content</th><th>FCC status</th></tr></thead>
              <tbody>
                {s.fleet.map((r) => (
                  <tr key={r.id} onClick={() => setS((p) => ({ ...p, sel: r.id }))} className={`cursor-pointer border-t border-white/5 hover:bg-white/5 ${r.id === s.sel ? "text-orange" : ""}`}>
                    <td className="py-1.5">{r.id}</td><td>{r.kind}</td><td>{usd(monthlyRevenue(r))}</td><td>{usd(robotValue(r))}</td><td>{r.domesticPct}%</td>
                    <td>{!MOBILE.includes(r.kind) ? "out of scope (fixed arm)" : fccCompliant(r) ? "compliant" : "new models blocked, -20%"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="min-w-0 space-y-5">
          <div className="card p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="kicker">Selected robot</p>
                <h2 className="mt-2 font-serif text-4xl">{rb.id} <em>{rb.kind}</em></h2>
                <p className="text-[11px] text-white/55">{rb.site} &middot; {rb.ageMonths} months old &middot; health {rb.health.toFixed(2)}{rb.faulted && <span className="pulse ml-2 text-orange">FAULT</span>}</p>
              </div>
              <div className="text-right"><div className="font-serif text-3xl">{usd(value)}</div><div className="text-[10px] text-white/45">index value</div></div>
            </div>

            {!loan ? (
              <div className="mt-5 grid grid-cols-1 gap-3 text-[11px] sm:grid-cols-2">
                <div className="rounded-xl border border-orange/40 p-3">
                  <div className="text-orange">Selfmade offer</div>
                  <div className="mt-2 font-serif text-3xl">{usd(offerL.advance)}</div>
                  <div className="text-white/60">one flat fee {usd(offerL.fee)}, no interest</div>
                  <div className="text-white/60">repay {(offerL.sweepPct * 100).toFixed(1)}% of each job</div>
                  <div className="text-white/60">this month about {usd(rev * offerL.sweepPct)}</div>
                </div>
                <div className="rounded-xl border border-white/10 p-3">
                  <div className="text-white/70">Typical bank equipment loan</div>
                  <div className="mt-2 font-serif text-3xl">10.55%</div>
                  <div className="text-white/60">fixed {usd(bankPayment(offerL.advance))}/mo for 60 months</div>
                  <div className="text-white/60">same payment if the robot sits idle</div>
                </div>
                <button className="btn btn-orange justify-center sm:col-span-2" onClick={() => log("loan.funded", { ...offerL }, { loans: { ...s.loans, [rb.id]: offerL } })}>Fund this robot</button>
                <button className="btn btn-ghost justify-center sm:col-span-2" onClick={() => setExplain(true)}>How is this priced?</button>
              </div>
            ) : (
              <div className="mt-5 text-[11px]">
                <div className="flex justify-between"><span>Balance {usd(loan.balance)} of {usd(loan.advance + loan.fee)}</span><span>{(loan.sweepPct * 100).toFixed(1)}% of each job</span></div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full bg-gradient-to-r from-blue to-orange transition-all duration-700" style={{ width: `${paidPct * 100}%` }} /></div>
                <div className="mt-2 text-white/55">{loan.balance === 0 ? "Paid off. The operator owns this robot." : `This month about ${usd(rev * loan.sweepPct)} vs a fixed bank ${usd(bankPayment(loan.advance))}.`}</div>
              </div>
            )}

            <div className="mt-4 flex flex-wrap gap-2">
              {!rb.faulted ? (
                <button className="btn btn-ghost" onClick={() => log("robot.fault", { robotId: rb.id, health: 0.55 }, { fleet: setRobot({ faulted: true, health: 0.55 }) })}>Inject fault</button>
              ) : (
                <button className="btn btn-blue" onClick={() => log("robot.serviced", { robotId: rb.id, health: 0.92 }, { fleet: setRobot({ faulted: false, health: 0.92 }) })}>Mark serviced</button>
              )}
              {rb.faulted && <span className="self-center text-[11px] text-orange">Early warning: revenue down 60%, repayment flexes down, C3 blocks new jobs until service.</span>}
            </div>
          </div>

          <div className="card p-5">
            <p className="kicker">Job inbox. The model reads, the ledger decides.</p>
            <div className="mt-3 flex flex-wrap gap-2">{OFFERS.map((o, i) => <button key={i} className={`btn btn-ghost ${o === offer ? "border-orange/60" : ""}`} onClick={() => { setOffer(o); setJob(null); }}>Offer {i + 1}</button>)}</div>
            <textarea value={offer} onChange={(e) => setOffer(e.target.value)} maxLength={1000} className="mt-3 h-16 w-full resize-none rounded-xl border border-white/10 bg-black/30 p-3 text-[12px] outline-none focus:border-blue" />
            <button className="btn btn-blue mt-2" disabled={busy === "read"} onClick={readOffer}>{busy === "read" ? "Reading..." : "Read offer"}</button>
            {job && (
              <div className="mt-4 space-y-2 text-[11px]">
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {[["Task", job.job.task], ["Hours", job.job.hours], ["Pay", `$${job.job.payPerHour}/h`], ["Client", job.job.client]].map(([k, v]) => (
                    <div key={k as string} className="rounded-lg bg-white/5 p-2"><div className="text-white/45">{k}</div><div>{v}</div></div>
                  ))}
                </div>
                <div className="text-white/45">Read by {job.provider} in {job.ms} ms. {job.note}</div>
                {job.check.ok ? (
                  <div className="rounded-xl border border-blue/40 p-3">
                    <label className="flex items-center gap-2 text-white/70"><input type="checkbox" checked={spoof} onChange={(e) => setSpoof(e.target.checked)} /> Include spoofed hours in the claim</label>
                    <div className="mt-2 flex flex-wrap gap-1">{hours?.map((h, i) => <span key={i} title={h.reason} className={`h-5 w-5 rounded ${h.ok ? "bg-blue" : "bg-orange"}`} />)}</div>
                    <div className="mt-2 text-white/60">{hours?.filter((h) => h.ok).length} of {hours?.length} hours verified by telemetry. Billable {usd(billable)}.</div>
                    <button className="btn btn-orange mt-3" disabled={busy === "pay" || billable === 0} onClick={pay}>Collect {usd(billable)} with Stripe</button>
                  </div>
                ) : (
                  <Alert tone="warn">Blocked by {job.check.broken.map((c) => `${c.id} "${c.text}"`).join(", ")}. The agent cannot override this.</Alert>
                )}
              </div>
            )}
          </div>

          <div className="card p-5">
            <p className="kicker">Earn twice: license an edge case</p>
            <textarea value={clip} onChange={(e) => setClip(e.target.value)} maxLength={1000} className="mt-3 h-14 w-full resize-none rounded-xl border border-white/10 bg-black/30 p-3 text-[12px] outline-none focus:border-blue" />
            <button className="btn btn-blue mt-2" disabled={busy === "clip"} onClick={license}>{busy === "clip" ? "Tagging..." : "Tag and license clip"}</button>
            {clipRes && <p className="mt-3 text-[11px] text-white/70">{clipRes}</p>}
          </div>

          <div className="card p-5 text-[11px]">
            <p className="kicker">Covenant ledger</p>
            <ul className="mt-3 space-y-1.5">{s.covs.map((c) => <li key={c.id} className="flex justify-between"><span>{c.id} {c.text}</span><span className="text-blue">binding</span></li>)}</ul>
            <div className="mt-4 rounded-xl border border-white/10 p-3">
              <div>Proposal: {proposal.text}. Needs {2} different approvers.</div>
              <div className="mt-2 flex flex-wrap gap-2">
                {["lender", "operator"].map((who) => (
                  <button key={who} className={`btn ${approvals.includes(who) ? "btn-blue" : "btn-ghost"}`} onClick={() => setApprovals((a) => (a.includes(who) ? a : [...a, who]))}>Approve as {who}</button>
                ))}
                <button className="btn btn-orange" disabled={!canChange(approvals)} onClick={async () => { await log("covenant.changed", { ...proposal, approvers: approvals }, { covs: s.covs.map((c) => (c.id === "C1" ? proposal : c)) }); setApprovals([]); }}>Apply change</button>
              </div>
            </div>
          </div>

          <div className="card p-5 text-[11px]">
            <div className="flex items-center justify-between">
              <p className="kicker">Audit chain (sha256)</p>
              <div className="flex gap-2">
                <button className="btn btn-ghost" onClick={async () => { const r = await verifyChain(s.log); setChain(r.ok ? `Chain intact, ${s.log.length} events.` : `Tampering found at event ${r.at}.`); }}>Verify</button>
                <button className="btn btn-ghost" disabled={!s.log.length} onClick={() => { setS((p) => ({ ...p, log: p.log.map((e, i) => (i === 0 ? { ...e, data: { edited: true } } : e)) })); setChain("Event 0 edited. Press Verify."); }}>Tamper</button>
              </div>
            </div>
            {chain && <p className={`mt-2 ${chain.startsWith("Chain") ? "text-blue" : "text-orange"}`}>{chain}</p>}
            <ul className="mt-3 max-h-48 space-y-1 overflow-auto">
              {[...s.log].reverse().map((e) => (
                <li key={e.i} className="flex justify-between gap-3 border-t border-white/5 pt-1"><span>{e.i} {e.type}</span><span className="text-white/40">{short(e.hash)}</span></li>
              ))}
              {!s.log.length && <li className="text-white/40">No events yet. Fund a robot to start.</li>}
            </ul>
          </div>
        </section>
      </div>

      {toast && <Alert tone="ok" className="fixed bottom-5 left-1/2 z-50 w-[min(92vw,560px)] -translate-x-1/2 backdrop-blur">{toast}</Alert>}
      <Backdrop open={explain} onClose={() => setExplain(false)} label="How the loan is priced">
        <p className="kicker">How this loan is priced [modelled]</p>
        <ul className="mt-4 space-y-2 text-[12px] text-white/75">
          <li>Value = half asset value (list price, 18% a year decline) + half income value (35% margin x 24 months of verified revenue), times health.</li>
          <li>Mobile robots under 65% US content lose 20%: since 28 Jul 2026 the FCC no longer authorizes new foreign-made models. Fixed arms are out of scope.</li>
          <li>Advance = 60% of value. One flat fee of 12%, no compounding, like Stripe Capital.</li>
          <li>Repayment = a share of each verified job, set so the loan clears in about 30 months of normal work.</li>
          <li>Bank comparison: 10.55% fixed over 60 months, an example equipment rate.</li>
        </ul>
      </Backdrop>
    </main>
  );
}

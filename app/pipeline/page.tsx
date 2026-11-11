"use client";
import Link from "next/link";
import { useState } from "react";
import { applyPayment, offerLoan, seedFleet } from "@/lib/engine";
import { Logo } from "@/components/Ui";

// The whole backend, run step by step from the browser against the live API.
type Step = { k: string; route: string; d: string; status: "wait" | "run" | "done" | "fail"; ms?: number; out?: string; json?: unknown };
const robot = { ...seedFleet()[5] };
const loan = offerLoan(robot);
const HOURS = [
  { cycles: 120, kwh: 1.79, units: 118 }, { cycles: 96, kwh: 1.5, units: 95 }, { cycles: 140, kwh: 2.03, units: 141 },
  { cycles: 6, kwh: 0.41, units: 0 }, { cycles: 130, kwh: 1.91, units: 38 }, { cycles: 110, kwh: 1.67, units: 109 },
];
const INITIAL: Step[] = [
  { k: "Ingest", route: "POST /api/receipts", d: "FANUC CRX-10iA sends 6 hours of telemetry, plus the units the client's warehouse system confirmed.", status: "wait" },
  { k: "Verify", route: "server: physics band + client output", d: "Each hour must match its energy draw AND the client's count. Idle and faked hours fail.", status: "wait" },
  { k: "Prove", route: "GET /api/receipts/proof", d: "One receipt is proven inside today's Merkle root, without revealing the other hours.", status: "wait" },
  { k: "Bill", route: "POST /api/checkout", d: "The desk sends hours, not an amount. The server bills verified hours only, at $31/h.", status: "wait" },
  { k: "Settle", route: "engine: applyPayment", d: `A ${Math.round(loan.sweepPct * 100)}% share of the payment goes to the lender, the rest to the operator.`, status: "wait" },
  { k: "Fault", route: "POST /api/actions", d: "The line jams. The agent proposes a service ticket, a payment holiday and a lender notice.", status: "wait" },
  { k: "Approve", route: "PATCH /api/actions", d: "The payment holiday changes loan terms, so it needs the lender AND the operator.", status: "wait" },
];
const j = (r: Response) => r.json();

export default function Pipeline() {
  const [steps, setSteps] = useState<Step[]>(INITIAL);
  const [running, setRunning] = useState(false);
  const upd = (i: number, p: Partial<Step>) => setSteps((s) => s.map((x, k) => (k === i ? { ...x, ...p } : x)));
  const pause = (ms: number) => new Promise((r) => setTimeout(r, ms));
  async function step<T>(i: number, fn: () => Promise<[string, T]>) {
    upd(i, { status: "run" }); await pause(450);
    const t0 = performance.now();
    try { const [out, json] = await fn(); upd(i, { status: "done", ms: Math.round(performance.now() - t0), out, json }); return json; }
    catch (e) { upd(i, { status: "fail", out: String(e) }); throw e; }
  }
  async function run() {
    setRunning(true); setSteps(INITIAL);
    try {
      const rc = await step(0, async () => { const d = await fetch("/api/receipts", { method: "POST", body: JSON.stringify({ robotId: robot.id, hours: HOURS }) }).then(j); return [`${d.receipts.length} receipts issued, day root ${d.dayRoot.slice(0, 12)}...`, d]; }) as { receipts: { ok: boolean; reason: string; hash: string }[] };
      await step(1, async () => { const ok = rc.receipts.filter((r) => r.ok).length; return [`${ok} of ${rc.receipts.length} hours verified. Rejected: ${rc.receipts.filter((r) => !r.ok).map((r) => r.reason).join("; ")}`, rc.receipts.map((r) => ({ ok: r.ok, reason: r.reason, hash: r.hash.slice(0, 16) }))]; });
      await step(2, async () => { const d = await fetch(`/api/receipts/proof?hash=${rc.receipts[0].hash}`).then(j); return [d.included ? `Included: verified with ${d.proof.length} sibling hashes against root ${d.root.slice(0, 12)}...` : "Not included", d]; });
      const bill = await step(3, async () => { const d = await fetch("/api/checkout", { method: "POST", body: JSON.stringify({ robotId: robot.id, hours: HOURS.map(({ cycles, kwh }) => ({ cycles, kwh })), payPerHour: 31, description: "pallet moving" }) }).then(j); return [`Billed $${d.amount} for verdicts ${d.verdicts} (sha256 ${String(d.hash).slice(0, 10)}...)${d.simulated ? ", simulated payment" : ", Stripe session created"}`, d]; }) as { amount: number };
      await step(4, async () => { const p = applyPayment(loan, bill.amount); return [`$${p.toLender} to the lender, $${p.toOperator} to the operator. Balance $${p.loan.balance.toLocaleString()}.`, p]; });
      const acts = await step(5, async () => { const d = await fetch("/api/actions", { method: "POST", body: JSON.stringify({ robot: { ...robot, faulted: true, health: 0.55 }, loan }) }).then(j); return [d.actions.map((a: { type: string }) => a.type.replace("_", " ")).join(", "), d]; }) as { actions: { id: string; type: string }[] };
      await step(6, async () => {
        const hol = acts.actions.find((a) => a.type === "payment_holiday")!;
        const a1 = await fetch("/api/actions", { method: "PATCH", body: JSON.stringify({ id: hol.id, role: "lender" }) }).then(j);
        const a2 = await fetch("/api/actions", { method: "PATCH", body: JSON.stringify({ id: hol.id, role: "operator" }) }).then(j);
        return [`After lender: ${a1.action.status}. After operator: ${a2.action.status}. Chain head ${String(a2.chainHead).slice(0, 12)}...`, { first: a1.action, second: a2.action }];
      });
    } catch {}
    setRunning(false);
  }
  const done = steps.filter((s) => s.status === "done").length;
  return (
    <main className="min-h-screen bg-ink font-light">
      <header className="border-b border-dashed border-white/15">
        <nav className="mx-auto flex max-w-7xl items-center justify-between border-x border-dashed border-white/15 px-6 py-4">
          <Link href="/"><Logo /></Link>
          <div className="flex gap-8 font-mono text-[10px] uppercase tracking-[0.2em] text-white/60">
            <Link href="/" className="hover:text-white">Home</Link><span className="text-white">Pipeline</span><Link href="/desk" className="hover:text-white">Desk</Link><Link href="/invest" className="hover:text-white">Back a fleet</Link>
          </div>
        </nav>
      </header>
      <section className="mx-auto max-w-7xl border-x border-dashed border-white/15 px-6 pb-24 pt-14">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/50">( See it run )</p>
        <h1 className="mt-4 max-w-4xl text-[clamp(34px,4.6vw,62px)] font-light leading-[1.05] tracking-[-0.02em]">One robot, six hours of work, <em className="text-orange">through the real backend</em>.</h1>
        <p className="mt-4 max-w-2xl text-[15px] text-white/70">Every step below is a live call to the Hebl API. Nothing is pre-recorded.</p>
        <div className="mt-8 flex items-center gap-4">
          <button onClick={run} disabled={running} className="group inline-flex items-center gap-4 rounded-full bg-white py-2 pl-6 pr-2 text-[14px] font-semibold text-ink transition hover:bg-orange disabled:opacity-60">
            {running ? "Running..." : done ? "Run again" : "Run the pipeline"}<span className="grid h-10 w-10 place-items-center rounded-full bg-ink text-white">&#9654;</span>
          </button>
          <div className="h-1 w-48 overflow-hidden rounded-full bg-white/10"><div className="h-full bg-gradient-to-r from-blue to-orange transition-all duration-500" style={{ width: `${(done / steps.length) * 100}%` }} /></div>
          <span className="font-mono text-[11px] text-white/50">{done}/{steps.length}</span>
        </div>
        <ol className="mt-10 space-y-3">
          {steps.map((s, i) => (
            <li key={s.k} className={`rounded-md border border-dashed p-5 transition-all duration-500 ${s.status === "run" ? "border-orange/70 bg-orange/[0.06]" : s.status === "done" ? "border-blue/40 bg-blue/[0.04]" : s.status === "fail" ? "border-orange" : "border-white/15 opacity-60"}`}>
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <div className="flex items-baseline gap-4"><span className="font-mono text-[11px] text-orange">0{i + 1}</span><span className="text-xl font-bold">{s.k}</span><span className="font-mono text-[11px] text-white/45">{s.route}</span></div>
                <span className="font-mono text-[11px] text-white/45">{s.status === "run" ? <span className="pulse text-orange">running</span> : s.status === "done" ? `${s.ms} ms` : s.status}</span>
              </div>
              <p className="mt-2 text-[13px] text-white/65">{s.d}</p>
              {s.out && <p className="mt-3 text-[15px] text-white">{s.out}</p>}
              {s.json !== undefined && <details className="mt-2"><summary className="cursor-pointer font-mono text-[10px] uppercase tracking-[0.15em] text-white/40">response</summary><pre className="mt-2 max-h-56 overflow-auto rounded bg-black/40 p-3 font-mono text-[11px] text-white/60">{JSON.stringify(s.json, null, 2)}</pre></details>}
            </li>
          ))}
        </ol>
      </section>
    </main>
  );
}

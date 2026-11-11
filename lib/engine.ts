// Hebl engine. Every money decision is plain code here; the model never decides.
// Shared by the browser UI, the API routes and the tests (node --test).

export type Kind = "AMR" | "Arm" | "Humanoid" | "Quadruped";

export type Robot = {
  id: string;
  name: string;
  kind: Kind;
  site: string;
  ageMonths: number;
  listPrice: number; // USD [synthetic]
  domesticPct: number; // share of component cost made in the US [synthetic]
  ratePerHour: number; // USD the robot bills per verified hour [synthetic]
  hoursPerMonth: number;
  uptime: number; // 0..1
  health: number; // 0..1, from the fault model
  x: number;
  z: number;
  faulted?: boolean;
  model?: string;
  maker?: string;
  madeIn?: string;
  priceNote?: string;
  source?: string;
};

// Deterministic PRNG so seeded data and measured numbers are reproducible.
export function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const KINDS: Kind[] = ["AMR", "Arm", "Humanoid", "Quadruped"];
const SITES = ["Columbus, OH", "Austin, TX", "Fremont, CA", "Reno, NV"];
const PRICE: Record<Kind, number> = { AMR: 45000, Arm: 70000, Humanoid: 160000, Quadruped: 90000 };
const RATE: Record<Kind, number> = { AMR: 22, Arm: 30, Humanoid: 48, Quadruped: 38 };

import { MODELS } from "./models.ts";

export function seedFleet(seed = 18): Robot[] {
  const r = rng(seed);
  const out: Robot[] = [];
  for (let i = 0; i < 12; i++) {
    const kind = KINDS[i % 4];
    out.push({
      id: `R-${String(i + 1).padStart(2, "0")}`,
      name: `${kind}-${100 + i}`,
      kind,
      site: SITES[Math.floor(r() * SITES.length)],
      ageMonths: Math.floor(4 + r() * 30),
      listPrice: PRICE[kind],
      domesticPct: Math.round(40 + r() * 45),
      ratePerHour: Math.round(RATE[kind] * (0.85 + r() * 0.3)),
      hoursPerMonth: Math.round(380 + r() * 220),
      uptime: Math.round((0.86 + r() * 0.12) * 100) / 100,
      health: Math.round((0.8 + r() * 0.2) * 100) / 100,
      x: (i % 4) * 3 - 4.5,
      z: Math.floor(i / 4) * 3 - 3,
    });
    const m = MODELS[i];
    if (m) Object.assign(out[i], { model: m.model, maker: m.maker, madeIn: m.madeIn, priceNote: m.note, source: m.source, listPrice: m.price, domesticPct: m.usPct, ratePerHour: m.rate, name: `${m.maker} ${m.model}` });
  }
  return out;
}

// ---------- 1. Verify: work oracle with a split-conformal band ----------
// Honest work: energy per hour tracks cycles per hour. A claimed hour is accepted only if
// the telemetry residual sits inside a band calibrated on honest hours (split conformal).
export type Hour = { cycles: number; kwh: number };
const A = 0.012, B = 0.35; // kWh per cycle, idle kWh [synthetic physics]

export function honestHour(r: () => number): Hour {
  const cycles = 60 + r() * 140;
  return { cycles, kwh: A * cycles + B + (r() - 0.5) * 0.3 };
}
export function fakeHour(r: () => number): Hour {
  // Two fraud shapes: idle robot billed as busy, or spoofed cycles with no energy behind them.
  if (r() < 0.5) return { cycles: 3 + r() * 10, kwh: B + r() * 0.1 };
  const cycles = 90 + r() * 110;
  return { cycles, kwh: B + r() * 0.4 };
}
export function calibrate(hours: Hour[], alpha = 0.02) {
  const res = hours.map((h) => Math.abs(h.kwh - (A * h.cycles + B))).sort((a, b) => a - b);
  const k = Math.min(res.length - 1, Math.ceil((res.length + 1) * (1 - alpha)) - 1);
  return { q: res[k], minCycles: 40 };
}
export function verifyHour(h: Hour, band: { q: number; minCycles: number }) {
  const residual = Math.abs(h.kwh - (A * h.cycles + B));
  if (h.cycles < band.minCycles) return { ok: false, reason: "robot idle during billed hour" };
  if (residual > band.q) return { ok: false, reason: "cycles not backed by energy draw" };
  return { ok: true, reason: "telemetry matches work" };
}
// Harder cases, reported honestly: a spoofer who fakes energy consistent with cycles, and honest robots
// whose physics drifted (worn motor draws 15% more). The band catches the first two fraud shapes, not the third.
export function consistentSpoof(r: () => number): Hour {
  const cycles = 60 + r() * 140;
  return { cycles, kwh: A * cycles + B + (r() - 0.5) * 0.3 };
}
export function driftedHonest(r: () => number): Hour {
  const cycles = 60 + r() * 140;
  return { cycles, kwh: A * 1.15 * cycles + B + (r() - 0.5) * 0.3 };
}
export function evalOracle(seed = 7, n = 500) {
  const r = rng(seed);
  const band = calibrate(Array.from({ length: n }, () => honestHour(r)));
  const flagged = (hs: Hour[]) => hs.filter((h) => !verifyHour(h, band).ok).length;
  const idle = Array.from({ length: n }, () => ({ cycles: 3 + r() * 10, kwh: B + r() * 0.1 }));
  const noEnergy = Array.from({ length: n }, () => { const c = 90 + r() * 110; return { cycles: c, kwh: B + r() * 0.4 }; });
  const rows = [
    { name: "fraud: idle robot billed as busy", n, flagged: flagged(idle) },
    { name: "fraud: cycles with no energy behind them", n, flagged: flagged(noEnergy) },
    { name: "fraud: energy faked to match cycles", n, flagged: flagged(Array.from({ length: n }, () => consistentSpoof(r))) },
    { name: "honest: normal physics", n, flagged: flagged(Array.from({ length: n }, () => honestHour(r))) },
    { name: "honest: worn motor, +15% energy", n, flagged: flagged(Array.from({ length: n }, () => driftedHonest(r))) },
  ].map((x) => ({ ...x, rate: x.flagged / x.n }));
  return { rows, band };
}
// Fix 1 for careful spoofers: a second, independent source. The client's own warehouse system
// confirms units handled; an hour counts only if telemetry AND confirmed output agree (units ~ cycles x 0.9..1.1).
export function verifyWithOutput(h: Hour, units: number, band: { q: number; minCycles: number }) {
  const t = verifyHour(h, band);
  if (!t.ok) return t;
  const ratio = units / Math.max(1, h.cycles);
  if (ratio < 0.85 || ratio > 1.15) return { ok: false, reason: "client-confirmed output does not match cycles" };
  return { ok: true, reason: "telemetry and client output agree" };
}
// Fix 2 for drift: fit each robot's own energy line from its recent honest hours, then band around that.
export function calibrateFor(hours: Hour[], alpha = 0.02) {
  const n = hours.length, mx = hours.reduce((a, h) => a + h.cycles, 0) / n, my = hours.reduce((a, h) => a + h.kwh, 0) / n;
  const a = hours.reduce((s, h) => s + (h.cycles - mx) * (h.kwh - my), 0) / Math.max(1e-9, hours.reduce((s, h) => s + (h.cycles - mx) ** 2, 0));
  const b = my - a * mx;
  const res = hours.map((h) => Math.abs(h.kwh - (a * h.cycles + b))).sort((x, y) => x - y);
  return { a, b, q: res[Math.min(n - 1, Math.ceil((n + 1) * (1 - alpha)) - 1)], minCycles: 40 };
}
export function verifyHourFor(h: Hour, m: { a: number; b: number; q: number; minCycles: number }) {
  if (h.cycles < m.minCycles) return { ok: false, reason: "robot idle during billed hour" };
  return Math.abs(h.kwh - (m.a * h.cycles + m.b)) > m.q ? { ok: false, reason: "cycles not backed by energy draw" } : { ok: true, reason: "telemetry matches work" };
}
export function evalFixes(seed = 9, n = 500) {
  const r = rng(seed);
  const band = calibrate(Array.from({ length: n }, () => honestHour(r)));
  // careful spoofer: physics-consistent energy, but the client only confirms what was really done (30% of claimed)
  const spoof = Array.from({ length: n }, () => ({ h: consistentSpoof(r), share: 0.3 }));
  const caught = spoof.filter((x) => !verifyWithOutput(x.h, x.h.cycles * x.share, band).ok).length;
  const honest = Array.from({ length: n }, () => honestHour(r));
  const honestFlags = honest.filter((h) => !verifyWithOutput(h, h.cycles * (0.95 + r() * 0.1), band).ok).length;
  // worn motor: per-robot band from its own last 200 hours
  const own = calibrateFor(Array.from({ length: 200 }, () => driftedHonest(r)));
  const worn = Array.from({ length: n }, () => driftedHonest(r)).filter((h) => !verifyHourFor(h, own).ok).length;
  return [
    { name: "fraud: energy faked, checked vs client output", n, flagged: caught },
    { name: "honest: normal, checked vs client output", n, flagged: honestFlags },
    { name: "honest: worn motor, per-robot band", n, flagged: worn },
  ].map((x) => ({ ...x, rate: x.flagged / x.n }));
}

// Shared band and server-side settlement: the server, not the browser, decides what is billable.
export const BAND = calibrate(Array.from({ length: 400 }, ((r) => () => honestHour(r))(rng(3))));
export function settleHours(hours: Hour[], payPerHour: number) {
  const verdicts = hours.map((h) => verifyHour(h, BAND));
  return { verdicts, billable: verdicts.filter((v) => v.ok).length * payPerHour };
}
export async function hashHours(hours: Hour[]) {
  const buf = await globalThis.crypto.subtle.digest("SHA-256", new TextEncoder().encode(JSON.stringify(hours)));
  return Array.from(new Uint8Array(buf), (b) => b.toString(16).padStart(2, "0")).join("");
}

// ---------- 2. Price: robot value index ----------
export const MOBILE: Kind[] = ["AMR", "Humanoid", "Quadruped"]; // FCC DA 26-786 scope; fixed arms excluded
export function fccCompliant(rb: Robot) {
  return !MOBILE.includes(rb.kind) || rb.domesticPct > 65;
}
export function monthlyRevenue(rb: Robot) {
  return rb.ratePerHour * rb.hoursPerMonth * rb.uptime * (rb.faulted ? 0.4 : 1);
}
export function robotValue(rb: Robot) {
  const asset = rb.listPrice * Math.pow(0.82, rb.ageMonths / 12); // [modelled] 18%/yr decline
  const income = monthlyRevenue(rb) * 0.35 * 24; // 35% margin x 24 months [modelled]
  const fcc = MOBILE.includes(rb.kind) && !fccCompliant(rb) ? 0.8 : 1; // [modelled] no new FCC auth
  // ponytail: cap at 1.2x depreciated list so cheap robots with high synthetic rates stay sane
  return Math.round(Math.min(0.5 * asset + 0.5 * income, asset * 1.2) * rb.health * fcc);
}

// ---------- 3. Lend: revenue-share loan vs a bank's fixed loan ----------
export const BANK_APR = 0.1055; // example bank equipment rate (sourced in README)
export type Loan = { robotId: string; advance: number; fee: number; balance: number; sweepPct: number };

export function offerLoan(rb: Robot): Loan {
  const advance = Math.round(robotValue(rb) * 0.6);
  const fee = Math.round(advance * 0.12); // one flat fee, no compounding
  const sweepPct = Math.min(0.3, Math.max(0.08, (advance + fee) / (monthlyRevenue(rb) * 30)));
  return { robotId: rb.id, advance, fee, balance: advance + fee, sweepPct: Math.round(sweepPct * 1000) / 1000 };
}
export function bankPayment(principal: number, months = 60, apr = BANK_APR) {
  const m = apr / 12;
  return Math.round((principal * m) / (1 - Math.pow(1 + m, -months)));
}
// Stress test: months where revenue cannot cover a fixed payment are missed payments.
export function stress(rb: Robot, uptimeDrop: number) {
  const loan = offerLoan(rb);
  const rev = monthlyRevenue({ ...rb, uptime: rb.uptime * (1 - uptimeDrop) });
  const fixed = bankPayment(loan.advance);
  return { revenue: Math.round(rev), ours: Math.round(rev * loan.sweepPct), bank: fixed, bankMissed: rev * 0.35 < fixed };
}

export function applyPayment(loan: Loan, amount: number) {
  const toLender = Math.min(loan.balance, Math.round(amount * loan.sweepPct));
  return { toLender, toOperator: amount - toLender, loan: { ...loan, balance: loan.balance - toLender } };
}
// Data income: operator keeps 80% of each licence; we apply it to the loan by default.
export function licenseClip(loan: Loan, price: number) {
  const operator = Math.round(price * 0.8);
  const applied = Math.min(loan.balance, operator);
  return { operator, platform: price - operator, loan: { ...loan, balance: loan.balance - applied } };
}

// ---------- 4. Govern: covenant ledger the agent can read but never overrule ----------
export type Covenant = { id: string; text: string; minRate?: number; maxHours?: number; minHealth?: number };
export const COVENANTS: Covenant[] = [
  { id: "C1", text: "No job below $20 per hour", minRate: 20 },
  { id: "C2", text: "No more than 20 hours in a day", maxHours: 20 },
  { id: "C3", text: "Service before work when health is under 0.6", minHealth: 0.6 },
];
export type Job = { task: string; hours: number; payPerHour: number; client: string };

export function checkJob(job: Job, rb: Robot, covs: Covenant[]) {
  const broken = covs.filter(
    (c) =>
      (c.minRate !== undefined && job.payPerHour < c.minRate) ||
      (c.maxHours !== undefined && job.hours > c.maxHours) ||
      (c.minHealth !== undefined && rb.health < c.minHealth),
  );
  return { ok: broken.length === 0, broken };
}
export const QUORUM = 2;
export function canChange(approvers: string[]) {
  return new Set(approvers).size >= QUORUM;
}

// Hash-chained audit log (sha256 over prev hash + event), verifiable by anyone.
export type Event = { i: number; type: string; data: unknown; prev: string; hash: string };
async function sha256(s: string) {
  const buf = await globalThis.crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return Array.from(new Uint8Array(buf), (b) => b.toString(16).padStart(2, "0")).join("");
}
export async function append(log: Event[], type: string, data: unknown): Promise<Event[]> {
  const prev = log.length ? log[log.length - 1].hash : "genesis";
  const hash = await sha256(prev + type + JSON.stringify(data));
  return [...log, { i: log.length, type, data, prev, hash }];
}
export async function verifyChain(log: Event[]) {
  let prev = "genesis";
  for (const e of log) {
    if (e.prev !== prev || e.hash !== (await sha256(prev + e.type + JSON.stringify(e.data)))) return { ok: false, at: e.i };
    prev = e.hash;
  }
  return { ok: true, at: -1 };
}

// Offline job parser, used when no model key is set. ponytail: regex, the model handles messy text.
export function parseJobOffline(text: string): Job {
  const num = (re: RegExp, d: number) => Number(text.match(re)?.[1] ?? d);
  return {
    task: text.match(/(pallet|pick|inspect|weld|sort|deliver|patrol)\w*/i)?.[0]?.toLowerCase() ?? "general work",
    hours: num(/(\d+(?:\.\d+)?)\s*(?:h|hours?)/i, 8),
    payPerHour: num(/\$\s*(\d+(?:\.\d+)?)\s*(?:\/|per)\s*h/i, 25),
    client: text.match(/(?:from|for)\s+([A-Z][\w&]+(?:\s[A-Z][\w&]+)?)/)?.[1] ?? "Unknown client",
  };
}

// ---------- 5. Work receipts: every verified hour becomes a hashed receipt; each day rolls up into a Merkle root ----------
export type Receipt = { robotId: string; at: string; cycles: number; kwh: number; units: number | null; ok: boolean; reason: string; hash: string };
export async function sha(s: string) {
  const buf = await globalThis.crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return Array.from(new Uint8Array(buf), (b) => b.toString(16).padStart(2, "0")).join("");
}
export async function makeReceipt(robotId: string, at: string, h: Hour, units: number | null): Promise<Receipt> {
  const v = units === null ? verifyHour(h, BAND) : verifyWithOutput(h, units, BAND);
  const body = { robotId, at, cycles: +h.cycles.toFixed(3), kwh: +h.kwh.toFixed(4), units, ok: v.ok, reason: v.reason };
  return { ...body, hash: await sha(JSON.stringify(body)) };
}
export async function merkleRoot(leaves: string[]): Promise<string> {
  if (!leaves.length) return "";
  let level = leaves;
  while (level.length > 1) {
    const next: string[] = [];
    for (let i = 0; i < level.length; i += 2) next.push(await sha(level[i] + (level[i + 1] ?? level[i])));
    level = next;
  }
  return level[0];
}
export async function merkleProof(leaves: string[], index: number) {
  const proof: { sibling: string; left: boolean }[] = [];
  let level = leaves, i = index;
  while (level.length > 1) {
    const sib = i % 2 ? level[i - 1] : level[i + 1] ?? level[i];
    proof.push({ sibling: sib, left: i % 2 === 1 });
    const next: string[] = [];
    for (let k = 0; k < level.length; k += 2) next.push(await sha(level[k] + (level[k + 1] ?? level[k])));
    level = next; i = Math.floor(i / 2);
  }
  return proof;
}
export async function verifyProof(leaf: string, proof: { sibling: string; left: boolean }[], root: string) {
  let h = leaf;
  for (const p of proof) h = await sha(p.left ? p.sibling + h : h + p.sibling);
  return h === root;
}

// ---------- 6. Agent actions: the agent proposes, code bounds it, two people approve ----------
export type Action = { id: string; robotId: string; type: "maintenance" | "payment_holiday" | "lender_notice" | "find_work"; text: string; approvals: string[]; status: "proposed" | "executed"; needs: number };
export function proposeActions(rb: Robot, loan: Loan | null, nowIso: string): Action[] {
  const id = (t: string) => `${rb.id}-${t}-${nowIso.slice(0, 16)}`;
  const out: Action[] = [];
  if (rb.faulted || rb.health < 0.6) out.push({ id: id("mnt"), robotId: rb.id, type: "maintenance", text: `Open a service ticket with ${rb.maker ?? "the maker"} for ${rb.model ?? rb.kind}: health ${rb.health.toFixed(2)}.`, approvals: [], status: "proposed", needs: 1 });
  if (loan && (rb.faulted || rb.uptime < 0.7)) {
    out.push({ id: id("hol"), robotId: rb.id, type: "payment_holiday", text: `Pause the ${Math.round(loan.sweepPct * 100)}% sweep for 7 days, extend the term by 7 days. Balance stays $${loan.balance.toLocaleString()}.`, approvals: [], status: "proposed", needs: 2 });
    out.push({ id: id("not"), robotId: rb.id, type: "lender_notice", text: `Tell the lender: ${rb.id} down, expected back in 48 h, no missed payment because repayment flexes with work.`, approvals: [], status: "proposed", needs: 1 });
  }
  if (!rb.faulted && rb.uptime < 0.9) out.push({ id: id("job"), robotId: rb.id, type: "find_work", text: `Idle capacity: offer ${rb.id} on the shared job board at $${rb.ratePerHour}/h for 40 h this week.`, approvals: [], status: "proposed", needs: 1 });
  return out;
}
export function approve(a: Action, role: string): Action {
  const approvals = a.approvals.includes(role) ? a.approvals : [...a.approvals, role];
  return { ...a, approvals, status: new Set(approvals).size >= a.needs ? "executed" : "proposed" };
}

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
export function evalOracle(seed = 7, n = 500) {
  const r = rng(seed);
  const band = calibrate(Array.from({ length: n }, () => honestHour(r)));
  const honest = Array.from({ length: n }, () => honestHour(r));
  const fake = Array.from({ length: n }, () => fakeHour(r));
  const caught = fake.filter((h) => !verifyHour(h, band).ok).length;
  const falseFlags = honest.filter((h) => !verifyHour(h, band).ok).length;
  return { n, caught, falseFlags, catchRate: caught / n, falseFlagRate: falseFlags / n, band };
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

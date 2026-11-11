import { test } from "node:test";
import assert from "node:assert/strict";
import {
  evalOracle, evalFixes, seedFleet, settleHours, offerLoan, applyPayment, licenseClip, checkJob, COVENANTS,
  canChange, append, verifyChain, fccCompliant, robotValue, stress, parseJobOffline,
} from "./engine.ts";

test("oracle: rates quoted in README, including what slips through", () => {
  const [idle, noEnergy, consistent, honest] = evalOracle().rows;
  assert.ok(idle.rate >= 0.95 && noEnergy.rate >= 0.95);
  assert.ok(consistent.rate < 0.2, "a physics-consistent spoof is NOT caught by this band; README says so");
  assert.ok(honest.rate <= 0.05);
});

test("server settlement: idle hours are not billed, amount comes from verdicts", () => {
  const hours = [{ cycles: 100, kwh: 1.55 }, { cycles: 5, kwh: 0.4 }, { cycles: 150, kwh: 2.15 }]; // exact physics, idle, exact physics
  const s = settleHours(hours, 30);
  assert.deepEqual(s.verdicts.map((v) => v.ok), [true, false, true]);
  assert.equal(s.billable, 60);
});

test("loan: sweep repays from revenue and never goes below zero", () => {
  const rb = seedFleet()[0];
  let loan = offerLoan(rb);
  assert.ok(loan.sweepPct >= 0.08 && loan.sweepPct <= 0.3);
  const p = applyPayment(loan, 1000);
  assert.equal(p.toLender + p.toOperator, 1000);
  loan = { ...loan, balance: 5 };
  assert.equal(applyPayment(loan, 1000).loan.balance, 0);
  assert.equal(licenseClip(loan, 100).loan.balance, 0);
});

test("covenants: agent cannot take a job under the floor; changes need two people", () => {
  const rb = seedFleet()[0];
  const bad = checkJob({ task: "sort", hours: 6, payPerHour: 12, client: "X" }, rb, COVENANTS);
  assert.equal(bad.ok, false);
  assert.equal(bad.broken[0].id, "C1");
  assert.equal(canChange(["lender"]), false);
  assert.equal(canChange(["lender", "lender"]), false);
  assert.equal(canChange(["lender", "operator"]), true);
});

test("audit chain: tampering is detected", async () => {
  let log = await append([], "loan", { a: 1 });
  log = await append(log, "repay", { b: 2 });
  assert.equal((await verifyChain(log)).ok, true);
  log[0] = { ...log[0], data: { a: 999 } };
  assert.deepEqual(await verifyChain(log), { ok: false, at: 0 });
});

test("FCC: fixed arms are out of scope, non-compliant mobile robots are discounted", () => {
  const [amr, arm] = seedFleet();
  assert.equal(fccCompliant({ ...arm, domesticPct: 10 }), true);
  assert.ok(robotValue({ ...amr, domesticPct: 50 }) < robotValue({ ...amr, domesticPct: 70 }));
});

test("stress: a 40% uptime drop shrinks our payment instead of missing one", () => {
  const s = stress(seedFleet()[2], 0.4);
  assert.ok(s.ours < s.revenue);
});

test("offline parser reads a plain job offer", () => {
  const j = parseJobOffline("Pallet moving for Acme Foods, 6 hours at $31/h");
  assert.deepEqual(j, { task: "pallet", hours: 6, payPerHour: 31, client: "Acme Foods" });
});

test("fixes: client output catches the careful spoofer; per-robot band stops blocking worn motors", () => {
  const [spoof, honest, worn] = evalFixes();
  assert.ok(spoof.rate >= 0.95, `spoof ${spoof.rate}`);
  assert.ok(honest.rate <= 0.05, `honest ${honest.rate}`);
  assert.ok(worn.rate <= 0.06, `worn ${worn.rate}`);
});

test("receipts: Merkle proof verifies an hour, and a tampered receipt fails", async () => {
  const { makeReceipt, merkleRoot, merkleProof, verifyProof } = await import("./engine.ts");
  const rs = await Promise.all([0, 1, 2, 3, 4].map((i) => makeReceipt("R-06", `2026-11-11T0${i}:00Z`, { cycles: 100 + i, kwh: 0.012 * (100 + i) + 0.35 }, null)));
  const leaves = rs.map((r) => r.hash), root = await merkleRoot(leaves);
  assert.equal(await verifyProof(leaves[3], await merkleProof(leaves, 3), root), true);
  assert.equal(await verifyProof(leaves[3].replace(/^./, "0"), await merkleProof(leaves, 3), root), false);
});

test("agent: proposes a payment holiday on a fault, and it needs two different approvers", async () => {
  const { proposeActions, approve } = await import("./engine.ts");
  const rb = { ...seedFleet()[5], faulted: true, health: 0.55 };
  const acts = proposeActions(rb, offerLoan(rb), "2026-11-11T22:00:00Z");
  const hol = acts.find((a) => a.type === "payment_holiday")!;
  assert.equal(approve(hol, "lender").status, "proposed");
  assert.equal(approve(approve(hol, "lender"), "operator").status, "executed");
});

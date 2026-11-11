// Prints every oracle rate quoted in the README, including what slips through. Deterministic.
import { evalFixes, evalOracle } from "../lib/engine.ts";
const { rows, band } = evalOracle();
for (const r of rows) console.log(`${r.name.padEnd(42)} flagged ${String(r.flagged).padStart(3)}/${r.n} (${(r.rate * 100).toFixed(1)}%)`);
console.log(`band q=${band.q.toFixed(3)} kWh, min cycles ${band.minCycles}`);
console.log("-- with the two fixes --");
for (const r of evalFixes()) console.log(`${r.name.padEnd(46)} flagged ${String(r.flagged).padStart(3)}/${r.n} (${(r.rate * 100).toFixed(1)}%)`);

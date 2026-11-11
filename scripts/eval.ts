// Prints the measured oracle numbers quoted in the README. Deterministic: same output every run.
import { evalOracle } from "../lib/engine.ts";
const r = evalOracle();
console.log(`oracle: caught ${r.caught}/${r.n} spoofed hours (${(r.catchRate * 100).toFixed(1)}%), flagged ${r.falseFlags}/${r.n} honest hours (${(r.falseFlagRate * 100).toFixed(1)}%), band q=${r.band.q.toFixed(3)} kWh`);

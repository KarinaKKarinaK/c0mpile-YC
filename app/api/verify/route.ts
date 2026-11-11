import { calibrateFor, offerLoan, settleHours, verifyHourFor, type Hour, type Robot } from "@/lib/engine";
import { MODELS } from "@/lib/models";

// Upload your own robot's telemetry (CSV rows: cycles,kwh[,units]) and get verified hours plus a loan offer.
// With 30+ rows we fit that robot's own energy line, so a worn motor is judged against itself.
export async function POST(req: Request) {
  const { csv, model } = await req.json().catch(() => ({}));
  if (typeof csv !== "string" || csv.length > 200_000) return Response.json({ error: "csv text up to 200 kB required" }, { status: 400 });
  const rows: Hour[] = csv.split(/\r?\n/).map((l) => l.split(/[,;\t]/).map(Number)).filter((c) => Number.isFinite(c[0]) && Number.isFinite(c[1])).slice(0, 5000).map(([cycles, kwh]) => ({ cycles, kwh }));
  if (rows.length < 5) return Response.json({ error: "need at least 5 numeric rows: cycles,kwh" }, { status: 400 });
  const own = rows.length >= 30 ? calibrateFor(rows) : null;
  const verdicts = own ? rows.map((h) => verifyHourFor(h, own)) : settleHours(rows, 1).verdicts;
  const verified = verdicts.filter((v) => v.ok).length;
  const m = MODELS.find((x) => x.model === model) ?? MODELS[7];
  const days = Math.max(1, rows.length / 16);
  const rb: Robot = { id: "R-99", name: m.model, kind: m.kind, site: "", ageMonths: 6, listPrice: m.price, domesticPct: m.usPct, ratePerHour: m.rate, hoursPerMonth: Math.round((verified / days) * 30), uptime: 1, health: 0.95, x: 0, z: 0 };
  return Response.json({ rows: rows.length, verified, rejected: rows.length - verified, band: own ? "per-robot" : "fleet default", offer: offerLoan(rb), model: `${m.maker} ${m.model}` });
}

import { makeReceipt, merkleRoot, type Receipt } from "@/lib/engine";
import { durable, get, set } from "@/lib/store";

// POST: robot telemetry hours (+ optional client-confirmed units) become hashed work receipts.
// GET ?day=YYYY-MM-DD: the day's Merkle root, which can be published so anyone can check an hour later.
export async function POST(req: Request) {
  const { robotId, hours } = await req.json().catch(() => ({}));
  const ok = /^R-\d{2}$/.test(robotId ?? "") && Array.isArray(hours) && hours.length > 0 && hours.length <= 48 &&
    hours.every((h: { cycles: number; kwh: number; units?: number }) => Number.isFinite(h?.cycles) && Number.isFinite(h?.kwh) && h.cycles >= 0 && h.cycles < 1000 && h.kwh >= 0 && h.kwh < 100 && (h.units === undefined || (Number.isFinite(h.units) && h.units >= 0)));
  if (!ok) return Response.json({ error: "robotId R-NN and 1 to 48 hours of {cycles, kwh, units?} required" }, { status: 400 });
  const day = new Date().toISOString().slice(0, 10);
  const base = Date.now();
  const made = await Promise.all(hours.map((h: { cycles: number; kwh: number; units?: number }, i: number) =>
    makeReceipt(robotId, new Date(base - (hours.length - i) * 3600e3).toISOString(), h, h.units ?? null)));
  const all = [...(await get<Receipt[]>(`receipts:${day}`, [])), ...made];
  await set(`receipts:${day}`, all);
  const root = await merkleRoot(all.map((r) => r.hash));
  return Response.json({ receipts: made, day, dayCount: all.length, dayRoot: root, durable });
}

export async function GET(req: Request) {
  const day = new URL(req.url).searchParams.get("day") ?? new Date().toISOString().slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(day)) return Response.json({ error: "day YYYY-MM-DD" }, { status: 400 });
  const all = await get<Receipt[]>(`receipts:${day}`, []);
  return Response.json({ day, count: all.length, verified: all.filter((r) => r.ok).length, root: await merkleRoot(all.map((r) => r.hash)), durable });
}

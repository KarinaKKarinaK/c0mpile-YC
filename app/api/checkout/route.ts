import Stripe from "stripe";
import { hashHours, settleHours, type Hour } from "@/lib/engine";

// The desk posts the robot's telemetry hours, not an amount. The server verifies every hour,
// computes the billable amount and records the verdicts and a sha256 of the hours on the session.
const key = process.env.STRIPE_SECRET_KEY;
const stripe = key ? new Stripe(key) : null;

export async function POST(req: Request) {
  const { robotId, hours, payPerHour, description } = await req.json().catch(() => ({}));
  const okHours = Array.isArray(hours) && hours.length > 0 && hours.length <= 24 &&
    hours.every((h: Hour) => Number.isFinite(h?.cycles) && Number.isFinite(h?.kwh) && h.cycles >= 0 && h.cycles < 1000 && h.kwh >= 0 && h.kwh < 100);
  if (!/^R-\d{2}$/.test(robotId ?? "") || !okHours || !Number.isFinite(payPerHour) || payPerHour <= 0 || payPerHour > 500) {
    return Response.json({ error: "robotId R-NN, 1 to 24 telemetry hours and payPerHour up to 500 required" }, { status: 400 });
  }
  const { verdicts, billable } = settleHours(hours, payPerHour);
  const hash = await hashHours(hours);
  const verdictStr = verdicts.map((v) => (v.ok ? "1" : "0")).join("");
  if (billable < 1) return Response.json({ error: "no verified hours to bill", verdicts: verdictStr }, { status: 422 });
  if (!stripe) return Response.json({ simulated: true, amount: billable, verdicts: verdictStr, hash });
  const origin = new URL(req.url).origin;
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [{ quantity: 1, price_data: { currency: "usd", unit_amount: Math.round(billable * 100), product_data: { name: `Robot ${robotId}: ${String(description ?? "verified work").slice(0, 60)}` } } }],
    metadata: { robotId, verdicts: verdictStr, hoursSha256: hash },
    success_url: `${origin}/desk?paid={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/desk`,
  });
  return Response.json({ url: session.url, amount: billable, verdicts: verdictStr, hash });
}

// Called on return from Checkout: only a session Stripe marks as paid moves the loan, and the amount comes from Stripe.
export async function GET(req: Request) {
  const id = new URL(req.url).searchParams.get("id") ?? "";
  if (!stripe || !/^cs_(test|live)_\w+$/.test(id)) return Response.json({ paid: false }, { status: 400 });
  const s = await stripe.checkout.sessions.retrieve(id);
  return Response.json({ paid: s.payment_status === "paid", amount: (s.amount_total ?? 0) / 100, robotId: s.metadata?.robotId, verdicts: s.metadata?.verdicts, id: s.id });
}

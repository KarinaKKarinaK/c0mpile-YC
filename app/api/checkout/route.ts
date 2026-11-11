import Stripe from "stripe";

// A business pays the robot's job invoice through Stripe Checkout (test mode).
// Bluecollar then sweeps the loan share from that verified payment.
const key = process.env.STRIPE_SECRET_KEY;
const stripe = key ? new Stripe(key) : null;

export async function POST(req: Request) {
  const { robotId, amount, description } = await req.json().catch(() => ({}));
  if (!/^R-\d{2}$/.test(robotId ?? "") || !Number.isFinite(amount) || amount < 1 || amount > 5000) {
    return Response.json({ error: "robotId R-NN and amount 1 to 5000 USD required" }, { status: 400 });
  }
  if (!stripe) return Response.json({ simulated: true });
  const origin = new URL(req.url).origin;
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [{
      quantity: 1,
      price_data: {
        currency: "usd",
        unit_amount: Math.round(amount * 100),
        product_data: { name: `Robot ${robotId}: ${String(description ?? "verified work").slice(0, 80)}` },
      },
    }],
    metadata: { robotId },
    success_url: `${origin}/desk?paid={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/desk`,
  });
  return Response.json({ url: session.url });
}

// Called when Checkout redirects back: only a session Stripe marks as paid moves the loan.
export async function GET(req: Request) {
  const id = new URL(req.url).searchParams.get("id") ?? "";
  if (!stripe || !/^cs_(test|live)_\w+$/.test(id)) return Response.json({ paid: false }, { status: 400 });
  const s = await stripe.checkout.sessions.retrieve(id);
  return Response.json({ paid: s.payment_status === "paid", amount: (s.amount_total ?? 0) / 100, robotId: s.metadata?.robotId, id: s.id });
}

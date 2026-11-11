import { approve, append, proposeActions, type Action, type Event, type Loan, type Robot } from "@/lib/engine";
import { get, set } from "@/lib/store";

// POST {robot, loan}: the agent proposes actions (service ticket, payment holiday, lender notice, find work).
// PATCH {id, role}: a person approves; an action runs only when its quorum of distinct roles is met.
// Every proposal and execution is appended to a sha256 chain.
const ROLES = ["operator", "lender", "hebl"];

export async function POST(req: Request) {
  const { robot, loan } = await req.json().catch(() => ({}));
  if (!robot || !/^R-\d{2}$/.test(robot.id ?? "") || typeof robot.health !== "number") return Response.json({ error: "robot with id and health required" }, { status: 400 });
  const proposed = proposeActions(robot as Robot, (loan as Loan) ?? null, new Date().toISOString());
  const all = await get<Action[]>("actions", []);
  const fresh = proposed.filter((p) => !all.some((a) => a.id === p.id));
  let chain = await get<Event[]>("actions:chain", []);
  for (const a of fresh) chain = await append(chain, "action.proposed", { id: a.id, type: a.type });
  await set("actions", [...all, ...fresh]); await set("actions:chain", chain);
  return Response.json({ actions: [...all, ...fresh].filter((a) => a.robotId === robot.id) });
}

export async function PATCH(req: Request) {
  const { id, role } = await req.json().catch(() => ({}));
  if (typeof id !== "string" || !ROLES.includes(role)) return Response.json({ error: `id and role in ${ROLES.join(", ")} required` }, { status: 400 });
  const all = await get<Action[]>("actions", []);
  const a = all.find((x) => x.id === id);
  if (!a) return Response.json({ error: "unknown action" }, { status: 404 });
  const next = approve(a, role);
  let chain = await get<Event[]>("actions:chain", []);
  chain = await append(chain, next.status === "executed" && a.status !== "executed" ? "action.executed" : "action.approved", { id, role });
  await set("actions", all.map((x) => (x.id === id ? next : x))); await set("actions:chain", chain);
  return Response.json({ action: next, chainHead: chain.at(-1)?.hash });
}

export async function GET() {
  const chain = await get<Event[]>("actions:chain", []);
  return Response.json({ actions: await get<Action[]>("actions", []), events: chain.length, head: chain.at(-1)?.hash ?? null });
}

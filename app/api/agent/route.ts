import { parseJobOffline } from "@/lib/engine";

// The model reads messy text and returns structure. Code decides everything after that.
// Provider order: GMI Cloud, then OpenRouter, then the offline parser.
const PROVIDERS = [
  { name: "GMI Cloud", key: process.env.GMI_API_KEY, base: "https://api.gmi-serving.com/v1", model: process.env.GMI_MODEL },
  { name: "OpenRouter", key: process.env.OPENROUTER_API_KEY, base: "https://openrouter.ai/api/v1", model: process.env.OPENROUTER_MODEL },
];

const PROMPTS = {
  job: `Extract the job offer as JSON with keys task (one word), hours (number), payPerHour (USD number), client (string). Then add note: one short plain sentence for the robot operator. Output JSON only.`,
  clip: `A robot failure is described. Return JSON with keys tag (2 to 4 words naming the skill the robot lacked), rarity (1 common, 2 uncommon, 3 rare edge case), note (one short sentence on why AI labs would want this clip). Output JSON only.`,
};

async function callModel(p: (typeof PROVIDERS)[number], mode: "job" | "clip", text: string) {
  const t0 = Date.now();
  const res = await fetch(`${p.base}/chat/completions`, {
    method: "POST",
    headers: { Authorization: `Bearer ${p.key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: p.model,
      temperature: 0,
      max_tokens: 200,
      messages: [{ role: "system", content: PROMPTS[mode] }, { role: "user", content: text }],
    }),
    signal: AbortSignal.timeout(15000),
  });
  if (!res.ok) throw new Error(`${p.name} ${res.status}`);
  const body = await res.json();
  const raw: string = body.choices?.[0]?.message?.content ?? "";
  const json = JSON.parse(raw.slice(raw.indexOf("{"), raw.lastIndexOf("}") + 1));
  return { json, provider: p.name, model: p.model, ms: Date.now() - t0, tokens: body.usage?.total_tokens ?? null };
}

export async function POST(req: Request) {
  const { mode, text } = await req.json().catch(() => ({}));
  if ((mode !== "job" && mode !== "clip") || typeof text !== "string" || !text.trim() || text.length > 1000) {
    return Response.json({ error: "mode must be job or clip, text 1 to 1000 chars" }, { status: 400 });
  }
  for (const p of PROVIDERS) {
    if (!p.key || !p.model) continue;
    try {
      const r = await callModel(p, mode, text);
      if (mode === "job") {
        const j = r.json;
        const job = {
          task: String(j.task ?? "work").slice(0, 30),
          hours: Math.max(0, Math.min(24, Number(j.hours) || 0)),
          payPerHour: Math.max(0, Math.min(1000, Number(j.payPerHour) || 0)),
          client: String(j.client ?? "Unknown client").slice(0, 60),
        };
        return Response.json({ ...r, json: undefined, job, note: String(j.note ?? "").slice(0, 200) });
      }
      const rarity = [1, 2, 3].includes(Number(r.json.rarity)) ? Number(r.json.rarity) : 1;
      return Response.json({ ...r, json: undefined, tag: String(r.json.tag ?? "edge case").slice(0, 40), rarity, note: String(r.json.note ?? "").slice(0, 200) });
    } catch {
      // fall through to the next provider
    }
  }
  const t0 = Date.now();
  if (mode === "job") return Response.json({ provider: "offline parser", model: "regex", ms: Date.now() - t0, job: parseJobOffline(text), note: "Read by the offline parser (no model key set)." });
  const rare = /stair|glass|reflect|child|wet|tangle|crowd/i.test(text) ? 3 : /drop|slip|jam/i.test(text) ? 2 : 1;
  return Response.json({ provider: "offline parser", model: "regex", ms: 0, tag: "manipulation failure", rarity: rare, note: "Tagged by the offline parser (no model key set)." });
}

export async function GET() {
  const p = PROVIDERS.find((x) => x.key && x.model);
  return Response.json({ provider: p?.name ?? "offline parser", model: p?.model ?? "regex" });
}

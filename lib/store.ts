// Storage for receipts and agent actions. Uses Upstash/Vercel KV over REST when KV_REST_API_URL and
// KV_REST_API_TOKEN are set; otherwise an in-memory map (per server instance, labelled as demo persistence).
const URL_ = process.env.KV_REST_API_URL, TOKEN = process.env.KV_REST_API_TOKEN;
const mem: Map<string, unknown> = ((globalThis as unknown as { __heblMem?: Map<string, unknown> }).__heblMem ??= new Map());
export const durable = !!(URL_ && TOKEN);

export async function get<T>(key: string, fallback: T): Promise<T> {
  if (!durable) return (mem.get(key) as T) ?? fallback;
  const r = await fetch(`${URL_}/get/${encodeURIComponent(key)}`, { headers: { Authorization: `Bearer ${TOKEN}` }, cache: "no-store" });
  const j = await r.json().catch(() => null);
  return j?.result ? (JSON.parse(j.result) as T) : fallback;
}
export async function set(key: string, value: unknown) {
  if (!durable) { mem.set(key, value); return; }
  await fetch(`${URL_}/set/${encodeURIComponent(key)}`, { method: "POST", headers: { Authorization: `Bearer ${TOKEN}` }, body: JSON.stringify(value) });
}

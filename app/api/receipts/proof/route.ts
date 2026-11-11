import { merkleProof, merkleRoot, verifyProof, type Receipt } from "@/lib/engine";
import { get } from "@/lib/store";

// GET ?hash=<receipt hash>&day=YYYY-MM-DD: inclusion proof for one hour against the day's root.
export async function GET(req: Request) {
  const q = new URL(req.url).searchParams, hash = q.get("hash") ?? "", day = q.get("day") ?? new Date().toISOString().slice(0, 10);
  if (!/^[0-9a-f]{64}$/.test(hash) || !/^\d{4}-\d{2}-\d{2}$/.test(day)) return Response.json({ error: "hash (sha256 hex) and day required" }, { status: 400 });
  const leaves = (await get<Receipt[]>(`receipts:${day}`, [])).map((r) => r.hash);
  const i = leaves.indexOf(hash);
  if (i < 0) return Response.json({ included: false }, { status: 404 });
  const proof = await merkleProof(leaves, i), root = await merkleRoot(leaves);
  return Response.json({ included: await verifyProof(hash, proof, root), index: i, proof, root });
}

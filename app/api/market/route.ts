import { buildIndex, parseRss, score, type Scored } from "@/lib/market";

// Fixed feeds only (no user input reaches fetch). Cached in memory for 5 minutes.
const FEEDS = [
  { url: "https://www.therobotreport.com/feed/", source: "The Robot Report" },
  { url: "https://news.google.com/rss/search?q=robot+OR+humanoid+OR+robotics+when:14d&hl=en-US&gl=US&ceid=US:en", source: "Google News" },
];
let cache: { at: number; items: Scored[] } | null = null;

export async function GET() {
  if (!cache || Date.now() - cache.at > 5 * 60_000) {
    const results = await Promise.allSettled(
      FEEDS.map(async (f) => {
        const r = await fetch(f.url, { signal: AbortSignal.timeout(8000), headers: { "User-Agent": "selfmade-demo" }, cache: "no-store" });
        if (!r.ok) throw new Error(String(r.status));
        return parseRss(await r.text(), f.source);
      }),
    );
    const seen = new Set<string>();
    const items = results
      .flatMap((r) => (r.status === "fulfilled" ? r.value : []))
      .filter((h) => !seen.has(h.title) && seen.add(h.title))
      .map(score)
      .sort((a, b) => Date.parse(b.date) - Date.parse(a.date))
      .slice(0, 80);
    if (items.length) cache = { at: Date.now(), items };
  }
  const items = cache?.items ?? [];
  return Response.json({
    live: items.length > 0,
    fetchedAt: cache?.at ?? null,
    series: buildIndex(items),
    headlines: items.filter((i) => i.impact !== 0).slice(0, 8),
    counted: items.length,
  });
}

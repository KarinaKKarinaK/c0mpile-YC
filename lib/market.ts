// News-driven robot value index. Headlines are live (RSS); the impact weights are ours [modelled].
// Rules are plain and visible so anyone can see why the index moved.
import type { Kind } from "./engine";

export type Headline = { title: string; link: string; date: string; source: string };
export type Scored = Headline & { impact: number; kinds: Kind[]; rule: string };

const RULES: { re: RegExp; impact: number; rule: string }[] = [
  { re: /\b(tariff|ban|covered list|export (control|restriction)|rare.earth|magnet)/i, impact: 1.2, rule: "supply squeeze lifts used values" },
  { re: /\b(price cut|cheaper|under \$|costs? just|mass production|unveil|launch(es|ed)?)\b/i, impact: -0.9, rule: "cheaper new supply lowers used values" },
  { re: /\b(raises|funding|series [a-f]|valuation|ipo|spac|invest)/i, impact: 0.6, rule: "capital inflow lifts demand" },
  { re: /\b(order|deploy|contract|fleet|pilot|rollout)/i, impact: 0.5, rule: "deployments lift demand" },
  { re: /\b(recall|injur|accident|fire|lawsuit|fault|hack)/i, impact: -0.8, rule: "safety risk lowers values" },
  { re: /\b(layoff|shut(s|ting)? down|bankrupt|insolven|delay)/i, impact: -1.1, rule: "distress lowers values" },
];
const KIND_RE: [Kind, RegExp][] = [
  ["Humanoid", /humanoid|optimus|figure|digit|unitree g1|neo\b|apptronik|agility/i],
  ["Quadruped", /quadruped|robot dog|spot\b|anymal|go2|legged/i],
  ["Arm", /\barm\b|cobot|universal robots|fanuc|abb\b|kuka|industrial robot/i],
  ["AMR", /\bamr\b|mobile robot|warehouse robot|locus|autonomous mobile|forklift/i],
];

export function score(h: Headline): Scored {
  const hit = RULES.find((r) => r.re.test(h.title));
  const kinds = KIND_RE.filter(([, re]) => re.test(h.title)).map(([k]) => k);
  return { ...h, impact: hit?.impact ?? 0, rule: hit?.rule ?? "no rule matched", kinds: kinds.length ? kinds : ["Humanoid", "Quadruped", "Arm", "AMR"] };
}

// Index per kind over the last N days: 100 plus decayed impacts (half-life 5 days).
export function buildIndex(items: Scored[], now = Date.now(), days = 14) {
  const KINDS: Kind[] = ["Humanoid", "Quadruped", "Arm", "AMR"];
  const pts = Array.from({ length: days + 1 }, (_, d) => now - (days - d) * 864e5);
  const series = KINDS.map((k) => ({
    kind: k,
    points: pts.map((t) => {
      const v = items.reduce((acc, it) => {
        const at = Date.parse(it.date);
        if (!it.kinds.includes(k) || !(at <= t)) return acc;
        return acc + it.impact * Math.pow(0.5, (t - at) / (5 * 864e5));
      }, 0);
      return { t, v: Math.round((100 + v) * 100) / 100 };
    }),
  }));
  return series;
}

export function parseRss(xml: string, source: string): Headline[] {
  const out: Headline[] = [];
  for (const m of xml.matchAll(/<item>([\s\S]*?)<\/item>/g)) {
    const get = (tag: string) => (m[1].match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`))?.[1] ?? "").replace(/<!\[CDATA\[|\]\]>/g, "").trim();
    const title = get("title").replace(/&amp;/g, "&").replace(/&#8217;|&#039;/g, "'").replace(/&quot;|&#8220;|&#8221;/g, '"').replace(/&#8211;|&#8212;/g, "-");
    if (title) out.push({ title: title.slice(0, 200), link: get("link"), date: new Date(get("pubDate") || Date.now()).toISOString(), source });
  }
  return out;
}

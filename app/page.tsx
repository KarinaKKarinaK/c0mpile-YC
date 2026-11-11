import Link from "next/link";
import { TileGrain } from "@/components/Hero";
import { Counter, Logo, Reveal } from "@/components/Ui";
import { Accordion, AccordionItem, MobileMenu } from "@/components/kit";

const STATS = [
  { v: 1.51, pre: "$", suf: "T", dec: 2, l: "US equipment finance", s: "ELFA 2025", u: "https://www.supplychain247.com/article/industry_horizon_report_shows_equipment_finance_industry_expanded_to_1.5_trillion" },
  { v: 47.4, pre: "$", suf: "B", dec: 1, l: "Physical AI raised, H1 2026", s: "Crunchbase", u: "https://news.crunchbase.com/venture/physical-ai-funding-startups-robotics-aerospace-h1-2026/" },
  { v: 75, pre: "", suf: "%", dec: 0, l: "US content, new mobile robots, 2029", s: "FCC, YC RFS", u: "https://docs.fcc.gov/public/attachments/DOC-423682A1.pdf" },
];
const FLOW = [
  { n: "01", k: "Verify", big: "1 h", d: "Every billed hour checked against energy draw" },
  { n: "02", k: "Price", big: "live", d: "Value moves with earnings, health and the news" },
  { n: "03", k: "Repay", big: "8 to 30%", d: "Of each job. Robot down? You pay less" },
  { n: "04", k: "Own", big: "$0", d: "Balance hits zero. The robot is yours" },
];
const COMPARE = [
  ["", "Your bank", "Stripe Capital", "Formic", "Bluecollar"],
  ["Priced on", "Credit score", "Card sales", "Contract", "Live telemetry"],
  ["Robot down for a week", "Same bill", "n/a", "Bundled", "Pay less"],
  ["Fake hours", "Invisible", "n/a", "Trust", "Rejected"],
  ["Data income", "Ignored", "Ignored", "Kept by Formic", "80% to you"],
  ["FCC US-made rule", "Ignored", "n/a", "Partly", "Priced in"],
];
const FAQ = [
  { q: "Who brings the capital?", a: "Licensed equipment lenders. We are their underwriting and repayment rail first. Our own credit line comes with loss data." },
  { q: "Is the data real?", a: "Robot models, list prices and news are real. Fleet telemetry is synthetic and labelled. Next: one fleet partner." },
  { q: "Why now?", a: "FCC US-made rule since 28 Jul 2026. $47.4B into physical AI in H1 2026. Robots already stream telemetry." },
];

export default function Home() {
  return (
    <main>
      <section className="relative isolate min-h-[100svh] overflow-hidden">
        <div className="absolute inset-0 -z-10"><TileGrain /></div>
        <nav className="relative mx-auto flex max-w-7xl items-center justify-between px-5 py-5 text-[13px]">
          <Logo />
          <div className="hidden gap-8 text-white/75 md:flex">
            <a href="#how" className="hover:text-white">How it works</a>
            <a href="#compare" className="hover:text-white">Compare</a>
            <a href="#faq" className="hover:text-white">FAQ</a>
          </div>
          <div className="flex items-center gap-2">
            <MobileMenu links={[{ href: "#how", label: "How it works" }, { href: "#compare", label: "Compare" }, { href: "#faq", label: "FAQ" }, { href: "/desk", label: "Open your fleet" }]} />
            <Link href="/desk" className="btn btn-light whitespace-nowrap">Open your fleet</Link>
          </div>
        </nav>

        <div className="relative mx-auto max-w-6xl px-5 pt-[11vh]">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/60">Robot financing &middot; YC RFS: Wall Street for the Physical Buildout</p>
          <h1 className="mt-6 font-serif text-[clamp(56px,11vw,150px)] font-medium leading-[0.88] tracking-[-0.03em]">
            Credit for the<br />new <em className="text-blue">blue collar.</em>
          </h1>
          <div className="mt-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <p className="max-w-md text-[17px] leading-snug text-white/80">Finance your robots. They pay the loan back from the work they actually do.</p>
            <div className="flex gap-3">
              <Link href="/desk" className="btn btn-orange px-6 py-3 text-[14px]">Open your fleet</Link>
              <a href="#how" className="btn btn-ghost glass px-6 py-3 text-[14px]">How it works</a>
            </div>
          </div>
        </div>

        <div className="relative mx-auto mt-[10vh] grid max-w-6xl grid-cols-3 gap-px border-t border-white/15 px-5">
          {STATS.map((n) => (
            <a key={n.l} href={n.u} className="group pt-5 pr-4">
              <div className="font-serif text-4xl font-medium md:text-6xl"><Counter to={n.v} prefix={n.pre} suffix={n.suf} decimals={n.dec} /></div>
              <div className="mt-1 text-[12px] text-white/65">{n.l}</div>
              <div className="font-mono text-[10px] text-white/35 group-hover:text-white/70">{n.s}</div>
            </a>
          ))}
        </div>
      </section>

      <section id="how" className="mx-auto max-w-6xl px-5 py-28">
        <Reveal><h2 className="max-w-3xl font-serif text-5xl font-medium leading-[1.02] md:text-7xl">Banks see a forklift. <em className="text-orange">We see the work.</em></h2></Reveal>
        <div className="relative mt-16">
          <div className="absolute left-0 right-0 top-[34px] hidden h-px bg-gradient-to-r from-blue via-white/30 to-orange md:block" />
          <div className="grid gap-10 md:grid-cols-4 md:gap-6">
            {FLOW.map((f, i) => (
              <Reveal key={f.k} delay={i * 120}>
                <div className="relative">
                  <div className={`relative z-10 grid h-[68px] w-[68px] place-items-center rounded-full border font-mono text-[12px] backdrop-blur transition-transform duration-500 hover:scale-110 ${i === 3 ? "border-orange bg-orange text-ink" : "border-white/25 bg-ink"}`}>{f.n}</div>
                  <div className="mt-6 font-mono text-[11px] uppercase tracking-widest text-white/50">{f.k}</div>
                  <div className="mt-1 font-serif text-5xl font-medium">{f.big}</div>
                  <p className="mt-2 max-w-[220px] text-[14px] text-white/60">{f.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="compare" className="mx-auto max-w-6xl px-5 pb-28">
        <Reveal>
          <blockquote className="font-serif text-4xl font-medium leading-tight md:text-6xl">&ldquo;Today, banks underwrite a robot like a <em className="text-orange">forklift.</em>&rdquo;</blockquote>
          <p className="mt-3 font-mono text-[11px] text-white/45">Brad Flora, YC Request for Startups, Winter 2027</p>
        </Reveal>
        <Reveal className="mt-14 overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-[14px]">
            <tbody>
              {COMPARE.map((row, i) => (
                <tr key={i} className={i === 0 ? "font-mono text-[11px] uppercase tracking-wider text-white/45" : "border-t border-white/10"}>
                  {row.map((c, j) => (
                    <td key={j} className={`py-4 pr-4 ${j === 0 ? "text-white/55" : ""} ${j === 4 ? (i === 0 ? "text-orange" : "font-medium text-white") : i ? "text-white/60" : ""}`}>{c}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </Reveal>
      </section>

      <section id="faq" className="mx-auto max-w-6xl px-5 pb-28">
        <div className="mx-auto mt-20 max-w-3xl"><Accordion>{FAQ.map((f) => <AccordionItem key={f.q} title={f.q}>{f.a}</AccordionItem>)}</Accordion></div>
        <div className="mt-20 flex flex-col items-center gap-5 text-center">
          <h3 className="font-serif text-5xl font-medium md:text-7xl">Let the robot <em className="text-orange">pay.</em></h3>
          <Link href="/desk" className="btn btn-orange px-7 py-3 text-[14px]">Open your fleet</Link>
        </div>
      </section>

      <footer className="border-t border-white/10 px-5 py-8 text-center font-mono text-[10px] text-white/40">
        Bluecollar &middot; built at c0mpiled-18, YC Startup School Hackathon, Taipei &middot; fleet telemetry synthetic, labelled &middot; not affiliated with Y Combinator
      </footer>
    </main>
  );
}

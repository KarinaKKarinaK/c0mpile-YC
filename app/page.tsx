import Link from "next/link";
import TileGlow from "@/components/TileGlow";
import { Counter, Logo, Reveal, Tilt } from "@/components/Ui";
import { Accordion, AccordionItem, MobileMenu } from "@/components/kit";

const STATS = [
  { v: 1.51, pre: "$", suf: "T", dec: 2, l: "US equipment finance", s: "ELFA 2025", u: "https://www.supplychain247.com/article/industry_horizon_report_shows_equipment_finance_industry_expanded_to_1.5_trillion" },
  { v: 47.4, pre: "$", suf: "B", dec: 1, l: "Physical AI raised, H1 2026", s: "Crunchbase", u: "https://news.crunchbase.com/venture/physical-ai-funding-startups-robotics-aerospace-h1-2026/" },
  { v: 75, pre: "", suf: "%", dec: 0, l: "US content for new mobile robots by 2029", s: "FCC, YC RFS", u: "https://docs.fcc.gov/public/attachments/DOC-423682A1.pdf" },
  { v: 0, pre: "", suf: "", dec: 0, l: "Robot lenders on live telemetry we found", s: "Our scan, Nov 2026", u: "https://github.com/KarinaKKarinaK/c0mpile-YC#why-its-different" },
];
const HOW = [
  { k: "Verify", n: "every hour", d: "Billed hours must match energy draw" },
  { k: "Price", n: "live", d: "Value from earnings, health, FCC status" },
  { k: "Repay", n: "8 to 30%", d: "Of each job, swept through Stripe" },
  { k: "Earn twice", n: "80%", d: "Of data licences to the operator" },
];
const PROXIES = [
  { k: "Stripe Capital", d: "Repay as % of sales. 81k+ businesses funded." },
  { k: "USD.AI", d: "GPU loans priced on live telemetry." },
  { k: "Formic", d: "Robots as a service, finance bundled." },
  { k: "Your bank", d: "10.55% fixed. Robot idle? Same bill." },
];
const US = [
  { k: "Zishi", d: "A drone that repays its own lease from verified work. Shenzhen FinTechathon." },
  { k: "Guild", d: "A market for robot training data. HK AI Summit, finalist, 2nd." },
  { k: "Arbiter", d: "A rule ledger an AI agent cannot overrule. Nebius x NVIDIA." },
];
const FAQ = [
  { q: "Who brings the capital?", a: "Licensed equipment lenders. We are their underwriting and repayment layer first. Our own credit line comes with loss data." },
  { q: "Is the data real?", a: "Ledger, oracle, model calls and Stripe are real code. Fleet and telemetry are synthetic and labelled. Next: one fleet partner." },
  { q: "What stops fake work?", a: "Each billed hour must match the robot's energy draw inside a calibrated band." },
  { q: "Why now?", a: "FCC rule from 28 Jul 2026. $47.4B raised in H1 2026, mostly equity buying steel. Robots now stream telemetry." },
];

export default function Home() {
  return (
    <main>
      <section className="relative isolate min-h-[100svh] overflow-hidden">
        <div className="absolute inset-0 -z-10"><TileGlow /></div>

        <nav className="relative mx-auto flex max-w-7xl items-center justify-between px-5 py-5 text-[12px]">
          <Logo />
          <div className="hidden gap-8 text-white/80 md:flex">
            <a href="#how" className="hover:text-white"><span className="text-orange">&bull;</span> How</a>
            <a href="#proof" className="hover:text-white">Numbers</a>
            <a href="#us" className="hover:text-white">Team</a>
            <a href="#faq" className="hover:text-white">FAQ</a>
          </div>
          <div className="flex items-center gap-2">
            <MobileMenu links={[{ href: "#how", label: "How" }, { href: "#proof", label: "Numbers" }, { href: "#us", label: "Team" }, { href: "#faq", label: "FAQ" }, { href: "/desk", label: "Open the factory" }]} />
            <Link href="/desk" className="btn btn-light whitespace-nowrap">Finance a robot</Link>
          </div>
        </nav>

        <div className="relative mx-auto max-w-5xl px-5 pt-[12vh] text-center">
          <p className="kicker">YC RFS &middot; Wall Street for the Physical Buildout</p>
          <h1 className="mt-6 font-serif text-[clamp(52px,9vw,124px)] leading-[0.92] tracking-tight">
            Robots that pay<br />for <em>themselves.</em>
          </h1>
          <p className="mx-auto mt-6 text-[13px] text-white/80">Robot loans &middot; priced on live telemetry &middot; repaid per verified job</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/desk" className="btn btn-orange px-6 py-3 text-[13px]">Finance a robot</Link>
            <Link href="/desk" className="btn btn-ghost glass px-6 py-3 text-[13px]">Watch a line jam</Link>
          </div>
        </div>

        <div id="proof" className="relative mx-auto mt-[14vh] grid max-w-7xl grid-cols-2 gap-3 px-5 pb-10 md:grid-cols-4">
          {STATS.map((n) => (
            <Tilt key={n.l} className="glass rounded-2xl p-5">
              <div className="font-serif text-5xl md:text-6xl"><Counter to={n.v} prefix={n.pre} suffix={n.suf} decimals={n.dec} /></div>
              <div className="mt-2 text-[11px] text-white/75">{n.l}</div>
              <a href={n.u} className="text-[10px] text-white/40 hover:underline">{n.s}</a>
            </Tilt>
          ))}
        </div>
      </section>

      <section id="how" className="mx-auto max-w-7xl px-5 py-24">
        <Reveal><h2 className="font-serif text-5xl md:text-7xl">Banks see a forklift. <em>We see the work.</em></h2></Reveal>
        <div className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-4">
          {HOW.map((h, i) => (
            <Reveal key={h.k} delay={i * 80}>
              <Tilt className="card h-full p-6">
                <div className="text-[11px] text-orange">0{i + 1} &middot; {h.k}</div>
                <div className="mt-8 font-serif text-5xl">{h.n}</div>
                <div className="mt-2 text-[11px] text-white/60">{h.d}</div>
              </Tilt>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-24">
        <div className="grid gap-3 md:grid-cols-[1.2fr_1fr]">
          <Reveal>
            <Tilt className="card h-full p-8">
              <p className="kicker">YC RFS, Winter 2027</p>
              <blockquote className="mt-6 font-serif text-4xl leading-tight md:text-5xl">&ldquo;Banks underwrite a robot like a <em>forklift.</em>&rdquo;</blockquote>
              <p className="mt-4 text-[11px] text-white/50">Brad Flora, Y Combinator</p>
            </Tilt>
          </Reveal>
          <Reveal delay={100}>
            <div className="grid h-full grid-cols-2 gap-3">
              {PROXIES.map((p) => (
                <Tilt key={p.k} className="card p-5">
                  <div className="font-serif text-2xl">{p.k}</div>
                  <div className="mt-2 text-[11px] text-white/60">{p.d}</div>
                </Tilt>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section id="us" className="mx-auto max-w-7xl px-5 pb-24">
        <Reveal><p className="kicker">Why us: our fourth build in this space</p></Reveal>
        <div className="mt-6 grid gap-3 md:grid-cols-3">
          {US.map((u, i) => (
            <Reveal key={u.k} delay={i * 80}>
              <Tilt className="card h-full p-6">
                <div className="font-serif text-4xl">{u.k}</div>
                <div className="mt-3 text-[11px] text-white/60">{u.d}</div>
              </Tilt>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="faq" className="mx-auto max-w-4xl px-5 pb-24">
        <Accordion>{FAQ.map((f) => <AccordionItem key={f.q} title={f.q}>{f.a}</AccordionItem>)}</Accordion>
        <div className="mt-16 flex flex-col items-center gap-5 text-center">
          <h3 className="font-serif text-5xl md:text-6xl">Fund the robot. <em>It pays you back.</em></h3>
          <Link href="/desk" className="btn btn-orange px-6 py-3 text-[13px]">Open the factory</Link>
        </div>
      </section>

      <footer className="border-t border-white/10 px-5 py-8 text-center text-[11px] text-white/45">
        Built at c0mpiled-18, YC Startup School Hackathon, Taipei. Synthetic fleet data, labelled. Not affiliated with Y Combinator.
      </footer>
    </main>
  );
}

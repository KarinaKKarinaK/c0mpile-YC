import Link from "next/link";
import BeadCurtain from "@/components/BeadCurtain";
import { Counter, Logo, Reveal, Tilt } from "@/components/Ui";

const STEPS = [
  { n: "01", t: "Verify", d: "Every billed hour is checked against the robot's own telemetry. Idle hours and spoofed cycles are rejected before any money moves." },
  { n: "02", t: "Price", d: "A live value index per robot, from verified earnings, health and FCC status. Banks price a robot like a forklift. We price what it earns." },
  { n: "03", t: "Govern", d: "Loan rules live in a ledger the robot's agent can read but never overrule. Changing a rule takes the lender and the operator." },
  { n: "04", t: "Repay", d: "A share of every job payment is swept to the lender through Stripe. Slow month, smaller payment. At zero, the operator owns the robot." },
  { n: "05", t: "Earn twice", d: "Failures and edge cases become training data for robot model labs. The operator keeps 80% and it pays the loan down faster." },
];

const NUMBERS = [
  { v: 1.51, pre: "$", suf: "T", dec: 2, l: "US equipment finance, 2025", s: "ELFA Horizon report", u: "https://www.supplychain247.com/article/industry_horizon_report_shows_equipment_finance_industry_expanded_to_1.5_trillion" },
  { v: 47.4, pre: "$", suf: "B", dec: 1, l: "Physical AI funding, H1 2026", s: "Crunchbase", u: "https://news.crunchbase.com/venture/physical-ai-funding-startups-robotics-aerospace-h1-2026/" },
  { v: 75, pre: "", suf: "%", dec: 0, l: "US content needed by 2029 for new mobile robots", s: "FCC DA 26-786, YC RFS", u: "https://docs.fcc.gov/public/attachments/DOC-423682A1.pdf" },
  { v: 0, pre: "", suf: "", dec: 0, l: "Robot lenders using live telemetry we could find", s: "Our search, 11 Nov 2026", u: "https://github.com/KarinaKKarinaK/c0mpile-YC#why-its-different" },
];

export default function Home() {
  return (
    <main>
      <section className="relative isolate min-h-[100svh] overflow-hidden">
        <div className="absolute inset-0 -z-20" style={{ background: "radial-gradient(60% 55% at 50% 0%, rgba(2,151,222,0.35), transparent 70%), radial-gradient(70% 50% at 50% 100%, rgba(252,115,77,0.55), transparent 70%), #02070A" }} />
        <BeadCurtain className="-z-10" />

        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 text-[12px]">
          <Logo />
          <div className="hidden gap-8 text-white/80 md:flex">
            <a href="#how" className="hover:text-white"><span className="text-orange">&bull;</span> How it works</a>
            <a href="#numbers" className="hover:text-white">Numbers</a>
            <a href="#yc" className="hover:text-white">YC RFS</a>
            <a href="https://github.com/KarinaKKarinaK/c0mpile-YC" className="hover:text-white">GitHub</a>
          </div>
          <div className="glass flex items-center gap-1 rounded-full p-1">
            <a href="#how" className="btn px-3 text-white/80">Learn</a>
            <Link href="/desk" className="btn btn-light">Open the desk</Link>
          </div>
        </nav>

        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center px-5 pt-10 md:grid-cols-[1fr_2.2fr_1fr] md:pt-16">
          <div className="hidden space-y-8 md:block">
            <div><div className="font-serif text-4xl">$1.51T</div><div className="text-[11px] text-white/60">US equipment finance, 2025</div></div>
            <div><div className="font-serif text-4xl">$47.4B</div><div className="text-[11px] text-white/60">Physical AI raised, H1 2026</div></div>
          </div>
          <div className="text-center">
            <p className="kicker mb-6">Built for YC&apos;s Request for Startups: Wall Street for the Physical Buildout</p>
            <h1 className="font-serif text-[clamp(48px,8vw,104px)] leading-[0.95] tracking-tight">
              Robots that pay<br />for <em>themselves.</em>
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-[13px] leading-relaxed text-white/75">
              Selfmade lends against robots based on what they actually earn, and gets repaid from every verified job.
            </p>
          </div>
          <div className="hidden space-y-8 text-right md:block">
            <div><div className="font-serif text-4xl">65% to 75%</div><div className="text-[11px] text-white/60">US content rule for new mobile robots</div></div>
            <div><div className="font-serif text-4xl">$500k/yr</div><div className="text-[11px] text-white/60">What one robot can earn, per YC RFS</div></div>
          </div>
        </div>

        <div className="mt-10 flex justify-center">
          <Link href="/desk" className="orb grid h-28 w-28 place-items-center text-[11px] text-white">
            <span className="text-center leading-tight">Open<br />the desk</span>
          </Link>
        </div>

        <div className="mx-auto mt-14 grid max-w-7xl grid-cols-1 gap-5 px-5 pb-10 md:grid-cols-3">
          <Tilt base={-1.5} className="card p-4">
            <p className="kicker mb-3">Verified work</p>
            <div className="flex h-28 items-end gap-1.5">
              {[62, 80, 45, 90, 70, 12, 85, 76, 95, 8, 66, 88].map((h, i) => (
                <div key={i} className="flex-1 rounded-sm" style={{ height: `${h}%`, background: h < 20 ? "#FC734D" : "#0297DE", opacity: h < 20 ? 1 : 0.8 }} />
              ))}
            </div>
            <p className="mt-3 text-[11px] text-white/60">Orange hours failed the telemetry check and were never billed.</p>
          </Tilt>
          <Tilt className="card p-4">
            <p className="kicker mb-3">Loan, repaid by the robot</p>
            <svg viewBox="0 0 300 110" className="h-28 w-full">
              <defs><linearGradient id="g" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#FC734D" stopOpacity="0.5" /><stop offset="1" stopColor="#FC734D" stopOpacity="0" /></linearGradient></defs>
              <path d="M0,10 C40,14 60,22 90,30 S150,48 180,62 S240,90 300,104 L300,110 L0,110 Z" fill="url(#g)" />
              <path d="M0,10 C40,14 60,22 90,30 S150,48 180,62 S240,90 300,104" fill="none" stroke="#FC734D" strokeWidth="2" />
              <circle cx="180" cy="62" r="5" fill="#0297DE" />
            </svg>
            <p className="mt-3 text-[11px] text-white/60">Balance falls with every paid job. Payments flex with uptime.</p>
          </Tilt>
          <Tilt base={1.5} className="card p-4">
            <p className="kicker mb-3">Rules the agent cannot overrule</p>
            <ul className="space-y-2 text-[11px]">
              <li className="flex justify-between"><span>C1 No job below $20/h</span><span className="text-orange">blocked 1</span></li>
              <li className="flex justify-between"><span>C2 Max 20 h a day</span><span className="text-blue">held</span></li>
              <li className="flex justify-between"><span>C3 Service when health &lt; 0.6</span><span className="text-blue">held</span></li>
              <li className="pt-2 text-white/50">sha256 a41f...9c0e &rarr; 7be2...11d4 &rarr; c09a...e5f1</li>
            </ul>
          </Tilt>
        </div>
      </section>

      <section id="how" className="mx-auto max-w-7xl px-5 py-28">
        <Reveal><p className="kicker">How it works</p>
          <h2 className="mt-4 max-w-3xl font-serif text-5xl leading-tight md:text-6xl">A robot is the first asset with <em>two</em> cash flows: work and data. Banks underwrite neither.</h2>
        </Reveal>
        <div className="mt-14 grid gap-4 md:grid-cols-5">
          {STEPS.map((s, i) => (
            <Reveal key={s.n} delay={i * 90}>
              <Tilt className="card h-full p-5">
                <div className="text-[11px] text-orange">{s.n}</div>
                <div className="mt-6 font-serif text-3xl">{s.t}</div>
                <p className="mt-3 text-[12px] leading-relaxed text-white/65">{s.d}</p>
              </Tilt>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="numbers" className="border-y border-white/10 bg-white/[0.02]">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-20 md:grid-cols-4">
          {NUMBERS.map((n) => (
            <Reveal key={n.l}>
              <div className="font-serif text-6xl"><Counter to={n.v} prefix={n.pre} suffix={n.suf} decimals={n.dec} /></div>
              <div className="mt-2 text-[12px] text-white/75">{n.l}</div>
              <a href={n.u} className="mt-1 block text-[10px] text-white/40 underline-offset-2 hover:underline">Source: {n.s}</a>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="yc" className="mx-auto max-w-7xl px-5 py-28">
        <div className="grid gap-6 md:grid-cols-2">
          <Reveal>
            <Tilt className="card h-full p-8">
              <p className="kicker">YC Request for Startups, Winter 2027</p>
              <blockquote className="mt-6 font-serif text-4xl leading-tight">&ldquo;Today, banks underwrite a robot like a <em>forklift.</em>&rdquo;</blockquote>
              <p className="mt-4 text-[12px] text-white/60">Brad Flora, Wall Street for the Physical Buildout</p>
            </Tilt>
          </Reveal>
          <Reveal delay={120}>
            <Tilt className="card h-full p-8">
              <p className="kicker">YC Request for Startups, Winter 2027</p>
              <blockquote className="mt-6 font-serif text-4xl leading-tight">&ldquo;Every great buildout... created giant <em>financial companies</em> alongside it.&rdquo;</blockquote>
              <p className="mt-4 text-[12px] text-white/60">Brad Flora. Plus Diana Hu, Robots Made in America: since July the FCC stops new foreign-made mobile robots. Our index prices that.</p>
            </Tilt>
          </Reveal>
        </div>

        <Reveal className="mt-16">
          <p className="kicker">What is real, what is simulated</p>
          <div className="card mt-5 overflow-hidden text-[12px]">
            {[
              ["Covenant ledger, two-person rule, sha256 audit chain", "Real code, verifiable in the browser"],
              ["Work oracle (split-conformal band)", "Real code, measured on synthetic telemetry"],
              ["Job reading and clip tagging", "Real model call on GMI Cloud when a key is set, labelled on screen"],
              ["Job payment", "Real Stripe Checkout in test mode"],
              ["Fleet, prices, telemetry", "Synthetic, labelled [synthetic]"],
              ["Value index and loan pricing", "Modelled from sourced inputs, labelled [modelled]"],
            ].map(([a, b]) => (
              <div key={a} className="grid grid-cols-2 border-b border-white/10 px-5 py-3 last:border-0"><span>{a}</span><span className="text-white/60">{b}</span></div>
            ))}
          </div>
        </Reveal>

        <div className="mt-20 flex flex-col items-center gap-6 text-center">
          <h3 className="font-serif text-5xl">Fund the robot. <em>Let it pay you back.</em></h3>
          <Link href="/desk" className="btn btn-orange px-6 py-3 text-[13px]">Open the lending desk</Link>
        </div>
      </section>

      <footer className="border-t border-white/10 px-5 py-8 text-center text-[11px] text-white/45">
        Built in four hours at c0mpiled-18, the YC Startup School Hackathon in Taipei. Answering YC&apos;s Requests for Startups. Not affiliated with Y Combinator.
      </footer>
    </main>
  );
}

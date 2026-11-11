import Link from "next/link";
import { Drip, Estimator, FilmPhoto, UploadTry, Wave } from "@/components/Hero";
import { PHOTOS } from "@/lib/photos";
import { Logo, NavLinks, StickyHeader } from "@/components/Ui";

const NAV = [["How it works", "#how"], ["Advantages", "#why"], ["Start", "#start"]];
const HOW = [
  { k: "Verified hours", d: "Every billed hour is checked against the robot's own energy draw. Faked hours never count." },
  { k: "Live robot value", d: "Price moves with earnings, health, the FCC US-made rule and robotics news." },
  { k: "Repay per job", d: "A share of each paid job goes to the loan. No work, no payment." },
  { k: "Own it at zero", d: "One flat 12% fee, no interest. When the balance hits zero, the robot is yours." },
];
const WHY = [
  { q: "For lenders: your capital, our rails", a: "You fund the loans and keep them on your book. Hebl prices each robot from its own data, verifies every billed hour against telemetry and the client's warehouse system, and collects through Stripe. We charge a software fee per loan, so we can start without a lending licence or our own balance sheet." },
  { q: "Nothing due when it's down", a: "A jammed line or a broken gripper means a smaller payment, not a missed one. Banks bill the same either way." },
  { q: "An offer in ten seconds", a: "Pick the model. We price from list price, expected hours and live market data. No forms." },
  { q: "Real robots, real prices", a: "Universal Robots, FANUC, Unitree, Boston Dynamics, Agility and more, at their sourced list prices." },
  { q: "Earn twice", a: "Edge cases your robot records can be licensed to robot AI labs. You keep 80% and it pays the loan down." },
];
const Arrow = () => <span aria-hidden className="ml-2">&#8599;</span>;
const Label = ({ children }: { children: string }) => <p className="font-mono text-[10px] uppercase tracking-[0.2em] opacity-50">( {children} )</p>;

const YC10: [string, string][] = [
  ["1. Founder fit?", "Our fourth build where machines pay their own way: a drone that repays its lease (Shenzhen), a robot-data market (HK, finalist), an agent rules ledger (Nebius). Gap we are closing: an equipment-finance advisor."],
  ["2. Market, growing?", "US equipment finance $1.51T in 2025 (ELFA), 55% of equipment spend financed. Physical AI raised $47.4B in H1 2026. US robot installs 38,400 in 2025, +12% (IFR)."],
  ["3. How acute?", "A fixed bank payment ignores whether the robot worked. One jam or one slow month and a young fleet misses a payment; so founders burn equity on hardware instead."],
  ["4. Competition?", "Equipment banks (fixed ~10.5%), Formic (robots as a service), USD.AI (GPU loans on telemetry, GPUs only), Stripe Capital (revenue share, card sales only)."],
  ["5. Who wants it?", "Robot fleet operators who finance hardware, and lenders who cannot see what a robot earns. Today: operators can upload their own logs and get a priced offer."],
  ["6. Why now?", "FCC rule of 28 Jul 2026 on foreign-made mobile robots, record physical AI funding, robots that already stream telemetry, and AI agents good enough to run collections."],
  ["7. Proxies?", "Stripe Capital (repay as % of sales, 81k+ businesses funded), USD.AI for GPUs, aircraft and equipment lessors, revenue-based financing."],
  ["8. Years of work?", "Yes. This is the same thesis we keep returning to: machines are becoming economic actors and need credit."],
  ["9. Scalable?", "Software fee per loan on partner capital first, then our own credit line, then pools on Back a fleet. Every verified hour improves pricing: the data compounds."],
  ["10. Good space?", "It is YC's own Winter 2027 request: Wall Street for the Physical Buildout, with a hook into Robots Made in America."],
];
const PLAN: [string, string][] = [
  ["One idea, all in", "Hebl only. Robot credit priced on verified work. Everything else is cut."],
  ["Run the operator's business", "Know their downtime cost, utilisation and cash cycle better than they do; the desk is built around their 8am check."],
  ["Edge of what AI can do", "Agents propose service tickets, payment holidays and lender notices; code and two people approve. Work receipts prove every hour."],
  ["Own the outcome", "Start as rails for licensed lenders, then lend from our own book: be the lender, not software for lenders."],
  ["Most ambitious version", "The credit system for every machine that works: robots, GPUs, solar, EV fleets. Receipts become each machine's credit history."],
];

export default function Home() {
  return (
    <main className="font-light">
      <StickyHeader>
        <nav className="mx-auto flex max-w-7xl items-center justify-between border-x border-dashed border-white/15 px-6 py-4">
          <Link href="/"><Logo /></Link>
          <NavLinks items={[{ label: "How it works", href: "#how" }, { label: "For lenders", href: "#why" }, { label: "Start", href: "#start" }, { label: "Back a fleet", href: "/invest" }, { label: "Live demo", href: "/desk" }]} />
          <Link href="/desk" className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/70 hover:text-white md:hidden">Demo<Arrow /></Link>
        </nav>
      </StickyHeader>
      <section className="relative isolate min-h-[100svh] overflow-hidden bg-ink">
        <div className="absolute inset-0 -z-10"><Wave /></div>
        <div className="mx-auto min-h-[70svh] max-w-7xl border-x border-dashed border-white/15 px-6 pt-[20vh] md:pl-[16%]">
          <h1 className="text-[clamp(38px,5.6vw,76px)] font-light leading-[1.08] tracking-[-0.02em]">
            <span className="fade-line inline-block">Loans for robots,</span><br />
            <span className="fade-line inline-block" style={{ animationDelay: "160ms" }}>repaid by the <em className="text-orange">work they do</em>.</span>
          </h1>
          <p className="fade-line mt-6 max-w-2xl text-[17px] leading-relaxed text-white/80" style={{ animationDelay: "320ms" }}>You get the robot with our money. It pays us back a small share of every job it does, and nothing on days it sits idle.</p>
          <ol className="fade-line mt-8 grid max-w-3xl gap-px border border-dashed border-white/15 sm:grid-cols-3" style={{ animationDelay: "480ms" }}>
            {[["1", "Your robot works", "It logs every hour itself."], ["2", "We verify each hour", "Its telemetry and your warehouse system must agree."], ["3", "A share repays the loan", "Of every paid job. Idle hours cost nothing."]].map(([n, k, d]) => (
              <li key={n} className="bg-ink/40 p-4 backdrop-blur-sm"><span className="font-mono text-[10px] text-orange">{n}</span><div className="mt-1 text-[15px] font-bold">{k}</div><div className="text-[12px] text-white/60">{d}</div></li>
            ))}
          </ol>
          <Link href="/desk" style={{ animationDelay: "640ms" }} className="fade-line group mt-10 inline-flex items-center gap-5 rounded-full bg-white py-2 pl-7 pr-2 text-[15px] font-semibold text-ink transition hover:bg-orange">
            Open the live factory
            <span className="grid h-11 w-11 place-items-center rounded-full bg-ink text-white transition-transform group-hover:rotate-45">&#8599;</span>
          </Link>
        </div>
        <div className="absolute inset-x-0 bottom-6 mx-auto flex max-w-7xl items-end justify-between px-6 text-ink">
          <p className="max-w-xs text-[11px] leading-snug text-white/70">Built for YC&apos;s Request for Startups: Wall Street for the Physical Buildout. News is live, robot prices are sourced list prices; demo fleet telemetry is synthetic.</p>
        </div>
      </section>

      <section className="border-t border-dashed border-white/15 bg-ink">
        <div className="mx-auto max-w-7xl border-x border-dashed border-white/15 px-6 py-20 md:pl-[16%]">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/50">( Try it )</p>
          <div className="mt-6"><Estimator /></div>
          <p className="mt-16 font-mono text-[10px] uppercase tracking-[0.2em] text-white/50">( Or bring your own robot&apos;s log )</p>
          <div className="mt-5"><UploadTry /></div>
        </div>
      </section>

      <section className="border-t border-dashed border-white/15 bg-ink">
        <div className="mx-auto max-w-7xl border-x border-dashed border-white/15 px-6 py-20">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/50">( On the floor )</p>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {PHOTOS.map((ph, i) => <FilmPhoto key={ph.img} i={i} src={ph.img} title={ph.title} line={ph.line} credit={ph.by} page={ph.page} />)}
          </div>
        </div>
      </section>

      <section id="how" className="relative isolate overflow-hidden bg-paper text-ink">
        <div className="mx-auto grid max-w-7xl gap-10 border-x border-dashed border-ink/15 px-6 py-32 md:grid-cols-[16%_1fr]">
          <Label>How it works</Label>
          <div>
            <h2 className="text-4xl font-light leading-tight tracking-[-0.02em] md:text-6xl">What makes <em>Hebl</em><br />different</h2>
            <div className="mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
              {HOW.map((h) => (
                <div key={h.k}><div className="text-[15px] font-bold">{h.k}</div><p className="mt-3 text-[13px] leading-relaxed opacity-70">{h.d}</p></div>
              ))}
            </div>
          </div>
        </div>
        <Drip id="d2" tone="light" className="h-56 opacity-90" />
      </section>

      <section id="why" className="bg-paper text-ink">
        <div className="mx-auto grid max-w-7xl gap-10 border-x border-t border-dashed border-ink/15 px-6 py-32 md:grid-cols-[16%_1fr_1.3fr]">
          <Label>Advantages</Label>
          <div>
            <h2 className="text-4xl font-light leading-tight tracking-[-0.02em] md:text-5xl">Outsmart the <em>bank</em><br />with <em>Hebl</em></h2>
            <Link href="/desk" className="mt-8 inline-flex items-center rounded-md border border-ink/25 px-5 py-2.5 font-mono text-[10px] uppercase tracking-[0.15em] hover:bg-ink hover:text-paper">Try the demo<Arrow /></Link>
            <blockquote className="mt-14 text-xl font-light leading-snug">&ldquo;Today, banks underwrite a robot like a <em className="font-bold">forklift</em>.&rdquo;<span className="mt-2 block font-mono text-[10px] uppercase tracking-[0.15em] opacity-50">Brad Flora, YC RFS Winter 2027</span></blockquote>
          </div>
          <div className="divide-y divide-ink/15 border-y border-ink/15">
            {WHY.map((w) => (
              <details key={w.q} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between text-[15px] font-bold">{w.q}<span className="text-xl font-light transition-transform group-open:rotate-45">+</span></summary>
                <p className="mt-3 max-w-md text-[13px] leading-relaxed opacity-70">{w.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section id="answers" className="border-t border-dashed border-white/15 bg-ink">
        <div className="mx-auto grid max-w-7xl gap-10 border-x border-dashed border-white/15 px-6 py-24 md:grid-cols-[16%_1fr_1fr]">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/50">( Straight answers )</p>
          <div>
            <h2 className="text-3xl font-light tracking-[-0.02em] md:text-4xl">YC&apos;s ten <em>questions</em></h2>
            <div className="mt-6 divide-y divide-dashed divide-white/15 border-y border-dashed border-white/15">
              {YC10.map(([q, a]) => (
                <details key={q} className="group py-4">
                  <summary className="flex cursor-pointer list-none items-center justify-between text-[14px] font-bold">{q}<span className="text-lg font-light transition-transform group-open:rotate-45">+</span></summary>
                  <p className="mt-2 text-[13px] leading-relaxed text-white/70">{a}</p>
                </details>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-3xl font-light tracking-[-0.02em] md:text-4xl">The <em className="text-orange">plan</em></h2>
            <ol className="mt-6 space-y-5 text-[13px] leading-relaxed text-white/75">
              {PLAN.map(([k, d], i) => (
                <li key={k} className="border-l border-dashed border-white/20 pl-4"><span className="font-mono text-[10px] text-orange">0{i + 1}</span><div className="text-[15px] font-bold text-white">{k}</div>{d}</li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section id="start" className="relative isolate overflow-hidden bg-ink">
        <Drip id="d3" flip className="-z-10 h-[75%]" />
        <div className="grain -z-10" style={{ opacity: 0.18 }} />
        <div className="mx-auto grid max-w-7xl gap-10 px-6 pb-16 pt-[38vh] md:grid-cols-[16%_1fr_auto] md:items-end">
          <Label>Start now</Label>
          <div>
            <h2 className="text-4xl font-light tracking-[-0.02em] md:text-6xl">Put your robots <em className="text-orange">on the clock</em></h2>
            <p className="mt-5 max-w-xl text-[14px] leading-relaxed text-white/70">US equipment finance was $1.51T in 2025. Physical AI raised $47.4B in H1 2026. Almost none of it is priced on what robots actually do.</p>
          </div>
          <Link href="/desk" className="inline-flex items-center rounded-md bg-white px-5 py-3 font-mono text-[10px] uppercase tracking-[0.15em] text-ink hover:bg-orange">Open the demo<Arrow /></Link>
        </div>
        <footer className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 border-t border-white/10 px-6 py-8 font-mono text-[10px] uppercase tracking-[0.15em] text-white/45">
          <Logo />
          <span>Built at c0mpiled-18, YC Startup School Hackathon, Taipei</span>
          <span>Not affiliated with Y Combinator</span>
        </footer>
      </section>
    </main>
  );
}

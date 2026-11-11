import Link from "next/link";
import { Drip, Estimator, FilmPhoto, Wave } from "@/components/Hero";
import { PHOTOS } from "@/lib/photos";
import { Logo, StickyHeader } from "@/components/Ui";

const NAV = [["How it works", "#how"], ["Advantages", "#why"], ["Start", "#start"]];
const HOW = [
  { k: "Verified hours", d: "Every billed hour is checked against the robot's own energy draw. Faked hours never count." },
  { k: "Live robot value", d: "Price moves with earnings, health, the FCC US-made rule and robotics news." },
  { k: "Repay per job", d: "A share of each paid job goes to the loan. No work, no payment." },
  { k: "Own it at zero", d: "One flat 12% fee, no interest. When the balance hits zero, the robot is yours." },
];
const WHY = [
  { q: "Nothing due when it's down", a: "A jammed line or a broken gripper means a smaller payment, not a missed one. Banks bill the same either way." },
  { q: "An offer in ten seconds", a: "Pick the model. We price from list price, expected hours and live market data. No forms." },
  { q: "Real robots, real prices", a: "Universal Robots, FANUC, Unitree, Boston Dynamics, Agility and more, at their sourced list prices." },
  { q: "Earn twice", a: "Edge cases your robot records can be licensed to robot AI labs. You keep 80% and it pays the loan down." },
];
const Arrow = () => <span aria-hidden className="ml-2">&#8599;</span>;
const Label = ({ children }: { children: string }) => <p className="font-mono text-[10px] uppercase tracking-[0.2em] opacity-50">( {children} )</p>;

export default function Home() {
  return (
    <main className="font-light">
      <StickyHeader>
        <nav className="mx-auto flex max-w-7xl items-center justify-between border-x border-dashed border-white/15 px-6 py-4">
          <Link href="/"><Logo /></Link>
          <div className="hidden gap-12 font-mono text-[10px] uppercase tracking-[0.2em] text-white/70 md:flex">
            {NAV.map(([l, h]) => <a key={h} href={h} className="hover:text-white">{l}</a>)}
            <Link href="/invest" className="hover:text-white">Back a fleet</Link>
            <Link href="/desk" className="hover:text-white">Live demo<Arrow /></Link>
          </div>
          <Link href="/desk" className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/70 hover:text-white md:hidden">Demo<Arrow /></Link>
        </nav>
      </StickyHeader>
      <section className="relative isolate min-h-[100svh] overflow-hidden bg-ink">
        <div className="absolute inset-0 -z-10"><Wave /></div>
        <div className="mx-auto min-h-[70svh] max-w-7xl border-x border-dashed border-white/15 px-6 pt-[20vh] md:pl-[16%]">
          <h1 className="text-[clamp(38px,5.6vw,76px)] font-light leading-[1.08] tracking-[-0.02em]">
            Loans for robots,<br />repaid by the <em className="text-orange">work they do</em>.
          </h1>
          <p className="mt-6 max-w-2xl text-[17px] leading-relaxed text-white/80">Hebl lends to companies buying robots. We read each robot&apos;s live data, take a small share of every job it completes as repayment, and take nothing when it sits idle. When the balance hits zero, the robot is yours.</p>
          <Link href="/desk" className="group mt-12 inline-flex items-center gap-5 rounded-full bg-white py-2 pl-7 pr-2 text-[15px] font-semibold text-ink transition hover:bg-orange">
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

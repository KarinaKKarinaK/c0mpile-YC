import Link from "next/link";
import { Estimator, GlassBackdrop } from "@/components/Hero";
import { Logo, Reveal } from "@/components/Ui";
import { Accordion, AccordionItem, MobileMenu } from "@/components/kit";

const VALUE = [
  { v: "10 s", l: "to a loan offer" },
  { v: "$0", l: "due while the robot is down" },
  { v: "8 to 30%", l: "of each job repays the loan" },
  { v: "12%", l: "one flat fee. No interest" },
];
const STEPS = [
  { n: "1", k: "Connect", d: "Your robot's telemetry: hours, cycles, faults." },
  { n: "2", k: "Get paid", d: "Each verified job pays you. A share repays the loan." },
  { n: "3", k: "Own it", d: "Balance hits zero. The robot is yours." },
];
const FAQ = [
  { q: "Who lends the money?", a: "Licensed equipment lenders. We price the loan from your robot's data and run the repayment. Our own credit line comes with loss data." },
  { q: "What if my robot breaks?", a: "No work, no repayment. Your payment shrinks with the robot's verified hours, so a bad week never turns into a missed payment." },
  { q: "Which robots?", a: "Arms, AMRs, humanoids and quadrupeds from Universal Robots, FANUC, Unitree, Boston Dynamics, Agility and more. Prices on this page are real list prices." },
  { q: "Is this live?", a: "The estimator, robot prices and news index are live. Fleet telemetry in the demo is synthetic and labelled. We are signing our first fleet partner." },
];

export default function Home() {
  return (
    <main>
      <section className="relative isolate min-h-[100svh] overflow-hidden">
        <div className="absolute inset-0 -z-10"><GlassBackdrop /></div>
        <nav className="relative mx-auto flex max-w-7xl items-center justify-between px-5 py-5 text-[13px] font-medium">
          <Logo />
          <div className="hidden gap-8 text-white/80 md:flex">
            <a href="#how" className="hover:text-white">How it works</a>
            <a href="#faq" className="hover:text-white">FAQ</a>
            <Link href="/desk" className="hover:text-white">Live demo</Link>
          </div>
          <div className="flex items-center gap-2">
            <MobileMenu links={[{ href: "#how", label: "How it works" }, { href: "#faq", label: "FAQ" }, { href: "/desk", label: "Live demo" }]} />
            <Link href="/desk" className="btn btn-light whitespace-nowrap font-semibold">Live demo</Link>
          </div>
        </nav>

        <div className="relative mx-auto max-w-5xl px-5 pt-[9vh] text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-white/70">Robot financing &middot; YC RFS: Wall Street for the Physical Buildout</p>
          <h1 className="mt-5 text-[clamp(44px,8.4vw,112px)] font-black uppercase leading-[0.9] tracking-[-0.04em]">
            Your robot<br />pays its own <span className="text-orange">loan.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-[16px] font-medium text-white/85">Priced on verified hours. Repaid from every job. Nothing due when it&apos;s down.</p>
          <div className="mt-9"><Estimator /></div>
          <Link href="/desk" className="btn btn-orange mt-6 px-7 py-3 text-[14px] font-semibold">See it run in a factory</Link>
        </div>
      </section>

      <section className="border-y border-white/10">
        <div className="mx-auto grid max-w-7xl grid-cols-2 md:grid-cols-4">
          {VALUE.map((v, i) => (
            <div key={v.l} className={`px-5 py-10 ${i ? "md:border-l" : ""} border-white/10`}>
              <div className="text-4xl font-black tracking-tight md:text-6xl">{v.v}</div>
              <div className="mt-2 text-[13px] text-white/60">{v.l}</div>
            </div>
          ))}
        </div>
      </section>

      <section id="how" className="mx-auto max-w-7xl px-5 py-28">
        <Reveal><h2 className="max-w-4xl text-4xl font-extrabold uppercase leading-[0.95] tracking-[-0.03em] md:text-7xl">Banks see a forklift. <span className="text-blue">We see the work.</span></h2></Reveal>
        <div className="mt-16 grid gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/10 md:grid-cols-3">
          {STEPS.map((s, i) => (
            <Reveal key={s.k} delay={i * 100}>
              <div className="group h-full bg-ink p-8 transition-colors hover:bg-white/[0.03]">
                <div className="text-7xl font-black text-white/10 transition-colors group-hover:text-orange">{s.n}</div>
                <div className="mt-6 text-2xl font-bold">{s.k}</div>
                <p className="mt-2 text-[14px] text-white/60">{s.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-20">
          <blockquote className="text-3xl font-bold leading-tight tracking-tight md:text-5xl">&ldquo;Today, banks underwrite a robot like a <span className="text-orange">forklift.</span>&rdquo;</blockquote>
          <p className="mt-3 font-mono text-[11px] text-white/45">Brad Flora, YC Request for Startups, Winter 2027</p>
        </Reveal>
      </section>

      <section id="faq" className="mx-auto max-w-4xl px-5 pb-28">
        <Accordion>{FAQ.map((f) => <AccordionItem key={f.q} title={f.q}>{f.a}</AccordionItem>)}</Accordion>
        <div className="mt-20 flex flex-col items-center gap-5 text-center">
          <h3 className="text-4xl font-black uppercase tracking-[-0.03em] md:text-6xl">Let the robot <span className="text-orange">pay.</span></h3>
          <Link href="/desk" className="btn btn-orange px-7 py-3 text-[14px] font-semibold">Open the live demo</Link>
        </div>
      </section>

      <footer className="border-t border-white/10 px-5 py-8 text-center font-mono text-[10px] text-white/40">
        Built at c0mpiled-18, YC Startup School Hackathon, Taipei &middot; demo fleet telemetry synthetic, labelled &middot; not affiliated with Y Combinator
      </footer>
    </main>
  );
}

# TODO (c0mpiled-18, Taipei, 11 Nov 2026)

All times Taipei. Hacking 18:45 to 22:45. Internal deadline: code freeze 22:00, video uploaded 22:30.

## Before 18:45 (allowed: prep, no code in a repo)
- [ ] Do NOT `git init` or commit before 18:45. First commit after hacking starts.
- [ ] Pick the idea and the name. Check GitHub name is free.
- [ ] Get GMI Cloud key ($20 voucher) and test one call from the laptop. Save it in `.env.local` only, never in chat or git.
- [ ] Get Stripe test keys (dashboard > Developers). Test mode is enough for the demo.
- [ ] Pre-download on good wifi: `npx create-next-app` template, `node_modules` for the libs below, the 3D model file (GLB), fonts.
- [ ] Charge laptops, bring power bank. Phone hotspot as wifi backup.
- [ ] Decide seats (see "Team" below).

## Sponsor stack (use for real, in the core path)
- [ ] **GMI Cloud** is the model layer. OpenAI-compatible client, base URL from their dashboard.
  - [ ] Bake-off: same task on 3 GMI models. Show accuracy, latency, $ per run in a table in the app and README.
  - [ ] Cache GMI responses to a JSON file so the demo still runs if the wifi dies.
  - [ ] Show the model name in the UI ("Classified by <model> on GMI Cloud").
- [ ] **Stripe** proves who pays.
  - [ ] Stripe Checkout (test mode) for the paid tier, e.g. "Compliance report $49" or "$X per SKU per month".
  - [ ] Optional: Stripe usage meter (billing per BOM / per call) if there is time. Payment Link is the 5-minute fallback.
  - [ ] Pricing shown on the landing page. One line in pitch: "We charge $X, Stripe is live in test mode."
  - [ ] Mention Stripe Atlas credit in the "next steps" slide only if true for us.

## Impressive frontend (pick, do not add all)
- [ ] Next.js + Tailwind + **shadcn/ui** as the base (tables, cards, dialogs).
- [ ] **Motion** (framer-motion) for the FAIL to PASS number count-up and swap animation.
- [ ] One hero piece from **Magic UI** or **Aceternity UI** (number ticker, border beam, animated grid). Only one, avoid AI-slop look.
- [ ] **lucide-react** icons, **sonner** toasts, Geist or Inter font.
- [ ] Dark mode, one accent color, no gradients-everywhere.
- [ ] Run the anti-slop check before filming: less text, more whitespace, real data on screen.

## 3D component
- [ ] **react-three-fiber + @react-three/drei** with a GLB model (robot arm, server rack, or chip depending on idea).
- [ ] The 3D must carry meaning, not decoration. Example for Origin: exploded robot, each part colored red (foreign) or green (domestic), parts turn green as swaps are applied.
- [ ] Fallback if time is short: Spline embed, or a three.js example model from the drei/pmndrs market.
- [ ] Keep it under ~5 MB, `<Suspense>` with a static image fallback, test on the demo laptop.

## Numbers (every number sourced, measured, or labelled)
- [ ] Market size slide: bottom-up (customers x price), with source links. See RESEARCH.md.
- [ ] "Why now" slide: 2 to 3 sourced numbers (law deadline, cost drop, adoption).
- [ ] One number we measured tonight (accuracy / cost / latency), with how we measured it.
- [ ] Labels: `[synthetic]`, `[modelled]`, `[target]` on anything not sourced or measured.

## Repo and submission
- [ ] Public GitHub repo, README: one-line pitch, demo GIF, how to run, "What is real, what is simulated" table, GMI bake-off table, team.
- [ ] Repo description, homepage URL, topics.
- [ ] Deploy to Vercel (or run locally and film if wifi is bad).
- [ ] 90 s video on YouTube (unlisted) or Loom. Test the link in an incognito window.
- [ ] Submit before 22:45. Aim 22:30.
- [ ] No em dashes, no emojis, no AI attribution in any file or commit.

## Video (90 s, see VIDEO section in RESEARCH.md)
- [ ] 0 to 10 s: the problem in one sentence + the sourced number.
- [ ] 10 to 60 s: live product, one user, one path, the money moment (FAIL flips to PASS / wifi off / etc).
- [ ] 60 to 75 s: the measured number + GMI + Stripe on screen.
- [ ] 75 to 90 s: who pays, market size, team, closing line.
- [ ] Captions on. Record the screen at 1080p. Record a backup take at 22:00.

## Team
- [ ] Seat 1: frontend + 3D + Stripe.
- [ ] Seat 2: backend + GMI calls + the measured number.
- [ ] Seat 3 (if 3 people): data, README, deck numbers, video script and recording from 21:30.

# Ideas

### Domains: hardware and robotics supply chain, GPU/AI infra, finance for physical assets, government, Taiwan as the world's hardware back office
### Rubric: none published. Proxy = YC lens (problem, who pays, working demo, why now) + 4-hour buildability + GMI in the core path
### Constraint: 4 hours of hacking (18:45 to 22:45), weak wifi, 90 s video

Winter 2027 RFS used: 1 Space access (Gupta), 2 $15-an-Hour Expert (Flora), 3 Robots Made in America (Hu), 4 LLMs That Write Well (Friedman), 5 Plaid for Gov Benefits (Alstromer), 6 Wall Street for the Physical Buildout (Flora), 7 Vertical Foundation Models (Hu), 8 AI for City Hall (Alstromer), 9 Data Center Supply Chain (Friedman), 10 AI for the Air-Gapped Economy (Flora), 11 Own Your Intelligence (Xu).

Taiwan angle: Taiwan builds most of the world's AI servers and many robot parts, so RFS 3, 6, 9 and 10 are where a Taipei team has an unfair advantage and the CDIB, Saphira and Partcl judges live.

| # | Name: hook | RFS | Borrowed from (field / mechanism) | Demo moment | Number we measure | Catch |
|---|-----------|-----|-----------------------------------|-------------|-------------------|-------|
| 1 | !! **Origin**: upload a robot BOM, get its domestic-content %, and the cheapest part swaps to pass | 3 | Customs law / rules of origin and tariff-shift tests | BOM scores 58%, agent swaps 3 parts to Taiwan/US suppliers, flips to PASS | Part-origin classification accuracy on a hand-labelled BOM | Supplier data is seeded; rule details must match the RFS text |
| 2 | !! **Broker**: HS code and duty for any product, for exporters without a licensed customs broker | 2 | Legal precedent / case law retrieval | Paste a product spec, get HS code, duty, cited CBP ruling | Top-1 / top-3 accuracy vs public CBP CROSS rulings | Crowded-ish (tariff tools); needs ruling data offline |
| 3 | !! **Underwrite**: lender for robots, priced from the robot's own telemetry | 6 | Aircraft leasing / residual-value curves | Fleet telemetry in, loan terms and default risk out, a breakdown reprices live | Backtest on synthetic fleet (labelled) | Data is synthetic; close to Zishi |
| 4 | **GPU Put**: put options on GPU-hours for neoclouds | 6 | Electricity forward markets / Black-Scholes | Price a 3-month put on H100 hours, hedge P&L chart | Model price vs historical spot vol | Needs real GPU price history; very abstract demo |
| 5 | !! **Airlock**: frontier-grade answers inside a fab with no internet | 10 | Data diodes / two-person rule, nuclear | Wifi off on stage, model answers from internal SOPs; signed update bundle verified | Small local model vs GMI frontier on our eval: accuracy, latency, cost | GMI is cloud, used only for distillation and evals |
| 6 | !! **Distill**: turn your production failures into a small model you own | 11 | Manufacturing QC / defect feedback loops (kaizen) | Logs in, evals generated, cheap GMI model beats frontier on the task | Accuracy and $ per 1k calls across 3 to 5 GMI models | "Eval tool" is a crowded category |
| 7 | **PermitLint**: ESLint for building permits | 8 | Code linting / static analysis | Upload plan + checklist, get line-level violations with code citations | Catch rate on seeded violations | City Hall will be a popular pick; US code text needed |
| 8 | **311 Voice**: multilingual voice line that files city tickets | 8 | Air traffic control readback | Call a number, report a pothole in Mandarin, ticket appears on a map | Field extraction accuracy | Riviera judges will compare to their product |
| 9 | **Renew**: Medicaid 6-month re-verification done in one consent | 5 | Credit bureau / Plaid tokenised consent | Consent once, renewal form prefilled from sources | Fields auto-filled % | Source APIs all simulated |
| 10 | **Lead Time**: secondary market for transformer and switchgear delivery slots | 9 | Airline slot trading | Buyer with a 3-year wait buys a 6-month slot | Days saved (modelled) | Two-sided market is hard to demo in 4 h |
| 11 | **Steel Radar**: single-plant risk map for data center inputs | 9 | Epidemiology / single point of failure tracing | Pick a data center, see its Bill of Materials collapse to 1 steel mill | Coverage of parts traced | Research-heavy, little product |
| 12 | **Gearbox**: supplier finder for strain-wave gears, encoders, magnets outside China | 3 | Dating apps / two-sided matching | Spec in, ranked Taiwan/US/JP suppliers with lead time | Match precision on a labelled set | Folds into #1 |
| 13 | **CertPack**: auto-assemble UL/CE test evidence from a robot repo | 3 | Software SBOM / supply chain attestations | Repo in, compliance gap report out | Clauses covered | Head-on with Saphira (judges) |
| 14 | **Claims Pro**: insurance claim prep for a non-adjuster | 2 | Triage desks / checklists | Photos + policy in, claim packet out | Packet completeness | Generic |
| 15 | **Billing Coder**: medical billing for uncertified staff | 2 | Spell-check / autocorrect | Visit note in, CPT codes with reasons | Accuracy on public samples | Many teams do this |
| 16 | **FabCast**: tiny time-series model for fab power and tool load | 7 | Weather forecasting ensembles | Beats a general LLM on forecast error with 1% compute | MAE vs baseline on public Taipower data | Data access on bad wifi |
| 17 | **Voice Keeper**: keep a writer's style when an LLM edits | 4 | Forensic stylometry | Edit a paragraph, drift score stays green | Stylometric distance before vs after | Soft for this panel |
| 18 | **Orbit Ledger**: business-case calculator at 100x cheaper launch | 1 | Real options valuation | Slider on $/kg, see which businesses turn positive | n/a | Not a product in 4 h |
| 19 | **Robot ABS**: pool robot earnings into tranches investors can buy | 6 | Mortgage securitisation | Waterfall chart when 10% of robots fail | Tranche loss under stress (modelled) | Abstract, all modelled |
| 20 | **Migrant Paperwork**: visa and work permit forms for foreign workers in Taiwan | 2 | Tax prep software (TurboTax interview) | Interview in Bahasa, filled form out | Fields correct on samples | Need official form specs |
| 21 | **Meeting to BOM**: supplier call notes become BOM changes and PO drafts | 3 | Circleback-style action extraction | Call transcript in, BOM diff out | Actions extracted correctly | Thin on its own |
| 22 | **Spot Router**: route inference across GMI models by cost and accuracy per task | 11 | Market order routing (best execution) | Same task, 60% cheaper, same accuracy | $ and accuracy per route | Infra feel; folds into #6 |

## Merges worth making
- **1 + 12 + 21 = Origin**: compliance score plus the supplier swap engine. Score explains the problem, swap is the money shot.
- **5 + 6 = Airlock**: distil on GMI, ship the small model offline. One product, both RFS 10 and 11.
- **3 + 19**: underwrite single robots now, tranches later as the startup line.

## Rejected (do not revive)
| Idea | Why |
|------|-----|
| 18 Orbit Ledger | Not a product, nothing to demo |
| 17 Voice Keeper | Weak fit for this panel |
| 13 CertPack | Competes with two judges' own company |
| 10 Lead Time | Needs two sides to demo |

## Round 2 (after judge and market research, see RESEARCH.md)
Filter used: big pool of paying customers, a real action (not a chart, per Boris Jabes), hits 3+ judges, Taiwan edge, buildable in 4 h. Unsourced numbers are labelled.

| # | Name: hook | RFS | Borrowed from (field / mechanism) | Demo moment | Who pays, how | Judges hit | Catch |
|---|-----------|-----|-----------------------------------|-------------|---------------|-----------|-------|
| 23 | !! **Dock Voice**: an agent that phones your suppliers in Mandarin/Japanese, chases PO status and lead times, and writes the answers into your ERP | 3, 9 | Debt collection call scripts (Domu) + air traffic readback | Live call on speaker to a "supplier" (teammate), lead time lands in the PO table, late order flagged red | Hardware companies, per call or per seat `[target]` | Riviera, Domu, Circleback, Boris, GMI (TTS) | Voice latency on bad wifi; record a backup |
| 24 | !! **Quote Drop**: drop a CAD file, get a machining quote in 1 minute from US/Taiwan job shops | 3 | Instant insurance quotes / Xometry-style pricing | STEP file in, 3D part spins, cost breakdown and 3 shop quotes, Stripe deposit | Job shops pay per qualified RFQ, or take rate on orders | Saphira, Partcl, CDIB, Sina | Geometry cost model is a heuristic, label it `[modelled]` |
| 25 | !! **Tariff Engineering**: legally change how a product is built or described so it pays less duty | 2 | Tax optimisation; the Converse felt-sole sneaker case | BOM in, agent finds a 2-line change that moves HS code, duty drops, cited ruling | % of duty saved | Domu, Boris, CDIB | Needs careful legal wording, "suggestions for your broker" |
| 26 | !! **Rulewatch**: Dependabot for trade rules. When a rule changes, it finds every affected SKU and opens a fix | 3, 2 | Software CVE alerts / Dependabot PRs | Paste the FCC notice, 14 of 200 SKUs light up, each gets a fix ticket | SaaS per SKU tracked | Boris (data to action), Saphira, s2 (event stream), Circleback | Needs the Origin engine underneath; fold in |
| 27 | **Robot Passport**: a scannable record of a robot's origin, parts and safety tests | 3, 6 | Aircraft logbooks / Carfax | Scan QR, see origin %, safety tests, ownership history | Makers per unit; lenders and insurers per lookup | Saphira, CDIB | Network effect needed; demo is mostly a page |
| 28 | !! **GPU Pawnshop**: instant loans against GPU clusters, priced from live use and spot prices | 6 | Pawn shops + margin calls in futures | Cluster telemetry in, loan offer out; utilisation drops, margin call fires | Neoclouds borrow; we earn spread `[modelled]` | SF Tensor, CDIB, Traverse, GMI | Data `[synthetic]`; close to "Underwrite" |
| 29 | **Grant Hunter**: finds US federal and state incentives for Taiwan firms opening US plants, fee on success | 3 | R&D tax credit firms that charge a % of the credit | Company profile in, $ of incentives found with source links, application drafted | Contingency fee | CDIB, Domu | Incentive data must be real; hard in 4 h offline |
| 30 | **Power Match**: matches data center builders with sites that already have grid power | 9 | Real estate brokerage + airline slot trading | Pick MW and region, ranked sites with queue wait time | Broker fee on deal | SF Tensor, CDIB | Needs real interconnection queue data |
| 31 | **Shift Handover**: fab technicians speak the handover in Mandarin, offline model writes the structured log | 10 | Hospital shift handover (SBAR) | Wifi off, voice note in, structured log out, next shift sees open issues | Fabs per site | Traverse, GMI, s2, Saphira | Folds into Airlock |
| 32 | **Tech Copilot**: hands-free repair guide for robot technicians without certification | 2, 3 | Pilot checklists | Technician asks "error E42 on joint 3", gets step list from the manual with page cites | Robot makers bundle it; per tech seat | Saphira, Riviera, GMI | Generic RAG feel unless very specific |
| 33 | **Magnet Swap**: finds non-China substitutes for rare-earth magnets and motors in a design | 3 | Drug substitution lists in pharmacies | Motor spec in, 3 non-China options with performance delta | Robot makers per design | Saphira, Partcl, CDIB | RFS says China makes 94% of sintered magnets; few alternatives exist, so honest results may be thin |
| 34 | **Agent Storefront**: makes a factory catalog buyable by AI purchasing agents, paid via Stripe | none direct | Bloomberg terminal order entry | An agent asks for 500 encoders, gets a quote, pays via Stripe | Take rate | Stripe, Boris, Swerdlow | Weak RFS fit; best as a layer on Origin or Quote Drop |
| 35 | **Readback**: call recording to verified action list, with each action confirmed back to the speaker by SMS | 2 | Air traffic control readback | Call ends, 3 actions texted back, one corrected by reply | SMB per seat | Circleback, Riviera, Domu | Head-on with Circleback judges |
| 36 | **Robot Lease Desk**: lease a robot by the hour with Stripe metered billing, priced from uptime | 6 | Car-sharing per-minute billing | Robot telemetry ticks, Stripe meter bills live, downtime auto-credits | Robot fleet owners; % of lease | CDIB, Domu, Stripe | Telemetry `[synthetic]` |

## Merges worth making (round 2)
- **Origin + Rulewatch + Tariff Engineering + Agent Storefront = Origin**: "rule changed" event, affected SKUs found, swaps or legal redesign proposed, buy the swap via Stripe. One product, every step a real action.
- **Dock Voice + Origin**: when Origin proposes a swap, Dock Voice calls the Taiwan supplier to confirm price and lead time live. The voice call is the demo moment.
- **Quote Drop** stands alone and has the most natural 3D (the part itself).

## Round 2 picks
| Pick | Why | Risk |
|------|-----|------|
| **Origin + Dock Voice call** | Best why-now (FCC Jul 2026), 3D robot, plus a live phone call to a supplier: action + voice hits 8+ judges | Scope: cut the call to a recorded fallback if latency is bad |
| **Quote Drop** | Huge customer pool (every hardware startup orders parts), 3D is the product, Stripe deposit is natural | Pricing model is a heuristic, must be labelled |
| **Dock Voice alone** | Simplest to make impressive; clear buyer (ops teams chasing suppliers) | Riviera/Domu judges know voice deeply and will compare |

## Round 3: outside the box, back to the RFS text (checked 2026-11-11)
Method: take one exact line from each RFS and flip the obvious answer.

### !! Headroom: "The fastest transformer to deliver is the one you already own" (RFS 9 + 6 + 7)
- **RFS line (Friedman):** large power transformers have a three-year lead time; switchgear, breakers and cooling are sold out.
- **Flip:** everyone tries to build more transformers. We unlock safe extra capacity in the ones already installed, and move GPU jobs when the transformer runs hot.
- **How:** IEEE C57.91 lets transformers run above nameplate depending on hot-spot temperature: 110 C = normal life, ~140 C long-time emergency. Insulation aging factor F_AA = exp(15000/383 - 15000/(theta_H + 273)), ~17x at 140 C ([arXiv](https://arxiv.org/pdf/1909.06996); check the standard's tables). We treat insulation life as a budget: spend it when GPUs earn the most, save it when they do not.
- **Pipeline it fixes:** time-to-power wait, transformer shortage, idle GPU capex, grid stress, operator risk (loss-of-life is tracked, not guessed).
- **Numbers:**
  - Power transformers average 128 weeks lead time, range 80 to 210, 30% supply shortfall in 2025 ([Wood Mackenzie](https://www.woodmac.com/news/opinion/supply-shortages-and-an-inflexible-market-give-rise-to-high-power-transformer-lead-times/)). Prices up to 5 to 6x in 2 years for distribution transformers ([NREL via Utility Dive](https://www.utilitydive.com/news/electric-transformer-shortage-nrel-niac/738947/)).
  - US time to power ~4 years average, ~7 years in Northern Virginia for 100 MW (JLL, via [Network World](https://www.networkworld.com/article/4117329/google-warns-transmission-delays-are-now-the-biggest-threat-to-data-center-expansion.html)).
  - Data centers 415 TWh in 2024, 945 TWh in 2030 ([IEA](https://www.iea.org/reports/energy-and-ai/executive-summary)).
  - The same trick on power lines (dynamic line rating) adds 10 to 30% capacity at under 5% of the cost of rebuilding ([DOE Liftoff via Utility Dive](https://www.utilitydive.com/news/advanced-grid-technologies-gets-doe-liftoff-report-aes-linevision/713291/)). FERC Order 881 made ambient-adjusted line ratings mandatory (deadlines 2025 to 2028, [FERC](https://ferc.gov/news-events/news/commissioner-rosners-concurrence-order-granting-extension-time-re-miso-inc-under)).
  - Building transformers averaged 16% load in one study ([ACEEE 2000](https://www.aceee.org/files/proceedings/2000/data/papers/SS00_Panel1_Paper13.pdf)); utilities report 45 to 55% peak ([NREL 2025](https://nrel.gov/docs/fy25osti/92076.pdf)).
- **Taiwan:** Taipower stopped approving new data centers over 5 MW north of Taoyuan from Sep 2023 ([Bloomberg](https://www.bloomberg.com/news/articles/2024-08-12/taiwan-says-power-issues-prevent-new-large-data-centers-in-north)), conditionally eased around Jul 2026 ([Taipei Times](https://taipeitimes.com/News/editorials/archives/2026/08/12/2003862328)). Reserve margin projected 11.3 to 14.2%, under the 15% legal target ([Taipei Times](https://www.taipeitimes.com/News/editorials/archives/2025/10/01/2003844697)).
- **Competition:** Emerald AI throttles GPU jobs on grid signals, raised a reported $150M Series A at $1.05B ([TNW](https://thenextweb.com/news/emerald-ai-150m-funding-data-centre-grid-flexibility)): proves the market, but it does not model transformer heat. Camus Energy gives data centers an operating envelope from grid limits. Transformer monitors (Hitachi TXpert, Camlin) monitor, do not schedule compute. **No one found combining C57.91 hot-spot and loss-of-life with GPU scheduling.**
- **Demo:** photo of a transformer nameplate, GMI vision reads the ratings; 3D transformer with live hot-spot heat map; forecast tonight from real Taipei weather + public GPU cluster trace; "+X% safe headroom tonight" `[modelled from real equations]`; temperature climbs, agent pauses 2 training jobs, hot-spot drops, loss-of-life meter stays in budget; Stripe: sell the unlocked MW-hours as capacity.
- **Measured:** forecast error (ours vs naive), hot-spot model vs the IEEE worked example, headroom found on the public trace.
- **Judges:** SF Tensor (compute follows power), Partcl (physics, benchmarks), Traverse (small vertical model), Saphira (safety limits as code), CDIB (infra money), GMI. Weaker for voice/meeting judges.
- **Catch:** GMI is not central (vision + agent + explanations only). All site data is public or modelled; say so.

### Taiwan already built Plaid for government (RFS 5)
- **RFS line (Alstromer):** "AI can now forge a pay stub in seconds." Medicaid re-checks every six months from 2027.
- **Flip:** Taiwan's MyData does consented sharing of government records: launched Apr 2021, 143 data types, 915 online services, 1.401M members, 6.808M uses by Oct 2025 ([CTEE](https://www.ctee.com.tw/news/20251113701185-430104)). We bring the proven model to US states.
- **US today:** no single equivalent; IRS IVES via Form 4506-C, Login.gov (login only), payroll APIs Truv, Argyle, Pinwheel.
- **Demo:** AI-forged pay stub caught live, one consent fills a Medicaid renewal.
- **Catch:** payroll-data players own half of it; selling to states is slow.

### Readers as the reward signal (RFS 4)
- **RFS line (Friedman):** "The same reward signals that make models good at code actively flatten voice and style."
- **Flip:** train on where real readers stop reading, not on graders. Weak for this panel.

### Credential leverage (RFS 2)
- **RFS line (Flora):** "Anywhere a credential is the bottleneck, this model works."
- **Flip:** one licensed expert signs off 50x more cases; $15/h operators do the work, AI flags only the risky ones. Sell signatures per hour.

### Urban magnet mining (RFS 3)
- **RFS line (Hu):** China made 94% of sintered magnets; automakers cut production after Apr 2025 export limits.
- **Flip:** photo of e-waste, identify magnet grade and value, feed a recovered-magnet marketplace. Small software surface.

## Round 4: further out of the box (numbers not yet verified unless linked)
| # | Name: hook | RFS | Borrowed from | Demo moment | Catch |
|---|-----------|-----|---------------|-------------|-------|
| 37 | !! **Pulse**: one foundation model for machine health; any motor, any robot, predicts failure zero-shot from current/vibration, outputs "fails in N days, p=0.8" | 7 Vertical Foundation Models (Hu), feeds 6 | TimesFM-style forecasting + ECG arrhythmia detection | Public bearing/motor dataset, model flags failure days ahead on a machine it never saw | Training a real foundation model is not a 4 h job; tonight = small model + public dataset, honest |
| 38 | !! **Factory-hour futures**: buy CNC / SMT line hours in Taiwan factories months ahead, like electricity forwards | 6 Wall Street (Flora), 3 | Electricity forward markets, airline seat revenue management | Robot startup locks 400 machine-hours for Q2, price curve moves as capacity fills | Two-sided market; supply side `[synthetic]` |
| 39 | !! **Quake cover**: parametric insurance for fabs, data centers and robot fleets, paid out in minutes from seismic data | 6 Wall Street (Flora: "hedges") | Parametric catastrophe bonds, crop weather insurance | Replay a real Taiwan quake feed, policy triggers, Stripe payout lands | Needs a reinsurer later; verify Hualien Apr 2024 impact before citing |
| 40 | **Kg-to-orbit exchange**: price and trade launch capacity when Starship makes it a commodity | 1 Space (Gupta), 6 | Freight forwarding (Freightos), container rate indexes | Order book for kg to LEO, price curve as reuse scales | Market is years away; Gupta asks for exactly "business models that don't work today" |
| 41 | **Remote shop floor**: US robot cells run by remote operators anywhere, paid per task, data reused to train the robots | 2 $15 Expert, 3 Robots | Call-center BPO + air traffic control | Operator in Taipei takes over a stuck robot in a US cell (simulated), robot learns the fix | Policy-sensitive ("made in America" run from abroad); needs a sim |

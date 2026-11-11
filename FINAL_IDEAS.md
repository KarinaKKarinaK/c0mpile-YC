# Final ideas

## What the field is missing
230 people, 4 hours. Most teams will pick City Hall, the $15 expert, or a generic agent. Few will use Taiwan's real edge: it is the hardware supply chain the RFS keeps pointing at (robots, data centers, air-gapped fabs). A Taipei team building for that wins the "why you" question.

## Scoring (1 to 5, proxy rubric)
| Criterion | Origin (#1) | Airlock (#5+6) | Broker (#2) | Underwrite (#3) |
|-----------|-------------|----------------|-------------|-----------------|
| RFS fit, quotable | 5 (RFS 3 cites the 65% to 75% domestic rule) | 5 (RFS 10 + 11) | 5 (RFS 2) | 4 (RFS 6) |
| Who pays, clear | 5 (US robot makers, must comply by 2029) | 4 (fabs, banks, defense) | 4 (SME exporters) | 4 (lenders) |
| Taiwan "why us" | 5 | 5 (TSMC-style fabs) | 3 | 3 |
| Judge pull | 5 (Saphira x2, Partcl, CDIB) | 4 (Traverse, SF Tensor, GMI) | 3 | 4 (CDIB) |
| Demo moment | 5 (FAIL flips to PASS) | 5 (wifi off on stage) | 4 | 3 |
| Real measured number | 4 | 5 | 5 | 2 (synthetic) |
| GMI in core path | 4 | 5 | 4 | 3 |
| Buildable in 4 h | 4 | 3 | 5 | 4 |
| **Total /40** | **37** | **36** | **33** | **27** |

## Top 3

### 1. Origin (recommended)
- **One line:** Upload a robot's bill of materials, see whether it meets the US domestic-content rule, and get the cheapest part swaps to pass.
- **RFS anchor:** Robots Made in America (Diana Hu): more than 65% of component cost domestic, rising to 75% in 2029. Quote the RFS line exactly on slide 1.
- **Demo path (one user, one moment):** robot startup uploads BOM CSV, GMI model classifies each part (category, likely origin, cost share), score shows 58% FAIL, agent proposes 3 swaps from a supplier table (Taiwan/US/JP), score flips to 67% PASS, export a compliance memo.
- **Depth:** rules-of-origin engine is deterministic code (decisions are code, LLM only classifies); swap search as a small knapsack (min cost delta subject to domestic % >= threshold); GMI model bake-off for classification with accuracy, latency, $ per BOM.
- **Measure tonight:** classification accuracy on a hand-labelled 40-part BOM across 3 GMI models.
- **Honest labels:** supplier table and prices `[synthetic]` unless sourced; rule threshold sourced to the RFS.
- **Startup line:** SaaS per SKU for robot makers; later, a marketplace fee on swapped parts. Taiwan suppliers are the supply side.
- **Risk:** "domestic" in the rule likely means US, so Taiwan parts do not count as domestic. Frame Taiwan as the "trusted, non-China" bridge and the place that builds US lines. Check the rule wording before pitching.

### 2. Airlock
- **One line:** Frontier-quality answers inside a network that never touches the internet.
- **Demo:** use GMI frontier models to generate evals and training pairs from a fab SOP pack, pick the best small open model, run it on the laptop with wifi off, show the eval table (small local vs frontier) and a signed offline update bundle.
- **Measure:** accuracy, latency and $ per 1k answers, local vs GMI frontier.
- **Bonus:** the venue wifi is weak; our demo needs none.
- **Risk:** fine-tuning in 4 h is too much. Use retrieval + prompt distillation, call it that honestly. Pre-download the model weights before 18:45.

### 3. Broker (safe fallback)
- **One line:** A customs broker in your browser: HS code, duty and the CBP ruling that backs it.
- **Measure:** top-1 and top-3 accuracy on 50 public CBP CROSS rulings.
- **Why fallback:** simplest build, strongest number, weakest Taiwan story.

## Layers for whichever we pick
- GMI model bake-off table (3 models, accuracy, latency, cost) = real number + sponsor in core path.
- Stripe checkout for "Pro report" = proves who pays, uses the second sponsor in 10 minutes.
- Live progress stream of agent steps (s2.dev judge will notice).
- "What is real, what is simulated" table in README and the video.

## Must ship no matter what
- First commit after 18:45. Public GitHub repo, README, 90 s video uploaded before 22:45.
- One end-to-end path that works on the laptop offline-safe (cache GMI responses for the demo).
- Every number sourced, measured or labelled.

## Recommendation
Origin. Best RFS quote, three hardware judges plus CDIB, and a FAIL to PASS moment anyone remembers. Airlock if the team is stronger on models than product.

## Combined pick (round 3): Origin, the "Made in USA" fixer for robots
Merges #1 Origin, #12 Gearbox, #23 Dock Voice, #26 Rulewatch, #25 Tariff Engineering, #34 Agent Storefront, #27 Robot Passport.

**One line:** When a rule changes, Origin shows robot makers which of their robots can no longer be sold in the US, finds the cheapest parts to swap, calls the supplier to confirm, and lets them buy the swap.

### The loop (every step is a real action, not a chart)
| Step | Came from | What happens on screen | Real or simulated |
|------|-----------|------------------------|-------------------|
| 1. Rule fires | Rulewatch | Paste the FCC notice. Agent extracts the rule: 65% domestic by cost, 75% in 2029 | Real (GMI extraction of the real notice) |
| 2. Score | Origin | BOM CSV in, GMI classifies each part's origin and cost share, deterministic code scores it: 58% FAIL | Real model, BOM `[synthetic]` |
| 3. See it | 3D | Exploded robot arm, parts red (foreign) or green (US), sized by cost | Real |
| 4. Fix | Gearbox + Tariff Eng. | Optimiser picks the cheapest set of swaps to pass (min cost subject to domestic % >= 65%) | Real code, supplier table `[synthetic]` |
| 5. Confirm | Dock Voice | Agent phones the supplier (teammate on speaker), asks price and lead time in Mandarin, writes answer into the table | Real call via GMI TTS/STT; recorded fallback |
| 6. Buy | Storefront | "Order swap parts" Stripe Checkout (test mode), deposit paid | Real Stripe test mode |
| 7. Prove | Passport | Compliance memo / passport page with QR: 67% PASS, every part cited | Real, generated |

### Why the merge is stronger than any single idea
- **One story, start to finish:** rule changes > you fail > here is the fix > it is confirmed > it is bought > here is the proof. Judges see a whole job done, not a feature.
- **Hits almost every judge:** Saphira (compliance), Partcl (hardware), Riviera/Domu (voice that completes a task), Circleback (action after the conversation), s2 (event log of each step), Freestyle (agent acts), CDIB (two-sided money, Taiwan), GMI (LLM + speech + 3D), Boris (data drives an action), Sina (polish).
- **Two ways to make money:** robot makers pay per SKU per year `[target: $30k]`; suppliers pay a take rate on swapped parts orders `[target: 3 to 5%]` via Stripe Connect later. Robot makers are the demand side, Taiwan suppliers with US lines are the supply side.
- **Why now:** FCC Covered List, 28 Jul 2026. 65% now, 75% in 2029. China makes 94% of sintered magnets (RFS). Sources in RESEARCH.md.
- **Why us (Taipei):** Taiwan builds >90% of AI servers and is where the robot parts suppliers are. We can call them in Mandarin. Careful: Taiwan-made parts are not US-domestic; the pitch is Taiwan suppliers opening US lines.

### Scope for 4 hours (descope ladder, cut from the bottom)
| Priority | Piece | Seat | Est. |
|----------|-------|------|------|
| Must | BOM upload, GMI classify, score, optimiser swaps, FAIL to PASS | Backend | 1.5 h |
| Must | UI with score counter and swap table (shadcn + Motion) | Frontend | 1 h |
| Must | Stripe Checkout test mode | Frontend | 20 min |
| Must | GMI 3-model bake-off number (accuracy, latency, $ per BOM) | Backend | 30 min |
| Should | 3D exploded robot, red/green parts (r3f + drei) | Frontend | 1 h |
| Should | Rule extraction from pasted FCC notice | Backend | 20 min |
| Nice | Live supplier call (Dock Voice). Fallback: pre-recorded clip in the video | Seat 3 | 45 min |
| Nice | Passport page with QR | Frontend | 20 min |
| Cut first | Tariff engineering suggestions (mention as roadmap only) | none | 0 |

### 90 s video beats
1. 0 to 8 s: "Since July, the US blocks new foreign-made robots. Origin tells you if yours can still be sold, and fixes it."
2. 8 to 20 s: paste FCC notice, rule extracted, BOM scored, 3D robot mostly red, 58% FAIL.
3. 20 to 45 s: swaps proposed, phone call to the supplier confirms price in Mandarin, parts turn green, 67% PASS.
4. 45 to 55 s: Stripe checkout for the parts, passport page with QR.
5. 55 to 70 s: bake-off table (measured tonight), "what is real / simulated" for 2 s.
6. 70 to 90 s: who pays (both sides), market, team on camera, closing line.

### Name check (lock before 18:45)
"Origin" is common and hard to search. Options: **Onshore**, **Homeport**, **Sourced**, **Passport**. Check GitHub and a Vercel alias.

### Backup combo
**Quote Drop + Dock Voice** = "procurement agent for hardware startups": CAD in, quotes from shops, agent calls the shop to confirm, Stripe deposit. Use it if the team prefers a broader customer pool over the regulation story.

## Round 4: bigger swings
Honest critique of Origin: a compliance feature with a small customer count (US robot makers), and it sits next to Saphira's own product. YC would ask "how big can this get?" and the answer is "a few hundred customers." Fine demo, not a breakthrough.

The question behind the RFS list: America is spending to rebuild factories (RFS 3, 6, 9), but **reshoring fails on know-how, not money.** The people who know how to run fabs, robot lines and server assembly are mostly in Taiwan, and they are retiring or will not move. Numbers marked (verify) are being checked.

### 1. !! Shifu (師傅, "master craftsman"): bottle Taiwan's factory know-how and ship it to every new US plant
- **One line:** A senior Taiwan engineer explains a procedure once, in Mandarin. Shifu turns it into a voice expert that coaches a US technician through it in English, checks each step from a photo, and runs offline on the factory floor.
- **Why it is a breakthrough:** it hits 5 RFS items at once. $15-an-hour Expert (a new technician does expert work), Robots Made in America (the people side), Air-Gapped Economy (fabs are offline), Own Your Intelligence (the factory owns its model), Vertical Foundation Models (the procedure data becomes a manufacturing model). Every captured procedure makes the product better: a data moat nobody else in this room can build, because the experts are here.
- **Why now (all sourced):**
  - Jul 2023: TSMC delayed Arizona citing "an insufficient amount of skilled workers" and said it would send Taiwan technicians to train locals ([Fortune](https://fortune.com/2023/07/21/tsmc-complains-cant-find-enough-skilled-workers-arizona-chip-plants-ready-delay-mass-production-2025/)). In 2025 the non-US Arizona staff was mostly Taiwanese on temporary training stints ([Axios](https://www.axios.com/local/phoenix/2025/05/06/tsmc-culture-arizona-expansion)).
  - Jan 2026: US-Taiwan deal, Taiwan firms to invest at least $250B in the US ([Manufacturing.net](https://www.manufacturing.net/trade/news/22958644/us-taiwan-sign-250b-trade-deal)). TSMC alone $165B in Arizona ([InBusiness](https://inbusinessphx.com/technology-innovation/tsmc-intends-to-expand-its-investment-in-the-u-s-to-165-billion-to-power-the-future-of-ai)). $640B+ announced US chip supply-chain investment ([SIA](https://www.semiconductors.org/?p=26330)).
  - US manufacturing needs up to 3.8M workers by 2033, 1.9M may go unfilled ([Deloitte](https://www2.deloitte.com/us/en/pages/about-deloitte/articles/press-releases/us-manufacturing-could-need-new-employees-by-2033.html)). 25.2% of manufacturing workers are 55+ (BLS via [Reliable Plant](https://reliamag.com/topics/articles/cost-of-lost-plant-knowledge)).
  - Hook line: "Taiwan is sending $250B to America. The know-how is still in Taipei."
- **Who pays:** companies opening US plants pay per site per year `[target]`. Taiwan engineers earn a royalty each time their procedure is used: experts become the supply side. That is the creative twist: **a marketplace for tacit knowledge.**
- **Demo:** (1) play a 30 s Mandarin clip of a "senior engineer" (teammate) explaining a procedure, (2) GMI speech-to-text + LLM builds a bilingual step list with hard safety checks (torque values, PPE) as code, (3) 3D model of the machine highlights the part for the current step, (4) "US technician" asks by voice in English, gets the answer, (5) uploads a photo, vision model says "step 4 not done: connector not seated", (6) turn wifi off, small model still answers, (7) Stripe checkout for a site license, royalty ledger shows the engineer earned $X.
- **Measured tonight:** accuracy on 30 Q&A pairs, small offline model vs GMI frontier, plus cost per answer.
- **Judges hit:** Saphira (safety-checked procedures), Traverse (own model), GMI (speech, vision, LLM, 3D), Riviera (voice that does a job), Circleback (talk becomes action), s2 (step log), CDIB (Taiwan at the center), Boris (expert data becomes action), Sina (polish). Almost every judge.
- **Catch:** "knowledge base for factories" tools exist (connected-worker software). Our edge: cross-language capture from the source country, offline, photo-verified, and royalties for experts. Must keep the demo to ONE procedure.

### 2. !! Fabless for everything: Taiwan's factories as an API for hardware startups
- **One line:** Nvidia never built a fab because TSMC made "fabless" possible. We do the same for robots and hardware: send a CAD file and BOM, agents split it across Taiwan shops, call them in Mandarin for quotes, and handle payment, quality and shipping.
- **Why big:** electronics manufacturing services $648.5B in 2025 ([MarketsandMarkets](https://www.marketsandmarkets.com/Market-Reports/electronics-manufacturing-services-market-123721672.html)). Xometry did $686.6M revenue in 2025, +26% ([results](https://www.manilatimes.net/2026/02/24/tmt-newswire/globenewswire/xometry-reports-record-fourth-quarter-and-strong-full-year-2025-results/2283753)). Agents remove the human sourcing team that made this unprofitable.
- **Demo:** CAD + BOM in, 3D part explodes into sub-parts, each routed to a shop, agent call confirms one quote, Stripe deposit.
- **Catch:** marketplaces are hard to show with one side; Xometry exists. Less RFS-quotable than Shifu.

### 3. !! Plaid for machines: make physical assets readable so money can flow to them
- **One line:** Lenders cannot lend against robots and GPUs they cannot see. We give each machine a consented, verified data feed (uptime, output, location) that a bank can underwrite in one API call.
- **Why big:** RFS 6 (Wall Street for the Physical Buildout) needs this layer first. Boris Jabes built data pipes into business tools (Census), so this is his language.
- **Demo:** connect a robot fleet `[synthetic telemetry]`, verified "machine statement", lender gets a loan offer, uptime drops, offer reprices live.
- **Catch:** all data synthetic; close to Zishi.

### Verdict
| | Shifu | Fabless | Plaid for machines | Origin (combined) |
|-|-------|---------|--------------------|-------------------|
| How big it could get | 5 | 5 | 5 | 3 |
| RFS fit (items hit) | 5 (five items) | 3 | 4 | 4 |
| Taiwan "why us" | 5 | 5 | 3 | 4 |
| Judge pull | 5 | 4 | 4 | 5 |
| Demo moment | 5 (photo check + wifi off) | 4 | 4 | 5 |
| Real data tonight | 4 | 3 | 2 | 3 |
| Buildable in 4 h | 4 | 3 | 4 | 4 |
| **Total /35** | **33** | **27** | **26** | **28** |

**Recommendation: Shifu.** It is the only idea where the answer to "why you, why Taipei" is the product itself. Origin can be a later feature (compliance is one procedure among many).

## Round 5: Manifest, one verified shipment record that fixes the export pipeline and pays exporters on day 1
Brief: huge market, not done before, fixes more than one problem in a pipeline.

**One line:** Exporters drop in their messy shipping documents. Manifest checks them, classifies and clears the goods, and pays the exporter today instead of in 48 to 60 days.

**Insight:** the data that proves a shipment is compliant is the same data that proves it is safe to finance. Today 5 parties retype it. We build it once, verify it, and reuse it.

### The pipeline we fix
| Step | Today | Manifest |
|------|-------|----------|
| 1. Documents | "Up to 27 documents" and "up to 30 stakeholders" per transaction ([ICC Academy](https://icc.academy/?p=22160)) | GMI reads invoice, packing list, spec photo; cross-checks them |
| 2. HS code + duty | Broker; misclassification penalty up to 2x lost duty or 20% of value (19 USC 1592) | Classified with cited CBP ruling |
| 3. Origin / rules | Consultant (FCC robot rule, tariffs) | Origin engine scores domestic % |
| 4. Customs pack | Broker retypes the same data | Generated from the verified record |
| 5. Getting paid | Asia B2B: 48-day average terms, 54% of sales on credit ([Atradius 2025](https://www.malaymail.com/news/money/mediaoutreach/2025/08/11/asian-firms-divided-on-insolvency-outlook-amid-ongoing-trade-challenges/400990)) | "Get paid today" offer |
| 6. Financing | $2.5T trade finance gap, ~10% of world trade; SMEs rejected 41% of the time ([ADB via The Star](https://www.thestar.com.my/business/business-news/2026/01/15/global-trade-finance-gap-at-25-trillion-as-global-trade-tensions-rise-adb-says), verify 41% in ADB report) | Priced from verified data |

### Numbers
- World trade $33T in 2024, record ([UNCTAD](https://unctad.org/news/global-trade-hits-record-33-trillion-2024-driven-services-and-developing-economies)).
- Trade finance gap $2.5T (ADB 2025 survey, above).
- Taiwan exports US$640.75B in 2025 (+34.9%); to the US US$198.27B (+78%), the US is Taiwan's top market for the first time in 26 years ([Focus Taiwan](https://focustaiwan.tw/business/202601090021)).
- Bottom-up beachhead `[modelled]`: Taiwan to US exports $198B x 5% handled by SMEs we can reach x 1.5% fee = ~$150M revenue. Global: 1.5% on a slice of the $2.5T gap = tens of billions of fee pool.
- Paper: ~4 billion paper trade documents in circulation at any time ([ICC DSI](https://dsi.iccwbo.org/)).

### Has it been done? (checked 2026-11-11)
| Company | Docs | HS/duty | Origin/compliance | Pays exporter early |
|---------|------|---------|-------------------|---------------------|
| Flexport | | yes | yes | no (finances importers' freight/duty) |
| Drip Capital | internal only | | | yes |
| Zonos, Avalara | | yes | partly | |
| Gaia Dynamics | | yes | yes | |
| Passage (YC S24) | yes | yes | | |
| Trava (YC W25), Tarifflo (YC S26) | | yes | yes | |
| ECSA (YC S22) | ? | ? | yes | yes (credit) |
| Stenn | | | | collapsed Dec 2024 ([GTR](https://www.gtreview.com/news/europe/stenn-goes-into-administration-following-hsbc-application/)) |
**Nobody found doing all four in one product.** ECSA is closest; study it before pitching. Lesson from Stenn: trade finance dies on unverifiable invoices, which is exactly what our cross-checking fixes (check the exact cause of Stenn's collapse before saying this on stage).

### Demo (4 h)
1. Taiwan SME uploads invoice photo, packing list, spec sheet `[synthetic docs, real formats]`.
2. GMI vision + LLM extracts; deterministic cross-check flags "packing list 500 units, invoice 50". Fixed.
3. HS code + duty with cited ruling; origin % for a robot part (Origin engine).
4. Customs pack generated (PDF).
5. Verification score, then "Get paid today: $48,500 now, fee 1.5%" `[modelled pricing]`, accept, Stripe test payout / checkout.
6. 3D: container on a globe arc from Kaohsiung to Long Beach, contents ticking green as checks pass.
7. Measured: extraction field accuracy on 20 docs, catch rate on 10 planted errors, HS top-1 on 30 CROSS rulings, cost per shipment across 3 GMI models.

### Judges
Domu (finance ops, collections), CDIB (trade finance, Taiwan), Boris (one source of truth driving actions: his Census quote), Circleback/Freestyle (agent acts), s2 (event log per shipment), GMI (vision + LLM), Saphira (compliance), Stripe on stage. Weaker for Partcl/SF Tensor.

### Risks
- Two-product feel (compliance + lending). Pitch it as ONE record, finance is the business model.
- Lending needs capital and licenses later; tonight it is a priced offer, labelled.
- Customs space has 5+ YC companies; our wedge is the exporter side and getting paid.

## Round 6: Headroom (expanded), run infrastructure at its real limit, not its nameplate
**Line:** "Every grid asset is rated for the worst day of the year. We run it for today."
**Pitch:** The AI buildout is blocked by transformers that take years to arrive. We find the capacity hiding in the ones already installed: data centers first, then every substation.

### RFS fit
| RFS | Fit |
|-----|-----|
| **9 Data Center Supply Chain (Friedman), primary** | Capacity without waiting 128 weeks for a new transformer |
| 7 Vertical Foundation Models (Hu) | Energy is named; one small model across asset types gives "a typed decision and a probability" (+X MW safe, Y% risk) |
| 6 Wall Street for the Physical Buildout (Flora) | Sell and back the unlocked capacity; nobody insures above-nameplate loading today (searched, not found) |
| 10 AI for the Air-Gapped Economy (Flora) | Runs on-prem inside the utility's protected network. Say "NERC CIP-005 requires an Electronic Security Perimeter" ([NERC](https://www.nerc.com/pa/Stand/Reliability%20Standards/CIP-005-7.pdf)); do NOT say air gaps are mandated |
| 11 Own Your Intelligence (Xu) | Each utility owns a model tuned on its own fleet |

### Layers
1. Physics model: IEEE C57.91 hot-spot + loss-of-life (deterministic code) + small forecaster.
2. Life-budget ledger: insulation life as a balance.
3. Agent: shifts flexible load (GPU jobs, EV charging, HVAC, batteries).
4. Money: sell unlocked capacity; insurance/warranty partners `[roadmap]`.

### Customers, beachhead outward
| Segment | Pain (sourced) |
|---------|----------------|
| AI data centers | Time to power ~4 years US, ~7 in N. Virginia (JLL via [Network World](https://www.networkworld.com/article/4117329/google-warns-transmission-delays-are-now-the-biggest-threat-to-data-center-expansion.html)); power transformers 128 weeks ([WoodMac](https://www.woodmac.com/news/opinion/supply-shortages-and-an-inflexible-market-give-rise-to-high-power-transformer-lead-times/)) |
| EV bus/truck depots | 18 to 24 months when grid upgrades are needed; substation upgrades can exceed $10M ([Metro](https://www.metro-magazine.com/articles/when-the-buses-are-ready-and-the-system-isnt)); UK depot quoted GBP 15M and 6 years for 8 MVA ([Dunsky](https://cleanenergycanada.org/wp-content/uploads/2024/10/Dunsky_Clean-Energy-Canada_Costs-of-and-Bottlenecks-in-ZE-MHDV-Infrastructure-Deployment_ECCC_Sept-4.pdf)) |
| Utilities | 60 to 80M US distribution transformers, ~55% older than 33 years ([NREL](https://www.nrel.gov/docs/fy24osti/87653.pdf)) |
| Fabs and factories (Taiwan) | No new >5 MW data centers north of Taoyuan from 2023, eased Jul 2026; reserve margin below 15% target (see IDEAS.md) |
| Buildings electrifying | Heat pumps overload old service transformers `[unsourced, roadmap]` |

### Market numbers
- US investor-owned utilities capex: record $204.1B in 2025, ~$238.8B in 2026, >$1.1T 2025 to 2029 ([EEI](https://www.eei.org/News/news/All/electric-companies-to-invest-nearly-$208b-in-2025-to-strengthen-grid-and-drive-economic-growth), [Utility Dive](https://www.utilitydive.com/news/investor-owned-utilities-spending-more-than-ever-eei/802315/)); distribution ~32% (verify on EEI chart).
- Global grid investment ~$400B/yr ([IEA WEI 2025](https://www.iea.org/reports/world-energy-investment-2025/executive-summary)); must reach >$600B/yr by 2030, 80M km of grid added or replaced by 2040 ([IEA](https://www.iea.org/reports/electricity-grids-and-secure-energy-transitions/executive-summary)).
- Value of 1 MW: PJM capacity cleared at a record $329.17/MW-day for 2026/27 and $333.44 for 2027/28 ([PJM](https://insidelines.pjm.com/pjm-auction-procures-134311-mw-of-generation-resources-supply-responds-to-price-signal/), [POWER](https://www.powermag.com/pjms-record-high-capacity-prices-spark-sector-reckoning-as-market-signals-policy-battles-intensify/)). $329.17 x 365 = **~$120k per MW per year**.
- Proof the trick works elsewhere: dynamic line rating adds 10 to 30% at under 5% of rebuild cost (DOE); existing grid tech could support 20 to 100 GW of peak growth ([DOE Liftoff](https://liftoff.energy.gov/wp-content/uploads/2025/01/Innovative-Grid-Deployment.pdf)).
- Comparable: Emerald AI (GPU flexibility on grid signals) reported $1.05B valuation.

### Bottom-up `[modelled]`
| Segment | Units | Price | Revenue |
|---------|-------|-------|---------|
| Data centers | 1 GW unlocked | 20% of $120k/MW-yr = $24k/MW-yr | $24M/yr |
| Utilities | 10% of 70M distribution transformers | $20 per transformer per yr `[target]` | $140M/yr |
| Long run | 10 GW unlocked across segments | $24k/MW-yr | $240M/yr, plus capacity market share |

### Demo (4 h)
1. Data center: nameplate photo, GMI vision reads ratings, 3D transformer heat map, "+X% safe tonight" from real Taipei weather + public GPU trace, heat rises, agent pauses 2 GPU jobs, hot-spot drops, life budget stays green.
2. **Switch to an EV bus depot: same model, no retraining**, agent shifts charging instead. Proves platform.
3. "Sell 2.1 MWh of capacity tonight", Stripe checkout `[modelled price]`.
4. Bake-off: forecast error vs naive, cost per forecast across GMI models.

### Must not claim
- That NERC requires air gaps. That anyone insures above-nameplate loading today (we found nobody, that is the whitespace, but say "we found no one"). Any national average transformer loading (no good source).

## Round 7: Wall Street for the Physical Buildout (RFS 6, Flora). "Stripe Capital for machines"
B2B. Candidate for a real YC application.

### Numbers (checked 2026-11-11)
- Big four capex ~$410B in 2025, ~$725B guided for 2026 ([Tom's Hardware](https://www.tomshardware.com/tech-industry/big-tech/big-techs-ai-spending-plans-reach-725-billion)).
- $6.7T data center capex needed by 2030, $5.2T of it AI ([McKinsey](https://www.mckinsey.com/industries/technology-media-and-telecommunications/our-insights/the-cost-of-compute-a-7-trillion-dollar-race-to-scale-data-centers)).
- New GPU-backed debt $48.4B in 2026 to 10 Oct, vs $6.6B in 2025 (single tracker, a floor, [American Compute](https://www.amcompute.com/gpu-debt)). CoreWeave $8.5B first investment-grade GPU-backed loan, Mar 2026 ([BusinessWire](https://www.businesswire.com/news/home/20260330529766/en/)).
- US equipment finance $1.51T in 2025, 55.2% of equipment spend financed ([ELFA via SupplyChain247](https://www.supplychain247.com/article/industry_horizon_report_shows_equipment_finance_industry_expanded_to_1.5_trillion)).
- H100 rent: $7 to $10/h in 2023, $2.00 in Dec 2025, back up since; worst peak-to-trough drop 45.3% ([Silicon Data](https://www.silicondata.com/blog/h100-rental-price-over-time)). Volatility = need for hedges.
- Robots today: equipment loans and leases at ~9 to 10.55% (vendor vs bank examples), no telemetry pricing. RaaS market estimates $4.1B to $8.4B by 2030 (paid reports, low confidence).
- Stripe Capital model: repay "a percentage of your Stripe sales" plus one flat fee ([Stripe docs](https://docs.stripe.com/capital)); 81,000+ businesses funded (2025 letter).

### Competition, honest
| Who | Does | Gap left |
|-----|------|----------|
| USD.AI + Aravolta (YC) | GPU loans with live GPU telemetry as collateral data | GPUs only; no revenue sweep found |
| CoreWeave/Lambda lenders (Blackstone, Macquarie, JPM) | Huge GPU-backed facilities | Only for the biggest operators |
| Ornn, Silicon Data | GPU price indexes; futures via ICE/CME coming | No options/puts listed yet |
| American Compute | GPU residual value insurance | Not lending |
| Formic | Robots-as-a-service, bundles financing | Operator, not a lender |
| Robot lending from telemetry | NOT FOUND as a product | **Open** |

**Conclusion:** GPU lending from telemetry is already being done (USD.AI). **Robots are open**, and YC's own example is "a lender for robots that each earn $500k/year". Wedge = robots. GPUs later, or via partners like Aravolta.

### The pitch
**One line:** We lend against robots based on what they actually earn, read from the robot's own data, and get repaid as a share of that revenue automatically.
**Why it matters:** banks price a robot like a forklift (fixed loan, 9 to 11%, no idea if it is working). We see uptime, output and revenue per hour, so we can lend more, cheaper, to the fleets that perform, and catch problems before default.

### Pipeline it fixes
1. Robot is invisible to the lender: telemetry connector (uptime, cycles, faults).
2. Priced like a forklift: earnings-based pricing (revenue per hour x uptime x residual value).
3. Fixed payments kill young fleet operators in slow months: repayment = % of revenue, swept via Stripe.
4. Default found too late: early warning when uptime drops, maintenance triggered before missed payment.
5. Lender cannot scale: loans pooled by risk band for investors `[roadmap]`.

### Demo (4 h)
1. Connect a robot fleet `[synthetic telemetry, realistic shapes]`; each robot shows $ earned per hour.
2. Underwriting engine (deterministic code) prices a loan: amount, rate, % of revenue; next to it "bank offer" at 10.55% fixed `[sourced example rate]`.
3. Stripe test mode: the fleet's customer pays an invoice, 15% sweeps to the lender live.
4. Stress: 3 robots fault, uptime drops; early warning fires, GMI agent reads the fault logs and drafts a maintenance ticket; repayment flexes down, no default.
5. Same engine on a GPU cluster (public utilization trace + Silicon Data H100 prices) to show the platform; mention USD.AI honestly as GPU-side comparison.
6. 3D: warehouse of robots, each glowing by earnings per hour; a faulting one turns red.
- **Measured:** backtest of loss rate fixed loan vs revenue-share on the synthetic fleet under 3 stress scenarios `[modelled]`; GMI fault-log triage accuracy on 20 labelled logs.

### Judges
CDIB (finance), Domu (lending, collections), Boris (data drives action), GMI (agent + GPU side), SF Tensor (GPU prices), Saphira/Partcl (robots, hardware), Stripe on stage.

### YC application path
Start as the underwriting + data layer for existing equipment lenders (no license, no balance sheet). Then a credit line from a lender to fund our own loans. Then pooled robot loans for investors.

## Top 5 summary (all B2B)
| # | Idea | Main RFS (author) | Also fits | Headline number | Gap found |
|---|------|-------------------|-----------|-----------------|-----------|
| 1 | Robot lending: "Stripe Capital for machines" | 6 Wall Street for the Physical Buildout (Flora) | 3 Robots Made in America | US equipment finance $1.51T (ELFA 2025) | No robot lender using live telemetry found |
| 2 | Headroom: hidden capacity in existing transformers | 9 Data Center Supply Chain (Friedman) | 7, 6, 10, 11 | ~$120k per MW per year (PJM record $329/MW-day) | No one pairs transformer heat model with GPU scheduling |
| 3 | Manifest: one verified export record, paid on day 1 | 2 The $15-an-Hour Expert (Flora, names "global trade") | 6 | $2.5T trade finance gap (ADB) | No one does docs + HS + origin + pay-early |
| 4 | Shifu: Taiwan factory know-how for US plants | 2 The $15-an-Hour Expert (Flora) | 3, 10, 11, 7 | Taiwan firms to invest $250B+ in US (Jan 2026 deal) | Partly done by connected-worker tools |
| 5 | Origin: FCC robot compliance + supplier swaps | 3 Robots Made in America (Hu) | 2 | 65% domestic now, 75% in 2029 (FCC, Jul 2026) | Small market |

## Round 8: Space (RFS 1, Gupta). Lloyd's of Orbit
**One line:** Satellite insurance priced daily from live collision risk; when a risk spikes, the agent proposes the maneuver and coordinates it with the other operator.
**RFS:** 1 Abundant Space Access (Gupta), main. 6 Wall Street for the Physical Buildout (Flora: "hedges"). A business that barely works today and must exist at 10,000 launches a year.

### Numbers (checked 2026-11-11)
- ~16,988 active satellites, 11,114 Starlink (McDowell via [FourWeekMBA](https://fourweekmba.com/ai-starlink-is-66-of-active-satellites-2x-all-others-combined/), Oct 2026). ~47,270 regularly tracked objects (ESA via [NewSpace Economy](https://newspaceeconomy.ca/2026/10/28/esa-space-environment-statistics-separate-satellites-from-tracked-objects/)); 44,964 catalogued, ~68,450 over 10 cm modelled ([ESA report 2026](https://www.sdo.esoc.esa.int/publications/Space_Environment_Report_I10R0_20260501.pdf)).
- Starlink: 207,152 collision-avoidance maneuvers Dec 2025 to May 2026, 355,000+ in 12 months (news coverage of FCC filing, [link](https://www.news247plus.com/news/technology/the-figure-that-scares-experts-starlink-made-355000-maneuvers-to-avoid-collisions-of-its-satellites-54715)); was ~50,000 per 6 months in 2023 ([Space.com](https://www.space.com/spacex-starlink-50000-collision-avoidance-maneuvers-space-safety)). **~4x in under 3 years.**
- Launch: Falcon 9 ~$2,700 to $3,250/kg; Starship target $100 to $200/kg, still in test flights in 2026 ([NewSpace Economy](https://newspaceeconomy.ca/2026/06/21/how-accurate-were-elon-musks-falcon-9-and-starship-kg-claims/)). Musk, Oct 2026: "10k Starship launches/year is just from Starbase Louisiana" ([Tesla North](https://teslanorth.com/2026/10/28/spacex-faa-airspace-rules-cap-10000-launches/)).
- Insurance: 2023 claims ~$995M vs premiums ~$557M, ~180% loss ratio, worst on record ([Seradata](https://www.seradata.com/profitable-2024-for-space-insurers-does-not-make-up-for-dire-2023)); insurers left (Canopius, Hiscox). **Only 11 to 17% of LEO satellites are insured** ([Insurance Business](https://www.insurancebusinessmag.com/asia/news/breaking-news/satellite-insurance-in-freefall-as-space-risks-multiply--report-540872.aspx)). Premiums $0.5B to $2B/yr, no trusted figure.
- Data: CelesTrak SOCRATES conjunction list is public, no login, updated 3x a day ([CelesTrak](https://celestrak.org/SOCRATES/)). Commerce Dept TraCSS free of user fees.
- Rules: FCC 5-year deorbit rule (2022). FCC Part 100 "assembly line" licensing adopted Jul 22, 2026 ([Greenberg Traurig](https://www.gtlaw.com/de/insights/2026/8/fcc-space-modernization-series-part-1-the-new-bond-and-milestone-framework)).
- Taiwan: FORMOSAT-8A launched 29 Nov 2025, 8B planned Dec 2026, constellation by 2031 ([Taipei Times](https://www.taipeitimes.com/News/front/archives/2025/11/30/2003848063)). Matsu cable cuts 2023: backup microwave restored ~5% of bandwidth ([The Diplomat](https://thediplomat.com/2023/04/after-chinese-vessels-cut-matsu-internet-cables-taiwan-shows-its-communications-resilience)); another break Apr 2026.

### The pitch math
Launches will grow ~100x cheaper and collision maneuvers already grew ~4x in 3 years, but 83 to 89% of LEO satellites fly uninsured because insurers cannot price the risk and lost money in 2023. Live tracking data makes the risk priceable per satellite per day.

### Competition
| Who | Does | Missing |
|-----|------|---------|
| LeoLabs (~$115 to 129M raised) | Radar tracking | Insurance |
| Slingshot (~$119 to 124M) | Space awareness, Beacon coordination | Insurance |
| Kayhan Space ($14M A) | Automated screening and operator coordination | Insurance |
| Privateer | Space data platform | Insurance |
| ORBITInsure (Warren AI) | Mission risk scores for insurers | Live policy + coordination |
| Big reinsurers | Reportedly adding tracking to underwriting | Product for small operators |
**Nobody found selling policies priced from live conjunction risk plus automated coordination.** Check Crunchbase before saying "first".

### Demo (4 h)
1. 3D globe (three.js / react-globe.gl + satellite.js) with real CelesTrak positions; pick FORMOSAT-8A.
2. Its real SOCRATES conjunctions, collision probability, premium per day.
3. Replay a close approach: premium spikes, GMI agent proposes a maneuver and drafts the message to the other operator; coordination log streams step by step.
4. Stripe checkout: 7 days of cover `[modelled premium]`.
- **Measured:** premium model backtest over the last N days of SOCRATES data; agent latency and cost per conjunction across 3 GMI models.

### Risks
- Insurance needs a licensed carrier: start as the pricing and risk engine (MGA model) for existing insurers.
- Small premium pool today; the pitch is Gupta's own framing: barely works now, must exist at 10,000 launches/yr.
- Coordination space is taken (Kayhan, Slingshot); our wedge is that the price makes operators act.

## Round 9: Robots deep dive (RFS 3 Hu + RFS 6 Flora). Top 4 huge ideas
### New facts (checked 2026-11-11)
- FCC Covered List, 28 Jul 2026 (DA 26-786): covers mobile robots, humanoids, quadrupeds; excludes fixed industrial and medical arms; already-authorized models still sold; firmware updates waived to 1 Jan 2029; exemption = "Conditional Approval" from the Department of War, first ones 9 Sep 2026 ([FCC](https://docs.fcc.gov/public/attachments/DOC-423682A1.pdf), [VacuumWars](https://vacuumwars.com/fcc-grants-first-conditional-approvals/)).
- Physical AI funding H1 2026: $47.4B across 521 deals ([Crunchbase](https://news.crunchbase.com/venture/physical-ai-funding-startups-robotics-aerospace-h1-2026/)). Figure $39B post-money ([Robot Report](https://www.therobotreport.com/figure-ai-raises-1b-in-series-c-funding-toward-humanoid-robot-development/)); Apptronik $5B ([CNBC](https://www.cnbc.com/2026/02/11/apptronik-raises-520-million-at-5-billion-valuation-for-apollo-robot.html)); Agility SPAC with a $201M PIPE led by **Foxconn** ([Agility](https://www.agilityrobotics.com/content/agility-robotics-and-churchill-capital-corp-xi-announce-expected-gross-capital-raise-of-approximately-465-million-and-anticipated-closing-of-business-combination)).
- US: 38,400 industrial robots in 2025, "majority... still imported from Japan and Europe" ([IFR](https://ifr.org/downloads/press_docs/EN-2026-SEP-24-IFR_Press_Release_WR-USA.pdf)). ~1,658 to 2,006 US robotics companies (HowToRobot/A3 2023; Revenuebase 2026).
- **No robot price / residual value index exists** (searched). GPU equivalents raised: Silicon Data $30.5M A, Ornn $33M seed (Round 7). Used-robot marketplaces exist (Robotbids, RobotsTrader, OEM resale); one analyst: depreciation "is not a curve".
- **No telemetry-priced robot lender found.** Formic (RaaS, $50M Oct 2026, $100M equipment debt), kineo finance (no telemetry evidence).
- **No domestic-content compliance product found.** Procurement exists: Cofactr (YC W22), Vendra (YC S24, US parts), Waybill (YC), Silkline, Robotics Center (YC S25).
- Motors: 87% of EVs used rare-earth motors in 2024 ([IDTechEx](https://www.electricvehiclesresearch.com/articles/28314/the-ev-market-doubles-down-on-permanent-magnets-despite-material-costs)); PM motor segment $54.7B to $93.2B (paid reports). Niron $150M conditional loan for a $605M plant ([Mining Weekly](https://www.miningweekly.com/article/rare-earth-free-magnet-maker-niron-secures-150m-loan-for-first-plant-2026-08-19)); Conifer $20M seed (ferrite) ([TechCrunch](https://techcrunch.com/2025/04/14/conifer-locks-down-20m-seed-round-for-its-drop-in-electric-hub-motor)). Harmonic Drive + Leaderdrive >63% of strain-wave revenue (report blurbs).
- Teleop data: XDOF $70M Jun 2026 ([SiliconANGLE](https://siliconangle.com/2026/06/17/robotic-teleoperation-data-startup-xdof-launches-70m-funding/)); operator pay $25 to $55/h (Figure, Tesla, Micro1 listings).

### 1. !! Robot Capital: the credit layer for the robot economy (RFS 6, feeds RFS 3)
- **Insight:** robot companies raised $47.4B of equity in H1 2026, much of it to buy steel. Hardware should be bought with debt, but no lender can see what a robot earns or what it is worth used. We build both: a live **robot value index** and **telemetry-priced loans repaid from revenue**.
- **The FCC twist:** since July, whether a mobile robot is made in America changes what it is worth (new foreign models cannot be authorized). Our index prices that; no one else does.
- **Layers:** (1) Robot value index (Silicon Data for robots), (2) health model predicting failure (Pulse), (3) loans repaid as % of revenue via Stripe, (4) pooled loans for investors later.
- **Judges:** CDIB, Domu, Boris (data drives action), s2 (telemetry streams), Traverse/GMI (health model), Saphira (safety status moves value), Stripe.
- **Demo:** 3D fleet glowing by $/hour; value index chart; loan offer vs bank 10.55%; Stripe sweep; 3 robots fault, early warning, repayment flexes; FCC toggle shows compliant vs non-compliant residual value gap `[modelled]`.

### 2. !! American Build: compile a robot for America (RFS 3)
- **Insight:** the FCC rule turned "where is each part made" into a pass/fail for every new mobile robot, humanoid and quadruped. Procurement tools (Cofactr, Vendra) buy parts; nobody scores and fixes domestic content.
- **What:** BOM + CAD in, domestic-content score, cheapest re-sourcing to US suppliers, Conditional Approval evidence pack, then routes the orders (take rate on parts).
- **Taiwan:** Foxconn led Agility's PIPE; Taiwan suppliers opening US lines are the supply side.
- **Judges:** Saphira (certification evidence), Partcl (hardware), CDIB, GMI (3D + extraction), Sina.
- **Demo:** 3D humanoid exploded, parts red/green, 58% FAIL to 67% PASS, Stripe order for swapped parts, evidence pack PDF.
- **Catch:** ~2,000 US robot companies; money is in the procurement take rate, not the score.

### 3. !! Magnetless: design rare-earth-free actuators on GPUs (RFS 3, 7)
- **Insight:** China made 94% of sintered magnets; 87% of EV motors still use rare earths. Rare-earth-free designs (ferrite, iron nitride, switched reluctance) exist but each one is a long simulation project. GPU-accelerated generative design makes it minutes: what Partcl does for chips, for motors.
- **What:** torque/speed/size spec in, thousands of candidate designs scored on GPU, best rare-earth-free option vs the rare-earth baseline, output a design a US shop can build.
- **Judges:** Partcl (exact analogue), SF Tensor (compute cost), Traverse (surrogate model), Saphira, Freestyle (sims in sandboxes).
- **Demo:** spec in, Pareto chart of 10,000 designs, 3D motor of the winner, "92% of baseline torque, 0 g rare earth" `[simplified analytic model]`.
- **Catch:** physics credibility in 4 h; finance judges care less.

### 4. Home Shift: Americans operating robots remotely, each fix becomes training data (RFS 2, 3)
- **Insight:** robots fail on edge cases; a remote US operator ($25 to $55/h going rate) takes over, and every takeover is training data model labs pay for (XDOF raised $70M for teleop data).
- **Revenue:** labor per hour + data licensing.
- **Judges:** Traverse (data to models), s2 (streams), Freestyle, GMI.
- **Catch:** needs a browser robot sim; hardest to demo in 4 h.

### Merge worth making
**Robot Capital + American Build:** compliance changes residual value, residual value prices the loan, the loan pays for the US-made swap. One data layer, two revenue lines. Pitch the lender; compliance is the wedge feature.

### Ranking
| | Robot Capital | American Build | Magnetless | Home Shift |
|-|---------------|----------------|------------|------------|
| Market size | 5 ($1.51T equipment finance) | 4 | 4 | 4 |
| Gap found | 5 (no index, no telemetry lender) | 4 (compliance open, procurement crowded) | 3 | 2 (XDOF) |
| Judge pull (this panel) | 5 | 4 | 4 (tech judges) | 3 |
| Demo in 4 h | 4 | 5 | 3 | 2 |
| Real YC app | 5 | 4 | 4 (needs physics founder) | 3 |
| **Total /25** | **24** | **21** | **18** | **14** |

## Round 10: Wall Street for robots, built from our three past projects
| Past project | Core mechanism we reuse (as an idea, rewritten tonight) |
|--------------|----------------------------------------------------------|
| Arbiter (Nebius) | Decision ledger the agent can read but never overrule; changes need a quorum of humans; hash-chained audit; durable runs; tiered cascade |
| Zishi (Shenzhen) | Machine wallet: robot earns per verified job, repays its lender from every fee, owns itself at zero; work verified by an oracle (Kalman + conformal); money decisions in code, the model only explains |
| Guild (HK) | Open market for task data: verified clips, provenance trail, 80% to the contributor, open prices from supply and demand |

### Combined idea A (recommended): Selfmade, robots that pay for themselves twice
**One line:** A lender funds a robot; the robot repays from verified work AND from licensing its edge-case data to AI labs; the loan's rules live in a ledger the robot's agent can never overrule.
1. **Verify** (Zishi oracle + Guild trail): every hour of work is checked against telemetry and hash-chained. No fake revenue, which is what kills asset lenders.
2. **Price** (Guild open prices): a robot value index from verified earnings per hour, by model and task. No such index exists (Round 9).
3. **Govern** (Arbiter): loan covenants as a ledger ("no job under $X/h", "service before 500 cycles", "FCC-compliant swaps only"). The robot's agent reads them, cannot break them; changing one needs lender + operator quorum.
4. **Repay** (Zishi + Stripe): repayment swept from every job payment, % of revenue; the operator owns the robot at zero.
5. **Earn twice** (Guild): failures and edge cases become training data sold to robot-model labs (teleop data demand: XDOF raised $70M); data income pays down the loan.
- **Insight for the pitch:** a robot is the first asset that produces two cash flows, labor and data. Banks underwrite neither. We underwrite both.
- **RFS:** 6 Wall Street (main), 3 Robots Made in America (cheaper capital for US-made robots, compliance covenant), 11 Own Your Intelligence (the data side).
- **Judges:** CDIB, Domu (repayment, collections), Boris (data drives action), s2 (durable telemetry and ledger streams), Freestyle (agent acts within limits), Saphira (safety covenants), Hexclave (quorum identities), Traverse/GMI (data for models, GMI agent and vision), Stripe.
- **Demo:** 3D fleet glowing by $/hour; one robot's loan card (balance, % swept, covenants); a job pays via Stripe, 15% sweeps; agent tries a cheap job, ledger blocks it by name; a failure clip is verified and licensed, data income drops the balance; value index updates; covenant change needs two approvals.
- **Measured:** oracle fake-work catch rate on seeded bad telemetry; cascade cost per decision across GMI models.

### Combined idea B: Robot Credit Bureau
Zishi's federated credit (lenders train together without sharing records) + Guild's open prices + Arbiter's audit chain = a shared robot credit score and value index lenders contribute to and query. Pure infrastructure, very Boris; less visual.

### Combined idea C: Robot Work Exchange
Guild's open market applied to robot labor: businesses post tasks, fleets bid, work is verified (Zishi), covenants enforced (Arbiter), financing built in. Bigger but two-sided; hard to show in 4 h.

### Rule check
The repo must have no commits before 18:45, and the product must be built tonight. Reuse the mechanisms and lessons, write the code fresh; do not copy files from the old repos.

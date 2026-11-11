# Research: c0mpiled-18 Taipei (11 Nov 2026)

Every number has a source link. Inferences are marked (inference).

## 1. What YC is looking for
| Criterion | Quote / source | What we do |
|-----------|----------------|------------|
| One plain sentence | "Start with the name of your company and what it does." "You don't need to sound cool. You need to be clear." ([Seibel](https://www.ycombinator.com/blog/how-to-pitch-your-company)) | First line of video = name + what it does |
| No jargon | Drop "platform", acronyms, marketing speak. Email test ([same](https://www.ycombinator.com/blog/how-to-pitch-your-company)) | No "AI-powered platform" anywhere |
| Progress over ideas | "much more interested in progress than genius ideas" ([same](https://www.ycombinator.com/blog/how-to-pitch-your-company)) | Show it working end to end, live |
| Real insight | Executing well "is not an insight" ([howtoapply](https://www.ycombinator.com/howtoapply)) | One sentence only we can say (Taiwan supply chain) |
| No sitcom ideas | Narrow and deep "like a well" ([PG](https://paulgraham.com/startupideas.html)) | One user, one painful job |
| Schlep blindness | Pick the painful, boring problem ([PG](https://paulgraham.com/schlep.html)) | Compliance, customs, tariffs = schleps |
| Founders over idea | "I care more about the founders than the idea" ([howtoapply](https://www.ycombinator.com/howtoapply)) | Team on camera, say why us |
| Fundable | Past c0mpiled events had a "Most Fundable" and a "Most Beautiful" award ([c0mpiled-11](https://luma.com/compiled-cp9o)) | Show who pays and Stripe checkout; make it beautiful |
| Small teams + AI | Garry Tan 2026 theme: "Personal AGI", tiny teams with agents ([Runtimewire](https://runtimewire.com/article/y-combinator-garry-tan-personal-agi-smaller-startup-teams)) | Say "3 people, 4 hours" |

**Boris Jabes** (1st prize office hours): YC Visiting Partner, co-founded Meldium (YC W13) and Census (reverse ETL, sold to Fivetran 2025). Quote: "You can't really automate your business with a chart." ([Mixpanel](https://mixpanel.com/blog/boris-jabes-census-putting-data-into-action/)). (inference) He rewards software that takes an action in a real system, not dashboards.

## 2. Team: 2 or 3?
**3, if the third person does not code.** (inference, YC has no 2 vs 3 data)
- 4 hours must cover build + 90 s video + README. Video alone is 45 to 60 min.
- Seats: 2 engineers on separate folders (frontend+3D+Stripe / backend+GMI+eval), 1 person on story, numbers, deck, video, README, and getting 2 to 3 real people at the venue to say "I would pay for this" on camera.
- If all 3 would code in the same files, go with 2. Merge conflicts cost more than the extra hands.
- YC: "more likely to succeed with a co-founder" ([FAQ](https://www.ycombinator.com/faq)). Extra co-founders correlate with more funding raised ([arXiv](https://arxiv.org/html/2512.13755v1)).

## 3. Judges and what wins them
Corrections: Domu = AI debt collection agents for banks ([YC](https://www.ycombinator.com/companies/domu-technology-inc)). Hexclave = renamed Stack Auth. Mehul (s2) and Circleback judges are engineers, not founders.

| Judge | Company does | Rewards (inference) | Their likely question |
|-------|--------------|---------------------|----------------------|
| Shaun Lane | Riviera: hotel phone agents | Voice that completes a task, clear buyer | Who pays, what job does it replace? |
| Ben Swerdlow | Freestyle: VMs for agents | Agents that act for real | What if the action fails halfway? |
| Konstantin Wohlwend | Hexclave: auth infra. Judged c0mpiled-11 and 13 | Something a person can sign up and use tonight | Could I use this right now? |
| Akshay Chalana, Oscar Avatare | Saphira: safety certification for robots | Compliance, audit trail, physical world | How do you prove it to a regulator? |
| Lance Yan | Traverse: custom models for enterprises | Owned models, measured cost/quality | Why not just prompt a frontier model? |
| Mehul Arora | s2.dev: durable streams | Replayable, crash-safe agent runs | What if it crashes mid-run? |
| Alejandra Pulido | Domu: AI collections for banks | Ops ROI, regulated finance | Who is the first paying customer? |
| Will Salcedo | Partcl: GPU chip design | Benchmarks vs a stated baseline | What is your baseline? |
| Ben Koska | SF Tensor: cheapest GPU compute | $ per run | What does one run cost? |
| Sina Matian | YC product engineer | Polished shipped product | Can I try it? |
| Andres Viera, Felipe Pontiggia | Circleback: meeting notes + actions | Acts after the summary | What does it do next? |
| Ti-Ti Chang | CDIB Capital (Taiwan VC/PE) | Market size, Taiwan angle | How big, why you? |
| Jacky Lu | GMI Cloud FDE | Real GMI use, multimodal | Which GMI models, what latency? |

**What wins the most judges at once:** an agent that does a regulated real-world job, takes a real action, logs every step, and shows $ cost and latency on screen. **What bores them:** a chat UI over one LLM call, summarizers, slides without a product.

**GMI API:** OpenAI-compatible at `https://api.gmi-serving.com/v1` ([docs](https://docs.gmicloud.ai/quickstart.md)). Image/video/speech/3D go through an async queue ([blog](https://www.gmicloud.ai/en/blog/maas-llm-image-video-speech-3d-one-billing-account)). Has a 3D model (`hunyuan-3d-pro`), TTS, video (Kling, Veo, Seedance). Check exact model IDs in the console. No sponsor cash prize found for GMI or Stripe.

## 4. Ideas ranked by money potential
New ideas (B, D, E) were added after the research. All map to the Winter 2027 RFS ([ycombinator.com/rfs](https://www.ycombinator.com/rfs)).

### A. Origin: FCC robot compliance + supplier swaps (RFS 3, Diana Hu). Still the top pick.
- **Why now (big):** On 28 Jul 2026 the FCC added "foreign-produced advanced robotic devices" to the Covered List. No new FCC approval for foreign-made models; "foreign-made" uses the FAR domestic test ([Sidley](https://www.sidley.com/en/insights/newsupdates/2026/08/fcc-adds-all-foreign-produced-advanced-robotic-devices-to-the-covered-list)). YC RFS: "more than 65 percent of a robot's component cost has to be domestic, rising to 75 percent in 2029." FAR steps: 65% to 2028, 75% from 2029 ([FAR rule](https://www.acquisition.gov/sites/default/files/page_file_uploads/FAR_Buy_American_Act_Final_Rule_Prepublication.pdf)).
- **Market:** 600,000+ industrial robot installs in 2025, 5M running, 655,000 forecast for 2026; US ~38,500 installs (+12%) ([IFR](https://ifr.org/news/five-million-robots-now-operate-in-factories-globally/)). Robot installs worth US$18.6bn in 2025 ([IFR summary](https://ifr.org/img/worldrobotics/Executive_Summary_WR_2026_-_Industrial_Robots.pdf)). Humanoids $38bn by 2035 ([Goldman](https://www.goldmansachs.com/insights/articles/the-global-market-for-robots-could-reach-38-billion-by-2035)). China makes 94% of sintered magnets (RFS).
- **Taiwan edge:** Taiwan ships >90% of AI servers ([Digitimes](https://apps.digitimes.com/news/a20240327PD203.html)). Careful: Taiwan parts do NOT count as US domestic. Pitch Taiwan suppliers as the ones opening US lines, and as our supply-side customers.
- **Who pays:** robot makers selling in the US, per SKU per year `[target: $30k/yr]`. Count of US robot makers NOT FOUND, label as `[modelled]`.
- **Judges hit:** Saphira x2, Partcl, CDIB, Boris (acts on BOM data), GMI.

### B. Refund Hunter: claim back the tariffs importers overpaid (RFS 2, $15-an-hour expert). Highest money.
- **Hook:** Upload your customs entries, get the refund you are owed and the filing drafted. We take a % of what comes back.
- **Why now:** Supreme Court ruled 6-3 that IEEPA does not allow tariffs ([Cozen](https://www.cozen.com/news-resources/publications/2026/supreme-court-rules-president-lacks-ieepa-tariff-authority-president-imposes-section-122-tariffs), Feb 2026). Possible refunds ~$170bn (secondary estimate, [A&O Shearman](https://www.aoshearman.com/en/insights/scotus-rejects-ieepa-tariffs-refund-opportunities-and-uncertainty-emerge)).
- **Market:** 240,535 US importing companies, $2.9T imports ([Census](https://www.census.gov/foreign-trade/Press-Release/edb/edbrel2024.pdf)). ~14,454 licensed brokers ([CBP](https://www.cbp.gov/trade/programs-administration/customs-brokers/becoming-customs-broker)), ~17 importers per broker.
- **Money:** contingency fee. 10% of $170bn = $17bn of possible fees `[modelled, one-time pool]`. Plus ongoing HS-code checks (old "Broker" idea) as the subscription.
- **Demo:** CSV of entry lines `[synthetic]` in, GMI classifies HS code and tariff basis, deterministic code computes refund, Stripe checkout for "file my claim", claim PDF out.
- **Risk:** must confirm tonight how refunds are actually being processed. If unclear, pitch as "find and size your refund" without promising filing. What happened to the 10% Section 122 tariff after 24 Jul 2026 is NOT FOUND.
- **Judges hit:** Domu (finance ops), Boris (data to action), CDIB (money), Ben Swerdlow (agent acts). Weaker Taiwan story, but every Taiwan exporter's US buyer is a customer.

### C. Airlock: frontier quality offline (RFS 10 + 11). Strongest for the model judges.
- **Why now:** 41% of regulated enterprises fully blocked an AI deployment over security; 97% would adopt frontier models on-prem ([Fortanix survey](https://techintelpro.com/news/ai/enterprise-ai/fortanix-survey-61-of-regulated-enterprises-send-data-to-public-cloud-ai), Oct 2026). Sovereign AI $600bn by 2030 ([McKinsey](https://www.mckinsey.com/industries/technology-media-and-telecommunications/our-insights/sovereign-ai-building-ecosystems-for-strategic-resilience-and-impact)). Frontier output ~33x the price of hosted gpt-oss-120B ($20 vs $0.60 per M tokens, [Claude pricing](https://platform.claude.com/docs/en/about-claude/pricing), [Together](https://www.together.ai/pricing)).
- **Market:** ~391 300mm fabs (SEMI, unverified) x $500k/site = ~$196M from fabs alone `[modelled]`, then banks, defense, hospitals. Taiwan chip output NT$6.5T in 2025 (forecast, [TechNews](https://technews.tw/2025/10/23/taiwans-semiconductor-industry-output-value-will-reach-nt6-5-trillion-in-2025/)).
- **Judges hit:** Traverse, SF Tensor, GMI, Partcl.

### D. Agent Storefront: make a factory's catalog buyable by AI shopping agents (Stripe-native)
- **Hook:** Taiwan component makers upload a catalog; AI agents can quote and pay through Stripe without a sales rep.
- **Why now:** agentic checkout protocols from Stripe and OpenAI (2025, verify the date and name before citing). Gartner: 40% of enterprise apps to have task-specific agents by end of 2026, up from under 5% in 2025 ([Gartner](https://gartner.com/en/newsroom/press-releases/2025-08-26-gartner-predicts-40-percent-of-enterprise-apps-will-feature-task-specific-ai-agents-by-2026-up-from-less-than-5-percent-in-2025)).
- **Catch:** weak RFS fit, two-sided. Good "layer" on Origin: the swap suggestion becomes a buy button.

### E. Missed-call agent for clinics / SMBs. Large, but crowded and Riviera is on the panel.
- 44% of 70M+ business calls missed ([Invoca](https://www.invoca.com/blog/5-insights-60-million-phone-conversations)). Voice AI agents $2.4bn (2024) to $47.5bn (2034) ([Market.us](https://market.us/report/voice-ai-agents-market/), paid report). Skip unless the team loves voice.

### F. AP agent for SMEs. Real money, generic demo.
- $9.90 vs $2.67 per invoice ([Ardent via Medius](https://www.medius.com/resources/guides-reports/ardent-partners-state-of-epayables/)); 36.2M US small businesses ([SBA](https://advocacy.sba.gov/wp-content/uploads/2025/06/United_States_2025-State-Profile.pdf)). Too many teams will build this.

### Scoreboard (1 to 5)
| | Origin | Refund Hunter | Airlock |
|-|--------|---------------|---------|
| Money / who pays | 4 | 5 | 4 |
| Why now strength | 5 (FCC Jul 2026) | 5 (SCOTUS Feb 2026) | 4 |
| Judge pull | 5 | 4 | 4 |
| Taiwan "why us" | 5 | 3 | 5 |
| Demo moment | 5 (FAIL to PASS in 3D) | 5 ($ refund counter) | 5 (wifi off) |
| Buildable in 4 h | 4 | 4 | 3 |
| Legal risk in pitch | low | medium (verify refund process) | low |
| **Total /35** | **33** | **30** | **29** |

**Recommendation:** Origin. Add D's "buy this swap" button with Stripe. Refund Hunter if the team wants the biggest money story and can verify the refund process in 15 minutes.

## 5. General why-now numbers
- LLM inference ~10x cheaper per year at equal quality ([a16z](https://a16z.com/llmflation-llm-inference-cost/)); 9x to 900x/yr by task ([Epoch AI](https://epoch.ai/data-insights/llm-inference-price-trends)).
- Top 100 AI companies hit $5M ARR in 24 months vs 37 for SaaS ([Stripe via TechCrunch](https://techcrunch.com/2025/02/27/stripe-ceo-says-ai-startups-are-growing-faster-than-saas-ever-did-and-calling-them-wrappers-misses-the-point)).

## 6. 3D component ideas (meaningful, not decoration)
- **Origin:** exploded robot arm (GLB) in react-three-fiber. Each part red (foreign) or green (domestic) and sized by cost share. Swaps animate parts to green; the % counter flips to PASS. Optional: generate one part model with GMI `hunyuan-3d-pro` before the demo (async, slow; pre-generate).
- **Refund Hunter:** 3D globe (react-globe.gl) with arcs for each shipment, colored by refund owed.
- **Airlock:** 3D fab/server rack with a visible "air gap" cut, packets bouncing off.

## 7. Demo video (90 s)
| Time | Show | Say |
|------|------|-----|
| 0 to 8 s | Product on screen, team name | "Origin tells robot makers if their robot can still be sold in the US, and how to fix it." |
| 8 to 20 s | RFS quote + FCC headline | "Since July the FCC blocks new foreign-made robots. 65% of parts by cost must be domestic, 75% by 2029." |
| 20 to 60 s | Upload BOM, GMI classifies parts live, 3D robot mostly red, score 58% FAIL, agent proposes 3 swaps, parts turn green, 67% PASS, Stripe checkout for the report | Narrate only the user's actions |
| 60 to 72 s | Bake-off table: 3 GMI models, accuracy, latency, $ per BOM | "Measured tonight on a 40-part hand-labelled BOM." |
| 72 to 85 s | Market slide (bottom-up), who pays | "$X per SKU per year. N robot makers. Taiwan suppliers are the other side." |
| 85 to 90 s | Team on camera | Closing line, RFS author name |

Rules: captions on, 1080p, real data on screen, "What is real, what is simulated" for 2 seconds, record a backup take by 22:00. Founders on camera, no effects ([Pilot](https://pilot.com/blog/how-prepare-yc-application-video)).

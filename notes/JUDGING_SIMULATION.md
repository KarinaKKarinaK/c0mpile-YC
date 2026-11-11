# JUDGING SIMULATION: PRIVATE, untrack before the repo goes public

Event: c0mpiled-18, YC Startup School Hackathon, Taipei. Run: 11 Nov 2026, 19:50. Facts tagged CONFIRMED (link in notes/RESEARCH.md) or INFERRED.

## 1. Bottom line
No public rubric. Proxy criteria from YC advice and past c0mpiled awards ("Most Fundable", "Most Beautiful", CONFIRMED). Our entry scores 8.0 / 10 average across the panel, likely top 3 of an estimated 50 to 70 submissions (INFERRED). Three moves that matter most: (1) GMI key live so the badge says GMI Cloud, (2) a real Stripe test payment in the video, (3) say the RFS quote in the first 10 seconds.

## 2. Rules and gates
> Repos with commits made before the build session starts are not eligible.

| Gate | Status |
|------|--------|
| First commit after 18:45 | Pass (repo created 19:13, first commit 19:16) |
| Video + GitHub URL | Pending |
| Built during the event | Pass |
| Uses RFS topic | Pass: Wall Street for the Physical Buildout |

## 3. Criteria used (proxy, equal weight)
1 Problem and who pays (fundable). 2 Working demo end to end. 3 Technical depth. 4 Sponsor use (GMI, Stripe). 5 Polish and clarity.

## 4. Judge dossiers and scores (1 to 10)
| Judge | Looks for (INFERRED) | Will probe | Fundable | Demo | Depth | Sponsor | Polish | Mean |
|-------|----------------------|------------|----------|------|-------|---------|--------|------|
| Ti-Ti Chang, CDIB | Market, fundability | "Where does the lending capital come from?" | 9 | 8 | 7 | 7 | 9 | 8.0 |
| Alejandra Pulido, Domu | Collections, ops ROI | "What happens on default?" | 9 | 8 | 7 | 7 | 8 | 7.8 |
| Akshay Chalana / Oscar Avatare, Saphira | Safety, compliance evidence | "Is C3 a real safety rule?" | 8 | 8 | 8 | 7 | 9 | 8.0 |
| Will Salcedo, Partcl | Benchmarks vs baseline | "Synthetic telemetry, so what is the real accuracy?" | 7 | 8 | 7 | 6 | 9 | 7.4 |
| Ben Koska, SF Tensor | $ per run | "Cost per decision?" | 7 | 8 | 7 | 7 | 9 | 7.6 |
| Lance Yan, Traverse | Owned models | "Why not a fine-tuned small model for offers?" | 7 | 8 | 7 | 7 | 9 | 7.6 |
| Mehul Arora, s2.dev | Durable, replayable logs | "Is the chain durable across sessions?" | 8 | 8 | 8 | 7 | 9 | 8.0 |
| Ben Swerdlow, Freestyle | Agents that act | "Can the agent act on its own?" | 8 | 8 | 7 | 7 | 9 | 7.8 |
| Konstantin Wohlwend, Hexclave | Real multi-user use | "Are lender and operator real identities?" | 7 | 8 | 7 | 7 | 9 | 7.6 |
| Shaun Lane, Riviera | Clear buyer | "Who signs the first contract?" | 9 | 8 | 7 | 7 | 9 | 8.0 |
| Circleback engineers | Action after reading | Likes model-reads, code-acts | 8 | 8 | 8 | 7 | 9 | 8.0 |
| Sina Matian, YC | Shipped product polish | "Can I try it now?" | 8 | 9 | 7 | 7 | 10 | 8.2 |
| Jacky Lu, GMI | Real GMI use | "Which model and latency?" | 8 | 8 | 7 | 6 if offline / 9 with key | 9 | 7.6 to 8.2 |

## 5. Likely rival archetypes (no public repos found yet; re-scan at 22:00)
| Archetype | Typical strength | Our edge |
|-----------|------------------|----------|
| City Hall permit agent (RFS 8) | Clear story | We have money moving and a sponsor in the core |
| $15 expert medical billing (RFS 2) | Big market | Crowded; ours is novel |
| Generic chat agent on GMI | Fast to build | We have depth: oracle, covenants, audit chain |

## 6. Ranked moves
| # | Fix | Criterion | Gain | Time | Done |
|---|-----|-----------|------|------|------|
| 1 | Set GMI key + model, show badge and latency in video | Sponsor | +0.5 | 5 min | |
| 2 | Real Stripe test payment in the video | Sponsor, Demo | +0.4 | 5 min | |
| 3 | Deploy to Vercel, link in README | Demo | +0.3 | 10 min | |
| 4 | Answer "where does capital come from": underwriting layer for licensed lenders first | Fundable | +0.3 | in pitch | |
| 5 | Measure GMI latency and cost per offer over 20 offers, add to README | Depth | +0.3 | 15 min | |
| 6 | Team names and one line each in README | Founders | +0.2 | 2 min | |

## 7. Honest summary
Strong on story, polish and judge fit. Weakest point: every robot number is synthetic, so expect "how do you get real data". Answer: start with one fleet partner (RaaS operators like Formic already collect uptime) and sell underwriting to their lenders.

## 8. Run log
| Time | Mean | What changed |
|------|------|--------------|
| 19:50 | 7.8 to 8.0 | First run, offline parser, Stripe simulated |

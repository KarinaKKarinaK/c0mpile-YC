# Evaluation map

Every claim below points to something you can open or run. Numbers without a source are labelled [modelled], [synthetic] or [target].

## Problem, market, timing (YC lens)
| Criterion | Evidence | Where |
|-----------|----------|-------|
| Clear one-line description | "Loans for robots, repaid by the work they do." | Landing hero, README |
| Acute problem | Fixed bank payments ignore uptime; one bad month breaks a young fleet | README "YC's ten questions" |
| Market size | $1.51T US equipment finance (ELFA 2025); $47.4B physical AI funding H1 2026 (Crunchbase); 38,400 US robot installs 2025, +12% (IFR) | README "The numbers that matter", sourced links |
| Why now | FCC rule on foreign-made mobile robots, 28 Jul 2026 (DA 26-786); robots stream telemetry; agents can run collections | README, landing "Straight answers" |
| RFS fit | YC Winter 2027 RFS "Wall Street for the Physical Buildout" (Brad Flora); hook into "Robots Made in America" (Diana Hu) | README intro |
| Competition named | Equipment banks, Formic, USD.AI + Aravolta, Stripe Capital | README "Who else is here" |
| Business model | Software fee per loan on licensed partner capital, then own credit line, then investor pools | Landing "For lenders", `/invest`, README |

## Product and technical depth
| Criterion | Evidence | Where |
|-----------|----------|-------|
| Works end to end, live | One-button run through the real API | `/pipeline`, `app/pipeline/page.tsx` |
| Server-side trust | Billing computed from telemetry on the server; verdicts and sha256 of hours in the Stripe session; each session settles once | `app/api/checkout/route.ts` |
| Fraud resistance, measured | Idle and no-energy fraud 500/500; physics-consistent spoof 6/500 with one band, 500/500 with client-output check; worn-motor false flags 379/500 to 10/500 with per-robot band | `node scripts/eval.ts`, `lib/engine.ts` |
| Verifiable records | sha256 work receipts, daily Merkle root, inclusion proofs | `/api/receipts`, `/api/receipts/proof`, tests |
| Agents with guardrails | Agent proposes; deterministic rules bound it; distinct-role quorum executes; sha256 event chain | `/api/actions`, `proposeActions`, `approve` |
| Bring your own data | CSV upload, per-robot energy band | `/api/verify`, landing "Try it" |
| Real data where possible | Sourced robot list prices; live RSS news index | `lib/models.ts`, `app/api/market/route.ts` |
| Tests and CI | 11 tests, GitHub Actions CI green | `lib/engine.test.ts`, `.github/workflows/ci.yml` |

## Sponsor stack
| Sponsor | Use | Status |
|---------|-----|--------|
| Stripe | Checkout for job payments; server verifies the session before money moves | Code complete; test keys pending on the live site |
| GMI Cloud | OpenAI-compatible model reads job offers and failure notes, with provider and latency shown | Code complete; key pending; offline parser fallback labelled |

## Honest limits
No operator customers yet; fleet telemetry synthetic; demo storage in memory unless KV is connected; investor pools are a demo, not an offer.

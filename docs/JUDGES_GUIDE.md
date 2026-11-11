# Hebl in two minutes

**What it is:** loans for robots, repaid by the work they do. Telemetry proves each hour, the client's warehouse system confirms output, a share of every verified job repays the loan, nothing is due while the robot is idle.

| Time | Open | What to look for |
|------|------|------------------|
| 0:00 | [Landing](https://selfmade-yc.vercel.app) | The one-line pitch and three steps; "Try it": pick a robot, or "Use a sample log" then "Verify and price" |
| 0:30 | [See it run](https://selfmade-yc.vercel.app/pipeline) | Press Run: receipts, server verification, Merkle proof, billing, settlement, agent proposals, two-role approval, all live API calls |
| 1:15 | [Operator desk](https://selfmade-yc.vercel.app/desk) | Today view; "Trigger line jam" stops the 3D line, the agent proposes actions, the repayment flexes down |
| 1:45 | [Back a fleet](https://selfmade-yc.vercel.app/invest) | Investor pools paid from verified jobs; the jammed robot's pool pauses |

## Check it without trusting us
```bash
B=https://selfmade-yc.vercel.app
# 1. issue receipts: one good hour, one idle hour
curl -s -X POST $B/api/receipts -d '{"robotId":"R-06","hours":[{"cycles":100,"kwh":1.55,"units":100},{"cycles":5,"kwh":0.4}]}'
# 2. bill from telemetry, not from an amount: the idle hour is not billed
curl -s -X POST $B/api/checkout -d '{"robotId":"R-06","payPerHour":30,"hours":[{"cycles":100,"kwh":1.55},{"cycles":5,"kwh":0.4}]}'
# 3. locally: tests and the fraud table
npm install && npm test && node scripts/eval.ts
```

## Honest limits
Fleet telemetry and hourly rates are synthetic; robot prices are sourced list prices; news is live. Storage is in-memory unless a KV store is connected. Investor pools are a demo, not an offer.

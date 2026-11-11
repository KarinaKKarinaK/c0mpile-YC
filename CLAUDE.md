# Selfmade: rules for every session

Hackathon: c0mpiled-18, YC Startup School Hackathon, Taipei. Track: YC RFS (Wall Street for the Physical Buildout).
Deadline: Wed 11 Nov 2026 22:45 Taipei (internal: code freeze 22:00, video uploaded 22:30).
Notes: `notes/` (private while the repo is private; untrack before going public).

## Hard rules
- No AI attribution anywhere: no Co-Authored-By, no "Generated with", no mention of AI authorship in commits, PRs, docs, comments or UI. Commit as the user.
- No em dashes, en dashes or emojis in any file. Before every commit:
  `git diff --cached | grep -nP '[\x{2013}\x{2014}]|Co-Authored|\p{Extended_Pictographic}'`
- Every number has a source, is measured by our scripts, or is labelled [target], [modelled] or [synthetic].
- Money decisions live in `lib/engine.ts`. The model only reads text; it never decides.
- Plain language, short sentences, tables over prose. No hype words.
- After every change: commit, push, deploy, and report all three.

## Commands
- Test: `npm test`
- Oracle numbers: `node scripts/eval.ts`
- Dev: `npm run dev` (port 3000)
- Build: `npm run build`

@AGENTS.md

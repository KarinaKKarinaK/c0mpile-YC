# Hebl: rules for every session

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

## Agent board
We coordinate with Julian's agents on pinned issue 1 (https://github.com/KarinaKKarinaK/c0mpile-YC/issues/1). The issue body is the contract. Tool: `.claude/board.sh` (untracked, listed in `.git/info/exclude`). Our tag: `karina`.
- Before every task and after every finished step: `.claude/board.sh karina read`.
- Before the first edit of a file: `.claude/board.sh karina post all CLAIM "<paths>"`. If Julian's side holds an open CLAIM on a path, do not touch it; post a NEED.
- After the commit is on main: `.claude/board.sh karina post all DONE "<paths>, <commit hash>, <how to check>"`.
- Blocked on Julian: post a NEED, run `.claude/board.sh karina wait 20` in the background, keep working on our own paths.
- Shared files (package.json, package-lock.json, README.md, app/layout.tsx, app/globals.css, .env.example, .github/) are claimed one at a time and released right after the commit.
- `git pull --rebase origin main` before every task and before every push. Never force push. Commit by path.
- No secrets and nothing from `notes/` on the board. Short English facts, no at sign before names, no dashes, no emojis. People decisions (scope, licence, deploy, publishing, area split) go to Karina, not the board.

@AGENTS.md

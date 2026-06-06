# Enforcement Layer — How Rules Now Enforce Themselves

## The shift
Before: rules were prose the agent read and could drift from. Enforcement
meant the owner watching in real time. The moment the owner looked away,
drift returned (the B-9 wipe happened this way).

After: the rules that MUST hold are hooks that BLOCK the action. The agent
physically cannot do the forbidden thing — even in bypass mode.

## The three layers (weakest → strongest)
1. `.claude/rules/*.md` — conventions, auto-loaded. The model weighs them.
2. `.claude/hooks/guard.mjs` (PreToolUse) — GATES. Deny = blocked.
3. `pending-approval.flag` — makes "HALT and wait for owner" mechanical.

## What guard.mjs blocks (all tested)
- **B-9**: overwriting a protected/owner-WIP file with no fresh timestamped
  backup in backups/. → "back it up first."
- **Unapproved commit**: any `git commit` while pending-approval.flag exists.
- **Backup deletion/overwrite**: backups/ is append-only.
- **Destructive git**: force-push, reset --hard, clean -f, stash drop/clear,
  rm -rf.

Protected paths (edit the PROTECTED array in guard.mjs to extend):
  sandbox/00-design-reference/, surfaces.css, colors.css,
  generate-colors.js, showcase.html, starters/, templates/tokens.css

## The approval-flag workflow (this is the new HALT)
When an agent finishes work that needs owner sign-off:

  1. Agent writes the file (no commit).
  2. Agent runs:  echo "what's awaiting review" > pending-approval.flag
  3. Agent halts and reports — including the flag's reason.
  4. Owner reviews. The guard blocks ANY commit until the flag is gone.
  5. On owner "approved":  rm pending-approval.flag  → then commit.

"Wait for owner approval" is now a guarantee, not a behavior to police.

## Honest limits
- A hook can be disabled (disableAllHooks). This stops DRIFT and MISTAKES —
  the actual problem — not a determined override. For an agent that means
  well but forgets, blocking hooks are the right tool.
- Path-scoped RULES don't fire on file creation (documented bug). That's why
  creation-time conventions live in root CLAUDE.md and why ENFORCEMENT lives
  in hooks (which fire on every matching tool call regardless).
- guard.mjs fails OPEN on its own parse errors (never bricks the agent) but
  fails CLOSED on destructive-git (safety over convenience).

## To extend
- New protected path → add to PROTECTED array in guard.mjs.
- New forbidden command → add a regex to the destructive[] array.
- Tighten backup freshness → the hasFreshBackup() check matches basename +
  today's date; change to match a reason tag if you want per-operation backups.

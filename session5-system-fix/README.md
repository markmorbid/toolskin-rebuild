# Toolskin Persistent System — Why This Exists

## The problem this solves

The agent kept losing decisions made hours earlier. `.remember/remember.md`
was wiped on every session start. Directives skimmed past 3000 lines.
The orchestrator forgot rulings and produced conflicting instructions.

Root cause (verified against Claude Code docs):
- `.remember/remember.md` is a NESTED file. Nested files do NOT survive
  compaction — only project-root CLAUDE.md is re-injected after /compact.
- Knowledge lived in chat context, which is stateless reconstruction,
  not persistent cognition.

## The fix — three native Claude Code mechanisms

### 1. Externalized knowledge → `.claude/rules/*.md`
Every .md in `.claude/rules/` auto-loads at session start, same priority
as CLAUDE.md. Each file is ONE topic, under 200 lines (the documented
ceiling above which adherence drops). These are the source of truth.
Not memory. Not chat. Files on disk, loaded every session, guaranteed.

### 2. Persistent logging → `PostToolUse` hook → `logs/checkpoints.log`
A hook fires AFTER every file write/edit and appends a line to the log.
This is a system guarantee, not the agent "remembering" to log.
The log survives everything — it is a git-tracked file, not context.

### 3. Context rehydration → `SessionStart` hook + CLAUDE.md protocol
Session start runs a hook that prints the latest checkpoints and the
rules manifest. The root CLAUDE.md (which survives compaction) carries
the mandatory protocol: LOAD rules → SUMMARIZE state → THEN execute.

## File map

```
.claude/
  CLAUDE.md                      ← root authority, survives compaction
  rules/
    00-cold-start.md             ← the rehydration protocol (load order)
    01-rulings.md                ← R1-R11 + RULING 3 OVERRIDE
    02-visual-quality.md         ← VQ rules from the differential
    03-css-architecture.md       ← nested component pattern (the law)
    04-behavior.md               ← halt-on-interrupt, one-task-one-halt
    05-owner-notes.md            ← owner notes, verbatim, greppable
    06-design-law.md             ← expert-designer v7 flow (path-scoped)
  hooks/
    checkpoint-logger.mjs        ← PostToolUse → logs/checkpoints.log
    session-rehydrate.mjs        ← SessionStart → prints state
    settings.json                ← registers both hooks
decisions/
  color-system.md                ← OKLCH engine + RULING 7 status
  system-layer-status.md         ← B1/B2/B3 + council convergence
  font-scaling.md                ← OPEN: semantic units question
audit/
  checklist.md                   ← grep-based FAIL conditions
logs/
  checkpoints.log                ← append-only, hook-written
backups/
  oklch-surface-system-PREVIOUS.css  ← reference for fixing dark surfaces
handoffs/
  council-compensation-directive.md  ← dispatch council on owner's CSS work
```

## The role split (your partner's point 4)

- ORCHESTRATOR routes tasks. Holds no knowledge. Reads rules to route.
- ANALYST/AUDITOR reads notes, validates against rules, produces findings.
- EXECUTOR receives clean instructions + only the relevant rules.

Each role loads its scoped rules. None relies on chat continuity.

## What to STOP doing

- Trusting long chats for continuity
- Relying on "memory"
- Stacking instructions over hours without reloading state
- Treating "I read it" as "I handled it"

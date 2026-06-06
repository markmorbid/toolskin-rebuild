# ══════════════════════════════════════════════════════════════════
# TOOLSKIN REBUILD — ROOT AUTHORITY
# This block goes at the TOP of the project-root CLAUDE.md.
# Root CLAUDE.md is the ONE file Claude Code re-injects after every
# /compact. Everything here survives compaction. Nested files do not.
# ══════════════════════════════════════════════════════════════════

## CONTEXT REHYDRATION — DO THIS FIRST, EVERY SESSION, EVERY MAJOR TASK

Before any work, LOAD and SUMMARIZE state. If you cannot fill the
SESSION STATE block below from files, you are not rehydrated — re-read
the source. The answer is always in a file, never in memory.

1. Read all `.claude/rules/*.md` (auto-loaded — confirm presence)
2. Read `decisions/system-layer-status.md`
3. Read last 15 lines of `logs/checkpoints.log`
4. Read `handoffs/core-memories.md` (full-state insurance copy)

Then state:
```
SESSION STATE
HEAD:            [hash]
Last checkpoint: [last log line]
Current phase:   [from system-layer-status.md]
Open blockers:   [B1/B2/B3]
This task goal:  [one sentence]
Visual target:   [named file if visual]
```
Then — and only then — execute.

## THE DESIGN LAW (for any visual/UI/CSS task)
1. cat expert-designer/SKILL.md
2. cat expert-designer/ANTI-DEFAULT-PROTOCOL.md
3. Pick ONE starter from expert-designer/starters/
4. Write the 6-line manifesto BEFORE any HTML
5. Fill SLOT markers — DO NOT redesign the layout
6. node expert-designer/scripts/audit-boring.mjs <file>  (exit 0)
7. node expert-designer/scripts/audit-design.mjs <file>  (exit 0)
Visual match to expert-designer/screenshots/expert--designer-showcase.jpg
is the acceptance criterion. Audit score is a constraint, not the goal.

## NON-NEGOTIABLE BEHAVIOR
- Owner message = FULL STOP all background agents. Status report first.
- One task → one halt → one report. Never chain without GO.
- Orchestrator dispatches; sub-agents execute. Orchestrator holds no knowledge.
- Name the goal + output file before dispatching, or do not dispatch.
- "I read it" is NOT "I handled it." Act, encode, or defer-with-reason.
- Speed is not a value. Understanding before action is.
- Nested CSS component pattern is law (see .claude/rules/03-css-architecture.md).
- After any CSS consolidation: HALT and show owner. No commit, no audit.

## RULING 3 OVERRIDE (2026-05-24)
13px base ANNULLED. Scaling flexible, may resolve to 16px. Width-aware
model is spec. Mathematical stability + token inheritance = only criteria.

## PERSISTENT LOGGING (not memory)
The PostToolUse hook writes every file change to logs/checkpoints.log.
Read it to know what happened last session. It survives everything.

## ROLE SPLIT
ORCHESTRATOR routes (no knowledge). ANALYST reads notes + validates.
EXECUTOR receives clean instructions + only relevant rules.

# ══════════════════════════════════════════════════════════════════
# Detailed rules live in .claude/rules/ (auto-loaded each session).
# Decisions live in decisions/. Audit gates in audit/checklist.md.
# This block is the durable core that survives compaction.
# ══════════════════════════════════════════════════════════════════

# Cold Start — Context Rehydration Protocol

**This is the first thing every session does. No exceptions.**
**If an agent acts before completing this, the task fails.**

## Load order (every session, every major task)

1. Read `.claude/CLAUDE.md` (auto-loaded, but confirm presence)
2. Read all `.claude/rules/*.md` (auto-loaded)
3. Read `decisions/system-layer-status.md` (current build state)
4. Read the last 20 lines of `logs/checkpoints.log` (what happened last)
5. Read `handoffs/core-memories.md` (full-state snapshot — insurance copy)

## Then — before any work — state out loud:

```
SESSION STATE
─────────────
HEAD:            [git rev-parse --short HEAD]
Last checkpoint: [last line of logs/checkpoints.log]
Current phase:   [from decisions/system-layer-status.md]
Open blockers:   [B1/B2/B3 status]
This task's goal: [one sentence]
Visual target:   [named file, if a visual task]
```

## Then — and only then — execute.

## The rule

If you cannot fill every line of SESSION STATE from the files above,
you are not rehydrated. Do not guess. Do not proceed.
Re-read the missing source. The answer is in a file, never in memory.

## Why this exists

Sessions start with a fresh context window. Two mechanisms carry
knowledge across sessions: these rules files, and the checkpoint log.
Chat history does NOT carry across. Memory does NOT carry across
reliably. Only files on disk, loaded at launch, are durable.

The orchestrator that forgot decisions made hours earlier failed
because it trusted context instead of reloading state. This protocol
makes reloading state mandatory and mechanical.

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

# Toolskin Rebuild — Project Conventions

## DESIGN LAW — READ THIS FIRST FOR ANY VISUAL TASK
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
You have access to `expert-designer/` in this project.
For ANY visual / UI / layout / styling / component / page / hero task:

1. `cat expert-designer/SKILL.md`
2. `cat expert-designer/ANTI-DEFAULT-PROTOCOL.md`
3. Classify the task → pick ONE starter from `expert-designer/starters/`
4. Write the 6-line manifesto (SKILL.md §4) BEFORE any HTML
5. Copy the starter, fill its SLOT markers — DO NOT redesign the layout
6. Run: `node expert-designer/scripts/audit-boring.mjs <file>`
7. Run: `node expert-designer/scripts/audit-design.mjs <file>`
8. Both must exit 0 before declaring done.

If audit-boring rejects: pick a different starter, restart.
Do not invent layouts. Do not center-stack.
Do not improvise outside the six approved patterns.

Exclusion: `expert-designer/Expert Designer Pack.html` is documentation
of the design law (the v7 reference showcase), not a visual deliverable.
The pre-commit dual-audit gate skips it; the 6 starters + showcase.html
remain gated and prove the system's internal self-consistency.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## BRANCH CONVENTION (Design + Code separation)

`design/<feature>`  ← Claude Design produces HTML artifacts here.
                       Output: HTML that passes both audit gates.
                       Must pass `audit-boring.mjs` + `audit-design.mjs`
                       before PR.

`feat/<feature>`    ← Claude Code branches from `design/<feature>`.
                       Translates HTML → system tokens + components.
                       NEVER redesigns. If layout doesn't translate:
                       escalate. The HTML artifact IS the spec. Code
                       re-implements it.

Design merges into `feat/*` via PR. Not the other way.
Every PR touching visual files includes the 6-line manifesto in the
description.

## Session start — FIRST ACTION, every session (binding)

Before any task work, run the cold-resume routine (Pattern 18 — Session Continuity Protocol):

1. Read `.remember/remember.md` — the handoff note (State / Next / In-flight / Context).
2. Read `.claude/skills/toolskin-architecture/SKILL.md` in full + `docs/handoffs/_session-1-orchestrator-synthesis.md` + any `_session-N-state-*.md` the handoff points to.
3. Verify disk reality matches the handoff — `git log --oneline`, `git status`. If reality ≠ handoff, HALT and surface; never improvise.
4. Report current standing, then proceed from the handoff's "Next".

This runs automatically every session — the agent self-initializes; no special kickoff prompt is needed. Full protocol: `toolskin-architecture` SKILL.md §19.

## Identity

- Project: Toolskin Design System Rebuild
- Status: Block-by-block sandbox rebuild in progress
- Branch: master (single, no worktrees)
- Reference: ../toolskin-showcase/ (read-only, never modify)

## File-level freezes

- `../toolskin-showcase/**` — entire old repo is read-only reference
- This repo: free to write at `assets/css/next/`, `sandbox/`, `docs/`, `tools/`, `.claude/`

## Repo isolation (binding)

- **This repo (`toolskin-rebuild/`)**: the canonical Toolskin project. Branch `master`. All work happens here.
- **Reference repo (`../toolskin-showcase/`)**: frozen, read-only. Sub-agents read from it via relative paths. NEVER write, NEVER commit, NEVER cd into.

Any agent that violates this isolation halts immediately and surfaces to owner. See `.claude/skills/toolskin-architecture/SKILL.md` REPO MODEL section.

## Conversation rules

Read `.claude/skills/toolskin-architecture/references/conversation-rules-verbatim.md` for the **15 binding rules** (14 from the master brief + Rule 15 apcach color authority).

## Workflow per block

See `.claude/skills/toolskin-architecture/SKILL.md` for the locked block sandbox workflow.

## Module reference library

`docs/references/` is the canonical location for historical Toolskin module reference material — design, code, and documentation imported from the showcase repo and prior workstreams.

**Binding:** before rebuilding any component family, the responsible agent (or sub-agent) MUST read the relevant `docs/references/` subfolder for prior art, design intent, and known issues. The full index with per-file detail is `docs/references/toolskin-references-directory-treemap.md`.

Top-level index:

| Folder | Contents |
|---|---|
| `branding/` | Logos, variable fonts, demo pages, component previews, uploads |
| `generator/` | Banner-generator reference app — HTML, JS modules, presets |
| `mockup/` | Toolpanel/modal HTML mockups (hf, suno, yss) + layout blueprint |
| `pitchdeck/` | Pitch-deck versions, archived CSS, briefings |
| `treemap-module/` | Tree-explorer UI + data + Python/JS build tools + screenshots |
| `wireframe-blueprint-module/` | Wireframe blueprint HTML previews |
| `_components-docs/` | Component reference docs, Template-system adaptation plan, agent-teams workflow docs, token-validation skill copy |
| `_Toolskin-Docs (old)/` | Legacy Toolskin documentation snapshot |

The imported reference material is historical context — read it to understand prior art. The canonical rebuild output lives in `assets/css/next/`, `sandbox/`, and `tools/`, never inside `docs/references/`.

## Owner

Satoshi / SatSea

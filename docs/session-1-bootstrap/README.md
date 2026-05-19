# Session 1 Bootstrap — Canonical Orchestration

This folder contains the canonical orchestration documents for the Toolskin Rebuild **Session 1** (May 18–19, 2026).

## What this folder is

The Session 1 orchestration brief and its evolving deltas — the foundational documents that set up the rebuild. These were authored in chat conversation, then assembled here as the canonical historical record.

Future agents in this repo do NOT need to read this folder directly. The toolskin-architecture skill (at `.claude/skills/toolskin-architecture/SKILL.md`, built in Phase E) encodes everything binding from these documents.

This folder exists so:
- The history of WHY the rebuild approach is what it is remains accessible
- Future debugging can trace any rule back to its origin
- Anyone joining the project later can read the full bootstrap context

---

## Read order (numbered for clarity)

1. **`01-orchestration-brief-v5.md`** — THE master brief
   - Session 0 toolchain dry run (~10 min)
   - Session 1 phases A through F (~4.5 hours, 7 owner gates)
   - 14 CONVERSATION RULES verbatim
   - 5-tier priority hierarchy
   - Block typology pre-engineering Wave 1 (T1+T2+T3)
   - Domain specialist dispatch Wave 2 (S1+S2+S3+S4+S5+S6)
   - Tiered autonomous execution protocol (PERMISSIVE/STRICT/ALWAYS STRICT)
   - Repo governance + refusal patterns
   - Toolskin-architecture skill build steps
   - First commit at Phase F

2. **`02-session-0-locks.md`** — Locks after Session 0 verdict
   - Q1: Branch name = `master` (no rename)
   - Q2: Skip B.1 + B.4 (Superpowers + skill-creator already user-scope)
   - Q3: Keep Session 0 verification log in first commit
   - Updated B.7 installation summary template

3. **`03-gate-1-locks.md`** — Locks after Phase A inventory
   - Q1: Path correction → `docs/PRE-REFACTORING-PLAN-15-04-2025/` (not `design-system-audit/`)
   - Q2: Active CSS file = `assets/css/toolskin.css` (April's `toolskin-merged-*` mention is stale)
   - Q3: April ARCHITECTURE canonical, April EXECUTION superseded
   - Q4: TASK.md deferred (sub-agents load on demand)
   - Acknowledges cascade-sensitivity rule, @taxonomy_chips_strip 10 protected values, ts-marquee duplicates flagged for T1
   - **Contains contradiction-resolution footer**: the "owner types CLI commands" line was superseded by file 04

4. **`04-b3-non-interactive-install.md`** — Non-interactive ECC install
   - REPLACES the interactive picker approach (100+ skills, unusable)
   - Agent runs all installs in Claude Code Desktop's bash tool
   - 9 ECC skills (expanded from original 3):
     - design-system, accessibility, code-tour, codebase-onboarding, context-budget, browser-qa, architecture-decision-records, configure-ecc, council
   - Three fallback syntax options for `--skill` flag
   - Establishes "agent owns interactive installs" rule for Phase E SKILL.md

5. **`05-tier-priority-absorption.md`** — Skill priority hierarchy + ECC conflict audit
   - TIER 1 (AUTHORITATIVE) — toolskin-architecture + in-house design-tokens + expert-designer + typography-master
   - TIER 2 (WORKFLOW) — designer-skills + Superpowers
   - TIER 3 (DIAGNOSTIC) — ECC design-system (Audit mode only) + ECC accessibility
   - TIER 4 (DELIBERATION) — ECC council (default) + yogirk agent-council (high-stakes only)
   - TIER 5 (SUPPORTING) — utility skills + apcach
   - ECC design-system Mode 1 (Generate) declared OFF-LIMITS for Toolskin (would propose competing tokens)
   - ECC audit filter list: intentional gradients, OKLCH-derived colors, Space Grotesk, harmonic ladder, substring distribution selectors
   - In-house skills update todo (cascade-sensitivity rule, @taxonomy_chips_strip, surface superposition, etc.)
   - B.8 yogirk council install conditional on Codex + Gemini CLI presence
   - B.9 in-house skill migration procedure (locate on Windows disk, copy, slim expert-designer by dropping enfold-samples.md)
   - B.11 updated B.7 installation summary table

6. **`06-rule-15-apcach-supreme.md`** — Rule 15 (apcach as non-overridable color authority)
   - apcach (antiflasher, MIT, Evil Martians) is THE color substrate
   - Build-time at `tools/color-engine/` generates canonical OKLCH primitives with verified APCA contrast
   - Optional runtime via `toolskin.js` for accent recalculation
   - Sub-agent S1 mandate updated: every primitive apcach-derived, build script `tools/color-engine/generate-colors.js` is a deliverable
   - Sub-agent S2 mandate updated: system layer consumes apcach output via CSS `oklch()`/`color-mix()`
   - Wave 1 T1/T2/T3 briefs updated with color contract field
   - ECC design-system audit filter list extended (color consistency dimension, slop detection, dark mode dimension all defer to apcach)
   - In-house design-tokens skill update todo extended with apcach migration
   - Phase F commit message includes Rule 15 establishment block

7. **`07-repo-binding-clarification.md`** — Two-repo isolation (binding)
   - Canonical project = `toolskin-rebuild/` (this repo, branch `master`, where ALL work happens)
   - Reference = `toolskin-showcase/` (frozen, read-only forever, sibling folder, separate repo)
   - Language clarification: "the project" = rebuild; "the reference" = showcase; reference is NEVER main in any sense
   - Hard isolation rules: no `cd` into reference, only relative-path reads, no git ops against reference
   - S6 governance + pre-commit hook prevents accidental writes to reference
   - Encoded in `CLAUDE.md` at repo root + toolskin-architecture SKILL.md REPO MODEL section

---

## Contradiction resolution map

This is the canonical resolution of contradictions found across the files (in evolution order):

| Earlier file | Said | Superseded by | Now says |
|---|---|---|---|
| `03-gate-1-locks.md` final line | "prompt me at each install, I'll type them in CLI" | `04-b3-non-interactive-install.md` | Agent owns interactive installs end-to-end via non-interactive flags |
| Original B.3 plan in `_archive/b2-b3-execution-original.md` | "B.3 = owner runs in terminal picker, picks 3 ECC skills" | `04-b3-non-interactive-install.md` | Agent runs B.3 non-interactively with 9 ECC skills |
| `_archive/skills-delta-no-replan.md` Q3 absorption section | Earlier 5-tier hierarchy proposal | `05-tier-priority-absorption.md` | Final 5-tier hierarchy with ECC Mode 1 OFF-LIMITS verdict |
| 14 CONVERSATION RULES in `01-orchestration-brief-v5.md` | Rules 1-14 only | `06-rule-15-apcach-supreme.md` | Rules 1-14 + Rule 15 (apcach color authority) |
| `01-orchestration-brief-v5.md` "Repo model" section | Mentions reference path but not full isolation rules | `07-repo-binding-clarification.md` | Two-repo isolation with hard rules — reference NEVER main, no `cd`, no git ops, only relative reads |

When in doubt: the higher-numbered file is canonical. The earlier file is historical context.

---

## `_archive/` subfolder

Contains superseded versions kept for historical reference only:

- `brief-v1.md` — Original orchestration brief (pre-apcach, pre-block-typology)
- `brief-v2.md` — Added apcach as 5th tool + orchestrator pattern
- `brief-v3.md` — REBUILD-via-sandbox reframe (not in-place refactor)
- `brief-v4.md` — Block-layer pre-engineering + 14 rules + autonomous protocol
- `skills-delta-no-replan.md` — Precursor to `05-tier-priority-absorption.md`
- `b2-b3-execution-original.md` — Precursor to `04-b3-non-interactive-install.md` (interactive picker plan)

**Do not reference `_archive/` as binding instruction.** Only files numbered 01–06 in the parent folder are binding. The archive shows how the orchestration evolved.

---

## What's binding going forward

After Phase E lands (toolskin-architecture skill built), binding instruction lives at:

- **`.claude/skills/toolskin-architecture/SKILL.md`** — auto-loads at every session, encodes 14 + Rule 15 conversation rules + 5-tier priority + block typology + autonomous protocol + refusal patterns
- **`docs/handoffs/_session-1-orchestrator-synthesis.md`** — produced at Phase D Wave 2 ponderation, defines Session 2-N sequencing
- **`docs/handoffs/_rebuild-*-spec.md`** — 9 sub-agent specs covering color foundation, system layer, component registry, build pipeline, autonomous protocol, governance, block typology, base context, adaptive integration

The session-1-bootstrap/ folder (this folder) is the HISTORICAL BOOTSTRAP RECORD, not active instruction.

---

## Commit hash this bootstrap belongs to

This folder is staged in Session 1's first commit at Phase F (the fresh-repo baseline commit). See that commit's message for the full inventory of what landed alongside this folder.

---

## For the next session opening this folder

If you're starting Session 2 (primitives foundation rebuild) and somehow ended up reading this README first — STOP. Go read `.claude/skills/toolskin-architecture/SKILL.md` instead. That skill auto-loads and is the binding rule set. This folder is the WHY behind those rules, not the rules themselves.

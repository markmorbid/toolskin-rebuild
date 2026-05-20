# Toolskin Rebuild — Project Conventions

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

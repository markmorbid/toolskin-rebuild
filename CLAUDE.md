# Toolskin Rebuild — Project Conventions

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

## Owner

Satoshi / SatSea

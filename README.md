# Toolskin Rebuild

Fresh-from-scratch rebuild of the Toolskin design system. Block-by-block, sandbox-isolated, token-driven, framework-agnostic.

## Status

In active rebuild. The previous Toolskin v1 lives at `../toolskin-showcase/` as read-only reference.

## Structure

- `assets/css/next/` — production CSS rebuild target
- `sandbox/` — per-block isolated test pages
- `tools/color-engine/` — apcach (build-time only)
- `docs/handoffs/` — all specs, synthesis, session state
- `.claude/skills/` — auto-loading architectural skill

## Read the skill first

Before any work in this repo, the toolskin-architecture skill auto-loads and encodes the rebuild approach, conversation rules, and refusal patterns. Read `.claude/skills/toolskin-architecture/SKILL.md`.

## Reference

The old repo at `../toolskin-showcase/` is the visual + functional reference. Read constantly, never modify.

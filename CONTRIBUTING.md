# Contributing to Toolskin Rebuild

This repo is the canonical Toolskin Design System project. Every contributor — human or agent — works under the governance below. Full architectural detail: `.claude/skills/toolskin-architecture/SKILL.md` (auto-loads every session).

## Repo model

- **`toolskin-rebuild/`** (this repo) — canonical. Branch `master`. All work happens here.
- **`../toolskin-showcase/`** — the old repo, **read-only reference forever**. Never write, never commit, never `cd` into it.

## The 15 conversation rules (binding)

Full verbatim text: `.claude/skills/toolskin-architecture/references/conversation-rules-verbatim.md`. In brief:

1. Zero framework dependencies. One stylesheet. Full dynamic control.
2. Token-driven + derivative-math-driven, not class-driven like Tailwind.
3. The `ts-marquee` pattern is canonical — data attributes, JS builds DOM, CSS via tokens; optional behaviour is opt-in via `data-*`, never class modifiers.
4. Surface superposition awareness is core, not patch-work.
5. Drop-in for anybody (AI / WordPress / Vue / React / static) — the product differentiator.
6. Old `toolskin.css` is a reference prototype — read constantly, modify never.
7. Block-by-block sandbox with ONE reusable `sandbox/_base.html`.
8. Cascade-sensitivity — explicit `:is(...)` enumeration, not substring distribution.
9. `@taxonomy_chips_strip` 10 protected values are locked design input.
10. Owner manual changes are authoritative — never silently revert.
11. Halt on anomaly, never improvise.
12. New repo only — old repo read-only.
13. No Node.js runtime deps in the shipped product — apcach/build tooling is build-time only.
14. Fresh git history.
15. Extended Rule 15 — apcach is the supreme authority for the entire color derivation chain; tokens decide *which* color, the engine decides *how much*; no per-theme hand-tuning.

## Owner gate workflow

Sub-agents PROPOSE. The orchestrator WEIGHS. The owner DECIDES. At every gate: stop, surface findings, wait for explicit "proceed". Halt points are surfaced, never auto-resolved (Patterns 16 / 17 / 18 — council fundamentals, visual audit, quota safety).

## Refusal patterns — halt and surface to the owner when triggered

- **R-repo-isolation** — any write/commit/`cd` into `../toolskin-showcase/`.
- **R-rule-15** — component CSS referencing `--ts-bg-0..5` primitives directly instead of `--ts-this-bg` derivatives; or any hand-picked hex / non-apcach color.
- **R-cascade** — substring-distribution selectors where explicit `:is(...)` is required.
- **R-D3-dual-emit** — an `oklch()` primitive without a paired sRGB (`#hex`) fallback.
- **R-OQ-B3** — adding an `800` font-weight, a `--ts-font-weight-extra-bold` token, or a variable-axis `wght@300..900` requirement (Wave 1.6 — 6-step ladder, no 800).
- **R-D8** — a `Toolskin.setTheme()` value other than `light` / `dark` / `auto`.
- **R-pattern-opt-in** — a component optional behaviour exposed as a class modifier instead of a `data-*` attribute + token.
- **R-D4** — a hardcoded `toolskin@1` npm string before npm-name verification is logged.
- **R-A1** — a block missing its `@ts-deps` header, a dependency cycle, or sandbox `<link>` order disagreeing with the bundler topo-sort.
- **R-DNA-1..6** — visual-identity anti-patterns (finalized in Session 1.5 housekeeping).

## Pre-commit hook

The repo ships a pre-commit hook that validates repo isolation, dual-emission, the font-weight ladder, and the visual-audit gate. It lives outside git tracking, so **install it after every fresh clone**:

```sh
cp tools/governance/pre-commit .git/hooks/pre-commit
chmod +x .git/hooks/pre-commit
```

The canonical copy is `tools/governance/pre-commit`. The hook is defensive — checks skip gracefully when their targets do not yet exist.

## CSS / file-editing discipline

- Never auto-format CSS — editor format-on-save stays disabled (`.vscode/settings.json` is tracked to enforce this).
- Build tooling (apcach, Playwright) lives under `tools/` as build-time only; `node_modules/` is gitignored (Rule 13).
- Specs are markdown in `docs/handoffs/`. Block CSS goes in `assets/css/next/` and `sandbox/` only, in the relevant session.

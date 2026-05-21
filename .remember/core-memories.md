# Toolskin Rebuild — Core Memories

## Project

Toolskin Design System Rebuild. Branch `master` in `toolskin-rebuild/`. Reference repo `../toolskin-showcase/` is read-only forever.

## Wave 1.6 canonical values (BINDING — visual reality wins)

- **Base font size: 13px** (CONFIRMED — toolskin.css:287, RULING 3. Wave 1.6 branding preview was misleading.)
- **Weight ladder: 300/400/500/600/700/900 — NO 800** (Space Grotesk ships 300–700; OQ-B3 abandoned)
- **Radius ladder: 4/6/8/10/16** (+ 9999 pill, 0 sharp) — explicit, NOT calc-derived. Base = 8px.
- H1=700, H2=600. Google Fonts `wght@300..700` URL — no variable-axis.

## Session 2 scope

Write `tools/color-engine/generate-colors.js` — does NOT exist yet. This script imports apcach and emits `assets/css/next/primitives/colors.css`.

## Key bindings

- 15 conversation rules + Extended Rule 15: `.claude/skills/toolskin-architecture/SKILL.md`
- apcach = supreme color authority (Rule 15). No hand-tuned color values.
- Pre-commit hook: `tools/governance/pre-commit` (re-install per clone)
- In-house Tier 1 skills: design-tokens-2.0, expert-designer, typography-master

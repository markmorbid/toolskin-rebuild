# Toolskin Rebuild — Core Memories

## Project

Toolskin Design System Rebuild. Branch `master` in `toolskin-rebuild/`. Reference repo `../toolskin-showcase/` is read-only forever.

## Wave 1.6 canonical values (BINDING — visual reality wins)

- **Base font size: 13px** (CONFIRMED — toolskin.css:287, RULING 3. Wave 1.6 branding preview was misleading.)
- **Weight ladder: 300/400/500/600/700/900 — NO 800** (Space Grotesk ships 300–700; OQ-B3 abandoned)
- **Radius ladder: 4/6/8/10/16** (+ 9999 pill, 0 sharp) — explicit, NOT calc-derived. Base = 8px.
- H1=700, H2=600. Google Fonts `wght@300..700` URL — no variable-axis.

## Rulings

RULING 7: apcach is the constant engine for the entire system layer. Every mixing constant, percentage, threshold, and lightness delta in `surfaces.css` and all future system files must be apcach-derived outputs baked by `generate-colors.js` at build time. Hand-tuned literals are Rule-15 violations regardless of whether they look right. The CSS composes — apcach decides the amounts. Committed constants in `surfaces.css` (`a0ea9e4`) are provisional Rule-15-noncompliant placeholders.

## Session 2 — complete (2026-05-21)

Primitives layer shipped — 11 deliverables across 5 commits (Session 2 closed at 74bb77f). `tools/color-engine/generate-colors.js` now exists (commit 4958c87) — imports apcach, emits `assets/css/next/primitives/colors.css`. Next: Session 3 — system layer (`--ts-this-*` derivatives).

## Key bindings

- 15 conversation rules + Extended Rule 15: `.claude/skills/toolskin-architecture/SKILL.md`
- Surface presets (`TOOLSKIN_SURFACE_PRESETS`) are 10 hand-curated palettes — this IS hand-tuned by design. apcach is the contrast VERIFICATION layer only, not the color generation layer. See RULING 1.
- Pre-commit hook: `tools/governance/pre-commit` (re-install per clone)
- In-house Tier 1 skills: design-tokens-2.0, expert-designer, typography-master

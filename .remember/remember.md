# Handoff — Toolskin Rebuild

## State
**Session 2 (primitives implementation) is COMPLETE.** Session 2 commits:
- `8c6ddd7` — rename `docs/references/CLAUDE.md` → `README.md` (was auto-loading as stale nested instructions)
- `1855d11` — code-audit catalog `docs/handoffs/_code-audit-catalog.md` — binding ground truth for Sessions 2-N
- `cf1f787` — amend S1 spec §3: surfaces are presets, not apcach-derived
- `5f4a6bb` — static primitives `spacing/typography/radius/motion.css` + `sandbox/00-foundation/colors.html`
- `4958c87` — color engine `tools/color-engine/generate-colors.js` + `colors.css` + contrast report + presets JSON

`assets/css/next/primitives/` now holds the full primitive layer: `colors.css`, `spacing.css`, `typography.css`, `radius.css`, `motion.css`. APCA verification: **30/30 pairs pass**. (S1.5 closeout earlier in the session: `5fa1112`, `87c6a13`, `9452cef`, `2dd63cc`.)

## Next — Session 3: system layer
Per `_session-1-orchestrator-synthesis.md` §5 + `docs/handoffs/_rebuild-system-spec.md` (S2 spec): write `assets/css/next/system/*.css` — the `--ts-this-bg` derivative chain (surfaces / text / states) + shared-tokens layer skeleton — and the real `_base.html`.

**Deferred housekeeping — do at Session 3 startup or when owner directs:**
- S3 registry "Design DNA pointer" column; S6 R-DNA-1..6 refusal family; S5 G1 parity wiring (synthesis §3.1). Tracked as task #10.
- typography-master skill: update its base font-size to **13px** (it currently says 15px — RULING 3).
- `core-memories.md` says "Base font size: 15px" — **STALE; canonical is 13px (RULING 3).** Owner should correct that memory file.

## In-flight
Nothing. Working tree clean except owner-placed untracked files (below).

## Context — Session 2 rulings (binding)
- **R1 — surfaces = presets.** `--ts-bg-*` / `--ts-text-*` are the 10 curated `TOOLSKIN_SURFACE_PRESETS`, NOT apcach-derived. apcach 0.6.4 is the contrast layer only (verification + on-ink). apcach physically cannot step a dark surface ramp — APCA returns Lc 0 for sub-~12% lightness steps. This killed the original S1 §3 algorithm (§3 now amended).
- **R2 — `colors.css`** bakes the default pair (`dark-practical-neutral-v1` on `:root`/`[data-theme=dark]`; `light-practical-clean-v1` on `[data-theme=light]`) + all 10 presets as `.ts-preset-*` classes. Verbatim catalog: `docs/references/surface-presets-catalog.json`.
- **R3 — base font 13px** (running `toolskin.css:287`; the Wave-1.6 "15px" was a misleading branding preview). `typography.css` derives from 13px.
- **R4 — `--ts-on-accent` threshold 0.75**; `--ts-accent` = `#ff5500`.
- **R5 — spacing stops at `--ts-sp-16`** (sp-17..24 were a flagged source error).
- **R6 — no second CSS audit pass.** Catalog token blocks are complete; per-selector rule bodies deferred to Session 4+ block work (visual-audit skill handles them).
- APCA verification targets are role-calibrated floors for the *pre-tuner* base values (primary 75 / secondary 45 / muted 25 — Option 4). The running `_toolskinApplyContrastToTokenMap` (colorjs.io) tuner adjusts secondary/muted at runtime; the rebuild has NOT ported that tuner.

## Context — environment / gotchas
- `tools/color-engine/`: apcach 0.6.4 installed. `package.json` tracked (`type: module` + apcach dep). `node_modules` + `package-lock.json` gitignored (build tooling, Rule 13). Re-run: `node tools/color-engine/generate-colors.js` (deterministic — byte-identical output, exit 0 = all pairs pass).
- Pre-commit hook active at `.git/hooks/pre-commit`. With block CSS now present, @ts-deps/topo-sort + Check #12 dual-emission run on every commit; all green so far.
- Owner-placed untracked files — NOT in any session's scope, for owner triage: 2 pitchdeck-doc moves under `_components-docs/`, `_components-docs/token-validation/`, `docs/references/{toolskin-showcase-latest.html, toolskin-visual-audit-SKILL.md}`, `docs/session-1-bootstrap/{SKILL-v1.md, _phase-5-classification-applied.md}`, `.claude/settings.local.json`, and an owner GoFullPage capture under `docs/handoffs/_visual-audit/owner-ground-truth/`.
- remember plugin empties the working-tree `remember.md` on session start; the committed version is the durable record (`git show HEAD:.remember/remember.md`).
- Windows long-path gotcha: a 213-char file under `docs/references/mockup/...` needs one-shot `git -c core.longpaths=true` for `git add` of that path.

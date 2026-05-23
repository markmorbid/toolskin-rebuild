# Session 3 — RULING 7 Re-grounding Dispatch
**To:** Code Desktop agent
**Gate:** surfaces.css re-grounding under RULING 7
**Status:** Council cleared (4 voices, anti-anchored). Constant table approved. Pattern-16 resolved Option B.

---

## Step 0 — Write RULING 7 to memory (before anything else)

Write to `.remember/remember.md` and `core-memories.md` under Rulings:

```
RULING 7: apcach is the constant engine for the entire system layer.
Every mixing constant, percentage, threshold, and lightness delta in
surfaces.css and all future system files must be apcach-derived outputs
baked by generate-colors.js at build time. Hand-tuned literals are
Rule-15 violations regardless of whether they look right.
The CSS composes — apcach decides the amounts.
Committed constants in surfaces.css (a0ea9e4) are provisional
Rule-15-noncompliant placeholders.

RULING 7 CONSTANT TABLE (approved):
  border-rest       Lc 15   --ts-mix-perc
  border-0          Lc 8    soft hairline
  border-hover      Lc 30   --ts-mix-perc-hover
  border-active     Lc 30   accent-tinted
  border-disabled   Lc 8
  border-focus      accent pass-through — no Lc target
  dark (recessed)   Lc 8    --ts-this-bg-grad-dark-pct
  bright (raised)   Lc 6    --ts-this-bg-grad-bright-pct
  hover-surface     Lc 12
  active-surface    Lc 8
  disabled-bg       Lc 18
  text primary / secondary / muted   Lc 75 / 45 / 25  (Session 2)
  border-dim        ratio of border-rest via Engine-Anchored Derivation
  grad-angle        geometry-exempt — named allowlist

PATTERN-16 RESOLUTION — Option B:
  generate-colors.js bakes constants per preset (not 300 resolved
  colors). surfaces.css composes with those constants. Engine owns
  the amounts. CSS composes. Path-A opt-in required for arbitrary
  runtime surfaces (AI builder / custom brand).
```

Commit:
```
git commit -m "ruling(canon): encode RULING 7 — apcach is the constant engine for the system layer"
```

Report the commit hash. Then load skills and proceed.

---

## Step 1 — Load skills (all agents, before any file editing)

```
.claude/skills/toolskin-architecture/SKILL.md    ← load first, every agent
.claude/skills/rebuild-orchestration/SKILL.md
.claude/skills/toolskin-visual-audit/SKILL.md    ← mandatory for Agent C
.claude/skills/design-tokens-2.0/SKILL.md
```

---

## Step 2 — Dispatch 3 agents (sequential, fresh context per agent)

### AGENT A — Color Engine
**Runs first. Others depend on its output.**
Fresh context. Load: `toolskin-architecture` + `design-tokens-2.0` skills.

**Read before writing:**
- `tools/color-engine/generate-colors.js`
- `assets/css/next/primitives/colors.css`
- `docs/handoffs/_rebuild-system-spec.md` §3
- RULING 7 constant table above

**Task:** Extend `generate-colors.js` to bake the RULING 7 surface derivative constants.

For each of the 10 presets × 2 themes (dark/light), use apcach to solve each Lc target and output a CSS custom property into a new `surface-constants` block in the generated `colors.css`.

**Lc targets to solve (per preset per theme):**

| Output token | Lc target | Relationship |
|---|---|---|
| `--ts-mix-perc` | Lc 15 | border rest vs surface |
| `--ts-mix-perc-0` | Lc 8 | soft hairline |
| `--ts-mix-perc-hover` | Lc 30 | border hover |
| `--ts-mix-perc-active` | Lc 30 | border active, accent-tinted |
| `--ts-mix-perc-disabled` | Lc 8 | disabled border |
| `--ts-this-bg-grad-dark-pct` | Lc 8 | recessed surface delta |
| `--ts-this-bg-grad-bright-pct` | Lc 6 | raised surface delta |
| `--ts-mix-perc-hover-surface` | Lc 12 | hover surface lift |
| `--ts-mix-perc-active-surface` | Lc 8 | pressed surface |
| `--ts-mix-perc-disabled-bg` | Lc 18 | disabled bg wash |

**Engine-Anchored Derivation (no APCA meaning — bake as fixed ratio):**
- `--ts-dim-alpha` — ⅔ of the opacity that achieves `--ts-mix-perc-0` visually. All dim-2/3/4 are ratios of this anchor.
- `grad-angle` (136deg) — geometry-exempt. Add to a named allowlist in `generate-colors.js` with comment: `"geometry — no Lc meaning"`.

**Add this comment block to `generate-colors.js` output:**
```
/* Constants above are apcach-correct for the 10 curated presets.
   Arbitrary runtime surfaces (custom brand, AI-builder) require
   Path-A runtime apcach derivation. Build-time baking is NOT a
   guarantee for novel surfaces. */
```

**Output:** updated `tools/color-engine/generate-colors.js` + regenerated `assets/css/next/primitives/colors.css`.

Report: `"Agent A done — colors.css updated."` Do not commit. Agent B reads the output.

---

### AGENT B — CSS Regeneration
**Runs after Agent A reports done.**
Fresh context. Load: `toolskin-architecture` + `design-tokens-2.0` skills.

**Read before writing:**
- Updated `colors.css` (Agent A output)
- Current `surfaces.css` (`a0ea9e4`)
- `docs/handoffs/_rebuild-system-spec.md` §3 + §10
- RULING 7 constant table above

**Task:** Rewrite `surfaces.css` to consume engine-baked constants. Remove every hand-tuned literal.

**The pattern:**
```css
/* BEFORE — hand-tuned literal (RULING 7 violation) */
color-mix(in oklch, black 20%, var(--ts-this-bg))

/* AFTER — engine-baked token reference */
color-mix(in oklch, black var(--ts-mix-perc), var(--ts-this-bg))
```

`--ts-mix-perc` is now baked per-preset by `generate-colors.js` to hit exactly Lc 15 on that preset's surface.

**Also add `--ts-this-bg-border-dim`** (new — resolves council Item 3):
Use `--ts-dim-alpha` (engine-baked) as the transparency value for the alpha border variant.

**Must NOT change:**
- The two-block architecture (`:root` inputs / `:where` derivatives)
- The hue-locked anchors (`oklch` `color-mix` stays)
- The 5-state interaction token set
- The gradient composition formulas (only amounts change)
- `grad-angle` (geometry-exempt — leave as literal with comment)

After rewriting, run:
```
node tools/color-engine/generate-colors.js
```
Confirm exit 0.

Run Playwright captures of `surfaces.html` (dark + light + hover states).
Save to `docs/handoffs/_visual-audit/sandbox/`.

Report: `"Agent B done — surfaces.css updated, captures at [paths]."` Do not commit. Agent C verifies independently.

---

### AGENT C — Verification
**Runs after Agent B reports done. Does NOT read Agent B's self-assessment.**
Fresh context. Load: `toolskin-architecture` + `toolskin-visual-audit` + `design-tokens-2.0` skills.

**The `toolskin-visual-audit` skill defines the visual verification protocol. Follow it exactly for CHECK 3 and CHECK 4.**

**CHECK 1 — RULING 7 compliance:**
Run the token-validation protocol from `design-tokens-2.0` skill against `surfaces.css`.
Grep for bare `%` literals in `color-mix()` calls.
Any literal not referencing a `--ts-*` token = RULING 7 violation = **FAIL**.
Report: list any remaining literals found.

**CHECK 2 — Token completeness:**
All 19 derivative tokens present + `--ts-this-bg-border-dim` now added.
Report: present / missing per token.

**CHECK 3 — Theme symmetry** (follow `toolskin-visual-audit` skill):
Capture dark + light mode. Run computed style probe on `--ts-this-bg-border` in both themes.
Target: Lc ~15 in BOTH (within ±3 Lc = pass).
Prior failure was Lc 0.0 dark / Lc 27.5 light.
Report: dark Lc / light Lc / delta / pass or fail.

**CHECK 4 — Visual identity — Rule 5** (follow `toolskin-visual-audit` skill):
Compare dark captures against Wave 1.6 reference in `surfaces.html` reference panel.
Specific question: is the depth ladder now legible?
(`dark` / `dark-1` / `dark-2` must be distinguishable — this was HIGH-1 failure from council.)
Report: pass / fail with observation.

**CHECK 5 — Engine clean run:**
```
node tools/color-engine/generate-colors.js
```
Exit 0 = pass. Any error = fail, report stderr.

**Output:**
- `VERIFICATION PASS` — all 5 checks green → ready to commit.
- `VERIFICATION FAIL — [check] failed: [detail]` → do NOT fix, report to meta-orchestration.

---

## Step 3 — Commit (only if Agent C passes)

```bash
git add tools/color-engine/generate-colors.js
git add assets/css/next/primitives/colors.css
git add assets/css/next/system/surfaces.css
git add .remember/remember.md
git commit -m "feat(engine): RULING 7 — apcach-bake all surface derivative constants

generate-colors.js now solves 10 presets × 2 themes for all surface
relationship Lc targets (border Lc 15/30/30, dark Lc 8, bright Lc 6,
hover Lc 12, disabled Lc 18). surfaces.css consumes engine-baked
tokens — zero hand-tuned literals remain.

Pattern-16 resolved Option B: engine bakes constants, CSS composes.
Path-A boundary documented. border-dim added (Item 3).
RULING 7 compliant."
```

**HALT.** Report to meta-orchestration:
- RULING 7 commit hash (Step 0)
- Feature commit hash (this step)
- Agent C verification report (full, not summarized)
- Updated Playwright capture paths

---

## Hard blockers — stop and report at any stage

- apcach cannot solve a given Lc target on a preset (degenerate surface)
- `generate-colors.js` output structure breaks the `colors.css` import chain
- `surfaces.html` fails to load after regeneration
- Agent C reports VERIFICATION FAIL — do NOT commit, report immediately

**Do not proceed to text.css (File 2) without explicit GO from meta-orchestration.**

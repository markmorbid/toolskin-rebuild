# Session 3.x — System Extension Autonomous Directive

**Mode:** Autonomous. Halt only on genuine blockers or architectural ambiguity.
**Not on:** individual file completions or commits.
**Report back:** single completion report with all commit hashes.

---

## ORIENTATION (read before anything else)

```
1. .remember/remember.md
2. core-memories.md
3. .claude/skills/toolskin-architecture/SKILL.md
4. .claude/skills/rebuild-orchestration/SKILL.md
5. .claude/skills/design-tokens-2.0/SKILL.md
6. docs/handoffs/_rebuild-system-spec.md
7. git log --oneline -5 + git status
```

Confirm HEAD is `9291d08`. Report deviation if not.

Skill health check:
```
dir .claude\skills\
```
All 4 skills must be present before proceeding. Install any missing
from reference repo before starting work.

---

## DELIVERABLE 1 — Encode RULINGs 8-11 in memory files

Write to `.remember/remember.md` AND `core-memories.md`:

```
RULING 8: Session 3.x mandatory before Session 4. Deliverables:
  system/nesting.css, system/text.css, system/accent.css,
  surfaces.css extended + RULING 7 re-grounded.

RULING 9: Pattern 4 two-line idiom — re-anchor FIRST
  (--ts-this-bg: var(...)), consume SECOND (background-color:
  var(--ts-this-bg)). Reverse order = pre-commit violation.

RULING 10: Pattern 2 (iconlist) adoption — carry knob mechanism
  (--ts-mix-perc override), drop hardcoded 10%/7% literals.
  RULING 7 applies to any literal override.

RULING 11: Surface derivatives extended pre-emptively in Session
  3.x. No Session 4 block begins before system layer complete.

CANON: system/nesting.css is the canonical location for
  --ts-nest-radius and --ts-nest-pad. @property explainer from
  ts-panel L25-46 preserved VERBATIM. Pattern 3 travels as
  3-file unit: primitive knobs + system def + consumer.

CANON: oklch(from) runtime usage restricted to --ts-on-accent
  and --ts-on-surface only. All other usage = pre-commit violation.
```

Commit:
```
git commit -m "ruling(canon): RULINGS 8-11 + canon constraints encoded"
```

---

## DELIVERABLE 2 — Agent A: ΔL measurement + engine update

### 2a. Measure ΔL from ts-surface.css

Read:
```
docs/references/toolskin.css_extracted-core-blocks-to-refactor/ts-surface.css
```
Do NOT read raw toolskin.css.

For each sub-floor token, find the formula in ts-surface.css and
compute the OKLCH ΔL between base surface and derived variant:
- `--ts-this-bg-dark` (recessed)
- `--ts-this-bg-bright` (raised)
- `--ts-this-bg-dim` (transparent — alpha value, not ΔL)
- `--ts-this-bg-active` (pressed, if present)

The measured values ARE the canonical constants.

### 2b. Update generate-colors.js

Extend `tools/color-engine/generate-colors.js`:
- APCA (apcach) for Lc ≥ 12 constants (6 solvable — already
  identified in prior session)
- culori OKLCH ΔL for sub-floor constants (measured in 2a)
- Label each constant in output:
  `/* apcach Lc 15 */` or `/* culori ΔL −0.0XX measured from source */`
- Path-A boundary comment block (build-time baking not guaranteed
  for novel surfaces outside 10 presets)
- grad-angle on named geometry-exemption allowlist

Run: `node tools/color-engine/generate-colors.js`
Must exit 0.

### 2c. Regenerate surfaces.css

Replace every hand-tuned % literal in surfaces.css with
engine-baked token reference. Pattern:
```css
/* BEFORE */ color-mix(in oklch, black 20%, var(--ts-this-bg))
/* AFTER  */ color-mix(in oklch, black var(--ts-mix-perc), var(--ts-this-bg))
```

What must NOT change:
- Two-block architecture (:root inputs / :where derivatives)
- Hue-locked anchors
- 5-state interaction token set
- grad-angle (geometry-exempt, keep as literal with comment)

Also extend surfaces.css with:
- `--ts-this-bg-dim-5` and `--ts-this-bg-dim-6`
- `--ts-this-bg-grad-2`, `-grad-3`, `-grad-4`

Commit generate-colors.js + colors.css + surfaces.css together:
```
git commit -m "feat(engine): RULING 7 — apcach-bake surface constants + extend derivatives"
```

---

## DELIVERABLE 3 — system/nesting.css + sandbox

### 3a. Write system/nesting.css

Read ts-panel+root-debugger-component.css L25-93 from:
```
docs/references/toolskin.css_extracted-core-blocks-to-refactor/components/
```

The @property failed-self-reference explainer (L25-46) must be
preserved VERBATIM in the file comments. This is load-bearing wisdom.

Token definitions:
- `--ts-nest-radius` (@property typed <length>)
- `--ts-nest-pad` (@property typed <length>)
- `--ts-radius-nest-reduction` (primitive knob, default 2px)
- `--ts-pd-nest-reduction` (primitive knob, default 2px)

Three explicit depth selectors (cycle-free — owner proved @property
self-reference doesn't work):
```css
/* Depth 1 */ .ts-card { --ts-nest-radius: var(--ts-card-radius); }
/* Depth 2 */ .ts-card .ts-card { --ts-nest-radius: calc(var(--ts-card-radius) - 1 * var(--ts-radius-nest-reduction)); }
/* Depth 3 */ .ts-card .ts-card .ts-card { --ts-nest-radius: calc(var(--ts-card-radius) - 2 * var(--ts-radius-nest-reduction)); }
```

### 3b. Sandbox: sandbox/01-system/nesting.html

- Loads real files: colors.css + surfaces.css + nesting.css
- Shows depth-1 / depth-2 / depth-3 nested cards visually
- Shows radius + padding stepping down at each depth level
- Shows dark + light theme toggle
- Includes Wave 1.6 reference panel (nested card capture from
  docs/handoffs/_rebuild-visual-audit.md)

Commit nesting.css + nesting.html together.

---

## DELIVERABLE 4 — system/text.css + sandbox

Build per docs/handoffs/_rebuild-system-spec.md §11.

Key requirements:
- `--ts-on-surface-threshold: 0.5` (system layer token, NOT primitive)
- `--ts-on-surface: oklch(from var(--ts-this-bg) clamp(0.05, (0.5 - l) * 999, 0.95) 0 0)`
- `--ts-on-surface-dim` and `--ts-on-surface-muted` strength ladder
- `--ts-this-color` / `-secondary` / `-muted` resolve from --ts-on-surface
  (Option A — unified auto-adapt, confirmed by original toolskin.css:1049-1052)
- Text tiers: apcach-derived Lc 75 / 45 / 25

Sandbox: sandbox/01-system/text.html
- Loads Space Grotesk (NOT system-ui)
- Shows all text token pairs on every surface level
- Shows dark + light theme toggle
- Shows text on accent surface (--ts-on-accent)
- Wave 1.6 typography reference panel

Commit text.css + text.html together.

---

## DELIVERABLE 5 — system/accent.css + sandbox

Build accent derivative chain:
- `--ts-accent-dim` / `--ts-accent-1` / `--ts-accent-2` / `--ts-accent-3`
- `--ts-on-accent-dim` / `--ts-on-accent-1` / `--ts-on-accent-2`
- All apcach-derived, all dual-emitted (#hex + oklch())

Sandbox: sandbox/01-system/accent.html
- Shows accent surface variations
- Shows on-accent text contrast at each level
- Interactive accent hue picker

Commit accent.css + accent.html together.

---

## COUNCIL GATE (after all 5 deliverables)

After all deliverables are committed and sandboxes built:

Run ECC council (4 parallel fresh-context sub-agents, anti-anchored):

Each voice loads:
- .claude/skills/toolskin-architecture/SKILL.md
- .claude/skills/toolskin-visual-audit/SKILL.md
- .claude/skills/design-tokens-2.0/SKILL.md
- All 5 new sandbox screenshots (Playwright captures)
- Wave 1.6 reference for each sandbox

Council question:
"Session 3.x has completed the system extension pass. Review all
5 sandbox outputs. Does the system layer now fully support Session 4
block work? Does each output look like Toolskin? What is missing?"

Send raw council output to meta-orchestration. HALT.

---

## FINAL COMMIT + HALT

After council clears:
```
git add .remember/remember.md docs/handoffs/
git commit -m "chore(session-3x): closeout — system extension complete, Session 4 ready"
```

**Report to meta-orchestration:**
- All commit hashes in order
- Council output (raw, not summarized)
- Playwright capture paths
- Confirmation: Session 4 GO / NO-GO

---

## HARD BLOCKERS — stop and report immediately

- ts-surface.css missing or doesn't contain surface formulas
- generate-colors.js errors on run
- Any RULING conflict with measured constants
- Council NO-GO on any sandbox
- Spec gap that requires architectural decision
- Any deliverable scope larger than estimated (flag before starting)

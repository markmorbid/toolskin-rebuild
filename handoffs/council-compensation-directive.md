# DIRECTIVE — Council on the Owner's CSS Work (NO COMMIT)

**Runs AFTER the rules system is installed (so voices load lean, scoped files).**
**Purpose: decide how to integrate the owner's day of CSS work + notes +**
**the broken-surface fix into the rebuild. NO COMMIT during deliberation.**

## §1 — Orchestrator rules
1. Dispatch 4 voices. Do not deliberate yourself.
2. Fresh context each. Anti-anchored. No voice sees another's output.
3. Collect, synthesize, HALT. No commit until owner approves.
4. Confirm "ORCHESTRATOR CONFIRMED + HEAD" before dispatching.

## §2 — What the council is integrating

The owner spent a full day hand-fixing CSS and embedding extensive notes.
That work is REFERENCE ONLY (owner ruling) — agents read it to fix the
broken dark-surface conversions; they do NOT merge it directly.

Inputs each voice loads (all LEAN, all on disk now):
- `.claude/rules/05-owner-notes.md`        (the notes, verbatim)
- `decisions/color-system.md`              (engine + dark-surface fix)
- `decisions/system-layer-status.md`       (B1/B2/B3 + convergence)
- `decisions/font-scaling.md`              (the OPEN semantic-units question)
- `backups/oklch-surface-system-PREVIOUS.css` (the corrected surface math)
- `audit/checklist.md`                     (the FAIL conditions)
- `expert-designer/SKILL.md` + `ANTI-DEFAULT-PROTOCOL.md`

Do NOT make voices read raw 1500-line CSS files. The decisions/ files
are the distilled, lean inputs. That is what killed the council twice
before — context exhaustion from reading raw CSS. This time they read
the externalized decisions, not the raw source.

## §3 — Council questions (all 4 voices answer)

1. **Dark-surface fix**: backups/oklch-surface-system-PREVIOUS.css recesses
   toward oklch(0 0 0) instead of the floor anchor. Does this correctly fix
   the degeneracy in the current system/surfaces.css? What is the exact
   edit to surfaces.css? (Concrete diff, not analysis.)

2. **Owner notes integration**: the notes specify (a) color engine delegated
   out of general tokens, (b) borders derived from text tokens not
   currentColor, (c) alternating surfaces become contrast-driven, (d) grid
   background tokenized via .bg-grid. Which are Session 3.x (now) vs Session 4+
   (later)? Order them.

3. **Font scaling (decisions/font-scaling.md)**: read
   font-scaling-math-experiment.html. Does the width-aware semantic-unit model
   IMPROVE or REPLACE the numeric ladder? What is the minimum adoption scope?
   (Owner flagged responsive titles as primary use case.) RULING 3 OVERRIDE
   means base size is settled — this is about naming + scaling mechanism only.

4. **B1/B2/B3 confirmation**: do the three blockers in system-layer-status.md
   still hold? Is the order (B1 naming → B2 text.css+accent.css → B3 mono)
   correct? Any new blocker the owner's CSS work surfaces?

## §4 — Each voice's lens
- Skeptic: what breaks identity if integrated wrong?
- Critic: would a Toolskin user still recognize it (Rule 5)?
- Architect: three-tier compliance + RULING 7 + exact edits.
- Pragmatist: minimum work to unblock, dependency order, time estimates.

Every answer must be CONCRETE — a diff, an order, a file, a number.
"Looks good" / "should consider" = invalid. Criticism without a
concrete proposal = invalid (owner rule).

## §5 — Synthesis
Write to `handoffs/_owner-css-integration-council.md`:
- The dark-surface fix: exact surfaces.css edit (agreed)
- Owner-notes integration order (Session 3.x vs 4+)
- Font-scaling ruling: improve/replace + minimum scope
- B1/B2/B3 confirmed order + any new blocker
- ONE-PAGE action list, dependency-ordered, with effort estimates

## §6 — HALT
Show owner the synthesis. NO COMMIT. NO audit. NO browser.
Owner approves the integration plan before any file changes.

## §7 — Hard blockers
- Any voice reads a raw CSS file instead of the decisions/ inputs (context risk)
- Any voice produces analysis without a concrete edit/order/number
- Synthesis recommends merging owner's CSS directly (it is REFERENCE ONLY)
- Any commit before owner approval

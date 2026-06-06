# Rulings — Binding Decisions (R1–R11)

**These are settled. Do not re-litigate. Do not "improve" without owner GO.**

## R1 — Surfaces are curated, not derived
10 hand-curated presets (5 dark + 5 light). NOT apcach-generated.
apcach is the contrast VERIFICATION layer, not the surface generator.

## R2 — colors.css bakes one default + variant classes
One default preset at `:root` + all 10 as `.ts-preset-*` classes.

## R3 — BASE FONT: OVERRIDE (owner-authorized 2026-05-24)
The 13px base restriction is ANNULLED. The scaling system is flexible.
Effective base may resolve to 16px or any mathematically stable value.
Width-aware font scaling model is the spec (reference:
docs/references/_components-docs/font-scaling-math-experiment.html).
ONLY acceptance criteria: mathematical stability + token inheritance
consistency. No visual aberration, no misleading behavior, no
structural misalignment. See decisions/font-scaling.md for the OPEN
question on semantic units (xs/sm/lg/xl) vs numeric ladder.

## R4 — --ts-on-accent threshold = 0.75
Auto-ink flips white/black on accent backgrounds at L 0.75.

## R5 — Spacing stops at --ts-sp-16 (64px)
sp-17 through sp-24 DROPPED. Large gaps use fluid --ts-section-pad
(clamp), not ladder steps.

## R6 — No second CSS audit pass needed
The audit calibration is settled.

## R7 — apcach is the constant engine for the system layer
CSS composes; apcach decides the amounts.
Dual-metric: APCA for Lc ≥ 12, culori OKLCH ΔL for sub-floor constants.
Pattern-16 Option B: engine bakes constants PER PRESET at build time.
Status: ΔL measured (docs/handoffs/_ruling-7-deltal-measurement-report.md).
Engine bake NOT yet applied — runs parallel to Session 4, not a blocker.
Dark-surface degeneracy fix: recess toward oklch(0 0 0), NOT toward
floor anchor. See decisions/color-system.md + backups/oklch-surface.

## R8 — Session 3.x (system extension) before Session 4 blocks
The system layer must be complete before component block work begins.

## R9 — Pattern 4 two-line idiom: re-anchor FIRST, consume SECOND
Set --ts-this-bg: var(...) BEFORE consuming any --ts-this-bg-* derivative.
Reverse order is a pre-commit violation.

## R10 — Pattern 2 (iconlist): carry knob, drop literal
Carry the --ts-mix-perc override mechanism. Drop hardcoded 10%/7% literals.

## R11 — Surface derivatives extended pre-emptively in Session 3.x
dim-5/6, grad-2/3/4 added before blocks need them.

## RULING 7 CONSTANT TABLE (approved)
```
border-rest   Lc 15    border-hover  Lc 30    border-active Lc 30
border-0      Lc 8     border-disabled Lc 8   border-focus = accent
dark          Lc 8     bright        Lc 6     hover-surface Lc 12
active        Lc 8     disabled      Lc 18    text 75/45/25
grad-angle = geometry-exempt
```

## OWNER PICKS (confirmed this session)
- Session 3.x before Session 4: YES
- Two-line idiom order: re-anchor first, consume second
- Pattern 2: carry knob, drop literal
- Surface derivatives: pre-emptive extension

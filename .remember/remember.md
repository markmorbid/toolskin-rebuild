# Toolskin Rebuild — Session Handoff
_Restored from core-memories.md — Session 3.x start._

## State
HEAD: 9291d08 (session artifacts + reference repo restructure — 126 files)
Session 3.x in progress. System extension pass.

## Active RULINGs
- RULING 1: Surfaces = 10 hand-curated presets. NOT apcach-derived.
- RULING 2: colors.css bakes one default + all 10 as .ts-preset-* classes.
- RULING 3: --ts-fs-base: 13px. NOT 15px, NOT 16px.
- RULING 4: --ts-on-accent threshold = 0.75.
- RULING 5: Spacing stops at --ts-sp-16. sp-17..24 dropped.
- RULING 6: No second CSS audit pass needed.
- RULING 7: apcach is the constant engine for entire system layer.
  CSS composes — apcach decides the amounts.
  Dual-metric: APCA for Lc≥12, culori OKLCH ΔL for sub-Lc-10.
  Baked by generate-colors.js at build time.
- RULING 8: Session 3.x mandatory before Session 4.
- RULING 9: Pattern 4 — re-anchor FIRST, consume SECOND.
- RULING 10: Pattern 2 — carry knob mechanism, drop hardcoded literals.
- RULING 11: Surface derivatives extended pre-emptively in Session 3.x.

## RULING 7 constant table (approved)
border-rest Lc 15 · border-hover Lc 30 · border-active Lc 30
border-0 Lc 8 · border-disabled Lc 8 · border-focus = accent pass-through
dark Lc 8 · bright Lc 6 · hover-surface Lc 12
active Lc 8 · disabled Lc 18 · text Lc 75/45/25
border-dim = ratio of border-rest (Engine-Anchored Derivation)
grad-angle = geometry-exempt (named allowlist in generate-colors.js)
Pattern-16 Option B: engine bakes constants per preset, CSS composes.
APCA loClip floor: sub-Lc-10 constants use culori ΔL measured from ts-surface.css.

## Owner picks (confirmed)
- PICK 1 YES: Session 3.x before Session 4
- PICK 2 YES: re-anchor first, consume second (two-line idiom)
- PICK 3 YES: Pattern 2 — carry knob, drop literal
- PICK 4 YES: pre-emptive surface derivative extension

## Canon constraints
- oklch(from) runtime: only --ts-on-accent and --ts-on-surface permitted
- Pattern 3 travels as 3-file unit (knobs + system def + consumer)
- @property explainer from ts-panel L25-46: preserve VERBATIM in nesting.css
- View-private cartels must consume system derivatives, never --ts-bg-N direct
- footer.css primitive redefinition: P0 — rebuild not refactor (Session 4)

## Session 3.x deliverables (in-flight)
- [ ] RULING 7 constants re-grounded (Agent A ΔL measurement)
- [ ] system/nesting.css + sandbox
- [ ] system/text.css + system/accent.css + sandbox
- [ ] surfaces.css extended (dim-5/6, grad-2/3/4)
- [ ] Skills installed (impeccable pack + web-accessibility)
- [ ] Agent Teams enabled
- [ ] .impeccable.md created

## Reference paths
Canonical CSS: docs/references/toolskin.css_toolskin-showcase[latest_cannonical_reference].css
Extracted blocks: docs/references/toolskin.css_extracted-core-blocks-to-refactor/
Surface block: docs/references/toolskin.css_extracted-core-blocks-to-refactor/ts-surface.css
Font scaling experiment: docs/references/_components-docs/font-scaling-math-experiment.html
Negative radius experiment: docs/references/_components-docs/negative-border-radius-experiment.html

# OBJ 3 — Encode Owner Picks + Commit Council + Proceed to Agent A

## STEP 1 — Encode owner picks as RULINGs in both memory files

Write to `.remember/remember.md` AND `core-memories.md` under Rulings:

```
RULING 8 — Session 3.x system extension pass before Session 4
A Session 3.x pass is mandatory before Session 4 block work begins.
Deliverables: system/nesting.css, system/text.css, system/accent.css,
surfaces.css extended (dim-5/6, grad-2/3/4), RULING 7 constants
re-grounded. Session 4 does NOT open until Session 3.x is complete
and meta-orchestration issues explicit GO.

RULING 9 — Pattern 4 two-line idiom canonical order
The rebuild spec mandates: re-anchor FIRST (--ts-this-bg: var(...)),
consume SECOND (background-color: var(--ts-this-bg)).
This order is enforced in all component and view-tier files.
Reverse order is a pre-commit violation.

RULING 10 — Pattern 2 (iconlist) adoption: carry knob, drop literal
The iconlist+featlist LAYER-1/LAYER-2 template is adopted as canonical
for all Session 4+ molecular components. The knob mechanism
(--ts-mix-perc override) carries forward. The hardcoded 10%/7%
literals at L139/154/158 do NOT carry forward — RULING 7 applies.
The fix is implicit in the rebuild's engine-baked --ts-mix-perc.

RULING 11 — Surface derivatives: pre-emptive extension in Session 3.x
Missing surface derivatives (dim-5/6, grad-2/3/4) are added
pre-emptively in the Session 3.x extension pass, not on-demand.
No Session 4 block begins before the system layer is complete.
```

Also encode these council convergences as canonical (no owner pick
needed — all 4 voices agreed):

```
CANON — Pattern 3 nest-reduction belongs at SYSTEM tier
system/nesting.css is the canonical location for --ts-nest-radius
and --ts-nest-pad tokens. The @property failed-self-reference
explainer from ts-panel L25-46 must be preserved VERBATIM in the
rebuild's nesting.css comments. This is load-bearing wisdom.

CANON — Pattern 3 travels as a unit of three files
Primitive knobs (root-tokens) + system definition (nesting.css)
+ consumer (component file). Never split.

CANON — oklch(from) runtime usage restricted
Only --ts-on-accent and --ts-on-surface are permitted to use
oklch(from) at runtime. All other oklch(from) usage is a
pre-commit violation.

CANON — View-private cartels must consume system derivatives
View-tier files must never reference --ts-bg-N primitives directly.
They alias the public surface chain via private --_view-* tokens.
```

Commit memory files:
```
git add .remember/remember.md .remember/core-memories.md
git commit -m "ruling(canon): RULINGS 8-11 + 4 council convergences encoded

R8: Session 3.x mandatory before Session 4
R9: Pattern 4 two-line idiom — re-anchor first, consume second
R10: Pattern 2 adoption — carry knob, drop literal
R11: Surface derivatives — pre-emptive in Session 3.x
Canon: nesting.css system tier, oklch(from) restriction,
view-private cartel discipline, Pattern 3 three-file unit"
```

Report hash. Then Step 2.

---

## STEP 2 — Commit council output file

```
git add docs/handoffs/_extracted-blocks-catalog-council.md
git commit -m "docs(council): extracted-blocks council output — 4 voices, owner picks resolved

RULINGS 8-11 issued from council deliberation.
4 Pattern 8 disagreements resolved by owner.
~15 proposed RULINGs surfaced — RULINGS 8-11 encoded,
remainder deferred to meta-orchestration review."
```

Report hash. Then Step 3.

---

## STEP 3 — Agent A: dual-metric engine (ΔL measurement)

Option B approved. Dual-metric engine.
APCA governs Lc ≥ 12 constants (already solved in prior session).
culori OKLCH ΔL governs sub-floor constants.

Read this file for ΔL measurement:
```
docs/references/toolskin.css_extracted-core-blocks-to-refactor/ts-surface.css
```

Do NOT read raw toolskin.css (32k lines). The owner already isolated
the surface block. That is the measurement source.

Workflow:
1. Read ts-surface.css
2. Find the existing dark / bright / dim surface derivations
3. For each sub-floor relationship, compute:
   - What is --ts-this-bg base lightness (L value in OKLCH)?
   - What is the derived variant's lightness?
   - ΔL = derived L minus base L
4. The measured ΔL values ARE the canonical constants.
   Not proposals. Not estimates. Measurements from source.

Sub-floor tokens to measure (these 4 could not be solved by APCA):
- --ts-this-bg-dark    (recessed surface)
- --ts-this-bg-bright  (raised surface)
- --ts-this-bg-dim     (transparent variant — note alpha, not ΔL)
- --ts-this-bg-active  (pressed surface — if present in ts-surface.css)

Report:
- The exact CSS from ts-surface.css for each token
- The measured ΔL or alpha value
- Which default preset surface was used as measurement base

HALT after reporting. Do not write to generate-colors.js yet.
Await GO from meta-orchestration.

---

## Hard blockers — stop and report

- ts-surface.css not found at expected path
- ts-surface.css does not contain the surface derivation formulas
- Any RULING conflict with the encoded constants

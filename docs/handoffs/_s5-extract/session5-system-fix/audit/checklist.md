# Audit & Enforcement Checklist

**Grep-based detection. FAIL conditions are hard stops.**
**No implementation work before audit completion on touched files.**

## 0. Global rule
Any commit before audit on changed files → REJECT.

## 1. Owner notes ingested
All @OWNER_NOTE / @OWNER_FIX / @CRITICAL / @OWNER_REVIEW / @OWNER_DIRECTIVE
comments appear in the audit report, grouped by topic, verbatim.
```
grep -RIn "@OWNER" .
grep -RIn "OWNER_NOTE\|OWNER_FIX\|CRITICAL\|OWNER_REVIEW\|OWNER_DIRECTIVE" .
```
FAIL: any note missing or summarized-only.

## 2. Color system
```
grep -RIn "color-mix" . | grep -v "in oklch"   # FAIL: srgb mixes in system layer
grep -RIn "currentColor" .                      # FAIL: border using currentColor globally
grep -RIn "background-color:.*accent" .          # FAIL: pure accent as background
```
FAIL: purple-drift mix without desaturation; raw accent background; no contrast token.

## 3. Spacing / scaling
```
grep -RIn "padding:\|margin:\|gap:" . | grep -E "[0-9]+px"   # raw px in components
```
FAIL: hardcoded spacing (must be --ts-sp-* or fluid clamp). sp-16 ceiling (R5).

## 4. Layout — grid, not stacks
```
grep -RIn "display: grid\|grid-template" .
```
FAIL: multi-section UI with only stacked vertical blocks, no grid, no asymmetry.

## 5. Grid background system
```
grep -RIn "background-image" .
```
FAIL: grid tied to a specific surface; not reusable via .bg-grid class;
background shorthand overriding the surface color layer.

## 6. Focus / accent backgrounds
FAIL: pure accent as a focus background; un-dimmed bright focus surfaces.

## 7. Design pattern compliance
Layout must originate from an approved starter (expert-designer/starters/).
FAIL: invented layout; centered vertical stack; no visual hierarchy.
Run: node expert-designer/scripts/audit-boring.mjs <file>  (must exit 0)
Run: node expert-designer/scripts/audit-design.mjs <file>  (must exit 0)

## 8. File preservation
```
git diff --name-status   # FAIL on D (deletion) where refactor was intended
```
FAIL: file deleted instead of refactored in place. Section color fixes preserved.

## 9. HTML / CSS / JS separation
FAIL: inline <style> or <script> in HTML; disposable one-off classes.

## 10. Nested component pattern (CSS-1)
FAIL: .component:hover declared outside the component block.
FAIL: duplicated component block across contexts instead of token override.

## 11. Council gate (mandatory before implementation)
Deliverables required: raw note extraction, per-system audit report,
violations list, rebuild plan. FAIL: any code before council review.

## 12. Execution sequence (enforced order)
1. Note ingestion → 2. grep audit → 3. violations report →
4. council review → 5. rebuild plan → 6. controlled implementation.
FAIL: skipping any step.

## Failure protocol
Identify failing layer → trace root cause → rebuild from system primitives
→ revalidate. No patching. No incremental fixes. Full compliance or nothing.

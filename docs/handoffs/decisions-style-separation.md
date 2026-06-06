# Decision — Styles Temporarily in tokens.css (DEFERRED separation)

## What happened
The owner moved several UI styles OUT of sandbox/00-design-reference/index.html
and INTO tokens.css. Reason: the inline styles in the HTML had such high
specificity / priority that nothing in the stylesheet could override them —
moving them out was the only way to regain control from the stylesheet.

## Status: TEMPORARY placement, intentional, KEEP for now
These styles are NOT in their final home. They live in tokens.css purely to
defeat the inline-specificity problem. They are correct to keep there until
the structure phase.

## The rule (do NOT do this prematurely)
- Do NOT reorganize or move these styles during bug-fix or engine-integration work.
- When the COMPONENT STRUCTURE phase opens (the specified component-block
  organization), review each moved style, separate it, and relocate it into
  its proper component block per the nested-component pattern (CSS-1).
- This is deferred deliberately. It is the kind of work that goes wrong when
  rushed or done while exhausted. Schedule it; do not improvise it.

## Related
- Template consolidation (make the templates work the same way) is part of
  the same structure phase. Also deferred — not a bug-fix-pass task.
- Nested component pattern: .claude/rules/03-css-architecture.md
- Owner is the authority on when the structure phase opens.

## When this is resolved
Mark this file RESOLVED with the commit hash that completes the separation,
and append a checkpoint line to logs/checkpoints.log.

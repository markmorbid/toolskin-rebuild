# Decision — Style Separation (Deferred to Structure Phase)

**Status:** ACTIVE DEFERRAL · committed in Commit 2.5 (HEAD ≥ TBD-on-commit)
**Date logged:** 2026-05-27T00-41-16Z (UTC)
**Owner ruling:** styles parked in tokens.css now; separate later in structure phase

## What's parked in tokens.css

The owner moved several styles from `sandbox/00-design-reference/index.html`
into `expert-designer/templates/tokens.css` to defeat inline-specificity
issues — inline `<style>` blocks in the sandbox HTML were colliding with
external stylesheet cascade.

These styles do NOT belong long-term in `tokens.css` (which should hold
design tokens only — `--ts-*` custom properties, base resets, font-face
declarations). They are parked there as a pragmatic mid-flight fix until
the structure phase.

## Decision: do NOT reorganize now

The styles stay in `tokens.css` for the duration of:
- Commit 3 (engine integration v2/v3)
- Any subsequent Session 5 work
- Through to the structure phase (Session 6+)

Reorganization criteria — when these are met, the styles get extracted
into their proper component blocks:
1. The engine integration (toolskin-this-bg-v2.css + gradients-v3.css)
   has landed and verified working.
2. The component-block architecture for the rebuild is settled (which
   sandbox/01-system/, sandbox/02-*/ blocks own which styles).
3. The owner explicitly authorizes the structure phase to begin.

## What NOT to do

- Do NOT extract these styles into ad-hoc component files mid-session.
- Do NOT "clean up" tokens.css by moving them to surfaces.css or any
  other system file.
- Do NOT delete them from tokens.css even if they look misplaced.
- Do NOT mention this as tech debt to be addressed now — it is logged,
  scoped, and intentional.

## When to revisit

Structure phase kickoff. The directive that opens that phase will
explicitly reference this deferral and the styles it covers.

## Reference

- Owner instruction logged in chat 2026-05-26 (with the Commit 2.5
  insertion before engine integration).
- Standing order in `docs/handoffs/directive-integrate-engine.md` §10:
  "Do NOT reorganize them in this directive."

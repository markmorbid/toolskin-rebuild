# CSS Architecture — The Nested Component Pattern

**This is the LAW for any component with states, variants, or children.**
**Not optional. Applies project-wide to almost every asset type.**

## The pattern

Components with states/variants/children use nested CSS. Every `&:hover`,
`&:disabled`, `&.variant`, and child element lives INSIDE the component
block. Behavior is controlled via CSS custom properties. Context overrides
happen via the parent selector only — never by duplicating the block.

## The reference example (owner-defined — this is the target)

BEFORE — scattered, duplicated, rules escaping their scope:
```css
.hero .btn { background: #000; color: #fff; padding: 12px 20px; }
.hero .btn:hover { background: #333; }
.hero .btn .icon { color: #fff; }
.hero .btn:hover .icon { color: #4f46e5; }
.magazine .btn { background: #000; color: #fff; padding: 12px 20px; }
.magazine .btn:hover { background: #222; }
.magazine .btn .icon { color: #fff; }
.magazine .btn:hover .icon { color: #3b82f6; }
.btn.large { padding: 16px 28px; }
.btn.primary { background: blue; }
.btn.secondary { background: gray; }
.btn:disabled { opacity: 0.5; cursor: not-allowed; }
```

AFTER — nested, self-contained, token-driven:
```css
.btn {
  background: var(--btn-bg, #000);
  color: var(--btn-color, #fff);
  padding: var(--btn-padding, 12px 20px);

  .icon { color: var(--btn-icon-color, #fff); }

  &:hover {
    --btn-bg: var(--btn-hover-bg, #333);
    .icon { --btn-icon-color: var(--btn-hover-icon-color, currentColor); }
  }

  &:disabled { opacity: 0.5; cursor: not-allowed; }

  &.large     { --btn-padding: 16px 28px; }
  &.primary   { --btn-bg: var(--ts-accent); }
  &.secondary { --btn-bg: gray; }
}

/* Context overrides — scoped, not duplicated */
.hero     .btn { --btn-hover-bg: #333; --btn-hover-icon-color: #4f46e5; }
.magazine .btn { --btn-hover-bg: #222; --btn-hover-icon-color: #3b82f6; }
```

## Why

- Single declarative block per component
- States and variants live INSIDE the component — never scattered
- Behavior via tokens only — no duplication across variants
- Context overrides via parent selector — no specificity escalation
- Zero rule escape outside the component scope

## Hard rules

- CSS-1: Nested pattern mandatory for components with states/variants/children
- CSS-2: Backup originals to backups/ with timestamp before any merge
- CSS-3: After any consolidation, HALT and show owner. No commit, no audit,
         no browser until owner approves.
- CSS-4: `.component:hover` declared OUTSIDE the component block = violation

## Global directive (owner)

All CSS and JS must come OUT of HTML. No inline styles or scripts.
Every class must be reusable and system-aligned. No disposable one-off
classes. No temporary fixes that become permanent debt.


## WORKSPACE LAYER DEFINITIONS (CRITICAL)

The repository contains multiple parallel CSS workspaces. These MUST be classified before any audit or structural reasoning.

### PRODUCTION LAYER (canonical output)
- assets/css/next/

This is the ONLY production target directory.
It represents final compiled / consolidated system CSS.

### STAGING LAYERS (NON-PRODUCTION)
The following directories are NEVER production and MUST NOT be treated as missing production output:

- _portable-*/
- expert-designer/portable-*/
- Toolskin Design System/portable-*/
These are active migration or sandbox workspaces.

### RULE FOR AGENTS

Before performing any audit:

1. FIRST classify all directories into:
   - PRODUCTION
   - STAGING
   - ARCHIVE
   - UNKNOWN

2. ONLY AFTER classification:
   - perform duplication analysis
   - perform cleanup suggestions

3. ABSOLUTE PROHIBITION:
   - Do NOT report "missing production structure" if STAGING contains equivalent work
   - Do NOT infer system failure from absence of assets/css/next/ content inside staging directories

### INTERPRETATION PRIORITY

Staging directories override architectural expectations during active refactors.
Documentation reflects intended end-state, not required current filesystem state.

## ARCHITECTURAL EVALUATION RULE

Agents MUST NOT infer system correctness from file presence alone.

System state is determined by:
- explicit migration markers
- commit history intent
- declared consolidation stage

NOT by directory completeness or symmetry.
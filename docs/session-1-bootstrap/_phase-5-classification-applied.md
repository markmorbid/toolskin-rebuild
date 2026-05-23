---
name: token-validation
description: Validate CSS custom property declarations against Toolskin's three-tier Design Tokens 2.0 architecture (Primitive → System → Component). TRIGGER THIS SKILL whenever reviewing CSS changes, --ts-* token declarations, surface definitions, color mix() patterns, composite token updates, or component token refactoring. Ensures no semantic tokens are declared at Primitive layer, all System tokens reference only Primitives, and Component tokens reference only System layer. Catches architecture violations early to prevent cascading rework. Essential for Toolskin refactoring phases.
---

# Token Validation Skill

## Overview

This skill enforces Toolskin's strict three-tier design token architecture during CSS refactoring. It prevents invalid token patterns from being committed, which would require rework later.

## Three-Tier Architecture (Quick Reference)

### Tier 1: Primitive Layer
**Raw, uncomputed values only. No color semantics.**

```css
/* Dimensionless values */
--ts-accent-h: 210;      /* Hue only */
--ts-accent-s: 100;      /* Saturation only */
--ts-accent-l: 50;       /* Lightness only */

/* Spacing (4px base) */
--ts-sp-0: 0;
--ts-sp-1: 4px;
--ts-sp-2: 8px;
--ts-sp-3: 12px;
/* ... etc */

/* Border radius (no semantics) */
--ts-radius-0: 0;
--ts-radius-1: 2px;
--ts-radius-2: 4px;
```

**Validation Rule**: ✅ Only numeric/length values. ❌ NO `var()`, `color-mix()`, or semantic names like `--ts-bg-*`.

---

### Tier 2: System Layer
**Semantic purpose. References ONLY Primitives.**

```css
/* Background surfaces (depth stack) */
--ts-bg-surface-0: hsl(var(--ts-accent-h), var(--ts-accent-s), 98%);
--ts-bg-surface-1: hsl(var(--ts-accent-h), var(--ts-accent-s), 96%);

/* Text colors (auto-contrast) */
--ts-text-primary: hsl(var(--ts-accent-h), 0%, 12%);
--ts-text-secondary: hsl(var(--ts-accent-h), 0%, 56%);

/* Accent variants */
--ts-accent-base: hsl(var(--ts-accent-h), var(--ts-accent-s), var(--ts-accent-l));
--ts-accent-hover: hsl(var(--ts-accent-h), var(--ts-accent-s), calc(var(--ts-accent-l) + 8%));
--ts-accent-active: hsl(var(--ts-accent-h), var(--ts-accent-s), calc(var(--ts-accent-l) - 12%));

/* Borders */
--ts-border-subtle: hsl(var(--ts-accent-h), 0%, 88%);
--ts-border-standard: hsl(var(--ts-accent-h), 0%, 76%);
```

**Validation Rules**:
- ✅ References Primitives via `var(--ts-accent-h)` etc.
- ✅ Follows `--ts-[semantic]-[variant]` naming
- ✅ Used for **surfaces, text, borders, accents**
- ❌ NO hardcoded hex/rgb values
- ❌ NO references to other System tokens (would create circular dependencies)
- ❌ NO Component-layer naming

---

### Tier 3: Component Layer
**Purpose-specific, interactive tokens. References ONLY System layer.**

```css
/* Button scale (example composite) */
--ts-btn-scale: 1;
--ts-btn-padding: calc(var(--ts-sp-2) * var(--ts-btn-scale));
--ts-btn-border-radius: var(--ts-radius-2);
--ts-btn-bg-default: var(--ts-bg-surface-1);
--ts-btn-bg-hover: color-mix(
  in srgb,
  var(--ts-accent-base) 8%,
  var(--ts-bg-surface-1)
);
--ts-btn-text-color: var(--ts-text-primary);

/* Input focus ring (composite) */
--ts-input-focus-ring: 0 0 0 3px
  color-mix(in srgb, var(--ts-accent-base) 20%, transparent);
--ts-input-border-color: var(--ts-border-standard);
--ts-input-border-color-focus: var(--ts-accent-base);

/* Card depth (uses System surfaces) */
--ts-card-bg: var(--ts-bg-surface-0);
--ts-card-border: var(--ts-border-subtle);
```

**Validation Rules**:
- ✅ References System tokens via `var(--ts-bg-*, --ts-text-*, etc.)`
- ✅ Follows `--ts-[component]-[property]` naming
- ✅ May use computed patterns (`calc()`, `color-mix()`)
- ✅ Composite tokens document their dependencies in adjacent comments
- ❌ NO Primitive-layer references (only via System)
- ❌ NO hardcoded values

---

## Validation Checklist

Run this before approving CSS changes:

### Naming Scan
- [ ] All new tokens follow `--ts-` prefix (non-negotiable)
- [ ] Tier 1 (Primitive): No dashes in name after `--ts-` (e.g., `--ts-accent-h`, `--ts-sp-1`)
- [ ] Tier 2 (System): Format is `--ts-[semantic]-[variant]` (e.g., `--ts-bg-surface-1`, `--ts-text-primary`)
- [ ] Tier 3 (Component): Format is `--ts-[component]-[property]` (e.g., `--ts-btn-padding`, `--ts-input-focus-ring`)

### Reference Scan
- [ ] Tier 1: Only numeric/length literals. NO `var()` calls.
- [ ] Tier 2: Only `var(--ts-accent-h)`, `var(--ts-accent-s)`, `var(--ts-accent-l)`, or Primitive spacing/radius. NO other System tokens.
- [ ] Tier 3: Only `var()` to System tokens. If using Primitive spacing directly (e.g., `var(--ts-sp-2)`), note as exception in comment.

### Composite Token Scan
- [ ] Each `color-mix()` has a comment: `/* Purpose: ... References: ... */`
- [ ] Each `calc()` chain documents its ratio/formula
- [ ] Font-size computed values include ratio explanation (e.g., `/* 1.125^2 ratio */`)

### File Structure Scan
- [ ] Root `:root` or `html` block contains all Tier 1 and Tier 2 declarations
- [ ] Component rules (`.button`, `.input`, etc.) contain only Tier 3 tokens
- [ ] No `@media` query contains token *declarations* (only references in selectors)

---

## Common Violations & Fixes

### ❌ Violation: Hardcoded hex in System layer
```css
/* WRONG */
--ts-accent-active: #0033cc;
```
**Fix**: Reference Primitives and adjust lightness
```css
/* RIGHT */
--ts-accent-active: hsl(var(--ts-accent-h), var(--ts-accent-s), calc(var(--ts-accent-l) - 12%));
```

---

### ❌ Violation: System token in Tier 3 (circular reference)
```css
/* WRONG (component layer) */
--ts-btn-bg: color-mix(var(--ts-bg-surface-0), var(--ts-text-primary));
```
**Why it fails**: If `--ts-bg-surface-0` changes, this composite breaks unpredictably.

**Fix**: Blend at Tier 2 (System), then reference in Tier 3
```css
/* System layer (Tier 2) */
--ts-btn-bg-blend: color-mix(in srgb, var(--ts-accent-base) 8%, var(--ts-bg-surface-1));

/* Component layer (Tier 3) */
--ts-btn-bg: var(--ts-btn-bg-blend);
```

---

### ❌ Violation: Component layer with Primitive reference
```css
/* WRONG */
--ts-modal-padding: calc(var(--ts-sp-1) * var(--ts-btn-scale));
```
**Why it's problematic**: You're composing Primitives in Component layer (should be in System).

**Fix**: Create System token for modal spacing
```css
/* System layer (Tier 2) - add this */
--ts-modal-padding-base: calc(var(--ts-sp-3) * 1.5); /* document ratio */

/* Component layer (Tier 3) */
--ts-modal-padding: calc(var(--ts-modal-padding-base) * var(--ts-modal-scale, 1));
```

---

### ❌ Violation: Missing documentation on composite
```css
--ts-input-ring: 0 0 0 3px color-mix(in srgb, var(--ts-accent-base) 20%, transparent);
```
**Fix**: Add inline comment
```css
/* Focus ring: 20% accent blended over transparent.
   Used by: input:focus, textarea:focus, [role="combobox"]:focus */
--ts-input-ring: 0 0 0 3px color-mix(in srgb, var(--ts-accent-base) 20%, transparent);
```

---

## Validation Workflow (for Agent Teams)

When used as part of a multi-agent refactoring:

1. **Tokenizer Agent** produces CSS with `--ts-*` changes
2. **You (or Validator Agent)** run this checklist against the output
3. **Report Format**:
   ```
   ✅ Naming: All --ts-* prefixes correct
   ✅ Reference scan: No Tier-crossing references
   ⚠️ Composite tokens: 3 new color-mix() patterns need documentation
   ❌ Font-size: Line 1240, --ts-size-lg uses hardcoded 18px instead of primitive ratio

   **Action Required**: Fix line 1240, add 3 composite token comments, then ready to merge.
   ```

---

## Resources

- **Design Tokens 2.0 Full Spec**: See `design-tokens/SKILL.md` for complete token architecture
- **Expert Designer Consultation**: Use `expert-designer/SKILL.md` if you need design rationale for token choices
- **Toolskin Reference**: Existing `customized_v3.css` (patterns to follow)

---

## Quick Approval

If all items pass:
```
✅ Token architecture valid. Ready to commit.
```

If any fail:
```
⚠️ [X] violations found. See list above. Requires rework.
```

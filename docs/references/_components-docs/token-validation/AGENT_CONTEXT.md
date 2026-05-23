# Agent Context: Design Tokens 2.0 Reference (Minimal, Shared)

**Purpose**: Single source of truth for all agents. Agents read this file; do NOT paste into prompts.

**File size**: ~2K tokens (compact format for reference, not narrative)

---

## Section 1: Three-Tier Architecture (Rules Only)

### Tier 1: Primitive Layer
**Definition**: Raw, uncomputed values. No semantics.

```css
/* HSL Components (0-360, 0-100%, 0-100%) */
--ts-accent-h: 210;
--ts-accent-s: 100;
--ts-accent-l: 50;

/* Spacing (4px base scale) */
--ts-sp-0: 0;
--ts-sp-1: 4px;
--ts-sp-2: 8px;
--ts-sp-3: 12px;
--ts-sp-4: 16px;
--ts-sp-5: 20px;
--ts-sp-6: 24px;

/* Border Radius (2px base scale) */
--ts-radius-0: 0;
--ts-radius-1: 2px;
--ts-radius-2: 4px;
--ts-radius-3: 6px;
--ts-radius-4: 8px;
```

**Validation**: ✅ Only numeric/unit values. ❌ No `var()`, `color-mix()`, or semantic names.

---

### Tier 2: System Layer
**Definition**: Semantic purpose. References ONLY Tier 1 (Primitives).

**Format**: `--ts-[semantic]-[variant]`

```css
/* Surfaces (depth stack) */
--ts-bg-surface-0: hsl(var(--ts-accent-h), var(--ts-accent-s), 98%);
--ts-bg-surface-1: hsl(var(--ts-accent-h), var(--ts-accent-s), 96%);
--ts-bg-surface-2: hsl(var(--ts-accent-h), var(--ts-accent-s), 94%);

/* Text (auto-contrast) */
--ts-text-primary: hsl(var(--ts-accent-h), 0%, 12%);
--ts-text-secondary: hsl(var(--ts-accent-h), 0%, 56%);

/* Accent (with variants) */
--ts-accent-base: hsl(var(--ts-accent-h), var(--ts-accent-s), var(--ts-accent-l));
--ts-accent-hover: hsl(var(--ts-accent-h), var(--ts-accent-s), calc(var(--ts-accent-l) + 8%));
--ts-accent-active: hsl(var(--ts-accent-h), var(--ts-accent-s), calc(var(--ts-accent-l) - 12%));

/* Borders */
--ts-border-subtle: hsl(var(--ts-accent-h), 0%, 88%);
--ts-border-standard: hsl(var(--ts-accent-h), 0%, 76%);
```

**Validation**: ✅ Only references Tier 1 via `var()`. ✅ Semantic naming. ❌ No hardcoded hex. ❌ No System-to-System references.

---

### Tier 3: Component Layer
**Definition**: Purpose-specific, interactive. References ONLY Tier 2 (System).

**Format**: `--ts-[component]-[property]`

```css
/* Button */
--ts-btn-scale: 1;
--ts-btn-padding: calc(var(--ts-sp-2) * var(--ts-btn-scale));
--ts-btn-bg-default: var(--ts-bg-surface-1);
--ts-btn-bg-hover: color-mix(in srgb, var(--ts-accent-base) 8%, var(--ts-bg-surface-1));
--ts-btn-text-color: var(--ts-text-primary);

/* Input Focus Ring (Composite) */
--ts-input-focus-ring: 0 0 0 3px color-mix(in srgb, var(--ts-accent-base) 20%, transparent);

/* Card */
--ts-card-bg: var(--ts-bg-surface-0);
--ts-card-border: 1px solid var(--ts-border-subtle);
```

**Validation**: ✅ Only references Tier 2. ✅ May use `calc()` or `color-mix()`. ❌ No Tier 1 direct refs (via System only). ❌ No hardcoded values.

---

## Section 2: Naming Convention Quick Reference

| Tier | Pattern | Example | Notes |
|------|---------|---------|-------|
| Primitive | `--ts-[raw]` | `--ts-sp-1`, `--ts-radius-2`, `--ts-accent-h` | No dashes beyond prefix |
| System | `--ts-[semantic]-[variant]` | `--ts-bg-surface-0`, `--ts-text-primary`, `--ts-accent-hover` | Two parts (semantic + variant) |
| Component | `--ts-[component]-[property]` | `--ts-btn-padding`, `--ts-input-focus-ring` | Two parts (component + property) |

---

## Section 3: Validation Checklist (Tokenizer Output)

Run before approving CSS:

- [ ] All tokens use `--ts-` prefix
- [ ] Tier 1: Only numeric/unit literals (no `var()`)
- [ ] Tier 2: Only `var(--ts-accent-h/s/l)` or Tier 1 spacing/radius references
- [ ] Tier 3: Only `var(--ts-...)` to System layer tokens
- [ ] No hardcoded hex/rgb anywhere except as fallbacks (rare)
- [ ] Composite tokens (`color-mix()`) have inline comment explaining purpose
- [ ] Naming follows pattern (no exceptions)

---

## Section 4: Composite Token Patterns (Documenter Reference)

**What to document**: Any `color-mix()` or complex `calc()` patterns.

**Template**:
```
Pattern Name: [name]
Layer: [Tier 2 or 3]
Syntax: [CSS]
Purpose: [what it does]
Used by: [3-5 components]
Dependencies: [list of tokens referenced]
Computed Output (default theme): [example hex]
Computed Output (dark theme): [example hex]
```

**Examples**:

| Pattern | Purpose |
|---------|---------|
| `color-mix(--ts-accent-base 8%, --ts-bg-surface-1)` | Subtle accent hover state |
| `color-mix(--ts-accent-base 20%, transparent)` | Focus ring (20% opacity blend) |
| `calc(var(--ts-sp-2) * var(--ts-btn-scale))` | Scalable button padding |

---

## Section 5: Font-Size Ratio (System Token Tier 2)

**Base**: 16px (1rem)  
**Ratio**: 1.125 (Perfect Fifth musical interval, 9:8)

| Token | Formula | Computed | Usage |
|-------|---------|----------|-------|
| `--ts-size-xs` | `16px / 1.125²` | 12.64px | Small labels, hints |
| `--ts-size-sm` | `16px / 1.125` | 14.22px | Secondary text |
| `--ts-size-base` | `16px` | 16px | Body text (default) |
| `--ts-size-lg` | `16px × 1.125` | 18px | Headings level 4 |
| `--ts-size-xl` | `16px × 1.125²` | 20.25px | Headings level 3 |
| `--ts-size-2xl` | `16px × 1.125³` | 22.78px | Headings level 2 |
| `--ts-size-3xl` | `16px × 1.125⁴` | 25.63px | Headings level 1 |

**Implementation** (Tier 2):
```css
--ts-size-base: 16px;
--ts-size-ratio: 1.125;
--ts-size-xs: calc(var(--ts-size-base) / pow(var(--ts-size-ratio), 2)); /* 12.64px */
--ts-size-sm: calc(var(--ts-size-base) / var(--ts-size-ratio)); /* 14.22px */
--ts-size-lg: calc(var(--ts-size-base) * var(--ts-size-ratio)); /* 18px */
```

---

## Section 6: File Ownership (Agent Coordination)

| Agent | Owns | Reads |
|-------|------|-------|
| **Tokenizer** | `_refactored_tokens.css` | `customized_v3.css` (source), AGENT_CONTEXT.md (rules) |
| **Validator** | `validation-report.json` | `_refactored_tokens.css`, AGENT_CONTEXT.md (rules), token-validation skill |
| **Documenter** | `/docs/design-tokens/*.md` | Approved patterns from Validator, AGENT_CONTEXT.md (templates) |

---

## Section 7: Batch Processing Workflow

### Per-Batch Sequence
1. **Tokenizer**: Convert lines X–Y from `customized_v3.css` → save `_refactored_tokens.css`
2. **Validator**: Read `_refactored_tokens.css` → validate against Sections 1–3 → save `validation-report.json`
3. **Documenter**: Read `validation-report.json` → extract approved patterns → update `/docs/design-tokens/composites.md`
4. **Shutdown**: All agents save final work, confirm done

### Token Budget Per Batch
- Tokenizer context: 1.8K tokens
- Validator context: 1.8K tokens
- Documenter context: 1.2K tokens
- **Batch setup + work: ≤ 6.9K tokens** (target max)

---

## Section 8: Quick Decision Tree (For Agents)

```
Is this a new token you're creating?
├─ Yes → Does it have a semantic purpose (color, text, border, etc.)?
│  ├─ Yes → Tier 2 (System layer)
│  │  └─ Should it reference only Primitives? ✓
│  └─ No → Tier 1 (Primitive layer)
│     └─ Raw numeric/unit value only? ✓
└─ No → Are you referencing Tier 2 tokens?
   ├─ Yes → Tier 3 (Component layer) ✓
   └─ No → Check if it's System-only or Primitive ✓
```

---

## Agents: Use This Document

**Tokenizer**: Reference Sections 1 & 2 for naming + Sections 6 & 7 for workflow.

**Validator**: Reference Section 3 (checklist) + Section 1 (rules).

**Documenter**: Reference Sections 4 & 5 (templates) + Section 7 (workflow).

**All**: If unsure, consult Section 8 decision tree.

---

## File Size Tracking

**Current size**: ~1.8K tokens (this document)  
**Budget per batch**: Agents read this once (~500 tokens), then use specific sections (~300 tokens each)  
**Total per-agent cost**: ~800 tokens (file read + reference), not duplicated across 3 agents

**vs. Old way**: Embed all rules in prompt = 5K tokens × 3 agents = **15K overhead (87% savings)**

---

**Last Updated**: 2026-05-20  
**Next Review**: After first batch completion (gather feedback on section clarity)

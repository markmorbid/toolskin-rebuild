# DIFF-STYLE EXTRACTION PLAN — `ts-ui-select`

## 0. INTENT SNAPSHOT

```
CURRENT: hybrid, scope-leaking, context-polluted (nav/header + legacy panels)
TARGET: isolated, token-driven, variant-extensible component
```

---

# 1. SURFACE SEGMENTATION (LOGICAL DIFF)

Break the file into functional zones before touching anything:

```
[CORE SELECT]
  base container
  trigger/button
  dropdown panel
  option item

[STATE LAYER]
  hover / active / selected / disabled
  open/closed states

[VARIANT LAYER]
  icon-picker tweaks
  search-enabled tweaks
  font-selector tweaks

[CONTEXT OVERRIDES ❌]
  nav header adjustments
  banner generator overrides
  panel-specific spacing / colors

[TOKEN VIOLATIONS ❌]
  hardcoded colors
  fixed spacing
  radius / shadow duplication
```

---

# 2. EXTRACTION DIFF (WHAT STAYS vs GOES)

## ✅ KEEP (CORE — MUST SURVIVE)

```
+ .ts-select (root)
+ .ts-select__trigger
+ .ts-select__dropdown
+ .ts-select__option
+ minimal state classes (is-open, is-selected, is-disabled)
```

These define the **portable component contract**.

---

## ⚠️ NORMALIZE (CONVERT → TOKENS)

```
- color: #xxx
- background: #xxx
- border-radius: Xpx
- box-shadow: ...
- spacing (padding/margin)

→ REPLACE WITH:

+ var(--ts-color-*)
+ var(--ts-radius-*)
+ var(--ts-space-*)
+ var(--ts-elevation-*)
```

Goal: **zero visual logic hardcoded in component**

---

## ❌ REMOVE FROM COMPONENT (CONTEXT LEAKS)

Anything resembling:

```
.nav-header .ts-select { ... }
.banner-generator .ts-select { ... }
.panel-* .ts-select { ... }
```

→ DIFF ACTION:

```
- remove from component
+ mark as "external override candidate"
```

These belong in **layout or feature scopes**, not component.

---

## ❌ DEDUPE (CONFLICT ZONES)

Look for repeated definitions like:

```
.ts-select__option { padding: X }
.ts-select__option { padding: Y }
```

or:

```
.variant-a .ts-select__option
.variant-b .ts-select__option
```

→ DIFF ACTION:

```
- collapse duplicates
+ move differences into variant modifiers
```

---

## ⚠️ VARIANT ISOLATION (CRITICAL)

Instead of:

```
.ts-select.icon-picker ...
.ts-select.search-enabled ...
.ts-select.font-selector ...
```

→ enforce:

```
.ts-select--icon-picker
.ts-select--search
.ts-select--font
```

DIFF:

```
- implicit behavioral styling
+ explicit modifier classes
```

---

# 3. REDUNDANCY DETECTION TARGETS

Flag aggressively:

### A. Layout duplication

```
flex / align / gap repeated across trigger + options
```

→ consolidate into:

```
+ shared utility or internal sub-class
```

---

### B. Dropdown styling forks

```
multiple background / border / shadow definitions
```

→ keep ONE canonical dropdown surface

---

### C. Option rendering forks

```
icon + label combos repeated differently per context
```

→ unify structure:

```
.ts-select__option
  ├─ icon (optional)
  └─ label
```

---

# 4. ARCHIVE CANDIDATES (FROM THIS FILE)

Mark (do NOT delete yet):

```
- legacy panel overrides
- banner generator tweaks
- one-off spacing hacks
- duplicate shadow systems
- experimental states not used in nav
```

Condition:

```
SAFE if:
- not used in nav header (current live usage)
- not referenced by ts-nav.js
```

---

# 5. CONFLICT MAP (WHAT ARCHITECT MUST VERIFY)

## CSS

```
[HIGH RISK]
- dropdown positioning logic (may conflict with nav layout)
- z-index stacking contexts
- scroll/overflow handling

[MEDIUM]
- spacing scale mismatches
- radius inconsistencies

[LOW]
- typography overrides
```

---

## JS (AWARENESS ONLY)

Check interaction with:

```
ts-nav.js
```

Potential overlap:

```
- open/close state control
- keyboard navigation
- search behavior
```

→ DO NOT MERGE, just flag if styling depends on JS class injection

---

# 6. MINIMAL NEXT STEP (STRICT)

Do ONLY this next:

```
1. Extract selector inventory:
   - list all .ts-select* selectors
2. Tag each as:
   [CORE] [STATE] [VARIANT] [CONTEXT] [DUPLICATE]
3. Produce count summary:
   - total selectors
   - % core vs polluted
```

STOP after that.

---

# 7. SUCCESS CRITERIA

You’re done when:

```
- component can render correctly with ONLY:
  .ts-select
  + tokens
  + modifiers

- no parent dependency required
```

---

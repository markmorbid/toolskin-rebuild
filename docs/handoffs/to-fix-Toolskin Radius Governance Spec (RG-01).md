# Toolskin Radius Constraint — Refactor Spec

**Status:** Mandatory
**Scope:** `.ts-card`, `.ts-panel`, `.ts-surface`, `.ts-container`
**Based on:** `toolskin.css` current state (grepped)

---

## Current State (what exists)

### Tokens in `:root` (lines 484–513)

```css
--ts-radius-base: 8px;
--ts-radius-scale: 1;
--ts-radius: calc(var(--ts-radius-base) * var(--ts-radius-scale));
--ts-radius-2xs: calc(var(--ts-radius) * 0.3);
--ts-radius-xs:  calc(var(--ts-radius) * 0.6);
--ts-radius-sm:  calc(var(--ts-radius) * 0.87);
--ts-radius-md:  var(--ts-radius);
--ts-radius-lg:  calc(var(--ts-radius) * 1.15);
--ts-radius-2xl: calc(var(--ts-radius) * 1.5);
--ts-radius-xl:  calc(var(--ts-radius) * 2);
--ts-radius-full: 9999px;
--ts-radius-nest-reduction: 2px;
--ts-pd-nest-reduction: 2px;
--ts-radius-cap-raw: 25px;                                           /* ✅ keep */
--ts-plain-radius: min(25px, var(--ts-plain-radius-max));            /* ❌ remove */
--ts-plain-radius-max: var(--ts-input-radius, var(--ts-card-radius), var(--ts-radius-sm)); /* ❌ remove */
```

### Orphaned Tier 2 token (line 1079)

```css
--ts-radius-constrained: min(var(--ts-card-radius, var(--ts-radius-md)), var(--ts-radius-cap-raw));
/* ❌ remove — precomputed abstraction, does not consume --ts-nest-radius */
```

### `.ts-card` base rule (line 5168) — constraint is correct ✅

```css
border-radius: min(var(--ts-nest-radius, var(--ts-card-radius)), var(--ts-radius-cap-raw));
```

### `.ts-panel` base rule (line 31570) — constraint missing ❌

```css
border-radius: var(--ts-nest-radius, var(--ts-panel-radius));
/* needs min() cap */
```

### `.ts-card.gradient` (line 5180) — bypasses constraint ❌

```css
border-radius: var(--ts-card-radius);
/* raw token, no cap */
```

### Orphaned selector at end of file (line 34684) — remove ❌

```css
.ts-card,
.ts-panel,
.ts-surface,
.ts-container {
  border-radius: var(--ts-radius-constrained);
  /* references a token that itself doesn't consume --ts-nest-radius */
}
```

### Nest-reduction depth selectors (lines 31623–31640) — keep as-is ✅

```css
/* Depth 2 */
.ts-card .ts-card,
.ts-card .ts-panel,
.ts-panel .ts-card,
.ts-panel .ts-panel {
  --ts-nest-radius: calc(var(--ts-card-radius) - (1 * var(--ts-radius-nest-reduction)));
  --ts-nest-pad:    calc(var(--ts-card-pad) - (1 * var(--ts-pd-nest-reduction)));
}
/* Depth 3 */
.ts-card .ts-card .ts-card,
/* ... all combinator variants ... */
.ts-panel .ts-panel .ts-panel {
  --ts-nest-radius: calc(var(--ts-card-radius) - (2 * var(--ts-radius-nest-reduction)));
  --ts-nest-pad:    calc(var(--ts-card-pad) - (2 * var(--ts-pd-nest-reduction)));
}
```

---

## Refactor Actions

### 1. `:root` — remove two tokens

| Line | Action | Token |
|------|--------|-------|
| 512 | **Remove** | `--ts-plain-radius` |
| 513 | **Remove** | `--ts-plain-radius-max` |

Keep `--ts-radius-cap-raw: 25px` untouched.

---

### 2. Orphaned Tier 2 token — remove

**Line 1079** — delete:

```css
--ts-radius-constrained: min(var(--ts-card-radius, var(--ts-radius-md)), var(--ts-radius-cap-raw));
```

---

### 3. `.ts-panel` base rule — add cap

**Line 31570** — change:

```css
/* before */
border-radius: var(--ts-nest-radius, var(--ts-panel-radius));

/* after */
border-radius: min(var(--ts-nest-radius, var(--ts-panel-radius)), var(--ts-radius-cap-raw));
```

---

### 4. `.ts-card.gradient` — add cap

**Line 5180** — change:

```css
/* before */
border-radius: var(--ts-card-radius);

/* after */
border-radius: min(var(--ts-card-radius), var(--ts-radius-cap-raw));
```

---

### 5. End-of-file orphaned selector — remove entirely

**Lines 34684–34689** — delete:

```css
.ts-card,
.ts-panel,
.ts-surface,
.ts-container {
  border-radius: var(--ts-radius-constrained);
}
```

---

## Final State (what it looks like when done)

```css
/* :root — only these radius tokens remain */
--ts-radius-cap-raw: 25px;               /* Tier 1 primitive — non-scaling ceiling */
--ts-radius-nest-reduction: 2px;         /* nest depth step */
--ts-pd-nest-reduction: 2px;             /* nest padding step */

/* .ts-card */
border-radius: min(var(--ts-nest-radius, var(--ts-card-radius)), var(--ts-radius-cap-raw));

/* .ts-card.gradient */
border-radius: min(var(--ts-card-radius), var(--ts-radius-cap-raw));

/* .ts-panel */
border-radius: min(var(--ts-nest-radius, var(--ts-panel-radius)), var(--ts-radius-cap-raw));

/* depth selectors — untouched, only set --ts-nest-radius */
```

---

## Invariant

> Every container `border-radius` must consume `--ts-nest-radius` (or its canonical fallback) wrapped in `min(..., var(--ts-radius-cap-raw))`. No container may apply radius outside this pipeline.
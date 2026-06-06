# Card Layout Rules — ABSOLUTE REFERENCE

> This document is the SINGLE SOURCE OF TRUTH for card structure in the offcanvas editor.
> Read this BEFORE writing ANY schema code. NEVER deviate.

---

## Hierarchy (MANDATORY — NO EXCEPTIONS)

```
.ts-card
 ├── .ts-card-header.ts-accordion
 ├── .ts-toggle-row            ← ENABLER ONLY (optional, outside rows)
 └── .ts-card-rows             ← ONE per card, wraps ALL content rows
      └── .ts-card-row         ← ONE per visual row of controls
           ├── .ts-card-col-full | .ts-card-col-half | .ts-card-col-third
           │    └── .ts-field   ← ALWAYS wraps the actual control
           │         ├── <label>
           │         └── <control>
```

## Column wraps ts-field (PREFERRED)

The column is the outer wrapper, ts-field is inside:
```html
<!-- ✅ CORRECT (preferred) -->
<div class="ts-card-col-third">
  <div class="ts-field">
    <label>Accent</label>
    <div class="ts-color-row vertical">...</div>
  </div>
</div>
```

ts-field IS compatible with ts-card-col-* classes (can be combined on one element)
but ideally they should be nested: column → field → content.
```html
<!-- ✅ ALSO VALID (combined classes — compact) -->
<div class="ts-card-col-third ts-field">
  <label>Accent</label>
  <div class="ts-color-row vertical">...</div>
</div>
```

## Rules

| Rule | Description |
|------|-------------|
| **NO unclassed divs** | Every `<div>` MUST have a class |
| **NO nested rows in columns** | `ts-card-row` never inside `ts-card-col-*` |
| **ts-field wraps EVERYTHING** | Controls, toggles, color-rows, buttons |
| **Columns inside rows only** | `ts-card-col-*` is direct child of `ts-card-row` |
| **Labels: max ~12 chars** | Prevent line breaks in narrow columns |
| **Enabler toggle OUTSIDE** | `.ts-toggle-row` between header and `.ts-card-rows` |
| **MAX ONE ts-card-rows per card** | Never more than one `.ts-card-rows` wrapper in a card. If a sub-group is needed (like canvas-wrap), it reuses the same `.ts-card-rows` or is a `.ts-card-row` directly |
| **NO nested rows inside columns** | A `ts-card-row` NEVER appears inside a `ts-card-col-*`. If this happens it's a BUG |

## Schema Patterns

### Standard control (full width)
```js
{ type: 'range', id: 'ts-oce-foo', label: 'Foo', min: 0, max: 100, ... }
// Output: ts-card-row > ts-card-col-full > ts-field.ts-range-stack
```

### Two controls side by side
```js
{ type: 'range', ..., half: true, row: 'my-row' },
{ type: 'range', ..., half: true, row: 'my-row' }
// Output: ts-card-row > [ts-card-col-half, ts-card-col-half]
```

### Three controls (thirds)
```js
{ type: 'color', ..., third: true, row: 'colors' },
{ type: 'color', ..., third: true, row: 'colors' },
{ type: 'color', ..., third: true, row: 'colors' }
// Output: ts-card-row > [ts-card-col-third × 3]
```

### Mixed widths in one row
```js
{ type: 'button', ..., half: true, row: 'actions' },
{ type: 'button', ..., half: true, row: 'actions' },
{ type: 'toggle', ..., row: 'actions' }  // full width (no half/third)
// Output: ts-card-row > [ts-card-col-half, ts-card-col-half, ts-card-col-full]
```

### _appendTo pattern (injecting into a target row)
```js
// 1. Create the target row via html type:
{ type: 'html', content: '<div class="ts-card-rows"><div id="my-wrap" class="ts-card-row"></div></div>' }

// 2. Inject children into it:
{ type: 'range', ..., _appendTo: 'my-wrap' }                    // → ts-card-col-full
{ type: 'color', ..., third: true, _appendTo: 'my-wrap' }       // → ts-card-col-third
{ type: 'button', ..., _appendTo: 'my-wrap' }                   // → ts-card-col-full
```

**_appendTo target MUST have:**
- An `id` attribute
- Class `ts-card-row` (it IS the row)
- Created with `noWrap: true` so it goes directly into `ts-card-rows` without extra row/col wrapping

### Enabler toggle pattern
```js
{
  icon: 'grid-outline', label: 'Line Grid', open: false,
  children: [
    // First child = toggle with no showWhen + dependents reference its id → ENABLER
    { type: 'toggle', id: 'ts-oce-line-grid', label: 'Enable', tip: '...' },
    // All subsequent with showWhen → go inside ts-card-rows, hidden when toggle is off
    { type: 'range', ..., showWhen: { id: 'ts-oce-line-grid' } },
  ]
}
```

## Color Row Variants

### Horizontal (default)
```js
{ type: 'color', fieldLabel: 'Accent Color', ... }
// Output: .ts-color-row (swatch + hex side by side)
```

### Vertical (compact — for columns)
```js
{ type: 'color', fieldLabel: 'Accent', vertical: true, third: true, ... }
// Output: .ts-color-row.vertical (swatch on top, hex below)
```

Use **vertical** when:
- 3+ color pickers share a row (third columns)
- Space is tight and labels are short

## Priority Order in renderItems

1. **`_appendTo`** — inject into target container (highest priority)
2. **`row: 'id'`** — group consecutive same-row items
3. **`third: true`** — 3 consecutive thirds → one row
4. **`half: true`** — 2 consecutive halves → one row
5. **Default** — full-width row

## Anti-Patterns (NEVER DO)

```html
<!-- ❌ Unclassed div -->
<div id="ts-oce-foo"></div>

<!-- ❌ Row inside column -->
<div class="ts-card-col-full">
  <div class="ts-card-row">...</div>
</div>

<!-- ❌ Control without ts-field wrapper -->
<div class="ts-card-col-full">
  <input type="range" ...>
</div>

<!-- ❌ Multiple ts-card-rows at same level -->
<div class="ts-card-rows">...</div>
<div class="ts-card-rows">...</div>

<!-- ❌ Extra wrapper div -->
<div class="ts-card-col-third">
  <div>  <!-- ❌ this div has no class -->
    <div class="ts-field">...</div>
  </div>
</div>
```

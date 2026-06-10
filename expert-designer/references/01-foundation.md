# 01 · Foundation — Color, Surfaces, the Toolskin Token Contract

> Single source of truth for color in Toolskin. Pair with `scripts/generate-colors.js`
> which emits the authoritative `colors.css` and APCA verification report.

---

## 1 · The color engine (3 knobs, everything else derives)

```css
:root {
  /* ── THE THREE KNOBS ── */
  --ts-accent-h: 18;     /* hue 0–360   18=orange · 142=green · 220=blue · 270=purple */
  --ts-accent-s: 100%;   /* saturation 0–100% */
  --ts-accent-l: 52%;    /* lightness 0–100% */
}
```

That's it. To rebrand any Toolskin site, change those three lines. Everything below
derives. **Never write a fourth knob.** If a design needs a fixed accent hex, set
the three knobs to match — do not branch.

### 1.1 Derived accent variants (do not redefine)

```css
--ts-accent:        hsl(var(--ts-accent-h) var(--ts-accent-s) var(--ts-accent-l));
--ts-accent-bright: color-mix(in srgb, var(--ts-accent), #fff 15%);
--ts-accent-dark:   color-mix(in srgb, var(--ts-accent), #000 25%);
--ts-accent-dim:    color-mix(in srgb, var(--ts-accent), transparent 82%);
--ts-accent-dim-2:  color-mix(in srgb, var(--ts-accent), transparent 92%);
--ts-accent-border: color-mix(in srgb, var(--ts-accent), transparent 60%);

/* The auto-contrast ink — NEVER hardcode white/black on accent */
--ts-on-accent: oklch(from var(--ts-accent) clamp(0, (0.75 - l) * 999, 1) 0 0);
```

### 1.2 Alt / secondary accent (one, optional, complement)

```css
--ts-alt-h: 195; --ts-alt-s: 100%; --ts-alt-l: 40%;
--ts-alt: hsl(var(--ts-alt-h) var(--ts-alt-s) var(--ts-alt-l));
```

If a brand needs three colors, that's a triadic system — set `--ts-tri-h` too.
Beyond three, the design is over-specified. Cut.

### 1.3 Status colors (semantic, do not re-derive per project)

```css
--ts-success: hsl(142 76% 36%);
--ts-warning: hsl(45  100% 50%);
--ts-danger:  hsl(0   90% 55%);
--ts-info:    hsl(210 90% 55%);
```

---

## 2 · Surfaces — the 10 curated presets

Surfaces are **not derived**. They are 10 hand-curated palettes (5 dark + 5 light)
verified against APCA targets by `generate-colors.js`. Pull from the catalog —
never invent surface hex values.

### 2.1 The defaults (use unless told otherwise)

| Mode | Preset ID | bg-body | text-primary | Use case |
|---|---|---|---|---|
| **Dark** | `dark-practical-neutral-v1` | `#0c0d0f` | `#e8e9ea` | All production |
| **Light** | `light-practical-clean-v1`  | `#f7f8f9` | `#0f1012` | All production |

### 2.2 The 6-level surface ladder (per preset)

```
--ts-bg-body  ← deepest page background (the floor)
--ts-bg-0     ← base surface
--ts-bg-1     ← mid surface
--ts-bg-2     ← standard card / panel
--ts-bg-3     ← raised surface (modals, popovers)
--ts-bg-4     ← prominent (active states)
--ts-bg-5     ← brightest (highlights)
```

**Rule:** elevation = lighter (in dark mode) or slightly darker (in light mode).
A card on `bg-body` is `bg-2`; a popover on a card is `bg-3`; a tooltip on that is `bg-4`.
Skip levels = visual hierarchy collapses.

### 2.3 Text on surfaces (APCA targets, enforced by gate)

| Token | APCA target on bg-body | Use |
|---|---|---|
| `--ts-text-primary`   | ≥ Lc 75 | Body, headings |
| `--ts-text-secondary` | ≥ Lc 45 | Subtitles, meta, captions |
| `--ts-text-muted`     | ≥ Lc 25 | Disabled, footnote, helper |
| `--ts-text-accent`    | `var(--ts-accent)` | Links, emphasis (≤ 5% of page) |
| `--ts-text-invert`    | `var(--ts-on-accent)` | On accent backgrounds |

**NEVER** put `--ts-text-primary` on `--ts-accent` — use `--ts-text-invert` /
`--ts-on-accent`. The APCA formula picks the right ink automatically.

### 2.4 Borders (derived from surface context)

```css
--ts-border-0: color-mix(in srgb, currentColor, transparent 94%);  /* hairline */
--ts-border-1: color-mix(in srgb, currentColor, transparent 90%);  /* default */
--ts-border-2: color-mix(in srgb, currentColor, transparent 84%);  /* prominent */
--ts-border-accent: var(--ts-accent-border);
```

Borders use `currentColor` so they auto-invert when text color flips. **Do not**
write a border in hex — it will desync from theme switches.

---

## 3 · Switching presets at runtime

```css
/* Default = recommended dark + recommended light */
:root, [data-theme="dark"]  { /* dark-practical-neutral-v1 tokens */ }
[data-theme="light"]        { /* light-practical-clean-v1 tokens */ }
```

To use any preset on a subtree (e.g. embedded section in alt palette):

```html
<div class="ts-preset-dark-warm-slate-v2"> …local subtree uses Classic Warm… </div>
```

The 10 preset classes are emitted by `generate-colors.js` into `colors.css`.

### 3.1 JS API
```js
Toolskin.setAccent(195, '100%', '40%');   // new HSL accent
Toolskin.setAccentHex('#2efc86');          // accept hex, convert internally
Toolskin.setPreset('dark-warm-slate-v2');  // swap surface palette
Toolskin.refresh();                        // re-scan DOM after dynamic content
```

---

## 4 · The `--ts-` prefix contract (NAMESPACE)

Every custom property introduced by Toolskin or any imported skill **must** carry
the `--ts-` prefix. This is non-negotiable.

```
--ts-[category]-[property]-[variant]-[state]

✓  --ts-accent-h           ✓  --ts-card-bg
✓  --ts-fs-h1              ✓  --ts-shadow-accent
✗  --brand-primary         ← rename to --ts-accent-h with conversion
✗  --color-bg-card         ← rename to --ts-card-bg
✗  --spacing-md            ← map to --ts-sp-4 (16px)
```

When importing external CSS:
1. Audit the source for innovations (`!important` is a red flag — fix root cause, don't keep it).
2. Map every property to an existing `--ts-*` token or add a new one cleanly.
3. Re-prefix and retest.

See `references/css-integration-discipline.md` (if installed) for the full protocol.

---

## 5 · Color decision protocol

```
Q: A new color is needed.
├─ Is it an accent variation?   → adjust --ts-accent-h/s/l. Done.
├─ Is it a status (ok/warn/err)?→ use --ts-success/warning/danger. Don't redefine.
├─ Is it a surface elevation?   → use --ts-bg-{0..5}. If none fits, the design is wrong, not the system.
├─ Is it a text role?           → primary/secondary/muted/invert. No fourth role.
└─ None of the above?           → STOP. Get owner approval before adding a top-level token.
```

```
Q: Light mode looks faded.
├─ Did you swap --ts-bg-* and --ts-text-* together?  → that's mandatory
├─ Did you desaturate accent?                         → DON'T. Same accent across modes.
├─ Did you reduce shadow opacity?                     → no, use the same scale; shadows look fine
└─ Did you run APCA?                                  → run generate-colors.js
```

---

## 6 · The APCA gate (HALT condition)

Before any palette change ships, `generate-colors.js` MUST exit 0.

```
APCA targets (text on bg-body):
  text-primary   ≥ Lc 75   (comfortable reading)
  text-secondary ≥ Lc 45   (large/heavy text)
  text-muted     ≥ Lc 25   (non-text minimum)
```

The runtime tuner (`_toolskinApplyContrastToTokenMap` in `toolskin.js`) further
nudges secondary/muted at runtime — but the curated base values must meet the
floor before tuning.

If a palette fails: do not relax the target. Adjust the surface hex by 2–3 luminance
units and re-verify. If still failing, the palette is rejected.

---

## 7 · WordPress / Enfold bridge

Enfold (and most WP themes) consume their own variable names. Toolskin powers them
via a one-way bridge in the child theme CSS:

```css
:root {
  --maincolor:     var(--ts-accent);
  --orange:        var(--ts-accent);
  --orange-2:      var(--ts-alt);
  --altcolor:      var(--ts-alt);
  --darkbg2:       var(--ts-bg-body);
  --darkbg:        var(--ts-bg-2);
  --darkbg-1:      var(--ts-bg-1);
  --border-radius: var(--ts-radius-md);
  --mainfont:      var(--ts-font-body);
  --titlefont:     var(--ts-font-display);
}
```

**Rule:** the bridge is one-directional. Toolskin writes; Enfold reads. Never write
`--maincolor: #...` directly — set the `--ts-*` source and let it flow.

---

## 8 · The catalog (use these IDs verbatim)

```
DARK PRESETS:
  dark-neutral-cool-v1     Classic V1 Neutral Cool
  dark-warm-slate-v2       Classic V2 Warm Slate
  dark-blue-tinted-v3      Classic V3 Blue-Tinted Professional
  dark-practical-neutral-v1 ★ Practical Neutral (DEFAULT)
  dark-practical-cool-v2   Practical Slightly Cool

LIGHT PRESETS:
  light-neutral-clean-v1   Classic V1 Neutral Clean
  light-warm-paper-v2      Classic V2 Warm Paper
  light-cool-professional-v3 Classic V3 Cool Professional
  light-practical-clean-v1 ★ Practical Clean (DEFAULT)
  light-practical-cool-v2  Practical Slightly Cool
```

The full token map per preset lives in `docs/references/surface-presets-catalog.json`
(emitted by the generator). Read it; don't reproduce values here.

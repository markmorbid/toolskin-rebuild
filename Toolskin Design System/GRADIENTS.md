# Toolskin Gradient System v3.1 — Integration Guide

A drop‑in, fully token‑driven gradient library. Every gradient inherits its color from a single `--ts-grad-tint` variable, interpolates in `oklab` across 8 stops for visibly smoother ramps, and is capped by a global `--ts-grad-peak` ceiling so the default output reads as atmospheric, not painted‑on.

---

## TL;DR

```html
<link rel="stylesheet" href="toolskin-gradients-v3.css">

<!-- Drop on any element. -->
<div class="card ts-grad-halo" style="--ts-grad-tint: var(--ts-accent);">
  ...
</div>
```

That's it. The surface is included in the gradient stack — you don't need to declare a fallback background. Override `--ts-grad-tint` on any scope and the entire gradient retunes.

---

## File layout

| File | Role |
|---|---|
| `toolskin-gradients-v3.css` | The library. Loads on its own; depends only on a `--ts-accent` color being defined somewhere (falls back to the design system's accent). |
| `toolskin-this-bg-v2.css`   | Optional. The surface/state engine. Gradient stacks read `--ts-this-bg` from this. Without it, the library falls back to `oklch(20% 0 0)`. |

Load order:

```html
<link rel="stylesheet" href="toolskin.css">              <!-- base tokens -->
<link rel="stylesheet" href="toolskin-this-bg-v2.css">   <!-- surfaces (optional) -->
<link rel="stylesheet" href="toolskin-gradients-v3.css"> <!-- gradients -->
```

---

## Core inputs (override these to retune)

```css
:root, [data-theme="dark"] {
  /* tint — the brand color that every gradient pulls from */
  --ts-grad-tint:        var(--ts-accent);
  --ts-grad-tint-2:      oklch(from var(--ts-accent) l c calc(h + 60));
  --ts-grad-tint-3:      oklch(from var(--ts-accent) l c calc(h + 180));
  --ts-grad-tint-cool:   oklch(from var(--ts-accent) calc(l + 0.05) calc(c * 0.6) calc(h + 220));
  --ts-grad-tint-deep:   oklch(from var(--ts-accent) calc(l - 0.35) calc(c * 0.5) h);

  /* GLOBAL ALPHA CEILING — caps every stop. Default 0.55 = atmospheric.
     0.30 = whisper · 0.55 = atmospheric · 0.75 = present · 0.95 = vivid */
  --ts-grad-peak:        0.55;

  /* relative intensity, multiplied on top of peak. Typical range 0–1.5 */
  --ts-grad-intensity:   1;

  /* angle for linear/sweep/plate */
  --ts-grad-angle:        136deg;
  --ts-grad-angle-sweep:   24deg;
  --ts-grad-angle-plate:  180deg;

  /* anchor points (override for unusual layouts) */
  --ts-grad-pos-c:        50% 50%;
  --ts-grad-pos-off-tl:  -25% -35%;   /* off-canvas — what makes halos read */
  --ts-grad-pos-off-tr:  125% -30%;
  --ts-grad-pos-off-bl:  -20% 130%;
  --ts-grad-pos-off-br:  125% 125%;
}
```

### Tuning by use case

| Use case | `--ts-grad-peak` | `--ts-grad-intensity` |
|---|---|---|
| Hero background       | 0.40 | 0.8 |
| Card surface          | 0.55 | 1.0 |
| Active / selected     | 0.75 | 1.0 |
| Pull‑attention CTA    | 0.85 | 1.2 |
| Marketing splash      | 0.95 | 1.4 |

---

## Gradient catalog

### Single‑anchor halos

| Token | Class | Anchor | Curve | Use for |
|---|---|---|---|---|
| `--ts-grad-halo`         | `.ts-grad-halo`        | off top‑left  | halo | default soft glow |
| `--ts-grad-halo-tr`      | `.ts-grad-halo-tr`     | off top‑right | halo | flipped variant |
| `--ts-grad-halo-bl`      | `.ts-grad-halo-bl`     | off bottom‑L  | halo | bottom-anchored |
| `--ts-grad-halo-br`      | `.ts-grad-halo-br`     | off bottom‑R  | halo | bottom-anchored |
| `--ts-grad-bloom`        | `.ts-grad-bloom`       | center        | glow | "lit-from-within" |
| `--ts-grad-spot`         | `.ts-grad-spot`       | top-left corner | spot | focused light spot |
| `--ts-grad-spotlight`    | `.ts-grad-spotlight`   | top (off-canvas) | halo | light from above |

### Multi‑anchor aurora

| Token | Class | Anchors | Use for |
|---|---|---|---|
| `--ts-grad-aurora`        | `.ts-grad-aurora`        | 3 (TL/BR/C)  | painterly background |
| `--ts-grad-aurora-dense`  | `.ts-grad-aurora-dense`  | 4 corners    | maximally painterly |
| `--ts-grad-aurora-subtle` | `.ts-grad-aurora-subtle` | 2 (TL/BR)    | hero atmosphere |

### Edges, sweeps & rims

| Token | Class | Direction | Use for |
|---|---|---|---|
| `--ts-grad-edge-top`    | `.ts-grad-edge-top`   | top → bottom | top-rim accent |
| `--ts-grad-edge-bottom` | (no class)        | bottom → top | bottom-rim accent |
| `--ts-grad-sweep`       | `.ts-grad-sweep`      | diagonal     | edge-lit panels |
| `--ts-grad-rim`         | `.ts-grad-rim`        | diagonal     | soft light streak |

### Atmospheric

| Token | Class | Effect |
|---|---|---|
| `--ts-grad-fog`       | `.ts-grad-fog`       | very subtle haze |
| `--ts-grad-vignette`  | `.ts-grad-vignette`  | dark edge framing |

### Multi‑axis

| Token | Class | Shape |
|---|---|---|
| `--ts-grad-conic` | `.ts-grad-conic` | conic-blend, 4 tints |
| `--ts-grad-mesh`  | `.ts-grad-mesh`  | 4 overlapping radials, painterly |

### Plates (NEW v3.1) — 3‑stop linear, subtle

| Token | Class | Direction |
|---|---|---|
| `--ts-grad-plate`         | `.ts-grad-plate` | uses `--ts-grad-angle-plate` (default 180°) |
| `--ts-grad-plate-top`     | —            | top → bottom, fades to transparent |
| `--ts-grad-plate-bottom`  | —            | bottom → top, fades to transparent |
| `--ts-grad-plate-diag`    | —            | uses `--ts-grad-angle` |

### Composed stacks (ready to drop)

| Token | Class | Layers |
|---|---|---|
| `--ts-grad-stack-editorial` | `.ts-grad-editorial` | rim + spotlight + vignette + surface |

> Every other listed gradient has a matching `--ts-grad-stack-{name}-on-bg` token that bakes the surface in. Use these whenever you want one declaration, no separate background fallback.

---

## Easing curves

Five tunable curves drive every gradient. Each is an 8‑stop alpha ramp that approximates a cubic curve — that's how the falloffs read smooth instead of bandy.

| Curve | Shape | Used by |
|---|---|---|
| **halo** | bright core, long soft tail | most radials, default |
| **wash** | gentle, near-uniform decay  | atmospheric base layers |
| **spot** | small sharp core            | focused light spots |
| **glow** | wide bright body            | "lit-from-within" panels, mesh blobs |
| **fog**  | barely-there veil           | aurora‑subtle, fog |

Override any curve by setting its alpha tokens:

```css
:root {
  /* push halo's peak alpha higher */
  --ts-grad-halo-a-1: 1.0;
  --ts-grad-halo-a-2: 0.92;
  /* … etc */
}
```

---

## Usage patterns

### Skin a single card

```html
<div class="ts-grad-mesh"
     style="--ts-grad-tint: oklch(65% 0.19 320);
            --ts-grad-tint-2: oklch(68% 0.16 28);
            --ts-grad-tint-3: oklch(62% 0.15 270);
            --ts-grad-peak: 0.7;">
  ...
</div>
```

### Retheme a whole section

```html
<section style="--ts-grad-tint: var(--ts-accent-alt);
                --ts-grad-peak: 0.8;">
  <!-- every nested tsg-* element inherits the new tint -->
  <div class="ts-grad-aurora">...</div>
  <div class="ts-grad-mesh">...</div>
</section>
```

### Layer manually for custom compositions

```css
.my-hero {
  background:
    var(--ts-grad-rim),
    var(--ts-grad-spotlight),
    var(--ts-grad-aurora-subtle),
    var(--ts-this-bg);
}
```

### Pair with the surface engine

The library's `--ts-grad-stack-*-on-bg` tokens pull `--ts-this-bg` from the v2 surface engine. Combined:

```html
<div class="ts-grad-halo" style="--ts-this-bg: var(--ts-bg-2);">
  <!-- halo + bg-2 surface, all eased -->
</div>
```

### Animate

Every input is a CSS variable, so transitions and `@keyframes` work directly:

```css
.ts-grad-halo {
  transition: --ts-grad-peak 600ms ease, --ts-grad-tint 600ms ease;
}
.ts-grad-halo:hover { --ts-grad-peak: 0.85; }
```

For transitioning variables you need `@property` declarations:

```css
@property --ts-grad-peak {
  syntax: '<number>';
  inherits: true;
  initial-value: 0.55;
}
```

---

## How it works (the relative‑color trick)

Every color stop uses CSS relative‑color syntax:

```css
oklch(from var(--ts-grad-tint) l c h / calc(α × peak × intensity))
```

This reads the tint's lightness/chroma/hue components and substitutes a computed alpha. Result: **any** color you pass in (hex, named, hsl, oklch) becomes a valid gradient input.

```css
.brand-orange  { --ts-grad-tint: #ff5500; }
.brand-violet  { --ts-grad-tint: hsl(280 70% 60%); }
.brand-figma   { --ts-grad-tint: oklch(72% 0.18 145); }
/* all three skin the entire .tsg-* library correctly */
```

The `in oklab` interpolation keyword on each gradient ensures the perceptual midpoint between two color stops is exactly the eye‑average, with no hue‑arc surprises.

---

## Browser support

- **Chrome 119+**, **Safari 16.4+**, **Firefox 128+** — full support.
- `oklch(from ...)` relative color syntax is required. If you must support older browsers, ship a hex fallback for `--ts-grad-tint` (already covered by the v2 surface engine for `--ts-this-bg`).

---

## Common pitfalls

| Problem | Cause | Fix |
|---|---|---|
| Gradient is invisible | You used `circle` with a percentage size (`circle 40%`). CSS rejects this. | Use `ellipse 40% 40%` — already done in v3.1. |
| Looks purple / muddy | Mixing chromatic colors in `oklch` interpolation crosses the hue arc | Use `in oklab` (v3.1 does this by default) |
| Visible bands | Too few stops, too high contrast | Lower `--ts-grad-peak`, or split your worst step into two |
| Looks painted‑on | `--ts-grad-peak` too high | Drop to 0.40–0.55 for subtle, 0.65–0.75 for present |
| Color leaks outside box | `overflow: visible` on container | Set `overflow: hidden` on the painted element |

---

## Generator

`gradients-v3-bento.html` includes a live generator: pick any gradient, tune its tokens, copy the resulting CSS block. The exported snippet is self‑contained — paste it into your stylesheet and use the class immediately.

```css
/* Example export */
.ts-grad-halo-custom {
  --ts-grad-tint:        oklch(67% 0.21 39);
  --ts-grad-tint-2:      oklch(67% 0.21 99);
  --ts-grad-tint-3:      oklch(67% 0.21 219);
  --ts-grad-peak:        0.55;
  --ts-grad-intensity:   1.00;
  --ts-grad-angle:       136deg;
  background: var(--ts-grad-halo), var(--ts-this-bg, oklch(15% 0.006 270));
}
```

---

## Quick reference card

```css
/* COMMON SETUP */
.brand-section {
  --ts-grad-tint:        var(--ts-accent);   /* color */
  --ts-grad-peak:        0.55;               /* ceiling */
  --ts-grad-intensity:   1;                  /* multiplier */
  --ts-grad-angle:       136deg;             /* direction */
}

/* RECOMMENDED PAIRINGS */
.hero          { @apply ts-grad-editorial; --ts-grad-peak: 0.65; }
.card-default  { @apply ts-grad-halo;      --ts-grad-peak: 0.55; }
.card-feature  { @apply ts-grad-mesh;      --ts-grad-peak: 0.65; }
.cta-prominent { @apply ts-grad-bloom;     --ts-grad-peak: 0.80; }
.section-bg    { @apply ts-grad-plate;     --ts-grad-peak: 0.40; }
.atmospheric   { @apply ts-grad-aurora-subtle; --ts-grad-peak: 0.70; }
```

---

*v3.1 · changelog: peak ceiling, oklab interpolation, 8‑stop curves, fixed bloom/spot/rim, new plate.*

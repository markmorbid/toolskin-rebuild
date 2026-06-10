# Toolskin · Surface + Gradient Engine — Handoff Package

> A drop-in CSS engine for the Toolskin design system. Adds OKLAB-safe surface tokens and a painterly, fully token-driven gradient library on top of the existing `toolskin.css` base.

---

## Package contents

```
toolskin.css                    ← base tokens & typography (existing; not modified)
toolskin-this-bg-v2.css         ← surface + state + border engine
toolskin-gradients-v3.css       ← painterly gradient library
this-bg-v2-showcase.html        ← interactive showcase for the surface engine
gradients-v3-bento.html         ← interactive showcase + generator for gradients
GRADIENTS.md                    ← full gradient docs
HANDOFF.md                      ← (this file) — start here
```

All tokens use the `--ts-*` prefix. All utility classes use the `.ts-*` prefix. Nothing in the engine introduces new fonts, colors, or measurements outside the existing token vocabulary.

---

## Load order

```html
<!-- 1. base — colors, type, fonts (existing) -->
<link rel="stylesheet" href="toolskin.css">

<!-- 2. surface engine — derives every state/border from --ts-this-bg -->
<link rel="stylesheet" href="toolskin-this-bg-v2.css">

<!-- 3. gradient library — derives every gradient from --ts-grad-tint -->
<link rel="stylesheet" href="toolskin-gradients-v3.css">
```

Order matters: gradients depend on `--ts-this-bg` being present from the surface engine; the surface engine depends on `--ts-accent` being present from the base.

---

## Quick start

```html
<!-- Any element with --ts-this-bg gets a full state machine for free -->
<div style="--ts-this-bg: var(--ts-bg-2);">
  <button class="ts-button-look">          <!-- bg, hover, active, focus, disabled all derive -->
  <input  class="ts-input-grad">           <!-- recessed grad, focus tint -->
</div>

<!-- Any element with .ts-grad-* gets a painterly background -->
<section class="ts-grad-aurora" style="--ts-grad-tint: var(--ts-accent);">
  ...
</section>
```

---

## What the surface engine fixes & adds (v2)

**Root cause of the v1 purple-focus bug.** v1 mixed states in `color-mix(in oklch, …)`. OKLCH interpolates hue along the shortest arc — between a blue-tinted dark neutral (h ≈ 270°) and the orange accent (h ≈ 39°), the short arc passes through magenta, producing a purple focus surface.

**v2 fix.** Every chromatic mix is now `in oklab`, which interpolates Cartesian a/b axes — no hue path, no wrap. Focus uses a desaturated `--ts-tone-accent-tint` at a low percentage (8%) so it reads as a warm whisper rather than a paint job.

**Added coverage:**

- Tone anchors: `--ts-tone-contrast`, `--ts-tone-floor`, `--ts-tone-muted`, `--ts-tone-accent-tint`
- Mix knobs: `--ts-mix-perc{,-hover,-active,-pressed,-focus,-selected,-disabled,-drag}`
- Surfaces: `bright/-1/-2/-3 · raised · dark/-1/-2/-3 · recessed · dim ×6 · muted`
- States: `hover · active · pressed · focus · focus-hover · focus-ring · focus-outline · selected · disabled · disabled-dim · dragging` + semantic `success · danger · warning · info`
- Borders: 3 weights × `hover · active · focus · disabled · selected`
- Gradients (surface family): `bg · accent · mix · card · input · veil` × linear/radial/mesh/conic/sheen/glass

Override any percentage / angle / position locally to retune a subtree.

See `this-bg-v2-showcase.html` for the interactive grid across three different base surfaces.

---

## What the gradient library is (v3.1)

A drop-in painterly gradient set that lives on a separate token namespace (`--ts-grad-*`). Every gradient is:

- **Tint-agnostic** — feed any color via `--ts-grad-tint`, the whole library reskins via `oklch(from var(--ts-grad-tint) l c h / α)`
- **Eased** — 8-stop alpha ramps approximate cubic curves; no banding from 3-stop hard ramps
- **OKLAB-interpolated** — `in oklab` on every gradient prevents hue-arc artifacts
- **Bleed-off** — anchors sit at `-25% -35%` / `125% 125%` so what you see inside a card is the soft tail of the halo, not the bright core
- **Subtle by default** — global `--ts-grad-peak: 0.55` caps every alpha stop; raise it for more presence
- **Token-driven** — angle, position, size, intensity, curve all live in CSS custom properties

### Catalog (19 gradients + 18 stacked variants)

| Family | Tokens / classes |
|---|---|
| Halos | `--ts-grad-halo{,-tr,-bl,-br}` · `.ts-grad-halo*` |
| Centered | `--ts-grad-bloom` · `--ts-grad-spot` · `--ts-grad-spotlight` |
| Aurora | `--ts-grad-aurora{,-dense,-subtle}` |
| Edges | `--ts-grad-edge-top` · `--ts-grad-edge-bottom` · `--ts-grad-sweep` · `--ts-grad-rim` |
| Atmospheric | `--ts-grad-fog` · `--ts-grad-vignette` |
| Multi-axis | `--ts-grad-conic` · `--ts-grad-mesh` |
| Plates (NEW) | `--ts-grad-plate{,-top,-bottom,-diag}` |
| Stacks | `--ts-grad-stack-editorial` (rim + spotlight + vignette + bg) |

Full reference in `GRADIENTS.md`.

### Live generator

`gradients-v3-bento.html` includes a dropdown + sliders + Copy/Download buttons that emit a self-contained `.ts-grad-*-custom` CSS snippet for any configuration. Paste it into your stylesheet and use immediately.

---

## How to use in an agent context

If you're an LLM agent picking up this package, here is everything you need to know:

### Naming conventions

| Layer | Prefix | Example |
|---|---|---|
| Tokens (CSS custom properties) | `--ts-*` | `--ts-this-bg`, `--ts-grad-tint`, `--ts-mix-perc-focus` |
| Utility classes | `.ts-*` | `.ts-surface`, `.ts-grad-halo`, `.ts-card-glass` |
| Tonal / state suffixes | `-bright -dark -hover -active -focus -disabled -selected` | `--ts-this-bg-hover`, `--ts-this-bg-border-focus` |
| Curve suffixes (gradients) | `halo wash spot glow fog` | `--ts-grad-halo-a-3` |

Never invent new colors. Always reach through a token. The library does its own perceptual math — don't try to hand-tune a hue in sRGB.

### Common recipes

```css
/* — atmospheric hero — */
.hero {
  --ts-this-bg:        var(--ts-bg-1);
  --ts-grad-tint:      var(--ts-accent);
  --ts-grad-peak:      0.65;
  background: var(--ts-grad-stack-editorial);
}

/* — feature card — */
.feature-card {
  --ts-this-bg:        var(--ts-bg-2);
  --ts-grad-tint:      var(--ts-accent);
  --ts-grad-peak:      0.55;
}
.feature-card { background: var(--ts-grad-stack-aurora-on-bg); }
.feature-card:hover { --ts-grad-peak: 0.7; }

/* — quiet section divider — */
.section {
  background: var(--ts-grad-plate), var(--ts-bg-body);
}

/* — input with focus tint, no purple — */
.input {
  background: var(--ts-grad-input);
  border: 1px solid var(--ts-this-bg-border);
}
.input:focus {
  background: var(--ts-grad-input-focus);
  border-color: var(--ts-this-bg-border-focus);
  outline: 2px solid var(--ts-this-bg-focus-ring);
}
```

### Override scopes

Any token can be overridden on any scope. The cascade flows naturally:

```html
<body style="--ts-grad-peak: 0.55;">              <!-- global -->
  <section style="--ts-grad-tint: var(--ts-accent-alt);">  <!-- section retint -->
    <div class="ts-grad-mesh" style="--ts-grad-peak: 0.8;">  <!-- this card louder -->
      …
    </div>
  </section>
</body>
```

### What NOT to do

- **Don't** mix in `oklch` for surface states. Use `oklab`. The v2 engine already does this; if you write new mixes by hand, follow suit.
- **Don't** use `circle <percentage>` in `radial-gradient(…)` — CSS rejects it and the gradient silently disappears. Use `ellipse <pct> <pct>`. (The v3.1 library no longer has this bug.)
- **Don't** hand-pick a focus tint by hue rotation. Use `--ts-this-bg-focus` (already correct) or `--ts-tone-accent-tint`.
- **Don't** add new fonts, colors, or measurement primitives. Reach through tokens.
- **Don't** rely on `.tsg-*` legacy aliases — v3.1 standardizes on `.ts-grad-*`.

---

## Tuning cheat sheet

| You want | Change |
|---|---|
| Subtler everything | `--ts-grad-peak: 0.40` |
| More dramatic gradients | `--ts-grad-peak: 0.80` |
| Different brand hue (one scope) | `--ts-grad-tint: oklch(…)` |
| Different brand hue (everywhere) | `--ts-accent: …` (cascades to `--ts-grad-tint` default) |
| Steeper focus tint | `--ts-mix-perc-focus: 14%` |
| Gradient axis rotation | `--ts-grad-angle: 200deg` |
| Move all halos to bottom-right | `--ts-grad-pos-off-tl: 120% 120%` |
| Calmer aurora | `--ts-grad-intensity: 0.7` |
| Brighter active CTA | `--ts-grad-peak: 0.9; --ts-grad-intensity: 1.2` |

---

## Browser support

- **Chrome 119+ · Safari 16.4+ · Firefox 128+** — full support.
- Required CSS features:
  - `color-mix(in oklab|oklch, …)`
  - `oklch(from <color> l c h / <alpha>)` relative-color syntax
  - `linear-gradient(in oklab, …)` interpolation hint

For older browsers, set `--ts-this-bg` and `--ts-grad-tint` to hex fallbacks before the modern declarations. The library will use the resolved color either way.

---

## Verification checklist

Before shipping a change, confirm:

- [ ] Every new color goes through a `--ts-*` token, not a hex literal
- [ ] Every state mix uses `in oklab` (no `in oklch` for chromatic mixes)
- [ ] Every `radial-gradient(circle …)` uses a length, not a percentage (or switch to `ellipse`)
- [ ] Every gradient lists its surface in the stack OR sets `background-color` separately
- [ ] Utility classes follow `.ts-*` prefix
- [ ] `--ts-grad-peak` is set or inherited — default 0.55 is sensible for most contexts

---

*Engine v3.1 · OKLAB-safe surfaces · painterly token-driven gradients · clean .ts- namespace.*

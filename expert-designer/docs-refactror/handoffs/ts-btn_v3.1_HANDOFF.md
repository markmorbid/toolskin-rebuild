# ts-btn · Smart Button System  v3.1
**Handoff package — for the next agent / engineer**

The legacy `ts-button.css` consolidated and reseated on the refactored Toolskin
platform. Color flows through the v2 surface engine, surfaces optionally pull
from the v3 gradient library, and every dimension derives from one unitless
base via ratio tokens. Auto-contrast ink keeps the button readable on dark,
light, *and* chromatic (accent) parents without a manual mode switch.

---

## 1 · Package contents

| File                                | Role                                                       |
|-------------------------------------|------------------------------------------------------------|
| `ts-button.css`                     | The component. Load LAST in the toolskin chain.            |
| `Toolskin Buttons Showcase.html`    | Interactive reference. Tweak panel + live ratio sliders.   |
| `ts-button HANDOFF.md` *(this file)*| What you're reading.                                       |

Depends on (in load order):

```html
<link rel="stylesheet" href="toolskin.css">                <!-- base tokens, accent engine     -->
<link rel="stylesheet" href="toolskin-this-bg-v2.css">     <!-- surface state engine (oklab)    -->
<link rel="stylesheet" href="toolskin-gradients-v3.css">   <!-- optional, only for lush skins   -->
<link rel="stylesheet" href="ts-btn_v3.1.css">               <!-- the component                   -->
```

FontAwesome is optional but assumed for the `.ts-icon` glyph pattern.

---

## 2 · Why this exists

The legacy `ts-button.css` was carrying three known-bad patches:

1. **Inconsistent sizing.** Some dimensions were hardcoded (`padding: 10px 16px`),
   others derived from a base, others overridden per-variant. No single knob.
2. **Hover state forced a flat grey lift.** Defeated the orange-on-grey relation
   the buttons were designed around.
3. **No light/dark adaptation.** Default surface pinned to `--ts-bg-3` (dark);
   ghost ink pinned to a fixed translucent light grey. Both invisible on a light
   parent.

v3.1 fixes all three with a single ratio chain, an accent-ink hover, and an
OKLCH auto-contrast ink token — same trick as `--ts-on-accent` — that
recomputes against whatever surface the button finds itself on.

---

## 3 · The sizing engine

### Inputs (declared once, on `:where(:root)`)

| Token                       | Default | Drives                              |
|-----------------------------|---------|-------------------------------------|
| `--ts-btn-base`             | `45`    | Master size knob *(unitless)*       |
| `--ts-btn-scale`            | `1`     | Per-button multiplier               |
| `--ts-btn-h-ratio`          | `1`     | `h = size × this`                   |
| `--ts-btn-pad-x-ratio`      | `0.45`  | `pad-x = size × this`               |
| `--ts-btn-pad-y-ratio`      | `0.42`  | `pad-y = pad-x × this`              |
| `--ts-btn-fs-ratio`         | `0.23`  | `font-size = size × this`           |
| `--ts-btn-icon-ratio`       | `1`     | `icon = fs × this`                  |
| `--ts-btn-radius-ratio`     | `0.18`  | `radius = size × this`              |
| `--ts-btn-gap-ratio`        | `0.18`  | `gap = size × this`                 |
| `--ts-btn-counter-ratio`    | `1.7`   | `counter pill = fs × this`          |
| `--ts-btn-border-ratio`     | `0.022` | `border-w = size × this (min 1px)`  |
| `--ts-btn-letter-ratio`     | `0.06`  | `letter-spacing = fs × this`        |
| `--ts-btn-shadow-ratio`     | `0.45`  | `shadow blur = size × this`         |

> `--ts-btn-base` is **unitless** (number). The chain multiplies by `1px` at
> the end so integer sliders can drive the whole system directly.

### Derived (on `.ts-btn`)

Never override these directly — tune a ratio above and the chain follows.

```
--ts-btn-size          = base × scale
--ts-btn-h             = size × h-ratio × 1px
--ts-btn-pad-x         = size × pad-x-ratio × 1px
--ts-btn-pad-y         = pad-x × pad-y-ratio      ← vertical follows horizontal
--ts-btn-fs            = size × fs-ratio × 1px
--ts-btn-icon-size     = fs × icon-ratio
--ts-btn-radius        = size × radius-ratio × 1px
--ts-btn-counter-size  = fs × counter-ratio
--ts-btn-border-w      = max(1px, size × border-ratio × 1px)
--ts-btn-letter        = fs × letter-ratio
```

### Why inputs are on `:where(:root)`, not `.ts-btn`

This was the v3.0 cascade bug. Declaring inputs on `.ts-btn` pinned them at
element specificity, blocking any ancestor override. Now any ancestor can
write `--ts-btn-base` (the sidebar, a hero section, a tweak panel) and the
button recomputes — without re-declaring the base on itself.

Size variants still work because they override individual ratios *on the
button element*, which is the intended cascade order:

```
:where(:root) defaults  →  ancestor overrides  →  size-variant overrides  →  derived calc
```

### Size variants (verbatim from the original recipe)

| Class            | `--ts-btn-scale` | `--ts-btn-h-ratio` | `--ts-btn-fs-ratio` |
|------------------|------------------|--------------------|---------------------|
| `.ts-btn--xs`    | `0.72`           | `0.92`             | `0.25`              |
| `.ts-btn--sm`    | `0.84`           | `0.9`              | `0.24`              |
| `.ts-btn--md`    | `1`              | *(inherits 1)*     | `0.22`              |
| `.ts-btn--lg`    | `1.3`            | `0.83`             | `0.2`               |
| `.ts-btn--xl`    | `1.45`           | `0.89`             | `0.2`               |
| `.ts-btn--xxl`   | `1.8`            | `0.86`             | `0.18`              |

Heights are *dampened* on `lg`/`xl`/`xxl` — the effective height scale is
~10–15% less than the linear `scale` would suggest. This keeps the larger
buttons proportional instead of cartoonishly tall.

---

## 4 · The color model

### Auto-contrast ink — `--ts-on-surface-auto`

The whole adaptation story turns on one root-declared token:

```css
:where(:root, :root *) {
  --ts-on-surface-auto:
    oklch(from var(--ts-this-bg)
          clamp(0, (0.72 - l) * 999, 1) 0 0);
}
```

It's declared on `:where(:root, :root *)` so every element computes its own
copy against the *local* `--ts-this-bg`. Light surface → black ink, dark
surface → white ink, accent surface → black or white based on its lightness.
Same machinery as `--ts-on-accent`, generalized.

### Default `.ts-btn` (no variant)

* **Surface** = the AMBIENT `--ts-this-bg`, lifted 8% toward `--ts-on-surface-auto`.
  On a dark wrapper the button lifts toward white; on a light wrapper it
  deepens toward black. Always a clear lift from its container.
* **Border** = ambient lifted 18% toward auto-ink.
* **Ink** = `--ts-on-surface-auto`.
* **Hover** = ink → `--ts-accent`, surface deepens further toward auto-ink.
* **Active** = surface deepens harder, border picks up 50% accent tint.
* **Focus** = surface gains 8% accent, border + ink go full accent, outlined
  ring at 55% accent.

This is the *orange-on-grey personality* the original was designed around —
preserved exactly, but now works on light/accent surfaces too.

### Variants

| Class                | Surface                                | Ink                          | Notes |
|----------------------|----------------------------------------|------------------------------|-------|
| `.ts-btn--primary`   | `--ts-accent` + 3-way gradient         | `--ts-on-accent`             | Active flips gradient stop order. |
| `.ts-btn--secondary` | `--ts-bg-2`                            | auto-ink                     | Explicit dark anchor.             |
| `.ts-btn--tertiary`  | `--ts-bg-1`                            | auto-ink                     | "                                 |
| `.ts-btn--raised`    | `--ts-bg-4`                            | auto-ink                     | "                                 |
| `.ts-btn--floor`     | `--ts-bg-0`                            | auto-ink                     | "                                 |
| `.ts-btn--outline`   | transparent                            | `--ts-on-surface-auto`       | Border + ink both auto-flip.      |
| `.ts-btn--ghost`     | transparent                            | auto-ink at 65%, accent hover| Hover lifts subtle bg.            |
| `.ts-btn--soft`      | `bg + accent 14%`                      | accent                       | Brand-tinted but quiet.           |
| `.ts-btn--alt`       | `--ts-info` (cool blue)                | `--ts-on-info`               | The original "alt" slot.          |
| `.ts-btn--success`   | `--ts-success`                         | `--ts-on-success`            | Auto-flips via OKLCH.             |
| `.ts-btn--warning`   | `--ts-warning`                         | `--ts-on-warning`            | "                                 |
| `.ts-btn--danger`    | `--ts-danger`                          | `--ts-on-danger`             | "                                 |
| `.ts-btn--info`      | `--ts-info`                            | `--ts-on-info`               | "                                 |

> **Named-surface variants (`--secondary`, `--tertiary`, `--raised`, `--floor`)
> stay dark on any parent because they explicitly re-anchor to `--ts-bg-N`.**
> Use the plain `.ts-btn` when you want adaptive behavior; use a named surface
> variant when you want a specific layer regardless of context.

### The 3-way accent gradient

Mirrors the user's original recipe:

```css
--ts-accent-dark:   color-mix(in srgb, var(--ts-accent), #000 10%);
--ts-accent-bright: color-mix(in srgb, var(--ts-accent), #fff 8%);
--ts-accent-grad:   linear-gradient(
  to top left,
  var(--ts-accent-bright),
  var(--ts-accent-dark),
  var(--ts-accent)
);
```

Defined as fallbacks on `:where(:root)`. If the host design system defines
its own, the host's value wins.

---

## 5 · DOM contract (SmartButton)

```html
<button class="ts-btn ts-btn--primary ts-btn--lg">
  <i    class="ts-icon fa-solid fa-bell"></i>           <!-- optional: leading icon  -->
  <span class="ts-btn-text">Notifications</span>         <!-- REQUIRED: label wrap    -->
  <span class="ts-btn__counter">12</span>                <!-- optional: counter pill  -->
</button>
```

Rules of the contract:

* Every label MUST be in a `<span class="ts-btn-text">`. This lets
  `.ts-btn--icon` collapse the button to a square by hiding only that span
  via `display: none` — no markup changes needed.
* Icons may use any of: `<i class="ts-icon fa-*">`, raw `<i class="fa-*">`,
  raw `<svg>`, or `<ion-icon>`. All are sized to `--ts-btn-icon-size`.
* Counter: `<span class="ts-btn__counter">` — sized off the button font-size,
  scales with the button automatically.
* Spinner: `<span class="ts-btn__spinner">` + `is-loading` on the button.
* The showcase ships an auto-wrap JS snippet that lifts loose text nodes
  into `.ts-btn-text` at runtime — copy it into your app if you can't enforce
  the contract at the template layer.

---

## 6 · Recipes you'll use

### Retune the whole system from a parent

```css
.sidebar  { --ts-btn-base: 36; }                          /* tight controls   */
.hero     { --ts-btn-base: 64; }                          /* prominent CTAs   */
.toolbar  { --ts-btn-base: 32; --ts-btn-radius-ratio: 0; }/* squarer corners  */
```

The cascade carries those down to every `.ts-btn` inside. No class changes.

### Tweakable design (live sliders)

```js
document.documentElement.style.setProperty('--ts-btn-base', 52);
document.documentElement.style.setProperty('--ts-btn-h-ratio', 0.95);
```

The showcase wires this up for you — open `Toolskin Buttons Showcase.html`
and the panel in the top-right exposes every input token.

### Lush mode (gradient skins, no markup change)

```html
<div class="ts-lush">
  <button class="ts-btn ts-btn--primary">…</button>
  <button class="ts-btn ts-btn--secondary">…</button>
  <button class="ts-btn ts-btn--soft">…</button>
</div>
```

The wrapper paints non-primary, non-ghost, non-outline buttons with
`--ts-grad-bg`. Outline + ghost stay flat by design (they're transparent
by nature).

### Toggle to icon-only

```js
button.classList.toggle('ts-btn--icon');
```

The `.ts-btn-text` span hides; the button collapses to a square. No DOM
restructuring.

---

## 7 · Tuning cheat sheet

| You want…                                      | Tune                                       |
|------------------------------------------------|--------------------------------------------|
| All buttons taller                             | `--ts-btn-h-ratio` (or `--ts-btn-base`)    |
| Tighter horizontal padding                     | `--ts-btn-pad-x-ratio`                     |
| Smaller text relative to height                | `--ts-btn-fs-ratio`                        |
| Bigger icons                                   | `--ts-btn-icon-ratio`                      |
| Squarer corners                                | `--ts-btn-radius-ratio` (set to `0`)       |
| Pill                                           | Add `.ts-btn--pill` (radius = h/2)         |
| Thicker borders                                | `--ts-btn-border-ratio`                    |
| More uppercase tracking                        | `--ts-btn-letter-ratio`                    |
| Slower hover                                   | `--ts-btn-dur`                             |
| Different accent gradient                      | Override `--ts-accent-grad` on your scope  |

---

## 8 · Known gotchas

1. **Named-surface variants don't auto-adapt.** `.ts-btn--secondary` will be
   dark on a light parent because it explicitly re-anchors to `--ts-bg-2`.
   Use plain `.ts-btn` for adaptive behavior. *(This is by design — naming
   a specific surface means you wanted that surface.)*

2. **`--ts-on-surface-auto` requires OKLCH support.** All evergreen browsers
   have it; older browsers will fall through to the variant's own ink token
   or `--ts-text-primary`.

3. **Don't redeclare input tokens on `.ts-btn`.** If you do, you pin them at
   element specificity and break the ancestor override path. Size variants
   are the exception — they're meant to override per-element.

4. **The accent gradient fallbacks may shadow the host's tokens.** They
   live on `:where(:root)` at zero specificity, so if the host design system
   declares `--ts-accent-grad` on `:root`, the host wins. If you import the
   button CSS *after* a stylesheet that uses `:where(:root)` for the same
   token, ours wins — load order matters here.

5. **`background-image` is layered on `background-color`.** When you swap
   surfaces in a custom variant, set `background-image: none` if you want
   to be sure no gradient bleeds through.

---

## 9 · Migration from legacy `ts-button.css`

| Legacy                                   | v3.1                                          |
|------------------------------------------|-----------------------------------------------|
| `--_btn-bg`, `--_btn-color`, `--_btn-border` | `--ts-btn-surface`, `--ts-btn-ink`, `--ts-btn-border` (public, ts-namespaced) |
| `--ts-btn-base: 45` (on `:where(:root, :root *)`) | `--ts-btn-base: 45` (on `:where(:root)` only — fixes cascade bug) |
| `@temporary_alignment_patch` block for icon vertical align | Removed. Auto-wrap span + ratio-derived `--ts-btn-icon-size` does it correctly. |
| `--ts-btn--primary :hover` reflows accent border + grad | Same behavior, simplified — accent grad hover swaps stop order. |
| Outline/Ghost variants used `!important` for ink   | Removed. Auto-contrast ink solves it cleanly. |
| Size variants override `--ts-btn-h-ratio` *and* re-declare derived dims | Size variants only adjust scale + 1–2 ratios. Derivation chain runs once. |
| Hardcoded `--ts-bg-3` default surface              | Default surface = ambient `--ts-this-bg` lifted 8% via auto-ink. |
| Ghost color = `--ts-text-secondary` (fixed)        | Ghost color = `--ts-on-surface-auto` at 65% — visible on any parent. |

---

## 10 · Verification checklist

Drop these checks into your test suite or run them in the showcase console:

```js
// Sizing engine — root override propagates
document.documentElement.style.setProperty('--ts-btn-base', 32);
document.documentElement.style.setProperty('--ts-btn-scale', 2);
document.documentElement.style.setProperty('--ts-btn-h-ratio', 3);
// expect: primary button height ≈ 192px

// Size variant still works alongside cascade
getComputedStyle(document.querySelector('.ts-btn--xl')).height
// expect: ~58px at default base/scale

// Auto-contrast — outline on accent surface should be white
getComputedStyle(document.querySelector('.ts-on-accent .ts-btn--outline')).color
// expect: oklch(1 0 0)  ← white

// Auto-contrast — ghost on light surface should be black
// (find the light-surface ctx and inspect its .ts-btn--ghost color)
// expect: oklab(0 0 0 / 0.65)  ← black at 65% opacity

// Icon-only toggle hides the text span
button.classList.add('ts-btn--icon');
getComputedStyle(button.querySelector('.ts-btn-text')).display
// expect: 'none'
```

---

## 11 · Next steps (open work)

Nothing blocking. If you want to extend:

* **`--ts-btn--link`** variant: chromeless, inline, accent-underlined.
* **Loading skeleton** mode that swaps the label for a shimmer, sharing the
  spinner's diameter for layout stability.
* **Toggle group** (`role="radiogroup"`) — same `.ts-btn-group` chrome but
  with an `is-active` selection state already styled.
* **CSS container queries** on `.ts-btn-group` so siblings stack vertically
  under a small container — useful for sidebar toolbars.

---

*ts-btn v3.1 · OKLAB safe · ratio-driven · auto-contrast · zero static dims.*

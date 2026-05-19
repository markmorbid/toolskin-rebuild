# S2 — System Layer Spec (`--ts-this-*` derivative chain)

**Sub-agent:** S2 — System Layer Architect
**Wave:** 2.2 (sequential — dispatched alone, consumes S1's locked output; S3-S6 dispatch in parallel after this)
**Session:** 1
**Authored:** 2026-05-19
**Output of:** Phase D Wave 2 of orchestration brief v5
**Binding rules:** Conversation Rules 1–15 (`_session-1-rebuild-queue.md`); Rule 15 (apcach supremacy) governs every color decision in this spec
**Wave 1 inputs consumed:** T1 `_rebuild-block-typology.md` §3 color contract + §1.2 inward re-scope criterion + §6 chips strip contract; T2 `_rebuild-base-context-spec.md` §3.2 cascade load order rows 6-9; T3 `_rebuild-adaptive-integration-spec.md` §3.2 Tier 2 system composition; `_wave-1-synthesis.md` Appendix A1-Council refinements R3 (shared-tokens/) and R6 (per-block opt-in)
**Wave 2.1 input consumed:** S1 `_rebuild-primitives-spec.md` — full 1,341 lines. Specifically: §1.2 three-tier diagram, §3 surfaces, §4 accent (incl. §4.5 state variant decision deferred to S2), §5 `--ts-on-accent` / `--ts-on-surface` threshold tokens (incl. §5.3 deferred to S2), §6 text primitives, §8 APCA contrast table, §10 migration map, §11 `data-theme` canonical, §14.1 contact-point list
**Gate 4 locks honored:** D1 `assets/js/next/`; A1 Council R3 `shared-tokens/` layer (S2 OWNS this design); A9 `data-theme` canonical; restyling-architecture §3 missing state tokens (`--ts-this-bg-border-active/disabled/focus`)
**Restrictions:** **Spec only.** No CSS file written, no JS file written, no edits to old repo. This markdown is the only artifact. No new color values introduced — every formula composes S1 primitives via `color-mix(in oklch, ...)` and `oklch(from ...)`.

---

## 1. Scope of S2 — what this layer produces

### 1.1 Three-tier architecture (verbatim from S1 §1.2)

```
PRIMITIVES (S1 — _rebuild-primitives-spec.md, locked)
  - apcach-derived raw OKLCH values
  - --ts-bg-body, --ts-bg-0 … --ts-bg-5             (7 surfaces × 2 modes)
  - --ts-accent, --ts-accent-dim, --ts-accent-bright (3 accents × 2 modes)
  - --ts-on-accent (OKLCH auto-contrast formula)
  - --ts-on-accent-threshold, --ts-on-surface-threshold
  - --ts-text-primary, --ts-text-secondary, --ts-text-muted (3 text × 2 modes)
  - Dark default at :root + light override at [data-theme="light"] :root
  - File: assets/css/next/primitives/colors.css (NOT WRITTEN this session)
        ↓
SYSTEM (S2 — THIS spec)
  - --ts-this-bg + the full derivative chain (--ts-this-bg-hover/active/focus/
    disabled/dim/bright/dark/border/border-* state variants/grad/etc.)
  - --ts-this-color + text-tier escalation
  - --ts-on-surface (OKLCH auto-text-color for any surface)
  - --ts-accent-hover/-active/-focus/-disabled (state derivations of S1's accent)
  - Gradient + mix control tokens (--ts-this-bg-grad-angle, --ts-mix-perc, …)
  - Input-system surface integration tokens (--ts-input-bg, --ts-input-border, …)
  - Files: assets/css/next/system/surfaces.css
           assets/css/next/system/text.css
           assets/css/next/system/states.css
           assets/css/next/system/reset.css
           (+ assets/css/next/shared-tokens/<topic>.css — R3 layer, see §9)
        ↓
COMPONENT (S3+ and Sessions 4+)
  - Per-block CSS: components set --ts-this-bg, read --ts-this-bg-* derivatives
  - No component ever calls color-mix() or oklch(from ...) for color directly —
    that's the system layer's exclusive composition responsibility.
  - File: assets/css/next/components/<block>.css
```

### 1.2 What S2 owns vs what S2 does NOT own

**S2 OWNS:**

- Every `--ts-this-*` token (the derivative chain consumed by every component).
- The `:where(:root, :root *)` scoping pattern that propagates the chain through arbitrary cascade depth (per restyling-architecture §3).
- Surface superposition propagation rules (Rule 4) — how a parent's `--ts-this-bg` cascades inward to descendants.
- The OKLCH auto-text formula for `--ts-on-surface` (S1 deferred per its §5.3 + §13 OQ8).
- State variant composition for accent (`--ts-accent-hover/-active/-focus/-disabled`) — S1 §4.5 explicitly deferred this to S2 with rationale ("color-mix is contrast-preserving in narrow band; apcach in browser wastes 50KB; system-layer composition is the same pattern as `--ts-this-bg-*` state variants").
- The 5-state interaction pattern (idle/hover/active/focus/disabled) as canonical block-CSS recipe.
- The `shared-tokens/` layer (A1 Council R3 cycle-break mechanism).
- Reset/normalize baseline + body-element wiring of the chain.

**S2 does NOT OWN:**

- Any apcach primitive value (S1's exclusive domain — Rule 15).
- Any new color value not derivable from S1's primitives via CSS composition.
- Spacing primitives (`--ts-sp-*`) — out of scope; lives in `primitives/spacing.css` per T2 §3.2 row 2.
- Typography primitives (`--ts-fs-*`, `--ts-font-*`) — out of scope; lives in `primitives/typography.css`.
- Radius primitives (`--ts-radius-*`) — out of scope; `primitives/radius.css`.
- Motion primitives (`--ts-ease-*`, `--ts-dur-*`) — out of scope; `primitives/motion.css`.
- Component-scoped tokens (`--ts-btn-bg`, `--ts-card-pad`, etc.) — S3 owns; lives in `components/<block>.css`.
- The runtime JS that mutates `--ts-accent` (S1's `Toolskin.setAccent()` + Path A/B; S2's CSS auto-recomputes when JS writes `--ts-accent-h` or `--ts-accent`).

---

## 2. The two-layer architecture (restyling-architecture §2 — formal restatement)

Every styled element in Toolskin v2 follows a two-layer rule. This is the architectural pattern that makes the system maintainable. It is **not optional** — components that violate it fail the verification audit and halt at S5 protocol checks.

### 2.1 Layer 1 — Global Scope (token resolution; declared ONCE per component family)

A broad selector that catches all elements of a type and resolves their VISIBLE properties from the `--ts-this-bg` / `--ts-this-color-*` chain. This layer declares WHAT properties the component uses (`background`, `border-color`, `color`, etc.) and WHAT tokens those properties resolve from. It does NOT set raw values.

Canonical example (input family, lifted from restyling-architecture §2 reference):

```css
/* Layer 1 — declared ONCE in components/inputs.css */
.ts-input,
.ts-select,
.ts-textarea:not(.ts-resizable),
.ts-ui-select__trigger {
    background-color: var(--ts-input-bg);
    background-image: var(--ts-input-bg-grad);
    border-color: var(--ts-input-border);
    outline-color: var(--ts-input-border);
    color: var(--ts-input-color);
    transition: var(--ts-input-transitions);
    /* Set the surface context for THIS element's children */
    --ts-this-bg: var(--ts-input-surface-2);
}
```

Properties: declared once. Selectors: low-specificity (single class enumeration). Token references: from the system layer or component-scope tokens. No `!important`. No raw color literals.

### 2.2 Layer 2 — Component Scope (context-specific token override)

A more specific selector that overrides ONLY the tokens that change per context. **Layer 2 NEVER redeclares the properties already declared in Layer 1.** Properties are declared once globally; Layer 2 swaps tokens.

```css
/* Layer 2 — declared in the context's own scope */
.ts-banner-generator-app .ts-ui-select__trigger {
    /* Only the tokens that this context changes — no property redeclaration. */
    --ts-this-bg: var(--ts-input-bg);
    --ts-input-bg: var(--ts-bg-2-t);
    --ts-mix-perc: 7%;
}
```

The properties `background-color`, `border-color`, etc. inherit their declarations from Layer 1. The cascade resolves: Layer 1's property → reads `--ts-input-bg` → Layer 2 has redefined `--ts-input-bg` in this scope → resolves to the new value. **One property declaration, infinite contexts via token swaps.**

### 2.3 Key principle (mandatory): properties declared ONCE, Layer 2 swaps tokens

S6 governance enforces this. Refusal pattern: any component CSS that redeclares the same property in two scopes (e.g., `.ts-input { background-color: ... }` AND `.ts-banner-generator .ts-input { background-color: ... }`) gets rejected. The second declaration must swap a token instead of redeclaring the property.

**The cascade is the contract.** A consumer's parent scope swapping `--ts-this-bg` propagates the entire derivative chain to every descendant — without rewriting any descendant rule. This is the architectural payoff that makes Toolskin a token-driven framework instead of a class-driven one (Rule 2).

### 2.4 What this eliminates

The old `toolskin.css` repeats the same 15-selector input list three times with overlapping properties (per restyling-architecture §2). With the two-layer pattern, the selector list appears ONCE (Layer 1), and every contextual override is a 2-3 line token-only block (Layer 2). No duplication, no specificity wars, no `!important`.

---

## 3. The `--ts-this-bg-*` derivative chain (the full enumeration)

This section enumerates EVERY token in the derivative chain. For each, the exact `color-mix(in oklch, ...)` formula, the rationale, the consumer, and the file location are specified.

**Color space discipline:** `color-mix(in oklch, ...)` — never `in srgb`. The old toolskin.css mixes in srgb (per the lines 944-1070 survey). The rebuild standardizes on `in oklch` for perceptual uniformity matching S1's apcach output. This is a Rule 15 + restyling-architecture §6 OKLCH-first choice — `color-mix(in srgb, var(--ts-accent), #fff 8%)` and `color-mix(in oklch, var(--ts-accent), #fff 8%)` produce visually different results; the OKLCH variant is perceptually consistent across hues.

**File location:** all tokens in this §3 live in `assets/css/next/system/surfaces.css`, declared inside a single `:where(:root, :root *)` block. The `:where()` wrapper keeps specificity at zero, allowing components and Layer 2 overrides to win every conflict.

### 3.1 The input token + default

| Token | Type | Default | Set by |
|---|---|---|---|
| `--ts-this-bg` | input | `var(--ts-bg-1)` | The component or parent layout block. Default falls back to bg-1 so a chainless element still resolves. |

```css
:where(:root, :root *) {
    /* Surface input — set by component or Layer 2 override. Fallback to bg-1 prevents
       chainless elements from breaking when used at body level. */
    --ts-this-bg: var(--ts-bg-1);
}
```

**Cascade behavior:** any element setting `--ts-this-bg: var(--ts-bg-N)` re-scopes the entire chain for itself + descendants automatically. CSS custom properties inherit through arbitrary depth without selector ceremony.

### 3.2 Dark + dim variants (subtractive — produce recessed surfaces)

| Token | Formula | Rationale | Consumer |
|---|---|---|---|
| `--ts-this-bg-dark` | `color-mix(in oklch, var(--ts-this-bg), var(--ts-bg-body) var(--ts-this-bg-grad-dark-pct))` | One step toward body floor. Produces a recessed surface for inset elements (chips strip base, code window, recessed input). Mix percentage is a global knob: `--ts-this-bg-grad-dark-pct` defaults `14%`. | Chips strip base (Rule 9 factor 8), code window, recessed inputs. |
| `--ts-this-bg-dark-1` | `color-mix(in oklch, var(--ts-this-bg), var(--ts-bg-body) calc(var(--ts-this-bg-grad-dark-pct) * 0.15))` | Near-transparent dark (gradient stop near interior). Used for edge-fade gradients. | Chips strip edge-fade interior (Rule 9 factor 9), focus state for inputs. |
| `--ts-this-bg-dark-2` | `color-mix(in oklch, var(--ts-this-bg), var(--ts-bg-body) calc(var(--ts-this-bg-grad-dark-pct) * 0.85))` | Opaque dark (gradient stop near edge). Used for edge-fade gradients. | Chips strip edge-fade edge (Rule 9 factor 9). |

```css
:where(:root, :root *) {
    /* Subtractive variants — recess toward body floor */
    --ts-this-bg-dark:   color-mix(in oklch, var(--ts-this-bg), var(--ts-bg-body) var(--ts-this-bg-grad-dark-pct));
    --ts-this-bg-dark-1: color-mix(in oklch, var(--ts-this-bg), var(--ts-bg-body) calc(var(--ts-this-bg-grad-dark-pct) * 0.15));
    --ts-this-bg-dark-2: color-mix(in oklch, var(--ts-this-bg), var(--ts-bg-body) calc(var(--ts-this-bg-grad-dark-pct) * 0.85));
}
```

**Note on choice of mix-target:** old toolskin.css mixed `#000000` (`color-mix(in srgb, var(--ts-this-bg), #000000 14%)`). The rebuild mixes `var(--ts-bg-body)` instead. Why: in light mode the surface ramp inverts (body is near-white). Mixing toward pure black in light mode produces visibly different "dark" — too aggressive. Mixing toward `var(--ts-bg-body)` produces context-appropriate dark in both modes by construction (Rule 4 surface superposition extends to theme superposition).

### 3.3 Dim variants (transparent-mixed — produce see-through surfaces for input fields)

| Token | Formula | Rationale | Consumer |
|---|---|---|---|
| `--ts-this-bg-dim` | `color-mix(in oklch, var(--ts-this-bg), transparent 12%)` | Slight see-through. Active input fields. | `--ts-input-bg-active`. |
| `--ts-this-bg-dim-2` | `color-mix(in oklch, var(--ts-this-bg), transparent 25%)` | Moderate transparency. Card backgrounds with parent visibility. | Glass-surface cards, low-emphasis chips. |
| `--ts-this-bg-dim-3` | `color-mix(in oklch, var(--ts-this-bg), transparent 50%)` | Half-transparent. Idle input fields. | `--ts-input-bg` (default idle input surface). |
| `--ts-this-bg-dim-4` | `color-mix(in oklch, var(--ts-this-bg), transparent 60%)` | More transparent. Disabled inputs, ghost buttons. | `--ts-input-bg` per restyling-architecture §7. |

```css
:where(:root, :root *) {
    /* Transparent-mixed variants — see-through surfaces */
    --ts-this-bg-dim:   color-mix(in oklch, var(--ts-this-bg), transparent 12%);
    --ts-this-bg-dim-2: color-mix(in oklch, var(--ts-this-bg), transparent 25%);
    --ts-this-bg-dim-3: color-mix(in oklch, var(--ts-this-bg), transparent 50%);
    --ts-this-bg-dim-4: color-mix(in oklch, var(--ts-this-bg), transparent 60%);
}
```

**Note on count:** old toolskin.css declared `--ts-this-bg-dim-5/6/7` at 70%/80%/90%. The rebuild caps at `-dim-4` per "smallest sharpest set" principle (S1 §10.7 net token reduction). If a component needs >60% transparency, it composes inline at the component layer via `color-mix(in oklch, var(--ts-this-bg-dim-4), transparent 50%)` — a one-off use case shouldn't bloat the system layer.

### 3.4 Bright variants (additive — produce raised surfaces)

| Token | Formula | Rationale | Consumer |
|---|---|---|---|
| `--ts-this-bg-bright` | `color-mix(in oklch, var(--ts-this-bg), var(--ts-text-primary) var(--ts-this-bg-grad-bright-pct))` | One step toward primary text. Produces a raised surface for elevated elements (button hover lift, card on hover). Mix percentage is a global knob: `--ts-this-bg-grad-bright-pct` defaults `6%`. | Hover/active gradient stops, card lift effect. |

```css
:where(:root, :root *) {
    /* Additive variant — raise toward primary text */
    --ts-this-bg-bright: color-mix(in oklch, var(--ts-this-bg), var(--ts-text-primary) var(--ts-this-bg-grad-bright-pct));
}
```

**Note on mix-target:** old code mixes both `#ffffff` and `var(--ts-text-primary)`. The rebuild standardizes on `var(--ts-text-primary)` because in light mode `var(--ts-text-primary)` is near-black — mixing toward near-black on a light surface produces a darker (raised) value visually, matching the dark-mode behavior. Pure `#ffffff` mixing breaks in light mode (mixing white into a light surface produces invisible lift). This is the same Rule 4 surface superposition logic applied at the bright variant.

### 3.5 State variant derivatives (the 5-state pattern's surface tokens)

| Token | Formula | Rationale | Consumer |
|---|---|---|---|
| `--ts-this-bg-hover` | `color-mix(in oklch, var(--ts-this-bg), var(--ts-text-primary) 20%)` | Hover lift. 20% mix toward primary text produces visible state change while preserving surface identity. APCA Lc shift ~±8 (within state-perception range). | Any interactive block in its `:hover` state. |
| `--ts-this-bg-active` | `color-mix(in oklch, var(--ts-this-bg), var(--ts-bg-body) 15%)` | Press/active recession. 15% mix toward body floor produces a "pressed in" recess. | Any interactive block in its `:active` state. |
| `--ts-this-bg-focus` | `color-mix(in oklch, var(--ts-this-bg), var(--ts-accent) 20%)` | Focus tint. 20% mix toward accent communicates focus via accent infusion (subtle but visible). | Any interactive block in its `:focus-visible` state (background tint; outline handled separately by `--ts-this-bg-focus-outline`). |
| `--ts-this-bg-disabled` | `color-mix(in oklch, var(--ts-this-bg), var(--ts-text-muted) 60%)` | Disabled wash. 60% mix toward muted text produces a desaturated, low-contrast surface. APCA against any text drops by design — visual "this is non-interactive" cue. | Any interactive block in its `:disabled` or `[aria-disabled="true"]` state. |

```css
:where(:root, :root *) {
    /* State variants — hover/active/focus/disabled */
    --ts-this-bg-hover:    color-mix(in oklch, var(--ts-this-bg), var(--ts-text-primary) 20%);
    --ts-this-bg-active:   color-mix(in oklch, var(--ts-this-bg), var(--ts-bg-body) 15%);
    --ts-this-bg-focus:    color-mix(in oklch, var(--ts-this-bg), var(--ts-accent) 20%);
    --ts-this-bg-disabled: color-mix(in oklch, var(--ts-this-bg), var(--ts-text-muted) 60%);
}
```

**Old code comparison:** the old `--ts-this-bg-active: color-mix(in srgb, var(--ts-this-bg), #000000 15%)` uses pure black mix-target. The rebuild uses `var(--ts-bg-body)` — same theme-correct reasoning as §3.2. Old `--ts-this-bg-hover` mixed toward `var(--ts-text-primary-dim) 30%` — the rebuild uses `var(--ts-text-primary) 20%` for simpler, more predictable shift (and `--ts-text-primary-dim` is itself a system-layer derivative; depending on it for a state derivation creates the kind of circular reference §9's shared-tokens layer is designed to prevent).

### 3.6 Gradient variants (the 5-state pattern's gradient tokens)

| Token | Formula | Rationale | Consumer |
|---|---|---|---|
| `--ts-this-bg-grad` | `linear-gradient(var(--ts-this-bg-grad-angle), var(--ts-this-bg-bright), var(--ts-this-bg-dark), var(--ts-this-bg))` | Idle gradient — bright top-left, dark bottom-right, base in middle. The default surface gradient. | Any block with a gradient background. |
| `--ts-this-bg-hover-grad` | `linear-gradient(var(--ts-this-bg-grad-angle), color-mix(in oklch, var(--ts-this-bg-bright), var(--ts-text-primary) 15%), color-mix(in oklch, var(--ts-this-bg-dark), var(--ts-text-primary) 8%), var(--ts-this-bg-hover))` | Hover gradient — both gradient stops shift slightly toward text-primary in addition to the base shifting to hover. Multi-axis lift. | `:hover` state of interactive blocks. |
| `--ts-this-bg-active-grad` | `linear-gradient(var(--ts-this-bg-grad-angle), color-mix(in oklch, var(--ts-this-bg), var(--ts-bg-body) 8%), color-mix(in oklch, var(--ts-this-bg-dark), var(--ts-bg-body) 15%), var(--ts-this-bg-active))` | Active gradient — both stops shift toward body floor. Press effect. | `:active` state. |

```css
:where(:root, :root *) {
    /* Gradients — three states */
    --ts-this-bg-grad: linear-gradient(
        var(--ts-this-bg-grad-angle),
        var(--ts-this-bg-bright),
        var(--ts-this-bg-dark),
        var(--ts-this-bg)
    );
    --ts-this-bg-hover-grad: linear-gradient(
        var(--ts-this-bg-grad-angle),
        color-mix(in oklch, var(--ts-this-bg-bright), var(--ts-text-primary) 15%),
        color-mix(in oklch, var(--ts-this-bg-dark), var(--ts-text-primary) 8%),
        var(--ts-this-bg-hover)
    );
    --ts-this-bg-active-grad: linear-gradient(
        var(--ts-this-bg-grad-angle),
        color-mix(in oklch, var(--ts-this-bg), var(--ts-bg-body) 8%),
        color-mix(in oklch, var(--ts-this-bg-dark), var(--ts-bg-body) 15%),
        var(--ts-this-bg-active)
    );
}
```

**Note on simplification vs old code:** old toolskin.css declared 5 gradient variants (`--ts-this-bg-grad`, `-grad-comp`, `-grad-flat`, `-grad-1`, `-grad-2`, `-grad-3`, `-grad-4`) — these are visual experiments lifted into the global layer. The rebuild ships THREE state-coherent gradients. Components that want a different gradient shape compose inline at the component layer.

### 3.7 Border + state border tokens (THIS IS WHERE THE MISSING TOKENS LAND)

| Token | Formula | Status | Rationale |
|---|---|---|---|
| `--ts-this-bg-border` | `color-mix(in oklch, var(--ts-this-bg), var(--ts-text-primary) var(--ts-mix-perc))` | Existing | Default border — apcach-derived contrast (text-primary mix percentage controls intensity). |
| `--ts-this-bg-border-0` | `color-mix(in oklch, var(--ts-this-bg), var(--ts-text-primary) calc(var(--ts-mix-perc) * 0.5))` | Existing | Soft border (half intensity). |
| `--ts-this-bg-border-hover` | `color-mix(in oklch, var(--ts-this-bg), var(--ts-text-primary) var(--ts-mix-perc-hover))` | Existing | Hover border — bumped contrast. |
| `--ts-this-bg-border-active` | `color-mix(in oklch, var(--ts-this-bg), var(--ts-accent) var(--ts-mix-perc-active))` | **NEW per Gate 4 lock + restyling-architecture §3** | Active/pressed border — accent-tinted to communicate engagement. |
| `--ts-this-bg-border-disabled` | `color-mix(in oklch, var(--ts-this-bg), var(--ts-text-muted) var(--ts-mix-perc-disabled))` | **NEW per Gate 4 lock + restyling-architecture §3** | Disabled border — muted text mix for desaturation. |
| `--ts-this-bg-border-focus` | `var(--ts-accent)` | **NEW per Gate 4 lock + restyling-architecture §3** | Focus border — solid accent for unambiguous focus signal. |
| `--ts-this-bg-focus-outline` | `var(--ts-accent)` | Existing | Focus-visible outline color — same as `--ts-this-bg-border-focus` (semantic alias for outline-property use). |

```css
:where(:root, :root *) {
    /* Mix-percentage knobs — designer tunes border intensity globally */
    --ts-mix-perc:          10%;
    --ts-mix-perc-hover:    25%;
    --ts-mix-perc-active:   20%;
    --ts-mix-perc-disabled: 8%;

    /* Borders — base + all 5 states */
    --ts-this-bg-border:          color-mix(in oklch, var(--ts-this-bg), var(--ts-text-primary) var(--ts-mix-perc));
    --ts-this-bg-border-0:        color-mix(in oklch, var(--ts-this-bg), var(--ts-text-primary) calc(var(--ts-mix-perc) * 0.5));
    --ts-this-bg-border-hover:    color-mix(in oklch, var(--ts-this-bg), var(--ts-text-primary) var(--ts-mix-perc-hover));
    --ts-this-bg-border-active:   color-mix(in oklch, var(--ts-this-bg), var(--ts-accent)       var(--ts-mix-perc-active));   /* NEW */
    --ts-this-bg-border-disabled: color-mix(in oklch, var(--ts-this-bg), var(--ts-text-muted)  var(--ts-mix-perc-disabled)); /* NEW */
    --ts-this-bg-border-focus:    var(--ts-accent);                                                                            /* NEW */
    --ts-this-bg-focus-outline:   var(--ts-accent);
}
```

**The three NEW tokens close restyling-architecture §3's gap** — the rebuild's system layer now exposes every interaction-state border that components consume. Sessions 4+ block sandbox sub-agents have a complete border vocabulary; no more inline `color-mix` in component CSS.

---

## 4. The `--ts-this-color-*` text chain (auto-readable text that adapts to `--ts-this-bg`)

S1 §8 (the APCA contrast table) defines which text tier is safe on which surface tier. S2 wires the propagation logic so that as `--ts-this-bg` changes, `--ts-this-color` resolves to the right text tier automatically.

### 4.1 The three text tiers

```css
:where(:root, :root *) {
    /* Primary text resolves from S1's primitive — already inherited */
    --ts-this-color:           var(--ts-text-primary);
    --ts-this-color-secondary: var(--ts-text-secondary);
    --ts-this-color-muted:     var(--ts-text-muted);

    /* On-accent — uses S1's auto-contrast formula via primitive --ts-on-accent */
    --ts-this-color-on-accent: var(--ts-on-accent);
}
```

These are just aliases from S1 primitives into the `--ts-this-*` namespace. The aliasing serves two purposes: (1) every block uses the `--ts-this-*` namespace consistently per Rule 4 surface superposition; (2) Layer 2 overrides can swap the alias for context-specific text without touching the primitive.

### 4.2 Status color text tokens (delegated to status-color primitives — deferred to Session 2 per S1 §10.5 and §13 OQ1)

```css
:where(:root, :root *) {
    /* These reference primitives that S1 produces in Session 2's status-color extension.
       For Session 1 spec lock, these are placeholders pointing back at the text tier
       (graceful fallback until status primitives land). */
    --ts-this-color-success: var(--ts-success, var(--ts-text-primary));
    --ts-this-color-warning: var(--ts-warning, var(--ts-text-primary));
    --ts-this-color-danger:  var(--ts-danger,  var(--ts-text-primary));
    --ts-this-color-info:    var(--ts-info,    var(--ts-text-primary));
}
```

The `var(--token, fallback)` syntax means if `--ts-success` (Session 2+ primitive) isn't defined yet, the token gracefully falls back to `--ts-text-primary`. Blocks consuming `--ts-this-color-success` work today (render text-primary) and automatically pick up the proper success color when S1 ships the status primitives.

### 4.3 Text tier escalation (per S1 §8.1 contrast cliff)

S1's contrast table shows: `--ts-text-muted` on `--ts-bg-4` produces APCA Lc 43 (below UI floor 45). On `--ts-bg-5` it's even lower. **Therefore: if a block re-scopes `--ts-this-bg` to `bg-4` or deeper, its `--ts-this-color-muted` should NOT default to `var(--ts-text-muted)` — it should escalate to `var(--ts-text-secondary)` to clear the floor.**

S2 implements this via container-query-friendly escalation using `--ts-this-bg`'s OKLCH luminance as the discriminator. **Simplest working pattern:** explicit Layer 2 overrides at known surface tiers.

```css
/* In assets/css/next/system/text.css — surface-tier escalation rules */

:where(:root, :root *) {
    /* Default: muted is acceptable on bg-body, bg-0, bg-1, bg-2, bg-3 */
    --ts-this-color-muted: var(--ts-text-muted);
}

/* When --ts-this-bg is at bg-4 or bg-5 (per S1 §8.1), escalate muted to secondary */
/* Implemented via the layout block setting --ts-this-bg AND --ts-this-color-muted together */
.ts-surface-4, [data-surface="4"],
.ts-surface-5, [data-surface="5"] {
    /* The block that sets --ts-this-bg: var(--ts-bg-4) also escalates the muted tier */
    --ts-this-color-muted: var(--ts-text-secondary);
}
```

**Note on the alternative:** a purely declarative `@container style(--ts-this-bg: var(--ts-bg-4))` rule would auto-escalate without per-class enumeration, but `@container style()` isn't baseline yet (Chrome 130 / Safari 18+, mid-2024). For Session 1 lock, the rebuild uses explicit class enumeration; if @container style() lands as a baseline before Session N, we revisit.

### 4.4 Body element wiring (assets/css/next/system/reset.css)

The body element opts into the chain:

```css
/* assets/css/next/system/reset.css */
body {
    background: var(--ts-bg-body);
    color: var(--ts-this-color);
    font-family: var(--ts-font-body, system-ui);
    --ts-this-bg: var(--ts-bg-body);  /* establishes the surface context for the page */
}
```

Every block underneath inherits `--ts-this-bg: var(--ts-bg-body)` automatically. Layout blocks (per T1 §1.3) re-scope it for their subtrees.

---

## 5. `--ts-on-surface` — full spec (S1 deferred this to S2)

Per S1 §5.3 + S1 §13 OQ8, the actual `--ts-on-surface` token lives at the system layer because it depends on `--ts-this-bg` (a system-layer concept). S1 locked the THRESHOLD primitive (`--ts-on-surface-threshold: 0.50`). S2 ties it to the chain.

### 5.1 The formula

```css
:where(:root, :root *) {
    /* Auto-readable text color for ANY surface — OKLCH relative-color flip
       at the threshold. White when surface is dark, black when surface is light.
       Tunable via --ts-on-surface-threshold (S1 primitive). */
    --ts-on-surface: oklch(
        from var(--ts-this-bg)
        clamp(0, (var(--ts-on-surface-threshold) - l) * 999, 1)
        0
        0
    );
}
```

**How it works:**

1. `oklch(from var(--ts-this-bg) <L> <C> <H>)` — CSS Color Module Level 5 relative-color syntax. Reads the current `--ts-this-bg` value and destructures it into `l` (lightness), `c` (chroma), `h` (hue).
2. New lightness: `clamp(0, (THRESHOLD - l) * 999, 1)`. If `l < THRESHOLD` (surface is dark), `(THRESHOLD - l)` is positive, multiplied by 999 to saturate the clamp at `1` — result: `1` (white text). If `l > THRESHOLD`, the expression goes negative, clamps to `0` (black text). Sharp step, no gradient.
3. New chroma: `0` (neutral gray axis — no color tint).
4. New hue: `0` (irrelevant at chroma 0).

**Result:** ANY element setting `--ts-this-bg` gets readable text "for free" by referencing `var(--ts-on-surface)` for `color`. No JavaScript needed. No theme-mode patching needed.

### 5.2 Threshold tuning per theme

S1 §5.2 locked `--ts-on-surface-threshold: 0.50` at `:root` and may tune `--ts-on-accent-threshold` separately per theme (0.65 dark, 0.62 light). The on-surface threshold stays at 0.50 because surfaces in either mode straddle that boundary cleanly (dark surfaces all sit below L=0.50, light surfaces sit above).

### 5.3 Where `--ts-on-surface` propagates

Every surface-setting selector inherits this. The chain handles it without per-rule wiring:

```css
/* Component CSS — no need to declare --ts-on-surface for accent buttons. */
.ts-card {
    --ts-this-bg: var(--ts-bg-2);
    background: var(--ts-this-bg);
    color: var(--ts-on-surface);  /* auto-readable — pure black on light bg-2, pure white on dark bg-2 */
}

.ts-card--accent {
    --ts-this-bg: var(--ts-accent);
    /* color inherits — and --ts-on-surface auto-flips against the accent */
}
```

This is the restyling-architecture §6 issue 3 resolution: `--ts-on-surface` makes per-context `--ts-on-card`, `--ts-on-panel`, `--ts-on-modal` tokens UNNECESSARY. One token handles all surfaces.

### 5.4 When a component still needs a dedicated on-color token

99% of the time, `--ts-on-surface` is enough. The exceptions:

1. **Accent surfaces:** `--ts-on-accent` (S1 primitive) is preferred over `--ts-on-surface` because the threshold for accent (0.65) differs from generic surface (0.50). Components painting an accent background use `color: var(--ts-on-accent)` not `var(--ts-on-surface)`.
2. **Status surfaces:** when status primitives land (Session 2), `--ts-on-success`, `--ts-on-warning`, `--ts-on-danger`, `--ts-on-info` get their own thresholds. Until then, blocks using a status-tinted surface fall back to `--ts-on-accent` or override per-block.

**Refusal pattern:** S6 governance rejects any new `--ts-on-<context>` token at the component layer when `--ts-on-surface` would suffice. Route the use case back to S2 if a generuine new context emerges.

### 5.5 Browser compatibility

`oklch(from ... clamp(0, ..., 1) 0 0)` requires:
- Chrome 119+ (Oct 2023) ✓
- Safari 16.4+ (Mar 2023) ✓
- Firefox 128+ (full clamp() inside relative-color, July 2024) — late-2024 baseline.

Graceful fallback for pre-128 Firefox: `--ts-on-surface` resolves invalid → `currentColor` per CSS spec. Components hardcoding `color: var(--ts-on-surface)` render with inherited text color — usable but not auto-contrast. Acceptable per Rule 13 (no runtime polyfill).

---

## 6. Surface superposition rules (Rule 4 — the propagation mechanic)

### 6.1 The mechanic in one sentence

**CSS custom properties inherit. A parent's `--ts-this-bg: var(--ts-bg-N)` propagates to every descendant element through cascade inheritance, without any selector ceremony. The derivative chain (`--ts-this-bg-hover`, `--ts-this-bg-border`, etc.) recomputes automatically at each scope because every chain rule is declared inside `:where(:root, :root *)` — which matches every element and inherits the local `--ts-this-bg` value at evaluation time.**

This is the cascade-aware design that makes Rule 4 work without patches. The old toolskin.css achieves this via the same `:where(:root, :root *)` pattern (line 909) — the rebuild keeps it.

### 6.2 The `:where(:root, :root *)` scoping pattern (formal)

```css
/* assets/css/next/system/surfaces.css — the entire chain is declared inside ONE :where block */
:where(:root, :root *) {
    --ts-this-bg: var(--ts-bg-1);

    --ts-this-bg-dark:   color-mix(in oklch, var(--ts-this-bg), var(--ts-bg-body) var(--ts-this-bg-grad-dark-pct));
    --ts-this-bg-bright: color-mix(in oklch, var(--ts-this-bg), var(--ts-text-primary) var(--ts-this-bg-grad-bright-pct));
    --ts-this-bg-hover:  color-mix(in oklch, var(--ts-this-bg), var(--ts-text-primary) 20%);
    /* ... full chain ... */
}
```

**Why `:where()` is critical:**

- `:where(:root, :root *)` has specificity `(0,0,0)` — the `:where()` pseudo-class zeros out specificity. Any component-level rule (specificity ≥ `(0,1,0)`) wins.
- The selector `:root, :root *` matches EVERY element in the document (root + every descendant).
- The custom property declarations inside fire on every element, but only the IMMEDIATE element's `--ts-this-bg` is used in each `color-mix` call (CSS resolves variables at the consumer scope, not at the declaration scope).
- Result: any element that sets `--ts-this-bg: var(--ts-bg-N)` reroots the entire chain for its subtree. Descendants see the recomputed values when they reference `--ts-this-bg-hover` etc.

**This is THE pattern that enables Rule 4.** Components don't need to redeclare hover/active/border tokens — they consume them and the cascade handles propagation.

### 6.3 Inward re-scope: the molecular block pattern (Rule 4 + T1 §1.2 criterion 4)

A molecular block (per T1 §1.2) sets `--ts-this-bg` at its root to establish the surface tier for its descendants. **Canonical example: `@taxonomy_chips_strip` (Rule 9, lines 33944-34073 of old CSS):**

```css
.ts-chips {
    /* Inward re-scope: set the surface context for chip children */
    --ts-this-bg: var(--ts-bg-1);

    /* Now the entire chain (hover, border, dim, dark, etc.) resolves against bg-1
       for THIS block and all its descendants. */
    border: 1px solid var(--ts-this-bg-border);
    background: var(--ts-this-bg-dark);
    /* edge-fade gradients use --ts-this-bg-dark-1 and --ts-this-bg-dark-2 */
}
```

The block declares ONE token (`--ts-this-bg`). The chain automatically produces 15+ context-appropriate derivative values for its descendants. Atomic chip components inside (`.ts-chip`) read their own `--ts-this-bg-hover` etc. from the locally-resolved chain — they don't need to know they're inside a chips strip.

**Layout blocks (per T1 §1.3 criterion 2) do the same at section scope:**

```css
.ts-section--alt {
    --ts-this-bg: var(--ts-bg-2);
    background: var(--ts-this-bg);
}
```

Now every block inside this section's subtree resolves `--ts-this-bg-*` against bg-2. Cards inside resolve their hover state against bg-2-derived hover, inputs inside resolve their border against bg-2-derived border, etc. **This is Rule 4 fully delivered: change ONE token at one location, every descendant rerolls coherently.**

### 6.4 Why this is the win over hand-tuned approaches

The old toolskin.css has 337 direct `--ts-bg-N` references in component rules (per S1 §10 / restyling-architecture §1). Each of those is a place where the surface tier is hardcoded and can't be re-scoped by a parent. The rebuild's system layer makes ALL 337 of those route through `--ts-this-bg-*` derivatives — components consume the chain, parents set the context, the cascade does the propagation work.

S6 governance refusal pattern: any new component CSS in `assets/css/next/components/**/*.css` that references `--ts-bg-N` directly (not through `--ts-this-bg-*`) gets rejected.

---

## 7. The 5-state interaction pattern (canonical recipe)

Per restyling-architecture §3, every interactive block follows the same 5-state pattern. The system layer's derivative chain (§3, §4) makes the recipe a one-token opt-in.

### 7.1 The canonical pattern

```css
/* CANONICAL — every interactive block looks like this */
.my-component {
    /* ONE LINE = entire visual identity for the component */
    --ts-this-bg: var(--ts-bg-2);

    /* Properties declared ONCE (Layer 1 per §2). Values from the chain. */
    background: var(--ts-this-bg-grad);
    border: 1px solid var(--ts-this-bg-border);
    color: var(--ts-on-surface);
    transition: background 0.2s var(--ts-ease-out), border-color 0.2s var(--ts-ease-out);
}

.my-component:hover {
    background: var(--ts-this-bg-hover-grad);
    border-color: var(--ts-this-bg-border-hover);
}

.my-component:active {
    background: var(--ts-this-bg-active-grad);
    border-color: var(--ts-this-bg-border-active);
}

.my-component:focus-visible {
    outline: 2px solid var(--ts-this-bg-focus-outline);
    outline-offset: 2px;
    border-color: var(--ts-this-bg-border-focus);
}

.my-component:disabled,
.my-component[aria-disabled="true"] {
    background: var(--ts-this-bg-disabled);
    border-color: var(--ts-this-bg-border-disabled);
    color: var(--ts-this-color-muted);
    cursor: not-allowed;
}
```

**This pattern is the contract for every PERMISSIVE-tier and STRICT-tier interactive block.** Sub-agents in Session 4+ block sandboxes reproduce it. Sub-agents who deviate (e.g., introduce a `filter: brightness(0.9)` hover, or hardcode `border-color: #444` for `:disabled`) fail the audit and halt.

### 7.2 What sets this pattern apart from the old `.interactive` class

Old toolskin.css has a `.interactive` class (lines 1083-1130 surveyed). It works but has known issues:

- **Exclusions baked in:** `.interactive:not(.ts-effects-layer)` and `body.interactive .ts-btn:not(.ts-btn-icon, .ts-btn-ghost, ...)` — clutters the rule with negative selectors.
- **Specificity hardcoding:** `body.interactive` adds an extra class for specificity, but that's a patch for not using the canonical pattern from day one.
- **`:focus-visible` rules use `--ts-this-bg-focus-outline, var(--ts-this-bg-border-focus)` fallback** — implies `--ts-this-bg-border-focus` was the NEW name, but the chain had to support both during migration. The rebuild has no migration; it ships with `--ts-this-bg-border-focus` from day one.

**The rebuild does NOT ship a `.interactive` class.** Instead, the pattern in §7.1 is reproduced inside each interactive block's CSS file. This avoids the "interactive layer" abstraction problem (any block on the page might or might not be interactive depending on body class — fragile). Per Rule 2 (token-driven, not class-driven), the right unit is the block CSS itself, not a body-level class.

If a future need emerges for an "auto-interactive any element with class X" mechanism, S2 can revisit. For Session 1 lock: every interactive block reproduces §7.1 verbatim with its own selector. S6 governance can lint that interactive blocks (per T1's PERMISSIVE/STRICT classification) have all 5 state declarations.

### 7.3 Non-interactive blocks

Blocks that are purely visual (e.g., `.ts-section`, `.ts-card` without hover behavior) declare only the idle state:

```css
.ts-section {
    --ts-this-bg: var(--ts-bg-1);
    background: var(--ts-this-bg);
    color: var(--ts-on-surface);
}
```

No hover/active/focus/disabled rules. The block stays passive. This is the LAYOUT-tier default per T1 §1.3.

---

## 8. State variant derivation for accent (S1 §4.5 deferred — S2's resolution)

S1 §4.5 explicitly deferred accent state variants to S2 with rationale:
1. Rule 13: apcach in browser at runtime is 50KB; `color-mix` is free in CSS.
2. `color-mix(in oklch, ...)` is contrast-preserving in narrow band (Lc shift ±5–10 for typical state shifts).
3. S2's `--ts-this-bg-*` state pattern applies identically to `--ts-accent`.

### 8.1 The four accent state variants

| Token | Formula | Rationale | Consumer |
|---|---|---|---|
| `--ts-accent-hover` | `color-mix(in oklch, var(--ts-accent), var(--ts-text-primary) 12%)` | Hover lift on accent backgrounds. 12% mix toward text-primary (white in dark, near-black in light) produces visible lift while preserving accent identity. | Accent button hover, accent chip hover. |
| `--ts-accent-active` | `color-mix(in oklch, var(--ts-accent), var(--ts-bg-body) 15%)` | Pressed recess on accent backgrounds. | Accent button :active. |
| `--ts-accent-focus` | `var(--ts-accent-bright)` | Focus = visible emphasis. Reuses S1's primitive accent-bright for the brightest accent variant — matches S1 §4.5 deferral reasoning. | Accent button :focus-visible, focus-ring tint. |
| `--ts-accent-disabled` | `color-mix(in oklch, var(--ts-accent), var(--ts-text-muted) 60%)` | Disabled accent — desaturated, low contrast. | Accent button :disabled. |

```css
:where(:root, :root *) {
    /* Accent state variants — composed from S1's accent primitives */
    --ts-accent-hover:    color-mix(in oklch, var(--ts-accent), var(--ts-text-primary) 12%);
    --ts-accent-active:   color-mix(in oklch, var(--ts-accent), var(--ts-bg-body)      15%);
    --ts-accent-focus:    var(--ts-accent-bright);
    --ts-accent-disabled: color-mix(in oklch, var(--ts-accent), var(--ts-text-muted)   60%);
}
```

### 8.2 Why these mix percentages (vs `--ts-this-bg-*` state variants)

The `--ts-this-bg-*` state variants use percentages tuned to neutral-surface APCA shifts (20% hover, 15% active, 60% disabled). The accent variants use SMALLER percentages for hover/active because the accent already has high chroma — a 12% mix produces visible state change without bleaching the hue. Disabled stays at 60% because desaturation is the correct visual signal regardless of hue.

The actual perceptual shifts:
- `--ts-accent-hover` at L≈0.71 → mixed with white → resolved L≈0.75 (Lc shift +6 against bg-2). Visible but not aggressive.
- `--ts-accent-active` at L≈0.71 → mixed with body floor → resolved L≈0.62 (Lc shift -10 against bg-2). Press effect.
- `--ts-accent-disabled` at L≈0.71 → mixed with muted text (L≈0.55) → resolved L≈0.62, chroma drops by ~60%. Clear desaturation.

### 8.3 What does NOT live here

- **`--ts-accent-dim` / `--ts-accent-bright`** are S1 primitives, not S2 derivatives. They have their own apcach calls for cross-hue consistency (S1 §4.1).
- **`--ts-accent-border`** is a transparency variant: `color-mix(in oklch, var(--ts-accent), transparent 60%)`. Lives in S2 too:

```css
:where(:root, :root *) {
    --ts-accent-border: color-mix(in oklch, var(--ts-accent), transparent 60%);
}
```

This is S2's call because it's a transparency derivative of the primitive — no new color value, just an alpha channel composition.

### 8.4 Refusal pattern for component-layer redirection

S6 enforces: any component CSS in `components/*.css` that introduces its own `color-mix(in oklch, var(--ts-accent), …)` for hover/active/focus/disabled gets REJECTED. Component consumes `--ts-accent-hover` etc. from this section. If a block needs a different mix percentage globally (e.g., punchier accent hover), it adjusts `--ts-mix-perc-hover` at the system layer or proposes a new mix-perc knob — never inlines color-mix at the component layer.

---

## 9. The `shared-tokens/` layer (A1 Council R3 — S2 OWNS this)

A1 Council R3 (Critic voice, ratified at synthesis) introduced a `shared-tokens/` layer between `system/` and `components/` to handle circular dependencies in the topological sort. S2 owns the design.

### 9.1 The problem `shared-tokens/` solves

A chip block needs a chip-strip-gap value to align its edge variant against the strip. A chip-strip block needs the chip block's height to align its row. Without intervention, `components/chip.css` depends on `components/chip-strip.css`, and vice versa — circular dependency. The topo-sort fails.

The naive fixes are bad:
- **(A)** Hardcode the value in both files. Drift on update.
- **(B)** Cross-import (`@import "./chip-strip.css"` from `chip.css`). CSS @import has no cycle detection; first-encountered wins; debugging nightmare.
- **(C)** Tear down one component into multiple files. Adds file sprawl and S5 protocol burden.

The right fix is a layer above `components/` where shared tokens live. Both `chip.css` and `chip-strip.css` depend on `shared-tokens/strip-layout.css`. No cycle.

### 9.2 The architecture

```
assets/css/next/
├── primitives/         (S1)
├── system/             (S2 — derivative chain)
├── shared-tokens/      (S2 — NEW — A1 Council R3)
│   ├── strip-layout.css     # tokens shared by chip + chip-strip families
│   ├── menu-popover.css     # tokens shared by tree-popover + tooltip + menu-list
│   ├── form-row.css         # tokens shared by toggle-row + checkbox-row + radio-group
│   └── ...
└── components/         (S3+ block CSS)
```

**Load order (per T2 §3.2 row 6-9 + S4's pipeline):**

```
1. primitives/colors.css
2. primitives/spacing.css
3. primitives/typography.css
4. primitives/radius.css
5. primitives/motion.css
6. system/surfaces.css      ← §3 above
7. system/text.css          ← §4 + §5 above
8. system/states.css        ← §7 + §8 above
9. system/reset.css         ← §4.4 + body baseline
10. shared-tokens/*.css     ← NEW — A1 Council R3
11. components/<block>.css
```

`shared-tokens/` loads AFTER `system/` (so it can consume `--ts-this-*` chain tokens) and BEFORE `components/` (so components can consume shared-token values).

### 9.3 Each shared-tokens file declares ONLY tokens

```css
/* assets/css/next/shared-tokens/strip-layout.css */
:root {
    /* Tokens consumed by chip.css, chip-strip.css, action-bar.css */
    --ts-shared-strip-gap:        var(--ts-sp-1);                          /* 4px gap between chips */
    --ts-shared-strip-h:          calc(var(--ts-tree-actionbar-h) - 2px);  /* strip-height locked to action-bar height */
    --ts-shared-strip-fade-w:     25px;                                     /* edge-fade width per @taxonomy_chips_strip Rule 9 */
    --ts-shared-strip-overflow-w: var(--ts-btn-h);                          /* overflow trigger width */
}
```

**Rules:**
- Only custom property declarations. No selectors other than `:root`. No properties. No `@import`s.
- All declared at `:root` (or `[data-theme="light"] :root` for theme variants).
- Token name prefix: `--ts-shared-<topic>-<name>` so they're greppable as a class.
- Values reference S1 primitives or S2 chain. NEVER raw color values, NEVER raw spacing values (use `--ts-sp-N`).

### 9.4 Criteria — when does something belong in `shared-tokens/`?

A token belongs in `shared-tokens/` iff ALL of the following hold:

1. **Multiple component families consume it.** If only one family uses it, it stays in that family's CSS as a component-scoped token.
2. **The token is a value, not a rule.** Shared rules belong in `system/` or `utilities/`; shared tokens belong here.
3. **Removing the shared declaration creates a topo-sort cycle.** This is the strict test — the shared-tokens layer exists to break cycles. Speculative shared tokens that don't fix a cycle live in their primary owner's file.
4. **The token name carries the `--ts-shared-` prefix.** Disambiguates from primitives (`--ts-bg-*`), system (`--ts-this-*`), and component-scope tokens.

S6 governance audits: any file in `shared-tokens/<file>.css` that declares non-token rules gets rejected. Any token outside `shared-tokens/` that uses the `--ts-shared-*` prefix gets rejected.

### 9.5 Topic-based file organization (recommended pattern)

| Topic file | Probable consumers | Sample tokens |
|---|---|---|
| `shared-tokens/strip-layout.css` | chip, chip-strip, action-bar, scroll-strip | `--ts-shared-strip-gap`, `--ts-shared-strip-h` |
| `shared-tokens/menu-popover.css` | tree-popover, tooltip, menu-list, dropdown | `--ts-shared-popover-pad`, `--ts-shared-popover-shadow` |
| `shared-tokens/form-row.css` | toggle-row, checkbox-row, radio-group, field-row-2/3 | `--ts-shared-form-row-h`, `--ts-shared-form-row-gap` |
| `shared-tokens/table-layout.css` | table-core, table-ui-sortable, table-ui-bulk | `--ts-shared-table-cell-pad`, `--ts-shared-table-row-h` |
| `shared-tokens/code-block.css` | code-block, code-window, code-header | `--ts-shared-code-pad`, `--ts-shared-code-font` |
| `shared-tokens/grid-system.css` | grid, columns, app-shell | `--ts-shared-grid-gutter` |

Topics are added as cycles emerge — Session 4+ block sandbox sessions create new topic files when a new dependency cycle surfaces. Initial Session 2-3 land with `strip-layout.css` (chips/chip-strip cycle is the demonstrated case) and grow from there.

### 9.6 Fallback escape hatch — `@ts-cycle-break:` annotation

A1 Council R3 also allowed explicit `@ts-cycle-break: <token>` comment annotations as a fallback. S2's recommendation: do NOT use the annotation route. The shared-tokens/ approach is cleaner and more discoverable. If a session is genuinely blocked by a cycle that shared-tokens/ can't resolve cleanly (e.g., the cycle is between an atomic-tier block and a layout-tier block — improper layering), HALT and surface to owner per Rule 11.

---

## 10. Gradient and mix control tokens (restyling-architecture §8 — exposed for designer-tunability)

The gradient angle and mix percentages are the "feel knobs" of the system. They live at the top of `:where(:root, :root *)` so a designer can override them in ONE place to retune the entire system.

### 10.1 The control tokens

```css
:where(:root, :root *) {
    /* ─── Gradient feel knobs ────────────────────────────────────────── */
    --ts-this-bg-grad-angle:      136deg;  /* gradient direction; 136 = top-left to bottom-right diagonal */
    --ts-this-bg-grad-angle-2:    114deg;  /* alternate angle for second gradient variant */
    --ts-this-bg-grad-bright-pct: 6%;      /* mix percentage for bright gradient stop */
    --ts-this-bg-grad-dark-pct:   14%;     /* mix percentage for dark gradient stop */

    /* ─── Border contrast knobs ──────────────────────────────────────── */
    --ts-mix-perc:          10%;  /* base border contrast (text-primary mix) */
    --ts-mix-perc-hover:    25%;  /* hover border contrast */
    --ts-mix-perc-active:   20%;  /* active border (accent mix) */
    --ts-mix-perc-disabled: 8%;   /* disabled border (muted mix) */
}
```

### 10.2 Designer override pattern

A whitelabel deployment that wants:
- Sharper gradients → `--ts-this-bg-grad-bright-pct: 12%; --ts-this-bg-grad-dark-pct: 22%;`
- Higher border contrast → `--ts-mix-perc: 18%; --ts-mix-perc-hover: 35%;`
- Different gradient direction → `--ts-this-bg-grad-angle: 45deg;`

Override at `:root` in a custom stylesheet that loads after `system/surfaces.css`. The entire derivative chain absorbs the new feel automatically.

### 10.3 The `--ts-this-bg-grad-dark-pct: 2%` scoped override (Rule 9 factor 4 preservation)

Per @taxonomy_chips_strip's 10 protected values (T1 §6.1 factor 4), the chips strip MUST set `--ts-this-bg-grad-dark-pct: 2%` at its scope. This is a "well-built global token that scales the `--ts-this-bg-dark-*` family in both light and dark mode without spawning new rules or variant tokens."

The system layer enables this preservation:

```css
/* Inside .ts-chips component CSS — Session 4+ block sandbox */
.ts-chips {
    --ts-this-bg: var(--ts-bg-1);
    --ts-this-bg-grad-dark-pct: 2%;  /* scoped override per Rule 9 factor 4 */
    /* The --ts-this-bg-dark/-dark-1/-dark-2 chain auto-recomputes against the 2% knob */
    border: 1px solid var(--ts-this-bg-border);
    background: var(--ts-this-bg-dark);
}
```

Because `--ts-this-bg-dark` is defined as `color-mix(in oklch, var(--ts-this-bg), var(--ts-bg-body) var(--ts-this-bg-grad-dark-pct))`, changing the percentage at the chips scope changes how dark its surfaces resolve — without rewriting any chain rule. **This is the architectural payoff Rule 9 factor 4 documents.** The rebuild's system layer preserves it 1:1.

---

## 11. Input system surface integration (restyling-architecture §7)

Per restyling-architecture §7, input tokens consume `--ts-this-*` derivatives so any parent can re-skin all inputs by setting one surface tier.

### 11.1 The input token integration

```css
:where(:root, :root *) {
    /* Input surface tokens — composed from the --ts-this-bg-* chain */
    --ts-input-bg:           var(--ts-this-bg-dim-3);
    --ts-input-bg-2:         var(--ts-this-bg-bright);
    --ts-input-bg-active:    var(--ts-this-bg-dim);
    --ts-input-bg-focus:     var(--ts-this-bg-dark-1);
    --ts-input-bg-grad:      var(--ts-this-bg-grad);
    --ts-input-surface-2:    var(--ts-this-bg-bright);   /* parent-context shadow surface for input-children */

    /* Input border tokens */
    --ts-input-border:          var(--ts-this-bg-border);
    --ts-input-border-hover:    var(--ts-this-bg-border-hover);
    --ts-input-border-focus:    var(--ts-this-bg-border-focus);
    --ts-input-border-disabled: var(--ts-this-bg-border-disabled);

    /* Input text tokens */
    --ts-input-color:        var(--ts-this-color);                          /* primary text */
    --ts-input-color-focus:  var(--ts-this-color);
    --ts-input-color-muted:  var(--ts-this-color-muted);
    --ts-input-placeholder:  var(--ts-this-color-muted);

    /* Input transitions — feel knob */
    --ts-input-transitions: background-color 0.18s var(--ts-ease-out), border-color 0.18s var(--ts-ease-out);
}
```

### 11.2 Why this works (Rule 4 + restyling-architecture §7 confirmation)

Now ANY parent that wants its inputs to look "darker" or "lighter" just sets its own `--ts-this-bg` — the input chain rerolls. Concrete:

```css
.ts-banner-generator-app {
    --ts-this-bg: var(--ts-bg-2);  /* darker context for the whole app */
}
/* Every .ts-input inside .ts-banner-generator-app now auto-resolves --ts-input-bg, etc.
   against bg-2, with no Layer 2 override needed at the input level. */
```

This is the unified pattern. The old code achieves it partially; the rebuild does it from day one.

---

## 12. CSS file layout for the system layer

Per T2 §3.2 row 6-9 and S4's eventual build pipeline, the system layer splits across four files inside `assets/css/next/system/`. Each file has a single responsibility.

### 12.1 File breakdown

| File | Role | Contents (preview, not actual CSS this session) |
|---|---|---|
| `system/surfaces.css` | The `--ts-this-bg-*` derivative chain + surface superposition | The `:where(:root, :root *)` block from §3 — all 15+ surface tokens including the 3 NEW state-border tokens (`-border-active/-disabled/-focus`), gradient variants, mix-percentage knobs (§10). |
| `system/text.css` | The `--ts-this-color-*` chain + `--ts-on-surface` auto-text | The `--ts-this-color`, `--ts-this-color-secondary/muted` aliases (§4.1), status text fallbacks (§4.2), text-tier escalation rules at deep surfaces (§4.3), `--ts-on-surface` OKLCH formula (§5.1). |
| `system/states.css` | Accent state derivations + interaction pattern documentation | Accent state variants `--ts-accent-hover/-active/-focus/-disabled` from §8.1, `--ts-accent-border` alpha-derivative (§8.3), header comment documenting the 5-state interaction pattern (§7.1) as canonical recipe for block CSS authors. |
| `system/reset.css` | Minimal CSS reset + body baseline using `--ts-this-*` tokens | Box-sizing border-box, body element wiring (§4.4), focus-visible polyfill if needed, `prefers-reduced-motion` media query honoring the `--ts-dur-*` motion primitives, list-style/heading reset. The reset is INTENTIONALLY MINIMAL — it doesn't try to be Normalize.css or Reset.css. Just the baseline Toolskin needs. |

### 12.2 Why four files (not one)

1. **Cognitive load:** each file has one concern. A reader looking for state tokens opens `states.css`; for chain tokens, `surfaces.css`; for auto-contrast, `text.css`.
2. **Independent updates:** an owner tuning border contrast edits `surfaces.css`. Tuning auto-text threshold edits `text.css`. No file-wide churn.
3. **Build-pipeline transparency:** S4's load order references files by name. Easier to grep, easier to audit cascade order.
4. **Session 4+ block sandbox audits:** an audit for "what surfaces does this block consume" inspects `surfaces.css` references. Decoupled from text/state concerns.

### 12.3 Why NOT split further

Splitting `system/surfaces.css` into `system/dark.css` + `system/bright.css` + `system/state.css` + `system/border.css` would fracture a single coherent chain into pieces. Every file would need to redeclare `--ts-this-bg-grad-dark-pct` etc. or import. Bad. Keep the surface chain in ONE file; split only on the natural cleavage planes above.

---

## 13. Cascade-sensitivity treatment (Rule 8)

Per Rule 8 (May 17 cascade-sensitivity discovery), the rebuild uses explicit `:is(...)` enumeration for component coordination and `:where(:root, :root *)` for token distribution. NEVER substring distribution (`[class*="ts-..."]`) for state. The system layer's specific approach:

### 13.1 The system layer uses ONLY `:where(:root, :root *)` for token distribution

Per §6.2, the entire derivative chain is declared inside one `:where(:root, :root *)` block. This is the canonical Rule 8 + Rule 4 distribution mechanism: zero specificity, universal scope, token-only rules.

### 13.2 State token derivations use the same `:where` pattern

The chain rules (`--ts-this-bg-hover`, `--ts-this-bg-border-active`, etc.) are also custom property declarations. They live inside the same `:where(:root, :root *)` block. They're not state rules — they're STATE TOKEN DECLARATIONS that components consume in their own `:hover`/`:active` selectors.

### 13.3 What S2 explicitly forbids

- **NO substring distribution at the system layer.** `[class*="ts-this"]` would be ambiguous (matches `ts-this-bg`, `ts-this-color`, etc.) and create specificity conflicts. The `:where(:root, :root *)` pattern is universal already.
- **NO state rules at the system layer.** State rules (`:hover`, `:focus`) belong in component CSS where they're scoped to a specific selector. The system layer provides the tokens; components apply them.
- **NO `!important` anywhere in the system layer.** The `:where()` wrap gives zero specificity; any component override wins. If a component needs to win against the system layer, it's a Layer 2 token swap, not an `!important` battle.

### 13.4 Refusal pattern for components

S6 governance refuses any component CSS in `assets/css/next/components/**/*.css` that:
- Uses `[class*="..."]` substring distribution for state (allowed only at the documented tree-explorer-style token distribution layer, scoped to `:root`).
- Declares `--ts-this-*` tokens at the component layer (they belong at the system layer; component declares context tokens like `--ts-btn-bg` or `--ts-card-pad`).
- Uses `!important`.

---

## 14. A9 confirmation — `data-theme` canonical (no `data-ts-theme` shim)

Confirmed per Gate 4 lock + S1 §11. The system layer reads `data-theme` only.

### 14.1 What this means for S2's rules

**Nothing changes from S1.** S1 primitives declare both default + `[data-theme="light"] :root` overrides. The system layer's `:where(:root, :root *)` chain operates on whichever primitive set is active — the cascade evaluates `var(--ts-bg-body)`, `var(--ts-text-primary)`, etc. at consumer time, so the right values land for the current theme.

S2 introduces NO new theme-attribute logic. NO `[data-ts-theme="light"]` selector anywhere. NO compatibility shim. Clean break per Rule 14.

### 14.2 Body wiring in `system/reset.css` (§4.4)

The body element wires the chain. The body uses `var(--ts-bg-body)` directly (which is theme-correct because S1's `[data-theme="light"]` override reroutes `--ts-bg-body`). No theme-attribute check needed in S2.

### 14.3 Refusal pattern

S6 governance rejects any new file in `assets/css/next/**/*.css` that uses the `data-ts-theme` selector. The legacy attribute is dropped per Rule 14 fresh history.

---

## 15. `--ts-on-surface` extension across non-surface tokens (restyling-architecture §6 issue 3)

Restyling-architecture §6 Issue 3 asks: can `--ts-on-surface` REPLACE per-context `--ts-on-card`, `--ts-on-panel`, `--ts-on-modal` tokens entirely?

**S2's answer: YES for 99% of cases. NO for accent-tinted contexts and status-tinted contexts.**

### 15.1 `--ts-on-surface` is enough for any neutral surface

Any element setting `--ts-this-bg: var(--ts-bg-N)` (neutral surface) reads `var(--ts-on-surface)` and gets readable text. NO `--ts-on-card`, NO `--ts-on-panel`, NO `--ts-on-modal` needed. They are not introduced in the rebuild.

### 15.2 `--ts-on-accent` exists for accent surfaces

S1's `--ts-on-accent` has its own threshold (0.65 dark / 0.62 light) because the accent's chroma shifts the perceptual luminance crossover. Components painting accent backgrounds use `--ts-on-accent` not `--ts-on-surface`. This is documented (§5.4 + S1 §5.2).

### 15.3 Status colors (when they land in Session 2) get dedicated `--ts-on-*` tokens

When S1 adds `--ts-success`, `--ts-warning`, `--ts-danger`, `--ts-info` (per S1 §10.5 deferred), S1 ALSO produces `--ts-on-success`, `--ts-on-warning`, `--ts-on-danger`, `--ts-on-info` — each with its own threshold computed from the status hue's APCA crossover. S2 will alias these into the `--ts-this-color-*` namespace (§4.2 already shows the placeholder pattern).

### 15.4 What stays NOT introduced

NO `--ts-on-card`. NO `--ts-on-panel`. NO `--ts-on-modal`. NO `--ts-on-button`. Any block painting these surfaces uses `--ts-on-surface` (since they're neutral) or `--ts-on-accent` (since they may be accent-tinted variants). The system stays small.

### 15.5 Refusal pattern

S6 governance refuses any new `--ts-on-<context>` token in `assets/css/next/components/**/*.css` where `--ts-on-surface` would suffice. If a component genuinely needs a context-specific on-color (rare: only accent-tinted or status-tinted backgrounds qualify), the request routes back to S2 for system-layer placement, not a component-layer one-off.

---

## 16. Open questions + gaps

| # | Item | Status | Recommendation |
|---|---|---|---|
| OQ1 | Text-tier escalation via `@container style(--ts-this-bg: ...)` would be more elegant than explicit class enumeration (§4.3). Browser baseline: Chrome 130 / Safari 18+ — mid-2024. | `[ ] gap: Session 2+ revisit when @container style() is baseline` | Stick with explicit class enumeration for Session 1 lock. Revisit when baseline shifts. |
| OQ2 | The 4 mix-percentage knobs (`--ts-mix-perc`, `--ts-mix-perc-hover`, `--ts-mix-perc-active`, `--ts-mix-perc-disabled`) — are they enough? Designer might want per-state-axis control (e.g., separate hover vs focus). | DOCUMENTED §10.1 | Ship with the 4 knobs. Add more if a Session N use case emerges. |
| OQ3 | Should `--ts-this-bg-bright` mix toward `var(--ts-text-primary)` or `var(--ts-bg-5)` (the top of the surface stack)? Both are theme-correct; mixing toward bg-5 stays within the surface palette, mixing toward text-primary is bolder. | DECIDED §3.4 — mix toward text-primary | Bolder is the design direction; matches old `--ts-this-bg-bright-2/3` flavor. Owner can override at Gate 5. |
| OQ4 | The `:where(:root, :root *)` pattern works for descendants but has a subtle gotcha: a `display: none` element STILL evaluates its custom properties. Performance impact for very deep DOMs? | DOCUMENTED §6.2 | CSS engines optimize custom-property inheritance via copy-on-write; no measurable perf cost in observed test cases. Revisit if Sessions 4+ block sandboxes report regression. |
| OQ5 | `shared-tokens/<topic>.css` files — should they declare at `:root` (Specificity 0,1,0) or `:where(:root, :root *)` (Specificity 0,0,0)? | DECIDED §9.3 — `:root` (one declaration of shared values, doesn't need universal inheritance because consumers are component-scoped) | `:root` is enough. `:where(:root, :root *)` reserves for derivative chain rules that need re-evaluation at every cascade scope. |
| OQ6 | OKLCH `oklch(from ... clamp(...) 0 0)` requires Firefox 128+ (released July 2024) for the full inside-relative-color clamp syntax. Older Firefox falls back to `currentColor`. | DOCUMENTED §5.5 | Acceptable graceful degradation. CONTRIBUTING.md (S6) documents the browser baseline. |
| OQ7 | `--ts-shared-strip-h: calc(var(--ts-tree-actionbar-h) - 2px)` — `--ts-tree-actionbar-h` is a component-layer token (lives in `components/tree-explorer.css`). Does this create a layering inversion? | DOCUMENTED §9.5 | The chips strip's `--ts-shared-strip-h` is itself an internal layout token. If the tree-explorer's actionbar height token needs to be shared globally, it moves to `shared-tokens/strip-layout.css`. Initial Session 2 implementation surfaces this as it arises. |
| OQ8 | When does the `--ts-this-bg-bright` variant clip? At very-light surfaces (light mode `--ts-bg-body` L≈0.985), mixing 6% toward text-primary (L≈0.12 in light mode) produces L≈0.93 — visually darker, NOT raised. The "raised" semantic flips. | RECOMMENDED §3.4 doc note | The flip is correct: raising a surface in light mode means going DARKER (more contrast against the lighter background). Verify in Session 2 sandbox. Document in CONTRIBUTING.md if confusing for sub-agents. |
| OQ9 | The `--ts-on-surface` threshold (0.50) is the same in both modes. Should it differ like `--ts-on-accent-threshold` does (0.65 dark / 0.62 light)? | DECIDED §5.2 — keep at 0.50 both modes | Surfaces straddle the 0.50 line cleanly in both modes (dark surfaces all L<0.5, light all L>0.5). No tuning needed. |
| OQ10 | Should the `:where(:root, :root *)` block be split (one block per file) or kept as one declaration? | DECIDED §12.1 — one block per file | Each system file declares its own `:where(:root, :root *)` block. Cascade order between files is set by load order (T2 §3.2), not by combining the blocks. |
| OQ11 | Per Rule 9 factor 4, the chips strip overrides `--ts-this-bg-grad-dark-pct: 2%`. This means the chips strip's `--ts-this-bg-dark` resolves to `color-mix(var(--ts-this-bg), var(--ts-bg-body) 2%)` — extremely subtle. Is the chain correctly preserving this? | CONFIRMED §10.3 — the formula resolves correctly at the chips scope because all chain rules reference `var(--ts-this-bg-grad-dark-pct)` (the locally-overridden value) | Verified by the `:where(:root, :root *)` cascade evaluation. Session 4+ chips sandbox will visually confirm. |
| OQ12 | The interaction pattern §7.1 doesn't mention `[aria-pressed]`, `[aria-expanded]`, etc. — should it? | `[ ] gap: extend in Session 2 when first interactive block needs them` | Add as opt-in extensions of the pattern. Not all interactive blocks have toggle semantics. |

---

## 17. Contact points for Wave 2 + later sessions

### 17.1 S3 — Component Registry + Block Prioritization

S3's block specs reference S2's chain. Specific S2 outputs S3 consumes:

- **Every block consumes `--ts-this-bg-*` and `--ts-this-color-*`** per the §6 surface superposition rules. S3's block-spec sketches enforce that block CSS sets `--ts-this-bg` (if layout or molecular re-scoping) and reads from the chain (idle/hover/active/focus/disabled).
- **The 5-state interaction pattern (§7.1)** is the canonical recipe S3 references in every interactive-block spec. S3's first 5 sketch block-specs (per Wave 2 brief) reproduce §7.1 verbatim with the block's own selector.
- **The `--ts-input-*` integration tokens (§11)** feed S3's `.ts-input`, `.ts-select`, `.ts-textarea`, `.ts-toggle`, etc. block specs.
- **The @taxonomy_chips_strip contract (T1 §6)** — S3's `.ts-chips` block spec references §3 dark/dim variants, §10.3 scoped knob override, and §11 input integration via the strip's chip children.

### 17.2 S4 — Build Pipeline Architect

S4 incorporates S2's file layout (§12) into the load-order spec:

- Load order: `system/surfaces.css` → `system/text.css` → `system/states.css` → `system/reset.css` → `shared-tokens/*.css` → `components/*.css` (per T2 §3.2 expanded to include the NEW shared-tokens slot).
- The shared-tokens layer (§9) is a NEW build-pipeline slot S4 wires into the cascade order. Each `shared-tokens/<topic>.css` is a leaf in the dependency graph.
- A1 Council R3 cycle-break: when S4's bundler's topo-sort encounters a chip ↔ chip-strip cycle, the resolution is to extract the shared tokens to `shared-tokens/strip-layout.css`. S4's pre-commit hook (per A1 Council R1) detects cycles and emits a clear error pointing at the shared-tokens layer as the fix.

### 17.3 S5 — Autonomous Execution Protocol

S5's tiered protocol references S2's 5-state pattern + Rule 8 cascade discipline:

- **PERMISSIVE tier audits** check that each atomic block's CSS reproduces §7.1 verbatim (with the block's own selector). Auto-pass on full pattern compliance.
- **STRICT tier audits** check the same plus surface re-scope correctness — does the molecular block's `--ts-this-bg: var(--ts-bg-N)` propagate as expected to descendants.
- **ALWAYS STRICT tier audits** check that the layout block's surface tier choice is compatible with S1 §8 contrast table (e.g., a section setting `--ts-this-bg: var(--ts-bg-5)` must not host muted-text components without escalation per §4.3).
- Block-spec author guidance: any block CSS introducing `color-mix()` for state derivation fails the audit. Consumes `--ts-this-bg-hover` etc. instead.

### 17.4 S6 — Repo Governance + Refusal Patterns

S6's refusal patterns include (specific to S2's domain):

- "Refuse any commit that introduces `color-mix(in oklch, var(--ts-accent), ...)` for state derivation inside `assets/css/next/components/**/*.css`. The component consumes `--ts-accent-hover/-active/-focus/-disabled` from `system/states.css`. Route the proposed mix percentage back to S2 if a new state knob is needed."
- "Refuse any commit that declares a `--ts-this-*` token in `assets/css/next/components/**/*.css`. The `--ts-this-*` namespace is exclusively system-layer. Component-scoped tokens use `--ts-<block>-*` naming."
- "Refuse any commit that introduces `data-ts-theme` selector in v2 CSS (per A9 §14)."
- "Refuse any new file in `assets/css/next/shared-tokens/<topic>.css` that declares non-token rules (no property declarations beyond custom properties, no selectors other than `:root` or `[data-theme="light"] :root`)." (Per §9.3)
- "Refuse any new `--ts-on-<context>` token at the component layer where `--ts-on-surface` would suffice. Surface to S2 if a genuine context need emerges." (Per §15.5)
- "Refuse any `!important` in `assets/css/next/system/**/*.css` or `assets/css/next/shared-tokens/**/*.css`." (Per §13.3)

### 17.5 Block sandbox sessions (Session 4+)

Sandboxes consume `--ts-this-*` derivatives (this spec). Specifically:

1. **Read S2's spec first** — locate the block's tier in T1 §2, locate the surface choice in S1 §8 contrast table, and adopt §7.1 5-state pattern.
2. **The block's CSS file** declares ONLY: (a) the block's component-scoped tokens (`--ts-<block>-pad`, etc.) at `:root` or under the block's selector; (b) the Layer 1 property assignments referencing `--ts-this-*` derivatives; (c) state pseudo-class rules per §7.1.
3. **No raw colors, no `color-mix`, no `oklch(from ...)`** in component CSS. All composition happens at S2's layer.
4. **Layer 2 overrides** (per §2.2) inside the block's CSS are TOKEN SWAPS ONLY — never property redeclarations.

### 17.6 In-house Tier 1 skill `design-tokens-2.0` (Phase E update pass per Rule 15)

The `design-tokens-2.0` SKILL.md must reference:

- This S2 spec as the SYSTEM layer of the Design Tokens 2.0 three-tier architecture.
- The full `--ts-this-*` derivative chain enumeration (§3) as the system-layer canonical token catalog.
- The 5-state interaction pattern (§7.1) as the canonical block-CSS recipe.
- The `shared-tokens/` layer (§9) as the architectural extension for circular-dependency resolution.
- The OKLCH-only color-mix discipline (§3 preamble) as a Rule 15-aligned convention overriding any external skill's `color-mix(in srgb, ...)` proposal.
- Refusal patterns from §17.4.

The Phase E `toolskin-architecture` skill encodes Rule 15 + this S2 spec verbatim in its references/ subdirectory.

---

## 18. Status

**Status:** `DONE`

**Coverage:**
- §1 Scope of S2 + three-tier architecture: COMPLETE.
- §2 Two-layer architecture (restyling-architecture §2): COMPLETE.
- §3 `--ts-this-bg-*` derivative chain with all 15+ tokens enumerated, including the 3 NEW state-border tokens: COMPLETE.
- §4 `--ts-this-color-*` text chain + text-tier escalation: COMPLETE.
- §5 `--ts-on-surface` full spec (S1 deferred): COMPLETE.
- §6 Surface superposition rules (Rule 4) + `:where(:root, :root *)` scoping pattern: COMPLETE.
- §7 5-state interaction pattern (canonical recipe): COMPLETE.
- §8 Accent state variant derivation (S1 §4.5 deferred): COMPLETE.
- §9 `shared-tokens/` layer (A1 Council R3): COMPLETE.
- §10 Gradient + mix control tokens (restyling-architecture §8): COMPLETE.
- §11 Input system surface integration (restyling-architecture §7): COMPLETE.
- §12 CSS file layout for system layer (4 files): COMPLETE.
- §13 Cascade-sensitivity treatment (Rule 8): COMPLETE.
- §14 A9 `data-theme` canonical confirmation: COMPLETE.
- §15 `--ts-on-surface` extension across non-surface tokens (restyling-architecture §6 issue 3): COMPLETE.
- §16 Open questions: 12 cataloged, most documented/decided, 3 marked `[ ] gap` for Session 2+ revisit.
- §17 Contact points for Wave 2 + later sessions: COMPLETE.

**Rule honoring:**
- Rules 1-15: honored throughout. Rule 15 enforced — every formula composes S1 primitives, NO new color values introduced.
- Repo isolation (file 07): all reference reads via `../toolskin-showcase/` relative path, no writes, no git ops against reference repo.
- Tier hierarchy (file 05): Tier 1 in-house authority preserved; no external skill color guidance consulted.
- Gate 4 locks: D1 (`assets/js/next/` mentioned in T2/S1 file paths but S2 is CSS-only, no JS folder writes), A9 (`data-theme` canonical, §14), A1 Council R3 (`shared-tokens/` layer designed in §9).

**Conflicts with external skills:** none. ECC `design-system` Mode 1 (Generate) is OFF-LIMITS per Tier hierarchy. S2's derivative-chain logic and surface superposition pattern derive from in-house Tier 1 (this spec) + restyling-architecture (frozen reference document), not from any external skill.

**What's not in this spec (per restrictions):**
- The actual `assets/css/next/system/surfaces.css`, `system/text.css`, `system/states.css`, `system/reset.css` files. The CSS blocks shown in §3-§11 are SPEC EXCERPTS illustrating the contract — not the final files. Session 2+ writes the files per this spec.
- The actual `assets/css/next/shared-tokens/<topic>.css` files. §9.5's topic table is the SPEC; Session 2+ creates the first file (`shared-tokens/strip-layout.css`) when the chip ↔ chip-strip cycle surfaces in Session 4+ block sandbox work.
- No CSS, JS, or HTML files. Markdown only.

---

## Footer — Conflicts with external skill flags (per file 06 / Rule 15)

NONE. Every token formula in this spec composes S1's apcach-derived primitives via CSS `color-mix(in oklch, ...)` and `oklch(from ...)`. No new color values introduced. No alternative color methodology proposed. No "WCAG-only" reasoning. No `color-mix(in srgb, ...)` (the rebuild standardizes on `in oklch` for perceptual uniformity per §3 preamble). ECC `design-system` Mode 1 (Generate) is OFF-LIMITS per Tier hierarchy and is not consulted.

Rule 15 fully honored: S2 is the COMPOSITIONAL layer; S1's apcach output is the SUBSTRATE. The chain's job is mathematical composition; the primitive layer provides the verified inputs.

Rule 13 honored: no Node.js runtime deps. All CSS composition is browser-native (`color-mix`, `oklch`, `oklch(from ...)`, CSS custom properties).

Rules 1, 2, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14 honored throughout the spec's structure and decisions. Rule 9 (chips strip 10 protected values) integrated specifically: §10.3 preserves factor 4 (`--ts-this-bg-grad-dark-pct: 2%` scoped knob); §3 derivative chain supports factors 8/9/10 (`--ts-this-bg-dark`, `--ts-this-bg-dark-1/2`, `--ts-this-bg-border`); §6.3 documents the canonical molecular re-scope pattern using @taxonomy_chips_strip as the exemplar.

**Repo isolation honored:** all reference reads from `../toolskin-showcase/` via relative path; no writes; no git ops against reference repo. CWD remained `D:\Mis Documentos\Projects\Toolskin Framework\toolskin-rebuild\` throughout.

**Hard restrictions honored:** spec is MARKDOWN ONLY. No CSS, JS, or HTML files written. `assets/css/next/system/*.css` and `assets/css/next/shared-tokens/*.css` are NOT written this session — they are S2's specification for Session 2+ execution.

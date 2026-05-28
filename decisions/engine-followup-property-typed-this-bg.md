# Engine Follow-up — `@property`-typed `--ts-this-bg` for auto-nesting alternation

**Status:** **DEFERRED-AND-TRACKED** at HEAD `<engineer-lead fills>`
**Date:** 2026-05-28
**Origin:** Phase 2 Wave 1 — `ts-section` migration (chip/badge → input → **section**)
**Owner ruling:** ratified as a real ticket, not a verbal later. One of the original alternating-surface requirements.
**Scope:** engine layer — `assets/css/next/system/toolskin-this-bg-v2.css` + `assets/css/next/components/ts-section.css` follow-up
**Effort estimate:** ~4h (engine-layer scrutiny: worker + spec review + code-quality review)

---

## Owner requirement (verbatim, from `.claude/rules/05-owner-notes.md` → ALTERNATING SURFACE SYSTEM)

> Avoids explicit background assignment when already defined; relies on contrast-based alternation. STATUS: draft, visual validation only, deployed in legacy showcase. ISSUES: static surface values instead of computed contrast; nested cases (sections/cards/inputs) inconsistent; non-color rules mixed into color logic; dark background system broken (root clamp removes lower bound → dark == base); presets not propagating.
>
> ACTION: rebuild with OKLCH contrast calc (no static surfaces); isolate color from layout rules; define reusable automated patterns for section alternation and **nested containers**; theme-agnostic (no light/dark branching); fix surface scaling/clamping; validate preset propagation.

Mirrored as the OPEN decision in `decisions/color-system.md`:

> ## OPEN — surface superposition / alternating sections
> The .ts-section--alt experimental system must become contrast-driven and theme-agnostic (no light/dark branching), with **automatic nesting handling** for sections/cards/inputs. Currently static. → council to design.

Three owner-ruled properties for the alternation system:

1. **Contrast-driven** — mix toward `--ts-tone-contrast`, not toward a static surface.
2. **Theme-agnostic** — no `[data-theme]` branching, primitive cascade only.
3. **Automatic nesting** — alt-inside-alt steps further from the parent surface, NOT to the same value as a single alt.

---

## What landed in Wave 1 (partial — 2 of 3 properties)

`assets/css/next/components/ts-section.css` (commit pending Wave 1 close) delivers:

| Property | Status | Mechanism |
|---|---|---|
| Contrast-driven | **PASS** | `color-mix(in oklch, var(--ts-bg-body), var(--ts-tone-contrast) <pct>)` — recess toward contrast tone, not toward a static surface |
| Theme-agnostic | **PASS** | No `[data-theme]` selectors. Cascade resolves `--ts-bg-body` through the primitive layer (`:root` + `.ts-preset-*`) only |
| **Automatic nesting** | **FAIL** | `.ts-section--alt` mixes off `--ts-bg-body` (frozen anchor), NOT off the LIVE parent `--ts-this-bg`. Result: `.ts-section--alt` inside `.ts-section--alt` resolves to the SAME color as a single alt. No step. |

The third property was deferred because of the engine-layer blocker below. Engineer-lead and owner explicitly accepted the 2-of-3 partial delivery for Wave 1.

---

## The engineering blocker — CSS variable cycle in the engine

`assets/css/next/system/toolskin-this-bg-v2.css` declares every surface derivative on `:where(:root, :root *)` so derivatives recompute per-element from whatever `--ts-this-bg` resolves to at that level:

```css
:where(:root, :root *) {
  --ts-this-bg-bright: color-mix(in oklab, var(--ts-this-bg), <bright tone> <pct>);
  --ts-this-bg-dim:    color-mix(in oklab, var(--ts-this-bg), <dim tone>    <pct>);
  /* …all derivatives… */
}
```

The natural pattern for surface alternation is the R9 two-line idiom:

```css
.ts-section--alt {
  --ts-this-bg: var(--ts-this-bg-bright);   /* re-anchor */
  /* …consume derivatives downstream… */
}
```

This **silently fails**. The cycle:

1. The child rule sets `--ts-this-bg: var(--ts-this-bg-bright)`.
2. The engine's universal rule on the SAME element redeclares `--ts-this-bg-bright` as `color-mix(in oklab, var(--ts-this-bg), …)`.
3. `--ts-this-bg-bright` on this element therefore depends on this element's own `--ts-this-bg`, which is being assigned from `--ts-this-bg-bright`. Cycle.
4. The browser detects the cycle, invalidates the assignment, and `--ts-this-bg` falls back to its un-typed inherited value — the parent's surface. The variant silently produces no visual step.

Confirmed by the `ts-section` worker in Chrome during Wave 1 implementation. The Wave 1 workaround was to mix off `--ts-bg-body` (a primitive that the engine does NOT re-declare per-element), trading auto-nesting for a working single-level alt.

---

## The canonical fix — `@property`-typed `--ts-this-bg`

Register `--ts-this-bg` as a typed inheriting custom property in `system/toolskin-this-bg-v2.css`:

```css
@property --ts-this-bg {
  syntax: '<color>';
  inherits: true;
  initial-value: oklch(15.88% 0.00454 264.44);  /* dark body fallback */
}
```

Why this breaks the cycle:

- An un-typed `--ts-this-bg` inherits as a **re-evaluatable token expression** — at each level, the engine re-resolves `--ts-this-bg-bright` from this element's `--ts-this-bg`, creating the dependency loop.
- A `@property`-typed `--ts-this-bg` with `inherits: true` is captured at the **parent level as a resolved color value** and inherits into the child as that value. The child's `--ts-this-bg-bright` is the engine's mix of the **parent's resolved `--ts-this-bg`** with the bright tone — no self-reference on the child.

With the registration in place, the canonical idiom works:

```css
.ts-section--alt {
  --ts-this-bg: var(--ts-this-bg-bright);   /* reads PARENT's bright step */
}
```

- Top-level `.ts-section--alt` reads `--ts-this-bg-bright` from `--ts-bg-body` (the root surface) → first contrast step.
- Nested `.ts-section--alt` inside `.ts-section--alt` reads `--ts-this-bg-bright` from the parent's already-stepped surface → second contrast step.
- Each nested level steps further automatically. The derivative cascade re-resolves at every level off the parent's resolved color.

**Browser support:** `@property` is Baseline 2024 — universal across Chrome, Edge, Firefox, Safari in 2026. No fallback strategy required for the rebuild's browser matrix.

---

## Scope estimate (~4h, engine-layer review required)

| Task | Files | Effort |
|---|---|---|
| Register `@property --ts-this-bg` | `assets/css/next/system/toolskin-this-bg-v2.css` | ~0.5h |
| Re-test the cycle is broken (Chrome computed-style probe + token-leak grep) | DevTools verification | ~0.5h |
| Rework `.ts-section--alt` / `--alt-2` / `--dark` / `--accent-band` to use `var(--ts-this-bg-bright)` etc. instead of mixing off `--ts-bg-body` | `assets/css/next/components/ts-section.css` | ~1.5h |
| Verify alt-nested-in-alt renders distinctly (`sandbox/02-components/ts-section.html`) | sandbox harness | ~0.5h |
| Spec review + code-quality review per the team flow | review | ~1h |

Engine-layer scrutiny applies — `system/toolskin-this-bg-v2.css` is consumed by every downstream component. The worker → spec-review → code-quality-review chain is mandatory.

---

## Why it's worth doing

- **Satisfies the original owner requirement** — closes the third of three properties for the alternating-surface system, the OPEN line in `decisions/color-system.md`.
- **Unlocks compositional surface alternation across the whole component family.** Every component that inherits `--ts-this-bg` (chip, badge, input, card, toolbar, table, accordion, every overlay) gets the correct parent anchor automatically without per-component override rules.
- **Retroactively cleans up `ts-section.css`'s `--ts-bg-body` workaround** — the explanatory comment block in lines 11–80 of the current file documents the cycle and the workaround; landing the engine fix lets that workaround disappear and the canonical R9 two-line idiom apply.
- **Restores R9 Pattern 4 as universal** — the rules currently mandate "re-anchor first, consume second", but the engine cycle quietly broke the re-anchor step for any nested case. The fix makes R9 actually hold.

---

## When to land

**Between Wave 1 close and Phase 4** (refactored showcase, per `decisions/forward-architecture.md` critical path).

The auto-nesting behavior is most visible in real layout compositions (cards inside alt sections inside dark bands, etc.), which arrive in Phase 4. Landing the engine fix before Phase 4 keeps Phase 4 component compositions honest — otherwise the showcase will pick up the same workaround pattern (mix off `--ts-bg-body`) and bake it deeper into the system.

Optimal slot: between Phase 2b (component migration complete) and Phase 4 (showcase rebuild). Phase 3 (JS runtime cleanup) does not touch surface tokens and is parallel-safe.

---

## Cross-references

- `decisions/color-system.md` — OPEN line "surface superposition / alternating sections" (this follow-up closes it)
- `decisions/forward-architecture.md` — Q1 row #3 ts-section: "Resolves the OPEN `.ts-section--alt` decision in `decisions/color-system.md` (contrast-driven, theme-agnostic, automatic nesting)"
- `.claude/rules/05-owner-notes.md` — ALTERNATING SURFACE SYSTEM (verbatim owner requirement)
- `.claude/rules/01-rulings.md` — R9 (two-line re-anchor idiom), R11 (surface derivatives pre-extension)
- `assets/css/next/system/toolskin-this-bg-v2.css` — engine file receiving the `@property` registration
- `assets/css/next/components/ts-section.css` — Wave 1 partial delivery; documents the cycle and the `--ts-bg-body` workaround in its header comment (lines 11–80)
- Wave 1 commits (pending):
  - `feat(components): migrate ts-section to next/ on v2 engine` (Phase 2 Wave 1 close)
  - Predecessors in chain: `f6439a3` (chip+badge), `ab05939` (status palette lift), `8841bc6` (I-2 harness deferral)
- `expert-designer/screenshots/expert--designer-showcase.jpg` — visual ground truth where alt-nested compositions appear (Phase 4 acceptance reference)

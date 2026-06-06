# Council voice — Design Critic
**Author:** Design Critic
**Date:** 2026-05-25
**HEAD:** f095d75

## Three to five patterns that make Toolskin unmistakable

A Toolskin user who has lived inside the showcase recognizes the system by
these moves, not by a logo. Any integration that loses one of them produces
a generic dashboard that happens to use OKLCH.

1. **Bichromatic atmosphere (accent + alt).** Hero radial gradients composed
   from `--ts-accent-dim` plus a companion `--ts-alt-dim`. The page never
   feels monochromatic. VQ-7. Lose it → "another orange SaaS landing."

2. **Mono-as-machine-voice on labels and numerics.** JetBrains Mono on
   `/ 01`, `/ 02`, swatch labels, px measurements, metric callouts. The
   editorial-wayfinding signature. VQ-2 + VQ-8. Lose it → the page reads
   as a Notion doc.

3. **Surface superposition under compositional pressure.** `--ts-this-bg`
   re-anchors on a child (R9, Pattern 4 two-line idiom) and the entire
   `--ts-this-bg-*` derivative chain follows. A card on a section on a
   stripe — three nested surfaces all visibly distinct because the chain
   re-resolves at every level. Lose it → "everything is bg-1."

4. **One accent-painted tile per page + asymmetric grid.** Bento with at
   least one full-`--ts-accent` surface using `--ts-on-accent` auto-ink,
   plus an `Nfr Mfr` (N≠M) somewhere. VQ-4 + VQ-6. Lose it → cards-in-a-row.

5. **Three knobs → whole-UI repaint (the accent lab).** `--ts-accent-h/s/l`
   slider → every preset surface, border, focus ring, gradient stop moves
   in lockstep. VQ-5. This is the proof-of-concept demo. Lose it → Toolskin
   becomes just-another-token-set without its identity claim.

These five are the recognition floor. Anything else can be refactored.
Touching any of these requires the manifesto-then-audit gate.

---

## Q1 — Dark-surface fix

**Recognition verdict:** The current `--ts-tone-floor` recession is the
root cause of the dark-preset collapse — on a dark preset, `--ts-this-bg`
is already near the floor, so mixing toward it produces a non-step
(`gradDarkPct=100%` degeneracy noted in `color-system.md`). A Toolskin
user toggling through the 10 presets sees the dark five collapse into
near-identical near-blacks: identity-destroying. The backup file's fix
(recess toward `oklch(0 0 0)` pure black) is correct, Architect-confirmed,
and preserves visible step on every preset — including dark — without
ever falling below the floor.

**Concrete diff to `assets/css/next/system/surfaces.css`:**

```diff
   /* Subtractive variants — recess toward the (hue-locked) floor pole (spec §3.2) */
-  --ts-this-bg-dark:   color-mix(in oklch, var(--ts-this-bg), var(--ts-tone-floor) var(--ts-this-bg-grad-dark-pct));
-  --ts-this-bg-dark-1: color-mix(in oklch, var(--ts-this-bg), var(--ts-tone-floor) calc(var(--ts-this-bg-grad-dark-pct) * 0.5));
-  --ts-this-bg-dark-2: color-mix(in oklch, var(--ts-this-bg), var(--ts-tone-floor) calc(var(--ts-this-bg-grad-dark-pct) * 0.85));
+  /* Subtractive variants — recess toward PURE BLACK (oklch 0 0 0), NOT the
+   * floor pole. On dark presets the floor IS the surface, so mixing toward
+   * it produces a non-step (RULING 7 / dark-surface degeneracy). Pure black
+   * is hue-neutral, so the surface keeps its hue; lightness drops by a
+   * visible amount on every preset. Per-theme ΔL targets (Architect):
+   * dark ΔL ≥ 3.0, light ΔL ≥ 4.0. Knob default 14% (was 10%) satisfies
+   * both on the 10 presets per the measurement report. */
+  --ts-this-bg-dark:   color-mix(in oklch, var(--ts-this-bg), oklch(0 0 0) var(--ts-this-bg-grad-dark-pct));
+  --ts-this-bg-dark-1: color-mix(in oklch, var(--ts-this-bg), oklch(0 0 0) calc(var(--ts-this-bg-grad-dark-pct) * 0.5));
+  --ts-this-bg-dark-2: color-mix(in oklch, var(--ts-this-bg), oklch(0 0 0) calc(var(--ts-this-bg-grad-dark-pct) * 0.85));
```

And bump the default knob to match the backup + measurement report:

```diff
-  --ts-this-bg-grad-dark-pct:   10%;     /* mix amount for the dark gradient stop */
+  --ts-this-bg-grad-dark-pct:   14%;     /* mix amount for the dark gradient stop — 14% gives ΔL ≥ 3 on all dark presets (RULING 7) */
```

**Mirror move on `--ts-this-bg-active`** (currently mixes toward
`--ts-tone-floor` 15% → same degeneracy on dark presets):

```diff
-  --ts-this-bg-active:   color-mix(in oklch, var(--ts-this-bg), var(--ts-tone-floor)    15%);
+  --ts-this-bg-active:   color-mix(in oklch, var(--ts-this-bg), oklch(0 0 0)            15%);
```

**Recognition failure mode + fix:** without this, the preset switcher
demo (VQ-5) is a silent identity failure on the dark half of the dial.
The owner sells "10 distinct presets"; the user sees five distinct light
presets and "five blacks." Fix: ship the diff above before any block
sandbox work uses dark presets for parity screenshots.

**Bright side is fine as-is** — `--ts-tone-contrast` (text-primary hue-
stripped) does NOT degenerate on light presets because text-primary stays
near the contrast pole regardless of theme. No change needed there.

---

## Q2 — Owner notes integration order

**Recognition ordering rationale:** Integrations that are USER-VISIBLE
on first glance (Q2's recognition lens) come first. Architectural moves
that affect cleanliness but not pixels come second.

**Session 3.x (recognition-critical):**

1. **alternating-surfaces / contrast-driven (R5 + VQ-6 + Pattern 5).**
   Recognition severity **HIGH**. The `.ts-section:nth-child(odd/even)`
   block in current `surfaces.css` (lines 232–256) hardwires
   `--ts-bg-0 / --ts-bg-body / --ts-bg-1`. On dark presets where
   bg-body ≈ bg-0 ≈ bg-1 within 2–5 L-points, the alternation IS
   INVISIBLE — owner explicitly logged "dark background system broken;
   presets not propagating." User sees a single-surface page; loses
   pattern #3 (surface superposition) AND pattern #4 (composition
   variation). **Action:** rewrite the nth-child selectors to swap
   `--ts-this-bg` against `--ts-this-bg-bright` / `--ts-this-bg-dark`
   (now safe after Q1 fix), so alternation is computed and survives
   every preset. Keep `.ts-section--alt / --alt-2 / --dark` aliases
   for backward compatibility — owner directive "don't break existing
   classes." Concrete edit: replace lines 241–256 with derivative-based
   anchoring rather than primitive references.

2. **.bg-grid tokenization (owner GRID BACKGROUND SYSTEM).** Recognition
   severity **MEDIUM-HIGH**. Owner explicitly carved out grid as a
   `background-image` utility that COEXISTS with surface color, with
   four knobs (size, spacing, line-color, opacity). The current file
   already declares `--ts-bg-grid-*` tokens at L109–124 but **no
   `.bg-grid` class consumes them.** A Toolskin user expects `.bg-grid`
   to "just work" on any surface (Rule 5 drop-in identity preservation
   across hosts — the WordPress and React adapters cannot ship a custom
   bg-grid each). **Action:** add the `.bg-grid` utility class at the
   end of `surfaces.css`:

   ```css
   .bg-grid {
     background-image: var(--ts-bg-grid-pattern);
     background-position: 0 0;
   }
   .bg-grid--accent { --ts-bg-grid-col1: var(--ts-accent); }
   .bg-grid--scale-2 { --ts-grid-scale: 2; }
   ```

   Also fix the `color-mix(in srgb, ...)` on L115 → `in oklch` (R7 +
   audit checklist §2 hard fail).

**Session 4+ (architectural, recognition-neutral):**

3. **color-engine delegation.** Recognition severity **LOW (invisible).**
   Moving OKLCH logic, accent derivations, and state variants out of the
   general token layer into a dedicated `system/accent.css` (already in
   B2 backlog) does not change a single rendered pixel if done correctly.
   It IS critical for long-term maintenance and the WordPress / React /
   Vue adapters (they import `accent.css` once and inherit the engine),
   but a Toolskin user cannot tell from looking at the page whether the
   delegation happened. Park to Session 4 alongside B2.

4. **borders-from-text (currentColor ban).** Recognition severity **LOW
   ON PAGES, MEDIUM ON COMPONENTS.** The current `surfaces.css`
   already implements the correct pattern at L173–179 (border tokens
   computed from `--ts-tone-contrast` mixed with surface, NOT
   `currentColor`). So the architecture is already there. The remaining
   work is auditing **components** for stray `border: 1px solid currentColor`
   and replacing with `--ts-this-bg-border`. That work belongs in
   Session 4 block-by-block (B1: ts-input, B2: ts-btn, etc.) as each
   block migrates. Not blocking system layer completion.

**Recognition severity ranking summary:**
- alternating-surfaces — HIGH (kills preset propagation, visible everywhere)
- .bg-grid utility — MEDIUM-HIGH (a missing canonical pattern, R5 drop-in)
- color-engine delegation — LOW (architecture, invisible if done right)
- borders-from-text — LOW page-level, MEDIUM component-level (per-block)

---

## Q3 — Font scaling

**Verdict: IMPROVE, do not replace.** The numeric ladder + role aliases
(`--ts-fs-h1 .. --ts-fs-caption`) IS Toolskin's identity at the component
authoring layer — `audit-design.mjs`'s LADDER_PX array, every starter,
every reference doc and the showcase all speak that vocabulary. Replacing
it with `xs/sm/lg/xl` mid-rebuild breaks recognition for any user who
already learned the system and forces a migration of every audit script,
starter, and reference. The owner's actual pain (verbatim from
`font-scaling.md`) is **per-scope scalability + smooth fluidity**, not
the names. Both can be added as a *layer on top of* the existing ladder
without renaming a single role.

**Minimum adoption scope:**

1. Display sizes only — `--ts-fs-h1`, `--ts-fs-h2`, `--ts-fs-hero`,
   `--ts-fs-display` (the >= step 5 tokens, which is where laddered jumps
   visibly hurt on responsive resize). Body/caption/meta stay laddered —
   they should NOT scale with viewport (legibility floor + APCA stability).
2. Add ONE new knob: `--ts-fs-scale` (default `1`). Any container scope
   can override it. Owner's per-scope-scalability requirement.
3. Wrap the >= step 5 tokens in `clamp(min, fluid-via-cqi-or-vw, max)
   * var(--ts-fs-scale, 1)`.
4. Do NOT introduce `xs/sm/lg/xl` aliases. The role names ARE the
   semantic layer — `h1 / h2 / lead / body / caption` already reads
   semantically; introducing a second parallel naming creates the exact
   confusion the owner is trying to avoid.

**Recognition impact:** **Transparent.** Existing components that
consume `--ts-fs-h1` keep working; the value behind the token is now
fluid + scalable. No template rewrites, no audit script changes, no
re-education. A Toolskin user opening the new system sees the same
tokens they knew, just smoother on resize. The new `--ts-fs-scale` knob
is opt-in, additive — invisible if not used.

**Concrete proposal — minimal edit to `system/text.css` (B2 work):**

```css
:root {
  --ts-fs-scale: 1;                 /* per-scope multiplier (owner directive) */
  --ts-fs-cqi-unit: 1cqi;            /* swap to 1vw if no container queries */

  /* Body half — keep laddered, no fluidity (legibility) */
  --ts-fs-caption:  calc(0.875rem * var(--ts-fs-scale));
  --ts-fs-body:     calc(1rem     * var(--ts-fs-scale));
  --ts-fs-lead:     calc(1.2rem   * var(--ts-fs-scale));

  /* Display half — fluid clamp WITHIN the ladder bounds, * scale knob */
  --ts-fs-h3:       calc(clamp(1.5rem,  0.9rem + 1.2 * var(--ts-fs-cqi-unit), 1.9rem) * var(--ts-fs-scale));
  --ts-fs-h2:       calc(clamp(2rem,    1.1rem + 2.0 * var(--ts-fs-cqi-unit), 2.8rem) * var(--ts-fs-scale));
  --ts-fs-h1:       calc(clamp(2.6rem,  1.2rem + 3.5 * var(--ts-fs-cqi-unit), 4.2rem) * var(--ts-fs-scale));
  --ts-fs-hero:     calc(clamp(3.2rem,  1.4rem + 6.0 * var(--ts-fs-cqi-unit), 7.2rem) * var(--ts-fs-scale));
}

/* Per-scope rescale — owner's "scale value for every scope" requirement */
.ts-fs-scale-sm   { --ts-fs-scale: 0.875; }
.ts-fs-scale-lg   { --ts-fs-scale: 1.125; }
.ts-fs-scale-xl   { --ts-fs-scale: 1.25;  }
.ts-fs-scale-2xl  { --ts-fs-scale: 1.5;   }
```

`audit-design.mjs` LADDER_PX requires a tolerance widening for the
display half (compute the clamp's middle point ±10%) — that's a one-line
change. Body half stays exact.

The `font-scaling-math-experiment.html` reference can inform the clamp
coefficients but should not dictate the naming scheme. The naming
scheme is settled by the existing role aliases and the cost of breaking
them is higher than the cost of keeping them.

---

## Q4 — B1/B2/B3 confirmation

**Confirm order** — B3 → B1 → B2, then Session 4. Reasoning:

- **B3 first (5 min):** JetBrains Mono load. Recognition pattern #2
  (mono-as-machine-voice) is silently broken until this lands. Cheapest
  win, highest recognition payoff. **Do this in the next 60 seconds
  before anything else.**

- **B1 second (~1h):** Naming collision resolution. Without ONE
  vocabulary, every subsequent system file is built on shifting sand
  and `audit-design.mjs` cannot grep cleanly. Sandbox names win
  (already ruled). B1 unblocks B2.

- **B2 third (~3h):** `system/text.css` + `system/accent.css`. Build
  on the resolved vocabulary. Bake in the Q3 fluid+scale knob in
  `text.css`. Bake the Q1 dark-surface fix into the surface chain
  (separate file — already in `surfaces.css`).

**Then Session 4 block 1 (ts-input).**

**New Rule-5 / drop-in blocker — YES, one I am surfacing:**

**B4 — Cross-host token namespace collision audit (Rule 5).** The
`--ts-grid-scale` token declared at `surfaces.css` L109 is **missing
its prefix discipline** — it is `--ts-grid-scale`, not `--ts-bg-grid-scale`.
That single-word generic token could collide with a host's existing
`--ts-grid-*` token (a Vue or React design-system import that happens
to use `grid-scale` for layout grid, not background grid). Rule 5
drop-in identity preservation requires every Toolskin token to be
unambiguously namespaced so it cannot be silently shadowed by host CSS.

**Concrete reason:** WordPress Enfold and several React UI kits expose
`--grid-*` and `--ts-grid-*` patterns. If a host's `--ts-grid-scale: 0.5`
exists, our `--ts-bg-grid-size: calc(2.5rem * var(--ts-grid-scale, 1))`
silently shrinks every grid background to half size across the entire
adapter. The user sees "Toolskin grid is broken in WordPress" with no
visible cause.

**Fix (1 line):**
```diff
-    --ts-grid-scale: 1;
+    --ts-bg-grid-scale: 1;
   --ts-bg-grid-base: 2.5rem;
-  --ts-bg-grid-size: calc(var(--ts-bg-grid-base) * var(--ts-grid-scale, 1));
+  --ts-bg-grid-size: calc(var(--ts-bg-grid-base) * var(--ts-bg-grid-scale, 1));
```

Add this to B1 reconciliation — it is a naming-discipline fix, same
class of work, ~1 minute.

**Block order (final):** B3 → B1+B4 → B2 → Session 4 block 1.

---

## Failure modes ranked by visual severity (top 3)

1. **Dark presets collapse to indistinguishable near-blacks** (Q1).
   The single most identity-destroying bug on the table. Five out of
   ten presets visually invisible in the switcher demo (VQ-5), killing
   the "three knobs → whole UI" promise on half the dial. **Fix:**
   ship the Q1 diff (recess `--ts-this-bg-dark*` and `--ts-this-bg-active`
   toward `oklch(0 0 0)`, default knob to 14%) into `system/surfaces.css`
   today, before any sandbox screenshot is taken for parity checks.

2. **Section alternation invisible on dark presets** (Q2 item 1).
   The current `.ts-section:nth-child(odd/even)` block hardwires
   primitive surfaces that are within 2–5 L-points on dark presets —
   the page reads as a single flat surface, killing pattern #3 (surface
   superposition under compositional pressure) AND VQ-3 (≥3 distinct
   background values). **Fix:** rewrite the nth-child rules to swap
   `--ts-this-bg` against `--ts-this-bg-bright` / `--ts-this-bg-dark`
   — derivative-based, theme-agnostic, survives every preset.

3. **JetBrains Mono not loaded → mono-as-machine-voice falls back to
   Consolas** (B3). VQ-2 explicit failure: `/ 01` section chrome,
   numeric labels, px measurements all render in the body sans
   instead of the editorial mono signature. The page looks like a
   blog post, not a tool. **Fix:** B3 — one-line `<link>` add for
   JetBrains Mono in the sandbox `<head>`, mirror the Space Grotesk
   load at sandbox L16. 5 minutes. Do first.

---

COUNCIL VOICE COMPLETE — Design Critic — handoffs/_design-integration-council-critic.md

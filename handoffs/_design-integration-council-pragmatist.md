# Council voice — Pragmatist
**Author:** Pragmatist
**Date:** 2026-05-25
**HEAD:** f095d75

## The ONE thing that unblocks the most (1 sentence)
**B1 — naming reconciliation** (rewrite primitives to the sandbox vocabulary so a single source-of-truth exists): ~1h of work, but without it B2/B3/Block 1 all rebuild on a foundation that will be re-keyed twice — every hour of B1 saves 3–5h downstream.

## Q1 — Dark-surface fix

**Concrete diff to `assets/css/next/system/surfaces.css` (lines 131–133, 142):**

```css
- --ts-this-bg-dark:   color-mix(in oklch, var(--ts-this-bg), var(--ts-tone-floor) var(--ts-this-bg-grad-dark-pct));
- --ts-this-bg-dark-1: color-mix(in oklch, var(--ts-this-bg), var(--ts-tone-floor) calc(var(--ts-this-bg-grad-dark-pct) * 0.5));
- --ts-this-bg-dark-2: color-mix(in oklch, var(--ts-this-bg), var(--ts-tone-floor) calc(var(--ts-this-bg-grad-dark-pct) * 0.85));
+ --ts-this-bg-dark:   color-mix(in oklch, var(--ts-this-bg), oklch(0 0 0) var(--ts-this-bg-grad-dark-pct));
+ --ts-this-bg-dark-1: color-mix(in oklch, var(--ts-this-bg), oklch(0 0 0) calc(var(--ts-this-bg-grad-dark-pct) * 0.5));
+ --ts-this-bg-dark-2: color-mix(in oklch, var(--ts-this-bg), oklch(0 0 0) calc(var(--ts-this-bg-grad-dark-pct) * 0.85));
```

Symmetric companion (line 142, `--ts-tone-contrast` → `oklch(1 0 0)`) is OPTIONAL — the bright side is not degenerate today; defer unless audit shows visible drift.

Also bump default mix percentage to match the backup's empirically-tuned `14%`:

```css
- --ts-this-bg-grad-dark-pct:   10%;
+ --ts-this-bg-grad-dark-pct:   14%;
```

**Effort:** 15 minutes (4 line edits + visual recheck on dark-1, dark-2, dark-3 presets in `sandbox/00-design-reference`).

**Smaller alternative (if any):** Yes — keep `--ts-tone-floor` as the recession pole but per-preset override `--ts-tone-floor: oklch(0 0 0)` only inside `.ts-preset-{dark-*}` rules. Saves the architectural conversation but trades it for 10 preset-scoped overrides + a measurement audit per preset. Net: more work, more surface area, identical visual result. **Reject — the 15-minute formula change IS the minimum.**

## Q2 — Owner notes integration order — PUNCH LIST

The four "integrations" derived from `.claude/rules/05-owner-notes.md`: (a) currentColor border ban + text-derived border standard, (b) surface/color-engine role separation, (c) padding scaling engine review, (d) alternating-surface system rebuild. Plus the two "FIXED" items (purple artifact, grid-bg utility) which are status-only and need verification, not implementation.

| # | Integration | Effort | Unblocks | Defer to Session 4+? |
|---|---|---|---|---|
| 1 | **Verify purple-artifact + grid-bg already fixed** (grep `accent.*background-color`, confirm `.bg-grid` exists & uses `background-image`) | 20min | Closes 2 owner notes without code; reveals if hidden work remains | No — pure verification, blocks nothing downstream but cheap |
| 2 | **Surface/color-engine role separation** (= Q1 dark-fix + confirm system/surfaces.css does NOT redefine accent primitives; accent lives in primitives/colors.css + future system/accent.css per B2) | 30min (incl. Q1) | Block 1 input focus ring + every component using `--ts-this-bg-*` | **No — directly blocks Block 1** |
| 3 | **Border standard (text-derived, NOT currentColor)** — already implemented in `backups/oklch-surface-system-PREVIOUS.css` L83–88; port that block into `system/surfaces.css` and grep-ban `currentColor` in audit | 45min | ts-input border, ts-btn border, ts-card border — every component | **No — Block 1 (ts-input) needs `--ts-this-bg-border` + `-hover`/`-focus`/`-active`/`-disabled`** |
| 4 | Padding scaling engine review | 0min for Session 4 entry | Nothing in Block 1 (input uses existing `--ts-sp-*` ladder) | **YES — defer to Session 4.5+ (after Block 3)**, schedule council review only |
| 5 | Alternating-surface system rebuild (`.ts-section--alt` contrast-driven) | 0min for Session 4 entry | Nothing in Block 1–3 (component-level, not section-level) | **YES — defer to Session 5** (block work targets components, alt-section is a layout concern) |

**Critical-path subtotal from Q2:** items 1+2+3 = **~95 minutes**.

## Q3 — Font scaling

**Minimum-viable proposal (responsive titles only, Owner's primary use case):**

Add a fluid-clamp layer on top of the existing role aliases — keep numeric ladder + role aliases untouched, just add fluid variants for the display tier. Edit `system/text.css` (the file created in B2) by appending:

```css
/* Fluid display tier — width-aware, scales smoothly between two anchors.
   Aliases only; ladder + h1..h6 numeric tokens untouched. */
:root {
  /* Per-scope scale knob — multiply any descendant title without re-keying. */
  --ts-fs-scale: 1;

  /* Fluid anchors: --ts-fs-h{n} stays the numeric ladder value;
     --ts-fs-h{n}-fluid is the responsive variant components opt into. */
  --ts-fs-h1-fluid: clamp(
    calc(var(--ts-fs-h2) * var(--ts-fs-scale)),
    calc(var(--ts-fs-h1) * 0.6 * var(--ts-fs-scale) + 2.5vw),
    calc(var(--ts-fs-h1) * var(--ts-fs-scale))
  );
  --ts-fs-h2-fluid: clamp(
    calc(var(--ts-fs-h3) * var(--ts-fs-scale)),
    calc(var(--ts-fs-h2) * 0.7 * var(--ts-fs-scale) + 1.8vw),
    calc(var(--ts-fs-h2) * var(--ts-fs-scale))
  );
  --ts-fs-display-fluid: clamp(
    calc(var(--ts-fs-h1) * var(--ts-fs-scale)),
    calc(var(--ts-fs-h1) * 0.8 * var(--ts-fs-scale) + 4vw),
    calc(var(--ts-fs-h1) * 1.6 * var(--ts-fs-scale))
  );
}
```

Audit shim — `audit-design.mjs` LADDER_PX check stays valid because numeric `--ts-fs-h*` are unchanged; new `-fluid` tokens get added to the allow-list (one-line array push).

**Effort:** 30 minutes (incl. one-line audit allow-list patch + smoke test in showcase hero).

**Full-scope alternative (deferred to Session 4+):** Replace the entire `--ts-fs--2 … --ts-fs-9` numeric ladder with semantic names (`xs/sm/md/lg/xl/2xl/3xl/display`), add the width-aware fluid formula to ALL of them, retrofit every role alias + every audit array + every component reference. Estimate **6–9h** + cascade risk across sandbox, skill template, and three audit scripts. **Defer until after Block 3** — there is no Session 4 component that needs the semantic-rename layer to ship.

## Q4 — B1/B2/B3 punch list

| # | Blocker | Effort | Two-things-bundled? | Order verdict |
|---|---|---|---|---|
| B1 | naming reconciliation (rewrite primitives to sandbox vocabulary) | 1h | NO — atomic rename pass | **1st — non-negotiable** |
| B2 | text.css + accent.css | 3h | **YES — split.** B2a `text.css` (1h, blocks Block 1) + B2b `accent.css` (2h, blocks Block 2 focus + ts-btn). Build B2a first, parallelize B2b. | 2nd (B2a) and 3rd-parallel (B2b) |
| B3 | JetBrains Mono load | 5min | NO | **Do FIRST alongside B1** — 5min cost, removes silent Consolas fallback corrupting every visual review from now on |
| **NEW — Q1 dark-surface fix** | recess toward oklch(0 0 0) | 15min | NO | **Do during B1 commit** — same file family, same audit pass |
| **NEW — border port** | port backup L83–88 border block into `system/surfaces.css` | 45min | NO | **Do at end of B2a** (needs `--ts-text-primary` resolved by B2a) |

**Order verdict (revised):**
1. B3 (5min) + B1 (1h) — bundled commit
2. Q1 dark-surface fix (15min) — same commit family as B1
3. B2a text.css (1h)
4. Border port (45min) — depends on B2a's `--ts-text-primary`
5. B2b accent.css (2h) — parallelizable but Block 1 only needs focus accent which lives in primitives; can defer to immediately before Block 2

## Critical path to Block 1 (ts-input)

1. B3 — load JetBrains Mono (`5min`)
2. B1 — naming reconciliation, primitives → sandbox vocabulary (`1h`)
3. Q1 — dark-surface fix, recess toward `oklch(0 0 0)` (`15min`)
4. Owner-notes verification (purple + grid-bg) (`20min`)
5. B2a — create `system/text.css` extracted from sandbox L35–85 (`1h`)
6. Border port from backup L83–88 into `system/surfaces.css` (`45min`)
7. Q3 — fluid title shim into text.css (`30min`)
8. Audit pass on touched files + commit gate (`30min`)

**Total wall-clock to Block 1:** **~4h 25min** (single-agent serial).

With one parallel agent on B2b accent.css during steps 5–7: still ~4h 25min on the critical path; B2b lands free in parallel for Block 2.

## What I would defer to Session 4+ (with reason)

- **B2b accent.css (full version)** — Block 1 input focus ring can borrow `--ts-accent` directly from primitives; the bright/dark/dim/border derivative chain is Block 2 (ts-btn) territory. Build it after Block 1 ships, not before.
- **Padding scaling engine review** — no Block 1–3 component needs the harmonic-ratio padding system; existing `--ts-sp-*` ladder is sufficient. Schedule a council session in Session 5.
- **Alternating-surface system rebuild (`.ts-section--alt` contrast-driven)** — section-level concern, not component-level. Block 1–5 are all components. Defer to Session 5 (sections phase).
- **Semantic font-size rename (xs/sm/lg/xl/2xl)** — the fluid shim from Q3 satisfies the owner's responsive-titles use case. Full ladder rename is 6–9h of cascade-risk work with zero Block 1 blocker. Defer to Session 4.5+.
- **RULING 7 per-preset engine bake** (`generate-colors.js` per-preset ΔL emit) — Q1's `oklch(0 0 0)` fix gets dark presets out of degeneracy with one formula. The per-preset bake is a polish layer, not a blocker. Already flagged as PARALLEL in `decisions/system-layer-status.md`; keep it that way.
- **expert-designer/templates/tokens.css conflict** — Architect-flagged but components in THIS repo never load it. Add a one-line `.gitignore`-style note in `CLAUDE.md` ("rebuild components never `@import` skill template tokens") and move on. Real fix is upstream in the skill repo.

COUNCIL VOICE COMPLETE — Pragmatist — handoffs/_design-integration-council-pragmatist.md

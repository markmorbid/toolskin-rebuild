# Owner Work Report — `ts-nav-header.css` annotations & refactor criteria

**For:** Claude Design agent (consolidation pass)
**From:** Owner
**Hard rule:** **Do NOT override or silently delete any owner work below.** Each note is intentional. Where a note says "move/relocate/remove once X", the removal is conditional — only act when the stated condition is met, and preserve the owner's intent and exact design.

> **Diff note:** A byte-level diff was not possible — the earlier `ts-nav-header.css` from this session was only read into context, never saved to disk, and the new upload overwrote the same filename. So this is a **complete extraction** of every annotation/owner-note/refactor-tag currently in the file (line numbers from the uploaded `ts-nav-header.css`), which is what's needed to report the work and guard it during refactor.

---

## A. Cross-cutting refactor criteria (owner's own grep-tag summary)

The owner maintains this tag taxonomy (lives in the owner's master notes, not this CSS file). Map the in-file notes below to these tags when consolidating:

- **[layout-offset]** — unify top-offset logic for fixed nav + promo banner into a single `--ts-layout-offset-top`; apply once at body; delete duplicated `calc()`, negative margins, section-level hacks. → **maps to §B-9 below.**
- **[harness-fix]** — v3 nav showcase harness injects a hardcoded background that breaks variant toggles; enforce token-driven background (override only); remove patch once harness fixed. → **maps to §B-6, §B-7.**
- **[separators]** — optional separators over-complex; only valid in non-pill (flat) variant; never near active items; not allowed in tabbed/full-height/icon-only. → **maps to §B-5.**
- **[icon-align]** — `.ts-icon` inside items may misalign from subpixel rounding in flex/grid; targeted fallback only (`display:inline-block/block`), not a layout-system change. → **no in-file note yet; treat as a standing task.**

---

## B. In-file annotations (verbatim intent, by location)

### 1. `[~L9–257]` `@REFACTOR NOTE — NORMALIZATION RESET (V2)`
Normalization/reset layer **does not belong to this asset**. It's a **core system layer** currently isolated in this temporary sheet. **Must be:** moved to the core stylesheet, loaded globally across all views, applied at root scope, executed **before** any asset/component layers. Must NOT remain in this file.
**Action for refactor:** relocate to core, preserve as global pre-layer. Do not inline it elsewhere.

### 2. `[~L260–476]` `OWNER NOTE — CORE TOKEN IMPORTS` (Z-index · Animation · Border system)
Three imported token groups explicitly flagged as **not belonging here**, imported from the showcase to ensure full coverage:
- `[L376]` Z-index tokens — "needs to be moved to another sheet."
- `[L392]` Animation presets — "needs to be moved to another sheet."
- `[L412]` Border smart tokens (light/dark via primary-text + alpha dims) — standard to keep, but engine-level.
**Action:** move token *definitions* to the core/engine layer; this file should **consume final tokens only, never define them.**

### 3. `[~L481–508]` `KEY DECISIONS (owner notes resolved)` — architectural contract (KEEP)
Settled decisions that must survive refactor:
- Scoped tokenization on `:where(<nav scopes>)`, **not** `:root *` (perf).
- One shared base; variants only re-bind tokens, never fork structure.
- Glass via `::before` pseudo-element, never the parent (independent backdrop-filter for dropdowns); token-driven fallback alpha; `--ts-nav-glass:0` disables blur.
- Engine-true color: every surface/border/ink reads a primitive or oklab `--ts-this-bg-*` derivative. Zero sRGB mixes, zero hex.
- **Zero `!important`** — specificity solved by layer order + scope.
- Documented **LOAD ORDER** + pairing with `ts-nav.js` + `ts-icons.js`.
**Action:** treat as invariants. Any refactor that violates these is a regression.

### 4. `[~L608–660]` Color-engine + Radius-system relocation notes
- `[L608]` "Remove all engine-level color logic from this sheet" → relocate to core color layer; file must only consume final tokens.
- `[L636/L655]` `@Refactor note` (×2): the border-radius handling (`--ts-radius-cap-raw`, `--ts-radius-constrained`, `--ts-header-ui-rad`, `--ts-nav-ui-radius`, `--ts-nav-btn-radius`, `--ts-nav-dropdown-radius`) **must move to a proper token + stylesheet**; the radius engine must be globally accessible; cap-raw limit is a **local, user-overridable** setting with a base default. "The entire code must not remain here. Also check if this is the best way to handle this."
**Action:** extract the radius constraint system to the engine; keep the consumer tokens here referencing it.

### 5. `[~L3120–3185]` Separators system `refactor note` ([separators])
Optional separators are over-complex/fragile. Current workaround: `opacity:0` by default. Constraints: spaced variant uses pill items only; separators only make sense when pills/backgrounds are disabled; **tabbed, full-height, icon-only must NOT use separators**; should not show adjacent to active items; limited gap causes collisions in spaced variant.
**Tasks:** remove complex adjacency selectors; gate by variant (allow only flat/non-pill); rebalance spacing (gap vs padding vs item width); validate hover/active integrity; refactor to token-driven spacing. Goal: simpler, deterministic, variant-aligned.

### 6. `[~L3564–3611]` `TODO / ARCHITECTURAL RECOMMENDATION` (surface variant attributes)
Migrate from string-matching style attributes (`[style*="…"]`) to a dedicated micro-state attribute system (e.g. `data-ts-surface-variant="accent"`). Locks semantic tokens explicitly, eliminates runtime recalcs, prevents specificity races.

### 7. `[~L3586–3611] & [~L3849–3870]` `dev note: hard fix for v3 nav showcase harness` ([harness-fix]) — patch, conditional removal
Harness injects a hardcoded background that breaks variant-toggle rendering; this is an **override-only patch** scoped to non-production HTML harness files. Includes `.ts-harness-stage { background: transparent !important }`.
**Tasks:** find the injection source; block/override hardcoded background; ensure surfaces resolve via tokens only; validate all toggle states; **remove patch only once the harness no longer injects background styles.**

### 8. `[~L3705–3789]` `CURRENT PRODUCTION BUG (CRITICAL)` — raw `background: var(--ts-accent)` ban
Harness/showcase sometimes applies raw `background: var(--ts-accent)` directly, bypassing the `this-bg` system → washed-out/semi-white inversion artifacts. **Required fix:** always use `--ts-this-bg: var(--ts-accent)` (or tokenized surface). DOM injections must follow the color pipeline; `on-accent ≠ on-surface-auto` (separate paths, must not be conflated). Validation + final directive: **raw color assignments are not allowed**; all color flows `this-bg → core engine → final tokens`. Enforce across all injections/showcases.

### 9. `[~L4156–4288]` `TOPBAR + PROMO BANNER OFFSET SYSTEM — REFACTOR REQUIRED` ([layout-offset])
Current `:has()`-heavy offset logic is correct but fragile (duplicated calc, mixed padding/margin, responsibility split across body/main/sections). **Target:** single `--ts-layout-offset-top = topbar-h + (banner visible ? banner-h : 0)`, applied **once at body**; nav `top` relative to banner presence only. Normalized states A–D defined (nav only / nav+banner visible / nav+banner dismissed / no fixed nav). Execution order STEP 1–6 spelled out (token consolidation → state signaling via minimal `:has()` on body → root offset application → nav alignment → delete legacy rules → visual QA). **Safe to remove** (per owner): duplicated `calc((topbar-h + banner-h))`, `:not(:has(#ts-main))` fallbacks, `.ts-section:first-of-type` padding, negative margins. Non-goals: don't preserve selector parity, don't support inconsistent DOM via fallbacks, don't mix padding+margin. **Must be a global layout layer** — any per-component adjustment is a system-design failure.

### 10. Scattered owner/implementation notes (KEEP as design intent)
- `[L1331]` `OWNER REFACTOR NOTE` (theme-toggle): owner imported/refactored this element to enable **full-height mode** and make the pattern iterable on burger + top button on mobile; the **spaced (pill) nav variant does not have this feature**; the **theme-toggle button always has full-height enabled as a rule unless the button-type variant is active**; on mobile, **borders must be 0px width.**
- `[L1436]` `Owner Notes` (burger): owner overrode the prior implementation to keep the **original exact design**, but the agent must **implement it on the current code basis AND incorporate the improvements + tokens.**
- `[L3069]` owner note: the **last button in the bar needs an end margin** (was sticking to the edge).

---

## C. Consolidation guardrails (what the Design agent must guarantee)

1. **Preserve every owner note's intent**; do not delete conditional patches before their stated removal condition is met (esp. §B-7 harness fix).
2. **Honor the invariants in §B-3** (scoped tokens, glass-on-`::before`, engine-true color, zero `!important`, load order).
3. **Relocate, don't inline**: §B-1 reset, §B-2 token imports, §B-4 color+radius engine all move to core/engine layers; this file consumes final tokens only.
4. **Execute the two big tracked refactors** with the owner's specified steps: §B-9 offset system ([layout-offset]) and §B-5 separators ([separators]).
5. **Enforce the color contract** (§B-8): no raw `background: var(--ts-accent)`; route through `--ts-this-bg`.
6. Apply the standing **[icon-align]** fallback where `.ts-icon` misaligns (targeted only).
7. Cross-check against `HANDOFF-ts-nav-consolidation.md` (the `ts-nav.js` side) so JS state classes (`.at-top`/`.is-at-top`, `.is-visible`/`.active`, `.is-collapsed`/`.is-narrow`, `.ts-nav--mobile`) and the CSSOM media-tokenizer stay in sync with these CSS rules.

---

## D. Quick grep map (for the agent)

```
@REFACTOR NOTE — NORMALIZATION RESET (V2)     L9
OWNER NOTE — CORE TOKEN IMPORT                 L260
  z-index import "doesn't belong here"         L376
  animation import "doesn't belong here"       L392
  border smart tokens import                   L412
KEY DECISIONS (owner notes resolved)           L481
Remove engine-level color logic                L608
@Refactor note (radius → token/engine)         L636, L655
OWNER REFACTOR NOTE (theme-toggle fullheight)  L1331
Owner Notes (burger override)                  L1436
[REFACTOR NOTE] EMERGENCY MOBILE DROPDOWN      L1887
owner: last-button end margin                  L3069
refactor note: separators system               L3120
TODO / ARCHITECTURAL RECOMMENDATION (surface)  L3564
dev note: hard fix v3 harness (patch)          L3586, L3849
CURRENT PRODUCTION BUG (CRITICAL) accent bg     L3705
TOPBAR + PROMO BANNER OFFSET — REFACTOR REQ.   L4156
  REQUIRED REFACTOR STEPS                        L4226
  Delete legacy rules                            L4246
```

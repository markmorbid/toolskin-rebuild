# CSS Refactor Tracker — `ts-nav-header.css`
**Source:** `docs/handoffs/OWNER-WORK-REPORT-css-notes.md`
**Generated:** 2026-06-06
**CSS file:** `portable-02-components/assets/css/next/components/ts-nav-header.css` (4,656 lines)
**Rule:** Do NOT act on any item until its stated condition is met. Every item is conditional.

---

## Cross-cutting tag taxonomy

| Tag | Description | Mapped items |
|---|---|---|
| `[layout-offset]` | Unify fixed-nav + banner top-offset into `--ts-layout-offset-top`; apply once at body | §B-9 |
| `[harness-fix]` | Remove hardcoded background injection in v3 showcase harness | §B-6, §B-7 |
| `[separators]` | Simplify over-complex separator system; gate by variant | §B-5 |
| `[icon-align]` | `.ts-icon` subpixel misalignment fix — targeted fallback only | standing task (no in-file note yet) |

---

## §B Tracked refactor items

### B-1 · Reset layer relocation `[~L9–257]`
**Status:** ⏸ In progress (Phase 3 created `core/reset.css` scaffold — D-05 open)
**Condition to act:** D-05 resolved (owner picks reset scope). Then:
- Move the normalization/reset block (L9–257) to `core/reset.css`
- Wrap in `@layer base { … }`
- Load before all primitives
- Delete from `ts-nav-header.css`
**Guardrail:** Non-destructive. Cross-browser test before merging.

---

### B-2 · Core token imports relocation `[~L260–476]`
**Status:** ⏸ Queued — Phase 3 created scaffold files, no migration yet
**Three sub-items:**

| Sub | Location | Token group | Target file | Condition |
|---|---|---|---|---|
| B-2a | L376 | Z-index tokens | `primitives/z-index.css` | ✅ File exists. Migrate when audit B section (z-index literal → token) is authorized |
| B-2b | L392 | Animation presets | `primitives/motion.css` (extend) OR new `primitives/animation.css` | Owner confirms target file |
| B-2c | L412 | Border smart tokens (light/dark via primary-text + alpha dims) | `system/on-surface.css` §2 extension OR new `system/borders.css` | Owner confirms target |

**Rule:** Token DEFINITIONS move; nav file retains only `var(--ts-*)` consumers.

---

### B-3 · Architectural invariants `[~L481–508]` — KEEP, never remove
**Status:** ✅ Preserved as of current file. These are invariants, not refactor targets.
**What they protect:**
- `:where(<nav scopes>)` scoped tokenization — NOT `:root *`
- Glass via `::before` — never on parent
- Engine-true color: oklab, zero sRGB, zero hex
- Zero `!important`
- Documented load order

**Agent rule:** Any edit that violates any of these is a regression. Check before any PR.

---

### B-4 · Color + radius engine relocation `[~L608–660]`
**Status:** ⏸ Queued — Phase 3 does not touch this
**Sub-items:**

| Sub | Location | What | Target | Condition |
|---|---|---|---|---|
| B-4a | L608 | Remove all engine-level color logic from nav | `system/on-surface.css` (already started) or new `system/color-engine.css` | After on-surface.css §2 A-01 lift is authorized (Phase 3 extension) |
| B-4b | L636 | Radius constraint system (`--ts-radius-cap-raw`, `--ts-radius-constrained`, `--ts-header-ui-rad`, nav radius chain) | New `system/radius-engine.css` OR extend `primitives/radius.css` | Owner confirms whether cap-raw should be user-overridable (suggested: yes, with a base default in primitives) |
| B-4c | L655 | `@Refactor note` (same radius block continuation) | Same as B-4b | Same |

**Owner caveat:** "Also check if this is the best way to handle this" — owner question, not yet answered.

---

### B-5 · Separators system `[~L3120–3185]` `[separators]`
**Status:** ⏸ Queued
**Condition to act:** After nav hardening (Task 3) is complete and variant system is formalized (Task 6).
**Constraints (non-negotiable):**
- Only valid in **flat/non-pill** variant
- **NEVER** in tabbed, full-height, or icon-only
- **NEVER** adjacent to active items
- Gap vs padding vs item-width must be rebalanced
**Tasks:**
1. Remove complex adjacency selectors
2. Gate by variant (`[data-ts-nav-variant="flat"]` or equivalent)
3. Rebalance spacing with token-driven gaps
4. Validate hover/active integrity with separator present
5. Verify spaced-variant pill items never show separators

---

### B-6 · Surface variant attribute migration `[~L3564–3611]`
**Status:** ⏸ Phase 5 territory (per architecture plan)
**Condition to act:** Phase 5 authorized.
**What:** Migrate `[style*="…"]` selectors → `data-ts-surface-variant="accent"` attributes.
**Why:** Semantic tokens, no runtime recalcs, no specificity races.
**Scope:** Update CSS selector, JS that sets the style, and any HTML harnesses that use inline style for surface switching.

---

### B-7 · Harness fix — v3 showcase background patch `[~L3586–3611]` + `[~L3849–3870]` `[harness-fix]`
**Status:** ⚠️ Active patch — DO NOT remove until condition met
**Patch location:** `.ts-harness-stage { background: transparent !important }` — scoped to harness only
**Condition to remove:** The v3 nav showcase harness (`ts-topbar-nav-v3.html`) no longer injects a hardcoded background style.
**Tasks to close:**
1. Find the injection source (harness-tester.js? inline style in HTML?)
2. Override/block the hardcoded background at source
3. Ensure all surface toggle states resolve via `--ts-this-bg` chain
4. Validate all toggle states render correctly
5. Then and ONLY THEN: remove the `!important` patch from `ts-nav-header.css`

---

### B-8 · Raw accent background bug `[~L3705–3789]` — CRITICAL
**Status:** ⚠️ Flagged as CURRENT PRODUCTION BUG — verified in Phase 3 audit as C-01
**Violation pattern:** `background: var(--ts-accent)` direct — bypasses `--ts-this-bg` engine
**Confirmed live location:** `ts-nav-header.css` line 3951 (promo banner CTA `::before`)
**Required fix (one line):**
```css
/* Before: */
background: var(--ts-accent);
/* After: */
--ts-this-bg: var(--ts-accent);
background: var(--ts-this-bg);
```
**Condition to act:** Owner approves the single-line fix. Low risk — isolated to the CTA pseudo.
**On-accent ≠ on-surface-auto:** These are separate paths — must not be conflated in the fix.

---

### B-9 · Topbar + promo banner offset system `[~L4156–4288]` `[layout-offset]`
**Status:** ⏸ Major refactor — Phase 4+ territory
**Owner-specified execution (STEP 1–6, verbatim):**
1. Consolidate tokens: single `--ts-layout-offset-top = topbar-h + (banner visible ? banner-h : 0)`
2. State signaling: minimal `:has()` on `<body>` only — no duplicated `:has()` in children
3. Root offset: apply `--ts-layout-offset-top` ONCE at body
4. Nav alignment: nav `top` relative to banner presence only
5. Delete legacy: remove duplicated `calc((topbar-h + banner-h))`, `:not(:has(#ts-main))` fallbacks, `.ts-section:first-of-type` padding, negative margins
6. Visual QA: normalized states A–D (nav only / nav+banner visible / nav+banner dismissed / no fixed nav)

**Non-goals (explicit):**
- Do NOT preserve selector parity
- Do NOT support inconsistent DOM via fallbacks
- Do NOT mix padding + margin

**Scope:** This is a **global layout layer** — any per-component adjustment after this is a system failure.

---

### B-10 · Scattered owner notes — standing design decisions (KEEP)
**Status:** ✅ Not refactor targets — design intent documentation

| Location | Note | Intent |
|---|---|---|
| L1331 | Theme toggle full-height mode | Full-height always enabled EXCEPT when button-type variant is active. On mobile: border-width = 0px. |
| L1436 | Burger override | Owner overrode prior implementation. Keep the original exact design; implement on current code basis + incorporate improvements + tokens. |
| L3069 | Last-button end margin | Last button in bar needs end margin — it was sticking to the edge. Already in SKILL v8 P-06 (smart first/last button spacing). Confirm it renders correctly in the spaced variant. |

---

## §C Consolidation guardrails (agent binding)

These apply to EVERY future edit to `ts-nav-header.css`:

1. **Preserve every owner note's intent** — never delete a conditional patch before its stated removal condition is met (esp. B-7)
2. **Honor B-3 invariants** — scoped tokens, glass on `::before`, engine-true color, zero `!important`, load order
3. **Relocate, don't inline** — B-1 reset, B-2 token imports, B-4 color+radius engine all move to core/engine layers; nav file consumes final tokens only
4. **Execute tracked refactors with owner's specified steps** — B-9 ([layout-offset]) and B-5 ([separators]) have explicit step-by-step sequences; follow them
5. **Enforce color contract (B-8)** — no raw `background: var(--ts-accent)`; route through `--ts-this-bg`
6. **Apply [icon-align] targeted fallback** where `.ts-icon` misaligns (display:inline-block/block on the specific element only — not a layout-system change)
7. **Cross-check CSS↔JS sync** — state classes `.at-top`/`.is-at-top`, `.is-visible`/`.active`, `.is-collapsed`/`.is-narrow`, `.ts-nav--mobile` must match `ts-nav.js` TS_STATE registry

---

## §D Quick grep anchors (current line numbers)

```
@REFACTOR NOTE — NORMALIZATION RESET (V2)           L9
OWNER NOTE — CORE TOKEN IMPORT                      L260
  z-index "doesn't belong here"                     L376
  animation "doesn't belong here"                   L392
  border smart tokens import                        L412
KEY DECISIONS (owner notes resolved)                L481
Remove engine-level color logic                     L608
@Refactor note (radius → token/engine)              L636, L655
OWNER REFACTOR NOTE (theme-toggle fullheight)       L1331
Owner Notes (burger override)                       L1436
[REFACTOR NOTE] EMERGENCY MOBILE DROPDOWN          L1887
owner: last-button end margin                       L3069
refactor note: separators system                    L3120
TODO / ARCHITECTURAL RECOMMENDATION (surface)       L3564
dev note: hard fix v3 harness (patch)               L3586, L3849
CURRENT PRODUCTION BUG (CRITICAL) accent bg         L3705
TOPBAR + PROMO BANNER OFFSET — REFACTOR REQ.        L4156
  REQUIRED REFACTOR STEPS                           L4226
  Delete legacy rules                               L4246
```

---

## Priority order

```
1. B-8 (C-01)  ← one-line fix, CRITICAL, owner approves → unblocks B-7 validation
2. B-7         ← remove harness patch after source injection found + blocked
3. B-9         ← [layout-offset] unblocks Phase 4 sheet consolidation
4. B-1         ← reset relocation (D-05 must resolve first)
5. B-2a        ← z-index token migration (table already written in Phase 3 report)
6. B-4b+c      ← radius engine relocation (owner confirms approach first)
7. B-2b        ← animation token migration
8. B-2c        ← border token migration
9. B-5         ← separators (after nav hardening Task 3 + variant formalization Task 6)
10. B-6        ← surface attribute migration (Phase 5)
```

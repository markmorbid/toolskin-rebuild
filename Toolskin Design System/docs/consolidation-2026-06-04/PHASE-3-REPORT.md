# Phase 3 Report — Layer Formalization Deployment
**Date:** 2026-06-05
**Mode:** Deploy and wire only. No redesign. Halt for owner review.
**Closes:** Phase 2 (D-01 resolved: threshold = 0.72).
**Status:** ✅ Complete. Halted as instructed.

---

## TL;DR

| Action | Count |
|---|---|
| Files created (new layer scaffolds) | **3** |
| Files modified (Phase 2 close — threshold 0.72) | **3** |
| HTML harnesses wired (canonical load order) | **9** |
| Audits run (read-only grep) | **3** |
| Real violations found | **3 categories, ~15 hits** |
| Design decisions made | **0** |
| Files deleted | **0** |

---

## 1 · FILE LIST (everything touched this pass)

### Created (3)

| File | Purpose | Lines |
|---|---|---|
| `assets/css/next/core/reset.css` | **L0** scaffold — `@layer base` slot, empty pending D-05 | ~30 |
| `assets/css/next/primitives/z-index.css` | **L1 z-index** stack tokens (`--ts-z-base..max`) | ~45 |
| `assets/css/next/system/app-tokens.css` | **L4** scaffold — migration queue documented, empty body | ~55 |

### Modified — Phase 2 close, threshold → 0.72 (3)

| File | Change |
|---|---|
| `system/on-surface.css` | §1 threshold raised 0.65 → 0.72. Provenance note updated with D-01 reference. |
| `primitives/status-tints.css` | Group C threshold raised 0.65 → 0.72. Conflict flag replaced with consolidation flag. |
| `components/ts-btn_v3.1.css` | Lines 50-54: declaration commented out (redundant — primitive already wins specificity, identical value). Logic preserved as comment per "remove nothing" rule. |

### Modified — Phase 3 wiring (9 HTML harnesses)

All 9 files received 3 new `<link>` rows in this order:
- `core/reset.css` injected **first** (before `primitives/colors.css`)
- `primitives/z-index.css` injected after `primitives/motion.css`
- `system/app-tokens.css` injected after `system/on-surface.css`

Files: `index.html`, `ts-card.html`, `ts-chip-badge.html`, `ts-input.html`, `ts-modal-overlay.html`, `ts-section.html`, `ts-table-accordion.html`, `ts-topbar-nav.html`, `ts-topbar-nav-v3.html`.

### Final canonical load order (all 9 HTMLs)

```
L0  core/reset.css                          ← NEW · @layer base
L1  primitives/colors.css
    primitives/typography.css               ← legacy, kept loaded
    primitives/type-v2.css                  ← wins by source order
    primitives/spacing.css
    primitives/radius.css
    primitives/motion.css
    primitives/z-index.css                  ← NEW
    primitives/status-tints.css
L2  system/toolskin-this-bg-v2.css
L3  system/on-surface.css
L4  system/app-tokens.css                   ← NEW (scaffold; empty body)
    system/toolskin-gradients-v3.css
    components/ts-btn_v3.1.css
    components/ts-nav-header.css
    components/ts-promo-banner.css          (where used)
    assets/css/next/harness.css             ← scaffold last
```

---

## 2 · CONFLICT REPORT (audit findings — NOT fixed, only flagged)

### A · Engine-logic leakage in components (directive §3)

**Audit:** grep `oklch(from|--ts-on-surface-auto:|--ts-on-accent:` in `components/`.

**Findings:**

#### A-01 · `ts-nav-header.css` — dynamic-ink engine block (lines 3345-3450)
The largest leakage. ~100 lines of OKLCH math living inside the nav file:
- `--ts-bg-switch` (threshold formula, **threshold = 0.65** — predates D-01)
- `--ts-dynamic-ink-contrast` (OKLCH from `--ts-this-bg`)
- `--ts-dynamic-ink-medium`
- `--ts-dynamic-ink-muted`
- `--ts-on-surface-auto: var(--ts-dynamic-ink-contrast) !important` (line 3362)
- `--ts-text-primary: var(--ts-dynamic-ink-contrast)`

This is a **second engine** that runs in parallel with `on-surface.css`. Per directive §3 this MUST move out of the nav. Per "no redesign" rule, **not touched this pass**.

**Action queued:** lift to `system/on-surface.css` §2-extension as a generic "dynamic ink" sub-engine; nav becomes consumer of `--ts-dynamic-ink-*`.

**Sub-finding:** threshold inside this block is **0.65** — inconsistent with D-01 (0.72) decision. If kept, must be raised. Or scrapped entirely if `--ts-on-surface-auto` is sufficient.

#### A-02 · No leakage in other component files
`ts-btn_v3.1.css` line 50-54 is the now-commented-out duplicate — cleanly resolved.
`ts-card.css`, `ts-input.css`, `ts-modal.css`, `ts-accordion.css`, `ts-section.css`, `ts-promo-banner.css`: **clean** — no `oklch(from`, no `--ts-on-*` declarations.

---

### B · `z-index` numeric literals (directive §9)

**Audit:** grep `z-index:\s*[0-9]` in `components/`.

**Findings — live files only (`.bak`, `.bak2`, `_2.3.css`, `_2.3.2.css` excluded as superseded):**

| File | Line | Literal | Suggested token | Notes |
|---|---|---|---|---|
| `ts-nav-header.css` | 1697 | `9999` | `--ts-z-max` | burger-active escape hatch |
| `ts-nav-header.css` | 2440 | `999999` | `--ts-z-max` | select-open hoist (excessive) |
| `ts-nav-header.css` | 3703 | `200` | `--ts-z-fixed-nav` (300) **or new `--ts-z-promo-banner`** | promo banner in nav block |
| `ts-nav-header.css` | 3844 | `3` | `--ts-z-raised` (1) **or local** | promo banner internal stacking |
| `ts-nav-header.css` | 3935, 3950, 3987 | `1, 1, 0` | `--ts-z-raised` / `--ts-z-base` | promo banner pseudo stacking |
| `ts-promo-banner.css` | 63 | `200` | `--ts-z-fixed-nav` (300) **or new banner token** | conflicts with line above |
| `ts-promo-banner.css` | 186, 283, 301 | `3, 3, 2` | local stacking — keep literal or component-scoped | inside banner — fine |
| `ts-section.css` | 319 | `1` | `--ts-z-raised` | minor lift |
| `ts-accordion.css` | 182, 220 | `1, 9` | `--ts-z-raised`, local | toggle/marker stack |
| `ts-modal.css` | 148 | `1000` | `--ts-z-modal` | already commented as "was --ts-z-modal" |
| `ts-card.css` | 264 | `0` | `--ts-z-base` (cosmetic) | floor pseudo |
| `ts-btn_v3.1.css` | 725 | `1` | `--ts-z-raised` | focus-visible lift in btn-group |

**Action queued:** mechanical find/replace per the suggested-token column. Owner audits the table first — particularly the `999999` value and the promo-banner conflict (nav and promo-banner both claim z 200).

**Conflict B-01:** promo banner z-index inconsistency
- `ts-nav-header.css` line 3703 sets promo to `200`
- `ts-promo-banner.css` line 63 also sets `200`
- These two files have **duplicate promo-banner styles** — directive §7 calls for the merge. **Surfaced for Phase 4.**

---

### C · `background: var(--ts-accent)` bypass of `--ts-this-bg` engine (directive §4)

**Audit:** grep `background:\s*var\(--ts-accent\)` in `components/`.

**Findings — live files only:**

| File | Line | Context | Verdict |
|---|---|---|---|
| `ts-nav-header.css` | 3448 | Inside markdown code block in a CSS comment | **Documentation — false positive** |
| `ts-nav-header.css` | 3951 | Promo banner CTA `::before` pseudo | **Real violation — needs `--ts-this-bg` channel** |

**Backups (excluded):** `ts-nav-header.css.bak2:1511`, `ts-nav-header_2.3.css:1499` — both in deprecated files.

**Conflict C-01:** ts-nav-header.css line 3951 is the only live violation. Fix per directive §4:
```css
/* Before: */
background: var(--ts-accent);
/* After: */
--ts-this-bg: var(--ts-accent);
background: var(--ts-this-bg);
```
**Not done — owner approves the change first** ("no redesign" gate).

---

## 3 · D-DECISIONS — status

| ID | Decision | Status |
|---|---|---|
| **D-01** | `--ts-on-surface-auto` threshold | ✅ Resolved (0.72) — applied to 3 files this pass |
| **D-02** | Group C ownership (status-tints → on-surface) | ⏸ Open. Both files now carry threshold 0.72. Migration of Group C OUT of `status-tints.css` is mechanical once approved. |
| **D-03** | Promo banner merger | ⏸ Open. Phase 4 territory. Conflict B-01 (duplicate styling in two files) makes this more urgent. |
| **D-04** | L4 layout (single vs per-component) | ✅ Defaulted to Option A (single `system/app-tokens.css`) per plan recommendation. File scaffolded, empty body. |
| **D-05** | Reset scope | ⏸ Open. `core/reset.css` scaffold loads, `@layer base` block is empty. Owner picks scope. |

---

## 4 · WHAT THIS PASS DID NOT TOUCH (deliberate)

Per the "deploy and wire only · no redesign" rule:

- ✗ Did NOT migrate any `--ts-nav-*` / `--ts-card-*` / `--ts-input-*` tokens to `system/app-tokens.css`. Scaffold only; migration is its own task.
- ✗ Did NOT lift the `ts-nav-header.css` lines 3345-3450 dynamic-ink engine. Surfaced for Phase 3-extension.
- ✗ Did NOT replace any z-index numeric literal. Surfaced as a mechanical task with a complete mapping table.
- ✗ Did NOT fix `ts-nav-header.css:3951` `background: var(--ts-accent)` bypass. Flagged.
- ✗ Did NOT merge `ts-promo-banner.css` into nav (directive §7). Phase 4.
- ✗ Did NOT write any actual reset rules into `core/reset.css`. Owner picks D-05 scope.
- ✗ Did NOT delete any file (`.bak`, `_2.3.css`, `_2.3.2.css`, etc. remain on disk).
- ✗ Did NOT modify `pending-to-integrate.css` (still quarantined; not loaded).

---

## 5 · VISUAL VERIFICATION — NOT RUN

Per directive, halted before any visual check. Owner runs harnesses in preview (dark + light) before authorizing Phase 4.

**Specific points to verify when running visual check:**
1. All 9 harnesses still render (load order changes are additive).
2. `--ts-on-surface-auto` threshold change (0.65 → 0.72) doesn't visibly break any surface — most likely candidate: borders on near-threshold surfaces flipping ink direction.
3. `core/reset.css` (empty `@layer base`) doesn't introduce any regression. It shouldn't — the block is empty.

---

## 6 · NEXT MOVE QUEUE (owner picks one)

| Move | Unlocks | Effort |
|---|---|---|
| Visually verify 9 harnesses (dark+light) | All Phase 4 work | 10 min owner test |
| Resolve **D-02** (move Group C out of status-tints) | Cleaner primitives | 1 small commit |
| Resolve **D-03** (promo banner merger) + fix B-01 conflict | Sheet consolidation | Phase 4 starter |
| Resolve **D-05** (reset scope) | L0 has content | 1 owner decision |
| Authorize z-index literal → token replacement (Conflict B section) | Component consumer-purity | Mechanical, ~15 edits |
| Authorize A-01 lift (nav dynamic-ink engine → on-surface.css) | Eliminates nav engine logic | Larger refactor |

---

## HALTED.

No further work until owner reviews this report and authorizes a next move.

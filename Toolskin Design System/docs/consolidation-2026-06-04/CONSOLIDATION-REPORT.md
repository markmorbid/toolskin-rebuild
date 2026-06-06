# Phase 2 Consolidation Report — Workspace Clean Pass
**Date:** 2026-06-04
**Scope:** `portable-02-components/` (Claude Design project)
**Owner directive:** "BEFORE showing me anything: clean the workspace first."
**Mode:** Audit + deploy, no redesign, halt after report.

---

## TL;DR — what changed, what didn't

| Action | Count |
|---|---|
| Files created | 2 |
| Files modified (canonical load order) | 9 HTML |
| Files comment-flagged (no logic change) | 2 CSS |
| Files removed | **0** (per "remove nothing" rule) |
| New tokens introduced | **0** (per "no new tokens" rule) |
| Design decisions made | **0** (all flagged for owner) |
| Conflicts surfaced for owner decision | **2** |

---

## STEP 1 — Canonical load order deployed across all 9 HTML files

The canonical load order is now in effect on every HTML harness in the project.

```
1.  primitives/colors.css
2.  primitives/typography.css        ← legacy 13px/RULING-3 base (kept loaded — see §STEP 4)
2a. primitives/type-v2.css           ← NEW · adds clean ladder, fixes 5 v1 bugs
3.  primitives/spacing.css
4.  primitives/radius.css
5.  primitives/motion.css
6.  primitives/status-tints.css      ← also still emits --ts-on-surface-auto (Group C)
7.  system/toolskin-this-bg-v2.css   ← surface engine
8.  system/on-surface.css            ← NEW · auto-inversion aggregator
9.  system/toolskin-gradients-v3.css
10. components/ts-btn_v3.1.css       ← --ts-on-surface-auto redeclaration FLAGGED
11. components/ts-nav-header.css     ← accent-surface legibility block FLAGGED
12. components/ts-promo-banner.css   (where applicable)
13. assets/css/next/harness.css      ← scaffold last
```

**Files updated (9/9):**
- `index.html`
- `ts-card.html`
- `ts-chip-badge.html`
- `ts-input.html`
- `ts-modal-overlay.html`
- `ts-section.html`
- `ts-table-accordion.html`
- `ts-topbar-nav.html`
- `ts-topbar-nav-v3.html`

Each file got exactly **two added lines**: `primitives/type-v2.css` after typography, and `system/on-surface.css` after `toolskin-this-bg-v2.css`. No other changes.

**Deviation from directive — flagged for owner:**
The directive's canonical load order lists position 2 as `primitives/type-v2.css` (no typography.css). Per "remove nothing" rule, I kept `typography.css` loaded BEFORE `type-v2.css` so it remains a fallback. `type-v2.css` wins by source order. If owner confirms, drop typography.css from the load order in a later commit.

---

## STEP 2 — `system/on-surface.css` created

**New file:** `portable-02-components/assets/css/next/system/on-surface.css` (10,309 bytes)

Lifts the auto-inversion logic that was scattered across THREE locations into ONE aggregator. **Verbatim lift — no redesign.**

### What was lifted (and from where)

| § | Lifted from | What |
|---|---|---|
| §1 | `primitives/status-tints.css` Group C (lines 120-126) | `--ts-on-surface-auto` definition (threshold 0.65) |
| §2 | `components/ts-nav-header.css` §5.0 (lines 2534-2562) | Accent-surface legibility block — generalized from nav-only selector to `.ts-on-accent` |
| §3 | — | Conflict documentation (no resolution — owner-decision required) |

### Why this matters

Before: any component needing accent-surface legibility had to copy the nav's `--ts-on-accent` re-derivations into its own CSS, leading to drift and duplication.
After: adding `.ts-on-accent` to ANY root element triggers automatic ink/border/active-bar resolution from `--ts-on-accent`.

### Promise to keep

The original locations (status-tints.css Group C, ts-nav-header.css §5.0) are **NOT removed**. They remain as the historical canonical locations, comment-flagged with `COPIED-TO: system/on-surface.css`. on-surface.css is currently a duplication, not a replacement. After visual verification, owner approves the deletion of the originals.

---

## STEP 3 — Component CSS audit

### Tokens removed from component files

**None.** Per "remove nothing" rule, no tokens were deleted from component CSS. Every duplicate or conflict was instead **comment-flagged in place**.

### Comment flags added

| File | Line | Flag | Reason |
|---|---|---|---|
| `primitives/status-tints.css` | ~120 | `COPIED-TO: system/on-surface.css` | Group C `--ts-on-surface-auto` re-emitted in on-surface.css |
| `components/ts-btn_v3.1.css` | ~35 | `CONFLICT C-01` + `MOVED-TO: system/on-surface.css` | Duplicate `--ts-on-surface-auto` with **DIFFERENT threshold (0.72 vs 0.65)** |

### Conflicts surfaced — OWNER DECISION REQUIRED

#### **C-01 · `--ts-on-surface-auto` threshold mismatch**

| Location | Threshold | Specificity |
|---|---|---|
| `primitives/status-tints.css` line 122 | **0.65** | `:root, :root *` (wins by specificity) |
| `system/on-surface.css` §1 (new) | **0.65** | `:root, :root *` (mirrors primitive) |
| `components/ts-btn_v3.1.css` line 42 | **0.72** | `:where(:root, :root *)` (zero-specificity — currently dead) |
| `components/ts-nav-header.css` line 3052 | dynamic | `!important` override in dynamic-accent context |

**Currently 0.65 wins** by specificity. The btn declaration is dead code.

**Owner decision needed:**
- Which threshold is canonical — **0.65** or **0.72**?
- The threshold controls the lightness above which ink flips to black. Lower threshold = more surfaces get white ink.
- The nav's `!important` dynamic override is needed for the dynamic-accent context regardless of which static threshold wins.

**Once decided, action:**
1. Set the canonical threshold in `system/on-surface.css` §1 and `primitives/status-tints.css` Group C.
2. Comment out the btn declaration with `/* MOVED-TO: system/on-surface.css */`.
3. Leave the nav's `!important` override in place (it overrides for runtime-computed accent).

#### **C-02 · `status-tints.css` ownership of `--ts-on-surface-auto`**

The token lives in a file named "status-tints" but its purpose is on-surface inversion. The naming is misleading. **Suggested cleanup (NOT done):**
- Lift Group C OUT of status-tints.css entirely.
- Make `system/on-surface.css` the SOLE definition.
- `status-tints.css` becomes status-palette-only.

**Owner decision needed** before any move.

### Other audit findings (no action — informational)

#### `color-mix(in srgb, …)` distribution

I did NOT silently flag every srgb mix with a TODO. Many are intentional (owner's documented border system; btn accent-darken / lighten for performance). Distribution:

| File | srgb uses | Status |
|---|---|---|
| `ts-btn_v3.1.css` | 16 instances | Mixed: accent gradient darken/lighten (intentional, fast); button state borders (could migrate to oklab — minor) |
| `ts-nav-header_2.3.css` (older copy) | 5 instances | Owner's documented border-token exception (`--ts-border-0..4`) — keep |
| `ts-nav-header.css.bak2` (backup) | 5 instances | Backup file — irrelevant |
| `pending-to-integrate.css` | many | Quarantined — not loaded |
| `components/ts-accordion.css` | 0 in code (mentioned in comments documenting dropped srgb mixes) | Clean |
| `components/ts-input.css` | 0 in code (comment only) | Clean |

**Action:** None silently. If owner wants oklab migration for the btn state borders, that's a separate task. Per current rule "no new design decisions", I did not flag them.

#### `!important` distribution

The nav CSS has ~30 `!important` declarations, most documented inline as intentional (theme-toggle overrides, dynamic accent context, button surface lock-in). I did NOT add TODO comments to all of them because most have inline justification already. The two consolidation-relevant `!important`s:

| File | Line | Context | Owner decision needed? |
|---|---|---|---|
| `ts-nav-header.css` | 2313-2314 | `--ts-input-bg` cartel — referenced in handoff brief Task 4 as the cartel that should collapse once on-surface is global | YES — verify cartel collapses after on-surface.css deployed |
| `ts-nav-header.css` | 3052 | `--ts-on-surface-auto` override in dynamic-accent | NO — likely intentional, keep |

---

## STEP 4 — Type-v2 deployed

**Copied:** `toolskin-rebuild/expert-designer/handoff-type-v2/toolskin-type-v2.css` → `portable-02-components/assets/css/next/primitives/type-v2.css`

`type-v2.css` is 372 lines. It is a clean, well-documented replacement for `typography.css` that fixes five v1 bugs (declared in its own header):
1. `--ts-fs-base` declared twice in v1
2. `--ts-fs-ratio: 1.12` was decorative; steps hardcoded 1.125 instead
3. Comments contradicted computed values throughout v1
4. `--ts-fs-h3` had an inverted clamp (max < min)
5. `--ts-fs-lead` declared twice with conflicting comments

`type-v2` introduces ONE knob (`--ts-type-scale`), a clean UI zone (10-20px px-snapped) and a Display zone (true Major Third 1.25 with verified clamps).

Both files are now loaded; type-v2 wins by source order. Once visually verified, the old `typography.css` can be removed from the load order.

---

## STEP 5 — Conflicts I could not resolve without owner

Listed above as **C-01** and **C-02**. Both flagged with comments in source and documented in `system/on-surface.css` §3.

Additional pending decisions (NOT acted on):

1. **`typography.css` → `type-v2.css` migration completion.** Once visual parity is confirmed across all 9 harnesses in dark + light, drop `typography.css` from the load order. Currently both load (additive consolidation).

2. **Older nav CSS files** in `components/`:
   - `ts-nav-header.css.bak`, `ts-nav-header.css.bak2`
   - `ts-nav-header_2.3.css`, `ts-nav-header_2.3.2.css`
   - `ts-nav.css`, `ts-topbar.css`

   All superseded by `ts-nav-header.css` (canonical 2.3.4). Per "remove nothing" rule, they stay on disk. Owner can move to `_archived/` whenever ready.

3. **Promo banner not yet rebuilt.** Reference HTML/CSS provided in nav handoff Task 11; not implemented yet. The current `components/ts-promo-banner.css` (12,453 bytes) needs the `#CRAZY_FIX_RULES` cleanup per Task 11. **Halted** — separate task.

4. **The select trigger token cartel** (ts-nav-header.css lines 2313-2314, plus its full block around 2304-2330) — directive says this cartel should collapse once `on-surface.css` is global. **Not verified yet** — needs visual test in the input/select harness to confirm the cartel becomes redundant.

---

## What was NOT touched (per "remove nothing" rule)

- No file was deleted.
- No component CSS had any declaration removed.
- No selectors were rewritten.
- No tokens were renamed.
- No design decisions were made — every divergence is flagged with `OWNER DECISION REQUIRED`.

---

## Verification status

- ✅ All 9 HTML harnesses point to the canonical load order.
- ✅ `on-surface.css` and `type-v2.css` exist in the project.
- ✅ Comment flags in place on both conflict sites.
- ⏸ **Visual verification not yet run.** Per directive ("show me a summary then halt"), I have not loaded the harnesses in the preview to verify rendering. Owner runs visual check before any further work.

---

## HALTED.

Next decisions queued for owner:
1. **C-01:** which threshold for `--ts-on-surface-auto` — 0.65 or 0.72?
2. **C-02:** does Group C move out of `status-tints.css`?
3. Visual verification across the 9 harnesses (dark + light) — confirm parity before authorizing any further consolidation.
4. Whether to proceed with nav Task 3 (hardening) or other directive items.

**No further work until owner reviews this report.**

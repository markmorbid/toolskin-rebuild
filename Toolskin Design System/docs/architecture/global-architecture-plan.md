# Toolskin · Global Architecture Plan
**Generated:** 2026-06-05
**Supersedes:** `docs/workspace-audit/*`, `docs/consolidation-2026-06-04/*` (folds them in)
**Source directive:** "SYSTEM REFACTOR SUMMARY — GLOBAL ARCHITECTURE DIRECTIVE" (12 sections)
**Mode:** Plan only. No execution. Halt for owner review.

---

## 0 · The architecture in one diagram

```
┌────────────────────────────────────────────────────────────────────────┐
│                     CONSUMERS — components, harnesses                  │
│        (token consumers only · zero logic · zero local color math)     │
└────────────────────────────────────────────────────────────────────────┘
                                  ▲
                                  │  consumes
┌────────────────────────────────────────────────────────────────────────┐
│  L4 · APPLICATION TOKENS        components/_app-tokens.css             │
│        --ts-nav-*, --ts-card-*, --ts-input-*, --ts-modal-*             │
│        Maps system tokens to component-scoped knobs. No formulas.      │
└────────────────────────────────────────────────────────────────────────┘
                                  ▲
┌────────────────────────────────────────────────────────────────────────┐
│  L3 · PROCESSING LAYER          system/on-surface.css ◄── (created)    │
│        --ts-on-surface-auto, --ts-on-accent, .ts-on-accent inversion   │
│        Auto-inversion · interactive-state resolution from surface      │
└────────────────────────────────────────────────────────────────────────┘
                                  ▲
┌────────────────────────────────────────────────────────────────────────┐
│  L2 · COLOR ENGINE              system/toolskin-this-bg-v2.css         │
│        --ts-this-bg + derivatives · OKLAB mixing · surface engine      │
│        system/toolskin-gradients-v3.css (binds to --ts-this-bg)        │
└────────────────────────────────────────────────────────────────────────┘
                                  ▲
┌────────────────────────────────────────────────────────────────────────┐
│  L1 · BASE TOKENS               primitives/*.css                       │
│        colors · type-v2 · spacing · radius · motion · status-tints     │
│        z-index stack · border tokens · animation/easing presets        │
└────────────────────────────────────────────────────────────────────────┘
                                  ▲
┌────────────────────────────────────────────────────────────────────────┐
│  L0 · RESET / NORMALIZATION     core/reset.css   @layer base           │
│        Global · loads first · NEVER inside a component file            │
└────────────────────────────────────────────────────────────────────────┘
```

**Each layer's contract:**
- L0–L2 declare tokens and engine formulas. Components don't read these directly except through L3/L4.
- L3 takes L2 outputs and produces auto-resolution tokens (`--ts-on-*`).
- L4 maps L1+L2+L3 → component-scoped knobs (`--ts-nav-*`, `--ts-card-*`, …).
- Components consume L4 only. Zero color math. Zero local tokens that duplicate any upper layer.

---

## 1 · Mapping the directive's 12 sections to existing state

| § | Directive item | Current state | Phase |
|---|---|---|---|
| 1 | Strict layered architecture | Partially exists (primitives + system folders). L0 reset and L4 app-tokens **do not exist as separate layers**. | Phase 3 |
| 2 | Color engine consolidation | **In flight** — `system/on-surface.css` created (2026-06-04) as L3 aggregator. Still has duplicate `--ts-on-surface-auto` in `status-tints.css` + `ts-btn_v3.1.css` (flagged C-01). | Phase 2 → Phase 3 cleanup |
| 3 | Remove engine logic from components | **Audit done.** nav §5.0 lifted to on-surface.css. Other components not yet audited for engine logic leakage. | Phase 3 |
| 4 | `--ts-this-bg` as single entry point | Engine exists. Need lint rule: no component CSS writes `background: var(--ts-accent)` directly. All surfaces declare `--ts-this-bg: …; background: var(--ts-this-bg);`. | Phase 3 |
| 5 | Token normalization | No duplicates audit done across all files yet. Phase 2 found 2 (`--ts-on-surface-auto`). Full audit required. | Phase 3 |
| 6 | Gradient system integration | `toolskin-gradients-v3.css` loads in canonical order. Needs verification that all gradients derive from `--ts-this-bg`. | Phase 4 |
| 7 | Stylesheet consolidation | **Targets identified:** promo banner → nav, normalization → core, color logic → out of components. | Phase 4 |
| 8 | Normalization / reset layer | **Does not exist.** Currently no `core/reset.css` file. Reset rules are scattered or rely on browser defaults. | Phase 3 |
| 9 | z-index, animation, border tokens | Partially exists in `primitives/motion.css`. **Z-index stack token system does not exist.** | Phase 3 |
| 10 | Navigation system specifics | **In flight.** ts-nav-header.css §5.0 lifted to on-surface.css. Token renaming (`--ts-navlink-*` → `--ts-nav-link-*`) deferred. | Phase 3 |
| 11 | Attribute system (`data-ts-surface-variant`) | **Future.** No work yet. Replaces `[style*="…"]` selectors. | Phase 5 |
| 12 | System design principles | Goal state. Verification = audit script per principle. | Phase 5 |

---

## 2 · Phase plan (sequenced)

### Phase 2 — Color engine cleanup (in flight; **OWNER DECISION QUEUED**)

**Status:** 80% done. Halted pending owner resolution of two conflicts.

| Task | Status |
|---|---|
| Create `system/on-surface.css` | ✅ Done |
| Deploy canonical load order across all 9 HTML harnesses | ✅ Done |
| Add `type-v2.css` to all harnesses | ✅ Done |
| Flag `--ts-on-surface-auto` threshold conflict (C-01) | ✅ Flagged in source + report |
| **Owner decides: 0.65 vs 0.72 threshold** | ⏸ **BLOCKING** |
| **Owner decides: does Group C move out of status-tints.css?** (C-02) | ⏸ **BLOCKING** |
| Visual verification of 9 harnesses (dark + light) | ⏸ Owner test |

**Exit criteria for Phase 2:** owner picks threshold; primitive + component declaration consolidated to ONE location; visual regression test green.

---

### Phase 3 — Layer formalization (next, after Phase 2 unblocks)

The directive's structural ask. Creates the missing layers.

#### 3a · Create L0 reset layer (directive §8)
- New file: `assets/css/next/core/reset.css`
- Wrap in `@layer base { … }`
- Move any reset rules currently buried in component CSS or harness.css into it
- Loads FIRST in the canonical order, before all primitives

#### 3b · Create L4 application-tokens layer (directive §1, §3)
- New file: `assets/css/next/system/app-tokens.css` (or split per-component)
- Houses `--ts-nav-*`, `--ts-card-*`, `--ts-input-*`, `--ts-modal-*` mappings
- Each app token is a simple alias: `--ts-nav-link-color: var(--ts-text-primary);`
- Component CSS becomes consumer-only

#### 3c · Audit every component for engine-logic leakage (directive §3, §5)
For each component CSS, grep for:
- Any `oklch(from …)` formula → must move to L2/L3
- Any `--ts-on-*` declaration → must move to L3
- Any `--ts-text-primary: …` override → must move to L3 (handled by `.ts-on-accent` now)
- Any duplicate of a system token → delete (component-scoped knobs only)

Components to audit (in order of likely violations):
1. `ts-nav-header.css` (largest, most logic)
2. `ts-btn_v3.1.css` (already flagged C-01)
3. `ts-card.css`
4. `ts-input.css`
5. `ts-promo-banner.css`
6. Others alphabetical

#### 3d · Define z-index stack tokens (directive §9)
New primitive section in `primitives/z-index.css` (or fold into existing primitives):
```css
:root {
  --ts-z-base:      0;
  --ts-z-raised:    1;
  --ts-z-dropdown:  100;
  --ts-z-sticky:    200;
  --ts-z-fixed-nav: 300;
  --ts-z-overlay:   900;
  --ts-z-modal:     1000;
  --ts-z-toast:     1100;
  --ts-z-max:       9999;
}
```
Then grep every `z-index: …` literal in components → replace with token.

#### 3e · Border token verification (directive §9)
`--ts-this-bg-border`, `--ts-on-surface-auto`-derived borders already exist. Audit for hardcoded `border-color: …` literals in components. Replace with tokens.

#### 3f · `--ts-this-bg` lint pass (directive §4)
Grep for `background:.*var\(--ts-accent\)` and similar bypasses. Any hit = violation. Replace with:
```css
.surface-name {
  --ts-this-bg: var(--ts-accent);
  background: var(--ts-this-bg);
}
```

**Exit criteria for Phase 3:** every component file is consumer-only (no formulas, no engine tokens). L0 + L4 exist. Z-index + border audits pass.

---

### Phase 4 — Stylesheet consolidation (directive §6, §7)

#### 4a · Promo banner → merged into nav (directive §7)
Currently: `ts-promo-banner.css` is its own file. Directive calls it for merger.
**Decision queued for owner:** merge into `ts-nav-header.css` or keep separate but inherit nav tokens?
- Merger pro: one source of truth for the fixed-top stack
- Separate pro: banner can be used without nav (e.g. cookie banner outside nav context)

#### 4b · Gradient binding audit (directive §6)
For every gradient in `toolskin-gradients-v3.css`:
- Verify it reads `--ts-this-bg` as one stop, not a fixed colour
- Add a comment proving derivation
- If a gradient is hardcoded → flag, refactor

#### 4c · Remove `pending-to-integrate.css` from any context (already quarantined)
File is 2,722 lines of kitchen-sink. Never linked in any HTML — confirmed. Move to `_archived/`.

**Exit criteria for Phase 4:** gradient library fully bound to engine. Sheet count reduced. No dead files in component folder.

---

### Phase 5 — Attribute system + principles verification (directive §11, §12)

#### 5a · Migrate `[style*="…"]` selectors to attributes
Find every `[style*="…"]` in CSS → replace with `data-ts-surface-variant="…"`.
Update HTML and JS to set the attribute instead of inline style.

#### 5b · Build verification scripts (directive §12 enforcement)
- `scripts/audit-no-engine-in-components.mjs` — grep for `oklch(from`, `--ts-on-`, in `components/`
- `scripts/audit-this-bg-entry.mjs` — grep for `background:.*--ts-accent` bypasses
- `scripts/audit-zindex.mjs` — grep for `z-index: \d+` literals
- `scripts/audit-token-duplicates.mjs` — token names declared in >1 file (excluding intentional cascade re-exports)

Each script: exits 1 on violation. CI gate.

---

## 3 · Conflicts requiring owner decisions BEFORE Phase 3 starts

Three decisions block forward motion. None should be guessed.

### D-01 · `--ts-on-surface-auto` threshold (C-01 from Phase 2)
Choose ONE: **0.65** or **0.72**. See `docs/consolidation-2026-06-04/CONSOLIDATION-REPORT.md` §STEP 3.

### D-02 · Group C ownership (C-02 from Phase 2)
Does the `--ts-on-surface-auto` declaration live in `primitives/status-tints.css` OR `system/on-surface.css`?
Recommendation: `system/on-surface.css` (matches the L3 architecture in §0). status-tints.css becomes status-palette-only.

### D-03 · Promo banner merger (4a above)
Merge into `ts-nav-header.css`, or keep separate file inheriting nav tokens?
Recommendation: keep separate. Reason: banner is reusable outside fixed-nav contexts.

### D-04 · L4 layout — single `app-tokens.css` vs per-component
Option A: one `system/app-tokens.css` with every component's app tokens
Option B: per-component `_<name>-app-tokens.css` files (e.g. `ts-nav-app-tokens.css`)
Recommendation: Option A for now (one place to scan for duplicates), split later if it grows past ~500 lines.

### D-05 · Reset library
Adopt an established reset (modern-css-reset, destyle.css), write our own, or keep relying on browser defaults?
Recommendation: write a minimal Toolskin-specific reset (~80 lines) — established libraries bring assumptions we don't share.

---

## 4 · What I will NOT do without owner approval

Per the user's standing instruction ("no design decisions, no redesign, halt for review"):

- I will NOT pick threshold (D-01).
- I will NOT move Group C out of status-tints.css (D-02).
- I will NOT merge or split the promo banner (D-03).
- I will NOT create `core/reset.css` or `system/app-tokens.css` until D-04, D-05 resolved.
- I will NOT migrate `[style*="…"]` → attributes (Phase 5) — too far ahead.
- I will NOT delete any file from `_archived/` or `_review/` candidates.

---

## 5 · Update to the v8 SKILL — what the directive adds

The directive introduces 4 binding rules not yet in the SKILL v8. Once owner approves, add them as guardrails #16–#19:

| # | Guardrail | Replacement when violated |
|---|---|---|
| 16 | `background:` set to `var(--ts-accent)` or any color token directly (not via `--ts-this-bg`) | `--ts-this-bg: var(--ts-accent); background: var(--ts-this-bg);` |
| 17 | `oklch(from …)`, `color-mix(…)`, or auto-resolution formula present in component CSS | Move to L2/L3 layer; component reads the resolved token |
| 18 | Hardcoded `z-index: <number>` literal | Use `--ts-z-*` token |
| 19 | Reset rules inside a component file | Move to `core/reset.css` in `@layer base` |

Also add §17 (Layer Discipline) and §18 (Engine vs Consumer Distinction) to the SKILL.

---

## 6 · Suggested next move (one decision)

**One** decision unlocks the biggest amount of forward motion: **D-01 (threshold)**.

Picking it lets us close Phase 2, run visual verification, and proceed to Phase 3 (layer formalization) where the bulk of the architectural work happens.

Recommend resolving D-01 + D-02 together (they're related), then visually verifying the 9 harnesses, then starting Phase 3a (L0 reset) + 3b (L4 app-tokens) in parallel.

---

## HALTED.

No execution. Owner reviews this plan, picks D-01–D-05, and authorizes Phase 3 start.

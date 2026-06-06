# Owner CSS Integration Council — Synthesis

**Date:** 2026-05-25
**HEAD:** f095d75
**Voices:** Design Skeptic · Design Critic · Architect · Pragmatist
**Voice files:** `handoffs/_design-integration-council-{skeptic,critic,architect,pragmatist}.md`
**Status:** Awaiting owner approval. **NO COMMIT until approved (directive §6).**

**Owner picks baked in:**
- Q2 ordering = **verify-first** (ship Q1+borders+color-engine in 3.x; alt-surfaces decided by post-Q1 screenshot)
- B4 bundle = **border port + system/motion.css + owner-notes verification** (per-preset visual verify deferred)
- Q3 location = **primitive rewrap** (rewrap existing `--ts-fs-{4xs..4xl}` family at primitive tier)

---

## 1 — Q1: dark-surface fix (council unanimous)

The current `--ts-this-bg-dark*` chain recesses toward `--ts-tone-floor`, which on dark presets sits within ~2–5 L-points of `--ts-this-bg`. The mix degenerates into a non-step (the `gradDarkPct=100%` bug). Five dark presets collapse to indistinguishable near-blacks — silent identity failure of VQ-5 (the three-knobs proof of concept).

**Fix:** recess toward `oklch(0 0 0)` instead. Pure black is hue-neutral (mixing into a 0-chroma anchor leaves source hue intact). Engine-baked `--ts-this-bg-grad-dark-pct` still decides the amount → RULE 15 honored.

**File:** `assets/css/next/system/surfaces.css`

```diff
- --ts-this-bg-grad-dark-pct:   10%;
+ --ts-this-bg-grad-dark-pct:   14%;  /* RULING 7 dark Lc ≥ 3.0 on all 10 presets */

  /* Subtractive variants — recess toward PURE BLACK pole (NOT floor; floor
   * degenerates on dark presets where bg-1 sits near the floor itself).
   * oklch interpolation preserves source hue; engine-baked pct decides amount. */
- --ts-this-bg-dark:   color-mix(in oklch, var(--ts-this-bg), var(--ts-tone-floor) var(--ts-this-bg-grad-dark-pct));
- --ts-this-bg-dark-1: color-mix(in oklch, var(--ts-this-bg), var(--ts-tone-floor) calc(var(--ts-this-bg-grad-dark-pct) * 0.5));
- --ts-this-bg-dark-2: color-mix(in oklch, var(--ts-this-bg), var(--ts-tone-floor) calc(var(--ts-this-bg-grad-dark-pct) * 0.85));
+ --ts-this-bg-dark:   color-mix(in oklch, var(--ts-this-bg), oklch(0 0 0) var(--ts-this-bg-grad-dark-pct));
+ --ts-this-bg-dark-1: color-mix(in oklch, var(--ts-this-bg), oklch(0 0 0) calc(var(--ts-this-bg-grad-dark-pct) * 0.5));
+ --ts-this-bg-dark-2: color-mix(in oklch, var(--ts-this-bg), oklch(0 0 0) calc(var(--ts-this-bg-grad-dark-pct) * 0.85));

  /* Mirror update — active state has the same floor-degeneracy on dark presets */
- --ts-this-bg-active:   color-mix(in oklch, var(--ts-this-bg), var(--ts-tone-floor) 15%);
+ --ts-this-bg-active:   color-mix(in oklch, var(--ts-this-bg), oklch(0 0 0)         15%);
```

Bright side (`--ts-this-bg-bright*`, L142) **stays as-is** — `--ts-tone-contrast` is text-primary-derived (white-adjacent on dark presets), not degenerate. Asymmetry is intentional.

**Identity guardrail (LOCK COMMENT, add above the block):**
> `/* oklch interpolation space is MANDATORY. Switching to srgb here collapses bichromatic identity on every recession (VQ-7 dies). */`

**Effort:** 15 min (4 line edits + sandbox visual recheck on dark-1/dark-2/dark-3 presets).

---

## 2 — Q2: owner notes integration order (owner pick: VERIFY-FIRST)

The 4 integrations derived from owner notes:

| Integration | Recognition severity | 3-tier impact | Schedule |
|---|---|---|---|
| (a) Color-engine delegation out of general tokens | LOW (architectural, invisible if done right) | Primitive → System inversion fix | **Session 3.x** — merged with B2 accent.css |
| (b) Borders derived from text tokens, NOT currentColor | LOW page / MEDIUM block | System-only (text-pole already correct in surfaces.css L173-179; only `--ts-mix-perc*` literals need RULING 7 re-bake) | **Session 3.x** — port from backup L83-88 |
| (c) Alternating surfaces become contrast-driven | HIGH on dark presets | System tier — replaces static `.ts-section:nth-child(odd/even)` block (surfaces.css L240-325) | **VERIFY-GATED** — see below |
| (d) `.bg-grid` utility class | MEDIUM-HIGH (Rule 5 drop-in pattern) | System tier — utility class on top of existing `--ts-bg-grid-*` tokens | **Session 4+** — non-blocking for Blocks 1-3 |

### The verify gate (owner pick — Pragmatist compromise)

After Q1 dark-surface fix lands, the bg-1/bg-2/bg-3 primitives on dark presets become visibly distinct again. The existing `.ts-section:nth-child` block at L240-325 references `--ts-bg-0`, `--ts-bg-body`, `--ts-bg-1` directly — these are now distinct, so alt-section banding MAY restore without rewrite.

**Verification procedure (do AFTER Q1 ships, BEFORE Block 1):**
1. Open `sandbox/00-design-reference/index.html` in Chrome
2. Switch active preset to `.ts-preset-dark-1`, then `dark-2`, then `dark-3`
3. Eyeball each: do the alt-section stripes have visible contrast against the body background?
4. If YES on all 3 → defer item (c) to Session 5 (sections phase). Document the deferral with the screenshot.
5. If NO on any → promote item (c) to Session 3.x; ship Skeptic's contrast-driven rewrite (use `--ts-this-bg-bright/dark` derivatives, not primitive references).

Critic flagged this as a HIGH recognition risk; the verify gate accepts that risk on owner judgment.

---

## 3 — Q3: font scaling (owner pick: PRIMITIVE REWRAP)

**Verdict (council unanimous): IMPROVE, do NOT replace.**

Rejected unanimously: renaming the `--ts-fs-1..9` numeric ladder to `xs/sm/lg/xl`. The semantic family `--ts-fs-{4xs..4xl}` already exists at `primitives/typography.css` L53-64 — that IS the semantic layer. Role aliases (`--ts-fs-h1..h6`, `body`, `caption`) at L67-87 are the consumer surface. The numeric ladder is the harmonic-ratio engine and stays untouched.

**Mechanism (Architect — owner pick):** rewrap the existing `--ts-fs-{4xs..4xl}` semantic family with `clamp()` for width-awareness, add a `--ts-font-scale` per-scope knob.

**File:** `assets/css/next/primitives/typography.css` (~L53-64 area)

```css
/* Per-scope rescale knob — descendants inherit; rescales all --ts-fs-* tokens */
--ts-font-scale: 1;

/* Multiplicand base (already exists; confirm declaration at ~L49) */
--ts-fs: calc(var(--ts-fs-base) * var(--ts-font-scale));

/* REWRAP semantic family with width-aware clamps. Ratios as floor/ceiling. */
--ts-fs-4xs: clamp(calc(var(--ts-fs) * 0.55), 0.65vw + 0.40rem, calc(var(--ts-fs) * 0.70));
--ts-fs-3xs: clamp(calc(var(--ts-fs) * 0.62), 0.70vw + 0.45rem, calc(var(--ts-fs) * 0.78));
--ts-fs-2xs: clamp(calc(var(--ts-fs) * 0.72), 0.75vw + 0.50rem, calc(var(--ts-fs) * 0.86));
--ts-fs-xs:  clamp(calc(var(--ts-fs) * 0.82), 0.85vw + 0.55rem, calc(var(--ts-fs) * 0.95));
--ts-fs-sm:  clamp(calc(var(--ts-fs) * 0.88), 0.90vw + 0.60rem, calc(var(--ts-fs) * 1.00));
--ts-fs-md:  var(--ts-fs);
--ts-fs-lg:  clamp(calc(var(--ts-fs) * 1.05), 1.10vw + 0.65rem, calc(var(--ts-fs) * 1.18));
--ts-fs-xlg: clamp(calc(var(--ts-fs) * 1.18), 1.30vw + 0.70rem, calc(var(--ts-fs) * 1.36));
--ts-fs-xl:  clamp(calc(var(--ts-fs) * 1.32), 1.55vw + 0.75rem, calc(var(--ts-fs) * 1.55));
--ts-fs-2xl: clamp(calc(var(--ts-fs) * 1.50), 1.95vw + 0.80rem, calc(var(--ts-fs) * 1.78));
--ts-fs-3xl: clamp(calc(var(--ts-fs) * 1.70), 2.50vw + 0.85rem, calc(var(--ts-fs) * 2.05));
--ts-fs-4xl: clamp(calc(var(--ts-fs) * 1.90), 3.20vw + 0.90rem, calc(var(--ts-fs) * 2.35));

/* Role aliases (L67-87) require ZERO change — they already reference the family. */
```

**Per-scope usage:** `.ts-fs-scale-lg { --ts-font-scale: 1.125; }` etc. Any container override rescales every descendant `--ts-fs-*` proportionally because every value is `calc(--ts-fs * …)` and `--ts-fs` resolves at the descendant's scope.

**Audit impact:** `audit-design.mjs` LADDER_PX may need to accept clamp ranges (one-line change, can defer; not a 3.x blocker since role aliases still resolve to single values per scope).

**Effort:** ~30 min (12 token rewraps + audit shim if needed).

---

## 4 — Q4: B1/B2/B3 + B4 bundle (owner pick: border + motion + owner-notes verify)

### Order (council unanimous on B1→B2→B3, with B3 bundleable into B1 commit)

| # | Blocker | Effort | Files | Notes |
|---|---|---|---|---|
| **B1** | Naming reconciliation — primitives rewritten to sandbox vocabulary | ~1h | `assets/css/next/primitives/*.css` (colors, typography, spacing, radius, motion) | **Also includes the Critic-flagged `--ts-grid-scale` → `--ts-bg-grid-scale` rename (1-min, same class of work)** |
| **B2a** | Create `assets/css/next/system/text.css` | ~1h | Extracted from `sandbox/00-design-reference` L35-85 + Q3 primitive rewrap consumed | Blocks Block 1 (ts-input typography) |
| **B2b** | Create `assets/css/next/system/accent.css` (= color-engine delegation from Q2 item a) | ~2h | Tokens: `--ts-accent-{bright,dark,dim,dim-2,border,border-hover,muted,grad,grad-comp,grad-flat}` + `--ts-on-accent*`. Polar mixing toward `oklch(0/1 0 0)`, NOT `--ts-tone-floor`/`--ts-tone-contrast` (same lesson as Q1). | Block 2 (ts-btn) needs full chain; **Block 1 can borrow `--ts-accent` directly from primitives** → B2b parallelizable, not on critical path to Block 1 |
| **B3** | Load JetBrains Mono font in sandbox `<head>` | 5min | `sandbox/00-design-reference/index.html` L16 area — mirror Space Grotesk link tag | **Bundle into B1 commit** (5-min cost, fixes silent Consolas fallback corrupting every visual review from now on) |

### B4 bundle (owner pick — 3 of 4 accepted; per-preset visual VERIFY deferred)

| # | New blocker | Effort | Source voice | Why before Block 1 |
|---|---|---|---|---|
| **B4a** | Border port from `backups/oklch-surface-system-PREVIOUS.css` L83-88 → `assets/css/next/system/surfaces.css` | ~45min | Pragmatist | ts-input requires `--ts-this-bg-border` + `-hover` + `-focus` + `-active` + `-disabled`. Currently the rebuild surfaces.css has partial border tokens at L173-179; the corrected/complete block lives in the backup. Port + harmonize. **Depends on B2a (needs `--ts-text-primary` resolved)** |
| **B4b** | NEW `assets/css/next/system/motion.css` | ~30min | Architect | ts-input animations (focus, hover) consume composed `--ts-trans-default 200ms ease` + easing tokens. Without motion.css, ts-input either inlines literals (cross-tier violation) or composes against scattered primitives. Atomic motion tokens stay in `primitives/motion.css`; composed transitions live in System tier |
| **B4c** | Owner-notes verification pass (grep) | ~20min | Pragmatist | Verify (1) purple-artifact fix is actually in place (`grep -n 'accent.*background-color'` should not match outside accent token block), (2) `.bg-grid` utility class actually exists (if not, defer to Session 4+ per Q2 ordering). Discharges 2 owner notes without code; reveals hidden work if any |

**REJECTED (per owner pick):**
- Per-preset Q1 visual VERIFY (Skeptic, ~30min) — deferred; owner accepts risk that the unanimous Q1 fix + alt-surface verify-first gate provides sufficient confidence

### Documented owner notes — disposition (B-7 compliance)

| Owner note | Disposition | Where |
|---|---|---|
| GLOBAL DIRECTIVE (no inline CSS/JS, no disposable classes) | **Active rule** | `.claude/rules/04-behavior.md` covers; enforced by audit gates |
| COLOR core knobs (delegate to engine) | **Acted** | B2b (color-engine delegation) |
| COLOR theme-toggle breakage | **Encoded as decision** | `decisions/color-system.md` |
| SURFACES dark default conflict | **Acted** | Q1 fix |
| BORDERS @CRITICAL (no currentColor) | **Acted** | B4a (border port from backup) |
| PADDING SCALING ENGINE | **Deferred — Session 5** | Logged reason: no Block 1-5 component needs harmonic-ratio padding; existing `--ts-sp-*` ladder sufficient. Schedule council in Session 5 |
| ALTERNATING SURFACE SYSTEM (experimental) | **Verify-gated** | Q2 item (c) — post-Q1 screenshot decides 3.x vs Session 5 |
| PURPLE ARTIFACT (FIXED) | **Verify** | B4c |
| GRID BACKGROUND SYSTEM | **Verify** | B4c — verify `.bg-grid` utility exists; if not, build it in Session 4+ |
| LAYOUT FAILURE @OWNER_REVIEW | **Active rule** | Enforced per-deliverable by dual-audit gates (audit-boring + audit-design); not a system blocker |
| END-OF-ISOLATED-SCOPE bento | **Deferred — Session 4+** | Logged reason: no Block 1-3 component touches it; resolve when sections phase opens |

---

## 5 — Critical path to Block 1 (ts-input)

Single-agent serial, with one parallel agent on B2b (accent.css):

| Step | Item | Effort | Depends on |
|---|---|---|---|
| 1 | **B1 + B3 bundled commit:** primitives rewritten to sandbox vocabulary (`--ts-fs-base`, `--ts-fw-*`, `--ts-sp-N`, etc.); JetBrains Mono `<link>` added to sandbox; `--ts-grid-scale` → `--ts-bg-grid-scale` rename | 1h 5min | — |
| 2 | **Q1 dark-surface fix:** edit `system/surfaces.css` L131-133 + L146 + L51 (knob bump to 14%) + lock comment | 15min | B1 (so vocabulary matches) |
| 3 | **Verify alt-surfaces on dark presets:** screenshot dark-1/dark-2/dark-3 in `sandbox/00-design-reference`; record verdict on Q2 item (c) | 15min (incl. screenshot) | Step 2 |
| 4 | **B4c owner-notes verification pass:** grep purple-artifact + `.bg-grid` utility existence | 20min | — (parallelizable with steps 1-3) |
| 5 | **B2a system/text.css:** extract typography tokens from sandbox L35-85; consume the now-fluid `--ts-fs-{4xs..4xl}` primitive family (Q3 primitive rewrap done in this step) | 1h | B1 |
| 6 | **B4a border port:** copy backup L83-88 border block into `system/surfaces.css`; remove duplicate/stale border declarations | 45min | B2a (text-primary needed) |
| 7 | **B4b NEW system/motion.css:** extract `--ts-trans-default` + easing tokens | 30min | B1 |
| 8 | **Audit + commit gate:** run `audit-design.mjs` on touched files; pre-commit dual gate; commit the Session 3.x bundle | 30min | All above |

**Total wall-clock to Block 1 entry:** **~4h 40min** (single-agent serial).

With one parallel agent on **B2b accent.css** during steps 5-7: same ~4h 40min on critical path; B2b lands free for Block 2 entry.

---

## 6 — Deferred items (logged reasons, not forgotten)

- **B2b accent.css (full version):** Block 1 (ts-input) focus ring can borrow `--ts-accent` directly from primitives. Full bright/dark/dim/border chain is Block 2 (ts-btn) territory. Build after Block 1 ships.
- **Alt-surface system rewrite (Q2 item c):** verify-gated post-Q1; defer to Session 5 if verification passes.
- **`.bg-grid` utility (Q2 item d):** Session 4+. No Block 1-3 component needs it; gates only when hero/landing surfaces (Block 5+) come online.
- **Padding scaling engine:** Session 5 council review.
- **Semantic font-size rename (xs/sm/lg/xl on numeric ladder):** REJECTED by council unanimously. Not scheduled.
- **RULING 7 per-preset engine bake (`generate-colors.js`):** PARALLEL TRACK, not blocking. Continues alongside Session 4 block work.
- **`audit-design.mjs` LADDER_PX clamp-range support:** one-line audit shim; defer until any clamp value actually fails the audit.
- **Architect-flagged 5 secondary srgb violations in surfaces.css** (L268, L283, L292, L319, L331 — all `color-mix(in srgb, …)`): bundle into Q2 item (c) cleanup if alt-surfaces gets promoted to 3.x; otherwise carry into Session 5 with the alt-surface rewrite.
- **Cross-tier coupling violation surfaces.css L292** (Architect VIOLATION 4 — gradient reaches past `--ts-this-bg-*` to a different primitive `--ts-bg-body`): bundle with item above.

---

## 7 — Identity invariants this integration MUST preserve (council consensus)

1. **OKLCH-as-interpolation-space is non-negotiable** — every `color-mix` in system/* uses `in oklch`. The Q1 lock comment makes this explicit. Audit rule already enforces.
2. **Three-knob promise** — `--ts-accent-h/-s/-l` change → whole UI repaints. The Q1 fix preserves this; the B2b accent.css MUST also preserve this by NEVER baking literal hues outside the engine.
3. **Bichromatic, not monochromatic** — `--ts-alt` must be declared and used in hero radial atmospheres. Single-accent surfaces are a regression even if audit-clean (VQ-7).
4. **Harmonic ratio survives semantic layering** — `--ts-fs-{xs..4xl}` is the semantic family; `--ts-fs-h1..h6` is the role family; numeric ladder is the ratio engine. Three layers, never collapse.
5. **Mono-as-machine-voice (VQ-2)** — JetBrains Mono LOADED (B3), not just declared. Section chrome `/ 01` in mono with leading slash (VQ-8).
6. **Surface superposition under compositional pressure (VQ-6)** — bento with one accent-painted tile; alt-section banding distinguishable on every preset (verify-gated).

---

## 8 — HALT for owner approval (per directive §6)

This synthesis is the plan. **NO file changes have been made** beyond the 4 voice files and this synthesis. The owner-WIP modified CSS files from the day's hand-fixing are still in the working tree untouched (REFERENCE ONLY per directive §2).

**On owner GO, the next dispatch (STEP 4) executes the critical-path table in §5 above** — single sub-agent (or parallel pair for B2b) per the dispatch goal.

**On owner REVISE, this synthesis updates and re-presents** — no commit until approval.

**On owner REJECT** (e.g. fundamental gap surfaced), council re-convenes with a narrower question.

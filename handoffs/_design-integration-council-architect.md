# Council voice — Architect
**Author:** Architect
**Date:** 2026-05-25
**HEAD:** f095d75

## Three-tier audit framework (1-paragraph framing)

Every position below is judged against the canonical tier split: **Primitive** (raw atomic values — colors, font ramps, spacing scale, radii), **System** (composed, theme-aware tokens that reference only primitives — `--ts-this-bg-*`, `--ts-text-*`, `--ts-accent-*`), **Component** (single-component custom props like `--btn-bg` that reference only system tokens). RULING 7 fences this further: any constant inside a system-tier `color-mix` percentage MUST be either an engine-baked variable (`--ts-this-bg-grad-dark-pct` etc.) or a literal traceable to the RULING 7 constant table (dark Lc 8, bright Lc 6, hover Lc 12, active Lc 8, disabled Lc 18, border-rest Lc 15, border-hover/active Lc 30, border-0/disabled Lc 8, text 75/45/25). A literal anywhere else, or a cross-tier reference (e.g. a primitive that depends on a system token, or a system token computed from a component custom prop), is a violation. I flag each below by tier and by which RULING 7 row applies.

## Q1 — Dark-surface fix — EXACT DIFF

**File:** `assets/css/next/system/surfaces.css`

**Old lines (L130–L133):**
```css
  /* Subtractive variants — recess toward the (hue-locked) floor pole (spec §3.2) */
  --ts-this-bg-dark:   color-mix(in oklch, var(--ts-this-bg), var(--ts-tone-floor) var(--ts-this-bg-grad-dark-pct));
  --ts-this-bg-dark-1: color-mix(in oklch, var(--ts-this-bg), var(--ts-tone-floor) calc(var(--ts-this-bg-grad-dark-pct) * 0.5));
  --ts-this-bg-dark-2: color-mix(in oklch, var(--ts-this-bg), var(--ts-tone-floor) calc(var(--ts-this-bg-grad-dark-pct) * 0.85));
```

**New lines:**
```css
  /* Subtractive variants — recess toward PURE BLACK pole (RULING 7 dark Lc 8).
     Mixing toward --ts-tone-floor degenerates on dark presets where bg-1 and
     bg-body sit within ~2-5 L-points: the percentage knob then yields a step
     too small to see (the gradDarkPct=100% degeneracy). Pure black is the
     stable lower pole regardless of preset; the engine-baked
     --ts-this-bg-grad-dark-pct decides the AMOUNT, the CSS only composes. */
  --ts-this-bg-dark:   color-mix(in oklch, var(--ts-this-bg), oklch(0 0 0) var(--ts-this-bg-grad-dark-pct));
  --ts-this-bg-dark-1: color-mix(in oklch, var(--ts-this-bg), oklch(0 0 0) calc(var(--ts-this-bg-grad-dark-pct) * 0.5));
  --ts-this-bg-dark-2: color-mix(in oklch, var(--ts-this-bg), oklch(0 0 0) calc(var(--ts-this-bg-grad-dark-pct) * 0.85));
```

**Bright pole — same audit, NO edit required.** L142 already mixes toward `--ts-tone-contrast` (text-primary), which on dark presets is white-adjacent and therefore a valid bright pole. The asymmetry is correct: on dark presets `tone-contrast ≈ white`, while `tone-floor ≈ bg-body` which is already near-black, so floor-mixing collapses. Pure-black anchor on the dark side restores symmetry with white-adjacent on the bright side.

**Three-tier compliance:**
- Primitive tier: `oklch(0 0 0)` is a primitive literal (atomic color, not a token reference). Permissible at **System** tier as a fixed mix pole because it carries zero semantic meaning — it is the absolute black anchor, exactly analogous to `transparent` used at L136–139. No tier inversion.
- System tier: the percentage is `var(--ts-this-bg-grad-dark-pct)` — an engine-baked knob declared at L51. CSS composes; the engine decides the amount. RULE 15 honored.
- Component tier: untouched. `--ts-this-bg` is still the single component-set anchor; the derivatives still propagate via `:where(:root, :root *)`.

**RULING 7 citation:** the `--ts-this-bg-grad-dark-pct: 10%` default at L51 must remain the engine's responsibility — the Pattern-16 Option B per-preset bake (parallel track, not blocking) calibrates this to RULING 7 **dark Lc 8** per preset. The CSS edit above changes only the *pole*, not the *amount*. The amount remains the engine's job, so RULE 15 / R7 ("engine decides amounts") is preserved exactly.

**Secondary FAIL to record (not in this diff, audit row to file):** L268, L283, L292, L319, L331 still contain `color-mix(in srgb, …)` — direct violation of audit/checklist.md row 2. Out of scope for the dark-surface fix; queue under Q2 cleanup.

## Q2 — Owner notes integration order

**Session 3.x (must land before any Session 4 block):**

1. **Color-engine delegation** — file: NEW `assets/css/next/system/color-engine.css` (or split `accent.css` per B2). Tokens: `--ts-accent-*` family (`-bright`, `-dark`, `-dim`, `-dim-2/3`, `-border`, `-border-hover`, `-muted`, `-grad`, `-grad-comp`, `-grad-flat`) + `--ts-on-accent*` family. Currently these are scattered between `primitives/colors.css` and missing entirely. Move OKLCH derivation chains OUT of `primitives/colors.css` (which should hold only the 10-preset bake + auto-ink) INTO the system layer. **3-tier impact:** removes a **Primitive → System inversion** (currently the primitive file declares state variants that are semantically system tier). Primitive becomes pure atomic; System owns derivation; Component consumes.

2. **Borders-from-text** — file: `assets/css/next/system/surfaces.css` L173–179 already correctly mixes toward `--ts-tone-contrast` (text-primary pole via hue-stripped anchor). Tokens: `--ts-this-bg-border*` namespace + new `--ts-mix-perc*` knobs (L52–60). **Engine bake required:** the literal `--ts-mix-perc: 10%` (L52) and family must be re-baked to RULING 7 (`border-rest Lc 15` → likely 13–17% depending on preset, `border-hover Lc 30` → 22–28%, `border-disabled Lc 8` → ~8%, `border-0 Lc 8` → ~8%). Owner @CRITICAL banishment of `currentColor` is already structurally honored — grep returned zero matches in the system layer (verified via the audit). **3-tier impact:** System-only change. No primitive touch, no component touch. Owner's "borders must NOT rely on currentColor" rule is enforced by the existing `var(--ts-tone-contrast)` pole, NOT by `currentColor`.

**Session 4+ (after blocks come online — they need real surfaces to validate against):**

3. **Contrast-driven alternating surfaces** — file: NEW `assets/css/next/system/section-alt.css` (or new section inside `surfaces.css` L240–325 which already prototypes the alt-section logic). Tokens: NEW `--ts-section-tier`, `--ts-section-alt-step`. Replaces current static `.ts-section--alt`-style rules at L240–325. **3-tier impact:** introduces a **System tier** state token that responds to nesting depth via container query / parent-selector cascade. Owner's note explicitly requires "theme-agnostic (no light/dark branching)" — the implementation must be a single contrast-calc rule that flips based on parent surface luminance, not via `[data-theme=dark]` branching. **Cross-tier coupling risk:** if section-alt reads a component custom prop, it inverts. Resolution: section-alt computes only from `--ts-this-bg` (system) and emits a derived `--ts-this-bg` for descendants.

4. **`.bg-grid` tokenization** — file: `assets/css/next/system/surfaces.css` L77–125 already declares the `--ts-bg-grid-*` knob family and the `--ts-bg-grid-pattern`. Missing: the `.bg-grid` utility class itself. Add to END of `surfaces.css` (or split to NEW `assets/css/next/system/grid.css`):
```css
.bg-grid { background-image: var(--ts-bg-grid-pattern); }
```
Tokens already correct namespace: `--ts-bg-grid-base/size/mix/col1/col2/line/pattern`. **3-tier impact:** System tier (utility). **Violation to fix in same pass:** L115 uses `color-mix(in srgb, …)` — must convert to `in oklch` to match audit row 2.

**Cross-tier coupling violation found while ordering:** L292 reads `var(--ts-this-bg-dark-1)` from inside a `linear-gradient` that ALSO references `var(--ts-bg-body)` and uses `in srgb` — three problems in one rule (srgb, mixed-tier pole reference, hardcoded inside a `--ts-this-bg-*` consuming class). Schedule fix in Q4 / new blocker section.

## Q3 — Font scaling

**Improve OR replace:** **IMPROVE.** Hard reasons:
- `primitives/typography.css` L53–64 ALREADY declares semantic aliases `--ts-fs-{4xs..4xl}` computed as `calc(var(--ts-fs) * ratio)`. The semantic naming the owner asks for is largely present at the primitive tier. The numeric ladder `--ts-fs--2..--ts-fs-9` is the GAP, not the semantic family.
- L73–80 ALREADY uses `clamp(min, vw, max)` for `h1/h2/h3` and `display-md/lg/xl`. The width-aware mechanism is partially present; what's missing is `--ts-fs-scale` per-scope and a unified clamp pattern for the SEMANTIC family (xs..4xl), not the role aliases.
- Replacing the ladder would invalidate `audit-design.mjs`'s `LADDER_PX` array and break every existing component CSS reference. The cost is mechanical disruption with no architectural win. Improving = additive.

**Three-tier compliance:** semantic units (xs/sm/lg/xl) at Primitive tier are LEGAL because they are mathematical expressions on a primitive base (`--ts-fs-base × ratio^n`). The naming is semantic; the values are primitive. No tier violation. Role aliases (`--ts-fs-h1`, `--ts-fs-body`, `--ts-fs-caption`) at L67–87 are correctly System-tier (they reference primitives — clean). DO NOT introduce ad-hoc semantic tokens at the System tier — that would re-introduce the same primitive logic at the wrong layer.

**Minimum adoption scope:**
- File: `assets/css/next/primitives/typography.css` — add `--ts-font-scale` root knob (currently L49 references it as if defined but I cannot confirm declaration without re-reading the file).
- File: `assets/css/next/primitives/typography.css` — re-wrap the existing semantic family L53–64 with clamps to make them width-aware fluid (not just ratio-multiplied static).
- Tokens affected: `--ts-fs-{4xs..4xl}` only. Role aliases (`--ts-fs-h1..h6`, `-body`, `-caption`, `-display-*`) untouched — they already alias correctly.
- Tokens NOT to touch: `--ts-fs-base`, `--ts-fs-ratio`, `--ts-fs-display-ratio` (primitive constants; per RULING 3 OVERRIDE only mathematical stability matters, and changing these breaks the ladder for components downstream).

**EXACT alias mapping proposal:**
```css
/* assets/css/next/primitives/typography.css :root, additions / replacements */

/* Per-scope scale knob — descendants inherit; rescales all --ts-fs-* smoothly */
--ts-font-scale: 1;

/* The unit base (already exists at L49) — keep as the multiplicand */
--ts-fs: calc(var(--ts-fs-base) * var(--ts-font-scale));

/* REPLACE semantic family with width-aware clamps (additive: keep ratios as fallback floor/ceiling) */
--ts-fs-4xs: clamp(calc(var(--ts-fs) * 0.55),  0.65vw + 0.40rem, calc(var(--ts-fs) * 0.70));
--ts-fs-3xs: clamp(calc(var(--ts-fs) * 0.62),  0.70vw + 0.45rem, calc(var(--ts-fs) * 0.78));
--ts-fs-2xs: clamp(calc(var(--ts-fs) * 0.72),  0.75vw + 0.50rem, calc(var(--ts-fs) * 0.86));
--ts-fs-xs:  clamp(calc(var(--ts-fs) * 0.82),  0.85vw + 0.55rem, calc(var(--ts-fs) * 0.95));
--ts-fs-sm:  clamp(calc(var(--ts-fs) * 0.88),  0.90vw + 0.60rem, calc(var(--ts-fs) * 1.00));
--ts-fs-md:  var(--ts-fs);
--ts-fs-lg:  clamp(calc(var(--ts-fs) * 1.05),  1.10vw + 0.65rem, calc(var(--ts-fs) * 1.18));
--ts-fs-xlg: clamp(calc(var(--ts-fs) * 1.18),  1.30vw + 0.70rem, calc(var(--ts-fs) * 1.36));
--ts-fs-xl:  clamp(calc(var(--ts-fs) * 1.32),  1.55vw + 0.75rem, calc(var(--ts-fs) * 1.55));
--ts-fs-2xl: clamp(calc(var(--ts-fs) * 1.50),  1.95vw + 0.80rem, calc(var(--ts-fs) * 1.78));
--ts-fs-3xl: clamp(calc(var(--ts-fs) * 1.70),  2.50vw + 0.85rem, calc(var(--ts-fs) * 2.05));
--ts-fs-4xl: clamp(calc(var(--ts-fs) * 1.90),  3.20vw + 0.90rem, calc(var(--ts-fs) * 2.35));

/* Role aliases (L67–87) require ZERO change — they already reference the semantic family. */
```
Per-scope usage: any container that sets `--ts-font-scale: 1.15` rescales every descendant `--ts-fs-*` proportionally because every value is `calc(--ts-fs * …)` and `--ts-fs` resolves at the descendant's scope. Token inheritance preserved.

`audit-design.mjs` LADDER_PX impact: must be updated to accept ranges (min/preferred/max) rather than single values. Out of scope here — flag for the auditor track. NOT a Session-3.x blocker because role aliases still resolve to single values via clamp.

## Q4 — B1/B2/B3 audit

**B1 (naming reconciliation) — CONFIRM, with addition.**
Files that change: `assets/css/next/primitives/colors.css`, `assets/css/next/primitives/typography.css`, `assets/css/next/primitives/spacing.css`, `assets/css/next/primitives/radius.css`, `assets/css/next/primitives/motion.css`. The sandbox vocabulary (`--ts-fs-base`, `--ts-fw-thin`, `--ts-sp-N`) wins. ADDITION: the existing typography.css already uses `--ts-fs-base` and `--ts-fs-*` semantic family — verify the OTHER primitive files don't have orphan `--ts-font-weight-thin`-style names; those must be renamed to the sandbox `--ts-fw-*` shorthand or the components will fail-resolve silently.

**B2 (text.css + accent.css) — CONFIRM, with consolidation note.**
Files: NEW `assets/css/next/system/text.css`, NEW `assets/css/next/system/accent.css`. The text.css extraction is non-controversial. The accent.css extraction MUST consume Q2 integration #1 (color-engine delegation) — they are the same edit, NOT two. **Avoid double work:** ship accent.css = the color-engine file. Tokens: `--ts-accent-bright/dark/dim/dim-2/border/border-hover/muted/grad/grad-comp/grad-flat` + `--ts-on-accent*`. Polar mixing must be `oklch(0 0 0)` and `oklch(1 0 0)` (NOT `srgb`, NOT `hsl`, NOT `--ts-tone-floor` — same Q1 lesson generalizes here: accent-dark recessing toward `tone-floor` would degenerate on dark presets the same way).

**B3 (mono load) — CONFIRM, one-line fix path.**
File: the `<link rel="stylesheet">` block in the sandbox HTML (L16 currently loads Space Grotesk only). One-line addition for JetBrains Mono. The fix is mechanical — not a system-layer concern, no token impact, no tier touch.

**Order verdict:**
1. **B1** (naming reconciliation) — must land FIRST because B2 will write `--ts-fs-*` and `--ts-fw-*` and `--ts-sp-*` references that must already resolve in primitives.
2. **B2** (text.css + accent.css, merged with color-engine delegation from Q2) — System tier extraction; CANNOT precede B1 or it composes against vocabulary that may shift.
3. **B3** (mono load) — trivial, can run in parallel to either; place last only so it's not forgotten.

This matches `decisions/system-layer-status.md` L41–51's order. CONFIRMED.

**New blocker (B4 — Architect-flagged):**
**Missing file:** `assets/css/next/system/shape.css` AND `assets/css/next/system/motion.css` AND `assets/css/next/system/spacing.css` (the "four Tier-2 files" mentioned in decisions/system-layer-status.md L53–56 are real). Without them, components that consume `--ts-radius-*`, `--ts-ease-*`, `--ts-dur-*`, `--ts-sp-section-pad` will compose directly off primitives — a Primitive → Component reach that skips System tier (architecturally a violation but tolerable for atomic values).

**Verdict:** primitive→component direct reach is legal for **atomic** tokens (one primitive = one value, no composition). For `--ts-radius-*` and `--ts-sp-*`, primitives suffice; explicit system files NOT required. For motion, the spec-defined transitions (`--ts-trans-default: 200ms ease`) ARE composed and SHOULD live at System tier — NEW `assets/css/next/system/motion.css` is a real blocker for blocks that animate (input focus, btn hover). **Add B4 = `system/motion.css`** before Session 4 block 1 (ts-input needs `--ts-trans-default`).

Estimated B4 effort: ~30 min (extract composed transitions from sandbox, name per RULING 7 convention if applicable).

## Cross-tier coupling violations identified (concrete list, none acceptable)

- **VIOLATION 1** — `assets/css/next/system/surfaces.css` L131–133: dark recession toward `--ts-tone-floor` (degeneracy bug). **Fix:** Q1 diff above (recess toward `oklch(0 0 0)`).
- **VIOLATION 2** — `assets/css/next/system/surfaces.css` L115: `color-mix(in srgb, …)` for grid line. **Fix:** change to `in oklch`.
- **VIOLATION 3** — `assets/css/next/system/surfaces.css` L268, L283, L292, L319, L331: five `color-mix(in srgb, …)` in alt-section gradients. **Fix:** change all to `in oklch`. Cite: audit/checklist.md row 2.
- **VIOLATION 4** — `assets/css/next/system/surfaces.css` L292: composes `--ts-this-bg-dark-1` with `--ts-bg-body` (a primitive) inside the same gradient. The component-context override at L287 set `--ts-this-bg: var(--ts-bg-2)`, but the rule then reaches past `--ts-this-bg-*` to a different primitive (`--ts-bg-body`) — breaks the "component sets ONE token" contract (surfaces.css L7). **Fix:** replace `var(--ts-bg-body)` with `var(--ts-this-bg-dark-2)` or move the rule outside the alt-section block.
- **VIOLATION 5** — `assets/css/next/primitives/colors.css` (suspected per decisions/color-system.md): the accent state derivatives (`-bright`, `-dark`, `-dim`, `-border`, etc.) belong at System tier, not Primitive. **Fix:** Q2 integration #1 / B2 merger.
- **VIOLATION 6** — `assets/css/next/system/surfaces.css` L331: `border-color: color-mix(in srgb, var(--ts-accent), var(--ts-bg-body) 25%)`. Both srgb violation AND a literal mix percentage (25%) that should be an engine-baked knob (likely `--ts-accent-border` from B2). **Fix:** replace with `var(--ts-this-bg-border-active)` or `var(--ts-accent-border)` from the new accent.css.

---

COUNCIL VOICE COMPLETE — Architect — handoffs/_design-integration-council-architect.md

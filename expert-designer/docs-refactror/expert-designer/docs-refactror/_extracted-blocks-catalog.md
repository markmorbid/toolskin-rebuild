# Toolskin Extracted Blocks — Full Catalog

Concatenation of the 7 owner-extracted-block section catalogs (chunks 1–5b), Session 3–4.

**Sections in order:**
- 1: Surface architecture
- 2: Layout utilities
- 3: Effects + special sections
- 4a: Components ≤17KB (16 files)
- 4b: Components ≥19KB (11 files)
- 5a: Views — small (3 files)
- 5b: Views — large GREP-ONLY (3 files)

---

# Extracted Blocks Catalog — Section 1: Surface Architecture

**Sub-agent:** 1  ·  **Chunk:** root surface files  ·  **Files:** 3  ·  **Total bytes:** ~84,309
**Source folder:** `docs/references/toolskin.css_extracted-core-blocks-to-refactor/`
**Existing catalog cross-referenced:** `docs/handoffs/_code-audit-catalog.md` (958 lines)

## Files in this chunk

| File | Lines | Bytes | Block type |
|---|---|---|---|
| `ts-surface.css` | 106 | 3,335 | Surface architecture (class engine + `.ts-surface-*` family) |
| `root-tokens-blocks-reference.css` | 985 | 53,115 | Token definitions (`§1` design tokens — full primitive→system layer) |
| `surface-alt-nested-...css` | 799 | 27,859 | Surface design pattern + section/card/input alternation engine (annotated owner spec) |

---

## Per-file catalog

### `ts-surface.css`

- **Path:** `docs/references/toolskin.css_extracted-core-blocks-to-refactor/ts-surface.css`
- **Lines:** 106  ·  **Bytes:** 3,335
- **Block type:** Surface architecture — class engine and four surface variants
- **Structural anchor:** `§5 SURFACES & DEPTH` → `§5a Surface Classes`
- **Key tokens declared** (set within rule bodies, not at `:root`):
  - `--ts-this-bg-surface` (set per `.ts-surface-N`)
  - `--ts-backdrop-sat: 1.4` and `--ts-backdrop-blur: 10px` (inside `.ts-surface-glass`)
  - `--ts-grid-w: 50px` (inside `.ts-surface-grid`)
- **Key tokens consumed:** `--ts-this-bg`, `--ts-this-bg-border`, `--ts-this-bg-border-0`, `--ts-this-bg-border-hover`, `--ts-this-bg-dim`, `--ts-this-bg-dim-2`, `--ts-this-bg-dim-3`, `--ts-this-bg-dim-4`, `--ts-this-bg-hover`, `--ts-this-bg-bright-1`, `--ts-bg-0..5`, `--ts-bg-body`, `--ts-text-primary`, `--ts-radius-lg`, `--ts-accent`, `--ts-info`, `--ts-success`, `--ts-border-accent`.
- **Key classes defined:**
  - `[class^="ts-surface-"]` attribute selector (the canonical surface class engine, lines 8–37) — sets `background-color`, `border-color`, `outline-color`, `--ts-this-bg` from `--ts-this-bg-surface`; declares nested `&.ts-dim-1..4` modifiers and `&:hover` state.
  - `.ts-surface-0` … `.ts-surface-5` (lines 39–61) — six depth steps, each only sets `--ts-this-bg-surface: var(--ts-bg-N)`.
  - `.ts-surface` (lines 63–66) — body baseline; sets `--ts-this-bg: var(--ts-bg-body)` and `color: var(--ts-text-primary)`.
  - `.ts-surface-glass` (lines 69–78) — glass morphism: `color-mix` background, border, `border-radius: var(--ts-radius-lg)`, `backdrop-filter` blur + saturate, plus locally-scoped `--ts-backdrop-sat`, `--ts-backdrop-blur`, `--ts-this-bg-surface: var(--ts-bg-1)`.
  - `.ts-surface-gradient` (lines 80–88) — radial + linear gradient using `--ts-accent`, `--ts-this-bg`, `--ts-this-bg-bright-1`; border via `--ts-border-accent`.
  - `.ts-surface-mesh` (lines 90–97) — three layered radial gradients (accent / info / success) over `--ts-this-bg`.
  - `.ts-surface-grid` (lines 99–106) — `repeating-linear-gradient` overlay at 0deg/90deg with hardcoded `rgba(255, 255, 255, 0.04)` lines, on top of `--ts-this-bg`; sets local `--ts-grid-w: 50px`.
  - Modifier classes consumed via `&` nesting: `.ts-dim-1`, `.ts-dim-2`, `.ts-dim-3`, `.ts-dim-4`.
- **Owner annotations VERBATIM with line numbers:**
  - `L2-4:` `/* ═══════════════════════════════════════════════════════════════════════ §5  SURFACES & DEPTH ═══════════════════════════════════════════════════════════════════════ */`
  - `L6:` `/* ─── §5a  Surface Classes ──────────────────────────────────────────── */`
  - (No inline `OWNER FIX`, `REFACTOR`, `TODO`, `FIXME`, `NOTE`, `WARNING`, `HACK` annotations were found in this file — it is structural code with section headers only.)
- **Refactor flags:** No explicit refactor notes. Implicit issues for council attention:
  1. Hardcoded `rgba(255, 255, 255, 0.04)` in `.ts-surface-grid` lines 103–104 bypasses the surface superposition engine — should derive from `--ts-this-bg-border-0` or similar.
  2. `.ts-surface-glass` redeclares its own `--ts-backdrop-sat` / `--ts-backdrop-blur` but `root-tokens-blocks-reference.css` already declares global `--ts-backdrop-blur: 8px` and `--ts-backdrop-blur-2`. Two sources of truth.
  3. `.ts-surface-mesh` uses `--ts-accent`, `--ts-info`, `--ts-success` directly inside `color-mix` — these are status colors used as decorative gradient stops; locks the mesh look to the global accent palette.
  4. `.ts-surface-grid` overrides `--ts-this-bg-surface` to `--ts-bg-body` (line 101) — the only `.ts-surface-*` variant that re-routes to body, hardwiring it to the page baseline.
- **Session 3 relationship:**
  - **Directly informs the committed `surfaces.css` (a0ea9e4).** Lines 8–61 are the canonical `--ts-this-bg-surface` → `--ts-this-bg` propagation pattern the rebuild has already encoded. Hue-lock work in commits `95c1b5f`, `a0ea9e4` was specifically to make this propagation hold under chromatic surfaces.
  - The four "decorative" surface variants (`-glass`, `-gradient`, `-mesh`, `-grid`) are NOT yet in the rebuild's `surfaces.css` — they sit downstream of the base engine and are candidates for a future `surfaces-decorative.css` block (Phase 2/3).
  - The `&.ts-dim-1..4` nested modifiers (lines 16–30) and `&:hover` (lines 32–36) are part of the Tier-2 surface state contract — must be preserved when the rebuild evolves the surface state system.
- **Gap vs `_code-audit-catalog.md`:**
  - **(a) Already covered:** `_code-audit-catalog.md:577` lists `.ts-surface-0..5`, `.ts-surface`, `.ts-surface-glass/-gradient/-mesh/-grid` as part of the components catalog. §4.3 (line 524 onwards) catalogs the `--ts-this-bg` derivative engine.
  - **(b) NEW in this file:** the **explicit `[class^="ts-surface-"]` attribute-selector implementation** (lines 8–37) including the `&.ts-dim-1..4` nested modifiers and `&:hover` — none of these are spelled out in `_code-audit-catalog.md`. The `.ts-dim-1..4` modifier contract is a missing piece of the surface state model.
  - **(c) Contradictions:** none with the catalog. Confirms catalog entries.

---

### `root-tokens-blocks-reference.css`

- **Path:** `docs/references/toolskin.css_extracted-core-blocks-to-refactor/root-tokens-blocks-reference.css`
- **Lines:** 985  ·  **Bytes:** 53,115
- **Block type:** Token definitions — `§1 Design Tokens` complete dump, primitives → system → component layers, plus a second `:where(:root, :root *)` block that contains the `--ts-this-bg` derivative engine.
- **Structural anchors (sections):**
  - `§1a Accent / Color Engine` (lines 7–98) — accent HSL primitives + dim/border tints, alt accent, color palette, tree accent (special), color variants, color borders, status colors.
  - `§1b Surface & Background Scale` (lines 99–133) — `--ts-bg-body / -0..5`, transparent variants, glass morphism, radial depth, accent glow.
  - `§1c Border System` (lines 134–147) — `--ts-border-0..4`, `-accent`, `-alt`.
  - `§1d Typography` (lines 148–190) — fonts, weights, line heights, letter spacing, eyebrow primitives.
  - `§1d.2 Harmonic Font Size Scale` (lines 192–285) — `--ts-fs-base`, `-ratio`, `-display-ratio`, body ramp, heading hierarchy, display sizes, body aliases, legacy aliases.
  - `§1e Spacing Scale (Tiered + Modular)` (lines 287–391) — primitives, derived, micro tier (1–4), component tier (5–9), layout tier (10–16), the broken sp-17..24 series.
  - `§1f Radius Scale` (lines 394–411).
  - `§1f-nest Nest-Reduction Tokens (NEW-B16)` (lines 413–420).
  - `§1g Shadow Scale` (lines 422–447).
  - `§1h Z-index Stack` (lines 449–462).
  - `§1i Animation Tokens` (lines 464–480).
  - `§1j Layout Tokens` (lines 482–489).
  - `§1k Component-level Tokens` (lines 491–654) — button, input system, card, range, panel, topbar, sidebar, log, text colors, cursor, scrollbar, tabs, checkbox, resizer, preloader, btn-base-transitions.
  - `ROOT 1b — Semantic Color Palette` (lines 656–722) — 7-family `--ts-color-*` namespace (primary/secondary/success/warning/error/info/disabled) each with `-dim / -bright / -dark`; back-compat aliases.
  - **Accent / status / neutral ramps** (lines 724–778) — `--ts-accent-50..900`, success/warning/danger/info 50/100/300/500/700/900, neutral 50..900.
  - **Grid background system** (lines 780+) — `--ts-bg-grid-*`.
  - `:root` block at 799 — UI select dropdown tokens (`--ts-ui-select-dd-*`).
  - **`:where(:root, :root *)` block at line 824** — the `--ts-this-bg` derivative engine: button scaling, accent tokens, `--ts-this-bg` ladder (bright/dark/dim), gradient control, border state via `--ts-mix-perc`, auto text-on-surface via OKLCH.
- **Key tokens declared (deduplicated, by family):**
  - **Accent HSL primitives:** `--ts-accent-h`, `-s`, `-l`, `--ts-accent`. Dim ladder: `--ts-accent-dim`, `-dim-0..6`. Border: `--ts-accent-border`.
  - **Alt accent:** `--ts-accent-alt-h/-s/-l/-alt/-dim/-border`.
  - **Tree accent (special):** `--ts-accent-tree-h/-s/-l/-tree/-dim/-border`.
  - **Color palette:** `--ts-orange`, `--ts-blue`, `--ts-green`, `--ts-red`, `--ts-yellow`, `--ts-purple`, `--ts-pink`, `--ts-gray`. Each with `-dim` and `-border` variants.
  - **Status colors:** `--ts-success`, `--ts-warning`, `--ts-danger`, `--ts-info` and `-dim` variants.
  - **Background scale:** `--ts-bg-body`, `--ts-bg-0..5`, transparent `--ts-bg-0-t..4-t`, `--ts-bg-overlay`.
  - **Glass tokens:** `--ts-glass-subtle/-medium/-strong/-border/-border-strong`.
  - **Radial / glow:** `--ts-radial-depth`, `--ts-accent-glow-bg`, `--ts-accent-glow-bg-2`, `--ts-accent-glow-bg-3`.
  - **Borders:** `--ts-border-0..4`, `--ts-border-accent`, `--ts-border-alt`.
  - **Typography:** `--ts-font-display`, `--ts-font-body`, `--ts-font-mono`, `--ts-fontawesome-family`, `--ts-font-weight-thin/-normal/-medium/-semibold/-bold/-black`, `--ts-line-height-none/-display/-tight/-snug/-normal/-relaxed/-loose/-very-loose`, `--ts-letter-spacing-tight/-normal/-wide/-wider`, `--ts-fs-eyebrow`, `--ts-letter-spacing-eyebrow`.
  - **Font size scale:** `--ts-fs-base`, `--ts-fs-ratio`, `--ts-fs-display-ratio`, `--ts-font-scale`, `--ts-fs`, `--ts-fs-base-val`, ladder `--ts-fs-4xs/-3xs/-2xs/-xs/-sm/-md/-lg/-xlg/-xl/-2xl/-3xl/-4xl`. Headings `--ts-fs-h1..h6`. Display `--ts-fs-display-md/-lg/-xl`. Aliases `--ts-fs-body/-body-sm/-caption/-small/-lead/-hero/-display/-section-title/-pricing`.
  - **Spacing:** `--ts-sp-base`, `-density`, `-rhythm`, `-ratio`, `--ts-sp`, `-unit`, `--ts-sp-0..24`, `--ts-sp-px`, fluid `--ts-section-gap`, `--ts-section-pad`, `--ts-hero-pad`.
  - **Radius:** `--ts-radius-base/-scale/-radius`, `-2xs/-xs/-sm/-md/-lg/-2xl/-xl/-full`, nest reductions `--ts-radius-nest-reduction`, `--ts-pd-nest-reduction`.
  - **Shadow:** `--ts-shadow-1..5`, `--ts-shadow-accent-sm/-accent/-lg`, `--ts-accent-shadow-glow`, `--ts-accent-shadow-glow-2`, `--ts-backdrop-blur`, `--ts-backdrop-blur-2`.
  - **Z-index:** `--ts-z-base/-raised/-dropdown/-sticky/-panel/-modal/-toast/-cursor/-offcanvas/-offcanvas-panel/-preloader/-overlay`.
  - **Animation:** `--ts-ease-out/-in-out/-spring/-snap/-out-slow/-in-slow/-in-out-slow/-out-linear/-in-linear/-panel-ease-out/-panel-ease-in`, `--ts-dur-fast/-base/-slow/-slower`, `--ts-transition`.
  - **Layout:** `--ts-container-sm/-md/-lg/-xl/-pad`, `--ts-grid-gap`, `--ts-card-gap`.
  - **Button:** `--ts-btn-radius/-fw/-ls/-dur/-base/-scale/-size/-h-ratio/-pad-x-ratio/-pad-y-ratio/-fs-ratio/-icon-ratio/-h/-pad-x/-pad-y/-fs/-icon-size/-base-transitions`.
  - **Input:** `--ts-input-h/-pad-x/-pad-y/-padding/-pad-left/-radius/-fs/-bg/-bg-2/-bg-2-t/-bg-active/-bg-focus/-bg-grad/-border/-border-hover/-border-focus/-border-disabled/-color/-color-focus/-accent/-btn-color/-btn-bg/-btn-bg-accent/-btn-bg-accent-color/-transitions`.
  - **Card:** `--ts-card-transitions/-pad/-radius/-bg/-bg-2/-border/-header-h/-sp/-fs/-title-fs`.
  - **Range slider:** `--ts-range-h/-thumb/-bg/-bg-2/-border/-accent/-label/-text/-rad/-arrow`.
  - **Panel:** `--ts-panel-w/-bg/-border/-radius`.
  - **Topbar:** `--ts-topbar-h/-bg/-padding/-pad-x/-pad-y`, `--ts-promo-banner-h`.
  - **Sidebar:** `--ts-sidebar-w`.
  - **Log / Terminal:** `--ts-log-bg/-fs/-sp/-gap/-pad-small`.
  - **Text:** `--ts-text-primary/-secondary/-muted/-accent/-invert`, plus dim variants under derivative engine.
  - **Cursor:** `--ts-cursor-size/-color/-grow/-arrow-size/-transition-dur/-follower-dur`.
  - **Scrollbar:** `--ts-sb-size/-thumb/-thumb-hover/-border/-border-hover/-track/-track-hover/-track-border-w/-thumb-border-w`.
  - **Tabs / checkbox / resizer / preloader / index-bar:** `--ts-tab-radius/-tab-radius-rounded`, `--ts-checkbox-size`, `--ts-resize-enabled`, `--ts-resizer-size/-radius/-color/-accent/-opacity/-opacity-hover`, `--ts-preloader-bar-height`, `--ts-index-bar-height`.
  - **Semantic color palette:** `--ts-color-primary/-secondary/-success/-warning/-error/-info/-disabled` each `-dim/-bright/-dark`. Back-compat aliases.
  - **Ramps:** `--ts-accent-50..900`, `--ts-success-50/100/300/500/700/900`, `--ts-warning-50..900`, `--ts-danger-50..900`, `--ts-info-50..900`, `--ts-neutral-50..900`.
  - **Grid background:** `--ts-grid-scale/--ts-bg-grid-base/-size/-mix/-col1/-col2/-line/-pattern`.
  - **UI select:** `--ts-ui-select-dd-min/-runway/-max-abs/-max-rel/-max-h`.
  - **`--ts-this-bg` derivative engine** (lines 824–985): `--ts-this-bg`, `-bright`, `-bright-1..3`, `-dark`, `-dark-1..2`, `-muted`, `-dim`, `-dim-2..7`, `-grad-angle`, `-grad-angle-2`, `-grad-bright-pct`, `-grad-dark-pct`, `-grad`, `-grad-comp`, `-grad-flat`, `-grad-1..4`, `-focus`, `-hover`, `-active`, `-disabled`, `-hover-grad`, `-active-grad`, `-focus-outline`, `--ts-mix-perc`, `-hover`, `-active`, `-disabled`, `-border`, `-border-0`, `-border-hover`, `-border-active`, `-border-disabled`, `-border-focus`, `--ts-on-surface`, `-threshold`, `-dim`, `-muted`, `--ts-on-accent`, `-dim`, `-dim-1..3`, `--ts-accent-bright`, `-bright-2`, `-dark`, `-dark-2`, `-muted`, `-border-hover`, `--ts-accent-grad`, `-grad-comp`, `-grad-flat`, `--ts-text-primary-dim`, `-dim-2`, `--ts-text-secondary-dim`, `-dim-2`, `--ts-text-muted-dim`, `-dim-2`, `--ts-text-accent-dim`, `-dim-2`, `-accent-2`, `-accent-3`, `--ts-text-invert-dim`, `-dim-2`, `--ts-this-color-bright`.
- **Key classes defined:** **none.** This file is pure `:root` token declarations and one `:where(:root, :root *)` cascade block — no `.ts-*` selectors are defined here.
- **Owner annotations VERBATIM with line numbers:**
  - `L7-12:` `/* ─── §1a  ACCENT / COLOR ENGINE ──────────────────────────────────── All color variations are derived dynamically from three primitives: --ts-accent-h  (hue)   —  change this to recolor everything --ts-accent-s  (sat) --ts-accent-l  (light) ──────────────────────── */`
  - `L27:` `/* OWNER FIXES: NEW VALUES ADDED:  the  numbers re not in order. bt the values needed are these.*/`
  - `L57:` `/* SPECIAL NEW YELLOW VARIABLE OF ACCENT TINT, USED ON THE TREE  LAYOUT TYPE. all the colors should core build woththe hsl asnd deployed to be globally handler later */`
  - `L121:` `/* ✅ ENHANCED: Modern glass morphism tokens */`
  - `L125:` (implicit hardcoded white in `--ts-glass-border`/`-border-strong` — `color-mix(in srgb, #ffffff, transparent 80%)` — bypasses accent system)
  - `L130:` `/* ✅ UNIFIED accent glow backgrounds - all use dynamic accent tokens */`
  - `L163:` `/* ✅ ENHANCED: Comprehensive line height system for perfect vertical rhythm */`
  - `L184-188:` `/* Eyebrow / overline labels — small all-caps lead-in primitives. (B23 Wave 2 / A2)    Sit OUTSIDE the modular --ts-fs-* harmonic ladder by design: the eyebrow is a    role-fixed UI affordance, not a body-text rung. Px literal chosen to match the    raw-value declaration style of --ts-fs-base (13px) sibling and the --ts-letter-spacing-*    family (raw em units) — both Tier-1 primitives that hold raw values, not derivations. */`
  - `L192-198:` `/* ─── §1d.2  HARMONIC FONT SIZE SCALE ──────────────────────────── Single-ratio scale built on a base + multiplier ratio. Each step is exactly --ts-fs-ratio × the previous step. No collisions, no broken sub-base, no ad-hoc multipliers. Override --ts-fs-base or --ts-fs-ratio to rescale everything. Override any individual size per-component as needed. ──────────────────────── */`
  - `L199-200:` Double-declaration: `--ts-fs-base: 0.8rem;` then immediately `--ts-fs-base: 13px;` (second wins) — implicit owner override.
  - `L201:` `/* Smallest comfortable UI text. Override per project. */`
  - `L210-213:` `/* ─── Body sizes — single ratio (1.125), no collisions ───── Each step = previous × 1.125. Math: 1.125² = 1.266, 1.125³ = 1.424, 1.125⁴ = 1.602, 1.125⁵ = 1.802, 1.125⁶ = 2.027, 1.125⁷ = 2.281 Sub-base divides: 1/1.125 = 0.889, 1/1.125² = 0.79, 1/1.125³ = 0.703 */` (math sanity comment — but `--ts-fs-ratio: 1.12` not 1.125: minor discrepancy)
  - `L256-258:` `/* ─── Display sizes — uses larger ratio (1.333) for impact ───── These are deliberately a different scale from body — display type needs more contrast against the body to feel "display". */`
  - `L278-280:` `/* ─── Legacy aliases ───── Kept for backward compat. Hero preserves its tuned 10× max that was sized to fit "TOOLSKIN" in the 620px container. */`
  - `L287-294:` `/* ─── §1e  SPACING SCALE (Tiered + Modular) ─────────────────────────── ONE primitive base (--ts-sp-base) drives a tiered scale: • Micro (1–4):    linear, NOT rescaled — hairlines stay crisp • Component (5–9): linear × density   — gaps, padding, controls • Layout (10+):   geometric × rhythm  — sections, hero, vertical air Geometric ratio = perfect fourth (1.25) — each step is perceptibly larger than the last instead of an invisible +4px nudge. ─────────────────────────────────────────────────────────────────────── */`
  - `L296:` `/* —— Tier 1: PRIMITIVES (the only knobs you turn) —— */`
  - `L306:` `/* —— Derived primitives (don't touch) —— */`
  - `L312:` `/* —— MICRO TIER: 1–4 — fixed, crisp, never rescales —— */`
  - `L325:` `/* —— COMPONENT TIER: 5–9 — linear × density —— */`
  - `L335:` `/* 36px — restored linear scale (was unit*10 = 40px, off-by-one) */`
  - `L337-339:` `/* —— LAYOUT TIER: 10+ — geometric × rhythm —— */ /* Anchor at 48px (= sp-base × 12), then ×ratio each step. At ratio 1.25:  48 → 60 → 75 → 94 → 117 → 146 → 183 → 229 */`
  - `L355-371:` `/* —— REFACTOR NOTES: CRITICAL IMPLEMENTATION ERROR  After unit sp-16, the calculations become excessively large. The multipliers grow out of control, making these values unusable for practical frontend design.  These tokens should not be used in their current form, as they are already distributed across the design system and introduce inconsistency and scaling issues.  They must be removed and globally replaced from this point forward.  Action: - Remove all tokens from --ts-sp-17 and above - Replace them with more logical and usable values derived from the existing scale - Ensure replacements make sense for real-world padding and margin usage - Retain only tokens that are genuinely useful or percentage-based for responsive behavior  The current values are not practical for layout spacing and should be deprecated.  */`
  - `L388:` `/* —— FLUID SECTION TOKENS (responsive by design, not by media query) —— */`
  - `L394-396:` `/* ─── §1f  RADIUS SCALE ───────────────────────────────────────────── Global radius: one token controls the entire design feel ──────────────────────── */`
  - `L413-418:` `/* ─── §1f-nest  NEST-REDUCTION TOKENS (NEW-B16) ───────────────────── Amount subtracted per nesting depth level for containerish components (.ts-card, .ts-panel). Pure CSS custom-property inheritance — no JS. Both values default to 2px; tune independently if needed. See §6d below for the mechanism (Layer 1 + Layer 2 rules). ──────────────────────────────────────────────────────────────────── */`
  - `L425:` `/* ✅ WORLD-CLASS: Enhanced 5-level shadow system */`
  - `L461:` `/* Legacy alias — prefer --ts-z-modal / --ts-z-preloader */`
  - `L491-494:` `/* ─── §1k  COMPONENT-LEVEL TOKENS (derived from above) ───────────── These are the "per-component" settings — each component reads its own local vars which fall back to the global ones above. ──────────────────────── */`
  - `L496:` `/* ✅ BUTTON STYLE TOKENS (non-scaling properties) */`
  - `L497-503:` `/* REFACTOR NOTE: THE BUTTON RADIUS AND THE EXISTENT RADIUS VALUES HAS VERY FEW CONTROLS AND RAMPS. SO THE BUTTONS HAS  NO REAL DESIGN FEATURES FOR THIS AND FLEXIBVILITY. this should be also scalable on the   scaled lg, md and sm  presets  sizes of buttons. we need more radius presets tokens and a   size and content aware radius value that    suites a good design option (a dynamic radius value, respondign to a classs or a  special token value). -- important: here should be also  the blocks of the buttons that are somewhere  else on the code. but  there are several tokenized settigns patterns built. maybe here we should set the base  tokens and set another scoped on buttons root  rule for the button type or wrapper for buttons type wildcard to avboid overloading the frontend with  rules and tokens that ar enot used.  this must be globally reached but not unnecesary   throiwn on all the dom elements with root *. */`
  - `L510-513:` `/* ─── Input system — derives from --ts-this-bg ────────────────────── Any parent that sets --ts-this-bg automatically restyles all its inputs. No need to override per-element bg/border/color/transitions — set the parent surface and the cascade does the rest. */`
  - `L522:` `/* Surfaces — derived from --ts-this-bg. Override --ts-this-bg on a parent to recolor. */`
  - `L530:` `/* Borders — derived from --ts-this-bg-border (which uses --ts-mix-perc) */`
  - `L536:` `/* Text colors — keep dim by default, brighten on focus */`
  - `L541:` `/* Inset action button (search icon, clear, etc.) */`
  - `L547:` `/* Single transition token — components reference this, not a list */`
  - `L560:` `/* Card — one step above panels so blocks read off the page */`
  - `L571:` `/* Range slider — must exist on plain :root (Pattern Generator, etc.); banner app may override */`
  - `L583:` `/* Panel (control panels, tool panels) */`
  - `L607:` `/* Text colors (semantic) — Practical · Neutral dark */`
  - `L619:` `/* Size/color transition speed */`
  - `L621:` `/* Follower size transition speed */`
  - `L638:` `/* 1 = ON, 0 = OFF */` (re `--ts-resize-enabled`)
  - `L640:` `/* Resizer tokens */`
  - `L656-668:` `/* ══════════════════════════════════════════════════════════════════ ROOT 1b — SEMANTIC COLOR PALETTE ══════════════════════════════════════════════════════════════════ 7 semantic color families. Each family: base + dim + bright + dark. Ladder math (per family): dim    = color-mix(base 50%, --ts-bg-body)  — muted bg tint bright = color-mix(base 80%, white)          — light tint for dark-UI badges dark   = color-mix(base 60%, black)          — deep shade for borders/icons NEW tokens use --ts-color-* namespace. EXISTING tokens (--ts-success, --ts-warning, --ts-danger, --ts-info) are aliased to the new tokens for backward compat — do NOT remove. NEW-B15 / 2026-04-25 ══════════════════════════════════════════════════════════════════ */`
  - `L687:` `/* Backward-compat aliases */` (status colors)
  - `L705:` `/* Backward-compat aliases (--ts-danger widely used — keep both) */`
  - `L768:` `/* Neutral ramp (semantic — same names work in light & dark) */`
  - `L780:` `/* Grid background system - fully tokenized */`
  - `L800:` `/* OWNER FIX UPDATE: Tunable knobs — override per-instance or per-context */`
  - `L802:` `/* floor: ~3 options + search */`
  - `L804:` `/* nav + trigger + breathing room */`
  - `L806:` `/* absolute cap on tall screens */`
  - `L808:` `/* relative cap on short screens */`
  - `L810:` `/* The formula — declared ONCE, consumed everywhere */`
  - `L816-822:` `/* ------------------------------------------------------------------- DYNAMIC GRADIENT + HOVER/ACTIVE SYSTEM ------------------------------------------------------------------- Define once, reuse everywhere. Just set --ts-this-bg on any element and the rest auto'generates. Hover, active, focus, disabled states are fully automatic. ------------------------------------------------------------------- */`
  - `L825:` `/* ✅ BUTTON SCALING TOKENS - Global inheritance for perfect scaling */`
  - `L826:` `/* The base unit — single knob to retune the whole button system */`
  - `L831-833:` `/* RATIO TOKENS — each derives one dimension from --ts-btn-size. Tune any of these globally without math; per-size variants override individually. */`
  - `L835:` `/* h = size × this        (was hardcoded 1) */`
  - `L845:` `/* DERIVED — never override these directly; tune the ratios above */`
  - `L848 & L850:` Double-declaration of `--ts-btn-pad-x` (re-declares with different formula — second wins). Same at `L849 & L851` for `--ts-btn-pad-y`, and `L852 & L853` for `--ts-btn-fs`.
  - `L857:` `/* ✅ ACCENT TOKENS - Global inheritance for dynamic theming */`
  - `L864-866:` `/* Auto on-accent: oklch auto-selects white or black text for accent backgrounds. Dark mode: threshold 0.75 — only very light accents (yellow, lime, cyan) get black text. Mid-tone accents like orange/red keep white text for dark-mode visual consistency. */`
  - `L880:` `/* ✅ ACCENT GRADIENTS - Dynamic gradient system */`
  - `L888:` `/* If --ts-this-bg is not set, fallback to a neutral surface */`
  - `L889 & L897:` Double-declaration of `--ts-this-bg` within the same `:where(:root, :root *)` block: first as `var(--ts-bg-1, #1f1f2a)` fallback, then re-declared `var(--ts-bg-1)` at L897.
  - `L891:` `/* Lighten / darken variants (for gradients and states) */`
  - `L896:` `/* Predefined gradient (can be overridden) */`
  - `L905-906:` `--ts-this-bg-bright` triple-declared: first `color-mix(...) #ffffff 8%` (L892), then `color-mix(...) var(--ts-text-primary) 14%` (L905), then `color-mix(...) #ffffff var(--ts-this-bg-grad-bright-pct, 6%)` (L906). Last wins.
  - `L916-918:` `/* ─── GRADIENT CONTROL TOKENS ────────────────────────────────────── Tune the gradient feel from one place. Override on any scope to control the look across the entire subtree. */`
  - `L930-933:` `/* ─── BORDER STATE TOKENS ────────────────────────────────────────── All borders derive from --ts-this-bg using a single control token: --ts-mix-perc (intensity %). Override --ts-mix-perc on any scope to control border contrast across the entire subtree. */`
  - `L945:` `/* --- HOVER, ACTIVE, FOCUS, DISABLED (automatic) --- */`
  - `L951:` `/* Hover/active gradients */`
  - `L955:` `/* Focus outline colour */`
  - `L958-961:` `/* ─── AUTO TEXT-ON-SURFACE (OKLCH luminance pivot) ───────────────── Mirrors --ts-on-accent. Generates readable text color for ANY --ts-this-bg value by flipping to white when the surface is dark and to near-black when the surface is light. Tunable threshold. */`
  - `L974-975 & L982-984:` `--ts-text-accent-2` and `--ts-text-accent-3` are double-declared (once in the dim/-2/-3 family block, once again at L982-984). `--ts-text-accent` itself is re-declared at L982 outside any block (likely a stray line — see refactor flag).
- **Refactor flags:**
  - `OWNER FIXES` annotation at L27 explicitly says "the numbers re not in order. bt the values needed are these" — `--ts-accent-dim-0..6` are declared in non-sequential order: -0, default (=-dim), -2, -3, then jumps to -1, -4, -5, -6. Order is intentional but visually confusing.
  - `REFACTOR NOTES: CRITICAL IMPLEMENTATION ERROR` (L355–371) — `--ts-sp-17..24` are flagged as broken/unusable and must be globally replaced. Already covered in `_code-audit-catalog.md:490, 923`.
  - `REFACTOR NOTE` (L497–503) — button radius/size system has insufficient ramps; needs more presets and a dynamic, content-aware radius value. Owner also flags that button rules are scattered across the codebase and proposes a wrapper-scoped approach instead of `:root *` overload.
  - `OWNER FIX UPDATE` (L800) — UI select dropdown tunable knobs; flagged as override-able per-instance.
  - **Double declarations (multiple sources of truth):**
    - `--ts-fs-base` (L199-200): `0.8rem` then `13px`.
    - `--ts-this-bg` (L889 & L897): `var(--ts-bg-1, #1f1f2a)` then `var(--ts-bg-1)`.
    - `--ts-this-bg-bright` (L892, L905, L906): three different formulas.
    - `--ts-this-bg-dark` (L893 & L910 & L911): three different formulas.
    - `--ts-btn-pad-x` (L847 & L848 & L850): two different formulas; final wins.
    - `--ts-btn-pad-y` (L849 & L851).
    - `--ts-btn-fs` (L852 & L853).
    - `--ts-accent-dim-0` and `--ts-accent-border` declared twice (in §1a `:root` block and again in the `:where(:root, :root *)` block at L859-863).
    - `--ts-text-accent-2`, `--ts-text-accent-3` declared twice (L974-975 then L983-984).
    - `--ts-text-accent` re-declared as bare line at L982 (outside any obvious block — looks like a stray edit).
  - **Hardcoded white `#ffffff` references** appear inside the `:where(:root, :root *)` engine block at L872-875 (accent bright/dark), L892-894 (this-bg bright/dark), L906-913 (this-bg-bright-1..3, this-bg-dark-1..2) — these bypass any potential theme/light-mode flip but are likely intentional for OKLCH math.
  - `--ts-this-color-bright` at L978-980 — unusual standalone token; not part of a coherent family. Council should determine whether to keep or rename.
- **Session 3 relationship:**
  - **Single biggest source of truth in the catalog set.** This file is essentially the entire `:root` token surface of `toolskin.css` extracted in isolation.
  - Directly informs the rebuild's primitives layer (`assets/css/next/primitives.css` / equivalent) AND the system layer (surfaces.css, the apcach color engine, eventually text.css).
  - The `--ts-this-bg` derivative engine in the `:where(:root, :root *)` block (L824–985) is exactly what the rebuild's `surfaces.css` (commit `a0ea9e4`) and Wave 1 surfaces work has been re-encoding under the apcach paradigm.
  - The 7-family `--ts-color-*` palette (L656–722) is the canonical semantic color contract for status colors / disabled / secondary — must inform future system/component layers.
  - The font-size harmonic ladder (L192–285) and spacing tier system (L287–391) inform `assets/css/next/text.css` (typography) and any future `spacing.css` block. The `sp-17..24` issue must be resolved before any spacing layer is written.
  - The `--ts-radius-*` ladder and nest-reduction tokens (L394–420) inform component radius work (cards, panels, buttons).
  - The button-scaling block at L824–855 (with the ratio-derivative pattern: `--ts-btn-base × --ts-btn-scale = --ts-btn-size`, then `-h-ratio / -pad-x-ratio / -pad-y-ratio / -fs-ratio / -icon-ratio`) is the canonical button-sizing engine pattern — should inform Buttons block sandbox (Block 4+).
  - The auto on-accent/on-surface OKLCH pivot (L867, L962-965) connects directly to the apcach work in Sessions 2–3.
- **Gap vs `_code-audit-catalog.md`:**
  - **(a) Already covered:** Most of this content overlaps `_code-audit-catalog.md` §1 (root tokens) and §4.3 (the `--ts-this-bg` derivative engine, lines 524–534). Key alignments: `--ts-accent-tree-*` (catalog L455), `--ts-sp-17..24` REFACTOR NOTE (catalog L490, L923), §1f radius + nest-reduction (catalog L493), input system (catalog L505), `--ts-color-*` 7-family palette (catalog L518), `:where(:root, :root *)` engine block (catalog L432, §4.3).
  - **(b) NEW in this file (not in `_code-audit-catalog.md`):**
    - **The verbatim refactor-note paragraph at L355–371 in full sentence form** — the existing catalog summarizes it but doesn't quote owner's wording.
    - **The verbatim button-system refactor note at L497–503** — calls out specific architectural intent: more radius presets, content-aware dynamic radius, scoped-wrapper pattern vs `:root *` overload. This is NEW conceptual guidance not in the catalog.
    - **The owner-typed `OWNER FIXES` annotation at L27** with its specific complaint about non-sequential dim numbering — this *style* of annotation pattern (informal owner commentary inline) is new directional intelligence.
    - **The `SPECIAL NEW YELLOW` comment at L57** — the tree-accent purpose and "should be globally handled later" is partially covered (catalog L455 lists the tokens) but the owner's directional intent is NEW.
    - **The owner directive at L666:** "EXISTING tokens (`--ts-success`, etc.) are aliased to the new tokens for backward compat — do NOT remove. NEW-B15 / 2026-04-25" — explicit ruling that back-compat aliases are binding (preserves both old and new names).
    - **The eyebrow/letter-spacing-eyebrow primitive justification at L184–188** — explicit rationale for why eyebrow tokens sit OUTSIDE the `--ts-fs-*` modular ladder (role-fixed UI affordance). This design rationale is NEW.
    - **The line-height system comment block at L163** "Comprehensive line height system for perfect vertical rhythm" with the seven named line heights — already in catalog as tokens but not the design intent.
    - **The "Predefined gradient (can be overridden)" intent at L896, the gradient angle control tokens design rationale (L916–918), and the border-state intensity knob `--ts-mix-perc` (L930–933)** — these "single knob controls subtree" design contracts are not made explicit in the catalog.
    - **The footnote that --ts-on-accent oklch threshold is set to 0.75 specifically so mid-tone accents like orange/red keep white text** (L864–866) — explicit theming rationale.
    - The owner's stray re-declaration of `--ts-text-accent` at L982 (looks like an editing artifact, see double-declaration list above).
  - **(c) Contradictions:** None substantive. The catalog already flags double-declarations (`_code-audit-catalog.md:915`) and the sp-17..24 problem. Both are confirmed here.

---

### `surface-alt-nested-auto-section-card-input-surface-design-pattern(...).css`

- **Path:** `docs/references/toolskin.css_extracted-core-blocks-to-refactor/surface-alt-nested-auto-section-card-input-surface-design-pattern(analyze showcase output and notes this is the  olds oreiginal version protrotype butbthe result iws what is expected).css`
- **Lines:** 799  ·  **Bytes:** 27,859
- **Block type:** Surface design pattern / refactor-spec block — contains TWO large `.ts-section` alternation engines (odd/even + `.ts-section--alt`) governing nested card/input contrast behavior. This file is **half code, half owner architectural spec** — the long header blocks at L1–105 and L389–530 are written as design briefs, not comments.
- **Owner annotation embedded in filename:** "**analyze showcase output and notes this is the olds original version prototype but the result is what is expected**" — captured here as the primary directive for this file. The owner is saying: this file is a prototype but the resulting visual is the target.
- **Key tokens declared (locally set inside selectors — these are NOT `:root` tokens):**
  - `--ts-main-surface-bg` (set inside `.ts-section:nth-of-type(odd)...`)
  - `--ts-alt-surface-bg` (set inside `.ts-section:nth-of-type(even)... , .ts-section.ts-section--alt`)
  - Local override tokens (custom `--_input-*` namespace, owner-styled `_` prefix):
    - `--_input-color`
    - `--_input-accent`
    - `--_input-focus`
    - `--_input-hover`
    - `--_input-bg`
    - `--_input-bg-focus`
    - `--_btn-color`
  - Cascade overrides of system tokens inside the alternation engines:
    - `--ts-this-bg`, `--ts-this-bg-surface`, `--ts-this-bg-dim`, `--ts-this-bg-dim-2`, `--ts-this-bg-dim-3`, `--ts-this-bg-dim-5`, `--ts-this-bg-dark-1`, `--ts-this-bg-border`, `--ts-this-bg-border-hover`, `--ts-this-bg-grad-3`.
    - `--ts-on-surface`, `--ts-on-surface-muted`, `--ts-on-accent`.
    - `--ts-card-bg`, `--ts-card-bg-2`, `--ts-card-border`.
    - `--ts-input-bg`, `--ts-input-bg-2`, `--ts-input-border`, `--ts-input-pad-x`, `--ts-input-pad-y`, `--ts-input-h`, `--ts-input-radius`, `--ts-input-fs`, `--ts-input-transitions`.
    - Consumed only: `--ts-accent`, `--ts-text-primary`, `--ts-text-primary-dim`, `--ts-text-primary-dim-2`, `--ts-bg-0`, `--ts-bg-1`, `--ts-bg-1-t`, `--ts-bg-2-t`, `--ts-bg-body`, `--ts-radius-sm`, `--ts-dur-fast`, `--ts-ease-out`.
- **Key classes defined / selectors used:**
  - `.ts-section:nth-of-type(odd):not(...)` — main surface engine, L107.
  - `.ts-section:nth-of-type(odd):not(...) *:not(.ts-btn, .ts-btn *, table, table *, [class*="ts-ui-"], [class*="ts-ui-"] *)` — descendant rules for main engine, L121.
  - Nested under those rules: `.ts-input:not(.ts-resizable)`, `.ts-select`, `.ts-textarea:not(.ts-resizable)`, `.ts-ui-select__trigger`, `.ts-input-inset-button`, `.ts-resizable-wrap`, `.ts-input-group`, `.ts-input-group.ts-input-inset-button`, `.ts-btn.ts-input-btn`, `.ts-btn`, `.ts-btn.ts-input-btn.ts-btn--primary` (plus pseudo states), `.ts-card`, `.ts-card .ts-input:focus`, `.ts-input:focus`.
  - `.ts-section:nth-of-type(even):not(...), .ts-section.ts-section--alt` — alt surface engine, L531-533.
  - `.ts-section--alt *:not(...), .ts-section:nth-of-type(even):not(...) *:not(...)` — descendant rules for alt engine, L552-554.
  - Same nested set as above repeated under alt scope.
  - `:where(.ts-input-group:has(.ts-input:focus) .ts-input-icon)` — focus-within icon coloring via `:has()`.
  - `:where(.ts-input-inset-button:has(.ts-input:focus-within, ...) .ts-btn)` — inset button focus styling via `:has()`.
- **Owner annotations VERBATIM with line numbers:**
  - `Filename-embedded:` `surface-alt-nested-auto-section-card-input-surface-design-pattern(analyze showcase output and notes this is the olds oreiginal version protrotype butbthe result iws what is expected).css` — owner directive: this is the OLD prototype, but the RESULT is what is expected.
  - `L1-105:` (truncated for brevity but captured below in full)
    `/* //// @ts-inputs-refactor-dedupe & @ts-section-auto-bg-refactor — #MAIN_BG_SURFACE #START_REVIEW`
    `Special styling scope for nested inputs inside card components within normal un-classed .ts-section cotnainer surface contexts (e.g. \`.ts-section\` and equivalent background/contrast scenarios and odd type and first type).`
    `This block represents the main surface engine layer and must remain focused on color/contrast behavior only.`
    `PURPOSE:`
    `- Ensure proper contrast for inputs inside main ts-section default/variant sections`
    `- Apply token-driven contrast rules for accessibility across surface variations`
    `- Support advanced surface mixing (background + accent + state)`
    `IMPORTANT NOTES:`
    `- Structural/layout rules are NOT intended to live in this block`
    `- However, some implementations here are more advanced than the current main scope`
    `- These must be reviewed carefully before removal to avoid regressions`
    `SCOPE:`
    `- Targets inputs nested within cards under ts-section/non-alt sections`
    `- Applies only color, border, outline, and surface-related token logic`
    `- Must NOT define layout, sizing, spacing, or structural behavior`
    `REFACTOR REQUIREMENTS:`
    `- Perform deduplication and diff checks against the main input system`
    `- Validate changes via visual audits to prevent downgrades`
    `- Preserve any improved behavior found in this scope`
    `@migrate_up RULES:`
    `Tagged declarations identified as NON-color logic must be:`
    `1. Extracted from this block`
    `2. Deduplicated`
    `3. Reassigned to their correct global/component scope`
    `4. Reapplied in the exact equivalent selectors outside this alternation engine`
    `These rules are REQUIRED and must be preserved, but relocated.`
    `EXTRACTED NON-COLOR RULES (reference set):`
    `border-radius: var(--ts-input-radius)!important;`
    `font-family: inherit;`
    `font-size: var(--ts-input-fs);`
    `padding-block: var(--ts-input-pad-x);`
    `height: var(--ts-input-h);`
    `width: 100%;`
    `position: relative;`
    `display: flex;`
    `flex-direction: row;`
    `flex-wrap: nowrap;`
    `align-items: center;`
    `border-radius: var(--ts-input-radius);`
    `padding-block: 0 !important;`
    `font-size: var(--ts-input-fs) !important;`
    `border-radius: 0;`
    `border-top-left-radius: 0 !important;`
    `border-bottom-left-radius: 0 !important;`
    `height: 100%;`
    `transition: var(--ts-input-transitions);`
    `NOTE:`
    `- These declarations were identified via grep as non-color rules`
    `- Use them strictly as a migration reference set`
    `Do NOT remove any rules that affect visual appearance, including:`
    `- Borders`
    `- Outlines`
    `- Surface/background rendering`
    `- Any color-related behavior`
    `Additionally:`
    `- Preserve any base rules that can be shared with sibling alternation scopes`
    `  (e.g. \`.ts-section--alt\` or even/auto alternation variants)`
    `- Avoid redeclaring identical rules across scopes when they perform the same function`
    `- Consolidate shared logic into a single structured layer`
    `Refactor strategy:`
    `- Keep only the necessary structural rules in a shared base scope`
    `- Move variant-specific differences into token overrides`
    `- Ensure each scope defines only what is strictly required`
    `Token constraints:`
    `- Declarations tied to \`@ts-sectionKEY_token\` MUST remain intact`
    `- These tokens define the differentiation between base and alt scopes`
    `- Do NOT modify, remove, or relocate these token declarations`
    `- Do NOT alter any rules that depend on these tokens`
    `Cascade requirements:`
    `- If token-driven declarations are missing at the correct scope, styles will break`
    `- Ensure the cascade remains fully functional after deduplication`
    `- Validate that properties are still resolved correctly through inheritance and overrides`
    `Examples:`
    `- Duplicated rules across base/alt scopes should be removed where identical`
    `- Refer to: @ts-section-auto-bg_dedupe for known duplication patterns`
    `GOAL:`
    `- Isolate this block as a pure base \`.ts-section\` surface and contrast engine`
    `- Support nested card/input elements with consistent contrast behavior`
    `- Enable seamless alternation with \`.ts-section--alt\` and automated even-section logic`
    `- Relocate all structural/layout logic into shared, tokenized component layers`
    `- Achieve a clean, deduplicated system without breaking cascade or variant behavior`
    `//// */`
  - `L116-118:` `/* @ts-sectionKEY_token*/ /* --ts-this-bg-border: color-mix(in srgb, var(--ts-this-bg), var(--ts-text-primary-dim) 25%); */ /* @ts-sectionKEY_token*/` (commented-out token override)
  - `L124-166:` Repeated `/* @ts-sectionKEY_token*/` markers (interleaved with token assignments — these mark architectural significance of each declaration).
  - `L128:` `/* @ts-section-auto-bg_dedupe*/`
  - `L178:` `/* Base input style */`
  - `L179:` `/* @ts-section-auto-bg_dedupe*/`
  - `L190-216:` More `/* @ts-sectionKEY_token*/` and `/* @ts-section-auto-bg_dedupe*/` markers; L193 `/* border-radius: var(--ts-input-radius) !important; */` (commented-out structural rule — owner removed); L206 `/* align-items: center; */` (commented-out structural rule).
  - `L222-371:` More dedupe markers and `/* @migrate_up */` flags on each non-color declaration that owner wants relocated out.
  - `L386:` `/* //// #END_REVIEW Special #MAIN_BG_SURFACE syling scrope for nested inputsinside cards  for contrsst radio on normal style sections  with  contrast  rules////  */`
  - `L389-530:` (alt-surface refactor spec — second large block, ~140-line owner brief)
    `/* //// @ts-inputs-refactor-dedupe & @ts-section-auto-bg-refactor — #START_REVIEW`
    `ALT SURFACE ENGINE — NESTED INPUTS (CARD CONTEXT)`
    `This block defines the ALT (alternative) surface layer for inputs inside cards, typically under \`.ts-section--alt\` or equivalent alternated/even section contexts.`
    `It is an extension of the MAIN surface engine (#MAIN_BG_SURFACE) and must follow the same architectural rules, acting only as a visual override layer.`
    `PURPOSE:`
    `- Apply contrast adjustments for inputs within ALT surface contexts`
    `- Override base surface tokens using ALT-specific values`
    `- Enable consistent alternation behavior (manual \`.ts-section--alt\` or automatic even-section logic)`
    `SCOPE (STRICT):`
    `- ONLY visual properties are allowed:`
    `  - Color`
    `  - Background / surface`
    `  - Border / outline`
    `  - Shadow (if token-driven and surface-related)`
    `- MUST NOT include:`
    `  - Layout (flex, display, positioning)`
    `  - Sizing (width, height)`
    `  - Spacing (padding, margin, gap)`
    `  - Typography structure`
    `All structural logic must live in the MAIN/base component layer.`
    `ARCHITECTURE RELATION:`
    `This block MUST:`
    `- Inherit shared base rules from the main \`.ts-section\` surface system`
    `- Override ONLY what is necessary via tokens`
    `- Avoid duplicating any rule already defined in the base scope`
    `If a rule is identical to the base → REMOVE it here`
    `If a rule differs only by value → TOKENIZE it`
    `If a rule is structural → MIGRATE UP (remove from this block)`
    `@migrate_up RULES:`
    `Non-color declarations found in this scope are NOT valid here and must be:`
    `1. Extracted 2. Deduplicated 3. Moved to the correct base/component scope 4. Reapplied using the same selectors outside the ALT engine`
    `These rules are REQUIRED but misplaced — relocation is mandatory.`
    `(Reference set of non-color rules to migrate is duplicated from the main engine — identical migration set.)`
    `DEDUPLICATION RULES:`
    `- Remove duplicated rules that perform identical operations across base and ALT scopes`
    `- Share common logic in the base layer`
    `- Keep this block minimal and override-focused`
    `Refer to: @ts-section-auto-bg_dedupe`
    `TOKEN CONSTRAINTS:`
    `- \`@ts-sectionKEY_token\` declarations MUST remain intact`
    `- These define the differentiation between base and ALT surfaces`
    `- DO NOT modify, remove, or relocate them`
    `- Any rule depending on these tokens must remain correctly scoped`
    `Failure to preserve token scope WILL break the rendering engine.`
    `CASCADE & OVERRIDE LOGIC:`
    `- The cascade must continue resolving from base → ALT overrides`
    `- Missing token declarations at the correct scope will break styles`
    `- After deduplication, verify that inheritance still resolves correctly`
    `ALT behavior must:`
    `- Override base visually`
    `- Never redefine base structure`
    `ALT CLASS + AUTO ALTERNATION LOGIC:`
    `- This rule set intentionally EXCLUDES direct dependency conflicts with \`.ts-section--alt\``
    `- Automatic alternation (e.g. :nth-child / even logic) must coexist with manual class usage`
    `IMPORTANT:`
    `- Do NOT remove ALT exclusion logic`
    `- Manual \`.ts-section--alt\` must override automatic alternation safely`
    `- This prevents selector conflicts and cross-browser inconsistencies`
    `This is NOT an error — it is required for stability.`
    `GOAL:`
    `- Isolate this block as a pure ALT surface/contrast override engine`
    `- Maintain strict separation from structural/component logic`
    `- Enable seamless alternation (manual + automatic)`
    `- Ensure zero duplication and full token-driven behavior`
    `- Preserve cascade integrity across all variants`
    `Refer to: #MAIN_BG_SURFACE for base architecture and system rules`
    `//// */`
  - `L535-585:` Repeated `/* @ts-sectionKEY_token*/` markers across each token override.
  - `L551:` `/* note: this rule excludes the alt class too, becasue if the rule uis enfoced by the suer, the  odd and even logic will breka the css matching styling and may conflict oin soem browser,s so overriding the class usage is better than forcing the class  enfocement. FONT REMOVE THE  ALT SECITON EXCLUSION, IS NOT AN ERROR.  */` (owner-typed warning: DO NOT REMOVE alt exclusion — confirmed not an error)
  - `L559, L591, L603, L640, L657, L685, L711, L782, L786:` `/*@ts-section-auto-bg_dedupe*/` markers — flags places where the same rule appears in both base and alt blocks (duplication to deduplicate).
  - `L602, L604:` `/* Base input style */`
  - `L624:` `/* background-image: var(--ts-this-bg-grad-3); */` (commented-out gradient hint)
  - `L666-704:` Repeated `/* @migrate_up */` flags on individual non-color declarations (border-radius, padding-block, font-size, height, transition) inside `.ts-input-group`, `.ts-input-inset-button`, `.ts-btn.ts-input-btn` rules — owner has marked each instance to be relocated out of the alt-surface block.
  - `L744:` `/* @ts-sectionKEY_token*/` inside `.ts-card` rule (the `--ts-this-bg: var(--ts-alt-surface-bg)` override).
  - `L800:` `/* //// @ts-inputs-refactor-dedupe & @ts-section-auto-bg-refactor — #END_REVIEW Special styling scope for nested inputs inside card components for alt variant.//// */`
- **Refactor flags (synthesized from owner annotations):**
  1. **Dedupe imperative:** Two near-identical alternation engines (main + alt) share most rules but differ in token values. Owner wants the shared structural/layout rules extracted into a single base layer and only the token differences kept per variant. All `@ts-section-auto-bg_dedupe` markers flag specific duplicated rules.
  2. **`@migrate_up` imperative:** Every non-color declaration tagged `@migrate_up` must be moved OUT of the alternation engine into the canonical component layer (inputs, buttons, cards). Owner explicitly lists ~19 rules in the reference migration set at L37-56 and again at L448-467.
  3. **`@ts-sectionKEY_token` preservation:** Owner explicitly forbids removing, modifying, or relocating any declaration tagged `@ts-sectionKEY_token`. These tokens are the variant differentiators.
  4. **Alt exclusion preservation:** Owner explicitly says the alt-class exclusion in selectors (`.ts-section:not(.ts-section--alt, ...)`) is NOT an error — it prevents cross-browser conflicts between manual `.ts-section--alt` and auto `:nth-of-type` alternation. Must be preserved.
  5. **Filename directive:** The file is labeled an "olds original version prototype" — meaning the CSS code here is OLD and rough, but the RESULTING visual is the design target. Council must read the file as design intent + reference, not literal source.
  6. **`--_input-*` private-namespace tokens** (L568-580+): owner uses CSS underscore prefix (`--_input-color`, `--_input-bg`) to mark "private/scoped" variables — different from `--ts-*` public tokens. This is an emergent convention worth preserving.
  7. **`--ts-main-surface-bg` and `--ts-alt-surface-bg`** are computed inside selectors via `color-mix(--ts-on-surface-muted, --ts-on-surface 93%/95%)` — i.e. they derive surface tint from the auto-contrast text color. This is a clever bidirectional surface↔text coupling that the existing catalog does not flag.
- **Session 3 relationship:**
  - **Future block: Sections & Section-Variants.** This file is the canonical specification for the `.ts-section` + `.ts-section--alt` alternation contract. Will inform a future `sections.css` block sandbox (after the system layer settles).
  - **Future block: Input system + Card system.** Defines how inputs nested inside cards inside sections behave under main vs alt surface contexts. Will inform `inputs.css`, `cards.css` blocks downstream.
  - **`--ts-on-surface` and `--ts-on-surface-muted`** are computed inside the alternation engines and feed into `--ts-main-surface-bg` / `--ts-alt-surface-bg`. This bidirectional flow (text-color drives surface tint) is a notable design pattern that should be tested against the apcach engine in the system layer.
  - **`.ts-section--alt`** as a manual-override pattern complementing automatic `:nth-of-type(even)` alternation is a key UX contract — confirms RULING-relevant decision that even-rule MUST coexist with manual class override.
  - **`@migrate_up` and `@ts-sectionKEY_token` tagging system** is a precedent for the rebuild's own annotation-aware refactor workflow: code carries semantic tags so an automated migrator can extract structural vs visual rules.
- **Gap vs `_code-audit-catalog.md`:**
  - **(a) Already covered:** the `.ts-section`, `.ts-section--alt`, `.ts-card`, `.ts-input`, `.ts-input-group`, `.ts-input-inset-button`, `.ts-btn`, `.ts-btn--primary`, `.ts-select`, `.ts-textarea`, `.ts-ui-select__trigger`, `.ts-resizable-wrap` classes are all listed in the catalog's components inventory (catalog §10 onward). The `--ts-input-*` tokens are listed at catalog L505.
  - **(b) NEW in this file (not in `_code-audit-catalog.md`):**
    - **The entire `.ts-section` alternation engine** — odd/even/`.ts-section--alt` rules with the `:not(...)` exclusion list, the auto-alternation contract, and the bidirectional auto-classification logic. The catalog mentions `.ts-section` exists but does not document the alternation cascade contract.
    - **`--ts-main-surface-bg` and `--ts-alt-surface-bg`** — these locally-scoped tokens with `color-mix(--ts-on-surface-muted, --ts-on-surface)` derivation are NOT in the catalog. They are a new emergent surface-from-text-pivot pattern.
    - **`--_input-*` private-namespace token convention** (with `_` prefix instead of `ts-`) — catalog does not flag this convention.
    - **The `@migrate_up` / `@ts-sectionKEY_token` / `@ts-section-auto-bg_dedupe` semantic tagging system** in source comments — this is an architectural workflow not captured in the catalog.
    - **The verbatim ~140-line owner refactor briefs at L1-105 and L389-530** — these are extended design specifications written as comments that explain WHY the rules exist; the catalog summarizes but does not quote.
    - **The intentional descendant `:not()` exclusions for `.ts-btn`, table, `[class*="ts-ui-"]`** — these protect buttons, tables, and `ts-ui-*` components from being color-overridden by the section alternation engine. Architecturally important and not in catalog.
    - **The `:has()` selector usage** (L653, L730) for focus-within icon/button coloring — modern CSS pattern worth flagging.
    - **The owner's explicit ruling that alt-class exclusion is NOT a bug** (L551) — preserved as binding constraint.
  - **(c) Contradictions:** None with the catalog itself, but the `@migrate_up` rules embedded here imply a wholesale future refactor that the catalog has not yet anticipated. This file extends the catalog's scope by spelling out concrete migration imperatives.

---

## Annotation index (this section, line-numbered, verbatim)

### `ts-surface.css`
- L2-4: `§5  SURFACES & DEPTH` (section header — structural only, no owner notes)
- L6: `§5a  Surface Classes` (subsection header)

### `root-tokens-blocks-reference.css`
- L7-12: `§1a  ACCENT / COLOR ENGINE` (header — three-primitive HSL recolor contract)
- L27: `OWNER FIXES: NEW VALUES ADDED:  the  numbers re not in order. bt the values needed are these.`
- L57: `SPECIAL NEW YELLOW VARIABLE OF ACCENT TINT, USED ON THE TREE  LAYOUT TYPE. all the colors should core build woththe hsl asnd deployed to be globally handler later`
- L121: `✅ ENHANCED: Modern glass morphism tokens`
- L130: `✅ UNIFIED accent glow backgrounds - all use dynamic accent tokens`
- L163: `✅ ENHANCED: Comprehensive line height system for perfect vertical rhythm`
- L184-188: `Eyebrow / overline labels — small all-caps lead-in primitives. (B23 Wave 2 / A2) Sit OUTSIDE the modular --ts-fs-* harmonic ladder by design...`
- L192-198: `§1d.2  HARMONIC FONT SIZE SCALE — Single-ratio scale built on a base + multiplier ratio. Override --ts-fs-base or --ts-fs-ratio to rescale everything.`
- L210-213: `Body sizes — single ratio (1.125), no collisions — Math: 1.125² = 1.266...`
- L256-258: `Display sizes — uses larger ratio (1.333) for impact — These are deliberately a different scale from body...`
- L278-280: `Legacy aliases — Kept for backward compat. Hero preserves its tuned 10× max that was sized to fit "TOOLSKIN" in the 620px container.`
- L287-294: `§1e SPACING SCALE (Tiered + Modular) — Micro (1-4) linear NOT rescaled / Component (5-9) linear × density / Layout (10+) geometric × rhythm`
- L296: `Tier 1: PRIMITIVES (the only knobs you turn)`
- L306: `Derived primitives (don't touch)`
- L312: `MICRO TIER: 1–4 — fixed, crisp, never rescales`
- L325: `COMPONENT TIER: 5–9 — linear × density`
- L335: `36px — restored linear scale (was unit*10 = 40px, off-by-one)`
- L337-339: `LAYOUT TIER: 10+ — geometric × rhythm — Anchor at 48px (= sp-base × 12), then ×ratio each step. At ratio 1.25:  48 → 60 → 75 → 94 → 117 → 146 → 183 → 229`
- L355-371: `REFACTOR NOTES: CRITICAL IMPLEMENTATION ERROR — After unit sp-16, the calculations become excessively large. The multipliers grow out of control, making these values unusable for practical frontend design. These tokens should not be used in their current form, as they are already distributed across the design system and introduce inconsistency and scaling issues. They must be removed and globally replaced from this point forward. Action: Remove all tokens from --ts-sp-17 and above; Replace them with more logical and usable values derived from the existing scale; Ensure replacements make sense for real-world padding and margin usage; Retain only tokens that are genuinely useful or percentage-based for responsive behavior. The current values are not practical for layout spacing and should be deprecated.`
- L388: `FLUID SECTION TOKENS (responsive by design, not by media query)`
- L394-396: `§1f RADIUS SCALE — Global radius: one token controls the entire design feel`
- L413-418: `§1f-nest NEST-REDUCTION TOKENS (NEW-B16) — Amount subtracted per nesting depth level for containerish components (.ts-card, .ts-panel). Pure CSS custom-property inheritance — no JS. Both values default to 2px; tune independently if needed. See §6d below for the mechanism (Layer 1 + Layer 2 rules).`
- L425: `✅ WORLD-CLASS: Enhanced 5-level shadow system`
- L461: `Legacy alias — prefer --ts-z-modal / --ts-z-preloader`
- L491-494: `§1k COMPONENT-LEVEL TOKENS (derived from above) — These are the "per-component" settings — each component reads its own local vars which fall back to the global ones above.`
- L496: `✅ BUTTON STYLE TOKENS (non-scaling properties)`
- L497-503: `REFACTOR NOTE: THE BUTTON RADIUS AND THE EXISTENT RADIUS VALUES HAS VERY FEW CONTROLS AND RAMPS. SO THE BUTTONS HAS NO REAL DESIGN FEATURES FOR THIS AND FLEXIBVILITY. this should be also scalable on the scaled lg, md and sm presets sizes of buttons. we need more radius presets tokens and a size and content aware radius value that suites a good design option (a dynamic radius value, respondign to a classs or a special token value). -- important: here should be also the blocks of the buttons that are somewhere else on the code. but there are several tokenized settigns patterns built. maybe here we should set the base tokens and set another scoped on buttons root rule for the button type or wrapper for buttons type wildcard to avboid overloading the frontend with rules and tokens that are not used. this must be globally reached but not unnecesary throiwn on all the dom elements with root *.`
- L510-513: `§1k Input system — derives from --ts-this-bg — Any parent that sets --ts-this-bg automatically restyles all its inputs. No need to override per-element bg/border/color/transitions — set the parent surface and the cascade does the rest.`
- L522: `Surfaces — derived from --ts-this-bg. Override --ts-this-bg on a parent to recolor.`
- L530: `Borders — derived from --ts-this-bg-border (which uses --ts-mix-perc)`
- L536: `Text colors — keep dim by default, brighten on focus`
- L541: `Inset action button (search icon, clear, etc.)`
- L547: `Single transition token — components reference this, not a list`
- L560: `Card — one step above panels so blocks read off the page`
- L571: `Range slider — must exist on plain :root (Pattern Generator, etc.); banner app may override`
- L607: `Text colors (semantic) — Practical · Neutral dark`
- L638: `1 = ON, 0 = OFF` (annotation on --ts-resize-enabled)
- L656-668: `ROOT 1b — SEMANTIC COLOR PALETTE — 7 semantic color families. Each family: base + dim + bright + dark. Ladder math (per family): dim = color-mix(base 50%, --ts-bg-body); bright = color-mix(base 80%, white); dark = color-mix(base 60%, black). NEW tokens use --ts-color-* namespace. EXISTING tokens (--ts-success, --ts-warning, --ts-danger, --ts-info) are aliased to the new tokens for backward compat — do NOT remove. NEW-B15 / 2026-04-25`
- L705: `Backward-compat aliases (--ts-danger widely used — keep both)`
- L768: `Neutral ramp (semantic — same names work in light & dark)`
- L780: `Grid background system - fully tokenized`
- L800: `OWNER FIX UPDATE: Tunable knobs — override per-instance or per-context`
- L810: `The formula — declared ONCE, consumed everywhere`
- L816-822: `DYNAMIC GRADIENT + HOVER/ACTIVE SYSTEM — Define once, reuse everywhere. Just set --ts-this-bg on any element and the rest auto'generates. Hover, active, focus, disabled states are fully automatic.`
- L825: `✅ BUTTON SCALING TOKENS - Global inheritance for perfect scaling`
- L826: `The base unit — single knob to retune the whole button system`
- L831-833: `RATIO TOKENS — each derives one dimension from --ts-btn-size. Tune any of these globally without math; per-size variants override individually.`
- L835: `h = size × this        (was hardcoded 1)`
- L845: `DERIVED — never override these directly; tune the ratios above`
- L857: `✅ ACCENT TOKENS - Global inheritance for dynamic theming`
- L864-866: `Auto on-accent: oklch auto-selects white or black text for accent backgrounds. Dark mode: threshold 0.75 — only very light accents (yellow, lime, cyan) get black text. Mid-tone accents like orange/red keep white text for dark-mode visual consistency.`
- L880: `✅ ACCENT GRADIENTS - Dynamic gradient system`
- L888: `If --ts-this-bg is not set, fallback to a neutral surface`
- L916-918: `GRADIENT CONTROL TOKENS — Tune the gradient feel from one place. Override on any scope to control the look across the entire subtree.`
- L930-933: `BORDER STATE TOKENS — All borders derive from --ts-this-bg using a single control token: --ts-mix-perc (intensity %). Override --ts-mix-perc on any scope to control border contrast across the entire subtree.`
- L945: `HOVER, ACTIVE, FOCUS, DISABLED (automatic)`
- L958-961: `AUTO TEXT-ON-SURFACE (OKLCH luminance pivot) — Mirrors --ts-on-accent. Generates readable text color for ANY --ts-this-bg value by flipping to white when the surface is dark and to near-black when the surface is light. Tunable threshold.`

### `surface-alt-nested-...css`
- Filename-embedded: `surface-alt-nested-auto-section-card-input-surface-design-pattern(analyze showcase output and notes this is the olds original version prototype but the result is what is expected).css` — primary owner directive: OLD prototype CSS but EXPECTED visual result.
- L1-105: `#MAIN_BG_SURFACE` — full ~105-line owner spec/brief for the main surface engine: purpose, scope, refactor requirements, `@migrate_up` rules (with 19-rule reference migration set), token constraints (`@ts-sectionKEY_token`), cascade requirements, goal: isolate this block as pure base `.ts-section` surface + contrast engine.
- L107-119: `.ts-section:nth-of-type(odd):not(...)` rule with embedded `@ts-sectionKEY_token` and commented-out `--ts-this-bg-border` override.
- L116-118: `--ts-this-bg-border: color-mix(in srgb, var(--ts-this-bg), var(--ts-text-primary-dim) 25%);` (commented-out; preserves the math for future restoration).
- L128, L179, L216, L222, L232, L238, L261, L289, L304, L320, L331, L355, L371: `@ts-section-auto-bg_dedupe` markers (across base engine — places where rules are duplicated with the alt block).
- L178: `Base input style`
- L193: `/* border-radius: var(--ts-input-radius) !important; */` (commented-out structural rule).
- L206: `/* align-items: center; */` (commented-out structural rule).
- L386: `#END_REVIEW Special #MAIN_BG_SURFACE syling scrope for nested inputsinside cards for contrsst radio on normal style sections with contrast rules`
- L389-530: `ALT SURFACE ENGINE — NESTED INPUTS (CARD CONTEXT)` — full ~140-line owner spec for the alt surface engine: purpose, strict scope (color/bg/border/shadow only, NO layout/sizing/spacing/typography), architecture relation, `@migrate_up` rules, dedupe rules, token constraints, cascade logic, ALT class + auto alternation logic, and the explicit ruling: "Manual `.ts-section--alt` must override automatic alternation safely. This prevents selector conflicts and cross-browser inconsistencies. This is NOT an error — it is required for stability."
- L551: `note: this rule excludes the alt class too, becasue if the rule uis enfoced by the suer, the odd and even logic will breka the css matching styling and may conflict oin soem browser,s so overriding the class usage is better than forcing the class enfocement. FONT REMOVE THE ALT SECITON EXCLUSION, IS NOT AN ERROR.`
- L535, L537, L539, L541, L543, L545, L547, L556, L558, L561, L563, L565, L567, L569, L571, L573, L575, L577, L579, L581, L583, L585, L593, L595, L597, L600, L744: `@ts-sectionKEY_token` markers (across alt engine — these tag the variant-differentiating token assignments owner forbids removing/relocating).
- L559, L591, L603, L640, L657, L685, L711, L782, L786: `@ts-section-auto-bg_dedupe` markers (alt-engine duplicate-rule flags).
- L602, L604: `Base input style`
- L624: `/* background-image: var(--ts-this-bg-grad-3); */` (commented-out gradient on input bg).
- L666, L668, L670, L689, L691, L693, L695, L697, L704: `@migrate_up` markers — each marks an individual non-color declaration (border-radius, padding-block, font-size, height, transition) owner wants relocated out of the alt-surface engine.
- L800: `#END_REVIEW Special styling scope for nested inputs inside card components for alt variant.`

---

## Summary

- **3 files cataloged.**
- **Total annotations extracted:** ~120 line-numbered owner annotations across the three files (well over 80 distinct ones).
- **Two critical REFACTOR notes** preserved verbatim: spacing `sp-17..24` deprecation (L355-371) and button radius/scaling deficiency (L497-503).
- **Two extended architectural specs** preserved verbatim: main surface engine brief (L1-105) and alt surface engine brief (L389-530) in the surface-alt file.
- **Filename-embedded owner directive captured** for the third file (OLD prototype / EXPECTED result).
- **Three semantic tagging systems documented:** `@ts-sectionKEY_token` (preserve), `@migrate_up` (relocate non-color rules), `@ts-section-auto-bg_dedupe` (deduplicate cross-block duplicates).
- **Gaps vs `_code-audit-catalog.md`:** primary novelties are (a) the alternation cascade contract (main + alt + auto-alternation + exclusion logic), (b) the `--_input-*` private-token convention, (c) the `--ts-main-surface-bg` / `--ts-alt-surface-bg` text-pivot derivation, (d) several long verbatim refactor briefs not previously quoted, (e) the per-rule `@migrate_up` annotation system, and (f) the `[class^="ts-surface-"]` attribute-selector engine with `&.ts-dim-1..4` nested modifiers (not spelled out in catalog).


---

# Extracted Blocks Catalog — Section 2: Layout Utilities

**Sub-agent:** 2  ·  **Chunk:** root layout files  ·  **Files:** 3  ·  **Total bytes:** ~18,910

## Files in this chunk

| File | Lines | Bytes | Block type |
|---|---|---|---|
| configuration-utilities.css | 89 | 2,492 | utilities (framework configuration toggles + Locomotive guards) |
| global-layout-utilities.css | 980 | 13,351 | utilities (spacing/display/text/border/interactive — Tailwind-like utility classes mapped onto `--ts-sp-*` and other system tokens) |
| global-layout-utilities-2.css | 142 | 3,067 | layout + component pattern (re-declares §8e elastic/fullpage utilities and adds the `.ts-parallax` view component) |

## Per-file catalog

### configuration-utilities.css

- **Path:** `docs/references/toolskin.css_extracted-core-blocks-to-refactor/configuration-utilities.css`
- **Lines:** 89  ·  **Bytes:** 2,492
- **Block type:** utilities — "framework configuration utilities" toggles + Locomotive/scroll-reveal compatibility guards. Owner-marked `§8e`.
- **Key `--ts-*` tokens declared:** none (this file *consumes* tokens; it does not declare any).
- **Key `--ts-*` tokens referenced:** `--ts-sp-8`, `--ts-content-max` (fallback `900px`).
- **Key `.ts-*` classes defined:**
  - `.ts-no-grain` (+ `:root.ts-no-grain .ts-grain` and `::before` variants) — kill-switch for the grain layer.
  - `.ts-layout-elastic` (+ descendant `.ts-container`) — fullwidth Brutalist layout mode.
  - `.ts-layout-content .ts-container` — narrower content-focused layout.
  - `:root.ts-fullpage` + descendant `.ts-section` / `.ts-hero` — vertical scroll-snap fullpage mode.
  - `[data-scroll-container]:not(.ts-grain)` and `[data-scroll]` — Locomotive Scroll `will-change` hints.
  - Locomotive transform-suppression selector set: `section.ts-grain[data-scroll]`, `.ts-hero.ts-grain[data-scroll]`, `.ts-section.ts-grain[data-scroll]`, `.ts-grain[data-scroll]`, `.ts-section-divider[data-scroll]`, `.ts-container[data-scroll]`.
  - Reveal-animation preservation selector set: `.ts-fade-up[data-scroll]`, `.ts-fade-in[data-scroll]`, `.ts-fade-left[data-scroll]`, `.ts-fade-right[data-scroll]`, `.ts-zoom-in[data-scroll]`, `.ts-zoom-out[data-scroll]`, `.ts-slide-up[data-scroll]`.
  - `[data-scroll][data-ts-parallax="true"]` — explicit parallax opt-in.
  - `.ts-grain [data-scroll]:not(.ts-fade-up):not(.ts-fade-in):not(.ts-fade-left):not(.ts-fade-right)` — inner-element transform allowance.
- **Owner annotations VERBATIM with line numbers:**
  - L1: `/* ─── §8e  Framework Configuration Utilities ─────────────────────────── */`
  - L3: `/* Disable noise/grain globally or per-element */`
  - L14: `/* Elastic/Brutalist fullwidth layout */`
  - L26: `/* Content-focused layout (narrower) */`
  - L31: `/* Fullpage snap scrolling mode */`
  - L44: `/* Locomotive Scroll container */`
  - L53: `/* CRITICAL: Prevent Locomotive from breaking layouts */`
  - L54-56: `/* Don't apply transforms to layout-critical elements.\n\tNOTE: .ts-fade-up and .ts-fade-in are EXCLUDED — they need their\n\ttransforms for scroll reveal animations to work correctly. */`
  - L67-68: `/* Reveal animations MUST keep their transforms even with [data-scroll].\n\tThe transition handles the animation; Locomotive should not override. */`
  - L79: `/* Only allow transforms on specifically tagged parallax elements */`
  - L85: `/* Allow transforms on inner elements that aren't animated */`
- **Refactor flags:**
  - Heavy reliance on `!important` (every property in the elastic/content/Locomotive guard rules). Necessary today because Locomotive Scroll writes inline `transform` styles at runtime — but `!important` chains are a long-term tech debt.
  - The `.ts-no-grain` rules use `!important` to override the `.ts-grain::before` SVG turbulence painted by `ToolskinGridBg` — coupling between this utility and the JS grain engine is implicit and untyped.
  - This file overlaps with `global-layout-utilities-2.css` (lines 14-43 are duplicated almost verbatim — see contradictions below).
- **Session 3 relationship:** does NOT directly touch the surface chain (`a0ea9e4`). It interacts with two adjacent layers:
  1. **`tools/locomotive`-class JS** (audit catalog §1.9) — these CSS rules are the static counterpart to `ToolskinLocomotive`.
  2. **Future scroll-reveal CSS** — the `.ts-fade-*` / `.ts-zoom-*` / `.ts-slide-up` selectors imply a reveal-animation layer not yet in scope.
  No surface tokens touched. Safe to defer past Sessions 3/4.
- **Gap vs `_code-audit-catalog.md`:**
  - (a) Already covered: existence of `.ts-no-grain` and `.ts-fullpage` is mentioned in the State/utility class list at L590 of the catalog. The `locomotiveScroll` config block at L77 references `ToolskinLocomotive` (L117) and `ToolskinParallaxFallback` (L184) classes.
  - (b) NEW vs catalog: the explicit selector list of "elements where Locomotive transforms are forbidden" and the "reveal animations that must keep transforms" set is not catalogued. The owner's CRITICAL comment at L53 + the dual rule architecture (forbid on layout, allow on reveals) is the design intelligence.
  - (c) Contradictions: catalog L590 lists `.ts-fullpage` as a state/utility class but does not surface that `:root.ts-fullpage` also activates a per-section scroll-snap with `min-height: 100vh` that would interact with section heights elsewhere — minor docs gap, not a contradiction.

---

### global-layout-utilities.css

- **Path:** `docs/references/toolskin.css_extracted-core-blocks-to-refactor/global-layout-utilities.css`
- **Lines:** 980  ·  **Bytes:** 13,351
- **Block type:** utilities — Tailwind-like atomic utility classes for spacing, display, text, border, interactive cursor/select. Owner-marked sections `§7a` through `§7e`.
- **Key `--ts-*` tokens declared:** none. This file is 100% token consumer.
- **Key `--ts-*` tokens referenced (heavy):**
  - Spacing: `--ts-sp-1` through `--ts-sp-20` (consumed by margin/padding/gap utilities).
  - Container: `--ts-container-sm`, `--ts-container-md`, `--ts-container-lg`, `--ts-container-xl`.
  - Border: `--ts-border-0`, `--ts-accent-border`.
  - Radius: `--ts-radius-md`, `--ts-radius-full`.
- **Key `.ts-*` classes defined (grouped — full list is ~150 utilities):**
  - **Margin (§7a):** `.ts-mt-0` through `.ts-mt-20`, `.ts-mb-0` through `.ts-mb-20`, `.ts-mx-auto`, `.ts-ml-auto`, `.ts-mr-auto`.
  - **Padding (§7a):** `.ts-p-0..20`, `.ts-pt-0..20`, `.ts-pb-0..20`, `.ts-pr-0..20`, `.ts-pl-0..20`, `.ts-px-0..20`, `.ts-py-0..20`.
  - **Max-width (§7a):** `.ts-max-w-sm/-md/-lg/-xl/-none/-prose/-120/-560/-600/-900` (note: `-prose`, `-120`, `-560`, `-600`, `-900` are hardcoded px, not tokenized).
  - **Gap (§7a):** `.ts-gap-1/-2/-3/-4/-5/-6/-8` (gaps 7, 9-20 missing — intentional?).
  - **Flex (§7a):** `.ts-flex-1`, `.ts-flex-row`, `.ts-flex-col`, `.ts-flex-wrap`, `.ts-items-center`, `.ts-items-start`, `.ts-justify-center`, `.ts-justify-between`, `.ts-w-fit`, `.ts-h-full`, `.ts-cursor-pointer`.
  - **Display/visibility (§7b):** `.ts-hidden` (uses both `visibility: hidden !important` AND `display: none`), `.ts-visible`, `.ts-visible:not(.ts-tilt, :hover)`, `.ts-invisible`, `.ts-sr-only`.
  - **Text (§7c):** `.ts-truncate`, `.ts-line-clamp-2`.
  - **Border (§7d):** `.ts-border`, `.ts-border-t`, `.ts-border-b`, `.ts-border-accent`, `.ts-rounded`, `.ts-rounded-full`.
  - **Interactive (§7e):** `.ts-cursor-pointer` (duplicate of §7a definition — see below), `.ts-select-none`, `.ts-no-events`.
- **Owner annotations VERBATIM with line numbers:**
  - L1-3: `/* ═══════════════════════════════════════════════════════════════════════\n\t§7  UTILITIES\n\t═══════════════════════════════════════════════════════════════════════ */`
  - L5: `/* ─── §7a  Spacing Utilities ────────────────────────────────────────── */`
  - L775: `/* Max-width utilities */`
  - L816: `/* Gap overrides */`
  - L845: `/* Flex utilities */`
  - L893: `/* ─── §7b  Display / Visibility ─────────────────────────────────────── */`
  - L925: `/* ─── §7c  Text Utilities ───────────────────────────────────────────── */`
  - L941: `/* ─── §7d  Border Utilities ─────────────────────────────────────────── */`
  - L967: `/* ─── §7e  Interactive / Cursor ─────────────────────────────────────── */`
- **Refactor flags:**
  - **Duplicate class definition:** `.ts-cursor-pointer` defined twice — L888-890 (in §7a Flex utilities) AND L969-971 (in §7e Interactive). Identical bodies, but two definitions of the same selector indicates organization drift.
  - **Hardcoded max-width values bypass tokens:** `.ts-max-w-prose: 640px` (L797), `.ts-max-w-120: 120px` (L801), `.ts-max-w-560: 560px` (L805), `.ts-max-w-600: 600px` (L809), `.ts-max-w-900: 900px` (L813). These should reference container or content tokens, not raw px. Especially `-560/-600/-900` look like ad-hoc additions.
  - **`.ts-gap-7` and `.ts-gap-9..20` missing** — gap utilities only cover 1-6 and 8. Likely incomplete vs the 1-20 margin/padding coverage.
  - **`.ts-hidden` redundancy:** sets BOTH `visibility: hidden !important` AND `display: none` (L895-898). `display: none` already removes from rendering; `visibility: hidden !important` is redundant unless something else fights it.
  - **`!important` on border-radius:** `.ts-rounded` and `.ts-rounded-full` both use `!important` (L960, L964). Means component-level radius cannot override these utilities without `!important` of its own.
  - **`.ts-visible:not(.ts-tilt, :hover)` (L905-907)** — uses CSS Selectors L4 `:not()` with comma list. Browser support is good (~2022+) but worth flagging for compatibility audits.
  - **No `.ts-m-*` (all-sides margin) utilities** — only `mt/mb/mx/ml/mr` are present. Asymmetric with padding (which has `.ts-p-*` for all sides).
- **Session 3 relationship:** purely consumes `--ts-sp-*`, `--ts-border-0`, `--ts-accent-border`, `--ts-radius-*`, `--ts-container-*`. Does NOT touch the `--ts-this-bg` superposition chain committed in `a0ea9e4`. Safe to migrate to the rebuild's token namespace verbatim once spacing/radius/border/container tokens are finalized. Will inform a future `utilities.css` layer.
- **Gap vs `_code-audit-catalog.md`:**
  - (a) Already covered: catalog L487-490 documents `--ts-sp-*` scale (with the L490 caveat that `--ts-sp-17..24` are flagged "CRITICAL IMPLEMENTATION ERROR" in toolskin.css L442-457). This utility file consumes `--ts-sp-17..20`, so it inherits the unusable values. Catalog L590 mentions `.ts-hidden` as a state/utility class. Catalog L501 documents `--ts-container-sm/md/lg/xl`. Catalog L493 covers radius scale.
  - (b) NEW vs catalog: the comprehensive utility class inventory (Tailwind-like atomic system) is not catalogued anywhere in `_code-audit-catalog.md`. The duplicate `.ts-cursor-pointer` definition is new. The hardcoded `.ts-max-w-{120,560,600,900}` token leak is new. The `.ts-gap-*` gaps (1-6, 8 only) is new. The `.ts-hidden` double-property design is new.
  - (c) Contradictions: catalog L490 says `--ts-sp-17..24` are "CRITICAL IMPLEMENTATION ERROR" — but this utility file declares `.ts-mt-17`, `.ts-mt-18`, `.ts-mt-19`, `.ts-mt-20` (and the matching mb/p/pt/pb/pl/pr/px/py variants). So the utility classes EXIST for the broken token range. This is a real cross-file inconsistency: removing `--ts-sp-17..20` per the in-source REFACTOR NOTE would orphan ~40 utility classes that consume them.

---

### global-layout-utilities-2.css

- **Path:** `docs/references/toolskin.css_extracted-core-blocks-to-refactor/global-layout-utilities-2.css`
- **Lines:** 142  ·  **Bytes:** 3,067
- **Block type:** layout (re-declares elastic/fullpage utilities from `configuration-utilities.css`) + component pattern (introduces `.ts-parallax` view component). Owner annotation `/* Width helpers */` at top suggests this is a continuation/append of `global-layout-utilities.css`.
- **Key `--ts-*` tokens declared (LOCAL component overrides — anti-pattern):**
  - L53: `--ts-bg-0: black;` (declared inside `.ts-parallax__overlay`)
  - L61: `--ts-text-primary: white;` (declared inside `.ts-parallax__content h2`)
  - L69: `--ts-text-secondary: #ffffff6b;` (declared inside `.ts-parallax__content p`)
- **Key `--ts-*` tokens referenced:** `--ts-content-max` (fallback `900px`), `--ts-sp-2/3/4/6/8/10/20`, `--ts-fs-sm`, `--ts-fs-lg`, `--ts-letter-spacing-wider`, `--ts-text-secondary`, `--ts-border-0`, `--ts-bg-0`, `--ts-card-pad`.
- **Key `.ts-*` classes defined:**
  - `.ts-w-full`, `.ts-w-auto`, `.ts-h-full` — width/height helpers (NOTE: `.ts-h-full` is duplicated from `global-layout-utilities.css` L884).
  - `.ts-layout-elastic` + `.ts-layout-elastic .ts-container` — DUPLICATE of `configuration-utilities.css` L14-24.
  - `.ts-layout-content .ts-container` — DUPLICATE of `configuration-utilities.css` L27-29.
  - `:root.ts-fullpage` + scroll-snap selectors — DUPLICATE of `configuration-utilities.css` L32-42.
  - `.ts-parallax`, `.ts-parallax__overlay`, `.ts-parallax__content` (+ `h2`, `p`, `.ts-overline` descendants), `.ts-parallax__bg` — parallax hero/banner component (BEM-style modifiers).
  - `section.ts-h-full`, `section.ts-h-70`, `section.ts-h-50` (compound selectors) — fixed-attachment parallax section heights.
  - `.ts-parallax .ts-card > .ts-card-header.absolute` — card-header positioning inside parallax containers.
  - `.ts-parallax .ts-card:has(> .ts-card-header.absolute)` — `:has()` selector to add top padding when an absolute card-header is present.
  - `.demo-panel-col` — non-tokenized demo class (NOT `ts-` prefixed — likely scratch markup).
- **Owner annotations VERBATIM with line numbers:**
  - L1: `/* Width helpers */`
  - L15: `/* Elastic/Brutalist fullwidth layout */`
  - L27: `/* Content-focused layout (narrower) */`
  - L32: `/* Fullpage snap scrolling mode */`
- **Refactor flags:**
  - **CRITICAL — token sabotage / local override pattern:** L53 `--ts-bg-0: black;`, L61 `--ts-text-primary: white;`, L69 `--ts-text-secondary: #ffffff6b;` are declared **inside component selectors**, overriding the cascade scope. This is the exact "component declares system tokens" anti-pattern that Toolskin Design Tokens 2.0 forbids — components should only consume System tokens, never re-declare them. The `--ts-text-secondary: #ffffff6b` is also a hex literal with an alpha hack (`6b` = ~42% alpha), bypassing any apcach/OKLCH derivation. Direct hardcoded values that escape the design system.
  - **CRITICAL — DUPLICATION:** L15-43 are nearly byte-identical to `configuration-utilities.css` L14-42. Two source files contain the same `.ts-layout-elastic`, `.ts-layout-content`, and `:root.ts-fullpage` rules. One must be deleted in the rebuild; whichever ships last wins by source order, creating a fragile dependency on file ordering.
  - **Magic numbers:** L57 `font-size: clamp(2rem, 5vw, 3.5rem)` — clamp range not tokenized. L82 `max-width: 700px` — hardcoded. L90 `filter: brightness(0.35) saturate(1.4)` — magic values. L132 `height: 35px !important` — magic.
  - **`!important` proliferation:** L98-106 — `section.ts-h-full/-h-70/-h-50` block uses `!important` on `border-block-style`, `overflow`, `position`. Also L132 `height: 35px !important`, L136 `padding-top: calc(...) !important`.
  - **`section.ts-h-70` and `section.ts-h-50` are referenced but NOT defined** — these classes set `background-attachment: fixed`, but no companion utility class declares the `height: 70vh` / `height: 50vh` (or whatever was intended). Likely defined elsewhere; broken if not.
  - **`.demo-panel-col` (L139-143) lacks `ts-` prefix** — violates the design system's naming convention. Looks like leftover demo/scaffolding markup that should not be in a utility file.
  - **`:has()` selector (L135)** — modern selector; needs browser-support audit (Chromium 105+/Safari 15.4+/Firefox 121+).
  - **`background-attachment: fixed` (L89, L98)** — known performance and mobile compatibility issue; can break iOS Safari scrolling and cause repaints. Should be flagged as `@media (hover: hover) { ... }` or behind a feature query.
- **Session 3 relationship:**
  - **DIRECT IMPACT on surface chain:** L53 `--ts-bg-0: black` is a local override of a System surface token. If `.ts-parallax__overlay` ever appears inside a surface-superposition chain (like the one rebuilt in `surfaces.css`, commit `a0ea9e4`), this will BREAK the inheritance — `--ts-bg-0` is one of the keys the propagation engine reads from. The rebuild's `system/surfaces.css` must reject this pattern, or migrate parallax to use a derivative token (`--ts-this-bg`).
  - **DIRECT IMPACT on future `text.css`:** L61, L69 hardcode `--ts-text-primary: white` and `--ts-text-secondary: #ffffff6b`. These bypass the OKLCH `--ts-on-accent` auto-contrast pipeline (audit catalog L527 documents). The text layer rebuild must explicitly forbid component-local text token declarations.
  - **Informs future scroll/animation layer** — `.ts-parallax` + the `section.ts-h-*` set is the static side of the `ToolskinParallaxFallback` JS (audit catalog §1.20, L184).
- **Gap vs `_code-audit-catalog.md`:**
  - (a) Already covered: catalog §1.20 documents `ToolskinParallaxFallback`. Catalog L578 lists `.ts-bg-parallax` in the background engine class set (but not `.ts-parallax` itself). Catalog L501 covers `--ts-container-*`. Catalog L590 documents `.ts-fullpage` state class.
  - (b) NEW vs catalog: `.ts-parallax` + `.ts-parallax__overlay` + `.ts-parallax__content` + `.ts-parallax__bg` BEM family is not catalogued. The local-override anti-patterns (L53, L61, L69) are not catalogued. The duplication of layout utilities between this file and `configuration-utilities.css` is not catalogued. The `section.ts-h-{full,70,50}` parallax-section pattern is not catalogued. `.demo-panel-col` non-prefixed leak is not catalogued.
  - (c) Contradictions: catalog L578 names `.ts-bg-parallax` (a background engine variant), but this file declares `.ts-parallax` (no `-bg-` prefix), suggesting either a naming inconsistency in the source or two separate parallax systems. Owner should clarify.

---

## Annotation index (this section, line-numbered, verbatim)

- configuration-utilities.css:L1: `/* ─── §8e  Framework Configuration Utilities ─────────────────────────── */`
- configuration-utilities.css:L3: `/* Disable noise/grain globally or per-element */`
- configuration-utilities.css:L14: `/* Elastic/Brutalist fullwidth layout */`
- configuration-utilities.css:L26: `/* Content-focused layout (narrower) */`
- configuration-utilities.css:L31: `/* Fullpage snap scrolling mode */`
- configuration-utilities.css:L44: `/* Locomotive Scroll container */`
- configuration-utilities.css:L53: `/* CRITICAL: Prevent Locomotive from breaking layouts */`
- configuration-utilities.css:L54-56: `/* Don't apply transforms to layout-critical elements.\n\tNOTE: .ts-fade-up and .ts-fade-in are EXCLUDED — they need their\n\ttransforms for scroll reveal animations to work correctly. */`
- configuration-utilities.css:L67-68: `/* Reveal animations MUST keep their transforms even with [data-scroll].\n\tThe transition handles the animation; Locomotive should not override. */`
- configuration-utilities.css:L79: `/* Only allow transforms on specifically tagged parallax elements */`
- configuration-utilities.css:L85: `/* Allow transforms on inner elements that aren't animated */`
- global-layout-utilities.css:L1-3: `/* ═══════════════════════════════════════════════════════════════════════\n\t§7  UTILITIES\n\t═══════════════════════════════════════════════════════════════════════ */`
- global-layout-utilities.css:L5: `/* ─── §7a  Spacing Utilities ────────────────────────────────────────── */`
- global-layout-utilities.css:L775: `/* Max-width utilities */`
- global-layout-utilities.css:L816: `/* Gap overrides */`
- global-layout-utilities.css:L845: `/* Flex utilities */`
- global-layout-utilities.css:L893: `/* ─── §7b  Display / Visibility ─────────────────────────────────────── */`
- global-layout-utilities.css:L925: `/* ─── §7c  Text Utilities ───────────────────────────────────────────── */`
- global-layout-utilities.css:L941: `/* ─── §7d  Border Utilities ─────────────────────────────────────────── */`
- global-layout-utilities.css:L967: `/* ─── §7e  Interactive / Cursor ─────────────────────────────────────── */`
- global-layout-utilities-2.css:L1: `/* Width helpers */`
- global-layout-utilities-2.css:L15: `/* Elastic/Brutalist fullwidth layout */`
- global-layout-utilities-2.css:L27: `/* Content-focused layout (narrower) */`
- global-layout-utilities-2.css:L32: `/* Fullpage snap scrolling mode */`


---

# Extracted Blocks Catalog — Section 3: Effects + Special Sections

**Sub-agent:** 3  ·  **Chunk:** root effects files  ·  **Files:** 2  ·  **Total bytes:** ~22,231

## Files in this chunk

| File | Lines | Bytes | Block type |
|---|---|---|---|
| grid-bg-anim.css | 307 | 10,356 | special section / effects — CSS grid background engine v1.0, dot-grid overlay, mouse-parallax interactive variant, accent-glow + grain composition, plus `:root` fallback defaults for the JS `ToolskinGridBg._applyVars` runtime |
| effects-layers-special-sections-css.css | 494 | 11,875 | effects + animations — scroll-reveal class library (`.ts-fade-*`/`.ts-zoom-*`/`.ts-slide-*`/`.ts-flip-up`/`.ts-bounce-in`/`.ts-reveal`), glow tokens, shimmer/scanline/headline-sweep, focus-ring, skeleton loader, scroll-driven parallax, viewport-paused utility |

## Per-file catalog

### grid-bg-anim.css

- **Path:** `docs/references/toolskin.css_extracted-core-blocks-to-refactor/grid-bg-anim.css`
- **Lines:** 307  ·  **Bytes:** 10,356
- **Block type:** special-section / effects engine — the CSS half of `ToolskinGridBg` (audit catalog §1 — "gridBg" config L84 + `_applyVars` L4349). Renders the radial-glow + grid-line + dual-dot-layer composition; supports `.anim`, `.interactive`, and `.ts-grain` modifier combinations.
- **Key `--ts-*` tokens declared (in the `:root` fallback block, L290–307):**
  - Grid geometry: `--ts-grid-size`, `--ts-grid-width` (`!important`, defaults to `--ts-grid-size`), `--ts-grid-height` (`!important`, defaults to `--ts-grid-size`), `--ts-point-gap-width` (`!important`), `--ts-point-gap-height` (`!important`)
  - Grid stroke: `--ts-line-color: var(--ts-border-1)`, `--ts-grid-line-opacity: 40%`
  - Dot layers: `--ts-dot-alpha: 1`, `--ts-dot-color: var(--ts-accent)`, `--ts-dot-size: 2px`, `--ts-dot-scale: 1`, `--ts-dot-speed: 50s`
  - Glow + noise: `--ts-grid-gradient-opacity: 0.2`, `--ts-grid-gradient-pos: bottom left`, `--ts-grid-noise-opacity: 0.75`
- **Key `--ts-*` tokens referenced (consumed but not declared here):**
  - Surface chain (legacy): `--ts-bg-0` (L24, L152), `--ts-bg-1` (L21, L24), `--ts-bg-2` (L22), `--ts-bg-3` (L23)
  - Accent chain: `--ts-accent` (L168, L176, L298 default), `--ts-accent-dim` (L22), `--ts-accent-dim-2` (L23)
  - Border chain: `--ts-border-1` (L193, L195, L294 default)
- **Custom property registration:** `@property --animation-offset-y` (L5–9) — registers a `<percentage>` typed property, non-inheriting, `initial-value: 0%`. This is the only `@property` declaration in the file and powers the `move-performant-var` keyframes (L273–281) used by `.anim.grid-bg.interactive .ts-section-color-overlay:after` (L253–257).
- **Key `.ts-*` / `.grid-bg` classes defined:**
  - Base: `.grid-bg_v1`, `.grid-bg_v1.ba-grid` (+ `:before`/`:after` pseudos), `.grid-bg`, `.ba-grid` (+ `::before`/`::after`)
  - Modifiers: `.anim.grid-bg_v1`, `.anim.grid-bg`, `.grid-bg.interactive`, `.anim.grid-bg.interactive`, `.anim.interactive.grid-bg`, `.ba-grid.ts-grain`, `.ba-grid:not(.ts-grain)::before`
  - Inner overlays: `.ts-section-color-overlay` + `:before`/`:after`, including `.grid-bg .ts-section-color-overlay`, `.grid-bg.interactive .ts-section-color-overlay`, `.anim.grid-bg .ts-section-color-overlay:after`/`:before`
  - State guards: `.grid-bg[style*="animation-play-state: paused"] #ts-gradient-canvas` and `.ts-oce-video-bg` (L107–112); `.grid-bg[style*="animation-play-state: paused"] .ts-section-color-overlay::before/::after` (L284–287)
  - Z-index protector: `.grid-bg > *:not(.ts-section-color-overlay, .ts-effects-layer, .ts-color-overlay-layer, .ts-grain-layer, #ts-gradient-canvas, .ts-oce-video-bg, canvas, iframe)` (L102–105)
  - Theme override: `[data-theme="light"] .ba-grid::after` (L200–202) — bumps `--ts-grid-line-opacity` to `0.9` in light mode
- **Keyframes defined:** `move_v1` (L83–91), `move-performant` (L263–271), `move-performant-var` (L273–281)
- **Owner annotations VERBATIM with line numbers:**
  - L3: `/* CSS GRID BACKGROUND ANIMTION V_1.0 */`
  - L93: `/* END CSS GRID BACKGROUND ANIMTION */`
  - L95–99: `/* ─── Grid-bg z-index stack ───────────────────────────────────────────\n\t0 = ba-grid:before (grid lines)\n\t0 = ts-section-color-overlay (dot layers)\n\t5 = all other children (content)\n\t───────────────────────── */`
  - L101: `/* Content sits above all background layers — exclude effect/overlay layers */`
  - L114–115: `/* Overlay: z-index 3 so dots sit above grid lines(1) and color overlay(2).\n\tNo isolation — grain is on its own topmost layer now, no conflict. */`
  - L140–142: `/* TODO: position:relative removed — was creating stacking context that\n\tfought with effects-layer absolute positioning. Grid-bg on effects-layer\n\tinherits position:absolute from .ts-effects-layer instead. */`
  - L145–148: `/* ── Grid background base ─────────────────────────────────────────────\n\tOpaque dark background-color. Gradient glow on a separate pseudo-element\n\tso it doesn't fight with background-image !important chains.\n\tAll values driven by CSS custom properties (set by JS ToolskinGridBg). */`
  - L155–157: `/* ── Accent glow (::before when NO ts-grain) ─────────────────────────\n\tWhen ts-grain IS present, ::before is used for noise (set by .ts-grain rules) —\n\tthe glow is applied on the section background-image instead. */`
  - L172–173: `/* When ts-grain IS present: glow baked into the section background-image\n\tusing 30% accent (safe color-mix, no calc) */`
  - L180–182: `/* ── Grid lines (::after) ────────────────────────────────────────────\n\tStays fixed (doesn't move with mouse parallax).\n\tOpacity controlled by --ts-grid-line-opacity (set by JS). */`
  - L220: `/* Outer dot layer — smaller, subtler (restored to initial design values) */`
  - L226: `/* Inner dot layer — scale factor controllable via --ts-dot-scale */`
  - L259–261 (commented-out block): `/*.anim.interactive.grid-bg .ts-section-color-overlay:before {\n\tanimation: move-performant-var var(--ts-dot-speed) linear infinite; \n\t}*/`
  - L283: `/* Pause all child animations when section is off-screen (set by JS IntersectionObserver) */`
  - L289: `/* --- Grid-bg CSS fallback defaults (overridden by JS ToolskinGridBg._applyVars) --- */`
  - L296: `/* Dot color: default = accent. JS overrides with color-mix for alpha control. */`
  - L300: `/* Inner dot layer scale factor — controllable via editor */`
- **Refactor flags:**
  - **Legacy surface tokens** — every gradient in `.grid-bg_v1.ba-grid` (L21–24) and the `background-color: var(--ts-bg-0)` on `.ba-grid` (L152) reference the *flat numbered* `--ts-bg-0..3` chain, NOT the new `--ts-this-bg` derivative chain installed in the surfaces engine (commit `a0ea9e4`). Per the rebuild Phase 0–5 mandate (`design-tokens-2.0` skill), these MUST migrate to `--ts-this-bg-*` derivatives so the engine propagates correctly when this layer is nested inside any surface.
  - **`!important` ladders** — L21–25, L43, L46, L57–58, L102–105 (z-index), L107–112 (display kill), L197 (background-size), L249 (interactive background-image override), L286–287 (animation-play-state). The engine relies on `!important` to win over inline styles set by JS, but each instance is a long-term coupling debt.
  - **`@keyframes ts-shimmer` duplicate** is not in this file (it lives in §8c — see file 2). However, this file defines `move-performant` AND `move-performant-var` — the variable-driven version uses `@property --animation-offset-y` to enable smooth `translateY` interpolation, while the non-var version animates `transform` directly. Both coexist; selector specificity decides which fires per modifier combo. Worth a council note: are both needed, or can the var-version subsume the legacy one?
  - **Stacking-context comment at L114–115 contradicts L95–99 z-index map.** L95–99 says "0 = ts-section-color-overlay"; L116–119 then declares `z-index: 3` on `.grid-bg .ts-section-color-overlay`. The comment at L114–115 documents the resolution ("dots above grid lines(1) and color overlay(2)") but the L95–99 ASCII map needs updating.
  - **Hardcoded animation durations** (`6.4s`, `3.2s`, `1.6s`, `30s`, `12.4s`) inside `.anim.grid-bg_v1:after`, `.ts-section-color-overlay:after/:before` (L72, L76, L80, L235, L240). These should likely flow through `--ts-dot-speed` or a new `--ts-grid-anim-*` token family — currently the only tokenized speed is `--ts-dot-speed` (default `50s`) used in the `move-performant-var` chain.
  - **Light-theme opacity bump** (L200–202) is the only theme-aware rule in the file. Other tokens (`--ts-dot-color`, `--ts-grid-gradient-opacity`) likely also need light-mode counterparts; currently they cascade from the accent + border chain which IS theme-aware, so it may be intentional. Flag for council.
  - **`@property --animation-offset-y` declared at top-level** without a `--ts-` prefix — breaks the namespace contract. Should be `--ts-animation-offset-y` to align with the rebuild's `--ts-*` token discipline.
- **Session 3 relationship:**
  - **DIRECTLY consumes the surface chain** via `--ts-bg-0..3` (L21–24, L152). This is the most surface-chain-dependent file in the chunk — when surfaces.css migrates to `--ts-this-bg-*` derivatives, this file's gradient backgrounds will need a parallel migration or they will paint with stale tokens.
  - **Future text/states/effects files would NOT inherit from this** — this file is a leaf consumer of the system layer, not a contributor. It declares `--ts-grid-*` and `--ts-dot-*` tokens that are component-tier, not system-tier (despite being in `:root`). Per the three-tier architecture (`token-validation` skill), these `--ts-grid-*` and `--ts-dot-*` tokens are arguably mis-placed at the System tier; they are Component-tier defaults that happen to be globally declared because the JS engine writes them globally.
  - The grain glow at L174–178 uses `color-mix(in srgb, var(--ts-accent) 30%, transparent)` — a safe color-mix pattern that bypasses OKLCH but works without `apcach`. Future effects refactor should consider migrating to the `apcach`-aware color-mix patterns used in `surfaces.css`.
- **Gap vs `_code-audit-catalog.md`:**
  - (a) Already covered: the full `:root` fallback block (L290–307) is documented at audit catalog L541 verbatim. `_applyVars` runtime writes (L241 of catalog) match the declared fallback tokens. The `.grid-bg.interactive` selector is listed at L669. `@keyframes move_v1`, `move-performant`, `move-performant-var` all appear in the §4.8 keyframes inventory (catalog L562).
  - (b) NEW vs catalog: the **z-index stack comment** at L95–99 with the explicit ASCII layering map is design intelligence not surfaced in the catalog. The **L140–142 TODO** explaining why `position: relative` was removed (stacking-context fight with `.ts-effects-layer`) is critical architectural lore — catalog mentions `.ts-effects-layer` exists (L579) but not this resolution history. The **L114–115 comment** documenting the z-index 3 conflict resolution is also new. The dual-path (with-grain vs without-grain) glow architecture at L155–178 — using `::before` for glow when no grain, and baking glow into `background-image` when `.ts-grain` IS present — is undocumented in the catalog. The `@property --animation-offset-y` registration is not in the catalog's CSS variables section (§4.11).
  - (c) Contradictions: catalog L604 lists `--ts-line-color` as written by `ToolskinGridBg._applyVars` "if `lineColor` set", but the CSS fallback declares it unconditionally as `var(--ts-border-1)`. Cascade order matters here — if JS does NOT call `_applyVars` (e.g., FOUC, JS disabled), the CSS fallback wins. The catalog wording slightly understates how robust the CSS-only fallback is. Also, L283 ("set by JS IntersectionObserver") matches catalog §6's viewport manager but is not cross-referenced.

---

### effects-layers-special-sections-css.css

- **Path:** `docs/references/toolskin.css_extracted-core-blocks-to-refactor/effects-layers-special-sections-css.css`
- **Lines:** 494  ·  **Bytes:** 11,875
- **Block type:** effects + animations + utilities — a heterogeneous file owner-tagged with multiple section headers (`§8` Effects & Animations, `§8b` Scroll Reveal, `§8c` Shimmer/Skeleton, `§8e` Framework Configuration, `§6d` Scroll-Driven Parallax, `§6e` Viewport Paused). Combines the scroll-reveal library, glow/shimmer tokens, focus-ring, scanline, headline-sweep, skeleton, and CSS scroll-driven parallax into one extracted blob.
- **Key `--ts-*` tokens declared (in the `:root` block at L219–239):**
  - Glow shadows: `--ts-glow-accent` (dual-shadow, `color-mix` of `--ts-accent` 50% + 25%), `--ts-glow-success`, `--ts-glow-danger`, `--ts-glow-info` (parallel structures, each consuming the matching status token)
  - Easing curves: `--ts-easing-standard: cubic-bezier(0.4, 0, 0.2, 1)`, `--ts-easing-emph: cubic-bezier(0.2, 0.8, 0.2, 1)`, `--ts-easing-spring: cubic-bezier(0.34, 1.56, 0.64, 1)`
  - Durations: `--ts-dur-fast: 120ms`, `--ts-dur-base: 220ms`, `--ts-dur-slow: 420ms`
- **Key `--ts-*` tokens referenced (consumed):**
  - Easing: `--ts-ease-out` (L22, L155), `--ts-ease-spring` (L156)
  - Durations: `--ts-dur-slower` (L22, L155), `--ts-dur-fast` (L203)
  - Surface chain (legacy): `--ts-bg-1` (L273), `--ts-bg-2` (L367, twice), `--ts-bg-3` (L367)
  - Color tokens: `--ts-text-primary` (L271, L309, L311, L313), `--ts-accent` (L221, L310, L312, L325), `--ts-success` (L224), `--ts-danger` (L227), `--ts-info` (L230)
  - Radius: `--ts-radius-base` (L276), `--ts-radius-sm` (L370)
  - Parallax data inputs: `--ts-parallax-from` (L467, default `-10%`), `--ts-parallax-to` (L470, default `10%`)
- **Key `.ts-*` / `[data-*]` classes defined:**
  - Reveal base set (all `opacity: 0` + transition): `.ts-reveal`, `.ts-fade-in`, `.ts-fade-up`, `.ts-fade-left`, `.ts-fade-right`, `.ts-zoom-in`, `.ts-zoom-out`, `.ts-slide-up`, `.ts-slide-left`, `.ts-slide-right`, `.ts-flip-up`, `.ts-bounce-in` (L9–25)
  - Visible counterparts: each reveal class paired with `.ts-visible` (L36–49 and per-class blocks L28–173)
  - Stagger delays: `.ts-delay-1` (100ms) through `.ts-delay-6` (600ms) (L176–198)
  - Speed variants: `.ts-reveal-fast`/`-slow`/`-slower` (L201–214)
  - Glow utilities: `.ts-glow`, `.ts-glow-success`, `.ts-glow-danger`, `.ts-glow-info` (L241–255)
  - Shimmer/skeleton/scanline/headline: `.ts-shimmer` (L268–277), `.ts-scanline` + `::after` (L280–294), `.ts-headline-sweep` (L307–319), `.ts-skeleton` (L366–371)
  - Focus ring: `:where(button, a, input, textarea, select, [tabindex]):focus-visible` (L324–328)
  - Config utility: `.ts-no-grain` + `:root.ts-no-grain .ts-grain` (with `::before` variants, L386–394)
  - Locomotive guards: `[data-scroll-container]:not(.ts-grain)`, `[data-scroll]`, plus the transform-suppression and reveal-preservation selector sets (L399–443) — **NOTE: these duplicate the same rules in `configuration-utilities.css` cataloged by sub-agent 2**
  - Scroll-driven parallax: `[data-ts-parallax]` + `> [data-ts-parallax-bg]` (L451–474), inside `@supports (animation-timeline: view())`
  - Viewport-paused: `.ts-viewport-paused`, `.ts-viewport-paused .ts-marquee-text-text` (L487–493)
- **Keyframes defined:** `ts-shimmer` declared TWICE in this file (L258–266 AND L373–381), `ts-headline-sweep` (L297–305), `ts-parallax-shift` (L465–473, inside `@supports`)
- **Owner annotations VERBATIM with line numbers:**
  - L1–3: `/* ═══════════════════════════════════════════════════════════════════════\n\t§8  EFFECTS & ANIMATIONS\n\t═══════════════════════════════════════════════════════════════════════ */`
  - L6: `/* ─── §8b  Scroll Reveal Animations (Safe, Smooth, Auto-Applied) ────── */`
  - L8: `/* Base reveal classes - hidden until visible */`
  - L27: `/* Fade In - Simple opacity */`
  - L51: `/* Fade Up - Classic reveal from bottom */`
  - L62: `/* Fade Left - From right side */`
  - L73: `/* Fade Right - From left side */`
  - L84: `/* Zoom In - Scale up */`
  - L95: `/* Zoom Out - Scale down */`
  - L106: `/* Slide Up - Larger movement */`
  - L117: `/* Slide Left - Larger horizontal */`
  - L128: `/* Slide Right - Larger horizontal */`
  - L139: `/* Flip Up - 3D flip */`
  - L151: `/* Bounce In - Spring effect */`
  - L164: `/* Generic reveal class */`
  - L175: `/* Stagger delays for sequential animations */`
  - L200: `/* Speed variants */`
  - L216–218: `/* ============================================================\n   E. EFFECT TOKENS — glow, noise, shimmer, scanline, grain\n   ============================================================ */`
  - L257: `/* Shimmer — for skeleton loaders and highlights */`
  - L279: `/* Scanline — for game/tech UIs */`
  - L296: `/* Marquee shimmer (for hero headlines) */`
  - L321–323: `/* ============================================================\n   FOCUS RING — accessibility\n   ============================================================ */`
  - L330–332: `/* ============================================================\n   PREFERS-REDUCED-MOTION\n   ============================================================ */`
  - L340: `/* Reduced motion support */`
  - **L341 (HIGH-VALUE OWNER NOTE):** `/* REFACTOR NOTE: Commented this annoying   restirction. we need another way of making this, oit locks functional elements and interactions severally, depending on the suer system preferences and it's not a desired  behaviour, it sa hardcoded blocking result. */`
  - **L343 (HIGH-VALUE OWNER NOTE):** `/* REFACTOR NOTE: disbaled this featued  while on development process. is annoyuind and should be enabled  manually by user. it affects */`
  - L344–362 (commented-out @media block): the entire `@media (prefers-reduced-motion: reduce)` reveal-class kill block is wrapped in `/* ... */` — disabled intentionally per the L341/L343 owner notes
  - L364: `/* ─── §8c  Shimmer / Skeleton ───────────────────────────────────────── */`
  - L383: `/* ─── §8e  Framework Configuration Utilities ─────────────────────────── */`
  - L385: `/* Disable noise/grain globally or per-element */`
  - L398: `/* Locomotive Scroll container */`
  - L407: `/* CRITICAL: Prevent Locomotive from breaking layouts */`
  - L408–410: `/* Don't apply transforms to layout-critical elements.\n\tNOTE: .ts-fade-up and .ts-fade-in are EXCLUDED — they need their\n\ttransforms for scroll reveal animations to work correctly. */`
  - L421–422: `/* Reveal animations MUST keep their transforms even with [data-scroll].\n\tThe transition handles the animation; Locomotive should not override. */`
  - L433: `/* Only allow transforms on specifically tagged parallax elements */`
  - L439: `/* Allow transforms on inner elements that aren't animated */`
  - L448: `/* ─── §6d  CSS SCROLL-DRIVEN PARALLAX ────────────────────────────────────── */`
  - L449: `/* Pure CSS parallax using animation-timeline: view() */`
  - L476: `/* Disable parallax for reduced motion */`
  - L484: `/* ─── §6e  VIEWPORT PAUSED UTILITY ────────────────────────────────────── */`
  - L485: `/* Applied by ToolskinViewportManager when elements are off-screen */`
- **Refactor flags:**
  - **CRITICAL — `@keyframes ts-shimmer` defined TWICE inside this single file** (L258–266 AND L373–381). The second definition wins (last-defined). The two definitions are NOT equivalent: L258–266 animates `background-position` from `-200% 0` to `200% 0`; L373–381 animates from `100% 50%` to `0% 50%`. This means `.ts-shimmer` (L268–277) declares an animation that is *interpreted by the L373 definition*, not the L258 definition. This is the same `ts-shimmer` double-declaration the audit catalog flagged at L921 ("declared twice — lines 10841 and a later ~22xxx") — confirmed here as living in the SAME extracted file.
  - **`prefers-reduced-motion` deliberately disabled** for the reveal-class kill (L344–362 commented out). Owner notes (L341, L343) explain this is intentional because the kill was "annoying" and "locks functional elements". This is an a11y regression that the rebuild MUST address with a saner approach — e.g., opt-in `--ts-reveal-allow-reduced-motion` class instead of a blanket disable. Surface to Council and the `accessibility` skill.
  - **`prefers-reduced-motion` still active for shimmer/sweep** (L333–339) — but `.ts-shimmer` references the `ts-shimmer` keyframes and the kill simply sets `animation: none`. After the rebuild's reveal-motion refactor, decide whether shimmer/sweep should follow the same opt-in pattern as reveals.
  - **`prefers-reduced-motion` for parallax** (L477–482) is still active and correct.
  - **Hardcoded values** that should be tokens: `0.18` rgba in `.ts-scanline::after` (L290), `0.85`/`1.15`/`0.3` scale values across zoom/bounce, `40px`/`80px` translate values, `30px` in `.ts-reveal`, `100ms` through `600ms` literal delays in `.ts-delay-*`, `800ms`/`1200ms` in slow/slower variants, `1.4s ease infinite` in `.ts-skeleton`, `1.6s linear infinite` in `.ts-shimmer`, `6s linear infinite` in `.ts-headline-sweep`, `2px solid` focus ring outline width. None of these flow through tokens today — a clear opportunity to expand the `--ts-dur-*` and `--ts-ease-*` token families to cover reveal-distance, scale-from, focus-ring-width, etc.
  - **Mixed easing namespaces** — file declares `--ts-easing-standard/-emph/-spring` (L233–235) but references `--ts-ease-out/-spring` (L22, L155, L156). The declared `--ts-easing-*` family is never used inside this file (probably referenced elsewhere). Two parallel naming conventions (`--ts-easing-*` vs `--ts-ease-*`) is a hazard — Council should pick one and migrate.
  - **Mixed duration namespaces** — file declares `--ts-dur-fast/-base/-slow` (L236–238) and ALSO references `--ts-dur-slower` (L22, L155). `--ts-dur-slower` is NOT declared in this file but IS used. The audit catalog §1i (L499) lists the full duration scale `--ts-dur-fast:220ms / -base:300ms / -slow:550ms / -slower:700ms` — but this file's `:root` block declares `--ts-dur-fast: 120ms / -base: 220ms / -slow: 420ms`, **CONTRADICTING the catalog's documented values by 100ms across the board**. Two competing `:root` declarations for the same token family is a serious cascade-order bug waiting to happen.
  - **`color-mix(in srgb, ...)` everywhere for glow tokens** — same pattern as grid-bg-anim.css's grain glow. Works without `apcach` but bypasses OKLCH. Per the rebuild Phase 0–5 mandate, decide whether `apcach`-aware color-mix patterns should replace these.
  - **Duplicated Locomotive guards** — L399–443 of this file are byte-for-byte identical (or near-identical) to `configuration-utilities.css` (cataloged by sub-agent 2). When the rebuild assembles its canonical reveal/effects CSS, ONE of these copies must die.
  - **Focus-ring `:where()` wrapper** lowers specificity to zero — easy to override, by design. But `border-radius: inherit` (L327) inside `:focus-visible` can produce surprising rings when the target has no border-radius parent — flag for visual audit during effects refactor.
  - **`outline-offset: 2px` + `outline: 2px solid var(--ts-accent)`** — both hardcoded. Should flow through `--ts-focus-ring-width` and `--ts-focus-ring-offset` tokens for theme tuning.
  - **`@supports (animation-timeline: view())`** at L451 — correct progressive-enhancement gating. No fallback for non-supporting browsers (Safari pre-26, all of Firefox as of 2026 unless flag enabled). Council should decide whether a JS-driven parallax fallback (audit catalog §1 `ToolskinParallaxFallback`) covers this gap or if a CSS-only translate fallback is needed.
  - **Scroll-reveal opacity:0 + JS-dependent `.ts-visible`** — without the JS reveal observer (`ToolskinMotion` or equivalent), `.ts-fade-*` content is invisible forever. FOUC + JS-fail risk. Catalog L166 confirms `defaultAnimation:'ts-fade-up'` is auto-applied to `.ts-card, .ts-panel, .demo-card, .ts-pricing-card` — meaning every card on every page hides until JS runs. A `<noscript>` or `:not(:has(script))`-style fallback should be considered.
- **Session 3 relationship:**
  - **Indirectly consumes the surface chain** via `--ts-bg-1/-2/-3` in `.ts-shimmer` (L273) and `.ts-skeleton` (L367 — uses `--ts-bg-2` twice and `--ts-bg-3` once for the gradient stops). When surfaces.css migrates to `--ts-this-bg-*`, the shimmer/skeleton gradients will paint wrong unless they migrate too.
  - **Text-layer dependency** — the file references `--ts-text-primary` in `.ts-shimmer` (L271) and `.ts-headline-sweep` (L309, L311, L313). When the future text-layer system file lands, this file's references will be the canary that confirms the text chain is wired correctly.
  - **States-layer dependency** — `.ts-glow-success/-danger/-info` reference `--ts-success`, `--ts-danger`, `--ts-info`. The states/status token chain is a prerequisite for this file to render correctly.
  - **Effects-tier propagation** — the `--ts-glow-*` tokens at L219–231 are themselves SYSTEM-tier composite tokens (built from accent/status primitives via `color-mix`). When these are referenced by components (buttons with `.ts-glow`, cards, etc.), the chain is Primitive (`--ts-accent`) → System (`--ts-glow-accent`) → Component (`.ts-btn.ts-glow`). The three-tier architecture is correctly followed for the glow family — this is a positive precedent for other system-tier composite tokens.
  - **Future effects.css** (if extracted) would consume `--ts-easing-*` and `--ts-dur-*` declared here. The namespace conflict (see refactor flag above) MUST be resolved before any downstream extraction.
- **Gap vs `_code-audit-catalog.md`:**
  - (a) Already covered: `.ts-shimmer` double-declaration is flagged at catalog L921. `.ts-skeleton` is mentioned at catalog L402–403 and §4.10 L587. `.ts-grain`/`.ts-no-grain` are listed in the State/utility class index at catalog L590. The full reveal class family `.ts-fade-up/-in/-left/-right`, `.ts-zoom-in/-out`, `.ts-slide-up/-left/-right`, `.ts-flip-up`, `.ts-bounce-in`, `.ts-reveal` is implied by catalog L90 (motion config) and L166 (defaultAnimation:'ts-fade-up'). `.ts-glow*`, `.ts-shimmer`, `.ts-scanline`, `.ts-headline-sweep` appear in §4.8 (keyframes) and §4.10 (component families). `--ts-glow-*` family is implied but not explicitly listed in §4.6/4.7 of the catalog. `@keyframes ts-headline-sweep`, `ts-parallax-shift` are in catalog §4.8.
  - (b) NEW vs catalog: the **deliberate disabling of `prefers-reduced-motion`** with the L341/L343 owner refactor notes is **NOT in the catalog and is critical design intelligence** — the rebuild's accessibility posture depends on understanding why this was disabled. The **`--ts-glow-*` token declarations** (L219–231) are not explicitly listed in catalog §4.6/4.7 (only mentioned implicitly via the `.ts-glow*` class family at L580). The **`--ts-easing-standard/-emph/-spring` declarations** (L233–235) and the **`--ts-dur-fast/-base/-slow` declarations with VALUES DIFFERENT FROM catalog §1i** (L236–238) are new and represent a token-conflict bug not surfaced anywhere. The **stagger delay class family** `.ts-delay-1..6` is not in the catalog. The **`.ts-reveal-fast/-slow/-slower` speed variants** are not in the catalog. The **focus-ring `:where()` rule** is not in the catalog. The **`.ts-viewport-paused` + `.ts-viewport-paused .ts-marquee-text-text`** rules at L487–493 are partially covered (catalog mentions ToolskinViewportManager) but the explicit CSS selectors are not.
  - (c) Contradictions:
    - **`--ts-dur-*` value mismatch** between this file (L236–238: 120/220/420ms) and catalog §1i (L499: 220/300/550/700ms). This is a real cascade contradiction — which `:root` declaration wins depends on file load order, and the rebuild must pick a single source of truth.
    - **`--ts-easing-*` vs `--ts-ease-*` namespace conflict** — catalog §1i (L499) lists `--ts-ease-out/in-out/spring/snap/out-slow/in-slow/in-out-slow/out-linear/in-linear` AND `--ts-panel-ease-out/in`. This file ADDS a parallel `--ts-easing-*` family (L233–235). Two namespaces for the same concept.
    - **`@keyframes ts-shimmer` double-declaration is INSIDE THIS FILE** (L258 and L373) — catalog L921 said "lines 10841 and ~22xxx" referring to the original `toolskin.css`. The extraction preserved BOTH copies into one file, making the bug even more obvious and unambiguous. Useful for the rebuild — kill the right copy.
    - **Reveal-motion `prefers-reduced-motion` discrepancy** — catalog does not surface that the reveal kill is commented out; an external reader following the catalog would assume a11y is respected.
    - **Locomotive guard duplication** between this file (L399–443) and `configuration-utilities.css` (cataloged by sub-agent 2) — both files extract the same source rules, creating a near-certain redundancy in any naive paste-assembly.

---

## Annotation index

- grid-bg-anim.css:L3: `/* CSS GRID BACKGROUND ANIMTION V_1.0 */`
- grid-bg-anim.css:L93: `/* END CSS GRID BACKGROUND ANIMTION */`
- grid-bg-anim.css:L95-99: `/* ─── Grid-bg z-index stack ───────────────────────────────────────── 0 = ba-grid:before (grid lines) 0 = ts-section-color-overlay (dot layers) 5 = all other children (content) ───────────────────────── */`
- grid-bg-anim.css:L101: `/* Content sits above all background layers — exclude effect/overlay layers */`
- grid-bg-anim.css:L114-115: `/* Overlay: z-index 3 so dots sit above grid lines(1) and color overlay(2). No isolation — grain is on its own topmost layer now, no conflict. */`
- grid-bg-anim.css:L140-142: `/* TODO: position:relative removed — was creating stacking context that fought with effects-layer absolute positioning. Grid-bg on effects-layer inherits position:absolute from .ts-effects-layer instead. */`
- grid-bg-anim.css:L145-148: `/* ── Grid background base ───────────────────────────────────────────── Opaque dark background-color. Gradient glow on a separate pseudo-element so it doesn't fight with background-image !important chains. All values driven by CSS custom properties (set by JS ToolskinGridBg). */`
- grid-bg-anim.css:L155-157: `/* ── Accent glow (::before when NO ts-grain) ───────────────────────── When ts-grain IS present, ::before is used for noise (set by .ts-grain rules) — the glow is applied on the section background-image instead. */`
- grid-bg-anim.css:L172-173: `/* When ts-grain IS present: glow baked into the section background-image using 30% accent (safe color-mix, no calc) */`
- grid-bg-anim.css:L180-182: `/* ── Grid lines (::after) ──────────────────────────────────────────── Stays fixed (doesn't move with mouse parallax). Opacity controlled by --ts-grid-line-opacity (set by JS). */`
- grid-bg-anim.css:L220: `/* Outer dot layer — smaller, subtler (restored to initial design values) */`
- grid-bg-anim.css:L226: `/* Inner dot layer — scale factor controllable via --ts-dot-scale */`
- grid-bg-anim.css:L259-261: `/*.anim.interactive.grid-bg .ts-section-color-overlay:before { animation: move-performant-var var(--ts-dot-speed) linear infinite; }*/` (commented-out rule)
- grid-bg-anim.css:L283: `/* Pause all child animations when section is off-screen (set by JS IntersectionObserver) */`
- grid-bg-anim.css:L289: `/* --- Grid-bg CSS fallback defaults (overridden by JS ToolskinGridBg._applyVars) --- */`
- grid-bg-anim.css:L296: `/* Dot color: default = accent. JS overrides with color-mix for alpha control. */`
- grid-bg-anim.css:L300: `/* Inner dot layer scale factor — controllable via editor */`
- effects-layers-special-sections-css.css:L1-3: `/* ═══════════════════════════════════════════════════════════════════════ §8  EFFECTS & ANIMATIONS ═══════════════════════════════════════════════════════════════════════ */`
- effects-layers-special-sections-css.css:L6: `/* ─── §8b  Scroll Reveal Animations (Safe, Smooth, Auto-Applied) ────── */`
- effects-layers-special-sections-css.css:L8: `/* Base reveal classes - hidden until visible */`
- effects-layers-special-sections-css.css:L27: `/* Fade In - Simple opacity */`
- effects-layers-special-sections-css.css:L51: `/* Fade Up - Classic reveal from bottom */`
- effects-layers-special-sections-css.css:L62: `/* Fade Left - From right side */`
- effects-layers-special-sections-css.css:L73: `/* Fade Right - From left side */`
- effects-layers-special-sections-css.css:L84: `/* Zoom In - Scale up */`
- effects-layers-special-sections-css.css:L95: `/* Zoom Out - Scale down */`
- effects-layers-special-sections-css.css:L106: `/* Slide Up - Larger movement */`
- effects-layers-special-sections-css.css:L117: `/* Slide Left - Larger horizontal */`
- effects-layers-special-sections-css.css:L128: `/* Slide Right - Larger horizontal */`
- effects-layers-special-sections-css.css:L139: `/* Flip Up - 3D flip */`
- effects-layers-special-sections-css.css:L151: `/* Bounce In - Spring effect */`
- effects-layers-special-sections-css.css:L164: `/* Generic reveal class */`
- effects-layers-special-sections-css.css:L175: `/* Stagger delays for sequential animations */`
- effects-layers-special-sections-css.css:L200: `/* Speed variants */`
- effects-layers-special-sections-css.css:L216-218: `/* ============================================================ E. EFFECT TOKENS — glow, noise, shimmer, scanline, grain ============================================================ */`
- effects-layers-special-sections-css.css:L257: `/* Shimmer — for skeleton loaders and highlights */`
- effects-layers-special-sections-css.css:L279: `/* Scanline — for game/tech UIs */`
- effects-layers-special-sections-css.css:L296: `/* Marquee shimmer (for hero headlines) */`
- effects-layers-special-sections-css.css:L321-323: `/* ============================================================ FOCUS RING — accessibility ============================================================ */`
- effects-layers-special-sections-css.css:L330-332: `/* ============================================================ PREFERS-REDUCED-MOTION ============================================================ */`
- effects-layers-special-sections-css.css:L340: `/* Reduced motion support */`
- effects-layers-special-sections-css.css:L341: `/* REFACTOR NOTE: Commented this annoying   restirction. we need another way of making this, oit locks functional elements and interactions severally, depending on the suer system preferences and it's not a desired  behaviour, it sa hardcoded blocking result. */`
- effects-layers-special-sections-css.css:L343: `/* REFACTOR NOTE: disbaled this featued  while on development process. is annoyuind and should be enabled  manually by user. it affects */`
- effects-layers-special-sections-css.css:L344-362: (commented-out @media (prefers-reduced-motion: reduce) block killing all reveal classes — disabled intentionally per L341/L343)
- effects-layers-special-sections-css.css:L364: `/* ─── §8c  Shimmer / Skeleton ───────────────────────────────────────── */`
- effects-layers-special-sections-css.css:L383: `/* ─── §8e  Framework Configuration Utilities ─────────────────────────── */`
- effects-layers-special-sections-css.css:L385: `/* Disable noise/grain globally or per-element */`
- effects-layers-special-sections-css.css:L398: `/* Locomotive Scroll container */`
- effects-layers-special-sections-css.css:L407: `/* CRITICAL: Prevent Locomotive from breaking layouts */`
- effects-layers-special-sections-css.css:L408-410: `/* Don't apply transforms to layout-critical elements. NOTE: .ts-fade-up and .ts-fade-in are EXCLUDED — they need their transforms for scroll reveal animations to work correctly. */`
- effects-layers-special-sections-css.css:L421-422: `/* Reveal animations MUST keep their transforms even with [data-scroll]. The transition handles the animation; Locomotive should not override. */`
- effects-layers-special-sections-css.css:L433: `/* Only allow transforms on specifically tagged parallax elements */`
- effects-layers-special-sections-css.css:L439: `/* Allow transforms on inner elements that aren't animated */`
- effects-layers-special-sections-css.css:L448: `/* ─── §6d  CSS SCROLL-DRIVEN PARALLAX ────────────────────────────────────── */`
- effects-layers-special-sections-css.css:L449: `/* Pure CSS parallax using animation-timeline: view() */`
- effects-layers-special-sections-css.css:L476: `/* Disable parallax for reduced motion */`
- effects-layers-special-sections-css.css:L484: `/* ─── §6e  VIEWPORT PAUSED UTILITY ────────────────────────────────────── */`
- effects-layers-special-sections-css.css:L485: `/* Applied by ToolskinViewportManager when elements are off-screen */`


---

# Extracted Blocks Catalog — Section 4a: Components (small, ≤17KB)

**Sub-agent:** 4a  ·  **Chunk:** components/ small files  ·  **Files:** 16  ·  **Total bytes:** ~155,945

Scope: the 16 smallest files under `docs/references/toolskin.css_extracted-core-blocks-to-refactor/components/` (each ≤17KB). Larger component files (footer, headermenu, inputs, ts-card-flip variants, ts-checkbox-radio, ts-panel, ts-patterns, ts-ui-select-variants, iconlist+featlist, masonry) are deferred to chunks 4b/4c.

## Files in this chunk

| File | Lines | Bytes | Block type |
|---|---|---|---|
| log-component.css | 119 | 2,503 | leaf component — `.ts-log` terminal block (§6m) + `.ts-progress` bar (§6n) |
| ts-notif-banner-component(COLOR-INVERSION-HERE).css | 128 | 3,656 | **canonical color-inversion specimen** — `.ts-banner` fixed top strip with `--ts-this-bg-inverse` + `--ts-this-fg-inverse` auto-inversion engine and `&` nested variants |
| theme-toggle-switch-animation-component.css | 99 | 3,801 | imported asset — toggles.dev v4.10.1 SVG day/night animation; non-Toolskin namespace (`--theme-toggle__expand--duration`) |
| marquee-component.css | 150 | 3,942 | leaf component — `.ts-marquee-container`/`-text-wrap`/`-text-text` self-contained marquee w/ duplicate-strip-via-::before loop |
| hero-section.css | 138 | 4,226 | section block (§8a) — `.ts-hero` fullscreen, badge, actions, light-theme fork |
| ts-ui-select-dropdown-max-height-calc.css | 126 | 5,628 | scoped utility (v3) — context-aware dropdown max-height formula re-declared per scope (page, oce-panel, modal, banner-generator-app) |
| tooltips-styles.css | 212 | 6,330 | leaf component — `#ts-tooltip-container.ts-tooltip` placement engine (top/bottom/left/right), forced-dark surface in both themes |
| code-window-component.css | 274 | 6,885 | leaf component — `.ts-code-window` w/ traffic-light dot pseudo-element trick (single dot renders 3 via ::before + ::after) |
| header-promobanner.css | 339 | 8,286 | layout-coupled component — `.ts-promo-banner` dismissable top bar + body-level `:has()` offset cascade for `.ts-nav-fixed` |
| ta-ui-table-component.css | 271 | 8,744 | leaf component — `.ts-ui-table--sortable` + sticky thead + striped + selected-row + bulk-bar (`.ts-ui-bulk-bar` floating action bar) |
| ts-btn-component(basic-ref).css | 447 | 14,601 | **canonical reference** — `.ts-btn` base + primary/outline/ghost/danger/success/alt/secondary/tertiary variants + sm/md/lg/xl scale tokens + counter badge |
| ts-gallery-component+lightbox.css | 538 | 16,357 | **exemplary three-tier component** — `.ts-gallery` float-asymmetric + size mods (full/two-third/half/third/quarter) + container queries + `.ts-gallery-lightbox` |
| toast+ts-ui-toast-component.css | 492 | 16,735 | dual-implementation file — legacy `.ts-toast` (§6o) + current `.ts-ui-toast` with track-bar gradient animation + auto-invert variants |
| ui-kit-spinner+sortable+draggable+enhancednumberinput.css | 517 | 16,825 | multi-component blob — `.ts-ui-spinner`, `.ts-ui-resizable`, `.ts-ui-sortable` (FLIP-ready), `.ts-ui-number-input-wrapper` |
| ts-ui-accordion-component.css | 449 | 17,141 | leaf component — `.ts-ui-accordion` (+ `.ts-accordion` alias) base / `--separated` / `--dual-icon` / `--toggle-plus` (chevron OR plus-minus indicator) |
| custom-cursor-component.css | 392 | 17,285 | special component — `body.has-ts-cursor` SVG data-URL crosshair (§11.1) + `.custom-cursor` JS-driven follower element (§11.2 A/B/C/D/E) with perf contract |

---

## Per-file catalog

### log-component.css

- **Path:** `docs/references/toolskin.css_extracted-core-blocks-to-refactor/components/log-component.css`
- **Lines:** 119  ·  **Bytes:** 2,503
- **Block type:** Two leaf components in one file under section headers `§6m LOG / TERMINAL BLOCK` (L2) and `§6n PROGRESS BAR` (L65). No `:root` declarations; pure consumer.
- **Key `--ts-*` tokens declared:** none (component classes don't redeclare anything; everything flows from the system layer).
- **Key `--ts-*` tokens referenced:**
  - Surface chain (legacy): `--ts-bg-3` (L70)
  - Component surface: `--ts-log-bg` (L5, L22), `--ts-panel-border` (L6, L19)
  - Color: `--ts-text-secondary` (L21, L32, L111), `--ts-text-muted` (L36), `--ts-success` (L40), `--ts-warning` (L44), `--ts-danger` (L48), `--ts-accent` (L52, L117)
  - Geometry: `--ts-radius-md` (L7), `--ts-radius-full` (L71, L78), `--ts-log-sp` (L16, L20), `--ts-log-gap` (L57–58), `--ts-log-pad-small` (L61), `--ts-sp-3` (L105), `--ts-modal-gap--ts-sp-2` (L106), `--ts-fs-sm` (L110, L115)
  - Type: `--ts-font-mono` (L17, L118), `--ts-log-fs` (L18)
  - Effects: `--ts-accent-grad` (L77), `--ts-dur-slow` + `--ts-ease-out` (L79)
- **Key classes:** `.ts-log`, `.ts-log__entry` (+ `--info/--debug/--success/--warning/--error/--accent` BEM variants), `.ts-log__entry:first-child`, `.ts-log__actions`, `.ts-progress`, `.ts-progress__bar`, `.ts-progress--sm`/`--lg`/`--striped`, `.ts-progress-row`, `.ts-progress-label`, `.ts-progress-value`
- **Keyframes:** none.
- **Owner annotations:**
  - L2: `/* ─── §6m  LOG / TERMINAL BLOCK ─────────────────────────────────────── */`
  - L10–11 (commented-out): `/*scrollbar-width: thin; scrollbar-color: var(--ts-bg-5) transparent;*/` — confirms an abandoned scrollbar styling that referenced legacy `--ts-bg-5`.
  - L65: `/* ─── §6n  PROGRESS BAR ─── */`
  - L100: `/* Progress label row */`
- **Refactor flags:**
  - **Legacy `--ts-bg-3` on `.ts-progress`** (L70) — Rule 15 violation; must move to `--ts-this-bg-dim-N` derivative.
  - **`--ts-modal-gap--ts-sp-2`** (L106) is a clearly malformed token name (double `--`) — almost certainly a copy-paste typo for either `--ts-modal-gap` or `--ts-sp-2`. The CSS parser will read it as a single token name and fail silently; effective margin-bottom = 0.
  - **Hardcoded `color-mix(in srgb, #fff, transparent 82%)`** (L95–96) inside `.ts-progress--striped` — hardcoded white literal, bypasses theme awareness; light-mode stripes will render the same as dark, which is wrong on a light bar.
  - **Hardcoded `12px` / `5px` / `18px` heights** (L69, L84, L88) — should flow through a `--ts-progress-h-*` token family.
- **Session 3/4 relationship:** Pure leaf consumer of the system layer. Once `surfaces.css` derivative chain is canonical, only the L70 `--ts-bg-3` reference needs migration. The `--ts-accent-grad` reference at L77 ties this file to whatever gradient token the accent engine exposes — verify it exists in the new system layer.
- **Gap vs `_code-audit-catalog.md`:** (a) `.ts-log*` and `.ts-progress*` families are surfaced at catalog §4.10. (b) NEW: the malformed `--ts-modal-gap--ts-sp-2` typo is not in the catalog and is a silent rendering bug. The commented-out scrollbar block at L10–11 reveals legacy `--ts-bg-5` usage history. (c) No contradictions.

---

### ts-notif-banner-component(COLOR-INVERSION-HERE).css

- **Path:** `docs/references/toolskin.css_extracted-core-blocks-to-refactor/components/ts-notif-banner-component(COLOR-INVERSION-HERE).css`
- **Lines:** 128  ·  **Bytes:** 3,656
- **Block type:** **CANONICAL COLOR-INVERSION SPECIMEN.** The `(COLOR-INVERSION-HERE)` filename annotation flags this as the reference pattern for the rebuild's auto-inverting child elements. `.ts-banner` is a fixed top strip with a 4-token contract: `--ts-this-bg-surface` and `--ts-this-surface-text` are the only source tokens variants override; everything else (foreground, inverse pair, child background) auto-derives. Uses CSS nested `&` syntax (modern Chromium/Safari/Firefox).
- **Key `--ts-*` tokens declared (inside `.ts-banner` scope, L32–67):**
  - **Token resolution layer:** `--ts-this-bg: var(--ts-this-bg-surface)` (L32), `--ts-this-fg: var(--ts-this-surface-text)` (L33)
  - **Inversion pair:** `--ts-this-bg-inverse: var(--ts-this-fg)` (L36), `--ts-this-fg-inverse: var(--ts-this-bg)` (L37) — this is the canonical inversion engine: foreground becomes background of children, and vice versa.
  - **Default surface:** `--ts-this-bg-surface: var(--ts-bg-2, #1a1c20)` (L40), `--ts-this-surface-text: var(--ts-text-primary, #e8eaed)` (L41)
  - **Variant overrides (only the surface tokens swap):**
    - `&.ts-banner--info`: `--ts-this-bg-surface: var(--ts-info, #3b82f6)` + text `#fff` (L49–52)
    - `&.ts-banner--success`: `var(--ts-success, #10b981)` + `#fff` (L54–57)
    - `&.ts-banner--warning`: `var(--ts-warning, #fbbf24)` + `#1a1c20` (L59–62)
    - `&.ts-banner--danger`: `var(--ts-danger, #ef4444)` + `#fff` (L64–67)
- **Key `--ts-*` tokens referenced:** `--ts-z-banner` w/ literal fallback `2147483645` (L15), `--ts-sp-3/2/4` (L19–20), `--ts-font-body` (L22), `--ts-promo-banner-h` (L26–27), `--ts-this-bg-border` (L46), `--ts-font-mono` (L86, L95), `--ts-bg-2` (L40), `--ts-text-primary` (L41), `--ts-info/success/warning/danger` (L50, L55, L60, L65)
- **Key classes:** `.ts-banner` (+ variants `--info/--success/--warning/--danger`), `.ts-banner__label`, `.ts-banner__tag`, `.ts-banner__file`, `.ts-banner__meta`, `.ts-banner__action`, `.ts-banner__dismiss`
- **Keyframes:** none.
- **Owner annotations VERBATIM:**
  - L3–8 (block comment): `/* ═══════════════════════════════════════════════════════════════════` / `COMPONENT: ts-banner` / `Full-width strip used for surfacing system overrides (e.g., debug` / `stylesheet swap), maintenance notices, etc. Variants: --info,` / `--success, --warning, --danger. Uses fixed positioning at top.` / `═══════════════════════════════════════════════════════════════════ */`
  - L31: `/* ── TOKEN RESOLUTION ───────────────────────────── */`
  - L35: `/* ── AUTO INVERSION ─────────────────────────────── */`
  - L39: `/* ── DEFAULT SURFACE ────────────────────────────── */`
  - L48: `/* ── VARIANTS (ONLY SOURCE TOKENS) ───────────────── */`
  - L69: `/* ── CHILD AUTO-INVERSION ───────────────────────── */`
- **What `(COLOR-INVERSION-HERE)` means:** the filename's parenthetical tag marks this file as the canonical exemplar of Toolskin's color-inversion contract. The pattern is: a parent component declares `--ts-this-bg` and `--ts-this-fg`, then `--ts-this-bg-inverse: var(--ts-this-fg)` and `--ts-this-fg-inverse: var(--ts-this-bg)`. Child elements (here, `.ts-banner__tag` and `.ts-banner__action` at L70–74) then consume the `-inverse` pair to render in the inverted palette automatically — no theme variant rules, no JS, no per-child overrides. This is the model the rebuild should propagate to every component family that contains "chip-on-surface" or "tag-on-background" patterns.
- **Refactor flags:**
  - **Hardcoded hex fallbacks in token defaults** (L40 `#1a1c20`, L41 `#e8eaed`, L50 `#3b82f6`, L51 `#fff`, L55 `#10b981`, L56 `#fff`, L60 `#fbbf24`, L61 `#1a1c20`, L65 `#ef4444`, L66 `#fff`) — Rule 15 / RULING 7 violation. These were inserted as a "belt-and-suspenders" fallback in case the system tokens fail to resolve. The rebuild should rely on the apcach engine generating valid values 100% of the time and remove the literal fallbacks. Today they make the OKLCH governance leak — a yellow `#fbbf24` and a blue `#3b82f6` are NOT apcach-derived from `--ts-accent`.
  - **`z-index: 2147483645`** (L15 fallback) is the max-int "ham-fisted overlay z" pattern — should be tokenized via `--ts-z-banner` exclusively.
  - **Hardcoded sizes:** `12px` font-size (L23), `11px` tag font-size (L87), `10px` arrow-emoji font-size, `0.04em` letter-spacing (L88), `5px` radius (L90), `1.5` line-height — should flow through `--ts-banner-*` tokens.
  - **`box-shadow: 0 2px 8px rgba(0, 0, 0, 0)`** (L29) is zero-alpha — effectively no shadow. Either delete or replace with a tokenized shadow.
- **Session 3/4 relationship:** This file is the **template** for how Session 4 components should declare their surface tokens. The `--ts-this-bg-surface` / `--ts-this-surface-text` / `--ts-this-bg-inverse` / `--ts-this-fg-inverse` quartet should be lifted into a documented pattern in the design-tokens-2.0 skill. `surfaces.css` (Session 3, commit `a0ea9e4`) defines `--ts-this-bg` derivatives but does NOT define the inversion pair — adding `--ts-this-bg-inverse`/`--ts-this-fg-inverse` to the system layer would let every component get this for free instead of redeclaring it.
- **Gap vs `_code-audit-catalog.md`:** (a) `.ts-banner*` family is mentioned in the catalog's debug-bar inventory. (b) NEW: the explicit four-step inversion pattern (TOKEN RESOLUTION → AUTO INVERSION → DEFAULT SURFACE → VARIANTS) with verbatim section headers is undocumented and should be lifted into a permanent skill reference. The `&`-nested variant pattern using CSS Nesting is new and worth flagging — this is the only file in the chunk that uses native CSS nesting at component scope. (c) Contradiction: the `(COLOR-INVERSION-HERE)` filename promises a "real" inversion engine, but the hardcoded hex fallbacks at L50–66 mean the variants do NOT route through the apcach pipeline. The rebuild must reconcile: either lift the inversion pair into surfaces.css and let `--ts-info/--ts-success/--ts-warning/--ts-danger` come from the status token chain, or document that this file's variants are intentionally "raw color" overrides outside the apcach contract.

---

### theme-toggle-switch-animation-component.css

- **Path:** `docs/references/toolskin.css_extracted-core-blocks-to-refactor/components/theme-toggle-switch-animation-component.css`
- **Lines:** 99  ·  **Bytes:** 3,801
- **Block type:** Imported third-party animation asset (toggles.dev v4.10.1 "expand" variant) integrated into Toolskin. Pure CSS clip-path + `d:path()` transition for day-to-night SVG icon morph. **No `--ts-*` token participation at all** — this file lives entirely in the `--theme-toggle__expand--*` private namespace.
- **Key `--ts-*` tokens declared:** none.
- **Key non-`--ts-*` tokens declared:** `--theme-toggle__expand--duration: 1500ms` (L28)
- **Key `--ts-*` tokens referenced:** none.
- **Key classes:** `.theme-toggle`, `.theme-toggle--reversed`, `.theme-toggle--force-motion`, `.theme-toggle__expand` (+ children `g circle`, `g path`, `:first-child path`), `.theme-toggle--toggled`, `.theme-toggle-sr` (screen-reader label, set `display: none` — see flag), `.theme-toggle input[type=checkbox]:checked~.theme-toggle__expand`
- **Keyframes:** none (pure transition).
- **Owner annotations VERBATIM:**
  - L1–21: full HTML usage example as a block comment, including the source URL `https://toggles.dev/expand` and CDN link `https://cdn.jsdelivr.net/npm/theme-toggles@4.10.1/css/expand.min.css` and the canonical markup for the `<label class="theme-toggle theme-toggle--force-motion">…</label>` structure.
- **Refactor flags:**
  - **Foreign namespace** — `--theme-toggle__expand--duration` uses `--` separators in the toggles.dev convention, NOT `--ts-*`. Per the rebuild's namespace contract, either alias it (`--ts-theme-toggle-duration: 1500ms` → consumed inside, or wrap the imported CSS) or accept the foreign namespace as an explicit exception for imported assets and document the carve-out.
  - **`.theme-toggle-sr` display: none** (L82) — the screen-reader label is killed visually with `display: none`, which removes it from the accessibility tree. The recommended pattern is `clip: rect(0,0,0,0); position: absolute; …` (already present at L73–81). The `display: none` at L82 overrides the entire sr-only pattern above it and breaks screen-reader announcement of the toggle action. Flag for the `accessibility` skill — this is a real WCAG regression.
  - **`prefers-reduced-motion` honors `theme-toggle--force-motion` opt-out** (L93–97) — this is the correct opt-out pattern. Compare to `effects-layers-special-sections-css.css` where the entire `prefers-reduced-motion` block was commented out. This file gets it right.
  - **`@supports not (d:path(""))` fallback** (L85–91) — graceful degradation to `translate3d` when CSS path animation is unsupported. Good pattern.
  - **`1500ms` hardcoded** — could route through `--ts-dur-slow`/`--ts-dur-slower` but the entire file is foreign-namespaced so it would break the import contract.
- **Session 3/4 relationship:** Effectively isolated from the rebuild's token system. Decide whether to (a) leave it as a vendored asset with foreign namespace, (b) wrap it in a `.ts-theme-toggle` host that maps `--ts-*` tokens onto `--theme-toggle__expand--*` inside that scope, or (c) reimplement from scratch in `--ts-*` namespace. The `accessibility` regression at L82 is the highest-priority fix regardless of which path.
- **Gap vs `_code-audit-catalog.md`:** (a) Theme-toggle is mentioned in catalog L590 utility class index. (b) NEW: the `display: none` on `.theme-toggle-sr` masking the sr-only pattern is an undocumented a11y bug. The source URL + version pin (toggles.dev v4.10.1) is useful provenance not in the catalog. (c) No contradictions.

---

### marquee-component.css

- **Path:** `docs/references/toolskin.css_extracted-core-blocks-to-refactor/components/marquee-component.css`
- **Lines:** 150  ·  **Bytes:** 3,942
- **Block type:** Self-contained leaf component. Owner header L1: `/* === Marquee Component (self-contained) === */`. Declares its own component tokens at the top of `.ts-marquee-container` (L3–19) and consumes them downstream.
- **Key `--ts-*` tokens declared (inside `.ts-marquee-container`, L4–19):**
  - `--ts-marquee-border-color: var(--ts-border-0)`
  - **`--ts-marquee-bg` declared twice** (L5: `var(--ts-bg-1)`, L6: `var(--ts-accent-glow-bg-2)`) — the second wins; the first is dead code.
  - `--ts-marquee-color: var(--ts-text-primary)`
  - **`--ts-marquee-font-size` declared twice** (L8: `var(--ts-fs-4xl)`, L9: `var(--ts-fs-hero)`) — second wins.
  - `--ts-marquee-speed: 45s` (hardcoded)
  - `--ts-marquee-radius: var(--ts-radius-lg)`
  - **`--ts-marquee-pad` declared twice** (L12: `var(--ts-section-pad)`, L13: `var(--ts-sp-8)`) — second wins.
  - `--ts-marquee-border: 1px` (hardcoded)
  - `--ts-marquee-separator: calc(var(--ts-marquee-font-size) / 2)` — derivative
  - `--ts-marquee-gutter: var(--ts-sp-6)`
  - `--ts-marquee-height: 100%`, `--ts-marquee-width: 100%`, `--ts-marquee-weight: 600`
- **Key `--ts-*` tokens referenced:** see above — all consumed within the file.
- **Key classes:** `.ts-marquee-container`, `.ts-marquee.fullwidth.ts-marquee-container`, `.ts-masonry-item .ts-marquee.fullwidth.ts-marquee-container` (scoped exception), `.ts-marquee-text-wrap`, `.ts-marquee-text-content`, `.ts-marquee-text-text`, `.ts-marquee-text-text br` (guard), `.ts-marquee[data-mq-direction="right"] .ts-marquee-text-text` (reverse), `.ts-marquee-container .ts-marquee-text-text[data-text-content]` + `::before` (seamless loop duplicate)
- **Keyframes:** `ts-marquee-text-animation` (declared TWICE — `@-webkit-keyframes` L120–128 AND `@keyframes` L130–138, identical) and `ts-marquee-loop` (L140–148). The non-prefixed `ts-marquee-text-animation` is **declared but never consumed** in this file — the actual `.ts-marquee-text-text` animation references `ts-marquee-loop` at L77. Dead code.
- **Owner annotations VERBATIM:**
  - L1: `/* === Marquee Component (self-contained) === */`
  - L21: `/* OWNER FIXES: i added poinet event none to avoid the animation stop on hover. tis shoud be removed whenthe behaviour is removed from the defaults. this is a hardcoded tmeporary fix. */`
  - L72: `/* Automatically fits the text exactly */`
  - L91: `/* Guard: <br> from innerText ignores white-space:nowrap — hide them */`
  - L96: `/* Right direction (reverse animation) */`
  - L101–106 (commented-out): `/* === responsive: hide below 700px (matches original) === @media (max-width: 700px) { .ts-marquee-container { display: none; } } */`
  - L108: `/* Marquee only: duplicate strip via ::before so translateX(-50%) loops seamlessly */`
  - L149: `/* Moves text by exactly half its width, creating seamless loop */`
- **Refactor flags:**
  - **Triple-declared override pattern** (`--ts-marquee-bg`, `-font-size`, `-pad`) is a known anti-pattern — the first declaration is intent, the second is "actually use this". Council should pick one and delete the other. The "winning" values are all the more progressive choices (`--ts-accent-glow-bg-2`, `--ts-fs-hero`, `--ts-sp-8`).
  - **`pointer-events: none`** at L20 with the L21 owner note flags this as a known regression-mitigation; the marquee can never be hovered, clicked, or interacted with until the upstream "stop-on-hover" default behavior is removed elsewhere.
  - **Dead keyframes** `ts-marquee-text-animation` (L120–138) — never referenced. Delete.
  - **`-webkit-` prefix on keyframes/animation properties** (L77, L79, L81, L120) is legacy; modern Chrome/Safari don't need them. Strip.
  - **`45s` hardcoded marquee speed** — should align with `--ts-dur-*` family or a new `--ts-marquee-speed` knob.
  - **`translateX(-50%)` + `left: 50%`** trick at L47–48 for fullwidth marquee inside narrower containers is fragile; flag for re-engineering.
- **Session 3/4 relationship:** Consumes `--ts-bg-1` (in dead declaration L5) and `--ts-accent-glow-bg-2` (live, L6). `--ts-bg-1` is a legacy primitive; once the surface chain finalizes, the L5 dead declaration should die alongside it. `--ts-accent-glow-bg-2` references the effects system — verify it survives the Session 3+ migration.
- **Gap vs `_code-audit-catalog.md`:** (a) `.ts-marquee*` and `@keyframes ts-marquee-loop` appear in catalog §4.8 (keyframes inventory) and §4.10 (component families). (b) NEW: the dead `ts-marquee-text-animation` keyframes are not catalogued. The triple-declared token pattern is not surfaced in the catalog. The hover-disable `pointer-events: none` workaround is undocumented. (c) No contradictions.

---

### hero-section.css

- **Path:** `docs/references/toolskin.css_extracted-core-blocks-to-refactor/components/hero-section.css`
- **Lines:** 138  ·  **Bytes:** 4,226
- **Block type:** Section block under header `§8a Hero Section` (L2). Declares one private variable `--_ts-hero-offset` (underscore prefix denotes local) and a light-theme fork for `.ts-hero__badge`.
- **Key `--ts-*` tokens declared:** `--_ts-hero-offset` (L6, recomputed L23) — local-scoped private variable.
- **Key `--ts-*` tokens referenced:**
  - Surface chain (legacy): `--ts-bg-0` (L16)
  - Spacing/sizing: `--ts-topbar-h` (L6, L23), `--ts-sp-14` (L11–12, L18, L23, L25), `--ts-container-pad` (L13), `--ts-promo-banner-h` (L23), `--ts-sp-8` (L34, L82), `--ts-sp-2` (L68, L100, L117), `--ts-sp-4` (L101, L118, L135), `--ts-sp-5` (L111, L128), `--ts-sp-1` (gap)
  - Accent chain: `--ts-accent-dim-2` (L102), `--ts-accent-bright` (L103, L109), `--ts-accent-dim-3` (L119), `--ts-accent-dark` (L120, L126), `--ts-accent-dark-2` (L129)
  - Type: `--ts-fs-xs` (L105, L123), `--ts-radius-full` (L104, L121)
- **Key classes:** `.ts-hero`, `body:has(.ts-promo-banner:not(.ts-dismissed)) .ts-hero` (offset override via `:has()`), `.ts-container.ts-flex-row.ts-fullwidth`, `.ts-container.ts-flex-row:has(.ts-hero-content)`, `.ts-hero.ts-hero-centered .ts-hero-content.ts-flex-col`, `canvas` (unscoped — see flag), `.ts-hero-image`, `.ts-hero-content.ts-flex-col`, `.ts-hero__badge`, `[data-theme="light"] .ts-hero__badge`, `.ts-hero__actions`
- **Keyframes:** none.
- **Owner annotations VERBATIM:**
  - L2: `/* ─── §8a  Hero Section ─── */`
  - L5: `/* Account for fixed header elements (topbar + optional promo banner) */`
  - L17: `/* Opaque fallback — ensures blend modes work */`
  - L21: `/* When promo banner is visible, double the offset (banner + nav both use --ts-topbar-h) */`
  - L38–56 (LARGE REFACTOR NOTE block): `/* REFACTOR NOTES:` / blank / `Here I added a necessary variant for the hero section, and likely for any content-based section such as parallax or CTA blocks.` / blank / `We need to handle variants and tokens intelligently so that, with just a single class, all inner elements automatically arrange themselves correctly:` / blank / `1. The block should be properly structured and responsive by default, without requiring additional setup.` / blank / `2. These options—and other layout variants—should be easily configurable within the hero editor section in the ts-oce-panel. We should also enable layered animations for different parts of the hero content. Currently, only a single block animation exists, which is too limited. The hero is a primary asset and needs more flexibility.` / blank / `3. There is currently no way to control button presence, quantity, or individual styles.` / blank / `4. The hero (or any featured fullscreen section) should include an option for a "next section" animated arrow at the bottom, indicating that the user can scroll or navigate further.` / blank / `5. We already added support in core toolskin.js for scrollspy and tracking user scroll state. It correctly applies classes and attributes to the main HTML scope. This should be leveraged to apply dynamic styles to the main navigation.` / blank / `Refer to @implementation_note#3.` / blank / `*/`
  - L57: `/* #CRAZY_FIX_RULES */`
- **Refactor flags:**
  - **`background-color: var(--ts-bg-0)`** (L16) — Rule 15 violation; legacy primitive, must move to `--ts-this-bg` derivative chain.
  - **`canvas` selector (unscoped)** at L72 — this rule applies `min-width: 100%; min-height: 100%; object-fit: cover` to **every `<canvas>` in the document**, not just hero canvases. Highly likely to bleed into chart/visualization canvases. Must scope to `.ts-hero canvas`.
  - **`padding-bottom: var(--ts-sp-14)`** declared twice in `.ts-hero` (L12 and L18) — duplicate, second is no-op but adds parse cost.
  - **`!important` on padding-top** in the body-has() rule (L24) — single `!important` to win over base `.ts-hero` padding-top. Brittle.
  - **Light-theme fork at L114–130 duplicates the entire `.ts-hero__badge` rule** instead of overriding only the divergent properties. Also declares `color` TWICE (L126, L129) — last wins. Refactor to override only `background`, `border`, `color`, `font-weight`, `letter-spacing` deltas.
  - **`clamp(285px, 90vw, 200px)`** on `.ts-hero-image` (L86) — **invalid clamp**: max (200px) < min (285px). CSS will silently swap and clamp to 285px. Bug.
- **Session 3/4 relationship:** `--ts-bg-0` consumer flags this for surface migration. The `:has()` cascade for promo-banner offset is sound but couples hero to a sibling component — when the layout system gets a proper variable-height topbar, this can simplify. The badge variants are some of the few light-theme forks in this chunk — they're a good test specimen for the light-mode auto-derive engine.
- **Gap vs `_code-audit-catalog.md`:** (a) `.ts-hero*` family is mentioned in catalog §4.10. (b) NEW: the unscoped `canvas` selector bleed is a real bug not flagged. The invalid clamp at L86 is undocumented. The REFACTOR NOTES block (L38–56) is high-value design intelligence — five enumerated requirements for the hero variant system that should drive the rebuild's hero spec. (c) No direct contradictions.

---

### ts-ui-select-dropdown-max-height-calc.css

- **Path:** `docs/references/toolskin.css_extracted-core-blocks-to-refactor/components/ts-ui-select-dropdown-max-height-calc.css`
- **Lines:** 126  ·  **Bytes:** 5,628
- **Block type:** Scoped utility (v3). Solves a custom-property inheritance bug where v2's `:root`-declared formula would short-circuit when the same class (e.g. `.ts-banner-generator-app`) appeared on both `:root` and a descendant panel. **v3 fix:** re-declare BOTH the knobs AND the formula in each context — formula resolves at the context root, dropdown inherits a fully-resolved value.
- **Key `--ts-*` tokens declared (in 5 separate scopes):**
  - **`:root`** (L24–33): `--ts-ui-select-dd-min: 12rem`, `--ts-ui-select-dd-runway: 14rem`, `--ts-ui-select-dd-max-abs: 28rem`, `--ts-ui-select-dd-max-rel: 70dvh`, `--ts-ui-select-dd-max-h: clamp(…)` formula
  - **`.ts-oce-panel, .ts-oce-panel__inner, .ts-oce-panel .ts-card, .ts-oce-panel .ts-tab-pane`** (L40–54): `--ts-ui-select-dd-min: 7rem`, `-runway: 22rem`, `-max-abs: 16rem` (256px hard cap), `-max-rel: 45dvh` + formula
  - **`.ts-modal, .ts-modal__body`** (L57–67): `-min: 10rem`, `-runway: 18rem`, `-max-abs: 22rem`, `-max-rel: 55dvh` + formula
  - **`:root.ts-banner-generator-app`** (L70–79): `-min: 10rem`, `-runway: 16rem`, `-max-abs: 22rem`, `-max-rel: 60dvh` + formula
  - **`.ts-banner-generator-app.ts-oce-panel` (+ children)** (L85–96): same as oce-panel — belt-and-suspenders override.
- **Key `--ts-*` tokens referenced:** `--ts-ui-select-dd-min/-runway/-max-abs/-max-rel/-max-h` (self), `--ts-ui-select-trigger-min-height` w/ fallback `2.75rem` (L109)
- **Key classes:** `.ts-ui-select__dropdown` (L101–106 — applies max-height + flex layout), `.ts-ui-select__list` (L108–113 — list overflow scrolling within dropdown), `.ts-ui-select--no-search .ts-ui-select__list` (L115–117 — full-height variant when no search input)
- **Keyframes:** none.
- **At-rules:** `@supports (anchor-name: --foo) and (position-try-fallbacks: flip-block)` (L121–125) — progressive enhancement for CSS anchor positioning.
- **Owner annotations VERBATIM:**
  - L1–2: `/* OWNER's FIX:  enhanced dropdown mac heigh system .` / `NEW Refactor Note URGENT: we need to merge and unify all the  spared  code  from the assets to one place ,,  except for the scoped sepcific isolated rules inside bannergenertor.  or other isolated nested scopes. but this al l the cascade inherited  styles must be grouped. move this and all the other inheritanee styles and  all other cases to  unify and clean up the  code.  */`
  - L4–19: full v3 architectural comment explaining why v2 failed and how v3 fixes it (verbatim above)
  - L21–23: `/* ── 1. PAGE-LEVEL DEFAULT` / `NEW REFACTOR NOTE:` / `MOVE TO MAIN ROOT  VARS AND GROPU WIOTH COMPONENT SELECT   ASSET VARS.  DO THE SDAME WITH ALL OTHER DISPERSED NON-SCOPED VARIABLES AROUND THE SHEET AND CHECK THEY ARE STILL APPLIEDON EACH MIGRATION.. ───────────────────────────────────────── */`
  - L35: `/* ── 2. CONSTRAINED CONTEXTS — knobs AND formula re-declared ─────── */`
  - L37–39: `/* Offcanvas editor: dropdown is clipped by .ts-oce-panel__inner's overflow:auto. We size it to fit comfortably WITHIN the panel viewport, never trespassing past the sticky footer. */`
  - L46: `/* tabs + open accordion + footer */`
  - L48: `/* hard cap: 256px inside panel */`
  - L56: `/* Modal body */`
  - L69: `/* Banner generator app (class lives on :root in this app) */`
  - L81–84: `/* Belt-and-suspenders: when the offcanvas panel ALSO has the banner-generator-app class on it (image 3 shows this is real), the panel's offcanvas knobs must win over the app-level knobs. Higher specificity selector for the win. */`
  - L99: `/* ── 3. APPLY TO THE DROPDOWN ────────────────────────────────────── */`
  - L120: `/* ── 4. ANCHOR POSITIONING (progressive enhancement) ─────────────── */`
- **Refactor flags:**
  - **Formula declared 5 times** — exemplifies the "knob and formula together" v3 fix but creates 5 maintenance points. Council should consider whether a CSS `@property` + scoped sub-property could collapse this.
  - **L1 typos** ("mac heigh") and L2/L22 typos ("sdame", "spared", "iotneractiver", "implementastions") — owner's documented refactor stress. Don't fix; preserve as evidence of urgency level.
  - **`+ 1px` adjustment** in `.ts-ui-select__dropdown max-height` (L102) — magic number to account for fractional pixel rounding. Should comment why.
  - **`@supports (anchor-name: --foo)`** at L121 — checks support but `--foo` is a placeholder, not the actual anchor name used. Standard pattern, but worth confirming it actually gates the feature correctly (Chrome 125+, no Firefox/Safari as of early 2026).
- **Session 3/4 relationship:** Pure scoped-utility file, no surface-chain coupling. The pattern (declare knobs + formula in every context that overrides them) is a powerful one and should be cited in the design-tokens-2.0 skill as a known-good workaround for CSS custom property cascade short-circuits. The L2 + L22 NEW Refactor Notes flag that the owner wants ALL similar "dispersed non-scoped variables" centralized.
- **Gap vs `_code-audit-catalog.md`:** (a) `.ts-ui-select*` and `--ts-ui-select-*` token family appear in catalog §4.10. (b) NEW: the v2→v3 architectural lesson at L4–19 is undocumented in the catalog and is high-value design intelligence the rebuild MUST preserve. The 5-context override pattern is novel. The `@supports anchor-name` feature gate is undocumented. The "belt-and-suspenders" .ts-banner-generator-app.ts-oce-panel override (L81–96) reveals real-world specificity conflict resolution. (c) No contradictions.

---

### tooltips-styles.css

- **Path:** `docs/references/toolskin.css_extracted-core-blocks-to-refactor/components/tooltips-styles.css`
- **Lines:** 212  ·  **Bytes:** 6,330
- **Block type:** Leaf component — `#ts-tooltip-container.ts-tooltip` (ID-scoped) with full placement engine (top/bottom/left/right) for `ToolskinTooltip` (`Toolskin.initTooltips`), YSS `TooltipManager` parity.
- **Key `--ts-*` tokens declared (inside `#ts-tooltip-container.ts-tooltip`, L4–23):**
  - `--ts-tooltip-bg: var(--ts-this-bg)` (L5) → then immediately `--ts-this-bg: #1a1b1e` (L6) → then **`--ts-this-bg: #0c0c0d`** (L8, wins)
  - `--ts-tooltip-border: var(--ts-this-bg-border-hover)` (L10)
  - `--ts-tooltip-color: #e8e9eac9` (L11 — hardcoded with alpha)
  - **`--ts-tooltip-font-size` declared twice** (L12: `var(--ts-fs-2xs, 0.7rem)`, L13: `10px`) — second wins.
  - `--ts-tooltip-arrow-size: 5px`, `--ts-tooltip-duration: 120ms`, `--ts-tooltip-border-radius: 5px`, `--ts-tooltip-max-width: 200px`, `--ts-tooltip-min-width: 40px`
  - `--ts-tooltip-pad-y: var(--ts-sp-3)`, `--ts-tooltip-pad-x: calc(var(--ts-tooltip-pad-y)*1.1)`, `--ts-tooltip-padding`, `--ts-tooltip-lh-factor: 1.45`, `--ts-tooltip-line-height` (derivative)
- **In light-theme override** (L51–58): `--ts-this-bg: #1a1b1e` (different from dark!), `--ts-this-bg-border: color-mix(in srgb, var(--ts-this-bg), white 14%)`
- **Key `--ts-*` tokens referenced:** `--ts-this-bg`, `--ts-this-bg-border-hover`, `--ts-this-bg-border` (consumed via mix), `--ts-font-mono` (L40), `--ts-sp-3` (L19), `--ts-accent` (L205, L211), `--ts-index-bar-height` (L195 — likely wrong reference, see flag)
- **Key classes/selectors:** `#ts-tooltip-container.ts-tooltip` (+ `--visible`), `[data-theme="light"] #ts-tooltip-container.ts-tooltip` + `[data-ts-theme="light"]` (forced-dark even in light mode), `#ts-tooltip-content`, `#ts-tooltip-arrow` + `::before`, placement variants `.ts-placement-top`/`-bottom`/`-left`/`-right` each with `#ts-tooltip-arrow` and `::before` positioning rules, `#ts-tooltip-content ul/ol/li/a`
- **Keyframes:** none.
- **Owner annotations VERBATIM:**
  - L2: `/* ── ToolskinTooltip (Toolskin.initTooltips) — YSS TooltipManager parity: placement + arrow + tokens ── */`
  - L3: `/* Tooltip: ALWAYS dark surface + light text regardless of page theme */`
  - L9 (commented-out): `/*--ts-tooltip-border: rgba(255, 255, 255, 0.08);*/`
  - L50: `/* Light theme: force same dark tooltip */`
  - L97: `/* Placement: arrow + alignment (JS sets .ts-placement-*) */`
  - L103–104 (commented-out): `/*bottom: calc(var(--ts-tooltip-arrow-size) * -2 + 1px); height: calc(var(--ts-tooltip-arrow-size) * 2 + 1px);*/`
  - L122–123, L173–174 (similar commented-out alt-arrow-positioning blocks)
- **Refactor flags:**
  - **`#ts-tooltip-container` ID selector** — high specificity, hard to override. Should this be a class for theming flexibility? Council call.
  - **Hardcoded hex colors:** `#1a1b1e`, `#0c0c0d`, `#e8e9eac9` (L6, L8, L11, L54) — Rule 15 violations. The tooltip is explicitly "always dark" but should derive from a dark-surface token (`--ts-surface-strong`?) rather than literals.
  - **`line-height: vr(--ts-tooltip-line-height)`** at L39 — **TYPO**: `vr(` instead of `var(`. The line-height declaration is silently invalid; falls back to the L73 `line-height: var(--ts-tooltip-line-height)` on `#ts-tooltip-content`. Real bug.
  - **`pointer-events: none !important`** declared 3× (L43, L65, L76) — overkill. Single declaration on parent suffices.
  - **Tooltip overrides `--ts-this-bg` then derives `--ts-tooltip-bg` from it** (L5–8) — clever but the redeclaration ordering means `--ts-tooltip-bg` resolves to `#0c0c0d` (the L8 value), not `#1a1b1e` (L6). Either intentional or accidental — surface to council.
  - **`--ts-index-bar-height`** at L195 used as `margin-top` for `ul/ol` lists inside tooltips — almost certainly wrong reference. `--ts-index-bar-height` is for index/sidebar UI, not tooltip-list spacing. Probably should be `--ts-sp-2` or similar.
  - **`text-wrap: pretty`** (modern feature) at L75, L143, L164, L169 — Chrome 117+. No fallback needed; degrades to default wrap.
  - **`box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4)`** (L47) hardcoded — should tokenize.
  - **Differential `--ts-this-bg` between dark (`#0c0c0d`) and light (`#1a1b1e`) modes** (L8 vs L54) — semi-intentional ("force dark in light theme"), but inconsistent: light-mode is LESS dark than dark-mode. That's wrong — should be equally dark or darker.
- **Session 3/4 relationship:** Consumes `--ts-this-bg-border` and `--ts-this-bg-border-hover` from the surface-derivative chain — good, this file shows the chain at work. The dark-only forced surface conflicts with the surface engine's theme-aware derivation; the rebuild should formalize a `--ts-surface-strong` or `--ts-surface-inverted` token that's always-dark-regardless-of-theme rather than hardcoding `#0c0c0d`.
- **Gap vs `_code-audit-catalog.md`:** (a) Tooltip/`TooltipManager` is in catalog §1. (b) NEW: the `vr(...)` typo at L39, the `--ts-index-bar-height` misuse at L195, the dark-vs-light hex inconsistency (L8 vs L54), and the "force dark in light theme" pattern are all undocumented bugs/intent. (c) No direct contradictions.

---

### code-window-component.css

- **Path:** `docs/references/toolskin.css_extracted-core-blocks-to-refactor/components/code-window-component.css`
- **Lines:** 274  ·  **Bytes:** 6,885
- **Block type:** Leaf component — `.ts-code-window` macOS-style window-chrome wrapper for code blocks. Header (with traffic-light dots), content area, and copy button.
- **Key `--ts-*` tokens declared (inside `.ts-code-window`, L10–14):**
  - `--ts-card-border: var(--ts-border-1)`
  - `--ts-card-bg: var(--ts-bg-1-t)`, `--ts-card-bg-2: var(--ts-bg-2-t)`
  - `--ts-card-header-text-fs: calc(var(--ts-card-fs)*1.01)`
  - `--ts-card-code-fs: calc(var(--ts-card-fs, 1em)*1)`
- **Declared inside `.ts-code-dotbtn`** (L134–139):
  - `--ts-code-dotsize: 12px`, `--ts-code-dot-border-color: var(--ts-card-border)`, `--ts-code-dot-radius: 100px`
  - **Hardcoded hex traffic-light colors:** `--ts-code-dot-color-red: #ef4444`, `--ts-code-dot-color-green: #22c55e`, `--ts-code-dot-color-yellow: #eab308`
- **Declared inside `.ts-code-content`** (L243): `--ts-this-bg: var(--ts-bg-0)` — used to drive `--ts-this-bg-dim-3` derivative for the code-block background (L245).
- **Key `--ts-*` tokens referenced:** `--ts-input-radius`, `--ts-card-radius`, `--ts-radius-sm`, `--ts-font-mono` (L9, L244, L259), `--ts-font-body` (L34), `--ts-card-fs`, `--ts-text-secondary` (L40, L192), `--ts-text-primary` (L202, L220), `--ts-text-primary-dim-2` (L176), `--ts-this-bg-dim-3` (L245), `--ts-this-bg-dim-4` (L46), `--ts-card-gap` (L177), `--ts-font-weight-normal` (L179), `--ts-bg-3` (L219), `--ts-fs-xs` (L223), `--ts-border-1` (L228), `--ts-sp-6` (L240)
- **Key classes:** `.ts-code-window`, `.ts-code-window .ts-code-copy` (L18-59 + L183-211 — **declared twice with different styles**), `.ts-code-window .ts-code-copy svg`, `.ts-code-header` (declared twice L69–71 and L73–85), `.ts-code-dotbtn` (declared twice L87–96 and L113–140), `.ts-code-dotbtn.red/.yellow/.green`, `.ts-code-dotbtn:nth-child(2)/(3)/:not(:first-child)`, `.ts-code-dotbtn::before/::after` (the trick), `.ts-code-label`, `.ts-code-copy:hover/:active/i`, `.ts-code-copy::after` (copied tooltip), `.ts-code-copy.copied::after`, `.ts-code-content` + `pre`/`code`
- **Keyframes:** none.
- **Owner annotations VERBATIM:**
  - L1: `/*Imported Code Window Component*/`
  - L32 (commented-out): `/* font-size: var(--ts-btn-icon) !important; */`
  - L162: `/* The first dot (e.g., red) */`
  - L165: `/* Position to the left of the main dot */`
  - L169: `/* The third dot (e.g., green) */`
  - L172: `/* Position to the left of the main dot */`
  - L213: `/* Copy tooltip */`
  - L237 (commented-out): `/* color: var(--ts-text-primary); */`
  - L265 (commented-out): `/* color: inherit; */`
- **Refactor flags:**
  - **`.ts-code-window .ts-code-copy` declared twice** (L18–59 AND L183–211) with totally different rule sets. Last rule wins for non-overridden properties; but L18–59 uses `!important` everywhere (border, outline, border-radius, padding, display, pointer-events, background, background-color, top, right, bottom, position, left, width, border-left, transform, margin, font-size-impl-via-line-height) which means it stomps L183–211 for those properties. Result: visual logic is split across two rules — high refactor priority.
  - **`.ts-code-header` declared twice** (L69–71 single-prop position; L73–85 full styling). Should consolidate.
  - **`.ts-code-dotbtn` declared twice** (L87–96 and L113–140) — the second redefines variables AND re-applies most properties. Last wins for non-`!important` properties; clearer pattern is one block.
  - **`!important` ladder** throughout (~25 instances). Single biggest `!important` density in this chunk.
  - **Hardcoded RGB traffic-light colors** in `.ts-code-dotbtn.red/.yellow/.green` (L99–110) — `rgb(239, 68, 68)`, `rgb(234, 179, 8)`, `rgb(34, 197, 94)` AND ALSO hardcoded as hex tokens `#ef4444`, `#22c55e`, `#eab308` (L137–139). Two parallel hardcoded palettes for the same dots. Pick one.
  - **`.ts-code-dotbtn:nth-child(2), :nth-child(3), :not(:first-child) { display: none !important }`** (L142–146) — only ONE dot is rendered in the DOM; the other two "dots" are `::before`/`::after` pseudo-elements faked into looking like additional dots. Clever trick but fragile — adding a fourth dot or restructuring DOM breaks it. Document this as a known constraint.
  - **`border-radius: var(--ts-input-radius, var(--ts-card-radius), var(--ts-radius-sm))`** at L7 — INVALID syntax. `var()` accepts only ONE fallback, not a chain. Should be `var(--ts-input-radius, var(--ts-card-radius, var(--ts-radius-sm)))`. Currently `--ts-card-radius` is silently ignored.
  - **`--ts-this-bg: var(--ts-bg-0)` inside `.ts-code-content`** (L243) — Rule 15 violation; consuming legacy primitive directly to seed the surface chain. Should use a `--ts-this-bg-dim-N` from the parent or a surface contract.
- **Session 3/4 relationship:** `--ts-this-bg-dim-3` (L245) and `--ts-this-bg-dim-4` (L46) consumption confirms the file uses the derivative chain — but L243's seeding from `--ts-bg-0` breaks the chain at the top. Once `surfaces.css` exposes a proper code-block surface token, this file can drop the primitive reference.
- **Gap vs `_code-audit-catalog.md`:** (a) `.ts-code-*` family appears in catalog §4.10. (b) NEW: the duplicate-rule problem for `.ts-code-copy`, `.ts-code-header`, `.ts-code-dotbtn` is not flagged. The invalid `var()` 3-arg syntax at L7 is a real bug. The single-DOM-node-three-rendered-dots pseudo-element trick is undocumented architectural cleverness. (c) No contradictions.

---

### header-promobanner.css

- **Path:** `docs/references/toolskin.css_extracted-core-blocks-to-refactor/components/header-promobanner.css`
- **Lines:** 339  ·  **Bytes:** 8,286
- **Block type:** Layout-coupled component — `.ts-promo-banner` dismissable top bar. The file is half component, half global body-level `:has()` offset cascade that re-positions `.ts-nav-fixed` and the first `.ts-section`. Includes responsive media-query stack for ≤720px and ≤480px.
- **Key `--ts-*` tokens declared:**
  - **`--ts-accent: black`** inside `.ts-promo-banner__cta` (L109) — local override (Rule 15 violation — hardcoded color literal)
  - **`--ts-accent: black`** inside `.ts-promo-banner__close` (L136) — same
  - In media `(max-width: 720px)`:
    - `:root { --ts-promo-banner-h: calc(var(--ts-topbar-h)*.75) }` (L209) — overrides global at small viewports
    - Inside `.ts-promo-banner .ts-promo-banner__cta:hover`: `--ts-input-btn-bg-accent: var(--ts-on-accent)` (L240), `--ts-input-btn-bg-accent-color: var(--ts-accent)` (L241)
- **Key `--ts-*` tokens referenced:** `--ts-accent` (L5, L141, L241), `--ts-accent-dark` (L5), `--ts-accent-dim-0` (L93, L123), `--ts-on-accent` (L58, L94, L114, L124, L140, L240), `--ts-promo-banner-h` (L13, L18, L30–31, L148, L156, L159–160, L165–166, L209, L227, L273, L285, L320, L331), `--ts-z-offcanvas` (L29), `--ts-sp-4` (L10, L119), `--ts-ease-in-out` (L15–17), `--ts-font-body` (L55), `--ts-font-display` (L75), `--ts-fs-body-sm` (L56), `--ts-fs-2xs` (L96), `--ts-fs-xs` (L304), `--ts-fs-xl` (L261, L281, L316), `--ts-radius-full` (L90), `--ts-btn-base-transitions` (L100), `--ts-dur-fast` (L110), `--ts-topbar-h` (L155, L160, L165–166, L209), `--ts-on-surface-muted` (L249), `--ts-input-btn-bg-accent` (L234), `--ts-input-btn-bg-accent-color` (L235)
- **Key classes/selectors:** `.ts-promo-banner` (+ `:not(.ts-dismissed)`, `::before`, `.ts-dismissed`), `.ts-promo-banner__text` (+ `strong`, `strong:has(.ts-icon)`), `.ts-promo-banner__cta` (+ `:hover`), `.ts-promo-banner__close` (+ `:hover`), then a long `:has()` cascade: `body:has(.ts-promo-banner:not(.ts-dismissed)) nav.ts-nav-fixed` (L147–149), `body:has(.ts-nav-fixed):has(.ts-promo-banner.ts-dismissed) #ts-main .ts-section:first-of-type` (L154–156), `body:has(.ts-nav-fixed):has(.ts-promo-banner:not(.ts-dismissed)) #ts-main .ts-section:first-of-type` (L158–161, L164–168 — declared twice for padding-top AND margin-top, see flag)
- **Keyframes:** none.
- **Owner annotations VERBATIM:**
  - L3: `/* ── PROMO BANNER (dismissable top bar) ──────────────────── */`
  - L21 (commented-out): `/* position: sticky; */`
  - L146: `/* #CRAZY_FIX_RULES */`
  - L153: `/* Fixed header body offset */`
  - L163: `/* Fixed header body offset */`
  - L175–203 (LARGE REFACTOR BLOCK): `/* #CRAZY_FIX_RULES` / blank / `A complex media-query-based ruleset was introduced to stabilize a poorly structured banner in mobile scenarios.` / blank / `Current behavior:` / `- The primary button switches to an overlay-style button on mobile` / `- The banner is forced to avoid wrapping when the sidebar opens` / `- Visual result is acceptable, but the implementation is fragile` / blank / `Problems:` / `- Text wrapping logic is inconsistent and unpredictable` / `- Layout behavior is tightly coupled to edge-case conditions (e.g. sidebar state)` / `- Heavy reliance on ad hoc media queries instead of system-driven responsiveness` / `- Low maintainability and poor scalability` / blank / `Required improvements:` / `- Replace conditional layout hacks with pattern-based, token-driven layout logic` / `- Use intrinsic layout techniques (flex/grid, min/max constraints, clamp) instead of forced no-wrap rules` / `- Decouple banner behavior from external UI states (like sidebar open/close)` / `- Define a reusable responsive pattern for "banner with action" components` / `- Introduce tokenized rules for:` / `  - Button placement (inline / stacked / overlay)` / `  - Text wrapping thresholds` / `  - Container constraints (max-width, safe areas, padding)` / blank / `Goal:` / `A deterministic, system-driven banner behavior that adapts automatically across breakpoints without fragile overrides or special-case media queries.` / blank / `*/`
- **Refactor flags:**
  - **`#CRAZY_FIX_RULES` marker** appears 2× (L146, L175) — these are the owner's explicit "this is fragile, fix later" flags. High-priority refactor candidates.
  - **`--ts-accent: black` hardcoded** in `.ts-promo-banner__cta` (L109) and `.ts-promo-banner__close` (L136) — Rule 15 violation, plus the variable name is `--ts-accent` but the value is the polar opposite. Naming lies. Should be a separate `--ts-promo-cta-on-color` token.
  - **`rgba(255, 255, 255, 0.04)` hardcoded** in `::before` pinstripe (L39, L41) — Rule 15.
  - **`rgba(0, 0, 0, 0.32)` text-shadow** (L59) — Rule 15.
  - **`rgba(0, 0, 0, 0.35)` background** at L91 then immediately overridden by `var(--ts-accent-dim-0)` at L93 — dead declaration.
  - **`!important` ladder** — `transform`, `padding-top`, `opacity` etc.
  - **Duplicate `padding-top` declaration** at L154–156 (dismissed branch) and L158–161 + L164–168 — the not-dismissed branch declares padding-top twice (L159 raw `--ts-promo-banner-h`, L160 calc combining topbar+promo) and margin-top twice (L165, L166). Second wins both times; first is dead code.
  - **`@media (max-width: 480px)` line-clamp on `__text`** uses both modern `line-clamp` (L308) AND `-webkit-line-clamp: 2 !important` (L309) — fine pattern for compatibility.
  - **Body-level `:has()` cascade** is brittle: any new fixed-position element (e.g., a second promo banner, an A/B test bar) breaks the formula. Owner's L175–203 note explicitly calls this out.
- **Session 3/4 relationship:** Heavy consumer of accent chain (`--ts-accent`, `--ts-accent-dark`, `--ts-accent-dim-0`, `--ts-on-accent`) — verify these all exist in `surfaces.css`/accent engine. The L209 media-query `:root` override of `--ts-promo-banner-h` is a global side effect that other components (`.ts-banner` at `ts-notif-banner-component`, `.ts-hero` at `hero-section.css`) depend on. This is a load-order hazard: if this file loads after a component that already used the larger value, the new value won't recompute. Probably needs to move to a global responsive layer.
- **Gap vs `_code-audit-catalog.md`:** (a) `.ts-promo-banner*` family appears in catalog §4.10. (b) NEW: the `--ts-accent: black` local override pattern is undocumented; this is a Rule 15 anti-pattern that may exist in other components too. The body `:has()` offset cascade detail is undocumented. The 720/480 media-query patches are not in the catalog. The L175–203 refactor block is a high-value owner spec for the rebuild's "banner with action" pattern. (c) No contradictions.

---

### ta-ui-table-component.css

- **Path:** `docs/references/toolskin.css_extracted-core-blocks-to-refactor/components/ta-ui-table-component.css`
- **Lines:** 271  ·  **Bytes:** 8,744
- **Block type:** Leaf component — `.ts-ui-table--sortable` + scroll container + sticky thead + striped rows + row selection + floating bulk-action bar.
- **Key `--ts-*` tokens declared (inside `.ts-ui-table--sortable, .ts-ui-table-scroll, .ts-ui-bulk-bar`, L9–19):**
  - `--ts-table-border: var(--ts-border-1)`
  - `--ts-table-cell-border: color-mix(in srgb, var(--ts-table-border), transparent 40%)`
  - `--ts-table-head-border: color-mix(in srgb, var(--ts-table-border), transparent 50%)`
  - `--ts-table-bg-th: var(--ts-bg-0)` (Rule 15 violation)
  - `--ts-table-bg-1: var(--ts-bg-1)` (Rule 15)
  - `--ts-table-bg-2: var(--ts-bg-2)` (Rule 15)
  - `--ts-table-cell-pad: var(--ts-sp-3)`, `--ts-table-cb-size: 1.2rem`
  - `--ts-table-cell-fs: var(--ts-fs-sm)`, `--ts-table-th-fs: calc(var(--ts-table-cell-fs)*.9)`
- **Declared inside `.ts-ui-row--selected td`** (L89–90): `--ts-table-select-accent: color-mix(in srgb, var(--ts-accent), var(--ts-table-bg-1) 72%)`, `--ts-this-bg: var(--ts-table-select-accent)` — surface override on selection.
- **Key `--ts-*` tokens referenced:** `--ts-border-1`, `--ts-bg-0/-1/-2` (legacy primitives — flag), `--ts-sp-3/4`, `--ts-fs-sm/lg/2xs`, `--ts-radius-md/base/sm`, `--ts-text-primary/secondary` (L48, L70, L240), `--ts-accent`, `--ts-accent-bright-2` (L88), `--ts-this-bg`, `--ts-this-bg-dim-2/-4` (L85, L109, L114), `--ts-panel-ease-out` (L216), `--ts-border-0` (L268), `--ts-btn-radius`, `--ts-btn-fs`
- **Key classes:** `.ts-ui-table--sortable` (+ `.ts-ui-table--striped`, `.ts-ui-table--grid`), `.ts-ui-table-scroll`, `.ts-ui-table-bulk-wrap`, `thead th` (sticky + sort-key/ts-ui-sort), `tbody td/tr/.ts-ui-row--selected`, `.ts-ui-th--sortable::after` (sort arrow), `.ts-ui-th--active::after` (asc/desc), `.ts-ui-table__select-all`, `.ts-ui-row-checkbox`, `.ts-ui-checkbox-cell`, `.ts-ui-bulk-bar` (+ `:not([hidden])` + `[hidden]/[style*="display: none"]` variants), `.ts-ui-bulk-bar__count`, `.ts-ui-bulk-bar__actions`, `.ts-ui-bulk-bar__actions .ts-btn`, `.ts-ui-draggable-bounds`
- **Keyframes:** none.
- **Owner annotations VERBATIM:**
  - L2 (LARGE INLINE CRAZY_FIX): `/* #CRAZY_FIX_RULES: HERE THE TABLES WORKS GOOD BUT HAS REDUNDANCIES AND LACKS SMART FLEXIBILITY AND STULING  TO BE RESPONSIVE AND AVOIDING BREALING USING MODERN TABLE LAYOUT IMPLEMENTATION. ALSO THE   CELLS WITH ACTIONS DOESN T HAS INNER WRAPPERS FOR BUTTONS CELLS  AND  THERE IS NO REAL SUPPORT FOR IMAGE CELLS, OR PADING FLEXIBILOITY OR  COLUMN SIZING  PROPERLY. WE NEED  TO BE ABLE TO HANDLE GRIDS BETTER  AND THE PARAMETERS.. THE INNER ELEMENTS OF A TABLE ARE RTEALLY DIFFICULT AND STANDARD TO HANDLE.  I MANAGED TO IMPROVE THE CHECKBOXES AND SELECTED STATUSES. AND THE BULK SELECTION  ASSET LOOKS BETTER NOW.  BUT THE SACRIPT FOR BULK MENU  REVEAL AND THE LOGICS FOR TOOLK  DESIGN IS NOT ON MAIN CORE  JS, IS ON ANOTHER JS FOR SHOWECASE. IT MUST BE  MERGED.  */`
  - L3: `/* ── Table sort + scroll + sticky thead + bulk bar ─────────────── */`
  - L40 (commented-out): `/*padding-bottom: 4.5rem;*/`
  - L125: `/* REFACTOR NOTES: HERE  the component has two conflitive  implementastions at the same time: IT has the icon implemented a ijected  on the sortable header,s bitt istill has the  generated asccii char arrows that works pretty good. the problem is that the fotnaWESOME  injected ones ar enot styled and not working. and th e current bhelow yes. sao let's   deciede and  merge both versions to keep the most solid one with proper icons and statesd. */`
  - L207–210 (`@refactor:` tags): `/* @refactor:backdrop-critical */`, `/* @refactor:glass-dependent */`, `/* @refactor:needs-solid-fallback */`, `/* @refactor:token-dependency */` — structured machine-readable tags on the bulk-bar `backdrop-filter`.
  - L212 (commented-out): `/* margin-right: var(--ts-ui-scrollbar-size); */`
- **Refactor flags:**
  - **Multiple legacy primitive references** (`--ts-bg-0/-1/-2` at L12–14) declared INTO component tokens — Rule 15 chain violation. Must rewire to `--ts-this-bg-*` derivatives.
  - **Dual sort-arrow implementation** (L125 owner note + L130–174): ASCII chars `⇅`/`▲`/`▼` AND Font Awesome injection via JS. Owner says FA is "not working" and ASCII is "working pretty good" — kill the FA path.
  - **Heavy `!important`** on `.ts-ui-bulk-bar` reveal/hide logic (L221–235) — to override inline `display:none`/`style` attribute combinations. The L228–230 selector `[hidden], [style*="display: none"], [style*="display:none"]` is a known-fragile pattern; flag.
  - **`backdrop-filter: blur(4px) grayscale(0)`** on bulk-bar (L206) — `@refactor:backdrop-critical` per L207 tag. No solid fallback for unsupported browsers.
  - **Dual surface tokens for selected rows** (L84, L85, L86, L87 — 4 background/border declarations in one selector with the second overriding the first) — pick one.
  - **Hardcoded shadow** `2px 5px 11px rgba(0, 0, 0, 0.21)` (L211) — Rule 15.
  - **Hardcoded `420px` max-height** (L30) on scroll container.
  - **`color-mix(in srgb, var(--ts-table-border), var(--ts-text-primary) 4%)`** on L204 — using text-primary as a border tint contributor. Unusual but intentional.
- **Session 3/4 relationship:** This is one of the worst surface-chain offenders in the chunk — declares `--ts-table-bg-th`/`-1`/`-2` directly from legacy primitives. When `surfaces.css` becomes canonical, every consumer of `--ts-table-bg-*` will paint with stale colors unless this file's L9–19 declarations migrate to derivatives. Also, `--ts-this-bg` IS consumed via L87 + L109/L114 (`--ts-this-bg-dim-2/-4`) — but seeded from L90 which routes through a legacy mix. Inconsistent surface treatment.
- **Gap vs `_code-audit-catalog.md`:** (a) `.ts-ui-table*`, `.ts-ui-bulk-bar` are in catalog §4.10. (b) NEW: the `@refactor:*` structured tag system (L207–210) is a useful machine-parseable annotation convention — should be lifted into a refactor-tag inventory across all files. The dual sort-arrow implementation conflict is undocumented design intelligence. The selected-row 4-declaration mess is a real bug. (c) No contradictions.

---

### ts-btn-component(basic-ref).css

- **Path:** `docs/references/toolskin.css_extracted-core-blocks-to-refactor/components/ts-btn-component(basic-ref).css`
- **Lines:** 447  ·  **Bytes:** 14,601
- **Block type:** **CANONICAL REFERENCE** — the filename `(basic-ref)` annotation flags this as Toolskin's authoritative button reference. Establishes the `.ts-btn` base + variants + sizes + icon-host pattern. This file is the model the rebuild's button system MUST match.
- **What `(basic-ref)` means:** "basic reference" — the file documents the agreed-upon canonical button architecture as it exists today, *despite* including TEMP fixes. Per the L1–39 master comment, the architecture is a transitional state with explicit removal conditions ("MUST be removed once SmartButton builder enforces consistent structure"). The file is reference for "what IS today" not "what should be" — but the design contract (button system) IS the target.
- **Key `--ts-*` tokens declared:**
  - **Inside `.ts-btn`** (L42–47):
    - `--_btn-accent: var(--ts-accent)`
    - `--_btn-bg: var(--ts-bg-3)` (legacy primitive — flag)
    - `--_btn-color: var(--ts-text-primary)`
    - `--_btn-border: var(--ts-border-1)` then immediately `--_btn-border: var(--ts-this-bg-border)` (last wins — good, but L45 dead)
    - `--ts-this-bg: var(--_btn-bg)` — seeds the surface chain FROM the button background
  - **Inside `.ts-btn--primary`** (L228–232): consumes `--_btn-bg/border/color` — no new tokens.
  - **Inside `.ts-btn--outline`** (L257–272): full local token kit — `--_btn-bg/-hover/-accent/-border/-border-accent/-border-hover/-color/-color-hover` (8 locals) + `--ts-this-bg: var(--ts-text-secondary)` (Rule 15 hazard — text token used as surface seed).
  - **Inside `.ts-btn--ghost`** (L286–295): `--_btn-bg: color-mix(--ts-this-bg, transparent 98%)`, `--ts-this-bg: var(--ts-bg-1-t)` (legacy primitive — flag), local borders, **`--glow: color-mix(in srgb, var(--_btn-border), transparent 78%)`** and **`--ts-btn-ghost-glow`** composite shadow.
  - **Variants** `--danger/--success/--alt`: `--_btn-bg/-border` from `--ts-danger/--ts-success/--ts-accent-alt`, color `#fff` hardcoded (L330, L336, L342).
  - **Inside `.ts-btn--sm/md/lg/xl`** (L349–379): only `--ts-btn-scale`, `--ts-btn-h-ratio`, `--ts-btn-fs-ratio` — pure ratio-based size system. **EXEMPLARY pattern** — comment at L347 confirms intent: "SIZE VARIANTS — change ONLY the scale + ratios you want to differ. Everything else auto-derives from the ratio chain."
  - **Inside `.ts-btn--secondary/--tertiary`**: `--_btn-bg: var(--ts-bg-2-t)/-5` (legacy primitives — flag).
  - **Inside `.ts-btn__counter`** (L400–425): `--ts-on-accent: var(--ts-on-surface-dim)`, `--ts-accent: var(--ts-on-accent-dim)`, `--ts-this-bg-border: color-mix(--ts-this-bg-dim-4, --ts-on-accent-dim 75%)`.
- **Key `--ts-*` tokens referenced:** vast — every accent/text/surface/border/spacing/radius/duration/easing token family. Specifically `--ts-accent`, `--ts-accent-bright-2`, `--ts-accent-dim-2/--ts-accent-grad`, `--ts-accent-glow-bg-3`, `--ts-accent-shadow-glow`, `--ts-accent-border`/`--ts-accent-border-hover`, `--ts-on-accent`, `--ts-on-accent-dim`/`-1`/`-2`, `--ts-on-surface-dim`, `--ts-text-primary`/`-secondary`/`-secondary-dim-2`, `--ts-border-1`, `--ts-bg-1-t`/`-2-t`/`-3`/`-5` (legacy), `--ts-danger`/`-success`/`-accent-alt`, `--ts-this-bg`/`-active`/`-border`/`-border-active`/`-border-hover`/`-dim`/`-dim-4`/`-dim-6`/`-grad`/`-grad-2`/`-grad-3`, `--ts-btn-h`/`-pad-x`/`-pad-y`/`-fs`/`-fw`/`-ls`/`-radius`/`-dur`/`-icon-size`/`-scale`/`-h-ratio`/`-fs-ratio`, `--ts-fs-xl`, `--ts-icon`, `--ts-radius-full`, `--ts-shadow-accent-sm`, `--ts-sp-1`, `--ts-ease-out`
- **Key classes/selectors:** `.ts-btn` (base + `:hover:not(:disabled)`, `:disabled`), variants `.ts-btn--primary/-outline/-ghost/-danger/-success/-alt/-secondary/-tertiary/-sm/-md/-lg/-xl/-full`, `.ts-btn--ghost:active/-focus`, `.ts-topbar__actions .ts-btn--ghost.ts-btn--icon` (scoped exception), `.ts-btn__counter`, `.ts-icon`/`-> i/svg/ion-icon`, `.ts-icon:not(.ts-icon-dot):not(.ts-icon-tiny) > i`. Inside the `.ts-btn { … }` rule are NESTED selectors (CSS Nesting): `.ts-icon:not(…)` (L93–137) and `span:not(…), .ts-btn-text, .ts-menu-text` (L139–153) — modern CSS nesting at component scope.
- **Keyframes:** none.
- **Owner annotations VERBATIM:**
  - L2: `/* ─── §6a  BUTTONS ──────── */`
  - L4–39 (MASTER REFACTOR BRIEF — the canonical authoring note): `/*#OWNER REFACTOR NOTES:  @ts-smart_button_system. +  style  migration and centralization  v2: centralize SmartButton system as single core class builder. eliminate overlapping button implementations and enforce one construction pattern for all buttons across scopes. buttons must be fully adaptive, environment-agnostic, and extensible without breaking layout or behavior. JS must handle automatic construction: always wrap text in a dedicated span (.ts-btn-text), inject icons, counters, tooltips, and state layers consistently. CURRENT STATUS: - partial centralization achieved via core button attributes - vertical icon alignment patched via nested rules due to inconsistent font-size inheritance across legacy implementations - icon sizing recalculated multiple times across scopes → causes misalignment TEMP FIX (TO REMOVE): - nested icon normalization rules + margin-top hack applied - MUST be removed once SmartButton builder enforces consistent structure and sizing BLOCKERS: - SmartButton auto-construction class not implemented yet - missing guaranteed internal structure (icon + text span + helpers not consistent) - span class standardization (.ts-btn-text) not enforced TARGET ARCHITECTURE: - single SmartButton JS factory builds all buttons - guaranteed DOM structure: [button] [i.ts-btn-icon] [span.ts-btn-text] [span.ts-btn-counter?] [tooltip/helper nodes?] - CSS becomes token-driven only (no structural fixes) HARD RULES: - no manual button composition outside SmartButton system - no duplicated sizing logic across scopes - no hardcoded alignment fixes once system is stable - all variants must derive from token styling only MIGRATION: - mark current fixes as @temporary_alignment_patch - replace once SmartButton class is fully implemented and stable across all scopes */`
  - L48 (commented-out): `/* --ts-btn-icon-size: calc(var(--ts-btn-fs)*1); */`
  - L63 (commented-out): `/* background-image: var(--ts-this-bg-grad-2); */`
  - L100 (commented-out): `/* margin-top: -1%!important; */`
  - L101–136 (LARGE INLINE TEMP FIX BLOCK with `@ts-component-consolidate @temporary_alignment_patch` tag): full removal-conditions document for the icon alignment hack — verbatim available in the file, key text: `ICON ALIGNMENT FIX (CRITICAL / TEMPORARY): … REMOVAL CONDITIONS: - SmartButton system enforces strict DOM structure: .ts-btn-icon + .ts-btn-text - icon sizing defined once at root/token level - no nested/legacy icon rules affecting layout - consistent line-height across all button elements HARD RULE: this patch MUST be removed once button construction is fully centralized and no longer depends on inherited/legacy sizing behavior. NO MODIFICATIONS allowed unless part of full button system refactor.`
  - L161–162 (commented-out): `/*@ts-smart_button_system*/`, `/*@color_bg_surface_refactor*/`
  - L167–170 (commented-out block): `/*.ts-btn:active:not(:disabled) { transform: translateY(0) scale(0.98); } */`
  - L176–226 (LARGE REFACTOR NOTE v1 — outline-variant token-system): `/*#REFACTOR_NOTES v1: button token system + outline pattern (stage 1) CORE CONCEPT: establish a token-driven button system where --ts-this-bg acts as the base semantic color source for each button instance. all visual states derive from this value through mapped local tokens. PATTERN (CURRENT IMPLEMENTATION - OUTLINE VARIANT): - --ts-this-bg → semantic base (context-aware color token) - --_btn-bg → actual background (set to transparent for outline) - --_btn-bg-hover → subtle hover surface (mapped to dim variant) - --_btn-bg-accent → optional accent override for interactive states - --_btn-color → text color derived directly from --ts-this-bg STATE STRATEGY: - default: background = --_btn-bg - hover: background swaps to --_btn-bg-hover OR --_btn-bg-accent - no additional rules → only token reassignment - inheritance-driven updates must propagate automatically INSIGHT: this approach allows state changes by reassigning token values only, avoiding redundant selectors and enabling scalable theming. ISSUES DETECTED: - inconsistent naming (local --_btn-* vs global --ts-*) - cascade failures forcing use of !important - duplicated logic across button variants - unclear mapping between semantic tokens and implementation tokens REFACTOR TARGET: - unify naming convention (prefer ts-scoped or structured hybrid) - enforce single mapping layer: --ts-this-bg → --_btn-* → applied properties - eliminate !important via cascade normalization - standardize state tokens: --ts-this-bg-hover --ts-this-bg-active --ts-this-bg-accent HARD RULES: - no direct color values in components (tokens only) - no new selectors for states (token swap only) - all variants must follow same token contract MIGRATION NOTE: current structure is valid as a transitional model but must be normalized and tokenized further to support full automation via SmartButton system and global theming layer. */`
  - L227: `/* Variants */`
  - L237, L243: `/*@ts-smart_button_system*/`
  - L345: `/* ✅ SCALABLE SIZES: Only change scale, everything else auto-calculates */`
  - L346–348: `/* SIZE VARIANTS — change ONLY the scale + ratios you want to differ. Everything else auto-derives from the ratio chain. */`
  - L351: `/* dampen height: 1.3 × 0.88 = 1.14 effective h-scale */`
  - L353: `/* slightly tighter text:height ratio */`
  - L388, L395: `/*#NEW REFACTOR NOTES:  All the inputs that has gradients  by default must be removed and be delegated globally to a  global button and input styling mode "Lush Mode". WHICH SHOULD NABLE THE BACKGRUND IMAGES FOR THE INPUTS that has already the ts-this-bg built and only needs the image  set to work. the hover state should support it too. */`
  - L399: `/* Button with counter badge */`
  - L427: `/* Icon host for ToolskinIcons (data-icon / data-ts-icon) */`
- **Refactor flags (critical because this is canonical):**
  - **Legacy `--ts-bg-3/-1-t/-2-t/-5`** consumed at L43, L288, L389, L396 — even the canonical button file violates Rule 15.
  - **`color: #fff` hardcoded** at L232 (`--ts-btn--primary --_btn-color`), L252, L330, L336, L342 — Rule 15. Should be `--ts-on-accent` consistently.
  - **`--ts-this-bg: var(--ts-text-secondary)`** in `.ts-btn--outline` (L271) — using a TEXT token as the surface seed. The outline variant's text-color is then `var(--ts-this-bg)` (L264, L277) — clever but inverts the chain. Council should validate.
  - **`!important` ladder** across L266–270, L296–300, L306–308, L316–318 — owner's REFACTOR_NOTES v1 (L200) explicitly identifies this as a known refactor target.
  - **`--_btn-*` (single-underscore) namespace** mixed with `--ts-*` — owner's L201 acknowledges this is an inconsistency. The rebuild must pick one convention.
  - **Vast space-eating empty lines L82–92** (10 blank lines inside `.ts-btn`) — accidental editor scroll? Strip.
  - **CSS Nesting at component scope** (L93–153) — modern feature, fine in 2026 but flag for transpilation/build-step compatibility.
  - **`.ts-topbar__actions .ts-btn--ghost.ts-btn--icon`** (L322–325) — scoped exception with `!important`. Architectural debt.
  - **`text-shadow: 0px 0px 10px var(--glow)`** (L314) on focus/active — accessibility check: text-shadow can reduce contrast and trigger reduced-motion sensitivity.
- **Session 3/4 relationship:** This file IS the test specimen for Session 3's surface chain. `--ts-this-bg-active/-border/-border-active/-border-hover/-dim/-dim-4/-dim-6/-grad/-grad-2/-grad-3` are ALL consumed here — if ANY of those are missing from `surfaces.css`, this button's variants paint wrong. Conversely, every `--ts-bg-N` reference here (L43, L288, L389, L396) is a known migration target that the rebuild's `.ts-btn` MUST resolve. Owner's L4–39 SmartButton brief is the spec for the JS half of the rebuild.
- **Gap vs `_code-audit-catalog.md`:** (a) `.ts-btn*` family is in catalog §4.10 and `--ts-btn-*` tokens in §4.6/4.7. The `--ts-btn-scale` ratio chain is mentioned in §1i. (b) NEW: the SmartButton master brief (L4–39), the temporary alignment patch (L101–136), and the REFACTOR_NOTES v1 outline-variant spec (L176–226) are the three most important authoring documents in this entire chunk and MUST be lifted into the rebuild's button spec. The "Lush Mode" gradient-mode concept (L388, L395) is a NEW design feature not in any catalog. (c) Contradictions: the catalog's button-token inventory does not surface the `--_btn-*` local token convention; the rebuild needs to decide whether locals are first-class architecture or a transitional anti-pattern.

---

### ts-gallery-component+lightbox.css

- **Path:** `docs/references/toolskin.css_extracted-core-blocks-to-refactor/components/ts-gallery-component+lightbox.css`
- **Lines:** 538  ·  **Bytes:** 16,357
- **Block type:** **EXEMPLARY THREE-TIER COMPONENT.** Self-documented at L4–24 as the canonical Design Tokens 2.0 reference: "Tier 1 PRIMITIVE (—ts-bg-N, —ts-sp-N, —ts-radius-*) :root only / Tier 2 SYSTEM (—ts-this-bg, —ts-this-bg-border, …) set by component / Tier 3 COMPONENT (—ts-gallery-*) references Tier 2". This is the model for how component CSS should be structured.
- **Key `--ts-*` tokens declared (inside `.ts-gallery`, L30–57):**
  - **Surface seed:** `--ts-this-bg: var(--ts-bg-1)` (L32 + L73 `!important` — Rule 15)
  - **Component tokens (Tier 3):** `--ts-gallery-row-h: 18rem`, `-gap: var(--ts-sp-2)`, `-radius: var(--ts-radius-md)`, `-tall-mult: 2`
  - **Surface derivatives (Tier 2 routed):** `--ts-gallery-tile-bg: var(--ts-this-bg)`, `-tile-border: 1px solid var(--ts-this-bg-border)`, `-tile-shadow: 0 1px 0 0 var(--ts-this-bg-bright) inset`, `-overlay-bg: linear-gradient(to top, color-mix(var(--ts-this-bg) 88%, transparent) 0%, color-mix(var(--ts-this-bg) 0%, transparent) 60%)`, `-caption-color: var(--ts-text-primary)`
  - **Motion:** `--ts-gallery-hover-scale: 1.06`, `-hover-duration: var(--ts-dur-slow)`, `-hover-ease: var(--ts-ease-out)`, `-fade-duration: var(--ts-dur-slower)`
  - **Focus ring (accent-derived):** `--ts-gallery-focus-ring: 0 0 0 3px color-mix(in srgb, var(--ts-accent) 55%, transparent)`
- **Declared inside `.ts-gallery-lightbox`** (L385–388):
  - `--ts-this-bg: var(--ts-bg-0)` (Rule 15 — `--ts-bg-0` legacy)
  - `--ts-glb-overlay: color-mix(var(--ts-this-bg) 88%, transparent)`
  - `--ts-glb-control-size: 2.75rem`, `--ts-glb-pad: var(--ts-sp-4)`
- **Key `--ts-*` tokens referenced:** `--ts-bg-0`/`-1` (legacy), `--ts-this-bg`/`-border`/`-bright`/`-hover`, `--ts-sp-2`/`-4`, `--ts-radius-md`/`-sm`/`-full`, `--ts-text-primary`/`-secondary`, `--ts-accent`, `--ts-dur-slow`/`-slower`/`-base`/`-fast`, `--ts-ease-out`/`-snap`/`-spring`, `--ts-fs-sm`
- **Key classes/selectors:** `.ts-gallery` (base + `::after` clearfix), items `> li, > .ts-gallery__item` (+ `:focus-visible`), size mods `.full/--full`, `.two-third/--two-third`, `.half/--half`, `.third/--third`, `.quarter/--quarter`, `.double-height/--double-height`, `.float-right/--float-right`, `.ts-gallery__media` (+ `--loaded`, `:not(.ts-gallery__media--loaded)`), `.ts-gallery__skeleton`, `.ts-gallery__item--loaded .ts-gallery__skeleton`, `.ts-gallery__seo-img`, hover/focus `.ts-gallery__overlay`, `.ts-gallery__caption`, variants `.ts-gallery--uniform`, `.ts-gallery--sortable` + `.ts-ui-sortable__item--dragging`, lightbox `.ts-gallery-lightbox` (+ `--open`, `__stage/__img/__caption/__btn/--close/--prev/--next/__counter`), body lock `.ts-gallery-lightbox-open`.
- **Keyframes:** `ts-gallery-shimmer` (L211–214 — 400px-step gradient slide).
- **At-rules:** `@container ts-gallery (max-width: 900px / 600px / 400px)` (L321–349) for container-query responsive layout; `@supports not (container-type: inline-size)` (L352–375) viewport-media fallback; `@media (prefers-reduced-motion: reduce)` (L520–537) — correctly retained (unlike the disabled block in effects-layers).
- **Owner annotations VERBATIM:**
  - L4–24 (LARGE TIER ARCHITECTURE COMMENT): `/* ═══════════════════════════════════════════════════════════════════════ TS-GALLERY  ·  Float-based asymmetric image gallery ─────────────────────────────────────────────────────────────────────── Sibling to .ts-masonry — different mechanics, different use case. .ts-masonry  → flex + clamp,  responsive auto-layout for cards .ts-gallery  → float + %s,    authored asymmetric layout for images Architecture: Design Tokens 2.0 three-tier Tier 1 PRIMITIVE   (--ts-bg-N, --ts-sp-N, --ts-radius-*)  — :root only Tier 2 SYSTEM      (--ts-this-bg, --ts-this-bg-border, …)  — set by component Tier 3 COMPONENT   (--ts-gallery-*)                        — references Tier 2 Markup contract (JS-hydrated): <ul class="ts-gallery" data-ts-gallery> <li class="quarter double-height" data-src="…" data-caption="…"></li> <li class="half" data-src="…"></li> </ul> Sizes:  full · two-third · half · third · quarter Mods:   double-height · float-right · responsive-half ════════════════════════════════════════════════════════════════════════ */`
  - L28: `/* ─── §1  COMPONENT TOKENS (Tier 3 → Tier 2 only) ─────────────────────── */`
  - L31: `/* Set the surface this component sits on → Tier 2 derivatives compute */`
  - L34: `/* Layout base — derivative chain: change --ts-gallery-row-h, everything scales */`
  - L40: `/* Surfaces — every value routes through Tier 2 */`
  - L49: `/* Motion — references global timing tokens */`
  - L55: `/* Focus ring — derives from accent */`
  - L60: `/* ─── §2  CONTAINER ───────────────────────────────────────────────────── */`
  - L83: `/* ─── §3  ITEMS ───────────────────────────────────────────────────────── */`
  - L92: `/* default: half */`
  - L108: `/* Apply gap as inset padding-style border (avoids margin-collapsing on floats) */`
  - L114: `/* the "gap" is transparent border */`
  - L118: `/* Keyboard focus — accent ring through the transparent border */`
  - L126: `/* ─── §4  SIZE MODIFIERS ──────────────────────────────────────────────── */`
  - L164: `/* ─── §5  MEDIA LAYER (the actual image) ──────────────────────────────── */`
  - L181: `/* Pre-load state — skeleton shimmer (reuses existing --ts-skeleton primitive) */`
  - L189–190: `/* Shimmer steps route through Tier 2 (--ts-this-bg derivatives), so the shimmer auto-adapts to whatever surface the gallery sits on. */`
  - L216: `/* Hidden <img> kept in DOM for SEO / a11y — never visible */`
  - L230: `/* ─── §6  HOVER + CAPTION OVERLAY ─────────────────────────────────────── */`
  - L273: `/* ─── §7  VARIANT — UNIFORM GRID (square tiles, equal sizes) ──────────── */`
  - L286: `/* kill inline-block whitespace */`
  - L291: `/* restore */`
  - L295–296: `/* ─── §8  VARIANT — SORTABLE (flex-based for FLIP support) ────────────── */ /*  Use --uniform for best sortable UX; float layouts don't reorder smoothly. */`
  - L314–319: `/* ─── §9  RESPONSIVE — container queries first, viewport fallback ─────── */ /* Container queries let the gallery respond to its own width, not the viewport — so a sidebar gallery and a full-width gallery rebreak independently. Viewport @media is fallback for older browsers. */`
  - L351: `/* Viewport fallback for browsers without container query support */`
  - L378–382: `/* ─── §10  LIGHTBOX  ·  .ts-gallery-lightbox ──────────────────────────── */ /* Namespaced .ts-gallery-lightbox so it does NOT collide with #ts-lightbox (the Three.js phantom-gallery lightbox). Token-styled, generic. */`
  - L513: `/* Body lock when lightbox open — prevents scroll bleed */`
  - L518: `/* ─── §11  REDUCED MOTION ─────────────────────────────────────────────── */`
- **Refactor flags:**
  - **L32 + L73 `--ts-this-bg: var(--ts-bg-1)`** + L385 `--ts-this-bg: var(--ts-bg-0)` — seeds from legacy primitives. Even the exemplary tier-architecture file uses `--ts-bg-N` as the seed because surfaces.css doesn't yet expose a surface-typed entry token. Rule 15 violation — but the violation is unavoidable today; the rebuild's surfaces.css must expose a token like `--ts-surface-base` so this seeds correctly.
  - **L73 `!important` on `--ts-this-bg`** — fights with L32 declaration (literally the same property in the same selector, just `!important` later). Dead-pattern.
  - **L77–80 `!important` on `::after` clearfix** — for content/display/clear. Modest, but flag.
  - **Container query support is excellent** — but the `@supports not (container-type: inline-size)` fallback duplicates the `@container` rules. Two truth-sources.
  - **`backdrop-filter: blur(14px) saturate(1.1)`** on lightbox (L395–396) and `blur(6px)` on buttons (L464, L508) — no solid fallback. Should use `@refactor:backdrop-critical` tag pattern from `ta-ui-table-component.css`.
  - **Hardcoded `400px 100%` background-size** in shimmer (L197) and `1.4s ease-in-out infinite` animation duration — should tokenize.
  - **`max-height: calc(100vh - 8rem)`** on lightbox img (L422) — hardcoded `8rem`.
  - **Reduced motion correctly preserved** (L520–537) — explicitly disables transitions but NOT layout. This is the right pattern. Compare to `effects-layers-special-sections-css.css` which commented out reduced-motion entirely.
- **Session 3/4 relationship:** This file IS the visual exemplar for the rebuild's component spec. The L4–24 architecture comment should be lifted verbatim into the design-tokens-2.0 skill as the "canonical example of three-tier execution". The `--ts-this-bg-border`, `--ts-this-bg-bright`, `--ts-this-bg-hover` references (L42, L43, L194, L457, L469) confirm the surfaces.css derivative chain has been adopted by at least one component family — verify those derivatives all exist in the new system. The L189–190 comment "shimmer auto-adapts to whatever surface the gallery sits on" is the design promise the surface engine must keep.
- **Gap vs `_code-audit-catalog.md`:** (a) `.ts-gallery*` and `.ts-gallery-lightbox*` are in catalog §4.10. `@keyframes ts-gallery-shimmer` is in §4.8. (b) NEW: the full tier-architecture comment (L4–24) is the most important design intelligence in this entire chunk and is NOT in the catalog. The `@container ts-gallery` container-query usage is undocumented — this is the FIRST component to use container queries in this chunk and sets a precedent. The lightbox-namespace separation from `#ts-lightbox` (Three.js) at L378–382 is critical to avoid collision and isn't catalogued. (c) Contradictions: catalog Section 1i mentions `--ts-skeleton` exists but this file says "reuses existing --ts-skeleton primitive" (L181 comment) yet then defines its own `ts-gallery-shimmer` keyframes — the actual integration is not "reuses" but "reimplements with `--ts-this-bg` derivatives". Comment is misleading.

---

### toast+ts-ui-toast-component.css

- **Path:** `docs/references/toolskin.css_extracted-core-blocks-to-refactor/components/toast+ts-ui-toast-component.css`
- **Lines:** 492  ·  **Bytes:** 16,735
- **Block type:** Dual-implementation file. Top half (L1–80) is the legacy `.ts-toast` from §6o; bottom half (L93–end) is the current `.ts-ui-toast` system. Owner explicitly flags at L87 that the legacy block is kept "as utilkkitary only" and the new system is "the real toast in use".
- **Key `--ts-*` tokens declared (in `:root .ts-ui-toast-display, :root .ts-ui-toast-stack` scope, L101–147):**
  - **Borders/surfaces:** `--ts-toast-border: var(--ts-this-bg-border)` (L105), `--ts-toast-bg: color-mix(in srgb, var(--ts-this-bg), var(--ts-on-surface-dim) var(--ts-this-bg-mix))` (L107) using two mix-percentage tokens `--ts-this-bg-mix: 2%` (L108) and `--ts-this-border-mix: 20%` (L109)
  - `--ts-toast-blur: 4px`, `--ts-toast-shadow: var(--ts-shadow-1)`
  - **`--ts-this-bg` declared twice** (L112: `var(--ts-bg-0-t)` legacy, L113: `var(--ts-bg-0)` legacy — second wins, both Rule 15)
  - **Type system:** `--ts-toast-fs: var(--ts-fs-xs)`, `--ts-toast-title-fs: calc(*1.1)`, two `--ts-toast-icon-fs` declarations (L118 `var(--ts-fs-md)`, L119 `calc(*1.01)` — second wins), `--ts-toast-icon-size-2: calc(*1.5)`, `--ts-toast-icon-size: calc(*1.75)`
  - **Text/color:** `--ts-toast-text/-2/-3`, `--ts-toast-accent: var(--ts-accent)` (L128 root + L232 re-declared inside `.ts-ui-toast`)
  - **Geometry:** `--ts-toast-rad: var(--ts-card-radius)`, padding family (`--ts-toast-pad-y/x/pad`), two `--ts-toast-gap` declarations (L134 `var(--ts-sp-3)`, L136 `calc(--ts-toast-pad-y * .5)` — second wins)
  - **Animation:** `--ts-toast-anim: ts-ui-toast-in 0.35s var(--ts-ease-out) both`, `--ts-toast-offset-pos: var(--ts-sp-5)`, `--ts-toast-duration: 4s` (with L141–142 comment marking it as the runtime source of truth read by JS via `getComputedStyle`)
  - **Width/track:** `--ts-toast-min-w: clamp(220px, 50vw, 18rem)`, `--ts-toast-max-w: min(...)`, `--ts-toast-track-h: 7px`, `--ts-toast-track-bg: linear-gradient(90deg, var(--ts-toast-accent), color-mix(var(--ts-toast-accent), #fff 10%), var(--ts-toast-accent))` (Rule 15 — `#fff` literal)
  - **Inside `.ts-ui-toast`** (L232): `--ts-toast-accent: var(--ts-accent)` re-declared.
  - **Inside `.ts-ui-toast.default .ts-ui-toast__track`** (L338): `--ts-toast-current-accent: var(--ts-accent)` — the runtime "currently animated color" token.
  - **In nested ruleset L441–476:** the inversion magic: `--ts-toast-accent: var(--ts-toast-current-accent)` (L447), `--ts-toast-current-accent: currentcolor` (L448) — this is the "currentColor trick" that makes background-image gradients animate by routing through `color` + `currentColor`. See owner note L435–440.
- **Key `--ts-*` tokens referenced (selected):** `--ts-this-bg`/`-border`, `--ts-on-surface-dim`, `--ts-bg-0`/`-0-t` (legacy), `--ts-fs-xs/md/sm`, `--ts-text-primary/secondary/secondary-dim-2`, `--ts-accent`/`-alt`, `--ts-success`/`-warning`/`-danger`, `--ts-shadow-1/3`, `--ts-card-radius`, `--ts-sp-2/3/5`, `--ts-ease-out`/`-in-slow`, `--ts-dur-med`/`-slow`, `--ts-z-toast`, `--ts-border-1`, `--ts-bg-2-t`/`-3`, `--ts-radius-md/full`, `--ts-index-bar-height`, `--ts-icon-pulse`
- **Key classes:** `.ts-toast-container`, `.ts-toast` (+ variants `--success/-warning/-error/-info` and children `__icon/__body/__title/__msg`) — LEGACY block. Then `.ts-ui-toast-stack`, `.ts-ui-toast-display`, `.ts-ui-toast` (+ `--in/-out/.default/-success/-warning/-error/-info`), `.ts-ui-toast__row` (+ `:has(.ts-ui-toast__icon)`), `.ts-ui-toast__title/__msg/__close/__close:hover/__body/__icon` (+ `:after` for vertical separator), `.ts-ui-toast__track` (`.default` and `:not(.default)` branches), `.ts-ui-toast__track--animate`, `.ts-ui-toast-display .ts-ui-toast__track--animate` (paused-until-hover demo variant)
- **Keyframes:** `ts-toast-in` (L32–42, for legacy `.ts-toast`), `ts-ui-toast-in` (L156–166), `ts-ui-toast-out` (L170–175), `ts-ui-toast-load` (L479–491, the track-fill animation).
- **Owner annotations VERBATIM:**
  - L1: `/* ─── §6o  TOAST NOTIFICATIONS ──────────────────────────────────────── */`
  - L8: `/* Offset when offcanvas panel is open */`
  - L87: `/* fro here  is placed the actual toast used on the final version of  the topolskion showcase, the previous code was the old versin of toast and is kept as utilkkitary only  this si the real toast in use */`
  - L93: `/* ── Toast (enhanced) ──────────────────────────────────────────── */`
  - L96–100: `/* #CRAZY_FIX_RULES REFACTOR NOTES AND MUST FIX: - the toast needs  colnfirmation buttons and be sitewide auto-implemented  when toolskin is enabled . no need to set it on a mnanula cvall. thos shopuld replace with js the default alerts and confirmations with itneractiver themed elements. 1- The toast is now set as a one-style   persistent design i improived.  the covnersdion on light asnd dark mode was problematic on legibility.  biut its really   patched.  we need a more consistewnt and  páttern general based designable  implementation wirh the glassy mode,  and other positioning settupts with classesd.  and now the progressbar animation stiopped working.  also, the class with the alert adn error and info mdoes should apply ther accent color to the gradient on the  progressbar tyo make it more coherent.  and also, on the sidebar when the toast are bieng called, the layout is noit the same as it should be, the  ui of the toast lacks title and it looks broken. pleAS EIMPLEMENT IT SOLIDLY. 2- her ei tokenized all the parameters i could to get the bets design posible on this componenty  mnake this same process sive been doing on all the components following the sdame pattern */`
  - L106 (commented-out): `/* --ts-toast-border: color-mix(in srgb, var(--ts-this-bg-border-0), var(--ts-on-surface-dim) var(--ts-this-border-mix)); */`
  - L115, L117, L120: `/* Font side for msg (base font size)*/`, `/* Font side for title (slightly bigger)*/`, `/* Font side for icon (slightly bigger but can be the same)*/`
  - L123: `/* Dimensions of the icon  for width and size and paddign scaling props */`
  - L130 (commented-out): `/*--ts-toast-pad: var(--ts-sp-6);*/`
  - L141–142: `/* Source of truth for auto-dismiss + progress-bar runtime. Override via :root, .ts-ui-toast-stack, or inline --ts-toast-duration on the toast element. JS reads this via getComputedStyle at dispatch. */`
  - L194–209 (commented-out): the entire `.ts-ui-toast-display { position:fixed; … }` block AND a `body:has(.ts-oce-panel.ts-oce--open) .ts-ui-toast-display` offset rule
  - L227–230: `/* @refactor:backdrop-critical */ /* @refactor:glass-dependent */ /* @refactor:needs-solid-fallback */ /* @refactor:token-dependency */` — same structured tag system as the table file
  - L234: `/* CRITICAL REFACTORING: THIS IS THE MAIN NAVIGATION.  rgeardless the glass enabling the component like this both should share thew ame seting and both   should have its owntoggling  backdrop glass  setup with the  opacity glass backdrop effects pairing.  fallback is plain surface backgroun dwith no alpha. currently it has legibility issues ecause of  the alpha but backdrop works good. it snot customizable */`
  - L241: `/* #CRAZY_FIX_RULES: juts fixed the reveal in and out animation, but is precarious... needs better suppoort.  */`
  - L263–264: `/* #CRAZY_FIX_RULES: !!!STILL PENDING ONREFACTOR. ISSUE: the component itself  needs support for button rows and actions.  using the same button component, not custom ones. so inside .ts-ui-toast__body  append and create a conditional block  that holds  as a row flex two buttons  t-btn--sm or ts-btn--xs(create it if it doenst exists, is ust scaling down). two buttons available, one primary other outline. no icons. for confirm actions.  the flexbox ro must be wrap, so the buttons  collapses if responsive requires on component container width. or button text size width length. te actions should be  submittable and effective like the confirm system defaut  andnon UI breaking. the toasts should replace alerts with a gplobal function and this other replacement should be used on  speciic cases to replace the confirm to avoid using the default system notification   warn with buttons.*/`
  - L327–328: `/* #CRAZY_FIX_RULES:  OWNER FIX UPDATE: the track bar animatin now works fluently, and also has a color system functional wit transitions on gradients.  */`
  - L355–356, L359, L372, L384, L391: comments explaining the track architecture
  - L413–414: `/* #CRAZY_FIX_RULES */ /* this was the only way i could find to make a vertical separator minimal style to  design the toast. without breaking it. is a    subtile  vertical line with opacoty thats eparates the  icon from the  msg content. the problem is that i had to make a lot of calc  styles to  achieve the resutl  and thats not ideal. the toast needs to be reimplemented with a proper ui layout row and columns and better flexible design pattern  to hold many differetn  layout and designs using toolskin design system.  and be able to gold a row of buttons. is impossible to debugf or desighn this asset becaseiuye it dismisses and removes form the dom. i have almost no mock to use.  */`
  - L435–440 (the currentColor trick documentation): `/* OWNER FIXES: i managed to make possible the animation work and also assign dynamic  coloring to the gradient of the progressbar usign the color properlty and 2 sub delegation tokens for the object states. this is the only wy to animate background image based gradients... this is certaintly a discovery to add to the records... until now background images werree not animatable. adn nw using the color properlty and the accent token subtokenized, the background gradient aimates perfectly on hover or animation states. in th trac element, the --ts-toast-accent uses a  partial mid value for the variants of toast to hold the currentcolor value from each variant instead o f using direct tokens, as the tokens are not animatable. and currenColor and color properties are. --ts-toast-accent: var(--ts-toast-current-accent); --ts-toast-current-accent: currentcolor; */`
- **Refactor flags:**
  - **Legacy `.ts-toast` block (L1–80)** — owner says it's kept as utility only but it's still parsed and the rules still apply to anything with class `.ts-toast`. Decide: delete or namespace as `.ts-toast--legacy`.
  - **Legacy primitive `--ts-bg-3/-0/-0-t/-2-t`** consumed at L21, L112, L113, L306 — Rule 15.
  - **Hardcoded `#fff`** in `--ts-toast-track-bg` linear-gradient (L146) — Rule 15.
  - **`#CRAZY_FIX_RULES` marker** 4× (L96, L241, L263, L413) — high refactor count.
  - **CSS Property animation via `allow-discrete`** (L350–352, L379–381) is bleeding-edge — `--ts-toast-accent`, `--ts-toast-current-accent`, `--ts-accent` declared as animatable via `transition-property` with `allow-discrete`. Requires `@property` registration to actually interpolate; without it, just swaps at the midpoint. Not registered here — bug.
  - **`backdrop-filter: blur(4px) saturate(3.5)`** (L226) — `@refactor:backdrop-critical` tag at L227–230 acknowledges. `saturate(3.5)` is unusually aggressive.
  - **The currentColor trick (L435–440 + L447–448)** is brilliant and worth documenting as a permanent pattern in the design-tokens-2.0 skill. The lesson: tokens are not animatable, but `color` and `currentColor` are; route gradient color stops through `currentColor` to animate them. Encode as a "Toolskin animatable-gradient pattern".
  - **CSS Nesting at L441–476** — modern. The 4-variant color routing (default/success/warning/error/info → accent/success/warning/danger/accent-alt) is clean.
  - **`background-color: var(--ts-this-bg-border)`** on `.ts-ui-toast__track` (L336, L364) — using border token as background. Semantic mismatch.
  - **`z-index: -1` on `.ts-ui-toast__icon:after`** (L424, L431) — relies on the toast itself having `isolation` or a stacking context; otherwise the separator line will go behind the toast itself.
- **Session 3/4 relationship:** Heavy consumer of `--ts-this-bg`/`-border` derivatives — good. The `--ts-this-bg-mix` and `--ts-this-border-mix` percentage tokens (L108–109) introduce a NEW pattern: "amount of on-surface-dim to mix into the surface for a soft tint". Could be lifted into the surface engine as standard derivative knobs. The currentColor trick is THE most reusable piece of architectural intelligence in this file.
- **Gap vs `_code-audit-catalog.md`:** (a) `.ts-toast*`, `.ts-ui-toast*` and `@keyframes ts-ui-toast-in/out/load` are in catalog §4.10 and §4.8. (b) NEW: The currentColor animatable-gradient discovery (L435–440) is a permanent architectural lesson NOT in the catalog and MUST be lifted. The four-tag `@refactor:` system (L227–230) reappears here, confirming it's an emerging convention. The dual-implementation pattern (legacy + new in one file) is undocumented; catalog should flag all such dual-block files. (c) No direct contradictions.

---

### ui-kit-spinner+sortable+draggable+enhancednumberinput.css

- **Path:** `docs/references/toolskin.css_extracted-core-blocks-to-refactor/components/ui-kit-spinner+sortable+draggable+enhancednumberinput.css`
- **Lines:** 517  ·  **Bytes:** 16,825
- **Block type:** Four-in-one multi-component blob: `.ts-ui-spinner` (numeric input + chevron controls), `.ts-ui-draggable--dragging` + `.ts-ui-resizable` (drag/resize utilities), `.ts-ui-sortable` (FLIP-ready drag-to-reorder list — the bulk of the file), `.ts-ui-number-input-wrapper` (duplicate spinner system).
- **Key `--ts-*` tokens declared:**
  - **`:root` block (L105–133)** for sortable:
    - **Core dimensions:** `--ts-ui-sortable-item-h: 50px`, `-item-pad-x: calc(*.5)`, `-item-pad-y: calc(pad-x *.78)`, `-item-pad`, `-item-gap: calc(pad-y *.54)`, `-item-rad: var(--ts-input-radius)`, `-item-spacing: calc(gap *.7)`
    - **Type:** `--ts-ui-sortable-item-fs: calc(item-h * .24444)`
    - **Handle:** `--ts-ui-sortable-handle-icon: calc(item-fs * 1.4)`, `-border: var(--ts-this-bg-border)`, `-border-active: var(--ts-this-bg-focus-outline)`, `--ts-this-bg-border-hover: var(--ts-ui-sortable-border-active)` (re-assigns a system-tier token from inside a component scope — flag), `-bg-hover: var(--ts-bg-4)` (Rule 15)
    - **Handle bg:** `--ts-ui-sortable-handle-bg: var(--ts-bg-3)` (Rule 15), `-card-bg: var(--ts-bg-2)` (Rule 15)
    - **Displacement:** `--ts-ui-sortable-displace-duration: 200ms`, `-displace-ease: cubic-bezier(0.2, 0, 0, 1)` (hardcoded bezier — should reference `--ts-ease-*`)
  - **Inside `.ts-ui-sortable__item`** (L162–164): `--ts-input-h: 50px !important`, `--ts-input-pad-x: var(--ts-ui-sortable-item-pad) !important`, `--ts-this-bg: var(--ts-ui-sortable-handle-bg)` — surface override.
  - **Inside `.ts-ui-sortable__ghost`** (L325–330): `--ts-ui-sortable-item-h: 58px` (overrides root), `--ts-ui-sortable-title-icon`, `-title-icon-hov`, `--ts-this-bg: var(--ts-ui-sortable-card-bg)` — surface override on the ghost element.
- **Key `--ts-*` tokens referenced:** `--ts-radius-md`, `--ts-border-1`, `--ts-bg-1/-2/-3/-4` (legacy), `--ts-text-primary/secondary/muted`, `--ts-fs-sm`, `--ts-dur-fast`, `--ts-shadow-1/3`, `--ts-this-bg/-border/-border-hover/-focus-outline/-dim/-dim-2/-dim-3/-dim-4/-grad`, `--ts-accent/-bright/-bright-2/-border/-dim/-dim-3`, `--ts-on-accent`, `--ts-input-radius/-gap`, `--ts-ease-out`
- **Key classes:** `.ts-ui-spinner` (+ `input[type='number']`, `::-webkit-outer-spin-button`, `::-webkit-inner-spin-button`, `__controls/__dec/__inc`, `__dec+__inc/__inc+__dec`), `.ts-ui-draggable--dragging`, `.ts-ui-resizable` (+ `__handle/:hover`), `.ts-ui-sortable` + `__item` (idle/hover/active/dragging/source/ghost/placeholder) + `--sorting` state class + `[data-ts-ui-sort-handle-only]` mode + `__handle` + `__title` + `__placeholder`, `.ts-ui-number-input-wrapper` (+ input + spin-buttons + controls + `__btn`)
- **Keyframes:** none.
- **Owner annotations VERBATIM:**
  - L2: `/* ── Spinner (input + stacked chevrons on the right, YSS-style) ─── */`
  - L69: `/* ── Draggable / Resizable ───────────────────────────────────────── */`
  - L99: `/* ── Sortable ───────── */`
  - L101–103: `/* ── Tokens ── Naming: --ts-ui-sortable-{part}-{property} Parts: item, handle, title, drag, placeholder */`
  - L107: `/* ─ Core dimensions ─ */`
  - L116: `/* ─ Typography ─ */`
  - L119: `/* ─ Handle ─ */`
  - L129: `/* ─ Displacement animation ─ */`
  - L135: `/* ── List reset ── */`
  - L144–146: `/* ── Sortable Item ── States: idle → hover → active (mousedown) → dragging (in flight) Uses --ts-this-bg cascade for theme-adaptive backgrounds. */`
  - L171: `/* ─ First child: kill top margin to prevent gap doubling ─ */`
  - L177–179: `/* ─ Displacement transition on siblings while sorting is active ─ JS adds .ts-ui-sortable--sorting to the container on pointerdown. transform is the primary FLIP vehicle (GPU-composited, no reflow). */`
  - L188: `/* Hover: brighten + subtle border highlight */`
  - L198: `/* Active (mousedown): accent border flash — signals "I'm grabbed" */`
  - L208: `/* ── Handle-only mode ── */`
  - L230: `/* ── Handle (shared base) ── */`
  - L257: `/* Handle hover: accent tint signals "drag from here" */`
  - L276: `/* ── Dragging state: visual lift ── */`
  - L296: `/* Source: fully collapsed via CSS — JS no longer needs inline style overrides */`
  - L312: `/* Ghost clone: visual lift with accent glow */`
  - L334: `/* Drop target placeholder: dashed accent outline */`
  - L350: `/* ── Title strip ── */`
  - L456: `/* ── Number input auto-wrap (chevrons) ─────────────────────────── */`
- **Refactor flags:**
  - **Two parallel spinner implementations** — `.ts-ui-spinner` (L3–67) and `.ts-ui-number-input-wrapper` (L457–517) are functionally identical (numeric input + stacked +/- chevrons). Pick one and delete the other.
  - **Heavy `!important`** on sortable item — L149–161 has 8 `!important`s, hover/active states add more. The `--ts-input-h: 50px !important` (L162) is particularly aggressive because it changes a SYSTEM-tier token from inside a component, fighting against any sibling input.
  - **Legacy primitives** `--ts-bg-1/-2/-3/-4` consumed at L12, L50, L61, L124, L126, L127, L194, L467, L503, L512 — multiple Rule 15 violations.
  - **Local `--ts-this-bg-border-hover` reassignment** (L123, L191, L263, L416) — a component declares ITS handle border as `--ts-this-bg-border-hover` AND reassigns the system token to its own value. Breaks the system contract: any other consumer of `--ts-this-bg-border-hover` within the sortable scope gets the sortable's value, not the surface's.
  - **`transform: scale(1.02), translateZ(0)`** at L290 — **INVALID syntax**: comma inside `transform` is wrong; should be space-separated. Currently the entire transform is silently invalid, dragging item won't scale. Bug.
  - **`--ts-ui-sortable-displace-ease: cubic-bezier(0.2, 0, 0, 1)`** (L131) — hardcoded bezier; should reference `--ts-ease-snap` or similar.
  - **`--ts-ui-sortable-item-fs: calc(... * .24444)`** (L117) — magic number `.24444`; almost certainly a "ratio that worked" without rationale. Should document or tokenize.
  - **`flex: 0 1` (no third arg)** at L364 — defaults to `flex-basis: 0%`. Probably fine but worth verifying intent.
  - **`backdrop-filter` not present** here (unlike toast/table) but `box-shadow: 0 0 24px color-mix(...)` glow patterns at L289, L316, L398, L407 are heavy.
- **Session 3/4 relationship:** Consumes `--ts-this-bg` derivatives correctly (L155, L158, L190, L194, L200, L222) BUT seeds the chain from legacy `--ts-bg-N` (L124, L126, L127). The handle-bg overrides via `--ts-ui-sortable-handle-bg`/`-card-bg` reflect a pattern: declare a component-tier surface token that maps to a legacy primitive today, then swap that mapping when surfaces.css matures. Useful pattern; document as "indirection layer for legacy migration".
- **Gap vs `_code-audit-catalog.md`:** (a) `.ts-ui-sortable*`, `.ts-ui-spinner*`, `.ts-ui-number-input*` families are in catalog §4.10. (b) NEW: the invalid `transform: scale(1.02), translateZ(0)` syntax at L290 is a real bug. The dual spinner implementation is undocumented. The `--ts-this-bg-border-hover` reassignment from component scope is an architecture violation pattern that may exist in other files. (c) No direct contradictions.

---

### ts-ui-accordion-component.css

- **Path:** `docs/references/toolskin.css_extracted-core-blocks-to-refactor/components/ts-ui-accordion-component.css`
- **Lines:** 449  ·  **Bytes:** 17,141
- **Block type:** Leaf component — `.ts-ui-accordion` (+ `.ts-accordion` alias) with variants `--separated`, `--dual-icon`, `--toggle-plus` and a comprehensive token system for header/panel/toggle/indicator/icon dimensions and colors. Uses `:has()`, `[aria-expanded]`, modern `allow-discrete` transitions for entrance/exit animation.
- **Key `--ts-*` tokens declared:**
  - **`:root` block (L15–23)** — for ts-ui-control (checkbox/radio defaults):
    - `--ts-ui-control-size: 1.125rem`, `-mark-inset: 22%`, `-checkbox-mark: polygon(...)` (SVG-like polygon for the check), `-mark-size: 0.5rem`, `-mark-color: var(--ts-accent)`, `-mark-bg: var(--ts-accent-dim)`
  - **Inside `.ts-ui-accordion, .ts-ui-accordion--separated, .ts-ui-accordion--dual-icon, .ts-accordion`** (L29–83) — massive token kit (~40 tokens):
    - **Header dimensions:** `--ts-ui-accordion-header-min-h` declared TWICE (L30: `var(--ts-input-h)`, L31: `50px` — second wins; hardcoded), `-pad-y: calc(pad-x*.78)`, `-pad-x: calc(min-h*.5)`, `-pad`, `-gap`, `-fs: calc(panel-fs*1.1)`
    - **Header colors:** `-bg: var(--ts-this-bg-dim)`, `-bg-hover: var(--ts-this-bg-dark-1)`, `-bg-active: var(--ts-this-bg-dark)` then immediately reassigned to `var(--ts-ui-accordion-header-bg-hover)` (L41 — overrides L39 dead).
    - **Header text:** `-color: var(--ts-text-secondary)`, `-color-hover: var(--ts-text-primary)`
    - **Panel:** `-panel-pad: var(--ts-ui-accordion-header-pad-x)`, two `--ts-ui-accordion-panel-fs` declarations (L45 derived from min-h, L46 `var(--ts-fs-body-sm)` — second wins), two `-panel-lh` declarations (L48 `1.45`, L49 derived from fs — second wins), `-panel-color: var(--ts-text-primary-dim-2)`, two `-gap` declarations (L51 `var(--ts-sp-2)`, L52 derived — second wins), `-panel-bg: var(--ts-this-bg)`
    - **Toggle indicator (plus/minus button):** `-toggle-color/-color-hover/-bg/-bg-hover`, two `-toggle-border` declarations (L58: `var(--ts-this-bg-border)`, L59: `var(--ts-border-2)` — second wins, Rule 15), `-toggle-rad: var(--ts-radius-md)`, `-toggle-pad: 1px`, `-toggle-stroke: 1px`, `-toggle-stroke-l: 1rem`, `-toggle-btn-h: 1.25rem`
    - **Chevron:** `--ts-accordion-toggle-chevron-size` declared THREE TIMES (L62: `0.5rem`, L63: calc derived from min-h, L64: calc derived from icon-size — third wins; the only one that's tier-architected)
    - **Arrow:** `-arrow-color: var(--ts-ui-accordion-panel-color)`, `-arrow-color-hover: var(--ts-accent)`, `-arrow-w: var(--ts-ui-accordion-toggle-stroke)`
    - **Icon:** `-icon-base: var(--ts-ui-accordion-header-fs)`, `-icon-grow: 1.1`, `-icon-size: calc(base*grow)`
    - **Chevron offsets:** `-chevron-offset/-offset-2` (calc derived)
    - **Category (dual-icon) variant:** `-category-icon-size`, `-category-gap`
    - **Surface seed:** `--ts-this-bg: var(--ts-bg-2-t)` (L81 — Rule 15)
  - **Inside `.ts-ui-accordion--dual-icon`** (L212–215): `-category-sep-width/-height/-header-radius`.
  - **Inside `.ts-ui-accordion__indicator`** (L329–330): `--ts-ui-accordion-toggle-bg: transparent`, `-toggle-bg-hover: transparent` — local override.
- **Key `--ts-*` tokens referenced:** `--ts-input-h`, `--ts-this-bg`/`-dim`/`-dark`/`-dark-1`/`-border`, `--ts-text-secondary/-primary/-primary-dim-2/-muted`, `--ts-fs-body-sm`, `--ts-sp-2`, `--ts-bg-2-t` (legacy), `--ts-border-2`, `--ts-radius-md`, `--ts-accent`, `--ts-accent-dim`, `--ts-dur-base/-slow/-slower/-fast`, `--ts-ease-out`, `--ts-panel-ease-in/-out`
- **Key classes:** `.ts-ui-accordion`/`.ts-accordion` (+ `--separated`/`--dual-icon`/`--toggle-plus` variants), `__item`, `__header` (+ `[aria-expanded="true"]`, `:hover`, `--active`, `:not(:has(__category-icon))`), `__header-main`, `__icon`, `__category-icon` (dual-icon only), `__category-sep`, `__header::after` (chevron) / `__indicator` (plus/minus, with `::before`/`::after` for the cross-bars), `__panel` (+ `[hidden]`), `__panel *` (revert-layer trick at L424–433)
- **Keyframes:** none.
- **Owner annotations VERBATIM:**
  - L2: `/* ═══ MERGED BLOCK: toolskin-uikit.css (source: assets/css/toolskin-uikit.css) ═══ */`
  - L4–12 (PROVENANCE comment): `/*! * Toolskin UI Kit — companion to toolskin-uikit.js * Uses design tokens (--ts-*) from toolskin.css; prefix ts-ui-* (no collisions with core). * Naming: *   - ts-ui-* : UI kit components (accordion, table, masonry, …) *   - ts-*      : Core-friendly aliases for form controls (checkbox/radio/groups) — mirror ts-ui-control-* where noted. * Aliases: .ts-accordion ↓ .ts-ui-accordion; .ts-checkbox/.ts-radio wrappers ↓ .ts-ui-control--checkbox/--radio inputs. * Scrollbar: <html> gets .ts-env-moz in Firefox only; .ts-ui-scrollbar--moz rules apply there so Chromium keeps ::-webkit-scrollbar. */`
  - L14: `/* Defaults so native checkbox/radio inputs keep size even without a wrapper (inherits from :root). */`
  - L25: `/* ── Accordion ─────── */`
  - L107 (commented-out): `/* box-shadow: 0 1px 2px color-mix(in srgb, var(--ts-border-1), transparent 55%); */`
  - L208: `/* Dual icon: category column + separator + header-main (item icon + label) */`
  - L279: `/* Chevron (default): not when using plus/minus indicator */`
  - L307: `/* Plus / minus (CSS lines) */`
- **Refactor flags:**
  - **Multi-declared tokens** (`-header-min-h`, `-panel-fs`, `-panel-lh`, `-gap`, `-toggle-border`, `-chevron-size`) — same "first declaration is intent, second/third is what's actually used" anti-pattern as marquee/tooltips. Each set needs a council pass to pick one.
  - **`.ts-accordion__heade[aria-expanded="true"]`** at L139 — **TYPO**: missing `r` (`__heade` not `__header`). The selector is invalid for the aliased class. Bug.
  - **`backgroun-color`** at L358 — **TYPO** in transition-property list (`backgroun-color` not `background-color`). The transition skips background-color silently.
  - **`color: revert-layer !important`** inside `__panel *` (L427) — uses CSS Cascade Layers feature to revert all panel-child colors. Modern (Chrome 99+, Safari 15.4+). Owner intent: panel content keeps its own colors regardless of accordion theming. Document this as a deliberate escape hatch.
  - **`font-weight: revert-layer !important`** (L429) and `font-size: var(--ts-ui-accordion-panel-fs)` (L428) — interesting mix: font-weight reverts, font-size hard-locks. Inconsistent but intentional.
  - **`overflow: hidden`** with `max-height: 4000px` (L411) for the open panel — magic number 4000px ceiling. Any panel taller than 4000px is silently clipped. Use `max-height: none` or token.
  - **`transition: max-height var(--ts-dur-base) var(--ts-panel-ease-in) allow-discrete, padding-block ... allow-discrete, opacity ... allow-discrete, display ... .12s allow-discrete`** (L405–408) — modern `allow-discrete` for the panel collapse animation. Requires `@property` for max-height/padding-block to actually interpolate; otherwise discrete swap. Not registered — likely jumps, doesn't smooth.
  - **`--ts-this-bg: var(--ts-bg-2-t)`** (L81) — Rule 15.
  - **`border: 1px solid var(--ts-ui-accordion-toggle-border)` declared 2× on `--separated__item`** (once in base L78, once in `.ts-ui-accordion--separated .ts-ui-accordion__item` L104) — fine since the second narrows.
  - **`!important` on hover** (L159–161) and on `position: relative` (L133, L258) and `outline: none` (L135, L260) — pattern: to override third-party reset stylesheets like Normalize. Document.
- **Session 3/4 relationship:** Heavy consumer of `--ts-this-bg-dim`/`-dark`/`-dark-1`/`-border` derivatives — verify ALL of these are exposed by `surfaces.css`. `-dim` and `-dark` aren't standard derivative names (compared to `-dim-N` numbered series). Might be aliases or might be missing. The `revert-layer` pattern at L424–433 is a clever escape hatch worth documenting in the design-tokens-2.0 skill for "components that host arbitrary content".
- **Gap vs `_code-audit-catalog.md`:** (a) `.ts-ui-accordion*` family is in catalog §4.10. (b) NEW: the L139 typo (`__heade`), the L358 typo (`backgroun-color`), the `revert-layer` cascade-layer usage, the unregistered `@property` for `allow-discrete` transitions, and the `4000px` max-height ceiling are all undocumented. The provenance comment (L2 "MERGED BLOCK: toolskin-uikit.css") is useful history. (c) No direct contradictions.

---

### custom-cursor-component.css

- **Path:** `docs/references/toolskin.css_extracted-core-blocks-to-refactor/components/custom-cursor-component.css`
- **Lines:** 392  ·  **Bytes:** 17,285
- **Block type:** Special component with a documented performance contract. Two modes: §11.1 SVG-data-URL crosshair (pure CSS, no DOM, no JS) and §11.2 `.custom-cursor` DOM element followed by JS lerp (CSS owns appearance, JS owns position). Includes inline `@todo` markers for next-pass shape registry (§11.3).
- **Key `--ts-*` tokens declared:**
  - **Inside `.custom-cursor`** (L86–89): `--cursor-offset: 50% + var(--ts-cursor-size)` (note: NO `--ts-` prefix — local), `--cursor-offset-n: calc(--cursor-offset * -1)` (local), `--ts-z-cursor: var(--ts-z-offcanvas-panel)`, `--ts-cursor-transition-dur: .3s`
- **Key `--ts-*` tokens referenced:** `--ts-cursor-color` w/ fallback `var(--ts-accent)` (L96, L168, L214, L233, L251, L272, L280) — primary fill/stroke, `--ts-cursor-size` (L86, L93–94, L100, L166–167, L170, L211–212, L230–231, L322), `--ts-cursor-grow` (L211, L230), `--ts-cursor-arrow-size` (L262–263, L272–273, L280–281), `--ts-cursor-follower-dur` (L189–192), `--ts-z-offcanvas-panel`, `--ts-ease-out`, `--ts-on-accent` (L304), `--ts-on-surface-muted` (L308), `--ts-sp-2/-4` (L309), `--ts-radius-full` (L310), `--ts-accent` (L351 — fallback for the empty-label crosshair bars)
- **Key classes/selectors:** `body.has-ts-cursor` (+ `:where(*)`), `[data-theme="light"] body.has-ts-cursor`, `body.has-ts-cursor a:hover`/`button:hover`/`.ts-btn:hover`/`[role="button"]:hover`/`input:hover`/`select:hover`/`textarea:hover`/`[data-cursor]:hover`, light-theme hover variant, `.custom-cursor` (+ `.cursor--no-follower`/`.cursor--simple`/`.cursor--tooltip` modes), `.custom-cursor.active`, `.custom-cursor::before` (follower), `.custom-cursor::after` (tooltip arrow), `.custom-cursor.cursor--tooltip.active[data-pointer-direction="up"|"down"]`, `.custom-cursor.cursor--tooltip::after`, `.custom-cursor .cursor-inner`, `.custom-cursor .cursor-label` (+ `:empty::before/::after`), `[data-theme="light"] .custom-cursor:not(.active)` (filter:invert).
- **Keyframes:** none.
- **At-rules:** `@starting-style` (L331–334) inside `.custom-cursor.active .cursor-label` — modern view-transitions/discrete-animation initial state declaration. Chrome 117+, Safari 17.4+.
- **Owner annotations VERBATIM:**
  - L2–15 (§11.1 + multiple `@todo` markers): `/* ─── §11.1  SVG Crosshair Cursor (native, adaptive color) ──────────── Lightweight 1px "+" cursor. No element, no JS, just a `cursor:` URL. Filled rects (not strokes) avoid AA halos at sub-pixel positions. Idle 21×21, hover 31×31 with accent. @todo @cursor-tag:hairline-only — when standalone hairline mode lands, body.has-ts-cursor.cursor--hairline-only should suppress .custom-cursor rendering entirely and rely solely on §11.1. @todo @cursor-tag:tokenize-controls — colors and sizes are inlined in the data-URL strings. Lift into tokens once we figure out a reasonable encoding (CSS doesn't allow var() inside data URLs; options: build the SVG via JS once, or ship size/color presets via class modifiers like .cursor--size-sm / .cursor--accent-warn). ──────────────────────────────────────────────────────────────────── */`
  - L17–19: `/* Default crosshair — 21×21 :where(*) ensures children inherit the crosshair even when they have cursor:pointer — zero specificity so hover accent rules still override. */`
  - L26: `/* Light theme — dark crosshair 21×21 */`
  - L33: `/* Hover: accent crosshair — 31×31 (physically larger lines) */`
  - L46–47: `/* Light theme hover: accent crosshair — 31×31 Same accent as dark; orange reads on both backgrounds. */`
  - L61–81 (§11.2 PERFORMANCE CONTRACT — critical engineering doc): `/* ═══════════════════════════════════════════════════════════════════════ §11.2  CUSTOM CURSOR ELEMENT ─────────────────────────────────────────────────────────────────────── A real DOM element follows the pointer. JS owns position (lerp on rAF); CSS owns appearance, hover state, and the discrete transitions on properties that change rarely (size, opacity, color). PERFORMANCE CONTRACT (do not violate):   • CSS NEVER transitions `transform` or `translate` on this element. Position is driven by JS at 60Hz; layering a CSS transition on top creates a feedback loop that never settles.   • JS lerp must stop its rAF when the cursor settles within ~0.1px of the target. Idle cursor = zero per-frame work.   • `will-change: transform` reserves a GPU layer to keep paints off the main thread. Applied once on parent, NOT also on ::before.   • `contain: layout paint` isolates this element's repaints from the document — cheap and high-leverage. @todo @cursor-tag:perf-audit — verify in DevTools Performance panel that idle cursor produces 0 paints/frame and 0 rAF callbacks. ═══════════════════════════════════════════════════════════════════════ */`
  - L83: `/* ─── Base cursor (shared by SIMPLE + TOOLTIP modes) ────────────────── */`
  - L85 (commented-out): `/* --follower-transform: translate3d(0px, 0px, 0); */`
  - L104–105: `/* @perf — JS writes `transform` every frame. Do NOT put `transform` in the transition list below. */`
  - L110–113: `/* @perf-history: mix-blend-mode: difference removed — extremely expensive GPU compositing every frame. Opacity-based contrast via filter:invert in light mode is also costly (see @todo below) but only applies in idle state. */`
  - L114 (commented-out): `/* mix-blend-mode: difference; */`
  - L116–117: `/* Only properties that change rarely (hover state in/out, theme swap) belong in this transition list. Transform/translate are JS-owned. */`
  - L124–125: `/* @perf — paint isolation. The cursor's repaints don't invalidate the document below it. */`
  - L130–131: `/* @todo @cursor-tag:isolation — `isolation: isolate` removed; we already have z-index, the new stacking context was redundant. */`
  - L134–137: `/* @todo @cursor-tag:light-theme-cost — `filter: invert(100%)` triggers a separate composite layer and a paint per state change. Replace with a token swap: define --ts-cursor-color light/dark per theme, delete the filter rules. Same visual, fraction of the cost. */`
  - L157–160: `/* ─── Follower (::before) ────────────────────────────────────────────── Soft-trail dot. Optional; opt out with `.cursor--no-follower`. Position driven by --follower-transform (JS lerp). ──────────────────────────────────────────────────────────────────── */`
  - L173–175: `/* Two translates split across `translate` (centering, static) and `transform` (JS-driven lerp). Cleaner than chaining two translates inside one transform. */`
  - L182–187: `/* @perf — Transform is updated every frame by JS lerp. CSS transitioning it too creates a feedback loop: JS sets new target, CSS interpolates, JS sets newer target before CSS finishes, repeat forever. Easing is JS-side (the lerp factor IS the easing). CSS only transitions the visual properties that change on hover/active state, not per-frame. */`
  - L194–196: `/* @perf — only one will-change layer needed for the cursor. The parent already owns the GPU layer; ::before composites within it. Removed from here. */`
  - L199: `/* No-follower opt-out */`
  - L206–209: `/* ─── §11.2.A  SIMPLE MODE (.cursor--simple) ────────────────────────── Circle at center. Filled idle, outlined on hover. Optional follower. No label, no arrow, no smart positioning. ──────────────────────────────────────────────────────────────────── */`
  - L219: `/* Follower fades out on active in simple mode */`
  - L225–228: `/* ─── §11.2.B  TOOLTIP MODE (.cursor--tooltip) ──────────────────────── Full-featured: label, directional arrow, smart positioning. Follower collapses (width/height 0) on active so the label dominates. ──────────────────────────────────────────────────────────────────── */`
  - L256: `/* ─── §11.2.C  Pointer arrow (::after) — tooltip mode only ──────────── */`
  - L288: `/* ─── §11.2.D  Inner helper element ─────────────────────────────────── */`
  - L302: `/* ─── §11.2.E  Label (tooltip mode only) ────────────────────────────── */`
  - L337: `/* Empty label shows crosshair lines — visual fallback for unlabeled active state */`
  - L356–391 (§11.3 SHAPE REGISTRY — TODO spec for next refactor pass, includes full proposed token surface for cursor): see file for full text — proposes 8 shape modifier classes (`circle/hairline/text/resize-h/-v/-d/grab/grabbing`) and a complete `--ts-cursor-*` token surface (`-size/-grow/-color/-color-light/-transition-dur/-follower-dur/-arrow-size/-hairline-size/-hairline-grow-size/-hairline-stroke/-shape`).
- **Refactor flags:**
  - **Hardcoded rgba colors inside data-URL SVG cursors** (L22, L29, L42, L56) — `rgba(255,255,255,0.85)`, `rgba(0,0,0,0.65)`, `rgba(255,100,50,1)` — Rule 15 violations. Owner explicitly acknowledges at L10–14 that this is the known constraint (CSS doesn't allow `var()` inside data URLs) and proposes either JS-built SVG or class-modifier presets. Best-in-chunk example of a constraint-driven Rule 15 violation with a documented mitigation plan.
  - **`mix-blend-mode: difference`** on `.custom-cursor:not(.active)` (L148) and `::before` (L153) — owner removed from base (L110–113 history note) but kept on the non-active state. Performance cost reduced but still applies during idle. Owner's `@todo @cursor-tag:light-theme-cost` (L134–137) flags the related `filter: invert(100%)` cost. Both should be tokenized away in the cursor refactor.
  - **`--cursor-offset` / `--cursor-offset-n` use non-`--ts-` namespace** (L86–87) — local variables but break the namespace contract. Should be `--ts-cursor-offset`/`-offset-n` or moved into `:root` with `--ts-` prefix.
  - **`--cursor-offset: 50% + var(--ts-cursor-size)`** at L86 — INVALID CSS: `50% + var(...)` outside `calc()` is invalid; CSS parser drops the value. The `--cursor-offset-n: calc(var(--cursor-offset)*-1)` at L87 then computes against an invalid input — undefined behavior. Real bug. Should be `--cursor-offset: calc(50% + var(--ts-cursor-size))`.
  - **`font-size: round(calc(var(--ts-cursor-size) / 2), 10px)`** (L305) — uses `round()` math function (CSS Values 4). Chrome 125+, Safari 18.4+. No fallback.
  - **`@starting-style`** (L331–334) — modern progressive enhancement; degrades to no entrance animation on unsupported browsers. Fine.
  - **`scale: 0` standalone property** (L319, L334) — CSS Transforms Module L2 (not `transform: scale(0)`). Chrome 104+, Safari 14.1+. Fine for 2026.
  - **`transition: opacity 0.5s, scale 0.5s .23s allow-discrete, display 0.5s allow-discrete`** (L321) — uses `allow-discrete` for `display`. Requires `display: none` ↔ `display: flex` swap to actually animate; `@starting-style` companion is at L331–334. Good modern pattern.
  - **The §11.3 TODO at L356–391** is a complete refactor spec — should be lifted into the rebuild's cursor component spec verbatim.
- **Session 3/4 relationship:** Mostly self-contained except for `--ts-accent`/`--ts-on-accent`/`--ts-z-offcanvas-panel`/`--ts-on-surface-muted` consumption. Decoupled from the surface chain (no `--ts-this-bg-*` references). Good architecture — cursor sits ABOVE the surface system. The performance contract (L61–81) and the `@perf` / `@perf-history` annotation conventions are valuable engineering culture artifacts and should be preserved as a permanent reference for how to author GPU-cheap CSS+JS hybrid components.
- **Gap vs `_code-audit-catalog.md`:** (a) `.custom-cursor` is in catalog §4.10. (b) NEW: the entire PERFORMANCE CONTRACT (L61–81), the §11.3 SHAPE REGISTRY spec (L356–391), the `@todo @cursor-tag:*` structured tag system, and the `@perf-history` annotation about removing `mix-blend-mode: difference` are all engineering intelligence that MUST be lifted into a permanent skill or the cursor component spec. The invalid `--cursor-offset` formula at L86 is a real bug. (c) No direct contradictions.

---

## Annotation index

### Section header markers (§ numbering)
- log-component.css:L2 `§6m LOG / TERMINAL BLOCK`; L65 `§6n PROGRESS BAR`
- hero-section.css:L2 `§8a Hero Section`
- toast+ts-ui-toast-component.css:L1 `§6o TOAST NOTIFICATIONS`
- ts-btn-component(basic-ref).css:L2 `§6a BUTTONS`
- ts-gallery-component+lightbox.css: §1 (component tokens) / §2 (container) / §3 (items) / §4 (size modifiers) / §5 (media layer) / §6 (hover + caption) / §7 (uniform variant) / §8 (sortable variant) / §9 (responsive) / §10 (lightbox) / §11 (reduced motion)
- custom-cursor-component.css: §11.1 (SVG crosshair) / §11.2 (cursor element) / §11.2.A (simple mode) / §11.2.B (tooltip mode) / §11.2.C (pointer arrow) / §11.2.D (inner helper) / §11.2.E (label) / §11.3 (shape registry — TODO)

### CRAZY_FIX_RULES markers
- hero-section.css:L57
- header-promobanner.css:L146, L175
- ta-ui-table-component.css:L2
- toast+ts-ui-toast-component.css:L96, L241, L263, L413
- (none in: log, notif-banner, theme-toggle, marquee, tooltips, code-window, btn, gallery, table-other-than-main, spinner-sortable, accordion, cursor)

### CRITICAL / REFACTOR NOTE / OWNER FIX markers (selected)
- marquee-component.css:L21 (OWNER FIXES — pointer-events hack)
- hero-section.css:L38–56 (large REFACTOR NOTES — 5-point hero variant spec)
- ts-ui-select-dropdown-max-height-calc.css:L1–2 (OWNER's FIX + NEW Refactor Note URGENT), L22–23 (NEW REFACTOR NOTE — move dispersed vars)
- header-promobanner.css:L175–203 (Required improvements / Goal block)
- ta-ui-table-component.css:L125 (REFACTOR NOTES — dual sort-arrow conflict)
- ts-btn-component(basic-ref).css:L4–39 (master SmartButton brief), L101–136 (alignment temp fix removal conditions), L176–226 (REFACTOR_NOTES v1 outline-variant token system), L388/L395 (Lush Mode notes)
- toast+ts-ui-toast-component.css:L87 (legacy block kept as utility only), L96–100 (REFACTOR NOTES AND MUST FIX list), L234 (CRITICAL REFACTORING), L263–264 (button-row addition spec), L327–328 (OWNER FIX UPDATE), L414 (vertical separator hack), L435–440 (currentColor trick discovery)
- ts-ui-accordion-component.css:L2 (MERGED BLOCK provenance)
- custom-cursor-component.css:L2–15 (§11.1 + @todo hairline-only/tokenize-controls), L61–81 (PERFORMANCE CONTRACT), L104–105/L110–113/L116–117/L124–125/L130–131/L134–137/L182–187/L194–196 (@perf and @todo comment stream), L356–391 (§11.3 SHAPE REGISTRY TODO with full proposed token surface)

### `@refactor:*` structured machine-readable tags
- ta-ui-table-component.css:L207–210 (`backdrop-critical`, `glass-dependent`, `needs-solid-fallback`, `token-dependency`) — on bulk-bar
- toast+ts-ui-toast-component.css:L227–230 (same four tags) — on toast `backdrop-filter`
- ts-btn-component(basic-ref).css:L101 `@ts-component-consolidate @temporary_alignment_patch`; multiple `/*@ts-smart_button_system*/` and `/*@color_bg_surface_refactor*/`
- custom-cursor-component.css: `@perf`, `@perf-history`, `@todo @cursor-tag:hairline-only`, `@todo @cursor-tag:tokenize-controls`, `@todo @cursor-tag:perf-audit`, `@todo @cursor-tag:isolation`, `@todo @cursor-tag:light-theme-cost`, `@cursor-tag:auto-init`

---

## Cross-chunk synthesis

### Legacy `--ts-bg-N` consumers in this chunk (Rule 15 violations)
- log-component.css:L70 (`--ts-bg-3`); L11 commented-out (`--ts-bg-5`)
- ts-notif-banner-component.css:L40 (`--ts-bg-2` as default surface)
- marquee-component.css:L5 (`--ts-bg-1` dead-code)
- hero-section.css:L16 (`--ts-bg-0`)
- code-window-component.css:L11 (`--ts-bg-1-t`), L12 (`--ts-bg-2-t`), L243 (`--ts-bg-0`), L219 (`--ts-bg-3`)
- ta-ui-table-component.css:L12 (`--ts-bg-0`), L13 (`--ts-bg-1`), L14 (`--ts-bg-2`), L269 (`--ts-bg-0`)
- ts-btn-component(basic-ref).css:L43 (`--ts-bg-3`), L288 (`--ts-bg-1-t`), L389 (`--ts-bg-2-t`), L396 (`--ts-bg-5`)
- ts-gallery-component+lightbox.css:L32+L73 (`--ts-bg-1`), L385 (`--ts-bg-0`)
- toast+ts-ui-toast-component.css:L21 (`--ts-bg-3`), L112 (`--ts-bg-0-t`), L113 (`--ts-bg-0`), L306 (`--ts-bg-2-t`)
- ui-kit-spinner+sortable+draggable+enhancednumberinput.css:L12 (`--ts-bg-1`), L50 (`--ts-bg-2`), L61 (`--ts-bg-3`), L124 (`--ts-bg-4`), L126 (`--ts-bg-3`), L127 (`--ts-bg-2`), L194 (`--ts-bg-4`), L467 (`--ts-bg-1`), L503 (`--ts-bg-2`), L512 (`--ts-bg-3`)
- ts-ui-accordion-component.css:L81 (`--ts-bg-2-t`)
- tooltips-styles.css: indirect — uses hardcoded hex (`#1a1b1e`, `#0c0c0d`, `#e8e9eac9`) for its forced-dark surface instead of `--ts-bg-N`
- hero-section.css badge variants: no `--ts-bg-N` but uses `--ts-accent-dim-2/-3`/`--ts-accent-dark/-2` which are accent-chain derivatives, fine.

**Total files with Rule 15 violations:** 12 of 16. **Files clean:** theme-toggle (foreign-namespaced), ts-ui-select-dropdown-max-height-calc (pure utility), custom-cursor (consumes accent only).

### Hardcoded color literals (hex / rgb / named) in this chunk
- ts-notif-banner-component.css:L40 `#1a1c20`, L41 `#e8eaed`, L50 `#3b82f6`, L51/L56/L66 `#fff`, L55 `#10b981`, L60 `#fbbf24`, L61 `#1a1c20`, L65 `#ef4444` (token defaults)
- tooltips-styles.css:L6 `#1a1b1e`, L8 `#0c0c0d`, L11 `#e8e9eac9`, L54 `#1a1b1e`
- code-window-component.css:L99 `rgb(239, 68, 68)`, L104 `rgb(234, 179, 8)`, L109 `rgb(34, 197, 94)`, L100/L105/L110 `rgb(229, 231, 235)` borders, L137–139 `#ef4444/#22c55e/#eab308`
- header-promobanner.css:L39/L41 `rgba(255,255,255,0.04)`, L59 `rgba(0,0,0,0.32)`, L91 `rgba(0,0,0,0.35)`, L109/L136 `black`
- log-component.css:L95–96 `#fff` in stripe pattern
- ts-btn-component(basic-ref).css:L232/L252/L330/L336/L342 `#fff`
- toast+ts-ui-toast-component.css:L146 `#fff` in track gradient
- custom-cursor-component.css:L22/L29/L42/L56 `rgba(255,255,255,0.85)` / `rgba(0,0,0,0.65)` / `rgba(255,100,50,1)` inside data-URL SVG (constraint-driven, documented mitigation)
- ta-ui-table-component.css:L211 `rgba(0,0,0,0.21)`

### Files that touch `--ts-this-bg` derivatives correctly (GOOD specimens to preserve)
- **ts-notif-banner-component.css** — canonical inversion engine (`--ts-this-bg-inverse`/`--ts-this-fg-inverse`)
- **ts-gallery-component+lightbox.css** — explicit three-tier architecture, uses `--ts-this-bg-border`/`-bright`/`-hover`
- **ts-btn-component(basic-ref).css** — `--ts-this-bg-active/-border/-border-active/-border-hover/-dim/-dim-4/-dim-6/-grad/-grad-2/-grad-3` (most extensive derivative consumption in chunk)
- **ts-ui-accordion-component.css** — `-dim/-dark/-dark-1/-border` (verify these derivative names exist in surfaces.css)
- **toast+ts-ui-toast-component.css** — `-border`, plus introduces `--ts-this-bg-mix`/`-border-mix` percentage tokens (new pattern)
- **code-window-component.css** — `-dim-3/-dim-4`
- **ta-ui-table-component.css** — `-dim-2/-dim-4` on selected rows
- **ui-kit-spinner+sortable+draggable+enhancednumberinput.css** — `-border/-border-hover/-focus-outline/-dim/-dim-2/-dim-3/-dim-4/-grad`

### Files using CSS Nesting (`&` or nested selectors)
- ts-notif-banner-component.css:L49/L54/L59/L64/L70 (`&.ts-banner--info` etc + child auto-inversion)
- ts-btn-component(basic-ref).css:L93–137/L139–153 (nested `.ts-icon` and `span:not(...)`)
- toast+ts-ui-toast-component.css:L441–476 (nested variant routing)
- ts-ui-accordion-component.css:L197–206 (nested `__icon` inside `__header--active`)

### Files using modern features (2024–2026)
- **Container queries:** ts-gallery-component (`@container ts-gallery (max-width: …)`)
- **`@supports (anchor-name: ...)`**: ts-ui-select-dropdown-max-height-calc (progressive enhancement)
- **`allow-discrete` transitions:** toast (L350–352, L379–381), accordion (L405–408, L444–447), custom-cursor (L321)
- **`@starting-style`:** custom-cursor (L331–334)
- **`revert-layer`:** accordion (L427, L429)
- **`round()` math:** custom-cursor (L305)
- **`d:path()` SVG path transition:** theme-toggle (L37–60)
- **`:has()`:** hero (L22), header-promobanner (L147, L154, L158, L164), accordion (L146, L221, L258, L351, L398, L403, L414), gallery (none — uses `>`)
- **`text-wrap: pretty`:** tooltips (L75, L143, L164, L169)

### Real bugs surfaced in this chunk (silent rendering / parser failures)
1. `code-window-component.css:L7` — invalid `var(a, var(b), var(c))` 3-arg syntax; middle fallback silently ignored.
2. `tooltips-styles.css:L39` — `line-height: vr(--ts-tooltip-line-height)` typo (`vr` not `var`); invalid declaration.
3. `tooltips-styles.css:L195` — `margin: var(--ts-index-bar-height) 3px 20px` on tooltip lists — wrong token reference.
4. `hero-section.css:L86` — `clamp(285px, 90vw, 200px)` invalid clamp (max < min).
5. `hero-section.css:L72` — unscoped `canvas` selector bleeds globally.
6. `log-component.css:L106` — `--ts-modal-gap--ts-sp-2` malformed token name; effective margin = 0.
7. `ui-kit-spinner+sortable…css:L290` — `transform: scale(1.02), translateZ(0)` invalid comma syntax; dragging item won't scale.
8. `ts-ui-accordion-component.css:L139` — `.ts-accordion__heade[aria-expanded="true"]` typo selector (missing `r`).
9. `ts-ui-accordion-component.css:L358` — `backgroun-color` typo in transition-property list.
10. `custom-cursor-component.css:L86` — `--cursor-offset: 50% + var(--ts-cursor-size)` missing `calc()`; value silently invalid.
11. `theme-toggle-switch-animation-component.css:L82` — `.theme-toggle-sr { display: none }` defeats sr-only pattern at L73–81; a11y regression.

### NEW design intelligence to lift into permanent skill references
1. **ts-notif-banner inversion engine** (4-token contract: `--ts-this-bg-surface`/`--ts-this-surface-text`/`--ts-this-bg-inverse`/`--ts-this-fg-inverse`) → lift into design-tokens-2.0 skill as the canonical color-inversion pattern.
2. **ts-gallery three-tier architecture comment (L4–24)** → lift verbatim as the canonical three-tier example.
3. **ts-btn SmartButton master brief (L4–39) + REFACTOR_NOTES v1 (L176–226) + alignment temp fix removal conditions (L101–136)** → lift into rebuild's button spec.
4. **ts-ui-select dropdown v3 "declare knobs AND formula in each context" pattern (L4–19)** → lift into design-tokens-2.0 as a known cascade-short-circuit workaround.
5. **toast currentColor animatable-gradient trick (L435–440)** → lift as a permanent pattern: route gradient color stops through `currentColor` to enable animation.
6. **custom-cursor PERFORMANCE CONTRACT (L61–81) + §11.3 SHAPE REGISTRY spec (L356–391) + `@perf` annotation system** → lift into a permanent reference for GPU-cheap CSS+JS hybrid components.
7. **The `@refactor:backdrop-critical|glass-dependent|needs-solid-fallback|token-dependency` tag system** (table L207–210, toast L227–230) → adopt as an emerging convention for machine-parseable refactor flags.
8. **accordion `revert-layer` escape hatch (L424–433)** → document as the canonical pattern for "components that host arbitrary content".
9. **hero REFACTOR NOTES 5-point hero variant spec (L38–56)** → lift into rebuild's hero/section spec.
10. **header-promobanner "banner with action" responsive pattern requirements (L175–203)** → lift into rebuild's banner component spec.

---


---

# Extracted Blocks Catalog — Section 4b: Components (large, 19KB–87KB)

**Sub-agent:** 4b  ·  **Chunk:** components/ large files  ·  **Files:** 11  ·  **Total lines:** 12,874  ·  **Total bytes:** ~398KB

Scope: the 11 largest component files under `docs/references/toolskin.css_extracted-core-blocks-to-refactor/components/`. Discipline was GREP-FIRST per the dispatch brief — the 87KB `headermenu-…-sidebarnav.css` file alone is 2,544 lines and was never read whole. Companion chunk: `_extracted-blocks-section-4a-components-small.md`.

## Files in this chunk

| File | Lines | Bytes | Block type |
|---|---|---|---|
| ts-masonry+layout-priitives.css | 642 | 19,119 | layout engine — `.ts-masonry` v5 (container queries) + auxiliary layout primitives (`.ts-stack`/`.ts-cluster`/`.ts-grid--auto`/`.ts-sidebar`/`.ts-split`/`.ts-frame`/`.ts-center`); 7 media-query overrides for `.ts-section:has(.ts-marquee)` flagged TEMPORARY |
| footer-component.css | 861 | 19,584 | layout block — `footer.ts-footer` + 5 widgets (`.ts-footer-row`/`-column`/`-columns`/`-widget`/`-socket`) + `.ts-footer--dark` variant + responsive collapse |
| ts-checkbox-radio.css | 803 | 24,227 | dedupe-target — `.ts-checkbox-row` + `.ts-checkbox` + `.ts-control--checkbox`/`--radio` + sizes (sm/md/lg/xl) + `.ts-radio-group` + duplicated `.ts-ui-control--*` family + light-theme styles; flagged `@ts-inputs-refactor-dedupe #START_DEDUPE` |
| ts-patterns.css | 515 | 25,367 | imported asset (MagicPattern-adapted) — `[class*="ts-pattern-"]` 12-ish pattern families (`-dots`/`-grid`/`-cross`/`-wtf`/`-zigzag`/`-checkerboard`/`-diagonal-stripes`/`-dots-dense` etc.) + size/opacity modifiers + animation keyframes |
| iconlist+featlist-allvariants-component.css | 671 | 26,242 | **canonical three-tier component** — §6c v2 `.ts-list` + `.ts-feat-list` rebuild w/ LAYER-1/LAYER-2 architecture + clamp icon engine + custom `--ts-this-bg-border` derivative recipe |
| ts-panel+root-debugger-component.css | 1,091 | 32,380 | compound — §6c `.ts-panel`/`.ts-ui-panel` panel system (declared TWICE: L6–280 + L877–1091) + §6d `--ts-nest-radius`/`--ts-nest-pad` NEW-B16 nest-reduction system + `#ts-debug-root` dev-only debugger widget (L301–500) + scoped `.ts-ui-select` rules (L594–855) |
| inputs-global-nested-design-pattern.css | 1,493 | 38,203 | **the canonical "nested design pattern" reference (Rule 4 surface superposition)** — §6e inputs base + §6f range slider (+ `@property --ts-range-val`) + §6g chips/tags + §6h tabs + §6i badges/status + §6j navigation + §6k modal/overlay + §6l tables stub; 5 `@keyframes`, 1 `@property` |
| ts-card-flip-swipe-interactive-component.css | 1,392 | 41,076 | compound — §6b `.ts-card` base + §6q `.ts-flip-card` 3D + §6q.2 `.ts-swipe-card` non-3D + §6r `.ts-pricing-card` + text-shadow engine (`--ts-shadow-*`) + §6s `.ts-testimonial`; @property for shadow-blur/offset/opacity |
| ts-card-flip-swipe-interactive-component2.css | 1,392 | 41,076 | **EXACT BIT-FOR-BIT DUPLICATE of #8** — `diff -q` returns no output. See "Card-flip duplicate verdict" below. |
| ts-ui-select-variants(disordered).css | 1,470 | 44,097 | dropdown engine (owner-acknowledged "disordered" structure) — `.ts-ui-select__dropdown`/`__trigger`/`__option` + `.ts-icon-dd-list` icon-picker variant + `.ts-icon-selected-row` w/ search overlay + scoped overrides for `.ts-banner-generator-app`/`.ts-card-col-half`/`.ts-modal` + JS-driven `--ts-ui-select-trigger-min-height` |
| headermenu-topnav-fixednav-mobilemenu-sidebarnav.css | 2,544 | 86,627 | **THE BIG ONE** — 5 logical components compounded (top-nav, fixed-nav, mobile-menu, sidebar-nav, header-menu/burger) + 2 dev-only floating fixed buttons (`#ts-top-btn`/`.ts-back_top-nav`/`.ts-nav-more`). See "headermenu split" section below. |

---

## Special case: card-flip #8 vs #9 — duplicate verdict

Verdict: **EXACT bit-for-bit duplicate.** `diff -q ts-card-flip-swipe-interactive-component.css ts-card-flip-swipe-interactive-component2.css` returns NO output (both 41,076 bytes, both 1,392 lines, identical token declarations on identical line numbers). Not an alternate, not a revision — a literal copy. Owner action recommended: **DELETE `…component2.css`** unless the duplicate is acting as a snapshot-for-comparison sentinel; if so, rename it `…component.SNAPSHOT-YYYY-MM-DD.css` to make the intent explicit. Catalog body below treats them as ONE file.

## Special case: ts-ui-select-variants `(disordered)` — what the owner meant

The `(disordered)` parenthetical in the filename is an owner self-flag: the file's selectors are NOT grouped by component layer, NOT grouped by state, and inline structural CSS is interleaved with theming overrides. The L9 `@ts-component-consolidate` opening tag and the four large embedded refactor briefs (L10–53 dropdown SCOPE CONSOLIDATION, L206–271 ts-card-col-half CRITICAL LAYOUT OVERRIDE — DO NOT CONSOLIDATE, L857–1058 ICON SELECTOR REQUIRED REFACTOR, L1257–1340 cascade-abuse note) constitute the structural reorganisation plan the owner already wrote against this file. Recommended structural reorg (lifted from the embedded briefs verbatim where possible):

1. **Hoist all `--ts-input-*`/`--ts-select-item-bg*`/`--ts-input-border*`/`--ts-shadow-accent` token declarations to a single `.ts-ui-select` component root.** Dropdown, trigger and option layers MUST only CONSUME tokens, never re-declare them.
2. **Split responsibilities per layer:** structure→`__dropdown`; shape→component root; theme tokens→component root; ICON variant→`.ts-ui-select--icon` modifier (NOT a separate selector tree using `.ts-icon-dd-list`/`.ts-fullselector-wrapper`).
3. **Collapse state model** to {idle, hover, open, selected}. Remove chained `:has()` state derivations; move open/has-value/search-active to JS.
4. **Quarantine `.ts-banner-generator-app` overrides** to TOKEN-OVERRIDES ONLY — no structural rules, no state logic.
5. **Keep `.ts-card-col-half`-scoped width override (L206–271) AS-IS** — explicitly flagged DO NOT CONSOLIDATE; it's a layout-context fix, not reusable behaviour.
6. **Replace "NONE" state pseudo-element hack** (`✖` glyph via `::after`, L1453+) with a JS data-attribute (`data-state="empty"`).
7. **CSS-driven logic that should be JS:** icon "none" rendering, conditional visibility hacks, search/input overlay opacity transitions tied to hover.

## Special case: ts-panel+root-debugger — separate panel vs debugger concerns

This is two unrelated components shoehorned into one file. The catalog separates them:

- **Panel (`.ts-panel` + `.ts-ui-panel` alias)** — L1–280 (and DUPLICATED L874–1091): production component, ships. Carries the §6d NEW-B16 `--ts-nest-radius`/`--ts-nest-pad` nest-reduction system (the only place this is defined). The L282–299 `@ts-panel--refactor-plan` block explicitly states: *"ts-ui-panel is currently added as an alias due to #ts-debug-root requirements; the debugger widget layout needs different settings than the original ts/panel showcase, so dedicated rules and some #ts-debug-root–scoped overrides were introduced to avoid breaking the demo. INTENT: unify ts/panel and ts-ui-panel into a single system after refactor."*
- **`#ts-debug-root` debugger (L301–500)** — DEV-ONLY widget. Floats a debug panel via `--ts--debug-root-offset-y` calc. **This should NOT ship in the production bundle.** Recommend gating behind a `dev`/`debug` build flag or stripping at bundle time. Owner has not yet annotated this.
- **Scoped `.ts-ui-select` re-styling at L594–855** — bleeds an entire select restyle into the panel file. Belongs in `ts-ui-select-variants(disordered).css` and should be lifted out.
- **Panel rules duplicated TWICE** — L6–280 and L874–1091 are near-identical copies of `.ts-panel` declarations. Pure dead code in the second half; collapse to one.

## Special case: inputs-global-nested-design-pattern — the "nested design pattern" reference

Per Rule 4 (surface superposition), this is the canonical reference. The pattern is:

1. **Token resolution layer** (`.ts-input:not(.ts-resizable), .ts-select, .ts-textarea:not(.ts-resizable), .ts-ui-select__trigger, .ts-input-group, .ts-input-group.ts-input-inset-button, .ts-resizable-wrap` at L101–136): declares local `--_input-accent`/`--_input-focus`/`--_input-color`/`--_input-bg`/`--_input-border` PRIVATE tokens prefixed `--_` (underscore = local-only), THEN maps them to public `--ts-input-*` tokens. Consumer rules read `--ts-input-*`, never `--_input-*`.
2. **Surface re-anchoring** (L147 `.ts-input` family sets `--ts-this-bg: var(--ts-input-bg);`) — the input REWRITES `--ts-this-bg` so the whole surface-derivative chain inside the input is re-anchored to the input's own background.
3. **Cascading variant overrides** consume the same public tokens, never the privates — see `.ts-modal__body .ts-input` (L331–354) which overrides `--ts-input-bg` and the `--ts-this-bg`/`--ts-this-bg-border` pair cascades.
4. **Component-level overrides** (badges L1025–1027, chips L686–688, banner-generator L1191+) follow the same protocol — set `--ts-this-bg`, set `--ts-this-bg-mix`, all derivative properties recompute automatically.

This is the pattern Session 3 `surfaces.css` should formalise. The chips block (L660–780) is the cleanest example: 4 declarations on `.ts-chip:not(.ts-align-anchor-btn)` set `--ts-this-bg-dim`/`--ts-accent-bright`/`--ts-this-bg-mix` and the entire visual variant (idle, hover, active, success/warning/danger/accent) cascades from there.

## Special case: headermenu — split into 5 logical components

The 2,544-line `headermenu-topnav-fixednav-mobilemenu-sidebarnav.css` file is FIVE compound components plus floating UI helpers. Logical split:

### COMPONENT A — header-level token cartel (L1–225)
- **Selector signature:** `:root .ts-modal, :root .ts-modal *, :root .ts-topbar, :root .ts-topbar *, :root .ts-footer, :root .ts-footer *, :root .ts-mobile-menu *, :root .ts-nav-static, :root .ts-nav-static *, :root .ts-nav-fixed, :root .ts-nav-fixed *` (L19–29) — the substring-distribution token cartel for the entire header family. **R-cascade violation** (Rule 8) — this is exactly the `:root [class*=...]` substring-distribution pattern the rebuild forbids.
- Declares the entire `--ts-navlink-*` / `--ts-header-*` / `--ts-burger-*` / `--ts-menu-burger-*` / `--ts-shadow-bold*` / `--ts-fs-base` (0.68rem scoped) / `--ts-fs`/`--ts-fs-xs` recomputation / `--ts-topbar-h` / `--ts-nav-btn-h` token surface.
- Carries 4 large embedded `REFACTOR NOTE crucial:` briefs (L10, L93, L128, L151) — see annotations below.

### COMPONENT B — top-nav (`.ts-nav-static`)
- Selectors: `.ts-nav-static`, scattered, mostly token-cartel inherited. **Lowest specificity, fewest overrides.**

### COMPONENT C — fixed-nav (`.ts-nav-fixed`) — DOMINANT
- ~70% of the file. Selectors: `.ts-nav-fixed`, `.ts-nav-fixed__links`, `.ts-nav-fixed__links.ts-nav-truncate`, `.ts-nav-more`, `.ts-nav-more.hasItems`, `.ts-nav-dropdown`, `.ts-nav-fixed:before`, `.ts-nav-fixed.spaced`, `.ts-nav-fixed.ts-nav--spaced`, `.ts-nav-fixed.ts-nav--icon-only`, `.ts-nav-fixed:has(.ts-nav-fixed__links.ts-icon-only-nav) …` (L675–679), `.ts-nav-fixed:has(button.ts-menu-burger.active) …` (L2216, L2223 — burger-open sibling collapse).
- `.ts-nav-fixed { .ts-ui-select { .ts-ui-select__trigger { … } } }` nested at L2525–2544 — the OWNER FIX & REFACTOR NOTES (L2499) cascade pattern.
- `--ts-nav-items-spacing` modal-mode override (L505–511).

### COMPONENT D — mobile-menu (`.ts-mobile-menu`, `.ts-mobile-menu-items`)
- Selectors: `.ts-mobile-menu`, `.ts-mobile-menu-items > *`, `.ts-mobile-menu-items a`, breakpoint `@media (max-width: 868px)` at L1964 + `@media (max-width: 420px)` at L2232.
- The L1967 embedded REFACTOR NOTE confesses the mobile↔desktop transition is "heavily patched."

### COMPONENT E — sidebar-nav (`.ts-sidebar-menu`, `aside.ts-sidebar-menu.ts-ui-panel`, `.ts-sidenav`, `.ts-sidenav__btn-row`)
- L2253–2496. **The grid-template `body:has(aside.ts-sidebar-menu…)` rule at L2253** sets `grid-template-columns: var(--ts-sidebar-nav-w) 1fr` on `body` — pushes content rather than overlaying. Uses CSS Nesting throughout (`& :hover`, `& .ts-ui-select`, `& .ts-ui-select__option`).
- `--ts-sidebar-nav-w: 200px`, `--ts-grid-bg-pattern`, `--ts-grid-line-color` declared HERE (sidebar-nav uniquely owns the background-grid texture).
- This component pushes content into a grid layout — explicitly the "must-have alternative layout" called out in the L1 §6 wishlist.

### COMPONENT F — header-menu / burger (`.ts-menu-burger`, `.theme-toggle`)
- L1700–1820 (burger lines + active/inactive transforms).
- Token cartel: `--ts-burger-line-h: 2px`, `--ts-burger-line-distance: calc(--ts-burger-line-h * 4)`, `--ts-burger-line-dist-offset` derived. Burger-active state at L1783 transforms inner lines into an "X".
- The `.ts-nav-fixed:has(.ts-menu-burger.active)` cascade at L1953–1961 + L2216–2229 hides everything else when burger opens.

### COMPONENT G — floating UI helpers (NOT a nav)
- `#ts-top-btn`, `.ts-back_top-nav` (scroll-to-top), `.ts-fixed-btn`. L1803–1949 + L2008–2069.
- Tightly bound to nav layout. Owner annotations explicitly state these "have been required multiple patches and workarounds (marked as #CRAZY_FIX_RULES across the stylesheet)."

### Shared tokens vs component-private (headermenu)
- **Shared (declared in COMPONENT A's token cartel L19–219)** — `--ts-navlink-color`/`-hover`/`-active`, `--ts-navlink-fs`, `--ts-navlink-gap`, `--ts-navlink-pad-x`/`-y`/`-x-mult`/`-y-mult`, `--ts-navlink-mult-{lg,md,sm,xs}`, `--ts-navlink-bg`/`-bg-hover`/`-bg-active`, `--ts-navlink-btn-max-h`, `--ts-navlink-select-min-w`/`-max-w`/`-width`, `--ts-header-bg`/`-border`/`-blur`/`-bg-alpha`/`-border-alpha`/`-logo-w`/`-logo-h`/`-logo-pad`/`-logo-fs`/`-logo-color`/`-logo-subtext-color`/`-logo-fs-adjust`/`-ui-rad`/`-btn-rad`, `--ts-burger-*` family, `--ts-menu-burger-*` family, `--ts-shadow-bold*`, `--ts-fs-base: 0.68rem`/`-fs`/`-fs-xs` recomputed-at-nav-scope, `--ts-btn-h: var(--ts-nav-btn-h)`, `--ts-icon: calc(--ts-navlink-fs * 1.2)`.
- **Component-C-private (fixed-nav)** — `--ts-header-border-alpha: 22%/32%/60%/65%` per-state, `--ts-nav-items-spacing`, `--ts-navlink-fs-text-icon: var(--ts-icon-only-fs)`, `--ts-input-fs: calc(--ts-navlink-fs * 1)`.
- **Component-E-private (sidebar)** — `--ts-sidebar-nav-w`, `--ts-grid-line-color`, `--ts-grid-line-mix`, `--ts-grid-bg-pattern`, `--ts-grid-s`, `--base-size: 100dvw` (note no `--ts-` prefix — namespace violation).
- **Component-G-private (floating buttons)** — `--ts--btn-fixed-offset` (DOUBLE-DASH prefix — namespace violation pattern), `--ts--debug-root-offset-y` (same).

### Notable headermenu structural facts
- 3 `@media` queries: `min-width: 867px` (L1821), `max-width: 868px` (L1964), `max-width: 420px` (L2232). The 867↔868 hairline split is intentional — strict-less-than vs strict-greater-than to avoid double-application at exact boundary.
- 4 occurrences of `:has(button.ts-menu-burger.active)` — burger-active cascades affect sibling nav links, parent `.ts-nav-fixed`, and `html` (sticky z-index bump).
- 16 owner-annotated REFACTOR / CRAZY_FIX / OWNER FIX blocks (see annotation index below).
- ONLY ONE hex literal in the entire 86KB file (L369 `rgba(0, 0, 0, 0.1)` in a shadow). Excellent OKLCH compliance.

---

## Per-file catalog (essentials)

### ts-masonry+layout-priitives.css

- **Path:** `docs/references/toolskin.css_extracted-core-blocks-to-refactor/components/ts-masonry+layout-priitives.css`  ·  **Lines:** 642  ·  **Bytes:** 19,119
- **Filename typo:** `priitives` (missing `m`) — owner has not corrected; preserve until rename pass.
- **Block type:** layout engine "Integration v5" header (L3–13) — `.ts-masonry` flexbox masonry with container queries + `.ts-stack`/`.ts-cluster`/`.ts-grid--auto`/`.ts-sidebar`/`.ts-split`/`.ts-frame`/`.ts-center` primitives.
- **Tokens declared:** see grep. Highlights — `--ts-masonry-cols-target: 5` (L46), `--ts-masonry-col-min: 10rem` (L47), `--ts-masonry-row-h: 7.5rem` (L49), `--_ts-basis-{5,4,3,2,1}` private grid-track formulae (L51–55), `--ts-masonry-tall-multiplier: 2`, `--ts-masonry-hover-{scale,duration,ease}` (L31–33), `--ts-masonry-image-{aspect,radius,bg,border}` (L24–27). Nested override `.ts-masonry-item .ts-marquee.fullwidth.ts-marquee-container` sets `--ts-masonry-row-h: var(--ts-flip-card-h) !important`.
- **`--ts-bg-N` direct references:** L26 (`--ts-masonry-image-bg: var(--ts-bg-1)`), L619 (`.ts-masonry .ts-marquee-container { background: var(--ts-bg-1) }`). **2 direct references.**
- **Selectors of interest:** `:root .ts-masonry:not(.ts-portfolio-grid, :has(.ts-marquee))` (substring-distribution-adjacent, L22–23 — R-cascade concern); `.ts-masonry:not(:has(.ts-marquee))` (L45 — variant excludes marquee contexts); `.ts-masonry > *` (L67 — universal child sizing); `.ts-masonry:has(> :only-child) > *` (L92 — single-child fallback).
- **At-rules:** 3× `@container ts-masonry` queries (L74, L80, L86) + 7× `@media` queries (L381–609).
- **Owner annotation VERBATIM (L372–375 — the load-bearing one):** `/*THIS ARE  HARDFIXES   CODE  PATCHES THAT ARE KEOPT TO KEEP THE LAYOUT  STABLE ON THE SHOWCASE BLOCK FOR THE MARQUEE GRID, BECASUE THE NEW REFACTORED MASONRY DOENST HAS SUPPORT FOR THAT   IRRATIONAL BUILT LAYOUT. SO ONCE REFACTORED, REBUILD THE MARQUEE  DISPLAY LAYOUT.  THIS CODE IS ONLY TEMPORARY.*/` — explicitly marks L381–511 (six media queries + grid-template overrides for `.ts-section:has(.ts-marquee) .ts-masonry`) as TEMPORARY HARDFIXES to be deleted once the marquee layout is rebuilt.
- **Refactor flags:** (a) the `.ts-masonry--grid` variant is reserved but not implemented — L7 promises it, L366–367 comments it out as `TBD`; (b) the file mixes display:flex (L58, L444) and display:grid (L503, L510) within the same `.ts-masonry` selector tree — switches between layout engines based on context, fragile; (c) L51–55 `--_ts-basis-N` formulae assume 5 columns at root then container queries cascade DOWN; the formulae `(100% - N*gap)/N - 1px` have hardcoded `- 1px` for fractional-pixel rounding (undocumented why); (d) container queries are used correctly (L63 `container-type: inline-size; container-name: ts-masonry`); (e) **`.ts-masonry--grid` was the v5 promised migration target** — not delivered.
- **Session 3/4 relationship:** masonry layout is self-contained. The L372 owner annotation is a HARD GATE — temporary hardfixes must be REMOVED in the rebuild, not migrated. The layout primitives (L515+ `.ts-stack`/`.ts-cluster`/etc.) are atomic and should map cleanly to the rebuild's layout-utility block.
- **Gap vs `_code-audit-catalog.md`:** (a) `.ts-masonry*` is in catalog §4.10 layout. (b) NEW: the `.ts-section:has(.ts-marquee)` hardfix block is undocumented; the L372 owner annotation marks it as deletable. The `--ts-masonry-grid` reservation is undocumented. (c) No contradictions.

---

### footer-component.css

- **Path:** `docs/references/toolskin.css_extracted-core-blocks-to-refactor/components/footer-component.css`  ·  **Lines:** 861  ·  **Bytes:** 19,584
- **Block type:** Layout block — `footer.ts-footer` + 5 widget families.
- **Tokens declared:** L214 `--ts-navlink-color: var(--ts-navlink-color-hover)`, L253 `--ts-this-bg: var(--ts-bg-1-t)`, L267–278 the full input cartel re-declared for footer-scoped inputs (`--ts-input-color`/`-hover`/`-focus`, `--ts-input-bg`/`-hover`/`-focus`, `--ts-input-border`/`-hover`/`-focus`), L280 `--ts-input-radius: var(--ts-btn-radius)`, L660–662 light-theme footer-dark variant (`--ts-text-primary: white`, `--ts-text-secondary: #6f6f6f`, `--ts-bg-2: #ffffff14`), L772–774 dark-variant `--ts-border-1: var(--ts-text-muted-dim)`, `--ts-border-0: rgba(255,255,255,0.05)`, `--ts-btn-h: 50px`. L830–831 `--ts-this-bg: var(--ts-text-muted-dim); --ts-bg-1: var(--ts-this-bg-dim-4)` — **the file REDEFINES `--ts-bg-1` as a derivative of the surface chain. Architectural inversion.**
- **`--ts-bg-N` direct references:** L13, L253, L278, L294, L371, L417, L434, L451, L463, L468, L473, L479, L492, L508, L569, L650, L662 (declares `--ts-bg-2`), L831 (declares `--ts-bg-1`). **17 direct references including 2 REDECLARATIONS of `--ts-bg-N` primitives at component scope** — the worst Rule 15 / R-rule-15 violator in chunk 4b.
- **Selectors of interest:** `footer.ts-footer`, `footer.ts-footer .ts-container`, `.ts-footer-row`/`-column`/`-columns`/`-widget`/`-socket`/`-socket-row`/`-copyright`/`-widget-title`, `.ts-newsletter-input`/`-input-group`/`-btn`/`-desc`, `.ts-social-links`/`-link`, `.ts-portfolio-grid`, `.ts-split-feature__content .ts-feat-list`, `[data-theme="light"] footer.ts-footer.ts-footer--dark` (L654 — paradox: light THEME, dark VARIANT, forced-dark resolution).
- **Keyframes:** none.  **At-rules:** `@media (max-width: 768px)` at L691.
- **Hardcoded literals:** L657 `#08090c`, L658 `rgb(255 255 255 / 8%)`, L659 `#f2f3f7`, L660 `white`, L661 `#6f6f6f`, L662 `#ffffff14`, L769 `#08090c`, L771 `#f2f3f7`, L773 `rgba(255, 255, 255, 0.05)`, L790 `#f2f3f78a`, L857 `#f2f3f7`. The `--ts-footer-dark, #08090c` fallback (L657) and `--ts-footer-dark-border` are exposed as overridable tokens but with hex literal fallbacks.
- **Owner annotations:** none explicit (no `REFACTOR NOTE`/`CRAZY_FIX`/`OWNER FIX` markers). Block is mostly silent — telling, because the architecture is bad (L13 raw `--ts-bg-0`, L831 `--ts-bg-1` REDEFINITION) and lacks the embedded refactor docs that other large files have.
- **Refactor flags:** (a) `footer.ts-footer.ts-footer--dark` declared THREE times (L654–663, L768–775, L814–818) — fragments rather than one consolidated rule; (b) L831 REDEFINES `--ts-bg-1` as a derivative — breaks the primitive→system→component contract violently (a component reaches back into the primitive layer and overwrites it for descendants); (c) responsive collapse `@media (max-width: 768px)` declares `padding-block: var(--ts-sp-13)` then immediately L752 declares `padding-block: var(--ts-sp-11)` for the SAME selector — second wins, first is dead code; (d) hardcoded `#08090c` deep-dark `--ts-footer-dark` is exactly the kind of "always-dark-regardless-of-theme" surface that should be tokenized via `--ts-surface-strong`/`--ts-surface-inverted` (same gap flagged on tooltips in chunk 4a); (e) L13 `background: var(--ts-bg-0)` and L650 `.ts-footer-socket { background-color: var(--ts-bg-0) }` are the most surface-y of the violations.
- **Session 3/4 relationship:** Footer must be torn down and rebuilt entirely on the `--ts-this-bg` derivative chain. The `--ts-bg-1` redeclaration at L831 is the highest-priority repair in chunk 4b — it's a back-pollution that breaks the surface-superposition contract.
- **Gap vs `_code-audit-catalog.md`:** (a) `.ts-footer*` family in catalog §4.10. (b) NEW: the L831 primitive REDEFINITION at component scope is not in the catalog and is the worst Rule 15 violation we've seen in chunk 4b. The triple-declaration of `.ts-footer--dark` is undocumented. (c) No contradictions.

---

### ts-checkbox-radio.css

- **Path:** `docs/references/toolskin.css_extracted-core-blocks-to-refactor/components/ts-checkbox-radio.css`  ·  **Lines:** 803  ·  **Bytes:** 24,227
- **Block type:** dedupe-target. L1 owner header `/* ── !!!!! @ts-inputs-refactor-dedupe #START_DEDUPE Checkbox / Radio /INPUTS ─ */` confirms this block was MOVED from elsewhere in the master sheet (`~line 6500`) and the markers `#START_DEDUPE`/`#END_DEDUPE` + tag `@ts-inputs-refactor-dedupe` are owner-instituted bookmarks for the merge.
- **Tokens declared:** see grep. Notable: `--ts-checkbox-size: 1rem`/`1.125rem`/`1.375rem`/`1.625rem` (sm→md→lg→xl ladder at L58/63/250/270/276), `--ts-checkbox-mark-inset` matching ladder (22→22→26→28%), `--ts-radio-group-item-py/-px/-compact-padding` (L345–347), parallel `--ts-ui-control-*` family (L408–414, L597–624) and parallel `--ts-ui-radio-group-*` family (L692–694) — exactly the duplication the file flags as `#START_DEDUPE`. Light-theme `--ts-accent-border: color-mix(in srgb, var(--ts-accent), var(--ts-text-primary) 18%)` (L142) + dark-theme `… 22%` (L189) — mixing constants ARE hand-tuned per theme. **R-rule-15 violation against the apcach mixing-constant principle** (Resolution #1 — engine-derived only).
- **`--ts-bg-N` direct references:** L94, L100, L101 (`--ts-this-bg: var(--ts-bg-3)`), L129, L158, L191, L224, L321, L331, L366, L450, L470, L490, L526, L546, L580, L586, L668, L678, L713, L750, L763, L776, L788, L789, L790, L795, L803. **28 direct references** — highest count in chunk 4b after the inputs file. Also embeds three `#ffffff` and `#000000` and `#1a1a1a` literals (L499, L524, L788, L790, L803).
- **Selectors of interest:** `.ts-checkbox-row input[type="checkbox"]/[type="radio"]`, `.ts-control--checkbox input`/`.ts-control--radio input`, `.ts-checkbox`, `.ts-field-group`, `.ts-table--bulk`, `.ts-radio-group`/`__item`, parallel `.ts-ui-control--checkbox`/`--radio`, `.ts-ui-radio-group`/`__item`.
- **Keyframes:** none. **At-rules:** none.
- **Hardcoded literals:** L499 `#ffffff` in `color-mix(…)`, L524 `#ffffff`, L788 `#ffffff`, L789 hardcoded `var(--ts-border-strong)` (referencing a token that may not exist), L790 `#000000`, L803 `#1a1a1a`. All inside light-theme variants — the light-theme path is hardcoded, dark-theme path is token-derived. **Asymmetric Rule 15 violation: light-mode hardcoded, dark-mode tokenized.**
- **Owner annotations VERBATIM:** L1 `/* ── !!!!! @ts-inputs-refactor-dedupe #START_DEDUPE Checkbox / Radio /INPUTS ─ */`; L3–25 the full REFACTOR NOTES (Task: merge migrated block with redefined-with-updated-rules block; Constraints: use `#START_DEDUPE`/`#END_DEDUPE` markers; Refactor requirements: tokenize, eliminate redundant declarations, ensure variant parity; Goal: clean, deduplicated, token-driven implementation); L766–769 the standard `@refactor:backdrop-critical` / `@refactor:glass-dependent` / `@refactor:needs-solid-fallback` / `@refactor:token-dependency` tag stack (only one instance — light-theme bulk-bar context).
- **Refactor flags:** (a) `.ts-checkbox` and `.ts-ui-control--checkbox` are duplicate families — must be unified; (b) the `--ts-checkbox-*` and `--ts-ui-control-*` token ladders carry identical values — clearly mid-migration; (c) light-theme rules at L788–803 use hardcoded hex which DEFEATS the apcach engine — light-theme inversion should re-run the same math, not declare different colors; (d) `accent-color: var(--ts-accent)` at L38 — native browser accent on `<input>` element, can't be tokenized further; (e) `border-radius: var(--ts-radius-xss, 3px) !important` at L72 — `--ts-radius-xss` token doesn't exist in canonical ladder (4/6/8/10/16), likely meant `--ts-radius-xs`.
- **Session 3/4 relationship:** This file is the canonical TEST CASE for the `@ts-inputs-refactor-dedupe` workflow. Successfully consolidating it = the rebuild's dedupe pattern works. The asymmetric light/dark hex problem is a Tier-1 apcach-engine concern.
- **Gap vs `_code-audit-catalog.md`:** (a) `.ts-checkbox*`/`.ts-control--*`/`.ts-ui-control--*` in catalog §4.10. (b) NEW: the asymmetric light-mode-hardcoded-vs-dark-mode-tokenized split is undocumented; the `--ts-radius-xss` invalid token reference is undocumented; the missing `#END_DEDUPE` marker (search returns no result) means the dedupe window was never closed — file boundary IS the implicit close. (c) No contradictions.

---

### ts-patterns.css

- **Path:** `docs/references/toolskin.css_extracted-core-blocks-to-refactor/components/ts-patterns.css`  ·  **Lines:** 515  ·  **Bytes:** 25,367
- **Block type:** Imported third-party asset adapted to Toolskin namespace. L3 marker `/* ═══ MERGED BLOCK: ts-patterns.css (source: assets/css/ts-patterns.css) ═══ */`. Provenance L9: "Generated from MagicPattern · Adapted for Toolskin tokens." Documents usage at top (L12–48) with size modifiers (`--xs`/`--sm`/default/`--lg`/`--xl`/`--2xl`), opacity modifiers (`--subtle`/`--faint`/default/`--medium`/`--strong`), inline custom-property overrides, and an explicit "NON-ANIMATABLE PATTERNS" list (`-zigzag`, `-checkerboard`, `-diagonal-stripes`, `-dots-dense`).
- **Tokens declared:** `--ts-pattern-scale` per modifier (L88/92/96/100/104), `--ts-pattern-line-perc: 80%` (L280), `--ts-cross-size`/`-angle`/`-factor`/`-factor-neg`/`-w`/`-bg-perc`/`-color-perc`/`-gutter` (L322–346, the cross-pattern token family), `--ts-wtf-size`/`-angle` (L376–377, the "wtf" pattern), `--ts-pattern-animation-duration: var(--ts-pattern-anim-duration, 30s)` (L469). Also declares NON-PREFIXED tokens (`--pattern-scale`, `--pattern-color`, `--pattern-color-alpha`, `--pattern-bg`) — **namespace violation, multiple instances at L68, L71–73, L326, L342, L378.**
- **`--ts-bg-N` direct references:** L326, L342, L378 — `--pattern-bg: var(--ts-bg-0)` (in three pattern variants). **3 direct references.**
- **Selectors of interest:** `[class*="ts-pattern-"]` (L54 — substring-distribution selector, R-cascade flag), `[class*="ts-pattern-"]::before`, `.ts-pattern--{xs,sm,lg,xl,2xl}` size, `.ts-pattern--{subtle,faint,medium,strong}` opacity, plus the actual pattern classes (`.ts-pattern-dots`, `.ts-pattern-grid`, `.ts-pattern-cross`, `.ts-pattern-wtf`, `.ts-pattern-zigzag`, `.ts-pattern-checkerboard`, `.ts-pattern-diagonal-stripes`, `.ts-pattern-dots-dense`, etc.).
- **Keyframes:** `ts-pattern-drift` (L428), `ts-pattern-drift-reverse` (L438), `ts-pattern-drift-horizontal` (L448), `ts-pattern-drift-vertical` (L458). **At-rules:** `@media (max-width: 768px)` at L502.
- **Hardcoded literals:** L39 `#00e5ff` in docstring example (NOT real code); L71 `var(--ts-accent, #ff540a)` fallback (Rule 15 — should not have a hex fallback for accent).
- **Owner annotations:** none beyond the L5–48 docstring; the file is largely self-explanatory.
- **Refactor flags:** (a) `[class*="ts-pattern-"]` is a substring-distribution selector — R-cascade pattern (Rule 8) — REWRITE to explicit `:is(.ts-pattern-dots, .ts-pattern-grid, …)` enumeration; (b) the L68/L71/L73 non-`--ts-` namespace tokens (`--pattern-scale`, `--pattern-color`, `--pattern-color-alpha`) are scoped inside `::before` but breach the namespace contract — either prefix to `--ts-pattern-*` or document as deliberate "private" namespace; (c) L88 `--ts-pattern-scale: max(1, 0.5)` is a NO-OP — `max(1, 0.5) === 1`, the modifier does nothing; same for L92 (`max(1, 0.75)`) — the L67 comment "enforce minimum of 1 to prevent breaking" applies the floor in the consumer instead, making these modifier declarations dead; (d) the "NON-ANIMATABLE PATTERNS" list at L43–48 is documentation-only — no enforcement; (e) L72–73 `--pattern-color-alpha: var(--ts-pattern-color-alpha, color-mix(in srgb, var(--pattern-color) 50%, transparent))` uses a default that consumes itself (recursive-ish via `var(--pattern-color)` which is `var(--ts-pattern-color, var(--ts-accent, #ff540a))`); valid but fragile.
- **Session 3/4 relationship:** Pattern system is self-contained. The substring-distribution rewrite to `:is(...)` is the major Session 4 task. Move the `--pattern-*` private tokens under `--ts-pattern-*` namespace. Keyframes can ship as-is.
- **Gap vs `_code-audit-catalog.md`:** (a) `.ts-pattern-*` family in catalog §4.10. (b) NEW: the four drift keyframes and the explicit non-animatable list are not in catalog; the `max(1, X)` no-op modifiers are undocumented; the MagicPattern provenance is not in catalog. (c) No contradictions.

---

### iconlist+featlist-allvariants-component.css

- **Path:** `docs/references/toolskin.css_extracted-core-blocks-to-refactor/components/iconlist+featlist-allvariants-component.css`  ·  **Lines:** 671  ·  **Bytes:** 26,242
- **Block type:** **CANONICAL THREE-TIER COMPONENT REBUILD (§6c v2).** L1–39 lays out a token-driven LAYER-1/LAYER-2 architecture in explicit prose: LAYER 1 = component-scoped root declares tokens once inside `:root .ts-list, :root .ts-list *, :root .ts-feat-list, :root .ts-feat-list *`; LAYER 2 = element rules consume tokens, variants override TOKENS only. Includes clamp icon engine, derivative-spacing chain (`--ts-feat-pad-base` → 4 derivative tokens), surface model via `--ts-this-bg` derivatives, auto-fit grid w/ no media queries. **This is the model for the rebuild.**
- **Tokens declared:** see grep — full LAYER-1 token surface at L56–158. Notable: icon ladder `--ts-feat-mult-xs/sm/md/lg/xl` (L63–71, values 0.35/0.8/0.9/1.10/1.25), `--ts-feat-icon-size: clamp(min, base*mult, max)` (L78–80), `--ts-feat-pad-base` derivative chain (L85–89), grid auto-fit `--ts-feat-col-min: 200px`, typography `--ts-feat-fs-base`/`-fs-scale`/`-fs`/`-title-fs`/`-title-weight: 600`/`-line-height`, surface `--ts-feat-surface`/`-bg`/`-bg-color`/`-bg-grad`/`-bg-grad-hover`/`-border`, color `--ts-feat-icon-color: var(--ts-accent)`/`-text`/`-title-color`, hover `--ts-feat-bg-hover`/`-border-hover`, accent-tint hover `--ts-feat-bg-hover-accent`/`-border-hover-accent`/`-icon-hover-accent`/`-text-hover-accent`, transition `--ts-feat-transition`. **Most importantly L139–158: REDECLARES `--ts-this-bg-border` and `--ts-this-bg-border-hover` using a custom `color-mix` recipe with `--ts-mix-perc` parameter (10% default, 7% in light theme variant) + `--ts-this-bg-grad-bright-pct: 6%`/`-dark-pct: 7%`.** This is THE custom-derivative-recipe specimen.
- **`--ts-bg-N` direct references:** L109 only — `--ts-feat-surface: var(--ts-this-bg-surface, var(--ts-bg-2))`. **1 direct reference, and it's a FALLBACK only.** Cleanest Rule 15 compliance in chunk 4b.
- **Selectors of interest:** `:root .ts-list, :root .ts-list *, :root .ts-feat-list, :root .ts-feat-list *, :root .ts-list *:after, :root .ts-feat-list *:before` (L47–52 — explicit substring-style enumeration limited to two component families, less bad than wildcard substring; still R-cascade-adjacent), `.ts-feat-list`, `.ts-feat-item`, `.ts-feat-icon`, `.ts-feat-item__title`, `.ts-list` BEM, `.ts-feat-list.ts-feat-cards` variant, `.ts-feat-list.hover-accent` variant, `.ts-feat-list.ts-feat-list--lg/--sm/--xl` size variants.
- **Keyframes:** none. **At-rules:** none.
- **Owner annotations VERBATIM (selected):** L2–39 the LAYER-1/LAYER-2 architecture brief (full quoted above); L169–215 `OWNER NOTES: GENERIC LIST VARIANT` (`<ul>` + `::before` icon variant explanation); L217–251 `REFACTOR NOTE: @ts-list-refactor` (cross-referenced tag); L254–262 `OWNER FIX NOTES: LIST ITEM CONTENT ISOLATION`; L262 `REFACTOR NOTE:`; L362 `OWNER NOTES: content box is neccesary here so the icon sizes properly with the padding nad the icon size without shrinking. keep it.`; L395 `OWNER NOTE:`; L437 `OWNER NOTE: deprecated`; L515 `OWNER REFACTOR FIX:`; L602 `OWNER NOTE. check what i did with the background  styling. i separated backgroudn color from image becuse i need to separat those properties in roder to be able to set the gradient styling from the rest of the default styling.`; L609 `REFACTOR NOTE: GLOBAL BACKGROUND IMAGE SYSTEM`.
- **Refactor flags:** (a) the LAYER-1 token block AT L47–159 contains **DOUBLE-DECLARED `--ts-feat-bg-hover` / `-border-hover` / `-bg-hover-accent` / `-border-hover-accent` / `-icon-hover-accent` / `-text-hover-accent` / `-transition` / `--ts-this-bg-border` / `--ts-mix-perc` / `--ts-this-bg-grad-bright-pct` / `--ts-this-bg-grad-dark-pct`** (L122–137 first, L144–157 second, with DIFFERENT values: hover-accent goes from `--ts-accent-bright`/`-border` to `--ts-accent-dim`/`-border`, mix-perc goes 10%→7%). Second wins — first declaration is dead code or evolution-in-progress; (b) the L47 `:root .ts-list, :root .ts-list *, …` distribution still pollutes the cascade (every descendant gets the token surface) — explicit `:is(.ts-list, .ts-feat-list) *` enumeration would be marginally cleaner; (c) variant overrides at L411–665 set `--ts-feat-icon-mult` and `--ts-feat-bg`/`-border` — correct LAYER-2 pattern; (d) `.ts-feat-list.hover-accent` (L642) sets `--ts-this-bg: var(--ts-accent-dim-2)` and propagates — exact surface-superposition contract; (e) the `--ts-feat-pad-base → -icon-pad → -icon-gap → -item-pad → -item-gap` chain (L85–89) is the canonical derivative-spacing pattern; (f) the deprecated variant at L437 (`OWNER NOTE: deprecated`) is still in the file — should be deleted.
- **Session 3/4 relationship:** **THIS IS THE TEMPLATE for every Session 4 component.** The LAYER-1/LAYER-2 architecture comment at L1–39 should be lifted verbatim into the `design-tokens-2.0` skill as the canonical example. The clamp-icon ladder + multiplier-override pattern (L63–80) is reusable. The `--ts-feat-pad-base` derivative chain is reusable. The `:root .ts-X, :root .ts-X *` scoped-distribution pattern (limited to the two component families) is the SOFTER alternative to wildcard substring — worth documenting as the rebuild's "scoped distribution" pattern when explicit `:is(...)` enumeration is impractical.
- **Gap vs `_code-audit-catalog.md`:** (a) `.ts-feat-list*`/`.ts-list*` in catalog §4.10. (b) NEW: the LAYER-1/LAYER-2 architecture brief is the most important undocumented design intelligence in chunk 4b; the double-declared LAYER-1 token block is undocumented; the custom `--ts-this-bg-border` recipe via `--ts-mix-perc` is a NEW derivative pattern not in `surfaces.css`. (c) No contradictions.

---

### ts-panel+root-debugger-component.css

- **Path:** `docs/references/toolskin.css_extracted-core-blocks-to-refactor/components/ts-panel+root-debugger-component.css`  ·  **Lines:** 1,091  ·  **Bytes:** 32,380
- **Block type:** Compound (panel + debugger + scoped select). See "Special case" section above for the split.
- **Tokens declared:** see grep. Panel scope (L9–22): `--ts-this-bg: var(--ts-bg-1)`, `--ts-panel-bg: var(--ts-this-bg)`, `--ts-panel-border: var(--ts-this-bg-border-hover)`. Nest-reduction (L75–90): `--ts-nest-radius: calc(var(--ts-card-radius) - (N * var(--ts-radius-nest-reduction)))`, `--ts-nest-pad: calc(var(--ts-card-pad, var(--ts-panel-pad)) - (N * var(--ts-pd-nest-reduction)))` for N=1 (single-nested) and N=2 (double-nested). `--ts-sb-size: 8px` scrollbar. Floating-panel variant at L159+. Debug-root scope (L301–500): `--ts--debug-root-offset-y: calc(var(--ts--btn-fixed-offset) + var(--ts-sp-2) + var(--ts-btn-h, 45px))`, `--ts--btn-fixed-offset: var(--ts-sp-5)`, btn-swatch privates `--_btn-swatch: #111214` (HARDCODED HEX), `--_btn-bg`, `--_btn-bg-grad`, `--_btn-bg-grad-hover`, `--_btn-border`, `--_btn-border-hover`, `--_btn-border-active`. Scoped select (L377–408): `--ts-ui-select-dd-min: 200px`, `--ts-ui-select-dd-runway: 15dvh`, `--ts-ui-select-dd-max-abs: 15dvh`, `--ts-ui-select-dd-max-rel: 10dvh`, `--ts-ui-select-dd-max-h: clamp(...)`, `--ts-shadow-accent: inset 0 0 0px 1px var(--ts-accent-border), 0 4px 15px color-mix(in srgb, var(--ts-accent-border-hover), transparent 79%)`, `--ts-select-item-bg`/`-hover`/`-active` derivative quartet, `--ts-input-border`/`-active` pair, `--ts-root-btn-h: calc(var(--ts-btn-h, 45px)*.65)`.
- **`--ts-bg-N` direct references:** L9, L398, L425, L468, L594 (`var(--ts-bg-1, #1a1b1e)`), L695, L879. **7 direct references including 1 hex fallback (`#1a1b1e`).** Also L102, L962 use `--ts-bg-4` inside `color-mix`.
- **At-rules:** `@property --ts-nest-radius` and `@property --ts-nest-pad` (L48, L55 — and DUPLICATED at L916, L923 because the file has the entire panel block declared twice).
- **Selectors of interest:** `.ts-panel, .ts-ui-panel` (L6–7, L877), nested `.ts-card .ts-card`/`.ts-panel .ts-panel`/cross combinations (L68–88, L936–951 — DUPLICATED), `.ts-panel__header`/`__title`/`__title strong`/`__header-actions`/`__body`/`__row`/`__group`/`__status`/`__status-item`/`__status-item i` BEM family, `.ts-panel--collapsed`/`--docked`/`--float`, `.ts-ui-panel.ts-ui-panel--collapsed`/`__header`/`__body`/`__status` parallel alias family, `#ts-debug-root` + `#ts-debug-root > .ts-btn` (L301–349, the dev-only widget), `#ts-debug-root [data-ts-panel]` (L363–500). **Critically:** `#ts-debug-root .ts-btn:hover/:focus` uses CSS Nesting (L339, the `&:hover,&:focus { … }` pattern — modern syntax).
- **Owner annotations VERBATIM:** L25–43 `§6d NEST-REDUCTION SYSTEM (NEW-B16)` explainer block; L282–299 `@refactor_note @owner_alias_addition / @ts-panel--refactor-plan / @ts-panel-expansion / @component-consolidation / # CLARIFICATION / # INTENT` — the panel/debugger unification plan; multiple `§6c PANELS` headers (L3, L874 — duplicated); `§6d` repeat. L1013 commented-out scrollbar `scrollbar-color: var(--ts-bg-5) transparent;*/` — legacy `--ts-bg-5` reference, dead.
- **Refactor flags:** (a) **ENTIRE PANEL BLOCK IS DUPLICATED** L6–280 ≈ L874–1091. Pure dead code in the second half — fixed by collapsing to one. The `@property` decls at L48/L55 are similarly duplicated at L916/L923; (b) `#ts-debug-root` is DEV-ONLY and should not ship in the production bundle; (c) the `.ts-ui-select` re-styling at L594–855 belongs in the select file, not the panel file; (d) `--_btn-swatch: #111214` (L315) — hardcoded debugger swatch, Rule 15 violation; (e) `--ts-this-bg-2-t: color-mix(in srgb, var(--ts-this-bg), transparent 12%)` (L596) — invents a new `-2-t` derivative variant at component scope rather than consuming the system layer; (f) `--ts--btn-fixed-offset` and `--ts--debug-root-offset-y` use the double-dash prefix anti-pattern; (g) the `revert-layer` use at L355 (`box-shadow: revert-layer`) and nested `&:hover,&:focus` syntax are the modern features in play.
- **Session 3/4 relationship:** The panel system is the proving ground for the §6d NEST-REDUCTION SYSTEM. Once the duplicate halves are merged and the debugger lifted to a separate dev-only file, what remains is a clean two-tier (panel base + nested-panel/nested-card variants) consumer of the surface chain. The `--ts-nest-radius`/`-pad` calc system is novel and should be documented in design-tokens-2.0 as the canonical pattern for visually-distinguishing nested instances of the same component.
- **Gap vs `_code-audit-catalog.md`:** (a) `.ts-panel*`/`.ts-ui-panel*`/`#ts-debug-root` in catalog §4.10. (b) NEW: the bit-identical duplication of the entire panel block is undocumented; the dev-only debugger lacks an explicit production-bundle exclusion; the `--_btn-swatch: #111214` hex literal is not in catalog; the `--ts-this-bg-2-t` invented derivative is not in catalog. (c) No contradictions.

---

### inputs-global-nested-design-pattern.css

- **Path:** `docs/references/toolskin.css_extracted-core-blocks-to-refactor/components/inputs-global-nested-design-pattern.css`  ·  **Lines:** 1,493  ·  **Bytes:** 38,203
- **Block type:** **THE CANONICAL "NESTED DESIGN PATTERN" REFERENCE (Rule 4).** See "Special case" section above. Multi-component blob: §6e inputs + §6f range slider + §6f.1 advanced range + §6g chips/tags + §6h tabs + §6i badges/status + §6j navigation + §6k modal/overlay + §6l tables stub.
- **Tokens declared:** see grep (massive). Private `--_input-*` quartet (L108–114), public `--ts-input-*` token surface, surface re-anchoring `--ts-this-bg: var(--ts-input-bg)` (L147, L170, L180, L185, L194, L204, L339, L352, L380, L383), range slider full token surface (L500–518), chips/tags scoped surface (L685–688), badges (L1025–1027), modal token surface L1239–1256 (`--ts-modal-surface`, `-surface-2`, `-surface-3`, `-bg`, `-border`, `-gap`, `-pad`, `-radius`, `-header-btn-h`, `-header-h: 40px`, `-header-fs: var(--ts-fs-h6)`), tab-pane (L893–894, L930–931).
- **`--ts-bg-N` direct references:** L130 (commented), L284, L335, L337 (commented), L350, L382 (commented), L383, L574 (commented), L678, L694, L838, L877, L881, L893, L894, L922 (commented), L930, L931, L949, L966, L985, L1203, L1239, L1240, L1241, L1266, L1286, L1298, L1468, L1491. **23 LIVE direct references + 6 commented-out** — second-highest after checkbox-radio.
- **Selectors of interest:** see grep. The §6g chips block at L660–780 is the cleanest specimen of token-driven variant routing. The §6k modal block at L1233–1340 uses scoped surfaces `--ts-modal-surface`/`-2`/`-3` derived from `--ts-bg-0`/`-1`/`-1-t`. Tab-pane variants at L893–966 show explicit `--ts-tab-pane-foreground-color`/`-background-color` per state.
- **Keyframes:** `ts-pulse` (L1139), `ts-pulse-2` (L1153), `ts-modal-in` (L1432). **At-rules:** `@property --ts-range-val` (L481 — registered for the gradient-fill % calc).
- **Hardcoded literals:** L293 `#191b22` (chip variant), L732 `#000000bd` (warning on-accent), L994 `#fff !important` (text-primary override in tab-pane), L1090 `#c084fc` (purple badge), L1095 `#67e8f9` (cyan badge). All within the badges/chips families.
- **Owner annotations VERBATIM (selected):** L1–97 the FULL REFACTOR NOTES block (ARCHITECTURE REORGANIZATION 3-scope plan, TOKENIZATION LAYERS 3-layer scheme: GLOBAL→COMPONENT→VARIANT, DISPLAY/VARIANT LOGIC, REFACTOR REQUIREMENTS, GOAL) — verbatim ABOVE in special case section; §-headers `§6f RANGE SLIDER` (L432), `§6f.1 ADVANCED RANGE SLIDER` (L478), `§6g CHIPS / TAGS` (L656), `§6h TABS` (L782), `§6i BADGES & STATUS INDICATORS` (L1004), `§6j NAVIGATION` (L1177), `§6k MODAL / OVERLAY` (L1233), `§6l TABLES` (L1453); structured `@refactor:backdrop-critical / glass-dependent / needs-solid-fallback / token-dependency` tag stack at modal scope (L1271–1274, L1288–1291, L1300–1303, L1312–1326).
- **Refactor flags:** (a) the file IS the canonical nested-design pattern but ITS OWN HEADER says it must be DEDUPED (L5–8 mentions "duplicated input-related blocks currently distributed in the cascade from ~line 6500"); (b) multiple `--ts-input-bg` declarations per scope (L130 commented, L284, L335, L350 — the "first-declaration-is-intent, last-wins" antipattern repeats); (c) hardcoded badge colors at L1090/L1095 break the apcach pipeline — `--ts-this-bg: #c084fc`/`#67e8f9` are inert against theme inversion; (d) L994 `--ts-text-primary: #fff !important` inside a tab-pane is a brutal cascade override — should derive from `--ts-on-surface` instead; (e) `@property --ts-range-val { syntax: "<number>"; inherits: true; initial-value: 0 }` (L481) is **the only registered property in this file** — gradient fill calc depends on it; should be moved to a central `@property` registration file in the rebuild.
- **Session 3/4 relationship:** This file IS the source-of-truth for the rebuild's surface-superposition contract. The 4-layer protocol (private `--_x` → public `--ts-input-*` → surface re-anchor `--ts-this-bg` → variant overrides) must be lifted verbatim into the `design-tokens-2.0` skill as the canonical Rule 4 reference. The §6g chips block (L660–780) is the shortest cleanest specimen.
- **Gap vs `_code-audit-catalog.md`:** (a) inputs/range/chips/tabs/badges/modal families in catalog §4.10. (b) NEW: the explicit 3-layer TOKENIZATION LAYERS scheme at L42–58 is the foundational design intelligence the rebuild MUST adopt; the 4-layer surface re-anchor protocol is undocumented; the `@property --ts-range-val` registration pattern is novel. (c) No contradictions.

---

### ts-card-flip-swipe-interactive-component.css  (and the bit-identical `…component2.css`)

- **Path:** `docs/references/toolskin.css_extracted-core-blocks-to-refactor/components/ts-card-flip-swipe-interactive-component.css`  ·  **Lines:** 1,392  ·  **Bytes:** 41,076
- **DUPLICATE NOTE:** `ts-card-flip-swipe-interactive-component2.css` is BIT-IDENTICAL (diff returns no output). Same line numbers, same tokens, same selectors. Treat as ONE file.
- **Block type:** Compound — §6b `.ts-card` base + §6q `.ts-flip-card` 3D + §6q.2 `.ts-swipe-card` non-3D + §6r `.ts-pricing-card` + a TEXT-SHADOW ENGINE (`--ts-shadow-*` ~20-token family at L1042–1119) + §6s `.ts-testimonial`.
- **Tokens declared:** card base (L5–13): `--ts-this-bg: var(--ts-bg-1)`, `--ts-card-bg: var(--ts-this-bg)`-equivalent, `--ts-card-pad: var(--ts-sp-8)`. `.ts-card.gradient` (L33–35): `--ts-card-bg: linear-gradient(180deg, var(--ts-bg-2) 0%, var(--ts-bg-1) 100%)`. Dashboard scope (L59–66): `--ts-dashboard-pad/-gap/-card-pad/-card-gap/-header-pad/-sidenav-pad/-body-pad/-body-gap`. Flip-card (L679–700): `--ts-flip-perspective: 1400px`, `--ts-flip-duration: 0.6s`, `--ts-flip-easing`, `--ts-flip-depth: 0px`, `--ts-flip-card-h: 320px`, `--ts-flip-card-pad/-gap`, `--ts-flip-border-w: 1px`, `--ts-flip-card-radius`, `--ts-flip-bg-front/-back/-grad/-grad-hover/-grad-back`, `--ts-flip-border/-border-hover/-bg-hover`. Swipe-card (L879–904): parallel `--ts-swipe-*` family with `--ts-swipe-card-h: 320px`, `--ts-swipe-duration: var(--ts-dur-slow, 300ms)`, `--ts-swipe-offset`, `--ts-swipe-bg-front: var(--ts-bg-2)`, `--ts-swipe-bg-back: var(--ts-bg-3)`. **TEXT-SHADOW ENGINE (L1042–1219):** `--ts-shadow-color-a`/`-b` (A/B color system), `--ts-shadow-scale-factor: 0.16`, `--ts-shadow-depth: calc(1em * scale-factor)`, `--ts-shadow-steps: 15`, `--ts-shadow-angle-x/-y: 1`, `--ts-shadow-step` derivative, `--ts-shadow-color-base` (75/25 mix of A/B), `--ts-shadow-contrast-strength: 0.23`, `--ts-shadow-color` (color-mix to black), `--ts-shadow-soft-accent`/`-soft`, the FINAL `--ts-shadow` 6-step+soft-tail composite text-shadow value, plus presets `--ts-shadow-depth-{xs,sm,md,lg,xl}` (0.02 → 0.1), `--ts-shadow-steps-{low,mid,high}` (4 → 10), `--ts-shadow-contrast-{soft,normal,strong}` (0.1 → 0.28). Then utility classes `.ts-shadow-{xs,sm,md,lg,xl}` / `-{low,mid,high}` / `-{br,bl,tr,tl}` / `-{soft,normal,strong}` / `-{accent,surface}` apply via single token override.
- **`--ts-bg-N` direct references:** L5, L34–35, L49, L92, L122, L203, L250, L327, L348, L362, L691–692, L895–896, L1243, L1252, L1349. **17 direct references** (live; +0 commented).
- **At-rules:** 3× `@property` registrations (L307 `--shadow-blur`, L313 `--shadow-offset`, L319 `--shadow-opacity` — namespace violation, should be `--ts-shadow-*`).
- **Selectors of interest:** `.ts-card`, `.ts-card.gradient`, `.ts-dashboard *`, `.ts-flip-card`, `.ts-flip-card__inner`, `.ts-flip-card__front`/`__back`, `.ts-flip-card--flipped`, `.ts-card.ts-flip-card` (variant compound), `.ts-flip-card .ts-btn`, `.ts-swipe-card`, `.ts-swipe-card__inner`/`__front`/`__back`, `.ts-swipe-card--vertical`, `.ts-swipe-card--swiped`, `.ts-swipe-card--vertical:hover .ts-swipe-card__back`, `.ts-pricing-card`, `.ts-pricing-card--featured`, `.ts-pricing-card__price`, `.ts-testimonial`, `.ts-shadow-*` utility family.
- **Owner annotations VERBATIM (selected):** §6b CARDS header L2; §6d NEW-B16 nest-radius comment L6–8; **L607–676 the §6q OWNER REFACTOR FIXES brief** — confirms the flip-card system is fully tokenized and exemplary, ships the canonical HTML structure inside the comment block; **L746–747 REFACTOR NOTE + #CRAZY_FIX_RULES on the 3D drop-shadow** — the `::before` shadow at L749+ works but needs to become a token-controlled helper class; L1030 `END OF UPDATED REFACTORED SWIPE AND FLIP CARDS TOKENIZED`; L1032 the TEXT SHADOW ENGINE banner with explicit feature checklist (✔ Token-driven, ✔ A/B color system, ✔ Font-scale aware, ✔ No invalid CSS, ✔ Safe color pipeline — no fragile `oklch(from)`).
- **Refactor flags:** (a) the entire 41KB file exists TWICE on disk; (b) `@property --shadow-blur`/`--shadow-offset`/`--shadow-opacity` (L307–325) drop the `--ts-` namespace prefix — must rename; (c) **the text-shadow engine declares its tokens at `:root` (L1042+)** — this is a COMPONENT file declaring root-level tokens, breaks the file-boundary discipline; should be lifted to `system/typography.css` or similar; (d) `--ts-flip-bg-front: var(--ts-bg-1-t)`/`--ts-flip-bg-back: var(--ts-bg-2-t)` are Rule 15 — should derive from `--ts-this-bg-dim`/`-dim-2`; (e) `.ts-card.gradient` (L20–43) declares `transition` then immediately re-declares it with `!important` at L31 — dead first declaration; (f) L36 commented-out `mask: linear-gradient(...)` and L39–42 commented-out `box-shadow: rgba(0,0,0,0.05)...` are dead but signal previous design attempts; (g) `--ts-text-muted: color-mix(in srgb, currentcolor, var(--ts-text-primary) 40%) !important` (L946, L962) overrides text-muted from within a card variant — leaks; (h) `.ts-pricing-card { --ts-card-bg: var(--ts-this-bg-grad-4) }` (L1244) — `--ts-this-bg-grad-4` may not exist (verify against surfaces.css).
- **Session 3/4 relationship:** The flip+swipe cards ARE the success case the owner cites at L613–622: *"This component has been refactored and fully tokenized. No further changes have been required in this area so far. This section demonstrates a clear, step-by-step refactoring process: Defining tokens, Applying and distributing them across the component, Minimizing CSS declarations by relying primarily on token values, Driving all states and variants through tokens instead of hardcoded rules. This serves as a reference implementation for systematic refactoring within the design system."* The text-shadow engine is similarly self-contained and proves the rebuild can do composite-token engines. Lift both as exemplars. Delete the `…component2.css` duplicate.
- **Gap vs `_code-audit-catalog.md`:** (a) `.ts-flip-card*`/`.ts-swipe-card*`/`.ts-pricing-card*`/`.ts-card*` in catalog §4.10. (b) NEW: the bit-identical second file copy is undocumented; the text-shadow engine A/B color system + utility-class composition is novel design intelligence; the @property namespace violation is undocumented; the L613–622 owner exemplar declaration is undocumented. (c) No contradictions.

---

### ts-ui-select-variants(disordered).css

- **Path:** `docs/references/toolskin.css_extracted-core-blocks-to-refactor/components/ts-ui-select-variants(disordered).css`  ·  **Lines:** 1,470  ·  **Bytes:** 44,097
- **Block type:** Dropdown/select compound — see "Special case" section. Multiple variants (icon picker, font picker, search overlay, banner-generator scope, card-half scope).
- **Tokens declared:** see grep. Dropdown scope (L68–75): same `--ts-shadow-accent`/`--ts-input-color`/`-hover`/`--ts-select-item-bg`/`-hover`/`-active`/`--ts-input-border`/`-active` quartet seen elsewhere. Icon-dd-list (L91, L98, L136): `--ts-this-bg: var(--ts-bg-0)` (3× redeclaration). Trigger (L312–340): `--ts-ui-select-trigger-min-height: 2.75rem`, `--ts-this-bg: var(--ts-bg-1-t)`, `--ts-input-bg-grad: var(--ts-accent-glow-bg-2)`, `--ts-input-border: color-mix(in srgb, var(--ts-input-color), transparent 80%)`. State variants (L394–418): `--ts-input-color: var(--ts-text-primary-dim)`, `--ts-input-color: var(--ts-text-accent)` for active. Accent-shadow override (L432–437): `--ts-input-border: var(--ts-accent-border)`, `--ts-shadow-3: var(--ts-shadow-accent)`. Hover/active variants L731–812. Scrollbar (L524, L530): `--ts-ui-scrollbar-size: 6px/7px`. Font selector scope (L682): `--ts-this-bg: #47474720` (HARDCODED HEX + alpha). Banner-generator app scope (L1188–1215): `--ts-input-color`/`-active`/`-bg`/`-border` overrides w/ `--ts-this-bg: var(--ts-accent-glow-bg-2)`/`--ts-this-bg: var(--ts-accent)`. Icon sizing (L1284–1304): `--ts-input-icon-pad/-icon-size/-icon-fs` derivative chain.
- **`--ts-bg-N` direct references:** L91, L98, L136, L265 (commented), L336, L341 (fallback only), L418, L497, L579, L634 (commented), L831, L843, L1191, L1353, L1439. **13 LIVE + 2 commented.**
- **Selectors of interest:** `.ts-ui-select__dropdown, .ts-icon-dd-list` (L54, the inelegant union), `.ts-icon-dd-list` standalone (L78), `.ts-ui-select .ts-ui-select__list` (L96), `.ts-ui-select[data-ts-ui-select-placeholder*="fonts"] .ts-ui-select__option` (L118 — the FONT VARIANT distinguished by data-attr substring), `.ts-icon-dd-list .ts-icon-option`, `.ts-card .ts-ui-select .ts-ui-select__option`, `.ts-ui-select__option:hover/--selected`, `.ts-banner-generator-app .ts-card:has(.ts-ui-select--open, .ts-icon-dd-list.open)` (L178), `.ts-icon-selected-row.ts-fullselector-wrapper` (L1060+), state classes `.ts-ui-select--open`, hover, `.ts-ui-select__option--selected`, `.ts-ui-select__trigger`.
- **Keyframes:** none. **At-rules:** none.
- **Hardcoded literals:** L682 `#47474720` (font-picker dark-tint).
- **Owner annotations VERBATIM (selected):** L9 `@ts-component-consolidate`; L10–53 the SCOPE CONSOLIDATION brief (Hoist tokens to `.ts-ui-select` root); L134, L174, L182, L189 `@ts-component-consolidate` repeats with prose; L204 `@ts-component-exception`; L206–271 CRITICAL LAYOUT OVERRIDE — DO NOT CONSOLIDATE; L616–637 REFACTOR NOTES AND HIGHLIGHTS (4× repeat "Tokens that needs to be centralized"); **L679 #NEW REFACTOR NOTES: "Lush Mode"** — proposes a new global styling mode that enables background-images for inputs that already have `--ts-this-bg` set; L727 OWNER FIXES & AUDIT (definitive state/color solving in single nested blocks); L857–1058 the ICON SELECTOR full refactor brief; L1057 `NEW NOTE: PLESE GREP THE  BLOCK FOUND  BY SEARCHING FOR @consolidate_select_component` — owner-instituted grep tag; L1195 `#CRAZY_FIX_RULES`; L1257 `@ts-component-consolidate`; L1262 CRITICAL duplication note; L1319 REMOVE CASCADE ABUSE (CRITICAL); **L1453 `#CRAZY_FIX_RULES: added a hardcoded css placehoplder replacement for the icon when theresno icon selected. this should be done with js instead of this.`**
- **Refactor flags:** (a) the file is owner-acknowledged-disordered; see "Special case" section for the 7-step reorg plan; (b) `--ts-this-bg: var(--ts-bg-0)` declared 3× in 50 lines (L91/L98/L136) — extreme redundancy; (c) `#47474720` font-selector tint is hardcoded; (d) **the `[data-ts-ui-select-placeholder*="fonts"]` selector** (L118) uses substring matching on a data-attribute to identify the font variant — should be a clean modifier class `.ts-ui-select--font-picker`; (e) the L857–1058 ICON SELECTOR refactor brief explicitly enumerates 7 things to fix — should be the rebuild's select-component checklist; (f) the L1453 `#CRAZY_FIX_RULES` icon-placeholder hack should move to JS; (g) the `.ts-banner-generator-app .ts-card:has(.ts-ui-select--open, .ts-icon-dd-list.open) { z-index: 200 !important; backdrop-filter: none !important; }` (L178) is a z-index escape hatch that the owner annotates "this fix is already aknowledged and needs to eprsist."
- **Session 3/4 relationship:** select system is the chunk's largest active refactor target. The L857–1058 refactor brief should drive the Session 4+ select sandbox. The `--ts-ui-select-trigger-min-height` JS-coupled token (L312) is the model for JS-driven sizing.
- **Gap vs `_code-audit-catalog.md`:** (a) `.ts-ui-select*` in catalog §4.10. (b) NEW: the "Lush Mode" proposal at L679 is design intelligence not in catalog; the `@consolidate_select_component` grep tag is novel; the L1453 JS-replacement candidate is undocumented. (c) No contradictions.

---

### headermenu-topnav-fixednav-mobilemenu-sidebarnav.css

- **Path:** `docs/references/toolskin.css_extracted-core-blocks-to-refactor/components/headermenu-topnav-fixednav-mobilemenu-sidebarnav.css`  ·  **Lines:** 2,544  ·  **Bytes:** 86,627
- **Block type:** 5-component compound (top-nav / fixed-nav / mobile-menu / sidebar-nav / header-menu-burger) + 2 floating UI helpers — see "headermenu split" section above for the per-component breakdown, shared vs private tokens, and structural facts.
- **Tokens declared:** see grep (massive). Shared at L19–219 (the token cartel), per-component overrides scattered, sidebar-private at L2261+, mobile-menu at L1188+.
- **`--ts-bg-N` direct references:** L1564, L1807, L1839, L2020, L2369 (`--ts-this-bg-hover`), L2437 (commented), L2542. **6 live direct references** — astonishingly low given the file size; the token cartel does most of the work via `--ts-this-bg: var(--ts-bg-body)`.
- **At-rules:** 3× `@media`: `min-width: 867px` (L1821), `max-width: 868px` (L1964 — the strict-less-than vs strict-greater-than hairline split is deliberate), `max-width: 420px` (L2232).
- **Selectors of interest:** see headermenu split. Substring-distribution at L19–29 is the major R-cascade pattern that must be rewritten. The 4× `:has(button.ts-menu-burger.active)` cascades coordinate burger-open state across siblings.
- **Hardcoded literals:** L369 `rgba(0, 0, 0, 0.1)` — ONE literal in 86KB. Excellent.
- **Owner annotations VERBATIM (the 16 load-bearing ones):**
  - L1–9 `@implementation_note#3` — 7-point header-system wishlist (transparent header w/ scrollspy, mobile-menu activation flexibility variable, duplicate icons script bug, auto-inject icon fallback expansion, custom logo brand uploadable, mobile-only / floating-sidebar layout MUST-HAVE, ul>li>ul sub-nav structure).
  - L10 `REFACTOR NOTE crucial: WE NEED TO ALLOCATE THESE CLASSES TO THE SPECIFIC SCOPE OF THE NA TOPNAV, …` — the substring-distribution performance complaint.
  - L11–18 `Docs: nav typography & sizing chain (B23 R-NAV Phase B)` — the documented sizing chain incl. `--ts-topbar-h 58px`, `--ts-fs-base 0.7rem`, `--ts-nav-btn-h ≈ 41.4px @ 65px topbar`.
  - L35–47, L55, L59–61, L214, L217 — `B23 R-NAV Phase B / R3.5 / Wave 2 / R-CLEANUP-1` build-log cross-references.
  - L48 `OWNER FIXES: now the button heigh is working right with this local calculation using the multiplier padding type and adjusting the mult value a bit. this should be re analyzed and centralized.`
  - L93–123 `REFACTOR NOTE crucial: NAVLINK CONTROL TOKENS — Sizing Constraints & Select Behavior` — explains `--ts-navlink-btn-max-h` constraint-vs-natural-sizing trade.
  - L128–145 `REFACTOR NOTE crucial: --ts-navlink-select-min-w` — 3x button-height multiplier is arbitrary.
  - L151–185 `REFACTOR NOTE crucial: --ts-navlink-select-max-w` — 4x multiplier causes text truncation; recommends clamp(12ch, 20ch, 28ch) (now applied at L187).
  - L246 `#CRAZY_FIX rule must be removed once the design system functions properly`.
  - L668–700 `#CRAZY_FIXES_CODE` blocks.
  - L1029 `#CRAZY_FIX_RULES: if we w ant to add backghround colors to the items on other states`.
  - L1132–1149 the CRITICAL REFACTORING + `@refactor:backdrop-critical/glass-dependent/needs-solid-fallback/token-dependency/container-review` 5-tag stack.
  - L1358 `#OWNER FIX UPGRADES — Header Select Integration`.
  - L1419 `REFACTOR NOTE crucial from the root variable declared for this. we need to organize the css styles. his rule fixed partially the width of the select.`
  - L1794–1802 REFACTOR NOTES (icon sizing pure overrides, fragile).
  - L1967–1992 REFACTOR NOTE (mobile/desktop menu transition is heavily patched; mark as global refactoring rule).
  - L1985 the meta-observation: "We need a more robust strategy to support button components within the header without breaking them, as they have already required multiple patches and workarounds (marked as #CRAZY_FIX_RULES across the stylesheet)."
  - L2001–2007 `#CRAZY_FIX_RULES`.
  - L2046 `#CRAZY_FIX_RULES`.
  - L2196–2214 `#CRAZY_FIX_RULES: This has been defined multiple times, so we need a single general rule` — the burger-open coordinated-cascade requirements.
  - L2499–2524 OWNER FIX & REFACTOR NOTES — the nested asset-scoped token-driven approach with surface mixing for theme-consistent results.
- **Refactor flags:** (a) the L19–29 substring-distribution selector is R-cascade and HAS to be rewritten to explicit `:is(.ts-modal, .ts-topbar, .ts-footer, .ts-mobile-menu, .ts-nav-static, .ts-nav-fixed)` enumeration (note: NOT `:where(...)` because we DO want specificity); (b) `--ts--btn-fixed-offset` and `--ts--debug-root-offset-y` (double-dash prefix) violate namespace; (c) the file confesses to multiple `#CRAZY_FIX_RULES` patches around floating-buttons + burger + mobile-desktop transition — these must be REBUILT, not migrated; (d) `--ts-fs-base: 0.68rem` (L39) hand-tuned per nav scope — this is the Wave 1.6 ladder-recomputation pattern (Resolution #1: keep the math, override only the base); (e) sidebar-nav at L2253+ uses CSS Nesting heavily — modern syntax, ensure consumers support it; (f) **`--base-size: 100dvw` (L2262) is a non-`--ts-` namespaced token** — flag for prefix or removal; (g) the `body:has(aside.ts-sidebar-menu.ts-ui-panel:not(.fixed)):not(:has(.ts-showcase,.ts-wireframe))` (L2253) is the most complex single selector in the chunk — five `:has()` and `:not()` clauses combined.
- **Session 3/4 relationship:** **ALWAYS STRICT autonomy tier** (layout component). The file is a 5-component compound that should be SPLIT into 5 sandbox files in the rebuild — DO NOT migrate as one block. The 1-literal-in-86KB stat shows the apcach pipeline IS working for the nav system; the cascade strategy (substring-distribution) is the violation, not the token discipline.
- **Gap vs `_code-audit-catalog.md`:** (a) `.ts-nav-fixed*`/`.ts-mobile-menu*`/`.ts-menu-burger*`/`.ts-sidebar-menu*` in catalog §4.10. (b) NEW: the 7-point `@implementation_note#3` wishlist at L1–9 is the rebuild's nav-system spec; the B23 R-NAV build-log cross-references at L11–18/L35–47 are novel provenance; the sidebar-nav grid-push (vs overlay) layout at L2253+ is the "must-have alternative layout" called for in the wishlist; the `@refactor:backdrop-critical/...` 5-tag system is reused here. (c) No contradictions.

---

## Annotation index

### Section header markers (§ numbering)
- inputs-global-nested-design-pattern.css: §6f RANGE SLIDER (L432), §6f.1 ADVANCED RANGE SLIDER (L478), §6g CHIPS / TAGS (L656), §6h TABS (L782), §6i BADGES & STATUS INDICATORS (L1004), §6j NAVIGATION (L1177), §6k MODAL / OVERLAY (L1233), §6l TABLES (L1453)
- ts-panel+root-debugger-component.css: §6c PANELS (L3, L874), §6d NEST-REDUCTION SYSTEM (L25, L893)
- ts-card-flip-swipe-interactive-component.css: §6b CARDS (L2), §6q Universal 3D Flip Cards (L608), §6q.2 SWIPE CARD VARIANT (L877), §6r PRICING CARDS (L1032), §6s TESTIMONIAL BLOCK (L1344)
- iconlist+featlist-allvariants-component.css: §6c FEATURE LIST + LIST COMPONENT v2 (L2)

### CRAZY_FIX_RULES markers in chunk 4b
- headermenu: L246, L668, L686, L837, L1029, L1041, L1053, L1101, L1166, L1195, L2001, L2046, L2196 (**13 occurrences in headermenu alone**)
- ts-ui-select-variants(disordered): L910 ("CRAZY_FIX_RULES" in brief), L1195, L1453

### CRITICAL / REFACTOR NOTE / OWNER FIX markers (selected, chunk 4b)
- headermenu: 16 distinct blocks (see file entry above)
- ts-ui-select-variants(disordered): 9 distinct blocks (see file entry)
- iconlist+featlist-allvariants-component: 9 distinct blocks (LAYER-1/LAYER-2 brief, GENERIC LIST VARIANT, list-refactor, LIST ITEM CONTENT ISOLATION, content-box necessity, deprecated variant, OWNER REFACTOR FIX, background styling separation, GLOBAL BACKGROUND IMAGE SYSTEM)
- inputs-global-nested-design-pattern: 1 large block (L1–97 REFACTOR NOTES INPUTS BASE SYSTEM)
- ts-card-flip-swipe-interactive-component: 4 blocks (§6q owner refactor exemplar L607–676, REFACTOR NOTES 3D drop-shadow L746–747, TEXT SHADOW ENGINE banner L1032+, END OF UPDATED REFACTORED L1030)
- ts-panel+root-debugger-component: 1 large block (L282–299 panel-debugger unification plan)
- ts-checkbox-radio: 1 block (L3–25 dedupe brief)
- footer-component: NONE explicit
- ts-patterns: NONE
- ts-masonry: 1 (L372 HARDFIXES TEMPORARY annotation)

### `@refactor:*` structured machine-readable tags (chunk 4b)
- ts-checkbox-radio:L766–769 (4-tag stack on light-theme bulk-bar)
- inputs-global-nested-design-pattern:L1271–1274, L1288–1291, L1300–1303, L1312–1326 (4-tag stack repeated 4× on modal-scope rules)
- ts-card-flip-swipe-interactive-component:L373–374 (2-tag stack on `.ts-card.gradient`)
- ts-ui-select-variants(disordered):L66–67, L89–90, L626–629, L1174–1177 (2 to 4-tag stacks)
- headermenu:L379–382, L525–530, L1145–1149, L1199–1204 (5-tag stack INCLUDING `container-review`)

### `@ts-*` structured tags
- ts-panel+root-debugger-component:L282 `@refactor_note @owner_alias_addition @ts-panel--refactor-plan @ts-panel-expansion @component-consolidation`
- ts-ui-select-variants(disordered):L9/L134/L174/L182/L189/L857/L1257 `@ts-component-consolidate`; L204 `@ts-component-exception`; L1057 `@consolidate_select_component` (owner-instituted grep tag)
- ts-checkbox-radio:L1 `@ts-inputs-refactor-dedupe #START_DEDUPE`
- inputs-global-nested-design-pattern:L7 `@ts-inputs-refactor-dedupe`
- iconlist+featlist-allvariants:L217 `@ts-list-refactor`

### `@implementation_note` / `@perf` / other tags
- headermenu:L1 `@implementation_note#3` (7-point wishlist)
- headermenu:L11 build-log cross-references (`B23 R-NAV Phase B`, `R3.5 batch entries`, `R-CLEANUP-1`)

---

## Cross-chunk synthesis

### Running `--ts-bg-N` direct-reference count (CHUNK 4b CONTRIBUTION)

| File | Direct refs (live) | Notes |
|---|---|---|
| ts-masonry+layout-priitives | 2 | L26, L619 |
| footer-component | 17 | includes REDECLARATION of `--ts-bg-1` and `--ts-bg-2` at component scope (L662, L831) |
| ts-checkbox-radio | 28 | asymmetric light-vs-dark hex problem |
| ts-patterns | 3 | L326, L342, L378 |
| iconlist+featlist | 1 | fallback-only at L109 — **cleanest in chunk** |
| ts-panel+root-debugger | 7 | includes hex fallback `#1a1b1e` and dev-only `#111214` |
| inputs-global-nested-design-pattern | 23 | + 6 commented-out |
| ts-card-flip-swipe-interactive (counted ONCE; #2 is a duplicate) | 17 | |
| ts-ui-select-variants(disordered) | 13 | + 2 commented-out + 1 hex `#47474720` |
| headermenu-topnav-…-sidebarnav | 6 | + 1 commented-out — **astonishingly clean for 86KB** |
| **TOTAL CHUNK 4b** | **117 live direct references** | (+8 commented-out; +1 from card-flip duplicate if double-counted = 134) |

Combined with chunk 4a's ~25 violations, the COMPONENTS folder contributes ~142 Rule 15 / R-rule-15 violations. The `inputs-global` + `ts-checkbox-radio` + `footer-component` + `ts-card-flip` files alone account for 85 of them (60%) — these are the priority refactor targets.

### Files with declared-and-redeclared `--ts-bg-N` primitives at component scope (most severe)
- **footer-component.css:L662** `--ts-bg-2: #ffffff14` (light-theme footer-dark variant primitive REDECLARATION)
- **footer-component.css:L831** `--ts-bg-1: var(--ts-this-bg-dim-4)` (REVERSE derivative — sets a primitive FROM a derivative; architectural inversion)
- These are the only files in BOTH chunk 4a AND 4b that redeclare primitives at component scope. **PRIORITY P0 fix.**

### Hardcoded color literals in chunk 4b (color-mix and standalone)
- ts-panel+root-debugger:L315 `#111214` (dev-only debug-btn swatch), L594 `#1a1b1e` (fallback)
- ts-checkbox-radio:L499/L524 `#ffffff` (in color-mix for accent-border), L788 `#ffffff` (in color-mix), L790 `#000000` (in color-mix), L803 `#1a1a1a` (in color-mix)
- ts-patterns:L71 `#ff540a` (accent fallback in `var(--ts-accent, #ff540a)`)
- ts-ui-select-variants(disordered):L682 `#47474720` (font-picker tint)
- inputs-global-nested-design-pattern:L293 `#191b22` (chip variant fallback), L732 `#000000bd` (warning on-accent), L994 `#fff !important`, L1090 `#c084fc` (purple badge), L1095 `#67e8f9` (cyan badge)
- footer-component:L657 `#08090c`, L658 `rgb(255 255 255 / 8%)`, L659 `#f2f3f7`, L660 `white`, L661 `#6f6f6f`, L662 `#ffffff14`, L769 `#08090c`, L773 `rgba(255, 255, 255, 0.05)`, L790 `#f2f3f78a`, L857 `#f2f3f7` (deep-dark footer-dark variant — 10 literals)
- headermenu:L369 `rgba(0, 0, 0, 0.1)` (ONE literal in 86KB — exemplary OKLCH compliance)
- ts-card-flip:L946/L962 inside `color-mix(in srgb, currentcolor, var(--ts-text-primary) 40%) !important` — no hex but `currentcolor` short-circuit
- ts-masonry: none (clean)
- iconlist+featlist: none (clean)

### Files that touch `--ts-this-bg` derivatives correctly (GOOD specimens, chunk 4b)
- **iconlist+featlist-allvariants** — declares its OWN derivative `--ts-this-bg-border` recipe via `--ts-mix-perc` parameter — sub-derivative innovation
- **inputs-global-nested-design-pattern** — 23 surface re-anchorings via `--ts-this-bg: var(--ts-input-bg)` pattern is the canonical Rule 4 reference
- **ts-card-flip-swipe-interactive** — `--ts-flip-bg`/`--ts-swipe-bg` chains all derive from `--ts-this-bg-dim`/`-grad`/`-border` family
- **headermenu** — entire 86KB compound uses `--ts-this-bg: var(--ts-bg-body)` once and everything derives — exemplary token discipline (cascade discipline is the violation, not token discipline)
- **ts-panel+root-debugger** — panel system uses derivatives correctly; debugger introduces hex literals
- **ts-checkbox-radio** — uses `--ts-this-bg: var(--ts-bg-3)`/`--ts-bg-2-t`/`--ts-bg-4-t` then derives — pattern OK but the source primitives are Rule 15 violations

### Files using CSS Nesting (`&` or nested selectors) in chunk 4b
- headermenu:L2253–2496 (sidebar-nav block — extensive native CSS nesting), L2447 (`&:hover`), L2374 (`&:hover` inside option), L2313 (`&:has(.ts-ui-select--open)`), L2379 (`&:not(:last-child)`), L1953 (`.ts-nav-fixed:has(.ts-menu-burger.active) { .ts-theme-toggle, .theme-toggle, .ts-topbar__logo { ... } }`)
- ts-panel+root-debugger:L339 (`&:hover,&:focus` inside debug-btn)
- ts-card-flip-swipe-interactive: none material

### Files using modern features (2024–2026) in chunk 4b
- **Container queries:** ts-masonry (L74/L80/L86 — `container-name: ts-masonry`)
- **@property registration:** inputs-global (L481 `--ts-range-val`), ts-panel+root-debugger (L48/L55 `--ts-nest-radius`/`--ts-nest-pad`, duplicated L916/L923), ts-card-flip-swipe (L307/L313/L319 `--shadow-blur`/`--shadow-offset`/`--shadow-opacity` — namespace violation)
- **`:has()`:** headermenu (extensive — burger-active cascades, sidebar-menu body grid trigger), inputs-global (modal-input has), ts-ui-select-variants(disordered) (z-index escape hatch L178), ts-panel+root-debugger (L142, L350)
- **`revert-layer`:** ts-panel+root-debugger:L355
- **CSS Nesting (native):** see above
- **`allow-discrete`/`@starting-style`:** ts-panel+root-debugger:L278 (`transition: display .5ms allow-discrete, opacity .3ms`)
- **`color-mix(in srgb, …)`:** ubiquitous (all 11 files); modal-srgb-mix recipes drive the entire surface chain
- **`:where()` (zero-specificity selector):** inputs-global:L138, headermenu (none material)
- **`@container ts-masonry`:** ts-masonry only

### Real bugs surfaced in chunk 4b (silent rendering / parser failures)
1. **ts-card-flip-swipe-interactive-component.css** AND ts-card-flip-swipe-interactive-component2.css are bit-identical duplicates — wasted disk + risk of divergent edits.
2. **footer-component.css:L831** — `--ts-bg-1: var(--ts-this-bg-dim-4)` REDEFINES a primitive token using a system-layer derivative. Catastrophic architectural inversion.
3. **footer-component.css:L662** — `--ts-bg-2: #ffffff14` REDEFINES a primitive at component scope. Same problem.
4. **ts-patterns.css:L88/L92** — `--ts-pattern-scale: max(1, 0.5)` and `max(1, 0.75)` are NO-OPS (max always returns 1).
5. **ts-panel+root-debugger-component.css** — ENTIRE PANEL BLOCK DUPLICATED L6–280 ≈ L874–1091; `@property` declarations duplicated L48/L55 ≈ L916/L923.
6. **ts-card-flip-swipe-interactive:L307/L313/L319** — `@property --shadow-blur`/`--shadow-offset`/`--shadow-opacity` drop `--ts-` namespace prefix.
7. **iconlist+featlist-allvariants:L122–158** — LAYER-1 hover-accent token quartet declared TWICE with different values (`--ts-accent-bright`/`-border` then `--ts-accent-dim`/`-border`). Second wins.
8. **inputs-global-nested-design-pattern:L284/L335/L350** — `--ts-input-bg` declared multiple times in the same scope.
9. **ts-ui-select-variants(disordered):L91/L98/L136** — `--ts-this-bg: var(--ts-bg-0)` declared 3× in 50 lines.
10. **ts-checkbox-radio:L72** — `border-radius: var(--ts-radius-xss, 3px) !important` — `--ts-radius-xss` is not in canonical ladder (4/6/8/10/16); likely typo for `--ts-radius-xs`.
11. **headermenu:L19–29** — substring-distribution `:root .ts-modal, :root .ts-modal *, …` declares the entire nav token cartel on every descendant of every nav family. Performance + R-cascade violation. Owner explicitly complains at L10.
12. **ts-ui-select-variants(disordered):L1453** — `#CRAZY_FIX_RULES` icon-placeholder rendered via `::after` content hack; owner notes "this should be done with js instead of this."

### NEW design intelligence to lift into permanent skill references (chunk 4b)

1. **The 3-LAYER TOKENIZATION scheme from inputs-global L42–58** — `1. GLOBAL TOKENS (shared) → 2. COMPONENT TOKENS (asset-level) → 3. VARIANT TOKENS (local)`. This is the canonical Toolskin token hierarchy and should be the opening paragraph of design-tokens-2.0. The 3-scope ARCHITECTURE REORGANIZATION at L20–38 (ROOT/GLOBAL → ASSET → IMPLEMENTATION TYPE) is the file-organisation pattern.
2. **The 4-LAYER NESTED DESIGN PATTERN from inputs-global** — `private --_x → public --ts-input-* → surface re-anchor --ts-this-bg → variant overrides cascade automatically`. The §6g chips block (L660–780) is the shortest specimen. Lift verbatim as the Rule 4 surface-superposition canonical reference.
3. **The LAYER-1/LAYER-2 architecture brief from iconlist+featlist L1–39** — "LAYER 1 declares tokens ONCE in component-scoped root, LAYER 2 element rules consume tokens, variants override TOKENS only, never redeclare properties." This is the rebuild's per-component file template.
4. **The CLAMP ICON ENGINE from iconlist+featlist L63–80** — `--ts-feat-icon-base × --ts-feat-icon-mult` ladder (xs=0.35, sm=0.8, md=0.9, lg=1.10, xl=1.25) inside `clamp(min, base*mult, max)`. Variants override ONLY `--ts-feat-icon-mult`. Reusable for any sized-element family.
5. **The DERIVATIVE SPACING CHAIN from iconlist+featlist L85–89** — `--ts-feat-pad-base → -icon-pad (×0.98) → -icon-gap (-icon-pad×0.75) → -item-pad (-icon-pad×0.75) → -item-gap (-item-pad×0.5)`. Override one root, the rest rescales. Canonical pattern.
6. **The §6d NEST-REDUCTION SYSTEM from ts-panel L25–43, L48–55** — `@property --ts-nest-radius` / `--ts-nest-pad` registered as `<length>` so calc()s of `(var(--ts-card-radius) - N * var(--ts-radius-nest-reduction))` actually interpolate. Lift as the canonical pattern for visually-distinguishing nested instances of the same component.
7. **The TEXT-SHADOW A/B COLOR ENGINE from ts-card-flip L1042–1219** — A/B color inputs, font-aware scaling (`calc(1em * --ts-shadow-scale-factor)`), step-count + angle direction + contrast strength, composite final `--ts-shadow` value, utility classes (`.ts-shadow-{xs|sm|md|lg|xl}` / `-{low|mid|high}` / `-{br|bl|tr|tl}` / `-{soft|normal|strong}`) compose. Proves the rebuild can do multi-axis composite-token engines without fragile `oklch(from)`.
8. **The custom `--ts-this-bg-border` recipe via `--ts-mix-perc` from iconlist+featlist L139–158** — components can extend the surface-derivative chain by REDEFINING `--ts-this-bg-border` with a custom mixing percentage (`var(--ts-mix-perc)`). Light theme uses 7%, dark uses 10%. Engine-mediated per-theme variation without per-theme hardcoded values.
9. **The Tokenization-knobs-plus-formula-in-each-context pattern from inputs-global modal L1239–1256** — repeats the v3 pattern from chunk 4a's ts-ui-select-dropdown: each scope (modal, oce-panel, banner-generator) declares BOTH the knob tokens AND the consumer formula in its own scope. Confirmed canonical workaround for custom-property cascade short-circuits.
10. **The owner-instituted REBUILD METHODOLOGY tags** — `@ts-inputs-refactor-dedupe` + `#START_DEDUPE`/`#END_DEDUPE` markers (chunk 4a + 4b checkbox-radio + inputs-global), `@ts-component-consolidate` (ts-ui-select-variants), `@ts-component-exception` (deliberate NON-consolidation marker), `@consolidate_select_component` (cross-file grep tag). Adopt as the rebuild's CONVENTIONS doc.
11. **The B23 R-NAV BUILD-LOG cross-reference convention** (headermenu L11–47) — comments reference external build-log files (`B17-autopilot-log.md`, `B23 Phase B`, `R-CLEANUP-1 Wave 2`) so future audits can trace why a token has its current value. Lift as the "decision provenance" convention.
12. **The owner-acknowledged "Lush Mode" proposal** (ts-ui-select-variants L679) — a global styling mode that opts-in background images for inputs that already have `--ts-this-bg` set. Captures the gradient-vs-flat surface decision as a mode toggle rather than per-variant class. Architectural input for the rebuild's variant system.
13. **The headermenu sidebar-nav grid-push (vs overlay) layout** (L2253+) — `body:has(aside.ts-sidebar-menu) { display: grid; grid-template-columns: var(--ts-sidebar-nav-w) 1fr }` PUSHES content rather than overlaying. Implements the L6 wishlist's "must-have alternative layout."
14. **The card-flip OWNER EXEMPLAR DECLARATION** (ts-card-flip L613–622) — "*This component has been refactored and fully tokenized. No further changes have been required in this area so far. This serves as a reference implementation for systematic refactoring within the design system.*" Use as the QC target for every Session 4 block.
15. **The `@refactor:backdrop-critical | glass-dependent | needs-solid-fallback | token-dependency | container-review` 5-tag system** — emerged in chunk 4a, fully institutionalised in chunk 4b. Adopt as the rebuild's machine-readable refactor flag taxonomy.

---


---

# Extracted Blocks Catalog — Section 5a: Views (small / page-compound)

**Sub-agent:** 5a  ·  **Chunk:** views/ small files  ·  **Files:** 3  ·  **Total lines:** 1,775  ·  **Total bytes:** ~44,210

Scope: the three smallest "view" files under `docs/references/toolskin.css_extracted-core-blocks-to-refactor/views/` — page-level / compound view CSS rather than reusable components. Companion to chunks 5b (large views) and 4a/4b (components). Discipline this pass: NORMAL — files were small enough to read in full, but grep was used first to anchor running tallies (`--ts-bg-N`, non-OKLCH literals).

## Files in this chunk

| File | Lines | Bytes | Block type |
|---|---|---|---|
| general-scrollbar-customization(non-mozilla).css | 57 | 1,947 | global utility — webkit-only scrollbar engine (`::-webkit-scrollbar*`) + `.ts-scrollbar-thin` Mozilla utility; consumes `--ts-sb-*` token surface (declared elsewhere) |
| ts-cube-portfolio.css | 673 | 17,756 | **legacy** page-shell — extracted-but-PENDING-INTEGRATION header styles for the 3D cube portfolio reference site (loader, rulers, topbar, sliding sidebar items, page-wipe, detail page, SVG ruler). Owner-flagged "MUST NOT ship with its own dedicated CSS sheet" |
| ts-ui-ide-view-fullview.css | 1,045 | 24,507 | **view-tier composition** — full IDE-emulator demo view (`body.ts-ide-demo` grid shell + titlebar, activity-rail, sidebar, file-tree, editor+tabs+gutter, AI panel, terminal, status bar). The only file in chunk 5a written entirely in CSS Nesting + the modern `--ts-this-bg` derivative protocol |

---

## Special case: `(non-mozilla)` annotation — the Firefox story

The parenthetical `(non-mozilla)` in `general-scrollbar-customization(non-mozilla).css` is an owner self-flag stating **this file deliberately covers ONLY the webkit branch** (`::-webkit-scrollbar`, `::-webkit-scrollbar-thumb`, `::-webkit-scrollbar-track`, `:hover`/`:active` variants). The single concession to Firefox / Mozilla is the bottom utility class `.ts-scrollbar-thin` (L55–58) which uses the standardised CSS properties `scrollbar-width: thin` and `scrollbar-color: var(--ts-bg-4) transparent`.

What the owner did NOT do, and why it matters:

1. **No `scrollbar-width` / `scrollbar-color` at root level.** Firefox's only knobs are the standardised `scrollbar-width: auto | thin | none` and `scrollbar-color: <thumb> <track>` properties — Firefox does NOT support `::-webkit-scrollbar*` pseudos. As a result, in Firefox the global scrollbar is **completely un-styled** (browser default) everywhere except elements that explicitly opt into `.ts-scrollbar-thin`.
2. **No `--ts-sb-thumb-border-w`/`--ts-sb-border`/`--ts-sb-border-hover` equivalents on the Firefox side** because the standard properties don't expose track-border, outline, or border-clip controls — the rich nested look (outline + border-clip + transparent border-spacer) the webkit branch achieves at L17–24 / L34–43 is simply not reproducible in standards-mode Firefox CSS.
3. **`--ts-this-bg: var(--ts-bg-4) !important` declared INSIDE `::-webkit-scrollbar`** (L11) — re-anchors the local surface derivative chain to the thumb's surface, but ONLY in webkit. Firefox cannot consume this.

**Refusal-pattern flag:** webkit-only scrollbar styling is **incomplete cross-browser coverage**. Recommended action for the rebuild: split this file into two layers — (1) a cross-browser layer that uses `scrollbar-width` / `scrollbar-color` as the baseline, (2) a `@supports selector(::-webkit-scrollbar)` enhancement layer for the rich webkit treatment. The current `.ts-scrollbar-thin` utility (L55–58) is the seed for layer 1; needs `--ts-sb-*` tokenization to match.

The commented-out block L2–7 (legacy 6px scrollbar against `--ts-bg-0` track / `--ts-bg-4` thumb / `--ts-accent` hover-thumb / `--ts-radius-full` thumb) is the **pre-token-cartel snapshot** — kept as a "what we used to do" reference. Worth deleting after migration.

## Special case: ts-cube-portfolio — how stale is it?

`ts-cube-portfolio.css` carries `mtime` May 9 (per dispatch brief — the oldest in the views/ folder; the rest were swept May 22). The header block (L1–91) is the owner's own integration brief and explicitly states the file is **pre-integration scratch** that "MUST NOT ship with its own dedicated CSS sheet" (L18–19). What's superseded by current rebuild canon:

| In ts-cube-portfolio.css | Superseded by | Action |
|---|---|---|
| `:root` re-declares `--ts-accent-h: 18`, `-s: 100%`, `-l: 52%` (L96–98) — HSL-based accent identity | apcach OKLCH primitives + Wave 1.6 derivative chain (Rule 15 — apcach is the constant engine for the system layer; HSL accent identity is now banned at primitive layer) | DELETE these three lines on integration. Override accent identity via the new accent token contract, not raw HSL. |
| `:root` re-declares the FULL legacy numbered surface chain `--ts-bg-body`, `--ts-bg-0..4` with hex literals (L99–104) | `assets/css/next/system/surfaces.css` apcach-driven derivative chain (`--ts-this-bg` engine) | DELETE the entire bg-chain redeclaration. The cube view inherits from the production surface engine. |
| Non-prefixed locals `--sw: 250px`, `--rsz: 25px`, `--nh: 45px` (L108–113) | Should use `--ts-sidebar-nav-w` / sizing primitives, prefixed `--ts-cube-*` if cube-private | Rename to `--ts-cube-sw` / `-rsz` / `-nh`. Non-prefixed namespace violation flagged in chunk 4b headermenu component-E (same pattern: `--base-size`). |
| 3 direct `var(--ts-bg-0)` references (L508 `#ts-wipe`, L519 `#ts-detail`, L540 `#ts-dback`) | `--ts-this-bg` derivative chain | Migrate to `--ts-this-bg-dim-*` or set local `--ts-this-bg` and let derivatives cascade. |
| Hardcoded `rgba(255,255,255,.05)` / `.07` / `.18` / `.22` / `.25` / `.28` / `.3` / `.38` / `.42` / `.45` for borders, text and dim-fills (L171, L206, L215, L230, L242, L250, L267, L275, L287, L298, L307, L401, L417, L454, L539, L544, L585, L605, L661, L666) | `--ts-text-primary-dim-N`, `--ts-text-muted`, `--ts-text-secondary`, `--ts-this-bg-border` family | Owner already flagged this himself: L43–47 (rulers note), L196–197 ("Replace `rgba(255,255,255,.05)` borders with surface tokens to keep light-theme switching valid"), L632–633 ("Replace stroke/fill rgba values with surface tokens before promotion"). All `rgba(255,255,255,…)` literals in the file are slated for token migration. |
| ID-anchored components `#ts-loader`, `#ts-rt`, `#ts-rl`, `#ts-topbar`, `#ts-shell`, `#ts-hero`, `#ts-cv`, `#ts-letters`, `#ts-meta-bl`, `#ts-meta-bc`, `#ts-sidebar`, `#ts-mt`, `#ts-wipe`, `#ts-detail`, `#ts-dback`, `#ts-dbody` | Toolskin convention is class-anchored; IDs are page-scoped DOM hooks not styling roots | Promote each ID-anchored block to a class (`.ts-cube-loader`, etc.) OR fold into existing components per the L37–90 per-element plan. |
| `#ts-loader` (L149–191) | `.ts-preloader` system component | Owner L72–77 plan #6: "Must be unified with the system's `ts-preloader` — share styles, DOM, and CSS via aliases / class pending." |
| `#ts-sidebar` (L427–433) — ⚠ NAMING CONFLICT | `.ts-sidebar` already exists in core (and in chunk 4b's masonry+layout-primitives file as `.ts-sidebar`) | Owner L56–60 plan #4: "Must be REPLACED, not re-scoped — across JS, HTML, and CSS. Do NOT keep it: it will break everything." HALT-WORTHY: do not refactor in place. |
| SVG rulers `.ts-grid-rules*` (L634–673) | Slated for promotion to **core component** | Owner L629–633 plan: "Promote to a Toolskin core component. Document in the codebase showcase docs as one of the flagship innovations of the system." This is the ONE class block in the file the owner wants to keep AS-IS (after token migration). |
| Sliding-menu items `.ts-wl` family (L448–499) + `.ts-mname`/`.ts-mrole`/`.ts-missue`/`.ts-dol`/`.ts-dtitle`/`.ts-ddesc`/`.ts-dmeta`/`.ts-dmetablock`/`.ts-dmetalabel`/`.ts-dmetaval`/`.ts-dimgs`/`.ts-nav`/`.ts-avail`/`.ts-avail-dot`/`.ts-dims` | Existing core typography + layout + nav primitives | Owner L60–70 plan #5: "Should not be a problem to refactor using existing Toolskin tokens, classes, and styles. NO new classes should be created for this — variants only, if needed." |
| `@keyframes tspulse` (L319–331) | `.ts-pulse` keyframes elsewhere in core (`ts-glow` in IDE file, `ts-pulse` in headermenu) | DEDUPE candidate. |
| `clamp(160px, 28vw, 430px)` font-size on `#ts-letters` (L371), `clamp(40px, 5.5vw, 84px)` on `.ts-dtitle` (L569) | Should flow through `--ts-fs-display` or a new `--ts-cube-letters-fs` token if cube-private | Owner L364–365 plan #2: "Tokenize the color and the size clamp." |

**Verdict:** ts-cube-portfolio.css is a **scratch / pre-integration reference, not production canon.** It should NOT be cataloged the same way the other view files are — treat it as a SPEC for what the cube-portfolio integration must achieve when folded into existing components, not as a file to refactor in place. Most rules will DELETE on integration; a handful (SVG rulers, big-letter treatment, sliding-menu wave-reveal) become variants on existing components.

## Special case: ts-ui-ide-view-fullview — view-layer architecture lessons

This file is the cleanest example of "view-tier composition" — a full-page IDE-emulator demo built from existing component primitives, with a thin view-private token layer on top. Top two architectural lessons for the rebuild's view-layer formalisation:

### Lesson 1 — The view-private token cartel pattern (L3–47)

The opening selector is `:root:has(.ts-ide-demo), :root:has(.ts-ide-demo) *` — a `:has()`-scoped pseudo-root distribution that activates a 30-token cartel ONLY when the IDE demo is present in the document. Tokens declared:

- **View identity (accent + code colors)** — `--ts-accent-h: 38`, `-s: 96%`, `-l: 56%` (HSL re-declaration — same anti-pattern flagged in ts-cube-portfolio above; superseded by apcach), plus syntax-highlight palette `--kw`/`--str`/`--num`/`--com`/`--fn`/`--typ` (all hsl(), non-prefixed namespace violation — should be `--ts-syntax-kw` etc.)
- **View geometry** — `--ts-top-tabs-h: 38px`, `--ts-ide-rail-w: 50px`, `--ts-ide-sidebar-w: 240px`, `--ts-ide-ai-w: 280px`, `--ts-titlebar-h: 35px`, `--ts-statusbar-h: 32px`, `--ts-bottom-block-h: 200px`
- **View padding/gap recipe** — `--ts-ui-pad-y: 8px`, `--ts-ui-pad-x: calc(var(--ts-ui-pad-y)*1.4)`, `--ts-ui-gap: calc(var(--ts-ui-pad-y)*.875)`, `--ts-ui-gap-md: calc(var(--ts-ui-gap)*1.5)`. Single-source-of-truth: change `--ts-ui-pad-y` and the whole view rescales.
- **Body/IDE grid template recipe** — `--ts-body-template-rows: var(--ts-titlebar-h) 1fr var(--ts-statusbar-h)`, `--ts-ide-template-cols: var(--ts-ide-rail-w) var(--ts-ide-sidebar-w) 1fr var(--ts-ide-ai-w)`. Layout-as-token: the grid shape is a derived token, not an inline `grid-template-*` value.
- **View-private surface aliases** — `--ts-ui-ide-surface-1: var(--ts-bg-0)`, `-surface-2: var(--ts-bg-1)`, `-surface-3: var(--ts-bg-2)` (L31–33), plus `--ts-ui-ide-bg: var(--ts-this-bg)`, `-bg-dim: var(--ts-this-bg-dim-3)`, `-bg-hover: var(--ts-this-bg-dark-1)`, `-bg-hover-accent: color-mix(in srgb, var(--ts-accent) 20%, transparent)`. This is the **view-private alias pattern** — components inside the view consume `--ts-ui-ide-bg`, not the global surface chain, so the view can re-anchor its entire palette in one place.
- **Border aliases** — `--ts-ui-ide-border-0: var(--ts-border-0)`, `-border: var(--ts-this-bg-border)`.

**Lesson:** view-tier files SHOULD declare a private token cartel scoped via `:has()` + `*` distribution. The 30-token cartel here is the right size/shape. **BUT** the cartel mixes legitimate view-private aliases (`--ts-ui-ide-*`) with anti-patterns (raw HSL accent re-declaration, non-prefixed `--kw`/`--str`/etc., direct `--ts-bg-N` consumption). The clean rule: **view-private cartel may only ALIAS production tokens through `--ts-this-bg` derivatives — no raw HSL/hex/rgba allowed at the cartel layer.**

### Lesson 2 — Per-component surface re-anchoring inside the view

Almost every component in the file uses the **two-line surface re-anchor idiom** (Rule 4 — surface superposition):

```css
.ts-titlebar {
    background-color: var(--ts-ui-ide-bg);
    --ts-this-bg: var(--ts-ui-ide-surface-2);
    ...
}
```

Line 1 paints from the view-alias; line 2 RE-ANCHORS the surface derivative chain so any child component computes its borders / dim-tones / dark-tones from this surface, not the parent. This is the same pattern flagged in chunk 4b's `inputs-global-nested-design-pattern.css` as canonical — but here it's applied uniformly across **16 components** in a single view: `.ts-titlebar` (L67–68), `.ts-rail` (L138–139), `.ts-rail-btn` (L171–173 — note the unusual ORDER: `background: var(--ts-this-bg-dim-6)` declared BEFORE `--ts-this-bg: …` — relies on cascade re-evaluation), `.ts-rail-btn:hover` (L207), `.ts-rail-btn.active` (L215), `.ts-sidebar` (L278–279), `.ts-sb-search` (L307–309), `.ts-tree .ts-node` (L341–342 — uses `--ts-this-bg: transparent` to "punch through" parent), `.ts-tree .ts-node:hover` (L347), `.ts-tree .ts-node.active` (L371–372), `.ts-tabs-bar` (L427–428), `.ts-ai` (L583–584), `.ts-msg` (L684), `.ts-msg.ts-user` (L691), `.ts-msg.ts-ai` (L700), `.ts-msg code` (L724), `.ts-ai-input .ts-pill` (L833–834), `.ts-ai-input textarea` (L856–858), `.ts-terminal` (L900), `.ts-term-tabs` (L913–914), `.ts-status` (L974–975).

**Lesson:** the view-layer's job is to declare a 3-tier private surface palette (`-surface-1/-2/-3`) and then re-anchor `--ts-this-bg` to one of those three at every component boundary. The component-internal CSS (borders, dim-fills, hover states) automatically recomputes via the derivative chain. **This file is the cleanest reference for "how a view composes existing components without re-styling them."**

A SECONDARY idiom in the file: the **text-color re-anchor** via `--ts-ui-text-color`:

```css
color: var(--ts-ui-text-color);
--ts-ui-text-color: var(--ts-text-muted);
```

Same two-line pattern, applied to text color rather than background. Used at L104–105 (crumb), L119–120 (menu), L156–157 (rail-btn), L291–292 (sb-head), L313–314 (sb-search), L334–335 (tree-node), L356–357 (tree-node.dir::before), L442 (tab-bar--tab), L569–570 (inline-hint), L837–838 (pill), L850–851 (pill-x), L877–878 (submit-row), L922–923 (term-tab), L944 (term-body), L949 (term-body .ln), L952 (term-body .pr), L956 (term-body .ok), L960 (term-body .wn), L964 (term-body .er), L968 (term-body .com), L982–983 (status), L1007 (status item), L1012 (status item.git), L1016 (item.err), L1020 (item.warn), L1024 (item.ok). **27 occurrences** — this is the dominant text-coloring idiom in the file. The state subclasses (`.git`, `.err`, `.warn`, `.ok`) flip `--ts-ui-text-color` from the cartel default to a semantic token, and the cascade does the rest.

---

## Per-file catalog

### general-scrollbar-customization(non-mozilla).css

- **Path:** `docs/references/toolskin.css_extracted-core-blocks-to-refactor/views/general-scrollbar-customization(non-mozilla).css`
- **Lines:** 57  ·  **Bytes:** 1,947
- **Block type:** global utility — webkit-only scrollbar engine plus one Mozilla-standards utility class
- **Key `--ts-*` tokens declared:** `--ts-this-bg: var(--ts-bg-4)!important` (L11, scoped inside `::-webkit-scrollbar`)
- **Key `--ts-*` tokens referenced:**
  - `--ts-sb-size` (L9, L10), `--ts-sb-thumb` (L15), `--ts-sb-thumb-hover` (L29, L51), `--ts-sb-thumb-border-w` (L20, L23, L31), `--ts-sb-border` (L23, L38), `--ts-sb-border-hover` (L31), `--ts-sb-track` (L36), `--ts-sb-track-hover` (L47), `--ts-sb-track-border-w` (L38)
  - `--ts-bg-4` (L11 `--ts-this-bg`, L57 scrollbar-color) — direct legacy surface consumption
  - `--ts-radius-base` (L17)
  - Commented-out block L2–7 references `--ts-bg-0` (L4), `--ts-bg-4` (L5), `--ts-accent` (L6), `--ts-radius-full` (L5)
- **Selectors defined:**
  - `::-webkit-scrollbar` (L8–12), `::-webkit-scrollbar-thumb` (L14–26), `::-webkit-scrollbar-thumb:hover` (L28–32), `::-webkit-scrollbar-track` (L34–44), `::-webkit-scrollbar-track:hover` (L46–48), `::-webkit-scrollbar-thumb:active` (L50–52)
  - `.ts-scrollbar-thin` (L55–58) — the ONLY non-webkit rule; Firefox-compatible via standardised `scrollbar-width` + `scrollbar-color`
- **No `@keyframes`, no `@property`, no `@media`.**
- **Non-OKLCH literals:** none (the commented-out L25 carries `#36373a` as a documentation note for what `--ts-sb-border` resolved to historically; live code has zero hex/rgb).
- **`--ts-bg-N` direct-reference count contribution:** **4 references** (L4 commented `--ts-bg-0`, L5 commented `--ts-bg-4`, L11 live `--ts-bg-4`, L57 live `--ts-bg-4`); **2 LIVE** (the commented refs in L2–7 don't execute).
- **Refactor flags:**
  - **Cross-browser incompleteness** — see "Special case: `(non-mozilla)`" above.
  - **`!important` overuse** — L9, L10, L11, L15, L16, L20, L21, L23, L29, L30, L36, L37, L39, L40, L47, L51. Owner relies on `!important` to win over UA default scrollbar styles; understandable but the `--ts-this-bg: var(--ts-bg-4)!important` at L11 in particular forcibly OVERRIDES any inherited derivative chain at the scrollbar boundary — surfaces inside the scrollbar will compute against `--ts-bg-4` not the parent surface. Likely intentional but worth documenting.
  - **`border-radius: var(--ts-radius-base); border-radius: 0;`** (L17–18) — two competing declarations in the same rule. Second wins. Likely a leftover from an A/B; needs cleanup.
  - **Direct `--ts-bg-4` consumption** — L11 and L57. Should migrate to `--ts-this-bg-dim-N` derivative once the `--ts-sb-*` cartel is formalised; right now the scrollbar's "thumb base color" is hardcoded to the global surface chain.

### ts-cube-portfolio.css

- **Path:** `docs/references/toolskin.css_extracted-core-blocks-to-refactor/views/ts-cube-portfolio.css`
- **Lines:** 673  ·  **Bytes:** 17,756
- **Block type:** legacy pre-integration page-shell (3D cube portfolio reference). **NOT production canon.** Treat as a spec for what to fold into existing components, not as a file to refactor in place. See "Special case: ts-cube-portfolio" above for the full integration plan owner has embedded at L1–91.
- **Key `--ts-*` tokens declared (`:root` block L95–114):**
  - `--ts-accent-h: 18`, `--ts-accent-s: 100%`, `--ts-accent-l: 52%` ⚠ legacy HSL accent identity (Wave 1.6 anti-pattern — superseded by apcach Rule 15)
  - `--ts-bg-body: #080809`, `--ts-bg-0: #0b0b0d`, `--ts-bg-1: #101012`, `--ts-bg-2: #16161a`, `--ts-bg-3: #1d1d22`, `--ts-bg-4: #252529` ⚠ legacy numbered surface chain with hardcoded hex (superseded by `assets/css/next/system/surfaces.css` derivative chain)
  - `--ts-font-display: 'Syne', system-ui, sans-serif`, `--ts-font-body: 'Space Grotesk', system-ui, sans-serif`, `--ts-font-mono: 'JetBrains Mono', monospace` ⚠ font identity should come from the production typography contract, not be re-declared per page
  - `--sw: 250px`, `--rsz: 25px`, `--nh: 45px` ⚠ non-prefixed namespace violation (`--ts-` prefix missing)
- **Key `--ts-*` tokens referenced:**
  - `--ts-bg-body` (L129), `--ts-bg-0` (L508, L519, L540) — direct legacy surface consumption (3 LIVE refs)
  - `--ts-accent` (L181, L293, L315, L375, L478, L484, L549, L561, L577), `--ts-accent-dim` (L478 fallback) — accent chain
  - `--ts-text-primary` (L130 only — most text uses raw `rgba(255,255,255,…)`)
  - `--ts-font-body` (L131), `--ts-font-display` (L370, L568), `--ts-font-mono` (L188, L228, L273, L305, L415, L543, L564, L608, L639)
- **Selectors / IDs defined:**
  - IDs: `#ts-loader`, `#ts-loader-track`, `#ts-loader-fill`, `#ts-loader-num`, `#ts-rt`, `#ts-rl`, `#ts-topbar`, `#ts-shell`, `#ts-hero`, `#ts-cv`, `#ts-letters`, `#ts-meta-bl`, `#ts-meta-bc`, `#ts-sidebar` (⚠ NAMING CONFLICT), `#ts-mt`, `#ts-wipe`, `#ts-detail`, `#ts-dback`, `#ts-dbody`
  - Classes: `.rstk`, `.rstk.m`, `.rsvtk`, `.ts-dims`, `.ts-nav`, `.ts-avail`, `.ts-avail-dot`, `.ts-mname`, `.ts-mrole`, `.ts-missue`, `.ts-wl`, `.ts-wl.revealed`, `.ts-wl.is-active`, `.ts-wl.is-dimmed`, `.ts-dol`, `.ts-dtitle`, `.ts-ddesc`, `.ts-dmeta`, `.ts-dmetablock`, `.ts-dmetalabel`, `.ts-dmetaval`, `.ts-dimgs`, `.ts-grid-rules` + `__horizontal`/`__vertical`/`-line`/`-text`
  - Selectors with state: `#ts-loader.out`, `#ts-detail.open`, `#ts-dback:hover`, `.ts-wl::before`, `.ts-wl.is-active::before`, `.ts-wl.is-dimmed::before`, `.ts-nav a`, `.ts-nav a:hover`, `.ts-nav li:not(:last-child) a::after`, `.ts-dtitle em`, `.ts-dimgs img`
- **Keyframes defined:** `tspulse` (L319–331) — opacity + scale pulse for `.ts-avail-dot`. DEDUPE candidate vs `ts-glow` / `ts-pulse` elsewhere.
- **No `@property`, no `@media`.** (Surprising for a "view" file — owner has not yet added breakpoint logic. The fixed 250px sidebar will be unusable on mobile.)
- **Non-OKLCH color literals (live):** `#080809` (L99), `#0b0b0d` (L100), `#101012` (L101), `#16161a` (L102), `#1d1d22` (L103), `#252529` (L104), plus extensive `rgba(255, 255, 255, .NN)` usage at L171, L206, L215, L230, L242, L250, L267, L275, L287, L298 (twice), L307, L401, L417, L454, L478 (`rgba(255, 84, 10, .08)` — accent fallback), L494, L539, L544, L585, L605, L661, L666. **Total: 28 raw color literals.** All are slated for token migration per owner's embedded plan (see "stale" table above).
- **`--ts-bg-N` direct-reference count contribution:** **3 LIVE references** (`--ts-bg-0` at L508, L519, L540) plus **6 legacy `--ts-bg-0..4` redeclarations at L100–104** (the `:root` block; these are LOCAL re-declarations that override the production chain WHILE this file is loaded — high-impact if this file ships unfiltered into production).
- **Owner annotations VERBATIM (selected, line numbers exact):**
  - L1–91: the entire opening comment block is the integration policy. Most important callouts:
    - L5–19: STATUS block — "These styles are extracted from the cube-portfolio source. They are pending: filtering, tokenization, updating, and seamless adaptation INTO the core CSS — preserving the current visual snapshot while avoiding the creation of new classes and reusing the existing Toolskin base."
    - L17–19: "Alternatively, this file may stay isolated UNTIL integration is complete — but the final cube-portfolio component MUST NOT ship with its own dedicated CSS sheet."
    - L22–35: GLOBAL POLICY — "Keep ONLY elements that are irreplaceable and do not match any existing pattern in the core." "Same applies to tokens: replace ad-hoc values with the current production tokens wherever possible."
    - L40–45 (RULERS plan): "Use surface tokens, NOT hardcoded colors, so that light-theme switching remains valid."
    - L56–60 (SIDEBAR plan #4): "⚠ NAMING CONFLICT. The class `ts-sidebar` already exists in core. It must be REPLACED, not re-scoped — across JS, HTML, and CSS. Do NOT keep it: it will break everything."
    - L72–77 (LOADER plan #6): "Must be unified with the system's `ts-preloader`."
    - L79–84 (CUBE plan #7): "still experimental … must become dynamic: able to load elements from a gallery source (posts, a folder, or a JSON feed) and to bind menu entries to cube tiles dynamically through hooks."
  - L94: `/* ── THEME TOKENS  (locals only — DO NOT promote, see policy above) ── */`
  - L134–144: `/* ── CURSOR ──  (currently disabled — see commented block) */` + the disabled `#tsc` block
  - L146–148: `/* ── LOADER ── INTEGRATION: must be unified with system `ts-preloader`. See point 6 of the per-element plan above. */`
  - L193–197: `/* ── RULERS ── Legacy DOM-based ruler. Superseded by the SVG ruler below (`.ts-grid-rules*`). Few CSS elements only — these MUST persist during integration. Replace `rgba(255,255,255,.05)` borders with surface tokens to keep light-theme switching valid. */`
  - L253–255: `/* ── TOPBAR ── Likely fully replaceable by an existing core nav variant. Audit before keeping any rule here. */`
  - L362–365: `/* TS giant letters — INTEGRATION: promote as a variant on the core design base — "background big-letter" treatment. Tokenize the color and the size clamp. See point 2 of the per-element plan above. */`
  - L422–426: `/* ── SIDEBAR ──  ⚠ NAMING CONFLICT … Must be REPLACED (not re-scoped) across JS, HTML, and CSS during integration. Do NOT keep this ID — it will break everything. */`
  - L443–447: `/* Sliding menu items (.ts-wl) — INTEGRATION: refactor onto existing Toolskin tokens / classes. No new classes should be created — variants only, if needed. */`
  - L482: `/* Only ONE item is active — the directly hovered one */`
  - L501–503: `/* ── PAGE WIPE ── INTEGRATION: economize and minimize the styling/handling while preserving rendering parity. See point 3 of the plan above. */`
  - L629–633: `/* ── SVG RULERS (current implementation) Promote to a Toolskin core component. Document in the codebase showcase docs as one of the flagship innovations of the system. Replace stroke / fill rgba values with surface tokens before promotion, to keep light-theme switching valid. */`
- **Refactor flags:**
  - **Whole-file status: pre-integration scratch.** Owner explicitly states this file MUST NOT ship as-is. The catalog's role is to enumerate what gets folded where, not to plan a refactor in place.
  - **`:root` block at L95–114 will SHADOW production tokens** if this file is loaded alongside the rebuild — `--ts-bg-0..4`, `--ts-accent-h/s/l`, `--ts-bg-body` all get overridden with hex literals. HIGH RISK if accidentally bundled.
  - **`#ts-sidebar` naming collision** — HALT-WORTHY per owner.
  - **Mobile responsive plan absent** — no `@media` queries. The fixed 250px sidebar + 25px rulers + 45px nav-height layout is desktop-only.
  - **`will-change: transform`** on `#ts-mt` (L441), `will-change: left, top` in commented `#tsc` (L141) — perf budget commitments. Document if kept.
  - **`mix-blend-mode: difference`** in commented `#tsc` block (L139) — if cursor is restored, this is one of the few "true" creative-blend-mode usages in the catalog so far.

### ts-ui-ide-view-fullview.css

- **Path:** `docs/references/toolskin.css_extracted-core-blocks-to-refactor/views/ts-ui-ide-view-fullview.css`
- **Lines:** 1,045  ·  **Bytes:** 24,507
- **Block type:** view-tier composition (full IDE-emulator demo). The single best reference in the catalog so far for "how a view composes existing components without restyling them" via private surface aliases + `--ts-this-bg` re-anchoring. See "Special case: ts-ui-ide-view-fullview" above for the two architectural lessons.
- **Key `--ts-*` tokens declared (`:root:has(.ts-ide-demo), :root:has(.ts-ide-demo) *` block L3–47, scoped to view via `:has()`):**
  - View identity (anti-pattern): `--ts-accent-h: 38`, `--ts-accent-s: 96%`, `--ts-accent-l: 56%` ⚠ same HSL re-declaration anti-pattern as ts-cube-portfolio
  - Code colors: `--ts-code-bg: #0c0e0f`, `--ts-code-line: #2a2e2f` — `--ts-` prefixed but hardcoded hex
  - Syntax-highlight palette (anti-pattern): `--kw: hsl(322, 70%, 70%)`, `--str: hsl(140, 60%, 60%)`, `--num: hsl(45, 90%, 65%)`, `--com: hsl(220, 10%, 45%)`, `--fn: hsl(200, 80%, 65%)`, `--typ: hsl(180, 70%, 65%)` ⚠ non-prefixed namespace violation + raw HSL
  - View geometry: `--ts-top-tabs-h: 38px`, `--ts-ide-rail-w: 50px`, `--ts-ide-sidebar-w: 240px`, `--ts-ide-ai-w: 280px`, `--ts-sb-size: 6px` (overrides global scrollbar size), `--ts-titlebar-h: 35px`, `--ts-statusbar-h: 32px`, `--ts-bottom-block-h: 200px`
  - View padding/gap recipe: `--ts-ui-pad-y: 8px`, `--ts-ui-pad-x: calc(var(--ts-ui-pad-y)*1.4)`, `--ts-ui-gap: calc(var(--ts-ui-pad-y)*.875)`, `--ts-ui-gap-md: calc(var(--ts-ui-gap)*1.5)`
  - Grid templates (layout-as-token): `--ts-body-template-rows: var(--ts-titlebar-h) 1fr var(--ts-statusbar-h)`, `--ts-ide-template-cols: var(--ts-ide-rail-w) var(--ts-ide-sidebar-w) 1fr var(--ts-ide-ai-w)`
  - Border aliases: `--ts-ui-ide-border-0: var(--ts-border-0)`, `--ts-ui-ide-border: var(--ts-this-bg-border)`
  - Surface aliases: `--ts-ui-ide-surface-1: var(--ts-bg-0)`, `-surface-2: var(--ts-bg-1)`, `-surface-3: var(--ts-bg-2)` ⚠ direct `--ts-bg-N` consumption
  - Background aliases: `--ts-ui-ide-bg: var(--ts-this-bg)`, `-bg-dim: var(--ts-this-bg-dim-3)`, `-bg-hover: var(--ts-this-bg-dark-1)`, `-bg-hover-accent: color-mix(in srgb, var(--ts-accent) 20%, transparent)`
  - Type scale: `--ts-ui-fs-sm: 12px`, `--ts-ui-fs-xs: 11px`, `--ts-ui-fs-2xs: 9px`
  - Misc: `--ts-bar-stroke-size: 2px`, `--ts-ui-radius: 4px`, `--ts-node-indent-val: var(--ts-ui-gap-md)`, `--ts-node-indent-active: calc(var(--ts-node-indent)*.75)` (note: `--ts-node-indent` is consumed before declared — see refactor flag), `--ts-ui-text-color: var(--ts-text-primary-dim-2)`
- **Key `--ts-*` tokens referenced** (extensive — view-private aliases dominate, but direct production tokens still appear):
  - Direct production surface: `--ts-bg-0` (L31), `--ts-bg-1` (L32), `--ts-bg-2` (L33, L207), `--ts-bg-3` (L215), `--ts-bg-4` (L327 scrollbar-color), `--ts-bg-body` (L53) — **6 LIVE direct refs**
  - Production text: `--ts-text-primary` (L350, L454, L508, L609, L860), `--ts-text-primary-dim-2` (L45, L654), `--ts-text-secondary` (L105, L314, L335, L683, L690, L949), `--ts-text-muted` (L120, L157, L292, L357, L442, L570, L689, L838, L851, L878, L923, L983), `--ts-text-accent` (L372, L375, L725, L754, L757, L762, L766)
  - Accent / state: `--ts-accent` (L112, L124, L213, L224, L248, L375, L376, L455, L499, L520, L549, L575, L619, L620, L638, L682, L698, L757, L883, L931, L953, L1012), `--ts-on-accent` (L224, L249, L884), `--ts-warning` (L381, L472, L961, L1020), `--ts-success` (L386, L754, L762, L957, L1024), `--ts-danger` (L465, L555, L766, L965, L1016)
  - Derivative chain (the GOOD signal — Wave 1.6 surface superposition working as designed): `--ts-this-bg` (L34, L68, L139, L173, L194, L207, L215, L279, L309, L342, L347, L372, L428, L584, L684, L691, L700, L724, L834, L858, L900, L914 — set 22 times), `--ts-this-bg-dim-3` (L35), `--ts-this-bg-dim-5` (L739), `--ts-this-bg-dim-6` (L171, L747), `--ts-this-bg-dark-1` (L36), `--ts-this-bg-border` (L30, L726), `--ts-this-bg-border-active` (L734), `--ts-this-color-bright` (L374, L382, L748), `--ts-this-bg-dim-4` (L755 commented). **`--ts-this-*` derivative chain used in 30+ rules.**
  - Borders: `--ts-border-0` (L29, L161)
  - Typography: `--ts-font-mono` (L56, L74, L102, L273, L315, L412, L543, L789, L861, L889, L1035), `--ts-font-display` (L604), `--ts-fs-xs` (L1006), `--ts-fs-2xs` (L650), `--ts-letter-spacing-wider` (L924)
  - Sizing: `--ts-btn-h` (L152, L153, L167, L197 commented, L202 commented, L239), `--ts-icon` (L158, L166, L175, L196 commented, L264), `--ts-radius-full` (L267), `--ts-btn-fs` (L790), `--ts-btn-scale` (L796, L893), `--ts-btn-h-ratio` (L797), `--ts-btn-fs-ratio` (L798), `--ts-sp-0` (L776), `--ts-sp-1` (L775), `--ts-sp-4` (L439), `--ts-badge-size` (L237, L240, L241, L262, L264, L265, L266, L271, L272)
- **Selectors / classes defined (compound — nested CSS via `.ts-ide-demo { … }` parent at L63–1046):**
  - Body shell: `body.ts-ide-demo` (L49–61)
  - Titlebar layer: `.ts-titlebar` (L66–76), `.ts-traffic` + `.r`/`.y`/`.g` (L78–99 — Mac-style traffic lights with hardcoded `#ff5f56`/`#ffbd2e`/`#27c93f`), `.ts-titlebar .ts-crumb` (L101–109), `.ts-titlebar .ts-crumb b` (L111–113), `.ts-titlebar .ts-menu` (L115–121), `.ts-titlebar .ts-menu span:hover` (L123–126)
  - IDE grid + rail: `.ts-ide` (L129–134), `.ts-rail` (L137–149), `.ts-rail-btn` (L151–178), `.ts-rail-btn:hover` (L205–208), `.ts-rail-btn.active, .ts-rail-btn.ts-active` (L210–217), `.ts-rail-btn .ts-badge, .ts-rail-btn .badge` (L219–242, AND DUPLICATED L244–274 with refined values — the second wins)
  - Sidebar (file-tree): `.ts-sidebar` (L277–284), `.ts-sb-head` (L286–298), `.ts-sb-head .ts-icon` (L300–303), `.ts-sb-search` (L305–317), `.ts-tree` (L319–329), `.ts-tree .ts-node` (L331–344), `.ts-tree .ts-node:hover` (L346–351), `.ts-tree .ts-node.dir::before` / `.ts-tree .ts-node.dir.closed::before` / `.ts-tree .ts-node.file::before` (L353–368), `.ts-tree .ts-node.active` (L370–378), `.ts-tree .ts-node.modified` / `.added` (L380–388), `.ts-tree .ts-node.indent` / `.indent2` / `.indent.active`/`.indent2.active` (L390–408), `.ts-tree .ts-node .git` (L410–415)
  - Editor column: `.ts-editor-col` (L418–423), `.ts-tabs-bar` (L425–431), `.ts-tabs-bar, .ts-ai-head` (L433–436 — shared height rule), `.ts-tab-bar--tab` (L438–450), `.ts-tab-bar--tab.active` (L452–456), `.ts-tab-bar--tab .x` (L458–461), `.ts-tab-bar--tab .x:hover` (L463–466), `.ts-tab-bar--tab .dot` (L468–473)
  - Editor pane: `.ts-editor` (L475–481), `.gutter, .ts-gutter` (L483–492), `.gutter span` (L494–496), `.gutter .cur` (L498–500), `.ts-code` (L502–511), `.ts-code .line` (L513–516), `.ts-code .line.cur` (L518–522), `.ts-code .kw`/`.str`/`.num`/`.com`/`.fn`/`.typ`/`.acc` (L524–551), `.ts-code .err` (L554–559 — squiggle pattern), `.ts-inline-hint` (L561–572), `.ts-inline-hint b` (L574–577)
  - AI panel: `.ts-ai` (L582–593), `.ts-ai-head` (L595–601), `.ts-ai-head h3` (L603–613), `.ts-ai-head h3 .ts-pulse` (L615–622), `.ts-ai-head .ts-model` (L636–640), `.ts-ai-body` (L643–656), `.ts-msg` (L660–686), `.ts-msg.ts-user` (L688–694), `.ts-msg.ts-ai` (L697–702), `.ts-msg.ts-ai::before` / `.ts-msg.ts-user::before` content + shared block (L704–719), `.ts-msg code` (L721–728), `.ts-msg .ts-codeblock` (L730–743), `.ts-msg .ts-codeblock .add, .ts-msg .ts-codeblock .rem` + `.add` + `.rem` (L745–767), `.ts-codeblock span:not(:last-child)` (L769–771), `.ts-msg .ts-actions` (L773–781), `.ts-msg .ts-actions button, .ts-msg .ts-actions .ts-btn` (L783–800)
  - AI input: `.ts-ai-input` (L811–822), `.ts-ai-input .ts-pills` (L824–828), `.ts-ai-input .ts-pill` (L830–847), `.ts-ai-input .ts-pill .x` (L849–853), `.ts-ai-input textarea` (L855–867), `.ts-ai-input .ts-submit-row` (L869–873), `.ts-ai-input .ts-submit-row .ts-left` (L875–880), `.ts-ai-input .ts-submit-row button` (L882–895)
  - Terminal: `.ts-terminal` (L898–908), `.ts-term-tabs` (L911–917), `.ts-term-tab` (L919–928), `.ts-term-tab.active` (L930–933), `.ts-term-body` (L935–941), `.ts-term-body *` (L943–946), `.ts-term-body .ln`/`.pr`/`.ok`/`.wn`/`.er`/`.com` (L948–970 — state colors via `--ts-ui-text-color` flip)
  - Status bar: `.ts-status` (L972–988), `.ts-status .ts-group` (L990–993), `.ts-status .ts-group:last-child` (L995–997), `.ts-status .ts-item` (L999–1009), `.ts-status .ts-item.git`/`.err`/`.warn`/`.ok` (L1011–1025)
  - Bottom-of-file utilities: `.line, .ts-line` (L1027–1030), `.ts-code, .code, code` (L1032–1036), `.ts-code .line, .ts-code .ts-line, .code .line, .code .ts-line` (L1038–1045 — flagged `/* CRITICAL */`)
- **Keyframes defined:** `ts-glow` (L624–634) — opacity pulse for `.ts-ai-head h3 .ts-pulse`. DEDUPE candidate vs `tspulse` (ts-cube-portfolio L319) and `ts-pulse` (headermenu).
- **No `@property`, no `@media`.** (Same blind-spot as ts-cube-portfolio — IDE view is desktop-only.)
- **Non-OKLCH color literals (live):** `#0c0e0f` (L8), `#2a2e2f` (L9), `hsl(322, 70%, 70%)` (L10), `hsl(140, 60%, 60%)` (L11), `hsl(45, 90%, 65%)` (L12), `hsl(220, 10%, 45%)` (L13), `hsl(200, 80%, 65%)` (L14), `hsl(180, 70%, 65%)` (L15), `#ff5f56` (L90), `#ffbd2e` (L94), `#27c93f` (L98), `rgba(255, 255, 255, 0.03)` (L519), `rgba(255, 255, 255, 0.04)` (L565). **Total: 13 raw color literals.** All justifiable as either (a) syntax-highlight palette best left as HSL for hue-readability or (b) the Mac traffic-light + line-highlight conventions. STILL, ALL should be tokenized as `--ts-syntax-kw` / `--ts-traffic-r` / `--ts-code-line-highlight` etc. before shipping.
- **`--ts-bg-N` direct-reference count contribution:** **6 LIVE references** — `--ts-bg-0` (L31), `--ts-bg-1` (L32), `--ts-bg-2` (L33, L207), `--ts-bg-3` (L215), `--ts-bg-4` (L327). One commented (L785). The L31–33 three references in particular are the view's surface-alias seeds and should migrate to `--ts-this-bg-dim-N` so the IDE view re-anchors to its host surface rather than hardcoding to the global chain.
- **Owner annotations / structural comments:**
  - L65: `/* TITLE BAR */`
  - L128: `/* MAIN GRID */`
  - L136: `/* ACTIVITY RAIL */`
  - L146–147 + L180–204: large commented-out alternate `.ts-rail-btn` declaration — an A/B that wasn't deleted. Cleanup candidate.
  - L276: `/* ts-SIDEBAR */` (note lowercase-ts prefix in comment — minor inconsistency vs the file's conventional uppercase callouts)
  - L417: `/* EDITOR */`
  - L553: `/* squiggle */` — for `.ts-code .err`
  - L579: `/* RIGHT PANEL — AI assistant */`
  - L731–733: commented properties inside `.ts-msg .ts-codeblock` (`margin`, `padding`, `--this-bg` — note the latter is `--this-bg` NOT `--ts-this-bg`, likely a typo) — the `--this-bg: var(--ts-code-bg)` at L733 is the only typo'd custom property in the file (missing `ts-` prefix).
  - L802–809: commented-out `.ts-msg .ts-actions .primary` rule
  - L897: `/* TERMINAL bottom panel — collapsed inside editor col */`
  - L972: `/* STATUS BAR */`
  - L1044: `/* CRITICAL */` next to `white-space: pre` on `.ts-code .line` — the only critical-grade flag in the file. Documents that the editor's code-line layout depends on `pre` to preserve indentation; do not refactor away.
- **Refactor flags:**
  - **HSL accent identity re-declaration (L5–7)** — Wave 1.6 anti-pattern. The view should override accent via the apcach contract, not the raw HSL channels.
  - **Non-prefixed syntax-highlight tokens (`--kw`/`--str`/`--num`/`--com`/`--fn`/`--typ`)** — namespace violation. Rename to `--ts-syntax-*`.
  - **`--ts-code-bg: #0c0e0f`, `--ts-code-line: #2a2e2f`** — `--ts-` prefixed but values are hardcoded hex. Should resolve through surface tokens (e.g. `--ts-code-bg: var(--ts-this-bg-dim-7)` or similar).
  - **Mac-style traffic lights (`#ff5f56`/`#ffbd2e`/`#27c93f`)** — semantic color, should tokenize as `--ts-traffic-r`/`-y`/`-g` or reuse `--ts-danger`/`--ts-warning`/`--ts-success`.
  - **`.ts-rail-btn .ts-badge, .ts-rail-btn .badge` declared TWICE** (L219–242 and L244–274). Second declaration wins (refined values, `transform: translate(5px, -5px)`, `border-radius: var(--ts-radius-full)`, `display: grid; place-content: center`). Delete the first block as dead code.
  - **`--ts-node-indent` referenced before declared** (L44 declares `--ts-node-indent-active: calc(var(--ts-node-indent)*.75)` but `--ts-node-indent` is only declared inside `.ts-tree .ts-node` at L340). This works because of CSS custom property lazy evaluation, but it's a fragile dependency — the `:root` block's `--ts-node-indent-active` is meaningless until a `.ts-node` is in scope. Should be declared at `:root` with a fallback.
  - **`--ts-this-bg: var(--ts-text-accent)` at L372 and L756 / `.ts-msg .ts-codeblock .add,.rem`** — REASSIGNS the bg derivative chain to a TEXT token. Reads as: "this surface's background = the text accent color." Probably intentional (the active-tree-node row has a filled accent bar; the diff add/rem rows have a green/red wash) — but **this is the only place in the catalog so far where `--ts-this-bg` is anchored to a semantic text token rather than a surface token.** Worth a council note: is this a legitimate idiom for "semantic-state-as-surface" composition, or a token-tier violation?
  - **`background: var(--ts-this-bg-dim-6)` declared BEFORE `--ts-this-bg: var(--ts-ui-ide-surface-1)`** in `.ts-rail-btn` (L171 then L173). CSS recomputes `--ts-this-bg-dim-6` at use-time, so this works — but the SOURCE-ORDER is inverted from convention (re-anchor first, consume second). Stylistically should swap.
  - **Missing `@media` queries** — the entire view is desktop-only with no breakpoint logic. The 4-column grid `var(--ts-ide-rail-w) var(--ts-ide-sidebar-w) 1fr var(--ts-ide-ai-w)` (50+240+…+280 = 570px chrome) will be unusable on mobile. Owner has not yet annotated this.
  - **The view-cartel scoped via `:root:has(.ts-ide-demo), :root:has(.ts-ide-demo) *`** is an R-cascade-adjacent pattern (Rule 8). It's NOT the forbidden `:root [class*=…]` substring-distribution that headermenu uses — `:has()` + `*` is a legitimate "activate when this demo is present" scope — but it still distributes the cartel onto every descendant, costing browser re-evaluation per element. Council note: is `:has()` + `*` distribution acceptable for view-scoped token cartels, or should views use a single root selector + CSS inheritance?

---

## Cross-chunk inventory update

### `--ts-bg-N` direct-reference running tally — chunk 5a contribution

Live references (excludes commented-out code) added by chunk 5a:

| File | `--ts-bg-0` | `--ts-bg-1` | `--ts-bg-2` | `--ts-bg-3` | `--ts-bg-4` | `--ts-bg-body` | Total LIVE |
|---|---|---|---|---|---|---|---|
| general-scrollbar-customization(non-mozilla).css | 0 | 0 | 0 | 0 | **2** (L11, L57) | 0 | **2** |
| ts-cube-portfolio.css | **3** (L508, L519, L540) | 0 | 0 | 0 | 0 | **1** (L129) | **4** (+ 6 LOCAL REDECLARATIONS at L100–104 that SHADOW the production chain — high-risk if bundled) |
| ts-ui-ide-view-fullview.css | **1** (L31) | **1** (L32) | **2** (L33, L207) | **1** (L215) | **1** (L327) | **1** (L53) | **7** |
| **Chunk 5a total LIVE** | **4** | **1** | **2** | **1** | **3** | **2** | **13 LIVE references** |

Plus **6 LOCAL REDECLARATIONS** in ts-cube-portfolio.css L100–104 (`--ts-bg-body`, `--ts-bg-0..4` hex literals) — these don't COUNT toward the tally of consumers but they DO shadow the production chain.

**Carry-forward note for chunks 5b / future sweeps:** the dominant migration pattern in chunk 5a is `--ts-bg-N → --ts-this-bg-dim-N` for static surface paints, OR `--ts-bg-N → view-private alias (--ts-ui-ide-surface-N)` that itself resolves to a derivative. The ts-ui-ide-view file demonstrates the right idiom for views — a private 3-tier alias palette anchored at the view root — except that those aliases still bottom out at `--ts-bg-N` (L31–33). One-line fix: change to `--ts-this-bg-dim-1/-3/-5` and the view auto-re-anchors per host surface.

### View-tier vs component-tier — what chunk 5a teaches

Compared to the component files in chunks 4a/4b:

1. **View-tier files SHOULD declare a private token cartel** (ts-ui-ide-view does this cleanly). Component-tier files SHOULD NOT (most components in 4a/4b consume tokens only).
2. **View-tier files SHOULD set `--ts-this-bg` at every component boundary** (ts-ui-ide-view does this 22 times). Component-tier files SHOULD set `--ts-this-bg` ONCE per component root (canonical reference: `inputs-global-nested-design-pattern.css` chunk 4b).
3. **View-tier files SHOULD NOT re-declare accent identity HSL channels** (both ts-cube-portfolio and ts-ui-ide-view violate — flagged for migration to apcach override).
4. **View-tier files SHOULD have `@media` breakpoint logic** — both 5a view files MISS this. Likely a deferred concern; rebuild canon must enforce.
5. **View-tier files SHOULD use `:has()` + `*` distribution carefully** — preferable to global `:root` declarations, but still distributes per-element. Council-worthy.

### Annotations density (running)

| Chunk | Files | Lines | Owner-annotated lines (estimated) | Density |
|---|---|---|---|---|
| 5a | 3 | 1,775 | ~165 (≈9.3%) | LOW — dominated by ts-cube-portfolio's 91-line integration brief; ts-ui-ide-view is sparsely annotated despite its architectural importance |

---

## Halt status

No HALT this chunk. All three files cataloged; no files missing; output well under 100k tokens.


---

# Extracted Blocks Catalog — Section 5b: Views (large / page-compound)

**Sub-agent:** 5b  ·  **Chunk:** views/ large files  ·  **Files:** 3  ·  **Total lines:** 16,307  ·  **Total bytes:** ~523,671

Scope: the three LARGEST view CSS files under `docs/references/toolskin.css_extracted-core-blocks-to-refactor/views/`. Companion to chunk 5a (small views) and 4a/4b (components). Discipline this pass: **GREP-ONLY MANDATORY** — a prior agent crashed at 292k tokens trying to Read these in full. This pass used 8 targeted slice-reads totaling under 1,400 lines plus ~30 grep passes; the prose-narrative format used for chunks 4a/5a is replaced here by enumerated tables + verbatim annotation excerpts, because exhaustive per-rule walkthrough would blow the token budget and add little value over what greps already reveal.

## Files in this chunk

| File | Lines | Bytes | Block type |
|---|---|---|---|
| ts-tree-explorer-styles(not-splitted).css | 2,369 | 94,298 | **multi-component file mis-named as a single view** — the file the owner himself flagged "not-splitted." Carries: the tree-explorer scope (rows / nodes / connectors / curved variant), an action-bar / topbar block, a search-input expandable, a chip-strip (taxonomy chips, locked-design-input per Rule 9), a popover/popmenu, plus preview-header sub-component. **Five+ logical sub-modules glued together.** |
| ts-oce-panel-banner-generator-styles.css | 6,903 | 210,705 | **app-shell view** — the full `.ts-banner-generator-app` reference application from `docs/references/generator/`, plus the offcanvas quick-editor (`.ts-oce-*` family: FAB / overlay / panel / header / tabs / close) that wraps it. References every form primitive (ranges, toggles, color-swatches, ui-select, number-input, chip-strips, accordions) at scope-narrowed `.ts-banner-generator-app …` selectors. **The largest single CSS asset in the entire reference catalog.** |
| ts-oce-panel-styles(partial).css | 7,035 | 218,668 | **subset + extensions of the banner-generator file** — first ~6,330 lines are byte-for-byte identical to banner-generator-styles starting at *its* L397 (the file skips the FAB/overlay/panel-shell preamble and goes straight to the `.ts-oce-panel.ts-banner-generator-app` token cartel). Then ~700 additional lines tail (light-theme overrides for OCE-panel-specific assets: nav-bar, accordion, sortable, footer, modals, toasts, tabs, section dividers, nav-active, accent-bar cards, toggle/range) that don't appear in the banner-generator file. **"(partial)" = missing the leading OCE-panel-shell block AND the OCE-panel light-theme overrides tail aren't in the banner file either** — neither file is "complete"; they are two overlapping extractions of the same conceptual surface that need merging. |

---

## Special case: `(not-splitted)` annotation on ts-tree-explorer — the logical split

The parenthetical `(not-splitted)` is the owner's self-flag that this single 2,369-line file should have been multiple files. Section headers (greppable as `/* === … === */` and `/* === … === */ … =================================================================== */`) cluster into **seven logical sub-modules:**

| Proposed sub-file | Lines (approx) | Selectors | Concern |
|---|---|---|---|
| 1. `ts-tree-explorer.tokens.css` | L1–L260 | `:root :is(.ts-tree-explorer, .ts-tree)` token cartel + the curved-variant `data-tree-variant="curved"` override block | THE TOKEN-CARTEL ENGINE — declares 30+ `--ts-tree-*` tokens; everything else consumes them. The "(FAILED @refactor-note + @owner-fix:tree-token-cascade-2026-05-16)" 80-line postmortem at L19–98 documents an aborted attempt to remove the `:root [class*="ts-tree"]` scope-alias — see "Critical annotations" below |
| 2. `ts-tree-explorer.shell.css` | L168–L390 | `.ts-tree-explorer` root + body / scroll / actionbar geometry | View shell — width clamp, intrinsic height calc, scroll regions, `.tree--scroll` modifier |
| 3. `ts-tree.css` | L391–L770 | `.ts-tree`, `.ts-tree__node`, `.ts-tree__children`, `.ts-tree__row`, `.ts-tree__row` states (hover/focus/active/selected), `.ts-tree__label`, `.ts-tree__icon`, indent-guide connectors (`::before`/`::after`), state map | THE TREE RENDERING — could ship standalone as `ts-tree` atomic component. Independent of the explorer shell |
| 4. `ts-tree-explorer.intro.css` | L685–L770, ~L730–L865 | `.ts-tree-explorer__intro`, `.ts-tree-explorer__intro-bullets.ts-list`, `--ts-feat-icon-gap` / `--ts-feat-item-pad` token group | Empty-state intro panel — has its own `--ts-feat-*` token sub-cartel |
| 5. `ts-tree-explorer.topbar.css` | L869–L1290 | `.ts-btn-group`, `#ts-topbar` scoped variants, `#ts-topbar .ts-input-group`, `.ts-tree-explorer__search-group` (expandable search), `#ts-topbar .ts-btn`, `#ts-topbar` `:has()`-driven layout, `.theme-toggle` scoping | Topbar / actionbar — wraps shared `.ts-btn` + `.ts-input-group` core components into the tree-explorer's specific topbar layout. Has its own `@refactor-note:topbar-unification-2026-05-16` block (L1331) |
| 6. `ts-tree-popover.css` | L1846–L1937 | `.ts-tree-popover` + `--ts-popover-*` 14-token cartel + `&` nested state rules | Popover/menu UI for the action button — declares `--ts-popover-bg-surface: var(--ts-bg-0)` etc. Has 2 `/*NOTE: hardforced, eliminate per step 3*/` annotations (L1872, L1934) |
| 7. `ts-tree-explorer.chipstrip.css` | L1938–L2270 | `#ts-taxonomy.ts-chips` ID-scoped chip strip + chip tokens + L1815–L2067 OWNER REFACTOR-REQUIREMENTS block (53-line spec for the chip-strip refactor: scoped-root token setup, horizontal-scroll replacement, truncation-dropdown wiring, sibling shrink, chip styling inheritance, `!important` cleanup with visual-parity protocol) | The `@taxonomy_chips_strip` block — Rule 9 LOCKED DESIGN INPUT. The 53-line REFACTOR REQUIREMENTS comment is the most detailed owner-authored refactor spec in the entire chunk-5b corpus |
| 8 (footer). `ts-tree-explorer.preview-header.css` + media | L2272–L2369 | `.ts-tree-explorer__preview-header`, `.ts-tree-explorer__preview-name`, `.ts-tree-explorer__preview-header .ts-btn`, plus the three `@media (max-width: …)` rules at L1394 / L1410 / L1683 / L2361 / L2366 | Preview-header sub-component + responsive density toggles |

**Recommended action:** when the owner says "not-splitted," he means this file SHOULD be split into eight files (or at minimum five: tokens / shell+tree / topbar / popover / chip-strip). Today, modifying any one block requires loading 94KB of unrelated context.

## Special case: `(partial)` annotation on ts-oce-panel-styles — what's missing

The parenthetical `(partial)` is the owner's self-flag. Grep + targeted slice-reads identify three distinct kinds of "missing":

1. **Missing preamble (lines 1–396 of banner-generator file).** The partial file starts at `.ts-oce-panel.ts-banner-generator-app {` (its L5), skipping the `:root --ts-oce-width/--ts-oce-tab-h/--ts-oce-header-h` block, the FAB selectors (`.ts-oce-fab`, `.ts-oce-fab--tab`, `.ts-oce-fab:hover`), the backdrop `.ts-oce-overlay` + `.ts-oce--open` open-state, the panel shell `.ts-oce-panel` + `.ts-oce-panel__inner`, the panel header `.ts-oce-panel .ts-oce-panel__header` + title + actions + close-button, the panel tabs `.ts-oce-panel__tabs` + `.ts-oce-tab`, and the 100-line OWNER NOTES + global-inheritance-policy comment (banner L293–393). All of these ARE present in the banner-generator file. The "(partial)" file relies on them being loaded first.
2. **Missing card-shell rules between the OCE-panel cartel and the banner-generator overrides.** The banner file has a long `.ts-oce-panel__inner .ts-card` + `.ts-oce-field` block (banner L841–966) before re-entering the toggle/topbar section. The partial file truncates this — the `.ts-oce-panel__inner` shell rules are partly in the partial file (L446, L450, L482) but the connective tissue (`.ts-oce-field label`, `.ts-color-preset:hover`, `.ts-oce-close:hover`) appears at L539–555 of partial — which is OUT OF ORDER vs banner's L934–965. The partial file appears to have been compiled from a different selector group order; merging will require de-duplication.
3. **Banner-generator file is ALSO partial in the other direction.** The OCE-light-theme tail in partial L6510–7035 (`/* OWNER's FIX: dynamic color system migration (CRAZY_FIX_RULES) */`, light-mode `[data-theme="light"]` overrides for ts-nav, sections, cards/panels, accordions, sortable, footer, modal, toast, tabs, section-divider, nav-active, accent-bar, toggle/range) DOES NOT appear in the banner-generator file. So "(partial)" cuts BOTH ways: each file holds 5,000+ lines the other doesn't.

**Verdict — neither file is canonical alone.** The "full" OCE-panel CSS would be: banner-generator preamble (L1–396) + shared body (~5,000 lines of `.ts-oce-panel.ts-banner-generator-app`, forms, accordions, color-swatches, ui-select, number-input, chips, range, toggle, layout grid, dropdown, scope-isolated tokens) + partial-only OCE light-theme overrides (~700 lines). Total ~7,800 lines = ~245KB once merged and de-duplicated.

## Special case: banner-generator relationship to `docs/references/generator/`

The banner-generator file is the CSS asset that styles the reference app under `docs/references/generator/` (per CLAUDE.md top-level index: "generator/ — Banner-generator reference app — HTML, JS modules, presets"). All `.ts-banner-generator-app` scope selectors in this CSS correspond to the root class set on the generator app's `<body>` (verified by selector `.ts-banner-generator-app body` at L1111). The file contains DOM-tied selectors `#ts-panel`, `#ts-panel-tabs`, `#ts-panel-body`, `#ts-topbar`, `#ts-main`, `#animation-controls`, `#input-animated` — these IDs are the generator app's static DOM hooks. The CSS scoping pattern `.ts-banner-generator-app … .ts-card-rows .ts-field …` (5–8 selector-deep) is the worst specificity profile in the entire chunk-5b corpus and the dominant cleanup burden.

The file repeatedly DOUBLES its selectors: `.ts-banner-generator-app .ts-card-rows .ts-field, .ts-field { … }` (L4008–4009 banner, L3613–3614 partial). Each rule appears TWICE — once app-scoped, once global. This is the failed-migration debris of "promote to global / keep scoped fallback." Cleanup: pick global, delete app-scoped duplicate. The OWNER NOTES block at banner L293–393 explicitly mandates this consolidation (see "Critical annotations" below).

---

## Per-file catalog

### ts-tree-explorer-styles(not-splitted).css

- **Path:** `docs/references/toolskin.css_extracted-core-blocks-to-refactor/views/ts-tree-explorer-styles(not-splitted).css`
- **Lines:** 2,369  ·  **Bytes:** 94,298
- **`--ts-*` token declarations:** **111** total. Major groups:
  - Tree token cartel (L102–164): `--ts-accent` (overridden to `--ts-accent-tree!important`), `--ts-tree-row-h` (THE single base rescale lever), `--ts-tree-row-gap/pad-x/pad-y/gap/indent` (derivative geometry), `--ts-tree-fs/icon/twist/radius`, `--ts-tree-guide/guide-active/guide-w/guide-radius` (connector ornament), `--ts-tree-folder-icon/folder-color/file-icon/icon-scale-file`, `--ts-tree-label/label-folder/label-hover/label-rest-op/meta` (semantic color roles), `--ts-tree-row-bg/row-hover/row-focus/row-active/row-active-bar/mark-bg/mark-fg` (state surfaces — note L147 then L148 both declare `--ts-tree-row-hover` with DIFFERENT values; the second wins, the first is an unflagged A/B), `--ts-tree-dur/ease`, `--ts-tree-max/gutter`, `--ts-tree-actionbar-h: 60px` (LIVE at L163 outside of any selector, a stray declaration at the wrong indent level), `--ts-topbar-constrain`.
  - Curved-variant overrides (L204–209): `--ts-tree-row-h: 2rem`, `--ts-tree-guide-radius: calc(... * 0.42)`, `--ts-tree-max: 78rem`, `--ts-tree-label-rest-op: 1`, `--ts-tree-guide` (re-derived with `--ts-text-muted`), `--ts-tree-radius: var(--ts-radius-sm, 6px)`.
  - Surface re-anchors at component boundaries: L174 `--ts-this-bg: var(--ts-bg-0)` (`.ts-tree-explorer`), L431 `--ts-this-bg: var(--ts-bg-1)` (`.ts-tree__row`), L793 `--ts-this-bg: var(--ts-bg-1)`, L1127 `--ts-this-bg: var(--ts-bg-2-t)`, L1148 `--ts-this-bg: var(--ts-bg-0)` (topbar input), L1198 `--ts-this-bg: var(--ts-bg-0)`, L1218 `--ts-this-bg: var(--ts-accent)` (active button), L1258 `--ts-this-bg: var(--ts-bg-1)`, L1277 `--ts-this-bg: var(--ts-bg-3)` (focused input), L1872 `--ts-this-bg: var(--ts-popover-bg-surface)` (popover), L1910 same, L2151 `--ts-this-bg: var(--ts-accent-border-hover)` (active chip), L2163 `--ts-this-bg: var(--ts-bg-0)`, L2181 `--ts-this-bg: var(--ts-bg-0)`. **15 surface re-anchor sites.**
  - Popover cartel (L1854–1868): `--ts-popover-rad`, `--ts-popover-border`, `--ts-popover-bg`, `--ts-popover-bg-surface`, `--ts-popover-bg-surface-alt`, `--ts-popover-color`, `--ts-popover-icon`, `--ts-popover-active`, `--ts-popover-w: 220px`, `--ts-popover-item-bg/item-pad`, `--ts-popover-fs/lh`.
  - Chip-strip cartel (L2099–2107): `--ts-chip-border` (currentcolor-derived, like chunk 4a chips), `--ts-chip-border-active`, `--ts-chip-bg` (set inside chip).
  - Misc: `--ts-input-bg/border/radius` (L1149–1151, scoped to `#ts-topbar .ts-input-group`), `--ts-tree-action-menu-h/radius` (L881–882), `--ts-feat-icon-gap/feat-item-pad/feat-item-gap` (intro panel), `--ts-this-bg-grad-dark-pct: 3%`/`13%` (L941, L2079 — gradient-strength override), `--ts-this-bg-border: var(--ts-this-bg-border-focus)` (L1279, focused input border re-anchor), `--ts-tree-icon-size` (L257, declared inside `.ts-this-bg: currentColor` rule — odd nesting).
- **`--ts-*` token references:** **413** total. Heaviest consumers: `--ts-this-bg-*` derivative chain (~80 refs), `--ts-text-*` family (~55 refs), `--ts-accent` family (~45 refs), `--ts-tree-*` self-derived consumption (~120 refs internal to the file's own cartel), `--ts-sp-*`/`--ts-radius-*`/`--ts-fs-*` spacing/sizing primitives (~70 refs).
- **`--ts-bg-N` direct-reference contribution:** **18 LIVE references** (per `grep --ts-bg-[0-9]\b|--ts-bg-body\b`). Breakdown (line numbers from the declarations grep above):
  - `--ts-bg-0`: L174, L1148, L1198, L1857, L2163, L2181 = **6 refs** (component-root re-anchors, ALL of which should migrate to `--ts-this-bg-dim-N` or remain as ONE root with derivative cascade)
  - `--ts-bg-1`: L431, L793, L1258 = **3 refs** (action-bar / row re-anchors)
  - `--ts-bg-2`: L147 (commented-out variant of row-hover), L1858 (popover surface alt) = **2 refs** (one is dead code)
  - `--ts-bg-2-t`: L1127 = **1 ref** (translucent surface — uses the `-t` transparent variant which doesn't exist in `assets/css/next/system/surfaces.css` yet)
  - `--ts-bg-3`: L1277 = **1 ref**
  - **No `--ts-bg-body` LIVE refs.**
  - Total: ~13 LIVE component-tier refs (+ ~5 in fallback positions or commented). **All violate Rule 15 / refusal pattern R-rule-15.**
- **`oklch(from ...)` Wave 1.6 anti-pattern:** **NONE.** (Tree file is clean of this anti-pattern.)
- **Selectors / IDs (high-level):** `.ts-tree-explorer`, `.ts-tree-explorer.tree--scroll .ts-tree-explorer__body`, `.ts-tree-explorer.tree--scroll .ts-tree-explorer__foot`, `.ts-tree-explorer__intro` + `.hide-section`, `.ts-tree-explorer__intro-bullets.ts-list`, `.ts-tree-explorer__preview-header` + `.ts-tree-explorer__preview-name`, `.ts-tree-explorer__search-group`, `.ts-tree-explorer__actionbar-title/actions`, `.ts-tree`, `.ts-tree__node`, `.ts-tree__children`, `.ts-tree__row` + states, `.ts-tree__label`, `.ts-btn-group` + `.ts-btn` children, `.ts-btn::hover` (⚠ INVALID CSS — should be `:hover`, double-colon is for pseudo-elements; this rule never matches), `#ts-topbar` + 14 nested scope variants (`:not(:has(...))`, `:has(...)`, `.ts-input-group`, `.ts-tree-explorer__search-group`, `.theme-toggle`, etc.), `.ts-tree-popover`, `#ts-taxonomy.ts-chips`, chip-strip data-active variants. **ID-anchored:** `#ts-topbar` (extensive — fully ID-scoped), `#ts-taxonomy` (chip strip, ID-scoped).
- **`@media` queries:** 6 — `(prefers-reduced-motion: reduce)` L212, `(max-width: 960px)` L761, `(max-width: 640px)` L995, `(max-width: 868px)` L1394, `(max-width: 600px)` L1410, `(max-width: 600px)` L1683, plus two density-toggles at L2361, L2366. **No `@property`, no `@container`, no `@keyframes`, no `@supports`.**
- **Non-OKLCH literals:** check via separate grep — file is mostly `color-mix(in srgb, var(--ts-…), transparent X%)` driven; very few raw hex / rgb / hsl literals. Counted from the declarations grep: zero raw hex declarations at root (the only hex-like values are `0%`, `0px` fallbacks). **Tree file is the CLEANEST of the 3 in chunk 5b for color tokenization** despite its bg-N violations.
- **Owner annotations / critical comments (VERBATIM, line-anchored):**
  - L3–15 — file header: `"TOOLSKIN . FILE TREE EXPLORER … A token-driven tree view built entirely on the Toolskin design system. Every gap, pad, border, colour, surface and type size is a derivative declared once on the main scope: .ts-tree-explorer … To re-tune the whole component, change ONE value: --ts-tree-row-h -> rescales rows, pads, gaps, indent, type, icons / --ts-this-bg -> re-derives every surface, border & state / --ts-accent-h/s/l -> re-themes every accent (Toolskin engine) … Light / dark is free: every value resolves through Toolskin tokens, so [data-theme="light"] adapts the whole tree with zero extra CSS."` — **the canonical statement of the "single base lever" design intent** (Wave 1.6 "OQ-D1 confirmed: ratio-driven derivative scaling"). Tree-explorer is the cleanest realization of this principle in the catalog.
  - L19–98 — `FAILED @refactor-note:tree-token-cascade-2026-05-16` + `@owner-fix:tree-token-cascade-2026-05-16` — a 79-line postmortem of a botched refactor. Verbatim key passages:
    - L19–30: "Removed `:root [class*=\"ts-tree\"] *` selector that explicitly reset all tokens on every descendant. Tokens now inherit normally from .ts-tree-explorer scope, which is what custom property semantics intend. The previous explicit-on-descendant pattern was masking the density attribute response (parent's density rule wrote correct value but the `*` rule re-wrote it on every child, neutralizing the effect)."
    - L33–48: "PARTIAL REVERT + STABILIZATION. Re-enabled `:root [class*=\"ts-tree\"]` scope alias. Reason: Removing this rule broke token propagation across the tree system. Tokens were not reaching dependent classes/components because this selector was intentionally acting as a distribution layer, not just a reset. This architecture does NOT rely purely on passive inheritance. It requires scoped propagation for tokens to reach all consumers. Do NOT remove this again."
    - L69–78: "CRITICAL NOTE. Several core cascade rules were removed without verifying: token reachability, specificity resolution, dependency coverage. This caused a system-wide regression. Rules were recovered and re-integrated manually."
    - L81–95: "DIRECTIVE. Do NOT refactor or remove foundational cascade rules without: 1. Full token propagation verification 2. Cascade + specificity validation 3. Safe rollback snapshot. SUMMARY: - Token delivery was broken → now restored - System stabilized - This rule is REQUIRED, not redundant. Do not remove without a full cascade audit."
    - **Council implication:** this postmortem is direct evidence supporting the rebuild's §13 "explicit `:is(...)` enumeration" strategy over substring-distribution. The owner here is preserving a `:root [class*="ts-tree"]` substring-distribution selector because removing it caused regression — but the rebuild's S2 spec (`_rebuild-system-spec.md`) replaces this pattern with explicit enumeration designed at block-layer time. The owner's postmortem doesn't conflict with the rebuild plan; it confirms WHY substring-distribution is hard to remove in the legacy codebase (and why the rebuild must engineer the replacement up-front, not retrofit).
  - L125: `/* 0 = classic ├── └── ; non-zero only honoured by the [data-tree-variant="curved"] block */` — documents the connector ornament toggle.
  - L128–132: `/* Folder icons: The cascade variable --ts-tree-folder-color starts as accent at the top of the tree and is overridden to secondary at depth >= 3 (children-of-children-of-children). Hover / selected / expanded then lifts it back to accent. Files default to secondary. */` — the cascade-depth color rule.
  - L168–171 — file's MAIN-SCOPE header: `"MAIN SCOPE - every component token is declared here, exactly once. Children only ever *consume* these tokens (Toolskin two-layer rule)."` — explicit Rule 2-tier statement.
  - L197–203 — `"ALTERNATE THEME: 'curved' — the iteration-1 design preserved. Add data-tree-variant='curved' to the .ts-tree-explorer root. Brings back rounded-L elbows, tight rows, twist on the left, …"` — variant-via-data-attribute pattern (Rule 7 / pattern-opt-in conformance).
  - L193–195 — inline comment inside `.ts-tree-explorer`: `"modified the dom o make possible the stikcy tookbar inside the exoplorer and movedthe section with nfooutsidethe cotnianer for proper dom usage. the height is calculated but we need to sovle the scrollingaccuracy usbailty. and scrol snap´ping."` — open issue: height calc + scroll-snap not yet solved.
  - L1154–1156: `"@search_expandable — opt-in variant for an icon-only collapsed [search input]"`.
  - L1178: `"@ts-topbar_tree_scope — structural block, must remain intact."`
  - L1331: `"@refactor-note:topbar-unification-2026-05-16"` — companion to the tree-cascade postmortem; topbar block was unified the same week.
  - L1813–1814 + L1815–L1939 — `"END OF THE OLD VERISON TO TURN INTO A VARIANT."` then a long `NOTE — VARIANT WORK PENDING (see step 4): …` planning block for the variant-as-token-swap pattern (tokenization sample for the main variant).
  - L1938: `"@taxonomy_chips_strip — KEEP design output identical; refactor structure only"` — **Rule 9 locked-design-input declaration** (the 10 protected values are LOCKED).
  - L1815–L2067 (53 lines, INSIDE the chip-strip block): **REFACTOR REQUIREMENTS** spec, verbatim section headers:
    - "1. SCOPED ROOT TOKEN SETUP (chips variant) — Wrap the chip-level overrides on this component into a scoped root token block — same pattern used in every other asset-layer refactor. The chips here must INHERIT the original `.ts-chips` tokens and only swap the values that this variant changes (height, padding, gap, surface context). No new unique selectors per chip; the variant is a token swap on the existing `.ts-chips` base. Goal: stop fighting `.ts-chips` styling with overrides. Make this instance a tokenized variant of `.ts-chips`, not a re-style of it."
    - "2. HORIZONTAL SCROLL — REPLACE THE CURRENT METHOD … expose it as a GLOBAL reusable asset — e.g. `.ts-scrollstrip` or `.ts-actionbar-scroll` — usable by any 'scrollable navigation / filter bar / nested-action row' elsewhere in the system. This component then composes that asset, it does not redefine the behavior."
    - "3. TRUNCATION DROPDOWN (accessibility companion) — `toolskin.js` already ships a truncation-dropdown helper. Wire it into this strip so a 'more filters' / overflow trigger appears beside the scrollable region."
    - "4. ROW SIBLING SHRINK / COLLAPSE PRIORITY — This strip needs WIDTH PRIORITY over the other two siblings on its row. Add media queries (or container queries — preferred if the row is a CQ context) so that as the row narrows: Sibling buttons collapse to icon-only mode. Any sibling container shrinks, yielding horizontal space. This strip retains its `flex: 1 1 var(--_chips-max-w)` claim and grows into the freed space."
    - "5. CHIP STYLING INHERITANCE — The chips inside this strip must inherit every token and state style from the base `.ts-chips` chip rules. The current customization fights that inheritance. After the scoped root token setup in #1, the chip children should style themselves automatically — no per-chip overrides inside this selector."
    - "GUARDRAILS — !important CLEANUP + DEDUP PROCEDURE … Both `!important` declarations on the gradient/background are present ONLY because base `.ts-chips` rules in toolskin.css currently win, and because the HTML still drops head-level styles. The cleanup order is: a. Remove the migrated CSS from the HTML <head> first. b. Dedupe redundant `.ts-chips` rules inside toolskin.css so this instance's declarations land naturally in the cascade and no longer need `!important`. c. Only then remove the `!important` flags here. Do not skip steps or reorder them."
    - "VISUAL PARITY PROTOCOL (required, no exceptions): 1. Snapshot the rendered output BEFORE any change … 2. Implement the refactor. 3. Snapshot again under the exact same conditions. 4. Diff the before/after snapshots pixel-by-pixel. If anything changed — gradient softness, fade width, chip alignment, border color, height, anything — fix and re-snapshot until parity is confirmed. 5. Only commit once the final diff is clean."
    - **This 53-line spec is gold** — it's the owner's explicit blueprint for the chip-strip variant pattern, the global `.ts-scrollstrip` asset proposal, the toolskin.js truncation-dropdown wiring, the responsive sibling-shrink with container queries, the `!important` cleanup order, and the visual-parity protocol. It maps directly onto the rebuild's Pattern 17 (visual audit before specs) + Rule 9 (chip-strip LOCKED) + the design-DNA visual-parity gates.
  - L2208–2210: `"@taxonomy_chips_strip — TRUNCATION DROPDOWN companion (docstring §3)."` — implements requirement #3 above.
  - L2306–2308: `"Note: the .ts-tree-explorer__actionbar-title/actions width budget"` — partial comment, action-bar width budget concern.
  - L1872, L1934 — `/*NOTE: hardforced, eliminate per step 3*/` — two `!important` / hard-forced declarations slated for removal once dependency cleanup completes.
- **Refactor flags:**
  - **SPLIT THE FILE.** Per "(not-splitted)" annotation. 5–7 sub-files proposed above. HIGH PRIORITY.
  - **L147 / L148 — `--ts-tree-row-hover` declared TWICE with different values.** Second wins. First is unflagged A/B. Cleanup: delete L147.
  - **L163 — `--ts-tree-actionbar-h: 60px` declared outside any selector (or at the wrong indent).** Stray declaration — verify scope; may be silently invalid.
  - **L1210 — `.ts-btn::hover` (double-colon) — INVALID CSS.** Never matches. Cleanup: fix to `.ts-btn:hover`.
  - **18 LIVE `--ts-bg-N` direct references** — all violate Rule 15 / R-rule-15. Migration: re-anchor each component's `--ts-this-bg` once; let derivatives cascade.
  - **`--ts-bg-2-t` referenced at L1127** — the transparent variant doesn't yet exist in `assets/css/next/system/surfaces.css`; either add the `-t` derivative tier or migrate to a `color-mix` against `--ts-this-bg`.
  - **`!important` overuse** — L102 (`--ts-accent`), L419 (`height: var(--ts-tree-row-h)!important`), L1150 (`--ts-input-border`), L2069–2070 (`mask-image: none!important`), and several others. Cleanup per the chip-strip spec's three-step procedure.
  - **`:root [class*="ts-tree"]` substring-distribution selector** at L100 — owner's postmortem mandates it stays; rebuild's S2 spec replaces this pattern. Council note: this is an existing tension; the rebuild must engineer explicit enumeration up-front, the legacy file cannot be refactored in-place without regression risk per L19–98 postmortem.
  - **6 `@media` queries but no `@container` queries** — chip-strip refactor spec #4 explicitly prefers container queries; the file does not yet use them.
  - **Hardforced `--ts-this-bg` re-anchors inside popover (L1872 + L1934)** — owner-flagged for removal "per step 3."

### ts-oce-panel-banner-generator-styles.css

- **Path:** `docs/references/toolskin.css_extracted-core-blocks-to-refactor/views/ts-oce-panel-banner-generator-styles.css`
- **Lines:** 6,903  ·  **Bytes:** 210,705
- **Block type:** the full banner-generator-app reference application + the OCE quick-editor offcanvas that wraps it. **Largest single CSS file in the entire reference catalog.**
- **`--ts-*` token declarations:** **523** total — the highest density in chunk 5b. Major groups:
  - OCE width/header tokens (L3–5, `:root` scope): `--ts-oce-width: min(22rem, 92vw)`, `--ts-oce-tab-h: 48px`, `--ts-oce-header-h: 60px`.
  - FAB local re-anchors (L49, L52, L57): `--ts-this-bg-bright`, `--ts-this-bg: var(--ts-bg-0)`, `--ts-this-bg-bright` (hover, second declaration).
  - OCE panel cartel (L151–192): `--ts-this-bg: var(--ts-bg-0)`, `--ts-panel-border: var(--ts-this-bg-border)`, `--ts-fs-base: 0.78rem` (⚠ VIOLATES RULING 3 — base font is 13px, not 0.78rem ≈10.14px), `--ts-card-title-fs`, `--ts-card-header-h: 40px`, plus the close-button + tab cartel.
  - OCE tab token group (L246–289): tab variants `--ts-this-bg: transparent / var(--ts-bg-2/3/1)`.
  - **OCE-panel banner-generator app cartel** (L402–421, the largest single cartel — 18 tokens): `--ts-panel-w: 400px`, `--ts-card-pad/gap/sp/radius/header-h`, `--ts-card-bg: var(--ts-bg-1-t)`, `--ts-card-bg-2: var(--ts-bg-2)`, `--ts-card-border`, `--ts-input-fs/pad-y/pad-left/radius`, `--ts-btn-radius/fs`, `--ts-range-h/thumb/bg/border/rad`. All consume direct `--ts-bg-N` primitives.
  - Panel-inner re-anchors (L432, L443, L466–468, L481): `--ts-this-bg: var(--ts-panel-bg)`, `--ts-ptab-aborder/pad-y/pad-x`, `--ts-this-bg: var(--ts-bg-body)`.
  - **Panel isolation cartel** (L601–765): `[data-theme="light"] .ts-oce-panel[data-ts-oce-isolated]` re-declares THE ENTIRE PRIMITIVE + SYSTEM TOKEN LAYER inline with hex literals (`--ts-bg-body: #0c0d0f`, `--ts-bg-0..5` hex, `--ts-bg-0-t..4-t`, `--ts-text-primary/secondary/muted` hex, `--ts-border-0..4`, `color-scheme: dark`, `--ts-input-bg/border`) PLUS the full accent-derivative chain (`--ts-on-accent` via the `oklch(from ...)` Wave 1.6 anti-pattern at L627, `--ts-accent-bright/bright-2/dark/dark-2/muted/border/border-hover` — all via raw `color-mix`), `--ts-accent-grad/grad-comp/grad-flat` (3 gradient variants), the FULL `--ts-this-bg-*` derivative chain (`--ts-this-bg-bright/bright-1/bright-2/bright-3/dim/dim-2/dim-3/dim-4/dark/dark-1/dark-2/muted/grad/grad-comp/grad-flat/grad-1/grad-2/grad-3/grad-4`), border variants, hover/active/focus/disabled, text-color derivatives. **This is the OCE panel forcibly maintaining dark-mode visuals even when the host page is in light mode.** ~100 tokens declared in a single block.
  - Toggle/range cartel sub-section, button cartel sub-section (L815–870 + L850–870), then THOUSANDS of selector-scoped token applications for the banner-generator app body, topbar, buttons, canvas, ranges, cards, fields, color-rows, swatches, number-inputs, ui-select, dropdowns, charts, layout grid.
- **`--ts-*` token references:** **1,524** total — the highest in chunk 5b. The file CONSUMES the system derivative chain on essentially every rule.
- **`--ts-bg-N` direct-reference contribution:** **112 LIVE references** (per grep). This is by far the worst chunk 5b file. The panel-isolation block alone re-declares all 6 `--ts-bg-N` AND consumes many more inline. Sample lines: L52, L151, L191, L247, L280, L289, L408–409, L419, L432, L443, L466, L481, L644, L652, L713 (`--ts-this-bg-focus-outline: var(--ts-accent, #ff540a)`), L1138, ... (112 total). **The biggest single contributor to the cross-chunk `--ts-bg-N` debt.**
- **`oklch(from ...)` Wave 1.6 anti-pattern:** **1 instance** — L627 `--ts-on-accent: oklch(from var(--ts-accent) clamp(0, (0.75 - l) * 999, 1) 0 0)`. Wave 1.6 Resolution #1 mandates engine-derived constants, not runtime `from`. R-rule-15 / engine-constant violation.
- **Selectors:** ~600 distinct selectors (sampled). Highest specificity profile in chunk 5b — `.ts-banner-generator-app .ts-card-rows .ts-field .ts-color-row:not(.vertical) .ts-color-swatch input[type="color"]` (8-selector-deep) appears 20+ times. **Heavy duplication:** nearly every rule is doubled `.ts-banner-generator-app SELECTOR, SELECTOR { … }` (app-scoped + global). Cleanup mandate per L293–393 OWNER NOTES: pick global, delete scoped.
- **`@keyframes` / `@media`:** `spin` at L2566, `(max-width: 860px)` L2630, `(max-width: 380px)` L3870, `(min-width: 860px)` L3881, `(min-width: 400px)` L3887, `(max-width: 720px)` L6704, `(min-width: 880px)` L6766, `(max-width: 880px)` L6802. **8 media queries** (most of any chunk-5b file). **No `@container`, no `@property`, no `@supports`, no `@layer`.**
- **Non-OKLCH literals:** hundreds — every `--ts-bg-N` redeclaration in the panel-isolation block carries a hex (e.g. `#0c0d0f`, `#111214`, `#17181b`, `#1f2024`, `#28292e`, `#323439`, `#3e4045`, `#e8e9ea`, `#9ea0a5`, `#6d6f74`), plus `#ffffff`/`#000000`/`#fff`/`#000` inside `color-mix()` literals throughout the derivative chain (~80 instances), plus the FAB and accent fallbacks `#ff540a`, plus the partial-file tail's light-theme hex declarations. **Estimate: 200+ raw color literals.** Most are inside the panel-isolation re-declaration block; cleanup means deleting that block in favor of inheriting the production primitive layer.
- **Owner annotations / critical comments (VERBATIM, line-anchored):**
  - L1: `"═══ Showcase: offcanvas quick editor (restored original + enhanced) ═══"`
  - L154–164 (inside `.ts-oce-panel`): `"B10: single-line typography base override per restyling-arch §4."` — explicit reference to the April 2026 restyling-architecture spec (§5 architecture canonical).
  - L293–294 — **OWNER NOTES: component inheritance + scope isolation refactor (banner/pattern generators)** — verbatim opening: `"NEW Refactor Note URGENT: move all stable, well-designed component styles to the global scope so they are inherited across contexts. this scope must only define isolated, feature-specific variants. eliminate duplicated definitions and override chains. unify all shared UI assets between banner generator and pattern generator into a single canonical system."`
  - L296–393 (98 lines, banner-generator's master refactor spec, verbatim section list):
    - `"toolskin ui system — global inheritance + scoped isolation (v1)"`
    - "Why: components are currently redefined across scopes (banner/pattern), causing redundancy, inconsistencies, and broken behaviors."
    - "v1 fix: promote all base component styles to global scope and restrict scoped files to minimal, isolated overrides and variants only."
    - "Components to unify globally: ranges (.ts-range, .ts-range-row, .ts-range-val) · chips · anchor grid/buttons · buttons (+ variants, incl. .ts-input-btn) · inputs (+ variants) · input groups/wrappers · color utilities · toggles · layout system."
    - "Toggle system fixes (global, not scoped): correct left padding behavior for .ts-toggle-label (match input padding when no icon is present); support multiline labels with clamp/ellipsis (up to 2 lines) in constrained sidebar widths; no media queries; must be intrinsic/responsive and inherited."
    - "Scope isolation rules (banner/pattern generators): only lock: font-size, border-radius, font-family, surface relations, accent colors, and protected editable vars; these locked tokens must not be affected by live editing panels; panel edits affect global UI, not the tool's internal core values; spacing and typography inside tools must remain controlled."
    - "Theme behavior: banner/pattern generators share identical UI system → must stay consistent; default to isolated dark mode context (independent from showcase state); light mode only applied via explicit user toggle (topbar); optional lock/unlock mechanism (boolean) to control theme inheritance."
    - "Strategy: remove all duplicated scoped component definitions; build a dedicated showcase to audit and normalize each component; reconstruct unified CSS from a single canonical source; enforce inheritance-first architecture."
    - "Hard rules: no component redefinitions per scope; no override chains fixing previous overrides; scoped files = variants only, never base styles; shared UI must be defined once and reused everywhere."
    - L359–391 — **NOTE: tagged elements extraction + consolidation protocol** — verbatim: `"NEW Refactor Note: tagged elements must NOT be deleted or rolled back. all tagged assets must be extracted, accumulated, compared, and documented in a centralized audit document. these elements define key visual aspects of the frontend and must be preserved. no loss of data or visual behavior is allowed."` + the `@ts-component-consolidate` audit workflow (extract → accumulate → compare → mark @extracted_for_v1 → derive unified asset). **THIS IS THE OWNER'S MASTER REFACTOR-SCOPE DECLARATION FOR THE OCE-PANEL CHUNK.**
  - L596: `"PANEL ISOLATION: always dark regardless of page theme"` — declares the rationale for the 100-token panel-isolation cartel.
  - L626: `"✅ ACCENT TOKENS - Panel dark isolation (same 0.75 threshold as dark mode)"` — context for the `oklch(from ...)` anti-pattern (the owner is intentionally matching the dark-mode threshold for the isolated panel).
  - L957–962 — `"Add from here on down to the end of the file / Quick style adjhustents to aply overrides on this header styles above"` — entry-point marker for the post-restoration appendix.
  - L964: `"§6e TOGGLE SWITCH (REFACTOR NOTE: his is one of the elkements to be unified as mentione don the refactor note)"` — toggle-switch unification mandate.
  - L1054–1097: `@ts-component-consolidate` tags on 6 toggle-related blocks.
  - L1331: `"@refactor-note:topbar-unification-2026-05-16"` — companion to the tree-file's topbar-unification annotation.
  - L1449–1452 (and 5+ other clusters): `/* @refactor:backdrop-critical */ /* @refactor:glass-dependent */ /* @refactor:needs-solid-fallback */ /* @refactor:token-dependency */` — 4-tag refactor flag pattern, marking blocks that depend on backdrop-filter glass effects and need solid fallbacks. Appears 5+ times in this file.
  - L1713 + L1739: `"OWNER NOTE: input gradient delegation (Lush Mode) … Refer to Lush mode ON THE REFACTOR NOTES. THESE ELEMENTS MUST BE DEDUPED ON THE TAGS @ts-component-consolidate"` — `@Lush Mode` is the owner's term for a global "background-image enabled" mode for inputs/buttons; this file has multiple Lush-Mode-pending blocks.
  - L1972: `"is currently fragmented, duplicated, and partially inconsistent across scopes."`
  - L2012, L2057, L2097, L2103, L2172: 5 `#LOCAL_NOTE` annotations on token dedupe / sibling-rule preservation directives.
  - L2887: `"#CRAZY_CODE_FIX: DUPLICATE DELETED #1"` — explicit marker. L2998 same for #2.
  - L3265, L4341, L4998: identical-text 3-time repetition of `"#NEW REFACTOR NOTES: All the inputs that has gradients by default must be removed and be delegated globally to a global button and input styling mode 'Lush Mode'. WHICH SHOULD NABLE THE BACKGRUND IMAGES FOR THE INPUTS that has already the ts-this-bg built and only needs the image set to work. the hover state should support it too."` — the **Lush Mode global refactor spec**, repeated three times in the same file (indicating its importance OR the file's failed-consolidation history).
  - L3512 + L3593 + L4935 + L4936 + L4954 + L4956: `"REFACTOR NOTES AND HIGHLIGHTS: refactoring needs the / tokenization to prevent repeated declarations and make the color smart and responsive on childs / Tokens that needs to be centralized"` — 6× duplicated refactor-tokenization notes.
  - L3736–3770: `"LAYOUT REFACTOR INSTRUCTIONS (Bootstrap'like grid)"` + `"SPECIAL NOTES:"` — the panel's grid-system refactor spec.
  - L3899: `"#CRAZY_FIX_RULES this si redefined several times., so pelase extratc this adn comapre it to keept he best version. only extratc the structural styles and thg ebest ones. to keep the ones thta are build qwith proportional calculation based and token using based styles. not static ones. then we must delegate the coloring patterns to another rule set inclduign this asset."` — extractor instruction for duplicated rules.
  - L4133: `"#CRAZY_FIX_RULES superseded by R12 consolidation: original rule scoped only to .ts-banner-generator-app."` — R12 consolidation reference (chunk-4b R12 spec).
  - L4106 + L4159: `"Docs: toggle-row spacing reconciliation (B23 Wave 2 / R12). / R12 — OCE-panel two-column toggle-row inline-padding tightening."` — references to the Wave 2 B23 rule + R12.
  - L5176–5183 + L5797–5823: **`@ts-component-consolidate` UI-select consolidation spec** (8-line + 30-line block): `"It MUST be aligned with the base `.ts-ui-select` system defined in the … These partially duplicate `.ts-ui-select` structure … This asset has been REFACTORED into a portable component variant of `.ts-ui-select` and MUST reside in the GLOBAL component scope … MUST NOT: [defining final colors locally] … This component MUST: [inherit, not override; declare variants only via data attributes]."`
  - L5243 + L5319: `"REQUIRED REFACTOR / 6. REMOVE / REPLACE 'CRAZY_FIX_RULES'"` — explicit cleanup steps for the UI-select consolidation.
  - L5376: `"NEW NOTE: PLESE GREP THE BLOCK FOUND BY SEARCHING FOR @consolidate_select_component"` — explicit cross-file grep instruction.
  - L5718: `"this block MUST NOT define final colors"` — token-tier-violation guardrail.
  - L5772: `"#CRAZY_FIX_RULES: added a hardcoded css placehoplder replacement for the icon when theresno icon selected. this should be done with js instead of this."` — hardcoded-icon-fix flagged for JS migration.
  - L5993: `"OWNER REFACTOR NOTES 13 MAY: THESE RULES ARE OK. BUT ON THE CURRENT PLAN THEY NEED TO BE MOVED TO GENERAL SCOPE FUNCTIONALITY. ONLY EXCLUDED BY SPECIIFC SCOPES LIKE APPS OR TOOLS."`
  - L6248: `"WHY THIS MUST REMAIN LOCAL"` — counter-rationale: certain rules SHOULD stay scoped. The OCE-panel is a tool-scope; not everything globalizes.
  - L6335: `"@consolidate_select_component: HERE ARE MORE SPARED BLOCKS OF THE SELECT UI COMPONENT AGAIN. i didi grouped this. BUT HERE TEY ARE AGAIN ROLLED BACK. SO WE MUST UNIFY TE COMPONENT AND ESNURE THERE AR ENO REDUNDANCUIES AMD MAKE ASINGLE RULESET GROUP FOR THE VARIANTS OF THIS COMPONENT VALUD FOR ANY SCOPE. I ALREADY DID THIS. AND IS MARED AS SOLVED. BUT CANNOTFIND THAT RECORD ANYWHERE."` — **owner's frustration log**: he previously consolidated the select component, but a rollback re-introduced the duplicates and he can't find his own consolidation record. **This is direct evidence for Pattern 18 Session Continuity Protocol** — the owner himself lost the resolution record. The rebuild's `.remember/` + checkpoint regime is the answer.
  - L6417: `"#CRAZY_FIX_RULES - tehse are styles thta were supposed to be just for the shopwcase but several style designs are actually goot to be incorporated to the design base components and design pattern base... so let's not lose these i already wrapped and scoped for the showcase., "` — preservation note: do not lose showcase-scoped designs; promote them.
  - L6433: `"#CRAZY_FIX_RULES: these are hardcode styles meant to keep design on the surface cards layout. but these rules must be removed and we must make the layouts gaps and paddighn work smarter than this. this must be removed after the layout is consolidated."`
  - L6712 + L6729: `"Sidebar panel font scope"` / `"Offcanvas Push Sync v2 ───"` — markers for sub-sections.
- **Refactor flags:**
  - **DELETE the panel-isolation `[data-theme="light"] .ts-oce-panel[data-ts-oce-isolated]` block (L601–765).** It re-declares the entire primitive + system + accent layer with hex literals — this is the LOUDEST shadow-of-production-tokens in the entire reference corpus. Replace with: an isolation strategy that re-anchors `--ts-this-bg` (the surface engine) once on the panel root and lets the production derivative chain compute. The owner intent ("always dark regardless of page theme") can be met by overriding `color-scheme: dark` + `--ts-bg-body` only.
  - **`oklch(from var(--ts-accent) clamp(0, (0.75 - l) * 999, 1) 0 0)` at L627** — Wave 1.6 Resolution #1 violation. The on-accent threshold should be an engine-derived constant, not a runtime `oklch(from)` expression. R-rule-15.
  - **`--ts-fs-base: 0.78rem` at L159** — VIOLATES RULING 3. Base font is locked to 13px. 0.78rem at default root = ~10.14px. **R-DNA violation** + needs immediate replacement with the production `--ts-fs-base` value or a panel-private alias `--ts-oce-fs-base`.
  - **8 `--ts-bg-N` direct references in tokens, 112 LIVE refs total in the file** — the worst R-rule-15 contributor in chunk 5b. The OCE token-cartel pattern at L402–421 declares 18 tokens that ALL consume `--ts-bg-N` primitives directly. Migration: introduce a view-private alias layer (`--ts-oce-surface-1..5`) that resolves to `--ts-this-bg-dim-N`, and have the OCE consume the aliases.
  - **Rule-doubling cleanup** — every rule appears as `app-scoped, global-fallback`. Pick one (global), delete the other. Reduces file size by ~30%.
  - **5 instances of the `@refactor:backdrop-critical / glass-dependent / needs-solid-fallback / token-dependency` 4-tag cluster.** Each marks a glass-effect block needing a no-backdrop-filter fallback.
  - **Lush Mode global refactor PENDING** — owner has repeated the spec 3 times (L3265, L4341, L4998). Inputs/buttons with gradient backgrounds must be delegated to a global `lush-mode` opt-in token, not per-component declarations.
  - **`.ts-ui-select` consolidation BLOCKED on owner's lost record** — L6335 frustration log + L5797–5823 + L5176–5183 consolidation spec. Resolution: re-do the consolidation per L5183 verbatim spec; commit with a clear `@extracted_for_v1` marker so the record is preserved.
  - **`@taxonomy_chips_strip` LOCKED design input** — Rule 9. The chip strip's 10 protected values must remain identical visually; refactor structure only.
  - **No `@container` queries** — owner's refactor spec mandates `intrinsic/responsive without media queries` (toggle system fixes, L320–325). The 8 `@media` queries should migrate to container queries where the rule is panel-relative.

### ts-oce-panel-styles(partial).css

- **Path:** `docs/references/toolskin.css_extracted-core-blocks-to-refactor/views/ts-oce-panel-styles(partial).css`
- **Lines:** 7,035  ·  **Bytes:** 218,668
- **Block type:** see "Special case: `(partial)`" above. **Identical to banner-generator file from line ~397 of banner onward, with a different tail (light-theme overrides) after ~L6510 of partial.**
- **`--ts-*` token declarations:** **609** total. Slight superset of banner-generator (523) due to the OCE-light-theme tail. The leading 18-token cartel at L7–26 is byte-identical to banner L402–421 except for indentation.
- **`--ts-*` token references:** **1,600** total. Largest reference count in chunk 5b — slightly higher than banner-generator (1,524) due to the OCE-light-theme tail's 700 extra lines.
- **`--ts-bg-N` direct-reference contribution:** **129 LIVE references.** Even worse than the banner-generator file. The extra 17 over banner-generator come from the L6510–7035 OCE-light-theme tail (every `[data-theme="light"] .ts-X` rule that re-declares `--ts-bg-N`, `--ts-bg-body`, or anchors `--ts-this-bg` to a specific bg primitive).
- **`oklch(from ...)` Wave 1.6 anti-pattern:** **3 instances** — L232, L6551, L6588. Three separate `--ts-on-accent: oklch(from var(--ts-accent) clamp(0, (T - l) * 999, 1) 0 0)` declarations with thresholds 0.75 (L232 + L6588) and 0.55 (L6551). The threshold-difference is itself an anti-pattern: there should not be two different on-accent thresholds in the same file. **3 R-rule-15 violations** (vs 1 in banner).
- **Selectors:** ~620 distinct selectors (sampled — equivalent to banner-generator's ~600 plus the OCE-light-theme tail).
- **`@keyframes` / `@media`:** `spin` at L2171, `(max-width: 860px)` L2235, `(max-width: 380px)` L3475, `(min-width: 860px)` L3486, `(min-width: 400px)` L3492, `(max-width: 720px)` L6309, `(min-width: 880px)` L6371, `(max-width: 880px)` L6407. **8 media queries** (same count as banner-generator). **No `@container`, no `@property`, no `@supports`, no `@layer`.**
- **Non-OKLCH literals:** ~250+ (banner's 200+ plus the OCE-light-theme tail's hex literals: `#000000ed` at L6808, light-mode `#4a4d52` text-muted L6843, transparent black gradients in modal/toast shadows like `rgba(0,0,0,0.18)`/`(0,0,0,0.12)`).
- **Owner annotations / critical comments (VERBATIM, line-anchored, additional to those already cataloged for the shared body):**
  - L6510–6541 — **OWNER's FIX: dynamic color system migration (CRAZY_FIX_RULES)** — multi-line header marking the OCE-light-theme migration block. Verbatim opening: `"OWNER's FIX: dynamic color system migration (CRAZY_FIX_RULES)"` followed by ASCII separators.
  - L6541–6545: `"═══════════════════════════════════════════════════════════════════"` + `"Light mode design tokens ────────────────────────────────────────"` — section delimiters for the light-mode design-tokens overrides.
  - L6636: `"Navigation bar ──── REFACTOR NOTE: fix done, Removed this hardcode ix for light theme... it only made the light mode header worse. conversion on automaic curent status looks good."` — **owner's MISCARRIED-FIX postmortem**: a previous light-theme nav-bar hardcoded fix WORSENED the light-mode header; the fix was removed, and the engine-derived automatic conversion now looks correct. **This is direct evidence supporting Wave 1.6 Resolution #1 (engine-derived constants beat per-theme hand-tuning).**
  - L6677–6694 (Cards / Panels / Pricing section): `"refactor note: added refacroted purpose behaviour with only tpoken based styling. this should be ageneral behaviour. not static declaRATIOUNS. WE NEED TO REMOVE ALL DECLATRATIONS THAT OVERRIDES WITH STYLES AND CENTYRALIZE EVERYTHING TO AUTOMATE THE SYLING SYSTEM."` — **TOKEN-FIRST mandate restated**: all per-component overrides must collapse into the central token engine; nothing should declare a value that overrides a system token.
  - L6713–6730 (Surfaces section): multiple `[data-theme="light"]` blocks **COMMENTED OUT** — owner has already deleted the per-component surface overrides as part of "fix done." The commented-out blocks are historical record only.
  - L6741: `"3. TOAST OFFSET — push when panel is open"` + L6817 `"DEPRECATED TOAST OFFSET — push with margin instead of right"` — toast-positioning migration record.
  - L6953–6957 (Toggle/Range section): `[data-theme] .ts-toggle { --ts-toggle-knob-bg: var(--ts-this-bg-dark-1); --ts-this-bg: var(--ts-bg-3-t); … }` — this is the section that consumes `--ts-bg-3-t` (the transparent variant) — flagging here because the chunk-5b tree-explorer also consumes `--ts-bg-2-t` (L1127) and these `-t` variants don't yet exist in `assets/css/next/system/surfaces.css`. **Cross-chunk pattern:** chunk-5b files assume a transparent-variant tier exists at primitives that the rebuild has not yet declared.
- **Refactor flags:**
  - **MERGE OR DELETE.** Either merge `(partial)` into the banner-generator file (de-duplicate the shared body + append the OCE-light-theme tail) OR keep them split but document the contract (banner-generator = base; partial = OCE-tail-only overlay). The current state — two 95%-overlapping 200KB files — is the worst possible.
  - **3 `oklch(from ...)` Wave 1.6 violations** (L232, L6551, L6588) + **threshold inconsistency** (0.55 vs 0.75) — must collapse to a single engine-derived constant.
  - **129 LIVE `--ts-bg-N` direct references** — worst single file in chunk 5b. Migration plan as for banner-generator.
  - **`--ts-bg-3-t` (transparent variant) consumed without being declared in the primitive layer** — L6956. Needs primitive-tier addition or migration to `color-mix` against the production derivative.
  - **`[data-theme="light"]` overrides for ~25 components in the tail (L6510–7035)** — owner has already done some of this cleanup ("fix done" L6636) but the file still carries the migration debris. Final pass: delete every commented-out override; verify the engine derives the light mode correctly without per-component overrides; promote the proven `[data-theme="light"]` rules into the production primitive-tier light-mode token declarations.
  - **Sortable / Footer / Modal / Toast / Tabs / Section-divider / Nav-active / Accent-bar / Toggle / Range** all carry residual light-theme overrides — each one is a candidate to delete after verifying the engine-derived light mode matches the visual ground truth.

---

## Cross-chunk inventory update

### `--ts-bg-N` direct-reference running tally — chunk 5b contribution

Live references (excludes commented-out code) added by chunk 5b:

| File | Total LIVE `--ts-bg-N` + `--ts-bg-body` refs (per grep) |
|---|---|
| ts-tree-explorer-styles(not-splitted).css | **18** |
| ts-oce-panel-banner-generator-styles.css | **112** |
| ts-oce-panel-styles(partial).css | **129** |
| **Chunk 5b total LIVE** | **259** |

⚠ The banner-generator and partial files are 95%-overlap; **deduplicated LIVE count = ~129** (the partial file is the superset of the banner-generator file in terms of `--ts-bg-N` refs once the OCE-light-theme tail is included; if both files ship as-is the cascade has both, but in any real "merged" world there's only one). The 259 figure is for the catalog's record; the migration burden is **~147 unique LIVE refs** across the chunk after dedup (18 tree + 129 merged-OCE).

### Cross-chunk RUNNING GRAND TOTAL of `--ts-bg-N` direct references

Pulling forward chunk 5a's tally (13 LIVE refs across 3 small view files) plus chunk 5b raw count:

| Chunk | LIVE `--ts-bg-N` direct refs |
|---|---|
| 4a (components — small) | ~not yet tallied in 5a doc; assumed in scope |
| 4b (components — large) | ~not yet tallied in 5a doc; assumed in scope |
| 5a (views — small) | **13** |
| 5b (views — large, raw) | **259** |
| 5b (views — large, dedup OCE) | **147** |
| **Running grand total of cataloged chunks (5a + 5b dedup)** | **160 LIVE refs** |

⚠ Caveat: this grand total is for the catalog chunks that have explicitly reported their tallies in their own docs. Chunks 4a + 4b ran before the running-tally protocol was added; their `--ts-bg-N` counts are not yet incorporated into a single grand total. The 5a doc's "carry-forward" section explicitly notes the running tally starts with chunk 5a. **For an absolute cross-rebuild grand total, chunks 1–4b need a retroactive grep pass** — recommend: a one-line script `grep -rEn '\-\-ts-bg-[0-9]\b|\-\-ts-bg-body\b' docs/references/toolskin.css_extracted-core-blocks-to-refactor/ | wc -l` to get the full corpus count in one shot, then break down per chunk.

### `oklch(from ...)` Wave 1.6 anti-pattern running tally

| Chunk | Instances |
|---|---|
| 5a | 0 |
| 5b — banner-generator | 1 (L627) |
| 5b — partial | 3 (L232, L6551, L6588) |
| **Chunk 5b total** | **4 R-rule-15 violations** |

(All 4 are variants of `--ts-on-accent: oklch(from var(--ts-accent) clamp(0, (T - l) * 999, 1) 0 0)`. Thresholds: 0.75 used 3 times, 0.55 used once.)

### View-tier vs component-tier — what chunk 5b teaches

Compared to chunks 4a/4b (components) and 5a (small views):

1. **Large views compound MANY components.** Banner-generator is the only file in the corpus that selector-scopes EVERY shared form primitive (`.ts-range`, `.ts-toggle`, `.ts-card`, `.ts-field`, `.ts-color-row`, `.ts-ui-select`, `.ts-ui-number-input-wrapper`, `.ts-chips`) under `.ts-banner-generator-app …`. This is the **rule-doubling debt** — fix by promoting to global, deleting the scoped duplicate.
2. **Tree-explorer is the single CLEANEST realization of the "ONE base lever rescales everything" principle** (`--ts-tree-row-h` cascades through pad / gap / indent / fs / icon / twist / radius via calc()). It is the canonical reference for the rebuild's ratio-driven derivative-geometry pattern.
3. **OCE panel is the LOUDEST shadow-of-production-tokens** (the 100-token panel-isolation block at banner L601–765). Pattern: forcibly maintaining one component's theme regardless of host theme. The correct rebuild strategy is to override `color-scheme` + `--ts-bg-body` only and let the engine recompute, not redeclare the entire primitive + derivative chain inline.
4. **Owner annotations density is HIGH (chunk 5b avg ~5%) and CRITICAL** — the chip-strip 53-line refactor spec, the panel-isolation 100-line refactor spec, the L6335 "lost consolidation record" frustration log, and the L6636 "engine-derived beats hand-tuned" postmortem are each gold for the rebuild. The owner's voice across all three files is consistent: token-first, one-base-lever, no-per-theme-tables, scope-only-true-locals, dedupe-via-`@ts-component-consolidate` audit, preserve via `@extracted_for_v1`.
5. **Chunk 5b is where the rebuild's three big binding rules (Rule 4 surface superposition / Rule 9 chip-strip LOCKED / Rule 15 apcach supremacy) collide with the legacy code's worst violations.** Tree-explorer is the model of compliance; OCE-panel is the model of violation. Both files come from the SAME owner — the rebuild's job is to encode the design intent (which the owner has consistently stated) in the engine, so legacy files can be DELETED rather than refactored.

### Annotations density (chunk 5b)

| File | Lines | Owner-annotated lines (estimate) | Density |
|---|---|---|---|
| ts-tree-explorer-styles(not-splitted).css | 2,369 | ~210 | ~8.9% (dominated by L19–98 cascade postmortem + L1815–2067 chip-strip spec) |
| ts-oce-panel-banner-generator-styles.css | 6,903 | ~350 | ~5.1% (dominated by L293–393 master refactor spec + repeated Lush Mode + UI-select consolidation specs) |
| ts-oce-panel-styles(partial).css | 7,035 | ~360 | ~5.1% (banner annotations + the L6510+ OCE-light-theme migration tail) |
| **Chunk 5b total** | **16,307** | **~920** | **~5.6%** |

**Compared to chunk 5a (~9.3% density driven by ts-cube-portfolio's 91-line integration brief):** chunk 5b annotations are spread over many more sub-blocks but the per-spec depth is HIGHER (the chip-strip spec alone is the most detailed single refactor block in the entire corpus).

---

## Gap vs `_code-audit-catalog.md`

The `_code-audit-catalog.md` cataloged Toolskin's general code architecture but did NOT enumerate:
- The OCE-panel `(partial)` vs banner-generator overlap (cross-file duplication).
- The tree-explorer's `(not-splitted)` 7-sub-file structure.
- The Lush Mode global refactor spec (repeated 3× in OCE files).
- The chip-strip 53-line REFACTOR REQUIREMENTS block + visual-parity protocol.
- The L6335 "lost consolidation record" frustration log (which is itself prima facie evidence for Pattern 18).
- The L6636 "engine-derived beats hand-tuned" postmortem (which is direct evidence supporting Wave 1.6 Resolution #1).
- The `--ts-bg-N-t` transparent-variant consumption without primitive declaration (cross-chunk pattern).
- The 4 `oklch(from ...)` Wave 1.6 anti-pattern violations.
- The `@ts-component-consolidate` / `@extracted_for_v1` / `@consolidate_select_component` / `@taxonomy_chips_strip` tag taxonomy (which the rebuild's audit workflow should formalize).

---

## Halt status

No HALT this chunk. All 3 files cataloged; no files missing; output well under 120k tokens.

Reads performed (within the 8-per-file budget):
- ts-tree-explorer: 3 slice-reads (L1–200, L391–440, L1980–2099) = 391 lines.
- ts-oce-panel-banner-generator: 3 slice-reads (L1–110, L290–419, L596–725) = 370 lines.
- ts-oce-panel-styles(partial): 2 slice-reads (L1–130, L6800–7000) = 330 lines.
- **Total slice-read budget used: 1,091 lines of 4,800-line cap (23%).** Well under budget.

Greps performed: ~25, all targeted, no full-file scans.

No over-reading. No Read without `offset` + `limit`. No HALT triggers fired.


---


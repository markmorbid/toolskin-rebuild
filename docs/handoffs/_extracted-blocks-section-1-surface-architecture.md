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

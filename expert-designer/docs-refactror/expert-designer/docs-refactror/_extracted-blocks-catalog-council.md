# Extracted Blocks Catalog — Council Deliberation

**Date:** 2026-05-23
**Catalog under review:** `docs/handoffs/_extracted-blocks-catalog.md` (commit `f44a651`)
**Dispatch path:** FALLBACK (4 parallel anti-anchored sub-agents — `npx skills run council` unavailable)
**Voices:** Design Skeptic · Design Critic · Architect · Pragmatist (all fresh-context, no cross-anchoring)
**Mandatory reading per voice:** `toolskin-architecture` + `toolskin-visual-audit` + `design-tokens-2.0` skills + the catalog full + `_code-audit-catalog.md` + `_rebuild-visual-audit.md` + (Architect/Pragmatist additionally) current `assets/css/next/system/surfaces.css` + `assets/css/next/primitives/colors.css`.

---

# DESIGN SKEPTIC

## Mandatory reading completed

- `toolskin-architecture` SKILL.md (full, 215 lines) — Rule 4 surface superposition, Rule 15 apcach authority, refusal patterns, Pattern 17 visual-audit-before-specs
- `toolskin-visual-audit` SKILL.md (full, 337 lines) — token-leak grep recipes, Wave 1.6 binding values, gotcha #10 (direct primitive refs)
- `design-tokens-2.0` SKILL.md (full, 577 lines) — three-tier architecture, Rule 4 derivative system, Rule 5 surface propagation, Rule 6 two-layer pattern, Extended Rule 15
- `_extracted-blocks-catalog.md` — full grep across 2,882 lines; targeted reads at L1819–1898 (chunk 4a bugs + 4b special cases), L1958–2000 (footer, masonry, checkbox), L2024–2080 (iconlist + ts-panel), L2440–2550 (ts-ui-ide view), L2625–2830 (chunk 5b OCE files + oklch tally)
- Source files read DIRECTLY: `inputs-global-nested-design-pattern.css` L1–97, `iconlist+featlist-allvariants-component.css` L1–160, `ts-panel+root-debugger-component.css` L1–110 (the canonical §6d block), `ts-ui-ide-view-fullview.css` L1–75
- `_rebuild-visual-audit.md` — Wave 1.6 reconciliation block grepped for nest / surface-superposition / panel references (§F4 nest-aware surfaces confirmed visually, §A3/D4 nested-card composition confirmed)

## PRIMARY — Four binding patterns

### Pattern 1 — inputs-global-nested-design-pattern L1–97

**Owner annotations VERBATIM** (the entire L1–97 block is one comment — it is itself the annotation):

> REFACTOR NOTES: INPUTS BASE SYSTEM
> This block defines the initial/base styles for all input components.
> Refactor scope: Refer to #START_DEDUPE and #END_DEDUPE markers. Apply @ts-inputs-refactor-dedupe to merge duplicated input-related blocks currently distributed in the cascade (from ~line 6500 to this section).
> OBJECTIVE: Consolidate duplicated input styles into a single, coherent system. Preserve cascade order and current behavior. Transition the implementation into a fully tokenized and centralized architecture.
> ARCHITECTURE REORGANIZATION: The stylesheet must be reorganized into structured scopes: 1. ROOT / GLOBAL SCOPE (token definitions, minimal use of global selectors, target only containers/wrappers that require token propagation, avoid excessive use of universal selectors); 2. ASSET SCOPE (classes where tokens are applied — group shared patterns across similar components, define common structural and behavioral rules); 3. IMPLEMENTATION TYPE (organize by component category: inputs, cards, buttons, wrappers, sections, modals — define reusable patterns at the correct abstraction level).
> TOKENIZATION LAYERS — Define a 3-layer token system: 1. GLOBAL TOKENS (shared) — generic values reusable across all components, e.g. spacing, radius, typography, base colors; 2. COMPONENT TOKENS (asset-level) — specific to a component type (e.g. inputs), applied across all variants of that component; 3. VARIANT TOKENS (local) — specific to a variant or state, override component tokens where necessary. Validate existing manual implementations and align them to this structure.
> DISPLAY / VARIANT LOGIC: Identify component-specific variants and scoped behaviors. Map existing patterns into structured token-driven systems. Examples: Theme-level styles (gradients, light/dark mode); Glass or surface effects; Feature-specific UIs (banner generator, sidebar/OCE panel, etc.). These must: be properly scoped, avoid hardcoded values, rely on token overrides instead of duplicated rules.
> GOAL: A fully deduplicated, token-driven input system that is modular and scalable, separates concerns (structure vs. visual vs. variant), minimizes redundancy, maintains compatibility with all existing variants.

**What the owner encoded:** The owner sketched the design-tokens-2.0 three-tier architecture VERBATIM, before that skill existed in canonical form. He named the three layers "GLOBAL / COMPONENT / VARIANT" — which maps EXACTLY to Baptista's PRIMITIVE / SYSTEM / COMPONENT. This is not a coincidence. It is the **founding artifact** of the three-tier methodology in Toolskin lore. The 3-layer brief is the owner's pre-axiomatic discovery of the same architecture Baptista named months later. The catalog under-sells this: it calls L1–97 "the foundational design intelligence the rebuild MUST adopt" (catalog L2066). I claim it is stronger — it is **the origin point** of why design-tokens-2.0 was canonized as Tier 1 authority in the first place.

**The actual implementation pattern (per catalog L1898–1907 "Special case: inputs-global-nested-design-pattern"):**

1. PRIVATE local tokens prefixed `--_input-*` (the underscore convention = local-only, do not consume from outside the rule).
2. Map privates → public `--ts-input-*` tokens in the same rule.
3. The input rule SETS `--ts-this-bg: var(--ts-input-bg)` — **re-anchoring the surface chain to the input's own background**, so the chain of `--ts-this-bg-border / -dim / -hover / -focus` recomputes for descendants.
4. Cascading variant overrides (`.ts-modal__body .ts-input` L331–354) override `--ts-input-bg`, and the `--ts-this-bg`/`--ts-this-bg-border` pair cascades automatically.

**Why this is Rule 4 canonical:** Rule 4 ("surface superposition") in `toolskin-architecture` SKILL §12 says "a component sets `--ts-this-bg: var(--ts-bg-N)` on its root; the full ~30-token derivative chain recomputes; descendants inherit automatically." The inputs file demonstrates this 23 times across 1,493 lines — it is the densest, most disciplined application of the rule anywhere in the showcase repo.

**What visual property does it preserve:** The fact that **a focused input INSIDE a modal INSIDE a card** all retain visually-coherent borders, hover colors, focus rings, and dim-states — because each scope re-anchors `--ts-this-bg` once, and ALL ~30 derivatives (border, hover, focus, dim-1..4, active, disabled, grad) follow. The visual outcome is: nested inputs never get the "wrong shade" of border or focus ring. They look like they belong to their host surface, not the page root.

**What a naive refactor destroys:**

1. **The private `--_input-*` indirection layer.** A junior agent will look at L101–136 and ask "why not skip the privates and just write public tokens directly?" — and merge them. The private layer exists because the public tokens are CONSUMED in 22+ downstream rules; the private layer is the "decision point" where you tune ONCE without cascading edits. Flattening it forces 22 simultaneous rewrites.
2. **The `--ts-this-bg: var(--ts-input-bg)` re-anchor line at L147 family.** A naive refactor that "cleans up" by removing this line breaks the modal-input-in-card visual coherence. Specific visual symptom: input borders inside `.ts-modal__body` will resolve to the PAGE root's `--ts-this-bg-border` instead of the input's own — so all modal inputs will have a different (lighter or darker) border than the rest of the modal's surfaces. Hover states fail similarly.
3. **The 4-layer hierarchy** (PRIVATE → PUBLIC → SURFACE-RE-ANCHOR → DERIVATIVE-CASCADE). All 4 layers are load-bearing. The catalog's framing — "3-layer tokenization scheme + 4-layer surface re-anchor protocol" — accurately splits them but is shallow; I add: layers 3 and 4 are what make Toolskin Toolskin. Layers 1 and 2 are good engineering everyone does; layers 3 and 4 are the patent-worthy bit.
4. **The "knobs + formula in each scope" pattern** (catalog L2268, repeated L1239–1256). When the cascade short-circuits (CSS custom-property resolution timing means a child rule's `--ts-input-bg` override doesn't always cascade to a derivative formula), the modal scope re-declares BOTH the knob AND the formula. A naive refactor that says "DRY — don't repeat the formula" will hit silent cascade bugs. The owner already learned this lesson; the rebuild must inherit it.

**Risk if discarded:** HIGH. The rebuild loses its only canonical Rule 4 worked example, AND its founding statement of the three-tier architecture, AND the cascade-short-circuit workaround pattern. Three losses in one.

### Pattern 2 — iconlist + featlist L1–39

**Owner annotations VERBATIM (L1–39):**

> §6c FEATURE LIST + LIST COMPONENT — v2 (token-driven, ts-this-bg). Replaces the entire previous §6c block.
> Architecture: LAYER 1 — Tokens declared ONCE in a component-scoped root block. Scope = subtrees of .ts-list and .ts-feat-list only. No leakage to global :root *. LAYER 2 — Element rules consume tokens. Variants override TOKENS only, never redeclare properties.
> Surface model: Background only on variants that need it (ts-feat-cards, big-icon box). Default items are transparent. All surfaces routed through --ts-this-bg derivatives: bg gradient → --ts-this-bg-grad-2 (variant only); border → --ts-this-bg-border (unified everywhere); hover bg → --ts-this-bg-hover (only where surface exists); hover border → --ts-this-bg-border-hover; accent hover → --ts-accent-dim + --ts-accent-border (.hover-accent).
> Typography model: All text inherits ONE color (--ts-feat-text). All icons inherit ONE color (--ts-feat-icon-color → accent). Title elements are an EXCEPTION: h2-h6, .ts-feat-item__title, strong receive --ts-feat-title-color and --ts-feat-title-fs.
> Sizing model: One base × one multiplier × clamp() = icon size for every variant. Variants override ONLY --ts-feat-icon-mult. Spacing is a derivative chain — change --ts-feat-pad-base, all rescales.
> Layout model: Auto-fit grid with no media queries. Single column when item width exceeds container (intrinsic responsive). .list class forces single column explicitly.

**What the template defines structurally:** It is the **canonical per-component-file template** for the rebuild. Five subsystems are named (surface / typography / sizing / spacing / layout), each with an enforcement rule. Every Session 4+ block CSS file should open with a header of this exact shape.

**Design DNA encoded:** Five DNA encodings live in this brief, four of which match Wave 1.6 (`_rebuild-design-dna.md` + `_rebuild-visual-audit.md`):

1. **"Variants override TOKENS only, never redeclare properties"** — this is design-tokens-2.0 Rule 6 (two-layer CSS pattern, SKILL.md L370–406) stated 5 months before the skill was authored.
2. **"All icons inherit ONE color → accent"** — matches Wave 1.6 §F1 accent identity (icons render in accent across the live system; confirmed by `_rebuild-visual-audit.md` L113, 238).
3. **"One base × one multiplier × clamp()" sizing** — matches design-tokens-2.0 Rule 4a (one --ts-{component}-base, all dimensions derive). Wave 1.6 confirms via §A3/D4 (cards-in-cards visually scale coherently).
4. **"Auto-fit grid with no media queries — single column when item width exceeds container"** — matches Wave 1.6's intrinsic-responsive design philosophy; the rebuild has no media-query-by-breakpoint inheritance.
5. **"Title elements are an EXCEPTION"** — encodes the H1=700, H2=600 weight ladder (Wave 1.6 §11) at the component level. Catalog calls this trivially "typography model" — I claim it's actually the **encoding of the weight ladder at component scope** and is therefore Wave 1.6 Pattern 17-relevant.

**What the rebuild's per-component template should look like (Skeptic recommendation):** Every Session 4+ block CSS file MUST open with a 5-subsystem brief in this shape (surface / typography / sizing / spacing / layout) AND a LAYER-1/LAYER-2 enforcement statement. This is the rebuild's CSS "preamble" — non-negotiable.

**What gets destroyed if the template is flattened:**

1. **The discoverability of architectural intent.** A junior dev opening `inputs.css` or `card.css` with no preamble has no anchor; they reach for class-modifier patterns by default. The 5-subsystem brief PREVENTS class-modifier drift. Lose the brief, lose the discipline within 6 months.
2. **The "variants override tokens only" guarantee.** This brief is the only place in the entire showcase repo where this rule is stated WITH ENFORCEMENT. Lose it, and Tailwind-style class modifiers will sneak in (violating Rule 1 + Rule 3).
3. **The CLAMP ICON ENGINE** (catalog L2263): `clamp(min, base × mult, max)` with variants overriding ONLY `--ts-feat-icon-mult`. This is the reusable sized-element pattern for the entire rebuild. Flattening loses it — every component will re-invent its own icon scaling.
4. **The custom `--ts-this-bg-border` derivative recipe at L139–158** — components can REDEFINE `--ts-this-bg-border` with a custom `--ts-mix-perc` (10% in dark, 7% in light — engine-mediated per-theme variation). This is sub-derivative innovation: it extends the surface chain WITHOUT violating Rule 15 (because the percentage is exposed as a token, not hand-tuned per-theme in the consumer rule). Flattening destroys this innovation.

**Caveat:** The L122–158 block has a known bug — the LAYER-1 token quartet (`--ts-feat-bg-hover` etc.) is declared TWICE with different values (`--ts-accent-bright`/`-border` first, `--ts-accent-dim`/`-border` second; catalog L2251 silent-bug #7). Second wins. The rebuild must merge these into ONE declaration block, not preserve the bug.

**Risk if discarded:** HIGH (template loss) + MEDIUM (recipe loss). Combined: HIGH.

### Pattern 3 — ts-card-flip §6d nest-reduction system

**The §6d block actually lives in `ts-panel+root-debugger-component.css` L25–93, NOT in `ts-card-flip-swipe-interactive-component.css`.** The card-flip file CONSUMES the system (L6–12 has the comment + L11–12 the consumer rules) but the DEFINITION + the explainer is in the panel file. The council brief points at card-flip; the actual canonical reference is the panel file. **This is a real catalog framing weakness — the catalog L2265 names "ts-panel L25–43, L48–55" correctly but the council brief points at the consumer file. Surfacing.**

**Owner annotations VERBATIM (ts-panel+root-debugger L25–45):**

> §6d NEST-REDUCTION SYSTEM (NEW-B16). CSS-only depth-reduction for containerish components (.ts-card, .ts-panel).
> MECHANISM — explicit depth selectors referencing root canonical tokens: CSS custom properties cannot reference themselves in a calc() — neither unregistered nor @property-registered variants avoid the own-element cycle (the browser's own-element resolution always sees the new declaration, not the inherited parent value). The only cycle-free CSS-only approach is to reference the ROOT canonical token at each depth level and multiply the step:
> Depth 1: `--ts-nest-* = canonical` (via Layer 1 on .ts-card)
> Depth 2: `--ts-nest-* = canonical − 1×step` (.ts-card .ts-card)
> Depth 3: `--ts-nest-* = canonical − 2×step` (.ts-card .ts-card .ts-card)
> `@property` is kept for `--ts-nest-radius` / `--ts-nest-pad` so the base rule can initialize them from `var(--ts-card-radius)` with typed resolution and `border-radius: var(--ts-nest-radius)` always gets a valid `<length>`.
> TUNING: `--ts-radius-nest-reduction` / `--ts-pd-nest-reduction` (§1f-nest, :root). COVERAGE: 3 explicit depth levels (L1/L2/L3) covers all realistic UI layouts.

**What the nest-reduction technique is:** A pure-CSS, JS-free mechanism for visually distinguishing a card-inside-a-card-inside-a-card. As depth increases by one, the radius shrinks by `--ts-radius-nest-reduction` (default 2px) and the padding shrinks by `--ts-pd-nest-reduction` (default 2px). The explainer at L29–34 is the smoking gun: the owner already TRIED `@property`-registered self-reference and discovered it doesn't work (browser own-element resolution sees the new declaration, not the inherited one). The 3-depth-level explicit-selector enumeration is the cycle-free workaround.

**Is it GENERAL or COMPONENT-specific:** **GENERAL.** Catalog L2049 confirms: "the `--ts-nest-radius`/`-pad` calc system is novel and should be documented in design-tokens-2.0 as the canonical pattern for visually-distinguishing nested instances of the same component." Today it's wired to `.ts-card` and `.ts-panel`; the mechanism applies to ANY containerish component (modals-in-modals, sidebars-in-panels, tabs-in-cards). The rebuild should consider lifting the `--ts-nest-radius`/`-pad` token pair to `surfaces.css` (Tier 2 system tokens), not embedded in ts-card/ts-panel files.

**What visual problem does it solve:** **Nested-instance visual collapse.** Without nest-reduction: a card-inside-a-card-inside-a-card has THREE concentric borders all with the same `border-radius: 16px`. The eye reads this as a "fat border" — the inner card's outer corner overlaps visually with the outer card's inner corner. With nest-reduction: depth-1 = 16px, depth-2 = 14px, depth-3 = 12px. The corners step inward; the human eye reads three distinct rectangles, not one ambiguous fat-bordered blob. This is the Apple/macOS-style "concentric rounded rectangles" rule (parent-radius − child-padding = child-radius, for visually-aligned inner corners). The owner has codified it as a derivative system.

**Wave 1.6 corroboration:** `_rebuild-visual-audit.md` §F4 confirms "nest-aware surfaces" as visually validated; §A3/D4 confirms nested-card composition renders correctly in the live system. The §6d mechanism IS what makes §F4 visually true. Pattern 17 ("visual reality wins over text-derived claims") rules this in.

**If discarded, what visual symptom returns:**

1. **Concentric-blob visual collapse** at any depth-2+ nesting. The 3-up portfolio card grid (`_rebuild-visual-audit.md` §07 portfolio capture) has cards with expanded detail panels — those are card-in-card compositions. Without nest-reduction the inner-card outer corner would touch the outer-card inner corner; the visual reads as a single fat-bordered blob.
2. **The modal-input-in-card composition** (which also nests at depth 3 in practice: card > modal > input) collapses similarly.
3. **The dashboard widget grid** (`.ts-dashboard` referenced at card-flip L57+) is `.ts-card > .ts-card-row > .ts-card` — depth 3 — and would lose the visual depth cue.

**The catalog under-sells the explainer.** Catalog L2265 calls it "the canonical pattern for visually-distinguishing nested instances of the same component" — true but bloodless. The OWNER's L29–34 explainer is the load-bearing wisdom: he documents the FAILED `@property` self-reference attempt, so the rebuild doesn't repeat it. **Lift the explainer VERBATIM into the rebuild's `surfaces.css` comments — it's a learned-the-hard-way fix that costs hours if rediscovered.**

**Risk if discarded:** HIGH. Visual symptom is immediate and obvious to a designer's eye but invisible to a token-by-token CSS audit.

### Pattern 4 — ts-ui-ide-view-fullview per-component surface re-anchoring (the two-line idiom)

**The exact two lines (from `ts-ui-ide-view-fullview.css` L67–68, then repeated at 22 other locations per catalog L2543):**

```css
.ts-titlebar {
    background-color: var(--ts-ui-ide-bg);
    --ts-this-bg: var(--ts-ui-ide-surface-2);
    ...
}
```

**Owner annotations:** NONE for the two-line idiom directly. The catalog (L2552) confirms chunk 5a annotation density is LOW — "ts-ui-ide-view is sparsely annotated despite its architectural importance." The pattern is encoded by EXAMPLE, not by comment. **This is itself architecturally important: the pattern is consistent enough across 22 occurrences that it didn't need a comment — the discipline IS the documentation.** That said, the rebuild should add an annotation block explaining it, because future-fresh-context will lose the implicit knowledge.

**Why this is the cleanest view-tier composition reference (catalog L2542–2544 + L2456):**

The two lines do TWO unrelated things atomically:

1. **`background-color: var(--ts-ui-ide-bg)`** paints THIS element from the view-private aliased surface (which transitively resolves to the page's `--ts-this-bg`). The view has its own private token cartel (L29–47) that aliases the public surface chain — `--ts-ui-ide-bg: var(--ts-this-bg)`, `--ts-ui-ide-surface-1: var(--ts-bg-0)`, etc. The view is composing without restyling components.
2. **`--ts-this-bg: var(--ts-ui-ide-surface-2)`** RE-ANCHORS the surface chain for THIS element's descendants. Children of `.ts-titlebar` now see `--ts-this-bg` resolved to the view's `surface-2` (the elevated surface for raised UI elements). Their borders, hover states, dim derivatives all recompute coherently.

The view-tier file therefore does **composition without restyling**: it never reaches into a component's internals to override colors. It just rebinds the surface input at each composition boundary. The components themselves remain identical to how they appear elsewhere; they just adapt to the IDE view's surface palette.

**The catalog's framing is accurate but shallow:** L2542 says "view-tier files SHOULD declare a private token cartel" and L2543 says "view-tier files SHOULD set `--ts-this-bg` at every component boundary." I sharpen: the two-line idiom is the **atomic unit of view composition**. Every place a view wraps a component, it executes exactly these two lines. No more, no less. The view never reaches inside the component. The component never knows it's in a view. This is the SOLID-principles version of CSS composition.

**Why this is Pattern 17 (visual-audit-before-specs) gold:** The rebuild's view-tier spec doesn't exist yet (`docs/handoffs/` has component specs but no view-tier spec). The two-line idiom IS the view-tier spec, encoded by example. Pattern 17 says visual reality wins; the live IDE-view file IS the visual reality — its 22 consistent applications across the file are the proof.

**What does the rebuild lose if components don't re-anchor this way:**

1. **Composition without restyling becomes impossible.** Without the re-anchor, a view that wants a different surface depth for its components has to override individual properties (background, border-color, hover-bg). That violates `design-tokens-2.0` Rule 5d ("a component overrides `--ts-this-bg` on itself, not individual derived properties"). The whole surface-propagation engine breaks down because each view ends up with bespoke component overrides.
2. **The IDE view's "different visual depth at every nesting level" effect** — titlebar elevated (surface-2), activity-rail flush (surface-1), sidebar slightly raised (surface-1), editor inset (surface-2), AI panel further inset (surface-3) — all of this falls apart. Without re-anchoring, every component would resolve to the page-root's `--ts-this-bg`, and the IDE would render visually flat.
3. **Reusability across view-tier files** dies. Every new view (oce-panel, banner-generator, tree-explorer, etc.) would need bespoke overrides; the two-line idiom would not generalize.

**The Skeptic correction to the catalog:** The catalog calls L67–68 (and L207, L215) "stylistically should swap" (catalog L2515) because some occurrences have `background-color` BEFORE `--ts-this-bg`. CSS recomputes at use-time so it works either way, but the **convention should be: re-anchor FIRST (line 1), consume SECOND (line 2)** because reading top-to-bottom matches mental model "I'm setting up the surface, then painting." The rebuild's spec should mandate this order.

**Risk if discarded:** HIGH. This is the rebuild's only view-tier composition reference. Without it, view-tier files will rediscover the pattern in 6 months with bugs.

## SECONDARY findings

### Components with footer-like component-scope `--ts-bg-N` PRIMITIVE redefinition

The footer.css L662 (`--ts-bg-2: #ffffff14`) + L831 (`--ts-bg-1: var(--ts-this-bg-dim-4)`) pattern — component CSS REDEFINING what `--ts-bg-N` means for its descendants — is **catastrophic** because it inverts the primitive→system→component contract. A component reaching back into the PRIMITIVE layer pollutes everything downstream. Per catalog framing L1980–1988 and L2203, this is "the worst Rule 15 violation in chunk 4b."

**Other components with the SAME pattern (from my catalog scan):**

1. **`ts-oce-panel-styles(partial).css`** (chunk 5b view-tier file) — **6 legacy `--ts-bg-0..4` redeclarations at L100–104 in a `:root` block** (catalog L2423). This is the SAME inversion as footer L662/L831, just at view scope. Catalog calls these "LOCAL re-declarations that override the production chain WHILE this file is loaded — high-impact if this file ships unfiltered into production." That's a P0 architectural inversion identical in kind to footer.
2. **`ts-oce-panel-banner-generator-styles.css`** (chunk 5b) — catalog L2697: "**The panel-isolation block alone re-declares all 6 `--ts-bg-N`** AND consumes many more inline." This is the worst single contributor (112 LIVE refs) and includes primitive redeclaration via the panel-isolation cartel. Same inversion.
3. **`ts-cube-portfolio.css`** (chunk 5a) — per `.remember/remember.md` L30: "shadows `--ts-bg-body`/`--ts-bg-0..4` + uses 28 raw `rgba(255,255,255,…)` literals." Same shadowing pattern. The handoff already flags this as "pre-integration scratch... MUST NOT ship with its own dedicated CSS sheet."

**Skeptic verdict:** Footer is NOT the only catastrophic case — chunk 5b has TWO files with the SAME inversion and HIGHER ref counts (112 + 129). The catalog is correct that footer L831 is "the worst we've seen in chunk 4b" — but **chunk 5b is worse on both axes** (more re-declarations + higher absolute counts). The rebuild's pre-commit hook (R-rule-15 refusal pattern) MUST scan for `--ts-bg-[0-9]\s*:` outside `primitives/colors.css` and reject. That is the only way to enforce the contract.

### Rule 15 priority ranking of the ~155 `--ts-bg-N` direct refs

I rank components for Session 4 critical-path (using the typology from `toolskin-architecture` §6 — atomic / molecular / layout):

| Component | ts-bg-N refs | Tier | Session 4 priority | Rationale |
|---|---|---|---|---|
| `.ts-input` family (inputs-global) | 23 LIVE | Atomic | **P0** | Every page has inputs. Reference of Pattern 1. Rebuild is broken without it. |
| `.ts-card` (card-flip) | 17 LIVE | Molecular | **P0** | Most-composed component. Pattern 3 nest-reduction consumer. |
| `.ts-checkbox-radio` | 28 LIVE | Atomic | **P0** | Highest count in chunk 4b. Form components. |
| `footer.ts-footer` | 17 LIVE incl. 2 PRIMITIVE redefs | Layout | **P0** | Catastrophic architectural inversion. Layout tier = ALWAYS STRICT gate. |
| `.ts-panel` / `.ts-ui-panel` | 7 LIVE | Molecular | **P1** | Pattern 3 definer. Already partially compliant. |
| `.ts-ui-select` variants | 13 LIVE + 2 commented | Molecular | **P1** | Dropdown engine. Critical for forms. |
| `.ts-masonry` layout | 2 LIVE | Layout | **P1** | Few refs but L372 owner annotation marks 130 lines as DELETABLE hardfixes. |
| `headermenu-...-sidebarnav` family | 6 LIVE | Layout | **P1** | Astonishingly low count for 86KB file — token cartel does the work. ALWAYS STRICT. |
| `.ts-cube-portfolio` | shadows --ts-bg-0..4 | View | **DELETE per handoff** | Pre-integration scratch, owner-flagged "MUST NOT ship." |
| `ts-oce-panel-styles(partial)` | 129 LIVE + 6 redefs | View | **P0 + structural** | Worst single file. MERGE OR DELETE per catalog L2778. |
| `ts-oce-panel-banner-generator` | 112 LIVE + 6 redefs in isolation block | View | **P0 + structural** | Cross-merge with the partial file before fixing refs. |
| `.ts-feat-list` / `.ts-list` | 1 (fallback only) | Molecular | **NO MIGRATION NEEDED** | Cleanest in chunk 4b. Pattern 2 reference. Already compliant. |
| `.ts-modal__body .ts-input` (modal scope) | 4+ (via inputs file overrides) | Molecular | **P0** | Pattern 1 cascading-variant exemplar. |

**Session 4 critical path:** Inputs + cards + checkbox-radio + footer + ui-select MUST be rebuilt against the surface-derivative chain in the first wave. The two OCE files are P0 STRUCTURAL — they need merge/delete decisions BEFORE refactoring. The cube-portfolio is a delete.

### The 4 `oklch(from <var>)` Wave 1.6 anti-pattern hits in chunk 5b

Per catalog L2698 + L2747 + L2765 + L2825–2826 — all 4 are `--ts-on-accent` declarations:

1. **`ts-oce-panel-banner-generator-styles.css:L627`** — `--ts-on-accent: oklch(from var(--ts-accent) clamp(0, (0.75 - l) * 999, 1) 0 0)`. Owner context at L626: "✅ ACCENT TOKENS - Panel dark isolation (same 0.75 threshold as dark mode)". **Threshold 0.75.**
2. **`ts-oce-panel-styles(partial).css:L232`** — same formula, threshold 0.75.
3. **`ts-oce-panel-styles(partial).css:L6551`** — same formula, **threshold 0.55** (INCONSISTENT with the other three).
4. **`ts-oce-panel-styles(partial).css:L6588`** — same formula, threshold 0.75.

**Skeptic verdict:** Wave 1.6 Resolution #1 (Extended Rule 15) mandates engine-derived constants, not runtime `oklch(from)`. ALL 4 are R-rule-15 violations. The threshold inconsistency at L6551 (0.55 vs the others' 0.75) is a separate bug — even if `oklch(from)` were allowed, the threshold should be ONE constant per accent-on-surface contract. The rebuild's `colors.css` generator must emit a single `--ts-on-accent` value at build time (per apcach contrast computation against the active accent) and the OCE files must consume it as a primitive, not recompute at runtime.

Owner-intent footnote: the L626 comment says "Panel dark isolation (same 0.75 threshold as dark mode)" — the owner is intentionally matching the dark-mode threshold for the always-dark isolated panel. That intent is VALID; the implementation is wrong. The rebuild's apcach engine must emit a `--ts-on-accent-isolated-dark` token (or similar) so the OCE panel consumes a precomputed engine-derived constant matching dark-mode contrast.

### 11 silent rendering bugs in chunk 4a — Session 4 critical-path check

Cross-referencing the 11 bugs (catalog L1819–1830) against the Session 4 critical-path components (from typology):

| Bug | File:Line | Component | Critical-path? |
|---|---|---|---|
| 1. invalid 3-arg `var()` | code-window:L7 | `.ts-code-window` | NO — molecular utility, not in first wave |
| 2. `vr(...)` typo | tooltips:L39 | `.ts-tooltip` | YES — atomic, used everywhere |
| 3. wrong token ref | tooltips:L195 | `.ts-tooltip` lists | YES — same |
| 4. inverted clamp `(285,90vw,200)` | hero-section:L86 | `.ts-hero` | YES — layout block, ALWAYS STRICT gate |
| 5. unscoped `canvas` bleeds | hero-section:L72 | `.ts-hero` (global pollution) | YES — security/correctness; bleeds globally |
| 6. malformed `--ts-modal-gap--ts-sp-2` | log-component:L106 | `.ts-log` | NO — diagnostic component |
| 7. `transform: scale(1.02), translateZ(0)` invalid comma | ui-kit-spinner+sortable:L290 | `.ts-sortable` drag handle | NO — molecular utility |
| 8. `__heade` typo selector | ts-ui-accordion:L139 | `.ts-accordion` | YES — molecular, common |
| 9. `backgroun-color` typo | ts-ui-accordion:L358 | `.ts-accordion` transition | YES — same |
| 10. missing `calc()` | custom-cursor:L86 | `.ts-cursor` | NO — opt-in effect |
| 11. `display: none` defeats sr-only | theme-toggle:L82 | `.ts-theme-toggle` | YES — **A11Y REGRESSION**, atomic component |

**Session 4 critical-path bugs that MUST be fixed in the rebuild:** Bugs 2, 3, 4, 5, 8, 9, 11. That's 7 of the 11. Bug 11 (a11y regression on theme-toggle screen-reader text) is HIGH SEVERITY per `toolskin-visual-audit` §grading rubric — it's a `fail` verdict (WCAG 2.2 contrast/a11y), not a `warn`. The rebuild's theme-toggle component sandbox MUST verify the sr-only span is NOT hidden by `display: none`.

**Bug 5 deserves special call-out:** an unscoped `canvas` selector in hero-section.css means every `<canvas>` element on the page inherits the hero's canvas styling. If the rebuild's banner-generator app (or any future canvas-based component) loads after the hero CSS, it inherits unwanted properties. Global selector pollution. **Refusal pattern candidate** for the rebuild's pre-commit hook.

## Skeptic verdict — naive-refactor risk ranking

How much would a naive refactor destroy? Ranked HIGH (visual + architectural collapse) to LOW (recoverable):

1. **Pattern 1 (inputs-nested) — HIGHEST RISK.** The 4-layer private/public/re-anchor/cascade pattern is dense, undocumented in canonical form, and load-bearing in 23 places across 1,493 lines. A naive refactor that "DRYs" the privates OR removes the modal-scope re-declarations breaks both modal-input visual coherence AND the cascade-short-circuit workaround. Also: this is the founding artifact of the three-tier methodology. Lose it, lose the lore.

2. **Pattern 3 (nest-reduction) — HIGH RISK.** Visual symptom is immediate (concentric-blob collapse) but invisible to text-based audits. The owner's L29–34 explainer documents a failed `@property` self-reference attempt — that wisdom is lost on flatten. The CSS-only mechanism is novel and would not be re-derived without significant exploration.

3. **Pattern 4 (two-line idiom) — HIGH RISK.** It IS the rebuild's view-tier spec (encoded by example, not by comment). Lose it, lose composition-without-restyling. Symptom: every new view-tier file would invent ad-hoc per-component overrides, violating Rule 5d.

4. **Pattern 2 (LAYER-1/LAYER-2 template) — MEDIUM-HIGH RISK.** The brief itself is recoverable from canonical skills (design-tokens-2.0 Rule 6 covers most of it). The CLAMP ICON ENGINE and custom `--ts-this-bg-border` recipe (L139–158) are the parts most at risk on flatten. The template format (5-subsystem preamble) is the discoverability gain.

**Combined ranking:** Pattern 1 > Pattern 3 > Pattern 4 > Pattern 2. All 4 are HIGH or MEDIUM-HIGH; **NONE are low-risk**. The catalog's framing — "binding design intelligence the rebuild MUST preserve" — is correct.

## Recommended NEW RULINGS (Skeptic — surface to owner)

**RULING candidate A — Per-component-file template (lifted from Pattern 2).** Every Session 4+ block CSS file MUST open with a header containing: §-section ref + component family description; 5-subsystem brief (surface / typography / sizing / spacing / layout); explicit LAYER-1/LAYER-2 enforcement statement; `@ts-deps` machine-readable header. Refusal pattern candidate **R-template** — file without the brief is rejected at pre-commit.

**RULING candidate B — View-tier composition spec (lifted from Pattern 4).** View-tier CSS files MUST: declare private cartel under `:root:has(.ts-{view}-demo) *`; alias the public surface chain into view-private tokens; at every component boundary use the two-line idiom in canonical order (re-anchor FIRST, consume SECOND); NEVER reach into a component's internals. Refusal pattern **R-view-comp**.

**RULING candidate C — Nest-reduction as Tier-2 system pattern (lifted from Pattern 3).** The `--ts-nest-radius` / `--ts-nest-pad` tokens and the 3-depth-level selector enumeration move from component files to `assets/css/next/system/surfaces.css` as Tier 2. Owner's L29–34 explainer preserved verbatim.

**RULING candidate D — Pre-commit hook for `--ts-bg-[0-9]` outside primitives.** Hard-fail any commit where `--ts-bg-[0-9]\s*:` appears outside `primitives/colors.css`. Catches definer-side primitive redefinition (footer L831, OCE panel L100–104, cube-portfolio).

**RULING candidate E — Engine-derived `--ts-on-accent` constant per surface context.** apcach build pipeline must emit `--ts-on-accent` for default contrast AND `--ts-on-accent-isolated-dark` matching dark-mode threshold (per OCE panel-isolation intent at L626).

**RULING candidate F — Canonical reference paths in skills.** The 4 binding patterns wired by absolute path into the canonical skills (specific paths listed).

## Final dispatch to meta-orchestrator (Skeptic)

The catalog's "4 binding patterns" framing holds up under skeptical review. Two adjustments to the catalog framing:

- **Pattern 3 attribution correction:** §6d nest-reduction DEFINITION lives in `ts-panel+root-debugger-component.css` L25–93, NOT in `ts-card-flip`. Card-flip is the CONSUMER. The council brief points at the wrong file.
- **Pattern 1 strengthening:** L1–97 is not just "canonical Rule 4 reference" — it is the FOUNDING ARTIFACT of the three-tier methodology in Toolskin lore. The owner discovered the three layers BEFORE design-tokens-2.0 was canonized.

Secondary findings confirm 2 OCE files share the footer's catastrophic primitive-redefinition inversion. 11 silent bugs include 7 critical-path + 1 a11y regression. All 4 `oklch(from)` violations are `--ts-on-accent` recomputations, fixable by engine-derived constants. All 4 patterns rank HIGH or MEDIUM-HIGH risk. None are low. Six new RULINGS recommended.

---

# DESIGN CRITIC

## Mandatory reading completed

- `toolskin-architecture` SKILL.md (Rules 1–15 + Extended Rule 15, Wave 1.6 binding, §22 refusal patterns).
- `toolskin-visual-audit` SKILL.md (token-leak grep, computed-style probe rubric, OKLCH on-accent formula).
- `design-tokens-2.0` SKILL.md (three-tier reference chain, Rule 5 surface propagation, derivative geometry).
- `_extracted-blocks-catalog.md` — structural index + four-pattern entries at L1898–1907, L2024–2035, L2039–2050, L2361, Rule 15 / `oklch(from)` tallies at L2810–2826, footer redefinition L1980–1988, ts-cube-portfolio L2311–2330 + L2401+.
- `_code-audit-catalog.md` headers + cross-references confirmed.
- `_rebuild-visual-audit.md` Master Summary + load-bearing per-section captures (panels, sidebar active row, light-theme weak surface contrast, dark-on-orange BADGE pill, "Light panel" invisible).
- `_rebuild-design-dna.md` §A3 (nest-reduction), §C1 (solid accent gating), §C5 (on-accent), §C6 (surface re-scope cascade), §C7 (mixing constants), §D3 (sharp corners), §D4 (nest-reduction telescoping), §I S5 checklist, Wave 1.6 reconciliation block.

The reading shows a tight pattern: Toolskin's visible identity is carried by **surface-superposition cascade behaviour** and **two-state accent solidity**. The four "binding" patterns map almost exactly onto these visible signatures — except Pattern 1's first 97 lines, which are prose, not behaviour. I'll call that out.

## PRIMARY — Rule 5 identity verdict per pattern

### Pattern 1 — inputs-global-nested-design-pattern L1–97

**Read the source.** L1–97 is NOT code — it is a 97-line architectural refactor brief (`REFACTOR NOTES: INPUTS BASE SYSTEM` / OBJECTIVE / ARCHITECTURE REORGANIZATION / TOKENIZATION LAYERS / DISPLAY-VARIANT LOGIC / REFACTOR REQUIREMENTS / GOAL). The actual code begins at L100. So the catalog flagging "L1–97" as a "binding pattern" is **categorically a documentation flag, not a behavioural flag.** The visible-identity pattern lives downstream — at L101–136 (the public/private token bridge), L147 / L170 / L180 / L185 / L194 / L204 / L339 / L352 / L380 / L383 (the `--ts-this-bg: var(--ts-input-bg)` re-anchoring drop), and L256–293 (the focus-state token override pattern).

- **Visual outcomes produced (by the actual code, not by the prose):**
  - The `--_input-*` private namespace bridges system-level `--ts-this-bg-*` derivatives to the public `--ts-input-*` token surface. This decouples the host theme from the input's stateful colors so a consumer page can override `--ts-input-border` without reaching into the surface engine.
  - The L147 `--ts-this-bg: var(--ts-input-bg)` move RE-ANCHORS the surface derivative chain inside the input. Visible result: the input's inset border, inset button background, focus glow, and child icon colors all compute from the input's own surface, not from the parent section's. Without this, an input on a dark card and an input on a glass surface would have IDENTICAL borders — visibly wrong.
  - The `:has(.ts-input:focus)` focus-within propagation (L138–150 + L256–264) means the WHOLE input group reflows colors when the field is focused — not just the field. This is Toolskin's "focused input feels alive" signature.
  - Inset action button at L152–254: rounds-zero on left, derives its background from `--ts-input-bg`, swaps to accent on hover/focus/primary. This is the famously flush input-button composite seen on the Newsletter/Subscribe block.

- **Toolskin signatures preserved (actual code):** §C6 surface re-scope cascade (YES — the canonical example), §C5 `--ts-on-accent` on the primary-variant inset button (L192/L203/L209 — YES), §D3 sharp corners at flush composition (L160–162 — YES), §F5 `--ts-this-bg-dim-3` see-through idle input (L112 — YES), Rule 5 drop-in identity preservation (YES — the `--ts-input-*` public surface is exactly what a host theme would override).

- **Verdict: MIXED.**
  - The PROSE at L1–97 is convenience only — "LOSE THIS = LOSE A REFACTOR BRIEF." The brief itself is duplicative of `design-tokens-2.0` SKILL Rules 1–6. Burn the comment, no identity loss.
  - The CODE at L100+ (especially L147 re-anchoring + L152–254 inset-button composite + L256–293 focus propagation) is **identity-critical.** LOSE THIS CODE = LOSE TOOLSKIN IDENTITY. The Newsletter form, the search-with-Submit form, and every IDE-view input composition depend on it.

- **Reasoning:** The catalog over-states the prose. The prose says "consolidate inputs into a tokenized layer" — which is what design-tokens-2.0 Rule 1–6 already says canonically. The IMPLEMENTATION is what carries identity. Council should separate these.

### Pattern 2 — iconlist+featlist L1–39

**Read the source.** L1–39 is the explicit LAYER-1 / LAYER-2 architecture brief, prose at the top of the file. The actual implementation begins L47–158 (LAYER-1 token surface) + L411+ (LAYER-2 variant overrides).

- **Visual outcomes produced (by the actual code):**
  - Single `--ts-feat-pad-base → -icon-pad → -icon-gap → -item-pad → -item-gap` derivative chain at L85–89. Override the base, every spacing in the component rescales proportionally. This is the **§A1 + Rule 4 derivative-geometry signature** in pure form on a non-button.
  - Clamp icon engine at L78–80: `clamp(min, base × multiplier, max)`. Variants override **only `--ts-feat-icon-mult`** (one declaration, not five) and the visible icon size shifts. Visible result: featurelist sm/md/lg/xl variants all stay visually tied to a single math; no drift across variants.
  - The custom `--ts-this-bg-border` recipe at L139 + L154 + L158 introduces a per-component `--ts-mix-perc` knob (10% default / 7% in the second declaration). This makes the feat-list border calmer than a default card border by ~30% — a deliberately quieter component-tier border treatment.
  - The `.ts-feat-list.hover-accent` variant (L642) sets `--ts-this-bg: var(--ts-accent-dim-2)` and propagates. Visible result: the entire feat-card subtree (background, border, icon, text) recomputes toward accent — without writing accent into any single property. This is **surface superposition applied to an accent state**.

- **Toolskin signatures preserved:** §A1 height-ratio padding (YES), §A6 harmonic spacing-typography (YES), §C1 accent tinting via `--ts-accent-dim-*` not solid (YES — feat-list never paints solid accent), §C3 atomic border = `--ts-this-bg-border` (YES, AND with a softer mix-perc), §C6 surface re-scope cascade (YES — hover-accent variant is the cleanest example in the corpus), Rule 5 drop-in (YES — consumer can override `--ts-feat-icon-base` or `--ts-feat-pad-base` ONCE and rescale the whole list).

- **Verdict: MIXED.**
  - The PROSE at L1–39 is convenience only. Duplicates `design-tokens-2.0` Rule 4 + Rule 5 + Rule 6. LOSE THIS PROSE = LOSE A README. **Promote the prose into the skill, not kept inline.**
  - The CODE pattern (L47–158 LAYER-1 token surface + L411+ LAYER-2 variant overrides) is **identity-critical** in a different sense than Pattern 1: this is the **canonical TEMPLATE for every Session 4+ molecular component.** Not identity-critical as a visible output — feat-list is a small piece of the visible identity — but identity-critical as the **canonical methodology** that, if abandoned, will cause OTHER components to drift visually. Without this template the rebuild will produce architecturally-correct-but-visually-generic blocks (Gate 4.5 risk note in `_rebuild-design-dna.md` L52).

- **Reasoning:** The catalog correctly identifies this as the model. The prose is replaceable; the code's METHOD (one base, one multiplier, custom mix-perc recipe at component scope) is the binding part. Visible identity loss if abandoned: low at the feat-list itself, HIGH across the cumulative rebuild as other components are built without the template.

### Pattern 3 — ts-card-flip §6d nest-reduction

**Read the source.** §6d is NOT actually defined in `ts-card-flip-…`. The card-flip file at L6–12 only **CONSUMES** it via `border-radius: var(--ts-nest-radius, var(--ts-card-radius))` and `padding: var(--ts-nest-pad, var(--ts-card-pad))`. The actual §6d machinery is defined in `ts-panel+root-debugger-component.css` L25–93 (the explainer + the two `@property` declarations + the explicit depth-2/depth-3 cascade rules) and the primitives live in `root-tokens-blocks-reference.css` §1f-nest L413–420 (`--ts-radius-nest-reduction: 2px` and `--ts-pd-nest-reduction: 2px`).

This is a non-trivial misattribution in the framing. The pattern is ARCHITECTURALLY DISTRIBUTED across three files. Reading any one in isolation underrates it.

- **Visual outcomes produced:**
  - A card inside a card has radius `card_radius − 2px` and padding `card_pad − 2px`. A card inside a card inside a card: `−4px / −4px`. **Visual telescoping.**
  - This signals depth WITHOUT box-shadows. The visible result is the nested-card pattern flagged in `_rebuild-visual-audit.md` desktop-dark-index-section-portfolio and -section-mockups: card-in-card compositions read as nested without shadow weight, because the corners step down.
  - The @property registration at L48–60 of the panel file gives `<length>` typed resolution, so `border-radius: var(--ts-nest-radius)` always gets a valid length (no NaN fallthrough when the cascade hasn't initialized the var). Robust nest-reduction even when only one card is rendered.
  - The explicit depth selectors avoid the own-element calc() cycle problem documented in the L30–37 comment. There is **no other CSS-only way to achieve this** — agents who try to "simplify" this to `calc(var(--ts-nest-radius) - var(--ts-radius-nest-reduction))` will produce zero-output (own-element cycle).

- **Toolskin signatures preserved:** §A3 (THE primary identity claim of nest-reduction), §D4 (radius shrinks by 2px per depth — verbatim), §C4 "depth via surface mixing not box-shadows" (this nest-reduction is the SECOND mechanism that signals depth-without-shadows alongside surface mixing), Rule 5 surface propagation (compatible).

- **Verdict: LOSE THIS = LOSE TOOLSKIN IDENTITY.**

- **Reasoning:** Two visible-identity outcomes with NO substitute:
  1. The nested-card telescoping is one of the two non-shadow depth signals (the other is `--ts-this-bg-dark` surface mixing). Without it, nested cards look flat — exactly the Material/shadcn aesthetic that §G1/G4 explicitly rejects.
  2. The CSS-only mechanism is non-obvious (own-element cycle problem); a sub-agent rebuilding this from scratch without the L25–46 comment will produce a broken approximation. **The L25–46 prose IS load-bearing here, unlike Patterns 1 and 2 where it's replaceable.**

  Catalog flagging is RIGHT to elevate this. My only correction: the §6d pattern is THREE files, not the card-flip file alone. The rebuild's nest-reduction implementation should treat all three as a single unit.

### Pattern 4 — ts-ui-ide-view-fullview two-line re-anchoring idiom

**Read the source.** The idiom appears at 16+ sites across the view (catalog L2361 enumerates them: `.ts-titlebar` L67–68, `.ts-rail` L138–139, `.ts-rail-btn` L171–173 — note the unusual reverse order, `.ts-sidebar` L278–279, `.ts-tree .ts-node` L341–342 with `--ts-this-bg: transparent`, `.ts-msg` L684/691/700, `.ts-ai-input .ts-pill` L833–834, `.ts-terminal` L900, `.ts-status` L974–975, …). The idiom is:

```css
.ts-titlebar {
    background-color: var(--ts-ui-ide-bg);
    --ts-this-bg: var(--ts-ui-ide-surface-2);
    /* ...rest of styles consume --ts-this-bg-* derivatives... */
}
```

Line 1 paints the actual surface from a view-alias token. Line 2 RE-ANCHORS the surface derivative chain so any child element computes its borders / hover / focus / dim-tones from THIS surface's perspective, not the parent IDE-view's perspective.

The reverse-order variant on `.ts-rail-btn` L171–173 is intentional: when `background: var(--ts-this-bg-dim-6)` is declared BEFORE `--ts-this-bg: …`, the cascade re-evaluates and the background paints from the new surface. This is **load-bearing** to make the buttons read against the rail.

- **Visual outcomes produced:**
  - Every IDE component (rail, sidebar, tree, AI panel, message, terminal, status bar) reads its borders/hovers/focus from ITS OWN surface, even though they all sit inside the same `.ts-ide-demo` parent. Visible result: when the IDE view is hovered, hover transitions stay LOCAL to the hovered component instead of cascading parent-relative tints.
  - The `--ts-this-bg: transparent` "punch-through" pattern on `.ts-tree .ts-node` L341–342 means the tree row INHERITS its parent surface for its background, but its hover/focus STILL re-derives from `--ts-this-bg-hover` — which is now computed against the parent. This is the **tree active-row inset accent stripe** signature seen in `_rebuild-visual-audit.md` desktop-dark-index-section-panels ("Dashboard" active row).
  - The IDE view's titlebar / rail / sidebar / status bar all render at different surface tiers (`--ts-ui-ide-surface-1` vs `-surface-2` vs `-bg`) → visible four-tier composition that reads as "an IDE." Without re-anchoring per component, this composition collapses into a uniform color.

- **Toolskin signatures preserved:** §C6 surface re-scope cascade applied UNIFORMLY across an entire view (THE most concentrated example), §C4 depth via surface mixing not shadows (YES, zero box-shadows in this view), §F6 tree component with cascade-sensitivity rule (YES, the punch-through pattern), Rule 5 drop-in (PARTIALLY — the view defines its own `--ts-ui-ide-*` aliases, so the surface-token map is portable).

- **Verdict: LOSE THIS = LOSE TOOLSKIN IDENTITY** at the view tier.

- **Reasoning:** This is the largest-scale demonstration in the corpus of what Rule 4 looks like when applied at view tier. Without this idiom, multi-component views collapse to single-surface-tier compositions — Toolskin loses its signature "IDE-aware depth without shadows." The reverse-order variant on `.ts-rail-btn` is non-obvious — sub-agents will normalize the order and silently break the rail button rendering.

  **Caveat:** This idiom is identity-critical specifically for **dense multi-component views** (IDE, OCE panel, tree-explorer). It is NOT necessary for atomic-component sandboxes. Catalog framing correctly distinguishes view-tier vs component-tier usage (L2543 "View-tier files SHOULD set `--ts-this-bg` at every component boundary; component-tier files SHOULD set `--ts-this-bg` ONCE per component root").

## Visual signature × pattern matrix

| Signature | P1 inputs | P2 iconlist | P3 §6d nest | P4 IDE two-line |
|---|---|---|---|---|
| Surface superposition (Rule 4 / §C6) | YES (canonical) | YES (hover-accent variant) | partial (compatible, not the mechanism) | YES (canonical at view tier) |
| Solid accent only on primary btn + active chip (§C1) | YES (inset button primary) | NO (uses dim-2 tint, correctly) | n/a | NO (status bar paints accent text only, also correct) |
| Sharp corners at flush boundaries (§D3) | YES (inset button L160–162) | NO | NO | YES (radius:3px rail buttons) |
| Depth via surface mixing, not box-shadows (§C4) | YES | YES | **YES — additional non-shadow mechanism** | YES (zero shadows in view) |
| Auto-contrast `--ts-on-accent` (§C5) | YES (inset primary L192/L203/L209) | indirect | n/a | YES (`.ts-rail-btn .ts-badge` L224) |
| Drop-in identity preservation (Rule 5) | YES (`--ts-input-*` public token surface) | YES (`--ts-feat-*` public token surface) | YES (tuning tokens exposed) | PARTIAL (view-specific `--ts-ui-ide-*` aliases) |
| §A3 nest-reduction (containerish telescoping) | NO | NO | **YES — THE definition** | NO |
| §A1 component padding = ratio of height | indirect | YES (via pad-base chain) | n/a | YES |
| §F6 tree cascade-sensitivity | NO | NO | NO | YES (the punch-through pattern) |
| §D4 nest-reduction telescoping | NO | NO | **YES — THE definition** | NO |
| Mixing constants are engine-derived (Rule 15 / Resolution #1) | mostly (1 `--ts-this-bg-mix` consumer) | **VIOLATION** — hand-tunes `--ts-mix-perc` 10%/7% + `--ts-this-bg-grad-bright-pct` 6% + `-grad-dark-pct` 7% at component scope | n/a | mostly |

Two clean observations from the matrix:
- **Pattern 2 fails Rule 15 / Resolution #1** by hand-tuning mixing constants at component scope. This is a binding-rule violation, NOT just hygiene. Surface to owner.
- **Pattern 3 is the ONLY pattern whose mechanism has no substitute.** The other three carry identity but their identity-bearing parts could be re-derived; the nest-reduction CSS-only mechanism is documented as the only way to avoid the own-element cycle.

## SECONDARY findings

### Rule 15 violations (~155 `--ts-bg-N` direct refs) — identity threat or refactor concern?

Catalog tallies (L2810): chunk 5b alone has 147 dedup'd refs; chunk 5a 13; chunks 4a/4b not yet tallied (likely another ~80–100); implicit grand total ~250+ direct primitive refs.

**Identity verdict: refactor concern, NOT identity concern.** Reasoning:
- Rule 5 / R-rule-15 is an **architectural-hygiene rule** about WHICH variable a component references. It doesn't change PIXELS shipped.
- A component that does `background: var(--ts-bg-2)` paints the same pixels as one that does `--ts-this-bg: var(--ts-bg-2); background: var(--ts-this-bg)` — UNLESS the theme/surface superposition path is exercised (apcach re-runs primitives, or a parent scope overrides).
- The visible-identity threat only materializes when (a) the consumer re-themes via `--ts-this-bg` and the direct-ref'd component doesn't follow, OR (b) the apcach engine re-emits primitives and the direct-ref breaks contrast.

So 155 direct refs threaten **drop-in identity (Rule 5)** in the host-theming scenario, NOT visual identity in the default-theme scenario. This is exactly the Rule 5 "product differentiator" — the catalog framing is correct to flag it, but the urgency is **drop-in fidelity**, not **visible drift**.

**Critic verdict: if we ship now with 155 refs, the dark default looks like Toolskin. Light theme breaks (see Wave 1.6 weak-surface-contrast finding). Host-theme drop-in breaks. So: identity threat IS real, but it's at the Rule 5 + light-theme tiers, not at the dark-default tier.**

### The 4 `oklch(from)` Wave 1.6 anti-pattern hits

Identity threat: NO. Engineering threat: YES.
- All 4 are `--ts-on-accent: oklch(from var(--ts-accent) clamp(0, (T − l) * 999, 1) 0 0)` at three different thresholds (0.75 × 3, 0.55 × 1).
- They produce **correct pixels** in supporting browsers — this is THE on-accent formula.
- The Wave 1.6 / Resolution #1 objection is that mixing constants and thresholds must be **engine-derived outputs from apcach**, not runtime `from` expressions. Reason: runtime `from` is sensitive to browser support, doesn't accept primitive-fallback substitution well, and creates two sources of truth (the runtime formula AND the apcach-emitted `--ts-on-accent` baked into colors.css).
- **Identity verdict:** at the pixel level, identical to apcach output. At the architecture level, this is a Rule 15 / Tier 1 violation that will silently bypass apcach when colors.css is regenerated. So: not an identity threat THIS release, but a **time-bomb** for re-themable builds.

### footer.css primitive REDEFINITION at component scope (L831 `--ts-bg-1` redefined as a surface derivative)

Identity threat: HIGH for any descendant of `footer.ts-footer.ts-footer--dark`, ZERO outside it.
- The L831 redeclaration `--ts-this-bg: var(--ts-text-muted-dim); --ts-bg-1: var(--ts-this-bg-dim-4)` means EVERY descendant of footer-dark that references `--ts-bg-1` (directly or via the system layer) now gets a mid-tone derived from text-muted-dim, NOT the canonical near-black `--ts-bg-1`.
- This is a **PRIMITIVE LAYER POLLUTION at component scope.** The catalog correctly flags this as the worst Rule 15 violation in chunk 4b (L1981–1988).
- Visible damage today: invisible IF footer-dark is the only place this happens; very visible IF a consumer drops a card or input that references `--ts-bg-1` inside a `--dark` footer expecting brand-canonical floor.
- The triple-declaration of `.ts-footer--dark` (L654–663, L768–775, L814–818) makes this even worse — the cascade resolves to whichever rule wins, no single source of truth.

**Verdict:** **identity threat at the architectural level** because it breaks the primitive→system→component contract irrecoverably for descendants. Must be rebuilt, not refactored. This is also a Wave 1.6 "light-theme weak surface-contrast" likely culprit — the `[data-theme="light"] footer.ts-footer.ts-footer--dark` paradox at L654 (light THEME, dark VARIANT, forced-dark resolution) generates exactly the kind of asymmetric per-theme math that Resolution #1 forbids.

### `ts-cube-portfolio` — does shipping it as-is dilute Toolskin identity?

YES.
- L96–104 redeclares accent HSL (`--ts-accent-h: 18`, `-s: 100%`, `-l: 52%`) AND primitives (`--ts-bg-body`, `--ts-bg-0..4` as hex literals) at component file scope.
- This is the **shadowing pattern** the catalog flagged on OCE panel — a component file maintaining its own primitive layer regardless of host theme.
- Visible damage: any page that includes both `ts-cube-portfolio.css` and the canonical primitives gets a different orange (hue 18 vs canonical 22 in showcase) and a different floor (`#080809` vs canonical floor) wherever cube-portfolio rules win the cascade.
- Owner has ALREADY ruled on this: L17–19 of the file states "this file may stay isolated UNTIL integration is complete — but the final cube-portfolio component MUST NOT ship with its own dedicated CSS sheet." This is owner-canonical.

**Verdict: identity threat. Must NOT ship as a dedicated sheet. Right response (catalog L2330):** treat it as a SPEC of what to fold into existing components, not as a file to refactor in place. Most rules DELETE on integration; the unique parts (SVG rulers, big-letter treatment, sliding-menu wave-reveal) become variants on existing components. Owner-ruling already exists; respect it.

## Critic verdict — "if we ship now, will it look like Toolskin?"

**Per-pattern ship-without verdict:**

| Pattern | Ship-without verdict |
|---|---|
| 1 — inputs prose (L1–97) | LOSES A README. No visible identity damage. **DROP THE PROSE; preserve the code at L100+.** |
| 1 — inputs code (L100+) | LOSES the focused-input alive feel, the inset-button flush composition, and the input-group surface re-anchoring. **PRESERVE.** Visible identity damage = HIGH on every form. |
| 2 — iconlist+featlist prose (L1–39) | LOSES A METHODOLOGY README. Replaceable via `design-tokens-2.0`. **PROMOTE the prose into the skill, drop from the component.** |
| 2 — iconlist+featlist code (L47+) | LOSES the canonical TEMPLATE for all Session 4+ molecular components. **PRESERVE the template; FIX the Rule 15 mixing-constant violation at L139/154/158 — those constants must be engine-derived.** Visible identity damage from losing the template = LOW on feat-list itself, HIGH cumulatively across the rebuild. |
| 3 — §6d nest-reduction | **LOSES THE TELESCOPING DEPTH SIGNAL** — a primary §A3/§D4/§C4 identity signature. PRESERVE. Note that the pattern is THREE files (primitive + system + consumer); rebuild all three together or none. Visible identity damage = HIGH wherever nested cards/panels appear. |
| 4 — IDE two-line idiom | **LOSES MULTI-COMPONENT-VIEW DEPTH.** IDE, OCE panel, tree-explorer collapse to one-tier surfaces. Visible identity damage = HIGH on those views, LOW on atomic-component sandboxes. PRESERVE but scope its required usage to view-tier components, not atomic ones. |

**Secondary aggregate verdict:**

- 155 `--ts-bg-N` refs: ship-without = dark mode looks correct, light mode broken (visual audit confirms), host-theme drop-in broken. Identity threat is REAL but at the Rule 5 + light-theme tier, not at the default dark.
- 4 `oklch(from)` hits: pixel-identical today; architectural time-bomb. Not a today-ship threat; a tomorrow-rebuild threat.
- footer L831 primitive redefinition: architectural identity threat. Must REBUILD not REFACTOR. This is the worst single violation in chunk 4b.
- ts-cube-portfolio as dedicated sheet: identity threat (hue 18 vs canonical, alternative floor primitives). Owner-canonical ruling: must NOT ship as own sheet. Honor it.

**Overall:** if we ship the current extracted blocks without intervention, the dark-default surface LOOKS Toolskin in ~80% of cases. The 20% that breaks: (a) the four binding patterns above produce VERY VISIBLE damage if abandoned, (b) light-theme is the visible-identity failure case the visual audit already caught, (c) drop-in / Rule 5 fails immediately wherever direct primitive refs exist, (d) the footer-dark and cube-portfolio scopes already drift today.

## Recommended NEW RULINGS (Critic — surface to owner)

1. **RULING — Prose vs code distinction in catalog flagging.** When a catalog flags an "L1–N binding pattern" and L1–N is prose, EXPLICITLY parse it as: prose = methodology that belongs in a skill, code = identity-bearing implementation. Do not let prose count toward "binding patterns" in code-shipped scope. Surface as design-DNA process amendment.

2. **RULING — Pattern 3 nest-reduction must travel as a unit of three files.** Primitives (`--ts-radius-nest-reduction` / `--ts-pd-nest-reduction` in `root-tokens-blocks-reference.css` §1f-nest L413–420) + system (`@property` + depth-2/depth-3 cascade in `ts-panel+root-debugger-component.css` L25–93) + consumer (Layer-1 in card/panel components). Any rebuild that ships one or two of three breaks. Encode as a refusal pattern R-DNA-nest-reduction.

3. **RULING — Pattern 2's component-scope mixing-constant override (`--ts-mix-perc: 10%`/`7%`, `-bright-pct: 6%`, `-dark-pct: 7%`) is a Rule 15 / Resolution #1 violation even though the OUTER pattern is canonical.** The custom recipe should be apcach-engine-derived per-component, not hand-tuned. Otherwise this "canonical template" silently teaches every Session 4+ sub-agent to hand-tune mixing constants at component scope. **Council should HALT (Pattern 16) before adopting iconlist+featlist as canonical.**

4. **RULING — Footer L831 primitive redefinition is a CATEGORICAL REBUILD, not a refactor.** Catalog correctly flags as worst Rule 15 violation. Treat as a Tier 1 architectural integrity failure (primitive layer pollution at component scope). The rebuild's footer MUST set `--ts-this-bg` only, never `--ts-bg-N`.

5. **RULING — ts-cube-portfolio file shall NOT be cataloged on the same axis as other view files.** Owner-canonical ruling already exists in the file's L17–19 header. Re-encode as a refusal pattern R-cube-portfolio-isolation: any attempt to refactor it in place fails the rule; only fold-into-existing-components integration is canonical.

6. **RULING — View-tier vs component-tier `--ts-this-bg` set frequency.** Catalog L2543 stated the principle inline; promote it to a binding rule: view-tier files MAY set `--ts-this-bg` at every component boundary (Pattern 4 idiom); component-tier files SET `--ts-this-bg` exactly ONCE on the component root (Pattern 1 idiom). Multiple component-tier sets is an R-DNA refusal candidate.

7. **RULING — Catalog over-statement protocol.** The catalog flagged 4 patterns as "binding" but two of those (Patterns 1 prose, Pattern 2 prose) are convenience documentation. Future council reviews of catalog outputs should run a Pattern-1-style "is this code or prose?" split before adopting "binding" status. Prevents the "everything is critical" failure mode.

---

# ARCHITECT

## Mandatory reading completed

- `toolskin-architecture/SKILL.md` — full (§9 three-tier, §10 RULING 7 apcach supremacy, §12 surface superposition, §13 cascade strategy, §22 refusal patterns)
- `design-tokens-2.0/SKILL.md` — full (Tier 1/2/3 rules, Rule 2 reference chain, Rule 4 derivative system, Rule 5 ts-this-bg)
- `toolskin-visual-audit/SKILL.md` — full (probe protocol, token-leak grep, Rule 15 enforcement)
- `_extracted-blocks-catalog.md` — binding-pattern sections (4b chunk verdict L2200–2275 + 5a chunk view lessons L2332–2373)
- `_code-audit-catalog.md` — §1–§4.2 (root token block, surface engine line 911, primitives line 93)
- `inputs-global-nested-design-pattern.css` — L1–500 (full input-base-system + §6e/§6f/§6g chip surface re-anchor)
- `iconlist+featlist-allvariants-component.css` — full 672 lines
- `ts-card-flip-swipe-interactive-component.css` — L1–460
- `ts-panel+root-debugger-component.css` — L1–100 (§6c panel base + §6d NEST-REDUCTION SYSTEM L25–93 with the two `@property` registrations L48 and L55)
- `ts-ui-ide-view-fullview.css` — L1–200
- `assets/css/next/system/surfaces.css` — full (TWO `:root` + `:where(:root, :root *)` blocks; declares all 20-ish `--ts-this-bg-*` derivatives, hue-locked anchors `--ts-tone-contrast/-muted/-floor`, but NO `--ts-this-bg-dark-2/-3..-6`, NO `--ts-this-bg-grad-2/-3/-4`, NO `--ts-this-bg-bright-2/-3`, NO `--ts-this-bg-dim-5/-6`)
- `assets/css/next/primitives/colors.css` — full (apcach-derived OKLCH primitives, dual-emitted with sRGB fallbacks, 10 surface presets, `--ts-on-accent` already engine-baked at L18 with RULING 4 threshold 0.75)

## PRIMARY — Three-tier architectural verdict per pattern

### Pattern 1 — `inputs-global-nested-design-pattern` L1–97 (.ts-input base block L100–136)

**Tokens consumed at the base rule:**

| Token | Tier | Status |
|---|---|---|
| `--ts-accent` | SYSTEM (engine-baked at primitives/colors.css L13–14) | OK |
| `--ts-on-accent` | SYSTEM (engine-baked L18) | OK |
| `--ts-text-primary`, `--ts-text-primary-dim-2` | SYSTEM (text primitives in colors.css L38–43; the `-dim-2` derivative MISSING from rebuild) | **MISSING DERIVATIVE** |
| `--ts-this-bg-dim`, `-dim-3` | SYSTEM (surfaces.css L87–89 ✓ exposes both) | OK |
| `--ts-this-bg-border` | SYSTEM (surfaces.css L104 ✓) | OK |
| `--ts-this-bg-grad-3` (commented L125) | SYSTEM (NOT in surfaces.css — only `-grad`, `-hover-grad`, `-active-grad` exist) | **MISSING — three grad variants gap** |
| `--ts-input-fs`, `--ts-input-h`, `--ts-input-pad-x`, `--ts-input-radius`, `--ts-input-border` | COMPONENT | OK (component-scoped) |
| `--_input-accent`, `--_input-color`, `--_input-bg`, `--_input-border`, `--_input--focus-accent`, `--_input-focus` | PRIVATE LOCAL (LAYER-3 / "VARIANT TOKENS" in the 3-layer scheme; the catalog NEW-finding #2 lifts this as the "4-LAYER NESTED DESIGN PATTERN") | OK pattern, but **conventionally undocumented** |

**Architecture verdict:** The .ts-input base rule is the canonical Rule 4 reference (per catalog L2222). The pattern is architecturally sound. **It conforms to the rebuild's three-tier model — provided the system layer exposes everything it asks for.**

The block's payload is:
- Set up component tokens at component scope (correct Tier 3).
- Consume system derivatives via cascade (correct Tier 2 lookup).
- Use a private `--_input-bg` slot so a child rule can REWRITE the surface input without touching the public `--ts-this-bg` directly — then re-anchor `--ts-this-bg: var(--ts-input-bg)` so child surfaces recompute the derivative chain.

This is **exactly what surface superposition requires**. It is NOT a violation; it is the textbook implementation.

**System-layer additions required before Session 4 begins:**

1. **`--ts-this-bg-grad-2`, `--ts-this-bg-grad-3`, `--ts-this-bg-grad-4`** — the old repo's gradient family has at least 4 variants. The rebuild's `surfaces.css` exposes ONE base `--ts-this-bg-grad` + `-hover-grad` + `-active-grad`. **Three additional numbered grad variants are missing**, and at least Pattern 2 (iconlist `--ts-feat-bg-grad-hover: var(--ts-this-bg-grad-2)`) AND Pattern 4 explicitly consume them.

2. **`--ts-text-primary-dim-2`** — consumed at L111 of inputs (`--_input-color: var(--ts-text-primary-dim-2)`). Tier 2 derivative ON TOP of `--ts-text-primary`. surfaces.css does NOT expose it. **Needs new `text.css` system file** or append to surfaces.css.

3. **`--ts-input-*` Tier-3 cartel needs canonical home.** Currently the inputs base rule declares `--ts-input-fs`, etc. by REFERENCE without anything providing the initial values. Most cleanly in a new `assets/css/next/components/inputs.css` LAYER-1 file.

**RULING 7 audit:**

- Line 272: `box-shadow: 0 0 4px 4px color-mix(in srgb, var(--_input-accent), transparent 79%)` — `79%` is a hand-tuned percentage. **VIOLATION.** Must become an engine output or a tokenized mixing constant (`--ts-glow-mix-pct`).
- Line 161: `border-radius: 0` (forced sharp) — Wave 1.6 §11 says sharp corners (radius 0) are intentional at composition boundaries. Acceptable IF the comment makes it intentional; otherwise should consume `--ts-radius-sharp`.
- The `--ts-fs-xs: 10px` literal at L685 (inside chip block) — hand-tuned px breaks Rule 5 R-rule-15. Must consume the harmonic ladder.

**Session 4 implementation requirement:** The rebuild canNOT begin block work on inputs UNTIL:
- `surfaces.css` exposes `--ts-this-bg-grad-2`, `-grad-3`, `-grad-4` (or the catalog reduces consumption to the single canonical `-grad`/`-hover-grad`/`-active-grad`),
- a `text.css` system file exposes `--ts-text-primary-dim-2`,
- a `components/inputs.css` file declares the `--ts-input-*` cartel defaults.

### Pattern 2 — `iconlist + featlist` L1–39 (full LAYER-1/LAYER-2 + clamp icon engine + derivative spacing chain)

**Tokens consumed (LAYER-1 declarations L42–159):**

| Token | Tier | Status |
|---|---|---|
| `--ts-btn-icon`, `--ts-icon` (fallback chain at L56) | COMPONENT (cross-component cascade lookup) | OK pattern but needs canonical declaration |
| `--ts-sp-5` (L85, `--ts-feat-pad-base: var(--ts-sp-5)`) | PRIMITIVE (4pt spacing scale) | OK — must exist in primitives |
| `--ts-fs-body-sm`, `-md`, `-body`, `-lg` (L96, L100) | SYSTEM (harmonic font scale aliases) | OK pattern |
| `--ts-radius-sm` (L105) | SYSTEM (explicit radius ladder, Wave 1.6 = `--ts-radius-30: 8px` base) | OK |
| `--ts-this-bg-dim`, `-grad`, `-grad-2`, `-border`, `-border-hover`, `-focus`, `-surface` | SYSTEM | **`-grad-2` MISSING** in rebuild; **`--ts-this-bg-surface` MISSING** (L109); rest OK |
| `--ts-bg-2` (L109 fallback only) | PRIMITIVE — used as `var(--ts-this-bg-surface, var(--ts-bg-2))` fallback | **R-rule-15 borderline**: primitive as FALLBACK inside system-token consumer. Acceptable as defensive default at component-token scope but should migrate to `var(--ts-this-bg, var(--ts-this-bg-surface))` to keep lookup inside system layer. |
| `--ts-accent`, `--ts-accent-bright`, `--ts-accent-dim`, `--ts-accent-border` | SYSTEM (accent derivatives) | **`--ts-accent-bright`, `-dim`, `-border` MISSING** in current rebuild colors.css — only base `--ts-accent` + `--ts-on-accent` are baked |
| `--ts-text-accent`, `--ts-text-primary`, `--ts-text-primary-dim-2` | SYSTEM | `--ts-text-accent` MISSING; `--ts-text-primary-dim-2` MISSING (as in Pattern 1) |
| `--ts-feat-icon-*`, `--ts-feat-pad-*`, etc. | COMPONENT-LOCAL (Tier 3) | OK pattern — fully tier-conformant |

**The clamp icon engine** (L56–80):

```css
--ts-feat-icon-base: var(--ts-btn-icon, var(--ts-icon, 45px));
--ts-feat-icon-mult: var(--ts-feat-mult-xs);  /* swappable */
--ts-feat-icon-size: clamp(--ts-feat-icon-min, calc(base × mult), --ts-feat-icon-max);
```

**Textbook Tier-3 derivative system per design-tokens-2.0 Rule 4.** The `45px` fallback at the deepest level IS a primitive literal — borderline acceptable as defensive fallback when the upstream component chain breaks, but R-rule-15 strictly says no raw `px` in component scope. **The clean fix:** declare `--ts-icon-base: var(--ts-fs-base) * 3.46` at SYSTEM scope, remove the `45px` literal.

**The derivative spacing chain** (L85–89): Textbook Rule 4 derivative chain — conformant.

**The custom `--ts-this-bg-border` recipe** (L139, L154, L158):

```css
--ts-this-bg-border: color-mix(in srgb, var(--ts-this-bg), var(--ts-text-primary) var(--ts-mix-perc));
--ts-mix-perc: 10%;
```

**ARCHITECTURAL CONFLICT WITH REBUILD'S surfaces.css.** Current rebuild surfaces.css L104 already declares:
```css
--ts-this-bg-border: color-mix(in oklch, var(--ts-this-bg), var(--ts-tone-contrast) var(--ts-mix-perc));
```

The OLD pattern uses `in srgb` and mixes toward `var(--ts-text-primary)` directly. The REBUILD pattern uses `in oklch` and mixes toward the hue-locked `--ts-tone-contrast` anchor (powerless-hue trick). **REBUILD WINS — the rebuild's hue-lock is RULING-aligned.** The iconlist/featlist redeclaration was a workaround for the old engine's hue rotation; the rebuild engine doesn't need it.

**However:** the iconlist/featlist block DOES expose `--ts-mix-perc` as a **per-component knob** (10% baseline, can be lifted to 7% for light theme). The rebuild's surfaces.css already exposes `--ts-mix-perc` (L57: `--ts-mix-perc: 20%`). **The knob mechanism survives; the formula does not.**

**Architecture verdict:** Pattern 2 conforms to the three-tier model. Its LAYER-1/LAYER-2 brief (L1–39) IS the rebuild's per-component file template.

**System-layer additions required before Session 4 begins:**

1. **Accent derivative chain** — `--ts-accent-bright`, `--ts-accent-dim` (multiple steps), `--ts-accent-border`, `--ts-text-accent` need to be exposed (either `colors.css` engine outputs or new `system/accent.css`). Per RULING 7, these MUST be apcach-derived; the rebuild does NOT yet bake them.
2. **`--ts-this-bg-grad-2`** — same gap as Pattern 1.
3. **`--ts-this-bg-surface`** — semantic alias OR remove from catalog (the fallback at L109 is temporary scaffold).
4. **`--ts-text-primary-dim-2`** — same gap as Pattern 1.
5. **`--ts-icon-base`** (or `--ts-btn-icon`) declared at SYSTEM scope so the `45px` primitive fallback can be removed.

**RULING 7 audit:**

- L139, L154: `color-mix(in srgb, ...)` for `--ts-this-bg-border`. **SRGB MIX VIOLATION** — rebuild surfaces.css uses `in oklch`. **DO NOT carry forward.**
- L687: `--ts-accent-bright: color-mix(in srgb, var(--ts-accent), var(--ts-text-primary-dim-2) 70%)` inside chip block — `70%` hand-tuned constant. **VIOLATION** — must be apcach-derived `--ts-accent-bright`.
- L141–142, L156–157: `--ts-this-bg-grad-bright-pct: 6%; --ts-this-bg-grad-dark-pct: 7%` — these match the rebuild's spec defaults but the OLD repo's `7%` for dark differs from the rebuild's `14%`. **Engine-derivable constant — NOT a violation if the engine OUTPUTS them, but reading them as hand-tuned values in a component is.** Per surfaces.css comment, these are knobs in the system layer; component-scoped overrides like this should HAVE them or DELETE them, not redeclare with their own number.

### Pattern 3 — `ts-card-flip §6d nest-reduction` (`@property --ts-nest-radius` / `--ts-nest-pad`)

**Source of truth:** Catalog at L2265 attributes the `@property` registrations to `ts-panel L25–43, L48–55`. I verified — the actual `@property` declarations live in `ts-panel+root-debugger-component.css` L48 (`--ts-nest-radius`) and L55 (`--ts-nest-pad`). The `ts-card-flip…` file CONSUMES them via `var(--ts-nest-radius, var(--ts-card-radius))` at L11 — it does NOT register them. The catalog cross-references this as "§6d NEW-B16" comment in both files.

**Tokens consumed:**

| Token | Tier | Status |
|---|---|---|
| `--ts-card-radius`, `--ts-card-pad`, `--ts-card-bg`, `--ts-card-border`, `--ts-card-gap`, `--ts-card-bg-2` | COMPONENT (Tier 3) | OK pattern; need declaration |
| `--ts-panel-radius`, `--ts-panel-bg`, `--ts-panel-border`, `--ts-panel-pad`, `--ts-panel-gap` | COMPONENT (Tier 3) | OK pattern |
| `--ts-nest-radius`, `--ts-nest-pad` | **SYSTEM (cross-component shared)** — REGISTERED via `@property`, INHERITS true, INITIAL-VALUE `9.2px` / `24px` | **System-layer concern — see verdict** |
| `--ts-radius-nest-reduction`, `--ts-pd-nest-reduction` | SYSTEM (cross-component nesting-step knobs declared at `:root` per §1f-nest) | MISSING from rebuild's surfaces.css |
| `--ts-this-bg`, `--ts-this-bg-border-hover` | SYSTEM | OK |

**Tier classification of `@property --ts-nest-radius`:**

`--ts-nest-radius` and `--ts-nest-pad` are SHARED between `.ts-card` and `.ts-panel` (two different component families). It is a CROSS-COMPONENT contract — not a private component cartel. **By design-tokens-2.0 Rule 1, it is a SYSTEM token (Tier 2).**

`@property` registration is **a Tier-2 concern.** It belongs at the system layer for two reasons:
1. The descendant selectors (`.ts-card .ts-panel`, etc.) are cross-component cascades — declaring them in a single component file fragments authority.
2. The `@property` typed `<length>` registration is what makes the `calc(--canonical - N × --step)` math actually interpolate.

**Architecture verdict:** Pattern 3 conforms to the model IF the rebuild lifts the `@property` declarations + the depth-cascade selectors + the `--ts-radius-nest-reduction` / `--ts-pd-nest-reduction` knobs into a new SYSTEM file: **`assets/css/next/system/nesting.css`** (next to `surfaces.css`).

It would be **architecturally WRONG** to leave these declarations inside a single component file, because:
- Cross-component selectors there create cross-component coupling at the wrong tier.
- A future component (e.g. `.ts-modal .ts-card`) would need its own copy.
- The `--ts-radius-nest-reduction` knob can't be tuned globally if it's locked in `ts-panel.css`.

**System-layer additions required before Session 4 begins:**

1. **New file `assets/css/next/system/nesting.css`** containing:
   - `@property --ts-nest-radius { syntax: "<length>"; inherits: true; initial-value: <derived-from-rebuild-radius>; }`
   - `@property --ts-nest-pad { syntax: "<length>"; inherits: true; initial-value: <derived-from-rebuild-spacing>; }`
   - `:root { --ts-radius-nest-reduction: <value>; --ts-pd-nest-reduction: <value>; }` (the knobs)
   - The depth-2 and depth-3 selector cartel.

2. **The `initial-value` literals** (currently `9.2px` and `24px` in ts-panel L51 and L58) must be **derived from rebuild radius/spacing primitives**, NOT carry forward the old repo's literal values. RULING 7.

**RULING 7 audit:**

- ts-panel L51: `initial-value: 9.2px` — comment says "safe fallback — `--ts-radius-lg` at base scale 8px×1.15". **VIOLATION.** Must equal the rebuild's canonical "card radius."
- ts-panel L58: `initial-value: 24px` — comment says "safe fallback — `--ts-sp-6` at base scale 4px×6". Same issue.
- `--ts-radius-nest-reduction` / `--ts-pd-nest-reduction` values: must be engine-derived constants per RULING 7.

**Side-finding — `@shadow-*` @property registrations** (ts-card-flip L307–323): three `@property` declarations for `--shadow-blur`, `--shadow-offset`, `--shadow-opacity` — these DROP THE `--ts-` namespace prefix. Catalog flags this at L2250 as a real bug. **Architectural verdict: namespace violation. Must be `--ts-shadow-blur`, etc.**

### Pattern 4 — `ts-ui-ide-view-fullview` two-line re-anchoring idiom

**Tokens consumed:**

| Token | Tier | Status |
|---|---|---|
| `--ts-ui-ide-bg`, `--ts-ui-ide-surface-1..3`, `--ts-ui-ide-border-0`, `--ts-ui-ide-border`, `--ts-ui-ide-bg-dim`, `-bg-hover`, `-bg-hover-accent` | **VIEW-PRIVATE** (Tier 3+, a NEW tier below component — view layer) | OK pattern; needs formalisation |
| `--ts-this-bg`, `--ts-this-bg-dim-3`, `--ts-this-bg-dark-1`, `--ts-this-bg-border` | SYSTEM | Mostly OK in rebuild — but **`--ts-this-bg-dim-6` MISSING** (consumed at ts-rail-btn L171) |
| `--ts-bg-0..2`, `--ts-bg-body` | PRIMITIVE | **R-rule-15 VIOLATION** in the view cartel L31–33: `--ts-ui-ide-surface-1: var(--ts-bg-0)` consumes a primitive directly inside the view layer. The catalog L2347 acknowledges this. **Clean rule:** view-private cartel may only ALIAS production tokens through `--ts-this-bg` derivatives — no raw primitives. |
| `--ts-text-muted`, `--ts-text-primary`, `--ts-text-secondary` | SYSTEM/PRIMITIVE | OK (in colors.css) |

**The two-line idiom itself:**

This IS surface superposition (Rule 4 / SKILL.md §12). It is the ARCHITECTURAL CORE of Toolskin. The pattern requires:
- `--ts-this-bg` is INHERITABLE.
- The full derivative chain (`--ts-this-bg-dim/bright/border/grad/...`) is RE-RESOLVED PER ELEMENT against the inherited `--ts-this-bg`.

**Does this require additions to surfaces.css?**

Auditing the current surfaces.css against this requirement:

1. **Is `--ts-this-bg` writable / re-anchorable from a component selector?** YES. surfaces.css L43–76 declares `--ts-this-bg` at PLAIN `:root` (NOT `:where(:root, :root *)`), explicitly so descendants inherit and components can override. The comment block L11–17 is unequivocal.
2. **Do the derivatives re-resolve per element?** YES. surfaces.css L79 declares the entire `--ts-this-bg-dark/dim/bright/hover/...` family inside `:where(:root, :root *)` — `:where()` keeps specificity at (0,0,0) so any component rule wins, and the universal selector ensures every element re-resolves against its own inherited `--ts-this-bg`.

**So the two-line idiom WORKS against the current surfaces.css mechanism. ✓**

**But — system-layer additions required for Pattern 4 specifically:**

1. **`--ts-this-bg-dim-5`, `--ts-this-bg-dim-6`** — ts-rail-btn L171 uses `var(--ts-this-bg-dim-6)`. Current surfaces.css exposes only `-dim`, `-dim-2`, `-dim-3`, `-dim-4`. **TWO MISSING dim-step derivatives.**
2. **`--ts-this-bg-dark-1`** — ts-ui-ide L36 / L138 consumes `--ts-this-bg-hover: var(--ts-this-bg-dark-1)`. Current surfaces.css L83 DOES expose `--ts-this-bg-dark-1` (✓). **OK — no addition needed.**
3. **`--ts-this-bg-grad-4`** — ts-card-flip L230 consumes it (cross-pattern reference). MISSING (see Pattern 1).
4. **Three view-private surface aliases must NOT be allowed to reference primitives directly** — convention fix, not a surfaces.css addition. Refusal-pattern enforcement.

## CRITICAL GATE QUESTION

**Does Pattern 4 (ts-ui-ide-view-fullview two-line idiom) require an addition to `surfaces.css` BEFORE Session 3 can close / Session 4 can begin?**

### **NO — the two-line idiom MECHANISM is already supported by surfaces.css as it stands today.**

**Full reasoning with surfaces.css evidence:**

The Pattern-4 idiom requires exactly two architectural properties from the system layer:

1. **`--ts-this-bg` must be inheritable** — a component setting `--ts-this-bg: <value>` on its own selector must propagate to ALL descendants of that component, AND ancestors above it must be re-anchorable too.
2. **The full derivative chain must re-resolve per element** — when a descendant inherits a new `--ts-this-bg`, its `-dim`, `-bright`, `-border`, `-grad`, etc. must be COMPUTED FROM THAT INHERITED value, not from `:root`'s value.

The current rebuild surfaces.css **explicitly engineers both** (lines 11–20 explain it, lines 44–76 implement #1, lines 78–131 implement #2). Architect Mark — the spec engineer — went out of his way to correct a draft that put `--ts-this-bg` inside `:where(:root, :root *)` (universal selector), explaining: *"a universal selector re-declares the property on every element, and a declared value always beats an inherited one — so an ancestor override could never reach a descendant."* That correction is the EXACT WORK that makes Pattern 4 viable.

**Direct evidence test:** If a Session 4 sandbox file authored:
```css
.ts-titlebar {
    background-color: var(--ts-ui-ide-bg);
    --ts-this-bg: var(--ts-ui-ide-surface-2);
    border-bottom: 1px solid var(--ts-ui-ide-border);
}
```

With `--ts-ui-ide-surface-2: var(--ts-bg-1)` declared in a view-private cartel, this would render correctly TODAY against `assets/css/next/system/surfaces.css`:
- `--ts-this-bg` set on `.ts-titlebar` is inherited by descendants.
- Descendants read `--ts-this-bg-border` and get `color-mix(in oklch, var(--ts-this-bg), var(--ts-tone-contrast) 20%)` evaluated against the INHERITED `--ts-this-bg-1` value.
- The hue-lock anchors (`--ts-tone-contrast`, `--ts-tone-floor`) are also declared at plain `:root` so they inherit and remain stable.

**The mechanism is complete. ✓**

### However — Session 4 still has gating dependencies that are NOT Pattern-4-mechanism issues:

These are PRODUCT gates (the catalog of derivatives Pattern 4 USES is missing some entries), not MECHANISM gates:

- `--ts-this-bg-dim-5`, `--ts-this-bg-dim-6` — needed by ts-rail-btn.
- `--ts-this-bg-grad-2`, `--ts-this-bg-grad-3`, `--ts-this-bg-grad-4` — needed by Patterns 1, 2, and other view rules.
- Accent derivative family (`--ts-accent-bright`, `-dim`, `-border`, `-glow-bg-2`, etc.) — needed by Patterns 1, 2, 4.
- `--ts-text-primary-dim-2` and friends — needed by Patterns 1, 2, 4.

**Verdict refinement:** Session 3 can CLOSE on Pattern 4 — the architectural mechanism is sound. **Session 4 cannot BEGIN block work on the ts-ui-ide view, OR on inputs, OR on iconlist/featlist, UNTIL the catalog of missing derivatives is added to the system layer (surfaces.css derivative extension + a new `accent.css` + a new `text.css` + a new `nesting.css`).** These are PRODUCT gates, not mechanism gates.

The two-line idiom passes the gate. The DERIVATIVE CATALOG fails the gate.

## SECONDARY — architecture audit

### `footer.css L662 / L831` primitive REDEFINITION

**Three-tier verdict:** **CATASTROPHIC ARCHITECTURAL INVERSION.**

- **L662:** `--ts-bg-2: #ffffff14` at component scope → a COMPONENT rule redeclares a PRIMITIVE token, breaking Rule 2 (reference chain) directionality.
- **L831:** `--ts-bg-1: var(--ts-this-bg-dim-4)` → a primitive set FROM a system-layer derivative. **REVERSE FLOW** through the tiers.

**Architectural fix (not just "delete the lines"):**
1. **Declare `--ts-footer-bg`** as a Tier-3 component token in the footer's LAYER-1 block. It can reference `--ts-this-bg-dim-4` or whatever derivative is appropriate.
2. **Set `--ts-this-bg` on `.ts-footer` itself** at the Tier-3 layer, instead of overriding the primitive.
3. **For the light-theme variant** (L662 `--ts-bg-2: #ffffff14`): use `[data-theme="light"] .ts-footer { --ts-this-bg: var(--ts-bg-2); }` to RE-ANCHOR the surface, NOT to redeclare the primitive.

**Refusal pattern R-rule-15 trigger.** Both lines halt-worthy.

### ~155 `--ts-bg-N` direct primitive refs — tier-violation audit by component family

| Family | Violation Pattern | Architectural Fix |
|---|---|---|
| inputs-global | `--ts-input-bg: var(--ts-bg-2)` at modal-input scope (L335) | Set `--ts-this-bg: var(--ts-bg-2)` on the wrapper, consume `--ts-this-bg-dim-N` for the input |
| ts-checkbox-radio | Direct `--ts-bg-N` in box decoration | Route through `--ts-this-bg` |
| footer | Worst (see above) — both primitive references AND primitive REDEFINITION | Per-theme `--ts-this-bg` anchoring |
| ts-card-flip | `linear-gradient(180deg, var(--ts-bg-2), var(--ts-bg-1))` at L33–35 | Route the gradient through `--ts-this-bg-grad`, OR declare a Tier-3 `--ts-card-gradient` |
| ts-ui-ide-view | View-private cartel L31–33 aliases `--ts-bg-0/1/2` | Make the view-private cartel CONSUME `--ts-this-bg-*` derivatives instead |

**Group verdict:** all 155 violations are mechanically fixable by the same routing rule.

### 4 `oklch(from)` violations — RULING 7 + Wave 1.6 Resolution #1

`oklch(from)` patterns found:
- `root-tokens-blocks-reference.css` — extensive accent ramp, status ramps (`--ts-accent-50..900`, `--ts-success-*`, etc.) all using `oklch(from var(--ts-accent) calc(l * 0.88) c h)` etc.
- `views/ts-oce-panel-banner-generator-styles.css` L627 + L6551 — `oklch(from var(--ts-accent) clamp(0, (0.75 - l) * 999, 1) 0 0)` for `--ts-on-accent`.
- `root-tokens-blocks-reference.css` L867 — same `--ts-on-accent` formula.
- `root-tokens-blocks-reference.css` L963 — `--ts-on-surface: oklch(from var(--ts-this-bg) clamp(0.05, ...) 0 0)`.

**Architectural verdict per RULING 7:**

The rebuild rule (per `colors.css` L15 comment + RULING 4) is: **`--ts-on-accent` is the ONE exception** where CSS-native `oklch(from ...)` is allowed at runtime, because it must respond to a consumer's accent change without recompiling the build artefact. **Already implemented this way in rebuild colors.css L15–18 with a dual-emitted `#ffffff` fallback.**

For the OTHER `oklch(from)` patterns:

- **The accent/status ramps:** these should be **engine-baked at build time** (apcach generates the full ramp; per RULING 7, the engine decides "how much"). Runtime `oklch(from)` ramping is a fallback / live-preview pattern, but for production canon, the ramps are bake outputs.
- **`--ts-on-surface`:** Pattern 4 / Wave 1.6 candidate. Because `--ts-this-bg` IS dynamic (re-anchored per component), `--ts-on-surface` must use runtime `oklch(from var(--ts-this-bg) ...)` — there's no other way to auto-contrast against a value the engine doesn't know at build time. **`oklch(from)` is the correct architectural expression here**, with a sRGB fallback per R-D3-dual-emit. Parallel exception to `--ts-on-accent`.

**Correct architectural expression for each:**
1. **Accent ramps (`--ts-accent-50..900`):** engine-baked at build time. NO runtime `oklch(from)`.
2. **Status ramps (`--ts-success-*`, etc.):** engine-baked at build time. NO runtime `oklch(from)`.
3. **`--ts-on-accent`:** runtime `oklch(from)` — already done correctly in rebuild colors.css. ✓
4. **`--ts-on-surface`:** runtime `oklch(from var(--ts-this-bg) ...)` — needed in rebuild but NOT yet implemented. **GAP.**

### Substring-distribution selector cartel in headermenu L19–29 — Rule 8 / R-cascade

Per the catalog L2255, this is owner-flagged explicitly. Per SKILL.md §13: "The rebuild uses explicit `:is(...)` enumeration of component selectors, designed during block-layer engineering — not substring distribution."

**Architect's rewrite proposal:**

The old pattern: `:root .ts-modal, :root .ts-modal *, [class*="ts-nav"], [class*="ts-nav"] *` declares the entire nav cartel on every descendant of every nav family.

**Rewrite — three options ranked by preference:**

1. **PREFERRED — Component-scoped private tokens (the iconlist/featlist LAYER-1 pattern).** Declare the nav cartel inside `assets/css/next/components/nav.css` scoped to `.ts-nav, .ts-nav *, .ts-topbar, .ts-topbar *`. NO substring matchers; NO universal.
2. **Explicit `:is(...)` enumeration:** `:is(.ts-modal, .ts-overlay, .ts-nav-fixed, .ts-topbar, .ts-mobile-menu)`. R-cascade-compliant.
3. **Last resort — substring matching ONLY for runtime distribution that genuinely cannot be enumerated.**

**Recommendation:** option 1 + option 2 together. Cartel-of-doom DELETED.

### ts-panel + root-debugger duplicate halves

**Architectural verdict:** **SPLIT into two files.** This is a chunk-4b real bug (catalog L2249).

Reasons:
1. **`#ts-debug-root` is a development-only widget.** Separate into `tools/debug/root-debugger.css` (build-time only, not shipped).
2. **`.ts-panel` is a production component.** Owns its own `components/panel.css` LAYER-1 file.
3. **The §6d NEST-REDUCTION SYSTEM** lives in `system/nesting.css`, NOT in either of the above.

Three files, three tiers, zero duplication.

### `@ts-component-consolidate` / `@extracted_for_v1` / `@taxonomy_chips_strip` tag taxonomy

**Architectural verdict: YES, formalise as a system-layer convention.**

This is the rebuild's machine-readable convention layer. Combined with the `@refactor:*` 5-tag system, the `@ts-deps` header convention (S4 build pipeline), and the catalog's `@taxonomy_chips_strip` Rule 9 LOCK marker — these form a coherent **convention layer that the build pipeline can validate machine-readably**.

**Recommendation:** new file `docs/handoffs/_rebuild-tag-conventions-spec.md` + `tools/conventions/lint.mjs` script in the pre-commit hook.

## Architect's RULING 7 compliance summary

**Across all four binding patterns, hand-tuned literals that must become engine-derived:**

| Pattern | Literal | Required engine source |
|---|---|---|
| 1 | `transparent 79%` (input glow) | Glow-mix engine constant |
| 1 | `--ts-fs-xs: 10px` (chip block) | Harmonic ladder anchor |
| 1 | `border-radius: 0` at L160 | `--ts-radius-sharp` token |
| 2 | `45px` fallback in icon-base | `--ts-icon-base` from sizing engine |
| 2 | `color-mix(in srgb, ..., 70%)` accent-bright | apcach `--ts-accent-bright` engine output |
| 2 | `--ts-this-bg-grad-bright-pct: 6%`, `-dark-pct: 7%` | engine outputs (surfaces.css §10 knobs) |
| 2 | `--ts-mix-perc: 10%` (light: 7%) | engine output (already a knob in rebuild surfaces.css §10 L57) |
| 3 | `9.2px` initial-value for `--ts-nest-radius` | Derived from rebuild radius ladder |
| 3 | `24px` initial-value for `--ts-nest-pad` | Derived from rebuild spacing primitives |
| 3 | `--ts-radius-nest-reduction`, `--ts-pd-nest-reduction` values | Engine-derived from nesting cascade math |
| 4 | (none in the idiom itself — RULING 7 compliant) | n/a |

**New engine-derived constants the rebuild needs:**
1. **Accent derivative chain** — `--ts-accent-bright`, `--ts-accent-dim` (multi-step), `--ts-accent-border`, `--ts-accent-glow-bg-2`. Add to apcach output in `tools/color-engine/generate-colors.js` AND emit into `colors.css`.
2. **Text derivative chain** — `--ts-text-primary-dim-2`, `--ts-text-accent`, etc.
3. **Nesting reductions** — `--ts-radius-nest-reduction`, `--ts-pd-nest-reduction`. Derived from the radius/spacing ladder ratios, NOT hand-picked.
4. **Mix percentages for grad-bright/dark** — `--ts-this-bg-grad-bright-pct`, `-dark-pct`. Already knobs in surfaces.css §10, but their VALUES (6%, 14%) must be engine outputs per RULING 7.

**Net RULING 7 work for Session 4 readiness:** apcach-engine extension to derive the accent + text derivative chains. NOT a small task — must be Session 3.x.

## Recommended NEW RULINGS (Architect — surface to owner)

1. **RULING X — Nesting tokens are SYSTEM tier.** `--ts-nest-radius` and `--ts-nest-pad` cross component boundaries. The `@property` registrations + the depth selector cartel + the `--ts-radius-nest-reduction` / `--ts-pd-nest-reduction` knobs live in `assets/css/next/system/nesting.css`, not in any single component file. **Session 3 system-layer addition.**

2. **RULING Y — View-private cartels must consume system derivatives, never primitives.** A view's private surface alias cartel may only reference `--ts-this-bg-*` family derivatives — NEVER `--ts-bg-N` primitives directly. Add to refusal-pattern catalogue as **R-view-primitive**.

3. **RULING Z — `oklch(from)` runtime usage is restricted to TWO tokens.** `--ts-on-accent` and `--ts-on-surface` MAY use runtime `oklch(from ...)` for auto-contrast against dynamic inputs. All other ramp tokens (accent-50..900, status ramps) MUST be engine-baked at build time. Pre-commit lint flags new `oklch(from)` outside these two.

4. **RULING AA — Pattern 1 / 2 / 4 productionisation is gated on system-layer additions.** Specifically:
   - `system/surfaces.css` extension to add `--ts-this-bg-dim-5/-6`, `--ts-this-bg-grad-2/-3/-4`.
   - New `system/text.css` exposing `--ts-text-primary-dim-2` and a derivative chain.
   - apcach engine extension for accent derivatives (`--ts-accent-bright`, `-dim`, `-border`, `-glow-*`).
   - New `system/nesting.css` per RULING X above.
   - New `components/inputs.css` LAYER-1 file declaring the `--ts-input-*` cartel defaults.

   **Session 4 block work cannot begin without these. Session 3 must close on a system-layer extension pass first.**

5. **RULING BB — Convention layer formalisation.** Adopt the catalog's tag taxonomy as a machine-validatable convention layer. Lives in `docs/handoffs/_rebuild-tag-conventions-spec.md`; enforced by a `tools/conventions/lint.mjs` pre-commit hook.

**Architect's bottom line:** the four binding patterns are architecturally sound — they DO conform to the three-tier model when implemented against a complete system layer. **The current rebuild system layer is INCOMPLETE.** Pattern 4's mechanism (the two-line re-anchor idiom) IS supported by the current `surfaces.css` and does NOT gate Session 3 close. **However, Patterns 1, 2, 3, and 4 ALL require system-layer additions (derivative extensions + accent engine + text derivatives + nesting.css) before Session 4 can begin block work.** Session 3 must close on a system-layer extension pass — not on rule analysis alone.

---

# PRAGMATIST

## Mandatory reading completed

Read in full: `toolskin-architecture/SKILL.md` (215 lines), `design-tokens-2.0/SKILL.md` (577 lines), `toolskin-visual-audit/SKILL.md` (337 lines), `assets/css/next/system/surfaces.css` (131 lines, current Session 3 state), `assets/css/next/primitives/colors.css` (313 lines, generator-emitted dual-emission). Sliced `_extracted-blocks-catalog.md` (2,882 lines) at the four pattern sections, the 4b cross-cut synthesis, and the 5a IDE-view chunk. Sliced `_code-audit-catalog.md` at §7 discrepancies. Sampled three reference CSS files directly (`inputs-global-nested-design-pattern.css` L1–160, `ts-panel+root-debugger-component.css` L1–100 for nest-reduction, `ts-ui-ide-view-fullview.css` L1–100 for view-private cartel).

**Disk-vs-handoff truth check (Rule 11 / Pattern 18):** disk reality confirms — surfaces.css is the two-block (`:root` inputs + `:where(:root, :root *)` derivatives) corrected version from the recent ruling commits (`a0ea9e4`, `95c1b5f`, `ec357b7`). Hue-locked `--ts-tone-*` anchors are present. Border knobs are tuned to 20/40/34/10. The chain currently exposes ~22 derivative tokens. **Several derivative tokens consumed by the canonical reference files are NOT in surfaces.css** — this is load-bearing for the gate question below.

## PRIMARY — Session 4 implementation requirements per pattern

### Pattern 1 — `inputs-global-nested-design-pattern.css` L1–97 (the 4-layer nested design pattern)

**What it actually encodes** (verified L100–150 of source): a 4-step protocol — (a) declare private `--_input-*` aliases prefixed with underscore as the "intent layer"; (b) map them to public `--ts-input-*` tokens; (c) the input root sets `--ts-this-bg: var(--ts-input-bg)` so the surface chain RE-ANCHORS inside the input; (d) child rules consume the public `--ts-input-*` tokens AND the now-re-anchored `--ts-this-bg-*` derivatives. Variants override the public tokens only; never the privates, never the derivatives.

- **Spec required:** A new doc `docs/handoffs/_rebuild-nested-design-pattern-spec.md` (3–4 pages) that lifts L1–97 verbatim as the master reference + adds the 4-layer protocol diagram (private → public → re-anchor → derivative consumption), the naming convention (`--_x-*` private vs `--ts-{component}-*` public vs `--ts-this-bg-*` system), the forbidden patterns (variant rules touching `--_` privates), the **Component token registry rule** (every component spec MUST declare a `--ts-{component}-bg` public token; `--ts-this-bg: var(--ts-{component}-bg)` is mandatory on the component root).
- **First consumer block:** `ts-input` (atomic, PERMISSIVE). Smallest possible test case — single element, single surface, single re-anchor. Validates the protocol end-to-end without molecular complexity. Builds on existing surfaces.css with zero new derivatives.
- **Parity rig acceptance criterion:**
  - Visual: text input in default / hover / focus / filled / disabled states matches the reference iframe within 1 px screenshot diff per Wave 1.6 protocol
  - Computed-style probe: `getComputedStyle('.ts-input').getPropertyValue('--ts-this-bg')` resolves to the value of `--ts-input-bg` (NOT `--ts-bg-1` directly) — proves the re-anchor cascade fires
  - Probe 2: `getComputedStyle('.ts-input .ts-input-icon')` for `color` resolves through the cascade — proves descendants compute against the re-anchored chain
  - Token-leak grep: `rg 'var\(--ts-bg-[0-9]\)' sandbox/ts-input.html assets/css/next/components/input.css` returns ZERO live
- **Time estimate:** spec write 2 hrs · first-consumer block (sandbox + CSS + parity rig) 4 hrs · total **6 hrs**
- **Blocking for Session 4 start?** **NO** — the pattern is fully consumable by existing surfaces.css. Adding the spec doc + ts-input block is itself the Session 4 opening move.

### Pattern 2 — `iconlist+featlist-allvariants-component.css` L1–39 (LAYER-1 / LAYER-2 component architecture)

**What it actually encodes:** the explicit LAYER 1 (token declaration block scoped to `:root .ts-list, :root .ts-list *, …`) / LAYER 2 (element rules consume only) split, with sub-systems: clamp-based icon engine (one base × one multiplier × hard min/max), derivative-spacing chain (`--ts-feat-pad-base → -icon-pad → -icon-gap → -item-pad → -item-gap`), auto-fit grid w/ NO media queries (intrinsic responsive), surface routing through `--ts-this-bg` derivatives, ONE color for text + ONE color for icons.

- **Spec required:** Same `_rebuild-nested-design-pattern-spec.md` doc — Pattern 2 is the **molecular-tier expression** of Pattern 1's atomic-tier protocol. The spec must enumerate the "single-base lever rescales everything" principle, the auto-fit grid rule (`grid-template-columns: repeat(auto-fit, minmax(var(--ts-{component}-col-min), 1fr))` — no `@media`), the variant override rule, the "list root scopes its private tokens" pattern via `:root .ts-{component}, :root .ts-{component} *` — flagged as the SOFTER alternative to wildcard substring (NEEDING future `:is(...)` rewrite per Rule 8), and the `--ts-{component}-pad-base` → 4-derivative chain template.
- **First consumer block:** `ts-feat-list` (molecular, STRICT). ts-feat-list is the smaller of the two specimens (icon-list is just the `<ul>` variant of the same engine). It exercises the entire LAYER-1/LAYER-2 architecture, the clamp-icon engine, the derivative-spacing chain, AND the auto-fit grid in one block.
- **Parity rig acceptance criterion:**
  - Visual: feat-list in default / hover / hover-accent / size-sm / size-lg variants matches reference within 1 px diff
  - Computed-style probe: `getComputedStyle('.ts-feat-icon').getPropertyValue('--ts-feat-icon-size')` resolves via the clamp + multiplier chain
  - Probe 2: changing `--ts-feat-pad-base` on the container with devtools propagates to `--ts-feat-icon-pad` AND `--ts-feat-item-gap`
  - Probe 3: `getComputedStyle('.ts-feat-list')` for `grid-template-columns` resolves to a repeat(auto-fit, minmax(…)) value at viewport widths 320 / 768 / 1440
  - Token-leak grep: ZERO `var(--ts-bg-[0-9])` in component CSS
- **Time estimate:** spec write (additive to Pattern 1 spec) 2 hrs · first-consumer block 6 hrs · total **8 hrs**
- **Blocking for Session 4 start?** **NO** — consumable by existing surfaces.css.

> **Pragmatist's specific call-out** on Pattern 2: the reference file at L139–158 declares a CUSTOM `--ts-this-bg-border` recipe (with `--ts-mix-perc: 10%` overriding the system default). **The rebuild's Session 3 surfaces.css already exposes `--ts-mix-perc` as a knob (L57 set to 20%).** Pattern 2's "custom-derivative-recipe" pattern is therefore ALREADY supported — components can scope-override the knob; no new derivative token needed.

### Pattern 3 — `ts-card-flip-swipe-interactive-component.css` §6d nest-reduction system

**What it actually encodes** (verified L48–93 of `ts-panel+root-debugger-component.css` — the §6d block lives in both files but the panel file is canonical):

```
@property --ts-nest-radius { syntax: "<length>"; inherits: true; initial-value: 9.2px; }
@property --ts-nest-pad    { syntax: "<length>"; inherits: true; initial-value: 24px;  }

/* Depth 2 — 1 step of reduction */
.ts-card .ts-card, .ts-card .ts-panel, .ts-panel .ts-card, .ts-panel .ts-panel { 
   --ts-nest-radius: calc(var(--ts-card-radius) - (1 * var(--ts-radius-nest-reduction)));
   --ts-nest-pad:    calc(var(--ts-card-pad,   var(--ts-panel-pad)) - (1 * var(--ts-pd-nest-reduction)));
}

/* Depth 3 — 2 steps of reduction */
.ts-card .ts-card .ts-card, … { 
   --ts-nest-radius: calc(var(--ts-card-radius) - (2 * var(--ts-radius-nest-reduction)));
   --ts-nest-pad:    calc(var(--ts-card-pad,   var(--ts-panel-pad)) - (2 * var(--ts-pd-nest-reduction)));
}
```

The mechanism: depth-explicit selector enumeration referencing the ROOT canonical token and multiplying the step by depth. CSS custom properties cannot self-reference in calc(), so a depth-aware "reduction" requires explicit `.X .X` / `.X .X .X` selector enumeration.

- **Spec required:** A separate small doc `docs/handoffs/_rebuild-nest-reduction-spec.md` (1–2 pages) — pattern is novel enough to deserve its own ruling. Must enumerate the two control knobs at `:root` (`--ts-radius-nest-reduction` suggest 2px and `--ts-pd-nest-reduction` suggest `var(--ts-sp-1)` = 4px), the `@property` registration block, the depth-2 + depth-3 enumeration selectors (depth 4+ explicitly out of scope), the "consume `var(--ts-nest-radius, var(--ts-X-radius))` in container rules" pattern. **Critically:** independent of surfaces.css and only fires when a card-like container nests inside another. **Pattern 3 is needed alongside the card block, not before it.**
- **First consumer block:** Not a standalone block — the spec lands WITH the first nestable-container block. Recommended pairing: `ts-card` (molecular, STRICT) is the canonical first consumer. Adding `ts-panel` later re-validates the cross-component selector matrix.
- **Parity rig acceptance criterion:**
  - Visual: 3-level nested card sandbox (outer card 16px radius, mid card 14px, inner card 12px when step=2px) matches reference visually
  - Computed-style probe: `getComputedStyle('.ts-card .ts-card').getPropertyValue('--ts-nest-radius')` resolves to `calc(...)` evaluating to canonical − 1×step
  - Probe 2: changing `--ts-radius-nest-reduction` from 2px to 4px at `:root` cascades to all nested cards
  - Specifically test the `@property` initial-value safety net
- **Time estimate:** spec write 2 hrs · added to ts-card sandbox block (incremental) 3 hrs · total **5 hrs**, all falls inside the ts-card block budget
- **Blocking for Session 4 start?** **NO** — Pattern 3 is needed for the FIRST nestable-container block (ts-card), not before. Pattern 3 spec can land WITH the ts-card spec, not as a prerequisite to Session 4 opening.

### Pattern 4 — `ts-ui-ide-view-fullview.css` two-line re-anchoring idiom

**What it actually encodes** (verified L67–68, L138–139, L171–173 of source):

```css
.ts-titlebar {
   background-color: var(--ts-ui-ide-bg);     /* line 1: paint from view-private alias */
   --ts-this-bg:    var(--ts-ui-ide-surface-2); /* line 2: re-anchor surface chain to private surface */
   ...
}
```

The view-tier file declares a 3-tier private surface palette (`--ts-ui-ide-surface-1/-2/-3`) at the view root via `:root:has(.ts-ide-demo) *` distribution, then at EVERY component boundary inside the view (16 components, 22 total re-anchors) it paints from the view-private alias AND re-anchors `--ts-this-bg` to one of the three private surfaces. Children compute borders / dim-fills / hover states against the new anchor, not the page floor.

A SECONDARY idiom in the same file: text-color re-anchor via `--ts-ui-text-color` — same two-line pattern, applied to text rather than background. 27 occurrences. State subclasses (`.git`, `.err`, `.warn`, `.ok`) flip the alias to a semantic token; cascade does the rest.

- **Spec required:** A new doc `docs/handoffs/_rebuild-view-tier-spec.md` (2–3 pages). The component-tier spec (Pattern 1) and the view-tier spec are DIFFERENT contracts. Must enumerate:
  - View-tier declares a private 3-tier surface alias palette `--ts-{view}-surface-1/-2/-3`
  - View-tier private aliases MUST resolve through `--ts-this-bg-dim-N` derivatives, NOT `--ts-bg-N` primitives directly (the legacy file violates this at L31–33; the rebuild fixes it on day one)
  - At every component boundary inside the view, the two-line idiom: `background: var(--ts-{view}-bg); --ts-this-bg: var(--ts-{view}-surface-N);`
  - The text-color secondary idiom: `color: var(--ts-{view}-text-color); --ts-{view}-text-color: var(--ts-text-{token});`
  - **Critical refusal:** view-tier files MAY NOT re-declare `--ts-accent-h/s/l` or any color primitive
- **First consumer block:** Pattern 4 has TWO possible first consumers depending on scope:
  - **If "view" = full page chrome**: the first view-tier block is months away (Session 6+); no Session 4 block consumes Pattern 4 directly.
  - **If "view" = any layout block that nests surfaces** (modal, card, panel, sidebar): then `ts-card` (already first consumer of Pattern 3) is also Pattern 4's first consumer. The two-line idiom IS the surface re-anchor pattern — every layout block that hosts inner content uses it.
  - **Pragmatist's call:** Session 4 standardizes the two-line idiom at the ATOMIC level (already covered by Pattern 1's `ts-input` setting `--ts-this-bg: var(--ts-input-bg)`). The VIEW-TIER spec defers to Session 6+.
- **Parity rig acceptance criterion:**
  - (Atomic application — already covered by Pattern 1's ts-input)
  - (View-tier application — Session 6+ deliverable)
- **Time estimate:** spec write 2 hrs (defer to Session 5+ between blocks) · first true view consumer 12+ hrs (Session 6+)
- **Blocking for Session 4 start?** **NO** at view-tier level. The atomic + molecular surface re-anchor (which is what Pattern 4 fundamentally IS) is already covered by Patterns 1 + 2.

## CRITICAL GATE QUESTION

**Does Pattern 4 (ts-ui-ide-view two-line idiom) require an addition to `surfaces.css` BEFORE Session 3 closes?**

# NO.

**Reasoning, traced against current surfaces.css (verified by re-read + grep):**

The two-line re-anchoring idiom is `background: <alias>; --ts-this-bg: <new-anchor>`. The CSS mechanism it depends on is:
1. A component can set `--ts-this-bg` on itself.
2. The `:where(:root, :root *)` derivative block in surfaces.css re-resolves the entire `--ts-this-bg-*` chain against the new anchor per-element.
3. Descendants inherit normally.

**Verified disk reality:**
- `surfaces.css` L75 declares `--ts-this-bg: var(--ts-bg-1)` at plain `:root` (inheritable input).
- `surfaces.css` L79–131 declares all derivatives in `:where(:root, :root *)` so they re-resolve per element.
- The MECHANISM Pattern 4 depends on is **fully present and operational.**

What Pattern 4's _view-tier_ formalization would ADD is not a surface derivative — it's a **methodology + naming convention** for how a view file should structure its private alias palette. That is a SPEC deliverable (an md doc), not a surfaces.css addition.

**However** — a related, REAL gap exists that the catalog surfaced:

> **The IDE-view file consumes `--ts-this-bg-dim-5` (L739) and `--ts-this-bg-dim-6` (L171, L747).** Current surfaces.css only emits `--ts-this-bg-dim`, `-dim-2`, `-dim-3`, `-dim-4`. Same applies to `--ts-this-bg-bright-2`, `-bright-3` (mentioned in design-tokens-2.0 derivative chain L335–342) and `--ts-this-bg-grad-2`, `-grad-3` (consumed by Pattern 2 — iconlist L113 `var(--ts-this-bg-grad-2)`), and `--ts-this-bg-muted` (design-tokens-2.0 SKILL L340).

**These are real consumer-side gaps but they DON'T block Session 4 opening.** The first Session 4 block (`ts-input` — atomic, smallest test case) uses only `--ts-this-bg`, `--ts-this-bg-dim`, `--ts-this-bg-dim-3`, `--ts-this-bg-border`, `--ts-this-bg-border-hover`, `--ts-this-bg-focus-outline`, `--ts-this-bg-bright`, `--ts-this-bg-dark` — all PRESENT.

So:
- **Session 3 CAN close.** Surfaces.css is sufficient for the first Session 4 block.
- **Session 4 must catalogue the "missing derivatives" backlog as a known-issue list.** When a future block (e.g. iconlist) consumes `--ts-this-bg-grad-2`, add it then. Don't speculatively pre-build the full chain (YAGNI-aligned).
- **The RECOMMENDED NEW RULING** below codifies this: extend surfaces.css on-demand per first-block-consumer, not pre-emptively.

## SECONDARY → Session 4+ roadmap

| Finding | Session 4 immediate? | Session 5+? | Time estimate | Blocking? |
|---|---|---|---|---|
| footer.css primitive redef (`--ts-bg-1: var(--ts-this-bg-dim-4)` at L831; `--ts-bg-2: #ffffff14` at L662) | NO | YES (Session 7+ when footer block rebuilds) | 6 hrs (footer block) — refactor by deleting the redef and re-anchoring `--ts-this-bg` once on footer root | NO |
| ~155 `--ts-bg-N` direct refs across corpus | NO (per-block during respective rebuilds) | YES (continuous through Sessions 4–10) | ~1 hr per block × 30+ blocks distributed | NO — these are migrated AS each block rebuilds, never as a batch sweep |
| 4 `oklch(from)` Wave 1.6 violations (OCE-panel L232, L6551, L6588 + banner-generator L627) | NO | YES (Session 8+ when OCE-panel rebuilds) | 2 hrs (engine constant migration) | NO — OCE-panel rebuild is far downstream |
| 11 silent rendering bugs (chunk 4a — typos, malformed calc, invalid clamp) | NO | NO (the rebuild builds FRESH; bugs disappear) | 0 — they exist in the reference only | NO — N/A |
| headermenu substring cartel (R-cascade) | NO | YES (Session 9+ when navbar/topbar rebuilds — ALWAYS STRICT) | 8 hrs minimum | NO |
| ts-card-flip-2 bit-duplicate file | NO | One-line DELETE — Session 4 housekeeping (10 min) | 0.2 hrs | NO |
| ts-panel+root-debugger dup halves | NO | YES (Session 5+ when panel block rebuilds; the rebuild writes ONE clean version) | 0 — solved by re-authoring fresh | NO |
| ts-cube-portfolio must-not-ship-as-is | NO | YES (Session 10+ as a variant on existing components per owner's L17–19 integration plan) | 16+ hrs distributed across 7 sub-features | NO |
| `@ts-component-consolidate` tag taxonomy formalization | NO (Session 4 uses tags as-encountered) | YES (Session 5+ — owner-defined taxonomy doc) | 2 hrs (doc-only) | NO |

**Per-finding clarifications:**
- The 155 `--ts-bg-N` refs are **NOT a batch migration target.** The rebuild approach (Rule 6) is "reference only, rebuild fresh per block." Each rebuilt block emits zero `--ts-bg-N` direct refs by construction. The 155 number is a measure of the OLD repo's debt, not a Session 4 work item.
- The 11 silent bugs likewise — they're features of the reference file; the rebuild simply writes correct CSS from the start.
- Owner-flagged `must-not-ship` items are documented for deferred treatment, not Session 4 work.

## Session 4 block-ordering proposal (first 5 blocks)

Ordered by: (a) dependencies-already-met test (every consumed derivative present in current surfaces.css); (b) smallest viable test case first to validate protocol; (c) atomic → molecular → layout escalation per §6 typology + §15 autonomy tiers.

1. **`ts-input` (Atomic — PERMISSIVE)** — Pattern 1 first consumer. Proves the private-`--_*` → public-`--ts-input-*` → `--ts-this-bg` re-anchor → derivative-consumption protocol. Uses only currently-emitted derivatives. ~6 hrs.
2. **`ts-btn` (Atomic — PERMISSIVE)** — already partially specified in the corpus. Proves the `--ts-{component}-base → all dimensions via calc()` ratio pattern. Uses `--ts-this-bg-grad`, `-hover-grad`, `-active-grad`, `-border-active`, `-focus-outline`, `--ts-on-accent` — ALL present in current surfaces.css + colors.css. ~5 hrs.
3. **`ts-chip` (Atomic — PERMISSIVE)** — the cleanest specimen of token-driven variant routing per the catalog. 4 declarations cascade the entire visual variant. **Caveat: Rule 9 — `@taxonomy_chips_strip` 10 protected values are LOCKED design input.** ~4 hrs.
4. **`ts-feat-list` (Molecular — STRICT)** — Pattern 2 first consumer. Proves the LAYER-1/LAYER-2 architecture, the clamp-icon engine, the derivative-spacing chain, the auto-fit grid. Owner gate before commit. ~8 hrs.
5. **`ts-card` (Molecular — STRICT)** — Pattern 3 first consumer. Proves the §6d nest-reduction system. Also implicitly proves the surface re-anchor at molecular tier (Pattern 4 atomic application). Owner gate. ~10 hrs.

**Total Session 4 budget: ~33 focused-agent hours across 5 blocks.** Realistic for one to two weeks of paced work given owner-gate cadence on STRICT-tier blocks.

**What's deliberately deferred out of Session 4:**
- `ts-panel` — molecular but blocked on Pattern 3 (nest-reduction) being battle-tested in `ts-card` first. Session 5.
- `ts-modal` — layout (ALWAYS STRICT), needs `ts-card` + nest-reduction proven first. Session 5+.
- `ts-checkbox-radio` — atomic but the file is dedupe-target AND has the asymmetric light/dark hex problem — wait for engine to stabilize. Session 5.
- `ts-ui-select` — molecular but the source file is owner-acknowledged-disordered with a 7-step reorg plan; needs its own focused session. Session 6.
- Navigation family — layout tier, ALWAYS STRICT, plus R-cascade rewrite. Session 9+.

## Recommended NEW RULINGS (Pragmatist — surface to owner)

**RULING (proposed)** — *Surface derivatives extend on first-consumer-demand.*
Surfaces.css currently emits ~22 derivative tokens. The catalog identified ~6 more consumed by legacy reference files (`--ts-this-bg-dim-5/-6`, `-bright-2/-3`, `-grad-2/-3`, `-muted`). Pragmatist's call: do NOT pre-emptively add them in Session 3. Add each one in the Session 4+ block where the first rebuild consumer demands it (e.g. `--ts-this-bg-grad-2` lands WITH `ts-feat-list`). Keeps surfaces.css minimal and proven, avoids speculative tokens, ties every derivative addition to a real visual requirement. **The risk: a future block discovers it needs a derivative not yet emitted; mitigation: that's a 1-hour additive change to surfaces.css scoped to the block sandbox where it surfaces.**

**RULING (proposed)** — *Two specs cover the four patterns.*
Patterns 1 + 2 + the atomic application of Pattern 4 are ALL covered by ONE doc: `_rebuild-nested-design-pattern-spec.md`. Pattern 3 deserves its own short doc: `_rebuild-nest-reduction-spec.md`. The full view-tier formalization of Pattern 4 defers to `_rebuild-view-tier-spec.md`, Session 6+.

**RULING (proposed)** — *Session 4 opens with `ts-input` not `ts-btn`.*
ts-btn is the better-documented reference (long master brief, more obvious "first thing to build"), but ts-input is the **smaller test case for Pattern 1** (the most architecturally consequential of the four patterns). Building Pattern 1's protocol on the smaller block reduces the "is the protocol or the block broken?" ambiguity if something goes wrong.

**RULING (proposed)** — *Catalog the legacy debt; do not migrate it.*
The 155 `--ts-bg-N` refs, 11 silent bugs, footer primitive redef, OCE oklch-from violations, headermenu substring cartel — none of these are Session 4 work items. They're characteristics of the read-only reference repo (Rule 6 / Rule 12). Each is fixed by REBUILDING the corresponding block fresh in its session.

**Pragmatist's bottom line:** Session 3 CAN close. Session 4 opens with `ts-input` consuming Pattern 1 protocol. The 4 patterns split across 2 spec docs that land alongside their first-consumer blocks. Surfaces.css extends on-demand. The 155-ref-and-friends backlog is reference-only debt that the rebuild-fresh approach eliminates by construction. First 5 blocks (`ts-input` → `ts-btn` → `ts-chip` → `ts-feat-list` → `ts-card`) = ~33 focused-agent hours, all consumable by the Session 3 surfaces.css output as-is.

---

# META — ORCHESTRATOR SURFACING (Pattern 8 + Pattern 16)

## Convergences across all 4 voices

1. **Pattern 3 attribution correction.** Skeptic + Critic + Architect + Pragmatist all independently corrected the council brief: the §6d nest-reduction DEFINITION lives in `ts-panel+root-debugger-component.css` L25–93, NOT in `ts-card-flip-…`. The card-flip file is the CONSUMER. (Critic + Skeptic add: the pattern is actually distributed across THREE files — primitive knobs in `root-tokens-blocks-reference.css` §1f-nest L413–420, system definition in ts-panel, consumer in ts-card-flip.)
2. **Pattern 3 belongs at the SYSTEM tier, not in a component file.** All 4 voices land here. Architect and Skeptic both propose `assets/css/next/system/nesting.css`.
3. **Pattern 4 gate question: NO.** Pragmatist + Architect both verified surfaces.css current state and concluded the two-line idiom mechanism is fully supported today. Session 3 does NOT need surfaces.css addition for Pattern 4 mechanism.
4. **`footer.css L662 + L831` is a CATASTROPHIC architectural inversion** (all 4 voices). Critic + Skeptic + Architect all describe it as "must be REBUILT, not refactored." Skeptic additionally finds 2 OCE files + ts-cube-portfolio share the same inversion pattern.
5. **The 4 `oklch(from)` hits are recoverable via engine-baked constants.** All 4 voices agree these are not pixel threats but architectural time-bombs. Architect adds: `--ts-on-surface` (not yet implemented in rebuild) is a legitimate runtime `oklch(from)` exception parallel to `--ts-on-accent`.
6. **The owner's `@property` failed-self-reference explainer (ts-panel L25–46) is LOAD-BEARING WISDOM.** Critic + Skeptic both insist it must be preserved verbatim in the rebuild — discarding it costs hours when re-derived.
7. **Pattern 1 + Pattern 2 L1–N "binding patterns" are PROSE.** Critic + Skeptic both note this. Critic strict: drop the prose, preserve the code. Skeptic: prose is the founding artifact of three-tier methodology, treat as origin-point lore.
8. **155 `--ts-bg-N` direct refs are not a Session 4 batch-migration item.** Pragmatist + Critic + Architect all converge — rebuild fresh per block eliminates them by construction. Skeptic adds per-component priority ranking for the rebuild order.
9. **Pattern 2's `--ts-mix-perc: 10%/7%` hand-tuned override at L139/154/158 is a RULING 7 VIOLATION.** Critic + Architect both flag this independently. Critic invokes Pattern 16 HALT before adopting iconlist+featlist as canonical.

## Substantive disagreements requiring owner pick (Pattern 8 — orchestrator does NOT auto-resolve)

### DISAGREEMENT 1 — Session 4 readiness (THE BIG ONE)

| Voice | Position | Reasoning |
|---|---|---|
| **Pragmatist** | Session 3 CAN close. Session 4 opens with `ts-input` NOW. | First block consumes only currently-emitted derivatives. Extend surfaces.css on-demand per first-block-consumer. |
| **Architect** | Session 3 must NOT close. Session 4 block work CANNOT begin until system layer is extended. | Patterns 1/2/3/4 ALL require additions: `surfaces.css` extension (`-dim-5/6`, `-grad-2/3/4`), new `system/accent.css` (apcach-derived accent derivatives), new `system/text.css` (`--ts-text-primary-dim-2`), new `system/nesting.css`, new `components/inputs.css` LAYER-1. Session 3.x pass required. |
| **Skeptic** | Implicit alignment with Architect (RULING B + C are system-layer additions). |
| **Critic** | Doesn't directly answer, but Pattern 2 RULING 7 violation triggers Pattern 16 HALT before adopting iconlist canonical — implicit alignment with Architect. |

**The owner pick:** Two strategic paths.
- **Path A (Pragmatist):** Session 3 closes now. Session 4 opens with `ts-input`. Surfaces.css extends on-demand per first-block-consumer (1-hour additive changes scoped to the block sandbox). Risk: each block surfaces "missing derivative, ~1h work" mid-block.
- **Path B (Architect/Skeptic/Critic):** Session 3.x system-layer extension pass first. Build `accent.css`, `text.css`, `nesting.css` engine-derived; extend `surfaces.css` `-dim-5/6` + `-grad-2/3/4`. THEN Session 4 opens. Risk: speculative derivatives ahead of real consumers; longer Session 3.

### DISAGREEMENT 2 — Pattern 4 two-line idiom CANONICAL ORDER

| Voice | Position | Reasoning |
|---|---|---|
| **Critic** | The reverse-order variant on `.ts-rail-btn` L171–173 (`background` BEFORE `--ts-this-bg`) is INTENTIONAL/load-bearing. "The cascade re-evaluates and the background paints from the new surface." Sub-agents normalizing the order silently breaks rendering. |
| **Skeptic** | CSS recomputes at use-time, so order works either way. Convention should be re-anchor FIRST (line 1), consume SECOND (line 2) because reading top-to-bottom matches mental model. Rebuild spec should mandate this order. |

**The owner pick:** which convention does the rebuild spec encode? (Note: this is also a CSS factual question — custom properties resolve at use-time per element; within a single rule the order doesn't affect the final computed value because `--ts-this-bg` always resolves at the element it's declared on. Critic's "cascade re-evaluates" theory may be wrong, but the SPEC question stands.)

### DISAGREEMENT 3 — Pattern 2 (iconlist L1–39) adoption status

| Voice | Position | Reasoning |
|---|---|---|
| **Skeptic** | Pattern 2 CODE = canonical template for ALL Session 4+ molecular components. Encode as **R-template refusal pattern** (file without 5-subsystem brief is rejected at pre-commit). |
| **Critic** | Pattern 2 PROSE = duplicates design-tokens-2.0; promote prose into skill, drop from component. Pattern 2 CODE = canonical template BUT its hand-tuned `--ts-mix-perc: 10%/7%` at L139/154/158 is a RULING 7 violation → **Pattern 16 HALT before adopting as canonical**. |
| **Architect** | Pattern 2 conforms to three-tier model. Knob mechanism survives; OLD formula (srgb mix) does NOT carry forward — REBUILD WINS. Engineering fix, not HALT. |
| **Pragmatist** | Pattern 2 first consumer is `ts-feat-list` (block #4 in proposed Session 4 order). Custom recipe already supported by surfaces.css L57's `--ts-mix-perc` knob — no new derivative needed. |

**The owner pick:** procedural posture on Pattern 2 — (a) adopt as canonical template + R-template refusal (Skeptic), (b) Pattern 16 HALT before adoption pending RULING 7 fix (Critic), or (c) adopt with engineering fix (carry knob, drop formula) (Architect + Pragmatist alignment).

### DISAGREEMENT 4 — Surface-derivative gaps: pre-emptive vs on-demand

| Voice | Position |
|---|---|
| **Pragmatist** | NEW RULING — surface derivatives extend on first-consumer-demand. Each derivative addition is a 1-hour additive change tied to a real visual requirement. YAGNI. |
| **Architect** | Pre-emptive system-layer extension pass (RULING AA) — Session 3.x adds all missing derivatives + new system files before Session 4 begins. |

**The owner pick:** procedural posture on derivative additions — strict on-demand vs pre-emptive.

## New RULINGs proposed across the 4 voices (deduplicated, surfaced for owner pick)

Across all 4 voices, **~15 distinct new RULINGs** are proposed. None are self-approved. All await owner pick.

**System architecture:**
- **Nesting tokens are SYSTEM tier** (`system/nesting.css`) — Skeptic C + Architect X (CONVERGENT)
- **`@property` typed-length registration is a Tier-2 concern** — Architect, Skeptic implicit
- **Pre-commit hook for `--ts-bg-[0-9]` outside primitives (DEFINER-side)** — Skeptic D
- **View-private cartels must consume system derivatives, never primitives** (R-view-primitive) — Architect Y, Critic alignment
- **`oklch(from)` runtime usage restricted to `--ts-on-accent` + `--ts-on-surface`** — Architect Z
- **Pattern 1 / 2 / 4 productionisation gated on system-layer additions** — Architect AA
- **Surface derivatives extend on first-consumer-demand** — Pragmatist (DISAGREES WITH Architect AA)

**Component conventions:**
- **Per-component-file template (5-subsystem brief + LAYER-1/LAYER-2 enforcement)** — Skeptic A (R-template refusal)
- **View-tier composition spec** (R-view-comp refusal) — Skeptic B
- **View-tier vs component-tier `--ts-this-bg` set frequency** — Critic 6 (multiple component-tier sets is R-DNA refusal)
- **Pattern 3 nest-reduction must travel as a unit of three files** — Critic 2 (R-DNA-nest-reduction refusal)
- **Footer L831 primitive redefinition = CATEGORICAL REBUILD, not refactor** — Critic 4
- **ts-cube-portfolio shall NOT be cataloged on same axis as other view files** — Critic 5 (R-cube-portfolio-isolation refusal)

**Engine + build:**
- **Engine-derived `--ts-on-accent` constant per surface context** (e.g. `-isolated-dark`) — Skeptic E
- **Convention layer formalisation** (`_rebuild-tag-conventions-spec.md` + `tools/conventions/lint.mjs` pre-commit) — Architect BB

**Procedural:**
- **Prose vs code distinction in catalog flagging** — Critic 1
- **Catalog over-statement protocol** (is this code or prose?) — Critic 7
- **Catalog the legacy debt; do not migrate it (Rule 6 reaffirmation)** — Pragmatist
- **Two specs cover the four patterns** (`_rebuild-nested-design-pattern-spec.md` + `_rebuild-nest-reduction-spec.md`; view-tier defers to Session 6+) — Pragmatist
- **Session 4 opens with `ts-input` not `ts-btn`** — Pragmatist
- **Canonical reference paths in skills (wire 4 patterns by absolute path)** — Skeptic F

## Pragmatist's proposed Session 4 block order (input for owner)

1. `ts-input` (Atomic / PERMISSIVE) — Pattern 1 first consumer · ~6 hrs
2. `ts-btn` (Atomic / PERMISSIVE) · ~5 hrs
3. `ts-chip` (Atomic / PERMISSIVE) — Rule 9 LOCKED · ~4 hrs
4. `ts-feat-list` (Molecular / STRICT) — Pattern 2 first consumer · ~8 hrs
5. `ts-card` (Molecular / STRICT) — Pattern 3 first consumer · ~10 hrs

**Total: ~33 focused-agent hours**

Deferred to Session 5+: `ts-panel`, `ts-modal`, `ts-checkbox-radio`, `ts-ui-select`, nav family.

## Halt

Per Pattern 16 + Pattern 8: orchestrator does NOT auto-resolve. The 4 disagreements above require owner picks before OBJECTIVE 3 (commit) and OBJECTIVE 4 (Agent A ΔL measurement) can proceed. Council output halted here, raw. Awaiting GO.

# Toolskin Conversation Rules — Verbatim (BINDING)

The 15 binding conversation rules for the Toolskin Rebuild. Rules 1–14 are recovered from the master orchestration brief (`docs/session-1-bootstrap/01-orchestration-brief-v5.md`). Rule 15 is the apcach color authority — its **Extended form** (locked at Gate 5 Resolution #1) supersedes the original short form everywhere.

These rules bind every session, every sub-agent, every commit. They override default agent behavior. They do NOT override explicit owner instructions.

---

## Rule 1 — Toolskin philosophy
> *"Zero framework dependencies. One stylesheet. Full dynamic control."*

## Rule 2 — Token-driven + derivative-math-driven, NOT class-driven like Tailwind
> *"Toolskin is token-driven and derivative-math-driven, not class-driven like Tailwind. Every component follows the `ts-marquee` pattern — zero manual structural markup, everything via data attributes with JS building DOM and CSS styling via tokens."*

## Rule 3 — The ts-marquee pattern is canonical for every component
One-liner setup. Data attributes. JS builds DOM. CSS styles via tokens. Zero manual structural markup. Optional behaviors are opt-in via `data-*` attributes + tokens — **never** class modifiers (`.ts-component--variant`).

## Rule 4 — Surface superposition awareness is core, not patch-work
> *"This kind of rules must be consciously planned and designed to be automatically applied like on the light or dark theme modes, but to be surface superposition aware too... so we get a solid design system that cannot fail on its core logic."*

## Rule 5 — The product differentiator
> *"This must be something that literally you give to anybody, AI or WordPress, and instantly adapts and merges to any convention because the tokens makes that possible by the solidness and how is built. If we make this properly, the CSS or JS + Sass or CSS will certainly convert any interface at will to any design type easily, with just design patterns and UI application — just knowing where to adapt to."*
>
> *"The element that makes this product something that actually people may use and don't trash and run to Vercel or Replit or Wix."*

## Rule 6 — Old toolskin.css is BLOCK PROTOTYPE — reference only
Visual and functional source-of-truth REFERENCE in the old repo. Read constantly, modified never. Design essence correct, code not production-grade.

## Rule 7 — Block-by-block sandbox with reusable HTML base context
> *"Module by module, new file to test-drive each one. Same HTML base context reusable. Everything that is not the CSS and assets type must be efficiently reusable."*

ONE `sandbox/_base.html` shared across every block.

## Rule 8 — Cascade-sensitivity rule (May 17 discovery)
`:root [class*="ts-tree"]` is a SCOPED DISTRIBUTION LAYER. Cascade is partially explicit. The rebuild uses explicit `:is(...)` enumeration where appropriate, designed during block-layer-type engineering.

## Rule 9 — @taxonomy_chips_strip 10 protected values are LOCKED design input
The chips strip docstring in the OLD repo's toolskin.css encodes 10 owner-locked values. The rebuilt chips block must reproduce these visually — they are the design contract.

## Rule 10 — Owner manual changes are AUTHORITATIVE
Between agent sessions, owner edits stand. Agents do not "fix" or revert without explicit direction.

## Rule 11 — Halt on anomaly, never improvise
Cost of stopping is minutes. Cost of improvising is months.

## Rule 12 — NEW REPO ONLY ⭐
After Session 1 lands, all rebuild work happens in `toolskin-rebuild/`. The old `toolskin-showcase/` is read-only reference. No edits, no commits, no PRs against the old repo. Sub-agents that propose writes to old repo paths get rejected at synthesis.

## Rule 13 — NO NODE.JS RUNTIME DEPS IN SHIPPED PRODUCT ⭐
Apcach lives in `tools/color-engine/` as build-time tooling. The shipped artifact is pure CSS + minimal JS. No webpack, no Vite, no PostCSS runtime, no npm scripts the end consumer needs to run. Eventual ship = one CSS file + one JS file + wrapping library, drop-in for any context.

## Rule 14 — Fresh git history ⭐
The new repo's first commit IS the Session 1 baseline. No imported history from old repo. Clean room.

---

## Rule 15 — Smart Color System (apcach) is the color authority — EXTENDED FORM (BINDING)

The original Rule 15 short form said: "apcach is the supreme color authority." The **Extended form** below was locked at Gate 5 Resolution #1 and supersedes the short form everywhere.

> apcach (antiflasher/apcach, MIT, Evil Martians) is the supreme color authority for the ENTIRE color derivation chain — including primitives, mixing constants, surface contrast adjustments, OKLCH inversions, nested alternative surface awareness, accent/on-accent/on-surface auto-derivation, and theme inversion (dark ↔ light).
>
> NO color value, mixing percentage, contrast adjustment, or surface-aware derivative may be hand-tuned per-theme. The smart color system + surface contrast auto-system + auto-nested alternative surface system are the FOUNDATIONAL constraints — drawn from prior Toolskin work + Surface Labs initial structure — now consolidated and adapted to apcach as the unified engine.
>
> Tokens drive ONLY design decisions (which color to use). The engine handles amount/percentage decisions (how much of what). No spec may invert this — any spec that puts amount-decisions in tokens or design-decisions in the engine is REJECTED.
>
> Surface Labs presets define handpicked default color sets as the BASE TINTS the engine derives from. Consumer can "bend the contrast ratio and the palettes from the base tints" — that bending is engine-mediated, never via hand-tuned override constants.
>
> Theme inversion (dark → light or light → dark) re-runs the same engine math with inverted lightness primitives. No separate hand-tuned theme tables. No per-theme mixing constants. No theme-specific derivative overrides.

### Rule 15 — operational layers (from the original short-form spec, still in force)

apcach runs at TWO layers:
1. **BUILD-TIME** (`tools/color-engine/`) — generates the canonical primitive OKLCH values for `--ts-bg-*`, `--ts-accent-*`, `--ts-this-*` token families with verified APCA contrast at every step. Output baked into `assets/css/next/primitives/colors.css` as static OKLCH custom properties (with paired sRGB fallbacks per Gate 5 Resolution #2).
2. **OPTIONAL RUNTIME** (`toolskin.js`) — when a consumer selects a new accent hue at runtime (theme customizer, white-label, AI-generated palette), `toolskin.js` calls a bundled apcach subset to recompute the derivative chain preserving contrast contracts. This is the opt-in Path A bundle (Gate 5 D2 Hybrid).

Binding: every color rule in `assets/css/next/**/*.css` derives from apcach output OR consumes the derivative system that derives from it. NEVER manual hex, NEVER generic palette guidance, NEVER external-skill color proposals. Any external skill (ECC, designer-skills) that proposes color values is OVERRIDDEN by apcach — document the override, proceed with apcach.

# What This Refactor Is Buying — Old vs New
# Honest summary. No marketing. Reads in 2 minutes.
# Source: the actual old toolskin-showcase repo doc + the new toolskin-rebuild state.

═══════════════════════════════════════════════════════
THE DELIVERABLE GOAL (what "done" actually means)
═══════════════════════════════════════════════════════
An equivalent of the old toolskin showcase + assets — visually parallel,
functionally complete — but built on the rebuild's layered architecture,
with cleaned JS, and with a NEW capability the old one never had: agents
generating new pages by recipe. Same coverage, better foundation, plus the
page-generation system on top.

═══════════════════════════════════════════════════════
SIDE-BY-SIDE: WHAT CHANGES
═══════════════════════════════════════════════════════

┌─────────────────────┬────────────────────────────┬────────────────────────────┐
│ CONCERN             │ OLD (toolskin-showcase)    │ NEW (toolskin-rebuild)     │
├─────────────────────┼────────────────────────────┼────────────────────────────┤
│ Stylesheet shape    │ One 8,500-line toolskin.css│ Layered: primitives/system/│
│                     │ everything in one file     │ components/utilities/      │
├─────────────────────┼────────────────────────────┼────────────────────────────┤
│ Color space         │ HSL accent +               │ OKLCH base, oklab for      │
│                     │ color-mix(in srgb,...)     │ state mixes (no purple)    │
├─────────────────────┼────────────────────────────┼────────────────────────────┤
│ Token naming        │ Mixed conventions          │ One vocabulary             │
│                     │ --ts-font-weight-* AND     │ --ts-fw-*, --ts-lh-*,      │
│                     │ --ts-fw-*; flat AND density│ flat --ts-sp-N, capped 16  │
├─────────────────────┼────────────────────────────┼────────────────────────────┤
│ Token tiers         │ Implicit, mixed in :root   │ Three explicit tiers       │
│                     │                            │ primitives → system →      │
│                     │                            │ components, no leaks       │
├─────────────────────┼────────────────────────────┼────────────────────────────┤
│ Component CSS       │ Scattered                  │ Nested (CSS-1)             │
│                     │ .hero .btn { ... }         │ All states/variants/       │
│                     │ .hero .btn:hover { ... }   │ children INSIDE the block, │
│                     │ .magazine .btn { dup'd }   │ behavior via tokens,       │
│                     │                            │ context via parent only    │
├─────────────────────┼────────────────────────────┼────────────────────────────┤
│ State derivation    │ Hand-tuned per state       │ Engine-derived from one    │
│                     │                            │ --ts-this-bg anchor, full  │
│                     │                            │ state machine for free     │
├─────────────────────┼────────────────────────────┼────────────────────────────┤
│ Theme reskin        │ HSL knobs (works)          │ Same 3-knob promise        │
│                     │                            │ (--ts-accent-h/s/l) on a   │
│                     │                            │ wider, hue-stable engine   │
├─────────────────────┼────────────────────────────┼────────────────────────────┤
│ Gradients           │ Ad-hoc, mixed conventions  │ Token-driven library       │
│                     │ ts-gradient-canvas.js etc. │ (19 gradients, generator), │
│                     │                            │ tint-agnostic              │
├─────────────────────┼────────────────────────────┼────────────────────────────┤
│ JS runtime          │ 20k lines across 11 files  │ Cleaned inherited core +   │
│                     │ everything in toolskin.js  │ optional mini-apps as      │
│                     │                            │ assets, not core           │
├─────────────────────┼────────────────────────────┼────────────────────────────┤
│ Theme-toggle button │ Inherits the theme it      │ Excluded from inheritance  │
│ inherit bug         │ switches (black on black)  │ (generator-baked :not())   │
├─────────────────────┼────────────────────────────┼────────────────────────────┤
│ Backward compat     │ All existing .ts-* classes │ Same classes preserved;    │
│                     │                            │ migration, not redesign    │
├─────────────────────┼────────────────────────────┼────────────────────────────┤
│ Page authoring      │ Hand-built HTML            │ Starters + tokens + recipe │
│                     │                            │ → agent can generate pages │
│                     │                            │ following the rules        │
└─────────────────────┴────────────────────────────┴────────────────────────────┘

═══════════════════════════════════════════════════════
THE FIVE THINGS YOU ARE ACTUALLY BUYING
═══════════════════════════════════════════════════════

1. ONE SOURCE OF TRUTH PER LAYER
   Old: 8,500-line monolith. To fix a button state you grep through tokens,
   layout, surfaces, components, utilities and dark-mode overrides all in
   the same file. Find it, hope nothing else depends on the exact line.
   New: change a primitive, the system layer recomputes, the component
   layer inherits. You touch one file, in one tier, with named purpose.

2. NO PURPLE, NO HUE DRIFT, NO HUE WRAP
   Old: srgb mixing on state changes occasionally produced muddy or
   magenta-tinted results when the surface had any blue bias.
   New: oklab interpolation on chromatic state mixes — no hue arc to pass
   through magenta. The "warm focus tint" Claude Design delivered is the
   visible proof; the engineering is "states cannot drift hue, ever."

3. ONE BUTTON, EVERY SURFACE — AUTOMATIC
   Old: .hero .btn, .magazine .btn, .toolbar .btn, each duplicated with
   slight differences. Hover/active/focus declared everywhere.
   New: .ts-btn nested block. Drop it on any surface, the engine recomputes
   ink, borders, focus ring, and gradient skins from that surface's anchor.
   No new CSS per context. Same component, every surface, no overrides.

4. AGENTS CAN GENERATE PAGES BY RULE (new capability)
   Old: never existed. You hand-built every page.
   New: 6 starters + the token system + a recipe = an agent reads the
   recipe and produces a new page that passes the design + boring audits,
   in the system's voice, without inventing layouts. That is the unlock
   that turns the system from "stylesheet you use" into "platform that
   produces pages for you." This is the architect work that was never
   scheduled before — it's a real product capability, not a refactor.

5. AGENT-MAINTAINABLE FOUNDATION
   Old: the 20k-line JS runtime + 8.5k CSS monolith required human
   maintenance — too much surface area to hand to an agent safely.
   New: layered files, three tiers, named purposes, lint/audit gates,
   nested component pattern. An agent can change a component without
   accidentally breaking the layout system because the layers are real.
   This is what makes the refactor durable as a working surface, not just
   prettier as a snapshot.

═══════════════════════════════════════════════════════
WHAT YOU ARE NOT LOSING
═══════════════════════════════════════════════════════

- All .ts-* classes are preserved. The migration target on every component
  is the SAME class names, working the SAME way externally. HTML using
  the old system continues to work on the new system.
- The 3-knob theme reskin (--ts-accent-h/s/l) still works, on a wider
  engine.
- The showcase + lab pages get rebuilt to parity. Visual coverage doesn't
  shrink — it stays equivalent, on better bones.
- The mini-apps (banner generator, galleries, offcanvas editor) become
  optional asset modules instead of core, but they remain available.

═══════════════════════════════════════════════════════
THE DELIVERABLE, IN ONE SENTENCE
═══════════════════════════════════════════════════════
A toolskin showcase + assets equivalent to the old one, on the layered
OKLCH engine with the nested component pattern and a cleaned JS core,
PLUS the new agent page-generation capability the old system never had.

═══════════════════════════════════════════════════════
HOW MUCH IS DONE TOWARD IT (HEAD c005e50)
═══════════════════════════════════════════════════════
- Primitives: DONE (colors, typography, spacing, radius, motion)
- Surfaces: DONE (in repo) + ENGINE READY (Claude Design v2 unintegrated)
- Components: ~0% — folder exists, empty. THIS IS THE SPINE TO BUILD.
- Utilities: ~0% — folder exists, empty.
- JS runtime cleanup: 0% — still old 20k-line dump.
- Showcase rebuilt: 0%
- Page generation: 0% (starters exist; no recipe + agent wiring yet)
- Working mode + enforcement: DONE (rules, guard catastrophe-net, phases)

So: the foundation is laid, the engine is sitting in a zip ready to be
placed, the components folder is empty. The spine of the work is the
component migration. Everything else hangs off having real components.

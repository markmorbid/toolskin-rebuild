# TOOLSKIN REBUILD — State of the Project + Forward Plan
# Read from the actual file tree (1,433 entries) + the 20k-line JS runtime.
# No new features. Goal: refactored equivalent of toolskin showcase + assets,
# with unified layout, agent page-generation, and asset-based components.

═══════════════════════════════════════════════════════
PART 1 — WHAT ACTUALLY EXISTS (the honest inventory)
═══════════════════════════════════════════════════════

## The rebuild target is mostly EMPTY — this is the core finding
assets/css/next/ is the rebuild home. Its real state:
  primitives/   colors.css, motion.css, radius.css, spacing.css, typography.css ✓
                (+ owner backups: colors_owner_fixes, colors_REFERENCE-COMMENTED)
  system/       surfaces.css ✓ (+ "surfaces - Copy.css" cruft)
  components/   EMPTY  ← nothing built here yet
  utilities/    EMPTY  ← nothing built here yet

So: primitives exist, surfaces exist, and COMPONENTS + UTILITIES are unbuilt.
The whole component layer of the refactor is a blank folder. That is the
"catalog not properly executed" you sensed — the rebuild never populated
components/. Everything component-shaped still lives in the OLD toolskin.css
(8.5k lines) and the OLD 20k-line JS runtime, un-migrated.

## The engine (Claude Design) — functional, NOT yet in assets/css/next/
Lives in expert-designer/Gradient Engine System.zip + docs/claude-design-files/.
  toolskin-this-bg-v2.css   (surfaces+states, oklab) — belongs in system/
  toolskin-gradients-v3.css (gradient library)       — belongs in system/
  ts-btn_v3.1.css           (button)                 — belongs in components/
These are the SOURCE for filling the empty folders. Not yet integrated.

## The legacy JS runtime — 20k lines, 11 modules, needs cleanup+inheritance
  toolskin.js          8,143  core: theme, accent, surfaces catalog, lenis,
                              locomotive, cursor, preloader, ionicons, init()
  ts-offcanvas-editor  2,911  offcanvas editor
  bannerGenerator      2,027  banner generator mini-app
  mockup-scripts       1,295  mockup behaviors
  toolskin-uikit       1,182  accordion, select, table, draggable, masonry
  showcase             1,089  showcase page behaviors
  phantom-gallery        958
  ts-cube-portfolio      709
  ts-gradient-canvas     654
  ts-gallery             515
  toolskin-assets        463  dynamic CDN preloader (FA pinned v6, lenis, gsap)
This is the "core JS inherited functions cleaned up" work — never scheduled.

## The system/process layer — HEAVY, much of it now deprecated by WORKING-MODE
  .claude/rules/ (7 files) ✓ — the externalized knowledge, KEEP
  .claude/hooks/ (guard, logger, rehydrate) ✓ — guard now catastrophe-only
  .claude/skills/ — 25+ skills incl. expert-designer, council, design-system,
                    design-tokens-2.0, toolskin-architecture, impeccable
  .agents/skills/impeccable/ — DUPLICATE of .claude/skills/impeccable (cruft)
  session5-system-fix/ — the install staging copy, now redundant (installed)
  .remember/ — the OLD memory system (remember.md etc.) — superseded, cleanup
  handoffs/ + decisions/ — council outputs + decision records ✓ KEEP

## Sandboxes — the verification pages
  sandbox/00-design-reference/  index.html (good layout) + cleaned-up copy + recover.css
  sandbox/00-foundation/        colors.html
  sandbox/01-system/            surfaces.html + sandbox-surfaces.css

## Committed state: HEAD c005e50. tokens.css locked. Engine NOT integrated.

═══════════════════════════════════════════════════════
PART 2 — WHAT IS PENDING OR LOOSE (the gaps)
═══════════════════════════════════════════════════════

| # | Pending item | Evidence | Severity |
|---|---|---|---|
| P1 | components/ folder EMPTY — no migrated components | tree | CORE BLOCKER |
| P2 | utilities/ folder EMPTY | tree | CORE |
| P3 | Engine (v2/v3/btn) not in assets/css/next/ | tree | CORE BLOCKER |
| P4 | 20k-line JS runtime un-migrated, uncleaned | wc -l | LARGE |
| P5 | No refactored showcase consuming next/ | tree | CORE GOAL |
| P6 | No layout-generation / agent page-gen system | absent | NEW GOAL |
| P7 | Old toolskin.css (8.5k) still the real source | implied | LARGE |
| P8 | Cruft: surfaces-Copy, .agents dup, session5 copy, .remember | tree | CLEANUP |
| P9 | color system lacks semantic palettes consolidation | decisions/ | MEDIUM |
| P10| font-scaling primitive rewrap (decided, not applied) | font-scaling.md | MEDIUM |

═══════════════════════════════════════════════════════
PART 3 — THE FORWARD PLAN (phased, commit-per-phase)
═══════════════════════════════════════════════════════
Operating mode: 01-WORKING-MODE.md. Phases = commits. Zip before risk.
No flags, no per-step halts. Showcase verifies each phase. No new features.

### PHASE 0 — Open with a COUNCIL on this state (no execution)
Inputs (lean): this STATE-AND-PLAN.md + 01-WORKING-MODE.md + the engine
HANDOFFs + decisions/*. 4 voices answer:
  - Is the next/ layering (primitives→system→components→utilities) the right
    final architecture? Confirm or correct.
  - Migration order: which components first, and from which source (old
    toolskin.css vs the engine files)?
  - The JS runtime: clean-in-place vs extract-inherited-core? Scope it.
  - The agent page-generation goal (P6): what does "agent generates pages
    following rules" actually require — starters + tokens + a recipe?
Output: one ratified build order. No code. → decisions/forward-architecture.md

### PHASE 1 — Engine into the rebuild (fills system/ + first component)
Per 02-INTEGRATION-RECIPE.md: surfaces v2 → system/, gradients v3 → system/,
ts-btn v3.1 → components/. Three sub-commits or one phase commit. Verify via
the three engine showcases. This UNBLOCKS the empty folders.

### PHASE 2 — Component migration (fills components/)
Recipe-driven, one component at a time, OLD toolskin.css → next/components/
on the nested pattern (CSS-1), consuming the engine tokens. Order from the
council. Each component verified in a showcase before the next. Input, card,
chip, badge, toolbar, accordion, table, etc. NO redesign — migrate + tokenize.

### PHASE 3 — JS runtime cleanup + inheritance (the never-scheduled work)
Extract the inherited core from toolskin.js (theme, accent, surfaces, init)
into a clean module set. Decide per-module: keep / clean / drop. The mini-apps
(banner, offcanvas, galleries) become optional asset modules, not core.
Scope ratified by council in Phase 0. This is large — its own multi-commit arc.

### PHASE 4 — Refactored showcase + assets equivalent (THE GOAL)
Rebuild the toolskin showcase on next/ — unified layout, consuming the
migrated components + cleaned JS. This is the "equivalent of toolskin showcase
and assets but refactored" you named. Verified live.

### PHASE 5 — Layout generation + agent page-gen (NEW capability)
The starters (expert-designer/starters/) + tokens + a page-gen recipe =
the agent generating pages following the rules. Asset-based components,
easy to set up, inheriting the cleaned core JS. This is the architect work
that "has probably never been thought" — Phase 0 council scopes it; this
phase builds it.

### PHASE 6 — Cleanup pass (de-cruft)
Remove surfaces-Copy, .agents dup, session5-system-fix copy, retire .remember.
Consolidate color semantic palettes (P9), apply font-scaling rewrap (P10).
Low-risk, high-clarity. Last because it's safest after the core lands.

═══════════════════════════════════════════════════════
PART 4 — THE ONE THING THAT MATTERS MOST
═══════════════════════════════════════════════════════
components/ is empty. That single fact is why the refactor "feels low" — the
engine and primitives exist, but nothing consumes them into real components
yet. Phase 1 (engine in) + Phase 2 (component migration) is the spine.
Everything else (JS cleanup, showcase, page-gen) hangs off having real
components in next/components/. Start there. Council first to ratify the
order, then execute phase by phase, commit at each, verify by showcase.

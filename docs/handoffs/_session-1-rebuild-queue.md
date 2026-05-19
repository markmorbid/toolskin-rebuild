# Session 1 — Rebuild Document Queue

**Purpose:** the canonical source list for Wave 1 (T1-T3) and Wave 2 (S1-S6) sub-agent dispatch. All sub-agents read the binding rules first, then their domain-specific sources, then produce specs into `docs/handoffs/_rebuild-*-spec.md`.

**Paths:** all paths relative to new repo root (`toolskin-rebuild/`). Old-repo reads go through `../toolskin-showcase/` (read-only, frozen reference forever — see "REPO ISOLATION" below).

**Validation status:** every source listed below was verified present and reachable at queue-build time. Line counts captured for budget awareness.

---

## GATE 4 LOCKS (2026-05-19, post-Wave-1 synthesis)

After Wave 1 returned and `_wave-1-synthesis.md` landed, owner approved at Gate 4. The following are LOCKED for Wave 2 sub-agent briefs:

### Architectural shapes (4 decisions)

| ID | Decision | Status |
|---|---|---|
| **D1** | `assets/js/next/` JS folder convention (mirrors `assets/css/next/`) | ✅ LOCKED |
| **D5** | Modal split: `.ts-modal-overlay` (layout, ALWAYS STRICT) + `.ts-modal` (molecular content shell, STRICT) — mirrors `.ts-oce-overlay` + `.ts-oce-panel` pattern | ✅ LOCKED |
| **D6** | Surface-N two-block-spec: `.ts-surface-N` (atomic utility, PERMISSIVE) + `.ts-section.ts-surface-N` (layout composition, ALWAYS STRICT) | ✅ LOCKED |
| **D7** | "Infrastructure" sandbox category separate from the 128 blocks — engines, observers, asset-loader, theme-toggle implementation, modal-lock implementation. Owned by S4 Build Pipeline | ✅ LOCKED |

### Wave 2 dispatch model — OPTION A (sequential then parallel)

| Phase | Sub-agent(s) | Time-box |
|---|---|---|
| Wave 2.1 (sequential, must complete before 2.2) | S1 Color Foundation Architect | 30 min |
| Wave 2.2 (sequential, consumes S1's locked output) | S2 System Layer Architect | 25 min |
| Wave 2.3 (parallel, consumes S1 + S2 + A1 council) | S3 + S4 + S5 + S6 | 25 min each |

### A1 — ECC council preempt (NEW Gate 4 directive)

Before any Wave 2 sub-agent dispatch, ECC `council` is invoked on **A1 (compositional block multi-CSS loading + production composition)** with the deliberation brief in `gate-4-final.md` (or equivalent owner directive). Output appended to `_wave-1-synthesis.md` as **Appendix A1-Council**. Feeds S3 and S4 briefs.

### A1-A9 sub-agent assignments (confirmed from synthesis §3.2)

| ID | Topic | Wave 2 owner |
|---|---|---|
| A1 | Compositional block multi-CSS loading | **S4** (after council preempt) |
| A2 | Modal split — already locked at D5 | S3 |
| A3 | Marquee fullwidth tier-promotion mechanism | S5 |
| A4 | Surface-N split — already locked at D6 | S3 |
| A5 | Infrastructure category — already locked at D7 | S4 |
| A6 | UIKit aliasing strategy | S3 |
| A7 | Apcach runtime bootstrap convention | S1 |
| A8 | Engine-default fix for marquee hover-pause | S4 + Session 4+ marquee sandbox |
| A9 | `data-theme` canonical (drop `data-ts-theme`) | S1/S2 migration map |

### Deferred to Gate 5 (require Wave 2 specs to be actionable)

- D2 — Apcach runtime Path A (bundled +50KB) vs Path B (CSS-only) vs Hybrid
- D3 — OKLCH browser baseline acceptance (mid-2023+)
- D4 — npm package name `toolskin@1` verification
- D8 — Light mode API surface (add `Toolskin.setTheme()`?)

### T1/T2/T3 spec re-dispatch — NONE

All three Wave 1 specs approved as-is. Open questions route to Wave 2 sub-agents per A1-A9 assignments.

---

## GATE 4.5 LOCKS (2026-05-19, post-A1-council, owner picks)

After A1 council deliberation, owner placed `docs/session-1-bootstrap/a1-council-resolution.md` with explicit picks. Resolution appended to `_wave-1-synthesis.md` as **Appendix A1-Resolution** (full text there). Binding for S4 dispatch.

### Owner picks (locked):
- **Q1**: KEEP `@ts-deps` headers (machine-parsed dep declaration in each block CSS file)
- **Q2**: KEEP per-block file emission (`dist/toolskin.css` single-file + `dist/blocks/<block>.css` per-block, both cascade-consistent)
- **Q3**: Pre-commit hook FULL — topo-sort + sandbox-vs-bundler diff + missing-dep validation (Critic high-severity failure modes closed)
- **Q4**: COMMIT `dist/toolskin.css` to repo (Rule 13 erosion closed; node-less contributors can ship)

### S4-S6 collaboration: shared parser module
S6 designs the pre-commit hook script. S4 designs the topo-sort + bundler. **They share the same dependency parser module** so both speak the same dep graph. Encode in both S4 and S6 briefs.

---

## WAVE 1.5 — DESIGN DNA EXTRACTION (NEW, between Wave 2 and Gate 5)

Owner-added step after Wave 2 specs complete. Closes the visual design audit gap: Wave 1+Wave 2 produced architecture/math/tokens but did NOT consult `expert-designer`, `typography-master`, `design-tokens-2.0` in-house Tier 1 skills. Risk: rebuilt blocks become architecturally correct but visually generic.

Wave 1.5 = single sub-agent (Design DNA Extractor) dispatched AFTER Wave 2 specs land. Reads:
- Layer A: in-house Tier 1 design skills (`expert-designer`, `typography-master`, `design-tokens-2.0`)
- Layer B: Wave 1 + Wave 2 specs (so DNA aligns with architecture)
- Layer C: reference visual artifacts in `../toolskin-showcase/` (HTML, CSS, branding, pitchdeck — read-only)

Output: `docs/handoffs/_rebuild-design-dna.md`. Time-box 35 min. Binding for every Session 4+ block sandbox session. Encoded in toolskin-architecture SKILL.md at Phase E.

---

## COUNCIL CALL UPGRADE (binding for future councils)

Per owner directive after A1 council deliberation. Encode in toolskin-architecture SKILL.md at Phase E.

For any council invocation involving VISUAL / AESTHETIC / IDENTITY / BRAND / USER-PERCEPTION dimensions, the standard 4 voices upgrade to:

1. **ARCHITECT** (same — proposes solution)
2. **DESIGN SKEPTIC** (replaces generic Skeptic for design-touching decisions): challenges from visual design perspective; reads `expert-designer` + `typography-master` + `design-tokens-2.0` SKILL.md + `_rebuild-design-dna.md` before responding; counter-proposals honor design DNA not generic heuristics
3. **PRAGMATIST** (same — shipping reality, plus "what does the user SEE?")
4. **DESIGN CRITIC** (replaces generic Critic for design-touching decisions): audits against 15+ Rules INCLUDING Rule 5 (drop-in identity preservation); audits against design DNA; failure modes ranked by VISUAL severity; asks "If we ship this, will it still LOOK like Toolskin?"

**Default to upgraded voices unless decision is PURELY structural** (e.g., file path conventions, build pipeline mechanics with no visual impact).

When using upgraded voices, BOTH Design Skeptic and Design Critic MUST have access to:
- `_rebuild-design-dna.md` (Wave 1.5 output)
- Tier 1 in-house design skills
- The relevant component reference in `../toolskin-showcase/`

---

---

## CONVERSATION RULES — VERBATIM, BINDING FOR EVERY SUB-AGENT

Sub-agents read these BEFORE touching domain sources. Every output spec references these rules by number where applicable. Sources: file 01 (master brief v5) for rules 1-14, file 06 (Rule 15 supremacy doc) for rule 15.

### Rule 1 — Toolskin philosophy
> *"Zero framework dependencies. One stylesheet. Full dynamic control."*

### Rule 2 — Token-driven + derivative-math-driven, NOT class-driven like Tailwind
> *"Toolskin is token-driven and derivative-math-driven, not class-driven like Tailwind. Every component follows the `ts-marquee` pattern — zero manual structural markup, everything via data attributes with JS building DOM and CSS styling via tokens."*

### Rule 3 — The ts-marquee pattern is canonical for every component
One-liner setup. Data attributes. JS builds DOM. CSS styles via tokens. Zero manual structural markup.

### Rule 4 — Surface superposition awareness is core, not patch-work
> *"This kind of rules must be consciously planned and designed to be automatically applied like on the light or dark theme modes, but to be surface superposition aware too... so we get a solid design system that cannot fail on its core logic."*

### Rule 5 — The product differentiator
> *"This must be something that literally you give to anybody, AI or WordPress, and instantly adapts and merges to any convention because the tokens makes that possible by the solidness and how is built. If we make this properly, the CSS or JS + Sass or CSS will certainly convert any interface at will to any design type easily, with just design patterns and UI application — just knowing where to adapt to."*
>
> *"The element that makes this product something that actually people may use and don't trash and run to Vercel or Replit or Wix."*

### Rule 6 — Old toolskin.css is BLOCK PROTOTYPE — reference only
Visual and functional source-of-truth REFERENCE in the old repo. Read constantly, modified never. Design essence correct, code not production-grade.

### Rule 7 — Block-by-block sandbox with reusable HTML base context
> *"Module by module, new file to test-drive each one. Same HTML base context reusable. Everything that is not the CSS and assets type must be efficiently reusable."*

ONE `sandbox/_base.html` shared across every block.

### Rule 8 — Cascade-sensitivity rule (May 17 discovery)
`:root [class*="ts-tree"]` is a SCOPED DISTRIBUTION LAYER. Cascade is partially explicit. The rebuild uses explicit `:is(...)` enumeration where appropriate, designed during block-layer-type engineering.

### Rule 9 — @taxonomy_chips_strip 10 protected values are LOCKED design input
The chips strip docstring in the OLD repo's toolskin.css encodes 10 owner-locked values. The rebuilt chips block must reproduce these visually — they are the design contract.

### Rule 10 — Owner manual changes are AUTHORITATIVE
Between agent sessions, owner edits stand. Agents do not "fix" or revert without explicit direction.

### Rule 11 — Halt on anomaly, never improvise
Cost of stopping is minutes. Cost of improvising is months.

### Rule 12 — NEW REPO ONLY ⭐
After Session 1 lands, all rebuild work happens in `toolskin-rebuild/`. The old `toolskin-showcase/` is read-only reference. No edits, no commits, no PRs against the old repo. Sub-agents that propose writes to old repo paths get rejected at synthesis.

### Rule 13 — NO NODE.JS RUNTIME DEPS IN SHIPPED PRODUCT ⭐
Apcach lives in `tools/color-engine/` as build-time tooling. The shipped artifact is pure CSS + minimal JS. No webpack, no Vite, no PostCSS runtime, no npm scripts the end consumer needs to run. Eventual ship = one CSS file + one JS file + wrapping library, drop-in for any context.

### Rule 14 — Fresh git history ⭐
The new repo's first commit IS the Session 1 baseline. No imported history from old repo. Clean room.

### Rule 15 — Smart Color System (apcach) is the color authority ⭐ (NEW, file 06)
> The Toolskin color system is built on **apcach** (antiflasher/apcach, MIT, Evil Martians) — JS color calculator composing OKLCH colors with verified APCA contrast at every derivation step. This is the holy grail differentiator of Toolskin: a CSS framework where every accent hue, every surface depth, every text-on-background pair is mathematically guaranteed to meet a target APCA contrast ratio without hand-tuning or lightness-fluctuation patches.
>
> apcach runs at TWO layers in Toolskin:
>
> 1. **BUILD-TIME** (`tools/color-engine/`) — generates the canonical primitive OKLCH values for `--ts-bg-*`, `--ts-accent-*`, `--ts-this-*` token families with verified APCA contrast at every step of every ramp. Output baked into `assets/css/next/primitives/colors.css` as static OKLCH custom properties.
>
> 2. **OPTIONAL RUNTIME** (`toolskin.js`) — when consumer selects a new accent hue at runtime (theme customizer, white-label deployment, AI-generated palette), toolskin.js calls apcach to recompute the entire derivative chain with the new hue while preserving contrast contracts at every step. No lightness fluctuation. No accessibility failures. No hand-tuning.
>
> **BINDING ON ALL CODE, ALL SKILLS, ALL SUB-AGENTS:**
>
> - Every color rule in `assets/css/next/**/*.css` derives from apcach output OR consumes the derivative system that derives from apcach output. NEVER from manual hex picks, NEVER from generic palette guidance, NEVER from external skill color proposals.
> - Any external skill (ECC design-system, designer-skills `/design-tokens`, anything else) that proposes color values, palette logic, or contrast methodology — its color guidance is OVERRIDDEN by apcach. The external skill's color flag is informational only; apcach's output is law.
> - The in-house `design-tokens-2.0` skill must be updated to reference apcach as the color substrate (in the update pass, see `_in-house-skills-update-todo.md`).
> - The CSS derivative chain (`--ts-this-color-*`, `--ts-this-bg-*`, surface superposition math) consumes apcach-derived primitives. The chain itself uses CSS `oklch()` and `color-mix()` to compose at the system layer.
> - NEVER propose an alternative color system. NEVER suggest "WCAG-only" methodology. NEVER use generic palette tooling that produces hex values without contrast verification.
> - If a sub-agent's brief or any external skill flag conflicts with apcach output, apcach wins. Document the override reason; proceed with apcach.
>
> **Why this rule matters:** Toolskin's value proposition vs Tailwind/Bootstrap/Vercel-default is that ANY accent input produces a complete, contrast-verified design system in one operation. This is the "literally give to anybody, AI or WordPress, and it adapts" promise (Rule 5). Without apcach as authoritative color substrate, that promise fails. Lose this rule, lose the differentiator.

---

## REPO ISOLATION (file 07 binding)

| Term | Refers to |
|---|---|
| "The Toolskin project" / "the repo" / "the rebuild" | `toolskin-rebuild/` (canonical, where ALL work happens, branch `master`) |
| "The reference" / "v1" / "frozen Toolskin" | `../toolskin-showcase/` (frozen, read-only, separate repo) |
| "Main branch" | ONLY refers to `toolskin-rebuild`'s `master`. NEVER refers to the reference repo. |

**Hard isolation rules:**
- All CWD operations stay inside `toolskin-rebuild/`. Never `cd` into reference.
- All git operations run from inside `toolskin-rebuild/` only. NEVER run git against the reference.
- Reference reads use ONLY relative paths (`../toolskin-showcase/<path>`).
- READ operations only (cat, view, grep, head, tail, find). NEVER write back.
- The reference repo's git state is invisible. Don't query branches, don't check log, don't compare HEAD.
- Sub-agent that violates isolation: HALT, surface to owner.

---

## SKILL PRIORITY HIERARCHY (file 05 binding)

When conflict arises between any two skills, the higher-tier skill wins. Document the override reason in the artifact's footer.

```
TIER 1 — AUTHORITATIVE (Toolskin-specific, never overridden)
  1. toolskin-architecture (Phase E skill, to be built this session)
     └── Rule 15: apcach is THE color authority (NON-OVERRIDABLE)
  2. design-tokens-2.0 (in-house, .claude/skills/design-tokens-2.0/) — must consume apcach output
  3. expert-designer (in-house, .claude/skills/expert-designer/) — defers to apcach on color
  4. typography-master (in-house, .claude/skills/typography-master/)

TIER 2 — WORKFLOW DISCIPLINE (process, not design authority)
  5. designer-skills (julianoczkowski) — grill-me, design-review, design-flow, etc.
  6. Superpowers (user-scope) — execution discipline

TIER 3 — DIAGNOSTIC (advisory only, never authoritative on Toolskin)
  7. ECC design-system Mode 2 (Audit only) — 10-dim scoring with Toolskin filter list
     - Mode 1 (Generate) OFF-LIMITS for Toolskin
     - Mode 3 (Slop detection) USEFUL with allowlist
  8. ECC accessibility — WCAG 2.2 floor

TIER 4 — DELIBERATION (invoked at ponderation gates)
  9. ECC council — default for Phase D Gates 4-5
  10. yogirk agent-council — SKIPPED this session (codex + gemini CLIs absent)

TIER 5 — SUPPORTING (utility, no design authority)
  11. ECC code-tour, codebase-onboarding, context-budget, browser-qa, architecture-decision-records, configure-ecc
  12. apcach (build-time tooling at tools/color-engine/, NOT a skill, but in toolchain)
```

**ECC design-system audit filter list** (Toolskin intentional patterns ECC must NOT flag):
- Intentional gradients (chip strip edge-fade per @taxonomy_chips_strip, surface superposition)
- OKLCH-derived colors (NOT "random hex values" — they are apcach-derived per Rule 15)
- Space Grotesk choice (NOT "generic" — it's the brand display font)
- Harmonic 1.125 ladder typography
- Substring-distribution selectors WHERE intentional (cascade-sensitivity rule per Rule 8)
- Dark mode "completeness" — apcach derives both modes from same math, by construction (Rule 15)

---

## PRIMARY ARCHITECTURE SOURCES (every sub-agent reads these)

| # | Source | Path | Lines | Role |
|---|---|---|---|---|
| 1 | Old-repo CLAUDE.md | `../toolskin-showcase/CLAUDE.md` | 253 | Old project conventions, namespace rules, §8 refactor context |
| 2 | Session state | `../toolskin-showcase/docs/handoffs/_session-state-2026-05-17.md` | 166 | Tonight's reference state + cascade-sensitivity rule (line 116) + locked design decisions |
| 3 | April handoff README | `../toolskin-showcase/docs/PRE-REFACTORING-PLAN-15-04-2025/README.md` | 215 | Entry point — Superpowers bootstrap, source document index (April execution superseded; April architecture canonical) |
| 4 | **Restyling architecture** ⭐ | `../toolskin-showcase/docs/PRE-REFACTORING-PLAN-15-04-2025/architecture/restyling-architecture.md` | 314 | **THE REBUILD SPEC.** §2-§10 architectural blueprint: two-layer pattern, missing state tokens, derivative system, OKLCH auto-text |
| 5 | Master plan | `../toolskin-showcase/docs/PRE-REFACTORING-PLAN-15-04-2025/master-plan/master-plan.md` | 147 | April phased delivery (Phase 0-5). Phase 0 spec maps cleanly to rebuild primitives + system layers |

**Total:** 1,095 lines across 5 docs. Read budget: ~5 minutes per sub-agent.

---

## DOMAIN SOURCES (per-sub-agent assignment)

### Wave 1 — Block Layer Type Engineering Team

#### T1 — Block Typology Architect
- Primary architecture sources 1-5 (above)
- `../toolskin-showcase/assets/css/toolskin.css` — **survey** all component selector families (34,413 lines — use grep + targeted reads, NOT full load)
- `../toolskin-showcase/assets/css/toolskin.css:33944-34073` — @taxonomy_chips_strip docstring (Rule 9 contract)
- `../toolskin-showcase/assets/css/toolskin.css:15772-15921` — ts-marquee canonical pattern (Rule 3 exemplar)
- `../toolskin-showcase/assets/css/toolskin-uikit.css` — 1,597 lines, UIKit ts-ui-* family
- **Adds color contract field** to every block type definition (Rule 15 binding from file 06)
- **Resolves ts-marquee duplicate declarations** (`--ts-marquee-bg`, `--ts-marquee-font-size`) — intentional fallback OR cleanup target
- **Resolves ts-marquee `pointer-events: none`** owner-flagged temporary fix
- Output: `docs/handoffs/_rebuild-block-typology.md`

#### T2 — Block Composition + Reusable HTML Base Designer
- Primary architecture sources 1-5
- `../toolskin-showcase/index.html` — 2,900 lines, showcase reference for composition patterns
- `../toolskin-showcase/toolskin-lab.html` — 1,487 lines, UIKit lab reference
- **Designs `sandbox/_base.html`** that loads `assets/css/next/primitives/colors.css` (apcach-derived) + `assets/css/next/system/*.css` (derivative chain) BEFORE any block CSS (file 06)
- **Parity-rig iframe spec:** reference iframe loads `../toolskin-showcase/assets/css/toolskin.css` for visual comparison only
- Output: `docs/handoffs/_rebuild-base-context-spec.md` (NO sandbox/_base.html committed this session — spec only)

#### T3 — Adaptive Integration Architect
- Primary architecture sources 1-5
- `../toolskin-showcase/assets/js/toolskin.js` — 8,143 lines, runtime behavior reference
- `../toolskin-showcase/assets/js/toolskin-uikit.js` — 1,182 lines, UIKit runtime
- `../toolskin-showcase/index.html` + `toolskin-lab.html` + any other HTML entry points
- **Drop-in compatibility verification:** demonstrates apcach's role per Rule 5 + Rule 15 — given only a brand hue, Toolskin generates the complete contrast-verified system from that single input
- Output: `docs/handoffs/_rebuild-adaptive-integration-spec.md`

### Wave 2 — Domain Specialist Dispatch

#### S1 — Color Foundation Architect
- Primary architecture sources 1-5
- `../toolskin-showcase/assets/css/toolskin.css` — extract `--ts-bg-*`, `--ts-accent-*`, `--ts-fs-*` primitive declarations
- `tools/color-engine/node_modules/apcach/README.md` — apcach API
- **Rule 15 HARD MANDATE:** every primitive in `assets/css/next/primitives/colors.css` MUST be apcach-derived. No exceptions. No manual hex. No generic palette imports.
- **Deliverables (per file 06):**
  1. Build script `tools/color-engine/generate-colors.js` (apcach → `assets/css/next/primitives/colors.css`)
  2. Per-token derivation map with apcach call (contrast target, chroma, hue, comparing color, search direction)
  3. APCA contrast table for every meaningful pair
  4. Runtime hook spec (toolskin.js + apcach subset, per Rule 13 owner approval)
  5. Migration map: every color in old toolskin.css → new apcach-derived equivalent
- Output: `docs/handoffs/_rebuild-primitives-spec.md`

#### S2 — System Layer Architect
- Primary architecture sources 1-5
- `../toolskin-showcase/assets/css/toolskin.css` — extract `--ts-this-bg-*` derivative chain rules + surface superposition rules
- `../toolskin-showcase/assets/css/toolskin.css:33944-34073` — @taxonomy_chips_strip showing `--ts-this-bg: var(--ts-bg-1)` surface re-scope pattern
- **Rule 15 binding:** every `--ts-this-color-*`, `--ts-this-bg-*`, surface superposition rule in `assets/css/next/system/*.css` consumes apcach-derived primitives via CSS `oklch()`, `color-mix(in oklch, ...)`, or direct token reference. No CSS rule introduces a color value that isn't derived from apcach output.
- Output: `docs/handoffs/_rebuild-system-spec.md`

#### S3 — Component Registry + Block Prioritization
- Primary architecture sources 1-5
- `../toolskin-showcase/assets/css/toolskin.css` — every component selector family (grep + targeted reads)
- `../toolskin-showcase/assets/css/toolskin.css:33944-34073` — @taxonomy_chips_strip 10 KEY STYLE FACTORS TO PRESERVE (Rule 9 contract)
- `../toolskin-showcase/assets/css/toolskin.css:15772-15921` — ts-marquee canonical pattern
- `../toolskin-showcase/index.html` + `toolskin-lab.html`
- T1 typology output (consumed at synthesis)
- Each block classified by Wave 1 / T1 tier (PERMISSIVE / STRICT / ALWAYS STRICT)
- First 5 blocks get sketch `block-spec.md` files for autonomous execution per S5 protocol
- Output: `docs/handoffs/_rebuild-component-registry.md`

#### S4 — Build Pipeline Architect
- Primary architecture sources 1-5
- All HTML files in `../toolskin-showcase/` (index, lab, tree-explorer if present, pitchdeck/* if present, branding/* if present)
- T2 reusable base context spec (consumed at synthesis)
- Composition pipeline: how primitives → system → components compose into `assets/css/next/` build output
- Output: `docs/handoffs/_rebuild-build-pipeline-spec.md`

#### S5 — Autonomous Execution Protocol Architect (tiered calibration)
- Primary architecture sources 1-5
- T1 typology output (consumed for tier assignment)
- ECC `architecture-decision-records` skill (.claude/skills/architecture-decision-records/) — ADR-style protocol documentation
- ECC `code-tour` skill (.claude/skills/code-tour/) — sub-agent navigation pattern for reference reads
- ECC `context-budget` skill (.claude/skills/context-budget/) — directly addresses the 96% context disaster pattern
- **Tier definitions:**
  - **PERMISSIVE** — atomic blocks (button, input, chip, toggle, badge, icon, label, link, kbd). Auto-progress allowed if parity threshold met AND no rule violations. PR opens, owner reviews next morning.
  - **STRICT** — molecular blocks (card, modal, accordion, tabs, menu, dropdown, popover, tooltip, drawer). Sub-agent completes block but HALTS for owner approval before commit. No auto-progress.
  - **ALWAYS STRICT** — layout blocks (section, container, grid, columns, panel, sidebar, topbar, footer, hero). Owner must explicitly approve every step.
- Output: `docs/handoffs/_rebuild-autonomous-protocol.md`

#### S6 — Repo Governance + Refusal Patterns Author
- Primary architecture sources 1-5
- File 07 (`docs/session-1-bootstrap/07-repo-binding-clarification.md`) — full isolation rules
- All conversation rules + Rule 15 verbatim (above)
- ECC `configure-ecc` skill (.claude/skills/configure-ecc/) — ECC's own settings configurator
- **Three deliverables:**
  1. **Refusal patterns for toolskin-architecture skill** — explicit refusal language for forbidden requests (modifying old repo, writing outside allowed paths, Node.js runtime deps, frameworks in shipped product, auto-format CSS, skipping owner gates, decisions outside locked typology)
  2. **Pre-commit hook script** at `.git/hooks/pre-commit` (full text, NOT yet installed — owner approves at Gate 5):
     - Block any staged change matching `../toolskin-showcase/**`
     - Block any commit message lacking rebuild session tag (e.g., `feat(rebuild):`, `refactor(css):`, `docs(handoffs):`)
     - Block any new `!important` in `assets/css/next/**/*.css`
     - Warn on any file added outside `assets/css/next/`, `sandbox/`, `docs/`, `tools/`, `.claude/`, repo-root metadata files
  3. **CONTRIBUTING.md content** at repo root (full text, NOT yet committed — owner approves at Gate 5): 14+1 rules + refusal patterns + how owner approval works
- Output: `docs/handoffs/_rebuild-governance-spec.md` (spec only, no installs)

---

## IN-HOUSE TIER 1 SKILL REFERENCES

Sub-agents asking about Toolskin token rules, design heuristics, or typography defer to these BEFORE consulting external skills:

| Skill | Path | Use when |
|---|---|---|
| `design-tokens-2.0` | `.claude/skills/design-tokens-2.0/SKILL.md` | Any `--ts-*` token question, surface superposition, derivative chain, OKLCH math, apcach integration |
| `expert-designer` | `.claude/skills/expert-designer/SKILL.md` (slimmed, 140K) | Visual design, CSS implementation, Toolskin pattern application, design-theory questions |
| `typography-master` | `.claude/skills/typography-master/SKILL.md` | Font selection, pairing, hierarchy, modular ratio, Space Grotesk + harmonic 1.125 ladder |

**Naming-collision warning:** `.claude/skills/design-tokens/` (julianoczkowski, Tier 2 workflow) is a DIFFERENT skill from `.claude/skills/design-tokens-2.0/` (in-house, Tier 1 authoritative). When a question is Toolskin-specific, use `design-tokens-2.0`.

**Update pass deferred:** all three in-house skills need an update absorbing cascade-sensitivity, @taxonomy_chips_strip, surface superposition, and Rule 15 apcach migration. See `_in-house-skills-update-todo.md`. Update happens Session 1.5 or Session 2 startup, AFTER the toolskin-architecture skill (Phase E) lands and becomes the canonical feeder.

---

## STATE SOURCES

| Source | Path | Status |
|---|---|---|
| Owner's bootstrap brief evolution | `docs/session-1-bootstrap/01-orchestration-brief-v5.md` through `07-repo-binding-clarification.md` + `gate-2-final-b6-toggles.md` | Available |
| Session state from 2026-05-17 | `../toolskin-showcase/docs/handoffs/_session-state-2026-05-17.md` | Available (also primary source #2) |
| `_bu/rollback-2026-05-17/` artifacts | `../toolskin-showcase/_bu/rollback-2026-05-17/` | Available — 7 files (3 diffs + hunk-inventory.txt + 2 reference CSS snapshots) |
| All `_bu/` historical rollback folders | `../toolskin-showcase/_bu/` | Available — 10+ timestamped rollback folders from April through May 2026 |
| Old-repo git log/HEAD/branches | (NOT QUERIED per file 07 isolation) | **Unavailable to rebuild orchestrator.** File 07 explicitly forbids querying the reference repo's git state. If a sub-agent needs to understand the OLD repo's history, it reads from `_session-state-2026-05-17.md`, `_bu/` inventories, and `docs/PRE-REFACTORING-PLAN-15-04-2025/` deliverables — which together encode all relevant historical context without touching git. |
| Session 0 toolchain verification | `docs/_session-0-toolchain-verification.md` | Available |
| In-house skills update TODO | `docs/handoffs/_in-house-skills-update-todo.md` | Available (this session's B.9.3 + gate-2 additions) |

---

## VALIDATION SUMMARY

All paths in this queue were verified at queue-build time (2026-05-19, Session 1 Phase C).

| Category | Count | All present? |
|---|---|---|
| Primary architecture sources | 5 | ✅ |
| CSS / JS / HTML domain sources | 6 (line counts: 34,413 + 1,597 + 8,143 + 1,182 + 2,900 + 1,487 = 49,722 lines total) | ✅ |
| In-house Tier 1 skill SKILL.md files | 3 | ✅ |
| `_bu/rollback-2026-05-17/` artifacts | 7 files | ✅ |
| apcach README | 1 | ✅ |
| State sources | 7 categories | 6 ✅ + 1 not-queried (git log per file 07) |

**Missing or unreachable:** none. Every path either resolved cleanly or was explicitly omitted per binding rule.

---

## EXECUTION ORDER

This queue feeds Phase D Wave 1 and Wave 2 dispatch.

1. **Phase D Wave 1** — orchestrator dispatches T1+T2+T3 sub-agents in parallel. Each gets the full conversation rules + repo isolation + tier hierarchy + their domain sources. Time-boxed 25 min each.
2. Orchestrator ponderates Wave 1 outputs, writes `_wave-1-synthesis.md`.
3. **Owner Gate 4** — owner reviews Wave 1 synthesis, approves block typology + reusable base + adaptive contract.
4. **Phase D Wave 2** — orchestrator dispatches S1-S6 sub-agents. Wave 2 specs consume Wave 1 typology + base context + integration contract.
5. Orchestrator ponderates Wave 2 outputs, writes `_session-1-orchestrator-synthesis.md`. ECC `council` invoked at gates if ambiguity persists.
6. **Owner Gate 5** — owner reviews Wave 2 synthesis, resolves conflicts, locks S5 tier assignments + S6 governance.
7. **Phase E** — orchestrator builds toolskin-architecture skill, installs S6 governance (pre-commit hook + CONTRIBUTING.md).
8. **Owner Gate 6** — owner reads skill in full, approves.
9. **Phase F** — first commit on fresh repo.
10. **Owner Gate 7** — owner confirms commit lands. Session 1 ends.

---

## CONTACT POINTS BETWEEN SUB-AGENTS

T1 typology output → feeds T2, T3, S3, S5
T2 base context spec → feeds S4
T3 adaptive integration spec → feeds S1 (runtime hook), S2 (system layer composition)
S1 primitives spec → feeds S2, S3
S2 system spec → feeds S3, S4
S3 component registry → feeds S5 (block tier assignment)
S5 protocol → feeds S6 (governance enforces tier gates)
S6 governance → enforces all above via pre-commit hook + refusal patterns

When two sub-agents have conflicting outputs at synthesis: orchestrator invokes ECC `council` for ponderation. If still ambiguous, surface to owner at Gate 5.

# ADR — Forward Architecture (Phase 0 Council)

**Status:** **RATIFIED** by owner 2026-05-28 at HEAD `c005e50` (defaults D1–D5 accepted; two binding amendments added — see §Amendments)
**Date:** 2026-05-28
**Voices:** Architect (in-context), Pragmatist, Skeptic, Product
**Inputs:** STATE-AND-PLAN.md · SESSION-5-CLOSE.md · 01-WORKING-MODE.md · 02-INTEGRATION-RECIPE.md · REFACTOR-ACHIEVEMENTS.md · `decisions/*.md`
**Output:** ratified build order — Phase 1 (engine integration) begins after the freeze in Amendment A1

---

## Amendments (owner-binding, override anything below that conflicts)

**A1 — Pre-condition: freeze old `toolskin.css` BEFORE Phase 1.**
Copy `../toolskin-showcase/assets/css/toolskin.css` → `docs/references/toolskin.css.frozen` verbatim. This is the migration spec for Phase 2. Source file was 29,438 lines as of 2026-05-28T03:03Z, SHA256 `14508B66…1C259AE`. The frozen copy is read-only thereafter. Migration parity is measured against the frozen copy, not the live showcase file (which may continue to drift). Recorded in `docs/references/toolskin.css.frozen.meta.md`.

**A2 — `audit-identity.mjs` is a Phase 5 deliverable, not a Phase 1 prerequisite.**
The VQ-1..VQ-8 third gate is part of the page-gen MVP-1 scope (Phase 5). Component migration in Phase 2 runs with the existing dual gate (`audit-boring.mjs` + `audit-design.mjs`) only. Do NOT block component migration on identity-audit codification.

**A2.5 — D2 line-count is a forecast, not a contract.**
The ~1.5k–1.8k inherited core figure is the council's estimate. Final JS survival is determined by what the rebuilt showcase in Phase 4 actually imports. Modules with zero imports in the new showcase are deletable irrespective of any retention prediction in §Q2. Re-evaluate the table at the close of Phase 4.

---

## Settled before the council (NOT re-litigated)

Layered architecture · oklab for chromatic state mixes · engine as source of truth (this-bg-v2 / gradients-v3 / ts-btn v3.1) · phases not steps · nested CSS pattern · `components/` empty as the spine blocker.

---

## Q1 — Component migration order (after engine Phase 1-3)

**Engine Phase 1-3 (already specified in 02-INTEGRATION-RECIPE.md):** surfaces v2 → `system/` · gradients v3 → `system/` · ts-btn v3.1 → `components/`. Three commits. Button lands as the engine's own showcase, not as a post-engine migration.

**Post-engine migration order (synthesized — Skeptic order favored, with Product's section inserted):**

| # | Component | Reason for slot | Source | Buys |
|---|---|---|---|---|
| 1 | **ts-chip + ts-badge** | Smallest state surface; easiest to detect srgb/HSL leaks early when fixes are cheap. Catches the "old `color-mix(in srgb, ...)` re-imported under the same `.ts-*` class name" regression before it propagates. | old `toolskin.css` chip/badge blocks + surfaces v2 | #2, #3 |
| 2 | **ts-input** | State-heavy (rest/hover/focus/disabled/invalid). Validates border-from-text-token derivation (banned: `currentColor`). The "warm focus tint" is the visible artifact that proves #2 ("no purple"). Goes second only after chip+badge prove the srgb leak is closed. | old `toolskin.css` form block + surfaces v2 | #2, #3 |
| 3 | **ts-section (alt / accent-band / grad-surface)** | Unblocks every showcase composition below. Resolves the OPEN `.ts-section--alt` decision in `decisions/color-system.md` (contrast-driven, theme-agnostic, automatic nesting). Compositional layer between primitives and visible components. | old `toolskin.css` section blocks + gradients v3 | #1 |
| 4 | **ts-card (stat + feature)** | First composite consumer of surface + border + accent-tile + `--ts-shadow-accent`. Tests R9 Pattern 4 (re-anchor first, consume second). Must land after ts-section so card-in-alt-section behaves. | old `toolskin.css` card blocks + gradients v3 | #3, #5 |
| 5 | **ts-toolbar + ts-nav** | Composite shell of button + chip + input. Tests parent-context overrides per CSS-1 (the old `.hero .btn` / `.magazine .btn` duplication is the trap). | old `toolskin.css` toolbar/nav | #1, #5 |
| 6 | **ts-table + ts-accordion** | Parity completers. Behavior co-locates with the uikit.js cleanup (Q2). | old `toolskin.css` + `toolskin-uikit.js` | #5 |
| 7 | **ts-select / ts-dropdown / ts-modal-shell / ts-offcanvas-shell** | Popover/overlay layer. CSS-only shells; the offcanvas-editor JS app stays demoted (Q2). | old `toolskin.css` + uikit.js | #5 |

**Effort estimate:** ~23h component migration (Pragmatist sizing). One component = one phase = one commit. Each gets a `sandbox/02-components/<name>.html` showcase as its acceptance gate.

**Pre-condition (Skeptic, accepted):** snapshot old `toolskin.css` to `docs/references/toolskin.css.frozen` BEFORE Phase 1 begins. Migration target must be a fixed spec, not a moving owner-WIP file.

---

## Q2 — JS runtime keep/clean/demote/drop

| Module | LOC | Verdict | Reason | Buys |
|---|---|---|---|---|
| `toolskin.js` — theme + accent + surfaces + init | ~500-800 of 8,143 | **REWRITE FRESH** | Skeptic right: extracting from 8k lines costs more than rewriting the 500-800 that matter. Don't disguise a rewrite as a cleanup. | #5 |
| `toolskin.js` — lenis + locomotive + cursor + preloader | ~5,500 of 8,143 | **DEMOTE from core to `assets/optional/`** (owner-clarified D3 — demote, NOT delete) | The approved showcase is editorial typography + bento + accent painting. Smooth-scroll + custom cursor are 2022 AI-generic chrome, not Toolskin identity. If a specific demo wants them, load on demand from `assets/optional/`. | none |
| `toolskin.js` — ionicons / FA preloader | ~200 of 8,143 | **MOVE to `toolskin-assets.js`** | Pinned-version CDN loading belongs with the asset preloader. | #5 |
| `toolskin-assets.js` | 463 | **KEEP+TRIM** to ~300 | CDN preloader is honest infra. Pinned versions = lock file. | #5 |
| `toolskin-uikit.js` (accordion/select/table/draggable/masonry) | 1,182 | **CLEAN + SPLIT** per-component, co-locate with CSS. ~700 final. | These are real component behaviors and load-bearing for Q1 items #6–#7. | #5 |
| `ts-offcanvas-editor` | 2,911 | **DEMOTE** → `assets/optional/` | Mini-app. Not parity. Lab use only. | none |
| `bannerGenerator` | 2,027 | **DEMOTE** → `assets/optional/` | Mini-app. Candidate page-gen poster child (Product). | #4 (later) |
| `phantom-gallery` | 958 | **DEMOTE** | Optional asset module. | none |
| `ts-cube-portfolio` | 709 | **DROP** | Obsolete; no parity argument. | none |
| `ts-gradient-canvas` | 654 | **DROP** | Superseded by gradients-v3 token library. | none |
| `ts-gallery` | 515 | **DEMOTE** | Optional asset module. | none |
| `mockup-scripts` | 1,295 | **DROP** | Dev-time only; rebuild fresh if mockups return. | none |
| `showcase.js` | 1,089 | **DROP from core, rebuild fresh** as Phase 4 part of the new showcase | Page-specific glue; the rebuilt showcase will need new glue against `next/`. Don't carry the old. | parity |

**Inherited core target after cleanup: ~1,500–1,800 lines** (rewritten core 500-800 + uikit-clean 700 + assets-loader 300). From 20k → ~1.7k core. The remaining ~6k that survive as demoted optional asset modules load on demand and do not gate the showcase.

**Cleanup effort:** ~12h core rewrite + ~6h uikit split + ~2h optional-asset loader = ~20h (one multi-commit phase).

---

## Q3 — Page-generation MVP

**Recipe format: Markdown with YAML front-matter** (Product wins format debate over Pragmatist's pure YAML — prose slots need markdown body; agent parses both layers trivially; humans can hand-write recipes).

**Recipe shape (example, ~10 lines):**

```markdown
---
page: pricing
starter: 03-asymmetric-hero
manifesto: "Three plans, editorial gravity, mono prices, accent CTA on mid tier"
accent: { h: 28, s: 0.18, l: 0.62 }
gates: [audit-boring, audit-design, audit-identity]
---

# Pricing, in plain math

Three plans. Mono numbers. The middle one is _accent_.

::tile{kind=card-plan-accent}
…content…
::
```

**Gates (three, all must exit 0):**
1. `node expert-designer/scripts/audit-boring.mjs <out>` — conviction detector
2. `node expert-designer/scripts/audit-design.mjs <out>` — token compliance
3. **NEW** `tools/page-gen/scripts/audit-identity.mjs` — encodes VQ-1..VQ-8 from `.claude/rules/02-visual-quality.md`. The rejected sandbox passed audits 1+2 and still failed visually; identity is the missing third gate. (Skeptic + Product converged on this; the audits already exist as text in the rules file — codify them.)

**MVP — tiered, NOT single (Skeptic's challenge accepted):**

- **MVP-1 (smoke test, ~8h):** one recipe → one HTML page → three audits green. Files:
  - `tools/page-gen/generate.mjs` (recipe → HTML)
  - `tools/page-gen/lib/recipe-schema.mjs`
  - `tools/page-gen/scripts/audit-identity.mjs`
  - `tools/page-gen/recipes/01-pricing.md`
  - `sandbox/04-generated/pricing.html` (the proof)
- **MVP-2 (real capability test, ~16h):** five recipes for five intents (landing / pricing / docs-article / dashboard-style / contact) from 3-line briefs. Agent picks the starter unaided. Pass criteria:
  - (a) agent picks ≥3 different starters across the five recipes
  - (b) all five exit 0 on the three gates
  - (c) one recipe legitimately requires a starter that does not exist yet, and the agent surfaces the gap (does not force-fit)
  - (d) human cannot visually trace three of the five back to the same starter family

**First starter to generate:** `03-asymmetric-hero.html` — already in working tree; covers grid + hero + typography in one shot; signature pattern of the OLD showcase. If the agent reproduces THAT from a recipe, the rest is downhill.

**Self-generated proof page:** `sandbox/05-page-gen/index.html` is itself generated from `tools/page-gen/recipes/00-self.md`. The system produces a page documenting the page-gen system. If that ships, #4 is real.

---

## The critical path to deliverable (phased, commit per phase)

| Phase | Work | Effort | Shippable artifact | Buys |
|---|---|---|---|---|
| 0 | This council (no code) | — | `decisions/forward-architecture.md` ratified | — |
| 1 | Engine in: surfaces v2 + gradients v3 + ts-btn v3.1 (3 commits per 02-INTEGRATION-RECIPE.md) | ~4-6h | three engine showcases render | #1, #2, #3 |
| 2a | Component migration: chip/badge → input → section | ~6-8h | parity strip showcase | #2, #3 |
| 2b | Component migration: card → toolbar/nav → table+accordion → overlays | ~12-15h | full showcase parity rendered | #1, #3, #5 |
| 3 | JS runtime: rewrite inherited core + clean uikit + demote mini-apps + drop dead | ~20h | clean import map; core ~1.7k lines | #5 |
| 4 | Refactored showcase + assets — rebuild consuming `next/` end-to-end | ~8h | live showcase parity proven | #1, #5 |
| 5 | Page-gen MVP-1 (smoke) → MVP-2 (capability) | ~24h | self-generated proof + 5-intent test green | #4 |
| 6 | Cleanup pass: cruft removal, font-scaling resolution, color palette consolidation | ~6h | `next/` finalized; OPEN decisions closed | — |

**Estimated total to full deliverable:** ~80h. **Showcase parity alone (Phases 1+2+4):** ~30-37h. **Page-gen unlock (#4):** ~24h once parity is there.

---

## Disagreements surfaced — owner breaks these ties

The voices materially split on five points. Defaults shown are the synthesized choice; owner can override.

| # | Question | Skeptic | Pragmatist | Product | Default (synthesis) |
|---|---|---|---|---|---|
| D1 | First component after engine | chip+badge (catch srgb leak early) | ts-input (state surface area) | ts-btn first then ts-input | **chip+badge** — Skeptic's srgb-leak audit reasoning carries; risk-asymmetric |
| D2 | JS inherited core target size | ~200 lines (extract minimum) | ~1,600 lines (clean) | ~5-6k lines (keep showcase.js) | **~1,500-1,800 lines** — rewrite-not-clean, drop lenis/cursor, keep uikit |
| D3 | lenis / locomotive / custom-cursor | DROP from core (identity ≠ smooth-scroll) | DEMOTE (optional asset) | DEMOTE | **DROP from core**, archive to `assets/optional/` — owner reinstates per demo if needed |
| D4 | Page-gen recipe format | (not directly addressed) | YAML | Markdown + YAML front-matter | **Markdown + YAML front-matter** — prose slots need it |
| D5 | Page-gen MVP scope | five-intent capability test | one-page smoke | one-page smoke + self-generated meta | **Tier both** — MVP-1 smoke first, MVP-2 capability second |

**Non-controversial unanimous calls (no tie to break):**
- Migration is not redesign — `.ts-*` class names preserved externally.
- Old `toolskin.css` frozen to `docs/references/toolskin.css.frozen` before Phase 1 (Skeptic; accepted).
- ts-cube-portfolio + ts-gradient-canvas + mockup-scripts: DROP.
- All mini-apps demoted to optional asset modules, not core.
- `audit-identity.mjs` (VQ-1..VQ-8) is a required third gate for page-gen.
- Font-scaling OPEN decision (decisions/font-scaling.md) does NOT block components. Resolve in Phase 6.
- Component sandboxes per `sandbox/02-components/<name>.html` are the per-phase visual gate (per 01-WORKING-MODE.md rule 4).

---

## Surprises worth surfacing

- **Pragmatist:** Most of the 20k JS doesn't need a 1.6k extraction — it needs to not be imported by Phase 4. Modules the rebuilt showcase doesn't reference are dead on day one. Don't budget hours cleaning code that won't load.
- **Skeptic:** The real spine blocker isn't components/ being empty — it's that the old 8.5k `toolskin.css` is a moving spec. Owner WIP edits to it mid-Phase-2 silently change what the migration is migrating *to*. Freeze it first.
- **Product:** Don't perfect the system layer (font-scaling, color consolidation) before components. Phase 6 resolves OPEN decisions under a working showcase where wrong choices are visible in seconds, not theoretical.

---

## Owner ratification — recorded

Defaults D1–D5 accepted as ratified:
- **D1** = chip+badge first
- **D2** = ~1.7k inherited-core forecast (REFINED by Amendment A2.5: final size determined by Phase 4 showcase imports)
- **D3** = DEMOTE lenis/locomotive/cursor to `assets/optional/` (owner clarified: demote, NOT delete)
- **D4** = Markdown + YAML front-matter
- **D5** = Tiered MVP (smoke → capability)

Plus binding amendments A1 (freeze) and A2 (identity-audit deferred to Phase 5).

After the Phase 0 commit (this ADR + frozen reference), Phase 1 (engine integration per `docs/handoffs/02-INTEGRATION-RECIPE.md`) opens. Migration spec for Phase 2 is `docs/references/toolskin.css.frozen`.

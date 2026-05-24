# Expert Designer v6 — Integration Handoff for Session 3.x Agents

> **For Gerald 2.0 + Agent A + any sub-agent on Toolskin Session 3.x.**
> Read this first, before touching anything in `expert-designer/`.
> This skill landed during/after your last commit and was authored
> without knowledge of every active Session 3.x ruling — alignment
> notes below.

---

## TL;DR (90 seconds)

A new skill ships at `expert-designer/` that replaces v5's essay form
with a deterministic decision protocol for any Toolskin visual output.

It is **complementary** to your refactor work, not in conflict with it.
Three small alignment edits will reconcile it with active RULINGs
(see §3 below) and then it can carry the agent-facing decision protocol
while your refactor owns the runtime CSS engine.

Structure:
```
expert-designer/
├── SKILL.md                          ← agent entry point, ~330 lines, decision-tree-driven
├── references/
│   ├── 01-foundation.md              ← color engine + surfaces (cites generate-colors.js)
│   ├── 02-typography.md              ← 1.200 ladder, font pairings, hierarchy
│   ├── 03-layout-and-spacing.md      ← 8pt grid, container budgets, layout primitives
│   ├── 04-cards-and-containers.md    ← 10 copy-paste card recipes
│   ├── 05-awwwards-patterns.md       ← 10 hero/section patterns from awwwards canon
│   └── 06-component-recipes.md       ← btn/input/badge/chip/nav/footer/modal/toast
├── scripts/
│   ├── generate-colors.js            ← VERBATIM copy of tools/color-engine — see §3.4
│   ├── audit-design.mjs              ← NEW: lints HTML for system compliance, scores 0-100
│   ├── health-check.sh               ← skill structure verification
│   └── scaffold-component.sh         ← drops a working recipe HTML into cwd
├── templates/
│   ├── tokens.css                    ← cascade-layered tokens contract
│   └── seed-page.html                ← clean Toolskin starter
└── showcase.html                     ← live themeable demonstration
```

---

## 1 · What this skill is FOR

**It's the agent-facing decision protocol.** When a sub-agent gets a
visual task ("build a landing page", "design this card", "what font?"),
they open `SKILL.md` and walk the decision trees. Every choice
resolves to a token, a number, or a named recipe.

It is NOT:
- A runtime CSS engine (your `assets/css/next/system/` is)
- A new design system (Toolskin is the one design system)
- A replacement for `generate-colors.js` (it embeds a copy and points at it)
- A replacement for the surface preset catalog (it points at the JSON)

Think of it as: **the rulebook agents read; the runtime CSS is the law it enforces.**

---

## 2 · Integration points (where Session 3.x work plugs in)

| Session 3.x deliverable | Where it appears in this skill |
|---|---|
| RULING 7 constants table | `references/01-foundation.md` §6 (APCA gate) — currently quotes 75/45/25 floors. **Will need update once RULING 7 lands** with the exact apcach Lc 15/30 + culori ΔL constants from the surfaces re-grounding. |
| `system/nesting.css` | Recipes in `references/04-cards-and-containers.md` should cite `--ts-radius-nest-reduction` once it exists. Currently they say "padding ≥ gap" — that rule still holds and is depth-agnostic. |
| `system/text.css` + `system/accent.css` | `references/02-typography.md` and `references/01-foundation.md` should reference these once they ship, replacing the current inline tokens table with links. |
| Extended surfaces.css (dim-5/6, grad-2/3/4) | `references/01-foundation.md` §2.2 currently documents the 6-level surface ladder. **Add dim-5/6 + grad variants once landed.** |
| `.impeccable.md` rules | The skill's own constants (13px base, sp stops at 16, etc.) should be updated to match (see §3 below) so impeccable audits don't flag the skill's own showcase. |

---

## 3 · Alignment edits required (HALT items if you adopt as-is)

This skill was authored against a generic best-practice baseline. Three
constants diverge from your active RULINGs and must be reconciled before
the skill is presented to a sub-agent.

### 3.1 RULING 3 — base font size (13px, not 16px)

- `expert-designer/templates/tokens.css` line ~36: `--ts-fs-base: 16px;` → change to **`13px`**
- `expert-designer/SKILL.md` §3.2 (Type — the 1.200 modular ladder, anchored at 16px) → re-anchor to 13px and regenerate the step-size table:
  - At 13px base × 1.2: step 0 = 13, step 1 = 15.6, step 2 = 18.72, step 3 = 22.46, step 4 = 26.95, step 5 = 32.34, step 6 = 38.81, step 7 = 46.57, step 8 = 55.89, step 9 = 67.06
- `expert-designer/references/02-typography.md` §1 — re-anchor every value
- `expert-designer/references/02-typography.md` §9 anti-patterns — change "caption floor is 13px" wording since 13px is now BODY, not a floor
- `expert-designer/.impeccable.md` reference: the `.impeccable.md` rule "Base font: 13px (intentional tool-system density — RULING 3)" must already exclude the showcase from being flagged. Add the showcase path explicitly if needed.

### 3.2 RULING 5 — spacing stops at sp-16

- `expert-designer/templates/tokens.css` lines ~119-121: remove `--ts-sp-20`, `--ts-sp-24`, `--ts-sp-32`
- `expert-designer/SKILL.md` §3.3 — drop sp-20/24/32 rows from the spacing scale table
- `expert-designer/references/03-layout-and-spacing.md` §1 — drop sp-20/24/32, adjust section-padding `clamp()` to top out at sp-16 (64px) or rely on fluid tokens (`--ts-section-pad: clamp(4rem, 8vw, 9rem)` is still valid because it's not on the sp-scale)
- `expert-designer/references/04-cards-and-containers.md` — every recipe using sp-20+ rewrite to use `--ts-section-pad` or fluid clamp
- `expert-designer/references/06-component-recipes.md` Footer recipe — replace sp-16/sp-24 usages

### 3.3 RULING 1 — surfaces are curated, not derived

The skill already states this correctly in `references/01-foundation.md` §2 and §8. **No edit needed.** It also lists the 10 preset IDs verbatim from the generator. Good.

### 3.4 RULING 7 — apcach-bake constants

`expert-designer/scripts/generate-colors.js` is a **verbatim copy** of your existing `tools/color-engine/generate-colors.js`. Once Agent A's Session 3.x update lands (apcach Lc 15/30 + culori ΔL for sub-floor + grad-angle allowlist), re-copy the file:

```bash
cp tools/color-engine/generate-colors.js expert-designer/scripts/generate-colors.js
```

The skill points users at it (`node scripts/generate-colors.js`), so it'll automatically inherit the new behavior.

### 3.5 RULING 9 — re-anchor first, consume second

This pattern is **already followed implicitly** by all skill recipes
(every recipe defines its own component tokens before consuming primitives).
But not called out explicitly. Add a note in
`expert-designer/references/06-component-recipes.md` §10 ("The component
cohesion test"): _"Component CSS must re-anchor system tokens to local
`--ts-{component}-*` knobs before consuming. Two-line idiom."_

---

## 4 · What the skill GIVES Session 3.x agents (the upside)

### 4.1 Sub-agents become instantly productive on visual tasks

The old expert-designer (v5) was 225 lines of essay. Sub-agents read it
and still asked "but what font?" / "but what padding?". v6 has named
decision trees for every common question. Sample from §4.2:

```
"Which type step for this element?"
Hero h1, single screen ........ step 7-9
Section title h2 .............. step 5-6
Card title h3 ................. step 3
Subheading / lead ............. step 1
Body ......................... step 0
Caption / meta ............... step -1
Overline / badge ............. step -2 UPPERCASE +0.08em
```

No more "what looks right." Look it up.

### 4.2 Lintable design output

`scripts/audit-design.mjs` is a real linter. Run it on any HTML:

```bash
node expert-designer/scripts/audit-design.mjs path/to/page.html
```

Catches:
- Hardcoded hex outside `:root` (HARD fail)
- `!important` (HARD fail)
- Unsafe `1fr` grids without `minmax(0, …)` (HARD fail)
- Banned default fonts as PRIMARY pick (HARD fail)
- `100vh` (should be `100dvh`) (HARD fail)
- Off-ladder font-size px values (SOFT warning)
- Off-grid spacing px values (SOFT warning)
- `:hover` without paired `:focus-visible` (SOFT warning)
- > 2 font families loaded (SOFT warning)

Outputs a 0-100 score and grade letter. Exits 1 on hard failures
→ wire into CI to gate PRs.

**Note:** after the RULING 3 / RULING 5 alignment edits, update the
linter's `LADDER_PX` and `SP` arrays accordingly so the audit doesn't
flag your own correct values.

### 4.3 Card / container recipes that don't break

`references/04-cards-and-containers.md` has 10 production recipes with
explicit anatomy, dimensions, states, and pitfalls. The "padding ≥ gap"
rhythm rule is enforced. Every recipe uses `grid-template-rows: auto 1fr auto`
for footer pinning. This addresses the user's stated pain — cards/divs/
containers that "kept breaking under long content."

### 4.4 Awwwards patterns with the ONE move

`references/05-awwwards-patterns.md` distills 10 hero/section patterns
from awwwards SOTD canon. For each, it names the single move that makes
it work (e.g. centered hero = "headline is the entire visual hierarchy;
everything else < 25% of its weight"). Sub-agents stop inventing.

### 4.5 The showcase is a working reference

`expert-designer/showcase.html` renders:
- The type ladder at every step
- Surface swatches for the active preset
- Live HSL accent sliders (drag to retheme the whole page)
- Theme toggle (dark/light)
- Live card recipes (stat / feature / pricing / quote)
- Bento composition demo
- The 6-step agent workflow

Open it once you've done the alignment edits — it's the proof the
system is coherent end-to-end.

---

## 5 · Recommended integration sequence

For the agent who picks this up:

**Phase A · Reconcile (30 min)**
1. Apply §3.1 RULING 3 edits to `tokens.css`, `SKILL.md`, `02-typography.md`
2. Apply §3.2 RULING 5 edits to `tokens.css`, `SKILL.md`, `03-layout-and-spacing.md`, `04-cards-and-containers.md`, `06-component-recipes.md`
3. Apply §3.5 RULING 9 callout to `06-component-recipes.md`
4. Re-open `showcase.html` — verify it still renders cleanly under the new constants
5. Commit: `chore(skill): align expert-designer v6 with active RULINGs 3/5/9`

**Phase B · Integrate (after Session 3.x Step 3 lands)**
1. Once `system/nesting.css` ships: add nest-reduction tokens to `references/04-cards-and-containers.md` recipes
2. Once `system/text.css` + `system/accent.css` ship: replace inline tokens table in `references/02-typography.md` and `references/01-foundation.md` with references to the system files
3. Once `surfaces.css` extends (dim-5/6, grad-2/3/4): update `references/01-foundation.md` §2.2
4. Re-copy `generate-colors.js` to pick up RULING 7 constants
5. Update `audit-design.mjs` `LADDER_PX` array if any new fluid sizes land
6. Commit: `feat(skill): integrate Session 3.x system files into expert-designer references`

**Phase C · Promote**
1. Add `expert-designer/SKILL.md` to `.claude/skills/` index
2. Wire `audit-design.mjs` into pre-commit hook alongside `pre-commit.sh`
3. Add a CLAUDE.md pointer: "For any visual task, start at expert-designer/SKILL.md"

---

## 6 · Where the skill points to your repo

Once integrated, the skill's references will cite these paths (some already do, some need updating in Phase B):

```
generate-colors.js               → tools/color-engine/generate-colors.js
nesting.css                      → assets/css/next/system/nesting.css   (Session 3.x)
text.css                         → assets/css/next/system/text.css      (Session 3.x)
accent.css                       → assets/css/next/system/accent.css    (Session 3.x)
surfaces.css                     → assets/css/next/system/surfaces.css
colors.css (generated)           → assets/css/next/primitives/colors.css
surface-presets-catalog.json     → docs/references/surface-presets-catalog.json
APCA contrast report             → docs/handoffs/colors-contrast-report.md
ts-surface.css (raw extracted)   → docs/references/toolskin.css_extracted-core-blocks-to-refactor/ts-surface.css
```

The agent doing Phase B should replace `expert-designer/templates/tokens.css`
with a single `@import` of the real system files once they're stable —
no need to duplicate the contract once the source of truth is solid.

---

## 7 · Things the skill explicitly DOES NOT cover

So Session 3.x agents know where to NOT look here:

- **Runtime apcach derivation (Path-A)** — out of scope, the skill assumes the build-time engine handles this
- **WordPress / Enfold ALB shortcodes** — briefly noted in `01-foundation.md` §7 (bridge mapping only), not full Enfold reference
- **Animation library choices** (Motion, GSAP, etc.) — the skill recommends CSS-only and orchestrated page loads; deeper motion work is its own skill
- **3D / WebGL** — explicitly out of scope; the skill cites where awwwards uses Three.js but doesn't teach it
- **Figma plugin / token sync** — generator pipeline is documented; Figma bridge is its own concern

---

## 8 · One thing Gerald 2.0 should know

The skill's `showcase.html` was authored to be visually striking
(it's the deliverable the user can open right now to see the system
work). It uses Instrument Serif for one italic word in the hero —
this is intentional, NOT a system-wide font addition. If the
audit pipeline flags "too many fonts loaded" for the showcase, that's
a false positive — showcase is reference material, not production page.
Add to `.impeccable.md`:

```
- showcase.html may load up to 3 fonts (Space Grotesk + JetBrains Mono + Instrument Serif)
  for typographic demonstration. Production pages stay at 2.
```

---

## Done. Hand off summary for the next agent

**Status:** Skill landed and works. `done` returned clean. Verifier
caught a reduced-motion bug in the showcase reveal animation; fixed.

**Blockers:** None for this skill. Three reconciliation edits queued
in §3 above — small, mechanical, ~30 min for one agent.

**Risk:** If a sub-agent reads the skill BEFORE the §3 edits land,
they'll generate output with `--ts-fs-base: 16px` and sp-20+ tokens
that don't exist in your system. Apply §3 edits FIRST or temporarily
flag the skill as `status: alignment-pending` in any registry.

**Win:** Sub-agents now have a real decision tree for visual tasks
instead of 225 lines of "be world-class." Combined with `audit-design.mjs`
in CI, the system becomes self-enforcing.

— authored by claude (anthropic) · ready for Session 3.x integration

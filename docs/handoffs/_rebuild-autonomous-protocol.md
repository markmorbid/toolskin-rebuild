# Rebuild — Autonomous Execution Protocol (Tiered)

**Sub-agent:** S5 — Autonomous Execution Protocol Architect
**Wave:** 2.3 (parallel with S3 / S4 / S6)
**Status:** PROPOSED — Wave 2 deliverable, 25-min time-box
**Binding inputs:** T1 (block typology §2), T2 (parity-rig §5.6/5.7, delta floor §8.3), T3 (verification protocol §7), S1 (APCA contrast table §8), S2 (5-state pattern §7, derivative chain), Wave 1 synthesis (full + Appendix A1-Council + Appendix A1-Resolution), ECC skills (`context-budget`, `architecture-decision-records`, `council`)
**Gate 4 / Gate 4.5 locks owned by S5:** A3 (marquee fullwidth tier-promotion mechanism)
**Consumers:** S6 (governance enforces via pre-commit + refusal patterns) · Sessions 4+ (every block runs this protocol) · Wave 1.5 Design DNA Extractor (G1 parity criteria extends with DNA once `_rebuild-design-dna.md` lands)

═══════════════════════════════════════════════════════════════════════
## 1. Scope
═══════════════════════════════════════════════════════════════════════

S5 produces the **tiered autonomous execution protocol** governing Session 4+ block sandbox work. S6 enforces it via governance (pre-commit hook + refusal patterns + CONTRIBUTING.md). Sessions 4+ execute against it.

Three tiers, formally defined from T1 §2:

- **PERMISSIVE** (atomic) — sub-agent auto-progresses to PR; owner reviews next morning.
- **STRICT** (molecular) — sub-agent completes block then HALTS for owner approval before commit.
- **ALWAYS STRICT** (layout) — owner approves every step; no autonomous progress under any circumstance.

S5 owns:
- The gate matrix per tier (what passes / fails / triggers halt).
- The parity-check definition.
- The audit suite contract.
- The per-block workflow.
- The context-budget discipline (per ECC `context-budget` skill — addresses the 96% disaster pattern).
- The council invocation rule (per ECC `council` + Gate 4.5 upgraded voices).
- The A3 marquee tier-promotion mechanism (single block-spec, `[data-fullwidth]` modifier promotes to LAYOUT).

S5 does NOT own:
- The pre-commit hook script (S6).
- The refusal pattern language (S6).
- Per-block tier assignments (T1 §2 / S3 registry).
- The build pipeline or topo-sort (S4).
- Visual identity criteria (Wave 1.5 Design DNA — extends G1 later).

═══════════════════════════════════════════════════════════════════════
## 2. The Three Tiers — Formal Definitions (T1 §2 binding)
═══════════════════════════════════════════════════════════════════════

### 2.1 PERMISSIVE (atomic blocks)

- **Source:** T1 §2.1 — ~44 component families (button, input, chip, toggle, badge, icon, label, type primitives, shadow/spacing/display/border utilities, reveal animations, frame, glow, grain, surface-N atomic, etc.).
- **Behavior:** Sub-agent dispatched, reads block-spec, writes sandbox + component CSS, runs audit suite, generates parity screenshots. If ALL gates pass → opens PR + notifies owner. Owner reviews next morning.
- **No mid-session owner approval required** as long as every gate clears. Any failure → halt.
- **Default time-box:** 15–30 min per block (§11).
- **Default council:** none (council never auto-invoked at PERMISSIVE).
- **Examples in T1 §2.1:** `.ts-btn`, `.ts-input`, `.ts-checkbox`, `.ts-chip` (individual), `.ts-badge`, `.ts-dot`, `.ts-h1`–`.ts-h6`, `.ts-shadow-*`, `.ts-mt-*`, `.ts-skeleton`, `.ts-reveal`, `.ts-glow`, `.ts-grain`.

### 2.2 STRICT (molecular blocks)

- **Source:** T1 §2.2 — ~49 component families (card, field, chips strip, tabs, accordion, modal content shell, toast, popover, marquee [default], code window, table, pricing card, testimonial, flip card, tree node, banner-generator internal compositions, offcanvas field, etc.).
- **Behavior:** Sub-agent completes the block work (CSS scaffold, sandbox slot, audit suite, parity screenshots) then **HALTS**. Packages a review artifact for the owner (G11). No commit, no PR, until owner says "ship it" or "fix X."
- **Council:** invoked only if >1 valid architectural path emerges (§9). When invoked for visual decisions, uses Gate 4.5 upgraded voices (DESIGN SKEPTIC + DESIGN CRITIC).
- **Default time-box:** 30–60 min sub-agent + owner review window (§11).
- **Examples in T1 §2.2:** `.ts-card`, `.ts-chips` (canonical, Rule 9 LOCKED), `.ts-tabs`, `.ts-accordion`, `.ts-modal` (content shell — D5 LOCKED), `.ts-marquee` (default — A3 tier-promotion applies), `.ts-tree__node`, `.ts-pricing-card`.

### 2.3 ALWAYS STRICT (layout blocks)

- **Source:** T1 §2.3 — ~35 component families (app shell, container, section, hero, topbar, nav, sidenav, mobile menu, page footer, grid, flex layout primitives, layout helpers, modal overlay [D5 LOCKED], panel, offcanvas overlay, tree-explorer shell, banner-generator app shell, dashboard, gallery lightbox, marquee fullwidth [A3 promotion], preloader, masonry hero, resizable container).
- **Behavior:** Owner approves implementation **step-by-step** — CSS structure → states → responsive → integration. Sub-agent surfaces design decisions at every fork. No unilateral architectural calls.
- **Council:** REQUIRED for any architectural fork (G15 enforces). Upgraded voices apply for any visual decision.
- **Default time-box:** 45–90 min with owner at every step (§11).
- **Examples in T1 §2.3:** `.ts-section`, `.ts-app-shell`, `.ts-grid`, `.ts-flex`, `.ts-stack`, `.ts-modal` (overlay — D5 LOCKED), `.ts-oce-overlay`, `.ts-tree-explorer`, `.ts-marquee.fullwidth.ts-marquee-container` (A3 promotion), `.ts-section.ts-surface-N` (D6 LOCKED).

### 2.4 Tier counts (T1 §2.4)

| Tier | Approx count | Autonomy |
|---|---|---|
| PERMISSIVE (atomic) | ~44 | Auto-progress overnight; PR opens, owner reviews next morning |
| STRICT (molecular) | ~49 | Sub-agent completes, halts for owner approval before commit |
| ALWAYS STRICT (layout) | ~35 | Owner approves every step |
| **Total** | **~128** | |

═══════════════════════════════════════════════════════════════════════
## 3. Gates Per Tier — What Passes / Fails / Triggers Halt
═══════════════════════════════════════════════════════════════════════

Gates are cumulative: STRICT inherits all 10 PERMISSIVE gates plus G11–G12; ALWAYS STRICT inherits all 12 STRICT gates plus G13–G15. A single failure on any inherited gate halts the run for that tier.

### 3.1 PERMISSIVE — 10 mandatory gates (auto-pass when ALL clear)

| Gate | Subject | Pass criterion | Failure action | Source |
|---|---|---|---|---|
| **G1** | Parity threshold | Visual-identity match ≥ 98% via parity-rig (structural pixel-diff <2% in PERMISSIVE band per §5; visual DNA criterion extends once Wave 1.5 lands) | HALT + report + screenshot bundle | T2 §5.6 / §5.7 |
| **G2** | APCA contrast | Every text-on-surface and on-accent pair in the block clears Lc 60 body / Lc 75 fine per S1 §8.1–§8.3 | HALT + report; fail row(s) named | S1 §8 |
| **G3** | No raw color values in component CSS | Rule 15. Block CSS references only `--ts-this-*` derivatives / `--ts-accent*` primitives / `--ts-text-*` / `--ts-on-*`. No hex, no rgb(), no oklch() literal, no hsl() literal, no named colors. | HALT + report + offending lines (S6 pre-commit also catches at commit; this gate catches PRE-commit during audit) | Rule 15 / S6 G3 |
| **G4** | No `!important` introduced | Zero `!important` declarations added in this block's `components/<name>.css`. | HALT + report; S6 pre-commit hook independently rejects at commit | Wave 1 synthesis governance / S6 |
| **G5** | Cascade contract | Block consumes `--ts-this-*` derivatives only (S2 §4 contract). No direct `--ts-bg-N` reference outside `:root` redeclarations. No `var(--ts-color-*)` raw primitive consumption when a derivative exists. | HALT + report; cite S2 §3/§4 | S2 §4 |
| **G6** | 5-state pattern present if interactive | If `<main data-block-tier="atomic">` AND block is interactive (per T1 classification — buttons, inputs, toggles, chips, etc.), block CSS must declare ALL FIVE states from S2 §7.1 (idle/hover/active/focus-visible/disabled). Non-interactive atomic blocks (utilities, type primitives, shadows, dots) skip this gate. | HALT + report missing state(s) | S2 §7 |
| **G7** | `@ts-deps:` header accurate | First line of `components/<name>.css` is `/* @ts-deps: <comma-separated dep tokens> */` (A1 LOCKED). Header parses, every dep resolves to an existing block name or primitive/system token file. S4 pre-commit hook enforces topo-sort consistency at commit time; this gate validates presence + parse during audit. | HALT + report; missing/typo'd deps named | Wave 1 synthesis A1-Resolution Q1 / S4 |
| **G8** | `design-tokens-2.0` audit (Tier 1) | In-house `design-tokens-2.0` skill audit returns no Tier 1 violations against the block's token usage. | HALT + report violations verbatim | File 05 Tier 1 |
| **G9** | ECC `accessibility` audit | WCAG 2.2 floor passes for the rendered block (semantics + focus + keyboard + ARIA). ECC audit is advisory on color (Rule 15 supreme — apcach owns color); accepts apcach-derived contrast outputs without re-evaluation. | HALT + report failing dimensions | File 05 Tier 3 / ECC accessibility |
| **G10** | Delta floor — sandbox structure | The sandbox `index.html` file diffs against `sandbox/_base.html` by **≤6 edits** per T2 §8.3: `<title>`, `<link>` to `components/<name>.css`, `<main>` contents, `data-block`, `data-block-tier`, optional path-prefix adjustment, optional block-runtime hook. Per T2 §8.5 (forbidden per-block edits) — none of those changes appear. | HALT + report excess edits | T2 §8.3 / §8.5 |

**PERMISSIVE outcome rules:**
- ALL G1–G10 pass → sub-agent **opens PR** with audit pack + parity screenshots attached; sets PR label `tier:permissive`; tags owner; sub-agent exits.
- ANY G1–G10 fail → sub-agent **HALTS** at the failed gate; writes `docs/handoffs/_session-N-block-<name>-halt.md`; emits halt summary; does NOT push, does NOT open PR. Owner picks up next contact.

### 3.2 STRICT — G1–G10 PLUS G11–G12

| Gate | Subject | Pass criterion | Failure action |
|---|---|---|---|
| **G11** | Owner review package | Sub-agent assembles `docs/handoffs/_session-N-block-<name>-review.md` containing: (a) full diff (component CSS + sandbox HTML), (b) parity-rig screenshots (idle, hover, active, focus, disabled — where applicable), (c) audit suite outputs (G1–G10 results verbatim), (d) parity-rig before/after, (e) any council deliberation if invoked (§9), (f) any open design decisions surfaced for owner judgment, (g) APCA verification table snippet for this block's tokens. | Sub-agent HALTS until package complete |
| **G12** | Halt + no auto-commit | Sub-agent does NOT commit, does NOT push, does NOT open PR. Posts the G11 package path + summary, waits for owner directive. | Auto-commit by sub-agent = immediate refusal-pattern trigger (S6 enforces) |

**STRICT outcome rules:**
- ALL G1–G12 pass → owner receives G11 package; says "ship it" → sub-agent commits + opens PR; OR "fix X" → sub-agent loops with fixes; OR "drop it" → sub-agent stashes work in `docs/handoffs/_session-N-block-<name>-stash.md` for later resumption.
- ANY G1–G10 fail → standard halt (as PERMISSIVE).

### 3.3 ALWAYS STRICT — G1–G12 PLUS G13–G15

| Gate | Subject | Pass criterion | Failure action |
|---|---|---|---|
| **G13** | Step-by-step owner approval | Sub-agent breaks work into **3 owner-approval steps**: (1) CSS structure (Layer 1 properties-once + token wiring, no states yet), (2) state declarations (`:hover`/`:focus-visible`/`:active`/`:disabled` per S2 §7.1 if interactive; default-only if non-interactive layout), (3) responsive + adaptive integration verification (per T3 §7). Owner explicit approval required AT EACH step before next step starts. | Skip-ahead = refusal-pattern trigger; sub-agent halts |
| **G14** | No unilateral design forks | Sub-agent surfaces any architectural decision with >1 viable path (e.g., flex vs grid, overlay positioning fixed vs absolute, scroll lock via JS class vs CSS-only) to owner BEFORE choosing. No autonomous picks. | Unilateral pick = halt + revert |
| **G15** | Council invocation required at forks | For ANY architectural fork in this block, ECC `council` is invoked BEFORE owner is consulted. Upgraded voices (DESIGN SKEPTIC + DESIGN CRITIC) used when the decision touches visual identity. Council output appended to the G11 package; owner picks from council deliberation. | Skipping council on a fork = refusal-pattern trigger |

**ALWAYS STRICT outcome rules:**
- ALL G1–G15 pass step-by-step → owner approves final → sub-agent commits + opens PR with `tier:always-strict` label.
- ANY gate fails → halt at current step; owner directs recovery.

═══════════════════════════════════════════════════════════════════════
## 4. Tier Promotion / Demotion
═══════════════════════════════════════════════════════════════════════

### 4.1 Default tier from T1 §2

Every block has a default tier from T1 §2.1 / §2.2 / §2.3. S3 component registry mirrors this assignment per block-spec. Sub-agent reads tier from block-spec before any work begins.

### 4.2 Promotion via modifier flags (A3 binding — marquee mechanism)

**A3 — Marquee fullwidth tier-promotion (LOCKED, S5 owns):**

Single block-spec lives at `S3 registry → .ts-marquee` (T1 §2.2 #61). Sandbox markup includes:

```html
<main id="block-slot" data-block="marquee" data-block-tier="molecular">
  <div class="ts-marquee-container" data-fullwidth>...</div>
</main>
```

**Promotion rule (encoded in sub-agent workflow §7):**

1. Sub-agent inspects sandbox markup for `[data-fullwidth]` on the marquee root.
2. If `[data-fullwidth]` PRESENT → ALWAYS STRICT mode applies for THIS sandbox run only (G1–G15 active). Sub-agent re-classifies tier in console output: `tier:molecular → promoted:always-strict (data-fullwidth present)`.
3. If `[data-fullwidth]` ABSENT → tier remains STRICT per T1 default (G1–G12 active).
4. The block CSS file at `assets/css/next/components/marquee.css` contains BOTH variants in one file (idle marquee rules + `[data-fullwidth]` modifier rules that flip to viewport-span). The promotion applies to the sandbox audit gate set, not to the CSS file's structure.

**Why one block-spec, not two:** the marquee is conceptually one component. The fullwidth variant is a **layout modifier** (T1 §2.3 #119 = same selector + `.fullwidth` class chain). Splitting into two block-specs would duplicate the marquee animation code. The promotion mechanism elevates the gate stringency without duplicating the artifact.

### 4.3 Generalization (future modifier-based promotions)

Same pattern available to any block where a layout modifier exists:

| Block | Default tier | Modifier | Promoted tier | Owner |
|---|---|---|---|---|
| `.ts-marquee` | STRICT | `[data-fullwidth]` | ALWAYS STRICT | A3 (S5) |
| `.ts-surface-N` | PERMISSIVE | parent is `<section>` | ALWAYS STRICT | D6 LOCKED — but per D6 owner ruled to use **two block-specs** instead of dynamic promotion; this row is informational only |
| `.ts-parallax` | PERMISSIVE | parent is `<section>` | ALWAYS STRICT | tie-breaker rule 1 (T1 §1.4) — surfaces to S3 if needed |
| `.ts-glass` | PERMISSIVE | applied to layout-tier element | ALWAYS STRICT | T1 §2.1 #41 — surfaces to S3 if needed |

**Default policy:** new modifier-based promotions require S3 registry entry + owner approval at Gate 5 (or subsequent gate). The A3 marquee mechanism is the only Wave-2-time-locked instance.

### 4.4 Demotion (NEVER automatic)

A tier is never demoted automatically. Owner can demote a tier explicitly only:

- ALWAYS STRICT → STRICT: written owner directive in `docs/handoffs/_session-N-block-<name>-tier-override.md` with rationale.
- STRICT → PERMISSIVE: same, with stricter rationale; rare.

The directive is consumed by the sub-agent on the next dispatch for that block. No retroactive effect on prior commits.

═══════════════════════════════════════════════════════════════════════
## 5. Parity Check Definition — What Does "Parity Met" Mean
═══════════════════════════════════════════════════════════════════════

Per T2 §5 (parity-rig spec), parity comparison surface is `sandbox/_parity-rig.html` — an iframe loading `../toolskin-showcase/assets/css/toolskin.css` (read-only reference). The sandbox post-messages block markup; parity-rig iframe renders the OLD CSS against identical DOM.

### 5.1 Visual parity — two-criteria definition

**Parity = structural match AND visual identity match.**

| Criterion | What it checks | How (Sessions 1–N) | How (Sessions N+) |
|---|---|---|---|
| **Structural** | Layout, dimensions, spacing, radius, surface depth, state visual response | Manual side-by-side screenshot comparison via parity-rig | Automated pixel-diff via Playwright + pixelmatch |
| **Visual DNA** | Brand identity match — does it still LOOK like Toolskin (Rule 5) | Author judgment + reference to `expert-designer` + `typography-master` + `design-tokens-2.0` SKILL.md files | `_rebuild-design-dna.md` criteria (Wave 1.5 output) — extends G1 once landed |

**Wave 1.5 dependency (acknowledged):** until `_rebuild-design-dna.md` lands, visual DNA criterion is **author judgment fortified by Tier 1 skill consultation**. After Wave 1.5 lands, G1 extends with the DNA's specific criteria (heading axes, surface gradients, accent treatments, etc.). Sub-agents in Sessions 4+ check both criteria; pre-Wave-1.5 sessions rely on judgment + Tier 1 skills; post-Wave-1.5 sessions apply DNA criteria mechanically.

### 5.2 Structural pixel-diff bands

| Pixel-diff delta | PERMISSIVE | STRICT | ALWAYS STRICT |
|---|---|---|---|
| **<2%** | auto-pass | auto-pass | step-1 pass (further steps still owner-gated) |
| **2–5%** | HALT + STRICT review required (sub-agent flags promotion; owner decides single-shot continuation) | HALT + owner review (G11 includes diff annotation) | step fails; owner re-directs |
| **>5%** | HALT + escalate to council OR owner (§10) | HALT + escalate | HALT + escalate |

**Variance allowed without flag:**
- Font-smoothing differences across browsers (Mac vs Windows subpixel rendering).
- Sub-pixel rounding on 1px borders rendered at non-integer scales.
- CSS-engine differences on filter / blur / gradient interpolation.

**Variance NOT allowed (always flagged):**
- Color (any channel — `--ts-this-bg`, `--ts-on-surface`, accent variants).
- Spacing (margin / padding / gap).
- Radius.
- Layout structure (flex direction, grid track count, position scheme).
- Font family (Space Grotesk vs fallback).

### 5.3 Sessions 1–N: manual workflow

Sub-agent generates parity screenshots via:

1. Open `sandbox/<tier>/<block>/index.html` in headless browser (or owner's dev browser).
2. Click "Compare with v1" — parity-rig iframe loads, postMessage sends markup.
3. Capture side-by-side screenshot AND overlay (Alt+click) screenshot.
4. Save to `docs/handoffs/_session-N-block-<name>-parity/{side-by-side,overlay}-{idle,hover,active,focus,disabled}.png`.
5. Attach to G11 package.

### 5.4 Sessions N+: automated workflow

Once Playwright + pixelmatch integration lands (T2 §5.6 todo for Session N), the audit suite computes pixel-diff %, writes to `docs/handoffs/_session-N-block-<name>-parity/diff-report.json` with per-state delta values. PERMISSIVE auto-pass requires <2% on every captured state.

═══════════════════════════════════════════════════════════════════════
## 6. Audit Suite Per Tier
═══════════════════════════════════════════════════════════════════════

Every audit logs to `docs/handoffs/_session-N-block-<name>-audit.md` with one section per audit + verdict + raw output.

### 6.1 Audit matrix

| Audit | PERMISSIVE | STRICT | ALWAYS STRICT | Source / skill |
|---|---|---|---|---|
| **design-tokens-2.0** (in-house Tier 1) | Required | Required | Required | `.claude/skills/design-tokens-2.0/SKILL.md` (G8) |
| **ECC accessibility** | Required | Required | Required | `.claude/skills/accessibility/` (G9, WCAG 2.2 floor) |
| **ECC design-system Mode 2 (Audit)** | Required (with Toolskin filter list — see queue file `_session-1-rebuild-queue.md` §"SKILL PRIORITY HIERARCHY") | Required | Required | `.claude/skills/design-system/` — Mode 1 (Generate) OFF-LIMITS, Mode 3 (Slop) with allowlist |
| **ECC browser-qa** (render check) | Required | Required | Required | `.claude/skills/browser-qa/` — visual sanity on render |
| **APCA contrast verification** (S1 §8) | Required (block's token pairs only) | Required | Required | S1 §8 table; build-script output cross-referenced |
| **ECC code-tour** (cross-block consistency) | Optional (skip for pure atoms) | Required | Required | `.claude/skills/code-tour/` — checks the block CSS fits the surrounding cascade |
| **Designer audit (owner manual)** | Skip (PR review is owner manual already) | Required (part of G11 review) | Required (at every step) | Owner judgment + Tier 1 skill consultation |
| **Sandbox vs bundler order diff** (S4 enforcement) | Required (pre-commit hook will block at commit) | Required | Required | A1-Resolution Q3 — pre-commit hook + this audit double-check |
| **`@ts-deps:` header parse + topo-sort** (S4) | Required | Required | Required | A1-Resolution Q1 + Q3 |

### 6.2 Toolskin filter list for ECC design-system audit

(Reproduced from `_session-1-rebuild-queue.md` for sub-agent reference — do NOT flag these as audit failures:)

- Intentional gradients (chip strip edge-fade per `@taxonomy_chips_strip`, surface superposition).
- OKLCH-derived colors — apcach-derived per Rule 15, NOT "random hex values."
- Space Grotesk choice — brand display font, NOT "generic."
- Harmonic 1.125 ladder typography.
- Substring-distribution selectors WHERE intentional (cascade-sensitivity Rule 8 — `:is(...)` enumeration preferred but documented substring patterns allowed).
- Dark mode "completeness" — apcach derives both modes from same math by construction.

If ECC flags any of the above as a finding, sub-agent annotates the audit report: `Filter-list-suppressed per Rule 15 / Rule 9 / Rule 8` and does NOT halt.

### 6.3 Audit log format

```
# Block audit — <block-name> (Session N)
Tier: <permissive|strict|always-strict>
Date: <ISO>
Sub-agent: <model-id>

## G1 Parity threshold
Verdict: PASS | FAIL
Pixel-diff delta: <%>
Screenshots: <paths>

## G2 APCA contrast
Verdict: PASS | FAIL
Pairs verified: <count>
Failures: <list with token-pair + Lc + floor>

## G3 No raw color values
Verdict: PASS | FAIL
Offending lines: <list>

[... G4–G15 as applicable per tier]

## Council deliberation (if invoked)
Voices: <ARCHITECT | DESIGN SKEPTIC | PRAGMATIST | DESIGN CRITIC>
Outcome: <consensus | dissent — owner decision required>
Full transcript: <path>

## Final verdict
<PASS — open PR | HALT — owner review | STEP-1-OK — owner approves step 2>
```

═══════════════════════════════════════════════════════════════════════
## 7. Block Sandbox Workflow Per Tier (step-by-step)
═══════════════════════════════════════════════════════════════════════

### 7.1 PERMISSIVE workflow (atomic block, target 15–30 min)

1. **Read block-spec** from S3 component registry (`docs/handoffs/_rebuild-component-registry.md` + per-block `block-spec.md` files for the first 5 atomic blocks; subsequent blocks generate spec from registry entry).
2. **Read minimum upstream** (per §8 context-budget discipline): block-spec only + `sandbox/_base.html` + `assets/css/next/components/<block-name>.css` scaffold if it exists. Do NOT load every Wave 1 / Wave 2 spec.
3. **Copy** `sandbox/_base.html` → `sandbox/01-atomic/<block-name>/index.html`.
4. **Apply T2 §8.3 delta** (≤6 edits): `<title>`, `<link>` to component CSS, `<main>` contents, `data-block`, `data-block-tier="atomic"`, optional asset-path-prefix.
5. **Write** `assets/css/next/components/<block-name>.css`:
   a. First line: `/* @ts-deps: <comma-separated deps> */` (G7).
   b. Layer 1 properties (S2 §2.3 — declared once with `--ts-this-*` token references).
   c. State declarations per S2 §7.1 if interactive (G6); else only idle state.
   d. Zero `!important`, zero raw color values (G3, G4).
6. **Run audit suite** (§6) — all five required audits for PERMISSIVE.
7. **Generate parity screenshots** — idle (always); hover/active/focus/disabled if interactive.
8. **Evaluate G1–G10:**
   - ALL pass → push branch `rebuild/block-<name>-S<session>`, open PR with audit pack + screenshots + `tier:permissive` label, tag owner, write summary to `docs/handoffs/_session-N-block-<name>-pr-summary.md`, exit.
   - ANY fail → write `docs/handoffs/_session-N-block-<name>-halt.md` with failing gate verbatim + reproduction notes, exit without push.

### 7.2 STRICT workflow (molecular block, target 30–60 min sub-agent + owner)

Steps 1–7 identical to PERMISSIVE (with `02-molecular/` sandbox path + `data-block-tier="molecular"`).

8. **Evaluate G1–G10:**
   - ANY fail → halt (same as PERMISSIVE).
   - ALL pass → proceed to G11.
9. **G11: package the review artifact** — assemble `docs/handoffs/_session-N-block-<name>-review.md` per §3.2 G11 contents (diff + screenshots + audit outputs + council if invoked + open questions + APCA verification).
10. **G12: HALT, no commit, no PR.** Post summary to owner notification channel + path to G11 package. Exit.
11. **Owner returns** with one of:
    - "Ship it" → sub-agent re-dispatched (or same session resumed) to commit + open PR.
    - "Fix X" → sub-agent loops back to step 5–10 with the fix.
    - "Drop it" → sub-agent stashes in `docs/handoffs/_session-N-block-<name>-stash.md` for later.

### 7.3 ALWAYS STRICT workflow (layout block, target 45–90 min with owner at every step)

Steps 1–3 identical (sandbox path = `03-layout/`, `data-block-tier="layout"`).

4. **Owner-approval step 1 — CSS STRUCTURE:**
   - Sub-agent writes ONLY: `@ts-deps:` header + Layer 1 properties (single declaration set per S2 §2.3) + token wiring (`--ts-this-bg`, surface re-scope if applicable).
   - No states, no responsive, no integration logic yet.
   - Sub-agent surfaces every fork to owner with council deliberation (G15) attached.
   - Owner approves OR redirects OR halts.
5. **Owner-approval step 2 — STATES + INTERACTIONS:**
   - If interactive: declare all 5 states per S2 §7.1 (G6).
   - If non-interactive: skip; sub-agent confirms idle-only intent.
   - Sub-agent runs partial audit suite (G2, G3, G4, G5, G6 if applicable).
   - Owner approves step before step 3 begins.
6. **Owner-approval step 3 — RESPONSIVE + ADAPTIVE INTEGRATION:**
   - Apply responsive variants per S2 typography axes + T3 §7 verification (static HTML / WordPress / React / Vue / AI / Tailwind coexist as relevant for this block).
   - Run full audit suite (§6 ALWAYS STRICT row).
   - Generate parity screenshots at multiple viewport widths (mobile / tablet / desktop).
7. **G11 package** with all three step-approvals logged, council deliberation transcripts, full screenshot set.
8. **G12: HALT until owner says "ship it"** even after step 3 audit pass.
9. **Commit + PR** with `tier:always-strict` label.

═══════════════════════════════════════════════════════════════════════
## 8. Context-Budget Discipline (ECC `context-budget` skill binding)
═══════════════════════════════════════════════════════════════════════

Directly addresses the 96% context-disaster pattern observed in prior Toolskin sessions (sub-agents loading every spec + every reference + every audit skill → context exhausted before any productive work).

### 8.1 Hard rules

1. **Sub-agents monitor context budget at every turn.** When usage reaches **70%** of the session window, sub-agent **HALTS** at the next safe checkpoint (end of current step in workflow), writes a state-handoff to `docs/handoffs/_session-N-block-<name>-handoff.md`, and **requests fresh dispatch**.
2. **Read MINIMUM necessary upstream.** Each block sandbox session reads:
   - Block-spec for THIS block (from S3 registry).
   - `sandbox/_base.html` (the template).
   - This block's existing component CSS if any (the scaffold from S3 first-5-blocks sketches).
   - **NOT** every Wave 1 / Wave 2 spec. The toolskin-architecture skill (Phase E) holds the rebuild's authoritative summary inline + references for on-demand load.
3. **No bulk loading of `../toolskin-showcase/assets/css/toolskin.css`** (34,413 lines). Sub-agents use `Grep` with targeted patterns or `Read` with specific offset/limit. The block-spec from S3 should pre-extract the relevant rules verbatim.
4. **No bulk loading of multi-thousand-line specs.** Use `Grep` for the section header, then `Read` with `offset` + `limit` for the specific section.
5. **Audit suite output is summarized in the audit log; raw audit transcripts are NOT held in context** — sub-agent writes them to disk + cites paths.

### 8.2 Pre-flight context budget check

Sub-agent at dispatch:

1. Tallies expected reads (block-spec lines + `_base.html` lines + scaffold lines + reference snippets needed).
2. If estimated >40% of session window before any productive work → sub-agent flags to owner: "context risk — recommend splitting block into two dispatches" rather than starting.
3. Owner decides: split, defer, or accept risk.

### 8.3 Mid-flight discipline

- **Never re-read a file already in context.** Use the harness's file-state cache.
- **Never re-grep a pattern already searched.** Cite prior tool result.
- **Reading >500 lines of a spec to grab one section** = workflow violation. Use targeted offset/limit.

### 8.4 Context-budget audit

After every block, the audit log includes a context-budget line: `Context-budget at completion: <%>`. Pattern detection over 5+ blocks: if average >65%, S5 protocol revision required (split workflow into smaller dispatches OR slim block-specs).

═══════════════════════════════════════════════════════════════════════
## 9. Council Invocation Rule (ECC `council` + Gate 4.5 upgrade)
═══════════════════════════════════════════════════════════════════════

### 9.1 When council is invoked per tier

| Tier | Council invocation |
|---|---|
| **PERMISSIVE** | **Never auto-invoke.** Atomic blocks have one canonical path (per S2 §7.1 + S3 block-spec). If sub-agent thinks it sees a fork, that's a signal the block is misclassified — halt + surface to owner. |
| **STRICT** | **Conditional.** If >1 valid architectural path emerges (e.g., chips-strip overflow handling: cube transform vs flex-wrap; modal positioning: position:fixed vs portal-style transform), invoke council BEFORE halting at G11. Council output included in G11 package. |
| **ALWAYS STRICT** | **REQUIRED at every architectural fork** (G15 enforces). No fork resolves without council deliberation first. |

### 9.2 Upgraded voices for visual decisions (Gate 4.5 LOCK)

For any council invocation involving VISUAL / AESTHETIC / IDENTITY / BRAND / USER-PERCEPTION dimensions, the standard 4 voices upgrade per the Gate 4.5 lock in `_session-1-rebuild-queue.md`:

1. **ARCHITECT** (same — proposes solution).
2. **DESIGN SKEPTIC** (replaces generic Skeptic): challenges from visual design perspective; **MUST** read `expert-designer` SKILL.md + `typography-master` SKILL.md + `design-tokens-2.0` SKILL.md + `_rebuild-design-dna.md` (once Wave 1.5 lands) before responding; counter-proposals honor design DNA not generic heuristics.
3. **PRAGMATIST** (same — shipping reality, plus "what does the user SEE?").
4. **DESIGN CRITIC** (replaces generic Critic): audits against all 15 Rules INCLUDING Rule 5 (drop-in identity preservation); audits against design DNA; failure modes ranked by VISUAL severity; asks "If we ship this, will it still LOOK like Toolskin?"

**Default to upgraded voices** unless decision is PURELY structural (e.g., file path conventions, build pipeline mechanics with no visual impact). Examples PURELY structural: `@ts-deps:` header ordering, topo-sort tie-break. Everything component-CSS-touching = upgraded voices.

### 9.3 Council output handling

- **Consensus** → orchestrator may proceed; sub-agent records consensus + minor dissent in G11.
- **Substantive disagreement** → orchestrator HALTS, surfaces disagreement to owner, waits for owner call, encodes owner resolution as binding input.

This is the binding **procedural correction** from Appendix A1-Resolution: council is INPUT to owner decision, not orchestrator auto-resolve.

### 9.4 Council artifact

Every council invocation produces `docs/handoffs/_session-N-block-<name>-council.md` with: prompt, voice outputs verbatim, orchestrator synthesis, dissent flagged, owner directive received (if applicable). Linked from G11 package.

═══════════════════════════════════════════════════════════════════════
## 10. Failure Modes + Escalation
═══════════════════════════════════════════════════════════════════════

| Trigger | Tier(s) | Response |
|---|---|---|
| Any gate G1–G10 fails | All | HALT at the failed gate. Write `docs/handoffs/_session-N-block-<name>-halt.md`. Exit. Owner picks up. |
| New issue not covered by gates | All | HALT + surface to owner. New gate proposal goes into `docs/handoffs/_session-N-protocol-revision-proposal.md` for next protocol-revision pass. Never improvise (Rule 11). |
| Parity-rig >5% pixel diff with no obvious cause | All | HALT + escalate to ECC `council` (upgraded voices). If council outputs disagreement, owner decides. If council reaches consensus on cause + fix path, sub-agent re-runs with the fix; if still >5%, halt + owner. |
| Repo isolation violation attempt (write to `../toolskin-showcase/**`) | All | **IMMEDIATE HALT.** S6 refusal pattern fires. Sub-agent does NOT retry. Owner directs recovery. (Per File 07 binding — non-overridable.) |
| Rule 15 violation attempt (raw hex / non-apcach color value introduced) | All | IMMEDIATE HALT. S6 pre-commit hook blocks at commit; this protocol's G3 catches at audit. |
| Rule 13 violation attempt (Node runtime dep introduced to shipped artifact) | All | IMMEDIATE HALT. S6 refusal pattern fires. |
| Owner-manual edit between sub-agent runs (Rule 10) | All | Sub-agent acknowledges edit, NEVER reverts. Surfaces in next dispatch summary. |
| Council substantive disagreement | STRICT, ALWAYS STRICT | HALT + surface to owner. (Per Appendix A1-Resolution procedural correction.) |
| Context budget exceeds 70% | All | HALT at next safe checkpoint. Write state-handoff. Request fresh dispatch (per §8.1). |
| Time-box exceeded | All | HALT + report. Never silently extend (per §11). |
| `@ts-deps:` header missing or unparseable | All | G7 fails → HALT. S4 pre-commit hook also catches at commit. |
| Sandbox `<link>` order disagrees with bundler topo-sort | All | Audit suite "sandbox vs bundler order diff" fails → HALT. S4 pre-commit hook catches at commit (A1-Resolution Q3). |

### 10.1 Halt report format

`docs/handoffs/_session-N-block-<name>-halt.md`:

```
# Halt report — <block-name> (Session N)
Tier: <permissive|strict|always-strict>
Failed gate(s): <G1, G3, etc.>
Sub-agent: <model-id>
Halt timestamp: <ISO>

## Failure details
<verbatim audit output for failed gate>

## Reproduction
<exact steps + file paths>

## Sub-agent's recommendation
<what owner could do — never autonomous action>

## Files written so far
<list of files created/modified up to halt point>

## Context-budget at halt
<%>
```

### 10.2 No silent extensions

Never extend the time-box silently. Never auto-retry a halt. Never override a refusal pattern. The cost of stopping is minutes; the cost of improvising is months (Rule 11).

═══════════════════════════════════════════════════════════════════════
## 11. Time-Box Per Block
═══════════════════════════════════════════════════════════════════════

| Tier | Time-box | Includes |
|---|---|---|
| **PERMISSIVE** (atomic) | 15–30 min | Sub-agent dispatch → PR open. Owner reviews PR next morning (async, outside time-box). |
| **STRICT** (molecular) | 30–60 min sub-agent | Sub-agent dispatch → G11 package + halt. Owner review window (typically 5–15 min) is separate. |
| **ALWAYS STRICT** (layout) | 45–90 min | Sub-agent + owner combined across 3 steps. Owner active at every step. |

**Hard rule:** time-box exceeded → HALT + report + state-handoff to `docs/handoffs/_session-N-block-<name>-handoff.md`. Never silently extend. Re-dispatch with reduced scope or owner-approved extension.

**Time-box discipline rationale:** prevents the "one more tweak" pattern that historically dragged Toolskin sessions to context exhaustion. A block that won't fit its time-box is a block that needs splitting (atomic → 2 atomics, molecular → atomic + molecular composition, layout → owner reset).

═══════════════════════════════════════════════════════════════════════
## 12. Session Sequencing Recommendation
═══════════════════════════════════════════════════════════════════════

Recommended trajectory after Session 1 commits:

| Session | Scope | Tier dispatch | Output |
|---|---|---|---|
| **Session 2** | Primitives implementation (per `_rebuild-primitives-spec.md`) + system layer implementation (per `_rebuild-system-spec.md`) | Semi-autonomous — single sub-agent runs against locked S1 + S2 specs, owner reviews PR | `assets/css/next/primitives/*.css` + `assets/css/next/system/*.css` + `tools/color-engine/generate-colors.js` + `dist/colors-contrast-report.md` |
| **Session 3** | Foundation blocks (color-lab, type-scale, surface-grid) at `sandbox/00-foundation/` | Single sub-agent, owner reviews PR | Foundation sandboxes that prove primitives + system render correctly |
| **Session 4** | **First 5 atomic blocks** per S3 sketch block-specs — `.ts-btn`, `.ts-input`, `.ts-chip`, `.ts-checkbox`, `.ts-badge` (S3 picks) — PERMISSIVE | Parallel-eligible: 2–3 sub-agents in parallel, each owns 1–2 blocks | 5 atomic block sandboxes + component CSS + PR(s) |
| **Sessions 5–N** | Remaining ~39 atomic blocks, parallelized 2–3 per session | PERMISSIVE | One PR per block, owner reviews next morning |
| **Sessions N+** | Molecular blocks ONE AT A TIME (concurrency violates STRICT halt-for-owner discipline — parallel would create approval contention) | STRICT | One block per dispatch; owner reviews G11; commit on "ship it" |
| **Sessions NN+** | Layout blocks ONE AT A TIME | ALWAYS STRICT | Owner at every step; 3-step approval per block |

### 12.1 Why this ordering

- **Primitives + system FIRST** — every block depends on `--ts-this-*` derivative chain + apcach-derived primitives. Building blocks before primitives = guaranteed rework.
- **Foundation blocks SECOND** — proves the primitives + system actually render before downstream blocks consume them. Catches Rule 15 violations early.
- **Atomic THIRD** — fastest tier; parallel-eligible; PR review cadence proves the protocol.
- **Molecular FOURTH** — slower; requires owner halt-cycles; serial pace prevents approval contention.
- **Layout LAST** — slowest; owner-at-every-step; deferred so they consume mature primitives + atomic blocks.

### 12.2 Parallel-eligibility rules

| Tier | Parallel-eligible | Constraint |
|---|---|---|
| PERMISSIVE | YES, up to 3 sub-agents per session | Each block must have non-overlapping `@ts-deps:` to avoid CSS merge conflicts; S4 build pipeline handles topo-sort |
| STRICT | NO | Owner review is sequential; parallel creates contention |
| ALWAYS STRICT | NO | Owner steps are sequential per block |

═══════════════════════════════════════════════════════════════════════
## 13. Open Questions + Gaps
═══════════════════════════════════════════════════════════════════════

- `[ ] gap: Wave 1.5 Design DNA output → G1 visual-identity criterion extension.` Once `_rebuild-design-dna.md` lands, this spec must be revised to encode DNA-specific criteria into G1's "visual DNA" sub-criterion. Currently G1 uses "author judgment + Tier 1 skill consultation" as proxy until DNA lands.
- `[ ] gap: Playwright + pixelmatch integration timeline.` T2 §5.6 says automated image-diff is Session N+. S5 protocol assumes manual screenshots Sessions 1–N. Owner approval needed on automation date — affects whether PERMISSIVE auto-progress is truly autonomous or owner-screenshot-review-gated.
- `[ ] gap: First-5 atomic block tier overrides.` S3 may emit block-specs that prove an atomic block needs STRICT for first-pass calibration. Owner directive in S3 registry overrides T1 §2.1 default per block.
- `[ ] gap: Composition sandbox handling.` Per T2 §6.5, compositional blocks (card containing button) load multiple `components/<name>.css` files in dependency order. S4 build-pipeline owns load-order resolution; this protocol's G7 + audit suite enforce header accuracy but composition-specific gates are deferred to S4 spec landing.
- `[ ] gap: UIKit aliasing (T1 §8.6, A6 → S3).` If S3 collapses `.ts-ui-checkbox-group` into the core `.ts-checkbox-group` block-spec, this protocol applies to one block-spec. If S3 emits two block-specs, this protocol applies to each independently. No protocol change either way.
- `[ ] gap: A1 sandbox-vs-bundler order diff implementation.` A1-Resolution Q3 says S4 owns topo-sort + S6 owns hook; S5 audit suite cites the "sandbox vs bundler order diff" check (§6.1) but doesn't define algorithm. S4 + S6 deliver; this audit consumes their parser module per A1-Resolution.
- `[ ] gap: Light-mode threshold tuning for `--ts-on-surface`.` S2 §5.2 deferred to first foundation block. S5 protocol's G2 (APCA contrast) consumes whatever S1 + S2 produce; no protocol change required, but Session 3 foundation block sandboxes likely surface this for owner ratification.
- `[ ] gap: Status-color audit pairs (S1 §8.5).` Session 2+ scope. Audit suite gains pairs as status-color primitives land.

═══════════════════════════════════════════════════════════════════════
## 14. Contact Points
═══════════════════════════════════════════════════════════════════════

| Sub-agent / artifact | Interface with S5 |
|---|---|
| **S3 — Component Registry** | Provides tier per block (T1 §2 → S3 registry). S5 protocol reads tier from registry at dispatch. If S3 emits per-block overrides (e.g., `tier: atomic-but-first-pass-strict`), S5 honors. First-5 atomic block-specs (S3 deliverable) feed Session 4 PERMISSIVE workflow. |
| **S4 — Build Pipeline** | Owns `@ts-deps:` parser (A1-Resolution Q1 + Q3). S5's G7 audit consumes S4's parser. Owns topo-sort; S5's "sandbox vs bundler order diff" audit consumes S4's topo-sort output. Owns per-block file emission (A1-Resolution Q2) and `dist/toolskin.css` commit policy (Q4). |
| **S6 — Repo Governance + Refusal Patterns** | Encodes G3 + G4 + repo-isolation + Rule 13 + Rule 15 violations as refusal patterns in toolskin-architecture skill. Writes pre-commit hook that double-checks G3 + G4 + `@ts-deps:` + sandbox-vs-bundler-order at commit. **Shares S4's parser module** for `@ts-deps:` per A1-Resolution. Owns CONTRIBUTING.md content. |
| **Wave 1.5 — Design DNA Extractor** | Outputs `_rebuild-design-dna.md` after Wave 2 specs land. Extends G1 visual-identity criterion + extends upgraded council voices' input data. |
| **ECC `council`** | Invoked per §9. Upgraded voices (Gate 4.5) for any visual decision. |
| **ECC `context-budget`** | Backs §8 discipline. Sub-agents may invoke `/context-budget` mid-session to verify they're under threshold. |
| **ECC `architecture-decision-records`** | Used to format any architectural fork decisions emerging from council into ADRs (stored at `docs/decisions/<NNNN>-<title>.md`). Per ALWAYS STRICT G15, every fork's owner resolution generates an ADR. |
| **In-house Tier 1 skills (`design-tokens-2.0`, `expert-designer`, `typography-master`)** | Consulted at every audit. Upgraded-voice council members read these before responding. Override external skill flags per file 05 Tier 1 priority. |
| **Sessions 4+ block sandbox dispatches** | Execute against this protocol. Every sub-agent dispatch reads this file. Every block sandbox produces audit logs + halt reports + G11 packages keyed to this protocol's gate IDs. |

═══════════════════════════════════════════════════════════════════════
## 15. Status + Sign-Off
═══════════════════════════════════════════════════════════════════════

**Spec status:** PROPOSED — Wave 2.3 deliverable, time-boxed 25 min.

**Coverage:**
- §1 Scope: COMPLETE — S5 produces, S6 enforces, Sessions 4+ execute
- §2 Three tiers formal definitions: COMPLETE — T1 §2 binding
- §3 Gates per tier: COMPLETE — G1–G10 PERMISSIVE, +G11–G12 STRICT, +G13–G15 ALWAYS STRICT
- §4 Tier promotion + A3 marquee mechanism: COMPLETE — `[data-fullwidth]` modifier promotes STRICT→ALWAYS STRICT for the sandbox run
- §5 Parity check definition: COMPLETE — structural pixel-diff bands + visual DNA hook for Wave 1.5
- §6 Audit suite per tier: COMPLETE — 9 audits matrixed, filter list cited
- §7 Workflow per tier: COMPLETE — step-by-step PERMISSIVE / STRICT / ALWAYS STRICT
- §8 Context-budget discipline: COMPLETE — 70% halt threshold + minimum upstream rule + ECC skill backing
- §9 Council rule: COMPLETE — invocation per tier + upgraded voices Gate 4.5 lock + procedural correction
- §10 Failure modes + escalation: COMPLETE — 13 triggers + halt-report format
- §11 Time-box per block: COMPLETE — 15/30/45–90 min hard rule
- §12 Session sequencing: COMPLETE — Session 2 primitives, 3 foundation, 4 first-5 atomics, 5–N atomics parallel, N+ molecular serial, NN+ layout
- §13 Open questions: 8 gaps flagged
- §14 Contact points: COMPLETE — interfaces with S3, S4, S6, Wave 1.5, ECC skills, Tier 1 skills, Sessions 4+

**Rule honoring:**
- Rules 1–15: honored throughout. Rule 11 (halt on anomaly) is the spec's backbone. Rule 15 (apcach supremacy) gates G2 + G3. Rule 13 (no runtime deps) gates §10 escalation row. Rule 12 (repo isolation) gates §10 immediate-halt row.
- Repo isolation (file 07): all spec writes inside `toolskin-rebuild/`; reads from `../toolskin-showcase/` are owner-of-block-spec problem (S3), not S5 problem.
- Tier hierarchy (file 05): Tier 1 in-house authority preserved in §6.2 filter list and §9.2 upgraded-voice reading list. ECC skills consumed at Tier 3/4/5 levels per their bucket.

**Conflict with external skills:** none triggered in this spec scope. If ECC `design-system` Mode 2 audit flags a Toolskin intentional pattern from §6.2 filter list, sub-agent suppresses per filter list — not a Rule 15 violation, an audit-tooling adjustment.

**Status code:** `DONE`

═══════════════════════════════════════════════════════════════════════
## Footer — Conflicts with external skill flags (per file 06 / Rule 15)
═══════════════════════════════════════════════════════════════════════

None in this deliverable. S5 produces governance + workflow protocol; no color values, no token definitions, no component CSS. Rule 15 binding flows through downstream artifacts (block CSS files audited via G2 + G3) but no Rule 15 surface area inside this spec itself.

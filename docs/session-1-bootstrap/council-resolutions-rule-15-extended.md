═══════════════════════════════════════════════════════════════════════
COUNCIL RESOLUTIONS + VISUAL AUDIT INSERTION — CONSOLIDATED OWNER REPLY
═══════════════════════════════════════════════════════════════════════

Multiple decisions consolidated from this chat. All 3 council fundamental implications resolved + Extended Rule 15 + Pattern 16 added + NEW Pattern 17 (visual audit before specs) + NEW Wave 1.6 (browser visual audit) inserted BEFORE Phase E. Phase E does NOT proceed until Wave 1.6 lands and owner annotates the visual audit.

═══════════════════════════════════════════════════════════════════════
RESOLUTION #1 — D2 ↔ D8 light mode (OPTION D — REFRAME, not architectural choice)
═══════════════════════════════════════════════════════════════════════

NONE of the council's Options A/B/C apply. The framing of the implication was wrong.

**Root cause:** The Wave 1.5 §C7 mixing constants (14% / 6% / 32%) being labeled "dark-tuned" reveals a spec bug — they should NEVER have been hand-tuned per-theme to begin with. They should be derivative outputs of the apcach color engine + OKLCH inversion + surface superposition math, recomputed automatically under whichever theme is active.

**The smart color system is the answer to the implication, not a victim of it.** Both Path B AND Path A consume the SAME apcach-driven engine output. Light mode under `setTheme('light')` re-applies the same mathematical derivation with inverted lightness primitives. Every derivative re-resolves correctly because the system is mathematical, not hand-tuned.

**Spec amendments required (binding for S1 + S2 + Wave 1.5):**

1. **S1 spec amendment:** ALL mixing constants, surface contrast adjustments, OKLCH inversions, and derivative-chain percentages are apcach-engine-derived outputs, not hardcoded values. No primitive declares a fixed-percentage mixing constant that won't auto-recompute under theme inversion.

2. **S2 spec amendment:** The `--ts-this-*` derivative chain consumes apcach engine output exclusively. Any rule that currently hardcodes a percentage for surface mixing (`color-mix(in oklch, var(--ts-this-bg) X%, ...)`) is REJECTED — the X% must come from a token that the engine recomputes per-theme.

3. **Wave 1.5 §C7 amendment:** The "14% / 6% / 32% mixing constants documented as load-bearing" entry is REWRITTEN to document the mixing constants as engine-derived outputs whose CURRENT measured values happen to be those percentages in dark mode — NOT as authoritative hardcoded constants.

**Why this matters (owner intent verbatim):**

> "The core theme responds initially to a dark theme, and the smartest and most accurate way to turn the theme to light mode should avoid any hardcoding from the theme further in light mode, keeping the concept aligned with the strength of the color auto system and the surface contrast auto system, where the user can bend the contrast ratio and the palettes from the base tints that we have selected on Surface Labs presets as reference for good, handpicked, default pre-established color sets.
>
> The rest must be auto-generated along with the smart color system, and the auto-nested alternative surface system to ensure an ever-working, perfect contrast ratio on background, border, and font for all assets on any element (section > panel > card > input, and all the other rules that should have been considered in the requirements for the smart system we should provide in this product).
>
> All of this is referenced in the Toolskin design system but never fully consolidated. They all involve the accent system, the on-accent system, the on-surface, the background, the OKLCH inversion, and obviously everything working with the APCACH color engine behind to ensure everything works under the least amount of rules possible, using just tokens that drive only design decisions over which color to use, never deciding how much amount of what to use anywhere, as that is set by the core engine or the core assets design settings layer tokens."

═══════════════════════════════════════════════════════════════════════
RULE 15 EXTENSION (BINDING — UPDATE EVERYWHERE)
═══════════════════════════════════════════════════════════════════════

The original Rule 15 said: "apcach is the supreme color authority."

**Extended Rule 15:**

> apcach (antiflasher/apcach, MIT, Evil Martians) is the supreme color authority for the ENTIRE color derivation chain — including primitives, mixing constants, surface contrast adjustments, OKLCH inversions, nested alternative surface awareness, accent/on-accent/on-surface auto-derivation, and theme inversion (dark ↔ light).
>
> NO color value, mixing percentage, contrast adjustment, or surface-aware derivative may be hand-tuned per-theme. The smart color system + surface contrast auto-system + auto-nested alternative surface system are the FOUNDATIONAL constraints — drawn from prior Toolskin work + Surface Labs initial structure — now consolidated and adapted to apcach as the unified engine.
>
> Tokens drive ONLY design decisions (which color to use). The engine handles amount/percentage decisions (how much of what). No spec may invert this — any spec that puts amount-decisions in tokens or design-decisions in the engine is REJECTED.
>
> Surface Labs presets define handpicked default color sets as the BASE TINTS the engine derives from. Consumer can "bend the contrast ratio and the palettes from the base tints" — that bending is engine-mediated, never via hand-tuned override constants.
>
> Theme inversion (dark → light or light → dark) re-runs the same engine math with inverted lightness primitives. No separate hand-tuned theme tables. No per-theme mixing constants. No theme-specific derivative overrides.

**Where this gets encoded:**

1. `docs/handoffs/_session-1-orchestrator-synthesis.md` — append "Extended Rule 15" as a new section after the council appendix
2. Phase E `toolskin-architecture/SKILL.md` §2 (15 CONVERSATION RULES verbatim) — update Rule 15 from short form to extended form above
3. `docs/handoffs/_in-house-skills-update-todo.md` — add task: update `design-tokens-2.0` skill to reference Extended Rule 15 + Surface Labs presets as base tints
4. S1 + S2 + Wave 1.5 spec amendments (above) reference Extended Rule 15 as authority for the amendments

═══════════════════════════════════════════════════════════════════════
RESOLUTION #2 — Dual-emission sRGB fallback — YES, mandate locked
═══════════════════════════════════════════════════════════════════════

Every primitive declaration in `assets/css/next/primitives/colors.css` MUST ship dual-emission cascade fallback:

```css
--ts-bg-body: #0c0d0f;          /* sRGB fallback for legacy browsers */
--ts-bg-body: oklch(0.18 0.012 250);  /* canonical OKLCH for modern browsers */
```

apcach build script `tools/color-engine/generate-colors.js` emits BOTH via `apcachToCss()` + `culori.formatHex()`. Mandatory in S1 spec, NOT optional.

**Refusal pattern R-D3-dual-emit** (add to S6 governance):
- Sub-agents emitting `oklch(...)` declarations WITHOUT paired sRGB fallback in the same rule block → halt at pre-commit
- Pre-commit hook check #12 added: parse all `--ts-*` declarations in `assets/css/next/primitives/*.css`, verify each color primitive has both sRGB and oklch entries

Browser support documented in `dist/README.md`: Modern (Chrome 111+, Safari 16.4+, Firefox 113+) gets OKLCH; legacy (Safari 16.3 and below, Firefox 112 and below, enterprise locked browsers) gets sRGB hex fallback automatically via CSS cascade — zero runtime polyfill, zero Rule 13 violation, zero bundle penalty.

═══════════════════════════════════════════════════════════════════════
RESOLUTION #3 — Space Grotesk 800 weight — OPTION A locked
═══════════════════════════════════════════════════════════════════════

Variable-axis font loading: `wght@300..900` (~100KB single file).

**S1 spec amendment:**
- Font loading URL MUST include the 800 axis. Use Google Fonts variable-axis URL `https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300..900&display=swap` OR self-host variable woff2.
- `font-display: swap` mandatory.
- Metric-compatible fallback (Fontshare Space Grotesk Fallback or system fallback) declared to prevent FOIT on H2 flash.

**Verification at Phase E (mandatory before Phase F commit):**
- Open the `dist/README.md` font loading example in a test browser
- DevTools → Network → verify the loaded font file response includes axis range `wght 300 900` OR the explicit `;800;` static weight
- If neither present → halt, fix URL, retest

**Refusal pattern R-OQ-B3** (add to S6):
- Sub-agents proposing weight rounding (700/900) for H2/`.ts-section-title` halt per Rule 2 + G6 (synthetic faux-bold forbidden)
- Sub-agents proposing static-weight loading without 800 in the static list halt

═══════════════════════════════════════════════════════════════════════
PATTERN 16 ADDED TO REBUILD-ORCHESTRATION SKILL
═══════════════════════════════════════════════════════════════════════

The `rebuild-orchestration` skill currently authored in chat (Session 1.5 install) adds:

## Pattern 16 — Council HALT on fundamental implications surfaced (binding)

When ECC council deliberation surfaces a FUNDAMENTAL IMPLICATION that was missed at the prior owner gate — not minor refinement, but architectural concern that would affect downstream specs or shipped behavior — orchestrator MUST:

1. **HALT** before dispatching any consumer (Phase E, next sub-agent, etc.)
2. **Classify the implication explicitly:** is it (a) a downstream spec amendment, (b) an architectural choice the owner missed, or (c) a redirect that reframes the original question?
3. **Surface to owner** with classification + recommended resolution + alternative options
4. **Wait for owner decision** before encoding ANY of the council's elaborations into downstream specs or skill content
5. **Document the resolution** in the orchestrator synthesis as binding input

This pattern emerged Session 1 Gate 5 council. The council surfaced 3 fundamental implications:

- One was a downstream spec amendment (D3 dual-emission sRGB fallback — owner approved mandate)
- One was an architectural choice missed (OQ-B3 Space Grotesk 800 loading — owner picked variable-axis)
- **One was a redirect** (D2 ↔ D8 light mode — owner reframed: "smart color system handles this mathematically, mixing constants should NEVER have been hand-tuned per-theme, this is a spec amendment to S1/S2 not a Gate 5 architectural choice")

The third case is the most important. Council can surface implications that reveal the QUESTION ITSELF was framed wrong. Orchestrator must accept owner redirects as valid resolutions — the smart color system, surface superposition, and apcach engine are FOUNDATIONAL constraints that supersede tactical "pick A or B" framings.

**Companion to Pattern 8 (Surface unresolved disagreements):**
- Pattern 8 handles council voices DISAGREEING with each other
- Pattern 16 handles council voices AGREEING that a fundamental was missed
- Both halt for owner. Neither auto-resolves.

═══════════════════════════════════════════════════════════════════════
NEW GAP — VISUAL DESIGN AUDIT MISSING (HALT BEFORE PHASE E)
═══════════════════════════════════════════════════════════════════════

Owner caught a fundamental gap on review: **no agent has actually viewed a rendered pixel of the existing Toolskin design system.**

All Session 1 work — T1/T2/T3/S1/S2/S3/S4/S5/S6 + Wave 1.5 design DNA + Gate 5 council Design Skeptic + Design Critic — read CSS TEXT, HTML TEXT, and skill TEXT. Zero actual browser rendering observation.

This contradicts the owner's April 27 binding principle: *"my eye was the source of truth, not the math."*

The Wave 1.5 design DNA, framed as "closing the visual identity gap," was a code-text extraction. The council Design voices audited specs based on the same text-derived DNA — blind voices auditing blind specs.

**Risk if not fixed:** rebuild ships architecturally clean, mathematically correct, visually generic or visually wrong. The 3-month Toolskin disaster history shows multiple math-correct/visual-wrong outcomes (`--ts-on-accent` regression where dark text rendered on dark accent; FontAwesome version silent failure; typography canonicalization that broke visual hierarchy). All caught by owner's eye, none caught by code analysis.

═══════════════════════════════════════════════════════════════════════
WAVE 1.6 INSERTED — BROWSER VISUAL AUDIT (MANDATORY BEFORE PHASE E)
═══════════════════════════════════════════════════════════════════════

Halt Phase E. Insert Wave 1.6 between Gate 5 council resolution encoding and Phase E skill build. Phase E does NOT proceed until Wave 1.6 lands and owner annotates the visual audit.

## Wave 1.6 deliverables

1. `tools/visual-audit/` — Playwright build-time tooling (gitignored except config; honors Rule 13)
2. `docs/handoffs/_visual-audit/screenshots/` — ~60-100 systematic PNG captures
3. `docs/handoffs/_visual-audit/owner-ground-truth/` — 5-10 owner GoFullPage captures
4. `docs/handoffs/_rebuild-visual-audit.md` — agent's annotated per-surface findings
5. `docs/handoffs/_rebuild-design-dna.md` — AMENDED with owner-annotated visual reality
6. `docs/handoffs/_in-house-skills-update-todo.md` — extended with any in-house skill ↔ visual reality contradictions surfaced

## Step W1.6.1 — Agent installs Playwright

```bash
cd "D:/Mis Documentos/Projects/Toolskin Framework/toolskin-rebuild"
mkdir -p tools/visual-audit
cd tools/visual-audit
npm init -y
npm install --save-dev playwright @playwright/test
npx playwright install chromium
```

Update `.gitignore`: add `tools/visual-audit/node_modules/` and `tools/visual-audit/playwright-report/`.

Playwright is build-time tool. Not shipped. Rule 13 honored.

## Step W1.6.2 — Agent writes capture script

`tools/visual-audit/capture.mjs`:

- Loads `../toolskin-showcase/index.html`, `toolskin-lab.html`, and any `branding/index.html` / `pitchdeck/*.html` via local file:// URL OR via `python -m http.server 8000` in the showcase directory
- Captures at 3 viewports: desktop (1920×1080), tablet (1024×768), mobile (375×812)
- Captures both themes via DOM-level `data-theme` toggle (write a tiny inline script that flips the attribute before each capture)
- For each viewport × theme combination:
  - Full-page screenshot
  - Per-section element screenshots (selectors driven by T1 typology — hero, accent swatches, surface grid, masonry, marquee, modal-open state, accordion-expanded state, tabs-active state, tree, chips-strip, button variants, input variants, card variants)
- Output: PNG files named `<viewport>-<theme>-<surface>.png` to `docs/handoffs/_visual-audit/screenshots/`
- Expected output: ~60-100 PNGs

Execute the script. Verify all captures landed.

## Step W1.6.3 — Owner uses GoFullPage for ground truth (~10 min owner time)

Owner action:
1. Install GoFullPage Chrome extension from Chrome Web Store (`https://chromewebstore.google.com/detail/gofullpage-full-page-scre/fdpohaocaechififmbbbbbknoalclacl`)
2. Open `../toolskin-showcase/index.html` in real Chrome
3. Capture full-page screenshots of 5-10 key surfaces — at minimum: hero, surface grid all 6 levels, masonry, marquee, modal-open, accordion-expanded. Both themes for each.
4. Save PNGs to `docs/handoffs/_visual-audit/owner-ground-truth/`
5. Notify agent when complete

Agent waits for owner notification.

## Step W1.6.4 — Agent runs visual analysis via Claude vision

Dispatch a subagent (Wave 1.6 Visual Audit Analyst). Brief:

> SUBAGENT: Wave 1.6 Visual Audit Analyst
>
> OBJECTIVE: Analyze captured screenshots to produce ground-truth visual record of existing Toolskin design system. Findings become primary input to Phase E skill content, displacing the text-derived Wave 1.5 design DNA where they conflict.
>
> READING ORDER (mandatory):
> 1. docs/handoffs/_rebuild-design-dna.md (text-derived DNA; will be amended against findings here)
> 2. .claude/skills/expert-designer/SKILL.md + references
> 3. .claude/skills/typography-master/SKILL.md + references
> 4. .claude/skills/design-tokens-2.0/SKILL.md
> 5. .claude/skills/design-review/ (julianoczkowski Tier 2 workflow — APPLY this skill's methodology to the audit)
> 6. .claude/skills/browser-qa/ (ECC Tier 5 — apply audit framework)
>
> READING — VISUAL (use Claude's native multimodal vision):
> 7. ALL PNG files in docs/handoffs/_visual-audit/screenshots/ (Playwright captures, ~60-100 files)
> 8. ALL PNG files in docs/handoffs/_visual-audit/owner-ground-truth/ (GoFullPage captures, 5-10 files)
>
> FOR EACH SCREENSHOT analyzed, produce a section in docs/handoffs/_rebuild-visual-audit.md:
>
> ## Screenshot: <filename>
> - **Surface captured:** <what's on screen>
> - **Viewport / theme:** <desktop/tablet/mobile × dark/light>
> - **What's rendered (description):** <objective description of visual state>
> - **Cross-reference vs `_rebuild-design-dna.md`:** <does this match the text-derived DNA? where does it differ?>
> - **Anomalies flagged:** <broken icons, contrast issues, layout breaks, FontAwesome failures, unexpected gradients, suspect patterns>
> - **Headless vs real-Chrome comparison:** <if matching owner ground truth exists, note any discrepancies in rendering between Playwright headless and real Chrome>
> - **Open question for owner:** <if design intent is unclear, surface as question — never auto-resolve>
>
> CRITICAL CONSTRAINTS:
> - NEVER write to ../toolskin-showcase/ (read-only forever, Rule 12)
> - NEVER propose alternative design choices — extract what EXISTS as canonical
> - NEVER apply generic design heuristics from training — defer to visual evidence + in-house skills
> - If text-derived DNA and visual reality disagree, surface the contradiction; do NOT silently reconcile
> - Time-box: 35 min
>
> OUTPUT FILE: docs/handoffs/_rebuild-visual-audit.md (one section per screenshot + summary section listing all anomalies + summary section listing all owner-pending questions)
>
> ROLE OF THIS OUTPUT:
> - Primary input to Phase E toolskin-architecture SKILL.md content (replaces text-derived DNA where they conflict)
> - Visual parity baseline for S5 autonomous protocol (S5 G1 parity criterion now references _rebuild-visual-audit.md + _rebuild-design-dna.md as combined ground truth)
> - Binding for every block sandbox session in Session 4+

## Step W1.6.5 — Owner reviews + annotates (~30 min owner time)

Owner reads `_rebuild-visual-audit.md`. For each finding, annotates:

- ✅ ENDORSE — this is canonical Toolskin
- ❌ REJECT — this is workaround state, do not preserve in rebuild (e.g., FontAwesome version workaround, `pointer-events: none` marquee hack, `--ts-on-accent` regression state)
- 📝 INTENT — owner adds design rationale ("this card layout is canonical because X," "that gradient was meant to be removed in v2")
- ❓ UNCLEAR — owner doesn't recall original intent, flag for follow-up

Owner annotations get appended directly to `_rebuild-visual-audit.md` as inline comments or as a separate `# Owner annotations` section.

## Step W1.6.6 — Agent reconciles design DNA against visual reality

Agent amends `_rebuild-design-dna.md`:
- For every contradiction between text-derived DNA and visual audit + owner annotation, **visual audit + owner annotation WINS**
- Update DNA entries with "verified against visual audit" notes
- Surface remaining open questions to owner (deferred to Phase E review if not blocking)

Update `_in-house-skills-update-todo.md` with new amendment items:
- Any in-house skill claim disproven by visual audit → flag for skill text correction in Session 1.5

═══════════════════════════════════════════════════════════════════════
PATTERN 17 ADDED TO REBUILD-ORCHESTRATION SKILL
═══════════════════════════════════════════════════════════════════════

The `rebuild-orchestration` skill (Session 1.5 install) adds Pattern 17:

## Pattern 17 — Visual audit before specs (mandatory for design system work)

Design system rebuilds MUST visually audit the source-of-truth rendered state BEFORE producing engineering specs. Code-text design extraction (reading CSS rules, parsing HTML, reading skill docs) is INSUFFICIENT — it cannot detect:
- Contrast regressions
- Version mismatches (e.g., FontAwesome v6 vs v7 silent breakage)
- Icon rendering failures
- localStorage-cached false-positives
- Browser-specific rendering discrepancies
- Any visual outcome where math-correct ≠ visual-correct

**Source of truth hierarchy:**
1. Owner's eye (highest authority — design taste cannot be derived)
2. Browser-rendered screenshots (real Chrome via GoFullPage = ground truth; Playwright headless = systematic baseline)
3. Claude's vision analysis of captured PNGs (reasons about pixels, not text)
4. CSS source text (lowest — what code SAYS the design is, may not match what renders)

Skills derived from text alone are INPUTS to visual audit, never substitutes. Council Design voices reading text-derived specs are auditing blind — they must consume the visual audit document as primary input.

**Implementation:**
- Capture tools: Playwright (build-time, gitignored, Rule 13 honored) + GoFullPage Chrome extension (owner manual)
- Analysis: Claude native multimodal vision viewing PNGs + design-review skill (julianoczkowski) + browser-qa skill (ECC)
- Output: `_rebuild-visual-audit.md` with per-surface findings, cross-referenced to `_rebuild-design-dna.md`
- Gate: visual audit MUST land + receive owner annotation BEFORE Phase E skill build, BEFORE any block sandbox work in Session 4+

This pattern emerged Session 1 when the rebuild progressed through Wave 1 + Wave 2 + Wave 1.5 + Gate 5 without any agent ever rendering the design system in a browser. Owner caught the gap. From that point binding.

**Companion to Pattern 16 (Council HALT on fundamentals):** Pattern 17 is what Design Skeptic + Design Critic voices need as INPUT. Without visual audit, council Design voices operate blind on text. Pattern 17 ensures the voices have pixels to reason about, not just text.

═══════════════════════════════════════════════════════════════════════
EXECUTION ORDER (REVISED — Phase E DEFERRED until Wave 1.6 completes)
═══════════════════════════════════════════════════════════════════════

## Step A — Encode resolutions (~10 min)

1. Append "Resolution #1 D2↔D8 reframe + Extended Rule 15" to `docs/handoffs/_session-1-orchestrator-synthesis.md` after the council appendix
2. Append "Resolution #2 dual-emission mandate" to synthesis
3. Append "Resolution #3 variable-axis font loading" to synthesis
4. Append "Wave 1.6 visual audit insertion + Pattern 17" to synthesis
5. Update `docs/handoffs/_in-house-skills-update-todo.md`:
   - design-tokens-2.0 update task: reference Extended Rule 15 + Surface Labs presets
   - S1/S2/Wave 1.5 amendment items (mixing constants are engine-derived, not hardcoded)
   - typography-master 16→13px update (still pending from Session 1.5 todo)
   - expert-designer 10→8px radius update (still pending)
   - Skill claims disproved by visual audit (TBD after Wave 1.6 runs)

Spec amendments are DOCUMENTED in the synthesis as binding input for Session 2+ implementation — they don't require re-dispatching S1/S2/Wave 1.5 sub-agents this session.

## Step B — Wave 1.6 visual audit (~80 min total: ~65 agent + ~15 owner across 2 owner touchpoints)

Per Wave 1.6 steps W1.6.1 through W1.6.6 above.

**Halt point W1.6.A:** After Step W1.6.2 (Playwright captures complete) — agent notifies owner: "Playwright captures complete at `docs/handoffs/_visual-audit/screenshots/`. Owner GoFullPage ground-truth captures pending at `docs/handoffs/_visual-audit/owner-ground-truth/`. Awaiting owner."

**Halt point W1.6.B:** After Step W1.6.4 (agent analysis complete) — agent notifies owner: "Visual audit analysis complete at `docs/handoffs/_rebuild-visual-audit.md`. Awaiting owner annotation per W1.6.5."

**Resume autonomously after W1.6.6** (DNA reconciliation) → proceed to Phase E.

## Step C — Phase E (Build toolskin-architecture SKILL.md) (~45 min)

Per the Day 2 brief Step 4. With these specific encoding requirements:

- **§2 (CONVERSATION RULES):** Rule 15 uses the EXTENDED form, not the short form
- **§10 (APCACH SUPREMACY):** integrate the Extended Rule 15 language about derivative chain + mixing constants + surface contrast + OKLCH inversions + theme inversion + Surface Labs base tints
- **§11 (VISUAL DESIGN DNA):** Wave 1.5 §C7 mixing constants ENTRY uses the amended language (engine-derived outputs, not hand-tuned dark values) + integrates Wave 1.6 visual audit findings
- **§20 (GATE 5 COUNCIL APPENDIX):** include the 3 resolutions verbatim
- **§22 (REFUSAL PATTERNS):** add R-D3-dual-emit, R-OQ-B3, R-D8 (light/dark/auto only), R-pattern-opt-in refusal entries
- **NEW §23 (Wave 1.6 Visual Audit appendix):** include owner-annotated visual reality as binding input for Session 4+ block sandboxes; reference both `_rebuild-design-dna.md` and `_rebuild-visual-audit.md` as combined design ground truth
- **All other content per the Day 2 brief Step 4 list**

## Step D — Install S6 governance artifacts

Per Day 2 brief Step 4 final substep:

- `.git/hooks/pre-commit` (full version per A1 Q3) — ADD checks #12 (dual-emission validation), #13 (font weight 800 verification flag), #14 (visual audit completion gate for any block sandbox PR)
- `CONTRIBUTING.md` per S6 spec

## Step E — Phase F first commit (~15 min)

Per Day 2 brief Step 5 — surface proposed commit message to owner for review before `git commit` runs.

**Update commit message** to reference:
- Extended Rule 15 (color authority for entire derivation chain)
- 3 council resolutions
- Pattern 16 + Pattern 17 (pending Session 1.5 skill install)
- 4 new refusal patterns (R-D3-dual-emit, R-OQ-B3, R-D8, R-pattern-opt-in)
- Wave 1.6 visual audit completed with owner annotation
- `_rebuild-visual-audit.md` + amended `_rebuild-design-dna.md` as ground truth

## Step F — Session 1 close report

Per Day 2 brief Step 6.

═══════════════════════════════════════════════════════════════════════
COUNCIL ADDENDA (auto-accept, no HALT) — confirmed
═══════════════════════════════════════════════════════════════════════

Per the synthesis council appendix:
- OQ-A6 contract limit footnote (overrides < 13px void apcach contract) — ACCEPT
- OQ-A6 triple-declaration (`:root` + `html` + `body`) — ACCEPT, S1 amendment
- D2 status-variant accent ladders pre-baked — ACCEPT, S1+S4 amendment
- D2 setAccent console.warn for out-of-band OKLCH — ACCEPT, S1 amendment
- D4 npm verification TODAY in Phase E before Phase F commit — ACCEPT, add to Phase E checklist
- D8 API surface lock to exactly 3 values (light/dark/auto) — ACCEPT, R-D8 refusal pattern
- OQ-E3 reduced-motion composition — ACCEPT, S2 amendment
- OQ-E3 canonical opt-in template (data-attribute + token, never class modifier) — ACCEPT, R-pattern-opt-in refusal pattern

All 8 addenda integrate into Phase E SKILL.md content as authoring source material.

═══════════════════════════════════════════════════════════════════════
SESSION 1.5 SCOPE (POST-COMMIT HOUSEKEEPING) — UPDATED
═══════════════════════════════════════════════════════════════════════

Tomorrow's Session 1.5 expands per items added in this chat. Roughly 90 min total:

1. **Install claude-remember plugin** (`/plugin install remember@dpt-plugins` per Digital Process Tools marketplace) at `.claude/`, write `identity.md`, verify hooks register. ~10 min.
2. **Install rebuild-orchestration skill** at `.claude/skills/rebuild-orchestration/SKILL.md` (the 248-line skill authored in chat, NOW with Pattern 16 + Pattern 17 included = 17 patterns total).
3. **Update in-house skills:**
   - typography-master: 16px → 13px base
   - expert-designer: 10px → 8px radius
   - design-tokens-2.0: reference Extended Rule 15 + Surface Labs base tints
   - All 3: cross-reference Wave 1.6 visual audit findings where they amend prior claims
4. **Configure ONE Routine** ("Toolskin morning briefing" template, weekdays 9:30 AM GMT-3) — test the Routines feature with a low-risk first deployment. ~10 min.
5. **S3 design DNA pointer column** added per block.
6. **S6 R-DNA-1..6 refusal family text** finalized from Wave 1.5 design DNA anti-patterns.
7. **Verify `toolskin@1` npm name** availability via `npm view toolskin`. Document outcome in `dist/README.md`.
8. **Pre-first-use Snyk audit** of browser-qa, configure-ecc, design-system skills (Session 1 deferred).

═══════════════════════════════════════════════════════════════════════
BINDINGS REAFFIRMED
═══════════════════════════════════════════════════════════════════════

- 15 CONVERSATION RULES (14 + EXTENDED Rule 15)
- File 07 repo isolation
- Pattern 8 (surface disagreements) + Pattern 16 (surface fundamental implications) + Pattern 17 (visual audit before specs) — all halt for owner, never auto-resolve
- Smart color system + surface auto-contrast + auto-nested alt surface = foundational constraints, never hand-tuned
- Tokens decide WHICH color; engine decides HOW MUCH
- Theme inversion = math (engine) not tables (hardcoded)
- Surface Labs presets = base tints engine derives from
- apcach is unified engine for entire derivation chain
- Owner's eye = source of truth for design; browser screenshots = ground truth; CSS text = lowest-priority input
- Phase E DOES NOT PROCEED until Wave 1.6 visual audit completes + owner annotates

═══════════════════════════════════════════════════════════════════════
RESUMING AUTONOMOUS EXECUTION
═══════════════════════════════════════════════════════════════════════

Begin with Step A (encode resolutions in synthesis + update todo). Then Step B (Wave 1.6 visual audit). Halt twice during Wave 1.6 for owner touchpoints (W1.6.A after Playwright captures for owner to do GoFullPage; W1.6.B after agent analysis for owner annotation). Then autonomously through Step C, D, E. Halt at proposed commit message review (Step E) per Day 2 brief Halt Point #3.

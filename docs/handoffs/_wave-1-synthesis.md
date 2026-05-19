# Wave 1 Synthesis — Block Layer Type Engineering

**Authored by:** orchestrator (Session 1, post-Wave 1 dispatch)
**Date:** 2026-05-19
**Status:** Awaiting Owner Gate 4 review
**Inputs:**
- `docs/handoffs/_rebuild-block-typology.md` (T1, 635 lines, DONE)
- `docs/handoffs/_rebuild-base-context-spec.md` (T2, 567 lines, DONE_WITH_CONCERNS)
- `docs/handoffs/_rebuild-adaptive-integration-spec.md` (T3, 524 lines, DONE_WITH_CONCERNS)

---

## 0. Three-line summary

Wave 1 lands a coherent architectural foundation: T1 classifies ~128 component families into PERMISSIVE/STRICT/ALWAYS STRICT tiers; T2 specs the reusable `sandbox/_base.html` with a locked CSS cascade and a parity-rig iframe; T3 specs the drop-in contract verifying Rule 5 across 6 integration targets with Rule 15 (apcach) as the color authority. **All three honor every binding rule (1-15 + file 07 isolation).** **No non-trivial architectural conflicts surfaced** — alignments dominate, with ~9 minor questions deferred to specific Wave 2 owners (S3/S4/S5/S6) and ~3 owner-decision items reserved for Gate 4 / Gate 5.

---

## 1. Deliverable summary

| Spec | Lines | Status | Critical content |
|---|---|---|---|
| `_rebuild-block-typology.md` (T1) | 635 | DONE | ~128 components classified across 3 tiers (44 atomic / 49 molecular / 35 layout), ts-marquee resolution, cascade-sensitivity criteria, @taxonomy_chips_strip 10 factors extracted verbatim, color contract per Rule 15 |
| `_rebuild-base-context-spec.md` (T2) | 567 | DONE_WITH_CONCERNS | Reusable `sandbox/_base.html` template (spec only, not written), locked CSS load order (primitives → system → utilities → component), parity-rig iframe loading old `toolskin.css` read-only, Rule 5 demo surface (accent-hue input) |
| `_rebuild-adaptive-integration-spec.md` (T3) | 524 | DONE_WITH_CONCERNS | 6 integration targets (Static / WordPress / React / Vue / AI / Tailwind), one-accent-hue → full system contract, runtime apcach hook trade-offs (Path A bundled / Path B CSS-only / Hybrid), 8 anti-patterns to refuse |

---

## 2. Strong cross-spec alignments (no conflict, mutually reinforcing)

These are not coincidences — they emerge from all three agents independently consuming the same binding rules.

| # | Alignment | T1 evidence | T2 evidence | T3 evidence |
|---|---|---|---|---|
| 1 | **Rule 15 (apcach color authority) honored** | §3 color contract — every block consumes `--ts-this-*` derivatives | §3.2 row 1 — `primitives/colors.css` is apcach-derived OKLCH, loaded first | §3.2 — every primitive is apcach-derived via `apcach()` calls; §3.3 explicitly forbids consumer multi-input customization |
| 2 | **Repo isolation (file 07) honored** | §0 footer — all reads from `../toolskin-showcase/` via relative path, no writes | §3.3, §5.5 — old `toolskin.css` loads ONLY inside iframe via `<link>`, never `Edit`/`Write` | §6.4 footer — sources read are listed; no writes; no git ops |
| 3 | **`.ts-*` namespace is the protection** | §3 — all blocks consume `--ts-this-*` and use `.ts-*` selectors | §6 — slot pattern uses `<main id="block-slot">` with `.ts-*` markup | §5 — `.ts-*` prefix protects against Bootstrap/Tailwind/React lib collisions |
| 4 | **T1's three tiers map cleanly to T2's sandbox folders** | §2.4 — 44 atomic, 49 molecular, 35 layout | §8.1 — folder names `00-foundation/01-atomic/02-molecular/03-layout` | (T3 not impacted) |
| 5 | **Compositional pattern: molecular composes atomics** | §1.2 criterion 1 — "Composed of atomics + coordination" | §6.5 — flags multi-CSS loading for compositional blocks (the LARGEST OQ — see §3 below) | (T3 covers integration, doesn't conflict) |
| 6 | **ts-marquee resolutions converge** | §4.1 — duplicates are CLEANUP TARGETS (last-wins cascade); §4.2 — `pointer-events:none` needs engine fix in toolskin.js | (T2 not impacted) | §4 — `setAccentHex` deprecated in favor of `Toolskin.setAccent()`, matching T1's engine-cleanup theme |
| 7 | **Rule 5 verification surface = accent-hue input** | (T1 not impacted) | §7 — accent input in sandbox toolbar is "Rule 5 in 200 lines of HTML" | §7.1-7.6 — every target's verification test calls `Toolskin.setAccent('#hex')` |
| 8 | **Modal needs special handling (potential overlay/content split)** | §8.1 — flags modal classification edge case | (T2 not impacted) | §2 table — modal not specifically called out, neutral |
| 9 | **Build-time apcach + optional runtime layer per Rule 13** | §3.3 refusal pattern routes color literals to S1 | §4.4 — apcach runtime is opt-in via `?apcach=runtime` query param | §4.1-4.3 — Path A bundled / Path B CSS-only / Hybrid; owner decides at Gate 5 |

**Verdict:** Wave 1 outputs are mutually consistent. The 14+1 rules act as a strong attractor that produces aligned specs without coordination.

---

## 3. Cross-spec conflicts and ambiguities — classification

Conflicts found split into three categories:

### 3.1 RESOLVED at synthesis (no Gate 4 action needed)

| # | Topic | Resolution |
|---|---|---|
| C1 | Tier folder names (T2's `00-foundation/01-atomic/02-molecular/03-layout` vs T1's typology) | **ALIGNED** — T2 explicitly yields to T1 if names differ; they don't differ. Names locked. |
| C2 | `data-block-tier` attribute on `<main>` slot (T2) | T1 doesn't propose attribute names; T2's choice stands. T1 typology populates the `tier` value. |
| C3 | Atomic blocks don't need `toolskin-uikit.js` (T2) | T1's atomic definitions confirm — self-painted, no JS coordination needed. T2 conditional load is correct. |
| C4 | Rule 5 demo surface = accent-hue input (T2 §7 vs T3 §7) | T2 provides the input; T3 specifies the test. Mutually supportive. |
| C5 | Verification tests folder location (T3 §7) at `sandbox/verification/` | T2's sandbox structure (`sandbox/<tier>/<block-name>/`) and T3's `sandbox/verification/` co-exist. ALIGNED. |

### 3.2 ASSIGNED to specific Wave 2 sub-agents (Gate 4 ratifies the assignment)

| # | Topic | Assigned to | T1/T2/T3 source |
|---|---|---|---|
| A1 | **Compositional block multi-CSS loading** (LARGEST OPEN ARCHITECTURAL QUESTION) | **S4 Build Pipeline Architect** | T2 OQ2 + T1 §1.2 + T2 §6.5 |
| A2 | Modal split (overlay layout vs content molecular) | S3 Component Registry + S5 Protocol | T1 §8.1 |
| A3 | Marquee fullwidth tier-promotion mechanism (single spec with modifier flag vs two specs) | S5 Protocol | T1 §8.2 |
| A4 | Surface-N two-spec split (`.ts-surface-N` atomic vs `.ts-section.ts-surface-N` layout) | S3 Component Registry | T1 §8.3 |
| A5 | Reveal animations: separate "infrastructure" category (engines/observers) from blocks | S4 Build Pipeline | T1 §8.4 |
| A6 | UIKit aliasing: case-by-case (genuine behavior = separate molecular; pure alias = collapse) | S3 Component Registry | T1 §8.6 |
| A7 | Apcach runtime bootstrap convention (`?apcach=runtime` query param vs `__TOOLSKIN_CONFIG__` config object) | S1 Color Foundation (uses T3's config-object approach as primary, T2's query param as sandbox-only shortcut) | T2 §9.3 + T3 §3.1, §6.5 |
| A8 | Engine-default fix for marquee hover-pause (toolskin.js) | S4 Build Pipeline (engines layer) + Session 4+ marquee sandbox | T1 §4.2 |
| A9 | `data-theme` canonical (drop `data-ts-theme` dual-attribute) | S1/S2 migration map | T2 OQ7 |

### 3.3 OWNER DECISION at Gate 4 / Gate 5

| # | Topic | Decision needed | Recommendation |
|---|---|---|---|
| D1 | `assets/js/next/` JS folder convention | Gate 4 ratify (mirrors `assets/css/next/`) | **Approve** — symmetry, predictability |
| D2 | Apcach runtime: Path A (bundled, +50KB) vs Path B (CSS-only) vs Hybrid (default B + optional A build) | Gate 5 (T3 §4.3) | **Hybrid** — default B for ship size; A available for white-label/AI-generated palette consumers |
| D3 | OKLCH browser baseline (mid-2023+ Chrome 111 / Safari 16.4 / Firefox 113) | Gate 5 (T3 §10.2) | **Accept baseline** — no polyfill per Rule 13 |
| D4 | npm package name `toolskin@1` | Gate 5 (T3 §10.3) | **Verify against npm registry before first publish** — fallback `@toolskin/core` |
| D5 | Modal classification (T1 §8.1) — split overlay+content like offcanvas? | Gate 4 (architectural shape) | **Split** — mirrors `.ts-oce-overlay` + `.ts-oce-panel` pattern; cleaner block-spec contracts |
| D6 | Surface-N split (T1 §8.3) — two block-specs? | Gate 4 (architectural shape) | **Approve two-spec split** — atomic utility vs layout composition |
| D7 | "Infrastructure" category separate from blocks (T1 §8.4) | Gate 4 (architectural shape) | **Approve** — engines/observers/asset-loader/theme-toggle-implementation get a separate sandbox category; not part of the 128 blocks |
| D8 | Light mode test gap (T3 §10.5) — add `Toolskin.setTheme()` to v2 API surface? | Gate 5 | **Yes, add** — minimal API addition, fills the test gap |

---

## 4. ECC `council` invocation — NOT invoked at synthesis

Per the owner's Wave 1 instruction:
> "If conflicts found AND non-trivial: invoke ECC `council` skill for 4-voice deliberation"

**Reasoning for NOT invoking:**

1. Conflicts found in §3.1 are RESOLVED — no deliberation needed.
2. Conflicts in §3.2 have clear assignments to specific Wave 2 sub-agents — the sub-agents will produce the architecture; council on hypotheticals before S4's spec exists would be pure speculation.
3. Items in §3.3 are owner-decisions, not multi-voice deliberations — owner has direct authority + Gate 4/5 mechanisms.
4. The LARGEST open architectural question (A1 compositional block multi-CSS loading) is genuinely meaty BUT it's a clean S4 brief; council deliberation would precede S4's analysis with no information advantage.

**When council WILL be invoked:** If S4 returns a spec for A1 that owner finds ambiguous, OR if Path A vs B vs Hybrid (D2) needs deliberation before Gate 5, the orchestrator invokes `/anthropic-skills:council` (actually `ECC council` — Tier 4 default per file 05 §priority hierarchy) at that point. Reserved for genuine architectural fork moments.

---

## 5. Proposed Wave 2 dispatch (consuming Wave 1 outputs)

Per file 01 master brief Phase D Wave 2 dispatch list. Each sub-agent gets a fresh-context brief referencing:
- All 15 conversation rules + file 07 + file 05 tier hierarchy + file 06 Rule 15
- The full rebuild queue (`_session-1-rebuild-queue.md`)
- Wave 1 specs (T1, T2, T3) as Wave 1 inputs they consume
- This synthesis doc as the cross-wave context

| Sub-agent | Wave 1 inputs consumed | Wave 2 deliverable | Key Wave 1 contact points |
|---|---|---|---|
| **S1 Color Foundation Architect** | T3 §3 (apcach derivation rules), T3 §4 (runtime hook API) | `_rebuild-primitives-spec.md` — apcach build script + per-token derivation map + APCA contrast table | Implements §3 color contract from T1; resolves A7 bootstrap convention; resolves D2 Path A/B implementation; resolves D8 setTheme API |
| **S2 System Layer Architect** | T1 §3 color contract, T3 §3.2 Tier 2 system layer, T2 §3.2 cascade load order | `_rebuild-system-spec.md` — `--ts-this-*` derivative chain CSS, surface superposition rules, missing state tokens (border-active/disabled/focus) | Resolves restyling-architecture.md §3 missing tokens; implements the derivative chain consumed by every block |
| **S3 Component Registry + Block Prioritization** | T1 §2 full classification table, T1 §6 chips contract, T2 §6 slot pattern, T3 §5 namespace rules | `_rebuild-component-registry.md` + 5 sketch block-specs | Resolves A2 modal split, A4 surface-N split, A6 UIKit aliasing |
| **S4 Build Pipeline Architect** | T1 §2 tier counts (for bundle order), T2 §3 CSS load order, T2 §8 reusability + multi-CSS, T3 §6 asset loading | `_rebuild-build-pipeline-spec.md` | **PRIMARY** — resolves A1 compositional multi-CSS (the largest OQ), A5 infrastructure category, A8 engine-default fixes, T3 §6.2 CDN delivery |
| **S5 Autonomous Execution Protocol Architect** | T1 §2 tier assignments (the input), T1 §2.4 totals, T2 §5.6 parity-rig hooks, T3 §7 verification protocol | `_rebuild-autonomous-protocol.md` | Implements PERMISSIVE/STRICT/ALWAYS STRICT gates per T1 tiers; resolves A3 marquee tier-promotion |
| **S6 Repo Governance + Refusal Patterns Author** | T1 §3.3 refusal pattern, T1 §5.5 cascade auditor pseudocode, T3 §8 anti-patterns, file 07 isolation | `_rebuild-governance-spec.md` (pre-commit hook + CONTRIBUTING.md content + refusal patterns) | Encodes Rule 15 violation refusal, file 07 violation refusal, T3 anti-patterns 1-8 |

**Wave 2 dispatch model:** S1 and S2 share heavy domain (primitives→system) — dispatch in **sequence** (S1 first, then S2 consuming S1 output) to preserve coherence. S3/S4/S5/S6 can dispatch in **parallel** after S1+S2 land, OR all 6 can dispatch in parallel like Wave 1 with the trade-off that S2 then synthesizes against S1's parallel output rather than building on it. **Owner picks at Gate 4 along with the rest.**

---

## 6. Open questions explicitly surfaced for owner at Gate 4

These are decisions blocked at Gate 4 that affect Wave 2 dispatch:

1. **Approve §3.1 resolutions (5 items)** — synthesis-time resolutions stand?
2. **Approve §3.2 assignments (9 items)** — each open question goes to the listed sub-agent?
3. **Decide §3.3 D1, D5, D6, D7** (architectural shape — Gate 4 territory):
   - D1: `assets/js/next/` folder convention
   - D5: Modal split (overlay layout + content molecular)
   - D6: Surface-N two-spec split
   - D7: Separate "infrastructure" category from blocks
4. **Defer §3.3 D2, D3, D4, D8 to Gate 5** (Wave 2 territory — they need Wave 2 specs to decide)
5. **Wave 2 dispatch model**: S1→S2 sequential then S3-S6 parallel, OR all-six parallel? Trade-off documented in §5.
6. **Council invocation**: agree NOT to invoke at this stage; reserve for hypothetical future architectural fork moments?

---

## 7. Risk register (anything that could derail Wave 2 or Sessions 4+)

| Risk | Source | Severity | Mitigation |
|---|---|---|---|
| Compositional block multi-CSS loading (A1) unresolved by S4 | T2 OQ2 | HIGH — blocks Session 4+ block sandboxes | S4 spec MUST resolve before any block sandbox begins. Gate 5 reviews S4's resolution. |
| Apcach Path A vs B unresolved by Gate 5 | T3 §4 | MEDIUM — blocks Wave 2 / S1 implementation | S1's spec describes BOTH paths; owner picks at Gate 5; default Hybrid stands until then |
| OKLCH browser support edge cases | T3 §10.2 | LOW — affects v2 consumer compatibility | Document baseline; build-time apcach output is sRGB-compatible OKLCH; old browsers degrade gracefully |
| Engine-default hover-pause for marquee (A8) | T1 §4.2 | LOW — affects ts-marquee canonical pattern fidelity | S4 owns engine layer; marquee sandbox (Session 4+) coordinates the fix |
| Three sub-agents working in parallel for Wave 2 with no S1→S2 sequential pass | §5 dispatch model | MEDIUM — S2 might propose primitives that S1 hasn't generated | Owner picks dispatch model at Gate 4 |

---

## 8. What Wave 1 PROVED

- The 14+1 conversation rules + file 07 isolation rules act as a strong attractor — three independent fresh-context sub-agents produced mutually consistent specs.
- The block typology (T1) maps cleanly to the sandbox base (T2) and the integration contract (T3) without coordination.
- Rule 15 (apcach supremacy) is enforced top-to-bottom: T1's color contract, T2's load order, T3's primitive derivation rules all converge on the same `assets/css/next/primitives/colors.css` apcach output.
- The parity-rig iframe pattern (T2 §5) is the killer feature for block sandbox QA — it gives Sessions 4+ a low-friction visual comparison surface without compromising repo isolation.
- The "one accent hue → complete contrast-verified system" promise (Rule 5) is verifiable across 6 integration targets via a single API call: `Toolskin.setAccent('#hex')`.

---

## 9. What Wave 1 LEFT OPEN

| Layer | Open items | Owner |
|---|---|---|
| Architecture (Gate 4) | D1, D5, D6, D7 — 4 owner decisions | Owner |
| Wave 2 specs | A1-A9 — 9 sub-agent assignments | S1-S6 |
| Implementation (Gate 5+) | D2, D3, D4, D8 — 4 deferred owner decisions | Owner after Wave 2 |
| Session 4+ | A8 engine-default coordination for marquee | Block sandbox + S4 |

**No item was silently dropped.** Every Wave 1 sub-agent's open questions are accounted for above with explicit assignment.

---

## 10. Status

**Synthesis status:** `READY FOR OWNER GATE 4 REVIEW`

**Orchestrator action items if Gate 4 approves:**
1. Update queue document (`_session-1-rebuild-queue.md`) with locked architectural decisions (D1, D5, D6, D7) so Wave 2 sub-agents have them in their brief.
2. Dispatch Wave 2 per chosen model (sequential S1→S2 then parallel S3-S6, OR all-six parallel).
3. Ponderate Wave 2 outputs into `_session-1-orchestrator-synthesis.md`.
4. Halt at Owner Gate 5.

**If Gate 4 finds issues:** any of T1/T2/T3 can be re-dispatched with corrected brief; iteration is expected per the brief.

---

# Appendix A1-Council — Preempt deliberation on compositional block multi-CSS loading

**Invoked:** Owner directive at Gate 4 — preempt before any Wave 2 sub-agent dispatch (rather than reserve for post-S4 ambiguity per orchestrator's original suggestion).
**Date:** 2026-05-19
**Mechanism:** ECC `council` skill (`.claude/skills/council/SKILL.md`). Architect position written first by orchestrator; Skeptic/Pragmatist/Critic dispatched as 3 parallel fresh-context subagents per anti-anchoring requirement.
**Time-box:** 15 min per voice; ~21 sec actual parallel wallclock.

---

## Architect voice (orchestrator's initial position)

**Initial answer:** Hybrid of **Option 3 (sandbox) + Option 4 (production)**.

- **Sandbox:** explicit multiple `<link>` tags in dependency order in each block's `index.html`. Dependencies declared via `<!-- @ts-deps: type-primitives, button -->` comment header in the block's CSS file. No build step needed for sandbox iteration.
- **Production:** build-time Node script at `tools/build/bundle-css.js` reads each block's CSS + dependency headers + topologically concatenates into `dist/toolskin.css` (one-file ship per Rule 1). Also emits `dist/blocks/<block>.css` files for advanced tree-shake consumers.

**Three strongest reasons:**
1. **Build-time tooling is already approved.** apcach at `tools/color-engine/` per Rule 13 sets the precedent — Node-at-build is OK, Node-at-runtime is not. A small CSS bundler at `tools/build/` is consistent.
2. **Cascade is the contract.** Explicit dependency order at sandbox time MATCHES cascade order at production time. No surprises moving sandbox→production.
3. **Pure @import chains (Option 1) fail performance.** Even with HTTP/2 multiplexing, serial CSS imports add network hops.

**Main risk:** dependency declarations (`@ts-deps: ...` comments) become load-bearing metadata. **Mitigation:** single comment-header source-of-truth parsed by both sandbox runtime and build script; pre-commit hook validates topo-sort terminates.

**Rejected:** Option 1 (@import perf), Option 2 (no sandbox iteration), Option 5 alternatives (CSS Modules / Lit / Shadow DOM violate Rule 1).

---

## Skeptic voice (A1)

The Architect built a Rolls-Royce when a bicycle would clear the gap. Three challenges, one alternative they brushed past, and a verdict.

**Challenge 1 — The dep-header is a soft framework.** `/* @ts-deps: type-primitives, button */` is a custom DSL parsed by `tools/build/bundle-css.js`. Standard CSS does not have manifest comments. The moment a consumer wants to fork or patch a block, they have to learn this convention OR remember to run the Node script. Rule 1 says "Zero framework dependencies. One stylesheet." but the Architect has now coupled the source-of-truth ordering to a Node-only parser. apcach is build-time *color generation* — outputs are static values. A topo-sort over header comments is build-time *structural authoring* — outputs are the cascade contract itself. Those are categorically different uses of Node tooling and the Architect collapses them under "build-time is approved." It isn't, not for this.

**Challenge 2 — The cascade-as-contract argument cuts the other way.** If sandbox order MUST match production order (Architect's reason #2), then production order is the contract. Fine — just *write that order down once*, in one place, that humans read. A single `assets/css/next/_manifest.css` that does nothing but `@import` (or for production, a literal hand-maintained concatenation index) is human-readable, grep-able, and survives the project outliving the Node script. Comment-headers scattered across 30+ block files are the *opposite* of a single contract. One file fails loud; 30 headers fail silent when one drifts.

**Challenge 3 — Tree-shaking is a phantom requirement.** Who tree-shakes a design system that totals ~25k lines of one stylesheet by design? The "per-block files for tree-shake" half of Option 4 is solving a problem nobody asked for. Toolskin's pitch is "one stylesheet, drop-in." Splitting it back up for hypothetical Vite consumers contradicts Rule 5 (zero-config drop-in).

**The alternative dismissed too fast — Option 3, alone.** The Architect rejected Option 3 by silently bundling it with Option 4. But Option 3 standalone is: sandbox uses ordered `<link>` tags (already approved per Rule 7's `_base.html`); production is a single hand-maintained `toolskin-v2.css` assembled by `cat` or an equivalent owner-run command that ships from a single ordered manifest. No dep-headers. No topo-sort. No pre-commit hook. The order lives in one human-edited list. apcach stays in its lane (color values). This is *less* machinery, not more, and still satisfies Rules 1/5/7/13.

**Bottom line — disagree with Hybrid as proposed.** Counter-proposal: Option 3 for sandbox, plus a single ordered `_manifest.txt` (or equivalent) read by a trivial concatenator (could be bash, could be Node, could be 10 lines) for production. Kill the `@ts-deps` headers. Kill the per-block production distribution. One stylesheet shipped, one ordered list authored, zero custom CSS dialect.

**Status:** DONE

---

## Pragmatist voice (A1)

**Shipping-friction delta vs alternatives.**

The Architect's hybrid is **~5-8 minutes added per block sandbox session** vs the "one giant CSS file" baseline. Concretely: agent writes block CSS, adds a `<!-- @ts-deps: primitives/colors, primitives/spacing, system/surface, components/button -->` header (60 sec if conventions are clear), references it in `sandbox/_base.html` via multiple `<link>` tags in declared order (2-3 min), and runs build before parity diff (~30 sec for Node script). That's tolerable.

The "one big CSS file" alternative saves those minutes but **destroys the entire sandbox isolation contract** — Rule 7 says block-by-block sandbox is non-negotiable, and you can't test a button block's cascade in isolation if it always ships with chips-strip rules loaded. Dead on arrival.

The pure `@import` approach (Option 1) saves the build script but adds 50-200ms render delay per import chain in production. For a design system whose pitch is "drop-in, zero config, fast" — that's a self-inflicted wound on first-paint perf metrics consumers will notice.

**Concrete numbers:**
- Bundle delta: per-block files save ~70-80KB for a buttons-only static site (full v2 ~110KB → buttons-only ~25-30KB). Real money on slow connections.
- AI artifact case: Claude/V0/Lovable emit one `<link href="toolskin.css">` → they get the full bundle. **This is correct.** AI use case = single file, no question.
- WordPress plugin: enqueues `dist/toolskin.css` (one file). **No change.** Rule 5 preserved.
- Static HTML power user: opts into per-block files via docs example. Friction = reading one docs page.

**Bug surface concern (legitimate):** Wrong dep header → sandbox passes, production breaks. Debug time ~10-30 min depending on cascade weirdness. **Mitigation must be the pre-commit hook** the Architect mentioned. Without it, dep headers rot and this approach is worse than one-big-file. With it, the topo-sort validates on every commit and the bug surface is closed at write-time, not debug-time. **This hook is non-negotiable, not optional.**

**Bottom line: SHIP THE HYBRID AS-IS** — with one condition: Wave 2 S4 must deliver the pre-commit topo-validation hook in the same wave as the bundle script, not as a follow-up. Defer-the-hook = defer-the-architecture. Also: docs must include a one-paragraph "consumer modes" section (single-file vs per-block) so the AI/WP/power-user split is explicit, not folklore.

Don't wait for Wave 2 to detail further. The Architect's design is concrete enough to start.

**Status:** DONE

---

## Critic voice (A1)

### Top failure modes, ranked by severity

**1. Sandbox/production cascade divergence (HIGH severity, MEDIUM probability)**
The Architect's proposal has two independent ordering systems: hand-authored `<link>` tags in `sandbox/_base.html` and topo-sort in `bundle-css.js`. These can disagree silently. A block author writes link tags in order `[primitives, button, chip, chip-strip]`, validates visually, commits. Build-time topo-sort produces `[primitives, chip, button, chip-strip]` because button's dep header omits chip. Sandbox passes parity rig; production renders subtly different specificity collisions. **Mitigation gap:** The pre-commit hook validates the topo-sort is *internally consistent*, not that it *matches the sandbox link order*. Residual risk: HIGH. Required: parity rig must diff computed cascade between sandbox-loaded order and bundle-emitted order — fail commit on divergence.

**2. Missing/typoed dep headers fail silently (HIGH severity, HIGH probability)**
A Wave 3 sub-agent ports `tag-group.css`, forgets `@ts-deps: tag`. Block works in their sandbox (they hand-linked tag.css). Bundler sees no dep → places tag-group at default position → ships broken. **Mitigation gap:** Pre-commit hook validates topo-sort succeeds, not that *declared deps are complete*. A block with zero deps is valid input. Residual risk: HIGH unless build adds a "cascade probe" — render each block in isolation against a known fixture and diff against sandbox snapshot. Without this, dep headers are load-bearing metadata with no enforcement, which is exactly the failure pattern the Architect named.

**3. Circular dependency dead-end (MEDIUM severity, LOW-MEDIUM probability)**
Chip ↔ chip-strip will eventually share tokens (chip-strip-gap referenced by chip-edge variant). Topo-sort fails hard. **Mitigation gap:** Architect proposal has no fallback. Required answer: introduce a `shared-tokens/` layer between system and component, OR allow explicit `@ts-cycle-break: <token>` annotation. Residual risk: MEDIUM — discoverable at first cycle, but blocks a session until resolved.

**4. Rule 13 erosion — Node becomes release-blocking (MEDIUM severity, CERTAIN)**
The Architect calls this "build-time Node, OK." True per Rule 13. But: every contributor cutting a v2 patch release now needs Node + the toolchain. A CSS-only contributor patching `chip.css` cannot ship without running the bundler. **Mitigation gap:** None proposed. Residual risk: MEDIUM — acceptable IF the bundler is committed as a one-line `npm run build` AND `dist/toolskin.css` is committed to repo (consumers without Node can still grab the artifact). Document explicitly in release runbook.

**5. Per-block file consumer cascade override (LOW-MEDIUM severity, LOW probability)**
A WordPress integrator loading per-block files can override order, but loses the topo-sort guarantee. **Mitigation:** Document monolithic `dist/toolskin.css` as the *supported* drop-in path; per-block files are advanced/tree-shake only. Residual risk: LOW with docs.

### Bottom line

**Hybrid proposal is acceptable WITH two hard gates added before Wave 3 begins:**
1. Pre-commit parity check must diff sandbox-link-order vs bundler-topo-order and fail on mismatch (closes #1, #2).
2. `dist/toolskin.css` committed to repo as release artifact (closes Rule 13 erosion).

Without gate #1, dep headers are honor-system metadata and Wave 3+ sub-agents *will* miss one. That's not a fatal flaw — it's a fixable design gap. Ship the hybrid with these gates documented in the bundler spec.

`[ ] gap`: OKLCH browser-support audit deferred — Wave 1 T3 spec presumed authoritative; bundler should emit a fallback layer warning if any block uses `oklch()` without a fallback, but that's a separate audit.

**Status:** DONE_WITH_CONCERNS

---

## Orchestrator synthesis of 4 voices

### Convergence map

| Architect | Skeptic | Pragmatist | Critic | Synthesis |
|---|---|---|---|---|
| Hybrid (Option 3+4 + dep headers) | DISAGREES — proposes Option 3 + single manifest | AGREES — ship as-is + pre-commit hook | AGREES with 2 gates added | **Mostly converged on Hybrid, with refinements** |
| Tree-shake per-block files justified | "phantom requirement" — Toolskin is one-stylesheet | "real money on slow connections" — concrete KB savings | Per-block consumer cascade override is LOW severity with docs | **Split — keep per-block as advanced/opt-in path, not headline; docs frame single-file as canonical** |
| Pre-commit topo-validation as mitigation | "30 headers fail silent when one drifts" | "non-negotiable, ship in S4's wave" | "validates topo-sort consistency, NOT sandbox-vs-bundler order divergence" | **Need a STRONGER hook — see refinement R1 below** |
| Build-time tooling already approved | Categorically different from apcach (color values vs structural authoring) | Tolerable friction | Node becomes release-blocking | **Commit `dist/toolskin.css` to repo; bundler runs only at owner-tagged release time** |
| (no specific cycle-break) | (no comment on cycles) | (no comment on cycles) | "circular deps need explicit handling" | **Add `shared-tokens/` layer or `@ts-cycle-break:` — defer mechanism to S2 + S4** |

### Refinements adopted (locked into S4's brief)

**R1 — Cascade-divergence check (from Critic #1):** Pre-commit hook does TWO checks, not one:
- (a) Topo-sort consistency — graph is acyclic, all deps resolve.
- (b) Sandbox-vs-bundler order diff — parses sandbox `index.html` `<link>` order, parses bundler's topo output order, FAILS commit on mismatch. This closes the "sandbox passes but production breaks" failure mode.

**R2 — Cascade probe (from Critic #2):** Each block has a rendered fixture in `sandbox/<tier>/<block>/_fixture.html` (or equivalent). Bundler output renders the same fixture in CI. Pixel-diff fails if dep header is missing.

**R3 — Circular dependency handling (from Critic #3):** S2 system spec exposes a `shared-tokens/` layer between system and component. Tokens shared across multiple component families (chip-strip-gap referenced by chip-edge variant) live there. If a true cycle remains, `@ts-cycle-break:` annotation is allowed (defer mechanism details to S2).

**R4 — `dist/` committed to repo (from Critic #4):** `dist/toolskin.css`, `dist/toolskin.min.css`, `dist/toolskin.js`, `dist/toolskin.min.js` are committed to the repo as release artifacts. A CSS-only contributor can ship a patch without running the bundler — they edit the source AND the dist file in the same commit. The bundler IS the audit, but the artifact is available to consumers without Node.

**R5 — Auditable cascade order manifest (Skeptic compromise):** At build time, the bundler emits `dist/_cascade-order.txt` containing the actual concat order. This is the "single human-readable contract" Skeptic asked for — it lives in `dist/`, not as source-of-truth, but as an audit artifact. Source-of-truth remains the per-file `@ts-deps:` headers (Pragmatist/Architect preference) — Skeptic's "one manifest source-of-truth" is rejected on grounds that scattered headers keep dep info colocated with block CSS (better for sub-agent ergonomics).

**R6 — Per-block ship is advanced/opt-in (Skeptic + Critic concession):** Documentation frames `dist/toolskin.css` (single file) as the canonical drop-in path. Per-block files in `dist/blocks/<block>.css` exist for advanced consumers but are NOT in the headline integration guide. AI artifacts, WordPress, React/Vue defaults all use the single file. Tree-shake is opt-in for static HTML power users only.

### Dissenting view (Skeptic, preserved)

Skeptic's standalone-Option-3-with-single-manifest counter-proposal is rejected at synthesis but preserved here for record. Reasoning:
- Scattered headers (Architect) keep dep info next to the block's CSS — better for sub-agent ergonomics during Sessions 4+ block sandboxes
- A single manifest file CAN drift just as much as scattered headers if maintained by hand — the failure mode shifts but doesn't reduce
- The pre-commit hook (R1) closes the drift surface for either approach; given the hook exists, scattered headers' downside (drift) is the same as single-manifest's downside (drift)
- BUT: if owner at Gate 5 reviews S4's spec and finds the dep-header convention too custom-DSL-like, Skeptic's standalone manifest is a documented fallback

### Trade-offs map (final)

| Approach | Tooling complexity | Author ergonomics | Performance | Rule compliance | Failure modes | Status |
|---|---|---|---|---|---|---|
| Option 1 — Pure `@import` | LOW | OK | WORST (serial) | Rule 1 OK | Cascade order traps | REJECTED — perf |
| Option 2 — Build-time concat only, no sandbox iteration | MEDIUM | POOR | BEST | Rule 7 VIOLATED | None for cascade, many for dev | REJECTED — kills Rule 7 |
| Option 3 — Multiple `<link>` tags in HTML | LOW | OK | OK | All OK | Order maintenance | OK for sandbox only, not production |
| Option 4 — Single concat + per-block files | MEDIUM | Good | BEST | All OK | Sub-agent dep drift | Component of Hybrid |
| **Architect's Hybrid (Option 3 + Option 4 + dep headers)** | MEDIUM | Good | BEST for ship | All OK | Mitigated by R1-R6 | **ADOPTED** |
| Skeptic's Option 3 + single manifest | LOW-MEDIUM | OK | OK | All OK | Single manifest drift | DISSENTING (fallback) |

### Final recommendation for S4 brief

S4 Build Pipeline Architect writes the spec with:
1. **Adopt Hybrid Option 3+4** as the architecture.
2. **Refinements R1-R6** are non-negotiable Wave 2 deliverables, NOT follow-up work.
3. **Skeptic's dissenting view (R5 + single-manifest fallback) is documented in S4's spec** as a "considered alternative" with the rejection reasoning.
4. **S2 System Layer Architect** is briefed to expose `shared-tokens/` (per R3) so S4 can reference it.
5. **Owner reviews at Gate 5** with concrete bundle script + pre-commit hook + dist artifacts visible. If owner finds the dep-header convention too custom-DSL-like, the documented Skeptic fallback (single manifest + no headers) is on the table.

**Council deliberation: COMPLETE.** Synthesis is INPUT to S4, not decision authority. Owner decides at Gate 5 after S4's concrete spec lands.

---

# Appendix A1-Resolution — Owner picks (LOCKED, supersedes orchestrator synthesis recommendations)

**Source:** `docs/session-1-bootstrap/a1-council-resolution.md` (owner-placed between S2 dispatch and Wave 2.3 dispatch)
**Status:** BINDING INPUT to S4 (Build Pipeline Architect) brief. Supersedes any "Owner decides at Gate 5" framing for the A1 sub-decisions below.
**Procedural correction acknowledged:** going forward, orchestrator surfaces council DISAGREEMENTS to owner BEFORE dispatching consumers. Council is INPUT to owner decision, not orchestrator auto-resolve.

## Owner picks on A1 sub-decisions

### Q1 — KEEP `@ts-deps` headers (Architect/Pragmatist/Critic over Skeptic dissent)

Block CSS files declare dependencies via comment header:
```css
/* @ts-deps: primitives/colors, primitives/spacing, system/surface, components/button */
```

The header is machine-parsed by the build script for topological sort. Pre-commit hook validates per Q3.

Rationale: machine-readable deps enable per-block tree-shaking (Q2) and let blocks reorder safely without manual manifest curation. Critic's failure mode #2 (typoed dep headers) closed by Q3's full hook.

### Q2 — KEEP per-block file emission (Pragmatist over Skeptic dissent)

Build script emits BOTH:
- `dist/toolskin.css` (single concatenated — primary ship, drop-in for AI/WordPress per Rule 5)
- `dist/blocks/<block>.css` (per-block files — advanced consumers with tree-shaking)

Both targets must be cascade-consistent (same topo-sort produces both).

Rationale: Pragmatist's 70-80KB savings for buttons-only is real for power users. Single-file path remains the documented default; per-block files are opt-in. No Rule 5 contradiction.

**Docs MUST include explicit "consumer modes" section:**
- AI artifact / WordPress / static HTML → `<link href="dist/toolskin.css">` (single file)
- Build-tool consumer with tree-shake → import per-block files from `dist/blocks/*.css`

### Q3 — Pre-commit hook FULL (Critic's R1 escalated)

Hook checks at every commit:
1. Topological sort terminates (no cycles, all deps resolvable)
2. All `@ts-deps` headers reference valid block names (no typos)
3. Sandbox `<link>` order in any block's `index.html` MATCHES the topo-sort order the bundler would produce
4. If sandbox order disagrees with bundler order → fail commit with explicit diff message

Closes BOTH Critic high-severity failure modes (sandbox/production cascade divergence + missing/typoed deps fail silently).

**S6 designs hook script. S4 designs topo-sort + bundler. They SHARE the same dependency parser module** to ensure both speak the same dep graph.

### Q4 — COMMIT `dist/toolskin.css` to repo (Critic's R4 confirmed)

`dist/toolskin.css` committed to master at every owner-approved release boundary. Node-less contributors can grab directly without running bundler.

Rationale: closes Rule 13 erosion. Toolskin's identity as "drop-in single CSS file" survives even for contributors who don't want Node.

Implementation:
- `dist/` is NOT gitignored
- `dist/blocks/*.css` ALSO committed (per Q2)
- `dist/colors-contrast-report.md` committed (audit artifact)
- `.gitignore` updated to remove any `dist/` exclusion
- Release-time workflow: owner runs `npm run build`, reviews diff, commits `dist/*` along with source changes
- `.gitattributes` MAY mark `dist/*.css` as `linguist-generated` + `merge=ours` to reduce diff noise in code reviews

## What this means for the orchestrator's earlier synthesis

The "ADOPTED Hybrid" verdict in §10 of the main synthesis above STANDS. The R1-R6 refinements stand. This Appendix A1-Resolution adds:
- Owner explicit confirmation of all 4 Q items
- Concrete S4 mandate (S4 brief includes this verbatim)
- S6/S4 collaboration on parser module specified
- `dist/` commit policy + `.gitattributes` guidance

## Procedural correction (binding going forward)

After any council invocation in future sessions:
- If voices DISAGREE on substantive points → orchestrator surfaces disagreement to owner, halts for owner call, encodes owner's resolution as binding input to next dispatch
- If voices AGREE → orchestrator may proceed without owner intervention, surfaces consensus + minor dissent for owner visibility

This procedural correction is encoded in toolskin-architecture SKILL.md at Phase E.

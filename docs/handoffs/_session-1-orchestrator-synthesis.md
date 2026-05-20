# Session 1 Orchestrator Synthesis — Gate 5

**Authored by:** orchestrator (Session 1, post-Wave 2.3 + Wave 1.5)
**Date:** 2026-05-19
**Status:** Awaiting Owner Gate 5 review (most consequential review of Session 1 — locks Wave 2 specs + design DNA + Session 2-N sequencing)
**Inputs (10 specs + 1 wave synthesis):**
- Wave 1: `_rebuild-block-typology.md` (T1), `_rebuild-base-context-spec.md` (T2), `_rebuild-adaptive-integration-spec.md` (T3)
- Wave 1 ponderation: `_wave-1-synthesis.md` (with Appendix A1-Council + Appendix A1-Resolution)
- Wave 2.1: `_rebuild-primitives-spec.md` (S1)
- Wave 2.2: `_rebuild-system-spec.md` (S2)
- Wave 2.3: `_rebuild-component-registry.md` (S3), `_rebuild-build-pipeline-spec.md` (S4), `_rebuild-autonomous-protocol.md` (S5), `_rebuild-governance-spec.md` (S6)
- Wave 1.5: `_rebuild-design-dna.md`

**Total spec corpus:** 8,760+ lines across 10 deliverables.

---

## 0. Three-line summary

Session 1 produced a complete coherent architecture: T1 typology (~128 blocks, 3 tiers) → T2 reusable sandbox + parity-rig → T3 adaptive integration (6 targets) → S1 apcach-derived primitives → S2 derivative chain + shared-tokens layer → S3 registry (130 rows) + 5 sketch block-specs → S4 build pipeline with A1 LOCKED Hybrid (`@ts-deps:` + per-block + commit dist + sandbox-vs-bundler diff hook) → S5 tiered autonomous protocol (10/12/15 gates) → S6 23 refusal patterns + pre-commit hook (S4-shared parser) + CONTRIBUTING. Wave 1.5 then extracted 31 visual design DNA signature patterns + 12 component DNA paragraphs + 30 anti-patterns from in-house Tier 1 skills + CSS, surfacing **3 in-house-skill ↔ CSS contradictions** that owner must resolve at Gate 5. **No major architectural conflicts. Wave 2 specs mutually consistent. Design DNA covers visual identity gap.**

---

## 1. Wave 2.3 deliverable summary

| Spec | Lines | Status | Critical content |
|---|---|---|---|
| `_rebuild-component-registry.md` (S3) | 906 | DONE | 130 rows (44 atomic + 49 molecular + 37 layout; +2 from D5/D6 splits); D5 + D6 entries explicit; 12 UIKit aliasing decisions (7 separate + 5 merged); @taxonomy_chips_strip verbatim carrier; 5 inline sketch block-specs (button/input/chip/badge/toggle); block-spec.md template; 8 open gaps |
| `_rebuild-build-pipeline-spec.md` (S4) | 1255 | DONE / READY FOR GATE 5 | A1 LOCKED implementation: `@ts-deps:` parser at `tools/build/parse-deps.js` (shared with S6); bundle script `bundle-css.js` (self-contained Node, zero external deps); dist/ committed (Rule 13 erosion closed); .gitattributes linguist-generated; 13-tier cascade order; infrastructure category at `sandbox/infra/`; marquee fix confirmed (`pauseOnHover: true` in `toolskin.js:2620`); npm + jsdelivr + WordPress plugin outlined; 3 Gate 5 OQs |
| `_rebuild-autonomous-protocol.md` (S5) | 578 | DONE | 3 tiers (PERMISSIVE/STRICT/ALWAYS STRICT) with 10/12/15 gates each; parity protocol with pixel-diff bands (<2% PERM auto-pass / 2-5% STRICT review / >5% halt+escalate); 9-audit matrix; context-budget 70% halt threshold; A3 marquee `[data-fullwidth]` promotion mechanism locked; council upgrade encoded |
| `_rebuild-governance-spec.md` (S6) | 1292 | DONE_WITH_GAPS | 23 refusal patterns across 6 categories (R-ISO/R-SCO/R-ARCH/R-COL/R-USR/R-PAT); 11 pre-commit hook checks; bash wrapper delegates to S4's parser module (A1 LOCKED collaboration); CONTRIBUTING.md 13 sections (15 rules verbatim, repo isolation, tier hierarchy, council usage with upgraded voices); Phase E SKILL.md encoding spec; 7 post-Gate-5 OQs |
| `_rebuild-design-dna.md` (Wave 1.5) | 580 | DONE_WITH_CONCERNS | 31 signature patterns (6 spacing + 7 typography + 7 color + 4 radius + 6 motion + 1 extra); 12 component DNA paragraphs (atomic/molecular/layout); 30 anti-patterns; 9 open questions; **3 in-house-skill ↔ CSS contradictions surfaced** |

---

## 2. Cross-reference verification (orchestrator pondering)

### Did S3 component registry have design DNA per block?

**NO** — Wave 1.5 dispatched AFTER S3. By design. The plan was: S3 produces structural registry; Wave 1.5 layers design DNA on top. S3's registry has notes column that future Sessions can amend with design DNA pointer per block.

**Action:** Session 2 startup adds a per-block "Design DNA pointer" column to S3 registry, citing the relevant Design DNA F section paragraph. This is Session 2 housekeeping, not a Wave 2 re-dispatch. Acknowledged.

### Did S4 build pipeline preserve design intent in concatenation order?

**YES.** S4 §3 cascade order is byte-for-byte preservation (no rule reordering, no specificity optimization). A1 LOCKED #8 explicit: "the bundler does NOT optimize selector specificity or reorder rules within a block. Block author intent is preserved byte-for-byte." Aligned with Design DNA §I checklist.

### Did S5 autonomous protocol's parity criteria include design DNA verification?

**YES, conditionally extended.** S5 §5 parity-check definition says "Visual DNA: matches `_rebuild-design-dna.md` criteria (once Wave 1.5 lands)." Wave 1.5 has now landed — Session 2 startup task is to formally extend S5's G1 parity criterion with the Design DNA §I checklist. Acknowledged.

### Do S4 and S6 share the parser module per A1 Resolution?

**YES.** S4 §7 defines the parser module API (`parseDeps`, `topoSort`, `diffSandboxVsBundlerOrder`, `validate`). S6 §3 bash wrapper invokes `node tools/build/precommit-validate.js`. Both reference the same shared parser per A1 Q3 lock. Aligned.

### Are the 23 refusal patterns from S6 covered by the Design DNA anti-patterns?

**YES, with extension.** S6's 23 refusal patterns cover repo isolation, scope, architecture, Rule 15 color, consumer anti-patterns, and pattern violations. Design DNA §G adds 30 VISUAL anti-patterns (Material/Bootstrap/Tailwind/shadcn/generic CSS/visual identity defaults). Design DNA anti-patterns extend S6's catalog with a new family **R-DNA-1..6 (visual identity violations)** that Session 2 housekeeping adds to S6's spec. Pattern hook R-PAT-6 is already a stub in S6 §2 for this.

---

## 3. Conflicts surfaced (classification)

### 3.1 RESOLVED at synthesis (no Gate 5 action needed)

| # | Topic | Resolution |
|---|---|---|
| C1 | S5 parity extends with Design DNA once Wave 1.5 lands | Wave 1.5 landed; Session 2 startup wires Design DNA §I into S5 G1 |
| C2 | S3 registry "Design DNA pointer" per block | Session 2 startup housekeeping; not a Wave 2 re-dispatch |
| C3 | S6 refusal pattern R-PAT-6 (design DNA stub) → R-DNA-1..6 family | Session 2 startup augments S6 with Wave 1.5 anti-patterns |
| C4 | `--ts-this-bg-dark` declared twice in v1 CSS (Design DNA OQ-C-extra) | S2 already enforces single declaration; rebuild ships clean |
| C5 | Dim-ladder 7→4 contraction (Design DNA OQ-C7) | S2 spec already proposes 4-step; Sessions 4+ document migration |

### 3.2 OWNER DECISIONS AT GATE 5

**Architecture / build / runtime decisions (carried from Gate 4):**

| ID | Decision | Recommendation |
|---|---|---|
| **D2** | Apcach runtime Path A (bundled, ~25-30KB measured per S1 §9) vs Path B (CSS-only) vs Hybrid | **Hybrid** — default Path B ships; opt-in `toolskin.full.min.js` adds Path A |
| **D3** | OKLCH browser baseline (mid-2023+: Chrome 111 / Safari 16.4 / Firefox 113) | **Accept** — no polyfill per Rule 13; T3 §10.2 + S1 §5.4 verify |
| **D4** | npm package name `toolskin@1` | **Verify with npm registry before publish**; fallback `@toolskin/core` |
| **D8** | Add `Toolskin.setTheme('light' \| 'dark' \| 'auto')` to v2 API surface | **YES** per S1 §12 — fills T3 light-mode test gap, ~30 lines |

**Design DNA contradictions (NEW, Wave 1.5 surfaced — Rule 11 halted, owner must resolve):**

| ID | Contradiction | Resolution options | Recommendation |
|---|---|---|---|
| **OQ-A6** ⭐ | Font base 13px (CSS) vs 16px (typography-master skill) — same skill bytes disagree with showcase CSS | (1) Keep 13px, update skill; (2) Move to 16px, recompute ladder, breaks parity; (3) Two primitives `--ts-fs-base-ui: 13px` + `--ts-fs-base-marketing: 16px` | **Option 1 (keep 13px)** — CSS comment at `:287` says "Smallest comfortable UI text. Override per project." 13px IS intentional. Update typography-master skill. |
| **OQ-B3** ⭐ | Heading weight 800 (literal in `H2`, `.ts-section-title`) vs token system (700/900 only, no 800) | (1) Add `--ts-font-weight-extra-bold: 800` primitive; (2) Round to 700 (lighter); (3) Round to 900 (same as H1) | **Option 1 (add 800 token)** — Preserves visual parity; S1 + S2 add the primitive |
| **OQ-D1** ⭐ | Radius base 8px (CSS) vs 10px (expert-designer skill reference) | CSS wins (in-house skill is out of date) | **Update skill** — already flagged in `_in-house-skills-update-todo.md`. No-cost resolution. |
| **OQ-E3** ⭐ | Marquee `pointer-events: none` hardcoded fix — owner-flagged as "temporary" | (1) Expose `--ts-marquee-pause-on-hover: 0` token (default off); (2) Remove the patch, accept hover-pause as feature | **Option 1 (token)** — Matches Rule 3 ts-marquee canonical pattern; S4 A8 fix already locks engine default to opt-in via `data-pause-on-hover` |
| **OQ-E4** | Reduced-motion blocks partially commented in v1 CSS | Sessions 4+ block sandboxes normalize via canonical motion-reset block at system layer | **Approve** — S2 §12 reset.css adds canonical `@media (prefers-reduced-motion: reduce)` baseline |
| **OQ-F4** | Card `.gradient` modifier uses `linear-gradient` as `--ts-card-bg` value | Rebuild splits: `background-color: var(--ts-card-bg)` + `background-image: var(--ts-this-bg-grad-N)` | **Approve** — S2 already aligns with this; Sessions 4+ card sandbox executes |
| **OQ-Logo** | No `branding/` or `pitchdeck/` directories in old repo | No additional logo system documented; wordmark-only via `.ts-topbar__logo` | **Acknowledge** — if owner has logo/mark/favicon system elsewhere, surface for rebuild; otherwise rebuild proceeds with wordmark-only |

### 3.3 OPEN GAPS BY SUB-AGENT (not blockers; for housekeeping)

| Sub-agent | Open gaps count | Owner action |
|---|---|---|
| S3 | 8 | Most are Wave 1.5 augmentation (now actionable); 1 is shared-token confirmation; 1 is bulk-family fan-out (Session 3) |
| S4 | 3 | Default apcach runtime (overlap with D2); CI integration; WP plugin timing |
| S5 | several | All map to G15 council-required cases; Session 4+ block sandboxes execute |
| S6 | 7 | All post-Gate-5: bypass log location, Wave 1.5 R-PAT-6 finalization, module config schema, commit-msg phase hook, PR-time scope, hook installer script, cross-platform verification |
| Design DNA | 9 | 7 are listed above (3.2); 2 are RESOLVED at synthesis (3.1 C4, C5) |

**Verdict:** all gaps are tractable. None block Phase E (toolskin-architecture skill) or Phase F (first commit). All map to specific Sessions 4+ work or Session 1.5 housekeeping.

---

## 4. ECC `council` invocation — NOT invoked at synthesis

Per Gate 4.5 procedural correction: orchestrator surfaces DISAGREEMENTS to owner BEFORE dispatching consumers. Council on hypotheticals before owner sees the synthesis is wasted deliberation.

The Wave 1.5 design DNA contradictions (OQ-A6, OQ-B3, OQ-D1, OQ-E3) are genuine ambiguities BUT they're 2-3 option choices with clear recommendations. Owner picks at Gate 5. If any pick is contentious, owner can invoke council with UPGRADED voices (Design Skeptic + Design Critic per Gate 4.5 lock) AFTER reviewing this synthesis.

**Council reserved for genuine forks at Gate 5+:** if owner picks OQ-A6 Option 3 (two base primitives — complex), invoking Design Skeptic + Design Critic to deliberate makes sense. The recommendations above (Option 1 for most) are minimal-disruption defaults.

---

## 5. Session 2-N sequencing recommendation

Per S5 §12 + T1 §2 tier counts + S3 registry sketches:

| Session | Scope | Tier autonomy | Time est. |
|---|---|---|---|
| **Session 1** (this one) | Bootstrap + 10 specs + design DNA + governance | All STRICT (owner-at-every-gate) | ~6 hrs (in progress) |
| **Session 1.5** (post-commit housekeeping) | In-house skills update pass; S3 design DNA pointer column; S6 R-DNA-1..6 family addition | Owner-led housekeeping | ~1 hr |
| **Session 2** | Primitives implementation: `assets/css/next/primitives/colors.css` + `tools/color-engine/generate-colors.js` (runs apcach); spacing/typography/radius/motion primitives | Semi-autonomous (PERMISSIVE-equivalent — primitives are foundational) | ~3-4 hrs |
| **Session 3** | System layer implementation: `assets/css/next/system/*.css` + shared-tokens layer skeleton; `_base.html` actual file written | Semi-autonomous | ~3-4 hrs |
| **Session 4** | First 5 atomic blocks per S3 sketches: `.ts-btn`, `.ts-input`, `.ts-chip`, `.ts-badge`, `.ts-toggle` — PERMISSIVE auto-progress, owner reviews PRs in morning | Autonomous overnight | ~30 min × 5 = 2.5 hrs |
| **Sessions 5-N** | Remaining ~39 atomic blocks, parallelized across sub-agent runs | Autonomous (PERMISSIVE) | scales with parallelism |
| **Session N+** | 49 molecular blocks one at a time (STRICT halt-for-approval) | Semi-autonomous | ~45 min × 49 = ~37 hrs across sessions |
| **Session NN+** | 37 layout blocks (ALWAYS STRICT, owner-at-every-step) | Owner-led | ~90 min × 37 = ~55 hrs across sessions |

Total estimate for v2 ship: **100+ hours across Sessions 1-NN**, with the first ~40 hours being the high-leverage architecture + primitives + system + atomic blocks. Molecular and layout work scales with owner availability.

---

## 6. Risk register (medium+)

| Risk | Source | Severity | Mitigation |
|---|---|---|---|
| Owner picks OQ-A6 Option 3 (two base primitives) — adds complexity to S1+S2 | Wave 1.5 contradiction | MEDIUM | Recommend Option 1 (keep 13px); if owner picks Option 3, plan +25% scope to S1+S2 |
| OQ-B3 adds `--ts-font-weight-extra-bold` primitive — S1 spec needs amendment | Wave 1.5 contradiction | LOW | One-line primitive addition; trivial S1 amendment |
| Design DNA §I 30-item checklist → block sandbox audit time grows | S5 G1 extension | LOW | Audit is automated where possible (regex checks for raw colors, etc.); manual review per block |
| S4 bundler script + S6 hook share parser module — coupling could create bugs | A1 Q3 collaboration | LOW | Single source of truth at `tools/build/parse-deps.js`; both S4 and S6 reference same exports |
| dist/ commits cause large diffs in code reviews | A1 Q4 commit policy | LOW | `.gitattributes linguist-generated` + `merge=ours` reduces noise per A1 Q4 |
| Apcach Path B CSS-only loses contrast verification at gamut edges | T3 §4 + S1 §9 | LOW-MEDIUM | Hybrid recommendation: power users opt-in to Path A; default Path B is good for ~80% of hues |
| Session 4+ block sandbox sub-agents accidentally violate Design DNA | Wave 1.5 + S6 | LOW | S6 hook Check 11 stub + Design DNA §I checklist + S5 G1 extension catches at PR review |

---

## 7. What Session 1 PROVED

- **15 conversation rules + file 07 isolation act as a strong attractor** — three Wave 1 + six Wave 2 + one Wave 1.5 fresh-context sub-agents produced mutually consistent specs.
- **Rule 15 (apcach) is enforced top-to-bottom** — S1 primitives, S2 derivative chain, S3 component registry, S4 bundler (preserves byte-for-byte), S5 G3 (no raw color), S6 R-COL-1 refusal pattern all converge.
- **A1 council preempt was the right call** — owner picks via `a1-council-resolution.md` gave S4 a concrete starting point; Skeptic dissent preserved as documented fallback if owner picks differently at Gate 5+.
- **Wave 1.5 design DNA closed the visual identity gap** — surfaced 3 in-house-skill ↔ CSS contradictions (Rule 11 halted, not auto-resolved) AND extracted 30 anti-patterns that S6 will absorb.
- **Sequential S1→S2 then parallel S3-S6 dispatch model was effective** — S2 consumed S1's locked output, S3-S6 parallelized cleanly with no inter-file conflicts (each writes to its own spec file).
- **Council upgrade pattern (Design Skeptic + Design Critic) reserved for visual decisions** is now encoded in S5 + S6 + queue. Future councils on visual matters use upgraded voices.

---

## 8. What Session 1 LEFT for Gate 5 / Sessions 2+

| Layer | Open items | Owner action | Where |
|---|---|---|---|
| Gate 5 architectural | D2, D3, D4, D8 (4 items) | Pick now | §3.2 above |
| Gate 5 design DNA | OQ-A6, OQ-B3, OQ-D1, OQ-E3 (4 items) | Pick now | §3.2 above |
| Gate 5 design DNA | OQ-E4, OQ-F4, OQ-Logo (3 items) | Acknowledge | §3.2 above |
| Session 1.5 housekeeping | In-house skills update; S3 design DNA pointer; S6 R-DNA family | Lead | §3.1 + §5 |
| Phase E | Build toolskin-architecture skill from these 10+1 specs | Owner approves at Gate 6 | Next phase after Gate 5 |
| Phase F | First commit on fresh repo | Owner approves at Gate 7 | Final phase of Session 1 |
| Sessions 4+ | 128 block sandboxes per S3 registry + S5 protocol | Tier-based autonomy | Future sessions |

**Nothing was silently dropped.** Every sub-agent's open questions are accounted for above.

---

## 9. Status

**Synthesis status:** `READY FOR OWNER GATE 5 REVIEW`

**Orchestrator action items if Gate 5 approves:**
1. Update queue with Gate 5 locks (D2/D3/D4/D8 + design DNA picks)
2. Schedule Session 1.5 housekeeping (in-house skills update + S3+S6 augmentation)
3. Move to Phase E — build `toolskin-architecture` skill, install S6 governance artifacts (pre-commit hook + CONTRIBUTING.md)
4. Halt at Owner Gate 6 (skill review)
5. Move to Phase F — first commit on fresh repo
6. Halt at Owner Gate 7 — Session 1 ends, sleep, Session 2 starts tomorrow with primitives implementation

**If Gate 5 finds issues:** any Wave 2 sub-agent or Wave 1.5 can be re-dispatched with corrected brief; iteration is allowed and expected.

**If Gate 5 wants council deliberation on any owner-decision item:** invoke ECC `council` with UPGRADED voices (Design Skeptic + Design Critic) per Gate 4.5 lock. Suggested items if any: OQ-A6 (font base 13px vs 16px — visual identity impact), OQ-E3 (marquee pointer-events — Rule 3 canonical pattern).

---

## Appendix Gate-5-Council

**Authored:** Session 1 Day 2 (2026-05-19), per Day 2 paste-and-go brief Step 3.

**Mandate (binding):** Picks STAND. This audit is NOT re-deliberation. Council provides (1) audit-trail justification for Session 4+ sub-agents, (2) design-DNA blind-spot catching, (3) skill-content authoring source material for Phase E `toolskin-architecture/SKILL.md`, (4) future-proofing.

**Protocol:** 4 UPGRADED voices per Gate 4.5 lock — Architect, Design Skeptic, Pragmatist, Design Critic. Two thematic batches. Single round per batch. Fresh subagent context per voice (anti-anchoring — voices did not see each other's outputs). Design Skeptic + Design Critic were required to read `_rebuild-design-dna.md` + Tier 1 in-house skills (expert-designer, typography-master, design-tokens-2.0) before responding.

**Outcome summary:** 3 fundamental implications surfaced — **HALT triggered per Gate 4.5 procedural correction**. Picks themselves are not reversed; implications are corrective additions that require owner decision before Phase E SKILL.md encoding proceeds. See §Fundamental Implications Surfaced and §Addenda below.

---

### Batch 1 — Architecture (D2 / D3 / D4 / D8)

#### Voice headlines

- **Architect:** Dependency chain D3 → D2 (Path B viability) → S4 bundle emission → D8 (theme operates on same primitive substrate) is internally consistent. Hybrid (D2) explicitly honors both Rule 13 (default zero runtime apcach) and Rule 5 (opt-in runtime recompute). No fundamental implications. Picks stand.
- **Design Skeptic:** Path B static (D2) + `setTheme('light')` (D8) produce a **compound visual failure**: 14%/6%/32% mixing constants (Wave 1.5 §C7) were tuned for dark surfaces but Path B pre-bakes them at build-time and `setTheme` does not re-tune them. **HALT-worthy.** Plus D3 `color-mix(in srgb)` Safari clipping risk on edge accent hues (deep blue / deep red).
- **Pragmatist:** Picks stand. Two amendments: (1) `setAccent` in Path B should emit `console.warn` for OKLCH-edge inputs to avoid silent APCA Lc 60 failures; (2) D4 `npm view toolskin` verification should run TODAY before Phase F commit, not Session 1.5 — name strings get baked into AI-builder training corpora and CDN paths irrecoverably.
- **Design Critic:** D3's OKLCH baseline acceptance lacks an **explicit dual-emission mandate** (sRGB fallback in the same cascade pattern). Without it, Path B on Safari ≤15.6 / Firefox ≤112 / enterprise locked browsers collapses surface tokens to invalid → entire surface tier renders as `currentColor` or transparent → Toolskin **looks like a broken stylesheet** in WordPress legacy-browser pockets. **Rule 5 identity-preservation failure. HALT-worthy.** Plus D8 must lock to exactly `'light' | 'dark' | 'auto'` (refusal pattern R-D8 blocks fourth theme values at v2 surface).

#### Per-pick audit summary

##### D2 — Hybrid apcach (Path B default + opt-in Path A ~25-30KB)

- **Assumption:** Default Path B pre-baked OKLCH primitives serve 80% of consumers (AI artifacts, WP, static-HTML, default Vue/React); Path A `toolskin.full.min.js` opt-in serves white-label / AI-palette / multi-tenant runtime accent recompute. The 25-30KB apcach subset is tree-shakable to that ceiling.
- **Blind spots / failure modes:**
  - Architect: Cross-pick coupling to D3 — Path B viability depends entirely on native OKLCH rendering.
  - Skeptic: Derivative chain rigidity — `--ts-accent-dim-1..4`, `--ts-accent-border`, `--ts-accent-glow-bg-2`, `--ts-accent-bright-2` (DNA §C1) **freeze at build-time hue 18**. Consumer hand-edits of `--ts-accent` get visually broken: primary button uses new hue but radial glow ghosts orange. Status-variant chips (`.ts-chip--success/warning/danger`) need pre-baked accent ladders for each status, not just primary.
  - Pragmatist: `setAccent` returns void with no contrast-failure signal. Consumer ships deep-blue accent, derivative drops below APCA Lc 60 silently.
  - Critic: AI-builders (V0, Lovable, Bolt, Claude artifacts) will emit Path B CDN tag by default — must be prompt-injected docs to request Path A for runtime-customizing scenarios.
- **Severity:** HIGH on Rule 5 + Rule 15 compound surface; MEDIUM on bundle assumption alone.
- **Skill-content material:** *"Toolskin ships Hybrid apcach: Path B (default ~80KB) = static pre-baked OKLCH primitives derivation; Path A (opt-in ~25-30KB extra) = bundled apcach subset for runtime contrast verification. The two bundles share an identical primitive contract — Path A's recompute output is bit-identical to Path B's static output for the default accent. **Path B build pipeline MUST emit derivative chains for every accent state (primary + status variants success/warning/danger), pre-baked as separate ladders.** AI-builder integrations + WordPress plugin admin UI MUST surface a 'verify contrast' opt-in that switches to Path A. Audit substrate (S5 G2) is always Path B output; runtime recompute is never the source-of-truth for contrast verification. Refusal pattern R-DNA-Accent-Frozen: anti-pattern is documenting `--ts-accent` raw-token-edit as Path B's customization story."*

##### D3 — Accept OKLCH mid-2023+ baseline, no polyfill per Rule 13

- **Assumption:** ~95-97% global browser share at Toolskin ship date (late 2026) supports OKLCH natively. Rule 13 forbids polyfill. OKLCH baseline IS Toolskin's minimum browser target.
- **Blind spots / failure modes:**
  - Architect: Baseline is architectural floor; not re-litigated per-block.
  - Skeptic: Safari 16.3 (~3-5% mobile traffic in 2026 LTS) gets undefined `--ts-on-accent` → orange-on-orange button text possible. `oklch(from ...)` relative-color syntax is even narrower support. Safari's srgb gamut clipping on near-edge hues (yellow/lime, 0.75 luminance threshold flip) renders ~2 ΔE different from Chrome — 14%/6%/32% mixing constants were tuned in Chrome.
  - Pragmatist: No graceful fallback declared anywhere — legacy browsers see broken-stylesheet rendering with no console error.
  - Critic: **Dual-emission mandate missing.** WordPress on locked enterprise Safari = Toolskin renders as broken stylesheet.
- **Severity:** MEDIUM-HIGH (Rule 5 identity failure in legacy-browser pockets).
- **Skill-content material:** *"Toolskin v2 targets Chrome 111+ / Safari 16.4+ / Firefox 113+ (mid-2023) for OKLCH and `color-mix(in oklch)`. Per Rule 13, no runtime polyfill ships. **MANDATORY MITIGATION (locked by Gate 5 council):** every primitive declaration in `assets/css/next/primitives/colors.css` ships with an sRGB fallback in the same custom property cascade — `--ts-bg-body: #0c0d0f; --ts-bg-body: oklch(...);` — so legacy browsers get the hex and modern browsers get OKLCH. apcach build script emits BOTH via `apcachToCss()` + `culori.formatHex()`. Refusal pattern R-D3-dual-emit: sub-agents that emit `oklch()` declarations WITHOUT a paired sRGB fallback in the same rule block halt at pre-commit. Browser support documented in `dist/README.md`."*

##### D4 — Verify-first `toolskin@1` npm name with fallback `@toolskin/core`

- **Assumption:** Unscoped `toolskin` name is strategically clean for branding/CDN paths; verification is one CLI call (`npm view toolskin`); fallback `@toolskin/core` if collision.
- **Blind spots / failure modes:**
  - Architect: D4 is decoupled from architecture (string-level identity); doc-level edits on fallback, not code/architecture changes.
  - Skeptic: Name carries brand identity. Package name appears in install commands, dev-tools elements, IDE imports — fallback `@toolskin/core` splits visual identity in two surfaces ("Toolskin" canonical vs `@toolskin/core` package).
  - **Pragmatist: AI artifact training data references will outlive published packages.** A wrong pick at first commit propagates into Claude/V0/Lovable training corpora and cannot be retracted. Verification MUST run before any docs reference the unscoped name. Recommended amendment: run `npm view toolskin` TODAY in Phase E checklist before Phase F commit, not Session 1.5.
  - Critic: Use `<TOOLSKIN_NPM>` placeholder in spec docs authored before verification; sed-replace at verification close. Pre-commit hook (S6 R-D4) flags hardcoded `toolskin@1` strings outside canonical sources until verification logged.
- **Severity:** CRITICAL but PROCEDURAL — name is forever once published.
- **Skill-content material:** *"Canonical package: `toolskin@1` (unscoped) — verified available via `npm view toolskin` BEFORE Phase F first commit. Fallback locked: `@toolskin/core` (scoped namespace). If fallback fires, ALL future packages use the same scope (`@toolskin/runtime`, `@toolskin/icons`) — never mix scoped + unscoped. Refusal pattern R-D4: sub-agents reference package via `<TOOLSKIN_NPM>` placeholder until Session 1.5 verification log; then sed-replace. CDN canonical: `https://cdn.jsdelivr.net/npm/toolskin@1/dist/toolskin.min.{css,js}`. Pin `@1` (semver major) in all docs; `@latest` discouraged. Once locked, name = identity binding; owner approval required to rename."*

##### D8 — YES add `Toolskin.setTheme('light' | 'dark' | 'auto')` to v2 API

- **Assumption:** `data-theme` is canonical attribute (A9 lock). S2 derivative chain is theme-agnostic by construction (Rule 15 apcach derives both modes from same math). 30-line API is thin wrapper.
- **Blind spots / failure modes:**
  - Architect: D8 exposes any S2 light-mode token gap earlier rather than later — gap is already a Session 3 surface, not new architectural work.
  - **Skeptic: COMPOUND FAILURE with D2.** FOUC on theme swap (synchronous reflow across 20+ derivative tokens per surface scope = paint hitch). `auto` mode needs `matchMedia` listener bound or stuck on initial OS state. **Light-mode harmonic integrity:** 14%/6%/32% load-bearing mixing constants (C7) were tuned for dark surfaces. Path B + `setTheme('light')` ships **muddy light mode** with no mitigation. Recommend dual mixing constants (`--ts-mix-dark-pct: 14%`, `--ts-mix-light-pct: 8%`) OR theme-paired Path B derivative ladders OR restrict `setTheme` to Path A only.
  - Pragmatist: Without `setTheme`, T3 §7 light-mode verification tests are unreachable from public API. Adding it gates the gap visible.
  - Critic: Lock API surface to exactly `'light' | 'dark' | 'auto'`. Refusal pattern R-D8: PRs proposing `'sepia'`, `'high-contrast'` halt — those are CSS-override territory.
- **Severity:** **CRITICAL** (most-visible API surface; first user touchpoint).
- **Skill-content material:** *"`Toolskin.setTheme('light' | 'dark' | 'auto')` is v2 API. Synchronous. Writes `data-theme` to `<html>` (canonical attribute, A9 lock). For `'auto'`, registers `matchMedia('(prefers-color-scheme: dark)')` listener (auto-flips on OS changes; only persistent runtime state outside `setAccent`). Emits `ts:theme` CustomEvent on window post-mutation. Companion: `Toolskin.getTheme()` returns resolved mode. Light-mode primitives = apcach-generated counterparts under `[data-theme='light']` selector (Rule 15). Paired with view-transition declaration (`::view-transition-old/new` over `--ts-dur-base 300ms --ts-ease-out`) to prevent FOUC. **Light-mode mixing constants are theme-dual primitives (`--ts-mix-dark-pct: 14%`, `--ts-mix-light-pct: 8%`) — pending owner-confirmed strategy per HALT item #1.** Sessions 4+ block sandbox checklist: verify F1–F12 component DNA under both themes AND a runtime `setTheme()` swap with no FOUC. Refusal pattern R-D8 locks API surface to three values."*

---

### Batch 2 — Design DNA (OQ-A6 / OQ-B3 / OQ-D1 / OQ-E3)

#### Voice headlines

- **Architect:** Four picks form a coherent design-DNA primitive set. Cross-pick coupling that matters most (OQ-A6 ↔ OQ-B3 hierarchy load-sharing at dense base; OQ-D1 ↔ nest-reduction depth budget) reinforces rather than contradicts. Skill conflict resolutions (typography-master 16→13, expert-designer 10→8) correctly routed through `_in-house-skills-update-todo.md`. No fundamental implications. Picks stand.
- **Design Skeptic:** **Space Grotesk 800 weight availability — HALT.** Standard open-source Space Grotesk distribution ships 300–700 only. Declaring `--ts-font-weight-extra-bold: 800` against standard distribution triggers synthetic browser faux-bold violating G6 ("Inter-grade defaults Toolskin rejects"). Need owner-confirmed loading strategy (variable-axis build OR weight-roundoff to 700/900) before OQ-B3 commits to S1. Plus APCA contrast concerns at 13px body, 2.4px chip-radius subpixel rendering, reduced-motion + marquee composition.
- **Pragmatist:** No fundamental shipping implications. Picks stand. Friction items are execution work (variable-font axis URL verification at S1, skill-doc synchronization at Session 1.5, CSS↔JS contradiction resolution for OQ-E3 in S4). Highest user-visible risk = OQ-B3 font-axis loading; gate-check before Phase F.
- **Design Critic:** Picks stand. OQ-A6 13px base interacts with Rule 15 APCA in non-obvious way for consumers overriding `--ts-fs-base` < 13px — contract limit addendum (NOT a HALT). All four picks survive Rule 5 drop-in across 5 hosts cleanly; OQ-E3 establishes Rule 3 canonical data-attribute opt-in template that constrains every future component (chip strip pause-on-overflow, accordion auto-expand, modal close-on-escape).

#### Per-pick audit summary

##### OQ-A6 — Keep 13px CSS base font-size; update `typography-master` skill

- **Assumption:** 13px is the smallest comfortable UI text; harmonic ladder anchored at this base (body 1.12 / display 1.333) produces legible body + dense scanning + dramatic display contrast. Tool-system UI density signal, not marketing readability default.
- **Blind spots / failure modes:**
  - Architect: Single anchor point of B-tier typographic system. Eyebrow at 9px sits outside ladder by role. Container-scope rescalability (B6) is the architectural payoff. Rebuild **accepts non-4pt-snapped intermediate sizes** as tradeoff vs typography-master's generic grid guidance.
  - Skeptic: APCA targets shift with font-size — `--ts-text-secondary/muted` against `--ts-bg-1/3` at 13px may surface failures in S1's 48-pair contrast table that weren't measured at 16px. `--ts-fs-2xs` ≈ 10-11px Space Grotesk tracked uppercase loses legibility on dark surfaces. Light-mode inversion (D8) hasn't been visually verified at 13px.
  - Pragmatist: `rem` math feels off — pasted third-party snippets break silently. Chrome's accessibility minimum-font-size can bump `--ts-fs-2xs` upward, breaking density. APCA tables must be computed against 13px-derived sizes, not 16px-equivalent.
  - **Critic: WordPress / Tailwind / React/Vue starter templates set `body { font-size: 16px }` at low specificity.** Toolskin's `:root { --ts-fs-base: 13px }` competes; source-order loser. Triple-declaration (`:root`, `html`, `body`) needed to win. Addendum: consumer overrides < 13px void apcach contract (contract limit footnote).
- **Severity:** HIGH (Rule 5 identity preservation in host integrations).
- **Skill-content material:** *"Toolskin operates at `--ts-fs-base: 13px` by intent — denser than the 16px Material/Tailwind/Bootstrap default. Signals tool-system UI density (Wave 1.5 §B5). Harmonic ladder: body ratio 1.12 (minor-second), display ratio 1.333 (perfect-fourth). Eyebrow (`--ts-fs-eyebrow: 9px`) sits outside ladder by role. Container-scope rescalability: override `--ts-fs-base` on any subtree recomputes the entire ladder for that subtree (Rule 4). **Triple-declaration mitigation (locked by Gate 5 council): S1 emits `--ts-fs-base: 13px` on `:root`, `html`, AND `body` to win source-order specificity against WP/Tailwind host themes.** APCA contrast tables in S1 §7 computed at 13px-derived rung sizes, not 16px-equivalent. **Contract limit footnote (Rule 15 addendum):** consumer overrides `--ts-fs-base` < 13px void apcach contract; ≥ 13px preserves guarantees (more headroom)."*

##### OQ-B3 — Add `--ts-font-weight-extra-bold: 800` primitive in S1

- **Assumption:** Complete 7-step weight ladder (300/400/500/600/700/800/900) needed for semantic role-coding. Tokenizing replaces literal `800` in H2 + `.ts-section-title`.
- **Blind spots / failure modes:**
  - Architect: 800 is load-bearing for visual hierarchy at 13px base — H2 vs H3 needs weight delta (size delta alone insufficient at dense base). No S2 derivative impact (weights are scalars).
  - **Skeptic: Space Grotesk standard distribution ships 300–700 only.** 800 against standard → synthetic browser faux-bold → muddy stems, broken letter-spacing, "AI-default cheap typography" signal — violates G6.
  - **Pragmatist: Variable-font axis loading is the critical gate.** If `wght@500..700` URL is used, 800 silently falls back. Recommend variable-font URL `wght@300..900` (~100KB single file) over 7 statics (~250KB+ payload). `font-display: swap` + metric-compatible fallback prevents FOIT on H2 flash.
  - Critic: LOW Rule 5 risk (weights don't compete with host themes at cascade); HIGH pattern integrity risk (literal violates Rule 2; rounding to 700/900 collapses heading hierarchy).
- **Severity:** **HIGH** (font-axis loading determines whether H2 ships correctly).
- **Skill-content material:** *"`--ts-font-weight-extra-bold: 800` is a tier-1 primitive in S1. 7-step ladder (300/400/500/600/700/800/900) semantically role-coded: 400 button/body, 500 lead/caption, 600 H3–H6/panel-header, 700 chip/overline, 800 H2/.ts-section-title, 900 H1/hero/display. **Binding shipping constraint (locked by Gate 5 council): the Space Grotesk loading URL MUST include the 800 axis weight, verified via DevTools Network panel showing `wght@300..900` axis range or explicit `;800;` static.** Synthetic faux-bold is FORBIDDEN per G6. Toolskin ships Space Grotesk as variable font (~100KB) rather than 7 statics. `font-display: swap` + metric-compatible fallback (Fontshare Space Grotesk Fallback) prevents FOIT on H2 flash. Sub-agents rounding 800 to 700/900 halt per Rule 2/G6 violation. **PENDING OWNER CONFIRMATION (HALT item #3):** loading strategy locked to variable-axis or weight-roundoff — Gate 5 surfaces the question."*

##### OQ-D1 — Keep 8px CSS radius base; update `expert-designer` skill

- **Assumption:** 8px feels modern-software-tool (between 6px Tailwind/Bootstrap and 12px iOS). Radius ladder × component-height ratios produce coherent corners across 128-component registry.
- **Blind spots / failure modes:**
  - Architect: 8px base is harmonically coupled to 13px font + height ratios + 2px nest-reduction + sharp-corner intentional points. Changing the base = 4-variable coupled disturbance.
  - Skeptic: At certain DPRs (1x screens, 125% Windows scaling), `--ts-radius-2xs ≈ 2.4px` renders 2px (squared) or 3px (rounded) — chips look different on Windows vs macOS Retina. Large modal `--xl 1100px` with 16px radius reads proportionally tight (wants 24-32px). Nest-reduction depth-3 hits 2px = nearly-sharp, collides with D3 intentional sharp-corner intent.
  - Pragmatist: **Skill-rule contamination risk.** `expert-designer` Tier 1 priority says 10px — if not closed at Session 1.5 BEFORE Session 2, sub-agents introduce 10px literals fighting 8px primitive. 8px base + 2px reduction = 4-step telescoping → caps nesting at depth-3 (Toolskin's max composition depth).
  - Critic: Tailwind `rounded-lg` = 8px aligns exactly; MUI `shape.borderRadius: 4` competes only via T3 §5.3 lib-theme mapping (lib applies to lib components, not Toolskin). Drop-in survives all 5 hosts.
- **Severity:** MEDIUM (visual identity perceptibly shifts at 10px; skill-contamination is the higher-severity concern).
- **Skill-content material:** *"`--ts-radius-base: 8px` is canonical (Rule 10, reference CSS `:484`) — NOT the 10px in legacy `expert-designer/references/toolskin.md`. Ladder derives via `× scale`: 2xs ≈ 2.4px (chip/badge), xs ≈ 4.8px, sm ≈ 7px (button/input), md = 8px (card), lg ≈ 9.2px (marquee), 2xl ≈ 12px, xl ≈ 16px (modal), full = 9999px (pill). **Load-bearing for nest-reduction system (`--ts-radius-nest-reduction: 2px`): 4 telescoping depth levels (8/6/4/2) match Toolskin's composition depth budget (modal > accordion > card > inset-accent). Block sandboxes cap nesting at depth-3 OR resolve to flat surface.** Sharp corners (radius 0) at chip-strip / tabs-bottom / inset-action / marquee-fullwidth are NEVER stylistic — they exist only at edge-flush composition points (D3). `expert-designer` skill toolskin.md updated to 8px in Session 1.5 housekeeping per `_in-house-skills-update-todo.md`."*

##### OQ-E3 — Expose `--ts-marquee-pause-on-hover: 0` token (opt-in via Rule 3 data-attribute pattern); S4 A8 locks engine default

- **Assumption:** Marquee's seamless `translateX(-50%)` infinite-loop is canonical (Rule 9). Hover-pause is OPT-IN. Showcase's `pointer-events: none` workaround is temporary fix (author comment `:15795`) and the architectural correction is tokenized opt-in via `animation-play-state`.
- **Blind spots / failure modes:**
  - Architect: Cross-coupling with Rule 3 (data-attribute is canonical opt-in mechanism, not class-name) AND Rule 9 (marquee pattern is canonical and non-deviating). Removes `pointer-events: none` hack AND fixes engine default to match design intent.
  - Skeptic: Hover-pause + `linear` animation = visual snap (jumps back to motion). Violates "motion should feel INEVITABLE" (design-theory §0B.5). Subpixel rounding can cause 1px seam during resume frame. **`prefers-reduced-motion` must compose with token** — currently unspecified.
  - Pragmatist: CSS↔JS contradiction in showcase (CSS `pointer-events: none` vs JS engine `pauseOnHover: true`). Both halves must align: CSS token + cascade AND JS engine default `pauseOnHover: false`. Otherwise race condition where engine "fixes" CSS-applied pause. Marquees MUST NOT contain interactive children — `::before` duplicate diverges from original on clicks.
  - **Critic: Rule 9 precedent risk — the way OQ-E3 exposes this opt-in establishes the template for every future component opt-in.** Must be `data-mq-pause-on-hover` attribute + token, NEVER class modifier (`.ts-marquee--pause`). If mis-implemented, Toolskin develops the Bootstrap problem (feature flags spread across class names).
- **Severity:** MEDIUM-HIGH for precedent + accessibility (reduced-motion composition); LOW for the local fix itself.
- **Skill-content material:** *"Marquee canonical pattern (Rule 9 + Rule 3): `translateX(0 → -50%)`, `--ts-marquee-speed: 45s linear infinite`, seamless duplication via `::before { content: attr(data-text-content) }`. Hover-pause is OPT-IN via `--ts-marquee-pause-on-hover` token consumed through `animation-play-state: var(--ts-marquee-pause-on-hover, running)`. Default = `running` (no pause), opt-in via `data-mq-pause-on-hover` attribute → `paused`. **BINDING (locked by Gate 5 council):** (a) compose with `@media (prefers-reduced-motion: reduce) { --ts-marquee-pause-on-hover: paused }` for motion-sensitive users; (b) marquees MUST NOT contain interactive children (`::before` duplicate diverges from original on clicks); (c) CSS token + JS engine default `pauseOnHover: false` align — no race condition. **Pattern precedent for all canonical opt-ins:** token + data-attribute, NEVER class modifier. Future components inherit this template: chip-strip pause-on-overflow, accordion auto-expand, modal close-on-escape, toast auto-dismiss. The showcase's `:15795` `pointer-events: none` workaround is REMOVED in rebuild — tokenized opt-in is the architectural correction."*

---

### Fundamental implications surfaced — HALT triggered per Gate 4.5

Council surfaced **3 fundamental implications missed at Gate 5**. Per the brief's binding ("Do NOT auto-resolve"), these surface to owner. Picks themselves stand; implications are corrective additions that affect downstream encoding (Phase E SKILL.md content + S1/S4 spec mandates).

#### Implication #1 — D2 ↔ D8 compound visual failure (HIGH severity)

**Surfaced by:** Design Skeptic Batch 1.

**The implication:** Wave 1.5 §C7 documented 14% / 6% / 32% load-bearing mixing constants for surface derivative tuning. These were tuned **against dark surfaces in the showcase**. D2 Path B (default) pre-bakes derivatives at build-time using these dark-tuned constants. D8 `setTheme('light')` swaps `data-theme` and re-resolves surface tokens — but the mixing constants are **still dark-tuned**. Result: every Path B consumer who uses `setTheme('light')` ships **muddy light mode** with the wrong percentage mixing.

**Why missed at Gate 5:** D2 and D8 were audited in isolation. The compound failure only emerges when a consumer uses both — exactly the most-common deployment pattern (default Path B + setTheme exposed in v2 API).

**Owner decision options:**
- **(A)** Path B build pipeline emits theme-paired derivative ladders (dark + light, both pre-computed). Larger pre-baked CSS, but Path B + setTheme works cleanly.
- **(B)** Restrict `setTheme` to Path A only (runtime recompute via apcach); Path B documents `[data-theme]` as build-time-only. Smaller bundle but `setTheme` becomes Path A's distinguishing feature.
- **(C)** Dual mixing constants as theme-dual primitives (`--ts-mix-dark-pct: 14%`, `--ts-mix-light-pct: 8%`), with the system layer resolving the appropriate pct under each `[data-theme]` selector. Lightweight, no bundle penalty, requires light-mode-tuned pct values (which Wave 1.5 has not measured).

**Default if owner declines decision now:** Option (A). Rationale: setTheme is the most-visible API surface (S2 §V2-API + T3 §7 verification depend on it); restricting to Path A creates a 2-bundle confusion for consumers. Theme-paired ladders is the cleanest Path B promise.

#### Implication #2 — D3 dual-emission sRGB fallback mandate missing (MEDIUM-HIGH severity)

**Surfaced by:** Design Critic Batch 1.

**The implication:** D3 accepts the OKLCH baseline without an **explicit dual-emission requirement** in the spec. Path B on legacy Safari ≤15.6 / Firefox ≤112 / enterprise locked browsers parses `oklch(...)` as invalid → `--ts-bg-body` etc. collapse to `currentColor` or undefined → entire surface tier renders broken → Toolskin **looks like a broken stylesheet** in WordPress-on-legacy-Safari and similar pockets. **Rule 5 (drop-in identity preservation) breaks silently** — no console error, no fallback CSS, just visually wrong rendering.

**Why missed at Gate 5:** D3 was framed as a binary "accept baseline / polyfill" decision. The dual-emission approach (declare both `#hex` and `oklch()` in cascade so old browsers pick hex and new browsers pick OKLCH) is technically not a polyfill (no runtime deps per Rule 13) — it's static fallback CSS the apcach build script emits. Neither Gate 4 nor Gate 5 explicitly mandated this.

**Mitigation (locked, requires owner sign-off):** Every primitive declaration in `assets/css/next/primitives/colors.css` ships dual-emission via cascade fallback pattern:
```css
--ts-bg-body: #0c0d0f;
--ts-bg-body: oklch(...);
```
The apcach build script emits BOTH the OKLCH literal and the sRGB hex via `apcach.apcachToCss()` + `culori.formatHex()`. This MUST be mandatory in spec, not optional.

**Owner decision:** Lock the dual-emission mandate? (Recommended: YES — preserves Rule 5 across WP/enterprise legacy-browser pockets; ~zero bundle penalty; honors Rule 13.)

**Default if owner declines decision now:** Lock dual-emission YES. No identified downside.

#### Implication #3 — OQ-B3 Space Grotesk 800 weight loading strategy needed (HIGH visibility, MEDIUM severity)

**Surfaced by:** Design Skeptic Batch 2 + Pragmatist Batch 2 (highest user-visible risk).

**The implication:** Space Grotesk's standard open-source distribution ships weights **300–700 only** (per `typography-master/references/font-catalog.md`). OQ-B3 declares `--ts-font-weight-extra-bold: 800` and routes H2 + `.ts-section-title` to consume it. Against the standard Space Grotesk URL, the browser silently synthesizes faux-bold at 800 — muddy stems, broken letter-spacing, "AI-default cheap typography" signal — violating G6 (Toolskin rejects Inter/Roboto/Arial-grade defaults).

**Why missed at Gate 5:** OQ-B3 was framed as a tokenization fix for the showcase's literal `800` usage. The implicit assumption was that Space Grotesk loaded at 800 weight in the showcase already. Council reading of `typography-master/references/font-catalog.md` surfaced the gap.

**Owner decision options:**
- **(A)** Confirm variable-axis Space Grotesk loading. Update font loading URL to `wght@300..900` (Google Fonts) or load variable-font woff2 (~100KB single file). Verified at S1 implementation via DevTools Network panel. **Locks G6 conformance.** Pragmatist gates this at Phase F: verify font URL includes 800 axis before commit.
- **(B)** Adjust OQ-B3 to round H2/`.ts-section-title` to existing tokens (700 = `--ts-font-weight-bold` or 900 = `--ts-font-weight-black`). Removes the 800 token. Visual hierarchy collapses slightly at 13px base (Architect: "800 is load-bearing for visual hierarchy at this dense base size").
- **(C)** Load 800 as separate static weight on top of the variable-axis loader.

**Default if owner declines decision now:** Option (A) — variable-axis loading. Rationale: typographically correct, preserves Toolskin's 7-step semantic role-coded ladder, payload acceptable (~100KB variable < ~250KB seven statics).

---

### Addenda (NOT HALT — Phase E SKILL.md should capture)

These council findings refine the picks without overturning them. Picks stand; these are corrective additions captured for Phase E encoding.

- **OQ-A6 contract limit (Design Critic Batch 2):** Consumer overrides `--ts-fs-base` < 13px void apcach contract (smaller text needs higher APCA Lc which S1's 48-pair table doesn't pre-compute). Consumer overrides ≥ 13px preserve guarantees. Capture as Rule 15 section footnote in SKILL.md: *"APCA contrast pairs computed at `--ts-fs-base: 13px`. Overrides ≥ 13px preserve guarantees; overrides < 13px void the apcach contract."*

- **OQ-A6 triple-declaration (Design Critic Batch 2):** S1 emits `--ts-fs-base: 13px` on `:root`, `html`, AND `body` to win source-order specificity vs WordPress/Tailwind/React-starter host themes that declare `body { font-size: 16px }` at low specificity. Documented in spec corpus.

- **D2/Path B status-variant accent ladders (Design Skeptic Batch 1):** Path B build pipeline emits derivative chains for primary + success + warning + danger accent states, pre-baked as separate ladders. Avoids silent `.ts-chip--success` derivative breakage on `--ts-accent` runtime edits.

- **D2 setAccent runtime warning (Pragmatist Batch 1):** Path B's `setAccent()` (no contrast verification) should emit `console.warn('[Toolskin] Runtime accent may not meet APCA Lc 60 against current surface — use setAccentVerified() (Path A) for guaranteed contrast')` when input OKLCH lightness is outside the build-time-tested band. Path A exposes `setAccentVerified()` returning a contrastReport Promise.

- **D4 npm verification timing (Pragmatist Batch 1):** Run `npm view toolskin` **TODAY in Phase E** before Phase F commit, not Session 1.5. Rationale: AI artifact training data references will outlive the package; CDN paths get baked into prompt-injected docs. Use `<TOOLSKIN_NPM>` placeholder in any docs/code authored before verification; sed-replace once verified.

- **D8 API surface lock (Design Critic Batch 1):** v2 `setTheme` accepts exactly `'light' | 'dark' | 'auto'`. Refusal pattern **R-D8** halts any PR proposing fourth theme values (`'sepia'`, `'high-contrast'`, custom) — those are CSS-override territory.

- **OQ-E3 reduced-motion composition (Design Skeptic Batch 2):** Marquee opt-in token MUST compose with `@media (prefers-reduced-motion: reduce) { --ts-marquee-pause-on-hover: paused }` for accessibility. Marquees MUST NOT contain interactive children.

- **OQ-E3 canonical-pattern precedent (Design Critic Batch 2):** The data-attribute + token mechanism (`data-mq-pause-on-hover` + `--ts-marquee-pause-on-hover`) establishes the template for every future component opt-in: chip-strip pause-on-overflow, accordion auto-expand, modal close-on-escape, toast auto-dismiss. Refusal pattern **R-pattern-opt-in** halts any class-modifier opt-in (`.ts-component--pause`).

---

### Status

**Council audit complete.** Phase E SKILL.md authoring source material captured per pick. Picks stand.

**HALT POINT TRIGGERED per Gate 4.5 procedural correction:**
Three fundamental implications missed at Gate 5 require owner decision before Phase E (SKILL.md content depends on resolutions). See §Fundamental Implications Surfaced above for the three items (#1 D2↔D8 compound visual failure; #2 D3 dual-emission sRGB fallback mandate; #3 OQ-B3 Space Grotesk 800 loading strategy).

**Default-if-no-decision proposals** (per "no clarifying questions" preference) are listed under each item. Orchestrator may proceed with defaults if owner is unavailable, or owner may direct alternatives.

**Next:** Phase E (`toolskin-architecture` SKILL.md + S6 governance) consumes the audit-trail material above as authoring source. Implementation gated on owner decision (or default acceptance).

---

## Appendix Gate-5-Council Resolutions (Day 2 owner reply, 2026-05-19)

**Source:** Owner consolidated reply, Session 1 Day 2. All 3 HALT items resolved. Phase E DEFERRED until Wave 1.6 visual audit completes + owner annotates per new Pattern 17.

**Outcome summary:**
- Resolution #1 — D2 ↔ D8 light mode: **OPTION D (REFRAME)** — none of council's A/B/C apply; mixing constants are engine-derived, not hand-tuned; spec amendments to S1/S2/Wave 1.5. Extended Rule 15 captures the binding logic.
- Resolution #2 — D3 dual-emission sRGB fallback: **YES, locked** as mandatory in spec. Refusal pattern R-D3-dual-emit + pre-commit hook check #12.
- Resolution #3 — OQ-B3 Space Grotesk 800: **OPTION A locked** — variable-axis loading `wght@300..900`. Refusal pattern R-OQ-B3 + Phase E verification gate.
- Plus: Pattern 16 (council HALT on fundamentals) + Pattern 17 (visual audit before specs) added to `rebuild-orchestration` skill (installs Session 1.5). Wave 1.6 visual audit inserted BEFORE Phase E.
- Plus: 8 council addenda auto-accepted (no HALT).

---

### Resolution #1 — D2 ↔ D8 light mode: OPTION D (REFRAME)

**Owner verdict:** NONE of the council's A/B/C apply. The framing of the implication was wrong.

**Root cause:** The Wave 1.5 §C7 mixing constants (14% / 6% / 32%) being labeled "dark-tuned" reveals a spec bug — they should NEVER have been hand-tuned per-theme to begin with. They should be derivative outputs of the apcach color engine + OKLCH inversion + surface superposition math, recomputed automatically under whichever theme is active.

**The smart color system is the answer to the implication, not a victim of it.** Both Path B AND Path A consume the same apcach-driven engine output. Light mode under `setTheme('light')` re-applies the same mathematical derivation with inverted lightness primitives. Every derivative re-resolves correctly because the system is mathematical, not hand-tuned.

#### Owner intent (verbatim, binding)

> "The core theme responds initially to a dark theme, and the smartest and most accurate way to turn the theme to light mode should avoid any hardcoding from the theme further in light mode, keeping the concept aligned with the strength of the color auto system and the surface contrast auto system, where the user can bend the contrast ratio and the palettes from the base tints that we have selected on Surface Labs presets as reference for good, handpicked, default pre-established color sets.
>
> The rest must be auto-generated along with the smart color system, and the auto-nested alternative surface system to ensure an ever-working, perfect contrast ratio on background, border, and font for all assets on any element (section > panel > card > input, and all the other rules that should have been considered in the requirements for the smart system we should provide in this product).
>
> All of this is referenced in the Toolskin design system but never fully consolidated. They all involve the accent system, the on-accent system, the on-surface, the background, the OKLCH inversion, and obviously everything working with the APCACH color engine behind to ensure everything works under the least amount of rules possible, using just tokens that drive only design decisions over which color to use, never deciding how much amount of what to use anywhere, as that is set by the core engine or the core assets design settings layer tokens."

#### Spec amendments (binding for S1 + S2 + Wave 1.5)

1. **S1 spec amendment:** ALL mixing constants, surface contrast adjustments, OKLCH inversions, and derivative-chain percentages are apcach-engine-derived outputs, not hardcoded values. No primitive declares a fixed-percentage mixing constant that won't auto-recompute under theme inversion.

2. **S2 spec amendment:** The `--ts-this-*` derivative chain consumes apcach engine output exclusively. Any rule that currently hardcodes a percentage for surface mixing (`color-mix(in oklch, var(--ts-this-bg) X%, ...)`) is REJECTED — the X% must come from a token that the engine recomputes per-theme.

3. **Wave 1.5 §C7 amendment:** The "14% / 6% / 32% mixing constants documented as load-bearing" entry is REWRITTEN to document the mixing constants as engine-derived outputs whose CURRENT measured values happen to be those percentages in dark mode — NOT as authoritative hardcoded constants.

These amendments are DOCUMENTED here as binding input for Session 2+ implementation. They do NOT require re-dispatching S1/S2/Wave 1.5 sub-agents this session — the implementation work in Session 2+ honors them directly.

---

### Extended Rule 15 (BINDING — SUPERSEDES short form everywhere)

The original Rule 15 said: "apcach is the supreme color authority."

**Extended Rule 15 (verbatim, locked at Gate 5 resolution):**

> apcach (antiflasher/apcach, MIT, Evil Martians) is the supreme color authority for the ENTIRE color derivation chain — including primitives, mixing constants, surface contrast adjustments, OKLCH inversions, nested alternative surface awareness, accent/on-accent/on-surface auto-derivation, and theme inversion (dark ↔ light).
>
> NO color value, mixing percentage, contrast adjustment, or surface-aware derivative may be hand-tuned per-theme. The smart color system + surface contrast auto-system + auto-nested alternative surface system are the FOUNDATIONAL constraints — drawn from prior Toolskin work + Surface Labs initial structure — now consolidated and adapted to apcach as the unified engine.
>
> Tokens drive ONLY design decisions (which color to use). The engine handles amount/percentage decisions (how much of what). No spec may invert this — any spec that puts amount-decisions in tokens or design-decisions in the engine is REJECTED.
>
> Surface Labs presets define handpicked default color sets as the BASE TINTS the engine derives from. Consumer can "bend the contrast ratio and the palettes from the base tints" — that bending is engine-mediated, never via hand-tuned override constants.
>
> Theme inversion (dark → light or light → dark) re-runs the same engine math with inverted lightness primitives. No separate hand-tuned theme tables. No per-theme mixing constants. No theme-specific derivative overrides.

#### Where Extended Rule 15 gets encoded

1. **This synthesis (here)** — append as binding input for Phase E SKILL.md authoring (DONE).
2. **Phase E `toolskin-architecture/SKILL.md` §2 (CONVERSATION RULES verbatim)** — Rule 15 entry uses the Extended form above, not the short form.
3. **Phase E `toolskin-architecture/SKILL.md` §10 (APCACH SUPREMACY)** — integrates Extended Rule 15 language about derivative chain + mixing constants + surface contrast + OKLCH inversions + theme inversion + Surface Labs base tints.
4. **`docs/handoffs/_in-house-skills-update-todo.md`** — add task: update `design-tokens-2.0` skill to reference Extended Rule 15 + Surface Labs presets as base tints.
5. **S1 + S2 + Wave 1.5 spec amendments** (above) reference Extended Rule 15 as authority for the amendments.

---

### Resolution #2 — D3 dual-emission sRGB fallback mandate: YES (locked)

**Owner verdict:** Lock the mandate.

Every primitive declaration in `assets/css/next/primitives/colors.css` MUST ship dual-emission cascade fallback:

```css
--ts-bg-body: #0c0d0f;                /* sRGB fallback for legacy browsers */
--ts-bg-body: oklch(0.18 0.012 250);  /* canonical OKLCH for modern browsers */
```

apcach build script `tools/color-engine/generate-colors.js` emits BOTH via `apcachToCss()` + `culori.formatHex()`. Mandatory in S1 spec, NOT optional.

#### Refusal pattern R-D3-dual-emit (add to S6 governance)

- Sub-agents emitting `oklch(...)` declarations WITHOUT paired sRGB fallback in the same rule block → halt at pre-commit.
- Pre-commit hook **check #12** added: parse all `--ts-*` declarations in `assets/css/next/primitives/*.css`, verify each color primitive has both sRGB and oklch entries.

Browser support documented in `dist/README.md`: Modern (Chrome 111+, Safari 16.4+, Firefox 113+) gets OKLCH; legacy (Safari 16.3 and below, Firefox 112 and below, enterprise locked browsers) gets sRGB hex fallback automatically via CSS cascade — zero runtime polyfill, zero Rule 13 violation, zero bundle penalty.

---

### Resolution #3 — OQ-B3 Space Grotesk 800 weight: OPTION A locked (variable-axis)

**Owner verdict:** Variable-axis font loading `wght@300..900` (~100KB single file).

#### S1 spec amendment

- Font loading URL MUST include the 800 axis. Use Google Fonts variable-axis URL `https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300..900&display=swap` OR self-host variable woff2.
- `font-display: swap` mandatory.
- Metric-compatible fallback (Fontshare Space Grotesk Fallback or system fallback) declared to prevent FOIT on H2 flash.

#### Verification at Phase E (mandatory before Phase F commit)

- Open the `dist/README.md` font loading example in a test browser.
- DevTools → Network → verify the loaded font file response includes axis range `wght 300 900` OR the explicit `;800;` static weight.
- If neither present → halt, fix URL, retest.

#### Refusal pattern R-OQ-B3 (add to S6 governance)

- Sub-agents proposing weight rounding (700/900) for H2/`.ts-section-title` halt per Rule 2 + G6 (synthetic faux-bold forbidden).
- Sub-agents proposing static-weight loading without 800 in the static list halt.

---

### Wave 1.6 — Browser visual audit (inserted BEFORE Phase E, MANDATORY)

#### Why this exists

Owner caught a fundamental gap on review: **no agent has actually viewed a rendered pixel of the existing Toolskin design system.** All Session 1 work — T1/T2/T3/S1/S2/S3/S4/S5/S6 + Wave 1.5 + Gate 5 council Design Skeptic + Design Critic — read CSS TEXT, HTML TEXT, and skill TEXT. Zero browser rendering observation.

This contradicts the owner's April 27 binding principle: *"my eye was the source of truth, not the math."*

The Wave 1.5 design DNA, framed as "closing the visual identity gap," was a code-text extraction. The council Design voices audited specs based on the same text-derived DNA — blind voices auditing blind specs.

**Risk if not fixed:** rebuild ships architecturally clean, mathematically correct, visually generic or visually wrong. The 3-month Toolskin disaster history shows multiple math-correct/visual-wrong outcomes (`--ts-on-accent` regression where dark text rendered on dark accent; FontAwesome version silent failure; typography canonicalization that broke visual hierarchy). All caught by owner's eye, none caught by code analysis.

#### Wave 1.6 deliverables

1. `tools/visual-audit/` — Playwright build-time tooling (gitignored except config; honors Rule 13).
2. `docs/handoffs/_visual-audit/screenshots/` — ~60-100 systematic PNG captures (3 viewports × 2 themes × T1-typology-driven surfaces).
3. `docs/handoffs/_visual-audit/owner-ground-truth/` — 5-10 owner GoFullPage captures (real-Chrome rendering ground truth).
4. `docs/handoffs/_rebuild-visual-audit.md` — agent's annotated per-surface findings.
5. `docs/handoffs/_rebuild-design-dna.md` — AMENDED with owner-annotated visual reality (visual + owner annotation > text-derived DNA on contradictions).
6. `docs/handoffs/_in-house-skills-update-todo.md` — extended with any in-house skill ↔ visual reality contradictions surfaced.

#### Wave 1.6 steps

- **W1.6.1** Agent installs Playwright at `tools/visual-audit/`, updates `.gitignore` for build-time artifacts (Rule 13 honored — Playwright not shipped).
- **W1.6.2** Agent writes + executes `capture.mjs`: loads `../toolskin-showcase/index.html` (+ `toolskin-lab.html` + branding/pitchdeck if present), 3 viewports (1920×1080, 1024×768, 375×812), 2 themes via DOM `data-theme` toggle, full-page + per-section element screenshots driven by T1 typology. Output PNGs to `docs/handoffs/_visual-audit/screenshots/`. **HALT W1.6.A** — surface to owner for GoFullPage captures.
- **W1.6.3** Owner installs GoFullPage Chrome extension, captures 5-10 key surfaces (hero, surface grid all 6 levels, masonry, marquee, modal-open, accordion-expanded; both themes), saves PNGs to `docs/handoffs/_visual-audit/owner-ground-truth/`, notifies agent.
- **W1.6.4** Agent dispatches Wave 1.6 Visual Audit Analyst subagent. Required reading: `_rebuild-design-dna.md` + expert-designer / typography-master / design-tokens-2.0 in-house skills + design-review (julianoczkowski Tier 2) + browser-qa (ECC Tier 5) + ALL PNGs (Playwright + owner ground-truth) via Claude native multimodal vision. Output: `docs/handoffs/_rebuild-visual-audit.md` with per-screenshot sections (surface, viewport/theme, rendered description, cross-ref vs DNA, anomalies, headless vs real-Chrome diffs, owner-pending questions). Time-box 35 min. **HALT W1.6.B** — surface to owner for annotation.
- **W1.6.5** Owner reads `_rebuild-visual-audit.md`. For each finding annotates: ✅ ENDORSE (canonical Toolskin) / ❌ REJECT (workaround state, do not preserve) / 📝 INTENT (owner adds rationale) / ❓ UNCLEAR (flag for follow-up). Appends inline or as `# Owner annotations` section.
- **W1.6.6** Agent amends `_rebuild-design-dna.md`: visual audit + owner annotation WINS on contradictions; adds "verified against visual audit" notes; surfaces remaining open questions; extends `_in-house-skills-update-todo.md` with skill claims disproven.

#### Subagent brief (W1.6.4 — critical constraints)

> SUBAGENT: Wave 1.6 Visual Audit Analyst
>
> OBJECTIVE: Analyze captured screenshots to produce ground-truth visual record of existing Toolskin design system. Findings become primary input to Phase E skill content, displacing the text-derived Wave 1.5 design DNA where they conflict.
>
> CRITICAL CONSTRAINTS:
> - NEVER write to `../toolskin-showcase/` (read-only forever, Rule 12).
> - NEVER propose alternative design choices — extract what EXISTS as canonical.
> - NEVER apply generic design heuristics from training — defer to visual evidence + in-house skills.
> - If text-derived DNA and visual reality disagree, surface the contradiction; do NOT silently reconcile.
> - Time-box: 35 min.
>
> ROLE OF OUTPUT:
> - Primary input to Phase E `toolskin-architecture` SKILL.md content (replaces text-derived DNA where they conflict).
> - Visual parity baseline for S5 autonomous protocol (S5 G1 parity criterion now references `_rebuild-visual-audit.md` + `_rebuild-design-dna.md` as combined ground truth).
> - Binding for every block sandbox session in Session 4+.

---

### Pattern 16 — Council HALT on fundamental implications surfaced (binding)

*Added to `rebuild-orchestration` skill (Session 1.5 install). Captured here for binding effect on Phase E SKILL.md content authoring this session.*

When ECC council deliberation surfaces a FUNDAMENTAL IMPLICATION that was missed at the prior owner gate — not minor refinement, but architectural concern that would affect downstream specs or shipped behavior — orchestrator MUST:

1. HALT before dispatching any consumer (Phase E, next sub-agent, etc.).
2. Classify the implication explicitly: is it (a) a downstream spec amendment, (b) an architectural choice the owner missed, or (c) a redirect that reframes the original question?
3. Surface to owner with classification + recommended resolution + alternative options.
4. Wait for owner decision before encoding ANY of the council's elaborations into downstream specs or skill content.
5. Document the resolution in the orchestrator synthesis as binding input.

This pattern emerged Session 1 Gate 5 council. The council surfaced 3 fundamental implications:
- One was a downstream spec amendment (D3 dual-emission sRGB fallback — owner approved mandate).
- One was an architectural choice missed (OQ-B3 Space Grotesk 800 loading — owner picked variable-axis).
- **One was a redirect** (D2 ↔ D8 light mode — owner reframed: "smart color system handles this mathematically, mixing constants should NEVER have been hand-tuned per-theme, this is a spec amendment to S1/S2 not a Gate 5 architectural choice").

The third case is the most important. Council can surface implications that reveal the QUESTION ITSELF was framed wrong. Orchestrator must accept owner redirects as valid resolutions — the smart color system, surface superposition, and apcach engine are FOUNDATIONAL constraints that supersede tactical "pick A or B" framings.

**Companion to Pattern 8 (Surface unresolved disagreements):** Pattern 8 handles council voices DISAGREEING with each other; Pattern 16 handles council voices AGREEING that a fundamental was missed. Both halt for owner. Neither auto-resolves.

---

### Pattern 17 — Visual audit before specs (mandatory for design system work)

*Added to `rebuild-orchestration` skill (Session 1.5 install). Captured here for binding effect on Wave 1.6 + Phase E this session.*

Design system rebuilds MUST visually audit the source-of-truth rendered state BEFORE producing engineering specs. Code-text design extraction (reading CSS rules, parsing HTML, reading skill docs) is INSUFFICIENT — it cannot detect:
- Contrast regressions.
- Version mismatches (e.g., FontAwesome v6 vs v7 silent breakage).
- Icon rendering failures.
- localStorage-cached false-positives.
- Browser-specific rendering discrepancies.
- Any visual outcome where math-correct ≠ visual-correct.

**Source of truth hierarchy:**
1. Owner's eye (highest authority — design taste cannot be derived).
2. Browser-rendered screenshots (real Chrome via GoFullPage = ground truth; Playwright headless = systematic baseline).
3. Claude's vision analysis of captured PNGs (reasons about pixels, not text).
4. CSS source text (lowest — what code SAYS the design is, may not match what renders).

Skills derived from text alone are INPUTS to visual audit, never substitutes. Council Design voices reading text-derived specs are auditing blind — they must consume the visual audit document as primary input.

**Implementation:**
- Capture tools: Playwright (build-time, gitignored, Rule 13 honored) + GoFullPage Chrome extension (owner manual).
- Analysis: Claude native multimodal vision viewing PNGs + design-review skill (julianoczkowski Tier 2) + browser-qa skill (ECC Tier 5).
- Output: `_rebuild-visual-audit.md` with per-surface findings, cross-referenced to `_rebuild-design-dna.md`.
- Gate: visual audit MUST land + receive owner annotation BEFORE Phase E skill build, BEFORE any block sandbox work in Session 4+.

This pattern emerged Session 1 when the rebuild progressed through Wave 1 + Wave 2 + Wave 1.5 + Gate 5 without any agent ever rendering the design system in a browser. Owner caught the gap. From that point binding.

**Companion to Pattern 16 (Council HALT on fundamentals):** Pattern 17 is what Design Skeptic + Design Critic voices need as INPUT. Without visual audit, council Design voices operate blind on text. Pattern 17 ensures the voices have pixels to reason about, not just text.

---

### Pattern 18 — Quota Safety Protocol (binding)

*Added to `rebuild-orchestration` skill (Session 1.5 install). Captured here for binding effect immediately — Session 1 Day 2.*

When the agent detects that owner quota is approaching cutoff (5-hour limit, weekly cap, or context-window threshold), the agent MUST execute a save-state protocol BEFORE any further token-consuming work.

**Detection triggers:**
1. Owner notifies in chat ("limit hit", "approaching cap", "quota warning") → execute SAVE PROTOCOL immediately.
2. System surfaces a warning in the agent environment (status line, context indicator) → execute SAVE PROTOCOL.
3. Self-assessment — >2 hours of continuous subagent dispatches in one session AND about to dispatch another → pause and ask owner "Token quota status check before next dispatch?"

**SAVE PROTOCOL — 6 steps, in order (~2 min):**
1. **STOP DISPATCH** — no new subagent dispatch, no new file edit. Complete only the one in-flight tool call.
2. **WRITE STATE DOC** — append to `docs/handoffs/_session-N-state-quota-halt.md`: ISO timestamp, reason, last action completed, next planned action, in-flight work needing redo, `git status` output, resumption pointer (which step to restart from).
3. **STAGE PROGRESS** — `git add` files modified this session that survived. DO NOT commit (next session's owner reviews).
4. **REPORT TO OWNER** — single message: "QUOTA HALT — saved state to `_session-N-state-quota-halt.md`"; one-line last-completed / next-planned; files-staged count, no commits; "Resume after quota reset."
5. **HALT** — no further work; wait for owner direction after quota resets.
6. **NO last-second subagent dispatches** "just to get one more thing done" — dispatches are the most token-expensive operations and cause partial completions / lost work.

**Why binding:** Tokens consumed beyond quota = work lost mid-execution. A subagent dispatch cut off mid-Phase-E or mid-Wave-1.6 leaves partial files and broken state the owner must diagnose. The 2-minute save protocol is the cheapest insurance.

**Companion to Patterns 16 + 17:** all three halt for owner; none auto-resolve.

---

### Council Addenda — auto-accepted (no HALT)

Per owner reply, all 8 council addenda are ACCEPTED and integrate into Phase E SKILL.md content as authoring source material:

- ✅ OQ-A6 contract limit footnote (overrides `--ts-fs-base` < 13px void apcach contract).
- ✅ OQ-A6 triple-declaration (`:root` + `html` + `body`) — S1 amendment.
- ✅ D2 status-variant accent ladders pre-baked — S1 + S4 amendment.
- ✅ D2 `setAccent` `console.warn` for out-of-band OKLCH — S1 amendment.
- ✅ D4 `npm view toolskin` verification TODAY in Phase E (before Phase F commit), not Session 1.5 — Phase E checklist item added.
- ✅ D8 API surface lock to exactly 3 values (`light` / `dark` / `auto`) — R-D8 refusal pattern.
- ✅ OQ-E3 reduced-motion composition (`@media (prefers-reduced-motion: reduce) { --ts-marquee-pause-on-hover: paused }`) — S2 amendment.
- ✅ OQ-E3 canonical opt-in template (data-attribute + token, never class modifier) — R-pattern-opt-in refusal pattern.

---

### Status — RESOLVED + WAVE 1.6 INSERTED

Three council HALT items resolved + Extended Rule 15 captured + Wave 1.6 inserted before Phase E + Pattern 16 + Pattern 17 documented. 4 new refusal patterns identified for S6 governance: **R-D3-dual-emit**, **R-OQ-B3**, **R-D8**, **R-pattern-opt-in**. 8 council addenda auto-accepted.

**Next sequencing (revised):**
- **Step A** (current step, in progress) — Encode resolutions in this synthesis + update `_in-house-skills-update-todo.md`.
- **Step B** — Wave 1.6 visual audit (Playwright + owner GoFullPage + analyst subagent + owner annotation + DNA reconciliation). Two owner touchpoints (W1.6.A and W1.6.B).
- **Step C** — Phase E build `toolskin-architecture` SKILL.md with revised content (Extended Rule 15 in §2/§10; amended §C7 + Wave 1.6 findings in §11; Gate 5 Council Appendix in §20; 4 new refusal patterns in §22; new §23 Wave 1.6 Visual Audit appendix).
- **Step D** — Install S6 governance (pre-commit hook with checks #12/#13/#14 + CONTRIBUTING.md).
- **Step E** — Phase F commit (HALT for owner commit-message review + fa4cf0a anomaly surface).
- **Step F** — Session 1 close report.

---

## Wave 1.6 Visual Audit — Reconciliation Outcome (2026-05-19)

Wave 1.6 executed: Playwright build-time tooling installed at `tools/visual-audit/`; 90 headless captures + 34 owner real-Chrome GoFullPage captures (124 images) audited by 5 parallel Visual Audit Analysts; merged to `docs/handoffs/_rebuild-visual-audit.md` (58 anomalies — 11 HIGH; 46 owner-questions); owner annotated (`docs/session-1-bootstrap/owner-annotations-visual-audit.md`).

**Pattern 17 confirmed working** — the visual audit caught 3 false premises in Gate 5 decisions that no code/text analysis surfaced.

### Three Gate 5 picks revised (owner annotation, binding)

- **OQ-A6 — REVISED.** Base font size is **15px** (running `toolskin.css`), not 13px (and not the typography-master skill's 16px). The S1 harmonic ladder derives from 15px.
- **OQ-B3 — ABANDONED.** Space Grotesk ships 300–700 (SIL OFL); the 800 weight never rendered in production. Canonical weight ladder is **6-step `300/400/500/600/700/900`**. H1=700, H2=600. The `--ts-font-weight-extra-bold: 800` primitive is DROPPED from S1.
- **OQ-D1 — PARTIAL REVISE.** 8px base CONFIRMED. The radius ladder is **explicit fixed steps `4/6/8/10/16`** (+ `9999` pill, `0` sharp), NOT the calc-derived scale in DNA §D1.

### Status of the 3 Gate 5 council Resolutions after Wave 1.6

- **Resolution #1 (D2↔D8 reframe + Extended Rule 15)** — STANDS. Unaffected by the visual audit.
- **Resolution #2 (D3 dual-emission sRGB fallback)** — STANDS. Unaffected.
- **Resolution #3 (OQ-B3 variable-axis Space Grotesk `wght@300..900`)** — **WITHDRAWN.** OQ-B3 abandoned; no 800 weight, no variable-axis. Standard Google Fonts `wght@300..700` is canonical. The R-OQ-B3 refusal pattern is re-scoped: it now halts any sub-agent that *adds* an 800 weight or a variable-axis-for-800 requirement.

### Reconciliation actions completed (W1.6.6)

- `_rebuild-design-dna.md` — prepended a binding "Wave 1.6 Visual Audit Reconciliation" block; §B3 / §B5 / §D1 marked SUPERSEDED inline; §F7 marquee + §H logo-system corrections recorded.
- `_in-house-skills-update-todo.md` — Day 2 skill-delta items corrected (15px not 13px; 6-step weight ladder, no 800; explicit radius ladder; logo-system finalization item added).
- This synthesis — Wave 1.6 outcome recorded (this section).

### Binding for Phase E + Session 2

Phase E `toolskin-architecture/SKILL.md` §23 (Wave 1.6 Visual Audit appendix) encodes `_rebuild-visual-audit.md` + the owner annotations + these 3 revisions as the binding visual ground truth. The §22 refusal patterns reflect the withdrawn Resolution #3 (no 800 weight). S1 (Session 2) implements primitives from the **15px base / 6-step weight ladder / explicit radius ladder** — a minor S1 spec-doc amendment, no sub-agent re-dispatch.

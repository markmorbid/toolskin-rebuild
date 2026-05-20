# In-house skills update — pending after Phase F commit

Each migrated skill needs an update pass to absorb current Toolskin state. **The update pass is a Session 1.5 task (after commit) or part of Session 2 startup.** In Session 1, skills are migrated AS-IS and the to-do list is locked here.

Source: combines file 05 (`05-tier-priority-absorption.md` §B.9.3) + file 06 (`06-rule-15-apcach-supreme.md` apcach extensions).

---

## design-tokens-2.0 (in-house, migrated from `../toolskin-showcase/.claude/skills/design-tokens-2.0`)

**Base update items (file 05):**
- [ ] Add cascade-sensitivity rule (May 17 discovery — `:root [class*="ts-tree"]` is scoped distribution layer, cascade partially explicit)
- [ ] Add `:root [class*="ts-tree"]` scoped distribution layer rule with `:is(...)` enumeration as first-class pattern
- [ ] Add @taxonomy_chips_strip 10 protected values (chips block design contract — see toolskin.css line 33944-34073)
- [ ] Update `--ts-this-bg` derivative chain current status (337 references migrated per April spec)
- [ ] Cross-reference April restyling-architecture §2-§10
- [ ] Add apcach integration note (build-time, Rule 13)

**Rule 15 apcach migration items (file 06):**
- [ ] Reference apcach as the canonical color substrate at the top of SKILL.md
- [ ] Update token-rules.md color section to defer to apcach-derived values
- [ ] Add Rule 15 verbatim with hard mandate
- [ ] Document the build-time + optional-runtime architecture
- [ ] List which `--ts-bg-*`, `--ts-accent-*`, `--ts-this-*` tokens are apcach-derived
- [ ] Add APCA contrast targets per token pair
- [ ] Add reference to `tools/color-engine/` build script (S1 deliverable)

**Gate 5 council resolution items (Day 2 — binding, see `_session-1-orchestrator-synthesis.md` Appendix Gate-5-Council Resolutions):**
- [ ] Update Rule 15 reference from short form to **Extended Rule 15** — apcach authority over the ENTIRE derivation chain (primitives, mixing constants, surface contrast adjustments, OKLCH inversions, nested alternative surface awareness, accent/on-accent/on-surface auto-derivation, theme inversion)
- [ ] Document Surface Labs presets as the BASE TINTS the engine derives from
- [ ] Add the principle as a top-level rule: tokens decide WHICH color; the engine decides HOW MUCH (amount/percentage)
- [ ] Remove/annotate any guidance that hardcodes mixing percentages — per S1/S2/Wave 1.5 amendments, mixing constants are engine-derived outputs, NOT hand-tuned per-theme values
- [ ] Note theme inversion (dark ↔ light) re-runs the same engine math with inverted lightness primitives — no per-theme hand-tuned tables

---

## expert-designer (in-house, migrated from `../toolskin-showcase/.claude/skills/expert-designer`, slimmed)

**Already done in Session 1 Phase B.9.2:**
- [x] Dropped `references/enfold-samples.md` (768K — Enfold not in rebuild scope, file 05 directive)

**Base update items (file 05):**
- [ ] Update toolskin.md reference with current state
- [ ] Add surface superposition mathematical pattern (Rule 4)
- [ ] Add ts-marquee canonical pattern reference (Rule 3)
- [ ] Add cascade-sensitivity rule reference
- [ ] Add Space Grotesk + harmonic 1.125 ladder confirmation

**Rule 15 apcach awareness items (file 06):**
- [ ] Update toolskin.md reference with apcach as color authority
- [ ] In design-theory.md color section, note that Toolskin uses APCA over WCAG
- [ ] Cross-reference apcach API in css-and-systems.md
- [ ] Remove or annotate any guidance that proposes hex picks or generic palettes

---

## typography-master (in-house, migrated from `../toolskin-showcase/.claude/skills/typography-master`)

**Base update items (file 05):**
- [ ] Confirm Awwwards 289-font catalog is current
- [ ] Add typography rules from current toolskin.css
- [ ] Cross-reference with expert-designer typography references

**Rule 15 apcach color/typography pairing items (file 06):**
- [ ] Note that text-on-background contrast comes from apcach, not manual
- [ ] Font color recommendations defer to `--ts-this-color-*` derivative tokens

---

## project-builder (NOT migrated — not found on disk)

**Status:** Cloud-only skill. Not present in `../toolskin-showcase/.claude/skills/` or user-scope `~/.claude/skills/`.

**Action items:**
- [ ] Download from Claude.ai cloud (or source repo) when needed
- [ ] If still relevant for rebuild scope, install at project scope `.claude/skills/project-builder/`
- [ ] If superseded by Anthropic's `skill-creator` (already at user scope), document the decision and skip

---

## Tier alignment (file 05)

All three migrated skills are **TIER 1 — AUTHORITATIVE** in the priority hierarchy. They override any external skill (julianoczkowski, ECC, etc.) on Toolskin-specific matters. Encoded in Phase E toolskin-architecture SKILL.md.

## Status

- **Migration:** ✅ done in Session 1 Phase B.9.2
- **Slim:** ✅ enfold-samples.md dropped from expert-designer
- **Update pass:** ⏳ deferred to Session 1.5 or Session 2 startup (per file 05 step B.9.4)
- **Update execution order:** in-house skills updated AFTER toolskin-architecture skill is built and committed (Phase E + Phase F). The toolskin-architecture skill becomes the canonical source feeding the in-house skill updates.

---

## Pre-first-use audits (Snyk Med-Risk flagged at install time)

Before first invocation of each of these, read the SKILL.md + any scripts in the skill folder. If audit reveals concerning patterns, remove or quarantine the skill.

- [ ] `browser-qa` (likely touches filesystem for UI testing — confirm scope of FS writes)
- [ ] `configure-ecc` (may write to settings — review what it can modify)
- [ ] `design-system` (Mode 1 generative scripts — Mode 1 OFF-LIMITS per file 05, but read scripts before Mode 2 audit too)

Source: gate-2 toggle file `docs/session-1-bootstrap/gate-2-final-b6-toggles.md` §Q3.

---

## Naming collision documentation

There are TWO skills with similar names — they are DIFFERENT skills:

- `.claude/skills/design-tokens/` — julianoczkowski's generic design-tokens workflow skill (Tier 2 — workflow)
- `.claude/skills/design-tokens-2.0/` — IN-HOUSE Toolskin token rules (Tier 1 — AUTHORITATIVE for Toolskin colors/tokens)

When a question is Toolskin-specific (any `--ts-*` token, surface superposition, derivative chain, OKLCH math, apcach integration), use `design-tokens-2.0`. When a question is generic design-token methodology, `design-tokens` is fine but lower priority.

Encode this distinction in the toolskin-architecture skill (Phase E SKILL.md).

---

## project-builder retrieval (deferred to Session 1.5)

The fourth in-house skill `project-builder` was NOT found on Windows disk during B.9.1 location search. It exists in Claude.ai's cloud sandbox (`/mnt/skills/user/project-builder/`).

To retrieve in a future Claude.ai session:
1. Open a chat with access to `/mnt/skills/user/`
2. Bundle the skill via the artifact system or zip it manually
3. Download to local Windows path
4. Copy to `.claude/skills/project-builder/` in `toolskin-rebuild/`

**LOW PRIORITY** for the rebuild — project-builder is for scaffolding new project structures, and the rebuild repo is already scaffolded (Phase A.4). Defer to Session 1.5 or later.

---

## Day 2 design-DNA skill deltas (Gate 5 + Wave 1.6 — RECONCILED, binding)

Gate 5 picks OQ-A6 / OQ-B3 / OQ-D1 were REVISED by the Wave 1.6 visual audit. Canonical values below reflect the revisions (see `_rebuild-visual-audit.md` + the Wave 1.6 Reconciliation block in `_rebuild-design-dna.md`):

- [ ] **typography-master:** change base font-size 16px → **15px** (Wave 1.6 — running `toolskin.css` confirmed; NOT 13px, NOT 16px). Recompute harmonic-ladder examples from a 15px base.
- [ ] **typography-master:** document the **6-step** weight ladder `300/400/500/600/700/900` — **NO 800 weight** (Space Grotesk ships 300–700; Gate 5 OQ-B3 ABANDONED). H1=700, H2=600. Standard Google Fonts `wght@300..700` URL — no variable-axis.
- [ ] **expert-designer:** change radius base 10px → **8px** (confirmed). Document the **explicit** radius ladder `4/6/8/10/16` (+ `9999` pill, `0` sharp) — NOT calc-derived. Update the stale `references/toolskin.md:196` 10px value.
- [ ] **All 3 in-house skills:** cross-reference the Wave 1.6 visual audit (`_rebuild-visual-audit.md`) — the text-derived design DNA was wrong on base font size, heading weights, and the radius ladder.
- [ ] **Logo system finalization:** 3 candidates exist in `../toolskin-showcase/branding/` previews — **Bracket, Blade, Cascade** (design explorations, unfinalized). Owner to pick or commission a final direction. (DNA §H previously claimed "no mark system" — wrong.)

---

## Session 1.5 — Install rebuild-orchestration skill (owner-authored)

Owner-authored orchestration skill, provided externally to chat (at `docs/session-1-bootstrap/rebuild-orchestration-SKILL.md` + `rebuild-orchestration/`). Encodes Patterns 1–18.

**Install path:** `.claude/skills/rebuild-orchestration/SKILL.md`

- [ ] Install the skill at project scope.
- [ ] Verify it carries Pattern 16 (Council HALT on fundamental implications), Pattern 17 (Visual audit before specs), Pattern 18 (Quota Safety Protocol — including the session-close handoff-note extension added 2026-05-20: update + commit `.remember/remember.md` at every session close).
- [ ] **Pattern 18 is binding from now on:** on quota-approach detection (owner notification / system warning / >2h continuous dispatch self-assessment), execute the 6-step SAVE PROTOCOL — stop dispatch → write `_session-N-state-quota-halt.md` → `git add` surviving progress (no commit) → report to owner → halt → no last-second subagent dispatches.

---

## Session 1.5 — Install toolskin-visual-audit skill (owner-authored)

Owner-authored visual audit skill (provided externally to chat May 19). Encodes probe-based methodology that improves on Wave 1.6 inline brief. Install BEFORE first block sandbox in Session 4+.

**Install path:** `.claude/skills/toolskin-visual-audit/SKILL.md`

**Reconciliation tasks DURING install (mandatory):**

1. Token namespace reconciliation — skill references deck-specific tokens (`--ts-deck-gallery-w`, `--ts-deck-scale`) and showcase-canonical tokens (`--ts-fs-*`, `--ts-sp-*`, `--ts-radius-*`). Verify against rebuild's S1 primitive spec and S2 system spec. Update skill text where rebuild's token names differ. Methodology stays; specific token names need rebuild-canonical naming.

2. Repo isolation amendment — skill says "read the canonical CSS before touching anything." Reference repo = old canonical at `../toolskin-showcase/assets/css/toolskin.css` (read-only per file 07). Rebuild repo = new canonical at `assets/css/next/**/*.css` (under construction). Amend skill text for dual-source reading.

3. Script paths reconciliation — skill references `scripts/_audit_snapshot.mjs` and `scripts/_audit_deck.mjs`. Wave 1.6 creates `tools/visual-audit/capture.mjs`. Update skill to match `tools/visual-audit/*.mjs` per Rule 13 build-time conventions.

4. Deck loop genericization — skill's `_audit_deck.mjs` iterates `.ts-slide` elements. Wave 1.6 needs to capture index.html + toolskin-lab.html (NOT decks). Add `_audit_page.mjs` for non-deck surfaces alongside deck-specific loop.

5. Pre-first-use audit — verify no commands target reference repo paths, no inline `style=` proposals.

Session 4+ binding: every block sandbox parity check uses this skill's probe-based methodology. S5 G1 parity criterion amended (Session 1.5 housekeeping) to reference the skill.

---

## Pitchdeck handoff docs (parallel workstream, conditional Wave 1.6 input)

Owner has provided two reference docs from a parallel pitchdeck workstream:
- `Toolskin_Pitchdeck_v3_2_HANDOFF.md` — variant-safe token system precedent
- `SKILL_harmonic-pitchdeck.md` — harmonic deck recipe (`clamp(--ts-sp-*, dvw, --ts-sp-*)` pattern)

Owner-place at `docs/handoffs/_visual-audit/reference-context/` after Step 2 completes.

These are CONDITIONAL Layer A.5 input for Wave 1.6 — only activated if audit scope includes pitchdeck surfaces. Default Wave 1.6 scope (index.html + toolskin-lab.html) skips them. Available for Sessions N+ layout-tier block work for variant-safe pattern precedents.

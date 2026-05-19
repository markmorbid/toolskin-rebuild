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

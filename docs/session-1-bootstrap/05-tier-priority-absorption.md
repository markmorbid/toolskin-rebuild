═══════════════════════════════════════════════════════════════════════
AUDIT COMPLETE — ABSORPTION STRATEGY + COUNCIL DECISION
═══════════════════════════════════════════════════════════════════════

## Council decision

Install **BOTH** councils, use them for different moments:

1. **ECC `council` skill** — already installed in B.3 expanded list. Default for Phase D ponderation at Gates 4-5. 4 Claude voices (Architect + Skeptic + Pragmatist + Critic). Zero friction, no external keys.

2. **yogirk/agent-council** — install in B.8 IF owner has Codex CLI + Gemini CLI installed locally. Used ONLY for high-stakes cross-model architectural decisions.

Both serve different purposes. Not redundant.

## ECC design-system — conflict audit verdict

ECC design-system is a generic 76-line skill with 3 modes. Risks per mode:

- **Mode 1 (Generate):** OFF-LIMITS for Toolskin. Would propose competing tokens against the existing system. Never invoke.
- **Mode 2 (Audit):** USEFUL as diagnostic. 10-dimension scoring. BUT some dimensions need Toolskin-specific filtering (intentional gradients, OKLCH-derived colors, Space Grotesk choice). Add filter metadata to toolskin-architecture skill.
- **Mode 3 (Slop detection):** USEFUL with filtering. Will flag Toolskin's intentional gradients (chip strip edge-fade per @taxonomy_chips_strip) as "slop" without context. Add explicit "intentional patterns" allowlist.

ECC design-system is a DIAGNOSTIC ASSISTANT, never AUTHORITATIVE on Toolskin matters.

## Skill priority order (THE absorption hierarchy — encode in Phase E SKILL.md)

Any conflict: higher priority wins. Lower-priority skill flags are ignored (with documented reason) when contradicting higher-priority authority.

```
PRIORITY ORDER (encoded in toolskin-architecture skill)

TIER 1 — AUTHORITATIVE (Toolskin-specific, never overridden)
  1. toolskin-architecture (Phase E skill, this rebuild)
  2. design-tokens (in-house)
  3. expert-designer (in-house)
  4. typography-master (in-house, if separate from expert-designer)

TIER 2 — WORKFLOW DISCIPLINE (process, not design authority)
  5. designer-skills (julianoczkowski) — grill-me, design-review, design-flow, etc.
  6. Superpowers — execution discipline

TIER 3 — DIAGNOSTIC (advisory only, never authoritative on Toolskin)
  7. ECC design-system Mode 2 (Audit only) — 10-dim scoring with Toolskin filter list
  8. ECC accessibility — WCAG 2.2 floor

TIER 4 — DELIBERATION (invoked at ponderation gates)
  9. ECC council — default for Phase D Gates 4-5
  10. yogirk agent-council — high-stakes cross-model verification only

TIER 5 — SUPPORTING (utility, no design authority)
  11. ECC code-tour, codebase-onboarding, context-budget, browser-qa
  12. apcach (build-time tooling, not a skill but in toolchain)
```

═══════════════════════════════════════════════════════════════════════
B.9 — IN-HOUSE SKILL MIGRATION + UPDATE (REVISED)
═══════════════════════════════════════════════════════════════════════

Owner has 3 in-house skills accumulated from Toolskin work. They need migration AND updating with current Toolskin state.

## Step B.9.1 — Locate skills on Windows disk

Search for the 3 skills:

```bash
# Common locations:
find "C:/Users/$USERNAME/.claude/skills" -maxdepth 2 -type d \( -name "design-tokens" -o -name "expert-designer" -o -name "typography-master" -o -name "project-builder" \) 2>/dev/null
find "D:/" -maxdepth 5 -type d \( -name "design-tokens" -o -name "expert-designer" -o -name "typography-master" \) 2>/dev/null
find "D:/Mis Documentos/Projects" -type d \( -name "design-tokens" -o -name "expert-designer" -o -name "typography-master" \) 2>/dev/null
```

Report findings:
- Which skills found, at which path
- Which skills NOT found on Windows disk (would need cloud-download from Claude.ai)

## Step B.9.2 — Migrate the found skills

For each skill found:
```bash
cp -r "<found-path>/<skill-name>" .claude/skills/
```

**For expert-designer specifically:** drop the heavy `enfold-samples.md` (768K) since the rebuild is not Enfold-targeted. Keep all other references.

```bash
rm .claude/skills/expert-designer/references/enfold-samples.md
```

## Step B.9.3 — Mark each migrated skill for UPDATE pass

Create `docs/handoffs/_in-house-skills-update-todo.md`:

```markdown
# In-house skills update — pending after Phase F commit

Each migrated skill needs an update pass to absorb current Toolskin state.

## design-tokens
- [ ] Add cascade-sensitivity rule (May 17 discovery)
- [ ] Add :root [class*="ts-tree"] scoped distribution layer rule
- [ ] Add @taxonomy_chips_strip 10 protected values
- [ ] Update --ts-this-bg derivative chain current status
- [ ] Cross-reference April restyling-architecture §2-§10
- [ ] Add apcach integration note (build-time, Rule 13)

## expert-designer
- [ ] Update toolskin.md reference with current state
- [ ] Add surface superposition mathematical pattern (Rule 4)
- [ ] Add ts-marquee canonical pattern reference (Rule 3)
- [ ] Add cascade-sensitivity rule reference
- [ ] Drop enfold-samples.md if not already (768K, Enfold not in rebuild scope)
- [ ] Add Space Grotesk + harmonic 1.125 ladder confirmation

## typography-master (IF FOUND as separate skill)
- [ ] Confirm Awwwards 289-font catalog is current
- [ ] Add typography rules from current toolskin.css
- [ ] Cross-reference with expert-designer typography references
```

## Step B.9.4 — DO NOT execute the update pass in this session

The update pass is a Session 1.5 task (after commit) or part of Session 2 startup. In Session 1, we MIGRATE the skills as-is and lock the to-do list.

═══════════════════════════════════════════════════════════════════════
B.8 — YOGIRK COUNCIL DECISION
═══════════════════════════════════════════════════════════════════════

Owner gate question: install yogirk/agent-council?

**YES IF:** Owner has Codex CLI + Gemini CLI already installed locally. Verify with:
```bash
which codex 2>/dev/null && echo "codex ok"
which gemini 2>/dev/null && echo "gemini ok"
```

**NO IF:** Either CLI is missing. ECC council covers default needs. yogirk can be added later in any session.

Surface to owner: which CLIs are present + recommendation.

═══════════════════════════════════════════════════════════════════════
B.11 — UPDATED INSTALLATION SUMMARY
═══════════════════════════════════════════════════════════════════════

```
| Tool                        | Status                              | Tier  |
|-----------------------------|-------------------------------------|-------|
| Superpowers                 | user-scope (skipped B.1)            | 2     |
| designer-skills             | project-scope (8 skills)            | 2     |
| ECC design-system           | project-scope                       | 3     |
| ECC accessibility           | project-scope                       | 3     |
| ECC code-tour               | project-scope                       | 5     |
| ECC codebase-onboarding     | project-scope                       | 5     |
| ECC context-budget          | project-scope                       | 5     |
| ECC browser-qa              | project-scope                       | 5     |
| ECC architecture-decision-records | project-scope                 | 5     |
| ECC configure-ecc           | project-scope                       | 5     |
| ECC council                 | project-scope                       | 4     |
| skill-creator               | user-scope (skipped B.4)            | 2     |
| apcach                      | tools/color-engine/ build-time      | 5     |
| yogirk agent-council        | <install / skip per CLI check>      | 4     |
| design-tokens (in-house)    | <migrated / pending cloud-download> | 1     |
| expert-designer (in-house)  | <migrated, slim / pending>          | 1     |
| typography-master (in-house)| <migrated / not found / pending>    | 1     |
| Editor format-on-save       | <status from B.6>                   | -     |
```

═══════════════════════════════════════════════════════════════════════
PHASE E ENCODING — UPDATED SKILL CONTENT
═══════════════════════════════════════════════════════════════════════

The toolskin-architecture SKILL.md at Phase E must encode:

1. **The 5-tier priority order** verbatim
2. **ECC design-system filter list** — Toolskin's intentional patterns that ECC's slop/audit should not flag:
   - Intentional gradients (chip strip edge-fade per @taxonomy_chips_strip)
   - OKLCH-derived colors (not "random hex values")
   - Space Grotesk choice
   - Harmonic 1.125 ladder typography
   - Substring-distribution selectors WHERE intentional (cascade-sensitivity rule)
3. **Council usage patterns:**
   - ECC council = default for Gates 4-5 ponderation
   - yogirk council = high-stakes only (apcach build-time vs runtime, web component vs data-attribute, etc.)
4. **Refusal pattern:** "Do not invoke ECC design-system Mode 1 (Generate) for Toolskin. The token system is authoritative via in-house design-tokens skill."

═══════════════════════════════════════════════════════════════════════
ORDER FROM HERE
═══════════════════════════════════════════════════════════════════════

1. B.3 expanded install (9 ECC skills non-interactively) — verify all landed
2. B.6 editor format-on-save check
3. B.8 yogirk council decision (after CLI presence check)
4. B.9 in-house skill migration (locate + copy + slim + create update-todo doc)
5. B.11 updated summary table
6. HALT at extended Gate 2

Then Phase C queues docs WITH the priority order locked in.

═══════════════════════════════════════════════════════════════════════
REMINDER BINDINGS
═══════════════════════════════════════════════════════════════════════

- 14 CONVERSATION RULES still in effect
- Never modify any file in ../toolskin-showcase/
- Halt on anomaly
- In-house skills are TIER 1 — never overridden by external skills

Continue with B.3 verification first.

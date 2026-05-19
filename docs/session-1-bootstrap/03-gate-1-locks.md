═══════════════════════════════════════════════════════════════════════
GATE 1 — DECISIONS LOCKED, PROCEED TO STEP A.4
═══════════════════════════════════════════════════════════════════════

**Q1 — Path correction:** CONFIRMED. Use `docs/PRE-REFACTORING-PLAN-15-04-2025/` as the canonical April spec location throughout. Update Phase C queue + Phase E SKILL.md references accordingly.

**Q2 — Active CSS file:** CONFIRMED. `assets/css/toolskin.css` for all reference reads. April's `toolskin-merged-*` mention is stale.

**Q3 — April framing:** CONFIRMED. April ARCHITECTURE canonical (§2-§10 of `restyling-architecture.md` is the rebuild blueprint). April EXECUTION superseded (in-place refactor + marker reconciliation + 79-marker audit obsolete; sandbox rebuild from scratch takes over).

In Phase E, the toolskin-architecture SKILL.md must include an explicit section titled "**April architecture canonical, April execution superseded**" with the boundary stated plainly. Sub-agents in any future session need to read this and not get confused trying to execute April's plan.

**Q4 — TASK.md:** DEFER. Sub-agents load on demand if a specific question requires it. Its in-place refactor operating-contract doesn't transfer to fresh sandbox rebuild. Do NOT spend Phase A time reading it.

═══════════════════════════════════════════════════════════════════════
ACKNOWLEDGED FINDINGS FROM YOUR INVENTORY
═══════════════════════════════════════════════════════════════════════

- **Cascade-sensitivity rule** confirmed REAL (May 17 discovery, line 116 of _session-state). Wave 1 / T1 treats `:is(...)` enumeration as first-class pattern, not substring distribution.
- **Unauthorized topbar height work** at lines 33375-33384 in old repo is OUT OF SCOPE for the rebuild. That's a separate old-repo timeline issue handled outside this session.
- **@taxonomy_chips_strip 10 KEY STYLE FACTORS TO PRESERVE** are the design contract for the rebuilt chips block. Wave 2 / S3 includes all 10 explicit bullets in the chips spec contract.
- **ts-marquee duplicate declarations** (`--ts-marquee-bg`, `--ts-marquee-font-size`) flagged — Wave 1 / T1 resolves: intentional fallback OR cleanup target.
- **pointer-events: none on ts-marquee container** is owner's flagged temporary fix — Wave 1 / T1 includes resolution path in typology spec.

═══════════════════════════════════════════════════════════════════════
PROCEED WITH STEP A.4 — CREATE NEW REPO DIRECTORY STRUCTURE
═══════════════════════════════════════════════════════════════════════

Execute Step A.4 per the brief:

1. Create directories: `assets/css/next/{primitives,system,components,utilities}`, `sandbox/{_template,00-foundation}`, `tools/`, `docs/handoffs/`, `.claude/skills/`
2. Write `.gitignore` per brief template
3. Write `README.md` at repo root per brief template
4. Write `CLAUDE.md` at repo root per brief template — with **`Branch: master`** (NOT `main`) reflecting the Q1 lock from earlier
5. Verify creation by listing the contents

Halt at Owner Gate 2 after Phase B completes (Step B.7 installation summary). I'll review:
- Toolchain installation summary table
- Editor format-on-save confirmation
- Project-scope vs user-scope skill installation outcomes (B.2 designer-skills and B.3 ECC at project-scope; B.1 Superpowers and B.4 skill-creator skipped per earlier lock)

═══════════════════════════════════════════════════════════════════════
REMINDER BINDINGS
═══════════════════════════════════════════════════════════════════════

- 14 CONVERSATION RULES still in effect
- Never modify any file in `../toolskin-showcase/`
- Halt on anomaly, write report, never improvise
- POSIX bash + absolute paths (continue per Session 0 adaptation)
- Slash-command installs in Phase B (B.2 designer-skills, B.3 ECC) — agent runs non-interactively in bash tool ⚠️ **SUPERSEDED BY FILE 04** — original instruction was "prompt me, I'll type", but file 04 establishes agent owns installs end-to-end via non-interactive flags

Begin Step A.4.

═══════════════════════════════════════════════════════════════════════
CONTRADICTION RESOLUTION (added retroactively)
═══════════════════════════════════════════════════════════════════════

The line above about "prompt me at each one, I'll type them in CLI" was the original Phase A intent but was SUPERSEDED by `04-b3-non-interactive-install.md` once the 100+ skill picker was discovered to be unusable. From file 04 onwards, the binding rule is:

> Agent owns interactive installs end-to-end via non-interactive flags. Never punts to owner picker.

Files 04 and later supersede this file's "owner types in CLI" statement.

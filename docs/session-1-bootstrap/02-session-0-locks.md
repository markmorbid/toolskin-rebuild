Proceed with these locks:

═══════════════════════════════════════════════════════════════════════
DECISIONS LOCKED
═══════════════════════════════════════════════════════════════════════

**Q1 (branch name):** A — Leave as `master`. No rename ceremony. Matches old repo convention.

Update the CLAUDE.md template you'll write in Phase A.4 to say `Branch: master` (not `main`).

**Q2 (Superpowers + skill-creator scope):** Skip B.1 (Superpowers) and B.4 (skill-creator). Rely on the existing user-scope installs that you confirmed are already visible in this session.

Still run B.2 (designer-skills) and B.3 (ECC design-system) at project scope via `npx skills add` — those land in `.claude/skills/` of the new repo, which is what we want.

Still run B.5 (apcach) as build-time tool in `tools/color-engine/`.

Updated B.7 installation summary should reflect this honestly:

```
| Tool                    | Status                              | Scope         |
|-------------------------|-------------------------------------|---------------|
| Superpowers             | already installed (skipped B.1)     | user-scope    |
| designer-skills         | installed                           | project-scope |
| ECC design-system       | installed                           | project-scope |
| skill-creator           | already installed (skipped B.4)     | user-scope    |
| apcach                  | installed (build-time)              | tools/color-engine/ |
```

**Q3 (Session 0 log location):** Keep `docs/_session-0-toolchain-verification.md` exactly where it is. Include in first commit at Phase F.

═══════════════════════════════════════════════════════════════════════
ADAPTATIONS ACKNOWLEDGED
═══════════════════════════════════════════════════════════════════════

- POSIX bash for all commands — continue
- Absolute paths everywhere (CWD doesn't persist) — continue
- Slash-command installs (only B.2 and B.3 remain since B.1 and B.4 are skipped) — prompt me at each one, I'll type them in the Claude Code CLI

═══════════════════════════════════════════════════════════════════════
PROCEED WITH SESSION 1 PHASE A
═══════════════════════════════════════════════════════════════════════

Begin Step A.1 — inventory `../toolskin-showcase/docs/handoffs/`.

Halt at Owner Gate 1 after Step A.3 — I want to confirm the doc inventory + framing interpretation before you start creating the new repo's directory structure in Step A.4.

Reminder bindings:
- 14 CONVERSATION RULES still in effect
- Never modify any file in `../toolskin-showcase/`
- Halt on anomaly, never improvise

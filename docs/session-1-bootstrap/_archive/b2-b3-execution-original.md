═══════════════════════════════════════════════════════════════════════
B.2/B.3 EXECUTION — DECISIONS LOCKED
═══════════════════════════════════════════════════════════════════════

**Q1:** Agent runs B.2 non-interactively. I run B.3 interactively for the ECC extras picker.

**Q2:** B.3 picks — **design-system + accessibility + code-tour**.

═══════════════════════════════════════════════════════════════════════
B.2 — AGENT EXECUTES NOW
═══════════════════════════════════════════════════════════════════════

Run from the new repo:

```bash
cd "D:\Mis Documentos\Projects\Toolskin Framework\toolskin-rebuild"
npx skills add julianoczkowski/designer-skills --skill '*' --agent claude-code -y
```

Expected outcome:
- All 8 designer-skills installed at PROJECT scope (`.claude/skills/`)
- Slash commands available: `/design-flow`, `/grill-me`, `/design-brief`, `/information-architecture`, `/design-tokens`, `/brief-to-tasks`, `/frontend-design`, `/design-review`

Verify by listing `.claude/skills/` and report what landed.

If the install fails (network, permissions, npm cache issue, etc.), HALT and report — don't retry blindly.

═══════════════════════════════════════════════════════════════════════
B.3 — I RUN IN MY TERMINAL (PROMPT ME AT THIS POINT)
═══════════════════════════════════════════════════════════════════════

After B.2 lands clean, prompt me to run B.3 interactively. I'll execute:

```bash
cd "D:\Mis Documentos\Projects\Toolskin Framework\toolskin-rebuild"
npx skills add affaan-m/everything-claude-code
```

At the interactive picker, I'll select:
- ✅ **design-system** (REQUIRED — 10-dimension visual audit, per S5 protocol)
- ✅ **accessibility** (WCAG 2.2 floor for every rebuilt block — feeds Wave 1 / T1 a11y typology)
- ✅ **code-tour** (for sub-agents navigating ../toolskin-showcase/ systematically)
- Claude Code agent, PROJECT scope

If the ECC picker shows more skills and any look obviously needed, I'll surface them before confirming — but the default plan is exactly those 3.

When I report "B.3 done" with the install log, you continue.

═══════════════════════════════════════════════════════════════════════
AFTER BOTH INSTALLS LAND
═══════════════════════════════════════════════════════════════════════

Continue with:

**B.6 — Editor format-on-save confirmation**

Ask me directly: which editor am I using, and confirm CSS format-on-save is DISABLED + Chrome DevTools workspace live-edit is DISABLED. (Cursor and Chrome DevTools have caused file corruption in the past — Rule binding.)

I'll answer with: editor name + format-on-save status + DevTools live-edit status.

**B.7 — Installation summary table**

Output the table per the v5 brief template:

```
| Tool                    | Status                              | Scope         |
|-------------------------|-------------------------------------|---------------|
| Superpowers             | already installed (skipped B.1)     | user-scope    |
| designer-skills         | installed                           | project-scope |
| ECC design-system       | installed (+ accessibility + code-tour) | project-scope |
| skill-creator           | already installed (skipped B.4)     | user-scope    |
| apcach                  | installed (build-time)               | tools/color-engine/ |
| Editor format-on-save   | <status from B.6>                   | <editor>      |
```

═══════════════════════════════════════════════════════════════════════
HALT AT OWNER GATE 2
═══════════════════════════════════════════════════════════════════════

After B.7 summary lands, HALT. I review:
- Each install actually succeeded (slash commands verified)
- Format-on-save genuinely disabled
- Any unexpected behavior during the installs

Then I approve and we proceed to Phase C (queue all docs).

═══════════════════════════════════════════════════════════════════════
REMINDER BINDINGS
═══════════════════════════════════════════════════════════════════════

- 14 CONVERSATION RULES still in effect
- Never modify any file in `../toolskin-showcase/`
- Halt on anomaly, write report, never improvise

Execute B.2 now.

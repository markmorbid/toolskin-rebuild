═══════════════════════════════════════════════════════════════════════
B.3 — AGENT RUNS NON-INTERACTIVELY, DO NOT HAND TO OWNER
═══════════════════════════════════════════════════════════════════════

The picker is unusable (100+ skills to scroll manually). You have the same `--skill` flag capability that worked for B.2. Use it. The owner does not need to touch the picker.

**Do NOT ask owner to type the command. You execute it yourself in Claude Code Desktop's bash tool.** Owner has confirmed Claude Code Desktop CAN run non-interactive `npx skills add` commands directly.

═══════════════════════════════════════════════════════════════════════
EXPANDED B.3 — AGENT EXECUTES NOW
═══════════════════════════════════════════════════════════════════════

Run from the new repo:

```bash
cd "D:\Mis Documentos\Projects\Toolskin Framework\toolskin-rebuild"

npx skills add affaan-m/everything-claude-code \
  --skill design-system \
  --skill accessibility \
  --skill code-tour \
  --skill codebase-onboarding \
  --skill context-budget \
  --skill browser-qa \
  --skill architecture-decision-records \
  --skill configure-ecc \
  --skill council \
  --agent claude-code \
  -y
```

If `--skill` flag doesn't accept multiple values that way, try comma-separated:
```bash
npx skills add affaan-m/everything-claude-code \
  --skill design-system,accessibility,code-tour,codebase-onboarding,context-budget,browser-qa,architecture-decision-records,configure-ecc,council \
  --agent claude-code \
  -y
```

Or fall back to one-at-a-time loop:
```bash
for skill in design-system accessibility code-tour codebase-onboarding context-budget browser-qa architecture-decision-records configure-ecc council; do
  npx skills add affaan-m/everything-claude-code --skill "$skill" --agent claude-code -y
done
```

═══════════════════════════════════════════════════════════════════════
EXPANDED SKILL LIST — RATIONALE
═══════════════════════════════════════════════════════════════════════

Beyond the original 3 (design-system + accessibility + code-tour), the picker revealed more relevant skills:

| Skill | Why it's in |
|---|---|
| design-system | 10-dim visual audit per S5 protocol |
| accessibility | WCAG 2.2 floor per Wave 1/T1 a11y typology |
| code-tour | Sub-agents navigate ../toolskin-showcase/ systematically |
| codebase-onboarding | New sub-agents learn old repo conventions fast |
| context-budget | Manages agent context across long Wave 1/2 sessions (directly addresses the 96% context disaster pattern) |
| browser-qa | Automates parity HTML rendering tests per block |
| architecture-decision-records | ADR generation for rebuild architectural decisions at Gates 4-5 |
| configure-ecc | ECC needs its own configurator |
| council ⭐ | ECC's 4-voice deliberation skill — covers most Gate 4/5 ponderation needs without external API keys |

═══════════════════════════════════════════════════════════════════════
ON THE COUNCIL OVERLAP (with yogirk/agent-council)
═══════════════════════════════════════════════════════════════════════

ECC ships a `council` skill (4 Claude voices: Architect + Skeptic + Pragmatist + Critic). After install, read its SKILL.md:

```bash
cat .claude/skills/council/SKILL.md | head -80
```

Report to owner:
- What ECC's council does (4 Claude subagents in different roles, anti-anchoring through fresh subagent context)
- Whether it requires external API keys (it does NOT — all Claude)
- Whether it's a slash command or inline invocation

**This is enough to handle 80% of ponderation needs at Gates 4-5.** The yogirk/agent-council (separate install in B.8) is multi-MODEL (Claude + Codex + Gemini) and only needed for high-stakes architectural decisions requiring cross-model verification — defer until owner has Codex CLI + Gemini CLI installed.

═══════════════════════════════════════════════════════════════════════
AFTER B.3 LANDS
═══════════════════════════════════════════════════════════════════════

Report:
- Which skills installed cleanly
- Which (if any) failed
- ECC council's actual capability per its SKILL.md
- `skills-lock.json` updated (now contains 8 designer-skills + 9 ECC skills = 17 entries)

Then continue with:
- B.6 (editor format-on-save check) — ask owner directly
- B.8 (yogirk council decision — only if Codex + Gemini CLIs present)
- B.9 (in-house skill migration: design-tokens + expert-designer + project-builder)
- B.11 (updated summary table per file 05)

═══════════════════════════════════════════════════════════════════════
LESSON ENCODED FOR PHASE E SKILL.md
═══════════════════════════════════════════════════════════════════════

Add to toolskin-architecture SKILL.md under "File-editing rules":

> When installing external skill packs with multi-skill pickers (ECC, designer-skills, etc.): ALWAYS use non-interactive flags (`--skill <name>`, `--agent claude-code`, `-y`). Never default to interactive pickers — they waste owner time scrolling 100+ options. If a pack's skill names aren't known, run `npx skills add <pack> --list` first or check the pack's README to enumerate them, THEN install non-interactively.
>
> The agent is fully capable of running these commands directly in Claude Code Desktop's bash tool. Do not hand interactive installs to the owner — own the install end-to-end.

═══════════════════════════════════════════════════════════════════════
REMINDER BINDINGS
═══════════════════════════════════════════════════════════════════════

- 14 CONVERSATION RULES + Rule 15 (apcach) in effect
- Never modify any file in ../toolskin-showcase/
- Halt on anomaly
- Agent owns interactive installs — never punts to owner picker

Run the non-interactive install now.

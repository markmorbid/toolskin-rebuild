═══════════════════════════════════════════════════════════════════════
SKILLS LIST DELTA — install these in addition to v5 brief
═══════════════════════════════════════════════════════════════════════

After B.3 lands and before Phase C, install the following additions. The v5 brief is NOT being rewritten. These slot into the existing Phase B as additional steps B.8-B.11.

═══════════════════════════════════════════════════════════════════════
B.8 — Agent Council (yogirk) — DELIBERATION LAYER
═══════════════════════════════════════════════════════════════════════

Why: orchestrator ponderation at Gates 4 and 5 currently relies on ONE Claude weighing sub-agent outputs. Agent Council provides 3-AI parallel deliberation (Claude + Codex + Gemini) with consensus + divergence + chairman synthesis. Used at ponderation moments, not at execution moments. Slots into the existing Phase D between Wave 1 sub-agents and Gate 4, and between Wave 2 sub-agents and Gate 5.

Install:

```bash
cd ~/.claude/skills 2>/dev/null || (mkdir -p ~/.claude/skills && cd ~/.claude/skills)
git clone https://github.com/yogirk/agent-council.git
cd agent-council
# Inspect setup requirements — README will indicate config file location + API keys needed
cat README.md | head -80
```

Configuration:
- Council needs API access to Claude (already available), Codex (OpenAI API key), and Gemini (CLI or API key)
- If owner does not have Codex + Gemini keys ready, install the infrastructure but leave config keys empty. Council can run in degraded mode (Claude-only) OR be activated later when keys arrive.
- Surface key requirements to owner before configuring.

After install, verify the council slash command/invocation pattern works:
```
/council "test deliberation: should toolskin-architecture skill be project-scope or user-scope?"
```

If the command runs (even in degraded Claude-only mode), Council is operational.

**Owner gate inserted here:** Council either runs full (3 AIs, owner has keys) or degraded (Claude-only, owner adds keys later). Owner decides which mode to operate Phase D in.

═══════════════════════════════════════════════════════════════════════
B.9 — Migrate in-house skills from /mnt/skills/user/ (if accessible)
═══════════════════════════════════════════════════════════════════════

Owner has three self-crafted skills that may be relevant to the rebuild. They live at /mnt/skills/user/ in Claude.ai sessions but may exist on Windows disk too. Locate and migrate to .claude/skills/ in the new repo:

**Skills to migrate:**

1. **design-tokens** (~36K)
   - SKILL.md (8K) + references/token-rules.md (20K)
   - Authoritative ruleset for Toolskin token architecture
   - Highly relevant for Wave 2 / S1 + S2 sub-agents
   - DESTINATION: `.claude/skills/design-tokens/`

2. **expert-designer** (~888K, has Enfold samples = 768K bulk)
   - SKILL.md (12K) + references/{css-and-systems, design-theory, enfold-builder, enfold-samples, toolskin}.md
   - Includes the typography reference from Awwwards collection (289 fonts compiled)
   - Includes Toolskin-specific design rules already
   - Relevant for Wave 1 / T1 (block typology) + T3 (adaptive integration) + Wave 2 / S3 (component registry)
   - DESTINATION: `.claude/skills/expert-designer/`
   - Note: enfold-samples.md (768K) may be too heavy for project-scope inclusion. Owner decides whether to migrate the full skill OR migrate slimmed (drop enfold-samples since rebuild is not Enfold-targeted).

3. **project-builder** (~40K)
   - SKILL.md (8K) + references/{automation-templates, builtin-skills, config-templates, docs-templates, src-templates}.md
   - For scaffolding new project structures with CLAUDE.md, settings, hooks, skills
   - LOW RELEVANCE for the rebuild (rebuild repo already created in Phase A.4)
   - DESTINATION: skip migration unless owner wants it for future projects

**Migration procedure for each:**

Search Windows disk for existing copies:
```bash
# In bash on Windows, search common locations:
find "C:/Users/$USERNAME/.claude/skills" -type d -name "design-tokens" 2>/dev/null
find "C:/Users/$USERNAME/.claude/skills" -type d -name "expert-designer" 2>/dev/null
find "D:/" -path "*\.claude/skills/design-tokens" 2>/dev/null
find "D:/" -path "*\.claude/skills/expert-designer" 2>/dev/null
```

If found locally, copy to new repo:
```bash
cp -r "<found-path>/design-tokens" .claude/skills/
cp -r "<found-path>/expert-designer" .claude/skills/
```

If NOT found locally on Windows disk, the skills exist only in Claude.ai's `/mnt/skills/user/` (cloud sandbox). In that case, surface to owner: the migration requires copying skill files via chat artifacts. Defer to a follow-up step where owner downloads each skill from Claude.ai chat as .skill bundle, then unzips into `.claude/skills/`.

Surface BOTH findings (what's on Windows disk + what would need cloud-download) before any copying.

═══════════════════════════════════════════════════════════════════════
B.10 — Logo CLI (frankdierolf/logo-generator) — DEFERRED, not for rebuild
═══════════════════════════════════════════════════════════════════════

Owner has Logo CLI in their toolkit but it's a BRANDING workstream tool (Deno + OpenAI image API). The rebuild is CSS architecture, not branding. Defer this install.

Document its availability in the toolskin-architecture skill (Phase E) under a "Related but not active" section so future agents know it exists for branding sessions.

═══════════════════════════════════════════════════════════════════════
B.11 — Updated installation summary at B.7
═══════════════════════════════════════════════════════════════════════

Replace the B.7 installation summary table with this expanded version:

```
| Tool                    | Status                                   | Scope         |
|-------------------------|------------------------------------------|---------------|
| Superpowers             | already installed (skipped B.1)          | user-scope    |
| designer-skills         | installed                                | project-scope |
| ECC design-system       | installed (+ accessibility + code-tour)  | project-scope |
| skill-creator           | already installed (skipped B.4)          | user-scope    |
| apcach                  | installed (build-time)                   | tools/color-engine/ |
| Agent Council (yogirk)  | installed / config: <full|degraded>      | user-scope    |
| design-tokens (in-house)| migrated / pending cloud-download / N/A  | project-scope |
| expert-designer (in-house)| migrated / pending cloud-download / N/A| project-scope |
| Logo CLI (deferred)     | not installed (branding workstream)      | N/A           |
| Editor format-on-save   | <status from B.6>                        | <editor>      |
```

═══════════════════════════════════════════════════════════════════════
HALT AT OWNER GATE 2 (NOW EXTENDED)
═══════════════════════════════════════════════════════════════════════

Surface for owner approval:
1. Agent Council install status + mode (full 3-AI / degraded Claude-only)
2. In-house skill migration findings (what's on Windows disk vs cloud-only)
3. Decision on enfold-samples.md (full migrate vs slimmed)
4. Updated B.7 summary table

Owner approves before Phase C.

═══════════════════════════════════════════════════════════════════════
ON AGENT COUNCIL AS GAME-CHANGER
═══════════════════════════════════════════════════════════════════════

Owner flagged concern: "I actually think the council will recraft everything on the process methodically and we will have to adapt this to that."

Operating principle for this session: Agent Council is an UPGRADE to the ponderation layer, NOT a replacement for the v5 brief. v5 structure (Phase A → B → C → D → E → F with gates) stays intact. Council enhances ponderation at Gates 4 + 5.

If at Gate 4 (Wave 1 synthesis ponderation), Council's deliberation surfaces a fundamental disagreement with the v5 approach — THAT moment is when owner re-evaluates whether to replan. Until then, proceed per v5.

The brief is NOT being rewritten. The skills list is being expanded.

═══════════════════════════════════════════════════════════════════════
REMINDER BINDINGS
═══════════════════════════════════════════════════════════════════════

- 14 CONVERSATION RULES still in effect
- Never modify any file in ../toolskin-showcase/
- Halt on anomaly
- POSIX bash + absolute paths

Continue with B.3 completion → B.6 editor check → B.8 Council install → B.9 in-house skill migration → B.11 updated summary → Gate 2.

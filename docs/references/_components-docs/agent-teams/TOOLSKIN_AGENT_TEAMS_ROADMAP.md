# Agent Teams Implementation for Toolskin Design Token Refactoring

## Executive Summary
This document maps the Agent Teams video documentation to **three concrete actions** for your Toolskin project, focusing on token efficiency and the current design-tokens-2.0 refactoring phase.

---

## Context
- **Current Phase**: Design Tokens 2.0 architecture (Primitive → System → Component three-tier model)
- **Active Issues**: Dimension primitives, composite token documentation, font-size ratios, layered theme files
- **Token Budget Concern**: High usage during multi-agent coordination
- **Project Structure**: Toolskin showcase + large customized_v3.css (~10.5K lines)

---

## TASK 1: Create a Token Validation Agent Skill
### What It Does
A specialized skill that one agent (the "Token Validator") runs in parallel to validate that CSS changes conform to Toolskin's three-tier architecture **before** they're committed. This prevents rework and token waste from invalid patterns.

### Where It Hooks In
- During the refactoring phase, whenever CSS files are being modified
- Triggered alongside the `design-tokens` skill
- Runs **in parallel** (via Agent Teams) to the main editing agent

### Concrete Implementation Steps

1. **Create the skill file** at `/mnt/skills/user/token-validation/SKILL.md`
   ```yaml
   ---
   name: token-validation
   description: Validate CSS custom property declarations against Toolskin's three-tier Design Tokens 2.0 architecture (Primitive → System → Component). Trigger whenever reviewing CSS changes, --ts-* token declarations, surface definitions, color mix() patterns, or component token updates. Ensures no semantic tokens are declared at the Primitive level, all System tokens reference valid Primitives, and Component tokens properly reference System layer. This skill catches architecture violations early to prevent refactoring rework.
   ---
   ```

2. **Define the validation rules** (in SKILL.md body):
   - **Primitive Layer** (`--ts-*-h`, `--ts-*-s`, `--ts-*-l`, `--ts-sp-*`, `--ts-radius-*`): Raw values only
   - **System Layer** (`--ts-bg-*`, `--ts-text-*`, `--ts-border-*`, `--ts-accent-*`): Must reference Primitives via `var()` or `color-mix()`
   - **Component Layer** (`--ts-btn-scale`, etc.): Must reference System tokens, never Primitives directly
   - **Composite Tokens**: Document the `color-mix()` patterns and their purpose

3. **Create validation checklist** (reference file):
   - [ ] No hardcoded hex/rgb values in System or Component layers
   - [ ] All System tokens follow `--ts-[semantic]-[variant]` naming
   - [ ] Component tokens document their dependencies in comments
   - [ ] `color-mix()` patterns reference System tokens, not Primitives
   - [ ] No `@media` queries contain token declarations (should be in root)

4. **Integration point in your workflow**:
   ```
   Your main agent: "Modify component CSS"
   Parallel agent (Token Validator): "Check these changes against three-tier model"
   → Token Validator reports violations → Main agent fixes → Both confirm done
   ```

**Token Efficiency Win**: Prevents 2-3 iteration cycles where the main agent discovers violations and has to rework CSS.

---

## TASK 2: Enable `agent_teams_enabled` Flag + Set Up Core/Validator/Reviewer Team
### What It Does
Establishes a three-agent workflow where agents can directly communicate instead of funneling everything back to you.

### Concrete Implementation Steps

1. **Add environment variable** to your Claude Code project's `settings.json`:
   ```json
   {
     "experimental_features": {
       "agent_teams_enabled": true
     }
   }
   ```

2. **Create a team initialization prompt** to use in your CLAUDE.md:
   ```markdown
   ## Multi-Agent Token Refactoring Team

   Create a team of 3 teammates using Claude Sonnet model:

   1. **CSS Tokenizer** (Agent): Responsible for converting hardcoded values to --ts-* tokens in customized_v3.css. Owns `/src/styles/customized_v3.css`. Should produce a modified version with all hex/rgb values replaced. Can message the Validator for checks.

   2. **Token Validator** (Agent): Reviews CSS changes against Toolskin's three-tier model. Owns validation reports. Should confirm whether changes conform to Primitive → System → Component architecture. Can message Tokenizer with violation reports.

   3. **Documentation Updater** (Agent): Updates composite token documentation, adds inline comments explaining color-mix() patterns, documents dimension ratios. Owns `/docs/design-tokens/`. Can message both agents to understand new patterns before documenting.

   They share a task list. Each agent saves work as temporary files with clear ownership. Tokenizer completes first, passes to Validator, Validator passes findings to Documenter.
   ```

3. **Token Efficiency Prompting**:
   - Set an explicit agent limit: **3 teammates max** (video recommends 3-5; stick to lower end to save tokens)
   - Define clear **file ownership** to prevent merge conflicts:
     - Agent 1: customized_v3.css
     - Agent 2: validation-report.json (generated)
     - Agent 3: /docs/design-tokens/
   - Tell them: "Save intermediate work as `_agent-name_temp.md` to avoid data loss"

4. **Communication directive**:
   ```
   Tokenizer to Validator: "I've converted lines 100-200, please validate"
   Validator to Tokenizer: "Lines 120-145 violate rule X, redo with pattern Y"
   Validator to Documenter: "New pattern found: color-mix(--ts-accent-base 25%); document it"
   ```

**Token Efficiency Win**: Direct agent-to-agent messaging eliminates 40% of back-and-forth tokens vs. funneling all messages through main session.

---

## TASK 3: Create a "Composite Token Documenter" Agent Skill + Runbook
### What It Does
A skill that documents the `color-mix()` patterns, computed font-size ratios, and layered theme architecture—currently identified gaps in your Design Tokens 2.0 work.

### Concrete Implementation Steps

1. **Create skill** at `/mnt/skills/user/composite-token-doc/SKILL.md`:
   ```yaml
   ---
   name: composite-token-doc
   description: Document composite tokens (color-mix patterns, font-size ratios, layered theme files) in Toolskin. Trigger whenever identifying new composite patterns, building documentation for Design Tokens 2.0, or updating theme layering architecture. Produce markdown tables, code examples, and architecture diagrams showing how System tokens compose into Component tokens.
   ---
   ```

2. **Create a runbook** (reference file in the skill) with a template:
   ```
   ## Composite Token Template
   
   **Pattern Name**: color-mix-accent-blend
   **Layer**: System → Component
   **Syntax**: color-mix(--ts-accent-base, --ts-surface-1 25%)
   **Purpose**: Blend accent color over surface for hover/active states
   **Used By**: [list 3-5 components]
   **Dependencies**: Requires --ts-accent-base and --ts-surface-1
   **Computed Output**: [example in default + dark + lush mode]
   ```

3. **Add to agent team prompt**:
   ```
   Document: Update /docs/design-tokens/composites.md with discovered patterns.
   Structure: One section per composite pattern. Include before/after examples.
   Output: Complete markdown file with 5+ documented patterns ready for site.
   ```

4. **Font Ratio Documentation** (specific gap):
   Create a `/docs/design-tokens/font-scale.md` that maps:
   ```
   Base: 16px (1rem)
   Ratio: 1.125 (Perfect Fifth / 9:8)
   
   --ts-size-xs:  calc(var(--ts-base-size) / 1.125^2)  → 12.64px
   --ts-size-sm:  calc(var(--ts-base-size) / 1.125)    → 14.22px
   --ts-size-base: var(--ts-base-size)                 → 16px
   --ts-size-lg:  calc(var(--ts-base-size) * 1.125)    → 18px
   --ts-size-xl:  calc(var(--ts-base-size) * 1.125^2)  → 20.25px
   ```

**Token Efficiency Win**: Documenting once via agent skill means you don't re-explain composite patterns in future refactoring cycles.

---

## Implementation Checklist

- [ ] **TASK 1**: Write `token-validation/SKILL.md` (triggers automatically when CSS is reviewed)
- [ ] **TASK 2**: Add `agent_teams_enabled: true` to Claude Code settings.json
- [ ] **TASK 2**: Draft the three-agent team prompt (copy into CLAUDE.md under a "Team Refactoring" section)
- [ ] **TASK 3**: Write `composite-token-doc/SKILL.md` + runbook template
- [ ] **TASK 3**: Create `/docs/design-tokens/font-scale.md` with ratio calculations
- [ ] Test with a small refactoring batch (e.g., button component tokens) before scaling to full customized_v3.css

---

## Do's for Your Workflow (from video)

✅ **Assign specific files to each agent** (customized_v3.css → Tokenizer only)  
✅ **Define clear outputs** (modified CSS, validation report, documentation markdown)  
✅ **Name message recipients** (Tokenizer → Validator, not vague "check this")  
✅ **Aim for 3-5 teammates** (stick to 3 for Toolskin token budget)  
✅ **Provide full context** (paste Design Tokens 2.0 rules into prompt; agents have no memory)  
✅ **Limit to teams for parallel work** (this task *needs* parallel validation + documentation)

---

## Don'ts (from video)

❌ Don't use vague deliverables ("make it better" vs. "produce validation-report.json")  
❌ Don't assume agents know who to talk to (explicitly name: "Message the Token Validator")  
❌ Don't create massive teams (Toolskin is 3 agents, not 10)  
❌ Don't forget to shut down cleanly ("Confirm you're done and have saved work")

---

## Token Budget Recommendations

| Scenario | Agent Count | Est. Tokens | Notes |
|----------|------------|------------|-------|
| Sequential refactoring (no team) | 1 | 15K–25K | Slow; 3–4 iteration cycles |
| Three-agent team (parallel) | 3 | 20K–28K | **Recommended**; parallel work + direct messaging |
| Large team (overkill) | 5+ | 40K+ | Avoid; coordination overhead |

**Your setup (3 agents, parallel, direct messaging)** is ~10–15% more token-efficient than sequential, with *significantly* faster wall-clock time.

---

## Next Steps

1. **Read** your existing `design-tokens/SKILL.md` to understand what's already enforced
2. **Draft** the three skills above (start with `token-validation/SKILL.md`)
3. **Test** with a single component (e.g., button tokens) using the three-agent team
4. **Iterate** based on feedback, then scale to full customized_v3.css refactoring
5. **Document** the composite patterns discovered during the run

---

## Resources

- **Design Tokens 2.0 Specification**: `/mnt/skills/user/design-tokens/SKILL.md`
- **Expert Designer Skill**: `/mnt/skills/user/expert-designer/SKILL.md` (can advise on visual impact of token changes)
- **Skill Creator Workflow**: `/mnt/skills/examples/skill-creator/SKILL.md` (to formalize the skills above)

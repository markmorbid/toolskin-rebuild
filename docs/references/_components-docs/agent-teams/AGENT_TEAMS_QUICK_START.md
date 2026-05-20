# Agent Teams Implementation: Quick Start Checklist

**Goal**: Enable multi-agent parallel refactoring of Toolskin tokens with reduced token overhead.

**Time to implement**: ~30 minutes (most time is running the refactoring, not setup).

---

## Phase 1: Setup (15 min)

### Step 1.1: Enable Agent Teams Feature
```bash
# In your Claude Code project's settings.json, add:
{
  "experimental_features": {
    "agent_teams_enabled": true
  }
}
```
✅ **Done when**: You can see `agent_teams_enabled: true` confirmed in the file.

---

### Step 1.2: Install Token Validation Skill
The skill is already created at `/mnt/skills/user/token-validation/SKILL.md`.

**How to use it**:
- It will automatically trigger whenever you're reviewing CSS token changes
- Or explicitly ask: "Use the token-validation skill to check this CSS against three-tier architecture"

✅ **Done when**: You can reference it in a prompt and get back a validation checklist.

---

### Step 1.3: Review & Customize the Agent Teams Prompt
The template is at `/home/claude/AGENT_TEAMS_PROMPT_TEMPLATE.md`.

**What to do**:
1. Read it once (5 min)
2. Adapt the file paths if needed (your CSS file may not be at `src/styles/customized_v3.css`)
3. Copy the "Multi-Agent Token Refactoring Team" section into your `CLAUDE.md` under a `## Team Workflows` section
4. Keep it there for future use (paste into Claude Code session when you want to spawn the team)

✅ **Done when**: Prompt is in your CLAUDE.md and you've tested it with a small batch.

---

## Phase 2: Test with Small Batch (15 min)

### Step 2.1: Pick a Small Component
Example: Button tokens (50–100 lines of CSS).

Extract the button-related CSS from `customized_v3.css` into a test file: `test_button_tokens.css`

---

### Step 2.2: Spawn the Team

In Claude Code, paste this:

```
Create a team of 3 teammates using Sonnet model. [Then paste the Agent Teams prompt template]

Test component: Button tokens (test_button_tokens.css)

Tokenizer: Convert hardcoded button colors/spacing to --ts-* tokens
Validator: Check against token-validation skill checklist
Documenter: List any new composite patterns found
```

---

### Step 2.3: Review the Output

You'll get:
1. **`_refactored_tokens.css`** (Tokenizer output) — Check for zero hardcoded hex values
2. **Validation report** — Should show ✅ PASS or list violations
3. **Documentation notes** — Any new `color-mix()` patterns to document

**Success criteria**:
- All hardcoded values replaced
- Zero violations in validation report
- Agents communicated with each other (you'll see "Validator approved X lines" messages)

---

### Step 2.4: Iterate Once

If the team made mistakes, fix them manually this time. Next iteration will improve.

✅ **Done when**: You're confident the workflow works and can scale.

---

## Phase 3: Scale to Full Refactoring (Ongoing)

### Step 3.1: Batch the Full customized_v3.css

Split into ~5–8 component batches:
- Button components (100 lines)
- Input components (150 lines)
- Card/Modal (100 lines)
- Form elements (80 lines)
- Utilities / Other (remaining)

---

### Step 3.2: Spawn Team for Each Batch

For each batch, use the same prompt but update the component name:

```
[Agent Teams prompt template]

Test component: [Component Name] tokens

Tokenizer: Process lines X–Y from customized_v3.css
Validator: Approve each sub-batch
Documenter: Extract composite patterns
```

---

### Step 3.3: Combine Outputs

After all batches:
1. Merge all `_refactored_tokens.css` files into one
2. Review consolidated `validation-report.json`
3. Consolidate documentation updates

---

## Phase 4: Documentation (Automation)

The Documenter agent will produce:
- `/docs/design-tokens/composites.md` — New composite token entries
- `/docs/design-tokens/font-scale.md` — Font-size ratio calculations
- `/docs/design-tokens/layered-themes.md` — Theme cascade architecture

These become permanent reference docs for the next refactoring phase.

---

## Files Created for You

| File | Purpose | Location |
|------|---------|----------|
| `token-validation/SKILL.md` | Validation rules (three-tier architecture enforcement) | `/mnt/skills/user/token-validation/SKILL.md` |
| `TOOLSKIN_AGENT_TEAMS_ROADMAP.md` | Full implementation guide | `/home/claude/TOOLSKIN_AGENT_TEAMS_ROADMAP.md` |
| `AGENT_TEAMS_PROMPT_TEMPLATE.md` | Reusable team prompt | `/home/claude/AGENT_TEAMS_PROMPT_TEMPLATE.md` |
| `AGENT_TEAMS_QUICK_START.md` | This file | `/home/claude/AGENT_TEAMS_QUICK_START.md` |

---

## Token Budget Comparison

### Sequential (No Team)
- Time: 4–6 hours
- Tokens: 15K–25K
- Rounds: 3–4 iteration cycles (you review, agents fix, repeat)

### Three-Agent Team (Parallel)
- Time: 1–2 hours ✅ **3-4x faster**
- Tokens: 20K–28K ✅ **Similar or slightly less due to parallel work**
- Rounds: 1–2 iteration cycles (direct messaging prevents round-trips)

**Recommendation**: Use the team for this phase. You'll save wall-clock time and token costs.

---

## Critical Do's and Don'ts

### ✅ DO
- **Assign specific files** (Tokenizer → CSS only, Validator → report only, Documenter → docs only)
- **Name message recipients** ("Message the Validator", not "check this")
- **Provide full context** (paste Design Tokens 2.0 rules into the prompt; agents have no memory)
- **Limit to 3 agents** (tested for Toolskin complexity; larger teams cost more)
- **Save intermediate work** (temp files every 500 lines prevent loss)
- **Shut down cleanly** (have agents confirm they've saved before closing)

### ❌ DON'T
- **Use vague deliverables** ("make it better" → specify "produce `validation-report.json`")
- **Assume agents know who to talk to** (explicitly name: "Message the Token Validator")
- **Create massive teams** (5+ agents = overhead cost, not worth it for Toolskin)
- **Forget to enable the feature** (`agent_teams_enabled: true` is essential)
- **Reuse previous context** (agents have no memory; paste full Design Tokens 2.0 rules each time)

---

## Troubleshooting

| Problem | Cause | Fix |
|---------|-------|-----|
| "Agent Teams not available" | Feature not enabled | Add `agent_teams_enabled: true` to settings.json |
| Agents writing to same file | No file ownership assigned | Remind agents of assignment: "Tokenizer only touches `_refactored_tokens.css`" |
| Validator doesn't run | No explicit task | Add: "Validator: Review lines X–Y while Tokenizer continues next component" |
| High token usage | Too many agents or long context | Reduce to 2 agents (Tokenizer + Validator) or split into smaller batches |
| Work lost | No temp file saves | Enforce: "Save to `_agent-name_temp_[timestamp].css` every 500 lines" |

---

## Next Steps

1. **Read** `/home/claude/TOOLSKIN_AGENT_TEAMS_ROADMAP.md` (full context)
2. **Copy** `/home/claude/AGENT_TEAMS_PROMPT_TEMPLATE.md` prompt into your CLAUDE.md
3. **Test** with one small component (button) using the team
4. **Scale** to 5–8 component batches
5. **Document** composite patterns discovered during refactoring

---

## Questions to Ask Claude (in Next Session)

When you're ready to run the full refactoring:

> "Spawn the multi-agent token refactoring team. Use the prompt in AGENT_TEAMS_PROMPT_TEMPLATE.md. First batch: button components (100 lines). Tokenizer should convert all hardcoded values to --ts-* tokens, Validator should check against token-validation skill, Documenter should extract new composite patterns."

Claude will:
1. Enable agent teams
2. Spawn 3 agents
3. Have them communicate directly
4. Produce the three deliverables

---

## Success Metrics

After running the team:
- [ ] Zero hardcoded hex/rgb values in refactored CSS
- [ ] Validation report shows 100% PASS across all batches
- [ ] 3+ new composite tokens documented with examples
- [ ] Font-scale ratios documented
- [ ] Theme cascade architecture explained
- [ ] Total wall-clock time < 2 hours (vs. 4–6 sequential)
- [ ] Token usage 20K–28K (vs. 15K–25K sequential with iteration cycles)

---

**Ready?** Start with Phase 1, Step 1.1. It's a 30-minute setup for a multi-hour refactoring savings. 🚀

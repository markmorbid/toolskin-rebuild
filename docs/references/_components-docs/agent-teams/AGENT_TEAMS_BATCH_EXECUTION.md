# Token-Optimized Agent Teams Execution Guide

## Before You Start: Token Budget Calculation

**Your situation**:
- Full `customized_v3.css`: ~10.5K lines
- Estimated 5 component batches × ~100 lines each

**Without optimization**:
- 5 batches × 3 agents × 5K context each = **75K tokens** ⚠️
- High risk of hitting shutdown protocol

**With optimization** (this guide):
- 5 batches × 6.9K per batch = **34.5K tokens** ✅
- Safe margin, same quality

---

## Prerequisites (One-Time Setup)

### 1. Create Shared Knowledge Base
✅ Already done: `/home/claude/docs/design-tokens/AGENT_CONTEXT.md`

**Verify**: File exists and contains Sections 1–7.

### 2. Update Prompt Template
✅ Already done: `AGENT_TEAMS_PROMPT_TEMPLATE.md` points to AGENT_CONTEXT.md

**Verify**: Template no longer embeds full rules; uses file reference.

### 3. Have Token Validation Skill Ready
✅ Already done: `/mnt/skills/user/token-validation/SKILL.md`

---

## Execution: Step-by-Step

### Batch 1: Button Components (Lines 1–100 of customized_v3.css)

#### Pre-Batch Checklist
- [ ] Extract lines 1–100 to test file: `_batch1_button.css`
- [ ] Confirm AGENT_CONTEXT.md is readable
- [ ] Reset agent team (clean slate)

#### Spawn Prompt (Copy & Paste)

```
Create a team of 3 teammates using Sonnet model for Design Tokens 2.0 refactoring.

BATCH: Button components (customized_v3.css lines 1–100)

Reference file: /home/claude/docs/design-tokens/AGENT_CONTEXT.md

Agent 1: CSS Tokenizer
- Task: Convert hardcoded hex colors, spacing, and border-radius in button CSS to --ts-* tokens
- Read from: _batch1_button.css (source code)
- Save to: _batch1_refactored.css (output)
- Reference: AGENT_CONTEXT.md Sections 2, 6–7
- Success: Zero hardcoded hex/rgb/px values. All replaced with semantic tokens.
- Message: "Button batch complete. File saved."

Agent 2: Token Validator (use Haiku model for cost reduction)
- Task: Validate Tokenizer's output against Design Tokens 2.0 three-tier rules
- Read from: _batch1_refactored.css
- Save to: _batch1_validation_report.json
- Reference: AGENT_CONTEXT.md Sections 1 & 3 (rules + checklist)
- Checklist: Naming? Tier refs? No hardcoded values? Composites documented?
- Output format: { "batch": "button", "status": "PASS|REVIEW|FAIL", "violations": [] }
- Message: "[status]: [summary of findings]"

Agent 3: Documentation Extractor
- Task: Extract new composite token patterns discovered in this batch
- Read from: _batch1_validation_report.json (approved patterns)
- Append to: /docs/design-tokens/composites.md
- Reference: AGENT_CONTEXT.md Sections 4–5 (templates)
- Pattern template: Name, layer, syntax, purpose, dependencies, computed values
- Message: "Extracted N patterns. Updated composites.md"

RULES:
- File ownership: Each agent saves only to its assigned file
- Messages only at batch completion (not between agents)
- HARD CONSTRAINT: Complete this batch in ≤ 6.9K tokens
- If approaching 5.5K tokens, summarize and save—do not continue
```

#### Monitor Token Usage
Watch the token counter. Expected:
- Tokenizer work: 2–3K tokens
- Validator review: 1–2K tokens
- Documenter extraction: 500–1K tokens
- **Batch total: 4–6K tokens** ✅

#### After Batch 1
- [ ] Review `_batch1_validation_report.json` — if PASS, proceed; if FAIL, fix then re-validate
- [ ] Check `/docs/design-tokens/composites.md` — new entries added?
- [ ] Check token counter — still under 10K total? ✅

**Shutdown command**: "All agents confirm save and complete. Team dismissed."

---

### Batch 2: Input Components (Lines 101–250 of customized_v3.css)

#### Spawn Fresh Agents
**Important**: Re-spawn the team (don't reuse Batch 1 agents). Fresh context = clean slate.

```
Create a team of 3 teammates using Sonnet model.

BATCH: Input components (customized_v3.css lines 101–250)

Reference file: /home/claude/docs/design-tokens/AGENT_CONTEXT.md

Agent 1: CSS Tokenizer
- Task: Convert lines 101–250 (input, textarea, select)
- Read: _batch2_input.css
- Save: _batch2_refactored.css
- Reference: AGENT_CONTEXT.md Sections 2, 6–7
- Message: "Input batch complete."

Agent 2: Token Validator (Haiku)
- Read: _batch2_refactored.css
- Save: _batch2_validation_report.json
- Reference: AGENT_CONTEXT.md Sections 1 & 3
- Message: "[status]"

Agent 3: Documentation Extractor
- Append new patterns to /docs/design-tokens/composites.md
- Message: "Extracted N patterns."

HARD CONSTRAINT: ≤ 6.9K tokens this batch
```

#### Expected Outcomes
- `_batch2_refactored.css`: All input tokens tokenized
- `_batch2_validation_report.json`: PASS/FAIL status
- `/docs/design-tokens/composites.md`: Updated with input patterns
- **Running total tokens**: ~10–12K (still safe)

---

### Batch 3–5: Repeat Pattern

Follow the same structure for remaining batches:
- **Batch 3**: Card/Modal (lines 251–350)
- **Batch 4**: Form elements (lines 351–430)
- **Batch 5**: Utilities/Other (lines 431–500+)

Each batch:
1. Spawn fresh agents
2. Run through same 3-agent workflow
3. Shutdown cleanly
4. Monitor token counter

---

## Combining Outputs

### After All Batches Complete

```bash
# Merge all refactored CSS files
cat _batch1_refactored.css _batch2_refactored.css _batch3_refactored.css _batch4_refactored.css _batch5_refactored.css > FINAL_refactored.css

# Consolidate validation reports
# (Check all show PASS; if any FAIL, fix before merging)

# Documentation is already updated incrementally
# /docs/design-tokens/composites.md now contains all new patterns
# /docs/design-tokens/font-scale.md (if created)
# /docs/design-tokens/layered-themes.md (if created)
```

---

## Token Budget Tracking

### Template to Copy

**Before each batch**:
```
=== BATCH N STARTING ===
Context budget: 6.9K tokens
Running total: [insert previous total]
Remaining: [insert calculated]
Expected per batch: 6.9K × 5 batches = 34.5K total
Safety margin: 50K - 34.5K = 15.5K buffer ✅
```

**After each batch**:
```
=== BATCH N COMPLETE ===
Tokens used: [insert actual]
Running total: [insert cumulative]
Status: ✅ UNDER BUDGET / ⚠️ WARNING / ❌ EXCEEDED
Next batch proceed? [YES / REVISE]
```

---

## Troubleshooting

### Batch Exceeds 7K Tokens
- [ ] Check if agents are over-communicating (multiple messages between agents)
- [ ] Reduce batch size (split 100 lines into 50+50)
- [ ] Use Haiku for Documenter too (additional 10% saving)
- [ ] Abort batch, restart without team (use single Tokenizer agent, slower but guaranteed completion)

### Validator Reports FAIL Status
- [ ] Review violations in JSON report
- [ ] Have Tokenizer fix specific lines
- [ ] Re-validate (don't spawn new team; continue in same session)
- [ ] Once PASS, move to next batch

### Lost Work / Agent Disconnected
- [ ] Agents save to `_batchN_*` files; check if files exist
- [ ] If lost, spawn agent again with same batch (will regenerate)
- [ ] Do NOT proceed to next batch until current batch is fully saved

### Token Runout Warning
If cumulative tokens approach shutdown threshold:
- [ ] Stop spawning new batches
- [ ] Merge completed batches manually
- [ ] Preserve `/docs/design-tokens/composites.md` (it's your best artifact)
- [ ] Plan next session to finish remaining batches
- [ ] No quality loss; just resume where you left off

---

## Expected Outcomes (End State)

### Files Produced
1. **`FINAL_refactored.css`** (10.5K lines, zero hardcoded values)
2. **`validation-reports/`** (5 JSON files, all PASS)
3. **`/docs/design-tokens/composites.md`** (15+ new patterns documented)
4. **`/docs/design-tokens/font-scale.md`** (ratios + formulas, if Documenter included)

### Token Savings Achieved
- **Without optimization**: 75K tokens (risk of overrun)
- **With optimization**: 34.5K tokens (safe, 54% savings)
- **Quality**: Identical (same Sonnet model, same rules)

### Refactoring Complete
- [ ] All hardcoded values replaced
- [ ] All tokens validated
- [ ] All composite patterns documented
- [ ] Ready to merge into production Toolskin

---

## Next Session Preparation

If you need to continue refactoring but run low on tokens:

1. **Save this guide** — reusable for next phase
2. **Archive AGENT_CONTEXT.md** — it doesn't change
3. **Preserve validation reports** — proof of work
4. **Keep composites.md** — your living documentation

Next session:
```
Ready to refactor Toolskin Phase 2.
Resume from Batch N (where Phase 1 ended).
Use same Agent Teams setup.
Expected cost: 6.9K tokens per batch.
```

---

**Start Date**: [Your session date]  
**Projected Completion**: 2–3 hours (wall-clock time)  
**Projected Token Cost**: 34.5K (vs. 75K without optimization)  
**Risk Level**: Low ✅  

Ready to spawn Batch 1? 🚀

# Agent Teams Token Consumption Optimization

## The Problem
Each agent in your three-agent team carries **full context overhead**:
- Design Tokens 2.0 architecture rules
- CSS validation checklist
- Naming conventions
- Reference materials

Running 3 agents in parallel with full context = **3x the context load** (even if staggered).

---

## Video Insights Applied to Token Budgeting

### Key Quote: "Use fewer agents"
The video explicitly addresses token overage: **reduce agent count or batch size to control costs**.

---

## Token Consumption Per Agent

### Current Baseline (Your Setup)
Each agent gets loaded with:
- Design Tokens 2.0 spec (~2K tokens)
- Three-tier architecture rules (~1K tokens)
- Validation checklist (~500 tokens)
- Naming conventions (~500 tokens)
- CSS examples (~1K tokens)
- **Subtotal per agent: ~5K tokens just in setup**

3 agents × 5K = **15K tokens before any work happens**.

---

## Mitigation Strategies (From Video + Best Practice)

### Strategy 1: Context Sharding
**What the video says**: "Provide full context as agents lack initial history"

**Token optimization twist**: Don't give *all* agents *all* context.

#### Implementation:

**Tokenizer Agent** gets:
- CSS token replacement patterns only (~1.5K)
- Naming convention quick-reference (~300 tokens)
- **Total: ~1.8K context**

**Validator Agent** gets:
- token-validation skill (already a skill file, so lazy-loaded ~500 tokens)
- Three-tier architecture rules (~1K tokens)
- Violation examples (~300 tokens)
- **Total: ~1.8K context**

**Documenter Agent** gets:
- Composite token template (~500 tokens)
- Documentation structure (~300 tokens)
- Examples of documented patterns (~400 tokens)
- **Total: ~1.2K context**

**Savings**: 5K × 3 = 15K → 1.8K + 1.8K + 1.2K = **4.8K tokens (68% reduction)**

---

### Strategy 2: Batch Sizing (Sequential Parallel Execution)
**What the video says**: "Assign specific work or dependencies"

**Token optimization**: Run agents sequentially per batch, not all-at-once.

#### Before (High Token Cost):
```
Batch 1 → All 3 agents active simultaneously
Batch 2 → All 3 agents active simultaneously
Batch 3 → All 3 agents active simultaneously
```
Each batch = 15K tokens × 3 batches = **45K total**

#### After (Sequential Batching):
```
Batch 1:
  - Tokenizer processes 100 lines → ~3K tokens
  - Validator reviews → ~2K tokens
  - Documenter extracts patterns → ~1K tokens
  - Shutdown agents
  
Batch 2:
  - Spawn fresh agents with same setup → ~5K tokens
  - Tokenizer processes next 100 lines → ~3K tokens
  - Validator reviews → ~2K tokens
  - Documenter extracts patterns → ~1K tokens
  - Shutdown agents
```

**Cost**: (5K setup + 3K + 2K + 1K) × 3 batches = **33K tokens**

**Savings**: 45K → 33K = **27% reduction via sequential batching**

---

### Strategy 3: Shared Knowledge Base (Off-Load Context)
**What the video says**: "Provide the AI with documentation so it has local knowledge"

**Token optimization**: Store design rules in a single "context file" agents reference, not embed in prompts.

#### Implementation:

Create `/docs/design-tokens/AGENT_CONTEXT.md`:
```markdown
# Agent Context: Design Tokens 2.0 Reference

[Tier 1 rules]
[Tier 2 rules]
[Tier 3 rules]
[Naming conventions]
[Composite patterns]
[Validation checklist]
```

Instead of pasting full rules in each prompt:

**Old way** (high token cost):
```
Create a team of 3 agents.
Tokenizer: [full rules pasted here ~5K tokens]
Validator: [full rules pasted here ~5K tokens]
Documenter: [full rules pasted here ~5K tokens]
```

**New way** (low token cost):
```
Create a team of 3 agents.

Reference: /docs/design-tokens/AGENT_CONTEXT.md (agents can access this file)

Tokenizer: Follow the token replacement rules in AGENT_CONTEXT.md section 1
Validator: Use the validation checklist from AGENT_CONTEXT.md section 4
Documenter: Reference the composite pattern template in AGENT_CONTEXT.md section 5
```

**Savings**: Agents read from disk, not context. Your prompt is **2K tokens instead of 15K** (87% reduction).

---

### Strategy 4: Model Downgrade for Non-Critical Agents
**What the video says**: "Create a team using [Haiku, Sonnet, or Opus] model"

**Token optimization**: Don't run all agents on Sonnet; use Haiku for simple tasks.

#### Implementation:

```
Tokenizer: Sonnet (pattern matching requires reasoning)
Validator: Haiku (checklist approval is mechanical)
Documenter: Sonnet (compositional understanding needed)
```

**Token cost comparison**:
- Sonnet: ~1.5x input tokens, ~2x output tokens
- Haiku: ~1x input tokens, ~1x output tokens

**Per-batch cost**:
- All Sonnet: (3K + 2K + 1K) × 1.5x = **9K tokens**
- Mixed (S+H+S): (3K × 1.5) + (2K × 1) + (1K × 1.5) = **8K tokens**

**Savings**: 9K → 8K = **11% reduction, with negligible quality loss for validation**

---

### Strategy 5: Avoid Message Overhead
**What the video says**: "Teammates can directly message each other"

**Token trap**: Each message = full context reload + message + response. Minimize cross-agent messaging.

#### Anti-Pattern (High Token Cost):
```
Tokenizer: "Is line 120 correct?" (sends full context to Validator)
Validator: "No, fix it" (Validator reads full context, responds)
Tokenizer: "Fixed, check again?" (context reload again)
```
**Cost per back-and-forth: ~4K tokens**

#### Optimized Pattern (Low Token Cost):
```
Tokenizer: (processes 100 lines)
Tokenizer: "Batch 1 complete. File saved at _tokenizer_batch1.css"
Validator: (reads file, validates in bulk)
Validator: "Batch 1 approved. Violations: [list]"
Tokenizer: (reads violations, fixes in next batch)
```
**Cost**: One message per agent per batch = **~500 tokens instead of 4K per message**

---

## Consolidated Token Budget

### Scenario A: Your Current Setup (No Optimization)
```
Batch 1: 15K (full context × 3 agents)
Batch 2: 15K
Batch 3: 15K
Total for 300 lines: 45K tokens
Cost per line: 150 tokens
```

### Scenario B: All Optimizations Applied
```
Batch 1:
  - Context sharding: 4.8K (instead of 15K)
  - One per-batch message: 500 tokens
  - Haiku for Validator: -20% on 2K = 1.6K (instead of 2K)
  - Subtotal: ~6.9K

Batch 2: 6.9K (agents re-spawned, new context)
Batch 3: 6.9K
Total for 300 lines: 20.7K tokens
Cost per line: 69 tokens (54% reduction)
```

---

## Implementation Roadmap

### Phase 1: Immediate (Next Session)
- [ ] Create `/docs/design-tokens/AGENT_CONTEXT.md` with consolidated rules
- [ ] Update prompt template to reference this file, not embed rules
- [ ] Test with 1 batch (button tokens) using shared knowledge base

**Expected savings**: ~40% tokens

---

### Phase 2: Batch Optimization
- [ ] Switch from "spawn all agents, run all batches" to "spawn per batch, shutdown, repeat"
- [ ] Define clear batch boundaries (button, input, card, modal, etc.)
- [ ] Set up cleanup step between batches

**Expected savings**: Additional 20% (cumulative ~54%)

---

### Phase 3: Model Stratification
- [ ] Confirm Haiku accuracy for validation (test on 1–2 batches)
- [ ] If approved, use Haiku for Validator only
- [ ] Keep Sonnet for Tokenizer and Documenter

**Expected savings**: Additional 10% (cumulative ~60%)

---

### Phase 4: Message Discipline
- [ ] Document "no cross-agent messages except at batch boundaries"
- [ ] Train agents to save work to files, not send messages
- [ ] Use file-based approval flow (Validator writes JSON approval, Tokenizer reads it)

**Expected savings**: Negligible if you skip frequent messaging (already factored in above)

---

## Token Runaway Safeguards

### Hard Limit: Max Tokens per Batch
Add this to your prompt:

```
HARD CONSTRAINT: Each agent must complete its task using ≤ 6K tokens.
If you approach 5K tokens, summarize findings and save to file.
Do not continue chatting; move to next batch.
```

### Monitoring: Token Counter
Before each batch, state:

```
Batch N context budget: 6.9K tokens
Current usage: [show running total]
Remaining: [show buffer]
```

### Fallback: Switch to Sequential Single-Agent
If token cost exceeds 7K per batch:

```
Abort team. Restart with single Tokenizer agent.
Less parallel speed, but guaranteed to complete.
```

---

## Your Specific Situation

**Current issue**: "no measures to prevent agents from consuming much resources per agent"

**Root cause**: Context is passed fully to each agent. With 3 agents in parallel, you pay 3x context cost.

**Solution**: 
1. **Context sharding** (give each agent only what it needs)
2. **Sequential batching** (spawn/shutdown per batch instead of all-at-once)
3. **Shared knowledge base** (read from disk, not prompt)

**Expected outcome**: 
- 54% token reduction (45K → 20.7K for full refactoring)
- Same final output quality
- Same model (Sonnet) for critical work
- Can complete without shutdown protocol triggering

---

## Files to Create/Update

1. **`/docs/design-tokens/AGENT_CONTEXT.md`** (new)
   - Consolidated rules, no duplication
   - Agents read this, not embedded prompts

2. **`AGENT_TEAMS_PROMPT_TEMPLATE.md`** (update)
   - Remove embedded Design Tokens 2.0 rules
   - Add: "Reference /docs/design-tokens/AGENT_CONTEXT.md for rules"
   - Add: "HARD CONSTRAINT: ≤ 6K tokens per batch"

3. **Batch execution checklist** (new)
   - Define batch boundaries
   - Track tokens per batch
   - Spawn/shutdown cycle

---

## Next Steps

1. **Read** this document (you're here)
2. **Create** `/docs/design-tokens/AGENT_CONTEXT.md` with consolidated rules
3. **Update** the prompt template to reference the file
4. **Test** Batch 1 (button tokens) with optimized setup
5. **Monitor** token usage; adjust if needed
6. **Scale** to remaining batches if first batch is ≤ 7K tokens

This keeps you under budget without model downgrade. ✅

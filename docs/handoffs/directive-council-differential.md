# COUNCIL DIRECTIVE: Learn From the Differential
**This runs BEFORE any new sandbox work. No exceptions.**
**Purpose: derive a binding visual quality rule from comparing what failed vs what succeeded.**

---

## §1 — ORCHESTRATOR RULES

1. You dispatch 4 council sub-agents. You do NOT deliberate yourself.
2. Each voice gets fresh context. No voice sees another's output before writing its own.
3. You collect all 4 outputs and write the synthesis. Then HALT.
4. Confirm "ORCHESTRATOR CONFIRMED + HEAD: [hash]" before dispatching.

---

## §2 — WHAT HAPPENED (context for all voices)

Two outputs exist. One was approved. One was rejected.

**APPROVED — the visual target:**
```
expert-designer/showcase.html
expert-designer/screenshots/expert--designer-showcase.jpg
```
Built by Claude Design. Visually strong. Approved by owner.

**REJECTED — what the agent built:**
```
sandbox/00-design-reference/index.html
```
Built by a code agent following a directive. Audited clean (0 hard failures).
Owner reaction: "piece of shit." Visually weak. Looks like an engineering probe.

Both files load the same token system.
Both passed the design audit.
The audit cannot tell them apart. The owner can.

---

## §3 — COUNCIL INPUT PACKAGE

Each voice reads these files independently before writing:

```
expert-designer/showcase.html          ← approved output (read the full HTML)
expert-designer/screenshots/expert--designer-showcase.jpg  ← approved screenshot
sandbox/00-design-reference/index.html ← rejected output (read the full HTML)
expert-designer/SKILL.md               ← the decision protocol
expert-designer/references/02-typography.md
expert-designer/references/04-cards-and-containers.md
expert-designer/references/05-awwwards-patterns.md
```

---

## §4 — COUNCIL QUESTION (same for all 4 voices)

> "You have two HTML files that both use --ts-* tokens and pass the design audit.
> One was approved. One was rejected. Study both.
> Identify the SPECIFIC, CONCRETE differences that explain the gap.
> Then write a binding rule — something an agent can CHECK before shipping —
> that would have caught the rejected output before it reached the owner.
> Your rule must be testable. 'Looks good' is not a rule. 'Hero headline
> is minimum step 7 with negative tracking' IS a rule."

---

## §5 — COUNCIL VOICES

### Voice 1 — Design Skeptic
Load `_rebuild-design-dna.md` first.
Then read both HTML files.

Answer:
1. List every visual difference you find between approved and rejected.
   Be specific: "approved hero headline is ~57px, rejected is ~32px"
   not "approved looks more designed."
2. Which differences are IDENTITY-BREAKING? (lose these = lose Toolskin)
3. Which differences are polish? (nice to have, not blocking)
4. Write ONE binding rule the rejected output violated.

### Voice 2 — Design Critic
Read both HTML files.
Your frame: Rule 5 — "Would a Toolskin user recognize this as Toolskin?"

Answer:
1. What does the approved output have that makes it unmistakably Toolskin?
   List 3-5 specific elements (not vibes — specific CSS or HTML patterns).
2. What does the rejected output have that makes it look generic?
   List 3-5 specific elements.
3. Write ONE binding rule derived from the differential.

### Voice 3 — Architect
Read both HTML files.
Your frame: token usage and structure.

Answer:
1. Compare how both files use the token system.
   Does the approved output use tokens in a way the rejected does not?
   Or does the approved output use ADDITIONAL tokens the rejected lacks?
2. Are there tokens in the system that the approved output uses
   which are not yet in assets/css/next/system/?
   List them — these are system gaps.
3. Write ONE binding rule about token usage derived from the differential.

### Voice 4 — Pragmatist
Read both HTML files.
Your frame: what an agent needs to NOT repeat this failure.

Answer:
1. What instruction in the original directive caused the agent to build
   the rejected output? Quote it.
2. What instruction would have produced the approved output instead?
   Rewrite that specific instruction.
3. Write ONE binding rule about how agent directives must specify
   visual quality going forward.

---

## §6 — SYNTHESIS (orchestrator writes this after all 4 voices report)

Collect all 4 voices. Write to:
```
docs/handoffs/_visual-quality-differential.md
```

Structure:
```
# Visual Quality Differential — Approved vs Rejected

## The gap (what the audit missed)
[3 sentences max — what the audit score cannot measure]

## Identity-breaking differences (from Skeptic + Critic)
[bulleted list — specific, measurable]

## System gaps revealed (from Architect)
[tokens in approved output not yet in system layer]

## BINDING RULES — Visual Quality Gate
[numbered list of rules derived from all 4 voices]
[each rule must be checkable by an agent before shipping]
[format: "RULE VQ-N: [specific, testable condition]"]

## Directive fix (from Pragmatist)
[the rewritten instruction that would have prevented the failure]
```

Commit:
```
git add docs/handoffs/_visual-quality-differential.md
git commit -m "docs(council): visual quality differential — binding rules from approved vs rejected"
```

---

## §7 — AFTER COMMIT: encode binding rules

After the differential is committed, write the VQ rules to both memory files:
```
.remember/remember.md
.remember/core-memories.md
```

Under a new section: "## Visual Quality Rules (VQ)"

Then commit memory:
```
git commit -m "ruling(canon): Visual Quality Rules encoded from differential analysis"
```

---

## §8 — ONLY THEN: rebuild the sandbox

After both commits, dispatch the sandbox rebuild directive:
```
docs/handoffs/directive-design-reference-final.md
```

The sub-agent building the sandbox reads the VQ rules FIRST.
Every section it builds gets checked against the VQ rules before it moves to the next.

---

## §9 — HARD BLOCKERS

- Any voice produces fewer than 3 specific differences (not vibes)
- Synthesis produces rules that are not testable
- VQ rules are not committed before sandbox rebuild starts
- Orchestrator starts building the sandbox before council completes

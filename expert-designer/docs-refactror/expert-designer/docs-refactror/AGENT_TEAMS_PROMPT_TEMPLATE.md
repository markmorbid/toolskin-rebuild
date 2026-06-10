# Agent Teams Prompt Template for Toolskin Token Refactoring

Use this prompt when you want to spawn a three-agent team for Design Tokens 2.0 refactoring.

---

## Multi-Agent Token Refactoring Team

**Context**: We are refactoring Toolskin's design token architecture to match Design Tokens 2.0 (Primitive → System → Component three-tier model). The file `customized_v3.css` (~10.5K lines) contains hardcoded hex values, spacing, and border-radius that need systematic replacement with semantic `--ts-*` tokens.

**Create a team of 3 teammates using Sonnet model. They share a task list and can message each other directly.**

---

### Agent 1: CSS Tokenizer

**Role**: Convert hardcoded CSS values to semantic Toolskin tokens.

**Owner**: Assigned to `src/styles/customized_v3.css` (read) and `src/styles/_refactored_tokens.css` (write).

**Responsibilities**:
- Scan `customized_v3.css` for all hardcoded hex colors, rgb values, spacing (px), and border-radius
- Replace with corresponding `--ts-*` tokens:
  - Hex colors → `--ts-bg-*`, `--ts-text-*`, `--ts-border-*`, `--ts-accent-*`
  - Spacing (px) → `--ts-sp-*` (4px base scale: 1=4px, 2=8px, 3=12px, etc.)
  - Border-radius (px) → `--ts-radius-*` (base 2px scale: 1=2px, 2=4px, etc.)
- Group modifications by component (button, input, card, modal, etc.)
- Save completed components to `_refactored_tokens.css`
- **Message the Token Validator** when each component batch (50–100 lines) is done: "Lines X–Y of component NAME ready for validation"

**Success Criteria**:
- Zero hardcoded hex/rgb values in output (all replaced with tokens)
- All `--ts-*` references follow naming convention
- Output file is syntactically valid CSS

**Do NOT**:
- Modify component selectors or structure (only CSS property values)
- Delete or reorganize commented documentation
- Worry about theme application (Validator + Documenter handle that)

---

### Agent 2: Token Validator

**Role**: Verify CSS changes conform to Toolskin's three-tier token architecture.

**Owner**: Assigned to validation reports and approval flow.

**Dependencies**: Receives batches from CSS Tokenizer.

**Responsibilities**:
- Review each batch from Tokenizer against the **token-validation skill** checklist:
  - Naming compliance: All `--ts-` prefixes correct
  - Reference correctness: No cross-tier references (Tier 2 only refs Primitives, Tier 3 only refs System)
  - No hardcoded values
  - Composite tokens have documentation comments
- Report findings as JSON or markdown:
  ```
  {
    "batch": "button component (lines 100–150)",
    "status": "PASS" | "REVIEW" | "FAIL",
    "violations": [
      "Line 120: hardcoded #0033cc, should use --ts-accent-active"
    ],
    "notes": "3 new color-mix() patterns detected; ready for Documenter"
  }
  ```
- **Message Tokenizer** with violations: "Lines X–Y need rework: [reason]"
- **Message Documenter** with approved patterns: "New composite token found: [pattern]"
- Approve or request fixes before Documenter moves forward

**Success Criteria**:
- All violations caught and reported
- Clear, actionable feedback for Tokenizer
- Patterns extracted for Documenter

---

### Agent 3: Documentation Updater

**Role**: Document composite tokens and update theme layer architecture.

**Owner**: Assigned to `/docs/design-tokens/` files.

**Dependencies**: Receives approved patterns from Validator and needs context from Tokenizer.

**Responsibilities**:
- Update `/docs/design-tokens/composites.md` with new `color-mix()` and `calc()` patterns discovered:
  ```markdown
  ## color-mix-btn-hover
  - Layer: Component (Tier 3)
  - Pattern: `color-mix(in srgb, var(--ts-accent-base) 8%, var(--ts-bg-surface-1))`
  - Purpose: Subtle accent blend for button hover state
  - Used by: .button:hover, .btn-default:hover
  - Dependencies: --ts-accent-base, --ts-bg-surface-1
  - Computed in default theme: [example hex/rgb]
  - Computed in dark theme: [example hex/rgb]
  - Computed in lush mode: [example hex/rgb]
  ```
- Create or update `/docs/design-tokens/font-scale.md` with computed font-size ratios:
  ```
  Base: 16px (1rem)
  Ratio: 1.125 (Perfect Fifth)
  --ts-size-xs: calc(16px / 1.125^2) = 12.64px
  --ts-size-sm: calc(16px / 1.125) = 14.22px
  [... etc ...]
  ```
- Update `/docs/design-tokens/layered-themes.md` to document how Primitive-layer theme swaps (HSL `--ts-accent-h/s/l`) cascade through System and Component layers
- **Message Tokenizer** if clarification needed: "What is the intent of this token? Who uses it?"
- **Message Validator** if pattern interpretation is unclear

**Success Criteria**:
- Composite tokens have complete entries (pattern, purpose, usage, computed values)
- Font-size ratios documented with formulas
- Theme cascade architecture clearly explained
- Ready for site publication

---

## Execution Rules

1. **File Ownership** (prevents overwrites):
   - Tokenizer: `_refactored_tokens.css` only
   - Validator: `validation-report.json` only
   - Documenter: `/docs/design-tokens/*` only

2. **Inter-Agent Messaging**:
   - Tokenizer → Validator: "Ready to check lines X–Y"
   - Validator → Tokenizer: "Fix violations in lines X–Y, then resubmit"
   - Validator → Documenter: "New patterns found: [list]"
   - Documenter → Validator/Tokenizer: "Clarification needed on [token]"

3. **Shared Task List**:
   - [ ] Tokenizer: Complete button component
   - [ ] Validator: Approve button component
   - [ ] Documenter: Document button tokens
   - [ ] Tokenizer: Complete input component
   - [ ] Validator: Approve input component
   - [ ] Documenter: Document input tokens
   - [... continue for all components ...]
   - [ ] Final: All three confirm work saved and complete

4. **Temp File Saves**:
   - Tokenizer saves as `_tokenizer_temp.css` every 500 lines to prevent loss
   - Validator saves as `_validator_temp.json` after each batch
   - Documenter saves as `_documenter_temp.md` after each update

5. **Shutdown**:
   - When all work is done, each agent confirms: "I have saved my final deliverable at [path]."
   - Once all three confirm, close the team cleanly (don't force-kill).

---

## Reference Materials (Paste into Prompt)

### Design Tokens 2.0 Architecture (for context)

**Primitive Layer** (raw values):
```css
--ts-accent-h: 210; --ts-accent-s: 100; --ts-accent-l: 50;
--ts-sp-1: 4px; --ts-sp-2: 8px; /* ... spacing scale ... */
--ts-radius-1: 2px; --ts-radius-2: 4px; /* ... radius scale ... */
```

**System Layer** (semantic, refs Primitives):
```css
--ts-bg-surface-0: hsl(var(--ts-accent-h), var(--ts-accent-s), 98%);
--ts-text-primary: hsl(var(--ts-accent-h), 0%, 12%);
--ts-accent-hover: hsl(var(--ts-accent-h), var(--ts-accent-s), calc(var(--ts-accent-l) + 8%));
```

**Component Layer** (purpose-specific, refs System):
```css
--ts-btn-padding: calc(var(--ts-sp-2) * var(--ts-btn-scale));
--ts-btn-bg-hover: color-mix(in srgb, var(--ts-accent-base) 8%, var(--ts-bg-surface-1));
```

### Naming Convention
- Tier 1 (Primitive): `--ts-[raw-name]` (e.g., `--ts-accent-h`, `--ts-sp-1`, `--ts-radius-2`)
- Tier 2 (System): `--ts-[semantic]-[variant]` (e.g., `--ts-bg-surface-1`, `--ts-text-primary`, `--ts-accent-hover`)
- Tier 3 (Component): `--ts-[component]-[property]` (e.g., `--ts-btn-padding`, `--ts-input-focus-ring`, `--ts-card-bg`)

---

## Expected Outputs

When the team completes:
1. **`_refactored_tokens.css`**: Full CSS with all hardcoded values replaced
2. **`validation-report.json`**: Batch-by-batch approval report
3. **`/docs/design-tokens/composites.md`**: New composite token entries
4. **`/docs/design-tokens/font-scale.md`**: Computed ratios (or updated if exists)
5. **`/docs/design-tokens/layered-themes.md`**: Theme cascade explanation (or updated if exists)

---

## Token Budget Notes

- 3 agents (not more)
- Direct messaging between agents = ~15% token savings vs. funneling through main session
- Expected total cost: 20K–28K tokens for full customized_v3.css refactoring
- Run in parallel; Validator can approve while Tokenizer continues next component
- Documenter can work on one pattern while Validator reviews another

---

## Common Issues & Fixes

| Issue | Fix |
|-------|-----|
| Validator inactive | Assign it a batched task: "Review lines X–Y while Tokenizer works on next component" |
| Tokenizer over-writes Validator's report | Pre-assign files: Tokenizer only touches `_refactored_tokens.css` |
| High token usage | Reduce team to 2 agents (Tokenizer + Validator only; document later) |
| Lost work | Enforce temp file saves: `_agent-name_temp_[timestamp].css` |
| Agents unsure who to message | Name recipients: "Message the Token Validator" not "send update" |


**# TASK: Sandbox CSS Consolidation**

  "Served as   record for  concept   reinforncemt and  
  sewrving as accurate context for a dedicated agent. 
  Refactor process and initial commits and progressions
  dated on *[May 29 2026]*."

  **iSSUED FOFR REFACTORING ON  jUNE 9TH 2026**



** [Priority: execute before STEP 2 (VQ rules).] **
**Owner must approve sandbox.css before ANYTHING else happens.**

----------------------------------------------------

## STEP A — BACKUP FIRST (mandatory)


### **Before touching any file:**

-* $timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm"
-* $dest = "docs/handoffs/backups/sandbox-pre-consolidation-$timestamp"
-* New-Item -ItemType Directory -Path $dest -Force
-* Copy-Item sandbox -Destination "$dest/sandbox" -Recurse -Force
-* Copy-Item expert-designer/starters -Destination "$dest/starters" -Recurse -Force
-* Copy-Item expert-designer/showcase.html "$dest/showcase.html" -Force

Confirm backup path exists. Then proceed.
STEP B — CSS CONSOLIDATION 
Scope: sandbox stabilization ONLY.
NOT a refactor. NOT tokenization. NOT component system design.
Output: ONE file — sandbox/sandbox.css

----------------------------------------------------

## SUB-AGENT (fresh context):

### Load: `.claude/skills/toolskin-architecture/SKILL.md`


----------------------------------------------------

## SOURCE FILES — extract every `<style>` block from ALL of these

-* sandbox/00-design-reference/index.html
-* expert-designer/starters/01-centered-hero.html
-* expert-designer/starters/02-magazine-split.html
-* expert-designer/starters/03-asymmetric-hero.html
-* expert-designer/starters/04-oversized-type.html
-* expert-designer/starters/05-bento-landing.html
-* expert-designer/starters/06-magazine-toc.html
-* expert-designer/showcase.html

**THE MANDATORY NESTED COMPONENT PATTERN**

----------------------------------------------------


This is the owner-defined reference pattern.
Apply it to EVERY component that has states, variants, or child elements.
This is not optional. This is the law for all CSS going forward.


## BEFORE: 
*what we have — scattered, broken, duplicated*:


.css
```

  .hero .btn {
    background: #000;
    color: #fff;
    padding: 12px 20px;
  }
  .hero .btn:hover {
    background: #333;
  }
  .hero .btn .icon {
    color: #fff;
  }
  .hero .btn:hover .icon {
    color: #4f46e5;
  }
  .magazine .btn {
    background: #000;
    color: #fff;
    padding: 12px 20px;
  }
  .magazine .btn:hover {
    background: #222;
  }
  .magazine .btn .icon {
    color: #fff;
  }
  .magazine .btn:hover .icon {
    color: #3b82f6;
  }
  .btn.large {
    padding: 16px 28px;
  }
  .btn.primary {
    background: blue;
  }
  .btn.secondary {
    background: gray;
  }
  .btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  .container .btn:not(.secondary):hover {
    transform: translateY(-2px);
  }
  .card:has(.btn:hover) {
    box-shadow: 0 10px 30px rgba(0,0,0,0.2);
  }

AFTER (nested, self-contained, token-driven — THE TARGET):

  .btn {
    background: var(--btn-bg, #000);
    color: var(--btn-color, #fff);
    padding: var(--btn-padding, 12px 20px);

    .icon {
      color: var(--btn-icon-color, #fff);
    }

    &:hover {
      --btn-bg: var(--btn-hover-bg, #333);
      .icon {
        --btn-icon-color: var(--btn-hover-icon-color, currentColor);
      }
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    &.large  { --btn-padding: 16px 28px; }
    &.primary   { --btn-bg: var(--ts-accent); }
    &.secondary { --btn-bg: gray; }
  }

  /* Context-specific token overrides — scoped, not duplicated */
  .hero     .btn { --btn-hover-bg: #333; --btn-hover-icon-color: #4f46e5; }
  .magazine .btn { --btn-hover-bg: #222; --btn-hover-icon-color: #3b82f6; }

```

### WHY THIS PATTERN:
  - Single declarative block per component
  - States and variants live INSIDE the component — never scattered
  - Behavior controlled via tokens only — no duplication
  - Context overrides via parent selector — no specificity wars
  - Zero rule escape outside the component scope

### CONSOLIDATION RULES

-1. EXTRACT all `<style>` blocks. Label each with source file.

-2. IDENTIFY components with states/variants/children.
   Apply the nested pattern above to each one.

-3. SAFE DEDUPLICATION:
   - Identical rules (same properties + same values) → merge selectors
   - Partial overlap → split into shared group + individual differences
   - If unsure whether two rules are equivalent → DO NOT merge
   - Do NOT change class names
   - Do NOT remove any rule that might be context-dependent

-4. LIGHT ORGANIZATION — group output:

   -* LAYOUT
   -* TYPOGRAPHY
   -* COMPONENTS  // ← nested pattern applied here
   -* STATES & VARIANTS
   -* UTILITIES

-5. COMPATIBILITY: all existing HTML files must work without
   modification when they link to sandbox.css.


---


## OUTPUT
### Write to: `sandbox/sandbox.css`

#### HALT — OWNER MUST APPROVE BEFORE ANYTHING
  **When sandbox.css is written:**
  ---
  - STOP.
  - Do NOT commit.
  - Do NOT run audits.
  - Do NOT open the browser.
  - Do NOT proceed to STEP 2 or any other task.

---


### Report to meta-orchestration:
    
    - "sandbox.css" line count
    - Number of `<style>` blocks extracted (total, per file)
    - Number of rules merged
    - Number of components converted to nested pattern (list them)
    - Any rules NOT merged (ambiguous or conflicting — explain why)
    - Paste the FULL sandbox.css content here
    - Add to .remember/remember.md AND ".remember/core-memories.md"
      ---
       - [.] Owner reviews and approves.
       - [.] Only after owner says YES does anything else happen.
       - [.] No commit. No audit. No next step. Just show.
       - [.] MEMORY — encode permanently after backup commit
      ---

---

## *UNDER* - "CSS Architecture Rules":

    
    CSS-1 . NESTED COMPONENT PATTERN — mandatory for any component
              with states, variants, or child elements.
              All states (&:hover, &:disabled, &.variant) live INSIDE
              the component selector block. Never scattered outside.
              Context overrides via parent selector only (.hero .btn).
              Behavior controlled via CSS custom properties.
              Reference: see owner example in task directive.
              
    CSS-2 .  BACKUP BEFORE MERGE — before any CSS consolidation,
              backup originals to docs/handoffs/backups/ with timestamp.
              
    CSS-3 .  HALT AND SHOW — after any CSS consolidation or major
              CSS change, HALT. Show owner. Do NOT commit until
              owner explicitly approves. No audits. No browser. Just show.
              
    CSS-4 .  NO SCATTERED RULES — .component:hover declared outside
              the component block is a violation. Fix by nesting.



---


### Commit memory:
  [] - git add .remember/
  [] - git commit -m "ruling(css): nested component pattern + consolidation rules encoded"
  [] - Report memory commit hash.
  
  --Then wait. Do not proceed until owner approves sandbox.css.--



---

END OF FILE


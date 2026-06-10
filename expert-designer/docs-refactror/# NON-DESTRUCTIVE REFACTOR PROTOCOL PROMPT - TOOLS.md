# NON-DESTRUCTIVE REFACTOR PROTOCOL PROMPT - TOOLSKIN-PITCHDECK

## **You are working on an existing codebase ** . 
This is a **non-destructive refactor task**.

### Source of truth:
* `toolskin-pitchdeck_recovered-ASSHOLE_2.css` (authoritative)
* `toolskin-pitchdeck_recovered-ASSHOLE.css` (secondary, for comparison only)

### Hard rules (no exceptions):

* DO NOT delete, override, or rollback any existing code
* DO NOT rewrite entire sections
* DO NOT simplify by removal
* Every existing declaration must be preserved unless explicitly approved
* If something looks wrong, assume it is intentional until proven otherwise

### Process (mandatory order):

1. **Audit only (no changes)**

* Analyze structure, layout logic, token usage, and component patterns
* Identify inconsistencies, duplication, and technical debt
* Do not modify anything

2. **Diff analysis**

* Compare both CSS files
* Identify:

  * missing rules
  * overwritten logic
  * partial recoveries
  * regressions
* Output a clear diff report

3. **Intent reconstruction**

* Infer and document the purpose behind existing implementations
* Treat current code as deliberate design decisions, not mistakes

4. **Change proposal (no execution yet)**

* Suggest improvements ONLY as additive or scoped refinements
* No destructive edits allowed
* Each proposal must include:

  * reason
  * exact scope
  * proof it does not break existing behavior

5. **Approval checkpoint**

* Do not implement anything until explicitly approved

6. **Safe implementation (only after approval)**

- ** Changes must be:

- * additive, or
- * strictly scoped (no global side effects)
- No duplicate component definitions
- No overrides of Toolskin core components
- Prefer variants and token reuse

### Technical constraints:

* Respect Toolskin token system (no repeated static values)
* Inherit tokens (do not redefine parent values)
* Avoid redundant declarations (e.g. repeated bg/color values)
* Maintain modular, scoped CSS
* Preserve all working visual behavior

### Verification requirements:

* Ensure no visual regressions
* Maintain layout integrity (footer, padding, alignment, responsiveness)
* Validate against current working version

Failure conditions (must avoid):

* Any removed code
* Any visual regression
* Any duplicated component definitions
* Any override conflicts with Toolskin core
* Any increase in static hardcoded values

### Output format:

* Audit report
* Diff report
* Proposed changes (no implementation unless approved)

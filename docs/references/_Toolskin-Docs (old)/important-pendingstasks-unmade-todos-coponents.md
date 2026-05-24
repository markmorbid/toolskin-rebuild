

SCOPE CONSOLIDATION REQUIRED

* local tokens incorrectly scoped at dropdown level
* must be hoisted to .ts-ui-select root
* eliminate duplicated token declarations
* unify theming across trigger / dropdown / options
* separate structure, shape, theming
* dropdown must consume tokens only
* remove redundant and conflicting rules
---

@ts-component-exception

CRITICAL LAYOUT OVERRIDE — DO NOT CONSOLIDATE

* fixes dropdown width inside constrained layouts (.ts-card-col-half)
* enforces min-width using --ts-card-calculated-width
* layout-context dependent (font/icon selectors)
* must remain local and isolated
* uses !important intentionally
* future replacement: portal / fixed overlay dropdown
---

@ts-component-consolidate

ICON SELECTOR — EXTENSION OF ts-ui-select (NOT A SEPARATE COMPONENT)

* must align with base .ts-ui-select
* .ts-ui-select owns structure, states, tokens
* icon selector only extends behavior
* remove custom structure duplication (.ts-icon-dd-list, wrappers)
* unify with __dropdown and __option
* simplify state model
* remove token leakage
* remove CSS-driven logic
* keep icon preview, search overlay, sizing
---

@ts-component-consolidate

ICON SELECTOR — STATE + STRUCTURE NORMALIZATION

* keep only structural + proportional rules
* extract token-based sizing (--ts-input-icon-*)
* remove chained :has() and :not() conditions
* remove layout depending on state
* remove CSS simulation of logic
* move to explicit state attributes
* remove !important overrides
* remove svg / fill / opacity hacks
* remove app-scoped selectors
* CSS must style state, not define it
---

#CRAZY_FIX_RULES

* duplicated multiple times across file
* conflicting overrides and cascade fights
* includes hardcoded fixes and layout patches
* extract only proportional token-based logic
* remove opacity, transform, and override hacks
* delegate color patterns to separate token layer
---

@ts-component-boundary

ICON SELECTOR — SCOPE FINALIZATION

* component must live in global scope
* defines structure, layout, sizing, state hooks
* local scopes (banner-generator / oce panel):
* only token overrides allowed
* no structure, no state, no duplication
* must work outside app scope
* if it breaks → implementation invalid
* enforce portability and single source of truth
* icon selector is a variant of .ts-ui-select
---

@ts-component-consolidate

STRUCTURE UNIFICATION REQUIRED

* multiple parallel implementations of select exist
* wrappers and option structures do not match
* forced selector merging indicates architecture failure
* must unify DOM structure across all variants
* eliminate need for cross-scope selector hacks
---

@ts-component-consolidate

TOKEN OWNERSHIP CORRECTION

* tokens defined in leaf nodes instead of component root
* causes override conflicts and duplication
* must centralize all tokens in .ts-ui-select
* sub-elements must only consume tokens
* local scopes override tokens only
---

@ts-component-consolidate

STATE SYSTEM SIMPLIFICATION

* current state derived from CSS (:has, :hover, nested conditions)
* duplicated and inconsistent logic
* replace with explicit state model:
  [data-state="empty"]

  [data-state="selected"]

  [data-state="open"]

* JS defines state, CSS styles it
---

@ts-component-consolidate

CSS LOGIC REMOVAL

* CSS currently simulates logic (icon "none", visibility, placeholders)
* uses pseudo-elements and conditional styling hacks
* must remove logic from CSS
* move to JS-driven state
* CSS becomes presentation layer only
---

@ts-component-consolidate

APP SCOPE DECOUPLING

* .ts-banner-generator-app introduces behavior overrides
* breaks portability and component integrity
* app scope must only provide token overrides
* no structural or state rules allowed
---

END OF ICON SELECTOR REFACTOR NOTE

* asset must be moved to main/global scope
* local scopes only for minimal adjustments
* component must work without tweaks
* validate via sandbox refactoring tests
 no hidden dependencies allowed
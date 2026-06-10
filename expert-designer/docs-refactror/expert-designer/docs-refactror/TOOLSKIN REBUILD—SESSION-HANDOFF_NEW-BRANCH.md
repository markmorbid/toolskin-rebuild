# TOOLSKIN REBUILD — SESSION HANDOFF (OCE CSS CONSOLIDATION)

## STATUS SUMMARY

* Branch: `refactor/oce-css-js-sandbox`
* Remote: synced and pushed
* Snapshot: stable and backed up
* JS: **kept as-is (working correctly)**
* CSS: **unstable, fragmented, and causing regressions**

Claude Design is **no longer in control of the system direction**.
We are switching to a **local-first stabilization strategy**.

---

## CORE DECISION

We are **stopping all refactoring efforts** on CSS.

Refactoring has introduced:

* regressions
* inconsistencies
* visual breakage
* wasted time across multiple components

The **original Toolskin CSS is the visual source of truth**.

Goal now is:

> Stabilize first → Refactor later (in controlled phases)

---

## CURRENT STATE OF CSS

There are **4 CSS sources** currently in use:

### 1. Base extraction (raw manual)

* Nearly complete
* Contains missing tokens and base styles
* Does **not work standalone**

### 2. Manual attempt (partial improvement)

* Some tokens working
* Still incomplete and unreliable

### 3. Unfiltered extraction (attempt 1)

* Targets OCE panel selectors and structure
* Contains many duplicate and redundant rules

### 4. Unfiltered extraction (attempt 2)

* Focused on banner generator and containers
* Contains **legacy styles and dangerous overrides**
* Can break current system if not controlled

---

## CURRENT RESULT

* Combined CSS achieves ~80% visual accuracy
* JS works correctly without modification
* Tokens (colors, fonts, base system) are functional
* UI is **close to correct but fragile**

Main issue:

> CSS is unstable and inconsistent, not JS

---

## REFERENCE IMPLEMENTATION

Original system (visual ground truth):

https://satsea.io/toolskin-showcase/

Original CSS source:

https://satsea.io/toolskin-showcase/assets/css/toolskin.css

---

## WORKING DIRECTORY (EXTRACTION TESTS)

https://github.com/markmorbid/toolskin-rebuild/tree/26c7bca3a3d809d310f6826e1100c9ee94f3b4dd/assets/css/next/components/temptestextract

---

## OBJECTIVE

Create a **single, stable CSS file** for the OCE panel that:

* Matches the original Toolskin showcase visually **exactly**
* Works with existing JS (no rewrites)
* Does not introduce regressions
* Becomes the **baseline for future controlled refactor**

---

## CSS CONSOLIDATION TASK (STRICT EXECUTION MODE)

### GOAL

Produce a **single consolidated CSS file** for the OCE panel.

---

### CONSTRAINTS (MANDATORY)

#### 1. NO REFACTORING

* Do NOT rename selectors
* Do NOT reorganize structure
* Do NOT introduce tokens
* Do NOT simplify logic
* Do NOT reinterpret styles

This is **not a refactor task**.
This is **a recovery + stabilization task**.

---

#### 2. INPUT FILES

* `ts-oce-panel-unfiltered.css`
* `ts-oce-panel-unfiltered-2.css`

---

#### 3. PROCESS

##### STEP A — MERGE

* Combine both files into one
* Preserve original order strictly

---

##### STEP B — DEDUPE (STRICT)

* Remove ONLY **identical duplicate rules**
* Do NOT merge similar rules
* Do NOT optimize
* Do NOT restructure

---

##### STEP C — PURGE

Use:

* `oce-panel-extract.html` as content source

Safelist the following patterns:

* `/^ts-/`
* `/^is-/`
* `/^has-/`
* `/^active/`
* `/^open/`

Recommended tool:

* PurgeCSS
  https://purgecss.com/getting-started.html
  https://github.com/FullHuman/purgecss

---

#### 4. OUTPUT

* One single CSS file
* No missing selectors
* No structural modifications

---

#### 5. VALIDATION (CRITICAL)

The result MUST:

* Visually match the original Toolskin showcase
* Have zero layout shifts
* Preserve all icons
* Preserve all states (hover, active, open, etc.)

---

## FAIL CONDITIONS

If ANY of the following occurs, the task is invalid:

* Visual regression
* Selector renamed or altered
* Rule merged semantically
* Missing UI behavior
* Broken layout or components

---

## POST-CONDITION

ONLY AFTER SUCCESS:

→ Phase 2 (controlled refactor) will be defined separately

---

## IMPORTANT NOTES FOR AGENTS

* JS is already working → **DO NOT TOUCH IT**
* The issue is entirely CSS-related
* Original CSS is visually correct → treat it as ground truth
* Current refactor approach is causing degradation
* This task is about **precision, not improvement**

---

## STRATEGIC CORRECTION

Previous approach:

> Refactor first → fix later ❌

New approach:

> Stabilize first → refactor safely later ✅

---

## FINAL DIRECTIVE

Do not improvise.
Do not optimize.
Do not interpret.

Execute exactly as defined.

This is a **recovery operation**, not a redesign.

---

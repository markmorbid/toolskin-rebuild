# Nav/Header — Hardening, Pattern Extraction & System Integration
**For: Claude Design** · **From: Satoshi (owner)**

---

## CONTEXT — read this first

I did the final adjustments myself so this component finally looks exactly the
way I want. It's in a very good state now. What I need is to make sure what
currently looks good is actually **shippable and bulletproof** — proper
variants, a consistent nested CSS pattern, and no repeated code — and then turn
everything I learned building it into a repeatable system for every other
component.

This nav is the **first prototype that proves the patterns**. You are my
refactoring workbench — you produce the clean asset prototypes, and the engineer
agent team integrates them into the rebuild. So getting the pattern extraction
right here matters more than the nav itself: this component becomes the template
that teaches every downstream agent how to build at this level without me
hand-tuning each one. Doing this by hand is what's slowing everything down.

Since the last version I also did a lot more work that you need to study:

- Improved the transition from the active state when the mobile sidebar opens
  and the icon controls (toggle, burger, top-button) appear
- Added rotation to the top-arrow button on mobile so when the user is at the
  top it rotates to signal "slide the user to the next section"
- Refactored the entire at-top structure
- Made nested structures everywhere (list them all from my CSS)
- Made transition reveal/hide for the select on mobile and on sidebar opening
- Made the spaced nav design look like tabs — but you must make that a VARIANT
  of spaced (call it `tabbed`), keep the original spaced version, and craft
  more valid, beautiful nav designs as variants too

There's also a set of structural upgrades the header still needs — proper
semantic DOM, sub-navigations, a mega-menu host, a breakpoint token that
actually works, a transparent mode separated from at-top, and a promo banner
that couples with the header. All detailed below with the reference code.

**The CSS is currently being overwritten by me with a note at the top. Respect
that note.**

---

## ABSOLUTE RULE

Do not delete anything. Any rollback is strictly forbidden. The only allowed
actions are: **study, compare, document, add, extend, integrate.** If you
believe something should be removed, flag it as a note — never remove it
yourself. If anything is unclear or ambiguous, **ask before acting — do not
guess.**

---

## WHAT I'M GIVING YOU

- The attached backup file = the previous version (pre-merge baseline)
- My local copy = the latest version (what I hand-tuned)

Compare them. **The diff IS the lesson** — every change I made was deliberate.
Don't skim. Study the reasoning behind each change.

---

# TASKS

## TASK 1 — STUDY MY WORK + WRITE THE PATTERN REPORT

Read everything I changed between the backup and the latest version, including
the additional work listed in the context above. Then write a design report
that names each pattern as a **reusable, documented technique** (not as a
description of the nav). Patterns to extract and name:

- **Single-knob color dimming** — one `--ts-nav-text-alpha` controls all nav ink
- **Harmonic icon-item sizing** — toggle/burger/back-to-top derive ONE width +
  height from topbar height; height = topbar − 1px so dividers never overlap the
  border; glyph = width × 0.5
- **Auto-inverting border via `--ts-on-surface-auto`** — the seed of the whole
  on-surface system; border resolves correctly on any surface
- **Constrained radius cap** — `--ts-radius-constrained` stops a large
  `--ts-radius-base` from breaking header UI
- **Derivative spacing chain** — change one multiplier, everything rescales
- **Smart first/last button spacing** — `:first-child` / `:not(.ts-btn)+.ts-btn`
  / `:not(:has(+.ts-btn))` corrections for buttons mixed with navlinks
- **Nav-scoped (not global) motion override**
- **Surface re-anchor** — `--ts-this-bg` set ONCE per shell, derivatives cascade
- **The at-top refactor** — how the scroll-state structure now works
- **The mobile icon-reveal transition** and **top-arrow rotation** patterns

Also: **list every nested structure** you find in my CSS and confirm the `&`
nesting pattern is consistent across all of them.

This report becomes the design system's documented pattern vocabulary.

---

## TASK 2 — UPDATE THE EXPERT-DESIGNER SKILL + COMMITMENT

Use what you learned to update the expert-designer skill so future agents build
at this level automatically. Encode: token-recursive thinking, single-knob
controls, harmonic sizing from one anchor, auto-inverting color via on-surface,
constrained caps, derivative chains, the "set `--ts-this-bg` once, cascade
everything" principle, and the nested-block CSS discipline (all states, variants,
and children INSIDE the block, behavior via tokens). Update the commitment doc
so this quality bar is the standard, not the exception.

---

## TASK 3 — HARDEN THE NAV INTO A SHIPPABLE COMPONENT

- Reduce repeated CSS via the nested-block pattern (still too much repetition)
- Make it ONE-LINE, attribute-driven: a developer invokes the whole nav via data
  attributes, zero manual structural markup
- Wire the JS from the original toolkit (`ts-nav.js`: burger, overflow
  relocation, scroll-spy, theme toggle, logo-fit) plus any world-class production
  features you consider essential. Toolkits, assets, UI kit, and repo were
  already provided.
- Where you can't implement directly, write development notes precise enough for
  the engineer agent to execute without guessing

There is a separate open JS task (`TASK-nav-unification`) covering the
`.ts-menu-text` auto-wrap regression, the `data-ts-nav-variant` schema, and
desktop/mobile menu unification. Fold its requirements into your dev notes so the
JS handoff is complete.

---

## TASK 6 — VARIANT SYSTEM (formalize + expand)

The "tabs" look I made must become a VARIANT of spaced — call it `.tabbed` — and
the original `.spaced` version must be preserved. Craft additional valid,
beautiful nav designs as variants too.

Formalize this full variant class set (each token-configured, each meaningfully
different from the others):

```
.spaced              — original spaced layout
.tabbed              — the tab-style look I just made
.ts-icon--only       — icon-only items
.ts-nav--static      — static positioning
.ts-nav--sticky      — sticky positioning
.ts-nav--transparent — transparent header feature (see Task 8)
```

Buttons need a **scaling token in their rulesets** so the general button scaling
token can scale nav buttons easily per scope. Wire it through and TEST that
scaling actually works at different scopes.

---

## TASK 7 — SEMANTIC DOM STRUCTURE (ul > li > a)

The header still needs navigation built on a proper DOM structure. It currently
uses anchors directly, but it needs to be structured as **ul > li > a**.

This is vital. It also needs sub-items, sub-navs, a mega menu with columns
(solid, responsive, flexible columns — and rows too), and on mobile an accordion
slide-toggle alternative.

Preferably the main navigation displayed should be built on ul-li. The current
`.ts-nav-fixed__links` (the one with `.ts-nav-truncate` and id `ts-primary-menu`)
can be the `<ul>`, and `.ts-nav-item` can be the `<li>`, and inside them the
anchors are set.

To make that work, the CSS must use **conditional aliases or classes instead of
DOM-element selectors** (it currently refers to `a`, `button`, etc.).

The padding/width/height must be relegated to the list-item anchor links
(`ul.ts-nav-fixed__links > li.ts-nav-item > a`) like it currently does — but
wrapped with the `li` instead of being a direct child like the current CSS
selector structure.

### The pattern to fix so the `li` works globally

Current (restricts children to only those element types):

```css
.ts-nav-fixed__links> :is(a, button):not(.ts-btn)
```

The `a, button` restricts the child to only those kinds of direct elements, when
it should also accept `li` and/or the class `.ts-nav-item`:

```css
.ts-nav-fixed__links> :is(a,li, button,.ts-nav-item):not(.ts-btn)
```

And that selector restricts the structure only to the fixed nav. The list
element name should be more flexible:

```css
ul.ts-nav_links> :is(a,li, button,.ts-nav-item):not(.ts-btn)
```

### Two acceptable approaches — pick the cleaner one and justify it

**APPROACH A — CSS accepts the list structure:**
Use the flexible selectors above plus conditional aliases / classes instead of
element-type selectors, so the structure is flexible. Padding/width/height move
to the anchor inside the li: `ul.ts-nav-fixed__links > li.ts-nav-item > a`.

**APPROACH B — JS auto-wraps:**
JS automatically wraps anything in the menu with the proper DOM structure,
forcefully, with the classes and properties. The idea is to **not abuse classes
or inline elements at all** — just the necessary for a semantic, clean DOM output
layering (the OPPOSITE of Tailwind's class soup).

Recommend the approach and implement it (or write precise JS dev notes if it's a
JS-side change).

---

## TASK 8 — TRANSPARENT MODE (separate from at-top) + OFFSET COMPENSATION

The `.spaced`, `.tabbed`, `.ts-icon--only`, `.ts-nav--static`, `.ts-nav--sticky`
classes are variants. `.ts-nav--transparent` must be the class added when the
header is at-top AND the user wants the header transparent — like I did now on
the at-top rules.

**Currently that transparent option should NOT be a default behavior for at-top.**
Instead it's a transparent-header feature with token configuration and a class
for it. at-top is just a signal for scroll status, so that must be displaced into
`.ts-nav--transparent` and work for non-small devices or by user decision.

So separate the two concerns:
- **at-top** = a scroll-status signal ONLY
- **`.ts-nav--transparent`** = an opt-in transparent-header FEATURE with its own
  token configuration

When transparent mode is active alongside the fixed navigation, the first section
/ general container needs **top-padding offset compensation**.

The following code is a hand-picked extraction from the original `toolskin.css`.
It is the reference of the pattern needed to prevent top overflowing and design
misalignment when the topnav is fixed and transparent. Rebuild it cleanly,
tokenized — NOT as the `#CRAZY_FIX_RULES` hacks it currently is.

```css
/* #CRAZY_FIX_RULES */
body:has(.ts-promo-banner:not(.ts-dismissed)) nav.ts-nav-fixed {
	top: var(--ts-promo-banner-h);
}

/* Fixed header body offset */
body:has(.ts-nav-fixed):has(.ts-promo-banner.ts-dismissed) #ts-main .ts-section:first-of-type {
	padding-top: var(--ts-topbar-h);
}

body:has(.ts-nav-fixed):has(.ts-promo-banner:not(.ts-dismissed)) #ts-main .ts-section:first-of-type {
	padding-top: var(--ts-promo-banner-h);
	padding-top: calc((var(--ts-topbar-h) + var(--ts-promo-banner-h)));
}

/* Fixed header body offset */
body:has(.ts-nav-fixed):has(.ts-promo-banner.ts-dismissed) #ts-main .ts-section:first-of-type {
	margin-top: calc(var(--ts-topbar-h)* - 1);
	margin-top: calc((var(--ts-topbar-h) + var(--ts-promo-banner-h))* - 1);
}

body:has(.ts-nav-fixed, .ts-topbar.fixed):not(:has(.ts-section.ts-hero, .ts-mobile-menu))>*.hide-section {
	padding-top: calc(var(--ts-topbar-h, 80px)) !important;
}

body:has(#ts-topbar:not(.ts-nav-fixed)) {
	padding-top: 0;
}

/* ─── §8a  Hero Section ─── */
.ts-hero {
	/* Account for fixed header elements (topbar + optional promo banner) */
	--_ts-hero-offset: var(--ts-topbar-h);
	min-height: 100vh;
	display: flex;
	flex-direction: column;
	justify-content: center;
	padding-top: calc(var(--_ts-hero-offset) + var(--ts-sp-14));
	padding-bottom: var(--ts-sp-14);
	padding-inline: var(--ts-container-pad);
	position: relative;
	overflow: hidden;
	background-color: var(--ts-bg-0);
	/* Opaque fallback — ensures blend modes work */
	padding-bottom: var(--ts-sp-14);
}

/* When promo banner is visible, double the offset (banner + nav both use --ts-topbar-h) */
body:has(.ts-promo-banner:not(.ts-dismissed)) .ts-hero {
	--_ts-hero-offset: calc((var(--ts-topbar-h) + var(--ts-promo-banner-h) + var(--ts-sp-14)));
	padding-top: var(--_ts-hero-offset) !important;
	padding-bottom: var(--ts-sp-14);
}
```

---

## TASK 9 — BREAKPOINT TOKEN SYNC (critical usability blocker)

The mobile breakpoint variable currently **doesn't make any change**. We need to
synchronize the media-query values with the breakpoint custom-value token.

This is a problem because not being able to control this makes the framework and
system really uncomfortable to use.

The media query is hardcoded:

```css
/* ── 5.7  RESPONSIVE — collapse to burger + mobile menu (owner 2.2 breakpoint
   868px). SCOPED to the real fixed header via :not(.ts-nav--static) so the
   static demo navs keep ALL their links at any width. ── */
@media (max-width: 868px) {
```

…while the token says something else entirely:

```css
  /* — Responsive switch + mobile/sidebar geometry (owner 2.2: collapse 720px).
       (The nav-scope --ts-z-sticky override was REMOVED so the header uses the
       canonical global z-stack value, 2000.) */
  --ts-nav-collapse-at: 720px;
  /* burger/mobile breakpoint */
  --ts-mobile-width: clamp(260px, 78vw, 360px);
  --ts-sidebar-nav-w: 200px;
```

The hardcoded `868px` and the token `720px` are disconnected, so the token does
nothing. Make `--ts-nav-collapse-at` the **single source of truth** that actually
controls the collapse. Since native `@media` can't read a custom property
directly, solve it cleanly — options:

- A container-query / style-query approach driven by the token
- A JS-applied breakpoint that reads `--ts-nav-collapse-at` and toggles a state
  class at the right width
- A documented build-time variable if neither fits

Pick the most robust cross-browser solution.

---

## TASK 10 — SUB-NAVS + DROPDOWN AS MEGA-MENU HOST

The nav needs sub-items and sub-navigations. Build them on the **existing
dropdown used for the truncation (•••) overflow** — that same dropdown element
becomes the host for:

- Simple sub-item lists (an anchor item with a child element)
- Columns AND rows of items
- Eventually a mega-menu container

The sub-navigations using sub-items need to use the existing dropdown used on the
truncation. That element can hold the mega-menu container and columns (and rows
too). So the **sizing of the dropdown must be able to handle that much kind of
content.**

**Mega menu** must be an add-on component with external wiring and configuration
that hooks into the navigation but is **standalone**. It must be developed later
— but keep an open mind to it now. For now the dropdown must be able to hold that
kind of content, so size it accordingly. **Make an example of a simple anchor
item with a child element.**

On mobile, the sub-nav alternative is an accordion slide-toggle.

Keep the architecture open so the mega menu can plug into the dropdown later
without a rewrite.

---

## TASK 4 — CONSOLIDATE THE ON-SURFACE INVERSION SYSTEM

The border already auto-inverts via `--ts-on-surface-auto`. Extend that SAME
mechanism to text, icons, and interactive states so that when `--ts-this-bg`
resolves to accent or glass, **everything resolves correctly with zero
per-component overrides.** No new tokens — wire through the existing
`--ts-on-surface` / `--ts-on-accent` stack.

The goal: identical behavior regardless of which underlying engine
(surface/accent/gradient/glass) is active. No deferred color applications, no
special-case rules. This is the single most important consolidation — it's what
makes every other component migration trivial.

### Reference — the select trigger token cartel I built (study this pattern)

This is the nested, asset-scoped, token-driven approach the on-surface system
should generalize. Note how it re-anchors `--ts-this-bg` and derives everything
from tokens:

```css
/* OWNER FIX & REFACTOR NOTES:

This defines a refactoring approach based on a nested, asset-scoped, token-driven system focused on properties and state.

In this implementation, surface mixing is combined with accent and background tokens. This produces consistent results across light and dark themes, enabling subtle visual variation without relying on high-contrast surface differences.

Core approach:
- Establish primary styling patterns at the component scope
- Allow the cascade to resolve final behavior naturally
- Avoid redundant or scattered declarations

This pattern serves as a foundation for:
- System-wide color strategies
- Token-based styling rules
- Predictable component behavior

All styling decisions should be driven by token definitions and configuration layers:
- Global tokens (root-level system values)
- Local tokens (component or state overrides)

This shifts responsibility away from individual style declarations and centralizes control at the token and state level.

Goal:
A cohesive, scalable styling system where components derive their appearance from structured tokens and state, rather than ad hoc CSS rules.

*/
.ts-nav-fixed {
	.ts-ui-select {
		.ts-ui-select__trigger {
			border-color: var(--ts-navlink-input-border);
			outline-color: var(--ts-navlink-input-border);
			background-color: var(--ts-navlink-input-bg);
			color: var(--ts-input-color);
			--ts-input-border: color-mix(in srgb, var(--ts-this-bg), var(--ts-navlink-input-color) var(--ts-navlink-border-alpha)) !important;
			--ts-input-bg: color-mix(in srgb, var(--ts-this-bg), var(--ts-on-surface-muted) var(--ts-navlink-bg-alpha)) !important;
			--ts-input-color: var(--ts-text-primary-dim-2);
			--ts-input-color-hover: var(--ts-text-primary);
			--ts-input-color-focus: var(--ts-text-accent);
			--ts-navlink-input-border: var(--ts-input-border);
			--ts-navlink-input-color: var(--ts-input-color);
			--ts-navlink-input-bg: var(--ts-input-bg);
			--ts-navlink-border-alpha: 25%;
			--ts-navlink-bg-alpha: 8%;
			--ts-this-bg: var(--ts-bg-0-t);
		}
	}
}
```

The `!important` flags and srgb mixes here are the exact thing the on-surface
consolidation should make unnecessary. The target: this whole cartel collapses
into automatic on-surface inheritance.

---

## TASK 11 — PROMO BANNER (implement alongside the header)

There's a pending promo-banner element that sits ABOVE the fixed nav, pushing it
downward, and is referenced in the offset code above. It needs to be implemented
— and ideally implemented ALONGSIDE the header, since they're coupled (the banner
height feeds the nav top offset and the first-section padding).

I'm providing the existing promo-banner CSS and HTML as the reference. It works
but it's full of `#CRAZY_FIX_RULES` — fragile media-query hacks, forced no-wrap,
and layout coupled to sidebar state. Rebuild it cleanly per the OWNER REFACTOR
NOTE embedded below.

### Promo banner — full reference CSS

```css
/* ── PROMO BANNER (dismissable top bar) ──────────────────── */
.ts-promo-banner {
	background: linear-gradient(135deg, var(--ts-accent), var(--ts-accent-dark));
	padding: 0px 20px;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: var(--ts-sp-4);
	position: relative;
	z-index: 200;
	max-height: var(--ts-promo-banner-h);
	overflow: hidden;
	transition: max-height 0.5s var(--ts-ease-in-out),
		padding 0.5s var(--ts-ease-in-out),
		opacity 0.35s var(--ts-ease-in-out);
	padding-right: var(--ts-promo-banner-h);
	flex-wrap: nowrap;
	align-content: stretch;
	/* position: sticky; */
}

.ts-promo-banner:not(.ts-dismissed) {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	z-index: calc(var(--ts-z-offcanvas) - 5);
	max-height: var(--ts-promo-banner-h);
	height: var(--ts-promo-banner-h);
}

.ts-promo-banner::before {
	content: "";
	position: absolute;
	inset: 0;
	background: repeating-linear-gradient(90deg,
			rgba(255, 255, 255, 0.04) 0px,
			rgba(255, 255, 255, 0.04) 1px,
			transparent 1px,
			transparent 40px);
	pointer-events: none;
}

.ts-promo-banner.ts-dismissed {
	max-height: 0;
	padding-top: 0;
	padding-bottom: 0;
	opacity: 0;
	pointer-events: none;
}

.ts-promo-banner__text {
	font-family: var(--ts-font-body);
	font-size: var(--ts-fs-body-sm);
	font-weight: 400;
	color: var(--ts-on-accent);
	text-shadow: 0 1px 2px rgba(0, 0, 0, 0.32);
	letter-spacing: 0.02em;
	display: flex;
	gap: 10px;
	flex-direction: row;
	/* white-space: nowrap; */
	flex-wrap: nowrap;
	/* flex: 1 1 100%; */
	line-height: 1.2;
	max-width: 100%;
	align-items: center;
}

.ts-promo-banner__text strong {
	font-weight: 800;
	text-transform: uppercase;
	font-family: var(--ts-font-display);
	font-size: 120%;
}

.ts-promo-banner__text strong:has(.ts-icon) {
	display: inline-flex;
	align-items: center;
	gap: 8px;
}

.ts-promo-banner__cta {
	display: inline-flex;
	align-items: center;
	gap: 3px;
	padding: 8px 14px;
	border-radius: var(--ts-radius-full);
	background: rgba(0, 0, 0, 0.35);
	color: #fff;
	background: var(--ts-accent-dim-0);
	color: var(--ts-on-accent);
	font-weight: 500;
	font-size: var(--ts-fs-2xs);
	text-decoration: none;
	border: none !important;
	outline: none !important;
	transition: var(--ts-btn-base-transitions);
	white-space: nowrap;
	flex: 0 1 auto;
	box-shadow: none;
	text-transform: uppercase !important;
	line-height: 1.75;
	letter-spacing: 0.05rem;
	flex-direction: row;
	flex-wrap: nowrap;
	--ts-accent: black;
	transition-duration: var(--ts-dur-fast);
}

.ts-promo-banner__cta:hover {
	background: var(--ts-on-accent);
}

.ts-promo-banner__close {
	position: absolute;
	right: var(--ts-sp-4);
	top: 50%;
	transform: translateY(-50%);
	border: none;
	background: var(--ts-accent-dim-0);
	color: var(--ts-on-accent);
	width: 24px;
	height: 24px;
	border-radius: 50%;
	cursor: pointer;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 10px;
	transition: all 0.2s;
	aspect-ratio: 1;
	z-index: 3;
	--ts-accent: black;
}

.ts-promo-banner__close:hover {
	background: var(--ts-on-accent);
	color: var(--ts-accent);
}

/* #CRAZY_FIX_RULES */
body:has(.ts-promo-banner:not(.ts-dismissed)) nav.ts-nav-fixed {
	top: var(--ts-promo-banner-h);
}

/* Fixed header body offset */
body:has(.ts-nav-fixed):has(.ts-promo-banner.ts-dismissed) #ts-main .ts-section:first-of-type {
	padding-top: var(--ts-topbar-h);
}

body:has(.ts-nav-fixed):has(.ts-promo-banner:not(.ts-dismissed)) #ts-main .ts-section:first-of-type {
	padding-top: var(--ts-promo-banner-h);
	padding-top: calc((var(--ts-topbar-h) + var(--ts-promo-banner-h)));
}

/* Fixed header body offset */
body:has(.ts-nav-fixed):has(.ts-promo-banner.ts-dismissed) #ts-main .ts-section:first-of-type {
	margin-top: calc(var(--ts-topbar-h)* - 1);
	margin-top: calc((var(--ts-topbar-h) + var(--ts-promo-banner-h))* - 1);
}
```

### Promo banner — OWNER REFACTOR NOTE (the mobile media-query block to rebuild)

```css
/* #CRAZY_FIX_RULES

A complex media-query-based ruleset was introduced to stabilize a poorly structured banner in mobile scenarios.

Current behavior:
- The primary button switches to an overlay-style button on mobile
- The banner is forced to avoid wrapping when the sidebar opens
- Visual result is acceptable, but the implementation is fragile

Problems:
- Text wrapping logic is inconsistent and unpredictable
- Layout behavior is tightly coupled to edge-case conditions (e.g. sidebar state)
- Heavy reliance on ad hoc media queries instead of system-driven responsiveness
- Low maintainability and poor scalability

Required improvements:
- Replace conditional layout hacks with pattern-based, token-driven layout logic
- Use intrinsic layout techniques (flex/grid, min/max constraints, clamp) instead of forced no-wrap rules
- Decouple banner behavior from external UI states (like sidebar open/close)
- Define a reusable responsive pattern for "banner with action" components
- Introduce tokenized rules for:
  - Button placement (inline / stacked / overlay)
  - Text wrapping thresholds
  - Container constraints (max-width, safe areas, padding)

Goal:
A deterministic, system-driven banner behavior that adapts automatically across breakpoints without fragile overrides or special-case media queries.

*/

@media only screen and (max-width: 720px) {
	:root {
		--ts-promo-banner-h: calc(var(--ts-topbar-h)*.75);
	}

	.ts-promo-banner .ts-promo-banner__cta {
		position: absolute;
		top: 50%;
		right: auto;
		left: 50%;
		bottom: auto;
		transform: translate(-50%, -50%) scale(1.075) !important;
		transform-origin: center center;
		opacity: 0;
		pointer-events: none;
	}

	.ts-promo-banner {
		padding-block: 12px;
		padding-left: 8px;
		padding-right: calc(var(--ts-promo-banner-h)*.79);
		flex-wrap: nowrap;
	}

	.ts-promo-banner:hover .ts-promo-banner__cta {
		z-index: 3;
		pointer-events: all;
		background: var(--ts-input-btn-bg-accent);
		color: var(--ts-input-btn-bg-accent-color);
		opacity: 1;
	}

	.ts-promo-banner .ts-promo-banner__cta:hover {
		--ts-input-btn-bg-accent: var(--ts-on-accent);
		--ts-input-btn-bg-accent-color: var(--ts-accent);
	}

	.ts-promo-banner__close {
		right: 8px;
	}

	.ts-promo-banner:hover::before {
		background: var(--ts-on-surface-muted);
		z-index: 2;
		opacity: 1;
	}

	.ts-promo-banner__text strong:has(.ts-icon) {
		font-size: 0;
		gap: 0;
		float: left;
		line-height: 0;
		display: inline-flex;
		height: 100%;
		width: calc(var(--ts-promo-banner-h)*.75);
		flex-direction: row;
		flex-wrap: nowrap;
		justify-content: flex-start;
		align-items: center;
	}

	.ts-promo-banner__text strong:has(.ts-icon) .ts-icon {
		font-size: var(--ts-fs-xl);
		display: grid;
		place-content: center;
		width: 100%;
		height: calc(var(--ts-promo-banner-h)*.75);
		justify-content: center;
	}

	.ts-promo-banner__text {
		line-height: 1.1;
	}
}

@media only screen and (max-width: 480px) {
	.ts-promo-banner__text {
		letter-spacing: 0;
		line-height: 1.1;
		height: 100%;
		font-size: var(--ts-fs-xs);
		overflow: hidden !important;
		text-overflow: ellipsis;
		display: -webkit-inline-box !important;
		line-clamp: 2;
		-webkit-line-clamp: 2 !important;
		-webkit-box-orient: vertical;
		padding: 0 !important;
		max-width: unset;
	}

	.ts-promo-banner__text strong:has(.ts-icon) .ts-icon {
		font-size: var(--ts-fs-xl);
		display: grid;
		place-content: center;
		width: 100%;
		height: calc(var(--ts-promo-banner-h)*.75);
		justify-content: center;
	}

	.ts-promo-banner__text strong:has(.ts-icon) {
		font-size: 0;
		gap: 0;
		float: left;
		line-height: 0;
		display: inline-flex;
		height: 100%;
		width: calc(var(--ts-promo-banner-h)*.75);
		flex-direction: row;
		flex-wrap: nowrap;
		justify-content: flex-start;
		align-items: center;
	}
}
```

### Promo banner — reference HTML

```html
<!-- ═══ PROMO BANNER — Dismissable top notification ═══════════════ -->
<div class="ts-promo-banner ba-grid" id="promo-banner" style="--ts-grid-size: 15px; --ts-grid-line-opacity: 0.85;">
  <span class="ts-promo-banner__text">
    <strong><span class="ts-icon" data-ts-icon="fa-solid fa-wand-magic-sparkles"></span>
      New:</strong>
    Explore our interactive Toolpanel Mockups — live demos of real userscript automation panels.
  </span>
  <a href="mockup/index.html" class="ts-promo-banner__cta">
    <span class="ts-icon" data-ts-icon="fa-solid fa-arrow-right"></span> View Mockups
  </a>
  <button class="ts-promo-banner__close" onclick="this.parentElement.classList.add('ts-dismissed')" aria-label="Dismiss" data-ts-icon="fa-solid fa-xmark">
  </button>
</div>
```

### Showcase-specific mobile overrides (reference — these are demo-page hacks, not canonical)

```css
@media (max-width: 768px) {
	.ts-topbar-static {
		overflow-x: auto;
		overflow-y: hidden;
	}
	.ts-topbar-static .ts-nav {
		flex-shrink: 0;
	}
	.ts-hero .ts-container {
		padding-top: var(--ts-sp-8);
		padding-bottom: var(--ts-sp-8);
	}
}

@media (max-width: 480px) {
	.ts-topbar-static .ts-topbar__logo span {
		display: none;
	}
}
```

Rebuild the banner so:
- Dismissable top bar, fixed, height = `--ts-promo-banner-h`
- When present (not dismissed): nav top = banner height, first section padding
  compensates for banner + nav combined
- Replace the mobile hacks with intrinsic layout (flex/grid, clamp, min/max) — no
  forced no-wrap, no sidebar-state coupling
- Tokenize: button placement (inline/stacked/overlay), text-wrap thresholds,
  container constraints
- Deterministic across breakpoints, no special-case media queries

---

## TASK 5 — PREPARE THE INTEGRATION HANDOFF

Package everything as a clean prototype the engineer agent team can integrate
into the rebuild without guessing: the hardened CSS, the pattern report, the dev
notes for the JS, the on-surface consolidation, the variants, the semantic DOM
decision, the breakpoint sync, the sub-nav/dropdown host, and the promo banner.
The handoff must enable continued design at THIS quality level executed by the
agent, not by me.

---

# EXECUTION SEQUENCE

```
1   Study + pattern report (include all 6 new changes + list nested structures)
2   Skill update + commitment
3   Harden CSS + nested cleanup + one-line attribute-driven invocation
6   Variant system (.tabbed + .spaced preserved + more) + button scaling token
7   Semantic ul>li>a DOM (recommend Approach A or B, implement/dev-notes)
8   Transparent mode separated from at-top + offset compensation (clean rebuild)
9   Breakpoint token sync — USABILITY BLOCKER, make --ts-nav-collapse-at real
10  Sub-navs + dropdown sized as mega-menu host + one anchor-with-child example
4   On-surface inversion consolidation (the keystone — collapses the select cartel)
11  Promo banner, coupled with header offsets (clean token-driven rebuild)
5   Integration handoff
```

**Rules for the whole run:**
- Halt after each task. Confirm visually. Show the diff before finalizing.
- Tasks 7 (semantic DOM) and 9 (breakpoint sync) most affect whether this is
  actually usable by other people — give them real attention, not quick patches.
- Zero `!important` in final output (the reference code has them — the rebuild
  removes them).
- Zero hardcoded hex. Use oklab for color-mix except the owner's srgb border
  system.
- My design decisions always win. If a note is ambiguous, ask before guessing.

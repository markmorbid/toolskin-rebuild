# Rebuild Governance Spec — S6 (Repo Governance + Refusal Patterns Author)

**Wave:** 2.3 (parallel — dispatched alongside S3, S4, S5 after S1+S2 lock)
**Owner:** Satoshi / SatSea
**Date:** 2026-05-19
**Status:** SPEC — feeds Phase E `toolskin-architecture` skill (refusal-pattern catalog) + Gate 5 owner approval (pre-commit hook installation + CONTRIBUTING.md commit)
**Inputs honored:** files 01 (15 rules), 06 (Rule 15 apcach), 07 (repo isolation), 05 (tier hierarchy), a1-council-resolution.md (LOCKED Q1-Q4), `_session-1-rebuild-queue.md` (Gate 4 + Gate 4.5 locks), T1 (§3.3 + §5.5), T2 (§3.3 + §5.5 + §8.5), T3 (§8 — eight anti-patterns), `_wave-1-synthesis.md` (Appendix A1-Council R1+R2 + Appendix A1-Resolution), S1 §14.5, S2 §17.4 + §13.4 + §8.4 + §14.3 + §15.5.
**Restrictions:** **Spec only.** This markdown is the only artifact. NO pre-commit hook installed. NO CONTRIBUTING.md committed. NO `tools/build/*.js` written. Owner approves at Gate 5 before any installation step.

---

## 0. Executive summary

S6 produces THREE deliverables, fully specified inline in this file:

1. **Refusal pattern catalog** — 23 named refusal patterns spanning repo isolation (4), scope (3), architecture (6), Rule 15 color (4), consumer anti-patterns (7), pattern violations (5+1 Wave-1.5-forward). Each has exact refusal language with `<file>:<line>` reference format for citation.
2. **Pre-commit hook bash wrapper** — full script text for `.git/hooks/pre-commit` plus the eleven governance-check specifications it delegates to S4's Node parser module (`tools/build/precommit-validate.js`). Performance budget <10s.
3. **CONTRIBUTING.md content** — full markdown text for the repo-root contributor doc. 14+1 rules verbatim, repo isolation rules verbatim, tier hierarchy verbatim, workflow per block, tier gates, refusal-pattern reference, council usage (with procedural correction + upgraded voices), owner approval workflow, commit message format, editor config, `--no-verify` bypass policy.

All three are interlocked: refusal patterns are owner-facing language; the hook is the machine enforcer for a subset of those patterns at commit-time; CONTRIBUTING.md is the human-readable contract every contributor reads before their first commit. The Phase E `toolskin-architecture` skill encodes refusal-pattern catalog verbatim in `references/refusal-pattern-catalog.md` and the 15 rules verbatim in `references/conversation-rules-verbatim.md`.

---

## 1. Scope of S6 vs S4

Per A1 council resolution §S4-collaboration (Gate 4.5 lock), S6 and S4 share a dependency parser module but own different layers.

| Layer | Owner | Artifact |
|---|---|---|
| Bash wrapper at `.git/hooks/pre-commit` (entry point) | **S6** | This spec §3.1 |
| Governance-check spec list (what must be checked from a governance POV) | **S6** | This spec §3.2 |
| CONTRIBUTING.md (the contributor contract) | **S6** | This spec §4 |
| Refusal-pattern catalog (skill-encoded refusal language) | **S6** | This spec §2 |
| Node parser module at `tools/build/precommit-validate.js` (implementation) | **S4** | S4 spec (separate file) |
| `parseDeps()`, `topoSort()`, `diffSandboxVsBundlerOrder()`, `validate()` exports | **S4** | S4 spec |
| The bundler at `tools/build/bundle-css.js` | **S4** | S4 spec |
| `dist/*` build artifacts | **S4** | S4 spec |

**Shared module contract** (S6 calls S4's exports — S4 publishes the JSDoc-typed surface):
- `parseDeps(filePath) → string[]` — reads `@ts-deps:` header from a CSS file, returns array of block names.
- `topoSort(blockGraph) → string[]` — returns blocks in dependency order; throws on cycle.
- `diffSandboxVsBundlerOrder(sandboxLinks, bundlerOrder) → diff | null` — null if equal; diff payload otherwise.
- `validate({ files, commitMsg, repoRoot, opts }) → { errors: string[], warnings: string[] }` — orchestrates all 11 checks; called by the bash wrapper; non-zero `errors.length` = fail commit.

**Why split this way:** S6 owns the *governance contract* (what's forbidden + how it's communicated to humans). S4 owns the *implementation* (Node code that performs the checks against actual files). The bash wrapper is thin — it normalizes paths, invokes S4's module, prints owner-readable diagnostics, and exits non-zero on errors. This isolates the policy from the parser so policy edits don't require parser rewrites and vice versa.

---

## 2. Refusal pattern catalog

Each pattern has: (a) an ID (R-CATEGORY-N), (b) the trigger (what forbidden request the agent receives), (c) the source rule citation, (d) the exact refusal response with file:line reference template for the agent to fill in.

The Phase E `toolskin-architecture` skill encodes this entire section verbatim in `references/refusal-pattern-catalog.md`. The SKILL.md "REFUSAL PATTERNS" section summarizes IDs and links to this catalog for full language.

### 2.1 Repo isolation violations (file 07 binding)

#### R-ISO-1 — Modify any file in `../toolskin-showcase/`

**Trigger:** Agent is asked to edit, create, delete, or rename any file under `../toolskin-showcase/**`. Includes CSS, JS, HTML, docs, `_bu/` backups, generator artifacts, anything.

**Source:** file 07 §"PHYSICAL ISOLATION RULES" rule 3 + Rule 6 + Rule 12.

**Response:**
> "The reference repo at `../toolskin-showcase/` is permanently read-only per Rule 12 (NEW REPO ONLY) and file 07 isolation rules. The proposed write at `<path>:<line>` is rejected. If reference content needs to change, that's a manual owner decision outside this rebuild workflow — surfaced, not executed. If the proposal is to extract reference content INTO this repo (rebuild repo), it must land at `toolskin-rebuild/docs/handoffs/`, `toolskin-rebuild/sandbox/<tier>/<block>/`, or another allowed path per R-SCO-1 — never written back to the reference."

#### R-ISO-2 — `cd` into the reference repo

**Trigger:** Agent runs `cd ../toolskin-showcase`, `cd "D:\Mis Documentos\Projects\Toolskin Framework\toolskin-showcase"`, or any cwd change that lands inside the reference.

**Source:** file 07 §"PHYSICAL ISOLATION RULES" rule 1.

**Response:**
> "The working directory stays inside `toolskin-rebuild/`. Sub-agents read from the reference exclusively via relative paths (`../toolskin-showcase/<path>`) — never by changing directory. The proposed `cd` is rejected. Use `Read`, `Grep`, or `Glob` with the relative path instead. If a tool requires an absolute reference path, supply it without `cd`."

#### R-ISO-3 — Run `git` command against the reference repo

**Trigger:** Agent runs `git -C ../toolskin-showcase <anything>`, `git log` inside `../toolskin-showcase/`, `git status` against the reference, `git fetch`, `git push`, `git rebase`, `git diff` cross-repo, or any git operation that targets the reference's git directory.

**Source:** file 07 §"PHYSICAL ISOLATION RULES" rule 4 + rule 2.

**Response:**
> "The reference repo's git state is invisible to the rebuild per file 07 isolation rule 4. The proposed `git <command>` against `../toolskin-showcase/` is rejected. Historical context comes from `../toolskin-showcase/docs/handoffs/_session-state-2026-05-17.md`, `../toolskin-showcase/_bu/` inventories, and `../toolskin-showcase/docs/PRE-REFACTORING-PLAN-15-04-2025/` — all read via relative paths without git. If the question is 'what changed in the reference recently?', read the session-state doc; do not query its git log."

#### R-ISO-4 — Create symlinks/junctions between repos

**Trigger:** Agent runs `mklink`, `New-Item -ItemType SymbolicLink`, `ln -s`, `mklink /J`, or any path-aliasing operation that makes the two repos appear as one filesystem path.

**Source:** file 07 §"PHYSICAL ISOLATION RULES" rule 5.

**Response:**
> "Symlinks, junctions, and bind mounts between the two repos are forbidden per file 07 isolation rule 5. The two folders are siblings, period. The proposed `<command>` is rejected. Cross-repo reads use the relative path `../toolskin-showcase/<file>` as-is — no aliasing required."

### 2.2 Scope violations

#### R-SCO-1 — Write outside allowed paths

**Trigger:** Agent creates or edits a file outside the allow-list: `assets/css/next/**`, `assets/js/next/**`, `sandbox/**`, `docs/**`, `tools/**` (NOT `tools/build/**` this session — S4 owns that), `.claude/**`, repo-root metadata (`README.md`, `CLAUDE.md`, `CONTRIBUTING.md`, `.gitignore`, `.gitattributes`, `package.json` at repo root).

**Source:** file 01 §GLOBAL RULES rule 6 (no scope expansion) + the Wave-1.5 forward provision for `dist/` once S4's bundler lands (post-Gate-5).

**Response:**
> "Writes are restricted to allowed paths per file 01 GLOBAL RULES. The proposed `<path>` is outside `assets/css/next/`, `assets/js/next/`, `sandbox/`, `docs/`, `tools/`, `.claude/`, or repo-root metadata. Rejected. If the file genuinely belongs in this repo, propose an allowed-path location with owner surface. `dist/` writes are allowed only after S4's bundler lands and owner approves at Gate 5."

#### R-SCO-2 — Modify `.claude/skills/<external>/`

**Trigger:** Agent edits files inside any externally-managed skill folder under `.claude/skills/` — e.g., `designer-skills/`, `everything-claude-code/`, `skill-creator/`, `superpowers/`, `ECC/*`, anything not in the in-house Tier 1 list (`design-tokens-2.0/`, `expert-designer/`, `typography-master/`, the future `toolskin-architecture/`).

**Source:** file 05 §SKILL PRIORITY HIERARCHY (Tier 2+ skills are external; only Tier 1 in-house skills are editable in this repo).

**Response:**
> "External skills under `.claude/skills/<external>/` are managed by their upstream maintainers (julianoczkowski, affaan-m, anthropics, etc.). Editing them creates drift that the next `npx skills check` or plugin update will overwrite. The proposed edit at `<path>:<line>` is rejected. If the external skill conflicts with Toolskin conventions, the resolution is documented in `.claude/skills/toolskin-architecture/SKILL.md` filter list or refusal patterns — never by editing the external skill."

#### R-SCO-3 — Modify in-house Tier 1 skills outside Phase E update pass

**Trigger:** Agent edits `.claude/skills/design-tokens-2.0/`, `.claude/skills/expert-designer/`, `.claude/skills/typography-master/` BEFORE the Phase E orchestrator-scheduled "update pass" (per `_in-house-skills-update-todo.md`).

**Source:** `docs/handoffs/_in-house-skills-update-todo.md` (deferred update pass) + file 05 §B.9.4 ("DO NOT execute the update pass in this session").

**Response:**
> "In-house Tier 1 skills (`design-tokens-2.0`, `expert-designer`, `typography-master`) are migrated as-is this session. The update pass that absorbs cascade-sensitivity, @taxonomy_chips_strip, surface superposition, and Rule 15 is a Session 1.5 / Session 2 startup task per `_in-house-skills-update-todo.md`. The proposed edit at `<path>:<line>` is rejected this session. After Phase E lands and the `toolskin-architecture` skill becomes the canonical feeder, schedule the update pass with owner approval."

### 2.3 Architecture violations

#### R-ARCH-1 — Skip owner gates

**Trigger:** Agent attempts to proceed past Gate 1, 2, 3, 4, 4.5, 5, 6, or 7 without explicit owner "proceed" message. Or attempts to elide a gate by reframing it as "implicit approval from prior gate."

**Source:** file 01 §GLOBAL RULES rule 7 ("At each owner gate: STOP, surface findings, wait for explicit 'proceed'") + rule 9 ("Sub-agents PROPOSE. Orchestrator WEIGHS. Owner DECIDES.").

**Response:**
> "Owner gates require explicit 'proceed' before continuation per file 01 GLOBAL RULES 7 + 9. Gate <N> has not been confirmed. The proposed action is rejected. Surface findings, halt, await owner decision. If the gate appears already passed, link to the message where owner said 'proceed' or 'approved'; absence of objection is NOT approval (Rule 11 — halt on anomaly, never improvise)."

#### R-ARCH-2 — Make architectural decisions outside locked Wave 1 typology

**Trigger:** Agent proposes a new block type, tier reassignment, surface tier, derivative-chain extension, or other architecture-level change that isn't already locked in `_rebuild-block-typology.md` (T1), `_rebuild-base-context-spec.md` (T2), or `_rebuild-adaptive-integration-spec.md` (T3) — without surfacing for owner approval first.

**Source:** Gate 4 LOCKS in `_session-1-rebuild-queue.md` + file 01 §GLOBAL RULES rule 9.

**Response:**
> "Architectural shape is locked at Gate 4 per `_session-1-rebuild-queue.md` (D1, D5, D6, D7) and the three Wave 1 specs. The proposed shape change at `<location>` is outside that lock. Surface the proposal to owner with: (a) which lock it would amend, (b) the rationale, (c) the impact on Wave 2 sub-agent outputs. Do not implement before owner re-locks at a follow-up gate."

#### R-ARCH-3 — Introduce Node.js runtime deps into shipped product

**Trigger:** Agent adds a dependency to `package.json` at repo root, or any `package.json` outside `tools/color-engine/` and `tools/build/`, or imports a Node-runtime module into `assets/js/next/**/*.js`, or proposes a runtime `require()`/`import` of a npm package in shipped JS.

**Source:** Rule 13 verbatim ("NO NODE.JS RUNTIME DEPS IN SHIPPED PRODUCT").

**Response:**
> "Rule 13 forbids Node.js runtime dependencies in the shipped product. The shipped artifact is pure CSS + minimal JS, drop-in for any browser context. Apcach lives at `tools/color-engine/` as BUILD-TIME tooling — never bundled into `assets/js/next/`. The proposed dep `<package>` at `<file>:<line>` is rejected. If the functionality is genuinely needed in shipped JS, reimplement it natively (browser-native APIs only) or surface to owner for a Rule 13 exception with full bundle-size impact analysis."

#### R-ARCH-4 — Introduce frameworks into shipped CSS/JS

**Trigger:** Agent adds React, Vue, Svelte, Alpine, Stimulus, Tailwind, Bootstrap, or any framework as a dependency of `assets/css/next/**` or `assets/js/next/**`. Also: agent proposes to rewrite a component as a `<Button>` React component, a `.vue` SFC, or a Tailwind utility composition.

**Source:** Rule 1 ("Zero framework dependencies. One stylesheet. Full dynamic control.") + Rule 2 (token-driven, NOT class-driven like Tailwind).

**Response:**
> "Rule 1 forbids framework dependencies in shipped Toolskin. The proposed `<framework>` integration at `<location>` is rejected. Toolskin's value proposition is drop-in compatibility with ANY framework as a consumer (Rule 5) — but the shipped product itself is framework-agnostic. If the goal is consumer-side integration in React/Vue/Tailwind apps, see T3 §5–§7 (Adaptive Integration Architect spec) which documents the consumer-side wrapper patterns. Wrappers live in consumer codebases, never in `assets/`."

#### R-ARCH-5 — Auto-format CSS

**Trigger:** Agent runs prettier, stylelint --fix, csscomb, beautify, or any auto-formatter against files in `assets/css/next/**`. Also: agent modifies `.vscode/settings.json` to enable `editor.formatOnSave` for CSS, or any editor config that triggers auto-format.

**Source:** file 01 §GLOBAL RULES rule 4 ("NEVER auto-format any CSS") + Gate 2 editor format-on-save toggles confirmation.

**Response:**
> "Auto-format on CSS is forbidden per file 01 GLOBAL RULES 4 and Gate 2 editor toggles. Cascade order, spacing, and selector grouping in `assets/css/next/**` carry intentional semantic meaning per Rule 8 (cascade-sensitivity discovery) and T1 §5.5 distribution-layer pattern. The proposed `<tool>` run is rejected. If formatting truly needs to change, the change is hand-edited with diff review at PR time, never via auto-formatter. Confirm `.vscode/settings.json`, Cursor settings, and DevTools live-edit are all set to DISABLED for CSS formatting."

#### R-ARCH-6 — Compose two block CSS at consumer-runtime via JS

**Trigger:** Agent proposes a runtime JS function that fetches multiple block CSS files via `fetch()` and injects them, OR a runtime `import('./block-A.css')` + `import('./block-B.css')` in shipped JS, OR any consumer-runtime dynamic CSS composition.

**Source:** Rule 13 (no runtime deps) + A1-Council R1 (compositional loading is build-time only, via S4's bundler).

**Response:**
> "Block CSS composition is build-time only per A1-Council R1 + Rule 13. The proposed runtime composition at `<location>` is rejected. Consumers receive `dist/toolskin.css` (single concatenated file, Q2/Q4 lock) OR they opt into per-block files `dist/blocks/<block>.css` via standard `<link>` tags in their HTML. JS-driven runtime composition introduces FOUC, cascade-order races, and bundle-size unpredictability — all of which Rule 5 (drop-in for anyone) forbids."

### 2.4 Color rule violations (Rule 15 binding)

#### R-COL-1 — Declare raw color values in component CSS

**Trigger:** Agent writes `#xxx`, `rgb(...)`, `rgba(...)`, `hsl(...)`, `hsla(...)`, `oklch(...)` literal (with numeric args, not `var(--ts-...)` reference), or any named color (`red`, `cornflowerblue`, etc.) inside `assets/css/next/components/**/*.css` or `assets/css/next/utilities/**/*.css`.

**Source:** Rule 15 + T1 §3.3 refusal pattern + S1 §14.5 + S2 §17.4.

**Response:**
> "Toolskin v2 forbids raw color values in component CSS per Rule 15. The proposed `<color-literal>` at `<file>:<line>` must route through `--ts-this-color-*` or `--ts-this-bg-*` derivative tokens (S2 system layer) which trace to apcach-derived primitives (S1). If a derivative is missing for the use case, report the gap to S1/S2 for primitive/system extension via `docs/handoffs/_rebuild-system-spec-followup.md` (or similar) — not patched with a literal at the component layer."

#### R-COL-2 — Invoke ECC `design-system` Mode 1 (Generate) for Toolskin

**Trigger:** Agent invokes the ECC design-system skill in "Generate" mode and applies output to Toolskin code (CSS tokens, palette, type scale).

**Source:** file 05 §"ECC design-system — conflict audit verdict" ("Mode 1 (Generate): OFF-LIMITS for Toolskin").

**Response:**
> "ECC `design-system` Mode 1 (Generate) is OFF-LIMITS for Toolskin per file 05 absorption strategy. Mode 1 would propose competing token values against the in-house apcach-derived system, violating Rule 15. The proposed Mode 1 invocation is rejected. Use Mode 2 (Audit, advisory only) or Mode 3 (Slop detection, with the documented filter list for intentional gradients, OKLCH colors, Space Grotesk, harmonic ladder, substring-distribution selectors). Mode 2/3 outputs are INFORMATIONAL — never authoritative on Toolskin matters."

#### R-COL-3 — Override apcach output with ad-hoc picks

**Trigger:** Agent edits `assets/css/next/primitives/colors.css` directly (by hand, without re-running `tools/color-engine/generate-colors.js`), OR introduces a "tweaked" OKLCH value that wasn't produced by apcach for a stated contrast target.

**Source:** Rule 15 §"BINDING ON ALL CODE" + S1 §14.5.

**Response:**
> "Apcach output is the canonical primitive substrate per Rule 15. Hand-edits to `assets/css/next/primitives/colors.css` create drift between the build-script truth and committed values. The proposed edit at `colors.css:<line>` is rejected. If the contrast target, chroma, hue, or search direction needs to change, edit `tools/color-engine/generate-colors.js` (the build script), re-run it, commit BOTH the script change AND the regenerated `colors.css`. The pre-commit hook diffs script output against staged file and fails on mismatch (R-PAT-4 + Check 8)."

#### R-COL-4 — Propose multi-input palette to runtime API

**Trigger:** Agent extends `Toolskin.setAccent()` or proposes `Toolskin.setPalette({primary, secondary, tertiary, …})` accepting multiple colors at runtime.

**Source:** Rule 5 + Rule 15 + T3 §8.1 anti-pattern.

**Response:**
> "Toolskin v2 accepts ONE accent hue at runtime. Multi-color palette input violates Rule 15 (apcach derives the full system from one hue) and Rule 5 (drop-in single-input contract). The proposed multi-input API at `<location>` is rejected. Either: (a) accept the apcach-derived palette and let the consumer pick the SINGLE hue; (b) fork the build-time color engine for a custom multi-input setup (advanced, unsupported, not in v2 scope). Document any white-label multi-hue case as a v3 roadmap item — not a v2 API change."

### 2.5 Consumer anti-patterns (T3 §8 — documented warnings)

These are NOT hook-enforced (consumers run their own CSS pipeline, beyond this hook's reach). They live in CONTRIBUTING.md and consumer integration docs as **refusal patterns the docs use to redirect misuses**. The toolskin-architecture skill encodes the refusal language so any agent reviewing consumer integration code can cite them.

#### R-USR-1 — Consumer providing full palette

**Trigger:** Consumer (or agent acting on consumer's behalf) supplies a multi-color palette (object with `primary`, `accent2`, `surface`, `text`, etc.) to Toolskin's API.

**Source:** T3 §8.1.

**Response:**
> "Toolskin v2 accepts one accent hue. A multi-color palette input violates Rule 15. Either accept the apcach-derived palette OR fork the build-time color engine for a custom multi-input setup (advanced, unsupported)."

#### R-USR-2 — Tailwind utilities overriding `.ts-*` color tokens

**Trigger:** Consumer applies `bg-red-500`, `text-white`, or any Tailwind color utility to an element that also has `.ts-btn`, `.ts-card`, or any `.ts-*` class.

**Source:** T3 §8.2.

**Response:**
> "Mixing Tailwind color utilities with `.ts-*` classes overrides Toolskin's apcach-derived colors via the cascade and defeats Rule 15's contrast guarantee. Use Tailwind for layout (`flex`, `grid`, `p-4`, breakpoint visibility) — but let Toolskin own all color, surface, and state derivation on `.ts-*` elements. If you need a custom color on a Toolskin component, set the corresponding `--ts-*` token at a higher scope (e.g., `:root { --ts-btn-bg: var(--ts-this-accent); }`), not a utility override on the element."

#### R-USR-3 — Self-hosting older Toolskin alongside v2

**Trigger:** Consumer loads `toolskin-v1.css` + `toolskin-v2.css` simultaneously, or self-hosts an older fork while installing v2.

**Source:** T3 §8.3.

**Response:**
> "Two stylesheets, two JS files, two competing `:root` token declarations → cascade conflict where the later-loaded wins by source order. If migrating from v1 (the reference repo at `../toolskin-showcase/`), remove v1 assets entirely before adding v2. Toolskin's v2 sandbox HTML loading more than one `toolskin*.css` is flagged by the pre-commit hook (R-PAT-5 sibling check) at sandbox-author commit time."

#### R-USR-4 — Importing Toolskin as a JSX/Vue component library

**Trigger:** Consumer does `import { Button } from 'toolskin'` expecting React/Vue components.

**Source:** T3 §8.5.

**Response:**
> "Toolskin is CSS + JS for the browser. It does not ship `<Button>` React or `.vue` components. Wrap `.ts-btn` yourself in your framework: `export const Button = ({children, ...p}) => <button className=\"ts-btn\" {...p}>{children}</button>;`. A Toolskin-React wrapper package is a v3 roadmap candidate, not a v2 deliverable."

#### R-USR-5 — Sass/PostCSS preprocessor build

**Trigger:** Consumer requests `@use 'toolskin'` as Sass partials, or asks for PostCSS plugin distribution.

**Source:** T3 §8.6 + Rule 13.

**Response:**
> "The shipped product is plain CSS per Rule 13. Toolskin does not ship as Sass partials or PostCSS plugins. Consumers using Sass can `@use \"path/to/toolskin.css\"` as plain CSS — but Toolskin's source is not exposed as `.scss` files. If Sass-source distribution is a hard requirement, fork the repo and add Sass scaffolding in your fork; that's out of v2 maintained scope."

#### R-USR-6 — Web Components / Shadow DOM (out of v2 scope)

**Trigger:** Consumer embeds `.ts-*` markup inside a `attachShadow({mode:'open'})` root and reports tokens don't apply.

**Source:** T3 §8.7.

**Response:**
> "Tokens defined on `:root` don't pierce Shadow DOM by default. Consumers using web components must explicitly forward `--ts-*` properties at their shadow root, which is advanced setup. v2 documents this as 'out of scope, contact for v3 roadmap.' If you need this now, manually copy the relevant `--ts-this-*` derivatives onto your custom element's `:host` block."

#### R-USR-7 — Non-browser context (Node/Deno)

**Trigger:** Consumer attempts to `require('toolskin')` or `import 'toolskin'` in Node/Deno/Bun for SSR.

**Source:** T3 §8.8.

**Response:**
> "Toolskin v2 references `window`, `document`, `localStorage`. No SSR-safe build exists. The JS layer assumes browser globals. Consumers can ship `dist/toolskin.css` server-side as a static asset (CSS works fine in SSR contexts via HTML), but `toolskin.js` is browser-only. If SSR-safe JS is a hard requirement, file a v3 roadmap request."

### 2.6 Pattern violations (T1 + S2 + Wave 1.5 forward)

#### R-PAT-1 — Substring distribution outside `:root` + token-only declaration

**Trigger:** Agent writes a CSS rule using `[class*="ts-..."]` selector that is (a) not scoped to `:root` (or similarly-scoped origin), OR (b) declares non-token properties (anything beyond `--ts-*` custom properties), OR (c) lacks the required `/* DISTRIBUTION LAYER — Rule 8 — ... */` comment block.

**Source:** Rule 8 + T1 §5.5 auditor pseudocode + cascade-sensitivity incident 2026-05-17.

**Response:**
> "Substring-distribution selectors (`[class*=\"ts-...\"]`) are the distribution-layer pattern per Rule 8. The proposed rule at `<file>:<line>` fails one or more requirements: (a) must be scoped to `:root` or a similarly-scoped origin (forbids floating `[class*=\"...\"]`); (b) rule body must declare ONLY `--ts-*` custom properties (no `color:`, `background:`, `padding:`, etc.); (c) preceding comment must contain 'DISTRIBUTION LAYER' and reference Rule 8. If the use case is state (`:hover`, `:focus`) or layout, rewrite with explicit `:is(.ts-a, .ts-b, …)` enumeration per T1 §5.2. The hook flags this as a warning (Check 10) since substring is sometimes appropriate per T1 §5.3."

#### R-PAT-2 — Component layer declares own `color-mix()` for state derivation

**Trigger:** Agent writes `color-mix(in oklch, var(--ts-accent), ...)` or `color-mix(in oklch, var(--ts-this-bg), ...)` for `:hover`, `:active`, `:focus`, `:disabled`, or any state derivation inside `assets/css/next/components/**/*.css`.

**Source:** S2 §8.4 + S2 §17.4.

**Response:**
> "State-variant color composition lives at the SYSTEM layer (S2 §8 + §7.1 5-state pattern). The component layer consumes `--ts-accent-hover`, `--ts-accent-active`, `--ts-accent-focus`, `--ts-accent-disabled` (and `--ts-this-bg-hover` etc.) — it never declares its own `color-mix()` for state. The proposed expression at `<file>:<line>` is rejected. If a new state knob is needed (e.g., punchier hover), adjust `--ts-mix-perc-hover` at the system layer in `assets/css/next/system/states.css` or propose a new mix-perc knob there — never inline at the component."

#### R-PAT-3 — New `!important` in `assets/css/next/**/*.css`

**Trigger:** Agent stages a change that adds `!important` anywhere in `assets/css/next/**/*.css`.

**Source:** Rule 1 (one stylesheet, full dynamic control — `!important` defeats the cascade) + S2 §13.3 + S2 §13.4 + restyling-architecture §2 (two-layer pattern eliminates `!important`).

**Response:**
> "`!important` is forbidden in `assets/css/next/**/*.css`. The two-layer pattern (S2 §2) eliminates the need: Layer 1 declares low-specificity rules, Layer 2 contextual overrides are token swaps, not property redeclarations. The pre-commit hook (Check 4) blocks this. The proposed `!important` at `<file>:<line>` is rejected. If a specificity battle is genuinely intractable, surface to owner — there's usually a Layer-1/Layer-2 refactor that resolves it without `!important`."

#### R-PAT-4 — Hand-edit `assets/css/next/primitives/colors.css`

**Trigger:** Agent stages a change to `assets/css/next/primitives/colors.css` without a corresponding change to `tools/color-engine/generate-colors.js` AND a run of that script.

**Source:** Rule 15 §"BINDING ON ALL CODE" + S1 §14.5.

**Response:**
> "`assets/css/next/primitives/colors.css` is generated by `tools/color-engine/generate-colors.js` (apcach build script). Hand-edits create drift between the script-truth and committed values. The proposed direct edit at `colors.css:<line>` is rejected. Workflow: edit the script (`generate-colors.js`), re-run it (`node tools/color-engine/generate-colors.js`), stage BOTH the script change AND the regenerated `colors.css`. The pre-commit hook (Check 8) diffs the script's output against the staged file and fails on mismatch."

#### R-PAT-5 — Missing `@ts-deps:` header

**Trigger:** Agent commits a new or modified file in `assets/css/next/components/**/*.css` without a `/* @ts-deps: <deps> */` header as the first non-empty line.

**Source:** A1-Council Q1 (KEEP `@ts-deps` headers) + Appendix A1-Resolution Q1.

**Response:**
> "Every component CSS file in `assets/css/next/components/**/*.css` MUST declare its dependencies via the `@ts-deps:` comment header per A1-Council Q1 + Appendix A1-Resolution. Format: `/* @ts-deps: primitives/colors, primitives/spacing, system/surface, components/button */` as the first non-empty line. The build script (S4) parses this for topological sort; the pre-commit hook (Check 6) validates presence and resolvability. The proposed file at `<file>` is missing the header. Add the header with the actual dependency list before recommitting."

#### R-PAT-6 — Block violates `_rebuild-design-dna.md` contract (Wave 1.5 forward)

**Trigger:** Agent commits a block CSS or sandbox HTML whose visual output contradicts the design DNA contract (Wave 1.5 deliverable, dispatched AFTER S6).

**Source:** `_rebuild-design-dna.md` (pending — Wave 1.5).

**Status:** Pattern referenced now, content TBD when Wave 1.5 lands. The hook's Check 11 stubs this; CONTRIBUTING.md notes it as "active once Wave 1.5 ships."

**Response (placeholder, to be finalized once Wave 1.5 spec exists):**
> "The proposed block at `<file>:<line>` violates the design DNA contract in `_rebuild-design-dna.md` (Wave 1.5 deliverable). Specifically: `<rule>`. Toolskin's visual identity per the design DNA is non-negotiable. Either adjust the proposal to honor the DNA OR surface to owner with the design rationale for a possible DNA amendment. The Phase E `toolskin-architecture` skill references the DNA in its 'DESIGN DNA' section; the upgraded council voices (Design Skeptic + Design Critic, per Gate 4.5 council upgrade) audit against this contract for visual decisions."

---

## 3. Pre-commit hook bash wrapper

### 3.1 The wrapper script (full text, NOT installed)

Location after Gate 5 owner approval: `.git/hooks/pre-commit` (relative to repo root). Note that `.git/hooks/` is NOT git-tracked — the hook is installed by owner after Gate 5 via a setup script (specified later by S4) or by hand.

```bash
#!/usr/bin/env bash
# Toolskin Rebuild — pre-commit governance hook
# Owner: Satoshi / SatSea
# Source-of-truth spec: docs/handoffs/_rebuild-governance-spec.md (S6, §3)
# Implementation: tools/build/precommit-validate.js (S4)
#
# Bypass policy: --no-verify is allowed ONLY with explicit owner approval.
# See CONTRIBUTING.md "§--no-verify bypass" for the audit-trail requirement.

set -e

# Always operate from repo root, regardless of where git invokes the hook
cd "$(git rev-parse --show-toplevel)"

# Fail fast if the parser module is missing (defense for setups before S4 lands)
if [ ! -f "tools/build/precommit-validate.js" ]; then
  echo "ERROR: tools/build/precommit-validate.js is missing." >&2
  echo "       This hook depends on S4's parser module. Either install S4's" >&2
  echo "       build pipeline or remove .git/hooks/pre-commit until S4 lands." >&2
  exit 1
fi

# Fail fast if node is not available
if ! command -v node >/dev/null 2>&1; then
  echo "ERROR: 'node' is required to run precommit-validate.js." >&2
  echo "       Install Node.js >= 18 or remove .git/hooks/pre-commit." >&2
  exit 1
fi

# Delegate all 11 checks to S4's Node module.
# The module reads `git diff --cached`, the commit message file ($1 when
# invoked as commit-msg hook; for pre-commit we read .git/COMMIT_EDITMSG
# at the time the hook runs — actually empty at pre-commit time, so the
# commit-msg check is performed by a SECOND hook at commit-msg phase OR
# the pre-commit hook reads the message via a small workaround).
#
# Implementation choice (deferred to S4): the simplest path is to install
# TWO hooks — pre-commit (file checks) and commit-msg (tag check) — both
# calling the same Node module with a `--phase` flag. S6 documents the
# split here; S4 implements both.

# Run the file/content checks (pre-commit phase)
node tools/build/precommit-validate.js --phase pre-commit

# Note: the commit-msg-tag check (Check 2 below) runs as a separate hook
# at .git/hooks/commit-msg, invoking the same Node module with
# `--phase commit-msg "$1"`. S4's installer sets both hooks up.
```

**Performance budget:** total wrapper + Node module run < 10 seconds wall-clock on a 1000-file repo. S4's module emits progress lines for any check that exceeds 2 seconds individually.

**Exit codes:**
- `0` — all checks pass; commit proceeds.
- `1` — one or more `errors` from the module; commit blocked.
- `2` — module crashed (programmer error in S4's code) — surfaced as halt-on-anomaly per Rule 11.

### 3.2 The 11 governance checks (S6 spec; S4 implements)

S4's `tools/build/precommit-validate.js` module performs each check. S6 specifies what to check, why, the rule citation, and the failure message format. S4 owns the actual file-reading, regex, and JS implementation.

#### Check 1 — Reference-repo path defense (R-ISO-1)

**What:** For each staged file path, fail if path matches `../toolskin-showcase/**` or any absolute path resolving inside the reference repo.

**Why:** Defense in depth. The two-repo isolation should make this impossible (the rebuild repo's git can't stage files outside its own working tree), but a misconfigured worktree or symlink could subvert this. The hook closes the gap.

**Failure message:**
```
[Check 1 — R-ISO-1] FAIL: staged path '<path>' resolves inside the reference repo (../toolskin-showcase/).
The reference is permanently read-only per file 07 + Rule 12. Unstage with: git restore --staged '<path>'.
```

#### Check 2 — Commit-message rebuild tag (R-ARCH-1)

**What:** Read commit message (via `commit-msg` hook phase, message file at `$1`). Fail if message does NOT match one of:
- `^feat\(rebuild(-atomic|-molecular|-layout|-infra|-primitives|-system)?\):`
- `^fix\(rebuild(-atomic|-molecular|-layout|-infra|-primitives|-system)?\):`
- `^refactor\(rebuild(-atomic|-molecular|-layout|-infra|-primitives|-system|-css|-js)?\):`
- `^docs\(handoffs\):`
- `^docs\(rebuild\):`
- `^chore\(rebuild(-toolchain|-skill|-governance)?\):`
- `^test\(rebuild(-atomic|-molecular|-layout|-infra)?\):`

**Why:** Every commit on the fresh-history main branch carries a rebuild-session tag per file 01 §Phase F commit message format + Rule 14 (fresh git history). Tags enable downstream tooling (changelog generators, per-tier commit counts, S5 PR templating).

**Failure message:**
```
[Check 2 — R-ARCH-1] FAIL: commit message missing rebuild session tag.
First line: '<first-line>'.
Expected pattern: feat(rebuild-<scope>): / fix(rebuild-<scope>): / refactor(rebuild-<scope>): / docs(handoffs): / docs(rebuild): / chore(rebuild-<scope>): / test(rebuild-<scope>):
See CONTRIBUTING.md "Commit message format".
```

#### Check 3 — New file outside allowed paths (R-SCO-1, warn or fail)

**What:** For each NEW (status `A`) staged file, check if its path is inside the allow-list:
- `assets/css/next/**` (after primitives + system land)
- `assets/js/next/**` (after S4 establishes; per D1 lock)
- `sandbox/**`
- `docs/**`
- `tools/**`
- `.claude/**` (excluding `.claude/skills/<external>/**` per R-SCO-2)
- Repo-root metadata: `README.md`, `CLAUDE.md`, `CONTRIBUTING.md`, `.gitignore`, `.gitattributes`, `package.json`, `package-lock.json`, `.editorconfig`, `LICENSE`
- `dist/**` (post-Gate-5, once S4's bundler exists — gated by feature flag in S4 module)

**Severity:** WARN (informational) at Session 1; ESCALATE TO FAIL after Gate 5 closes (owner-configurable in module's config block).

**Why:** Scope violations should surface early. Warn at Session 1 because owner is actively creating new paths (CLAUDE.md, CONTRIBUTING.md, docs/handoffs/*). Fail after Gate 5 once the structural skeleton is locked.

**Failure/warning message:**
```
[Check 3 — R-SCO-1] WARN (Session 1) / FAIL (post-Gate-5): new file '<path>' is outside allowed paths.
Allowed: assets/css/next/, assets/js/next/, sandbox/, docs/, tools/, .claude/ (in-house only), repo-root metadata, dist/.
If this is intentional, document the new path in CONTRIBUTING.md §scope-extensions and re-commit.
```

#### Check 4 — New `!important` in `assets/css/next/**/*.css` (R-PAT-3)

**What:** For each staged file matching `assets/css/next/**/*.css`, parse the unified diff. Fail if any newly-added line (prefix `+`) contains `!important` (case-insensitive, regex `!\s*important\b`).

**Why:** Rule 1 + S2 §13.3 + restyling-architecture §2 two-layer pattern. `!important` is a cascade-defeat anti-pattern; the rebuild eliminates it by construction.

**Failure message:**
```
[Check 4 — R-PAT-3] FAIL: new !important declaration in '<file>:<line>'.
Toolskin v2 forbids !important in assets/css/next/**/*.css per Rule 1 + S2 §13.
Diagnosis: cascade specificity issue. Resolution: refactor to two-layer pattern (S2 §2 — Layer 1 = single-class rule; Layer 2 = token-swap override). If genuinely intractable, surface to owner.
```

#### Check 5 — Raw color literal in components/ (R-COL-1)

**What:** For each staged file matching `assets/css/next/components/**/*.css` or `assets/css/next/utilities/**/*.css`, parse the unified diff. Fail if any newly-added line contains a color literal pattern:
- Hex: `#[0-9a-fA-F]{3,8}\b` (3, 4, 6, or 8 hex digits)
- RGB: `rgba?\(\s*\d` (digit immediately after `rgb(` or `rgba(` opening)
- HSL: `hsla?\(\s*\d`
- OKLCH literal: `oklch\(\s*\d` (numeric arg — `oklch(from var(...) ...)` relative-color syntax is allowed at the system layer but not components; the regex catches numeric-first args)
- Named CSS colors: `\b(red|blue|green|yellow|cornflowerblue|...)\b` — S4 maintains the named-color list (CSS Color Module Level 4 named-color set, excluding `currentColor`, `transparent`, `inherit`, `initial`, `unset`)

**Exclusions:** comments (lines starting with `*` inside `/* */` blocks, or `//`-style if introduced in JS-adjacent contexts). S4 strips comments before regex match.

**Why:** Rule 15 + T1 §3.3 + S1 §14.5. Components consume `--ts-this-color-*` / `--ts-this-bg-*` derivatives; the system layer holds all color composition.

**Failure message:**
```
[Check 5 — R-COL-1] FAIL: raw color literal in component CSS.
File: '<file>:<line>'.
Match: '<literal>'.
Toolskin v2 forbids raw colors in components/ and utilities/ per Rule 15.
Route through --ts-this-color-* or --ts-this-bg-* derivative tokens (S2 system).
If derivative is missing, file gap report at docs/handoffs/_rebuild-system-spec-followup.md.
```

#### Check 6 — Missing `@ts-deps:` header (R-PAT-5)

**What:** For each staged file matching `assets/css/next/components/**/*.css`, read the first non-empty, non-`@charset` line. Fail if it does NOT match the pattern `^\s*/\*\s*@ts-deps:\s*[a-z0-9/_,\-\s]+\s*\*/\s*$`.

Additionally call S4's `parseDeps()` to extract the deps list, then verify each dep resolves to an existing block (S4's `topoSort()` will reject typos).

**Why:** A1-Council Q1 + Appendix A1-Resolution. Headers are machine-parsed for topo-sort + tree-shake.

**Failure message:**
```
[Check 6 — R-PAT-5] FAIL: component CSS missing @ts-deps header.
File: '<file>'.
Expected first non-empty line: /* @ts-deps: primitives/colors, primitives/spacing, system/surface, components/<dep> */
See CONTRIBUTING.md "Workflow per block".
Or, if a dep is typoed:
[Check 6b — R-PAT-5] FAIL: @ts-deps references unknown block '<dep>' in '<file>'.
Valid blocks: <list from S4's parseDeps registry>.
```

#### Check 7 — A1 Q3 full hook (sandbox-vs-bundler order diff)

**What:** Delegated to S4's module entirely. The S4 spec defines what `diffSandboxVsBundlerOrder()` checks; the hook calls it and fails on non-null diff.

The check, summarized from A1-Resolution Q3:
1. Topological sort terminates (no cycles, all deps resolvable).
2. All `@ts-deps` headers reference valid block names (no typos).
3. Sandbox `<link>` order in any block's `index.html` MATCHES the topo-sort order the bundler would produce.
4. If sandbox order disagrees with bundler order → fail commit with explicit diff message.

**Why:** Critic's HIGH-severity failure modes #1 + #2 from A1-Council (cascade divergence between sandbox and production). Closing both at write-time per Appendix A1-Resolution.

**Failure message:** S4 emits — example shape:
```
[Check 7 — A1 Q3] FAIL: sandbox/<tier>/<block>/index.html link order diverges from bundler topo-sort.
Sandbox order: [components/a.css, components/b.css, components/c.css]
Bundler order: [components/a.css, components/c.css, components/b.css]
Resolution: reorder <link> tags in sandbox HTML OR fix @ts-deps headers so the topo-sort matches author intent.
```

#### Check 8 — Direct edit to primitives/colors.css without regenerate (R-PAT-4)

**What:** If `assets/css/next/primitives/colors.css` is in the staged diff but `tools/color-engine/generate-colors.js` is NOT also staged (or is not modified in a way that would change output), fail.

Implementation: S4's module re-runs `generate-colors.js` against the staged version of the script, captures stdout, diffs against the staged `colors.css`. If diff != null, fail.

**Why:** Rule 15 + S1 §14.5. Hand-edits to apcach output create drift.

**Failure message:**
```
[Check 8 — R-PAT-4] FAIL: assets/css/next/primitives/colors.css edited directly without matching generate-colors.js change.
Workflow:
  1. Edit tools/color-engine/generate-colors.js (the apcach build script).
  2. Run: node tools/color-engine/generate-colors.js
  3. Stage BOTH the script change AND the regenerated colors.css.
The hook re-runs the script and diffs against staged colors.css.
Diff detected: <diff snippet>.
```

#### Check 9 — Editor config tampering warning (R-ARCH-5)

**What:** If `.vscode/settings.json`, `.editorconfig`, or `.cursor/settings.json` (whichever the project uses) is in the staged diff, emit a WARN with a manual-review reminder.

**Severity:** WARN (not FAIL) — editor config changes are sometimes legitimate; the warning ensures owner notices.

**Why:** Format-on-save protection per Gate 2 toggles + Rule 4 (auto-format is forbidden). The warn lets owner audit the diff before commit.

**Warning message:**
```
[Check 9 — R-ARCH-5] WARN: editor config file '<file>' modified.
Manually verify: editor.formatOnSave for CSS = false; editor.codeActionsOnSave for CSS = empty.
Auto-format on CSS is forbidden per file 01 GLOBAL RULES 4.
```

#### Check 10 — Cascade-sensitivity audit (R-PAT-1)

**What:** For each staged file matching `assets/css/next/**/*.css`, scan for rules whose selector contains `[class*="ts-..."]` (regex: `\[class\*=\s*"ts-`). For each match, REQUIRE:
- (a) The selector starts with `:root ` (or similarly-scoped origin — S4's module maintains the allowed-origin list).
- (b) The rule body declares ONLY custom-property declarations (`--ts-*: <value>;`). No `color:`, `background:`, etc.
- (c) The preceding comment block (within 5 lines above) contains the string `DISTRIBUTION LAYER` AND a reference to `Rule 8`.

Severity: WARN (not FAIL) — substring distribution is sometimes appropriate per T1 §5.3, and the auditor pseudocode from T1 §5.5 frames this as a documented-pattern check, not an outright ban.

**Why:** Rule 8 + T1 §5.5 auditor pseudocode + cascade-sensitivity incident 2026-05-17.

**Warning message:**
```
[Check 10 — R-PAT-1] WARN: substring-distribution selector at '<file>:<line>'.
Selector: '<selector>'.
Requirements per T1 §5.5:
  (a) scoped to :root or similarly-scoped origin — <pass/fail>
  (b) body declares ONLY --ts-* tokens — <pass/fail>
  (c) preceding comment contains 'DISTRIBUTION LAYER' + Rule 8 reference — <pass/fail>
Substring distribution is sometimes appropriate (recursive component families). If unintentional, rewrite with explicit :is(.ts-a, .ts-b, …) per T1 §5.2.
```

#### Check 11 — Design DNA contract (Wave 1.5 forward — R-PAT-6 stub)

**What:** Stub check. When `docs/handoffs/_rebuild-design-dna.md` exists (Wave 1.5 deliverable), S4's module reads it and runs design-DNA validation rules against staged CSS/HTML. Until that file exists, the check is a no-op (early return in S4's module).

**Why:** Wave 1.5 awareness per `_session-1-rebuild-queue.md` §"WAVE 1.5 — DESIGN DNA EXTRACTION". The pattern is referenced now; content lands when Wave 1.5 ships.

**Message format (TBD — finalized when Wave 1.5 spec lands):**
```
[Check 11 — R-PAT-6] FAIL/WARN: block at '<file>:<line>' violates design DNA contract.
Rule: '<rule from _rebuild-design-dna.md §X>'.
Resolution: <DNA-specific guidance>.
```

### 3.3 Bypass policy (`--no-verify`)

`git commit --no-verify` bypasses the hook entirely. The policy:

1. **Forbidden by default.** Contributors do not use `--no-verify` as a routine workflow.
2. **Allowed only with explicit owner approval**, captured in the commit message footer as:
   ```
   Hook-bypass-approved-by: <owner-name>
   Reason: <short reason>
   ```
3. **Audit trail:** every `--no-verify` commit is logged in `docs/handoffs/_hook-bypass-log.md` (post-Gate-5 file). Entry shape:
   ```markdown
   ## <date> — <commit-sha-short>
   - File(s): <list>
   - Bypass reason: <reason>
   - Approved by: <owner>
   ```
4. The hook itself cannot block `--no-verify` (git's behavior), but Phase E SKILL.md refusal pattern R-ARCH-1 cites this policy. Any agent that uses `--no-verify` without an owner-tagged footer triggers a halt-on-anomaly review.

### 3.4 Performance budget + diagnostics

- Total hook runtime: target < 10s wall-clock on the rebuild repo at end-of-Session-1 size (estimated ~500 files).
- Per-check timeout: 30 seconds individual; hard-kill above that with an "S4 module hang" halt message.
- Progress emission: any check exceeding 2s emits `[Check N] running (<elapsed>s)...` to stderr.
- Verbose mode: `TS_HOOK_VERBOSE=1 git commit ...` makes S4's module print per-file processing. Useful for debugging hook misfires.

### 3.5 Module API expectations (S6 calls S4's exports)

S6 documents what S4's module must export. S4 owns the implementations.

```js
// tools/build/precommit-validate.js — S4 owns implementation

/**
 * Parse @ts-deps header from a CSS file.
 * @param {string} filePath - absolute path to a CSS file
 * @returns {string[]} list of dep block names; empty if no header
 * @throws {Error} if header is malformed
 */
export function parseDeps(filePath) { /* S4 */ }

/**
 * Topologically sort blocks by their @ts-deps graph.
 * @param {Record<string, string[]>} blockGraph - block -> [deps]
 * @returns {string[]} blocks in dep order
 * @throws {Error} on cycle (with cycle path in message)
 */
export function topoSort(blockGraph) { /* S4 */ }

/**
 * Diff sandbox <link> order against bundler topo-sort order.
 * @param {string[]} sandboxLinks - order from sandbox/<tier>/<block>/index.html
 * @param {string[]} bundlerOrder - order from topoSort()
 * @returns {{ sandboxOrder: string[], bundlerOrder: string[] } | null}
 */
export function diffSandboxVsBundlerOrder(sandboxLinks, bundlerOrder) { /* S4 */ }

/**
 * Run all 11 checks against the staged diff.
 * @param {object} opts
 * @param {string[]} opts.stagedFiles - paths from `git diff --cached --name-only`
 * @param {string} opts.commitMsg - commit message (empty for pre-commit phase)
 * @param {string} opts.repoRoot - absolute path to rebuild repo root
 * @param {'pre-commit' | 'commit-msg'} opts.phase - which hook is invoking
 * @returns {{ errors: string[], warnings: string[] }}
 */
export function validate(opts) { /* S4 — orchestrator */ }
```

S6 does NOT specify the implementation. S6 specifies what the module must check and how the failure messages read. S4 makes it run.

---

## 4. CONTRIBUTING.md content (full text, NOT yet committed)

The full markdown text for `CONTRIBUTING.md` at the repo root. Owner approves at Gate 5; orchestrator commits in Phase F per file 01 §Phase F commit.

---

````markdown
# Contributing to Toolskin

> *"This must be something that literally you give to anybody, AI or WordPress, and instantly adapts and merges to any convention because the tokens makes that possible by the solidness and how is built."* — Rule 5

Toolskin v2 is a token-driven, framework-agnostic CSS design system built block-by-block with sandbox-isolated verification. This file is the contributor contract — read it before opening a PR.

## Purpose

This document captures every binding rule, every refusal pattern, every workflow gate that governs work in this repo. It exists so that:

1. New contributors (human or agent) onboard without context loss.
2. Architectural decisions made during Session 1 are durable across sessions, sub-agents, and tool upgrades.
3. The repo doesn't drift back toward the disasters that motivated the rebuild.

If anything in this file conflicts with an external skill, plugin, or AI tool's suggestion, this file wins. The `.claude/skills/toolskin-architecture/SKILL.md` skill encodes the same rules and refuses violations at session-start.

---

## 15 binding rules (verbatim)

These rules are the conversation rules from file 01 + Rule 15 from file 06. They are binding for every session, every sub-agent, every PR. No exceptions.

### Rule 1 — Toolskin philosophy
> *"Zero framework dependencies. One stylesheet. Full dynamic control."*

### Rule 2 — Token-driven + derivative-math-driven, NOT class-driven like Tailwind
> *"Toolskin is token-driven and derivative-math-driven, not class-driven like Tailwind. Every component follows the `ts-marquee` pattern — zero manual structural markup, everything via data attributes with JS building DOM and CSS styling via tokens."*

### Rule 3 — The ts-marquee pattern is canonical for every component
One-liner setup. Data attributes. JS builds DOM. CSS styles via tokens. Zero manual structural markup.

### Rule 4 — Surface superposition awareness is core, not patch-work
> *"This kind of rules must be consciously planned and designed to be automatically applied like on the light or dark theme modes, but to be surface superposition aware too... so we get a solid design system that cannot fail on its core logic."*

### Rule 5 — The product differentiator
> *"This must be something that literally you give to anybody, AI or WordPress, and instantly adapts and merges to any convention because the tokens makes that possible by the solidness and how is built. If we make this properly, the CSS or JS + Sass or CSS will certainly convert any interface at will to any design type easily, with just design patterns and UI application — just knowing where to adapt to."*

### Rule 6 — Old toolskin.css is BLOCK PROTOTYPE — reference only
Visual and functional source-of-truth REFERENCE in the old repo. Read constantly, modified never. Design essence correct, code not production-grade.

### Rule 7 — Block-by-block sandbox with reusable HTML base context
> *"Module by module, new file to test-drive each one. Same HTML base context reusable. Everything that is not the CSS and assets type must be efficiently reusable."*

ONE `sandbox/_base.html` shared across every block.

### Rule 8 — Cascade-sensitivity rule (May 17 discovery)
`:root [class*="ts-tree"]` is a SCOPED DISTRIBUTION LAYER. Cascade is partially explicit. The rebuild uses explicit `:is(...)` enumeration where appropriate, designed during block-layer-type engineering.

### Rule 9 — @taxonomy_chips_strip 10 protected values are LOCKED design input
The chips strip docstring in the OLD repo's toolskin.css encodes 10 owner-locked values. The rebuilt chips block must reproduce these visually — they are the design contract.

### Rule 10 — Owner manual changes are AUTHORITATIVE
Between agent sessions, owner edits stand. Agents do not "fix" or revert without explicit direction.

### Rule 11 — Halt on anomaly, never improvise
Cost of stopping is minutes. Cost of improvising is months.

### Rule 12 — NEW REPO ONLY
After Session 1 lands, all rebuild work happens in `toolskin-rebuild/`. The old `toolskin-showcase/` is read-only reference. No edits, no commits, no PRs against the old repo.

### Rule 13 — NO NODE.JS RUNTIME DEPS IN SHIPPED PRODUCT
Apcach lives in `tools/color-engine/` as build-time tooling. The shipped artifact is pure CSS + minimal JS. No webpack, no Vite, no PostCSS runtime, no npm scripts the end consumer needs to run. Eventual ship = one CSS file + one JS file + wrapping library, drop-in for any context.

### Rule 14 — Fresh git history
The new repo's first commit IS the Session 1 baseline. No imported history from old repo. Clean room.

### Rule 15 — Smart Color System (apcach) is the color authority

The Toolskin color system is built on **apcach** (antiflasher/apcach, MIT, Evil Martians) — JS color calculator composing OKLCH colors with verified APCA contrast at every derivation step. This is the holy grail differentiator of Toolskin.

apcach runs at TWO layers:

1. **BUILD-TIME** (`tools/color-engine/`) — generates the canonical primitive OKLCH values for `--ts-bg-*`, `--ts-accent-*`, `--ts-this-*` token families. Output baked into `assets/css/next/primitives/colors.css`.
2. **OPTIONAL RUNTIME** (`toolskin.js`) — when consumer selects a new accent hue at runtime, toolskin.js calls apcach to recompute the entire derivative chain preserving contrast contracts.

**BINDING ON ALL CODE, ALL SKILLS, ALL SUB-AGENTS:**
- Every color rule in `assets/css/next/**/*.css` derives from apcach output OR consumes the derivative system that derives from apcach. NEVER from manual hex picks. NEVER from external skill color proposals.
- The CSS derivative chain (`--ts-this-color-*`, `--ts-this-bg-*`, surface superposition math) consumes apcach-derived primitives via CSS `oklch()` and `color-mix()` composition.
- NEVER propose alternative color systems. NEVER use "WCAG-only" methodology. NEVER use generic palette tooling.
- If a sub-agent's brief or any external skill flag conflicts with apcach output, apcach wins.

---

## Repo isolation (verbatim from file 07)

The two-repo model is a HARD INVARIANT, not a preference.

### The canonical Toolskin project

```
D:\Mis Documentos\Projects\Toolskin Framework\toolskin-rebuild\
```

- Main branch: `master`
- Git history: fresh — first commit IS Session 1's Phase F baseline
- THIS is where all work happens, all commits land, all branches grow

### The reference repo (read-only, frozen, separate)

```
D:\Mis Documentos\Projects\Toolskin Framework\toolskin-showcase\
```

- Status: PERMANENTLY READ-ONLY
- Sub-agents READ from it constantly; they NEVER write to it
- Never `cd` into, never run git ops against, never branch from
- A separate repository that happens to live on the same filesystem

### Language clarification

| Term | Refers to |
|---|---|
| "The Toolskin project" / "the repo" / "the rebuild" / "the project folder" | `toolskin-rebuild/` (canonical) |
| "Main branch" / "master" | `toolskin-rebuild`'s `master` (its own main) |
| "The reference" / "v1" / "frozen Toolskin" | `../toolskin-showcase/` (separate repo) |
| "../toolskin-showcase/" (relative path in code/specs) | The reference, accessed read-only |

NEVER say "main branch" when meaning the reference repo. The reference repo is NOT main in any sense.

### Physical isolation rules

1. Working directory stays inside `toolskin-rebuild/`. Never `cd` into the reference.
2. All git operations run inside `toolskin-rebuild/` only.
3. Reference reads use ONLY relative paths (`../toolskin-showcase/<path>`).
4. Read operations only (cat, view, grep, head, tail, find). Never write.
5. No symlinks, junctions, or bind mounts between repos.
6. CLAUDE.md (this repo root) states the freeze explicitly.

---

## Skill priority hierarchy (verbatim from file 05)

When conflict arises between any two skills, the higher-tier skill wins. Document override reason in the artifact footer.

```
TIER 1 — AUTHORITATIVE (Toolskin-specific, never overridden)
  1. toolskin-architecture (Phase E skill, this rebuild)
     └── Rule 15: apcach is THE color authority (NON-OVERRIDABLE)
  2. design-tokens-2.0 (in-house) — must consume apcach output
  3. expert-designer (in-house) — defers to apcach on color
  4. typography-master (in-house)

TIER 2 — WORKFLOW DISCIPLINE (process, not design authority)
  5. designer-skills (julianoczkowski) — grill-me, design-review, etc.
  6. Superpowers — execution discipline

TIER 3 — DIAGNOSTIC (advisory only, never authoritative on Toolskin)
  7. ECC design-system Mode 2 (Audit only) — 10-dim scoring with Toolskin filter
     - Mode 1 (Generate) OFF-LIMITS for Toolskin
     - Mode 3 (Slop detection) USEFUL with allowlist
  8. ECC accessibility — WCAG 2.2 floor

TIER 4 — DELIBERATION (invoked at ponderation gates)
  9. ECC council — default for Phase D Gates 4-5
  10. yogirk agent-council — high-stakes cross-model only

TIER 5 — SUPPORTING (utility, no design authority)
  11. ECC code-tour, codebase-onboarding, context-budget, browser-qa, ADR, configure-ecc
  12. apcach (build-time tooling, NOT a skill)
```

**ECC design-system filter list** (intentional Toolskin patterns NOT to flag):
- Intentional gradients (chip strip edge-fade, surface superposition)
- OKLCH-derived colors (apcach-derived per Rule 15, not random hex)
- Space Grotesk choice (brand display font)
- Harmonic 1.125 ladder typography
- Substring-distribution selectors where intentional (Rule 8)
- Dark mode "completeness" — apcach derives both modes from same math by construction

---

## Workflow per block

Every block sandbox session follows this exact workflow. The S5 protocol (`docs/handoffs/_rebuild-autonomous-protocol.md`) tiers the workflow per block type (PERMISSIVE / STRICT / ALWAYS STRICT).

1. **Read the block's tier in T1 typology** (`docs/handoffs/_rebuild-block-typology.md` §2). Confirm which gate applies.
2. **Read the relevant Wave 2 specs:**
   - S1 (`_rebuild-primitives-spec.md`) for color targets.
   - S2 (`_rebuild-system-spec.md`) for the derivative chain the block consumes.
   - S3 (`_rebuild-component-registry.md`) for the block's spec contract.
   - T2 (`_rebuild-base-context-spec.md`) for the `sandbox/_base.html` slot pattern.
3. **Copy `sandbox/_base.html` to `sandbox/<tier>/<block-name>/index.html`.** Apply the small delta per T2 §8.3 (≤6 edits).
4. **Author the block CSS at `assets/css/next/components/<block-name>.css`** with:
   - First non-empty line: `/* @ts-deps: <deps> */` header.
   - Two-layer pattern: Layer 1 single-class rule; Layer 2 contextual overrides as token swaps only.
   - No raw colors; consume `--ts-this-color-*` / `--ts-this-bg-*` derivatives.
   - No `!important`.
   - No `color-mix()` for state derivation (consume `--ts-this-bg-hover` etc.).
   - No new `--ts-this-*` tokens (those live at the system layer).
5. **Run the local dev server** (`python -m http.server` from `..\`) and open the sandbox.
6. **Verify parity-rig comparison** (T2 §5). Toggle the parity iframe; visually compare against the v1 reference loading from `../toolskin-showcase/`.
7. **Run the block's verification test** (T3 §7). Either manual checklist or automated parity diff.
8. **Per-tier gate (S5):**
   - PERMISSIVE (atomic) — if parity threshold met AND no hook violations, auto-progress: open PR for owner morning review.
   - STRICT (molecular) — complete the block, HALT for owner approval, commit only after explicit "proceed."
   - ALWAYS STRICT (layout) — owner approves every step.
9. **Commit per the commit message format** (below). Pre-commit hook validates 11 checks.

---

## Tier gates (S5 protocol summary)

Block-by-block execution per `docs/handoffs/_rebuild-autonomous-protocol.md` (S5):

| Tier | Examples | Gate | Behavior |
|---|---|---|---|
| **PERMISSIVE** | button, input, chip, toggle, badge, icon, label, link, kbd | Auto-progress if parity threshold met + no rule violations | PR opens, owner reviews next morning |
| **STRICT** | card, modal content (`.ts-modal`), accordion, tabs, menu, dropdown, popover, tooltip, drawer | Sub-agent completes block but HALTS for owner approval before commit | No auto-progress |
| **ALWAYS STRICT** | section, container, grid, columns, panel, sidebar, topbar, footer, hero, modal overlay (`.ts-modal-overlay`), surface compositions | Owner explicitly approves every step | Highest scrutiny |

See `docs/handoffs/_rebuild-autonomous-protocol.md` for the full S5 protocol.

---

## Refusal patterns

The toolskin-architecture skill encodes refusal patterns for forbidden requests. The full catalog lives at:

- `.claude/skills/toolskin-architecture/references/refusal-pattern-catalog.md` (full 23-pattern catalog)
- `docs/handoffs/_rebuild-governance-spec.md` §2 (this file's source)

Summary of categories:
- **R-ISO-1..4** — Repo isolation (modify reference, cd, git ops, symlinks)
- **R-SCO-1..3** — Scope (outside allowed paths, external skills, in-house skills outside update pass)
- **R-ARCH-1..6** — Architecture (skip gates, decisions outside typology, Node runtime deps, frameworks, auto-format, JS-runtime composition)
- **R-COL-1..4** — Color (raw literals, ECC Mode 1, override apcach, multi-input palette)
- **R-USR-1..7** — Consumer anti-patterns (T3 §8 documented warnings)
- **R-PAT-1..6** — Pattern violations (substring distribution scope, component state composition, !important, hand-edit primitives/colors.css, missing @ts-deps, design DNA — Wave 1.5 forward)

If you encounter a request matching a refusal pattern, cite the pattern ID and the source rule in your response.

---

## Council usage

When ambiguity persists at a Wave 2 synthesis gate, invoke a council. Two flavors:

### Standard council (4 voices) — purely structural decisions

For file path conventions, build pipeline mechanics, parser-module API shape, dep-header syntax, and other decisions with NO visual impact:

1. **Architect** — proposes the solution.
2. **Skeptic** — challenges scope, viability, hidden costs.
3. **Pragmatist** — what ships fastest with least risk.
4. **Critic** — failure modes ranked by severity.

Use `ECC council` (Tier 4, default). Time-box 15 min.

### Upgraded council (4 voices, design-aware) — visual / aesthetic / brand / UX decisions

For component visual design, typography choices, color palette evaluation, surface composition aesthetics, and any decision where the question "if we ship this, will it still LOOK like Toolskin?" applies:

1. **Architect** (same as standard) — proposes solution.
2. **Design Skeptic** (replaces generic Skeptic) — challenges from visual design perspective. Reads `expert-designer` + `typography-master` + `design-tokens-2.0` SKILL.md + `_rebuild-design-dna.md` before responding. Counter-proposals honor design DNA, not generic heuristics.
3. **Pragmatist** (same as standard, plus "what does the user SEE?") — shipping reality from the user's eye.
4. **Design Critic** (replaces generic Critic) — audits against all 15 rules INCLUDING Rule 5 (drop-in identity preservation). Audits against design DNA. Failure modes ranked by VISUAL severity. Asks "If we ship this, will it still LOOK like Toolskin?"

Default to upgraded voices unless the decision is purely structural. When using upgraded voices, BOTH Design Skeptic and Design Critic MUST have access to:
- `docs/handoffs/_rebuild-design-dna.md` (Wave 1.5 output)
- Tier 1 in-house design skills
- The relevant component reference in `../toolskin-showcase/`

### Procedural correction (Gate 4.5 lock)

**After any council invocation:** if voices DISAGREE on substantive points → surface disagreement to owner, halt for owner call, encode owner's resolution as binding input to the next dispatch. **Do not auto-resolve.**

If voices AGREE → orchestrator may proceed without owner intervention, but surfaces the consensus + any minor dissent for owner visibility.

---

## Owner approval workflow

Session 1 used a 7-gate workflow (Gates 1-7 per file 01 §EXECUTION SEQUENCE). Sessions 2+ adopt the S5 tiered protocol PLUS the gates that apply at session start and session end.

### Session 1 gates (one-time)

| Gate | What | Time |
|---|---|---|
| 1 | New repo structure created | ~30 min |
| 2 | Toolchain operational + editor toggles | ~25 min |
| 3 | Document queue validated | ~15 min |
| 4 | Wave 1 synthesis approved (block typology + base + integration) | ~60 min |
| 4.5 | A1 council picks locked | (within Gate 4) |
| 5 | Wave 2 synthesis approved (S1-S6 specs) | ~90 min |
| 6 | toolskin-architecture skill + governance reviewed | ~45 min |
| 7 | First commit lands | ~10 min |

### Session 4+ per-block tier gates (S5)

Per the table in §"Tier gates" above. Each session targets one block; the tier determines the gate.

### Cross-session gates

- **Start-of-session:** owner confirms `toolskin-architecture` skill auto-loaded, confirms working directory is `toolskin-rebuild/`, confirms reference repo is reachable read-only.
- **End-of-session:** owner reviews commit(s), confirms `git status` clean, confirms the next session's task is queued.

---

## Commit message format

Every commit on `master` (the rebuild's main) carries a rebuild session tag:

```
<type>(<scope>): <message>

[optional body]

[optional footer — e.g., Hook-bypass-approved-by: <owner>]
```

### Allowed types

- `feat` — new feature (new block, new token, new API)
- `fix` — bug fix
- `refactor` — code refactor without functional change
- `docs` — documentation only
- `chore` — toolchain, governance, dependencies
- `test` — adding or updating tests

### Allowed scopes

- `rebuild` — generic rebuild work
- `rebuild-atomic` — atomic-tier block
- `rebuild-molecular` — molecular-tier block
- `rebuild-layout` — layout-tier block (ALWAYS STRICT)
- `rebuild-infra` — infrastructure (engines, observers, asset-loader)
- `rebuild-primitives` — primitives layer
- `rebuild-system` — system layer
- `rebuild-toolchain` — toolchain or build pipeline
- `rebuild-skill` — toolskin-architecture skill updates
- `rebuild-governance` — governance (this file, hook, refusal patterns)
- `rebuild-css` / `rebuild-js` — generic CSS/JS without specific tier
- `handoffs` — `docs/handoffs/` only

### Examples

- `feat(rebuild-atomic): add .ts-btn with two-layer pattern`
- `fix(rebuild-system): correct --ts-this-bg-hover mix percentage`
- `refactor(rebuild-css): consolidate .ts-input states under :is(...)`
- `docs(handoffs): land S6 governance spec`
- `chore(rebuild-toolchain): pin apcach to 1.2.0`

### Body conventions

- Reference relevant rule numbers in commit body (`Per Rule 15: ...`).
- Reference spec sections (`Per S2 §7.1 5-state pattern: ...`).
- Reference handoff docs (`See docs/handoffs/_rebuild-system-spec.md §3`).

---

## Editor config (format-on-save DISABLED)

Per Gate 2 toggles + Rule 4 (no auto-format on CSS).

### Required settings

**VS Code / Cursor** (`.vscode/settings.json`):

```json
{
  "editor.formatOnSave": false,
  "[css]": {
    "editor.formatOnSave": false,
    "editor.formatOnPaste": false,
    "editor.codeActionsOnSave": {}
  },
  "[html]": {
    "editor.formatOnSave": false
  },
  "css.lint.unknownAtRules": "ignore",
  "css.lint.unknownProperties": "ignore"
}
```

**Sublime Text**: disable any installed CSS formatter package on auto-save.

**Chrome DevTools workspace live-edit**: DISABLED. Live-edit pollutes diffs with cascade reorderings.

### Verification

The pre-commit hook (Check 9) WARNS when `.vscode/settings.json` is in the staged diff so owner can audit the toggles haven't drifted.

---

## `--no-verify` bypass policy

`git commit --no-verify` bypasses the pre-commit hook. This is **forbidden by default**.

### When allowed

ONLY with explicit owner approval. Examples:
- Owner ack'd a known-but-irrelevant hook misfire (e.g., a legitimate Wave-1.5 design-DNA edge case the Check 11 stub flags incorrectly).
- Owner is committing the very file that fixes a hook bug.

### How to invoke (when allowed)

1. Stage your changes.
2. Add a footer to the commit message:
   ```
   Hook-bypass-approved-by: Satoshi
   Reason: <one-line reason>
   ```
3. Run `git commit --no-verify` (the hook is skipped — your footer is the audit trail).
4. Log the bypass in `docs/handoffs/_hook-bypass-log.md` per §3.3 of the governance spec.

### When forbidden

- Routine workflow (e.g., "the hook is slow today").
- "The check is wrong — I know better." Fix the check, don't bypass.
- Commits that introduce new files outside allowed paths, raw colors in components, `!important`, or any other R-PAT / R-COL / R-SCO violation.

Bypasses are visible at PR review. The orchestrator surfaces any `--no-verify` commits to owner at end-of-session review.

---

## Where to read more

- **Architecture**: `docs/handoffs/_wave-1-synthesis.md` + Appendices A1-Council + A1-Resolution
- **Block typology**: `docs/handoffs/_rebuild-block-typology.md` (T1)
- **Base context**: `docs/handoffs/_rebuild-base-context-spec.md` (T2)
- **Adaptive integration**: `docs/handoffs/_rebuild-adaptive-integration-spec.md` (T3)
- **Color primitives**: `docs/handoffs/_rebuild-primitives-spec.md` (S1)
- **System layer**: `docs/handoffs/_rebuild-system-spec.md` (S2)
- **Component registry**: `docs/handoffs/_rebuild-component-registry.md` (S3)
- **Build pipeline**: `docs/handoffs/_rebuild-build-pipeline-spec.md` (S4)
- **Autonomous protocol**: `docs/handoffs/_rebuild-autonomous-protocol.md` (S5)
- **Governance spec**: `docs/handoffs/_rebuild-governance-spec.md` (S6 — this file's source)
- **Design DNA**: `docs/handoffs/_rebuild-design-dna.md` (Wave 1.5, post-Wave-2)
- **Architecture skill**: `.claude/skills/toolskin-architecture/SKILL.md` (Phase E deliverable)

---

## A note on tone

This file is dry by design. The rebuild's value comes from precise rules consistently applied. If you find the rules frustrating, that's the right frustration — Toolskin v1's three-month disaster history came from improvisation, not rules. The cost of stopping to check a rule is minutes. The cost of improvising past a rule is months.

Owner: Satoshi / SatSea.
````

---

## 5. Auditable cascade-sensitivity check (T1 §5.5)

This is the spec for Check 10 in §3.2. Restated here verbatim from T1 §5.5 pseudocode plus S6's interpretation:

```
FOR EACH staged file in assets/css/next/**/*.css:
  FOR EACH rule whose selector matches /\[class\*=\s*"ts-/:
    REQUIRE selector starts with ":root " (or another allowed-origin token — S4 maintains list)
    REQUIRE rule body declares ONLY custom-property declarations (--ts-*: <value>)
    REQUIRE preceding comment block within 5 lines above contains "DISTRIBUTION LAYER" AND a reference to Rule 8
  IF any requirement fails:
    emit WARN with file:line, the failing selector, and the specific requirement(s) missed
    (substring distribution is sometimes appropriate per T1 §5.3 — WARN not FAIL)
```

### Why WARN not FAIL

T1 §5.3 establishes when substring distribution is appropriate (recursive component families, token-only distribution under `:root` scope). The check enforces the *structural shape* of correct substring use; it doesn't ban the pattern outright. A FAIL would be too aggressive — block authors might have a legitimate substring use the auditor's structural rules miss. The WARN ensures owner notices each instance at PR review without halting the workflow.

### What the WARN message contains

- File path + line number
- The matching selector verbatim
- Per-requirement pass/fail breakdown:
  - (a) scoped to `:root` or allowed origin — pass/fail
  - (b) body declares ONLY `--ts-*` tokens — pass/fail
  - (c) preceding comment contains `DISTRIBUTION LAYER` + Rule 8 reference — pass/fail
- A pointer to T1 §5.2 (when to use explicit `:is(...)` instead)

### Future hardening

Post-Gate-5, once the rebuild has ~10 blocks committed and all known substring-distribution uses are catalogued, owner may upgrade this check from WARN to FAIL with an allowlist of known-good selectors. S6 docs this as a Phase F+ tightening pass, not a Session 1 deliverable.

---

## 6. Toolskin-architecture skill encoding (Phase E SKILL.md sections)

The Phase E `toolskin-architecture` skill (`.claude/skills/toolskin-architecture/SKILL.md` + `references/`) encodes S6 content as follows. Phase E author (orchestrator) consumes this section verbatim.

### 6.1 SKILL.md sections owned by S6

#### Section: "REPO MODEL — READ FIRST"

Verbatim copy of file 07 §"THE CANONICAL TOOLSKIN PROJECT", §"THE REFERENCE SOURCE-OF-TRUTH", §"HOW TO TALK ABOUT EACH", §"PHYSICAL ISOLATION RULES", §"WHEN A SUB-AGENT NEEDS REFERENCE MATERIAL", §"WHY THIS MATTERS".

This is the FIRST section of SKILL.md after the YAML frontmatter. It's the first thing any agent reads.

#### Section: "REFUSAL PATTERNS"

Brief introduction listing the 23 refusal-pattern IDs by category, plus links to `references/refusal-pattern-catalog.md` for full language.

Format:
```markdown
## Refusal Patterns

When asked to do a forbidden thing, refuse with the exact language from
`references/refusal-pattern-catalog.md`. Cite the pattern ID + source rule.

Categories:
- R-ISO-1..4 — Repo isolation (file 07)
- R-SCO-1..3 — Scope (file 01 §GLOBAL RULES 6)
- R-ARCH-1..6 — Architecture (Rules 1, 11, 13 + Gate locks)
- R-COL-1..4 — Color (Rule 15)
- R-USR-1..7 — Consumer anti-patterns (T3 §8)
- R-PAT-1..6 — Pattern violations (Rule 8 + S2 §17.4 + Wave 1.5 forward)

For each pattern, the catalog file specifies trigger, source, and exact
refusal response with file:line reference template.

Cite by ID. Example:
> "Refused per R-COL-1: Toolskin v2 forbids raw color values in component
> CSS per Rule 15. The proposed `#7d4fd6` at `card.css:14` must route
> through `--ts-this-color-*` derivatives..."
```

#### Section: "COUNCIL USAGE"

Verbatim copy of CONTRIBUTING.md §"Council usage" (§4 above). Includes:
- Standard 4 voices for purely structural decisions
- Upgraded voices (Design Skeptic + Design Critic) for visual / aesthetic / brand / UX decisions (Gate 4.5 council upgrade)
- Procedural correction (Gate 4.5 lock): surface disagreements to owner before dispatching consumers

### 6.2 `references/` files owned by S6

#### `references/conversation-rules-verbatim.md`

The full 15 rules from CONTRIBUTING.md §"15 binding rules (verbatim)". Single-source-of-truth for agents asking "remind me of Rule N."

#### `references/refusal-pattern-catalog.md`

Full §2 of this spec — 23 named patterns, each with trigger, source, and exact response. The single file an agent loads when constructing a refusal.

### 6.3 What S6 does NOT own in the skill

Other Phase E author owns:
- Three-tier token architecture (S1 + S2 outputs)
- Block typology (T1 output)
- Reusable HTML base context (T2 output)
- Adaptive integration contract (T3 output)
- Block sandbox workflow (S5 output)
- Autonomous execution tiers (S5 output)
- @taxonomy_chips_strip contract (extracted from old repo by T1/S3)
- Cascade-sensitivity incident write-up (extracted from session-state)
- ts-marquee canonical pattern (extracted by T1/S3)

S6's domain: governance, refusal language, council protocol, repo-isolation rules. The skill author wires S6 content into the skill alongside other sub-agents' content.

---

## 7. Open questions

- `[ ] gap:` **Hook bypass log file location** — §3.3 references `docs/handoffs/_hook-bypass-log.md`. Owner confirms this location at Gate 5 or proposes alternative (e.g., `docs/_audit/`).
- `[ ] gap:` **Wave 1.5 design DNA refusal pattern** — R-PAT-6 (§2.6) is stubbed. Pattern content TBD until `_rebuild-design-dna.md` lands. Hook Check 11 is a no-op until then. Once Wave 1.5 ships, S6 (or the Phase E author) updates R-PAT-6 with actual DNA-violation language and activates Check 11.
- `[ ] gap:` **Module config block** — Check 3 severity (WARN vs FAIL) is owner-configurable post-Gate-5. S4's module needs a config schema for severity overrides + allowed-origin list (Check 10) + named-color list (Check 5). S6 specifies the config keys here; S4 implements the loader.
- `[ ] gap:` **commit-msg phase hook** — the wrapper script (§3.1) defers commit-msg-tag check to a sibling `.git/hooks/commit-msg` hook. S4 documents the installer script for both hooks.
- `[ ] gap:` **PR-time vs commit-time check coverage** — some refusal patterns are harder to enforce at commit-time than PR-time (e.g., R-USR-1 needs consumer code, which isn't in the rebuild repo). CONTRIBUTING.md documents them; the hook only enforces the in-repo-detectable subset. Owner confirms scope at Gate 5.
- `[ ] gap:` **Hook bootstrapping** — `.git/hooks/` is not git-tracked. After Gate 5, owner runs an installer script (S4 designs) that copies the hook into place. S6 documents the install command in CONTRIBUTING.md "First-time setup" section (post-Gate-5 addendum).
- `[ ] gap:` **Cross-platform hook compatibility** — bash wrapper assumes POSIX `bash`. On Windows, git's bundled Git Bash provides this. The hook works in Git Bash, Cygwin, MSYS2, WSL, native macOS/Linux. S4 confirms by running fixtures in the Windows-native Git for Windows installation.

---

## 8. Contact points

| Sub-agent / artifact | Consumes from S6 | Action |
|---|---|---|
| **S3 (Component Registry)** | Refusal patterns reference block names — S3's per-block sketch `block-spec.md` files mention applicable refusal patterns by ID | S3 cites R-COL-1, R-PAT-2, R-PAT-3, R-PAT-5 in block-spec templates |
| **S4 (Build Pipeline)** | Hook delegates topo-sort + bundler-order diff to S4's module (Check 7, Check 6 dep validation). S4 owns shared parser module per A1 Q3 | S4 publishes `parseDeps`, `topoSort`, `diffSandboxVsBundlerOrder`, `validate` exports per §3.5 |
| **S5 (Autonomous Protocol)** | Tier-tag check + council protocol integrate with S5's PERMISSIVE/STRICT/ALWAYS STRICT gates | S5's PR template references CONTRIBUTING.md tier-gates section + cites refusal patterns S5's audits will trigger |
| **Phase E `toolskin-architecture` skill** | §6 above — SKILL.md "REPO MODEL", "REFUSAL PATTERNS", "COUNCIL USAGE" sections + `references/conversation-rules-verbatim.md` + `references/refusal-pattern-catalog.md` | Phase E author copies §6 content verbatim |
| **Owner at Gate 5** | Approves: pre-commit hook script (§3) + CONTRIBUTING.md content (§4) + refusal-pattern catalog (§2) | Owner signs off; orchestrator installs hook + commits CONTRIBUTING.md in Phase F |

---

## 9. Status

**Status:** `DONE_WITH_GAPS`

**What's complete:**
- §1 S6 vs S4 scope split.
- §2 Refusal pattern catalog — 23 patterns across 6 categories, each with trigger, source citation, and exact refusal language.
- §3 Pre-commit hook bash wrapper + 11 governance checks + bypass policy + module API expectations.
- §4 Full CONTRIBUTING.md content (15 rules verbatim, repo isolation, tier hierarchy, workflow, gates, refusal patterns, council usage, owner approval, commit format, editor config, --no-verify bypass).
- §5 Cascade-sensitivity check spec restating T1 §5.5 pseudocode.
- §6 Phase E SKILL.md encoding spec — sections S6 owns and references/ files.
- §7 Open questions (7 items, all post-Gate-5).
- §8 Contact points.

**Gaps:**
- Hook bypass log file location (defer to Gate 5).
- Wave 1.5 design DNA refusal pattern (R-PAT-6 stubbed until Wave 1.5 lands).
- Module config block (severity, allowed-origin list, named-color list — defer to Gate 5 + S4).
- Cross-platform hook compatibility verification (defer to S4 fixtures).
- Hook bootstrapping installer script (S4 spec).
- PR-time vs commit-time check coverage line (defer to Gate 5).

**What was NOT written (per restrictions):**
- `.git/hooks/pre-commit` — NOT installed.
- `CONTRIBUTING.md` at repo root — NOT committed.
- `tools/build/precommit-validate.js` — owned by S4.
- Anything under `../toolskin-showcase/`, `.claude/skills/`, `assets/`, `sandbox/`, `tools/build/`.

**Next:** Orchestrator pondersates this spec against S3, S4, S5 (parallel Wave 2.3) at synthesis. Open questions surface for owner at Gate 5. Phase E author wires §6 into SKILL.md. Hook + CONTRIBUTING.md install at Phase F per file 01 commit message.

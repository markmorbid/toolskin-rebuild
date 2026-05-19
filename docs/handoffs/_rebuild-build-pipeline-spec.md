# S4 — Build Pipeline Architect Spec

**Sub-agent:** S4 — Build Pipeline Architect
**Wave:** 2.3 (parallel with S3, S5, S6)
**Session:** 1
**Authored:** 2026-05-19
**Status:** PROPOSED — for Owner Gate 5 review (architecturally LOCKED inputs from Gate 4 + Gate 4.5)
**Binding rules:** Conversation Rules 1–15 (file 01 + file 06), file 07 repo isolation, file 05 tier hierarchy
**A1 LOCKED:** owner-resolved per `docs/session-1-bootstrap/a1-council-resolution.md` (verbatim in §2)
**A5 LOCKED:** infrastructure category separate from blocks (Gate 4 / D7)
**A8 LOCKED:** marquee engine hover-pause = opt-in (Gate 4 / A8)
**Restrictions:** SPEC ONLY. Markdown only. No `tools/build/*.js`, no `.git/hooks/*`, no `dist/*`, no `assets/**`, no `sandbox/**` writes this session.

---

## 0. Three-line summary

S4 implements the A1 LOCKED hybrid: per-block CSS files declare deps via `/* @ts-deps: ... */` headers; a self-contained Node script at `tools/build/bundle-css.js` parses headers, topo-sorts, emits `dist/toolskin.css` (single ship) + `dist/blocks/<block>.css` (opt-in per-block); pre-commit hook (S6 wraps; S4 owns the parser module) validates topo-sort + sandbox-link order matches bundler order. Infrastructure (engines, observers, asset-loader, theme-toggle impl) is a separate sandbox category outside the 128-block typology, bundled to `dist/toolskin.js`. Marquee hover-pause becomes opt-in (`data-pause-on-hover`) and `pointer-events: none` is removed.

---

## 1. Scope of S4 vs other sub-agents

| Topic | S4 owns? | Cross-owner |
|---|---|---|
| **A1 — Compositional block multi-CSS loading** | **YES (primary)** | S6 (hook script wraps parser module); Sessions 4+ (block sandboxes use bundler output) |
| **A5 — Infrastructure category (engines/observers/asset-loader/theme-toggle impl)** | **YES (primary)** | S3 (registry doesn't list these as the 128 blocks); S5 (no autonomous tier — engineering work is owner-driven) |
| **A8 — Marquee engine hover-pause default flip** | **YES (engine spec)** | T1 §4.2 (problem statement); Session 4+ marquee sandbox (coordinated CSS + JS fix in one commit) |
| **R1-R6 (Wave 1 synthesis refinements)** | **YES** for R1 (parser/diff), R4 (`dist/` committed), R5 (cascade-order manifest emit), R6 (per-block opt-in doc) | S2 owns R3 (`shared-tokens/` layer) — see §3 cascade order; S6 owns the wrapper script for R1 |
| A2 modal split | S3 | — |
| A3 marquee tier-promotion | S5 | — |
| A4 surface-N split | S3 | — |
| A6 UIKit aliasing | S3 | — |
| A7 apcach runtime bootstrap | S1 | S4 ships per S1's chosen bootstrap (config-object via `window.__TOOLSKIN_CONFIG__`) |
| A9 `data-theme` canonical | S1/S2 migration map | — |

**Hard line:** S4 does NOT specify content of individual block CSS files. S4 specifies HOW blocks compose and ship. Per-block CSS authorship is Sessions 4+ owner-and-sub-agent work.

---

## 2. A1 implementation (LOCKED architecture — verbatim)

The following 8 points are LOCKED by `docs/session-1-bootstrap/a1-council-resolution.md`. S4's job is to implement them concretely; not relitigate them.

```
A1 ARCHITECTURE LOCKED (per Gate 4.5 owner resolution):

1. Source-of-truth dependency declaration: @ts-deps comment headers in
   each block's CSS file.
   Format: /* @ts-deps: primitives/colors, primitives/spacing, ... */

2. Sandbox loading: each block's index.html has explicit <link> tags
   in dependency order (validated by pre-commit hook against bundler
   topo-sort output).

3. Production build: tools/build/bundle-css.js (Node, build-time only)
   parses @ts-deps headers, topo-sorts, emits:
   - dist/toolskin.css (single concatenated file)
   - dist/blocks/<block>.css (per-block files)
   - dist/colors-contrast-report.md (apcach audit artifact from S1)

4. Pre-commit hook (S6 designs script, S4 provides parser module):
   - Validate topo-sort terminates
   - Validate all @ts-deps reference valid blocks
   - Diff sandbox <link> order vs bundler topo-sort output
   - Fail commit on any mismatch

5. dist/ committed to repo. .gitignore does NOT exclude dist/.
   .gitattributes optionally marks dist/*.css as linguist-generated
   to reduce diff noise.

6. Consumer modes (must be documented in dist/README.md or similar):
   - Default: <link href="dist/toolskin.css">  (drop-in single file)
   - Advanced: import dist/blocks/<block>.css individually (tree-shake)

7. Circular dependency strategy: introduce shared-tokens/ layer
   between system/ and components/ for tokens needed by multiple
   components. OR allow explicit /* @ts-cycle-break: <token> */
   annotation for inevitable mutual references (e.g., chip <-> chip-strip).
   S4 designs the policy.

8. Cascade-sensitivity rule honored: the bundler does NOT optimize
   selector specificity or reorder rules within a block. Block author
   intent is preserved byte-for-byte.
```

### 2.1 Concrete sandbox loading (Point 2)

Per T2 §3.2, the reusable `sandbox/_base.html` has a locked CSS load order (rows 1-9 = primitives + system; row 10 = utilities; row 11 = THE block under test). For compositional blocks (a card sandbox containing a button), the sandbox's per-block `index.html` adds explicit `<link>` tags BEFORE the block-under-test's `<link>`:

```html
<!-- sandbox/02-molecular/card/index.html (Session 4+) -->
<!-- ... primitives/system load identical to _base.html ... -->
<!-- Compositional deps, declared via card.css @ts-deps header, materialized here -->
<link rel="stylesheet" href="../../../assets/css/next/components/button.css">
<link rel="stylesheet" href="../../../assets/css/next/components/icon.css">
<!-- Block under test loads last -->
<link rel="stylesheet" href="../../../assets/css/next/components/card.css">
```

The dep `<link>` order MATCHES the topo-sort the bundler produces. Hook (§7) enforces.

### 2.2 Concrete production build (Point 3)

```
node tools/build/bundle-css.js
```

emits (relative to repo root):

```
dist/
├── toolskin.css                  # single concatenated, cascade-correct
├── toolskin.min.css              # minified (built-in regex minifier)
├── toolskin.js                   # core engine + UIKit + asset-loader (per A5)
├── toolskin.min.js               # minified
├── toolskin.full.min.js          # OPTIONAL: + bundled apcach subset (Path A per S1 §9)
├── blocks/
│   ├── button.css                # per-block file (opt-in tree-shake)
│   ├── card.css
│   ├── ... (one per component family)
├── _cascade-order.txt            # R5: human-readable concat order audit
├── _dep-graph.json               # debug artifact: full dep DAG
├── colors-contrast-report.md     # from S1's generate-colors.js (apcach audit)
└── README.md                     # consumer modes documentation (per Point 6)
```

### 2.3 Concrete pre-commit hook (Point 4)

S6 owns `.git/hooks/pre-commit` (bash script wrapper). S6's wrapper invokes:

```
node tools/build/precommit-validate.js --staged "$(git diff --staged --name-only)"
```

`precommit-validate.js` (S4's parser module — §7) returns exit code 0 (pass) or 1 (fail) plus a diagnostic report on stderr. The wrapper bails the commit on non-zero.

### 2.4 Concrete `dist/` commit policy (Point 5)

- `.gitignore`: `dist/` NOT excluded. Source dependency directories ARE excluded (`tools/color-engine/node_modules/`, `tools/build/node_modules/` if any — though §5 says S4 ships zero-dep).
- `.gitattributes`: `dist/*.css` and `dist/*.js` marked `linguist-generated=true` and `merge=ours` to keep GitHub's diff-noise minimal AND auto-resolve merge conflicts (every release the owner regenerates `dist/`, so a merge conflict in `dist/` is by definition stale).
- Release workflow: owner runs `npm run build` (or `node tools/build/bundle-css.js` directly), reviews `git diff dist/`, commits the source CSS + `dist/` changes together.
- A CSS-only contributor patching `assets/css/next/components/button.css` MUST stage both the source AND the regenerated `dist/` files in the same commit. The pre-commit hook enforces this (§7.4).

### 2.5 Consumer modes (Point 6) — `dist/README.md` outline

```markdown
# Toolskin v2 — `dist/`

This folder ships pre-built Toolskin. **Do not edit files in this folder by hand** — they are regenerated by `tools/build/bundle-css.js`. Source CSS lives in `../assets/css/next/`.

## Consumer modes

### Default (single-file drop-in) — recommended for AI artifacts, WordPress, static HTML, Vue, React
<link rel="stylesheet" href="dist/toolskin.css">
<script src="dist/toolskin.js" defer></script>

This is the canonical path. Zero configuration.

### Advanced (per-block import) — for build-tool consumers with tree-shake
Each block has its own file at `dist/blocks/<block>.css`. Import in dependency order:
import 'toolskin/dist/blocks/primitives.colors.css';
import 'toolskin/dist/blocks/primitives.spacing.css';
... (see `_cascade-order.txt` for the full order)
import 'toolskin/dist/blocks/button.css';
import 'toolskin/dist/blocks/card.css';

The single-file path remains supported; per-block is an opt-in optimization.

## Files
- `toolskin.css` — single concatenated CSS, all blocks, cascade-correct
- `toolskin.min.css` — minified
- `toolskin.js` — core engine + UIKit + asset-loader + apcach runtime hook
- `toolskin.min.js` — minified
- `toolskin.full.min.js` — optional, with bundled apcach subset (Path A) for runtime accent recompute without CDN dep
- `blocks/<block>.css` — per-block files, opt-in tree-shake
- `_cascade-order.txt` — audit artifact: the exact concat order
- `_dep-graph.json` — debug: full dependency DAG
- `colors-contrast-report.md` — apcach APCA contrast audit (from `tools/color-engine/generate-colors.js`)
```

---

## 3. Cascade order across pipeline (LOCKED)

Matches T2 §3.2 + S2 §9 `shared-tokens/` slot. Bundler emits in THIS order; sandbox `<link>` tags emit in THIS order. Both must agree (§7.3 diff check).

| # | File pattern | Layer | Role | Author |
|---|---|---|---|---|
| 1 | `assets/css/next/primitives/colors.css` | Primitive | apcach-derived OKLCH (`--ts-bg-*`, `--ts-accent-*`, `--ts-on-*`). Rule 15 binding. | S1 (build script `tools/color-engine/generate-colors.js` writes this file) |
| 2 | `assets/css/next/primitives/spacing.css` | Primitive | `--ts-sp-*` 4px-base scale | hand-authored, locked once |
| 3 | `assets/css/next/primitives/typography.css` | Primitive | `--ts-fs-*` harmonic 1.125 ladder, `--ts-font-*`, line-height tokens | hand-authored |
| 4 | `assets/css/next/primitives/radius.css` | Primitive | `--ts-radius-*` | hand-authored |
| 5 | `assets/css/next/primitives/motion.css` | Primitive | `--ts-ease-*`, `--ts-dur-*` | hand-authored |
| 6 | `assets/css/next/system/surfaces.css` | System | `--ts-this-bg-*` derivative chain + surface superposition rules (Rule 4) | S2 |
| 7 | `assets/css/next/system/text.css` | System | `--ts-this-color-*` + auto-contrast (OKLCH-derived per Rule 15) | S2 |
| 8 | `assets/css/next/system/states.css` | System | `--ts-this-bg-border-active/disabled/focus`, hover/active states | S2 |
| 9 | `assets/css/next/system/reset.css` | System | Minimal CSS reset + body baseline | S2 |
| 10 | `assets/css/next/shared-tokens/*.css` | **NEW** Shared layer (R3) | Tokens consumed by 2+ component families to break cycles | S2 (initial files), grown per-cycle in Sessions 4+ |
| 11 | `assets/css/next/utilities/*.css` | Utility | Layout composition utilities (`.ts-stack`, `.ts-cluster`, etc.) | Sessions 2+ |
| 12 | `assets/css/next/components/<block>.css` | Component | One file per component family; internal topo-sort ordered by `@ts-deps:` headers | Sessions 4+ block sandboxes |
| 13 | `assets/css/next/infra/*.css` | **A5/D7 NEW** Infrastructure | Engine stylesheet contributions (e.g., preloader CSS that toolskin.js' boot needs). Often empty — most infra is JS. | Sessions 4+ infra sandbox |

### 3.1 Why this order is the contract

- Primitives at `:root` → must declare first so every downstream rule resolves them (T2 §3.1 explanation, Rule 8 cascade-sensitivity).
- System layer derives `--ts-this-*` chain from primitives → must come after primitives, before components.
- `shared-tokens/` layer sits between system and components → consumes `--ts-this-*`, provides `--ts-shared-*` to components (S2 §9.2).
- Components consume both `--ts-this-*` (system) and `--ts-shared-*` (shared-tokens) → must come last, in dependency-resolved order.
- Infrastructure CSS (if any) loads LAST because engines are runtime-attached behaviors layered atop the visual blocks — overrides for animation paused states, observer-triggered classes, etc.

### 3.2 Within `components/`, dep ordering

Components topo-sort against each other via `@ts-deps:` headers. T1 §2.4 gives the rough partial order:

1. Atomic blocks (44) — leaves of the DAG; consume primitives + system + shared-tokens only; do NOT depend on each other.
2. Molecular blocks (49) — depend on 1+ atomic blocks (card depends on button, modal depends on close-button, etc.).
3. Layout blocks (35) — depend on molecular AND atomic (section composes card, hero composes display-title + button).

Within a tier, alphabetical order is the **stable tiebreaker** for deterministic output (the topo-sort is otherwise non-unique). Block author intent within a block file is preserved byte-for-byte (Point 8 of A1 LOCKED).

---

## 4. `@ts-deps:` header convention

### 4.1 Format

```css
/* @ts-deps: primitives/colors, primitives/spacing, system/surfaces, shared-tokens/strip-layout, components/chip */
```

**Rules:**
- One header per CSS file. Located in the first 10 lines of the file.
- Comma-separated identifiers. Whitespace tolerant.
- Each identifier is `<folder>/<name>` (no `.css` extension, no path prefix).
- Folders allowed: `primitives`, `system`, `shared-tokens`, `utilities`, `components`, `infra`.
- Identifiers are file-stem-based (`primitives/colors` = `assets/css/next/primitives/colors.css`).
- Identifiers MUST resolve to an existing CSS file in `assets/css/next/`. Hook validates (§7.2).
- Implicit primitives: every file's bundler-resolved deps include all primitives unconditionally (cascade order rows 1-5 always loaded first by both bundler and sandbox). Block authors may omit `primitives/*` from their header for brevity — the bundler injects them. Recommendation: write them explicitly for clarity in block-spec docs; tolerate either.
- Cycle break: `/* @ts-cycle-break: --ts-shared-chip-edge-gap */` annotation may appear on the SECOND line, declaring a specific token whose mutual reference is intentional (§6.3).

### 4.2 Example headers

```css
/* assets/css/next/components/button.css */
/* @ts-deps: primitives/colors, primitives/spacing, primitives/radius, primitives/typography, system/surfaces, system/text, system/states */
.ts-btn { ... }
```

```css
/* assets/css/next/components/card.css */
/* @ts-deps: primitives/colors, primitives/spacing, primitives/radius, system/surfaces, system/text, components/button */
.ts-card { ... }
```

```css
/* assets/css/next/components/chip-strip.css */
/* @ts-deps: primitives/colors, primitives/spacing, system/surfaces, shared-tokens/strip-layout, components/chip */
.ts-chips { ... }
```

```css
/* assets/css/next/components/chip.css */
/* @ts-deps: primitives/colors, primitives/spacing, primitives/radius, system/surfaces, system/text, shared-tokens/strip-layout */
.ts-chip { ... }
```

(chip + chip-strip both depend on `shared-tokens/strip-layout` — no cycle. R3 in action.)

### 4.3 Parser module — `tools/build/parse-deps.js`

Pure-function module shared by `bundle-css.js` (bundler) and `precommit-validate.js` (hook). Same input → same output. Single source of truth.

**Module API:**

```
// Pseudocode (real implementation is JS, S4 specifies; Session 2+ writes)

parseDeps(filePath: string) -> {
  deps: string[],          // ordered list from header
  cycleBreaks: string[],   // tokens declared as cycle-breaks
  filePath: string,        // for diagnostics
  blockName: string,       // file stem
  layer: string,           // folder name
}

readAllBlocks(rootDir: string = 'assets/css/next/') -> Block[]
  // Walks rootDir, parses every *.css for @ts-deps headers, returns array.

buildGraph(blocks: Block[]) -> {
  graph: Map<blockId, blockId[]>,  // adjacency list
  blocks: Map<blockId, Block>,
}

topoSort(graph) -> {
  order: string[],         // bundler emit order
  cycles: Cycle[],          // if any (each Cycle is array of blockIds forming the loop)
}

validateDeps(blocks, graph) -> {
  errors: ParseError[],     // typoed dep refs, non-existent files
  warnings: Warning[],      // e.g., missing primitives in header (auto-injected, not fatal)
}
```

**Header parsing implementation hints:**
- Regex: `/^\s*\/\*\s*@ts-deps\s*:\s*([^*]+)\*\//m` matched against first 10 lines.
- Split captured group on `,`, trim whitespace, filter empty.
- For each identifier, split on `/` to get `[layer, name]`.
- Validate layer is in `{primitives, system, shared-tokens, utilities, components, infra}`.
- Validate `assets/css/next/<layer>/<name>.css` exists.

### 4.4 Validation rules (used by both bundler and hook)

| Rule | Severity | Description |
|---|---|---|
| V1 | FAIL | Header references non-existent file (typo or rename) |
| V2 | FAIL | Topo-sort detects a cycle AND no `@ts-cycle-break:` justifies it |
| V3 | FAIL | `@ts-cycle-break:` annotation declares a token that isn't part of the detected cycle |
| V4 | FAIL | File has 2+ `@ts-deps:` headers (only one allowed) |
| V5 | FAIL | Header references a folder not in the allowed set |
| V6 | WARN | Component file references a non-loaded folder (e.g., `infra/*` from `components/*`) — infrastructure should not be a component dep |
| V7 | WARN | Header missing on a file in `components/` (defaults to "depends on all primitives + system"; warns because explicit is better) |
| V8 | WARN | File in `shared-tokens/` declares non-token rules (per S2 §9 contract — S6 audit) |
| V9 | INFO | Header references a primitives file that the bundler auto-injects anyway (cosmetic, not actionable) |

### 4.5 Source of truth + audit artifact

- **Source-of-truth:** per-file `@ts-deps:` headers (Architect/Pragmatist/Critic over Skeptic in council). Decentralized. Edited alongside the block CSS.
- **Audit artifact:** `dist/_cascade-order.txt` (R5 from synthesis) emitted by bundler. Lists the full concat order, one file per line. Human-readable. Grep-able. Skeptic's "one place to look" satisfied at audit-time. Source remains decentralized for sub-agent ergonomics.

---

## 5. Build script architecture — `tools/build/bundle-css.js`

### 5.1 Constraints

- **Self-contained Node script.** No webpack, no Vite, no esbuild, no PostCSS runtime, no Rollup. Plain Node (≥18) standard library only. Reasoning: minimize the dep surface of `tools/build/` (Rule 13's spirit applies even to build-time tooling — fewer transitive deps = fewer supply chain risks; reproducible across years).
- **Plain JS** (`.js` not `.ts`). No TypeScript compile step. Type hints via JSDoc are allowed.
- **No `package.json` dependencies** for `bundle-css.js` itself. The script's only sibling Node folder with deps is `tools/color-engine/` (S1's apcach work, build-time only).
- **Idempotent.** Running twice produces byte-identical `dist/` outputs.
- **Deterministic.** Topo-sort tiebreaker = alphabetical file stem.

### 5.2 Sequence of operations

```
1. Print banner with timestamp + git SHA (if git is reachable; soft-fail if not).
2. Invoke S1's tools/color-engine/generate-colors.js (if its output is stale or absent).
   - `node tools/color-engine/generate-colors.js` (forked process)
   - This writes assets/css/next/primitives/colors.css AND tools/color-engine/colors-contrast-report.md
3. Read all .css files under assets/css/next/ via fs.readdir recursive.
4. Call parse-deps.js for each → collect Block[].
5. Build graph via parse-deps.buildGraph.
6. Validate via parse-deps.validateDeps. If any FAIL severity: abort, exit 1, print diagnostics.
7. Topo-sort. If cycle and no break annotation justifies: abort, exit 1.
8. Compute emit order:
   a. Fixed prelude: primitives in order (colors → spacing → typography → radius → motion).
   b. System layer in order (surfaces → text → states → reset).
   c. shared-tokens/* alphabetical.
   d. utilities/* alphabetical.
   e. components/* in topo-sorted order, alphabetical tiebreaker.
   f. infra/* alphabetical (last).
9. Concatenate (byte-for-byte, no minification, no reordering of rules within a file).
10. Emit dist/toolskin.css with the concatenated content. Prepend banner comment with sources + version.
11. Run minimal regex minifier → dist/toolskin.min.css.
12. For each block in components/ (and other tiers, opt-in), emit dist/blocks/<block>.css containing JUST that block's CSS plus the @ts-deps header (consumer can chain its own load order). DO NOT inline deps — consumer is responsible per consumer-modes docs.
13. Emit dist/_cascade-order.txt — one filepath per line.
14. Emit dist/_dep-graph.json — { nodes: [...], edges: [...] }, debug only.
15. Copy/transform JS sources (assets/js/next/**) into dist/toolskin.js + dist/toolskin.min.js. Concat by manifest order (engines, asset-loader, UIKit, runtime). See §10 for infra concat.
16. (If Path A enabled per S1 §9) Emit dist/toolskin.full.min.js with bundled apcach subset.
17. Copy tools/color-engine/colors-contrast-report.md → dist/colors-contrast-report.md.
18. Re-render dist/README.md from a template (consumer modes docs).
19. Exit 0 with summary.
```

### 5.3 Byte-for-byte preservation (Point 8 of A1 LOCKED)

- The bundler does NOT optimize selector specificity.
- The bundler does NOT reorder rules within a file.
- The bundler does NOT remove comments (except in `.min.css`, where a regex strips `/* ... */` blocks that don't carry `@ts-deps:` or `@taxonomy_*` docstring contracts).
- The bundler DOES preserve `/* @ts-deps: ... */` headers in `dist/toolskin.css` (commented and prefixed with block path) so dist consumers can trace origin.
- The bundler DOES preserve `@taxonomy_*` docstrings (Rule 9 design contract carriers).

### 5.4 Minifier policy (regex-based, no external dep)

Minimal regex passes (in order):
1. Strip block comments `/* ... */` EXCEPT those starting with `/* @ts-deps:` or `/* @taxonomy_`.
2. Strip line comments `// ...` (rare in CSS but possible after preprocessor leak).
3. Collapse runs of whitespace to single space.
4. Strip whitespace around `{}`, `:`, `;`, `,`.
5. Strip trailing `;` before `}`.
6. Strip surrounding whitespace from custom property values (`--ts-x: 1.5rem ;` → `--ts-x:1.5rem`).

No tree-shaking. No selector merging. No vendor prefix stripping (Toolskin uses none anyway). No source maps in v2 (no consumer demand; can add later if needed).

### 5.5 Output deterministic banner

Each emitted file gets a top banner:

```css
/* Toolskin v<semver> — autogenerated
 * Built: <ISO8601 timestamp>
 * Source: <git SHA or "no-git">
 * Cascade order: see dist/_cascade-order.txt
 * Source-of-truth: per-block @ts-deps headers in assets/css/next/**\/*.css
 *
 * DO NOT EDIT BY HAND. Regenerate via: node tools/build/bundle-css.js
 */
```

### 5.6 Pseudocode skeleton (illustrative — not the implementation)

```js
// tools/build/bundle-css.js — illustrative pseudocode
import fs from 'node:fs/promises';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { parseDeps, readAllBlocks, buildGraph, topoSort, validateDeps } from './parse-deps.js';

const ROOT = 'assets/css/next';
const DIST = 'dist';

async function main() {
  printBanner();
  await runColorEngine();              // step 2

  const blocks = await readAllBlocks(ROOT);             // step 3-4
  const graph = buildGraph(blocks);                     // step 5

  const validation = validateDeps(blocks, graph);
  if (validation.errors.length > 0) {
    console.error(formatDiagnostics(validation));
    process.exit(1);
  }

  const topo = topoSort(graph);
  if (topo.cycles.length > 0 && !cyclesAllJustified(topo.cycles, blocks)) {
    console.error('Unjustified cycles:', topo.cycles);
    process.exit(1);
  }

  const order = computeEmitOrder(blocks, topo);          // step 8
  await emitConcat(order, blocks);                       // steps 9-11
  await emitPerBlock(blocks);                            // step 12
  await emitAuditArtifacts(order, graph);                // steps 13-14
  await emitJsBundles();                                 // step 15-16
  await copyContrastReport();                            // step 17
  await renderReadme();                                  // step 18

  console.log('Build complete.');
}

main().catch(e => { console.error(e); process.exit(1); });
```

---

## 6. Circular dependency policy

### 6.1 Primary mechanism: `shared-tokens/` layer (R3)

S2 §9 designs this layer. S4 honors:
- `shared-tokens/<topic>.css` files load BETWEEN system and components (cascade row 10).
- Each shared-tokens file declares ONLY `--ts-shared-*` custom properties at `:root` (no rules).
- A token belongs in `shared-tokens/` iff: (a) used by 2+ component families, (b) declarative-only (no rules), (c) removing it creates a topo-sort cycle.
- Bundler treats `shared-tokens/*` as a tier between system and components — alphabetical order within the tier is deterministic.

### 6.2 Fallback escape hatch: `@ts-cycle-break:` annotation

If a true mutual reference is architecturally inevitable (S2 recommends against this; prefer shared-tokens/), the second line of a CSS file may declare:

```css
/* @ts-deps: primitives/colors, components/chip */
/* @ts-cycle-break: --ts-shared-chip-edge-gap */
.ts-chips { ... }
```

The annotation explicitly names the token whose mutual reference is allowed. The hook checks:
- The cycle must contain the named token's declaring file.
- All blocks in the cycle must declare matching `@ts-cycle-break:` for the same token (consensus).
- The annotation is logged in `dist/_dep-graph.json` for owner audit.

### 6.3 When the policy fires (T1 §6 / chips strip)

- T1 §6 chips strip + chip atomic: chip-strip composes chip atomics; chip atomics use `--ts-shared-strip-gap` (declared in `shared-tokens/strip-layout.css`).
- No cycle: `chip.css` and `chip-strip.css` both depend on `shared-tokens/strip-layout.css`. They do NOT depend on each other.
- Layout works because `shared-tokens/strip-layout.css` is shared infrastructure.

### 6.4 S4 recommendation on the escape hatch

**Avoid `@ts-cycle-break:` unless owner explicitly approves.** Per S2 §9.6, the policy is: HALT and surface to owner per Rule 11 rather than declare a cycle break. The mechanism exists for unforeseen cases. Initial Sessions 2-3 introduce zero cycle-break annotations; if Sessions 4+ encounter a forced cycle, owner reviews and decides whether to refactor into `shared-tokens/` or accept a documented break.

---

## 7. Pre-commit hook validation module — `tools/build/precommit-validate.js`

### 7.1 Ownership split

- **S6 owns the hook script** at `.git/hooks/pre-commit` — a bash script that invokes Node validators and handles exit codes / commit message rules.
- **S4 owns the validator module** at `tools/build/precommit-validate.js` — Node script invoked by S6's hook.

Both share `tools/build/parse-deps.js` (§4.3) so they speak the same dep graph.

### 7.2 Module API

```
// CLI usage: node tools/build/precommit-validate.js [--staged "<file-list>"] [--full]

// Programmatic exports:

parseDeps(filePath) -> { deps: string[], cycleBreaks: string[], blockName, layer }

topoSort(blocks) -> { order: string[] } | { cycle: string[][] }
  // Returns either { order } or { cycle }; not both.

diffSandboxVsBundlerOrder(sandboxIndexHtmlPath: string, blockName: string) -> {
  sandbox: string[],          // <link> hrefs from sandbox/<tier>/<block>/index.html, in order
  bundler: string[],          // bundler's topo-emit order, scoped to the block's transitive deps
  diff: string[],             // unified diff lines; empty array means match
}

validate(stagedFiles: string[]) -> {
  errors: Diagnostic[],
  warnings: Diagnostic[],
}

// Diagnostic shape:
//   { severity: 'FAIL'|'WARN', code: 'V1'..'V9', file, line, message }
```

### 7.3 Validation rules executed (in order)

1. **V-PARSE:** every staged CSS file in `assets/css/next/` parses cleanly (header detectable, deps resolvable).
2. **V-TOPO:** repo-wide topo-sort terminates (no cycles, OR cycles fully justified by `@ts-cycle-break:`).
3. **V-DEPS:** every `@ts-deps:` identifier resolves to an existing file.
4. **V-SANDBOX-DIFF:** for each sandbox `index.html` whose block CSS is staged, the sandbox's `<link>` order matches the bundler's transitive emit order. Mismatch = FAIL with unified diff.
5. **V-DIST-SYNC:** if `assets/css/next/**/*.css` is staged but `dist/toolskin.css` is NOT staged (or NOT up-to-date), FAIL. Forces `npm run build` discipline.
6. **V-NO-IMPORTANT:** no new `!important` declarations in `assets/css/next/**/*.css` (S6 also enforces; double-check here for resilience).
7. **V-SHARED-TOKENS:** files in `shared-tokens/` contain only token declarations (no rules) — per S2 §9 contract.
8. **V-INFRA-NO-COMPONENT-DEP:** files in `infra/` do not have `components/*` deps (infra is below components conceptually; A5/D7 rule).
9. **V-RELEASE-MODE:** if commit message contains `release:` tag, additionally check `dist/_cascade-order.txt` is regenerated.

### 7.4 Diagnostic format

```
[FAIL] V-SANDBOX-DIFF in sandbox/02-molecular/card/index.html
  Sandbox <link> order:
    1. ../../../assets/css/next/components/button.css
    2. ../../../assets/css/next/components/card.css
  Bundler emit order:
    1. ../../../assets/css/next/components/button.css
    2. ../../../assets/css/next/components/icon.css        <-- missing in sandbox
    3. ../../../assets/css/next/components/card.css
  Action: add <link> for components/icon.css before card.css in the sandbox index.html.
```

Color: red for FAIL, yellow for WARN, dim grey for INFO. Plain ASCII fallback if TTY doesn't support color (e.g., when run by hook in non-interactive shell).

### 7.5 Exit codes

- `0` — all checks pass.
- `1` — one or more FAIL diagnostics.
- `2` — module crashed (parse-deps threw). The wrapper hook treats this same as 1 (commit blocked) but distinguishes for debug.

### 7.6 Hook integration contract (S6's wrapper script — S4 specifies the interface)

S6's bash wrapper:

```bash
#!/usr/bin/env bash
# .git/hooks/pre-commit (S6 owns; S4 specifies the contract for the Node call)

STAGED_FILES=$(git diff --staged --name-only --diff-filter=ACM)

# Commit-message rule (S6's domain, not S4)
# ...

# S4's validator
node tools/build/precommit-validate.js --staged "$STAGED_FILES"
RESULT=$?

if [ $RESULT -ne 0 ]; then
  echo "Commit blocked by precommit-validate.js. See diagnostics above."
  exit 1
fi

exit 0
```

S4 provides nothing else for the hook beyond the Node entry point + diagnostic format.

---

## 8. CDN publishing

### 8.1 npm package layout (Rule 13 binding — zero runtime deps)

```
toolskin@1.0.0 (npm package contents)
├── dist/
│   ├── toolskin.css
│   ├── toolskin.min.css
│   ├── toolskin.js
│   ├── toolskin.min.js
│   ├── toolskin.full.min.js
│   ├── blocks/<block>.css        (per-block files, opt-in)
│   ├── _cascade-order.txt
│   ├── _dep-graph.json
│   ├── colors-contrast-report.md
│   └── README.md
├── package.json
├── README.md                     (repo-root README, brief consumer modes pointer)
└── LICENSE                       (MIT)
```

**The npm package contains ONLY `dist/`. No `src/`, no `node_modules`, no `tools/`, no `sandbox/`, no `assets/`.** This honors Rule 13: consumer installs zero transitive deps and ships zero Node-compilable artifacts.

### 8.2 `package.json` content

```json
{
  "name": "toolskin",
  "version": "1.0.0",
  "description": "Token-driven, framework-independent CSS design system with APCA-verified colors via apcach.",
  "main": "dist/toolskin.min.js",
  "style": "dist/toolskin.min.css",
  "files": [
    "dist/",
    "README.md",
    "LICENSE"
  ],
  "exports": {
    ".": {
      "import": "./dist/toolskin.js",
      "require": "./dist/toolskin.js",
      "style": "./dist/toolskin.min.css"
    },
    "./css": "./dist/toolskin.min.css",
    "./js": "./dist/toolskin.min.js",
    "./full": "./dist/toolskin.full.min.js",
    "./blocks/*": "./dist/blocks/*.css"
  },
  "keywords": ["design-system", "css", "tokens", "apca", "oklch", "wordpress", "framework-agnostic"],
  "license": "MIT",
  "homepage": "https://github.com/<owner>/toolskin",
  "repository": {
    "type": "git",
    "url": "https://github.com/<owner>/toolskin.git"
  }
}
```

**No `dependencies` field.** No `devDependencies` either — the package ships zero Node code that needs them. The repo's `tools/color-engine/package.json` (apcach) and `tools/build/package.json` (none, ideally) are SEPARATE from the published npm package.

### 8.3 CDN paths

- **jsdelivr (default, fastest globally):**
  - `https://cdn.jsdelivr.net/npm/toolskin@1/dist/toolskin.min.css`
  - `https://cdn.jsdelivr.net/npm/toolskin@1/dist/toolskin.min.js`
  - `https://cdn.jsdelivr.net/npm/toolskin@1/dist/toolskin.full.min.js`
  - `https://cdn.jsdelivr.net/npm/toolskin@1/dist/blocks/<block>.css` (per-block)
- **unpkg (fallback / alt CDN):**
  - `https://unpkg.com/toolskin@1/dist/toolskin.min.css`
  - `https://unpkg.com/toolskin@1/dist/toolskin.min.js`

### 8.4 Versioning

- **Recommended consumer reference:** `@1` (semver major pin).
- **Discouraged:** `@latest` (matches the FA6→FA7 lesson from old CLAUDE.md §5b).
- **Major version bumps** = breaking changes. Patch/minor = backward compatible.

### 8.5 Publish workflow

Owner-driven, manual (no CI in v1):

```
1. node tools/build/bundle-css.js              # regenerate dist/
2. git diff dist/                              # owner reviews
3. git commit -am "release: v1.x.y - <reason>" # commit source + dist together
4. npm version <patch|minor|major>             # bumps package.json + tags
5. npm publish --access public                 # ships to npm registry
6. git push --tags                             # ships tag to GitHub
```

jsdelivr + unpkg auto-mirror from npm within minutes. No additional publish step.

---

## 9. WordPress plugin wrapper — `toolskin-wp/`

### 9.1 Owner decision (Gate 5 / deferred)

Per T3 §10.4 + queue brief: owner decides at Gate 5 whether the WordPress plugin ships in v2.0 or post-v2.0. S4 specs the contract regardless. Plugin lives in a separate folder (`toolskin-wp/`) or separate repo, NOT in the main `toolskin/` npm package.

### 9.2 Plugin layout

```
toolskin-wp/
├── toolskin-wp.php           # main plugin file
├── readme.txt                # WP.org plugin readme format
├── admin/
│   └── options-page.php      # accent hue picker in WP admin
├── inc/
│   └── enqueue.php           # CDN enqueue logic
└── README.md
```

### 9.3 Main plugin file (`toolskin-wp.php`) — sketch

```php
<?php
/**
 * Plugin Name:       Toolskin
 * Description:       Token-driven CSS design system. Enqueues Toolskin from jsdelivr CDN.
 * Version:           1.0.0
 * Author:            Satoshi / SatSea
 * License:           MIT
 * Text Domain:       toolskin
 */

if (!defined('ABSPATH')) exit;

define('TOOLSKIN_CDN_BASE', 'https://cdn.jsdelivr.net/npm/toolskin@1/dist');

function toolskin_enqueue() {
    $accent = get_option('toolskin_accent', '#ff5500');
    $theme = get_option('toolskin_theme', 'dark');

    wp_enqueue_style(
        'toolskin',
        TOOLSKIN_CDN_BASE . '/toolskin.min.css',
        [],
        '1.0.0'
    );
    wp_enqueue_script(
        'toolskin',
        TOOLSKIN_CDN_BASE . '/toolskin.min.js',
        [],
        '1.0.0',
        true
    );
    wp_add_inline_script(
        'toolskin',
        'window.__TOOLSKIN_CONFIG__ = ' . wp_json_encode([
            'accent' => $accent,
            'theme'  => $theme,
        ]) . ';',
        'before'
    );
}
add_action('wp_enqueue_scripts', 'toolskin_enqueue');
add_action('enqueue_block_editor_assets', 'toolskin_enqueue');  // Gutenberg parity per T3 §10.6

require_once __DIR__ . '/admin/options-page.php';
```

### 9.4 Admin options page

Single-page settings under "Settings → Toolskin":
- **Accent hue** — text input + color picker. Saved as `toolskin_accent` option.
- **Theme** — radio: dark / light / auto. Saved as `toolskin_theme` option.
- **CSS source** — radio: CDN / self-hosted (post-v2 enhancement). Default CDN.

### 9.5 Self-hosted path (post-v2)

If owner decides v2.0 ships self-hosted option:
- Plugin bundles `dist/toolskin.min.css` + `dist/toolskin.min.js` in `toolskin-wp/dist/`.
- Settings toggle switches `TOOLSKIN_CDN_BASE` to `plugins_url('dist', __FILE__)`.
- File size: ~150 KB total. Negligible plugin size.

### 9.6 WordPress block editor (Gutenberg) parity

Per T3 §10.6: Gutenberg's editor iframe is a separate DOM. The plugin enqueues into BOTH frontend (`wp_enqueue_scripts`) AND editor iframe (`enqueue_block_editor_assets`). Plugin author writes once; consumer sees the same Toolskin styles in editor and frontend.

---

## 10. Infrastructure category (A5 / D7) — separate from blocks

### 10.1 Definition

Per T1 §8.4 + Gate 4 D7 LOCK: "infrastructure" is the runtime substrate that engines operate on. NOT part of the 128 blocks. Separate sandbox folder. Separate bundle target (lands in `dist/toolskin.js`, not `dist/toolskin.css`).

### 10.2 Folder structure

```
sandbox/
├── infra/                       # NEW — outside 00-03 block tiers
│   ├── animation-engine/
│   │   └── index.html           # sandbox for animation observer
│   ├── theme-toggle-impl/
│   │   └── index.html
│   ├── asset-loader/
│   │   └── index.html
│   ├── modal-lock-impl/
│   │   └── index.html
│   ├── scroll-engine/
│   │   └── index.html           # Lenis integration if retained
│   └── observer-helpers/
│       └── index.html

assets/
├── js/
│   └── next/
│       ├── toolskin.core.js     # boot, Toolskin namespace, setAccent/setTheme
│       ├── infra/
│       │   ├── animation-engine.js
│       │   ├── theme-toggle-impl.js
│       │   ├── asset-loader.js
│       │   ├── modal-lock-impl.js
│       │   ├── scroll-engine.js
│       │   ├── observer-helpers.js
│       │   └── marquee-engine.js          # A8 LOCKED — see §11
│       ├── components/
│       │   ├── button.js                  # if needed; many blocks are CSS-only
│       │   └── ... (per block, if any)
│       └── toolskin-uikit.js              # UIKit aggregator
└── css/
    └── next/
        └── infra/
            └── *.css                       # rare; most infra is JS-only
```

### 10.3 Bundle target — `dist/toolskin.js`

The JS bundle concatenates in this order (S4-locked manifest):

```
1. assets/js/next/toolskin.core.js                 # boot, Toolskin namespace
2. assets/js/next/infra/asset-loader.js            # FA/Ionicons/etc. dynamic loader
3. assets/js/next/infra/theme-toggle-impl.js
4. assets/js/next/infra/animation-engine.js
5. assets/js/next/infra/observer-helpers.js
6. assets/js/next/infra/scroll-engine.js
7. assets/js/next/infra/modal-lock-impl.js
8. assets/js/next/infra/marquee-engine.js
9. assets/js/next/components/*.js                  # per-block JS, alphabetical
10. assets/js/next/toolskin-uikit.js               # UIKit (last; opt-in via separate <script> in some scenarios but bundled in core for default consumer experience)
```

Each infra `.js` file may declare its own `// @ts-deps: infra/asset-loader` header (parsed by `parse-deps.js` with `--js` mode). For initial v2.0, JS deps are simpler than CSS deps — most infra modules attach to the global `Toolskin` namespace and have linear order.

### 10.4 Why infra is NOT part of the 128 blocks

- Infra modules have NO visual surface of their own (they manipulate other components' surfaces).
- Infra modules have NO tier in the PERMISSIVE/STRICT/ALWAYS STRICT autonomy ladder (S5). Owner approves every infra commit as a rule — infra changes have site-wide blast radius.
- Infra modules don't compose into other blocks; other blocks consume infra services (Toolskin.observer, Toolskin.scroll, Toolskin.lockBodyScroll).

### 10.5 S5 protocol implication

S5 receives no infra tier assignment. Infra work in Sessions 4+ is owner-driven, NOT autonomous. The S5 protocol explicitly states "infrastructure changes always halt for owner approval, regardless of which block triggered the change."

### 10.6 Per-engine sandboxes

Each infra module gets a `sandbox/infra/<name>/index.html` testing it in isolation. Sandbox-base.html template for infra is structurally similar to T2's block-base but loads only `toolskin.core.js` + the single infra module under test. The sandbox toolbar (theme toggle, accent input) lets the owner verify the infra module respects those signals.

---

## 11. Marquee engine fix (A8 LOCKED + T1 §4.2)

### 11.1 Problem statement (T1 §4.2)

Old `toolskin.css` line 15791 sets `pointer-events: none` on `.ts-marquee-container`. T1 identifies this as a temporary patch hiding an engine-default bug: somewhere in the showcase's `toolskin.js`, hover triggers a pause that the owner did not want for marquees.

### 11.2 Root cause (surveyed in `../toolskin-showcase/assets/js/toolskin.js`)

At line 2620 of the showcase JS:

```js
this.pauseOnHover = el.dataset.pauseHover !== 'false';
```

Default is TRUE; users must opt OUT via `data-pause-hover="false"`. The owner's patch (`pointer-events: none` on the CSS side) is fighting the JS default — neither approach makes the canonical marquee pattern (Rule 3 exemplar) clean.

### 11.3 Fix (coordinated CSS + JS change, Session 4+ marquee sandbox)

**JS side** (`assets/js/next/infra/marquee-engine.js`):

```js
// Default OFF: marquees scroll continuously. Opt-in via data-pause-on-hover.
this.pauseOnHover = el.dataset.pauseOnHover === 'true' || el.dataset.pauseOnHover === '';
```

Convention change:
- OLD: `data-pause-hover="false"` to disable.
- NEW: `data-pause-on-hover` (present, no value, or `="true"`) to enable.

Default behavior matches Rule 3's "marquee is a stream — never pauses, never blinks."

**CSS side** (`assets/css/next/components/marquee.css`):

Remove `pointer-events: none` from `.ts-marquee-container`. Marquee text becomes selectable/clickable again (matches Rule 5 / accessibility — anchor tags inside marquees should be clickable).

### 11.4 Engine-default principle

The marquee fix establishes a broader principle for `infra/` defaults:

> **Engine defaults must align with the canonical pattern's design intent.** If the canonical pattern (Rule 3 exemplar) requires an opt-IN for a behavior, the engine default is OFF. Owners who want the opt-in behavior add a `data-*` attribute. No CSS patches required to fight the engine.

Applied to other engines:
- Animation engine: default scroll-triggered animations run once per element. Replay = opt-in via `data-replay`.
- Theme toggle: default respects `prefers-color-scheme`. Override = opt-in via `data-theme="dark"` or `="light"` on `<html>`.
- Modal lock: default locks body scroll when modal opens. Unlock = opt-in via `data-no-scroll-lock`.

S4 documents these defaults as part of the infra bundle spec; Session 4+ infra sandboxes implement them.

### 11.5 Coordination with Session 4+ marquee sandbox

When the marquee block-spec lands (Session 4+):
- The block-spec.md notes the engine-default change as a coordinated commit.
- The marquee sandbox's `index.html` validates: hover does NOT pause by default; opt-in via `data-pause-on-hover` DOES pause.
- Pre-commit hook + parity rig confirm visual + behavioral regression-free.

---

## 12. Skeptic fallback — standalone manifest alternative

Per Wave 1 synthesis §6 dissenting view (preserved): if owner at Gate 5 reviews S4's spec and finds `@ts-deps:` header convention too "custom DSL," fall back to:

### 12.1 Alternative: single `_cascade-manifest.txt`

```
# assets/css/next/_cascade-manifest.txt
# Source-of-truth for build order. Hand-edited.
primitives/colors.css
primitives/spacing.css
primitives/typography.css
primitives/radius.css
primitives/motion.css
system/surfaces.css
system/text.css
system/states.css
system/reset.css
shared-tokens/strip-layout.css
shared-tokens/menu-popover.css
utilities/layout.css
components/button.css
components/icon.css
components/chip.css
components/card.css
...
infra/preloader.css
```

### 12.2 Trade-offs vs `@ts-deps:` headers

| Aspect | `@ts-deps:` headers | `_cascade-manifest.txt` |
|---|---|---|
| Source-of-truth location | Decentralized (per-file) | Centralized (one file) |
| Cycle detection | Automatic (topo-sort) | Manual (author orders correctly) |
| Per-block tree-shake | Possible (deps known per block) | Hard (no dep graph) |
| Drift risk | One file out of sync = visible diagnostic | One forgotten line = silent breakage |
| Sub-agent ergonomics | Dep info next to code | Round-trip to manifest |
| Skeptic concern | Custom DSL | Standard file format |
| Hook complexity | Higher (parse headers, build graph) | Lower (read manifest, compare staged-vs-manifest order) |

### 12.3 Recommendation

S4 recommends `@ts-deps:` headers (LOCKED by owner per A1 resolution Q1). Skeptic fallback is **documented but not adopted**. If a future session demonstrates that headers are unreliable in practice (Sessions 4-10 retro), owner may re-open the question and migrate to the manifest fallback. The fallback exists as an architectural escape hatch; not currently invoked.

---

## 13. Rule 1 + Rule 13 compliance audit

### 13.1 Rule 1 — "One stylesheet"

- **Single shipped stylesheet:** `dist/toolskin.css` (or `dist/toolskin.min.css`). All blocks, all primitives, all system tokens concatenated.
- **Per-block files exist** but per A1 LOCKED Q2 + Wave 1 synthesis R6, single-file is the canonical default. Per-block is opt-in for advanced consumers, NOT the headline.
- **AI artifacts, WordPress, Vue, React all default to:** `<link rel="stylesheet" href="dist/toolskin.css">`. One file. Zero config.
- **Rule 1 compliance:** ✅ The "one stylesheet" promise holds.

### 13.2 Rule 13 — "No Node.js runtime deps in shipped product"

- **Build-time Node:** `tools/build/bundle-css.js` runs at build, never at consumer runtime.
- **Build-time apcach:** `tools/color-engine/generate-colors.js` runs at build. Its output is baked into `assets/css/next/primitives/colors.css`. Consumer never sees apcach.
- **Optional runtime apcach:** S1 §9 Path A bundles a 25-30 KB apcach subset into `dist/toolskin.full.min.js`. This is OPT-IN — most consumers use `dist/toolskin.min.js` (~80 KB, no apcach runtime). Per S1's hybrid recommendation, the runtime variant is a separate file consumers opt into.
- **dist/ committed to repo:** A CSS-only contributor (no Node installed) clones the repo, edits `assets/css/next/components/button.css`, and CAN'T regenerate `dist/`. The pre-commit hook (V-DIST-SYNC) catches this. BUT the contributor can ALSO update `dist/toolskin.css` manually (it's just concatenation) using the audit artifact `dist/_cascade-order.txt` as the order spec. This is unusual but legal.
- **Rule 13 compliance:** ✅ Consumer runs zero Node. Optional runtime apcach is OPT-IN, not default. Build tooling stays in `tools/`.

### 13.3 Rule 5 — "Drop-in"

- AI artifact: `<link>` + `<script>` from jsdelivr CDN. Works.
- WordPress: plugin enqueues 2 URLs. Works.
- Static HTML: same as AI. Works.
- Vue/React: npm install + import CSS. Works.
- WordPress block theme: same as WP plugin. Works.
- Tailwind co-existence: `.ts-*` namespace prevents collisions. Works.

All 6 T3 integration targets ship from `dist/toolskin.css` + `dist/toolskin.min.js`. **Rule 5 compliance: ✅**

### 13.4 Rule 14 — "Fresh git history"

- Build pipeline does NOT pull or merge from the old `toolskin-showcase/` repo. No git ops against the reference.
- All bundler inputs are relative paths inside `toolskin-rebuild/`. Reference reads (for marquee engine logic survey, §11.2) are read-only via `../toolskin-showcase/` relative path. No staging.
- **Rule 14 compliance:** ✅

---

## 14. Test fixtures (inline — actual files land Session 2+)

Three mock blocks demonstrate the bundler's behavior. The fixtures are markdown content here; Session 2+ converts them to real test fixtures in a `tools/build/__fixtures__/` directory.

### 14.1 Fixture 1 — Simple topo-sort (button → card)

```css
/* __fixtures__/components/button.css */
/* @ts-deps: primitives/colors, primitives/spacing, system/surfaces, system/text, system/states */
.ts-btn { padding: var(--ts-sp-2); background: var(--ts-this-bg); }
```

```css
/* __fixtures__/components/card.css */
/* @ts-deps: primitives/colors, primitives/spacing, system/surfaces, components/button */
.ts-card { padding: var(--ts-sp-4); }
.ts-card .ts-btn { margin-top: var(--ts-sp-2); }
```

**Expected bundler emit order** (after primitives + system, which load first by tier):

```
primitives/colors.css
primitives/spacing.css
...
system/surfaces.css
system/text.css
system/states.css
button.css
card.css
```

card depends on button → card comes after button. ✅

### 14.2 Fixture 2 — Per-block emission

For the same fixture, bundler ALSO emits:

```
dist/blocks/button.css      # just button.css contents + its @ts-deps header preserved
dist/blocks/card.css        # just card.css contents + its @ts-deps header preserved
```

Consumer using per-block files imports in dep order (using `_cascade-order.txt` as reference):

```js
import 'toolskin/dist/blocks/primitives.colors.css';
import 'toolskin/dist/blocks/primitives.spacing.css';
// ... (manual)
import 'toolskin/dist/blocks/button.css';
import 'toolskin/dist/blocks/card.css';
```

### 14.3 Fixture 3 — Cycle detection

```css
/* __fixtures__/components/foo.css */
/* @ts-deps: components/bar */
.ts-foo { ... }
```

```css
/* __fixtures__/components/bar.css */
/* @ts-deps: components/foo */
.ts-bar { ... }
```

**Expected behavior:** Bundler aborts with:

```
[FAIL] V-TOPO: dependency cycle detected
  Cycle: components/foo -> components/bar -> components/foo
  Action: introduce a shared-tokens/ file containing the common token,
          or add `/* @ts-cycle-break: <token> */` annotation to both files
          if the cycle is intentional.
```

Bundler exit code 1. No `dist/` written.

### 14.4 Fixture 4 (added scenario) — sandbox-vs-bundler order mismatch

Same fixtures 1+2. But the sandbox `index.html` for card has:

```html
<link rel="stylesheet" href="../../../assets/css/next/components/card.css">
<!-- Missing button.css! -->
```

**Expected hook behavior:** `precommit-validate.js` runs `diffSandboxVsBundlerOrder('sandbox/02-molecular/card/index.html', 'card')`:

```
[FAIL] V-SANDBOX-DIFF in sandbox/02-molecular/card/index.html
  Sandbox <link> order (last 2):
    1. ../../../assets/css/next/components/card.css
  Bundler emit order (transitive deps of card):
    1. ../../../assets/css/next/components/button.css
    2. ../../../assets/css/next/components/card.css
  Missing: <link rel="stylesheet" href="../../../assets/css/next/components/button.css"> before card.css
```

Commit blocked. ✅

---

## 15. Migration plan from T1 typology

### 15.1 The 128 component families → block files

Each of T1's ~128 component families becomes ONE file in `assets/css/next/components/<block>.css`:
- 44 atomic blocks → 44 files (alphabetical)
- 49 molecular blocks → 49 files
- 35 layout blocks → 35 files

UIKit `ts-ui-*` families collapse into their parent file when they're aliases (per A6, S3's resolution) OR get their own file when they're distinct components (e.g., `ts-ui-select` is distinct from `ts-select` — separate files). S3's registry deliverable resolves the exact split.

### 15.2 Per-block `@ts-deps:` headers — initial seed

S3's first 5 sketch block-specs include `@ts-deps:` headers as part of the block-spec contract. Subsequent Sessions 4+ blocks add headers as they author each block file.

Typical header patterns:

| Block tier | Typical deps |
|---|---|
| Atomic (button, input, chip) | `primitives/*`, `system/surfaces`, `system/text`, `system/states` |
| Atomic with shared layout (chip, table-cell) | + `shared-tokens/<topic>` |
| Molecular (card, modal, accordion) | + `components/<atomic1>`, `components/<atomic2>` |
| Layout (section, hero, grid) | + `components/<molecular1>`, `utilities/*` |

### 15.3 No retroactive header authoring (Session 1 has zero CSS)

Session 1 produces specs only. No CSS file in `assets/css/next/` exists yet. The migration plan is **forward-only**: as each block lands in Sessions 4+, the block author writes `@ts-deps:` from scratch following the convention in §4.

### 15.4 S3 registry consumes this

S3's `_rebuild-component-registry.md` (forthcoming, Wave 2.3 parallel sibling) classifies each of T1's 128 families and produces per-block contracts. The `@ts-deps:` header for each block lives in S3's registry initially as part of the contract; Sessions 4+ authors paste it into the actual CSS file.

### 15.5 UIKit aliasing — A6

If a `ts-ui-select` is genuinely distinct from `ts-select` (different markup, different JS controller), it gets its own file `components/select-ui.css` with its own `@ts-deps:`. If it's a pure alias (`ts-ui-select` selector reuses `ts-select` rules), it merges into the parent file with a documented `@ts-aliases: ts-select` comment.

---

## 16. Open questions + gaps

| # | Topic | Status | Resolution route |
|---|---|---|---|
| OQ1 | Should `@ts-deps:` headers in primitives/system files be required, or implicit (auto-injected by bundler)? | DECIDED §4.1 — primitives/system always loaded by bundler in fixed prelude order; headers optional in those tiers, required in components/ and shared-tokens/. | — |
| OQ2 | When does the bundler run? Per-commit (CI hook) vs owner-tagged release? | DOCUMENTED §8.5 — owner-tagged release; pre-commit hook validates source vs `dist/` (V-DIST-SYNC) but does NOT auto-build. | S6 enforces. |
| OQ3 | Should `dist/toolskin.min.js` include the apcach runtime by default, or only `dist/toolskin.full.min.js`? | OPEN — S1 §9 picks "default no apcach runtime"; S4 honors. Gate 5 owner ratifies. | Gate 5. |
| OQ4 | What happens if a consumer loads `dist/blocks/<block>.css` without primitives? | DOCUMENTED §2.5 (consumer-modes README) — consumer must load primitives first OR import `dist/toolskin.css` (single file). | docs. |
| OQ5 | Does the per-block file in `dist/blocks/` include its `@ts-deps:` header? | YES (§5.3) — preserved for consumer traceability. Bundler does NOT inline deps; consumer is responsible for load order. | — |
| OQ6 | Source map output? | NO for v2.0. Add if consumer demand. | Future. |
| OQ7 | CI integration (GitHub Actions)? | OPTIONAL — not specified by S4. Owner can add a `.github/workflows/build.yml` that runs `node tools/build/bundle-css.js` and verifies `dist/` matches committed. Post-v2.0. | Future. |
| OQ8 | Should `tools/build/` have its own `package.json`? | NO ideally — keep zero-dep. If a tiny utility must be installed (unlikely), document explicitly. | — |
| OQ9 | What if `tools/build/bundle-css.js` itself crashes (parse-deps throws unexpectedly)? | Bundler exit code 2 (script crash, distinct from 1 = validation fail). Hook treats 2 same as 1 (commit blocked). | §7.5 |
| OQ10 | How does S4's bundler handle JS bundling vs CSS? | §10.3 — JS uses a separate manifest (engines + components + uikit), simpler than CSS topo-sort. JS dep declarations via `// @ts-deps:` in `.js` headers, parsed by the same `parse-deps.js` module in `--js` mode. | — |
| OQ11 | When the marquee engine fix lands (§11), how is the old `data-pause-hover="false"` syntax migrated? | DOCUMENTED §11.3 — Session 4+ marquee sandbox handles. S4 doesn't write migration code; the sandbox commit does. Consumer docs note the rename in the v2 migration guide. | Sessions 4+. |

---

## 17. Contact points

### 17.1 S4 → S3 (Component Registry)

- S4 consumes S3's component classifications to know which blocks are atomic vs molecular vs layout (drives the `components/` topo-sort tier breakdown).
- S4 consumes S3's first 5 sketch block-specs to validate the `@ts-deps:` convention against real block names.
- S3 consumes S4's `@ts-deps:` header format to seed each block-spec's deps field.

### 17.2 S4 → S5 (Autonomous Protocol)

- S5 receives the "infrastructure is non-autonomous" rule (§10.5).
- S5 receives the bundler's exit code spec — sandbox sessions that fail bundler validation can NOT auto-progress (PERMISSIVE tier check #1 = bundler passes).
- S4 receives nothing from S5; bundler is tier-agnostic.

### 17.3 S4 → S6 (Governance + Hooks)

- **Shared parser module:** both call `tools/build/parse-deps.js`. S6 wraps S4's `precommit-validate.js` in a bash hook (§7.6).
- S6's hook script handles non-S4 rules (commit message tags, forbidden paths, `!important` ban).
- S4's `precommit-validate.js` exit code is the source of truth for build-pipeline-domain rules.
- S6's `CONTRIBUTING.md` references S4's `tools/build/` for the "how to ship a release" section.

### 17.4 S4 → S1 (Primitives / apcach)

- S4's bundler invokes S1's `tools/color-engine/generate-colors.js` as step 2 of the build (§5.2).
- S1's output `colors.css` is the first file in the cascade order (§3 row 1).
- S1's audit artifact `colors-contrast-report.md` is copied to `dist/colors-contrast-report.md` by S4's bundler.
- For Path A (S1 §9), S4 bundles a minimal apcach subset into `dist/toolskin.full.min.js`. Default `dist/toolskin.min.js` excludes apcach.

### 17.5 S4 → S2 (System Layer)

- S2 §9 defines the `shared-tokens/` layer. S4 honors the cascade slot (§3 row 10).
- S2 defines the system-layer files (`surfaces.css`, `text.css`, `states.css`, `reset.css`) and their fixed load order (§3 rows 6-9).
- S4's parser module validates `shared-tokens/*` files contain only token declarations (S2 §9 contract enforcement via V-SHARED-TOKENS rule §7.3).

### 17.6 Sessions 4+ block sandboxes

- Every block sandbox session reads the bundler output (or runs the bundler) to verify the block under test composes correctly with its dependencies.
- Sandbox `index.html` (per T2 §3.2 + §6.5) loads `<link>` tags in the order matching `@ts-deps:` headers; hook enforces (§7.3 V-SANDBOX-DIFF).
- The marquee sandbox (Session 4+) coordinates the engine-default fix (§11).

### 17.7 Wave 1.5 — Design DNA Extractor

- Wave 1.5 runs AFTER S4. S4's spec doesn't consume Design DNA content directly.
- S4's bundler preserves `@taxonomy_*` docstrings (Rule 9 contract carriers) — these MAY carry Design DNA semantics. Bundler does NOT minify these.
- Design DNA Extractor's output `_rebuild-design-dna.md` is BINDING for Sessions 4+ block sandbox sessions but does NOT change S4's bundler architecture.

---

## 18. Status

**Spec status:** `READY FOR OWNER GATE 5 REVIEW`

**Deliverables landed in this spec:**
- A1 LOCKED architecture concretely realized (§2)
- Cascade order across pipeline (§3)
- `@ts-deps:` header convention + parser module API (§4)
- Bundler architecture (§5)
- Circular dependency policy (§6)
- Pre-commit validator module API (§7)
- CDN publishing + npm package layout (§8)
- WordPress plugin wrapper (§9)
- Infrastructure category (§10) — A5 LOCK
- Marquee engine fix (§11) — A8 LOCK
- Skeptic fallback documented (§12)
- Rule 1 + Rule 13 + Rule 5 + Rule 14 compliance audit (§13)
- Test fixtures inline (§14)
- Migration plan from T1 typology (§15)

**Open questions surfaced for Gate 5:**
- OQ3: default apcach runtime inclusion (S1 already picked "no by default"; ratify)
- OQ7: CI integration (post-v2.0 acceptable?)
- WordPress plugin v2.0 vs post-v2.0 (Gate 5 owner decision per T3 §10.4)

**Gate 5 expects to see:**
- Bundler script implementation outline (here as pseudocode §5.6)
- Pre-commit hook validation module (API §7, S6 wraps)
- Circular dep policy (§6 — shared-tokens primary, annotation fallback)
- Consumer modes documentation outline (§2.5)
- Migration plan from T1 (§15)

**Sources read (READ-ONLY per file 07):**
- `docs/session-1-bootstrap/01-orchestration-brief-v5.md` (15 RULES)
- `docs/session-1-bootstrap/05-tier-priority-absorption.md` (priority hierarchy)
- `docs/session-1-bootstrap/06-rule-15-apcach-supreme.md` (Rule 15)
- `docs/session-1-bootstrap/07-repo-binding-clarification.md` (isolation)
- `docs/session-1-bootstrap/a1-council-resolution.md` (LOCKED A1)
- `docs/handoffs/_session-1-rebuild-queue.md` (queue + Gate 4 + Gate 4.5 locks)
- `docs/handoffs/_wave-1-synthesis.md` (full, including A1-Council appendix + A1-Resolution appendix)
- `docs/handoffs/_rebuild-block-typology.md` (T1 — tier counts, marquee §4.2, infrastructure §8.4)
- `docs/handoffs/_rebuild-base-context-spec.md` (T2 — CSS load order §3.2, multi-CSS OQ2 §6.5)
- `docs/handoffs/_rebuild-adaptive-integration-spec.md` (T3 — asset loading §6.2-6.4)
- `docs/handoffs/_rebuild-primitives-spec.md` (S1 — build script §7, runtime hook §9)
- `docs/handoffs/_rebuild-system-spec.md` (S2 — shared-tokens layer §9)
- `../toolskin-showcase/assets/js/toolskin.js` (line 2620 marquee pauseOnHover survey, §11.2 — READ ONLY, file 07 honored)

**No writes outside this file.** No edits to `../toolskin-showcase/`, `.claude/`, `assets/`, `sandbox/`, `tools/build/`, `dist/`.

— End of S4 spec —

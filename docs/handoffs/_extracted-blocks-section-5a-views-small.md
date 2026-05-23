# Extracted Blocks Catalog — Section 5a: Views (small / page-compound)

**Sub-agent:** 5a  ·  **Chunk:** views/ small files  ·  **Files:** 3  ·  **Total lines:** 1,775  ·  **Total bytes:** ~44,210

Scope: the three smallest "view" files under `docs/references/toolskin.css_extracted-core-blocks-to-refactor/views/` — page-level / compound view CSS rather than reusable components. Companion to chunks 5b (large views) and 4a/4b (components). Discipline this pass: NORMAL — files were small enough to read in full, but grep was used first to anchor running tallies (`--ts-bg-N`, non-OKLCH literals).

## Files in this chunk

| File | Lines | Bytes | Block type |
|---|---|---|---|
| general-scrollbar-customization(non-mozilla).css | 57 | 1,947 | global utility — webkit-only scrollbar engine (`::-webkit-scrollbar*`) + `.ts-scrollbar-thin` Mozilla utility; consumes `--ts-sb-*` token surface (declared elsewhere) |
| ts-cube-portfolio.css | 673 | 17,756 | **legacy** page-shell — extracted-but-PENDING-INTEGRATION header styles for the 3D cube portfolio reference site (loader, rulers, topbar, sliding sidebar items, page-wipe, detail page, SVG ruler). Owner-flagged "MUST NOT ship with its own dedicated CSS sheet" |
| ts-ui-ide-view-fullview.css | 1,045 | 24,507 | **view-tier composition** — full IDE-emulator demo view (`body.ts-ide-demo` grid shell + titlebar, activity-rail, sidebar, file-tree, editor+tabs+gutter, AI panel, terminal, status bar). The only file in chunk 5a written entirely in CSS Nesting + the modern `--ts-this-bg` derivative protocol |

---

## Special case: `(non-mozilla)` annotation — the Firefox story

The parenthetical `(non-mozilla)` in `general-scrollbar-customization(non-mozilla).css` is an owner self-flag stating **this file deliberately covers ONLY the webkit branch** (`::-webkit-scrollbar`, `::-webkit-scrollbar-thumb`, `::-webkit-scrollbar-track`, `:hover`/`:active` variants). The single concession to Firefox / Mozilla is the bottom utility class `.ts-scrollbar-thin` (L55–58) which uses the standardised CSS properties `scrollbar-width: thin` and `scrollbar-color: var(--ts-bg-4) transparent`.

What the owner did NOT do, and why it matters:

1. **No `scrollbar-width` / `scrollbar-color` at root level.** Firefox's only knobs are the standardised `scrollbar-width: auto | thin | none` and `scrollbar-color: <thumb> <track>` properties — Firefox does NOT support `::-webkit-scrollbar*` pseudos. As a result, in Firefox the global scrollbar is **completely un-styled** (browser default) everywhere except elements that explicitly opt into `.ts-scrollbar-thin`.
2. **No `--ts-sb-thumb-border-w`/`--ts-sb-border`/`--ts-sb-border-hover` equivalents on the Firefox side** because the standard properties don't expose track-border, outline, or border-clip controls — the rich nested look (outline + border-clip + transparent border-spacer) the webkit branch achieves at L17–24 / L34–43 is simply not reproducible in standards-mode Firefox CSS.
3. **`--ts-this-bg: var(--ts-bg-4) !important` declared INSIDE `::-webkit-scrollbar`** (L11) — re-anchors the local surface derivative chain to the thumb's surface, but ONLY in webkit. Firefox cannot consume this.

**Refusal-pattern flag:** webkit-only scrollbar styling is **incomplete cross-browser coverage**. Recommended action for the rebuild: split this file into two layers — (1) a cross-browser layer that uses `scrollbar-width` / `scrollbar-color` as the baseline, (2) a `@supports selector(::-webkit-scrollbar)` enhancement layer for the rich webkit treatment. The current `.ts-scrollbar-thin` utility (L55–58) is the seed for layer 1; needs `--ts-sb-*` tokenization to match.

The commented-out block L2–7 (legacy 6px scrollbar against `--ts-bg-0` track / `--ts-bg-4` thumb / `--ts-accent` hover-thumb / `--ts-radius-full` thumb) is the **pre-token-cartel snapshot** — kept as a "what we used to do" reference. Worth deleting after migration.

## Special case: ts-cube-portfolio — how stale is it?

`ts-cube-portfolio.css` carries `mtime` May 9 (per dispatch brief — the oldest in the views/ folder; the rest were swept May 22). The header block (L1–91) is the owner's own integration brief and explicitly states the file is **pre-integration scratch** that "MUST NOT ship with its own dedicated CSS sheet" (L18–19). What's superseded by current rebuild canon:

| In ts-cube-portfolio.css | Superseded by | Action |
|---|---|---|
| `:root` re-declares `--ts-accent-h: 18`, `-s: 100%`, `-l: 52%` (L96–98) — HSL-based accent identity | apcach OKLCH primitives + Wave 1.6 derivative chain (Rule 15 — apcach is the constant engine for the system layer; HSL accent identity is now banned at primitive layer) | DELETE these three lines on integration. Override accent identity via the new accent token contract, not raw HSL. |
| `:root` re-declares the FULL legacy numbered surface chain `--ts-bg-body`, `--ts-bg-0..4` with hex literals (L99–104) | `assets/css/next/system/surfaces.css` apcach-driven derivative chain (`--ts-this-bg` engine) | DELETE the entire bg-chain redeclaration. The cube view inherits from the production surface engine. |
| Non-prefixed locals `--sw: 250px`, `--rsz: 25px`, `--nh: 45px` (L108–113) | Should use `--ts-sidebar-nav-w` / sizing primitives, prefixed `--ts-cube-*` if cube-private | Rename to `--ts-cube-sw` / `-rsz` / `-nh`. Non-prefixed namespace violation flagged in chunk 4b headermenu component-E (same pattern: `--base-size`). |
| 3 direct `var(--ts-bg-0)` references (L508 `#ts-wipe`, L519 `#ts-detail`, L540 `#ts-dback`) | `--ts-this-bg` derivative chain | Migrate to `--ts-this-bg-dim-*` or set local `--ts-this-bg` and let derivatives cascade. |
| Hardcoded `rgba(255,255,255,.05)` / `.07` / `.18` / `.22` / `.25` / `.28` / `.3` / `.38` / `.42` / `.45` for borders, text and dim-fills (L171, L206, L215, L230, L242, L250, L267, L275, L287, L298, L307, L401, L417, L454, L539, L544, L585, L605, L661, L666) | `--ts-text-primary-dim-N`, `--ts-text-muted`, `--ts-text-secondary`, `--ts-this-bg-border` family | Owner already flagged this himself: L43–47 (rulers note), L196–197 ("Replace `rgba(255,255,255,.05)` borders with surface tokens to keep light-theme switching valid"), L632–633 ("Replace stroke/fill rgba values with surface tokens before promotion"). All `rgba(255,255,255,…)` literals in the file are slated for token migration. |
| ID-anchored components `#ts-loader`, `#ts-rt`, `#ts-rl`, `#ts-topbar`, `#ts-shell`, `#ts-hero`, `#ts-cv`, `#ts-letters`, `#ts-meta-bl`, `#ts-meta-bc`, `#ts-sidebar`, `#ts-mt`, `#ts-wipe`, `#ts-detail`, `#ts-dback`, `#ts-dbody` | Toolskin convention is class-anchored; IDs are page-scoped DOM hooks not styling roots | Promote each ID-anchored block to a class (`.ts-cube-loader`, etc.) OR fold into existing components per the L37–90 per-element plan. |
| `#ts-loader` (L149–191) | `.ts-preloader` system component | Owner L72–77 plan #6: "Must be unified with the system's `ts-preloader` — share styles, DOM, and CSS via aliases / class pending." |
| `#ts-sidebar` (L427–433) — ⚠ NAMING CONFLICT | `.ts-sidebar` already exists in core (and in chunk 4b's masonry+layout-primitives file as `.ts-sidebar`) | Owner L56–60 plan #4: "Must be REPLACED, not re-scoped — across JS, HTML, and CSS. Do NOT keep it: it will break everything." HALT-WORTHY: do not refactor in place. |
| SVG rulers `.ts-grid-rules*` (L634–673) | Slated for promotion to **core component** | Owner L629–633 plan: "Promote to a Toolskin core component. Document in the codebase showcase docs as one of the flagship innovations of the system." This is the ONE class block in the file the owner wants to keep AS-IS (after token migration). |
| Sliding-menu items `.ts-wl` family (L448–499) + `.ts-mname`/`.ts-mrole`/`.ts-missue`/`.ts-dol`/`.ts-dtitle`/`.ts-ddesc`/`.ts-dmeta`/`.ts-dmetablock`/`.ts-dmetalabel`/`.ts-dmetaval`/`.ts-dimgs`/`.ts-nav`/`.ts-avail`/`.ts-avail-dot`/`.ts-dims` | Existing core typography + layout + nav primitives | Owner L60–70 plan #5: "Should not be a problem to refactor using existing Toolskin tokens, classes, and styles. NO new classes should be created for this — variants only, if needed." |
| `@keyframes tspulse` (L319–331) | `.ts-pulse` keyframes elsewhere in core (`ts-glow` in IDE file, `ts-pulse` in headermenu) | DEDUPE candidate. |
| `clamp(160px, 28vw, 430px)` font-size on `#ts-letters` (L371), `clamp(40px, 5.5vw, 84px)` on `.ts-dtitle` (L569) | Should flow through `--ts-fs-display` or a new `--ts-cube-letters-fs` token if cube-private | Owner L364–365 plan #2: "Tokenize the color and the size clamp." |

**Verdict:** ts-cube-portfolio.css is a **scratch / pre-integration reference, not production canon.** It should NOT be cataloged the same way the other view files are — treat it as a SPEC for what the cube-portfolio integration must achieve when folded into existing components, not as a file to refactor in place. Most rules will DELETE on integration; a handful (SVG rulers, big-letter treatment, sliding-menu wave-reveal) become variants on existing components.

## Special case: ts-ui-ide-view-fullview — view-layer architecture lessons

This file is the cleanest example of "view-tier composition" — a full-page IDE-emulator demo built from existing component primitives, with a thin view-private token layer on top. Top two architectural lessons for the rebuild's view-layer formalisation:

### Lesson 1 — The view-private token cartel pattern (L3–47)

The opening selector is `:root:has(.ts-ide-demo), :root:has(.ts-ide-demo) *` — a `:has()`-scoped pseudo-root distribution that activates a 30-token cartel ONLY when the IDE demo is present in the document. Tokens declared:

- **View identity (accent + code colors)** — `--ts-accent-h: 38`, `-s: 96%`, `-l: 56%` (HSL re-declaration — same anti-pattern flagged in ts-cube-portfolio above; superseded by apcach), plus syntax-highlight palette `--kw`/`--str`/`--num`/`--com`/`--fn`/`--typ` (all hsl(), non-prefixed namespace violation — should be `--ts-syntax-kw` etc.)
- **View geometry** — `--ts-top-tabs-h: 38px`, `--ts-ide-rail-w: 50px`, `--ts-ide-sidebar-w: 240px`, `--ts-ide-ai-w: 280px`, `--ts-titlebar-h: 35px`, `--ts-statusbar-h: 32px`, `--ts-bottom-block-h: 200px`
- **View padding/gap recipe** — `--ts-ui-pad-y: 8px`, `--ts-ui-pad-x: calc(var(--ts-ui-pad-y)*1.4)`, `--ts-ui-gap: calc(var(--ts-ui-pad-y)*.875)`, `--ts-ui-gap-md: calc(var(--ts-ui-gap)*1.5)`. Single-source-of-truth: change `--ts-ui-pad-y` and the whole view rescales.
- **Body/IDE grid template recipe** — `--ts-body-template-rows: var(--ts-titlebar-h) 1fr var(--ts-statusbar-h)`, `--ts-ide-template-cols: var(--ts-ide-rail-w) var(--ts-ide-sidebar-w) 1fr var(--ts-ide-ai-w)`. Layout-as-token: the grid shape is a derived token, not an inline `grid-template-*` value.
- **View-private surface aliases** — `--ts-ui-ide-surface-1: var(--ts-bg-0)`, `-surface-2: var(--ts-bg-1)`, `-surface-3: var(--ts-bg-2)` (L31–33), plus `--ts-ui-ide-bg: var(--ts-this-bg)`, `-bg-dim: var(--ts-this-bg-dim-3)`, `-bg-hover: var(--ts-this-bg-dark-1)`, `-bg-hover-accent: color-mix(in srgb, var(--ts-accent) 20%, transparent)`. This is the **view-private alias pattern** — components inside the view consume `--ts-ui-ide-bg`, not the global surface chain, so the view can re-anchor its entire palette in one place.
- **Border aliases** — `--ts-ui-ide-border-0: var(--ts-border-0)`, `-border: var(--ts-this-bg-border)`.

**Lesson:** view-tier files SHOULD declare a private token cartel scoped via `:has()` + `*` distribution. The 30-token cartel here is the right size/shape. **BUT** the cartel mixes legitimate view-private aliases (`--ts-ui-ide-*`) with anti-patterns (raw HSL accent re-declaration, non-prefixed `--kw`/`--str`/etc., direct `--ts-bg-N` consumption). The clean rule: **view-private cartel may only ALIAS production tokens through `--ts-this-bg` derivatives — no raw HSL/hex/rgba allowed at the cartel layer.**

### Lesson 2 — Per-component surface re-anchoring inside the view

Almost every component in the file uses the **two-line surface re-anchor idiom** (Rule 4 — surface superposition):

```css
.ts-titlebar {
    background-color: var(--ts-ui-ide-bg);
    --ts-this-bg: var(--ts-ui-ide-surface-2);
    ...
}
```

Line 1 paints from the view-alias; line 2 RE-ANCHORS the surface derivative chain so any child component computes its borders / dim-tones / dark-tones from this surface, not the parent. This is the same pattern flagged in chunk 4b's `inputs-global-nested-design-pattern.css` as canonical — but here it's applied uniformly across **16 components** in a single view: `.ts-titlebar` (L67–68), `.ts-rail` (L138–139), `.ts-rail-btn` (L171–173 — note the unusual ORDER: `background: var(--ts-this-bg-dim-6)` declared BEFORE `--ts-this-bg: …` — relies on cascade re-evaluation), `.ts-rail-btn:hover` (L207), `.ts-rail-btn.active` (L215), `.ts-sidebar` (L278–279), `.ts-sb-search` (L307–309), `.ts-tree .ts-node` (L341–342 — uses `--ts-this-bg: transparent` to "punch through" parent), `.ts-tree .ts-node:hover` (L347), `.ts-tree .ts-node.active` (L371–372), `.ts-tabs-bar` (L427–428), `.ts-ai` (L583–584), `.ts-msg` (L684), `.ts-msg.ts-user` (L691), `.ts-msg.ts-ai` (L700), `.ts-msg code` (L724), `.ts-ai-input .ts-pill` (L833–834), `.ts-ai-input textarea` (L856–858), `.ts-terminal` (L900), `.ts-term-tabs` (L913–914), `.ts-status` (L974–975).

**Lesson:** the view-layer's job is to declare a 3-tier private surface palette (`-surface-1/-2/-3`) and then re-anchor `--ts-this-bg` to one of those three at every component boundary. The component-internal CSS (borders, dim-fills, hover states) automatically recomputes via the derivative chain. **This file is the cleanest reference for "how a view composes existing components without re-styling them."**

A SECONDARY idiom in the file: the **text-color re-anchor** via `--ts-ui-text-color`:

```css
color: var(--ts-ui-text-color);
--ts-ui-text-color: var(--ts-text-muted);
```

Same two-line pattern, applied to text color rather than background. Used at L104–105 (crumb), L119–120 (menu), L156–157 (rail-btn), L291–292 (sb-head), L313–314 (sb-search), L334–335 (tree-node), L356–357 (tree-node.dir::before), L442 (tab-bar--tab), L569–570 (inline-hint), L837–838 (pill), L850–851 (pill-x), L877–878 (submit-row), L922–923 (term-tab), L944 (term-body), L949 (term-body .ln), L952 (term-body .pr), L956 (term-body .ok), L960 (term-body .wn), L964 (term-body .er), L968 (term-body .com), L982–983 (status), L1007 (status item), L1012 (status item.git), L1016 (item.err), L1020 (item.warn), L1024 (item.ok). **27 occurrences** — this is the dominant text-coloring idiom in the file. The state subclasses (`.git`, `.err`, `.warn`, `.ok`) flip `--ts-ui-text-color` from the cartel default to a semantic token, and the cascade does the rest.

---

## Per-file catalog

### general-scrollbar-customization(non-mozilla).css

- **Path:** `docs/references/toolskin.css_extracted-core-blocks-to-refactor/views/general-scrollbar-customization(non-mozilla).css`
- **Lines:** 57  ·  **Bytes:** 1,947
- **Block type:** global utility — webkit-only scrollbar engine plus one Mozilla-standards utility class
- **Key `--ts-*` tokens declared:** `--ts-this-bg: var(--ts-bg-4)!important` (L11, scoped inside `::-webkit-scrollbar`)
- **Key `--ts-*` tokens referenced:**
  - `--ts-sb-size` (L9, L10), `--ts-sb-thumb` (L15), `--ts-sb-thumb-hover` (L29, L51), `--ts-sb-thumb-border-w` (L20, L23, L31), `--ts-sb-border` (L23, L38), `--ts-sb-border-hover` (L31), `--ts-sb-track` (L36), `--ts-sb-track-hover` (L47), `--ts-sb-track-border-w` (L38)
  - `--ts-bg-4` (L11 `--ts-this-bg`, L57 scrollbar-color) — direct legacy surface consumption
  - `--ts-radius-base` (L17)
  - Commented-out block L2–7 references `--ts-bg-0` (L4), `--ts-bg-4` (L5), `--ts-accent` (L6), `--ts-radius-full` (L5)
- **Selectors defined:**
  - `::-webkit-scrollbar` (L8–12), `::-webkit-scrollbar-thumb` (L14–26), `::-webkit-scrollbar-thumb:hover` (L28–32), `::-webkit-scrollbar-track` (L34–44), `::-webkit-scrollbar-track:hover` (L46–48), `::-webkit-scrollbar-thumb:active` (L50–52)
  - `.ts-scrollbar-thin` (L55–58) — the ONLY non-webkit rule; Firefox-compatible via standardised `scrollbar-width` + `scrollbar-color`
- **No `@keyframes`, no `@property`, no `@media`.**
- **Non-OKLCH literals:** none (the commented-out L25 carries `#36373a` as a documentation note for what `--ts-sb-border` resolved to historically; live code has zero hex/rgb).
- **`--ts-bg-N` direct-reference count contribution:** **4 references** (L4 commented `--ts-bg-0`, L5 commented `--ts-bg-4`, L11 live `--ts-bg-4`, L57 live `--ts-bg-4`); **2 LIVE** (the commented refs in L2–7 don't execute).
- **Refactor flags:**
  - **Cross-browser incompleteness** — see "Special case: `(non-mozilla)`" above.
  - **`!important` overuse** — L9, L10, L11, L15, L16, L20, L21, L23, L29, L30, L36, L37, L39, L40, L47, L51. Owner relies on `!important` to win over UA default scrollbar styles; understandable but the `--ts-this-bg: var(--ts-bg-4)!important` at L11 in particular forcibly OVERRIDES any inherited derivative chain at the scrollbar boundary — surfaces inside the scrollbar will compute against `--ts-bg-4` not the parent surface. Likely intentional but worth documenting.
  - **`border-radius: var(--ts-radius-base); border-radius: 0;`** (L17–18) — two competing declarations in the same rule. Second wins. Likely a leftover from an A/B; needs cleanup.
  - **Direct `--ts-bg-4` consumption** — L11 and L57. Should migrate to `--ts-this-bg-dim-N` derivative once the `--ts-sb-*` cartel is formalised; right now the scrollbar's "thumb base color" is hardcoded to the global surface chain.

### ts-cube-portfolio.css

- **Path:** `docs/references/toolskin.css_extracted-core-blocks-to-refactor/views/ts-cube-portfolio.css`
- **Lines:** 673  ·  **Bytes:** 17,756
- **Block type:** legacy pre-integration page-shell (3D cube portfolio reference). **NOT production canon.** Treat as a spec for what to fold into existing components, not as a file to refactor in place. See "Special case: ts-cube-portfolio" above for the full integration plan owner has embedded at L1–91.
- **Key `--ts-*` tokens declared (`:root` block L95–114):**
  - `--ts-accent-h: 18`, `--ts-accent-s: 100%`, `--ts-accent-l: 52%` ⚠ legacy HSL accent identity (Wave 1.6 anti-pattern — superseded by apcach Rule 15)
  - `--ts-bg-body: #080809`, `--ts-bg-0: #0b0b0d`, `--ts-bg-1: #101012`, `--ts-bg-2: #16161a`, `--ts-bg-3: #1d1d22`, `--ts-bg-4: #252529` ⚠ legacy numbered surface chain with hardcoded hex (superseded by `assets/css/next/system/surfaces.css` derivative chain)
  - `--ts-font-display: 'Syne', system-ui, sans-serif`, `--ts-font-body: 'Space Grotesk', system-ui, sans-serif`, `--ts-font-mono: 'JetBrains Mono', monospace` ⚠ font identity should come from the production typography contract, not be re-declared per page
  - `--sw: 250px`, `--rsz: 25px`, `--nh: 45px` ⚠ non-prefixed namespace violation (`--ts-` prefix missing)
- **Key `--ts-*` tokens referenced:**
  - `--ts-bg-body` (L129), `--ts-bg-0` (L508, L519, L540) — direct legacy surface consumption (3 LIVE refs)
  - `--ts-accent` (L181, L293, L315, L375, L478, L484, L549, L561, L577), `--ts-accent-dim` (L478 fallback) — accent chain
  - `--ts-text-primary` (L130 only — most text uses raw `rgba(255,255,255,…)`)
  - `--ts-font-body` (L131), `--ts-font-display` (L370, L568), `--ts-font-mono` (L188, L228, L273, L305, L415, L543, L564, L608, L639)
- **Selectors / IDs defined:**
  - IDs: `#ts-loader`, `#ts-loader-track`, `#ts-loader-fill`, `#ts-loader-num`, `#ts-rt`, `#ts-rl`, `#ts-topbar`, `#ts-shell`, `#ts-hero`, `#ts-cv`, `#ts-letters`, `#ts-meta-bl`, `#ts-meta-bc`, `#ts-sidebar` (⚠ NAMING CONFLICT), `#ts-mt`, `#ts-wipe`, `#ts-detail`, `#ts-dback`, `#ts-dbody`
  - Classes: `.rstk`, `.rstk.m`, `.rsvtk`, `.ts-dims`, `.ts-nav`, `.ts-avail`, `.ts-avail-dot`, `.ts-mname`, `.ts-mrole`, `.ts-missue`, `.ts-wl`, `.ts-wl.revealed`, `.ts-wl.is-active`, `.ts-wl.is-dimmed`, `.ts-dol`, `.ts-dtitle`, `.ts-ddesc`, `.ts-dmeta`, `.ts-dmetablock`, `.ts-dmetalabel`, `.ts-dmetaval`, `.ts-dimgs`, `.ts-grid-rules` + `__horizontal`/`__vertical`/`-line`/`-text`
  - Selectors with state: `#ts-loader.out`, `#ts-detail.open`, `#ts-dback:hover`, `.ts-wl::before`, `.ts-wl.is-active::before`, `.ts-wl.is-dimmed::before`, `.ts-nav a`, `.ts-nav a:hover`, `.ts-nav li:not(:last-child) a::after`, `.ts-dtitle em`, `.ts-dimgs img`
- **Keyframes defined:** `tspulse` (L319–331) — opacity + scale pulse for `.ts-avail-dot`. DEDUPE candidate vs `ts-glow` / `ts-pulse` elsewhere.
- **No `@property`, no `@media`.** (Surprising for a "view" file — owner has not yet added breakpoint logic. The fixed 250px sidebar will be unusable on mobile.)
- **Non-OKLCH color literals (live):** `#080809` (L99), `#0b0b0d` (L100), `#101012` (L101), `#16161a` (L102), `#1d1d22` (L103), `#252529` (L104), plus extensive `rgba(255, 255, 255, .NN)` usage at L171, L206, L215, L230, L242, L250, L267, L275, L287, L298 (twice), L307, L401, L417, L454, L478 (`rgba(255, 84, 10, .08)` — accent fallback), L494, L539, L544, L585, L605, L661, L666. **Total: 28 raw color literals.** All are slated for token migration per owner's embedded plan (see "stale" table above).
- **`--ts-bg-N` direct-reference count contribution:** **3 LIVE references** (`--ts-bg-0` at L508, L519, L540) plus **6 legacy `--ts-bg-0..4` redeclarations at L100–104** (the `:root` block; these are LOCAL re-declarations that override the production chain WHILE this file is loaded — high-impact if this file ships unfiltered into production).
- **Owner annotations VERBATIM (selected, line numbers exact):**
  - L1–91: the entire opening comment block is the integration policy. Most important callouts:
    - L5–19: STATUS block — "These styles are extracted from the cube-portfolio source. They are pending: filtering, tokenization, updating, and seamless adaptation INTO the core CSS — preserving the current visual snapshot while avoiding the creation of new classes and reusing the existing Toolskin base."
    - L17–19: "Alternatively, this file may stay isolated UNTIL integration is complete — but the final cube-portfolio component MUST NOT ship with its own dedicated CSS sheet."
    - L22–35: GLOBAL POLICY — "Keep ONLY elements that are irreplaceable and do not match any existing pattern in the core." "Same applies to tokens: replace ad-hoc values with the current production tokens wherever possible."
    - L40–45 (RULERS plan): "Use surface tokens, NOT hardcoded colors, so that light-theme switching remains valid."
    - L56–60 (SIDEBAR plan #4): "⚠ NAMING CONFLICT. The class `ts-sidebar` already exists in core. It must be REPLACED, not re-scoped — across JS, HTML, and CSS. Do NOT keep it: it will break everything."
    - L72–77 (LOADER plan #6): "Must be unified with the system's `ts-preloader`."
    - L79–84 (CUBE plan #7): "still experimental … must become dynamic: able to load elements from a gallery source (posts, a folder, or a JSON feed) and to bind menu entries to cube tiles dynamically through hooks."
  - L94: `/* ── THEME TOKENS  (locals only — DO NOT promote, see policy above) ── */`
  - L134–144: `/* ── CURSOR ──  (currently disabled — see commented block) */` + the disabled `#tsc` block
  - L146–148: `/* ── LOADER ── INTEGRATION: must be unified with system `ts-preloader`. See point 6 of the per-element plan above. */`
  - L193–197: `/* ── RULERS ── Legacy DOM-based ruler. Superseded by the SVG ruler below (`.ts-grid-rules*`). Few CSS elements only — these MUST persist during integration. Replace `rgba(255,255,255,.05)` borders with surface tokens to keep light-theme switching valid. */`
  - L253–255: `/* ── TOPBAR ── Likely fully replaceable by an existing core nav variant. Audit before keeping any rule here. */`
  - L362–365: `/* TS giant letters — INTEGRATION: promote as a variant on the core design base — "background big-letter" treatment. Tokenize the color and the size clamp. See point 2 of the per-element plan above. */`
  - L422–426: `/* ── SIDEBAR ──  ⚠ NAMING CONFLICT … Must be REPLACED (not re-scoped) across JS, HTML, and CSS during integration. Do NOT keep this ID — it will break everything. */`
  - L443–447: `/* Sliding menu items (.ts-wl) — INTEGRATION: refactor onto existing Toolskin tokens / classes. No new classes should be created — variants only, if needed. */`
  - L482: `/* Only ONE item is active — the directly hovered one */`
  - L501–503: `/* ── PAGE WIPE ── INTEGRATION: economize and minimize the styling/handling while preserving rendering parity. See point 3 of the plan above. */`
  - L629–633: `/* ── SVG RULERS (current implementation) Promote to a Toolskin core component. Document in the codebase showcase docs as one of the flagship innovations of the system. Replace stroke / fill rgba values with surface tokens before promotion, to keep light-theme switching valid. */`
- **Refactor flags:**
  - **Whole-file status: pre-integration scratch.** Owner explicitly states this file MUST NOT ship as-is. The catalog's role is to enumerate what gets folded where, not to plan a refactor in place.
  - **`:root` block at L95–114 will SHADOW production tokens** if this file is loaded alongside the rebuild — `--ts-bg-0..4`, `--ts-accent-h/s/l`, `--ts-bg-body` all get overridden with hex literals. HIGH RISK if accidentally bundled.
  - **`#ts-sidebar` naming collision** — HALT-WORTHY per owner.
  - **Mobile responsive plan absent** — no `@media` queries. The fixed 250px sidebar + 25px rulers + 45px nav-height layout is desktop-only.
  - **`will-change: transform`** on `#ts-mt` (L441), `will-change: left, top` in commented `#tsc` (L141) — perf budget commitments. Document if kept.
  - **`mix-blend-mode: difference`** in commented `#tsc` block (L139) — if cursor is restored, this is one of the few "true" creative-blend-mode usages in the catalog so far.

### ts-ui-ide-view-fullview.css

- **Path:** `docs/references/toolskin.css_extracted-core-blocks-to-refactor/views/ts-ui-ide-view-fullview.css`
- **Lines:** 1,045  ·  **Bytes:** 24,507
- **Block type:** view-tier composition (full IDE-emulator demo). The single best reference in the catalog so far for "how a view composes existing components without restyling them" via private surface aliases + `--ts-this-bg` re-anchoring. See "Special case: ts-ui-ide-view-fullview" above for the two architectural lessons.
- **Key `--ts-*` tokens declared (`:root:has(.ts-ide-demo), :root:has(.ts-ide-demo) *` block L3–47, scoped to view via `:has()`):**
  - View identity (anti-pattern): `--ts-accent-h: 38`, `--ts-accent-s: 96%`, `--ts-accent-l: 56%` ⚠ same HSL re-declaration anti-pattern as ts-cube-portfolio
  - Code colors: `--ts-code-bg: #0c0e0f`, `--ts-code-line: #2a2e2f` — `--ts-` prefixed but hardcoded hex
  - Syntax-highlight palette (anti-pattern): `--kw: hsl(322, 70%, 70%)`, `--str: hsl(140, 60%, 60%)`, `--num: hsl(45, 90%, 65%)`, `--com: hsl(220, 10%, 45%)`, `--fn: hsl(200, 80%, 65%)`, `--typ: hsl(180, 70%, 65%)` ⚠ non-prefixed namespace violation + raw HSL
  - View geometry: `--ts-top-tabs-h: 38px`, `--ts-ide-rail-w: 50px`, `--ts-ide-sidebar-w: 240px`, `--ts-ide-ai-w: 280px`, `--ts-sb-size: 6px` (overrides global scrollbar size), `--ts-titlebar-h: 35px`, `--ts-statusbar-h: 32px`, `--ts-bottom-block-h: 200px`
  - View padding/gap recipe: `--ts-ui-pad-y: 8px`, `--ts-ui-pad-x: calc(var(--ts-ui-pad-y)*1.4)`, `--ts-ui-gap: calc(var(--ts-ui-pad-y)*.875)`, `--ts-ui-gap-md: calc(var(--ts-ui-gap)*1.5)`
  - Grid templates (layout-as-token): `--ts-body-template-rows: var(--ts-titlebar-h) 1fr var(--ts-statusbar-h)`, `--ts-ide-template-cols: var(--ts-ide-rail-w) var(--ts-ide-sidebar-w) 1fr var(--ts-ide-ai-w)`
  - Border aliases: `--ts-ui-ide-border-0: var(--ts-border-0)`, `--ts-ui-ide-border: var(--ts-this-bg-border)`
  - Surface aliases: `--ts-ui-ide-surface-1: var(--ts-bg-0)`, `-surface-2: var(--ts-bg-1)`, `-surface-3: var(--ts-bg-2)` ⚠ direct `--ts-bg-N` consumption
  - Background aliases: `--ts-ui-ide-bg: var(--ts-this-bg)`, `-bg-dim: var(--ts-this-bg-dim-3)`, `-bg-hover: var(--ts-this-bg-dark-1)`, `-bg-hover-accent: color-mix(in srgb, var(--ts-accent) 20%, transparent)`
  - Type scale: `--ts-ui-fs-sm: 12px`, `--ts-ui-fs-xs: 11px`, `--ts-ui-fs-2xs: 9px`
  - Misc: `--ts-bar-stroke-size: 2px`, `--ts-ui-radius: 4px`, `--ts-node-indent-val: var(--ts-ui-gap-md)`, `--ts-node-indent-active: calc(var(--ts-node-indent)*.75)` (note: `--ts-node-indent` is consumed before declared — see refactor flag), `--ts-ui-text-color: var(--ts-text-primary-dim-2)`
- **Key `--ts-*` tokens referenced** (extensive — view-private aliases dominate, but direct production tokens still appear):
  - Direct production surface: `--ts-bg-0` (L31), `--ts-bg-1` (L32), `--ts-bg-2` (L33, L207), `--ts-bg-3` (L215), `--ts-bg-4` (L327 scrollbar-color), `--ts-bg-body` (L53) — **6 LIVE direct refs**
  - Production text: `--ts-text-primary` (L350, L454, L508, L609, L860), `--ts-text-primary-dim-2` (L45, L654), `--ts-text-secondary` (L105, L314, L335, L683, L690, L949), `--ts-text-muted` (L120, L157, L292, L357, L442, L570, L689, L838, L851, L878, L923, L983), `--ts-text-accent` (L372, L375, L725, L754, L757, L762, L766)
  - Accent / state: `--ts-accent` (L112, L124, L213, L224, L248, L375, L376, L455, L499, L520, L549, L575, L619, L620, L638, L682, L698, L757, L883, L931, L953, L1012), `--ts-on-accent` (L224, L249, L884), `--ts-warning` (L381, L472, L961, L1020), `--ts-success` (L386, L754, L762, L957, L1024), `--ts-danger` (L465, L555, L766, L965, L1016)
  - Derivative chain (the GOOD signal — Wave 1.6 surface superposition working as designed): `--ts-this-bg` (L34, L68, L139, L173, L194, L207, L215, L279, L309, L342, L347, L372, L428, L584, L684, L691, L700, L724, L834, L858, L900, L914 — set 22 times), `--ts-this-bg-dim-3` (L35), `--ts-this-bg-dim-5` (L739), `--ts-this-bg-dim-6` (L171, L747), `--ts-this-bg-dark-1` (L36), `--ts-this-bg-border` (L30, L726), `--ts-this-bg-border-active` (L734), `--ts-this-color-bright` (L374, L382, L748), `--ts-this-bg-dim-4` (L755 commented). **`--ts-this-*` derivative chain used in 30+ rules.**
  - Borders: `--ts-border-0` (L29, L161)
  - Typography: `--ts-font-mono` (L56, L74, L102, L273, L315, L412, L543, L789, L861, L889, L1035), `--ts-font-display` (L604), `--ts-fs-xs` (L1006), `--ts-fs-2xs` (L650), `--ts-letter-spacing-wider` (L924)
  - Sizing: `--ts-btn-h` (L152, L153, L167, L197 commented, L202 commented, L239), `--ts-icon` (L158, L166, L175, L196 commented, L264), `--ts-radius-full` (L267), `--ts-btn-fs` (L790), `--ts-btn-scale` (L796, L893), `--ts-btn-h-ratio` (L797), `--ts-btn-fs-ratio` (L798), `--ts-sp-0` (L776), `--ts-sp-1` (L775), `--ts-sp-4` (L439), `--ts-badge-size` (L237, L240, L241, L262, L264, L265, L266, L271, L272)
- **Selectors / classes defined (compound — nested CSS via `.ts-ide-demo { … }` parent at L63–1046):**
  - Body shell: `body.ts-ide-demo` (L49–61)
  - Titlebar layer: `.ts-titlebar` (L66–76), `.ts-traffic` + `.r`/`.y`/`.g` (L78–99 — Mac-style traffic lights with hardcoded `#ff5f56`/`#ffbd2e`/`#27c93f`), `.ts-titlebar .ts-crumb` (L101–109), `.ts-titlebar .ts-crumb b` (L111–113), `.ts-titlebar .ts-menu` (L115–121), `.ts-titlebar .ts-menu span:hover` (L123–126)
  - IDE grid + rail: `.ts-ide` (L129–134), `.ts-rail` (L137–149), `.ts-rail-btn` (L151–178), `.ts-rail-btn:hover` (L205–208), `.ts-rail-btn.active, .ts-rail-btn.ts-active` (L210–217), `.ts-rail-btn .ts-badge, .ts-rail-btn .badge` (L219–242, AND DUPLICATED L244–274 with refined values — the second wins)
  - Sidebar (file-tree): `.ts-sidebar` (L277–284), `.ts-sb-head` (L286–298), `.ts-sb-head .ts-icon` (L300–303), `.ts-sb-search` (L305–317), `.ts-tree` (L319–329), `.ts-tree .ts-node` (L331–344), `.ts-tree .ts-node:hover` (L346–351), `.ts-tree .ts-node.dir::before` / `.ts-tree .ts-node.dir.closed::before` / `.ts-tree .ts-node.file::before` (L353–368), `.ts-tree .ts-node.active` (L370–378), `.ts-tree .ts-node.modified` / `.added` (L380–388), `.ts-tree .ts-node.indent` / `.indent2` / `.indent.active`/`.indent2.active` (L390–408), `.ts-tree .ts-node .git` (L410–415)
  - Editor column: `.ts-editor-col` (L418–423), `.ts-tabs-bar` (L425–431), `.ts-tabs-bar, .ts-ai-head` (L433–436 — shared height rule), `.ts-tab-bar--tab` (L438–450), `.ts-tab-bar--tab.active` (L452–456), `.ts-tab-bar--tab .x` (L458–461), `.ts-tab-bar--tab .x:hover` (L463–466), `.ts-tab-bar--tab .dot` (L468–473)
  - Editor pane: `.ts-editor` (L475–481), `.gutter, .ts-gutter` (L483–492), `.gutter span` (L494–496), `.gutter .cur` (L498–500), `.ts-code` (L502–511), `.ts-code .line` (L513–516), `.ts-code .line.cur` (L518–522), `.ts-code .kw`/`.str`/`.num`/`.com`/`.fn`/`.typ`/`.acc` (L524–551), `.ts-code .err` (L554–559 — squiggle pattern), `.ts-inline-hint` (L561–572), `.ts-inline-hint b` (L574–577)
  - AI panel: `.ts-ai` (L582–593), `.ts-ai-head` (L595–601), `.ts-ai-head h3` (L603–613), `.ts-ai-head h3 .ts-pulse` (L615–622), `.ts-ai-head .ts-model` (L636–640), `.ts-ai-body` (L643–656), `.ts-msg` (L660–686), `.ts-msg.ts-user` (L688–694), `.ts-msg.ts-ai` (L697–702), `.ts-msg.ts-ai::before` / `.ts-msg.ts-user::before` content + shared block (L704–719), `.ts-msg code` (L721–728), `.ts-msg .ts-codeblock` (L730–743), `.ts-msg .ts-codeblock .add, .ts-msg .ts-codeblock .rem` + `.add` + `.rem` (L745–767), `.ts-codeblock span:not(:last-child)` (L769–771), `.ts-msg .ts-actions` (L773–781), `.ts-msg .ts-actions button, .ts-msg .ts-actions .ts-btn` (L783–800)
  - AI input: `.ts-ai-input` (L811–822), `.ts-ai-input .ts-pills` (L824–828), `.ts-ai-input .ts-pill` (L830–847), `.ts-ai-input .ts-pill .x` (L849–853), `.ts-ai-input textarea` (L855–867), `.ts-ai-input .ts-submit-row` (L869–873), `.ts-ai-input .ts-submit-row .ts-left` (L875–880), `.ts-ai-input .ts-submit-row button` (L882–895)
  - Terminal: `.ts-terminal` (L898–908), `.ts-term-tabs` (L911–917), `.ts-term-tab` (L919–928), `.ts-term-tab.active` (L930–933), `.ts-term-body` (L935–941), `.ts-term-body *` (L943–946), `.ts-term-body .ln`/`.pr`/`.ok`/`.wn`/`.er`/`.com` (L948–970 — state colors via `--ts-ui-text-color` flip)
  - Status bar: `.ts-status` (L972–988), `.ts-status .ts-group` (L990–993), `.ts-status .ts-group:last-child` (L995–997), `.ts-status .ts-item` (L999–1009), `.ts-status .ts-item.git`/`.err`/`.warn`/`.ok` (L1011–1025)
  - Bottom-of-file utilities: `.line, .ts-line` (L1027–1030), `.ts-code, .code, code` (L1032–1036), `.ts-code .line, .ts-code .ts-line, .code .line, .code .ts-line` (L1038–1045 — flagged `/* CRITICAL */`)
- **Keyframes defined:** `ts-glow` (L624–634) — opacity pulse for `.ts-ai-head h3 .ts-pulse`. DEDUPE candidate vs `tspulse` (ts-cube-portfolio L319) and `ts-pulse` (headermenu).
- **No `@property`, no `@media`.** (Same blind-spot as ts-cube-portfolio — IDE view is desktop-only.)
- **Non-OKLCH color literals (live):** `#0c0e0f` (L8), `#2a2e2f` (L9), `hsl(322, 70%, 70%)` (L10), `hsl(140, 60%, 60%)` (L11), `hsl(45, 90%, 65%)` (L12), `hsl(220, 10%, 45%)` (L13), `hsl(200, 80%, 65%)` (L14), `hsl(180, 70%, 65%)` (L15), `#ff5f56` (L90), `#ffbd2e` (L94), `#27c93f` (L98), `rgba(255, 255, 255, 0.03)` (L519), `rgba(255, 255, 255, 0.04)` (L565). **Total: 13 raw color literals.** All justifiable as either (a) syntax-highlight palette best left as HSL for hue-readability or (b) the Mac traffic-light + line-highlight conventions. STILL, ALL should be tokenized as `--ts-syntax-kw` / `--ts-traffic-r` / `--ts-code-line-highlight` etc. before shipping.
- **`--ts-bg-N` direct-reference count contribution:** **6 LIVE references** — `--ts-bg-0` (L31), `--ts-bg-1` (L32), `--ts-bg-2` (L33, L207), `--ts-bg-3` (L215), `--ts-bg-4` (L327). One commented (L785). The L31–33 three references in particular are the view's surface-alias seeds and should migrate to `--ts-this-bg-dim-N` so the IDE view re-anchors to its host surface rather than hardcoding to the global chain.
- **Owner annotations / structural comments:**
  - L65: `/* TITLE BAR */`
  - L128: `/* MAIN GRID */`
  - L136: `/* ACTIVITY RAIL */`
  - L146–147 + L180–204: large commented-out alternate `.ts-rail-btn` declaration — an A/B that wasn't deleted. Cleanup candidate.
  - L276: `/* ts-SIDEBAR */` (note lowercase-ts prefix in comment — minor inconsistency vs the file's conventional uppercase callouts)
  - L417: `/* EDITOR */`
  - L553: `/* squiggle */` — for `.ts-code .err`
  - L579: `/* RIGHT PANEL — AI assistant */`
  - L731–733: commented properties inside `.ts-msg .ts-codeblock` (`margin`, `padding`, `--this-bg` — note the latter is `--this-bg` NOT `--ts-this-bg`, likely a typo) — the `--this-bg: var(--ts-code-bg)` at L733 is the only typo'd custom property in the file (missing `ts-` prefix).
  - L802–809: commented-out `.ts-msg .ts-actions .primary` rule
  - L897: `/* TERMINAL bottom panel — collapsed inside editor col */`
  - L972: `/* STATUS BAR */`
  - L1044: `/* CRITICAL */` next to `white-space: pre` on `.ts-code .line` — the only critical-grade flag in the file. Documents that the editor's code-line layout depends on `pre` to preserve indentation; do not refactor away.
- **Refactor flags:**
  - **HSL accent identity re-declaration (L5–7)** — Wave 1.6 anti-pattern. The view should override accent via the apcach contract, not the raw HSL channels.
  - **Non-prefixed syntax-highlight tokens (`--kw`/`--str`/`--num`/`--com`/`--fn`/`--typ`)** — namespace violation. Rename to `--ts-syntax-*`.
  - **`--ts-code-bg: #0c0e0f`, `--ts-code-line: #2a2e2f`** — `--ts-` prefixed but values are hardcoded hex. Should resolve through surface tokens (e.g. `--ts-code-bg: var(--ts-this-bg-dim-7)` or similar).
  - **Mac-style traffic lights (`#ff5f56`/`#ffbd2e`/`#27c93f`)** — semantic color, should tokenize as `--ts-traffic-r`/`-y`/`-g` or reuse `--ts-danger`/`--ts-warning`/`--ts-success`.
  - **`.ts-rail-btn .ts-badge, .ts-rail-btn .badge` declared TWICE** (L219–242 and L244–274). Second declaration wins (refined values, `transform: translate(5px, -5px)`, `border-radius: var(--ts-radius-full)`, `display: grid; place-content: center`). Delete the first block as dead code.
  - **`--ts-node-indent` referenced before declared** (L44 declares `--ts-node-indent-active: calc(var(--ts-node-indent)*.75)` but `--ts-node-indent` is only declared inside `.ts-tree .ts-node` at L340). This works because of CSS custom property lazy evaluation, but it's a fragile dependency — the `:root` block's `--ts-node-indent-active` is meaningless until a `.ts-node` is in scope. Should be declared at `:root` with a fallback.
  - **`--ts-this-bg: var(--ts-text-accent)` at L372 and L756 / `.ts-msg .ts-codeblock .add,.rem`** — REASSIGNS the bg derivative chain to a TEXT token. Reads as: "this surface's background = the text accent color." Probably intentional (the active-tree-node row has a filled accent bar; the diff add/rem rows have a green/red wash) — but **this is the only place in the catalog so far where `--ts-this-bg` is anchored to a semantic text token rather than a surface token.** Worth a council note: is this a legitimate idiom for "semantic-state-as-surface" composition, or a token-tier violation?
  - **`background: var(--ts-this-bg-dim-6)` declared BEFORE `--ts-this-bg: var(--ts-ui-ide-surface-1)`** in `.ts-rail-btn` (L171 then L173). CSS recomputes `--ts-this-bg-dim-6` at use-time, so this works — but the SOURCE-ORDER is inverted from convention (re-anchor first, consume second). Stylistically should swap.
  - **Missing `@media` queries** — the entire view is desktop-only with no breakpoint logic. The 4-column grid `var(--ts-ide-rail-w) var(--ts-ide-sidebar-w) 1fr var(--ts-ide-ai-w)` (50+240+…+280 = 570px chrome) will be unusable on mobile. Owner has not yet annotated this.
  - **The view-cartel scoped via `:root:has(.ts-ide-demo), :root:has(.ts-ide-demo) *`** is an R-cascade-adjacent pattern (Rule 8). It's NOT the forbidden `:root [class*=…]` substring-distribution that headermenu uses — `:has()` + `*` is a legitimate "activate when this demo is present" scope — but it still distributes the cartel onto every descendant, costing browser re-evaluation per element. Council note: is `:has()` + `*` distribution acceptable for view-scoped token cartels, or should views use a single root selector + CSS inheritance?

---

## Cross-chunk inventory update

### `--ts-bg-N` direct-reference running tally — chunk 5a contribution

Live references (excludes commented-out code) added by chunk 5a:

| File | `--ts-bg-0` | `--ts-bg-1` | `--ts-bg-2` | `--ts-bg-3` | `--ts-bg-4` | `--ts-bg-body` | Total LIVE |
|---|---|---|---|---|---|---|---|
| general-scrollbar-customization(non-mozilla).css | 0 | 0 | 0 | 0 | **2** (L11, L57) | 0 | **2** |
| ts-cube-portfolio.css | **3** (L508, L519, L540) | 0 | 0 | 0 | 0 | **1** (L129) | **4** (+ 6 LOCAL REDECLARATIONS at L100–104 that SHADOW the production chain — high-risk if bundled) |
| ts-ui-ide-view-fullview.css | **1** (L31) | **1** (L32) | **2** (L33, L207) | **1** (L215) | **1** (L327) | **1** (L53) | **7** |
| **Chunk 5a total LIVE** | **4** | **1** | **2** | **1** | **3** | **2** | **13 LIVE references** |

Plus **6 LOCAL REDECLARATIONS** in ts-cube-portfolio.css L100–104 (`--ts-bg-body`, `--ts-bg-0..4` hex literals) — these don't COUNT toward the tally of consumers but they DO shadow the production chain.

**Carry-forward note for chunks 5b / future sweeps:** the dominant migration pattern in chunk 5a is `--ts-bg-N → --ts-this-bg-dim-N` for static surface paints, OR `--ts-bg-N → view-private alias (--ts-ui-ide-surface-N)` that itself resolves to a derivative. The ts-ui-ide-view file demonstrates the right idiom for views — a private 3-tier alias palette anchored at the view root — except that those aliases still bottom out at `--ts-bg-N` (L31–33). One-line fix: change to `--ts-this-bg-dim-1/-3/-5` and the view auto-re-anchors per host surface.

### View-tier vs component-tier — what chunk 5a teaches

Compared to the component files in chunks 4a/4b:

1. **View-tier files SHOULD declare a private token cartel** (ts-ui-ide-view does this cleanly). Component-tier files SHOULD NOT (most components in 4a/4b consume tokens only).
2. **View-tier files SHOULD set `--ts-this-bg` at every component boundary** (ts-ui-ide-view does this 22 times). Component-tier files SHOULD set `--ts-this-bg` ONCE per component root (canonical reference: `inputs-global-nested-design-pattern.css` chunk 4b).
3. **View-tier files SHOULD NOT re-declare accent identity HSL channels** (both ts-cube-portfolio and ts-ui-ide-view violate — flagged for migration to apcach override).
4. **View-tier files SHOULD have `@media` breakpoint logic** — both 5a view files MISS this. Likely a deferred concern; rebuild canon must enforce.
5. **View-tier files SHOULD use `:has()` + `*` distribution carefully** — preferable to global `:root` declarations, but still distributes per-element. Council-worthy.

### Annotations density (running)

| Chunk | Files | Lines | Owner-annotated lines (estimated) | Density |
|---|---|---|---|---|
| 5a | 3 | 1,775 | ~165 (≈9.3%) | LOW — dominated by ts-cube-portfolio's 91-line integration brief; ts-ui-ide-view is sparsely annotated despite its architectural importance |

---

## Halt status

No HALT this chunk. All three files cataloged; no files missing; output well under 100k tokens.

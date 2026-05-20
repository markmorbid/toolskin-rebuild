# Toolskin Showcase — Full Project Audit & Handoff

**Date:** 2026-03-30  
**Scope:** Entire `toolskin-showcase` repository — design system core, showcase, labs, generators, mockups, experiments, and stated roadmap items.  
**Audience:** Next implementer (human or agent). **No code changes were applied** in producing this document; it records **current state** and **recommended work**.

---

## 1. Executive summary

| Area | Current state |
|------|----------------|
| **Design system core** | `assets/css/toolskin.css` (~17k lines) defines tokens (`--ts-*`), components (`.ts-*`), themes, utilities. `assets/js/toolskin.js` (~6.2k lines) provides `Toolskin.init()`, theme, tooltips, preloader, reveals, modals, tabs, range, grid BG, optional Lenis/Locomotive/cursor, etc. |
| **UI Kit (optional layer)** | `assets/css/toolskin-uikit.css` + `assets/js/toolskin-uikit.js` expose `window.ToolskinUIKit` (accordion, custom select, spinner, draggable/resizable/sortable, table sort/bulk, masonry, number inputs, toast helper). |
| **Main showcase** | `index.html` — very large single page: hero, nav, component demos, token/surface labs, GSAP reveals, marquees, masonry, inline scripts for labs. Loads Color.js, Lenis, Locomotive, GSAP + ScrollTrigger, core + uikit + gradient canvas + offcanvas script. |
| **Toolskin Lab** | `toolskin-lab.html` — leaner page focused on UI Kit demos; loads core CSS/JS + uikit only (no Lenis/GSAP stack by default in head). |
| **Generators** | `generator/index.html` (banner) + `generator/patterns.html` (patterns) — **reported working well**; share Toolskin stack, local inline token overrides, `toolskin.bannerGenerator.js` for banner canvas export. |
| **Mockups** | `mockup/` — static HTML toolpanel prototypes (YSS/Suno/Higgsfield-style); reference UX, not canonical framework consumers. Some use jQuery + `assets/js/mockup-scripts.js`. |
| **Experiments** | Root: `test.html`, `cube-portfolio.html`, `corentin.html`, `ts-phantom-portfolio.html`, `phantom-gallery.js`, `app.js`, `projects.js`, etc. |
| **Deployment** | No `wrangler.toml`, `vercel.json`, or CI config found in-repo; treat as **static files** deployable to any host (Pages, S3, nginx). |
| **Documentation** | `docs/README.md`, `QUICK_REFERENCE.md`, `TOOLSKIN_USAGE_GUIDE.md`, `TOOLSKIN_WORKSPACE_REPORT.md`, `banner-generator-parameter-mapping.md`, root `PATTERNS_INTEGRATION_REPORT.md`. |

**Pain points called out by stakeholder (validated against code):**

1. **Preloader / FOUC** — Showcase does not apply an early `html.ts-preloader-lock` before paint, and CSS hides `#ts-app` under lock while **`index.html` uses `<main id="ts-main">` without `#ts-app`**, so the lock rules do not hide main content. The preloader element also starts with `opacity: 0` / `visibility: hidden` until `ToolskinPreloader` runs (deferred `toolskin.js`), so **full page content can flash** before the shell locks. Generators use a **synchronous boot `<style id="ts-preloader-boot">`** + script adding lock — showcase does not mirror that pattern completely.
2. **Load weight** — Showcase pulls many deferred CDNs (fonts, FA, Ionicons module, Color.js, Lenis + CSS, Locomotive, GSAP, ScrollTrigger) plus large inline HTML → slow TTI on cold load.
3. **Z-index** — Tokens use extremely large values (`--ts-z-preloader`, `--ts-z-offcanvas`, etc.); if something still appears “under,” cause is likely **stacking context / missing wrapper**, not numeric ceiling (browsers may also clamp absurd z-index in edge cases).
4. **Offcanvas “editor”** — `assets/js/ts-offcanvas-editor.js` + `.ts-oce-*` in `toolskin.css` implement a **left** FAB, **left** sliding panel, **dimmed overlay**, theme buttons + accent hex — **placeholder** vs. future “full editor.”
5. **Cursor / smooth scroll** — Defaults in `ToolskinConfig` already have `smoothScroll.enabled: false` and `cursor.enabled: false`. Showcase **additionally** sets `window.__TOOLSKIN_CONFIG__` with `cursor.enabled: false` and `smoothScroll.enabled: false` — **hard to toggle via HTML class alone** today; config merge is JS object–based.
6. **Script sprawl** — Large inline blocks in `index.html` for token lab, schema accordion, etc.; stakeholder wants progressive consolidation into core with class-based init.

---

## 2. Repository tree (structural)

```
toolskin-showcase/
├── index.html                    # Main design-system showcase (very large)
├── toolskin-lab.html             # UI Kit lab
├── test.html                     # Three.js / GSAP experiment + app.js projects.js
├── ts-phantom-portfolio.html     # Uses toolskin.js + three
├── cube-portfolio.html           # GSAP + three (root scripts)
├── corentin.html                 # GSAP + three
├── corentin-beautified.js        # Root JS (non-assets)
├── app.js, projects.js           # Root ES modules (test.html)
├── phantom-gallery.js            # Root JS
├── projects.js
├── PATTERNS_INTEGRATION_REPORT.md
├── Ionicons 7.1.0 Cheatsheet.html
├── Just the data you need - Summary.html
├── .cursor/plans/                # Internal plan markdowns (refactors, banner fixes)
├── .vscode/
├── _bu/                          # Backups (see §18)
├── assets/
│   ├── css/
│   │   ├── toolskin.css          # Core design system
│   │   ├── toolskin-uikit.css   # UI Kit
│   │   ├── ts-patterns.css       # Pattern utilities (generator + showcase)
│   │   ├── extra-styles.css
│   │   ├── *_Automation*.user.css, Youtube_*.user.css  # Archived userscript CSS
│   └── js/
│       ├── toolskin.js           # Core runtime
│       ├── toolskin-uikit.js
│       ├── toolskin.bannerGenerator.js
│       ├── toolskin.ionicons710.registry.js
│       ├── ts-gradient-canvas.js
│       ├── ts-offcanvas-editor.js
│       ├── three.min.js, three-js-grads.js
│       ├── mockup-scripts.js
│       └── userscripts/          # Large .user.js ports (YouTube, Suno, Higgsfield)
├── docs/                         # Human docs + this audit
├── generator/
│   ├── index.html                # Banner generator (canonical)
│   ├── banner-generator-v2.html
│   ├── banner-generator.html
│   ├── patterns.html
│   ├── patterns.css              # Generator-local overrides (not under assets/css)
│   ├── presets/*.json
│   └── (backup/copy snapshots → `_bu/repo-cleanup-2026-03-30/generator/`)
├── mockup/                       # Many HTML demos; some "*Copy*" duplicates
└── scripts/                      # Node: parse-ionicons-cheatsheet.mjs, embed-ionicons, replace-fa-icons
```

---

## 3. Core CSS (`assets/css/toolskin.css`)

- **Version header:** Design System v1.0.0; prefixes `.ts-` (Toolskin), `.tk-` (ToolCore / programmatic).
- **Table of contents (file header):** §1 Design tokens through §10 Responsive — use it as the map.
- **§1 Tokens:** Accent HSL engine (`--ts-accent-h/s/l`), surfaces, borders, typography, spacing, radius, shadows, **z-index stack**, motion, layout breakpoints.
- **Notable z-index variables** (approximate roles):
  - `--ts-z-preloader`: astronomically high (intended top layer).
  - `--ts-z-offcanvas` / `--ts-z-offcanvas-panel`: even higher in source order for editor stack.
  - `--ts-z-modal`, `--ts-z-toast`, `--ts-z-cursor`: much lower — **if preloader must sit above modals, verify stacking contexts** on pages that create new contexts on `main` or `nav`.
- **Preloader rules:** `html.ts-preloader-lock` hides `#ts-app` and shows `.ts-preloader` when combined with `.is-visible` from JS. **Showcase gap:** no `#ts-app` wrapper.
- **Components:** Buttons, cards, panels, forms, toggles, range, chips, tabs, badges, nav, modals, tables, toasts, tooltips, flip cards, pricing, swatches, etc.
- **Offcanvas editor block:** `.ts-oce-fab` (fixed **left** bottom), `.ts-oce-overlay` (full-screen scrim), `.ts-oce-panel` (fixed **left**, slide from left, **box-shadow** on panel).
- **Patterns:** Pattern-related rules may appear near end; canonical pattern definitions live primarily in **`assets/css/ts-patterns.css`** (imported by pattern generator HTML).

---

## 4. Core JS (`assets/js/toolskin.js`)

**Header advertises:** Tabs, Modal, Toast, Toggle, Observer, Icons, Ion registry, Theme, Smooth (Lenis), DynamicNav, Locomotive, Config, Tooltip, Slider, `Toolskin.init`.

**Embedded data:** `TOOLSKIN_IONICONS_710` auto-generated flags map (filled/outline/sharp) — source workflow in `scripts/parse-ionicons-cheatsheet.mjs`.

**`ToolskinIonIcons` (global):** Registry helpers: `flags`, `hasOutline`, `hasSharp`, `resolveIonIconName`, `listBases`, etc.

**`ToolskinConfig.defaults`** (high level):

| Key | Role |
|-----|------|
| `smoothScroll` | Lenis options; **`enabled: false`** default |
| `locomotiveScroll` | Locomotive; **`enabled: false`** |
| `theme` | dark/light/auto, toggle, `localStorage` key |
| `layout` | container widths, noise, fullpage, elastic |
| `cursor` | **`enabled: false`** default |
| `rangeSliders` | `autoInit: true` |
| `gridBg` | Interactive `.grid-bg.interactive` |
| `reveal` | GSAP ScrollTrigger vs IntersectionObserver |
| `tooltips` | `[data-tooltip]`; `zIndex: 100000` |
| `preloader` | **`enabled: true`**; tracks DOM/images/fonts/load |

**Classes (concrete):**

| Class | Approx. responsibility |
|-------|-------------------------|
| `ToolskinConfig` | `defaults`, `init`, `deepMerge` |
| `ToolskinTheme` | Theme mode, accent HSL/hex, radius, font, **surface preset catalog**, contrast tweak hooks (Color.js) |
| `ToolskinSmooth` | Lenis init, anchor scrolling, rAF loop, destroy |
| `ToolskinLocomotive` | Optional parallax integration |
| `ToolskinSlider` | `[data-ts-slider]` carousels |
| `ToolskinTabs` | `.ts-tabs` |
| `ToolskinModal` | Modal open/close/backdrop |
| `ToolskinToast` | Toasts |
| `ToolskinToggle` | Collapse panels |
| `ToolskinObserver` | Scroll reveal (IO) |
| `ToolskinGSAPReveal` | Scroll reveal (GSAP) |
| `ToolskinMarquee` | `.ts-marquee` |
| `ToolskinViewportManager` | Visibility / perf hooks |
| `ToolskinParallaxFallback` | When `animation-timeline: view()` unsupported |
| `ToolskinIcons` | Injects FA / `ion-icon` from `data-icon` / `data-ts-icon`; icon position attributes |
| `ToolskinRange` | Enhances range inputs |
| `ToolskinCursor` | Custom cursor DOM + rAF |
| `ToolskinLayout` | Applies layout-related tokens |
| `ToolskinDynamicNav` | Primary nav overflow → “More” |
| `ToolskinMobileMenu` | Mobile menu behavior |
| `ToolskinGridBg` | Animated grid background |
| `ToolskinTooltip` | Delegated tooltips |
| `ToolskinPreloader` | Progress bar, fonts `ready`, dismiss, `ts-preloader-lock` on `documentElement` |

**`Toolskin` singleton:** `init`, `destroy`, `refresh`, `initTooltips`, theme/accent API, surface preset API, `openModal` / `showToast`, marquees/sliders re-init, dispatches **`ts:ready`**.

**Auto-init:** At end of file, merges `window.__TOOLSKIN_CONFIG__` and runs `Toolskin.init` on `DOMContentLoaded` (or immediately if already loaded).

**Commented legacy block:** Older `ToolskinIcons` implementation is left inside `/* ... */` (lines ~2609–2658) — not active.

---

## 5. UI Kit JS (`assets/js/toolskin-uikit.js`)

**Namespace:** `window.ToolskinUIKit`

**Exports:**

- `init(root)` — scans for `.ts-ui-accordion`, `.ts-ui-select`, `.ts-ui-spinner`, draggable/resizable/sortable wrappers, sortable tables, bulk table wraps, `.ts-ui-masonry--v2`, enhances number inputs, sets global select click-outside/Escape.
- `Accordion`, `AccordionFromSchema(container, schema)`
- `Select`, `Spinner`, `Draggable`, `Resizable`, `Sortable`
- `Toast` (object `TSUIToast`)
- `TableSort`, `TableBulk`
- `EnhanceNumberInput`, `EnhanceNumberInputsIn`
- `MasonryGrid`

**Auto-run:** On load, calls `init(document)` once.

**Aliases:** Normalizes `.ts-accordion` → `.ts-ui-accordion` and mirrored `data-ts-accordion-*` attributes.

---

## 6. Other first-party JS (assets)

| File | Role |
|------|------|
| `toolskin.bannerGenerator.js` | Banner generator state, canvas export, Google Fonts link injection, Ion SVG bases, uses `ToolskinIonIcons` when present |
| `ts-gradient-canvas.js` | Hero/canvas gradient mesh (2D); loaded on showcase + generators |
| `ts-offcanvas-editor.js` | Optional quick editor; opt-in `html[data-ts-offcanvas-editor]`; exposes `TsOffcanvasEditor` |
| `toolskin.ionicons710.registry.js` | Standalone registry (if used separately from monolithic embed) |
| `mockup-scripts.js` | Shared mockup behaviors |
| `three.min.js`, `three-js-grads.js` | 3D experiments |
| `userscripts/*.user.js` | Monolithic automation panel scripts (not part of design-system runtime) |

**Root-level JS (not under `assets/js/`):** `app.js`, `projects.js`, `phantom-gallery.js`, `corentin-beautified.js` — **violate stated “all js in assets/js” rule**; any consolidation should move + relink.

---

## 7. CSS outside core

| File | Role |
|------|------|
| `toolskin-uikit.css` | UI Kit components |
| `ts-patterns.css` | Pattern classes (`ts-pattern-*`, animation modifiers) |
| `extra-styles.css` | Add-on |
| `generator/patterns.css` | Page-local generator tweaks |
| `*_Automation*.user.css`, `Youtube_*.user.css` | Reference / archive |

---

## 8. Page load matrix (representative)

| Page | CSS | JS (order matters) |
|------|-----|-------------------|
| **index.html** | `toolskin.css` | Inline `__TOOLSKIN_CONFIG__` → `toolskin.js` → `ts-gradient-canvas.js` → `toolskin-uikit.js` → `ts-offcanvas-editor.js` + CDNs: Color, Lenis, Locomotive, GSAP, ST + inline DOMContentLoaded hooks for uikit/schema/icons |
| **toolskin-lab.html** | `toolskin.css` | `toolskin.js`, `toolskin-uikit.js` only (+ inline lab styles) |
| **generator/index.html** | `../assets/css/toolskin.css` + huge inline `:root` | CDNs + `toolskin.js`, `ts-gradient-canvas.js`, `toolskin-uikit.js`, `toolskin.bannerGenerator.js` |
| **generator/patterns.html** | `toolskin.css`, `ts-patterns.css`, `patterns.css` | `toolskin.js`, `toolskin-uikit.js` + inline app |
| **mockup/*.html** | Mixed | Often `mockup-scripts.js`; some load `toolskin.js` |
| **test.html** | minimal | `three`, `gsap`, `./projects.js`, `./app.js`, `assets/js/toolskin.js` |

**`<html>` flags:** Showcase uses `data-ts-offcanvas-editor` on `<html>` (see `index.html` line 2 in prior read).

---

## 9. Generators (integration status)

### Banner (`generator/index.html` + `toolskin.bannerGenerator.js`)

- Canvas 2D export engine (no html2canvas).
- Depends on Ionicons CDN + registry for icon names.
- Duplicates design tokens inline in generator HTML for self-contained theming — **drift risk** vs `toolskin.css`.
- **Stakeholder ask:** Treat banner UI as **reusable component module** for applying patterns to sections site-wide (future).

### Patterns (`generator/patterns.html`)

- Uses `ts-patterns.css`, animation direction chip grid, Toolskin UI select, tabs, code export.
- **`PATTERNS_INTEGRATION_REPORT.md`** documents naming fixes, `ts-pattern-*` catalog, CSS fixes (repeat, `circle` in gradients).

**Status:** Per stakeholder, **generators work and can showcase** — priority is **embedding patterns into core section APIs** and **banner panel parity** in future offcanvas.

---

## 10. Toolskin Lab vs showcase — migration gap

- **Lab** exercises: accordion, select, tables, masonry, spinners, draggable demos — closer to isolated component QA.
- **Showcase** embeds many **one-off** sections and **inline scripts** (token lab grid, surface presets, contrast tuner, accordion-from-schema demo).
- **Gap:** Components and behaviors that exist only in `index.html` inline JS are **not** initialized via `Toolskin.init` / `ToolskinUIKit.init` patterns — **unification** means extracting factories (e.g. `ToolskinShowcase.initTokenLab(el)`) behind `data-ts-*` roots.

---

## 11. Mockups (`mockup/`)

- Entry: `mockup/index.html` links to YSS/Suno/HF-style panels.
- **Purpose:** UX reference for automation toolpanels; **not** the canonical consumer of Toolskin tokens.
- **Tech mix:** jQuery + jQuery UI in some files; Ionicons module in others.
- **Duplicates:** Files with `Copy` in name (see §18).

---

## 12. Preloader — technical diagnosis (FOUC & timing)

**Intended mechanism:**

1. `ToolskinPreloader._init` adds `document.documentElement.classList.add('ts-preloader-lock')` and `.is-visible` on `#ts-preloader`.
2. CSS locks scroll and (when `#ts-app` exists) hides main app until dismiss.

**Showcase failures:**

| Issue | Effect |
|-------|--------|
| No early sync lock | Until deferred `toolskin.js` runs, lock class is missing → scroll/content not suppressed. |
| No `#ts-app` | Rule `html.ts-preloader-lock #ts-app { visibility: hidden }` **never matches**; `#ts-main` stays visible. |
| Default `.ts-preloader` hidden | Until JS adds `.is-visible`, preloader is invisible → **user sees full page** underneath. |
| Heavy JS queue | Deferred script runs late → **~1s** perceived delay before lock matches stakeholder observation. |

**Generators** partially mitigate with **inline critical CSS** in `<head>` forcing preloader visible + high z-index and hiding `#ts-app` — **showcase should replicate or generalize** (single critical snippet in core docs or injected partial).

**`ToolskinPreloader` dismissal:** Waits `load`, optional `document.fonts.ready`, optional `minVisibleMs` / `extraHoldAfterLoadMs` (defaults 0), then dismisses. Not the primary FOUC cause on showcase — **ordering and selectors are**.

---

## 13. Cursor & smooth scrolling (config vs stakeholder goal)

**Today:**

- Defaults already off in `ToolskinConfig`.
- Per-page override: `window.__TOOLSKIN_CONFIG__` (showcase sets both off explicitly).
- **No** `html.has-smooth-scroll` / `html.no-cursor` **first-class** API in core — would require reading `document.documentElement.classList` in `Toolskin.init` or `ToolskinConfig.init`.

**Stakeholder goals:**

- Toggle cursor + smooth scroll with **only a class on `body` or `html`**.
- Keep Lenis optional; add **lighter GSAP-based** smooth alternative; avoid hardcoded `false` in source — use env/class/config precedence.

**Related core code:** `ToolskinSmooth` (Lenis), `Toolskin.cursor` branch in `init`, `destroy()` teardown.

---

## 14. Offcanvas editor — current vs target

**Current (`ts-offcanvas-editor.js` + `.ts-oce-*`):**

- Left-bottom FAB, left panel sliding from **left**, **overlay** with semi-transparent background, **box-shadow** on panel.
- Features: dark/light theme buttons, accent hex apply, sessionStorage open state, Escape close, coordination with `ts:modal-open`.

**Stakeholder target:**

- Panel on the **right**, **no** shadow, **no** overlay scrim (or non-dimming behavior).
- Same **visual language** as banner generator panel (tabs, cards, `ts-ptab`, etc.).
- Future: **live edit** CSS variables for showcase (and any view), **low memory**, global variable management — effectively a **design-token studio** surfaced from sidebar.

**CSS changes needed:** `left` → `right`, `translateX` signs, FAB position, remove overlay styles or make optional; align z-index with generator panel tokens.

---

## 15. Showcase evolution (stakeholder roadmap)

- **Split** monolithic `index.html` into multiple showcase examples: **components** vs **surfaces/labs** vs **theme tests** vs **experiments**.
- **Global variables** edited live should eventually sync with **offcanvas** and persist (localStorage / export) — aligns with `ToolskinTheme` surface preset APIs already in core.

---

## 16. Deployment

- **No** checked-in platform config found; project is static HTML/CSS/JS.
- Suitable for: Cloudflare Pages, GitHub Pages, Netlify Drop, any static host.
- **CDN coupling:** Generators and showcase depend on unpkg/jsdelivr/cdnjs — offline or CSP-strict environments need vendoring.

---

## 17. File hygiene — backups & copies (inventory for `_bu/`)

**Stakeholder rule:** Move `*backup*`, `*copy*`, `*Copy*` files to `_bu` without overwriting — use unique names (timestamp or parent folder).

**Candidates observed (non-exhaustive — re-scan before moves):**

- Moved 2026-03-30 to `_bu/repo-cleanup-2026-03-30/`: generator (`patterns_backup.html`, `index copy.html`, `index - Copy.txt`, `index_destroyed.html`); mockup (four `*Copy*` HTML files); `assets/js/userscripts/Youtube_Toolpanel_4.2.7.user.js.bak_2026-03-24`
- `_bu/` already holds: `showcase.backup.html`, `toolskin.backup.css`, `index_2026-03-14_044422.html`, `ts-gradient-canvas.js`, plan/layout dated `.bak` files, duplicated YSS HTML snapshots.

**Keep in place:** `test.html`, `toolskin-lab.html`, experiment pages — stakeholder asked to **retain** tests and experiments (only organize backups).

---

## 18. `_bu/` current contents

- `ts-gradient-canvas.js`
- `showcase.backup.html`, `toolskin.backup.css`, `index_2026-03-14_044422.html`
- `yss-toolpanel-modal_*.html` (downloader, scheduler, uploader, help)
- `plan-2026-03-27/` — `toolskin.css.bak`, `toolskin.js.bak`, `index.html.bak`, `toolskin.bannerGenerator.js.bak`
- `layout-refactor-2026-03-28/` — `index.html.bak`, `toolskin.css.bak`

---

## 19. Project history & applied requests (from repo artifacts)

- **`.cursor/plans/`** — `toolskin_core_refactor_phase1_*.plan.md`, `banner_generator_controls_fix_*.plan.md`, `instructions-plan-26-march-2026*.md` — internal planning traces.
- **`PATTERNS_INTEGRATION_REPORT.md`** — Pattern CSS fixes, rename/alias table, integration checklist.
- **`docs/TOOLSKIN_WORKSPACE_REPORT.md`** — Prior workspace map (still useful; **this audit supersedes for 2026-03-30** breadth).
- **`docs/banner-generator-parameter-mapping.md`** — Parameter documentation.
- **Git status (conversation snapshot):** Many paths were untracked at session start — treat repo as **active working tree**, not necessarily clean `main`.

---

## 20. Module / function checklist — nothing omitted (core)

**Toolskin public surface (`window.Toolskin`):**  
`init`, `destroy`, `refresh`, `initTooltips`, `showToast`, `openModal`, `closeModal`, `setTheme`, `toggleTheme`, `getSurfacePresetsCatalog`, `applyDarkSurfacePreset`, `applyLightSurfacePreset`, `resetSurfacePresets`, `applyContrastTweakToSurfaceMaps`, `revertContrastTweakMaps`, `getSurfaceTokenMaps`, `setAccent`, `setAccentHex`, `setRadius`, `setFont`, `scrollTo`, `updateLayout`, plus internal module refs on instance (`theme`, `smooth`, `preloader`, `tooltips`, `modal`, `toast`, `tabs`, `observer`, `gsapReveal`, `range`, `gridBg`, `mobileMenu`, `viewportManager`, `cursor`, `locomotive`, `parallaxFallback`).

**Global helpers:**  
`ToolskinIcons`, `ToolskinIonIcons`, `ToolskinTooltip`, `TOOLSKIN_SURFACE_PRESETS`, `TsOffcanvasEditor` (separate file).

**Events:** `ts:ready`, `ts:modal-open` (consumed by offcanvas).

---

## 21. Prioritized TODO list (for next agent)

### P0 — Preloader & first paint

1. Add **synchronous** (inline in `<head>`) `html.ts-preloader-lock` + critical CSS so preloader is visible and main shell hidden **before** deferred JS — mirror generator `ts-preloader-boot` pattern.
2. Either wrap showcase content in **`#ts-app`** or extend CSS to **`#ts-main`** (or both) under `ts-preloader-lock`.
3. Re-test with throttled CPU/network; tune `preloader.minVisibleMs` only if needed after structural fix.
4. Verify z-index stacking with `nav`, modals, and tooltips after DOM changes.

### P1 — Offcanvas alignment with product vision

5. Refactor `.ts-oce-*` + `ts-offcanvas-editor.js`: **right** dock, **no** overlay dim (or feature flag), **no** panel shadow; optional `push` layout without scrim.
6. Spec **HTML parity** with `generator/index.html` panel (tabs, cards, `ts-field`, `ts-range`, pattern picker) as phased UI migration.

### P1 — Cursor / scroll toggles

7. Implement **class-driven** opt-in/out on `document.documentElement` or `body`, e.g. `ts-enable-cursor`, `ts-disable-lenis`, `ts-enable-gsap-scroll` — merge with `__TOOLSKIN_CONFIG__` precedence documented in `docs/`.
8. Prototype **GSAP-based** smooth scroll (ScrollSmoother or custom) behind feature flag; keep Lenis as optional.

### P2 — Script & style consolidation

9. Extract large `index.html` inline scripts into **`assets/js/toolskin.showcase.js`** (or modular files) with `data-ts-showcase-root` init.
10. Move root `app.js`, `projects.js`, `phantom-gallery.js`, `corentin-beautified.js` into `assets/js/` and update HTML references.
11. Consolidate generator inline tokens with **imports** or build step (or document single source of truth).

### P2 — Banner / patterns as components

12. Expose **pattern application API** for sections (class + `--ts-pattern-*` vars) from one module.
13. Plan **banner generator panel** as embeddable component for future offcanvas “live edit.”

### P3 — Showcase split

14. Split `index.html` into thematic pages; shared head partial or template strategy (11ty, Vite, or manual copy with discipline).

### P3 — Repo hygiene

15. Execute `_bu/` moves with non-colliding names; add `README.md` in `_bu` explaining contents.
16. Add minimal **deployment** doc (static host + CDN notes + optional `wrangler.toml` template if Cloudflare is chosen).

### P3 — Labs completeness

17. Audit `toolskin-lab.html` vs `index.html` — list missing demos; migrate “showcase-only” widgets into lab with shared init.

---

## 22. Quick reference — key file paths

| Concern | Path |
|---------|------|
| Tokens & components | `assets/css/toolskin.css` |
| Runtime | `assets/js/toolskin.js` |
| UI Kit | `assets/css/toolskin-uikit.css`, `assets/js/toolskin-uikit.js` |
| Patterns | `assets/css/ts-patterns.css` |
| Banner logic | `assets/js/toolskin.bannerGenerator.js`, `generator/index.html` |
| Pattern tool | `generator/patterns.html` |
| Offcanvas | `assets/js/ts-offcanvas-editor.js` + `toolskin.css` `.ts-oce-*` |
| Prior handoff | `docs/TOOLSKIN_WORKSPACE_REPORT.md` |
| Patterns report | `PATTERNS_INTEGRATION_REPORT.md` |

---

*End of audit. Implementer should treat this document as the single source of truth for repository state as of 2026-03-30; re-verify line numbers and file counts after large edits.*

# Handoff — Consolidate `ts-nav.js` into the `toolskin.js` engine

**To:** Claude Design agent
**Re:** Fold the standalone `ts-nav.js` navigation runtime back into the canonical `toolskin.js` library (the source of truth).
**Source file:** `ts-nav.js` (standalone, dependency-free, IIFE). Self-contained and annotated for this exact migration.

---

## Goal

`ts-nav.js` is a faithful, dependency-free extraction of the nav runtime, built so pages without the full framework still behave identically to the library. Now consolidate it: move each module into the engine namespace, delete the standalone-only shims, and wire it through `Toolskin.init()` / `Toolskin.config`. **No behavior change** — selectors, class names, attributes, thresholds, and the overflow algorithm already match the library.

## Rename map (TS\* → Toolskin\*)

| Standalone (this file)        | Library target                              | Action |
|-------------------------------|---------------------------------------------|--------|
| `TSDynamicNav` (+ statics)    | `ToolskinDynamicNav`                         | Drop-in replace; `init`/`destroy`/`formatMenuItem` already match |
| `TSMobileMenu`                | `ToolskinMobileMenu`                          | Replace; **keep the static-first adoption** (it's a strict superset) |
| `TSTheme`                     | `ToolskinTheme` (full engine version)        | **Delete** TSTheme; engine owns the surface/accent system |
| `TSNavCollapse`               | `ToolskinNavCollapse` (or a `DynamicNav` concern) | Move; reuses shared registry/config |
| `fitLogoSubtitles`            | `ToolskinLogoLockup` (new module)            | Promote as its own module reading the config flags |
| `TSIcons` (shim)              | `ToolskinIcons` (real, global)               | **Delete** the shim |
| `isShowcase`                  | shared engine predicate                      | Keep; share across modules |
| `resolveLengthPx`/`readTokenPx` | engine shared utils                        | Move to utils |
| `ready()` + bottom `init()`   | `Toolskin.init()` lifecycle                  | Replace bootstrap with engine lifecycle |

## Shared infrastructure to hoist (do this first)

1. **Selector registry** → `Toolskin.selectors`. Move `TS_SELECTORS` + `TS_IDS` + the `TS` helper (`$ / $$ / sel / primary / primaryClass / byId / register`). Every module should resolve selectors through it (no hard-coded selectors in logic).
2. **State classes** → `Toolskin.stateClasses` (`TS_STATE`). Keep the legacy aliases: `at-top` (nav) alongside `is-at-top`/`has-scrolled` (html); `active` alongside `is-visible` (top button). The live CSS keys on `.at-top`, `.is-visible`, and `.active`.
3. **Tokens** → `Toolskin.tokens` (`TS_TOKENS` + `TS_TOKEN_DEFAULTS`).
4. **Config** → `Toolskin.config` (`TS_CONFIG_DEFAULTS` + `resolveConfig`). Preserve the 3-layer merge: defaults ← `window.TSNavConfig` (global header call) ← `init(opts)` (local). Keep folding the legacy `window.TS_NAV_DISABLE_*` flags.

## Module-specific notes

- **DynamicNav:** overflow algorithm (`#ts-primary-menu` / `#navbar-extend` / `#navbar-collapse`, 50px more-reserve, `.hasItems`, 100ms debounce + rAF, `__tsDynamicNav` guard) is verbatim. `_appendToDropdown` honors `ul>li` authored structure — keep it. Scroll machine emits both new + legacy classes — keep both.
- **MobileMenu:** the only delta vs. the library auto-builder is **static-first adoption** — it adopts an existing burger/overlay/drawer instead of building duplicates (fixed the two-burger bug) and re-formats authored drawer items in place. Preserve this.
- **Collapse / breakpoints (two mechanisms, both must survive):**
  1. `TSNavCollapse` toggles `.is-collapsed` / `.is-narrow` **per instance** via `ResizeObserver`, reading `--ts-nav-collapse-at` / `--ts-nav-collapse-at-narrow`.
  2. `refreshMediaBreakpoints()` **tokenizes the existing `@media` px in place via the CSSOM** (rewrites `CSSMediaRule.media.mediaText`), so the stylesheet is never edited. Mapping: `768→--ts-nav-collapse-at`, `420 & 480→--ts-nav-collapse-at-narrow`. Leaves `1140px`, `min-width`, and `max-width:0` *declarations* untouched. Idempotent; re-runs on `load` + `ts:theme-change`.
  - The injected `<style id="ts-nav-collapse-bridge">` mirrors collapse onto the classes, scoped `:not(.ts-nav--static)`. The exact CSS is in `COLLAPSE_BRIDGE_CSS` if you'd rather move it into the stylesheet (then disable via config).
- **Showcase guard:** `isShowcase()` = `.ts-nav--static` OR inside `.ts-harness-stage`. Formatting / adoption / collapse all skip showcases. **Exception:** the logo fitter runs in showcases by default (`config.logoFitInShowcase: true`).

## Config flags to carry over

`theme, dynamicNav, mobileMenu, collapse, mediaTokenize, cssBridge, backToTop, logoFit, logoFitInShowcase, upgradeLegacyThemeToggles` + bucket overrides `selectors / ids / stateClasses / tokens / tokenDefaults`.

## Acceptance checks

- [ ] No duplicate burger/overlay/drawer when static markup exists.
- [ ] `--ts-nav-collapse-at` set inline on one nav moves *that* nav's breakpoint.
- [ ] `@media` px values track the token at runtime (verify via DevTools on the rule's `mediaText`); `1140px`/`min-width` unchanged.
- [ ] `ul>li` dropdown showcases and `.ts-nav--static` navs render unchanged.
- [ ] Logo subtitle width-match applies on live header **and** harness examples.
- [ ] `window.TSNavConfig` (global) and `Toolskin.init({...})` (local) both override; legacy `TS_NAV_DISABLE_*` still works.
- [ ] Scroll state sets `.at-top` + `.is-at-top`/`.has-scrolled`; top button gets `.is-visible` + `.active`.

## Search anchors

Every module carries a `MIGRATION:` comment with its specific instruction — grep `MIGRATION` in `ts-nav.js` and follow each in place.

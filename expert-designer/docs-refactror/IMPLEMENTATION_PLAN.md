# Toolskin Showcase — Implementation Plan
> Source: `docs/TOOLSKIN_FULL_PROJECT_AUDIT_HANDOFF.md` (audit date: 2026-03-30)  
> Backup baseline: `_bu/audit-baseline-2026-03-30/`  
> Status: **READY TO IMPLEMENT — no code changes applied yet**

---

## Pre-work checklist (done)
- [x] Full audit read and knowledge base settled (`docs/TOOLSKIN_FULL_PROJECT_AUDIT_HANDOFF.md`)
- [x] Baseline backup created: `_bu/audit-baseline-2026-03-30/` (index.html, toolskin-lab.html, all assets/css, all assets/js core files)

---

## P0 — Preloader & First Paint (FOUC fix)
**Problem:** Showcase flashes full page content before deferred `toolskin.js` runs.  
**Root causes (verified in audit §12):**
- No synchronous `ts-preloader-lock` class on `<html>` before paint
- `index.html` uses `<main id="ts-main">` — CSS lock rule targets `#ts-app` which doesn't exist
- `.ts-preloader` starts hidden until JS adds `.is-visible`

### Tasks
- [ ] **P0-1** — Add inline `<head>` sync snippet to `index.html`: adds `ts-preloader-lock` to `<html>` + critical CSS making `.ts-preloader` visible and hiding main content — mirror the `generator/` `ts-preloader-boot` pattern exactly
- [ ] **P0-2** — Either wrap `<main id="ts-main">` in `<div id="ts-app">` OR extend `toolskin.css` preloader lock rule to also cover `#ts-main` (alongside existing `#ts-app` rule)
- [ ] **P0-3** — Re-test with throttled CPU/network after structural fix; only tune `preloader.minVisibleMs` if still needed
- [ ] **P0-4** — Verify z-index stacking: nav, modals, tooltips, offcanvas all remain above/below preloader as intended after DOM changes

**Files:** `index.html`, `assets/css/toolskin.css`

---

## P1 — Offcanvas Editor: Right Dock + No Overlay
**Problem:** Current panel docks left with overlay scrim and box-shadow; target is right dock, no dim, no shadow.  
**Root causes (audit §14):** CSS `left` positioning, `translateX` signs, FAB position, overlay styles all hardcoded left.

### Tasks
- [ ] **P1-1** — Refactor `.ts-oce-*` in `toolskin.css`: change `left` → `right`, flip `translateX` sign on panel slide, reposition FAB to bottom-right, remove overlay background-color / opacity or make it a feature flag (`ts-oce--no-overlay`)
- [ ] **P1-2** — Update `ts-offcanvas-editor.js` to match: any `left`/`right` JS logic, push-layout offset direction
- [ ] **P1-3** — Remove `box-shadow` from `.ts-oce-panel`; align z-index with generator panel tokens
- [ ] **P1-4** — (Phase 2) Spec HTML parity with `generator/index.html` panel: tabs (`ts-ptab`), cards, `ts-field`, `ts-range`, pattern picker — tracked here, implement after P1-1–3 confirmed

**Files:** `assets/css/toolskin.css` (`.ts-oce-*` block), `assets/js/ts-offcanvas-editor.js`

---

## P1 — Cursor & Smooth Scroll: Class-Driven Toggles
**Problem:** No first-class HTML class API to enable/disable cursor or smooth scroll — requires JS config object.  
**Root causes (audit §13):** `ToolskinConfig.defaults` has both off; `Toolskin.init` does not read `classList` of `documentElement`.

### Tasks
- [ ] **P1-5** — Add class-driven opt-in/out to `Toolskin.init` in `toolskin.js`: read `html.ts-enable-cursor` → override `cursor.enabled: true`; read `html.ts-disable-lenis` → override `smoothScroll.enabled: false`; read `html.ts-enable-gsap-scroll` → prototype GSAP smooth path
- [ ] **P1-6** — Document precedence order in `docs/TOOLSKIN_USAGE_GUIDE.md`: HTML class → `__TOOLSKIN_CONFIG__` → `ToolskinConfig.defaults`
- [ ] **P1-7** — Prototype GSAP ScrollSmoother (or custom rAF) as alternative behind `ts-enable-gsap-scroll`; keep Lenis untouched as parallel option

**Files:** `assets/js/toolskin.js` (`ToolskinConfig.init`, `Toolskin.init`), `docs/TOOLSKIN_USAGE_GUIDE.md`

---

## P2 — Script & Style Consolidation
**Problem:** Large inline `<script>` blocks in `index.html`; root-level JS files outside `assets/js/`.

### Tasks
- [ ] **P2-1** — Extract token lab, schema accordion, surface lab, contrast tuner inline scripts from `index.html` → new file `assets/js/toolskin.showcase.js`; init via `data-ts-showcase-root` attribute pattern
- [ ] **P2-2** — Move root `app.js`, `projects.js`, `phantom-gallery.js`, `corentin-beautified.js` → `assets/js/`; update all `<script src>` references in `test.html`, `corentin.html`, `ts-phantom-portfolio.html`, `cube-portfolio.html`
- [ ] **P2-3** — Audit generator inline `:root` token block in `generator/index.html` vs `toolskin.css`; document drift, create single source of truth note or sync step

**Files:** `index.html`, `assets/js/toolskin.showcase.js` (new), `assets/js/` (moved files), affected experiment HTML files

---

## P2 — Banner & Patterns as Components
**Problem:** Pattern application and banner panel exist only as standalone generator pages; not embeddable.

### Tasks
- [ ] **P2-4** — Expose pattern application API in `ts-patterns.css` / a small JS module: a function that applies `ts-pattern-*` class + `--ts-pattern-*` CSS vars to any target element
- [ ] **P2-5** — Plan (spec doc only for now) how `generator/index.html` banner panel becomes an embeddable component for the future offcanvas "live edit" feature

**Files:** `assets/css/ts-patterns.css`, `assets/js/toolskin.showcase.js` (pattern API), `docs/` (spec)

---

## P3 — Showcase Split
**Problem:** `index.html` is monolithic; hard to navigate and maintain.

### Tasks
- [ ] **P3-1** — Split `index.html` into thematic pages: `showcase-components.html`, `showcase-surfaces.html`, `showcase-theme.html`; retain `index.html` as a hub/landing
- [ ] **P3-2** — Establish shared `<head>` partial strategy (manual discipline or lightweight templating)

**Files:** `index.html` → multiple HTML files

---

## P3 — Repo Hygiene
### Tasks
- [ ] **P3-3** — Complete remaining `_bu/` moves: any `*Copy*`, `*backup*`, `*_destroyed*` files not yet moved; add `_bu/README.md` describing all backup folders
- [ ] **P3-4** — Add `docs/DEPLOYMENT.md`: static host options, CDN notes, optional `wrangler.toml` template for Cloudflare Pages

---

## P3 — Labs Completeness
### Tasks
- [ ] **P3-5** — Audit `toolskin-lab.html` vs `index.html`: list components only demoed in showcase; migrate missing ones into lab with shared `ToolskinUIKit.init` pattern

---

## Execution order
```
P0-1 → P0-2 → P0-3/4   (FOUC — highest risk, do first)
P1-1 → P1-2 → P1-3     (offcanvas right-dock)
P1-5 → P1-6            (class-driven toggles)
P2-1 → P2-2 → P2-3     (consolidation)
P2-4 → P2-5            (component APIs)
P3-* (any order)        (hygiene / split / labs)
```

## Key file reference
| Concern | File |
|---------|------|
| Preloader critical CSS + lock | `assets/css/toolskin.css` |
| Preloader sync snippet | `index.html` `<head>` |
| Offcanvas CSS | `assets/css/toolskin.css` (`.ts-oce-*`) |
| Offcanvas JS | `assets/js/ts-offcanvas-editor.js` |
| Class toggle logic | `assets/js/toolskin.js` |
| Inline script extraction | `index.html` → `assets/js/toolskin.showcase.js` |
| Pattern API | `assets/css/ts-patterns.css` |
| Backup baseline | `_bu/audit-baseline-2026-03-30/` |

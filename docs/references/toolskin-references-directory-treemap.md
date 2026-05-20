# Toolskin References — Directory Treemap

**Root:** `docs/references/`
**Generated:** 2026-05-20
**Source:** `tree /F` scan of full folder + file contents

---

## Top-level summary

| # | Folder | Purpose (inferred) |
|---|---|---|
| 1 | `branding/` | Brand assets — logos, fonts, demos, previews, uploads |
| 2 | `generator/` | Banner-generator reference app + presets |
| 3 | `mockup/` | Toolpanel/modal HTML mockups (hf, suno, yss) + layout blueprint |
| 4 | `pitchdeck/` | Pitch-deck versions, archived CSS, briefings |
| 5 | `treemap-module/` | Tree-explorer UI + data + Python/JS build tools + screenshots |
| 6 | `wireframe-blueprint-module/` | Wireframe blueprint HTML previews |
| 7 | `_components-docs/` | Component reference docs + Template-system adaptation plan |
| 8 | `_Toolskin-Docs (old)/` | Legacy Toolskin docs (audit, usage, workspace report) |

---

## Full tree

```
docs/references/
├── branding/
│   ├── index.html
│   ├── README.md
│   ├── assets/
│   │   └── grainy-noise.gif
│   ├── demos/
│   │   ├── dev-ide.html
│   │   ├── game-hud.html
│   │   ├── marketing.html
│   │   ├── masonry-test.html
│   │   ├── mobile-app.html
│   │   └── saas-dashboard.html
│   ├── fonts/
│   │   ├── JetBrainsMono-Italic-VariableFont_wght.ttf
│   │   ├── JetBrainsMono-VariableFont_wght.ttf
│   │   └── SpaceGrotesk-VariableFont_wght.ttf
│   ├── logos/
│   │   ├── icon-legacy.svg
│   │   ├── JetBrainsMono.ttf
│   │   ├── SpaceGrotesk.ttf
│   │   ├── symbols.svg
│   │   ├── toolskin-icon.svg
│   │   ├── toolskin-logo-light.html
│   │   ├── toolskin-logo-light.svg
│   │   ├── toolskin-logo.html
│   │   ├── toolskin-logo.svg
│   │   ├── toolskin-wordmark.html
│   │   ├── toolskin-wordmark.svg
│   │   └── _broke/
│   │       ├── icon-legacy.svg
│   │       ├── symbols.svg
│   │       ├── toolskin-icon.svg
│   │       ├── toolskin-logo-light.svg
│   │       ├── toolskin-logo.svg
│   │       └── toolskin-wordmark.svg
│   ├── previews/
│   │   ├── audit.html
│   │   ├── colors.html
│   │   ├── components-buttons.html
│   │   ├── components-cards.html
│   │   ├── components-forms.html
│   │   ├── spacing-radius.html
│   │   ├── toolskin-logo.html
│   │   └── typography.html
│   └── uploads/
│       ├── compass_artifact_wf-61448914-62e6-4cb1-9e69-16a7fb1dc38f_text_markdown.md
│       ├── pasted-1777786381600-0.png
│       ├── pasted-1777786424874-0.png
│       ├── pasted-1777787379987-0.png
│       ├── screencapture-localhost-8002-2026-05-03-02_50_26 (1).jpg
│       ├── screencapture-localhost-8002-2026-05-03-02_50_26.png
│       ├── toolskin-extras.css
│       ├── toolskin.css
│       └── toolskin_brand_identity_proposal_v2.html
│
├── generator/
│   ├── banner-generator-parameter-mapping.md
│   ├── index.html
│   ├── patterns.html
│   ├── PATTERNS_INTEGRATION_REPORT.md
│   ├── assets/
│   │   └── js/
│   │       ├── toolskin-assets.js
│   │       ├── toolskin-uikit.js
│   │       ├── toolskin.bannerGenerator.js
│   │       ├── ts-gradient-canvas.js
│   │       └── ts-offcanvas-editor.js
│   └── presets/
│       ├── preset-1.json
│       ├── preset-2.json
│       └── preset-3.json
│
├── mockup/
│   ├── hf-toolpanel-mockup.html
│   ├── hf-toolpanel-modal_dashboard-import.html
│   ├── hf-toolpanel-modal_dashboard.html
│   ├── hf-toolpanel-modal_help.html
│   ├── index.html
│   ├── suno-toolpanel-mockup.html
│   ├── suno-toolpanel-modal_help.html
│   ├── suno-toolpanel-modal_queue.html
│   ├── suno-toolpanel-modal_settings.html
│   ├── suno-toolpanel-modal_trackstatus.html
│   ├── yss-toolpanel-modal_calendar.html
│   ├── yss-toolpanel-modal_disablenotifs.html
│   ├── yss-toolpanel-modal_downloader.html
│   ├── yss-toolpanel-modal_help.html
│   ├── yss-toolpanel-modal_readme.html
│   ├── yss-toolpanel-modal_scheduler.html
│   ├── yss-toolpanel-modal_scheduler_real.html
│   ├── yss-toolpanel-modal_summary_downloader.html
│   ├── yss-toolpanel-modal_summary_notifs.html
│   ├── yss-toolpanel-modal_theme.html
│   ├── yss-toolpanel-modal_transcript_summary.html
│   ├── yss-toolpanel-modal_undraft.html
│   ├── yss-toolpanel-modal_uploader.html
│   ├── yss-toolpanel-studio-mockup.html
│   ├── yss-toolpanel-watch-mockup.html
│   └── mockup-page_layout-blueprint-design/
│       ├── mockup-page_layout-blueprint-design.ai
│       ├── mockup-page_layout-blueprint-design.jpg
│       ├── mockup-page_layout-blueprint-design_01_simulated-view.jpg
│       ├── mockup-page_layout-blueprint-design_02_elements-outline.jpg
│       ├── mockup-page_layout-blueprint-design_02_OUTLINE-padding-gutters-radius-globalvariables.jpg
│       ├── mockup-page_layout-blueprint-design_04_OUTLINE-footer-depending-height-token-padiding-radius-layout-varibles..jpg
│       ├── mockup-page_layout-blueprint-design_05_OUTLINE-glow-section-depending-height-token-padiding-radius-layout-varibles..jpg
│       ├── mockup-page_layout-blueprint-design_06_OUTLINE-all-the-implicated-footer+section-variabes-that-must-be-calculated-to-keep-stable-responsive-the-boxed-container-outline-combined-style.jpg
│       └── mockup-page_layout-blueprint-design_grid.png
│
├── pitchdeck/
│   ├── SSToolCore_Business_Pitch(another-pitch-pending-to-integrate).html
│   ├── Toolskin Pitchdeck v3.2 (with slider)_fixes-v3.html
│   ├── Toolskin Pitchdeck v3.2-no-slider.html
│   ├── Toolskin Pitchdeck-v1(stable-version).html
│   ├── Toolskin Pitchdeck-v2(pre-canonical-code-version-original-owner-design).html
│   ├── toolskin-expanded-briefing.md
│   ├── toolskin-partner-briefing.md
│   ├── archive-css-files/
│   │   ├── toolskin-deck.css
│   │   ├── toolskin-deck_RECOVERED.css
│   │   ├── toolskin-deck_v0.2.css
│   │   ├── toolskin-pitchdeck - Copy.css
│   │   ├── toolskin-pitchdeck_recovered-ASSHOLE_2 - Copy.css
│   │   └── toolskin-pitchdeck_recovered-ASSHOLE_2.css
│   ├── md-files/
│   │   ├── PITCH-DECK-COMPONENT-PATTERNS.md
│   │   ├── PITCH-DECK-IMPROVEMENTS-LOG.md
│   │   ├── SKILL.harmonic-pitchdeck.md
│   │   └── Toolskin Pitchdeck v3.2 HANDOFF.md
│   └── un-fixed-versions-to-keep/
│       ├── pitch_deck_v2_expansion(info-pending-tointegrate).html
│       ├── Toolskin Pitchdeck v3.2 (with slider).html
│       ├── Toolskin Pitchdeck v3_.html
│       └── Toolskin Pitchdeck v3___STABLE-CANDIDATE(not-integrated).html
│
├── treemap-module/
│   ├── toolskin-assets-map.json
│   ├── tree-explorer.data.json
│   ├── tree-explorer.dedup.json
│   ├── tree-explorer.html
│   ├── docs/
│   │   ├── toolskin-showcase-tree.json
│   │   ├── toolskin-tree-iteration-report.md
│   │   ├── toolskin-tree-session-handoff.md
│   │   ├── toolskin-tree-standalone-uses.md
│   │   └── tasks-archive(read)/
│   │       ├── popover-migration-brief-CORRECTED.md
│   │       ├── Pure CSS tree view with custom tree icons - Summary.html
│   │       ├── tree-sync-protocol.md
│   │       ├── treemap-commit-brief-v2-FINAL-2026-05-16.md
│   │       ├── treemap-commit-brief-v3-FINAL-2026-05-16 (1).md
│   │       └── treemap-commit-brief-v5-AUTONOMOUS-2026-05-16.md
│   ├── tools/
│   │   ├── build-asset-map.js
│   │   ├── build-asset-map.test.js
│   │   ├── build_tree_full_html-interactive.py
│   │   ├── deep_tree_map.py
│   │   ├── deep_tree_mapv1.py
│   │   └── deep_tree_mapv2-component-extractor.py
│   ├── treemap-ui-screenshots-17-05-2026/
│   │   ├── treemap-ui-screenshot-17-05-2026-top.png
│   │   ├── treemap-ui-screenshot-17-05-2026-treemap-ui-explorer-viewport--medium.png
│   │   ├── treemap-ui-screenshot-17-05-2026-treemap-ui-explorer-viewport--mopbile_ THE CHIPS FILTER NEEDS  RESIZING FIX!!!.png
│   │   ├── treemap-ui-screenshot-17-05-2026-treemap-ui-explorer.png
│   │   └── treemap-ui-screenshot-17-05-2026.png
│   ├── _archived/
│   │   ├── ANALYZER.html
│   │   ├── ANALYZER2.html
│   │   └── DRIVE_EXPLORER.html
│   └── _tree_output/
│       ├── tree.md
│       └── tree.txt
│
├── wireframe-blueprint-module/
│   ├── pitchdeck-wireframe-blueprint-generation-preview-addapted_to_toolskin_design-2.html
│   ├── pitchdeck-wireframe-blueprint-generation-preview-addapted_to_toolskin_design.html
│   ├── pitchdeck-wireframe-blueprint-generation-preview.html
│   └── sketch-toolskin_wireframe_blueprint_component.html
│
├── _components-docs/
│   ├── component-consolidation-directives.md
│   ├── Ionicons 7.1.0 Cheatsheet.html
│   ├── pending-modular-integration.md
│   ├── toolskin-masonry-docs.md
│   ├── ts-cube-portfolio-audit.md
│   ├── ts-feat-list-refactored.css
│   └── Template system - Toolskin Adaptation Plan/
│       ├── AUDIT.md
│       ├── SKILLS_INDEX.csv
│       ├── TOOLSKIN_ADAPTATION_PLAN.md
│       └── typeui-haul.zip
│
└── _Toolskin-Docs (old)/
    ├── QUICK_REFERENCE.md
    ├── README.md
    ├── TOOLSKIN_FULL_PROJECT_AUDIT_HANDOFF.md
    ├── TOOLSKIN_USAGE_GUIDE.md
    └── TOOLSKIN_WORKSPACE_REPORT.md
```

---

## Per-folder index

### 1. `branding/`
Brand asset library — logos in multiple variants, variable fonts (Space Grotesk, JetBrains Mono), six demo HTML pages exercising the system, eight component preview pages (colors, typography, buttons, cards, forms, spacing/radius, audit, logo), and `uploads/` containing pasted screenshots, the `compass_artifact` markdown reference, and the legacy `toolskin.css` + `toolskin-extras.css`. `logos/_broke/` holds superseded SVG variants kept for diffing.

### 2. `generator/`
Banner-generator reference app — single-page HTML (`index.html`, `patterns.html`), JS modules in `assets/js/` (banner generator core, gradient canvas, off-canvas editor, asset library, UI kit), three saved presets, and integration-report markdowns.

### 3. `mockup/`
Toolpanel/modal mockup gallery covering three apps: **hf** (dashboard/import/help), **suno** (queue/settings/track/help), **yss** (calendar, downloader, scheduler, uploader, theme, transcript summary, watch + studio mockups). `mockup-page_layout-blueprint-design/` contains the Illustrator source + six JPG/PNG outline variants showing padding, gutters, radius variables, footer height token, glow section, and the combined footer+section responsive outline (variant `_06`).

### 4. `pitchdeck/`
Pitch-deck evolution — v1 stable, v2 pre-canonical, v3 / v3.2 (with and without slider), plus an "SSToolCore Business Pitch" candidate. Briefings in `.md`. `archive-css-files/` keeps recovered/legacy CSS. `md-files/` contains component-pattern docs, improvement log, the `SKILL.harmonic-pitchdeck.md`, and the v3.2 handoff. `un-fixed-versions-to-keep/` preserves unfixed but historically important variants.

### 5. `treemap-module/`
Self-contained tree explorer — `tree-explorer.html` UI + dedup'd JSON data + asset map. `docs/` holds the showcase tree dump, iteration report, session handoff, standalone-uses doc, and `tasks-archive(read)/` (popover migration, tree-sync protocol, three commit briefs). `tools/` has the Python tree generators (v1 / v2 / interactive) and the JS asset-map builder with tests. `treemap-ui-screenshots-17-05-2026/` documents the UI state (incl. a known mobile chip-filter resize bug). `_archived/` keeps prior analyzer/explorer HTML.

### 6. `wireframe-blueprint-module/`
Three preview HTMLs of the pitchdeck wireframe-blueprint generator (raw + two Toolskin-design adaptations) plus a standalone sketch component.

### 7. `_components-docs/`
Component-level reference — consolidation directives, Ionicons 7.1.0 cheatsheet, pending modular integration notes, masonry docs, cube-portfolio audit, refactored feat-list CSS. `Template system - Toolskin Adaptation Plan/` contains the AUDIT, skills index CSV, adaptation plan, and the `typeui-haul.zip` package.

### 8. `_Toolskin-Docs (old)/`
Legacy Toolskin documentation snapshot — quick reference, README, full project audit handoff, usage guide, workspace report. Read-only history.

---

## Notes

- File counts include nested subfolders.
- Two folders prefixed with `_` (`_components-docs/`, `_Toolskin-Docs (old)/`) and two with `_` inside `treemap-module/` (`_archived/`, `_tree_output/`) — convention for archived / legacy material.
- `branding/logos/_broke/` mirrors the parent `logos/` SVGs for the broken-variant set.
- Filenames preserved verbatim (including typos like `mopbile`, `padiding`, `varibles`, `ASSHOLE_2`) so this map matches disk reality.

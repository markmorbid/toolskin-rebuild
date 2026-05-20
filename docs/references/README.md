# TOOLSKIN — Design System v1.0.0

## 1. IDENTITY

**Project:** Toolskin Design System v1.0.0
**Type:** Token-driven, framework-independent CSS design system
**Scope:** WordPress themes, web applications, UI toolkits
**Origin:** Consolidated from YSS Toolpanel, Toolcore Framework, Degent WordPress theme, Banner Generator UI
**Owner:** Satoshi / SatSea
**Prefix:** `.ts-` (visual/layout), `.tk-` (programmatic/JS), `.ts-ui-*` (UIKit)
**Philosophy:** Zero framework dependencies. One stylesheet. Full dynamic control.

## 2. STRUCTURE

```
toolskin-showcase/
├── index.html                     # Main showcase: hero, components, theme toggle, accent swatches, palette grid
├── toolskin-lab.html              # UI Kit component lab: controls, tables, accordion, masonry, API snippets
├── assets/
│   ├── css/
│   │   ├── toolskin.css           # ★ Core design system (~8.5k+ lines) — THE source of truth
│   │   ├── toolskin-uikit.css     # UI Kit companion (ts-ui-* components)
│   │   ├── extra-styles.css       # Add-on / page-specific styles
│   │   ├── ts-patterns.css        # Pattern library
│   │   └── *.user.css             # Archived userscript styles (reference only)
│   └── js/
│       ├── toolskin.js            # ★ Core runtime: ToolskinTheme, setAccent, tabs, modals, toasts, Lenis, cursor
│       ├── toolskin-uikit.js      # UI Kit: accordion, select, table sort/bulk, draggable, resizable, masonry
│       ├── ts-gradient-canvas.js  # Gradient canvas effects
│       ├── three-js-grads.js      # Three.js gradient backgrounds
│       └── userscripts/           # Large userscript ports (YouTube panel, etc.)
├── mockup/                        # HTML mockups (toolpanels, modals) — reference layouts
├── generator/                     # Banner / pattern generator mini-apps + presets
├── docs/                          # Human docs (README.md, QUICK_REFERENCE.md, TOOLSKIN_USAGE_GUIDE.md)
│   ├── decisions/                 # Architecture Decision Records
│   └── runbooks/                  # Operations guides
├── .claude/                       # Agent configuration (Claude Code)
│   ├── settings.json
│   ├── hooks/pre-commit.sh
│   └── skills/expert-designer/    # Installed design skill
├── tools/scripts/                 # Build & health check scripts
├── CLAUDE.md                      # This file
└── .gitignore
```

## 3. CONVENTIONS

### File roles
| File | Role |
|------|------|
| `assets/css/toolskin.css` | Single source of design tokens (`--ts-*`), layout, surfaces, components, utilities, dark default + `[data-theme="light"]` |
| `assets/js/toolskin.js` | `Toolskin` runtime: theme, accent, tabs, modals, toasts, tooltips, smooth scroll (Lenis), observers, cursor, `init()` |
| `assets/css/toolskin-uikit.css` | Optional UI Kit: `ts-ui-*` components + aliases |
| `assets/js/toolskin-uikit.js` | `window.ToolskinUIKit`: accordion, select, table sort/bulk, toast, draggable, resizable, sortable, masonry, Firefox scrollbar |
| `index.html` | Main marketing/showcase: hero, components, theme toggle, accent swatches, palette/surface swatch grid (JS), marquee, masonry |
| `toolskin-lab.html` | UI Kit lab: controls, tables, accordion, masonry demos, API snippets |
| `mockup/` | Static HTML prototypes — reference for layouts, not canonical |
| `generator/` | Banner/pattern generator mini-apps |

### CSS rules
- ALL custom properties use `--ts-` prefix (non-negotiable namespace)
- Token hierarchy: Primitives → Computed (color-mix/calc) → Component
- Color engine: HSL-based with `color-mix()` derivation from `--ts-accent-h/s/l`
- Spacing: 4px base × multiplier (`--ts-sp-1` through `--ts-sp-24`)
- Surfaces: 6-level depth (`--ts-bg-body` → `--ts-bg-5`)
- Classes: BEM-like (`.ts-card`, `.ts-card__header`, `.ts-card--featured`)
- UIKit classes: `.ts-ui-*` prefix (separate namespace from core)

### JavaScript rules
- Core namespace: `Toolskin.*` (theme, accent, modals, toasts, tabs, scroll, cursor)
- UIKit namespace: `window.ToolskinUIKit.*`
- No framework dependencies. `defer` loading. Auto-init on DOMContentLoaded.

### Editing workflow
- Edit `assets/css/toolskin.css` for core tokens and components
- Edit `assets/css/toolskin-uikit.css` for UIKit-specific styles
- Test against `index.html` (showcase) and `toolskin-lab.html` (UIKit lab)
- NEVER modify mockup/ files as canonical — they're reference only

## 4. SKILLS

### Installed
- `expert-designer` — Visual design, CSS implementation, Toolskin tokens, Enfold builder, self-learning

### Discovery
```bash
npx skills find [keyword]     # Search https://skills.sh/
npx skills check              # Check for updates
npx skills add <repo> --skill <name>  # Install new skill
```

## 5. COMMANDS

```bash
# Development
open index.html                # View main showcase
open toolskin-lab.html         # View UIKit lab

# Quality
bash tools/scripts/health-check.sh   # Project health check

# Theme testing (browser console)
Toolskin.setAccentHex('#2efc86')     # Test accent change
Toolskin.setRadius(6)                 # Test radius change
```

## 5b. CDN ASSET DEPENDENCIES (pinned versions)

All external CDN assets are loaded dynamically by `assets/js/toolskin-assets.js`.
**Do NOT use `version: 'latest'`** for any asset where CSS rendering depends on the loaded version.

| Asset | Version | Pin Strategy | Risk if changed |
|-------|---------|-------------|-----------------|
| Font Awesome | `6.7.2` | **Exact pin** | FA7 breaks `content:` icons (different font-family name) |
| Ionicons | `@7` | Major pin | Web component API stable within major |
| Lenis CSS/JS | `@1` | Major pin | CSS/JS API stable within major |
| GSAP | `3.13.0` | Exact pin | Low risk but pinned for stability |
| GSAP ScrollTrigger | `3.13.0` | Exact pin | Must match GSAP version |
| Locomotive Scroll | latest | Unpinned | Low risk — no CSS deps |
| Color.js | latest | Unpinned | Utility lib — no CSS deps |

**CSS token**: `--ts-fontawesome-family: "Font Awesome 6 Free", "Font Awesome 7 Free"` (forward-compat fallback)
**Cache**: `localStorage` with `ts-cdn-` prefix, 24h TTL. Stale FA cache purged on boot.
**Google Fonts**: Loaded render-blocking in `<head>` (Space Grotesk, JetBrains Mono). NOT in asset loader.

## 6. GUARDRAILS

- **NEVER** read .env files or expose secrets
- **NEVER** force-push or delete files recursively
- **NEVER** modify `--ts-accent-h/s/l` primitives without user confirmation
- **NEVER** break the `--ts-` prefix namespace
- **NEVER** introduce framework dependencies into core CSS/JS
- **NEVER** edit files in `mockup/` as if they're canonical source
- **ALWAYS** preserve backward compatibility with existing `.ts-*` classes
- **ALWAYS** test changes against both index.html AND toolskin-lab.html
- **ALWAYS** keep toolskin.css as the single source of truth for tokens

## 7. CONTEXT

### Token architecture
```
PRIMITIVES (edit these)    --ts-accent-h: 18;  --ts-bg-body: #0c0d0f;  --ts-radius-base: 10px;
        ↓ (color-mix, calc)
COMPUTED (auto-derived)    --ts-accent: hsl(h,s,l);  --ts-accent-dim: color-mix(...);
        ↓ (referenced)
COMPONENT (scoped)         --ts-card-bg: var(--ts-bg-2);  --ts-btn-radius: var(--ts-radius-sm);
```

### WordPress integration
Child theme `customized.css` bridges Enfold variables to Toolskin:
`--maincolor: var(--ts-accent)` — changing `--ts-h` rethemes the entire WordPress site.

### Related projects
- **Toolcore** — JS companion (modal builder, smart buttons, toast manager)
- **Degent WordPress** — Production WP theme using Toolskin
- **Banner Generator** — Canvas tool using Toolskin UI
- **SatSea** — Portfolio/product site using Toolskin

## 8. ACTIVE REFACTOR CONTEXT (2026-04-21)

### Active CSS file
The production CSS loaded by `index.html:89` is `assets/css/toolskin-merged-3.2.6._4.css` (**24,085 lines**), NOT `toolskin.css`. The `toolskin.css` name referenced in §2 STRUCTURE is the **target filename after Phase 4.1 rename**. `assets/css/` currently holds **21 CSS files** (6 versioned `toolskin-merged-*.css` + utility files) — this sprawl is scheduled for resolution.

### Backup convention (non-negotiable)
Before any refactoring wave, copy affected files into `_bu/<label>-YYYY-MM-DD/` preserving the `assets/css/` and `assets/js/` subfolder structure. **Never overwrite existing `_bu/` entries** — always create a new timestamped folder.

### Refactor plan folder
`docs/PRE-REFACTORING-PLAN-15-04-2025/` is the canonical operating contract for this refactor. Read order:
1. `README.md`
2. `TASK.md`
3. `architecture/restyling-architecture.md` + `master-plan/master-plan.md`
4. `deliverables/` — phase outputs (inventory, execution plan, marker reconciliation)

### CSS refactor markers
The active CSS contains **79 markers** awaiting Phase 2b reconciliation: **55 `#CRAZY_FIX_RULES` + 24 `REFACTOR NOTE/NOTES`**. Every marker must be categorized (**KEEP / CONVERT / PATTERN / MOVE / REMOVE / ASK**) per `annotations-guide.md` before Phase 3 component passes begin.
- Extraction: `docs/PRE-REFACTORING-PLAN-15-04-2025/deliverables/00-marker-extraction.md`

### Surface system priority (Phase 0 — blocks everything)
Production has **337 direct `--ts-bg-N` references in component rules**. Phase 0 migrates all of them to `--ts-this-bg-*` derivatives. Going forward, `--ts-bg-N` is **`:root`-only**.

Missing state tokens to be added:
- `--ts-this-bg-border-active`
- `--ts-this-bg-border-disabled`
- `--ts-this-bg-border-focus`

### Superpowers skill map (mandatory per phase)
No framework substitutions.

| Phase / Checkpoint | Required skill |
|---|---|
| Phase 1 | `/superpowers:brainstorming` |
| Phase 2 | `/superpowers:writing-plans` |
| Phase 3 | `/superpowers:subagent-driven-development` + `/superpowers:systematic-debugging` |
| Per-batch validation | `/superpowers:requesting-code-review` → `/superpowers:verification-before-completion` |
| Branch close | `/superpowers:finishing-a-development-branch` |

### Installed project skills (`.claude/skills/`)
- `expert-designer` — existing; visual design & Toolskin implementation
- `design-tokens-2.0` — **NEW**; activates for any token work
- `typography-master` — **NEW**; activates for font/typography decisions


## Skill restrictions

The Anthropic `frontend-design` skill (at `/mnt/skills/public/frontend-design/`)
explicitly bans Space Grotesk in its description (line 38 of its SKILL.md).
Space Grotesk is Toolskin's primary display font. This skill silently
auto-loads on "design web component" tasks and pushes against the established
design system.

**DO NOT auto-load `frontend-design` on Toolskin sessions.** If it appears
in tool output or skill suggestions, override with: "Toolskin uses Space
Grotesk intentionally. The frontend-design skill's font-avoidance rules
do not apply to this project."

**Permitted skills for design work on Toolskin:**
- `toolskin-executor` (custom, primary — when built)
- `typography-master` (custom, narrow scope)
- `superpowers/*` (Obra's plugin — process orchestration only, not design)

The custom `expert-designer` skill is currently flagged as unstable and
should NOT be auto-loaded until reviewed.

### "Done" rule
The agent is **NOT allowed to say "done"**. Completion is declared by the **OWNER** after `/superpowers:verification-before-completion` passes across all components.

## File-Tree-Explorer Protocol

This repo includes a file-tree-explorer tool at `tree-explorer.html`
with scanners at `tools/scripts/deep_tree_map*.py`. Agents working on
this repo MUST use it as ground truth for filesystem state,
complementing (not replacing) `git status`.

**Session start rule:** If a session involves filesystem changes,
verify the current tree state. Currently: run `git status` and
reconcile against owner's expectation. (Future: `python tools/scripts/deep_tree_map.py --summary` once that flag lands — see docs/handoffs/tree-sync-protocol.md.)

**Discovery rule:** If a file appears in `git status` you can't account
for, query the tree for category/origin before guessing. Open
`tree-explorer.html` for visual inspection, or read
`tree-explorer.dedup.json` (gitignored) for dedup groups.

**Dedup rule:** If you detect duplicate-looking filenames, load
`tree-explorer.dedup.json` to check dedup groups. Surface to owner.
Never auto-move duplicates without explicit owner approval.

**Anti-pattern:** Never load the full `tree-explorer.data.json`
(~1.4 MB) into agent context. Read it selectively or use the
forthcoming `--summary` flag.

**Full spec:** `docs/handoffs/tree-sync-protocol.md`



#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════════════════════
# Toolskin Workspace Reorganisation Script
# Generated: 2026-06-04
#
# SAFE TO RUN: moves only, never deletes.
# Run from the PARENT directory that contains both toolskin-rebuild/ and
# toolskin-showcase/ side by side.
#
# Usage:
#   chmod +x docs/workspace-audit/reorg.sh
#   cd /path/to/parent
#   bash toolskin-rebuild/docs/workspace-audit/reorg.sh
#
# What it does:
#   1. Creates _archived/ at toolskin-rebuild root
#   2. Moves deprecated/duplicate files there
#   3. Creates _review/ at toolskin-rebuild root with category subfolders
#   4. Moves review candidates there with dep-bundling
#   5. Creates _review/ at toolskin-showcase root
#   6. Moves showcase review candidates there
#   7. Prints a summary
#
# ABSOLUTE RULE: no deletions. mv only. If a dest already exists, skip.
# ═══════════════════════════════════════════════════════════════════════════

set -e
REBUILD="toolskin-rebuild"
SHOWCASE="toolskin-showcase"

safe_mv() {
  local src="$1" dst="$2"
  if [ ! -e "$src" ]; then
    echo "  SKIP (missing): $src"
    return
  fi
  if [ -e "$dst" ]; then
    echo "  SKIP (exists):  $dst"
    return
  fi
  mkdir -p "$(dirname "$dst")"
  mv "$src" "$dst"
  echo "  MOVED: $src → $dst"
}

echo ""
echo "══════════════════════════════════════════════"
echo " TOOLSKIN WORKSPACE REORG"
echo "══════════════════════════════════════════════"


# ─── 1. ARCHIVED: deprecated in toolskin-rebuild ──────────────────────────
echo ""
echo "── 1. toolskin-rebuild/_archived ────────────────"
mkdir -p "$REBUILD/_archived"

# Past session subdirectory — content already integrated into master
safe_mv "$REBUILD/session5-system-fix" \
        "$REBUILD/_archived/session5-system-fix"

# Transient output folder
safe_mv "$REBUILD/_output" \
        "$REBUILD/_archived/_output"

# Unnamed index copies in expert-designer working folder
safe_mv "$REBUILD/expert-designer/portable-02-components/index - Copy.html" \
        "$REBUILD/_archived/expert-designer-p02-copies/index-copy-1.html"

safe_mv "$REBUILD/expert-designer/portable-02-components/index - Copy (2).html" \
        "$REBUILD/_archived/expert-designer-p02-copies/index-copy-2.html"

# Unnamed copy in the backing kit
safe_mv "$REBUILD/_portable-02-components/index - Copy.html" \
        "$REBUILD/_archived/_portable-02-copies/index-copy.html"


# ─── 2. ARCHIVED: deprecated in toolskin-showcase ─────────────────────────
echo ""
echo "── 2. toolskin-showcase/_archived ───────────────"
mkdir -p "$SHOWCASE/_archived"

# Old session staging files — explicitly broken or temp
safe_mv "$SHOWCASE/_session-staging/toolskin_ruined-1.css" \
        "$SHOWCASE/_archived/session-staging-broken/toolskin_ruined-1.css"

safe_mv "$SHOWCASE/_session-staging/toolskin-ruined-2.css" \
        "$SHOWCASE/_archived/session-staging-broken/toolskin-ruined-2.css"

safe_mv "$SHOWCASE/_session-staging/toolskin - Copy.css" \
        "$SHOWCASE/_archived/session-staging-broken/toolskin-copy.css"

safe_mv "$SHOWCASE/_session-staging/temp-file-to-diff.css" \
        "$SHOWCASE/_archived/session-staging-broken/temp-file-to-diff.css"

# Root-level loose zips in _bu (the named subfolders already contain the content)
safe_mv "$SHOWCASE/_bu/2026-04-08_structural-refactor.zip" \
        "$SHOWCASE/_archived/_bu-zips/2026-04-08_structural-refactor.zip"

safe_mv "$SHOWCASE/_bu/2026-04-10_card-layout-refactor.zip" \
        "$SHOWCASE/_archived/_bu-zips/2026-04-10_card-layout-refactor.zip"

safe_mv "$SHOWCASE/_bu/2026-04-10_dotgrid-pattern-canvas.zip" \
        "$SHOWCASE/_archived/_bu-zips/2026-04-10_dotgrid-pattern-canvas.zip"

safe_mv "$SHOWCASE/_bu/2026-04-11_tab-restructure.zip" \
        "$SHOWCASE/_archived/_bu-zips/2026-04-11_tab-restructure.zip"


# ─── 3. REVIEW: toolskin-rebuild candidates ───────────────────────────────
echo ""
echo "── 3. toolskin-rebuild/_review ──────────────────"
mkdir -p "$REBUILD/_review"

# Gradient bento layout — extract gradient-section + bento patterns
mkdir -p "$REBUILD/_review/gradients-v3-bento"
safe_mv "$REBUILD/expert-designer/portable-02-components/gradients-v3-bento.html" \
        "$REBUILD/_review/gradients-v3-bento/gradients-v3-bento.html"
safe_mv "$REBUILD/expert-designer/portable-02-components/GRADIENTS.md" \
        "$REBUILD/_review/gradients-v3-bento/GRADIENTS.md"

# this-bg v2 showcase — extract surface-system showcase patterns
mkdir -p "$REBUILD/_review/this-bg-v2-showcase"
safe_mv "$REBUILD/expert-designer/portable-02-components/this-bg-v2-showcase.html" \
        "$REBUILD/_review/this-bg-v2-showcase/this-bg-v2-showcase.html"

# Type v2 — extract type scale + button pairing
mkdir -p "$REBUILD/_review/type-v2"
safe_mv "$REBUILD/expert-designer/portable-02-components/toolskin-type-v2.css" \
        "$REBUILD/_review/type-v2/toolskin-type-v2.css"
safe_mv "$REBUILD/expert-designer/portable-02-components/Toolskin Type Scale v2.html" \
        "$REBUILD/_review/type-v2/Toolskin Type Scale v2.html"
safe_mv "$REBUILD/expert-designer/portable-02-components/TYPE-HANDOFF.md" \
        "$REBUILD/_review/type-v2/TYPE-HANDOFF.md"

# Button v3.1 harness — extract enhanced button state matrix
mkdir -p "$REBUILD/_review/ts-btn-v3-1"
safe_mv "$REBUILD/expert-designer/portable-02-components/ts-btn_v3.1.html" \
        "$REBUILD/_review/ts-btn-v3-1/ts-btn_v3.1.html"
safe_mv "$REBUILD/expert-designer/portable-02-components/ts-btn_v3.1_HANDOFF.md" \
        "$REBUILD/_review/ts-btn-v3-1/ts-btn_v3.1_HANDOFF.md"
# dep: btn CSS needed to render
cp      "$REBUILD/expert-designer/portable-02-components/ts-btn_v3.1.css" \
        "$REBUILD/_review/ts-btn-v3-1/ts-btn_v3.1.css" 2>/dev/null || true


# ─── 4. REVIEW: toolskin-showcase candidates ──────────────────────────────
echo ""
echo "── 4. toolskin-showcase/_review ─────────────────"
mkdir -p "$SHOWCASE/_review"

# Banner generator v2 — extract dismissable banner + generator app patterns
mkdir -p "$SHOWCASE/_review/banner-generator"
safe_mv "$SHOWCASE/_bu/banner-generator-v2.html" \
        "$SHOWCASE/_review/banner-generator/banner-generator-v2.html"
safe_mv "$SHOWCASE/_bu/banner-generator.html" \
        "$SHOWCASE/_review/banner-generator/banner-generator-v1.html"

# customized v4amn — latest user-script token layer evolution
mkdir -p "$SHOWCASE/_review/customized-css-evolution"
safe_mv "$SHOWCASE/_bu/customized_v4amn.css" \
        "$SHOWCASE/_review/customized-css-evolution/customized_v4amn.css"
safe_mv "$SHOWCASE/_bu/customized_v4.css" \
        "$SHOWCASE/_review/customized-css-evolution/customized_v4.css"
safe_mv "$SHOWCASE/_bu/customized_v3.css" \
        "$SHOWCASE/_review/customized-css-evolution/customized_v3.css"
safe_mv "$SHOWCASE/_bu/customized_v2.css" \
        "$SHOWCASE/_review/customized-css-evolution/customized_v2.css"
safe_mv "$SHOWCASE/_bu/customized.css" \
        "$SHOWCASE/_review/customized-css-evolution/customized_v1.css"

# Experimental components folder
mkdir -p "$SHOWCASE/_review/experimental-components"
# Note: cp -r used here since experimental-components is a folder
# Replace with mv if you want to move rather than copy
if [ -d "$SHOWCASE/_sandbox/experimental-components" ]; then
  cp -r "$SHOWCASE/_sandbox/experimental-components/." \
        "$SHOWCASE/_review/experimental-components/"
  echo "  COPIED (folder): _sandbox/experimental-components → _review/experimental-components"
  echo "  NOTE: original left in place — delete _sandbox/experimental-components manually after review"
fi

# Unintegrated patches — these belong in the integration queue
if [ -d "$SHOWCASE/docs/_unintegrated-patches" ]; then
  mkdir -p "$SHOWCASE/_review/unintegrated-patches"
  cp -r "$SHOWCASE/docs/_unintegrated-patches/." \
        "$SHOWCASE/_review/unintegrated-patches/"
  echo "  COPIED (folder): docs/_unintegrated-patches → _review/unintegrated-patches"
  echo "  NOTE: original left in place — delete after confirming patches integrated"
fi

# Corentin standalone — interesting independent prototype
mkdir -p "$SHOWCASE/_review/corentin-prototype"
safe_mv "$SHOWCASE/_bu/corentin.html" \
        "$SHOWCASE/_review/corentin-prototype/corentin.html"
safe_mv "$SHOWCASE/_bu/corentin-beautified.js" \
        "$SHOWCASE/_review/corentin-prototype/corentin-beautified.js"


# ─── 5. Write README files in each review folder ──────────────────────────
echo ""
echo "── 5. Writing _review README files ──────────────"

cat > "$REBUILD/_review/gradients-v3-bento/REVIEW-NOTE.md" << 'EOF'
# _review: gradients-v3-bento

**Source:** `expert-designer/portable-02-components/gradients-v3-bento.html`
**Category:** Layout

## Patterns to extract

- Gradient bento grid layout (unequal tile spans with gradient backgrounds)
- `--ts-gradient-*` token usage per tile
- How `toolskin-gradients-v3.css` is applied per bento cell

## Target integration

→ `sandbox/02-components/` gradient component harness
→ `assets/css/next/system/toolskin-gradients-v3.css` (verify token names match)
EOF

cat > "$REBUILD/_review/this-bg-v2-showcase/REVIEW-NOTE.md" << 'EOF'
# _review: this-bg-v2-showcase

**Source:** `expert-designer/portable-02-components/this-bg-v2-showcase.html`
**Category:** System

## Patterns to extract

- Full `--ts-this-bg` v2 system showcase (all 8 surface variants side by side)
- How `--ts-on-surface-auto` resolves on each surface (visual proof)
- Border auto-inversion demo

## Target integration

→ `sandbox/00-design-reference/` token explorer (add this-bg surface matrix)
→ `assets/css/next/system/toolskin-this-bg-v2.css` reference / test
EOF

cat > "$REBUILD/_review/type-v2/REVIEW-NOTE.md" << 'EOF'
# _review: type-v2

**Source:** `expert-designer/portable-02-components/Toolskin Type Scale v2.html`
**Category:** Typography

## Patterns to extract

- Type scale v2 rendering (ladder steps + font pairing)
- Button size / type size co-scaling
- `toolskin-type-v2.css` — check if any tokens are absent from current primitives/typography.css

## Target integration

→ `assets/css/next/primitives/typography.css` (token alignment check)
→ `sandbox/00-design-reference/` type scale section
EOF

cat > "$REBUILD/_review/ts-btn-v3-1/REVIEW-NOTE.md" << 'EOF'
# _review: ts-btn-v3.1

**Source:** `expert-designer/portable-02-components/ts-btn_v3.1.html`
**Category:** Component

## Patterns to extract

- Full button state matrix (default/hover/focus/active/disabled × all variants)
- P-06 smart first/last button spacing in context
- Button scaling token (`--ts-btn-scale`) — verify it's wired in the current canonical ts-btn_v3.1.css

## Target integration

→ `sandbox/02-components/` button harness enhancement
→ Confirm `assets/css/next/components/ts-btn_v3.1.css` has button scaling token
EOF

cat > "$SHOWCASE/_review/banner-generator/REVIEW-NOTE.md" << 'EOF'
# _review: banner-generator

**Source:** `_bu/banner-generator-v2.html`
**Category:** Tool

## Patterns to extract

- Dismissable banner component with live preview
- Token cartel: `--ts-promo-banner-h` + nav-top coupling
- Mobile CTA reveal pattern (opacity transition on hover, not display toggle)
- Intrinsic layout replacement for `#CRAZY_FIX_RULES` media queries

## Target integration

→ `assets/css/next/components/ts-promo-banner.css` (rebuild cleanly)
→ Nav offset coupling: `body:has(.ts-promo-banner:not(.ts-dismissed)) nav.ts-nav-fixed { top: var(--ts-promo-banner-h) }`
EOF

cat > "$SHOWCASE/_review/customized-css-evolution/REVIEW-NOTE.md" << 'EOF'
# _review: customized-css-evolution (v1 → v4amn)

**Source:** `_bu/customized_v*.css`
**Category:** Token layer (user-script skin layer)

## What this is

The `customized_v*.css` files are the evolution of the user-script token override layer.
`v4amn` is the latest. Study the diff from v1 → v4amn to understand what Satoshi
converged on for the user-facing customization system.

## Patterns to extract

- Which token names the user wants to expose for customization
- How `--ts-accent-*` / `--ts-text-*` are overridden in user context
- What `amn` suffix represents (check file header)

## Target integration

→ User-script token layer spec
→ `toolskin-architecture` SKILL.md user-customization section
EOF

cat > "$SHOWCASE/_review/corentin-prototype/REVIEW-NOTE.md" << 'EOF'
# _review: corentin-prototype

**Source:** `_bu/corentin.html` + `corentin-beautified.js`
**Category:** Prototype

## What this is

A standalone prototype (origin unclear from name — possibly a collaborator/client prototype).
Worth reviewing before deciding to fully archive.

## Action

1. Open `corentin.html` in browser
2. Determine if any UI patterns are worth extracting
3. If nothing useful: move to `_archived/`
EOF

echo ""
echo "══════════════════════════════════════════════"
echo " REORG COMPLETE"
echo "══════════════════════════════════════════════"
echo ""
echo "Next steps:"
echo "  1. git status  — review the moves"
echo "  2. Open each _review/ README and schedule extraction tasks"
echo "  3. cp docs/skills/expert-designer-v8.md → toolskin-rebuild/expert-designer/SKILL.md"
echo "  4. cp docs/skills/expert-designer-v8.md → toolskin-rebuild/.claude/skills/expert-designer/SKILL.md"
echo "  5. git commit -m 'chore: workspace reorg — archive deprecated, flag review candidates'"
echo ""

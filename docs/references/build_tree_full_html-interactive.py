import json
from pathlib import Path
from datetime import datetime

# ==============================
# CONFIG
# ==============================

BASE_DIR = Path.cwd()

OUTPUT_HTML  = BASE_DIR / "tree-explorer.html"
OUTPUT_JSON  = BASE_DIR / "tree-explorer.data.json"
OUTPUT_DEDUP = BASE_DIR / "tree-explorer.dedup.json"

EXCLUDE = {
    ".git",
    "node_modules",
    "__pycache__",
    ".venv",
    "venv",
    "_tree_output",
    "_bu",          # large backup folders, skip by default
    ".next",
    "dist",
}

# ==============================
# HELPERS
# ==============================

def should_exclude(path: Path):
    return any(part in EXCLUDE for part in path.parts)


def build_fs_node(path: Path, base: Path):
    """Build one node. Adds metadata (size, mtime, ctime) and a posix
    `url` relative to *base*, so the in-page <iframe> can load it from
    the same origin the explorer is served from."""
    if should_exclude(path):
        return None

    is_folder = path.is_dir()

    try:
        st = path.stat()
        size  = None if is_folder else st.st_size
        mtime = int(st.st_mtime)
        ctime = int(st.st_ctime)
    except Exception:
        size = mtime = ctime = None

    try:
        rel = path.resolve().relative_to(base.resolve()).as_posix()
    except Exception:
        rel = path.name

    node = {
        "id":   str(path.resolve()),
        "name": path.name,
        "type": "folder" if is_folder else "file",
        "url":  rel,
        "size": size,
        "mtime": mtime,
        "ctime": ctime,
        "children": [],
    }

    if is_folder:
        try:
            items = sorted(path.iterdir(), key=lambda x: (not x.is_dir(), x.name.lower()))
            for item in items:
                child = build_fs_node(item, base)
                if child:
                    node["children"].append(child)
        except Exception:
            pass

    return node


# ==============================
# DEDUP — second pass over the tree
# ==============================
# Pre-filter files by (size, lower-cased name): only same-size,
# same-name files can be exact duplicates, so we only hash those.
# Then SHA-1 the content of each candidate and group by digest.
# Result is exported to tree-explorer.dedup.json so an AI agent
# can review the full filtering off-line.

import hashlib

def build_dedup_groups(tree_nodes):
    by_key = {}
    def walk(nodes):
        for n in nodes:
            if n.get("type") == "file" and n.get("size"):
                key = (n["size"], n["name"].lower())
                by_key.setdefault(key, []).append(n)
            walk(n.get("children") or [])
    walk(tree_nodes)

    candidate_groups = [v for v in by_key.values() if len(v) > 1]
    by_digest = {}
    for group in candidate_groups:
        for node in group:
            try:
                h = hashlib.sha1()
                with open(node["id"], "rb") as f:
                    while True:
                        chunk = f.read(65536)
                        if not chunk:
                            break
                        h.update(chunk)
                digest = h.hexdigest()
            except Exception:
                continue
            by_digest.setdefault(digest, []).append({
                "id":    node["id"],
                "name":  node["name"],
                "url":   node.get("url"),
                "size":  node["size"],
                "mtime": node.get("mtime"),
            })

    dup_groups = [
        {"sha1": digest, "size": files[0]["size"], "count": len(files), "files": files}
        for digest, files in by_digest.items()
        if len(files) > 1
    ]
    dup_groups.sort(key=lambda g: -(g["size"] * (g["count"] - 1)))
    total_dupes  = sum(g["count"] - 1 for g in dup_groups)
    wasted_bytes = sum(g["size"] * (g["count"] - 1) for g in dup_groups)
    return {
        "generated_at": datetime.now().isoformat(timespec="seconds"),
        "root": str(BASE_DIR.resolve()),
        "summary": {
            "duplicate_groups": len(dup_groups),
            "redundant_files":  total_dupes,
            "wasted_bytes":     wasted_bytes,
            "wasted_mb":        round(wasted_bytes / (1024 * 1024), 2),
        },
        "groups": dup_groups,
    }

# ==============================
# BUILD TREE
# ==============================

tree = [build_fs_node(BASE_DIR, BASE_DIR)]

# ==============================
# HTML TEMPLATE
# ==============================
# Tokenised against the Toolskin design system. The template is a raw string
# so no brace-escaping is needed. Two sentinels are injected after the fact:
#   __GENERATED_AT__   -> build timestamp (replaced first)
#   __TS_TREE_DATA__   -> the JSON tree   (replaced last, so a file name that
#                         happens to contain a sentinel can never corrupt it)

HTML_TEMPLATE = r"""<!DOCTYPE html>
<html lang="en" data-theme="dark">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Toolskin Tree Explorer</title>

  <!-- Google Fonts - render-blocking (critical for body text) -->
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link
    href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap"
    rel="stylesheet" />

  <!-- Toolskin design system - single source of truth.
       Local, relative paths: this explorer is generated at the repo root, so
       it consumes the canonical https://satsea.io/toolskin-showcase/assets/css/toolskin.css + https://satsea.io/toolskin-showcase/assets/js/*. That
       keeps it offline-capable and always in sync with the live token set. -->
  <link rel="stylesheet" href="https://satsea.io/toolskin-showcase/assets/css/toolskin.css" />
  <noscript>
    <link rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css" />
  </noscript>
  <script src="https://satsea.io/toolskin-showcase/assets/js/toolskin-assets.js" defer></script>
  <script src="https://satsea.io/toolskin-showcase/assets/js/toolskin.js" defer></script>
  <script src="https://satsea.io/toolskin-showcase/assets/js/toolskin-uikit.js" defer></script>

  <style>

  /* Most of the tree component CSS lives in https://satsea.io/toolskin-showcase/assets/css/toolskin.css.
     What stays inline here:
       1. Preloader hide + baseline (page-level)
       2. .tree--scroll / .tree--static — height variants
       3. .ts-btn-group               — segmented dual-button control
       4. Topnav no-wrap constraint
     If you want any of these promoted into toolskin.css, copy them to
     the end of the canonical file (they only use existing tokens). */

  #ts-hidden,
  .ts-preloader { display: none !important; }

  *, *::before, *::after { box-sizing: border-box; }
  html { min-height: 100%; }
  body {
    margin: 0;
    min-height: 100dvh;
    background: var(--ts-bg-body, #0c0d0f);
    color: var(--ts-text-secondary, #9ea0a5);
    font-family: var(--ts-font-body, "Space Grotesk", system-ui, sans-serif);
    -webkit-font-smoothing: antialiased;
    text-rendering: optimizeLegibility;
  }

  :root {
    --ts-accent-h: 38;
    --ts-accent-s: 96%;
    --ts-accent-l: 56%;
    --ts-tree-actionbar-h: 3.25rem;
  }

  /* =================================================================
     HEIGHT VARIANTS
       .tree--scroll  (DEFAULT) — explorer is sized to the viewport
                                  minus the sticky topnav and the action
                                  bar that live above it; the body
                                  scrolls internally so those bars stay
                                  pinned.
       .tree--static  (LEGACY)  — explorer grows naturally; the whole
                                  page scrolls. Use for embeds or for
                                  contexts where an internal scroll
                                  region is unwanted.
     ================================================================= */
  .ts-tree-explorer.tree--scroll {
    height: 100dvh;
    max-height: calc(100dvh
                     - var(--ts-topbar-h, 60px)
                     - var(--ts-tree-actionbar-h, 3.25rem));
    overflow: hidden;
  }
  .ts-tree-explorer.tree--scroll .ts-tree-explorer__body {
    overflow-y: auto;
    scrollbar-width: thin;
  }
  .ts-tree-explorer.tree--static {
    height: auto;
    max-height: none;
    min-height: 60dvh;
    overflow: visible;
  }
  .ts-tree-explorer.tree--static .ts-tree-explorer__body {
    overflow-y: visible;
  }

  /* =================================================================
     LAYOUT CONSTRAINT — topnav stays a single non-wrapping flex row.
     Overflow is acceptable; wrapping is not.
     ================================================================= */
  #ts-topnav {
    flex-wrap: nowrap;
    min-width: 0;
  }
  #ts-topnav > * { flex-shrink: 0; }
  /* Search input width — targets the existing .ts-input-group component
     from the design system; no bespoke wrapper class needed. A clamped
     fixed width keeps the search readable but stops it from bullying
     the rest of the topnav into a full-width strip. */
  #ts-topnav .ts-input-group { width: clamp(12rem, 22vw, 18rem); }

  /* =================================================================
     SEGMENTED CONTROL  ·  .ts-btn-group
       Reusable horizontal group: shared seam, no inner radius, outer
       corners keep their radius, mutually exclusive active state via
       aria-pressed="true" or .is-active.
     ================================================================= */
  .ts-btn-group {
    display: inline-flex;
    flex-wrap: nowrap;
    gap: 0;
    align-items: stretch;
    isolation: isolate;
  }
  .ts-btn-group > .ts-btn {
    border-radius: 0;
    position: relative;
  }
  .ts-btn-group > .ts-btn:first-child {
    border-top-left-radius:    var(--ts-btn-radius, var(--ts-radius-sm, 6px));
    border-bottom-left-radius: var(--ts-btn-radius, var(--ts-radius-sm, 6px));
  }
  .ts-btn-group > .ts-btn:last-child {
    border-top-right-radius:    var(--ts-btn-radius, var(--ts-radius-sm, 6px));
    border-bottom-right-radius: var(--ts-btn-radius, var(--ts-radius-sm, 6px));
  }
  .ts-btn-group > .ts-btn + .ts-btn { margin-left: -1px; }
  .ts-btn-group > .ts-btn.is-active,
  .ts-btn-group > .ts-btn[aria-pressed="true"] {
    background: var(--ts-this-bg-hover,
                    color-mix(in srgb, var(--ts-accent) 10%, transparent));
    color: var(--ts-text-primary);
    z-index: 1;
  }
  .ts-btn-group > .ts-btn:focus-visible { z-index: 2; }

  /* Action bar reports its height token so .tree--scroll's calc works. */
  .ts-tree-explorer__actionbar { min-height: var(--ts-tree-actionbar-h); }
  /* =================================================================
     ITERATION 4 ADDITIONS (migrate to toolskin.css when ready):
       • .ts-btn-text         — consistent text wrapper inside buttons
       • Taxonomy chip strip  — live filter list in the action bar
       • .ts-tree--flat       — flat-list view used by taxonomy + search
       • Scroll-snap on the showcase column (intro/action/explorer)
     ================================================================= */

  .ts-btn-text { display: inline-block; line-height: 1; }
  .ts-btn--icon > .ts-btn-text { /* visually hidden but readable to AT */
    position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px;
    overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0;
  }

  /* Taxonomy filter strip — uses the design-system .ts-chips container
     and .ts-chip items from toolskin.css. The only thing layered in
     here is action-bar layout safety so the strip CAN NOT push the
     Export / row-actions siblings out of view at any width. */
  .ts-tree-explorer__actionbar { flex-wrap: nowrap; }
  .ts-tree-explorer__actionbar-title,
  .ts-tree-explorer__actionbar-actions { flex: 0 0 auto; min-width: 0; }
  #ts-taxonomy.ts-chips {
    flex: 1 1 0;
    flex-wrap: nowrap;              /* action bar has fixed height — chips never break to a 2nd row */
    min-width: 0;
    overflow-x: auto;
    scrollbar-width: thin;
    scroll-snap-type: x proximity;
    /* Edge-fade mask: hints scrollability without adding chrome. The
       fade only shows at edges that have hidden chips, because the
       mask follows the scroll position via the gradient stop. */
    -webkit-mask-image: linear-gradient(to right,
      transparent 0, black 18px, black calc(100% - 18px), transparent 100%);
            mask-image: linear-gradient(to right,
      transparent 0, black 18px, black calc(100% - 18px), transparent 100%);
  }
  #ts-taxonomy.ts-chips > .ts-chip { scroll-snap-align: start; }
  #ts-taxonomy.ts-chips > .ts-chip small {
    margin-left: 0.4em;
    opacity: 0.7;
    font-size: 0.85em;
    font-variant-numeric: tabular-nums;
  }
  #ts-taxonomy.ts-chips > .ts-chip[aria-selected="true"] small { opacity: 0.95; }

  /* Idle chip color — toolskin.css line 7567 paints non-active chips
     with --ts-accent-bright AND reassigns --ts-this-bg to accent (which
     made the border derive from accent and read loud). Override both:
     reset --ts-this-bg to the page surface so its derivatives are
     muted, then pin color/background/border to neutral tokens. The
     active state still wins via the [aria-selected="true"] rule. */
  #ts-taxonomy.ts-chips > .ts-chip:not([aria-selected="true"]) {
    --ts-this-bg: var(--ts-bg-0);
    color: var(--ts-text-muted);
    background: transparent;
    border-color: color-mix(in srgb, var(--ts-text-muted) 35%, transparent);
  }
  #ts-taxonomy.ts-chips > .ts-chip:not([aria-selected="true"]):hover {
    color: var(--ts-text-secondary);
    background: var(--ts-this-bg-hover);
    border-color: color-mix(in srgb, var(--ts-text-muted) 55%, transparent);
  }

  /* FLAT-LIST view — activated by taxonomy filter (and reusable for any
     "search-results" surface). Hides folder rows + connector ornament,
     collapses indentation so files render as a flat list. */
  .ts-tree.ts-tree--flat .ts-tree__children { padding-left: 0; }
  .ts-tree.ts-tree--flat .ts-tree__node--folder > .ts-tree__row { display: none; }
  .ts-tree.ts-tree--flat .ts-tree__children > .ts-tree__node::before,
  .ts-tree.ts-tree--flat .ts-tree__children > .ts-tree__node::after { display: none; }
  .ts-tree.ts-tree--flat .ts-tree__node--file > .ts-tree__row .ts-tree__twist { display: none; }

  /* Scroll-snap on the showcase column — when the page scrolls, snap to
     intro / action bar / explorer boundaries so the user lands focused
     on the explorer view rather than mid-section (user's refactor note). */
  html { scroll-snap-type: y proximity; }
  .ts-tree-explorer__intro,
  .ts-tree-explorer__actionbar,
  .ts-tree-explorer.tree--scroll { scroll-snap-align: start; }
  /* =================================================================
     ITER 5 ADDITIONS
       • Preview sidebar (grid sibling of <main> inside the explorer)
       • Three-dot row action menu (popover, positioned by JS)
       • Export menu (popover, positioned by JS)
     ================================================================= */

  /* Explorer becomes a grid when .tree--scroll: one column normally,
     two columns when data-preview-visible="true". The body owns its own
     overflow; the preview owns its own overflow. Footer spans all cols. */
  .ts-tree-explorer.tree--scroll {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    grid-template-rows: minmax(0, 1fr) auto;
  }
  .ts-tree-explorer.tree--scroll[data-preview-visible="true"] {
    grid-template-columns: minmax(0, 1fr) clamp(280px, 38vw, 560px);
  }
  .ts-tree-explorer.tree--scroll .ts-tree-explorer__body {
    grid-row: 1; grid-column: 1; min-width: 0;
  }
  .ts-tree-explorer.tree--scroll .ts-tree-explorer__preview {
    grid-row: 1; grid-column: 2;
    min-width: 0;
    overflow: hidden;
    border-left: 1px solid var(--ts-this-bg-border);
    background: var(--ts-this-bg);
    display: grid;
    grid-template-rows: auto minmax(0, 1fr) auto;
  }
  .ts-tree-explorer.tree--scroll[data-preview-visible="false"]
    .ts-tree-explorer__preview { display: none; }
  .ts-tree-explorer.tree--scroll .ts-tree-explorer__foot {
    grid-row: 2; grid-column: 1 / -1;
  }

  /* Preview sidebar internals --------------------------------------- */
  .ts-tree-explorer__preview-header {
    display: flex;
    align-items: center;
    gap: var(--ts-sp-2, 8px);
    padding: var(--ts-sp-2, 8px) var(--ts-sp-3, 12px);
    border-bottom: 1px solid var(--ts-this-bg-border);
    background: var(--ts-this-bg-bright);
  }
  .ts-tree-explorer__preview-name {
    flex: 1 1 auto;
    min-width: 0;
    font-family: var(--ts-font-mono);
    font-size: 0.78rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: var(--ts-text-primary);
  }
  .ts-tree-explorer__preview-frame {
    position: relative;
    min-height: 0;
    background: var(--ts-bg-body, #0c0d0f);
    overflow: hidden;
  }
  .ts-tree-explorer__preview-frame iframe {
    width: 100%; height: 100%;
    border: 0;
    background: var(--ts-bg-body);
  }
  .ts-tree-explorer__preview-fallback {
    position: absolute; inset: 0;
    display: grid; place-items: center; gap: var(--ts-sp-2, 8px);
    padding: var(--ts-sp-4, 16px);
    text-align: center;
    color: var(--ts-text-muted);
    font-family: var(--ts-font-mono);
    font-size: 0.78rem;
  }
  .ts-tree-explorer__preview-fallback[hidden] { display: none; }
  .ts-tree-explorer__preview-fallback i { font-size: 1.6rem; opacity: 0.55; }
  .ts-tree-explorer__preview-meta {
    padding: var(--ts-sp-2, 8px) var(--ts-sp-3, 12px);
    border-top: 1px solid var(--ts-this-bg-border);
    font-family: var(--ts-font-mono);
    font-size: 0.7rem;
    color: var(--ts-text-muted);
    background: var(--ts-this-bg);
  }

  /* Popover menus (row actions + export) ----------------------------- */
  .ts-tree-popover {
    position: fixed;
    z-index: 1000;
    min-width: 220px;
    padding: var(--ts-sp-1, 4px);
    background: var(--ts-this-bg-bright);
    border: 1px solid var(--ts-this-bg-border);
    border-radius: var(--ts-radius-sm, 6px);
    box-shadow: 0 8px 24px rgba(0,0,0,0.35);
    font-family: var(--ts-font-body);
  }
  .ts-tree-popover[hidden] { display: none; }
  .ts-tree-popover__item {
    display: flex;
    align-items: center;
    gap: var(--ts-sp-2, 8px);
    width: 100%;
    padding: 0.45em 0.7em;
    background: transparent;
    border: 0;
    border-radius: var(--ts-radius-xs, 4px);
    color: var(--ts-text-secondary);
    font-size: 0.82rem;
    line-height: 1.2;
    text-align: left;
    cursor: pointer;
    transition: background var(--ts-dur-fast, 160ms) ease,
                color var(--ts-dur-fast, 160ms) ease;
  }
  .ts-tree-popover__item:hover,
  .ts-tree-popover__item:focus-visible {
    background: var(--ts-this-bg-hover);
    color: var(--ts-text-primary);
    outline: none;
  }
  .ts-tree-popover__item:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
  .ts-tree-popover__item i {
    width: 1.1em;
    text-align: center;
    color: var(--ts-text-muted);
  }
  .ts-tree-popover__item:hover i { color: var(--ts-accent); }
  .ts-tree-popover__sep {
    margin: var(--ts-sp-1, 4px) 0;
    border-top: 1px solid var(--ts-this-bg-border);
  }
  /* =================================================================
     ITER 9 — perf + bug fixes (override toolskin.css for this page).
       • Drop tree transitions (no anim on hover/select/expand).
       • Neutralise the :has(> .ts-tree__row:hover) connector accent —
         it re-evaluates across the whole tree on every pointer move,
         which is the main cause of the sluggishness reported here.
         Selection-state accent still works via [aria-selected].
       • content-visibility: auto lets the browser skip rendering
         offscreen subtrees in long, expanded trees.
     ================================================================= */
  .ts-tree__row,
  .ts-tree__label,
  .ts-tree__icon,
  .ts-tree__twist,
  .ts-tree__meta { transition: none !important; }

  .ts-tree__node:has(> .ts-tree__row:hover)::before,
  .ts-tree__node:has(> .ts-tree__row:hover)::after {
    background: var(--ts-tree-guide) !important;
    border-color: var(--ts-tree-guide) !important;
  }

  .ts-tree__children {
    content-visibility: auto;
    contain-intrinsic-size: 0 var(--ts-tree-row-h);
  }

  /* Intro toggle — section animates to height:0 when the topnav info
     button adds .hide-section. Generic class; reusable elsewhere. */
  .ts-tree-explorer__intro {
    overflow: hidden;
    transition: max-height 220ms ease, padding 220ms ease, border-color 220ms ease;
    max-height: 2000px;                /* large enough to fit content */
  }
  .ts-tree-explorer__intro.hide-section {
    /* !important needed to defeat the inline style="max-height: fit-content"
       the owner placed on the section. Scoped to this state class only. */
    max-height: 0 !important;
    padding-block: 0 !important;
    border-bottom-color: transparent !important;
  }

  </style>



</head>

<body>

  <!-- ── TOPNAV (lives OUTSIDE the explorer wrapper so the explorer
       below can compute its own height and scroll internally). ── -->
  <header class="spaced ts-nav-fixed ts-topbar" id="ts-topnav">
    <div class="ts-tree-explorer__brand">
      <span class="ts-tree-explorer__brand-mark" data-icon="fa-solid fa-folder-tree" aria-hidden="true">
        <i class="fa-solid fa-folder-tree"></i>
      </span>
      <span class="ts-tree-explorer__brand-text">
        <span class="ts-tree-explorer__title">File Tree Explorer</span>
        <span class="ts-tree-explorer__path" id="ts-root-path" title="">&mdash;</span>
      </span>
    </div>

    <div class="ts-input-group">
      <span class="ts-icon ts-input-icon" data-icon="fa-solid fa-magnifying-glass" aria-hidden="true">
        <i class="fa-solid fa-magnifying-glass"></i>
      </span>
      <input id="ts-search" type="search" class="ts-input"
        placeholder="Filter files &amp; folders..." aria-label="Filter the tree" />
    </div>

    <button id="ts-info-toggle" type="button"
      class="ts-btn ts-btn--ghost ts-btn--icon ts-btn--sm"
      title="Toggle intro / docs section" aria-pressed="false"
      data-icon="fa-solid fa-circle-info">
      <i class="fa-solid fa-circle-info"></i>
    </button>

    <!-- Segmented dual-button control: Expand / Collapse share one seam
         and act as a mutually exclusive toggle (last-action indicator). -->
    <div class="ts-btn-group" role="group" aria-label="Tree expansion">
      <button id="ts-expand" type="button"
        class="ts-btn ts-btn--ghost ts-btn--icon ts-btn--sm"
        title="Expand all" data-icon="fa-solid fa-angles-down"
        aria-pressed="false">
        <i class="fa-solid fa-angles-down"></i>
      </button>
      <button id="ts-collapse" type="button"
        class="ts-btn ts-btn--ghost ts-btn--icon ts-btn--sm"
        title="Collapse all" data-icon="fa-solid fa-angles-up"
        aria-pressed="false">
        <i class="fa-solid fa-angles-up"></i>
      </button>
    </div>

    <button id="ts-density" type="button"
      class="ts-btn ts-btn--ghost ts-btn--icon ts-btn--sm"
      title="Cycle density" data-icon="fa-solid fa-arrows-up-down">
      <i class="fa-solid fa-arrows-up-down"></i>
    </button>

    <label class="theme-toggle theme-toggle--force-motion theme-toggle--toggled"
      data-theme-toggle aria-label="Toggle theme"
      data-tooltip="Switch Dark / Light Mode" data-tooltip-pos="bottom">
      <input type="checkbox" />
      <span class="theme-toggle-sr">Toggle theme</span>
      <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" width="1em" height="1em" fill="currentColor" class="theme-toggle__expand ts-icon ts-btn-icon" viewBox="0 0 32 32" style="pointer-events:none;">
        <clipPath id="tree-explorer-theme-toggle__cutout">
          <path d="M0-11h25a1 1 0 0017 13v30H0Z" />
        </clipPath>
        <g clip-path="url(#tree-explorer-theme-toggle__cutout)">
          <circle cx="16" cy="16" r="8.4" />
          <path d="M18.3 3.2c0 1.3-1 2.3-2.3 2.3s-2.3-1-2.3-2.3S14.7.9 16 .9s2.3 1 2.3 2.3zm-4.6 25.6c0-1.3 1-2.3 2.3-2.3s2.3 1 2.3 2.3-1 2.3-2.3 2.3-2.3-1-2.3-2.3zm15.1-10.5c-1.3 0-2.3-1-2.3-2.3s1-2.3 2.3-2.3 2.3 1 2.3 2.3-1 2.3-2.3 2.3zM3.2 13.7c1.3 0 2.3 1 2.3 2.3s-1 2.3-2.3 2.3S.9 17.3.9 16s1-2.3 2.3-2.3zm5.8-7C9 7.9 7.9 9 6.7 9S4.4 8 4.4 6.7s1-2.3 2.3-2.3S9 5.4 9 6.7zm16.3 21c-1.3 0-2.3-1-2.3-2.3s1-2.3 2.3-2.3 2.3 1 2.3 2.3-1 2.3-2.3 2.3zm2.4-21c0 1.3-1 2.3-2.3 2.3S23 7.9 23 6.7s1-2.3 2.3-2.3 2.4 1 2.4 2.3zM6.7 23C8 23 9 24 9 25.3s-1 2.3-2.3 2.3-2.3-1-2.3-2.3 1-2.3 2.3-2.3z" />
        </g>
      </svg>
    </label>
  </header>

  <!-- ── INTRO ── lives OUTSIDE the explorer wrapper. -->
  <section class="ts-section ts-tree-explorer__intro ts-section--dark" style="max-height: fit-content; min-height: unset;">
    <div class="ts-tree-explorer__intro-text">
      <span class="ts-tree-explorer__intro-eyebrow ts-eyebrow">Toolskin &middot; Component</span>
      <h1 class="ts-tree-explorer__intro-title">File Tree Explorer</h1>
      <p class="ts-tree-explorer__intro-lead">
        A token-driven tree component for navigating any hierarchy &mdash;
        file systems, tables of contents, sitemaps, settings outlines.
        Every gap, padding, border, surface and connector is a derivative
        of a single base token, so the whole component rescales and
        re-themes from one knob.
      </p>
      <ul class="ts-list ts-tree-explorer__intro-bullets">
        <li><b>Bulletproof connectors</b> &mdash; straight or curved, geometry-driven, never break.</li>
        <li><b>Three states</b> &mdash; hover, active (keyboard cursor), selected &mdash; each visually distinct.</li>
        <li><b>Twin badges + folder-open swap</b> &mdash; folder rows reveal folder / file counts; the glyph flips when open.</li>
        <li><b>Theme-free</b> &mdash; light / dark and accent re-tinting are owned by the Toolskin runtime.</li>
      </ul>
    </div>
    <div class="ts-tree-explorer__intro-code">
      <div class="ts-code-window">
        <div class="ts-code-header">
          <div class="ts-code-dotbtn red"></div>
          <div class="ts-code-dotbtn yellow"></div>
          <div class="ts-code-dotbtn green"></div>
          <span class="ts-code-label">usage.html</span>
          <button class="ts-code-copy" type="button" aria-label="Copy code" data-icon="fa-solid fa-copy">
            <i class="fa-solid fa-copy"></i>
          </button>
        </div>
        <div class="ts-code-content">
<pre><code>&lt;!-- 1. Drop in a placeholder &mdash; this is the ONLY markup you author. --&gt;
&lt;div id="my-tree" class="ts-tree"&gt;&lt;/div&gt;

&lt;!-- 2. Feed it data (filesystem, sitemap, TOC, JSON, anything). --&gt;
&lt;script&gt;
ToolskinTree.init({
  target: '#my-tree',
  data: [
    { name: 'src', type: 'folder', children: [
      { name: 'index.html', type: 'file', url: 'src/index.html' },
      { name: 'styles.css', type: 'file', url: 'src/styles.css' }
    ]},
    { name: 'README.md', type: 'file', url: 'README.md' }
  ],

  // Optional UI hooks — pass selectors and ToolskinTree wires them up.
  search:   '#filter-input',
  expand:   '#expand-all',
  collapse: '#collapse-all',
  density:  { button: '#density-btn', target: '#tree-wrapper' },
  stats:    '#stats',     rootPath: '#root-path',     empty: '#empty'
});
&lt;/script&gt;</code></pre>
        </div>
      </div>
    </div>
  </section>

  <!-- ── ACTION TOPBAR ── also OUTSIDE the explorer wrapper. -->
  <div class="ts-tree-explorer__actionbar">
    <div class="ts-tree-explorer__actionbar-title">
      <span class="ts-tree-explorer__actionbar-eyebrow ts-eyebrow">Browsing</span>
      <span class="ts-tree-explorer__actionbar-stats" id="ts-stats">Reading tree&hellip;</span>
    </div>

    <!-- Taxonomy chip strip — built live from the rendered DATA by
         ToolskinTree. Click a chip → flat-list filtered view. -->
    <div class="ts-chips" id="ts-taxonomy" role="tablist" aria-label="Filter by file type"></div>

    <div class="ts-tree-explorer__actionbar-actions">
      <button class="ts-btn ts-btn--ghost ts-btn--sm" type="button" id="ts-action-export"
        title="Export" data-icon="fa-solid fa-file-export">
        <i class="fa-solid fa-file-export"></i>
        <span class="ts-btn-text">Export</span>
      </button>
      <button class="ts-btn ts-btn--ghost ts-btn--icon ts-btn--sm" type="button" id="ts-action-more"
        title="More actions (queued for Phase 2.B)" data-icon="fa-solid fa-ellipsis-vertical">
        <i class="fa-solid fa-ellipsis-vertical"></i>
      </button>
    </div>
  </div>

  <!-- ── EXPLORER ── tree--scroll (default) is the calc-height variant.
       Swap to tree--static for the legacy page-scrolls-naturally layout. -->
  <div class="ts-tree-explorer tree--scroll" id="ts-explorer" data-density="normal" data-preview-visible="false">

    <main class="ts-tree-explorer__body">
      <div class="ts-tree" id="ts-tree" role="tree" aria-label="File system tree"></div>
      <div class="ts-tree-explorer__empty" id="ts-empty" hidden>
        <span class="ts-icon" data-icon="fa-regular fa-folder-open" aria-hidden="true">
          <i class="fa-regular fa-folder-open"></i>
        </span>
        <span>No files or folders match your filter.</span>
      </div>
    </main>

    <!-- ── PREVIEW SIDEBAR ── grid sibling of <main>; shown when a
         previewable file is opened. Iframe is sandboxed for safety. -->
    <aside class="ts-tree-explorer__preview" id="ts-preview" aria-label="File preview">
      <header class="ts-tree-explorer__preview-header">
        <span class="ts-tree-explorer__preview-name" id="ts-preview-name">No file selected</span>
        <button id="ts-preview-close" type="button"
          class="ts-btn ts-btn--ghost ts-btn--icon ts-btn--sm"
          title="Close preview" data-icon="fa-solid fa-xmark">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </header>
      <div class="ts-tree-explorer__preview-frame">
        <iframe id="ts-preview-iframe" title="File preview"
          sandbox="allow-same-origin allow-popups allow-popups-to-escape-sandbox"
          referrerpolicy="no-referrer"></iframe>
        <div class="ts-tree-explorer__preview-fallback" id="ts-preview-fallback" hidden>
          <span class="ts-icon" data-icon="fa-solid fa-circle-info" aria-hidden="true">
            <i class="fa-solid fa-circle-info"></i>
          </span>
          <p>Preview not available for this file type.</p>
        </div>
      </div>
      <footer class="ts-tree-explorer__preview-meta" id="ts-preview-meta"></footer>
    </aside>

    <footer class="ts-tree-explorer__foot">
      <span>Generated __GENERATED_AT__</span>
      <span>
        <kbd>&uarr;</kbd><kbd>&darr;</kbd> navigate &middot;
        <kbd>&rarr;</kbd> expand &middot;
        <kbd>&larr;</kbd> collapse &middot;
        <kbd>Enter</kbd> open
      </span>
    </footer>

  </div>

  <script>
  /* ====================================================================
     ToolskinTree — data-driven tree component.

     The user authors ONE placeholder element and feeds in data; the
     component builds the entire DOM, wires keyboard nav, search, and
     any optional UI controls passed in.

       ToolskinTree.init({
         target: '#my-tree' | HTMLElement,   // required
         data:   [ ...nodes ],                // required
         // optional UI controls (selectors or elements):
         search:   '#search-input',
         expand:   '#expand-button',
         collapse: '#collapse-button',
         density:  { button: '#density-btn', target: '#wrapper' },
         stats:    '#stats-el',
         rootPath: '#root-path-el',
         empty:    '#empty-state-el',
         urlForNode: function(node){ return ...; }   // override URL strategy
       });

     Node shape (recursive):
       {
         name:     'foo.css',
         type:     'folder' | 'file',
         children: [...]      // folders only
         url:      'https://…' | 'file:///…'  // files: optional
         id:       'D:\\path\\foo.css'        // optional source path
       }
  ==================================================================== */
  (function (global) {
    "use strict";

    /* ---- file-extension → Font Awesome class (override via opts.urlForNode
       indirectly, or fork EXT_ICON for a tighter set) ---- */
    var EXT_ICON = {
      html: "fa-brands fa-html5", htm: "fa-brands fa-html5",
      css: "fa-brands fa-css3-alt", scss: "fa-brands fa-sass", sass: "fa-brands fa-sass",
      js: "fa-brands fa-js", mjs: "fa-brands fa-js", cjs: "fa-brands fa-js",
      ts: "fa-solid fa-code", tsx: "fa-solid fa-code", jsx: "fa-solid fa-code",
      json: "fa-solid fa-code", py: "fa-brands fa-python",
      md: "fa-solid fa-file-lines", txt: "fa-solid fa-file-lines", log: "fa-solid fa-file-lines",
      png: "fa-regular fa-image", jpg: "fa-regular fa-image", jpeg: "fa-regular fa-image",
      gif: "fa-regular fa-image", webp: "fa-regular fa-image", svg: "fa-regular fa-image",
      ico: "fa-regular fa-image", avif: "fa-regular fa-image",
      pdf: "fa-regular fa-file-pdf",
      zip: "fa-regular fa-file-zipper", rar: "fa-regular fa-file-zipper",
      mp4: "fa-regular fa-file-video", mov: "fa-regular fa-file-video", webm: "fa-regular fa-file-video",
      mp3: "fa-regular fa-file-audio", wav: "fa-regular fa-file-audio",
      ttf: "fa-solid fa-font", otf: "fa-solid fa-font", woff: "fa-solid fa-font", woff2: "fa-solid fa-font",
      sh: "fa-solid fa-terminal", bat: "fa-solid fa-terminal", ps1: "fa-solid fa-terminal",
      yml: "fa-solid fa-gear", yaml: "fa-solid fa-gear", toml: "fa-solid fa-gear", ini: "fa-solid fa-gear",
      csv: "fa-solid fa-table", xlsx: "fa-solid fa-table", xls: "fa-solid fa-table"
    };
    function fileIconClass(name) {
      var s = String(name || "");
      var dot = s.lastIndexOf(".");
      var ext = dot > 0 ? s.slice(dot + 1).toLowerCase() : "";
      return EXT_ICON[ext] || "fa-regular fa-file";
    }

    /* Default URL resolver:
         node.url        → use as-is
         node.href       → use as-is
         node.id (path)  → file:///... (Python-generator output)
       Override via opts.urlForNode if your data uses a different shape. */
    function defaultUrlFor(node) {
      if (!node) return "";
      if (node.url)  return node.url;
      if (node.href) return node.href;
      if (node.id)   return "file:///" + String(node.id).replace(/\\/g, "/");
      return "";
    }

    /* ---- ICON HELPER — global rule: every icon is rendered as the
       Toolskin data-ts-icon contract (wrapper carries the attribute, a
       child <i> paints instantly without waiting for runtime hydration).
       Both stay in lockstep when the icon class is swapped. ---- */
    function makeIconWrap(wrapClass, iconCls) {
      var span = document.createElement("span");
      span.className = wrapClass + " ts-icon";
      span.setAttribute("data-ts-icon", iconCls);
      span.setAttribute("aria-hidden", "true");
      var i = document.createElement("i");
      i.className = iconCls;
      span.appendChild(i);
      return span;
    }
    function swapIconWrap(spanEl, iconCls) {
      if (!spanEl) return;
      spanEl.setAttribute("data-ts-icon", iconCls);
      var i = spanEl.querySelector("i");
      if (i) i.className = iconCls;
    }

    function resolveEl(target) {
      if (!target) return null;
      if (typeof target === "string") return document.querySelector(target);
      return target.nodeType ? target : null;
    }

    /* ==================================================================
       Tree — one instance per .ts-tree element. All state lives here.
    ================================================================== */
    function Tree(treeEl, opts) {
      this.tree    = treeEl;
      this.data    = (opts.data || []).slice();
      this.urlFor  = typeof opts.urlForNode === "function" ? opts.urlForNode : defaultUrlFor;
      this.counts  = { folders: 0, files: 0 };

      this.searchEl   = resolveEl(opts.search);
      this.expandEl   = resolveEl(opts.expand);
      this.collapseEl = resolveEl(opts.collapse);
      this.statsEl    = resolveEl(opts.stats);
      this.rootEl     = resolveEl(opts.rootPath);
      this.emptyEl    = resolveEl(opts.empty);
      this.densityBtn = opts.density && resolveEl(opts.density.button);
      this.densityTgt = opts.density && resolveEl(opts.density.target);
      this.taxonomyEl = resolveEl(opts.taxonomy);
      this._activeTaxonomy = "All";
      /* iter5: explorer wrapper + preview sidebar refs + popovers */
      this.explorerEl       = resolveEl(opts.wrapper);
      this.previewEl        = resolveEl(opts.preview);
      this.previewIframeEl  = resolveEl(opts.previewIframe);
      this.previewNameEl    = resolveEl(opts.previewName);
      this.previewCloseEl   = resolveEl(opts.previewClose);
      this.previewMetaEl    = resolveEl(opts.previewMeta);
      this.previewFallbackEl = resolveEl(opts.previewFallback);
      this.menuTriggerEl    = resolveEl(opts.menuTrigger);
      this.menuPopoverEl    = resolveEl(opts.menuPopover);
      this.exportTriggerEl  = resolveEl(opts.exportTrigger);
      this.exportPopoverEl  = resolveEl(opts.exportPopover);
      this._lastNodeData    = null;

      this._render();
      this._bindClick();
      this._bindKeys();
      this._bindControls();
      this._buildTaxonomy();
      this._bindPreview();
      this._bindMenu();
      this._bindExport();
    }

    Tree.prototype._render = function () {
      this.tree.setAttribute("role", "tree");
      this.tree.textContent = "";
      this.counts.folders = 0;
      this.counts.files = 0;

      var frag = document.createDocumentFragment();
      for (var i = 0; i < this.data.length; i++) {
        if (this.data[i]) frag.appendChild(this._buildNode(this.data[i]));
      }
      this.tree.appendChild(frag);

      var root = this.tree.firstElementChild;
      if (root) {
        this._setExpanded(root, true);
        var firstRow = root.querySelector(":scope > .ts-tree__row");
        if (firstRow) firstRow.tabIndex = 0;
      }
      if (this.statsEl) {
        this.statsEl.innerHTML =
          "<b>" + this.counts.folders + "</b> folders &nbsp;&middot;&nbsp; <b>" +
          this.counts.files + "</b> files";
      }
      if (this.rootEl && this.data[0]) {
        var rootPath = this.data[0].id || this.data[0].name || "—";
        this.rootEl.textContent = rootPath;
        this.rootEl.title = rootPath;
      }
    };

    Tree.prototype._buildNode = function (node) {
      var isFolder = node.type === "folder";
      var kids = node.children || [];
      var hasKids = isFolder && kids.length > 0;

      var wrap = document.createElement("div");
      wrap.className = "ts-tree__node " + (isFolder ? "ts-tree__node--folder" : "ts-tree__node--file");
      wrap.setAttribute("role", "treeitem");
      wrap.dataset.name = String(node.name || "").toLowerCase();
      /* iter5: stash light metadata on the node element for the menu
         and preview sidebar to read without re-walking this.data. */
      wrap.dataset.url      = String(node.url || "");
      wrap.dataset.fullPath = String(node.id  || "");
      if (node.size  != null) wrap.dataset.size  = String(node.size);
      if (node.mtime != null) wrap.dataset.mtime = String(node.mtime);

      var row = document.createElement("div");
      row.className = "ts-tree__row";
      row.tabIndex = -1;

      /* twist (disclosure chevron) — its own .ts-tree__twist wrapper, with
         a data-ts-icon child for the actual glyph. Leaf rows keep a sized
         placeholder for vertical alignment. */
      var twist = document.createElement("span");
      twist.className = "ts-tree__twist" + (hasKids ? "" : " ts-tree__twist--leaf");
      if (hasKids) twist.appendChild(makeIconWrap("", "fa-solid fa-chevron-right"));
      row.appendChild(twist);

      /* file/folder icon — wrapper class is .ts-tree__icon for the
         token-driven size/colour, .ts-icon + data-ts-icon for the
         system contract, inner <i> for instant paint. */
      var iconCls = isFolder ? "fa-solid fa-folder" : fileIconClass(node.name);
      row.appendChild(makeIconWrap("ts-tree__icon", iconCls));

      /* label — folders get a <span>, files get an <a> with a stretched
         hit area via the .ts-tree__label::after rule. */
      var label;
      if (isFolder) {
        label = document.createElement("span");
      } else {
        label = document.createElement("a");
        label.href = this.urlFor(node);
        label.target = "_blank";
        label.rel = "noopener";
      }
      label.className = "ts-tree__label";
      label.textContent = node.name || "(unnamed)";
      row.appendChild(label);

      if (isFolder) {
        this.counts.folders++;
        var nFolders = 0, nFiles = 0;
        for (var k = 0; k < kids.length; k++) {
          if (!kids[k]) continue;
          if (kids[k].type === "folder") nFolders++;
          else nFiles++;
        }
        var meta = document.createElement("span");
        meta.className = "ts-tree__meta";
        if (hasKids) {
          meta.innerHTML =
            '<span class="ts-tree__badge ts-tree__badge--folders" title="Subfolders">' +
              '<span class="ts-icon" data-ts-icon="fa-solid fa-folder" aria-hidden="true"><i class="fa-solid fa-folder"></i></span>' +
              nFolders + '</span>' +
            '<span class="ts-tree__badge ts-tree__badge--files" title="Files">' +
              '<span class="ts-icon" data-ts-icon="fa-regular fa-file" aria-hidden="true"><i class="fa-regular fa-file"></i></span>' +
              nFiles + '</span>';
        } else {
          meta.innerHTML = '<span class="ts-tree__badge" title="Empty folder">empty</span>';
        }
        row.appendChild(meta);
      } else {
        this.counts.files++;
      }

      wrap.appendChild(row);

      if (hasKids) {
        wrap.setAttribute("aria-expanded", "false");
        var group = document.createElement("div");
        group.className = "ts-tree__children";
        group.setAttribute("role", "group");
        group.hidden = true;
        for (var i = 0; i < kids.length; i++) {
          group.appendChild(this._buildNode(kids[i]));
        }
        wrap.appendChild(group);
      }
      return wrap;
    };

    Tree.prototype._setExpanded = function (nodeEl, open) {
      if (!nodeEl || !nodeEl.hasAttribute("aria-expanded")) return;
      nodeEl.setAttribute("aria-expanded", String(open));
      var group = nodeEl.querySelector(":scope > .ts-tree__children");
      if (group) group.hidden = !open;
      /* Glyph swap: solid closed → regular outline open */
      if (nodeEl.classList.contains("ts-tree__node--folder")) {
        var iconWrap = nodeEl.querySelector(":scope > .ts-tree__row > .ts-tree__icon");
        if (iconWrap) {
          swapIconWrap(iconWrap, open ? "fa-regular fa-folder-open" : "fa-solid fa-folder");
        }
      }
    };

    Tree.prototype._bindClick = function () {
      var self = this;
      this.tree.addEventListener("click", function (e) {
        var row = e.target.closest(".ts-tree__row");
        if (!row) return;
        /* Suppress the stretched <a>'s default navigation. Preview
           in the sidebar takes over; "Open externally" is a
           deliberate menu action. Cmd/Ctrl+click still opens a new
           tab (browser handles modifier-clicks before this fires). */
        var a = e.target.closest('a.ts-tree__label');
        if (a && !e.metaKey && !e.ctrlKey && !e.shiftKey && e.button === 0) {
          e.preventDefault();
        }
        var nodeEl = row.parentElement;

        var prev = self.tree.querySelector('.ts-tree__node[aria-selected="true"]');
        if (prev && prev !== nodeEl) prev.removeAttribute("aria-selected");
        nodeEl.setAttribute("aria-selected", "true");

        var roving = self.tree.querySelectorAll('.ts-tree__row[tabindex="0"]');
        for (var i = 0; i < roving.length; i++) roving[i].tabIndex = -1;
        row.tabIndex = 0;
        row.focus();

        if (nodeEl.hasAttribute("aria-expanded")) {
          self._setExpanded(nodeEl, nodeEl.getAttribute("aria-expanded") !== "true");
        }
        /* iter5: open file rows in the preview sidebar. */
        if (nodeEl.classList.contains("ts-tree__node--file")) {
          self.preview(self._nodeFromEl(nodeEl));
        }
      });
    };

    /* Build a lightweight node object from the row's dataset (set by
       _buildNode). Used by preview() and the row-actions menu. */
    Tree.prototype._nodeFromEl = function (nodeEl) {
      if (!nodeEl) return null;
      return {
        name:  nodeEl.querySelector(':scope > .ts-tree__row > .ts-tree__label').textContent,
        type:  nodeEl.classList.contains('ts-tree__node--folder') ? 'folder' : 'file',
        url:   nodeEl.dataset.url || '',
        id:    nodeEl.dataset.fullPath || '',
        size:  nodeEl.dataset.size  ? parseInt(nodeEl.dataset.size, 10)  : null,
        mtime: nodeEl.dataset.mtime ? parseInt(nodeEl.dataset.mtime, 10) : null
      };
    };

    Tree.prototype._bindKeys = function () {
      var self = this;
      this.tree.addEventListener("keydown", function (e) {
        var row = e.target.closest(".ts-tree__row");
        if (!row) return;
        var nodeEl = row.parentElement;
        var rows = Array.prototype.filter.call(
          self.tree.querySelectorAll(".ts-tree__row"),
          function (r) { return r.offsetParent !== null; }
        );
        var idx = rows.indexOf(row);
        function focusRow(r) {
          if (!r) return;
          for (var i = 0; i < rows.length; i++) rows[i].tabIndex = -1;
          r.tabIndex = 0;
          r.focus();
        }
        switch (e.key) {
          case "ArrowDown": e.preventDefault(); focusRow(rows[idx + 1]); break;
          case "ArrowUp":   e.preventDefault(); focusRow(rows[idx - 1]); break;
          case "ArrowRight":
            e.preventDefault();
            if (nodeEl.getAttribute("aria-expanded") === "false") self._setExpanded(nodeEl, true);
            else focusRow(rows[idx + 1]);
            break;
          case "ArrowLeft":
            e.preventDefault();
            if (nodeEl.getAttribute("aria-expanded") === "true") {
              self._setExpanded(nodeEl, false);
            } else {
              var parent = nodeEl.parentElement.closest(".ts-tree__node");
              if (parent) focusRow(parent.querySelector(":scope > .ts-tree__row"));
            }
            break;
          case "Home": e.preventDefault(); focusRow(rows[0]); break;
          case "End":  e.preventDefault(); focusRow(rows[rows.length - 1]); break;
          case "Enter":
          case " ":
            e.preventDefault();
            row.click();
            if (nodeEl.classList.contains("ts-tree__node--file")) {
              var a = row.querySelector("a.ts-tree__label");
              if (a) a.click();
            }
            break;
        }
      });
    };

    Tree.prototype._bindControls = function () {
      var self = this;

      /* Segmented control: clicking Expand / Collapse runs the action
         AND swaps the active state. Per the spec:
           active button  → .is-active + .ts-btn--primary
           inactive button → both removed (default style)
         Both classes flip together as one atomic operation. */
      function _segState(activeEl) {
        [self.expandEl, self.collapseEl].forEach(function (el) {
          if (!el) return;
          var on = el === activeEl;
          el.classList.toggle("is-active", on);
          el.classList.toggle("ts-btn--primary", on);
          el.setAttribute("aria-pressed", on ? "true" : "false");
        });
      }
      if (this.expandEl) {
        this.expandEl.addEventListener("click", function () { self.expandAll();   _segState(self.expandEl); });
      }
      if (this.collapseEl) {
        this.collapseEl.addEventListener("click", function () { self.collapseAll(); _segState(self.collapseEl); });
      }

      if (this.densityBtn && this.densityTgt) {
        var order = ["compact", "normal", "cozy"];
        this.densityBtn.addEventListener("click", function () {
          var cur = self.densityTgt.dataset.density || "normal";
          self.densityTgt.dataset.density = order[(order.indexOf(cur) + 1) % order.length];
        });
      }

      if (this.searchEl) {
        var t;
        this.searchEl.addEventListener("input", function () {
          clearTimeout(t);
          t = setTimeout(function () { self.search(self.searchEl.value); }, 110);
        });
      }

      /* Intro-section toggle: clicking #ts-info-toggle adds the
         generic .hide-section class on the intro. CSS animates it
         to max-height: 0 (overflow hidden, no padding, no border). */
      var infoBtn = document.getElementById('ts-info-toggle');
      var introEl = document.querySelector('.ts-tree-explorer__intro');
      if (infoBtn && introEl) {
        infoBtn.addEventListener('click', function () {
          var collapsed = introEl.classList.toggle('hide-section');
          infoBtn.setAttribute('aria-pressed', collapsed ? 'true' : 'false');
        });
      }
    };

    /* ---- PUBLIC INSTANCE METHODS ---- */
    Tree.prototype.expandAll = function () {
      var all = this.tree.querySelectorAll(".ts-tree__node[aria-expanded]");
      for (var i = 0; i < all.length; i++) this._setExpanded(all[i], true);
    };
    Tree.prototype.collapseAll = function () {
      var all = this.tree.querySelectorAll(".ts-tree__node[aria-expanded]");
      for (var i = 0; i < all.length; i++) this._setExpanded(all[i], false);
      var root = this.tree.firstElementChild;
      if (root) this._setExpanded(root, true);
    };
    Tree.prototype.setData = function (newData) {
      this.data = (newData || []).slice();
      this._render();
    };
    Tree.prototype.search = function (query) {
      this._activeQuery = String(query || '').trim().toLowerCase();
      this._applyFilters();
    };

    /* --------------------------------------------------------------
       _applyFilters — single pipeline that combines BOTH the search
       query and the taxonomy filter. Either input runs through here.
       Predicate per file:
         taxonomy:  label === 'All' || groupOf(name) === label
         search:    !query || name.includes(query)
         file shows iff (taxonomy && search) OR (any descendant matches)
       In flat-list mode (taxonomy !== 'All'), folders never match
       themselves — only files surface, regardless of depth.
    -------------------------------------------------------------- */
    Tree.prototype._applyFilters = function () {
      var q     = this._activeQuery   || '';
      var label = this._activeTaxonomy || 'All';
      var flat  = label !== 'All';
      var self  = this;

      this.tree.classList.toggle('ts-tree--flat', flat);

      /* clear previous marks */
      var marks = this.tree.querySelectorAll('mark');
      for (var i = 0; i < marks.length; i++) {
        marks[i].replaceWith(document.createTextNode(marks[i].textContent));
      }
      var allLabels = this.tree.querySelectorAll('.ts-tree__label');
      for (var j = 0; j < allLabels.length; j++) allLabels[j].normalize();

      /* keep every children-group expanded during the walk so we can
         reach matches at any depth; user expand-state is restored
         per-node below when running a search in tree mode. */
      var groups = this.tree.querySelectorAll('.ts-tree__children');
      for (var k = 0; k < groups.length; k++) groups[k].hidden = false;

      function highlight(labelEl) {
        if (!labelEl || !q) return;
        var text = labelEl.textContent;
        var i = text.toLowerCase().indexOf(q);
        if (i < 0) return;
        labelEl.textContent = '';
        labelEl.appendChild(document.createTextNode(text.slice(0, i)));
        var mk = document.createElement('mark');
        mk.textContent = text.slice(i, i + q.length);
        labelEl.appendChild(mk);
        labelEl.appendChild(document.createTextNode(text.slice(i + q.length)));
      }

      var anyMatch = false;
      function walk(nodeEl) {
        var isFile = nodeEl.classList.contains('ts-tree__node--file');
        var name   = nodeEl.dataset.name || '';

        /* recurse first so childMatch is known when we decide */
        var childMatch = false;
        var group = nodeEl.querySelector(':scope > .ts-tree__children');
        if (group) {
          for (var c = 0; c < group.children.length; c++) {
            if (walk(group.children[c])) childMatch = true;
          }
        }

        var passSearch = !q || name.indexOf(q) !== -1;
        var selfMatch;
        if (isFile) {
          var passTax = !flat || groupOf(name) === label;
          selfMatch = passTax && passSearch;
        } else {
          /* In flat mode, folders themselves are never a match — they
             still need to render if a descendant matched, so we keep
             them visible (CSS hides their .ts-tree__row visually). */
          selfMatch = !flat && passSearch;
        }

        var visible = selfMatch || childMatch;
        nodeEl.hidden = !visible;

        /* expand ancestors of matches in tree mode so search results
           are actually visible; flat mode skips this since folder
           rows are hidden anyway. */
        if (!flat && childMatch) self._setExpanded(nodeEl, true);

        if (selfMatch) {
          anyMatch = true;
          if (q) highlight(nodeEl.querySelector(':scope > .ts-tree__row > .ts-tree__label'));
        }
        return visible;
      }

      var roots = this.tree.children;
      for (var r = 0; r < roots.length; r++) walk(roots[r]);

      /* empty state shows only when an active filter has zero hits. */
      var anyFilterActive = !!q || flat;
      if (this.emptyEl) this.emptyEl.hidden = !anyFilterActive || anyMatch;
    };

    /* ==================================================================
       TAXONOMY (live filter) — derives groups + counts from this.data,
       renders a chip strip, and switches the tree into flat-list mode
       when a chip is clicked.  Reuses the search/empty surface so the
       same hidden/visible bookkeeping covers both filters.
    ================================================================== */
    var EXT_GROUP = {
      js: 'JS', mjs: 'JS', cjs: 'JS',
      ts: 'TypeScript', tsx: 'TypeScript', jsx: 'TypeScript',
      html: 'HTML', htm: 'HTML',
      css: 'CSS', scss: 'CSS', sass: 'CSS',
      json: 'JSON', md: 'Markdown', txt: 'Text', log: 'Logs',
      py: 'Python',
      png: 'Images', jpg: 'Images', jpeg: 'Images', gif: 'Images',
      webp: 'Images', svg: 'Images', ico: 'Images', avif: 'Images',
      pdf: 'PDF',
      zip: 'Archives', rar: 'Archives', '7z': 'Archives',
      mp4: 'Video', mov: 'Video', webm: 'Video',
      mp3: 'Audio', wav: 'Audio',
      ttf: 'Fonts', otf: 'Fonts', woff: 'Fonts', woff2: 'Fonts',
      sh: 'Shell', bat: 'Shell', ps1: 'Shell',
      yml: 'Config', yaml: 'Config', toml: 'Config', ini: 'Config',
      csv: 'Sheets', xlsx: 'Sheets', xls: 'Sheets'
    };
    function extOf(name) {
      var s = String(name || '');
      var dot = s.lastIndexOf('.');
      return dot > 0 ? s.slice(dot + 1).toLowerCase() : '';
    }
    function groupOf(name) {
      return EXT_GROUP[extOf(name)] || 'Other';
    }

    Tree.prototype._buildTaxonomy = function () {
      if (!this.taxonomyEl) return;
      var counts = { All: 0 };
      (function walk(nodes) {
        for (var i = 0; i < nodes.length; i++) {
          var n = nodes[i]; if (!n) continue;
          if (n.type === 'file') {
            counts.All++;
            var g = groupOf(n.name);
            counts[g] = (counts[g] || 0) + 1;
          }
          if (n.children && n.children.length) walk(n.children);
        }
      })(this.data);

      var entries = Object.keys(counts)
        .filter(function (k) { return k !== 'All'; })
        .sort(function (a, b) { return counts[b] - counts[a]; })
        .map(function (k) { return [k, counts[k]]; });
      entries.unshift(['All', counts.All]);

      this.taxonomyEl.textContent = '';
      var self = this;
      entries.forEach(function (e) {
        var chip = document.createElement('button');
        chip.type = 'button';
        chip.className = 'ts-chip';
        chip.setAttribute('role', 'tab');
        chip.setAttribute('aria-selected', e[0] === 'All' ? 'true' : 'false');
        chip.dataset.taxonomy = e[0];
        /* Label + count — no bespoke class. Count is a <small>, dimmed
           via a contextual rule against #ts-taxonomy.ts-chips. */
        chip.append(e[0] + ' ');
        var c = document.createElement('small');
        c.textContent = e[1];
        chip.appendChild(c);
        self.taxonomyEl.appendChild(chip);
      });

      this.taxonomyEl.addEventListener('click', function (ev) {
        var chip = ev.target.closest('.ts-chip');
        if (!chip) return;
        self.filterByTaxonomy(chip.dataset.taxonomy);
      });
    };

    Tree.prototype.filterByTaxonomy = function (label) {
      this._activeTaxonomy = label || 'All';
      if (this.taxonomyEl) {
        var chips = this.taxonomyEl.querySelectorAll('.ts-chip');
        for (var i = 0; i < chips.length; i++) {
          chips[i].setAttribute('aria-selected',
            chips[i].dataset.taxonomy === this._activeTaxonomy ? 'true' : 'false');
        }
      }
      this._applyFilters();
    };

    /* ==================================================================
       PREVIEW SIDEBAR  ·  preview(node) opens an iframe in the sidebar.
       Falls back to a "not previewable" panel for binary types.
    ================================================================== */
    var PREVIEW_KIND = {
      png:'image', jpg:'image', jpeg:'image', gif:'image', webp:'image',
      svg:'image', ico:'image', avif:'image',
      md:'text', txt:'text', log:'text', csv:'text', tsv:'text', xml:'text',
      json:'text', yml:'text', yaml:'text', toml:'text', ini:'text',
      sh:'text', bat:'text', ps1:'text',
      py:'text', js:'text', mjs:'text', cjs:'text', ts:'text', tsx:'text', jsx:'text',
      css:'text', scss:'text', sass:'text',
      html:'html', htm:'html',
      pdf:'pdf'
    };
    function previewKindOf(name) {
      var s = String(name || '');
      var dot = s.lastIndexOf('.');
      var ext = dot > 0 ? s.slice(dot + 1).toLowerCase() : '';
      return PREVIEW_KIND[ext] || null;
    }
    function formatBytes(b) {
      if (b == null) return '';
      if (b < 1024) return b + ' B';
      if (b < 1024 * 1024) return (b / 1024).toFixed(1) + ' KB';
      return (b / (1024 * 1024)).toFixed(1) + ' MB';
    }

    Tree.prototype._bindPreview = function () {
      var self = this;
      if (this.previewCloseEl) {
        this.previewCloseEl.addEventListener('click', function () { self.closePreview(); });
      }
    };

    function _escHtml(s) {
      return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
        return { '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c];
      });
    }
    function _renderTextSrcdoc(text, name) {
      /* Lightweight source viewer — dark by default; print rules
         neutralise for paper output. No theme override needed. */
      return (
        '<!DOCTYPE html><meta charset="utf-8"><title>' + _escHtml(name) + '</title>' +
        '<style>html,body{margin:0;background:#0c0d0f;color:#e8e9ea;}' +
        'body{font:12px/1.55 "JetBrains Mono","Fira Code",monospace;' +
        'padding:14px 18px;}' +
        'pre{white-space:pre-wrap;word-break:break-word;margin:0;}' +
        '@media print{html,body{background:#fff;color:#000;}}' +
        '</style><pre>' + _escHtml(text) + '</pre>'
      );
    }

    Tree.prototype.preview = function (node) {
      if (!this.previewEl || !this.explorerEl) return;
      if (!node || node.type !== 'file') return;
      var kind = previewKindOf(node.name);
      var url  = node.url || '';
      var self = this;

      if (this.previewNameEl) this.previewNameEl.textContent = node.name || '';
      if (this.previewMetaEl) {
        var bits = [];
        if (node.size != null)  bits.push(formatBytes(node.size));
        if (node.mtime)         bits.push(new Date(node.mtime * 1000).toLocaleString());
        bits.push(kind || 'binary');
        this.previewMetaEl.textContent = bits.join(' · ');
      }
      this.explorerEl.setAttribute('data-preview-visible', 'true');
      this._lastNodeData = node;

      if (!kind || !url) {
        if (this.previewIframeEl) {
          this.previewIframeEl.removeAttribute('src');
          this.previewIframeEl.removeAttribute('srcdoc');
        }
        if (this.previewFallbackEl) this.previewFallbackEl.hidden = false;
        return;
      }
      if (this.previewFallbackEl) this.previewFallbackEl.hidden = true;
      if (!this.previewIframeEl) return;

      if (kind === 'text') {
        /* Fetch + render as source. Avoids the browser's blank-page
           behaviour for .css / .js / .json AND the sandbox-script
           warnings for files with userscript metadata. */
        this.previewIframeEl.removeAttribute('src');
        var iframe = this.previewIframeEl;
        iframe.srcdoc = '<!DOCTYPE html><meta charset="utf-8"><body style="background:#0c0d0f;color:#9ea0a5;font:12px/1.55 monospace;padding:14px;">Loading\u2026</body>';
        fetch(url, { cache: 'force-cache' })
          .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.text(); })
          .then(function (text) {
            if (self._lastNodeData !== node) return;   /* user moved on */
            iframe.srcdoc = _renderTextSrcdoc(text, node.name);
          })
          .catch(function (err) {
            if (self._lastNodeData !== node) return;
            iframe.srcdoc = _renderTextSrcdoc('Could not load file:\n  ' + err.message, node.name);
          });
      } else {
        /* image / html / pdf: let the browser handle it. */
        this.previewIframeEl.removeAttribute('srcdoc');
        this.previewIframeEl.src = url;
      }
    };

    Tree.prototype.closePreview = function () {
      if (this.previewIframeEl) this.previewIframeEl.removeAttribute('src');
      if (this.explorerEl)      this.explorerEl.setAttribute('data-preview-visible', 'false');
    };

    /* ==================================================================
       ROW ACTIONS MENU  ·  popover attached to #ts-action-more, applies
       to the currently-selected row. Supports right-click context too.
    ================================================================== */
    Tree.prototype._bindMenu = function () {
      var self = this;
      if (!this.menuTriggerEl || !this.menuPopoverEl) return;

      this.menuTriggerEl.addEventListener('click', function (e) {
        e.stopPropagation();
        self._toggleMenu(true);
      });

      /* Right-click on a tree row also opens the menu, positioned at the
         pointer, and selects the row underneath. */
      this.tree.addEventListener('contextmenu', function (e) {
        var row = e.target.closest('.ts-tree__row');
        if (!row) return;
        e.preventDefault();
        /* Select the row WITHOUT running preview (which is heavy for
           large files). User opens preview deliberately via the menu. */
        var nodeEl = row.parentElement;
        var prevSel = self.tree.querySelector('.ts-tree__node[aria-selected="true"]');
        if (prevSel && prevSel !== nodeEl) prevSel.removeAttribute('aria-selected');
        nodeEl.setAttribute('aria-selected', 'true');
        self._toggleMenu(true, { x: e.clientX, y: e.clientY });
      });

      document.addEventListener('click', function (e) {
        if (!self.menuPopoverEl.contains(e.target)
            && e.target !== self.menuTriggerEl
            && !self.menuTriggerEl.contains(e.target)) {
          self._toggleMenu(false);
        }
      });

      this.menuPopoverEl.addEventListener('click', function (e) {
        var btn = e.target.closest('[data-menu-action]');
        if (!btn) return;
        self._runMenuAction(btn.dataset.menuAction);
        self._toggleMenu(false);
      });
    };

    Tree.prototype._toggleMenu = function (show, atPoint) {
      if (!this.menuPopoverEl) return;
      if (!show) { this.menuPopoverEl.hidden = true; return; }
      this.menuPopoverEl.hidden = false;
      var pop = this.menuPopoverEl.getBoundingClientRect();
      var x, y;
      if (atPoint) { x = atPoint.x; y = atPoint.y; }
      else {
        var t = this.menuTriggerEl.getBoundingClientRect();
        x = t.right - pop.width; y = t.bottom + 6;
      }
      x = Math.min(Math.max(8, x), window.innerWidth  - pop.width  - 8);
      y = Math.min(Math.max(8, y), window.innerHeight - pop.height - 8);
      this.menuPopoverEl.style.left = x + 'px';
      this.menuPopoverEl.style.top  = y + 'px';
    };

    Tree.prototype._runMenuAction = function (action) {
      var nodeEl = this.tree.querySelector('.ts-tree__node[aria-selected="true"]');
      if (!nodeEl) return;
      var node = this._nodeFromEl(nodeEl);
      var fullPath = node.id || node.url;
      var fileUrl  = node.id ? ('file:///' + node.id.replace(/\\/g, '/')) : node.url;
      var name     = node.name;
      function clip(text) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text);
        } else {
          var ta = document.createElement('textarea');
          ta.value = text; document.body.appendChild(ta);
          ta.select(); document.execCommand('copy'); document.body.removeChild(ta);
        }
      }
      switch (action) {
        case 'open':       var a = nodeEl.querySelector('a.ts-tree__label'); if (a) a.click(); break;
        case 'preview':    this.preview(node); break;
        case 'copy-path':  clip(fullPath); break;
        case 'copy-url':   clip(fileUrl);  break;
        case 'copy-md':    clip('[' + name + '](' + fileUrl + ')'); break;
        case 'copy-html':  clip('<a href="' + fileUrl + '">' + name + '</a>'); break;
        case 'reveal':
          /* Step out of any active filter so the row is visible in its
             real hierarchical position before we expand + scroll. */
          if (this._activeTaxonomy !== 'All') this.filterByTaxonomy('All');
          if (this.searchEl) this.searchEl.value = '';
          this._activeQuery = '';
          this._applyFilters();
          var cur = nodeEl.parentElement;
          while (cur) {
            var anc = cur.closest('.ts-tree__node');
            if (!anc) break;
            this._setExpanded(anc, true);
            cur = anc.parentElement;
          }
          nodeEl.scrollIntoView({ block: 'center', behavior: 'smooth' });
          break;
      }
    };

    /* ==================================================================
       EXPORT MENU  ·  emit the tree as CSV / MD / JSON / static HTML.
       Triggered from #ts-action-export. The static HTML is a no-JS
       <ul>/<li> view so the export is readable without ToolskinTree.
    ================================================================== */
    Tree.prototype._bindExport = function () {
      var self = this;
      if (!this.exportTriggerEl || !this.exportPopoverEl) return;
      if (this.exportTriggerEl.disabled) this.exportTriggerEl.disabled = false;

      this.exportTriggerEl.addEventListener('click', function (e) {
        e.stopPropagation();
        self._toggleExport(true);
      });
      document.addEventListener('click', function (e) {
        if (!self.exportPopoverEl.contains(e.target)
            && e.target !== self.exportTriggerEl
            && !self.exportTriggerEl.contains(e.target)) {
          self._toggleExport(false);
        }
      });
      this.exportPopoverEl.addEventListener('click', function (e) {
        var btn = e.target.closest('[data-export-format]');
        if (!btn) return;
        self.export(btn.dataset.exportFormat);
        self._toggleExport(false);
      });
    };
    Tree.prototype._toggleExport = function (show) {
      if (!this.exportPopoverEl) return;
      if (!show) { this.exportPopoverEl.hidden = true; return; }
      this.exportPopoverEl.hidden = false;
      var pop = this.exportPopoverEl.getBoundingClientRect();
      var t = this.exportTriggerEl.getBoundingClientRect();
      var x = t.right - pop.width;
      var y = t.bottom + 6;
      x = Math.min(Math.max(8, x), window.innerWidth  - pop.width  - 8);
      y = Math.min(Math.max(8, y), window.innerHeight - pop.height - 8);
      this.exportPopoverEl.style.left = x + 'px';
      this.exportPopoverEl.style.top  = y + 'px';
    };

    function _esc(s) {
      return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
        return { '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c];
      });
    }

    Tree.prototype.export = function (format) {
      var data = this.data;
      var rootName = (data[0] && (data[0].name || 'tree')) || 'tree';
      var content = '', mime = 'text/plain', ext = '.txt';

      if (format === 'json') {
        content = JSON.stringify(data, null, 2);
        mime = 'application/json'; ext = '.json';
      } else if (format === 'csv') {
        var rows = [['name','type','depth','url','size_bytes']];
        (function walk(nodes, depth) {
          nodes.forEach(function (n) {
            rows.push([n.name, n.type, depth, n.url || '', n.size == null ? '' : n.size]);
            if (n.children) walk(n.children, depth + 1);
          });
        })(data, 0);
        content = rows.map(function (r) {
          return r.map(function (c) { return '"' + String(c).replace(/"/g, '""') + '"'; }).join(',');
        }).join('\n');
        mime = 'text/csv'; ext = '.csv';
      } else if (format === 'md') {
        var lines = ['# ' + rootName, ''];
        (function walk(nodes, depth) {
          nodes.forEach(function (n) {
            var pad = new Array(depth + 1).join('  ');
            if (n.type === 'folder') {
              lines.push(pad + '- **' + n.name + '/**');
            } else {
              var u = n.url ? ('](' + n.url + ')') : '';
              lines.push(pad + '- ' + (n.url ? '[' + n.name + u : n.name));
            }
            if (n.children) walk(n.children, depth + 1);
          });
        })(data, 0);
        content = lines.join('\n');
        mime = 'text/markdown'; ext = '.md';
      } else if (format === 'html' || format === 'pdf') {
        /* Both 'html' and 'pdf' share the same static markup. For 'html'
           we download it; for 'pdf' we open in a new window and trigger
           print() so the user can save through the OS print dialog. */
        var staticHtml = (function () {
          var lines = ['<ul class="tree">'];
          (function walk(nodes) {
            nodes.forEach(function (n) {
              if (n.type === 'folder') {
                lines.push('<li><b>' + _esc(n.name) + '/</b>');
                if (n.children && n.children.length) {
                  lines.push('<ul>'); walk(n.children); lines.push('</ul>');
                }
                lines.push('</li>');
              } else {
                lines.push('<li><a href="' + _esc(n.url) + '">' + _esc(n.name) + '</a></li>');
              }
            });
          })(data);
          lines.push('</ul>');
          return (
            '<!DOCTYPE html>\n<meta charset="utf-8">\n<title>' + _esc(rootName) + ' — tree</title>\n' +
            '<style>body{margin:0;padding:24px 32px;background:#0c0d0f;color:#e8e9ea;' +
            'font-family:system-ui,sans-serif}h1{font-weight:600}ul{padding-left:1.3em;list-style:none}' +
            'li{padding:2px 0;border-left:1px dashed #3e4045;padding-left:.6em;margin-left:.2em}' +
            'a{color:#fbac23;text-decoration:none}a:hover{text-decoration:underline}' +
            'b{color:#fff}' +
            '@media print{body{background:#fff;color:#000}li{border-left-color:#bbb}' +
            'a{color:#b06800}b{color:#000}}' +
            '</style>\n<h1>' + _esc(rootName) + '</h1>\n' + lines.join('')
          );
        })();

        if (format === 'pdf') {
          var w = window.open('', '_blank');
          if (!w) {
            console.warn('[ToolskinTree] PDF export: popup blocked');
            return;
          }
          w.document.open();
          w.document.write(staticHtml);
          w.document.close();
          w.focus();
          /* Give the new window a tick to lay out before invoking print. */
          setTimeout(function () { try { w.print(); } catch (e) {} }, 250);
          return;
        }
        content = staticHtml;
        mime = 'text/html'; ext = '.html';
      } else { return; }

      var blob = new Blob([content], { type: mime + ';charset=utf-8' });
      var u = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = u;
      a.download = rootName.replace(/[^a-z0-9._-]+/gi, '_') + '-tree' + ext;
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
      setTimeout(function () { URL.revokeObjectURL(u); }, 1000);
    };

    /* ==================================================================
       PUBLIC FACADE
    ================================================================== */
    global.ToolskinTree = {
      init: function (opts) {
        opts = opts || {};
        var target = resolveEl(opts.target);
        if (!target) {
          console.warn("[ToolskinTree] init: target not found", opts.target);
          return null;
        }
        if (!opts.data) {
          console.warn("[ToolskinTree] init: no data provided");
          return null;
        }
        return new Tree(target, opts);
      }
    };
  })(window);

  /* ====================================================================
     This page's instance — the only "user code" the explorer needs.
     The Python script serialised the filesystem into the inline JSON
     below; we hand it to ToolskinTree, which builds the entire DOM.
  ==================================================================== */
  /* Load order:
       1. inline <script id="ts-tree-data"> (works in file:// — no fetch)
       2. fetch('./tree-explorer.data.json') as fallback
     This keeps the file double-clickable while still letting the user
     swap to a fetched JSON when they want a leaner HTML over http://. */
  function _treeLoadInline() {
    var el = document.getElementById('ts-tree-data');
    if (!el) return null;
    var txt = (el.textContent || '').trim();
    if (!txt) return null;
    try { return JSON.parse(txt); }
    catch (e) { console.warn('[ToolskinTree] inline data invalid:', e); return null; }
  }
  function _treeInit(data) {
      ToolskinTree.init({
        target:        '#ts-tree',
        data:          data,
        wrapper:       '#ts-explorer',
        search:        '#ts-search',
        expand:        '#ts-expand',
        collapse:      '#ts-collapse',
        density:       { button: '#ts-density', target: '#ts-explorer' },
        taxonomy:      '#ts-taxonomy',
        stats:         '#ts-stats',
        rootPath:      '#ts-root-path',
        empty:         '#ts-empty',
        preview:         '#ts-preview',
        previewIframe:   '#ts-preview-iframe',
        previewName:     '#ts-preview-name',
        previewClose:    '#ts-preview-close',
        previewMeta:     '#ts-preview-meta',
        previewFallback: '#ts-preview-fallback',
        menuTrigger:   '#ts-action-more',
        menuPopover:   '#ts-row-menu',
        exportTrigger: '#ts-action-export',
        exportPopover: '#ts-export-menu'
      });
  }
  /* Boot waits for DOMContentLoaded so the inline <script id="ts-tree-data">
     (which sits below this script in the body) is already in the DOM
     when _treeLoadInline() queries for it. */
  function _treeBoot() {
    var inlineData = _treeLoadInline();
    if (inlineData) { _treeInit(inlineData); return; }
    fetch('./tree-explorer.data.json', { cache: 'no-cache' })
      .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
      .then(_treeInit)
      .catch(function (err) {
        var stats = document.getElementById('ts-stats');
        if (stats) stats.textContent = 'Failed to load tree data (' + err.message + ')';
        console.error('[ToolskinTree] failed to load data:', err);
      });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', _treeBoot);
  } else {
    _treeBoot();
  }
  </script>
  <!-- Row action menu popover (positioned by JS) -->
  <div id="ts-row-menu" class="ts-tree-popover" role="menu" aria-label="Row actions" hidden>
    <button class="ts-tree-popover__item" type="button" role="menuitem" data-menu-action="open">
      <i class="fa-solid fa-arrow-up-right-from-square"></i><span class="ts-btn-text">Open externally</span>
    </button>
    <button class="ts-tree-popover__item" type="button" role="menuitem" data-menu-action="preview">
      <i class="fa-regular fa-eye"></i><span class="ts-btn-text">Preview in sidebar</span>
    </button>
    <div class="ts-tree-popover__sep"></div>
    <button class="ts-tree-popover__item" type="button" role="menuitem" data-menu-action="copy-path">
      <i class="fa-regular fa-copy"></i><span class="ts-btn-text">Copy absolute path</span>
    </button>
    <button class="ts-tree-popover__item" type="button" role="menuitem" data-menu-action="copy-url">
      <i class="fa-solid fa-link"></i><span class="ts-btn-text">Copy file URL</span>
    </button>
    <button class="ts-tree-popover__item" type="button" role="menuitem" data-menu-action="copy-md">
      <i class="fa-brands fa-markdown"></i><span class="ts-btn-text">Copy as Markdown link</span>
    </button>
    <button class="ts-tree-popover__item" type="button" role="menuitem" data-menu-action="copy-html">
      <i class="fa-solid fa-code"></i><span class="ts-btn-text">Copy as &lt;a&gt; HTML</span>
    </button>
    <div class="ts-tree-popover__sep"></div>
    <button class="ts-tree-popover__item" type="button" role="menuitem" data-menu-action="reveal">
      <i class="fa-solid fa-crosshairs"></i><span class="ts-btn-text">Reveal in tree</span>
    </button>
  </div>

  <!-- Export format menu popover -->
  <div id="ts-export-menu" class="ts-tree-popover" role="menu" aria-label="Export format" hidden>
    <button class="ts-tree-popover__item" type="button" role="menuitem" data-export-format="json">
      <i class="fa-solid fa-code"></i><span class="ts-btn-text">JSON (.json)</span>
    </button>
    <button class="ts-tree-popover__item" type="button" role="menuitem" data-export-format="csv">
      <i class="fa-solid fa-table"></i><span class="ts-btn-text">CSV (.csv)</span>
    </button>
    <button class="ts-tree-popover__item" type="button" role="menuitem" data-export-format="md">
      <i class="fa-brands fa-markdown"></i><span class="ts-btn-text">Markdown (.md)</span>
    </button>
    <button class="ts-tree-popover__item" type="button" role="menuitem" data-export-format="html">
      <i class="fa-brands fa-html5"></i><span class="ts-btn-text">Static HTML (no-JS)</span>
    </button>
    <button class="ts-tree-popover__item" type="button" role="menuitem" data-export-format="pdf">
      <i class="fa-regular fa-file-pdf"></i><span class="ts-btn-text">PDF (Print to PDF)</span>
    </button>
  </div>

  <!-- Inline tree data — embedded so the HTML works in file:// without
       requiring a server. JS prefers this; falls back to fetch() if the
       block is empty. Python populates the script body at write time. -->
  <script id="ts-tree-data" type="application/json">__TS_TREE_DATA__</script>

</body>

</html>
"""

# ==============================
# RENDER + WRITE
# ==============================

# Write the data JSON (the heavy part — kept out of the HTML).
OUTPUT_JSON.write_text(json.dumps(tree, indent=2), encoding="utf-8")

# Write the HTML shell. We embed the tree data INLINE in a
# <script type="application/json"> block so the HTML works in
# file:// without a server. JS prefers inline; if you want a leaner
# HTML over http://, empty the script tag and the page will fetch
# tree-explorer.data.json instead.
tree_json = json.dumps(tree, indent=2)
html = (
    HTML_TEMPLATE
    .replace("__GENERATED_AT__", datetime.now().strftime("%Y-%m-%d %H:%M"))
    .replace("__TS_TREE_DATA__", tree_json, 1)
)
OUTPUT_HTML.write_text(html, encoding="utf-8")

# Second-pass dedup — hash same-size-same-name candidates only, then
# group by SHA-1 so an AI agent can review and act on the result.
dedup = build_dedup_groups(tree)
OUTPUT_DEDUP.write_text(json.dumps(dedup, indent=2), encoding="utf-8")

html_kb  = OUTPUT_HTML.stat().st_size  // 1024
json_kb  = OUTPUT_JSON.stat().st_size  // 1024
dedup_kb = OUTPUT_DEDUP.stat().st_size // 1024
print(f"HTML  -> {OUTPUT_HTML.name}  ({html_kb} KB)")
print(f"DATA  -> {OUTPUT_JSON.name} ({json_kb} KB)")
print(f"DEDUP -> {OUTPUT_DEDUP.name} ({dedup_kb} KB, "
      f"{dedup['summary']['duplicate_groups']} groups, "
      f"{dedup['summary']['redundant_files']} redundant files, "
      f"{dedup['summary']['wasted_mb']} MB wasted)")

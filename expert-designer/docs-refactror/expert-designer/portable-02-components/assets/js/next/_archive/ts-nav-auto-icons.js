/* ═══════════════════════════════════════════════════════════════════════════
   TOOLSKIN · ts-nav-auto-icons.js — ICON AUTO-INJECTION staging addon
   ───────────────────────────────────────────────────────────────────────────
   STATUS: Staging — not yet merged into ts-nav.js. Load after ts-icons.js.

   PURPOSE
   ───────
   Scans all .auto-icons nav containers. For each <a> or <li><a> that has
   no existing .ts-icon sibling, reads the .ts-menu-text (or anchor text),
   normalises it, looks up the keyword table, and prepends a
   <span class="ts-icon" data-ts-icon="..."> before the .ts-menu-text.
   After injecting, calls ToolskinIcons.inject() on the container so Font
   Awesome renders the new nodes.

   USAGE
     <div class="ts-mobile-menu-items ts-auto-icon">...</div>
     <script src="assets/js/next/ts-nav-auto-icons.js" defer></script>

   INTEGRATION TARGET (Claude Code)
   ─────────────────────────────────
     1. Move NAV_AUTO_ICONS into ts-nav.js.
     2. Fold autoInjectIcons() into ToolskinDynamicNav.init().
     3. Delete this staging file.
   ═══════════════════════════════════════════════════════════════════════════ */
(function () {
  "use strict";

  /* ── Keyword lookup table ─────────────────────────────────────────────────
     Keys are lowercase, punctuation-stripped keyword fragments.
     Values are Font Awesome class strings (fa-solid / fa-regular / fa-brands).
     Extend from FA JSON metadata or ionicons as needed.
     ─────────────────────────────────────────────────────────────────────── */
  var NAV_AUTO_ICONS = {
    /* Navigation / pages */
    "home":       "fa-solid fa-house",
    "top":        "fa-solid fa-house",
    "overview":   "fa-solid fa-house",
    "dashboard":  "fa-solid fa-gauge",
    "start":      "fa-solid fa-play",

    /* Content */
    "docs":       "fa-solid fa-book",
    "documentation": "fa-solid fa-book",
    "guide":      "fa-solid fa-book-open",
    "blog":       "fa-solid fa-rss",
    "changelog":  "fa-solid fa-clock-rotate-left",
    "roadmap":    "fa-solid fa-road",
    "release":    "fa-solid fa-tag",
    "news":       "fa-solid fa-newspaper",

    /* System / design tokens */
    "tokens":     "fa-solid fa-cube",
    "surfaces":   "fa-solid fa-layer-group",
    "layers":     "fa-solid fa-layer-group",
    "accent":     "fa-solid fa-palette",
    "colors":     "fa-solid fa-palette",
    "colour":     "fa-solid fa-palette",
    "theme":      "fa-solid fa-circle-half-stroke",
    "typography": "fa-solid fa-font",
    "type":       "fa-solid fa-font",
    "spacing":    "fa-solid fa-ruler-combined",
    "radius":     "fa-solid fa-vector-square",
    "motion":     "fa-solid fa-wand-magic-sparkles",
    "animation":  "fa-solid fa-wand-magic-sparkles",

    /* Components */
    "components": "fa-solid fa-table-cells",
    "patterns":   "fa-solid fa-shapes",
    "showcase":   "fa-solid fa-wand-magic-sparkles",
    "gallery":    "fa-solid fa-images",
    "ui":         "fa-solid fa-window-maximize",

    /* Actions / CTAs */
    "search":     "fa-solid fa-magnifying-glass",
    "settings":   "fa-solid fa-gear",
    "profile":    "fa-solid fa-user",
    "account":    "fa-solid fa-user",
    "login":      "fa-solid fa-right-to-bracket",
    "sign in":    "fa-solid fa-right-to-bracket",
    "signin":     "fa-solid fa-right-to-bracket",
    "logout":     "fa-solid fa-right-from-bracket",
    "sign out":   "fa-solid fa-right-from-bracket",
    "contact":    "fa-solid fa-envelope",
    "support":    "fa-solid fa-life-ring",
    "about":      "fa-solid fa-circle-info",
    "pricing":    "fa-solid fa-tag",
    "products":   "fa-solid fa-box",
    "services":   "fa-solid fa-wrench",
    "portfolio":  "fa-solid fa-briefcase",

    /* Tools */
    "banner":     "fa-solid fa-sliders",
    "generator":  "fa-solid fa-sliders",
    "editor":     "fa-solid fa-pen-to-square",
    "export":     "fa-solid fa-download",
    "import":     "fa-solid fa-upload"
  };

  /* ── Helpers ──────────────────────────────────────────────────────────── */

  /** Normalise a label string: lowercase, collapse whitespace, strip punct. */
  function normalise(text) {
    return (text || "")
      .toLowerCase()
      .replace(/[^\w\s]/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  /** Find the best icon for a normalised label string.
      First tries exact match, then checks if any key is a substring. */
  function resolve(label) {
    if (!label) return null;
    if (NAV_AUTO_ICONS[label]) return NAV_AUTO_ICONS[label];
    var keys = Object.keys(NAV_AUTO_ICONS);
    for (var i = 0; i < keys.length; i++) {
      if (label.indexOf(keys[i]) !== -1) return NAV_AUTO_ICONS[keys[i]];
    }
    return null;
  }

  /** Read the text label for an anchor: prefer .ts-menu-text content,
      else the anchor's direct text nodes (ignoring existing .ts-icon). */
  function readLabel(anchor) {
    var mt = anchor.querySelector(".ts-menu-text");
    if (mt) return mt.textContent;
    /* Collect text nodes, skip .ts-icon children */
    var text = "";
    anchor.childNodes.forEach(function (node) {
      if (node.nodeType === 3) text += node.textContent;
      else if (node.nodeType === 1 && !node.classList.contains("ts-icon")) {
        text += node.textContent;
      }
    });
    return text;
  }

  /** Inject a .ts-icon span before the .ts-menu-text (or before firstChild). */
  function injectIcon(anchor, iconCls) {
    var icon = document.createElement("span");
    icon.className = "ts-icon";
    icon.setAttribute("data-ts-icon", iconCls);
    icon.setAttribute("aria-hidden", "true");
    var mt = anchor.querySelector(".ts-menu-text");
    anchor.insertBefore(icon, mt || anchor.firstChild);
  }

  /* ── Core: process one .auto-icons container ──────────────────────────── */
  function processContainer(container) {
    var anchors = container.querySelectorAll("a");
    anchors.forEach(function (a) {
      /* Skip if icon already exists (idempotent) */
      if (a.querySelector(".ts-icon")) return;
      if (a.getAttribute("data-auto-icon-processed") === "1") return;

      var label  = normalise(readLabel(a));
      var iconCls = resolve(label);
      if (iconCls) {
        injectIcon(a, iconCls);
        a.setAttribute("data-auto-icon-processed", "1");
      }
    });

    /* Re-run ts-icons.js injection so FA renders the newly-created .ts-icon nodes.
       ToolskinIcons is ts-icons.js's export — it may not be available yet if the
       script is loading; we guard and re-try after load. */
    if (window.ToolskinIcons && typeof window.ToolskinIcons.inject === "function") {
      window.ToolskinIcons.inject(container);
    }
  }

  /* ── Init ────────────────────────────────────────────────────────────── */
  function init() {
    var containers = document.querySelectorAll(".auto-icons, .ts-auto-icon");
    containers.forEach(processContainer);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
  /* Re-run after fonts+icons settle in case FA injects asynchronously */
  window.addEventListener("load", init);

})();

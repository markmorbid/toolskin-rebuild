/* ═══════════════════════════════════════════════════════════════════════════
   TOOLSKIN · ts-nav.js — TOP NAVIGATION behaviors (dependency-free, standalone)
   ───────────────────────────────────────────────────────────────────────────
   REFACTOR CONTRACT
   A faithful, dependency-free extraction of the navigation runtime that lives
   inside the canonical `toolskin.js` library (the source of truth). Drop it into
   pages that don't yet load the full framework; it behaves identically so the
   migration back into the class engine is seamless.

   Mirrors these library modules 1:1:
     • ToolskinDynamicNav  — primary-nav overflow → "More" dropdown + per-item
                             auto-formatting + scroll-state machine.
     • ToolskinMobileMenu  — burger + overlay + sidebar drawer.
     • ToolskinTheme       — delegated [data-theme-toggle] switching (subset).

   Standalone-only enhancement (NOT in the library): logo subtitle width-match.

   ───────────────────────────────────────────────────────────────────────────
   WHAT CHANGED IN THIS REVISION (and why)
     1. SELECTOR REGISTRY (TS_SELECTORS): every selector / class / attribute the
        script touches is declared ONCE in a central bucket, each entry holding
        the primary selector AND its aliases in a single string. Nothing else in
        the file hard-codes a selector — they all read from the registry. This
        makes the script resilient to CSS refactors: change the bucket, not the
        logic. A small register() API lets you add a new named selector for a new
        usage, with usage docs inline. (See "SELECTOR REGISTRY" below.)
     2. STATIC-FIRST ADOPTION: the mobile menu now DETECTS pre-built burger /
        overlay / sidebar markup and ADOPTS it instead of building duplicates.
        It only generates nodes when they are genuinely absent. This kills the
        "two burgers / two drawers" duplication and prevents overriding the
        author's static markup. Remaining static links are smartly (re)formatted.
     3. CLASS ALIASES on the scroll machine, so BOTH the old and new CSS work:
          at-top state → html.is-at-top + html.has-scrolled  AND  nav.at-top
          top button   → #ts-top-btn.is-visible              AND  .active
        (The legacy script used nav.at-top @ y<10 and topBtn.active @ y>300;
         the new system uses html.is-at-top/has-scrolled + .is-visible @ 80px.
         We emit both so current pages keep working unchanged.)
     4. MOBILE-SWAP HIDING: when the burger is active / drawer open, html gets
        `ts-nav-mobile-open` and the nav gets `ts-nav--mobile` so CSS can hide
        the swapped-out desktop controls (overflow •••, framework select, etc.).
     5. VARIANT-FLEXIBLE link container: `ts-nav-fixed__links` is matched through
        the registry's alias list, so alternative variants resolve too.
     6. STATIC ul>li DROPDOWN SHOWCASES are never touched: overflow management is
        scoped to the LIVE bar only (the one matching #ts-primary-menu's id), and
        pre-filled `ul.ts-nav-dropdown > li` probes are left exactly as authored.
     7. SHOWCASE GUARD (isShowcase): every formatting / adoption / collapse / logo
        pass skips navs that are `.ts-nav--static` OR inside `.ts-harness-stage`,
        so the harness demos keep their authored inner-item formatting untouched.
        Only the LIVE header (#ts-topbar) is managed.
     8. DYNAMIC TOKEN-DRIVEN BREAKPOINTS — two complementary mechanisms:
        (a) TSNavCollapse toggles `.is-collapsed`/`.is-narrow` per INSTANCE by
            reading `--ts-nav-collapse-at` / `--ts-nav-collapse-at-narrow` and
            measuring with a ResizeObserver (works inside narrow containers).
        (b) refreshMediaBreakpoints() TOKENIZES the EXISTING @media px values in
            place via the CSSOM — it rewrites each matching media rule's condition
            (CSSMediaRule.media.mediaText) to the token-resolved px WITHOUT editing
            the stylesheet or touching the giant rule bodies. Mapping:
              768px → --ts-nav-collapse-at ; 420px & 480px → --ts-nav-collapse-at-narrow.
            Other values (e.g. 1140px) and declaration values (max-width:0px in rule
            bodies) are never touched. Re-runs on load + ts:theme-change, idempotent.
            Disable via window.TS_NAV_DISABLE_MEDIA_TOKENIZE = true.
        A small injected <style> bridge also mirrors the collapse onto the classes
        (disable via window.TS_NAV_DISABLE_CSS_BRIDGE = true). No extra CSS file.
     9. CONFIG SYSTEM (TS_CONFIG): every feature/module/bucket is configurable on
        init, library-style. Merge order: defaults ← window.TSNavConfig (global
        "header call" set before the script) ← TSNav.init({...}) (local override).
        Feature flags: theme, dynamicNav, mobileMenu, collapse, mediaTokenize,
        cssBridge, backToTop, logoFit, logoFitInShowcase, upgradeLegacyThemeToggles.
        Bucket overrides: selectors / ids / stateClasses / tokens / tokenDefaults.
        The logo fitter now runs in harness showcases BY DEFAULT (logoFitInShowcase
        = true); set it false to skip demos. Legacy TS_NAV_DISABLE_* flags still work.

   USAGE:  <script src="assets/js/next/ts-nav.js" defer></script>
   ═══════════════════════════════════════════════════════════════════════════ */
(function () {
  "use strict";

  /* ═══════════════════════════════════════════════════════════════════════════
     SELECTOR REGISTRY  ·  TS_SELECTORS
     ───────────────────────────────────────────────────────────────────────────
     ONE place to store every selector this script depends on. Each entry maps a
     stable logical KEY (used throughout the code) to a single STRING that may
     contain the primary selector plus any aliases, comma-separated — exactly the
     way you'd write a CSS selector list. Example:

         linksContainer: ".ts-nav-fixed__links, .ts-nav__links, [data-ts-nav-links]"

     The first token is treated as the "primary" (used when CREATING markup); the
     full string is used when QUERYING (so any alias matches). Because all logic
     reads from here, a CSS refactor only requires editing this bucket.

     ── HOW TO USE ──────────────────────────────────────────────────────────────
       • Query (first match):   TS.$(  "burger" )            → Element | null
       • Query (all matches):   TS.$$( "navLink" )           → Element[]
       • Query within a root:   TS.$(  "burger", rootEl )
       • Primary selector str:  TS.sel("burger")             → ".ts-menu-burger, …"
       • Primary token only:    TS.primary("burger")         → ".ts-menu-burger"
       • Primary as classname:  TS.primaryClass("burger")    → "ts-menu-burger"
       • Resolve an id key:      TS.byId("primaryMenu")       → Element | null

     ── HOW TO REGISTER A NEW SELECTOR (new usage) ───────────────────────────────
       1. Pick a logical key (camelCase) that describes the ROLE, not the markup.
       2. Register it once, ideally near the other registrations below:
              TS.register("megaPanel", ".ts-mega, [data-ts-mega]");
          (Pass `{ id: true }` as a 3rd arg if the key resolves a single element
           by id — see ID_KEYS — so TS.byId() can use it.)
       3. Reference it everywhere by key: TS.$$("megaPanel"), TS.sel("megaPanel"),
          etc. NEVER hard-code the literal selector in logic again.
       4. MIGRATION: when folding this file back into the toolskin.js class engine,
          move TS_SELECTORS + the TS helper object into the engine's shared scope
          (e.g. `Toolskin.selectors`) so every module resolves selectors the same
          way. Each module then calls Toolskin.$/$$ instead of re-declaring
          selectors. This registry is intentionally engine-portable: it has no
          dependencies and no side effects at definition time.
     ═══════════════════════════════════════════════════════════════════════════ */
  var TS_SELECTORS = {
    /* ── Shell / containers ─────────────────────────────────────────────── */
    // The fixed/sticky nav shell. Variant-flexible.
    navShell:        ".ts-nav-fixed, [data-ts-nav]",
    // The LIVE primary bar is identified by id (see ID_KEYS.primaryMenu).
    // This is the variant-flexible CLASS match for "a links container".
    linksContainer:  ".ts-nav-fixed__links, .ts-nav__links, [data-ts-nav-links]",
    // Per-item anchors inside a bar / drawer.
    navLink:         "a.ts-nav-item, a.ts-nav-link, a[data-ts-nav-item]",
    // Truncatable marker — items allowed to spill into the ••• dropdown.
    truncatable:     ".ts-nav-link, [data-ts-truncatable]",
    // Logo lockup + its parts (standalone subtitle fitter).
    logo:            ".ts-topbar__logo, [data-ts-logo]",
    logoBrand:       ".ts-logo-brand",
    logoSub:         ".ts-logo-sub",

    /* ── Overflow ("More") ──────────────────────────────────────────────── */
    moreCollapse:    ".ts-nav-more, [data-ts-nav-more]",        // gets .hasItems
    moreDropdown:    ".ts-nav-dropdown, [data-ts-nav-dropdown]",// receives spillover

    /* ── Item formatting hooks ──────────────────────────────────────────── */
    menuText:        ".ts-menu-text",
    icon:            ".ts-icon",
    autoIconHost:    ".ts-auto-icon, .auto-icons",

    /* ── Mobile drawer ──────────────────────────────────────────────────── */
    burger:          ".ts-menu-burger, [data-ts-burger]",
    overlay:         ".ts-mobile-menu-overlay, [data-ts-overlay]",
    drawer:          ".ts-mobile-menu, [data-ts-drawer]",
    drawerItems:     ".ts-mobile-menu-items, [data-ts-drawer-items]",
    burgerInner:     ".ts-menu-burger-inner",

    /* ── Controls that get swapped/hidden on mobile ─────────────────────── */
    // Anything matching this within the live shell is considered a desktop-only
    // control that should hide when the mobile drawer takes over. CSS owns the
    // actual hide via the `ts-nav--mobile` / `ts-nav-mobile-open` state classes,
    // but the list is here for any JS that needs to enumerate them.
    desktopOnly:     ".ts-nav-more, .ts-ui-select, [data-ts-desktop-only]",

    /* ── Theme toggle ───────────────────────────────────────────────────── */
    themeToggle:     "[data-theme-toggle], .theme-toggle",
    themeCheckbox:   'input[type="checkbox"]',

    /* ── Back-to-top (resolved by id; see ID_KEYS) ──────────────────────── */
    // (no class form needed — it's an id element)

    /* ── Icon attribute hosts (for the standalone icon shim) ────────────── */
    iconHostFa:      "[data-ts-icon]",
    iconHostAny:     "[data-icon], [data-ts-icon]"
  };

  /* Keys that resolve a SINGLE element by id (document.getElementById).
     Stored separately because ids aren't selector-lists. Edit here on refactor. */
  var TS_IDS = {
    primaryMenu:  "ts-primary-menu",   // the LIVE links bar (overflow source)
    navbarExtend: "navbar-extend",     // dropdown that receives overflow
    navbarCollapse: "navbar-collapse", // wrapper that gets .hasItems
    topBtn:       "ts-top-btn"         // back-to-top control
  };

  /* ── Helper API over the registry ─────────────────────────────────────── */
  var TS = {
    /** Full selector string (primary + aliases) for a key. */
    sel: function (key) {
      var s = TS_SELECTORS[key];
      if (!s) { console.warn("[ts-nav] unknown selector key:", key); return "*:not(*)"; }
      return s;
    },
    /** First token only (the canonical selector used when creating markup). */
    primary: function (key) {
      return TS.sel(key).split(",")[0].trim();
    },
    /** Primary token as a bare class name (strips leading ".") — for className=. */
    primaryClass: function (key) {
      return TS.primary(key).replace(/^\./, "");
    },
    /** querySelector across the alias list. */
    $: function (key, root) {
      return (root || document).querySelector(TS.sel(key));
    },
    /** querySelectorAll across the alias list → real Array. */
    $$: function (key, root) {
      return Array.prototype.slice.call((root || document).querySelectorAll(TS.sel(key)));
    },
    /** Resolve an id-keyed element. */
    byId: function (idKey, root) {
      var id = TS_IDS[idKey];
      if (!id) { console.warn("[ts-nav] unknown id key:", idKey); return null; }
      return (root || document).getElementById(id);
    },
    /** Register / override a selector key at runtime (see docs above). */
    register: function (key, selectorString, opts) {
      opts = opts || {};
      if (opts.id) { TS_IDS[key] = selectorString; }
      else { TS_SELECTORS[key] = selectorString; }
      return key;
    }
  };
  // Expose so pages/tests can tweak selectors without editing the file.
  window.TSNavSelectors = { map: TS_SELECTORS, ids: TS_IDS, api: TS };

  /* ─────────────────────────────────────────────────────────────────────────
     STATE CLASS NAMES — also centralized so they're easy to re-skin.
     Aliases included where the legacy + new systems differ.
     ───────────────────────────────────────────────────────────────────────── */
  var TS_STATE = {
    // scroll-at-top: html-level (new) + nav-level legacy alias
    htmlAtTop:     "is-at-top",
    htmlScrolled:  "has-scrolled",
    navAtTop:      "at-top",        // legacy alias on the nav shell
    // back-to-top visibility: new + legacy alias
    topVisible:    "is-visible",
    topVisibleAlt: "active",        // legacy alias
    // mobile swap
    htmlMobileOpen:  "ts-nav-mobile-open",
    navMobile:       "ts-nav--mobile",
    // overflow / drawer toggles (unchanged from library)
    hasItems:        "hasItems",
    activeDrawer:    "active",
    // dynamic-breakpoint collapse (token-driven; see TSNavCollapse)
    collapsed:       "is-collapsed",
    narrow:          "is-narrow"
  };

  /* ─────────────────────────────────────────────────────────────────────────
     TOKENS — CSS custom properties this script READS (not just classes).
     Centralized so a rename only happens here. Defaults are the fallback px
     used when the token is absent/0 on an instance.
     ───────────────────────────────────────────────────────────────────────── */
  var TS_TOKENS = {
    collapseAt:       "--ts-nav-collapse-at",
    collapseAtNarrow: "--ts-nav-collapse-at-narrow"
  };
  var TS_TOKEN_DEFAULTS = { collapseAt: 720, collapseAtNarrow: 420 };

  /* ═══════════════════════════════════════════════════════════════════════════
     CONFIG SYSTEM  ·  TS_CONFIG  (library-style, global + local override)
     ───────────────────────────────────────────────────────────────────────────
     Every special feature / class / function is toggled or retargeted here, so
     pages can opt in/out without editing this file. THREE layers, merged in order
     (later wins), deep-merged for the nested buckets:

       1. DEFAULTS below.
       2. GLOBAL override — set `window.TSNavConfig = {…}` in the HTML *before*
          this script loads (the "header call"). Example:
              <script>
                window.TSNavConfig = {
                  logoFit: true,
                  logoFitInShowcase: false,   // don't fit demo logos
                  mediaTokenize: false,       // leave @media px static
                  selectors: { burger: ".my-burger" }
                };
              </script>
              <script src="assets/js/next/ts-nav.js" defer></script>
       3. LOCAL override — pass options to the manual initializer:
              TSNav.init({ mobileMenu: false });   // re-inits with overrides
          (Auto-init still runs on DOM-ready with layers 1+2; calling init()
           again applies layer 3 on top.)

     BACK-COMPAT: the older window.TS_NAV_DISABLE_* booleans still work; they are
     folded into this config (see resolveConfig()).

     ── HOW TO ADD A NEW CONFIGURABLE FEATURE ────────────────────────────────────
       • Add a default flag here (e.g. `myFeature: true`).
       • Gate the feature's code on  CONFIG.myFeature.
       • Document it in this block. That's it — it's now globally + locally
         overridable through the same merge path.
     MIGRATION: move TS_CONFIG + resolveConfig into the engine as Toolskin.config;
     each module reads its own flag from there.
     ═══════════════════════════════════════════════════════════════════════════ */
  var TS_CONFIG_DEFAULTS = {
    /* ── Feature toggles (every module can be turned off) ───────────────── */
    theme:             true,   // delegated [data-theme-toggle] switching
    dynamicNav:        true,   // primary-nav overflow → ••• + item formatting + scroll state
    mobileMenu:        true,   // burger + overlay + drawer (static-first adoption)
    collapse:          true,   // per-instance .is-collapsed/.is-narrow (ResizeObserver)
    mediaTokenize:     true,   // rewrite existing @media px from tokens (CSSOM)
    cssBridge:         true,   // inject the class-state collapse <style> bridge
    backToTop:         true,   // smooth-scroll click on #ts-top-btn

    /* ── Logo subtitle fitter ───────────────────────────────────────────── */
    logoFit:           true,   // run fitLogoSubtitles at all
    logoFitInShowcase: true,   // ALSO fit logos inside harness/showcase navs
                               //   (set false to skip .ts-nav--static / .ts-harness-stage)

    /* ── Misc behaviors ─────────────────────────────────────────────────── */
    upgradeLegacyThemeToggles: true, // add [data-theme-toggle] to bare .theme-toggle

    /* ── Overridable buckets (deep-merged onto the registry) ────────────── */
    selectors:     null,   // {key: "selectorString", …}  → merged into TS_SELECTORS
    ids:           null,   // {key: "elementId", …}        → merged into TS_IDS
    stateClasses:  null,   // {key: "class", …}            → merged into TS_STATE
    tokens:        null,   // {key: "--custom-prop", …}    → merged into TS_TOKENS
    tokenDefaults: null    // {collapseAt: 720, …}         → merged into TS_TOKEN_DEFAULTS
  };

  /* The live, resolved config (populated by resolveConfig at init). */
  var CONFIG = shallowClone(TS_CONFIG_DEFAULTS);

  function shallowClone(o) { var c = {}; for (var k in o) if (o.hasOwnProperty(k)) c[k] = o[k]; return c; }
  function assignInto(target, src) {
    if (!src) return target;
    for (var k in src) if (src.hasOwnProperty(k)) target[k] = src[k];
    return target;
  }

  /** Merge defaults ← window.TSNavConfig ← localOpts, fold legacy flags, apply buckets. */
  function resolveConfig(localOpts) {
    var cfg = shallowClone(TS_CONFIG_DEFAULTS);
    assignInto(cfg, window.TSNavConfig || null);   // global "header call"
    assignInto(cfg, localOpts || null);            // local init() override

    /* Legacy boolean flags (still honored). They DISABLE when truthy. */
    if (window.TS_NAV_DISABLE_CSS_BRIDGE)     cfg.cssBridge = false;
    if (window.TS_NAV_DISABLE_MEDIA_TOKENIZE) cfg.mediaTokenize = false;

    /* Apply overridable buckets onto the central registries (so all helpers see them). */
    assignInto(TS_SELECTORS,     cfg.selectors);
    assignInto(TS_IDS,           cfg.ids);
    assignInto(TS_STATE,         cfg.stateClasses);
    assignInto(TS_TOKENS,        cfg.tokens);
    assignInto(TS_TOKEN_DEFAULTS, cfg.tokenDefaults);

    CONFIG = cfg;
    return cfg;
  }

  /* ─────────────────────────────────────────────────────────────────────────
     SHOWCASE GUARD — the harness demo navs must NOT be formatted/managed.
     They are marked `.ts-nav--static` and/or rendered inside `.ts-harness-stage`.
     Every formatting / adoption / collapse pass calls isShowcase() first so the
     showcase markup is left EXACTLY as authored. The live header (#ts-topbar,
     not static, outside a stage) is the only managed instance.
     MIGRATION: keep — the engine should share this same predicate.
     ───────────────────────────────────────────────────────────────────────── */
  function isShowcase(el) {
    if (!el) return false;
    if (el.closest(".ts-nav--static")) return true;     // static demo nav (self or ancestor)
    if (el.classList && el.classList.contains("ts-nav--static")) return true;
    if (el.closest(".ts-harness-stage")) return true;   // any nav living inside a demo stage
    return false;
  }

  /* DOM-ready helper. MIGRATION: drop — engine runs in Toolskin.init() lifecycle. */
  function ready(fn) {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn);
    else fn();
  }

  /* ─────────────────────────────────────────────────────────────────────────
     TOKEN RESOLVER — turn a CSS length token string into pixels, relative to el.
     Supports px / rem / em / unit-less (→px) and clamp()/calc()/vw/% via a hidden
     probe (the browser does the math). Used by TSNavCollapse to read breakpoints.
     MIGRATION: move to the engine's shared utils.
     ───────────────────────────────────────────────────────────────────────── */
  function resolveLengthPx(value, el) {
    if (value == null) return NaN;
    value = String(value).trim();
    if (!value) return NaN;
    var simple = value.match(/^(-?\d*\.?\d+)(px)?$/);
    if (simple) return parseFloat(simple[1]);
    var rem = value.match(/^(-?\d*\.?\d+)rem$/);
    if (rem) {
      var rootFs = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
      return parseFloat(rem[1]) * rootFs;
    }
    var em = value.match(/^(-?\d*\.?\d+)em$/);
    if (em) {
      var elFs = parseFloat(getComputedStyle(el).fontSize) || 16;
      return parseFloat(em[1]) * elFs;
    }
    try {
      var probe = document.createElement("div");
      probe.style.cssText =
        "position:absolute;visibility:hidden;height:0;pointer-events:none;" +
        "contain:size layout;width:" + value + ";";
      var host = el.parentNode || document.body;
      host.appendChild(probe);
      var px = probe.getBoundingClientRect().width;
      host.removeChild(probe);
      if (px > 0) return px;
    } catch (e) { /* fall through */ }
    return NaN;
  }
  /** Read a token off an element's computed style → px (with fallback). */
  function readTokenPx(el, prop, fallbackPx) {
    var raw = getComputedStyle(el).getPropertyValue(prop);
    var px = resolveLengthPx(raw, el);
    return isFinite(px) && px > 0 ? px : fallbackPx;
  }

  /* ═══════════════════════════════════════════════════════════════════════════
     TSIcons — COMPATIBILITY SHIM for ToolskinIcons.inject
     Defers to the real library implementation when present; otherwise provides a
     faithful minimal version. MIGRATION: delete — ToolskinIcons is global.
     ═══════════════════════════════════════════════════════════════════════════ */
  var TSIcons = {
    inject: function (root) {
      if (typeof window.ToolskinIcons !== "undefined" &&
          typeof window.ToolskinIcons.inject === "function") {
        window.ToolskinIcons.inject(root || document);
        return;
      }
      root = root || document;
      root.querySelectorAll(TS.sel("iconHostAny")).forEach(function (el) {
        if (el.dataset.iconInjected) return;
        if (el.querySelector(":scope > i, :scope > ion-icon, :scope > svg, :scope > .ts-icon, :scope > .ts-menu-text > i, :scope > .ts-menu-text > ion-icon, :scope > .ts-menu-text > .ts-icon")) {
          el.dataset.iconInjected = "1"; return;
        }
        var raw = (el.getAttribute("data-icon") || el.getAttribute("data-ts-icon") || "").trim();
        if (!raw) return;
        var type = "", value = "", ci = raw.indexOf(":");
        if (ci !== -1) { type = raw.slice(0, ci); value = raw.slice(ci + 1).trim(); } else { value = raw; }
        var iconEl = null;
        if (type === "fa" || /^fa(-(solid|regular|brands))?\s/.test(value)) {
          iconEl = document.createElement("i"); iconEl.className = value;
        } else if (type === "ion") {
          iconEl = document.createElement("ion-icon"); iconEl.setAttribute("name", value);
        } else if (value) {
          iconEl = document.createElement("i"); iconEl.className = value;
        }
        if (!iconEl) return;
        iconEl.setAttribute("aria-hidden", "true");
        iconEl.classList.add("ts-icon");
        try { (el.dataset.iconPos === "right") ? el.appendChild(iconEl) : el.prepend(iconEl); } catch (e) {}
        el.dataset.iconInjected = "1";
      });
    }
  };

  /* ═══════════════════════════════════════════════════════════════════════════
     TSDynamicNav — PRIMARY NAV OVERFLOW + ITEM FORMATTING + SCROLL STATE
     1:1 port of ToolskinDynamicNav. Selectors now flow through TS_SELECTORS/TS_IDS.
     MIGRATION: rename → ToolskinDynamicNav; statics/methods already match.
     ═══════════════════════════════════════════════════════════════════════════ */
  function TSDynamicNav(primaryNav, extendNav, navCollapse) {
    this.primaryNav = primaryNav;
    this.extendNav = extendNav;
    this.navCollapse = navCollapse;
    this.shell = primaryNav.closest(TS.sel("navShell")) || null;
    this.toTopBtn = TS.byId("topBtn");
    this._scrollTicking = false;
    this._boundOnScroll = this._onScroll.bind(this);
    this.allLinks = TS.$$("navLink", primaryNav);
    this._ro = null;
    this._debounce = null;
    this.htmlEl = document.documentElement;
    this.scrollThreshold = 80; // px — matches library default
    // Legacy thresholds preserved as aliases so old CSS expectations still hold:
    this.legacyAtTopMax = 10;  // nav.at-top when y < 10 (old script)
    this.legacyTopShow  = 300; // topBtn.active when y > 300 (old script)
    this._isAtTop = true;
    this._callbacks = { onEnterTop: null, onLeaveTop: null };
    this._boundSchedule = this.scheduleUpdate.bind(this);
    this._bind();
  }

  /** Idempotent per-item formatter (port of _formatMenuItem). */
  TSDynamicNav.prototype._formatMenuItem = function (linkEl) {
    if (!linkEl || linkEl.tagName !== "A") return;
    linkEl.classList.add("ts-nav-item");

    var hasIcon = linkEl.hasAttribute("data-icon") ||
                  linkEl.hasAttribute("data-ts-icon") ||
                  linkEl.hasAttribute("data-icon-injected") ||
                  linkEl.querySelector(':scope > .ts-icon, :scope > i[class*="fa-"], :scope > i[class*="fas-"], :scope > i.fa-solid, :scope > i.fa-regular, :scope > i.fa-brands, :scope > ion-icon, :scope > span.ts-icon');

    var explicitVariant = linkEl.getAttribute("data-ts-nav-variant");
    var variant = explicitVariant ? explicitVariant
                : linkEl.classList.contains("ts-btn") ? "button"
                : hasIcon ? "icon" : "text";

    Array.prototype.slice.call(linkEl.classList).forEach(function (cls) {
      if (cls.indexOf("ts-nav-item--") === 0) linkEl.classList.remove(cls);
    });
    linkEl.classList.add("ts-nav-item--" + variant);

    var textSpan = linkEl.querySelector(TS.sel("menuText"));
    if (!textSpan) {
      textSpan = document.createElement("span");
      textSpan.className = TS.primaryClass("menuText");
      var textNodes = Array.prototype.slice.call(linkEl.childNodes).filter(function (n) {
        return n.nodeType === Node.TEXT_NODE && n.textContent.trim();
      });
      var textContent = textNodes.map(function (n) { return n.textContent; }).join(" ").trim();
      if (textContent) {
        textSpan.textContent = textContent;
        textNodes.forEach(function (n) { n.remove(); });
        linkEl.appendChild(textSpan);
      }
    }

    var finalHasIcon = linkEl.hasAttribute("data-icon") ||
                       linkEl.hasAttribute("data-ts-icon") ||
                       linkEl.hasAttribute("data-icon-injected") ||
                       linkEl.querySelector(':scope > .ts-icon, :scope > i[class*="fa"], :scope > ion-icon, :scope > span.ts-icon, :scope > svg');
    if (finalHasIcon && variant === "text") {
      variant = "icon";
      Array.prototype.slice.call(linkEl.classList).forEach(function (cls) {
        if (cls.indexOf("ts-nav-item--") === 0) linkEl.classList.remove(cls);
      });
      linkEl.classList.add("ts-nav-item--" + variant);
    }

    if (linkEl.hasAttribute("data-icon") || linkEl.hasAttribute("data-ts-icon")) {
      delete linkEl.dataset.iconInjected;
    }
    TSIcons.inject(linkEl);
  };

  /** Static formatter for external callers (mobile menu clones). */
  TSDynamicNav.formatMenuItem = function (linkEl) {
    Object.create(TSDynamicNav.prototype)._formatMenuItem(linkEl);
  };

  TSDynamicNav.init = function (root) {
    root = root || document;
    var primaryNav = TS.byId("primaryMenu", root);
    var extendNav = TS.byId("navbarExtend", root);
    var navCollapse = TS.byId("navbarCollapse", root);
    if (!primaryNav || !extendNav || !navCollapse) return null;
    var existing = primaryNav.__tsDynamicNav;
    if (existing instanceof TSDynamicNav) { existing.scheduleUpdate(); return existing; }
    var inst = new TSDynamicNav(primaryNav, extendNav, navCollapse);
    primaryNav.__tsDynamicNav = inst;
    return inst;
  };

  TSDynamicNav.destroy = function (root) {
    root = root || document;
    var primaryNav = TS.byId("primaryMenu", root);
    var inst = primaryNav && primaryNav.__tsDynamicNav;
    if (inst instanceof TSDynamicNav) inst.destroy();
  };

  TSDynamicNav.prototype._bind = function () {
    var self = this;
    if (window.ResizeObserver) {
      this._ro = new ResizeObserver(this._boundSchedule);
      this._ro.observe(this.primaryNav);
    } else {
      window.addEventListener("resize", this._boundSchedule);
    }
    window.addEventListener("scroll", this._boundOnScroll, { passive: true });
    this.allLinks.forEach(function (link) { self._formatMenuItem(link); });
    this.scheduleUpdate();
    this._onScroll();
  };

  TSDynamicNav.prototype._onScroll = function () {
    if (this._scrollTicking) return;
    this._scrollTicking = true;
    var self = this;
    requestAnimationFrame(function () {
      var y = window.scrollY || window.pageYOffset;
      var isNowAtTop = y <= self.scrollThreshold;

      if (isNowAtTop !== self._isAtTop) {
        self._isAtTop = isNowAtTop;
        if (isNowAtTop) {
          self.htmlEl.classList.add(TS_STATE.htmlAtTop);
          self.htmlEl.classList.remove(TS_STATE.htmlScrolled);
          self.htmlEl.setAttribute("data-scroll-state", "top");
          if (self._callbacks.onEnterTop) self._callbacks.onEnterTop();
        } else {
          self.htmlEl.classList.remove(TS_STATE.htmlAtTop);
          self.htmlEl.classList.add(TS_STATE.htmlScrolled);
          self.htmlEl.setAttribute("data-scroll-state", "scrolled");
          if (self._callbacks.onLeaveTop) self._callbacks.onLeaveTop();
        }
      }

      // ── LEGACY ALIAS: nav.at-top toggled at the old y<10 threshold ──────
      if (self.shell) {
        self.shell.classList.toggle(TS_STATE.navAtTop, y < self.legacyAtTopMax);
      }

      // ── TO-TOP BUTTON: new `.is-visible` (80px) + legacy `.active` (300px) ──
      if (self.toTopBtn) {
        self.toTopBtn.classList.toggle(TS_STATE.topVisible, y > self.scrollThreshold);
        self.toTopBtn.classList.toggle(TS_STATE.topVisibleAlt, y > self.legacyTopShow);
      }

      self._scrollTicking = false;
    });
  };

  TSDynamicNav.prototype.scheduleUpdate = function () {
    var self = this;
    clearTimeout(this._debounce);
    this._debounce = setTimeout(function () {
      requestAnimationFrame(function () { self._updateNav(); });
    }, 100);
  };

  /**
   * Overflow reflow — identical algorithm to ToolskinDynamicNav._updateNav.
   * NOTE: only the LIVE bar's own links (collected at init from #ts-primary-menu)
   * are ever moved. Static `ul.ts-nav-dropdown > li` showcase probes are NOT
   * part of allLinks and are never reflowed, so those harnesses stay intact.
   */
  TSDynamicNav.prototype._updateNav = function () {
    var primaryNav = this.primaryNav, extendNav = this.extendNav,
        navCollapse = this.navCollapse, allLinks = this.allLinks, self = this;

    allLinks.forEach(function (link) { self._formatMenuItem(link); primaryNav.appendChild(link); });
    navCollapse.classList.remove(TS_STATE.hasItems);

    var containerWidth = primaryNav.offsetWidth;
    var moreBtnWidth = 50;
    var currentWidth = 0;
    allLinks.forEach(function (link) {
      currentWidth += link.offsetWidth;
      if (currentWidth > containerWidth - moreBtnWidth) {
        navCollapse.classList.add(TS_STATE.hasItems);
        // Match the dropdown's authored structure: if it's a <ul>, wrap the
        // moved anchor in <li class="ts-nav-item"> so ul>li>a CSS still applies;
        // otherwise append the bare anchor (div dropdown).
        self._appendToDropdown(extendNav, link);
      }
    });
  };

  /** Append a link to the dropdown, honoring ul>li authored structure. */
  TSDynamicNav.prototype._appendToDropdown = function (dropdown, link) {
    if (dropdown.tagName === "UL" || dropdown.tagName === "OL") {
      var li = document.createElement("li");
      li.className = "ts-nav-item";
      li.appendChild(link);
      dropdown.appendChild(li);
    } else {
      dropdown.appendChild(link);
    }
  };

  TSDynamicNav.prototype.setScrollCallbacks = function (opts) {
    opts = opts || {};
    if (typeof opts.onEnterTop === "function") this._callbacks.onEnterTop = opts.onEnterTop;
    if (typeof opts.onLeaveTop === "function") this._callbacks.onLeaveTop = opts.onLeaveTop;
  };

  TSDynamicNav.prototype.destroy = function () {
    window.removeEventListener("scroll", this._boundOnScroll);
    window.removeEventListener("resize", this._boundSchedule);
    clearTimeout(this._debounce);
    if (this._ro) { this._ro.disconnect(); this._ro = null; }
    if (this.primaryNav) delete this.primaryNav.__tsDynamicNav;
    this.primaryNav = this.extendNav = this.navCollapse = null;
    this.allLinks = [];
  };

  /* ═══════════════════════════════════════════════════════════════════════════
     TSMobileMenu — STATIC-FIRST burger + overlay + sidebar drawer
     ───────────────────────────────────────────────────────────────────────────
     KEY CHANGE vs the library's auto-builder: this version ADOPTS pre-existing
     static markup when it finds it, and only BUILDS missing pieces. This prevents
     duplicate burgers/drawers and avoids overriding author markup.

     Resolution order per nav shell:
       burger   → existing TS.sel("burger") inside shell, else build one.
       overlay  → existing TS.sel("overlay") in document, else build one.
       drawer   → existing TS.sel("drawer")  in document, else build one.
       items    → existing TS.sel("drawerItems") inside drawer; if the drawer was
                  authored empty, clone the live bar's links into it.

     Remaining/adopted items are re-formatted via TSDynamicNav.formatMenuItem so
     they match the desktop bar without re-cloning (no overrides, no dupes).

     MIGRATION: rename → ToolskinMobileMenu; adoption logic is the only delta and
     is a strict superset of the library behavior.
     ═══════════════════════════════════════════════════════════════════════════ */
  function TSMobileMenu() {
    this._instances = [];
    this.isOpen = false;
    this._init();
  }

  TSMobileMenu.prototype._init = function () {
    var self = this;
    // Operate per nav SHELL (so each header gets exactly one drawer).
    var shells = TS.$$("navShell").filter(function (shell) {
      // Only wire shells that actually contain a links container or burger.
      return TS.$("linksContainer", shell) || TS.$("burger", shell);
    });

    // De-dupe: prefer the LIVE shell (the one holding #ts-primary-menu) first,
    // then any others. Showcase navs (.ts-nav--static OR inside .ts-harness-stage)
    // are NEVER managed — their inner items keep their authored formatting and no
    // burger/drawer is built/adopted for them.
    shells.forEach(function (shell) {
      if (isShowcase(shell)) return;                 // leave harness showcases untouched
      self._setupShell(shell);
    });
  };

  TSMobileMenu.prototype._setupShell = function (shell) {
    var self = this;
    var container = TS.$("linksContainer", shell);

    /* ── BURGER: adopt or build ──────────────────────────────────────────── */
    var burger = TS.$("burger", shell);
    var burgerWasBuilt = false;
    if (!burger) {
      burger = document.createElement("button");
      burger.className = TS.primaryClass("burger");
      burger.type = "button";
      burger.setAttribute("aria-label", "Toggle menu");
      burger.innerHTML = '<span class="' + TS.primaryClass("burgerInner") + '"></span>';
      shell.appendChild(burger);
      burgerWasBuilt = true;
    }
    burger.setAttribute("aria-expanded", "false");
    // Guard against double-wiring if init runs twice.
    if (burger.__tsWired) return;
    burger.__tsWired = true;

    /* ── OVERLAY: adopt or build (document-level scrim) ──────────────────── */
    var overlay = TS.$("overlay");
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.className = TS.primaryClass("overlay");
      document.body.appendChild(overlay);
    }

    /* ── DRAWER: adopt or build ──────────────────────────────────────────── */
    var drawer = TS.$("drawer");
    var drawerWasBuilt = false;
    if (!drawer) {
      drawer = document.createElement("div");
      drawer.className = TS.primaryClass("drawer");
      drawer.setAttribute("role", "dialog");
      drawer.setAttribute("aria-label", "Mobile navigation");
      document.body.appendChild(drawer);
      drawerWasBuilt = true;
    }

    /* ── ITEMS: adopt existing, or clone from the live bar ───────────────── */
    var items = TS.$("drawerItems", drawer);
    if (!items) {
      items = document.createElement("div");
      items.className = TS.primaryClass("drawerItems");
      if (container && container.classList.contains("ts-auto-icon")) {
        items.classList.add("ts-auto-icon");
      }
      drawer.appendChild(items);
    }

    var hadAuthoredItems = items.querySelector("a");
    if (!hadAuthoredItems && container) {
      // Drawer was empty → clone the desktop links in (then format).
      TS.$$("navLink", container).forEach(function (item) {
        var clone = item.cloneNode(true);
        if (clone.tagName === "A") TSDynamicNav.formatMenuItem(clone);
        items.appendChild(clone);
      });
    } else {
      // Drawer already has authored items → just (re)format them in place.
      // This "smartly formats the remaining elements" without duplicating.
      items.querySelectorAll("a").forEach(function (a) {
        TSDynamicNav.formatMenuItem(a);
      });
      TSIcons.inject(items);
    }

    var inst = { shell: shell, burger: burger, overlay: overlay, sidebar: drawer };
    this._instances.push(inst);

    /* ── Wire events (idempotent: overlay/drawer may be shared, so guard) ── */
    burger.addEventListener("click", function (e) {
      e.stopPropagation();
      self.toggle(inst);
    });
    if (!overlay.__tsWired) {
      overlay.__tsWired = true;
      overlay.addEventListener("click", function () { self.closeAll(); });
    }
    if (!drawer.__tsWired) {
      drawer.__tsWired = true;
      drawer.addEventListener("click", function (e) { e.stopPropagation(); });
    }
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && self.isOpen) self.closeAll();
    });

    // Sync active states desktop → drawer (best-effort, index-aligned).
    if (container) this._syncActiveStates(container, items);
  };

  TSMobileMenu.prototype._syncActiveStates = function (desktopMenu, mobileMenu) {
    function sync() {
      var d = desktopMenu.querySelectorAll("a");
      var m = mobileMenu.querySelectorAll("a");
      d.forEach(function (dl, i) {
        var ml = m[i]; if (!ml) return;
        var on = dl.classList.contains("active") || dl.classList.contains("ts-active");
        ml.classList.toggle("active", on);
        ml.classList.toggle("ts-active", on);
      });
    }
    var observer = new MutationObserver(sync);
    desktopMenu.querySelectorAll("a").forEach(function (link) {
      observer.observe(link, { attributes: true, attributeFilter: ["class"] });
    });
    window.addEventListener("scroll", sync, { passive: true });
  };

  TSMobileMenu.prototype.toggle = function (inst) {
    if (this.isOpen) this.closeAll(); else this.open(inst);
  };

  TSMobileMenu.prototype.open = function (inst) {
    this.isOpen = true;
    inst.burger.classList.add(TS_STATE.activeDrawer);
    inst.overlay.classList.add(TS_STATE.activeDrawer);
    inst.sidebar.classList.add(TS_STATE.activeDrawer);
    inst.burger.setAttribute("aria-expanded", "true");
    // MOBILE-SWAP: flag html + nav so CSS hides swapped desktop controls.
    document.documentElement.classList.add(TS_STATE.htmlMobileOpen);
    if (inst.shell) inst.shell.classList.add(TS_STATE.navMobile);
    // Body scroll intentionally NOT locked (compact mode) — library parity.
  };

  TSMobileMenu.prototype.close = function (inst) {
    inst.burger.classList.remove(TS_STATE.activeDrawer);
    inst.overlay.classList.remove(TS_STATE.activeDrawer);
    inst.sidebar.classList.remove(TS_STATE.activeDrawer);
    inst.burger.setAttribute("aria-expanded", "false");
    if (inst.shell) inst.shell.classList.remove(TS_STATE.navMobile);
  };

  TSMobileMenu.prototype.closeAll = function () {
    var self = this;
    this.isOpen = false;
    this._instances.forEach(function (i) { self.close(i); });
    document.documentElement.classList.remove(TS_STATE.htmlMobileOpen);
  };

  /* ═══════════════════════════════════════════════════════════════════════════
     TSTheme — DELEGATED THEME TOGGLE (compatibility subset of ToolskinTheme)
     data-theme is the single source of truth; setMode() sets data-theme +
     data-ts-theme, runs _syncTriggers (class theme-toggle--toggled + checkbox +
     aria-pressed), persists to localStorage, emits ts:theme-change.
     MIGRATION: delete — the library's ToolskinTheme owns all of this and more.
     ═══════════════════════════════════════════════════════════════════════════ */
  function TSTheme(opts) {
    opts = opts || {};
    this.root = document.documentElement;
    this.storageKey = opts.storageKey || this.root.getAttribute("data-theme-storage-key") || "ts-theme";
    this.savePreference = opts.savePreference !== false;
    var saved = null;
    try { saved = this.savePreference ? localStorage.getItem(this.storageKey) : null; } catch (e) {}
    this.currentMode = saved || this.root.getAttribute("data-theme") || "dark";
    this.setMode(this.currentMode, false);
    this._setupToggle();
  }
  TSTheme.prototype.setMode = function (mode, save) {
    this.currentMode = mode;
    this.root.setAttribute("data-theme", mode);
    this.root.setAttribute("data-ts-theme", mode);
    this._syncTriggers(mode);
    if (save !== false && this.savePreference) {
      try { localStorage.setItem(this.storageKey, mode); } catch (e) {}
    }
    window.dispatchEvent(new CustomEvent("ts:theme-change", { detail: { mode: mode } }));
  };
  TSTheme.prototype._syncTriggers = function (mode) {
    var isLight = mode === "light";
    TS.$$("themeToggle").forEach(function (trigger) {
      trigger.classList.toggle("theme-toggle--toggled", isLight);
      var checkbox = trigger.querySelector(TS.sel("themeCheckbox"));
      if (checkbox && checkbox.checked !== isLight) checkbox.checked = isLight;
      trigger.setAttribute("aria-pressed", String(isLight));
    });
  };
  TSTheme.prototype.toggle = function () {
    this.setMode(this.currentMode === "dark" ? "light" : "dark", true);
  };
  TSTheme.prototype._setupToggle = function () {
    var self = this;
    document.addEventListener("click", function (e) {
      var trigger = e.target.closest(TS.sel("themeToggle"));
      if (!trigger) return;
      if (e.target.tagName === "INPUT" && e.target.type === "checkbox" &&
          trigger.contains(e.target) && trigger !== e.target) return;
      e.preventDefault();
      self.toggle();
    });
  };

  /* ═══════════════════════════════════════════════════════════════════════════
     TSNavCollapse — DYNAMIC, TOKEN-DRIVEN, PER-INSTANCE BREAKPOINTS
     ───────────────────────────────────────────────────────────────────────────
     WHY: CSS @media queries cannot read custom properties, so the token
     `--ts-nav-collapse-at` (declared in ts-nav-header.css) could never drive a
     media query — every instance collapsed at the hard-coded 768px instead.

     WHAT: For each LIVE nav shell (showcases excluded) this reads the instance's
     OWN `--ts-nav-collapse-at` / `--ts-nav-collapse-at-narrow`, measures the
     instance via ResizeObserver, and toggles state classes ON THE INSTANCE:
         .is-collapsed  when width <= --ts-nav-collapse-at        (burger tier)
         .is-narrow     when width <= --ts-nav-collapse-at-narrow  (ultra-narrow)
     It also mirrors resolved px back to `--ts-nav-collapse-at-resolved` (debug).

     IMPORTANT — TWO THINGS MAKE THIS WORK WITH YOUR EXISTING CSS:
       (1) This module sets `.is-collapsed`/`.is-narrow`. Your stylesheet's
           existing collapse rules currently key off `@media (max-width: 768px)`
           — they will STILL fire on viewport width as before (nothing breaks).
       (2) To make the TOKEN actually move the breakpoint without editing the
           stylesheet, ensureCollapseBridgeCSS() injects ONE tiny <style> block
           (see below) that maps the class-state to the same visual outcome the
           media query produces. If you later tokenize the stylesheet directly,
           you can delete the bridge by setting window.TS_NAV_DISABLE_CSS_BRIDGE
           = true before this script runs.

     MIGRATION: fold into the engine as ToolskinNavCollapse (or a concern of
     ToolskinDynamicNav). It already reuses TS / TS_STATE / TS_TOKENS / isShowcase.
     ═══════════════════════════════════════════════════════════════════════════ */
  function TSNavCollapse() {
    this._ro = (typeof ResizeObserver !== "undefined")
      ? new ResizeObserver(function (entries) {
          for (var i = 0; i < entries.length; i++) TSNavCollapse.evaluate(entries[i].target);
        })
      : null;
    this._init();
  }

  /** Read tokens, measure, toggle .is-collapsed / .is-narrow on one instance. */
  TSNavCollapse.evaluate = function (el) {
    if (isShowcase(el)) {                       // never collapse showcase navs
      el.classList.remove(TS_STATE.collapsed, TS_STATE.narrow);
      return;
    }
    var width = el.clientWidth || el.getBoundingClientRect().width;
    if (!width) return;
    var atPrimary = readTokenPx(el, TS_TOKENS.collapseAt, TS_TOKEN_DEFAULTS.collapseAt);
    var atNarrow  = readTokenPx(el, TS_TOKENS.collapseAtNarrow, TS_TOKEN_DEFAULTS.collapseAtNarrow);
    el.style.setProperty(TS_TOKENS.collapseAt + "-resolved", atPrimary + "px");
    el.style.setProperty(TS_TOKENS.collapseAtNarrow + "-resolved", atNarrow + "px");
    el.classList.toggle(TS_STATE.collapsed, width <= atPrimary);
    el.classList.toggle(TS_STATE.narrow,    width <= atNarrow);
  };

  TSNavCollapse.prototype._init = function () {
    var self = this;
    ensureCollapseBridgeCSS();
    // Tokenize the EXISTING @media breakpoint values in place (CSSOM rewrite).
    TSNavCollapse.refreshMediaBreakpoints();
    // Stylesheets can still be parsing at DOMContentLoaded; re-run after load.
    window.addEventListener("load", TSNavCollapse.refreshMediaBreakpoints);
    // Re-resolve whenever a token might have changed at runtime.
    window.addEventListener("ts:theme-change", TSNavCollapse.refreshMediaBreakpoints);
    TS.$$("navShell").forEach(function (el) { self._observe(el); });
    // Fonts can change widths after first paint.
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(function () {
        TS.$$("navShell").forEach(TSNavCollapse.evaluate);
      });
    }
    // Fallback when ResizeObserver is unavailable.
    if (!this._ro) {
      window.addEventListener("resize", function () {
        TS.$$("navShell").forEach(TSNavCollapse.evaluate);
      }, { passive: true });
    }
    // Pick up dynamically-inserted navs.
    if (typeof MutationObserver !== "undefined") {
      new MutationObserver(function (muts) {
        for (var i = 0; i < muts.length; i++) {
          var added = muts[i].addedNodes;
          for (var j = 0; j < added.length; j++) {
            var n = added[j];
            if (n.nodeType !== 1) continue;
            if (n.matches && n.matches(TS.sel("navShell"))) self._observe(n);
            if (n.querySelectorAll) n.querySelectorAll(TS.sel("navShell")).forEach(function (e) { self._observe(e); });
          }
        }
      }).observe(document.body, { childList: true, subtree: true });
    }
  };

  TSNavCollapse.prototype._observe = function (el) {
    if (el.__tsCollapseObserved) { TSNavCollapse.evaluate(el); return; }
    el.__tsCollapseObserved = true;
    if (this._ro) this._ro.observe(el);
    TSNavCollapse.evaluate(el);
  };

  /* ─────────────────────────────────────────────────────────────────────────
     CSS BRIDGE — the single injected <style> block.
     ---------------------------------------------------------------------------
     This is the "ready-to-add block" version, but injected so you don't have to
     touch the stylesheet. It makes the .is-collapsed / .is-narrow STATE produce
     the same outcome as the old `@media (max-width: 768px/420px)` collapse, so a
     per-instance token actually moves the breakpoint.

     It scopes to `:not(.ts-nav--static)` so harness showcases are never affected.
     If you ever paste an equivalent block into ts-nav-header.css yourself, set
     window.TS_NAV_DISABLE_CSS_BRIDGE = true (before this script) to skip it.

     ── EXACT CSS IT INJECTS (also reproduced here so you can paste it verbatim
        at the END of ts-nav-header.css if you prefer a static file) ──
     ───────────────────────────────────────────────────────────────────────── */
  var COLLAPSE_BRIDGE_CSS =
    "/* ts-nav.js · dynamic token-driven collapse bridge (class-state mirror of the\n" +
    "   old @media 768/420 rules; scoped away from .ts-nav--static showcases) */\n" +
    ".ts-nav-fixed.is-collapsed:not(.ts-nav--static){padding-inline:var(--ts-container-pad-mobile);z-index:calc(var(--ts-z-offcanvas-panel) + 5);}\n" +
    ".ts-nav-fixed.is-collapsed:not(.ts-nav--static) .ts-nav-fixed__links,\n" +
    ".ts-nav-fixed.is-collapsed:not(.ts-nav--static) .ts-nav__links,\n" +
    ".ts-nav-fixed.is-collapsed:not(.ts-nav--static) .ts-nav-more,\n" +
    ".ts-nav-fixed.is-collapsed:not(.ts-nav--static) .ts-nav-more.hasItems,\n" +
    ".ts-nav-fixed.is-collapsed:not(.ts-nav--static) #navbar-collapse,\n" +
    ".ts-nav-fixed.is-collapsed:not(.ts-nav--static) div#navbar-collapse{display:none !important;}\n" +
    ".ts-nav-fixed.is-collapsed:not(.ts-nav--static) .ts-menu-burger{display:inline-flex;order:3;margin-left:auto;margin-right:0;border-left-width:1px;z-index:calc(var(--ts-z-offcanvas-panel) + 5);}\n" +
    ".ts-nav-fixed.is-collapsed:not(.ts-nav--static) .theme-toggle{order:2;margin-left:auto;margin-right:0;border-left-width:0;}\n" +
    ".ts-nav-fixed.is-collapsed:not(.ts-nav--static) .theme-toggle ~ .ts-menu-burger{margin-left:0;}\n" +
    ".ts-nav-fixed.is-collapsed:not(.ts-nav--static) .ts-nav-fixed__links,\n" +
    ".ts-nav-fixed.is-collapsed:not(.ts-nav--static):not(.spaced){gap:0;}\n" +
    ".ts-nav-fixed.is-collapsed:not(.ts-nav--static) #ts-top-btn,\n" +
    ".ts-nav-fixed.is-collapsed:not(.ts-nav--static) .ts-back_top-nav{position:static !important;order:3;width:var(--ts-btn-h);max-width:var(--ts-btn-h);height:100%;max-height:calc(var(--ts-topbar-h) - 1px);aspect-ratio:auto;padding-inline:var(--ts-navlink-pad-y);border:0px solid var(--ts-nav-border);border-left-width:1px;border-radius:0;background-color:transparent;opacity:1 !important;pointer-events:all !important;transform:translateX(0) !important;}\n" +
    ".ts-nav-fixed.is-narrow:not(.ts-nav--static) .ts-ui-select,\n" +
    ".ts-nav-fixed.is-narrow:not(.ts-nav--static) .ts-ui-select__trigger{background:transparent !important;backdrop-filter:none !important;max-width:0 !important;min-width:0 !important;padding:0 !important;width:0 !important;overflow:hidden;border-color:transparent !important;}\n";

  function ensureCollapseBridgeCSS() {
    if (!CONFIG.cssBridge) return;
    if (document.getElementById("ts-nav-collapse-bridge")) return;
    var style = document.createElement("style");
    style.id = "ts-nav-collapse-bridge";
    style.textContent = COLLAPSE_BRIDGE_CSS;
    document.head.appendChild(style);
  }

  /* ═══════════════════════════════════════════════════════════════════════════
     MEDIA-QUERY TOKENIZER (CSSOM rewrite) — make the EXISTING @media px values
     come from tokens WITHOUT editing the stylesheet.
     ───────────────────────────────────────────────────────────────────────────
     CSS forbids `@media (max-width: var(--x))`. So instead of changing syntax,
     this walks the live stylesheets and overwrites each matching media RULE's
     condition text (CSSMediaRule.media.mediaText) with the token-resolved px.
     The giant rule BODIES are never touched, never duplicated, never commented —
     only the number inside the condition changes, and it now tracks the token.

     MAPPING (confirmed):
        max-width: 768px  →  --ts-nav-collapse-at         (default 720)
        max-width: 420px  →  --ts-nav-collapse-at-narrow  (default 420)
        max-width: 480px  →  --ts-nav-collapse-at-narrow  (480 folds into narrow)
     Any other value (e.g. 1140px) is LEFT ALONE. Declaration values like
     `max-width: 0px` inside rule bodies are NEVER touched — we only read
     CSSMediaRule.media, never style declarations.

     IDEMPOTENT: the ORIGINAL px each rule matched is remembered on the rule
     object (__tsBpKey / __tsBpOriginal), so re-runs re-resolve from the token
     rather than from the already-rewritten value. Re-run on token change via
     TSNavCollapse.refreshMediaBreakpoints() (also auto-runs on ts:theme-change).

     CAVEATS (by nature of media queries):
       • Viewport-based, not per-instance (that's what the class bridge above is
         for). Both can run together; they don't conflict.
       • Same-origin sheets only — cross-origin .cssRules access throws and is
         skipped silently.
       • A clamp()/calc() token collapses to a single px at evaluation time,
         since a media condition can't hold a clamp.

     MIGRATION: move into the engine as a shared "tokenizeMediaBreakpoints" util;
     the value→token map should read from the engine's token registry.
     ═══════════════════════════════════════════════════════════════════════════ */

  /* value (px, as authored) → token KEY in TS_TOKENS. Edit here to retarget. */
  var MEDIA_BP_MAP = {
    "768": "collapseAt",
    "420": "collapseAtNarrow",
    "480": "collapseAtNarrow"
  };

  /** Resolve a token KEY → px against :root (media queries are viewport-scoped). */
  function tokenPxForKey(tokenKey) {
    var prop = TS_TOKENS[tokenKey];
    var fallback = TS_TOKEN_DEFAULTS[tokenKey];
    return readTokenPx(document.documentElement, prop, fallback);
  }

  /** Rewrite one CSSMediaRule's condition if it matches a mapped breakpoint. */
  function rewriteMediaRule(rule) {
    // Establish (once) which mapped value this rule's condition contains.
    if (rule.__tsBpKey === undefined) {
      var text = rule.media && rule.media.mediaText ? rule.media.mediaText : "";
      var found = null, foundVal = null;
      // Match `max-width: <int>px`, but ONLY values present in the map.
      var re = /max-width\s*:\s*(\d+)px/gi, m;
      while ((m = re.exec(text)) !== null) {
        if (MEDIA_BP_MAP.hasOwnProperty(m[1])) { found = MEDIA_BP_MAP[m[1]]; foundVal = m[1]; break; }
      }
      rule.__tsBpKey = found;            // token key or null
      rule.__tsBpOriginal = found ? foundVal : null; // original px string
    }
    if (!rule.__tsBpKey) return;         // not a mapped breakpoint → leave alone

    var px = Math.round(tokenPxForKey(rule.__tsBpKey));
    if (!isFinite(px) || px <= 0) return;

    // Replace ONLY the original value occurrence with the resolved px. Using the
    // remembered original keeps this idempotent across re-runs.
    var orig = rule.__tsBpOriginal;
    var current = rule.media.mediaText;
    var next = current.replace(
      new RegExp("max-width\\s*:\\s*" + orig + "px", "i"),
      "max-width: " + px + "px"
    );
    // If the value already changed in a prior run, also catch the last-written px.
    if (next === current) {
      next = current.replace(/max-width\s*:\s*\d+px/i, "max-width: " + px + "px");
    }
    if (next !== current) {
      try { rule.media.mediaText = next; } catch (e) { /* some engines lock it */ }
    }
  }

  /** Recurse a rule list, rewriting media rules and descending into groups. */
  function walkRules(rules) {
    if (!rules) return;
    for (var i = 0; i < rules.length; i++) {
      var rule = rules[i];
      // CSSMediaRule === type 4 (legacy) / instanceof CSSMediaRule (modern)
      var isMedia = (typeof CSSMediaRule !== "undefined" && rule instanceof CSSMediaRule) ||
                    rule.type === 4;
      if (isMedia) {
        rewriteMediaRule(rule);
        walkRules(rule.cssRules);          // nested rules may contain more @media
      } else if (rule.cssRules) {
        walkRules(rule.cssRules);          // @supports, @layer, etc.
      }
    }
  }

  /** Walk every same-origin stylesheet and tokenize mapped media breakpoints. */
  TSNavCollapse.refreshMediaBreakpoints = function () {
    if (!CONFIG.mediaTokenize) return;
    var sheets = document.styleSheets;
    for (var s = 0; s < sheets.length; s++) {
      var sheet = sheets[s];
      // Skip our own injected bridge (it has no mapped px anyway).
      if (sheet.ownerNode && sheet.ownerNode.id === "ts-nav-collapse-bridge") continue;
      var rules;
      try { rules = sheet.cssRules; }      // throws on cross-origin → skip
      catch (e) { continue; }
      walkRules(rules);
    }
  };

  /* ═══════════════════════════════════════════════════════════════════════════
     fitLogoSubtitles — LOGO LOCKUP FITTER
     Scales each .ts-logo-sub so its rendered width matches the .ts-logo-brand
     wordmark. Configurable:
        CONFIG.logoFit            — run it at all (default true)
        CONFIG.logoFitInShowcase  — also fit harness/showcase logos (default true)
     MIGRATION: promote as its own ToolskinLogoLockup module reading these flags.
     ═══════════════════════════════════════════════════════════════════════════ */
  function fitLogoSubtitles() {
    if (!CONFIG.logoFit) return;
    TS.$$("logo").forEach(function (logo) {
      // Only skip showcase logos when explicitly told to. By default the fitter
      // runs everywhere, including the harness examples.
      if (!CONFIG.logoFitInShowcase && isShowcase(logo)) return;
      var brand = logo.querySelector(TS.sel("logoBrand"));
      var sub = logo.querySelector(TS.sel("logoSub")) ||
                logo.querySelector(":scope > span:not(" + TS.primary("logoBrand") + ")");
      if (!brand || !sub) return;
      var brandW = brand.getBoundingClientRect().width;
      if (!brandW) return;
      sub.style.fontSize = "";
      var baseFs = parseFloat(getComputedStyle(sub).fontSize) || 10;
      var probe = sub.cloneNode(true);
      probe.style.cssText = "position:absolute;left:-9999px;top:-9999px;visibility:hidden;" +
        "display:inline-block;width:auto;max-width:none;white-space:nowrap;" +
        "text-align:left;text-align-last:auto;letter-spacing:normal;font-size:" + baseFs + "px;";
      logo.appendChild(probe);
      var natW = probe.getBoundingClientRect().width;
      logo.removeChild(probe);
      if (!natW) return;
      var target = baseFs * (brandW / natW);
      target = Math.max(6, Math.min(baseFs * 2.2, target));
      sub.style.fontSize = target.toFixed(2) + "px";
    });
  }

  /* ─────────────────────────────────────────────────────────────────────────
     LEGACY-MARKUP THEME TOGGLE upgrade: ensure .theme-toggle controls without
     [data-theme-toggle] participate in the unified delegated path.
     MIGRATION: drop — library markup uses [data-theme-toggle] exclusively.
     ───────────────────────────────────────────────────────────────────────── */
  function upgradeLegacyThemeToggles() {
    document.querySelectorAll(".theme-toggle:not([data-theme-toggle])").forEach(function (tg) {
      tg.setAttribute("data-theme-toggle", "");
    });
  }

  /* ═══════════════════════════════════════════════════════════════════════════
     WIRE-UP / PUBLIC INIT — config-driven bootstrap.
     ───────────────────────────────────────────────────────────────────────────
     init(opts) resolves config (defaults ← window.TSNavConfig ← opts), then
     starts only the enabled modules. Auto-runs on DOM-ready with layers 1+2;
     call TSNav.init({...}) yourself to apply a local override (re-inits).
     MIGRATION: becomes Toolskin.init() reading Toolskin.config.
     ═══════════════════════════════════════════════════════════════════════════ */
  var _instances = { theme: null, dynamicNav: null, mobileMenu: null, collapse: null };

  function init(opts) {
    resolveConfig(opts);

    if (CONFIG.upgradeLegacyThemeToggles) upgradeLegacyThemeToggles();
    if (CONFIG.theme && !_instances.theme) _instances.theme = new TSTheme();
    if (CONFIG.dynamicNav) _instances.dynamicNav = TSDynamicNav.init(document);

    if (CONFIG.backToTop) {
      var topBtn = TS.byId("topBtn");
      if (topBtn && !topBtn.__tsTopWired) {
        topBtn.__tsTopWired = true;
        topBtn.addEventListener("click", function (e) {
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: "smooth" });
        });
      }
    }

    if (CONFIG.mobileMenu && !_instances.mobileMenu) _instances.mobileMenu = new TSMobileMenu();
    if (CONFIG.collapse && !_instances.collapse) _instances.collapse = new TSNavCollapse();

    if (CONFIG.logoFit) {
      fitLogoSubtitles();
      window.addEventListener("load", fitLogoSubtitles);
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitLogoSubtitles);
      if (window.ResizeObserver) {
        var lro = new ResizeObserver(fitLogoSubtitles);
        TS.$$("logo").forEach(function (logo) {
          if (!CONFIG.logoFitInShowcase && isShowcase(logo)) return;
          var b = logo.querySelector(TS.sel("logoBrand"));
          if (b) lro.observe(b);
        });
      } else {
        window.addEventListener("resize", fitLogoSubtitles);
      }
    }

    return window.TSNav;
  }

  /* Public API — also the way to apply LOCAL overrides: TSNav.init({...}). */
  window.TSNav = {
    init: init,                    // (re)initialize with local overrides
    config: function () { return CONFIG; }, // read resolved config
    defaults: TS_CONFIG_DEFAULTS,  // inspect/clone the default flags
    selectors: TS,                 // the registry helper (TS.$/$$/register/…)
    refreshBreakpoints: TSNavCollapse.refreshMediaBreakpoints, // re-tokenize @media after a token change
    fitLogoSubtitles: fitLogoSubtitles,
    isShowcase: isShowcase,        // shared showcase predicate
    // module instances (populated after init)
    get theme()      { return _instances.theme; },
    get dynamicNav() { return _instances.dynamicNav; },
    get mobileMenu() { return _instances.mobileMenu; },
    get collapse()   { return _instances.collapse; },
    // class refs for advanced callers / tests
    TSDynamicNav: TSDynamicNav,
    TSMobileMenu: TSMobileMenu,
    TSTheme: TSTheme,
    TSNavCollapse: TSNavCollapse
  };

  // Auto-init on DOM-ready (layers 1 + 2). Local override = call TSNav.init({...}).
  ready(function () { init(); });
})();

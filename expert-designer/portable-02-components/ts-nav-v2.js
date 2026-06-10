/* ═══════════════════════════════════════════════════════════════════════════
   TOOLSKIN · ts-nav-v2.js — TOP NAVIGATION behaviors (dependency-free)
   ───────────────────────────────────────────────────────────────────────────
   WHAT'S NEW IN v2
   ────────────────
   T9  Breakpoint token sync — reads --ts-nav-collapse-at from the nav element,
       creates a dynamic matchMedia, toggles .ts-nav--collapsed. The @media in
       the CSS becomes a progressive-enhancement fallback only. The token IS now
       the single source of truth for the collapse breakpoint.
   T9  data-ts-nav-variant schema — reads data-ts-nav-variant on .ts-nav-fixed,
       applies class list on DOMContentLoaded (no flash of wrong variant).
   +   Logo subtitle fit — unchanged from v1, documented.
   +   Burger ⇄ mobile menu — unchanged from v1.
   +   Theme toggle — unchanged from v1.
   +   Back-to-top — unchanged from v1.
   +   Scroll-spy (at-top) — unchanged from v1.
   +   Overflow → ••• relocation — unchanged from v1.
   +   Sub-nav accordion (mobile) — NEW: .ts-has-sub items toggle .ts-sub-open
       on mobile, collapsing/expanding the child .ts-nav-dropdown as accordion.

   USAGE:  <script src="assets/js/ts-nav-v2.js" defer></script>

   DEV NOTES — TASK-nav-unification (for engineer agent)
   ──────────────────────────────────────────────────────
   1. .ts-menu-text auto-wrap regression
      Add `white-space: nowrap` to `.ts-menu-text` in ts-nav-header_v3.css
      (already done in v3). If text still wraps, the parent nav item needs
      `overflow: hidden` + `text-overflow: ellipsis`. Do NOT set a fixed width
      on nav items — let the text truncate naturally.

   2. data-ts-nav-variant schema (implemented below)
      <nav class="ts-nav-fixed" data-ts-nav-variant="spaced tabbed transparent">
      JS reads the attribute and applies classes on DOMContentLoaded, before
      the first paint settles, avoiding FOVC (flash of wrong variant class).

   3. Desktop/mobile menu unification
      RECOMMENDED APPROACH: JS mirrors desktop link elements into the mobile
      menu on init, then keeps them in sync on mutations. This means the HTML
      author writes ONE set of nav items (inside .ts-nav-fixed__links) and JS
      clones them (with aria adjustments) into .ts-mobile-menu-items.
      Implementation sketch:
        function mirrorToMobile(links, mobileItems) {
          mobileItems.innerHTML = "";
          links.querySelectorAll(":scope > :not(.ts-btn)").forEach(function(el) {
            var clone = el.cloneNode(true);
            clone.setAttribute("tabindex", "-1"); // desktop items remain focusable
            mobileItems.appendChild(clone);
          });
          // Buttons get mirrored too (last in mobile)
          links.querySelectorAll(":scope > .ts-btn").forEach(function(el) {
            mobileItems.appendChild(el.cloneNode(true));
          });
        }
      Wire a MutationObserver on .ts-nav-fixed__links to re-mirror on change.

   ═══════════════════════════════════════════════════════════════════════════ */
(function () {
  "use strict";

  function ready(fn) {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn);
    else fn();
  }

  /* ── Helper: read a CSS custom property from an element ───────────────── */
  function getCSSVar(el, name) {
    return getComputedStyle(el).getPropertyValue(name).trim();
  }

  ready(function () {
    var nav = document.querySelector(".ts-nav-fixed");

    /* ── T9: data-ts-nav-variant — apply variant classes from attribute ───
       Reads data-ts-nav-variant on the nav before any JS animation runs,
       so the correct variant is painted on the first frame.
       Example: data-ts-nav-variant="spaced tabbed transparent"
       Produces: adds .ts-nav--spaced .ts-tabbed .ts-nav--transparent        */
    if (nav) {
      var variantAttr = nav.getAttribute("data-ts-nav-variant");
      if (variantAttr) {
        variantAttr.split(/\s+/).forEach(function (v) {
          if (!v) return;
          /* Accept shorthand tokens and map to canonical classes */
          var classMap = {
            "spaced":      "ts-nav--spaced",
            "tabbed":      "ts-tabbed",
            "transparent": "ts-nav--transparent",
            "static":      "ts-nav--static",
            "sticky":      "ts-nav--sticky",
            "icon-only":   "ts-nav--icon-only"
          };
          nav.classList.add(classMap[v] || v);
        });
      }
    }

    /* ── T9: Breakpoint token sync ────────────────────────────────────────
       Reads --ts-nav-collapse-at from the nav element's computed style.
       Creates a matchMedia at that value and toggles .ts-nav--collapsed.
       The CSS uses .ts-nav--collapsed (higher specificity) to override the
       fallback @media (max-width: 868px) block.
       Falls back to 868px if the token is missing or unparseable.           */
    if (nav) {
      var collapseAtRaw = getCSSVar(nav, "--ts-nav-collapse-at") || "868px";
      var collapseAt = parseFloat(collapseAtRaw) || 868;
      var unit = collapseAtRaw.replace(/[\d.]/g, "").trim() || "px";
      var mq = window.matchMedia("(max-width: " + collapseAt + unit + ")");

      function applyCollapse(matches) {
        if (!nav) return;
        nav.classList.toggle("ts-nav--collapsed", matches);
        /* Mark as synced so the CSS fallback @media can be gated */
        nav.setAttribute("data-breakpoint-synced", "1");
      }

      applyCollapse(mq.matches);
      /* Use addEventListener with EventListener object for Safari 13 compat */
      if (mq.addEventListener) {
        mq.addEventListener("change", function (e) { applyCollapse(e.matches); });
      } else if (mq.addListener) {
        mq.addListener(function (e) { applyCollapse(e.matches); });
      }
    }

    /* ── Logo subtitle width-match ────────────────────────────────────────
       Scales .ts-logo-sub font-size so its rendered width === .ts-logo-brand.
       Re-runs on ResizeObserver (font/scale changes) and after webfont load.  */
    function fitLogoSubtitles() {
      document.querySelectorAll(".ts-topbar__logo").forEach(function (logo) {
        var brand = logo.querySelector(".ts-logo-brand");
        var sub   = logo.querySelector(".ts-logo-sub") ||
                    logo.querySelector(":scope > span:not(.ts-logo-brand)");
        if (!brand || !sub) return;
        var brandW = brand.getBoundingClientRect().width;
        if (!brandW) return;
        sub.style.fontSize = "";
        var baseFs = parseFloat(getComputedStyle(sub).fontSize) || 10;
        var probe = sub.cloneNode(true);
        probe.style.cssText =
          "position:absolute;left:-9999px;top:-9999px;visibility:hidden;" +
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
    fitLogoSubtitles();
    window.addEventListener("load", fitLogoSubtitles);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitLogoSubtitles);
    if (window.ResizeObserver) {
      var lro = new ResizeObserver(fitLogoSubtitles);
      document.querySelectorAll(".ts-topbar__logo .ts-logo-brand").forEach(function (b) { lro.observe(b); });
    } else {
      window.addEventListener("resize", fitLogoSubtitles);
    }

    /* ── Burger ⇄ mobile menu ─────────────────────────────────────────────── */
    var burger  = document.querySelector(".ts-menu-burger");
    var menu    = document.querySelector(".ts-mobile-menu");
    var overlay = document.querySelector(".ts-mobile-menu-overlay");

    function setMenu(open) {
      if (burger)  burger.classList.toggle("active", open);
      if (menu)    menu.classList.toggle("active", open);
      if (overlay) overlay.classList.toggle("active", open);
      if (burger)  burger.setAttribute("aria-expanded", String(open));
      /* Prevent body scroll while mobile menu is open */
      document.body.style.overflow = open ? "hidden" : "";
    }
    if (burger) burger.addEventListener("click", function () {
      setMenu(!(menu && menu.classList.contains("active")));
    });
    if (overlay) overlay.addEventListener("click", function () { setMenu(false); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") setMenu(false); });

    /* ── Sub-nav accordion (mobile) ───────────────────────────────────────
       On mobile, .ts-has-sub items toggle .ts-sub-open on click,
       showing/hiding the child .ts-nav-dropdown as an accordion.
       On desktop, hover/focus handles the dropdown (CSS-only).              */
    document.querySelectorAll(".ts-has-sub").forEach(function (item) {
      var trigger = item.querySelector(":scope > a, :scope > button, :scope > li > a");
      var subDd   = item.querySelector(":scope > .ts-nav-dropdown");
      if (!trigger || !subDd) return;

      /* Desktop: prevent navigation on parent anchor if it has children */
      trigger.addEventListener("click", function (e) {
        var isMobile = nav && nav.classList.contains("ts-nav--collapsed");
        if (isMobile) {
          e.preventDefault();
          item.classList.toggle("ts-sub-open");
          subDd.setAttribute("aria-hidden", String(!item.classList.contains("ts-sub-open")));
        }
      });
    });

    /* ── Theme toggle ─────────────────────────────────────────────────────── */
    document.querySelectorAll(".theme-toggle").forEach(function (tg) {
      var box = tg.querySelector('input[type="checkbox"]');
      function apply(toLight) {
        document.documentElement.setAttribute("data-theme", toLight ? "light" : "dark");
        tg.setAttribute("aria-pressed", String(toLight));
        if (box) box.checked = toLight;
      }
      var isLight = document.documentElement.getAttribute("data-theme") === "light";
      if (box) box.checked = isLight;
      tg.setAttribute("aria-pressed", String(isLight));
      tg.addEventListener("click", function (e) {
        if (e.target !== box) e.preventDefault();
        apply(!(document.documentElement.getAttribute("data-theme") === "light"));
      });
    });

    /* ── Back-to-top + scroll-spy (at-top signal) ─────────────────────────── */
    var topBtn = document.getElementById("ts-top-btn") ||
                 document.querySelector(".ts-back_top-nav");
    function onScroll() {
      var y = window.scrollY || document.documentElement.scrollTop;
      if (topBtn) topBtn.classList.toggle("active", y > 300);
      if (nav)    nav.classList.toggle("at-top", y < 10);
    }
    if (topBtn) topBtn.addEventListener("click", function (e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    /* ── Promo banner height → CSS custom property ────────────────────────
       Writes the live banner height to --ts-promo-banner-h-live on :root
       so the nav top offset can use the measured value rather than a
       hardcoded pixel estimate. Runs on resize.                             */
    var promoBanner = document.querySelector(".ts-promo-banner");
    function syncBannerHeight() {
      if (!promoBanner) return;
      var h = promoBanner.classList.contains("ts-dismissed")
        ? "0px"
        : promoBanner.getBoundingClientRect().height + "px";
      document.documentElement.style.setProperty("--ts-promo-banner-h-live", h);
    }
    syncBannerHeight();
    window.addEventListener("resize", syncBannerHeight, { passive: true });
    /* Re-sync after dismiss animation */
    if (promoBanner) {
      promoBanner.addEventListener("transitionend", syncBannerHeight);
      /* Dismiss button wires the class; we just need to react to it */
      var closeBtn = promoBanner.querySelector(".ts-promo-banner__close");
      if (closeBtn) {
        var _origClick = closeBtn.onclick;
        closeBtn.addEventListener("click", function () {
          setTimeout(syncBannerHeight, 520); /* after transition */
        });
      }
    }

    /* ── Overflow → ••• relocation ────────────────────────────────────────── */
    var links = document.querySelector(".ts-nav-fixed__links.ts-nav-truncate");
    var more  = document.querySelector(".ts-nav-more");
    var dd    = more && more.querySelector(".ts-nav-dropdown");
    if (links && more && dd && nav) {
      var pool = Array.prototype.slice.call(
        links.querySelectorAll(":scope > .ts-nav-link, :scope > li.ts-nav-link")
      );

      function reflow() {
        links.style.flex    = "0 0 auto";
        links.style.overflow = "visible";
        pool.forEach(function (el) { if (el.parentNode === dd) links.appendChild(el); });
        more.classList.remove("hasItems");
        var guard = 0;
        while ((nav.scrollWidth > nav.clientWidth + 1) && guard < 50) {
          guard++;
          var inBar = pool.filter(function (el) { return el.parentNode === links; });
          if (!inBar.length) break;
          dd.insertBefore(inBar[inBar.length - 1], dd.firstChild);
          more.classList.add("hasItems");
        }
        links.style.flex    = "";
        links.style.overflow = "";
      }

      reflow();
      window.addEventListener("load", reflow);
      setTimeout(reflow, 400);
      if (window.ResizeObserver) {
        new ResizeObserver(reflow).observe(nav);
      } else {
        window.addEventListener("resize", reflow);
      }
    }
  });
})();

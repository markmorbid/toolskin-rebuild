/* ═══════════════════════════════════════════════════════════════════════════
   TOOLSKIN · ts-nav.js — TOP NAVIGATION behaviors (dependency-free)
   ───────────────────────────────────────────────────────────────────────────
   Restores the runtime behaviors the original showcase nav relies on, cleanly:
     • Burger ⇄ mobile menu + scrim (open/close, X morph via .active classes)
     • Overflow → ••• : truncatable `.ts-nav-link` items that don't fit are
       relocated into the .ts-nav-dropdown; restored on resize (ResizeObserver)
     • Theme toggle  : flips <html data-theme>, syncs the checkbox + aria-pressed
     • Back-to-top   : reveals #ts-top-btn past a scroll threshold; smooth scroll
     • Transparent-at-top : toggles `.at-top` so the header is glassless at y≈0
   All state is class/attribute toggles — every visual lives in ts-nav-header.css.

   USAGE:  <script src="assets/js/next/ts-nav.js" defer></script>
   ═══════════════════════════════════════════════════════════════════════════ */
(function () {
  "use strict";

  function ready(fn) {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn);
    else fn();
  }

  ready(function () {
    var nav = document.querySelector(".ts-nav-fixed");

    /* ── Logo subtitle width-match ────────────────────────────────────────────
       Make every .ts-logo-sub render at the EXACT width of its .ts-logo-brand
       wordmark by scaling the subtitle's font-size to the measured width ratio.
       Re-runs whenever the wordmark resizes (Variant Tester font/scale changes)
       and after webfonts load, so the lockup stays matched. */
    function fitLogoSubtitles() {
      document.querySelectorAll(".ts-topbar__logo").forEach(function (logo) {
        var brand = logo.querySelector(".ts-logo-brand");
        var sub = logo.querySelector(".ts-logo-sub") ||
                  logo.querySelector(":scope > span:not(.ts-logo-brand)");
        if (!brand || !sub) return;
        var brandW = brand.getBoundingClientRect().width;
        if (!brandW) return;

        // measure the subtitle's NATURAL width at its CSS base size (a neutral
        // clone avoids the width:100%/justify constraints on the live element)
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

        // scale font so natural width === wordmark width (clamped for legibility)
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
    }
    if (burger) burger.addEventListener("click", function () {
      setMenu(!(menu && menu.classList.contains("active")));
    });
    if (overlay) overlay.addEventListener("click", function () { setMenu(false); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") setMenu(false); });

    /* ── Theme toggle ─────────────────────────────────────────────────────── */
    document.querySelectorAll(".theme-toggle").forEach(function (tg) {
      var box = tg.querySelector('input[type="checkbox"]');
      function apply(toLight) {
        document.documentElement.setAttribute("data-theme", toLight ? "light" : "dark");
        tg.setAttribute("aria-pressed", String(toLight));
        if (box) box.checked = toLight;
      }
      // initialize from current document state
      var isLight = document.documentElement.getAttribute("data-theme") === "light";
      if (box) box.checked = isLight;
      tg.setAttribute("aria-pressed", String(isLight));
      tg.addEventListener("click", function (e) {
        // let the native checkbox drive; prevent double-toggle from label+input
        if (e.target !== box) e.preventDefault();
        apply(!(document.documentElement.getAttribute("data-theme") === "light"));
      });
    });

    /* ── Back-to-top + transparent-at-top ─────────────────────────────────── */
    var topBtn = document.getElementById("ts-top-btn");
    function onScroll() {
      var y = window.scrollY || document.documentElement.scrollTop;
      if (topBtn) topBtn.classList.toggle("active", y > 300);
      if (nav) nav.classList.toggle("at-top", y < 10);
    }
    if (topBtn) topBtn.addEventListener("click", function (e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    /* ── Overflow → ••• relocation ────────────────────────────────────────── */
    var links = document.querySelector(".ts-nav-fixed__links.ts-nav-truncate");
    var more  = document.querySelector(".ts-nav-more");
    var dd    = more && more.querySelector(".ts-nav-dropdown");
    if (links && more && dd) {
      // Only `.ts-nav-link` items are truncatable (per the original contract).
      var pool = Array.prototype.slice.call(links.querySelectorAll(":scope > .ts-nav-link"));

      function reflow() {
        // Measure against the NAV (not the shrink-to-fit links box). Temporarily
        // stop the links box from shrinking so the nav reports true overflow.
        links.style.flex = "0 0 auto";
        links.style.overflow = "visible";
        // 1) restore every truncatable item to the bar, hide ••• for a clean measure
        pool.forEach(function (el) { if (el.parentNode === dd) links.appendChild(el); });
        more.classList.remove("hasItems");
        // 2) move the last in-bar truncatable item into the dropdown until the nav fits
        var guard = 0;
        while ((nav.scrollWidth > nav.clientWidth + 1) && guard < 50) {
          guard++;
          var inBar = pool.filter(function (el) { return el.parentNode === links; });
          if (!inBar.length) break;
          dd.insertBefore(inBar[inBar.length - 1], dd.firstChild);
          more.classList.add("hasItems");
        }
        // 3) hand sizing back to the cascade
        links.style.flex = "";
        links.style.overflow = "";
      }
      reflow();
      // Re-run after fonts/icons settle (Font Awesome injects async and changes widths).
      window.addEventListener("load", reflow);
      setTimeout(reflow, 400);
      if (window.ResizeObserver) new ResizeObserver(reflow).observe(nav);
      else window.addEventListener("resize", reflow);
    }
  });
})();

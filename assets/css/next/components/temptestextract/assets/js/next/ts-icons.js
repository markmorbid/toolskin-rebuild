/* ═══════════════════════════════════════════════════════════════════════════
   TOOLSKIN · ts-icons.js — runtime ICON INJECTION shim (sandbox fidelity)
   ───────────────────────────────────────────────────────────────────────────
   The production showcase injects icons at runtime via toolskin.js, reading two
   attribute conventions on a host element:
       data-ts-icon="fa-solid fa-house"     → Font Awesome
       data-icon="ion:options-outline"      → Ionicons / Iconify ion set
   The portable sandbox doesn't ship toolskin.js, so the migrated harnesses
   rendered with empty icon slots ("looks broken"). This tiny shim restores
   parity: it lazy-loads the two icon CDNs and fills every [data-ts-icon] /
   [data-icon] host, mirroring the original markup contract exactly.

   It is additive and idempotent — safe to load on any harness. Hosts already
   filled (data-icon-injected) are skipped.

   USAGE:  <script src="assets/js/next/ts-icons.js" defer></script>
   ═══════════════════════════════════════════════════════════════════════════ */
(function () {
  "use strict";

  function ensureFontAwesome() {
    if (document.getElementById("ts-fa-cdn")) return;
    var l = document.createElement("link");
    l.id = "ts-fa-cdn";
    l.rel = "stylesheet";
    l.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css";
    l.crossOrigin = "anonymous";
    document.head.appendChild(l);
  }

  var ionLoaded = false;
  function ensureIonicons() {
    /* Ionicons support kept as an optional path, but the sandbox markup uses
       Font Awesome exclusively (one icon system, fewer network deps). Only
       loads if a [data-icon="ion:"] host is actually present. */
    if (ionLoaded) return;
    ionLoaded = true;
    var m = document.createElement("script");
    m.type = "module";
    m.src = "https://cdn.jsdelivr.net/npm/ionicons@7.4.0/dist/ionicons/ionicons.esm.js";
    document.head.appendChild(m);
  }

  function inject() {
    var faHosts = document.querySelectorAll("[data-ts-icon]:not([data-icon-injected])");
    if (faHosts.length) ensureFontAwesome();
    faHosts.forEach(function (host) {
      var cls = (host.getAttribute("data-ts-icon") || "").trim();
      if (!cls) return;
      // keep any existing utility classes on the host (e.g. ts-icon-tiny)
      var i = document.createElement("i");
      i.className = cls + " ts-icon";
      i.setAttribute("aria-hidden", "true");
      host.innerHTML = "";
      host.appendChild(i);
      host.setAttribute("data-icon-injected", "1");
    });

    var ionHosts = document.querySelectorAll('[data-icon^="ion:"]:not([data-icon-injected])');
    if (ionHosts.length) ensureIonicons();
    ionHosts.forEach(function (host) {
      var name = host.getAttribute("data-icon").slice(4).trim();
      if (!name) return;
      var ic = document.createElement("ion-icon");
      ic.setAttribute("name", name);
      ic.setAttribute("aria-hidden", "true");
      // ion-icon as a leading glyph next to label text — don't wipe label
      host.insertBefore(ic, host.firstChild);
      host.setAttribute("data-icon-injected", "1");
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", inject);
  else inject();
  // re-run once after fonts settle, in case markup was added late
  window.addEventListener("load", inject);
})();

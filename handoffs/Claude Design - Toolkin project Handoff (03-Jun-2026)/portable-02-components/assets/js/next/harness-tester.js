/* ═══════════════════════════════════════════════════════════════════════════
   TOOLSKIN · harness-tester.js — live VARIANT TESTER for the component sandbox
   ───────────────────────────────────────────────────────────────────────────
   PURPOSE  (owner directive: "introduce a mechanism to test variants directly
   on cards, allowing validation of background systems, surface styles, accent
   layers, typography behavior, input styling")
   ─────────────────────────────────────────────────────────────────────────
   Injects ONE floating control rig into any harness. Every control writes a
   canonical engine knob — it NEVER invents a style:

     • Surface preset   → toggles a `.ts-preset-*` class + data-theme on <html>
     • Accent           → sets `--ts-accent` on :root (curated hues only)
     • Type scale       → sets `--ts-font-scale` (drives the whole type ladder)
     • Display font     → swaps `--ts-font-display` / `--ts-font-body`
     • Radius           → sets `--ts-radius-base` (semantic ladder re-derives)
     • Gradient peak     → sets `--ts-grad-peak` (gradients-v3 global ceiling)
     • Specimen surface → sets `--ts-this-bg` on the target set (cards/panels)
     • Specimen skin    → toggles a gradient utility class on the target set
     • Input surface    → re-anchors `--ts-input-bg` on the target set
     • Reduced motion   → sets `data-ts-reduced-motion` + shows a dismissible
                          signal dot (addresses the motion.css owner note: the
                          feature must be VISIBLE and user-toggleable, never a
                          silent forced cookie)

   The rig is pure DOM + CSS-variable writes. All of its *appearance* lives in
   harness.css (.ts-tester*). State persists in localStorage per page.

   USAGE
   ─────
     <script src="assets/js/next/harness-tester.js" defer></script>
   Opt out of auto-init with  <body data-ts-tester="off">.
   Point it at a custom specimen set with  <body data-ts-tester-target=".ts-card">.
   ═══════════════════════════════════════════════════════════════════════════ */
(function () {
  "use strict";

  /* ── Curated option tables — every value is a canonical token target. ── */
  var SURFACES = [
    { id: "this",   label: "anchor", v: "var(--ts-this-bg)" },
    { id: "body",   label: "body",   v: "var(--ts-bg-body)" },
    { id: "bg1",    label: "bg-1",   v: "var(--ts-bg-1)" },
    { id: "bg2",    label: "bg-2",   v: "var(--ts-bg-2)" },
    { id: "bg3",    label: "bg-3",   v: "var(--ts-bg-3)" },
    { id: "accent", label: "accent", v: "var(--ts-accent)" }
  ];

  /* Gradient SKINS — utility classes shipped by the system engine
     (toolskin-this-bg-v2.css) + gradient library (toolskin-gradients-v3.css). */
  var SKINS = [
    { id: "none",   label: "none",   cls: null },
    { id: "card",   label: "card",   cls: "ts-card-grad" },
    { id: "mix",    label: "mix",    cls: "ts-mix-grad" },
    { id: "mesh",   label: "mesh",   cls: "ts-grad-mesh" },
    { id: "halo",   label: "halo",   cls: "ts-grad-halo" },
    { id: "aurora", label: "aurora", cls: "ts-grad-aurora" },
    { id: "glass",  label: "glass",  cls: "ts-card-glass" }
  ];
  var SKIN_CLASSES = SKINS.map(function (s) { return s.cls; }).filter(Boolean);

  /* Accent hues — share lightness/chroma, vary hue (system convention). */
  var ACCENTS = [
    { id: "orange", label: "●", v: "#ff5500" },
    { id: "blue",   label: "●", v: "oklch(67.59% 0.18 250)" },
    { id: "green",  label: "●", v: "oklch(67.59% 0.18 150)" },
    { id: "purple", label: "●", v: "oklch(67.59% 0.18 305)" },
    { id: "cyan",   label: "●", v: "oklch(72% 0.13 207)" },
    { id: "pink",   label: "●", v: "oklch(67.59% 0.20 0)" }
  ];

  var FONTS = [
    { id: "grotesk", label: "Grotesk", v: '"Space Grotesk", system-ui, sans-serif' },
    { id: "mono",    label: "Mono",    v: '"JetBrains Mono", monospace' },
    { id: "system",  label: "System",  v: "system-ui, -apple-system, sans-serif" }
  ];

  /* Surface presets from primitives/colors.css. */
  var THEMES = [
    { id: "dark",  label: "Dark",  theme: "dark",  preset: "" },
    { id: "light", label: "Light", theme: "light", preset: "" },
    { id: "warm",  label: "Warm",  theme: "dark",  preset: "ts-preset-dark-warm-slate-v2" },
    { id: "blue",  label: "Blue",  theme: "dark",  preset: "ts-preset-dark-blue-tinted-v3" }
  ];
  var PRESET_CLASSES = THEMES.map(function (t) { return t.preset; }).filter(Boolean);

  var DEFAULTS = {
    theme: "dark", accent: "orange", typeScale: 1, font: "grotesk",
    radius: 10, gradPeak: 0.55, surface: "this", skin: "none",
    inputSurface: "default", reduced: false, collapsed: false
  };

  /* SHARED key (not per-path): the tester state carries across every view, so
     a tweak made on one harness is still in effect after navigating. */
  var KEY = "ts-tester:v1";
  var state = load();
  var root = document.documentElement;

  function load() {
    try { return Object.assign({}, DEFAULTS, JSON.parse(localStorage.getItem(KEY) || "{}")); }
    catch (e) { return Object.assign({}, DEFAULTS); }
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {} }

  /* ── Resolve the specimen target set (cards if present, else panels). ── */
  function targets() {
    var sel = document.body.getAttribute("data-ts-tester-target");
    if (sel) return Array.prototype.slice.call(document.querySelectorAll(sel));
    var cards = document.querySelectorAll(".ts-card");
    if (cards.length) return Array.prototype.slice.call(cards);
    return Array.prototype.slice.call(document.querySelectorAll(".ts-harness-panel"));
  }

  /* ── APPLY — push the whole state onto the DOM. Idempotent. ── */
  function apply() {
    /* Theme + preset (global palette). */
    var theme = THEMES.filter(function (t) { return t.id === state.theme; })[0] || THEMES[0];
    root.setAttribute("data-theme", theme.theme);
    PRESET_CLASSES.forEach(function (c) { root.classList.remove(c); });
    if (theme.preset) root.classList.add(theme.preset);

    /* Accent / type / radius / gradient — all :root knobs. */
    var ac = ACCENTS.filter(function (a) { return a.id === state.accent; })[0] || ACCENTS[0];
    root.style.setProperty("--ts-accent", ac.v);
    root.style.setProperty("--ts-font-scale", String(state.typeScale));
    var f = FONTS.filter(function (x) { return x.id === state.font; })[0] || FONTS[0];
    root.style.setProperty("--ts-font-display", f.v);
    root.style.setProperty("--ts-font-body", f.v);
    root.style.setProperty("--ts-radius-base", state.radius + "px");
    root.style.setProperty("--ts-grad-peak", String(state.gradPeak));

    /* Reduced-motion: VISIBLE attribute (not a silent cookie). */
    if (state.reduced) root.setAttribute("data-ts-reduced-motion", "");
    else root.removeAttribute("data-ts-reduced-motion");

    /* Specimen-scoped knobs: surface anchor + gradient skin + input surface. */
    var surf = SURFACES.filter(function (s) { return s.id === state.surface; })[0] || SURFACES[0];
    var skin = SKINS.filter(function (s) { return s.id === state.skin; })[0] || SKINS[0];
    var inputBgMap = {
      "default": "", "bright": "var(--ts-this-bg-bright-1)",
      "dim": "var(--ts-this-bg-dim)", "dark": "var(--ts-this-bg-dark-2)"
    };
    targets().forEach(function (el) {
      if (state.surface === "this") el.style.removeProperty("--ts-this-bg");
      else el.style.setProperty("--ts-this-bg", surf.v);

      SKIN_CLASSES.forEach(function (c) { el.classList.remove(c); });
      if (skin.cls) el.classList.add(skin.cls);

      var ib = inputBgMap[state.inputSurface] || "";
      if (ib) el.style.setProperty("--ts-input-bg", ib);
      else el.style.removeProperty("--ts-input-bg");
    });

    syncUI();
    save();
  }

  /* ── UI construction ── */
  var ui = {};
  function el(tag, cls, txt) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (txt != null) n.textContent = txt;
    return n;
  }

  function optionGroup(legend, opts, current, onPick) {
    var g = el("div", "ts-tester__group");
    g.appendChild(el("span", "ts-tester__legend", legend));
    var wrap = el("div", "ts-tester__opts");
    var btns = [];
    opts.forEach(function (o) {
      var b = el("button", "ts-tester__opt", o.label);
      b.type = "button";
      if (o.id === "orange" || ACCENTS.indexOf(o) > -1) b.style.color = o.v; // accent swatch tint
      b.setAttribute("aria-pressed", String(o.id === current));
      b.addEventListener("click", function () {
        btns.forEach(function (x) { x.setAttribute("aria-pressed", "false"); });
        b.setAttribute("aria-pressed", "true");
        onPick(o.id);
      });
      btns.push(b);
      wrap.appendChild(b);
    });
    g.appendChild(wrap);
    g._btns = btns; g._opts = opts;
    return g;
  }

  function sliderGroup(legend, min, max, step, val, fmt, onInput) {
    var g = el("div", "ts-tester__group");
    g.appendChild(el("span", "ts-tester__legend", legend));
    var row = el("div", "ts-tester__slider");
    var input = el("input");
    input.type = "range"; input.min = min; input.max = max; input.step = step; input.value = val;
    var out = el("span", "ts-tester__val", fmt(val));
    input.addEventListener("input", function () { out.textContent = fmt(input.value); onInput(input.value); });
    row.appendChild(input); row.appendChild(out);
    g.appendChild(row);
    g._input = input; g._out = out; g._fmt = fmt;
    return g;
  }

  function build() {
    var panel = el("aside", "ts-tester");
    panel.setAttribute("aria-label", "Toolskin variant tester");

    /* Header (click to collapse). */
    var head = el("div", "ts-tester__head");
    head.appendChild(el("span", "ts-tester__title", "◧ Variant tester"));
    var toggle = el("button", "ts-tester__toggle", "▾"); toggle.type = "button";
    head.appendChild(toggle);
    head.addEventListener("click", function () {
      panel.classList.toggle("is-collapsed");
      state.collapsed = panel.classList.contains("is-collapsed");
      toggle.textContent = state.collapsed ? "▴" : "▾";
      save();
    });
    panel.appendChild(head);

    var body = el("div", "ts-tester__body");

    ui.theme = optionGroup("Surface preset", THEMES, state.theme, function (id) { state.theme = id; apply(); });
    ui.accent = optionGroup("Accent", ACCENTS, state.accent, function (id) { state.accent = id; apply(); });
    ui.font = optionGroup("Display font", FONTS, state.font, function (id) { state.font = id; apply(); });
    ui.type = sliderGroup("Type scale", 0.8, 1.4, 0.01, state.typeScale,
      function (v) { return (+v).toFixed(2) + "×"; }, function (v) { state.typeScale = +v; apply(); });
    ui.radius = sliderGroup("Radius base", 0, 18, 1, state.radius,
      function (v) { return v + "px"; }, function (v) { state.radius = +v; apply(); });
    ui.grad = sliderGroup("Gradient peak", 0, 1, 0.05, state.gradPeak,
      function (v) { return (+v).toFixed(2); }, function (v) { state.gradPeak = +v; apply(); });
    ui.surface = optionGroup("Specimen surface", SURFACES, state.surface, function (id) { state.surface = id; apply(); });
    ui.skin = optionGroup("Specimen skin", SKINS, state.skin, function (id) { state.skin = id; apply(); });
    ui.input = optionGroup("Input surface",
      [{ id: "default", label: "default" }, { id: "bright", label: "bright" }, { id: "dim", label: "dim" }, { id: "dark", label: "dark" }],
      state.inputSurface, function (id) { state.inputSurface = id; apply(); });
    ui.reduced = optionGroup("Reduced motion",
      [{ id: "off", label: "off" }, { id: "on", label: "on" }],
      state.reduced ? "on" : "off", function (id) { state.reduced = id === "on"; apply(); });

    [ui.theme, ui.accent, ui.font, ui.type, ui.radius, ui.grad,
     ui.surface, ui.skin, ui.input, ui.reduced].forEach(function (g) { body.appendChild(g); });

    var reset = el("button", "ts-tester__reset", "Reset all"); reset.type = "button";
    reset.addEventListener("click", function () { state = Object.assign({}, DEFAULTS); apply(); });
    body.appendChild(reset);

    panel.appendChild(body);
    document.body.appendChild(panel);
    ui.panel = panel;

    /* Measure head height for the collapsed transform. */
    panel.style.setProperty("--_ts-tester-head", head.offsetHeight + "px");
    /* Restore persisted collapse state. */
    if (state.collapsed) { panel.classList.add("is-collapsed"); toggle.textContent = "▴"; }
  }

  /* Reflect current state back into the controls (after Reset, on load). */
  function syncUI() {
    function press(group, id) {
      if (!group || !group._btns) return;
      group._btns.forEach(function (b, i) {
        b.setAttribute("aria-pressed", String(group._opts[i].id === id));
      });
    }
    press(ui.theme, state.theme);
    press(ui.accent, state.accent);
    press(ui.font, state.font);
    press(ui.surface, state.surface);
    press(ui.skin, state.skin);
    press(ui.input, state.inputSurface);
    press(ui.reduced, state.reduced ? "on" : "off");
    if (ui.type && ui.type._input) { ui.type._input.value = state.typeScale; ui.type._out.textContent = ui.type._fmt(state.typeScale); }
    if (ui.radius && ui.radius._input) { ui.radius._input.value = state.radius; ui.radius._out.textContent = ui.radius._fmt(state.radius); }
    if (ui.grad && ui.grad._input) { ui.grad._input.value = state.gradPeak; ui.grad._out.textContent = ui.grad._fmt(state.gradPeak); }
  }

  function init() {
    if (document.body.getAttribute("data-ts-tester") === "off") return;
    buildNav();
    build();
    apply();
  }

  /* ── BREADCRUMB / VIEW NAV — injected once, identical on every harness. ── */
  var VIEWS = [
    { id: "00", file: "index.html",              name: "index" },
    { id: "01", file: "ts-input.html",           name: "input" },
    { id: "02", file: "ts-card.html",            name: "card" },
    { id: "03", file: "ts-section.html",         name: "section" },
    { id: "04", file: "ts-chip-badge.html",      name: "chip · badge" },
    { id: "05", file: "ts-table-accordion.html", name: "table · accordion" },
    { id: "06", file: "ts-modal-overlay.html",   name: "modal · overlay" },
    { id: "07", file: "ts-topbar-nav.html",      name: "topbar · nav" }
  ];
  function buildNav() {
    if (document.querySelector(".ts-sandbox-nav")) return;
    if (document.body.getAttribute("data-ts-breadcrumb") === "off") return;
    var here = (location.pathname.split("/").pop() || "index.html") || "index.html";
    var nav = el("nav", "ts-sandbox-nav");
    nav.setAttribute("aria-label", "Sandbox views");
    var brand = el("a", "ts-sandbox-nav__brand", "◧ Toolskin");
    brand.href = "index.html";
    brand.style.textDecoration = "none";
    nav.appendChild(brand);
    nav.appendChild(el("span", "ts-sandbox-nav__sep", "/"));
    VIEWS.forEach(function (v) {
      if (v.file === "index.html") return; // brand already links home
      var a = el("a", "ts-sandbox-nav__link" + (v.file === here ? " is-current" : ""));
      a.href = v.file;
      a.appendChild(el("span", null, v.id));
      a.appendChild(document.createTextNode(" " + v.name));
      if (v.file === here) a.setAttribute("aria-current", "page");
      nav.appendChild(a);
    });
    document.body.insertBefore(nav, document.body.firstChild);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();

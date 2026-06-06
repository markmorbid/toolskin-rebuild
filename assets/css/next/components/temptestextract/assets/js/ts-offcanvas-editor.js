/*!
 * Toolskin showcase — offcanvas editor v2
 * Banner generator structure reuse. UIKit-initialised. Panel-isolated.
 */
(function (global) {
  'use strict';

  /* ═══ STORAGE ═══ */
  var SK = 'ts-offcanvas-editor-';
  function store(k, v) { try { sessionStorage.setItem(SK + k, v); } catch (e) { } }
  function load(k, d) { try { return sessionStorage.getItem(SK + k) || d; } catch (e) { return d; } }

  function qs(id) { return document.getElementById(id); }

  /* ═══ HELPERS ═══ */
  function hslToHex(h, s, l) {
    s /= 100; l /= 100;
    var a = s * Math.min(l, 1 - l);
    function f(n) {
      var k = (n + h / 30) % 12;
      var c = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * c).toString(16).padStart(2, '0');
    }
    return '#' + f(0) + f(8) + f(4);
  }

  function getCurrentAccentHex() {
    var cs = getComputedStyle(document.documentElement);
    var h = parseFloat(cs.getPropertyValue('--ts-accent-h'));
    var s = parseFloat(cs.getPropertyValue('--ts-accent-s'));
    var l = parseFloat(cs.getPropertyValue('--ts-accent-l'));
    if (isNaN(h) || isNaN(s) || isNaN(l)) return '#7c3aed';
    return hslToHex(h, s, l);
  }

  /** Apply a CSS variable to :root so it cascades to ALL elements (including sidebar).
   *  Previously scoped to #ts-main which excluded the sidebar panel and any elements
   *  mounted outside #ts-main. Fonts and other tokens must apply sitewide. */
  function setMainVar(prop, val) {
    document.documentElement.style.setProperty(prop, val);
  }

  /**
   * Dynamic style sheet for overrides that need specificity > :where(:root, :root *).
   * Using #ts-main selector gives (1,0,0) which beats :where's (0,0,0).
   */
  var _editorSheet = null;
  var _editorVars = {};
  function setEditorVar(prop, val) {
    _editorVars[prop] = val;
    _flushEditorSheet();
  }
  function _flushEditorSheet() {
    if (!_editorSheet) {
      _editorSheet = document.createElement('style');
      _editorSheet.id = 'ts-oce-editor-overrides';
      document.head.appendChild(_editorSheet);
    }
    var rules = '#ts-main, #ts-main * {';
    Object.keys(_editorVars).forEach(function (k) {
      rules += k + ':' + _editorVars[k] + ';';
    });
    rules += '}';
    _editorSheet.textContent = rules;
  }

  /** Toast shortcut */
  function toast(msg, type) {
    if (global.Toolskin && typeof global.Toolskin.showToast === 'function') {
      global.Toolskin.showToast(msg, { type: type || 'info', duration: 2500 });
    }
  }

  /** Disable transitions briefly during theme switch */
  function suppressTransitions(fn) {
    var root = document.documentElement;
    root.classList.add('ts-no-transition');
    fn();
    // Force reflow then re-enable
    void root.offsetHeight;
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        root.classList.remove('ts-no-transition');
      });
    });
  }

  /* ═══════════════════════════════════════════════════════════════════
     PHASE 2 — SCHEMA-DRIVEN COMPONENT SYSTEM
     createElement-based builders, schema definition, renderer.
     ═══════════════════════════════════════════════════════════════════ */

  var BANNER_FONTS = [
    'Bebas Neue', 'Anton', 'Barlow Condensed', 'Oswald', 'Black Han Sans',
    'Michroma', 'Syne', 'Archivo Black', 'Russo One', 'Teko',
    'Big Shoulders Display', 'Turret Road', 'Chakra Petch', 'Space Grotesk',
    'Rajdhani', 'Play', 'Pirata One'
  ];
  var BODY_FONTS = [
    'Space Grotesk', 'Inter', 'DM Sans', 'Poppins', 'Roboto',
    'Source Sans 3', 'Nunito', 'Work Sans'
  ];

  /* ── createElement component constructors ── */
  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      if (k === 'className') node.className = attrs[k];
      else if (k === 'style' && typeof attrs[k] === 'object') Object.assign(node.style, attrs[k]);
      else if (k === 'textContent') node.textContent = attrs[k];
      else if (k === 'innerHTML') node.innerHTML = attrs[k];
      else if (k.indexOf('on') === 0) node.addEventListener(k.slice(2).toLowerCase(), attrs[k]);
      else node.setAttribute(k, attrs[k]);
    });
    if (children) {
      (Array.isArray(children) ? children : [children]).forEach(function (c) {
        if (c) node.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
      });
    }
    return node;
  }

  /** Schema-driven component map — each creates a DOM fragment */
  var ComponentMap = {
    /** UIKit select dropdown */
    select: function (cfg) {
      var wrap = el('div', { className: 'ts-ui-select', 'data-ts-ui-select-search': cfg.searchable ? null : 'false' });
      var native = el('select', { className: 'ts-ui-select__native', id: cfg.id });
      (cfg.options || []).forEach(function (o) {
        var val = typeof o === 'string' ? o : o.value;
        var txt = typeof o === 'string' ? o : o.label;
        var opt = el('option', { value: val, textContent: txt });
        if (o.selected) opt.selected = true;
        native.appendChild(opt);
      });
      wrap.appendChild(native);
      return wrap;
    },

    /** Font-preview UIKit select */
    fontSelect: function (cfg) {
      var wrap = el('div', { className: 'ts-ui-select ts-ui-select--font-preview', 'data-ts-ui-select-placeholder': 'Filter fonts…' });
      var native = el('select', { className: 'ts-ui-select__native', id: cfg.id });
      (cfg.fonts || []).forEach(function (f, i) {
        var opt = el('option', { value: f, textContent: f });
        if (i === 0) opt.selected = true;
        native.appendChild(opt);
      });
      wrap.appendChild(native);
      return wrap;
    },

    /** Toggle switch row */
    toggle: function (cfg) {
      var row = el('div', { className: 'ts-toggle-row' });
      if (cfg.tip) row.setAttribute('data-tooltip', cfg.tip);
      row.appendChild(el('span', { className: 'ts-toggle-label', textContent: cfg.label }));
      var lbl = el('label', { className: 'ts-toggle' });
      lbl.appendChild(el('input', { type: 'checkbox', id: cfg.id }));
      lbl.appendChild(el('span', { className: 'ts-toggle__knob' }));
      row.appendChild(lbl);
      return row;
    },

    /** Range slider with value display */
    range: function (cfg) {
      var step = cfg.step || 1, unit = cfg.unit || '';
      var disp = unit === '%' ? Math.round(cfg.value * 100) + '%' : cfg.value + unit;
      var wrap = el('div', { className: 'ts-field ts-range-stack' });
      if (cfg.tip) wrap.setAttribute('data-tooltip', cfg.tip);
      wrap.appendChild(el('label', { textContent: cfg.label }));
      var row = el('div', { className: 'ts-range-row' });
      row.appendChild(el('input', {
        type: 'range', className: 'ts-range', id: cfg.id,
        min: String(cfg.min), max: String(cfg.max), step: String(step), value: String(cfg.value),
        'data-unit': unit
      }));
      row.appendChild(el('span', { className: 'ts-range-val', textContent: disp }));
      wrap.appendChild(row);
      return wrap;
    },

    /** Color picker row (swatch + native picker + hex input) */
    /** Color picker row (swatch + native picker + hex input).
     *  Returns bare .ts-color-row — label added by wrapField via fieldLabel.
     *  cfg.vertical: true → adds 'vertical' class for compact column layout. */
    color: function (cfg) {
      var cls = 'ts-color-row' + (cfg.vertical ? ' vertical' : '');
      var row = el('div', { className: cls });
      var swatchWrap = el('div', { className: 'ts-color-swatch' });
      swatchWrap.appendChild(el('div', { className: 'ts-sw', id: cfg.swatchId || '', style: { background: cfg.value || '#7c3aed' } }));
      swatchWrap.appendChild(el('input', { type: 'color', id: cfg.pickerId || '', value: cfg.value || '#7c3aed' }));
      row.appendChild(swatchWrap);
      row.appendChild(el('input', {
        type: 'text', className: 'ts-input-text mono',
        id: cfg.hexId || '', value: cfg.value || '#7c3aed', maxlength: '9', placeholder: cfg.value || '#7c3aed'
      }));
      return row;
    },

    /** Dropzone (drag-and-drop file upload) */
    dropzone: function (cfg) {
      var dz = el('div', { className: 'ts-dropzone', id: cfg.id });
      dz.appendChild(el('ion-icon', { name: 'cloud-upload-outline', style: { fontSize: '22px', display: 'block', margin: '0 auto var(--ts-sp-2) auto' } }));
      dz.appendChild(el('span', { id: cfg.labelId || '', textContent: cfg.label || 'Drop image or click to upload' }));
      dz.appendChild(el('input', { type: 'file', id: cfg.fileId || '', accept: cfg.accept || 'image/*' }));
      if (cfg.previewId) dz.appendChild(el('img', { id: cfg.previewId, className: 'ts-dz-preview' }));
      return dz;
    },

    /** Button */
    button: function (cfg) {
      var btn = el('button', { type: 'button', className: cfg.className || 'ts-btn ts-btn--ghost ts-btn--full', id: cfg.id || '' });
      if (cfg.icon) btn.appendChild(el('ion-icon', { name: cfg.icon }));
      if (cfg.faIcon) { var i = el('i', { className: cfg.faIcon, 'aria-hidden': 'true' }); btn.appendChild(i); }
      if (cfg.text) btn.appendChild(document.createTextNode(' ' + cfg.text));
      if (cfg.tip) btn.setAttribute('data-tooltip', cfg.tip);
      if (cfg.dataset) Object.keys(cfg.dataset).forEach(function (k) { btn.dataset[k] = cfg.dataset[k]; });
      return btn;
    },

    /** Accordion card section */
    section: function (cfg) {
      var card = el('div', { className: 'ts-card' });
      var hdr = el('div', { className: 'ts-card-header ts-accordion' + (cfg.open ? ' open' : '') + ' absolute' });
      var title = el('span', { className: 'ts-card-title' });
      title.appendChild(el('ion-icon', { name: cfg.icon }));
      title.appendChild(document.createTextNode(cfg.label));
      hdr.appendChild(title);
      card.appendChild(hdr);
      var body = el('div', { className: 'ts-card-rows' });
      card.appendChild(body);
      return { card: card, body: body };
    },

    /** Input group with inset submit button */
    insetInput: function (cfg) {
      var group = el('div', { className: 'ts-input-group ts-input-inset-button' });
      if (cfg.tip) group.setAttribute('data-tooltip', cfg.tip);
      if (cfg.faIcon) {
        var icon = el('span', { className: 'ts-icon ts-input-icon' });
        icon.appendChild(el('i', { className: cfg.faIcon }));
        group.appendChild(icon);
      }
      group.appendChild(el('input', { type: 'text', className: 'ts-input', placeholder: cfg.placeholder || '', id: cfg.id || '' }));
      var btn = el('button', { type: 'button', className: 'ts-btn ts-btn--icon ts-btn--primary ts-input-btn', id: cfg.btnId || '' });
      btn.appendChild(el('i', { className: cfg.btnIcon || 'fa-solid fa-arrow-right' }));
      group.appendChild(btn);
      return group;
    },
     /** Input group with inset submit button */
    iconInput: function (cfg) {
      var group = el('div', { className: 'ts-input-group' });
      if (cfg.tip) group.setAttribute('data-tooltip', cfg.tip);
      if (cfg.faIcon) {
        var icon = el('span', { className: 'ts-icon ts-input-icon' });
        icon.appendChild(el('i', { className: cfg.faIcon }));
        group.appendChild(icon);
      }
      group.appendChild(el('input', { type: 'text', className: 'ts-input', placeholder: cfg.placeholder || '', id: cfg.id || '' }));
      return group;
    },

    /** Color swatch grid (preset colors) */
    swatchGrid: function (cfg) {
      var wrap = el('div', { className: cfg.className || 'ts-grad-swatches' });
      (cfg.colors || []).forEach(function (hex) {
        var sw = el('div', {
          className: 'ts-grad-swatch',
          style: { background: hex }
        });
        sw.setAttribute(cfg.dataAttr || 'data-ts-oce-preset', hex);
        wrap.appendChild(sw);
      });
      return wrap;
    },

    /** Surface color picker field (label + swatch + color input + hex text) */
    surfaceColor: function (cfg) {
      var varName = cfg.varName;
      var wrap = el('div', { className: 'ts-field' });
      wrap.appendChild(el('label', { textContent: cfg.label }));
      var row = el('div', { className: 'ts-color-row' });
      var swatchWrap = el('div', { className: 'ts-color-swatch' });
      swatchWrap.appendChild(el('div', { className: 'ts-sw', id: 'ts-oce-sw-' + cfg.name }));
      swatchWrap.appendChild(el('input', { type: 'color', className: 'ts-oce-surface-pick', 'data-surface': varName }));
      row.appendChild(swatchWrap);
      row.appendChild(el('input', {
        type: 'text', className: 'ts-input-text mono ts-oce-surface-hex',
        'data-surface': varName, maxlength: '9'
      }));
      wrap.appendChild(row);
      return wrap;
    },

    /** Text input */
    textInput: function (cfg) {
      return el('input', {
        type: 'text', className: 'ts-input-text' + (cfg.mono ? ' mono' : ''),
        id: cfg.id || '', placeholder: cfg.placeholder || '', value: cfg.value || '',
        maxlength: cfg.maxlength || ''
      });
    },

    /** Textarea */
    textarea: function (cfg) {
      return el('textarea', {
        id: cfg.id || '', className: cfg.className || 'ts-input-text',
        rows: String(cfg.rows || 4), readonly: cfg.readonly ? '' : null,
        spellcheck: 'false', style: cfg.style || {}
      });
    }
  };

  /** Layout helpers (createElement versions) */
  function rowEl(child, cls) {
    cls = cls || 'ts-card-col-full';
    var r = el('div', { className: 'ts-card-row' });
    var c = el('div', { className: cls });
    c.appendChild(child);
    r.appendChild(c);
    return r;
  }
  function rowHalfEl(left, right) {
    var r = el('div', { className: 'ts-card-row' });
    var l = el('div', { className: 'ts-card-col-half' }); l.appendChild(left);
    var ri = el('div', { className: 'ts-card-col-half' }); ri.appendChild(right);
    r.appendChild(l); r.appendChild(ri);
    return r;
  }
  function fieldEl(child, label, tip) {
    var f = el('div', { className: 'ts-field' });
    if (label) {
      var lbl = el('label', { textContent: label });
      if (tip) lbl.setAttribute('data-tooltip', tip);
      f.appendChild(lbl);
    }
    f.appendChild(child);
    return f;
  }
  function conditionalEl(requiresId, requiresSelect, requiresNot) {
    var d = el('div', { className: 'ts-oce-conditional' });
    if (requiresId) d.setAttribute('data-requires', requiresId);
    if (requiresSelect) {
      d.setAttribute('data-requires-select', requiresSelect);
      if (requiresNot) d.setAttribute('data-requires-not', requiresNot);
    }
    return d;
  }

  /* ═══ SCHEMA RENDERER ═══
     Walks a section schema array -> creates DOM via ComponentMap + layout helpers.
     Each child node in the schema has:
       type: 'select'|'toggle'|'range'|'color'|'dropzone'|'button'|'insetInput'|'textInput'|'fontSelect'|'html'
       id:   element id
       ...type-specific config
       showWhen: { id, values } — conditional visibility (toggle or select match)
       half: true — put in half-width column (paired with next half sibling)
       third: true — put in third-width column (grouped in sets of 3)
       bind: { var, target, transform } — auto-wiring (Phase 2b)
  */
  function renderSection(sectionCfg) {
    var sec = ComponentMap.section({ icon: sectionCfg.icon, label: sectionCfg.label, open: sectionCfg.open });
    var body = sec.body;
    var children = sectionCfg.children || [];

    // Detect enabler: first child is a standalone toggle (no showWhen) that
    // controls subsequent children via showWhen. Rendered OUTSIDE .ts-card-rows
    // so the accordion can stay closed while the toggle remains clickable.
    var enablerIdx = -1;
    if (children.length > 0 && children[0].type === 'toggle' && !children[0].showWhen) {
      // Only treat as enabler if at least one later child references its id via showWhen
      var firstId = children[0].id;
      var hasDependents = children.some(function (c, idx) {
        return idx > 0 && c.showWhen && c.showWhen.id === firstId;
      });
      if (hasDependents) enablerIdx = 0;
    }

    if (enablerIdx === 0) {
      // Render enabler toggle directly into card, between header and .ts-card-rows
      var enablerNode = renderChild(children[0]);
      if (enablerNode) sec.card.insertBefore(enablerNode, body);
    }

    // Build groups for remaining children (everything except enabler).
    // Non-conditional items are collected into one batch until a conditional
    // appears — this preserves `row:` grouping and layout pairing across
    // consecutive standalone items.
    var startIdx = (enablerIdx === 0) ? 1 : 0;
    var groups = [];
    var i = startIdx;
    while (i < children.length) {
      var child = children[i];
      if (child.showWhen) {
        // Collect all consecutive children with the same showWhen
        var swId = child.showWhen.id;
        var swNot = child.showWhen.not;
        var batch = [];
        while (i < children.length && children[i].showWhen &&
          children[i].showWhen.id === swId && (children[i].showWhen.not || null) === (swNot || null)) {
          batch.push(children[i]);
          i++;
        }
        groups.push({ conditional: true, showWhen: { id: swId, not: swNot }, items: batch });
      } else {
        // Collect ALL consecutive standalone (non-showWhen) children into one batch
        var nBatch = [];
        while (i < children.length && !children[i].showWhen) {
          nBatch.push(children[i]);
          i++;
        }
        groups.push({ conditional: false, items: nBatch });
      }
    }

    // Render each group into the .ts-card-rows body
    groups.forEach(function (grp) {
      var container = body;
      if (grp.conditional) {
        var cond = grp.showWhen.not
          ? conditionalEl(null, grp.showWhen.id, grp.showWhen.not)
          : conditionalEl(grp.showWhen.id);
        body.appendChild(cond);
        container = cond;
      }
      renderItems(grp.items, container, sec);
    });

    return sec.card;
  }

  /** Render an array of schema items into a container (body or conditional) */
  function renderItems(items, container, sec) {
    var i = 0;
    while (i < items.length) {
      var child = items[i];

      // PRIORITY 1: _appendTo — inject into a specific target container.
      // Must come FIRST so third/half/row grouping doesn't intercept these items.
      if (child._appendTo && sec) {
        var node0 = renderChild(child);
        if (node0) {
          var target = container.querySelector('#' + child._appendTo) || sec.card.querySelector('#' + child._appendTo);
          if (target) {
            var wrapped = wrapField(child, node0);
            var colCls = child.third ? 'ts-card-col-third'
              : child.half ? 'ts-card-col-half'
                : 'ts-card-col-full';
            if (wrapped.classList) wrapped.classList.add(colCls);
            target.appendChild(wrapped);
          }
        }
        i++;
        continue;
      }

      // PRIORITY 2: Explicit row grouping — consecutive items with same row id
      if (child.row) {
        var rowId = child.row;
        var rg = el('div', { className: 'ts-card-row' });
        while (i < items.length && items[i].row === rowId) {
          var it = items[i];
          var itNode = renderChild(it);
          if (itNode) {
            var rc = it.half ? 'ts-card-col-half'
              : it.third ? 'ts-card-col-third'
                : 'ts-card-col-full';
            var col = el('div', { className: rc });
            col.appendChild(wrapField(it, itNode));
            rg.appendChild(col);
          }
          i++;
        }
        container.appendChild(rg);
        continue;
      }

      var node = renderChild(child);
      if (!node) { i++; continue; }

      // PRIORITY 3: Third-width grouping (3 consecutive thirds)
      if (child.third && i + 2 < items.length && items[i + 1].third && items[i + 2].third) {
        var n2 = renderChild(items[i + 1]);
        var n3 = renderChild(items[i + 2]);
        var r = el('div', { className: 'ts-card-row' });
        var c1 = el('div', { className: 'ts-card-col-third' }); c1.appendChild(wrapField(items[i], node));
        var c2 = el('div', { className: 'ts-card-col-third' }); c2.appendChild(wrapField(items[i + 1], n2));
        var c3 = el('div', { className: 'ts-card-col-third' }); c3.appendChild(wrapField(items[i + 2], n3));
        r.appendChild(c1); r.appendChild(c2); r.appendChild(c3);
        container.appendChild(r);
        i += 3;
        continue;
      }

      // PRIORITY 4: Half-width pairing (2 consecutive halves)
      if (child.half && i + 1 < items.length && items[i + 1].half) {
        var right = renderChild(items[i + 1]);
        container.appendChild(rowHalfEl(wrapField(child, node), wrapField(items[i + 1], right)));
        i += 2;
        continue;
      }

      // noWrap: structural html containers go directly into parent (no row/col wrapper)
      if (child.noWrap) {
        container.appendChild(node);
        i++;
        continue;
      }

      // DEFAULT: full-width row
      container.appendChild(rowEl(wrapField(child, node)));
      i++;
    }
  }

  function renderChild(cfg) {
    if (!cfg || !cfg.type) return null;
    var ctor = ComponentMap[cfg.type];
    if (ctor) return ctor(cfg);
    if (cfg.type === 'html') {
      if (!cfg.content) return el('div', { className: 'ts-oce-empty' });
      var temp = document.createElement('template');
      temp.innerHTML = cfg.content.trim();
      // Return the root element directly if single child — avoids extra wrapper div
      if (temp.content.children.length === 1) return temp.content.firstElementChild;
      var frag = el('div', { className: 'ts-field' });
      while (temp.content.firstChild) frag.appendChild(temp.content.firstChild);
      return frag;
    }
    return null;
  }

  function wrapField(cfg, node) {
    if (cfg.type === 'toggle' || cfg.type === 'range' || cfg.type === 'html') return node; // already self-wrapping or raw html
    if (cfg.type === 'button') return el('div', { className: 'ts-field' }, [node]);
    if (cfg.fieldLabel) return fieldEl(node, cfg.fieldLabel, cfg.fieldTip);
    if (cfg.type === 'color' || cfg.type === 'surfaceColor') return el('div', { className: 'ts-field' }, [node]);
    return node;
  }

  /** Render a complete tab pane from an array of section schemas */
  function renderTab(sections) {
    var frag = document.createDocumentFragment();
    sections.forEach(function (s) { frag.appendChild(renderSection(s)); });
    return frag;
  }

  /* ═══ VARIABLE BINDING SYSTEM ═══
     Each control with a `bind` config gets auto-wired:
       bind: { var: '--ts-radius-base', target: 'root|main|editor|hero', transform: fn }
     target:
       root   → document.documentElement.style.setProperty
       main   → setMainVar(var, val)
       editor → setEditorVar(var, val) — high-specificity dynamic sheet
       hero   → hero.style.setProperty
  */
  function autobind(panel, cfg, updateRangeFn) {
    if (!cfg.bind || !cfg.id) return;
    var elem = panel.querySelector('#' + cfg.id);
    if (!elem) return;
    var b = cfg.bind;
    var eventName = (cfg.type === 'toggle') ? 'change' : (cfg.type === 'range' ? 'input' : 'change');
    elem.addEventListener(eventName, function () {
      var raw = cfg.type === 'toggle' ? this.checked : this.value;
      var val = b.transform ? b.transform(raw) : raw;
      if (cfg.type === 'range' && updateRangeFn) updateRangeFn(this);
      applyBinding(b, val);
    });
  }

  function applyBinding(b, val) {
    if (!b.var) return;
    switch (b.target) {
      case 'root':
        document.documentElement.style.setProperty(b.var, val);
        break;
      case 'main':
        setMainVar(b.var, val);
        break;
      case 'editor':
        setEditorVar(b.var, val);
        break;
      case 'hero':
        var hero = document.querySelector('.ts-hero, #top');
        if (hero) hero.style.setProperty(b.var, val);
        break;
      case 'preloader':
        var pre = document.querySelector('#ts-preloader, [data-ts-preloader]');
        if (pre) pre.style.setProperty(b.var, val);
        break;
    }
  }

  /** Bind all controls in a section schema array */
  function autobindAll(panel, sections, updateRangeFn) {
    sections.forEach(function (sec) {
      (sec.children || []).forEach(function (child) {
        autobind(panel, child, updateRangeFn);
      });
    });
  }

  /* ═══ LEGACY HTML BUILDERS (still used by buildUi — Phase 2 migrates incrementally) ═══ */

  function sel(id, opts, searchable) {
    var search = searchable ? '' : ' data-ts-ui-select-search="false"';
    var html = '<div class="ts-ui-select"' + search + '><select class="ts-ui-select__native" id="' + id + '">';
    opts.forEach(function (o) {
      var val = typeof o === 'string' ? o : o.value;
      var txt = typeof o === 'string' ? o : o.label;
      var s = o.selected ? ' selected' : '';
      html += '<option value="' + val + '"' + s + '>' + txt + '</option>';
    });
    html += '</select></div>';
    return html;
  }

  function fontSel(id, fonts) {
    var html = '<div class="ts-ui-select ts-ui-select--font-preview" data-ts-ui-select-placeholder="Filter fonts…">' +
      '<select class="ts-ui-select__native" id="' + id + '">';
    fonts.forEach(function (f, i) {
      html += '<option value="' + f + '"' + (i === 0 ? ' selected' : '') + '>' + f + '</option>';
    });
    html += '</select></div>';
    return html;
  }

  function toggle(id, label, tip) {
    var tipAttr = tip ? ' data-tooltip="' + tip + '"' : '';
    return '<div class="ts-toggle-row"' + tipAttr + '>' +
      '<span class="ts-toggle-label">' + label + '</span>' +
      '<label class="ts-toggle"><input type="checkbox" id="' + id + '">' +
      '<span class="ts-toggle__knob"></span></label></div>';
  }

  function range(id, label, min, max, val, step, unit, tip) {
    step = step || 1; unit = unit || '';
    var disp = unit === '%' ? Math.round(val * 100) + '%' : val + unit;
    var tipAttr = tip ? ' data-tooltip="' + tip + '"' : '';
    return '<div class="ts-field ts-range-stack"' + tipAttr + '><label>' + label + '</label>' +
      '<div class="ts-range-row">' +
      '<input type="range" class="ts-range" id="' + id + '" min="' + min + '" max="' + max + '" step="' + step + '" value="' + val + '" data-unit="' + unit + '">' +
      '<span class="ts-range-val">' + disp + '</span>' +
      '</div></div>';
  }

  function card(icon, title, isOpen, rows) {
    return '<div class="ts-card"><div class="ts-card-header ts-accordion' + (isOpen ? ' open' : '') + ' absolute">' +
      '<span class="ts-card-title"><ion-icon name="' + icon + '"></ion-icon>' + title + '</span></div>' +
      '<div class="ts-card-rows">' + rows + '</div></div>';
  }

  function row(c, cls) { cls = cls || 'ts-card-col-full'; return '<div class="ts-card-row"><div class="' + cls + '">' + c + '</div></div>'; }
  function rowHalf(l, r) { return '<div class="ts-card-row"><div class="ts-card-col-half">' + l + '</div><div class="ts-card-col-half">' + r + '</div></div>'; }
  function rowThirds(a, b, c) { return '<div class="ts-card-row"><div class="ts-card-col-third">' + a + '</div><div class="ts-card-col-third">' + b + '</div><div class="ts-card-col-third">' + c + '</div></div>'; }
  function field(c) { return '<div class="ts-field">' + c + '</div>'; }

  /* ═══ BUILD PANEL ═══ */
  function buildUi(root) {
    var fab = document.createElement('button');
    fab.type = 'button';
    fab.className = 'ts-oce-fab ts-oce-fab--tab';
    fab.setAttribute('aria-expanded', 'false');
    fab.setAttribute('aria-controls', 'ts-offcanvas-editor');
    fab.innerHTML = '<i class="fa-solid fa-sliders ts-icon" aria-hidden="true"></i><span>Editor</span>';

    var overlay = document.createElement('div');
    overlay.id = 'ts-offcanvas-editor-overlay';
    overlay.className = 'ts-oce-overlay';

    var panel = document.createElement('aside');
    panel.id = 'ts-offcanvas-editor';
    panel.className = 'ts-oce-panel ts-banner-generator-app';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-modal', 'true');
    panel.setAttribute('aria-label', 'Toolskin live editor');
    panel.setAttribute('data-ts-oce-isolated', 'true');

    /* ── HERO TAB — Schema-driven (Phase 2) ── */
    var heroSchema = [
      {
        icon: 'image-outline', label: 'Background Type', open: true,
        children: [
          {
            type: 'select', id: 'ts-oce-bg-type', options: [
              { value: 'canvas-gradient', label: 'Canvas Gradient', selected: true },
              { value: 'image', label: 'Image' },
              { value: 'video', label: 'Video (URL/mp4)' }
            ], fieldLabel: 'Background', fieldTip: 'Hero section background source'
          },
          // Image dropzone (complex — html fallback)
          {
            type: 'html', content:
              '<div id="ts-oce-dropzone-wrap" class="ts-oce-hidden">' +
              '<div class="ts-dropzone" id="ts-oce-dropzone">' +
              '<ion-icon name="cloud-upload-outline" style="font-size:22px;display:block;margin:0 auto var(--ts-sp-2) auto"></ion-icon>' +
              '<span id="ts-oce-drop-label">Drop image or click to upload</span>' +
              '<input type="file" id="ts-oce-bg-file" accept="image/*">' +
              '<img id="ts-oce-dz-preview" class="ts-dz-preview">' +
              '</div>' +
              '<div class="ts-field" style="margin-top:var(--ts-sp-2)">' +
              '<div class="ts-input-group" data-tooltip="...or Paste image URL or Path.">' +
              '<span class="ts-icon ts-input-icon"><i class="fa-regular fa-image"></i></span>' +
              '<input type="text" class="ts-input" id="ts-oce-image-url" placeholder="…or paste image URL" value="assets/img/bg_image.jpg">' +
              '</div>' +
              '</div>' +
              '<div class="ts-card-row" style="margin-top:var(--ts-sp-2)">' +
              '<div class="ts-card-col-half"><div class="ts-field"><div class="ts-toggle-row" data-tooltip="background-attachment: fixed"><span class="ts-toggle-label">Fixed BG</span><label class="ts-toggle"><input type="checkbox" id="ts-oce-bg-fixed"><span class="ts-toggle__knob"></span></label></div></div></div>' +
              '<div class="ts-card-col-half"><div class="ts-field"><div class="ts-toggle-row" data-tooltip="Load random placeholder image"><span class="ts-toggle-label">Random Image</span><label class="ts-toggle"><input type="checkbox" id="ts-oce-random-img"><span class="ts-toggle__knob"></span></label></div></div></div>' +
              '</div>' +
              '</div>'
          },
          // Video controls (complex — html fallback)
          {
            type: 'html', content:
              '<div id="ts-oce-video-wrap" class="ts-oce-hidden">' +
              '<div class="ts-field">' +
              '<div class="ts-input-group ts-input-inset-button" data-tooltip="Paste Video URL (YouTube supported)">' +
              '<span class="ts-icon ts-input-icon"><i class="fa-solid fa-video"></i></span>' +
              '<input type="text" class="ts-input" placeholder="YouTube or mp4 URL" id="ts-oce-video-url">' +
              '<button type="button" class="ts-btn ts-btn--icon ts-btn--primary ts-input-btn" id="ts-oce-video-submit"><i class="fa-solid fa-arrow-right"></i></button>' +
              '</div>' +
              '</div>' +
              '<div class="ts-field" style="margin-top:var(--ts-sp-2)">' +
              '<label style="margin-bottom:var(--ts-sp-1);display:block">Sample Videos</label>' +
              '<div class="ts-grad-swatches" id="ts-oce-video-library" style="gap:var(--ts-sp-1)"></div>' +
              '</div>' +
              '</div>'
          },
          // Canvas gradient controls — structural container, appended directly (no row/col wrapper)
          { type: 'html', content: '<div id="ts-oce-canvas-wrap" class="ts-card-row ts-mt-2"></div>', noWrap: true },
          {
            type: 'range', id: 'ts-oce-canvas-speed', label: 'Animation Speed', min: 0.01, max: 0.3, value: 0.1, step: 0.01, unit: '', tip: 'Gradient blob orbit speed',
            _appendTo: 'ts-oce-canvas-wrap'
          },
          {
            type: 'range', id: 'ts-oce-canvas-blob-size', label: 'Blob Size', min: 0.3, max: 1.2, value: 0.65, step: 0.05, unit: '', tip: 'Radial gradient blob radius',
            _appendTo: 'ts-oce-canvas-wrap'
          },
          // Canvas gradient colors — vertical swatches in 3 third-width columns (short labels)
          {
            type: 'color', fieldLabel: 'Accent', fieldTip: 'Gradient blob 1 (accent-based)', vertical: true,
            swatchId: 'ts-oce-sw-canvas-c1', pickerId: 'ts-oce-canvas-c1-pick',
            hexId: 'ts-oce-canvas-c1-hex', value: '#ff540a',
            third: true, _appendTo: 'ts-oce-canvas-wrap'
          },
          {
            type: 'color', fieldLabel: 'Sec Color', fieldTip: 'Gradient blob 2 (dark variant)', vertical: true,
            swatchId: 'ts-oce-sw-canvas-c2', pickerId: 'ts-oce-canvas-c2-pick',
            hexId: 'ts-oce-canvas-c2-hex', value: '#12141c',
            third: true, _appendTo: 'ts-oce-canvas-wrap'
          },
          {
            type: 'color', fieldLabel: 'BG Color', fieldTip: 'Canvas background fill (optional)', vertical: true,
            swatchId: 'ts-oce-sw-canvas-c3', pickerId: 'ts-oce-canvas-c3-pick',
            hexId: 'ts-oce-canvas-c3-hex', value: '#0c0d12',
            third: true, _appendTo: 'ts-oce-canvas-wrap'
          },
          {
            type: 'button', text: ' Reset Colors', faIcon: 'fa-solid fa-arrow-rotate-left',
            className: 'ts-btn ts-btn--ghost ts-btn--full ts-mt-2',
            id: 'ts-oce-canvas-reset-colors',
            _appendTo: 'ts-oce-canvas-wrap'
          }
        ]
      },
      {
        icon: 'grid-outline', label: 'Line Grid', open: false,
        children: [
          {
            type: 'toggle',
            id: 'ts-oce-line-grid',
            label: 'Enable',
            tip: 'CSS line grid overlay (ba-grid)'
          },
          {
            type: 'range',
            id: 'ts-oce-grid-size',
            label: 'Grid Size',
            min: 10,
            max: 80,
            value: 40,
            step: 5,
            unit: 'px',
            tip: '--ts-grid-size CSS variable',
            showWhen: { id: 'ts-oce-line-grid' },
            bind: {
              var: '--ts-grid-size',
              target: 'hero',
              transform: function (v) { return v + 'px'; }
            }
          }/*,
          { 
            
            type: 'color', 
            fieldLabel: 'Grid Line Color', 
            fieldTip: 'var(--ts-line-color) or #ffffff1a',
            swatchId: 'ts-oce-line-grid-color', 
            pickerId: 'ts-oce-line-grid-color-input', 
            hexId: 'ts-oce-line-color', 
            value: '#ffffff1a',
            showWhen: { id: 'ts-oce-line-grid' }, 
            bind: { 
              var: '--ts-line-color', 
              target: 'hero'
            } 
          }*/,
          {
            type: 'range',
            id: 'ts-oce-grid-line-opacity',
            label: 'Grid Line Opacity',
            min: 0,
            max: 100,
            value: 40,
            step: 1,
            unit: '%',
            tip: 'var(--ts-grid-line-opacity) Layer Opacity',
            showWhen: { id: 'ts-oce-line-grid' },
            bind: {
              var: '--ts-grid-line-opacity',
              target: 'hero',
              transform: function (v) { return v + '%'; }
            }
          }
        ]
      },
      {
        icon: 'apps-outline', label: 'Dot Grid', open: false,
        children: [
          // Enabler (moved outside .ts-card-rows by renderSection)
          { type: 'toggle', id: 'ts-oce-dot-grid', label: 'Enable', tip: 'Animated dot grid overlay (grid-bg)' },
          // Mouse tracking + Animate pair on SAME row
          {
            type: 'toggle', id: 'ts-oce-dot-interactive', label: 'Mouse tracking', tip: 'Dots follow cursor parallax',
            showWhen: { id: 'ts-oce-dot-grid' }, half: true, row: 'dot-modes'
          },
          {
            type: 'toggle', id: 'ts-oce-dot-anim', label: 'Animate', tip: 'Dot drift animation',
            showWhen: { id: 'ts-oce-dot-grid' }, half: true, row: 'dot-modes'
          },
          // Dot appearance
          {
            type: 'range', id: 'ts-oce-dot-size', label: 'Dot Size', min: 1, max: 5, value: 2, step: 0.5, unit: 'px',
            tip: '--ts-dot-size per dot', showWhen: { id: 'ts-oce-dot-grid' },
            bind: { var: '--ts-dot-size', target: 'hero', transform: function (v) { return v + 'px'; } }
          },
          {
            type: 'range', id: 'ts-oce-dot-scale', label: 'Dot Scale', min: 1, max: 2, value: 1, step: 0.1, unit: 'x',
            tip: 'Inner dot layer scale multiplier', showWhen: { id: 'ts-oce-dot-grid' },
            bind: { var: '--ts-dot-scale', target: 'hero' }
          },
          // Dot color + alpha
          {
            type: 'color', fieldLabel: 'Dot Color', fieldTip: '--ts-dot-color override',
            swatchId: 'ts-oce-sw-dot-color', pickerId: 'ts-oce-dot-color-pick',
            hexId: 'ts-oce-dot-color-hex', value: '#ff540a',
            showWhen: { id: 'ts-oce-dot-grid' }
          },
          {
            type: 'range', id: 'ts-oce-dot-alpha', label: 'Dot Alpha', min: 0, max: 1, value: 0.8, step: 0.05, unit: '%',
            tip: 'Dot color transparency', showWhen: { id: 'ts-oce-dot-grid' }
          },
          // Spacing + timing
          {
            type: 'range', id: 'ts-oce-dot-gap', label: 'Dot Gap', min: 30, max: 200, value: 100, step: 10, unit: 'px',
            tip: 'Gap between dot points', showWhen: { id: 'ts-oce-dot-grid' },
            bind: { var: '--ts-point-gap-width', target: 'hero', transform: function (v) { return v + 'px'; } }
          },
          {
            type: 'range', id: 'ts-oce-dot-speed', label: 'Animation Duration', min: 10, max: 100, value: 50, step: 5, unit: 's',
            tip: 'Dot drift period (higher = slower)', showWhen: { id: 'ts-oce-dot-grid' },
            bind: { var: '--ts-dot-speed', target: 'hero', transform: function (v) { return v + 's'; } }
          },
          // Mouse sensitivity (higher = more responsive)
          {
            type: 'range', id: 'ts-oce-dot-sensitivity', label: 'Mouse Sensitivity', min: 10, max: 100, value: 70, step: 5, unit: '',
            tip: 'Higher = more mouse response', showWhen: { id: 'ts-oce-dot-grid' }
          }
        ]
      },
      {
        icon: 'pulse-outline',
        label: 'Grain / Noise',
        open: false,
        children: [
          {
            type: 'toggle',

            id: 'ts-oce-grain',
            label: 'Enable',
            tip: 'SVG noise texture overlay'
          },

          {
            type: 'select',
            id: 'ts-oce-grain-anim', options: [
              {
                value: 'flickered',
                label: 'Flickered', selected: true
              }, {
                value: 'animated',
                label: 'Drift'
              },

              {
                value: 'static',
                label: 'Static'
              },
              {
                value: 'perf',
                label: 'Performance'
              }
            ],
            fieldLabel: 'Animation',
            fieldTip: 'Noise animation style', showWhen: {
              id: 'ts-oce-grain'
            },
            half: true
          },
          {
            type: 'select',
            id: 'ts-oce-grain-preset', options: [
              {
                value: '',
                label: 'Custom', selected: true
              }, {
                value: 'subtle',
                label: 'Subtle'
              },

              {
                value: 'medium',
                label: 'Medium'
              },
              {
                value: 'strong',
                label: 'Strong'
              }
            ],
            fieldLabel: 'Preset',
            fieldTip: 'Quick intensity preset', showWhen: {
              id: 'ts-oce-grain'
            },
            half: true
          },
          {
            type: 'range',
            id: 'ts-oce-grain-opacity',
            label: 'Opacity', min: 0, max: 1, value: 0.6, step: 0.05,
            unit: '',
            tip: 'SVG noise layer opacity',
            showWhen: {
              id: 'ts-oce-grain'
            },
            bind: {
              var: '--ts-grain-opacity',
              target: 'hero'
            }
          },
          {
            type: 'range',
            id: 'ts-oce-grain-scale',
            label: 'Scale', min: 0.5, max: 3, value: 1, step: 0.1,
            unit: '',
            tip: 'Noise texture scale',
            showWhen: {
              id: 'ts-oce-grain'
            },
            bind: {
              var: '--ts-grain-scale',
              target: 'hero'
            },
            half: true
          },
          {
            type: 'range',
            id: 'ts-oce-grain-frequency',
            label: 'Freq', min: 0.2, max: 1.5, value: 0.65, step: 0.05,
            unit: '',
            tip: 'SVG feTurbulence base frequency',
            showWhen: {
              id: 'ts-oce-grain'
            }, bind: {
              var: '--ts-grain-base-frequency',
              target: 'hero'
            }, half: true
          },
          {
            type: 'select',
            id: 'ts-oce-grain-blend', options: [
              {
                value: 'soft-light',
                label: 'Soft Light', selected: true
              }, {
                value: 'overlay',
                label: 'Overlay'
              },
              {
                value: 'multiply',
                label: 'Multiply'
              }, {
                value: 'screen',
                label: 'Screen'
              }, {
                value: 'normal',
                label: 'Normal'
              }
            ],
            fieldLabel: 'Blend',
            fieldTip: 'CSS mix-blend-mode for grain layer', showWhen: {
              id: 'ts-oce-grain'
            }
          }
        ]
      },
      {

        icon: 'color-filter-outline', label: 'Color Overlay', open: false,
        children: [
          { type: 'toggle', id: 'ts-oce-color-overlay', label: 'Enable', tip: 'Color overlay div' },
          {
            type: 'range', id: 'ts-oce-overlay-opacity', label: 'Opacity', min: 0, max: 1, value: 0.8, step: 0.05, unit: '', tip: 'Color overlay mix percentage',
            showWhen: { id: 'ts-oce-color-overlay' }
          },
          {
            type: 'select', id: 'ts-oce-blend-mode', options: [
              { value: 'normal', label: 'Normal', selected: true }, { value: 'multiply', label: 'Multiply' },
              { value: 'overlay', label: 'Overlay' }, { value: 'soft-light', label: 'Soft Light' },
              { value: 'hard-light', label: 'Hard Light' }, { value: 'screen', label: 'Screen' }
            ], fieldLabel: 'Blend Mode', fieldTip: 'CSS mix-blend-mode for overlay', showWhen: { id: 'ts-oce-color-overlay' }
          },
          {
            type: 'range', id: 'ts-oce-backdrop-blur', label: 'Backdrop Blur', min: 0, max: 20, value: 0, step: 1, unit: 'px', tip: 'CSS backdrop-filter blur radius',
            showWhen: { id: 'ts-oce-color-overlay' }
          }
        ]
      },
      {
        icon: 'ellipsis-horizontal-outline', label: 'Pattern Overlay', open: false,
        children: [
          // Enabler toggle — moved outside .ts-card-rows by renderSection
          { type: 'toggle', id: 'ts-oce-pattern-enabled', label: 'Enable', tip: 'CSS background-image pattern overlay' },
          // Pattern type — uses ts-pattern-* classes from ts-patterns.css (merged into toolskin.css)
          {
            type: 'select', id: 'ts-oce-pattern-type', options: [
              { value: 'dots', label: 'Dots', selected: true },
              { value: 'dots-dense', label: 'Dots Dense' },
              { value: 'grid', label: 'Grid' },
              { value: 'grid-bold', label: 'Grid Bold' },
              { value: 'diagonal-stripes', label: 'Diagonal Stripes' },
              { value: 'circles-grid', label: 'Circles Grid' },
              { value: 'cross', label: 'Cross' },
              { value: 'checkerboard', label: 'Checkerboard' },
              { value: 'zigzag', label: 'Zigzag' }
            ], fieldLabel: 'Type', fieldTip: 'Pattern style (ts-pattern-* classes)',
            showWhen: { id: 'ts-oce-pattern-enabled' }
          },
          {
            type: 'range', id: 'ts-oce-pattern-scale', label: 'Scale', min: 1, max: 3, value: 1, step: 0.25, unit: 'x',
            tip: 'Pattern scale multiplier (min 1x)', showWhen: { id: 'ts-oce-pattern-enabled' }
          },
          {
            type: 'range', id: 'ts-oce-pattern-opacity', label: 'Opacity', min: 0, max: 100, value: 40, step: 5, unit: '%',
            tip: 'Pattern layer opacity (0-100)', showWhen: { id: 'ts-oce-pattern-enabled' }
          },
          // Pattern color — uses --ts-pattern-color (same as generator)
          {
            type: 'color', fieldLabel: 'Pattern Color', fieldTip: '--ts-pattern-color (accent default)',
            swatchId: 'ts-oce-sw-pattern-color', pickerId: 'ts-oce-pattern-color-pick',
            hexId: 'ts-oce-pattern-color-hex', value: '#ff540a',
            showWhen: { id: 'ts-oce-pattern-enabled' }
          }
        ]
      }
    ];
    var heroPane = renderTab(heroSchema);

    /* ── THEME TAB — Schema-driven (Phase 2) ── */
    // Surface cards — defined here, appended to colorsSchema below
    var _surfaceSystemCard = {
      icon: 'layers-outline', label: 'Surface System', open: false,
      children: [
        { type: 'range', id: 'ts-oce-surface-contrast', label: 'Surface Contrast', min: 0, max: 100, value: 35, step: 1, unit: '%', tip: 'Text + surface luminance spread' },
        { type: 'select', id: 'ts-oce-surface-preset', options: [{ value: '', label: '— select —', selected: true }], fieldLabel: 'Surface Presets', fieldTip: 'Curated surface color ramps' },
        { type: 'button', text: ' Reset Surface Presets', icon: 'refresh', className: 'ts-btn ts-btn--ghost ts-btn--full', id: 'ts-oce-reset-surfaces' }
      ]
    };
    var _surfaceExportCard = {
      icon: 'download-outline', label: 'Surface Token Export', open: false,
      children: [
        { type: 'toggle', id: 'ts-oce-export-computed', label: 'Include computed :root snapshot', tip: 'Add resolved values alongside token names' },
        { type: 'button', text: ' Refresh', icon: 'refresh', className: 'ts-btn ts-btn--secondary ts-btn--full', id: 'ts-oce-export-refresh', half: true },
        { type: 'button', text: ' Copy', icon: 'copy', className: 'ts-btn ts-btn--secondary ts-btn--full', id: 'ts-oce-export-copy', half: true },
        {
          type: 'textarea', id: 'ts-oce-export-area', readonly: true, className: 'ts-input-text', rows: 8,
          style: { width: '100%', minHeight: '10rem', fontSize: '11px', lineHeight: '1.4', fontFamily: 'var(--ts-font-mono)', resize: 'vertical' }
        }
      ]
    };

    var themeSchema = [
      {
        icon: 'moon-outline', label: 'Theme Mode', open: true,
        children: [
          { type: 'button', text: ' Dark', icon: 'moon', className: 'ts-btn ts-btn--secondary ts-btn--sm', dataset: { tsOceTheme: 'dark' }, half: true, row: 'mode' },
          { type: 'button', text: ' Light', icon: 'sunny', className: 'ts-btn ts-btn--outline ts-btn--sm', dataset: { tsOceTheme: 'light' }, half: true, row: 'mode' },
          { type: 'toggle', id: 'ts-oce-auto-theme', label: 'Auto-detect from system', tip: 'Match OS prefers-color-scheme', row: 'mode' },
          { type: 'button', text: ' Reset to Default', faIcon: 'fa-solid fa-arrow-rotate-left', className: 'ts-btn ts-btn--ghost ts-btn--full', dataset: { tsOceResetTheme: '' } }
        ]
      },
      {
        icon: 'options-outline', label: 'Global Options', open: false,
        children: [
          { type: 'toggle', id: 'ts-oce-smooth-scroll', label: 'Smooth', tip: 'Lenis smooth scroll', half: true },
          { type: 'toggle', id: 'ts-oce-tooltips', label: 'Tooltips', tip: 'Enable/disable tooltips sitewide', half: true },
          { type: 'toggle', id: 'ts-oce-glass-morph', label: 'Glass', tip: 'Backdrop blur on cards/panels', half: true },
          { type: 'toggle', id: 'ts-oce-reduce-motion', label: 'Low Motion', tip: 'Disable all animations', half: true }
        ]
      },
      {
        icon: 'finger-print-outline', label: 'Custom Cursor', open: false,
        children: [
          // Enabler toggle — moved outside .ts-card-rows because sub-controls have showWhen
          { type: 'toggle', id: 'ts-oce-cursor-enabled', label: 'Enable Cursor', tip: 'Toggle custom cursor' },
          {
            type: 'select', id: 'ts-oce-cursor-mode', options: [
              { value: 'simple', label: 'Simple', selected: true },
              { value: 'tooltip', label: 'Tooltip' }
            ], fieldLabel: 'Mode', fieldTip: 'Simple dot or tooltip-label cursor',
            showWhen: { id: 'ts-oce-cursor-enabled' }
          },
          {
            type: 'range', id: 'ts-oce-cursor-size', label: 'Size', min: 10, max: 60, value: 20, step: 2, unit: 'px', tip: '--ts-cursor-size CSS variable',
            bind: { var: '--ts-cursor-size', target: 'root', transform: function (v) { return v + 'px'; } },
            half: true, row: 'cur-dims', showWhen: { id: 'ts-oce-cursor-enabled' }
          },
          {
            type: 'range', id: 'ts-oce-cursor-grow', label: 'Grow', min: 1, max: 5, value: 3, step: 0.5, unit: '', tip: 'Scale factor on hover',
            bind: { var: '--ts-cursor-grow', target: 'root' },
            half: true, row: 'cur-dims', showWhen: { id: 'ts-oce-cursor-enabled' }
          },
          {
            type: 'toggle', id: 'ts-oce-cursor-follower', label: 'Follower Ring', tip: 'Show trailing follower',
            showWhen: { id: 'ts-oce-cursor-enabled' }
          },
          {
            type: 'range', id: 'ts-oce-cursor-easing', label: 'Easing', min: 0.1, max: 1, value: 0.42, step: 0.05, unit: '', tip: 'Lerp factor — lower = more lag',
            showWhen: { id: 'ts-oce-cursor-enabled' }
          }
        ]
      },
      // ── Layout controls (merged from former Layout tab) ──
      {
        icon: 'square-outline', label: 'Border Radius', open: false,
        children: [
          { type: 'range', id: 'ts-oce-radius', label: 'Radius', min: 0, max: 50, value: 10, step: 1, unit: 'px', tip: '--ts-radius-base global token' },
          { type: 'button', text: 'Sharp', className: 'ts-btn ts-btn--ghost ts-btn--full', dataset: { tsOceRadiusPreset: '0' }, third: true },
          { type: 'button', text: 'Soft', className: 'ts-btn ts-btn--ghost ts-btn--full', dataset: { tsOceRadiusPreset: '6' }, third: true },
          { type: 'button', text: 'Round', className: 'ts-btn ts-btn--ghost ts-btn--full', dataset: { tsOceRadiusPreset: '16' }, third: true }
        ]
      },
      {
        icon: 'radio-button-on-outline', label: 'Button Controls', open: false,
        children: [
          {
            type: 'range', id: 'ts-oce-btn-base', label: 'Button Size', min: 30, max: 56, value: 42, step: 1, unit: '', tip: '--ts-btn-base height unit',
            bind: { var: '--ts-btn-base', target: 'editor' }
          },
          {
            type: 'range', id: 'ts-oce-btn-radius', label: 'Button Radius', min: 0, max: 30, value: 8, step: 1, unit: 'px', tip: 'Button-specific border-radius',
            bind: { var: '--ts-btn-radius', target: 'editor', transform: function (v) { return v + 'px'; } }
          }
        ]
      },
      {
        icon: 'resize-outline', label: 'Global Spacing', open: false,
        children: [
          { type: 'range', id: 'ts-oce-spacing-base', label: 'Base Spacing', min: 2, max: 8, value: 4, step: 1, unit: 'px', tip: '--ts-sp-base multiplier root' },
          { type: 'range', id: 'ts-oce-type-scale', label: 'Type Scale', min: 0.8, max: 1.3, value: 1, step: 0.05, unit: '', tip: 'Multiplier for --ts-fs-base' }
        ]
      },
      {
        icon: 'text-outline', label: 'Typography', open: false,
        children: [
          { type: 'fontSelect', id: 'ts-oce-font-display', fonts: BANNER_FONTS, fieldLabel: 'Display Font', fieldTip: '--ts-font-display headings & hero' },
          { type: 'fontSelect', id: 'ts-oce-font-body', fonts: BODY_FONTS, fieldLabel: 'Body Font', fieldTip: '--ts-font-body paragraphs & UI' }
        ]
      }
    ];
    var themePane = renderTab(themeSchema);

    /* ── PRELOADER TAB — standalone (was inside Theme) ── */
    var preloaderSchema = [
      {
        icon: 'hourglass-outline', label: 'Preloader', open: true,
        children: [
          { type: 'toggle', id: 'ts-oce-preloader-show', label: 'Preview Preloader', tip: 'Lock preloader visible for editing' },
          {
            type: 'select', id: 'ts-oce-preloader-preset', options: [
              { value: 'brand-box', label: 'Brand Box', selected: true },
              { value: 'minimal-bar', label: 'Minimal Bar' },
              { value: 'spinner', label: 'Spinner' },
              { value: 'text-only', label: 'Text Only' }
            ], fieldLabel: 'Preset', fieldTip: 'Preloader layout variant', showWhen: { id: 'ts-oce-preloader-show' }
          },
          {
            type: 'button', text: ' Simulate', icon: 'play', className: 'ts-btn ts-btn--secondary ts-btn--full',
            id: 'ts-oce-preloader-simulate', half: true, row: 'pre-sim',
            showWhen: { id: 'ts-oce-preloader-show' }
          },
          {
            type: 'range', id: 'ts-oce-preloader-hold', label: 'Hold', min: 500, max: 8000, value: 3000, step: 250, unit: 'ms',
            tip: 'How long preloader stays before dismissing',
            half: true, row: 'pre-sim',
            showWhen: { id: 'ts-oce-preloader-show' }
          },
          {
            type: 'range', id: 'ts-oce-preloader-bar-height', label: 'Bar Height', min: 1, max: 20, value: 5, step: 1, unit: 'px',
            tip: '--ts-preloader-bar-height',
            bind: { var: '--ts-preloader-bar-height', target: 'preloader', transform: function (v) { return v + 'px'; } },
            showWhen: { id: 'ts-oce-preloader-show' }
          },
          {
            type: 'select', id: 'ts-oce-preloader-bar-pos', options: [
              { value: 'bottom', label: 'Bottom', selected: true },
              { value: 'top', label: 'Top' }
            ], fieldLabel: 'Bar Position', fieldTip: 'Position for Minimal Bar variant',
            showWhen: { id: 'ts-oce-preloader-show' }
          },
          {
            type: 'textInput', id: 'ts-oce-preloader-logo-text', placeholder: 'TOOLSKIN', value: 'TOOLSKIN',
            fieldLabel: 'Logo Text', fieldTip: 'Brand logo text',
            showWhen: { id: 'ts-oce-preloader-show' }
          },
          {
            type: 'textInput', id: 'ts-oce-preloader-hint', placeholder: 'Loading…', value: 'Loading Toolskin showcase',
            fieldLabel: 'Hint Text', fieldTip: 'Text shown below progress bar',
            showWhen: { id: 'ts-oce-preloader-show' }
          },
          {
            type: 'range', id: 'ts-oce-preloader-overlay', label: 'Overlay Opacity', min: 0, max: 1, value: 0.88, step: 0.05, unit: '%',
            tip: 'Background overlay darkness',
            showWhen: { id: 'ts-oce-preloader-show' }
          }
        ]
      }
    ];
    var preloaderPane = renderTab(preloaderSchema);

    /* ── COLORS TAB — Schema-driven (Phase 2) ── */
    var PRESET_COLORS = [
      '#ff540a', '#00e5ff', '#2efc86', '#a855f7', '#f7931a', '#ec4899',
      '#7c3aed', '#3b82f6', '#10b981', '#f97316', '#f43f5e', '#ef4444',
      '#06b6d4', '#84cc16', '#64748b'
    ];
    var SURFACE_VARS = ['bg-body', 'bg-0', 'bg-1', 'bg-2', 'bg-3', 'bg-4', 'bg-5'];

    var colorsSchema = [
      {
        icon: 'color-palette-outline', label: 'Global Colors', open: true,
        children: [
          {

            type: 'color', fieldLabel: 'Accent Color', fieldTip: '--ts-accent-h/s/l base hue',
            swatchId: 'ts-sw-accent', pickerId: 'ts-input-accent-color', hexId: 'ts-oce-accent', value: '#ff540a'
          },
          /* TODO: add a ts-hint component type for swatch descriptions */
          { type: 'swatchGrid', colors: PRESET_COLORS },
          {
            type: 'button', text: ' Random Color', icon: 'shuffle', className: 'ts-btn ts-btn--secondary ts-btn--full',
            dataset: { tsOceRandomColor: '' }
          }
        ]
      },
      {
        icon: 'color-wand-outline', label: 'Surface Colors', open: false,
        children: (function () {
          var items = [];
          for (var si = 0; si < SURFACE_VARS.length; si += 2) {
            items.push({ type: 'surfaceColor', name: SURFACE_VARS[si], label: SURFACE_VARS[si], varName: '--ts-' + SURFACE_VARS[si], half: true });
            if (SURFACE_VARS[si + 1]) {
              items.push({ type: 'surfaceColor', name: SURFACE_VARS[si + 1], label: SURFACE_VARS[si + 1], varName: '--ts-' + SURFACE_VARS[si + 1], half: true });
            }
          }
          items.push({ type: 'button', text: ' Reset Colors', faIcon: 'fa-solid fa-arrow-rotate-left', className: 'ts-btn ts-btn--ghost ts-btn--full', id: 'ts-oce-reset-surface-colors' });
          return items;
        })()
      }
    ];
    // Append surface system + token export cards (moved from Theme)
    colorsSchema.push(_surfaceSystemCard);
    colorsSchema.push(_surfaceExportCard);
    var colorsPane = renderTab(colorsSchema);

    /* ── Assemble ── */
    panel.innerHTML =
      '<div id="ts-panel">' +
      '<div id="ts-panel-tabs">' +
      '<div class="ts-ptab active" data-tab="hero">Hero</div>' +
      '<div class="ts-ptab" data-tab="theme">Theme</div>' +
      '<div class="ts-ptab" data-tab="colors">Colors</div>' +
      '<div class="ts-ptab" data-tab="preloader">Preloader</div>' +
      '</div>' +
      '<div id="ts-panel-body" data-lenis-prevent>' +
      '<div class="ts-tab-pane active" data-pane="hero"></div>' +
      '<div class="ts-tab-pane" data-pane="theme"></div>' +
      '<div class="ts-tab-pane" data-pane="colors"></div>' +
      '<div class="ts-tab-pane" data-pane="preloader"></div>' +
      '</div>' +
      '<div id="ts-panel-footer">' +
      '<button class="ts-btn ts-btn--primary" id="ts-oce-footer-save" data-tooltip="Export Current Preview Live edit settings to an Importable .json File" data-tooltip-pos="top">' +
      '<i class="ts-icon fa-regular fa-floppy-disk"></i>' +
      '<span>Save Setup</span>' +
      '</button>' +
      '<button class="ts-btn ts-btn--secondary" id="ts-oce-footer-reset" data-tooltip="Reset all to defaults" data-tooltip-pos="top">' +
      '<i class="ts-icon fa-solid fa-arrow-rotate-left"></i>' +
      '<span>Reset all</span>' +
      '</button>' +
      '<button class="ts-btn ts-btn--ghost ts-btn--icon" id="ts-oce-footer-copy" data-tooltip="Copy settings to clipboard" data-tooltip-pos="top">' +
      '<i class="ts-icon fa-solid fa-clipboard"></i>' +
      '<span class="sr-only">Copy to clipboard</span>' +
      '</button>' +
      '</div>' +
      '</div>';

    // Append schema-rendered tab content
    var heroTabPane = panel.querySelector('[data-pane="hero"]');
    if (heroTabPane) heroTabPane.appendChild(heroPane);
    var themeTabPane = panel.querySelector('[data-pane="theme"]');
    if (themeTabPane) themeTabPane.appendChild(themePane);
    var colorsTabPane = panel.querySelector('[data-pane="colors"]');
    if (colorsTabPane) colorsTabPane.appendChild(colorsPane);
    var preloaderTabPane = panel.querySelector('[data-pane="preloader"]');
    if (preloaderTabPane) preloaderTabPane.appendChild(preloaderPane);

    root.appendChild(overlay);
    root.appendChild(panel);
    panel.appendChild(fab);
    return { fab: fab, overlay: overlay, panel: panel, schemas: { hero: heroSchema, theme: themeSchema, colors: colorsSchema, preloader: preloaderSchema } };
  }

  /* ═══ EVENT BINDING ═══ */
  function bind(ui) {
    var fab = ui.fab, overlay = ui.overlay, panel = ui.panel;

    // Init UIKit selects inside panel
    if (global.ToolskinUIKit && typeof global.ToolskinUIKit.init === 'function') {
      global.ToolskinUIKit.init(panel);
    }

    // ── Conditional visibility: class-based .ts-oce-hidden system ──
    // Propagates hidden state up from conditional → column → row
    function propagateHidden(block) {
      var col = block.closest('[class*="ts-card-col-"]');
      if (!col) return;
      // Column hidden if ALL direct children are hidden
      var allChildrenHidden = Array.prototype.every.call(col.children, function (ch) {
        return ch.classList.contains('ts-oce-hidden') || ch.classList.contains('ts-oce-empty');
      });
      col.classList.toggle('ts-oce-hidden', allChildrenHidden);
      var row = col.closest('.ts-card-row');
      if (!row) return;
      var visibleCols = row.querySelectorAll(':scope > [class*="ts-card-col-"]:not(.ts-oce-hidden)');
      row.classList.toggle('ts-oce-hidden', visibleCols.length === 0);
    }

    function syncConditionals() {
      // Toggle-based: data-requires="toggle-id"
      panel.querySelectorAll('.ts-oce-conditional[data-requires]').forEach(function (block) {
        var toggleId = block.getAttribute('data-requires');
        var toggle = panel.querySelector('#' + toggleId);
        var hidden = toggle ? !toggle.checked : true;
        block.classList.toggle('ts-oce-hidden', hidden);
        block.style.removeProperty('display'); // clean up any legacy inline display
        propagateHidden(block);
      });
      // Select-based: data-requires-select="select-id" data-requires-not="value"
      panel.querySelectorAll('.ts-oce-conditional[data-requires-select]').forEach(function (block) {
        var selId = block.getAttribute('data-requires-select');
        var notVal = block.getAttribute('data-requires-not');
        var selEl = panel.querySelector('#' + selId);
        var hidden = selEl ? (selEl.value === notVal) : true;
        block.classList.toggle('ts-oce-hidden', hidden);
        block.style.removeProperty('display');
        propagateHidden(block);
      });
    }
    // Bind all toggles to sync conditionals
    panel.querySelectorAll('.ts-oce-conditional').forEach(function (block) {
      var reqId = block.getAttribute('data-requires');
      var selId = block.getAttribute('data-requires-select');
      if (reqId) {
        var t = panel.querySelector('#' + reqId);
        if (t) t.addEventListener('change', syncConditionals);
      }
      if (selId) {
        var s = panel.querySelector('#' + selId);
        if (s) s.addEventListener('change', syncConditionals);
      }
    });
    // Active state: add ts-oce-active to cards whose feature is enabled
    function syncActiveStates() {
      panel.querySelectorAll('.ts-oce-conditional[data-requires]').forEach(function (block) {
        var toggleId = block.getAttribute('data-requires');
        var toggle = panel.querySelector('#' + toggleId);
        var card = block.closest('.ts-card');
        if (toggle && card) card.classList.toggle('ts-oce-active', toggle.checked);
      });
    }
    // Bind active state sync to same toggles
    panel.querySelectorAll('.ts-oce-conditional[data-requires]').forEach(function (block) {
      var t = panel.querySelector('#' + block.getAttribute('data-requires'));
      if (t) t.addEventListener('change', syncActiveStates);
    });

    // Initial sync
    syncConditionals();
    syncActiveStates();

    var accentInput = panel.querySelector('#ts-oce-accent');
    var accentColorInput = panel.querySelector('#ts-input-accent-color');
    var accentSwatch = panel.querySelector('#ts-sw-accent');
    var tabs = panel.querySelectorAll('.ts-ptab');
    var panes = panel.querySelectorAll('.ts-tab-pane');

    /* ── Range slider update (sets --ts-range-percent for fill + display text) ── */
    function updateRange(el) {
      var min = parseFloat(el.min) || 0;
      var max = parseFloat(el.max) || 100;
      var val = parseFloat(el.value) || min;
      var pct = max !== min ? ((val - min) / (max - min)) * 100 : 0;
      // CSS fill vars
      el.style.setProperty('--ts-range-val', val);
      el.style.setProperty('--ts-range-min', min);
      el.style.setProperty('--ts-range-max', max);
      el.style.setProperty('--ts-range-percent', pct + '%');
      // Text display
      var span = el.parentNode.querySelector('.ts-range-val');
      if (!span) return;
      var unit = el.getAttribute('data-unit') || '';
      if (unit === '%') {
        // If max<=1 treat as fraction (0.85 → 85%), otherwise treat as already-percent (85 → 85%)
        if (max <= 1) {
          span.textContent = Math.round(val * 100) + '%';
        } else {
          span.textContent = Math.round(val) + '%';
        }
      } else {
        span.textContent = (Math.round(val * 100) / 100) + unit;
      }
    }

    /* ── Open / close ── */
    function setOpen(open) {
      fab.setAttribute('aria-expanded', open ? 'true' : 'false');
      overlay.classList.toggle('ts-oce--open', open);
      panel.classList.toggle('ts-oce--open', open);
      store('open', open ? '1' : '0');
    }

    /* ── Tabs ── */
    function switchTab(name) {
      tabs.forEach(function (t) { t.classList.toggle('active', t.dataset.tab === name); });
      panes.forEach(function (p) { p.classList.toggle('active', p.dataset.pane === name); });
      store('tab', name);
      if (name === 'hero') {
        var h = document.querySelector('#top, .ts-hero');
        if (h) h.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }

    /* ── Color sync ── */
    function syncColor(hex) {
      if (accentInput) accentInput.value = hex;
      if (accentColorInput) accentColorInput.value = hex;
      if (accentSwatch) accentSwatch.style.background = hex;
    }

    /* ── Hero ref ── */
    function getHero() { return document.querySelector('.ts-hero, #top'); }

    /* ── Init current values ── */
    function initValues() {
      syncColor(getCurrentAccentHex());
      var hero = getHero();
      if (hero) {
        // Effects layer classes (grain + grid are on .ts-effects-layer, not section)
        var layer = hero.querySelector('.ts-effects-layer');
        function syncToggle(id, cls, target) {
          var el = panel.querySelector('#' + id);
          if (el) el.checked = (target || hero).classList.contains(cls);
        }
        syncToggle('ts-oce-line-grid', 'ba-grid', layer);
        // Dot grid classes are on BOTH the section and the dot-grid-layer
        syncToggle('ts-oce-dot-grid', 'grid-bg', hero);
        syncToggle('ts-oce-dot-interactive', 'interactive', hero);
        syncToggle('ts-oce-dot-anim', 'anim', hero);
        var grainLayer = hero.querySelector('.ts-grain-layer');
        syncToggle('ts-oce-grain', 'ts-grain', grainLayer);
        // Color overlay
        var ovt = panel.querySelector('#ts-oce-color-overlay');
        var colorOvLayer = hero.querySelector('.ts-color-overlay-layer');
        if (ovt) ovt.checked = colorOvLayer && !colorOvLayer.classList.contains('ts-oce-hidden');
      }
      // Smooth scroll
      var st = panel.querySelector('#ts-oce-smooth-scroll');
      if (st && global.Toolskin && global.Toolskin.smooth && global.Toolskin.smooth.lenis) st.checked = true;
      // Cursor follower — sync toggle with config default (follower: true)
      var fol = panel.querySelector('#ts-oce-cursor-follower');
      if (fol && global.Toolskin && global.Toolskin.config && global.Toolskin.config.cursor) {
        fol.checked = global.Toolskin.config.cursor.follower !== false;
      }
      // Init all range fills
      panel.querySelectorAll('input.ts-range').forEach(updateRange);
      // Propagate hidden state for bg-mode wraps (dropzone/video/canvas)
      panel.querySelectorAll('.ts-oce-hidden').forEach(propagateHidden);
    }

    /* ── Panel isolation: force dark tokens on the panel ── */
    var DARK_TOKENS = {
      '--ts-bg-body': '#0c0d0f', '--ts-bg-0': '#111214', '--ts-bg-1': '#17181b',
      '--ts-bg-2': '#1f2024', '--ts-bg-3': '#28292e', '--ts-bg-4': '#323439', '--ts-bg-5': '#3e4045',
      '--ts-bg-1-t': 'color-mix(in srgb,#17181b,transparent 30%)',
      '--ts-bg-2-t': 'color-mix(in srgb,#1f2024,transparent 40%)',
      '--ts-text-primary': '#e8e9ea', '--ts-text-secondary': '#9ea0a5', '--ts-text-muted': '#6d6f74',
      '--ts-border-0': 'color-mix(in srgb,#fff,transparent 94%)',
      '--ts-border-1': 'color-mix(in srgb,#fff,transparent 90%)',
      '--ts-border-2': 'color-mix(in srgb,#fff,transparent 84%)',
      '--ts-sp-base': '4px',
      '--ts-radius-base': '8px',
      '--ts-radius-scale': '1',
      '--ts-fs-base': '15px',
      '--ts-font-display': '"Space Grotesk",system-ui,sans-serif',
      '--ts-font-body': '"Space Grotesk",system-ui,sans-serif'
    };
    // Also lock spacing so panel layout doesn't break
    for (var i = 1; i <= 24; i++) DARK_TOKENS['--ts-sp-' + i] = (4 * i) + 'px';

    function isolatePanel() {
      Object.keys(DARK_TOKENS).forEach(function (k) { panel.style.setProperty(k, DARK_TOKENS[k]); });
      panel.style.setProperty('color-scheme', 'dark');
    }
    isolatePanel();

    // Re-isolate on theme changes only (NOT style — that fires on every range input)
    new MutationObserver(function () { isolatePanel(); })
      .observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'data-ts-theme'] });

    /* ═══════════════════ EVENTS ═══════════════════ */

    fab.addEventListener('click', function () { setOpen(!panel.classList.contains('ts-oce--open')); });
    // Close on Escape key (overlay no longer blocks clicks)
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && panel.classList.contains('ts-oce--open')) setOpen(false);
    });
    // Enable / disable outside click close
    var enableOutsideClickClose = true;

    document.addEventListener('click', function (e) {
      if (!enableOutsideClickClose) return;

      // Only act if panel is open
      if (!panel.classList.contains('ts-oce--open')) return;

      // If click is NOT inside panel AND NOT the FAB button → close
      if (!panel.contains(e.target) && !fab.contains(e.target)) {
        setOpen(false);
      }
    });

    tabs.forEach(function (t) { t.addEventListener('click', function () { switchTab(this.dataset.tab); }); });

    // Accordion (banner generator: one open per pane)
    panel.querySelectorAll('.ts-card-header.ts-accordion').forEach(function (hdr) {
      hdr.addEventListener('click', function () {
        var c = this.closest('.ts-card'), pane = c ? c.closest('.ts-tab-pane') : null;
        if (pane) pane.querySelectorAll('.ts-card').forEach(function (oc) {
          if (oc !== c) { var oh = oc.querySelector('.ts-card-header.ts-accordion'); if (oh) oh.classList.remove('open'); }
        });
        this.classList.toggle('open');
      });
    });

    /* ── HERO ── */
    var bgTypeSelect = panel.querySelector('#ts-oce-bg-type');
    var dzWrap = panel.querySelector('#ts-oce-dropzone-wrap');
    var bgFile = panel.querySelector('#ts-oce-bg-file');
    var dzPreview = panel.querySelector('#ts-oce-dz-preview');
    var imgUrlInput = panel.querySelector('#ts-oce-image-url');
    var dropzone = panel.querySelector('#ts-oce-dropzone');

    function applyHeroBg(url) {
      var hero = getHero();
      if (!hero || !url) return;
      hero.style.backgroundImage = 'url(' + url + ')';
      hero.style.backgroundSize = 'cover';
      hero.style.backgroundPosition = 'center';
      var c = hero.querySelector('canvas');
      if (c) c.style.display = 'none';
      hero.classList.remove('gradient-canvas');
    }

    function loadFile(file) {
      if (!file || !file.type.startsWith('image/')) return;
      var reader = new FileReader();
      reader.onload = function (e) {
        if (dzPreview) { dzPreview.src = e.target.result; dzPreview.style.display = 'block'; }
        applyHeroBg(e.target.result);
      };
      reader.readAsDataURL(file);
    }

    var videoWrap = panel.querySelector('#ts-oce-video-wrap');

    /** Clean up ALL bg mode assets, then set up the selected mode */
    function switchBgMode(mode) {
      var hero = getHero();
      if (!hero) return;

      // 1. CLEAN UP everything from previous mode
      // Canvas — destroy instance and remove element
      if (global.tsGradient && mode !== 'canvas-gradient') {
        if (typeof global.tsGradient.pause === 'function') global.tsGradient.pause();
        global.tsGradient = null;
      }
      var canvas = hero.querySelector('canvas');
      if (canvas && mode !== 'canvas-gradient') canvas.remove();
      hero.classList.remove('gradient-canvas');
      // Image bg
      hero.style.backgroundImage = '';
      hero.style.backgroundSize = '';
      hero.style.backgroundPosition = '';
      hero.style.backgroundAttachment = '';
      // Video
      var vid = hero.querySelector('.ts-oce-video-bg');
      if (vid) vid.remove();
      // Parallax layer
      hero.removeAttribute('data-ts-parallax');
      var pLayer = hero.querySelector('[data-ts-parallax-bg]');
      if (pLayer) pLayer.remove();

      // 2. SHOW/HIDE panel wraps using ts-oce-hidden class + propagate
      var canvasWrap = panel.querySelector('#ts-oce-canvas-wrap');
      [dzWrap, videoWrap, canvasWrap].forEach(function (wrap) {
        if (!wrap) return;
        var show = (wrap === dzWrap && mode === 'image') ||
          (wrap === videoWrap && mode === 'video') ||
          (wrap === canvasWrap && mode === 'canvas-gradient');
        wrap.classList.toggle('ts-oce-hidden', !show);
        wrap.style.removeProperty('display');
        propagateHidden(wrap);
      });

      // 3. SET UP new mode
      if (mode === 'canvas-gradient') {
        hero.classList.add('gradient-canvas');
        // Create new canvas instance if not already running
        if (!global.tsGradient) {
          var theme = document.documentElement.getAttribute('data-theme') || 'dark';
          global.tsGradient = new TSGradientCanvas({
            containerId: hero.id || null,
            speed: 0.1,
            theme: theme,
            fadeIn: true,
            fadeDuration: 1,
          });
        }
      }
      // Image mode: dropzone/URL handlers will apply the image when user provides one
      // Video mode: URL handler will create <video> when user provides URL
    }

    if (bgTypeSelect) bgTypeSelect.addEventListener('change', function () {
      switchBgMode(this.value);
    });

    // Dropzone handlers
    if (dropzone) {
      dropzone.addEventListener('dragover', function (e) { e.preventDefault(); this.classList.add('drag'); });
      dropzone.addEventListener('dragleave', function () { this.classList.remove('drag'); });
      dropzone.addEventListener('drop', function (e) { e.preventDefault(); this.classList.remove('drag'); var f = e.dataTransfer.files[0]; if (f) loadFile(f); });
    }
    if (bgFile) bgFile.addEventListener('change', function () { if (this.files[0]) loadFile(this.files[0]); });
    if (imgUrlInput) imgUrlInput.addEventListener('input', function () { var u = this.value.trim(); if (u) applyHeroBg(u); });

    // Video background — create on Enter/blur, not on every keystroke
    var videoUrlInput = panel.querySelector('#ts-oce-video-url');
    function applyVideoUrl() {
      var hero = getHero(); if (!hero || !videoUrlInput) return;
      var url = videoUrlInput.value.trim(); if (!url) return;
      // Remove existing video
      var old = hero.querySelector('.ts-oce-video-bg');
      if (old) old.remove();

      // Check if YouTube URL — extract embed
      var ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&?#]+)/);
      if (ytMatch) {
        var iframe = document.createElement('iframe');
        iframe.className = 'ts-oce-video-bg';
        iframe.src = 'https://www.youtube.com/embed/' + ytMatch[1] + '?autoplay=1&mute=1&loop=1&playlist=' + ytMatch[1] + '&controls=0&showinfo=0&rel=0&modestbranding=1';
        iframe.allow = 'autoplay; encrypted-media';
        iframe.frameBorder = '0';
        iframe.style.cssText = 'position:absolute;inset:-20%;width:140%;height:140%;border:none;z-index:0;pointer-events:none';
        hero.insertBefore(iframe, hero.firstChild);
      } else {
        // Direct video file (mp4, webm, etc.)
        var video = document.createElement('video');
        video.className = 'ts-oce-video-bg';
        video.autoplay = true;
        video.loop = true;
        video.muted = true;
        video.playsInline = true;
        video.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:0;pointer-events:none';
        video.src = url;
        video.addEventListener('error', function () { toast('Video failed to load', 'error'); });
        hero.insertBefore(video, hero.firstChild);
      }
      toast('Video background applied', 'success');
    }
    // Submit button triggers video apply
    var videoSubmitBtn = panel.querySelector('#ts-oce-video-submit');
    if (videoSubmitBtn) videoSubmitBtn.addEventListener('click', applyVideoUrl);

    // Also make ALL ts-input-inset-button submit buttons work generically
    panel.querySelectorAll('.ts-input-inset-button .ts-input-btn').forEach(function (btn) {
      if (btn === videoSubmitBtn) return; // already bound
      btn.addEventListener('click', function () {
        var group = this.closest('.ts-input-group');
        var input = group ? group.querySelector('input.ts-input, input[type="text"]') : null;
        if (input) input.dispatchEvent(new Event('change', { bubbles: true }));
      });
    });

    // Video sample library
    var VIDEO_LIBRARY = [
      { id: 'DolDgWo-cUA', label: 'Aerial Ocean Waves' },
      { id: 'QAEjv3h_LQ0', label: 'Abstract Particles' },
      { id: '6ek4ZAWRj8c', label: 'Neon City Lights' },
      { id: 'B1WKNL3CgVc', label: 'Smoke & Light' },
      { id: 'X-HL-r5TOiU', label: 'Night Sky Stars' }
    ];
    var videoLibrary = panel.querySelector('#ts-oce-video-library');
    if (videoLibrary && videoUrlInput) {
      VIDEO_LIBRARY.forEach(function (v) {
        var thumb = document.createElement('div');
        thumb.className = 'ts-grad-swatch ts-img-swatch video';
        thumb.style.cssText = 'background-image:url(https://img.youtube.com/vi/' + v.id + '/default.jpg)';
        thumb.setAttribute('data-tooltip', v.label);
        thumb.addEventListener('click', function () {
          videoUrlInput.value = 'https://www.youtube.com/watch?v=' + v.id;
          applyVideoUrl();
        });
        videoLibrary.appendChild(thumb);
      });
    }

    // Random image toggle
    var randomImgT = panel.querySelector('#ts-oce-random-img');
    if (randomImgT) randomImgT.addEventListener('change', function () {
      if (this.checked) {
        applyHeroBg('https://picsum.photos/1920/1080?' + Date.now());
        toast('Random image loaded', 'info');
      }
    });

    if (videoUrlInput) {
    }

    // Canvas gradient controls
    var canvasSpeed = panel.querySelector('#ts-oce-canvas-speed');
    if (canvasSpeed) canvasSpeed.addEventListener('input', function () {
      updateRange(this);
      if (global.tsGradient && global.tsGradient.opts) {
        global.tsGradient.opts.speed = parseFloat(this.value);
      }
    });
    var canvasBlobSize = panel.querySelector('#ts-oce-canvas-blob-size');
    if (canvasBlobSize) canvasBlobSize.addEventListener('input', function () {
      updateRange(this);
      var r = parseFloat(this.value);
      if (global.tsGradient && global.tsGradient.circles) {
        global.tsGradient.circles.forEach(function (c) { c.radius = r; });
      }
    });
    var canvasRefreshBtn = panel.querySelector('#ts-oce-canvas-refresh');
    if (canvasRefreshBtn) canvasRefreshBtn.addEventListener('click', function () {
      var hero = getHero();
      if (!hero) return;
      // Destroy old instance
      if (global.tsGradient) {
        if (typeof global.tsGradient.pause === 'function') global.tsGradient.pause();
        global.tsGradient = null;
      }
      // Remove old canvas element
      var oldCanvas = hero.querySelector('canvas');
      if (oldCanvas) oldCanvas.remove();
      // Ensure hero has gradient-canvas class
      hero.classList.add('gradient-canvas');
      // Read current speed setting
      var speedEl = panel.querySelector('#ts-oce-canvas-speed');
      var speed = speedEl ? parseFloat(speedEl.value) : 0.1;
      var blobEl = panel.querySelector('#ts-oce-canvas-blob-size');
      var blobR = blobEl ? parseFloat(blobEl.value) : 0.65;
      // Create new instance
      var theme = document.documentElement.getAttribute('data-theme') || 'dark';
      global.tsGradient = new TSGradientCanvas({
        containerId: hero.id || null,
        speed: speed,
        theme: theme,
        fadeIn: false,
        fadeDuration: 0,
      });
      // Apply blob size to circles
      if (global.tsGradient && global.tsGradient.circles) {
        global.tsGradient.circles.forEach(function (c) { c.radius = blobR; });
      }
      toast('Canvas gradient refreshed', 'success');
    });

    // ── Canvas gradient colors — 3 color pickers → setPalette() ──
    // c1 = primary (accent blob), c2 = secondary (contrast blob), c3 = background fill
    var _canvasColors = ['#ff540a', '#12141c', '#0c0d12'];
    var _canvasDefaults = ['#ff540a', '#12141c', '#0c0d12'];
    function applyCanvasPalette() {
      if (!global.tsGradient || typeof global.tsGradient.setPalette !== 'function') return;
      var c1 = _canvasColors[0], c2 = _canvasColors[1], bg = _canvasColors[2];
      // 3rd color = background: used as the dark base in all circles
      var palette = [
        [c1, c2, bg],     // Circle 0: primary accent blob
        [bg, c2, bg],     // Circle 1: dark base with secondary
        [c2, c1, bg]      // Circle 2: secondary accent blob
      ];
      global.tsGradient.setPalette(palette);
    }
    function bindCanvasColor(idx, pickerId, hexId, swatchId) {
      var pick = panel.querySelector('#' + pickerId);
      var hex = panel.querySelector('#' + hexId);
      function sync(val) {
        _canvasColors[idx] = val;
        var sw = panel.querySelector('#' + swatchId);
        if (sw) sw.style.background = val;
        if (pick) pick.value = val;
        if (hex) hex.value = val;
        applyCanvasPalette();
      }
      if (pick) { pick.addEventListener('input', function () { sync(this.value); }); pick.addEventListener('change', function () { sync(this.value); }); }
      if (hex) hex.addEventListener('input', function () {
        if (/^#[0-9a-fA-F]{6}$/.test(this.value.trim())) sync(this.value.trim());
      });
    }
    bindCanvasColor(0, 'ts-oce-canvas-c1-pick', 'ts-oce-canvas-c1-hex', 'ts-oce-sw-canvas-c1');
    bindCanvasColor(1, 'ts-oce-canvas-c2-pick', 'ts-oce-canvas-c2-hex', 'ts-oce-sw-canvas-c2');
    bindCanvasColor(2, 'ts-oce-canvas-c3-pick', 'ts-oce-canvas-c3-hex', 'ts-oce-sw-canvas-c3');
    // Init colors from current accent
    _canvasColors[0] = getCurrentAccentHex();
    _canvasDefaults[0] = _canvasColors[0];

    // Reset canvas colors to defaults
    var canvasResetBtn = panel.querySelector('#ts-oce-canvas-reset-colors');
    if (canvasResetBtn) canvasResetBtn.addEventListener('click', function () {
      _canvasColors[0] = getCurrentAccentHex();
      _canvasColors[1] = _canvasDefaults[1];
      _canvasColors[2] = _canvasDefaults[2];
      // Sync all 3 swatches
      [['ts-oce-canvas-c1-pick', 'ts-oce-canvas-c1-hex', 'ts-oce-sw-canvas-c1', 0],
      ['ts-oce-canvas-c2-pick', 'ts-oce-canvas-c2-hex', 'ts-oce-sw-canvas-c2', 1],
      ['ts-oce-canvas-c3-pick', 'ts-oce-canvas-c3-hex', 'ts-oce-sw-canvas-c3', 2]].forEach(function (cfg) {
        var p = panel.querySelector('#' + cfg[0]);
        var h = panel.querySelector('#' + cfg[1]);
        var s = panel.querySelector('#' + cfg[2]);
        var v = _canvasColors[cfg[3]];
        if (p) p.value = v;
        if (h) h.value = v;
        if (s) s.style.background = v;
      });
      // Reset gradient to auto-palette mode
      if (global.tsGradient && typeof global.tsGradient.setAccent === 'function') {
        global.tsGradient.opts.accentColors = null;
        global.tsGradient.setAccent(_canvasColors[0]);
      }
      toast('Canvas colors reset', 'info');
    });

    // BG fixed toggle
    var bgFixedT = panel.querySelector('#ts-oce-bg-fixed');
    if (bgFixedT) bgFixedT.addEventListener('change', function () {
      var hero = getHero();
      if (hero) hero.style.backgroundAttachment = this.checked ? 'fixed' : '';
    });

    // Parallax scroll toggle (adds data-ts-parallax for CSS scroll-driven animation)
    var bgParallaxT = panel.querySelector('#ts-oce-bg-parallax');
    if (bgParallaxT) bgParallaxT.addEventListener('change', function () {
      var hero = getHero(); if (!hero) return;
      if (this.checked) {
        hero.setAttribute('data-ts-parallax', 'true');
        // Wrap existing bg image in a parallax layer if not already
        var existing = hero.querySelector('[data-ts-parallax-bg]');
        if (!existing) {
          var layer = document.createElement('div');
          layer.setAttribute('data-ts-parallax-bg', '');
          layer.style.cssText = 'position:absolute;inset:0;background:inherit;background-size:cover;background-position:center;z-index:0';
          hero.insertBefore(layer, hero.firstChild);
        }
      } else {
        hero.removeAttribute('data-ts-parallax');
        var layer = hero.querySelector('[data-ts-parallax-bg]');
        if (layer) layer.remove();
      }
    });

    // ── Effects layer: grain + grid classes go on .ts-effects-layer, not the section ──
    function getEffectsLayer() {
      var h = getHero(); if (!h) return null;
      var layer = h.querySelector('.ts-effects-layer');
      if (!layer) {
        // Defensive: create effects layer if missing
        layer = document.createElement('div');
        layer.className = 'ts-effects-layer';
        layer.setAttribute('aria-hidden', 'true');
        h.insertBefore(layer, h.firstChild);
      }
      return layer;
    }

    function effectsToggle(id, classes) {
      var el = panel.querySelector('#' + id);
      if (el) el.addEventListener('change', function () {
        var layer = getEffectsLayer(); if (!layer) return;
        classes.forEach(function (c) { layer.classList.toggle(c, el.checked); });
      });
    }
    // Line grid (ba-grid): line overlay via ::after on effects layer
    effectsToggle('ts-oce-line-grid', ['ba-grid']);

    // ── Dot grid: classes on SECTION so ToolskinGridBg receives mouse events.
    //    Overlay is a direct child of section — CSS vars cascade from section inline styles. ──
    function ensureDotOverlay() {
      var h = getHero(); if (!h) return;
      if (!h.querySelector(':scope > .ts-section-color-overlay')) {
        var ov = document.createElement('div');
        ov.className = 'ts-section-color-overlay';
        ov.setAttribute('aria-hidden', 'true');
        h.appendChild(ov);
      }
    }
    function dotGridToggle(id, classes) {
      var el = panel.querySelector('#' + id);
      if (el) el.addEventListener('change', function () {
        var h = getHero(); if (!h) return;
        ensureDotOverlay();
        classes.forEach(function (c) { h.classList.toggle(c, el.checked); });
      });
    }
    function dotGridReinit() {
      if (global.Toolskin && global.Toolskin.gridBg && typeof global.Toolskin.gridBg.reinit === 'function') {
        global.Toolskin.gridBg.reinit();
      }
    }
    dotGridToggle('ts-oce-dot-grid', ['grid-bg']);
    dotGridToggle('ts-oce-dot-interactive', ['interactive']);
    dotGridToggle('ts-oce-dot-anim', ['anim']);
    // Re-init grid-bg JS after any dot grid toggle changes
    ['ts-oce-dot-grid', 'ts-oce-dot-interactive', 'ts-oce-dot-anim'].forEach(function (id) {
      var el = panel.querySelector('#' + id);
      if (el) el.addEventListener('change', dotGridReinit);
    });

    // ── Grain layer: TOPMOST layer (z:6) — texturizes everything via mix-blend-mode ──
    function getGrainLayer() {
      var h = getHero(); if (!h) return null;
      var layer = h.querySelector('.ts-grain-layer');
      if (!layer) {
        layer = document.createElement('div');
        layer.className = 'ts-grain-layer';
        layer.setAttribute('aria-hidden', 'true');
        h.appendChild(layer); // append last = topmost in DOM
      }
      return layer;
    }

    var grainT = panel.querySelector('#ts-oce-grain');
    if (grainT) grainT.addEventListener('change', function () {
      var layer = getGrainLayer(); if (!layer) return;
      if (this.checked) {
        layer.classList.add('ts-grain');
        var animSel = panel.querySelector('#ts-oce-grain-anim');
        var variant = animSel ? animSel.value : 'flickered';
        layer.classList.remove('ts-grain--animated', 'ts-grain--flickered', 'ts-grain--perf');
        if (variant === 'animated') layer.classList.add('ts-grain--animated');
        else if (variant === 'flickered') layer.classList.add('ts-grain--flickered');
        else if (variant === 'perf') layer.classList.add('ts-grain--perf');
      } else {
        layer.classList.remove('ts-grain', 'ts-grain--animated', 'ts-grain--flickered', 'ts-grain--perf',
          'ts-grain--subtle', 'ts-grain--medium', 'ts-grain--strong');
      }
    });

    // Color overlay toggle → targets the color overlay layer
    function getColorOverlayLayer() {
      var h = getHero(); if (!h) return null;
      return h.querySelector('.ts-color-overlay-layer');
    }
    var colorOverlayT = panel.querySelector('#ts-oce-color-overlay');
    if (colorOverlayT) colorOverlayT.addEventListener('change', function () {
      var ov = getColorOverlayLayer();
      if (ov) ov.classList.toggle('ts-oce-hidden', !this.checked);
    });

    // Background fixed
    var bgFixedT = panel.querySelector('#ts-oce-bg-fixed');
    if (bgFixedT) bgFixedT.addEventListener('change', function () {
      var h = getHero();
      if (h) h.style.backgroundAttachment = this.checked ? 'fixed' : '';
    });

    // ── Overlay controls → target color-overlay-layer ──
    var overlayOpacity = panel.querySelector('#ts-oce-overlay-opacity');
    if (overlayOpacity) overlayOpacity.addEventListener('input', function () {
      updateRange(this);
      var ov = getColorOverlayLayer();
      if (ov) { var pct = Math.round(parseFloat(this.value) * 100); ov.style.background = 'color-mix(in srgb, var(--ts-bg-0) ' + pct + '%, transparent)'; }
    });
    var blendSelect = panel.querySelector('#ts-oce-blend-mode');
    if (blendSelect) blendSelect.addEventListener('change', function () {
      var ov = getColorOverlayLayer();
      if (ov) ov.style.mixBlendMode = this.value;
    });
    var backdropBlur = panel.querySelector('#ts-oce-backdrop-blur');
    if (backdropBlur) backdropBlur.addEventListener('input', function () {
      updateRange(this);
      var ov = getColorOverlayLayer();
      if (ov) ov.style.backdropFilter = parseFloat(this.value) > 0 ? 'blur(' + this.value + 'px)' : '';
    });

    // ── Grain controls ──
    function rangeToHeroVar(id, prop, unit) {
      var el = panel.querySelector('#' + id);
      if (!el) return;
      el.addEventListener('input', function () {
        updateRange(this);
        var h = getHero(); if (h) h.style.setProperty(prop, parseFloat(this.value) + (unit || ''));
      });
    }
    // Grain CSS vars → set on GRAIN layer (topmost, z:6)
    function rangeToEffectsVar(id, prop, unit) {
      var el = panel.querySelector('#' + id);
      if (!el) return;
      el.addEventListener('input', function () {
        updateRange(this);
        var layer = getEffectsLayer(); if (layer) layer.style.setProperty(prop, parseFloat(this.value) + (unit || ''));
      });
    }
    function rangeToGrainVar(id, prop, unit) {
      var el = panel.querySelector('#' + id);
      if (!el) return;
      el.addEventListener('input', function () {
        updateRange(this);
        var layer = getGrainLayer(); if (layer) layer.style.setProperty(prop, parseFloat(this.value) + (unit || ''));
      });
    }
    rangeToGrainVar('ts-oce-grain-opacity', '--ts-grain-opacity', '');
    rangeToGrainVar('ts-oce-grain-scale', '--ts-grain-scale', '');
    rangeToGrainVar('ts-oce-grain-frequency', '--ts-grain-base-frequency', '');

    // Grain animation variant select → grain layer
    var grainAnimSel = panel.querySelector('#ts-oce-grain-anim');
    if (grainAnimSel) grainAnimSel.addEventListener('change', function () {
      var layer = getGrainLayer(); if (!layer || !layer.classList.contains('ts-grain')) return;
      layer.classList.remove('ts-grain--animated', 'ts-grain--flickered', 'ts-grain--perf');
      var v = this.value;
      if (v === 'animated') layer.classList.add('ts-grain--animated');
      else if (v === 'flickered') layer.classList.add('ts-grain--flickered');
      else if (v === 'perf') layer.classList.add('ts-grain--perf');
    });

    // Grain intensity preset → grain layer
    var grainPresetSel = panel.querySelector('#ts-oce-grain-preset');
    if (grainPresetSel) grainPresetSel.addEventListener('change', function () {
      var layer = getGrainLayer(); if (!layer) return;
      layer.classList.remove('ts-grain--subtle', 'ts-grain--medium', 'ts-grain--strong');
      if (this.value) layer.classList.add('ts-grain--' + this.value);
    });

    // Grain blend mode → grain layer
    var grainBlendSel = panel.querySelector('#ts-oce-grain-blend');
    if (grainBlendSel) grainBlendSel.addEventListener('change', function () {
      var layer = getGrainLayer(); if (layer) layer.style.setProperty('--ts-grain-blend-mode', this.value);
    });

    // ── Grid lines → effects layer; dot controls → dot grid layer ──
    rangeToEffectsVar('ts-oce-grid-size', '--ts-grid-size', 'px');
    // Dot vars go on the hero section (ToolskinGridBg reads from there)
    rangeToHeroVar('ts-oce-dot-size', '--ts-dot-size', 'px');
    rangeToHeroVar('ts-oce-dot-gap', '--ts-point-gap-width', 'px');
    rangeToHeroVar('ts-oce-dot-speed', '--ts-dot-speed', 's');
    rangeToHeroVar('ts-oce-dot-scale', '--ts-dot-scale', '');

    // ── Dot Color swatch + Alpha — compute color-mix with literal percent ──
    var _dotColor = '#ff540a'; // track current dot color hex
    function applyDotColor() {
      var hero = getHero(); if (!hero) return;
      var alphaEl = panel.querySelector('#ts-oce-dot-alpha');
      var alpha = alphaEl ? parseFloat(alphaEl.value) : 0.8;
      hero.style.setProperty('--ts-dot-color',
        'color-mix(in srgb, ' + _dotColor + ' ' + Math.round(alpha * 100) + '%, transparent)');
    }
    var dotColorPick = panel.querySelector('#ts-oce-dot-color-pick');
    var dotColorHex = panel.querySelector('#ts-oce-dot-color-hex');
    function syncDotColor(hex) {
      _dotColor = hex;
      var sw = panel.querySelector('#ts-oce-sw-dot-color');
      if (sw) sw.style.background = hex;
      if (dotColorPick) dotColorPick.value = hex;
      if (dotColorHex) dotColorHex.value = hex;
      applyDotColor();
    }
    if (dotColorPick) { dotColorPick.addEventListener('input', function () { syncDotColor(this.value); }); dotColorPick.addEventListener('change', function () { syncDotColor(this.value); }); }
    if (dotColorHex) dotColorHex.addEventListener('input', function () {
      if (/^#[0-9a-fA-F]{6}$/.test(this.value.trim())) syncDotColor(this.value.trim());
    });
    // Init dot color from current accent
    syncDotColor(getCurrentAccentHex());

    // Dot Alpha — calls applyDotColor to recompute color-mix
    var dotAlphaEl = panel.querySelector('#ts-oce-dot-alpha');
    if (dotAlphaEl) dotAlphaEl.addEventListener('input', function () {
      updateRange(this);
      applyDotColor();
    });

    // ── Dot Sensitivity — inverted: higher slider = more responsive ──
    var dotSensEl = panel.querySelector('#ts-oce-dot-sensitivity');
    if (dotSensEl) dotSensEl.addEventListener('input', function () {
      updateRange(this);
      var v = parseFloat(this.value);
      if (global.Toolskin && global.Toolskin.gridBg && global.Toolskin.gridBg.config) {
        var impact = 110 - v; // Invert: higher value = lower divisor = more responsive
        global.Toolskin.gridBg.config.impactLayer1 = impact;
        global.Toolskin.gridBg.config.impactLayer2 = impact / 2;
      }
    });

    // ── Dot toggle disable logic: Mouse tracking → disables sensitivity, Animate → disables speed ──
    function syncDotToggleDisables() {
      var mouseT = panel.querySelector('#ts-oce-dot-interactive');
      var animT = panel.querySelector('#ts-oce-dot-anim');
      var sensRow = dotSensEl ? dotSensEl.closest('.ts-card-row') || dotSensEl.closest('.ts-field') : null;
      var speedEl = panel.querySelector('#ts-oce-dot-speed');
      var speedRow = speedEl ? speedEl.closest('.ts-card-row') || speedEl.closest('.ts-field') : null;
      if (sensRow) sensRow.classList.toggle('ts-oce-disabled', mouseT && !mouseT.checked);
      if (speedRow) speedRow.classList.toggle('ts-oce-disabled', animT && !animT.checked);
    }
    var mouseToggle = panel.querySelector('#ts-oce-dot-interactive');
    var animToggle = panel.querySelector('#ts-oce-dot-anim');
    if (mouseToggle) mouseToggle.addEventListener('change', syncDotToggleDisables);
    if (animToggle) animToggle.addEventListener('change', syncDotToggleDisables);
    syncDotToggleDisables(); // initial state

    /* ═══ MODE CONFLICT RULES ═══
       Enforces which effects can coexist:
       - Pattern overlay: ONLY when no dot grid AND no grain active
       - Backdrop filter: ONLY when bg is image or video (not canvas gradient)
       - Dot grid + grain can coexist (separate layers)
       - Line grid + everything can coexist
    */
    // Track pre-pattern state so we can restore on pattern disable
    var _prePatternState = { lineGrid: false, dotGrid: false };

    function syncModeConflicts() {
      var bgType = panel.querySelector('#ts-oce-bg-type');
      var dotGrid = panel.querySelector('#ts-oce-dot-grid');
      var lineGrid = panel.querySelector('#ts-oce-line-grid');
      var grain = panel.querySelector('#ts-oce-grain');
      var backdropBlurEl = panel.querySelector('#ts-oce-backdrop-blur');
      var patternEnabled = panel.querySelector('#ts-oce-pattern-enabled');

      var bgMode = bgType ? bgType.value : 'canvas-gradient';
      var dotsOn = dotGrid ? dotGrid.checked : false;
      var grainOn = grain ? grain.checked : false;
      var patternOn = patternEnabled ? patternEnabled.checked : false;

      // ── Pattern ON → auto-disable line grid + dot grid (they block pattern visibility)
      var lineGridCard = lineGrid ? lineGrid.closest('.ts-card') : null;
      var dotGridCard = dotGrid ? dotGrid.closest('.ts-card') : null;
      if (patternOn) {
        // Save current state before forcing off
        if (lineGrid && lineGrid.checked) { _prePatternState.lineGrid = true; lineGrid.checked = false; lineGrid.dispatchEvent(new Event('change', { bubbles: true })); }
        if (dotGrid && dotGrid.checked) { _prePatternState.dotGrid = true; dotGrid.checked = false; dotGrid.dispatchEvent(new Event('change', { bubbles: true })); }
        if (lineGridCard) lineGridCard.classList.add('ts-oce-disabled');
        if (dotGridCard) dotGridCard.classList.add('ts-oce-disabled');
      } else {
        // Pattern OFF → remove disabled state; restore previous state if applicable
        if (lineGridCard) lineGridCard.classList.remove('ts-oce-disabled');
        if (dotGridCard) dotGridCard.classList.remove('ts-oce-disabled');
        if (_prePatternState.lineGrid && lineGrid && !lineGrid.checked) {
          lineGrid.checked = true; lineGrid.dispatchEvent(new Event('change', { bubbles: true }));
          _prePatternState.lineGrid = false;
        }
        if (_prePatternState.dotGrid && dotGrid && !dotGrid.checked) {
          dotGrid.checked = true; dotGrid.dispatchEvent(new Event('change', { bubbles: true }));
          _prePatternState.dotGrid = false;
        }
      }

      // ── Dot grid / grain ON → disable pattern card
      var patternCard = patternEnabled ? patternEnabled.closest('.ts-card') : null;
      if (patternCard && !patternOn) {
        var patternBlocked = dotsOn || grainOn;
        patternCard.classList.toggle('ts-oce-disabled', patternBlocked);
        if (patternBlocked && patternEnabled && patternEnabled.checked) {
          patternEnabled.checked = false;
          patternEnabled.dispatchEvent(new Event('change', { bubbles: true }));
        }
      }

      // ── Backdrop filter: only for image/video backgrounds
      var blurRow = backdropBlurEl ? backdropBlurEl.closest('.ts-card-row') : null;
      if (blurRow) {
        var blurAllowed = bgMode === 'image' || bgMode === 'video';
        blurRow.classList.toggle('ts-oce-disabled', !blurAllowed);
        if (!blurAllowed && backdropBlurEl) {
          backdropBlurEl.value = 0;
          updateRange(backdropBlurEl);
          var ov = getColorOverlayLayer();
          if (ov) ov.style.backdropFilter = '';
        }
      }
    }

    // Bind conflict check to all relevant toggles
    ['ts-oce-bg-type', 'ts-oce-dot-grid', 'ts-oce-grain', 'ts-oce-pattern-enabled'].forEach(function (id) {
      var elem = panel.querySelector('#' + id);
      if (elem) elem.addEventListener('change', syncModeConflicts);
    });

    // ── Pattern overlay controls → effects layer (uses ts-pattern-* classes from ts-patterns.css) ──
    var _patternTypes = ['dots', 'dots-dense', 'grid', 'grid-bold', 'diagonal-stripes', 'circles-grid', 'cross', 'checkerboard', 'zigzag'];

    function applyPatternState() {
      var layer = getEffectsLayer(); if (!layer) return;
      var enabledT = panel.querySelector('#ts-oce-pattern-enabled');
      var typeSel = panel.querySelector('#ts-oce-pattern-type');
      var enabled = enabledT ? enabledT.checked : false;
      var type = typeSel ? typeSel.value : 'dots';

      // Remove ALL previous pattern classes
      _patternTypes.forEach(function (t) { layer.classList.remove('ts-pattern-' + t); });
      // Also remove legacy overlay classes
      layer.classList.remove('ts-bg-overlay', 'ts-bg-overlay-dots', 'ts-bg-overlay-lines');
      layer.removeAttribute('data-ts-bg-overlay');

      if (enabled) {
        layer.classList.add('ts-pattern-' + type);
      }
    }

    // Enable toggle
    var patternEnabledT = panel.querySelector('#ts-oce-pattern-enabled');
    if (patternEnabledT) patternEnabledT.addEventListener('change', applyPatternState);

    // Type select
    var patternTypeSel = panel.querySelector('#ts-oce-pattern-type');
    if (patternTypeSel) patternTypeSel.addEventListener('change', applyPatternState);

    // Scale (--ts-pattern-scale on effects layer)
    var patternScale = panel.querySelector('#ts-oce-pattern-scale');
    if (patternScale) patternScale.addEventListener('input', function () {
      updateRange(this);
      var layer = getEffectsLayer(); if (layer) layer.style.setProperty('--ts-pattern-scale', this.value);
    });

    // Opacity (--ts-pattern-opacity on effects layer, 0-100 → 0-1)
    var patternOpacity = panel.querySelector('#ts-oce-pattern-opacity');
    if (patternOpacity) patternOpacity.addEventListener('input', function () {
      updateRange(this);
      var layer = getEffectsLayer(); if (layer) layer.style.setProperty('--ts-pattern-opacity', parseFloat(this.value) / 100);
    });

    // Pattern color (--ts-pattern-color on effects layer)
    var patternColorPick = panel.querySelector('#ts-oce-pattern-color-pick');
    var patternColorHex = panel.querySelector('#ts-oce-pattern-color-hex');
    function syncPatternColor(hex) {
      var layer = getEffectsLayer(); if (layer) layer.style.setProperty('--ts-pattern-color', hex);
      var sw = panel.querySelector('#ts-oce-sw-pattern-color');
      if (sw) sw.style.background = hex;
      if (patternColorPick) patternColorPick.value = hex;
      if (patternColorHex) patternColorHex.value = hex;
    }
    if (patternColorPick) { patternColorPick.addEventListener('input', function () { syncPatternColor(this.value); }); patternColorPick.addEventListener('change', function () { syncPatternColor(this.value); }); }
    if (patternColorHex) patternColorHex.addEventListener('input', function () {
      if (/^#[0-9a-fA-F]{6}$/.test(this.value.trim())) syncPatternColor(this.value.trim());
    });
    syncPatternColor(getCurrentAccentHex());

    // ── Cursor controls ──
    var cursorEnableT = panel.querySelector('#ts-oce-cursor-enabled');
    if (cursorEnableT) cursorEnableT.addEventListener('change', function () {
      if (global.Toolskin && typeof global.Toolskin.enableCursor === 'function') {
        global.Toolskin.enableCursor(this.checked);
        toast('Cursor ' + (this.checked ? 'enabled' : 'disabled'), this.checked ? 'success' : 'info');
      }
    });
    var cursorModeSel = panel.querySelector('#ts-oce-cursor-mode');
    if (cursorModeSel) cursorModeSel.addEventListener('change', function () {
      // Mode change requires re-creating cursor
      if (global.Toolskin && global.Toolskin.cursor) {
        global.Toolskin.config.cursor.mode = this.value;
        global.Toolskin.enableCursor(false);
        global.Toolskin.enableCursor(true);
        toast('Cursor mode: ' + this.value, 'info');
      }
    });
    var cursorSize = panel.querySelector('#ts-oce-cursor-size');
    if (cursorSize) cursorSize.addEventListener('input', function () {
      updateRange(this);
      document.documentElement.style.setProperty('--ts-cursor-size', this.value + 'px');
    });
    var cursorGrow = panel.querySelector('#ts-oce-cursor-grow');
    if (cursorGrow) cursorGrow.addEventListener('input', function () {
      updateRange(this);
      document.documentElement.style.setProperty('--ts-cursor-grow', this.value);
    });
    var cursorFollowerT = panel.querySelector('#ts-oce-cursor-follower');
    if (cursorFollowerT) cursorFollowerT.addEventListener('change', function () {
      var c = document.querySelector('.custom-cursor');
      if (c) c.classList.toggle('cursor--no-follower', !this.checked);
    });
    var cursorEasing = panel.querySelector('#ts-oce-cursor-easing');
    if (cursorEasing) cursorEasing.addEventListener('input', function () {
      updateRange(this);
      if (global.Toolskin && global.Toolskin.cursor) {
        global.Toolskin.cursor.easing = parseFloat(this.value);
      }
    });

    // ── Preloader controls ──
    var PRELOADER_VARIANTS = ['ts-preloader--minimal-bar', 'ts-preloader--spinner', 'ts-preloader--text-only'];
    function getPreloader() { return document.querySelector('#ts-preloader, [data-ts-preloader]'); }

    var preloaderShowT = panel.querySelector('#ts-oce-preloader-show');
    if (preloaderShowT) preloaderShowT.addEventListener('change', function () {
      var pre = getPreloader();
      if (this.checked) {
        if (pre) {
          pre.classList.remove('is-done');
          pre.classList.add('is-visible');
          pre.style.pointerEvents = 'none';
        }
        toast('Preloader preview — toggle off to dismiss', 'info');
      } else {
        if (pre) {
          pre.classList.remove('is-visible');
          pre.classList.add('is-done');
          pre.style.pointerEvents = '';
        }
      }
    });

    // Preloader preset variant
    var preloaderPresetSel = panel.querySelector('#ts-oce-preloader-preset');
    if (preloaderPresetSel) preloaderPresetSel.addEventListener('change', function () {
      var pre = getPreloader(); if (!pre) return;
      PRELOADER_VARIANTS.forEach(function (c) { pre.classList.remove(c); });
      if (this.value !== 'brand-box') pre.classList.add('ts-preloader--' + this.value);
      if (this.value === 'text-only') {
        var hintInput = panel.querySelector('#ts-oce-preloader-hint');
        pre.setAttribute('data-ts-preloader-text', hintInput ? hintInput.value : 'Loading…');
      }
      toast('Preloader preset: ' + this.value, 'info');
    });

    // Helper: ensure a live percentage element inside .ts-preloader__brand
    function ensurePreloaderPercent(pre) {
      if (!pre) return null;
      var pctEl = pre.querySelector('.ts-preloader__percent');
      if (!pctEl) {
        pctEl = document.createElement('span');
        pctEl.className = 'ts-preloader__percent';
        pctEl.textContent = '0%';
        var brand = pre.querySelector('.ts-preloader__brand');
        if (brand) brand.appendChild(pctEl);
      }
      return pctEl;
    }

    // Simulate real loading: in → progress → hold → out, with live percent display
    var simulateBtn = panel.querySelector('#ts-oce-preloader-simulate');
    if (simulateBtn) simulateBtn.addEventListener('click', function () {
      var pre = getPreloader(); if (!pre) return;
      var holdEl = panel.querySelector('#ts-oce-preloader-hold');
      var holdMs = holdEl ? (parseInt(holdEl.value, 10) || 3000) : 3000;
      // Phase 1: Show
      pre.classList.remove('is-done');
      pre.classList.add('is-visible');
      pre.style.pointerEvents = 'none';
      var bar = pre.querySelector('.ts-preloader__bar');
      var pctEl = ensurePreloaderPercent(pre);
      // Step progress from 0 → 100 via rAF over holdMs * 0.8
      var startT = performance.now();
      var dur = Math.max(100, holdMs * 0.8);
      function step() {
        var t = Math.min(1, (performance.now() - startT) / dur);
        var pct = Math.round(t * 100);
        pre.style.setProperty('--ts-preloader-progress', pct + '%');
        if (bar) bar.style.width = pct + '%';
        if (pctEl) pctEl.textContent = pct + '%';
        if (t < 1 && pre.classList.contains('is-visible')) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
      toast('Simulating preloader…', 'info');
      // Phase 2: Hold then dismiss
      setTimeout(function () {
        pre.classList.remove('is-visible');
        pre.classList.add('is-done');
        pre.style.pointerEvents = '';
        if (bar) bar.style.width = '0%';
        pre.style.setProperty('--ts-preloader-progress', '0%');
        if (pctEl) pctEl.textContent = '0%';
      }, holdMs);
    });

    // Hold Duration: just update the range fill on input (value is read by simulate button)
    var preloaderHoldEl = panel.querySelector('#ts-oce-preloader-hold');
    if (preloaderHoldEl) preloaderHoldEl.addEventListener('input', function () { updateRange(this); });

    // Preloader bar height — binds to --ts-preloader-bar-height on the preloader element
    var preloaderBarHeight = panel.querySelector('#ts-oce-preloader-bar-height');
    if (preloaderBarHeight) preloaderBarHeight.addEventListener('input', function () {
      updateRange(this);
      var pre = getPreloader(); if (!pre) return;
      pre.style.setProperty('--ts-preloader-bar-height', this.value + 'px');
    });

    // Preloader bar position (minimal-bar variant)
    var preloaderBarPos = panel.querySelector('#ts-oce-preloader-bar-pos');
    if (preloaderBarPos) preloaderBarPos.addEventListener('change', function () {
      var pre = getPreloader(); if (!pre) return;
      // Use the --_top / --_bottom mapping defined in CSS via --ts-preloader-bar-position
      pre.style.setProperty('--ts-preloader-bar-position', this.value === 'top' ? 'var(--_top)' : 'var(--_bottom)');
    });

    // Preloader logo text — updates the "TOOLSKIN" branding text
    var preloaderLogoText = panel.querySelector('#ts-oce-preloader-logo-text');
    if (preloaderLogoText) preloaderLogoText.addEventListener('input', function () {
      var pre = getPreloader(); if (!pre) return;
      var logo = pre.querySelector('.ts-preloader__logo');
      if (!logo) return;
      // Preserve the icon if present, replace the text nodes after it
      var icon = logo.querySelector('.ts-icon');
      // Clear all text nodes and em children
      Array.prototype.slice.call(logo.childNodes).forEach(function (n) {
        if (n !== icon) logo.removeChild(n);
      });
      // Append new text
      var txt = this.value || 'TOOLSKIN';
      logo.appendChild(document.createTextNode(' ' + txt));
    });

    // Preloader overlay opacity
    var preloaderOverlay = panel.querySelector('#ts-oce-preloader-overlay');
    if (preloaderOverlay) preloaderOverlay.addEventListener('input', function () {
      updateRange(this);
      var pre = getPreloader(); if (!pre) return;
      var v = parseFloat(this.value);
      pre.style.backgroundColor = 'color-mix(in srgb, var(--ts-bg-body), transparent ' + Math.round((1 - v) * 100) + '%)';
    });

    // Preloader hint text
    var preloaderHint = panel.querySelector('#ts-oce-preloader-hint');
    if (preloaderHint) preloaderHint.addEventListener('input', function () {
      var pre = getPreloader(); if (!pre) return;
      var hint = pre.querySelector('.ts-preloader__hint');
      if (hint) hint.textContent = this.value;
      pre.setAttribute('data-ts-preloader-text', this.value);
    });

    /* ── THEME ── */
    panel.querySelectorAll('[data-ts-oce-theme]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var mode = btn.dataset.tsOceTheme;
        if (global.Toolskin && typeof global.Toolskin.setTheme === 'function') {
          suppressTransitions(function () { global.Toolskin.setTheme(mode); });
          toast('Theme: ' + mode, 'info');
        }
        panel.querySelectorAll('[data-ts-oce-theme]').forEach(function (b) {
          b.classList.toggle('ts-btn--secondary', b.dataset.tsOceTheme === mode);
          b.classList.toggle('ts-btn--outline', b.dataset.tsOceTheme !== mode);
        });
        // Re-populate surface presets for current mode
        populateSurfacePresets();
      });
    });

    var autoTheme = panel.querySelector('#ts-oce-auto-theme');
    if (autoTheme) autoTheme.addEventListener('change', function () {
      if (this.checked && global.Toolskin) {
        var pref = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
        suppressTransitions(function () { global.Toolskin.setTheme(pref); });
      }
    });

    var resetBtn = panel.querySelector('[data-ts-oce-reset-theme]');
    if (resetBtn) resetBtn.addEventListener('click', function () {
      if (global.Toolskin) {
        suppressTransitions(function () { global.Toolskin.setTheme('dark'); });
        if (typeof global.Toolskin.setAccentHex === 'function') { global.Toolskin.setAccentHex('#7c3aed'); syncColor('#7c3aed'); }
        if (typeof global.Toolskin.setRadius === 'function') { global.Toolskin.setRadius(10); var r = panel.querySelector('#ts-oce-radius'); if (r) { r.value = 10; updateRange(r); } }
        if (typeof global.Toolskin.resetSurfacePresets === 'function') global.Toolskin.resetSurfacePresets();
        toast('Reset to defaults', 'success');
      }
    });

    /* ── Surface contrast — use Toolskin.applyContrastTweakToSurfaceMaps when Color.js available ── */
    var surfaceContrast = panel.querySelector('#ts-oce-surface-contrast');
    if (surfaceContrast) {
      // Live preview on drag (color-mix fallback)
      surfaceContrast.addEventListener('input', function () {
        updateRange(this);
        var t = parseFloat(this.value) / 100;
        var secW = Math.round((0.12 + t * 0.38) * 100);
        var mutW = Math.round((0.28 + t * 0.42) * 100);
        var root = document.documentElement;
        root.style.setProperty('--ts-text-secondary',
          'color-mix(in srgb, var(--ts-text-primary) ' + secW + '%, var(--ts-bg-body))');
        root.style.setProperty('--ts-text-muted',
          'color-mix(in srgb, var(--ts-text-primary) ' + mutW + '%, var(--ts-bg-body))');
      });
      // On change (release), try the full API which also adjusts surfaces
      surfaceContrast.addEventListener('change', function () {
        var v = parseFloat(this.value);
        if (global.Toolskin && typeof global.Toolskin.applyContrastTweakToSurfaceMaps === 'function') {
          var ok = global.Toolskin.applyContrastTweakToSurfaceMaps(v);
          if (ok) {
            toast('Contrast applied to surface maps (Color.js)', 'success');
          } else {
            toast('Color.js not loaded — preview only (text contrast)', 'info');
          }
        }
      });
    }

    /* ── Surface presets (single select, mode-aware) ── */
    var surfacePresetSel = panel.querySelector('#ts-oce-surface-preset');

    function populateSurfacePresets() {
      if (!surfacePresetSel || !global.Toolskin || typeof global.Toolskin.getSurfacePresetsCatalog !== 'function') return;
      var catalog = global.Toolskin.getSurfacePresetsCatalog();
      var mode = (document.documentElement.getAttribute('data-theme') || 'dark').toLowerCase();
      var presets = mode === 'light' ? catalog.light : catalog.dark;
      var label = panel.querySelector('#ts-oce-preset-label');
      if (label) label.textContent = (mode === 'light' ? 'Light' : 'Dark') + ' Surface Presets';

      // Rebuild options
      surfacePresetSel.innerHTML = '<option value="">— select —</option>';
      if (presets) presets.forEach(function (p) {
        var opt = document.createElement('option');
        opt.value = p.id; opt.textContent = p.label;
        surfacePresetSel.appendChild(opt);
      });
      // Re-init UIKit select
      var wrap = surfacePresetSel.closest('.ts-ui-select');
      if (wrap && global.ToolskinUIKit) {
        // Destroy old trigger/dropdown
        var oldTrigger = wrap.querySelector('.ts-ui-select__trigger');
        var oldDrop = wrap.querySelector('.ts-ui-select__dropdown');
        if (oldTrigger) oldTrigger.remove();
        if (oldDrop) oldDrop.remove();
        wrap.__tsUiSelect = false;
        global.ToolskinUIKit.Select(wrap);
      }
    }
    populateSurfacePresets();

    if (surfacePresetSel) surfacePresetSel.addEventListener('change', function () {
      var id = this.value; if (!id) return;
      var mode = (document.documentElement.getAttribute('data-theme') || 'dark').toLowerCase();
      if (mode === 'light' && typeof global.Toolskin.applyLightSurfacePreset === 'function') {
        global.Toolskin.applyLightSurfacePreset(id);
      } else if (typeof global.Toolskin.applyDarkSurfacePreset === 'function') {
        global.Toolskin.applyDarkSurfacePreset(id);
      }
      toast('Surface preset applied', 'success');
    });

    var resetSurfacesBtn = panel.querySelector('#ts-oce-reset-surfaces');
    if (resetSurfacesBtn) resetSurfacesBtn.addEventListener('click', function () {
      if (typeof global.Toolskin.resetSurfacePresets === 'function') {
        global.Toolskin.resetSurfacePresets();
        toast('Surface presets reset', 'info');
      }
    });

    /* ── Surface export ── */
    (function () {
      var area = panel.querySelector('#ts-oce-export-area');
      var computedT = panel.querySelector('#ts-oce-export-computed');
      function buildExport() {
        if (!area || !global.Toolskin || typeof global.Toolskin.getSurfaceTokenMaps !== 'function') return;
        var maps = global.Toolskin.getSurfaceTokenMaps(), lines = [];
        lines.push('/* Dark surface map */');
        if (maps.dark) Object.keys(maps.dark).forEach(function (k) { lines.push('  ' + k + ': ' + maps.dark[k] + ';'); });
        lines.push('\n/* Light surface map */');
        if (maps.light) Object.keys(maps.light).forEach(function (k) { lines.push('  ' + k + ': ' + maps.light[k] + ';'); });
        if (computedT && computedT.checked) {
          lines.push('\n/* Computed :root */');
          var cs = getComputedStyle(document.documentElement);
          ['--ts-bg-body', '--ts-bg-0', '--ts-bg-1', '--ts-bg-2', '--ts-bg-3', '--ts-accent', '--ts-text-primary', '--ts-text-secondary'].forEach(function (v) {
            lines.push('  ' + v + ': ' + cs.getPropertyValue(v).trim() + ';');
          });
        }
        area.value = lines.join('\n');
      }
      panel.querySelector('#ts-oce-export-refresh')?.addEventListener('click', buildExport);
      computedT?.addEventListener('change', buildExport);
      panel.querySelector('#ts-oce-export-copy')?.addEventListener('click', function () { if (area && navigator.clipboard) navigator.clipboard.writeText(area.value); toast('Copied', 'success'); });
      buildExport();
    })();

    /* ── Surface color pickers ── */
    (function () {
      function cssToHex(css) {
        var d = document.createElement('div');
        d.style.color = css;
        document.body.appendChild(d);
        var c = getComputedStyle(d).color;
        document.body.removeChild(d);
        var m = c.match(/\d+/g);
        if (!m || m.length < 3) return '#000000';
        return '#' + m.slice(0, 3).map(function (v) { return (+v).toString(16).padStart(2, '0'); }).join('');
      }

      // Init surface color pickers (color input + hex text input + swatch)
      var picks = panel.querySelectorAll('.ts-oce-surface-pick');
      var hexInputs = panel.querySelectorAll('.ts-oce-surface-hex');

      function syncSurface(varName, hex) {
        document.documentElement.style.setProperty(varName, hex);
        // Sync all inputs for this variable
        var pick = panel.querySelector('.ts-oce-surface-pick[data-surface="' + varName + '"]');
        var text = panel.querySelector('.ts-oce-surface-hex[data-surface="' + varName + '"]');
        var colorRow = pick ? pick.closest('.ts-color-row') : null;
        var sw = colorRow ? colorRow.querySelector('.ts-sw') : null;
        if (pick) pick.value = hex;
        if (text) text.value = hex;
        if (sw) sw.style.background = hex;
      }

      picks.forEach(function (pick) {
        var varName = pick.dataset.surface;
        var cs = getComputedStyle(document.documentElement);
        var hex = cssToHex(cs.getPropertyValue(varName));
        syncSurface(varName, hex);

        pick.addEventListener('input', function () { syncSurface(varName, this.value); });
        pick.addEventListener('change', function () { syncSurface(varName, this.value); });
      });

      hexInputs.forEach(function (inp) {
        var varName = inp.dataset.surface;
        inp.addEventListener('input', function () {
          var v = this.value.trim();
          if (/^#[0-9a-fA-F]{6}$/.test(v)) syncSurface(varName, v);
        });
      });

      var resetSurfColors = panel.querySelector('#ts-oce-reset-surface-colors');
      if (resetSurfColors) resetSurfColors.addEventListener('click', function () {
        picks.forEach(function (pick) {
          var varName = pick.dataset.surface;
          document.documentElement.style.removeProperty(varName);
          var cs = getComputedStyle(document.documentElement);
          var hex = cssToHex(cs.getPropertyValue(varName));
          syncSurface(varName, hex);
        });
        toast('Surface colors reset', 'info');
      });
    })();

    /* ── Global options ── */
    var smoothT = panel.querySelector('#ts-oce-smooth-scroll');
    if (smoothT) smoothT.addEventListener('change', function () {
      var on = this.checked;
      if (global.Toolskin && global.Toolskin.smooth) {
        if (on) global.Toolskin.smooth.start(); else global.Toolskin.smooth.stop();
        toast('Smooth scroll ' + (on ? 'enabled' : 'disabled'), on ? 'success' : 'info');
      } else if (global.lenis) {
        if (on) global.lenis.start(); else global.lenis.stop();
        toast('Lenis ' + (on ? 'started' : 'stopped'), 'info');
      } else {
        toast('Smooth scroll not available (Lenis not loaded)', 'warning');
      }
    });

    // Cursor toggle removed from Global Options — now only in Custom Cursor card
    var _unusedCursorRef = panel.querySelector('#ts-oce-cursor-effects');
    if (false) { // dead code — kept for reference
    };

    var glassT = panel.querySelector('#ts-oce-glass-morph');
    if (glassT) glassT.addEventListener('change', function () {
      document.documentElement.classList.toggle('ts-glass-enabled', this.checked);
      toast('Glass morphism ' + (this.checked ? 'enabled — affects .ts-card, .ts-panel' : 'disabled'), this.checked ? 'success' : 'info');
    });

    var reduceT = panel.querySelector('#ts-oce-reduce-motion');
    if (reduceT) reduceT.addEventListener('change', function () {
      document.documentElement.classList.toggle('ts-reduce-motion', this.checked);
      toast('Reduce motion ' + (this.checked ? 'enabled' : 'disabled'), this.checked ? 'success' : 'info');
    });

    // Tooltips toggle — enable/disable sitewide, removes container from DOM when off
    var tooltipT = panel.querySelector('#ts-oce-tooltips');
    if (tooltipT) {
      // Init state: tooltips are on by default
      tooltipT.checked = !!(global.Toolskin && global.Toolskin.tooltips);
      tooltipT.addEventListener('change', function () {
        if (global.Toolskin && typeof global.Toolskin.enableTooltips === 'function') {
          global.Toolskin.enableTooltips(this.checked);
          toast('Tooltips ' + (this.checked ? 'enabled' : 'disabled'), this.checked ? 'success' : 'info');
        }
      });
    }

    /* ── COLORS ── */
    if (accentInput) accentInput.addEventListener('input', function () {
      var hex = this.value.trim();
      if (/^#?[0-9a-fA-F]{6}$/.test(hex)) {
        hex = hex.charAt(0) === '#' ? hex : '#' + hex;
        syncColor(hex);
        if (global.Toolskin && typeof global.Toolskin.setAccentHex === 'function') global.Toolskin.setAccentHex(hex);
      }
    });
    function _onAccentColorPick() {
      syncColor(this.value);
      if (global.Toolskin && typeof global.Toolskin.setAccentHex === 'function') global.Toolskin.setAccentHex(this.value);
    }
    if (accentColorInput) { accentColorInput.addEventListener('input', _onAccentColorPick); accentColorInput.addEventListener('change', _onAccentColorPick); }

    panel.querySelectorAll('[data-ts-oce-preset]').forEach(function (sw) {
      sw.addEventListener('click', function () {
        var hex = this.dataset.tsOcePreset;
        if (global.Toolskin && typeof global.Toolskin.setAccentHex === 'function') {
          global.Toolskin.setAccentHex(hex); syncColor(hex);
          panel.querySelectorAll('[data-ts-oce-preset]').forEach(function (s) { s.classList.remove('ts-grad-swatch--active'); });
          this.classList.add('ts-grad-swatch--active');
        }
      });
    });

    var randomBtn = panel.querySelector('[data-ts-oce-random-color]');
    if (randomBtn) randomBtn.addEventListener('click', function () {
      var hex = hslToHex(Math.floor(Math.random() * 360), 70 + Math.floor(Math.random() * 30), 45 + Math.floor(Math.random() * 20));
      if (global.Toolskin && typeof global.Toolskin.setAccentHex === 'function') { global.Toolskin.setAccentHex(hex); syncColor(hex); }
    });

    /* ── LAYOUT ── */
    // Radius
    var radiusSlider = panel.querySelector('#ts-oce-radius');
    if (radiusSlider) radiusSlider.addEventListener('input', function () {
      updateRange(this);
      if (global.Toolskin && typeof global.Toolskin.setRadius === 'function') global.Toolskin.setRadius(parseFloat(this.value));
    });
    panel.querySelectorAll('[data-ts-oce-radius-preset]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var v = parseFloat(this.dataset.tsOceRadiusPreset);
        if (radiusSlider) { radiusSlider.value = v; updateRange(radiusSlider); }
        if (global.Toolskin && typeof global.Toolskin.setRadius === 'function') global.Toolskin.setRadius(v);
      });
    });

    // Auto-bind schema-driven controls (handles CSS var updates via bind config)
    if (ui.schemas) {
      Object.keys(ui.schemas).forEach(function (tabName) {
        autobindAll(panel, ui.schemas[tabName], updateRange);
      });
    }

    // Spacing → scoped to #ts-main
    var spacingBase = panel.querySelector('#ts-oce-spacing-base');
    if (spacingBase) spacingBase.addEventListener('input', function () {
      updateRange(this);
      var v = parseFloat(this.value);
      setMainVar('--ts-sp-base', v + 'px');
      for (var i = 1; i <= 24; i++) setMainVar('--ts-sp-' + i, (v * i) + 'px');
    });

    // Type scale → set --ts-fs-base at :root (inline overrides `:root {}` specificity)
    // All --ts-fs-* tokens derive from it via calc() in the same :root context
    var typeScale = panel.querySelector('#ts-oce-type-scale');
    if (typeScale) typeScale.addEventListener('input', function () {
      updateRange(this);
      var s = parseFloat(this.value);
      document.documentElement.style.setProperty('--ts-fs-base', Math.round(15 * s) + 'px');
      panel.style.setProperty('--ts-fs-base', '15px'); // isolate panel
    });

    /* ── Font selectors ── */
    function loadGFont(fam) {
      var id = 'gf-' + fam.replace(/\s+/g, '-').toLowerCase();
      if (document.getElementById(id)) return;
      var l = document.createElement('link');
      l.id = id; l.rel = 'stylesheet';
      l.href = 'https://fonts.googleapis.com/css2?family=' + encodeURIComponent(fam) + ':wght@300;400;500;600;700;900&display=swap';
      document.head.appendChild(l);
    }

    var fontDisplay = panel.querySelector('#ts-oce-font-display');
    var fontBody = panel.querySelector('#ts-oce-font-body');
    if (fontDisplay) fontDisplay.addEventListener('change', function () {
      loadGFont(this.value);
      setMainVar('--ts-font-display', '"' + this.value + '",system-ui,sans-serif');
    });
    if (fontBody) fontBody.addEventListener('change', function () {
      loadGFont(this.value);
      setMainVar('--ts-font-body', '"' + this.value + '",system-ui,sans-serif');
    });

    // Preload banner generator fonts
    BANNER_FONTS.forEach(loadGFont);
    BODY_FONTS.forEach(loadGFont);

    // Apply font-family preview to select options after fonts load
    function applyFontPreviews() {
      panel.querySelectorAll('.ts-ui-select--font-preview .ts-ui-select__option').forEach(function (opt) {
        var text = opt.textContent.trim();
        opt.style.fontFamily = '"' + text + '",system-ui,sans-serif';
      });
    }
    // Run once after UIKit renders options, then again after fonts finish loading
    setTimeout(applyFontPreviews, 300);
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(applyFontPreviews);
    }

    /* ── Footer buttons ── */
    var footerReset = panel.querySelector('#ts-oce-footer-reset');
    if (footerReset) footerReset.addEventListener('click', function () {
      if (!confirm('Reset all editor settings to defaults?')) return;
      // Reset theme
      if (global.Toolskin) {
        suppressTransitions(function () { global.Toolskin.setTheme('dark'); });
        if (typeof global.Toolskin.setAccentHex === 'function') global.Toolskin.setAccentHex('#ff540a');
        if (typeof global.Toolskin.setRadius === 'function') global.Toolskin.setRadius(8);
        if (typeof global.Toolskin.resetSurfacePresets === 'function') global.Toolskin.resetSurfacePresets();
      }
      // Reset editor dynamic vars
      if (_editorSheet) _editorSheet.textContent = '';
      _editorVars = {};
      // Reset root overrides
      ['--ts-fs-base', '--ts-text-secondary', '--ts-text-muted'].forEach(function (v) {
        document.documentElement.style.removeProperty(v);
      });
      // Force sync accent color display to default
      syncColor('#ff540a');
      // Reload values
      initValues();
      syncConditionals();
      syncActiveStates();
      toast('All settings reset to defaults', 'success');
    });

    var footerSave = panel.querySelector('#ts-oce-footer-save');
    if (footerSave) footerSave.addEventListener('click', function () {
      toast('Settings saved (feature coming soon)', 'info');
    });

    var footerCopy = panel.querySelector('#ts-oce-footer-copy');
    if (footerCopy) footerCopy.addEventListener('click', function () {
      // Export current computed surface tokens
      if (global.Toolskin && typeof global.Toolskin.getSurfaceTokenMaps === 'function') {
        var maps = global.Toolskin.getSurfaceTokenMaps();
        navigator.clipboard.writeText(JSON.stringify(maps, null, 2));
        toast('Surface tokens copied to clipboard', 'success');
      }
    });

    /* ── Init ── */
    initValues();
    syncConditionals();
    syncActiveStates();
    syncModeConflicts();
    var savedTab = load('tab', 'hero');
    // Fallback: 'layout' tab was removed (merged into theme)
    if (savedTab === 'layout') savedTab = 'theme';
    if (savedTab !== 'hero') switchTab(savedTab);
    if (load('open', '0') === '1') setOpen(true);

    global.TsOffcanvasEditor = {
      open: function () { setOpen(true); },
      close: function () { setOpen(false); },
      toggle: function () { setOpen(!panel.classList.contains('ts-oce--open')); },
      syncColors: syncColor,
      refresh: function () { initValues(); populateSurfacePresets(); }
    };
  }

  /* ═══ INIT ═══ */
  function init() {
    if (!document.documentElement.hasAttribute('data-ts-offcanvas-editor')) return;
    if (document.body.dataset.tsOceBound === '1') return;
    var e = qs('ts-offcanvas-editor'); if (e) e.remove();
    var eo = qs('ts-offcanvas-editor-overlay'); if (eo) eo.remove();
    document.body.dataset.tsOceBound = '1';
    bind(buildUi(document.body));
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})(typeof window !== 'undefined' ? window : globalThis);

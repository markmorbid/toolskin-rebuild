/*!
 * Toolskin UI Kit — vanilla JS components (no jQuery).
 * Namespace: window.ToolskinUIKit
 * Prefix: ts-ui-* (CSS), data-ts-ui-* (attributes)
 * Aliases: .ts-accordion ↔ .ts-ui-accordion; data-ts-accordion-* ↔ data-ts-ui-accordion-* (mirrored in JS)
 * Safe to inject alongside Toolskin core; does not modify native prototypes.
 */
(function (global) {
  'use strict';

  /** Firefox only: Mozilla scrollbar props disable ::-webkit-scrollbar in Chromium if applied to the same element */
  try {
    var _ua = typeof navigator !== 'undefined' && navigator.userAgent ? navigator.userAgent : '';
    if (/Firefox\//i.test(_ua) || /\bFxiOS\b/i.test(_ua)) {
      document.documentElement.classList.add('ts-env-moz');
    }
  } catch (e) {}

  function sanitize(s) {
    const d = document.createElement('div');
    d.textContent = s == null ? '' : String(s);
    return d.innerHTML;
  }

  /** One capture-phase outside click + Escape for all selects (avoids per-instance bubble listeners broken by trigger stopPropagation). */
  let _tsUiSelectGlobalBound = false;
  function TSUISelectBindGlobalHandlers() {
    if (_tsUiSelectGlobalBound) return;
    _tsUiSelectGlobalBound = true;
    document.addEventListener(
      'click',
      function (e) {
        document.querySelectorAll('.ts-ui-select--open').forEach(function (w) {
          if (!w.contains(e.target) && typeof w.__tsUiSelectClose === 'function') {
            w.__tsUiSelectClose();
          }
        });
      },
      true
    );
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      document.querySelectorAll('.ts-ui-select--open').forEach(function (w) {
        if (typeof w.__tsUiSelectClose === 'function') {
          w.__tsUiSelectClose();
          if (w.__tsUiSelectTrigger && typeof w.__tsUiSelectTrigger.focus === 'function') {
            w.__tsUiSelectTrigger.focus();
          }
        }
      });
    });
  }

  function accordionIconHtml(ic) {
    if (!ic) return '';
    if (ic.indexOf('<') === 0) return ic;
    return '<i class="' + sanitize(ic) + '" aria-hidden="true"></i>';
  }

  /** Normalize optional alias class/attrs on accordion root */
  function TSUIAccordionNormalizeRoot(root) {
    if (!root || root.nodeType !== 1) return root;
    if (root.classList.contains('ts-accordion') && !root.classList.contains('ts-ui-accordion')) {
      root.classList.add('ts-ui-accordion');
    }
    if (root.hasAttribute('data-ts-accordion-multiple') && !root.hasAttribute('data-ts-ui-accordion-multiple')) {
      root.setAttribute('data-ts-ui-accordion-multiple', root.getAttribute('data-ts-accordion-multiple') || '');
    }
    if (root.getAttribute('data-ts-accordion-layout') === 'separated' && !root.classList.contains('ts-ui-accordion--separated')) {
      root.classList.add('ts-ui-accordion--separated');
    }
    if (root.getAttribute('data-ts-accordion-toggle') === 'plus' && !root.classList.contains('ts-ui-accordion--toggle-plus')) {
      root.classList.add('ts-ui-accordion--toggle-plus');
    }
    if (
      root.classList.contains('ts-ui-accordion--dual-icon') ||
      root.hasAttribute('data-ts-ui-accordion-dual-icon') ||
      root.getAttribute('data-ts-ui-accordion-dual-icon') === 'true' ||
      root.hasAttribute('data-ts-accordion-dual-icon') ||
      root.getAttribute('data-ts-accordion-dual-icon') === 'true'
    ) {
      root.classList.add('ts-ui-accordion--dual-icon');
    }
    root.querySelectorAll('.ts-accordion__item').forEach((el) => {
      if (!el.classList.contains('ts-ui-accordion__item')) el.classList.add('ts-ui-accordion__item');
    });
    root.querySelectorAll('.ts-accordion__header').forEach((el) => {
      if (!el.classList.contains('ts-ui-accordion__header')) el.classList.add('ts-ui-accordion__header');
    });
    root.querySelectorAll('.ts-accordion__panel').forEach((el) => {
      if (!el.classList.contains('ts-ui-accordion__panel')) el.classList.add('ts-ui-accordion__panel');
    });
    root.querySelectorAll('.ts-accordion__label').forEach((el) => {
      if (!el.classList.contains('ts-ui-accordion__label')) el.classList.add('ts-ui-accordion__label');
    });
    return root;
  }

  function TSUIAccordionEnhanceHeader(root, btn) {
    const item = btn.closest('.ts-ui-accordion__item');
    const dual = root.classList.contains('ts-ui-accordion--dual-icon');
    const togglePlus = root.classList.contains('ts-ui-accordion--toggle-plus');

    // ✅ PREVENT double enhancement
    if (btn.hasAttribute('data-ts-accordion-enhanced')) return;
    btn.setAttribute('data-ts-accordion-enhanced', 'true');

    // ✅ PRESERVE original label content before manipulation
    const existingLabel = btn.querySelector('.ts-ui-accordion__label');
    let labelText = '';
    if (existingLabel) {
      labelText = existingLabel.textContent.trim();
      // Remove existing label to prevent duplication
      existingLabel.remove();
    } else {
      // Extract text from button, excluding any existing icons
      labelText = Array.from(btn.childNodes)
        .filter(n => n.nodeType === Node.TEXT_NODE)
        .map(n => n.textContent.trim())
        .join(' ') || btn.textContent.trim();
    }

    // ✅ CREATE or get header-main container
    let main = btn.querySelector('.ts-ui-accordion__header-main');
    if (!main) {
      main = document.createElement('span');
      main.className = 'ts-ui-accordion__header-main';

      // Clear existing content except indicators
      const indicator = btn.querySelector('.ts-ui-accordion__indicator');
      btn.innerHTML = '';
      btn.appendChild(main);
      if (indicator) btn.appendChild(indicator);
    }

    // ✅ ADD icon if specified (only if not already present)
    const ic = btn.getAttribute('data-icon');
    if (ic && !main.querySelector('.ts-ui-accordion__icon')) {
      const iconWrap = document.createElement('span');
      iconWrap.className = 'ts-ui-accordion__icon';
      iconWrap.setAttribute('aria-hidden', 'true');
      iconWrap.innerHTML = accordionIconHtml(ic);
      main.appendChild(iconWrap);
    }

    // ✅ ADD label with preserved text (only if not already present)
    if (labelText && !main.querySelector('.ts-ui-accordion__label')) {
      const label = document.createElement('span');
      label.className = 'ts-ui-accordion__label';
      label.textContent = labelText;
      main.appendChild(label);
    }

    if (togglePlus && !btn.querySelector('.ts-ui-accordion__indicator')) {
      const ind = document.createElement('span');
      ind.className = 'ts-ui-accordion__indicator';
      ind.setAttribute('aria-hidden', 'true');
      btn.appendChild(ind);
    }

    if (dual) {
      const catIc =
        (item && item.getAttribute('data-ts-ui-accordion-category-icon')) ||
        (item && item.getAttribute('data-ts-accordion-category-icon')) ||
        root.getAttribute('data-ts-ui-accordion-category-icon') ||
        root.getAttribute('data-ts-accordion-category-icon');
      if (catIc && !btn.querySelector('.ts-ui-accordion__category-icon')) {
        const catWrap = document.createElement('span');
        catWrap.className = 'ts-ui-accordion__category-icon ts-accordion__category-icon';
        catWrap.setAttribute('aria-hidden', 'true');
        catWrap.innerHTML = accordionIconHtml(catIc);
        /* ✅ REMOVED: separator creation - using border instead */
        btn.insertBefore(catWrap, main);
      }
    }
  }

  /* ── Accordion ─────────────────────────────────────────────────── */
  function TSUIAccordion(root) {
    if (!root || root.__tsUiAccordion) return;
    TSUIAccordionNormalizeRoot(root);
    root.__tsUiAccordion = true;
    const multi =
      root.hasAttribute('data-ts-ui-accordion-multiple') || root.hasAttribute('data-ts-accordion-multiple');
    const items = root.querySelectorAll('.ts-ui-accordion__item');

    items.forEach((item) => {
      const btn = item.querySelector('.ts-ui-accordion__header');
      const panel = item.querySelector('.ts-ui-accordion__panel');
      if (!btn || !panel) return;

      TSUIAccordionEnhanceHeader(root, btn);

      const open = () => {
        if (!multi) {
          items.forEach((other) => {
            if (other === item) return;
            const p = other.querySelector('.ts-ui-accordion__panel');
            const b = other.querySelector('.ts-ui-accordion__header');
            if (p) {
              p.hidden = true;
              p.classList.remove('ts-ui-accordion__panel--open');
            }
            if (b) {
              b.setAttribute('aria-expanded', 'false');
              b.classList.remove('ts-ui-accordion__header--active');
            }
          });
        }
        panel.hidden = false;
        panel.classList.add('ts-ui-accordion__panel--open');
        btn.setAttribute('aria-expanded', 'true');
        btn.classList.add('ts-ui-accordion__header--active');
        root.dispatchEvent(
          new CustomEvent('ts-ui:accordion-open', { bubbles: true, detail: { item } })
        );
      };

      const close = () => {
        panel.hidden = true;
        panel.classList.remove('ts-ui-accordion__panel--open');
        btn.setAttribute('aria-expanded', 'false');
        btn.classList.remove('ts-ui-accordion__header--active');
      };

      btn.addEventListener('click', () => {
        if (panel.hidden) open();
        else close();
      });

      btn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          btn.click();
        }
      });
    });
  }

  /**
   * Build accordion DOM from a schema object, then wire TSUIAccordion.
   * @param {HTMLElement} container Parent to append to (or null to create a detached div)
   * @param {{ multiple?: boolean, layout?: 'default'|'separated', toggle?: 'chevron'|'plus', dualIcon?: boolean, categoryIcon?: string, items: Array<{ title: string, html?: string, icon?: string, categoryIcon?: string, open?: boolean }> }} schema
   */
  function TSUIAccordionFromSchema(container, schema) {
    schema = schema || {};
    const root = document.createElement('div');
    root.className = 'ts-ui-accordion';
    if (schema.multiple) root.setAttribute('data-ts-ui-accordion-multiple', '');
    if (schema.layout === 'separated') root.classList.add('ts-ui-accordion--separated');
    if (schema.toggle === 'plus') root.classList.add('ts-ui-accordion--toggle-plus');
    if (schema.dualIcon) root.classList.add('ts-ui-accordion--dual-icon');
    if (schema.categoryIcon) root.setAttribute('data-ts-ui-accordion-category-icon', schema.categoryIcon);

    (schema.items || []).forEach((it, idx) => {
      const item = document.createElement('div');
      item.className = 'ts-ui-accordion__item';
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'ts-ui-accordion__header';
      btn.setAttribute('aria-expanded', it.open ? 'true' : 'false');
      if (it.open) btn.classList.add('ts-ui-accordion__header--active');
      if (it.icon) btn.setAttribute('data-icon', it.icon);
      if (it.categoryIcon) item.setAttribute('data-ts-ui-accordion-category-icon', it.categoryIcon);
      const main = document.createElement('span');
      main.className = 'ts-ui-accordion__header-main';
      const label = document.createElement('span');
      label.className = 'ts-ui-accordion__label';
      label.textContent = it.title != null ? String(it.title) : 'Section ' + (idx + 1);
      main.appendChild(label);
      btn.appendChild(main);
      if (schema.toggle === 'plus') {
        const ind = document.createElement('span');
        ind.className = 'ts-ui-accordion__indicator';
        ind.setAttribute('aria-hidden', 'true');
        btn.appendChild(ind);
      }
      const panel = document.createElement('div');
      panel.className = 'ts-ui-accordion__panel';
      if (it.html != null) {
        const wrap = document.createElement('div');
        wrap.innerHTML = String(it.html);
        while (wrap.firstChild) panel.appendChild(wrap.firstChild);
      }
      if (!it.open) panel.hidden = true;
      else panel.classList.add('ts-ui-accordion__panel--open');
      item.appendChild(btn);
      item.appendChild(panel);
      root.appendChild(item);
    });

    if (container) container.appendChild(root);
    TSUIAccordion(root);
    return root;
  }

  /* ── Custom select (native <select> enhancement) ───────────────── */
  function TSUISelect(wrap) {
    if (!wrap || wrap.__tsUiSelect) return;
    const native = wrap.querySelector('select.ts-ui-select__native, select');
    if (!native) return;
    wrap.__tsUiSelect = true;
    TSUISelectBindGlobalHandlers();

    const searchEnabled = wrap.getAttribute('data-ts-ui-select-search') !== 'false';

    native.classList.add('ts-ui-select__native');
    native.setAttribute('tabindex', '-1');
    native.setAttribute('aria-hidden', 'true');

    const trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.className = 'ts-ui-select__trigger';
    trigger.setAttribute('aria-haspopup', 'listbox');
    trigger.setAttribute('aria-expanded', 'false');

    const label = document.createElement('span');
    label.className = 'ts-ui-select__value';
    trigger.appendChild(label);

    const chev = document.createElement('span');
    chev.className = 'ts-ui-select__chevron';
    chev.setAttribute('aria-hidden', 'true');
    const chevIc = document.createElement('span');
    chevIc.className = 'ts-icon';
    chevIc.setAttribute('data-ts-icon', 'fa-solid fa-chevron-down');
    chev.appendChild(chevIc);
    trigger.appendChild(chev);

    const drop = document.createElement('div');
    drop.className = 'ts-ui-select__dropdown';
    drop.hidden = true;
    drop.setAttribute('role', 'listbox');

    const searchWrap = document.createElement('div');
    searchWrap.className = 'ts-ui-select__search';
    const searchIcon = document.createElement('span');
    searchIcon.className = 'ts-ui-select__search-icon';
    searchIcon.setAttribute('aria-hidden', 'true');
    const searchIc = document.createElement('span');
    searchIc.className = 'ts-icon';
    searchIc.setAttribute('data-ts-icon', 'fa-solid fa-magnifying-glass');
    searchIcon.appendChild(searchIc);
    const filter = document.createElement('input');
    filter.type = 'search';
    filter.className = 'ts-ui-select__filter';
    filter.placeholder = wrap.getAttribute('data-ts-ui-select-placeholder') || 'Search…';
    filter.setAttribute('aria-label', 'Filter options');
    searchWrap.appendChild(searchIcon);
    searchWrap.appendChild(filter);

    const list = document.createElement('ul');
    list.className = 'ts-ui-select__list';
    list.setAttribute('role', 'presentation');
    if (wrap.hasAttribute('data-ts-ui-scrollbar-moz') && document.documentElement.classList.contains('ts-env-moz')) {
      list.classList.add('ts-ui-scrollbar--moz');
      drop.classList.add('ts-ui-scrollbar--moz');
    }

    if (searchEnabled) {
      drop.appendChild(searchWrap);
    } else {
      searchWrap.hidden = true;
      wrap.classList.add('ts-ui-select--no-search');
    }
    drop.appendChild(list);

    native.insertAdjacentElement('afterend', trigger);
    trigger.insertAdjacentElement('afterend', drop);
    if (global.ToolskinIcons && typeof ToolskinIcons.inject === 'function') {
      ToolskinIcons.inject(wrap);
    }

    function iconHtml(opt) {
      const ic = opt.getAttribute('data-icon');
      if (!ic) return '';
      if (ic.indexOf('<') === 0) return ic;
      return '<i class="' + sanitize(ic) + '" aria-hidden="true"></i>';
    }

    function syncList() {
      list.innerHTML = '';
      const q = searchEnabled ? (filter.value || '').toLowerCase() : '';
      Array.from(native.options).forEach((opt, idx) => {
        if (opt.disabled) return;
        const t = (opt.textContent || '').toLowerCase();
        if (q && t.indexOf(q) === -1) return;
        const li = document.createElement('li');
        li.className = 'ts-ui-select__option';
        li.setAttribute('role', 'option');
        li.dataset.value = opt.value;
        li.dataset.index = String(idx);
        li.innerHTML =
          '<span class="ts-ui-select__option-inner">' +
          iconHtml(opt) +
          '<span class="ts-ui-select__option-text">' +
          sanitize(opt.textContent) +
          '</span></span>';
        if (opt.selected) li.classList.add('ts-ui-select__option--selected');
        li.addEventListener('click', () => {
          native.selectedIndex = idx;
          native.dispatchEvent(new Event('change', { bubbles: true }));
          updateTrigger();
          close();
        });
        list.appendChild(li);
      });
    }

    function updateTrigger() {
      const opt = native.options[native.selectedIndex];
      label.innerHTML =
        iconHtml(opt) + '<span class="ts-ui-select__value-text">' + sanitize(opt.textContent) + '</span>';
    }

    function closeOthers() {
      document.querySelectorAll('.ts-ui-select--open').forEach(function (w) {
        if (w !== wrap && typeof w.__tsUiSelectClose === 'function') {
          w.__tsUiSelectClose();
        }
      });
    }

    function open() {
      closeOthers();
      drop.hidden = false;
      drop.removeAttribute('hidden');
      trigger.setAttribute('aria-expanded', 'true');
      wrap.classList.add('ts-ui-select--open');
      syncList();
      if (searchEnabled) {
        filter.value = '';
        filter.focus();
      }
    }

    function close() {
      drop.hidden = true;
      drop.setAttribute('hidden', '');
      trigger.setAttribute('aria-expanded', 'false');
      wrap.classList.remove('ts-ui-select--open');
    }

    wrap.__tsUiSelectClose = close;
    wrap.__tsUiSelectTrigger = trigger;

    trigger.addEventListener('click', () => {
      if (drop.hidden) open();
      else close();
    });

    if (searchEnabled) {
      filter.addEventListener('input', syncList);
    }

    native.addEventListener('change', updateTrigger);
    updateTrigger();
    syncList();
    close();
  }

  /* ── Spinner (number stepper) ──────────────────────────────────── */
  function TSUISpinner(el) {
    if (!el || el.__tsUiSpinner) return;
    el.__tsUiSpinner = true;
    const input = el.querySelector('input[type="number"]');
    const dec = el.querySelector('.ts-ui-spinner__dec');
    const inc = el.querySelector('.ts-ui-spinner__inc');
    if (!input) return;

    function stepBy(dir) {
      if (dir > 0) input.stepUp();
      else input.stepDown();
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
    }

    if (dec) dec.addEventListener('click', () => stepBy(-1));
    if (inc) inc.addEventListener('click', () => stepBy(1));
  }

  /* ── Draggable (pointer + optional parent bounds) ─────────────── */
  function getTranslate(el) {
    const st = el.style.transform;
    if (st && st.indexOf('translate') === 0) {
      const m = st.match(/translate\(([-0-9.]+)px,\s*([-0-9.]+)px\)/);
      if (m) return { x: parseFloat(m[1]), y: parseFloat(m[2]) };
    }
    return { x: 0, y: 0 };
  }

  function clampElInsideParent(el, parent, pad) {
    if (!parent) return;
    const pr = parent.getBoundingClientRect();
    const er = el.getBoundingClientRect();
    const p = pad || 0;
    let dx = 0;
    let dy = 0;
    if (er.left < pr.left + p) dx = pr.left + p - er.left;
    if (er.top < pr.top + p) dy = pr.top + p - er.top;
    if (er.right > pr.right - p) dx = pr.right - p - er.right;
    if (er.bottom > pr.bottom - p) dy = pr.bottom - p - er.bottom;
    if (dx === 0 && dy === 0) return;
    const t = getTranslate(el);
    el.style.transform = 'translate(' + (t.x + dx) + 'px,' + (t.y + dy) + 'px)';
  }

  /** Simple post-drag separation for sibling .ts-ui-draggable in the same parent. */
  function nudgeOutOfSiblings(el, parent, pad) {
    if (!parent) return;
    const p = pad || 0;
    const siblings = [...parent.children].filter(
      (n) => n !== el && n.classList && n.classList.contains('ts-ui-draggable')
    );
    for (let iter = 0; iter < 24; iter++) {
      let er = el.getBoundingClientRect();
      let hit = false;
      for (const sib of siblings) {
        const sr = sib.getBoundingClientRect();
        if (er.right <= sr.left + p || er.left >= sr.right - p || er.bottom <= sr.top + p || er.top >= sr.bottom - p) {
          continue;
        }
        hit = true;
        const t = getTranslate(el);
        const cx = (Math.min(er.right, sr.right) + Math.max(er.left, sr.left)) / 2;
        const sx = (sr.left + sr.right) / 2;
        const dx = cx < sx ? -Math.min(12, er.right - sr.left + p) : Math.min(12, sr.right - er.left + p);
        const cy = (Math.min(er.bottom, sr.bottom) + Math.max(er.top, sr.top)) / 2;
        const sy = (sr.top + sr.bottom) / 2;
        const dy = cy < sy ? -Math.min(12, er.bottom - sr.top + p) : Math.min(12, sr.bottom - er.top + p);
        el.style.transform = 'translate(' + (t.x + dx) + 'px,' + (t.y + dy) + 'px)';
        clampElInsideParent(el, parent, pad);
        break;
      }
      if (!hit) break;
    }
  }

  function TSUIDraggable(el, opts) {
    opts = opts || {};
    if (!el || el.__tsUiDraggable) return;
    el.__tsUiDraggable = true;
    const handle = opts.handle ? el.querySelector(opts.handle) : el;
    if (!handle) return;

    const boundsMode = el.getAttribute('data-ts-ui-draggable-bounds');
    const pad = parseFloat(el.getAttribute('data-ts-ui-draggable-padding') || '6') || 0;
    const parent = boundsMode === 'parent' ? el.parentElement : null;

    let pid = null;
    let sx = 0;
    let sy = 0;
    let ox = 0;
    let oy = 0;

    if (!el.style.position) el.style.position = 'relative';

    handle.style.touchAction = 'none';
    handle.style.cursor = 'grab';

    handle.addEventListener('pointerdown', (e) => {
      if (e.button !== 0) return;
      pid = e.pointerId;
      handle.setPointerCapture(pid);
      sx = e.clientX;
      sy = e.clientY;
      const p = getTranslate(el);
      ox = p.x;
      oy = p.y;
      handle.style.cursor = 'grabbing';
      el.classList.add('ts-ui-draggable--dragging');

      function move(ev) {
        if (ev.pointerId !== pid) return;
        const dx = ev.clientX - sx;
        const dy = ev.clientY - sy;
        el.style.transform = 'translate(' + (ox + dx) + 'px,' + (oy + dy) + 'px)';
        if (parent) clampElInsideParent(el, parent, pad);
        const t2 = getTranslate(el);
        ox = t2.x;
        oy = t2.y;
        sx = ev.clientX;
        sy = ev.clientY;
      }

      function up(ev) {
        if (ev.pointerId !== pid) return;
        try {
          handle.releasePointerCapture(pid);
        } catch (_) {}
        window.removeEventListener('pointermove', move);
        window.removeEventListener('pointerup', up);
        handle.style.cursor = 'grab';
        el.classList.remove('ts-ui-draggable--dragging');
        let p2 = getTranslate(el);
        const overlapMode = el.getAttribute('data-ts-ui-draggable-overlap') || 'allow';
        if (overlapMode === 'avoid' && parent) {
          nudgeOutOfSiblings(el, parent, pad);
          p2 = getTranslate(el);
        }
        el.dispatchEvent(
          new CustomEvent('ts-ui:drag-end', { bubbles: true, detail: { x: p2.x, y: p2.y } })
        );
      }

      window.addEventListener('pointermove', move);
      window.addEventListener('pointerup', up);
    });
  }

  /* ── Resizable (corner handle) ─────────────────────────────────── */
  function TSUIResizable(el) {
    if (!el || el.__tsUiResizable) return;
    el.__tsUiResizable = true;
    const h = el.querySelector('.ts-ui-resizable__handle');
    if (!h) return;

    let pid = null;
    let sw = 0;
    let sh = 0;
    let sx = 0;
    let sy = 0;

    h.addEventListener('pointerdown', (e) => {
      if (e.button !== 0) return;
      pid = e.pointerId;
      h.setPointerCapture(pid);
      const r = el.getBoundingClientRect();
      sw = r.width;
      sh = r.height;
      sx = e.clientX;
      sy = e.clientY;
      el.classList.add('ts-ui-resizable--resizing');

      function move(ev) {
        if (ev.pointerId !== pid) return;
        const dx = ev.clientX - sx;
        const dy = ev.clientY - sy;
        el.style.width = Math.max(120, sw + dx) + 'px';
        el.style.height = Math.max(80, sh + dy) + 'px';
      }

      function up(ev) {
        if (ev.pointerId !== pid) return;
        h.releasePointerCapture(pid);
        window.removeEventListener('pointermove', move);
        window.removeEventListener('pointerup', up);
        el.classList.remove('ts-ui-resizable--resizing');
      }

      window.addEventListener('pointermove', move);
      window.addEventListener('pointerup', up);
    });
  }
/* ── Sortable list (pointer + ghost + FLIP displacement) ─ */
function TSUISortable(el) {
  if (!el || el.__tsUiSortable) return;
  el.__tsUiSortable = true;

  const handleOnly = el.hasAttribute('data-ts-ui-sort-handle-only');
  const handleSel  = el.getAttribute('data-ts-ui-sort-handle') || '.ts-ui-sortable__handle';
  const dragSel    = el.getAttribute('data-ts-ui-sort-drag');

  /* ── FLIP helper ──
     Snapshots every sibling's Y position before a DOM move,
     then applies an inverse translateY that the CSS transition
     animates back to 0 → smooth displacement. */
  function flipSnapshot(container, exclude) {
    const map = new Map();
    for (const child of container.children) {
      if (child === exclude) continue;
      map.set(child, child.getBoundingClientRect().top);
    }
    return map;
  }

  function flipAnimate(snapshot, container, exclude) {
    for (const [child, oldTop] of snapshot) {
      if (child === exclude || !child.isConnected) continue;
      const newTop = child.getBoundingClientRect().top;
      const delta  = oldTop - newTop;
      if (Math.abs(delta) < 1) continue;
      // Jump to old position, let CSS transition animate to 0
      child.style.transform = `translateY(${delta}px)`;
      // Force reflow so the browser registers the "from" position
      child.offsetHeight; // eslint-disable-line no-unused-expressions
      child.style.transform = '';
    }
  }

  el.querySelectorAll(':scope > .ts-ui-sortable__item').forEach((item) => {
    let dragHandle = item;
    if (dragSel) {
      dragHandle = item.querySelector(dragSel) || item;
    } else if (handleOnly) {
      dragHandle = item.querySelector(handleSel);
    }
    if (!dragHandle) return;

    dragHandle.addEventListener('pointerdown', (e) => {
      if (dragSel && !e.target.closest(dragSel)) return;
      if (handleOnly && !dragSel && !e.target.closest(handleSel)) return;
      if (e.button !== 0) return;
      e.preventDefault();

      const dragItem = item;
      let pid = e.pointerId;
      dragHandle.setPointerCapture(pid);

      const rect = dragItem.getBoundingClientRect();
      const offsetX = e.clientX - rect.left;
      const offsetY = e.clientY - rect.top;

      /* ── Sorting mode class: enables displacement transitions via CSS ── */
      el.classList.add('ts-ui-sortable--sorting');

      /* ── Placeholder ── */
      const placeholder = document.createElement('div');
      placeholder.className = 'ts-ui-sortable__placeholder';
      placeholder.style.height = rect.height + 'px';
      dragItem.parentNode.insertBefore(placeholder, dragItem);

      /* ── Ghost clone ── */
      const ghost = dragItem.cloneNode(true);
      if (ghost.id) ghost.removeAttribute('id');
      ghost.querySelectorAll('[id]').forEach((n) => n.removeAttribute('id'));
      ghost.classList.add('ts-ui-sortable__ghost');
      ghost.classList.remove('ts-ui-sortable__item--source');
      Object.assign(ghost.style, {
        position: 'fixed',
        left: rect.left + 'px',
        top: rect.top + 'px',
        width: rect.width + 'px',
        margin: '0',
        zIndex: '100000',
        pointerEvents: 'none',
        boxSizing: 'border-box',
      });
      document.body.appendChild(ghost);

      /* ── Collapse source item (CSS handles the visual collapse via --source class) ── */
      dragItem.classList.add('ts-ui-sortable__item--source');

      /* ── Move placeholder with FLIP animation ── */
      function movePlaceholder(clientY) {
        const nodes = [...el.children].filter(
          (n) =>
            n !== dragItem &&
            (n.classList.contains('ts-ui-sortable__item') ||
             n.classList.contains('ts-ui-sortable__placeholder'))
        );

        // Find target position
        let target = null;
        for (let i = 0; i < nodes.length; i++) {
          const node = nodes[i];
          if (node === placeholder) continue;
          const r   = node.getBoundingClientRect();
          const mid = r.top + r.height / 2;
          if (clientY < mid) { target = node; break; }
        }

        // Skip if placeholder is already in the right spot
        const currentNext = placeholder.nextElementSibling;
        if (target === currentNext) return;
        if (!target && currentNext === null) return;

        // FLIP: snapshot → DOM move → animate
        const snap = flipSnapshot(el, dragItem);

        if (target) {
          el.insertBefore(placeholder, target);
        } else {
          el.appendChild(placeholder);
        }

        flipAnimate(snap, el, dragItem);
      }

      function move(ev) {
        if (ev.pointerId !== pid) return;
        ghost.style.left = ev.clientX - offsetX + 'px';
        ghost.style.top  = ev.clientY - offsetY + 'px';
        movePlaceholder(ev.clientY);
      }

      function up(ev) {
        if (ev.pointerId !== pid) return;
        try { dragHandle.releasePointerCapture(pid); } catch (_) {}
        window.removeEventListener('pointermove', move);
        window.removeEventListener('pointerup', up);

        ghost.remove();

        if (placeholder && placeholder.parentNode) {
          placeholder.parentNode.insertBefore(dragItem, placeholder);
          placeholder.remove();
        }

        dragItem.classList.remove('ts-ui-sortable__item--source');
        el.classList.remove('ts-ui-sortable--sorting');

        // Clean up any lingering transforms from FLIP
        for (const child of el.children) {
          child.style.transform = '';
        }

        el.dispatchEvent(new CustomEvent('ts-ui:sort-end', { bubbles: true }));
      }

      move(e);
      window.addEventListener('pointermove', move);
      window.addEventListener('pointerup', up);
    });
  });
}

  /* ── Table: bulk row selection + floating bar ─────────────────── */
  function TSUITableBulk(wrap) {
    if (!wrap || wrap.__tsUiTableBulk) return;
    const table = wrap.querySelector('table.ts-ui-table--bulk');
    if (!table) return;
    wrap.__tsUiTableBulk = true;

    const bar = wrap.querySelector('.ts-ui-bulk-bar');
    const countEl = bar && bar.querySelector('.ts-ui-bulk-bar__count');
    const selectAll = table.querySelector('thead .ts-ui-table__select-all');

    function rowCheckboxes() {
      return table.querySelectorAll('tbody .ts-ui-row-checkbox');
    }

    function update() {
      const checks = rowCheckboxes();
      let n = 0;
      checks.forEach((c) => {
        const tr = c.closest('tr');
        if (!tr) return;
        if (c.checked) {
          tr.classList.add('ts-ui-row--selected');
          n++;
        } else {
          tr.classList.remove('ts-ui-row--selected');
        }
      });
      if (bar) {
        bar.hidden = n === 0;
        bar.style.display = n === 0 ? 'none' : '';
      }
      if (countEl) countEl.textContent = n + ' selected';
      if (selectAll) {
        const total = checks.length;
        selectAll.indeterminate = n > 0 && n < total;
        selectAll.checked = total > 0 && n === total;
      }
    }

    table.addEventListener('change', (e) => {
      const t = e.target;
      if (!t || !(t instanceof HTMLInputElement)) return;
      if (t.classList.contains('ts-ui-table__select-all')) {
        const on = t.checked;
        rowCheckboxes().forEach((c) => {
          c.checked = on;
        });
        update();
        return;
      }
      if (t.classList.contains('ts-ui-row-checkbox')) {
        update();
      }
    });

    update();
  }

  /* ── Enhanced toast (parallel to ToolskinToast, richer styling) ─ */
  const TSUIToast = {
    _container: null,
    getContainer() {
      if (!this._container) {
        this._container = document.createElement('div');
        this._container.className = 'ts-ui-toast-stack';
        document.body.appendChild(this._container);
      }
      return this._container;
    },
    show(message, opts) {
      opts = opts || {};
      const type = opts.type || 'default';
      const duration = opts.duration != null ? opts.duration : 4500;
      const title = opts.title || '';
      const icons = {
        success: 'fa-solid fa-circle-check',
        warning: 'fa-solid fa-triangle-exclamation',
        error: 'fa-solid fa-circle-xmark',
        info: 'fa-solid fa-circle-info',
        default: 'fa-solid fa-bell',
      };
      const icon = opts.icon || icons[type] || icons.default;

      const el = document.createElement('div');
      el.className = 'ts-ui-toast ts-ui-toast--' + type;
      el.setAttribute('role', 'status');
      el.innerHTML =
        '<div class="ts-ui-toast__track"></div>' +
        '<div class="ts-ui-toast__row">' +
        '<span class="ts-ui-toast__icon"><i class="' +
        sanitize(icon) +
        '"></i></span>' +
        '<div class="ts-ui-toast__body">' +
        (title ? '<div class="ts-ui-toast__title">' + sanitize(title) + '</div>' : '') +
        '<div class="ts-ui-toast__msg">' +
        sanitize(message) +
        '</div></div>' +
        '<button type="button" class="ts-ui-toast__close" aria-label="Dismiss"><i class="fa-solid fa-xmark"></i></button></div>';

      const track = el.querySelector('.ts-ui-toast__track');
      const close = () => {
        el.classList.add('ts-ui-toast--out');
        setTimeout(() => el.remove(), 280);
      };
      el.querySelector('.ts-ui-toast__close').addEventListener('click', close);
      this.getContainer().appendChild(el);

      if (duration > 0 && track) {
        track.style.transition = 'transform ' + duration + 'ms linear';
        requestAnimationFrame(() => {
          track.classList.add('ts-ui-toast__track--animate');
        });
        setTimeout(close, duration);
      }
      return el;
    },
  };

  /* ── Table sort (data-sort-key + data-value, or legacy data-ts-ui-sort) ─ */
  function TSUITableSort(table) {
    if (!table || table.__tsUiTableSort) return;
    table.__tsUiTableSort = true;
    const thead = table.querySelector('thead');
    const tbody = table.querySelector('tbody');
    if (!thead || !tbody) return;

    const keyHeaders = [...thead.querySelectorAll('th[data-sort-key]')];
    const legacyMode = keyHeaders.length === 0;

    function compareCells(aCell, bCell, reverse) {
      if (!aCell || !bCell) return 0;
      const aText =
        aCell.dataset.value != null && aCell.dataset.value !== '' ? aCell.dataset.value : aCell.textContent.trim();
      const bText =
        bCell.dataset.value != null && bCell.dataset.value !== '' ? bCell.dataset.value : bCell.textContent.trim();
      const aNum = parseFloat(aText);
      const bNum = parseFloat(bText);
      let comparison = 0;
      if (!isNaN(aNum) && !isNaN(bNum)) {
        comparison = aNum - bNum;
      } else {
        comparison = String(aText).localeCompare(String(bText), undefined, {
          sensitivity: 'base',
          numeric: true,
        });
      }
      return reverse ? -comparison : comparison;
    }

    if (!legacyMode) {
      keyHeaders.forEach((th) => {
        th.style.cursor = 'pointer';
        th.classList.add('ts-ui-th--sortable');
        th.addEventListener('click', () => {
          const columnKey = th.dataset.sortKey;
          const isReversed =
            th.classList.contains('ts-ui-th--active') && !th.classList.contains('ts-ui-th--reverse');
          keyHeaders.forEach((h) => {
            h.classList.remove('ts-ui-th--active', 'ts-ui-th--reverse');
            if (h.dataset.sortKey === columnKey) {
              h.classList.add('ts-ui-th--active');
              if (isReversed) h.classList.add('ts-ui-th--reverse');
            }
          });
          const columnIndex = [...th.parentNode.children].indexOf(th);
          if (columnIndex === -1) return;
          const rows = [...tbody.querySelectorAll('tr')];
          rows.sort((a, b) => {
            const aCell = a.children[columnIndex];
            const bCell = b.children[columnIndex];
            return compareCells(aCell, bCell, isReversed);
          });
          tbody.append(...rows);
        });
      });
      return;
    }

    const ths = table.querySelectorAll('thead th[data-ts-ui-sort]');
    ths.forEach((th) => {
      th.style.cursor = 'pointer';
      th.classList.add('ts-ui-th--sortable');
      th.addEventListener('click', () => {
        const col = parseInt(th.getAttribute('data-ts-ui-sort'), 10) || 0;
        const asc = th.classList.toggle('ts-ui-th--sort-asc');
        th.classList.toggle('ts-ui-th--sort-desc', !asc);
        ths.forEach((h) => {
          if (h !== th) h.classList.remove('ts-ui-th--sort-asc', 'ts-ui-th--sort-desc');
        });
        const rows = [...tbody.querySelectorAll('tr')];
        rows.sort((a, b) => compareCells(a.cells[col], b.cells[col], !asc));
        tbody.append(...rows);
      });
    });
  }


  /* ── Auto-enhance standalone <input type="number"> (YSS-style chevrons) ─ */
  function TSUIEnhanceNumberInput(input) {
    if (!input || !(input instanceof HTMLInputElement) || input.type !== 'number') {
      return input;
    }
    if (input.closest('.ts-ui-spinner') || input.closest('.ts-ui-number-input-wrapper')) {
      return input.parentElement || input;
    }

    const wrapper = document.createElement('div');
    wrapper.className = 'ts-ui-number-input-wrapper';
    if (input.parentNode) input.parentNode.insertBefore(wrapper, input);
    wrapper.appendChild(input);

    const controls = document.createElement('div');
    controls.className = 'ts-ui-number-input-controls';

    const upBtn = document.createElement('button');
    upBtn.type = 'button';
    upBtn.className = 'ts-ui-number-btn';
    upBtn.setAttribute('aria-label', 'Increment');
    upBtn.innerHTML = '<i class="fa-solid fa-chevron-up" aria-hidden="true"></i>';
    upBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      input.stepUp();
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
    });

    const downBtn = document.createElement('button');
    downBtn.type = 'button';
    downBtn.className = 'ts-ui-number-btn';
    downBtn.setAttribute('aria-label', 'Decrement');
    downBtn.innerHTML = '<i class="fa-solid fa-chevron-down" aria-hidden="true"></i>';
    downBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      input.stepDown();
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
    });

    controls.appendChild(upBtn);
    controls.appendChild(downBtn);
    wrapper.appendChild(controls);
    return wrapper;
  }

  const _enhancedNumberInputs = new WeakSet();
  let _numberInputObserver = null;

  function TSUIEnhanceNumberInputsIn(root) {
    const scope = root || document;
    scope.querySelectorAll('input[type="number"]:not(.ts-ui-number-input-wrapper input)').forEach((input) => {
      if (input.closest('.ts-ui-spinner')) return;
      if (_enhancedNumberInputs.has(input)) return;
      try {
        TSUIEnhanceNumberInput(input);
        _enhancedNumberInputs.add(input);
      } catch (e) {
        console.warn('ToolskinUIKit: number input enhance failed', e);
      }
    });
  }

  function TSUIEnsureNumberInputObserver() {
    if (_numberInputObserver) return;
    const target = document.body;
    if (!target) return;
    _numberInputObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType !== Node.ELEMENT_NODE) return;
          if (node instanceof HTMLInputElement && node.type === 'number') {
            if (!node.closest('.ts-ui-spinner') && !_enhancedNumberInputs.has(node)) {
              try {
                TSUIEnhanceNumberInput(node);
                _enhancedNumberInputs.add(node);
              } catch (_) {}
            }
          }
          if (node.querySelectorAll) {
            node
              .querySelectorAll('input[type="number"]:not(.ts-ui-number-input-wrapper input)')
              .forEach((input) => {
                if (input.closest('.ts-ui-spinner') || _enhancedNumberInputs.has(input)) return;
                try {
                  TSUIEnhanceNumberInput(input);
                  _enhancedNumberInputs.add(input);
                } catch (_) {}
              });
          }
        });
      });
    });
    _numberInputObserver.observe(target, { childList: true, subtree: true });
  }

  /* ── Masonry v2 (CSS columns + reflow) ─────────────────────────── */
  function TSUIMasonryGrid(el) {
    if (!el || el.__tsUiMasonry) return;
    el.__tsUiMasonry = true;
    if (el.classList.contains('ts-ui-masonry--lanes') || el.classList.contains('ts-ui-masonry--grid')) {
      return;
    }
    const gap = parseInt(getComputedStyle(el).getPropertyValue('--ts-ui-masonry-gap') || '16', 10) || 16;

    function relayout() {
      const items = el.querySelectorAll('.ts-ui-masonry__item');
      el.style.columnGap = gap + 'px';
      items.forEach((node) => {
        node.style.breakInside = 'avoid';
        node.style.marginBottom = gap + 'px';
      });
    }

    relayout();
    el.querySelectorAll('img').forEach((img) => {
      img.addEventListener('load', relayout);
      if (img.complete) relayout();
    });
    new ResizeObserver(relayout).observe(el);
  }

  /** @deprecated typo alias — use TSUIMasonryGrid */
  var TSUMasonryGrid = TSUIMasonryGrid;

  /* ── Public API ────────────────────────────────────────────────── */
  function init(scope) {
    const root = scope || document;
    root.querySelectorAll('.ts-ui-accordion, .ts-accordion').forEach(TSUIAccordion);
    root.querySelectorAll('.ts-ui-select').forEach(TSUISelect);
    root.querySelectorAll('.ts-ui-spinner').forEach(TSUISpinner);
    root.querySelectorAll('.ts-ui-draggable').forEach((el) => TSUIDraggable(el));
    root.querySelectorAll('.ts-ui-resizable').forEach(TSUIResizable);
    root.querySelectorAll('.ts-ui-sortable').forEach(TSUISortable);
    root.querySelectorAll('table.ts-ui-table--sortable').forEach(TSUITableSort);
    root.querySelectorAll('.ts-ui-table-bulk-wrap').forEach(TSUITableBulk);
    root.querySelectorAll('.ts-ui-masonry--v2').forEach(TSUMasonryGrid);
    TSUIEnsureNumberInputObserver();
    TSUIEnhanceNumberInputsIn(root);
  }

  global.ToolskinUIKit = {
    init: init,
    Accordion: TSUIAccordion,
    AccordionFromSchema: TSUIAccordionFromSchema,
    Select: TSUISelect,
    Spinner: TSUISpinner,
    Draggable: TSUIDraggable,
    Resizable: TSUIResizable,
    Sortable: TSUISortable,
    Toast: TSUIToast,
    TableSort: TSUITableSort,
    TableBulk: TSUITableBulk,
    EnhanceNumberInput: TSUIEnhanceNumberInput,
    EnhanceNumberInputsIn: TSUIEnhanceNumberInputsIn,
    MasonryGrid: TSUIMasonryGrid,
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => init(document));
  } else {
    init(document);
  }
})(typeof window !== 'undefined' ? window : this);

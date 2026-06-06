function toggleFlex(id) {
    const el = document.getElementById(id);
    el.style.display = (el.style.display === 'flex') ? 'none' : 'flex';
}
function toggleSingleClass(id, className) {
    document.getElementById(id).classList.toggle(className);
}
/* ═══════════════════════════════════════════════════════════════════════
 *  MOCKUP ACTION MAP  —  JSON/schema-based dynamic binding
 *
 *  Instead of inline onclick="loadContent(...)" in each HTML,
 *  this config maps selectors → actions for every page type.
 *  Detected automatically from the DOM on DOMContentLoaded.
 *
 *  Action types:
 *    modal    → loadContent(url, 'modal-container')
 *    toggle   → toggle display:flex/none on target element
 *    class    → toggle a CSS class on target element
 *    toast    → show a simulated notification
 *    navigate → window.location.href
 * ═══════════════════════════════════════════════════════════════════════ */

/**
 * Shared header / chrome actions for both YSS Studio and Watch mockups.
 * (Theme modal controls bind inside loadContent — those IDs are not in the page shell.)
 */
var YSS_HEADER_ACTIONS = [
    // ── Header nav — modals ──
    { sel: '.yss-help-button[title*="Help"]', action: 'modal', url: 'yss-toolpanel-modal_help.html' },
    { sel: '.yss-help-button[title*="Readme"]', action: 'modal', url: 'yss-toolpanel-modal_readme.html' },
    { sel: '#yss-theme-select-btn', action: 'modal', url: 'yss-toolpanel-modal_theme.html' },
    // ── Header nav — panel chrome (synced with Theme modal toggles when open) ──
    { sel: '#yss-icons-only-toggle-btn', action: 'yssIconOnly' },
    { sel: '#yss-icons-only-toggle-btn-clone', action: 'yssIconOnly' },
    { sel: '#yss-toggle-collapse', action: 'class', target: '#yss-panel', cls: 'collapsed' },
    // ── Header nav — simulated / mock state ──
    { sel: '#yss-sort-rows-btn', action: 'toast', msg: 'Videos sorted alphabetically A→Z' },
    { sel: '#yss-tooltip-toggle-btn', action: 'yssTooltipsToggle' },
    { sel: '#yss-transitions-toggle-btn', action: 'yssTransitionsToggle' },
];

var MOCKUP_ACTIONS = {

    /* ── YSS Studio Mode ────────────────────────────────────────────── */
    'yss-studio': {
        detect: function () {
            var p = document.getElementById('yss-panel');
            return p && !p.classList.contains('yss-watch-mode');
        },
        hamburger: { btn: '#yss-hamburger', nav: '#yss-header-nav' },
        actions: [
            // ── Page-level nav ──
            { sel: '#switch-mode', action: 'navigate', url: 'yss-toolpanel-watch-mockup.html' },
        ].concat(YSS_HEADER_ACTIONS, [
            // ── Controls row 1 ──
            { sel: '#yss-start-stop-btn', action: 'modal', url: 'yss-toolpanel-modal_scheduler_real.html' },
            { sel: '#yss-unlist-btn', action: 'toast', msg: 'Un-List: requires "Scheduled" visibility filter' },
            { sel: '#yss-publish-drafts-btn', action: 'modal', url: 'yss-toolpanel-modal_undraft.html' },
            { sel: '#yss-draft-to-schedule-btn', action: 'toast', msg: 'Draft → Schedule workflow would start here' },
            { sel: '#yss-toggle-collapse-group', action: 'class', target: '.button_row.toggleable', cls: 'collapsed' },
            // ── Controls row 2 (toggleable) ──
            { sel: '#yss-disable-all-notifs-btn', action: 'modal', url: 'yss-toolpanel-modal_disablenotifs.html' },
            { sel: '#yss-bulk-downloader-btn', action: 'modal', url: 'yss-toolpanel-modal_downloader.html' },
            { sel: '#yss-bulk-uploader-btn', action: 'modal', url: 'yss-toolpanel-modal_uploader.html' },
            // ── Summary modals (accessible via status block buttons) ──
            { sel: '#yss-summary-notifs-btn', action: 'modal', url: 'yss-toolpanel-modal_summary_notifs.html' },
            { sel: '#yss-summary-downloader-btn', action: 'modal', url: 'yss-toolpanel-modal_summary_downloader.html' },
            { sel: '#yss-csv-scrape-btn', action: 'toast', msg: 'Export Data: scraping video data to CSV…' },
            { sel: '#yss-scrape-btn', action: 'toast', msg: 'Scraping video titles from current view…' },
            { sel: '#yss-calendar-modal-btn', action: 'modal', url: 'yss-toolpanel-modal_calendar.html' },
            { sel: '#yss-toggle-collapse-status-block', action: 'toggle', target: '#yss-status-block' },
            // ── Status / Log actions ──
            { sel: '#yss-csv-download-btn', action: 'toast', msg: 'CSV download would trigger here' },
        ])
    },

    /* ── YSS Watch Mode ─────────────────────────────────────────────── */
    'yss-watch': {
        detect: function () {
            var p = document.getElementById('yss-panel');
            return p && p.classList.contains('yss-watch-mode');
        },
        hamburger: { btn: '#yss-hamburger', nav: '#yss-header-nav' },
        actions: [
            // ── Page-level nav ──
            { sel: '#switch-mode', action: 'navigate', url: 'yss-toolpanel-studio-mockup.html' },
        ].concat(YSS_HEADER_ACTIONS, [
            // ── Transcript row ──
            { sel: '#yss-fetch-transcript-btn', action: 'toast', msg: 'Fetching transcript for current video…' },
            { sel: '#yss-batch-transcript-btn', action: 'toggle', target: '#yt-batch-controls-wrapper' },
            // ── Summarizer row ──
            { sel: '#yss-summarize-video-btn', action: 'toast', msg: 'Summarizing video with Gemini AI…' },
            { sel: '#yss-summarizer-toggle-btn', action: 'toggle', target: '#yt-sum-batch-controls-wrapper' },
            { sel: '#yss-summarizer-settings-btn', action: 'toast', msg: 'Summarizer settings would open here' },
            { sel: '#yss-summarizer-history-btn', action: 'modal', url: 'yss-toolpanel-modal_transcript_summary.html' },
        ])
    },

    /* ── Suno ────────────────────────────────────────────────────────── */
    'suno': {
        detect: function () { return !!document.getElementById('suno-panel'); },
        actions: [
            { sel: '.suno-panel-header-btn[data-tooltip*="Help"]', action: 'modal', url: 'suno-toolpanel-modal_help.html' },
            { sel: '.suno-panel-header-btn[data-tooltip="Settings"]', action: 'modal', url: 'suno-toolpanel-modal_settings.html' },
            { sel: '#suno-toggle-status', action: 'modal', url: 'suno-toolpanel-modal_trackstatus.html' },
            { sel: '#suno-bulk-view-queue', action: 'modal', url: 'suno-toolpanel-modal_queue.html' },
            { sel: '#activate-suno-script', action: 'toast', msg: 'Track generation would start here…' },
            { sel: '#suno-bulk-all', action: 'toast', msg: 'Fetching all tracks from workspace…' },
            { sel: '#suno-bulk-download', action: 'toast', msg: 'Bulk download would start here…' },
            { sel: '.suno-panel-header-btn[data-tooltip="Minimize Panel"]', action: 'toast', msg: 'Panel would minimize here' },
        ]
    },

    /* ── Higgsfield ──────────────────────────────────────────────────── */
    'hf': {
        detect: function () { return !!document.getElementById('hf-panel'); },
        actions: [
            { sel: '.hf-header-btn[data-tooltip*="Help"]', action: 'modal', url: 'hf-toolpanel-modal_help.html' },
            { sel: '#hf-btn-dashboard', action: 'modal', url: 'hf-toolpanel-modal_dashboard.html' },
            { sel: '.hf-header-btn[data-tooltip="Settings"]', action: 'toast', msg: 'HF Settings would open here' },
            { sel: '.hf-header-btn[data-tooltip="Minimize Panel"]', action: 'toast', msg: 'Panel would minimize here' },
            { sel: '#hf-btn-start', action: 'toast', msg: 'Queue processing would start here…' },
            { sel: '#hf-btn-prefetch', action: 'toast', msg: 'Pre-fetch DOM scan would start here…' },
            { sel: '#hf-btn-import-csv', action: 'modal', url: 'hf-toolpanel-modal_dashboard-import.html' },
            { sel: '#hf-dashboard-import', action: 'modal', url: 'hf-toolpanel-modal_dashboard-import.html' },
            { sel: '#hf-btn-match-videos', action: 'toast', msg: 'Video matching would start here' },
            { sel: '#hf-btn-export', action: 'toast', msg: 'Exporting queue data to CSV…' },
            { sel: '#hf-btn-clear', action: 'toast', msg: 'Clearing all queue data…' },
        ]
    }
};


/* ═══════════════════════════════════════════════════════════════════════
 *  PAGE DETECTION  +  DYNAMIC BINDING
 * ═══════════════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', function () {
    var pageKey = null, pageConfig = null;

    for (var key in MOCKUP_ACTIONS) {
        if (MOCKUP_ACTIONS.hasOwnProperty(key) && MOCKUP_ACTIONS[key].detect()) {
            pageKey = key;
            pageConfig = MOCKUP_ACTIONS[key];
            break;
        }
    }

    if (!pageConfig) {
        // Index page or unknown — nothing to bind
        return;
    }

    console.log('[Mockup] Page detected: ' + pageKey);

    // ── Hamburger menu (null-safe — only YSS pages have one) ──
    if (pageConfig.hamburger) {
        _initHamburger(pageConfig.hamburger);
    }

    // ── Bind all configured actions ──
    _bindPageActions(pageConfig.actions);

    // Toolskin hover tooltips for YSS mockups (script order: mockup-scripts → toolskin.js)
    if ((pageKey === 'yss-studio' || pageKey === 'yss-watch') && typeof Toolskin !== 'undefined' && Toolskin.initTooltips) {
        setTimeout(function () {
            Toolskin.initTooltips({
                enabled: true,
                scopeSelector: '#yss-panel, #modal-container',
            });
        }, 0);
    }
});


/**
 * Null-safe hamburger toggle for YSS panels.
 * Only runs if both the button and target nav exist in the DOM.
 */
function _initHamburger(cfg) {
    var hamburger = document.querySelector(cfg.btn);
    var nav = document.querySelector(cfg.nav);
    if (!hamburger || !nav) return;

    var isOpen = false;
    var outsideHandler = null;

    function toggle(open) {
        isOpen = (open !== undefined) ? open : !isOpen;

        if (isOpen) {
            hamburger.classList.add('is-active');
            nav.classList.add('yss-dropdown-menu');
            if (!outsideHandler) {
                outsideHandler = function (e) {
                    if (!nav.contains(e.target) && !hamburger.contains(e.target)) toggle(false);
                };
                setTimeout(function () { document.addEventListener('click', outsideHandler); }, 0);
            }
        } else {
            hamburger.classList.remove('is-active');
            nav.classList.remove('yss-dropdown-menu');
            if (outsideHandler) {
                document.removeEventListener('click', outsideHandler);
                outsideHandler = null;
            }
        }
    }

    hamburger.addEventListener('click', function (e) {
        e.stopPropagation();
        toggle();
    });
}


/* ═══════════════════════════════════════════════════════════════════════
 *  YSS showcase — Theme modal + header toggles (panel class sync)
 * ═══════════════════════════════════════════════════════════════════════ */

function _yssGetPanel() {
    return document.querySelector('#yss-panel');
}

/** Theme modal root inside the open modal container, if any */
function _yssThemeModalRoot() {
    var mc = document.getElementById('modal-container');
    if (!mc || mc.style.display === 'none') return null;
    return mc.querySelector('#yss-theme-modal');
}

function _yssSetNestedOptionsVisible(modalRoot, visible) {
    var nest = modalRoot && modalRoot.querySelector('.yss-nested-options');
    if (!nest) return;
    nest.style.display = visible ? 'block' : 'none';
}

function _yssStripFlatNestedClasses(panel) {
    panel.classList.remove('yss-gradient-btn', 'color-hover');
}

/**
 * Apply #theme-default / #theme-flat selection to #yss-panel (delegated handlers call this).
 */
function _yssApplyThemeRadiosToPanel(modalRoot, panel) {
    if (!modalRoot || !panel) return;
    var flatR = modalRoot.querySelector('#theme-flat');
    var defaultR = modalRoot.querySelector('#theme-default');
    if (!flatR || !defaultR) return;

    if (flatR.checked) {
        panel.classList.add('flat-theme');
        _yssSetNestedOptionsVisible(modalRoot, true);
    } else {
        panel.classList.remove('flat-theme');
        _yssStripFlatNestedClasses(panel);
        var g = modalRoot.querySelector('#gradient-buttons-toggle');
        var c = modalRoot.querySelector('#color-hover-toggle');
        if (g) g.checked = false;
        if (c) c.checked = false;
        _yssSetNestedOptionsVisible(modalRoot, false);
    }
    _yssSyncThemeModalFromPanel(modalRoot);
}

function _yssMockupTooltipsOn(panel) {
    return panel.getAttribute('data-mockup-tooltips') !== 'off';
}

function _yssMockupSetTooltips(panel, on) {
    if (on) panel.removeAttribute('data-mockup-tooltips');
    else panel.setAttribute('data-mockup-tooltips', 'off');
}

/**
 * @param {Element} [optModalRoot]  Pass when binding a freshly injected theme modal
 */
function _yssSyncThemeModalFromPanel(optModalRoot) {
    var panel = _yssGetPanel();
    var modalRoot = optModalRoot || _yssThemeModalRoot();
    if (!panel || !modalRoot) return;

    var defaultR = modalRoot.querySelector('#theme-default');
    var flatR = modalRoot.querySelector('#theme-flat');
    var isFlat = panel.classList.contains('flat-theme');
    if (defaultR) defaultR.checked = !isFlat;
    if (flatR) flatR.checked = isFlat;

    _yssSetNestedOptionsVisible(modalRoot, isFlat);

    var grad = modalRoot.querySelector('#gradient-buttons-toggle');
    if (grad) {
        grad.disabled = !isFlat;
        grad.checked = isFlat && panel.classList.contains('yss-gradient-btn');
    }
    var ch = modalRoot.querySelector('#color-hover-toggle');
    if (ch) {
        ch.disabled = !isFlat;
        ch.checked = isFlat && panel.classList.contains('color-hover');
    }

    var icons = modalRoot.querySelector('#icons-only-modal-toggle');
    if (icons) icons.checked = panel.classList.contains('yss-buttons-notext');

    var trans = modalRoot.querySelector('#transitions-modal-toggle');
    if (trans) trans.checked = !panel.classList.contains('no-transitions');

    var tips = modalRoot.querySelector('#tooltips-modal-toggle');
    if (tips) tips.checked = _yssMockupTooltipsOn(panel);
}

/**
 * Binds theme / appearance controls inside yss-toolpanel-modal_theme.html
 */
function _initYssThemeModal(container) {
    var modalRoot = container.querySelector('#yss-theme-modal');
    if (!modalRoot) return;

    var panel = _yssGetPanel();
    if (!panel) return;

    _yssSyncThemeModalFromPanel(modalRoot);

    /* Theme radios: listen on the overlay — change fires after the radio value commits. */
    modalRoot.addEventListener('change', function (e) {
        var t = e.target;
        if (!t || (t.id !== 'theme-default' && t.id !== 'theme-flat')) return;
        _yssApplyThemeRadiosToPanel(modalRoot, panel);
    });

    var grad = modalRoot.querySelector('#gradient-buttons-toggle');
    if (grad) {
        grad.addEventListener('change', function () {
            if (!panel.classList.contains('flat-theme')) {
                this.checked = false;
                return;
            }
            if (this.checked) panel.classList.add('yss-gradient-btn');
            else panel.classList.remove('yss-gradient-btn');
        });
    }

    var colorHover = modalRoot.querySelector('#color-hover-toggle');
    if (colorHover) {
        colorHover.addEventListener('change', function () {
            if (!panel.classList.contains('flat-theme')) {
                this.checked = false;
                return;
            }
            if (this.checked) panel.classList.add('color-hover');
            else panel.classList.remove('color-hover');
        });
    }

    var iconsOnly = modalRoot.querySelector('#icons-only-modal-toggle');
    if (iconsOnly) {
        iconsOnly.addEventListener('change', function () {
            if (this.checked) panel.classList.add('yss-buttons-notext');
            else panel.classList.remove('yss-buttons-notext');
        });
    }

    var trans = modalRoot.querySelector('#transitions-modal-toggle');
    if (trans) {
        trans.addEventListener('change', function () {
            if (this.checked) panel.classList.remove('no-transitions');
            else panel.classList.add('no-transitions');
        });
    }

    var tips = modalRoot.querySelector('#tooltips-modal-toggle');
    if (tips) {
        tips.addEventListener('change', function () {
            _yssMockupSetTooltips(panel, this.checked);
            _showToast('Tooltips toggled');
        });
    }
}


/**
 * Reads the action config array and binds click handlers.
 * Removes any inline onclick to avoid double-firing.
 */
function _bindPageActions(actions) {
    if (!actions) return;

    actions.forEach(function (cfg) {
        var els = document.querySelectorAll(cfg.sel);
        if (!els.length) return;

        els.forEach(function (el) {
            el.removeAttribute('onclick');
            el.onclick = null;

            el.addEventListener('click', function (e) {
                if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;

                switch (cfg.action) {
                    case 'modal':
                        loadContent(cfg.url, 'modal-container');
                        break;

                    case 'toggle':
                        var t = document.querySelector(cfg.target);
                        if (t) t.style.display = (t.style.display === 'flex') ? 'none' : 'flex';
                        break;

                    case 'class':
                        var t2 = document.querySelector(cfg.target);
                        if (t2) t2.classList.toggle(cfg.cls);
                        break;

                    case 'toast':
                        _showToast(cfg.msg);
                        break;

                    case 'navigate':
                        window.location.href = cfg.url;
                        break;

                    case 'yssIconOnly': {
                        var p = _yssGetPanel();
                        if (p) p.classList.toggle('yss-buttons-notext');
                        _yssSyncThemeModalFromPanel();
                        break;
                    }

                    case 'yssTransitionsToggle': {
                        var p2 = _yssGetPanel();
                        if (p2) {
                            p2.classList.toggle('no-transitions');
                            _showToast('UI transitions toggled');
                        }
                        _yssSyncThemeModalFromPanel();
                        break;
                    }

                    case 'yssTooltipsToggle': {
                        var p3 = _yssGetPanel();
                        if (p3) {
                            _yssMockupSetTooltips(p3, !_yssMockupTooltipsOn(p3));
                            _showToast('Tooltips toggled');
                        }
                        _yssSyncThemeModalFromPanel();
                        break;
                    }

                    default:
                        break;
                }
            });
        });
    });
}


/**
 * Shows a brief toast notification at the bottom of the screen.
 * Used for simulated (non-functional) actions in the mockup.
 */
function _showToast(msg, duration) {
    duration = duration || 3000;
    var old = document.getElementById('mockup-toast');
    if (old) old.remove();

    var t = document.createElement('div');
    t.id = 'mockup-toast';
    t.textContent = msg;
    t.style.cssText =
        'position:fixed;bottom:24px;left:50%;transform:translateX(-50%);' +
        'background:rgba(30,30,34,.92);color:#e4e4e7;padding:20px 24px;' +
        'border-radius:8px;font-size:.82rem;z-index:99999;' +
        'box-shadow:0 4px 16px rgba(0,0,0,.5);border:1px solid rgba(255,255,255,.08);' +
        'backdrop-filter:blur(8px);opacity:0;transition:opacity .25s;' +
        'pointer-events:none;max-width:90vw;text-align:center;font-family:inherit;';

    document.body.appendChild(t);
    requestAnimationFrame(function () { t.style.opacity = '1'; });

    setTimeout(function () {
        t.style.opacity = '0';
        setTimeout(function () { if (t.parentNode) t.remove(); }, 300);
    }, duration);
}

async function loadContent(url, targetId) {
    const target = document.getElementById(targetId);
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('File not found');

        target.innerHTML = await response.text();
        target.style.display = 'flex';

        // --- AUTOMATED BINDING START ---

        // 1. Find and bind Close Buttons (supports yss, hf, suno patterns)
        const closeBtns = target.querySelectorAll('.yss-close-btn, .hf-close-btn, .suno-close-btn, .suno-btn.suno-btn-icon[title*="Close"], [onclick*="unloadModal"]');
        closeBtns.forEach(btn => {
            btn.removeAttribute('onclick');
            btn.onclick = () => unloadModal(targetId);
        });

        // 2. Find and bind the Overlay (Close on click outside) — supports all panel prefixes
        const overlay = target.querySelector('.yss-modal-overlay, .hf-modal-overlay, .suno-modal-overlay');
        if (overlay) {
            overlay.onclick = (e) => {
                // Only close if the click was exactly on the overlay, NOT its children (the content)
                if (e.target === overlay) {
                    unloadModal(targetId);
                }
            };

            // 2b. Suno modals use CSS `opacity: 0` + `.visible` class for entrance animation
            if (overlay.classList.contains('suno-modal-overlay')) {
                overlay.classList.add('closable');
                // Trigger reflow then add .visible for smooth entrance
                void overlay.offsetWidth;
                overlay.classList.add('visible');
            }
        }

        // --- AUTOMATED BINDING END ---

        // --- SCRIPT EXECUTION START ---
        // innerHTML doesn't execute <script> tags — find them and run manually
        const scripts = target.querySelectorAll('script');
        scripts.forEach(oldScript => {
            const newScript = document.createElement('script');
            // Copy attributes (src, type, etc.)
            Array.from(oldScript.attributes).forEach(attr => {
                newScript.setAttribute(attr.name, attr.value);
            });
            // Copy inline code
            if (oldScript.textContent) {
                newScript.textContent = oldScript.textContent;
            }
            oldScript.parentNode.replaceChild(newScript, oldScript);
        });
        // --- SCRIPT EXECUTION END ---

        // --- AUTO-INIT UI WIDGETS START ---
        // Centralized jQuery UI widget initialization for AJAX-loaded content.
        // No inline <script> needed in modal HTML — just add the right classes.
        _initDatepickers(target);
        _initFormToggles(target);
        _initYssThemeModal(target);
        // --- AUTO-INIT UI WIDGETS END ---

    } catch (error) {
        console.error('Error loading HTML:', error);
    }
}

// Reusable unload helper
function unloadModal(targetId) {
    const target = document.getElementById(targetId);

    // Destroy any jQuery UI widgets (datepicker, etc.) to prevent orphaned popups
    if (typeof jQuery !== 'undefined') {
        try {
            jQuery(target).find('.hasDatepicker').datepicker('destroy');
        } catch (e) { /* widget not initialised — safe to ignore */ }
    }

    target.innerHTML = '';
    target.style.display = 'none';
}

/**
 * Centralized jQuery UI datepicker / timepicker initialization.
 * Called automatically by loadContent() after AJAX-loading a modal.
 *
 * Convention — just add these classes in the modal HTML:
 *   input.yss-datepicker[type="date"]           → datepicker
 *   input.yss-datepicker[type="time"]           → timepicker  (needs addon)
 *   input.yss-datepicker[type="datetime-local"] → datetimepicker (needs addon)
 *   input.yss-monthpicker[type="month"]         → month-only datepicker
 *
 * Native picker indicators are suppressed via CSS (extra-styles.css).
 */
function _initDatepickers(container) {
    if (typeof jQuery === 'undefined') return;
    _patchDatepickerLayout();          // one-time monkey-patch (no-ops after first call)
    var $c = jQuery(container);

    // ── Date-only inputs ────────────────────────────────────────────────
    $c.find('input.yss-datepicker[type="date"], input.yss-datepicker[type="text"]')
        .not('[type="time"],[type="datetime-local"]')
        .each(function () {
            if (!jQuery(this).hasClass('hasDatepicker')) {
                jQuery(this).datepicker({
                    dateFormat: 'yy-mm-dd',
                    showAnim: 'fadeIn',
                    changeMonth: true,
                    changeYear: true
                });
            }
        });

    // ── Time-only inputs (requires jquery-ui-timepicker-addon) ──────────
    if (jQuery.fn.timepicker) {
        $c.find('input.yss-datepicker[type="time"]').each(function () {
            if (!jQuery(this).hasClass('hasDatepicker')) {
                jQuery(this).timepicker({
                    showAnim: 'fadeIn',
                    timeFormat: 'HH:mm',
                    hourGrid: 4,
                    minuteGrid: 10,
                    showButtonPanel: true,
                    timeOnly: true
                });
            }
        });
    }

    // ── DateTime combo inputs (requires jquery-ui-timepicker-addon) ─────
    if (jQuery.fn.datetimepicker) {
        $c.find('input.yss-datepicker[type="datetime-local"]').each(function () {
            if (!jQuery(this).hasClass('hasDatepicker')) {
                jQuery(this).datetimepicker({
                    dateFormat: 'yy-mm-dd',
                    timeFormat: 'HH:mm',
                    showAnim: 'fadeIn',
                    changeMonth: true,
                    changeYear: true,
                    separator: 'T',
                    hourGrid: 4,
                    minuteGrid: 10,
                    showButtonPanel: true
                });
            }
        });
    }

    // ── Month-only inputs ───────────────────────────────────────────────
    $c.find('input.yss-monthpicker').each(function () {
        if (!jQuery(this).hasClass('hasDatepicker')) {
            jQuery(this).datepicker({
                dateFormat: 'yy-mm',
                showAnim: 'fadeIn',
                changeMonth: true,
                changeYear: true,
                showButtonPanel: true,
                onClose: function () {
                    var m = jQuery('#ui-datepicker-div .ui-datepicker-month :selected').val();
                    var y = jQuery('#ui-datepicker-div .ui-datepicker-year :selected').val();
                    if (m !== undefined && y !== undefined) {
                        jQuery(this).datepicker('setDate', new Date(y, m, 1));
                    }
                }
            });
        }
    });
}


/* ═══════════════════════════════════════════════════════════════════════
 *  FORM TOGGLE BEHAVIORS
 *
 *  Auto-binds interactive behaviors inside AJAX-loaded modals:
 *    1. Checkbox toggles   → show / hide sibling content panels
 *    2. Radio toggles      → show / hide conditional fields
 *    3. Number +/- buttons → increment / decrement inputs
 *    4. Clickable containers → click container to toggle its input
 *
 *  Called automatically by loadContent() — no inline <script> needed.
 * ═══════════════════════════════════════════════════════════════════════ */

function _initFormToggles(container) {

    // ── 1. Checkbox → panel toggles ──────────────────────────────────────
    // Convention: checkbox ID → target panel ID
    var checkboxToggles = [
        { cb: 'yss-generate-titles-cb', target: 'yss-title-generator-fields' },
        { cb: 'yss-bulk-replace-cb', target: 'yss-replace-inputs' }
    ];

    checkboxToggles.forEach(function (pair) {
        var cb = container.querySelector('#' + pair.cb);
        var target = container.querySelector('#' + pair.target);
        if (!cb || !target) return;

        cb.addEventListener('change', function () {
            target.style.display = this.checked ? 'flex' : 'none';
        });
        // Enforce initial state
        target.style.display = cb.checked ? 'flex' : 'none';
    });


    // ── 2. Radio → conditional fields ────────────────────────────────────
    // Interval type: "Custom" shows the hours/minutes inputs
    var customRadio = container.querySelector('#yss-interval-custom');
    var predefinedRadio = container.querySelector('#yss-interval-predefined');
    var customGroup = container.querySelector('#yss-custom-interval-group');

    if (customRadio && predefinedRadio && customGroup) {
        var _updateInterval = function () {
            customGroup.style.display = customRadio.checked ? 'flex' : 'none';
        };
        customRadio.addEventListener('change', _updateInterval);
        predefinedRadio.addEventListener('change', _updateInterval);
        _updateInterval();
    }


    // ── 3. Clickable containers (.yss-input-container-clickable) ─────────
    // Clicking anywhere in the container toggles the checkbox/radio inside.
    container.querySelectorAll('.yss-input-container-clickable').forEach(function (el) {
        el.style.cursor = 'pointer';
        el.addEventListener('click', function (e) {
            if (e.target.tagName === 'INPUT') return;
            var input = el.querySelector('input[type="checkbox"], input[type="radio"]');
            if (!input) return;
            if (input.type === 'radio') {
                input.checked = true;
            } else {
                input.checked = !input.checked;
            }
            input.dispatchEvent(new Event('change', { bubbles: true }));
        });
    });


    // ── 4. Number input +/- buttons ──────────────────────────────────────
    container.querySelectorAll('.yss-number-input-wrapper').forEach(function (wrapper) {
        var input = wrapper.querySelector('input[type="number"]');
        var buttons = wrapper.querySelectorAll('.yss-number-btn');
        if (!input || buttons.length < 2) return;

        // First button = increment (chevron-up), second = decrement (chevron-down)
        buttons[0].addEventListener('click', function () {
            var step = parseFloat(input.step) || 1;
            var max = input.max !== '' ? parseFloat(input.max) : Infinity;
            var val = (parseFloat(input.value) || 0) + step;
            if (val <= max) input.value = val;
            input.dispatchEvent(new Event('input', { bubbles: true }));
        });

        buttons[1].addEventListener('click', function () {
            var step = parseFloat(input.step) || 1;
            var min = input.min !== '' ? parseFloat(input.min) : -Infinity;
            var val = (parseFloat(input.value) || 0) - step;
            if (val >= min) input.value = val;
            input.dispatchEvent(new Event('input', { bubbles: true }));
        });
    });
}


/* ═══════════════════════════════════════════════════════════════════════
 *  TWO-COLUMN DATEPICKER LAYOUT  +  SIMPLE SCROLLABLE TIME PICKER
 *
 *  Monkey-patches jQuery UI's _updateDatepicker (once) so every
 *  datetime / time-only picker is restructured into:
 *
 *    .yss-dp-two-col              ← flex row
 *    ├── .yss-dp-cal-col          ← calendar header + day grid
 *    └── .yss-dp-time-col         ← simple scrollable hour / min columns
 *    .yss-dp-adv-row              ← toggle button
 *    .ui-timepicker-div            ← addon's sliders (hidden by default)
 *    .ui-datepicker-buttonpane     ← Done / Now buttons
 * ═══════════════════════════════════════════════════════════════════════ */

var _dpLayoutPatched = false;

/**
 * One-time monkey-patch — safe to call multiple times (no-ops after first).
 */
function _patchDatepickerLayout() {
    if (_dpLayoutPatched) return;
    if (typeof jQuery === 'undefined' || !jQuery.datepicker) return;
    _dpLayoutPatched = true;

    var _orig = jQuery.datepicker._updateDatepicker;
    var _busy = false;

    jQuery.datepicker._updateDatepicker = function (inst) {
        _orig.apply(this, arguments);       // original + addon render
        if (_busy) return;                  // prevent re-entry on month change
        _busy = true;
        try { _restructureDP(inst); }
        finally { _busy = false; }
    };
}

/* ── Restructure the datepicker DOM after every render ──────────────── */
function _restructureDP(inst) {
    var dp = inst.dpDiv;
    if (!dp || !dp.length) return;

    var tpDiv = dp.children('.ui-timepicker-div');
    if (!tpDiv.length) return;                // date-only → nothing to do

    var header = dp.children('.ui-datepicker-header');
    var calendar = dp.children('table.ui-datepicker-calendar');
    var btnPane = dp.children('.ui-datepicker-buttonpane');

    // Read current time from addon's internal state
    var tp = (inst.settings && inst.settings._tp_inst) || {};
    var curH = typeof tp.hour === 'number' ? tp.hour : 0;
    var curM = typeof tp.minute === 'number' ? tp.minute : 0;

    // ── Build the two-column wrapper ──
    var $wrap = jQuery('<div class="yss-dp-two-col"></div>');
    var $calCol = jQuery('<div class="yss-dp-cal-col"></div>');
    var $timeCol = jQuery('<div class="yss-dp-time-col"></div>');

    $calCol.append(header).append(calendar);

    // Simple scrollable time picker
    var $stp = _buildSimpleTP(curH, curM, function (h, m) {
        _syncTimeToAddon(inst, h, m);
    });
    $timeCol.append($stp);

    // Add both columns (hide calendar column for time-only pickers)
    $wrap.append($calCol);
    if (inst.settings.timeOnly) {
        $calCol.css('display', 'none');
    }
    $wrap.append($timeCol);

    // ── Rebuild dpDiv children ──
    dp.children().detach();
    dp.append($wrap);

    // ── Advanced / Simple toggle ──
    tpDiv.addClass('yss-dp-adv-hidden');
    var $advRow = jQuery('<div class="yss-dp-adv-row"></div>');
    var $advBtn = jQuery(
        '<button type="button" class="yss-dp-adv-toggle">' +
        '<i class="fa-solid fa-sliders"></i> Advanced</button>'
    );
    $advBtn.on('click', function () {
        if (tpDiv.hasClass('yss-dp-adv-hidden')) {
            tpDiv.removeClass('yss-dp-adv-hidden').addClass('yss-dp-adv-visible');
            $advBtn.html('<i class="fa-solid fa-clock"></i> Simple');
        } else {
            tpDiv.removeClass('yss-dp-adv-visible').addClass('yss-dp-adv-hidden');
            $advBtn.html('<i class="fa-solid fa-sliders"></i> Advanced');
        }
    });
    $advRow.append($advBtn);

    dp.append($advRow).append(tpDiv).append(btnPane);
}


/* ── Build the simple scrollable time picker ────────────────────────── *
 *  Two columns:  Hour (00–23)  |  Min (00–55 in 5-min steps)          *
 *  Active selection highlighted, scrolls into view automatically.      *
 * ──────────────────────────────────────────────────────────────────── */
function _buildSimpleTP(hour, minute, onChange) {
    var $c = jQuery('<div class="yss-stp"></div>');

    // ── Current-time display ──
    var hh = String(hour).padStart(2, '0');
    var mm = String(minute).padStart(2, '0');
    $c.append(
        '<div class="yss-stp-display">' +
        '<span class="yss-stp-hv">' + hh + '</span>' +
        '<span class="yss-stp-sep">:</span>' +
        '<span class="yss-stp-mv">' + mm + '</span>' +
        '</div>'
    );

    var $cols = jQuery('<div class="yss-stp-cols"></div>');

    // ── Hour column (0 – 23) ──
    var $hCol = jQuery('<div class="yss-stp-col"></div>');
    $hCol.append('<div class="yss-stp-lbl">Hour</div>');
    var $hList = jQuery('<div class="yss-stp-list"></div>');
    for (var h = 0; h < 24; h++) {
        var act = h === hour ? ' yss-stp-active' : '';
        $hList.append(
            '<div class="yss-stp-item' + act + '" data-v="' + h + '">' +
            String(h).padStart(2, '0') + '</div>'
        );
    }
    $hCol.append($hList);

    // ── Minute column (5-min steps) ──
    var $mCol = jQuery('<div class="yss-stp-col"></div>');
    $mCol.append('<div class="yss-stp-lbl">Min</div>');
    var $mList = jQuery('<div class="yss-stp-list"></div>');
    var near5 = Math.round(minute / 5) * 5;
    if (near5 >= 60) near5 = 55;
    for (var m = 0; m < 60; m += 5) {
        var act2 = m === near5 ? ' yss-stp-active' : '';
        $mList.append(
            '<div class="yss-stp-item' + act2 + '" data-v="' + m + '">' +
            String(m).padStart(2, '0') + '</div>'
        );
    }
    $mCol.append($mList);

    $cols.append($hCol).append($mCol);
    $c.append($cols);

    // ── Click handlers ──
    $hList.on('click', '.yss-stp-item', function () {
        $hList.find('.yss-stp-active').removeClass('yss-stp-active');
        jQuery(this).addClass('yss-stp-active');
        var selH = parseInt(jQuery(this).data('v'));
        var selM = parseInt($mList.find('.yss-stp-active').data('v') || 0);
        $c.find('.yss-stp-hv').text(String(selH).padStart(2, '0'));
        if (onChange) onChange(selH, selM);
    });

    $mList.on('click', '.yss-stp-item', function () {
        $mList.find('.yss-stp-active').removeClass('yss-stp-active');
        jQuery(this).addClass('yss-stp-active');
        var selH = parseInt($hList.find('.yss-stp-active').data('v') || 0);
        var selM = parseInt(jQuery(this).data('v'));
        $c.find('.yss-stp-mv').text(String(selM).padStart(2, '0'));
        if (onChange) onChange(selH, selM);
    });

    // Scroll active items into view after the popup renders
    setTimeout(function () {
        _stpScrollToActive($hList);
        _stpScrollToActive($mList);
    }, 60);

    return $c;
}


/* ── Scroll a .yss-stp-list so the active item is centered ──────────── */
function _stpScrollToActive($list) {
    var $act = $list.find('.yss-stp-active');
    if (!$act.length) return;
    var el = $list[0], a = $act[0];
    el.scrollTop = a.offsetTop - el.offsetTop - (el.clientHeight / 2) + (a.clientHeight / 2);
}


/* ── Sync simple picker → timepicker addon internal state ───────────── */
function _syncTimeToAddon(inst, h, m) {
    var tp = inst.settings ? inst.settings._tp_inst : null;
    if (!tp) return;

    tp.hour = h;
    tp.minute = m;

    try {
        // Use addon's own methods to update the formatted time + input value
        if (typeof tp._formatTime === 'function') tp._formatTime();
        if (typeof tp._updateDateTime === 'function') tp._updateDateTime(inst);
    } catch (e) {
        // Fallback: set input value directly
        var hStr = String(h).padStart(2, '0');
        var mStr = String(m).padStart(2, '0');
        var time = hStr + ':' + mStr;
        if (inst.input) {
            if (inst.settings.timeOnly) {
                inst.input.val(time);
            } else {
                var sep = inst.settings.separator || 'T';
                var parts = (inst.input.val() || '').split(sep);
                inst.input.val((parts[0] || '') + sep + time);
            }
        }
    }
}


// Custom createMusic icon data URI (from Suno's frontend)
const CUSTOM_CREATE_MUSIC_ICON = 'data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PScwIDAgNjAgNjAnPjxwYXRoIGZpbGw9J2N1cnJlbnRDb2xvcicgZD0nTTIyLjksMTcuNmwtOC4xLDAuOGMtMS41LDAuMS0yLjYsMS40LTIuNiwyLjhWNDZjLTAuNi0wLjEtMS4xLTAuMS0xLjctMC4xYy00LjcsMC04LjYsMy04LjYsNi44YzAsMy43LDMuOCw2LjgsOC42LDYuOCBjNC43LDAsOC42LTMsOC42LTYuOFYzMS42bDE1LjctMS42Yy0wLjEtMC4yLTAuMi0wLjQtMC4zLTAuNmwtMS45LTQuNmwtNC42LTEuOUMyNS43LDIyLjEsMjMuOCwyMC4xLDIyLjksMTcuNiBNMzkuNywzNC41djguMSBjLTAuNi0wLjEtMS4xLTAuMS0xLjctMC4xYy00LjcsMC04LjYsMy04LjYsNi44YzAsMy44LDMuOCw2LjgsOC42LDYuOHM4LjYtMyw4LjYtNi44VjM0LjVDNDQuNCwzNS4zLDQxLjksMzUuNCwzOS43LDM0LjUgTTI4LjIsMTUuNGMtMC4xLTEuNCwwLjgtMi44LDIuMS0zLjNsNS41LTIuMmMwLjktMC4zLDEuNS0xLDEuOS0xLjlMNDAsMi42YzEuMi0yLjgsNS4yLTIuOCw2LjMsMGwyLjIsNS41YzAuMywwLjgsMSwxLjUsMS45LDEuOSBsNS41LDIuMmMxLjEsMC41LDEuOCwxLjQsMiwyLjRjMC4xLDEuMy0wLjcsMi43LTIuMSwzLjNMNTAuNCwyMGMtMC45LDAuMy0xLjUsMS0xLjksMS45bC0yLjIsNS41Yy0xLjIsMi44LTUuMiwyLjgtNi40LDBsLTIuMi01LjUgYy0wLjMtMC44LTEtMS41LTEuOS0xLjlsLTUuNS0yLjJDMjkuMiwxNy40LDI4LjUsMTYuNSwyOC4yLDE1LjQnPjwvcGF0aD48L3N2Zz4=';

// Valid Ionicons names set (from ionicons-icons-names.txt)
// This is used for validation and autocomplete support
const VALID_IONICONS_NAMES = new Set([
    'accessibility', 'accessibility-outline', 'accessibility-sharp', 'add', 'add-circle', 'add-circle-outline', 'add-circle-sharp', 'add-outline', 'add-sharp',
    'airplane', 'airplane-outline', 'airplane-sharp', 'alarm', 'alarm-outline', 'alarm-sharp', 'albums', 'albums-outline', 'albums-sharp',
    'alert', 'alert-circle', 'alert-circle-outline', 'alert-circle-sharp', 'alert-outline', 'alert-sharp', 'american-football', 'american-football-outline', 'american-football-sharp',
    'analytics', 'analytics-outline', 'analytics-sharp', 'aperture', 'aperture-outline', 'aperture-sharp', 'apps', 'apps-outline', 'apps-sharp',
    'archive', 'archive-outline', 'archive-sharp', 'arrow-back', 'arrow-back-circle', 'arrow-back-circle-outline', 'arrow-back-circle-sharp', 'arrow-back-outline', 'arrow-back-sharp',
    'arrow-down', 'arrow-down-circle', 'arrow-down-circle-outline', 'arrow-down-circle-sharp', 'arrow-down-outline', 'arrow-down-sharp',
    'arrow-forward', 'arrow-forward-circle', 'arrow-forward-circle-outline', 'arrow-forward-circle-sharp', 'arrow-forward-outline', 'arrow-forward-sharp',
    'arrow-redo', 'arrow-redo-circle', 'arrow-redo-circle-outline', 'arrow-redo-circle-sharp', 'arrow-redo-outline', 'arrow-redo-sharp',
    'arrow-undo', 'arrow-undo-circle', 'arrow-undo-circle-outline', 'arrow-undo-circle-sharp', 'arrow-undo-outline', 'arrow-undo-sharp',
    'arrow-up', 'arrow-up-circle', 'arrow-up-circle-outline', 'arrow-up-circle-sharp', 'arrow-up-outline', 'arrow-up-sharp',
    'at', 'at-circle', 'at-circle-outline', 'at-circle-sharp', 'at-outline', 'at-sharp', 'attach', 'attach-outline', 'attach-sharp',
    'backspace', 'backspace-outline', 'backspace-sharp', 'bag', 'bag-add', 'bag-add-outline', 'bag-add-sharp', 'bag-check', 'bag-check-outline', 'bag-check-sharp',
    'bag-handle', 'bag-handle-outline', 'bag-handle-sharp', 'bag-outline', 'bag-remove', 'bag-remove-outline', 'bag-remove-sharp', 'bag-sharp',
    'balloon', 'balloon-outline', 'balloon-sharp', 'ban', 'ban-outline', 'ban-sharp', 'bandage', 'bandage-outline', 'bandage-sharp',
    'bar-chart', 'bar-chart-outline', 'bar-chart-sharp', 'barbell', 'barbell-outline', 'barbell-sharp', 'barcode', 'barcode-outline', 'barcode-sharp',
    'baseball', 'baseball-outline', 'baseball-sharp', 'basket', 'basket-outline', 'basket-sharp', 'basketball', 'basketball-outline', 'basketball-sharp',
    'battery-charging', 'battery-charging-outline', 'battery-charging-sharp', 'battery-dead', 'battery-dead-outline', 'battery-dead-sharp',
    'battery-full', 'battery-full-outline', 'battery-full-sharp', 'battery-half', 'battery-half-outline', 'battery-half-sharp',
    'beaker', 'beaker-outline', 'beaker-sharp', 'bed', 'bed-outline', 'bed-sharp', 'beer', 'beer-outline', 'beer-sharp',
    'bicycle', 'bicycle-outline', 'bicycle-sharp', 'bluetooth', 'bluetooth-outline', 'bluetooth-sharp', 'boat', 'boat-outline', 'boat-sharp',
    'body', 'body-outline', 'body-sharp', 'bonfire', 'bonfire-outline', 'bonfire-sharp', 'book', 'book-outline', 'book-sharp',
    'bookmark', 'bookmark-outline', 'bookmark-sharp', 'bookmarks', 'bookmarks-outline', 'bookmarks-sharp',
    'bowling-ball', 'bowling-ball-outline', 'bowling-ball-sharp', 'briefcase', 'briefcase-outline', 'briefcase-sharp',
    'browsers', 'browsers-outline', 'browsers-sharp', 'brush', 'brush-outline', 'brush-sharp', 'bug', 'bug-outline', 'bug-sharp',
    'build', 'build-outline', 'build-sharp', 'bulb', 'bulb-outline', 'bulb-sharp', 'bus', 'bus-outline', 'bus-sharp',
    'business', 'business-outline', 'business-sharp', 'cafe', 'cafe-outline', 'cafe-sharp', 'calculator', 'calculator-outline', 'calculator-sharp',
    'calendar', 'calendar-clear', 'calendar-clear-outline', 'calendar-clear-sharp', 'calendar-number', 'calendar-number-outline', 'calendar-number-sharp',
    'calendar-outline', 'calendar-sharp', 'call', 'call-outline', 'call-sharp', 'camera', 'camera-outline', 'camera-reverse',
    'camera-reverse-outline', 'camera-reverse-sharp', 'camera-sharp', 'car', 'car-outline', 'car-sharp', 'car-sport', 'car-sport-outline', 'car-sport-sharp',
    'card', 'card-outline', 'card-sharp', 'caret-back', 'caret-back-circle', 'caret-back-circle-outline', 'caret-back-circle-sharp', 'caret-back-outline', 'caret-back-sharp',
    'caret-down', 'caret-down-circle', 'caret-down-circle-outline', 'caret-down-circle-sharp', 'caret-down-outline', 'caret-down-sharp',
    'caret-forward', 'caret-forward-circle', 'caret-forward-circle-outline', 'caret-forward-circle-sharp', 'caret-forward-outline', 'caret-forward-sharp',
    'caret-up', 'caret-up-circle', 'caret-up-circle-outline', 'caret-up-circle-sharp', 'caret-up-outline', 'caret-up-sharp',
    'cart', 'cart-outline', 'cart-sharp', 'cash', 'cash-outline', 'cash-sharp', 'cellular', 'cellular-outline', 'cellular-sharp',
    'chatbox', 'chatbox-ellipses', 'chatbox-ellipses-outline', 'chatbox-ellipses-sharp', 'chatbox-outline', 'chatbox-sharp',
    'chatbubble', 'chatbubble-ellipses', 'chatbubble-ellipses-outline', 'chatbubble-ellipses-sharp', 'chatbubble-outline', 'chatbubble-sharp',
    'chatbubbles', 'chatbubbles-outline', 'chatbubbles-sharp', 'checkbox', 'checkbox-outline', 'checkbox-sharp',
    'checkmark', 'checkmark-circle', 'checkmark-circle-outline', 'checkmark-circle-sharp', 'checkmark-done', 'checkmark-done-circle',
    'checkmark-done-circle-outline', 'checkmark-done-circle-sharp', 'checkmark-done-outline', 'checkmark-done-sharp', 'checkmark-outline', 'checkmark-sharp',
    'chevron-back', 'chevron-back-circle', 'chevron-back-circle-outline', 'chevron-back-circle-sharp', 'chevron-back-outline', 'chevron-back-sharp',
    'chevron-collapse', 'chevron-collapse-outline', 'chevron-collapse-sharp', 'chevron-down', 'chevron-down-circle',
    'chevron-down-circle-outline', 'chevron-down-circle-sharp', 'chevron-down-outline', 'chevron-down-sharp',
    'chevron-expand', 'chevron-expand-outline', 'chevron-expand-sharp', 'chevron-forward', 'chevron-forward-circle',
    'chevron-forward-circle-outline', 'chevron-forward-circle-sharp', 'chevron-forward-outline', 'chevron-forward-sharp',
    'chevron-up', 'chevron-up-circle', 'chevron-up-circle-outline', 'chevron-up-circle-sharp', 'chevron-up-outline', 'chevron-up-sharp',
    'clipboard', 'clipboard-outline', 'clipboard-sharp', 'close', 'close-circle', 'close-circle-outline', 'close-circle-sharp', 'close-outline', 'close-sharp',
    'cloud', 'cloud-circle', 'cloud-circle-outline', 'cloud-circle-sharp', 'cloud-done', 'cloud-done-outline', 'cloud-done-sharp',
    'cloud-download', 'cloud-download-outline', 'cloud-download-sharp', 'cloud-offline', 'cloud-offline-outline', 'cloud-offline-sharp',
    'cloud-outline', 'cloud-sharp', 'cloud-upload', 'cloud-upload-outline', 'cloud-upload-sharp', 'cloudy', 'cloudy-night',
    'cloudy-night-outline', 'cloudy-night-sharp', 'cloudy-outline', 'cloudy-sharp', 'code', 'code-download', 'code-download-outline', 'code-download-sharp',
    'code-outline', 'code-sharp', 'code-slash', 'code-slash-outline', 'code-slash-sharp', 'code-working', 'code-working-outline', 'code-working-sharp',
    'cog', 'cog-outline', 'cog-sharp', 'color-fill', 'color-fill-outline', 'color-fill-sharp', 'color-filter', 'color-filter-outline', 'color-filter-sharp',
    'color-palette', 'color-palette-outline', 'color-palette-sharp', 'color-wand', 'color-wand-outline', 'color-wand-sharp',
    'compass', 'compass-outline', 'compass-sharp', 'construct', 'construct-outline', 'construct-sharp', 'contract', 'contract-outline', 'contract-sharp',
    'contrast', 'contrast-outline', 'contrast-sharp', 'copy', 'copy-outline', 'copy-sharp', 'create', 'create-outline', 'create-sharp',
    'crop', 'crop-outline', 'crop-sharp', 'cube', 'cube-outline', 'cube-sharp', 'cut', 'cut-outline', 'cut-sharp',
    'desktop', 'desktop-outline', 'desktop-sharp', 'diamond', 'diamond-outline', 'diamond-sharp', 'dice', 'dice-outline', 'dice-sharp',
    'disc', 'disc-outline', 'disc-sharp', 'document', 'document-attach', 'document-attach-outline', 'document-attach-sharp',
    'document-lock', 'document-lock-outline', 'document-lock-sharp', 'document-outline', 'document-sharp', 'document-text',
    'document-text-outline', 'document-text-sharp', 'documents', 'documents-outline', 'documents-sharp', 'download', 'download-outline', 'download-sharp',
    'duplicate', 'duplicate-outline', 'duplicate-sharp', 'ear', 'ear-outline', 'ear-sharp', 'earth', 'earth-outline', 'earth-sharp',
    'easel', 'easel-outline', 'easel-sharp', 'egg', 'egg-outline', 'egg-sharp', 'ellipse', 'ellipse-outline', 'ellipse-sharp',
    'ellipsis-horizontal', 'ellipsis-horizontal-circle', 'ellipsis-horizontal-circle-outline', 'ellipsis-horizontal-circle-sharp',
    'ellipsis-horizontal-outline', 'ellipsis-horizontal-sharp', 'ellipsis-vertical', 'ellipsis-vertical-circle',
    'ellipsis-vertical-circle-outline', 'ellipsis-vertical-circle-sharp', 'ellipsis-vertical-outline', 'ellipsis-vertical-sharp',
    'enter', 'enter-outline', 'enter-sharp', 'exit', 'exit-outline', 'exit-sharp', 'expand', 'expand-outline', 'expand-sharp',
    'extension-puzzle', 'extension-puzzle-outline', 'extension-puzzle-sharp', 'eye', 'eye-off', 'eye-off-outline', 'eye-off-sharp', 'eye-outline', 'eye-sharp',
    'eyedrop', 'eyedrop-outline', 'eyedrop-sharp', 'fast-food', 'fast-food-outline', 'fast-food-sharp',
    'female', 'female-outline', 'female-sharp', 'file-tray', 'file-tray-full', 'file-tray-full-outline', 'file-tray-full-sharp',
    'file-tray-outline', 'file-tray-sharp', 'file-tray-stacked', 'file-tray-stacked-outline', 'file-tray-stacked-sharp',
    'film', 'film-outline', 'film-sharp', 'filter', 'filter-circle', 'filter-circle-outline', 'filter-circle-sharp', 'filter-outline', 'filter-sharp',
    'finger-print', 'finger-print-outline', 'finger-print-sharp', 'fish', 'fish-outline', 'fish-sharp',
    'fitness', 'fitness-outline', 'fitness-sharp', 'flag', 'flag-outline', 'flag-sharp', 'flame', 'flame-outline', 'flame-sharp',
    'flash', 'flash-off', 'flash-off-outline', 'flash-off-sharp', 'flash-outline', 'flash-sharp', 'flashlight', 'flashlight-outline', 'flashlight-sharp',
    'flask', 'flask-outline', 'flask-sharp', 'flower', 'flower-outline', 'flower-sharp', 'folder', 'folder-open',
    'folder-open-outline', 'folder-open-sharp', 'folder-outline', 'folder-sharp', 'football', 'football-outline', 'football-sharp',
    'footsteps', 'footsteps-outline', 'footsteps-sharp', 'funnel', 'funnel-outline', 'funnel-sharp',
    'game-controller', 'game-controller-outline', 'game-controller-sharp', 'gift', 'gift-outline', 'gift-sharp',
    'git-branch', 'git-branch-outline', 'git-branch-sharp', 'git-commit', 'git-commit-outline', 'git-commit-sharp',
    'git-compare', 'git-compare-outline', 'git-compare-sharp', 'git-merge', 'git-merge-outline', 'git-merge-sharp',
    'git-network', 'git-network-outline', 'git-network-sharp', 'git-pull-request', 'git-pull-request-outline', 'git-pull-request-sharp',
    'glasses', 'glasses-outline', 'glasses-sharp', 'globe', 'globe-outline', 'globe-sharp', 'golf', 'golf-outline', 'golf-sharp',
    'grid', 'grid-outline', 'grid-sharp', 'hammer', 'hammer-outline', 'hammer-sharp', 'hand-left', 'hand-left-outline', 'hand-left-sharp',
    'hand-right', 'hand-right-outline', 'hand-right-sharp', 'happy', 'happy-outline', 'happy-sharp',
    'hardware-chip', 'hardware-chip-outline', 'hardware-chip-sharp', 'headset', 'headset-outline', 'headset-sharp',
    'heart', 'heart-circle', 'heart-circle-outline', 'heart-circle-sharp', 'heart-dislike', 'heart-dislike-circle',
    'heart-dislike-circle-outline', 'heart-dislike-circle-sharp', 'heart-dislike-outline', 'heart-dislike-sharp',
    'heart-half', 'heart-half-outline', 'heart-half-sharp', 'heart-outline', 'heart-sharp', 'help', 'help-buoy',
    'help-buoy-outline', 'help-buoy-sharp', 'help-circle', 'help-circle-outline', 'help-circle-sharp', 'help-outline', 'help-sharp',
    'home', 'home-outline', 'home-sharp', 'hourglass', 'hourglass-outline', 'hourglass-sharp', 'ice-cream', 'ice-cream-outline', 'ice-cream-sharp',
    'id-card', 'id-card-outline', 'id-card-sharp', 'image', 'image-outline', 'image-sharp', 'images', 'images-outline', 'images-sharp',
    'infinite', 'infinite-outline', 'infinite-sharp', 'information', 'information-circle', 'information-circle-outline', 'information-circle-sharp',
    'information-outline', 'information-sharp', 'invert-mode', 'invert-mode-outline', 'invert-mode-sharp',
    'journal', 'journal-outline', 'journal-sharp', 'key', 'key-outline', 'key-sharp', 'keypad', 'keypad-outline', 'keypad-sharp',
    'language', 'language-outline', 'language-sharp', 'laptop', 'laptop-outline', 'laptop-sharp', 'layers', 'layers-outline', 'layers-sharp',
    'leaf', 'leaf-outline', 'leaf-sharp', 'library', 'library-outline', 'library-sharp', 'link', 'link-outline', 'link-sharp',
    'list', 'list-circle', 'list-circle-outline', 'list-circle-sharp', 'list-outline', 'list-sharp',
    'locate', 'locate-outline', 'locate-sharp', 'location', 'location-outline', 'location-sharp',
    'lock-closed', 'lock-closed-outline', 'lock-closed-sharp', 'lock-open', 'lock-open-outline', 'lock-open-sharp',
    'log-in', 'log-in-outline', 'log-in-sharp', 'log-out', 'log-out-outline', 'log-out-sharp',
    'logo-alipay', 'logo-amazon', 'logo-amplify', 'logo-android', 'logo-angular', 'logo-apple', 'logo-apple-appstore', 'logo-apple-ar',
    'logo-behance', 'logo-bitbucket', 'logo-bitcoin', 'logo-buffer', 'logo-capacitor', 'logo-chrome', 'logo-closed-captioning',
    'logo-codepen', 'logo-css3', 'logo-designernews', 'logo-deviantart', 'logo-discord', 'logo-docker', 'logo-dribbble', 'logo-dropbox',
    'logo-edge', 'logo-electron', 'logo-euro', 'logo-facebook', 'logo-figma', 'logo-firebase', 'logo-firefox', 'logo-flickr',
    'logo-foursquare', 'logo-github', 'logo-gitlab', 'logo-google', 'logo-google-playstore', 'logo-hackernews', 'logo-html5',
    'logo-instagram', 'logo-ionic', 'logo-ionitron', 'logo-javascript', 'logo-laravel', 'logo-linkedin', 'logo-markdown',
    'logo-mastodon', 'logo-medium', 'logo-microsoft', 'logo-no-smoking', 'logo-nodejs', 'logo-npm', 'logo-octocat', 'logo-paypal',
    'logo-pinterest', 'logo-playstation', 'logo-pwa', 'logo-python', 'logo-react', 'logo-reddit', 'logo-rss', 'logo-sass',
    'logo-skype', 'logo-slack', 'logo-snapchat', 'logo-soundcloud', 'logo-stackoverflow', 'logo-steam', 'logo-stencil',
    'logo-tableau', 'logo-tiktok', 'logo-tumblr', 'logo-tux', 'logo-twitch', 'logo-twitter', 'logo-usd', 'logo-venmo',
    'logo-vercel', 'logo-vimeo', 'logo-vk', 'logo-vue', 'logo-web-component', 'logo-wechat', 'logo-whatsapp', 'logo-windows',
    'logo-wordpress', 'logo-xbox', 'logo-xing', 'logo-yahoo', 'logo-yen', 'logo-youtube',
    'magnet', 'magnet-outline', 'magnet-sharp', 'mail', 'mail-open', 'mail-open-outline', 'mail-open-sharp',
    'mail-outline', 'mail-sharp', 'mail-unread', 'mail-unread-outline', 'mail-unread-sharp',
    'male', 'male-female', 'male-female-outline', 'male-female-sharp', 'male-outline', 'male-sharp',
    'man', 'man-outline', 'man-sharp', 'map', 'map-outline', 'map-sharp', 'medal', 'medal-outline', 'medal-sharp',
    'medical', 'medical-outline', 'medical-sharp', 'medkit', 'medkit-outline', 'medkit-sharp',
    'megaphone', 'megaphone-outline', 'megaphone-sharp', 'menu', 'menu-outline', 'menu-sharp',
    'mic', 'mic-circle', 'mic-circle-outline', 'mic-circle-sharp', 'mic-off', 'mic-off-circle',
    'mic-off-circle-outline', 'mic-off-circle-sharp', 'mic-off-outline', 'mic-off-sharp', 'mic-outline', 'mic-sharp',
    'moon', 'moon-outline', 'moon-sharp', 'move', 'move-outline', 'move-sharp',
    'musical-note', 'musical-note-outline', 'musical-note-sharp', 'musical-notes', 'musical-notes-outline', 'musical-notes-sharp',
    'navigate', 'navigate-circle', 'navigate-circle-outline', 'navigate-circle-sharp', 'navigate-outline', 'navigate-sharp',
    'newspaper', 'newspaper-outline', 'newspaper-sharp', 'notifications', 'notifications-circle',
    'notifications-circle-outline', 'notifications-circle-sharp', 'notifications-off', 'notifications-off-circle',
    'notifications-off-circle-outline', 'notifications-off-circle-sharp', 'notifications-off-outline', 'notifications-off-sharp',
    'notifications-outline', 'notifications-sharp', 'nuclear', 'nuclear-outline', 'nuclear-sharp',
    'nutrition', 'nutrition-outline', 'nutrition-sharp', 'open', 'open-outline', 'open-sharp',
    'options', 'options-outline', 'options-sharp', 'paper-plane', 'paper-plane-outline', 'paper-plane-sharp',
    'partly-sunny', 'partly-sunny-outline', 'partly-sunny-sharp', 'pause', 'pause-circle',
    'pause-circle-outline', 'pause-circle-sharp', 'pause-outline', 'pause-sharp', 'paw', 'paw-outline', 'paw-sharp',
    'pencil', 'pencil-outline', 'pencil-sharp', 'people', 'people-circle', 'people-circle-outline', 'people-circle-sharp',
    'people-outline', 'people-sharp', 'person', 'person-add', 'person-add-outline', 'person-add-sharp',
    'person-circle', 'person-circle-outline', 'person-circle-sharp', 'person-outline', 'person-remove',
    'person-remove-outline', 'person-remove-sharp', 'person-sharp', 'phone-landscape', 'phone-landscape-outline', 'phone-landscape-sharp',
    'phone-portrait', 'phone-portrait-outline', 'phone-portrait-sharp', 'pie-chart', 'pie-chart-outline', 'pie-chart-sharp',
    'pin', 'pin-outline', 'pin-sharp', 'pint', 'pint-outline', 'pint-sharp', 'pizza', 'pizza-outline', 'pizza-sharp',
    'planet', 'planet-outline', 'planet-sharp', 'play', 'play-back', 'play-back-circle',
    'play-back-circle-outline', 'play-back-circle-sharp', 'play-back-outline', 'play-back-sharp', 'play-circle',
    'play-circle-outline', 'play-circle-sharp', 'play-forward', 'play-forward-circle', 'play-forward-circle-outline',
    'play-forward-circle-sharp', 'play-forward-outline', 'play-forward-sharp', 'play-outline', 'play-sharp',
    'play-skip-back', 'play-skip-back-circle', 'play-skip-back-circle-outline', 'play-skip-back-circle-sharp',
    'play-skip-back-outline', 'play-skip-back-sharp', 'play-skip-forward', 'play-skip-forward-circle',
    'play-skip-forward-circle-outline', 'play-skip-forward-circle-sharp', 'play-skip-forward-outline', 'play-skip-forward-sharp',
    'podium', 'podium-outline', 'podium-sharp', 'power', 'power-outline', 'power-sharp',
    'pricetag', 'pricetag-outline', 'pricetag-sharp', 'pricetags', 'pricetags-outline', 'pricetags-sharp',
    'print', 'print-outline', 'print-sharp', 'prism', 'prism-outline', 'prism-sharp', 'pulse', 'pulse-outline', 'pulse-sharp',
    'push', 'push-outline', 'push-sharp', 'qr-code', 'qr-code-outline', 'qr-code-sharp',
    'radio', 'radio-button-off', 'radio-button-off-outline', 'radio-button-off-sharp',
    'radio-button-on', 'radio-button-on-outline', 'radio-button-on-sharp', 'radio-outline', 'radio-sharp',
    'rainy', 'rainy-outline', 'rainy-sharp', 'reader', 'reader-outline', 'reader-sharp',
    'receipt', 'receipt-outline', 'receipt-sharp', 'recording', 'recording-outline', 'recording-sharp',
    'refresh', 'refresh-circle', 'refresh-circle-outline', 'refresh-circle-sharp', 'refresh-outline', 'refresh-sharp',
    'reload', 'reload-circle', 'reload-circle-outline', 'reload-circle-sharp', 'reload-outline', 'reload-sharp',
    'remove', 'remove-circle', 'remove-circle-outline', 'remove-circle-sharp', 'remove-outline', 'remove-sharp',
    'reorder-four', 'reorder-four-outline', 'reorder-four-sharp', 'reorder-three', 'reorder-three-outline', 'reorder-three-sharp',
    'reorder-two', 'reorder-two-outline', 'reorder-two-sharp', 'repeat', 'repeat-outline', 'repeat-sharp',
    'resize', 'resize-outline', 'resize-sharp', 'restaurant', 'restaurant-outline', 'restaurant-sharp',
    'return-down-back', 'return-down-back-outline', 'return-down-back-sharp', 'return-down-forward',
    'return-down-forward-outline', 'return-down-forward-sharp', 'return-up-back', 'return-up-back-outline', 'return-up-back-sharp',
    'return-up-forward', 'return-up-forward-outline', 'return-up-forward-sharp', 'ribbon', 'ribbon-outline', 'ribbon-sharp',
    'rocket', 'rocket-outline', 'rocket-sharp', 'rose', 'rose-outline', 'rose-sharp',
    'sad', 'sad-outline', 'sad-sharp', 'save', 'save-outline', 'save-sharp', 'scale', 'scale-outline', 'scale-sharp',
    'scan', 'scan-circle', 'scan-circle-outline', 'scan-circle-sharp', 'scan-outline', 'scan-sharp',
    'school', 'school-outline', 'school-sharp', 'search', 'search-circle', 'search-circle-outline', 'search-circle-sharp',
    'search-outline', 'search-sharp', 'send', 'send-outline', 'send-sharp', 'server', 'server-outline', 'server-sharp',
    'settings', 'settings-outline', 'settings-sharp', 'shapes', 'shapes-outline', 'shapes-sharp',
    'share', 'share-outline', 'share-sharp', 'share-social', 'share-social-outline', 'share-social-sharp',
    'shield', 'shield-checkmark', 'shield-checkmark-outline', 'shield-checkmark-sharp', 'shield-half',
    'shield-half-outline', 'shield-half-sharp', 'shield-outline', 'shield-sharp', 'shirt', 'shirt-outline', 'shirt-sharp',
    'shuffle', 'shuffle-outline', 'shuffle-sharp', 'skull', 'skull-outline', 'skull-sharp',
    'snow', 'snow-outline', 'snow-sharp', 'sparkles', 'sparkles-outline', 'sparkles-sharp',
    'speedometer', 'speedometer-outline', 'speedometer-sharp', 'square', 'square-outline', 'square-sharp',
    'star', 'star-half', 'star-half-outline', 'star-half-sharp', 'star-outline', 'star-sharp',
    'stats-chart', 'stats-chart-outline', 'stats-chart-sharp', 'stop', 'stop-circle',
    'stop-circle-outline', 'stop-circle-sharp', 'stop-outline', 'stop-sharp', 'stopwatch', 'stopwatch-outline', 'stopwatch-sharp',
    'storefront', 'storefront-outline', 'storefront-sharp', 'subway', 'subway-outline', 'subway-sharp',
    'sunny', 'sunny-outline', 'sunny-sharp', 'swap-horizontal', 'swap-horizontal-outline', 'swap-horizontal-sharp',
    'swap-vertical', 'swap-vertical-outline', 'swap-vertical-sharp', 'sync', 'sync-circle',
    'sync-circle-outline', 'sync-circle-sharp', 'sync-outline', 'sync-sharp', 'tablet-landscape',
    'tablet-landscape-outline', 'tablet-landscape-sharp', 'tablet-portrait', 'tablet-portrait-outline', 'tablet-portrait-sharp',
    'telescope', 'telescope-outline', 'telescope-sharp', 'tennisball', 'tennisball-outline', 'tennisball-sharp',
    'terminal', 'terminal-outline', 'terminal-sharp', 'text', 'text-outline', 'text-sharp',
    'thermometer', 'thermometer-outline', 'thermometer-sharp', 'thumbs-down', 'thumbs-down-outline', 'thumbs-down-sharp',
    'thumbs-up', 'thumbs-up-outline', 'thumbs-up-sharp', 'thunderstorm', 'thunderstorm-outline', 'thunderstorm-sharp',
    'ticket', 'ticket-outline', 'ticket-sharp', 'time', 'time-outline', 'time-sharp',
    'timer', 'timer-outline', 'timer-sharp', 'today', 'today-outline', 'today-sharp',
    'toggle', 'toggle-outline', 'toggle-sharp', 'trail-sign', 'trail-sign-outline', 'trail-sign-sharp',
    'train', 'train-outline', 'train-sharp', 'transgender', 'transgender-outline', 'transgender-sharp',
    'trash', 'trash-bin', 'trash-bin-outline', 'trash-bin-sharp', 'trash-outline', 'trash-sharp',
    'trending-down', 'trending-down-outline', 'trending-down-sharp', 'trending-up', 'trending-up-outline', 'trending-up-sharp',
    'triangle', 'triangle-outline', 'triangle-sharp', 'trophy', 'trophy-outline', 'trophy-sharp',
    'tv', 'tv-outline', 'tv-sharp', 'umbrella', 'umbrella-outline', 'umbrella-sharp',
    'unlink', 'unlink-outline', 'unlink-sharp', 'videocam', 'videocam-off',
    'videocam-off-outline', 'videocam-off-sharp', 'videocam-outline', 'videocam-sharp',
    'volume-high', 'volume-high-outline', 'volume-high-sharp', 'volume-low', 'volume-low-outline', 'volume-low-sharp',
    'volume-medium', 'volume-medium-outline', 'volume-medium-sharp', 'volume-mute',
    'volume-mute-outline', 'volume-mute-sharp', 'volume-off', 'volume-off-outline', 'volume-off-sharp',
    'walk', 'walk-outline', 'walk-sharp', 'wallet', 'wallet-outline', 'wallet-sharp',
    'warning', 'warning-outline', 'warning-sharp', 'watch', 'watch-outline', 'watch-sharp',
    'water', 'water-outline', 'water-sharp', 'wifi', 'wifi-outline', 'wifi-sharp',
    'wine', 'wine-outline', 'wine-sharp', 'woman', 'woman-outline', 'woman-sharp'
]);

// Create icon element - prioritizes Ionicons names directly, then mapping, then SVG fallback
// Special case: 'createMusic' uses custom icon via data URI in Ionicons
const createIcon = (iconName, size = null, forceSVG = false) => {
    if (!iconName) {
        // Return empty span if no icon name provided
        const span = document.createElement('span');
        span.className = 'suno-icon';
        return span;
    }

    // Special handling for createMusic - use custom icon with data URI
    if (iconName === 'createMusic') {
        const icon = document.createElement('ion-icon');
        icon.setAttribute('src', CUSTOM_CREATE_MUSIC_ICON);
        icon.className = 'suno-icon';
        if (size) {
            icon.style.fontSize = size;
        }
        icon.setAttribute('aria-hidden', 'true');
        return icon;
    }

    // Step 1: Try using iconName directly as Ionicons name (if it's a valid Ionicons name)
    if (VALID_IONICONS_NAMES.has(iconName)) {
        const icon = document.createElement('ion-icon');
        icon.setAttribute('name', iconName);
        icon.className = 'suno-icon';
        if (size) {
            icon.style.fontSize = size;
        }
        icon.setAttribute('aria-hidden', 'true');
        return icon;
    }

    // Step 2: Try mapping (for backward compatibility with old icon names)
    const mappedIconName = IONICONS_MAP[iconName];
    if (mappedIconName && VALID_IONICONS_NAMES.has(mappedIconName)) {
        const icon = document.createElement('ion-icon');
        icon.setAttribute('name', mappedIconName);
        icon.className = 'suno-icon';
        if (size) {
            icon.style.fontSize = size;
        }
        icon.setAttribute('aria-hidden', 'true');
        return icon;
    }

    // Step 3: Fallback to SVG (for legacy icons not in Ionicons)
    if (!forceSVG && ICONS[iconName]) {
        const span = document.createElement('span');
        span.className = 'suno-icon';
        if (size) {
            span.style.setProperty('--suno-icon-size', size);
        }
        const svgString = ICONS[iconName];
        if (svgString) {
            const template = document.createElement('template');
            template.innerHTML = svgString.trim();
            const svg = template.content.firstChild;
            if (svg) {
                span.appendChild(svg);
            }
        }
        return span;
    }

    // Final fallback: empty icon or circle
    const span = document.createElement('span');
    span.className = 'suno-icon';
    if (size) {
        span.style.setProperty('--suno-icon-size', size);
    }
    const svgString = ICONS.circle || '';
    if (svgString) {
        const template = document.createElement('template');
        template.innerHTML = svgString.trim();
        const svg = template.content.firstChild;
        if (svg) {
            span.appendChild(svg);
        }
    }
    return span;
};

// Update icon in element
const updateIcon = (element, iconName) => {
    const iconSpan = element.querySelector('.suno-icon');
    if (iconSpan) {
        const newIcon = createIcon(iconName);
        iconSpan.replaceWith(newIcon);
    }
};

// Get default icon for button text (for buttons without explicit icons)
// Returns Ionicons names directly
const getDefaultButtonIcon = (text) => {
    const textLower = text.toLowerCase();
    if (textLower.includes('clear') || textLower.includes('delete') || textLower.includes('remove')) return 'trash';
    if (textLower.includes('export') || textLower.includes('save') || textLower.includes('download')) return 'download';
    if (textLower.includes('refresh') || textLower.includes('reload')) return 'refresh';
    if (textLower.includes('close') || textLower.includes('cancel')) return 'close';
    if (textLower.includes('settings') || textLower.includes('config')) return 'settings';
    if (textLower.includes('automation')) return 'flash';
    if (textLower.includes('bulk')) return 'cloud-download';
    if (textLower.includes('start') || textLower.includes('play')) return 'createMusic'; // Start button uses createMusic icon
    if (textLower.includes('stop')) return 'stop';
    if (textLower.includes('pause')) return 'pause';
    if (textLower.includes('resume')) return 'play';
    if (textLower.includes('copy')) return 'copy';
    if (textLower.includes('search') || textLower.includes('find')) return 'search';
    if (textLower.includes('info') || textLower.includes('information')) return 'information-circle';
    if (textLower.includes('warning') || textLower.includes('alert')) return 'warning';
    if (textLower.includes('error') || textLower.includes('fail')) return 'close-circle';
    if (textLower.includes('success') || textLower.includes('complete')) return 'checkmark-circle';
    return null; // No default icon
};
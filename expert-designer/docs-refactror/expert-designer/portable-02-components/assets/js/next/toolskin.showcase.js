/*!
 * Toolskin showcase — inline script extraction.
 * Extracted from index.html to reduce page weight and improve maintainability.
 */

// After deferred scripts (toolskin-uikit.js), so ToolskinUIKit exists. ts:ready may fire earlier when core runs before uikit.
document.addEventListener('DOMContentLoaded', () => {
  if (window.ToolskinUIKit && typeof ToolskinUIKit.init === 'function') {
    ToolskinUIKit.init(document);
  }
  const tokenLabHub = document.getElementById('token-lab-hub');
  if (tokenLabHub && window.ToolskinIcons && typeof ToolskinIcons.inject === 'function') {
    ToolskinIcons.inject(tokenLabHub);
  }
  const schemaHost = document.getElementById('showcase-accordion-schema');
  if (
    schemaHost &&
    !schemaHost.dataset.tsSchemaBound &&
    window.ToolskinUIKit &&
    typeof ToolskinUIKit.AccordionFromSchema === 'function'
  ) {
    schemaHost.dataset.tsSchemaBound = '1';
    ToolskinUIKit.AccordionFromSchema(schemaHost, {
      multiple: true,
      layout: 'separated',
      toggle: 'plus',
      items: [
        {
          title: 'Schema A',
          html:
            '<p class="ts-fs-sm ts-text-secondary">Built with <code>ToolskinUIKit.AccordionFromSchema</code> (multiple + separated + plus toggle).</p>',
          icon: 'fa-solid fa-wand-magic-sparkles',
          open: true,
        },
        {
          title: 'Schema B',
          html:
            '<p class="ts-fs-sm ts-text-secondary">Second item stays in sync with keyboard and ARIA.</p>',
          icon: 'fa-regular fa-file-lines',
          open: false,
        },
      ],
    });
  }

  // ✅ Enhanced Toast Button Handlers
  const toastSuccess = document.getElementById('showcase-toast-success');
  const toastWarning = document.getElementById('showcase-toast-warning');
  const toastError = document.getElementById('showcase-toast-error');
  const toastInfo = document.getElementById('showcase-toast-info');

  if (toastSuccess && window.ToolskinUIKit && ToolskinUIKit.Toast) {
    toastSuccess.addEventListener('click', () => {
      ToolskinUIKit.Toast.show('Profile updated successfully!', {
        type: 'success',
        title: 'Saved',
        duration: 3000
      });
    });
  }

  if (toastWarning && window.ToolskinUIKit && ToolskinUIKit.Toast) {
    toastWarning.addEventListener('click', () => {
      ToolskinUIKit.Toast.show('Check your network settings before continuing.', {
        type: 'warning',
        title: 'Network Warning',
        duration: 4000
      });
    });
  }

  if (toastError && window.ToolskinUIKit && ToolskinUIKit.Toast) {
    toastError.addEventListener('click', () => {
      ToolskinUIKit.Toast.show('Could not complete the request. Please try again.', {
        type: 'error',
        title: 'Error',
        duration: 5000
      });
    });
  }

  if (toastInfo && window.ToolskinUIKit && ToolskinUIKit.Toast) {
    toastInfo.addEventListener('click', () => {
      ToolskinUIKit.Toast.show('Enhanced toast system with progress tracking and rich styling.', {
        type: 'info',
        title: 'Enhanced Toast',
        duration: 4000
      });
    });
  }

  // ✅ Initialize tooltips if available
  if (window.Toolskin && typeof Toolskin.initTooltips === 'function') {
    Toolskin.initTooltips();
  }

  // ✅ Enhanced Table Functionality
  const enhancedTable = document.querySelector('.ts-ui-table--sortable.ts-ui-table--bulk');
  if (enhancedTable && window.ToolskinUIKit) {
    // Initialize table sorting
    if (typeof ToolskinUIKit.TableSort === 'function') {
      ToolskinUIKit.TableSort(enhancedTable);
    }

    // Initialize bulk actions
    const bulkWrap = enhancedTable.closest('.ts-ui-table-bulk-wrap');
    const bulkBar = bulkWrap?.querySelector('.ts-ui-bulk-bar');
    const selectAllCheckbox = enhancedTable.querySelector('.ts-ui-table__select-all');
    const rowCheckboxes = enhancedTable.querySelectorAll('.ts-ui-row-checkbox');
    const bulkCount = bulkBar?.querySelector('.ts-ui-bulk-bar__count');

    function updateBulkActions() {
      const selectedCount = Array.from(rowCheckboxes).filter(cb => cb.checked).length;

      if (bulkBar && bulkCount) {
        if (selectedCount > 0) {
          bulkBar.hidden = false;
          bulkCount.textContent = `${selectedCount} selected`;
        } else {
          bulkBar.hidden = true;
        }
      }

      // Update select all state
      if (selectAllCheckbox) {
        const totalRows = rowCheckboxes.length;
        selectAllCheckbox.indeterminate = selectedCount > 0 && selectedCount < totalRows;
        selectAllCheckbox.checked = selectedCount === totalRows && totalRows > 0;
      }
    }

    // Select all functionality
    if (selectAllCheckbox) {
      selectAllCheckbox.addEventListener('change', () => {
        const isChecked = selectAllCheckbox.checked;
        rowCheckboxes.forEach(checkbox => {
          checkbox.checked = isChecked;
        });
        updateBulkActions();
      });
    }

    // Individual row selection
    rowCheckboxes.forEach(checkbox => {
      checkbox.addEventListener('change', updateBulkActions);
    });

    // Bulk action button handlers (demo)
    const bulkActions = bulkBar?.querySelectorAll('.ts-ui-bulk-bar__actions .ts-btn');
    bulkActions?.forEach(button => {
      button.addEventListener('click', () => {
        const action = button.textContent.trim();
        const selectedCount = Array.from(rowCheckboxes).filter(cb => cb.checked).length;

        if (window.ToolskinUIKit && ToolskinUIKit.Toast) {
          ToolskinUIKit.Toast.show(
            `${action} action performed on ${selectedCount} items`,
            { type: 'info', title: 'Bulk Action', duration: 3000 }
          );
        }

        // Clear selections after action
        rowCheckboxes.forEach(cb => cb.checked = false);
        updateBulkActions();
      });
    });

    // Initialize bulk actions state
    updateBulkActions();
  }

  // ✅ Enhanced Number Inputs - Auto-enhance with spinner controls
  if (window.ToolskinUIKit && typeof ToolskinUIKit.NumberInput === 'function') {
    const numberInputs = document.querySelectorAll('#enhanced-components input[type="number"]');
    numberInputs.forEach(input => {
      ToolskinUIKit.NumberInput(input);
    });
  }
});


const onToolskinReady = (fn) => {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fn, { once: true });
  } else {
    fn();
  }
};

onToolskinReady(() => {
  document.querySelectorAll('.ts-code-copy').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      const codeWindow = btn.closest('.ts-code-window');
      const codeContent = codeWindow?.querySelector('.ts-code-content code');
      if (!codeContent) return;

      // Get text content preserving formatting
      const text = codeContent.innerText || codeContent.textContent;

      try {
        await navigator.clipboard.writeText(text);
        btn.classList.add('copied');
        setTimeout(() => {
          btn.classList.remove('copied');
        }, 2000);
      } catch (err) {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        try {
          document.execCommand('copy');
          btn.classList.add('copied');
          setTimeout(() => {
            btn.classList.remove('copied');
          }, 2000);
        } catch (fallbackErr) {
          console.error('Failed to copy:', fallbackErr);
        }
        document.body.removeChild(textarea);
      }
    });
  });
});
onToolskinReady(() => {
  const loremPhrases = [
    "Lorem ipsum dolor sit amet.",
    "Consectetur adipiscing elit.",
    "Sed do eiusmod tempor.",
    "Incididunt ut labore et dolore.",
    "Ut enim ad minim veniam.",
    "Quis nostrud exercitation.",
    "Ullamco laboris nisi ut.",
    "Aliquip ex ea commodo."
  ];

  // This selector specifically targets the <span> to keep your <i> icons safe
  const spans = document.querySelectorAll('.ts-feat-list.lorem .ts-feat-item span:not(.ts-icon)');

  if (spans.length === 0) {
    console.warn("No elements found. Check if your class names match exactly.");
  }

  spans.forEach(span => {
    const randomIndex = Math.floor(Math.random() * loremPhrases.length);
    span.textContent = loremPhrases[randomIndex];
  });
});

/* Data-driven styles (replaces inline style attributes) */
document.querySelectorAll('[data-color]').forEach(el => {
  el.style.background = el.dataset.color;
});

// 1. Optimized Helper
const getHexFromElement = (el) => {
  const rgb = window.getComputedStyle(el).backgroundColor;
  const values = rgb.match(/\d+/g);
  if (!values || values.length < 3) return '';
  return '#' + values.slice(0, 3).map(x =>
    parseInt(x).toString(16).padStart(2, '0')
  ).join('').toUpperCase();
};

const parseRgbStringToHex = (rgb) => {
  const values = String(rgb).match(/\d+/g);
  if (!values || values.length < 3) return '';
  return '#' + values.slice(0, 3).map(x =>
    parseInt(x, 10).toString(16).padStart(2, '0')
  ).join('').toLowerCase();
};

/** Resolve any CSS color string to #rrggbb for display (token lab). */
const cssColorToHex = (colorStr) => {
  if (!colorStr || !String(colorStr).trim()) return '';
  const s = String(colorStr).trim();
  if (/^#[0-9a-fA-F]{6}$/.test(s)) return s.toLowerCase();
  if (/^#[0-9a-fA-F]{3}$/.test(s)) {
    const h = s.slice(1);
    return ('#' + h[0] + h[0] + h[1] + h[1] + h[2] + h[2]).toLowerCase();
  }
  const probe = document.createElement('div');
  probe.style.cssText = 'position:absolute;left:-9999px;visibility:hidden;background-color:' + s;
  document.body.appendChild(probe);
  const bg = getComputedStyle(probe).backgroundColor;
  document.body.removeChild(probe);
  const hex = parseRgbStringToHex(bg);
  return hex || s;
};

// 2. Updated Main Function: It won't create a new span if one exists
const TOKEN_SWATCH_SELECTOR = '#tokens .ts-swatch:not(.ts-swatch--picker)';

const updateSwatchLabels = (selector) => {
  document.querySelectorAll(selector).forEach(swatch => {
    const hex = getHexFromElement(swatch);

    let label = swatch.nextElementSibling;
    if (!label || !label.classList.contains('swatch-hex-label')) {
      label = document.createElement('span');
      label.className = 'swatch-hex-label';
      label.style.display = 'block';
      swatch.after(label);
    }

    if (label.textContent !== hex) {
      label.textContent = hex;
    }
  });
};

const TOKEN_LAB_VARS = [
  ['--ts-bg-0', 'surface 0'],
  ['--ts-bg-1', 'surface 1'],
  ['--ts-bg-2', 'surface 2'],
  ['--ts-bg-3', 'surface 3'],
  ['--ts-bg-4', 'surface 4'],
  ['--ts-bg-5', 'surface 5'],
  ['--ts-accent', 'accent'],
  ['--ts-text-primary', 'text primary'],
  ['--ts-text-secondary', 'text secondary'],
  ['--ts-success', 'success'],
  ['--ts-warning', 'warning'],
  ['--ts-danger', 'danger']
];

const refreshTokenDynamicGrid = () => {
  const grid = document.getElementById('token-lab-dynamic-grid');
  if (!grid) return;
  const cs = getComputedStyle(document.documentElement);
  grid.innerHTML = '';
  TOKEN_LAB_VARS.forEach(([cssVar, title]) => {
    const raw = cs.getPropertyValue(cssVar).trim();
    const card = document.createElement('div');
    card.className = 'ts-token-lab-card';
    const sw = document.createElement('div');
    sw.className = 'ts-token-lab-card__swatch';
    sw.style.background = raw || 'transparent';
    sw.title = title;
    const nameEl = document.createElement('div');
    nameEl.className = 'ts-fs-sm ts-font-mono';
    nameEl.textContent = cssVar;
    const hexEl = document.createElement('div');
    hexEl.className = 'ts-caption';
    hexEl.textContent = cssColorToHex(raw) || raw || '—';
    card.appendChild(sw);
    card.appendChild(nameEl);
    card.appendChild(hexEl);
    grid.appendChild(card);
  });
};

const syncSurfacePresetModeVisibility = () => {
  const root = document.documentElement;
  const mode = (
    root.getAttribute('data-ts-theme') ||
    root.getAttribute('data-theme') ||
    ''
  ).toLowerCase();
  const lightActive = mode === 'light';
  const darkHeading = document.getElementById('surface-preset-dark-heading');
  const darkGrid = document.getElementById('surface-preset-dark-grid');
  const lightHeading = document.getElementById('surface-preset-light-heading');
  const lightGrid = document.getElementById('surface-preset-light-grid');
  if (darkHeading) {
    darkHeading.hidden = lightActive;
    darkHeading.setAttribute('aria-hidden', lightActive ? 'true' : 'false');
  }
  if (darkGrid) {
    darkGrid.hidden = lightActive;
    darkGrid.setAttribute('aria-hidden', lightActive ? 'true' : 'false');
  }
  if (lightHeading) {
    lightHeading.hidden = !lightActive;
    lightHeading.setAttribute('aria-hidden', lightActive ? 'false' : 'true');
  }
  if (lightGrid) {
    lightGrid.hidden = !lightActive;
    lightGrid.setAttribute('aria-hidden', lightActive ? 'false' : 'true');
  }
};

const buildComputedRootBlock = () => {
  const order = [
    'ts-bg-body',
    'ts-bg-0',
    'ts-bg-1',
    'ts-bg-2',
    'ts-bg-3',
    'ts-bg-4',
    'ts-bg-5',
    'ts-text-primary',
    'ts-text-secondary',
    'ts-text-muted'
  ];
  let s = '/* Effective :root (computed on this page) */\n:root {\n';
  order.forEach((k) => {
    const v = getComputedStyle(document.documentElement).getPropertyValue('--' + k).trim();
    if (v) s += `  --${k}: ${v};\n`;
  });
  s += '}\n';
  return s;
};

const updateTokenSurfaceExport = () => {
  const ta = document.getElementById('token-surface-export');
  if (!ta || !window.Toolskin || typeof Toolskin.getSurfaceTokenMaps !== 'function') return;
  const m = Toolskin.getSurfaceTokenMaps();
  if (!m) return;
  const order = [
    'ts-bg-body',
    'ts-bg-0',
    'ts-bg-1',
    'ts-bg-2',
    'ts-bg-3',
    'ts-bg-4',
    'ts-bg-5',
    'ts-text-primary',
    'ts-text-secondary',
    'ts-text-muted'
  ];
  const block = (label, map) => {
    let s = `/* ${label} */\n`;
    order.forEach((k) => {
      if (map[k] != null) s += `  --${k}: ${map[k]};\n`;
    });
    return s;
  };
  let out = `${block('Dark theme (surface tokens)', m.dark)}\n${block('Light theme (surface tokens)', m.light)}`;
  const inc = document.getElementById('token-surface-export-include-computed');
  if (inc && inc.checked) {
    out += '\n' + buildComputedRootBlock();
  }
  ta.value = out;
};

const refreshThemeTokenUi = () => {
  updateSwatchLabels(TOKEN_SWATCH_SELECTOR);
  refreshTokenDynamicGrid();
  syncSurfacePresetModeVisibility();
  updateTokenSurfaceExport();
};

// 3. Robust Observer: Minimal impact to prevent hangs
let _themeUiTimer = null;
const scheduleThemeTokenUi = () => {
  clearTimeout(_themeUiTimer);
  _themeUiTimer = setTimeout(() => refreshThemeTokenUi(), 120);
};

const initThemeObserver = () => {
  refreshThemeTokenUi();

  // Only data-theme attrs — NOT `class` (Lenis/GSAP toggle classes on <html> constantly → reflow storm)
  const observer = new MutationObserver((mutations) => {
    const themeChanged = mutations.some(
      m => m.attributeName === 'data-ts-theme' || m.attributeName === 'data-theme'
    );
    if (themeChanged) scheduleThemeTokenUi();
  });

  observer.observe(document.documentElement, {
    attributes: true,
    childList: false,
    subtree: false,
    attributeFilter: ['data-ts-theme', 'data-theme']
  });
};

initThemeObserver();

document.getElementById('token-surface-export-refresh')?.addEventListener('click', () => {
  updateTokenSurfaceExport();
});

document.getElementById('token-surface-export-include-computed')?.addEventListener('change', () => {
  updateTokenSurfaceExport();
});

document.getElementById('token-surface-export-copy')?.addEventListener('click', async () => {
  const ta = document.getElementById('token-surface-export');
  if (!ta) return;
  try {
    await navigator.clipboard.writeText(ta.value || '');
    if (window.Toolskin && typeof Toolskin.showToast === 'function') {
      Toolskin.showToast('Surface export copied to clipboard.', { type: 'success', title: 'Copied' });
    }
  } catch (err) {
    console.warn('Copy failed', err);
  }
});

window.addEventListener('ts:theme-change', (e) => {
  if (!e.detail || !e.detail.userInitiated || !window.Toolskin || typeof Toolskin.showToast !== 'function') return;
  const modeLabel = e.detail.mode === 'dark' ? 'Dark' : 'Light';
  Toolskin.showToast(`${modeLabel} mode is active.`, { type: 'info', title: 'Theme' });
});

(function initFormsColorSwatch() {
  const wrap = document.querySelector('#forms .ts-swatch--picker');
  if (!wrap) return;
  const input = wrap.querySelector('input[type="color"]');
  const preview = wrap.querySelector('.ts-swatch__preview');
  const row = wrap.closest('.ts-color-row');
  const hexInput = row && row.querySelector('.ts-form-color-hex');
  if (!input || !preview) return;

  const applyHex = (hex) => {
    preview.style.background = hex;
    input.value = hex;
    if (hexInput) hexInput.value = hex;
  };

  const normalizeHex = (s) => {
    let t = String(s).trim();
    if (!t.startsWith('#')) t = '#' + t;
    if (!/^#[0-9a-fA-F]{6}$/.test(t)) return null;
    return t.toLowerCase();
  };

  input.addEventListener('input', () => applyHex(input.value));
  input.addEventListener('change', () => applyHex(input.value));
  if (hexInput) {
    const syncFromText = () => {
      const n = normalizeHex(hexInput.value);
      if (n) applyHex(n);
      else hexInput.value = input.value;
    };
    hexInput.addEventListener('change', syncFromText);
    hexInput.addEventListener('blur', syncFromText);
  }
})();

(function initTokenLabPreview() {
  const root = document.getElementById('token-preview-root');
  const accentHost = document.getElementById('token-accent-presets');
  const gradHost = document.getElementById('token-grad-presets');
  const btnApply = document.getElementById('token-preview-apply');
  const btnReset = document.getElementById('token-preview-reset');
  if (!root || !accentHost || !gradHost || !btnApply || !btnReset) return;

  const ACCENT_PRESETS = [
    { hex: '#ff540a', title: 'Orange' },
    { hex: '#00e5ff', title: 'Cyan' },
    { hex: '#2efc86', title: 'Green' },
    { hex: '#a855f7', title: 'Purple' },
    { hex: '#f7931a', title: 'Bitcoin' },
    { hex: '#ec4899', title: 'Pink' }
  ];

  const GRADIENT_PRESETS = [
    { title: 'Aurora', value: 'linear-gradient(135deg, #0f172a 0%, #4c1d95 40%, #ec4899 100%)' },
    { title: 'Sunset', value: 'linear-gradient(135deg, #ff540a 0%, #a855f7 100%)' },
    { title: 'Ocean', value: 'linear-gradient(160deg, #0ea5e9 0%, #0369a1 50%, #0f172a 100%)' },
    { title: 'Mint', value: 'linear-gradient(120deg, #134e4a 0%, #2efc86 100%)' },
    { title: 'Steel', value: 'linear-gradient(180deg, #334155 0%, #0f172a 100%)' }
  ];

  let previewAccentHex = '#ff540a';
  let appliedAccentFromPreview = false;
  let accentHexBeforeLabApply = null;

  const expandHex3 = (h) => {
    if (!h || h.length !== 4) return h;
    return '#' + h[1] + h[1] + h[2] + h[2] + h[3] + h[3];
  };
  const parseGradientHexStops = (css) => {
    const re = /#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})\b/g;
    const out = [];
    let m;
    while ((m = re.exec(css))) {
      let h = '#' + m[1];
      if (h.length === 4) h = expandHex3(h);
      if (h.length === 7) out.push(h.toLowerCase());
    }
    return out;
  };
  const relLuminance = (hex) => {
    const h = hex.replace('#', '');
    const r = parseInt(h.slice(0, 2), 16) / 255;
    const g = parseInt(h.slice(2, 4), 16) / 255;
    const b = parseInt(h.slice(4, 6), 16) / 255;
    const lin = (c) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
    const R = lin(r);
    const G = lin(g);
    const B = lin(b);
    return 0.2126 * R + 0.7152 * G + 0.0722 * B;
  };
  const contrastRatio = (hexA, hexB) => {
    const L1 = relLuminance(hexA);
    const L2 = relLuminance(hexB);
    const hi = Math.max(L1, L2);
    const lo = Math.min(L1, L2);
    return (hi + 0.05) / (lo + 0.05);
  };
  /** Pick foreground hex that maximizes minimum WCAG contrast across all gradient stops. */
  const accentForGradientStops = (stops) => {
    const pool = ['#ffffff', '#f8fafc', '#e2e8f0', '#0f172a', '#020617', '#000000'];
    stops.forEach((s) => {
      if (pool.indexOf(s) === -1) pool.push(s);
    });
    let best = '#ffffff';
    let bestScore = 0;
    pool.forEach((fg) => {
      const mins = stops.length ? Math.min.apply(null, stops.map((bg) => contrastRatio(fg, bg))) : 4.5;
      if (mins > bestScore) {
        bestScore = mins;
        best = fg;
      }
    });
    return best;
  };
  const applyGradientPreview = (gradientCss) => {
    const stops = parseGradientHexStops(gradientCss);
    root.style.setProperty('--token-preview-surface', gradientCss);
    if (stops.length) {
      const acc = accentForGradientStops(stops);
      root.style.setProperty('--token-preview-accent', acc);
      const avgL =
        stops.reduce((s, h) => s + relLuminance(h), 0) / stops.length;
      const mutedFg = avgL > 0.45 ? 'color-mix(in srgb, #0f172a 75%, var(--ts-text-secondary))' : 'color-mix(in srgb, #f1f5f9 80%, var(--ts-text-secondary))';
      root.style.setProperty('--token-preview-muted', mutedFg);
    }
  };

  const readDocHex = (cssVar) => {
    const raw = getComputedStyle(document.documentElement).getPropertyValue(cssVar).trim();
    return cssColorToHex(raw) || '';
  };

  const applyPreviewFromTheme = () => {
    const accent = readDocHex('--ts-accent') || '#ff540a';
    previewAccentHex = accent;
    const surf = getComputedStyle(document.documentElement).getPropertyValue('--ts-bg-1').trim();
    const muted = getComputedStyle(document.documentElement).getPropertyValue('--ts-text-secondary').trim();
    root.style.setProperty('--token-preview-accent', accent);
    root.style.setProperty('--token-preview-surface', surf);
    root.style.setProperty('--token-preview-muted', muted);
  };

  ACCENT_PRESETS.forEach((p) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'theme-swatch';
    b.style.background = p.hex;
    b.title = p.title;
    b.setAttribute('aria-label', 'Preview accent ' + p.title);
    b.addEventListener('click', () => {
      previewAccentHex = p.hex;
      root.style.setProperty('--token-preview-accent', p.hex);
      const muted = getComputedStyle(document.documentElement).getPropertyValue('--ts-text-secondary').trim();
      root.style.setProperty('--token-preview-muted', muted);
    });
    accentHost.appendChild(b);
  });

  GRADIENT_PRESETS.forEach((g) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'ts-grad-swatch';
    b.style.background = g.value;
    b.title = g.title;
    b.setAttribute('aria-label', 'Preview gradient ' + g.title);
    b.addEventListener('click', () => {
      applyGradientPreview(g.value);
    });
    gradHost.appendChild(b);
  });

  btnApply.addEventListener('click', () => {
    if (!window.Toolskin || typeof Toolskin.setAccentHex !== 'function') return;
    if (accentHexBeforeLabApply === null) {
      accentHexBeforeLabApply = readDocHex('--ts-accent') || '';
    }
    Toolskin.setAccentHex(previewAccentHex);
    appliedAccentFromPreview = true;
  });

  btnReset.addEventListener('click', () => {
    applyPreviewFromTheme();
    if (
      appliedAccentFromPreview &&
      accentHexBeforeLabApply != null &&
      window.Toolskin &&
      typeof Toolskin.setAccentHex === 'function'
    ) {
      Toolskin.setAccentHex(accentHexBeforeLabApply);
    }
    appliedAccentFromPreview = false;
    accentHexBeforeLabApply = null;
  });

  applyPreviewFromTheme();
})();

(function initSurfacePresetLab() {
  const TOKEN_ORDER = [
    'ts-bg-body',
    'ts-bg-0',
    'ts-bg-1',
    'ts-bg-2',
    'ts-bg-3',
    'ts-bg-4',
    'ts-bg-5',
    'ts-text-primary',
    'ts-text-secondary',
    'ts-text-muted'
  ];

  const formatPresetTokensCode = (tokens) => {
    const lines = ['{'];
    TOKEN_ORDER.forEach((k) => {
      if (tokens[k] != null) lines.push(`  '${k}': '${tokens[k]}',`);
    });
    lines.push('}');
    return lines.join('\n');
  };

  const buildSwatchGrid = (tokens) => {
    const wrap = document.createElement('div');
    wrap.className = 'surface-preset-swatches';
    const bgLabel = document.createElement('span');
    bgLabel.className = 'surface-preset-swatches__label';
    bgLabel.textContent = 'Background ramp';
    wrap.appendChild(bgLabel);
    const grid = document.createElement('div');
    grid.className = 'surface-preset-swatches__grid';
    const bgPairs = [
      ['B', 'ts-bg-body'],
      ['0', 'ts-bg-0'],
      ['1', 'ts-bg-1'],
      ['2', 'ts-bg-2'],
      ['3', 'ts-bg-3'],
      ['4', 'ts-bg-4'],
      ['5', 'ts-bg-5']
    ];
    bgPairs.forEach(([cap, key]) => {
      const slot = document.createElement('div');
      slot.className = 'surface-preset-swatches__slot';
      const cell = document.createElement('span');
      cell.className = 'surface-preset-swatches__cell';
      cell.style.background = tokens[key];
      cell.title = key;
      const c = document.createElement('span');
      c.className = 'surface-preset-swatches__cap';
      c.textContent = cap;
      slot.appendChild(cell);
      slot.appendChild(c);
      grid.appendChild(slot);
    });
    wrap.appendChild(grid);
    const txLabel = document.createElement('span');
    txLabel.className = 'surface-preset-swatches__label';
    txLabel.textContent = 'Text ramp';
    wrap.appendChild(txLabel);
    const trow = document.createElement('div');
    trow.className = 'surface-preset-swatches__text-row';
    [['1°', 'ts-text-primary'], ['2°', 'ts-text-secondary'], ['3°', 'ts-text-muted']].forEach(([cap, key]) => {
      const pill = document.createElement('div');
      pill.className = 'surface-preset-swatches__text-pill';
      const sw = document.createElement('div');
      sw.className = 'surface-preset-swatches__text-swatch';
      sw.style.background = tokens[key];
      sw.title = key;
      const c = document.createElement('span');
      c.className = 'surface-preset-swatches__cap';
      c.textContent = cap;
      pill.appendChild(sw);
      pill.appendChild(c);
      trow.appendChild(pill);
    });
    wrap.appendChild(trow);
    return wrap;
  };

  const wireCopy = (btn, codeEl) => {
    btn.addEventListener('click', async (ev) => {
      ev.preventDefault();
      ev.stopPropagation();
      const text = codeEl.textContent || '';
      try {
        await navigator.clipboard.writeText(text);
        btn.classList.add('copied');
        setTimeout(() => btn.classList.remove('copied'), 2000);
      } catch (err) {
        console.warn('Copy failed', err);
      }
    });
  };

  const buildGrid = (container, list, mode) => {
    if (!container || !list) return;
    container.innerHTML = '';
    list.forEach((preset) => {
      const card = document.createElement('article');
      card.className = 'ts-card surface-preset-card gradient';
      card.tabIndex = 0;
      card.setAttribute('role', 'button');
      card.setAttribute(
        'aria-label',
        `Apply ${preset.label} to ${mode === 'dark' ? 'dark' : 'light'} theme tokens only`
      );

      const head = document.createElement('div');
      head.className = 'ts-flex-row ts-items-center ts-gap-2 ts-flex-wrap';
      const h = document.createElement('h3');
      h.className = 'ts-h5';
      h.textContent = preset.label;
      head.appendChild(h);
      if (preset.recommended) {
        const badge = document.createElement('span');
        badge.className = 'ts-badge ts-badge--accent';
        badge.textContent = 'Recommended';
        head.appendChild(badge);
      }

      const contrast = document.createElement('p');
      contrast.className = 'ts-caption';
      contrast.textContent = preset.contrast;

      card.appendChild(head);
      card.appendChild(contrast);
      if (preset.description) {
        const desc = document.createElement('p');
        desc.className = 'ts-fs-sm ts-text-secondary';
        desc.textContent = preset.description;
        card.appendChild(desc);
      }
      card.appendChild(buildSwatchGrid(preset.tokens));

      const codeWindow = document.createElement('div');
      codeWindow.className = 'ts-code-window';
      const header = document.createElement('div');
      header.className = 'ts-code-header';
      const dotbtn = document.createElement('div');
      dotbtn.className = 'ts-code-dotbtn';
      const label = document.createElement('span');
      label.className = 'ts-code-label';
      label.textContent = mode === 'dark' ? 'dark-theme-tokens.js' : 'light-theme-tokens.js';
      const copyBtn = document.createElement('button');
      copyBtn.setAttribute('data-icon', 'ion:copy-outline');
      copyBtn.type = 'button';
      copyBtn.className = 'ts-code-copy';
      copyBtn.setAttribute('aria-label', 'Copy ' + preset.shortLabel + ' token block');
      /*   copyBtn.innerHTML =
          '<span class="ts-icon" data-ts-icon="fa-solid fa-copy" aria-hidden="true"></span>'; */
      header.appendChild(dotbtn);
      header.appendChild(label);
      header.appendChild(copyBtn);
      const content = document.createElement('div');
      content.className = 'ts-code-content';
      const pre = document.createElement('pre');
      const code = document.createElement('code');
      code.className = 'ts-mono';
      code.textContent = formatPresetTokensCode(preset.tokens);
      pre.appendChild(code);
      content.appendChild(pre);
      codeWindow.appendChild(header);
      codeWindow.appendChild(content);
      wireCopy(copyBtn, code);

      const row = document.createElement('div');
      row.className = 'ts-flex-row ts-gap-2 ts-items-center ts-flex-wrap';
      const applyBtn = document.createElement('button');
      applyBtn.setAttribute('data-icon', 'ion:checkmark-circle-outline');
      applyBtn.type = 'button';
      applyBtn.className = 'ts-btn ts-btn--primary ts-btn--sm';
      applyBtn.textContent = 'Apply';
      applyBtn.setAttribute(
        'aria-label',
        'Apply ' + preset.label + ' to ' + (mode === 'dark' ? 'dark' : 'light') + ' theme only'
      );
      row.appendChild(applyBtn);

      const apply = () => {
        if (!window.Toolskin) return;
        const applied =
          mode === 'dark'
            ? Toolskin.applyDarkSurfacePreset(preset.id)
            : Toolskin.applyLightSurfacePreset(preset.id);
        if (applied && typeof Toolskin.showToast === 'function') {
          const modeLabel = mode === 'dark' ? 'Dark' : 'Light';
          Toolskin.showToast(`${modeLabel} · ${applied.label}`, {
            type: 'success',
            title: 'Surface preset applied'
          });
        }
        scheduleThemeTokenUi();
      };

      applyBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        apply();
      });
      card.addEventListener('click', (e) => {
        if (e.target.closest('.ts-code-content') || e.target.closest('.ts-code-copy')) return;
        if (e.target.closest('.surface-preset-swatches')) return;
        if (e.target.closest('button.ts-btn')) return;
        apply();
      });
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          apply();
        }
      });

      card.appendChild(codeWindow);
      card.appendChild(row);
      container.appendChild(card);
    });

    if (window.ToolskinIcons && typeof ToolskinIcons.inject === 'function') {
      ToolskinIcons.inject(container);
    }
  };

  let surfaceLabBooted = false;

  const start = () => {
    if (surfaceLabBooted) return true;
    if (!window.Toolskin || typeof Toolskin.getSurfacePresetsCatalog !== 'function') return false;
    const cat = Toolskin.getSurfacePresetsCatalog();
    const darkGrid = document.getElementById('surface-preset-dark-grid');
    const lightGrid = document.getElementById('surface-preset-light-grid');
    const resetBtn = document.getElementById('surface-preset-reset');
    if (!cat || !cat.dark || !cat.light || !darkGrid || !lightGrid || !resetBtn) return false;

    buildGrid(darkGrid, cat.dark, 'dark');
    buildGrid(lightGrid, cat.light, 'light');

    const notesEl = document.getElementById('surface-preset-delivery-notes');
    if (notesEl && cat.meta && cat.meta.deliveryNotes) {
      notesEl.textContent = cat.meta.deliveryNotes;
    }

    initSurfaceContrastTuning();

    surfaceLabBooted = true;

    resetBtn.addEventListener('click', () => {
      if (!window.Toolskin || typeof Toolskin.resetSurfacePresets !== 'function') return;
      Toolskin.resetSurfacePresets();
      if (typeof Toolskin.showToast === 'function') {
        Toolskin.showToast(
          'Dark → Practical · Neutral. Light → Practical · Clean neutral.',
          { type: 'info', title: 'Surface presets reset' }
        );
      }
      scheduleThemeTokenUi();
    });
    return true;
  };

  function initSurfaceContrastTuning() {
    const range = document.getElementById('surface-contrast-range');
    const valOut = document.getElementById('surface-contrast-value');
    const applyBtn = document.getElementById('surface-contrast-apply');
    const clearBtn = document.getElementById('surface-contrast-clear');
    if (!range || range.dataset.tsBound === '1') return;
    range.dataset.tsBound = '1';

    const applyRootPreviewOnly = () => {
      const t = Number(range.value) / 100;
      if (valOut) valOut.textContent = String(range.value);
      const root = document.documentElement;
      const cs = getComputedStyle(root);
      const tp = cs.getPropertyValue('--ts-text-primary').trim();
      const tb = cs.getPropertyValue('--ts-bg-body').trim();
      const b1 = cs.getPropertyValue('--ts-bg-1').trim() || tb;
      const b3 = cs.getPropertyValue('--ts-bg-3').trim() || tb;
      const wSec = 0.12 + t * 0.38;
      const wMut = 0.28 + t * 0.42;
      const wAnchorMid = 0.35 + t * 0.3;
      const wAnchorDeep = 0.2 + t * 0.45;

      const fallbackMix = () => {
        const anchor = `color-mix(in oklch, ${tb} ${Math.round((1 - wAnchorMid) * 100)}%, ${b1})`;
        const anchorDeep = `color-mix(in oklch, ${anchor} ${Math.round((1 - wAnchorDeep) * 100)}%, ${b3})`;
        root.style.setProperty(
          '--ts-text-secondary',
          `color-mix(in oklch, ${tp} ${Math.round((1 - wSec) * 100)}%, ${anchor})`
        );
        root.style.setProperty(
          '--ts-text-muted',
          `color-mix(in oklch, ${tp} ${Math.round((1 - wMut) * 100)}%, ${anchorDeep})`
        );
      };

      if (typeof Color !== 'undefined') {
        try {
          const P = new Color(tp);
          const B = new Color(tb);
          const B1 = new Color(b1);
          const B3 = new Color(b3);
          const anchor = B.mix(B1, wAnchorMid, { space: 'oklch' });
          const anchorDeep = anchor.mix(B3, wAnchorDeep, { space: 'oklch' });
          const sec = P.mix(anchor, wSec, { space: 'oklch' });
          const mut = P.mix(anchorDeep, wMut, { space: 'oklch' });
          root.style.setProperty('--ts-text-secondary', sec.toString());
          root.style.setProperty('--ts-text-muted', mut.toString());
        } catch (e) {
          fallbackMix();
        }
      } else {
        fallbackMix();
      }
      scheduleThemeTokenUi();
    };

    let contrastPreviewRaf = null;
    const scheduleContrastPreview = () => {
      if (contrastPreviewRaf != null) return;
      contrastPreviewRaf = requestAnimationFrame(() => {
        contrastPreviewRaf = null;
        applyRootPreviewOnly();
      });
    };

    range.addEventListener('input', () => {
      if (valOut) valOut.textContent = String(range.value);
      scheduleContrastPreview();
    });
    range.addEventListener('change', () => {
      applyRootPreviewOnly();
    });

    applyBtn &&
      applyBtn.addEventListener('click', () => {
        if (window.Toolskin && typeof Toolskin.applyContrastTweakToSurfaceMaps === 'function') {
          const ok = Toolskin.applyContrastTweakToSurfaceMaps(Number(range.value));
          if (ok) {
            scheduleThemeTokenUi();
            if (typeof Toolskin.showToast === 'function') {
              Toolskin.showToast('Updated dark + light surface maps (text ramp + bg-2).', {
                type: 'success',
                title: 'Contrast tweak applied'
              });
            }
            return;
          }
        }
        applyRootPreviewOnly();
        if (window.Toolskin && typeof Toolskin.showToast === 'function') {
          Toolskin.showToast('Color.js not loaded — applied preview on the current page only.', {
            type: 'warning',
            title: 'Contrast tweak'
          });
        }
      });

    clearBtn &&
      clearBtn.addEventListener('click', () => {
        if (window.Toolskin && typeof Toolskin.revertContrastTweakMaps === 'function') {
          Toolskin.revertContrastTweakMaps();
        }
        document.documentElement.style.removeProperty('--ts-text-secondary');
        document.documentElement.style.removeProperty('--ts-text-muted');
        range.value = '35';
        if (valOut) valOut.textContent = '35';
        scheduleThemeTokenUi();
        if (window.Toolskin && typeof Toolskin.showToast === 'function') {
          Toolskin.showToast('Reverted map tweak or cleared page overrides.', {
            type: 'info',
            title: 'Contrast tweak cleared'
          });
        }
      });
  }

  /* Event-driven startup: no interval polling. */
  const tryStartSurfaceLab = () => start();
  window.addEventListener('ts:ready', tryStartSurfaceLab, { once: true });
  onToolskinReady(tryStartSurfaceLab);
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    tryStartSurfaceLab();
  }
  let _surfaceRafRetries = 0;
  const _surfaceRafBoot = () => {
    if (tryStartSurfaceLab() || _surfaceRafRetries > 24) return;
    _surfaceRafRetries += 1;
    requestAnimationFrame(_surfaceRafBoot);
  };
  requestAnimationFrame(_surfaceRafBoot);
})();

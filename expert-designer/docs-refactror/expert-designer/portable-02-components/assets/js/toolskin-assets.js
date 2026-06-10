/**
 * ToolskinAssets — Dynamic, non-blocking asset preloader
 * Part of the Toolskin Design System v1.0.0
 *
 * Replaces hardcoded CDN <link>/<script> tags with a runtime-managed pipeline.
 * Features:
 *  - Dynamic version resolution via cdnjs API (cached in localStorage)
 *  - Font preloading (woff2) with FOUC guard
 *  - Non-blocking style/script injection (media=print trick, defer)
 *  - Real progress tracking with callback system
 *  - Skeleton placeholder system
 *  - Smooth integration with ToolskinPreloader
 */
(function (window, document) {
  'use strict';

  /* ─── FOUC guard: add immediately ─── */
  document.documentElement.classList.add('ts-assets-loading');

  /* ─── Internal state ─── */
  const _registry = [];
  const _progressCbs = [];
  const _readyCbs = [];
  let _total = 0;
  let _loaded = 0;
  let _ready = false;
  let _loadStarted = false;

  /* ─── Version cache (localStorage) ─── */
  const CACHE_PREFIX = 'ts-cdn-';
  const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

  function getCachedVersion(id) {
    try {
      const raw = localStorage.getItem(CACHE_PREFIX + id + '-version');
      if (!raw) return null;
      const data = JSON.parse(raw);
      if (Date.now() - data.ts > CACHE_TTL) {
        localStorage.removeItem(CACHE_PREFIX + id + '-version');
        return null;
      }
      return data.v;
    } catch (_) {
      return null;
    }
  }

  function setCachedVersion(id, version) {
    try {
      localStorage.setItem(
        CACHE_PREFIX + id + '-version',
        JSON.stringify({ v: version, ts: Date.now() })
      );
    } catch (_) { /* quota exceeded — ignore */ }
  }

  /* ─── Version resolver ─── */
  async function resolveVersion(pkg, fallback) {
    const cached = getCachedVersion(pkg);
    if (cached) return cached;
    try {
      const res = await fetch(
        'https://api.cdnjs.com/libraries/' + encodeURIComponent(pkg) + '?fields=version',
        { signal: AbortSignal.timeout ? AbortSignal.timeout(4000) : undefined }
      );
      if (!res.ok) return fallback;
      const json = await res.json();
      const v = json.version;
      if (v) {
        setCachedVersion(pkg, v);
        return v;
      }
    } catch (_) { /* network error — use fallback */ }
    return fallback;
  }

  /* ─── Preconnect helper ─── */
  function addPreconnect(origin, crossOrigin) {
    if (document.querySelector('link[rel="preconnect"][href="' + origin + '"]')) return;
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = origin;
    if (crossOrigin) link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  }

  /* ─── Font preload (woff2) ─── */
  function preloadFont(url) {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'font';
    link.type = 'font/woff2';
    link.crossOrigin = 'anonymous';
    link.href = url;
    document.head.appendChild(link);
  }

  /* ─── Non-blocking style loader (media=print trick) ─── */
  function loadStyle(href) {
    return new Promise(function (resolve) {
      // Check for duplicate
      if (document.querySelector('link[href="' + href + '"]')) {
        resolve();
        return;
      }
      var link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      link.media = 'print';
      link.onload = function () {
        link.media = 'all';
        resolve();
      };
      link.onerror = function () {
        resolve(); // don't block on failure
      };
      document.head.appendChild(link);
    });
  }

  /* ─── Script loader (deferred) ─── */
  function loadScript(src, isModule) {
    return new Promise(function (resolve) {
      // Check for duplicate
      if (document.querySelector('script[src="' + src + '"]')) {
        resolve();
        return;
      }
      var s = document.createElement('script');
      s.src = src;
      if (isModule) {
        s.type = 'module';
      } else {
        s.defer = true;
      }
      s.onload = resolve;
      s.onerror = function () {
        resolve(); // don't block on failure
      };
      document.body.appendChild(s);
    });
  }

  /* ─── Progress tracking ─── */
  function _emitProgress() {
    var p = _total > 0 ? _loaded / _total : 0;
    for (var i = 0; i < _progressCbs.length; i++) {
      try { _progressCbs[i](p); } catch (_) { /* swallow */ }
    }
  }

  function _markLoaded() {
    _loaded++;
    _emitProgress();
  }

  function _checkReady() {
    if (_ready) return;
    if (_loaded >= _total) {
      _ready = true;
      // Remove FOUC guard
      document.documentElement.classList.remove('ts-assets-loading');
      for (var i = 0; i < _readyCbs.length; i++) {
        try { _readyCbs[i](); } catch (_) { /* swallow */ }
      }
    }
  }

  /* ─── Font readiness (document.fonts API) ─── */
  // Google Fonts are loaded render-blocking in <head>, so no waitFonts needed for them.
  // Only Font Awesome needs font readiness tracking (async CDN load).
  //
  // FONT_MAP includes both FA6 and FA7 family names as a forward-compat measure.
  // FA is pinned to v6 in the registry, but if a future migration to FA7 happens,
  // the waitFonts check won't block indefinitely on the wrong family name.
  const FONT_MAP = {
    fontawesome: [
      { family: 'Font Awesome 6 Free', weight: '900' },
      { family: 'Font Awesome 6 Free', weight: '400' },
      { family: 'Font Awesome 6 Brands', weight: '400' },
      // FA7 forward-compat (will resolve immediately if FA7 isn't loaded)
      { family: 'Font Awesome 7 Free', weight: '900' },
    ],
  };

  // Purge stale version cache from previous 'latest' resolution that may have cached FA 7.0.1
  try { localStorage.removeItem('ts-cdn-font-awesome-version'); } catch (_) { }

  async function waitFonts(id) {
    var fonts = FONT_MAP[id];
    if (!fonts || !document.fonts) return;
    var checks = fonts.map(function (f) {
      return document.fonts.load(f.weight + ' 1em "' + f.family + '"').catch(function () { });
    });
    await Promise.all(checks);
  }

  /* ─── Load a single registered asset ─── */
  async function _loadAsset(asset) {
    try {
      // Resolve version: 'latest' → API lookup, fixed string → use directly
      var version = asset._resolvedVersion || '';
      if (asset.version === 'latest' && asset.cdnjsName) {
        version = await resolveVersion(asset.cdnjsName, asset.fallbackVersion || '');
        asset._resolvedVersion = version;
      } else if (asset.version && asset.version !== 'latest') {
        version = asset.version;
      }

      // Add preconnects
      if (asset.preconnects) {
        asset.preconnects.forEach(function (pc) {
          addPreconnect(pc.origin, pc.crossOrigin);
        });
      }

      // Preload fonts (woff2)
      if (asset.fonts && typeof asset.fonts === 'function') {
        var fontUrls = asset.fonts(version);
        fontUrls.forEach(preloadFont);
      }

      // Load the asset
      var url = typeof asset.cdn === 'function' ? asset.cdn(version) : asset.cdn;

      if (asset.type === 'style') {
        await loadStyle(url);
        // Wait for font faces to be ready
        await waitFonts(asset.id);
      } else if (asset.type === 'script') {
        await loadScript(url, asset.module);
      }
    } catch (_) {
      // Don't block pipeline on individual asset failure
    }
    _markLoaded();
  }

  /* ─── Skeleton system ─── */
  function _initSkeletons() {
    var skels = document.querySelectorAll('[data-ts-skeleton]');
    skels.forEach(function (el) {
      var w = el.getAttribute('data-ts-skeleton-w') || el.offsetWidth + 'px';
      var h = el.getAttribute('data-ts-skeleton-h') || el.offsetHeight + 'px';
      el.classList.add('ts-skeleton');
      if (!el.style.width && w) el.style.width = w;
      if (!el.style.height && h) el.style.height = h;
    });
  }

  function _releaseSkeletons() {
    var skels = document.querySelectorAll('.ts-skeleton');
    skels.forEach(function (el) {
      el.classList.add('ts-skeleton--loaded');
    });
  }

  /* ─── Public API ─── */
  var ToolskinAssets = {
    /**
     * Register an asset to be loaded dynamically.
     * @param {object} asset
     * @param {string} asset.id - Unique identifier (e.g. 'fontawesome')
     * @param {string} asset.type - 'style' | 'script'
     * @param {string} [asset.version] - 'latest' to auto-resolve, or a fixed string
     * @param {string} [asset.cdnjsName] - Package name on cdnjs (for version resolution)
     * @param {string} [asset.fallbackVersion] - Fallback version if API fails
     * @param {Function|string} asset.cdn - URL template fn(version) or static URL
     * @param {Function} [asset.fonts] - fn(version) returning array of woff2 URLs to preload
     * @param {boolean} [asset.module] - True for ES modules (type="module")
     * @param {Array} [asset.preconnects] - Array of {origin, crossOrigin} objects
     */
    register: function (asset) {
      _registry.push(asset);
    },

    /**
     * Start loading all registered assets. Call once after all register() calls.
     * @returns {Promise} Resolves when all assets are loaded.
     */
    loadAll: function () {
      if (_loadStarted) return Promise.resolve();
      _loadStarted = true;
      _total = _registry.length;
      _loaded = 0;

      if (_total === 0) {
        _ready = true;
        document.documentElement.classList.remove('ts-assets-loading');
        _emitProgress();
        for (var i = 0; i < _readyCbs.length; i++) {
          try { _readyCbs[i](); } catch (_) { }
        }
        return Promise.resolve();
      }

      // Init skeletons before load
      _initSkeletons();

      var promises = _registry.map(_loadAsset);

      return Promise.all(promises).then(function () {
        _checkReady();
        _releaseSkeletons();
      });
    },

    /**
     * Get current progress as 0–1 ratio.
     */
    getProgress: function () {
      return _total > 0 ? _loaded / _total : 0;
    },

    /**
     * Subscribe to progress updates.
     * @param {Function} cb - Called with progress ratio (0–1)
     */
    onProgress: function (cb) {
      if (typeof cb === 'function') _progressCbs.push(cb);
    },

    /**
     * Subscribe to the ready event (all assets loaded).
     * @param {Function} cb
     */
    onReady: function (cb) {
      if (typeof cb === 'function') {
        if (_ready) {
          cb();
        } else {
          _readyCbs.push(cb);
        }
      }
    },

    /**
     * Check if all assets are loaded.
     */
    isReady: function () {
      return _ready;
    },

    /** Expose for testing / debugging */
    _registry: _registry,
    _resolveVersion: resolveVersion,
  };

  /* ─── Register default Toolskin CDN assets ─── */

  // Google Fonts — loaded render-blocking in <head> for FOUC prevention.
  // NOT registered here to avoid double-loading. The <head> link handles:
  //   Space Grotesk (body/display), JetBrains Mono (code).
  // Syne is NOT a default — only available via font picker in banner generator/sidebar.

  // Font Awesome — PINNED to v6. Do NOT use 'latest' — FA7 changes font-family names
  // and breaks all CSS content: icon rules that use FA6 Unicode codepoints.
  // The version is pinned here; update manually when migrating to FA7.
  ToolskinAssets.register({
    id: 'fontawesome',
    type: 'style',
    version: '6.7.2',
    cdn: function (v) {
      return 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/' + v + '/css/all.min.css';
    },
    fonts: function (v) {
      return [
        'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/' + v + '/webfonts/fa-solid-900.woff2',
        'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/' + v + '/webfonts/fa-regular-400.woff2',
        'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/' + v + '/webfonts/fa-brands-400.woff2',
      ];
    },
    preconnects: [
      { origin: 'https://cdnjs.cloudflare.com' },
    ],
  });

  // ── VERSION SAFETY AUDIT ──
  // FA: pinned to 6.7.2 (FA7 breaks font-family names)
  // Ionicons: major-pinned @7 (safe — web component API stable within major)
  // Lenis: major-pinned @1 (safe — CSS/JS API stable within major)
  // Locomotive: unpinned (uses /bundled/ path which is latest — low risk, no CSS deps)
  // GSAP: exact 3.13.0 (safe — pinned)
  // Color.js: unpinned (utility lib, no CSS deps — low risk)
  // No other asset uses version: 'latest' with API resolution.

  // Ionicons — ES module (major-pinned @7)
  ToolskinAssets.register({
    id: 'ionicons',
    type: 'script',
    module: true,
    cdn: function () {
      return 'https://unpkg.com/ionicons@7/dist/ionicons/ionicons.esm.js';
    },
    preconnects: [
      { origin: 'https://unpkg.com' },
    ],
  });

  // Lenis CSS
  ToolskinAssets.register({
    id: 'lenis-css',
    type: 'style',
    cdn: function () {
      return 'https://unpkg.com/lenis@1/dist/lenis.css';
    },
  });

  // Lenis JS
  ToolskinAssets.register({
    id: 'lenis-js',
    type: 'script',
    cdn: function () {
      return 'https://unpkg.com/lenis@1/dist/lenis.min.js';
    },
  });

  // Locomotive Scroll
  ToolskinAssets.register({
    id: 'locomotive',
    type: 'script',
    cdn: function () {
      return 'https://cdn.jsdelivr.net/npm/locomotive-scroll/bundled/locomotive-scroll.min.js';
    },
    preconnects: [
      { origin: 'https://cdn.jsdelivr.net' },
    ],
  });

  // GSAP
  ToolskinAssets.register({
    id: 'gsap',
    type: 'script',
    cdn: function () {
      return 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.13.0/gsap.min.js';
    },
  });

  // GSAP ScrollTrigger
  ToolskinAssets.register({
    id: 'gsap-scrolltrigger',
    type: 'script',
    cdn: function () {
      return 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.13.0/ScrollTrigger.min.js';
    },
  });

  // Color.js
  ToolskinAssets.register({
    id: 'colorjs',
    type: 'script',
    cdn: function () {
      return 'https://colorjs.io/dist/color.global.js';
    },
    preconnects: [
      { origin: 'https://colorjs.io' },
    ],
  });

  /* ─── Expose globally ─── */
  window.ToolskinAssets = ToolskinAssets;

})(window, document);

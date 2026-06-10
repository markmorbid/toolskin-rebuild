/*!
 * Toolskin · ts-gallery
 * ─────────────────────
 * Float-based asymmetric image gallery with lazy-load skeleton,
 * caption overlay, and a token-styled lightbox.
 *
 * Namespace : window.ToolskinUIKit.Gallery
 * Selectors : .ts-gallery , [data-ts-gallery]
 * Aliases   : .ts-gallery-lightbox  (separate from #ts-lightbox / Three.js phantom-gallery)
 *
 * Markup (most ergonomic — just a list of images):
 *   <ul class="ts-gallery" data-ts-gallery>
 *     <li class="quarter double-height" data-src="big.jpg" data-thumb="thumb.jpg" data-caption="Hero"></li>
 *     <li class="quarter responsive-half"><img src="x.jpg" alt="..."></li>
 *     <li class="half"><a href="full.jpg"><img src="thumb.jpg" alt="..."></a></li>
 *   </ul>
 *
 * Programmatic build:
 *   ToolskinUIKit.Gallery.create(container, {
 *     images: [
 *       { src: 'a.jpg', thumb: 't.jpg', caption: '...', size: 'half' },
 *       { src: 'b.jpg', size: 'quarter double-height' },
 *     ]
 *   });
 *
 * Auto-init: any element with [data-ts-gallery] hydrates on DOMContentLoaded.
 *
 * Known limitation (v1 draft):
 *   Items appended via Gallery.append() AFTER initial sortable wiring are
 *   NOT draggable — TSUISortable() is one-shot per container and guards
 *   against re-init. For dynamic sortable galleries, pre-render all items
 *   server-side or rebuild the gallery on changes. This will be addressed
 *   when TSUISortable gains a refresh() method.
 */
(function (global) {
	'use strict';

	/* ── tiny helpers ───────────────────────────────────────────────── */

	const escapeHTML = (s) => {
		const d = document.createElement('div');
		d.textContent = s == null ? '' : String(s);
		return d.innerHTML;
	};

	const onMobile = () => window.matchMedia('(max-width: 600px)').matches;

	/* Re-trigger Toolskin's reveal observer for newly-built items */
	const refreshReveal = () => {
		try {
			const T = global.Toolskin;
			if (T && T.observer && typeof T.observer.refresh === 'function') {
				T.observer.refresh();
			}
		} catch (_e) { /* noop */ }
	};


	/* ═══════════════════════════════════════════════════════════════════
	   ITEM HYDRATION
	   ═══════════════════════════════════════════════════════════════════ */

	/** Read raw <li> data into a normalized record, regardless of input shape */
	function readItemData(li) {
		// 1. data-src takes priority
		let src = li.getAttribute('data-src');
		let thumb = li.getAttribute('data-thumb') || src;
		let caption = li.getAttribute('data-caption');
		let alt = li.getAttribute('data-alt') || caption || '';
		let href = li.getAttribute('data-href');

		// 2. Fall back to a child <img> (which may be wrapped in <a>)
		if (!src) {
			const innerImg = li.querySelector('img');
			if (innerImg) {
				src = innerImg.getAttribute('data-src') ||
				      innerImg.getAttribute('src') ||
				      innerImg.getAttribute('data-full');
				thumb = innerImg.getAttribute('src') || src;
				alt = innerImg.getAttribute('alt') || alt;
			}
			const innerA = li.querySelector('a[href]');
			if (innerA && !href) {
				const ah = innerA.getAttribute('href');
				// If the <a> points to an image, treat it as the full-res source
				if (/\.(jpe?g|png|gif|webp|avif|bmp)(\?.*)?$/i.test(ah)) {
					src = ah;
				} else {
					href = ah;
				}
			}
		}

		return { src, thumb, caption, alt, href };
	}

	/** Replace the <li>'s contents with the canonical figure structure */
	function hydrateItem(li, index) {
		if (li.__tsGalleryHydrated) return;
		li.__tsGalleryHydrated = true;

		const data = readItemData(li);
		if (!data.src) return;             // no usable image — skip silently

		// Stash for the lightbox
		li.__tsGalleryData = data;
		li.__tsGalleryIndex = index;

		// Wipe and rebuild
		li.innerHTML = '';
		li.setAttribute('role', 'button');
		li.setAttribute('tabindex', '0');
		if (data.caption) li.setAttribute('aria-label', data.caption);

		const figure = document.createElement('figure');
		figure.className = 'ts-gallery__figure';
		figure.style.cssText = 'margin:0;padding:0;width:100%;height:100%;position:relative;';

		// Skeleton
		const skel = document.createElement('div');
		skel.className = 'ts-gallery__skeleton';
		figure.appendChild(skel);

		// Media (background-image painted on load)
		const media = document.createElement('div');
		media.className = 'ts-gallery__media';
		media.setAttribute('data-src', data.thumb);
		figure.appendChild(media);

		// Caption overlay (only render if caption present)
		if (data.caption) {
			const overlay = document.createElement('div');
			overlay.className = 'ts-gallery__overlay';
			const cap = document.createElement('figcaption');
			cap.className = 'ts-gallery__caption';
			cap.textContent = data.caption;
			overlay.appendChild(cap);
			figure.appendChild(overlay);
		}

		// SEO/a11y hidden img — search engines + screen readers see this
		const seoImg = document.createElement('img');
		seoImg.className = 'ts-gallery__seo-img';
		seoImg.src = data.thumb;
		seoImg.alt = data.alt || '';
		seoImg.loading = 'lazy';
		seoImg.decoding = 'async';
		figure.appendChild(seoImg);

		li.appendChild(figure);
	}


	/* ═══════════════════════════════════════════════════════════════════
	   LAZY LOAD  (single shared IntersectionObserver per page)
	   ═══════════════════════════════════════════════════════════════════ */

	let _lazyIO = null;
	function getLazyIO() {
		if (_lazyIO) return _lazyIO;
		if (!('IntersectionObserver' in window)) return null;
		_lazyIO = new IntersectionObserver((entries) => {
			entries.forEach((entry) => {
				if (!entry.isIntersecting) return;
				const media = entry.target;
				const src = media.getAttribute('data-src');
				if (!src) return;

				const probe = new Image();
				probe.onload = () => {
					media.style.backgroundImage = 'url("' + src.replace(/"/g, '\\"') + '")';
					media.classList.add('ts-gallery__media--loaded');
					const li = media.closest('.ts-gallery > li, .ts-gallery > .ts-gallery__item');
					if (li) li.classList.add('ts-gallery__item--loaded');
				};
				probe.onerror = () => {
					media.classList.add('ts-gallery__media--error');
				};
				probe.src = src;

				_lazyIO.unobserve(media);
			});
		}, {
			rootMargin: '200px 0px',         // start loading slightly before entry
			threshold: 0.01
		});
		return _lazyIO;
	}

	function attachLazyLoad(galleryEl) {
		const io = getLazyIO();
		if (!io) {
			// No IO support → load everything eagerly
			galleryEl.querySelectorAll('.ts-gallery__media').forEach((m) => {
				const src = m.getAttribute('data-src');
				if (src) {
					m.style.backgroundImage = 'url("' + src.replace(/"/g, '\\"') + '")';
					m.classList.add('ts-gallery__media--loaded');
					const li = m.closest('li, .ts-gallery__item');
					if (li) li.classList.add('ts-gallery__item--loaded');
				}
			});
			return;
		}
		galleryEl.querySelectorAll('.ts-gallery__media').forEach((m) => io.observe(m));
	}


	/* ═══════════════════════════════════════════════════════════════════
	   GALLERY HYDRATION (the public single-element entry point)
	   ═══════════════════════════════════════════════════════════════════ */

	function hydrateGallery(galleryEl) {
		if (!galleryEl || galleryEl.__tsGalleryInit) return galleryEl;
		galleryEl.__tsGalleryInit = true;

		// Apply default reveal class for staggered entrance (the existing
		// ToolskinObserver picks these up after refreshReveal() fires)
		const items = Array.from(galleryEl.children).filter(
			(c) => c.tagName === 'LI' || c.classList.contains('ts-gallery__item')
		);
		items.forEach((li, i) => {
			hydrateItem(li, i);
			if (!li.classList.contains('ts-fade-up') &&
			    !li.classList.contains('ts-fade-in') &&
			    !galleryEl.hasAttribute('data-ts-gallery-no-reveal')) {
				li.classList.add('ts-fade-in');
				li.style.transitionDelay = (i * 60) + 'ms';
			}
		});

		// Click + keyboard → open lightbox
		galleryEl.addEventListener('click', (e) => {
			const li = e.target.closest('li, .ts-gallery__item');
			if (!li || !galleryEl.contains(li)) return;
			openLightbox(galleryEl, li.__tsGalleryIndex || 0);
		});
		galleryEl.addEventListener('keydown', (e) => {
			if (e.key !== 'Enter' && e.key !== ' ') return;
			const li = e.target.closest('li, .ts-gallery__item');
			if (!li || !galleryEl.contains(li)) return;
			e.preventDefault();
			openLightbox(galleryEl, li.__tsGalleryIndex || 0);
		});

		// Lazy-load the media
		attachLazyLoad(galleryEl);

		// Sortable opt-in: data-ts-gallery-sortable adds the UIKit sortable hooks
		if (galleryEl.hasAttribute('data-ts-gallery-sortable')) {
			galleryEl.classList.add('ts-ui-sortable', 'ts-gallery--sortable');
			items.forEach((li) => li.classList.add('ts-ui-sortable__item'));
			if (global.ToolskinUIKit && typeof global.ToolskinUIKit.Sortable === 'function') {
				global.ToolskinUIKit.Sortable(galleryEl);
			}
		}

		// Re-observe so the reveal fires
		refreshReveal();

		return galleryEl;
	}


	/* ═══════════════════════════════════════════════════════════════════
	   PROGRAMMATIC BUILDER
	   ═══════════════════════════════════════════════════════════════════ */

	function createGallery(container, options) {
		options = options || {};
		const images = options.images || [];
		const variant = options.variant || '';        // 'portfolio', 'uniform'
		const className = ['ts-gallery'];
		if (variant) className.push('ts-gallery--' + variant);
		if (options.className) className.push(options.className);

		const ul = document.createElement('ul');
		ul.className = className.join(' ');
		ul.setAttribute('data-ts-gallery', '');

		images.forEach((img) => {
			const li = document.createElement('li');
			if (typeof img === 'string') {
				li.setAttribute('data-src', img);
			} else {
				if (img.src) li.setAttribute('data-src', img.src);
				if (img.thumb) li.setAttribute('data-thumb', img.thumb);
				if (img.caption) li.setAttribute('data-caption', img.caption);
				if (img.alt) li.setAttribute('data-alt', img.alt);
				if (img.href) li.setAttribute('data-href', img.href);
				if (img.size) li.className = img.size;
			}
			ul.appendChild(li);
		});

		container.appendChild(ul);
		hydrateGallery(ul);
		return ul;
	}


	/* ═══════════════════════════════════════════════════════════════════
	   APPEND — add an image to an already-hydrated gallery at runtime
	   ═══════════════════════════════════════════════════════════════════ */

	function appendImage(galleryEl, img) {
		if (!galleryEl) return null;
		const existingCount = Array.from(galleryEl.children).filter(
			(c) => c.tagName === 'LI' || c.classList.contains('ts-gallery__item')
		).length;

		const li = document.createElement('li');
		if (typeof img === 'string') {
			li.setAttribute('data-src', img);
		} else {
			if (img.src) li.setAttribute('data-src', img.src);
			if (img.thumb) li.setAttribute('data-thumb', img.thumb);
			if (img.caption) li.setAttribute('data-caption', img.caption);
			if (img.alt) li.setAttribute('data-alt', img.alt);
			if (img.size) li.className = img.size;
		}
		galleryEl.appendChild(li);

		hydrateItem(li, existingCount);
		const io = getLazyIO();
		const media = li.querySelector('.ts-gallery__media');
		if (io && media) io.observe(media);
		else if (media) {
			const src = media.getAttribute('data-src');
			if (src) {
				media.style.backgroundImage = 'url("' + src.replace(/"/g, '\\"') + '")';
				media.classList.add('ts-gallery__media--loaded');
				li.classList.add('ts-gallery__item--loaded');
			}
		}

		// Make sortable, if the gallery is sortable
		if (galleryEl.classList.contains('ts-ui-sortable')) {
			li.classList.add('ts-ui-sortable__item');
			if (global.ToolskinUIKit && typeof global.ToolskinUIKit.Sortable === 'function') {
				global.ToolskinUIKit.Sortable(galleryEl);
			}
		}

		return li;
	}


	/* ═══════════════════════════════════════════════════════════════════
	   LIGHTBOX  ·  .ts-gallery-lightbox
	   ═══════════════════════════════════════════════════════════════════ */

	let _lb = null;
	let _lbState = { gallery: null, index: 0, items: [] };

	function buildLightbox() {
		if (_lb) return _lb;

		const overlay = document.createElement('div');
		overlay.className = 'ts-gallery-lightbox';
		overlay.setAttribute('role', 'dialog');
		overlay.setAttribute('aria-modal', 'true');
		overlay.setAttribute('aria-label', 'Image gallery viewer');
		overlay.tabIndex = -1;

		overlay.innerHTML = `
			<button type="button" class="ts-gallery-lightbox__btn ts-gallery-lightbox__btn--close" aria-label="Close gallery">
				<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>
			</button>
			<button type="button" class="ts-gallery-lightbox__btn ts-gallery-lightbox__btn--prev" aria-label="Previous image">
				<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 18l-6-6 6-6"/></svg>
			</button>
			<button type="button" class="ts-gallery-lightbox__btn ts-gallery-lightbox__btn--next" aria-label="Next image">
				<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 18l6-6-6-6"/></svg>
			</button>
			<div class="ts-gallery-lightbox__counter" aria-live="polite"></div>
			<div class="ts-gallery-lightbox__stage">
				<img class="ts-gallery-lightbox__img" alt="">
			</div>
			<div class="ts-gallery-lightbox__caption"></div>
		`;

		document.body.appendChild(overlay);

		const close = overlay.querySelector('.ts-gallery-lightbox__btn--close');
		const prev = overlay.querySelector('.ts-gallery-lightbox__btn--prev');
		const next = overlay.querySelector('.ts-gallery-lightbox__btn--next');
		const stage = overlay.querySelector('.ts-gallery-lightbox__stage');

		close.addEventListener('click', closeLightbox);
		prev.addEventListener('click', () => stepLightbox(-1));
		next.addEventListener('click', () => stepLightbox(+1));

		// Click backdrop to close (but not the image / controls)
		overlay.addEventListener('click', (e) => {
			if (e.target === overlay || e.target === stage) closeLightbox();
		});

		// Keyboard
		document.addEventListener('keydown', (e) => {
			if (!overlay.classList.contains('ts-gallery-lightbox--open')) return;
			if (e.key === 'Escape') closeLightbox();
			else if (e.key === 'ArrowLeft') stepLightbox(-1);
			else if (e.key === 'ArrowRight') stepLightbox(+1);
		});

		// Touch swipe
		let touchStartX = null;
		stage.addEventListener('touchstart', (e) => {
			if (e.touches.length === 1) touchStartX = e.touches[0].clientX;
		}, { passive: true });
		stage.addEventListener('touchend', (e) => {
			if (touchStartX === null) return;
			const dx = (e.changedTouches[0].clientX) - touchStartX;
			if (Math.abs(dx) > 40) stepLightbox(dx < 0 ? +1 : -1);
			touchStartX = null;
		}, { passive: true });

		_lb = overlay;
		return overlay;
	}

	function openLightbox(galleryEl, startIndex) {
		const items = Array.from(galleryEl.children).filter(
			(c) => c.__tsGalleryData && c.__tsGalleryData.src
		);
		if (!items.length) return;

		_lbState = { gallery: galleryEl, index: Math.max(0, Math.min(startIndex || 0, items.length - 1)), items };
		const overlay = buildLightbox();

		document.body.classList.add('ts-gallery-lightbox-open');
		overlay.classList.add('ts-gallery-lightbox--open');

		// Focus management — return focus to the trigger on close
		_lbState.returnFocus = document.activeElement;
		setTimeout(() => overlay.focus(), 0);

		renderLightbox();
	}

	function closeLightbox() {
		if (!_lb) return;
		_lb.classList.remove('ts-gallery-lightbox--open');
		document.body.classList.remove('ts-gallery-lightbox-open');
		if (_lbState.returnFocus && typeof _lbState.returnFocus.focus === 'function') {
			_lbState.returnFocus.focus();
		}
	}

	function stepLightbox(delta) {
		const n = _lbState.items.length;
		if (!n) return;
		_lbState.index = (_lbState.index + delta + n) % n;
		renderLightbox();
	}

	function renderLightbox() {
		if (!_lb) return;
		const item = _lbState.items[_lbState.index];
		if (!item) return;
		const data = item.__tsGalleryData;
		const img = _lb.querySelector('.ts-gallery-lightbox__img');
		const cap = _lb.querySelector('.ts-gallery-lightbox__caption');
		const counter = _lb.querySelector('.ts-gallery-lightbox__counter');

		img.classList.remove('ts-gallery-lightbox__img--loaded');

		const probe = new Image();
		probe.onload = () => {
			img.src = data.src;
			img.alt = data.alt || data.caption || '';
			requestAnimationFrame(() => img.classList.add('ts-gallery-lightbox__img--loaded'));
		};
		probe.onerror = () => {
			img.alt = 'Failed to load image';
		};
		probe.src = data.src;

		cap.textContent = data.caption || '';
		cap.style.display = data.caption ? '' : 'none';
		counter.textContent = (_lbState.index + 1) + ' / ' + _lbState.items.length;
	}


	/* ═══════════════════════════════════════════════════════════════════
	   PUBLIC API + AUTO-INIT
	   ═══════════════════════════════════════════════════════════════════ */

	function initAll(root) {
		root = root || document;
		root.querySelectorAll('.ts-gallery, [data-ts-gallery]').forEach(hydrateGallery);
	}

	const API = {
		init: initAll,
		hydrate: hydrateGallery,
		create: createGallery,
		append: appendImage,
		open: openLightbox,
		close: closeLightbox,
	};

	// Expose under ToolskinUIKit (existing namespace) and as Toolskin.Gallery (mirror)
	if (!global.ToolskinUIKit) global.ToolskinUIKit = {};
	global.ToolskinUIKit.Gallery = API;
	if (global.Toolskin) global.Toolskin.Gallery = API;

	// Auto-init
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', () => initAll(document));
	} else {
		initAll(document);
	}
})(typeof window !== 'undefined' ? window : this);

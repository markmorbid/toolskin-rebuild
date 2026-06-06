/* ═══════════════════════════════════════════════════════    TOOLSKIN BANNER GENERATOR v2.3    Export engine: Pure Canvas 2D — pixel-perfect WYSIWYG    No html2canvas dependency. ═══════════════════════════════════════════════════════ */
// ── FONT LOADING ── 
const FONTS = ['Bebas Neue', 'Anton', 'Barlow Condensed', 'Oswald', 'Black Han Sans', 'Michroma', 'Syne', 'Archivo Black', 'Russo One', 'Teko', 'Big Shoulders Display', 'Turret Road', 'Chakra Petch', 'Space Grotesk', 'Rajdhani', 'Play', 'Pirata One'];

const fl = document.createElement('link');
fl.rel = 'stylesheet';
fl.href = `https://fonts.googleapis.com/css2?${FONTS.map(f => `family=${encodeURIComponent(f)}:wght@400;700;900`).join('&')}&display=swap`;
document.head.appendChild(fl);

// ── ICON LIST: names from ToolskinIonIcons (Ionicons 7.1.0 cheatsheet registry in toolskin.js) ── 

/** Canvas export: prefer official `dist/svg` layout (matches cheatsheet); then legacy ionicons/svg paths. */
const ION_SVG_BASES = [
    'https://cdn.jsdelivr.net/npm/ionicons@7.1.0/dist/svg',
    'https://unpkg.com/ionicons@7.1.0/dist/svg',
    'https://cdn.jsdelivr.net/npm/ionicons@7.1.0/dist/ionicons/svg',
    'https://unpkg.com/ionicons@7.1.0/dist/ionicons/svg',
];

// ── GRADIENT PRESETS ── 
const GRAD_PRESETS = [{ a: '#ff540a', b: '#ffffff', ang: 135 }, { a: '#ff540a', b: '#ffcc00', ang: 45 }, { a: '#00d4ff', b: '#ffffff', ang: 135 }, { a: '#ff00ff', b: '#ff540a', ang: 120 }, { a: '#00ff99', b: '#00d4ff', ang: 90 }, { a: '#ffffff', b: '#888888', ang: 135 }, { a: '#ffd700', b: '#ff540a', ang: 135 }, { a: '#ff540a', b: '#cc0000', ang: 135 },];

// ── STATE ── 
const DEFAULTS = {
    title: "TOOLSKIN", titleSize: 145, titleFont: "Space Grotesk", titleWeight: "900", titleColor: "#ffffff", titleGradient: false, gradA: "#ffffff", gradB: "#ffffff", gradAngle: 250, titleWrap: false, tagline: "FRAMEWORK FOR CREATORS", taglineSize: 21, taglineColorOverride: "", taglineBorder: true, taglineOrder: 0, version: "v1.2.2", badgeSize: 19, accent: "#ff540a", bg1: "#171717", bg2: "#000000", bg3: "#333333", bgMode: "radial", bgStrength: 100, bgSmoothness: 60, bgGradPos: "50% 50%", bgAngle: 351, bgImage: "", overlayOpacity: 50, overlayColor: "#000000", backdropBlur: 0, noise: true, noiseOpacity: 100, noiseScale: 400, noiseFreq: 29, noiseBlend: "soft-light", glow: false, glowStrength: 19, glowLayerOpacity: 100, glowDiameterPx: 1200, glowPos: "top-right", glowScale: 1, glowBlend: "screen", bannerW: 1200, bannerH: 900, icon: "code-slash", iconOutline: false, iconSharp: false, iconSize: 60, iconX: 0, iconY: 0, iconColorOverride: "", alignH: "center", alignV: "center", padH: 100, padV: 80, padWirePreview: false, showBadge: true, showTagline: true, badgeStyle: "outline", badgeRadius: 0, badgeOpacity: 100, badgeColor: "#ffffff", exportFmt: "png", exportScale: 2, jpegQuality: 92, titleMaxW: 1000
};

const S = { ...DEFAULTS };

function getIonBases() {
    if (typeof ToolskinIonIcons !== 'undefined' && ToolskinIonIcons.listBases().length) return ToolskinIonIcons.listBases();
    return ['code-slash'];
}
function ionOptsFromState() {
    return { outline: !!S.iconOutline, sharp: !!S.iconSharp };
}
function resolveIonIconNameForState(base) {
    if (typeof ToolskinIonIcons === 'undefined') {
        if (S.iconSharp) return `${base}-sharp`;
        return S.iconOutline ? `${base}-outline` : base;
    }
    return ToolskinIonIcons.resolveIonIconName(base, ionOptsFromState());
}
function sanitizeIconVariants() {
    if (typeof ToolskinIonIcons === 'undefined') return;
    if (S.iconSharp && S.iconOutline) S.iconOutline = false;
    if (S.icon) {
        if (S.iconOutline && !ToolskinIonIcons.hasOutline(S.icon)) S.iconOutline = false;
        if (S.iconSharp && !ToolskinIonIcons.hasSharp(S.icon)) S.iconSharp = false;
    }
}
function syncIconVariantUi() {
    const oIn = $('ts-input-icon-outline');
    const oSh = $('ts-input-icon-sharp');
    sanitizeIconVariants();
    if (!oIn) return;
    if (typeof ToolskinIonIcons !== 'undefined' && S.icon) {
        oIn.disabled = !ToolskinIonIcons.hasOutline(S.icon);
        if (oSh) oSh.disabled = !ToolskinIonIcons.hasSharp(S.icon);
    } else {
        oIn.disabled = false;
        if (oSh) oSh.disabled = false;
    }
    if (oIn.disabled && S.iconOutline) {
        S.iconOutline = false;
        oIn.checked = false;
    }
    if (oSh && oSh.disabled && S.iconSharp) {
        S.iconSharp = false;
        oSh.checked = false;
    }
}
function ensureIconSharpToggle() {
    if ($('ts-input-icon-sharp')) return;
    const outlineIn = $('ts-input-icon-outline');
    if (!outlineIn) return;
    const cardRow = outlineIn.closest('.ts-card-row');
    if (!cardRow) return;
    cardRow.setAttribute('data-ts-icon-sharp-row', '1');
    const col = document.createElement('div');
    col.className = 'ts-card-col-auto';
    col.innerHTML = '<div class="ts-toggle-row"><span class="ts-toggle-label">Sharp style</span><label class="ts-toggle"><input type="checkbox" id="ts-input-icon-sharp"><span class="ts-toggle__knob"></span></label></div>';
    cardRow.appendChild(col);
}
function isIconVariantBlocked(name) {
    if (!name || typeof ToolskinIonIcons === 'undefined') return false;
    if (S.iconOutline && !ToolskinIonIcons.hasOutline(name)) return true;
    if (S.iconSharp && !ToolskinIonIcons.hasSharp(name)) return true;
    return false;
}

// ── DOM ── 
const $ = id => document.getElementById(id);

const $$ = s => document.querySelectorAll(s);

let banner, pTitle, pTagline, pVersion, pIcon, pIconWrap;

function bindDomRefs() {
    banner = $('ts-banner-wrap');
    pTitle = $('ts-preview-title');
    pTagline = $('ts-preview-tagline');
    pVersion = $('ts-preview-version');
    pIcon = $('ts-preview-icon');
    pIconWrap = $('ts-preview-icon-wrap');
}

// ── UTILITIES ── 
function hex2rgb(hex) {
    try {

        const h = hex.replace('#', '');

        if (h.length < 6) return [0, 0, 0];
        return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];

    }
    catch (e) {
        return [0, 0, 0];

    }
}
function darken(hex, pct) {

    const [r, g, b] = hex2rgb(hex);

    const f = 1 - pct / 100;
    return `rgb(${Math.max(0, Math.floor(r * f))},${Math.max(0, Math.floor(g * f))},${Math.max(0, Math.floor(b * f))})`;

}
function hexValid(h) {
    return /^#[0-9a-fA-F]{6}$/.test(h);

}
// ── NOISE SVG URL ──
// Correct grainy-gradient technique: noise tile only — no contrast/brightness filter needed.
// Mix-blend-mode is applied on the div itself (not filter on parent).
// For export we bake the noise into canvas directly. 
function noiseDataUrl(size, freq) {

    const f = (freq / 100).toFixed(2);

    const svg = [`<svg xmlns='http://www.w3.org/2000/svg' width='${size}' height='${size}'>`, `<filter id='n'><feTurbulence type='fractalNoise' baseFrequency='${f}' numOctaves='4' stitchTiles='stitch'/>`, `<feColorMatrix type='saturate' values='0'/></filter>`, `<rect width='${size}' height='${size}' filter='url(%23n)'/></svg>`].join('');
    return `url("data:image/svg+xml,${svg.replace(/'/g, '%27')}")`;

}
// ── BUILD BACKGROUND CSS ── 
function buildBgCSS() {

    const { bg1, bg2, bgMode, bgStrength, bgGradPos, bgAngle, bgImage, overlayOpacity, overlayColor, accent } = S;

    const dark = darken(bg2, bgStrength * 0.65);

    if (bgMode === 'image' && bgImage) {

        const [r, g, b] = hex2rgb(overlayColor);

        const ov = `rgba(${r},${g},${b},${overlayOpacity / 100})`;
        return {
            bg: `linear-gradient(${ov},${ov}),url(${bgImage}) center/cover no-repeat`, bgColor: bg1
        };

    }
    let grad = '';
    switch (bgMode) {
        case 'radial': grad = `radial-gradient(ellipse at ${bgGradPos},${bg1} 0%,${dark} 100%)`;
            break;
        case 'linear': grad = `linear-gradient(${bgAngle}deg,${bg1} 0%,${dark} 100%)`;
            break;
        case 'solid':
            grad = 'none';
            break;
        case 'mesh': {
            const a1 = darken(accent, 45), a2 = darken(accent, 55);
            const c3 = S.bg3 || darken(bg1, 10);
            const sm = S.bgSmoothness || 60;
            grad = [`radial-gradient(ellipse 65% 55% at 15% 85%,${a1} 0%,transparent ${sm}%)`, `radial-gradient(ellipse 60% 70% at 85% 15%,${a2} 0%,transparent ${sm}%)`, `radial-gradient(ellipse 50% 50% at 50% 50%,${c3} 0%,transparent ${sm + 10}%)`, `radial-gradient(ellipse at ${bgGradPos},${bg1} 0%,${dark} 100%)`].join(',');
            break;
        }
        default: grad = `radial-gradient(ellipse at ${bgGradPos},${bg1} 0%,${dark} 100%)`;
    }
    return {
        bg: grad, bgColor: bg1
    };

}
// Glow DOM placement: match drawGlow() (gradient center = ±rad*0.35 from edges). Use translate(-50%,-50%) only for true center — avoids compounding with #ts-banner-wrap scale() and huge element width.
function styleBannerGlowEl(el, posKey, diameterPx, accent, fadePct, layerOpacity) {
    const fade = Math.max(20, Math.min(92, 100 - fadePct * 0.65));
    const bg = `radial-gradient(circle,${accent} 0%,transparent ${fade}%)`;
    const d = Math.max(1, diameterPx);
    const W = S.bannerW;
    const H = S.bannerH;
    const bleed = 0.675 * d;
    const inset = 0.325 * d;
    const base = {
        position: 'absolute',
        pointerEvents: 'none',
        zIndex: '0',
        borderRadius: '50%',
        width: `${d}px`,
        height: `${d}px`,
        opacity: String(layerOpacity / 100),
        background: bg,
        inset: '',
        transform: 'none',
        top: 'auto',
        right: 'auto',
        bottom: 'auto',
        left: 'auto',
    };
    const key = posKey || 'top-right';
    if (key === 'center') {
        Object.assign(el.style, base, {
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
        });
        return;
    }
    const topY = (H - d) / 2;
    const leftX = (W - d) / 2;
    const layouts = {
        'top-left': { left: `${-bleed}px`, top: `${-bleed}px` },
        'top-center': { left: `${leftX}px`, top: `${-bleed}px` },
        'top-right': { left: `${W - inset}px`, top: `${-bleed}px` },
        'center-left': { left: `${-bleed}px`, top: `${topY}px` },
        'center-right': { left: `${W - inset}px`, top: `${topY}px` },
        'bottom-left': { left: `${-bleed}px`, top: `${H - inset}px` },
        'bottom-center': { left: `${leftX}px`, top: `${H - inset}px` },
        'bottom-right': { left: `${W - inset}px`, top: `${H - inset}px` },
    };
    Object.assign(el.style, base, layouts[key] || layouts['top-right']);
}

/** Match canvas drawIcon(): ix = titleRight - iconX - size; iy = contentY + iconY - size → top offset from .ts-main-title = iconY - size. */
function syncIconPreviewPosition() {
    if (!pIconWrap || !pTitle || !S.icon) return;
    const titleW = pTitle.offsetWidth;
    const left = titleW - S.iconX - S.iconSize;
    const top = S.iconY - S.iconSize;
    pIconWrap.style.left = `${left}px`;
    pIconWrap.style.top = `${top}px`;
    pIconWrap.style.right = 'auto';
    pIconWrap.style.margin = '0';
    document.documentElement.style.setProperty('--ts-icon-right', '0px');
    document.documentElement.style.setProperty('--ts-icon-top', '0px');
}

// ── APPLY STATE TO PREVIEW ── 
function apply() {

    const root = document.documentElement;
    sanitizeIconVariants();
    syncIconVariantUi();

    // Title
    pTitle.innerText = S.title;
    pTitle.style.fontSize = S.titleSize + 'px';
    pTitle.style.fontFamily = `'${S.titleFont}',sans-serif`;
    pTitle.style.fontWeight = S.titleWeight;
    pTitle.style.whiteSpace = S.titleWrap ? 'normal' : 'nowrap';
    pTitle.style.wordBreak = S.titleWrap ? 'break-word' : 'normal';
    pTitle.style.overflowWrap = S.titleWrap ? 'break-word' : 'normal';
    pTitle.style.maxWidth = S.titleWrap ? '100%' : (S.titleMaxW ? '100%' : 'none');

    if (S.titleGradient) {

        const g = `linear-gradient(${S.gradAngle}deg,${S.gradA},${S.gradB})`;
        pTitle.style.background = g;
        pTitle.style.webkitBackgroundClip = 'text';
        pTitle.style.backgroundClip = 'text';
        pTitle.style.webkitTextFillColor = 'transparent';
        pTitle.style.color = 'transparent';

    }
    else {
        pTitle.style.background = 'none';
        pTitle.style.webkitBackgroundClip = '';
        pTitle.style.backgroundClip = '';
        pTitle.style.webkitTextFillColor = '';
        pTitle.style.color = S.titleColor;

    }
    // Tagline   
    const tagColor = (S.taglineColorOverride && hexValid(S.taglineColorOverride)) ? S.taglineColorOverride : S.accent;
    pTagline.innerText = S.tagline;
    pTagline.style.fontSize = S.taglineSize + 'px';
    pTagline.style.color = tagColor;
    pTagline.style.borderLeftColor = tagColor;
    pTagline.classList.toggle('no-border', !S.taglineBorder);
    pTagline.style.display = S.showTagline ? '' : 'none';
    pTagline.style.order = '';
    pVersion.style.order = '';
    const tagRow = $('ts-preview-tagline-row');
    if (tagRow) tagRow.style.flexDirection = S.taglineOrder === 0 ? 'row' : 'row-reverse';

    // Badge — :root tokens + inline on preview node so live preview always matches export (WYSIWYG)
    root.style.setProperty('--ts-badge-radius', S.badgeRadius + 'px');
    root.style.setProperty('--ts-badge-opacity', (S.badgeOpacity / 100).toFixed(2));
    pVersion.innerText = S.version;
    pVersion.style.fontSize = S.badgeSize + 'px';
    pVersion.style.display = S.showBadge ? '' : 'none';
    pVersion.style.borderRadius = `${S.badgeRadius}px`;
    pVersion.style.opacity = String(S.badgeOpacity / 100);

    const ba = S.accent, bd = darken(ba, 30);

    const [br, bg_, bb] = hex2rgb(ba);
    switch (S.badgeStyle) {

        case 'gradient': pVersion.style.background = `linear-gradient(-16deg,${ba},${bd},${ba})`;
            pVersion.style.border = '1px solid rgba(255,255,255,0.15)';
            pVersion.style.color = S.badgeColor;
            break;

        case 'flat': pVersion.style.background = ba;
            pVersion.style.border = `1px solid ${bd}`;
            pVersion.style.color = S.badgeColor;
            break;

        case 'outline': pVersion.style.background = 'transparent';
            pVersion.style.border = `2px solid ${ba}`;
            pVersion.style.color = ba;
            break;

        case 'ghost': pVersion.style.background = `rgba(${br},${bg_},${bb},0.12)`;
            pVersion.style.border = `1px solid rgba(${br},${bg_},${bb},0.35)`;
            pVersion.style.color = ba;
            break;

    }
    // Alignment
    banner.style.justifyContent = S.alignV;
    banner.style.alignItems = S.alignH;
    banner.style.padding = `${S.padV}px ${S.padH}px`;

    // Icon   
    const iconColor = (S.iconColorOverride && hexValid(S.iconColorOverride)) ? S.iconColorOverride : S.accent;
    if (S.icon) {
        const nm = resolveIonIconNameForState(S.icon);
        if (nm) pIcon.setAttribute('name', nm);
        else pIcon.removeAttribute('name');
    }
    else pIcon.removeAttribute('name');
    pIconWrap.style.display = S.icon ? 'block' : 'none';
    root.style.setProperty('--ts-icon-size', S.iconSize + 'px');
    pIconWrap.style.color = iconColor;
    if (pIcon) {
        pIcon.style.width = S.iconSize + 'px';
        pIcon.style.height = S.iconSize + 'px';
    }
    requestAnimationFrame(() => syncIconPreviewPosition());

    // Tokens used by banner preview CSS
    root.style.setProperty('--ts-accent', S.accent);
    root.style.setProperty('--ts-title-color', S.titleColor);

    // Background   
    const {
        bg, bgColor
    } = buildBgCSS();
    banner.style.background = bg;
    banner.style.backgroundColor = bgColor;

    // Image backdrop blur   
    if (S.bgMode === 'image') {

        // Applied on a child div     
        const blurDiv = $('ts-banner-backdrop-blur');

        if (blurDiv) blurDiv.style.backdropFilter = S.backdropBlur > 0 ? `blur(${S.backdropBlur}px)` : '';

    }
    // Noise — use mix-blend-mode directly for correct visual blending   
    const noiseEl = $('ts-banner-noise');

    if (noiseEl) {

        if (S.noise) {
            noiseEl.style.display = '';
            noiseEl.style.opacity = (S.noiseOpacity / 100).toFixed(2);
            noiseEl.style.backgroundImage = noiseDataUrl(S.noiseScale, S.noiseFreq);
            noiseEl.style.backgroundSize = `${S.noiseScale}px ${S.noiseScale}px`;
            noiseEl.style.mixBlendMode = S.noiseBlend;

        }
        else {
            noiseEl.style.display = 'none';

        }
    }
    // Glow
    const glowEl = $('ts-banner-glow');
    if (glowEl) {
        if (S.glow) {
            styleBannerGlowEl(glowEl, S.glowPos, S.glowDiameterPx || 1200, S.accent, S.glowStrength, S.glowLayerOpacity != null ? S.glowLayerOpacity : 100);
        } else {
            glowEl.style.opacity = '0';
        }
    }
    root.style.setProperty('--ts-banner-glow-size', (S.glowDiameterPx || 1200) + 'px');
    root.style.setProperty('--ts-banner-glow-opacity', ((S.glowLayerOpacity != null ? S.glowLayerOpacity : 100) / 100).toFixed(3));
    const padWireEl = $('ts-banner-pad-wire');
    if (padWireEl) {
        if (S.padWirePreview) {
            padWireEl.style.display = 'block';
            padWireEl.style.top = `${S.padV}px`;
            padWireEl.style.left = `${S.padH}px`;
            padWireEl.style.right = `${S.padH}px`;
            padWireEl.style.bottom = `${S.padV}px`;
        }
        else {
            padWireEl.style.display = 'none';
        }
    }
    syncIconDropdownMetadata();
    // Size (label only; banner dimensions set in rescale)
    $('ts-banner-size-label').textContent = `${S.bannerW} × ${S.bannerH} px`;

    // Update custom w/h inputs
    $('ts-input-custom-w').value = S.bannerW;
    $('ts-input-custom-h').value = S.bannerH;
    rescale();

}
// ── RESCALE PREVIEW ── 
function rescale() {

    if (!banner) return;
    const ca = $('ts-canvas-area');
    if (!ca) return;

    const cw = ca.clientWidth - 60, ch = ca.clientHeight - 60;

    const sc = Math.min(cw / S.bannerW, ch / S.bannerH, 1);
    banner.style.transform = `scale(${sc})`;
    banner.style.transformOrigin = 'top left';
    banner.style.width = S.bannerW + 'px';
    banner.style.height = S.bannerH + 'px';

    const sw = $('ts-banner-scale-wrap');
    if (!sw) return;
    sw.style.width = Math.round(S.bannerW * sc) + 'px';
    sw.style.height = Math.round(S.bannerH * sc) + 'px';
    const zl = $('ts-zoom-label');
    if (zl) zl.textContent = Math.round(sc * 100) + '%';
    requestAnimationFrame(() => syncIconPreviewPosition());

}
window.addEventListener('resize', rescale);

// ── INJECT BANNER LAYER DIVS ── 
function injectLayers() {

    if (!banner) return;
    if ($('ts-banner-noise')) return;

    // Glow (z:0)   
    const gd = document.createElement('div');
    gd.id = 'ts-banner-glow';
    gd.style.cssText = 'position:absolute;pointer-events:none;z-index:0;opacity:0;border-radius:50%';
    banner.appendChild(gd);

    // Noise (z:1) — proper grainy-gradient, mix-blend-mode applied here   
    const nd = document.createElement('div');
    nd.id = 'ts-banner-noise';
    nd.style.cssText = 'position:absolute;inset:0;pointer-events:none;z-index:1;background-repeat:repeat';
    banner.appendChild(nd);

    // Backdrop blur div for image mode (z:0)   
    const bd = document.createElement('div');
    bd.id = 'ts-banner-backdrop-blur';
    bd.style.cssText = 'position:absolute;inset:0;pointer-events:none;z-index:0';
    banner.appendChild(bd);

    const pw = document.createElement('div');
    pw.id = 'ts-banner-pad-wire';
    pw.setAttribute('aria-hidden', 'true');
    pw.style.cssText = 'position:absolute;pointer-events:none;z-index:5;box-sizing:border-box;border:1px dashed rgba(255,85,0,0.45);display:none';
    banner.appendChild(pw);

}
/* ══════════════════════════════════════════════════════    PURE CANVAS 2D RENDER ENGINE    This replaces html2canvas entirely.    Every element is drawn manually — guarantees WYSIWYG. ══════════════════════════════════════════════════════ */
async function renderToCanvas() {

    const W = S.bannerW * S.exportScale;

    const H = S.bannerH * S.exportScale;

    const sc = S.exportScale;

    const cv = document.createElement('canvas');
    cv.width = W;
    cv.height = H;

    const ctx = cv.getContext('2d');

    // 1 ── BACKGROUND   
    await drawBackground(ctx, W, H, sc);

    // 2 ── GLOW   
    if (S.glow) drawGlow(ctx, W, H, sc);

    // 3 ── NOISE (grainy gradient technique — baked into canvas)   
    if (S.noise) await drawNoise(ctx, W, H, sc);

    // 4 ── DRAW CONTENT (Title, Tagline, Badge, Icon)
    await drawContent(ctx, W, H, sc);
    return cv;

}
// ── DRAW: BACKGROUND ── 
async function drawBackground(ctx, W, H, sc) {

    const { bg1, bg2, bgMode, bgStrength, bgGradPos, bgAngle, bgImage, overlayOpacity, overlayColor, accent } = S;


    if (bgMode === 'image' && bgImage) {

        const img = await loadImage(bgImage);

        // Cover     
        const ar = img.width / img.height;

        let sw = W, sh = H, sx = 0, sy = 0;

        if (ar > W / H) {
            sh = H;
            sw = H * ar;
            sx = (W - sw) / 2;

        }
        else {
            sw = W;
            sh = W / ar;
            sy = (H - sh) / 2;

        }
        if (S.backdropBlur > 0) {
            ctx.save();
            ctx.filter = `blur(${S.backdropBlur * sc}px)`;
            ctx.drawImage(img, sx, sy, sw, sh);
            ctx.restore();
        } else {
            ctx.drawImage(img, sx, sy, sw, sh);
        }

        // Overlay
        const [r, g, b] = hex2rgb(overlayColor);
        ctx.fillStyle = `rgba(${r},${g},${b},${overlayOpacity / 100})`;
        ctx.fillRect(0, 0, W, H);
        return;

    }
    // Solid base
    ctx.fillStyle = bg1;
    ctx.fillRect(0, 0, W, H);

    // Gradient overlay   
    if (bgMode !== 'solid') {

        const [px, py] = parsePct(bgGradPos, W, H);

        let grad;

        if (bgMode === 'linear') {
            const [gx1, gy1, gx2, gy2] = angleToPoints(bgAngle * Math.PI / 180, W, H);
            grad = ctx.createLinearGradient(gx1, gy1, gx2, gy2);
            const dark = darken(bg2, bgStrength * 0.65);
            grad.addColorStop(0, bg1);
            grad.addColorStop(1, dark);

        }
        else {
            const radius = Math.sqrt(W * W + H * H) * 0.8;
            grad = ctx.createRadialGradient(px, py, 0, px, py, radius);
            const dark = darken(bg2, bgStrength * 0.65);
            grad.addColorStop(0, bg1);
            grad.addColorStop(1, dark);

        }
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, W, H);

        if (bgMode === 'mesh') {
            const dark = darken(bg2, bgStrength * 0.65);
            const c3 = S.bg3 || darken(bg1, 10);
            const sm = (S.bgSmoothness || 60) / 100;
            // Drawing blobs in source-over (Normal) to match CSS stacked gradients
            drawBlob(ctx, W * 0.15, H * 0.85, W * 0.65, H * 0.55, darken(accent, 45), sm);
            drawBlob(ctx, W * 0.85, H * 0.15, W * 0.6, H * 0.7, darken(accent, 55), sm);
            // 3rd mesh color (central/intermediate)
            drawBlob(ctx, W * 0.5, H * 0.5, W * 0.5, H * 0.5, c3, sm * 0.7);
        }
    }
}
function drawBlob(ctx, cx, cy, rw, rh, color, alpha) {
    // Ensure we have a clean rgba string regardless of input (hex or rgb)
    let r, g, b;
    if (color.startsWith('#')) {
        [r, g, b] = hex2rgb(color);
    } else if (color.startsWith('rgb')) {
        const match = color.match(/\d+/g);
        if (match) [r, g, b] = match.map(Number);
        else[r, g, b] = [0, 0, 0];
    } else {
        [r, g, b] = [0, 0, 0];
    }

    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(rw, rh));
    grad.addColorStop(0, `rgba(${r},${g},${b},${alpha})`);
    grad.addColorStop(1, `rgba(${r},${g},${b},0)`);

    ctx.save();
    ctx.fillStyle = grad;
    // Important: translate/scale for elliptical blobs if needed, 
    // but for now we stay simple to avoid context mess
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.restore();
}
// ── DRAW: GLOW ──
function drawGlow(ctx, W, H, sc) {
    const { accent, glowStrength, glowPos, glowBlend, glowDiameterPx, glowLayerOpacity } = S;
    const diam = (glowDiameterPx || 1200) * sc;
    const rad = diam / 2;
    const fadeOuter = Math.max(0.2, Math.min(0.92, 1 - glowStrength / 130));
    const layerOp = (glowLayerOpacity != null ? glowLayerOpacity : 100) / 100;
    let cx = W / 2, cy = H / 2;
    if (glowPos === 'center') {
        cx = W / 2;
        cy = H / 2;
    } else if (glowPos === 'top-left') {
        cx = -rad * 0.35;
        cy = -rad * 0.35;
    } else if (glowPos === 'top-center') {
        cx = W / 2;
        cy = -rad * 0.35;
    } else if (glowPos === 'top-right') {
        cx = W + rad * 0.35;
        cy = -rad * 0.35;
    } else if (glowPos === 'center-left') {
        cx = -rad * 0.35;
        cy = H / 2;
    } else if (glowPos === 'center-right') {
        cx = W + rad * 0.35;
        cy = H / 2;
    } else if (glowPos === 'bottom-left') {
        cx = -rad * 0.35;
        cy = H + rad * 0.35;
    } else if (glowPos === 'bottom-center') {
        cx = W / 2;
        cy = H + rad * 0.35;
    } else if (glowPos === 'bottom-right') {
        cx = W + rad * 0.35;
        cy = H + rad * 0.35;
    }
    const [r, g, b] = hex2rgb(accent);
    const g_ = Math.min(255, g + 20);
    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, rad);
    grad.addColorStop(0, `rgba(${r},${g_},${b},${layerOp})`);
    grad.addColorStop(fadeOuter, `rgba(${r},${g},${b},${layerOp * 0.35})`);
    grad.addColorStop(1, `rgba(${r},${g},${b},0)`);

    ctx.save();
    ctx.globalCompositeOperation = blendModeToComposite(glowBlend || 'screen');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);
    ctx.restore();
}
// ── DRAW: NOISE (grainy gradient baked into canvas) ── 
async function drawNoise(ctx, W, H, sc) {

    // Create an offscreen canvas with SVG noise rendered into it, then draw with blend mode   
    const size = S.noiseScale * sc;

    const freq = (S.noiseFreq / 100).toFixed(2);

    const noiseCv = document.createElement('canvas');
    noiseCv.width = size;
    noiseCv.height = size;

    const nCtx = noiseCv.getContext('2d');

    // Draw SVG noise tile into offscreen canvas   
    const svgStr = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="${freq}" numOctaves="4" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter><rect width="${size}" height="${size}" filter="url(#n)"/></svg>`;

    const svgBlob = new Blob([svgStr], { type: 'image/svg+xml' });

    const svgUrl = URL.createObjectURL(svgBlob);
    try {

        const noiseImg = await loadImage(svgUrl);
        URL.revokeObjectURL(svgUrl);

        // Save context, apply blend mode, tile noise
        ctx.save();
        try {
            ctx.globalCompositeOperation = blendModeToComposite(S.noiseBlend);
            ctx.globalAlpha = S.noiseOpacity / 100;

            // Tile     
            const pat = ctx.createPattern(noiseImg, 'repeat');

            if (pat) {
                ctx.fillStyle = pat;
                ctx.fillRect(0, 0, W, H);
            }
        } finally {
            ctx.restore();
        }
    }
    catch (e) {
        URL.revokeObjectURL(svgUrl);
        console.warn('Noise render failed:', e);

    }
}
function blendModeToComposite(blend) {

    // CSS mix-blend-mode → canvas globalCompositeOperation   
    const map = {
        'soft-light': 'soft-light',
        'overlay': 'overlay',
        'screen': 'screen',
        'multiply': 'multiply',
        'difference': 'difference',
        'exclusion': 'exclusion',
        'color-dodge': 'color-dodge',
        'color-burn': 'color-burn',
        'hard-light': 'hard-light',
        'hue': 'hue',
        'saturation': 'saturation',
        'color': 'color',
        'luminosity': 'luminosity',
        'lighten': 'lighten',
        'darken': 'darken',
        'normal': 'source-over'
    };
    return map[blend] || 'source-over';

}
/** Word-wrap then break oversized tokens by character (matches DOM break-word). */
function measureTitleLines(ctx, titleText, maxW, titleWrap) {

    if (!titleWrap) {

        const w = ctx.measureText(titleText).width;
        return { lines: [titleText], maxLineW: w, titleBlockH: null };

    }
    const words = titleText.split(/\s+/).filter(Boolean);
    let rawLines = [];
    let line = '';
    for (const word of words) {

        const test = line ? line + ' ' + word : word;

        if (ctx.measureText(test).width <= maxW) line = test;
        else {

            if (line) rawLines.push(line);
            line = word;

        }

    }
    if (line) rawLines.push(line);
    if (rawLines.length === 0) rawLines = [titleText];
    const lines = [];

    for (const ln of rawLines) {

        if (ctx.measureText(ln).width <= maxW) lines.push(ln);
        else {

            let chunk = '';
            for (let i = 0; i < ln.length; i++) {

                const c = ln[i];
                const t = chunk + c;

                if (ctx.measureText(t).width <= maxW) chunk = t;
                else {

                    if (chunk) lines.push(chunk);
                    chunk = c;

                }

            }
            if (chunk) lines.push(chunk);

        }

    }
    if (lines.length === 0) lines.push(titleText);
    const maxLineW = Math.max(...lines.map(l => ctx.measureText(l).width), 0);
    return { lines, maxLineW, titleBlockH: null };

}
function titleBlockHeight(fontSize, lineCount) {

    const gap = fontSize * 0.92;
    return lineCount <= 1 ? fontSize : fontSize + (lineCount - 1) * gap;

}
// ── DRAW: CONTENT ── 
async function drawContent(ctx, W, H, sc) {

    const { padH, padV, alignH, alignV, titleSize, titleFont, titleWeight, title, titleGradient, gradA, gradB, gradAngle, titleColor, titleWrap, tagline, taglineSize, taglineColorOverride, accent, taglineBorder, showTagline, version, badgeStyle, badgeRadius, badgeOpacity, badgeColor, badgeSize, showBadge, taglineOrder } = S;

    const pH = padH * sc, pV = padV * sc;

    const fontSize = titleSize * sc;

    const font = `${titleWeight} ${fontSize}px '${titleFont}',sans-serif`;
    ctx.font = font;

    const titleText = title.toUpperCase();

    const maxContentW = W - pH * 2;
    const { lines, maxLineW } = measureTitleLines(ctx, titleText, maxContentW, titleWrap);
    const titleWidth = titleWrap ? maxLineW : ctx.measureText(titleText).width;

    const tagFontSize = taglineSize * sc;

    const badgeFontSize = badgeSize * sc;

    const lineGap = fontSize * 0.92;
    const titleBlockH = titleBlockHeight(fontSize, lines.length);

    const taglineH = tagFontSize * 2.2;

    const contentH = titleBlockH + (showTagline || showBadge ? taglineH + 22 * sc : 0);

    // Vertical position   
    let contentY = pV;

    if (alignV === 'center') contentY = (H - contentH) / 2;

    else
        if (alignV === 'flex-end') contentY = H - contentH - pV;

    // ── PRE-CALCULATE TAGLINE ROW ──
    const elements = [];
    let totalRowW = 0;

    if (showTagline || showBadge) {
        if (showTagline) {
            ctx.save();
            ctx.font = `600 ${tagFontSize}px '${titleFont}',sans-serif`;
            const tagW = ctx.measureText(tagline.toUpperCase()).width + (taglineBorder ? 14 * sc * 2 : 0);
            elements.push({ type: 'tagline', w: tagW + (taglineBorder ? 3 * sc : 0) });
            ctx.restore();
        }
        if (showBadge) {
            ctx.save();
            ctx.font = `600 ${badgeFontSize}px '${titleFont}',sans-serif`;
            const badgeTextW = ctx.measureText(version).width;
            elements.push({ type: 'badge', w: badgeTextW + 30 * sc });
            ctx.restore();
        }
        if (taglineOrder !== 0) elements.reverse();

        elements.forEach((el, i) => {
            totalRowW += el.w;
            if (i < elements.length - 1) totalRowW += 20 * sc;
        });
    }

    // The "fit-content" width of the block
    const blockW = Math.max(titleWidth, totalRowW);

    // Horizontal position   
    let baseX = pH;
    if (alignH === 'center') baseX = (W - blockW) / 2;
    else if (alignH === 'flex-end') baseX = W - blockW - pH;

    // ── DRAW TITLE ──   
    ctx.save();
    ctx.font = font;
    ctx.textBaseline = 'top';

    if (titleGradient) {

        const rad = gradAngle * Math.PI / 180;

        const cx = baseX + titleWidth / 2, cy = contentY + titleBlockH / 2;

        const dx = Math.sin(rad) * titleWidth / 2;
        const dy = -Math.cos(rad) * titleBlockH / 2;

        const g = ctx.createLinearGradient(cx - dx, cy - dy, cx + dx, cy + dy);
        g.addColorStop(0, gradA);
        g.addColorStop(1, gradB);
        ctx.fillStyle = g;

    }
    else {
        ctx.fillStyle = titleColor;

    }
    let yTitle = contentY;
    for (let li = 0; li < lines.length; li++) {

        ctx.fillText(lines[li], baseX, yTitle);
        yTitle += li < lines.length - 1 ? lineGap : 0;

    }
    ctx.restore();

    // ── DRAW TAGLINE ROW ──   
    const rowY = contentY + titleBlockH + 22 * sc;
    if (showTagline || showBadge) {

        const tagColor = (taglineColorOverride && hexValid(taglineColorOverride)) ? taglineColorOverride : accent;

        if (elements.length === 2) {
            const e0 = elements[0], e1 = elements[1];
            const x0 = baseX;
            const x1 = baseX + blockW - e1.w;
            if (e0.type === 'tagline') {
                drawTagline(ctx, x0, rowY, e0.w, tagFontSize, tagline, tagColor, taglineBorder, sc);
            }
            else {
                drawBadge(ctx, x0, rowY, e0.w, badgeFontSize, version, badgeStyle, badgeRadius * sc, badgeOpacity / 100, badgeColor, accent, sc);
            }
            if (e1.type === 'tagline') {
                drawTagline(ctx, x1, rowY, e1.w, tagFontSize, tagline, tagColor, taglineBorder, sc);
            }
            else {
                drawBadge(ctx, x1, rowY, e1.w, badgeFontSize, version, badgeStyle, badgeRadius * sc, badgeOpacity / 100, badgeColor, accent, sc);
            }
        }
        else if (elements.length === 1) {
            const el = elements[0];
            if (el.type === 'tagline') {
                drawTagline(ctx, baseX, rowY, el.w, tagFontSize, tagline, tagColor, taglineBorder, sc);
            }
            else {
                drawBadge(ctx, baseX, rowY, el.w, badgeFontSize, version, badgeStyle, badgeRadius * sc, badgeOpacity / 100, badgeColor, accent, sc);
            }
        }

    }

    if (S.icon) await drawIcon(ctx, baseX, contentY, titleWidth, sc);
}
async function fetchIonSvgText(path) {
    for (const base of ION_SVG_BASES) {
        try {
            const resp = await fetch(`${base}/${path}.svg`);
            if (resp.ok) return await resp.text();
        } catch (_) { /* try next */ }
    }
    return null;
}

async function drawIcon(ctx, baseX, contentY, titleBlockW, sc) {
    const { icon, iconSize, iconX, iconY, iconColorOverride, accent } = S;
    const stem = resolveIonIconNameForState(icon);

    try {
        let svgText = stem ? await fetchIonSvgText(stem) : null;
        if (!svgText && icon) svgText = await fetchIonSvgText(icon);
        if (!svgText) {
            console.warn('Icon SVG not found:', stem || icon);
            return;
        }

        const color = (iconColorOverride && hexValid(iconColorOverride)) ? iconColorOverride : accent;
        svgText = svgText.replace('<svg', `<svg fill="${color}"`);
        svgText = svgText.replace(/stroke="[^"]*"/g, `stroke="${color}"`);

        const svgBlob = new Blob([svgText], { type: 'image/svg+xml' });
        const blobUrl = URL.createObjectURL(svgBlob);
        const img = await loadImage(blobUrl);
        URL.revokeObjectURL(blobUrl);

        const size = iconSize * sc;
        const rightEdge = baseX + titleBlockW;
        const ix = rightEdge - iconX * sc - size;
        const iy = contentY + iconY * sc - size;

        ctx.drawImage(img, ix, iy, size, size);
    } catch (e) {
        console.warn('Icon draw failed:', e);
    }
}
function drawTagline(ctx, x, y, w, fontSize, text, color, border, sc) {

    const h = fontSize * 2.2;

    const padX = 14 * sc;
    ctx.save();
    ctx.font = `600 ${fontSize}px 'Space Grotesk',sans-serif`;
    ctx.textBaseline = 'middle';
    ctx.fillStyle = color;

    if (border) {
        ctx.fillStyle = color;
        ctx.fillRect(x, y, 3 * sc, h);
        ctx.fillStyle = color;

    }
    ctx.fillStyle = color;
    ctx.fillText(text.toUpperCase(), x + (border ? 3 * sc + padX : 0), y + h / 2);
    ctx.restore();

}
function drawBadge(ctx, x, y, w, fontSize, text, style, radius, opacity, textColor, accent, sc) {

    const h = fontSize * 2.6;

    const [ar, ag, ab] = hex2rgb(accent);

    const dark = darken(accent, 30).match(/\d+/g);
    ctx.save();
    ctx.globalAlpha = opacity;

    // Background
    roundedRect(ctx, x, y, w, h, radius);
    switch (style) {

        case 'gradient': {

            const g = ctx.createLinearGradient(x, y, x + w, y);
            g.addColorStop(0, accent);
            g.addColorStop(0.5, `rgb(${dark[0]},${dark[1]},${dark[2]})`);
            g.addColorStop(1, accent);
            ctx.fillStyle = g;
            ctx.fill();
            ctx.strokeStyle = 'rgba(255,255,255,0.15)';
            ctx.lineWidth = 1;
            ctx.stroke();
            break;

        }
        case 'flat': ctx.fillStyle = accent;
            ctx.fill();
            break;

        case 'outline': ctx.strokeStyle = accent;
            ctx.lineWidth = 2 * sc;
            ctx.stroke();
            break;

        case 'ghost': ctx.fillStyle = `rgba(${ar},${ag},${ab},0.12)`;
            ctx.fill();
            ctx.strokeStyle = `rgba(${ar},${ag},${ab},0.35)`;
            ctx.lineWidth = 1;
            ctx.stroke();
            break;

    }
    // Text (same opacity as badge body)
    ctx.font = `600 ${fontSize}px 'Space Grotesk',sans-serif`;
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    ctx.fillStyle = style === 'outline' || style === 'ghost' ? accent : textColor;
    ctx.globalAlpha = opacity;
    ctx.fillText(text, x + w / 2, y + h / 2);
    ctx.restore();

}
function roundedRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();

}
// ── HELPERS ── 
function parsePct(str, W, H) {

    const parts = str.split(' ');

    const x = parseFloat(parts[0]) / 100 * W;

    const y = parseFloat(parts[1] || '50') / 100 * H;
    return [x, y];

}
function angleToPoints(rad, W, H) {

    const cx = W / 2, cy = H / 2;
    const len = Math.sqrt(W * W + H * H) / 2;
    // CSS linear-gradient(A deg) vector: dx = sin(A), dy = -cos(A)
    const dx = Math.sin(rad), dy = -Math.cos(rad);
    return [cx - dx * len, cy - dy * len, cx + dx * len, cy + dy * len];

}
function loadImage(src) {
    return new Promise((res, rej) => {

        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => res(img);
        img.onerror = rej;
        img.src = src;

    });

}
// ── PREVIEW & EXPORT MODAL ── 
let lastDataUrl = '';

async function doPreview() {

    const sp = $('ts-export-spinner');
    sp.style.display = 'inline-block';
    try {

        // Ensure fonts are loaded before render     
        await document.fonts.ready;

        const cv = await renderToCanvas();

        const fmt = S.exportFmt === 'jpeg' ? 'image/jpeg' : 'image/png';

        const quality = S.exportFmt === 'jpeg' ? S.jpegQuality / 100 : undefined;
        lastDataUrl = cv.toDataURL(fmt, quality);
        $('ts-modal-preview-img').src = lastDataUrl;
        $('ts-modal-title').textContent = `Preview — ${S.bannerW} × ${S.bannerH} @ ${S.exportScale}×`;
        $('ts-modal-sub').textContent = `Canvas 2D render · ${S.exportFmt.toUpperCase()} · ${S.bannerW * S.exportScale} × ${S.bannerH * S.exportScale}px`;
        $('ts-export-modal').classList.add('open');

    }
    catch (e) {
        console.error(e);
        showToast('Render error — check console');

    }
    sp.style.display = 'none';

}
function doDownload() {

    if (!lastDataUrl) return;

    const ext = S.exportFmt === 'jpeg' ? 'jpg' : 'png';

    const a = document.createElement('a');
    a.download = `banner-${S.title.toLowerCase().replace(/\s+/g, '_')}-${S.bannerW}x${S.bannerH}.${ext}`;
    a.href = lastDataUrl;
    a.click();
    showToast('Downloaded!');

}

// ── ICON DROPDOWN ── 
let iconSearch = '', iconDropOpen = false;

function syncIconDropdownMetadata() {
    const list = $('ts-icon-dd-list');
    if (list) list.setAttribute('data-ts-selected-icon', S.icon ? S.icon : 'none');
}

function openIconDropdown() {
    const list = $('ts-icon-dd-list');
    if (!list) return;
    buildIconList(iconSearch);
    list.classList.add('open');
    iconDropOpen = true;
    positionIconDropdown();
}

function positionIconDropdown() {

    const wrap = document.querySelector('.ts-icon-dd-wrap');
    const list = $('ts-icon-dd-list');
    if (!wrap || !list || !list.classList.contains('open')) return;
    const r = wrap.getBoundingClientRect();
    const margin = 8;
    const maxH = Math.min(window.innerHeight * 0.5, 360);
    list.style.left = Math.max(margin, Math.min(r.left, window.innerWidth - margin - r.width)) + 'px';
    list.style.top = (r.bottom + 4) + 'px';
    list.style.width = Math.min(r.width, window.innerWidth - margin * 2) + 'px';
    list.style.maxHeight = Math.min(maxH, window.innerHeight - r.bottom - margin * 2) + 'px';

}

function buildIconList(filter = '') {

    const list = $('ts-icon-dd-list');
    if (!list) return;
    list.innerHTML = '';

    const none = document.createElement('div');
    none.className = 'ts-icon-option ts-icon-option--none';
    none.innerHTML = '<span>— None —</span>';
    none.addEventListener('mousedown', e => {
        e.preventDefault();
        selectIcon('');

    });
    list.appendChild(none);

    const bases = getIonBases();
    const filtered = filter ? bases.filter(i => i.includes(filter.toLowerCase())) : bases;
    filtered.forEach(name => {

        const el = document.createElement('div');
        const blocked = isIconVariantBlocked(name);
        el.className = 'ts-icon-option' + (S.icon === name ? ' sel' : '') + (blocked ? ' disabled' : '');

        const tag = resolveIonIconNameForState(name);
        el.innerHTML = `<ion-icon name="${tag}"></ion-icon><span title="${name}">${name}</span>`;
        el.addEventListener('mousedown', e => {
            e.preventDefault();
            if (isIconVariantBlocked(name)) return;
            selectIcon(name);

        });
        list.appendChild(el);

    });
    if (iconDropOpen) positionIconDropdown();

}
function selectIcon(name) {
    if (isIconVariantBlocked(name)) return;
    S.icon = name;
    iconSearch = '';
    const inp = $('ts-input-icon-search');
    if (inp) inp.value = name;
    const nm = $('ts-icon-selected-name');
    if (nm) nm.textContent = name || 'None';
    const prev = $('ts-icon-selected-preview');
    if (prev) {
        if (name) {
            const nm = resolveIonIconNameForState(name);
            if (nm) prev.setAttribute('name', nm);
            else prev.removeAttribute('name');
        }
        else prev.removeAttribute('name');
    }
    const list = $('ts-icon-dd-list');
    if (list) list.classList.remove('open');
    iconDropOpen = false;
    syncIconDropdownMetadata();
    apply();

}

// ── GRADIENT PRESETS ── 
function buildGradPresets() {

    const c = $('ts-title-grad-presets');
    if (!c) return;
    c.innerHTML = '';
    GRAD_PRESETS.forEach(p => {

        const sw = document.createElement('div');
        sw.className = 'ts-grad-swatch';
        sw.style.background = `linear-gradient(${p.ang}deg,${p.a},${p.b})`;
        sw.addEventListener('click', () => {
            S.gradA = p.a;
            S.gradB = p.b;
            S.gradAngle = p.ang;
            syncGrad();
            $$('.ts-grad-swatch').forEach(x => x.classList.remove('active'));
            sw.classList.add('active');
            apply();

        });
        c.appendChild(sw);

    });

}
function syncGrad() {
    $('ts-input-grad-a').value = S.gradA;
    $('ts-input-grad-a-text').value = S.gradA;
    $('ts-sw-grad-a').style.background = S.gradA;
    $('ts-input-grad-b').value = S.gradB;
    $('ts-input-grad-b-text').value = S.gradB;
    $('ts-sw-grad-b').style.background = S.gradB;
    $('ts-input-grad-angle').value = S.gradAngle;
    $('ts-val-grad-angle').textContent = S.gradAngle + '°';

}
// ── BIND HELPERS ── 
const bindRange = (id, lbl, key, unit = '') => {

    const el = $(id), lb = $(lbl);
    if (!el) return;
    const sync = () => {
        S[key] = +el.value;
        if (lb) lb.textContent = el.value + unit;
        apply();
    };
    el.addEventListener('input', sync);
    el.addEventListener('change', sync);

};
function bindSnap10Range(id, lbl, key, unit = '') {
    const el = $(id), lb = $(lbl);
    if (!el) return;
    const sync = () => {
        let v = Math.round(+el.value / 10) * 10;
        el.value = v;
        S[key] = v;
        if (lb) lb.textContent = v + unit;
        apply();
    };
    el.addEventListener('input', sync);
    el.addEventListener('change', sync);
}
function updateBgControlsVisibility() {
    const isImg = S.bgMode === 'image';
    const solid = S.bgMode === 'solid';
    const mesh = S.bgMode === 'mesh';
    const radial = S.bgMode === 'radial';
    const elColor = $('ts-bg-color-controls');
    const elImg = $('ts-bg-image-controls');
    const elAngle = $('ts-bg-angle-wrap');
    const elPos = $('ts-bg-gradpos-wrap');
    const elStr = $('ts-bg-strength-wrap');
    const elM3 = $('ts-mesh-c3-wrap');
    const elMs = $('ts-mesh-smooth-wrap');
    const elBg2 = $('ts-field-bg-dark');
    const linear = S.bgMode === 'linear';
    if (elColor) elColor.style.display = isImg ? 'none' : '';
    if (elImg) elImg.style.display = isImg ? '' : 'none';
    if (elAngle) elAngle.style.display = linear ? '' : 'none';
    if (elPos) elPos.style.display = radial || mesh ? '' : 'none';
    if (elStr) elStr.style.display = solid || isImg ? 'none' : '';
    if (elM3) elM3.style.display = mesh ? '' : 'none';
    if (elMs) elMs.style.display = mesh ? '' : 'none';
    if (elBg2) elBg2.style.display = solid ? 'none' : '';
}

function bindColor(pickId, txtId, swId, key) {

    const pick = $(pickId), txt = $(txtId), sw = $(swId);

    const update = val => {

        if (!hexValid(val)) return;
        S[key] = val;

        if (pick) pick.value = val;

        if (txt) txt.value = val;

        if (sw) sw.style.background = val;
        apply();

    };

    if (pick) pick.addEventListener('input', () => update(pick.value));

    if (txt) txt.addEventListener('input', () => {

        const v = txt.value.trim();

        if (hexValid(v)) update(v);

    });

    if (txt) txt.addEventListener('blur', () => {

        if (!hexValid(txt.value.trim())) txt.value = S[key] || '';

    });

}
// ── BIND ALL ── 
function bindAll() {

    const btnPrev = $('ts-btn-preview');
    if (btnPrev) btnPrev.addEventListener('click', doPreview);
    const btnPrev2 = $('ts-btn-preview2');
    if (btnPrev2) btnPrev2.addEventListener('click', doPreview);
    const btnDl = $('ts-btn-download');
    if (btnDl) btnDl.addEventListener('click', doDownload);
    const btnModalClose = $('ts-btn-modal-close');
    if (btnModalClose) {
        btnModalClose.addEventListener('click', () => {
            $('ts-export-modal').classList.remove('open');
            lastDataUrl = '';
            $('ts-modal-preview-img').src = '';
        });
    }
    const exportModal = $('ts-export-modal');
    if (exportModal) {
        exportModal.addEventListener('click', e => {
            if (e.target === exportModal && btnModalClose) btnModalClose.click();
        });
    }

    const iconSearchInput = $('ts-input-icon-search');
    const iconDdWrap = document.querySelector('.ts-icon-dd-wrap');
    const iconDdList = $('ts-icon-dd-list');
    if (iconSearchInput && iconDdList) {
        iconSearchInput.addEventListener('focus', () => openIconDropdown());
        iconSearchInput.addEventListener('click', e => {
            e.stopPropagation();
            openIconDropdown();
        });
        iconSearchInput.addEventListener('input', e => {
            iconSearch = e.target.value;
            buildIconList(iconSearch);
            if (!iconDropOpen) openIconDropdown();
            else positionIconDropdown();
        });
    }
    if (iconDdWrap) {
        iconDdWrap.addEventListener('mousedown', e => e.stopPropagation());
        iconDdWrap.addEventListener('click', e => e.stopPropagation());
    }
    window.addEventListener('resize', () => {
        if (iconDropOpen) positionIconDropdown();

    });
    document.addEventListener('mousedown', e => {
        const dd = $('ts-icon-dd-list');
        if (!dd || !dd.classList.contains('open')) return;
        if (!e.target.closest('.ts-icon-dd-wrap')) {
            dd.classList.remove('open');
            iconDropOpen = false;
        }
    });
    document.addEventListener('keydown', e => {
        if (e.key !== 'Escape') return;
        const dd = $('ts-icon-dd-list');
        if (!dd || !dd.classList.contains('open')) return;
        dd.classList.remove('open');
        iconDropOpen = false;
    });

    // Text   
    $('ts-input-title').addEventListener('input', e => {
        S.title = e.target.value;
        apply();

    });
    $('ts-input-tagline').addEventListener('input', e => {
        S.tagline = e.target.value;
        apply();

    });
    $('ts-input-version').addEventListener('input', e => {
        S.version = e.target.value;
        apply();

    });
    $('ts-input-title-font').addEventListener('change', e => {
        S.titleFont = e.target.value;
        apply();

    });
    $('ts-input-title-weight').addEventListener('change', e => {
        S.titleWeight = e.target.value;
        apply();

    });
    bindRange('ts-input-title-size', 'ts-val-title-size', 'titleSize', 'px');
    bindRange('ts-input-tagline-size', 'ts-val-tagline-size', 'taglineSize', 'px');
    bindRange('ts-input-badge-size', 'ts-val-badge-size', 'badgeSize', 'px');
    bindColor('ts-input-title-color', 'ts-input-title-color-text', 'ts-sw-title', 'titleColor');
    $('ts-input-title-gradient').addEventListener('change', e => {
        S.titleGradient = e.target.checked;
        $('ts-title-gradient-controls').style.display = S.titleGradient ? 'flex' : 'none';
        apply();

    });
    bindRange('ts-input-grad-angle', 'ts-val-grad-angle', 'gradAngle', '°');
    bindColor('ts-input-grad-a', 'ts-input-grad-a-text', 'ts-sw-grad-a', 'gradA');
    bindColor('ts-input-grad-b', 'ts-input-grad-b-text', 'ts-sw-grad-b', 'gradB');
    const titleWrapEl = $('ts-input-title-wrap');
    const onTitleWrap = () => {
        S.titleWrap = titleWrapEl.checked;
        apply();

    };
    titleWrapEl.addEventListener('change', onTitleWrap);
    titleWrapEl.addEventListener('input', onTitleWrap);

    // BG
    bindColor('ts-input-accent', 'ts-input-accent-text', 'ts-sw-accent', 'accent');
    bindColor('ts-input-bg1', 'ts-input-bg1-text', 'ts-sw-bg1', 'bg1');
    bindColor('ts-input-bg2', 'ts-input-bg2-text', 'ts-sw-bg2', 'bg2');
    bindColor('ts-input-bg3', 'ts-input-bg3-text', 'ts-sw-bg3', 'bg3');
    bindRange('ts-input-bg-strength', 'ts-val-bg-strength', 'bgStrength', '%');
    bindRange('ts-input-bg-smoothness', 'ts-val-bg-smoothness', 'bgSmoothness', '%');
    bindRange('ts-input-bg-angle', 'ts-val-bg-angle', 'bgAngle', '°');
    $$('#ts-bg-mode-presets .ts-chip').forEach(c => c.addEventListener('click', () => {
        S.bgMode = c.dataset.mode;
        $$('#ts-bg-mode-presets .ts-chip').forEach(x => x.classList.remove('active'));
        c.classList.add('active');
        updateBgControlsVisibility();
        apply();

    }));
    $$('#ts-bg-gradpos-presets .ts-align-anchor-btn').forEach(c => c.addEventListener('click', () => {
        S.bgGradPos = c.dataset.bgpos;
        $$('#ts-bg-gradpos-presets .ts-align-anchor-btn').forEach(x => x.classList.remove('active'));
        c.classList.add('active');
        apply();

    }));

    // Image   
    $('ts-bg-dropzone').addEventListener('dragover', e => {
        e.preventDefault();
        $('ts-bg-dropzone').classList.add('drag');

    });
    $('ts-bg-dropzone').addEventListener('dragleave', () => $('ts-bg-dropzone').classList.remove('drag'));
    $('ts-bg-dropzone').addEventListener('drop', e => {
        e.preventDefault();
        $('ts-bg-dropzone').classList.remove('drag');

        const f = e.dataTransfer.files[0];

        if (f?.type.startsWith('image/')) loadBgImg(f);

    });
    $('ts-bg-image-file').addEventListener('change', e => {

        const f = e.target.files[0];

        if (f) loadBgImg(f);

    });
    bindRange('ts-input-overlay-opacity', 'ts-val-overlay-opacity', 'overlayOpacity', '%');
    bindColor('ts-input-overlay-color', 'ts-input-overlay-color-text', 'ts-sw-overlay', 'overlayColor');
    bindRange('ts-input-backdrop-blur', 'ts-val-backdrop-blur', 'backdropBlur', 'px');

    // Noise   
    $('ts-input-noise').addEventListener('change', e => {
        S.noise = e.target.checked;
        apply();

    });
    bindRange('ts-input-noise-opacity', 'ts-val-noise-opacity', 'noiseOpacity', '%');
    bindRange('ts-input-noise-scale', 'ts-val-noise-scale', 'noiseScale', '');
    bindRange('ts-input-noise-freq', 'ts-val-noise-freq', 'noiseFreq', '');
    $('ts-input-noise-freq').addEventListener('input', e => {
        $('ts-val-noise-freq').textContent = (e.target.value / 100).toFixed(2);

    });
    $$('#ts-noise-blend-presets .ts-chip').forEach(c => c.addEventListener('click', () => {
        S.noiseBlend = c.dataset.blend;
        $$('#ts-noise-blend-presets .ts-chip').forEach(x => x.classList.remove('active'));
        c.classList.add('active');
        apply();

    }));

    // Glow   
    $('ts-input-glow').addEventListener('change', e => {
        S.glow = e.target.checked;
        apply();

    });
    bindRange('ts-input-glow-strength', 'ts-val-glow-strength', 'glowStrength', '%');
    bindRange('ts-input-glow-opacity', 'ts-val-glow-opacity', 'glowLayerOpacity', '%');
    bindRange('ts-input-glow-diameter', 'ts-val-glow-diameter', 'glowDiameterPx', 'px');
    $$('#ts-glow-pos-presets .ts-align-anchor-btn').forEach(c => c.addEventListener('click', () => {
        S.glowPos = c.dataset.glowpos;
        $$('#ts-glow-pos-presets .ts-align-anchor-btn').forEach(x => x.classList.remove('active'));
        c.classList.add('active');
        apply();

    }));

    // Elements   
    $('ts-input-show-tagline').addEventListener('change', e => {
        S.showTagline = e.target.checked;
        apply();

    });
    $('ts-input-show-badge').addEventListener('change', e => {
        S.showBadge = e.target.checked;
        apply();

    });
    $('ts-input-tagline-border').addEventListener('change', e => {
        S.taglineBorder = e.target.checked;
        apply();

    });

    const tlTxt = $('ts-input-tagline-color-text');
    $('ts-input-tagline-color').addEventListener('input', e => {
        S.taglineColorOverride = e.target.value;
        tlTxt.value = e.target.value;
        $('ts-sw-tagline-color').style.background = e.target.value;
        apply();

    });
    tlTxt.addEventListener('input', () => {

        const v = tlTxt.value.trim();

        if (!v || v === 'accent') {
            S.taglineColorOverride = '';
            apply();
            return;

        }
        if (hexValid(v)) {
            S.taglineColorOverride = v;
            $('ts-sw-tagline-color').style.background = v;
            apply();

        }
    });
    $$('#ts-tagline-order-presets .ts-chip').forEach(c => c.addEventListener('click', () => {
        S.taglineOrder = +c.dataset.order;
        $$('#ts-tagline-order-presets .ts-chip').forEach(x => x.classList.remove('active'));
        c.classList.add('active');
        apply();

    }));
    $$('#ts-badge-style-presets .ts-chip').forEach(c => c.addEventListener('click', () => {
        S.badgeStyle = c.dataset.badgestyle;
        $$('#ts-badge-style-presets .ts-chip').forEach(x => x.classList.remove('active'));
        c.classList.add('active');
        apply();

    }));
    bindRange('ts-input-badge-radius', 'ts-val-badge-radius', 'badgeRadius', 'px');
    bindRange('ts-input-badge-opacity', 'ts-val-badge-opacity', 'badgeOpacity', '%');
    bindColor('ts-input-badge-color', 'ts-input-badge-color-text', 'ts-sw-badge-color', 'badgeColor');

    // Icon   
    ensureIconSharpToggle();
    $('ts-input-icon-outline').addEventListener('change', e => {
        S.iconOutline = e.target.checked;
        if (S.iconOutline) S.iconSharp = false;
        const sh = $('ts-input-icon-sharp');
        if (sh) sh.checked = false;
        buildIconList(iconSearch);
        const prev = $('ts-icon-selected-preview');
        if (prev && S.icon) {
            const nm = resolveIonIconNameForState(S.icon);
            if (nm) prev.setAttribute('name', nm);
            else prev.removeAttribute('name');
        }
        apply();
    });
    const shEl = $('ts-input-icon-sharp');
    if (shEl) {
        shEl.addEventListener('change', e => {
            S.iconSharp = e.target.checked;
            if (S.iconSharp) {
                S.iconOutline = false;
                $('ts-input-icon-outline').checked = false;
            }
            buildIconList(iconSearch);
            const prev = $('ts-icon-selected-preview');
            if (prev && S.icon) {
                const nm = resolveIonIconNameForState(S.icon);
                if (nm) prev.setAttribute('name', nm);
                else prev.removeAttribute('name');
            }
            apply();
        });
    }
    bindSnap10Range('ts-input-icon-size', 'ts-val-icon-size', 'iconSize', 'px');
    bindRange('ts-input-icon-x', 'ts-val-icon-x', 'iconX', 'px');
    bindRange('ts-input-icon-y', 'ts-val-icon-y', 'iconY', 'px');

    const icTxt = $('ts-input-icon-color-text');
    $('ts-input-icon-color').addEventListener('input', e => {
        S.iconColorOverride = e.target.value;
        icTxt.value = e.target.value;
        $('ts-sw-icon-color').style.background = e.target.value;
        apply();

    });
    icTxt.addEventListener('input', () => {

        const v = icTxt.value.trim();

        if (!v || v === 'accent') {
            S.iconColorOverride = '';
            apply();

        }
        else
            if (hexValid(v)) {
                S.iconColorOverride = v;
                apply();

            }
    });

    // Canvas — 3×3 alignment grid
    $$('#ts-align-anchor-grid .ts-align-anchor-btn').forEach(btn => btn.addEventListener('click', () => {
        S.alignH = btn.dataset.halign;
        S.alignV = btn.dataset.valign;
        $$('#ts-align-anchor-grid .ts-align-anchor-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        apply();

    }));
    bindRange('ts-input-pad-h', 'ts-val-pad-h', 'padH', 'px');
    bindRange('ts-input-pad-v', 'ts-val-pad-v', 'padV', 'px');
    const padWireIn = $('ts-input-pad-wire');
    if (padWireIn) {
        padWireIn.addEventListener('change', e => {
            S.padWirePreview = e.target.checked;
            apply();
        });
    }
    $$('#ts-size-presets .ts-chip').forEach(c => c.addEventListener('click', () => {
        S.bannerW = +c.dataset.w;
        S.bannerH = +c.dataset.h;
        $$('#ts-size-presets .ts-chip').forEach(x => x.classList.remove('active'));
        c.classList.add('active');
        apply();

    }));
    $('ts-input-custom-w').addEventListener('change', e => {

        const v = +e.target.value;

        if (v >= 100 && v <= 4000) {
            S.bannerW = v;
            apply();

        }
    });
    $('ts-input-custom-h').addEventListener('change', e => {

        const v = +e.target.value;

        if (v >= 100 && v <= 4000) {
            S.bannerH = v;
            apply();

        }
    });
    $$('#ts-format-presets .ts-chip').forEach(c => c.addEventListener('click', () => {
        S.exportFmt = c.dataset.fmt;
        $$('#ts-format-presets .ts-chip').forEach(x => x.classList.remove('active'));
        c.classList.add('active');
        $('ts-jpeg-quality-wrap').style.display = S.exportFmt === 'jpeg' ? '' : 'none';

    }));
    $$('#ts-scale-presets .ts-chip').forEach(c => c.addEventListener('click', () => {
        S.exportScale = +c.dataset.scale;
        $$('#ts-scale-presets .ts-chip').forEach(x => x.classList.remove('active'));
        c.classList.add('active');

    }));
    bindRange('ts-input-jpeg-quality', 'ts-val-jpeg-quality', 'jpegQuality', '%');

    // Tabs   
    $$('.ts-ptab').forEach(t => t.addEventListener('click', () => {
        $$('.ts-ptab').forEach(x => x.classList.remove('active'));
        $$('.ts-tab-pane').forEach(x => x.classList.remove('active'));
        t.classList.add('active');
        const pane = document.querySelector(`.ts-tab-pane[data-pane="${t.dataset.tab}"]`);
        if (pane) pane.classList.add('active');

    }));

    // JSON   
    const doSave = () => {

        const j = JSON.stringify(S, null, 2);

        const b = new Blob([j], {
            type: 'application/json'
        });

        const u = URL.createObjectURL(b);

        const a = document.createElement('a');
        a.download = `toolskin-preset-${Date.now()}.json`;
        a.href = u;
        a.click();
        URL.revokeObjectURL(u);
        showToast('Preset saved!');

    };
    $('ts-btn-save-json').addEventListener('click', doSave);
    $('ts-btn-save-json2').addEventListener('click', doSave);
    $('ts-btn-load-json').addEventListener('click', () => $('ts-json-file-input').click());
    $('ts-json-file-input').addEventListener('change', e => {

        const f = e.target.files[0];

        if (!f) return;

        const r = new FileReader();
        r.onload = ev => {
            try {
                Object.assign(S, JSON.parse(ev.target.result));
                if (S.iconSharp === undefined) S.iconSharp = false;
                syncInputs();
                apply();
                showToast('Preset loaded!');

            }
            catch {
                showToast('Invalid JSON');

            }
        };
        r.readAsText(f);
        e.target.value = '';

    });
    $('ts-btn-reset').addEventListener('click', () => {
        Object.assign(S, { ...DEFAULTS });
        syncInputs();
        apply();
        showToast('Reset');

    });

}
function loadBgImg(file) {

    const r = new FileReader();
    r.onload = e => {
        S.bgImage = e.target.result;

        const p = $('ts-dz-preview');
        p.src = e.target.result;
        p.style.display = 'block';
        $('ts-drop-label').textContent = file.name;
        apply();

    };
    r.readAsDataURL(file);

}
// ── SYNC INPUTS FROM STATE ── 
function syncInputs() {

    const setC = (pId, tId, sId, v) => {

        if ($(pId)) $(pId).value = (v || '').slice(0, 7);

        if ($(tId)) $(tId).value = v || '';

        if ($(sId)) $(sId).style.background = v || '';

    };
    $('ts-input-title').value = S.title;
    $('ts-input-tagline').value = S.tagline;
    $('ts-input-version').value = S.version;
    $('ts-input-title-size').value = S.titleSize;
    $('ts-val-title-size').textContent = S.titleSize + 'px';
    $('ts-input-tagline-size').value = S.taglineSize;
    $('ts-val-tagline-size').textContent = S.taglineSize + 'px';
    $('ts-input-badge-size').value = S.badgeSize;
    $('ts-val-badge-size').textContent = S.badgeSize + 'px';
    const tf = $('ts-input-title-font');
    const tw = $('ts-input-title-weight');
    if (tf) {
        tf.value = S.titleFont;
        tf.dispatchEvent(new Event('change', { bubbles: true }));
    }
    if (tw) {
        tw.value = S.titleWeight;
        tw.dispatchEvent(new Event('change', { bubbles: true }));
    }
    $('ts-input-title-gradient').checked = S.titleGradient;
    $('ts-title-gradient-controls').style.display = S.titleGradient ? 'flex' : 'none';
    $('ts-input-title-wrap').checked = S.titleWrap;
    setC('ts-input-title-color', 'ts-input-title-color-text', 'ts-sw-title', S.titleColor);
    syncGrad();
    setC('ts-input-accent', 'ts-input-accent-text', 'ts-sw-accent', S.accent);
    setC('ts-input-bg1', 'ts-input-bg1-text', 'ts-sw-bg1', S.bg1);
    setC('ts-input-bg2', 'ts-input-bg2-text', 'ts-sw-bg2', S.bg2);
    setC('ts-input-bg3', 'ts-input-bg3-text', 'ts-sw-bg3', S.bg3);
    $('ts-input-bg-strength').value = S.bgStrength;
    $('ts-val-bg-strength').textContent = S.bgStrength + '%';
    $('ts-input-bg-smoothness').value = S.bgSmoothness;
    $('ts-val-bg-smoothness').textContent = S.bgSmoothness + '%';
    $('ts-input-bg-angle').value = S.bgAngle;
    $('ts-val-bg-angle').textContent = S.bgAngle + '°';
    $('ts-input-noise').checked = S.noise;
    $('ts-input-noise-opacity').value = S.noiseOpacity;
    $('ts-val-noise-opacity').textContent = S.noiseOpacity + '%';
    $('ts-input-noise-scale').value = S.noiseScale;
    $('ts-val-noise-scale').textContent = S.noiseScale;
    $('ts-input-noise-freq').value = S.noiseFreq;
    $('ts-val-noise-freq').textContent = (S.noiseFreq / 100).toFixed(2);
    $('ts-input-glow').checked = S.glow;
    $('ts-val-glow-strength').textContent = S.glowStrength + '%';
    $('ts-input-glow-strength').value = S.glowStrength;
    if ($('ts-input-glow-opacity')) {
        $('ts-input-glow-opacity').value = S.glowLayerOpacity != null ? S.glowLayerOpacity : 100;
        $('ts-val-glow-opacity').textContent = (S.glowLayerOpacity != null ? S.glowLayerOpacity : 100) + '%';
    }
    if ($('ts-input-glow-diameter')) {
        $('ts-input-glow-diameter').value = S.glowDiameterPx != null ? S.glowDiameterPx : 1200;
        $('ts-val-glow-diameter').textContent = (S.glowDiameterPx != null ? S.glowDiameterPx : 1200) + 'px';
    }
    $('ts-input-overlay-opacity').value = S.overlayOpacity;
    $('ts-val-overlay-opacity').textContent = S.overlayOpacity + '%';
    $('ts-input-backdrop-blur').value = S.backdropBlur;
    $('ts-val-backdrop-blur').textContent = S.backdropBlur + 'px';
    setC('ts-input-overlay-color', 'ts-input-overlay-color-text', 'ts-sw-overlay', S.overlayColor);
    $('ts-input-show-tagline').checked = S.showTagline;
    $('ts-input-show-badge').checked = S.showBadge;
    $('ts-input-tagline-border').checked = S.taglineBorder;
    $('ts-input-tagline-color-text').value = S.taglineColorOverride || 'accent';
    setC('ts-input-badge-color', 'ts-input-badge-color-text', 'ts-sw-badge-color', S.badgeColor);
    $('ts-input-badge-radius').value = S.badgeRadius;
    $('ts-val-badge-radius').textContent = S.badgeRadius + 'px';
    $('ts-input-badge-opacity').value = S.badgeOpacity;
    $('ts-val-badge-opacity').textContent = S.badgeOpacity + '%';
    $('ts-input-icon-outline').checked = S.iconOutline;
    if (S.iconSharp === undefined) S.iconSharp = false;
    const sh = $('ts-input-icon-sharp');
    if (sh) sh.checked = S.iconSharp;
    const iconSearchEl = $('ts-input-icon-search');
    if (iconSearchEl) {
        iconSearchEl.value = S.icon || '';
        // Must NOT set iconSearch = S.icon: that string is used to filter the icon list via .includes(),
        // and only the exact icon matches (e.g. "code-slash" → one row). Keep filter empty; input still shows selection.
        iconSearch = '';
    }
    const isn = $('ts-icon-selected-name');
    if (isn) isn.textContent = S.icon || 'None';
    const iselPrev = $('ts-icon-selected-preview');
    if (iselPrev) {
        if (S.icon) {
            const nm = resolveIonIconNameForState(S.icon);
            if (nm) iselPrev.setAttribute('name', nm);
            else iselPrev.removeAttribute('name');
        }
        else iselPrev.removeAttribute('name');
    }
    $('ts-input-icon-size').value = S.iconSize;
    $('ts-val-icon-size').textContent = S.iconSize + 'px';
    $('ts-input-icon-x').value = S.iconX;
    $('ts-val-icon-x').textContent = S.iconX + 'px';
    $('ts-input-icon-y').value = S.iconY;
    $('ts-val-icon-y').textContent = S.iconY + 'px';
    $('ts-input-icon-color-text').value = S.iconColorOverride || 'accent';
    $('ts-input-pad-h').value = S.padH;
    $('ts-val-pad-h').textContent = S.padH + 'px';
    $('ts-input-pad-v').value = S.padV;
    $('ts-val-pad-v').textContent = S.padV + 'px';
    const pWire = $('ts-input-pad-wire');
    if (pWire) pWire.checked = !!S.padWirePreview;
    $('ts-input-custom-w').value = S.bannerW;
    $('ts-input-custom-h').value = S.bannerH;

    // Chips
    $$('#ts-bg-mode-presets .ts-chip').forEach(c => c.classList.toggle('active', c.dataset.mode === S.bgMode));
    $$('#ts-bg-gradpos-presets .ts-align-anchor-btn').forEach(c => c.classList.toggle('active', c.dataset.bgpos === S.bgGradPos));
    $$('#ts-glow-pos-presets .ts-align-anchor-btn').forEach(c => c.classList.toggle('active', c.dataset.glowpos === S.glowPos));
    $$('#ts-size-presets .ts-chip').forEach(c => c.classList.toggle('active', +c.dataset.w === S.bannerW && +c.dataset.h === S.bannerH));
    $$('#ts-align-anchor-grid .ts-align-anchor-btn').forEach(b => b.classList.toggle('active', b.dataset.halign === S.alignH && b.dataset.valign === S.alignV));
    $$('#ts-badge-style-presets .ts-chip').forEach(c => c.classList.toggle('active', c.dataset.badgestyle === S.badgeStyle));
    $$('#ts-tagline-order-presets .ts-chip').forEach(c => c.classList.toggle('active', +c.dataset.order === S.taglineOrder));
    $$('#ts-noise-blend-presets .ts-chip').forEach(c => c.classList.toggle('active', c.dataset.blend === S.noiseBlend));
    $$('#ts-format-presets .ts-chip').forEach(c => c.classList.toggle('active', c.dataset.fmt === S.exportFmt));
    $$('#ts-scale-presets .ts-chip').forEach(c => c.classList.toggle('active', +c.dataset.scale === S.exportScale));

    updateBgControlsVisibility();
    $('ts-jpeg-quality-wrap').style.display = S.exportFmt === 'jpeg' ? '' : 'none';
    syncIconDropdownMetadata();
    ensureIconSharpToggle();
    syncIconVariantUi();

}
// ── TOAST ── 
let toastT;

function showToast(msg) {

    const t = $('ts-toast');
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(toastT);
    toastT = setTimeout(() => t.classList.remove('show'), 2200);

}
// ── INIT (after DOM: script lives in <head>) ── 
function runGeneratorInit() {
    bindDomRefs();
    if (!banner || !pTitle) return;
    injectLayers();
    buildGradPresets();
    ensureIconSharpToggle();
    buildIconList();
    bindAll();
    syncInputs();
    apply();
    // Re-init range slider fills after syncInputs changed values
    document.querySelectorAll('input[type="range"].ts-range').forEach(function (el) {
        var min = parseFloat(el.min) || 0;
        var max = parseFloat(el.max) || 100;
        var val = parseFloat(el.value) || min;
        var pct = max !== min ? ((val - min) / (max - min)) * 100 : 0;
        el.style.setProperty('--ts-range-val', val);
        el.style.setProperty('--ts-range-min', min);
        el.style.setProperty('--ts-range-max', max);
        el.style.setProperty('--ts-range-percent', pct + '%');
    });
    const genRoot = document.getElementById('ts-app');
    if (window.ToolskinUIKit && typeof window.ToolskinUIKit.init === 'function') {
        window.ToolskinUIKit.init(genRoot || document);
    }
    document.fonts.ready.then(() => {
        rescale();
        apply();

    });

}
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runGeneratorInit);
} else {
    runGeneratorInit();
}
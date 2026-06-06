/* ════════════════════════════════════════════════════════════════════
 * TS CUBE PORTFOLIO — ISOLATED SCRIPTS  (PENDING INTEGRATION)
 * ════════════════════════════════════════════════════════════════════
 *
 * STATUS
 * ──────────────────────────────────────────────────────────────────
 * Not currently in use. Read every comment in this file — they are
 * not all labeled, and several flag refactor/integration work.
 *
 * Extracted from the standalone "ts-cube-portfolio" HTML file:
 * a special gallery view built from several innovative components,
 * styled mostly with Toolskin tokens. A few isolated CSS rules
 * remain inline and are also pending integration.
 *
 * SCOPE OF THIS FILE
 * ──────────────────────────────────────────────────────────────────
 * This is the isolated header script. It is pending refactor into
 * one or more reusable Toolskin modules. The HTML source is
 * standalone; integration must NOT remain isolated-scope — every
 * unit below has to become a reusable, hookable module.
 *
 * MODULES TO EXTRACT  (refactor targets)
 * ──────────────────────────────────────────────────────────────────
 *
 *  1. buildRulers()  — auto-generated ruler frame + live viewport
 *     size counter. Renders the top and left rulers (lines +
 *     numeric labels) directly over the layout, with no HTML
 *     markup required. Smart, economical loop.
 *     → Promote to a core component asset and showcase it in the
 *       Toolskin codebase docs as one of the flagship innovations.
 *
 *  2. Animated dynamic scrolling infinite sidebar menu
 *     Needs optimization and automation. All content is currently
 *     hardcoded; at minimum it should fetch from a JSON source.
 *     Inlining all that content here is not acceptable long-term.
 *     → Once integrated, modules must be activatable independently,
 *       not globally on the view.
 *
 *  3. 3D interactive cube  — still experimental
 *     Works and is usable, but it must become dynamic: able to load
 *     elements from a gallery source (posts, a folder, or a JSON
 *     feed) and to bind menu entries to cube tiles dynamically via
 *     hooks, while remaining a separate asset.
 *
 *  4. Component pairing  (ts-cube-gallery + ts-slide-menu)
 *     - ts-cube-gallery is an integratable component on its own.
 *     - ts-slide-menu (pending rename) is a standalone asset with
 *       hooks for the cube and for any other navigation / gallery
 *       system. Both need integration.
 * ════════════════════════════════════════════════════════════════════ */

const PROJECTS = [
  { id: 'ts_1', slug: 'moving-portraits', title: 'Moving Portraits', type: 'Film Direction', year: '2025', client: 'Self-initiated', desc: 'A study in stillness and time — portraits that breathe through subtle motion and duration.', main: 'https://picsum.photos/300?random=1', imgs: ['https://picsum.photos/600/450?random=2', 'https://picsum.photos/600/450?random=3', 'https://picsum.photos/600/450?random=4', 'https://picsum.photos/600/450?random=5'] },
  { id: 'ts_2', slug: 'issey-miyake-ss25', title: 'Issey Miyake SS25', type: 'Fashion · Digital', year: '2025', client: 'Issey Miyake', desc: 'Interactive digital campaign for the Spring/Summer 2025 collection. Pleats, motion, and material translated into web.', main: 'https://picsum.photos/300?random=6', imgs: ['https://picsum.photos/600/450?random=7', 'https://picsum.photos/600/450?random=8', 'https://picsum.photos/600/450?random=9'] },
  { id: 'ts_3', slug: 'studies-in-motion', title: 'Studies in Motion', type: 'Motion Design', year: '2025', client: 'Self-initiated', desc: 'An ongoing archive of kinetic explorations — objects, light, and bodies in movement captured through digital lenses.', main: 'https://picsum.photos/300?random=10', imgs: ['https://picsum.photos/600/450?random=11', 'https://picsum.photos/600/450?random=12', 'https://picsum.photos/600/450?random=13', 'https://picsum.photos/600/450?random=14'] },
  { id: 'ts_4', slug: 'ruby-campbell', title: 'Ruby Campbell', type: 'Portrait · Campaign', year: '2026', client: 'Ruby Campbell', desc: 'Editorial portrait series and digital campaign — texture, grain, and raw authenticity.', main: 'https://picsum.photos/300?random=15', imgs: ['https://picsum.photos/600/450?random=16', 'https://picsum.photos/600/450?random=17'] },
  { id: 'ts_5', slug: 'shaped-by-earth', title: 'Shaped by Earth', type: 'Brand · Experience', year: '2025', client: 'Shaped by Earth', desc: 'Digital identity and immersive brand experience for a sustainable luxury materials brand.', main: 'https://picsum.photos/300?random=18', imgs: ['https://picsum.photos/600/450?random=19', 'https://picsum.photos/600/450?random=20', 'https://picsum.photos/600/450?random=21', 'https://picsum.photos/600/450?random=22', 'https://picsum.photos/600/450?random=23'] },
  { id: 'ts_6', slug: 'echoes-in-light', title: 'Echoes in Light', type: 'Installation · Web', year: '2026', client: 'Self-initiated', desc: 'A generative light installation translated to interactive web — sound, photons, and real-time WebGL reflections.', main: 'https://picsum.photos/300?random=24', imgs: ['https://picsum.photos/600/450?random=25', 'https://picsum.photos/600/450?random=26', 'https://picsum.photos/600/450?random=27', 'https://picsum.photos/600/450?random=28'] },
  { id: 'ts_7', slug: 'archive-001', title: 'Archive 001', type: 'Photography', year: '2024', client: 'Self-initiated', desc: 'A curated visual archive spanning five years of documentary photography across three continents.', main: 'https://picsum.photos/300?random=29', imgs: ['https://picsum.photos/600/450?random=30', 'https://picsum.photos/600/450?random=31'] },
  { id: 'ts_8', slug: 'surface-tension', title: 'Surface Tension', type: 'Interactive Web', year: '2025', client: 'Atelier Noir', desc: 'Fluid simulation and interactive surface for luxury fragrance brand — physics-driven WebGL.', main: 'https://picsum.photos/300?random=32', imgs: ['https://picsum.photos/600/450?random=33', 'https://picsum.photos/600/450?random=34', 'https://picsum.photos/600/450?random=35'] },
  { id: 'ts_9', slug: 'deep-field', title: 'Deep Field', type: 'Generative Art', year: '2026', client: 'Gallery Kiosk', desc: 'Generative star-field series exploring deep-time and astronomical scale through procedural geometry.', main: 'https://picsum.photos/300?random=36', imgs: ['https://picsum.photos/600/450?random=37', 'https://picsum.photos/600/450?random=38', 'https://picsum.photos/600/450?random=39', 'https://picsum.photos/600/450?random=40'] },
  { id: 'ts_10', slug: 'frequency', title: 'Frequency', type: 'Audio-Visual', year: '2025', client: 'Resonance Lab', desc: 'Real-time audio-reactive visuals — frequency data mapped to 3D geometry and volumetric light.', main: 'https://picsum.photos/300?random=41', imgs: ['https://picsum.photos/600/450?random=42', 'https://picsum.photos/600/450?random=43'] },
  { id: 'ts_11', slug: 'meridian', title: 'Meridian', type: 'Brand Identity', year: '2025', client: 'Meridian Studio', desc: 'Full visual identity system for interdisciplinary design studio — mark, type system, motion guidelines.', main: 'https://picsum.photos/300?random=44', imgs: ['https://picsum.photos/600/450?random=45', 'https://picsum.photos/600/450?random=46', 'https://picsum.photos/600/450?random=47', 'https://picsum.photos/600/450?random=48'] },
  { id: 'ts_12', slug: 'chromatic', title: 'Chromatic', type: '3D · Render', year: '2026', client: 'Self-initiated', desc: 'Color field study — 3D rendered environments built around single dominant hues and material extremes.', main: 'https://picsum.photos/300?random=49', imgs: ['https://picsum.photos/600/450?random=50', 'https://picsum.photos/600/450?random=51', 'https://picsum.photos/600/450?random=52'] },
  { id: 'ts_13', slug: 'concrete-forest', title: 'Concrete Forest', type: 'Urban Photography', year: '2024', client: 'Self-initiated', desc: 'Long-form photographic study of brutalist architecture in post-industrial European cities.', main: 'https://picsum.photos/300?random=53', imgs: ['https://picsum.photos/600/450?random=54', 'https://picsum.photos/600/450?random=55', 'https://picsum.photos/600/450?random=56', 'https://picsum.photos/600/450?random=57'] },
  { id: 'ts_14', slug: 'drift', title: 'Drift', type: 'Short Film', year: '2025', client: 'Self-initiated', desc: 'A 14-minute short film about displacement, memory, and the geography of coastlines.', main: 'https://picsum.photos/300?random=58', imgs: ['https://picsum.photos/600/450?random=59', 'https://picsum.photos/600/450?random=60'] },
  { id: 'ts_15', slug: 'neon-garden', title: 'Neon Garden', type: 'Experiential', year: '2026', client: 'Flux Events', desc: 'Immersive LED garden installation for festival environment spanning 2000m² of programmable light.', main: 'https://picsum.photos/300?random=61', imgs: ['https://picsum.photos/600/450?random=62', 'https://picsum.photos/600/450?random=63', 'https://picsum.photos/600/450?random=64', 'https://picsum.photos/600/450?random=65'] },
  { id: 'ts_16', slug: 'signal-noise', title: 'Signal / Noise', type: 'Data Visualisation', year: '2025', client: 'Open Research Co', desc: 'Interactive visualisation of global radio frequency pollution patterns — real-time spectrum data.', main: 'https://picsum.photos/300?random=66', imgs: ['https://picsum.photos/600/450?random=67', 'https://picsum.photos/600/450?random=68', 'https://picsum.photos/600/450?random=69'] },
];

/* REFACTOR NOTE — Data source
 * ──────────────────────────────────────────────────────────────────
 * PROJECTS is currently inlined. On integration this should come
 * from a JSON file or be fetched dynamically (CMS / API / folder
 * scan). Inlined data is not acceptable long-term; see header note. */
const N = PROJECTS.length;          // 16
const MENU_LIST = [...PROJECTS, ...PROJECTS, ...PROJECTS, ...PROJECTS]; // 64 items
const ITEM_H = 43;                  // px per menu row

/* ── CURSOR ── (currently disabled — see commented block) */
/*const cur = document.getElementById('tsc');
document.addEventListener('mousemove', e => {
  cur.style.left = e.clientX + 'px';
  cur.style.top  = e.clientY + 'px';
});
const bigCursor = on => cur.classList.toggle('big', on);
*/

/* ── RULERS + DIMS ──
 * Legacy ruler builder. Superseded by createRulerSVG / mountRulers
 * at the bottom of this file (SVG-based, ResizeObserver-driven).
 * Kept here for reference; remove once the SVG version is confirmed
 * stable across all integration targets. */
function buildRulers() {
  const rt = document.getElementById('ts-rt');
  const rl = document.getElementById('ts-rl');
  rt.innerHTML = ''; rl.innerHTML = '';
  for (let i = 0; i < Math.ceil(window.innerWidth / 55); i++) {
    const d = document.createElement('div');
    d.className = 'rstk' + (i % 5 === 0 ? ' m' : '');
    if (i % 5 === 0) d.dataset.v = i * 55;
    rt.appendChild(d);
  }
  for (let i = 0; i < Math.ceil(window.innerHeight / 80); i++) {
    const d = document.createElement('div');
    d.className = 'rsvtk';
    rl.appendChild(d);
  }
  document.getElementById('ts-dims').textContent = `${window.innerWidth}px × ${window.innerHeight}px`;
}
/*buildRulers();
window.addEventListener('resize', buildRulers);*/

/* ════════════════════════════════════════════════════════════════════
   WEBGL — exact port of original logic
   ════════════════════════════════════════════════════════════════════ */
(function () {

  /* Vertex shader — port of original Ea */
  const VS = `
    varying float vFacing;
    varying vec2 vUv;
    void main() {
      vUv = uv;
      vec3 wn = normalize(normalMatrix * normal);
      vec3 vd = normalize(-(modelViewMatrix * vec4(position,1.0)).xyz);
      vFacing = dot(wn, vd);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
    }`;

  /* Fragment shader — port of original Aa
     - backfaces are darkened via vFacing (no wireframe artefacts)
     - active tiles become brighter                                   */
  const FS = `
    precision highp float;
    uniform sampler2D tMap;
    uniform float uAlpha;
    uniform float uIsActive;
    varying vec2 vUv;
    varying float vFacing;
    void main() {
      vec4 color  = texture2D(tMap, vUv);
      color.a     = uAlpha;
      float isBack   = step(vFacing, 0.0);
      float darken   = mix(1.0, 0.22, isBack);
      darken         = mix(darken, 1.0, uIsActive);
      color.rgb     *= darken;
      color.rgb     *= mix(1.0, 1.2, uIsActive);
      gl_FragColor   = color;
    }`;

  /* ── Geometry placer — direct port of original lo() ──
     Distributes PlaneGeometry tiles across 6 cube faces.
     index / length / size → position + rotation per tile  */
  function placeTile(media, index, length, size) {
    const perFace = Math.ceil(length / 6);
    const faceIdx = Math.floor(index / perFace);
    const local = index % perFace;
    const cols = Math.ceil(Math.sqrt(perFace));
    const col = local % cols;
    const row = Math.floor(local / cols);
    const fd = size * 1.9;   // face distance from center
    const sp = size * 1.25;  // spacing between cells
    const ctr = (cols - 1) / 2;

    const faces = [
      { x: fd, y: (row - ctr) * sp, z: (col - ctr) * sp, rx: 0, ry: Math.PI / 2, rz: 0 },  // +X
      { x: -fd, y: (row - ctr) * sp, z: -(col - ctr) * sp, rx: 0, ry: -Math.PI / 2, rz: 0 },  // -X
      { x: (col - ctr) * sp, y: fd, z: (row - ctr) * sp, rx: -Math.PI / 2, ry: 0, rz: 0 },  // +Y
      { x: (col - ctr) * sp, y: -fd, z: -(row - ctr) * sp, rx: Math.PI / 2, ry: 0, rz: 0 },  // -Y
      { x: (col - ctr) * sp, y: (row - ctr) * sp, z: fd, rx: 0, ry: 0, rz: 0 },  // +Z
      { x: -(col - ctr) * sp, y: (row - ctr) * sp, z: -fd, rx: 0, ry: Math.PI, rz: 0 },  // -Z
    ];
    const f = faces[faceIdx] || faces[0];
    media.mesh.position.set(f.x, f.y, f.z);
    media.mesh.rotation.set(f.rx, f.ry, f.rz);
  }

  /* ── Renderer (matches original: alpha, antialias, appended to body) ── */
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  // Slot renderer into the placeholder canvas element
  const ph = document.getElementById('ts-cv');
  ph.replaceWith(renderer.domElement);
  Object.assign(renderer.domElement.style, {
    position: 'absolute', inset: '0',
    width: '100%', height: '100%', zIndex: '999', display: 'block'
  });
  renderer.domElement.id = 'ts-cv';

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 4;  // original value
  const clock = new THREE.Clock();

  /* Shared geometry — one PlaneGeometry for all tiles (original: qs(1,1,1,1) = BoxGeometry,
     but the tiles use PlaneGeometry via the media mesh — here we match the visual exactly) */
  const geo = new THREE.PlaneGeometry(1, 1);

  /* ── TileMedia — port of original Ca class ── */
  class TileMedia {
    constructor(index, length, texture) {
      this.index = index; this.length = length; this.texture = texture;
      this._mkMat(); this._mkMesh();
    }
    _mkMat() {
      this.mat = new THREE.ShaderMaterial({
        vertexShader: VS, fragmentShader: FS,
        uniforms: {
          tMap: { value: this.texture },
          uAlpha: { value: 0 },
          uIsActive: { value: 0 },
          uTime: { value: 0 },
        },
        transparent: true,
        side: THREE.DoubleSide,  // DoubleSide + facing shader = correct backface darkening, no wireframe
      });
    }
    _mkMesh() {
      this.mesh = new THREE.Mesh(geo, this.mat);
      this.mesh.scale.set(1, 1, 1);
    }
    show({ delay = 0 } = {}) {
      gsap.timeline({ delay, defaults: { ease: 'expo.inOut', duration: 1.5 } })
        .fromTo(this.mat.uniforms.uAlpha, { value: 0 }, { value: 1 }, 0);
    }
    setAlpha(v) {
      gsap.killTweensOf(this.mat.uniforms.uAlpha);
      gsap.to(this.mat.uniforms.uAlpha, { value: v, duration: .8, ease: 'power2.out' });
    }
    setActive(v) {
      gsap.killTweensOf(this.mat.uniforms.uIsActive);
      gsap.to(this.mat.uniforms.uIsActive, { value: v ? 1 : 0, duration: .8, ease: 'power2.out' });
    }
    update() { this.mat.uniforms.uTime.value += 0.016; }
    destroy() {
      gsap.killTweensOf(this.mat.uniforms.uAlpha);
      gsap.killTweensOf(this.mat.uniforms.uIsActive);
      this.mat.dispose();
    }
  }

  /* ── IndexGallery — port of original Pa class ──
   *
   * REFACTOR NOTE
   * On integration, this class must accept its data source as a
   * parameter (PROJECTS array, JSON URL, or hook callback) instead
   * of closing over the module-level PROJECTS constant. Same for
   * the texture map: the gallery should be agnostic about where
   * tiles come from. */
  class IndexGallery {
    constructor() {
      this.parentGroup = new THREE.Group();
      this.group = new THREE.Group();
      this.parentGroup.add(this.group);
      this.rotX = 0.06; this.rotY = 0.18; this.rotZ = 0.02;
      this.tScale = 5; this.lastT = 0; this.gScale = 0.45;
      this.medias = []; this.transitionToHide = false;
      scene.add(this.parentGroup);
    }

    build(texMap) {
      PROJECTS.forEach((proj, i) => {
        const tex = texMap.get(proj.id);
        if (!tex) return;
        const m = new TileMedia(i, N, tex);
        m.slug = proj.slug;
        const sz = Math.max(m.mesh.scale.x, m.mesh.scale.y);
        placeTile(m, i, N, sz);
        this.group.add(m.mesh);
        this.medias.push(m);
        m.show({ delay: 0.25 + i * 0.04 });
      });
      // Entrance animation — exact match of original show()
      this.group.rotation.x = 0; this.group.rotation.y = 0;
      const tl = gsap.timeline({ defaults: { ease: 'expo.inOut', duration: 2.5 } });
      tl.fromTo(this.parentGroup.scale,
        { x: 0, y: 0, z: 0 },
        { x: this.gScale, y: this.gScale, z: this.gScale }, 0
      ).fromTo(this.parentGroup.rotation,
        { x: -Math.PI * 0.2, y: -Math.PI * 1.85 },
        { x: 0, y: 0 }, 0
      ).timeScale(0.85);
    }

    onMouseEnter(slug) {
      if (this.transitionToHide) return;
      this.medias.forEach(m => {
        const hit = m.slug === slug;
        m.setAlpha(hit ? 1 : 0.1);
        m.setActive(hit);
      });
      this.tScale = 0.25;
      gsap.to(this.parentGroup.scale, { x: .55, y: .55, z: .55, duration: 1, ease: 'expo.out' });
    }

    onMouseLeave() {
      if (this.transitionToHide) return;
      this.medias.forEach(m => { m.setAlpha(1); m.setActive(false); });
      this.tScale = 5;
      gsap.to(this.parentGroup.scale,
        { x: this.gScale, y: this.gScale, z: this.gScale, duration: 1, ease: 'expo.out' });
    }

    update(elapsed) {
      const d = elapsed - this.lastT;
      this.lastT = elapsed;
      if (d > 0.2) return;
      this.group.rotation.x += d * this.rotX * this.tScale;
      this.group.rotation.y += d * this.rotY * this.tScale;
      this.group.rotation.z += d * this.rotZ * this.tScale;
      this.medias.forEach(m => m.update());
    }
    destroy() {
      this.medias.forEach(m => { this.group.remove(m.mesh); m.destroy(); });
      scene.remove(this.parentGroup);
    }
  }

  /* ── Resize ── */
  window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  });

  /* ── RAF ── */
  let gallery = null;
  (function raf() {
    requestAnimationFrame(raf);
    if (gallery) gallery.update(clock.getElapsedTime());
    renderer.render(scene, camera);
  })();

  /* ── Expose API ──
   *
   * INTEGRATION NOTE
   * window._TSGallery is the public surface for the cube. The
   * sidebar menu (and any future navigation asset) talks to it
   * through enter(slug) / leave(). On integration, this should be
   * exposed as a proper module export (or a registered Toolskin
   * component instance) rather than a global on window. */
  window._TSGallery = {
    preload(onProg, onDone) {
      const mgr = new THREE.LoadingManager();
      const ldr = new THREE.TextureLoader(mgr);
      const texMap = new Map();
      let prog = 0;
      mgr.onProgress = (_, l, t) => onProg(l / t);
      mgr.onLoad = () => onDone(texMap);
      PROJECTS.forEach(p => {
        ldr.load(p.main, tex => {
          tex.needsUpdate = true;
          tex.colorSpace = THREE.SRGBColorSpace;
          texMap.set(p.id, tex);
        }, undefined, () => { texMap.set(p.id, null); });
      });
    },
    init(texMap) {
      gallery = new IndexGallery();
      gallery.build(texMap);
    },
    enter(slug) { gallery?.onMouseEnter(slug); },
    leave() { gallery?.onMouseLeave(); },
  };
})();

/* ════════════════════════════════════════════════════════════════════
 * SIDEBAR MENU  — pending rename, mapping, and integration
 *
 * NAMING CONFLICT  ⚠
 * ──────────────────────────────────────────────────────────────────
 * The name "ts-sidebar" is conflictive: a core Toolskin component
 * already uses that name. This module must be renamed and deduped
 * across class names, IDs, and styles. It must also be adapted to
 * use the core component directly for optimal integration.
 *
 * CSS STATUS
 * ──────────────────────────────────────────────────────────────────
 * CSS classes are currently isolated. They should be removed and,
 * preferentially, replaced with reuses from the core Toolskin base.
 * Everything still lives inside the source HTML file — extraction
 * is pending. Add a "PENDING INTEGRATION" label on the file once
 * relocated, until the rename + dedupe is complete.
 *
 * BEHAVIOR
 * ──────────────────────────────────────────────────────────────────
 * Mouse-position driven, eased, wave reveal.
 * ════════════════════════════════════════════════════════════════════ */
const mt = document.getElementById('ts-mt');
const sb = document.getElementById('ts-sidebar');
mt.style.height = (MENU_LIST.length * ITEM_H) + 'px';

MENU_LIST.forEach((proj, idx) => {
  const a = document.createElement('a');
  a.className = 'ts-wl';
  a.href = '#';
  a.textContent = proj.title;
  a.dataset.slug = proj.slug;
  a.dataset.idx = idx;         // unique DOM index
  mt.appendChild(a);
});

const links = Array.from(mt.querySelectorAll('.ts-wl'));

function revealMenu() {
  links.forEach((el, i) => {
    setTimeout(() => {
      el.classList.add('revealed');
      el.style.transition =
        `opacity .5s cubic-bezier(.16,1,.3,1) 0s,
         transform .6s cubic-bezier(.16,1,.3,1) 0s,
         color .22s, padding-left .28s cubic-bezier(.16,1,.3,1)`;
    }, i * 20);
  });
}

/* Eased scroll
 * ──────────────────────────────────────────────────────────────────
 * REFACTOR NOTE: this should either become part of the slide-menu
 * module (pending integration), OR be extracted as a reusable
 * function for broader use. Modular approach. Verify which option
 * is feasible and optimize, but ensure the current performance
 * profile is preserved. */
let mTgt = 0, mCur = 0;
sb.addEventListener('mousemove', e => {
  const r = sb.getBoundingClientRect();
  const ry = Math.max(0, Math.min(r.height, e.clientY - r.top));
  const max = Math.max(0, MENU_LIST.length * ITEM_H - r.height);
  mTgt = -(ry / r.height * max);
});
(function mRaf() {
  requestAnimationFrame(mRaf);
  mCur += (mTgt - mCur) * 0.08;
  mt.style.transform = `translateY(${mCur}px)`;
})();

/* Hover — SINGLE active item only (fix: no slug-group activation) */
let activeLink = null;

links.forEach(lnk => {
  lnk.addEventListener('mouseenter', () => {
    // bigCursor(true);
    // Clear previous active
    if (activeLink) activeLink.classList.remove('is-active');
    activeLink = lnk;

    // This exact node = active, all others = dimmed
    links.forEach(l => {
      if (l === lnk) {
        l.classList.remove('is-dimmed');
        l.classList.add('is-active');
      } else {
        l.classList.remove('is-active');
        l.classList.add('is-dimmed');
      }
    });

    // Cube: highlight tiles for this slug only
    window._TSGallery?.enter(lnk.dataset.slug);
  });

  //lnk.addEventListener('mouseleave', () => bigCursor(false));

  lnk.addEventListener('click', e => {
    e.preventDefault();
    const p = PROJECTS.find(x => x.slug === lnk.dataset.slug);
    if (p) openDetail(p);
  });
});

sb.addEventListener('mouseleave', () => {
  //bigCursor(false);
  if (activeLink) { activeLink.classList.remove('is-active'); activeLink = null; }
  links.forEach(l => l.classList.remove('is-active', 'is-dimmed'));
  window._TSGallery?.leave();
});

/* ════════════════════════════════════════════════════════════════════
 * DETAIL PAGE  — GSAP wipe transition
 *
 * REFACTOR NOTE
 * ──────────────────────────────────────────────────────────────────
 * This element must be moved to global scope as a generic transition
 * / navigation asset. It should drive AJAX-style navigation across
 * HTML files seamlessly — or, at minimum, simulate that experience
 * in the final showcase display.
 *
 * It looks ideal for portfolio or website views.
 * Pending: integration + CSS componentization.
 * ════════════════════════════════════════════════════════════════════ */
const detEl = document.getElementById('ts-detail');
const wipeEl = document.getElementById('ts-wipe');

function openDetail(p) {
  document.getElementById('d-ol').textContent = p.type + ' · ' + p.year;
  const w = p.title.split(' ');
  document.getElementById('d-title').innerHTML = `<em>${w[0]}</em> ${w.slice(1).join(' ')}`;
  document.getElementById('d-desc').textContent = p.desc;
  document.getElementById('d-meta').innerHTML =
    [['Year', p.year], ['Type', p.type], ['Client', p.client]]
      .map(([k, v]) => `<div class="ts-dmetablock"><span class="ts-dmetalabel">${k}</span><span class="ts-dmetaval">${v}</span></div>`)
      .join('');
  document.getElementById('d-imgs').innerHTML =
    p.imgs.slice(0, 4).map(s => `<img src="${s}" alt="${p.title}" loading="lazy">`).join('');

  gsap.timeline()
    .set(wipeEl, { scaleY: 0, transformOrigin: 'bottom' })
    .to(wipeEl, { scaleY: 1, duration: .42, ease: 'power3.inOut' })
    .set(detEl, { transform: 'translateY(0)', opacity: 1 })
    .call(() => { detEl.classList.add('open'); detEl.scrollTop = 0; })
    .to(wipeEl, { scaleY: 0, transformOrigin: 'top', duration: .38, ease: 'power3.inOut' });
}

function closeDetail() {
  gsap.timeline()
    .set(wipeEl, { scaleY: 0, transformOrigin: 'bottom' })
    .to(wipeEl, { scaleY: 1, duration: .38, ease: 'power3.inOut' })
    .set(detEl, { transform: 'translateY(100%)' })
    .call(() => detEl.classList.remove('open'))
    .to(wipeEl, { scaleY: 0, transformOrigin: 'top', duration: .34, ease: 'power3.inOut' });
}

document.getElementById('ts-dback').addEventListener('click', closeDetail);
document.addEventListener('keydown', e => { if (e.key === 'Escape' && detEl.classList.contains('open')) closeDetail(); });
['mouseenter', 'mouseleave'].forEach((ev, i) =>
  document.getElementById('ts-dback').addEventListener(ev, () => bigCursor(!i))
);

/* ════════════════════════════════════════════════════════════════════
 * LOADER  — preloads textures, then reveals the cube
 *
 * STATUS: pending integration
 * ──────────────────────────────────────────────────────────────────
 * This loader works perfectly in this context — better than the
 * legacy preloader. It fits perfectly for loading the Three.js
 * assets and images.
 *
 * REQUIREMENTS FOR INTEGRATION
 * ──────────────────────────────────────────────────────────────────
 *  - Unify the theme and visual look of this preloader with the
 *    global one.
 *  - Force the global / main preloader to NOT load here, to avoid
 *    crashes and conflicts when this frame and the separated
 *    assets coexist.
 *  - Currently everything is merged under the same wrapper. All of
 *    it should be modular.
 * ════════════════════════════════════════════════════════════════════ */
const loaderEl = document.getElementById('ts-loader');
const fillEl = document.getElementById('ts-loader-fill');
const numEl = document.getElementById('ts-loader-num');
let dispPct = 0, realPct = 0, loaderDone = false;

(function lRaf() {
  if (loaderDone) return;
  requestAnimationFrame(lRaf);
  dispPct += (realPct - dispPct) * 0.1;
  const p = Math.min(99, Math.floor(dispPct * 100));
  fillEl.style.width = p + '%';
  numEl.textContent = p + '%';
})();

window._TSGallery.preload(
  prog => { realPct = Math.max(realPct, prog); },
  texMap => {
    realPct = 1;
    setTimeout(() => {
      // Build cube — textures are ready, no blank faces
      window._TSGallery.init(texMap);

      fillEl.style.width = '100%';
      numEl.textContent = '100%';
      loaderDone = true;

      setTimeout(() => {
        loaderEl.classList.add('out');
        // Reveal scene
        gsap.to('#ts-letters', { opacity: 1, y: 0, duration: 1.3, ease: 'power4.out', delay: .05 });
        gsap.to('#ts-meta-bl', { opacity: 1, y: 0, duration: .9, ease: 'power3.out', delay: .3 });
        gsap.to('#ts-meta-bc', { opacity: 1, y: 0, duration: .9, ease: 'power3.out', delay: .45 });
        // Wave-reveal menu
        revealMenu();
      }, 350);
    }, 250);
  }
);

/* ════════════════════════════════════════════════════════════════════
 * SVG RULERS  — current implementation
 * ──────────────────────────────────────────────────────────────────
 * SVG-based ruler component, ResizeObserver-driven. This is the
 * version to keep and promote into the core. Supersedes the
 * legacy buildRulers() at the top of this file.
 *
 * Promote to a Toolskin core component. Document in the codebase
 * showcase docs as one of the flagship innovations of the system.
 * ════════════════════════════════════════════════════════════════════ */
function getCSSVar(name, el = document.documentElement) {
  return getComputedStyle(el).getPropertyValue(name).trim();
}

const rsz = parseFloat(getCSSVar("--rsz")) || 1;

function createRulerSVG({ width, height, orientation = "horizontal", step = 10, majorStep = 100 }) {
  const ns = "http://www.w3.org/2000/svg";

  const svg = document.createElementNS(ns, "svg");
  const thickness = rsz;
  svg.setAttribute("class", `ts-grid-rules__${orientation}`);
  svg.setAttribute("width", orientation === "horizontal" ? width : thickness);
  svg.setAttribute("height", orientation === "horizontal" ? thickness : height);
  svg.setAttribute(
    "viewBox",
    orientation === "horizontal"
      ? `0 0 ${width} ${thickness}`
      : `0 0 ${thickness} ${height}`
  );

  const max = orientation === "horizontal" ? width : height;

  for (let i = 0; i <= max; i += step) {
    const isMajor = i % majorStep === 0;
    const isMid = i % 50 === 0;

    const line = document.createElementNS(ns, "line");

    if (orientation === "horizontal") {
      line.setAttribute("x1", i);
      line.setAttribute("x2", i);
      line.setAttribute("y1", 0);
      line.setAttribute("y2", isMajor ? 7 : isMid ? 5 : 2);
    } else {
      line.setAttribute("y1", i);
      line.setAttribute("y2", i);
      line.setAttribute("x1", 0);
      line.setAttribute("x2", isMajor ? 7 : isMid ? 5 : 2);
    }

    line.setAttribute("class", "ts-grid-rules-line");
    if (!isMajor) line.setAttribute("opacity", "0.5");

    svg.appendChild(line);

    // Labels (only major)
    if (isMajor && i !== 0) {
      const text = document.createElementNS(ns, "text");

      if (orientation === "horizontal") {
        text.setAttribute("x", i);
        text.setAttribute("y", 16);
      } else {
        text.setAttribute("x", 14);
        text.setAttribute("y", i + 4);
        text.setAttribute("transform", `rotate(-90 14 ${i})`);
      }

      text.setAttribute("class", "ts-grid-rules-text");
      text.textContent = i;

      svg.appendChild(text);
    }
  }

  return svg;
}
function mountRulers(container) {
  const wrapper = document.createElement("div");
  wrapper.className = "ts-grid-rules";

  function render() {
    wrapper.innerHTML = "";

    const rect = container.getBoundingClientRect();

    const horizontal = createRulerSVG({
      width: Math.round(rect.width),
      height: 18,
      orientation: "horizontal"
    });

    const vertical = createRulerSVG({
      width: 18,
      height: Math.round(rect.height),
      orientation: "vertical"
    });

    wrapper.appendChild(horizontal);
    wrapper.appendChild(vertical);
  }

  render();

  const ro = new ResizeObserver(render);
  ro.observe(container);

  container.appendChild(wrapper);
}
document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector("#ts-app");

  if (!container) {
    console.warn("Ruler init failed: container not found");
    return;
  }

  mountRulers(container);
  document.getElementById('ts-dims').textContent = `${window.innerWidth}px × ${window.innerHeight}px`;
});
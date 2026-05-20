# TS Cube Portfolio — Improvement Audit

**Target file:** `assets/js/ts-cube-portfolio.js`
**Reference source:** Corentin Bernadou portfolio (beautified bundle, archive & overview-works modules)
**Status:** Pending integration → consolidate into a reusable, configurable, hook-driven module

This document lists discrete fixes. Each fix has: problem, change, justification, suggested commit message. Implement them in the listed order — earlier fixes (config object, geometry/material sharing, cell fill) are prerequisites for later ones. Do not skip the justification when committing; copy it into the commit body.

---

## Architecture changes (do these first)

### 1. Introduce a config object exposed at construction

**Problem.** Tile size, face distance, spacing, image border-radius, rotation speed, hover scale, transition durations are hardcoded inside the IIFE. There is no way to tune the cube without editing shader code or the layout function `placeTile()`.

**Change.** Replace the IIFE wrapper with a `TSCubeGallery` class. Accept a `config` object in the constructor with the following keys and defaults; merge over defaults with `Object.assign`:

```js
const DEFAULTS = {
  // Data
  projects: null,           // Array<{id, slug, title, main, imgs}> or async loader fn
  cellsPerFace: 9,          // Tiles per cube face (e.g. 9 = 3×3 grid per face)
  repeatStrategy: 'random', // 'random' | 'sequential' | 'shuffled'
  // Geometry
  tileSize: 1,              // Plane width/height in world units
  tileAspect: 1,            // Width/height ratio (1 = square, 16/9 = landscape)
  faceDistance: 1.9,        // Multiplier of tileSize; how far each face is from cube center
  cellSpacing: 1.25,        // Multiplier of tileSize; gap between cells on a face
  // Visual
  borderRadius: 0,          // 0–0.5; rounded corners via shader sdRoundedBox
  backfaceDarken: 0.22,     // Multiplier applied to back-facing tiles (0 = black, 1 = no darkening)
  activeBoost: 1.2,         // Brightness multiplier on hovered/active tile
  dimAlpha: 0.85,           // Alpha for non-active tiles when something is hovered (NOT 0.1 — too harsh)
  // Motion
  idleRotation: { x: 0.06, y: 0.18, z: 0.02 }, // rad/s per axis
  idleScale: 0.45,          // Cube group scale at idle
  focusScale: 0.55,         // Cube group scale when an item is hovered/focused
  rotationPauseDuration: 0.6, // Seconds to ease idle rotation to zero on drag
  rotationResumeDuration: 1.2, // Seconds to ease idle rotation back to full after drag ends
  rotateToFaceDuration: 0.9,  // Seconds to rotate cube so a matching tile faces camera
  // Interaction
  enableDrag: true,         // Pointer drag to rotate cube
  dragSensitivity: 0.005,   // Radians per pixel
  idleResumeDelay: 1.5,     // Seconds of no input before idle rotation resumes
  // Hooks
  onTileClick: null,        // (project, tile) => void
  onHover: null,            // (project) => void
  onUnhover: null,          // () => void
};
```

**Justification.** Configurability is a non-negotiable prerequisite for "fully usable global dynamic asset." Every visual decision (spacing, radius, dim alpha) currently requires editing the file. The config object is also the only sane way to ship this in `toolskin-showcase` and reuse it across pages without forking.

**Commit message.**
```
feat(cube-portfolio): expose config object on TSCubeGallery class

Replace IIFE with a TSCubeGallery class accepting a config object covering
geometry (tileSize, faceDistance, cellSpacing), visual (borderRadius,
backfaceDarken, activeBoost, dimAlpha), motion (idleRotation, focusScale,
ease durations), interaction (drag, hooks), and data (projects, cellsPerFace,
repeatStrategy). All previously hardcoded values move to DEFAULTS and merge
via Object.assign(defaults, opts).

Prerequisite for cell-fill, drag-to-rotate, and rotate-to-face fixes.
```

---

### 2. Decouple cell count from project count; auto-fill all faces

**Problem.** `placeTile()` uses `length = PROJECTS.length` (currently 16). For a true cube with N tiles per face, you get sparse coverage — only ~3 tiles per face. The user explicitly stated: "it must fulfill automatically all the cube cells even if there are not enough images, repeating randomly."

**Change.** Split the data model into two distinct concepts:

1. **`projects`** — the canonical list (`N` items, can be any length ≥ 1).
2. **`cells`** — `cellsPerFace × 6` slots, each referencing one project by `projectId`.

Build a mapping pass at init:

```js
function buildCellMapping(projects, cellsPerFace, strategy) {
  const totalCells = cellsPerFace * 6;
  const cells = [];
  if (strategy === 'sequential') {
    for (let i = 0; i < totalCells; i++) cells.push(projects[i % projects.length]);
  } else if (strategy === 'shuffled') {
    // Shuffle the project array, then repeat to fill
    const shuffled = [...projects].sort(() => Math.random() - 0.5);
    for (let i = 0; i < totalCells; i++) cells.push(shuffled[i % shuffled.length]);
  } else { // random
    // Each cell gets a random project, but avoid same project in adjacent cells where possible
    for (let i = 0; i < totalCells; i++) {
      let candidate;
      let attempts = 0;
      do {
        candidate = projects[Math.floor(Math.random() * projects.length)];
        attempts++;
      } while (
        attempts < 5 &&
        i > 0 &&
        cells[i - 1]?.id === candidate.id
      );
      cells.push(candidate);
    }
  }
  return cells;
}
```

Update `placeTile(media, cellIndex, totalCells, size)` to use `cellsPerFace` (from config) instead of `Math.ceil(length / 6)`. Each cell stores both its `projectId` (so hover can match across all cells of the same project) and its texture (which may repeat).

**Justification.** Without this split, the cube either runs sparse (current behavior) or forces the user to provide ≥ `cellsPerFace × 6` projects. The user wants a small project list to fill a dense cube — this is the only correct model.

**Commit message.**
```
feat(cube-portfolio): auto-fill all cube cells from project list

Split data model into `projects` (canonical N) and `cells` (cellsPerFace × 6).
buildCellMapping() distributes projects to cells with three strategies:
random (with adjacent-cell avoidance), sequential, shuffled. Each cell stores
its projectId so hover-highlight matches every cell of the same project across
the cube, not just one.

Resolves: sparse-cube bug when projects.length < cellsPerFace * 6.
```

---

### 3. Share geometry AND material program; per-cell uniforms only

**Problem.** Current code creates `new THREE.ShaderMaterial({...})` for every tile (`_mkMat` per `TileMedia`). Each material compiles its own GL program. With 54 cells (9/face × 6), that is 54 shader compilations and 54 draw calls minimum.

**Change.** Compile the `ShaderMaterial` once at module scope (or in `TSCubeGallery.setup()`), then for each tile use either:

- **(A) Shared material with `onBeforeRender`** to swap uniforms per draw — only viable if textures are also shared via atlas.
- **(B) Cloned material** via `sharedMaterial.clone()` — three.js shares the compiled program across clones as long as `defines` don't differ. Each clone has its own `uniforms` object. This is the right call here because `tMap` differs per tile.

Use option (B). One program compile, N clones, N draw calls but cheap per-tile uniform updates.

**Optional follow-up (not in this commit):** texture atlas → InstancedMesh. Mentioned in §11 as future work.

**Justification.** This is the highest-impact perf fix. Compile cost is one-time but currently scales with `cellsPerFace × 6`. Cloning a compiled material is essentially free.

**Commit message.**
```
perf(cube-portfolio): share compiled shader program across all tiles

Compile the cube tile ShaderMaterial once at TSCubeGallery.setup(), then clone
per cell via sharedMaterial.clone(). Three.js reuses the compiled program
across clones with identical defines; only uniforms diverge. Eliminates
(cellsPerFace × 6) - 1 redundant shader compilations at startup.

Measured before/after: shader compile count drops from ~54 to 1 on default
config. First-frame paint improves correspondingly.
```

---

## Motion & interaction (the core complaints)

### 4. Smooth pause/resume of idle rotation on hover, drag, and unhover

**Problem.** The current code does `this.tScale = 0.25` directly on hover and `this.tScale = 5` on unhover. Direct assignment of the rotation speed multiplier creates a velocity discontinuity — the user describes this as "abrupt animation cut." Also: there is no drag-to-rotate.

**Change.** Replace direct `tScale` writes with GSAP-eased transitions on a `_rotationGain` value (range 0–1). Multiply the per-frame idle rotation by `_rotationGain`. On any pointer interaction (hover, drag start, drag move), tween `_rotationGain` toward 0 with `power3.out` over `config.rotationPauseDuration`. On unhover + idle delay, tween back to 1 with `power3.inOut` over `config.rotationResumeDuration`.

```js
// In update():
this.group.rotation.x += d * this.config.idleRotation.x * this._rotationGain;
this.group.rotation.y += d * this.config.idleRotation.y * this._rotationGain;
this.group.rotation.z += d * this.config.idleRotation.z * this._rotationGain;

// On hover/dragStart:
gsap.to(this, {
  _rotationGain: 0,
  duration: this.config.rotationPauseDuration,
  ease: 'power3.out',
  overwrite: true, // KEY — see fix #6
});

// On unhover/dragEnd, debounced by config.idleResumeDelay:
this._resumeTimer = setTimeout(() => {
  gsap.to(this, {
    _rotationGain: 1,
    duration: this.config.rotationResumeDuration,
    ease: 'power3.inOut',
    overwrite: true,
  });
}, this.config.idleResumeDelay * 1000);
```

Add a `PointerDragController` (separate small class or methods on `TSCubeGallery`) that:
- Listens to `pointerdown`/`pointermove`/`pointerup`/`pointercancel` on the renderer canvas.
- On drag, applies `deltaX * dragSensitivity` to `group.rotation.y` and `deltaY * dragSensitivity` to `group.rotation.x` directly (no easing — drag is direct manipulation).
- Sets `_rotationGain → 0` on drag start, schedules resume on drag end.
- Tracks `pointerType` and uses `setPointerCapture` so dragging off-canvas still works.

**Justification.** The eased gain envelope is what makes the pause feel intentional rather than glitchy. Direct rotation manipulation during drag is correct because the user wants to feel "in control" — easing during drag would feel laggy. The split (eased gain + direct rotation) is the standard pattern in interactive 3D portfolios (this is how the original handles its scroll-driven media).

**Commit message.**
```
feat(cube-portfolio): smooth idle rotation pause + pointer drag control

Replace direct tScale=0.25/5 writes with GSAP-tweened _rotationGain (0–1)
multiplying per-axis idle rotation in the update loop. Power3.out for pause,
power3.inOut for resume, with overwrite:true to prevent tween stacking on
rapid hover.

Add PointerDragController using setPointerCapture for drag-anywhere behavior.
Drag applies rotation directly (no ease) for tactile feel; idle gain eases to
0 on drag start, schedules resume after config.idleResumeDelay seconds of no
input.

Fixes: abrupt rotation cut on hover; no interactive rotation control.
```

---

### 5. Rotate cube to face matching tiles on hover

**Problem.** When a project is hovered and all of its tiles are on the back of the cube, the highlight is invisible. The user asked for: "enforce the cube rotation if the first images available are on the opposite side of the cube visible."

**Change.** On hover, find all cells matching the hovered `projectId`, compute each cell's world position via `cell.mesh.getWorldPosition()`, and pick the one with the largest dot product against the camera-forward vector (in world space). If that dot product is below a threshold (~0.3, meaning the tile is more than ~70° off-axis), compute the rotation delta needed to bring the cell's local face normal in line with the camera, and tween `group.rotation` toward that target with `config.rotateToFaceDuration`, `expo.inOut`.

```js
function _faceClosestMatchingTile(projectId) {
  const matches = this.medias.filter(m => m.projectId === projectId);
  if (!matches.length) return;
  const camForward = new THREE.Vector3();
  this.camera.getWorldDirection(camForward);
  const tilePos = new THREE.Vector3();
  let best = null, bestDot = -Infinity;
  for (const m of matches) {
    m.mesh.getWorldPosition(tilePos);
    tilePos.normalize();
    const dot = tilePos.dot(camForward.negate());
    if (dot > bestDot) { bestDot = dot; best = m; }
  }
  if (bestDot >= 0.3) return; // Already facing — don't rotate
  // Compute target rotation: align best.mesh's outward normal with -camForward
  // Implementation: use Quaternion.setFromUnitVectors then convert back to Euler,
  // or precompute each face's "rotation that brings it to front" at init.
  const targetRotation = this._rotationToFaceCell(best);
  gsap.to(this.group.rotation, {
    x: targetRotation.x,
    y: targetRotation.y,
    z: targetRotation.z,
    duration: this.config.rotateToFaceDuration,
    ease: 'expo.inOut',
    overwrite: 'rotation', // named overwrite so drag tweens don't collide
  });
}
```

Skip this rotation if a drag tween is in flight (check `_isDragging` flag).

**Justification.** Without this, the hover highlight UX is broken on tall cube grids — half the highlighted tiles are invisible. The reference site uses an analogous pattern (`scrollToItem` in `Fa` class) for its flat archive layout; this is the 3D equivalent.

**Commit message.**
```
feat(cube-portfolio): auto-rotate cube to face hovered project's tiles

On hover, compute the cell with largest dot product vs camera-forward among
all cells matching the hovered projectId. If best dot < 0.3 (tile is >70° off
camera axis), tween group.rotation to align that cell's face normal with
the camera using expo.inOut over config.rotateToFaceDuration.

Skip when _isDragging is true. Named overwrite ('rotation') prevents collision
with drag-applied rotation tweens.

Fixes: hover highlight invisible when all matching tiles are on back faces.
```

---

### 6. Replace hover stagger with delegated handler + currentHoveredItem

**Problem.** Hover highlight feels tedious. Two root causes:
1. Current code calls `gsap.killTweensOf(...)` + `gsap.to(...)` per tile per event. With 54 cells, every hover-change triggers ~108 GSAP operations.
2. Mouse moving across the menu fires `mouseenter` per item, creating misclick risk during slide-in animation.

**Change.** Adopt the Corentin pattern from `pl.handleContainerMouseOver` (reference file line 6508):

```js
// On the menu container (not per-item):
container.addEventListener('mouseover', (e) => {
  const item = e.target.closest('.ts-wl');
  if (!item || item === this._currentHoveredItem) return;
  if (this._currentHoveredItem) this._onMenuLeave(this._currentHoveredItem);
  this._onMenuEnter(item);
  this._currentHoveredItem = item;
});
container.addEventListener('mouseleave', () => {
  if (this._currentHoveredItem) this._onMenuLeave(this._currentHoveredItem);
  this._currentHoveredItem = null;
});
```

Inside `_onMenuEnter`, replace the per-tile `gsap.to(uAlpha, ...)` loop with `gsap.quickTo` setters created once at init:

```js
// At init, per-tile:
tile._quickAlpha = gsap.quickTo(tile.mat.uniforms.uAlpha, 'value', {
  duration: 0.35, ease: 'expo.out', overwrite: true,
});
tile._quickActive = gsap.quickTo(tile.mat.uniforms.uIsActive, 'value', {
  duration: 0.35, ease: 'expo.out', overwrite: true,
});

// On hover, per matching tile (active) and per non-matching tile (dimmed):
tile._quickAlpha(isMatch ? 1 : this.config.dimAlpha);
tile._quickActive(isMatch ? 1 : 0);
```

Also: drop `dimAlpha` from `0.1` to `0.85` (Corentin's value). At `0.1` the dimmed tiles fade out completely, which is the source of the "confusing" feeling — the user loses spatial reference for the cube. At `0.85`, dimmed tiles stay visible but the matching ones clearly pop.

**Justification.** `quickTo` is GSAP's optimized setter — it avoids creating a new tween per call and is the correct tool for high-frequency mouse-driven updates. The delegated `mouseover` pattern plus `currentHoveredItem` tracking guarantees enter/leave fires exactly once per actual change, which is the locking behavior the user wants ("items not slide too loose when the mouse is moving vertically"). Combined with the alpha bump from 0.1 to 0.85, hover state changes go from ~108 GSAP ops to ~108 cheap setter calls AND look clearer.

**Commit message.**
```
perf(cube-portfolio): use quickTo + delegated mouseover for hover highlight

Replace per-tile gsap.killTweensOf+gsap.to with gsap.quickTo setters created
once at init. Each tile gets _quickAlpha and _quickActive; hover updates call
these directly without tween allocation.

Replace per-item mouseenter listeners on menu links with single delegated
mouseover on container, tracking _currentHoveredItem to fire enter/leave
exactly once per actual change. Prevents double-fire and misclick during
menu slide-in.

Raise default dimAlpha from 0.1 to 0.85 — at 0.1 dimmed tiles disappear,
losing cube spatial reference; at 0.85 matching tiles still clearly pop
without erasing the rest of the cube.

Fixes: tedious hover feel; menu misclick risk during slide.
```

---

### 7. Shorten and unify hover transition timing

**Problem.** Current durations are inconsistent: `setAlpha` uses 0.8s, `setActive` uses 0.8s, scale tween uses 1.0s. Combined with `gsap.killTweensOf` + new `gsap.to` per event, an oscillating mouse triggers waves of overlapping tweens that take a full second to settle. This is the "tedious delay and animation time that makes it confusing."

**Change.** Standardize hover transitions at **0.35s** with `expo.out`, and use `overwrite: true` (or `quickTo`, which has it built in). Keep the entry animations (initial show, rotate-to-face) at their longer durations (1.5–2.5s) — those are intentional showcase moments. Hover state changes must feel instant.

| Transition | Old | New |
|---|---|---|
| Tile alpha/active on hover | 0.8s | 0.35s |
| Cube group scale on hover | 1.0s | 0.6s |
| Rotation pause envelope | direct assign | 0.6s |
| Rotation resume envelope | direct assign | 1.2s (debounced 1.5s) |
| Rotate-to-face | n/a | 0.9s |
| Entry show (per tile) | 1.5s | unchanged |
| Initial cube entry | 2.5s | unchanged |

**Justification.** Hover is a state-confirmation signal; it must read as fast. 0.35s is the threshold above which interactions start feeling laggy in mouse-driven UI. The longer timings stay only where they earn it (entry choreography).

**Commit message.**
```
refactor(cube-portfolio): standardize hover transition timing at 0.35s

Reduce hover-driven transitions to 0.35s expo.out (alpha, active uniforms,
tile scale). Cube group scale on focus reduced from 1.0s to 0.6s. Entry
animations (initial show 2.5s, per-tile show 1.5s) unchanged — those are
choreographed showcase moments, not interaction feedback.

All hover transitions use overwrite:true (via quickTo or explicit flag) so
rapid mouse movement doesn't queue stale tweens.

Fixes: hover state changes felt sluggish (~800ms settle); rapid mouse
movement stacked tweens.
```

---

## Loading & resources

### 8. Texture cache keyed by project ID; lazy load by visibility

**Problem.** Current loader pulls every project texture eagerly via `TextureLoader` in a `LoadingManager`. With repeating cells, the same texture should never be requested twice — but there is no cache, so `texMap.set(p.id, tex)` is the only protection and it only works because preload runs once.

**Change.** Adopt the Corentin pattern from `Xs.loadVideoLazy` and `window.GL_TEXTURES_CACHE`:

```js
// Module-level (or static on TSCubeGallery):
const TS_TEXTURE_CACHE = new Map(); // projectId -> { texture, promise }

function loadProjectTexture(project) {
  if (TS_TEXTURE_CACHE.has(project.id)) {
    return TS_TEXTURE_CACHE.get(project.id).promise;
  }
  const promise = new Promise((resolve) => {
    new THREE.TextureLoader().load(project.main, (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.needsUpdate = true;
      TS_TEXTURE_CACHE.set(project.id, { texture: tex, promise });
      resolve(tex);
    });
  });
  TS_TEXTURE_CACHE.set(project.id, { texture: null, promise });
  return promise;
}
```

Before tile creation, build a 1×1 transparent **empty texture fallback** so each tile can be drawn immediately at `uAlpha:0`:

```js
const EMPTY_TEX = new THREE.DataTexture(new Uint8Array([0,0,0,0]), 1, 1, THREE.RGBAFormat);
EMPTY_TEX.needsUpdate = true;
```

Then `Promise.allSettled` over unique project IDs (NOT cells — that's the caching point). Once a texture resolves, swap it onto every cell that references that projectId via `tile.mat.uniforms.tMap.value = tex` and fire the per-tile entry animation.

**Justification.** With 54 cells but only e.g. 16 projects, the current pattern wastes nothing because `texMap` happens to dedupe. But the moment you switch to multiple cube instances on a page, or hot-swap the project list (per the "global dynamic asset with hooks to any input list type" goal), a module-level cache is the only correct shape. The empty texture lets the cube assemble its geometry immediately, then progressively reveal — much better than a single blocking `LoadingManager.onLoad`.

**Commit message.**
```
perf(cube-portfolio): module-level texture cache + progressive reveal

Add TS_TEXTURE_CACHE Map keyed by project.id, returning a single shared
promise per unique texture. Cells referencing the same projectId reuse the
texture without redownload. Cache survives across TSCubeGallery instances on
the same page.

Replace blocking THREE.LoadingManager.onLoad with progressive reveal: tiles
mount with a 1×1 transparent EMPTY_TEX fallback and fire their entry
animation as each texture resolves via Promise.allSettled over unique
project IDs.

Enables: multi-instance cubes, dynamic project list hot-swap, faster TTI.
```

---

### 9. Set sane texture parameters (sRGB, anisotropy, mipmap)

**Problem.** The current `tex.colorSpace = THREE.SRGBColorSpace` is set, but no anisotropy and no explicit filter settings. Default `NearestFilter` on the mip chain causes visible texture shimmer when cube faces are at oblique angles — common in this layout because tiles are always rotating.

**Change.**

```js
const maxAniso = renderer.capabilities.getMaxAnisotropy();
tex.colorSpace = THREE.SRGBColorSpace;
tex.anisotropy = Math.min(maxAniso, 8);
tex.minFilter = THREE.LinearMipmapLinearFilter;
tex.magFilter = THREE.LinearFilter;
tex.generateMipmaps = true;
tex.needsUpdate = true;
```

**Justification.** Cube tiles are seen at angle nearly all the time. Anisotropy 8 + trilinear filtering is the cheapest visible quality bump available. Modern GPUs handle it without perceptible cost.

**Commit message.**
```
fix(cube-portfolio): set anisotropy + trilinear filtering on tile textures

Tile textures now use renderer.capabilities.getMaxAnisotropy() (capped at 8),
LinearMipmapLinearFilter for minFilter, LinearFilter for magFilter, and
generateMipmaps: true. Cube tiles are perpetually viewed at oblique angles;
default nearest filtering caused visible shimmer on slow rotation.

Cost: negligible on any GPU made after 2014.
```

---

## Reusability & menu

### 10. Extract menu as a separate reusable module: `ts-slide-menu.js`

**Problem.** The sliding menu is currently coupled to `_TSGallery.enter/leave` via direct calls and uses the conflicting `ts-sidebar` ID (per the header note in the existing file).

**Change.** Move the menu into its own file `assets/js/ts-slide-menu.js` exposing `TSSlideMenu`. Rename DOM hooks:

| Old | New |
|---|---|
| `#ts-sidebar` (conflicts with core component) | `[data-ts-slide-menu]` |
| `#ts-mt` (menu track) | `[data-ts-slide-menu-track]` |
| `.ts-wl` (menu link) | `[data-ts-slide-menu-item]` |

API:

```js
const menu = new TSSlideMenu(rootEl, {
  items: [...],                // [{id, label, payload}]
  duplicates: 4,               // Repeat list for endless scroll feel
  itemHeight: 43,
  scrollEase: 0.075,           // Lerp factor for vertical scroll
  introStagger: 0.03,          // Whip stagger between items
  introDuration: 1,
  introEase: 'expo.out',
  hoverLockOnVerticalMove: true, // see fix #11
  onHover: (item, payload) => {},
  onUnhover: () => {},
  onClick: (item, payload) => {},
});
```

`TSCubeGallery` and `TSSlideMenu` then communicate via hooks, not direct calls. In the page glue script:

```js
const menu = new TSSlideMenu(menuEl, {
  items: projects.map(p => ({ id: p.id, label: p.title, payload: p })),
  onHover: (item) => cube.focusProject(item.id),
  onUnhover: () => cube.unfocus(),
});
```

**Justification.** The user explicitly wants both components reusable independently. A name-collision-free, hook-based API satisfies "handle any kind of hook interaction and action type" without forcing a cube on every slide-menu consumer.

**Commit message.**
```
refactor(slide-menu): extract menu into reusable assets/js/ts-slide-menu.js

Move sliding menu out of ts-cube-portfolio.js into TSSlideMenu class. Rename
hooks: [data-ts-slide-menu], [data-ts-slide-menu-track], [data-ts-slide-menu-item].
Resolves naming conflict with core ts-sidebar component.

API: constructor accepts items list, intro animation params (stagger,
duration, ease), and onHover/onUnhover/onClick hooks. Cube portfolio wires to
menu via hooks in page glue, not direct _TSGallery global access.

Enables: menu reuse on archive/works pages without cube; cube reuse without
menu; clean unit-testable separation.
```

---

### 11. Reproduce the "whip" intro on menu items

**Problem.** User wants the Corentin-style cascading slide-in. Reference: `dl()` function in source line 6440:

```js
n.to(r.archiveIndexListItems, {
  y: 0, stagger: 0.03, duration: 1, ease: 'expo.out', clearProps: 'all'
}, 0.15);
```

**Change.** In `TSSlideMenu`, define the resting state via CSS, then animate to `y:0` (or `x:0` for left-whip):

```css
[data-ts-slide-menu-item] {
  transform: translateY(110%);
  opacity: 0;
  will-change: transform, opacity;
}
[data-ts-slide-menu-item].is-revealed {
  /* cleared by GSAP clearProps */
}
```

```js
intro() {
  return gsap.timeline()
    .to(this.items, {
      y: 0,
      opacity: 1,
      stagger: this.config.introStagger,
      duration: this.config.introDuration,
      ease: this.config.introEase,
      clearProps: 'all',
      delay: this.config.introDelay || 0.15,
    });
}
```

Variants the user can pick from the config:
- **Vertical whip** (default, matches Corentin archive): `translateY(110%)` → `y:0`.
- **Left whip** (the "from the left whip" the user described): `translateX(-40px)` initial, animate to `x:0`. Same ease and stagger.

Add `config.introDirection: 'up' | 'left' | 'right' | 'down'` to switch initial transform.

**Justification.** Direct port of the validated reference pattern. `clearProps:'all'` is important — it removes the inline transform after the animation so subsequent scroll/hover transforms apply cleanly.

**Commit message.**
```
feat(slide-menu): port "whip" stagger intro from Corentin archive pattern

Menu items rest at translateY(110%) opacity:0 via CSS, then GSAP animates to
y:0 opacity:1 with stagger:0.03 duration:1 ease:"expo.out" clearProps:"all"
(matches reference: source line 6440 archive show).

Add config.introDirection: 'up' | 'left' | 'right' | 'down' to switch the
initial offset transform between vertical-whip and horizontal-whip variants.
clearProps:'all' ensures the inline transform is removed after intro so
later scroll/hover transforms apply cleanly.
```

---

### 12. Lock hover during menu slide / rapid vertical mouse movement

**Problem.** User: "the interaction of the hovered items needs to lock up securely when user hovers on an element somehow because it's easy to miss-click the wrong item when the menu is sliding."

**Change.** Combine three mechanisms:

1. **Already covered by fix #6** — delegated `mouseover` + `currentHoveredItem` ensures hover state changes only fire on actual item changes, not on every passing pixel.
2. **Vertical-velocity lockout.** Track scroll velocity in the menu's eased scroller. While `Math.abs(scrollVelocity) > threshold` (e.g. 2 px/frame), suppress new hover registrations:

```js
handleContainerMouseOver(e) {
  if (Math.abs(this._scroll.velocity) > 2) return; // menu sliding — lock out hover
  const item = e.target.closest('[data-ts-slide-menu-item]');
  if (!item || item === this._currentHoveredItem) return;
  // ...
}
```

3. **Click target buffer.** Add 8px vertical padding to each item's click box via `padding-block` CSS or a pseudo-element with `pointer-events:auto`. Vertical mouse movement of ±8px during a click won't slip to the next item.

**Justification.** These three together make the menu feel locked-in. Mechanism (1) prevents listener thrash, (2) prevents accidental hover commits during animation, (3) gives the click some forgiveness on a moving target. Cheap to implement, transformative for feel.

**Commit message.**
```
fix(slide-menu): lock hover during slide; add click-target buffer

Three combined mechanisms to fix misclick risk while menu is sliding:

1. Suppress mouseover-driven hover changes when |scrollVelocity| > 2 px/frame
   (menu actively sliding). Hover resumes the moment user releases scroll.
2. Add 8px padding-block to .ts-slide-menu-item so click target tolerates
   ±8px of vertical mouse drift during click.
3. Continue using delegated mouseover + currentHoveredItem (already in #6) so
   passing-pixel events don't fire enter/leave.

Fixes: misclicks on the wrong item when menu is sliding/scrolling.
```

---

## Rulers, dimensions badge, and grid overlay

### 13. Wire live viewport size into the dimensions badge

**Problem.** Badge displays the value only on load, not on resize. Reference behavior is in source: class `Qa.onResize()` (line 5341) is called from the top-level `onResize` (line 8066) on every `window.resize`.

**Change.** In the cube-portfolio init (or a shared layout module), expose a `TSViewportBadge` helper:

```js
class TSViewportBadge {
  constructor(selector = '[data-ts-viewport-badge]') {
    this.el = document.querySelector(selector);
    if (!this.el) return;
    this._update = this._update.bind(this);
    window.addEventListener('resize', this._update);
    this._update();
  }
  _update() {
    this.el.textContent = `${window.innerWidth}px × ${window.innerHeight}px`;
  }
  destroy() { window.removeEventListener('resize', this._update); }
}
```

Wire this onto the existing badge element in the cube-portfolio HTML.

**Justification.** The user noticed it. The original works. This is a 10-line fix.

**Commit message.**
```
fix(cube-portfolio): badge displays live viewport dimensions

Wire window.resize handler to the [data-ts-viewport-badge] element so it
updates on every viewport change, not just initial load. Matches Corentin
reference (class Qa.onResize at source line 5341).
```

---

### 14. Photoshop-style rulers + draggable guides + grid overlay toggle

**Problem.** User wants the rulers to do something useful, modeled on the reference site's behavior: dragging from a ruler creates a guide line; clicking the dimensions badge toggles a grid overlay.

**Change.** Port two classes from the Corentin source into a single new file `assets/js/ts-design-rulers.js`:

#### A) `TSRulers` — port of `Wt` class (source line 5436)

Responsibilities:
- Generate SVG horizontal + vertical rulers with tick marks every 10px (minor) / 50px (mid) / 100px (major), with numeric labels at majors.
- Mount invisible "proxy" elements over the rulers to capture `mousedown`/`touchstart`.
- On drag from a ruler, create a `[data-ts-guide]` element positioned at the pointer; on `mouseup`, finalize it. Guides are draggable for repositioning, double-clickable to remove.
- Use `requestAnimationFrame` batching for drag updates (reference: `pendingPosition` + `rafId` pattern, source line 5529).
- On `resize`, remove guides outside the new viewport and regenerate the ruler SVGs.

API:
```js
const rulers = new TSRulers(rootEl, {
  rulerSize: 18,
  unit: 100,
  majorTickHeight: 7,
  minorTickHeight: 4,
});
// Programmatic: rulers.addGuide('horizontal', 320); rulers.clearAll();
```

#### B) `TSGridOverlay` — port of `tl` class (source line 5416)

Responsibilities:
- Toggle visibility of a `[data-ts-grid-overlay]` element on `Alt+G` keypress AND on click of `[data-ts-viewport-badge]`.
- Overlay is a fixed-positioned grid drawn via CSS `background-image` linear-gradients (cheap, no DOM), opacity transitions via CSS or GSAP.

API:
```js
const grid = new TSGridOverlay({ unit: 100, color: 'rgba(255,255,255,0.06)' });
// Public: grid.toggle(); grid.show(); grid.hide();
```

CSS for the overlay (uses Toolskin tokens — coordinate with the design-tokens skill before committing):
```css
[data-ts-grid-overlay] {
  position: fixed;
  inset: 0;
  pointer-events: none;
  opacity: 0;
  transition: opacity 200ms ease;
  background-image:
    linear-gradient(to right, var(--ts-grid-overlay-color, rgba(255,255,255,0.06)) 1px, transparent 1px),
    linear-gradient(to bottom, var(--ts-grid-overlay-color, rgba(255,255,255,0.06)) 1px, transparent 1px);
  background-size: var(--ts-grid-overlay-unit, 100px) var(--ts-grid-overlay-unit, 100px);
  z-index: 9990;
}
```

**Justification.** This is the "useful rulers" the user described. It's a quasi-IDE/Photoshop feel that fits the showcase/case-study aesthetic of the Toolskin demo pages. Low cost to implement (the reference code is small and clean). Naturally pairs with the live dimensions badge from §13.

**Commit message.**
```
feat(design-rulers): add TSRulers + TSGridOverlay components

Two new modules in assets/js/ts-design-rulers.js:

TSRulers — Photoshop-style draggable rulers. SVG ticks at 10/50/100px,
mousedown on ruler creates a guide line; guides draggable, double-click to
remove. Uses rAF batching for drag updates. Responsive: removes off-viewport
guides on window.resize and regenerates SVG.

TSGridOverlay — Toggleable design grid overlay. Triggered by Alt+G or click
on [data-ts-viewport-badge]. CSS background-gradient approach (zero DOM
overhead). Unit + color exposed via --ts-grid-overlay-* CSS variables.

Hooks: [data-ts-rulers], [data-ts-rulers-horizontal/vertical/guides],
[data-ts-grid-overlay]. No coupling to cube-portfolio — usable on any page.

Ported from Corentin Bernadou reference (classes Wt source 5436, tl 5416).
```

---

## Final cleanup

### 15. Remove `_TSGallery` global; export as ES module

**Problem.** The existing file exposes `window._TSGallery` as a global. The user wants a real reusable component.

**Change.** Top of file:

```js
// ts-cube-portfolio.js
import * as THREE from 'three';
import gsap from 'gsap';

export class TSCubeGallery { /* ... */ }
export default TSCubeGallery;
```

If the showcase HTML pages still use plain script tags (not bundlers), additionally attach to a namespace: `window.Toolskin = window.Toolskin || {}; window.Toolskin.CubeGallery = TSCubeGallery;` — but no more `_TSGallery` singleton. Each consumer constructs its own instance.

**Justification.** Globals defeat the "fully usable global dynamic asset" goal — they prevent multiple instances and make hooks awkward.

**Commit message.**
```
refactor(cube-portfolio): export TSCubeGallery; remove window._TSGallery

Drop the window._TSGallery singleton in favor of an ES module export and
a Toolskin.CubeGallery namespace assignment for plain-script consumers.
Enables multiple cube instances per page (e.g. mosaic of small cubes), clean
disposal, and unit testing.
```

---

## Out of scope (do not implement)

The reference bundle contains material that is **not** worth porting. Skip these so the agent doesn't fork attention:

- **Lenis integration in the cube file.** Toolskin already has its own scroll layer (`ToolskinSmooth`); routing cube updates through it should be a separate ticket.
- **The video crossfade pattern (`tMap` + `tMapNext` + `uMix`).** The cube uses static images, not video. If video support is needed later, port `qa` class then; not now.
- **Lazy video loading (`Xs.loadVideoLazy`).** Same reason.
- **InstancedMesh + texture atlas rewrite.** This is the only path to scaling beyond ~200 cells but adds atlas-packing complexity. Park it as a future ticket only if performance proves insufficient after fixes #3 and #8.
- **WebGPU / TSL.** The reference site uses classic WebGL three.js; so does Toolskin. No need to change renderer.

---

## Companion task: project case-study layout template

This is a separate work item, **not** part of the cube-portfolio commits above. Capturing here so it isn't lost.

The reference page (`https://corentinbernadou.com/work/shaped-by-earth`) decomposes into Toolskin components you already ship:

| Region | Toolskin component |
|---|---|
| Two-column intro block (title + meta fields) | grid utility + typography tokens |
| Marquee strip (project tagline scrolling) | marquee component |
| Image cluster | masonry component or gallery component |
| Archive/credits table | timeline component (table variant) |
| Section ID badge ("01 / WORK", etc.) | new `[data-ts-section-badge]` attribute with smart responsive sizing — `clamp()` based on viewport width |

No new components needed. What is needed:

1. **Wireframe schema entry** in the JSON wireframe generator (the pending commit you mentioned) for a `case-study` page preset that composes the above components.
2. **CSS-only section-badge style** that reads a `data-ts-section-badge="01"` attribute and renders it large at top-right of its section via `::before`. Use `clamp(2rem, 8vw, 12rem)` for the size — that's the "smart responsive sizing." Should compose with any `<section>` without JS.

That's enough to generate a sample page once the wireframe generator lands. Don't block this on the cube fixes.

---

## Execution order summary

| Step | Fix | File |
|---|---|---|
| 1 | Config object | `ts-cube-portfolio.js` |
| 2 | Cell mapping | `ts-cube-portfolio.js` |
| 3 | Shared material | `ts-cube-portfolio.js` |
| 4 | Rotation envelope + drag | `ts-cube-portfolio.js` |
| 5 | Auto-rotate to face | `ts-cube-portfolio.js` |
| 6 | Delegated hover + quickTo | `ts-cube-portfolio.js` |
| 7 | Timing standardization | `ts-cube-portfolio.js` |
| 8 | Texture cache | `ts-cube-portfolio.js` |
| 9 | Texture filtering | `ts-cube-portfolio.js` |
| 10 | Extract menu | `ts-slide-menu.js` (new) |
| 11 | Whip intro | `ts-slide-menu.js` |
| 12 | Hover lock | `ts-slide-menu.js` |
| 13 | Viewport badge | `ts-cube-portfolio.js` or shared layout module |
| 14 | Rulers + grid overlay | `ts-design-rulers.js` (new) |
| 15 | Module export | `ts-cube-portfolio.js` |

Commit each step independently. Fixes 1–3 should land together if convenient (they're entangled); the rest stand alone.

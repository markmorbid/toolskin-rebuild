# ToolskinTree — Standalone Uses

> One placeholder div, one JSON tree, one `init()` call — and you get a fully wired hierarchical browser.

`ToolskinTree` is the data-driven tree component that ships in
`assets/css/toolskin.css` (CSS) and is defined inline in
`build_tree_full_html-interactive.py` (JS). Hand it a nested array of
`{ name, type, children?, url? }` nodes and it renders the entire DOM,
wires keyboard navigation, search, expand/collapse, density toggling, and
an auto-built taxonomy chip strip.

- **Markup-free.** The caller authors a single `<div class="ts-tree">` placeholder. The component generates every row, twist, icon, and badge.
- **Generic.** Any hierarchy fits the node shape: file systems, sitemaps, tables of contents, settings outlines, JSON objects.
- **Accessible by default.** `role="tree" / "treeitem" / "group"`, `aria-expanded`, roving `tabindex`, full keyboard support (Up/Down/Left/Right/Home/End/Enter/Space).
- **Token-tinted.** No per-instance CSS needed — moving `--ts-accent-h/s/l` retints chevrons, focus rings, highlight marks, and folder icons in one stroke.

---

## Public API

```js
ToolskinTree.init({
  target:     '#my-tree',            // string | HTMLElement   REQUIRED
  data:       [ ...nodes ],          // Node[]                 REQUIRED

  // Optional UI hooks — pass a selector (or element) and the component
  // wires the control into the tree instance. Omit any to skip wiring.
  search:     '#search-input',       // string | HTMLElement | null   default: null
  expand:     '#expand-button',      // string | HTMLElement | null   default: null
  collapse:   '#collapse-button',    // string | HTMLElement | null   default: null
  density:    {                      // object | null                 default: null
    button:   '#density-btn',        //   string | HTMLElement       (click cycles compact → normal → cozy)
    target:   '#wrapper'             //   string | HTMLElement       (receives data-density="…")
  },
  taxonomy:   '#chip-strip',         // string | HTMLElement | null   default: null   (chip strip container)
  stats:      '#stats-el',           // string | HTMLElement | null   default: null   (folder/file counts)
  rootPath:   '#root-path-el',       // string | HTMLElement | null   default: null   (textContent = data[0].id || data[0].name)
  empty:      '#empty-state-el',     // string | HTMLElement | null   default: null   (toggled hidden during search/filter)

  // URL strategy. Default: node.url → node.href → file:/// + node.id.
  urlForNode: function (node) { return '/page/' + node.slug; }   // (Node) => string   default: defaultUrlFor
});
```

### Returned instance methods

```js
const tree = ToolskinTree.init({ /* … */ });

tree.expandAll();              // expand every folder
tree.collapseAll();            // collapse all, keep the first root open
tree.setData(newNodes);        // swap data and re-render
tree.search('foo');            // filter + highlight matches in <mark>
tree.filterByTaxonomy('CSS');  // switch to flat-list mode for one chip
```

### Caller-side CSS hooks

The caller only ever sets two attributes on the wrapper element:

| Attribute / class | Values | Effect |
|---|---|---|
| `data-density` on `.ts-tree-explorer` | `compact` \| `normal` \| `cozy` | Rescales `--ts-tree-row-h`; all geometry follows. |
| `data-tree-variant` on `.ts-tree-explorer` | (unset) \| `curved` | Switches connectors from classic `├──` straight rules to rounded-L elbows; tightens rows; raises label opacity. |

---

## Node shape

```ts
type Node = {
  name:     string;             // REQUIRED — visible label
  type:     'folder' | 'file';  // REQUIRED — folders may have children, files may have a url
  children?: Node[];            // folders only — array of child nodes
  url?:     string;             // files only — opens in a new tab on click / Enter
  href?:    string;             // alternative to url; checked second
  id?:      string;             // optional source path; if present, used as fallback file:// URL and as the rootPath display
};
```

Resolution order for a file's URL: `node.url` → `node.href` → `file:///` + `node.id` → empty string. Override the entire strategy by passing your own `urlForNode(node)` function.

---

## Use cases

### 1. File system explorer (flagship)

Renders a disk hierarchy with extension-aware Font Awesome icons, folder
counts, and a live taxonomy chip strip (JS, CSS, Markdown, Images, …)
auto-derived from the data.

```html
<div id="explorer" class="ts-tree-explorer" data-density="normal">
  <input id="q" type="search" placeholder="Filter…">
  <button id="x-all">Expand</button>
  <button id="c-all">Collapse</button>
  <button id="d-btn">Density</button>
  <div id="chips" role="tablist"></div>
  <div id="tree" class="ts-tree" role="tree" aria-label="Project files"></div>
  <p id="empty" hidden>Nothing matches.</p>
  <p>Folders: <span id="stats">—</span></p>
</div>

<script src="assets/js/toolskin.js" defer></script>
<script>
ToolskinTree.init({
  target: '#tree',
  data: [
    { name: 'my-project', type: 'folder', id: 'D:\\projects\\my-project', children: [
      { name: 'src', type: 'folder', children: [
        { name: 'index.html',  type: 'file', url: 'src/index.html'  },
        { name: 'app.js',      type: 'file', url: 'src/app.js'      },
        { name: 'styles.css',  type: 'file', url: 'src/styles.css'  }
      ]},
      { name: 'README.md',     type: 'file', url: 'README.md' }
    ]}
  ],
  search:   '#q',
  expand:   '#x-all',
  collapse: '#c-all',
  density:  { button: '#d-btn', target: '#explorer' },
  taxonomy: '#chips',
  stats:    '#stats',
  empty:    '#empty'
});
</script>
```

**What you should see.** A single root row (`my-project`) expanded by
default with a folder badge showing `1` subfolder and `1` file. Clicking
`src` swaps its icon from solid folder to outline `folder-open` and reveals
three rows with HTML / JS / CSS brand icons. The chip strip auto-renders
`All · HTML · JS · CSS · Markdown` with counts. Typing in the search box
debounces, hides non-matching nodes, expands ancestors of matches, and
wraps matched substrings in `<mark>` tinted with the accent.

---

### 2. Table of contents

Sections become folders, subsections become files. Each leaf links to a
URL fragment for in-page navigation.

```html
<aside class="ts-tree-explorer" data-density="compact" data-tree-variant="curved">
  <div id="toc" class="ts-tree" role="tree" aria-label="Table of contents"></div>
</aside>

<script>
ToolskinTree.init({
  target: '#toc',
  data: [
    { name: '1. Introduction', type: 'folder', children: [
      { name: '1.1 Motivation', type: 'file', url: '#motivation' },
      { name: '1.2 Scope',      type: 'file', url: '#scope' }
    ]},
    { name: '2. Method', type: 'folder', children: [
      { name: '2.1 Dataset',    type: 'file', url: '#dataset' },
      { name: '2.2 Model',      type: 'file', url: '#model' },
      { name: '2.3 Training',   type: 'file', url: '#training' }
    ]},
    { name: '3. Results', type: 'folder', children: [
      { name: '3.1 Benchmarks', type: 'file', url: '#benchmarks' }
    ]},
    { name: '4. Conclusion',    type: 'file', url: '#conclusion' }
  ],
  urlForNode: function (n) { return n.url; }
});
</script>
```

**What you should see.** A narrow, tight TOC with rounded-L elbows and
full-opacity labels (curved variant). Folder labels (`1. Introduction`)
render in primary text colour with the accent-tinted folder icon; leaves
underline on hover and route to `#fragment` anchors without leaving the
page. Up/Down arrow navigation moves through visible rows only.

---

### 3. Sitemap

Pages of a website, slug-based URLs. The tree doubles as both an
in-product site navigator and a static sitemap export.

```html
<nav class="ts-tree-explorer" data-density="normal" aria-label="Site map">
  <div id="sitemap" class="ts-tree" role="tree"></div>
</nav>

<script>
ToolskinTree.init({
  target: '#sitemap',
  data: [
    { name: 'Home',     type: 'file',   url: '/' },
    { name: 'Products', type: 'folder', url: '/products', children: [
      { name: 'Toolskin Core', type: 'file', url: '/products/toolskin-core' },
      { name: 'UI Kit',        type: 'file', url: '/products/ui-kit' },
      { name: 'Pricing',       type: 'file', url: '/products/pricing' }
    ]},
    { name: 'Docs', type: 'folder', url: '/docs', children: [
      { name: 'Getting Started', type: 'file', url: '/docs/getting-started' },
      { name: 'API Reference',   type: 'file', url: '/docs/api' },
      { name: 'Changelog',       type: 'file', url: '/docs/changelog' }
    ]},
    { name: 'Blog',    type: 'file', url: '/blog'    },
    { name: 'Contact', type: 'file', url: '/contact' }
  ]
});
</script>
```

**What you should see.** Five top-level rows; `Products` and `Docs`
expanded on first paint (the first root auto-expands). File rows use the
generic `fa-regular fa-file` icon (no extension is detected for clean
slugs); folder rows show subfolder + file count badges on the right.
Clicking a file label routes to its `url` in a new tab (override target
via your own `urlForNode` if you want in-tab navigation).

---

### 4. Settings outline

Nested categories whose leaves deep-link into individual configuration
pages — useful for any settings sidebar, admin panel, or onboarding flow.

```html
<div class="ts-tree-explorer" data-density="cozy" id="settings-wrap">
  <input id="settings-q" type="search" placeholder="Find a setting…">
  <div id="settings-tree" class="ts-tree" role="tree" aria-label="Settings"></div>
</div>

<script>
ToolskinTree.init({
  target: '#settings-tree',
  data: [
    { name: 'Account', type: 'folder', children: [
      { name: 'Profile',        type: 'file', url: '/settings/account/profile' },
      { name: 'Email & password', type: 'file', url: '/settings/account/email' },
      { name: 'Two-factor auth', type: 'file', url: '/settings/account/2fa' }
    ]},
    { name: 'Appearance', type: 'folder', children: [
      { name: 'Theme',     type: 'file', url: '/settings/appearance/theme' },
      { name: 'Density',   type: 'file', url: '/settings/appearance/density' },
      { name: 'Accent colour', type: 'file', url: '/settings/appearance/accent' }
    ]},
    { name: 'Integrations', type: 'folder', children: [
      { name: 'GitHub',    type: 'file', url: '/settings/integrations/github' },
      { name: 'Slack',     type: 'file', url: '/settings/integrations/slack' },
      { name: 'Webhooks',  type: 'file', url: '/settings/integrations/webhooks' }
    ]},
    { name: 'Danger zone', type: 'folder', children: [
      { name: 'Export data', type: 'file', url: '/settings/danger/export' },
      { name: 'Delete account', type: 'file', url: '/settings/danger/delete' }
    ]}
  ],
  search: '#settings-q'
});
</script>
```

**What you should see.** Tall, comfortable rows (`cozy` density,
`--ts-tree-row-h: 3.1rem`) with generous gutters. Typing `two` in the
search field instantly highlights the matching leaf inside the `Account`
folder and auto-expands the ancestor. Leaves with deep-link URLs open
their settings page in a new tab; if you need in-tab routing, replace
`urlForNode` with `(n) => { location.assign(n.url); return n.url; }` and
wire your router.

---

### 5. JSON viewer

Render an arbitrary JSON object as a navigable tree. Object- and
array-valued keys become folders; scalars become files whose label is
`"key: value"`.

```html
<div class="ts-tree-explorer" data-density="compact">
  <div id="json-tree" class="ts-tree" role="tree" aria-label="JSON"></div>
</div>

<script>
const payload = {
  user: {
    id: 42,
    name: 'Ada Lovelace',
    roles: ['admin', 'editor'],
    profile: { city: 'London', joined: '1843-12-10' }
  },
  flags: { beta: true, darkMode: false },
  version: '1.0.0'
};

function jsonToNodes(value, key) {
  const isObj = value !== null && typeof value === 'object';
  if (isObj) {
    const entries = Array.isArray(value)
      ? value.map((v, i) => [String(i), v])
      : Object.entries(value);
    return {
      name: key + (Array.isArray(value) ? `  [${value.length}]` : ''),
      type: 'folder',
      children: entries.map(([k, v]) => jsonToNodes(v, k))
    };
  }
  return { name: `${key}: ${JSON.stringify(value)}`, type: 'file' };
}

ToolskinTree.init({
  target: '#json-tree',
  data: Object.entries(payload).map(([k, v]) => jsonToNodes(v, k)),
  urlForNode: () => ''   // leaves are non-navigable; suppress href
});
</script>
```

**What you should see.** A compact tree where `user`, `profile`, and the
`roles  [2]` array render as folders with accent-tinted folder icons.
Scalar leaves render with a plain file icon and labels like
`name: "Ada Lovelace"` or `beta: true`. Folder badges report subfolder
and leaf counts at every depth. Because `urlForNode` returns an empty
string, leaves render as `<a href="">` placeholders — pair this with
`document.addEventListener('click', e => { if (e.target.closest('.ts-tree__node--file')) e.preventDefault(); })`
on the tree root if you want to suppress navigation entirely.

---

## Density variants

```html
<!-- Three sizes; same data; same component. -->
<div class="ts-tree-explorer" data-density="compact"><div class="ts-tree" id="t1"></div></div>
<div class="ts-tree-explorer" data-density="normal" ><div class="ts-tree" id="t2"></div></div>
<div class="ts-tree-explorer" data-density="cozy"   ><div class="ts-tree" id="t3"></div></div>
```

| `data-density` | `--ts-tree-row-h` | Use for |
|---|---|---|
| `compact` | `1.75rem` | Sidebars, JSON dumps, large file trees |
| `normal` (default) | `2.5rem` | Standard explorers, settings panels |
| `cozy` | `3.1rem` | Marketing pages, onboarding, hero TOCs |

Geometry is fully derivative — gutters, indents, icon sizes, twist size,
and connector stroke width all scale from `--ts-tree-row-h`. Nothing
else needs adjusting.

```html
<!-- Connector style: classic (default) vs. curved elbows. -->
<div class="ts-tree-explorer" ><!-- classic ├── └── --></div>
<div class="ts-tree-explorer" data-tree-variant="curved"><!-- rounded-L corners, tighter rows --></div>
```

The `curved` variant also bumps label opacity to full and clamps width
to `78rem` — designed for documentation pages where the tree is the
hero content.

---

## Theming

The component reads **only** Toolskin tokens — no per-instance CSS is
needed to retint it. Driving the accent retints chevrons, the active
selection bar, focus outlines, expanded folder icons, search highlight
marks, and the taxonomy chip active state in one stroke:

```js
// In the host page — or any control bound to it.
Toolskin.setAccentHex('#2efc86');   // tree retints instantly
Toolskin.setRadius(6);               // row corners follow --ts-radius-base
```

Under the hood the tree consumes:

```css
--ts-this-bg         /* surface — set on .ts-tree-explorer, propagates */
--ts-accent          /* folder icon, chevron, active bar, mark background */
--ts-text-primary    /* folder labels */
--ts-text-secondary  /* file labels, file icons (dim until hover) */
--ts-tree-row-h      /* one base; everything else derives from it */
--ts-tree-guide      /* connector stroke colour */
```

If you need a per-instance recolour, set `--ts-this-bg` on the
`.ts-tree-explorer` element — every component-tier token inherits.

---

## Accessibility checklist

**Handled by the component**

- [x] `role="tree"` on the root, `role="treeitem"` on every node, `role="group"` on the children container.
- [x] `aria-expanded="true|false"` on every folder node, kept in sync with the disclosure state.
- [x] `aria-selected="true"` on the currently active node (mutex within the tree).
- [x] Roving `tabindex`: exactly one row is `tabindex="0"` at a time; the rest are `tabindex="-1"`.
- [x] Keyboard: **Up / Down** move within visible rows; **Right** expands or descends; **Left** collapses or ascends to parent; **Home / End** jump; **Enter / Space** toggle folders and follow file links.
- [x] Disclosure icons are decorative (`aria-hidden="true"`); state is conveyed via `aria-expanded`.
- [x] `prefers-reduced-motion` collapses animation to `1ms`.
- [x] Search marks use real `<mark>` elements (semantic, not just colour).

**Your responsibility**

- [ ] Set `aria-label` (or `aria-labelledby`) on the root `.ts-tree` element so screen readers announce what the tree represents. Example: `aria-label="Project files"`, `aria-label="Table of contents"`, `aria-label="Site map"`.
- [ ] If you wire your own custom controls (beyond `search` / `expand` / `collapse` / `density`), give them accessible names and keep their `aria-pressed` / `aria-expanded` state coherent with the tree.
- [ ] When using `urlForNode` to override navigation, preserve a meaningful `href` so the leaves remain valid links for keyboard, middle-click, and assistive-tech users — don't return empty strings unless you also suppress the click (see the JSON viewer example).
- [ ] Verify contrast if you re-tint via `--ts-this-bg` on a single instance — the rest of the component will follow, but you own the result.

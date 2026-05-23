# Toolskin Tree Explorer

An interactive, themeable file-tree viewer. Point it at any folder and get a
browsable tree with live previews (images open in a zoomable lightbox), type
filters, search, and a duplicate-file report.

Nothing is hardcoded into the page. The HTML is a fixed **template** that
fetches its data from JSON. A tiny Node.js server scans your folder, writes
that JSON (timestamped, never overwritten), serves the page, and opens it for
you.

---

## How to use it (the easy way)

You only ever touch one file:

**`Tree-Explorer.bat`**  ← double-click it (Windows)
*(macOS / Linux: double-click `Tree-Explorer.command` instead)*

It will:

1. Find a free port automatically.
2. Ask **which folder to scan** — press **Enter** to scan the whole project
   (the folder the trigger sits in), or paste a different path.
3. Ask the **mode**:
   - **[1] Scan + open** *(default)* — builds the data, **opens the explorer
     in your browser**, and stays running so you can use the **Rebuild** and
     **Clean** buttons in the UI. Press any key in the terminal to stop.
   - **[2] Scan only** — builds the JSON, prints a summary, then closes.
4. Open your browser on the explorer automatically (mode 1).

A summary prints when it finishes, e.g.:

```
  Build complete
  Folders   : 409
  Files     : 2012
  Output    : _tree-explorer/_treemap-output/tree-2026-05-23T09-24-29.json
  Duplicates: 12 group(s), ~84 MB wasted
```

That's the whole workflow. **Requirement:** [Node.js](https://nodejs.org)
installed. No `npm install`, no dependencies.

---

## What's where

Everything except the trigger is tucked inside `_tree-explorer/`:

```
your-project/
├── Tree-Explorer.bat          ← the only thing you click (Windows)
├── Tree-Explorer.command      ← macOS / Linux trigger
└── _tree-explorer/            ← all the machinery (leave it alone)
    ├── launch.js              ← the launcher the trigger runs
    ├── server.js              ← zero-dependency Node server + scanner
    ├── tree-explorer.html     ← the viewer (a template — never edit it)
    ├── tree-explorer.data.json    ← latest scan (the page fetches this)
    ├── tree-explorer.dedup.json   ← latest duplicate report
    └── _treemap-output/           ← timestamped history of every scan
```

The whole thing is **portable**: copy `Tree-Explorer.bat` + the
`_tree-explorer` folder anywhere (keep them together) and it works. The data
is written *inside* `_tree-explorer/`, so your scanned project stays clean —
the only thing the tool adds to your project root is the trigger.

---

## In the UI

- **Click any file** to preview it in the side panel.
  - **Images** open as a gallery; click the image (or **Open full screen**)
    for a zoomable, pannable lightbox — scroll to zoom, drag to pan, arrow
    keys to move between images in the same folder.
  - **Text / code** renders as themed source.
  - **HTML / PDF** renders inline.
- **Rebuild** — re-scans and reloads with fresh data (confirms first).
- **Clean** — deletes **all** generated data and history. **Not reversible.**
- **Search**, **expand / collapse all**, **density** toggle, **type filter
  chips** (collapse into a menu when space is tight), **Export**
  (CSV / Markdown / JSON / static HTML / PDF), and **light / dark** toggle.

Hover any control for a tooltip explaining it.

---

## Running it manually (optional)

If you'd rather drive the server yourself:

```bash
cd your-project/_tree-explorer

# scan the parent project, serve the page, custom port
node server.js ".." --app . --port 8002
# then open  http://localhost:8002/tree-explorer.html
```

- The first positional argument is the **folder to scan**.
- `--app .` tells it the HTML + data live in the current folder.
- `--port` is optional (default 8080).

> Open it through the `http://` URL, not by double-clicking the `.html` —
> browsers block `fetch()` on `file://`, so the data wouldn't load.

---

## Getting just the data (no UI)

Run the trigger and pick **[2] Scan only**, or hit the API once:

```bash
cd your-project/_tree-explorer
node server.js ".." --app . --port 8002 &
curl -X POST http://localhost:8002/api/build-tree
```

The result lands in `_tree-explorer/tree-explorer.data.json` (latest) plus a
timestamped copy in `_tree-explorer/_treemap-output/`.

---

## The data format

A JSON array with one root node. Each node:

```json
{
  "id": "absolute/path/or/unique-id",
  "name": "display-name",
  "type": "folder",          // "folder" or "file"
  "url": "relative/path",    // path the preview/links use
  "size": null,              // null for folders, byte count for files
  "mtime": 1779484544,       // last-modified, unix seconds
  "ctime": 1779484544,       // created, unix seconds
  "children": []             // nested nodes (files have an empty array)
}
```

Generate this shape from any tool and the page will render it — the server is
just the convenient default producer.

---

## The API (for scripting)

| Method | Path | Does |
|--------|------|------|
| `POST` | `/api/build-tree` | Scan, write timestamped JSON, refresh the latest copy. Returns `{ ok, file, kb, ts }`. |
| `GET`  | `/api/build-status` | `{ running, lastBuild, hasData }`. |
| `GET`  | `/api/outputs` | Files in `_treemap-output/` (newest first). |
| `POST` | `/api/cleanup` | Delete everything in `_treemap-output/` + the latest copies. `{ ok, deleted }`. |

---

## What gets skipped

The scanner ignores noise: `.git`, `node_modules`, `__pycache__`, `.venv`,
`venv`, `dist`, `.next`, `.cache`, its own `_tree-explorer` and
`_treemap-output`. Edit the `EXCLUDE` set near the top of `server.js` to
change it.

---

## Troubleshooting

- **"Failed to load tree data"** — no scan yet. Run the trigger, or click
  Rebuild, or `POST /api/build-tree`.
- **Page blank / data won't load from a file** — you opened the `.html`
  directly. Use the trigger (or the `http://` URL).
- **"Server not running" toast** — start the trigger again, then Rebuild.
- **`node` not found** — install from <https://nodejs.org>, reopen the
  terminal, retry.
- **Hidden folder** — `_tree-explorer` is shown by name; on macOS/Linux a
  leading underscore doesn't hide it, but it sorts to the top and is clearly
  the machinery. On Windows you can mark it Hidden in its Properties if you
  want it out of sight.

---

## Notes

- Toolskin's CSS/JS load from `satsea.io` absolute URLs, so the page is
  self-contained and renders anywhere with internet access.
- Image previews follow the page's light/dark theme and never overflow; the
  lightbox adds zoom + pan.
- Responsive: on phones the preview stacks below the tree and the filter chips
  collapse into a menu.

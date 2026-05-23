#!/usr/bin/env node
/**
 * server.js — Toolskin Tree Explorer dev server + build API
 *
 * Serves the static explorer (tree-explorer.html) AND exposes a small
 * JSON API the frontend calls to (re)scan the filesystem and clean up.
 * Zero dependencies — pure Node.js built-ins only.
 *
 * The HTML template is NEVER modified. Only JSON data files are written.
 *
 * Usage:
 *   node server.js                  # serve cwd on port 8080
 *   node server.js /path/to/dir     # serve a specific directory
 *   node server.js --port 8002      # custom port
 *
 * Output layout (timestamped, never overwritten):
 *   _treemap-output/
 *     tree-2026-05-23T07-15-44.json    -> full filesystem tree
 *     dedup-2026-05-23T07-15-44.json   -> duplicate-file report
 *   tree-explorer.data.json            -> copy of the LATEST tree (HTML fetches this)
 *   tree-explorer.dedup.json           -> copy of the LATEST dedup report
 *
 * API (all JSON responses):
 *   POST /api/build-tree    -> scan, write timestamped JSON, refresh latest copy
 *   GET  /api/build-status  -> { running, lastBuild, hasData }
 *   GET  /api/outputs       -> [ { file, sizeKb, ts } ]
 *   POST /api/cleanup       -> delete every file in _treemap-output + latest copies
 */

'use strict';

const http   = require('http');
const fs     = require('fs');
const path   = require('path');
const crypto = require('crypto');


// --- Config -----------------------------------------------------------------

const args = process.argv.slice(2);
let   ROOT = process.cwd();
let   PORT = 8080;

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--port' && args[i + 1]) PORT = parseInt(args[++i], 10);
  else if (!args[i].startsWith('--'))      ROOT = path.resolve(args[i]);
}

const OUTPUT_DIR   = path.join(ROOT, '_treemap-output');
const DATA_LATEST  = path.join(ROOT, 'tree-explorer.data.json');
const DEDUP_LATEST = path.join(ROOT, 'tree-explorer.dedup.json');

const EXCLUDE = new Set([
  '.git', 'node_modules', '__pycache__', '.venv', 'venv',
  '_tree_output', '_treemap-output', '_bu', '.next', 'dist', '.cache',
]);

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js':   'application/javascript; charset=utf-8',
  '.css':  'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg':  'image/svg+xml',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif':  'image/gif',
  '.webp': 'image/webp',
  '.ico':  'image/x-icon',
  '.woff2':'font/woff2',
  '.woff': 'font/woff',
  '.ttf':  'font/ttf',
  '.md':   'text/plain; charset=utf-8',
  '.txt':  'text/plain; charset=utf-8',
  '.pdf':  'application/pdf',
};

const state = { running: false, lastBuild: null };

// --- Filesystem scanner ------------------------------------------------------

function shouldExclude(p) {
  return p.split(path.sep).some(part => EXCLUDE.has(part));
}

function buildNode(fullPath) {
  if (shouldExclude(fullPath)) return null;
  let stat;
  try { stat = fs.statSync(fullPath); } catch { return null; }

  const isDir  = stat.isDirectory();
  const relUrl = path.relative(ROOT, fullPath).split(path.sep).join('/') || '.';

  const node = {
    id:       fullPath,
    name:     path.basename(fullPath) || relUrl,
    type:     isDir ? 'folder' : 'file',
    url:      relUrl,
    size:     isDir ? null : stat.size,
    mtime:    Math.floor(stat.mtimeMs / 1000),
    ctime:    Math.floor(stat.ctimeMs / 1000),
    children: [],
  };

  if (isDir) {
    let entries;
    try { entries = fs.readdirSync(fullPath); } catch { return node; }
    entries
      .sort((a, b) => {
        let ad = false, bd = false;
        try { ad = fs.statSync(path.join(fullPath, a)).isDirectory(); } catch {}
        try { bd = fs.statSync(path.join(fullPath, b)).isDirectory(); } catch {}
        if (ad !== bd) return ad ? -1 : 1;          // folders first
        return a.toLowerCase().localeCompare(b.toLowerCase());
      })
      .forEach(name => {
        const child = buildNode(path.join(fullPath, name));
        if (child) node.children.push(child);
      });
  }
  return node;
}

// --- Dedup report ------------------------------------------------------------

function sha1File(filePath) {
  try {
    const hash = crypto.createHash('sha1');
    const buf  = Buffer.allocUnsafe(65536);
    const fd   = fs.openSync(filePath, 'r');
    let bytes;
    while ((bytes = fs.readSync(fd, buf, 0, buf.length, null)) > 0) {
      hash.update(buf.subarray(0, bytes));
    }
    fs.closeSync(fd);
    return hash.digest('hex');
  } catch { return null; }
}

function buildDedup(tree) {
  const byKey = {};
  (function walk(list) {
    for (const n of list) {
      if (n.type === 'file' && n.size) {
        const key = n.size + '::' + n.name.toLowerCase();
        (byKey[key] = byKey[key] || []).push(n);
      }
      if (n.children && n.children.length) walk(n.children);
    }
  })(tree);

  const byDigest = {};
  for (const group of Object.values(byKey)) {
    if (group.length < 2) continue;               // only same-size+name are candidates
    for (const n of group) {
      const digest = sha1File(n.id);
      if (!digest) continue;
      (byDigest[digest] = byDigest[digest] || []).push({
        id: n.id, name: n.name, url: n.url, size: n.size, mtime: n.mtime,
      });
    }
  }

  const groups = Object.entries(byDigest)
    .filter(([, files]) => files.length > 1)
    .map(([sha1, files]) => ({ sha1, size: files[0].size, count: files.length, files }))
    .sort((a, b) => (b.size * (b.count - 1)) - (a.size * (a.count - 1)));

  const redundant   = groups.reduce((s, g) => s + g.count - 1, 0);
  const wastedBytes = groups.reduce((s, g) => s + g.size * (g.count - 1), 0);

  return {
    generated_at: new Date().toISOString().slice(0, 19),
    root: ROOT,
    summary: {
      duplicate_groups: groups.length,
      redundant_files:  redundant,
      wasted_bytes:     wastedBytes,
      wasted_mb:        Math.round(wastedBytes / (1024 * 1024) * 100) / 100,
    },
    groups,
  };
}

// --- Build action ------------------------------------------------------------

function runBuild() {
  return new Promise((resolve, reject) => {
    if (state.running) return reject(new Error('A build is already running'));
    state.running = true;

    setImmediate(() => {                            // let the HTTP layer breathe
      try {
        fs.mkdirSync(OUTPUT_DIR, { recursive: true });

        const ts        = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
        const treeFile  = path.join(OUTPUT_DIR, 'tree-' + ts + '.json');
        const dedupFile = path.join(OUTPUT_DIR, 'dedup-' + ts + '.json');

        const rootNode = buildNode(ROOT);
        const tree     = rootNode ? [rootNode] : [];

        fs.writeFileSync(treeFile,  JSON.stringify(tree, null, 2), 'utf8');
        fs.writeFileSync(dedupFile, JSON.stringify(buildDedup(tree), null, 2), 'utf8');

        // Refresh the "latest" copies the HTML fetches. Plain copy (not a
        // symlink) so it works identically on Windows, macOS and Linux.
        fs.copyFileSync(treeFile,  DATA_LATEST);
        fs.copyFileSync(dedupFile, DEDUP_LATEST);

        state.running   = false;
        state.lastBuild = new Date().toISOString();

        const kb = Math.floor(fs.statSync(treeFile).size / 1024);
        resolve({ ok: true, file: path.relative(ROOT, treeFile), kb, ts: state.lastBuild });
      } catch (err) {
        state.running = false;
        reject(err);
      }
    });
  });
}

// --- Cleanup action ----------------------------------------------------------

function runCleanup() {
  let deleted = 0;
  if (fs.existsSync(OUTPUT_DIR)) {
    for (const f of fs.readdirSync(OUTPUT_DIR)) {
      try { fs.unlinkSync(path.join(OUTPUT_DIR, f)); deleted++; } catch {}
    }
  }
  for (const p of [DATA_LATEST, DEDUP_LATEST]) {
    try { fs.unlinkSync(p); deleted++; } catch {}
  }
  state.lastBuild = null;
  return { ok: true, deleted };
}

// --- List outputs ------------------------------------------------------------

function listOutputs() {
  if (!fs.existsSync(OUTPUT_DIR)) return [];
  return fs.readdirSync(OUTPUT_DIR)
    .filter(f => f.endsWith('.json'))
    .map(f => {
      const st = fs.statSync(path.join(OUTPUT_DIR, f));
      return { file: f, sizeKb: Math.floor(st.size / 1024), ts: st.mtime.toISOString() };
    })
    .sort((a, b) => b.ts.localeCompare(a.ts));
}

// --- HTTP helpers ------------------------------------------------------------

function sendJson(res, data, status) {
  res.writeHead(status || 200, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Cache-Control': 'no-store',
  });
  res.end(JSON.stringify(data));
}

// --- Router ------------------------------------------------------------------

async function handler(req, res) {
  /* req.url is always a path (e.g. "/api/build-tree"); the WHATWG URL
     parser needs an absolute base, so pass a throwaway origin and read
     just the pathname. This avoids the deprecated url.parse(). */
  const pathname = new URL(req.url, 'http://localhost').pathname;
  const method   = req.method.toUpperCase();

  if (method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    });
    return res.end();
  }

  // API
  if (pathname === '/api/build-tree' && method === 'POST') {
    if (state.running) return sendJson(res, { ok: false, error: 'Build already running' }, 409);
    try { return sendJson(res, await runBuild()); }
    catch (err) { return sendJson(res, { ok: false, error: err.message }, 500); }
  }

  if (pathname === '/api/build-status' && method === 'GET') {
    return sendJson(res, {
      running:   state.running,
      lastBuild: state.lastBuild,
      hasData:   fs.existsSync(DATA_LATEST),
    });
  }

  if (pathname === '/api/outputs' && method === 'GET') {
    return sendJson(res, listOutputs());
  }

  if (pathname === '/api/cleanup' && method === 'POST') {
    return sendJson(res, runCleanup());
  }

  // Static files
  let rel = decodeURIComponent(pathname);
  if (rel === '/') rel = '/tree-explorer.html';
  const filePath = path.join(ROOT, path.normalize(rel).replace(/^(\.\.[\/\\])+/, ''));
  if (filePath.indexOf(ROOT) !== 0) {
    res.writeHead(403); return res.end('Forbidden');
  }
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    res.writeHead(404, { 'Content-Type': 'text/plain' }); return res.end('Not found');
  }

  const mime = MIME[path.extname(filePath).toLowerCase()] || 'application/octet-stream';
  res.writeHead(200, { 'Content-Type': mime });
  fs.createReadStream(filePath).pipe(res);
}

// --- Start -------------------------------------------------------------------

http.createServer((req, res) => {
  handler(req, res).catch(err => {
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end(String((err && err.message) || err));
  });
}).listen(PORT, () => {
  console.log('Toolskin Tree Explorer');
  console.log('  URL:     http://localhost:' + PORT);
  console.log('  Serving: ' + ROOT);
  console.log('  Outputs: ' + OUTPUT_DIR);
  console.log('  (Ctrl+C to stop)');
});

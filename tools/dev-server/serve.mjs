// serve.mjs — Toolskin Rebuild local dev server (zero dependencies).
//
// Static file server for the repo root, so sandbox pages can be opened over
// http:// (the Playwright/Chrome MCP blocks the file:// protocol — sandboxes
// must be served to be testable). Build-time tooling only — Rule 13, not shipped.
//
// Usage:
//   node tools/dev-server/serve.mjs            # default port 8003
//   node tools/dev-server/serve.mjs 8010       # explicit port
//   PORT=8010 node tools/dev-server/serve.mjs  # via env
//
// If the chosen port is busy it auto-increments (up to +12) and prints the URL.
// Responses send `cache-control: no-cache` so edits show on a plain reload.

import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = resolve(fileURLToPath(import.meta.url), '../../..');
const startPort = Number(process.argv[2] || process.env.PORT || 8003);

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css':  'text/css; charset=utf-8',
  '.js':   'text/javascript; charset=utf-8',
  '.mjs':  'text/javascript; charset=utf-8',
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
  '.txt':  'text/plain; charset=utf-8',
  '.map':  'application/json',
};

const server = createServer(async (req, res) => {
  try {
    const urlPath = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    let fsPath = normalize(join(repoRoot, urlPath));

    // Path-traversal guard — never serve outside the repo root.
    if (fsPath !== repoRoot && !fsPath.startsWith(repoRoot + sep)) {
      res.writeHead(403, { 'content-type': 'text/plain' });
      return res.end('403 Forbidden');
    }

    let info = await stat(fsPath).catch(() => null);
    if (info && info.isDirectory()) {
      fsPath = join(fsPath, 'index.html');
      info = await stat(fsPath).catch(() => null);
    }
    if (!info || !info.isFile()) {
      res.writeHead(404, { 'content-type': 'text/plain' });
      return res.end('404 Not Found: ' + urlPath);
    }

    const body = await readFile(fsPath);
    res.writeHead(200, {
      'content-type': MIME[extname(fsPath).toLowerCase()] || 'application/octet-stream',
      'cache-control': 'no-cache',
    });
    res.end(body);
  } catch (err) {
    res.writeHead(500, { 'content-type': 'text/plain' });
    res.end('500 ' + err.message);
  }
});

// Single 'listening' handler — reads the port that was actually bound, so an
// auto-incremented retry never prints a stale URL.
server.on('listening', () => {
  const port = server.address().port;
  console.log('Toolskin dev server — repo root:');
  console.log(`  http://localhost:${port}/`);
  console.log(`  http://localhost:${port}/sandbox/01-system/surfaces.html`);
});

function listen(port, triesLeft) {
  server.once('error', (err) => {
    if (err.code === 'EADDRINUSE' && triesLeft > 0) {
      console.log(`port ${port} busy — trying ${port + 1}`);
      listen(port + 1, triesLeft - 1);
    } else {
      console.error('dev server error:', err.message);
      process.exit(1);
    }
  });
  server.listen(port);
}

listen(startPort, 12);

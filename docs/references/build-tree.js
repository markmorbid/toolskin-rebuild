#!/usr/bin/env node
/**
 * build-tree.js
 * Scans the current directory and writes:
 *   tree-explorer.data.json  — full filesystem tree (consumed by tree-explorer.html)
 *   tree-explorer.dedup.json — duplicate-file report
 *
 * The HTML template (tree-explorer.html) is NEVER touched.
 * Drop it next to this script and serve both statically.
 *
 * Usage:
 *   node build-tree.js               # scan cwd
 *   node build-tree.js /path/to/dir  # scan a specific directory
 *
 * No dependencies — pure Node.js built-ins only.
 */

'use strict';

const fs   = require('fs');
const path = require('path');
const crypto = require('crypto');

// ─── Config ───────────────────────────────────────────────────────────────────

const BASE_DIR = path.resolve(process.argv[2] || process.cwd());

const OUTPUT_JSON  = path.join(BASE_DIR, 'tree-explorer.data.json');
const OUTPUT_DEDUP = path.join(BASE_DIR, 'tree-explorer.dedup.json');

const EXCLUDE = new Set([
  '.git', 'node_modules', '__pycache__', '.venv', 'venv',
  '_tree_output', '_bu', '.next', 'dist',
]);

// ─── Filesystem walker ────────────────────────────────────────────────────────

function shouldExclude(fullPath) {
  return fullPath.split(path.sep).some(part => EXCLUDE.has(part));
}

function buildNode(fullPath) {
  if (shouldExclude(fullPath)) return null;

  let stat;
  try { stat = fs.statSync(fullPath); }
  catch { return null; }

  const isDir = stat.isDirectory();
  let relUrl;
  try {
    relUrl = path.relative(BASE_DIR, fullPath).split(path.sep).join('/');
  } catch {
    relUrl = path.basename(fullPath);
  }

  const node = {
    id:       fullPath,
    name:     path.basename(fullPath),
    type:     isDir ? 'folder' : 'file',
    url:      relUrl,
    size:     isDir ? null : stat.size,
    mtime:    Math.floor(stat.mtimeMs / 1000),
    ctime:    Math.floor(stat.ctimeMs / 1000),
    children: [],
  };

  if (isDir) {
    let entries;
    try { entries = fs.readdirSync(fullPath); }
    catch { return node; }

    entries
      // folders first, then files, both alphabetical case-insensitive
      .sort((a, b) => {
        const aIsDir = fs.statSync(path.join(fullPath, a)).isDirectory();
        const bIsDir = fs.statSync(path.join(fullPath, b)).isDirectory();
        if (aIsDir !== bIsDir) return aIsDir ? -1 : 1;
        return a.toLowerCase().localeCompare(b.toLowerCase());
      })
      .forEach(name => {
        const child = buildNode(path.join(fullPath, name));
        if (child) node.children.push(child);
      });
  }

  return node;
}

// ─── Dedup ────────────────────────────────────────────────────────────────────

function sha1File(filePath) {
  try {
    const hash = crypto.createHash('sha1');
    const buf  = Buffer.allocUnsafe(65536);
    const fd   = fs.openSync(filePath, 'r');
    let   bytes;
    while ((bytes = fs.readSync(fd, buf, 0, buf.length, null)) > 0) {
      hash.update(buf.slice(0, bytes));
    }
    fs.closeSync(fd);
    return hash.digest('hex');
  } catch {
    return null;
  }
}

function buildDedup(nodes) {
  // collect all files, grouped by (size, lowercased name) — candidates only
  const byKey = {};
  (function walk(list) {
    for (const n of list) {
      if (n.type === 'file' && n.size) {
        const key = `${n.size}::${n.name.toLowerCase()}`;
        (byKey[key] = byKey[key] || []).push(n);
      }
      if (n.children?.length) walk(n.children);
    }
  })(nodes);

  const byDigest = {};
  for (const group of Object.values(byKey)) {
    if (group.length < 2) continue;
    for (const node of group) {
      const digest = sha1File(node.id);
      if (!digest) continue;
      (byDigest[digest] = byDigest[digest] || []).push({
        id:    node.id,
        name:  node.name,
        url:   node.url,
        size:  node.size,
        mtime: node.mtime,
      });
    }
  }

  const groups = Object.entries(byDigest)
    .filter(([, files]) => files.length > 1)
    .map(([sha1, files]) => ({
      sha1, size: files[0].size, count: files.length, files,
    }))
    .sort((a, b) => (b.size * (b.count - 1)) - (a.size * (a.count - 1)));

  const redundant   = groups.reduce((s, g) => s + g.count - 1, 0);
  const wastedBytes = groups.reduce((s, g) => s + g.size * (g.count - 1), 0);

  return {
    generated_at: new Date().toISOString().slice(0, 19),
    root: BASE_DIR,
    summary: {
      duplicate_groups: groups.length,
      redundant_files:  redundant,
      wasted_bytes:     wastedBytes,
      wasted_mb:        Math.round(wastedBytes / (1024 * 1024) * 100) / 100,
    },
    groups,
  };
}

// ─── Main ─────────────────────────────────────────────────────────────────────

console.log(`Scanning: ${BASE_DIR}`);

const rootNode = buildNode(BASE_DIR);
const tree     = rootNode ? [rootNode] : [];

fs.writeFileSync(OUTPUT_JSON,  JSON.stringify(tree, null, 2),  'utf8');

const dedup = buildDedup(tree);
fs.writeFileSync(OUTPUT_DEDUP, JSON.stringify(dedup, null, 2), 'utf8');

const jsonKb  = Math.floor(fs.statSync(OUTPUT_JSON).size  / 1024);
const dedupKb = Math.floor(fs.statSync(OUTPUT_DEDUP).size / 1024);

console.log(`DATA  -> tree-explorer.data.json  (${jsonKb} KB)`);
console.log(`DEDUP -> tree-explorer.dedup.json (${dedupKb} KB,`,
  `${dedup.summary.duplicate_groups} groups,`,
  `${dedup.summary.redundant_files} redundant files,`,
  `${dedup.summary.wasted_mb} MB wasted)`);
console.log('Done. Serve tree-explorer.html from the same directory.');

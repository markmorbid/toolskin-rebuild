'use strict';

const path = require('node:path');
const fs = require('node:fs/promises');
const crypto = require('node:crypto');
const fsSync = require('node:fs');

/**
 * Classify an asset filename into Toolskin's kind taxonomy.
 * @param {string} filename - Bare filename (e.g. "toolskin.css"), NOT a path.
 *   Pass `path.basename(fullPath)` if you have a full path.
 * @returns {{ type: 'css'|'js'|'other', kind: string, isCore: boolean }}
 */
function classify(filename) {
  const lower = filename.toLowerCase();
  const ext = path.extname(lower).slice(1); // 'css' | 'js'
  const type = (ext === 'css' || ext === 'js') ? ext : 'other';

  // Order matters: more specific before more general.
  // 1. UIKit (must beat generic toolskin*)
  if (/^toolskin-uikit/.test(lower)) {
    return { type, kind: 'uikit', isCore: false };
  }
  // 2. Asset loader
  if (/^toolskin-assets/.test(lower)) {
    return { type, kind: 'assets-loader', isCore: false };
  }
  // 3. Integration scripts (toolskin.banner*.js, toolskin.showcase*.js, ts-offcanvas-*, ts-gradient-*)
  //    "toolskin.bannerGenerator.js" has two dots; bare "toolskin.css" has one dot (just the ext).
  //    We detect dotted sub-names by checking the stem (filename minus final ext) still contains a dot.
  const stem = path.basename(lower, '.' + ext);
  if ((/^toolskin\.[a-z]/.test(lower) && stem.includes('.')) || /^ts-(offcanvas|gradient)/.test(lower)) {
    return { type, kind: 'integration', isCore: false };
  }
  // 4. Experimental
  if (/experiment/.test(lower)) {
    return { type, kind: 'experimental', isCore: false };
  }
  // 5. Toolskin core (toolskin.css, toolskin-merged-*.css, "toolskin - Copy.css", toolskin.js)
  //    Separator after 'toolskin' must be -, space, or _ (not '.') to avoid matching
  //    double-dot names like toolskin.bannerGenerator.js (caught by rule 3 first anyway).
  if (/^toolskin([- _][^/]*)?\.(css|js)$/.test(lower)) {
    return { type, kind: 'core', isCore: true };
  }
  // 6. ts-* extensions
  if (/^ts-/.test(lower)) {
    return { type, kind: 'extension', isCore: false };
  }
  // 7. Known extensions by name
  if (/^(extra-styles|masonry-)/.test(lower)) {
    return { type, kind: 'extension', isCore: false };
  }
  return { type, kind: 'other', isCore: false };
}

/**
 * Should this asset be excluded from the registry?
 * @param {string} relPath - Project-relative path, forward or backslash separated.
 * @param {{ includeMinified?: boolean }} [opts]
 *   `includeMinified` defaults to `false` — minified files (*.min.css|js) are excluded by default.
 * @returns {boolean}
 */
function isExcluded(relPath, opts = {}) {
  const includeMinified = !!opts.includeMinified;
  const norm = relPath.replace(/\\/g, '/');
  if (/(^|\/)node_modules(\/|$)/.test(norm)) return true;
  if (/(^|\/)\.git(\/|$)/.test(norm)) return true;
  if (/(^|\/)_bu(_[^/]*)?(\/|$)/.test(norm)) return true;
  if (/(^|\/)docs\/_canonical-merge-sources(\/|$)/.test(norm)) return true;
  if (/(^|\/)docs\/_unintegrated-patches(\/|$)/.test(norm)) return true;
  if (/\.user\.css$/i.test(norm)) return true;
  if (!includeMinified && /\.min\.(css|js)$/i.test(norm)) return true;
  return false;
}

/**
 * Recursively walk a directory and return metadata for every .css/.js file
 * not excluded by isExcluded().
 * @param {string} rootDir - absolute path to project root.
 * @param {{ roots?: string[], includeMinified?: boolean }} [opts]
 *   `roots` defaults to ['assets/css', 'assets/js'].
 *   `includeMinified` defaults to false.
 * @returns {Promise<Array<{ fullPath, relPath, name, size, modified }>>}
 */
async function walk(rootDir, opts = {}) {
  const roots = opts.roots || ['assets/css', 'assets/js'];
  const includeMinified = !!opts.includeMinified;
  const out = [];
  for (const r of roots) {
    const start = path.join(rootDir, r);
    try {
      await walkDir(start, rootDir, includeMinified, out);
    } catch (e) {
      if (e.code !== 'ENOENT') throw e;
    }
  }
  return out;
}

async function walkDir(dir, baseDir, includeMinified, out) {
  let entries;
  try { entries = await fs.readdir(dir, { withFileTypes: true }); }
  catch (e) { if (e.code === 'ENOENT') return; throw e; }
  for (const ent of entries) {
    const full = path.join(dir, ent.name);
    const rel = path.relative(baseDir, full);
    if (isExcluded(rel, { includeMinified })) continue;
    if (ent.isDirectory()) {
      await walkDir(full, baseDir, includeMinified, out);
    } else if (ent.isFile()) {
      const ext = path.extname(ent.name).toLowerCase();
      if (ext !== '.css' && ext !== '.js') continue;
      const stat = await fs.stat(full);
      out.push({
        fullPath: full,
        relPath: rel.split(path.sep).join('/'),
        name: ent.name,
        size: stat.size,
        modified: stat.mtime,
      });
    }
  }
}

/**
 * Compute the full SHA-256 of a file's contents (streamed).
 * Returns 'sha256:<hex>' format suitable for inclusion in the asset registry.
 * @param {string} fullPath - Absolute path to the file.
 * @returns {Promise<string>} - 'sha256:' prefix + 64-char hex digest.
 */
function hashFile(fullPath) {
  return new Promise((resolve, reject) => {
    const h = crypto.createHash('sha256');
    const stream = fsSync.createReadStream(fullPath);
    stream.on('error', reject);
    stream.on('data', chunk => h.update(chunk));
    stream.on('end', () => resolve('sha256:' + h.digest('hex')));
  });
}

function slugId(name) {
  return name.replace(/\.(css|js)$/i, '').replace(/[^a-z0-9]+/gi, '-').replace(/-+/g, '-').replace(/^-|-$/g, '').toLowerCase();
}

function extractVersion(name) {
  const m = name.match(/(\d+\.\d+(?:\.\d+)*)/);
  return m ? m[1] : null;
}

function priorityFor(kind, isCore) {
  if (isCore) return 100;
  if (kind === 'uikit') return 90;
  if (kind === 'integration') return 80;
  if (kind === 'extension') return 70;
  if (kind === 'experimental') return 50;
  return 10;
}

/**
 * Build the asset registry manifest by walking, classifying, and hashing
 * every CSS/JS file under the project's assets directories.
 * @param {{ rootDir?: string, outPath?: string, includeMinified?: boolean }} [opts]
 *   `rootDir` defaults to process.cwd(). `outPath` defaults to <rootDir>/assets/toolskin-assets-map.json.
 *   `includeMinified` defaults to false.
 * @returns {Promise<object>} - The written manifest object.
 */
async function buildManifest(opts = {}) {
  const rootDir = opts.rootDir || process.cwd();
  const outPath = opts.outPath || path.join(rootDir, 'assets', 'toolskin-assets-map.json');
  const includeMinified = !!opts.includeMinified;

  const files = await walk(rootDir, { includeMinified });
  const records = [];
  for (const f of files) {
    const cls = classify(f.name, f.relPath);
    const hash = await hashFile(f.fullPath);
    records.push({
      id: slugId(f.name),
      type: cls.type,
      name: f.name,
      path: f.relPath,                                     // already forward-slash from walk()
      folder: path.dirname(f.relPath).replace(/\\/g, '/'), // defensive normalize
      size: f.size,
      modified: f.modified.toISOString(),
      hash,
      isCore: cls.isCore,
      kind: cls.kind,
      version: extractVersion(f.name),
      tags: [],
      priority: priorityFor(cls.kind, cls.isCore),
    });
  }
  records.sort((a, b) => (b.priority - a.priority) || a.name.localeCompare(b.name));

  const stats = { css: 0, js: 0, total: records.length };
  for (const r of records) { if (stats[r.type] !== undefined) stats[r.type]++; }

  const manifest = {
    generated: new Date().toISOString(),
    generator: 'build-asset-map.js@1.0',
    root: 'assets/',
    stats,
    files: records,
  };
  await fs.mkdir(path.dirname(outPath), { recursive: true });
  await fs.writeFile(outPath, JSON.stringify(manifest, null, 2) + '\n', 'utf8');
  return manifest;
}

if (require.main === module) {
  const args = process.argv.slice(2);
  const includeMinified = args.includes('--include-minified');
  const outIdx = args.indexOf('--out');
  const outPath = outIdx >= 0 ? args[outIdx + 1] : undefined;
  buildManifest({ includeMinified, outPath })
    .then(m => {
      console.log('[build-asset-map] wrote ' + m.stats.total + ' records (' +
        m.stats.css + ' css, ' + m.stats.js + ' js) to ' +
        (outPath || 'assets/toolskin-assets-map.json'));
    })
    .catch(err => { console.error(err); process.exit(1); });
}

module.exports = { classify, isExcluded, walk, hashFile, buildManifest };

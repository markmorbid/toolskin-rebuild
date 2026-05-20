'use strict';
const path = require('node:path');
const fs = require('node:fs/promises');
const test = require('node:test');
const assert = require('node:assert/strict');
const { classify, isExcluded, walk } = require('./build-asset-map');

test('classify: toolskin.css → core/css', () => {
  const r = classify('toolskin.css');
  assert.equal(r.kind, 'core');
  assert.equal(r.type, 'css');
  assert.equal(r.isCore, true);
});

test('classify: toolskin-merged-3.2.5.css → core/css', () => {
  const r = classify('toolskin-merged-3.2.5.css');
  assert.equal(r.kind, 'core');
  assert.equal(r.type, 'css');
  assert.equal(r.isCore, true);
});

test('classify: toolskin-uikit.css → uikit (not core)', () => {
  const r = classify('toolskin-uikit.css');
  assert.equal(r.kind, 'uikit');
  assert.equal(r.type, 'css');
  assert.equal(r.isCore, false);
});

test('classify: toolskin-assets.js → assets-loader', () => {
  const r = classify('toolskin-assets.js');
  assert.equal(r.kind, 'assets-loader');
  assert.equal(r.type, 'js');
  assert.equal(r.isCore, false);
});

test('classify: toolskin.js → core/js', () => {
  const r = classify('toolskin.js');
  assert.equal(r.kind, 'core');
  assert.equal(r.type, 'js');
  assert.equal(r.isCore, true);
});

test('classify: toolskin.bannerGenerator.js → integration', () => {
  const r = classify('toolskin.bannerGenerator.js');
  assert.equal(r.kind, 'integration');
  assert.equal(r.type, 'js');
  assert.equal(r.isCore, false);
});

test('classify: ts-patterns.css → extension', () => {
  const r = classify('ts-patterns.css');
  assert.equal(r.kind, 'extension');
  assert.equal(r.type, 'css');
  assert.equal(r.isCore, false);
});

test('classify: extra-styles.css → extension', () => {
  const r = classify('extra-styles.css');
  assert.equal(r.kind, 'extension');
  assert.equal(r.type, 'css');
  assert.equal(r.isCore, false);
});

test('classify: toolskin-experiment.css → experimental', () => {
  const r = classify('toolskin-experiment.css');
  assert.equal(r.kind, 'experimental');
  assert.equal(r.type, 'css');
  assert.equal(r.isCore, false);
});

test('classify: random.css → other', () => {
  const r = classify('random.css');
  assert.equal(r.kind, 'other');
  assert.equal(r.type, 'css');
  assert.equal(r.isCore, false);
});

test('isExcluded: node_modules paths', () => {
  assert.equal(isExcluded('node_modules/foo/bar.css'), true);
});

test('isExcluded: _bu* directories', () => {
  assert.equal(isExcluded('_bu/old.css'), true);
  assert.equal(isExcluded('_bu_1/old.css'), true);
  assert.equal(isExcluded('assets/_bu_2/old.css'), true);
});

test('isExcluded: files starting with _bu but NOT in _bu* directory → not excluded', () => {
  assert.equal(isExcluded('assets/css/_button.css'), false);
  assert.equal(isExcluded('assets/css/_bumpy-thing.css'), false);
  assert.equal(isExcluded('assets/js/_built.js'), false);
});

test('isExcluded: _bu directory bare path (no trailing slash) → excluded', () => {
  assert.equal(isExcluded('assets/css/_bu'), true);
  assert.equal(isExcluded('assets/css/_bu_1'), true);
  assert.equal(isExcluded('_bu'), true);
});

test('isExcluded: *.min.js when includeMinified=false', () => {
  assert.equal(isExcluded('assets/js/foo.min.js', { includeMinified: false }), true);
  assert.equal(isExcluded('assets/js/foo.min.js', { includeMinified: true }), false);
});

test('isExcluded: docs/_canonical-merge-sources', () => {
  assert.equal(isExcluded('docs/_canonical-merge-sources/foo.css'), true);
});

test('isExcluded: docs/_unintegrated-patches', () => {
  assert.equal(isExcluded('docs/_unintegrated-patches/foo.css'), true);
});

test('isExcluded: *.user.css userscripts', () => {
  assert.equal(isExcluded('assets/css/Higgsfield_Automation_v4.9.6.user.css'), true);
  assert.equal(isExcluded('assets/css/Suno_Automation_v3.8.1.user.css'), true);
});

test('isExcluded: *.min.css when includeMinified=false', () => {
  assert.equal(isExcluded('assets/css/foo.min.css', { includeMinified: false }), true);
  assert.equal(isExcluded('assets/css/foo.min.css', { includeMinified: true }), false);
});

test('isExcluded: regular toolskin.css → not excluded', () => {
  assert.equal(isExcluded('assets/css/toolskin.css'), false);
});

test('isExcluded: .git path', () => {
  assert.equal(isExcluded('.git/objects/foo'), true);
});

const FIXTURE = path.join(__dirname, '__fixtures__');

test('walk: returns CSS + JS, skips userscripts/_bu/canonical-merge-sources', async () => {
  const out = await walk(FIXTURE, { roots: ['assets/css', 'assets/js'] });
  const names = out.map(f => f.relPath).sort();
  assert.deepEqual(names, [
    'assets/css/_old/toolskin-merged-3.2.5.css',
    'assets/css/toolskin-uikit.css',
    'assets/css/toolskin.css',
    'assets/js/toolskin.js',
  ]);
});

test('walk: returns absolute path + size + mtime', async () => {
  const out = await walk(FIXTURE, { roots: ['assets/css'] });
  const tk = out.find(f => f.relPath.endsWith('toolskin.css'));
  assert.ok(tk);
  assert.equal(typeof tk.size, 'number');
  assert.ok(tk.size > 0);
  assert.ok(tk.modified instanceof Date);
  assert.ok(path.isAbsolute(tk.fullPath));
});

const { hashFile } = require('./build-asset-map');

test('hashFile: deterministic sha256 of single byte "a"', async () => {
  const fixture = path.join(FIXTURE, 'assets/css/toolskin.css');
  const h = await hashFile(fixture);
  // sha256 of "a"
  assert.equal(h, 'sha256:ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb');
});

test('hashFile: differs for different content', async () => {
  const fixture = path.join(FIXTURE, 'assets/css/toolskin.css');
  const h1 = await hashFile(fixture);
  await fs.writeFile(fixture, 'b'); // mutate
  const h2 = await hashFile(fixture);
  await fs.writeFile(fixture, 'a'); // restore
  assert.notEqual(h1, h2);
});

const { buildManifest } = require('./build-asset-map');
const os = require('node:os');

test('buildManifest: produces correct shape against fixture', async () => {
  const tmpOut = path.join(os.tmpdir(), 'ts-test-' + Date.now() + '.json');
  await buildManifest({ rootDir: FIXTURE, outPath: tmpOut });
  const raw = await fs.readFile(tmpOut, 'utf8');
  const m = JSON.parse(raw);
  assert.equal(typeof m.generated, 'string');
  assert.equal(m.generator.startsWith('build-asset-map.js'), true);
  assert.equal(typeof m.stats.total, 'number');
  assert.ok(m.stats.total >= 4);
  const tk = m.files.find(f => f.name === 'toolskin.css');
  assert.ok(tk);
  assert.equal(tk.kind, 'core');
  assert.equal(tk.isCore, true);
  assert.equal(tk.hash.startsWith('sha256:'), true);
  assert.equal(tk.path, 'assets/css/toolskin.css');  // forward-slash, normalized at walker emission
  await fs.unlink(tmpOut);
});

test('buildManifest: assigns slug-style ids and version when present', async () => {
  const tmpOut = path.join(os.tmpdir(), 'ts-test-' + Date.now() + '.json');
  await buildManifest({ rootDir: FIXTURE, outPath: tmpOut });
  const m = JSON.parse(await fs.readFile(tmpOut, 'utf8'));
  const v = m.files.find(f => f.name === 'toolskin-merged-3.2.5.css');
  assert.ok(v);
  assert.equal(v.id, 'toolskin-merged-3-2-5');
  assert.equal(v.version, '3.2.5');
  await fs.unlink(tmpOut);
});

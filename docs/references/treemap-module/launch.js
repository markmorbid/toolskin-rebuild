#!/usr/bin/env node
/**
 * launch.js — one-click launcher for the Toolskin Tree Explorer.
 *
 * Lives inside the _tree-explorer/ machinery folder. The visible
 * Tree-Explorer.bat (or .command) at the project root calls this.
 *
 * Zero dependencies. It:
 *   1. Finds a free port automatically.
 *   2. Defaults the scan target to the PARENT of _tree-explorer/
 *      (i.e. your actual project), not the machinery folder.
 *   3. Asks which folder to scan (Enter = the project root).
 *   4. Asks the mode:
 *        [1] Scan + open  — build, open the explorer in your browser,
 *                           stay up (use Rebuild/Clean in the UI).  ← default
 *        [2] Scan only    — build the JSON, show a summary, then close.
 *   5. Auto-opens the browser on the explorer URL (mode 1).
 *   6. On finish, prints a summary and waits for a key, then shuts the
 *      port + closes cleanly.
 *
 * The HTML template is NEVER modified. Only JSON data is written, into
 * this machinery folder, where the page fetches it.
 */

'use strict';

const http     = require('http');
const net      = require('net');
const fs       = require('fs');
const path     = require('path');
const cp        = require('child_process');
const readline = require('readline');

const APP_DIR    = __dirname;                        // _tree-explorer/
const PROJECT    = path.resolve(APP_DIR, '..');      // the folder the trigger sits in
const SERVER_JS  = path.join(APP_DIR, 'server.js');
const HTML_FILE  = path.join(APP_DIR, 'tree-explorer.html');

const tty = process.stdout.isTTY;
const c = {
  b:  s => tty ? '\x1b[1m'  + s + '\x1b[0m' : s,
  g:  s => tty ? '\x1b[32m' + s + '\x1b[0m' : s,
  y:  s => tty ? '\x1b[33m' + s + '\x1b[0m' : s,
  r:  s => tty ? '\x1b[31m' + s + '\x1b[0m' : s,
  c:  s => tty ? '\x1b[36m' + s + '\x1b[0m' : s,
  dim:s => tty ? '\x1b[2m'  + s + '\x1b[0m' : s,
};
function line() { console.log(c.dim('-'.repeat(58))); }

function ask(q) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise(res => rl.question(q, a => { rl.close(); res(a.trim()); }));
}

function pressAnyKey(msg) {
  return new Promise(resolve => {
    process.stdout.write('\n' + (msg || c.dim('Press any key to close...')));
    const stdin = process.stdin;
    if (!stdin.isTTY) { console.log(''); return resolve(); }
    const wasRaw = stdin.isRaw;
    stdin.setRawMode(true); stdin.resume();
    stdin.once('data', () => { stdin.setRawMode(wasRaw || false); stdin.pause(); console.log(''); resolve(); });
  });
}

function freePort(preferred) {
  return new Promise(resolve => {
    function tryPort(p) {
      const srv = net.createServer();
      srv.once('error', () => { try { srv.close(); } catch (e) {} tryPort(0); });
      srv.once('listening', () => { const port = srv.address().port; srv.close(() => resolve(port)); });
      srv.listen(p, '127.0.0.1');
    }
    tryPort(preferred || 8080);
  });
}

function openBrowser(url) {
  const plat = process.platform;
  try {
    if (plat === 'win32')       cp.spawn('cmd', ['/c', 'start', '', url], { detached: true, stdio: 'ignore' }).unref();
    else if (plat === 'darwin') cp.spawn('open', [url], { detached: true, stdio: 'ignore' }).unref();
    else                        cp.spawn('xdg-open', [url], { detached: true, stdio: 'ignore' }).unref();
  } catch (e) {}
}

function readSummary() {
  let folders = 0, files = 0, dupGroups = 0, wastedMb = 0;
  try {
    const tree = JSON.parse(fs.readFileSync(path.join(APP_DIR, 'tree-explorer.data.json'), 'utf8'));
    (function walk(list) {
      for (const n of list) { if (n.type === 'folder') folders++; else files++; if (n.children && n.children.length) walk(n.children); }
    })(tree);
  } catch (e) {}
  try {
    const d = JSON.parse(fs.readFileSync(path.join(APP_DIR, 'tree-explorer.dedup.json'), 'utf8'));
    dupGroups = (d.summary && d.summary.duplicate_groups) || 0;
    wastedMb  = (d.summary && d.summary.wasted_mb) || 0;
  } catch (e) {}
  return { folders, files, dupGroups, wastedMb };
}

function triggerBuild(port) {
  return new Promise((resolve, reject) => {
    const req = http.request({ host: '127.0.0.1', port, path: '/api/build-tree', method: 'POST' }, res => {
      let body = ''; res.on('data', d => body += d); res.on('end', () => { try { resolve(JSON.parse(body)); } catch (e) { reject(e); } });
    });
    req.on('error', reject); req.end();
  });
}

(async function main() {
  if (console.clear) console.clear();
  line();
  console.log(c.b('  TOOLSKIN  ·  Tree Explorer'));
  line();

  if (!fs.existsSync(SERVER_JS) || !fs.existsSync(HTML_FILE)) {
    console.log(c.r('  Machinery files missing from ' + APP_DIR));
    console.log('  Expected server.js + tree-explorer.html alongside launch.js.');
    await pressAnyKey();
    process.exit(1);
  }

  console.log('  Project: ' + c.c(PROJECT));

  // 1. Folder to scan (default = the project root, NOT the machinery folder)
  const ans = await ask('\n  Folder to scan ' + c.dim('(Enter = project root)') + ':  ');
  let scanDir = ans ? path.resolve(ans.replace(/^["']|["']$/g, '')) : PROJECT;
  if (!fs.existsSync(scanDir) || !fs.statSync(scanDir).isDirectory()) {
    console.log(c.r('  That folder does not exist. Using the project root instead.'));
    scanDir = PROJECT;
  }
  console.log('  Scanning: ' + c.c(scanDir));

  // 2. Mode (default = 1, scan + open)
  console.log('\n  ' + c.b('Mode:'));
  console.log('   [1] Scan + open ' + c.dim('— build, open in browser, stay running   (default)'));
  console.log('   [2] Scan only   ' + c.dim('— build the JSON, summary, then close'));
  const mode = (await ask('\n  Choose 1 or 2 ' + c.dim('(Enter = 1)') + ':  ')) || '1';

  // 3. Free port + start server (serve HTML from APP_DIR, scan the chosen folder)
  const port = await freePort(8080);
  console.log('\n  Starting on port ' + c.c(String(port)) + ' ...');
  const server = cp.spawn(process.execPath, [SERVER_JS, scanDir, '--app', APP_DIR, '--port', String(port)],
    { cwd: APP_DIR, stdio: ['ignore', 'pipe', 'pipe'] });
  server.stderr.on('data', d => process.stderr.write(c.r(d.toString())));
  await new Promise(r => setTimeout(r, 900));

  // 4. Build
  console.log('  Scanning filesystem ...');
  let result;
  try { result = await triggerBuild(port); }
  catch (e) { console.log(c.r('  Build request failed: ' + e.message)); server.kill(); await pressAnyKey(); process.exit(1); }
  if (!result || !result.ok) {
    console.log(c.r('  Build failed: ' + ((result && result.error) || 'unknown')));
    server.kill(); await pressAnyKey(); process.exit(1);
  }

  // 5. Summary
  const s = readSummary();
  console.log('');
  line();
  console.log('  ' + c.g('Build complete'));
  console.log('  Folders   : ' + c.b(String(s.folders)));
  console.log('  Files     : ' + c.b(String(s.files)));
  console.log('  Output    : ' + c.c('_tree-explorer/_treemap-output/' + (result.file ? path.basename(result.file) : '')));
  if (s.dupGroups) console.log('  Duplicates: ' + c.y(s.dupGroups + ' group(s), ~' + s.wastedMb + ' MB wasted'));
  line();

  if (mode.charAt(0) === '2') {
    server.kill();
    await pressAnyKey(c.dim('Press any key to finish and close...'));
    process.exit(0);
  }

  // Scan + open
  const url = 'http://localhost:' + port + '/tree-explorer.html';
  console.log('  Opening   : ' + c.c(url));
  openBrowser(url);
  console.log('\n  ' + c.b('Server is running.') + ' The explorer should open in your browser.');
  console.log('  ' + c.dim('If not, open the URL above. Use Rebuild / Clean in the UI.'));
  await pressAnyKey(c.y('Press any key to stop the server and close...'));
  server.kill();
  console.log(c.g('  Stopped. Bye.'));
  process.exit(0);
})().catch(async err => {
  console.error(c.r('  Launcher error: ' + (err && err.message || err)));
  await pressAnyKey();
  process.exit(1);
});

// capture-sandbox.mjs — Session 3+ block-sandbox capture (build-time tool — Rule 13, not shipped).
//
// Captures the rebuild's OWN sandbox files (sandbox/**/*.html) over file://, so a
// council can review the rebuilt feature against the Wave 1.6 reference. Distinct
// from capture.mjs, which captures the read-only toolskin-showcase reference repo.
//
// Output: docs/handoffs/_visual-audit/sandbox/<name>.png
//
// Usage: node tools/visual-audit/capture-sandbox.mjs

import { chromium } from 'playwright';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, resolve } from 'node:path';
import { mkdirSync } from 'node:fs';

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, '../..');
const outDir = resolve(repoRoot, 'docs/handoffs/_visual-audit/sandbox');
mkdirSync(outDir, { recursive: true });

const sandbox = pathToFileURL(resolve(repoRoot, 'sandbox/01-system/surfaces.html')).href;

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
const page = await ctx.newPage();

const errs = [];
page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
page.on('pageerror', (e) => errs.push('PAGEERROR: ' + e.message));

async function shoot(name, opts = {}) {
  await page.screenshot({ path: resolve(outDir, name + '.png'), ...opts });
  console.log('  ' + name + '.png');
}

await page.goto(sandbox, { waitUntil: 'load', timeout: 30000 });
await page.evaluate(() => document.fonts && document.fonts.ready).catch(() => {});
await page.waitForTimeout(400);

// 1. Dark theme — full page (default)
await shoot('01-system-surfaces-dark', { fullPage: true });

// 2. Derivative-chain section only (council review of the chain swatches)
const chain = await page.$('#chain-root');
if (chain) await shoot('01-system-surfaces-chain', { clip: await chain.boundingBox() });

// 3. Hover state on the interactive demo card
const card = await page.$('#demoCard');
if (card) {
  await card.hover();
  await page.waitForTimeout(250);
  if (chain) await shoot('01-system-surfaces-hover', { clip: await chain.boundingBox() });
}

// 4. Light theme — full page (click the real toggle, as a user would)
await page.click('#theme');
await page.waitForTimeout(350);
await shoot('01-system-surfaces-light', { fullPage: true });

await browser.close();

if (errs.length) {
  console.log('\nCONSOLE ERRORS (' + errs.length + '):\n' + [...new Set(errs)].join('\n'));
  process.exitCode = 1;
} else {
  console.log('\nDONE — no console errors. Captures -> ' + outDir);
}

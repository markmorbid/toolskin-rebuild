// capture.mjs — Wave 1.6 visual audit capture (build-time tool — Rule 13, not shipped).
//
// Loads the read-only reference showcase (../toolskin-showcase/) over file:// — the same
// loading method the owner uses for GoFullPage ground-truth, so headless captures stay
// comparable to real-Chrome captures.
//
// Output: docs/handoffs/_visual-audit/screenshots/<viewport>-<theme>-<page>-<surface>.png
// plus _capture-manifest.txt (count + MISSING / SKIP / CONSOLE diagnostics for the analyst).

import { chromium } from 'playwright';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, resolve } from 'node:path';
import { mkdirSync, writeFileSync } from 'node:fs';

const here = dirname(fileURLToPath(import.meta.url));
const showcaseRoot = resolve(here, '../../../toolskin-showcase'); // read-only reference repo
const outDir = resolve(here, '../../docs/handoffs/_visual-audit/screenshots');
mkdirSync(outDir, { recursive: true });

const viewports = {
  desktop: { width: 1920, height: 1080 },
  tablet:  { width: 1024, height: 768 },
  mobile:  { width: 375,  height: 812 },
};
const themes = ['dark', 'light'];

// Section anchors verified by grep against the showcase HTML (Wave 1.6 W1.6.2).
const pages = {
  index: {
    file: 'index.html',
    sections: ['top', 'typography', 'components', 'ui-kit', 'marquee-documentation',
               'forms', 'cards', 'panels', 'social-links', 'footer-showcase',
               'mockups', 'banner-generator', 'portfolio'],
    sectionViewports: ['desktop', 'mobile'], // responsive per-section for the component-rich page
  },
  lab: {
    file: 'toolskin-lab.html',
    sections: ['toast', 'accordion', 'select', 'spinner', 'tooltips', 'drag-resize',
               'sortable', 'controls', 'table', 'masonry', 'api'],
    sectionViewports: ['desktop'],
  },
};

let count = 0;
const log = [];
const note = (m) => { log.push(m); };

async function applyTheme(page, theme) {
  await page.evaluate((t) => {
    document.documentElement.setAttribute('data-theme', t);
    document.documentElement.setAttribute('data-ts-theme', t);
  }, theme);
  await page.waitForTimeout(450); // let CSS theme transitions settle
}

async function settle(page) {
  await page.evaluate(() => document.fonts && document.fonts.ready).catch(() => {});
  await page.waitForTimeout(900); // CDN fonts / FontAwesome / canvas warm-up
}

async function shoot(target, name, opts = {}) {
  await target.screenshot({ path: resolve(outDir, name + '.png'), ...opts });
  count++;
  note(name + '.png');
}

const browser = await chromium.launch();

for (const [pageKey, def] of Object.entries(pages)) {
  const url = pathToFileURL(resolve(showcaseRoot, def.file)).href;
  for (const theme of themes) {
    for (const [vpName, vp] of Object.entries(viewports)) {
      const ctx = await browser.newContext({ viewport: vp, deviceScaleFactor: 1 });
      // Pre-seed localStorage so the showcase's own inline theme IIFE applies the theme on first paint.
      await ctx.addInitScript((t) => {
        try { localStorage.setItem('ts-theme-mode', t); } catch (e) { /* ignore */ }
      }, theme);
      const page = await ctx.newPage();
      const errs = [];
      page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
      page.on('pageerror', (e) => errs.push('PAGEERROR: ' + e.message));
      page.on('requestfailed', (r) => errs.push('REQFAIL: ' + r.url().slice(0, 120)));

      await page.goto(url, { waitUntil: 'load', timeout: 60000 }).catch((e) => note(`GOTO-FAIL ${pageKey}: ${e.message}`));
      await applyTheme(page, theme);
      await settle(page);

      await shoot(page, `${vpName}-${theme}-${pageKey}-fullpage`, { fullPage: true })
        .catch((e) => note(`SKIP ${vpName}-${theme}-${pageKey}-fullpage: ${e.message}`));

      if (def.sectionViewports.includes(vpName)) {
        for (const sec of def.sections) {
          const el = await page.$('#' + sec);
          if (!el) { note(`MISSING #${sec} on ${pageKey} (${vpName}/${theme})`); continue; }
          await el.scrollIntoViewIfNeeded().catch(() => {});
          await page.waitForTimeout(180);
          await shoot(el, `${vpName}-${theme}-${pageKey}-section-${sec}`)
            .catch((e) => note(`SKIP ${vpName}-${theme}-${pageKey}-section-${sec}: ${e.message}`));
        }
      }

      if (errs.length) note(`CONSOLE[${vpName}-${theme}-${pageKey}] ${[...new Set(errs)].slice(0, 6).join(' | ')}`);
      await ctx.close();
    }
  }
}

// --- Interactive states (desktop, both themes, best-effort) ---
for (const theme of themes) {
  // Accordion expanded — toolskin-lab.html #accordion
  {
    const ctx = await browser.newContext({ viewport: viewports.desktop });
    await ctx.addInitScript((t) => { try { localStorage.setItem('ts-theme-mode', t); } catch (e) {} }, theme);
    const page = await ctx.newPage();
    await page.goto(pathToFileURL(resolve(showcaseRoot, 'toolskin-lab.html')).href, { waitUntil: 'load', timeout: 60000 }).catch(() => {});
    await applyTheme(page, theme);
    await settle(page);
    const trigger = await page.$(
      '#accordion .ts-accordion__header, #accordion [class*="accordion__trigger"], #accordion button, #accordion summary'
    );
    if (trigger) { await trigger.click().catch(() => {}); await page.waitForTimeout(600); }
    else note(`SKIP state-accordion (${theme}): no trigger found`);
    const acc = await page.$('#accordion');
    if (acc) await shoot(acc, `desktop-${theme}-state-accordion-expanded`).catch((e) => note('SKIP accordion: ' + e.message));
    await ctx.close();
  }
  // Tabs switched — index.html .ts-tab-wrap
  {
    const ctx = await browser.newContext({ viewport: viewports.desktop });
    await ctx.addInitScript((t) => { try { localStorage.setItem('ts-theme-mode', t); } catch (e) {} }, theme);
    const page = await ctx.newPage();
    await page.goto(pathToFileURL(resolve(showcaseRoot, 'index.html')).href, { waitUntil: 'load', timeout: 60000 }).catch(() => {});
    await applyTheme(page, theme);
    await settle(page);
    const inactiveTab = await page.$('.ts-tabs .ts-tab:not(.ts-tab--active)');
    if (inactiveTab) { await inactiveTab.scrollIntoViewIfNeeded().catch(() => {}); await inactiveTab.click().catch(() => {}); await page.waitForTimeout(450); }
    else note(`SKIP state-tabs (${theme}): no inactive tab found`);
    const wrap = await page.$('.ts-tab-wrap');
    if (wrap) await shoot(wrap, `desktop-${theme}-state-tabs-switched`).catch((e) => note('SKIP tabs: ' + e.message));
    await ctx.close();
  }
}

await browser.close();

const diagnostics = log.filter((l) => /^(MISSING|SKIP|CONSOLE|GOTO-FAIL)/.test(l));
writeFileSync(
  resolve(outDir, '_capture-manifest.txt'),
  `Wave 1.6 visual audit capture\nGenerated: ${new Date().toISOString()}\nScreenshots written: ${count}\n\n` +
  `--- DIAGNOSTICS (${diagnostics.length}) ---\n${diagnostics.join('\n') || '(none)'}\n\n` +
  `--- ALL FILES ---\n${log.filter((l) => l.endsWith('.png')).join('\n')}\n`
);

console.log(`DONE: ${count} screenshots -> ${outDir}`);
if (diagnostics.length) console.log(`Diagnostics (${diagnostics.length}):\n` + diagnostics.join('\n'));

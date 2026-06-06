# Toolskin Workspace — Source of Truth Map
**Generated:** 2026-06-04 · **Scope:** `toolskin-rebuild/` + `toolskin-showcase/`

---

## The one-sentence answer

> **`toolskin-rebuild/assets/css/next/`** is canonical for CSS.
> **`toolskin-showcase/`** is frozen reference — never write to it.
> Everything else is either a working harness, a backup, or clutter.

---

## Canonical file map

| What | Canonical path | Status |
|---|---|---|
| Token primitives | `toolskin-rebuild/assets/css/next/primitives/` | ✅ Canonical |
| System tokens | `toolskin-rebuild/assets/css/next/system/` | ✅ Canonical |
| Nav component CSS | `toolskin-rebuild/assets/css/next/components/ts-nav-header.css` (= 2.3.4) | ✅ Canonical · read-only |
| Button component CSS | `toolskin-rebuild/assets/css/next/components/ts-btn_v3.1.css` | ✅ Canonical |
| Promo banner CSS | `toolskin-rebuild/assets/css/next/components/ts-promo-banner.css` | ✅ Canonical |
| Harness CSS | `toolskin-rebuild/assets/css/next/harness.css` | ✅ Canonical |
| Nav JS behaviors | `toolskin-rebuild/assets/js/next/ts-nav.js` | ✅ Canonical |
| Icon injection JS | `toolskin-rebuild/assets/js/next/ts-icons.js` | ✅ Canonical |
| Harness tester JS | `toolskin-rebuild/assets/js/next/harness-tester.js` | ✅ Canonical |
| Auto-icon addon JS | `toolskin-rebuild/assets/js/next/ts-nav-auto-icons.js` | ⚠️ Staging — merge into ts-nav.js |
| Component harnesses | **Claude Design project** `portable-02-components/` | ✅ Live working harnesses |
| Expert designer skill | `toolskin-rebuild/expert-designer/SKILL.md` | ✅ Canonical (v8 ready — see below) |
| Expert designer skill mirror | `toolskin-rebuild/.claude/skills/expert-designer/SKILL.md` | ⚠️ Stale — must be synced with above |
| Old showcase CSS | `toolskin-showcase/assets/css/toolskin-merged-*.css` | 🔒 Frozen reference — never edit |
| Old showcase JS | `toolskin-showcase/assets/js/` | 🔒 Frozen reference |

---

## SKILL sync status

Both copies of `SKILL.md` are **currently identical at v7.0.0**.
`docs/skills/expert-designer-v8.md` in this project is the v8 update.

**To deploy v8:**
```bash
cp docs/skills/expert-designer-v8.md toolskin-rebuild/expert-designer/SKILL.md
cp docs/skills/expert-designer-v8.md toolskin-rebuild/.claude/skills/expert-designer/SKILL.md
```
Then commit: `git commit -m "skill: expert-designer v8 — nav patterns encoded"`

---

## Duplicate file pairs (same content, different paths)

| File A | File B | Keep |
|---|---|---|
| `toolskin-rebuild/expert-designer/SKILL.md` | `toolskin-rebuild/.claude/skills/expert-designer/SKILL.md` | Both (by design — .claude auto-loads on agent start) |
| `toolskin-rebuild/handoffs/claude-design-nav-handoff.md` | Pasted text in this session | handoffs/ copy is canonical |
| `toolskin-rebuild/handoffs/directive-portable-components-handoff.md` | `toolskin-showcase/docs/handoffs/` (check) | toolskin-rebuild/handoffs/ is canonical |
| `toolskin-rebuild/expert-designer/ts-topbar-nav-v3 (standalone).html` | `portable-02-components/ts-topbar-nav-v3 (standalone).html` | Claude Design project copy |
| `toolskin-rebuild/expert-designer/portable-02-components/ts-topbar-nav.html` | `toolskin-rebuild/_portable-02-components/ts-topbar-nav.html` | `_portable-02-components/` is the backing kit |

---

## What is deprecated (→ `_archived`)

These exist but are superseded. Move to `toolskin-rebuild/_archived/` (create if absent).

| Path | Why deprecated |
|---|---|
| `toolskin-rebuild/session5-system-fix/` | Past session subdirectory; content integrated into master |
| `toolskin-rebuild/expert-designer/portable-02-components/index - Copy.html` | Unnamed copy |
| `toolskin-rebuild/expert-designer/portable-02-components/index - Copy (2).html` | Unnamed copy |
| `toolskin-rebuild/_portable-02-components/index - Copy.html` | Unnamed copy |
| `toolskin-rebuild/_output/` | Transient output files (`prefiltered.json` etc.) |
| `toolskin-showcase/_session-staging/toolskin_ruined-1.css` | Explicitly broken state |
| `toolskin-showcase/_session-staging/toolskin-ruined-2.css` | Explicitly broken state |
| `toolskin-showcase/_session-staging/toolskin - Copy.css` | Unnamed copy |
| `toolskin-showcase/_session-staging/temp-file-to-diff.css` | Temp diff scratch file |
| `toolskin-showcase/_bu/*.zip` (the 4 root-level zips) | Duplicated archives of named subfolders |

---

## What is a _review candidate (→ `_review/`)

See `docs/workspace-audit/_review-manifest.md` for feature-extraction notes.

| Path | Category |
|---|---|
| `toolskin-rebuild/expert-designer/portable-02-components/gradients-v3-bento.html` | Layout |
| `toolskin-rebuild/expert-designer/portable-02-components/this-bg-v2-showcase.html` | System |
| `toolskin-rebuild/expert-designer/portable-02-components/toolskin-type-v2.css` + `Toolskin Type Scale v2.html` | Typography |
| `toolskin-rebuild/expert-designer/portable-02-components/ts-btn_v3.1.html` | Component |
| `toolskin-showcase/_bu/banner-generator-v2.html` | Tool |
| `toolskin-showcase/_bu/customized_v4amn.css` | Token layer |
| `toolskin-showcase/_sandbox/experimental-components/` | Components |
| `toolskin-showcase/docs/_unintegrated-patches/` | Integration queue |

---

## What should NOT be touched

| Path | Why |
|---|---|
| `toolskin-rebuild/backups/` | Owner safety net — date-stamped, never delete |
| `toolskin-rebuild/expert-designer/_archived/` | Already archived by owner |
| `toolskin-showcase/_bu/` | Owner backup history — all dated, frozen |
| `toolskin-rebuild/.remember/` | Agent session memory — active, never delete |
| `toolskin-rebuild/.impeccable.md` | Intentional-decisions registry — never modify |
| Any file with `nbackup` / `just in case` in the name | Owner panic-saves — respect them |

---

## CSS file weight comparison (key files)

| File | Est. lines | Notes |
|---|---|---|
| `ts-nav-header.css` (canonical 2.3.4) | 3,240 | Includes browser reset, full nav system |
| `toolskin-showcase` `toolskin-merged-3.2.6._4.2.css` | ~6,000+ | Monolithic — reference only |
| `pending-to-integrate.css` (quarantine) | 2,722 | Kitchen sink — **do not link** |
| `ts-btn_v3.1.css` | ~400 | Clean — canonical |
| `harness.css` | 532 | Scaffold only |
| `ts-nav-header_2.3.4.css` vs current `ts-nav-header.css` | **same** | Identical — 2.3.4 is the current version |

**Key finding:** `ts-nav-header_2.3.4.css` in `_portable-02-components/assets/css/next/components/`
and `ts-nav-header.css` in the live project are **the same file** (3,240 lines each). The `_portable`
copy is the backing kit given to Claude Design; the project copy is what Claude Design uses directly.

---

## The two repos in one sentence each

**`toolskin-rebuild/`** — the rebuild in progress. Everything canonical lives here.
CSS is being decomposed block by block from the monolithic showcase CSS into clean primitives + components.

**`toolskin-showcase/`** — the original production site. Frozen. Read-only.
Contains the battle-tested monolithic CSS (`toolskin-merged-3.2.6._4.2.css`) that the rebuild is extracting from.
Never commit here. Use it only for "what did the original do?"

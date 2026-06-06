#!/usr/bin/env node
/**
 * guard.mjs — Claude Code PreToolUse ENFORCEMENT hook
 * ====================================================
 * Prompts are suggestions. Hooks are guarantees. This hook converts the
 * owner's most-violated rules from prose into GATES that BLOCK the action.
 *
 * A PreToolUse hook that exits with permissionDecision "deny" blocks the
 * tool call — even in bypassPermissions mode. The agent physically cannot
 * do the forbidden thing.
 *
 * Register in .claude/hooks/settings.json under PreToolUse with matcher
 * "Write|Edit|MultiEdit|Bash".
 *
 * ENFORCES:
 *   1. B-9  — backup-before-overwrite of protected / owner-WIP files
 *   2. HALT — no `git commit` while pending-approval.flag exists
 *   3. backups/ is append-only — no delete/overwrite of anything under it
 *   4. no destructive git (force-push, reset --hard, clean -fd, stash drop)
 *
 * Reads the tool-call JSON on stdin. Emits a permissionDecision JSON.
 * Fails OPEN on its own internal error (never bricks the agent) EXCEPT
 * it fails CLOSED on the destructive-git checks (safety over convenience).
 */

import { readFileSync, existsSync, readdirSync } from "node:fs";
import { execSync } from "node:child_process";

function deny(reason) {
  process.stdout.write(JSON.stringify({
    hookSpecificOutput: {
      hookEventName: "PreToolUse",
      permissionDecision: "deny",
      permissionDecisionReason: reason,
    },
  }));
  process.exit(0);
}
function allow() { process.exit(0); }

let input;
try {
  input = JSON.parse(readFileSync(0, "utf-8"));
} catch {
  allow(); // can't parse → don't block normal work
}

const tool = input.tool_name || "";
const ti = input.tool_input || {};

// ── Config ────────────────────────────────────────────────────────────
// Paths whose owner WIP must never be overwritten without a fresh backup.
// Globs are simple prefix/suffix matches kept deliberately conservative.
const PROTECTED = [
  "sandbox/00-design-reference/",
  "assets/css/next/system/surfaces.css",
  "assets/css/next/primitives/colors.css",
  "tools/color-engine/generate-colors.js",
  "expert-designer/showcase.html",
  "expert-designer/starters/",
  "expert-designer/templates/tokens.css",
];
const APPROVAL_FLAG = "pending-approval.flag";
const BACKUPS_DIR = "backups";

function matchesProtected(p) {
  if (!p) return false;
  const norm = p.replace(/\\/g, "/");
  return PROTECTED.some((g) =>
    g.endsWith("/") ? norm.includes(g) : norm.endsWith(g) || norm.includes(g)
  );
}

// Does a timestamped backup of this file's basename already exist today?
function hasFreshBackup(p) {
  if (!existsSync(BACKUPS_DIR)) return false;
  const base = p.replace(/\\/g, "/").split("/").pop().replace(/\.[^.]+$/, "");
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  try {
    return readdirSync(BACKUPS_DIR).some(
      (f) => f.includes(base) && f.includes(today)
    );
  } catch {
    return false;
  }
}

// Is the target file dirty (uncommitted owner WIP) in git?
function isDirty(p) {
  try {
    const out = execSync(`git status --porcelain "${p}"`, {
      encoding: "utf-8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
    return out.length > 0; // any porcelain line = modified/untracked
  } catch {
    return false; // not a git repo / git unavailable → don't block on this
  }
}

// ── RULE 1 + RULE 3: Write/Edit guards ──────────────────────────────────
if (tool === "Write" || tool === "Edit" || tool === "MultiEdit") {
  const path = (ti.file_path || "").replace(/\\/g, "/");

  // RULE 3 — backups/ is append-only. Never overwrite/edit existing backups.
  if (path.includes(`${BACKUPS_DIR}/`) && existsSync(path)) {
    deny(
      `backups/ is append-only. '${path}' already exists. Write a NEW ` +
      `timestamped backup; never overwrite an existing restore point.`
    );
  }

  // RULE 1 (B-9) — protected/owner-WIP file: require a fresh backup first.
  if (matchesProtected(path) && existsSync(path) && isDirty(path)) {
    if (!hasFreshBackup(path)) {
      deny(
        `B-9 VIOLATION BLOCKED. '${path}' has uncommitted owner WIP and no ` +
        `timestamped backup from today in backups/. Copy it to ` +
        `backups/<name>-pre-<reason>-<ISO-date>.<ext> FIRST, then retry. ` +
        `A git stash is NOT a substitute for a discoverable backup.`
      );
    }
  }
  allow();
}

// ── RULE 2 + RULE 4: Bash guards ─────────────────────────────────────────
if (tool === "Bash") {
  const cmd = (ti.command || "");

  // RULE 4 — destructive git is blocked outright (fail CLOSED).
  const destructive = [
    /git\s+push\s+.*--force/, /git\s+push\s+.*-f\b/,
    /git\s+reset\s+--hard/, /git\s+clean\s+.*-[a-z]*f/,
    /git\s+stash\s+drop/, /git\s+stash\s+clear/,
    /\brm\s+-rf?\s+/,
  ];
  for (const re of destructive) {
    if (re.test(cmd)) {
      deny(
        `Destructive command BLOCKED: '${cmd.slice(0, 80)}'. ` +
        `Force-push, hard-reset, git clean -f, stash drop/clear, and rm -rf ` +
        `are forbidden. If you genuinely need this, ask the owner explicitly.`
      );
    }
  }

  // RULE 2 — no commit while an approval is pending.
  if (/git\s+commit/.test(cmd) && existsSync(APPROVAL_FLAG)) {
    let reason = "";
    try { reason = readFileSync(APPROVAL_FLAG, "utf-8").trim().slice(0, 200); }
    catch { /* ignore */ }
    deny(
      `COMMIT BLOCKED — pending-approval.flag exists. The owner must approve ` +
      `before committing. Flag says: "${reason}". After owner approval, ` +
      `delete the flag (rm pending-approval.flag) then commit.`
    );
  }

  allow();
}

allow();

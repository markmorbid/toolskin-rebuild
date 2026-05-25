#!/usr/bin/env node
/**
 * session-rehydrate.mjs — Claude Code SessionStart hook
 * =====================================================
 * Fires when a session begins. Prints the last checkpoints + a rules
 * manifest into the session via additionalContext, so the agent starts
 * already oriented instead of cold. This is the "context rehydration"
 * layer: the system injects state at launch, not the agent remembering.
 *
 * Register in .claude/hooks/settings.json:
 *   { "hooks": { "SessionStart": [ {
 *       "hooks": [ { "type": "command",
 *         "command": "node .claude/hooks/session-rehydrate.mjs" } ] } ] } }
 *
 * SessionStart hooks can inject additionalContext (printed to stdout as
 * JSON). The agent sees it before acting.
 */

import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

function tail(path, n) {
  if (!existsSync(path)) return "(no log yet)";
  const lines = readFileSync(path, "utf-8").trim().split("\n");
  return lines.slice(-n).join("\n");
}

const checkpoints = tail(join("logs", "checkpoints.log"), 15);

const manifest = [
  "REHYDRATION — read these before acting:",
  "  .claude/rules/00-cold-start.md   (the load protocol)",
  "  .claude/rules/01-rulings.md      (R1-R11 + RULING 3 OVERRIDE)",
  "  .claude/rules/02-visual-quality.md",
  "  .claude/rules/03-css-architecture.md (nested pattern = law)",
  "  .claude/rules/04-behavior.md     (halt-on-interrupt)",
  "  decisions/system-layer-status.md (B1/B2/B3 + current phase)",
  "  handoffs/core-memories.md        (full-state insurance copy)",
].join("\n");

const context = [
  "═══ TOOLSKIN SESSION REHYDRATION ═══",
  "",
  manifest,
  "",
  "LAST CHECKPOINTS (logs/checkpoints.log):",
  checkpoints,
  "",
  "Before any work: fill the SESSION STATE block from",
  ".claude/rules/00-cold-start.md. If you cannot fill it, re-read",
  "the source files. The answer is in a file, never in memory.",
  "═══════════════════════════════════",
].join("\n");

// SessionStart hooks inject context via JSON on stdout.
process.stdout.write(JSON.stringify({
  hookSpecificOutput: {
    hookEventName: "SessionStart",
    additionalContext: context,
  },
}));
process.exit(0);

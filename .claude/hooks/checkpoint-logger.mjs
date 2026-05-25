#!/usr/bin/env node
/**
 * checkpoint-logger.mjs — Claude Code PostToolUse hook
 * ====================================================
 * Fires AFTER every Write/Edit. Appends a structured line to
 * logs/checkpoints.log. This is the persistent logging layer your
 * partner specified: NOT memory, NOT context — a git-tracked file
 * that survives compaction, session end, and the remember.md wipe.
 *
 * Register in .claude/hooks/settings.json:
 *   { "hooks": { "PostToolUse": [ {
 *       "matcher": "Write|Edit|MultiEdit",
 *       "hooks": [ { "type": "command",
 *         "command": "node .claude/hooks/checkpoint-logger.mjs" } ] } ] } }
 *
 * The hook reads Claude Code's JSON payload on stdin (file_path,
 * tool_name, session info) and writes a timestamped record.
 * Silent-fails so it can never block Claude.
 */

import { readFileSync, appendFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

try {
  const raw = readFileSync(0, "utf-8");
  const input = JSON.parse(raw);

  const toolName = input.tool_name || "unknown";
  const filePath = input.tool_input?.file_path || "(no file)";
  const sessionId = (input.session_id || "no-session").slice(0, 8);
  const ts = new Date().toISOString();

  // Only log meaningful file targets — skip scratch/tmp noise
  const isNoise = /[\\/](node_modules|\.git|tmp|\.cache)[\\/]/.test(filePath);
  if (isNoise) process.exit(0);

  const logDir = "logs";
  mkdirSync(logDir, { recursive: true });

  const line = `${ts} | ${sessionId} | ${toolName} | ${filePath}\n`;
  appendFileSync(join(logDir, "checkpoints.log"), line);
} catch {
  // Never block Claude on a logging failure.
}
process.exit(0);

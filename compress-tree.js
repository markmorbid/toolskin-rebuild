#!/usr/bin/env node

/**
 * Compress a project tree JSON into a minimal token-efficient format.
 *
 * Input: tree JSON (nested)
 * Output: compact array format:
 *   [["path","tag"], ...]
 */

const fs = require("fs");
const path = require("path");

const INPUT = process.argv[2];
const OUTPUT = process.argv[3] || null;

if (!INPUT) {
  console.error("Usage: node compress-tree.js <input.json> [output.json]");
  process.exit(1);
}

// --- Heuristic tagging ---
function tagFile(filePath) {
  const p = filePath.toLowerCase();

  if (p.includes("node_modules")) return null;
  if (p.includes(".git")) return null;

  if (p.match(/\.(log|tmp|cache)$/)) return "tmp";
  if (p.match(/\.(lock)$/)) return "lock";

  if (p.match(/\.(js|ts|py|go|rs|java|c|cpp|cs)$/)) return "src";
  if (p.match(/\.(json|yaml|yml|toml|ini)$/)) return "cfg";
  if (p.match(/\.(graphql|gql|sql)$/)) return "schema";

  if (p.includes("dist") || p.includes("build") || p.includes("out"))
    return "out";

  if (p.includes("generated") || p.includes("gen"))
    return "gen";

  if (p.match(/\.(md|txt)$/)) return "doc";

  return "misc";
}

// --- Flatten tree ---
function flattenTree(node, basePath = "") {
  let results = [];

  if (Array.isArray(node)) {
    for (const item of node) {
      results.push(...flattenTree(item, basePath));
    }
    return results;
  }

  if (typeof node === "object") {
    const name = node.name || "";
    const currentPath = path.join(basePath, name);

    if (node.type === "file" || !node.children) {
      const tag = tagFile(currentPath);
      if (tag) {
        results.push([currentPath, tag]);
      }
    }

    if (node.children) {
      for (const child of node.children) {
        results.push(...flattenTree(child, currentPath));
      }
    }
  }

  return results;
}

// --- Load & process ---
const raw = JSON.parse(fs.readFileSync(INPUT, "utf-8"));
const flattened = flattenTree(raw);

// Optional: dedupe
const seen = new Set();
const deduped = flattened.filter(([p]) => {
  if (seen.has(p)) return false;
  seen.add(p);
  return true;
});

// --- Output ---
const output = JSON.stringify(deduped);

if (OUTPUT) {
  fs.writeFileSync(OUTPUT, output);
} else {
  console.log(output);
}
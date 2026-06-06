#!/usr/bin/env node

/**

* Prefilter script (FINAL - FIXED)
*
* * Reads hierarchical tree JSON
* * Flattens into file list
* * Gets git tracked files (branch-agnostic)
* * Normalizes paths (correct regex)
* * Intersects both sets
* * Filters unwanted paths
* * Generates .gitignore
* * Exports results to _output/
    */

const fs = require("fs");
const { execSync } = require("child_process");

// ---------- CONFIG ----------
const INPUT_FILE = process.argv[2] || "toolskin-rebuild-tree.json";
const OUTPUT_DIR = "_output";

const CODE_EXT = new Set([".css", ".html", ".js", ".json", ".svg", ".md"]);

// ---------- HELPERS ----------

// ✅ FIXED normalize (correct escaping)
function normalize(p) {
  return p
    .replace(/\\/g, "/")
    .replace(/^\.\//, "")
    .replace(/^\/+/, "");
}

// Get extension
function ext(p) {
  const i = p.lastIndexOf(".");
  return i !== -1 ? p.slice(i).toLowerCase() : "";
}
function isBinaryOrIgnored(p) {
  return /\.(png|jpe?g|gif|webp|bmp|ico)$/i.test(p) ||   // images
         /\.(woff2?|ttf|otf|eot)$/i.test(p) ||              // fonts
         /\.(zip|rar|7z|tar|gz)$/i.test(p) ||               // archives
         /\.py$/i.test(p);                                  // python
}
// Flatten hierarchical tree
function flattenTree(node, acc = []) {
  if (node.type === "file") {
    acc.push(node.url);
  }

  if (node.children && Array.isArray(node.children)) {
    for (const child of node.children) {
      flattenTree(child, acc);
    }
  }

  return acc;
}

// ✅ Reliable git file reader (no branch dependency)
function getGitFiles() {
  try {
    const output = execSync("git ls-files", {
      encoding: "utf-8"
    });


    return output
      .split("\n")
      .map(normalize)
      .filter(Boolean);


  } catch (e) {
    console.error("❌ Failed to read git tracked files");
    console.error("👉 Make sure you're inside a git repo and have at least 1 commit");
    process.exit(1);
  }
}

// ---------- LOAD TREE ----------
if (!fs.existsSync(INPUT_FILE)) {
  console.error("❌ Input file not found:", INPUT_FILE);
  process.exit(1);
}

let localTree;
try {
  const raw = fs.readFileSync(INPUT_FILE, "utf-8");
  localTree = JSON.parse(raw);
} catch {
  console.error("❌ Invalid JSON");
  process.exit(1);
}

// Root node
const rootNode = Array.isArray(localTree) ? localTree[0] : localTree;

// Flatten
const localFiles = flattenTree(rootNode);

// Map
const localMap = new Map();
for (const p of localFiles) {
  localMap.set(normalize(p), true);
}

// ---------- GIT FILES ----------
const gitFiles = getGitFiles();

// ---------- FILTER ----------
const commit = [];
const ignore = [];
const missing = [];

for (const gf of gitFiles) {
  if (!localMap.has(gf)) {
    missing.push(gf);
    continue;
  }

  const extension = ext(gf);
  const forceInclude = CODE_EXT.has(extension);

  const isTmp =
    gf.includes("logs/") ||
    gf.includes("tmp/") ||
    gf.includes("_bu/") ||
    gf.includes("_treemap-output/") ||
    gf.includes("_output/") ||
    gf.includes("audit/");

  const isOut =
    gf.includes("dist/") ||
    gf.includes("build/") ||
    gf.includes(".playwright-mcp/") ||
    gf.includes("out/") ||
    gf.includes("claude-design-files/") ||
    gf.includes("backups/");

  const isBinary = isBinaryOrIgnored(gf);


if (
    isBinary ||          // ← NEW (your extensions filter)
    (!forceInclude && (isTmp || isOut))
  ) {
    ignore.push(gf);
  } else {
    commit.push(gf);
  }
}

// ---------- GITIGNORE ----------
function generateGitignore(ignoreList) {
  const patterns = new Set();

  for (const file of ignoreList) {
    const parts = file.split("/");

    if (parts.includes("dist")) patterns.add("dist/");
    if (parts.includes("build")) patterns.add("build/");
    if (parts.includes("out")) patterns.add("out/");

    if (parts.includes("logs")) patterns.add("logs/");
    if (file.endsWith(".log")) patterns.add("*.log");
    if (parts.includes("tmp")) patterns.add("tmp/");

    if (parts.includes("backups")) patterns.add("backups/");
    if (file.endsWith(".zip")) patterns.add("*.zip");

    if (parts.includes("_output")) patterns.add("_output/");
    if (parts.includes(".cursor")) patterns.add(".cursor/");
    if (parts.includes(".vscode")) patterns.add(".vscode/");
    if (parts.includes(".playwright-mcp")) patterns.add(".playwright-mcp/");

    if (parts.includes(".git")) patterns.add(".git/");


    if (parts.includes("_tree-explorer")) patterns.add("_tree-explorer/");

    if (parts.includes("node_modules")) patterns.add("node_modules/");

    if (file.endsWith(".DS_Store")) patterns.add(".DS_Store");
    if (file.endsWith("Thumbs.db")) patterns.add("Thumbs.db");

    if (!file.includes("/")) {
      patterns.add(file);
    }


  }

  // defaults
  patterns.add("node_modules/");
  patterns.add(".DS_Store");
  patterns.add("Thumbs.db");

  return Array.from(patterns).sort().join("\n");
}

// ---------- OUTPUT ----------
const result = {
  commit_files: commit,
  ignore_files: ignore,
  missing_in_local: missing
};

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR);
}

fs.writeFileSync(
  `${OUTPUT_DIR}/prefiltered.json`,
  JSON.stringify(result, null, 2)
);

fs.writeFileSync(
  `${OUTPUT_DIR}/.gitignore`,
  generateGitignore(ignore)
);

console.log(JSON.stringify(result, null, 2));

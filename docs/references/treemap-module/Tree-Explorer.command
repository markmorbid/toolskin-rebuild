#!/usr/bin/env bash
# Toolskin Tree Explorer - double-click to launch (macOS / Linux)
cd "$(dirname "$0")"
if ! command -v node >/dev/null 2>&1; then
  echo
  echo "  Node.js is not installed or not on PATH."
  echo "  Get it from https://nodejs.org  then run this again."
  echo
  read -n 1 -s -r -p "Press any key to close..."
  exit 1
fi
if [ ! -f "_tree-explorer/launch.js" ]; then
  echo "  Could not find _tree-explorer/launch.js next to this file."
  read -n 1 -s -r -p "Press any key to close..."
  exit 1
fi
node "_tree-explorer/launch.js"

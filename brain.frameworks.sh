#!/usr/bin/env bash
set -euo pipefail

ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
BRAIN="$ROOT/.repo-brain"
DETECT_FILE="$BRAIN/detect.json"

[ -f "$DETECT_FILE" ] || { echo "detect.json missing"; exit 0; }

framework="none"

if [ -f "$ROOT/package.json" ]; then
  if grep -q '"next"' "$ROOT/package.json"; then framework="next";
  elif grep -q '"@sveltejs/kit"' "$ROOT/package.json"; then framework="sveltekit";
  elif grep -q '"nuxt"' "$ROOT/package.json"; then framework="nuxt";
  elif grep -q '"astro"' "$ROOT/package.json"; then framework="astro";
  elif grep -q '"@remix-run/react"' "$ROOT/package.json"; then framework="remix";
  elif grep -q '"vue"' "$ROOT/package.json"; then framework="vue";
  elif grep -q '"svelte"' "$ROOT/package.json"; then framework="svelte";
  elif grep -q '"@angular/core"' "$ROOT/package.json"; then framework="angular";
  fi
fi

# Update detect.json with framework info
tmp=$(mktemp)
${JQ_BIN:-jq} --arg fw "$framework" '. + {framework: $fw}' "$DETECT_FILE" > "$tmp"
mv "$tmp" "$DETECT_FILE"
#!/usr/bin/env bash
set -euo pipefail

ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
BRAIN="$ROOT/.repo-brain"
OUT="$BRAIN/detect.json"

languages=()
framework="none"
ci="none"

# Language Detection
[ -f "$ROOT/package.json" ] && languages+=("node")
([ -f "$ROOT/pyproject.toml" ] || [ -f "$ROOT/requirements.txt" ]) && languages+=("python")
[ -f "$ROOT/Cargo.toml" ] && languages+=("rust")
(ls "$ROOT"/*.sol >/dev/null 2>&1 || [ -f "$ROOT/foundry.toml" ]) && languages+=("solidity")

# CI Detection
[ -d "$ROOT/.github/workflows" ] && ci="github-actions"

# Framework Detection
if [ -f "$ROOT/package.json" ]; then
  if grep -q '"next"' "$ROOT/package.json"; then framework="next";
  elif grep -q '"@sveltejs/kit"' "$ROOT/package.json"; then framework="sveltekit";
  elif grep -q '"nuxt"' "$ROOT/package.json"; then framework="nuxt";
  elif grep -q '"astro"' "$ROOT/package.json"; then framework="astro";
  elif grep -q '"@remix-run/react"' "$ROOT/package.json"; then framework="remix";
  elif grep -q '"vue"' "$ROOT/package.json"; then framework="vue";
  elif grep -q '"svelte"' "$ROOT/package.json"; then framework="svelte";
  elif grep -q '"react"' "$ROOT/package.json"; then framework="react";
  elif grep -q '"@angular/core"' "$ROOT/package.json"; then framework="angular";
  fi
fi

# JSON Construction (Node fallback support via global JQ_BIN)
langs_json=$(printf '%s\n' "${languages[@]}" | awk 'NF' | ${JQ_BIN:-jq} -R . | ${JQ_BIN:-jq} -s . 2>/dev/null || printf '[]')

cat > "$OUT" <<JSON
{
  "languages": $langs_json,
  "framework": "$framework",
  "ci": "$ci",
  "detected_at": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
}
JSON
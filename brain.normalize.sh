#!/usr/bin/env bash
set -euo pipefail

ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
BRAIN="$ROOT/.repo-brain"
DETECT_FILE="$BRAIN/detect.json"
SOL_FILE="$BRAIN/solidity.json"

[ -f "$DETECT_FILE" ] || exit 0

JQ_BIN="${JQ_BIN:-jq}"
if ! command -v "$JQ_BIN" >/dev/null 2>&1; then
  JQ_BIN="node $BRAIN/tools/json-cli.js"
fi

langs=$("$JQ_BIN" -r '.languages[]' "$DETECT_FILE")
framework=$("$JQ_BIN" -r '.framework' "$DETECT_FILE")

mkdir -p "$ROOT/.github/workflows"

deploy_template() {
  local src="$BRAIN/templates/$1"
  local dest="$ROOT/.github/workflows/$2"
  if [ -f "$src" ] && [ ! -f "$dest" ]; then
    cp "$src" "$dest"
    echo "Normalized: $2 deployed from $(basename "$src")"
  fi
}

# 1. Framework-specific overrides
case "$framework" in
  next) deploy_template "next-ci.yml" "ci.yml" ;;
  sveltekit) deploy_template "sveltekit-ci.yml" "ci.yml" ;;
  nuxt) deploy_template "nuxt-ci.yml" "ci.yml" ;;
  astro) deploy_template "astro-ci.yml" "ci.yml" ;;
  remix) deploy_template "remix-ci.yml" "ci.yml" ;;
  angular) deploy_template "angular-ci.yml" "ci.yml" ;;
  *)
    # 2. Solidity-specific Tool Detection
    if [ -f "$SOL_FILE" ]; then
      tool=$("$JQ_BIN" -r '.tool' "$SOL_FILE")
      case "$tool" in
        foundry) deploy_template "foundry-ci.yml" "solidity-ci.yml" ;;
        hardhat) deploy_template "hardhat-ci.yml" "solidity-ci.yml" ;;
      esac
    fi

    # 3. Language-based fallbacks
    for lang in $langs; do
      case "$lang" in
        node) deploy_template "default-ci.yml" "ci.yml" ;;
        python) deploy_template "python-ci.yml" "python-ci.yml" ;;
        rust) deploy_template "rust-ci.yml" "rust-ci.yml" ;;
      esac
    done
    ;;
esac
#!/usr/bin/env bash
set -euo pipefail

ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
BRAIN="$ROOT/.repo-brain"
OUT="$BRAIN/solidity.json"

tool="none"
[ -f "$ROOT/foundry.toml" ] && tool="foundry"
ls "$ROOT"/hardhat.config.* >/dev/null 2>&1 && tool="hardhat"

cat > "$OUT" <<JSON
{
  "tool": "$tool",
  "has_contracts": $(ls "$ROOT"/*.sol >/dev/null 2>&1 && echo true || echo false)
}
JSON

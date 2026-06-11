#!/usr/bin/env bash
set -euo pipefail

ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
BRAIN="$ROOT/.repo-brain"
SOL_FILE="$BRAIN/solidity.json"

[ -f "$SOL_FILE" ] || exit 0

tool=$(${JQ_BIN:-jq} -r '.tool' "$SOL_FILE")
[ "$tool" = "none" ] && exit 0

case "$tool" in
  foundry) echo "forge test -vvv" > "$BRAIN/solidity_ci_cmd" ;;
  hardhat) echo "npx hardhat test" > "$BRAIN/solidity_ci_cmd" ;;
esac

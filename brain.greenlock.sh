#!/usr/bin/env bash
set -euo pipefail

ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
BRAIN="$ROOT/.repo-brain"
DIAG="$BRAIN/diagnosis.json"

[ -f "$DIAG" ] || exit 0

status=$(${JQ_BIN:-jq} -r '.status' "$DIAG")

if [ "$status" = "GREEN" ]; then
  date -u +"%Y-%m-%dT%H:%M:%SZ" > "$BRAIN/.greenlock"
  echo "Greenlock maintained."
fi

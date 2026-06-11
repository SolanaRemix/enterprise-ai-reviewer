#!/usr/bin/env bash
set -euo pipefail

ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
BRAIN="$ROOT/.repo-brain"
DIAG="$BRAIN/diagnosis.json"

log() { echo "🛠️ [fix-safe] $1"; }

[ -f "$DIAG" ] || exit 0
status=$(${JQ_BIN:-jq} -r '.status' "$DIAG")

if [ "$status" = "AUTO_FIXABLE" ]; then
  log "Attempting safe infrastructure repairs..."
  # Example: Correcting workflow directory permissions
  [ -d "$ROOT/.github/workflows" ] && chmod 755 "$ROOT/.github/workflows"
  
  # Injecting missing .gitignore for .repo-brain artifacts if missing
  if [ ! -f "$ROOT/.gitignore" ] || ! grep -q ".repo-brain/autopsy" "$ROOT/.gitignore"; then
    echo ".repo-brain/autopsy/" >> "$ROOT/.gitignore"
    log "Patched .gitignore for autopsy logs."
  fi
  
  echo "Safe repairs applied."
fi

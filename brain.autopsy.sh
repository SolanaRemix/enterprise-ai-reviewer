#!/usr/bin/env bash
set -euo pipefail

ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
BRAIN="$ROOT/.repo-brain"
LOG_DIR="$BRAIN/autopsy"
RUN_ID="$(date -u +'%Y%m%dT%H%M%SZ')"
RUN_DIR="$LOG_DIR/$RUN_ID"

mkdir -p "$RUN_DIR"
log() { echo "🧠 [autopsy] $1"; }

log "Starting forensic brain autopsy: $RUN_ID"

# 1) Snapshot directory structure
( cd "$ROOT" && find .repo-brain -maxdepth 4 -type f ) > "$RUN_DIR/tree.txt" 2>&1

# 2) Capture key metadata artifacts
[ -f "$BRAIN/MERMEDA.md" ] && cp "$BRAIN/MERMEDA.md" "$RUN_DIR/MERMEDA.md"
[ -f "$BRAIN/diagnosis.json" ] && cp "$BRAIN/diagnosis.json" "$RUN_DIR/diagnosis.json"
[ -f "$BRAIN/detect.json" ] && cp "$BRAIN/detect.json" "$RUN_DIR/detect.json"

# 3) Capture Execution Traces
# We run diagnostics in trace mode to capture environment variables and logic flow
SCRIPTS=(brain.detect.sh brain.diagnose.sh brain.ai.guard.sh)
for s in "${SCRIPTS[@]}"; do
  if [ -x "$BRAIN/$s" ]; then
    log "Tracing $s"
    {
      echo "===== EXECUTION TRACE: $s ====="
      echo "Timestamp: $(date)"
      echo "-------------------------------"
      ( export PS4='+ [${BASH_SOURCE}:${LINENO}] '; set -x; "$BRAIN/$s" ) 2>&1
      echo "-------------------------------"
      echo "Exit Code: $?"
    } > "$RUN_DIR/$s.trace" || true
  fi
done

log "Autopsy archived in $RUN_DIR"

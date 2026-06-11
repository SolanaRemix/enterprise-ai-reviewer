#!/usr/bin/env bash
set -euo pipefail

ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
BRAIN="$ROOT/.repo-brain"
LOG_DIR="$BRAIN/blackbox"
RUN_ID="$(date -u +'%Y%m%dT%H%M%SZ')"
RUN_DIR="$LOG_DIR/$RUN_ID"

mkdir -p "$RUN_DIR"

log() { echo "🧠 [blackbox] $1"; }

log "Initiating Blackbox recording session: $RUN_ID"

# 1. Environmental Snapshot
log "Capturing environment state..."
env > "$RUN_DIR/env.txt"

# 2. Source & Metadata State
log "Capturing Git forensics..."
git status > "$RUN_DIR/git-status.txt" 2>&1 || true
git log -10 --oneline > "$RUN_DIR/git-history.txt" 2>&1 || true
git diff --cached > "$RUN_DIR/staged-changes.diff" 2>&1 || true

# 3. Execution Replay Trace
log "Executing pipeline with deep-trace replaying..."
{
  echo "===== REPO-BRAIN EXECUTION TRACE ====="
  echo "RUN_ID: $RUN_ID"
  echo "START_TIME: $(date)"
  echo "--------------------------------------"
  
  # Inject high-verbosity trace into the runner
  export PS4='+ [${BASH_SOURCE}:${LINENO}] '
  set -x
  "$BRAIN/brain.run.sh"
  
} > "$RUN_DIR/replay.trace" 2>&1 || true

# 4. Results Aggregation
[ -f "$BRAIN/diagnosis.json" ] && cp "$BRAIN/diagnosis.json" "$RUN_DIR/"
[ -f "$BRAIN/detect.json" ] && cp "$BRAIN/detect.json" "$RUN_DIR/"

log "Blackbox recording preserved in $RUN_DIR"
echo "$RUN_ID" > "$BRAIN/latest_blackbox_id"

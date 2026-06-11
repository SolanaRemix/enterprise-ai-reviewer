#!/usr/bin/env bash
set -euo pipefail

ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
BRAIN="$ROOT/.repo-brain"
IMMUNE_FILE="$BRAIN/.immune.hash"

log() { echo "🛡️ [immunizer] $1"; }

MODE="${1:-lock}"

# Cross-platform hash function
hash_tree() {
  (cd "$BRAIN" && find . -type f ! -name ".immune.hash" -print0 | sort -z | xargs -0 sha256sum) 2>/dev/null
}

if [ "$MODE" = "lock" ]; then
  log "Locking .repo-brain against local mutation"
  hash_tree > "$IMMUNE_FILE"
  # Try to make read-only if permissions allow (best effort for security)
  chmod -R a-w "$BRAIN" 2>/dev/null || true
  log "Immune Hash recorded and scripts protected."
  exit 0
fi

if [ "$MODE" = "check" ]; then
  if [ ! -f "$IMMUNE_FILE" ]; then
    log "Error: No immune hash found. Run with 'lock' first."
    exit 1
  fi
  
  current="$(hash_tree)"
  if diff -q <(echo "$current") "$IMMUNE_FILE" >/dev/null 2>&1; then
    log "✅ Integrity Verified: No mutations detected."
    exit 0
  else
    log "❌ FATAL: Integrity Compromised! Local mutations detected in .repo-brain."
    exit 2
  fi
fi

log "Usage: brain.immunizer.sh [lock|check]"
exit 1

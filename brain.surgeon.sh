#!/usr/bin/env bash
set -euo pipefail

ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
BRAIN="$ROOT/.repo-brain"
VERSIONS="$ROOT/.repo-brain.versions"
VERSION="${1:-v1.1.0}"

log() { echo "💉 [surgeon] $1"; }

if [ ! -d "$VERSIONS/$VERSION" ]; then
  log "FATAL: Target version $VERSION not found in $VERSIONS"
  exit 1
fi

# 1) Create safety backup
BACKUP_TS="$(date -u +'%Y%m%dT%H%M%SZ')"
BACKUP="$ROOT/.repo-brain.backup.$BACKUP_TS"
log "Surgery prep: Creating backup at $BACKUP"
if [ -d "$BRAIN" ]; then
  cp -R "$BRAIN" "$BACKUP"
else
  log "Warning: No existing brain found, starting fresh install"
fi

# 2) Perform module restoration
log "Restoring core modules from genomic sequence $VERSION"
mkdir -p "$BRAIN"
# Use rsync if available, otherwise fallback to cp
if command -v rsync >/dev/null 2>&1; then
  rsync -a --delete "$VERSIONS/$VERSION/" "$BRAIN/"
else
  cp -R "$VERSIONS/$VERSION/"* "$BRAIN/"
fi

# 3) Ensure permissions
chmod +x "$BRAIN"/*.sh 2>/dev/null || true

log "Surgery successful. Brain restored to $VERSION state."

#!/usr/bin/env bash
set -euo pipefail

# REPO BRAIN HOSPITAL - Verification & Graduation (v2.3.0)
# Purpose: Final sanity checks, build verification, and conflict resolution audit.

ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
BRAIN="$ROOT/.repo-brain"
OUT="$BRAIN/verification.log"

log() { echo "🧪 [verify:surgeon] $1"; }

run_cmd() {
  log "Executing: $1"
  if eval "$1" >> "$OUT" 2>&1; then
    log "✅ Success: $1"
    return 0
  else
    log "❌ Failed: $1"
    return 1
  fi
}

# Clear previous session logs
echo "--- REPO BRAIN VERIFICATION SESSION $(date) ---" > "$OUT"

SUCCESS=true

# 1. Conflict Resolution Audit
if grep -r "<<<<<<<" "$ROOT" --exclude-dir=".repo-brain" --exclude-dir="node_modules" >/dev/null 2>&1; then
    log "❌ FATAL: Unresolved git merge conflicts detected in source files."
    SUCCESS=false
fi

# 2. TypeScript/Node Verification (Enforce Build Contract)
if [ -f "$ROOT/package.json" ]; then
  log "Validating Node/TypeScript Build Contract..."
  # Resolve conflicts by ensuring we have a clean node_modules if needed (Surgical)
  if [ ! -d "$ROOT/node_modules" ]; then
    run_cmd "npm install --prefer-offline --no-audit" || SUCCESS=false
  fi

  if grep -q '"build"' "$ROOT/package.json"; then
    run_cmd "npm run build" || SUCCESS=false
  else
    log "⚠️ No build script found in package.json. Skipping build verification."
  fi
fi

# 3. Rust Verification
if [ -f "$ROOT/Cargo.toml" ]; then
  log "Validating Rust Toolchain..."
  run_cmd "cargo check" || SUCCESS=false
fi

# 4. Web3 / Solidity Motor Function Check
if [ -f "$BRAIN/solidity_ci_cmd" ]; then
  log "Executing Hardhat/Foundry Motor Function..."
  run_cmd "$(cat "$BRAIN/solidity_ci_cmd")" || SUCCESS=false
fi

# 5. Graduation Status
if [ "$SUCCESS" = true ]; then
  log "🏁 GRADUATE: Repository has passed all MERMEDA v2.0 graduation criteria."
  # Signal green state to greenlock
  [ -x "$BRAIN/brain.greenlock.sh" ] && "$BRAIN/brain.greenlock.sh"
else
  log "⚠️ ADMISSION CONTINUED: Repository fails to meet build/test graduation criteria."
fi

log "Verification session concluded. Full forensic trace at $OUT"

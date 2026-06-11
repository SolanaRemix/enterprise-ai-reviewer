#!/usr/bin/env bash
set -euo pipefail

ROOT="$(pwd)"
BRAIN="$ROOT/.repo-brain"
FLEET_OUT="$BRAIN/brain.fleet.json"
MODE="${1:-run}"
ARG1="${2:-}"
ARG2="${3:-}"

JQ_BIN="${JQ_BIN:-jq}"
if ! command -v "$JQ_BIN" >/dev/null 2>&1; then
  JQ_BIN="node $BRAIN/tools/json-cli.js"
fi

# -----------------------------
# Plugin Sync
# -----------------------------
sync_plugins() {
  echo "[fleet] syncing plugins into all repos"
  for r in */; do
    [ -d "$r/.git" ] || continue
    mkdir -p "$r/.repo-brain"
    cp -R "$BRAIN/"* "$r/.repo-brain/" 2>/dev/null || true
    chmod +x "$r/.repo-brain"/*.sh 2>/dev/null || true
  done
}

# -----------------------------
# Run Brain Across Fleet
# -----------------------------
run_fleet() {
  echo '{"repos":[],"generatedAt":""}' > "$FLEET_OUT"
  tmp=$(mktemp)
  echo "[]" > "$tmp"

  for r in */; do
    [ -d "$r/.git" ] || continue
    [ -d "$r/.repo-brain" ] || continue
    echo "[fleet] running brain in $r"
    (cd "$r" && ./.repo-brain/brain.run.sh || true)
    DIAG="$r/.repo-brain/diagnosis.json"
    [ -f "$DIAG" ] || continue
    cur=$(cat "$tmp")
    echo "$cur" | "$JQ_BIN" ". + [$(cat "$DIAG")]" > "$tmp.new"
    mv "$tmp.new" "$tmp"
  done

  ts="$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
  cat "$tmp" | "$JQ_BIN" --arg ts "$ts" '{generatedAt: $ts, repos: .}' > "$FLEET_OUT"
  rm -f "$tmp"
  echo "[fleet] wrote $FLEET_OUT"
}

# -----------------------------
# Dashboard
# -----------------------------
dashboard() {
  [ -f "$FLEET_OUT" ] || { echo "[fleet] no fleet JSON found"; exit 1; }

  GREEN=$("$JQ_BIN" '.repos | map(select(.status=="GREEN")) | length' "$FLEET_OUT")
  AUTO=$("$JQ_BIN" '.repos | map(select(.status=="AUTO_FIXABLE")) | length' "$FLEET_OUT")
  RED=$("$JQ_BIN" '.repos | map(select(.status=="RED")) | length' "$FLEET_OUT")

  echo ""
  echo "FLEET STATUS"
  echo "────────────────────────────────────────────"
  printf "🟢 GREEN:         %s\n" "$GREEN"
  printf "🟡 AUTO_FIXABLE:  %s\n" "$AUTO"
  printf "🔴 RED:           %s\n" "$RED"
  echo "────────────────────────────────────────────"
  echo "Generated: $("$JQ_BIN" -r '.generatedAt' "$FLEET_OUT")"
  echo ""
  echo "REPO OVERVIEW"
  echo "────────────────────────────────────────────"
  "$JQ_BIN" -r '.repos[] | "\(.repo) | \(.status) | \(.framework) | \(.languages | join(","))"' "$FLEET_OUT" | column -t -s '|'
}

# -----------------------------
# Autopsy All Repos
# -----------------------------
autopsy_all() {
  echo "[fleet] running autopsy on all repos"
  for r in */; do
    [ -d "$r/.repo-brain" ] || continue
    echo "[autopsy] $r"
    (cd "$r" && ./.repo-brain/brain.autopsy.sh || true)
  done
}

# -----------------------------
# Genome Diff
# -----------------------------
genome() {
  FROM="$ARG1"
  TO="$ARG2"
  if [ -z "$FROM" ] || [ -z "$TO" ]; then
    echo "Usage: brain.fleet.sh --genome <from> <to>"
    exit 1
  fi
  echo "[fleet] genome diff $FROM → $TO"
  ./.repo-brain/brain.genome.sh "$FROM" "$TO"
}

# -----------------------------
# Doctor All
# -----------------------------
doctor_all() {
  echo "[fleet] running doctor on all repos"
  for r in */; do
    [ -d "$r/.repo-brain" ] || continue
    echo "[doctor] $r"
    (cd "$r" && ./.repo-brain/brain.doctor.sh || true)
  done
}

# -----------------------------
# Surgeon All
# -----------------------------
surgeon_all() {
  VERSION="$ARG1"
  if [ -z "$VERSION" ]; then
    echo "Usage: brain.fleet.sh --surgeon-all <version>"
    exit 1
  fi
  echo "[fleet] repairing all repos to version $VERSION"
  for r in */; do
    [ -d "$r/.repo-brain" ] || continue
    echo "[surgeon] $r"
    (cd "$r" && ./.repo-brain/brain.surgeon.sh "$VERSION" || true)
  done
}

# -----------------------------
# Mode Dispatch
# -----------------------------
case "$MODE" in
  --sync-plugins) sync_plugins ;;
  --dashboard) dashboard ;;
  --autopsy-all) autopsy_all ;;
  --genome) genome ;;
  --doctor-all) doctor_all ;;
  --surgeon-all) surgeon_all ;;
  *)
    sync_plugins
    run_fleet
    dashboard
    ;;
esac

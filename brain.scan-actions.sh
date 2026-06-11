#!/usr/bin/env bash
set -euo pipefail

ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
BRAIN="$ROOT/.repo-brain"
OUT="$BRAIN/actions.json"

log() { echo "🔍 [scan-actions] $1"; }

if [ ! -d "$ROOT/.github/workflows" ]; then
  log "No workflows directory found."
  echo '{"workflows": [], "jobs": []}' > "$OUT"
  exit 0
fi

workflows=()
for f in "$ROOT"/.github/workflows/*.yml; do
  [ -f "$f" ] || continue
  workflows+=("\"$(basename "$f")\"")
done

# Simple job detection
jobs=()
while read -r line; do
  if [[ "$line" =~ ^[[:space:]]+([a-zA-Z0-9_-]+):$ ]]; then
    jobs+=("\"${BASH_REMATCH[1]}\"")
  fi
done < <(grep -E "^[[:space:]]+[a-zA-Z0-9_-]+:" "$ROOT"/.github/workflows/*.yml 2>/dev/null || true)

langs_json=$(printf '%s\n' "${workflows[@]}" | awk 'NF' | sed 's/,$//')
jobs_json=$(printf '%s\n' "${jobs[@]}" | awk 'NF' | sed 's/,$//')

cat > "$OUT" <<JSON
{
  "workflows": [${workflows[*]}],
  "jobs": [${jobs[*]}],
  "scanned_at": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
}
JSON

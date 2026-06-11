#!/usr/bin/env bash
set -euo pipefail

ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
BRAIN="$ROOT/.repo-brain"
DETECT="$BRAIN/detect.json"
OUT="$BRAIN/diagnosis.json"

[ -f "$DETECT" ] || exit 0

repo=$(basename "$ROOT")
languages=$(${JQ_BIN:-jq} '.languages' "$DETECT")
framework=$(${JQ_BIN:-jq} -r '.framework' "$DETECT")
ci=$(${JQ_BIN:-jq} -r '.ci' "$DETECT")

status="GREEN"
reason="Infrastructure matches MERMEDA spec."

if [ "$ci" = "none" ]; then
  status="AUTO_FIXABLE"
  reason="Missing CI configuration."
fi

# Check for AI guard comments to potentially flag RED
if [ -d "$BRAIN/auto-comments" ] && [ "$(ls -A "$BRAIN/auto-comments")" ]; then
  status="RED"
  reason="AI Guard flagged unsafe patterns or secrets."
fi

cat > "$OUT" <<JSON
{
  "repo": "$repo",
  "status": "$status",
  "reason": "$reason",
  "languages": $languages,
  "framework": "$framework",
  "ci": "$ci",
  "timestamp": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
}
JSON

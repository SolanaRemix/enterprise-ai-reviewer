#!/usr/bin/env bash
set -euo pipefail

ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
BRAIN="$ROOT/.repo-brain"
DETECT_FILE="$BRAIN/detect.json"
OUT="$BRAIN/framework_ci.json"

[ -f "$DETECT_FILE" ] || exit 0

framework=$(${JQ_BIN:-jq} -r '.framework' "$DETECT_FILE")
cmd="npm test"

case "$framework" in
  next|sveltekit|astro|remix|angular) cmd="npm run build" ;;
  nuxt) cmd="npx nuxi build" ;;
  *) cmd="npm test" ;;
esac

echo "{\"framework\": \"$framework\", \"expected_ci_cmd\": \"$cmd\"}" > "$OUT"
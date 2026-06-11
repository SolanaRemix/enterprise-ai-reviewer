#!/usr/bin/env bash
set -euo pipefail

ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
BRAIN="$ROOT/.repo-brain"
OUT_JSON="$BRAIN/brain.health.json"
OUT_MD="$BRAIN/brain.health.md"

log() { echo "🩺 [doctor] $1"; }

mkdir -p "$BRAIN"

# Integrity Checks
MISSING=()
SCRIPTS=(
  brain.run.sh brain.detect.sh brain.scan-actions.sh brain.diagnose.sh 
  brain.ai.guard.sh brain.guard.sh brain.fleet.sh brain.autopsy.sh
  brain.surgeon.sh brain.genome.sh
)

for s in "${SCRIPTS[@]}"; do
  [ -f "$BRAIN/$s" ] || MISSING+=("$s")
done

NOT_EXEC=()
for s in "${SCRIPTS[@]}"; do
  [ -f "$BRAIN/$s" ] && [ ! -x "$BRAIN/$s" ] && NOT_EXEC+=("$s")
done

# Environment Checks
HAS_JQ=$(command -v jq >/dev/null 2>&1 && echo true || echo false)
HAS_NODE=$(command -v node >/dev/null 2>&1 && echo true || echo false)
HAS_MERMEDA=$([ -f "$BRAIN/MERMEDA.md" ] && echo true || echo false)

# Generate JSON
cat > "$OUT_JSON" <<JSON
{
  "timestamp": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "mermedaPresent": $HAS_MERMEDA,
  "jqPresent": $HAS_JQ,
  "nodePresent": $HAS_NODE,
  "missingScripts": [$(printf '"%s",' "${MISSING[@]}" | sed 's/,$//')],
  "notExecutable": [$(printf '"%s",' "${NOT_EXEC[@]}" | sed 's/,$//')],
  "dryRunErrors": []
}
JSON

# Generate Markdown Summary
{
  echo "# 🩺 Brain Health Report"
  echo "- Timestamp: \`$(date)\`"
  echo ""
  echo "## Environment Diagnostics"
  echo "- MERMEDA.md Spec: $([ "$HAS_MERMEDA" = "true" ] && echo "✅" || echo "❌")"
  echo "- jq Binary: $([ "$HAS_JQ" = "true" ] && echo "✅" || echo "❌")"
  echo "- Node.js Runtime: $([ "$HAS_NODE" = "true" ] && echo "✅" || echo "❌")"
  echo ""
  echo "## Script Integrity"
  if [ ${#MISSING[@]} -eq 0 ]; then 
    echo "- All core scripts present ✅"
  else 
    echo "- Missing Components: ${MISSING[*]} ❌"
  fi

  if [ ${#NOT_EXEC[@]} -gt 0 ]; then
     echo "- Permission Issues: ${NOT_EXEC[*]} ⚠️"
  fi
} > "$OUT_MD"

log "Health audit complete. Logs: $OUT_JSON"

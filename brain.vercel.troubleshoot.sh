#!/usr/bin/env bash
set -euo pipefail

# REPO BRAIN HOSPITAL - Vercel/Next.js Troubleshooter (v1.1.0)
# Purpose: Specialized forensic audit and repair for Next.js deployment genomes.

ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
BRAIN="$ROOT/.repo-brain"
DETECT="$BRAIN/detect.json"
OUT="$BRAIN/vercel_troubleshoot.json"

# Ensure JQ or fallback is available
JQ_CMD="${JQ_BIN:-jq}"
if ! command -v "$JQ_CMD" >/dev/null 2>&1; then
    if [ -f "$BRAIN/tools/json-cli.js" ]; then
        JQ_CMD="node $BRAIN/tools/json-cli.js"
    else
        # Critical fallback if no jq or node tool
        JQ_CMD="cat" 
    fi
fi

log() { echo "🚀 [vercel:surgeon] $1"; }

[ -f "$DETECT" ] || exit 0
framework=$($JQ_CMD -r '.framework' "$DETECT" 2>/dev/null || echo "none")

if [ "$framework" != "next" ]; then
    exit 0
fi

log "Initiating Next.js/Vercel Forensic Audit..."

ISSUES=()
REPAIRS=()

# 1. vercel.json Presence
if [ ! -f "$ROOT/vercel.json" ]; then
    ISSUES+=("Missing vercel.json (Deployment may use non-canonical defaults)")
    REPAIRS+=("Generate canonical vercel.json with standard routing and cleanUrls: true")
fi

# 2. Memory Optimization (OOM Prevention)
if [ -f "$ROOT/package.json" ]; then
  if grep -q '"next build"' "$ROOT/package.json" && ! grep -q "max_old_space_size" "$ROOT/package.json"; then
      # Check if project size suggests high memory requirement
      file_count=$(find "$ROOT" -name "*.tsx" -o -name "*.ts" | wc -l)
      if [ "$file_count" -gt 100 ]; then
          ISSUES+=("High-density Next.js project detected. Potential OOM during build.")
          REPAIRS+=("Inject NODE_OPTIONS=\"--max-old-space-size=4096\" into CI environment")
      fi
  fi
fi

# 3. Standalone Output Mode (Modern Standard)
if [ -f "$ROOT/next.config.js" ] || [ -f "$ROOT/next.config.mjs" ]; then
    CONFIG_FILE="$ROOT/next.config.js"
    [ -f "$ROOT/next.config.mjs" ] && CONFIG_FILE="$ROOT/next.config.mjs"
    
    if ! grep -q "output: 'standalone'" "$CONFIG_FILE"; then
        ISSUES+=("Deprecated build output pattern. 'standalone' mode not detected.")
        REPAIRS+=("Update Next.js config to use output: 'standalone' for optimized Vercel builds")
    fi
fi

# 4. Engine Specification
if [ -f "$ROOT/package.json" ]; then
    if ! grep -q '"engines"' "$ROOT/package.json"; then
        ISSUES+=("Missing 'engines' field in package.json. Vercel may default to stale Node.js runtimes.")
        REPAIRS+=("Pin Node.js engine to v20.x for stability")
    fi
fi

# 5. Log Analysis (Deep Forensic)
if [ -d "$BRAIN/autopsy" ]; then
    latest_trace=$(find "$BRAIN/autopsy" -name "*.trace" -type f -exec ls -t {} + 2>/dev/null | head -n 1 || true)
    if [ -n "$latest_trace" ] && [ -f "$latest_trace" ]; then
        # ELIFECYCLE Detection
        if grep -q "ELIFECYCLE" "$latest_trace"; then
            ISSUES+=("Detected npm lifecycle failure in recent logs.")
            REPAIRS+=("Check for broken dependencies or missing peer dependencies.")
        fi
        
        # OOM Detection
        if grep -Ei "out of memory|heap limit|heap out of memory" "$latest_trace"; then
            ISSUES+=("Hard evidence of OOM failure found in execution logs.")
            REPAIRS+=("CRITICAL: Increase NODE_OPTIONS memory limit immediately.")
        fi

        # Missing Env Var Detection
        if grep -Ei "environment variable|missing env|undefined|is not defined" "$latest_trace" | grep -Ei "secret|token|key|api" >/dev/null 2>&1; then
            ISSUES+=("Potential missing environment variable detected in build/runtime logs.")
            REPAIRS+=("Audit Vercel Project Settings for missing secrets (API keys/tokens).")
        fi

        # Config Syntax Errors
        if grep -q "Error: Invalid next.config.js" "$latest_trace"; then
            ISSUES+=("Next.js configuration syntax error detected.")
            REPAIRS+=("Surgically repair next.config.js syntax.")
        fi
    fi
fi

# JSON Generation helpers
json_array() {
  local arr=("$@")
  local out="["
  for i in "${!arr[@]}"; do
    local val=$(echo "${arr[$i]}" | sed 's/"/\\"/g')
    out+="\"$val\""
    if [ "$i" -lt $((${#arr[@]} - 1)) ]; then out+=","; fi
  done
  out+="]"
  echo "$out"
}

issues_json=$(json_array "${ISSUES[@]}")
repairs_json=$(json_array "${REPAIRS[@]}")

cat > "$OUT" <<JSON
{
  "framework": "next",
  "issues_detected": $issues_json,
  "suggested_repairs": $repairs_json,
  "audited_at": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
}
JSON

if [ ${#ISSUES[@]} -gt 0 ]; then
    log "Audit complete. Found ${#ISSUES[@]} pathological deployment patterns."
else
    log "✅ Next.js genome verified as Vercel-optimized."
fi

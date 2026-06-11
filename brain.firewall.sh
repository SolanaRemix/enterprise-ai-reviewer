
#!/usr/bin/env bash
set -euo pipefail

ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
BRAIN="$ROOT/.repo-brain"

log() { echo "🧠 [firewall] $1"; }

patterns=(
  "OPENAI_API_KEY"
  "apiKey"
  "child_process"
  "subprocess"
  "os.system"
  "exec("
  "eval("
)

blocked_files=()

# Scan cached (staged) files
for f in $(git diff --cached --name-only); do
  # Skip non-code files
  [[ "$f" =~ \.(md|txt|json)$ ]] && continue
  
  for p in "${patterns[@]}"; do
    if grep -q "$p" "$f" >/dev/null 2>&1; then
      blocked_files+=("$f ($p)")
    fi
  done
done

if [ ${#blocked_files[@]} -gt 0 ]; then
  log "❌ Commit blocked due to unsafe patterns:"
  for b in "${blocked_files[@]}"; do
    echo " - $b"
  done
  exit 1
fi

log "✅ Firewall passed"
exit 0

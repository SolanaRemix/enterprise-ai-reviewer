#!/usr/bin/env bash
set -euo pipefail

ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
BRAIN="$ROOT/.repo-brain"
DIAG="$BRAIN/diagnosis.json"
OUT="$ROOT/.github/copilot-instructions.md"

[ -f "$DIAG" ] || { echo "Diagnosis missing, run brain.run.sh first"; exit 1; }

mkdir -p "$(dirname "$OUT")"

log() { echo "🤖 [copilot] $1"; }

status=$(${JQ_BIN:-jq} -r '.status' "$DIAG")
framework=$(${JQ_BIN:-jq} -r '.framework' "$DIAG")
langs=$(${JQ_BIN:-jq} -r '.languages | join(", ")' "$DIAG")

cat > "$OUT" <<EOF
# 🤖 Copilot Governance Instructions (MERMEDA v1.1.0)

## Environment
- **Repository**: $(basename "$ROOT")
- **Status**: $status
- **Stack**: $langs ($framework)

## AI Behavioral Contracts
1. **Infrastructure Isolation**: Always prefer modifying configuration in \`.github/workflows/\` or root config files rather than application logic in \`src/\`.
2. **Framework Alignment**: When writing code for **$framework**, strictly adhere to canonical patterns (e.g., Next.js App Router, Nuxt composables).
3. **Security First**: If adding shell executions, ensure they are wrapped in safety checks. Do not suggest \`os.system\` or \`eval\`.
4. **Intent Preservation**: Do not refactor existing business logic unless the PR description explicitly requests structural modernization.
5. **Brain Compliance**: If adding new management tasks, register them in \`.repo-brain/brainctl.sh\`.

## Blocked Patterns
- Hardcoded API keys (use \`process.env\` or \`os.getenv\`)
- Manual workflow injection (use MERMEDA templates)
- Overwriting \`.repo-brain/diagnosis.json\`

> This file is autonomously maintained by REPO BRAIN HOSPITAL.
EOF

log "Copilot instructions synchronized at $OUT"

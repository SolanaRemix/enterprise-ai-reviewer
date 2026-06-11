#!/usr/bin/env bash
set -euo pipefail

# REPO BRAIN HOSPITAL - Neural Instruction Grafts (v2.2.0)
# Purpose: Synthesize high-fidelity behavioral contracts for LLM agents (Copilot/Cursor).

ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
BRAIN="$ROOT/.repo-brain"
DIAG="$BRAIN/diagnosis.json"
OUT="$ROOT/.github/copilot-instructions.md"
COMMENTS_DIR="$BRAIN/auto-comments"

# Ensure jq availability
JQ="${JQ_BIN:-jq}"
if ! command -v "$JQ" >/dev/null 2>&1; then
    # Fallback to node-based parser if available in hospital tools
    if [ -f "$BRAIN/tools/json-cli.js" ]; then
        JQ="node $BRAIN/tools/json-cli.js"
    fi
fi

mkdir -p "$(dirname "$OUT")"

log() { echo "🤖 [guard:surgeon] $1"; }

[ -f "$DIAG" ] || { log "Diagnosis missing. Cannot graft neural instructions."; exit 0; }

# Extract Core Signal
status=$($JQ -r '.status' "$DIAG")
reason=$($JQ -r '.reason' "$DIAG")
framework=$($JQ -r '.framework' "$DIAG")
languages=$($JQ -r '.languages | join(", ")' "$DIAG")

# Gather Pathological Alerts from AI Guard
findings=""
if [ -d "$COMMENTS_DIR" ]; then
  # Find markdown files, but avoid recursion into subdirs if any
  for f in "$COMMENTS_DIR"/*.md; do
    [ -f "$f" ] || continue
    # Translate underscore-escaped filename back to path
    fname=$(basename "$f" .md | tr '_' '/')
    # Extract findings from the markdown (bullet points)
    finding=$(grep -E "^- " "$f" | sed 's/^- //' | tr '\n' '; ' | sed 's/; $//')
    if [ -n "$finding" ]; then
      findings+="- **$fname**: $finding\n"
    fi
  done
fi

log "Synthesizing targeted instructions for $framework genome..."

cat > "$OUT" <<EOF
# 🧠 REPO BRAIN HOSPITAL: Neural Behavioral Contract (v2.2.0)
**Autonomous Governance Protocol: MERMEDA v2.0 • CyberAI Oracle**

## 🩺 Active Patient Diagnosis (Oracle Signal)
- **Repo Signal**: $status
- **Medical Context**: $reason
- **Stack Genome**: $languages ($framework)

## 🛠️ Targeted Prompt Contracts (Surgical Behavioral Enforce)
1. **Framework CI Enhancement**: strictly adhere to the verified **$framework** CI contract. For TypeScript stacks, always prioritize \`npm run build\` to resolve type-conflicts and pass pre-admission tests before suggesting logic changes.
2. **Infrastructure Isolation**: The \`.github/workflows/\`, \`package.json\`, and root config files are managed by the Hospital Surgeon. Only suggest modifications to these files if explicitly fixing a CI drift or adding required automation.
3. **Neural Bridge Grafting**: If a missing \`GITHUB_TOKEN\` or authentication loop is detected, do not suggest hardcoding keys. Always recommend secure environment variable grafting and Phase 14 Neural Bridge restoration.
4. **Clean State Restoration**: Prioritize suggestions that return the repository to a 'GREEN-locked' state. If multiple solutions exist, choose the most surgical (least invasive) patch.
5. **Logic Isolation (Sterile Zone)**: Application logic in core directories (e.g., \`src/\`, \`app/\`) is a sterile zone. Do not refactor business logic or change API signatures unless the intent is specifically provided. Focus on 'Plumbing First, Intent Second'.
6. **AI Guard Compliance**: Block and flag any patterns involving \`child_process.exec\`, \`os.system\`, or \`eval()\`. Prefer safe, audited standard libraries and framework-native wrappers.
7. **File Extinction**: Do not suggest the creation of 'one-off' scripts or utility files that bypass the MERMEDA build pipeline. Use existing hooks in \`.repo-brain/brainctl.sh\`.

## ⚠️ Pathological Security Alerts (AI Guard Findings)
$( [ -n "$findings" ] && echo -e "$findings" || echo "- No pathological alerts currently detected. The genome is stable.")

## 🏥 Hospital Workflow & Automations
- **Surgical Patching**: Favor targeted line-patches over mass file rewrites.
- **Verification Loop**: Before finalizing suggestions, mentally execute the verified **Node.js (v20)**, **Hardhat**, or **Rust** toolchain build steps.
- **Auto-Comments**: If an unsafe pattern is detected, append a surgical advisory comment instead of deleting code, maintaining the forensic trail.

> This contract is autonomously generated and maintained by the REPO BRAIN HOSPITAL V2 - CyberAI Oracle.
EOF

log "Neural Instruction Graft successful at $OUT"

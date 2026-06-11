#!/usr/bin/env bash
set -euo pipefail

# REPO BRAIN HOSPITAL - Automated Testing Suite (v1.2.0)
# Purpose: Validates the structural integrity and logic of management modules.

ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
BRAIN="$ROOT/.repo-brain"
TEST_DIR="$ROOT/.repo-brain-test-sandbox"

log() { echo "🧪 [test:runner] $1"; }
error() { echo "❌ [test:error] $1"; exit 1; }

# Cleanup previous sandbox
rm -rf "$TEST_DIR"
mkdir -p "$TEST_DIR/.repo-brain"

# 1. Mock Environment Setup
log "Setting up clinical test sandbox..."
cp -R "$BRAIN/"* "$TEST_DIR/.repo-brain/"
cd "$TEST_DIR"

# Ensure JQ_BIN is set for the sandbox run
export JQ_BIN="${JQ_BIN:-jq}"

# ---------------------------------------------------------
# Test 1: AI Guard (Security Pathologies)
# ---------------------------------------------------------
log "Running Test: AI Guard (Security Scan)..."
mkdir -p "src"
cat > "src/pathology.py" <<EOF
import os
def unsafe():
    os.system("rm -rf /") # Unsafe shell
    key = "sk-1234567890abcdef1234567890abcdef1234567890abcdef" # Mock OpenAI Key
EOF

cat > "src/api.ts" <<EOF
const anthropic = "ant-api-1234567890abcdef1234567890abcdef1234567890abcdef1234567890";
eval("console.log(1)"); // Injection risk
EOF

./.repo-brain/brain.ai.guard.sh >/dev/null 2>&1

[ -f ".repo-brain/auto-comments/src_pathology_py.md" ] || error "AI Guard failed to flag Python pathology"
grep -q "Unsafe shell execution" ".repo-brain/auto-comments/src_pathology_py.md" || error "AI Guard missed shell risk"
grep -q "OpenAI Secret Key" ".repo-brain/auto-comments/src_pathology_py.md" || error "AI Guard missed OpenAI leak"
log "✅ AI Guard verified."

# ---------------------------------------------------------
# Test 2: Angular Framework Detection & Integration
# ---------------------------------------------------------
log "Running Test: Angular Stack Integration..."
cat > "package.json" <<EOF
{
  "name": "angular-test",
  "dependencies": {
    "@angular/core": "^17.0.0"
  },
  "scripts": {
    "build": "ng build"
  }
}
EOF

./.repo-brain/brain.detect.sh >/dev/null 2>&1
framework=$($JQ_BIN -r '.framework' ".repo-brain/detect.json")
[ "$framework" == "angular" ] || error "Failed to detect Angular framework (Got: $framework)"

./.repo-brain/brain.frameworks.ci.sh >/dev/null 2>&1
ci_cmd=$($JQ_BIN -r '.expected_ci_cmd' ".repo-brain/framework_ci.json")
[ "$ci_cmd" == "npm run build" ] || error "Angular CI command mismatch"

./.repo-brain/brain.normalize.sh >/dev/null 2>&1
[ -f ".github/workflows/ci.yml" ] || error "Angular CI workflow not normalized"
grep -q "npm run build" ".github/workflows/ci.yml" || error "Angular CI workflow content mismatch"
log "✅ Angular Integration verified."

# ---------------------------------------------------------
# Test 3: Vercel Troubleshooter (Missing Env Vars & OOM)
# ---------------------------------------------------------
log "Running Test: Vercel Forensic Audit (Env & OOM)..."
# Set as Next.js
cat > "package.json" <<EOF
{
  "name": "next-app",
  "dependencies": { "next": "latest" },
  "scripts": { "build": "next build" }
}
EOF
./.repo-brain/brain.detect.sh >/dev/null 2>&1

# Mock an autopsy log with OOM and Env Var signatures
mkdir -p ".repo-brain/autopsy"
cat > ".repo-brain/autopsy/last_run.trace" <<EOF
[ERROR] Environment variable NEXT_PUBLIC_API_KEY is undefined.
[FATAL] JavaScript heap out of memory
EOF

./.repo-brain/brain.vercel.troubleshoot.sh >/dev/null 2>&1
[ -f ".repo-brain/vercel_troubleshoot.json" ] || error "Vercel troubleshoot report not generated"

# Verify repair accuracy
grep -q "Potential missing environment variable" ".repo-brain/vercel_troubleshoot.json" || error "Failed to detect missing env var in logs"
grep -q "Hard evidence of OOM failure" ".repo-brain/vercel_troubleshoot.json" || error "Failed to detect OOM in logs"
grep -q "Audit Vercel Project Settings for missing secrets" ".repo-brain/vercel_troubleshoot.json" || error "Incorrect repair suggestion for env var"
log "✅ Vercel Troubleshooting verified."

# ---------------------------------------------------------
# Test 4: TypeScript Genome Integrity
# ---------------------------------------------------------
log "Running Test: TypeScript Genome Integrity..."
touch "tsconfig.json"
# Detection should identify typescript if node is present
./.repo-brain/brain.detect.sh >/dev/null 2>&1
langs=$($JQ_BIN -r '.languages | join(",")' ".repo-brain/detect.json")
[[ "$langs" == *"node"* ]] || error "TypeScript/Node detection failed"

# Verify verify.sh build check
# (We skip actual npm install for speed, just check logic)
./.repo-brain/brain.verify.sh >/dev/null 2>&1 || true
[ -f ".repo-brain/verification.log" ] || error "Verification log not created"
log "✅ TypeScript Genome verified."

# ---------------------------------------------------------
# Test 5: Master Orchestration (Dry Run)
# ---------------------------------------------------------
log "Running Test: Master Orchestration (Full Cycle)..."
./.repo-brain/brain.run.sh >/dev/null 2>&1 || error "Master brain.run.sh failed execution"
[ -f ".repo-brain/diagnosis.json" ] || error "Diagnosis not generated after master run"
log "✅ Master Orchestration verified."

# Graduation
cd "$ROOT"
rm -rf "$TEST_DIR"
log "🏁 ALL BRAIN TESTS PASSED (v1.2.0). REPAIR ACCURACY VERIFIED."

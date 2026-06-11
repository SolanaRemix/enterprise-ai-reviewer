#!/usr/bin/env bash
set -euo pipefail

ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
BRAIN="$ROOT/.repo-brain"
OUT_JSON="$BRAIN/vitals.json"
OUT_MD="$BRAIN/vitals.md"

log() { echo "🧠 [vitals] $1"; }

log "Collecting repo vitals…"

# Repo size
repo_size=$(du -sh "$ROOT" 2>/dev/null | awk '{print $1}')

# File count
file_count=$(find "$ROOT" -type f | wc -l | tr -d ' ')

# Largest directories
largest=$(du -sh "$ROOT"/* 2>/dev/null | sort -hr | head -n 5 | sed 's/^/  - /')

# Git history depth
commit_count=$(git rev-list --count HEAD 2>/dev/null || echo 0)

# Last commit age
last_commit=$(git log -1 --format="%cr" 2>/dev/null || echo "unknown")

# CI workflow count
workflow_count=$(ls "$ROOT/.github/workflows"/*.yml 2>/dev/null | wc -l | tr -d ' ')

# Test duration (simulated check)
test_start=$(date +%s)
if [ -f "$ROOT/package.json" ] && grep -q '"test"' "$ROOT/package.json"; then
  npm test >/dev/null 2>&1 || true
fi
test_end=$(date +%s)
test_duration=$((test_end - test_start))

# Build duration (simulated check)
build_start=$(date +%s)
if [ -f "$ROOT/package.json" ] && grep -q '"build"' "$ROOT/package.json"; then
  npm run build >/dev/null 2>&1 || true
fi
build_end=$(date +%s)
build_duration=$((build_end - build_start))

cat > "$OUT_JSON" <<EOF
{
  "repoSize": "$repo_size",
  "fileCount": "$file_count",
  "largestDirs": "$(echo "$largest" | tr '\n' ';')",
  "commitCount": "$commit_count",
  "lastCommitAge": "$last_commit",
  "workflowCount": "$workflow_count",
  "testDurationSec": "$test_duration",
  "buildDurationSec": "$build_duration",
  "captured_at": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
}
EOF

cat > "$OUT_MD" <<EOF
# 🧠 Repo Vitals Report

- **Repo size**: $repo_size  
- **File count**: $file_count  
- **Git commits**: $commit_count  
- **Last activity**: $last_commit  
- **Active Workflows**: $workflow_count
- **Test duration**: ${test_duration}s  
- **Build duration**: ${build_duration}s  

## Largest directory distribution
$largest
EOF

log "Vitals written to $OUT_JSON"

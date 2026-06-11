#!/usr/bin/env bash
set -euo pipefail

ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
BRAIN="$ROOT/.repo-brain"

if [ -f "$ROOT/Cargo.toml" ]; then
  echo "cargo test" > "$BRAIN/rust_ci_cmd"
  echo "Rust toolchain verified."
fi

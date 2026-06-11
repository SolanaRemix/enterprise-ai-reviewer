#!/usr/bin/env bash
set -euo pipefail

ROOT="$(pwd)"
BRAIN_TEMPLATE_DIR="$ROOT/.repo-brain-template"

# 1) Ensure we have a template brain to copy
if [ ! -d "$BRAIN_TEMPLATE_DIR" ]; then
  echo "[fleet-bootstrap] No .repo-brain-template found at $BRAIN_TEMPLATE_DIR"
  echo "Create one by running install.sh in a reference repo and copying .repo-brain here."
  exit 1
fi

# 2) Target repos
repos=()
while IFS= read -r d; do
  repos+=("$d")
done < <(find . -maxdepth 1 -type d ! -name ".git" ! -name ".repo-brain-template" ! -name ".")

echo "[fleet-bootstrap] found ${#repos[@]} repos"

for r in "${repos[@]}"; do
  repo_path="$ROOT/${r#./}"
  if [ ! -d "$repo_path/.git" ]; then
    echo "[fleet-bootstrap] skipping $repo_path (no .git)"
    continue
  fi

  echo "[fleet-bootstrap] bootstrapping $repo_path"

  if [ ! -d "$repo_path/.repo-brain" ]; then
    cp -R "$BRAIN_TEMPLATE_DIR" "$repo_path/.repo-brain"
  fi

  (cd "$repo_path" && ./.repo-brain/install.sh || true)
done

echo "[fleet-bootstrap] done. You can now run fleet dashboard."

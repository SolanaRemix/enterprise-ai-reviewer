#!/usr/bin/env bash
set -euo pipefail

for r in */; do
  [ -d "$r/.git" ] || continue
  echo "Syncing repo-brain into $r"
  rsync -a repo-brain/ "$r/.repo-brain/" --exclude ".git"
done

#!/usr/bin/env bash
set -euo pipefail

ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
VERSIONS="$ROOT/.repo-brain.versions"
FROM="${1:-v1.0.0}"
TO="${2:-v1.1.0}"
OUT="$ROOT/.repo-brain/genome.json"

log() { echo "🧬 [genome] $1"; }

if [ ! -d "$VERSIONS/$FROM" ]; then
  log "Source version $FROM missing"
  exit 1
fi

if [ ! -d "$VERSIONS/$TO" ]; then
  log "Target version $TO missing"
  exit 1
fi

log "Calculating genetic diff: $FROM → $TO"

# Use a temporary file to build the JSON report
tmp=$(mktemp)
echo "{" > "$tmp"
echo "  \"from\": \"$FROM\"," >> "$tmp"
echo "  \"to\": \"$TO\"," >> "$tmp"
echo "  \"changes\": [" >> "$tmp"

# Detect added, modified, removed files
first=true
while read -r change_type file; do
  [ "$first" = true ] || echo "," >> "$tmp"
  first=false
  
  case "$change_type" in
    A) cname="added" ;;
    M) cname="modified" ;;
    D) cname="removed" ;;
    *) cname="unknown" ;;
  esac
  
  echo "    { \"file\": \"$file\", \"change\": \"$cname\" }" >> "$tmp"
done < <(diff -rq "$VERSIONS/$FROM" "$VERSIONS/$TO" | awk '{if($1=="Files") print "M", $2; else if($1=="Only") {split($3,a,":"); if(index($3,"'"$FROM"'")) print "D", $4; else print "A", $4}}')

echo "  ]" >> "$tmp"
echo "}" >> "$tmp"

mkdir -p "$(dirname "$OUT")"
mv "$tmp" "$OUT"
log "Genome evolution report generated at $OUT"

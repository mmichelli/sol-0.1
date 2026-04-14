#!/usr/bin/env bash
set -e
cd "$(dirname "$0")"
mkdir -p previews
for f in drawings/[0-9][0-9][0-9]-*.html; do
  num=$(basename "$f" | cut -c1-3)
  out="previews/${num}.png"
  echo "rendering $f -> $out"
  chromium --headless=new --disable-gpu --hide-scrollbars --no-sandbox \
    --window-size=720,720 \
    --virtual-time-budget=4000 \
    --screenshot="$out" \
    "file://$(pwd)/$f?embed=1" 2>/dev/null
done
echo "done."

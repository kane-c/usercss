#!/usr/bin/env sh
set -e

convert() {
  if [ -z "$1" ]; then
    echo "Filename required"
    exit 1
  fi

  INPUT=$1

  # Extract the metadata block
  META=$(sed -n '/==UserStyle==/,/==\/UserStyle==/p' "$INPUT")

  # Extract @match entries from @-moz-document
  MATCHES=$(grep '@-moz-document' "$INPUT" |
    sed -EH 's/@-moz-document\s+//' |
    sed -EH 's/domain\("([^"]+)"\)\s*\{?/@match          https:\/\/*.\1\/*/g' |
    sed -EH 's/,\s*/\n/g')

  # Remove the @-moz-document wrapper
  CSS=$(sed '/@-moz-document/,/^}/!d' "$INPUT" |
    sed '1d;$d') # Remove first and last line (the @-moz-document { and closing })

  # Escape for a JS template string
  ESCAPED_CSS=$(printf "%s" "$CSS" | sed 's/\\/\\\\/g; s/`/\\`/g; s/^  //')

  # Build the metadata block
  echo "// ==UserScript=="
  echo "$META" | grep '@' | sed 's/^/\/\/ /; s/\.css/.js/'
  echo "$MATCHES" | sed 's/^/\/\/ /'
  echo "// @grant          GM.addStyle"
  echo "// ==/UserScript==\n"

  # Output the JS
  echo "(function() {"
  echo "  'use strict';"
  printf "  GM.addStyle(\`%s\`);" "$ESCAPED_CSS"
  echo "})();"
}

for f in *.css; do
  convert "$f" >"${f%.*}.js"
done

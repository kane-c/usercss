#!/usr/bin/env sh
set -e

convert() {
  if [ -z "$1" ]; then
    echo 'Filename required'
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
    # Remove first and last line (the @-moz-document { and closing })
    sed '1d;$d')

  # Escape for a JS template string
  # shellcheck disable=SC2016
  ESCAPED_CSS=$(printf '%s' "$CSS" | sed 's/\\/\\\\/g; s/`/\\`/g; s/^  //')

  # Build the metadata block
  echo '// ==UserScript=='
  echo "$META" | grep '@' | sed 's/^/\/\/ /; s/\.css/.js/'
  echo "$MATCHES" | sed 's/^/\/\/ /'
  # shellcheck disable=SC2028
  echo '// ==/UserScript==\n'

  # Output the JS
  echo '(function() {'
  echo "  'use strict';"
  echo "  const style = document.createElement('style');"
  # shellcheck disable=SC2016
  printf '  style.innerHTML = `%s`;\n' "$ESCAPED_CSS"
  echo '  document.body.appendChild(style);'
  echo '})();'
}

if [ "$#" -eq 0 ]; then
  set -- *.css
  [ "$1" = '*.css' ] && exit 0
fi

for css_name in "$@"; do
  js_name="${css_name%.*}.js"
  echo "$css_name -> $js_name"
  convert "$css_name" >"$js_name"
done

# usercss

Custom CSS to clean various websites.

## Building

The `*.user.css` files are intended for use with [Stylus](https://add0n.com/stylus.html).

The `*.user.js` files can be used with Greasemonkey-like extensions.

Convert a `.user.css` file to `.user.js` with `./convert-to-userscripts.sh`.

Run it with one or more paths to CSS files to convert each one to JS. If none
are given, convert all files in the current directory.

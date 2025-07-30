// ==UserScript==
// @name           Clean ChatGPT
// @namespace      github.com/kane-c/usercss
// @version        1.1.0
// @description    Clean for anonymous usage
// @author         @kane-c
// @updateURL      https://raw.githubusercontent.com/kane-c/usercss/refs/heads/main/chatgpt.user.js
// @match          https://*.chatgpt.com/*
// @grant          GM.addStyle
// ==/UserScript==

(function() {
  'use strict';
  GM.addStyle(`/* ChatGPT front page title */
h1,
/* Top nav with login buttons */
#page-header,
/* Terms popup */
#thread-bottom .start-0,
/* Disclaimer */
#thread-bottom~div,
/* Voice button */
button[aria-label="Start voice mode"],
/* Ads */
body > .popover {
  display: none !important;
}

/* Remove space after removing nav */
:root {
  --header-height: 0;
}

.-mb-\\(--composer-overlap-px\\) {
  margin-bottom: -7.5rem;
}

/* Add space after removing disclaimer */
#thread-bottom {
  margin-bottom: 1rem;
}`);})();

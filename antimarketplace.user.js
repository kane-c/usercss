// ==UserScript==
// @name         Anti-marketplace
// @namespace    github.com/kane-c/usercss
// @version      1.2.1
// @description  Excludes Marketplace results from Australian retailers. Companion of the adblock filter list: https://github.com/danielnixon/anti-marketplace
// @author       @kane-c
// @downloadURL  https://raw.githubusercontent.com/kane-c/usercss/refs/heads/main/antimarketplace.user.js
// @updateURL    https://raw.githubusercontent.com/kane-c/usercss/refs/heads/main/antimarketplace.user.js
// @match        https://www.kmart.com.au/search/*searchTerm*
// @match        https://www.woolworths.com.au/shop/search/products*
// @match        https://www.woolworths.com.au/shop/browse/*
// @match        https://www.jbhifi.com.au/search*
// @match        https://www.jbhifi.com.au/collections/*
// @run-at       document-start
// ==/UserScript==

(() => {
  'use strict';

  const siteRules = {
    jbhifi: ['excludeMarketplace', 'true'],
    kmart: ['f.Shops', ['Kmart', 'Target']],
    woolworths: ['isHideEverydayMarketProducts', 'true'],
  };

  const url = new URL(window.location.href);

  const [param, expectedValues] = siteRules[url.hostname.split('.')[1]];
  const values = Array.isArray(expectedValues) ? expectedValues : [expectedValues];
  const currentValues = url.searchParams.getAll(param);
  let changed = false;
  for (const expectedValue of values) {
    if (!currentValues.includes(expectedValue)) {
      url.searchParams.append(param, expectedValue);
      changed = true;
    }
  }

  if (changed) {
    window.location.replace(url.toString());
  }
})();

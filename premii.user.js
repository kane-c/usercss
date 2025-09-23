// ==UserScript==
// @name           premii.com
// @namespace      github.com/kane-c/usercss
// @version        1.2.0
// @description    Clean Premii
// @author         @kane-c
// @updateURL      https://raw.githubusercontent.com/kane-c/usercss/refs/heads/main/premii.user.js
// @match          https://*.premii.com/*
// ==/UserScript==

(function () {
  "use strict";

  // Disable analytics
  if (window.helper) {
    window.helper.enableAnalytics = () => {};
    window.helper.localAnalytics = () => {};
  }

  function updateTitle() {
    const { hash } = window.location;
    let title;
    if (hash.startsWith("#/comments/")) {
      const h3 = document.querySelector("h3.title");
      if (!h3) {
        title = "Hacker News";
      } else {
        title = h3.innerText;
        title += " | Hacker News";
      }
    } else {
      title = "Hacker News";
    }

    document.title = title;
  }

  window.addEventListener("hashchange", updateTitle);
  updateTitle();

  const style = document.createElement("style");
  style.innerHTML = `body {
  color: #1d1d1f;
  font-family:
    system-ui,
    -apple-system,
    "Segoe UI",
    Roboto,
    "Helvetica Neue",
    "Noto Sans",
    "Liberation Sans",
    Arial,
    sans-serif,
    "Apple Color Emoji",
    "Segoe UI Emoji",
    "Segoe UI Symbol",
    "Noto Color Emoji";
  -webkit-font-smoothing: antialiased;
  letter-spacing: -0.022em;
}

@media (prefers-color-scheme: dark) {
  body {
    color: #ddd;
  }
}

/* Remove space before time-ago */
.story {
  font-size: 0;
}

.page-stories .bd span {
  font-size: 0.86rem;
}

.page-stories .bd h3 {
  font-size: 1.07rem;
}

.story[href^="https://v.redd.it"] .thumb:after
{
  color: rgba(255, 255, 255, 0.8);
  content: "▶";
  display: block;
  font-size: 2rem;
  height: 64px;
  position: absolute;
  text-align: center;
  text-shadow: 0px 1px 0.25rem rgba(0, 0, 0, 0.5);
  top: 1.25rem;
  width: 64px;
}

/* Both */
.twitter,
.page-stories span.author,
li:has(a[data-track="tweet-premii-setting"]),
.list-line .donate,
h3:nth-of-type(2),
/* HN */
.header .submenu .share,
.page-comments div.l-menu + .r-menu,
/* reddit */
.options-list .web-only,
.footer-container,
.header .my-profile-id,
.gilded,
.page-stories .stories-list .author-flair,
.page-comments .article-comments .vote-comment,
.page-comments .article-comments .reply-comment,
.create-post-container,
.share-this,
.kid[data-author="AutoModerator"] {
  display: none;
}

html {
  -theme-background-color-light: #fff;
  -theme-background-color-lighter: #fff;
  -theme-background-color-lighter-dark: #fff;
}`;
  document.body.appendChild(style);
})();

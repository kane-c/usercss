// ==UserScript==
// @name           premii.com
// @namespace      github.com/kane-c/usercss
// @version        1.3.0
// @description    Clean Premii
// @author         @kane-c
// @downloadURL    https://raw.githubusercontent.com/kane-c/usercss/refs/heads/main/premii.user.js
// @updateURL      https://raw.githubusercontent.com/kane-c/usercss/refs/heads/main/premii.user.js
// @icon           https://hn.premii.com/a/icon/hn/Icon-32.png
// @match          https://*.premii.com/*
// ==/UserScript==

(function () {
  "use strict";

  // Disable analytics
  if (typeof unsafeWindow !== "undefined") {
    unsafeWindow.helper.enableAnalytics = () => {};
    unsafeWindow.helper.localAnalytics = () => {};
  }

  const site =
    window.location.hostname === "hn.premii.com" ? "Hacker News" : "reddit";

  function updateTitle() {
    const { hash } = window.location;
    let title;
    if (hash.includes("/comments/")) {
      const h3 = document.querySelector(".article-meta-items .title");
      if (h3) {
        title = h3.innerText;
      }
    } else {
      title = document.querySelector(
        site === "Hacker News" ? ".title .bottom" : ".title .top",
      )?.innerText;

      if (title === "Frontpage") {
        title = undefined;
      }
    }

    document.title = title ? `${title} | ${site}` : site;
  }

  window.addEventListener("popstate", updateTitle);
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
  .theme-dark body {
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

.story[href^="https://v.redd.it"] .thumb:after {
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

.theme-light {
  --theme-background-color-light: #fff;
  --theme-background-color-lighter: #fff;
  --theme-background-color-lighter-dark: #fff;
}`;
  document.body.appendChild(style);
})();

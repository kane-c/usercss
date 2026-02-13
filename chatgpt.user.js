// ==UserScript==
// @name           Clean ChatGPT
// @namespace      github.com/kane-c/usercss
// @version        1.4.2
// @description    Clean for anonymous usage
// @author         @kane-c
// @downloadURL    https://raw.githubusercontent.com/kane-c/usercss/refs/heads/main/chatgpt.user.js
// @updateURL      https://raw.githubusercontent.com/kane-c/usercss/refs/heads/main/chatgpt.user.js
// @icon           https://cdn.oaistatic.com/assets/favicon-l4nq08hd.svg
// @match          https://*.chatgpt.com/*
// ==/UserScript==

(function () {
  "use strict";
  const style = document.createElement("style");
  style.innerHTML = `/* ChatGPT front page title */
h1,
/* Top nav with login buttons */
#page-header,
/* And mobile */
.sticky.h-header-height,
/* Sidebar */
#stage-slideover-sidebar,
/* Starter prompts */
#page-header+.flex>.flex,
/* Terms popup */
#thread-bottom .start-0,
/* Disclaimer */
#thread-bottom~div,
/* Voice button */
button[aria-label="Start Voice"],
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
}`;
  document.body.appendChild(style);

  // Delay adding the button to avoid React hydration issues
  setTimeout(() => {
    const composerButtons = document.querySelectorAll(
      '[data-testid="composer-footer-actions"] button',
    );

    const lastButtonContainer =
      composerButtons[composerButtons.length - 1].parentNode;
    const btnContainer = lastButtonContainer.cloneNode(true);
    const copyButton = btnContainer.querySelector("button");
    copyButton.setAttribute("data-test-id", "composer-button-copy-all");
    copyButton.setAttribute("aria-label", "Copy all");
    const svg = copyButton.querySelector("use");
    const href = svg.getAttribute("href");
    svg.setAttribute("href", href.slice(0, href.length - 7) + "#ce3544");
    const copyButtonText = copyButton.querySelector("div");
    copyButtonText.innerText = "Copy all";
    lastButtonContainer.parentNode.insertBefore(
      btnContainer,
      lastButtonContainer.nextSibling,
    );

    copyButton.addEventListener("click", async () => {
      const buttons = document.querySelectorAll(
        'button[data-testid="copy-turn-action-button"]',
      );

      if (!buttons.length) {
        return;
      }

      const readPermission = await navigator.permissions.query({
        name: "clipboard-read",
      });

      if (readPermission.state === "denied") {
        return;
      }

      if (readPermission.state === "prompt") {
        // Trigger the prompt
        try {
          await navigator.clipboard.readText();
        } catch (err) {
          // Prompt denied
          return;
        }
      }

      copyButton.disabled = true;
      const chat = { "text/html": [], "text/plain": [] };
      const promise = new Promise((resolve) => {
        buttons.forEach((btn, i) => {
          setTimeout(
            () => {
              btn.click();
              setTimeout(async () => {
                const prefix = (i % 2 === 0 ? "You" : "Bot") + " said:";
                const items = await navigator.clipboard.read();
                for (const clipboardItem of items) {
                  let text = await (
                    await clipboardItem.getType("text/plain")
                  ).text();
                  let html;

                  if (clipboardItem.types.length === 1) {
                    html = `<p>${text}</p>`;
                  } else {
                    html = (
                      await (await clipboardItem.getType("text/html")).text()
                    ).replace('<meta charset="utf-8">', "");
                  }

                  text = `${prefix}\n${text}`;

                  html = `<article><h6>${prefix}</h6>${html}</article>`;

                  chat["text/html"].push(html);
                  chat["text/plain"].push(text);
                }

                if (i === buttons.length - 1) {
                  resolve();
                }
              }, 50);
            },
            100 * (i + 1),
          );
        });
      });

      promise.then(async () => {
        chat["text/html"] = chat["text/html"].join("");
        chat["text/plain"] = chat["text/plain"].join("\n\n");

        await navigator.clipboard.write([new ClipboardItem(chat)]);

        copyButton.disabled = false;
        copyButtonText.innerText = "Copied";

        setTimeout(() => {
          copyButtonText.innerText = "Copy all";
        }, 1000);
      });
    });
  }, 1500);
})();

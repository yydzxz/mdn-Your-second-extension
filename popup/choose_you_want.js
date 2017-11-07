/**
 * CSS to hide everything on the page,
 * except for elements that have the "beastify-image" class.
 */
//const hidePage = 'body > :not(.beastify-image) { display: none; }';单引号中不能有回车，所以用反撇号
const hidePage = `body > :not(.beastify-image) {
                    display: none;
                  }`;

/**
 * Listen for clicks on the buttons, and send the appropriate message to
 * the content script in the page.
 */

function listenForClicks() {
    document.addEventListener("click", (e) => {

        /**
         * Given the name of a beast, get the URL to the corresponding image.
         */
        // function beastNameToURL(beastName) {
        //     switch (beastName) {
        //         case "Frog":
        //             return browser.extension.getURL("beasts/frog.jpg");
        //         case "Snake":
        //             return browser.extension.getURL("beasts/snake.jpg");
        //         case "Turtle":
        //             return browser.extension.getURL("beasts/turtle.jpg");
        //     }
        // }

        function optionToURL(option) {
            function onCreated(tab) {
                console.log(`Created new tab: ${tab.id}`)
            }

            function onError(error) {
                console.log(`Error: ${error}`);
            }
            let url;
            switch (option) {
                case "算前程":
                    url = "/suanmingPage/qiancheng.html";
                case "算八卦":
                    url = "/suanmingPage/bagua.html";
                case "看面相":
                    url = "/suanmingPage/face.html";
            }
            let creating = browser.tabs.create({
                url: url
            });
            creating.then(onCreated, onError);
        }

        function startSuanming(tabs) {
            // browser.tabs.insertCSS({ code: hidePage }).then(() => {
            //     let url = optionToURL(e.target.textContent);
            //     browser.tabs.sendMessage(tabs[0].id, {
            //         command: "suanming",
            //         suanmingURL: url
            //     });
            // }
            // )
            let url = optionToURL(e.target.textContent);
            browser.tabs.sendMessage(tabs[0].id, {
                command: "suanming",
                suanmingURL: url
            });
        }

        /**
         * Insert the page-hiding CSS into the active tab,
         * then get the beast URL and
         * send a "beastify" message to the content script in the active tab.
         */
        // function beastify(tabs) {
        //     browser.tabs.insertCSS({ code: hidePage }).then(() => {
        //         let url = beastNameToURL(e.target.textContent);
        //         browser.tabs.sendMessage(tabs[0].id, {
        //             command: "beastify",
        //             beastURL: url
        //         });
        //     });
        // }



        function giveup(tabs) {
            browser.tabs.removeCSS({ code: hidePage }).then(() => {
                browser.tabs.sendMessage(tabs[0].id, {
                    command: "giveup",
                });
            });
        }

        /**
         * Remove the page-hiding CSS from the active tab,
         * send a "reset" message to the content script in the active tab.
         */
        // function reset(tabs) {
        //     browser.tabs.removeCSS({ code: hidePage }).then(() => {
        //         browser.tabs.sendMessage(tabs[0].id, {
        //             command: "reset",
        //         });
        //     });
        // }

        /**
         * Just log the error to the console.
         */
        function reportError(error) {
            console.error(`Could not beastify: ${error}`);
        }

        /**
         * Get the active tab,
         * then call "beastify()" or "reset()" as appropriate.
         */
        if (e.target.classList.contains("beast")) {
            browser.tabs.query({ active: true, currentWindow: true })
                .then(startSuanming)
                .catch(reportError);
        }
        else if (e.target.classList.contains("reset")) {
            browser.tabs.query({ active: true, currentWindow: true })
                .then(giveup)
                .catch(reportError);
        }
    });
}

/**
 * There was an error executing the script.
 * Display the popup's error message, and hide the normal UI.
 */
function reportExecuteScriptError(error) {
    document.querySelector("#popup-content").classList.add("hidden");
    document.querySelector("#error-content").classList.remove("hidden");
    console.error(`Failed to execute beastify content script: ${error.message}`);
}

/**
 * When the popup loads, inject a content script into the active tab,
 * and add a click handler.
 * If we couldn't inject the script, handle the error.
 */
browser.tabs.executeScript({ file: "/content_scripts/suanming.js" })
    .then(listenForClicks)
    .catch(reportExecuteScriptError);
/**
 * Listen for clicks on the buttons, and send the appropriate message to
 * the content script in the page.
 */

function listenForClicks() {
    document.getElementById("send").addEventListener("click", (e) => {

        function startSendMessage(tabs) {
            let messages = document.getElementById("message").value;
            let data = messages.split(';');
            browser.tabs.sendMessage(tabs[0].id, {
                command: "autoSendMessage",
                data: data,
            });
        }


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
        if (e.target.classList.contains("send")) {
            browser.tabs.query({ active: true, currentWindow: true })
                .then(startSendMessage)
                .catch(reportError);
        }else{
            console.log(e.target.classList);
        }
    });
    document.getElementById("stop").addEventListener("click", (e) => {
        function stopSendMessage(tabs) {
            browser.tabs.sendMessage(tabs[0].id, {
                command: "stop",
            });
        }
        /**
         * Just log the error to the console.
         */
        function reportError(error) {
            console.error(`Could not beastify: ${error}`);
        }
        if (e.target.classList.contains("stop")) {
            browser.tabs.query({ active: true, currentWindow: true })
                .then(stopSendMessage)
                .catch(reportError);
        }else{
            console.log(e.target.classList);
        }
    })
}

/**
 * There was an error executing the script.
 * Display the popup's error message, and hide the normal UI.
 */
function reportExecuteScriptError(error) {
    console.log('sssss');
    document.querySelector("#popup-content").classList.add("hidden");
    document.querySelector("#error-content").classList.remove("hidden");
    console.error(`Failed to execute beastify content script: ${error.message}`);
}

/**
 * When the popup loads, inject a content script into the active tab,
 * and add a click handler.
 * If we couldn't inject the script, handle the error.
 */
browser.tabs.executeScript({ file: "/content_scripts/autoSendMessage.js" })
    .then(listenForClicks)
    .catch(reportExecuteScriptError);
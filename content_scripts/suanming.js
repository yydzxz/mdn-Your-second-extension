(function () {
    /**
     * Check and set a global guard variable.
     * If this content script is injected into the same page again,
     * it will do nothing next time.
     */
    if (window.hasRun) {
        return;
    }
    window.hasRun = true;

    /**
     * Given a URL to a beast image, remove all existing beasts, then
     * create and style an IMG node pointing to
     * that image, then insert the node into the document.
     */
    function insertBeast(beastURL) {
        removeExistingBeasts();
        let beastImage = document.createElement("img");
        beastImage.setAttribute("src", beastURL);
        beastImage.style.height = "100vh";
        beastImage.className = "beastify-image";
        document.body.appendChild(beastImage);
    }


    function suanming(suanmingURL){
        let suanmingDIV = document.createElement("div");
        suanmingDIV.setAttribute("id", 'myDiv');
        suanmingDIV.style.height = "200px";
        suanmingDIV.style.width = "200px";
        suanmingDIV.style.background='black';
        suanmingDIV.style.position = 'absolute';//绝对位置
        suanmingDIV.style.display='inline';
        suanmingDIV.style.zIndex = 9999;
        suanmingDIV.className = "beastify-image";
        document.body.appendChild(suanmingDIV);
        setInterval(()=>{
            console.log(document.body.clientWidth);
            let x = (Math.random() * document.body.clientWidth)+'px';
            let y = Math.random() * (document.body.clientHeight)+'px';
            alert(x+','+y);
            $('#myDiv').css({ 'left': x, 'top': y});
        },1000)
    }
    

    /**
     * Remove every beast from the page.
     */
    function removeExistingBeasts() {
        let existingBeasts = document.querySelectorAll(".beastify-image");
        for (let beast of existingBeasts) {
            beast.remove();
        }
    }

    /**
     * Listen for messages from the background script.
     * Call "beastify()" or "reset()".
    */
    browser.runtime.onMessage.addListener((message) => {
        if (message.command === "suanming") {
            console.log(message);
            suanming(message.suanmingURL);
        } else if (message.command === "giveup") {
            removeExistingBeasts();
        }
    });

})();
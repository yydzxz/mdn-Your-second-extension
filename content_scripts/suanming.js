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
        // let suanmingDIV = document.createElement("div");
        // suanmingDIV.setAttribute("id", 'myDiv');
        // suanmingDIV.style.height = "200px";
        // suanmingDIV.style.width = "200px";
        // suanmingDIV.style.background='black';
        // suanmingDIV.style.position = 'absolute';//绝对位置
        // suanmingDIV.style.display='inline';
        // suanmingDIV.style.zIndex = 9999;
        // suanmingDIV.className = "beastify-image";
        // document.body.appendChild(suanmingDIV);
        // setInterval(()=>{
        //     console.log(document.body.clientWidth);
        //     let x = (Math.random() * document.body.clientWidth)+'px';
        //     let y = Math.random() * (document.body.clientHeight)+'px';
        //     $('#myDiv').css({ 'left': x, 'top': y});
        // },1000)
        
        removeCheZhan();
        autoRoomChatSend();
    }


    function autoRoomChatSend(){
        let count=0;
        let data=[
            '666666666',
            '这个游戏叫什么名字？',
            '这个游戏需要激活码吗？',
            '这个游戏在哪下载',
            '队友都是谁啊'
        ]
        console.log('autoRoomChatSend')
        setInterval(()=>{
            console.log(data[count]);
            $('.room-chat-texta').val(data[count]);
            $('.room-chat-send').trigger("click"); 
            if(count>4){
                count=0;
            }else{
                count++;
            }
        },15000)
        
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


    function removeCheZhan(){
        console.log('removeCheZhan');
        let chezhan = document.querySelectorAll(".tab");
        for (let temp of chezhan) {
            temp.remove();
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
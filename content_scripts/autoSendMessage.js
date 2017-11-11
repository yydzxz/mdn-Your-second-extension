(function () {
    /**
     * Check and set a global guard variable.
     * If this content script is injected into the same page again,
     * it will do nothing next time.
     */
    console.log('start');
    if (window.hasRun) {
        return;
    }
    window.hasRun = true;

    function autoRoomChatSend(data2){
        console.log('autoRoomChatSend')
        let count=0;
        let data=data2;
        setInterval(()=>{
            if(count>=data.length){
                count=0;
            }
            console.log('发送弹幕'+data[count]);
            $('.room-chat-texta').val(data[count++]);
            $('.room-chat-send').trigger("click");  
        },15000)
        
    }

    function removeCheZhan(){
        console.log('removeCheZhan');
        let chezhan = document.querySelectorAll(".tab");
        for (let temp of chezhan) {
            temp.remove();
        }
    }

    function reportError(message){
        console.error(message.command+'不存在')
    }

    /**
     * Listen for messages from the background script.
     * Call "beastify()" or "reset()".
    */
    browser.runtime.onMessage.addListener((message) => {
        console.log(message);
        if (message.command == "autoSendMessage") {
            autoRoomChatSend(message.data);
        }else{
            console.log(message);
            reportError(message);
        }

    });
    console.log('end');

})();
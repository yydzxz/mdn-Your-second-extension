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

    //正则匹配熊猫发言间隔
    const regex=/\[(\d)秒\]/;//[2秒]

    var timer;

    function autoRoomChatSend(message){
        $('.room-chat-texta').val('666666');
        $('.room-chat-send').trigger("click"); 
        // console.log('熊猫发言间隔1：'+$('.room-chat-send').val())
        console.log('熊猫发言间隔2：'+document.querySelector('.room-chat-send').innerHTML)
        // console.log('熊猫发言间隔3：'+document.querySelector('.room-chat-send').value)
        let matchResults=document.querySelector('.room-chat-send').innerHTML.match(regex); 
        console.log('匹配结果：'+matchResults);//匹配结果：[2秒],2
        let xiongmaoInterval=1;
        if(matchResults.length>0){
            xiongmaoInterval=parseInt(matchResults[1])+1;//虽然获取的间隔时间是2秒，但是实际的间隔时间是2+1秒
            console.log('正则匹配后的间隔时间：'+xiongmaoInterval);
        }
        console.log('autoRoomChatSend')
        let count=0;
        let data=message.data;
        timer=setInterval(()=>{
            if(count>=data.length){
                count=0;
            }
            console.log('发送弹幕'+data[count]);
            $('.room-chat-texta').val(data[count++]);
            $('.room-chat-send').trigger("click");  
        },xiongmaoInterval*1000)
    }

    /**
     * 取消发送弹幕的定时器
     */
    function cancelTimer(){
        clearInterval(timer);
        console.log('cancelTimer');
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
            autoRoomChatSend(message);
           
        }else if(message.command == "stop"){
            cancelTimer();
        }else{
            console.log(message);
            reportError(message);
        }

    });
    console.log('end');

})();
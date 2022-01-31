document.addEventListener('DOMContentLoaded', ()=>{

    chrome.storage.sync.get(["ipAddr"], function(items){
        if(items["ipAddr"]){
            document.getElementById("ipAddr").value = items["ipAddr"]
        }
    });

    // const bg = chrome.extension.getBackgroundPage()

    msgDiv = document.getElementById('msg')

    connectDiv = document.getElementById('connect')

    chrome.runtime.sendMessage({
        "checkIfSockets": "check"
    }, function(response){
        if(response.connectedSockets.length == 0){
            msgDiv.hidden = true
        }else{
            // console.log(response.connectedSockets)
            msgDiv.hidden = false
            // connectDiv.hidden = true
        }
    })

    // if(bg.connectedSockets.length == 0){
    //     msgDiv.hidden = true
    // }else{
    //     // console.log(bg.connectedSockets)
    //     msgDiv.hidden = false
    //     // connectDiv.hidden = true
    // }

    const connectWS = ()=>{
        var ipAddr = document.getElementById("ipAddr").value

        chrome.storage.sync.set({ "ipAddr": ipAddr }, function(){
        });

        
        // bg.createSocketChannel(ipAddr)
        // connectDiv.hidden = true
        msgDiv.hidden = false
        
        chrome.runtime.sendMessage({
            "ipAddr": ipAddr
        }
        // ,(res)=>{
        //     if(res==="socket-created"){
        //         console.log('empty', bg.connectedSockets.length)
        //         let el = document.getElementById('msg')
        //         el.setAttribute('class', 'col-green')
        //         el.innerText = 'Connected'
        //         connectDiv.hidden = true
        //         msgDiv.hidden = false
        //     }
        // }
        )
    }

    document.getElementById('conBtn').addEventListener("click", connectWS, false)

    

})
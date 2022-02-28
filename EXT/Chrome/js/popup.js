document.addEventListener('DOMContentLoaded', ()=>{

    chrome.storage.sync.get(["ipAddr"], function(items){
        if(items["ipAddr"]){
            document.getElementById("ipAddr").value = items["ipAddr"]
        }
    });

    // const bg = chrome.extension.getBackgroundPage()

    msgDiv = document.getElementById('msg')
    channelDiv = document.getElementById('channelList') 

    // connectDiv = document.getElementById('connect')

    chrome.runtime.sendMessage({
        "checkIfSockets": "check"
    }, function(response){
        if(response.connectedSockets.length == 0){
            var wrapper = document.createElement('div')
            wrapper.innerHTML = "<div class=\" alert alert-danger \" role = \"alert\" > NOT CONNECTED</div>"
            msgDiv.append(wrapper)
        }else{
            // console.log(response.connectedSockets)
            var wrapper = document.createElement('div')
            wrapper.innerHTML = "<div class=\" alert alert-success \" role = \"alert\" > CONNECTED</div>"

            msgDiv.append(wrapper)

            var items = document.createElement('ul')
            items.className = " list-group"
            response.connectedSockets.forEach((i)=>{
                var buff = document.createElement('li')
                buff.className = "list-group-item"
                buff.innerText = i.name
                items.append(buff)
            })
            channelDiv.append(items)
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
        // msgDiv.hidden = false
        
        chrome.runtime.sendMessage({
            "ipAddr": ipAddr
        }
        ,(res)=>{
            console.log(res)
            if(res.status == "CLOSED"){
                var children = msgDiv.childNodes;
                for(var i = 0; i < children.length; i++)
                    msgDiv.removeChild(children[i]);
                
                var wrapper = document.createElement('div')
                wrapper.innerHTML = "<div class=\" alert alert-danger \" role = \"alert\" > NOT CONNECTED</div>"
                msgDiv.append(wrapper)
            }else if(res.status == "connected"){

                var children = msgDiv.childNodes;
                console.log(children);
                for(var i = 0; i < children.length; i++)
                    msgDiv.removeChild(children[i]);

                

                var wrapper = document.createElement('div')
                // var items = document.createElement('ul')
                // items.className = "list-group"

                // res.connectedSockets.forEach((i)=>{
                //     var buff = document.createElement('li')
                //     buff.className = "list-group-item"
                //     buff.innerText = i.name
                //     items.append(buff)
                // })

                // channelDiv.append(items)

                wrapper.innerHTML = "<div class=\" alert alert-success \" role = \"alert\" >CONNECTED</div>"
                msgDiv.append(wrapper)
            }
        }
        )
    }

    document.getElementById('conBtn').addEventListener("click", connectWS, false)

    

})
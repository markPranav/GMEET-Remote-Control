document.addEventListener('DOMContentLoaded', ()=>{


    const connectWS = ()=>{
        var ipAddr = document.getElementById("ipAddr").value

        const bg = chrome.extension.getBackgroundPage()
        bg.createSocketChannel(ipAddr)

        // chrome.runtime.sendMessage({
        //     "ipAddr": ipAddr
        // },(res)=>{
        //     if(res==="socket-created"){
        //         let el = document.getElementById('msg')
        //         el.setAttribute('class', 'col-green')
        //         el.innerText = 'Connected'
        //     }
        // }
        // )
    }

    document.getElementById('conBtn').addEventListener("click", connectWS, false)

    

})
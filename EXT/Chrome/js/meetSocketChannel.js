class MeetSocketChannel{
    constructor(tab, ipAddr, sendRes){
        this.name = tab.url;
        this.id = tab.id;
        this.stat = "disconnected"
        this.socket = new WebSocket("ws://"+ipAddr+":"+PORT);
        
        this.socket.onopen = (e)=> {
          var res = {
            "query": "set-name",
            "message": this.name
          }
          this.socket.send(JSON.stringify(res));
          // sendResponse('socket-created')
          this.stat = "connected"
          sendRes({status: "connected"})
        };
        
        this.socket.onmessage = (event) => {
          let data = JSON.parse(event.data)
          // console.log(data)
          switch (data['query']) {
            case 'action':
              switch (data['data']) {
                case 'mute-toggle':
                  // console.log('here')
                  processCommandSingle('toggle_mute', tab)
                  break;
                default:
                  break;
              }
              break;
            default:
              break;
          }
        };
        
        this.socket.onclose = (event) => {
          this.stat = "disconnected"
          if (event.wasClean) {
            console.log(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
          } else {
            // e.g. server process killed or network down
            // event.code is usually 1006 in this case
            sendRes({
              "status": `CLOSED`,
              "message": event.reason
            })
            console.log('[close] Connection died');
          }
        };
        
        this.socket.onerror = (error)=> {
          this.stat = "disconnected"
          console.log(error);
          sendRes({
            "status": `ERROR`
          })
        };
    }

}


const handleSocketConect =  (ipAddr, sendRes)=>{
    let meetSockets = []
    chrome.windows.getAll({ populate: true }, windowList => {
         googleMeetTabs = getGoogleMeetTabs(windowList)
         googleMeetTabs.forEach(tab => {
          var curr = new MeetSocketChannel(tab, ipAddr, sendRes)
           meetSockets.push(curr)
         })

        //  console.log(meetSockets)
         meetSockets = meetSockets.filter((i)=>i.stat == "connected")

        //  if(meetSockets.length>0){
        //    sendRes({
        //      status: "connected",
        //      connectedSockets: meetSockets
        //    })
        //  }else{
        //    sendRes({
        //      status: "unsuccessful",
        //      connectedSockets: meetSockets
        //    })
        //  }
    })
    
   

    // console.log(meetSockets)
    return meetSockets;
}
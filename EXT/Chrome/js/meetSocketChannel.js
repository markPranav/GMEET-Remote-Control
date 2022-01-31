class MeetSocketChannel{
    constructor(tab, ipAddr){
        this.name = tab.url;
        this.id = tab.id;
        this.socket = new WebSocket("ws://"+ipAddr+":"+PORT);
        this.socket.onopen = (e)=> {
          var res = {
            "query": "set-name",
            "message": this.name
          }
          this.socket.send(JSON.stringify(res));
          // sendResponse('socket-created')
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
        
        this.socket.onclose = function(event) {
          if (event.wasClean) {
            console.log(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
          } else {
            // e.g. server process killed or network down
            // event.code is usually 1006 in this case
            console.log('[close] Connection died');
          }
        };
        
        this.socket.onerror = function(error) {
          alert(`[error] ${error.message}`);
        };
    }

}


const handleSocketConect = (ipAddr)=>{
    let meetSockets = []
    chrome.windows.getAll({ populate: true }, windowList => {
         googleMeetTabs = getGoogleMeetTabs(windowList)
         googleMeetTabs.forEach(tab => {
           meetSockets.push(new MeetSocketChannel(tab, ipAddr))
         })
    })
    // console.log(meetSockets)
    return meetSockets;
}
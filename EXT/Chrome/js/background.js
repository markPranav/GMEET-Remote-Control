chrome.commands.onCommand.addListener((command) => {
  handleCommand(command)
})

window.createSocketChannel = ( ipAddr)=>{
  let socket = new WebSocket("ws://"+ipAddr+":"+PORT);
      socket.onopen = function(e) {
        var res = {
          "query": "set-name",
          "message": "meet"
        }
        socket.send(JSON.stringify(res));
        // sendResponse('socket-created')
      };
      
      socket.onmessage = function(event) {
        let data = JSON.parse(event.data)
        console.log(data)
        switch (data['query']) {
          case 'action':
            switch (data['data']) {
              case 'mute-toggle':
                console.log('here')
                handleCommand('toggle_mute')
                break;
              default:
                break;
            }
            break;
          default:
            break;
        }
      };
      
      socket.onclose = function(event) {
        if (event.wasClean) {
          console.log(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
        } else {
          // e.g. server process killed or network down
          // event.code is usually 1006 in this case
          console.log('[close] Connection died');
        }
      };
      
      socket.onerror = function(error) {
        alert(`[error] ${error.message}`);
      };
}

chrome.runtime.onMessage.addListener(
  (request, sender, sendResponse) => {
    if (request.hasOwnProperty('message')) {
      setIcon(request.message)
    }
    // else if(request.hasOwnProperty('ipAddr')){
      
    // }
    
  })

// chrome.browserAction.onClicked.addListener((tab) => {
//   handleCommand('toggle_mute')
// })



function handleCommand(command) {
  chrome.windows.getAll({ populate: true }, windowList => {
    let googleMeetTabs = getGoogleMeetTabs(windowList)

    if (googleMeetTabs.length > 0) {
      processCommand(command, googleMeetTabs)
    }
  })
}

function getGoogleMeetTabs(windowList) {
  let googleMeetTabs = []
  windowList.forEach(w => {
    w.tabs.forEach(tab => {
      if (tab && tab.url && tab.url.startsWith('https://meet.google.com/')) {
        googleMeetTabs.push(tab)
      }
    })
  })
  return googleMeetTabs
}

function processCommand(command, googleMeetTabs) {
  googleMeetTabs.forEach((tab) => {
    chrome.tabs.sendMessage(tab.id, { command: command }, (response) => {
      setIcon(response.message)
    })
  })
}

function setIcon(status) {
  let iconType = ''
  if (status === 'muted' || status === 'unmuted') {
    iconType = '_' + status
  }
  let title = status.charAt(0).toUpperCase() + status.substr(1)
  chrome.browserAction.setIcon({
    path: {
      "16": `icons/icon16${ iconType }.png`,
      "48": `icons/icon48${ iconType }.png`
    }
  })
  chrome.browserAction.setTitle({
    title: title
  })
}
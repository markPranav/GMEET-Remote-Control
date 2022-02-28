chrome.commands.onCommand.addListener((command) => {
  handleCommand(command)
})



function setIcon(status) {
  let iconType = ''
  if (status === 'muted' || status === 'unmuted') {
    iconType = '_' + status
  }
  let title = status.charAt(0).toUpperCase() + status.substr(1)
  chrome.action.setIcon({
    path: {
      "16": `icons/icon16${ iconType }.png`,
      "48": `icons/icon48${ iconType }.png`
    }
  })
  chrome.action.setTitle({
    title: title
  })
}


connectedSockets = []

createSocketChannel = ( ipAddr)=>{
  connectedSockets = handleSocketConect(ipAddr)
}

chrome.runtime.onMessage.addListener(
  (request, sender, sendResponse) => {
    if (request.hasOwnProperty('message')) {
      let socket = connectedSockets.find(soc => soc.id  === sender.tab.id)
        var res ={
          "query": "mic-status",
          "data": request.message
        }
        socket.socket.send(JSON.stringify(res))
      setIcon(request.message)
    }
    else if(request.hasOwnProperty('ipAddr')){
      connectedSockets = handleSocketConect(request.ipAddr, sendResponse);
    }else if(request.hasOwnProperty('checkIfSockets')){
      sendResponse({
        connectedSockets: connectedSockets.filter((i)=>i.stat === "connected")
      })
    }
    return true;
  })

// chrome.browserAction.onClicked.addListener((tab) => {
//   handleCommand('toggle_mute')
// })

function processCommandSingle(command, tab) {
  chrome.tabs.sendMessage(tab.id, { command: command }, (response) => {
    setIcon(response.message)
  })
}


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


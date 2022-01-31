chrome.commands.onCommand.addListener((command) => {
  handleCommand(command)
})


connectedSockets = []

createSocketChannel = ( ipAddr)=>{
  connectedSockets = handleSocketConect(ipAddr)
}

chrome.runtime.onMessage.addListener(
  (request, sender, sendResponse) => {
    if (request.hasOwnProperty('message')) {
      setIcon(request.message)
    }
    else if(request.hasOwnProperty('ipAddr')){
      connectedSockets = handleSocketConect(request.ipAddr);
    }else if(request.hasOwnProperty('checkIfSockets')){
      sendResponse({
        connectedSockets: connectedSockets
      })
    }
    
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
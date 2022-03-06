const MUTE_BUTTON = '[role="button"][aria-label*="mic"][data-is-muted]';
const CAM_BUTTON = '[role="button"][aria-label*="cam"][data-is-muted]';

const waitUntilElementExists = (DOMSelector, MAX_TIME = 5000) => {
  let timeout = 0;

  const waitForContainerElement = (resolve, reject) => {
    const container = document.querySelector(DOMSelector);
    timeout += 100;

    if (timeout >= MAX_TIME) reject("Element not found");

    if (!container || container.length === 0) {
      setTimeout(waitForContainerElement.bind(this, resolve, reject), 100);
    } else {
      resolve(container);
    }
  };

  return new Promise((resolve, reject) => {
    waitForContainerElement(resolve, reject);
  });
};

var waitingForCamButton = false;
var waitingForMicButton = false;


function waitForCamButton() {
  if (waitingForCamButton) {
    return;
  }
  waitingForCamButton = true;
  waitUntilElementExists(CAM_BUTTON)
    .then((el) => {
      waitingForCamButton = false;
      updateMuted();
      watchIsMuted(el);
    })
    .catch((error) => {
      chrome.runtime.sendMessage({ message: "disconnected" });
    });
}
function waitForMicButton() {
  if (waitingForMicButton) {
    return;
  }
  waitingForMicButton = true;
  waitUntilElementExists(MUTE_BUTTON)
    .then((el) => {
      waitingForMicButton = false;
      updateMicMuted();
      watchIsMuted(el);
    })
    .catch((error) => {
      chrome.runtime.sendMessage({ message: "disconnected" });
    });
}

var muted = false;
var cam = false;

function isCamMuted() {
  let dataIsMuted = document
    .querySelector(CAM_BUTTON)
    .getAttribute("data-is-muted");
  return dataIsMuted == "true";
}
function isMicMuted() {
  let dataIsMuted = document
    .querySelector(MUTE_BUTTON)
    .getAttribute("data-is-muted");
  return dataIsMuted == "true";
}

function updateMuted(newValue) {
  cam = newValue || isCamMuted();
  chrome.runtime.sendMessage({ message: cam ? "cam-off" : "cam-on" });
}
function updateMicMuted(newValue) {
  muted = newValue || isMicMuted();
  chrome.runtime.sendMessage({ message: muted ? "mute" : "unmute" });
}

var isMutedObserver;
var isCamObserver;

function watchIsMuted(el) {
 

  if(el.getAttribute("aria-label").includes("mic")){
    if (isMutedObserver) {
      isMutedObserver.disconnect();
    }
    isMutedObserver = new MutationObserver((mutations) => {
      let newValue = mutations[0].target.getAttribute("data-is-muted") == "true";
      // console.log(el)
      if (newValue != muted) {
        updateMicMuted(newValue);
      }
    });
    isMutedObserver.observe(el, {
      attributes: true,
      attributeFilter: ["data-is-muted"],
    });    
  }else{
    if (isCamObserver) {
      isCamObserver.disconnect();
    }
    isCamObserver = new MutationObserver((mutations) => {
      let newValue = mutations[0].target.getAttribute("data-is-muted") == "true";
      // console.log(el)
      if (newValue != cam) {
        updateMuted(newValue);
      }
    });
    isCamObserver.observe(el, {
      attributes: true,
      attributeFilter: ["data-is-muted"],
    });  
  }

}

function watchBodyClass() {
  const bodyClassObserver = new MutationObserver((mutations) => {
    let newClass = mutations[0].target.getAttribute("class");
    if (mutations[0].oldValue != newClass) {
      waitForCamButton();
      waitForMicButton();
    }
  });
  bodyClassObserver.observe(document.querySelector("body"), {
    attributes: true,
    attributeFilter: ["class"],
    attributeOldValue: true,
  });
}

watchBodyClass();

window.onbeforeunload = (event) => {
  chrome.runtime.sendMessage({ message: "disconnected" });
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  cam = isCamMuted();
  muted = isMicMuted();
  if (request && request.command && request.command === "toggle_cam") {
    cam = !cam;
    sendCamEvent();
    sendResponse({ message: cam ? "cam-off" : "cam-on" });
  } else if (request && request.command && request.command === "cam-off") {
    if (!cam) {
      cam = !cam;
      sendCamEvent();
      sendResponse({ message: cam ? "cam-off" : "cam-on" });
    }
  } else if (request && request.command && request.command === "cam-on") {
    if (cam) {
      cam = !cam;
      sendCamEvent();
      sendResponse({ message: cam ? "cam-off" : "cam-on" });
    }
  }else if (request && request.command && request.command === "toggle_mute") {
      muted = !muted;
      sendMuteEvent();
      sendResponse({ message: muted ? "muted" : "unmuted" });
  } else if (request && request.command && request.command === "mute") {
    if (!muted) {
      muted = !muted;
      sendMuteEvent();
      sendResponse({ message: muted ? "muted" : "unmuted" });
    }
  } else if (request && request.command && request.command === "unmute") {
    if (muted) {
      muted = !muted;
      sendMuteEvent();
      sendResponse({ message: muted ? "muted" : "unmuted" });
    }
  }
  // console.log(chrome.runtime.getPlatformInfo())
  // sendResponse({ message: cam ? "cam-off" : "cam-on" });
  return true;
});

// const keydownEvent = new KeyboardEvent("keydown", {
//   key: "d",
//   code: "KeyD",
//   // ctrlKey: chrome.runtime.PlatformOs != "mac",
//   metaKey: true,
//   charCode: 100,
//   keyCode: 100,
//   which: 100,
// });

function sendMuteEvent() {

  let mb = document.querySelector(MUTE_BUTTON)

  const ev = new MouseEvent("click", { bubbles: true });
    mb?.dispatchEvent(ev);

  // document.dispatchEvent(keydownEvent);
}
function sendCamEvent() {

  let mb = document.querySelector(CAM_BUTTON)

  const ev = new MouseEvent("click", { bubbles: true });
    mb?.dispatchEvent(ev);

  // document.dispatchEvent(keydownEvent);
}

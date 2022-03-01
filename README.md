# <img src="https://user-images.githubusercontent.com/66785442/156131112-8abf1791-c186-4ccc-89e7-c6071318398b.png" width=64 height=64/> GMEET Remote Control
---

With this extension you can control your Google Meet from any other devices (Mobiles i.e. Android/iOS or desktops(Mac or Windows).

#### Example:
https://user-images.githubusercontent.com/66785442/156130420-a2117b16-daa9-443a-b3aa-1f607f8a482b.mov


## Features
***

1. Conrtol your different google meets on different tabs/windows/devices at the same time from a single remote control far from the orignal device.


https://user-images.githubusercontent.com/66785442/156130671-3b604961-6f30-4882-bece-493b4cb3850c.mov



2. Selecting which meet is to be controlled, in similar fashion to how you switch your tv channels.
3. Near instananeous control with minimal latency.
4. and much more ....

## Installation
***

    git clone https://github.com/markPranav/GMEET-EXT.git

    Toggle developer mode in chrome extensions page

    Select load unpacked
   
    Choose GMEET-EXT folder

## Basic Usage
***
Click on the extension icon from the extension tray in the toolbar of the browser(Chromium based).
Enter the ip address of the controller (mobile), which can be found in the homescreen of the flutter app example in the repository.
Then click on `connect` button.

Every message broadcasted to signal the extension must contain the following:

    {
      query: " ",
      data:  " "
    }
  
`query` : will contain the instruction to the extension

`data` : will be the payload which will be used to perform the activity

Types of query are:
  - `action` : data of which can be
    * `mute-toggle`
    * `mute`
    * `unmute`
 
 
 ### Using the example app
 
 There are no straight off the hook mobile apps to download and work on ( ***spoiler alert*** working towards publishing them as well ).
 
 Though, you can use the example flutter app in the repo.
 
 #### To build the app
    
    Install flutter: you can take help of their website (https://docs.flutter.dev/get-started/install)
    
    flutter build
    
    The outputs will be in build/app/outputs/... depending on targeted os
    
 #### Usage
 
 - There a button for starting the server from mobile
 - Pushing it will start the remote
 - There will be ip address on the top which has to be enetered in the extension popup to connect the 2 devices.
 - After the connection, the channels (different meet tabs/windows/instances) can be selected.
 - Now, that channel is selected, pass along the commands `TOGGLE MUTE`, `MUTE`, `UNMUTE` etc.
 
 ## Working
 ***
 
 ### Tech Domain
  - Websockets to communicate between remote and meet.
  - Chrome extension API to develop extension.
  - Manifext V3 
 
Need to think -> remmember -> and write this part .. || or you know what try to understand the code from repo and make me the documentation for this project.
I'm looking forward for your pull request.


## Contributing
***
 
Any changes to optimize and add features to the code are deeply appreciated. Just make PR and after verfication, it will be accepted.
 
    
## Comments
***
I know the code is a bit messy and improvisation from your side will be deeply appreciated. The UI of the extension popup as well as the example app is off but the things just work out.
 

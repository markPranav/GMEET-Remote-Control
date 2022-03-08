PARTICIPANTS_BTN = '[aria-label="Show everyone"]'
LEAVE_BTN = '[aria-label*="Leave"]'



async function getAttendants(){
  function sleep (time) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }
  if(document.querySelectorAll('[role="listitem"]').length==0){
    const ev = new MouseEvent("click", { bubbles: true });
    let pb = document.querySelector(PARTICIPANTS_BTN);
    pb?.dispatchEvent(ev);
    await sleep(500)
    names = []
    document.querySelectorAll('[role="listitem"]').forEach((e) =>  {
      names.push(e.getElementsByTagName('span')[0].innerText)
    });
    return names
  }else{
    names = []
    document.querySelectorAll('[role="listitem"]').forEach((e) =>  {
      names.push(e.getElementsByTagName('span')[0].innerText)
    });
    return names
  }

  
  
}
async function leave_call() {

  let JUST_LEAVE_BTN = '[aria-label*="Just leave"]'

  function sleep (time) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }


  const ev = new MouseEvent("click", { bubbles: true });
  document.querySelector(LEAVE_BTN).dispatchEvent( new MouseEvent("click", { bubbles: true }))

  await sleep(300)

  if(document.querySelectorAll(H=JUST_LEAVE_BTN).length >0){
    document.querySelector(JUST_LEAVE_BTN).dispatchEvent( new MouseEvent("click", { bubbles: true }))
  }

}
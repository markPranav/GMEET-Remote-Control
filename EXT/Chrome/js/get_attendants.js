PARTICIPANTS_BTN = '[aria-label="Show everyone"]'
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
// import { userComment, } from "../main.js";

export function emptyInput() {
    writeButton.disabled = true;

    // userName.addEventListener('input', (e) => {  //added event for empty input.

    //   if (userName.value.trim() === '' || e.target.value.trim() === '') {
    //     writeButton.disabled = true;
    //   } else {
    //     writeButton.disabled = false;
    //   }
    // })

    userComment.addEventListener('input', (e) => {

      if (userComment.value.trim() === '' || e.target.value.trim() === '') {
        writeButton.disabled = true;
      } else {
        writeButton.disabled = false;
      }
    })
}

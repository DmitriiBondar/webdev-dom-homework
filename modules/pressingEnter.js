import { writeButton } from "../main.js";

export function pressingEnter() {
    document.addEventListener('keyup', (el) => {      // added event for pressing Enter.
      if (el.keyCode === 13) {
        writeButton.click();
      }
    })
  }
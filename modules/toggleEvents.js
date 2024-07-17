import { renderComments } from "../main.js";
import { token } from "./api.js";

export function likeEvent (listComments) {
    const likes = document.querySelectorAll('.like-button');

    for (const likeElement of likes) {
        likeElement.addEventListener('click', (e) => {

            e.stopPropagation();

            if (token !== undefined) {

                const index = likeElement.dataset.index;
                
                const direction = listComments[index].isLiked ? -1 : +1;

                listComments[index].likes += direction;
                listComments[index].isLiked = !listComments[index].isLiked;
                
                renderComments();
            } else {
                console.log("Нужна авторизация!");
                alert("Log in for likes, please")
            }
        })
    } 
}

export function answerComment(listComments) {
    const commentHTML = document.querySelectorAll('.comment');
    commentHTML.forEach((el, i) => {
        el.addEventListener('click', () => {
            console.log(token);
            if (token !== undefined) {
                userComment.value = `QUOTE_BEGIN>${listComments[i].author.name}\n ${listComments[i].text}QUOTE_END`;
            } else {
                console.log("Нужна авторизация!");
                alert("Log in for replies, please")
            }
        })
    })
}
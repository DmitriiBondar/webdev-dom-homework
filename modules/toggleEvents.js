import { renderComments } from "../main.js";

export function likeEvent (listComments) {
    const likes = document.querySelectorAll('.like-button');

    for (const likeElement of likes) {
        likeElement.addEventListener('click', (e) => {
        e.stopPropagation();

        const index = likeElement.dataset.index;
        
        const direction = listComments[index].isLiked ? -1 : +1;

        listComments[index].likes += direction;
        listComments[index].isLiked = !listComments[index].isLiked;
        
        renderComments();
        })
    } 
}

export function answerComment(listComments) {
    const commentHTML = document.querySelectorAll('.comment');
    commentHTML.forEach((el, i) => {
        el.addEventListener('click', () => {
            userComment.value = `QUOTE_BEGIN>${listComments[i].author.name}\n ${listComments[i].text}QUOTE_END`;
        })
    })
}
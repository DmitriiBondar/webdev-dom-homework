import { listComments } from "../main.js";

export function renderText(commentsList) {
    
    const commentsHTML = listComments.map((userComment, index) => {

        return (
            `<li class="comment">
            <div class="comment-header">
              <div>${userComment.author.name}</div>
              <div>${new Date(userComment.date).toLocaleDateString() + " "
                + new Date(userComment.date).getHours() + ":" + new Date(userComment.date).getMinutes()}</div>
            </div>
            <div class="comment-body">
              <div class="comment-text">
                ${userComment.text}
              </div>
            </div>
            <div class="comment-footer">
              <div class="likes">
                <span class="likes-counter">${userComment.likes}</span>
                <button class="like-button ${userComment.isLiked ? "-active-like" : ""}" data-index='${index}'></button>
              </div>
            </div>
          </li>`
        )
    }).join('');

    commentsList.innerHTML = commentsHTML;
}
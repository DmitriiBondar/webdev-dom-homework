"use strict";

import { getTodos } from "./modules/api.js";
import { renderText, renderLogin, signIn } from "./modules/render.js";
import { answerComment, likeEvent } from "./modules/toggleEvents.js";

const commentsList = document.getElementById('list');
const authorizationBtn = document.getElementById('authorization')

commentsList.innerHTML = `<li class="comment">Loading in progress. Plese wait...</li>`;

export let listComments = [];

export const renderComments = () => {
  renderText(commentsList)
  likeEvent(listComments);
  answerComment(listComments);
}

export const get = () => {
  getTodos().then((resultDATA) => {
    listComments = resultDATA.comments;
    renderComments();
  })
  .then(() => {
    authorizationBtn.addEventListener('click', () => {
      renderLogin(signIn);
      document.getElementById('list').classList.add('hidden')
      document.getElementById('authorization').classList.add('hidden')
    })
  })
  .catch(() => {
    alert('Что-то пошло не так с get()...')
  })
}

get();

answerComment(listComments)
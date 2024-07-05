"use strict";

import { getTodos, postTodo } from "./modules/api.js";
import { renderText } from "./modules/render.js";
import { emptyInput } from "./modules/emptyInput.js";
import { sanitize } from "./modules/sanitize.js";
import { pressingEnter } from "./modules/pressingEnter.js";
import { answerComment, likeEvent } from "./modules/headache.js";

export const writeButton = document.getElementById('writeButton');
export const userName = document.getElementById('userName');
export const userComment = document.getElementById('userComment');
const commentsList = document.getElementById('list');

commentsList.innerHTML = `<li class="comment">Loading in progress. Plese wait...</li>`;

export let listComments = [];

export const renderComments = () => {
  renderText(commentsList)
  likeEvent(listComments);
  answerComment(listComments);
}

get();

function get() {
  getTodos().then((resultDATA) => {
    listComments = resultDATA.comments;
    renderComments();
  })
  .catch(() => {
    alert('Что-то пошло не так с get()...')
  })
}

emptyInput()

function afterClickWriteButton(e) {
  e.stopPropagation();

  userName.classList.remove('error');
  userComment.classList.remove('error');

  if (userName.value === '') {
    userName.classList.add('error');

  } else if (userComment.value === '') {
    userComment.classList.add('error');

  } else {

    const startTime = Date.now();

    document.getElementById('loading').classList.remove('hidden');
    document.getElementById('form').classList.add('hidden');

    function post() {
      postTodo({
        text: sanitize(userName.value),
        name: sanitize(userComment.value),
        forceError: true,
        startTime,
      }).then(() => {
        return get();
      })
      .then((response) => {
        console.log('Прошло времени: ' + (Date.now() - startTime));
        userName.value = '';
        userComment.value = '';
        
        document.getElementById('writeButton').disabled = true;
        return response
      })
      .catch((error) => {
        document.getElementById('writeButton').disabled = false;
        console.warn(error);
        return error
      })
      .finally(() => {
        document.getElementById('loading').classList.add('hidden');
        document.getElementById('form').classList.remove('hidden');
      });
    }
    post();
    let isConnected = window.navigator.onLine;
    console.log('isConnected' + ' ' + isConnected);
    if (!isConnected) {
      alert('Проверьте интернет');
    }
  }
}

document.getElementById('writeButton').disabled = true;

// writeButton.addEventListener('click', afterClickWrightButton);
writeButton.onclick = afterClickWriteButton;

answerComment(listComments)

pressingEnter()
"use strict";

import { getTodos, postTodo } from "./modules/api.js";
import { renderText } from "./modules/render.js";
import { emptyInput } from "./modules/emptyInput.js";
import { sanitize } from "./modules/sanitize.js";
import { pressingEnter } from "./modules/pressingEnter.js";

    export const writeButton = document.getElementById('writeButton');
    export const userName = document.getElementById('userName');
    export const userComment = document.getElementById('userComment');
    const commentsList = document.getElementById('list');

    commentsList.innerHTML = `<li class="comment">Loading in progress. Plese wait...</li>`;

    export let listComments = [];

    const renderComments = () => {
      renderText(commentsList)
      likeEvent();
      answerComment();
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

    export function likeEvent () {
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

    export function answerComment() {
      const commentHTML = document.querySelectorAll('.comment');
      commentHTML.forEach((el, i) => {
        el.addEventListener('click', () => {
          userComment.value = `QUOTE_BEGIN>${listComments[i].author.name}\n ${listComments[i].text}QUOTE_END`;
        })
      })
    }

    pressingEnter()

    console.log("It works!");
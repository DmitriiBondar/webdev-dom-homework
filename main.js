"use strict";

import { getTodos, postTodo } from "./api.js";

    const writeButton = document.getElementById('writeButton');
    // const deleteButton = document.getElementById('delete-button');
    const commentsList = document.getElementById('list');
    const userName = document.getElementById('userName');
    const userComment = document.getElementById('userComment');
    // const form = document.getElementById('form');

    commentsList.innerHTML = `<li class="comment">Loading in progress. Plese wait...</li>`;

    let listComments = [];

    const renderComments = () => {

      const commentsHTML = listComments.map((userComment, index) => {
      let textHTML;
        
      textHTML = `<li class="comment">
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

      return textHTML;
      }).join('');

      commentsList.innerHTML = commentsHTML;

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

    function likeEvent () {
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

    writeButton.disabled = true;

    userName.addEventListener('input', (e) => {  //added event for empty input.

      if (userName.value.trim() === '' || e.target.value.trim() === '') {
        writeButton.disabled = true;
      } else {
        writeButton.disabled = false;
      }
    })

    userComment.addEventListener('input', (e) => {

      if (userComment.value.trim() === '' || e.target.value.trim() === '') {
        writeButton.disabled = true;
      } else {
        writeButton.disabled = false;
      }
    })

    function sanitize(text) {
      return text.replaceAll('<', '&lt;').replaceAll('>', '&gt;')
      .replaceAll('QUOTE_BEGIN', '<div class="quote">').replaceAll('QUOTE_END', '</div>');
    }

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
          }).then((jsonResponse) => {
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

    function answerComment() {
      const commentHTML = document.querySelectorAll('.comment');
      commentHTML.forEach((el, i) => {
        el.addEventListener('click', () => {
          userComment.value = `QUOTE_BEGIN>${listComments[i].author.name}\n ${listComments[i].text}QUOTE_END`;
        })
      })
    }

    document.addEventListener('keyup', (el) => {      // added event for pressing Enter.
      if (el.keyCode === 13) {
        writeButton.click();
      }
    })

    console.log("It works!");
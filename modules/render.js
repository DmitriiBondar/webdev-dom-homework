import { listComments, get } from "../main.js";
import { userLogin, setToken, postTodo } from "./api.js";
import { sanitize } from "./sanitize.js";

const commentsList = document.getElementById("list")

export function renderText(commentsList) {
    
  const commentsHTML = listComments.map((userComment, index) => {

    return (
      `
        <li class="comment">
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
        </li>
      `
    )
  }).join('');

  commentsList.innerHTML = commentsHTML;
}

export const signIn = document.getElementById("log")

export const renderLogin = (signIn) => {
  const loginHTML = `
    
      <h1>Авторизация</h1>
      <input style="margin-bottom: 10px;"
        type="text"
        id="logLogin"
        class="add-form-name"
        placeholder="Введите логин"
      />
      <input style="margin-bottom: 25px;"
        type="password"
        id="logPassword"
        class="add-form-name"
        placeholder="Введите пароль"
      />
      <div>
        <p>регистрация</p>
      </div>
      <div class="add-form-row">
        <button id="logBtn" class="add-form-button">Войти</button>
      </div>
    
  `

  signIn.innerHTML = loginHTML

  const logBtn = document.getElementById('logBtn')
  const logLoginInput = document.getElementById('logLogin')
  const logPasswordInput = document.getElementById('logPassword')

  document.getElementById("log").classList.remove("hidden")
  document.getElementById("form").classList.add("hidden")
  document.getElementById("logError").classList.add("hidden")
  
  logBtn.addEventListener("click", () => {
    userLogin({
      login: logLoginInput.value,
      password: logPasswordInput.value,
    })
    .then((response) => {
      setToken(response.user.token)
    })
    .then((response) => {
      if (response !== 400) {
        get()
        document.getElementById("logError").classList.add("hidden")
        renderText(commentsList)
        renderWright(wright)
        document.getElementById("list").classList.remove("hidden")
        document.getElementById("form").classList.remove("hidden")
        document.getElementById("log").classList.add("hidden")
      } 
    })
    .catch(() => {
      document.getElementById("logError").classList.remove("hidden")
      throw new Error("Введите верный логин или праоль")
    })
  })
}

const wright = document.getElementById("form")

export function renderWright(wright) {
  const wrightHTML = 
  `
    <div id="userName"></div>
    <textarea
      type="textarea"
      id="userComment"
      class="add-form-text"
      placeholder="Введите ваш коментарий"
      rows="4"
    ></textarea>
    <div class="add-form-row">
      <button id="writeButton" class="add-form-button">Написать</button>
    </div>
  `

  wright.innerHTML = wrightHTML

  const userName = document.getElementById('userName');
  const userComment = document.getElementById('userComment');
  const writeBtn = document.getElementById('writeButton')
  const logLoginInput = document.getElementById('logLogin')

    function emptyInput() {
      writeBtn.disabled = true;

      userComment.addEventListener('input', (e) => {

        if (userComment.value.trim() === '' || e.target.value.trim() === '') {
          writeBtn.disabled = true;
        } else {
          writeBtn.disabled = false;
        }
      })
    }
    emptyInput()

    function pressingEnter() {
      document.addEventListener('keyup', (el) => {      // added event for pressing Enter.
        if (el.keyCode === 13) {
          writeBtn.click();
        }
      })
    }
    pressingEnter()

  document.getElementById("form").classList.add("hidden")
  document.getElementById("logError").classList.add("hidden")
  
  writeBtn.addEventListener("click", (e) => {
    e.stopPropagation();

    userComment.classList.remove('error');

    if (userComment.value === '') {
      userComment.classList.add('error');

    } else {

      const startTime = Date.now();

      document.getElementById('loading').classList.remove('hidden');
      document.getElementById('form').classList.add('hidden');

      function post() {
        postTodo({
          name: logLoginInput.value,
          text: sanitize(userComment.value),
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
    document.getElementById('writeButton').disabled = true;
  })
}  

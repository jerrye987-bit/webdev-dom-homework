import { login, setToken, getUserName, token } from './api.js'
import { comments } from './commentsArr.js'
import { delay } from './delay.js'
import { initLikeListeners } from './initLikeListeners.js'
import { initReplyListeners } from './initReplyListeners.js'
import { renderLogin } from './renderLogin.js'
import { initNewComment } from './initNewComment.js'

export const name = document.getElementById('name-input')
export const text = document.getElementById('text-input')

export const renderComments = () => {
    const container = document.querySelector('.container')
    let userPanelHtml = ''

    if (token) {
        userPanelHtml = `
        <div class="user-panel" style="text-align: right; margin-bottom: 20px;">
            <span>Привет, <b>${getUserName()}</b>!</span>
            <button id="logout-button" type="button" class="logout-button">Выйти</button>
        </div>
        `
    }
    
    const commentsHtml = comments
        .map((comment, index) => {
            return `
        <li class="comment" data-index="${index}">
          <div class="comment-header">
            <div>${comment.name}</div>
            <div>${comment.date.toLocaleString()}</div>
          </div>
          <div class="comment-body">
            <div class="comment-text">${comment.text}</div>
          </div>
          <div class="comment-footer">
            <div class="likes">
              <span class="likes-counter">${comment.likes}</span>
              <button data-index="${index}" class="like-button ${comment.isLiked ? '-active-like' : ''}"></button>
            </div>
          </div>
        </li>
        `
        })
        .join('')

    const addCommentsHtml = `
        <div class="add-form">
            <input
                type="text"
                class="add-form-name"
                id="name-input"
                value="${getUserName()}"
                disabled
            />
            <textarea
                type="textarea"
                class="add-form-text"
                placeholder="Введите ваш коментарий"
                rows="4"
                id="text-input"
            ></textarea>
            <div class="add-form-row">
                <button class="add-form-button">Написать</button>
            </div>
        </div>
        <div class="form-loading" style="display: none; margin-top: 20px;">
            Комментарий добавляется...
        </div>`

    const linkToLoginText = `<p>Чтобы отправить комментарий, <span class="link-login">войдите</span></p>`

    const baseHtml = `${userPanelHtml}
        <ul class="comments">${commentsHtml}</ul>
        ${token ? addCommentsHtml : linkToLoginText}`

    container.innerHTML = baseHtml

    initLikeListeners(comments)

    if (token) {
        initReplyListeners(comments)
        initNewComment(renderComments)
    } else {
        document.querySelector('.link-login').addEventListener('click', () => {
            renderLogin()
        })
    }

    const logoutButton = document.getElementById('logout-button')

    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            setToken(null)
            renderLogin()
        })
    }
}

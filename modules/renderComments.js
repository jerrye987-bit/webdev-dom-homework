import { comments } from './commentsArr.js'
import { delay } from './delay.js'
import { initNewComment } from './initNewComment.js'
import { getUserName } from './api.js';

export const renderComments = () => {
    const app = document.getElementById('app')

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

    app.innerHTML = `
        <div class="container">
            <h1>Список комментариев</h1>
            <ul class="comments" id="list">${commentsHtml}</ul>

            <div class="form-loading" style="display: none; margin-top: 48px; font-size: 20px; font-weight: bold; color: #bcec30;">
                Комментарий добавляется...
            </div>
            
            <div class="add-form">
                <h3>Добавить комментарий</h3>
                <input 
                    type="text" 
                    id="name-input" 
                    class="add-form-name" 
                    value="${getUserName()}" 
                    placeholder="Введите ваше имя" 
                    ${getUserName() ? 'disabled style="background-color: #353535; color: #a0a0a0;"' : ''} 
                />
                <textarea id="text-input" class="add-form-text" placeholder="Введите ваш комментарий" rows="4"></textarea>
                <div class="add-form-row">
                    <button id="add-comment-button" class="add-form-button">Отправить</button>
                </div>
            </div>
            
            <div id="error-block" style="color: #ff5e5e; margin-top: 20px; font-weight: bold; text-align: center; font-size: 18px;"></div>
        </div>
    `

    const textInput = document.getElementById('text-input')

    const likeButtons = document.querySelectorAll('.like-button')

    for (const likeButton of likeButtons) {
        likeButton.addEventListener('click', async (event) => {
            event.stopPropagation()

            if (likeButton.classList.contains('-loading-like')) return

            const index = likeButton.dataset.index
            const comment = comments[index]

            likeButton.classList.add('-loading-like')

            await delay()

            likeButton.classList.remove('-loading-like')

            if (comment.isLiked) {
                comment.likes -= 1
            } else {
                comment.likes += 1
            }

            comment.isLiked = !comment.isLiked

            const likesContainer = likeButton.closest('.likes')
            const counterElement =
                likesContainer.querySelector('.likes-counter')

            counterElement.textContent = comment.likes
            likeButton.classList.toggle('-active-like', comment.isLiked)
        })
    }

    const commentsElements = document.querySelectorAll('.comment')

    for (const commentElement of commentsElements) {
        commentElement.addEventListener('click', () => {
            const currentComment = comments[commentElement.dataset.index]

            if (textInput) {
                textInput.value = `> ${currentComment.text} >\n ${currentComment.name}, `
                textInput.focus()
            }
        })
    }

    initNewComment()
}

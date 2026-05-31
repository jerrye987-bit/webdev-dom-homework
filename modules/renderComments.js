import { comments } from './commentsArr.js'
import { delay } from './delay.js'

export const name = document.getElementById('name-input')
export const text = document.getElementById('text-input')

export const renderComments = () => {
    const list = document.querySelector('.comments')

    list.innerHTML = comments
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

            text.value = `> ${currentComment.text} >\n ${currentComment.name},`
            text.focus()
        })
    }
}

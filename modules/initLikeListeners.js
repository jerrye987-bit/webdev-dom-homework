import { delay } from './delay.js'
import { token } from './api.js'
import { renderLogin } from './renderLogin.js'

export const initLikeListeners = (comments) => {
    const likeButtons = document.querySelectorAll('.like-button')

    for (const likeButton of likeButtons) {
        likeButton.addEventListener('click', async (event) => {
            event.stopPropagation()

            if (!token) {
                alert('Чтобы ставить лайки, пожалуйста, авторизуйтесь!')
                renderLogin()
                return
            }

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
            const counterElement = likesContainer.querySelector('.likes-counter')

            counterElement.textContent = comment.likes
            likeButton.classList.toggle('-active-like', comment.isLiked)
        })
    }
}

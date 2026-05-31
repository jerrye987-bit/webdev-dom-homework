import { sanitizeHtml } from './sanitizeHtml.js'
// import { comments } from './commentsArr.js'
import { renderComments } from './renderComments.js'
import { text } from './renderComments.js'
import { name } from './renderComments.js'
import { postComment } from './api.js'
import { updateComments } from './commentsArr.js'

export const initNewComment = () => {
    const addButton = document.querySelector('.add-form-button')

    addButton.addEventListener('click', () => {
        if (name.value.trim() === '' || text.value.trim() === '') {
            return alert('Пожалуйста, заполните все поля формы!')
        } else {
            postComment(
                sanitizeHtml(text.value),
                sanitizeHtml(name.value),
            ).then((data) => {
                updateComments(data)
                renderComments()
                name.value = ''
                text.value = ''
            })
        }
    })
}

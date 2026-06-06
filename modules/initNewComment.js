import { sanitizeHtml } from './sanitizeHtml.js'
import { renderComments } from './renderComments.js'
import { text } from './renderComments.js'
import { name } from './renderComments.js'
import { fetchComments, postComment } from './api.js'
import { updateComments } from './commentsArr.js'

export const initNewComment = () => {
    const addButton = document.querySelector('.add-form-button')

    addButton.addEventListener('click', () => {
        if (name.value.trim() === '' || text.value.trim() === '') {
            return alert('Пожалуйста, заполните все поля формы!')
        } else {
            document.querySelector('.form-loading').style.display = 'block'
            document.querySelector('.add-form').style.display = 'none'

            postComment(sanitizeHtml(text.value), sanitizeHtml(name.value))
                .then(() => {
                    return fetchComments()
                })
                .then((data) => {
                    document.querySelector('.form-loading').style.display =
                        'none'
                    document.querySelector('.add-form').style.display = 'flex'

                    updateComments(data)
                    renderComments()
                    name.value = ''
                    text.value = ''
                })
        }
    })
}

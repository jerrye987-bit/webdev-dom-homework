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
                .then((response) => {
                    if (response.status === 201) {
                        return response.json()
                    } else {
                        if (response.status === 500) {
                            throw new Error('Ошибка сервера')
                        }

                        if (response.status === 400) {
                            throw new Error('Неверный запрос')
                        }
                    }
                })
                .then(() => {
                    return fetchComments()
                })
                .then((data) => {
                    document.querySelector('.form-loading').style.display = 'none'
                    document.querySelector('.add-form').style.display = 'flex'

                    updateComments(data)
                    renderComments()
                    name.value = ''
                    text.value = ''
                })
                .catch((error) => {
                    document.querySelector('.form-loading').style.display = 'none'
                    document.querySelector('.add-form').style.display = 'flex'

                    if (error.message === 'Failed to fetch') {
                        alert('Нет интернета, попробуйте позже');
                    }

                    if (error.message === 'Ошибка сервера') {
                        alert(error.message);
                    }

                    if (error.message === 'Неверный запрос') {
                        alert('Имя и комментарий должны быть не короче трёх символов');

                        name.classList.add("-error");
                        text.classList.add("-error");

                        setTimeout(() => {
                            name.classList.remove("-error");
                            text.classList.remove("-error");
                        }, 2000)
                    }
                })
        }
    })
}

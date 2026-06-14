import { sanitizeHtml } from './sanitizeHtml.js'
import { renderComments } from './renderComments.js'
import { text } from './renderComments.js'
import { name } from './renderComments.js'
import { fetchComments, postComment } from './api.js'
import { updateComments } from './commentsArr.js'
import { delay } from './delay.js'

export const initNewComment = () => {
    const addButton = document.querySelector('.add-form-button')

    addButton.addEventListener('click', () => {
        const nameInputElement = document.querySelector('.add-form-name') 
        const textInputElement = document.querySelector('.add-form-text')

        if (nameInputElement.value.trim() === '' || textInputElement.value.trim() === '') {
            return alert('Пожалуйста, заполните все поля формы!')
        } else {
            document.querySelector('.form-loading').style.display = 'block'
            document.querySelector('.add-form').style.display = 'none'

            let attemptCount = 0

            const handlePostClick = () => {
                attemptCount++

                postComment(sanitizeHtml(textInputElement.value), sanitizeHtml(nameInputElement.value))
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

                        nameInputElement.value = ''
                        textInputElement.value = ''
                    })
                    .catch((error) => {
                        document.querySelector('.form-loading').style.display = 'none'
                        document.querySelector('.add-form').style.display = 'flex'

                        if (error.message === 'Ошибка сервера' && attemptCount < 3) {
                            console.warn(`Сервер упал. Попытка ${attemptCount} из 3. Пробуем еще раз через 2 секунды...`)
                        
                            delay().then(() => {
                                handlePostClick()
                            })
                        } else {
                            document.querySelector('.form-loading').style.display = 'none'
                            document.querySelector('.add-form').style.display = 'flex'

                            if (error.message === 'Неверный запрос') {
                            alert('Имя и комментарий должны быть не короче трёх символов');

                            nameInputElement.classList.add("-error");
                            textInputElement.classList.add("-error");

                            setTimeout(() => {
                                nameInputElement.classList.remove("-error");
                                textInputElement.classList.remove("-error");
                            }, 500)
                        }

                            if (error.message === 'Failed to fetch') {
                                alert('Нет интернета, попробуйте позже');
                            }
                        }
                    })
                }
            handlePostClick()
        }
    })
}

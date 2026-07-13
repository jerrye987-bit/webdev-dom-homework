import { renderLogin } from './renderLogin.js';
import { sanitizeHtml } from './sanitizeHtml.js'
import { renderComments } from './renderComments.js'
import { fetchComments, postComment } from './api.js'
import { updateComments } from './commentsArr.js'
import { delay } from './delay.js'

const showAuthError = (errorMessage) => {
    const errorBlock = document.getElementById('error-block');
    if (errorBlock) {
        errorBlock.textContent = errorMessage;
    }
};

export const initNewComment = () => {
    const addButton = document.querySelector('.add-form-button')
    const nameInputElement = document.querySelector('.add-form-name'); 
    const textInputElement = document.querySelector('.add-form-text');

    if (!addButton || !nameInputElement || !textInputElement) {
        return; 
    }

    addButton.addEventListener('click', () => {
        showAuthError('');

        if (nameInputElement.value.trim() === '' || textInputElement.value.trim() === '') {
            return alert('Пожалуйста, заполните все поля формы!')
        } else {
            document.querySelector('.form-loading').style.display = 'block'
            document.querySelector('.add-form').style.display = 'none'

            let attemptCount = 0

            const handlePostClick = () => {
                attemptCount++

                postComment(sanitizeHtml(textInputElement.value), sanitizeHtml(nameInputElement.value))
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
                        if (error.message === 'Ошибка сервера' && attemptCount < 3) {
                            console.warn(`Сервер упал. Попытка ${attemptCount} из 3. Пробуем еще раз через 2 секунды...`)
                        
                            delay().then(() => {
                                handlePostClick()
                            })
                            return;
                        }

                        document.querySelector('.form-loading').style.display = 'none'
                        document.querySelector('.add-form').style.display = 'flex'

                        if (error.message === 'Нет авторизации') {
                            const errorBlock = document.getElementById('error-block');
                            if (errorBlock) {
                                errorBlock.innerHTML = `
                                    <span style="color: #ff5e5e;">Ошибка авторизации:</span> 
                                    <span id="go-to-login" style="color: #bcec30; cursor: pointer; text-decoration: underline; margin-left: 5px;">Войдите</span>, чтобы оставить комментарий.
                                `;
                                
                                document.getElementById('go-to-login').addEventListener('click', () => {
                                    renderLogin();
                                });
                            }
                            return;
                        }

                        if (error.message.includes('короче 3 символов') || error.message === 'Неверный запрос') {
                            alert('Имя и комментарий должны быть не короче трёх символов');

                            nameInputElement.classList.add("-error");
                            textInputElement.classList.add("-error");

                            setTimeout(() => {
                                nameInputElement.classList.remove("-error");
                                textInputElement.classList.remove("-error");
                            }, 500)
                            return;
                        }

                        if (error.message === 'Failed to fetch') {
                            alert('Нет интернета, попробуйте позже');
                        }

                        showAuthError(error.message || 'Что-то пошло не так при отправке комментария');
                    })
            }

            handlePostClick()
        }
    })
}

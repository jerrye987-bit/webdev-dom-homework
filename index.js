'use strict'

import { renderComments } from './modules/renderComments.js'
import { initNewComment } from './modules/initNewComment.js'
import { fetchComments } from './modules/api.js'
import { updateComments } from './modules/commentsArr.js'

const appElement = document.getElementById('app');

if (appElement) {
    appElement.innerHTML = `
        <div class="container">
            <p style="font-size: 24px; font-weight: bold;">Пожалуйста подождите, загружаю комментарии...</p>
        </div>
    `;
}

fetchComments()
    .then((data) => {
        updateComments(data)
        renderComments()
    })
    .catch((error) => {
        if (error.message === 'Нет авторизации') {
        updateToken(null); 
        renderLogin(); 
        } else {
            if (appElement) {
                appElement.innerHTML = `
                    <div class="container">
                        <p style="color: #ff5e5e; font-size: 24px; font-weight: bold;">
                            ${error.message || 'Не удалось загрузить комментарии. Попробуйте позже.'}
                        </p>
                    </div>
                `;
            }
        }
        console.error("Ошибка при старте:", error);
    });

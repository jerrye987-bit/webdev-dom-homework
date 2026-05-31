'use strict'

import { renderComments } from './modules/renderComments.js'
import { initNewComment } from './modules/initNewComment.js'
import { fetchComments } from './modules/api.js'
import { updateComments } from './modules/commentsArr.js'

document.querySelector('.comments').innerHTML = 'Пожалуйста подождите, загружаю комментарии...';

fetchComments().then((data) => {
    updateComments(data)
    renderComments()
})

initNewComment()

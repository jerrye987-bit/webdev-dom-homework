import { fetchComments } from './api.js'
import { updateComments } from './commentsArr.js'
import { renderComments } from './renderComments.js'

export const fetchAndRenderComments = () => {

    return fetchComments()
        .then((appComments) => {
            updateComments(appComments);
            renderComments();
        });
}
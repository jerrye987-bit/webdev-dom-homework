export const initReplyListeners = (comments) => {
    const commentsElements = document.querySelectorAll('.comment')

    for (const commentElement of commentsElements) {
        commentElement.addEventListener('click', () => {
            const currentComment = comments[commentElement.dataset.index]
            const textInputElement = document.getElementById('text-input')

            textInputElement.value = `> ${currentComment.text} >\n ${currentComment.name},`
            textInputElement.focus()
        })
    }
}
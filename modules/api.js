const host = 'https://wedev-api.sky.pro/api/v1/:buzina-evgenia'

export const fetchComments = () => {
    return fetch(host + '/comments')
        .then((res) => {
            return res.json()
        })
        .then((responsData) => {
            const appComments = responsData.comments.map((comment) => {
                return {
                    name: comment.author.name,
                    date: new Date(comment.date),
                    text: comment.text,
                    likes: comment.likes,
                    isLikes: false,
                }
            })

            return appComments
        })
}

export const postComment = (text, name) => {
    return fetch(host + '/comments', {
        method: 'POST',
        body: JSON.stringify({
            text: text,
            name: name,
            forceError: true, // Для проверки ошибки 500
        }),
    })
}

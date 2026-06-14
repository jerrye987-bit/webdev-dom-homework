const host = 'https://wedev-api.sky.pro/api/v2/:buzina-evgenia'
const authToken =  'https://wedev-api.sky.pro/api/user'

let user = JSON.parse(localStorage.getItem("user")) || null;
let token = user ? user.token : '';

export const getUserName = () => {
    return user ? user.name : '';
};

export const updateToken = (newUserData) => {
    if (newUserData) {
        user = newUserData;
        token = newUserData.token;
        localStorage.setItem("user", JSON.stringify(newUserData));
    } else {
        user = null;
        token = '';
        localStorage.removeItem("user");
    }
}

export const fetchComments = () => {
    return fetch(host + '/comments', {
        method: 'GET',
        headers: {
            Authorization: `Beaer ${token}`,
        },
    })
        .then((response) => {
            if (response.status === 401) {
                throw new Error('Нет авторизации');
            }
            if (response.status === 500) {
                throw new Error('Сервер сломался, попробуйте позже');
            }
            return response.json()
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
        headers: {
            Authorization: `Beaer ${token}`,
        },
        body: JSON.stringify({
            text: text,
            name: name,
            // forceError: true, // Для проверки ошибки 500
        }),
    })
    .then((response) => {
        if (response.status === 401) {
            throw new Error('Нет авторизации');
        }
        if (response.status === 400) {
            throw new Error('Имя и комментарий должны быть не короче 3 символов');
        }
        if (response.status === 500) {
            throw new Error('Сервер сломался, не удалось добавить комментарий');
        }
        return response.json();
    });
}

export function login({ login, password }) {
    return fetch(`${authToken}/login`, {
        method: 'POST',
        body: JSON.stringify({
            login,
            password,
        }),
    }).then((response) => {
        if (response.status === 400) {
            throw new Error('Неверный логин или пароль');
        }
        return response.json()
    })
}

export function registration({ login, name, password }) {
    return fetch(authToken, {
        method: 'POST',
        body: JSON.stringify({
            login,
            name,
            password,
        }),
    }).then((response) => {
        if (response.status === 400) {
            throw new Error('Пользователь с таким логином уже существует');
        }
        if (response.status === 500) {
            throw new Error('Сервер упал, попробуйте позже');
        }
        return response.json()
    })
}

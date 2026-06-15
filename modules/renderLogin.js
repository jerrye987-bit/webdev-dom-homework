import { login, setToken } from './api.js'
import { fetchComments } from './api.js'
import { updateComments } from './commentsArr.js'
import { renderComments } from './renderComments.js'
import { renderRegistration } from './renderRegistration.js'

export const renderLogin = () => {
    const container = document.querySelector('.container')
    const loginHtml = `
        <section class="add-form">
            <h2>Форма входа</h2>
            <input
                type="text"
                id="login"
                class="add-form-name"
                placeholder="Введите логин"
                required
            >
            <input
                type="text"
                id="password"
                class="add-form-name"
                placeholder="Введите пароль"
                required
            >
            <div class="add-form-row">
                <button class="add-form-button" id="login-button" type="button">Войти</button>
                <button class="add-form-button" id="to-reg-button" type="button" style="background-color: #7334ea; color: white;">Зарегистрироваться</button>
            </div>
        </section>

        <div id="login-error" style="color: #ff5e5e; margin-top: 20px; font-weight: bold; text-align: center;"></div>
    `

    container.innerHTML = loginHtml

    const button = document.getElementById('login-button')
    const buttonToReg = document.getElementById('to-reg-button')
    const loginElement = document.getElementById('login')
    const passwordElement = document.getElementById('password')
    const errorBlock = document.getElementById('login-error')

    if (!button || !buttonToReg) return

    button.addEventListener('click', () => {
        if (errorBlock) errorBlock.textContent = ''

        loginElement.classList.remove('-error')
        passwordElement.classList.remove('-error')

        if (
            loginElement.value.trim() === '' ||
            passwordElement.value.trim() === ''
        ) {
            if (loginElement.value.trim() === '') {
                loginElement.classList.add('-error')
            }

            if (passwordElement.value.trim() === '') {
                passwordElement.classList.add('-error')
            }

            alert('Пожалуйста, заполните все поля формы входа!')
            return
        }

        button.disabled = true
        button.textContent = 'Вход...'

        login({
            login: loginElement.value,
            password: passwordElement.value,
        })
            .then((responseData) => {
                setToken(responseData.user)

                return fetchComments()
            })
            .then((data) => {
                updateComments(data)
                renderComments()
            })
            .catch((error) => {
                if (errorBlock) {
                    errorBlock.textContent =
                        error.message ||
                        'Не удалось войти. Проверьте логин и пароль.'
                }

                loginElement.classList.add('-error');
                passwordElement.classList.add('-error');
                button.disabled = false
                button.textContent = 'Войти'
            })
    })

    buttonToReg.addEventListener('click', () => {
        renderRegistration()
    })

    loginElement.addEventListener('input', () => {
        loginElement.classList.remove('-error')
    })

    passwordElement.addEventListener('input', () => {
        passwordElement.classList.remove('-error')
    })
}

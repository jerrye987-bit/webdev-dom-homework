import { login, updateToken } from "./api.js";
import { fetchComments } from "./api.js";
import { updateComments } from "./commentsArr.js";
import { renderComments } from "./renderComments.js";
import { renderRegistration } from "./renderRegistration.js";

export const renderLogin = () => {
    const app = document.getElementById('app');

    if (!app) return;

    app.innerHTML = `
    <div class="container">
        <h1>Страница входа</h1>

        <form class="add-form" style="gap: 12px;">
            <h3>Форма входа</h3>
            <input type="text" id="login-input" class="add-form-name" autocomplete="username" placeholder="Введите логин" style="width: 100%; box-sizing: border-box;">
            <input type="password" id="password-input" class="add-form-name" autocomplete="current-password" placeholder="Введите пароль" style="width: 100%; box-sizing: border-box;">
            <div class="add-form-row">
                <button class="add-form-button" id="login-button" type="submit">Войти</button>
                <button class="add-form-button" id="to-reg-button" type="button" style="background-color: #7334ea; color: white;">Зарегистрироваться</button>
            </div>
        </form>

        <div id="login-error" style="color: #ff5e5e; margin-top: 20px; font-weight: bold; text-align: center;"></div>
    </div>
    `;

    const button = document.getElementById('login-button');
    const buttonToReg = document.getElementById('to-reg-button');
    const loginElement = document.getElementById('login-input');
    const passwordElement = document.getElementById('password-input');
    const errorBlock = document.getElementById('login-error');

    if (!button || !buttonToReg) return;

    button.addEventListener('click', () => {
        if (errorBlock) errorBlock.textContent = '';

        if (loginElement.value.trim() === '' || passwordElement.value.trim() === '') {
            alert('Пожалуйста, заполните все поля формы входа!');
            return;
        }

        button.disabled = true;
        button.textContent = 'Вход...';

        login({
            login: loginElement.value,
            password: passwordElement.value,
        })
        .then((responseData) => {
            updateToken(responseData.user);
            
            return fetchComments();
        })
        .then((data) => {
            updateComments(data);
            renderComments();
        })
        .catch((error) => {
            if (errorBlock) {
                errorBlock.textContent = error.message || 'Не удалось войти. Проверьте логин и пароль.';
            }
            button.disabled = false;
            button.textContent = 'Войти';
        });
    });

    buttonToReg.addEventListener('click', () => {
        renderRegistration();
    });
};
import { registration, updateToken, fetchComments } from "./api.js";
import { updateComments } from "./commentsArr.js";
import { renderComments } from "./renderComments.js";
import { renderLogin } from "./renderLogin.js";

export const renderRegistration = () => {
    const app = document.getElementById('app');
    if (!app) return;

    app.innerHTML = `
    <div class="container">
        <h1>Страница регистрации</h1>
        <form class="add-form" style="gap: 12px;">
            <h3>Форма регистрации</h3>
            <input type="text" id="name-input" class="add-form-name" autocomplete="name" placeholder="Введите ваше имя" style="width: 100%; box-sizing: border-box;">
            <input type="text" id="login-input" class="add-form-name" autocomplete="username" placeholder="Введите желаемый логин" style="width: 100%; box-sizing: border-box;">
            <input type="password" id="password-input" class="add-form-name" autocomplete="new-password" placeholder="Введите пароль" style="width: 100%; box-sizing: border-box;">
            <div class="add-form-row" style="gap: 12px; display: flex;">
                <button class="add-form-button" id="register-button" type="submit">Зарегистрироваться</button>
                <button class="add-form-button" id="to-login-button" type="button" style="background-color: #7334ea; color: white;">Уже есть аккаунт? Войти</button>
            </div>
        </form>
        <!-- Блок для вывода ошибок регистрации -->
        <div id="reg-error" style="color: #ff5e5e; margin-top: 20px; font-weight: bold; text-align: center;"></div>
    </div>
    `;

    const buttonRegister = document.getElementById('register-button');
    const buttonToLogin = document.getElementById('to-login-button');
    const nameElement = document.getElementById('name-input');
    const loginElement = document.getElementById('login-input');
    const passwordElement = document.getElementById('password-input');
    const errorBlock = document.getElementById('reg-error');

    if (!buttonRegister || !buttonToLogin) return;

    buttonRegister.addEventListener('click', (event) => {
        event.preventDefault(); // Отменяем перезагрузку страницы браузером

        if (errorBlock) errorBlock.textContent = '';

        if (nameElement.value.trim() === '' || loginElement.value.trim() === '' || passwordElement.value.trim() === '') {
            alert('Пожалуйста, заполните все поля формы регистрации!');
            return;
        }

        buttonRegister.disabled = true;
        buttonRegister.textContent = 'Регистрация...';

        registration({
            name: nameElement.value,
            login: loginElement.value,
            password: passwordElement.value,
        })
        .then((responseData) => {
            const userObject = responseData.user ? responseData.user : responseData;
            
            updateToken(userObject);
            
            return fetchComments();
        })
        .then((data) => {
            updateComments(data);
            renderComments();
        })
        .catch((error) => {
            if (errorBlock) {
                errorBlock.textContent = error.message || 'Не удалось зарегистрироваться. Попробуйте другой логин.';
            }
            buttonRegister.disabled = false;
            buttonRegister.textContent = 'Зарегистрироваться';
        });
    });

    buttonToLogin.addEventListener('click', () => {
        renderLogin();
    });
};
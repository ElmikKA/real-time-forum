import { login } from "../../services/auth.js";
import { showRegistrationSection } from "../../services/auth.js";

export function createLoginSection() {
    const loginContainer = document.getElementById('login-container');

    const loginSection = document.createElement('div');
    loginSection.id = 'login-section';

    const welcomeHeader = createElement('h1', 'WELCOME TO THE GULAG!');
    loginSection.appendChild(welcomeHeader);

    const loginForm = document.createElement('form');
    loginForm.id = 'login-form';

    const usernameInput = createInputField('login-username', 'Username/Email', 'text');
    const passwordInput = createInputField('login-password', 'Password', 'password');

    loginForm.appendChild(usernameInput.label);
    loginForm.appendChild(usernameInput.input);

    loginForm.appendChild(passwordInput.label);
    loginForm.appendChild(passwordInput.input);

    const buttonsDiv = document.createElement('div');
    buttonsDiv.classList.add('login-and-registration-buttons');

    const loginButton = createButton('login-button', 'LogIn', 'submit', async (event) => {
        event.preventDefault();
        await login();
    });

    const registrationButton = createButton('registration-button', 'Register', 'button', (event) => {
        event.preventDefault();
        showRegistrationSection();
    });

    buttonsDiv.appendChild(loginButton);
    buttonsDiv.appendChild(registrationButton);

    loginForm.appendChild(buttonsDiv);

    const loginMessages = document.createElement('p');
    loginMessages.id = 'login-messages';

    loginSection.appendChild(loginForm);
    loginSection.appendChild(loginMessages);

    loginContainer.appendChild(loginSection);
}

function createElement(tag, textContent = '', className = '') {
    const element = document.createElement(tag);
    if (textContent) element.textContent = textContent;
    if (className) element.classList.add(className);
    return element;
}

function createInputField(id, labelText, type) {
    const label = createElement('label', labelText);
    label.setAttribute('for', id);

    const input = document.createElement('input');
    input.type = type;
    input.id = id;
    input.name = id;

    return { label, input };
}

function createButton(id, textContent, type, onClickHandler) {
    const button = createElement('button', textContent);
    button.type = type;
    button.id = id;
    button.classList.add(id);
    button.addEventListener('click', onClickHandler);
    return button;
}

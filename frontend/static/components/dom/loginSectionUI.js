export function createLoginSection() {
    const loginContainer = document.getElementById('login-container');

    const loginSection = document.createElement('div');
    loginSection.id = 'login-section';

    const welcomeHeader = document.createElement('h1');
    welcomeHeader.textContent = 'WELCOME TO THE GULAG!';
    loginSection.appendChild(welcomeHeader);

    const loginForm = document.createElement('form');
    loginForm.id = 'login-form';

    const usernameLabel = document.createElement('label');
    usernameLabel.setAttribute('for', 'login-username');
    usernameLabel.textContent = 'Username/Email';

    const usernameInput = document.createElement('input');
    usernameInput.type = 'text';
    usernameInput.id = 'login-username';
    usernameInput.name = 'login-username';

    loginForm.appendChild(usernameLabel);
    loginForm.appendChild(usernameInput);

    const passwordLabel = document.createElement('label');
    passwordLabel.setAttribute('for', 'login-password');
    passwordLabel.textContent = 'Password';

    const passwordInput = document.createElement('input');
    passwordInput.type = 'password';
    passwordInput.id = 'login-password';
    passwordInput.name = 'login-password';

    loginForm.appendChild(passwordLabel);
    loginForm.appendChild(passwordInput);

    const buttonsDiv = document.createElement('div');
    buttonsDiv.classList.add('login-and-registration-buttons');

    const loginButton = document.createElement('button');
    loginButton.type = 'submit';
    loginButton.classList.add('login-button');
    loginButton.id = 'login-button';
    loginButton.textContent = 'LogIn';

    const registrationButton = document.createElement('button');
    registrationButton.type = 'button';
    registrationButton.classList.add('registration-button');
    registrationButton.id = 'registration-button';
    registrationButton.textContent = 'Register';

    buttonsDiv.appendChild(loginButton);
    buttonsDiv.appendChild(registrationButton);

    loginForm.appendChild(buttonsDiv);

    const loginMessages = document.createElement('p');
    loginMessages.id = 'login-messages';

    loginSection.appendChild(loginForm);
    loginSection.appendChild(loginMessages);

    loginContainer.appendChild(loginSection);
}
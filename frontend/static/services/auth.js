import { showPostSection } from "../components/dom/userProfileUI.js"
import { loginFetch, logoutFetch, registerFetch } from "./api.js";
import { toggleVisibility } from '../functions/toggleVisibility.js'
import { closeWebSocket } from "../components/sidebar.js";
import { setupPostLoginHeaderSection } from "../components/dom/headerUI.js";

//Login Logic
export async function login() {
    const message = document.getElementById('login-messages');
    const loginCredentials = {
        user: document.getElementById('login-username').value,
        password: document.getElementById('login-password').value,
    }

    if (!validateLoginForm(loginCredentials)) {
        message.innerHTML = "Please enter both username and password.";
        return;
    }

    try {
       const loginSuccess = await loginFetch(loginCredentials);
       console.log(loginSuccess)

       if(loginSuccess.login === 'success') {
        setupPostLoginHeaderSection();
       }

    } catch(error) {
        console.log('Login failed:', error)
    }
}

export function clearLoginForm() {
    document.getElementById('login-username').value = '';
    document.getElementById('login-password').value = '';
}

function validateLoginForm(credentials) {
    return credentials.user && credentials.password;
}

export function hideLoginSection() {
    toggleVisibility('login-container', false);
    toggleVisibility('main-section', true);
}

export function showLoginSection() {
    toggleVisibility('login-container', true);
    toggleVisibility('main-section', false);
}

//Logout Logic
export async function logout() {
    const userProfileSection = document.getElementById('user-profile');
    if(userProfileSection.classList.contains('visible')) showPostSection(userProfileSection);

    const profileAndAddNewButtonDiv = document.getElementById('profile-and-add-new-button-div');

    if(profileAndAddNewButtonDiv) {
        profileAndAddNewButtonDiv.remove();
    }


    try {
        closeWebSocket();
        showLoginSection();
        await logoutFetch();
    } catch(error) {
        console.log('Logout failed:', error);
    }
}

//Register User Logic
export async function registerUser() {
    const registrationFormSection = document.getElementById('registration-form');
    const messageDiv = document.getElementById('registerMessage');
    const registerForm = {
        username: registrationFormSection.querySelector('#username').value,
        age: parseInt(registrationFormSection.querySelector('#age').value),
        gender: registrationFormSection.querySelector('#gender').value,
        fname: registrationFormSection.querySelector('#first-name').value,
        lname: registrationFormSection.querySelector('#last-name').value,
        email: registrationFormSection.querySelector('#email').value,
        password: registrationFormSection.querySelector('#password').value,
    }

    if(!validateForm(registerForm)) {
        messageDiv.innerHTML = "Please fill out all fields correctly.";
        return;
    }

    try {
        await registerFetch(registerForm);
    } catch(error) {
        console.log('Registration failed:', error)
    }
}

export function showRegistrationSection() {
    toggleVisibility("login-container", false);
    toggleVisibility("registration-container", true);
}

export function hideRegistrationSection() {
    toggleVisibility('login-container', true);
    toggleVisibility('registration-container', false);
}   

function validateForm(form) {
    if (!form.username || !form.age || !form.gender || !form.fname || !form.lname || !form.email || !form.password) {
        return false;
    }
    return true;
}
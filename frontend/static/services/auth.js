import { showPostSection } from "../components/userProfile.js";
import { loginFetch, logoutFetch, registerFetch } from "./api.js";

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

    await loginFetch(loginCredentials);
}

export function clearLoginForm() {
    document.getElementById('login-username').value = '';
    document.getElementById('login-password').value = '';
}

function validateLoginForm(credentials) {
    return credentials.user && credentials.password;
}

export function hideLoginSection() {
    toggleVisibility('profile-and-add-new-button-div', true);
    toggleVisibility('login-container', false);
    toggleVisibility('main-section', true);
}

export function showLoginSection() {
    toggleVisibility('profile-and-add-new-button-div', false);
    toggleVisibility('login-container', true);
    toggleVisibility('main-section', false);
}

//Logout Logic
export async function logout() {
    //If user logsout in user profile section, it reverses to post section
    const userProfileSection = document.getElementById('user-profile');
    if(userProfileSection.classList.contains('visible')) showPostSection(userProfileSection);
    await logoutFetch();
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

    console.log(registerForm);

    if(!validateForm(registerForm)) {
        messageDiv.innerHTML = "Please fill out all fields correctly.";
        return;
    }

    await registerFetch(registerForm);
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

function toggleVisibility(elementId, isVisible) {
    const element = document.getElementById(elementId);
    element.classList.toggle('visible', isVisible);
    element.classList.toggle('hidden', !isVisible);
}
import { getUsers } from "../data/data.js";
import { showPostSection } from "./../components/userProfileUI.js";


//Login Logic
export function login() {
    const users = getUsers();
    const nickname = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    const user = users.find(user => user.nickname === nickname && user.password === password);

    if(user) {
        localStorage.setItem('loggedInUser', JSON.stringify(user))
        hideLoginSection();
    } else {
        //TODO
        //Create a better alert
        alert('Invalid username or password');
    }
}

function hideLoginSection() {
    toggleVisibility('profile-and-add-new-button-div', true);
    toggleVisibility('login-container', false);
    toggleVisibility('main-section', true);
}

function showLoginSection() {
    toggleVisibility('profile-and-add-new-button-div', false);
    toggleVisibility('login-container', true);
    toggleVisibility('main-section', false);
}

export function logout() {
    //If user logsout in user profile section, it reverses to post section
    const userProfileSection = document.getElementById('user-profile');
    if(userProfileSection.classList.contains('visible')) showPostSection(userProfileSection);
    //Cleares user session data
    localStorage.removeItem('loggedInUser');
    showLoginSection()
}

function toggleVisibility(elementId, isVisible) {
    const element = document.getElementById(elementId);
    element.classList.toggle('visible', isVisible);
    element.classList.toggle('hidden', !isVisible);
}

//Register User Logic

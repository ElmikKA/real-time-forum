import { showPostSection } from "./../components/userProfileUI.js";

//TODO
//Make the message after registerig or some failure bit more seeable


//Login Logic
export function login() {
    const message = document.getElementById('login-messages');
    const loginCredentials = {
        user: document.getElementById('login-username').value,
        password: document.getElementById('login-password').value,
    }

    if (!validateLoginForm(loginCredentials)) {
        message.innerHTML = "Please enter both username and password.";
        return;
    }

    fetch('/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginCredentials)
    })
    .then(response => {
        if(!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        if(data.login !== 'success') {
            message.innerHTML = data.message;
        } else {
            localStorage.setItem('loggedInUser', JSON.stringify(data.user));
            hideLoginSection();
            clearLoginForm();
        }
    })
    .catch(error =>  {
        console.log('There was a problem with the login in:', error);
        message.innerHTML = "An error occured durning log in. Please try again."
    })

    console.log(JSON.parse(localStorage.getItem('loggedInUser')))
}

function clearLoginForm() {
    document.getElementById('login-username').value = '';
    document.getElementById('login-password').value = '';
}

function validateLoginForm(credentials) {
    return credentials.user && credentials.password;
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


//Logout Logic
export function logout() {
    //If user logsout in user profile section, it reverses to post section
    const userProfileSection = document.getElementById('user-profile');
    if(userProfileSection.classList.contains('visible')) showPostSection(userProfileSection);

    fetch('/api/logout', {
        method: 'POST',
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        console.log('Logout successful:', response);
    })
    .catch(error => {
        console.error('There was a problem with the logout:', error);
    });

    //Cleares user session data
    localStorage.removeItem('loggedInUser');
    showLoginSection()
}

//Register User Logic
export function registerUser() {
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

    fetch('/api/register', {
        method: 'POST',
        headers: {
            'Content-Type' : 'application/json'
        },
        body: JSON.stringify(registerForm),
    })
    .then(response => {
        if(!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        if(data.register !== 'success') {
            messageDiv.innerHTML = data.message;
            console.log(data)
        } else {
            messageDiv.innerHTML = "Registration successful!";
            hideRegistrationSection();
        }
        console.log(data)
    })
    .catch(error =>  {
        console.log('There was a problem with the registration:', error);
        messageDiv.innerHTML = "An error occured durning registration. Please try again."
    })
            
}

export function showRegistrationSection() {
    toggleVisibility("login-container", false);
    toggleVisibility("registration-container", true);
}

function hideRegistrationSection() {
    toggleVisibility('login-container', true);
    toggleVisibility('registration-container', false);
}   

function validateForm(form) {
    // Check if any of the required fields are empty
    if (!form.username || !form.age || !form.gender || !form.fname || !form.lname || !form.email || !form.password) {
        return false;
    }
    // Additional validation rules can be added here
    return true;
}

function toggleVisibility(elementId, isVisible) {
    const element = document.getElementById(elementId);
    element.classList.toggle('visible', isVisible);
    element.classList.toggle('hidden', !isVisible);
}
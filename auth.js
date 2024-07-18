
const user = {
    username: 'Elmik',
    password: 'somesome'
};


export function login() {
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    let isCorrectUsernameAndPassword = false;

    if (username === user.username && password === user.password) {
        isCorrectUsernameAndPassword = true;
    }

    if (isCorrectUsernameAndPassword) {
        document.getElementById('profile-and-add-new-button-div').classList.remove('hidden');
        document.getElementById('profile-and-add-new-button-div').classList.add('visible');
        document.getElementById('login-container').classList.remove('visible');
        document.getElementById('login-container').classList.add('hidden');
        document.getElementById('main-section').classList.remove('hidden');
        document.getElementById('main-section').classList.add('visible');
    } else {
        alert('Invalid username or password');
    }
}
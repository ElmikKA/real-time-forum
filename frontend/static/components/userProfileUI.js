
export function openProfileSection() {
     const userProfileSection = document.getElementById('user-profile');
     hidePostSection(userProfileSection);
     createInnerHTMLForUserProfile(userProfileSection)
}

function hidePostSection(userProfileSection) {
    const postContent = document.getElementById('main-content-for-posts');
    postContent.classList.remove('visible');
    postContent.classList.add('hidden');
    showUserProfileSection(userProfileSection);
}

function showUserProfileSection(userProfileSection) {
    userProfileSection.classList.remove('hidden');
    userProfileSection.classList.add('visible');
}

export function showPostSection(userProfileSection) {
    const postContent = document.getElementById('main-content-for-posts');
    postContent.classList.remove('hidden');
    postContent.classList.add('visible');
    hideUserProfileSection(userProfileSection);
}

function hideUserProfileSection(userProfileSection) {
    userProfileSection.classList.remove('visible');
    userProfileSection.classList.add('hidden');
}

function createInnerHTMLForUserProfile(userProfileSection) {
    const user = JSON.parse(localStorage.getItem('loggedInUser'));
    console.log(user)

    userProfileSection.innerHTML = `
        <div id="user-profile-header">
            <div id="user-profile-picture-and-name">
                <div id="user-profile-picture">${user.username[0]}</div>
                <h2>${user.username}</h2>
            </div>
            <button id="save-user-profile-changes-button">SAVE CHANGES</button>
        </div>
        <form id="change-profile-information-form">
            <div class="form-group">
                <div class="form-field">
                    <label for="user-email">Email</label>
                    <input type="email" id="user-email" name="user-email" placeholder="${user.email}">
                </div>
                <div class="form-field">
                    <label for="user-username">Username</label>
                    <input type="text" id="user-username" name="user-username" placeholder="${user.username}">
                </div>
            </div>
            <div class="form-group">
                <div class="form-field">
                    <label for="user-first-name">First Name</label>
                    <input type="text" id="user-first-name" name="user-first-name" placeholder="${user.fname}">
                </div>
                <div class="form-field">
                    <label for="user-last-name">Last Name</label>
                    <input type="text" id="user-last-name" name="user-last-name" placeholder="${user.lname}">
                </div>
            </div>
            <div class="form-group">
                <div class="form-field">
                    <label for="user-age">Age</label>
                    <input type="number" id="user-age" name="user-age" placeholder="${user.age}">
                </div>
                <div class="form-field">
                    <label for="user-gender">Gender</label>
                    <input type="text" id="user-gender" name="user-gender" placeholder="${user.gender}">
                </div>
            </div>
            <div class="password-field-for-user-profile">
                <div class="form-field">
                    <label for="user-password">Password</label>
                    <input type="password" id="user-password" name="user-password">
                </div>
            </div>
        </form>
    `
}
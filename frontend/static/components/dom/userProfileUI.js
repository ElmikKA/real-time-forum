export function userProfileSection(userProfileSection) {
    const user = JSON.parse(localStorage.getItem('loggedInUser'));

    userProfileSection.innerHTML = '';

    // Header
    const profileHeader = document.createElement('div');
    profileHeader.id = 'user-profile-header';

    const profilePictureAndNameDiv = document.createElement('div');
    profilePictureAndNameDiv.id = 'user-profile-picture-and-name';

    const userPicture = document.createElement('div');
    userPicture.id = 'user-profile-picture';
    userPicture.textContent = user.username[0];

    const userName = document.createElement('h2');
    userName.textContent = user.username;

    profilePictureAndNameDiv.appendChild(userPicture);
    profilePictureAndNameDiv.appendChild(userName);

    profileHeader.appendChild(profilePictureAndNameDiv);

    // Displaying user information (instead of form)
    const userInfoDiv = document.createElement('div');
    userInfoDiv.id = 'user-profile-info';

    const userGroups = [
        [
            {label: 'Email', value: user.email},
            {label: 'Username', value: user.username},
        ],

        [
            {label: 'First Name', value: user.fname},
            {label: 'Last Name', value: user.lname},
        ],
        [
            {label: 'Age', value: user.age},
            {label: 'Gender', value: user.gender},
        ]
    ];

    userGroups.forEach(group => {
        const userGroup= document.createElement('div');
        userGroup.classList.add('user-profile-group');

        group.forEach(field => {
            const userFieldDiv = document.createElement('div');
            userFieldDiv.classList.add('user-profile-field');
    
            const label = document.createElement('span');
            label.classList.add('user-profile-label');
            label.textContent = `${field.label}:`;
    
            const value = document.createElement('span');
            value.classList.add('user-profile-value');
            value.textContent = field.value;
    
            userFieldDiv.appendChild(label);
            userFieldDiv.appendChild(value);
            userGroup.appendChild(userFieldDiv);
        });

        userInfoDiv.appendChild(userGroup);
    })


    const passwordFieldDiv = document.createElement('div');
    passwordFieldDiv.classList.add('user-profile-field');

    const passwordLabel = document.createElement('span');
    passwordLabel.classList.add('user-profile-label');
    passwordLabel.textContent = 'Password:';

    const passwordValue = document.createElement('span');
    passwordValue.classList.add('user-profile-value');
    passwordValue.textContent = '********';  // Mask the password field for display purposes

    passwordFieldDiv.appendChild(passwordLabel);
    passwordFieldDiv.appendChild(passwordValue);

    userInfoDiv.appendChild(passwordFieldDiv);

    // Append to userProfileSection
    userProfileSection.appendChild(profileHeader);
    userProfileSection.appendChild(userInfoDiv);
}

export function openProfileSection() {
    const userProfileSectionDiv = document.getElementById('user-profile');
    hidePostSection(userProfileSectionDiv);
    userProfileSection(userProfileSectionDiv);
}

function hidePostSection(userProfileSectionDiv) {
   const postContent = document.getElementById('main-content-for-posts');
   postContent.classList.remove('visible');
   postContent.classList.add('hidden');
   showUserProfileSection(userProfileSectionDiv);
}

function showUserProfileSection(userProfileSectionDiv) {
   userProfileSectionDiv.classList.remove('hidden');
   userProfileSectionDiv.classList.add('visible');
}

export function showPostSection(userProfileSectionDiv) {
   const postContent = document.getElementById('main-content-for-posts');
   postContent.classList.remove('hidden');
   postContent.classList.add('visible');
   hideUserProfileSection(userProfileSectionDiv);
}

function hideUserProfileSection(userProfileSectionDiv) {
   userProfileSectionDiv.classList.remove('visible');
   userProfileSectionDiv.classList.add('hidden');
}
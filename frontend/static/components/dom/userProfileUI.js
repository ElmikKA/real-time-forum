export function userProfileSection(userProfileSection) {
    const user = JSON.parse(localStorage.getItem('loggedInUser'));

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

    const saveChangesButton = document.createElement('button');
    saveChangesButton.id = 'save-user-profile-changes-button';
    saveChangesButton.textContent = 'SAVE CHANGES';

    profileHeader.appendChild(profilePictureAndNameDiv);
    profileHeader.appendChild(saveChangesButton);

    //Form
    const form = document.createElement('form');
    form.id = 'change-profile-information-form';

    const formGroups = [
        [
            {id: 'user-email', label: 'Email', type: 'email', placeholder: user.email},
            {id: 'user-username', label: 'Username', type: 'text', placeholder: user.username}
        ],
        [
            {id: 'user-first-name', label: 'First Name', type: 'text', placeholder: user.fname},
            {id: 'user-last-name', label: 'Last Name', type: 'text', placeholder: user.lname}
        ],
        [
            {id: 'user-age', label: 'Age', type: 'number', placeholder: user.age},
            {id: 'user-gender', label: 'Gender', type: 'text', placeholder: user.gender}
        ]
    ];

    formGroups.forEach(group => {
        const formGroup = document.createElement('div');
        formGroup.classList.add('form-group');

        group.forEach(field => {
            const formField = document.createElement('div');
            formField.classList.add('form-field');

            const label = document.createElement('label');
            label.setAttribute('for', field.id);
            label.textContent = field.label;

            const input = document.createElement('input');
            input.type = field.type;
            input.id = field.id;
            input.name = field.id;
            input.placeholder = field.placeholder;

            formField.appendChild(label);
            formField.appendChild(input);
            formGroup.appendChild(formField);
        })
        form.appendChild(formGroup);
    })

    const passwordFieldGroup = document.createElement('div');
    passwordFieldGroup.classList.add('password-field-for-user-profile');

    const passwordField = document.createElement('div');
    passwordField.classList.add('form-field');

    const passwordLabel = document.createElement('label');
    passwordLabel.setAttribute('for', 'user-password');
    passwordLabel.textContent = 'Password';

    const passwordInput = document.createElement('input');
    passwordInput.type = 'password';
    passwordInput.id = 'user-password';
    passwordInput.name = 'user-password';

    passwordField.appendChild(passwordLabel);
    passwordField.appendChild(passwordInput);
    passwordFieldGroup.appendChild(passwordField);

    form.appendChild(passwordFieldGroup);

    userProfileSection.appendChild(profileHeader);
    userProfileSection.appendChild(form);

    //TODO: Add eventListener for save change button
}
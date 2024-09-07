import { registerUser } from "../../services/auth.js";

export function createRegistrationSection() {
    const registrationContainer = document.getElementById('registration-container');

    const registrationSection = document.createElement('div');
    registrationSection.id = 'registration-section';

    const registrationHeader = document.createElement('h1');
    registrationHeader.textContent = 'Register User';
    registrationSection.appendChild(registrationHeader);

    const registrationForm = document.createElement('form');
    registrationForm.id = 'registration-form';

    const formGroups = [
        [
            { id: 'username', label: 'Username', type: 'text', placeholder: 'Enter Username' },
            { id: 'age', label: 'Age', type: 'number', placeholder: 'Age' }
        ],
        [
            { id: 'gender', label: 'Gender', type: 'text', placeholder: 'Enter gender' },
            { id: 'first-name', label: 'First Name', type: 'text', placeholder: 'Enter first name' }
        ],
        [
            { id: 'last-name', label: 'Last Name', type: 'text', placeholder: 'Enter last name' },
            { id: 'email', label: 'E-mail', type: 'text', placeholder: 'Enter E-mail' }
        ],
        [
            { id: 'password', label: 'Password', type: 'password', placeholder: 'Password' }
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
            input.placeholder = field.placeholder;
            input.required = true;

            formField.appendChild(label);
            formField.appendChild(input);
            formGroup.appendChild(formField);
        });

        registrationForm.appendChild(formGroup);
    });

    const submitButton = document.createElement('input');
    submitButton.type = 'submit';
    submitButton.name = 'register-user-button';
    submitButton.id = 'register-user-button';

    registrationForm.addEventListener('submit', (event) => {
        event.preventDefault();
        registerUser();
    });

    registrationForm.appendChild(submitButton);

    const registerMessage = document.createElement('p');
    registerMessage.id = 'registerMessage';
    registrationForm.appendChild(registerMessage);

    registrationSection.appendChild(registrationForm);
    registrationContainer.appendChild(registrationSection);
}
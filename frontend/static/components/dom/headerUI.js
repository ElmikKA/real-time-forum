import { logout } from "../../services/auth.js";
import { openProfileSection } from "../userProfile.js";
import { toggleVisibility } from "../../functions/toggleVisibility.js";

export function showHeaderSection() {
    const headerSection = document.getElementById('header-section');
    
    const logoDiv = createLogoDiv();
    const profileAndAddNewButtonDiv = createProfileAndAddNewButtonDiv();

    headerSection.appendChild(logoDiv);
    headerSection.appendChild(profileAndAddNewButtonDiv);

    if (localStorage.getItem('loggedInUser')) {
        createDropDownMenu();
    }
}

function createLogoDiv() {
    const logoDiv = document.createElement('div');
    logoDiv.id = 'logo-div';

    const image = document.createElement('img');
    image.src = './static/assets/logo.png';
    image.alt = 'logo-for-real-forum';
    image.classList.add('logo');

    logoDiv.appendChild(image);

    return logoDiv;
}

function createProfileAndAddNewButtonDiv() {
    const profileAndAddNewButtonDiv = document.createElement('div');
    profileAndAddNewButtonDiv.id = 'profile-and-add-new-button-div';
    profileAndAddNewButtonDiv.classList.add('hidden');

    const addNewPostButton = document.createElement('button');
    addNewPostButton.id = 'add-new-button';
    addNewPostButton.textContent = 'NEW POST';

    const dropdown = document.createElement('div');
    dropdown.id = 'dropdown';

    profileAndAddNewButtonDiv.appendChild(addNewPostButton);
    profileAndAddNewButtonDiv.appendChild(dropdown);

    return profileAndAddNewButtonDiv;
}

function createDropDownMenu() {
    const dropdown = document.getElementById('dropdown');
    const user = JSON.parse(localStorage.getItem('loggedInUser'));

    const dropdownToggle = createDropdownToggle(user);
    const dropdownMenu = createDropdownMenu();

    dropdown.appendChild(dropdownToggle);
    dropdown.appendChild(dropdownMenu);

    initializeDropDownMenuEvents();
}

function createDropdownToggle(user) {
    const dropdownToggle = document.createElement('button');
    dropdownToggle.id = 'dropdown-toggle';
    dropdownToggle.classList.add('dropdown-toggle');
    dropdownToggle.textContent = user.username[0];
    return dropdownToggle;
}

function createDropdownMenu() {
    const dropdownMenu = document.createElement('div');
    dropdownMenu.classList.add('dropdown-menu');
    dropdownMenu.id = 'dropdown-menu';

    const homeButton = createButton('home-button', 'Home', showHomePage);
    const profileButton = createButton('user-profile-button', 'Profile', openProfileSection);
    const logoutButton = createButton('logout-button', 'Logout', async () => {
        await logout();
    });

    dropdownMenu.appendChild(homeButton);
    dropdownMenu.appendChild(profileButton);
    dropdownMenu.appendChild(logoutButton);

    return dropdownMenu;
}

function createButton(id, textContent, onClickHandler) {
    const button = document.createElement('button');
    button.id = id;
    button.textContent = textContent;
    button.addEventListener('click', (event) => {
        event.preventDefault();
        onClickHandler();
    });
    return button;
}

function initializeDropDownMenuEvents() {
    const dropdownToggle = document.getElementById('dropdown-toggle');
    const dropdownMenu = document.getElementById('dropdown-menu');

    dropdownToggle.addEventListener('click', () => {
        dropdownMenu.classList.toggle('show');
    });

    window.addEventListener('click', (event) => {
        if (!event.target.matches('.dropdown-toggle')) {
            if (dropdownMenu.classList.contains('show')) {
                dropdownMenu.classList.remove('show');
            }
        }
    });
}

function showHomePage() {
    toggleVisibility("main-content-for-posts", true);
    toggleVisibility("user-profile", false);
}

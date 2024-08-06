import { login, logout, registerUser } from "./services/auth.js";
import { showAllUsersAtSidebar } from "./components/sidebarUI.js";
import { addNewPostButtonListener, initializePosts } from "./components/postUI.js";
import { openProfileSection } from "./components/userProfileUI.js";
import { dropDownMenu } from "./components/dropdownMenu.js";
import { messengerWindow } from "./components/messengerWindow.js";
import { showRegistrationSection} from "./services/auth.js";
import { fetchAndStoreActiveUser } from "./services/user.js";

document.addEventListener('DOMContentLoaded', () => {

    document.getElementById('login-form').addEventListener('submit', (event) => {
        event.preventDefault(); // Prevents form submission
        login();
        fetchAndStoreActiveUser();
    });

    document.getElementById('registration-form').addEventListener('submit', (event) => {
        event.preventDefault();
        registerUser();
    });

    document.getElementById('logout-button').addEventListener('click', (event) => {
        event.preventDefault();
        logout();
    });

    document.getElementById('user-profile-button').addEventListener('click', (event) => {
        event.preventDefault();
        openProfileSection();
    });

    document.getElementById('registration-button').addEventListener('click', (event) => {
        event.preventDefault();
        showRegistrationSection();
    });

    initializePosts();
    addNewPostButtonListener();
    showAllUsersAtSidebar();
    dropDownMenu();
    messengerWindow();
});

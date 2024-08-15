import { login, logout, registerUser } from "./services/auth.js";
import { showAllUsersAtSidebar } from "./components/sidebarUI.js";
import { addNewPostButtonListener, initializePosts } from "./components/posts/posts.js";
import { openProfileSection } from "./components/userProfileUI.js";
import { dropDownMenu } from "./components/dropdownMenu.js";
import { messengerWindow } from "./components/messengerWindow.js";
import { showRegistrationSection} from "./services/auth.js";
import { showHeaderSection } from "./components/headerUI.js";

document.addEventListener('DOMContentLoaded', () => {

    showHeaderSection();
    initializePosts();
    addNewPostButtonListener();
    showAllUsersAtSidebar();
    dropDownMenu();
    messengerWindow();

    document.getElementById('login-form').addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevents form submission
        await login();
    });

    document.getElementById('registration-form').addEventListener('submit', (event) => {
        event.preventDefault();
        registerUser();
    });

    document.getElementById('logout-button').addEventListener('click', async (event) => {
        event.preventDefault();
        await logout();
    });

    document.getElementById('user-profile-button').addEventListener('click', (event) => {
        event.preventDefault();
        openProfileSection();
    });

    document.getElementById('registration-button').addEventListener('click', (event) => {
        event.preventDefault();
        showRegistrationSection();
    });
});

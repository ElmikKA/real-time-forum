import { login, logout } from "./services/auth.js";
import { showAllUsersAtSidebar } from "./components/sidebarUI.js";
import { addNewPostButtonListener, initializePosts } from "./components/postUI.js";
import { openProfileSection } from "./components/userProfileUI.js";
import { dropDownMenu } from "./components/dropdownMenu.js"
import { messengerWindow } from "./components/messengerWindow.js";

document.addEventListener('DOMContentLoaded', () => {

    document.getElementById('login-form').addEventListener('submit', function(event) {
        event.preventDefault(); // Prevents form submission
        login();
    });
    
    document.getElementById('logout-button').addEventListener('click', (event) => {
        event.preventDefault();
        logout();
    })

    document.getElementById('user-profile-button').addEventListener('click', (event) => {
        event.preventDefault();
        openProfileSection();
    })

    initializePosts();
    addNewPostButtonListener();
    showAllUsersAtSidebar();
    dropDownMenu();
    messengerWindow();
})


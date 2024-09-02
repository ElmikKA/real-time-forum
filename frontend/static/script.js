import { showAllUsersAtSidebar } from "./components/sidebar.js";
import { showHeaderSection } from "./components/dom/headerUI.js";

import { createLoginSection } from "./components/dom/loginSectionUI.js";
import { createRegistrationSection } from "./components/dom/registrationSectionUI.js";

import { hideLoginSection, showLoginSection } from "./services/auth.js";
import { initializePosts } from "./components/posts.js";

document.addEventListener('DOMContentLoaded', () => {
    createLoginSection();
    createRegistrationSection();
    showHeaderSection();
});

window.onload = async function() {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    
    if (loggedInUser) {
        await initializePosts();
        showAllUsersAtSidebar();
        hideLoginSection();
    } else {
        showLoginSection();
    }
};

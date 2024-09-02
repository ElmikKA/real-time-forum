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
        // Optionally, verify with the server that the session is still valid
        await initializePosts(); // Load posts or other main content
        showAllUsersAtSidebar(); // Initialize sidebar with users
        hideLoginSection(); // Show the main app and hide the login
    } else {
        showLoginSection(); // Show the login section if no user is logged in
    }
};

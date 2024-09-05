import { showAllUsersAtSidebar } from "./components/sidebar.js";
import { showInitialHeaderSection } from "./components/dom/headerUI.js";

import { createLoginSection } from "./components/dom/loginSectionUI.js";
import { createRegistrationSection } from "./components/dom/registrationSectionUI.js";

import { hideLoginSection, showLoginSection } from "./services/auth.js";
import { initializePosts } from "./components/posts.js";

import { setupPostLoginHeaderSection } from "./components/dom/headerUI.js";

import { openFilterDropDownMenu } from "./components/filterPosts.js";
document.addEventListener('DOMContentLoaded', () => {
    createLoginSection();
    createRegistrationSection();
    showInitialHeaderSection();

    const filterButton = document.getElementById('filter-posts-button');
    filterButton.addEventListener('click', () => {
        openFilterDropDownMenu();
    })
});

window.onload = async function() {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    
    if (loggedInUser) {
        await initializePosts();
        showAllUsersAtSidebar();
        hideLoginSection();
        setupPostLoginHeaderSection();
    } else {
        showLoginSection();
    }
};

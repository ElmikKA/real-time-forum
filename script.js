import { login } from "./auth.js";
import { addNewPostButtonListener, initializePosts } from "./posts/postUI.js";

document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevents form submission
    login();
});

document.addEventListener('DOMContentLoaded', () => {
    initializePosts();
    addNewPostButtonListener();
})
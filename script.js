

import { login } from "./auth.js";
import { postLayoutForHtml } from "./post.js";

document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form submission
    login();
});

document.addEventListener('DOMContentLoaded', () => {
    postLayoutForHtml()
})
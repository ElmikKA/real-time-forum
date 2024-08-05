

export function registrationSection() {
    toggleVisibility("login-and-registration-section", false);
    toggleVisibility("registration-section", true);

}

function toggleVisibility(elementId, isVisible) {
    const element = document.getElementById(elementId);
    element.classList.toggle("visible", isVisible);
    element.classList.toggle("hidden", !isVisible);
}
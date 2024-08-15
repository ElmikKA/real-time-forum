export function dropDownMenu() {
    const dropdownToggle = document.getElementById('dropdown-toggle');
    const dropdownMenu = document.getElementById('dropdown-menu');
    const homeButton = document.getElementById('home-button');
    dropdownToggle.addEventListener('click', () => {
        dropdownMenu.classList.toggle('show');
    });
    // Close the dropdown if the user clicks outside of it
    window.addEventListener('click', (event) => {
        if (!event.target.matches('.dropdown-toggle')) {
            if (dropdownMenu.classList.contains('show')) {
                dropdownMenu.classList.remove('show');
            }
        }
    });

    homeButton.addEventListener('click', () => {
        toggleVisiblity(true, "main-content-for-posts");
        toggleVisiblity(false, "user-profile");
    })
}

function toggleVisiblity(isVisible, elementId) {
    const element = document.getElementById(elementId);
    element.classList.toggle('visible', isVisible);
    element.classList.toggle('hidden', !isVisible);
}




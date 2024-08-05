export function dropDownMenu() {
    const dropdownToggle = document.getElementById('dropdown-toggle');
    const dropdownMenu = document.getElementById('dropdown-menu');
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
}


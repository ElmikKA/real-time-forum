export function showHeaderSection() {
    const headerSection = document.getElementById('header-section');
    
    const logoDiv = document.createElement('div');
    logoDiv.id = 'logo-div';

    const image = document.createElement('img');
    image.src = './static/assets/logo.png';
    image.alt = 'logo-for-real-forum';
    image.classList.add('logo');

    logoDiv.appendChild(image);

    const profileAndAddNewButtonDiv = document.createElement('div');
    profileAndAddNewButtonDiv.id = 'profile-and-add-new-button-div';
    profileAndAddNewButtonDiv.classList.add('hidden');

    const addNewButton = document.createElement('button');
    addNewButton.id = 'add-new-button';
    addNewButton.textContent = 'NEW POST';

    const dropdown = document.createElement('div');
    dropdown.id = 'dropdown';

    profileAndAddNewButtonDiv.appendChild(addNewButton);
    profileAndAddNewButtonDiv.appendChild(dropdown);

    headerSection.appendChild(logoDiv);
    headerSection.appendChild(profileAndAddNewButtonDiv);

    createDropDownMenu();
}

function createDropDownMenu() {
    const dropdown = document.getElementById('dropdown');
    const user = JSON.parse(localStorage.getItem('loggedInUser'))
    if(user) {
        const dropdownToggle = document.createElement('button');
        dropdownToggle.id = 'dropdown-toggle';
        dropdownToggle.classList.add('dropdown-toggle');
        dropdownToggle.textContent = user.username[0];

        const dropdownMenu = document.createElement('div');
        dropdownMenu.classList.add('dropdown-menu');
        dropdownMenu.id = 'dropdown-menu';

        const homeButton = document.createElement('button');
        homeButton.id = 'home-button';
        homeButton.textContent = 'Home';

        const profileButton = document.createElement('button');
        profileButton.id = 'user-profile-button';
        profileButton.textContent = 'Profile';

        const logoutButton = document.createElement('button');
        logoutButton.id = 'logout-button';
        logoutButton.textContent = 'Logout';

        dropdownMenu.appendChild(homeButton);
        dropdownMenu.appendChild(profileButton);
        dropdownMenu.appendChild(logoutButton);

        dropdown.appendChild(dropdownToggle);
        dropdown.appendChild(dropdownMenu);
    }
}
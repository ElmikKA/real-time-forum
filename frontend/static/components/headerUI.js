export function showHeaderSection() {
    const headerSection = document.getElementById('header-section');

    headerSection.innerHTML = `
        <div id="logo-div">
                <img src="./static/assets/logo.png" alt="logo-for-real-forum" class="logo">
            </div>
            <div id="profile-and-add-new-button-div" class="hidden">
                <button id="add-new-button">NEW POST</button>
                <!-- Dropdown Menu -->
                <div class="dropdown" id="dropdown"></div>
            </div>
    `

    createDropDownMenu();
}

function createDropDownMenu() {
    const dropdown = document.getElementById('dropdown');
    const user = JSON.parse(localStorage.getItem('loggedInUser'))
    if(user) {
        dropdown.innerHTML = `
            <button id="dropdown-toggle" class="dropdown-toggle">${user.username[0]}</button>
            <div class="dropdown-menu" id="dropdown-menu">
                <div id="profile-picture-div">
                    <div id>
                    
                    </div>
                </div>
                <button id="home-button">Home</button>
                <button id="user-profile-button">Profile</button>
                <button id="logout-button">Logout</button>
            </div>
        `
    }
}
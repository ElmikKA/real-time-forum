import { getUsers } from "../data.js";



export function showAllUsersAtSidebar() {
    const siderbar = document.getElementById('sidebar')
    const userLists = generateUsersList();
    generateSidebarInnerHTML(siderbar, userLists)
}

function generateSidebarInnerHTML(sidebar, userLists) {
    sidebar.innerHTML = `
        <div class="section">
            <h2>ONLINE</h2>
            <ul>${userLists.online}</ul>
        </div>
        <div class="section">
            <h2>OFFLINE</h2>
            <ul>${userLists.offline}</ul>
        </div>
    `;
}

function generateUsersList() {
    const users = getUsers();
    const onlineUsers = users.filter(user => user.online);
    const offlineUsers = users.filter(user => !user.online);

    const onlineListItems = onlineUsers.map(user => `
        <li><span class="status online"></span><a>${user.nickname}</a></li>
    `).join('');

    const offlineListItems = offlineUsers.map(user => `
        <li><span class="status offline"></span><a>${user.nickname}</a></li>
    `).join('');

    return {
        online: onlineListItems,
        offline: offlineListItems
    };
}
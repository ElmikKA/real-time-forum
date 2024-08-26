import { getUsers } from "../data/data.js";

export function showAllUsersAtSidebar() {
    const siderbar = document.getElementById('sidebar')
    const userLists = generateUsersList();
    generateSidebarContent(siderbar, userLists)
}

function generateSidebarContent(sidebar, userLists) {
    const onlineSection = document.createElement('div');
    onlineSection.classList.add('section');

    const onlineHeader = document.createElement('h2');
    onlineHeader.textContent = 'ONLINE';
    onlineSection.appendChild(onlineHeader);

    const onlineList = document.createElement('ul');
    userLists.online.forEach(userItem => onlineList.appendChild(userItem));
    onlineSection.appendChild(onlineList);

    const offlineSection = document.createElement('div');
    offlineSection.classList.add('section');

    const offlineHeader = document.createElement('h2');
    offlineHeader.textContent = 'OFFLINE';
    offlineSection.appendChild(offlineHeader);

    const offlineList = document.createElement('ul');
    userLists.offline.forEach(userItem => offlineList.appendChild(userItem));
    offlineSection.appendChild(offlineList);

    sidebar.appendChild(onlineSection);
    sidebar.appendChild(offlineSection);
}

function generateUsersList() {
    const users = getUsers();

    const onlineUsers = users.filter(user => user.online);
    const offlineUsers = users.filter(user => !user.online);

    const onlineListItems = onlineUsers.map(user => createUserListItem(user, true));
    const offlineListItems = offlineUsers.map(user => createUserListItem(user, false));

    return {
        online: onlineListItems,
        offline: offlineListItems
    };
}

function createUserListItem(user, isOnline) {
    const listItem = document.createElement('li');
    listItem.classList.add('user');
    listItem.setAttribute('data-username', user.nickname);

    const statusSpan = document.createElement('span');
    statusSpan.classList.add('status', isOnline ? 'online' : 'offline');
    listItem.appendChild(statusSpan);

    const userLink = document.createElement('a');
    userLink.textContent = user.nickname;
    listItem.appendChild(userLink);

    return listItem;
}
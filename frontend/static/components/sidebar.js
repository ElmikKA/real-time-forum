import { MySocket } from '../services/MySocket.js';
import { messengerWindow } from './messengerWindow.js';

let mySocket = null;

export function showAllUsersAtSidebar() {
    if (!mySocket) {
        mySocket = new MySocket();
        mySocket.connectSocket();
    }
}

export function closeWebSocket() {
    if(mySocket) {
        mySocket.closeSocket();
    }
}

export function addWebsocketUsers(usersData) {
    console.log("Adding users", usersData);
    const users = usersData.allUsers;
    
    const onlineUsers = users.filter(user => user.online === "1");
    const offlineUsers = users.filter(user => user.online !== "1");

    const onlineListItems = onlineUsers.map(user => createUserListItem(user, true));
    const offlineListItems = offlineUsers.map(user => createUserListItem(user, false));

    const combinedListItems = onlineListItems.concat(offlineListItems)

    const sidebar = document.getElementById('sidebar');
    generateSidebarContent(sidebar, combinedListItems, users);
}

function generateSidebarContent(sidebar, userLists, users) {
    sidebar.innerHTML = '';

    const usersSection = document.createElement('div');
    usersSection.classList.add('section');

    const usersHeader = document.createElement('h2');
    usersHeader.textContent = 'USERS';
    usersSection.appendChild(usersHeader);

    const usersList = document.createElement('ul');
    usersList.className = 'users-list';
    userLists.forEach(userItem => usersList.appendChild(userItem));
    usersSection.appendChild(usersList);

    sidebar.appendChild(usersSection);

    messengerWindow(sidebar, users, mySocket);
}

function createUserListItem(user, isOnline) {
    const listItem = document.createElement('li');
    listItem.classList.add('user');
    listItem.setAttribute('data-username', user.username);

    const userStatusAndName = document.createElement('div');

    const statusSpan = document.createElement('span');
    statusSpan.classList.add('status', isOnline ? 'online' : 'offline');
    
    const userLink = document.createElement('a');
    userLink.textContent = user.username;

    userStatusAndName.appendChild(statusSpan);
    userStatusAndName.appendChild(userLink);
    listItem.appendChild(userStatusAndName);

    return listItem;
}
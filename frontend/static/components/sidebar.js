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
    console.log(users);

    const onlineUsers = users.filter(user => user.online === "1");
    const offlineUsers = users.filter(user => user.online !== "1");

    const onlineListItems = onlineUsers.map(user => createUserListItem(user, true));
    const offlineListItems = offlineUsers.map(user => createUserListItem(user, false));

    const sidebar = document.getElementById('sidebar');
    generateSidebarContent(sidebar, { online: onlineListItems, offline: offlineListItems }, users);
}

function generateSidebarContent(sidebar, userLists, users) {
    sidebar.innerHTML = '';

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

    messengerWindow(sidebar, users, mySocket);
}

function createUserListItem(user, isOnline) {
    const listItem = document.createElement('li');
    listItem.classList.add('user');
    listItem.setAttribute('data-username', user.username);

    const statusSpan = document.createElement('span');
    statusSpan.classList.add('status', isOnline ? 'online' : 'offline');
    listItem.appendChild(statusSpan);

    const userLink = document.createElement('a');
    userLink.textContent = user.username;
    listItem.appendChild(userLink);

    return listItem;
}
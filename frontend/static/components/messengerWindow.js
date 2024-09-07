import { generateMessengerContainerInnerHTML } from "./dom/messengerWindowUI.js";
import { toggleVisibility } from "../functions/toggleVisibility.js";
import { fetchMessages } from "../services/api.js";

export function messengerWindow(sidebar, users, mySocket) {
    if (sidebar) {
        sidebar.addEventListener('click', async (event) => await handleUserClick(event, users, mySocket));
    }

    initializeMessenger(mySocket);
}

function initializeMessenger(mySocket) {
    generateMessengerContainerInnerHTML();

    const closeMessengerButton = document.getElementById('close-messenger');
    const sendMessageButton = document.getElementById('send-message-button');
    const messengerInput = document.getElementById('messenger-input');

    closeMessengerButton.addEventListener('click', closeMessenger);
    sendMessageButton.addEventListener('click', () => sendMessage(mySocket));
    messengerInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            offset += 1
            sendMessage(mySocket);
        }
    });
}

async function handleUserClick(event, users, mySocket) {
    const userElement = event.target.closest('li.user');
    if (userElement) {
        const username = userElement.getAttribute('data-username');
        await requestMessages(username, users, mySocket);
    }
}

var offset = 0
async function requestMessages(username, users) {
    try {
        const user = users.filter(user => user.username === username);
        if (user) {
            const userId = user[0].id;
            const data = await fetchMessages(userId, offset);
            openChat(data, username, user);
        }
    } catch (error) {
        console.log('Error requesting messages:', error);
    }
}

var messageUserId

export function openChat(data, username, user) {
    offset = 0
    const messengerContainer = document.getElementById('messenger-container');
    const messengerContent = document.getElementById('messenger-content');
    const chatWith = document.getElementById('chat-with');
    const userId = user[0].id;
    checkForNotificationDiv(username);

    chatWith.textContent = `${username}`;
    chatWith.setAttribute('user-id', userId);
    messengerContainer.classList.remove('hidden');
    messengerContainer.classList.add('visible');

    messengerContent.innerHTML = '';
    const chatHistory = data.messages;

    console.log('Chat History', chatHistory)

    if (!chatHistory || chatHistory === null) {
        appendMessage(messengerContent, 'No chats, but it maybe your first today!');
        return;
    } else {
        chatHistory.forEach(messages => {
            const messageSender = userId !== messages.sender_id ? 'user' : 'other';

            appendMessage(messengerContent, messages, messageSender);
        });
    }
    console.log("scrolltop", messengerContent.scrollTop)
    messengerContent.scrollTop = messengerContent.scrollHeight;
    console.log("scrolltop", messengerContent.scrollTop)
    messageUserId = userId

    messengerContent.addEventListener('scroll', requestMoreMessages);
}

function checkForNotificationDiv(username) {
    const sidebarUserDiv = document.querySelector(`li[data-username="${username}"]`);
    const notificationDiv = sidebarUserDiv.querySelector('div.notification-div');
    if(notificationDiv) {
        notificationDiv.remove();
    }
}

async function requestMoreMessages() {
    if (document.getElementById('messenger-content').scrollTop === 0) {
        document.getElementById('messenger-content').removeEventListener('scroll', requestMoreMessages)
    }
    if (document.getElementById('messenger-content').scrollTop <= 50) {
        offset = document.getElementById('messenger-content').getElementsByTagName('div').length
        try {
            const data = await fetchMessages(messageUserId, offset);
            appendChat(data, messageUserId)
        } catch (error) {
            console.log('Error requesting messages:', error);
        }
    }
}

function appendChat(data, userId) {
    const messengerContent = document.getElementById('messenger-content');

    const chatHistory = data.messages;

    if (!chatHistory || chatHistory.length === 0) {
        return;
    } else {
        chatHistory.forEach(messages => {
            const messageSender = userId !== messages.sender_id ? 'user' : 'other';
            appendMessage(messengerContent, messages, messageSender);
        });
    }
}

function appendMessage(container, messages, senderClass = '') {
    const messageElement = document.createElement('div');

    const messageContent = document.createElement('p');
    messageContent.textContent = messages.message;


    const messageDate = document.createElement('span');
    messageDate.classList.add('message-date')
    const messageDateObject = new Date(messages.written_at);
    messageDate.textContent = messageDateObject.toLocaleString();

    messageElement.className = `message ${senderClass}`;

    messageElement.appendChild(messageDate);
    messageElement.appendChild(messageContent);

    container.prepend(messageElement);
}

function sendMessage(mySocket) {
    const messengerInput = document.getElementById('messenger-input');
    const messageText = messengerInput.value.trim();
    if (messageText) {
        mySocket.sendMessage(messageText);
        messengerInput.value = '';
    }
}

function closeMessenger() {
    toggleVisibility('messenger-container', false);
}


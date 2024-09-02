import { generateMessengerContainerInnerHTML } from "./dom/messengerWindowUI.js";
import { toggleVisibility } from "../functions/toggleVisibility.js";
import { fetchMessages } from "../services/api.js";

export function messengerWindow(sidebar, users, mySocket) {
    if (sidebar) {
        sidebar.addEventListener('click', async (event) => await handleUserClick(event, users, mySocket));
    }

    initializeMessenger(mySocket) ;
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
            sendMessage(mySocket);
        }
    });
}

async function handleUserClick(event, users, mySocket) {
    const userElement = event.target.closest('li.user');
    if(userElement) {
        const username = userElement.getAttribute('data-username');
        await requestMessages(username, users, mySocket);
    }
}

async function requestMessages(username, users){
    try {
        const user = users.filter(user => user.username === username);
        if(user) {
            const userId = user[0].id;
            const data = await fetchMessages(userId);
            openChat(data, username, user);
        }
    } catch(error) {
        console.log('Error requesting messages:', error);
    }
}

export function openChat(data, username, user) {
    const messengerContainer = document.getElementById('messenger-container');
    const messengerContent = document.getElementById('messenger-content');
    const chatWith = document.getElementById('chat-with');

    const userId = user[0].id;

    chatWith.textContent = `${username}`;
    chatWith.setAttribute('user-id', userId); 
    messengerContainer.classList.remove('hidden');
    messengerContainer.classList.add('visible');

    messengerContent.innerHTML = '';
    const chatHistory = data.messages;

    if(!chatHistory || chatHistory.length === 0) {
        appendMessage(messengerContent, 'No chats, but it maybe your first today!');
        return;
    } else {
        chatHistory.forEach(messages => {
            const messageSender = userId === messages.sender_id ? 'other' : 'user';
            appendMessage(messengerContent, messages.message, messageSender);
        });
    }
    messengerContent.scrollTop = messengerContent.scrollHeight;
}

function appendMessage(container, message, senderClass = '') {
    const messageElement = document.createElement('div');
        messageElement.textContent = message;
        messageElement.className = `message ${senderClass}`;
        container.appendChild(messageElement);
}

function sendMessage(mySocket) {
    const messengerInput = document.getElementById('messenger-input');
    const messageText = messengerInput.value.trim();
    if(messageText) {
        mySocket.sendMessage(messageText);
    }
}

function closeMessenger() {
    toggleVisibility('messenger-container', false);
}
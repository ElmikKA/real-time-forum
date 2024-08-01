export function messengerWindow() {
    initializeMessenger();
}

function initializeMessenger() {
    const sidebar = document.getElementById('sidebar');

    if (sidebar) {
        sidebar.addEventListener('click', handleUserClick);
    }

    generateMessengerContainerInnerHTML();

    const closeMessengerButton = document.getElementById('close-messenger');
    const sendMessageButton = document.getElementById('send-message-button');
    const messengerInput = document.getElementById('messenger-input');

    closeMessengerButton.addEventListener('click', closeMessenger);
    sendMessageButton.addEventListener('click', sendMessage);
    messengerInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            sendMessage();
        }
    });
}

function handleUserClick(event) {
    if (event.target && event.target.closest('li.user')) {
        const userElement = event.target.closest('li.user');
        const username = userElement.getAttribute('data-username');
        openChat(username);
    }
}

function openChat(username) {
    const messengerContainer = document.getElementById('messenger-container');
    const messengerContent = document.getElementById('messenger-content');
    const chatWith = document.getElementById('chat-with');

    chatWith.textContent = `${username}`;
    messengerContainer.classList.remove('hidden');
    messengerContainer.classList.add('visible');

    // This is for testing
    messengerContent.innerHTML = '';
    const chatHistory = [
        { text: `Welcome to the chat with ${username}!`, sender: 'other' },
        { text: `This is a placeholder message.`, sender: 'other' }
    ];
    chatHistory.forEach(message => {
        const messageElement = document.createElement('div');
        messageElement.textContent = message.text;
        messageElement.className = `message ${message.sender}`;
        messengerContent.appendChild(messageElement);
    });

    messengerContent.scrollTop = messengerContent.scrollHeight; // Scroll to the bottom
}

function sendMessage() {
    const messengerInput = document.getElementById('messenger-input');
    const messengerContent = document.getElementById('messenger-content');

    const messageText = messengerInput.value.trim();
    if (messageText !== '') {
        const messageElement = document.createElement('div');
        messageElement.textContent = messageText;
        messageElement.className = 'message user'; // User's message
        messengerContent.appendChild(messageElement);
        messengerInput.value = '';
        messengerContent.scrollTop = messengerContent.scrollHeight;
    }
}

function closeMessenger() {
    const messengerContainer = document.getElementById('messenger-container');
    messengerContainer.classList.remove('visible');
    messengerContainer.classList.add('hidden');
}

function generateMessengerContainerInnerHTML() {
    const messengerContainer = document.getElementById('messenger-container');
    messengerContainer.innerHTML = `
        <div id="messenger-header">
            <h3 id="chat-with"></h3>
            <button id="close-messenger">&times;</button>
        </div>
        <div id="messenger-content">
            <!-- Chat messages will go here -->
        </div>
        <div id="messenger-input-container">
            <input type="text" id="messenger-input" placeholder="Type a message...">
            <button id="send-message-button">Send</button>
        </div>
    `;
}

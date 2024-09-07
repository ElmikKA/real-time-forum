export function generateMessengerContainerInnerHTML() {
    const messengerContainer = document.getElementById('messenger-container');
    messengerContainer.innerHTML = '';
    const messengerHeader = document.createElement('div');
    messengerHeader.id = 'messenger-header';

    const chatWithHeader = document.createElement('h3');
    chatWithHeader.id = 'chat-with';
    messengerHeader.appendChild(chatWithHeader);

    const closeMessengerButton = document.createElement('button');
    closeMessengerButton.id = 'close-messenger';
    closeMessengerButton.innerHTML = '&times;'; // Close button
    messengerHeader.appendChild(closeMessengerButton);

    const messengerContent = document.createElement('div');
    messengerContent.id = 'messenger-content';

    const inputContainer = document.createElement('div');
    inputContainer.id = 'messenger-input-container';

    const messengerInput = document.createElement('input');
    messengerInput.type = 'text';
    messengerInput.id = 'messenger-input';
    messengerInput.placeholder = 'Type a message...';

    const sendMessageButton = document.createElement('button');
    sendMessageButton.id = 'send-message-button';
    sendMessageButton.textContent = 'Send';

    inputContainer.appendChild(messengerInput);
    inputContainer.appendChild(sendMessageButton);

    messengerContainer.appendChild(messengerHeader);
    messengerContainer.appendChild(messengerContent);
    messengerContainer.appendChild(inputContainer);
}
import { addWebsocketUsers } from "../components/sidebar.js";

export class MySocket {
    constructor() {
        this.mysocket = null;
    }

    connectSocket() {
        console.log("Connecting socket...");
        this.mysocket = new WebSocket('ws://localhost:8080/api/websocket');

        this.mysocket.onopen = () => {
            console.log("Socket connection established.");
            this.fetchUsers();
        };

        this.mysocket.onmessage = (event) => {
            try {
                const responseData = JSON.parse(event.data);
                console.log("Received response:", responseData);

                if (responseData.statusChange) {
                    this.changeOnlineStatues(responseData)
                } else {
                    this.displayNewMessages(responseData);
                }

            } catch (e) {
                console.error("Error parsing JSON:", e);
            }
        };

        this.mysocket.onclose = (event) => {
            if (event.wasClean) {
                console.log("Socket closed cleanly.");
            } else {
                console.log('Connection unexpectedly closed.');
                this.mysocket = null;
            }
        };

        this.mysocket.onerror = (event) => {
            console.error(`WebSocket error:`, event);
        };
    }

    changeOnlineStatues(responseData) {
        const username = responseData.statusChangeUsername;
        const newStatus = responseData.online;

        const userItem = document.querySelector(`li[data-username="${username}"]`);

        if (userItem) {
            const statusSpan = userItem.querySelector('.status');

            if (newStatus === 1) {
                statusSpan.classList.remove('offline');
                statusSpan.classList.add('online');
            } else if (newStatus === -1) {
                statusSpan.classList.remove('online');
                statusSpan.classList.add('offline');
            }
        }
    }

    displayNewMessages(responseData) {
        const messengerContent = document.getElementById('messenger-content');
        const messengerInput = document.getElementById('messenger-input');
        const messageElement = document.createElement('div');
        messageElement.textContent = responseData.message;
        console.log('display message response', responseData)
        const messageSender = responseData.sender_id !== responseData.receiver_id ? 'user' : 'other';
        console.log(messageSender)
        messageElement.className = `message ${messageSender}`;
        messengerContent.appendChild(messageElement);
        // scrolls the message div down only if a new message comes when you're looking at the latest message
        if (messengerContent.scrollHeight - messengerContent.scrollTop < 650) {
            messengerContent.scrollTop = messengerContent.scrollHeight;
        }
    }

    fetchUsers() {
        fetch('/api/getUsers', {
            method: 'GET'
        })
            .then(response => response.json())
            .then(data => {
                addWebsocketUsers(data); // Ensure this function is defined or bound correctly
            })
            .catch(error => console.error("Error fetching users:", error));
    }

    sendMessage(messageText) {
        const chatWith = document.getElementById('chat-with');
        const userId = chatWith.getAttribute('user-id');

        const msgData = {
            message: messageText,
            receiver: parseInt(userId),
        };

        console.log(msgData)

        if (this.mysocket.readyState !== WebSocket.OPEN) {
            console.error('WebSocket is not open. ReadyState:', this.mysocket.readyState);
            return;
        }

        if (messageText !== '') {
            try {
                this.mysocket.send(JSON.stringify(msgData));
                console.log("Message sent:", msgData);

            } catch (error) {
                console.error("Error sending message:", error);
            }
        }
    }

    closeSocket() {
        if (this.mysocket) {
            console.log("Closing socket connection...");
            this.mysocket.close();
            this.mysocket = null;
        }
    }
}
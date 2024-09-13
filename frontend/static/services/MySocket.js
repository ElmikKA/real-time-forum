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

                console.log('Response-data', responseData)

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
        const messageElement = document.createElement('div');
        const chatWithElement = document.getElementById('chat-with');
        const userId = chatWithElement.getAttribute('user-id');

        if(responseData.writer_id === parseInt(userId) || !responseData.receiver) {
            console.log(responseData.writer_id, userId)
            const messageContent = document.createElement('p');
            messageContent.classList.add('message-content');
            messageContent.textContent = responseData.message;
            
            this.addNotificationToMessagesReceiver(responseData)
            const messageSender = responseData.sender_id !== responseData.receiver_id ? 'user' : 'other';

            const messageDate = document.createElement('span');
            messageDate.classList.add('message-date')
            const messageDateObject = new Date(responseData.written_at);
            messageDate.textContent = messageDateObject.toLocaleString();

            messageElement.className = `message ${messageSender}`;

            messageElement.appendChild(messageDate);
            messageElement.appendChild(messageContent);
            messengerContent.appendChild(messageElement);

            // scrolls the message div down only if a new message comes when you're looking at the latest message
            if (messengerContent.scrollHeight - messengerContent.scrollTop < 650) {
                messengerContent.scrollTop = messengerContent.scrollHeight;
            }
        } else {
            this.addNotificationToMessagesReceiver(responseData);
        }

        
    }

    addNotificationToMessagesReceiver(responseData) {
        const isReceiver = responseData.receiver;
        const username = responseData.written_by;
        const writeId = responseData.writer_id;
        if(isReceiver) {
            const sidebarUserDiv = document.querySelector(`li[data-username="${username}"]`);
            const notificationDiv = sidebarUserDiv.querySelector('div.notification-div');
            const messangerContainer = document.getElementById('messenger-container');
            const chatWithElement = document.getElementById('chat-with');
            const userId = chatWithElement.getAttribute('user-id');

            if(messangerContainer.classList.contains('visible') && parseInt(userId) === writeId) {
                return;
            } else if(notificationDiv) {
                let notificationCount = parseInt(notificationDiv.textContent, 10) + 1;
                notificationDiv.textContent = notificationCount;
            } else {
                const notificationDiv = document.createElement('div');
                notificationDiv.classList.add('notification-div');
                notificationDiv.textContent = '1';
                sidebarUserDiv.appendChild(notificationDiv);
            }
        }
    }

    fetchUsers() {
        fetch('/api/getUsers', {
            method: 'GET'
        })
            .then(response => response.json())
            .then(data => {
                addWebsocketUsers(data);
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
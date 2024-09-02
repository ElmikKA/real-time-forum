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
        
                if (responseData.message) {
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
                console.log('Connection unexpectedly closed. Reconnecting...');
                this.mysocket = null;
                setTimeout(() => this.connectSocket(), 5000); // Attempt to reconnect after 5 seconds
            }
        };

        this.mysocket.onerror = (event) => {
            console.error(`WebSocket error:`, event);
        };
    }

    displayNewMessages(responseData) {  
        const messengerContent = document.getElementById('messenger-content');
        const messageElement = document.createElement('div');
        messageElement.textContent = responseData.message;
        messageElement.className = 'message user';
        messengerContent.appendChild(messageElement);
        messengerContent.scrollTop = messengerContent.scrollHeight;
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




    // displayNewMessage(responseData) {
    //     console.log("Displaying message:", responseData);

    //     const messageContainer = document.getElementById('messageContainer');
    //     const msgDiv = messageContainer.querySelector('#messageDiv');

    //     if (responseData.username === responseData.written_by || msgDiv.classList.contains(responseData.written_by)) {
    //         let div = document.createElement('div');
    //         div.textContent = responseData.message;
    //         div.style.float = responseData.receiver ? 'left' : 'right';

    //         msgDiv.appendChild(div);
    //         msgDiv.appendChild(document.createElement('br'));
    //     } else {
    //         console.log("Private message not opened, send a notification. Sent by:", responseData.written_by);
    //         // Add code to send notification (pending)
    //     }
    // }

let mysocket = null

function toggleRegister() {
    const registerDiv = document.getElementById('registerDiv')
    registerDiv.classList.toggle('hidden')
}
function toggleLogin() {
    const loginDiv = document.getElementById('loginDiv')
    loginDiv.classList.toggle('hidden')
}
function togglePost() {
    const postDiv = document.getElementById('postDiv')
    postDiv.classList.toggle('hidden')
}
function toggleComment() {
    const commentDiv = document.getElementById('commentDiv')
    commentDiv.classList.toggle('hidden')
}
function toggleWebsocket() {
    const websocketDiv = document.getElementById('websocketDiv')
    websocketDiv.classList.toggle('hidden')

    if (!mysocket) {
        mysocket = new MySocket()
        mysocket.connectSocket()
    }
}

function addWebsocketUsers(usersData) {
    console.log("adding users", usersData)
    let users = usersData.allUsers

    const websocketDiv = document.getElementById('websocketDiv')
    const container = websocketDiv.querySelector('#websocketContainer')
    const userDiv = container.querySelector('#userDiv')

    for (let i = 0; i < users.length; i++) {
        if (users[i].username !== usersData.username) {

            const div = document.createElement('div')
            div.id = users[i].username
            div.innerHTML = users[i].online === "1" ? "🟢" : "⚪"
            div.innerHTML += users[i].username
            div.onclick = function () {
                openPrivateMessages(users[i].id)
            }
            div.style.border = "solid black"
            div.style.margin = "2px"

            userDiv.appendChild(div)
        }
    }
}

function openPrivateMessages(userId) {

    const messageContainer = document.getElementById('messageContainer')
    const msgDiv = messageContainer.querySelector('#messageDiv')

    msgDiv.classList = userId

    const requestMessage = {
        id: userId,
    }

    fetch('/api/getMessages', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestMessage)
    })
        .then(response => response.json())
        .then(data => {
            console.log(data)
            displayPrivateMessages(data)
        })
        .catch(error => console.log(error))
}


function displayPrivateMessages(data) {
    console.log(data)
    const messageContainer = document.getElementById('messageContainer')
    const msgDiv = messageContainer.querySelector('#messageDiv')
    msgDiv.classList.add(data.messagePartner)
    msgDiv.innerHTML = ""

    let messages = data.messages
    if (messages === null) {
        console.log("no messages")
        msgDiv.innerHTML = ""
        return
    } else {
        for (let i = 0; i < messages.length; i++) {
            let div = document.createElement('div')
            div.innerHTML = messages[i].message
            div.style.float = data.id == messages[i].sender_id ? 'right' : 'left'
            msgDiv.appendChild(div)
            msgDiv.innerHTML += "<br>"
        }
        console.log(messages)
    }
}

class MySocket {
    constructor() {
        this.mysocket = null
    }

    connectSocket() {
        console.log("connecting socket")
        this.mysocket = new WebSocket('ws://localhost:8080/api/websocket')

        this.mysocket.onopen = () => {
            this.fetchUsers()
        }

        this.mysocket.onmessage = (event) => {
            console.log("here")
            try {
                const responseData = JSON.parse(event.data)
                console.log("got response", responseData)
                console.log(responseData.statusChange)

                if (responseData.statusChange) {
                    console.log("change status", responseData)
                    this.changeOnlineStatus(responseData)
                } else {
                    this.displayNewMessage(responseData)
                }
            } catch (e) {
                console.error("error parsing JSON:", e)
            }
        }

        this.mysocket.onclose = (event) => {
            if (event.wasClean) {
                console.log("socket closed")
            } else {
                console.log('connection died')
                mysocket = null
            }
        }

        this.mysocket.onerror = (event) => {
            console.error(`Websocket error: ${event}`)
        }
    }

    changeOnlineStatus(responseData) {
        const websocketDiv = document.getElementById('websocketDiv')
        const container = websocketDiv.querySelector('#websocketContainer')
        const userDiv = container.querySelector('#userDiv')
        const changingUsername = responseData.statusChangeUsername
        let user = userDiv.querySelector('#' + changingUsername)
        user.innerHTML = responseData.online === 1 ? "🟢" : "⚪"
        user.innerHTML += responseData.statusChangeUsername
    }



    displayNewMessage(responseData) {

        // only display if the pm is opened to the right person
        // else send notification (pending)




        console.log("displaying", responseData)
        const messageContainer = document.getElementById('messageContainer')
        const msgDiv = messageContainer.querySelector('#messageDiv')

        if (responseData.username === responseData.written_by || msgDiv.classList.contains(responseData.written_by)) {
            console.log("can print it out")
            let div = document.createElement('div')
            div.innerHTML = responseData.message
            div.style.float = responseData.receiver ? 'left' : 'right'

            msgDiv.appendChild(div)
            msgDiv.innerHTML += "<br>"
        } else {
            console.log("pm not opened, send a notification\nSent by:", responseData.written_by)
            // add code to send notification
        }


    }


    fetchUsers() {
        fetch('/api/getUsers', {
            method: 'GET'
        })
            .then(response => response.json())
            .then(data => {
                addWebsocketUsers(data)
            })
            .catch(error => console.log(error))
    }

    sendMessage() {
        const websocketDiv = document.getElementById('websocketDiv')
        const message = websocketDiv.querySelector('#message').value
        const receiverId = websocketDiv.querySelector('#messageDiv').classList[0]
        // console.log(receiverId)
        var msgData = {
            message: message,
            receiver: parseInt(receiverId),
        }
        // console.log(msgData)

        this.mysocket.send(JSON.stringify(msgData))
    }
}






function registerUser() {

    const registerDiv = document.getElementById('registerDiv')
    const messageDiv = document.getElementById('registerMessage')
    const registerForm = {
        username: registerDiv.querySelector('#username').value,
        age: parseInt(registerDiv.querySelector('#age').value),
        gender: registerDiv.querySelector('#gender').value,
        fname: registerDiv.querySelector('#firstName').value,
        lname: registerDiv.querySelector('#lastName').value,
        email: registerDiv.querySelector('#email').value,
        password: registerDiv.querySelector('#password').value,
    }

    fetch('/api/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(registerForm)
    })
        .then(response => response.json())
        .then(data => {
            if (data["register"] !== "success") {
                messageDiv.innerHTML = data["message"]
            } else {
                toggleRegister()
            }
            console.log(data)
        })
        .catch(error => console.log(error))
}


function login() {
    const loginDiv = document.getElementById('loginDiv')
    const message = document.getElementById('loginMessage')

    const loginCredentials = {
        user: loginDiv.querySelector('#user').value,
        password: loginDiv.querySelector('#password').value,
    }

    fetch('/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginCredentials)
    })
        .then(response => response.json())
        .then(data => {
            if (data["login"] !== "success") {
                message.innerHTML = data["message"]
            } else {
                toggleLogin()
            }
            console.log(data)
        })
        .catch(error => console.log(error))
}

function posts() {
    fetch('/api/posts', {
        method: 'GET'
    })
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.log(error))

}

function onePost(postNum) {
    const requestPost = {
        id: postNum,
    }

    fetch('/api/posts', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestPost)
    })
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.log(error))
}

function createPost() {
    const postDiv = document.getElementById('postDiv')
    const title = postDiv.querySelector('#title').value
    const category = postDiv.querySelector('#category').value
    const content = postDiv.querySelector('#content').value

    const postData = {
        title: title,
        category: category,
        content: content
    }

    fetch('/api/newPost', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(postData)
    })
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.log(error))
}

function createNewComment(postNum) {
    const commentDiv = document.getElementById('commentDiv')
    const commentData = {
        content: commentDiv.querySelector('#content').value,
        post_id: postNum,
    }

    fetch('/api/newComment', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(commentData)
    })
        .then(response => response.json())
        .then(data => {
            console.log(data)
        })
        .catch(error => {
            console.log(error)
        })
}

function changeLike(type, post_id, comment_id, like) {
    const likeData = {
        post: type === "post" ? true : false,
        post_id: post_id,
        comment: type === "comment" ? true : false,
        comment_id: comment_id,
        like: like,
    }

    fetch('/api/changeLikes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(likeData)
    })
        .then(response => response.json())
        .then(data => {
            console.log(data)
        })
        .catch(error => {
            console.log(error)
        })
}

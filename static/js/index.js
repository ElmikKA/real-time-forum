
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

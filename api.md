# /api/register  POST
fetch('/api/register', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(registerForm)
})

registerForm {
    username: string,
    age: int,
    gender: string,
    fname: string,
    lname: string,
    email: string,
    password: string,
}

fetch returns:

returnData {
    register: string, ("success" or "failure")
    message: string,
    user: {
        age: int,
        email: string,
        fname: string,
        lname: string,
        gender: string,
        password: string,
        username: string,
    }
}


# /api/login  POST

fetch('/api/login', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(loginCredentials)
})

loginCredentials {
    user: string, (username or email)
    password: string,
}

fetch returns:

returnData {
    login: string, ("success" or "failure")
    message: string,
}


# /api/posts  GET

fetch('/api/posts', {
    method: 'GET'
})

fetch returns:

returnData {
    posts: string, ("success" or "failure")
    id: int, (logged in user id)
    username: string, (logged in user username)
    loggedIn: bool,
    allPosts: [
        {
            category: string,
            content: string,
            createdAt: string,
            creator: string,
            disliked: bool,
            dislikes: int,
            id: int, (id of the post)
            liked: bool,
            likes: int,
            title: string,
            user_id: int, (post creator's id)
        }
    ],
    post_likes: [
        {
            Like: int, (1 for like, -1 for dislike)
            Post_id: int, (id of the post)
            User_id: int, (id of the user who liked/disliked)
        }
    ],
    
}


# /api/posts  POST

fetch('/api/posts', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestPost)
})

requestPost {
    id: int, (id of the post you want to open up)
}

fetch returns:

returnData {
    username: string, (logged in user username)
    id: int, (logged in user id)
    loggedIn: bool,
    post: string, ("success" or "failure")
    onePost: {
        category: string,
        content: string,
        createdAt: string,
        creator: string,
        disliked: bool,
        dislikes: int,
        id: int, (id of the post)
        liked: bool,
        likes: int,
        title: string,
        user_id: int, (post creator's id)
    }, (data of the opened post)
    post_likes: [
        {
            Like: int, (1 for like, -1 for dislike)
            Post_id: int, (id of the post)
            User_id: int, (id of the user who liked/disliked)
        }
    ],
    comments: [
        {
            content: string,
            createdAt: string,
            creator: string,
            disliked: bool,
            dislikes: int,
            id: int, (id of the comment)
            liked: bool,
            likes: int,
            post_id: int, (id of the post being commented on)
            user_id: int, (id of the commenter)
        }
    ],
    comment_likes: [
        {
            Comment_id: int, (id of the comment being liked/disliked)
            Like: int, (1 or -1 for like/dislike)
            Post_id: int, (id of the post where the comment resides)
            User_id: int, (id of the user who liked/disliked)
        }
    ]
}


# /api/newPost  POST

fetch('/api/newPost', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(postData)
})

postData {
    title: string,
    category: string,
    content: string,
}

fetch returns:

<!-- might not be worth using this. On newpage fetch from /api/posts -->

returnData {
    id: int, (id of the logged in user)
    loggedIn: bool,
    username: string,
    newPost: string, ("success" or "failure")
    postData: {
        category: string,
        content: string,
        <!-- createdAt: string,  does not send -->
        creator: string,
        disliked: bool,
        dislikes: int,
        <!-- id: int, (id of the post)   does not send-->
        liked: bool,
        likes: int,
        title: string,
        user_id: int, (post creator's id)
    }
}


# /api/newComment  POST

fetch('/api/newComment', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(commentData)
})

commentData {
    content: string,
    post_id: id, (id of the post being commented on)
}

fetch returns:

<!-- might not be worth using this. On newpage fetch from /api/posts -->

returnData: {
    id: int, (id of the logged in user)
    username: string, (logged in username)
    loggedIn: bool,
    newComment: string, ("success" or "failure")
    comment: {
            content: string,
            <!-- createdAt: string,  does not send  -->
            creator: string,
            disliked: bool,
            dislikes: int,
            <!-- id: int, (id of the comment)   does not send  -->
            liked: bool,
            likes: int,
            post_id: int, (id of the post being commented on)
            user_id: int, (id of the commenter)
    }
}


# /api/changeLikes  POST

fetch('/api/changeLikes', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(likeData)
})

likeData {
    post: bool, (true if a post is being liked)
    post_id: int, (id of the liked post)
    comment: bool, (true if a comment is being liked)
    comment_id: int, (id of the liked comment)
}

fetch returns:

returnData {
    id: int, (logged in user id)
    username: string, (logged in user username)
    like: string, ("success", or "failure")
    loggedIn: bool,
}
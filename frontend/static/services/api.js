import { hideLoginSection, clearLoginForm, hideRegistrationSection } from "./auth.js";
import { showCustomAlert } from "../components/customAlerts.js";
import { initializePosts } from "../components/posts.js";
import { showAllUsersAtSidebar } from "../components/sidebar.js";
// import { ifLoginSuccessful } from "../components/dom/headerUI.js";

export async function loginFetch(loginCredentials) {
    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginCredentials)
        });

        if (!response.ok) {
            throw new Error(`Server error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Login response:', data);

        if (data.login !== 'success') {
            showCustomAlert(data.message || 'Login failed. Please check your credentials and try again.')
            console.warn('Login failed:', data);
        } else {
            localStorage.clear();
            localStorage.setItem('loggedInUser', JSON.stringify(data.user));
            hideLoginSection();
            await initializePosts();
            showAllUsersAtSidebar();
            clearLoginForm();

            console.log(localStorage)
        }

        return data;

    } catch (error) {
        console.log('Unexpected error durning login:', error);
        showCustomAlert('An unexpected error occurred during login. Please try again.');
    }
}


export async function registerFetch(registerForm) {
    try {
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(registerForm),
        });

        if (!response.ok) {
            throw new Error(`Server error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        if (data.register !== "success") {
            showCustomAlert(data.message || 'Registration failed. Please try again.');
        } else {
            showCustomAlert('Registration was succesful!')
            hideRegistrationSection();
        }

    } catch (error) {
        console.error('Unexpected error during registration:', error);
        showCustomAlert('An unexpected error occurred durning registration. Please try again.');
    }
}

export async function logoutFetch() {
    try {
        const response = await fetch('/api/logout', {
            method: 'POST',
        });
        if (!response.ok) {
            throw new Error(`Server error: ${response.status} ${response.statusText}`);
        }
        localStorage.removeItem('loggedInUser');
        console.log(localStorage)
        console.log('Logout successful:', response);
    } catch (error) {
        console.error('Unexpected error during logout:', error);
        alert('An unexpected error occurred during logout. Please try again.');
    }
}

export async function createNewCommentFetch(commentData) {

    try {
        const response = await fetch('/api/newComment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(commentData)
        });

        if (!response.ok) {
            throw new Error(`Server error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        return data;

    } catch (error) {
        console.error('Unexpected error creating new comment:', error);
        showCustomAlert('An unexpected error occurred while creating new comment. Please try again.');
    }
}

export async function fetchPosts() {
    try {

        const response = await fetch('/api/posts', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Server error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        return data

    } catch (error) {
        console.error('Unexpected error fetching posts:', error);
        showCustomAlert('An unexpected error occurred while fetching posts. Please try again.');
    }
}

export async function fetchPostById(postId) {
    const requestPost = { id: postId };

    try {
        const response = await fetch('/api/posts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestPost)
        });

        if (!response.ok) {
            throw new Error(`Server error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.error('Unexpected error fetching post by ID:', error);
        showCustomAlert('An unexpected error occurred while fetching post by ID. Please try again.');
    }
}

export async function createPostFetch(title, category, content) {
    const newPost = {
        title: title,
        category: category,
        content: content
    };

    try {
        const response = await fetch('/api/newPost', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newPost)
        });

        if (!response.ok) {
            throw new Error(`Server error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        console.log('The post was successfully created:', data);

    } catch (error) {
        console.error('Unexpected error creating the post:', error);
        showCustomAlert('An unexpected error occurred while creating the post. Please try again.');
    }
}

export async function handleLikeDislike(type, post_id, comment_id, like) {
    const likeData = {
        post: type === "post" ? true : false,
        post_id: post_id,
        comment: type === "comment" ? true : false,
        comment_id: comment_id,
        like: like,
    }

    console.log('likeData', likeData)

    try {
        const response = await fetch('/api/changeLikes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(likeData)
        });

        if (!response.ok) {
            throw new Error(`Server error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        return data;

    } catch (error) {
        console.error('Unexpected error handling likes and dislikes:', error);
        showCustomAlert('An unexpected error occurred while handling likes and dislikes. Please try again.');
    }
}

export async function deletePostFetch(id) {
    const postId = {
        id: id
    }

    try {
        const response = await fetch("/api/deletePost", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(postId)
        })

        if (!response.ok) {
            throw new Error(`Server error: ${response.status} ${response.statusText}`);
        }

        console.log("Post deleted")

    } catch (error) {
        console.error('Unexpected error deleting the post:', error);
        showCustomAlert('An unexpected error occurred while deleting the post. Please try again.');
    }
}

export async function fetchMessages(userId, offset) {
    const requestMessage = {
        id: userId,
        offset: offset
    };

    try {
        const response = await fetch('/api/getMessages', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestMessage)
        });

        if (!response.ok) {
            throw new Error(`Server error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        return data;

    } catch (error) {
        console.log('Error fetching messages:', error);
        showCustomAlert('Failed to fetch messages. Please try again later.')
    }
}
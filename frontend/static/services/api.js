import { hideLoginSection, clearLoginForm, showLoginSection, hideRegistrationSection } from "./auth.js";

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
            message.innerHTML = data.message || 'Login failed. Please check your credentials and try again.';
            console.warn('Login failed:', data);
        } else {
            localStorage.setItem('loggedInUser', JSON.stringify(data.user));
            hideLoginSection();
            clearLoginForm();
        }

    } catch (error) {
        if (error.name === 'TypeError') {
            console.error('Network error or CORS issue:', error);
            message.innerHTML = 'Network error. Please check your connection and try again.';
        } else if (error.message.includes('Server error')) {
            console.error('Server responded with an error:', error);
            message.innerHTML = 'Server error. Please try again later.';
        } else {
            console.error('Unexpected error during login:', error);
            message.innerHTML = 'An unexpected error occurred during login. Please try again.';
        }
    }
}

export async function registerFetch (registerForm) {
    const messageDiv = document.getElementById('registerMessage');
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
            messageDiv.innerHTML = data.message || 'Registration failed. Please try again.';
            console.warn('Registration failed:', data);
        } else {
            hideRegistrationSection();
        }

        console.log('Registration response:', data);

    } catch (error) {
        if (error.name === 'TypeError') {
            console.error('Network error or CORS issue:', error);
            messageDiv.innerHTML = 'Network error. Please check your connection and try again.';
        } else if (error.message.includes('Server error')) {
            console.error('Server responded with an error:', error);
            messageDiv.innerHTML = 'Server error. Please try again later.';
        } else {
            console.error('Unexpected error:', error);
            messageDiv.innerHTML = 'An unexpected error occurred. Please try again.';
        }
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

        console.log('Logout successful:', response);

        localStorage.removeItem('loggedInUser');
        showLoginSection();

    } catch (error) {
        if (error.name === 'TypeError') {
            console.error('Network error or CORS issue:', error);
            alert('Network error. Please check your connection and try again.');
        } else if (error.message.includes('Server error')) {
            console.error('Server responded with an error:', error);
            alert('Server error during logout. Please try again later.');
        } else {
            console.error('Unexpected error during logout:', error);
            alert('An unexpected error occurred during logout. Please try again.');
        }
    }
}

// Fetching post information
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
         console.log(data)
         return data
     } catch (error) {
        if (error.name === 'TypeError') {
            console.error('Network error or CORS issue:', error);
            alert('Network error. Please check your connection and try again.');
        } else if (error.message.includes('Server error')) {
            console.error('Server responded with an error:', error);
            alert('Server error. The post could not be created. Please try again later.');
        } else {
            console.error('Unexpected error creating the post:', error);
            alert('An unexpected error occurred while creating the post. Please try again.');
        }
     }
}

export async function createPostFetch(newPostData) {
    try {
        const response = await fetch('/api/newPost', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newPostData)
        });

        if (!response.ok) {
            throw new Error(`Server error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        console.log('The post was successfully created:', data);

    } catch (error) {
        if (error.name === 'TypeError') {
            console.error('Network error or CORS issue:', error);
            alert('Network error. Please check your connection and try again.');
        } else if (error.message.includes('Server error')) {
            console.error('Server responded with an error:', error);
            alert('Server error. The post could not be created. Please try again later.');
        } else {
            console.error('Unexpected error creating the post:', error);
            alert('An unexpected error occurred while creating the post. Please try again.');
        }
    }
}


//TODO
//This dosent add a like to the post
//Need to be fixed
export async function changeLike(type, post_id, comment_id, like) {
    const likeData = {
        post: type === "post" ? true : false,
        post_id: post_id,
        comment: type === "comment" ? true : false,
        comment_id: comment_id,
        like: like,
    }

    try {
        const response = fetch('/api/changeLikes', {
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
        console.log(data)

    } catch (error) {
        if (error.name === 'TypeError') {
            console.error('Network error or CORS issue:', error);
            alert('Network error. Please check your connection and try again.');
        } else if (error.message.includes('Server error')) {
            console.error('Server responded with an error:', error);
            alert('Server error. The post could not be created. Please try again later.');
        } else {
            console.error('Unexpected error creating the post:', error);
            alert('An unexpected error occurred while creating the post. Please try again.');
        }
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
        
    } catch(error) {
        if (error.name === 'TypeError') {
            console.error('Network error or CORS issue:', error);
            alert('Network error. Please check your connection and try again.');
        } else if (error.message.includes('Server error')) {
            console.error('Server responded with an error:', error);
            alert('Server error. The post could not be created. Please try again later.');
        } else {
            console.error('Unexpected error creating the post:', error);
            alert('An unexpected error occurred while creating the post. Please try again.');
        }
    }
}

// export function fetch() {

//     const requestPost = {
//         id: 1,
//     };
    
//     fetch('/api/posts', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(requestPost)
//     })
//     .then(response => {
//         if (!response.ok) {
//             throw new Error('Network response was not ok ' + response.statusText);
//         }
//         return response.json();
//     })
//     .then(data => console.log(data))
//     .catch(error => console.error('Error:', error));
// }
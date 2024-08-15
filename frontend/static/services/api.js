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
             throw new Error('Network response was not ok ' + response.statusText);
         }
         const data = await response.json();
         console.log(data)
         return data
     } catch (error) {
         return console.log('There was a problem fetching posts:', error);
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
        if(!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        console.log('The post was successfully created:', data)
    } catch(error) {
        console.log('There was a problem creating a new post:', error)
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

        if(!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }

        const data = await response.json();
        console.log(data)

    } catch (error) {
        console.error('There was a problem liking the post:', error);
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
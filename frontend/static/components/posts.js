import { createPostFetch, handleLikeDislike, fetchPosts, deletePostFetch, fetchPostById } from "../services/api.js";
import { showCustomConfirm } from "./customAlerts.js"
import { createDashboardPosts, createFullPostDialog, createNewPostDialog } from "./dom/postsUI.js";

const postGridLayout = document.getElementById('post-grid-layout');

export async function initializePosts() {
    const allPostData = await fetchPosts();
    if(!allPostData) {
        return
    }
    const posts = allPostData.allPosts;
    postGridLayout.innerHTML = '';

    if(posts !== undefined) {
        posts.forEach(async post => {
            const postElement = await createDashboardPosts(post, allPostData)
            postElement.addEventListener('click', () => openFullPost(post))
            postGridLayout.appendChild(postElement)
        })
    }
}

async function addPostToUI(post, allPostData) {
    const postElement = await createDashboardPosts(post, allPostData)
    postElement.addEventListener('click', () => openFullPost(post));
    postGridLayout.appendChild(postElement);
}

async function openFullPost(post) {
    const postDialogDiv = document.createElement('div');
    postDialogDiv.classList.add('post-dialog-div');

    const postDialog = document.createElement('dialog');
    postDialog.classList.add('post-dialog');

    const onePost = await fetchPostById(post.id);

    const postContent = createFullPostDialog(onePost, postDialog);
    postDialog.appendChild(postContent);

    postDialogDiv.appendChild(postDialog);

    document.body.appendChild(postDialogDiv);

    requestAnimationFrame(() => {
        postDialog.scrollTop = 0;
    });

    postDialog.showModal();
}

export function openNewPostDialog(allPostData) {

    const createNewPostDialogDiv = document.createElement('div');
    createNewPostDialogDiv.classList.add('create-new-post-dialog-div');

    const addNewPostDialog = document.createElement('dialog');
    addNewPostDialog.classList.add('add-new-post-dialog');
    
    const postContent = createNewPostDialog(addNewPostDialog);
    addNewPostDialog.appendChild(postContent);

    createNewPostDialogDiv.appendChild(addNewPostDialog);
    
    document.body.appendChild(createNewPostDialogDiv);
    addNewPostDialog.showModal();

    const form = postContent.querySelector('#create-post-form');
    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        await createNewPost(form, allPostData);
        addNewPostDialog.close();
        createNewPostDialogDiv.remove();
    });
}

export async function deletePost(postId) {
   showCustomConfirm("Are you sure you want to delete this post?", async (isConfirmed) => {
        if(isConfirmed) {
            await deletePostFetch(postId);

            const postElement = document.querySelector(`[data-post-id='${postId}']`);
            if (postElement) {
                postGridLayout.removeChild(postElement);
            }

            console.log(`Post with ID ${postId} has been deleted.`);
        }
   })
}

async function createNewPost(form, allPostData) {
    const title = form.title.value;
    const category = form.category.value;
    const content = form.content.value;

    await createPostFetch(title, category, content);

    const data = await fetchPosts();
    if (!data) {
        return;
    }
    const posts = data.allPosts;

    const latestPost = posts[posts.length - 1];

    await addPostToUI(latestPost, allPostData);

    form.reset();
}

export async function handleLikeUI(postOrComment, postId, commentId, likeNumber, likeButton) {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    const post = await fetchPostById(postId);

    console.log('it goes here')

    let userHasLiked = false;

    if(postOrComment === 'post') {
        if(post.post_likes !== null) {
            userHasLiked = post.post_likes.some(like => like.User_id === loggedInUser.id && like.Like === 1);
        }
    } else {
        if(post.comment_likes !== null) {
            userHasLiked = post.comment_likes.some(like => like.User_id === loggedInUser.id && like.Comment_id === commentId && like.Like === 1);
        }
    }

    if (userHasLiked) {
        return;
    } else {
        let newLikeCount = parseInt(likeNumber.textContent, 10) + 1;
        console.log(newLikeCount)

        try {
            const response = await handleLikeDislike(postOrComment, postId, commentId, 1);
            console.log(response)

            likeNumber.textContent = newLikeCount;
            if(postOrComment === 'post') {
                likeButton.classList.add('liked');
                likeButton.classList.remove('like-button');
            } else {
                likeButton.classList.add('comment-liked');
                likeButton.classList.remove('comment-like-button');
            }

        } catch (error) {
            console.error('Error liking the post:', error);
        }
    }
}

export async function handleDislikeUI(postOrComment, postId, commentId, dislikeNumber, dislikeButton) {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    const post = await fetchPostById(postId);

    let userHasDisliked = false;

    if(postOrComment === 'post') {
        if(post.post_likes !== null) {
            userHasDisliked = post.post_likes.some(like => like.User_id === loggedInUser.id && like.Like === -1);
        }
    } else {
        if(post.comment_likes !== null) {
            userHasDisliked = post.comment_likes.some(like => like.User_id === loggedInUser.id && like.Comment_id === commentId && like.Like === -1);
        }
    }

    if (userHasDisliked) {
        return;
    } else {
        let newDislikeCount = parseInt(dislikeNumber.textContent, 10) + 1;

        try {
            const response = await handleLikeDislike(postOrComment, postId, commentId, -1);
            console.log(response)

            dislikeNumber.textContent = newDislikeCount;
            if(postOrComment === 'post') {
                dislikeButton.classList.add('disliked');
                dislikeButton.classList.remove('dislike-button');
            } else {
                dislikeButton.classList.add('comment-disliked');
                dislikeButton.classList.remove('comment-dislike-button');
            }
        } catch (error) {
            console.error('Error disliking the post:', error);
        }
    }
}
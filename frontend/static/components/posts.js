import { createPostFetch, changeLike, fetchPosts, deletePostFetch } from "../services/api.js";
import { showCustomConfirm } from "./customAlerts.js"
import { createDashboardPosts, createFullPostDialog, createNewPostDialog } from "./dom/postsUI.js";

const postGridLayout = document.getElementById('post-grid-layout');

export async function initializePosts() {
    const data = await fetchPosts();
    if(!data) {
        return
    }
    const posts = data.allPosts;

    posts.forEach(post => {
        console.log(post)
        const postElement = createDashboardPosts(post)
        postElement.addEventListener('click', () => openFullPost(post))
        postGridLayout.appendChild(postElement)
    })
}

export function addNewPostButtonListener() {
    const addNewPostButton = document.getElementById('add-new-button');
    addNewPostButton.addEventListener('click', () => openNewPostDialog());
}

function addPostToUI(post) {
    const postElement = createDashboardPosts(post)
    postElement.addEventListener('click', () => openFullPost(post));
    postGridLayout.appendChild(postElement);
}

function openFullPost(post) {
    const postDialogDiv = document.createElement('div');
    postDialogDiv.classList.add('post-dialog-div');

    const postDialog = document.createElement('dialog');
    postDialog.classList.add('post-dialog');

    const postContent = createFullPostDialog(post, postDialog);
    postDialog.appendChild(postContent);

    postDialogDiv.appendChild(postDialog);

    document.body.appendChild(postDialogDiv);

    postDialog.showModal();
}

export function openNewPostDialog() {

    const createNewPostDialogDiv = document.createElement('div');
    createNewPostDialogDiv.classList.add('create-new-post-dialog-div');

    const addNewPostDialog = document.createElement('dialog');
    addNewPostDialog.classList.add('add-new-post-dialog');
    
    const postContent = createNewPostDialog(addNewPostDialog);
    addNewPostDialog.appendChild(postContent);

    createNewPostDialogDiv.appendChild(addNewPostDialog);
    //TODO:
    //Add the dialog to the main-content section
    document.body.appendChild(createNewPostDialogDiv);
    addNewPostDialog.showModal();

    const form = postContent.querySelector('#create-post-form');
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        createNewPost(form);
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

async function createNewPost(form) {
    const title = form.title.value;
    const category = form.category.value;
    const content = form.content.value;

    const newPost = {
        title: title,
        category: category,
        content: content
    };

    await createPostFetch(newPost);

    const data = await fetchPosts();
    if (!data) {
        return;
    }
    const posts = data.allPosts;

    const latestPost = posts[posts.length - 1];

    addPostToUI(latestPost);

    form.reset();
}

async function likePost() {
    document.querySelectorAll('.like-dislike-comment').forEach(section => section.addEventListener('click', async (event) => {
        const actionElement = event.target.closest('.like-dislike-comment');
        if (actionElement) {
            event.stopPropagation();
            const actionType = actionElement.getAttribute('data-action');
            const postId = postElement.getAttribute('data-post-id');

            if (actionType === 'like') {
               await changeLike(true, parseInt(postId), 0, 1);
            } 
        }
    }));
}
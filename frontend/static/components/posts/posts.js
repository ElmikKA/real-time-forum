import { createPostFetch, changeLike, fetchPosts, deletePostFetch } from "../../services/api.js";
import { createInnerHTMLForDashboardCard, createInnerHTMLForFullPost, createInnerHTMLForNewPostDialog } from "./postsUI.js";
import { showCustomConfirm } from "../customAlerts.js"

const postGridLayout = document.getElementById('post-grid-layout');

export async function initializePosts() {
    const data = await fetchPosts();
    if(!data) {
        return
    }
    const posts = data.allPosts;

    posts.forEach(post => {
        console.log(post)
        const postElement = displayPostOnDashboard(post)
        postElement.addEventListener('click', () => openFullPost(post))
        postGridLayout.appendChild(postElement)
    })
}

export function addNewPostButtonListener() {
    const addNewPostButton = document.getElementById('add-new-button');
    addNewPostButton.addEventListener('click', () => openNewPostDialog());
}

function addPostToUI(post) {
    const postElement = displayPostOnDashboard(post);
    postElement.addEventListener('click', () => openFullPost(post));
    postGridLayout.appendChild(postElement);
}

function displayPostOnDashboard(postObj) {
    const postLayout = document.createElement('div');
    postLayout.classList.add('card-layout');
    //For likes, dislikes
    postLayout.setAttribute('data-post-id', postObj.id)
    createInnerHTMLForDashboardCard(postLayout, postObj)

    // Add a delete button to the post card
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.classList.add('delete-button');
    deleteButton.addEventListener('click', (event) => {
        event.stopPropagation(); // Prevents the click event from triggering other handlers
        deletePost(postObj.id);
    });

    postLayout.appendChild(deleteButton);

    return postLayout
}

function openFullPost(post) {
    const postDialogDiv = document.createElement('div');
    postDialogDiv.classList.add('post-dialog-div');
    createInnerHTMLForFullPost(postDialogDiv, post)
    //TODO:
    //Add the dialog to the main-content section
    const postDialog = document.querySelector(".post-dialog"); 
    document.body.appendChild(postDialogDiv);
    postDialog.showModal();
}

export function openNewPostDialog() {
    const addNewPostDialog = document.createElement('dialog');
    addNewPostDialog.classList.add('add-new-post-dialog');
    createInnerHTMLForNewPostDialog(addNewPostDialog);
    //TODO:
    //Add the dialog to the main-content section
    document.body.appendChild(addNewPostDialog);
    addNewPostDialog.showModal();

    document.getElementById('create-post-form').addEventListener('submit', (event) => {
        event.preventDefault();
        createNewPost();
        addNewPostDialog.close();
    })
}

async function deletePost(postId) {
   showCustomConfirm("Are you sure you want to delete this post?", async (isConfirmed) => {
        if(isConfirmed) {
            await deletePostFetch(postId);

            // Remove the post from the UI
            const postElement = document.querySelector(`[data-post-id='${postId}']`);
            if (postElement) {
                postGridLayout.removeChild(postElement);
            }

            console.log(`Post with ID ${postId} has been deleted.`);
            }
   })
}

//TODO
//Cant make two new posts starig straight
async function createNewPost() {
    const title = document.getElementById('title').value;
    const category = document.getElementById('description').value;
    const content = document.getElementById('post-text').value;

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
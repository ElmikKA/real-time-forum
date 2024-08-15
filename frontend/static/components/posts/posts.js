import { createPostFetch, changeLike, fetchPosts } from "../../services/api.js";
import { createInnerHTMLForDashboardCard, createInnerHTMLForFullPost, createInnerHTMLForNewPostDialog } from "./postsUI.js";

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
    // fetch();
    // likePost();
    
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
    postLayout.innerHTML = "";
    postLayout.classList.add('card-layout');
    //For likes, dislikes
    postLayout.setAttribute('data-post-id', postObj.id)
    createInnerHTMLForDashboardCard(postLayout, postObj)
    return postLayout
}

function openFullPost(post) {
    const postDialog = document.createElement('dialog');
    postDialog.classList.add('post-dialog');
    createInnerHTMLForFullPost(postDialog, post)
    //TODO:
    //Add the dialog to the main-content section
    document.body.appendChild(postDialog);
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

function deletePost() {
    
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

    // Post the new post to the server
    await createPostFetch(newPost);

    // Fetch the latest posts
    const data = await fetchPosts();
    if (!data) {
        return;
    }
    const posts = data.allPosts;

    // Assuming the latest post is at the end of the array
    const latestPost = posts[posts.length - 1];

    // Add the latest post to the UI
    addPostToUI(latestPost);
}

function likePost() {
    document.querySelectorAll('.like-dislike-comment').forEach(section => section.addEventListener('click', (event) => {
        const actionElement = event.target.closest('.like-dislike-comment');
        if (actionElement) {
            event.stopPropagation();
            const actionType = actionElement.getAttribute('data-action');
            const postId = postElement.getAttribute('data-post-id');

            if (actionType === 'like') {
                changeLike(true, parseInt(postId), 0, 1);
            } 
        }
    }));
}
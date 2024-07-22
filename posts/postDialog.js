import { addPost } from "../data.js";
import { addPostToUI } from "./postUI.js";

export function openFullPost(post) {
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

    document.getElementById('create-post-form').addEventListener('submit', function(event) {
        event.preventDefault();
        createNewPost();
        addNewPostDialog.close();
    })
}

function createNewPost() {
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const postText = document.getElementById('post-text').value;
    //Willl change later when backend is ready
    const profileName = 'Karl Elmik';

    const newPost = {
        profileName: profileName,
        title: title,
        description: description, 
        postText: postText,
    }

    addPost(newPost)
    addPostToUI(newPost)
}

function createInnerHTMLForNewPostDialog(addNewPostDialog) {
    addNewPostDialog.innerHTML = `
        <div class="create-new-post-container">
            <h2>Create New Post</h2>
            <button class="close-dialog-button" onclick="this.closest('dialog').close()">X</button>
            <form id="create-post-form">
                <label for="title">Title</label>
                <input type="text" id="title" name="title" required>

                <label for="post-text">Description</label>
                <input type="text" id="description" name="description" required>

                <label for="description">Post Text</label>
                <textarea id="post-text" name="post-text" rows="4" required></textarea>

                <button type="submit">Create New Post</button>
            </form>
        </div>
    `
}

function createInnerHTMLForFullPost(postDialog, post) {
    //TODO
    //There need to be a comment section, likes and dislikes as well
    postDialog.innerHTML = `
        <div class="post-dialog-content">
            <div class="author-and-close-button">
                <div class='profile-picture-and-name'>
                    <div class="profile-picture-on-post">
                        <p>${post.profileName[0]}</p>
                    </div>
                    <h2>${post.profileName}</h2>
                </div>
                <button class="close-dialog-button" onclick="this.closest('dialog').close()">X</button>
            </div> 
            <h1 class="post-title">${post.title}</h1>
            <p>${post.postText}</p>
        </div>
    `;
}
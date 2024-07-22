import { getPosts } from "../data.js";
import { openNewPostDialog, openFullPost } from "./postDialog.js";

const postGridLayout = document.getElementById('post-grid-layout');
const addNewPostButton = document.getElementById('add-new-button');

export function initializePosts() {
    const posts = getPosts();
    posts.forEach(post => {
        const postElement = displayPostOnDashboard(post)
        postElement.addEventListener('click', () => openFullPost(post))
        postGridLayout.appendChild(postElement)
    })
}

export function addNewPostButtonListener() {
    addNewPostButton.addEventListener('click', () => openNewPostDialog());
}

export function addPostToUI(post) {
    const postElement = displayPostOnDashboard(post);
    postElement.addEventListener('click', () => openFullPost(post));
    postGridLayout.appendChild(postElement);
}

function displayPostOnDashboard(postObj) {
    const postLayout = document.createElement('div');
    postLayout.classList.add('post-layout');
    createInnerHTMLForDashboardPost(postLayout, postObj)
    return postLayout
}

function createInnerHTMLForDashboardPost(postLayout, postObj) {
    postLayout.innerHTML = `
        <div class="show-profile">
            <div class="profile-picture-on-post">
                <p>${postObj.profileName[0]}</p>
            </div>
            <h2 class="profile-name">${postObj.profileName}</h2>
        </div>
        <div class="title-div">
            <h1>${postObj.title}</h1>
        </div>
        <div class="description-div">
            <h3 class="short-descriptsion-for-post">
                ${postObj.description}
            </h3>
        </div>
        <div class="like-dislike-comment-section">
            <img src="/src/img/Like.png" class="like-img">
            <span>0</span>
            <img src="/src/img/Dislike.png" class="dislike-img">
            <img src="/src/img/Comment.png" class="comment-img">
        </div>
    `;
}
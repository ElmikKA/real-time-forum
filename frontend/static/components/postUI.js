import { getPosts } from "../data/data.js";
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
    postLayout.classList.add('card-layout');
    createInnerHTMLForDashboardCard(postLayout, postObj)
    return postLayout
}

//TODO
//Add the like, dislike, comment numbers, or do you want to add it anyways? 
function createInnerHTMLForDashboardCard(postLayout, postObj) {
    postLayout.innerHTML = `
        <div class="show-profile">
            <div class="profile-picture-on-card">
                <p>${postObj.profileName[0]}</p>
            </div>
            <h2 class="profile-name">${postObj.profileName}</h2>
        </div>
        <div class="title-div">
            <h1>${postObj.title}</h1>
        </div>
        <div class="description-div">
            <h3 class="short-descriptsion-for-card">
                ${postObj.description}
            </h3>
        </div>
        <div class="like-dislike-comment-section">

            <div class="like-dislike-comment">
                <div class="like-button-div">
                    <span class="like-button"></span>
                </div>
                <span id="like-number" class="">12</span>
            </div>

            <div class="like-dislike-comment">
                <div class="dislike-button-div">
                    <span class="dislike-button"></span>
                </div>
                <span id="dislike-number" class="">2</span>
            </div>

            <div class="like-dislike-comment">
                <div class="comment-button-div">
                    <span class="comment-button"></span>
                </div>
                <span id="comment-number" class="">7</span>
            </div>
        </div>
    `;
}
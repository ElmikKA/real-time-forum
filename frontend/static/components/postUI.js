const postGridLayout = document.getElementById('post-grid-layout');
const addNewPostButton = document.getElementById('add-new-button');

export function initializePosts() {
    getAllPosts();
}

async function getAllPosts() {
    const data = await fetchPosts();
    if(!data) {
        return
    }
    const posts = data.allPosts;

    posts.forEach(post => {
        const postElement = displayPostOnDashboard(post)
        postElement.addEventListener('click', () => openFullPost(post))
        postGridLayout.appendChild(postElement)
    })
}

export function addNewPostButtonListener() {
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
            <span class="close-dialog-button" onclick="this.closest('dialog').close()">&times;</span>
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
                    <div class="profile-picture-on-card">
                        <p>${post.creator[0]}</p>
                    </div>
                    <h2>${post.creator}</h2>
                </div>
                <span class="close-dialog-button" onclick="this.closest('dialog').close()">&times;</span>
            </div> 
            <h1 class="post-title">${post.title}</h1>
            <p>${post.content}</p>
        </div>
    `;
}

//TODO
//Add the like, dislike, comment numbers, or do you want to add it anyways? 
function createInnerHTMLForDashboardCard(postLayout, postObj) {
    postLayout.innerHTML = `
        <div class="show-profile">
            <div class="profile-picture-on-card">
                <p>${postObj.creator[0]}</p>
            </div>
            <h2 class="profile-name">${postObj.creator}</h2>
        </div>
        <div class="title-div">
            <h1>${postObj.title}</h1>
        </div>
        <div class="description-div">
            <h3 class="short-descriptsion-for-card">
                ${postObj.category}
            </h3>
        </div>
        <div class="like-dislike-comment-section">

            <div class="like-dislike-comment">
                <div class="like-button-div">
                    <span class="like-button"></span>
                </div>
                <span id="like-number" class="">${postObj.likes}</span>
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

async function fetchPosts() {
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
         return data
     } catch (error) {
         return console.log('There was a problem fetching posts:', error);
     }
 }
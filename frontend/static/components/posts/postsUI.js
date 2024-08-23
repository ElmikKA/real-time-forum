export function createInnerHTMLForNewPostDialog(addNewPostDialog) {
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

export function createInnerHTMLForFullPost(postDialog, post) {
    //TODO
    //There need to be a comment section, likes and dislikes as well
    postDialog.innerHTML = `
        <dialog class="post-dialog">
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

                <div class="comment-section">
                    <h3>Comments</h3>
                    <div class="comment-line"></div>
                    <div id="comments-list">

                    
                        <div class="comment" data-comment-id="1">
                            <div class="comment-author">Meelis Maalt</div>
                            <div class="comment-content">See on ikka raju postitus!</div>
                            <div class="like-dislike-comment-section">
                                <div class="like-dislike-comment" data-action="like" data-comment-id="1">
                                    <span class="like-button"></span>
                                    <span class="like-count">3</span>
                                </div>
                                <div class="like-dislike-comment" data-action="dislike" data-comment-id="1">
                                    <span class="dislike-button"></span>
                                    <span class="dislike-count">0</span>
                                </div>
                            </div>
                        </div>
                    
                        
                    </div>
                    <div class="new-comment">
                        <input type="text" id="new-comment-text" placeholder="Add a comment...">
                        <button id="add-comment-button">Comment</button>
                    </div>
                </div>
            </div>
        </dialog>
    `;
}
// ${post.comments.map(comment => `
//     <div class="comment" data-comment-id="${comment.id}">
//         <div class="comment-author">${comment.author}</div>
//         <div class="comment-content">${comment.content}</div>
//         <div class="like-dislike-comment-section">
//             <div class="like-dislike-comment" data-action="like" data-comment-id="${comment.id}">
//                 <span class="like-button"></span>
//                 <span class="like-count">${comment.likes}</span>
//             </div>
//             <div class="like-dislike-comment" data-action="dislike" data-comment-id="${comment.id}">
//                 <span class="dislike-button"></span>
//                 <span class="dislike-count">${comment.dislikes}</span>
//             </div>
//         </div>
//     </div>
// `).join('')}

//TODO
//Add the like, dislike, comment numbers, or do you want to add it anyways? 
export function createInnerHTMLForDashboardCard(postLayout, post) {
    postLayout.innerHTML = `
        <div class="show-profile">
            <div class="profile-picture-on-card">
                <p>${post.creator[0]}</p>
            </div>
            <h2 class="profile-name">${post.creator}</h2>
        </div>
        <div class="title-div">
            <h1>${post.title}</h1>
        </div>
        <div class="like-dislike-comment-section">

            <div class="like-dislike-comment" data-action="like">
                <div class="like-button-div">
                    <span class="like-button" id="like-button"></span>
                </div>
                <span id="like-number" class="">${post.likes}</span>
            </div>

            <div class="like-dislike-comment">
                <div class="dislike-button-div">
                    <span class="dislike-button"></span>
                </div>
                <span id="dislike-number" class="">${post.dislikes}</span>
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




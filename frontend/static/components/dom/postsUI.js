import { deletePost } from "../posts.js";

export function createDashboardPosts(post) {
    //layout for posts
    const postLayout = document.createElement('div');
    postLayout.classList.add('card-layout');
    postLayout.setAttribute('data-post-id', post.id);

    //profile section
    const showProfileDiv = document.createElement('div');
    showProfileDiv.classList.add('show-profile');

    const profilePictureDiv = document.createElement('div');
    profilePictureDiv.classList.add('profile-picture-on-card');

    const profilePictureText = document.createElement('p');
    profilePictureText.textContent = post.creator[0];
    profilePictureDiv.appendChild(profilePictureText);

    const profileName = document.createElement('h2');
    profileName.classList.add('profile-name');
    profileName.textContent = post.creator;

    showProfileDiv.appendChild(profilePictureDiv);
    showProfileDiv.appendChild(profileName);

    // title section
    const titleDiv = document.createElement('div');
    titleDiv.classList.add('title-div');

    const title = document.createElement('h1');
    title.textContent = post.title;
    titleDiv.appendChild(title);

    // like/dislike/comment section
    const likeDislikeCommentSection = document.createElement('div');
    likeDislikeCommentSection.classList.add('like-dislike-comment-section');

    // like button
    const likeDiv = document.createElement('div');
    likeDiv.classList.add('like-dislike-comment');
    likeDiv.setAttribute('data-action', 'like');

    const likeButtonDiv = document.createElement('div');
    likeButtonDiv.classList.add('like-button-div');

    const likeButton = document.createElement('span');
    likeButton.classList.add('like-button');
    likeButton.id = 'like-button';
    likeButtonDiv.appendChild(likeButton);

    const likeNumber = document.createElement('span');
    likeNumber.id = 'like-number';
    likeNumber.textContent = post.likes;

    likeDiv.appendChild(likeButtonDiv);
    likeDiv.appendChild(likeNumber);

    // dislike button
    const dislikeDiv = document.createElement('div');
    dislikeDiv.classList.add('like-dislike-comment');

    const dislikeButtonDiv = document.createElement('div');
    dislikeButtonDiv.classList.add('dislike-button-div');

    const dislikeButton = document.createElement('span');
    dislikeButton.classList.add('dislike-button');
    dislikeButtonDiv.appendChild(dislikeButton);

    const dislikeNumber = document.createElement('span');
    dislikeNumber.id = 'dislike-number';
    dislikeNumber.textContent = post.dislikes;

    dislikeDiv.appendChild(dislikeButtonDiv);
    dislikeDiv.appendChild(dislikeNumber);

    //comment button
    const commentDiv = document.createElement('div');
    commentDiv.classList.add('like-dislike-comment');

    const commentButtonDiv = document.createElement('div');
    commentButtonDiv.classList.add('comment-button-div');

    const commentButton = document.createElement('span');
    commentButton.classList.add('comment-button');
    commentButtonDiv.appendChild(commentButton);

    const commentNumber = document.createElement('span');
    commentNumber.id = 'comment-number';
    commentNumber.textContent = '7'; // TODO: replace '7' with the actual comment count if dynamic

    commentDiv.appendChild(commentButtonDiv);
    commentDiv.appendChild(commentNumber);

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.classList.add('delete-button');
    deleteButton.addEventListener('click', (event) => {
        event.stopPropagation();
        deletePost(post.id);
    });

    likeDislikeCommentSection.appendChild(likeDiv);
    likeDislikeCommentSection.appendChild(dislikeDiv);
    likeDislikeCommentSection.appendChild(commentDiv);

    postLayout.appendChild(showProfileDiv);
    postLayout.appendChild(titleDiv);
    postLayout.appendChild(likeDislikeCommentSection);
    postLayout.appendChild(deleteButton);

    return postLayout;
}

export function createFullPostDialog(post, postDialog) {
   
    const postDialogContent = document.createElement('div');
    postDialogContent.classList.add('post-dialog-content');

    //author and close button section
    const authorAndCloseDiv = document.createElement('div');
    authorAndCloseDiv.classList.add('author-and-close-button');

    const profileAndNameDiv = document.createElement('div');
    profileAndNameDiv.classList.add('profile-picture-and-name');

    const profilePictureDiv = document.createElement('div');
    profilePictureDiv.classList.add('profile-picture-on-card');

    const profileInitial = document.createElement('p');
    profileInitial.textContent = post.creator[0];
    profilePictureDiv.appendChild(profileInitial);

    const creatorName = document.createElement('h2');
    creatorName.classList.add('profile-name');
    creatorName.textContent = post.creator;

    profileAndNameDiv.appendChild(profilePictureDiv);
    profileAndNameDiv.appendChild(creatorName);

    const closeButton = document.createElement('span');
    closeButton.classList.add('close-dialog-button');
    closeButton.innerHTML = '&times;';
    closeButton.addEventListener('click', (event) => {
        closeDialog(postDialog)
    })

    authorAndCloseDiv.appendChild(profileAndNameDiv);
    authorAndCloseDiv.appendChild(closeButton);

    //post title
    const postTitle = document.createElement('h1');
    postTitle.classList.add('post-title');
    postTitle.textContent = post.title;

    //post content
    const postContent = document.createElement('p');
    postContent.textContent = post.content;

    //comment section
    const commentSection = document.createElement('div');
    commentSection.classList.add('comment-section');

    const commentHeader = document.createElement('h3');
    commentHeader.textContent = 'Comments';

    const commentLine = document.createElement('div');
    commentLine.classList.add('comment-line');

    const commentsList = document.createElement('div');
    commentsList.id = 'comments-list';

    const commentElement = createCommentElement();
    commentsList.appendChild(commentElement);

    const newCommentDiv = document.createElement('div');
    newCommentDiv.classList.add('new-comment');

    const newCommentInput = document.createElement('input');
    newCommentInput.type = 'text';
    newCommentInput.id = 'new-comment-text';
    newCommentInput.placeholder = 'Add a comment...';

    const addCommentButton = document.createElement('button');
    addCommentButton.id = 'add-comment-button';
    addCommentButton.textContent = 'Comment';
    addCommentButton.addEventListener('click', () => {
        //logic here
    });

    newCommentDiv.appendChild(newCommentInput);
    newCommentDiv.appendChild(addCommentButton);

    commentSection.appendChild(commentHeader);
    commentSection.appendChild(commentLine);
    commentSection.appendChild(commentsList);
    commentSection.appendChild(newCommentDiv);

    postDialogContent.appendChild(authorAndCloseDiv);
    postDialogContent.appendChild(postTitle);
    postDialogContent.appendChild(postContent);
    postDialogContent.appendChild(commentSection);

    return postDialogContent;
}

function createCommentElement(comment) {
    const commentDiv = document.createElement('div');
    commentDiv.classList.add('comment');
    commentDiv.setAttribute('data-comment-id', 1);

    const commentAuthor = document.createElement('div');
    commentAuthor.classList.add('comment-author');
    commentAuthor.textContent = 'Meelis Maalt';

    const commentContent = document.createElement('div');
    commentContent.classList.add('comment-content');
    commentContent.textContent = 'See on ikka raju postitus!';

    const likeDislikeSection = document.createElement('div');
    likeDislikeSection.classList.add('like-dislike-comment-section');

    const likeDiv = document.createElement('div');
    likeDiv.classList.add('like-dislike-comment');
    likeDiv.setAttribute('data-action', 'like');

    const likeButtonDiv = document.createElement('div');
    likeButtonDiv.classList.add('like-button-div');

    const likeButton = document.createElement('span');
    likeButton.classList.add('like-button');
    likeButtonDiv.appendChild(likeButton);

    const likeCount = document.createElement('span');
    likeCount.classList.add('like-count');
    likeCount.textContent = 2;

    likeDiv.appendChild(likeButtonDiv);
    likeDiv.appendChild(likeCount);

    const dislikeDiv = document.createElement('div');
    dislikeDiv.classList.add('like-dislike-comment');
    dislikeDiv.setAttribute('data-action', 'dislike');

    const dislikeButtonDiv = document.createElement('div');
    dislikeButtonDiv.classList.add('dislike-button-div');

    const dislikeButton = document.createElement('span');
    dislikeButton.classList.add('dislike-button');
    dislikeButtonDiv.appendChild(dislikeButton);

    const dislikeCount = document.createElement('span');
    dislikeCount.classList.add('dislike-count');
    dislikeCount.textContent = 0;

    dislikeDiv.appendChild(dislikeButtonDiv);
    dislikeDiv.appendChild(dislikeCount);

    likeDislikeSection.appendChild(likeDiv);
    likeDislikeSection.appendChild(dislikeDiv);

    commentDiv.appendChild(commentAuthor);
    commentDiv.appendChild(commentContent);
    commentDiv.appendChild(likeDislikeSection);

    return commentDiv;
}

export function createNewPostDialog(dialogElement) {
    const dialogContainer = document.createElement('div');
    dialogContainer.classList.add('create-new-post-container');

    // header and close button section
    const headerAndCloseDiv = document.createElement('div');
    headerAndCloseDiv.classList.add('header-and-close-button');

    const headerTitle = document.createElement('h2');
    headerTitle.textContent = 'Create New Post';

    const closeButton = document.createElement('span');
    closeButton.classList.add('close-dialog-button');
    closeButton.innerHTML = '&times;';
    closeButton.addEventListener('click', () => {
        closeDialog(dialogElement);
    });

    headerAndCloseDiv.appendChild(headerTitle);
    headerAndCloseDiv.appendChild(closeButton);

    // form element
    const form = document.createElement('form');
    form.id = 'create-post-form';

    // title input
    const titleLabel = document.createElement('label');
    titleLabel.setAttribute('for', 'title');
    titleLabel.textContent = 'Title';

    const titleInput = document.createElement('input');
    titleInput.type = 'text';
    titleInput.id = 'title';
    titleInput.name = 'title';
    titleInput.required = true;

    // category input
    const categoryLabel = document.createElement('label');
    categoryLabel.setAttribute('for', 'category');
    categoryLabel.textContent = 'Category';

    const categoryInput = document.createElement('input');
    categoryInput.type = 'text';
    categoryInput.id = 'category';
    categoryInput.name = 'category';

    // content textarea
    const contentLabel = document.createElement('label');
    contentLabel.setAttribute('for', 'content');
    contentLabel.textContent = 'Content';

    const contentTextarea = document.createElement('textarea');
    contentTextarea.id = 'content';
    contentTextarea.name = 'content';
    contentTextarea.rows = 4;
    contentTextarea.required = true;

    // submit button
    const submitButton = document.createElement('button');
    submitButton.type = 'submit';
    submitButton.textContent = 'Create New Post';

    form.appendChild(titleLabel);
    form.appendChild(titleInput);
    form.appendChild(categoryLabel);
    form.appendChild(categoryInput);
    form.appendChild(contentLabel);
    form.appendChild(contentTextarea);
    form.appendChild(submitButton);

    dialogContainer.appendChild(headerAndCloseDiv);
    dialogContainer.appendChild(form);

    return dialogContainer;
}

function closeDialog(dialogElement) {
    const postDialogDiv = dialogElement.parentElement; 
    dialogElement.close();
    postDialogDiv.remove();
}




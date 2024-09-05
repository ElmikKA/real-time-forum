import { deletePost, handleDislikeUI, handleLikeUI } from "../posts.js";
import { createNewCommentFetch} from "../../services/api.js";
import { showCustomAlert } from "../customAlerts.js";
import { fetchPostById } from "../../services/api.js";

export async function createDashboardPosts(post, allPostData) {
    const user = JSON.parse(localStorage.getItem('loggedInUser'));

    const onePost = await fetchPostById(post.id);

    const postLayout = document.createElement('div');
    postLayout.classList.add('card-layout');
    postLayout.setAttribute('data-post-id', post.id);

    const showProfileDiv = document.createElement('div');
    showProfileDiv.classList.add('show-profile');

    const profileNameAndPictureDiv = document.createElement('div');
    profileNameAndPictureDiv.className = 'profile-picture-and-name-div';

    const profilePictureDiv = document.createElement('div');
    profilePictureDiv.classList.add('profile-picture-on-card');

    const profilePictureText = document.createElement('p');
    profilePictureText.textContent = post.creator[0];
    profilePictureDiv.appendChild(profilePictureText);

    const profileName = document.createElement('h2');
    profileName.classList.add('profile-name');
    profileName.textContent = post.creator;

    profileNameAndPictureDiv.appendChild(profilePictureDiv);
    profileNameAndPictureDiv.appendChild(profileName);

    const postMenuDiv = document.createElement('div')
    postMenuDiv.className = 'post-menu-div';

    const postMenuButton = document.createElement('span')
    postMenuButton.classList.add('post-menu-button');

    const postMenuView = createPostDropDownMenu(post, user); 

    postMenuDiv.appendChild(postMenuButton)
    postMenuDiv.appendChild(postMenuView);

    postMenuDiv.addEventListener('click', (event) => {
        event.stopPropagation();
        postMenuView.classList.toggle('hidden');
    })

    document.addEventListener('click', (event) => {
        if (!postMenuDiv.contains(event.target)) {
            postMenuView.classList.add('hidden');
        }
    });

    showProfileDiv.appendChild(profileNameAndPictureDiv);
    showProfileDiv.appendChild(postMenuDiv);

    const titleDiv = document.createElement('div');
    titleDiv.classList.add('title-div');

    const title = document.createElement('h1');
    title.textContent = post.title;
    titleDiv.appendChild(title);

    const likeDislikeCommentSection = document.createElement('div');
    likeDislikeCommentSection.classList.add('like-dislike-comment-section');

    const likeDiv = document.createElement('div');
    likeDiv.classList.add('like-dislike-comment');
    likeDiv.setAttribute('data-action', 'like');

    const likeButtonDiv = document.createElement('div');
    likeButtonDiv.classList.add('like-button-div');

    const likeButton = document.createElement('span');
    let userHasLiked = false;

    if(allPostData.post_likes !== null) {
        userHasLiked = allPostData.post_likes.some(like => like.User_id === user.id && like.Post_id === post.id && like.Like === 1);
    }

    if(userHasLiked) {
        likeButton.style.pointerEvents = 'none';
        likeButton.classList.add('liked');
    } else {
        likeButton.classList.add('like-button');
        likeButton.id = 'like-button';
    }
    
    likeButtonDiv.appendChild(likeButton);

    const likeNumber = document.createElement('span');
    likeNumber.id = 'like-number';
    likeNumber.textContent = post.likes;

    likeDiv.addEventListener('click', async (event) => {
        event.preventDefault();
        event.stopPropagation();
        if(dislikeButton.classList.contains('disliked')) {
            dislikeButton.classList.remove('disliked');
            dislikeButton.classList.add('dislike-button');
            let newDislikeCount = parseInt(dislikeNumber.textContent, 10) - 1;
            dislikeNumber.textContent = newDislikeCount;
        }
        await handleLikeUI('post', post.id, 0, likeNumber, likeButton);
    });

    likeDiv.appendChild(likeButtonDiv);
    likeDiv.appendChild(likeNumber);

    const dislikeDiv = document.createElement('div');
    dislikeDiv.classList.add('like-dislike-comment');

    const dislikeButtonDiv = document.createElement('div');
    dislikeButtonDiv.classList.add('dislike-button-div');

    const dislikeButton = document.createElement('span');
    let userHasDisliked = false;

    if(allPostData.post_likes !== null) {
        userHasDisliked = allPostData.post_likes.some(like => like.User_id === user.id && like.Post_id === post.id && like.Like === -1);
    }

    if(userHasDisliked) {
        dislikeButton.style.pointerEvents = 'none';
        dislikeButton.classList.add('disliked');
    } else {
        dislikeButton.classList.add('dislike-button');
        dislikeButton.id = 'dislike-button';
    }

    dislikeButtonDiv.appendChild(dislikeButton);

    const dislikeNumber = document.createElement('span');
    dislikeNumber.id = 'dislike-number';
    dislikeNumber.textContent = post.dislikes;


    dislikeDiv.addEventListener('click', async(event) => {
        event.preventDefault();
        event.stopPropagation();
        if(likeButton.classList.contains('liked')) {
            likeButton.classList.remove('liked');
            likeButton.classList.add('like-button');
            let newLikeCount = parseInt(likeNumber.textContent, 10) -1;
            likeNumber.textContent = newLikeCount;
        }
        await handleDislikeUI('post', post.id, 0, dislikeNumber, dislikeButton);
    })

    dislikeDiv.appendChild(dislikeButtonDiv);
    dislikeDiv.appendChild(dislikeNumber);

    const commentDiv = document.createElement('div');
    commentDiv.classList.add('like-dislike-comment');

    const commentButtonDiv = document.createElement('div');
    commentButtonDiv.classList.add('comment-button-div');

    const commentButton = document.createElement('span');
    commentButton.classList.add('comment-button');
    commentButtonDiv.appendChild(commentButton);

    console.log(onePost.comments.length)

    const commentNumber = document.createElement('span');
    commentNumber.id = 'comment-number';
    commentNumber.textContent = onePost.comments.length; // TODO: replace '7' with the actual comment count

    commentDiv.appendChild(commentButtonDiv);
    commentDiv.appendChild(commentNumber);

    likeDislikeCommentSection.appendChild(likeDiv);
    likeDislikeCommentSection.appendChild(dislikeDiv);
    likeDislikeCommentSection.appendChild(commentDiv);

    postLayout.appendChild(showProfileDiv);
    postLayout.appendChild(titleDiv);
    postLayout.appendChild(likeDislikeCommentSection);

    return postLayout;
}

function createPostDropDownMenu(post, user) {
    const postMenu = document.createElement('div');
    postMenu.classList.add('post-dropdown-menu', 'hidden');90

    const deleteButton = document.createElement('button');
    deleteButton.classList.add('delete-button');
    deleteButton.textContent = 'Delete Post';
    deleteButton.addEventListener('click', async (event) => {
        if(post.user_id === user.id) {
                event.stopPropagation();
                await deletePost(post.id);
                postMenu.classList.add('hidden');
            } else {
                showCustomAlert('You can \'t delete this post. You need to be user that created this post to delete it.')
            }
        });
    postMenu.appendChild(deleteButton);
    return postMenu;
}

export function createFullPostDialog(post, postDialog) {
    const user = JSON.parse(localStorage.getItem('loggedInUser'));
    console.log(user);
   
    const postDialogContent = document.createElement('div');
    postDialogContent.classList.add('post-dialog-content');

    const authorAndCloseDiv = document.createElement('div');
    authorAndCloseDiv.classList.add('author-and-close-button');

    const profileAndNameDiv = document.createElement('div');
    profileAndNameDiv.classList.add('profile-picture-and-name');

    const profilePictureDiv = document.createElement('div');
    profilePictureDiv.classList.add('profile-picture-on-card');

    const profileInitial = document.createElement('p');
    profileInitial.textContent = post.onePost.creator[0];
    profilePictureDiv.appendChild(profileInitial);

    const creatorName = document.createElement('h2');
    creatorName.classList.add('profile-name');
    creatorName.textContent = post.onePost.creator;

    profileAndNameDiv.appendChild(profilePictureDiv);
    profileAndNameDiv.appendChild(creatorName);

    const closeButton = document.createElement('span');
    closeButton.classList.add('close-dialog-button');
    closeButton.innerHTML = '&times;';
    closeButton.addEventListener('click', () => {
        closeDialog(postDialog)
    })

    closeWithEscape(postDialog);

    authorAndCloseDiv.appendChild(profileAndNameDiv);
    authorAndCloseDiv.appendChild(closeButton);

    const postTitle = document.createElement('h1');
    postTitle.classList.add('post-title');
    postTitle.textContent = post.onePost.title;

    const postContent = document.createElement('p');
    postContent.textContent = post.onePost.content;

    const commentSection = document.createElement('div');
    commentSection.classList.add('comment-section');

    const commentHeader = document.createElement('h3');
    commentHeader.textContent = 'Comments';

    const commentLine = document.createElement('div');
    commentLine.classList.add('comment-line');

    const commentsList = document.createElement('div');
    commentsList.id = 'comments-list';

    if (Array.isArray(post.comments)) {
        if (post.comments.length > 0) {
            post.comments.forEach(comment => {
                const commentElement = createCommentElement(comment, post, user);
                commentsList.appendChild(commentElement);
            });
        } else {
            const noCommentsMessage = document.createElement('p');
            noCommentsMessage.textContent = 'No comments yet. Be the first to comment!';
            commentsList.appendChild(noCommentsMessage);
        }
    }

    const newCommentDiv = document.createElement('div');
    newCommentDiv.classList.add('new-comment');

    const newCommentInput = document.createElement('input');
    newCommentInput.type = 'text';
    newCommentInput.id = 'new-comment-text';
    newCommentInput.placeholder = 'Add a comment...';

    const addCommentButton = document.createElement('button');
    addCommentButton.id = 'add-comment-button';
    addCommentButton.textContent = 'Comment';
    addCommentButton.addEventListener('click', async () => {
        const commentText = newCommentInput.value.trim();
        if (commentText) {
            const newComment = {
                content: commentText, 
                post_id: post.onePost.id,
            };
            try {
                const createdComment = await createNewCommentFetch(newComment);
                const commentElement = createCommentElement(createdComment.comment, post, user);
                commentsList.appendChild(commentElement);
                newCommentInput.value = '';
            } catch (error) {
                console.error('Error creating new comment:', error);
            }

            const postId = post.onePost.id;
            const postElement = document.querySelector(`[data-post-id="${postId}"]`);

            const commentCountElement = postElement.querySelector('#comment-number');
            console.log(commentCountElement)
    
            let newCommentCount = parseInt(commentCountElement.textContent, 10) + 1;

            commentCountElement.textContent = newCommentCount;
        }
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

function createCommentElement(comment, post, user) {
    const commentDiv = document.createElement('div');
    commentDiv.classList.add('comment');
    commentDiv.setAttribute('data-comment-id', comment.id);

    const commentAuthor = document.createElement('div');
    commentAuthor.classList.add('comment-author');
    commentAuthor.textContent = comment.creator;

    const commentContent = document.createElement('div');
    commentContent.classList.add('comment-content');
    commentContent.textContent = comment.content;

    const likeDislikeSection = document.createElement('div');
    likeDislikeSection.classList.add('like-dislike-comment-section');

    const likeDiv = document.createElement('div');
    likeDiv.classList.add('like-dislike-comment');
    likeDiv.setAttribute('data-action', 'like');

    const likeButtonDiv = document.createElement('div');
    likeButtonDiv.classList.add('comment-like-button-div');

    const likeButton = document.createElement('span');
    likeButtonDiv.appendChild(likeButton);

    let userHasLiked = false;

    if(post.comment_likes !== null) {
        userHasLiked = post.comment_likes.some(like => like.User_id === user.id && like.Comment_id === comment.id && like.Like === 1);
    }

    if(userHasLiked) {
        likeButton.style.pointerEvents = 'none';
        likeButton.classList.add('comment-liked');
    } else {
        likeButton.classList.add('comment-like-button');
        likeButton.id = 'comment-like-button';
    }
    
    likeButtonDiv.appendChild(likeButton);

    const likeCount = document.createElement('span');
    likeCount.classList.add('comment-like-count');
    likeCount.textContent = comment.likes;

    likeButtonDiv.addEventListener('click', async (event) => {
        event.stopPropagation();
        if(dislikeButton.classList.contains('comment-disliked')) {
            dislikeButton.classList.remove('comment-disliked');
            dislikeButton.classList.add('comment-dislike-button');
            let newDislikeCount = parseInt(dislikeCount.textContent, 10) - 1;
            dislikeCount.textContent = newDislikeCount;
        }
        await handleLikeUI('comment', post.onePost.id, comment.id, likeCount, likeButton) 
    })

    likeDiv.appendChild(likeButtonDiv);
    likeDiv.appendChild(likeCount);

    const dislikeDiv = document.createElement('div');
    dislikeDiv.classList.add('like-dislike-comment');
    dislikeDiv.setAttribute('data-action', 'dislike');

    const dislikeButtonDiv = document.createElement('div');
    dislikeButtonDiv.classList.add('comment-dislike-button-div');

    const dislikeButton = document.createElement('span');
    
    let userHasDisliked = false;
    
    if(post.comment_likes !== null) {
        userHasDisliked = post.comment_likes.some(like => like.User_id === user.id && like.Comment_id === comment.id && like.Like === -1);
    }
    
    if(userHasDisliked) {
        dislikeButton.style.pointerEvents = 'none';
        dislikeButton.classList.add('comment-disliked');
    } else {
        dislikeButton.classList.add('comment-dislike-button');
        dislikeButton.id = 'comment-dislike-button';
    }
    
    dislikeButtonDiv.appendChild(dislikeButton);

    const dislikeCount = document.createElement('span');
    dislikeCount.classList.add('comment-dislike-count');
    dislikeCount.textContent = comment.dislikes;

    dislikeButtonDiv.addEventListener('click', async (event) => {
        event.stopPropagation();
        if(likeButton.classList.contains('comment-liked')) {
            likeButton.classList.remove('comment-liked');
            likeButton.classList.add('comment-like-button');
            let newLikeCount = parseInt(likeCount.textContent, 10) -1;
            likeCount.textContent = newLikeCount;
        }
        await handleDislikeUI('comment', post.onePost.id, comment.id, dislikeCount, dislikeButton) 
    })    

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

    closeWithEscape(dialogElement);

    headerAndCloseDiv.appendChild(headerTitle);
    headerAndCloseDiv.appendChild(closeButton);

    const form = document.createElement('form');
    form.id = 'create-post-form';

    const titleLabel = document.createElement('label');
    titleLabel.setAttribute('for', 'title');
    titleLabel.textContent = 'Title';

    const titleInput = document.createElement('input');
    titleInput.type = 'text';
    titleInput.id = 'title';
    titleInput.name = 'title';
    titleInput.required = true;

    const categoryLabel = document.createElement('label');
    categoryLabel.setAttribute('for', 'category');
    categoryLabel.textContent = 'Category';

    const categoryInput = document.createElement('input');
    categoryInput.type = 'text';
    categoryInput.id = 'category';
    categoryInput.name = 'category';

    const contentLabel = document.createElement('label');
    contentLabel.setAttribute('for', 'content');
    contentLabel.textContent = 'Content';

    const contentTextarea = document.createElement('textarea');
    contentTextarea.id = 'content';
    contentTextarea.name = 'content';
    contentTextarea.rows = 4;
    contentTextarea.required = true;

    const submitButton = document.createElement('button');
    submitButton.classList.add('create-new-post-submit-button');
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

function closeWithEscape(dialogElement) {
    document.addEventListener('keydown', (event) => {
        if(event.key === 'Escape') {
            const postDialogDiv = dialogElement.parentElement;
            dialogElement.close();
            postDialogDiv.remove();
        }
    })
}
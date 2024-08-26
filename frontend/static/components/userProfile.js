import { userProfileSection } from "./dom/userProfileUI.js";

export function openProfileSection() {
     const userProfileSectionDiv = document.getElementById('user-profile');
     hidePostSection(userProfileSectionDiv);
     userProfileSection(userProfileSectionDiv);
}

function hidePostSection(userProfileSectionDiv) {
    const postContent = document.getElementById('main-content-for-posts');
    postContent.classList.remove('visible');
    postContent.classList.add('hidden');
    showUserProfileSection(userProfileSectionDiv);
}

function showUserProfileSection(userProfileSectionDiv) {
    userProfileSectionDiv.classList.remove('hidden');
    userProfileSectionDiv.classList.add('visible');
}

export function showPostSection(userProfileSectionDiv) {
    const postContent = document.getElementById('main-content-for-posts');
    postContent.classList.remove('hidden');
    postContent.classList.add('visible');
    hideUserProfileSection(userProfileSectionDiv);
}

function hideUserProfileSection(userProfileSectionDiv) {
    userProfileSectionDiv.classList.remove('visible');
    userProfileSectionDiv.classList.add('hidden');
}
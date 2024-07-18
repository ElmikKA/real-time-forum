const posts = [
    {
        profileName: 'Karl Elmik',
        title: 'Flat Earth is REAL!',
        description: 'Nobody wants to believe that earth is flat, but i have proof and in this article i am gonna explain everything.',
        postText: `
        The Flat Earth Theory, once a relic of ancient cosmology, has experienced a resurgence in contemporary discourse. 
        Advocates argue that mainstream science has overlooked or suppressed evidence that supports the idea of a flat Earth. 
        This article explores the key arguments presented by proponents of the Flat Earth Theory, aiming to present a comprehensive 
        view of their perspective.
        `,
    },
    {
        profileName: 'Karl Elmik',
        title: 'Flat Earth is REAL!',
        description: 'Nobody wants to believe that earth is flat, but i have proof and in this article i am gonna explain everything.',
        postText: `
        The Flat Earth Theory, once a relic of ancient cosmology, has experienced a resurgence in contemporary discourse. 
        Advocates argue that mainstream science has overlooked or suppressed evidence that supports the idea of a flat Earth. 
        This article explores the key arguments presented by proponents of the Flat Earth Theory, aiming to present a comprehensive 
        view of their perspective.
        `,
    },{
        profileName: 'Karl Elmik',
        title: 'Flat Earth is REAL!',
        description: 'Nobody wants to believe that earth is flat, but i have proof and in this article i am gonna explain everything.',
        postText: `
        The Flat Earth Theory, once a relic of ancient cosmology, has experienced a resurgence in contemporary discourse. 
        Advocates argue that mainstream science has overlooked or suppressed evidence that supports the idea of a flat Earth. 
        This article explores the key arguments presented by proponents of the Flat Earth Theory, aiming to present a comprehensive 
        view of their perspective.
        `,
    }
]

export function postLayoutForHtml() {
    const postGridLayout = document.getElementById('post-grid-layout');
    
    posts.forEach(post => {
        const postElement = createAPost(post)
        postGridLayout.appendChild(postElement)
    })
}

function createAPost(postObj) {
    const postLayout = document.createElement('div');
    postLayout.classList.add('post-layout');

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
            <img src="/src/img/Dislike.png" class="dislike-img">
            <img src="/src/img/Comment.png" class="comment-img">
        </div>
    `;

    return postLayout
}
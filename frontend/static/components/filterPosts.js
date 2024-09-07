export function openFilterDropDownMenu() {
    const filterButton = document.getElementById('filter-posts-button');

    const filterDropDownMenu = createFilterDropdownMenu(); 

    filterButton.appendChild(filterDropDownMenu);
    initializeFilterDropDownMenuEvents();
}

function createFilterDropdownMenu() {
    const filterDropdownMenu = document.createElement('div');
    filterDropdownMenu.classList.add('filter-dropdown-menu');
    filterDropdownMenu.id = 'filter-dropdown-menu';

    const likesButton = createButton('sort-by-likes-button', 'Sort By Likes', sortPostsByLikes);
    const dislikesButton = createButton('sort-by-dislikes-button', 'Sort By Dislikes', sortPostsByDislikes);

    filterDropdownMenu.appendChild(likesButton);
    filterDropdownMenu.appendChild(dislikesButton);

    return filterDropdownMenu;
}

function createButton(id, textContent, onClickHandler) {
    const button = document.createElement('button');
    button.id = id;
    button.textContent = textContent;
    button.addEventListener('click', (event) => {
        event.preventDefault();
        onClickHandler();
    });
    return button;
}

function initializeFilterDropDownMenuEvents() {
    const filterButton = document.getElementById('filter-posts-button');
    const filterDropdownMenu = document.getElementById('filter-dropdown-menu');

    filterButton.addEventListener('click', () => {
        filterDropdownMenu.classList.toggle('show');
    });

    window.addEventListener('click', (event) => {
        if (!filterButton.contains(event.target)) {
            if (filterDropdownMenu.classList.contains('show')) {
                filterDropdownMenu.classList.remove('show');
            }
        }
    });
}

function sortPostsByLikes() {
    const postElements = document.querySelectorAll('[data-post-id]');
    const postsArray = Array.from(postElements);

    postsArray.sort((a, b) => {
        const aLikes = parseInt(a.querySelector('#like-number').textContent, 10) || 0;
        const bLikes = parseInt(b.querySelector('#like-number').textContent, 10) || 0;
        return bLikes - aLikes;
    });

    renderSortedPosts(postsArray);
}

function sortPostsByDislikes() {
    const postElements = document.querySelectorAll('[data-post-id]');
    const postsArray = Array.from(postElements);

    postsArray.sort((a, b) => {
        const aDislikes = parseInt(a.querySelector('#dislike-number').textContent, 10) || 0;
        const bDislikes = parseInt(b.querySelector('#dislike-number').textContent, 10) || 0;
        return bDislikes - aDislikes;
    });

    renderSortedPosts(postsArray);
}

function renderSortedPosts(postsArray) {
    const postContainer = document.getElementById('post-grid-layout');
    postContainer.innerHTML = '';
    postsArray.forEach(post => {
        postContainer.appendChild(post);
    });
}

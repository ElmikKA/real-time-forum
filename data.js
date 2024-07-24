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
    }
]

export function getPosts() {
    return posts;
}

export function addPost(post) {
    posts.push(post)
}

const users = [
    {
        nickname: 'Elmek',
        age: '24',
        gender: 'male',
        firstName: 'Karl',
        lastName: 'Elmik',
        email: 'some@some.ee',
        password: 'somesome',
        online: true,
    },
    {
        nickname: 'MuriMees277',
        age: '29',
        gender: 'male',
        firstName: 'Karl',
        lastName: 'Elmik',
        email: 'some@some.ee',
        password: 'somesome',
        online: false,
    },
    {
        nickname: 'Murutraktor',
        age: '22',
        gender: 'male',
        firstName: 'Karl',
        lastName: 'Elmik',
        email: 'some@some.ee',
        password: 'somesome',
        online: true,
    }
];

export function getUsers() {
    return users;
}
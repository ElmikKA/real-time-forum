CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    username TEXT NOT NULL,
    age INTEGER NOT NULL,
    gender TEXT NOT NULL,
    fname TEXT NOT NULL,
    lname TEXT NOT NULL,
    email TEXT NOT NULL,
    password TEXT NOT NULL,
    online INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS sessions (
    id INTEGER PRIMARY KEY NOT NULL,
    cookie TEXT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expires_at DATETIME NOT NULL 
);

CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY NOT NULL,
    user_id INTEGER NOT NULL,
    creator TEXT NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS comments (
    id INTEGER PRIMARY KEY NOT NULL,
    user_id INTEGER NOT NULL,
    creator TEXT NOT NULL,
    post_id INTEGER NOT NULL,
    content TEXT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS post_likes (
    user_id INTEGER NOT NULL,
    post_id INTEGER NOT NULL,
    like INTEGER,
    PRIMARY KEY (post_id, user_id)
);

CREATE TABLE IF NOT EXISTS comment_likes (
    user_id INTEGER NOT NULL,
    post_id INTEGER NOT NULL,
    comment_id INTEGER NOT NULL,
    like integer,
    PRIMARY KEY (post_id, user_id)
);

CREATE TABLE IF NOT EXISTS messages (
    user1 TEXT NOT NULL,
    written_by TEXT NOT NULL,
    user2 TEXT NOT NULL,
    message TEXT NOT NULL,
    written_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
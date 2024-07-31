package functions

import (
	"database/sql"
	"fmt"
	"time"
)

type Post struct {
	Id        int       `json:"id"`
	User_id   int       `json:"user_id"`
	Creator   string    `json:"creator"`
	Title     string    `json:"title"`
	Content   string    `json:"content"`
	Category  string    `json:"category"`
	CreatedAt time.Time `json:"createdAt"`
	Likes     int       `json:"likes"`
	Dislikes  int       `json:"dislikes"`
	Liked     bool      `json:"liked"`
	Disliked  bool      `json:"disliked"`
}

func GetPosts(db *sql.DB, user_id int) ([]Post, error) {
	query := `
	SELECT 
		p.id,
		p.user_id,
		p.creator,
		p.title,
		p.content,
		p.category,
		p.createdAt,
		(SELECT COUNT(*) FROM post_likes WHERE post_id = p.id AND like = 1) AS likes,
		(SELECT COUNT(*) FROM post_likes WHERE post_id = p.id AND like = -1) AS dislikes,
		EXISTS (SELECT 1 FROM post_likes WHERE user_id = ? AND like = 1) AS liked,
		EXISTS (SELECT 1 FROM post_likes WHERE user_id = ? AND Like = -1) AS disliked
	FROM 
		posts p 
	LEFT JOIN 
		users u ON p.user_id = u.id
	`
	rows, err := db.Query(query, user_id, user_id)
	if err != nil {
		fmt.Println("error getting posts", err)
		return nil, err
	}

	defer rows.Close()

	var posts []Post
	for rows.Next() {
		var post Post
		err := rows.Scan(&post.Id, &post.User_id, &post.Creator, &post.Title, &post.Content, &post.Category, &post.CreatedAt, &post.Likes, &post.Dislikes, &post.Liked, &post.Disliked)
		if err != nil {
			fmt.Println("error getting next post", err)
			return nil, err
		}
		posts = append(posts, post)
	}
	return posts, nil
}

func GetOnePost(db *sql.DB, id int, user_id int) (Post, error) {
	query := `
	SELECT 
		p.id,
		p.user_id,
		p.creator,
		p.title,
		p.content,
		p.category,
		p.createdAt,
		(SELECT COUNT(*) FROM post_likes WHERE post_id = p.id AND like = 1) AS likes,
		(SELECT COUNT(*) FROM post_likes WHERE post_id = p.id AND like = -1) AS dislikes,
		EXISTS (SELECT 1 FROM post_likes WHERE user_id = ? AND like = 1) AS liked,
		EXISTS (SELECT 1 FROM post_likes WHERE user_id = ? AND Like = -1) AS disliked
	FROM 
		posts p 
	LEFT JOIN 
		users u ON p.user_id = u.id
	WHERE p.id = ?
	`
	// query := `SELECT * FROM posts WHERE id = ?`
	var post Post
	err := db.QueryRow(query, user_id, user_id, id).Scan(&post.Id, &post.User_id, &post.Creator, &post.Title, &post.Content, &post.Category, &post.CreatedAt, &post.Likes, &post.Dislikes, &post.Liked, &post.Disliked)
	if err != nil {
		fmt.Println("error gettig one post", err)
		return post, err
	}
	return post, nil
}

func CreatePost(db *sql.DB, post Post) error {
	query := `INSERT INTO posts (user_id, creator, title, content, category) VALUES (?,?,?,?,?)`
	_, err := db.Exec(query, post.User_id, post.Creator, post.Title, post.Content, post.Category)
	if err != nil {
		fmt.Println("error creating post", err)
		return err
	}
	return nil
}

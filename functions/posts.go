package functions

import (
	"database/sql"
	"fmt"
	"time"
)

type Post struct {
	Id        int
	User_id   string
	Title     string
	Content   string
	Category  string
	CreatedAt time.Time
}

func GetPosts(db *sql.DB) ([]Post, error) {
	query := `SELECT * FROM posts`
	rows, err := db.Query(query)
	if err != nil {
		fmt.Println("error getting posts", err)
		return nil, err
	}

	defer rows.Close()

	var posts []Post
	for rows.Next() {
		var post Post
		err := rows.Scan(&post.Id, &post.User_id, &post.Title, &post.Content, &post.Category, &post.CreatedAt)
		if err != nil {
			fmt.Println("error getting next post", err)
			return nil, err
		}
		posts = append(posts, post)
	}
	return posts, nil
}

func GetOnePost(db *sql.DB, id int) (Post, error) {
	query := `SELECT * FROM posts WHERE id = ?`
	var post Post
	err := db.QueryRow(query, id).Scan(&post.Id, &post.User_id, &post.Title, &post.Content, &post.Category, &post.CreatedAt)
	if err != nil {
		fmt.Println("error gettig one post", err)
		return post, err
	}
	return post, nil
}

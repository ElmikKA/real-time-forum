package functions

import (
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

func GetPosts(user_id int) ([]Post, error) {

	// selects data from users and post_likes
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
	rows, err := Db.Query(query, user_id, user_id)
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

func GetOnePost(id int, user_id int) (Post, error) {

	// selects data from both posts and post_likes
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
	var post Post
	err := Db.QueryRow(query, user_id, user_id, id).Scan(&post.Id, &post.User_id, &post.Creator, &post.Title, &post.Content, &post.Category, &post.CreatedAt, &post.Likes, &post.Dislikes, &post.Liked, &post.Disliked)
	if err != nil {
		fmt.Println("error gettig one post", err)
		return post, err
	}
	return post, nil
}

func CreatePost(post Post) error {
	query := `INSERT INTO posts (user_id, creator, title, content, category) VALUES (?,?,?,?,?)`
	_, err := Db.Exec(query, post.User_id, post.Creator, post.Title, post.Content, post.Category)
	if err != nil {
		fmt.Println("error creating post", err)
		return err
	}
	return nil
}

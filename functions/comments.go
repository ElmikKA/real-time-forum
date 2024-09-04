package functions

import (
	"fmt"
	"time"
)

type Comment struct {
	Id         int       `json:"id"`
	User_id    int       `json:"user_id"`
	Creator    string    `json:"creator"`
	Post_id    int       `json:"post_id"`
	Content    string    `json:"content"`
	Created_at time.Time `json:"created_at"`
	Likes      int       `json:"likes"`
	Dislikes   int       `json:"dislikes"`
	Liked      bool      `json:"liked"`
	Disliked   bool      `json:"disliked"`
}

func GetComments(id int, user_id int) ([]Comment, error) {

	// selects data from both comments and comment_likes
	query := `
	SELECT 
		c.id,
		c.user_id,
		c.creator,
		c.post_id,
		c.content,
		c.created_at,
		(SELECT COUNT(*) FROM comment_likes WHERE comment_id = c.id AND like = 1) AS likes,
		(SELECT COUNT(*) FROM comment_likes WHERE comment_id = c.id AND like = -1) AS dislikes,
		EXISTS (SELECT 1 FROM comment_likes WHERE user_id = ? AND comment_id = c.id AND like = 1) AS liked,
		EXISTS (SELECT 1 FROM comment_likes WHERE user_id = ? AND comment_id = c.id AND like = -1) AS disliked
	FROM 
		comments c 
	LEFT JOIN 
		users u ON c.user_id = u.id
	WHERE 
		c.post_id = ?
	`
	var comments []Comment
	rows, err := Db.Query(query, user_id, user_id, id)
	if err != nil {
		fmt.Println("error getting rows from comments", err)
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var comment Comment
		err := rows.Scan(&comment.Id, &comment.User_id, &comment.Creator, &comment.Post_id, &comment.Content, &comment.Created_at, &comment.Likes, &comment.Dislikes, &comment.Liked, &comment.Disliked)
		if err != nil {
			fmt.Println("error rows.next", err)
			return nil, err
		}
		comments = append(comments, comment)
	}
	return comments, nil
}

func CreateComment(comment Comment) error {
	query := `INSERT INTO comments (user_id, creator, post_id, content) VALUES (?,?,?,?)`
	_, err := Db.Exec(query, comment.User_id, comment.Creator, comment.Post_id, comment.Content)
	if err != nil {
		fmt.Println("error creating comment", err)
		return err
	}
	return nil
}

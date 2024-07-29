package functions

import (
	"database/sql"
	"fmt"
	"time"
)

type Comment struct {
	Id        int
	User_id   int
	Post_id   int
	Content   string
	CreatedAt time.Time
}

func GetComments(db *sql.DB, id int) ([]Comment, error) {
	query := `SELECT * FROM comments WHERE post_id = ?`
	var comments []Comment
	rows, err := db.Query(query, id)
	if err != nil {
		fmt.Println("error getting rows from comments", err)
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var comment Comment
		err := rows.Scan(&comment.Id, &comment.User_id, &comment.Post_id, &comment.Content, &comment.CreatedAt)
		if err != nil {
			fmt.Println("error rows.next", err)
			return nil, err
		}
		comments = append(comments, comment)
	}
	return comments, nil

}

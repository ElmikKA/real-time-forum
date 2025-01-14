package functions

import (
	"fmt"
)

type Post_likes struct {
	User_id int
	Post_id int
	Like    int
}

type Comment_likes struct {
	User_id    int
	Post_id    int
	Comment_id int
	Like       int
}

type Change_like struct {
	Post       bool `json:"post"`
	Post_id    int  `json:"post_id"`
	Comment    bool `json:"comment"`
	Comment_id int  `json:"comment_id"`
	Like       int  `json:"like"`
}

func GetAllPostLikes() ([]Post_likes, error) {
	query := `SELECT * FROM post_likes`
	var likes []Post_likes
	rows, err := Db.Query(query)
	if err != nil {
		fmt.Println("error getting all postlikes", err)
		return nil, err
	}
	defer rows.Close()
	for rows.Next() {
		var like Post_likes
		err := rows.Scan(&like.User_id, &like.Post_id, &like.Like)
		if err != nil {
			fmt.Println("err getting rows.next at postlikes", err)
			return nil, err
		}
		likes = append(likes, like)
	}
	return likes, nil
}

func GetOnePostLike(id int) ([]Post_likes, error) {
	query := `SELECT * FROM post_likes WHERE post_id = ?`
	var post_likes []Post_likes
	rows, err := Db.Query(query, id)
	if err != nil {
		fmt.Println("error getting one postlikes", err)
		return post_likes, err
	}
	defer rows.Close()

	for rows.Next() {
		var post_like Post_likes
		err := rows.Scan(&post_like.User_id, &post_like.Post_id, &post_like.Like)
		if err != nil {
			fmt.Println("error getting onepostlikes", err)
			return nil, err
		}
		post_likes = append(post_likes, post_like)
	}
	return post_likes, nil
}

func GetCommentLikes(id int) ([]Comment_likes, error) {
	query := `SELECT * FROM comment_likes WHERE post_id = ?`
	var comment_likes []Comment_likes
	rows, err := Db.Query(query, id)
	if err != nil {
		fmt.Println("error getting rows for commentlikes", err)
		return nil, err
	}
	for rows.Next() {
		var comment_like Comment_likes
		err := rows.Scan(&comment_like.User_id, &comment_like.Post_id, &comment_like.Comment_id, &comment_like.Like)
		if err != nil {
			fmt.Println("error comments.next", err)
			return nil, err
		}
		comment_likes = append(comment_likes, comment_like)
	}
	return comment_likes, nil
}

func AddPostLike(post_id int, user_id int, like int) error {

	query := `INSERT OR REPLACE INTO post_likes (user_id, post_id, like) 
	VALUES (?,?,?)`

	_, err := Db.Exec(query, user_id, post_id, like)
	if err != nil {
		fmt.Println("error adding post likes", err)
		return err
	}
	return nil
}

func AddCommentLike(post_id int, comment_id int, user_id int, like int) error {

	query := `INSERT OR REPLACE INTO comment_likes (user_id, post_id,comment_id, like) 
	VALUES (?,?,?,?)`

	_, err := Db.Exec(query, user_id, post_id, comment_id, like)
	if err != nil {
		fmt.Println("error adding comment likes", err)
		return err
	}
	return nil
}

package functions

import (
	"fmt"
	"time"
)

type Messages struct {
	Sender_id   int       `json:"sender_id"`
	Receiver_id int       `json:"receiver_id"`
	Message     string    `json:"message"`
	Written_at  time.Time `json:"written_at"`
}

type RequestMessage struct {
	Id int `json:"id"`
}

type MessageData struct {
	Message     string `json:"message"`
	Receiver_id int    `json:"receiver"`
}

func GetLatestMessages(user int) ([]Messages, error) {

	query := `
    WITH latest_messages AS (
        SELECT 
            CASE WHEN sender_id < receiver_id THEN sender_id ELSE receiver_id END AS min_user_id,
            CASE WHEN sender_id > receiver_id THEN sender_id ELSE receiver_id END AS max_user_id,
            MAX(written_at) AS latest_time
        FROM messages
        WHERE sender_id = ? OR receiver_id = ?
        GROUP BY min_user_id, max_user_id
    )
    SELECT m.*
    FROM messages m
    JOIN latest_messages lm
    ON CASE WHEN m.sender_id < m.receiver_id THEN m.sender_id ELSE m.receiver_id END = lm.min_user_id
    AND CASE WHEN m.sender_id > m.receiver_id THEN m.sender_id ELSE m.receiver_id END = lm.max_user_id
    AND m.written_at = lm.latest_time
    WHERE m.sender_id = ? OR m.receiver_id = ?
    ORDER BY m.written_at DESC;
    `

	rows, err := Db.Query(query, user, user, user, user)
	if err != nil {
		fmt.Println("error getting latest messages", err)
		return nil, err
	}
	defer rows.Close()

	var messages []Messages
	for rows.Next() {
		var msg Messages
		if err := rows.Scan(&msg.Sender_id, &msg.Receiver_id, &msg.Message, &msg.Written_at); err != nil {
			fmt.Println("error rows.next latest messages", err)
			return nil, err
		}
		messages = append(messages, msg)
	}
	if err := rows.Err(); err != nil {
		fmt.Print("latest messages, rows.err", err)
		return nil, err
	}

	return messages, nil
}

func GetAllMessages(user1 int, user2 int) ([]Messages, error) {
	var messages []Messages
	query := `
	SELECT * FROM messages WHERE 
		(sender_id = ? AND receiver_id = ?) 
	OR 
		(sender_id = ? AND receiver_id = ?) 
	ORDER BY 
		written_at ASC`

	rows, err := Db.Query(query, user1, user2, user2, user1)
	if err != nil {
		fmt.Println("error getting all messages", err)
		return messages, err
	}
	defer rows.Close()

	for rows.Next() {
		var message Messages
		err := rows.Scan(&message.Sender_id, &message.Receiver_id, &message.Message, &message.Written_at)
		if err != nil {
			fmt.Println("error all messages rows.next", err)
			return messages, err
		}
		messages = append(messages, message)
	}
	return messages, nil
}

func AddMessage(message string, receiver int, sender int) error {
	query := `INSERT INTO messages (sender_id, receiver_id, message) VALUES (?,?,?)`

	_, err := Db.Exec(query, sender, receiver, message)

	if err != nil {
		fmt.Println("error adding message", err)
		return err
	}
	return nil
}

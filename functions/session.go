package functions

import (
	"database/sql"
	"fmt"
	"time"
)

type Session struct {
	Id      int
	Cookie  string
	Created time.Time
	Expires time.Time
}

func CreateSession(db *sql.DB, session Session) (int, error) {

	query := `INSERT INTO sessions (id, cookie, createdAt, expiresAt) VALUES (?,?,?,?)`

	_, err := db.Exec(query, session.Id, session.Cookie, time.Now(), session.Expires)
	if err != nil {
		fmt.Println("error creating session")
		return session.Id, err
	}

	return session.Id, nil
}

func DeleteSession(db *sql.DB, cookie string) {
	query := `DELETE FROM sessions WHERE cookie = ?`

	_, err := db.Exec(query, cookie)

	if err != nil {
		fmt.Println("error deleting session")
	}
}

func DeleteUserSession(db *sql.DB, id int) error {
	query := `DELETE FROM sessions WHERE id = ?`

	_, err := db.Exec(query, id)
	if err != nil {
		fmt.Println("error deleting user")
		return err
	}
	return nil
}

func GetSessionByCookie(db *sql.DB, cookie string) (Session, error) {
	var session Session
	query := `SELECT id, cookie, createdAt FROM sessions WHERE cookie = ?`

	err := db.QueryRow(query, cookie).Scan(&session.Id, &session.Cookie, &session.Created)
	if err != nil {
		return Session{}, err
	}
	return session, nil
}

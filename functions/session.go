package functions

import (
	"fmt"
	"time"
)

type Session struct {
	Id      int
	Cookie  string
	Created time.Time
	Expires time.Time
}

func CreateSession(session Session) (int, error) {

	query := `INSERT INTO sessions (id, cookie, createdAt, expiresAt) VALUES (?,?,?,?)`

	_, err := Db.Exec(query, session.Id, session.Cookie, time.Now(), session.Expires)
	if err != nil {
		fmt.Println("error creating session")
		return session.Id, err
	}

	return session.Id, nil
}

func DeleteSession(cookie string) {
	query := `DELETE FROM sessions WHERE cookie = ?`

	_, err := Db.Exec(query, cookie)

	if err != nil {
		fmt.Println("error deleting session")
	}
}

func DeleteUserSession(id int) error {
	query := `DELETE FROM sessions WHERE id = ?`

	_, err := Db.Exec(query, id)
	if err != nil {
		fmt.Println("error deleting user")
		return err
	}
	return nil
}

func GetSessionByCookie(cookie string) (Session, error) {
	var session Session
	query := `SELECT id, cookie, createdAt FROM sessions WHERE cookie = ?`

	err := Db.QueryRow(query, cookie).Scan(&session.Id, &session.Cookie, &session.Created)
	if err != nil {
		return Session{}, err
	}
	return session, nil
}

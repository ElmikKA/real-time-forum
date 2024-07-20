package functions

import (
	"database/sql"
	"fmt"
)

type Users struct {
	Name      string
	Age       int
	Gender    string
	FirstName string
	LastName  string
	Email     string
	Password  string
}

func CheckUserExists(db *sql.DB, username, email string) (bool, error) {
	query := "SELECT COUNT(*) FROM users WHERE username = ? OR email = ?"
	var count int
	err := db.QueryRow(query, username, email).Scan(&count)

	if err != nil {
		return false, err
	}
	return count > 0, nil
}

func AddUser(db *sql.DB, user Users) {
	query := "INSERT INTO users (username, age, gender, fName, lName, email, password) VALUES (?,?,?,?,?,?,?)"
	_, err := db.Exec(query, user.Name, user.Age, user.Gender, user.FirstName, user.LastName, user.Email, user.Password)

	if err != nil {
		fmt.Println("error adding user to users", err)
	}
}

func CheckLogin(db *sql.DB, user, pass string) (bool, int, error) {
	query := "SELECT id, password FROM users WHERE username = ? OR email = ?"
	var dPass string
	var id int
	err := db.QueryRow(query, user, user).Scan(&id, &dPass)

	if err != nil {
		return false, id, err
	}

	if pass != dPass {
		return false, id, nil
	}

	return true, id, nil
}

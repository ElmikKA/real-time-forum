package functions

import (
	"database/sql"
	"fmt"
)

type Users struct {
	Name      string `json:"username"`
	Age       int    `json:"age"`
	Gender    string `json:"gender"`
	FirstName string `json:"fname"`
	LastName  string `json:"lname"`
	Email     string `json:"email"`
	Password  string `json:"password"`
}

type LoginCredentials struct {
	User string `json:"user"`
	Pass string `json:"password"`
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

func GetUser(db *sql.DB, id int) (Users, error) {
	var user Users
	query := `SELECT username, age, gender, fname, lname, email FROM users WHERE id = ?`
	err := db.QueryRow(query, id).Scan(&user.Name, &user.Age, &user.Gender, &user.FirstName, &user.LastName, &user.Email)
	if err != nil {
		fmt.Println("error getting user", err)
		return user, err
	}
	return user, nil
}

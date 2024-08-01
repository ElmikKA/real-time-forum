package functions

import (
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

func CheckUserExists(username, email string) (bool, error) {
	query := "SELECT COUNT(*) FROM users WHERE username = ? OR email = ?"
	var count int
	err := Db.QueryRow(query, username, email).Scan(&count)

	if err != nil {
		return false, err
	}
	return count > 0, nil
}

func AddUser(user Users) {
	query := "INSERT INTO users (username, age, gender, fName, lName, email, password) VALUES (?,?,?,?,?,?,?)"
	_, err := Db.Exec(query, user.Name, user.Age, user.Gender, user.FirstName, user.LastName, user.Email, user.Password)

	if err != nil {
		fmt.Println("error adding user to users", err)
	}
}

func CheckCredentials(user, pass string) (bool, int, error) {
	query := "SELECT id, password FROM users WHERE username = ? OR email = ?"
	var dPass string
	var id int
	err := Db.QueryRow(query, user, user).Scan(&id, &dPass)

	if err != nil {
		return false, id, err
	}

	if pass != dPass {
		return false, id, nil
	}

	return true, id, nil
}

func GetUser(id int) (Users, error) {
	var user Users
	query := `SELECT username, age, gender, fname, lname, email FROM users WHERE id = ?`
	err := Db.QueryRow(query, id).Scan(&user.Name, &user.Age, &user.Gender, &user.FirstName, &user.LastName, &user.Email)
	if err != nil {
		fmt.Println("error getting user", err)
		return user, err
	}
	return user, nil
}

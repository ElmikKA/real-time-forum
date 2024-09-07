package functions

import (
	"fmt"
	"sort"
	"time"
)

type Users struct {
	Id        int    `json:"id"`
	Name      string `json:"username"`
	Age       int    `json:"age"`
	Gender    string `json:"gender"`
	FirstName string `json:"fname"`
	LastName  string `json:"lname"`
	Email     string `json:"email"`
	Password  string `json:"password"`
	Online    string `json:"online"`
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
		fmt.Println("error checking existing user", err)
		return false, err
	}
	return count > 0, nil
}

func AddUser(user Users) error {
	query := "INSERT INTO users (username, age, gender, fName, lName, email, password) VALUES (?,?,?,?,?,?,?)"
	_, err := Db.Exec(query, user.Name, user.Age, user.Gender, user.FirstName, user.LastName, user.Email, user.Password)

	if err != nil {
		fmt.Println("error adding user to users", err)
		return err
	}
	return nil
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
	query := `SELECT id,username, age, gender, fname, lname, email, online FROM users WHERE id = ?`
	err := Db.QueryRow(query, id).Scan(&user.Id, &user.Name, &user.Age, &user.Gender, &user.FirstName, &user.LastName, &user.Email, &user.Online)
	if err != nil {
		fmt.Println("error getting user", err)
		return user, err
	}
	return user, nil
}

func GetAllUsers() ([]Users, error) {
	var users []Users
	query := `SELECT id, username, age, gender, fname, lname, email, online FROM users`
	rows, err := Db.Query(query)
	if err != nil {
		fmt.Println("error getting all users", err)
		return users, err
	}

	defer rows.Close()

	for rows.Next() {
		var user Users
		err := rows.Scan(&user.Id, &user.Name, &user.Age, &user.Gender, &user.FirstName, &user.LastName, &user.Email, &user.Online)
		if err != nil {
			fmt.Println("error rows.scan", err)
			return users, err
		}
		users = append(users, user)
	}
	return users, nil
}

func SortUsers(users []Users, latestMessages []Messages, id int) ([]Users, error) {
	latestMessageTimes := make(map[int]time.Time)

	for _, msg := range latestMessages {
		var otherUserID int
		if msg.Sender_id == id {
			otherUserID = msg.Receiver_id
		} else {
			otherUserID = msg.Sender_id
		}
		if msg.Written_at.After(latestMessageTimes[otherUserID]) {
			latestMessageTimes[otherUserID] = msg.Written_at
		}
	}

	sort.SliceStable(users, func(i, j int) bool {
		timeI, hasTimeI := latestMessageTimes[users[i].Id]
		timeJ, hasTimeJ := latestMessageTimes[users[j].Id]

		if hasTimeI && hasTimeJ {
			return timeI.After(timeJ)
		}
		if hasTimeI {
			return true
		}
		if hasTimeJ {
			return false
		}
		return users[i].Name < users[j].Name
	})

	return users, nil
}

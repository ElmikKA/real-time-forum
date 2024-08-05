package functions

import "fmt"

func ChangeOnline(id int, online int) error {
	query := `UPDATE users SET online = ? WHERE id = ?`
	_, err := Db.Exec(query, online, id)
	if err != nil {
		fmt.Println("error changing online status", err)
		return err
	}
	return err
}

package functions

import "fmt"

func resetOnline() {
	query := `UPDATE users
			SET online = -1`
	_, err := Db.Exec(query)

	if err != nil {
		fmt.Println("error reseting online status", err)
	}

}

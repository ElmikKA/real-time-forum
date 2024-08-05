package functions

import (
	"database/sql"
	"os"

	_ "github.com/mattn/go-sqlite3"
)

// global variable so Db can be accessed anywhere
var Db *sql.DB

func InitDb() error {
	var err error
	Db, err = sql.Open("sqlite3", "./database/forum.db")
	if err != nil {
		return err
	}

	tables, err := os.ReadFile("./database/tables.sql")
	if err != nil {
		return err
	}

	_, err = Db.Exec(string(tables))
	if err != nil {
		return err
	}

	return nil
}

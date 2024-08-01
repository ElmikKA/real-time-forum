package functions

import (
	"database/sql"
	"os"

	_ "github.com/mattn/go-sqlite3"
)

var Db *sql.DB

func InitDb() error {
	db, err := sql.Open("sqlite3", "./database/forum.db")
	if err != nil {
		return err
	}

	tables, err := os.ReadFile("./database/tables.sql")
	if err != nil {
		return err
	}

	_, err = db.Exec(string(tables))
	if err != nil {
		return err
	}

	return nil
}

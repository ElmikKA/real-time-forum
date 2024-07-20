package database

import (
	"database/sql"
	"os"

	_ "github.com/mattn/go-sqlite3"
)

var Db *sql.DB

func InitDb() (*sql.DB, error) {
	db, err := sql.Open("sqlite3", "./database/forum.db")
	if err != nil {
		return nil, err
	}

	tables, err := os.ReadFile("./database/tables.sql")
	if err != nil {
		return nil, err
	}

	_, err = db.Exec(string(tables))
	if err != nil {
		return nil, err
	}

	return db, nil
}

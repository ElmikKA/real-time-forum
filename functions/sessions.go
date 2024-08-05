package functions

import (
	// "RTForum/functions"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/google/uuid"
)

func AddSession(w http.ResponseWriter, r *http.Request, id int) error {
	cookie, err := r.Cookie("session")
	if err != nil {
		// if no cookie is found, creating one
		cookie = &http.Cookie{
			Name:     "session",
			Value:    uuid.New().String(),
			Path:     "/",
			Expires:  time.Now().Add(30 * time.Minute),
			SameSite: http.SameSiteNoneMode,
			Secure:   true,
		}
		// sets the cookie
		http.SetCookie(w, cookie)

		// creates session variable with data from cookie to push to database
		session := Session{
			Id:      id,
			Cookie:  cookie.Value,
			Expires: cookie.Expires,
		}
		// adds session to db
		_, err = CreateSession(session)
		if err != nil {
			fmt.Println("error creating session")
			log.Fatal(err)
		}
	} else {
		// cookie exists

		// checks which session is active with this cookie
		session, err := GetSessionByCookie(cookie.Value)

		if err != nil {
			// no session with that cookie on db

			// overwriting the cookie
			cookie = &http.Cookie{
				Name:     "session",
				Value:    uuid.New().String(),
				Path:     "/",
				Expires:  time.Now().Add(30 * time.Minute),
				SameSite: http.SameSiteNoneMode,
				Secure:   true,
			}
			http.SetCookie(w, cookie)
			session = Session{
				Id:      id,
				Cookie:  cookie.Value,
				Expires: cookie.Expires,
			}

			// adding session to db
			_, err := CreateSession(session)
			if err != nil {
				fmt.Println("error creating session")
				log.Fatal(err)
			}
		} else if session.Id != id {
			// session belongs to a different user

			// deletes the session so a new one can be made with the new user
			DeleteSession(session.Cookie)

			// create new cookie and session
			cookie = &http.Cookie{
				Name:     "session",
				Value:    uuid.New().String(),
				Path:     "/",
				Expires:  time.Now().Add(30 * time.Minute),
				SameSite: http.SameSiteNoneMode,
				Secure:   true,
			}
			http.SetCookie(w, cookie)
			session = Session{
				Id:      id,
				Cookie:  cookie.Value,
				Expires: cookie.Expires,
			}
			_, err = CreateSession(session)
			if err != nil {
				log.Fatal(err)
			}
		}
	}
	return nil
}

func RemoveSession(id int) {
	fmt.Println("removing session with id:", id)
	query := `DELETE FROM sessions WHERE id = ?`
	_, err := Db.Exec(query, id)
	if err != nil {
		fmt.Println("error removing session", err)
	}
}

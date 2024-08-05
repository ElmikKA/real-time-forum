package main

import (
	"RTForum/functions"
	"encoding/json"
	"fmt"

	"github.com/gorilla/websocket"
)

func CloseSocket(conn *websocket.Conn, id int, username string) {

	mu.Lock()
	fmt.Println("leaving connection", connections[conn])
	delete(connections, conn)
	conn.Close()
	err := functions.ChangeOnline(id, -1)
	if err != nil {
		fmt.Println("error changing online status -1", err)
	}
	// send status change to every online user

	for msgConn, value := range connections {
		statusChangeResponse := make(map[string]interface{})
		statusChangeResponse["statusChange"] = true
		statusChangeResponse["username"] = value["username"]
		statusChangeResponse["id"] = value["id"]
		statusChangeResponse["statusChangeUsername"] = username
		statusChangeResponse["statusChangeId"] = id
		statusChangeResponse["online"] = -1

		// msgType := value["messageType"]

		jsonMsg, err := json.Marshal(statusChangeResponse)

		if err != nil {
			fmt.Println("error marshaling", msgConn, err)
		}

		if err := msgConn.WriteMessage(1, jsonMsg); err != nil {
			fmt.Println("error writing message")
		}
	}
	mu.Unlock()
}

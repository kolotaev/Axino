package main

import (
    "fmt"
    "log"
    "net/http"
    "os"
    "math/rand"
)

func main() {
    http.HandleFunc("/static", func(w http.ResponseWriter, r *http.Request) {
        fmt.Fprintf(w, "Hello!")
    })

    http.HandleFunc("/random", func(w http.ResponseWriter, r *http.Request) {
        fmt.Fprintf(w, randomString(50))
    })

    log.Fatal(http.ListenAndServe(":" + os.Getenv("PORT"), nil))
}

func randomString(l int) string {
	randomInt := func(min int, max int) int {
		return min + rand.Intn(max - min)
	}
	bytes := make([]byte, l)
	for i := 0; i < l; i++ {
		bytes[i] = byte(randomInt(65, 90))
	}
	return string(bytes)
}
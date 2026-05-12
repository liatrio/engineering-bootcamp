package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/redis/go-redis/v9"
)

type OrderRequest struct {
	OrderID string          `json:"order_id"`
	Items   json.RawMessage `json:"items"`
}

var rdb *redis.Client

func checkoutHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var order OrderRequest
	if err := json.NewDecoder(r.Body).Decode(&order); err != nil {
		http.Error(w, "invalid JSON", http.StatusBadRequest)
		return
	}

	payload, err := json.Marshal(order)
	if err != nil {
		http.Error(w, "encoding error", http.StatusInternalServerError)
		return
	}

	if err := rdb.RPush(context.Background(), "orders:queue", payload).Err(); err != nil {
		http.Error(w, "failed to enqueue order", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusAccepted)
}

func main() {
	redisAddr := os.Getenv("REDIS_ADDR")
	if redisAddr == "" {
		log.Fatal("REDIS_ADDR environment variable is required")
	}

	rdb = redis.NewClient(&redis.Options{Addr: redisAddr})

	if err := rdb.Ping(context.Background()).Err(); err != nil {
		log.Fatalf("cannot connect to Redis at %s: %v", redisAddr, err)
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	http.HandleFunc("/checkout", checkoutHandler)
	fmt.Printf("checkout-service listening on :%s\n", port)
	log.Fatal(http.ListenAndServe(":"+port, nil))
}

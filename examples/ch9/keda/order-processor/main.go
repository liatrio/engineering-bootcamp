package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"os"
	"strconv"
	"time"

	"github.com/redis/go-redis/v9"
)

type Order struct {
	OrderID string `json:"order_id"`
}

func main() {
	redisAddr := os.Getenv("REDIS_ADDR")
	if redisAddr == "" {
		log.Fatal("REDIS_ADDR environment variable is required")
	}

	delayMs := 500
	if v := os.Getenv("PROCESS_DELAY_MS"); v != "" {
		if d, err := strconv.Atoi(v); err == nil {
			delayMs = d
		}
	}

	rdb := redis.NewClient(&redis.Options{Addr: redisAddr})

	if err := rdb.Ping(context.Background()).Err(); err != nil {
		log.Fatalf("cannot connect to Redis at %s: %v", redisAddr, err)
	}

	log.Printf("order-processor started, delay=%dms", delayMs)

	for {
		results, err := rdb.BLPop(context.Background(), 0, "orders:queue").Result()
		if err != nil {
			log.Printf("BLPOP error: %v", err)
			continue
		}

		payload := results[1]

		var order Order
		if err := json.Unmarshal([]byte(payload), &order); err != nil {
			log.Printf("invalid message: %v", err)
			continue
		}

		deadline := time.Now().Add(time.Duration(delayMs) * time.Millisecond)
		x := 1
		for time.Now().Before(deadline) {
			x += x * x
		}
		_ = x

		fmt.Printf("completed order %s\n", order.OrderID)
	}
}

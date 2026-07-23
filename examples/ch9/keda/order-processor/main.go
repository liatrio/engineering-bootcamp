package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"os"
	//"strconv"
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

	IOMs := 250 // Simulate delay from the IO when processing the order
    CPUMs := 30 // Simulate actual work done by the CPU

	/*if v := os.Getenv("PROCESS_DELAY_MS"); v != "" {
		if d, err := strconv.Atoi(v); err == nil {
			delayMs = d
		}
	}*/

	rdb := redis.NewClient(&redis.Options{Addr: redisAddr})

	if err := rdb.Ping(context.Background()).Err(); err != nil {
		log.Fatalf("cannot connect to Redis at %s: %v", redisAddr, err)
	}

	//log.Printf("order-processor started, delay=%dms", delayMs)

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

        // Fake IO (Read order)
        time.Sleep(time.Duration(IOMs) * time.Millisecond)
        
        // Fake order proccessing work
		deadline := time.Now().Add(time.Duration(CPUMs) * time.Millisecond)
		x := 1
		for time.Now().Before(deadline) {
			x += x * x
		}
		_ = x

        // Fake IO (Write processed order)
        time.Sleep(time.Duration(IOMs) * time.Millisecond)
        
		fmt.Printf("completed order %s\n", order.OrderID)
	}
}

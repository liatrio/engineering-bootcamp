package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strconv"

	_ "github.com/mattn/go-sqlite3"
)

// Global database connection - shared everywhere
var db *sql.DB

type User struct {
	ID    int    `json:"id"`
	Name  string `json:"name"`
	Email string `json:"email"`
}

type Order struct {
	ID      int     `json:"id"`
	UserID  int     `json:"user_id"`
	Product string  `json:"product"`
	Total   float64 `json:"total"`
}

func main() {
	var err error
	// Initialize database
	db, err = sql.Open("sqlite3", "./app.db")
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	// Create tables
	initDB()

	// Setup routes
	http.HandleFunc("/users", handleUsers)
	http.HandleFunc("/users/", handleUserByID)
	http.HandleFunc("/orders", handleOrders)
	http.HandleFunc("/orders/", handleOrderByID)
	http.HandleFunc("/users/orders/", handleUserOrders)

	fmt.Println("Server starting on :8080...")
	log.Fatal(http.ListenAndServe(":8080", nil))
}

func initDB() {
	// Create users table - SQL directly in initialization
	_, err := db.Exec(`
		CREATE TABLE IF NOT EXISTS users (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			name TEXT NOT NULL,
			email TEXT NOT NULL UNIQUE
		)
	`)
	if err != nil {
		log.Fatal(err)
	}

	// Create orders table - more SQL in initialization
	_, err = db.Exec(`
		CREATE TABLE IF NOT EXISTS orders (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			user_id INTEGER NOT NULL,
			product TEXT NOT NULL,
			total REAL NOT NULL,
			FOREIGN KEY(user_id) REFERENCES users(id)
		)
	`)
	if err != nil {
		log.Fatal(err)
	}
}

// Handler with SQL queries embedded directly
func handleUsers(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case "GET":
		// SQL query directly in handler
		rows, err := db.Query("SELECT id, name, email FROM users")
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		defer rows.Close()

		var users []User
		for rows.Next() {
			var u User
			if err := rows.Scan(&u.ID, &u.Name, &u.Email); err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
			users = append(users, u)
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(users)

	case "POST":
		var u User
		if err := json.NewDecoder(r.Body).Decode(&u); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		// Business logic mixed with data access
		if u.Name == "" || u.Email == "" {
			http.Error(w, "name and email required", http.StatusBadRequest)
			return
		}

		// SQL query directly in handler - same pattern repeated
		result, err := db.Exec("INSERT INTO users (name, email) VALUES (?, ?)", u.Name, u.Email)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		id, _ := result.LastInsertId()
		u.ID = int(id)

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusCreated)
		json.NewEncoder(w).Encode(u)

	default:
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}

// Another handler with duplicated query patterns
func handleUserByID(w http.ResponseWriter, r *http.Request) {
	// Extract ID from URL - parsing logic in handler
	id := r.URL.Path[len("/users/"):]
	userID, err := strconv.Atoi(id)
	if err != nil {
		http.Error(w, "Invalid user ID", http.StatusBadRequest)
		return
	}

	switch r.Method {
	case "GET":
		// Same SELECT query pattern as in handleUsers, but duplicated
		var u User
		err := db.QueryRow("SELECT id, name, email FROM users WHERE id = ?", userID).
			Scan(&u.ID, &u.Name, &u.Email)
		if err == sql.ErrNoRows {
			http.Error(w, "User not found", http.StatusNotFound)
			return
		}
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(u)

	case "PUT":
		var u User
		if err := json.NewDecoder(r.Body).Decode(&u); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		// Business logic mixed with data access again
		if u.Name == "" || u.Email == "" {
			http.Error(w, "name and email required", http.StatusBadRequest)
			return
		}

		// SQL UPDATE directly in handler
		_, err = db.Exec("UPDATE users SET name = ?, email = ? WHERE id = ?",
			u.Name, u.Email, userID)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		u.ID = userID
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(u)

	case "DELETE":
		// Yet another SQL query directly in handler
		_, err := db.Exec("DELETE FROM users WHERE id = ?", userID)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusNoContent)

	default:
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}

// Orders handler - more of the same anti-patterns
func handleOrders(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case "GET":
		// Duplicated query pattern - should be abstracted
		rows, err := db.Query("SELECT id, user_id, product, total FROM orders")
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		defer rows.Close()

		var orders []Order
		for rows.Next() {
			var o Order
			if err := rows.Scan(&o.ID, &o.UserID, &o.Product, &o.Total); err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
			orders = append(orders, o)
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(orders)

	case "POST":
		var o Order
		if err := json.NewDecoder(r.Body).Decode(&o); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		// Business logic: validate user exists - SQL query in handler!
		var userExists bool
		err := db.QueryRow("SELECT EXISTS(SELECT 1 FROM users WHERE id = ?)", o.UserID).Scan(&userExists)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		if !userExists {
			http.Error(w, "User not found", http.StatusBadRequest)
			return
		}

		// More business logic mixed with data access
		if o.Product == "" || o.Total <= 0 {
			http.Error(w, "product and positive total required", http.StatusBadRequest)
			return
		}

		// Another INSERT query directly in handler
		result, err := db.Exec("INSERT INTO orders (user_id, product, total) VALUES (?, ?, ?)",
			o.UserID, o.Product, o.Total)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		id, _ := result.LastInsertId()
		o.ID = int(id)

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusCreated)
		json.NewEncoder(w).Encode(o)

	default:
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}

// More duplication and tight coupling
func handleOrderByID(w http.ResponseWriter, r *http.Request) {
	id := r.URL.Path[len("/orders/"):]
	orderID, err := strconv.Atoi(id)
	if err != nil {
		http.Error(w, "Invalid order ID", http.StatusBadRequest)
		return
	}

	switch r.Method {
	case "GET":
		// Same SELECT pattern as handleOrders, duplicated again
		var o Order
		err := db.QueryRow("SELECT id, user_id, product, total FROM orders WHERE id = ?", orderID).
			Scan(&o.ID, &o.UserID, &o.Product, &o.Total)
		if err == sql.ErrNoRows {
			http.Error(w, "Order not found", http.StatusNotFound)
			return
		}
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(o)

	case "DELETE":
		// DELETE query directly in handler
		_, err := db.Exec("DELETE FROM orders WHERE id = ?", orderID)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusNoContent)

	default:
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}

// Complex query mixing concerns - SQL in handler with business logic
func handleUserOrders(w http.ResponseWriter, r *http.Request) {
	id := r.URL.Path[len("/users/orders/"):]
	userID, err := strconv.Atoi(id)
	if err != nil {
		http.Error(w, "Invalid user ID", http.StatusBadRequest)
		return
	}

	// First check if user exists - another duplicated query pattern
	var userExists bool
	err = db.QueryRow("SELECT EXISTS(SELECT 1 FROM users WHERE id = ?)", userID).Scan(&userExists)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	if !userExists {
		http.Error(w, "User not found", http.StatusNotFound)
		return
	}

	// Then get orders - SQL JOIN query directly in handler
	rows, err := db.Query(`
		SELECT o.id, o.user_id, o.product, o.total 
		FROM orders o 
		WHERE o.user_id = ?
	`, userID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var orders []Order
	for rows.Next() {
		var o Order
		if err := rows.Scan(&o.ID, &o.UserID, &o.Product, &o.Total); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		orders = append(orders, o)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(orders)
}

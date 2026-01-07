# Order Management API - Exercise Starter

This is a simple order management system that demonstrates a working but poorly designed application. Your task is to refactor this codebase to improve its design and maintainability.

## What This Application Does

A basic REST API for managing users and orders with the following endpoints:

**Users:**
- `GET /users` - List all users
- `POST /users` - Create a new user
- `GET /users/{id}` - Get a specific user
- `PUT /users/{id}` - Update a user
- `DELETE /users/{id}` - Delete a user

**Orders:**
- `GET /orders` - List all orders
- `POST /orders` - Create a new order
- `GET /orders/{id}` - Get a specific order
- `DELETE /orders/{id}` - Delete an order
- `GET /users/orders/{id}` - Get all orders for a specific user

## Running the Application

### Install Dependencies

```bash
go mod download
```

### Start the Server

```bash
go run main.go
```

The server will start on `http://localhost:8080`

### Example Requests

Create a user:
```bash
curl -X POST http://localhost:8080/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Alice","email":"alice@example.com"}'
```

Create an order:
```bash
curl -X POST http://localhost:8080/orders \
  -H "Content-Type: application/json" \
  -d '{"user_id":1,"product":"Widget","total":29.99}'
```

List all users:
```bash
curl http://localhost:8080/users
```

Get user's orders:
```bash
curl http://localhost:8080/users/orders/1
```

## The Database

The application uses SQLite with a local file database (`app.db`) that is created automatically when you start the server.

## Your Mission

This code works, but it has several design problems that make it difficult to maintain, test, and extend. Your goal is to identify these issues and refactor the code to address them.

Think about:
- How is data being accessed?
- Where is the business logic?
- How would you write tests for this code?
- What would happen if you needed to switch from SQLite to PostgreSQL?
- What patterns of code repetition do you see?

Good luck!

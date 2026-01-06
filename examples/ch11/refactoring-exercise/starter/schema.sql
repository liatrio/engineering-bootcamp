-- E-commerce Order Processing Database Schema
-- SQLite database for order management system

-- Products table
CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    stock_quantity INTEGER NOT NULL DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Customers table
CREATE TABLE IF NOT EXISTS customers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_id INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    payment_type TEXT NOT NULL,
    payment_fee DECIMAL(10, 2) NOT NULL DEFAULT 0,
    shipping_method TEXT NOT NULL,
    shipping_cost DECIMAL(10, 2) NOT NULL,
    shipping_days INTEGER NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    total DECIMAL(10, 2) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id)
);

-- Order items table
CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    price_at_order DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Seed data for products
INSERT INTO products (name, description, price, stock_quantity) VALUES
    ('Laptop Pro 15"', 'High-performance laptop with 16GB RAM', 1299.99, 25),
    ('Wireless Mouse', 'Ergonomic wireless mouse with USB receiver', 29.99, 150),
    ('USB-C Hub', '7-in-1 USB-C hub with HDMI and USB 3.0', 49.99, 75),
    ('Mechanical Keyboard', 'RGB mechanical keyboard with blue switches', 89.99, 50),
    ('Monitor 27"', '4K UHD monitor with HDR support', 399.99, 30),
    ('Laptop Stand', 'Aluminum adjustable laptop stand', 39.99, 100),
    ('Webcam HD', '1080p webcam with built-in microphone', 69.99, 60),
    ('Headphones', 'Noise-cancelling over-ear headphones', 199.99, 40),
    ('External SSD 1TB', 'Portable solid-state drive with USB-C', 129.99, 80),
    ('Desk Lamp', 'LED desk lamp with adjustable brightness', 34.99, 120);

-- Seed data for test customer
INSERT INTO customers (email, first_name, last_name) VALUES
    ('test@example.com', 'Test', 'Customer'),
    ('jane@example.com', 'Jane', 'Doe'),
    ('john@example.com', 'John', 'Smith');

/**
 * Repository Interfaces
 * 
 * Repositories abstract data access, allowing the service layer
 * to work with domain objects without knowing about the database
 */

import { Order, Product, Customer } from '../domain/entities';

export interface OrderRepository {
  save(order: Order): Promise<void>;
  findById(id: number): Promise<Order | null>;
  findByCustomerId(customerId: number): Promise<Order[]>;
}

export interface ProductRepository {
  findById(id: number): Promise<Product | null>;
  updateStock(productId: number, quantity: number): Promise<void>;
}

export interface CustomerRepository {
  findById(id: number): Promise<Customer | null>;
}

/**
 * In-Memory implementations for demo purposes
 */

export class InMemoryOrderRepository implements OrderRepository {
  private orders: Map<number, Order> = new Map();
  
  async save(order: Order): Promise<void> {
    this.orders.set(order.id, order);
  }
  
  async findById(id: number): Promise<Order | null> {
    return this.orders.get(id) || null;
  }
  
  async findByCustomerId(customerId: number): Promise<Order[]> {
    return Array.from(this.orders.values())
      .filter(order => order.customerId === customerId);
  }
}

export class InMemoryProductRepository implements ProductRepository {
  private products: Map<number, Product> = new Map([
    [1, new Product(1, 'Laptop', 999.99, 50)],
    [2, new Product(2, 'Mouse', 29.99, 100)],
    [3, new Product(3, 'Keyboard', 79.99, 75)],
    [4, new Product(4, 'Monitor', 299.99, 30)]
  ]);
  
  async findById(id: number): Promise<Product | null> {
    return this.products.get(id) || null;
  }
  
  async updateStock(productId: number, quantity: number): Promise<void> {
    const product = this.products.get(productId);
    if (product) {
      this.products.set(productId, new Product(
        product.id,
        product.name,
        product.price,
        product.stock + quantity
      ));
    }
  }
}

export class InMemoryCustomerRepository implements CustomerRepository {
  private customers: Map<number, Customer> = new Map([
    [101, new Customer(101, 'Alice Johnson', 'alice@example.com')],
    [102, new Customer(102, 'Bob Smith', 'bob@example.com')],
    [103, new Customer(103, 'Charlie Brown', 'charlie@example.com')]
  ]);
  
  async findById(id: number): Promise<Customer | null> {
    return this.customers.get(id) || null;
  }
}

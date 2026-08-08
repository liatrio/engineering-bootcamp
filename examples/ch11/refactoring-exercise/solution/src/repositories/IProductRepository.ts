import { Product } from '../domain/types';

/**
 * Product Repository Interface
 * Defines data access operations for products
 * Demonstrates Repository Pattern and Dependency Inversion Principle:
 * - Business logic depends on this interface, not concrete implementation
 * - Can swap SQLite for PostgreSQL, MongoDB, or mock implementation
 */
export interface IProductRepository {
  /**
   * Find a product by ID
   * @param id Product ID
   * @returns Product if found, null otherwise
   */
  findById(id: number): Promise<Product | null>;

  /**
   * Update product stock quantity
   * @param id Product ID
   * @param quantityChange Amount to change stock by (negative to decrement)
   * @throws Error if product not found or insufficient stock
   */
  updateStock(id: number, quantityChange: number): Promise<void>;

  /**
   * Check if product has sufficient stock
   * @param id Product ID
   * @param quantity Quantity needed
   * @returns true if enough stock, false otherwise
   */
  checkStock(id: number, quantity: number): Promise<boolean>;
}

import { IProductRepository } from '../repositories/IProductRepository';

/**
 * Inventory Service
 * Handles inventory management operations
 * Demonstrates Single Responsibility Principle - only manages inventory
 */
export class InventoryService {
  constructor(private productRepository: IProductRepository) {}

  /**
   * Check if all items in an order have sufficient stock
   * @param items Array of {product_id, quantity} objects
   * @throws Error if any item has insufficient stock
   */
  async checkAvailability(
    items: Array<{ product_id: number; quantity: number }>
  ): Promise<void> {
    for (const item of items) {
      const product = await this.productRepository.findById(item.product_id);

      if (!product) {
        throw new Error(`Product with id ${item.product_id} not found`);
      }

      if (product.stock_quantity < item.quantity) {
        throw new Error(
          `Insufficient stock for product ${product.name}. ` +
          `Available: ${product.stock_quantity}, Requested: ${item.quantity}`
        );
      }
    }
  }

  /**
   * Decrement stock for multiple items
   * @param items Array of {product_id, quantity} objects
   */
  async decrementStock(
    items: Array<{ product_id: number; quantity: number }>
  ): Promise<void> {
    for (const item of items) {
      await this.productRepository.updateStock(item.product_id, -item.quantity);
    }
  }
}

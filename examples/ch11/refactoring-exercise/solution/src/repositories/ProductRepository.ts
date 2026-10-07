import { Product } from '../domain/types';
import { IProductRepository } from './IProductRepository';
import { dbGet, dbRun } from '../database';

/**
 * SQLite implementation of Product Repository
 * Demonstrates Repository Pattern - encapsulates all data access logic
 */
export class ProductRepository implements IProductRepository {

  async findById(id: number): Promise<Product | null> {
    const product = await dbGet<Product>(
      'SELECT * FROM products WHERE id = ?',
      [id]
    );
    return product || null;
  }

  async updateStock(id: number, quantityChange: number): Promise<void> {
    // Check current stock
    const product = await this.findById(id);
    if (!product) {
      throw new Error(`Product with id ${id} not found`);
    }

    const newStock = product.stock_quantity + quantityChange;
    if (newStock < 0) {
      throw new Error(
        `Insufficient stock for product ${product.name}. ` +
        `Available: ${product.stock_quantity}, Requested: ${Math.abs(quantityChange)}`
      );
    }

    await dbRun(
      'UPDATE products SET stock_quantity = ? WHERE id = ?',
      [newStock, id]
    );
  }

  async checkStock(id: number, quantity: number): Promise<boolean> {
    const product = await this.findById(id);
    if (!product) {
      return false;
    }
    return product.stock_quantity >= quantity;
  }
}

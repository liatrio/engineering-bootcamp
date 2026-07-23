import { Order, OrderItem } from '../domain/types';

/**
 * Order Repository Interface
 * Defines data access operations for orders
 * Demonstrates Repository Pattern and Dependency Inversion Principle
 */
export interface IOrderRepository {
  /**
   * Create a new order
   * @param orderData Order data without ID
   * @returns The created order ID
   */
  create(orderData: Omit<Order, 'id' | 'created_at'>): Promise<number>;

  /**
   * Add items to an order
   * @param orderId Order ID
   * @param items Order items to add
   */
  addItems(orderId: number, items: Omit<OrderItem, 'id' | 'order_id'>[]): Promise<void>;

  /**
   * Find an order by ID
   * @param id Order ID
   * @returns Order if found, null otherwise
   */
  findById(id: number): Promise<Order | null>;

  /**
   * Find order items for an order
   * @param orderId Order ID
   * @returns Array of order items
   */
  findItemsByOrderId(orderId: number): Promise<OrderItem[]>;

  /**
   * Update order status
   * @param id Order ID
   * @param status New status
   */
  updateStatus(id: number, status: string): Promise<void>;
}

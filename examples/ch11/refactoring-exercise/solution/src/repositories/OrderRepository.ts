import { Order, OrderItem } from '../domain/types';
import { IOrderRepository } from './IOrderRepository';
import { dbGet, dbRun, dbAll } from '../database';

/**
 * SQLite implementation of Order Repository
 * Demonstrates Repository Pattern - encapsulates all data access logic
 */
export class OrderRepository implements IOrderRepository {

  async create(orderData: Omit<Order, 'id' | 'created_at'>): Promise<number> {
    const result = await dbRun(
      `INSERT INTO orders 
       (customer_id, status, payment_type, payment_fee, shipping_method, 
        shipping_cost, shipping_days, subtotal, total)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        orderData.customer_id,
        orderData.status,
        orderData.payment_type,
        orderData.payment_fee,
        orderData.shipping_method,
        orderData.shipping_cost,
        orderData.shipping_days,
        orderData.subtotal,
        orderData.total,
      ]
    );
    return result.lastID;
  }

  async addItems(
    orderId: number,
    items: Omit<OrderItem, 'id' | 'order_id'>[]
  ): Promise<void> {
    for (const item of items) {
      await dbRun(
        `INSERT INTO order_items 
         (order_id, product_id, quantity, price_at_order)
         VALUES (?, ?, ?, ?)`,
        [orderId, item.product_id, item.quantity, item.price_at_order]
      );
    }
  }

  async findById(id: number): Promise<Order | null> {
    const order = await dbGet<Order>(
      'SELECT * FROM orders WHERE id = ?',
      [id]
    );
    return order || null;
  }

  async findItemsByOrderId(orderId: number): Promise<OrderItem[]> {
    return await dbAll<OrderItem>(
      'SELECT * FROM order_items WHERE order_id = ?',
      [orderId]
    );
  }

  async updateStatus(id: number, status: string): Promise<void> {
    await dbRun(
      'UPDATE orders SET status = ? WHERE id = ?',
      [status, id]
    );
  }
}

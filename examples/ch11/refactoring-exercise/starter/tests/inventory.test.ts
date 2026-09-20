import request from 'supertest';
import app from '../src/index';
import { dbGet } from '../src/database';
import { Product } from '../src/types';

describe('Inventory Management', () => {
  describe('Stock Availability Checking', () => {
    it('should reject order when insufficient stock', async () => {
      const orderRequest = {
        customer_id: 1,
        items: [
          { product_id: 1, quantity: 1000 }  // Laptop has only 25 in stock
        ],
        payment_type: 'credit_card',
        shipping_method: 'standard'
      };

      const response = await request(app)
        .post('/api/orders')
        .send(orderRequest)
        .expect(400);

      expect(response.body.error).toContain('Insufficient stock');
      expect(response.body.error).toContain('Available: 25');
      expect(response.body.error).toContain('Requested: 1000');
    });

    it('should accept order when stock is exactly sufficient', async () => {
      const orderRequest = {
        customer_id: 1,
        items: [
          { product_id: 2, quantity: 150 }  // Wireless Mouse has exactly 150 in stock
        ],
        payment_type: 'credit_card',
        shipping_method: 'standard'
      };

      const response = await request(app)
        .post('/api/orders')
        .send(orderRequest)
        .expect(201);

      expect(response.body.items[0].quantity).toBe(150);
      expect(response.body.status).toBe('confirmed');
    });

    it('should reject order when any item has insufficient stock', async () => {
      const orderRequest = {
        customer_id: 1,
        items: [
          { product_id: 1, quantity: 5 },    // Laptop - OK (25 available)
          { product_id: 2, quantity: 200 }   // Mouse - NOT OK (150 available)
        ],
        payment_type: 'credit_card',
        shipping_method: 'standard'
      };

      const response = await request(app)
        .post('/api/orders')
        .send(orderRequest)
        .expect(400);

      expect(response.body.error).toContain('Insufficient stock');
      expect(response.body.error).toContain('Wireless Mouse');
    });
  });

  describe('Stock Decrement After Order', () => {
    it('should decrement stock after successful order', async () => {
      // Check initial stock
      const initialProduct = await dbGet<Product>(
        'SELECT * FROM products WHERE id = ?',
        [2]  // Wireless Mouse
      );
      expect(initialProduct?.stock_quantity).toBe(150);

      // Place order
      const orderRequest = {
        customer_id: 1,
        items: [
          { product_id: 2, quantity: 10 }
        ],
        payment_type: 'credit_card',
        shipping_method: 'standard'
      };

      await request(app)
        .post('/api/orders')
        .send(orderRequest)
        .expect(201);

      // Check stock after order
      const updatedProduct = await dbGet<Product>(
        'SELECT * FROM products WHERE id = ?',
        [2]
      );
      expect(updatedProduct?.stock_quantity).toBe(140);  // 150 - 10 = 140
    });

    it('should decrement stock for multiple items in same order', async () => {
      // Check initial stock for both products
      const initialLaptop = await dbGet<Product>(
        'SELECT * FROM products WHERE id = ?',
        [1]
      );
      const initialMouse = await dbGet<Product>(
        'SELECT * FROM products WHERE id = ?',
        [2]
      );
      expect(initialLaptop?.stock_quantity).toBe(25);
      expect(initialMouse?.stock_quantity).toBe(150);

      // Place order with multiple items
      const orderRequest = {
        customer_id: 1,
        items: [
          { product_id: 1, quantity: 3 },
          { product_id: 2, quantity: 20 }
        ],
        payment_type: 'paypal',
        shipping_method: 'express'
      };

      await request(app)
        .post('/api/orders')
        .send(orderRequest)
        .expect(201);

      // Check stock after order
      const updatedLaptop = await dbGet<Product>(
        'SELECT * FROM products WHERE id = ?',
        [1]
      );
      const updatedMouse = await dbGet<Product>(
        'SELECT * FROM products WHERE id = ?',
        [2]
      );
      expect(updatedLaptop?.stock_quantity).toBe(22);   // 25 - 3 = 22
      expect(updatedMouse?.stock_quantity).toBe(130);   // 150 - 20 = 130
    });

    it('should not decrement stock if order fails validation', async () => {
      // Check initial stock
      const initialProduct = await dbGet<Product>(
        'SELECT * FROM products WHERE id = ?',
        [3]
      );
      const initialStock = initialProduct?.stock_quantity;

      // Try to place invalid order (missing customer_id)
      const orderRequest = {
        items: [
          { product_id: 3, quantity: 5 }
        ],
        payment_type: 'credit_card',
        shipping_method: 'standard'
      };

      await request(app)
        .post('/api/orders')
        .send(orderRequest)
        .expect(400);

      // Stock should remain unchanged
      const finalProduct = await dbGet<Product>(
        'SELECT * FROM products WHERE id = ?',
        [3]
      );
      expect(finalProduct?.stock_quantity).toBe(initialStock);
    });

    it('should not decrement stock if product not found', async () => {
      // Try to order non-existent product
      const orderRequest = {
        customer_id: 1,
        items: [
          { product_id: 99999, quantity: 1 }
        ],
        payment_type: 'credit_card',
        shipping_method: 'standard'
      };

      await request(app)
        .post('/api/orders')
        .send(orderRequest)
        .expect(404);

      // No stock should have been decremented
      // (This is more of a sanity check - can't decrement what doesn't exist)
    });
  });

  describe('Multiple Orders and Stock Management', () => {
    it('should handle multiple sequential orders correctly', async () => {
      // First order
      const order1 = {
        customer_id: 1,
        items: [
          { product_id: 4, quantity: 10 }  // Mechanical Keyboard (50 in stock)
        ],
        payment_type: 'credit_card',
        shipping_method: 'standard'
      };

      await request(app)
        .post('/api/orders')
        .send(order1)
        .expect(201);

      // Check stock after first order
      let product = await dbGet<Product>(
        'SELECT * FROM products WHERE id = ?',
        [4]
      );
      expect(product?.stock_quantity).toBe(40);  // 50 - 10 = 40

      // Second order
      const order2 = {
        customer_id: 2,
        items: [
          { product_id: 4, quantity: 15 }
        ],
        payment_type: 'paypal',
        shipping_method: 'express'
      };

      await request(app)
        .post('/api/orders')
        .send(order2)
        .expect(201);

      // Check stock after second order
      product = await dbGet<Product>(
        'SELECT * FROM products WHERE id = ?',
        [4]
      );
      expect(product?.stock_quantity).toBe(25);  // 40 - 15 = 25

      // Third order should be rejected (insufficient stock)
      const order3 = {
        customer_id: 3,
        items: [
          { product_id: 4, quantity: 30 }  // Only 25 left
        ],
        payment_type: 'bitcoin',
        shipping_method: 'overnight'
      };

      await request(app)
        .post('/api/orders')
        .send(order3)
        .expect(400);

      // Stock should remain at 25
      product = await dbGet<Product>(
        'SELECT * FROM products WHERE id = ?',
        [4]
      );
      expect(product?.stock_quantity).toBe(25);
    });
  });

  describe('Edge Cases', () => {
    it('should handle order with quantity of 1 correctly', async () => {
      const initialProduct = await dbGet<Product>(
        'SELECT * FROM products WHERE id = ?',
        [7]  // Webcam HD
      );
      const initialStock = initialProduct?.stock_quantity;

      const orderRequest = {
        customer_id: 1,
        items: [
          { product_id: 7, quantity: 1 }
        ],
        payment_type: 'credit_card',
        shipping_method: 'standard'
      };

      await request(app)
        .post('/api/orders')
        .send(orderRequest)
        .expect(201);

      const finalProduct = await dbGet<Product>(
        'SELECT * FROM products WHERE id = ?',
        [7]
      );
      expect(finalProduct?.stock_quantity).toBe((initialStock || 0) - 1);
    });

    it('should handle large quantity orders correctly', async () => {
      const orderRequest = {
        customer_id: 1,
        items: [
          { product_id: 10, quantity: 100 }  // Desk Lamp (120 in stock)
        ],
        payment_type: 'bitcoin',
        shipping_method: 'standard'
      };

      await request(app)
        .post('/api/orders')
        .send(orderRequest)
        .expect(201);

      const product = await dbGet<Product>(
        'SELECT * FROM products WHERE id = ?',
        [10]
      );
      expect(product?.stock_quantity).toBe(20);  // 120 - 100 = 20
    });
  });
});

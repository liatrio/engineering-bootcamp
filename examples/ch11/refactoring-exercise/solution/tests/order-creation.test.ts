import request from 'supertest';
import app from '../src/index';

describe('Order Creation Workflow', () => {
  describe('POST /api/orders - Valid Order Creation', () => {
    it('should create an order with a single item', async () => {
      const orderRequest = {
        customer_id: 1,
        items: [
          { product_id: 1, quantity: 2 }  // Laptop Pro 15" at $1299.99 each
        ],
        payment_type: 'credit_card',
        shipping_method: 'standard'
      };

      const response = await request(app)
        .post('/api/orders')
        .send(orderRequest)
        .expect(201);

      expect(response.body).toHaveProperty('order_id');
      expect(response.body.order_id).toBeGreaterThan(0);
      expect(response.body.customer_id).toBe(1);
      expect(response.body.status).toBe('confirmed');
      expect(response.body.items).toHaveLength(1);
      expect(response.body.items[0].product_id).toBe(1);
      expect(response.body.items[0].quantity).toBe(2);
    });

    it('should create an order with multiple items', async () => {
      const orderRequest = {
        customer_id: 1,
        items: [
          { product_id: 1, quantity: 1 },  // Laptop Pro
          { product_id: 2, quantity: 2 },  // Wireless Mouse
          { product_id: 3, quantity: 1 }   // USB-C Hub
        ],
        payment_type: 'paypal',
        shipping_method: 'express'
      };

      const response = await request(app)
        .post('/api/orders')
        .send(orderRequest)
        .expect(201);

      expect(response.body).toHaveProperty('order_id');
      expect(response.body.items).toHaveLength(3);
      expect(response.body.status).toBe('confirmed');
    });

    it('should calculate correct subtotal for order', async () => {
      const orderRequest = {
        customer_id: 1,
        items: [
          { product_id: 2, quantity: 3 }  // Wireless Mouse at $29.99 each
        ],
        payment_type: 'credit_card',
        shipping_method: 'standard'
      };

      const response = await request(app)
        .post('/api/orders')
        .send(orderRequest)
        .expect(201);

      // 3 × $29.99 = $89.97
      expect(response.body.subtotal).toBe(89.97);
    });

    it('should calculate correct total including fees and shipping', async () => {
      const orderRequest = {
        customer_id: 1,
        items: [
          { product_id: 2, quantity: 1 }  // $29.99
        ],
        payment_type: 'credit_card',  // 3% fee = $0.90
        shipping_method: 'standard'    // $5.99
      };

      const response = await request(app)
        .post('/api/orders')
        .send(orderRequest)
        .expect(201);

      expect(response.body.subtotal).toBe(29.99);
      expect(response.body.payment_fee).toBe(0.90);
      expect(response.body.shipping_cost).toBe(5.99);
      // Total: $29.99 + $0.90 + $5.99 = $36.88
      expect(response.body.total).toBe(36.88);
    });
  });

  describe('POST /api/orders - Validation Errors', () => {
    it('should reject order without customer_id', async () => {
      const orderRequest = {
        items: [{ product_id: 1, quantity: 1 }],
        payment_type: 'credit_card',
        shipping_method: 'standard'
      };

      const response = await request(app)
        .post('/api/orders')
        .send(orderRequest)
        .expect(400);

      expect(response.body.error).toContain('customer_id');
    });

    it('should reject order with empty items array', async () => {
      const orderRequest = {
        customer_id: 1,
        items: [],
        payment_type: 'credit_card',
        shipping_method: 'standard'
      };

      const response = await request(app)
        .post('/api/orders')
        .send(orderRequest)
        .expect(400);

      expect(response.body.error).toContain('items');
    });

    it('should reject order with invalid product_id', async () => {
      const orderRequest = {
        customer_id: 1,
        items: [{ product_id: 'invalid', quantity: 1 }],
        payment_type: 'credit_card',
        shipping_method: 'standard'
      };

      const response = await request(app)
        .post('/api/orders')
        .send(orderRequest)
        .expect(400);

      expect(response.body.error).toContain('product_id');
    });

    it('should reject order with zero or negative quantity', async () => {
      const orderRequest = {
        customer_id: 1,
        items: [{ product_id: 1, quantity: 0 }],
        payment_type: 'credit_card',
        shipping_method: 'standard'
      };

      const response = await request(app)
        .post('/api/orders')
        .send(orderRequest)
        .expect(400);

      expect(response.body.error).toContain('quantity');
    });

    it('should reject order with non-existent customer', async () => {
      const orderRequest = {
        customer_id: 99999,
        items: [{ product_id: 1, quantity: 1 }],
        payment_type: 'credit_card',
        shipping_method: 'standard'
      };

      const response = await request(app)
        .post('/api/orders')
        .send(orderRequest)
        .expect(404);

      expect(response.body.error).toContain('Customer not found');
    });

    it('should reject order with non-existent product', async () => {
      const orderRequest = {
        customer_id: 1,
        items: [{ product_id: 99999, quantity: 1 }],
        payment_type: 'credit_card',
        shipping_method: 'standard'
      };

      const response = await request(app)
        .post('/api/orders')
        .send(orderRequest)
        .expect(404);

      expect(response.body.error).toContain('Product');
      expect(response.body.error).toContain('not found');
    });

    it('should reject order with invalid payment type', async () => {
      const orderRequest = {
        customer_id: 1,
        items: [{ product_id: 1, quantity: 1 }],
        payment_type: 'invalid_payment',
        shipping_method: 'standard'
      };

      const response = await request(app)
        .post('/api/orders')
        .send(orderRequest)
        .expect(400);

      expect(response.body.error).toContain('payment_type');
    });

    it('should reject order with invalid shipping method', async () => {
      const orderRequest = {
        customer_id: 1,
        items: [{ product_id: 1, quantity: 1 }],
        payment_type: 'credit_card',
        shipping_method: 'invalid_shipping'
      };

      const response = await request(app)
        .post('/api/orders')
        .send(orderRequest)
        .expect(400);

      expect(response.body.error).toContain('shipping_method');
    });
  });

  describe('GET /api/orders/:id - Retrieve Order', () => {
    it('should retrieve a created order by ID', async () => {
      // First create an order
      const orderRequest = {
        customer_id: 1,
        items: [{ product_id: 1, quantity: 1 }],
        payment_type: 'credit_card',
        shipping_method: 'standard'
      };

      const createResponse = await request(app)
        .post('/api/orders')
        .send(orderRequest)
        .expect(201);

      const orderId = createResponse.body.order_id;

      // Now retrieve it
      const getResponse = await request(app)
        .get(`/api/orders/${orderId}`)
        .expect(200);

      expect(getResponse.body.id).toBe(orderId);
      expect(getResponse.body.customer_id).toBe(1);
      expect(getResponse.body.status).toBe('confirmed');
      expect(getResponse.body.items).toBeDefined();
      expect(getResponse.body.items.length).toBeGreaterThan(0);
    });

    it('should return 404 for non-existent order', async () => {
      const response = await request(app)
        .get('/api/orders/99999')
        .expect(404);

      expect(response.body.error).toContain('Order not found');
    });

    it('should return 400 for invalid order ID format', async () => {
      const response = await request(app)
        .get('/api/orders/invalid')
        .expect(400);

      expect(response.body.error).toContain('Invalid order ID');
    });
  });
});

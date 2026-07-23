import request from 'supertest';
import app from '../src/index';

describe('Payment Processing', () => {
  describe('Credit Card Payment (3% fee)', () => {
    it('should apply 3% fee for credit card payments', async () => {
      const orderRequest = {
        customer_id: 1,
        items: [
          { product_id: 2, quantity: 1 }  // $29.99
        ],
        payment_type: 'credit_card',
        shipping_method: 'standard'
      };

      const response = await request(app)
        .post('/api/orders')
        .send(orderRequest)
        .expect(201);

      // 3% of $29.99 = $0.8997, rounded to $0.90
      expect(response.body.payment_fee).toBe(0.90);
      expect(response.body.subtotal).toBe(29.99);
    });

    it('should calculate 3% fee correctly for larger amounts', async () => {
      const orderRequest = {
        customer_id: 1,
        items: [
          { product_id: 1, quantity: 2 }  // 2 × $1299.99 = $2599.98
        ],
        payment_type: 'credit_card',
        shipping_method: 'standard'
      };

      const response = await request(app)
        .post('/api/orders')
        .send(orderRequest)
        .expect(201);

      expect(response.body.subtotal).toBe(2599.98);
      // 3% of $2599.98 = $77.9994, rounded to $78.00
      expect(response.body.payment_fee).toBe(78.00);
    });
  });

  describe('PayPal Payment (3.5% fee)', () => {
    it('should apply 3.5% fee for PayPal payments', async () => {
      const orderRequest = {
        customer_id: 1,
        items: [
          { product_id: 2, quantity: 1 }  // $29.99
        ],
        payment_type: 'paypal',
        shipping_method: 'standard'
      };

      const response = await request(app)
        .post('/api/orders')
        .send(orderRequest)
        .expect(201);

      // 3.5% of $29.99 = $1.04965, rounded to $1.05
      expect(response.body.payment_fee).toBe(1.05);
      expect(response.body.subtotal).toBe(29.99);
    });

    it('should calculate 3.5% fee correctly for larger amounts', async () => {
      const orderRequest = {
        customer_id: 1,
        items: [
          { product_id: 5, quantity: 3 }  // 3 × $399.99 = $1199.97
        ],
        payment_type: 'paypal',
        shipping_method: 'express'
      };

      const response = await request(app)
        .post('/api/orders')
        .send(orderRequest)
        .expect(201);

      expect(response.body.subtotal).toBe(1199.97);
      // 3.5% of $1199.97 = $41.99895, rounded to $42.00
      expect(response.body.payment_fee).toBe(42.00);
    });
  });

  describe('Bitcoin Payment ($1.50 flat fee)', () => {
    it('should apply flat $1.50 fee for Bitcoin payments', async () => {
      const orderRequest = {
        customer_id: 1,
        items: [
          { product_id: 2, quantity: 1 }  // $29.99
        ],
        payment_type: 'bitcoin',
        shipping_method: 'standard'
      };

      const response = await request(app)
        .post('/api/orders')
        .send(orderRequest)
        .expect(201);

      expect(response.body.payment_fee).toBe(1.50);
      expect(response.body.subtotal).toBe(29.99);
    });

    it('should apply same flat fee regardless of order size', async () => {
      const orderRequest = {
        customer_id: 1,
        items: [
          { product_id: 1, quantity: 5 }  // 5 × $1299.99 = $6499.95
        ],
        payment_type: 'bitcoin',
        shipping_method: 'overnight'
      };

      const response = await request(app)
        .post('/api/orders')
        .send(orderRequest)
        .expect(201);

      expect(response.body.subtotal).toBe(6499.95);
      // Flat fee is always $1.50 for Bitcoin, regardless of amount
      expect(response.body.payment_fee).toBe(1.50);
    });

    it('should make bitcoin cheaper than percentage fees for large orders', async () => {
      const orderRequest = {
        customer_id: 1,
        items: [
          { product_id: 5, quantity: 10 }  // 10 × $399.99 = $3999.90
        ],
        payment_type: 'bitcoin',
        shipping_method: 'standard'
      };

      const response = await request(app)
        .post('/api/orders')
        .send(orderRequest)
        .expect(201);

      expect(response.body.subtotal).toBe(3999.90);
      expect(response.body.payment_fee).toBe(1.50);
      // Note: Credit card would be ~$120, PayPal would be ~$140, Bitcoin is $1.50
    });
  });

  describe('Invalid Payment Type', () => {
    it('should reject unsupported payment types', async () => {
      const orderRequest = {
        customer_id: 1,
        items: [
          { product_id: 1, quantity: 1 }
        ],
        payment_type: 'apple_pay',  // Not supported
        shipping_method: 'standard'
      };

      const response = await request(app)
        .post('/api/orders')
        .send(orderRequest)
        .expect(400);

      expect(response.body.error).toContain('payment_type');
    });

    it('should reject missing payment type', async () => {
      const orderRequest = {
        customer_id: 1,
        items: [
          { product_id: 1, quantity: 1 }
        ],
        shipping_method: 'standard'
      };

      const response = await request(app)
        .post('/api/orders')
        .send(orderRequest)
        .expect(400);

      expect(response.body.error).toContain('payment_type');
    });
  });

  describe('Total Calculation with Different Payment Methods', () => {
    it('should calculate total correctly with credit card', async () => {
      const orderRequest = {
        customer_id: 1,
        items: [
          { product_id: 3, quantity: 2 }  // 2 × $49.99 = $99.98
        ],
        payment_type: 'credit_card',  // 3% = $3.00
        shipping_method: 'express'      // $12.99
      };

      const response = await request(app)
        .post('/api/orders')
        .send(orderRequest)
        .expect(201);

      expect(response.body.subtotal).toBe(99.98);
      expect(response.body.payment_fee).toBe(3.00);
      expect(response.body.shipping_cost).toBe(12.99);
      // Total: $99.98 + $3.00 + $12.99 = $115.97
      expect(response.body.total).toBe(115.97);
    });

    it('should calculate total correctly with PayPal', async () => {
      const orderRequest = {
        customer_id: 1,
        items: [
          { product_id: 3, quantity: 2 }  // 2 × $49.99 = $99.98
        ],
        payment_type: 'paypal',     // 3.5% = $3.50
        shipping_method: 'express'   // $12.99
      };

      const response = await request(app)
        .post('/api/orders')
        .send(orderRequest)
        .expect(201);

      expect(response.body.subtotal).toBe(99.98);
      expect(response.body.payment_fee).toBe(3.50);
      expect(response.body.shipping_cost).toBe(12.99);
      // Total: $99.98 + $3.50 + $12.99 = $116.47
      expect(response.body.total).toBe(116.47);
    });

    it('should calculate total correctly with Bitcoin', async () => {
      const orderRequest = {
        customer_id: 1,
        items: [
          { product_id: 3, quantity: 2 }  // 2 × $49.99 = $99.98
        ],
        payment_type: 'bitcoin',    // $1.50
        shipping_method: 'express'   // $12.99
      };

      const response = await request(app)
        .post('/api/orders')
        .send(orderRequest)
        .expect(201);

      expect(response.body.subtotal).toBe(99.98);
      expect(response.body.payment_fee).toBe(1.50);
      expect(response.body.shipping_cost).toBe(12.99);
      // Total: $99.98 + $1.50 + $12.99 = $114.47
      expect(response.body.total).toBe(114.47);
    });
  });
});

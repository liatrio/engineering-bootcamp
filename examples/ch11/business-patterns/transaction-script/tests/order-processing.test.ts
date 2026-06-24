import {
  processOrder,
  validateOrder,
  calculateSubtotal,
  calculateDiscount,
  getOrderById,
  getCustomerOrders,
  OrderData,
  OrderItem
} from '../src/order-processing';

describe('Transaction Script - Order Processing', () => {
  
  describe('validateOrder', () => {
    it('should accept valid order', () => {
      const validOrder: OrderData = {
        customerId: 1,
        customerName: 'Test User',
        items: [
          { productId: 1, productName: 'Product', price: 10, quantity: 1 }
        ]
      };
      
      expect(() => validateOrder(validOrder)).not.toThrow();
    });
    
    it('should reject order without customer ID', () => {
      const invalidOrder: OrderData = {
        customerId: 0,
        customerName: 'Test User',
        items: [
          { productId: 1, productName: 'Product', price: 10, quantity: 1 }
        ]
      };
      
      expect(() => validateOrder(invalidOrder)).toThrow('Customer ID is required');
    });
    
    it('should reject order without items', () => {
      const invalidOrder: OrderData = {
        customerId: 1,
        customerName: 'Test User',
        items: []
      };
      
      expect(() => validateOrder(invalidOrder)).toThrow('Order must have at least one item');
    });
    
    it('should reject order with invalid quantity', () => {
      const invalidOrder: OrderData = {
        customerId: 1,
        customerName: 'Test User',
        items: [
          { productId: 1, productName: 'Product', price: 10, quantity: 0 }
        ]
      };
      
      expect(() => validateOrder(invalidOrder)).toThrow('Invalid quantity');
    });
  });
  
  describe('calculateSubtotal', () => {
    it('should calculate subtotal for single item', () => {
      const items: OrderItem[] = [
        { productId: 1, productName: 'Product', price: 10.50, quantity: 2 }
      ];
      
      expect(calculateSubtotal(items)).toBe(21.00);
    });
    
    it('should calculate subtotal for multiple items', () => {
      const items: OrderItem[] = [
        { productId: 1, productName: 'Product A', price: 10.00, quantity: 2 },
        { productId: 2, productName: 'Product B', price: 5.00, quantity: 3 }
      ];
      
      expect(calculateSubtotal(items)).toBe(35.00);
    });
    
    it('should return 0 for empty items', () => {
      expect(calculateSubtotal([])).toBe(0);
    });
  });
  
  describe('calculateDiscount', () => {
    it('should return 0 when no coupon provided', () => {
      expect(calculateDiscount(100)).toBe(0);
    });
    
    it('should apply SAVE10 coupon correctly', () => {
      expect(calculateDiscount(100, 'SAVE10')).toBe(10);
    });
    
    it('should apply SAVE20 coupon correctly', () => {
      expect(calculateDiscount(100, 'SAVE20')).toBe(20);
    });
    
    it('should apply WELCOME coupon correctly', () => {
      expect(calculateDiscount(100, 'WELCOME')).toBe(15);
    });
    
    it('should return 0 for invalid coupon', () => {
      expect(calculateDiscount(100, 'INVALID')).toBe(0);
    });
    
    it('should be case insensitive', () => {
      expect(calculateDiscount(100, 'save10')).toBe(10);
    });
  });
  
  describe('processOrder', () => {
    it('should process valid order and return processed order', () => {
      const orderData: OrderData = {
        customerId: 1,
        customerName: 'Test User',
        items: [
          { productId: 1, productName: 'Product', price: 50, quantity: 2 }
        ]
      };
      
      const result = processOrder(orderData);
      
      expect(result.orderId).toBeGreaterThan(0);
      expect(result.customerId).toBe(1);
      expect(result.subtotal).toBe(100);
      expect(result.total).toBe(100);
    });
    
    it('should apply discount when coupon provided', () => {
      const orderData: OrderData = {
        customerId: 2,
        customerName: 'Test User 2',
        items: [
          { productId: 1, productName: 'Product', price: 50, quantity: 2 }
        ],
        couponCode: 'SAVE20'
      };
      
      const result = processOrder(orderData);
      
      expect(result.subtotal).toBe(100);
      expect(result.discount).toBe(20);
      expect(result.total).toBe(80);
    });
    
    it('should be retrievable after processing', () => {
      const orderData: OrderData = {
        customerId: 3,
        customerName: 'Test User 3',
        items: [
          { productId: 1, productName: 'Product', price: 10, quantity: 1 }
        ]
      };
      
      const result = processOrder(orderData);
      const retrieved = getOrderById(result.orderId);
      
      expect(retrieved).toBeDefined();
      expect(retrieved?.orderId).toBe(result.orderId);
    });
  });
  
  describe('getCustomerOrders', () => {
    it('should return all orders for a customer', () => {
      const customerId = 999;
      
      // Create multiple orders
      processOrder({
        customerId,
        customerName: 'Multi Order User',
        items: [{ productId: 1, productName: 'P1', price: 10, quantity: 1 }]
      });
      
      processOrder({
        customerId,
        customerName: 'Multi Order User',
        items: [{ productId: 2, productName: 'P2', price: 20, quantity: 1 }]
      });
      
      const orders = getCustomerOrders(customerId);
      
      expect(orders.length).toBeGreaterThanOrEqual(2);
      orders.forEach(order => {
        expect(order.customerId).toBe(customerId);
      });
    });
  });
});
